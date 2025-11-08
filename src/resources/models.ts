// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Models extends APIResource {
  /**
   * Retrieve a model.
   *
   * Retrieve detailed information about a specific model, including its
   * capabilities, provider, and supported features.
   *
   * Args: model_id: The ID of the model to retrieve (e.g., 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022') user: Authenticated user obtained from
   * API key validation
   *
   * Returns: Model: Information about the requested model
   *
   * Raises: HTTPException: - 401 if authentication fails - 404 if model not found or
   * not accessible with current API key - 500 if internal error occurs
   *
   * Requires: Valid API key with 'read' scope permission
   *
   * Example: ```python import dedalus_labs
   *
   *     client = dedalus_labs.Client(api_key="your-api-key")
   *     model = client.models.retrieve("openai/gpt-4")
   *
   *     print(f"Model: {model.id}")
   *     print(f"Owner: {model.owned_by}")
   *     ```
   *
   *     Response:
   *     ```json
   *     {
   *         "id": "openai/gpt-4",
   *         "object": "model",
   *         "created": 1687882411,
   *         "owned_by": "openai"
   *     }
   *     ```
   */
  retrieve(modelID: string, options?: RequestOptions): APIPromise<Model> {
    return this._client.get(path`/v1/models/${modelID}`, options);
  }

  /**
   * List available models.
   *
   * Retrieve the complete list of models available to your organization, including
   * models from OpenAI, Anthropic, Google, xAI, Mistral, Fireworks, and DeepSeek.
   *
   * Returns: ListModelsResponse: List of available models across all supported
   * providers
   */
  list(options?: RequestOptions): APIPromise<ListModelsResponse> {
    return this._client.get('/v1/models', options);
  }
}

/**
 * Response for /v1/models endpoint.
 */
export interface ListModelsResponse {
  /**
   * List of available models
   */
  data: Array<Model>;

  /**
   * Response object type
   */
  object?: 'list';
}

/**
 * Unified model metadata across all providers.
 *
 * Combines provider-specific schemas into a single, consistent format. Fields that
 * aren't available from a provider are set to None.
 */
export interface Model {
  /**
   * Unique model identifier with provider prefix (e.g., 'openai/gpt-4')
   */
  id: string;

  /**
   * When the model was released (RFC 3339)
   */
  created_at: string;

  /**
   * Provider that hosts this model
   */
  provider: 'openai' | 'anthropic' | 'google' | 'xai' | 'mistral' | 'groq' | 'fireworks' | 'deepseek';

  /**
   * Normalized model capabilities across all providers.
   */
  capabilities?: Model.Capabilities | null;

  /**
   * Provider-declared default parameters for model generation.
   */
  defaults?: Model.Defaults | null;

  /**
   * Model description
   */
  description?: string | null;

  /**
   * Human-readable model name
   */
  display_name?: string | null;

  /**
   * Provider-specific generation method names (None = not declared)
   */
  provider_declared_generation_methods?: Array<string> | null;

  /**
   * Raw provider-specific metadata
   */
  provider_info?: { [key: string]: unknown } | null;

  /**
   * Model version identifier
   */
  version?: string | null;
}

export namespace Model {
  /**
   * Normalized model capabilities across all providers.
   */
  export interface Capabilities {
    /**
     * Supports audio processing
     */
    audio?: boolean | null;

    /**
     * Supports image generation
     */
    image_generation?: boolean | null;

    /**
     * Maximum input tokens
     */
    input_token_limit?: number | null;

    /**
     * Maximum output tokens
     */
    output_token_limit?: number | null;

    /**
     * Supports streaming responses
     */
    streaming?: boolean | null;

    /**
     * Supports structured JSON output
     */
    structured_output?: boolean | null;

    /**
     * Supports text generation
     */
    text?: boolean | null;

    /**
     * Supports extended thinking/reasoning
     */
    thinking?: boolean | null;

    /**
     * Supports function/tool calling
     */
    tools?: boolean | null;

    /**
     * Supports image understanding
     */
    vision?: boolean | null;
  }

  /**
   * Provider-declared default parameters for model generation.
   */
  export interface Defaults {
    /**
     * Default maximum output tokens
     */
    max_output_tokens?: number | null;

    /**
     * Default temperature setting
     */
    temperature?: number | null;

    /**
     * Default top_k setting
     */
    top_k?: number | null;

    /**
     * Default top_p setting
     */
    top_p?: number | null;
  }
}

export declare namespace Models {
  export { type ListModelsResponse as ListModelsResponse, type Model as Model };
}
