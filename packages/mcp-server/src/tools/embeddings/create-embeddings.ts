// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'dedalus-labs-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'embeddings',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/embeddings',
  operationId: 'create_embeddings_v1_embeddings_post',
};

export const tool: Tool = {
  name: 'create_embeddings',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreate embeddings using the configured provider.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/create_embedding_response',\n  $defs: {\n    create_embedding_response: {\n      type: 'object',\n      title: 'CreateEmbeddingResponse',\n      description: 'Response from embeddings endpoint.',\n      properties: {\n        data: {\n          type: 'array',\n          title: 'Data',\n          description: 'List of embedding objects',\n          items: {\n            type: 'object',\n            title: 'Embedding',\n            description: 'Single embedding object.',\n            properties: {\n              embedding: {\n                anyOf: [                  {\n                    type: 'array',\n                    items: {\n                      type: 'number'\n                    }\n                  },\n                  {\n                    type: 'string'\n                  }\n                ],\n                title: 'Embedding',\n                description: 'The embedding vector (float array or base64 string)'\n              },\n              index: {\n                type: 'integer',\n                title: 'Index',\n                description: 'Index of the embedding in the list'\n              },\n              object: {\n                type: 'string',\n                title: 'Object',\n                description: 'Object type, always \\'embedding\\'',\n                enum: [                  'embedding'\n                ]\n              }\n            },\n            required: [              'embedding',\n              'index'\n            ]\n          }\n        },\n        model: {\n          type: 'string',\n          title: 'Model',\n          description: 'The model used for embeddings'\n        },\n        usage: {\n          type: 'object',\n          title: 'Usage',\n          description: 'Usage statistics (prompt_tokens, total_tokens)',\n          additionalProperties: true\n        },\n        object: {\n          type: 'string',\n          title: 'Object',\n          description: 'Object type, always \\'list\\'',\n          enum: [            'list'\n          ]\n        }\n      },\n      required: [        'data',\n        'model',\n        'usage'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      input: {
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
          {
            type: 'array',
            items: {
              type: 'integer',
            },
          },
          {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'integer',
              },
            },
          },
        ],
        title: 'Input',
        description:
          'Input text to embed, encoded as a string or array of tokens. To embed multiple inputs in a single request, pass an array of strings or array of token arrays. The input must not exceed the max input tokens for the model (8192 tokens for all embedding models), cannot be an empty string, and any array must be 2048 dimensions or less. [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) for counting tokens. In addition to the per-input token limit, all embedding  models enforce a maximum of 300,000 tokens summed across all inputs in a  single request.',
      },
      model: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'string',
            description:
              'ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models) for descriptions of them.',
            enum: ['text-embedding-ada-002', 'text-embedding-3-small', 'text-embedding-3-large'],
          },
        ],
        title: 'Model',
        description:
          'ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models) for descriptions of them.',
      },
      dimensions: {
        type: 'integer',
        title: 'Dimensions',
        description:
          'The number of dimensions the resulting output embeddings should have. Only supported in `text-embedding-3` and later models.',
      },
      encoding_format: {
        type: 'string',
        title: 'Encoding Format',
        description:
          'The format to return the embeddings in. Can be either `float` or [`base64`](https://pypi.org/project/pybase64/).',
        enum: ['float', 'base64'],
      },
      user: {
        type: 'string',
        title: 'User',
        description:
          'A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['input', 'model'],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.embeddings.create(body)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
