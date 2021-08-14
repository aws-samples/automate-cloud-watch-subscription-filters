import { Construct } from '@aws-cdk/core'
import { Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam'

export const CreateFirehoseRole = (scope: Construct, id: string, props: any): Role => {
  const policyDocument = new PolicyDocument({
    statements: [
      new PolicyStatement({
        resources: [props.bucketARN, `${props.bucketARN}/*`],
        actions: [
          's3:AbortMultipartUpload',
          's3:GetBucketLocation',
          's3:GetObject',
          's3:ListBucket',
          's3:ListBucketMultipartUploads',
          's3:PutObject'
        ],
        effect: Effect.ALLOW
      })
    ]
  })

  const firehoseDeliveryRole = new Role(scope, id, {
    description: 'Role used by firehose',
    roleName: id,
    assumedBy: new ServicePrincipal('firehose.amazonaws.com'),
    inlinePolicies: {
      firehosePolicy: policyDocument
    }
  })

  return firehoseDeliveryRole
}
