// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { DedalusModelChoice } from '../../resources/shared';

/** Filters out undefined and null values from request parameters. */
export function buildRequestKwargs(kwargs: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(kwargs)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out;
}

/** Validates model parameter type. */
export function normalizeModelSpec(
  model: DedalusModelChoice | DedalusModelChoice[],
): DedalusModelChoice | DedalusModelChoice[] {
  if (typeof model === 'string') return model;
  if (Array.isArray(model)) {
    if (!model.length) throw new Error('Model list cannot be empty');
    return model;
  }

  // Must be DedalusModel object
  if (model && typeof model === 'object' && 'model' in model) {
    return model;
  }

  throw new TypeError('Model must be a string, DedalusModel object, or array');
}

/** Extracts model identifier from string or object. */
export function modelName(model: any): string {
  if (typeof model === 'string') return model;
  if (model && typeof model === 'object' && 'model' in model) return String(model.model);
  throw new TypeError('Model must be a string or DedalusModel object');
}
