// import { App, Stack, StackProps } from '@aws-cdk/core';
// import { Code, Function as Fn, Runtime, Alias } from "@aws-cdk/aws-lambda";
// import apigw = require('@aws-cdk/aws-apigateway');
// import codedeploy = require('@aws-cdk/aws-codedeploy');
// import cloudwatch = require('@aws-cdk/aws-cloudwatch');
// import { readFileSync } from 'fs';
// import * as path from 'path';
// //import { PolicyStatement } from '@aws-cdk/aws-iam'

// export class CdkWorkshopStack extends Stack {
//   constructor(scope: App, id: string, props?: StackProps) {
//     super(scope, id, props);

//     var epochTime = (new Date).getTime();
//     var code = `${readFileSync(path.join(__dirname, '../lambda/hello.js'))} //console.log('Deploy Time: ${epochTime})`;
//     console.log(code);

//     const newVersion = '4';

//     //defines an AWS lambda resource
//     const version = new Fn(this, 'HelloHandler123', {
//       functionName: "HelloHandler123",
//       runtime: Runtime.NODEJS_8_10,
//       code: Code.asset('lambda'),
//       //code: lambda.Code.inline(`${readFileSync(path.join(__dirname, '../lambda/hello.js'))} //console.log('Deploy Time: ${epochTime}')`),
//       handler: 'index.handler'
//     }).addVersion(newVersion);

//     // const deployapplication = new codedeploy.LambdaApplication(this, 'CodeDeployApplication', {
//     //   applicationName: 'LambdaSafeDeploy'
//     // });

//     //const newVersion = '4';
  
//     //const version = hello.addVersion(newVersion);
   
//     const aliasversion= new Alias(this, 'alias', {
//       aliasName: 'live',
//       version: version
//     });
  
//     //const tempver = version.latestVersion
//     //defines an AWS lambda prehook resource
//     const helloPrehook = new Fn(this, 'HelloPrehook', {
//       //"CodeDeployHook_" is prefix, it should be same to all prehooks 
//       functionName: "CodeDeployHook_hellopreTrafficHook", 
//       runtime: Runtime.NODEJS_8_10,
//       code: Code.asset('prehook_lambda'),
//       handler: 'hello_prehook.handler',
//       environment: {
//         'NewVersion': version.functionArn,
//         'testO': version.version
//       },
//     });

//     //helloPrehook.addToRolePolicy(new PolicyStatement({actions: ["lambda:InvokeFunction"],resources: [version.functionArn]}));
//     //helloPrehook.addToRolePolicy(new PolicyStatement({actions: ["lambda:*"], resources: ['*']}));
//     version.grantInvoke(helloPrehook);
//     const deploymentgroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
//     //application: deployapplication, // optional property: one will be created for you if not provided
//       alias: aliasversion,
//       deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
//       preHook: helloPrehook,
//     });

//     //add alarms to an existing group
//     deploymentgroup.addAlarm(new cloudwatch.Alarm(this, 'AliasErrorMetricGreaterThanZeroAlarm', {
//       alarmDescription: "Alias Lambda Function Error > 0",
//       comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
//       threshold: 0,
//       evaluationPeriods: 2,
//       metric: aliasversion.metricErrors({periodSec: 60}),
//       statistic: "Sum"
//     }));

//     new apigw.LambdaRestApi(this, 'Endpoint', {
//       handler: version,
//       proxy: true
//     });

//   }
// }
