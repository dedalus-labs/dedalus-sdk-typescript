import type { JSONSchema, JSONSchemaDefinition } from './jsonschema';
import { isJSONSchema, SUPPORTED_STRING_FORMATS } from './jsonschema';

/**
 * Deep clone a JSON schema object
 */
function deepClone<T>(obj: T): T {
  return structuredClone(obj);
}

/**
 * Check if an object is a plain object (not array, not null)
 */
function isObject<T>(obj: T | Array<any>): obj is Extract<T, Record<string, any>> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Check if a schema definition allows null values
 */
function isNullable(schema: JSONSchemaDefinition): boolean {
  if (typeof schema === 'boolean') {
    return false;
  }
  if (!isJSONSchema(schema)) {
    return false;
  }

  // Direct null type
  if (schema.type === 'null') {
    return true;
  }

  // Array of types including null
  if (Array.isArray(schema.type) && schema.type.includes('null')) {
    return true;
  }

  // Check anyOf variants
  for (const variant of schema.anyOf ?? []) {
    if (isNullable(variant)) {
      return true;
    }
  }

  // Check oneOf variants
  for (const variant of schema.oneOf ?? []) {
    if (isNullable(variant)) {
      return true;
    }
  }

  return false;
}

/**
 * Resolve a $ref pointer in the schema
 */
function resolveRef(root: JSONSchema, ref: string): JSONSchemaDefinition {
  if (!ref.startsWith('#/')) {
    throw new Error(`Unsupported $ref format: ${ref}. Only internal references (#/) are supported.`);
  }

  const pathParts = ref.slice(2).split('/');
  let resolved: any = root;

  for (const key of pathParts) {
    if (!isObject(resolved)) {
      throw new Error(`Cannot resolve $ref ${ref}: encountered non-object at ${key}`);
    }
    if (!(key in resolved)) {
      throw new Error(`Cannot resolve $ref ${ref}: key ${key} not found`);
    }
    resolved = resolved[key];
  }

  return resolved;
}

/**
 * Transform a JSON Schema to conform to OpenAI's strict mode requirements.
 *
 * Requirements:
 * - All object types must have `additionalProperties: false`
 * - All properties must be required (no optional fields without nullable)
 * - Only supported formats are preserved
 * - $refs are resolved and inlined
 * - Recursive processing of all schema parts
 *
 * @param schema - The JSON Schema to transform
 * @returns The transformed schema conforming to strict mode
 */
export function transformJSONSchema(schema: JSONSchema): JSONSchema {
  if (schema.type !== 'object' && !schema.anyOf && !schema.oneOf && !schema.allOf) {
    throw new Error(
      `Root schema must have type: 'object' or use anyOf/oneOf/allOf, but got type: ${
        schema.type ? `'${schema.type}'` : 'undefined'
      }`,
    );
  }

  const workingCopy = deepClone(schema);
  return ensureStrictSchema(workingCopy, [], workingCopy);
}

/**
 * Recursively ensure a schema definition conforms to strict mode
 */
