// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from '../chat/completions';
import { APIPromise } from '../../core/api-promise';
import { type Uploadable } from '../../core/uploads';
import { RequestOptions } from '../../internal/request-options';
import { multipartFormRequestOptions } from '../../internal/uploads';

export class Transcriptions extends APIResource {
  /**
   * Transcribe audio into text.
   *
   * Transcribes audio files using OpenAI's Whisper model. Supports multiple audio
   * formats including mp3, mp4, mpeg, mpga, m4a, wav, and webm. Maximum file size is
   * 25 MB.
   *
   * Args: file: Audio file to transcribe (required) model: Model ID to use (e.g.,
   * "openai/whisper-1") language: ISO-639-1 language code (e.g., "en", "es") -
   * improves accuracy prompt: Optional text to guide the model's style
   * response_format: Format of the output (json, text, srt, verbose_json, vtt)
   * temperature: Sampling temperature between 0 and 1
   *
   * Returns: Transcription object with the transcribed text
   */
  create(body: TranscriptionCreateParams, options?: RequestOptions): APIPromise<TranscriptionCreateResponse> {
    return this._client.post(
      '/v1/audio/transcriptions',
      multipartFormRequestOptions({ body, ...options }, this._client),
    );
  }
}

/**
 * Represents a verbose json transcription response returned by model, based on the
 * provided input.
 *
 * Fields:
 *
 * - language (required): str
 * - duration (required): float
 * - text (required): str
 * - words (optional): list[TranscriptionWord]
 * - segments (optional): list[TranscriptionSegment]
 * - usage (optional): TranscriptTextUsageDuration
 */
export type TranscriptionCreateResponse =
  | TranscriptionCreateResponse.CreateTranscriptionResponseVerboseJSON
  | TranscriptionCreateResponse.CreateTranscriptionResponseJSON;

export namespace TranscriptionCreateResponse {
  /**
   * Represents a verbose json transcription response returned by model, based on the
   * provided input.
   *
   * Fields:
   *
   * - language (required): str
   * - duration (required): float
   * - text (required): str
   * - words (optional): list[TranscriptionWord]
   * - segments (optional): list[TranscriptionSegment]
   * - usage (optional): TranscriptTextUsageDuration
   */
  export interface CreateTranscriptionResponseVerboseJSON {
    /**
     * The duration of the input audio.
     */
    duration: number;

    /**
     * The language of the input audio.
     */
    language: string;

    /**
     * The transcribed text.
     */
    text: string;

    /**
     * Segments of the transcribed text and their corresponding details.
     */
    segments?: Array<CreateTranscriptionResponseVerboseJSON.Segment>;

    /**
     * Usage statistics for models billed by audio input duration.
     */
    usage?: CreateTranscriptionResponseVerboseJSON.Usage;

    /**
     * Extracted words and their corresponding timestamps.
     */
    words?: Array<CreateTranscriptionResponseVerboseJSON.Word>;
  }

  export namespace CreateTranscriptionResponseVerboseJSON {
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

    /**
     * Usage statistics for models billed by audio input duration.
     */
    export interface Usage {
      /**
       * Duration of the input audio in seconds.
       */
      seconds: number;

      /**
       * The type of the usage object. Always `duration` for this variant.
       */
      type: 'duration';
    }

    /**
     * Fields:
     *
     * - word (required): str
     * - start (required): float
     * - end (required): float
     */
    export interface Word {
      /**
       * End time of the word in seconds.
       */
      end: number;

      /**
       * Start time of the word in seconds.
       */
      start: number;

      /**
       * The text content of the word.
       */
      word: string;
    }
  }

  /**
   * Represents a transcription response returned by model, based on the provided
   * input.
   *
   * Fields:
   *
   * - text (required): str
   * - logprobs (optional): list[LogprobsItem]
   * - usage (optional): Usage
   */
  export interface CreateTranscriptionResponseJSON {
    /**
     * The transcribed text.
     */
    text: string;

    /**
     * The log probabilities of the tokens in the transcription. Only returned with the
     * models `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` if `logprobs` is added
     * to the `include` array.
     */
    logprobs?: Array<CreateTranscriptionResponseJSON.Logprob>;

    /**
     * Token usage statistics for the request.
     */
    usage?:
      | CreateTranscriptionResponseJSON.TranscriptTextUsageTokens
      | CreateTranscriptionResponseJSON.TranscriptTextUsageDuration;
  }

  export namespace CreateTranscriptionResponseJSON {
    /**
     * Fields:
     *
     * - token (optional): str
     * - logprob (optional): float
     * - bytes (optional): list[float]
     */
    export interface Logprob {
      /**
       * The token in the transcription.
       */
      token?: string;

      /**
       * The bytes of the token.
       */
      bytes?: Array<number>;

      /**
       * The log probability of the token.
       */
      logprob?: number;
    }

    /**
     * Usage statistics for models billed by token usage.
     *
     * Fields:
     *
     * - type (required): Literal['tokens']
     * - input_tokens (required): int
     * - input_token_details (optional): InputTokenDetails
     * - output_tokens (required): int
     * - total_tokens (required): int
     */
    export interface TranscriptTextUsageTokens {
      /**
       * Number of input tokens billed for this request.
       */
      input_tokens: number;

      /**
       * Number of output tokens generated.
       */
      output_tokens: number;

      /**
       * Total number of tokens used (input + output).
       */
      total_tokens: number;

      /**
       * The type of the usage object. Always `tokens` for this variant.
       */
      type: 'tokens';

      /**
       * Details about the input tokens billed for this request.
       */
      input_token_details?: CompletionsAPI.InputTokenDetails;
    }

    /**
     * Usage statistics for models billed by audio input duration.
     *
     * Fields:
     *
     * - type (required): Literal['duration']
     * - seconds (required): float
     */
    export interface TranscriptTextUsageDuration {
      /**
       * Duration of the input audio in seconds.
       */
      seconds: number;

      /**
       * The type of the usage object. Always `duration` for this variant.
       */
      type: 'duration';
    }
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
