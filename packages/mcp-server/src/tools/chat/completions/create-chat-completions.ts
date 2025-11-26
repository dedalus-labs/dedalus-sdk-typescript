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
    'Create a chat completion.\n\nGenerates a model response for the given conversation and configuration.\nSupports OpenAI-compatible parameters and provider-specific extensions.\n\nHeaders:\n  - Authorization: bearer key for the calling account.\n  - Optional BYOK or provider headers if applicable.\n\nBehavior:\n  - If multiple models are supplied, the first one is used, and the agent may hand off to another model.\n  - Tools may be invoked on the server or signaled for the client to run.\n  - Streaming responses emit incremental deltas; non-streaming returns a single object.\n  - Usage metrics are computed when available and returned in the response.\n\nResponses:\n  - 200 OK: JSON completion object with choices, message content, and usage.\n  - 400 Bad Request: validation error.\n  - 401 Unauthorized: authentication failed.\n  - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit issue.\n  - 500 Internal Server Error: unexpected failure.\n\nBilling:\n  - Token usage metered by the selected model(s).\n  - Tool calls and MCP sessions may be billed separately.\n  - Streaming is settled after the stream ends via an async task.\n\nExample (non-streaming HTTP):\n  POST /v1/chat/completions\n  Content-Type: application/json\n  Authorization: Bearer <key>\n\n  {\n    "model": "provider/model-name",\n    "messages": [{"role": "user", "content": "Hello"}]\n  }\n\n  200 OK\n  {\n    "id": "cmpl_123",\n    "object": "chat.completion",\n    "choices": [\n      {"index": 0, "message": {"role": "assistant", "content": "Hi there!"}, "finish_reason": "stop"}\n    ],\n    "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7}\n  }\n\nExample (streaming over SSE):\n  POST /v1/chat/completions\n  Accept: text/event-stream\n\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":"Hi"}}]}\n  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":" there!"}}]}\n  data: [DONE]',
  inputSchema: {
    type: 'object',
    anyOf: [
      {
        type: 'object',
        properties: {
          model: {
            anyOf: [
              {
                type: 'string',
                title: 'ModelId',
                description: "Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').",
              },
              {
                $ref: '#/$defs/dedalus_model',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/dedalus_model_choice',
                },
              },
            ],
            title: 'Model',
            description:
              'Model identifier. Accepts model ID strings, lists for routing, or DedalusModel objects with per-model settings.',
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description: 'Agent attributes. Values in [0.0, 1.0].',
            additionalProperties: true,
          },
          audio: {
            type: 'object',
            title: 'Audio',
            description: 'Parameters for audio output. Required when audio output is requested with `mo...',
            additionalProperties: true,
          },
          automatic_tool_execution: {
            type: 'boolean',
            title: 'Automatic Tool Execution',
            description: 'Execute tools server-side. If false, returns raw tool calls for manual handling.',
          },
          cachedContent: {
            type: 'string',
            title: 'Cachedcontent',
            description: 'Optional. The name of the content [cached](https://ai.google.dev/gemini-api/d...',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description: 'If set to `true`, the request returns a `request_id`. You can then get the de...',
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on the...',
          },
          function_call: {
            type: 'string',
            title: 'Function Call',
            description: 'Deprecated in favor of `tool_choice`.  Controls which (if any) function is ca...',
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description: 'Deprecated in favor of `tools`.  A list of functions the model may generate J...',
            items: {
              $ref: '#/$defs/chat_completion_functions',
            },
          },
          generation_config: {
            type: 'object',
            title: 'Generation Config',
            description: 'Generation parameters wrapper (Google-specific)',
            additionalProperties: true,
          },
          guardrails: {
            type: 'array',
            title: 'Guardrails',
            description: 'Content filtering and safety policy configuration.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description: 'Configuration for multi-model handoffs.',
            additionalProperties: true,
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description: 'Modify the likelihood of specified tokens appearing in the completion.  Accep...',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description: 'Whether to return log probabilities of the output tokens or not. If true, ret...',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description: 'Maximum tokens in completion (newer parameter name)',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description: 'Maximum tokens in completion',
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description: 'Maximum conversation turns.',
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
            description: 'MCP server identifiers. Accepts URLs, repository slugs, or server IDs.',
          },
          messages: {
            type: 'array',
            title: 'Messages',
            description: 'Conversation history (OpenAI: messages, Google: contents, Responses: input)',
            items: {
              anyOf: [
                {
                  $ref: '#/$defs/chat_completion_developer_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_system_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_user_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_assistant_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_tool_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_function_message_param',
                },
              ],
              description:
                'Developer-provided instructions that the model should follow, regardless of\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n- content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]\n- role (required): Literal["developer"]\n- name (optional): str',
            },
          },
          metadata: {
            type: 'object',
            title: 'Metadata',
            description: 'Set of 16 key-value pairs that can be attached to an object. This can be usef...',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Modalities',
            description: 'Output types that you would like the model to generate. Most models are capab...',
            items: {
              type: 'string',
            },
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              'Model attributes for routing. Maps model IDs to attribute dictionaries with values in [0.0, 1.0].',
            additionalProperties: true,
          },
          n: {
            type: 'integer',
            title: 'N',
            description: 'How many chat completion choices to generate for each input message. Note tha...',
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel tool calls (Anthropic uses inverted polarity)',
          },
          prediction: {
            $ref: '#/$defs/prediction_content',
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on whe...',
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description: 'Used by OpenAI to cache responses for similar requests to optimize your cache...',
          },
          prompt_cache_retention: {
            type: 'string',
            title: 'Prompt Cache Retention',
            description: 'The retention policy for the prompt cache. Set to `24h` to enable extended pr...',
          },
          prompt_mode: {
            type: 'object',
            title: 'Prompt Mode',
            description: 'Allows toggling between the reasoning mode and no system prompt. When set to ...',
            additionalProperties: true,
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description: 'Constrains effort on reasoning for [reasoning models](https://platform.openai...',
          },
          response_format: {
            anyOf: [
              {
                $ref: '#/$defs/response_format_text',
              },
              {
                $ref: '#/$defs/response_format_json_schema',
              },
              {
                $ref: '#/$defs/response_format_json_object',
              },
            ],
            title: 'Response Format',
            description: 'An object specifying the format that the model must output.  Setting to `{ "...',
          },
          safe_prompt: {
            type: 'boolean',
            title: 'Safe Prompt',
            description: 'Whether to inject a safety prompt before all conversations.',
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description: 'A stable identifier used to help detect users of your application that may be...',
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Safety/content filtering settings (Google-specific)',
            items: {
              type: 'object',
              title: 'SafetySetting',
              description:
                'Safety setting, affecting the safety-blocking behavior.\n\nPassing a safety setting for a category changes the allowed probability that\ncontent is blocked.\n\nFields:\n- category (required): HarmCategory\n- threshold (required): Literal["HARM_BLOCK_THRESHOLD_UNSPECIFIED", "BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE", "OFF"]',
              properties: {
                category: {
                  type: 'string',
                  title: 'Category',
                  description: 'Required. The category for this setting.',
                  enum: [
                    'HARM_CATEGORY_UNSPECIFIED',
                    'HARM_CATEGORY_DEROGATORY',
                    'HARM_CATEGORY_TOXICITY',
                    'HARM_CATEGORY_VIOLENCE',
                    'HARM_CATEGORY_SEXUAL',
                    'HARM_CATEGORY_MEDICAL',
                    'HARM_CATEGORY_DANGEROUS',
                    'HARM_CATEGORY_HARASSMENT',
                    'HARM_CATEGORY_HATE_SPEECH',
                    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    'HARM_CATEGORY_DANGEROUS_CONTENT',
                    'HARM_CATEGORY_CIVIC_INTEGRITY',
                  ],
                },
                threshold: {
                  type: 'string',
                  title: 'Threshold',
                  description: 'Required. Controls the probability threshold at which harm is blocked.',
                  enum: [
                    'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
                    'BLOCK_LOW_AND_ABOVE',
                    'BLOCK_MEDIUM_AND_ABOVE',
                    'BLOCK_ONLY_HIGH',
                    'BLOCK_NONE',
                    'OFF',
                  ],
                },
              },
              required: ['category', 'threshold'],
            },
          },
          search_parameters: {
            type: 'object',
            title: 'Search Parameters',
            description: 'Set the parameters to be used for searched data. If not set, no data will be ...',
            additionalProperties: true,
          },
          seed: {
            type: 'integer',
            title: 'Seed',
            description: 'Random seed for deterministic output',
          },
          service_tier: {
            type: 'string',
            title: 'Service Tier',
            description: 'Service tier for request processing',
          },
          stop: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Stop',
            description: 'Not supported with latest reasoning models `o3` and `o4-mini`.  Up to 4 seque...',
          },
          stop_sequences: {
            type: 'array',
            title: 'Stop Sequences',
            description: 'Custom text sequences that will cause the model to stop generating.  Our mode...',
            items: {
              type: 'string',
            },
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description: 'Whether or not to store the output of this chat completion request for use in...',
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description: 'Enable streaming response',
            enum: [false],
          },
          stream_options: {
            type: 'object',
            title: 'Stream Options',
            description: 'Options for streaming response. Only set this when you set `stream: true`. ',
            additionalProperties: true,
          },
          system_instruction: {
            anyOf: [
              {
                type: 'object',
                additionalProperties: true,
              },
              {
                type: 'string',
              },
            ],
            title: 'System Instruction',
            description: 'System instruction/prompt',
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description: 'Sampling temperature (0-2 for most providers)',
          },
          thinking: {
            anyOf: [
              {
                $ref: '#/$defs/thinking_config_enabled',
              },
              {
                $ref: '#/$defs/thinking_config_disabled',
              },
            ],
            title: 'Thinking',
            description: 'Extended thinking configuration (Anthropic-specific)',
          },
          tool_choice: {
            anyOf: [
              {
                $ref: '#/$defs/tool_choice_auto',
              },
              {
                $ref: '#/$defs/tool_choice_any',
              },
              {
                $ref: '#/$defs/tool_choice_tool',
              },
              {
                $ref: '#/$defs/tool_choice_none',
              },
            ],
            title: 'Tool Choice',
            description: 'Controls which (if any) tool is called by the model. `none` means the model w...',
          },
          tool_config: {
            type: 'object',
            title: 'Tool Config',
            description: 'Tool calling configuration (Google-specific)',
            additionalProperties: true,
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description: 'Available tools/functions for the model',
            items: {
              anyOf: [
                {
                  $ref: '#/$defs/chat_completion_tool_param',
                },
                {
                  type: 'object',
                  title: 'CustomToolChatCompletions',
                  description:
                    'A custom tool that processes input using a specified format.\n\nFields:\n- type (required): Literal["custom"]\n- custom (required): CustomToolProperties',
                  properties: {
                    custom: {
                      type: 'object',
                      title: 'CustomToolProperties',
                      description: 'Properties of the custom tool.',
                      properties: {
                        name: {
                          type: 'string',
                          title: 'Name',
                          description: 'The name of the custom tool, used to identify it in tool calls.',
                        },
                        description: {
                          type: 'string',
                          title: 'Description',
                          description:
                            'Optional description of the custom tool, used to provide more context.',
                        },
                        format: {
                          anyOf: [
                            {
                              type: 'object',
                              title: 'TextFormat',
                              description:
                                'Unconstrained free-form text.\n\nFields:\n- type (required): Literal["text"]',
                              properties: {
                                type: {
                                  type: 'string',
                                  title: 'Type',
                                  description: 'Unconstrained text format. Always `text`.',
                                  enum: ['text'],
                                },
                              },
                              required: ['type'],
                            },
                            {
                              type: 'object',
                              title: 'GrammarFormat',
                              description:
                                'A grammar defined by the user.\n\nFields:\n- type (required): Literal["grammar"]\n- grammar (required): GrammarFormatGrammarFormat',
                              properties: {
                                grammar: {
                                  type: 'object',
                                  title: 'GrammarFormatGrammarFormat',
                                  description: 'Your chosen grammar.',
                                  properties: {
                                    definition: {
                                      type: 'string',
                                      title: 'Definition',
                                      description: 'The grammar definition.',
                                    },
                                    syntax: {
                                      type: 'string',
                                      title: 'Syntax',
                                      description:
                                        'The syntax of the grammar definition. One of `lark` or `regex`.',
                                      enum: ['lark', 'regex'],
                                    },
                                  },
                                  required: ['definition', 'syntax'],
                                },
                                type: {
                                  type: 'string',
                                  title: 'Type',
                                  description: 'Grammar format. Always `grammar`.',
                                  enum: ['grammar'],
                                },
                              },
                              required: ['grammar', 'type'],
                            },
                          ],
                          title: 'Format',
                          description: 'The input format for the custom tool. Default is unconstrained text.',
                        },
                      },
                      required: ['name'],
                    },
                    type: {
                      type: 'string',
                      title: 'Type',
                      description: 'The type of the custom tool. Always `custom`.',
                      enum: ['custom'],
                    },
                  },
                  required: ['custom', 'type'],
                },
              ],
              description:
                'A function tool that can be used to generate a response.\n\nFields:\n- type (required): Literal["function"]\n- function (required): FunctionObject',
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description: 'Top-k sampling parameter',
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description: 'An integer between 0 and 20 specifying the number of most likely tokens to re...',
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description: 'Nucleus sampling threshold',
          },
          user: {
            type: 'string',
            title: 'User',
            description: 'This field is being replaced by `safety_identifier` and `prompt_cache_key`. U...',
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description: "Constrains the verbosity of the model's response. Lower values will result in...",
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description: 'This tool searches the web for relevant results to use in a response. Learn m...',
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
                type: 'string',
                title: 'ModelId',
                description: "Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').",
              },
              {
                $ref: '#/$defs/dedalus_model',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/dedalus_model_choice',
                },
              },
            ],
            title: 'Model',
            description:
              'Model identifier. Accepts model ID strings, lists for routing, or DedalusModel objects with per-model settings.',
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description: 'Enable streaming response',
            enum: [true],
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description: 'Agent attributes. Values in [0.0, 1.0].',
            additionalProperties: true,
          },
          audio: {
            type: 'object',
            title: 'Audio',
            description: 'Parameters for audio output. Required when audio output is requested with `mo...',
            additionalProperties: true,
          },
          automatic_tool_execution: {
            type: 'boolean',
            title: 'Automatic Tool Execution',
            description: 'Execute tools server-side. If false, returns raw tool calls for manual handling.',
          },
          cachedContent: {
            type: 'string',
            title: 'Cachedcontent',
            description: 'Optional. The name of the content [cached](https://ai.google.dev/gemini-api/d...',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description: 'If set to `true`, the request returns a `request_id`. You can then get the de...',
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on the...',
          },
          function_call: {
            type: 'string',
            title: 'Function Call',
            description: 'Deprecated in favor of `tool_choice`.  Controls which (if any) function is ca...',
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description: 'Deprecated in favor of `tools`.  A list of functions the model may generate J...',
            items: {
              $ref: '#/$defs/chat_completion_functions',
            },
          },
          generation_config: {
            type: 'object',
            title: 'Generation Config',
            description: 'Generation parameters wrapper (Google-specific)',
            additionalProperties: true,
          },
          guardrails: {
            type: 'array',
            title: 'Guardrails',
            description: 'Content filtering and safety policy configuration.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description: 'Configuration for multi-model handoffs.',
            additionalProperties: true,
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description: 'Modify the likelihood of specified tokens appearing in the completion.  Accep...',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description: 'Whether to return log probabilities of the output tokens or not. If true, ret...',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description: 'Maximum tokens in completion (newer parameter name)',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description: 'Maximum tokens in completion',
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description: 'Maximum conversation turns.',
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
            description: 'MCP server identifiers. Accepts URLs, repository slugs, or server IDs.',
          },
          messages: {
            type: 'array',
            title: 'Messages',
            description: 'Conversation history (OpenAI: messages, Google: contents, Responses: input)',
            items: {
              anyOf: [
                {
                  $ref: '#/$defs/chat_completion_developer_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_system_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_user_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_assistant_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_tool_message_param',
                },
                {
                  $ref: '#/$defs/chat_completion_function_message_param',
                },
              ],
              description:
                'Developer-provided instructions that the model should follow, regardless of\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n- content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]\n- role (required): Literal["developer"]\n- name (optional): str',
            },
          },
          metadata: {
            type: 'object',
            title: 'Metadata',
            description: 'Set of 16 key-value pairs that can be attached to an object. This can be usef...',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Modalities',
            description: 'Output types that you would like the model to generate. Most models are capab...',
            items: {
              type: 'string',
            },
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              'Model attributes for routing. Maps model IDs to attribute dictionaries with values in [0.0, 1.0].',
            additionalProperties: true,
          },
          n: {
            type: 'integer',
            title: 'N',
            description: 'How many chat completion choices to generate for each input message. Note tha...',
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel tool calls (Anthropic uses inverted polarity)',
          },
          prediction: {
            $ref: '#/$defs/prediction_content',
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description: 'Number between -2.0 and 2.0. Positive values penalize new tokens based on whe...',
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description: 'Used by OpenAI to cache responses for similar requests to optimize your cache...',
          },
          prompt_cache_retention: {
            type: 'string',
            title: 'Prompt Cache Retention',
            description: 'The retention policy for the prompt cache. Set to `24h` to enable extended pr...',
          },
          prompt_mode: {
            type: 'object',
            title: 'Prompt Mode',
            description: 'Allows toggling between the reasoning mode and no system prompt. When set to ...',
            additionalProperties: true,
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description: 'Constrains effort on reasoning for [reasoning models](https://platform.openai...',
          },
          response_format: {
            anyOf: [
              {
                $ref: '#/$defs/response_format_text',
              },
              {
                $ref: '#/$defs/response_format_json_schema',
              },
              {
                $ref: '#/$defs/response_format_json_object',
              },
            ],
            title: 'Response Format',
            description: 'An object specifying the format that the model must output.  Setting to `{ "...',
          },
          safe_prompt: {
            type: 'boolean',
            title: 'Safe Prompt',
            description: 'Whether to inject a safety prompt before all conversations.',
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description: 'A stable identifier used to help detect users of your application that may be...',
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Safety/content filtering settings (Google-specific)',
            items: {
              type: 'object',
              title: 'SafetySetting',
              description:
                'Safety setting, affecting the safety-blocking behavior.\n\nPassing a safety setting for a category changes the allowed probability that\ncontent is blocked.\n\nFields:\n- category (required): HarmCategory\n- threshold (required): Literal["HARM_BLOCK_THRESHOLD_UNSPECIFIED", "BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH", "BLOCK_NONE", "OFF"]',
              properties: {
                category: {
                  type: 'string',
                  title: 'Category',
                  description: 'Required. The category for this setting.',
                  enum: [
                    'HARM_CATEGORY_UNSPECIFIED',
                    'HARM_CATEGORY_DEROGATORY',
                    'HARM_CATEGORY_TOXICITY',
                    'HARM_CATEGORY_VIOLENCE',
                    'HARM_CATEGORY_SEXUAL',
                    'HARM_CATEGORY_MEDICAL',
                    'HARM_CATEGORY_DANGEROUS',
                    'HARM_CATEGORY_HARASSMENT',
                    'HARM_CATEGORY_HATE_SPEECH',
                    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    'HARM_CATEGORY_DANGEROUS_CONTENT',
                    'HARM_CATEGORY_CIVIC_INTEGRITY',
                  ],
                },
                threshold: {
                  type: 'string',
                  title: 'Threshold',
                  description: 'Required. Controls the probability threshold at which harm is blocked.',
                  enum: [
                    'HARM_BLOCK_THRESHOLD_UNSPECIFIED',
                    'BLOCK_LOW_AND_ABOVE',
                    'BLOCK_MEDIUM_AND_ABOVE',
                    'BLOCK_ONLY_HIGH',
                    'BLOCK_NONE',
                    'OFF',
                  ],
                },
              },
              required: ['category', 'threshold'],
            },
          },
          search_parameters: {
            type: 'object',
            title: 'Search Parameters',
            description: 'Set the parameters to be used for searched data. If not set, no data will be ...',
            additionalProperties: true,
          },
          seed: {
            type: 'integer',
            title: 'Seed',
            description: 'Random seed for deterministic output',
          },
          service_tier: {
            type: 'string',
            title: 'Service Tier',
            description: 'Service tier for request processing',
          },
          stop: {
            anyOf: [
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              {
                type: 'string',
              },
            ],
            title: 'Stop',
            description: 'Not supported with latest reasoning models `o3` and `o4-mini`.  Up to 4 seque...',
          },
          stop_sequences: {
            type: 'array',
            title: 'Stop Sequences',
            description: 'Custom text sequences that will cause the model to stop generating.  Our mode...',
            items: {
              type: 'string',
            },
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description: 'Whether or not to store the output of this chat completion request for use in...',
          },
          stream_options: {
            type: 'object',
            title: 'Stream Options',
            description: 'Options for streaming response. Only set this when you set `stream: true`. ',
            additionalProperties: true,
          },
          system_instruction: {
            anyOf: [
              {
                type: 'object',
                additionalProperties: true,
              },
              {
                type: 'string',
              },
            ],
            title: 'System Instruction',
            description: 'System instruction/prompt',
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description: 'Sampling temperature (0-2 for most providers)',
          },
          thinking: {
            anyOf: [
              {
                $ref: '#/$defs/thinking_config_enabled',
              },
              {
                $ref: '#/$defs/thinking_config_disabled',
              },
            ],
            title: 'Thinking',
            description: 'Extended thinking configuration (Anthropic-specific)',
          },
          tool_choice: {
            anyOf: [
              {
                $ref: '#/$defs/tool_choice_auto',
              },
              {
                $ref: '#/$defs/tool_choice_any',
              },
              {
                $ref: '#/$defs/tool_choice_tool',
              },
              {
                $ref: '#/$defs/tool_choice_none',
              },
            ],
            title: 'Tool Choice',
            description: 'Controls which (if any) tool is called by the model. `none` means the model w...',
          },
          tool_config: {
            type: 'object',
            title: 'Tool Config',
            description: 'Tool calling configuration (Google-specific)',
            additionalProperties: true,
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description: 'Available tools/functions for the model',
            items: {
              anyOf: [
                {
                  $ref: '#/$defs/chat_completion_tool_param',
                },
                {
                  type: 'object',
                  title: 'CustomToolChatCompletions',
                  description:
                    'A custom tool that processes input using a specified format.\n\nFields:\n- type (required): Literal["custom"]\n- custom (required): CustomToolProperties',
                  properties: {
                    custom: {
                      type: 'object',
                      title: 'CustomToolProperties',
                      description: 'Properties of the custom tool.',
                      properties: {
                        name: {
                          type: 'string',
                          title: 'Name',
                          description: 'The name of the custom tool, used to identify it in tool calls.',
                        },
                        description: {
                          type: 'string',
                          title: 'Description',
                          description:
                            'Optional description of the custom tool, used to provide more context.',
                        },
                        format: {
                          anyOf: [
                            {
                              type: 'object',
                              title: 'TextFormat',
                              description:
                                'Unconstrained free-form text.\n\nFields:\n- type (required): Literal["text"]',
                              properties: {
                                type: {
                                  type: 'string',
                                  title: 'Type',
                                  description: 'Unconstrained text format. Always `text`.',
                                  enum: ['text'],
                                },
                              },
                              required: ['type'],
                            },
                            {
                              type: 'object',
                              title: 'GrammarFormat',
                              description:
                                'A grammar defined by the user.\n\nFields:\n- type (required): Literal["grammar"]\n- grammar (required): GrammarFormatGrammarFormat',
                              properties: {
                                grammar: {
                                  type: 'object',
                                  title: 'GrammarFormatGrammarFormat',
                                  description: 'Your chosen grammar.',
                                  properties: {
                                    definition: {
                                      type: 'string',
                                      title: 'Definition',
                                      description: 'The grammar definition.',
                                    },
                                    syntax: {
                                      type: 'string',
                                      title: 'Syntax',
                                      description:
                                        'The syntax of the grammar definition. One of `lark` or `regex`.',
                                      enum: ['lark', 'regex'],
                                    },
                                  },
                                  required: ['definition', 'syntax'],
                                },
                                type: {
                                  type: 'string',
                                  title: 'Type',
                                  description: 'Grammar format. Always `grammar`.',
                                  enum: ['grammar'],
                                },
                              },
                              required: ['grammar', 'type'],
                            },
                          ],
                          title: 'Format',
                          description: 'The input format for the custom tool. Default is unconstrained text.',
                        },
                      },
                      required: ['name'],
                    },
                    type: {
                      type: 'string',
                      title: 'Type',
                      description: 'The type of the custom tool. Always `custom`.',
                      enum: ['custom'],
                    },
                  },
                  required: ['custom', 'type'],
                },
              ],
              description:
                'A function tool that can be used to generate a response.\n\nFields:\n- type (required): Literal["function"]\n- function (required): FunctionObject',
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description: 'Top-k sampling parameter',
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description: 'An integer between 0 and 20 specifying the number of most likely tokens to re...',
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description: 'Nucleus sampling threshold',
          },
          user: {
            type: 'string',
            title: 'User',
            description: 'This field is being replaced by `safety_identifier` and `prompt_cache_key`. U...',
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description: "Constrains the verbosity of the model's response. Lower values will result in...",
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description: 'This tool searches the web for relevant results to use in a response. Learn m...',
            additionalProperties: true,
          },
        },
        required: ['model', 'stream'],
      },
    ],
    $defs: {
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
                $ref: '#/$defs/reasoning',
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
                $ref: '#/$defs/tool_choice',
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
      dedalus_model_choice: {
        anyOf: [
          {
            type: 'string',
            title: 'ModelId',
            description: "Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').",
          },
          {
            $ref: '#/$defs/dedalus_model',
          },
        ],
        title: 'DedalusModelChoice',
        description: 'Dedalus model choice - either a string ID or DedalusModel configuration object.',
      },
      chat_completion_functions: {
        type: 'object',
        title: 'ChatCompletionFunctions',
        description:
          'Schema for ChatCompletionFunctions.\n\nFields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description:
              'The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.',
          },
          description: {
            type: 'string',
            title: 'Description',
            description:
              'A description of what the function does, used by the model to choose when and how to call the function.',
          },
          parameters: {
            $ref: '#/$defs/function_parameters',
          },
        },
        required: ['name'],
      },
      function_parameters: {
        type: 'object',
        title: 'FunctionParameters',
        description:
          'The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format.\n\nOmitting `parameters` defines a function with an empty parameter list.',
        additionalProperties: true,
      },
      chat_completion_developer_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestDeveloperMessage',
        description:
          'Developer-provided instructions that the model should follow, regardless of\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n- content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]\n- role (required): Literal["developer"]\n- name (optional): str',
        properties: {
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/chat_completion_content_part_text_param',
                },
              },
            ],
            title: 'Content',
            description: 'The contents of the developer message.',
          },
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `developer`.',
            enum: ['developer'],
          },
          name: {
            type: 'string',
            title: 'Name',
            description:
              'An optional name for the participant. Provides the model information to differentiate between participants of the same role.',
          },
        },
        required: ['content', 'role'],
      },
      chat_completion_content_part_text_param: {
        type: 'object',
        title: 'ChatCompletionRequestMessageContentPartText',
        description:
          'Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n- type (required): Literal["text"]\n- text (required): str',
        properties: {
          text: {
            type: 'string',
            title: 'Text',
            description: 'The text content.',
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the content part.',
            enum: ['text'],
          },
        },
        required: ['text', 'type'],
      },
      chat_completion_system_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestSystemMessage',
        description:
          'Developer-provided instructions that the model should follow, regardless of\nmessages sent by the user. With o1 models and newer, use `developer` messages\nfor this purpose instead.\n\nFields:\n- content (required): str | Annotated[list[ChatCompletionRequestSystemMessageContentPart], MinLen(1)]\n- role (required): Literal["system"]\n- name (optional): str',
        properties: {
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/chat_completion_content_part_text_param',
                },
              },
            ],
            title: 'Content',
            description: 'The contents of the system message.',
          },
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `system`.',
            enum: ['system'],
          },
          name: {
            type: 'string',
            title: 'Name',
            description:
              'An optional name for the participant. Provides the model information to differentiate between participants of the same role.',
          },
        },
        required: ['content', 'role'],
      },
      chat_completion_user_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestUserMessage',
        description:
          'Messages sent by an end user, containing prompts or additional context\ninformation.\n\nFields:\n- content (required): str | Annotated[list[ChatCompletionRequestUserMessageContentPart], MinLen(1)]\n- role (required): Literal["user"]\n- name (optional): str',
        properties: {
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      $ref: '#/$defs/chat_completion_content_part_text_param',
                    },
                    {
                      $ref: '#/$defs/chat_completion_content_part_image_param',
                    },
                    {
                      $ref: '#/$defs/chat_completion_content_part_audio_param',
                    },
                    {
                      $ref: '#/$defs/chat_completion_content_part_file_param',
                    },
                  ],
                  description:
                    'Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n- type (required): Literal["text"]\n- text (required): str',
                },
              },
            ],
            title: 'Content',
            description: 'The contents of the user message.',
          },
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `user`.',
            enum: ['user'],
          },
          name: {
            type: 'string',
            title: 'Name',
            description:
              'An optional name for the participant. Provides the model information to differentiate between participants of the same role.',
          },
        },
        required: ['content', 'role'],
      },
      chat_completion_content_part_image_param: {
        type: 'object',
        title: 'ChatCompletionRequestMessageContentPartImage',
        description:
          'Learn about [image inputs](https://platform.openai.com/docs/guides/vision).\n\nFields:\n- type (required): Literal["image_url"]\n- image_url (required): ChatCompletionRequestMessageContentPartImageImageUrl',
        properties: {
          image_url: {
            type: 'object',
            title: 'ChatCompletionRequestMessageContentPartImageImageUrl',
            description:
              'Schema for ChatCompletionRequestMessageContentPartImageImageUrl.\n\nFields:\n- url (required): AnyUrl\n- detail (optional): Literal["auto", "low", "high"]',
            properties: {
              url: {
                type: 'string',
                title: 'Url',
                description: 'Either a URL of the image or the base64 encoded image data.',
              },
              detail: {
                type: 'string',
                title: 'Detail',
                description:
                  'Specifies the detail level of the image. Learn more in the [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).',
                enum: ['auto', 'low', 'high'],
              },
            },
            required: ['url'],
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the content part.',
            enum: ['image_url'],
          },
        },
        required: ['image_url', 'type'],
      },
      chat_completion_content_part_audio_param: {
        type: 'object',
        title: 'ChatCompletionRequestMessageContentPartAudio',
        description:
          'Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).\n\nFields:\n- type (required): Literal["input_audio"]\n- input_audio (required): ChatCompletionRequestMessageContentPartAudioInputAudio',
        properties: {
          input_audio: {
            type: 'object',
            title: 'ChatCompletionRequestMessageContentPartAudioInputAudio',
            description:
              'Schema for ChatCompletionRequestMessageContentPartAudioInputAudio.\n\nFields:\n- data (required): str\n- format (required): Literal["wav", "mp3"]',
            properties: {
              data: {
                type: 'string',
                title: 'Data',
                description: 'Base64 encoded audio data.',
              },
              format: {
                type: 'string',
                title: 'Format',
                description: 'The format of the encoded audio data. Currently supports "wav" and "mp3".',
                enum: ['wav', 'mp3'],
              },
            },
            required: ['data', 'format'],
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the content part. Always `input_audio`.',
            enum: ['input_audio'],
          },
        },
        required: ['input_audio', 'type'],
      },
      chat_completion_content_part_file_param: {
        type: 'object',
        title: 'ChatCompletionRequestMessageContentPartFile',
        description:
          'Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text generation.\n\nFields:\n- type (required): Literal["file"]\n- file (required): ChatCompletionRequestMessageContentPartFileFile',
        properties: {
          file: {
            type: 'object',
            title: 'ChatCompletionRequestMessageContentPartFileFile',
            description:
              'Schema for ChatCompletionRequestMessageContentPartFileFile.\n\nFields:\n- filename (optional): str\n- file_data (optional): str\n- file_id (optional): str',
            properties: {
              file_data: {
                type: 'string',
                title: 'File Data',
                description:
                  'The base64 encoded file data, used when passing the file to the model \nas a string.',
              },
              file_id: {
                type: 'string',
                title: 'File Id',
                description: 'The ID of an uploaded file to use as input.',
              },
              filename: {
                type: 'string',
                title: 'Filename',
                description: 'The name of the file, used when passing the file to the model as a \nstring.',
              },
            },
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the content part. Always `file`.',
            enum: ['file'],
          },
        },
        required: ['file', 'type'],
      },
      chat_completion_assistant_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestAssistantMessage',
        description:
          'Messages sent by the model in response to user messages.\n\nFields:\n- content (optional): str | Annotated[list[ChatCompletionRequestAssistantMessageContentPart], MinLen(1)] | None\n- refusal (optional): str | None\n- role (required): Literal["assistant"]\n- name (optional): str\n- audio (optional): Audio | None\n- tool_calls (optional): ChatCompletionMessageToolCalls\n- function_call (optional): FunctionCallInline | None',
        properties: {
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `assistant`.',
            enum: ['assistant'],
          },
          audio: {
            $ref: '#/$defs/chat_completion_audio_param',
          },
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      $ref: '#/$defs/chat_completion_content_part_text_param',
                    },
                    {
                      $ref: '#/$defs/chat_completion_content_part_refusal_param',
                    },
                  ],
                  description:
                    'Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n- type (required): Literal["text"]\n- text (required): str',
                },
              },
            ],
            title: 'Content',
            description:
              'The contents of the assistant message. Required unless `tool_calls` or `function_call` is specified.',
          },
          function_call: {
            type: 'object',
            title: 'FunctionCallInline',
            description:
              'Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.\n\nFields:\n- arguments (required): str\n- name (required): str',
            properties: {
              arguments: {
                type: 'string',
                title: 'Arguments',
                description:
                  'The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.',
              },
              name: {
                type: 'string',
                title: 'Name',
                description: 'The name of the function to call.',
              },
            },
            required: ['arguments', 'name'],
          },
          name: {
            type: 'string',
            title: 'Name',
            description:
              'An optional name for the participant. Provides the model information to differentiate between participants of the same role.',
          },
          refusal: {
            type: 'string',
            title: 'Refusal',
            description: 'The refusal message by the assistant.',
          },
          tool_calls: {
            type: 'array',
            title: 'Tool Calls',
            description: 'The tool calls generated by the model, such as function calls.',
            items: {
              anyOf: [
                {
                  type: 'object',
                  title: 'ChatCompletionMessageToolCall',
                  description:
                    'A call to a function tool created by the model.\n\nFields:\n- id (required): str\n- type (required): Literal["function"]\n- function (required): ChatCompletionMessageToolCallFunction',
                  properties: {
                    id: {
                      type: 'string',
                      title: 'Id',
                      description: 'The ID of the tool call.',
                    },
                    function: {
                      type: 'object',
                      title: 'ChatCompletionMessageToolCallFunction',
                      description: 'The function that the model called.',
                      properties: {
                        arguments: {
                          type: 'string',
                          title: 'Arguments',
                          description:
                            'The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may hallucinate parameters not defined by your function schema. Validate the arguments in your code before calling your function.',
                        },
                        name: {
                          type: 'string',
                          title: 'Name',
                          description: 'The name of the function to call.',
                        },
                      },
                      required: ['arguments', 'name'],
                    },
                    type: {
                      type: 'string',
                      title: 'Type',
                      description: 'The type of the tool. Currently, only `function` is supported.',
                      enum: ['function'],
                    },
                  },
                  required: ['id', 'function', 'type'],
                },
                {
                  $ref: '#/$defs/chat_completion_message_custom_tool_call',
                },
              ],
              description:
                'A call to a function tool created by the model.\n\nFields:\n- id (required): str\n- type (required): Literal["function"]\n- function (required): ChatCompletionMessageToolCallFunction',
            },
          },
        },
        required: ['role'],
      },
      chat_completion_audio_param: {
        type: 'object',
        title: 'Audio',
        description:
          'Data about a previous audio response from the model.\n[Learn more](https://platform.openai.com/docs/guides/audio).\n\nFields:\n- id (required): str',
        properties: {
          id: {
            type: 'string',
            title: 'Id',
            description: 'Unique identifier for a previous audio response from the model.',
          },
        },
        required: ['id'],
      },
      chat_completion_content_part_refusal_param: {
        type: 'object',
        title: 'ChatCompletionRequestMessageContentPartRefusal',
        description:
          'Schema for ChatCompletionRequestMessageContentPartRefusal.\n\nFields:\n- type (required): Literal["refusal"]\n- refusal (required): str',
        properties: {
          refusal: {
            type: 'string',
            title: 'Refusal',
            description: 'The refusal message generated by the model.',
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the content part.',
            enum: ['refusal'],
          },
        },
        required: ['refusal', 'type'],
      },
      chat_completion_message_custom_tool_call: {
        type: 'object',
        title: 'ChatCompletionMessageCustomToolCall',
        description:
          'A call to a custom tool created by the model.\n\nFields:\n- id (required): str\n- type (required): Literal["custom"]\n- custom (required): Custom',
        properties: {
          id: {
            type: 'string',
            title: 'Id',
            description: 'The ID of the tool call.',
          },
          custom: {
            $ref: '#/$defs/custom',
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the tool. Always `custom`.',
            enum: ['custom'],
          },
        },
        required: ['id', 'custom', 'type'],
      },
      custom: {
        type: 'object',
        title: 'Custom',
        description:
          'The custom tool that the model called.\n\nFields:\n- name (required): str\n- input (required): str',
        properties: {
          input: {
            type: 'string',
            title: 'Input',
            description: 'The input for the custom tool call generated by the model.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'The name of the custom tool to call.',
          },
        },
        required: ['input', 'name'],
      },
      chat_completion_tool_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestToolMessage',
        description:
          'Schema for ChatCompletionRequestToolMessage.\n\nFields:\n- role (required): Literal["tool"]\n- content (required): str | Annotated[list[ChatCompletionRequestToolMessageContentPart], MinLen(1)]\n- tool_call_id (required): str',
        properties: {
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/chat_completion_content_part_text_param',
                },
              },
            ],
            title: 'Content',
            description: 'The contents of the tool message.',
          },
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `tool`.',
            enum: ['tool'],
          },
          tool_call_id: {
            type: 'string',
            title: 'Tool Call Id',
            description: 'Tool call that this message is responding to.',
          },
        },
        required: ['content', 'role', 'tool_call_id'],
      },
      chat_completion_function_message_param: {
        type: 'object',
        title: 'ChatCompletionRequestFunctionMessage',
        description:
          'Schema for ChatCompletionRequestFunctionMessage.\n\nFields:\n- role (required): Literal["function"]\n- content (required): str | None\n- name (required): str',
        properties: {
          content: {
            type: 'string',
            title: 'Content',
            description: 'The contents of the function message.',
          },
          name: {
            type: 'string',
            title: 'Name',
            description: 'The name of the function to call.',
          },
          role: {
            type: 'string',
            title: 'Role',
            description: 'The role of the messages author, in this case `function`.',
            enum: ['function'],
          },
        },
        required: ['content', 'name', 'role'],
      },
      prediction_content: {
        type: 'object',
        title: 'PredictionContent',
        description:
          'Static predicted output content, such as the content of a text file that is\nbeing regenerated.\n\nFields:\n- type (required): Literal["content"]\n- content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]',
        properties: {
          content: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  $ref: '#/$defs/chat_completion_content_part_text_param',
                },
              },
            ],
            title: 'Content',
            description:
              'The content that should be matched when generating a model response.\nIf generated tokens would match this content, the entire model response\ncan be returned much more quickly.',
          },
          type: {
            type: 'string',
            title: 'Type',
            description:
              'The type of the predicted content you want to provide. This type is\ncurrently always `content`.',
            enum: ['content'],
          },
        },
        required: ['content', 'type'],
      },
      response_format_text: {
        type: 'object',
        title: 'ResponseFormatText',
        description:
          'Default response format. Used to generate text responses.\n\nFields:\n- type (required): Literal["text"]',
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
      response_format_json_schema: {
        type: 'object',
        title: 'ResponseFormatJsonSchema',
        description:
          'JSON Schema response format. Used to generate structured JSON responses.\nLearn more about [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).\n\nFields:\n- type (required): Literal["json_schema"]\n- json_schema (required): JSONSchema',
        properties: {
          json_schema: {
            type: 'object',
            title: 'JSONSchema',
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
                title: 'ResponseFormatJsonSchemaSchema',
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
      response_format_json_object: {
        type: 'object',
        title: 'ResponseFormatJsonObject',
        description:
          'JSON object response format. An older method of generating JSON responses.\nUsing `json_schema` is recommended for models that support it. Note that the\nmodel will not generate JSON without a system or user message instructing it\nto do so.\n\nFields:\n- type (required): Literal["json_object"]',
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
      thinking_config_enabled: {
        type: 'object',
        title: 'ThinkingConfigEnabled',
        description:
          'Schema for ThinkingConfigEnabled.\n\nFields:\n- budget_tokens (required): int\n- type (required): Literal["enabled"]',
        properties: {
          budget_tokens: {
            type: 'integer',
            title: 'Budget Tokens',
            description:
              'Determines how many tokens Claude can use for its internal reasoning process. Larger budgets can enable more thorough analysis for complex problems, improving response quality.\n\nMust be ≥1024 and less than `max_tokens`.\n\nSee [extended thinking](https://docs.claude.com/en/docs/build-with-claude/extended-thinking) for details.',
          },
          type: {
            type: 'string',
            title: 'Type',
            enum: ['enabled'],
          },
        },
        required: ['budget_tokens', 'type'],
      },
      thinking_config_disabled: {
        type: 'object',
        title: 'ThinkingConfigDisabled',
        description: 'Schema for ThinkingConfigDisabled.\n\nFields:\n- type (required): Literal["disabled"]',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['disabled'],
          },
        },
        required: ['type'],
      },
      tool_choice_auto: {
        type: 'object',
        title: 'ToolChoiceAuto',
        description:
          'The model will automatically decide whether to use tools.\n\nFields:\n- disable_parallel_tool_use (optional): bool\n- type (required): Literal["auto"]',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['auto'],
          },
          disable_parallel_tool_use: {
            type: 'boolean',
            title: 'Disable Parallel Tool Use',
            description:
              'Whether to disable parallel tool use.\n\nDefaults to `false`. If set to `true`, the model will output at most one tool use.',
          },
        },
        required: ['type'],
      },
      tool_choice_any: {
        type: 'object',
        title: 'ToolChoiceAny',
        description:
          'The model will use any available tools.\n\nFields:\n- disable_parallel_tool_use (optional): bool\n- type (required): Literal["any"]',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['any'],
          },
          disable_parallel_tool_use: {
            type: 'boolean',
            title: 'Disable Parallel Tool Use',
            description:
              'Whether to disable parallel tool use.\n\nDefaults to `false`. If set to `true`, the model will output exactly one tool use.',
          },
        },
        required: ['type'],
      },
      tool_choice_tool: {
        type: 'object',
        title: 'ToolChoiceTool',
        description:
          'The model will use the specified tool with `tool_choice.name`.\n\nFields:\n- disable_parallel_tool_use (optional): bool\n- name (required): str\n- type (required): Literal["tool"]',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: 'The name of the tool to use.',
          },
          type: {
            type: 'string',
            title: 'Type',
            enum: ['tool'],
          },
          disable_parallel_tool_use: {
            type: 'boolean',
            title: 'Disable Parallel Tool Use',
            description:
              'Whether to disable parallel tool use.\n\nDefaults to `false`. If set to `true`, the model will output exactly one tool use.',
          },
        },
        required: ['name', 'type'],
      },
      tool_choice_none: {
        type: 'object',
        title: 'ToolChoiceNone',
        description:
          'The model will not be allowed to use tools.\n\nFields:\n- type (required): Literal["none"]',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['none'],
          },
        },
        required: ['type'],
      },
      chat_completion_tool_param: {
        type: 'object',
        title: 'ChatCompletionTool',
        description:
          'A function tool that can be used to generate a response.\n\nFields:\n- type (required): Literal["function"]\n- function (required): FunctionObject',
        properties: {
          function: {
            $ref: '#/$defs/function_definition',
          },
          type: {
            type: 'string',
            title: 'Type',
            description: 'The type of the tool. Currently, only `function` is supported.',
            enum: ['function'],
          },
        },
        required: ['function', 'type'],
      },
      function_definition: {
        type: 'object',
        title: 'FunctionObject',
        description:
          'Schema for FunctionObject.\n\nFields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters\n- strict (optional): bool | None',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description:
              'The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.',
          },
          description: {
            type: 'string',
            title: 'Description',
            description:
              'A description of what the function does, used by the model to choose when and how to call the function.',
          },
          parameters: {
            $ref: '#/$defs/function_parameters',
          },
          strict: {
            type: 'boolean',
            title: 'Strict',
            description:
              'Whether to enable strict schema adherence when generating the function call. If set to true, the model will follow the exact schema defined in the `parameters` field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn more about Structured Outputs in the [function calling guide](https://platform.openai.com/docs/guides/function-calling).',
          },
        },
        required: ['name'],
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
