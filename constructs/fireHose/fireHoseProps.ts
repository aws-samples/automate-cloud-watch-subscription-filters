import { Bucket } from '@aws-cdk/aws-s3'
import { Role } from '@aws-cdk/aws-iam'

export interface FirehoseProps {
  loggingBucket: Bucket;
  role: Role;
  region: string;
  account: string;
}
