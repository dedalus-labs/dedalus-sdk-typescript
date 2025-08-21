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
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nGet information about a specific model.\n\nReturns detailed information about a specific model by ID.\nThe model must be available to your API key's configured providers.\n\nArgs:\n    model_id: The ID of the model to retrieve (e.g., 'openai/gpt-4', 'anthropic/claude-3-5-sonnet-20241022')\n    user: Authenticated user obtained from API key validation\n\nReturns:\n    DedalusModel: Information about the requested model\n\nRaises:\n    HTTPException:\n        - 401 if authentication fails\n        - 404 if model not found or not accessible with current API key\n        - 500 if internal error occurs\n\nRequires:\n    Valid API key with 'read' scope permission\n\nExample:\n    ```python\n    import dedalus_labs\n\n    client = dedalus_labs.Client(api_key=\"your-api-key\")\n    model = client.models.retrieve(\"openai/gpt-4\")\n\n    print(f\"Model: {model.id}\")\n    print(f\"Owner: {model.owned_by}\")\n    ```\n\n    Response:\n    ```json\n    {\n        \"id\": \"openai/gpt-4\",\n        \"object\": \"model\",\n        \"created\": 1687882411,\n        \"owned_by\": \"openai\"\n    }\n    ```\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/dedalus_model',\n  $defs: {\n    dedalus_model: {\n      type: 'object',\n      title: 'DedalusModel',\n      description: 'Model configuration for chat completions.\\n\\nA user-friendly model configuration object that bundles model selection\\nwith model-specific parameters. Unlike the Model class (which represents\\nAPI response data), this class is designed for request configuration.\\n\\nUse this when you want to:\\n- Pre-configure model parameters\\n- Pass model-specific settings\\n- Use intelligent routing with attributes\\n\\nExample:\\n    model = DedalusModel(\\n        name=\"gpt-4\",\\n        temperature=0.7,\\n        max_tokens=1000,\\n        attributes={\"intelligence\": 0.9, \"cost\": 0.8}\\n    )\\n\\n    completion = client.chat.completions.create(\\n        model=model,  # Pass the configured model\\n        messages=[...]\\n    )',\n      properties: {\n        name: {\n          type: 'string',\n          title: 'Name',\n          description: 'Model name (e.g., \\'gpt-4\\', \\'claude-3-5-sonnet\\')'\n        },\n        attributes: {\n          type: 'object',\n          title: 'Attributes',\n          description: '[Dedalus] Custom attributes for intelligent model routing (e.g., intelligence, speed, creativity, cost).',\n          additionalProperties: true\n        },\n        frequency_penalty: {\n          type: 'number',\n          title: 'Frequency Penalty',\n          description: 'Penalize new tokens based on their frequency in the text so far.'\n        },\n        logit_bias: {\n          type: 'object',\n          title: 'Logit Bias',\n          description: 'Modify the likelihood of specified tokens appearing.',\n          additionalProperties: true\n        },\n        logprobs: {\n          type: 'boolean',\n          title: 'Logprobs',\n          description: 'Whether to return log probabilities of the output tokens.'\n        },\n        max_completion_tokens: {\n          type: 'integer',\n          title: 'Max Completion Tokens',\n          description: 'An upper bound for the number of tokens that can be generated for a completion.'\n        },\n        max_tokens: {\n          type: 'integer',\n          title: 'Max Tokens',\n          description: 'Maximum number of tokens to generate.'\n        },\n        metadata: {\n          type: 'object',\n          title: 'Metadata',\n          description: '[Dedalus] Additional metadata for request tracking and debugging.',\n          additionalProperties: true\n        },\n        n: {\n          type: 'integer',\n          title: 'N',\n          description: 'Number of completions to generate for each prompt.'\n        },\n        parallel_tool_calls: {\n          type: 'boolean',\n          title: 'Parallel Tool Calls',\n          description: 'Whether to enable parallel function calling.'\n        },\n        presence_penalty: {\n          type: 'number',\n          title: 'Presence Penalty',\n          description: 'Penalize new tokens based on whether they appear in the text so far.'\n        },\n        response_format: {\n          type: 'object',\n          title: 'Response Format',\n          description: 'Format for the model output (e.g., {\\'type\\': \\'json_object\\'}).',\n          additionalProperties: true\n        },\n        seed: {\n          type: 'integer',\n          title: 'Seed',\n          description: 'Seed for deterministic sampling.'\n        },\n        service_tier: {\n          type: 'string',\n          title: 'Service Tier',\n          description: 'Latency tier for the request (e.g., \\'auto\\', \\'default\\').'\n        },\n        stop: {\n          anyOf: [            {\n              type: 'string'\n            },\n            {\n              type: 'array',\n              items: {\n                type: 'string'\n              }\n            }\n          ],\n          title: 'Stop',\n          description: 'Up to 4 sequences where the API will stop generating further tokens.'\n        },\n        stream: {\n          type: 'boolean',\n          title: 'Stream',\n          description: 'Whether to stream back partial progress.'\n        },\n        stream_options: {\n          type: 'object',\n          title: 'Stream Options',\n          description: 'Options for streaming responses.',\n          additionalProperties: true\n        },\n        temperature: {\n          type: 'number',\n          title: 'Temperature',\n          description: 'Sampling temperature (0 to 2). Higher values make output more random.'\n        },\n        tool_choice: {\n          anyOf: [            {\n              type: 'string'\n            },\n            {\n              type: 'object',\n              additionalProperties: true\n            }\n          ],\n          title: 'Tool Choice',\n          description: 'Controls which tool is called by the model.'\n        },\n        tools: {\n          type: 'array',\n          title: 'Tools',\n          description: 'List of tools the model may call.',\n          items: {\n            type: 'object',\n            additionalProperties: true\n          }\n        },\n        top_logprobs: {\n          type: 'integer',\n          title: 'Top Logprobs',\n          description: 'Number of most likely tokens to return at each token position.'\n        },\n        top_p: {\n          type: 'number',\n          title: 'Top P',\n          description: 'Nucleus sampling parameter. Alternative to temperature.'\n        },\n        user: {\n          type: 'string',\n          title: 'User',\n          description: 'A unique identifier representing your end-user.'\n        }\n      },\n      required: [        'name'\n      ]\n    }\n  }\n}\n```",
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
