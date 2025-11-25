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
              "Model(s) to use for completion. Can be a single model ID, a DedalusModel object, or a list for multi-model routing. Single model: 'openai/gpt-5', 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview', or a DedalusModel instance. Multi-model routing: ['openai/gpt-5', 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview'] or list of DedalusModel objects - agent will choose optimal model based on task complexity.",
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
              'Parameters for audio output. Required when audio output is requested with `modalities: ["audio"]`. [Learn more](https://platform.openai.com/docs/guides/audio). ',
            additionalProperties: true,
          },
          auto_execute_tools: {
            type: 'boolean',
            title: 'Auto Execute Tools',
            description:
              'When False, skip server-side tool execution and return raw OpenAI-style tool_calls in the response.',
          },
          cachedContent: {
            type: 'string',
            title: 'Cachedcontent',
            description:
              'Optional. The name of the content [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to serve the prediction. Format: `cachedContents/{cachedContent}`',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description:
              'If set to `true`, the request returns a `request_id`. You can then get the deferred response by GET `/v1/chat/deferred-completion/{request_id}`.',
          },
          disable_automatic_function_calling: {
            type: 'boolean',
            title: 'Disable Automatic Function Calling',
            description:
              'Google SDK control: disable automatic function calling. Agent workflows handle tools manually.',
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. ",
          },
          function_call: {
            type: 'string',
            title: 'Function Call',
            description:
              'Deprecated in favor of `tool_choice`.  Controls which (if any) function is called by the model.  `none` means the model will not call a function and instead generates a message.  `auto` means the model can pick between generating a message or calling a function.  Specifying a particular function via `{"name": "my_function"}` forces the model to call that function.  `none` is the default when no functions are present. `auto` is the default if functions are present.',
            enum: ['auto', 'none'],
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description:
              'Deprecated in favor of `tools`.  A list of functions the model may generate JSON inputs for. ',
            items: {
              type: 'object',
              title: 'ChatCompletionFunctions',
              description:
                'Fields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters',
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
                  type: 'object',
                  title: 'FunctionParameters',
                  description:
                    'The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. \n\nOmitting `parameters` defines a function with an empty parameter list.',
                  additionalProperties: true,
                },
              },
              required: ['name'],
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
              'Modify the likelihood of specified tokens appearing in the completion.  Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. ',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description:
              'Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. ',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description:
              'An upper bound for the number of tokens that can be generated for a completion, including visible output and reasoning tokens. ',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              "Maximum number of tokens the model can generate in the completion. The total token count (input + output) is limited by the model's context window. Setting this prevents unexpectedly long responses and helps control costs.  For newer OpenAI models, use max_completion_tokens instead (more precise accounting). For other providers, max_tokens remains the standard parameter name. ",
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
                title: 'Messages',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestDeveloperMessage',
                      description:
                        'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], Field(json_schema_extra={"title": "Content3"}), MinLen(1)]\n  - role (required): Literal[\'developer\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content3',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestSystemMessage',
                      description:
                        'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, use `developer` messages\nfor this purpose instead.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestSystemMessageContentPart], Field(json_schema_extra={"title": "Content4"}), MinLen(1)]\n  - role (required): Literal[\'system\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content4',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestUserMessage',
                      description:
                        'Messages sent by an end user, containing prompts or additional context\n\ninformation.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestUserMessageContentPart], Field(json_schema_extra={"title": "Content5"}), MinLen(1)]\n  - role (required): Literal[\'user\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content5',
                              items: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartText',
                                    description:
                                      "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartImage',
                                    description:
                                      "Learn about [image inputs](https://platform.openai.com/docs/guides/vision).\n\nFields:\n  - type (required): Literal['image_url']\n  - image_url (required): ImageUrl",
                                    properties: {
                                      image_url: {
                                        type: 'object',
                                        title: 'ImageUrl',
                                        description:
                                          "Fields:\n- url (required): AnyUrl\n- detail (optional): Literal['auto', 'low', 'high']",
                                        properties: {
                                          url: {
                                            type: 'string',
                                            title: 'Url',
                                            description:
                                              'Either a URL of the image or the base64 encoded image data.',
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartAudio',
                                    description:
                                      "Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).\n\nFields:\n  - type (required): Literal['input_audio']\n  - input_audio (required): InputAudio82c696db",
                                    properties: {
                                      input_audio: {
                                        type: 'object',
                                        title: 'InputAudio82c696db',
                                        description:
                                          "Fields:\n- data (required): str\n- format (required): Literal['wav', 'mp3']",
                                        properties: {
                                          data: {
                                            type: 'string',
                                            title: 'Data',
                                            description: 'Base64 encoded audio data.',
                                          },
                                          format: {
                                            type: 'string',
                                            title: 'Format',
                                            description:
                                              'The format of the encoded audio data. Currently supports "wav" and "mp3".',
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartFile',
                                    description:
                                      "Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text generation.\n\nFields:\n  - type (required): Literal['file']\n  - file (required): File",
                                    properties: {
                                      file: {
                                        type: 'object',
                                        title: 'File',
                                        description:
                                          'Fields:\n- filename (optional): str\n- file_data (optional): str\n- file_id (optional): str',
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
                                            description:
                                              'The name of the file, used when passing the file to the model as a \nstring.',
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
                                ],
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestAssistantMessage',
                      description:
                        'Messages sent by the model in response to user messages.\n\nFields:\n  - content (optional): str | Annotated[list[ChatCompletionRequestAssistantMessageContentPart], Field(json_schema_extra={"title": "Content6"}), MinLen(1)] | None\n  - refusal (optional): str | None\n  - role (required): Literal[\'assistant\']\n  - name (optional): str\n  - audio (optional): Audio815cb4c9 | None\n  - tool_calls (optional): ChatCompletionMessageToolCalls\n  - function_call (optional): FunctionCall | None',
                      properties: {
                        role: {
                          type: 'string',
                          title: 'Role',
                          description: 'The role of the messages author, in this case `assistant`.',
                          enum: ['assistant'],
                        },
                        audio: {
                          type: 'object',
                          title: 'Audio815cb4c9',
                          description:
                            'Data about a previous audio response from the model.\n\n[Learn more](https://platform.openai.com/docs/guides/audio).\n\nFields:\n  - id (required): str',
                          properties: {
                            id: {
                              type: 'string',
                              title: 'Id',
                              description: 'Unique identifier for a previous audio response from the model.',
                            },
                          },
                          required: ['id'],
                        },
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content6',
                              items: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartText',
                                    description:
                                      "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartRefusal',
                                    description:
                                      "Fields:\n- type (required): Literal['refusal']\n- refusal (required): str",
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
                                ],
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
                              },
                            },
                          ],
                          title: 'Content',
                          description:
                            'The contents of the assistant message. Required unless `tool_calls` or `function_call` is specified.',
                        },
                        function_call: {
                          type: 'object',
                          title: 'FunctionCall',
                          description:
                            'Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.\n\nFields:\n  - arguments (required): str\n  - name (required): str',
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
                          title: 'Chatcompletionmessagetoolcalls',
                          description: 'The tool calls generated by the model, such as function calls.',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                title: 'ChatCompletionMessageToolCall',
                                description:
                                  "A call to a function tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['function']\n  - function (required): FunctionD877ee33",
                                properties: {
                                  id: {
                                    type: 'string',
                                    title: 'Id',
                                    description: 'The ID of the tool call.',
                                  },
                                  function: {
                                    type: 'object',
                                    title: 'FunctionD877ee33',
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
                                    description:
                                      'The type of the tool. Currently, only `function` is supported.',
                                    enum: ['function'],
                                  },
                                },
                                required: ['id', 'function', 'type'],
                              },
                              {
                                type: 'object',
                                title: 'ChatCompletionMessageCustomToolCall',
                                description:
                                  "A call to a custom tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['custom']\n  - custom (required): Custom314518a6",
                                properties: {
                                  id: {
                                    type: 'string',
                                    title: 'Id',
                                    description: 'The ID of the tool call.',
                                  },
                                  custom: {
                                    type: 'object',
                                    title: 'Custom314518a6',
                                    description: 'The custom tool that the model called.',
                                    properties: {
                                      input: {
                                        type: 'string',
                                        title: 'Input',
                                        description:
                                          'The input for the custom tool call generated by the model.',
                                      },
                                      name: {
                                        type: 'string',
                                        title: 'Name',
                                        description: 'The name of the custom tool to call.',
                                      },
                                    },
                                    required: ['input', 'name'],
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
                            ],
                            description:
                              "A call to a function tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['function']\n  - function (required): FunctionD877ee33",
                          },
                        },
                      },
                      required: ['role'],
                    },
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestToolMessage',
                      description:
                        'Fields:\n- role (required): Literal[\'tool\']\n- content (required): str | Annotated[list[ChatCompletionRequestToolMessageContentPart], Field(json_schema_extra={"title": "Content7"}), MinLen(1)]\n- tool_call_id (required): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content7',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestFunctionMessage',
                      description:
                        "Fields:\n- role (required): Literal['function']\n- content (required): str | None\n- name (required): str",
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
                  ],
                  description:
                    'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], Field(json_schema_extra={"title": "Content3"}), MinLen(1)]\n  - role (required): Literal[\'developer\']\n  - name (optional): str',
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
              'Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.  Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters. ',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Responsemodalities',
            description:
              "Output modalities. Most models generate text by default. Use ['text', 'audio'] for audio-capable models.",
            items: {
              type: 'string',
              enum: ['text', 'audio'],
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
              'How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.',
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel tool calls (Anthropic uses inverted polarity)',
          },
          prediction: {
            type: 'object',
            title: 'PredictionContent',
            description:
              'Static predicted output content, such as the content of a text file that is\nbeing regenerated.',
            properties: {
              content: {
                type: 'object',
                title: 'Content',
                additionalProperties: true,
              },
              type: {
                type: 'string',
                title: 'Type',
                enum: ['content'],
              },
            },
            required: ['content'],
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. ",
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description:
              'Used by OpenAI to cache responses for similar requests to optimize your cache hit rates. Replaces the `user` field. [Learn more](https://platform.openai.com/docs/guides/prompt-caching). ',
          },
          prompt_cache_retention: {
            type: 'string',
            title: 'Prompt Cache Retention',
            description:
              'The retention policy for the prompt cache. Set to `24h` to enable extended prompt caching, which keeps cached prefixes active for longer, up to a maximum of 24 hours. [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).',
            enum: ['24h', 'in-memory'],
          },
          prompt_mode: {
            type: 'object',
            title: 'Prompt Mode',
            description:
              'Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.',
            additionalProperties: true,
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description:
              'Constrains effort on reasoning for [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently supported values are `none`, `minimal`, `low`, `medium`, and `high`. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.  - `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool calls are supported for all reasoning values in gpt-5.1. - All models before `gpt-5.1` default to `medium` reasoning effort, and do not support `none`. - The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort.',
            enum: ['high', 'low', 'medium', 'minimal', 'none'],
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
            description:
              'An object specifying the format that the model must output.  Setting to `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).  Setting to `{ "type": "json_object" }` enables the older JSON mode, which ensures the message the model generates is valid JSON. Using `json_schema` is preferred for models that support it. ',
          },
          safe_prompt: {
            type: 'boolean',
            title: 'Safe Prompt',
            description: 'Whether to inject a safety prompt before all conversations.',
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description:
              "A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user. We recommend hashing their username or email address, in order to avoid sending us any identifying information. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers). ",
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Safety/content filtering settings (Google-specific)',
            items: {
              type: 'object',
              title: 'SafetySetting',
              description:
                "Safety setting, affecting the safety-blocking behavior.\n\nPassing a safety setting for a category changes the allowed probability that\ncontent is blocked.\n\nFields:\n  - category (required): Literal['HARM_CATEGORY_UNSPECIFIED', 'HARM_CATEGORY_DEROGATORY', 'HARM_CATEGORY_TOXICITY', 'HARM_CATEGORY_VIOLENCE', 'HARM_CATEGORY_SEXUAL', 'HARM_CATEGORY_MEDICAL', 'HARM_CATEGORY_DANGEROUS', 'HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT', 'HARM_CATEGORY_CIVIC_INTEGRITY']\n  - threshold (required): Literal['HARM_BLOCK_THRESHOLD_UNSPECIFIED', 'BLOCK_LOW_AND_ABOVE', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_ONLY_HIGH', 'BLOCK_NONE', 'OFF']",
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
            description:
              'Set the parameters to be used for searched data. If not set, no data will be acquired by the model.',
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
            enum: ['auto', 'default', 'flex', 'priority', 'scale', 'standard_only'],
          },
          stop: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                title: 'Stopconfiguration',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Stop',
            description:
              "Not supported with latest reasoning models 'o3' and 'o4-mini'. Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.",
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description:
              'Whether or not to store the output of this chat completion request for use in our [model distillation](https://platform.openai.com/docs/guides/distillation) or [evals](https://platform.openai.com/docs/guides/evals) products.  Supports text and image inputs. Note: image inputs over 8MB will be dropped. ',
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
            description:
              "System-level instructions defining the assistant's behavior, role, and constraints. Sets the context and personality for the entire conversation. Different from user/assistant messages as it provides meta-instructions about how to respond rather than conversation content.  OpenAI: Provided as system role message in messages array. Google: Top-level systemInstruction field (adapter extracts from messages). Anthropic: Top-level system parameter (adapter extracts from messages).  Accepts both string and structured object formats depending on provider capabilities. ",
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  We generally recommend altering this or top_p but not both. ',
          },
          thinking: {
            anyOf: [
              {
                type: 'object',
                title: 'ThinkingConfigEnabled',
                properties: {
                  budget_tokens: {
                    type: 'integer',
                    title: 'Budget Tokens',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['enabled'],
                  },
                },
                required: ['budget_tokens'],
              },
              {
                type: 'object',
                title: 'ThinkingConfigDisabled',
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['disabled'],
                  },
                },
              },
            ],
            title: 'Thinking',
            description: 'Extended thinking configuration (Anthropic-specific)',
          },
          tool_choice: {
            anyOf: [
              {
                type: 'object',
                title: 'ToolChoiceAuto',
                description: 'The model will automatically decide whether to use tools.',
                properties: {
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['auto'],
                  },
                },
              },
              {
                type: 'object',
                title: 'ToolChoiceAny',
                description: 'The model will use any available tools.',
                properties: {
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['any'],
                  },
                },
              },
              {
                type: 'object',
                title: 'ToolChoiceTool',
                description: 'The model will use the specified tool with `tool_choice.name`.',
                properties: {
                  name: {
                    type: 'string',
                    title: 'Name',
                  },
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['tool'],
                  },
                },
                required: ['name'],
              },
              {
                type: 'object',
                title: 'ToolChoiceNone',
                description: 'The model will not be allowed to use tools.',
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['none'],
                  },
                },
              },
            ],
            title: 'Tool Choice',
            description:
              'Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools. Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool.  `none` is the default when no tools are present. `auto` is the default if tools are present. ',
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
            description:
              'A list of tools the model may call. You can provide either custom tools or function tools.  All providers support tools. Adapters handle translation to provider-specific formats. ',
            items: {
              type: 'object',
              title: 'ChatCompletionTool',
              description:
                "A function tool that can be used to generate a response.\n\nFields:\n  - type (required): Literal['function']\n  - function (required): FunctionObject",
              properties: {
                function: {
                  type: 'object',
                  title: 'FunctionObject',
                  description:
                    'Fields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters\n- strict (optional): bool | None',
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
                      type: 'object',
                      title: 'FunctionParameters',
                      description:
                        'The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. \n\nOmitting `parameters` defines a function with an empty parameter list.',
                      additionalProperties: true,
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
                type: {
                  type: 'string',
                  title: 'Type',
                  description: 'The type of the tool. Currently, only `function` is supported.',
                  enum: ['function'],
                },
              },
              required: ['function', 'type'],
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description:
              "Top-k sampling parameter limiting token selection to k most likely candidates. Only considers the top k highest probability tokens at each generation step, setting all other tokens' probabilities to zero. Reduces tail probability mass.  Helps prevent selection of highly unlikely tokens, improving output coherence. Supported by Google and Anthropic; not available in OpenAI's API. ",
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description:
              'An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. ',
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or temperature but not both. ',
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              'This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use `prompt_cache_key` instead to maintain caching optimizations. A stable identifier for your end-users. Used to boost cache hit rates by better bucketing similar requests and  to help OpenAI detect and prevent abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers). ',
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description:
              "Constrains the verbosity of the model's response. Lower values will result in more concise responses, while higher values will result in more verbose responses. Currently supported values are `low`, `medium`, and `high`.",
            enum: ['high', 'low', 'medium'],
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description:
              'This tool searches the web for relevant results to use in a response. Learn more about the [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat). ',
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
              "Model(s) to use for completion. Can be a single model ID, a DedalusModel object, or a list for multi-model routing. Single model: 'openai/gpt-5', 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview', or a DedalusModel instance. Multi-model routing: ['openai/gpt-5', 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview'] or list of DedalusModel objects - agent will choose optimal model based on task complexity.",
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
              'Parameters for audio output. Required when audio output is requested with `modalities: ["audio"]`. [Learn more](https://platform.openai.com/docs/guides/audio). ',
            additionalProperties: true,
          },
          auto_execute_tools: {
            type: 'boolean',
            title: 'Auto Execute Tools',
            description:
              'When False, skip server-side tool execution and return raw OpenAI-style tool_calls in the response.',
          },
          cachedContent: {
            type: 'string',
            title: 'Cachedcontent',
            description:
              'Optional. The name of the content [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to serve the prediction. Format: `cachedContents/{cachedContent}`',
          },
          deferred: {
            type: 'boolean',
            title: 'Deferred',
            description:
              'If set to `true`, the request returns a `request_id`. You can then get the deferred response by GET `/v1/chat/deferred-completion/{request_id}`.',
          },
          disable_automatic_function_calling: {
            type: 'boolean',
            title: 'Disable Automatic Function Calling',
            description:
              'Google SDK control: disable automatic function calling. Agent workflows handle tools manually.',
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. ",
          },
          function_call: {
            type: 'string',
            title: 'Function Call',
            description:
              'Deprecated in favor of `tool_choice`.  Controls which (if any) function is called by the model.  `none` means the model will not call a function and instead generates a message.  `auto` means the model can pick between generating a message or calling a function.  Specifying a particular function via `{"name": "my_function"}` forces the model to call that function.  `none` is the default when no functions are present. `auto` is the default if functions are present.',
            enum: ['auto', 'none'],
          },
          functions: {
            type: 'array',
            title: 'Functions',
            description:
              'Deprecated in favor of `tools`.  A list of functions the model may generate JSON inputs for. ',
            items: {
              type: 'object',
              title: 'ChatCompletionFunctions',
              description:
                'Fields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters',
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
                  type: 'object',
                  title: 'FunctionParameters',
                  description:
                    'The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. \n\nOmitting `parameters` defines a function with an empty parameter list.',
                  additionalProperties: true,
                },
              },
              required: ['name'],
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
              'Modify the likelihood of specified tokens appearing in the completion.  Accepts a JSON object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. ',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description:
              'Whether to return log probabilities of the output tokens or not. If true, returns the log probabilities of each output token returned in the `content` of `message`. ',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description:
              'An upper bound for the number of tokens that can be generated for a completion, including visible output and reasoning tokens. ',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              "Maximum number of tokens the model can generate in the completion. The total token count (input + output) is limited by the model's context window. Setting this prevents unexpectedly long responses and helps control costs.  For newer OpenAI models, use max_completion_tokens instead (more precise accounting). For other providers, max_tokens remains the standard parameter name. ",
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
                title: 'Messages',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestDeveloperMessage',
                      description:
                        'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], Field(json_schema_extra={"title": "Content3"}), MinLen(1)]\n  - role (required): Literal[\'developer\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content3',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestSystemMessage',
                      description:
                        'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, use `developer` messages\nfor this purpose instead.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestSystemMessageContentPart], Field(json_schema_extra={"title": "Content4"}), MinLen(1)]\n  - role (required): Literal[\'system\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content4',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestUserMessage',
                      description:
                        'Messages sent by an end user, containing prompts or additional context\n\ninformation.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestUserMessageContentPart], Field(json_schema_extra={"title": "Content5"}), MinLen(1)]\n  - role (required): Literal[\'user\']\n  - name (optional): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content5',
                              items: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartText',
                                    description:
                                      "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartImage',
                                    description:
                                      "Learn about [image inputs](https://platform.openai.com/docs/guides/vision).\n\nFields:\n  - type (required): Literal['image_url']\n  - image_url (required): ImageUrl",
                                    properties: {
                                      image_url: {
                                        type: 'object',
                                        title: 'ImageUrl',
                                        description:
                                          "Fields:\n- url (required): AnyUrl\n- detail (optional): Literal['auto', 'low', 'high']",
                                        properties: {
                                          url: {
                                            type: 'string',
                                            title: 'Url',
                                            description:
                                              'Either a URL of the image or the base64 encoded image data.',
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartAudio',
                                    description:
                                      "Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).\n\nFields:\n  - type (required): Literal['input_audio']\n  - input_audio (required): InputAudio82c696db",
                                    properties: {
                                      input_audio: {
                                        type: 'object',
                                        title: 'InputAudio82c696db',
                                        description:
                                          "Fields:\n- data (required): str\n- format (required): Literal['wav', 'mp3']",
                                        properties: {
                                          data: {
                                            type: 'string',
                                            title: 'Data',
                                            description: 'Base64 encoded audio data.',
                                          },
                                          format: {
                                            type: 'string',
                                            title: 'Format',
                                            description:
                                              'The format of the encoded audio data. Currently supports "wav" and "mp3".',
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartFile',
                                    description:
                                      "Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text generation.\n\nFields:\n  - type (required): Literal['file']\n  - file (required): File",
                                    properties: {
                                      file: {
                                        type: 'object',
                                        title: 'File',
                                        description:
                                          'Fields:\n- filename (optional): str\n- file_data (optional): str\n- file_id (optional): str',
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
                                            description:
                                              'The name of the file, used when passing the file to the model as a \nstring.',
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
                                ],
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestAssistantMessage',
                      description:
                        'Messages sent by the model in response to user messages.\n\nFields:\n  - content (optional): str | Annotated[list[ChatCompletionRequestAssistantMessageContentPart], Field(json_schema_extra={"title": "Content6"}), MinLen(1)] | None\n  - refusal (optional): str | None\n  - role (required): Literal[\'assistant\']\n  - name (optional): str\n  - audio (optional): Audio815cb4c9 | None\n  - tool_calls (optional): ChatCompletionMessageToolCalls\n  - function_call (optional): FunctionCall | None',
                      properties: {
                        role: {
                          type: 'string',
                          title: 'Role',
                          description: 'The role of the messages author, in this case `assistant`.',
                          enum: ['assistant'],
                        },
                        audio: {
                          type: 'object',
                          title: 'Audio815cb4c9',
                          description:
                            'Data about a previous audio response from the model.\n\n[Learn more](https://platform.openai.com/docs/guides/audio).\n\nFields:\n  - id (required): str',
                          properties: {
                            id: {
                              type: 'string',
                              title: 'Id',
                              description: 'Unique identifier for a previous audio response from the model.',
                            },
                          },
                          required: ['id'],
                        },
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content6',
                              items: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartText',
                                    description:
                                      "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                                  {
                                    type: 'object',
                                    title: 'ChatCompletionRequestMessageContentPartRefusal',
                                    description:
                                      "Fields:\n- type (required): Literal['refusal']\n- refusal (required): str",
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
                                ],
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
                              },
                            },
                          ],
                          title: 'Content',
                          description:
                            'The contents of the assistant message. Required unless `tool_calls` or `function_call` is specified.',
                        },
                        function_call: {
                          type: 'object',
                          title: 'FunctionCall',
                          description:
                            'Deprecated and replaced by `tool_calls`. The name and arguments of a function that should be called, as generated by the model.\n\nFields:\n  - arguments (required): str\n  - name (required): str',
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
                          title: 'Chatcompletionmessagetoolcalls',
                          description: 'The tool calls generated by the model, such as function calls.',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                title: 'ChatCompletionMessageToolCall',
                                description:
                                  "A call to a function tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['function']\n  - function (required): FunctionD877ee33",
                                properties: {
                                  id: {
                                    type: 'string',
                                    title: 'Id',
                                    description: 'The ID of the tool call.',
                                  },
                                  function: {
                                    type: 'object',
                                    title: 'FunctionD877ee33',
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
                                    description:
                                      'The type of the tool. Currently, only `function` is supported.',
                                    enum: ['function'],
                                  },
                                },
                                required: ['id', 'function', 'type'],
                              },
                              {
                                type: 'object',
                                title: 'ChatCompletionMessageCustomToolCall',
                                description:
                                  "A call to a custom tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['custom']\n  - custom (required): Custom314518a6",
                                properties: {
                                  id: {
                                    type: 'string',
                                    title: 'Id',
                                    description: 'The ID of the tool call.',
                                  },
                                  custom: {
                                    type: 'object',
                                    title: 'Custom314518a6',
                                    description: 'The custom tool that the model called.',
                                    properties: {
                                      input: {
                                        type: 'string',
                                        title: 'Input',
                                        description:
                                          'The input for the custom tool call generated by the model.',
                                      },
                                      name: {
                                        type: 'string',
                                        title: 'Name',
                                        description: 'The name of the custom tool to call.',
                                      },
                                    },
                                    required: ['input', 'name'],
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
                            ],
                            description:
                              "A call to a function tool created by the model.\n\nFields:\n  - id (required): str\n  - type (required): Literal['function']\n  - function (required): FunctionD877ee33",
                          },
                        },
                      },
                      required: ['role'],
                    },
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestToolMessage',
                      description:
                        'Fields:\n- role (required): Literal[\'tool\']\n- content (required): str | Annotated[list[ChatCompletionRequestToolMessageContentPart], Field(json_schema_extra={"title": "Content7"}), MinLen(1)]\n- tool_call_id (required): str',
                      properties: {
                        content: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              type: 'array',
                              title: 'Content7',
                              items: {
                                type: 'object',
                                title: 'ChatCompletionRequestMessageContentPartText',
                                description:
                                  "Learn about [text inputs](https://platform.openai.com/docs/guides/text-generation).\n\nFields:\n  - type (required): Literal['text']\n  - text (required): str",
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
                    {
                      type: 'object',
                      title: 'ChatCompletionRequestFunctionMessage',
                      description:
                        "Fields:\n- role (required): Literal['function']\n- content (required): str | None\n- name (required): str",
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
                  ],
                  description:
                    'Developer-provided instructions that the model should follow, regardless of\n\nmessages sent by the user. With o1 models and newer, `developer` messages\nreplace the previous `system` messages.\n\nFields:\n  - content (required): str | Annotated[list[ChatCompletionRequestMessageContentPartText], Field(json_schema_extra={"title": "Content3"}), MinLen(1)]\n  - role (required): Literal[\'developer\']\n  - name (optional): str',
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
              'Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format, and querying for objects via API or the dashboard.  Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters. ',
            additionalProperties: true,
          },
          modalities: {
            type: 'array',
            title: 'Responsemodalities',
            description:
              "Output modalities. Most models generate text by default. Use ['text', 'audio'] for audio-capable models.",
            items: {
              type: 'string',
              enum: ['text', 'audio'],
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
              'How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.',
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel tool calls (Anthropic uses inverted polarity)',
          },
          prediction: {
            type: 'object',
            title: 'PredictionContent',
            description:
              'Static predicted output content, such as the content of a text file that is\nbeing regenerated.',
            properties: {
              content: {
                type: 'object',
                title: 'Content',
                additionalProperties: true,
              },
              type: {
                type: 'string',
                title: 'Type',
                enum: ['content'],
              },
            },
            required: ['content'],
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. ",
          },
          prompt_cache_key: {
            type: 'string',
            title: 'Prompt Cache Key',
            description:
              'Used by OpenAI to cache responses for similar requests to optimize your cache hit rates. Replaces the `user` field. [Learn more](https://platform.openai.com/docs/guides/prompt-caching). ',
          },
          prompt_cache_retention: {
            type: 'string',
            title: 'Prompt Cache Retention',
            description:
              'The retention policy for the prompt cache. Set to `24h` to enable extended prompt caching, which keeps cached prefixes active for longer, up to a maximum of 24 hours. [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).',
            enum: ['24h', 'in-memory'],
          },
          prompt_mode: {
            type: 'object',
            title: 'Prompt Mode',
            description:
              'Allows toggling between the reasoning mode and no system prompt. When set to `reasoning` the system prompt for reasoning models will be used.',
            additionalProperties: true,
          },
          reasoning_effort: {
            type: 'string',
            title: 'Reasoning Effort',
            description:
              'Constrains effort on reasoning for [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently supported values are `none`, `minimal`, `low`, `medium`, and `high`. Reducing reasoning effort can result in faster responses and fewer tokens used on reasoning in a response.  - `gpt-5.1` defaults to `none`, which does not perform reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`, `medium`, and `high`. Tool calls are supported for all reasoning values in gpt-5.1. - All models before `gpt-5.1` default to `medium` reasoning effort, and do not support `none`. - The `gpt-5-pro` model defaults to (and only supports) `high` reasoning effort.',
            enum: ['high', 'low', 'medium', 'minimal', 'none'],
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
            description:
              'An object specifying the format that the model must output.  Setting to `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema. Learn more in the [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).  Setting to `{ "type": "json_object" }` enables the older JSON mode, which ensures the message the model generates is valid JSON. Using `json_schema` is preferred for models that support it. ',
          },
          safe_prompt: {
            type: 'boolean',
            title: 'Safe Prompt',
            description: 'Whether to inject a safety prompt before all conversations.',
          },
          safety_identifier: {
            type: 'string',
            title: 'Safety Identifier',
            description:
              "A stable identifier used to help detect users of your application that may be violating OpenAI's usage policies. The IDs should be a string that uniquely identifies each user. We recommend hashing their username or email address, in order to avoid sending us any identifying information. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers). ",
          },
          safety_settings: {
            type: 'array',
            title: 'Safety Settings',
            description: 'Safety/content filtering settings (Google-specific)',
            items: {
              type: 'object',
              title: 'SafetySetting',
              description:
                "Safety setting, affecting the safety-blocking behavior.\n\nPassing a safety setting for a category changes the allowed probability that\ncontent is blocked.\n\nFields:\n  - category (required): Literal['HARM_CATEGORY_UNSPECIFIED', 'HARM_CATEGORY_DEROGATORY', 'HARM_CATEGORY_TOXICITY', 'HARM_CATEGORY_VIOLENCE', 'HARM_CATEGORY_SEXUAL', 'HARM_CATEGORY_MEDICAL', 'HARM_CATEGORY_DANGEROUS', 'HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT', 'HARM_CATEGORY_CIVIC_INTEGRITY']\n  - threshold (required): Literal['HARM_BLOCK_THRESHOLD_UNSPECIFIED', 'BLOCK_LOW_AND_ABOVE', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_ONLY_HIGH', 'BLOCK_NONE', 'OFF']",
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
            description:
              'Set the parameters to be used for searched data. If not set, no data will be acquired by the model.',
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
            enum: ['auto', 'default', 'flex', 'priority', 'scale', 'standard_only'],
          },
          stop: {
            anyOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                title: 'Stopconfiguration',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Stop',
            description:
              "Not supported with latest reasoning models 'o3' and 'o4-mini'. Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.",
          },
          store: {
            type: 'boolean',
            title: 'Store',
            description:
              'Whether or not to store the output of this chat completion request for use in our [model distillation](https://platform.openai.com/docs/guides/distillation) or [evals](https://platform.openai.com/docs/guides/evals) products.  Supports text and image inputs. Note: image inputs over 8MB will be dropped. ',
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
            description:
              "System-level instructions defining the assistant's behavior, role, and constraints. Sets the context and personality for the entire conversation. Different from user/assistant messages as it provides meta-instructions about how to respond rather than conversation content.  OpenAI: Provided as system role message in messages array. Google: Top-level systemInstruction field (adapter extracts from messages). Anthropic: Top-level system parameter (adapter extracts from messages).  Accepts both string and structured object formats depending on provider capabilities. ",
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.  We generally recommend altering this or top_p but not both. ',
          },
          thinking: {
            anyOf: [
              {
                type: 'object',
                title: 'ThinkingConfigEnabled',
                properties: {
                  budget_tokens: {
                    type: 'integer',
                    title: 'Budget Tokens',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['enabled'],
                  },
                },
                required: ['budget_tokens'],
              },
              {
                type: 'object',
                title: 'ThinkingConfigDisabled',
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['disabled'],
                  },
                },
              },
            ],
            title: 'Thinking',
            description: 'Extended thinking configuration (Anthropic-specific)',
          },
          tool_choice: {
            anyOf: [
              {
                type: 'object',
                title: 'ToolChoiceAuto',
                description: 'The model will automatically decide whether to use tools.',
                properties: {
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['auto'],
                  },
                },
              },
              {
                type: 'object',
                title: 'ToolChoiceAny',
                description: 'The model will use any available tools.',
                properties: {
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['any'],
                  },
                },
              },
              {
                type: 'object',
                title: 'ToolChoiceTool',
                description: 'The model will use the specified tool with `tool_choice.name`.',
                properties: {
                  name: {
                    type: 'string',
                    title: 'Name',
                  },
                  disable_parallel_tool_use: {
                    type: 'boolean',
                    title: 'Disable Parallel Tool Use',
                  },
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['tool'],
                  },
                },
                required: ['name'],
              },
              {
                type: 'object',
                title: 'ToolChoiceNone',
                description: 'The model will not be allowed to use tools.',
                properties: {
                  type: {
                    type: 'string',
                    title: 'Type',
                    enum: ['none'],
                  },
                },
              },
            ],
            title: 'Tool Choice',
            description:
              'Controls which (if any) tool is called by the model. `none` means the model will not call any tool and instead generates a message. `auto` means the model can pick between generating a message or calling one or more tools. `required` means the model must call one or more tools. Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool.  `none` is the default when no tools are present. `auto` is the default if tools are present. ',
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
            description:
              'A list of tools the model may call. You can provide either custom tools or function tools.  All providers support tools. Adapters handle translation to provider-specific formats. ',
            items: {
              type: 'object',
              title: 'ChatCompletionTool',
              description:
                "A function tool that can be used to generate a response.\n\nFields:\n  - type (required): Literal['function']\n  - function (required): FunctionObject",
              properties: {
                function: {
                  type: 'object',
                  title: 'FunctionObject',
                  description:
                    'Fields:\n- description (optional): str\n- name (required): str\n- parameters (optional): FunctionParameters\n- strict (optional): bool | None',
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
                      type: 'object',
                      title: 'FunctionParameters',
                      description:
                        'The parameters the functions accepts, described as a JSON Schema object. See the [guide](https://platform.openai.com/docs/guides/function-calling) for examples, and the [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for documentation about the format. \n\nOmitting `parameters` defines a function with an empty parameter list.',
                      additionalProperties: true,
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
                type: {
                  type: 'string',
                  title: 'Type',
                  description: 'The type of the tool. Currently, only `function` is supported.',
                  enum: ['function'],
                },
              },
              required: ['function', 'type'],
            },
          },
          top_k: {
            type: 'integer',
            title: 'Top K',
            description:
              "Top-k sampling parameter limiting token selection to k most likely candidates. Only considers the top k highest probability tokens at each generation step, setting all other tokens' probabilities to zero. Reduces tail probability mass.  Helps prevent selection of highly unlikely tokens, improving output coherence. Supported by Google and Anthropic; not available in OpenAI's API. ",
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description:
              'An integer between 0 and 20 specifying the number of most likely tokens to return at each token position, each with an associated log probability. `logprobs` must be set to `true` if this parameter is used. ',
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.  We generally recommend altering this or temperature but not both. ',
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              'This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use `prompt_cache_key` instead to maintain caching optimizations. A stable identifier for your end-users. Used to boost cache hit rates by better bucketing similar requests and  to help OpenAI detect and prevent abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers). ',
          },
          verbosity: {
            type: 'string',
            title: 'Verbosity',
            description:
              "Constrains the verbosity of the model's response. Lower values will result in more concise responses, while higher values will result in more verbose responses. Currently supported values are `low`, `medium`, and `high`.",
            enum: ['high', 'low', 'medium'],
          },
          web_search_options: {
            type: 'object',
            title: 'Web Search Options',
            description:
              'This tool searches the web for relevant results to use in a response. Learn more about the [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat). ',
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
      response_format_text: {
        type: 'object',
        title: 'ResponseFormatText',
        description: 'Default response format. Used to generate text responses.',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['text'],
          },
        },
      },
      response_format_json_schema: {
        type: 'object',
        title: 'ResponseFormatJsonSchema',
        description:
          'JSON Schema response format. Used to generate structured JSON responses.\nLearn more about [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).',
        properties: {
          json_schema: {
            type: 'object',
            title: 'JSONSchema',
            description: 'Structured Outputs configuration options, including a JSON Schema.',
            properties: {
              name: {
                type: 'string',
                title: 'Name',
              },
              description: {
                type: 'string',
                title: 'Description',
              },
              schema: {
                type: 'object',
                title: 'ResponseFormatJsonSchemaSchema',
                description:
                  'The schema for the response format, described as a JSON Schema object.\nLearn how to build JSON schemas [here](https://json-schema.org/).',
                additionalProperties: true,
              },
              strict: {
                type: 'object',
                title: 'Strict',
                additionalProperties: true,
              },
            },
            required: ['name'],
          },
          type: {
            type: 'string',
            title: 'Type',
            enum: ['json_schema'],
          },
        },
        required: ['json_schema'],
      },
      response_format_json_object: {
        type: 'object',
        title: 'ResponseFormatJsonObject',
        description:
          'JSON object response format. An older method of generating JSON responses.\nUsing `json_schema` is recommended for models that support it. Note that the\nmodel will not generate JSON without a system or user message instructing it\nto do so.',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            enum: ['json_object'],
          },
        },
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
