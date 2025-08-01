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
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nGet information about a specific model.\n\nReturns detailed information about a specific model by ID.\nThe model must be available to your API key's configured providers.\n\nArgs:\n    model_id: The ID of the model to retrieve (e.g., 'gpt-4', 'claude-3-5-sonnet-20241022')\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    Model: Information about the requested model\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 404 if model not found or not accessible with current API key\n        - 500 if internal error occurs\n\nRequires:\n    Valid API key with 'read' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key=\"your-api-key\")\n    model = client.models.retrieve(\"gpt-4\")\n\n    print(f\"Model: {model.id}\")\n    print(f\"Owner: {model.owned_by}\")\n    ```\n\n    Response:\n    ```json\n    {\n        \"id\": \"gpt-4\",\n        \"object\": \"model\",\n        \"created\": 1687882411,\n        \"owned_by\": \"openai\"\n    }\n    ```\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/model',\n  $defs: {\n    model: {\n      type: 'object',\n      title: 'Model',\n      description: 'Model information compatible with OpenAI API.\\n\\nRepresents a language model available through the Dedalus API.\\nModels are aggregated from multiple providers (OpenAI, Anthropic, etc.)\\nand made available through a unified interface.\\n\\nAttributes:\\n    id: Unique model identifier (e.g., \\'gpt-4\\', \\'claude-3-5-sonnet-20241022\\')\\n    object: Always \\'model\\' for compatibility with OpenAI API\\n    created: Unix timestamp when model was created (may be None)\\n    owned_by: Provider organization that owns the model\\n    root: Base model identifier if this is a fine-tuned variant\\n    parent: Parent model identifier for hierarchical relationships\\n    permission: Access permissions (reserved for future use)\\n\\nExample:\\n    {\\n        \"id\": \"gpt-4\",\\n        \"object\": \"model\",\\n        \"created\": 1687882411,\\n        \"owned_by\": \"openai\"\\n    }',\n      properties: {\n        id: {\n          type: 'string',\n          title: 'Id',\n          description: 'Model identifier'\n        },\n        created: {\n          type: 'integer',\n          title: 'Created',\n          description: 'Creation timestamp'\n        },\n        object: {\n          type: 'string',\n          title: 'Object',\n          description: 'Object type'\n        },\n        owned_by: {\n          type: 'string',\n          title: 'Owned By',\n          description: 'Model owner'\n        },\n        parent: {\n          type: 'string',\n          title: 'Parent',\n          description: 'Parent model'\n        },\n        permission: {\n          type: 'array',\n          title: 'Permission',\n          description: 'Permissions',\n          items: {\n            type: 'object'\n          }\n        },\n        root: {\n          type: 'string',\n          title: 'Root',\n          description: 'Root model'\n        }\n      },\n      required: [        'id'\n      ]\n    }\n  }\n}\n```",
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
