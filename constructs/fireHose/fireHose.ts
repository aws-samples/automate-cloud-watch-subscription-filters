import { Construct } from '@aws-cdk/core'
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose'
import { FirehoseProps } from './FirehoseProps'
export class Firehose extends Construct {
  constructor (scope: Construct, id: string, props: FirehoseProps) {
    super(scope, id)
    new CfnDeliveryStream(this, id, {
      deliveryStreamName: id,
      deliveryStreamType: 'DirectPut',
      s3DestinationConfiguration: {
        bucketArn: props.loggingBucket.bucketArn,
        roleArn: props.role.roleArn,
        compressionFormat: 'ZIP',
        encryptionConfiguration: {
          kmsEncryptionConfig: {
            awskmsKeyArn: `arn:aws:kms:${props.region}:${props.account}:key/${process.env.S3_KMS_KEY_ID}`
          }
        }
      }
    })
  }
}
