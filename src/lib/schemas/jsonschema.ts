/**
 * JSON Schema Draft 07 type definitions
 * Based on https://json-schema.org/draft-07/json-schema-release-notes.html
 */

export type JSONSchemaType = 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string' | 'integer';

export type JSONSchemaDefinition = JSONSchema | boolean;

export interface JSONSchema {
  // Metadata
  $id?: string;
  $schema?: string;
  $ref?: string;
  $comment?: string;

  // Annotations
  title?: string;
  description?: string;
  default?: any;
  examples?: any[];
  readOnly?: boolean;
  writeOnly?: boolean;

  // Type
  type?: JSONSchemaType | JSONSchemaType[];

  // String validation
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // Number validation
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  multipleOf?: number;

  // Object validation
  properties?: { [key: string]: JSONSchemaDefinition };
  additionalProperties?: boolean | JSONSchemaDefinition;
  required?: string[];
  propertyNames?: JSONSchemaDefinition;
  minProperties?: number;
  maxProperties?: number;
  dependencies?: {
    [key: string]: JSONSchemaDefinition | string[];
  };
  patternProperties?: { [key: string]: JSONSchemaDefinition };

  // Array validation
  items?: JSONSchemaDefinition | JSONSchemaDefinition[];
  additionalItems?: JSONSchemaDefinition;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchemaDefinition;

  // Conditional schemas
  if?: JSONSchemaDefinition;
  then?: JSONSchemaDefinition;
  else?: JSONSchemaDefinition;

  // Schema composition
  allOf?: JSONSchemaDefinition[];
  anyOf?: JSONSchemaDefinition[];
  oneOf?: JSONSchemaDefinition[];
  not?: JSONSchemaDefinition;

  // Enum
  enum?: any[];
  const?: any;

  // Definitions (deprecated in Draft 07, use $defs instead)
  definitions?: { [key: string]: JSONSchemaDefinition };

  // $defs (Draft 07+)
  $defs?: { [key: string]: JSONSchemaDefinition };

  // Content validation (for strings)
  contentEncoding?: string;
  contentMediaType?: string;
}

/**
 * Type guard to check if a value is a JSONSchema object
 */
export function isJSONSchema(value: JSONSchemaDefinition): value is JSONSchema {
  return typeof value === 'object' && value !== null;
}

/**
 * Supported string formats in strict mode
 */
export const SUPPORTED_STRING_FORMATS = new Set([
  'date-time',
  'time',
  'date',
  'duration',
  'email',
  'idn-email',
  'hostname',
  'idn-hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'iri',
  'iri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
]);
