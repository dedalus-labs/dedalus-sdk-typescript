// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
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
  retrieve(modelID: string, options?: RequestOptions): APIPromise<Shared.Model> {
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
 * Response for /v1/models endpoint.
 */
export interface ListModelsResponse {
  /**
   * List of available models
   */
  data: Array<Shared.Model>;

  /**
   * Response object type
   */
  object?: 'list';
}

export declare namespace Models {
  export { type ListModelsResponse as ListModelsResponse };
}
