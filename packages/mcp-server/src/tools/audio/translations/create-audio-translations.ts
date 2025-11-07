// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { maybeFilter } from 'dedalus-labs-mcp/filtering';
import { Metadata, asTextContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'audio.translations',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/audio/translations',
  operationId: 'create_translation_v1_audio_translations_post',
};

export const tool: Tool = {
  name: 'create_audio_translations',
  description:
    "When using this tool, always use the `jq_filter` parameter to reduce the response size and improve performance.\n\nOnly omit if you're sure you don't need the data.\n\nTranslate audio into English.\n\nTranslates audio files in any supported language to English text using OpenAI's\nWhisper model. Supports the same audio formats as transcription. Maximum file size\nis 25 MB.\n\nArgs:\n    file: Audio file to translate (required)\n    model: Model ID to use (e.g., \"openai/whisper-1\")\n    prompt: Optional text to guide the model's style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Translation object with the English translation\n\n# Response Schema\n```json\n{\n  $ref: '#/$defs/translation_create_response',\n  $defs: {\n    translation_create_response: {\n      anyOf: [        {\n          type: 'object',\n          title: 'CreateTranslationResponseVerboseJson',\n          description: 'Fields:\\n- language (required): str\\n- duration (required): float\\n- text (required): str\\n- segments (optional): list[TranscriptionSegment]',\n          properties: {\n            duration: {\n              type: 'number',\n              title: 'Duration',\n              description: 'The duration of the input audio.'\n            },\n            language: {\n              type: 'string',\n              title: 'Language',\n              description: 'The language of the output translation (always `english`).'\n            },\n            text: {\n              type: 'string',\n              title: 'Text',\n              description: 'The translated text.'\n            },\n            segments: {\n              type: 'array',\n              title: 'Segments',\n              description: 'Segments of the translated text and their corresponding details.',\n              items: {\n                type: 'object',\n                title: 'TranscriptionSegment',\n                description: 'Fields:\\n- id (required): int\\n- seek (required): int\\n- start (required): float\\n- end (required): float\\n- text (required): str\\n- tokens (required): list[int]\\n- temperature (required): float\\n- avg_logprob (required): float\\n- compression_ratio (required): float\\n- no_speech_prob (required): float',\n                properties: {\n                  id: {\n                    type: 'integer',\n                    title: 'Id',\n                    description: 'Unique identifier of the segment.'\n                  },\n                  avg_logprob: {\n                    type: 'number',\n                    title: 'Avg Logprob',\n                    description: 'Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.'\n                  },\n                  compression_ratio: {\n                    type: 'number',\n                    title: 'Compression Ratio',\n                    description: 'Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.'\n                  },\n                  end: {\n                    type: 'number',\n                    title: 'End',\n                    description: 'End time of the segment in seconds.'\n                  },\n                  no_speech_prob: {\n                    type: 'number',\n                    title: 'No Speech Prob',\n                    description: 'Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.'\n                  },\n                  seek: {\n                    type: 'integer',\n                    title: 'Seek',\n                    description: 'Seek offset of the segment.'\n                  },\n                  start: {\n                    type: 'number',\n                    title: 'Start',\n                    description: 'Start time of the segment in seconds.'\n                  },\n                  temperature: {\n                    type: 'number',\n                    title: 'Temperature',\n                    description: 'Temperature parameter used for generating the segment.'\n                  },\n                  text: {\n                    type: 'string',\n                    title: 'Text',\n                    description: 'Text content of the segment.'\n                  },\n                  tokens: {\n                    type: 'array',\n                    title: 'Tokens',\n                    description: 'Array of token IDs for the text content.',\n                    items: {\n                      type: 'integer'\n                    }\n                  }\n                },\n                required: [                  'id',\n                  'avg_logprob',\n                  'compression_ratio',\n                  'end',\n                  'no_speech_prob',\n                  'seek',\n                  'start',\n                  'temperature',\n                  'text',\n                  'tokens'\n                ]\n              }\n            }\n          },\n          required: [            'duration',\n            'language',\n            'text'\n          ]\n        },\n        {\n          type: 'object',\n          title: 'CreateTranslationResponseJson',\n          description: 'Fields:\\n- text (required): str',\n          properties: {\n            text: {\n              type: 'string',\n              title: 'Text'\n            }\n          },\n          required: [            'text'\n          ]\n        }\n      ],\n      title: 'Response Create Translation V1 Audio Translations Post',\n      description: 'Fields:\\n- language (required): str\\n- duration (required): float\\n- text (required): str\\n- segments (optional): list[TranscriptionSegment]'\n    }\n  }\n}\n```",
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
  return asTextContentResult(await maybeFilter(jq_filter, await client.audio.translations.create(body)));
};

export default { metadata, tool, handler };
