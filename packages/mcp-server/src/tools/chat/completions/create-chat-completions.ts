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
  operationId: 'create_v1_chat_completions_post',
};

export const tool: Tool = {
  name: 'create_chat_completions',
  description:
    'Create a chat completion using the Agent framework.\n\nThis endpoint provides a vendor-agnostic chat completion API that works with\n100+ LLM providers via the Agent framework. It supports both single and\nmulti-model routing, client-side and server-side tool execution, and\nintegration with MCP (Model Context Protocol) servers.\n\nFeatures:\n    - Cross-vendor compatibility (OpenAI, Anthropic, Cohere, etc.)\n    - Multi-model routing with intelligent agentic handoffs\n    - Client-side tool execution (tools returned as JSON)\n    - Server-side MCP tool execution with automatic billing\n    - Streaming and non-streaming responses\n    - Advanced agent attributes for routing decisions\n    - Automatic usage tracking and billing\n\nArgs:\n    request: Chat completion request with messages, model, and configuration\n    http_request: FastAPI request object for accessing headers and state\n    background_tasks: FastAPI background tasks for async billing operations\n    user: Authenticated user with validated API key and sufficient balance\n\nReturns:\n    ChatCompletion: OpenAI-compatible completion response with usage data\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails or insufficient balance\n        - 400 if request validation fails\n        - 500 if internal processing error occurs\n\nBilling:\n    - Token usage billed automatically based on model pricing\n    - MCP tool calls billed separately using credits system\n    - Streaming responses billed after completion via background task\n\nExample:\n    Basic chat completion:\n    ```python\n    from dedalus_labs import Dedalus\n\n    client = Dedalus(api_key="your-api-key")\n\n    completion = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Hello, how are you?"}],\n    )\n\n    print(completion.choices[0].message.content)\n    ```\n\n    With tools and MCP servers:\n    ```python\n    completion = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Search for recent AI news"}],\n        tools=[\n            {\n                "type": "function",\n                "function": {\n                    "name": "search_web",\n                    "description": "Search the web for information",\n                },\n            }\n        ],\n        mcp_servers=["dedalus-labs/brave-search"],\n    )\n    ```\n\n    Multi-model routing:\n    ```python\n    completion = client.chat.completions.create(\n        model=[\n            "openai/gpt-4o-mini",\n            "openai/gpt-5",\n            "anthropic/claude-sonnet-4-20250514",\n        ],\n        messages=[{"role": "user", "content": "Analyze this complex data"}],\n        agent_attributes={"complexity": 0.8, "accuracy": 0.9},\n    )\n    ```\n\n    Streaming response:\n    ```python\n    stream = client.chat.completions.create(\n        model="openai/gpt-5",\n        messages=[{"role": "user", "content": "Tell me a story"}],\n        stream=True,\n    )\n\n    for chunk in stream:\n        if chunk.choices[0].delta.content:\n            print(chunk.choices[0].delta.content, end="")\n    ```',
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
              'Messages to the model. Supports role/content structure and multimodal content arrays.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
            additionalProperties: true,
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              'Frequency penalty (-2 to 2). Positive values penalize new tokens based on their existing frequency in the text so far, decreasing likelihood of repeated phrases.',
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
              'Modify likelihood of specified tokens appearing in the completion. Maps token IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100 = strongly favor token.',
            additionalProperties: true,
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              'Maximum number of tokens to generate in the completion. Does not include tokens in the input messages.',
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description:
              'Maximum number of turns for agent execution before terminating (default: 10). Each turn represents one model inference cycle. Higher values allow more complex reasoning but increase cost and latency.',
          },
          mcp_servers: {
            type: 'array',
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Can be URLs (e.g., 'https://mcp.example.com') or slugs (e.g., 'dedalus-labs/brave-search'). MCP tools are executed server-side and billed separately.",
            items: {
              type: 'string',
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
            description: 'Number of completions to generate. Note: only n=1 is currently supported.',
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              'Presence penalty (-2 to 2). Positive values penalize new tokens based on whether they appear in the text so far, encouraging the model to talk about new topics.',
          },
          stop: {
            type: 'array',
            title: 'Stop',
            description:
              'Up to 4 sequences where the API will stop generating further tokens. The model will stop as soon as it encounters any of these sequences.',
            items: {
              type: 'string',
            },
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description:
              'Whether to stream back partial message deltas as Server-Sent Events. When true, partial message deltas will be sent as OpenAI-compatible chunks.',
            enum: [false],
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              'Sampling temperature (0 to 2). Higher values make output more random, lower values make it more focused and deterministic. 0 = deterministic, 1 = balanced, 2 = very creative.',
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
              "Controls which tool is called by the model. Options: 'auto' (default), 'none', 'required', or specific tool name. Can also be a dict specifying a particular tool.",
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description:
              "list of tools available to the model in OpenAI function calling format. Tools are executed client-side and returned as JSON for the application to handle. Use 'mcp_servers' for server-side tool execution.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              'Nucleus sampling parameter (0 to 1). Alternative to temperature. 0.1 = only top 10% probability mass, 1.0 = consider all tokens.',
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              'Unique identifier representing your end-user. Used for monitoring and abuse detection. Should be consistent across requests from the same user.',
          },
        },
        required: ['messages'],
      },
      {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            title: 'Messages',
            description:
              'Messages to the model. Supports role/content structure and multimodal content arrays.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          stream: {
            type: 'string',
            title: 'Stream',
            description:
              'Whether to stream back partial message deltas as Server-Sent Events. When true, partial message deltas will be sent as OpenAI-compatible chunks.',
            enum: [true],
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
            additionalProperties: true,
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description:
              'Frequency penalty (-2 to 2). Positive values penalize new tokens based on their existing frequency in the text so far, decreasing likelihood of repeated phrases.',
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
              'Modify likelihood of specified tokens appearing in the completion. Maps token IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100 = strongly favor token.',
            additionalProperties: true,
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description:
              'Maximum number of tokens to generate in the completion. Does not include tokens in the input messages.',
          },
          max_turns: {
            type: 'integer',
            title: 'Max Turns',
            description:
              'Maximum number of turns for agent execution before terminating (default: 10). Each turn represents one model inference cycle. Higher values allow more complex reasoning but increase cost and latency.',
          },
          mcp_servers: {
            type: 'array',
            title: 'Mcp Servers',
            description:
              "MCP (Model Context Protocol) server addresses to make available for server-side tool execution. Can be URLs (e.g., 'https://mcp.example.com') or slugs (e.g., 'dedalus-labs/brave-search'). MCP tools are executed server-side and billed separately.",
            items: {
              type: 'string',
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
            description: 'Number of completions to generate. Note: only n=1 is currently supported.',
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description:
              'Presence penalty (-2 to 2). Positive values penalize new tokens based on whether they appear in the text so far, encouraging the model to talk about new topics.',
          },
          stop: {
            type: 'array',
            title: 'Stop',
            description:
              'Up to 4 sequences where the API will stop generating further tokens. The model will stop as soon as it encounters any of these sequences.',
            items: {
              type: 'string',
            },
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description:
              'Sampling temperature (0 to 2). Higher values make output more random, lower values make it more focused and deterministic. 0 = deterministic, 1 = balanced, 2 = very creative.',
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
              "Controls which tool is called by the model. Options: 'auto' (default), 'none', 'required', or specific tool name. Can also be a dict specifying a particular tool.",
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description:
              "list of tools available to the model in OpenAI function calling format. Tools are executed client-side and returned as JSON for the application to handle. Use 'mcp_servers' for server-side tool execution.",
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description:
              'Nucleus sampling parameter (0 to 1). Alternative to temperature. 0.1 = only top 10% probability mass, 1.0 = consider all tokens.',
          },
          user: {
            type: 'string',
            title: 'User',
            description:
              'Unique identifier representing your end-user. Used for monitoring and abuse detection. Should be consistent across requests from the same user.',
          },
        },
        required: ['messages', 'stream'],
      },
    ],
    $defs: {
      model_id: {
        type: 'string',
        title: 'ModelId',
        description: "Model identifier string (e.g. 'openai/gpt-4', 'anthropic/claude-3-5-sonnet').",
      },
      dedalus_model: {
        type: 'object',
        title: 'DedalusModel',
        description:
          'Model configuration for chat completions.\n\nA user-friendly model configuration object that bundles model selection\nwith model-specific parameters. Unlike the Model class (which represents\nAPI response data), this class is designed for request configuration.\n\nUse this when you want to:\n- Pre-configure model parameters\n- Pass model-specific settings\n- Use intelligent routing with attributes\n\nExample:\n    model = DedalusModel(\n        name="gpt-4",\n        temperature=0.7,\n        max_tokens=1000,\n        attributes={"intelligence": 0.9, "cost": 0.8}\n    )\n\n    completion = client.chat.completions.create(\n        model=model,  # Pass the configured model\n        messages=[...]\n    )',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description: "Model name (e.g., 'gpt-4', 'claude-3-5-sonnet')",
          },
          attributes: {
            type: 'object',
            title: 'Attributes',
            description:
              '[Dedalus] Custom attributes for intelligent model routing (e.g., intelligence, speed, creativity, cost).',
            additionalProperties: true,
          },
          frequency_penalty: {
            type: 'number',
            title: 'Frequency Penalty',
            description: 'Penalize new tokens based on their frequency in the text so far.',
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description: 'Modify the likelihood of specified tokens appearing.',
            additionalProperties: true,
          },
          logprobs: {
            type: 'boolean',
            title: 'Logprobs',
            description: 'Whether to return log probabilities of the output tokens.',
          },
          max_completion_tokens: {
            type: 'integer',
            title: 'Max Completion Tokens',
            description: 'An upper bound for the number of tokens that can be generated for a completion.',
          },
          max_tokens: {
            type: 'integer',
            title: 'Max Tokens',
            description: 'Maximum number of tokens to generate.',
          },
          metadata: {
            type: 'object',
            title: 'Metadata',
            description: '[Dedalus] Additional metadata for request tracking and debugging.',
            additionalProperties: true,
          },
          n: {
            type: 'integer',
            title: 'N',
            description: 'Number of completions to generate for each prompt.',
          },
          parallel_tool_calls: {
            type: 'boolean',
            title: 'Parallel Tool Calls',
            description: 'Whether to enable parallel function calling.',
          },
          presence_penalty: {
            type: 'number',
            title: 'Presence Penalty',
            description: 'Penalize new tokens based on whether they appear in the text so far.',
          },
          response_format: {
            type: 'object',
            title: 'Response Format',
            description: "Format for the model output (e.g., {'type': 'json_object'}).",
            additionalProperties: true,
          },
          seed: {
            type: 'integer',
            title: 'Seed',
            description: 'Seed for deterministic sampling.',
          },
          service_tier: {
            type: 'string',
            title: 'Service Tier',
            description: "Latency tier for the request (e.g., 'auto', 'default').",
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
            description: 'Up to 4 sequences where the API will stop generating further tokens.',
          },
          stream: {
            type: 'boolean',
            title: 'Stream',
            description: 'Whether to stream back partial progress.',
          },
          stream_options: {
            type: 'object',
            title: 'Stream Options',
            description: 'Options for streaming responses.',
            additionalProperties: true,
          },
          temperature: {
            type: 'number',
            title: 'Temperature',
            description: 'Sampling temperature (0 to 2). Higher values make output more random.',
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
            description: 'Controls which tool is called by the model.',
          },
          tools: {
            type: 'array',
            title: 'Tools',
            description: 'List of tools the model may call.',
            items: {
              type: 'object',
              additionalProperties: true,
            },
          },
          top_logprobs: {
            type: 'integer',
            title: 'Top Logprobs',
            description: 'Number of most likely tokens to return at each token position.',
          },
          top_p: {
            type: 'number',
            title: 'Top P',
            description: 'Nucleus sampling parameter. Alternative to temperature.',
          },
          user: {
            type: 'string',
            title: 'User',
            description: 'A unique identifier representing your end-user.',
          },
        },
        required: ['name'],
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
