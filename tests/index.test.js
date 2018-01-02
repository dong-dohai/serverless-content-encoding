const Serverless = require('serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const ContentEncodingPlugin = require('../src/index');
const sinon = require('sinon');

describe('Serverless content encoding', () => {
  let serverless;
  let options;
  let minimumCompressionSize;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    options = {
      stage: 'production',
      region: 'ap-southeast-2',
    };
    serverless = new Serverless(options);
    minimumCompressionSize = 3000;
    serverless.setProvider('aws', new AwsProvider(serverless, options));
    serverless.service.custom = { contentEncoding: { minimumCompressionSize } };
    serverless.service.provider = { name: 'aws', stage: 'production' };
    serverless.service.service = 'test';
    serverless.processedInput = { options: {} };
    serverless.cli = { log: () => {} };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should initialize without options', () => {
    const contentEncodingPlugin = new ContentEncodingPlugin(serverless);

    expect(contentEncodingPlugin.serverless).toBeInstanceOf(Serverless);
    expect(contentEncodingPlugin.options).toEqual({});
  });

  it('should initialize with empty options', () => {
    const contentEncodingPlugin = new ContentEncodingPlugin(serverless, {});

    expect(contentEncodingPlugin.serverless).toBeInstanceOf(Serverless);
    expect(contentEncodingPlugin.options).toEqual({});
  });

  it('should initialize with custom options', () => {
    const contentEncodingPlugin = new ContentEncodingPlugin(serverless, options);

    expect(contentEncodingPlugin.serverless).toBeInstanceOf(Serverless);
    expect(contentEncodingPlugin.options).toEqual(options);
  });

  it('should be added as a serverless plugin', () => {
    serverless.pluginManager.addPlugin(ContentEncodingPlugin);

    expect(serverless.pluginManager.plugins[0]).toBeInstanceOf(ContentEncodingPlugin);
  });
});
