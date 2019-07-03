import { App, Stack, StackProps, Duration } from '@aws-cdk/core';
import { Code, Function as Fn, Runtime, Alias } from "@aws-cdk/aws-lambda";
import apigw = require('@aws-cdk/aws-apigateway');
import codedeploy = require('@aws-cdk/aws-codedeploy');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');


export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const newVersion = '11';

    const version = new Fn(this, 'HelloHandler123', {
      functionName: "HelloHandler123",
      runtime: Runtime.NODEJS_8_10,
      code: Code.asset('lambda'),
      handler: 'index.handler'
    }).addVersion(newVersion);

    // const deployapplication = new codedeploy.LambdaApplication(this, 'CodeDeployApplication', {
    //   applicationName: 'LambdaSafeDeploy'
    // });

    //const version = hello.addVersion(newVersion);
   
    const aliasversion= new Alias(this, 'alias', {
      aliasName: 'live',
      version: version,
    });
  
    const helloPrehook = new Fn(this, 'HelloPrehook', {
      //"CodeDeployHook_" is prefix, it should be same to all prehooks 
      functionName: "CodeDeployHook_hellopreTrafficHook", 
      runtime: Runtime.NODEJS_8_10,
      code: Code.asset('prehook_lambda'),
      handler: 'index_prehook.handler',
      environment: {
        'NewVersion': version.functionArn,
        'versionseq': version.version
      },
    });

    version.grantInvoke(helloPrehook);

    const deploymentgroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeployment', {
    //application: deployapplication, // optional property: one will be created for you if not provided
      alias: aliasversion,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.LINEAR_10PERCENT_EVERY_1MINUTE,
      preHook: helloPrehook,
    });

    //add alarms to an existing group
    deploymentgroup.addAlarm(new cloudwatch.Alarm(this, 'AliasErrorMetricGreaterThanZeroAlarm', {
      alarmDescription: "Alias Lambda Function Error > 0",
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 0,
      evaluationPeriods: 2,
      metric: aliasversion.metricErrors({period: Duration.seconds(60)}),
      statistic: "Sum"
    }));

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: version,
      proxy: true
    });

  }
}
