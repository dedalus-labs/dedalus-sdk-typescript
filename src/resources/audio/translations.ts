// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

export class Translations extends APIResource {
  /**
   * Translate audio to English text.
   *
   * OpenAI only endpoint.
   */
  create(body: TranslationCreateParams, options?: RequestOptions): APIPromise<TranslationCreateResponse> {
    return this._client.post(
      '/v1/audio/translations',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

/**
 * Response from translation endpoint.
 *
 * For response_format='json' or 'text', only 'text' is returned. For
 * response_format='verbose_json', additional fields are included.
 */
export interface TranslationCreateResponse {
  /**
   * The translated text (in English)
   */
  text: string;

  /**
   * The duration of the input audio in seconds
   */
  duration?: number | null;

  /**
   * The language of the output translation (always 'english')
   */
  language?: string | null;

  /**
   * Segments of the translated text and their corresponding details
   */
  segments?: Array<TranslationCreateResponse.Segment> | null;
}

export namespace TranslationCreateResponse {
  /**
   * Segment-level details for transcription.
   */
  export interface Segment {
    /**
     * Unique identifier of the segment
     */
    id: number;

    /**
     * Average log probability of the segment
     */
    avg_logprob: number;

    /**
     * Compression ratio of the segment. If greater than 2.4, consider the compression
     * failed
     */
    compression_ratio: number;

    /**
     * End time of the segment in seconds
     */
    end: number;

    /**
     * Probability of no speech in the segment. If higher than 1.0 and avg_logprob is
     * below -1, consider this segment silent
     */
    no_speech_prob: number;

    /**
     * Seek offset of the segment
     */
    seek: number;

    /**
     * Start time of the segment in seconds
     */
    start: number;

    /**
     * Temperature parameter used for generating this segment
     */
    temperature: number;

    /**
     * Text content of the segment
     */
    text: string;

    /**
     * Array of token IDs for the segment
     */
    tokens: Array<number>;
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
