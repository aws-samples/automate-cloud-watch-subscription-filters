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

import * as cdk from '@aws-cdk/core'
import { LambdaProps } from './lambdaProps'
import { IFunction, Runtime } from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Role, ManagedPolicy, ServicePrincipal } from '@aws-cdk/aws-iam'
export class Lambda extends cdk.Construct {
  public readonly function: IFunction;
  public readonly executionRole: Role;

  constructor (scope: cdk.Construct, id: string, props: LambdaProps) {
    super(scope, id)

    this.executionRole = new Role(this, props.functionRoleName, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      description: props.functionRoleDescription,
      managedPolicies: props.managedPolicies,
      roleName: props.functionRoleName
    })
    this.executionRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    )

    props.policyStatements?.forEach(policyStatement => {
      this.executionRole.addToPolicy(policyStatement)
    })


    this.function = new NodejsFunction(this, props.functionIdentity, {
      entry: props.code,
      runtime: Runtime.NODEJS_14_X,
      handler: props.handler,
      role: this.executionRole,
      functionName: props.functionName,
      environment: props.environment,
      timeout: props.timeout,
      memorySize: props.memorySize ?? 512,
      bundling: {
        sourceMap: true,
        minify: true
      }
    })

    props.permissions?.forEach((permission, index) => {
      this.function.addPermission('Permission' + index, permission)
    })
  }
}
