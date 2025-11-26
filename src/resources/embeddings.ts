// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Embeddings extends APIResource {
  /**
   * Create embeddings using the configured provider.
   */
  create(body: EmbeddingCreateParams, options?: RequestOptions): APIPromise<CreateEmbeddingResponse> {
    return this._client.post('/v1/embeddings', { body, ...options });
  }
}

/**
 * Schema for CreateEmbeddingRequest.
 *
 * Fields:
 *
 * - input (required): str | Annotated[list[str], MinLen(1), MaxLen(2048)] |
 *   Annotated[list[int], MinLen(1), MaxLen(2048)] |
 *   Annotated[list[Annotated[list[int], MinLen(1)]], MinLen(1), MaxLen(2048)]
 * - model (required): str | Literal["text-embedding-ada-002",
 *   "text-embedding-3-small", "text-embedding-3-large"]
 * - encoding_format (optional): Literal["float", "base64"]
 * - dimensions (optional): int
 * - user (optional): str
 */
export interface CreateEmbeddingRequest {
  /**
   * Input text to embed, encoded as a string or array of tokens. To embed multiple
   * inputs in a single request, pass an array of strings or array of token arrays.
   * The input must not exceed the max input tokens for the model (8192 tokens for
   * all embedding models), cannot be an empty string, and any array must be 2048
   * dimensions or less.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
   * for counting tokens. In addition to the per-input token limit, all embedding
   * models enforce a maximum of 300,000 tokens summed across all inputs in a single
   * request.
   */
  input: string | Array<string> | Array<number> | Array<Array<number>>;

  /**
   * ID of the model to use. You can use the
   * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
   * see all of your available models, or see our
   * [Model overview](https://platform.openai.com/docs/models) for descriptions of
   * them.
   */
  model: (string & {}) | 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large';

  /**
   * The number of dimensions the resulting output embeddings should have. Only
   * supported in `text-embedding-3` and later models.
   */
  dimensions?: number;

  /**
   * The format to return the embeddings in. Can be either `float` or
   * [`base64`](https://pypi.org/project/pybase64/).
   */
  encoding_format?: 'float' | 'base64';

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

/**
 * Response from embeddings endpoint.
 */
export interface CreateEmbeddingResponse {
  /**
   * List of embedding objects
   */
  data: Array<CreateEmbeddingResponse.Data>;

  /**
   * The model used for embeddings
   */
  model: string;

  /**
   * Usage statistics (prompt_tokens, total_tokens)
   */
  usage: { [key: string]: number };

  /**
   * Object type, always 'list'
   */
  object?: 'list';
}

export namespace CreateEmbeddingResponse {
  /**
   * Single embedding object.
   */
  export interface Data {
    /**
     * The embedding vector (float array or base64 string)
     */
    embedding: Array<number> | string;

    /**
     * Index of the embedding in the list
     */
    index: number;

    /**
     * Object type, always 'embedding'
     */
    object?: 'embedding';
  }
}

export interface EmbeddingCreateParams {
  /**
   * Input text to embed, encoded as a string or array of tokens. To embed multiple
   * inputs in a single request, pass an array of strings or array of token arrays.
   * The input must not exceed the max input tokens for the model (8192 tokens for
   * all embedding models), cannot be an empty string, and any array must be 2048
   * dimensions or less.
   * [Example Python code](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken)
   * for counting tokens. In addition to the per-input token limit, all embedding
   * models enforce a maximum of 300,000 tokens summed across all inputs in a single
   * request.
   */
  input: string | Array<string> | Array<number> | Array<Array<number>>;

  /**
   * ID of the model to use. You can use the
   * [List models](https://platform.openai.com/docs/api-reference/models/list) API to
   * see all of your available models, or see our
   * [Model overview](https://platform.openai.com/docs/models) for descriptions of
   * them.
   */
  model: (string & {}) | 'text-embedding-ada-002' | 'text-embedding-3-small' | 'text-embedding-3-large';

  /**
   * The number of dimensions the resulting output embeddings should have. Only
   * supported in `text-embedding-3` and later models.
   */
  dimensions?: number;

  /**
   * The format to return the embeddings in. Can be either `float` or
   * [`base64`](https://pypi.org/project/pybase64/).
   */
  encoding_format?: 'float' | 'base64';

  /**
   * A unique identifier representing your end-user, which can help OpenAI to monitor
   * and detect abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#end-user-ids).
   */
  user?: string;
}

export declare namespace Embeddings {
  export {
    type CreateEmbeddingRequest as CreateEmbeddingRequest,
    type CreateEmbeddingResponse as CreateEmbeddingResponse,
    type EmbeddingCreateParams as EmbeddingCreateParams,
  };
}
