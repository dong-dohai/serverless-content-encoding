# Serverless Content Encoding

This plugin automates the process of enabling Content Encoding in API Gateway

### Installing

Using yarn:
```
yarn add -D serverless-content-encoding
```

Using npm:
```
npm install --save-dev serverless-content-encoding
```

### Configuration

_serverless.yml_

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
serverless deploy
```
