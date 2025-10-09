// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Models extends APIResource {
  /**
   * Get information about a specific model.
   *
   * Returns detailed information about a specific model by ID. The model must be
   * available to your API key's configured providers.
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
   * List available models from OpenAI, Anthropic, and Google.
   *
   * Calls provider APIs to get live model lists, then combines into unified
   * response. Only returns models from providers with configured API keys.
   *
   * Returns: ModelsResponse: Combined list of models from all providers
   */
  list(options?: RequestOptions): APIPromise<ListModelsResponse> {
    return this._client.get('/v1/models', options);
  }
}

/**
 * Structured model selection entry used in request payloads.
 *
 * Supports OpenAI-style semantics (string model id) while enabling optional
 * per-model default settings for Dedalus multi-model routing.
 */
export interface DedalusModel {
  /**
   * Model identifier with provider prefix (e.g., 'openai/gpt-5',
   * 'anthropic/claude-3-5-sonnet').
   */
  model: string;

  /**
   * Optional default generation settings (e.g., temperature, max_tokens) applied
   * when this model is selected.
   */
  settings?: DedalusModel.Settings | null;
}

export namespace DedalusModel {
  /**
   * Optional default generation settings (e.g., temperature, max_tokens) applied
   * when this model is selected.
   */
  export interface Settings {
    attributes?: { [key: string]: unknown };

    audio?: { [key: string]: unknown } | null;

    extra_args?: { [key: string]: unknown } | null;

    extra_body?: { [key: string]: unknown } | null;

    extra_headers?: { [key: string]: string } | null;

    extra_query?: { [key: string]: unknown } | null;

    frequency_penalty?: number | null;

    generation_config?: { [key: string]: unknown } | null;

    include_usage?: boolean | null;

    input_audio_format?: string | null;

    input_audio_transcription?: { [key: string]: unknown } | null;

    logit_bias?: { [key: string]: number } | null;

    logprobs?: boolean | null;

    max_completion_tokens?: number | null;

    max_tokens?: number | null;

    metadata?: { [key: string]: string } | null;

    modalities?: Array<string> | null;

    n?: number | null;

    output_audio_format?: string | null;

    parallel_tool_calls?: boolean | null;

    prediction?: { [key: string]: unknown } | null;

    presence_penalty?: number | null;

    reasoning?: Settings.Reasoning | null;

    reasoning_effort?: string | null;

    response_format?: { [key: string]: unknown } | null;

    response_include?: Array<
      | 'code_interpreter_call.outputs'
      | 'computer_call_output.output.image_url'
      | 'file_search_call.results'
      | 'message.input_image.image_url'
      | 'message.output_text.logprobs'
      | 'reasoning.encrypted_content'
    > | null;

    safety_settings?: Array<{ [key: string]: unknown }> | null;

    seed?: number | null;

    service_tier?: string | null;

    stop?: string | Array<string> | null;

    store?: boolean | null;

    stream?: boolean | null;

    stream_options?: { [key: string]: unknown } | null;

    system_instruction?: { [key: string]: unknown } | null;

    temperature?: number | null;

    thinking?: { [key: string]: unknown } | null;

    tool_choice?: 'auto' | 'required' | 'none' | string | Settings.MCPToolChoice | null;

    top_k?: number | null;

    top_logprobs?: number | null;

    top_p?: number | null;

    truncation?: 'auto' | 'disabled' | null;

    turn_detection?: { [key: string]: unknown } | null;

    use_responses?: boolean;

    user?: string | null;

    voice?: string | null;
  }

  export namespace Settings {
    export interface Reasoning {
      effort?: 'minimal' | 'low' | 'medium' | 'high' | null;

      generate_summary?: 'auto' | 'concise' | 'detailed' | null;

      summary?: 'auto' | 'concise' | 'detailed' | null;

      [k: string]: unknown;
    }

    export interface MCPToolChoice {
      name: string;

      server_label: string;
    }
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
  provider: 'openai' | 'anthropic' | 'google' | 'xai' | 'mistral' | 'groq';

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
  export {
    type DedalusModel as DedalusModel,
    type ListModelsResponse as ListModelsResponse,
    type Model as Model,
  };
}
