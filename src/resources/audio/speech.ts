// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Speech extends APIResource {
  /**
   * Generate speech audio from text.
   *
   * Generates audio from the input text using text-to-speech models. Supports
   * multiple voices and output formats including mp3, opus, aac, flac, wav, and pcm.
   *
   * Returns streaming audio data that can be saved to a file or streamed directly to
   * users.
   */
  create(body: SpeechCreateParams, options?: RequestOptions): APIPromise<Response> {
    return this._client.post('/v1/audio/speech', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: 'audio/mpeg' }, options?.headers]),
      __binaryResponse: true,
    });
  }
}

export interface SpeechCreateParams {
  /**
   * The text to generate audio for. The maximum length is 4096 characters.
   */
  input: string;

  /**
   * One of the available [TTS models](/docs/models#tts): `tts-1`, `tts-1-hd`,
   * `gpt-4o-mini-tts`, or `gpt-4o-mini-tts-2025-12-15`.
   */
  model: (string & {}) | 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts' | 'gpt-4o-mini-tts-2025-12-15';

  /**
   * The voice to use when generating the audio. Supported built-in voices are
   * `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`,
   * `shimmer`, `verse`, `marin`, and `cedar`. You may also provide a custom voice
   * object with an `id`, for example `{ "id": "voice_1234" }`. Previews of the
   * voices are available in the
   * [Text to speech guide](/docs/guides/text-to-speech#voice-options).
   */
  voice:
    | string
    | 'alloy'
    | 'ash'
    | 'ballad'
    | 'coral'
    | 'echo'
    | 'sage'
    | 'shimmer'
    | 'verse'
    | 'marin'
    | 'cedar'
    | Shared.VoiceIDsOrCustomVoice;

  /**
   * Control the voice of your generated audio with additional instructions. Does not
   * work with `tts-1` or `tts-1-hd`.
   */
  instructions?: string;

  /**
   * The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`,
   * `wav`, and `pcm`.
   */
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm';

  /**
   * The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is
   * the default.
   */
  speed?: number;

  /**
   * The format to stream the audio in. Supported formats are `sse` and `audio`.
   * `sse` is not supported for `tts-1` or `tts-1-hd`.
   */
  stream_format?: 'sse' | 'audio';
}

export declare namespace Speech {
  export { type SpeechCreateParams as SpeechCreateParams };
}
