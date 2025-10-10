// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

export class Transcriptions extends APIResource {
  /**
   * Transcribe audio to text.
   *
   * OpenAI Whisper models only.
   */
  create(body: TranscriptionCreateParams, options?: RequestOptions): APIPromise<TranscriptionCreateResponse> {
    return this._client.post(
      '/v1/audio/transcriptions',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

/**
 * Response from transcription endpoint.
 *
 * For response_format='json' or 'text', only 'text' is returned. For
 * response_format='verbose_json', additional fields are included.
 */
export interface TranscriptionCreateResponse {
  /**
   * The transcribed text
   */
  text: string;

  /**
   * The duration of the input audio in seconds
   */
  duration?: number | null;

  /**
   * The language of the input audio
   */
  language?: string | null;

  /**
   * Segments of the transcribed text and their corresponding details
   */
  segments?: Array<TranscriptionCreateResponse.Segment> | null;

  /**
   * Extracted words and their corresponding timestamps (requires
   * timestamp_granularities=['word'])
   */
  words?: Array<TranscriptionCreateResponse.Word> | null;
}

export namespace TranscriptionCreateResponse {
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

  /**
   * Word-level timestamp for transcription.
   */
  export interface Word {
    /**
     * End time of the word in seconds
     */
    end: number;

    /**
     * Start time of the word in seconds
     */
    start: number;

    /**
     * The text content of the word
     */
    word: string;
  }
}

export interface TranscriptionCreateParams {
  file: Uploadable;

  model: string;

  language?: string | null;

  prompt?: string | null;

  response_format?: string | null;

  temperature?: number | null;
}

export declare namespace Transcriptions {
  export {
    type TranscriptionCreateResponse as TranscriptionCreateResponse,
    type TranscriptionCreateParams as TranscriptionCreateParams,
  };
}
