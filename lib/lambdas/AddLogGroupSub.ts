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
import { PolicyStatement, Effect, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Lambda } from '../../constructs/lambda/lambda'
import { LambdaProps } from '../../constructs/lambda/lambdaProps'

export function CreateAddLogGroupSubLambdas (scope: Construct, config: StackProps): void {
  const lambdaPermissions = {
    principal: new ServicePrincipal('events.amazonaws.com'),
    action: 'lambda:InvokeFunction',
    sourceArn: `arn:aws:events:${config.env?.region}:${config.env?.account}:rule/Invoke-AddLogGroupSub`
  }

  const allowPutSubscriptionFilter = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['logs:PutSubscriptionFilter', 'iam:PassRole'],
    resources: [
      `arn:aws:iam::${config.env?.account}:role/log_group_role`,
      `arn:aws:logs:*:${config.env?.account}:log-group:*`
    ],
    sid: 'AllowPutSubscriptionFilter'
  })

  const customLambdaProps: LambdaProps = {
    functionIdentity: 'AddLogGrpSub',
    code: 'src/AddLogGrpSub/index.ts',
    handler: 'handler',
    functionName: 'AddLogGrpSub',
    functionRoleName: 'AddLogGrpSubRole',
    functionRoleDescription: 'Add Log Group Sub Function Role',
    policyStatements: [allowPutSubscriptionFilter],
    permissions: [lambdaPermissions],
    environment: {
      SUB_DESTINATION_ARN: `arn:aws:firehose:${config.env?.region}:${config.env?.account}:deliverystream/logging_firehose`,
      SUB_ROLE: `arn:aws:iam::${config.env?.account}:role/log_group_role`,
      LOG_GROUP_NAME_REGEX: '/aws/lambda/.*'
    }
  }

  new Lambda(scope, 'AddLogGroupSub', customLambdaProps)
}
