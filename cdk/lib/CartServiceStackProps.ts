import { Construct } from "constructs";
import { StackProps } from "aws-cdk-lib";
import { ISecurityGroup, IVpc, SubnetSelection } from "aws-cdk-lib/aws-ec2";
import 'dotenv/config';


type Stage = "development" | "production";
export const stage = (process.env.STAGE || "development") as Stage;

export interface CartServiceStackProps extends StackProps {
    readonly stage?: Stage;
    readonly vpc?: IVpc;
    readonly vpcSubnets?: SubnetSelection,
    readonly dbSecurityGroup?: ISecurityGroup, 
}
