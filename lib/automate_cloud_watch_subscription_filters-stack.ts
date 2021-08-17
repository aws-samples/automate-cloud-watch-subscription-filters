/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
