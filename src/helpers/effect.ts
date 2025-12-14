import type { ResponseFormatJSONSchema } from '../resources/shared';
import {
  makeParseableResponseFormat,
  makeParseableTool,
  type AutoParseableResponseFormat,
  type AutoParseableTool,
} from '../lib/parser';
import { transformJSONSchema } from '../lib/schemas/transform';
import type { JSONSchema } from '../lib/schemas/jsonschema';

// Type guard to check if Effect is available
function checkEffectAvailable(): void {
  try {
    require.resolve('effect');
  } catch {
    throw new Error(
      'Effect is not installed. Install it with: npm install effect\n' +
        'Effect helpers require effect >= 3.10 as a peer dependency.',
    );
  }
}

// Effect schema types (imported dynamically)
type EffectSchemaType = { readonly Type: unknown; readonly ast: unknown };
type InferEffectType<T> = T extends { readonly Type: infer A } ? A : never;
type ParseError = Error & { _tag?: string; issue?: unknown };

/**
 * Creates a response format object from an Effect Schema for structured outputs.
 *
 * If this is passed to the `.parse()` method, the response message will contain a
 * `.parsed` property that is the result of decoding the content using the given Effect schema.
 *
 * This can be passed directly to `.create()` but will not result in automatic parsing.
 *
 * @example
 * ```ts
 * import * as Schema from 'effect/Schema';
 * import { effectResponseFormat } from 'dedalus-labs/helpers/effect';
 *
 * const MathAnswer = Schema.Struct({
 *   steps: Schema.Array(
 *     Schema.Struct({
 *       explanation: Schema.String,
 *       answer: Schema.String,
 *     }),
 *   ),
 *   final_answer: Schema.String,
 * });
 *
 * const completion = await client.chat.completions.parse({
 *   model: 'openai/gpt-5-nano',
 *   messages: [
 *     { role: 'system', content: 'You are a helpful math tutor.' },
 *     { role: 'user', content: 'solve 8x + 31 = 2' },
 *   ],
 *   response_format: effectResponseFormat(MathAnswer, 'math_answer'),
 * });
 *
 * const parsed = completion.choices[0]?.message.parsed;
 * console.log(parsed?.final_answer);
 * ```
 *
 * @param schema - The Effect schema to use for validation
 * @param name - A name for the schema (required by the API)
 * @param props - Additional properties for the response format
 * @returns An auto-parseable response format
 */
export function effectResponseFormat<SchemaInput extends EffectSchemaType>(
  schema: SchemaInput,
  name: string,
  props?: Omit<ResponseFormatJSONSchema.JSONSchema, 'schema' | 'strict' | 'name'>,
): AutoParseableResponseFormat<InferEffectType<SchemaInput>> {
  checkEffectAvailable();

  // Dynamically import Effect to avoid hard dependency
  const Schema = require('effect/Schema') as {
    isSchema?: (u: unknown) => boolean;
    decodeUnknownSync: (schema: unknown) => (u: unknown) => unknown;
  };
  const JSONSchema = require('effect/JSONSchema') as {
    make: (schema: unknown, options?: { target?: string }) => Record<string, unknown>;
  };

  // Validate schema
  if (!schema || (typeof schema !== 'object' && typeof schema !== 'function') || !('ast' in schema)) {
    throw new Error('schema must be an Effect Schema');
  }

  // Generate JSON Schema from Effect schema
  const jsonSchema = JSONSchema.make(schema, { target: 'jsonSchema7' });

  // Apply strict transformations for OpenAI compatibility
  const strictSchema = transformJSONSchema(jsonSchema as JSONSchema);

  return makeParseableResponseFormat(
    {
      type: 'json_schema',
      json_schema: {
        ...props,
        name,
        strict: true as any, // Schema types as object but API expects boolean
        schema: strictSchema as Record<string, unknown>,
      },
    },
    (content) => {
      try {
        const parsed = JSON.parse(content);
        return Schema.decodeUnknownSync(schema)(parsed) as InferEffectType<SchemaInput>;
      } catch (err: unknown) {
        if (err instanceof Error && (err.name === 'ParseError' || (err as ParseError)._tag === 'ParseError')) {
          const parseError = err as ParseError;
          throw new Error(`Failed to parse structured output: ${parseError.message}`);
        }
        throw err;
      }
    },
  );
}

/**
 * Creates a function tool that can be auto-parsed by the SDK.
 *
 * The Effect schema will be automatically converted to JSON Schema when passed to the API.
 * The function's input arguments will also be validated against the provided schema.
 *
 * @example
 * ```ts
 * import * as Schema from 'effect/Schema';
 * import { effectFunction } from 'dedalus-labs/helpers/effect';
 *
 * const GetWeather = effectFunction({
 *   name: 'get_weather',
 *   parameters: Schema.Struct({
 *     location: Schema.String,
 *     unit: Schema.Literal('celsius', 'fahrenheit'),
 *   }),
 *   description: 'Get the current weather in a location',
 *   function: async (args) => {
 *     const weather = await fetchWeather(args.location, args.unit);
 *     return JSON.stringify(weather);
 *   },
 * });
 * ```
 *
 * @param options - Tool configuration
 * @param options.name - The name of the function
 * @param options.parameters - Effect schema for the function parameters
 * @param options.description - Description of what the function does
 * @param options.function - Optional function implementation
 * @returns An auto-parseable tool
 */
export function effectFunction<Parameters extends EffectSchemaType>(options: {
  name: string;
  parameters: Parameters;
  description?: string;
  function?: ((args: InferEffectType<Parameters>) => unknown | Promise<unknown>) | undefined;
}): AutoParseableTool<{ name: string; arguments: InferEffectType<Parameters>; function?: Function }> {
  checkEffectAvailable();

  const Schema = require('effect/Schema') as {
    isSchema?: (u: unknown) => boolean;
    decodeUnknownSync: (schema: unknown) => (u: unknown) => unknown;
  };
  const JSONSchema = require('effect/JSONSchema') as {
    make: (schema: unknown, options?: { target?: string }) => Record<string, unknown>;
  };

  if (
    !options.parameters ||
    (typeof options.parameters !== 'object' && typeof options.parameters !== 'function') ||
    !('ast' in options.parameters)
  ) {
    throw new Error('parameters must be an Effect Schema');
  }

  // Generate JSON Schema from Effect parameters
  const jsonSchema = JSONSchema.make(options.parameters, { target: 'jsonSchema7' });

  // Validate that the schema is an object type (required for function parameters)
  if (jsonSchema['type'] !== 'object') {
    throw new Error(
      `Effect schema for tool "${options.name}" must be an object type, ` + `but got type: ${jsonSchema['type']}`,
    );
  }

  // Apply strict transformations
  const strictSchema = transformJSONSchema(jsonSchema as JSONSchema);

  return makeParseableTool(
    {
      type: 'function',
      function: {
        name: options.name,
        parameters: strictSchema as Record<string, unknown>,
        strict: true as any, // Schema types as object but API expects boolean
        ...(options.description ? { description: options.description } : {}),
      },
    },
    {
      callback: options.function,
      parser: (args) => {
        try {
          const parsed = JSON.parse(args);
          return Schema.decodeUnknownSync(options.parameters)(parsed) as InferEffectType<Parameters>;
        } catch (err: unknown) {
          if (err instanceof Error && (err.name === 'ParseError' || (err as ParseError)._tag === 'ParseError')) {
            const parseError = err as ParseError;
            throw new Error(`Failed to parse tool arguments for '${options.name}': ${parseError.message}`);
          }
          throw err;
        }
      },
    },
  );
}
