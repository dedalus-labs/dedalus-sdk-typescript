// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource completions', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.chat.completions.create({ model: 'openai/gpt-5' });
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
      model: 'openai/gpt-5',
      agent_attributes: { accuracy: 0.9, complexity: 0.8, efficiency: 0.7 },
      audio: { foo: 'bar' },
      auto_execute_tools: true,
      cachedContent: 'cachedContent',
      deferred: true,
      disable_automatic_function_calling: true,
      frequency_penalty: -2,
      function_call: 'auto',
      functions: [{ name: 'name', description: 'description', parameters: { foo: 'bar' } }],
      generation_config: { foo: 'bar' },
      guardrails: [{ foo: 'bar' }],
      handoff_config: { foo: 'bar' },
      logit_bias: { foo: 0 },
      logprobs: true,
      max_completion_tokens: 0,
      max_tokens: 1,
      max_turns: 5,
      mcp_servers: ['dedalus-labs/brave-search'],
      messages: [{ content: 'string', role: 'developer', name: 'name' }],
      metadata: { foo: 'string' },
      modalities: ['text'],
      model_attributes: { 'openai/gpt-5': { cost: 0.3, intelligence: 0.95, speed: 0.7 } },
      n: 1,
      parallel_tool_calls: true,
      prediction: { content: { foo: 'bar' }, type: 'content' },
      presence_penalty: -2,
      prompt_cache_key: 'prompt_cache_key',
      prompt_cache_retention: '24h',
      prompt_mode: { foo: 'bar' },
      reasoning_effort: 'high',
      response_format: { type: 'text' },
      safe_prompt: true,
      safety_identifier: 'safety_identifier',
      safety_settings: [
        { category: 'HARM_CATEGORY_UNSPECIFIED', threshold: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' },
      ],
      search_parameters: { foo: 'bar' },
      seed: 0,
      service_tier: 'auto',
      stop: 'string',
      store: true,
      stream: false,
      stream_options: { foo: 'bar' },
      system_instruction: { foo: 'bar' },
      temperature: 0,
      thinking: { budget_tokens: 0, type: 'enabled' },
      tool_choice: { disable_parallel_tool_use: true, type: 'auto' },
      tool_config: { foo: 'bar' },
      tools: [
        {
          function: { name: 'name', description: 'description', parameters: { foo: 'bar' }, strict: true },
          type: 'function',
        },
      ],
      top_k: 0,
      top_logprobs: 0,
      top_p: 0,
      user: 'user',
      verbosity: 'high',
      web_search_options: { foo: 'bar' },
    });
  });
});