function ensureStrictSchema(jsonSchema: JSONSchemaDefinition, path: string[], root: JSONSchema): JSONSchema {
  if (typeof jsonSchema === 'boolean') {
    throw new TypeError(`Boolean schemas are not supported; path=${path.join('/')}`);
  }

  if (!isObject(jsonSchema)) {
    throw new TypeError(`Expected ${JSON.stringify(jsonSchema)} to be an object; path=${path.join('/')}`);
  }

  // Handle $defs (definitions)
  const defs = '$defs' in jsonSchema ? jsonSchema.$defs : undefined;
  if (isObject(defs)) {
    for (const [defName, defSchema] of Object.entries(defs)) {
      ensureStrictSchema(defSchema as JSONSchemaDefinition, [...path, '$defs', defName], root);
    }
  }

  // Handle definitions (draft-04 compatibility)
  const definitions = 'definitions' in jsonSchema ? jsonSchema.definitions : undefined;
  if (isObject(definitions)) {
    for (const [defName, defSchema] of Object.entries(definitions)) {
      ensureStrictSchema(defSchema as JSONSchemaDefinition, [...path, 'definitions', defName], root);
    }
  }

  // Handle $ref with additional properties - inline the reference
  const ref = '$ref' in jsonSchema ? jsonSchema.$ref : undefined;
  if (ref && typeof ref === 'string') {
    const hasAdditionalProperties = Object.keys(jsonSchema).length > 1;

    if (hasAdditionalProperties) {
      const resolved = resolveRef(root, ref);
      if (typeof resolved === 'boolean') {
        throw new Error(`$ref ${ref} resolved to a boolean schema, which is not supported`);
      }
      if (!isObject(resolved)) {
        throw new Error(`$ref ${ref} resolved to ${JSON.stringify(resolved)}, expected an object`);
      }

      // Merge resolved schema with current properties (current takes precedence)
      Object.assign(jsonSchema, { ...resolved, ...jsonSchema });
      if ('$ref' in jsonSchema) {
        delete jsonSchema.$ref;
      }

      // Recursively process the merged schema
      return ensureStrictSchema(jsonSchema, path, root);
    }
  }

  const type = jsonSchema.type;

  // Handle object types
  if (type === 'object') {
    // Add additionalProperties: false if not present
    if (!('additionalProperties' in jsonSchema)) {
      jsonSchema.additionalProperties = false;
    }

    const properties = jsonSchema.properties;
    const required = jsonSchema.required ?? [];

    if (isObject(properties)) {
      // Validate that all non-nullable optional fields are explicitly marked as required
      // This is OpenAI's strict mode validation
      for (const [key, value] of Object.entries(properties)) {
        if (!isNullable(value) && !required.includes(key)) {
          throw new Error(
            `Property '${key}' at path '${[...path, 'properties', key].join('/')}' uses optional ` +
              `without nullable, which is not supported by OpenAI strict mode. ` +
              `Either make it required or use .nullable(). ` +
              `See: https://platform.openai.com/docs/guides/structured-outputs#all-fields-must-be-required`,
          );
        }
      }

      // Make all properties required
      jsonSchema.required = Object.keys(properties);

      // Recursively process properties
      jsonSchema.properties = Object.fromEntries(
        Object.entries(properties).map(([key, propSchema]) => [
          key,
          ensureStrictSchema(propSchema, [...path, 'properties', key], root),
        ]),
      );
    }
  }

  // Handle string types - validate formats
  if (type === 'string') {
    const format = jsonSchema.format;
    if (format && !SUPPORTED_STRING_FORMATS.has(format)) {
      // Move unsupported formats to description as metadata
      const existingDesc = jsonSchema.description || '';
      jsonSchema.description = existingDesc ? `${existingDesc}\n\nFormat: ${format}` : `Format: ${format}`;
      delete jsonSchema.format;
    }
  }

  // Handle array types
  const items = jsonSchema.items;
  if (type === 'array' && isObject(items) && !Array.isArray(items)) {
    jsonSchema.items = ensureStrictSchema(items, [...path, 'items'], root);
  }

  // Handle anyOf (unions)
  const anyOf = jsonSchema.anyOf;
  if (Array.isArray(anyOf)) {
    jsonSchema.anyOf = anyOf.map((variant, i) =>
      ensureStrictSchema(variant, [...path, 'anyOf', String(i)], root),
    );
  }

  // Handle oneOf
  const oneOf = jsonSchema.oneOf;
  if (Array.isArray(oneOf)) {
    // Convert oneOf to anyOf (more lenient)
    jsonSchema.anyOf = oneOf.map((variant, i) =>
      ensureStrictSchema(variant, [...path, 'oneOf', String(i)], root),
    );
    delete jsonSchema.oneOf;
  }

  // Handle allOf (intersections)
  const allOf = jsonSchema.allOf;
  if (Array.isArray(allOf)) {
    if (allOf.length === 1) {
      // Single allOf element - flatten it
      const resolved = ensureStrictSchema(allOf[0]!, [...path, 'allOf', '0'], root);
      Object.assign(jsonSchema, resolved);
      delete jsonSchema.allOf;
    } else {
      jsonSchema.allOf = allOf.map((entry, i) =>
        ensureStrictSchema(entry, [...path, 'allOf', String(i)], root),
      );
    }
  }

  // Strip null defaults (no meaningful distinction)
  if (jsonSchema.default === null) {
    delete jsonSchema.default;
  }

  return jsonSchema;
}
