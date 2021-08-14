#!/usr/bin/env node
/* eslint-disable no-new */
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { AutomateCloudWatchSubscriptionFiltersStack } from '../lib/automate_cloud_watch_subscription_filters-stack'

const app = new cdk.App()

new AutomateCloudWatchSubscriptionFiltersStack(app, 'AutomateCloudWatchSubscriptionFiltersStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
})
