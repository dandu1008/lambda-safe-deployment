# Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 
# After Build done, Follow below commands to deploy the lambda along with deployconfig for blue/gree test
 
 `cdk synth --profile <aws profile name>`
 `cdk deploy --profile <aws profile name>`
