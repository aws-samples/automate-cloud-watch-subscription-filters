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
