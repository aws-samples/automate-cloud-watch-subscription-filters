import { EventPattern } from '@aws-cdk/aws-events'
interface EventBusConfig {
  ruleName: string;
  eventPattern: EventPattern;
  targetType: string;
  targetName: string;
  roleName?: string;
}
export interface EventBusProps {
    eventBusName: string;
    eventBusArn?: string;
    eventRules: EventBusConfig[];
    region?: string;
    account?: string;
}
