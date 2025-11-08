// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'dedalus-labs-mcp/filtering';
import { Metadata, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'models',
  operation: 'read',
  tags: [],
  httpMethod: 'get',
  httpPath: '/v1/models/{model_id}',
  operationId: 'get_model_v1_models__model_id__get',
};

export const tool: Tool = {
  name: 'retrieve_models',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nRetrieve a model.\n\nRetrieve detailed information about a specific model, including its capabilities,\nprovider, and supported features.\n\nArgs:\n    model_id: The ID of the model to retrieve (e.g., 'openai/gpt-4', 'anthropic/claude-3-5-sonnet-20241022')\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    Model: Information about the requested model\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 404 if model not found or not accessible with current API key\n        - 500 if internal error occurs\n\nRequires:\n    Valid API key with 'read' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key=\"your-api-key\")\n    model = client.models.retrieve(\"openai/gpt-4\")\n\n    print(f\"Model: {model.id}\")\n    print(f\"Owner: {model.owned_by}\")\n    ```\n\n    Response:\n    ```json\n    {\n        \"id\": \"openai/gpt-4\",\n        \"object\": \"model\",\n        \"created\": 1687882411,\n        \"owned_by\": \"openai\"\n    }\n    ```\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/model',\n  $defs: {\n    model: {\n      type: 'object',\n      title: 'Model',\n      description: 'Unified model metadata across all providers.\\n\\nCombines provider-specific schemas into a single, consistent format.\\nFields that aren\\'t available from a provider are set to None.',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Unique model identifier with provider prefix (e.g., \\'openai/gpt-4\\')'\n        },\n        created_at: {\n          type: 'string',\n          title: 'Created At',\n          description: 'When the model was released (RFC 3339)',\n          format: 'date-time'\n        },\n        provider: {\n          type: 'string',\n          title: 'Provider',\n          description: 'Provider that hosts this model',\n          enum: [            'openai',\n            'anthropic',\n            'google',\n            'xai',\n            'mistral',\n            'groq',\n            'fireworks',\n            'deepseek'\n          ]\n        },\n        capabilities: {\n          type: 'object',\n          title: 'ModelCapabilities',\n          description: 'Normalized model capabilities across all providers.',\n          properties: {\n            audio: {\n              type: 'boolean',\n              title: 'Audio',\n              description: 'Supports audio processing'\n            },\n            image_generation: {\n              type: 'boolean',\n              title: 'Image Generation',\n              description: 'Supports image generation'\n            },\n            input_token_limit: {\n              type: 'integer',\n              title: 'Input Token Limit',\n              description: 'Maximum input tokens'\n            },\n            output_token_limit: {\n              type: 'integer',\n              title: 'Output Token Limit',\n              description: 'Maximum output tokens'\n            },\n            streaming: {\n              type: 'boolean',\n              title: 'Streaming',\n              description: 'Supports streaming responses'\n            },\n            structured_output: {\n              type: 'boolean',\n              title: 'Structured Output',\n              description: 'Supports structured JSON output'\n            },\n            text: {\n              type: 'boolean',\n              title: 'Text',\n              description: 'Supports text generation'\n            },\n            thinking: {\n              type: 'boolean',\n              title: 'Thinking',\n              description: 'Supports extended thinking/reasoning'\n            },\n            tools: {\n              type: 'boolean',\n              title: 'Tools',\n              description: 'Supports function/tool calling'\n            },\n            vision: {\n              type: 'boolean',\n              title: 'Vision',\n              description: 'Supports image understanding'\n            }\n          }\n        },\n        defaults: {\n          type: 'object',\n          title: 'ModelDefaults',\n          description: 'Provider-declared default parameters for model generation.',\n          properties: {\n            max_output_tokens: {\n              type: 'integer',\n              title: 'Max Output Tokens',\n              description: 'Default maximum output tokens'\n            },\n            temperature: {\n              type: 'number',\n              title: 'Temperature',\n              description: 'Default temperature setting'\n            },\n            top_k: {\n              type: 'integer',\n              title: 'Top K',\n              description: 'Default top_k setting'\n            },\n            top_p: {\n              type: 'number',\n              title: 'Top P',\n              description: 'Default top_p setting'\n            }\n          }\n        },\n        description: {\n          type: 'string',\n          title: 'Description',\n          description: 'Model description'\n        },\n        display_name: {\n          type: 'string',\n          title: 'Display Name',\n          description: 'Human-readable model name'\n        },\n        provider_declared_generation_methods: {\n          type: 'array',\n          title: 'Provider Declared Generation Methods',\n          description: 'Provider-specific generation method names (None = not declared)',\n          items: {\n            type: 'string'\n          }\n        },\n        provider_info: {\n          type: 'object',\n          title: 'Provider Info',\n          description: 'Raw provider-specific metadata',\n          additionalProperties: true\n        },\n        version: {\n          type: 'string',\n          title: 'Version',\n          description: 'Model version identifier'\n        }\n      },\n      required: [        'id',\n        'created_at',\n        'provider'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      model_id: {
        type: 'string',
        title: 'Model Id',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['model_id'],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const { model_id, jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.models.retrieve(model_id)));
};

export default { metadata, tool, handler };
