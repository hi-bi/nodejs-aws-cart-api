import { Construct } from 'constructs';
import { RemovalPolicy, Stack} from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Cors, LambdaIntegration, LambdaRestApi, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CartServiceStackProps } from './CartServiceStackProps';

import 'dotenv/config';

    export class CartServiceStack extends Stack {
      constructor(scope: Construct, id: string, props?: CartServiceStackProps) {
        super(scope, id, props);

        const lambdaSecurityGroup = new SecurityGroup(this, 'CartLambdaSecurityGroup', {
          vpc: props?.vpc!,
        });

        const cartServiceLambda = new lambda.Function(this, 'CartServiceHandler', {
          runtime: lambda.Runtime.NODEJS_20_X, // Choose any supported Node.js runtime
          code: lambda.Code.fromAsset('../dist'), // Points to the lambda directory
          handler: 'main.handler', // Points to the 'cartServiceLambda' file in the asset directory
          //code: lambda.Code.fromAsset('dist/test-service/lambdas'), // Points to the lambda directory
          //handler: 'test.handler', // Points to the 'cartServiceLambda' file in the asset directory
          logRetention: RetentionDays.FIVE_DAYS,
          description: 'Cart Service lambda',
          memorySize: 128,
          functionName: 'CartService',
          //currentVersionOptions: {},
          timeout: Duration.seconds(10),
          environment: {
            PGHOST: process.env.PGHOST!,
            PGPORT: process.env.PGPORT!,
            PGDATABASE: process.env.PGDATABASE!,
            PGUSER: process.env.PGUSER!,
            PGPASSWORD: process.env.PGPASSWORD!,
          },
          vpc: props?.vpc,
          vpcSubnets: props?.vpcSubnets,
          securityGroups: [lambdaSecurityGroup],
          allowPublicSubnet: true,
        
          initialPolicy: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['ec2:*'],
              resources: ['*']
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['rds-db:connect'],
              resources: ['*']
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['rds:*'],
              resources: ['*']
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['lambda:*'],
              resources: ['*']
            }),
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['iam:*'],
              resources: ['*']
            }),
          ],

        });

        const cartServiceApiGateway = new LambdaRestApi (this, 'CartServiceLambdaAPIGateway', {
          description: 'Cart service api',
          cloudWatchRole: true,
          handler: cartServiceLambda,
          restApiName: 'CartServiceLambdaAPIGateway',
          proxy: true,
          //binaryMediaTypes: ["*/*"],
          //deploy: false,
          //deployOptions: {
          //  stageName: props?.stage,
          //}
        });

/*
        const cartServiceApi = new RestApi(this, 'CartServiceLambdaAPIGateway',
          {
            description: 'Cart Service API Gateway',
            cloudWatchRole: true,
            cloudWatchRoleRemovalPolicy: RemovalPolicy.DESTROY,
          }
        )
        const proxy = cartServiceApi.root.addResource('{proxy+}')
        proxy.addMethod('ANY', new LambdaIntegration(cartServiceLambda))
        proxy.addCorsPreflight({
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
          allowHeaders: Cors.DEFAULT_HEADERS
        })
*/

        new CfnOutput(this, `CartServiceLambdaOtput`,
          {
              value: cartServiceLambda.functionArn,
          }
        );


      }
    }
