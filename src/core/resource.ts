// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { DedalusSDK } from '../client';

export abstract class APIResource {
  protected _client: DedalusSDK;

  constructor(client: DedalusSDK) {
    this._client = client;
  }
}
