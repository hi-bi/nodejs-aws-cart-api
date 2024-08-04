#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartServiceStack } from '../lib/CartServiceStack';
import { NetStack } from '../lib/DbNetStack';
import { stage } from '../lib/CartServiceStackProps';
import 'dotenv/config';


const app = new cdk.App();

const pgRdsStack = new NetStack(app, 'CartDbNetStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  description: 'Car DB communication stack',
});


new CartServiceStack(app, 'CartServiceStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  stage: stage,
  description: 'Cart Service stack',
  vpc: pgRdsStack.dbNetProps.vpc,
  vpcSubnets: pgRdsStack.dbNetProps.vpcSubnets(),
  dbSecurityGroup: pgRdsStack.dbNetProps.dbPrivateSecurityGroup,
});


app.synth();