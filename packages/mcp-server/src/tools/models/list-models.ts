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
  httpPath: '/v1/models',
  operationId: 'list_models_v1_models_get',
};

export const tool: Tool = {
  name: 'list_models',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nList available models.\n\nReturns a list of available models from all configured providers.\nModels are filtered based on provider availability and API key configuration.\nOnly models from providers with valid API keys are returned.\n\nArgs:\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    ModelsResponse: Object containing list of available models\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 500 if internal error occurs during model listing\n\nRequires:\n    Valid API key with 'read' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key=\"your-api-key\")\n    models = client.models.list()\n\n    for model in models.data:\n        print(f\"Model: {model.id} (Owner: {model.owned_by})\")\n    ```\n\n    Response:\n    ```json\n    {\n        \"object\": \"list\",\n        \"data\": [\n            {\n                \"id\": \"gpt-4\",\n                \"object\": \"model\",\n                \"owned_by\": \"openai\"\n            },\n            {\n                \"id\": \"claude-3-5-sonnet-20241022\",\n                \"object\": \"model\",\n                \"owned_by\": \"anthropic\"\n            }\n        ]\n    }\n    ```\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/models_response',\n  $defs: {\n    models_response: {\n      type: 'object',\n      title: 'ModelsResponse',\n      description: 'Response containing list of available models.\\n\\nReturns all models available to the authenticated user based on\\ntheir API key permissions and configured providers.\\n\\nAttributes:\\n    object: Always \\'list\\' for compatibility with OpenAI API\\n    data: List of Model objects representing available models\\n\\nExample:\\n    {\\n        \"object\": \"list\",\\n        \"data\": [\\n            {\\n                \"id\": \"gpt-4\",\\n                \"object\": \"model\",\\n                \"owned_by\": \"openai\"\\n            },\\n            {\\n                \"id\": \"claude-3-5-sonnet-20241022\",\\n                \"object\": \"model\",\\n                \"owned_by\": \"anthropic\"\\n            }\\n        ]\\n    }',\n      properties: {\n        data: {\n          type: 'array',\n          title: 'Data',\n          description: 'List of models',\n          items: {\n            $ref: '#/$defs/model'\n          }\n        },\n        object: {\n          type: 'string',\n          title: 'Object',\n          description: 'Object type'\n        }\n      },\n      required: [        'data'\n      ]\n    },\n    model: {\n      type: 'object',\n      title: 'Model',\n      description: 'Model information compatible with OpenAI API.\\n\\nRepresents a language model available through the Dedalus API.\\nModels are aggregated from multiple providers (OpenAI, Anthropic, etc.)\\nand made available through a unified interface.\\n\\nAttributes:\\n    id: Unique model identifier (e.g., \\'gpt-4\\', \\'claude-3-5-sonnet-20241022\\')\\n    object: Always \\'model\\' for compatibility with OpenAI API\\n    created: Unix timestamp when model was created (may be None)\\n    owned_by: Provider organization that owns the model\\n    root: Base model identifier if this is a fine-tuned variant\\n    parent: Parent model identifier for hierarchical relationships\\n    permission: Access permissions (reserved for future use)\\n\\nExample:\\n    {\\n        \"id\": \"gpt-4\",\\n        \"object\": \"model\",\\n        \"created\": 1687882411,\\n        \"owned_by\": \"openai\"\\n    }',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Model identifier'\n        },\n        created: {\n          type: 'integer',\n          title: 'Created',\n          description: 'Creation timestamp'\n        },\n        object: {\n          type: 'string',\n          title: 'Object',\n          description: 'Object type'\n        },\n        owned_by: {\n          type: 'string',\n          title: 'Owned By',\n          description: 'Model owner'\n        },\n        parent: {\n          type: 'string',\n          title: 'Parent',\n          description: 'Parent model'\n        },\n        permission: {\n          type: 'array',\n          title: 'Permission',\n          description: 'Permissions',\n          items: {\n            type: 'object'\n          }\n        },\n        root: {\n          type: 'string',\n          title: 'Root',\n          description: 'Root model'\n        }\n      },\n      required: [        'id'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: [],
  },
  annotations: {
    readOnlyHint: true,
  },
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const { jq_filter } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.models.list()));
};

export default { metadata, tool, handler };
