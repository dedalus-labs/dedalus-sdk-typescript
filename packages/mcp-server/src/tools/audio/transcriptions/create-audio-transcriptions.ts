// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'dedalus-labs-mcp/filtering';
import { Metadata, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'audio.transcriptions',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/audio/transcriptions',
  operationId: 'create_transcription_v1_audio_transcriptions_post',
};

export const tool: Tool = {
  name: 'create_audio_transcriptions',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nTranscribe audio to text.\n\nOpenAI Whisper models only.\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/transcription_create_response',\n  $defs: {\n    transcription_create_response: {\n      type: 'object',\n      title: 'TranscriptionResponse',\n      description: 'Response from transcription endpoint.\\n\\nFor response_format=\\'json\\' or \\'text\\', only \\'text\\' is returned.\\nFor response_format=\\'verbose_json\\', additional fields are included.',\n      properties: {\n        text: {\n          type: 'string',\n          title: 'Text',\n          description: 'The transcribed text'\n        },\n        duration: {\n          type: 'number',\n          title: 'Duration',\n          description: 'The duration of the input audio in seconds'\n        },\n        language: {\n          type: 'string',\n          title: 'Language',\n          description: 'The language of the input audio'\n        },\n        segments: {\n          type: 'array',\n          title: 'Segments',\n          description: 'Segments of the transcribed text and their corresponding details',\n          items: {\n            type: 'object',\n            title: 'TranscriptionSegment',\n            description: 'Segment-level details for transcription.',\n            properties: {\n              id: {\n                type: 'integer',\n                title: 'Id',\n                description: 'Unique identifier of the segment'\n              },\n              avg_logprob: {\n                type: 'number',\n                title: 'Avg Logprob',\n                description: 'Average log probability of the segment'\n              },\n              compression_ratio: {\n                type: 'number',\n                title: 'Compression Ratio',\n                description: 'Compression ratio of the segment. If greater than 2.4, consider the compression failed'\n              },\n              end: {\n                type: 'number',\n                title: 'End',\n                description: 'End time of the segment in seconds'\n              },\n              no_speech_prob: {\n                type: 'number',\n                title: 'No Speech Prob',\n                description: 'Probability of no speech in the segment. If higher than 1.0 and avg_logprob is below -1, consider this segment silent'\n              },\n              seek: {\n                type: 'integer',\n                title: 'Seek',\n                description: 'Seek offset of the segment'\n              },\n              start: {\n                type: 'number',\n                title: 'Start',\n                description: 'Start time of the segment in seconds'\n              },\n              temperature: {\n                type: 'number',\n                title: 'Temperature',\n                description: 'Temperature parameter used for generating this segment'\n              },\n              text: {\n                type: 'string',\n                title: 'Text',\n                description: 'Text content of the segment'\n              },\n              tokens: {\n                type: 'array',\n                title: 'Tokens',\n                description: 'Array of token IDs for the segment',\n                items: {\n                  type: 'integer'\n                }\n              }\n            },\n            required: [              'id',\n              'avg_logprob',\n              'compression_ratio',\n              'end',\n              'no_speech_prob',\n              'seek',\n              'start',\n              'temperature',\n              'text',\n              'tokens'\n            ]\n          }\n        },\n        words: {\n          type: 'array',\n          title: 'Words',\n          description: 'Extracted words and their corresponding timestamps (requires timestamp_granularities=[\\'word\\'])',\n          items: {\n            type: 'object',\n            title: 'TranscriptionWord',\n            description: 'Word-level timestamp for transcription.',\n            properties: {\n              end: {\n                type: 'number',\n                title: 'End',\n                description: 'End time of the word in seconds'\n              },\n              start: {\n                type: 'number',\n                title: 'Start',\n                description: 'Start time of the word in seconds'\n              },\n              word: {\n                type: 'string',\n                title: 'Word',\n                description: 'The text content of the word'\n              }\n            },\n            required: [              'end',\n              'start',\n              'word'\n            ]\n          }\n        }\n      },\n      required: [        'text'\n      ]\n    }\n  }\n}\n```",
  inputSchema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        title: 'File',
      },
      model: {
        type: 'string',
        title: 'Model',
      },
      language: {
        type: 'string',
        title: 'Language',
      },
      prompt: {
        type: 'string',
        title: 'Prompt',
      },
      response_format: {
        type: 'string',
        title: 'Response Format',
      },
      temperature: {
        type: 'number',
        title: 'Temperature',
      },
      jq_filter: {
        type: 'string',
        title: 'jq Filter',
        description:
          'A jq filter to apply to the response to include certain fields. Consult the output schema in the tool description to see the fields that are available.\n\nFor example: to include only the `name` field in every object of a results array, you can provide ".results[].name".\n\nFor more information, see the [jq documentation](https://jqlang.org/manual/).',
      },
    },
    required: ['file', 'model'],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const { jq_filter, ...body } = args as any;
  return asTextContentResult(await maybeFilter(jq_filter, await client.audio.transcriptions.create(body)));
};

export default { metadata, tool, handler };
