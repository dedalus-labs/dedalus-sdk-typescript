// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource ocr', () => {
  // Mock server tests are disabled
  test.skip('process: only required params', async () => {
    const responsePromise = client.ocr.process({ document: { document_url: 'document_url' } });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('process: required and optional params', async () => {
    const response = await client.ocr.process({
      document: { document_url: 'document_url', type: 'type' },
      model: 'model',
    });
  });
});
