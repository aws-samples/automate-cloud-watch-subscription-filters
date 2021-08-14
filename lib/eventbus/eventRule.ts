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
