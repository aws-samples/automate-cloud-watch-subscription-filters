import { Construct, StackProps } from '@aws-cdk/core'
import { Firehose } from '../../constructs/fireHose/fireHose'
import { FirehoseProps } from '../../constructs/fireHose/FirehoseProps'
import { Bucket } from '@aws-cdk/aws-s3'
import { Role } from '@aws-cdk/aws-iam'

export const CreateLoggingFirehose = (scope: Construct, id: string, config: StackProps, loggingBucket: Bucket,
  role: Role) => {
  const props: FirehoseProps = {
    account: config.env?.account!,
    region: config.env?.region!,
    loggingBucket: loggingBucket,
    role: role
  }

  new Firehose(scope, id, props)
}
