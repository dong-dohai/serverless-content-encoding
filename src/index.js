class ContentEncoding {
  constructor(serverless, options) {
    this.options = options || {};
    this.serverless = serverless;
    this.hooks = {
      'before:package:finalize': this.beforeDeploy.bind(this),
    };
  }

  /**
   * hooks to the deployment process and set the minimum compression size
   */
  beforeDeploy() {
    const apiGateway = this.serverless.service.provider.compiledCloudFormationTemplate.Resources.ApiGatewayRestApi;
    let compressionValue = 0;

    if (!apiGateway) {
      this.serverless.cli.log('[Warning] Content encoding only works with API Gateway');
      return;
    }

    if (this.serverless.service.custom.contentEncoding) {
      const { minimumCompressionSize } = this.serverless.service.custom.contentEncoding;
      if ((!Number.isInteger(minimumCompressionSize) || minimumCompressionSize < 0) && minimumCompressionSize !== null) {
        throw Error('Minimum compression size must be an Integer which is greater than 0 or it can be set to null for disabling Content Encoding');
      }

      if (Number.isInteger(minimumCompressionSize)) {
        this.serverless.cli.log(`Setting API Gateway content encoding minimum compression size to ${minimumCompressionSize}`);
        compressionValue = minimumCompressionSize;
      } else {
        compressionValue = { Ref: 'AWS::NoValue' };
      }
    }

    try {
      apiGateway.Properties.MinimumCompressionSize = compressionValue;
    } catch (error) {
      this.serverless.cli.log(error);
    }
  }
}

module.exports = ContentEncoding;
