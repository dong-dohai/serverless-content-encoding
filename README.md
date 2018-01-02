# Serverless Content Encoding

A serverless plugin to enable `Content Encoding` feature in API Gateway for lambda function response compression.

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
    minimumCompressionSize: 10 # Minimum body size required for compression in bytes
```

### Usage

This plugin will be triggered during deployment process

```
$ serverless deploy
```
