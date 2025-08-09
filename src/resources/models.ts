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
   */
  retrieve(modelID: string, options?: RequestOptions): APIPromise<ModelInfo> {
    return this._client.get(path`/v1/models/${modelID}`, options);
  }

  /**
   * List available models.
   *
   * Returns a list of available models from all configured providers. Models are
   * filtered based on provider availability and API key configuration. Only models
   * from providers with valid API keys are returned.
   */
  list(options?: RequestOptions): APIPromise<ModelsResponse> {
    return this._client.get('/v1/models', options);
  }
}

export interface ModelInfo {
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
  permission?: Array<unknown> | null;

  /**
   * Root model
   */
  root?: string | null;
}

export interface ModelsResponse {
  /**
   * List of models
   */
  data: Array<ModelInfo>;

  /**
   * Object type
   */
  object?: string;
}

export declare namespace Models {
  export { type ModelInfo as ModelInfo, type ModelsResponse as ModelsResponse };
}
