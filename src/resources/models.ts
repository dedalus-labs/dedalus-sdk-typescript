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
   * Args: model_id: The ID of the model to retrieve (e.g., 'gpt-4',
   * 'claude-3-5-sonnet-20241022') user: Authenticated user obtained from API key
   * validation
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
   *     model = client.models.retrieve("gpt-4")
   *
   *     print(f"Model: {model.id}")
   *     print(f"Owner: {model.owned_by}")
   *     ```
   *
   *     Response:
   *     ```json
   *     {
   *         "id": "gpt-4",
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
   *                 "id": "gpt-4",
   *                 "object": "model",
   *                 "owned_by": "openai"
   *             },
   *             {
   *                 "id": "claude-3-5-sonnet-20241022",
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
 * Model information compatible with OpenAI API.
 *
 * Represents a language model available through the Dedalus API. Models are
 * aggregated from multiple providers (OpenAI, Anthropic, etc.) and made available
 * through a unified interface.
 *
 * Attributes: id: Unique model identifier (e.g., 'gpt-4',
 * 'claude-3-5-sonnet-20241022') object: Always 'model' for compatibility with
 * OpenAI API created: Unix timestamp when model was created (may be None)
 * owned_by: Provider organization that owns the model root: Base model identifier
 * if this is a fine-tuned variant parent: Parent model identifier for hierarchical
 * relationships permission: Access permissions (reserved for future use)
 *
 * Example: { "id": "gpt-4", "object": "model", "created": 1687882411, "owned_by":
 * "openai" }
 */
export interface Model {
  /**
   * Model identifier
   */
  id: string;

  /**
   * Creation timestamp
   */
  created?: number | null;

  /**
   * Object type
   */
  object?: string;

  /**
   * Model owner
   */
  owned_by?: string;

  /**
   * Parent model
   */
  parent?: string | null;

  /**
   * Permissions
   */
  permission?: Array<{ [key: string]: unknown }> | null;

  /**
   * Root model
   */
  root?: string | null;
}

/**
 * Response containing list of available models.
 *
 * Returns all models available to the authenticated user based on their API key
 * permissions and configured providers.
 *
 * Attributes: object: Always 'list' for compatibility with OpenAI API data: List
 * of Model objects representing available models
 *
 * Example: { "object": "list", "data": [ { "id": "gpt-4", "object": "model",
 * "owned_by": "openai" }, { "id": "claude-3-5-sonnet-20241022", "object": "model",
 * "owned_by": "anthropic" } ] }
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
