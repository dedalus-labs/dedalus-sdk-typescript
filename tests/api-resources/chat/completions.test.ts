// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource completions', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.chat.completions.create({ messages: [{ content: 'bar', role: 'bar' }] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.chat.completions.create({
      messages: [{ content: 'bar', role: 'bar' }],
      agent_attributes: { accuracy: 0.9, complexity: 0.8, efficiency: 0.7 },
      frequency_penalty: -0.5,
      guardrails: [{ foo: 'bar' }],
      handoff_config: { foo: 'bar' },
      logit_bias: { '50256': -100 },
      max_tokens: 100,
      max_turns: 5,
      mcp_servers: ['dedalus-labs/brave-search', 'dedalus-labs/github-api'],
      model: 'openai/gpt-4',
      model_attributes: {
        'anthropic/claude-3-5-sonnet': { cost: 0.7, creativity: 0.8, intelligence: 0.95 },
        'openai/gpt-4': { cost: 0.8, intelligence: 0.9, speed: 0.6 },
        'openai/gpt-4o-mini': { cost: 0.2, intelligence: 0.7, speed: 0.9 },
      },
      n: 1,
      presence_penalty: -0.5,
      stop: ['\\n', 'END'],
      stream: false,
      temperature: 0,
      tool_choice: 'auto',
      tools: [{ function: 'bar', type: 'bar' }],
      top_p: 0.1,
      user: 'user-123',
    });
  });
});
