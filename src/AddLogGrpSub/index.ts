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

import { LambdaEvent, Response } from './@types/interfaces'
import {
  CloudWatchLogsClient,
  PutSubscriptionFilterCommand,
  PutSubscriptionFilterCommandInput
} from '@aws-sdk/client-cloudwatch-logs'

export const handler = async (event: LambdaEvent): Promise<Response> => {
  const logGroupName = event.detail.requestParameters.logGroupName

  const destinationArn = process.env.SUB_DESTINATION_ARN
  const roleARN = process.env.SUB_ROLE
  const pattern = process.env.LOG_GROUP_NAME_REGEX

  let updated = false

  if (pattern) {
    const regex = new RegExp(pattern)

    console.log('logGroupName = ', logGroupName)
    if (regex.test(logGroupName)) {
      const client = new CloudWatchLogsClient({})
      const input: PutSubscriptionFilterCommandInput = {
        logGroupName: logGroupName,
        destinationArn: destinationArn,
        filterName: logGroupName,
        filterPattern: ' ',
        roleArn: roleARN
      }
      const command = new PutSubscriptionFilterCommand(input)
      await client.send(command)
      updated = true
    } else {
      console.log('No updates required, this log group does not match the regex')
    }
  }

  const resp: Response = {
    statusCode: 200,
    updated: updated
  }

  return resp
}
