import Dedalus from 'dedalus-labs';

describe('BYOK provider headers', () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
    delete process.env['DEDALUS_PROVIDER'];
    delete process.env['DEDALUS_PROVIDER_KEY'];
    delete process.env['DEDALUS_PROVIDER_MODEL'];
  });

  afterEach(() => {
    process.env = env;
  });

  test('provider headers set via constructor', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'sk-test-123',
      providerModel: 'gpt-4o-mini',
    });

    const { req } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('openai');
    expect(req.headers.get('x-provider-key')).toEqual('sk-test-123');
    expect(req.headers.get('x-provider-model')).toEqual('gpt-4o-mini');
  });

  test('provider headers set via env vars', async () => {
    process.env['DEDALUS_PROVIDER'] = 'anthropic';
    process.env['DEDALUS_PROVIDER_KEY'] = 'sk-ant-test';
    process.env['DEDALUS_PROVIDER_MODEL'] = 'claude-sonnet-4-20250514';

    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
    });

    const { req } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('anthropic');
    expect(req.headers.get('x-provider-key')).toEqual('sk-ant-test');
    expect(req.headers.get('x-provider-model')).toEqual('claude-sonnet-4-20250514');
  });

  test('constructor overrides env vars', async () => {
    process.env['DEDALUS_PROVIDER'] = 'google';
    process.env['DEDALUS_PROVIDER_KEY'] = 'env-key';
    process.env['DEDALUS_PROVIDER_MODEL'] = 'env-model';

    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'constructor-key',
      providerModel: 'constructor-model',
    });

    const { req } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('openai');
    expect(req.headers.get('x-provider-key')).toEqual('constructor-key');
    expect(req.headers.get('x-provider-model')).toEqual('constructor-model');
  });

  test('null provider values omit headers', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
    });

    const { req } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.has('x-provider')).toBe(false);
    expect(req.headers.has('x-provider-key')).toBe(false);
    expect(req.headers.has('x-provider-model')).toBe(false);
  });

  test('partial provider params (only provider key)', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      providerKey: 'sk-only-key',
    });

    const { req } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.has('x-provider')).toBe(false);
    expect(req.headers.get('x-provider-key')).toEqual('sk-only-key');
    expect(req.headers.has('x-provider-model')).toBe(false);
  });

  test('withOptions preserves provider params', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'sk-test-123',
      providerModel: 'gpt-4o-mini',
    });

    const derived = client.withOptions({});
    const { req } = await derived.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('openai');
    expect(req.headers.get('x-provider-key')).toEqual('sk-test-123');
    expect(req.headers.get('x-provider-model')).toEqual('gpt-4o-mini');
  });

  test('withOptions can override provider params', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'sk-openai',
      providerModel: 'gpt-4o-mini',
    });

    const derived = client.withOptions({
      provider: 'anthropic',
      providerKey: 'sk-ant-new',
      providerModel: 'claude-sonnet-4-20250514',
    });

    const { req } = await derived.buildRequest({ path: '/foo', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('anthropic');
    expect(req.headers.get('x-provider-key')).toEqual('sk-ant-new');
    expect(req.headers.get('x-provider-model')).toEqual('claude-sonnet-4-20250514');

    // Original client unchanged
    const { req: origReq } = await client.buildRequest({ path: '/foo', method: 'post' });
    expect(origReq.headers.get('x-provider')).toEqual('openai');
  });

  test('headers included on chat completion requests', async () => {
    const client = new Dedalus({
      apiKey: 'test-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'sk-test-123',
      providerModel: 'gpt-4o-mini',
    });

    const { req } = await client.buildRequest({
      path: '/v1/chat/completions',
      method: 'post',
      body: {
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: 'Hello' }],
      },
    });

    expect(req.headers.get('x-provider')).toEqual('openai');
    expect(req.headers.get('x-provider-key')).toEqual('sk-test-123');
    expect(req.headers.get('x-provider-model')).toEqual('gpt-4o-mini');
  });

  test('openai BYOK example', async () => {
    const client = new Dedalus({
      apiKey: 'test-dedalus-key',
      baseURL: 'http://localhost:5000/',
      provider: 'openai',
      providerKey: 'sk-proj-abc123def456',
      providerModel: 'gpt-4o-mini',
    });

    const { req } = await client.buildRequest({ path: '/v1/chat/completions', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('openai');
    expect(req.headers.get('x-provider-key')).toEqual('sk-proj-abc123def456');
    expect(req.headers.get('x-provider-model')).toEqual('gpt-4o-mini');
  });

  test('anthropic BYOK example', async () => {
    const client = new Dedalus({
      apiKey: 'test-dedalus-key',
      baseURL: 'http://localhost:5000/',
      provider: 'anthropic',
      providerKey: 'sk-ant-test-key',
      providerModel: 'claude-sonnet-4-20250514',
    });

    const { req } = await client.buildRequest({ path: '/v1/chat/completions', method: 'post' });
    expect(req.headers.get('x-provider')).toEqual('anthropic');
    expect(req.headers.get('x-provider-key')).toEqual('sk-ant-test-key');
    expect(req.headers.get('x-provider-model')).toEqual('claude-sonnet-4-20250514');
  });
});
