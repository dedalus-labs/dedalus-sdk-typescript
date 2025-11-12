// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { isJqError, maybeFilter } from 'dedalus-labs-mcp/filtering';
import { Metadata, asErrorResult, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'images',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/images/variations',
  operationId: 'create_variation_v1_images_variations_post',
};

export const tool: Tool = {
  name: 'create_variation_images',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nCreate variations of an image.\n\nDALL·E 2 only. Upload an image to generate variations.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/images_response',\n  $defs: {\n    images_response: {\n      type: 'object',\n      title: 'ImagesResponse',\n      description: 'Response from image generation.',\n      properties: {\n        created: {\n          type: 'integer',\n          title: 'Created',\n          description: 'Unix timestamp when images were created'\n        },\n        data: {\n          type: 'array',\n          title: 'Data',\n          description: 'List of generated images',\n          items: {\n            $ref: '#/$defs/image'\n          }\n        }\n      },\n      required: [        'created',\n        'data'\n      ]\n    },\n    image: {\n      type: 'object',\n      title: 'Image',\n      description: 'Single image object.',\n      properties: {\n        b64_json: {\n          type: 'string',\n          title: 'B64 Json',\n          description: 'Base64-encoded image data (if response_format=b64_json)'\n        },\n        revised_prompt: {\n          type: 'string',\n          title: 'Revised Prompt',\n          description: 'Revised prompt used for generation (dall-e-3)'\n        },\n        url: {\n          type: 'string',\n          title: 'Url',\n          description: 'URL of the generated image (if response_format=url)'\n        }\n      }\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        title: 'Image',
      },
      model: {
        type: 'string',
        title: 'Model',
      },
      n: {
        type: 'integer',
        title: 'N',
      },
      response_format: {
        type: 'string',
        title: 'Response Format',
      },
      size: {
        type: 'string',
        title: 'Size',
      },
      user: {
        type: 'string',
        title: 'User',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['image'],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  try {
    return asTextContentResult(await maybeFilter(jq_filter, await client.images.createVariation(body)));
  } catch (error) {
    if (isJqError(error)) {
      return asErrorResult(error.message);
    }
    throw error;
  }
};

export default { metadata, tool, handler };
