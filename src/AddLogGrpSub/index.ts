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
