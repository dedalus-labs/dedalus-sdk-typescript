// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Metadata, asBinaryContentResult } from 'dedalus-labs-mcp/tools/types';

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import Dedalus from 'dedalus-labs';

export const metadata: Metadata = {
  resource: 'audio.speech',
  operation: 'write',
  tags: [],
  httpMethod: 'post',
  httpPath: '/v1/audio/speech',
  operationId: 'create_speech_v1_audio_speech_post',
};

export const tool: Tool = {
  name: 'create_audio_speech',
  description:
    'Generate audio from text using text-to-speech.\n\nOpenAI models only. Gemini TTS uses different architecture (audio modalities in chat).',
  inputSchema: {
    type: 'object',
    properties: {
      input: {
        type: 'string',
        title: 'Input',
        description: 'The text to generate audio for. The maximum length is 4096 characters.',
      },
      model: {
        type: 'string',
        title: 'Model',
        description:
          'One of the available [TTS models](https://platform.openai.com/docs/models#tts): `tts-1`, `tts-1-hd` or `gpt-4o-mini-tts`.',
      },
      voice: {
        type: 'string',
        title: 'Voice',
        description:
          'The voice to use when generating the audio. Supported voices are `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, and `verse`. Previews of the voices are available in the [Text to speech guide](https://platform.openai.com/docs/guides/text-to-speech#voice-options).',
        enum: [
          'alloy',
          'ash',
          'ballad',
          'coral',
          'echo',
          'fable',
          'onyx',
          'nova',
          'sage',
          'shimmer',
          'verse',
        ],
      },
      instructions: {
        type: 'string',
        title: 'Instructions',
        description:
          'Control the voice of your generated audio with additional instructions. Does not work with `tts-1` or `tts-1-hd`.',
      },
      response_format: {
        type: 'string',
        title: 'Response Format',
        description:
          'The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`.',
        enum: ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'],
      },
      speed: {
        type: 'number',
        title: 'Speed',
        description:
          'The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is the default.',
      },
      stream_format: {
        type: 'string',
        title: 'Stream Format',
        description:
          'The format to stream the audio in. Supported formats are `sse` and `audio`. `sse` is not supported for `tts-1` or `tts-1-hd`.',
        enum: ['sse', 'audio'],
      },
    },
    required: ['input', 'model', 'voice'],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asBinaryContentResult(await client.audio.speech.create(body));
};

export default { metadata, tool, handler };
