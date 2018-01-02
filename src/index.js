const isNumber = require('is-number');

class ContentEncoding {
  constructor(serverless, options) {
    this.options = options || {};
    this.serverless = serverless;
    this.provider = this.serverless.getProvider(this.serverless.service.provider.name);
    this.hooks = {
      'after:deploy:deploy': this.afterDeploy.bind(this),
    };
  }

  /**
   * Get API ID of current stage
   *
   * @param {String} stage Stage name
   */
  getApiId(stage) {
    return new Promise((resolve) => {
      this.provider.request('CloudFormation', 'describeStacks', { StackName: this.provider.naming.getStackName(stage) }).then((resp) => {
        const output = resp.Stacks[0].Outputs;
        let apiUrl;
        output.filter(entry => entry.OutputKey.match('ServiceEndpoint')).forEach((entry) => { apiUrl = entry.OutputValue; });
        const apiId = apiUrl.match('https://(.*)\\.execute-api')[1];
        resolve(apiId);
      });
    });
  }

  /**
   * Update Rest API configuration with given patch operations
   *
   * @param {*} apiId Target REST Api ID
   * @param {*} patchOperations List of operation to applied to specified API
   */
  updateRestApi(apiId, patchOperations) {
    return this.provider.request('APIGateway', 'updateRestApi', {
      patchOperations,
      restApiId: apiId,
    });
  }

  /**
   * Enable content encoding
   *
   * @param {*} apiId Target REST Api ID
   * @param {*} minimumCompressionSize Minimum body size required for compression in bytes
   */
  enableContentEncoding(apiId, minimumCompressionSize) {
    this.serverless.cli.log(`Enabling API Gateway Content Encoding with minimum compression size = ${minimumCompressionSize} bytes`);
    const patchOperations = [{
      op: 'replace',
      path: '/minimumCompressionSize',
      value: `${minimumCompressionSize}`,
    }];

    return this.updateRestApi(apiId, patchOperations);
  }

  /**
   * Disable content encoding
   *
   * @param {*} apiId Target REST Api ID
   */
  disableContentEncoding(apiId) {
    const patchOperations = [{
      op: 'replace',
      path: '/minimumCompressionSize',
    }];

    return this.updateRestApi(apiId, patchOperations);
  }


  /**
   * Redeploy the target service so the configuration changes can take effect.
   *
   * @param {*} apiId ID of target API
   * @param {*} stage Stage name
   */
  createDeployment(apiId, stage) {
    return this.provider.request('APIGateway', 'createDeployment', { restApiId: apiId, stageName: stage });
  }

  /**
   * method that hook into deployment process
   */
  afterDeploy() {
    const stage = this.options.stage || this.serverless.service.provider.stage;
    let numberOfBytes = 0;

    if (this.serverless.service.custom.contentEncoding) {
      const { minimumCompressionSize } = this.serverless.service.custom.contentEncoding;

      if ((!isNumber(minimumCompressionSize) || minimumCompressionSize < 0) && minimumCompressionSize !== null) {
        throw Error('Minimum compression size must be an Integer which greater than 0 or null');
      }
      numberOfBytes = minimumCompressionSize;
    }

    if (numberOfBytes === null) {
      return this.getApiId(stage).then(apiId => this.disableContentEncoding(apiId).then(() => this.createDeployment(apiId, stage)));
    }
    return this.getApiId(stage).then(apiId => this.enableContentEncoding(apiId, numberOfBytes).then(() => this.createDeployment(apiId, stage)));
  }
}

module.exports = ContentEncoding;
