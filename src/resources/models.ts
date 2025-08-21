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
   * Returns: DedalusModel: Information about the requested model
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
  retrieve(modelID: string, options?: RequestOptions): APIPromise<DedalusModel> {
    return this._client.get(path`/v1/models/${modelID}`, options);
  }

  /**
   * List available models.
   *
   * Returns a list of available models from all configured providers. Models are
   * filtered based on provider availability and API key configuration. Only models
   * from providers with valid API keys are returned.
   *
   * Args: user: Authenticated user obtained from API key validation
   *
   * Returns: ModelsResponse: Object containing list of available models
   *
   * Raises: HTTPException: - 401 if authentication fails - 500 if internal error
   * occurs during model listing
   *
   * Requires: Valid API key with 'read' scope permission
   *
   * Example: ```python import dedalus_labs
   *
   *     client = dedalus_labs.Client(api_key="your-api-key")
   *     models = client.models.list()
   *
   *     for model in models.data:
   *         print(f"Model: {model.id} (Owner: {model.owned_by})")
   *     ```
   *
   *     Response:
   *     ```json
   *     {
   *         "object": "list",
   *         "data": [
   *             {
   *                 "id": "openai/gpt-4",
   *                 "object": "model",
   *                 "owned_by": "openai"
   *             },
   *             {
   *                 "id": "anthropic/claude-3-5-sonnet-20241022",
   *                 "object": "model",
   *                 "owned_by": "anthropic"
   *             }
   *         ]
   *     }
   *     ```
   */
  list(options?: RequestOptions): APIPromise<ModelsResponse> {
    return this._client.get('/v1/models', options);
  }
}

/**
 * Extended model with configuration capabilities.
 *
 * Inherits basic metadata from Model and adds configuration fields that can be
 * used when creating chat completions. This allows bundling model selection with
 * model-specific parameters.
 *
 * Use this when you want to:
 *
 * - Pre-configure model parameters
 * - Pass model-specific settings
 * - Use intelligent routing with attributes
 *
 * Example: model = DedalusModel( id="gpt-4", temperature=0.7, max_tokens=1000,
 * attributes={"intelligence": 0.9, "cost": 0.8} )
 *
 *     completion = client.chat.completions.create(
 *         model=model,  # Pass the configured model
 *         messages=[...]
 *     )
 */
export interface DedalusModel {
  /**
   * Model identifier
   */
  id: string;

  /**
   * [Dedalus] Custom attributes for intelligent model routing (e.g., intelligence,
   * speed, creativity, cost).
   */
  attributes?: { [key: string]: number } | null;

  /**
   * Unix timestamp of model creation
   */
  created?: number;

  /**
   * Penalize new tokens based on their frequency in the text so far.
   */
  frequency_penalty?: number | null;

  /**
   * Modify the likelihood of specified tokens appearing.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens.
   */
  logprobs?: boolean | null;

  /**
   * An upper bound for the number of tokens that can be generated for a completion.
   */
  max_completion_tokens?: number | null;

  /**
   * Maximum number of tokens to generate.
   */
  max_tokens?: number | null;

  /**
   * [Dedalus] Additional metadata for request tracking and debugging.
   */
  metadata?: { [key: string]: string } | null;

  /**
   * Number of completions to generate for each prompt.
   */
  n?: number | null;

  /**
   * Model name (alias for id)
   */
  name?: string | null;

  /**
   * Object type, always 'model'
   */
  object?: string;

  /**
   * Organization that owns this model
   */
  owned_by?: string;

  /**
   * Whether to enable parallel function calling.
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Penalize new tokens based on whether they appear in the text so far.
   */
  presence_penalty?: number | null;

  /**
   * Format for the model output (e.g., {'type': 'json_object'}).
   */
  response_format?: { [key: string]: unknown } | null;

  /**
   * Seed for deterministic sampling.
   */
  seed?: number | null;

  /**
   * Latency tier for the request (e.g., 'auto', 'default').
   */
  service_tier?: string | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: string | Array<string> | null;

  /**
   * Whether to stream back partial progress.
   */
  stream?: boolean | null;

  /**
   * Options for streaming responses.
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * Sampling temperature (0 to 2). Higher values make output more random.
   */
  temperature?: number | null;

  /**
   * Controls which tool is called by the model.
   */
  tool_choice?: string | { [key: string]: unknown } | null;

  /**
   * List of tools the model may call.
   */
  tools?: Array<{ [key: string]: unknown }> | null;

  /**
   * Number of most likely tokens to return at each token position.
   */
  top_logprobs?: number | null;

  /**
   * Nucleus sampling parameter. Alternative to temperature.
   */
  top_p?: number | null;

  /**
   * A unique identifier representing your end-user.
   */
  user?: string | null;
}

/**
 * Model metadata following OpenAI's exact structure.
 *
 * This is a read-only representation of available models returned by GET
 * /v1/models. Contains only essential metadata, no configuration fields.
 *
 * Attributes: id: Model identifier (e.g., 'gpt-4', 'claude-3-5-sonnet') created:
 * Unix timestamp when model was created object: Always 'model' for OpenAI
 * compatibility owned_by: Organization that owns the model
 *
 * Example: { "id": "gpt-4", "created": 1687882411, "object": "model", "owned_by":
 * "openai" }
 */
export interface Model {
  /**
   * Model identifier
   */
  id: string;

  /**
   * Unix timestamp of model creation
   */
  created?: number;

  /**
   * Object type, always 'model'
   */
  object?: string;

  /**
   * Organization that owns this model
   */
  owned_by?: string;
}

/**
 * Response containing list of available models.
 *
 * Returns all models available to the authenticated user based on their API key
 * permissions and configured providers.
 *
 * Attributes: object: Always 'list' for compatibility with OpenAI API data: list
 * of Model objects representing available models
 *
 * Example: { "object": "list", "data": [ { "id": "openai/gpt-4", "object":
 * "model", "owned_by": "openai" }, { "id": "anthropic/claude-3-5-sonnet-20241022",
 * "object": "model", "owned_by": "anthropic" } ] }
 */
export interface ModelsResponse {
  /**
   * List of models
   */
  data: Array<Model>;

  /**
   * Object type
   */
  object?: string;
}

export declare namespace Models {
  export { type DedalusModel as DedalusModel, type Model as Model, type ModelsResponse as ModelsResponse };
}
