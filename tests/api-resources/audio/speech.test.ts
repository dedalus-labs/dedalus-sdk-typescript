// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource speech', () => {
  test('create: required and optional params', async () => {
    const response = await client.audio.speech.create({
      input: 'Hello, how are you today?',
      model: 'tts-1',
      voice: 'alloy',
      instructions: 'instructions',
      response_format: 'mp3',
      speed: 1,
      stream_format: 'sse',
    });
  });
});
