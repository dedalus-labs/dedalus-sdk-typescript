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
  retrieve(modelID: string, options?: RequestOptions): APIPromise<Model> {
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
 * Model information and configuration for Dedalus API.
 *
 * Represents both model metadata (for listings) and configuration options (for
 * chat completions). When used in GET /v1/models, only metadata fields are
 * populated. When used in chat requests, configuration fields control model
 * behavior.
 *
 * Attributes: id: Provider-prefixed model identifier (e.g., 'openai/gpt-4',
 * 'anthropic/claude-3-5-sonnet') name: Alias for id (used in chat requests)
 * object: Always 'model' for OpenAI compatibility created: Unix timestamp when
 * model was created owned_by: Provider organization that owns the model root: Base
 * model identifier if this is a fine-tuned variant parent: Parent model identifier
 * for hierarchical relationships permission: Access permissions (reserved for
 * future use)
 *
 *     Configuration fields (used in chat requests):
 *     temperature: Sampling temperature (0 to 2)
 *     top_p: Nucleus sampling parameter (0 to 1)
 *     frequency_penalty: Frequency penalty (-2 to 2)
 *     presence_penalty: Presence penalty (-2 to 2)
 *     max_tokens: Maximum tokens to generate
 *     attributes: Custom attributes for model routing
 *     metadata: Additional metadata
 *
 * Example: Listing response: { "id": "openai/gpt-4o", "object": "model",
 * "created": 1687882411, "owned_by": "openai" }
 *
 *     Chat request:
 *     {
 *         "name": "openai/gpt-4o",
 *         "temperature": 0.7,
 *         "max_tokens": 1000,
 *         "attributes": {"intelligence": 0.9, "cost": 0.8}
 *     }
 */
export interface Model {
  /**
   * Model identifier
   */
  id?: string | null;

  /**
   * [Dedalus] Custom attributes for intelligent model routing (e.g., intelligence,
   * speed, creativity, cost).
   */
  attributes?: { [key: string]: number } | null;

  /**
   * Creation timestamp
   */
  created?: number | null;

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
   * Model name (alias for id in chat requests)
   */
  name?: string | null;

  /**
   * Object type
   */
  object?: string;

  /**
   * Model owner
   */
  owned_by?: string;

  /**
   * Whether to enable parallel function calling.
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Parent model
   */
  parent?: string | null;

  /**
   * Permissions
   */
  permission?: Array<{ [key: string]: unknown }> | null;

  /**
   * Penalize new tokens based on whether they appear in the text so far.
   */
  presence_penalty?: number | null;

  /**
   * Format for the model output (e.g., {'type': 'json_object'}).
   */
  response_format?: { [key: string]: unknown } | null;

  /**
   * Root model
   */
  root?: string | null;

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
  export { type Model as Model, type ModelsResponse as ModelsResponse };
}
