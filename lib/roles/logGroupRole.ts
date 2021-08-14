import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Construct, StackProps } from '@aws-cdk/core'

export function CreateLogGroupRole (scope: Construct, id: string, props: StackProps): Role {
  const policyDocument = new PolicyDocument({
    statements: [
      new PolicyStatement({
        resources: [
          `arn:aws:firehose:${props.env?.region}:${props.env?.account}:deliverystream/logging_firehose`
        ],
        actions: ['firehose:PutRecord', 'firehose:PutRecordBatch'],
        effect: Effect.ALLOW
      })
    ]
  })

  const logGroupRole = new Role(scope, id, {
    description: 'Role used by log group to put record into firehose',
    roleName: id,
    assumedBy: new ServicePrincipal('logs.amazonaws.com'),
    inlinePolicies: {
      firehosePolicy: policyDocument
    }
  })

  return logGroupRole
}
