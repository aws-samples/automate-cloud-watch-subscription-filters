import { Function } from '@aws-cdk/aws-lambda'
import { Construct } from '@aws-cdk/core'
import { EventBus, Rule, IRuleTarget, IEventBus } from '@aws-cdk/aws-events'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'
import { EventBusProps } from './eventBusProps'

const constants = {
  targetTypes: {
    lambda: 'Lambda'
  },
  arn: {
    lambdaService: 'arn:aws:lambda:',
    function: ':function:',
    separator: ':'
  }
}

export class EventBridge extends Construct {
  constructor (scope: Construct, id: string, props: EventBusProps) {
    super(scope, id)
    let eventBus
    if (props.eventBusArn) {
      eventBus = EventBus.fromEventBusArn(this, 'default-event-bus', props.eventBusArn)
      this.addEventRules(eventBus, props)
    }
  }

  private addEventRules (eventBus: EventBus | IEventBus, props: EventBusProps): void {
    const targetMap = new Map()
    const eventRules = props.eventRules
    if (eventRules && eventRules.length > 0) {
      eventRules.forEach(eventRule => {
        const targets: IRuleTarget[] = []
        if (
          eventRule.targetType === constants.targetTypes.lambda
        ) {
          if (!targetMap.has(eventRule.targetName)) {
            switch (eventRule.targetType) {
              case constants.targetTypes.lambda: {
                const targetLambda = Function.fromFunctionArn(
                  this,
                  eventRule.targetName,
                  constants.arn.lambdaService +
                                    props.region +
                                    constants.arn.separator +
                                    props.account +
                                    constants.arn.function +
                                    eventRule.targetName
                )

                const lambdaFunction = new LambdaFunction(targetLambda)
                targets.push(lambdaFunction)
                targetMap.set(eventRule.targetName, lambdaFunction)

                break
              }
            }
          } else {
            targets.push(targetMap.get(eventRule.targetName))
          }

          new Rule(this, eventRule.ruleName, {
            ruleName: eventRule.ruleName,
            enabled: true,
            eventBus: eventBus,
            eventPattern: eventRule.eventPattern,
            targets: targets
          })
        } else {
          throw new Error('Target type not supported - ' + eventRule.targetType)
        }
      })
    }
  }
}
