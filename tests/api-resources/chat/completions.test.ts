// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource completions', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.chat.completions.create({
      messages: [{ content: 'bar', role: 'bar' }],
      model: 'openai/gpt-4',
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
  test.skip('create: required and optional params', async () => {
    const response = await client.chat.completions.create({
      messages: [{ content: 'bar', role: 'bar' }],
      model: 'openai/gpt-4',
      agent_attributes: { accuracy: 0.9, complexity: 0.8, efficiency: 0.7 },
      audio: { format: 'bar', voice: 'bar' },
      disable_automatic_function_calling: true,
      frequency_penalty: -0.5,
      function_call: 'string',
      functions: [{ foo: 'bar' }],
      generation_config: { candidateCount: 'bar', responseMimeType: 'bar' },
      guardrails: [{ foo: 'bar' }],
      handoff_config: { foo: 'bar' },
      input: 'Translate this paragraph into French.',
      instructions: 'You are a concise assistant.',
      logit_bias: { '50256': -100 },
      logprobs: true,
      max_completion_tokens: 1000,
      max_tokens: 100,
      max_turns: 5,
      mcp_servers: ['dedalus-labs/brave-search', 'dedalus-labs/github-api'],
      metadata: { session: 'abc', user_id: '123' },
      modalities: ['text'],
      model_attributes: {
        'anthropic/claude-3-5-sonnet': { cost: 0.7, creativity: 0.8, intelligence: 0.95 },
        'openai/gpt-4': { cost: 0.8, intelligence: 0.9, speed: 0.6 },
        'openai/gpt-4o-mini': { cost: 0.2, intelligence: 0.7, speed: 0.9 },
      },
      n: 1,
      parallel_tool_calls: true,
      prediction: { foo: 'bar' },
      presence_penalty: -0.5,
      prompt_cache_key: 'prompt_cache_key',
      reasoning_effort: 'medium',
      response_format: { type: 'bar' },
      safety_identifier: 'safety_identifier',
      safety_settings: [{ category: 'bar', threshold: 'bar' }],
      seed: 42,
      service_tier: 'auto',
      stop: ['\n', 'END'],
      store: true,
      stream: false,
      stream_options: { include_usage: 'bar' },
      system: 'You are a helpful assistant.',
      temperature: 0,
      thinking: { budget_tokens: 2048, type: 'enabled' },
      tool_choice: 'auto',
      tool_config: { function_calling_config: 'bar' },
      tools: [{ function: 'bar', type: 'bar' }],
      top_k: 40,
      top_logprobs: 5,
      top_p: 0.1,
      user: 'user-123',
      verbosity: 'low',
      web_search_options: { foo: 'bar' },
    });
  });
});
