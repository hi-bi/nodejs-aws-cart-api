import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stage } from '../bin/cdk';


export interface cartServiceStackProps extends cdk.StackProps {
  stage: Stage,
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cartServiceStackProps) {
    super(scope, id, props);
    
    const {stage, stackName} = props;

    const cartServiceLambda = new lambda.Function(this, `cart-service-handler-${stage}`, {
      runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
      code: lambda.Code.fromAsset('../dist'), // Points to the lambda directory
      handler: 'main.handler', // Points to the 'cartServiceLambda' file in the asset directory
      logRetention: RetentionDays.FIVE_DAYS,
      description: 'Cart Service lambda deploying',
      memorySize: 256,
      functionName: `cart-service-api-handler-${stage}`,
      currentVersionOptions: {},
      timeout: Duration.seconds(10),
      environment: {
        PGHOST: process.env.PGHOST!,
        PGPORT: process.env.PGPORT!,
        PGDATABASE: process.env.PGDATABASE!,
        PGUSER: process.env.PGUSER!,
        PGPASSWORD: process.env.PGPASSWORD!,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['rds:*'],
          resources: ['*']
        })
      ],
    });

    const cartServiceApiGateway = new apigateway.LambdaRestApi(this, `cart-service-api-gateway-${stage}`, {
      description: 'Cart service api',
      cloudWatchRole: true,
      handler: cartServiceLambda,
      restApiName: `cart-service-rest-api-${stage}`,
      deploy: true,
      proxy: true,
      binaryMediaTypes: ["*/*"],
      deployOptions: {
        stageName: 'development'
      }
    });


    new CfnOutput(this, `cartServiceLambdaOtput`,
      {
          value: cartServiceLambda.functionArn,
      }
    );
  }
}
