// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Root extends APIResource {
  /**
   * Root
   */
  get(options?: RequestOptions): APIPromise<RootGetResponse> {
    return this._client.get('/', options);
  }
}

/**
 * Response model for the root endpoint of the Dedalus API.
 */
export interface RootGetResponse {
  message: string;
}

export declare namespace Root {
  export { type RootGetResponse as RootGetResponse };
}
