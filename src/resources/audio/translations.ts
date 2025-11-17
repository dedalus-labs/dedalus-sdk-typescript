// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

export class Translations extends APIResource {
  /**
   * Translate audio into English.
   *
   * Translates audio files in any supported language to English text using OpenAI's
   * Whisper model. Supports the same audio formats as transcription. Maximum file
   * size is 25 MB.
   *
   * Args: file: Audio file to translate (required) model: Model ID to use (e.g.,
   * "openai/whisper-1") prompt: Optional text to guide the model's style
   * response_format: Format of the output (json, text, srt, verbose_json, vtt)
   * temperature: Sampling temperature between 0 and 1
   *
   * Returns: Translation object with the English translation
   */
  create(body: TranslationCreateParams, options?: RequestOptions): APIPromise<TranslationCreateResponse> {
    return this._client.post(
      '/v1/audio/translations',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

/**
 * Fields:
 *
 * - language (required): str
 * - duration (required): float
 * - text (required): str
 * - segments (optional): list[TranscriptionSegment]
 */
export type TranslationCreateResponse =
  | TranslationCreateResponse.CreateTranslationResponseVerboseJSON
  | TranslationCreateResponse.CreateTranslationResponseJSON;

export namespace TranslationCreateResponse {
  /**
   * Fields:
   *
   * - language (required): str
   * - duration (required): float
   * - text (required): str
   * - segments (optional): list[TranscriptionSegment]
   */
  export interface CreateTranslationResponseVerboseJSON {
    /**
     * The duration of the input audio.
     */
    duration: number;

    /**
     * The language of the output translation (always `english`).
     */
    language: string;

    /**
     * The translated text.
     */
    text: string;

    /**
     * Segments of the translated text and their corresponding details.
     */
    segments?: Array<CreateTranslationResponseVerboseJSON.Segment>;
  }

  export namespace CreateTranslationResponseVerboseJSON {
    /**
     * Fields:
     *
     * - id (required): int
     * - seek (required): int
     * - start (required): float
     * - end (required): float
     * - text (required): str
     * - tokens (required): list[int]
     * - temperature (required): float
     * - avg_logprob (required): float
     * - compression_ratio (required): float
     * - no_speech_prob (required): float
     */
    export interface Segment {
      /**
       * Unique identifier of the segment.
       */
      id: number;

      /**
       * Average logprob of the segment. If the value is lower than -1, consider the
       * logprobs failed.
       */
      avg_logprob: number;

      /**
       * Compression ratio of the segment. If the value is greater than 2.4, consider the
       * compression failed.
       */
      compression_ratio: number;

      /**
       * End time of the segment in seconds.
       */
      end: number;

      /**
       * Probability of no speech in the segment. If the value is higher than 1.0 and the
       * `avg_logprob` is below -1, consider this segment silent.
       */
      no_speech_prob: number;

      /**
       * Seek offset of the segment.
       */
      seek: number;

      /**
       * Start time of the segment in seconds.
       */
      start: number;

      /**
       * Temperature parameter used for generating the segment.
       */
      temperature: number;

      /**
       * Text content of the segment.
       */
      text: string;

      /**
       * Array of token IDs for the text content.
       */
      tokens: Array<number>;
    }
  }

  /**
   * Fields:
   *
   * - text (required): str
   */
  export interface CreateTranslationResponseJSON {
    text: string;
  }
}

export interface TranslationCreateParams {
  file: Uploadable;

  model: string;

  prompt?: string | null;

  response_format?: string | null;

  temperature?: number | null;
}

export declare namespace Translations {
  export {
    type TranslationCreateResponse as TranslationCreateResponse,
    type TranslationCreateParams as TranslationCreateParams,
  };
}
