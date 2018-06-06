# Serverless Content Encoding

A serverless plugin to enable [Content Encoding feature in API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-gzip-compression-decompression.html) for lambda function response compression.

### Install

Using yarn:
```
$ yarn add -D serverless-content-encoding
```

Using npm:
```
$ npm install --save-dev serverless-content-encoding
```

### Configuration

Add the plugin and its configuration to your `serverless.yml` file:

```yaml
plugins:
  - serverless-content-encoding

custom:
  contentEncoding:
    minimumCompressionSize: 0 # Minimum body size required for compression in bytes
```

- `minimumCompressionSize` must be an Integer which greater than or equal 0.
- If `contentEncoding` is not configured, `minimumCompressionSize` will be set to default value which is 0 bytes.
- If you want to disable Content Encoding, set `minimumCompressionSize` to `null`.
### Usage

This plugin will be triggered during deployment process

```
$ serverless deploy
```

### Note

This plugin is to enable Content Encoding on API Gateway for response compression. If your are looking for binary files support, please use [serverless-apigw-binary](https://www.npmjs.com/package/serverless-apigw-binary)

Thanks [@evgenykireev](https://github.com/evgenykireev) for the recommendation of using `MinimumCompressionSize` in CloudFormation instead of CreateDeployment API
