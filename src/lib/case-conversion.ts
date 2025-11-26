/**
 * A best attempt at case conversion for API request parameters.
 *
 * Transforms camelCase (TypeScript convention) to snake_case (API convention)
 * while preserving JSON schemas that must remain unchanged.
 */

/**
 * Preserved schema during case conversion.
 */
interface PreservedSchema {
  readonly path: readonly string[];
  readonly schema: unknown;
}

/**
 * Type guard for plain objects (excludes arrays, null, Date, Map, etc.).
 */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return (
    v !== null &&
    typeof v === 'object' &&
    !Array.isArray(v) &&
    Object.prototype.toString.call(v) === '[object Object]'
  );
}

/**
 * Convert camelCase string to snake_case.
 */
const toSnake = (s: string): string =>
  s
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_+/, '');

/**
 * Recursively transform object keys using the provided function.
 * Skips prototype pollution keys before and after transformation.
 */
const transformKeysDeep = (val: unknown, xf: (k: string) => string): unknown => {
  if (Array.isArray(val)) {
    return val.map((v) => transformKeysDeep(v, xf));
  }
  if (isPlainObject(val)) {
    const out: Record<string, unknown> = Object.create(null);
    for (const [k, v] of Object.entries(val)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      const nk = xf(k);
      if (nk === '__proto__' || nk === 'constructor' || nk === 'prototype') continue;
      out[nk] = transformKeysDeep(v, xf);
    }
    return out;
  }
  return val;
};

/**
 * Transform object keys from camelCase to snake_case recursively.
 */
const toSnakeCaseDeep = <T>(v: T): T => transformKeysDeep(v, toSnake) as T;

/**
 * Extract JSON schemas from response_format that must be preserved.
 *
 * Schemas contain properties like 'additionalProperties' that would break
 * if converted to 'additional_properties'.
 */
function extractPreservedSchemas(body: Record<string, unknown>): readonly PreservedSchema[] {
  const schemas: PreservedSchema[] = [];

  for (const key of ['responseFormat', 'response_format'] as const) {
    if (!(key in body)) continue;

    const format = body[key];
    if (!isPlainObject(format)) continue;

    const jsonSchema = format['json_schema'];
    if (!isPlainObject(jsonSchema)) continue;

    if ('schema' in jsonSchema) {
      schemas.push({
        path: ['response_format', 'json_schema', 'schema'],
        schema: jsonSchema['schema'],
      });
      break;
    }
  }

  return schemas;
}

/**
 * Restore preserved schemas after conversion.
 */
function restorePreservedSchemas(
  converted: Record<string, unknown>,
  schemas: readonly PreservedSchema[],
): void {
  for (const { path, schema } of schemas) {
    let current: Record<string, unknown> = converted;

    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!key || !(key in current)) break;

      const next = current[key];
      if (!isPlainObject(next)) break;

      current = next;
    }

    const lastKey = path[path.length - 1];
    if (lastKey) {
      current[lastKey] = schema;
    }
  }
}

/**
 * Transform request parameters from camelCase to snake_case.
 *
 * Preserves JSON schemas in response_format to prevent breaking schema structure.
 * Both camelCase and snake_case inputs are supported.
 */
export function transformRequestBody<T>(body: T): T {
  if (!isPlainObject(body)) {
    return body;
  }

  const preservedSchemas = extractPreservedSchemas(body);
  const converted = toSnakeCaseDeep(body);

  if (preservedSchemas.length > 0 && isPlainObject(converted)) {
    restorePreservedSchemas(converted, preservedSchemas);
  }

  return converted as T;
}
