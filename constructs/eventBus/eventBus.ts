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
