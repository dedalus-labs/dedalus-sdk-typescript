// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Speech extends APIResource {
  /**
   * Generate audio from text using text-to-speech.
   *
   * OpenAI only endpoint.
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
   * One of the available [TTS models](https://platform.openai.com/docs/models#tts):
   * `tts-1`, `tts-1-hd` or `gpt-4o-mini-tts`.
   */
  model: string;

  /**
   * The voice to use when generating the audio. Supported voices are `alloy`, `ash`,
   * `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, and
   * `verse`. Previews of the voices are available in the
   * [Text to speech guide](https://platform.openai.com/docs/guides/text-to-speech#voice-options).
   */
  voice:
    | 'alloy'
    | 'ash'
    | 'ballad'
    | 'coral'
    | 'echo'
    | 'fable'
    | 'onyx'
    | 'nova'
    | 'sage'
    | 'shimmer'
    | 'verse';

  /**
   * Control the voice of your generated audio with additional instructions. Does not
   * work with `tts-1` or `tts-1-hd`.
   */
  instructions?: string | null;

  /**
   * The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`,
   * `wav`, and `pcm`.
   */
  response_format?: 'mp3' | 'opus' | 'aac' | 'flac' | 'wav' | 'pcm' | null;

  /**
   * The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is
   * the default.
   */
  speed?: number | null;

  /**
   * The format to stream the audio in. Supported formats are `sse` and `audio`.
   * `sse` is not supported for `tts-1` or `tts-1-hd`.
   */
  stream_format?: 'sse' | 'audio' | null;
}

export declare namespace Speech {
  export { type SpeechCreateParams as SpeechCreateParams };
}
