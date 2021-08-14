export interface LambdaEvent {
  detail: { requestParameters: { logGroupName: string } };
  eventSource: string;
  eventName: string;
}

export interface Response {
  statusCode: number;
  updated: boolean;
}
