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

import { Construct, StackProps } from '@aws-cdk/core'
import { EventBridge } from '../../constructs/eventBus/eventBus'
import { EventBusProps } from '../../constructs/eventBus/eventBusProps'

export const CreateEventBusRule = (scope: Construct, id: string, config: StackProps) => {
  const props : EventBusProps = {
    account: config.env?.account,
    region: config.env?.region,
    eventBusName: '',
    eventRules: [
      {
        targetType: 'Lambda',
        targetName: 'AddLogGrpSub',
        ruleName: 'Invoke-AddLogGroupSub',
        eventPattern: {
          source: ['aws.logs'],
          detail: {
            eventName: ['CreateLogGroup']
          }
        }
      }
    ],
    eventBusArn: `arn:aws:events:${config.env?.region}:${config.env?.account}:event-bus/default`
  }

  new EventBridge(scope, id, props)
}
