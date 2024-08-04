import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { ISecurityGroup, IVpc, Peer, Port, SecurityGroup, SubnetSelection, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import 'dotenv/config';


export class DbNetProps extends Construct {
    public readonly vpc: IVpc
    public readonly dbPublicSecurityGroup: ISecurityGroup
    public readonly dbPrivateSecurityGroup: ISecurityGroup
    public secret: Secret;

    constructor(scope: Construct, id: string) {
      super(scope, id)
    
      this.vpc = Vpc.fromLookup(this, 'DefaultVpc', {
          isDefault: true,
      })
    
      const dbPublicSecurityGroup = new SecurityGroup(this, 'CartDBPublicSecurityGroup', {
        allowAllOutbound: true,
        vpc: this.vpc,
      });
      dbPublicSecurityGroup.addIngressRule(
        Peer.anyIpv4(),
        Port.tcp(Number(process.env.PGPORT)),
        'Allow request from internet',
        false,
      );
      this.dbPublicSecurityGroup = dbPublicSecurityGroup;

      const dbPrivateSecurityGroup = new SecurityGroup(this, 'CartDBPrivateSecurityGroup', {
        vpc: this.vpc,
      })
      this.dbPrivateSecurityGroup = dbPrivateSecurityGroup;

    }

    vpcSubnets(): SubnetSelection {
      return { subnets: this.vpc.publicSubnets }
    }
}

export class NetStack extends Stack {
    public readonly dbNetProps: DbNetProps;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const dbNetProps = new DbNetProps(this, 'CartDbNetProps')

        this.dbNetProps = dbNetProps

    }
}


