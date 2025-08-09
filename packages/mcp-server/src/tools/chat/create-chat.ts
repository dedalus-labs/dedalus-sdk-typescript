// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'chat',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/chat',
  operationId: 'create_v1_chat_post',
};

export const tool: Tool = {
  name: 'create_chat',
  description:
    'Create a chat completion using the Agent framework.\n\nThis endpoint provides a vendor-agnostic chat completion API that works with\n100+ LLM providers via the Agent framework. It supports both single and\nmulti-model routing, client-side and server-side tool execution, and\nintegration with MCP (Model Context Protocol) servers.\n\nFeatures:\n    - Cross-vendor compatibility (OpenAI, Anthropic, Cohere, etc.)\n    - Multi-model routing with intelligent agentic handoffs\n    - Client-side tool execution (tools returned as JSON)\n    - Server-side MCP tool execution with automatic billing\n    - Streaming and non-streaming responses\n    - Advanced agent attributes for routing decisions\n    - Automatic usage tracking and billing\n\nArgs:\n    request: Chat completion request with messages, model, and configuration\n    http_request: FastAPI request object for accessing headers and state\n    background_tasks: FastAPI background tasks for async billing operations\n    user: Authenticated user with validated API key and sufficient balance\n\nReturns:\n    ChatCompletion: OpenAI-compatible completion response with usage data\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails or insufficient balance\n        - 400 if request validation fails\n        - 500 if internal processing error occurs\n\nBilling:\n    - Token usage billed automatically based on model pricing\n    - MCP tool calls billed separately using credits system\n    - Streaming responses billed after completion via background task\n\nExample:\n    Basic chat completion:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key="your-api-key")\n\n    completion = client.chat.create(\n        model="gpt-4",\n        input=[{"role": "user", "content": "Hello, how are you?"}],\n    )\n\n    print(completion.choices[0].message.content)\n    ```\n\n    With tools and MCP servers:\n    ```python\n    completion = client.chat.create(\n        model="gpt-4",\n        input=[{"role": "user", "content": "Search for recent AI news"}],\n        tools=[\n            {\n                "type": "function",\n                "function": {\n                    "name": "search_web",\n                    "description": "Search the web for information",\n                },\n            }\n        ],\n        mcp_servers=["dedalus-labs/brave-search"],\n    )\n    ```\n\n    Multi-model routing:\n    ```python\n    completion = client.chat.create(\n        model=["gpt-4o-mini", "gpt-4", "claude-3-5-sonnet"],\n        input=[{"role": "user", "content": "Analyze this complex data"}],\n        agent_attributes={"complexity": 0.8, "accuracy": 0.9},\n    )\n    ```\n\n    Streaming response:\n    ```python\n    stream = client.chat.create(\n        model="gpt-4",\n        input=[{"role": "user", "content": "Tell me a story"}],\n        stream=True,\n    )\n\n    for chunk in stream:\n        if chunk.choices[0].delta.content:\n            print(chunk.choices[0].delta.content, end="")\n    ```',
  inputSchema: {
    type: 'object',
    anyOf: [
      {
        type: 'object',
        properties: {
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
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
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description:
              'Configuration for multi-model handoffs and agent orchestration. Reserved for future use - handoff configuration format not yet finalized.',
          },
          input: {
            type: 'array',
            title: 'Input',
            description:
              'Input to the model - can be messages, images, or other modalities. Supports OpenAI chat format with role/content structure. For multimodal inputs, content can include text, images, or other media types.',
            items: {
              type: 'object',
            },
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description:
              'Modify likelihood of specified tokens appearing in the completion. Maps token IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100 = strongly favor token.',
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
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Model',
            description:
              "Model(s) to use for completion. Can be a single model ID or a list for multi-model routing. Single model: 'gpt-4', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini'. Multi-model routing: ['gpt-4o-mini', 'gpt-4', 'claude-3-5-sonnet'] - agent will choose optimal model based on task complexity.",
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              "Attributes for individual models used in routing decisions during multi-model execution. Format: {'model_name': {'attribute': value}}, where values are 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity', 'accuracy'. Used by agent to select optimal model based on task requirements.",
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
              'Whether to stream back partial message deltas as Server-Sent Events. When true, partial message deltas will be sent as chunks in OpenAI format.',
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
              "List of tools available to the model in OpenAI function calling format. Tools are executed client-side and returned as JSON for the application to handle. Use 'mcp_servers' for server-side tool execution.",
            items: {
              type: 'object',
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
        required: [],
      },
      {
        type: 'object',
        properties: {
          stream: {
            type: 'string',
            title: 'Stream',
            description:
              'Whether to stream back partial message deltas as Server-Sent Events. When true, partial message deltas will be sent as chunks in OpenAI format.',
            enum: [true],
          },
          agent_attributes: {
            type: 'object',
            title: 'Agent Attributes',
            description:
              "Attributes for the agent itself, influencing behavior and model selection. Format: {'attribute': value}, where values are 0.0-1.0. Common attributes: 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher values indicate stronger preference for that characteristic.",
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
            },
          },
          handoff_config: {
            type: 'object',
            title: 'Handoff Config',
            description:
              'Configuration for multi-model handoffs and agent orchestration. Reserved for future use - handoff configuration format not yet finalized.',
          },
          input: {
            type: 'array',
            title: 'Input',
            description:
              'Input to the model - can be messages, images, or other modalities. Supports OpenAI chat format with role/content structure. For multimodal inputs, content can include text, images, or other media types.',
            items: {
              type: 'object',
            },
          },
          logit_bias: {
            type: 'object',
            title: 'Logit Bias',
            description:
              'Modify likelihood of specified tokens appearing in the completion. Maps token IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100 = strongly favor token.',
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
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
            title: 'Model',
            description:
              "Model(s) to use for completion. Can be a single model ID or a list for multi-model routing. Single model: 'gpt-4', 'claude-3-5-sonnet-20241022', 'gpt-4o-mini'. Multi-model routing: ['gpt-4o-mini', 'gpt-4', 'claude-3-5-sonnet'] - agent will choose optimal model based on task complexity.",
          },
          model_attributes: {
            type: 'object',
            title: 'Model Attributes',
            description:
              "Attributes for individual models used in routing decisions during multi-model execution. Format: {'model_name': {'attribute': value}}, where values are 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity', 'accuracy'. Used by agent to select optimal model based on task requirements.",
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
              "List of tools available to the model in OpenAI function calling format. Tools are executed client-side and returned as JSON for the application to handle. Use 'mcp_servers' for server-side tool execution.",
            items: {
              type: 'object',
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
        required: ['stream'],
      },
    ],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.chat.create(body));
};

export default { metadata, tool, handler };
