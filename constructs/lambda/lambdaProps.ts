import { PolicyStatement, IManagedPolicy } from '@aws-cdk/aws-iam'
import { Permission } from '@aws-cdk/aws-lambda'
import { Duration } from '@aws-cdk/core'

export interface LambdaProps {
  functionIdentity: string;
  functionName: string;
  functionRoleDescription: string;
  functionRoleName: string;
  code: string;
  handler: string;
  memorySize?: number;
  permissions?: Permission[];
  policyStatements?: PolicyStatement[];
  managedPolicies?: IManagedPolicy[];
  environment?: { [key: string]: string } | undefined;
  timeout?: Duration;
}
