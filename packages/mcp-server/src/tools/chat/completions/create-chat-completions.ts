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
    'Create a chat completion.\n\nThis endpoint provides a vendor-agnostic chat completions API that works with\nthousands of LLMs. It supports MCP integration, multi-model routing with\nintelligent agentic handoffs, client-side and server-side tool execution,\nand streaming and non-streaming responses.\n\nArgs:\n    request: Chat completion request with messages, model, and configuration.\n    http_request: FastAPI request object for accessing headers and state.\n    background_tasks: FastAPI background tasks for async billing operations.\n    user: Authenticated user with validated API key and sufficient balance.\n\nReturns:\n    ChatCompletion: OpenAI-compatible completion response with usage data.\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails or insufficient balance.\n        - 400 if request validation fails.\n        - 500 if internal processing error occurs.\n\nBilling:\n    - Token usage billed automatically based on model pricing\n    - MCP tool calls billed separately using credits system\n    - Streaming responses billed after completion via background task\n\nExample:\n    Basic chat completion:\n    ```python\n    from dedalus_labs import Dedalus\n\n    client = Dedalus(api_key="your-api-key")\n\n    completion = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Hello, how are you?"}],\n    )\n\n    print(completion.choices[0].message.content)\n    ```\n\n    With tools and MCP servers:\n    ```python\n    completion = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Search for recent AI news"}],\n        tools=[\n            {\n                "type": "function",\n                "function": {\n                    "name": "search_web",\n                    "description": "Search the web for information",\n                },\n            }\n        ],\n        mcp_servers=["dedalus-labs/brave-search"],\n    )\n    ```\n\n    Multi-model routing:\n    ```python\n    completion = client.chat.completions.create(\n        model=[\n            "openai/gpt-4o-mini",\n            "openai/gpt-5",\n            "anthropic/claude-sonnet-4-20250514",\n        ],\n        messages=[{"role": "user", "content": "Analyze this complex data"}],\n        agent_attributes={"complexity": 0.8, "accuracy": 0.9},\n    )\n    ```\n\n    Streaming response:\n    ```python\n    stream = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Tell me a story"}],\n        stream=True,\n    )\n\n    for chunk in stream:\n        if chunk.choices[0].delta.content:\n            print(chunk.choices[0].delta.content, end="")\n    ```',
  inputSchema: {
    type: 'object',
    anyOf: [
      {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            title: 'Messages',
            description:
              'A list of messages comprising the conversation so far. Depending on the model you use, different message types (modalities) are supported, like text, images, and audio.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
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
                type: 'array',
                title: 'MCPServers',
                description: 'List of MCP servers.',
                items: {
                  anyOf: [
                    {
                      type: 'string',
                      title: 'MCPServerSlug',
                      description: "MCP server slug (e.g., 'dedalus-labs/brave-search').",
                    },
                    {
                      type: 'object',
                      title: 'MCPServerSpec',
                      description: 'Structured representation of an MCP server reference.',
                      properties: {
                        metadata: {
                          type: 'object',
                          title: 'Metadata',
                          description: 'Optional metadata associated with the MCP server entry.',
                          additionalProperties: true,
                        },
                        slug: {
                          type: 'string',
                          title: 'Slug',
                          description: "Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').",
                        },
                        url: {
                          type: 'string',
                          title: 'Url',
                          description: 'Explicit MCP server URL.',
                        },
                        version: {
                          type: 'string',
                          title: 'Version',
                          description: 'Optional explicit version to target when using a slug.',
                        },
                      },
                    },
                  ],
                  title: 'MCPServerChoice',
                  description: 'MCP server choice - either a slug string or full MCPServerSpec object.',
                },
              },
              {
                type: 'string',
                title: 'MCPServerSlug',
                description: "MCP server slug (e.g., 'dedalus-labs/brave-search').",
              },
              {
                type: 'object',
                title: 'MCPServerSpec',
                description: 'Structured representation of an MCP server reference.',
                properties: {
                  metadata: {
                    type: 'object',
                    title: 'Metadata',
                    description: 'Optional metadata associated with the MCP server entry.',
                    additionalProperties: true,
                  },
                  slug: {
                    type: 'string',
                    title: 'Slug',
                    description: "Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').",
                  },
                  url: {
                    type: 'string',
                    title: 'Url',
                    description: 'Explicit MCP server URL.',
                  },
                  version: {
                    type: 'string',
                    title: 'Version',
                    description: 'Optional explicit version to target when using a slug.',
                  },
                },
              },
            ],
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs (e.g., 'dedalus-labs/brave-search'), or structured objects specifying slug/version/url. MCP tools are executed server-side and billed separately.",
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
            type: 'object',
            title: 'Response Format',
            description:
              "An object specifying the format that the model must output. Use {'type': 'json_schema', 'json_schema': {...}} for structured outputs or {'type': 'json_object'} for the legacy JSON mode.",
            additionalProperties: true,
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
        required: ['messages', 'model'],
      },
      {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            title: 'Messages',
            description:
              'A list of messages comprising the conversation so far. Depending on the model you use, different message types (modalities) are supported, like text, images, and audio.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
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
                type: 'array',
                title: 'MCPServers',
                description: 'List of MCP servers.',
                items: {
                  anyOf: [
                    {
                      type: 'string',
                      title: 'MCPServerSlug',
                      description: "MCP server slug (e.g., 'dedalus-labs/brave-search').",
                    },
                    {
                      type: 'object',
                      title: 'MCPServerSpec',
                      description: 'Structured representation of an MCP server reference.',
                      properties: {
                        metadata: {
                          type: 'object',
                          title: 'Metadata',
                          description: 'Optional metadata associated with the MCP server entry.',
                          additionalProperties: true,
                        },
                        slug: {
                          type: 'string',
                          title: 'Slug',
                          description: "Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').",
                        },
                        url: {
                          type: 'string',
                          title: 'Url',
                          description: 'Explicit MCP server URL.',
                        },
                        version: {
                          type: 'string',
                          title: 'Version',
                          description: 'Optional explicit version to target when using a slug.',
                        },
                      },
                    },
                  ],
                  title: 'MCPServerChoice',
                  description: 'MCP server choice - either a slug string or full MCPServerSpec object.',
                },
              },
              {
                type: 'string',
                title: 'MCPServerSlug',
                description: "MCP server slug (e.g., 'dedalus-labs/brave-search').",
              },
              {
                type: 'object',
                title: 'MCPServerSpec',
                description: 'Structured representation of an MCP server reference.',
                properties: {
                  metadata: {
                    type: 'object',
                    title: 'Metadata',
                    description: 'Optional metadata associated with the MCP server entry.',
                    additionalProperties: true,
                  },
                  slug: {
                    type: 'string',
                    title: 'Slug',
                    description: "Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').",
                  },
                  url: {
                    type: 'string',
                    title: 'Url',
                    description: 'Explicit MCP server URL.',
                  },
                  version: {
                    type: 'string',
                    title: 'Version',
                    description: 'Optional explicit version to target when using a slug.',
                  },
                },
              },
            ],
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs (e.g., 'dedalus-labs/brave-search'), or structured objects specifying slug/version/url. MCP tools are executed server-side and billed separately.",
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
            type: 'object',
            title: 'Response Format',
            description:
              "An object specifying the format that the model must output. Use {'type': 'json_schema', 'json_schema': {...}} for structured outputs or {'type': 'json_object'} for the legacy JSON mode.",
            additionalProperties: true,
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
        required: ['messages', 'model', 'stream'],
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
              extra_args: {
                type: 'object',
                title: 'Extra Args',
                additionalProperties: true,
              },
              extra_body: {
                type: 'object',
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
                    'code_interpreter_call.outputs',
                    'computer_call_output.output.image_url',
                    'file_search_call.results',
                    'message.input_image.image_url',
                    'message.output_text.logprobs',
                    'reasoning.encrypted_content',
                  ],
                },
              },
              safety_settings: {
                type: 'array',
                title: 'Safety Settings',
                items: {
                  type: 'object',
                  additionalProperties: true,
                },
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
              voice: {
                type: 'string',
                title: 'Voice',
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
    },
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.chat.completions.create(body));
};

export default { metadata, tool, handler };
