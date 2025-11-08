// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

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
    'Transcribe audio into text.\n\nTranscribes audio files using OpenAI\'s Whisper model. Supports multiple audio formats\nincluding mp3, mp4, mpeg, mpga, m4a, wav, and webm. Maximum file size is 25 MB.\n\nArgs:\n    file: Audio file to transcribe (required)\n    model: Model ID to use (e.g., "openai/whisper-1")\n    language: ISO-639-1 language code (e.g., "en", "es") - improves accuracy\n    prompt: Optional text to guide the model\'s style\n    response_format: Format of the output (json, text, srt, verbose_json, vtt)\n    temperature: Sampling temperature between 0 and 1\n\nReturns:\n    Transcription object with the transcribed text',
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
    },
    required: ['file', 'model'],
  },
  annotations: {},
};

export const handler = async (client: Dedalus, args: Record<string, unknown> | undefined) => {
  const body = args as any;
  return asTextContentResult(await client.audio.transcriptions.create(body));
};

export default { metadata, tool, handler };
