// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Dedalus from 'dedalus-labs';

const client = new Dedalus({ apiKey: 'My API Key', baseURL: process.env["TEST_API_BASE_URL"] ?? 'http://127.0.0.1:4010' });

describe('resource completions', () => {
  // Mock server tests are disabled
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

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.chat.completions.create({
    model: 'openai/gpt-5',
    agent_attributes: { accuracy: 0.9, complexity: 0.8 },
    audio: { format: 'mp3', voice: 'alloy' },
    automatic_tool_execution: true,
    cached_content: 'cached_content',
    correlation_id: 'correlation_id',
    credentials: {
    connection_name: 'external-service',
    values: { api_key: 'sk-...' },
  },
    deferred: true,
    deferred_calls: [{
    id: 'id',
    name: 'name',
    arguments: { foo: 'string' },
    blocked_by: ['string'],
    dependencies: ['string'],
    venue: 'venue',
  }],
    frequency_penalty: -2,
    function_call: 'function_call',
    functions: [{
    name: 'name',
    description: 'description',
    parameters: { foo: 'bar' },
  }],
    generation_config: { foo: 'string' },
    guardrails: [{ foo: 'bar' }],
    handoff_config: { foo: 'bar' },
    handoff_mode: true,
    inference_geo: 'inference_geo',
    logit_bias: { foo: 0 },
    logprobs: true,
    max_completion_tokens: 0,
    max_tokens: 1,
    max_turns: 5,
    mcp_servers: 'dedalus-labs/example-server',
    messages: [{
    content: 'string',
    role: 'developer',
    name: 'name',
  }],
    metadata: { foo: 'string' },
    modalities: ['string'],
    model_attributes: { 'gpt-5': { accuracy: 0.95, speed: 0.6 } },
    n: 1,
    output_config: { foo: 'string' },
    parallel_tool_calls: true,
    prediction: { content: 'string', type: 'content' },
    presence_penalty: -2,
    prompt_cache_key: 'prompt_cache_key',
    prompt_cache_retention: 'prompt_cache_retention',
    prompt_mode: 'reasoning',
    reasoning_effort: 'reasoning_effort',
    response_format: { type: 'text' },
    safe_prompt: true,
    safety_identifier: 'safety_identifier',
    safety_settings: [{ category: 'HARM_CATEGORY_UNSPECIFIED', threshold: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' }],
    search_parameters: { foo: 'string' },
    seed: 0,
    service_tier: 'service_tier',
    speed: 'standard',
    stop: ['string'],
    store: true,
    stream: false,
    stream_options: { foo: 'string' },
    system_instruction: { foo: 'string' },
    temperature: 0,
    thinking: { budget_tokens: 1024, type: 'enabled' },
    tool_choice: 'string',
    tool_config: { foo: 'string' },
    tools: [{
    function: { name: 'name' },
    type: 'function',
  }],
    top_k: 0,
    top_logprobs: 0,
    top_p: 0,
    user: 'user',
    verbosity: 'verbosity',
    web_search_options: { foo: 'string' },
  });
  });
});
