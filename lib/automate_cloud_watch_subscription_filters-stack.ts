import * as cdk from '@aws-cdk/core'
import { CreateEventBusRule } from './eventbus/eventRule'
import { CreateLoggingFirehose } from './firehoses/loggingFirehose'
import { CreateAddLogGroupSubLambdas } from './lambdas/AddLogGroupSub'
import { CreateFirehoseRole } from './roles/firehoseRole'
import { CreateLogGroupRole } from './roles/LogGroupRole'
import { CreateLoggingBucket } from './s3buckets/loggingBucket'

export class AutomateCloudWatchSubscriptionFiltersStack extends cdk.Stack {
  constructor (scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    if (process.env.S3_KMS_KEY_ID && process.env.S3_BUCKET_NAME) {
      super(scope, id, props)
      CreateEventBusRule(this, 'create_log_group_er', props!)
      const s3Bucket = CreateLoggingBucket(this, process.env.S3_BUCKET_NAME)
      const firehoseRole = CreateFirehoseRole(this, 'firehose_role', { bucketARN: s3Bucket.bucketArn })
      CreateLogGroupRole(this, 'log_group_role', props!)
      CreateLoggingFirehose(this, 'logging_firehose', props!, s3Bucket, firehoseRole)
      CreateAddLogGroupSubLambdas(this, props!)
    } else {
      throw new Error('Please set the value of S3_KMS_KEY_ID and S3_BUCKET_NAME env variables.')
    }
  }
}
