// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'chat.completions',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/chat/completions',
  operationId: 'create_chat_completion_v1_chat_completions_post',
};

export const tool: Tool = {
  name: 'create_chat_completions',
  description:
    'Create a chat completion.\n\nUnified chat-completions endpoint that works across many model providers. Supports\noptional MCP integration, multi-model routing with agentic handoffs, server- or\nclient-executed tools, and both streaming and non-streaming delivery.\n\nRequest body:\n  - messages: ordered list of chat turns.\n  - model: identifier or a list of identifiers for routing.\n  - tools: optional tool declarations available to the model.\n  - mcp_servers: optional list of MCP server slugs to enable during the run.\n  - stream: boolean to request incremental output.\n  - config: optional generation parameters (e.g., temperature, max_tokens, metadata).\n\nHeaders:\n  - Authorization: bearer key for the calling account.\n  - Optional BYOK or provider headers if applicable.\n\nBehavior:\n  - If multiple models are supplied, the router may select or hand off across them.\n  - Tools may be invoked on the server or signaled for the client to run.\n  - Streaming responses emit incremental deltas; non-streaming returns a single object.\n  - Usage metrics are computed when available and returned in the response.\n\nResponses:\n  - 200 OK: JSON completion object with choices, message content, and usage.\n  - 400 Bad Request: validation error.\n  - 401 Unauthorized: authentication failed.\n  - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit issue.\n  - 500 Internal Server Error: unexpected failure.\n\nBilling:\n  - Token usage metered by the selected model(s).\n  - Tool calls and MCP sessions may be billed separately.\n  - Streaming is settled after the stream ends via an async task.\n\nExample (non-streaming HTTP):\n  POST /v1/chat/completions\n  Content-Type: application/json\n  Authorization: Bearer <key>\n\n  {\n    "model": "provider/model-name",\n    "messages": [{"role": "user", "content": "Hello"}]\n  }\n\n  200 OK\n  {\n    "id": "cmpl_123",\n    "object": "chat.completion",\n    "choices": [\n      {"index": 0, "message": {"role": "assistant", "content": "Hi there!"}, "finish_reason": "stop"}\n    ],\n    "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7}\n  }\n\nExample (streaming over SSE):\n  POST /v1/chat/completions\n  Accept: text/event-stream\n\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":"Hi"}}]}\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":" there!"}}]}\n  data: [DONE]',
  inputSchema: {
    type: 'object',
    anyOf: [
      {
        type: 'object',
        properties: {
          model: {
            anyOf: [
              {
                $ref: '#/$defs/model_id',
              },
              {
                $ref: '#/$defs/dedalus_model',
              },
              {
                $ref: '#/$defs/models',
              },
            ],
            title: 'Model',
            description:
              "Model(s) to use for completion. Can be a single model ID, a DedalusModel object, or a list for multi-model routing. Single model: 'openai/gpt-4', 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4', 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will choose optimal model based on task complexity.",
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
            additionalProperties: true,
          },
          audio: {
            type: 'object',
            title: 'Audio',
            description:
              "Parameters for audio output. Required when requesting audio responses (for example, modalities including 'audio').",
            additionalProperties: true,
          },
          auto_execute_tools: {
            type: 'boolean',
            title: 'Auto Execute Tools',
            description:
              'When False, skip server-side tool execution and return raw OpenAI-style tool_calls in the response.',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description:
              'xAI-specific parameter. If set to true, the request returns a request_id for async completion retrieval via GET /v1/chat/deferred-completion/{request_id}.',
          },
          disable_automatic_function_calling: {
            type: 'boolean',
            title: 'Disable Automatic Function Calling',
            description:
              "Google-only flag to disable the SDK's automatic function execution. When true, the model returns function calls for the client to execute manually.",
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
          },
          function_call: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
                additionalProperties: true,
              },
            ],
            title: 'Function Call',
            description:
              "Deprecated in favor of 'tool_choice'. Controls which function is called by the model (none, auto, or specific name).",
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description:
              "Deprecated in favor of 'tools'. Legacy list of function definitions the model may generate JSON inputs for.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          generation_config: {
            type: 'object',
            title: 'Generation Config',
            description:
              'Google generationConfig object. Merged with auto-generated config. Use for Google-specific params (candidateCount, responseMimeType, etc.).',
            additionalProperties: true,
          },
          guardrails: {
            type: 'array',
            title: 'Guardrails',
            description:
              'Guardrails to apply to the agent for input/output validation and safety checks. Reserved for future use - guardrails configuration format not yet finalized.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description:
              'Configuration for multi-model handoffs and agent orchestration. Reserved for future use - handoff configuration format not yet finalized.',
            additionalProperties: true,
          },
          input: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Input',
            description:
              'Convenience alias for Responses-style `input`. Used when `messages` is omitted to provide the user prompt directly.',
          },
          instructions: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            ],
            title: 'Instructions',
            description:
              'Convenience alias for Responses-style `instructions`. Takes precedence over `system` and over system-role messages when provided.',
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description:
              'Modify the likelihood of specified tokens appearing in the completion. Accepts a JSON object mapping token IDs (as strings) to bias values from -100 to 100. The bias is added to the logits before sampling; values between -1 and 1 nudge selection probability, while values like -100 or 100 effectively ban or require a token.',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description:
              'Whether to return log probabilities of the output tokens. If true, returns the log probabilities for each token in the response content.',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description:
              'An upper bound for the number of tokens that can be generated for a completion, including visible output and reasoning tokens.',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              "The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API. This value is now deprecated in favor of 'max_completion_tokens' and is not compatible with o-series models.",
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description:
              'Maximum number of turns for agent execution before terminating (default: 10). Each turn represents one model inference cycle. Higher values allow more complex reasoning but increase cost and latency.',
          },
          mcp_servers: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs (e.g., 'dedalus-labs/brave-search'), or structured objects specifying slug/version/url. MCP tools are executed server-side and billed separately.",
          },
          messages: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Messages',
            description:
              'Conversation history. Accepts either a list of message objects or a string, which is treated as a single user message. Optional if `input` or `instructions` is provided.',
          },
          metadata: {
            type: 'object',
            title: 'Metadata',
            description:
              'Set of up to 16 key-value string pairs that can be attached to the request for structured metadata.',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Modalities',
            description:
              "Output types you would like the model to generate. Most models default to ['text']; some support ['text', 'audio'].",
            items: {
              type: 'string',
            },
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              "Attributes for individual models used in routing decisions during multi-model execution. Format: {'model_name': {'attribute': value}}, where values are 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity', 'accuracy'. Used by agent to select optimal model based on task requirements.",
            additionalProperties: true,
          },
          n: {
            type: 'integer',
            title: 'N',
            description:
              "How many chat completion choices to generate for each input message. Keep 'n' as 1 to minimize costs.",
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel function calling during tool use.',
          },
          prediction: {
            type: 'object',
            title: 'Prediction',
            description:
              'Configuration for predicted outputs. Improves response times when you already know large portions of the response content.',
            additionalProperties: true,
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description:
              "Used by OpenAI to cache responses for similar requests and optimize cache hit rates. Replaces the legacy 'user' field for caching.",
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description:
              'Constrains effort on reasoning for supported reasoning models. Higher values use more compute, potentially improving reasoning quality at the cost of latency and tokens.',
            enum: ['low', 'medium', 'high'],
          },
          response_format: {
            anyOf: [
              {
                $ref: '#/$defs/response_format_text',
              },
              {
                $ref: '#/$defs/response_format_json_object',
              },
              {
                $ref: '#/$defs/response_format_json_schema',
              },
            ],
            title: 'Response Format',
            description:
              "An object specifying the format that the model must output. Use {'type': 'json_schema', 'json_schema': {...}} for structured outputs or {'type': 'json_object'} for the legacy JSON mode. Currently only OpenAI-prefixed models honour this field; Anthropic and Google requests will return an invalid_request_error if it is supplied.",
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description:
              'Stable identifier used to help detect users who might violate OpenAI usage policies. Consider hashing end-user identifiers before sending.',
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Google safety settings (harm categories and thresholds).',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          search_parameters: {
            type: 'object',
            title: 'Search Parameters',
            description:
              'xAI-specific parameter for configuring web search data acquisition. If not set, no data will be acquired by the model.',
            additionalProperties: true,
          },
          seed: {
            type: 'integer',
            title: 'Seed',
            description:
              'If specified, system will make a best effort to sample deterministically. Determinism is not guaranteed for the same seed across different models or API versions.',
          },
          service_tier: {
            type: 'string',
            title: 'Service Tier',
            description:
              "Specifies the processing tier used for the request. 'auto' uses project defaults, while 'default' forces standard pricing and performance.",
            enum: ['auto', 'default'],
          },
          stop: {
            type: 'array',
            title: 'Stop',
            description:
              "Not supported with latest reasoning models 'o3' and 'o4-mini'.\n\n        Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.",
            items: {
              type: 'string',
            },
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description:
              'Whether to store the output of this chat completion request for OpenAI model distillation or eval products. Image inputs over 8MB are dropped if storage is enabled.',
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description:
              'If true, the model response data is streamed to the client as it is generated using Server-Sent Events.',
            enum: [false],
          },
          stream_options: {
            type: 'object',
            title: 'Stream Options',
            description:
              "Options for streaming responses. Only set when 'stream' is true (supports 'include_usage' and 'include_obfuscation').",
            additionalProperties: true,
          },
          system: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            ],
            title: 'System',
            description:
              'System prompt/instructions. Anthropic: pass-through. Google: converted to systemInstruction. OpenAI: extracted from messages.',
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 make the output more random, while lower values like 0.2 make it more focused and deterministic. We generally recommend altering this or 'top_p' but not both.",
          },
          thinking: {
            anyOf: [
              {
                type: 'object',
                title: 'ThinkingConfigDisabled',
                description: "Fields:\n- type (required): Literal['disabled']",
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['disabled'],
                  },
                },
                required: ['type'],
              },
              {
                type: 'object',
                title: 'ThinkingConfigEnabled',
                description:
                  "Fields:\n- budget_tokens (required): int\n- type (required): Literal['enabled']",
                properties: {
                  budget_tokens: {
                    type: 'integer',
                    title: 'Budget Tokens',
                    description:
                      'Determines how many tokens Claude can use for its internal reasoning process. Larger budgets can enable more thorough analysis for complex problems, improving response quality. \n\nMust be ≥1024 and less than `max_tokens`.\n\nSee [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking) for details.',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['enabled'],
                  },
                },
                required: ['budget_tokens', 'type'],
              },
            ],
            title: 'Thinking',
            description:
              'Extended thinking configuration (Anthropic only). Enables thinking blocks showing reasoning process. Requires min 1,024 token budget.',
          },
          tool_choice: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
                additionalProperties: true,
              },
            ],
            title: 'Tool Choice',
            description:
              "Controls which (if any) tool is called by the model. 'none' stops tool calling, 'auto' lets the model decide, and 'required' forces at least one tool invocation. Specific tool payloads force that tool.",
          },
          tool_config: {
            type: 'object',
            title: 'Tool Config',
            description: 'Google tool configuration (function calling mode, etc.).',
            additionalProperties: true,
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description:
              "A list of tools the model may call. Supports OpenAI function tools and custom tools; use 'mcp_servers' for Dedalus-managed server-side tools.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description:
              'Top-k sampling. Anthropic: pass-through. Google: injected into generationConfig.topK.',
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description:
              "An integer between 0 and 20 specifying how many of the most likely tokens to return at each position, with log probabilities. Requires 'logprobs' to be true.",
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or 'temperature' but not both.",
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              "Stable identifier for your end-users. Helps OpenAI detect and prevent abuse and may boost cache hit rates. This field is being replaced by 'safety_identifier' and 'prompt_cache_key'.",
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description:
              "Constrains the verbosity of the model's response. Lower values produce concise answers, higher values allow more detail.",
            enum: ['low', 'medium', 'high'],
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description:
              "Configuration for OpenAI's web search tool. Learn more at https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat.",
            additionalProperties: true,
          },
        },
        required: ['model'],
      },
      {
        type: 'object',
        properties: {
          model: {
            anyOf: [
              {
                $ref: '#/$defs/model_id',
              },
              {
                $ref: '#/$defs/dedalus_model',
              },
              {
                $ref: '#/$defs/models',
              },
            ],
            title: 'Model',
            description:
              "Model(s) to use for completion. Can be a single model ID, a DedalusModel object, or a list for multi-model routing. Single model: 'openai/gpt-4', 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4', 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will choose optimal model based on task complexity.",
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description:
              'If true, the model response data is streamed to the client as it is generated using Server-Sent Events.',
            enum: [true],
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
            additionalProperties: true,
          },
          audio: {
            type: 'object',
            title: 'Audio',
            description:
              "Parameters for audio output. Required when requesting audio responses (for example, modalities including 'audio').",
            additionalProperties: true,
          },
          auto_execute_tools: {
            type: 'boolean',
            title: 'Auto Execute Tools',
            description:
              'When False, skip server-side tool execution and return raw OpenAI-style tool_calls in the response.',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description:
              'xAI-specific parameter. If set to true, the request returns a request_id for async completion retrieval via GET /v1/chat/deferred-completion/{request_id}.',
          },
          disable_automatic_function_calling: {
            type: 'boolean',
            title: 'Disable Automatic Function Calling',
            description:
              "Google-only flag to disable the SDK's automatic function execution. When true, the model returns function calls for the client to execute manually.",
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
          },
          function_call: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
                additionalProperties: true,
              },
            ],
            title: 'Function Call',
            description:
              "Deprecated in favor of 'tool_choice'. Controls which function is called by the model (none, auto, or specific name).",
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description:
              "Deprecated in favor of 'tools'. Legacy list of function definitions the model may generate JSON inputs for.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          generation_config: {
            type: 'object',
            title: 'Generation Config',
            description:
              'Google generationConfig object. Merged with auto-generated config. Use for Google-specific params (candidateCount, responseMimeType, etc.).',
            additionalProperties: true,
          },
          guardrails: {
            type: 'array',
            title: 'Guardrails',
            description:
              'Guardrails to apply to the agent for input/output validation and safety checks. Reserved for future use - guardrails configuration format not yet finalized.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description:
              'Configuration for multi-model handoffs and agent orchestration. Reserved for future use - handoff configuration format not yet finalized.',
            additionalProperties: true,
          },
          input: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Input',
            description:
              'Convenience alias for Responses-style `input`. Used when `messages` is omitted to provide the user prompt directly.',
          },
          instructions: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            ],
            title: 'Instructions',
            description:
              'Convenience alias for Responses-style `instructions`. Takes precedence over `system` and over system-role messages when provided.',
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description:
              'Modify the likelihood of specified tokens appearing in the completion. Accepts a JSON object mapping token IDs (as strings) to bias values from -100 to 100. The bias is added to the logits before sampling; values between -1 and 1 nudge selection probability, while values like -100 or 100 effectively ban or require a token.',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description:
              'Whether to return log probabilities of the output tokens. If true, returns the log probabilities for each token in the response content.',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description:
              'An upper bound for the number of tokens that can be generated for a completion, including visible output and reasoning tokens.',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              "The maximum number of tokens that can be generated in the chat completion. This value can be used to control costs for text generated via API. This value is now deprecated in favor of 'max_completion_tokens' and is not compatible with o-series models.",
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description:
              'Maximum number of turns for agent execution before terminating (default: 10). Each turn represents one model inference cycle. Higher values allow more complex reasoning but increase cost and latency.',
          },
          mcp_servers: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs (e.g., 'dedalus-labs/brave-search'), or structured objects specifying slug/version/url. MCP tools are executed server-side and billed separately.",
          },
          messages: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Messages',
            description:
              'Conversation history. Accepts either a list of message objects or a string, which is treated as a single user message. Optional if `input` or `instructions` is provided.',
          },
          metadata: {
            type: 'object',
            title: 'Metadata',
            description:
              'Set of up to 16 key-value string pairs that can be attached to the request for structured metadata.',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Modalities',
            description:
              "Output types you would like the model to generate. Most models default to ['text']; some support ['text', 'audio'].",
            items: {
              type: 'string',
            },
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              "Attributes for individual models used in routing decisions during multi-model execution. Format: {'model_name': {'attribute': value}}, where values are 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity', 'accuracy'. Used by agent to select optimal model based on task requirements.",
            additionalProperties: true,
          },
          n: {
            type: 'integer',
            title: 'N',
            description:
              "How many chat completion choices to generate for each input message. Keep 'n' as 1 to minimize costs.",
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel function calling during tool use.',
          },
          prediction: {
            type: 'object',
            title: 'Prediction',
            description:
              'Configuration for predicted outputs. Improves response times when you already know large portions of the response content.',
            additionalProperties: true,
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description:
              "Used by OpenAI to cache responses for similar requests and optimize cache hit rates. Replaces the legacy 'user' field for caching.",
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description:
              'Constrains effort on reasoning for supported reasoning models. Higher values use more compute, potentially improving reasoning quality at the cost of latency and tokens.',
            enum: ['low', 'medium', 'high'],
          },
          response_format: {
            anyOf: [
              {
                $ref: '#/$defs/response_format_text',
              },
              {
                $ref: '#/$defs/response_format_json_object',
              },
              {
                $ref: '#/$defs/response_format_json_schema',
              },
            ],
            title: 'Response Format',
            description:
              "An object specifying the format that the model must output. Use {'type': 'json_schema', 'json_schema': {...}} for structured outputs or {'type': 'json_object'} for the legacy JSON mode. Currently only OpenAI-prefixed models honour this field; Anthropic and Google requests will return an invalid_request_error if it is supplied.",
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description:
              'Stable identifier used to help detect users who might violate OpenAI usage policies. Consider hashing end-user identifiers before sending.',
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Google safety settings (harm categories and thresholds).',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          search_parameters: {
            type: 'object',
            title: 'Search Parameters',
            description:
              'xAI-specific parameter for configuring web search data acquisition. If not set, no data will be acquired by the model.',
            additionalProperties: true,
          },
          seed: {
            type: 'integer',
            title: 'Seed',
            description:
              'If specified, system will make a best effort to sample deterministically. Determinism is not guaranteed for the same seed across different models or API versions.',
          },
          service_tier: {
            type: 'string',
            title: 'Service Tier',
            description:
              "Specifies the processing tier used for the request. 'auto' uses project defaults, while 'default' forces standard pricing and performance.",
            enum: ['auto', 'default'],
          },
          stop: {
            type: 'array',
            title: 'Stop',
            description:
              "Not supported with latest reasoning models 'o3' and 'o4-mini'.\n\n        Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.",
            items: {
              type: 'string',
            },
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description:
              'Whether to store the output of this chat completion request for OpenAI model distillation or eval products. Image inputs over 8MB are dropped if storage is enabled.',
          },
          stream_options: {
            type: 'object',
            title: 'Stream Options',
            description:
              "Options for streaming responses. Only set when 'stream' is true (supports 'include_usage' and 'include_obfuscation').",
            additionalProperties: true,
          },
          system: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
            ],
            title: 'System',
            description:
              'System prompt/instructions. Anthropic: pass-through. Google: converted to systemInstruction. OpenAI: extracted from messages.',
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              "What sampling temperature to use, between 0 and 2. Higher values like 0.8 make the output more random, while lower values like 0.2 make it more focused and deterministic. We generally recommend altering this or 'top_p' but not both.",
          },
          thinking: {
            anyOf: [
              {
                type: 'object',
                title: 'ThinkingConfigDisabled',
                description: "Fields:\n- type (required): Literal['disabled']",
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['disabled'],
                  },
                },
                required: ['type'],
              },
              {
                type: 'object',
                title: 'ThinkingConfigEnabled',
                description:
                  "Fields:\n- budget_tokens (required): int\n- type (required): Literal['enabled']",
                properties: {
                  budget_tokens: {
                    type: 'integer',
                    title: 'Budget Tokens',
                    description:
                      'Determines how many tokens Claude can use for its internal reasoning process. Larger budgets can enable more thorough analysis for complex problems, improving response quality. \n\nMust be ≥1024 and less than `max_tokens`.\n\nSee [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking) for details.',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['enabled'],
                  },
                },
                required: ['budget_tokens', 'type'],
              },
            ],
            title: 'Thinking',
            description:
              'Extended thinking configuration (Anthropic only). Enables thinking blocks showing reasoning process. Requires min 1,024 token budget.',
          },
          tool_choice: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'object',
                additionalProperties: true,
              },
            ],
            title: 'Tool Choice',
            description:
              "Controls which (if any) tool is called by the model. 'none' stops tool calling, 'auto' lets the model decide, and 'required' forces at least one tool invocation. Specific tool payloads force that tool.",
          },
          tool_config: {
            type: 'object',
            title: 'Tool Config',
            description: 'Google tool configuration (function calling mode, etc.).',
            additionalProperties: true,
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description:
              "A list of tools the model may call. Supports OpenAI function tools and custom tools; use 'mcp_servers' for Dedalus-managed server-side tools.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description:
              'Top-k sampling. Anthropic: pass-through. Google: injected into generationConfig.topK.',
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description:
              "An integer between 0 and 20 specifying how many of the most likely tokens to return at each position, with log probabilities. Requires 'logprobs' to be true.",
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or 'temperature' but not both.",
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              "Stable identifier for your end-users. Helps OpenAI detect and prevent abuse and may boost cache hit rates. This field is being replaced by 'safety_identifier' and 'prompt_cache_key'.",
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description:
              "Constrains the verbosity of the model's response. Lower values produce concise answers, higher values allow more detail.",
            enum: ['low', 'medium', 'high'],
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description:
              "Configuration for OpenAI's web search tool. Learn more at https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat.",
            additionalProperties: true,
          },
        },
        required: ['model', 'stream'],
      },
    ],
    $defs: {
      model_id: {
        type: 'string',
        title: 'ModelId',
        description: "Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').",
      },
      dedalus_model: {
        type: 'object',
        title: 'DedalusModel',
        description:
          'Structured model selection entry used in request payloads.\n\nSupports OpenAI-style semantics (string model id) while enabling\noptional per-model default settings for Dedalus multi-model routing.',
        properties: {
          model: {
            type: 'string',
            title: 'Model',
            description:
              "Model identifier with provider prefix (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').",
          },
          settings: {
            type: 'object',
            title: 'ModelSettings',
            description:
              'Optional default generation settings (e.g., temperature, max_tokens) applied when this model is selected.',
            properties: {
              attributes: {
                type: 'object',
                title: 'Attributes',
                additionalProperties: true,
              },
              audio: {
                type: 'object',
                title: 'Audio',
                additionalProperties: true,
              },
              deferred: {
                type: 'boolean',
                title: 'Deferred',
              },
              disable_automatic_function_calling: {
                type: 'boolean',
                title: 'Disable Automatic Function Calling',
              },
              extra_args: {
                type: 'object',
                title: 'Extra Args',
                additionalProperties: true,
              },
              extra_headers: {
                type: 'object',
                additionalProperties: true,
              },
              extra_query: {
                type: 'object',
                additionalProperties: true,
              },
              frequency_penalty: {
                type: 'number',
                title: 'Frequency Penalty',
              },
              generation_config: {
                type: 'object',
                title: 'Generation Config',
                additionalProperties: true,
              },
              include_usage: {
                type: 'boolean',
                title: 'Include Usage',
              },
              input_audio_format: {
                type: 'string',
                title: 'Input Audio Format',
              },
              input_audio_transcription: {
                type: 'object',
                title: 'Input Audio Transcription',
                additionalProperties: true,
              },
              logit_bias: {
                type: 'object',
                title: 'Logit Bias',
                additionalProperties: true,
              },
              logprobs: {
                type: 'boolean',
                title: 'Logprobs',
              },
              max_completion_tokens: {
                type: 'integer',
                title: 'Max Completion Tokens',
              },
              max_tokens: {
                type: 'integer',
                title: 'Max Tokens',
              },
              metadata: {
                type: 'object',
                title: 'Metadata',
                additionalProperties: true,
              },
              modalities: {
                type: 'array',
                title: 'Modalities',
                items: {
                  type: 'string',
                },
              },
              n: {
                type: 'integer',
                title: 'N',
              },
              output_audio_format: {
                type: 'string',
                title: 'Output Audio Format',
              },
              parallel_tool_calls: {
                type: 'boolean',
                title: 'Parallel Tool Calls',
              },
              prediction: {
                type: 'object',
                title: 'Prediction',
                additionalProperties: true,
              },
              presence_penalty: {
                type: 'number',
                title: 'Presence Penalty',
              },
              prompt_cache_key: {
                type: 'string',
                title: 'Prompt Cache Key',
              },
              reasoning: {
                type: 'object',
                title: 'Reasoning',
                properties: {
                  effort: {
                    type: 'string',
                    title: 'Effort',
                    enum: ['minimal', 'low', 'medium', 'high'],
                  },
                  generate_summary: {
                    type: 'string',
                    title: 'Generate Summary',
                    enum: ['auto', 'concise', 'detailed'],
                  },
                  summary: {
                    type: 'string',
                    title: 'Summary',
                    enum: ['auto', 'concise', 'detailed'],
                  },
                },
              },
              reasoning_effort: {
                type: 'string',
                title: 'Reasoning Effort',
              },
              response_format: {
                type: 'object',
                title: 'Response Format',
                additionalProperties: true,
              },
              response_include: {
                type: 'array',
                title: 'Response Include',
                items: {
                  type: 'string',
                  enum: [
                    'file_search_call.results',
                    'web_search_call.results',
                    'web_search_call.action.sources',
                    'message.input_image.image_url',
                    'computer_call_output.output.image_url',
                    'code_interpreter_call.outputs',
                    'reasoning.encrypted_content',
                    'message.output_text.logprobs',
                  ],
                },
              },
              safety_identifier: {
                type: 'string',
                title: 'Safety Identifier',
              },
              safety_settings: {
                type: 'array',
                title: 'Safety Settings',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
              },
              search_parameters: {
                type: 'object',
                title: 'Search Parameters',
                additionalProperties: true,
              },
              seed: {
                type: 'integer',
                title: 'Seed',
              },
              service_tier: {
                type: 'string',
                title: 'Service Tier',
              },
              stop: {
                anyOf: [
                  {
                    type: 'string',
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                ],
                title: 'Stop',
              },
              store: {
                type: 'boolean',
                title: 'Store',
              },
              stream: {
                type: 'boolean',
                title: 'Stream',
              },
              stream_options: {
                type: 'object',
                title: 'Stream Options',
                additionalProperties: true,
              },
              structured_output: {
                type: 'object',
                title: 'Structured Output',
                additionalProperties: true,
              },
              system_instruction: {
                type: 'object',
                title: 'System Instruction',
                additionalProperties: true,
              },
              temperature: {
                type: 'number',
                title: 'Temperature',
              },
              thinking: {
                type: 'object',
                title: 'Thinking',
                additionalProperties: true,
              },
              timeout: {
                type: 'number',
                title: 'Timeout',
              },
              tool_choice: {
                anyOf: [
                  {
                    type: 'string',
                    enum: ['auto', 'required', 'none'],
                  },
                  {
                    type: 'string',
                  },
                  {
                    type: 'object',
                    additionalProperties: true,
                  },
                  {
                    type: 'object',
                    title: 'MCPToolChoice',
                    properties: {
                      name: {
                        type: 'string',
                        title: 'Name',
                      },
                      server_label: {
                        type: 'string',
                        title: 'Server Label',
                      },
                    },
                    required: ['name', 'server_label'],
                  },
                ],
              },
              tool_config: {
                type: 'object',
                title: 'Tool Config',
                additionalProperties: true,
              },
              top_k: {
                type: 'integer',
                title: 'Top K',
              },
              top_logprobs: {
                type: 'integer',
                title: 'Top Logprobs',
              },
              top_p: {
                type: 'number',
                title: 'Top P',
              },
              truncation: {
                type: 'string',
                title: 'Truncation',
                enum: ['auto', 'disabled'],
              },
              turn_detection: {
                type: 'object',
                title: 'Turn Detection',
                additionalProperties: true,
              },
              use_responses: {
                type: 'boolean',
                title: 'Use Responses',
              },
              user: {
                type: 'string',
                title: 'User',
              },
              verbosity: {
                type: 'string',
                title: 'Verbosity',
              },
              voice: {
                type: 'string',
                title: 'Voice',
              },
              web_search_options: {
                type: 'object',
                title: 'Web Search Options',
                additionalProperties: true,
              },
            },
          },
        },
        required: ['model'],
      },
      models: {
        type: 'array',
        title: 'Models',
        description: 'List of models for multi-model routing.',
        items: {
          $ref: '#/$defs/dedalus_model_choice',
        },
      },
      dedalus_model_choice: {
        anyOf: [
          {
            $ref: '#/$defs/model_id',
          },
          {
            $ref: '#/$defs/dedalus_model',
          },
        ],
        title: 'DedalusModelChoice',
        description: 'Dedalus model choice - either a string ID or DedalusModel configuration object.',
      },
      response_format_text: {
        type: 'object',
        title: 'ResponseFormatText',
        description:
          "Default response format. Used to generate text responses.\n\nFields:\n  - type (required): Literal['text']",
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of response format being defined. Always `text`.',
            enum: ['text'],
          },
        },
        required: ['type'],
      },
      response_format_json_object: {
        type: 'object',
        title: 'ResponseFormatJSONObject',
        description:
          "JSON object response format. An older method of generating JSON responses.\n\nUsing `json_schema` is recommended for models that support it. Note that the\nmodel will not generate JSON without a system or user message instructing it\nto do so.\n\nFields:\n  - type (required): Literal['json_object']",
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of response format being defined. Always `json_object`.',
            enum: ['json_object'],
          },
        },
        required: ['type'],
      },
      response_format_json_schema: {
        type: 'object',
        title: 'ResponseFormatJSONSchema',
        description:
          "JSON Schema response format. Used to generate structured JSON responses.\n\nLearn more about [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).\n\nFields:\n  - type (required): Literal['json_schema']\n  - json_schema (required): JSONSchema",
        properties: {
          json_schema: {
            type: 'object',
            title: 'ResponseFormatJSONSchemaConfig',
            description: 'Structured Outputs configuration options, including a JSON Schema.',
            properties: {
              name: {
                type: 'string',
                title: 'Name',
                description:
                  'The name of the response format. Must be a-z, A-Z, 0-9, or contain\nunderscores and dashes, with a maximum length of 64.',
              },
              description: {
                type: 'string',
                title: 'Description',
                description:
                  'A description of what the response format is for, used by the model to\ndetermine how to respond in the format.',
              },
              schema: {
                type: 'object',
                title: 'ResponseFormatJSONSchemaSchema',
                description:
                  'The schema for the response format, described as a JSON Schema object.\nLearn how to build JSON schemas [here](https://json-schema.org/).',
                additionalProperties: true,
              },
              strict: {
                type: 'boolean',
                title: 'Strict',
                description:
                  'Whether to enable strict schema adherence when generating the output.\nIf set to true, the model will always follow the exact schema defined\nin the `schema` field. Only a subset of JSON Schema is supported when\n`strict` is `true`. To learn more, read the [Structured Outputs\nguide](https://platform.openai.com/docs/guides/structured-outputs).',
              },
            },
            required: ['name'],
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of response format being defined. Always `json_schema`.',
            enum: ['json_schema'],
          },
        },
        required: ['json_schema', 'type'],
      },
    },
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.chat.completions.create(body));
};

export default { metadata, tool, handler };
