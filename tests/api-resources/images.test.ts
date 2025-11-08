// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus, { toFile } from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource images', () => {
  // Prism tests are disabled
  test.skip('createVariation: only required params', async () => {
    const responsePromise = client.images.createVariation({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('createVariation: required and optional params', async () => {
    const response = await client.images.createVariation({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      model: 'model',
      n: 0,
      response_format: 'response_format',
      size: 'size',
      user: 'user',
    });
  });

  // Prism tests are disabled
  test.skip('edit: only required params', async () => {
    const responsePromise = client.images.edit({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      prompt: 'prompt',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('edit: required and optional params', async () => {
    const response = await client.images.edit({
      image: await toFile(Buffer.from('# my file contents'), 'README.md'),
      prompt: 'prompt',
      mask: await toFile(Buffer.from('# my file contents'), 'README.md'),
      model: 'model',
      n: 0,
      response_format: 'response_format',
      size: 'size',
      user: 'user',
    });
  });

  // Prism tests are disabled
  test.skip('generate: only required params', async () => {
    const responsePromise = client.images.generate({ prompt: 'A white siamese cat' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('generate: required and optional params', async () => {
    const response = await client.images.generate({
      prompt: 'A white siamese cat',
      background: 'transparent',
      model: 'openai/dall-e-3',
      moderation: 'auto',
      n: 1,
      output_compression: 85,
      output_format: 'png',
      partial_images: 0,
      quality: 'standard',
      response_format: 'url',
      size: '1024x1024',
      stream: true,
      style: 'vivid',
      user: 'user',
    });
  });
});
