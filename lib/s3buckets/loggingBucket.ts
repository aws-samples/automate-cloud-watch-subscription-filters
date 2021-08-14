import { Construct, RemovalPolicy } from '@aws-cdk/core'
import { Bucket, BucketEncryption, BlockPublicAccess } from '@aws-cdk/aws-s3'

export const CreateLoggingBucket = (scope: Construct, id: string): Bucket => {
  const bucket = new Bucket(scope, id, {
    bucketName: id,
    encryption: BucketEncryption.KMS_MANAGED,
    blockPublicAccess: new BlockPublicAccess(BlockPublicAccess.BLOCK_ALL),
    removalPolicy: RemovalPolicy.DESTROY
  })
  return bucket
}
