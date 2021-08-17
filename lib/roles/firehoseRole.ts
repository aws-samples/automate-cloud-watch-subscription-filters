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
