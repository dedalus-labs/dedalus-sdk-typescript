// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

/** Minimal Zod schema interface for detection */
export interface ZodLike {
  _def: unknown;
  parse(value: unknown): unknown;
}

/** Type guard to check if value is a Zod schema */
export function isZodSchema(value: unknown): value is ZodLike {
  return (
    value !== null &&
    typeof value === 'object' &&
    '_def' in value &&
    'parse' in value &&
    typeof (value as any).parse === 'function'
  );
}

/**
 * Convert a Zod schema to JSON Schema.
 * Supports both Zod v3.23+ and Zod v4.
 *
 * @throws Error if Zod is not installed or version doesn't support toJSONSchema
 */
export function zodToJsonSchema(zodSchema: ZodLike): Record<string, unknown> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const z = require('zod');

    let jsonSchema: Record<string, unknown>;

    // Try Zod v4 first (has toJSONSchema static method)
    if (typeof z.toJSONSchema === 'function') {
      jsonSchema = z.toJSONSchema(zodSchema, {
        target: 'draft-7',
        reused: 'ref',
      });
    }
    // Try Zod v3 (has toJSONSchema on instance)
    else if ('toJSONSchema' in zodSchema && typeof (zodSchema as any).toJSONSchema === 'function') {
      jsonSchema = (zodSchema as any).toJSONSchema({
        target: 'draft-7',
        reused: 'ref',
      });
    } else {
      throw new Error(
        'Zod version does not support toJSONSchema(). Please upgrade to Zod >= 3.23 or Zod v4.',
      );
    }

    return jsonSchema;
  } catch (err: any) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error('Zod schema provided but zod is not installed. Install it with: npm install zod');
    }
    throw err;
  }
}
