import type { ResponseFormatJSONSchema } from '../resources/shared';
import {
  makeParseableResponseFormat,
  makeParseableTool,
  type AutoParseableResponseFormat,
  type AutoParseableTool,
} from '../lib/parser';
import { transformJSONSchema } from '../lib/schemas/transform';
import type { JSONSchema } from '../lib/schemas/jsonschema';

// Type guard to check if Zod is available
function checkZodAvailable(): void {
  try {
    require.resolve('zod');
  } catch {
    throw new Error(
      'Zod is not installed. Install it with: npm install zod\n' +
        'Zod helpers require zod >= 3.23 as a peer dependency.',
    );
  }
}

/**
 * Creates a response format object from a Zod schema for structured outputs.
 *
 * If this is passed to the `.parse()` method, the response message will contain a
 * `.parsed` property that is the result of parsing the content with the given Zod schema.
 *
 * This can be passed directly to `.create()` but will not result in automatic parsing.
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { zodResponseFormat } from 'dedalus-labs/helpers/zod';
 *
 * const MathAnswer = z.object({
 *   steps: z.array(z.object({
 *     explanation: z.string(),
 *     answer: z.string(),
 *   })),
 *   final_answer: z.string(),
 * });
 *
 * const completion = await client.chat.completions.parse({
 *   model: 'openai/gpt-5-nano',
 *   messages: [
 *     { role: 'system', content: 'You are a helpful math tutor.' },
 *     { role: 'user', content: 'solve 8x + 31 = 2' },
 *   ],
 *   response_format: zodResponseFormat(MathAnswer, 'math_answer'),
 * });
 *
 * const parsed = completion.choices[0]?.message.parsed;
 * console.log(parsed?.final_answer);
 * ```
 *
 * @param zodObject - The Zod schema to use for validation
 * @param name - A name for the schema (required by the API)
 * @param props - Additional properties for the response format
 * @returns An auto-parseable response format
 */
// Zod types (imported dynamically)
type ZodType = { _def: unknown; parse(value: unknown): unknown };
type ZodError = Error & { issues: unknown[] };

export function zodResponseFormat<ZodInput extends ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<ResponseFormatJSONSchema.JSONSchema, 'schema' | 'strict' | 'name'>,
): AutoParseableResponseFormat<ReturnType<ZodInput['parse']>> {
  checkZodAvailable();

  // Dynamically import Zod to avoid hard dependency
  const z = require('zod');

  // Check if the zodObject is actually a Zod schema
  if (!('_def' in zodObject && typeof zodObject.parse === 'function')) {
    throw new Error('zodObject must be a Zod schema with _def and parse method');
  }

  // Use Zod's native toJSONSchema (available since v3.23)
  let jsonSchema: Record<string, unknown>;

  // Try Zod v4 first (has toJSONSchema static method)
  if (typeof z.toJSONSchema === 'function') {
    jsonSchema = z.toJSONSchema(zodObject, {
      target: 'draft-7',
      reused: 'ref', // Handle circular references
    }) as Record<string, unknown>;
  }
  // Try Zod v3 (has toJSONSchema on instance)
  else if ('toJSONSchema' in zodObject && typeof zodObject.toJSONSchema === 'function') {
    jsonSchema = zodObject.toJSONSchema({
      target: 'draft-7',
      reused: 'ref',
    }) as Record<string, unknown>;
  }
  // Fallback error
  else {
    throw new Error(
      'Zod version does not support toJSONSchema(). ' + 'Please upgrade to Zod >= 3.23 or Zod v4.',
    );
  }

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
      // Use Zod's parse method for validation
      try {
        const parsed = JSON.parse(content);
        return zodObject.parse(parsed) as ReturnType<ZodInput['parse']>;
      } catch (err: unknown) {
        // Type guard for Zod errors
        if (err && typeof err === 'object' && ('issues' in err || (err as Error).name === 'ZodError')) {
          const zodError = err as ZodError;
          throw new Error(
            `Failed to parse structured output: ${zodError.message}\n` +
              `Issues: ${JSON.stringify(zodError.issues, null, 2)}`,
          );
        }
        throw err;
      }
    },
  );
}

/**
 * Creates a function tool that can be auto-parsed by the SDK.
 *
 * The Zod schema will be automatically converted to JSON Schema when passed to the API.
 * The function's input arguments will also be validated against the provided schema.
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { zodFunction } from 'dedalus-labs/helpers/zod';
 *
 * const GetWeather = zodFunction({
 *   name: 'get_weather',
 *   parameters: z.object({
 *     location: z.string(),
 *     unit: z.enum(['celsius', 'fahrenheit']),
 *   }),
 *   description: 'Get the current weather in a location',
 *   function: async (args) => {
 *     // args is typed as { location: string; unit: 'celsius' | 'fahrenheit' }
 *     const weather = await fetchWeather(args.location, args.unit);
 *     return JSON.stringify(weather);
 *   },
 * });
 *
 * const completion = await client.chat.completions.parse({
 *   model: 'openai/gpt-5-nano',
 *   messages: [{ role: 'user', content: 'What is the weather in SF?' }],
 *   tools: [GetWeather],
 * });
 *
 * const toolCall = completion.choices[0]?.message.tool_calls?.[0];
 * console.log(toolCall?.function.parsed_arguments);
 * ```
 *
 * @param options - Tool configuration
 * @param options.name - The name of the function
 * @param options.parameters - Zod schema for the function parameters
 * @param options.description - Description of what the function does
 * @param options.function - Optional function implementation
 * @returns An auto-parseable tool
 */
export function zodFunction<Parameters extends ZodType>(options: {
  name: string;
  parameters: Parameters;
  description?: string;
  function?: ((args: ReturnType<Parameters['parse']>) => unknown | Promise<unknown>) | undefined;
}): AutoParseableTool<{ name: string; arguments: ReturnType<Parameters['parse']>; function?: Function }> {
  checkZodAvailable();

  const z = require('zod');

  if (!('_def' in options.parameters && typeof options.parameters.parse === 'function')) {
    throw new Error('parameters must be a Zod schema with _def and parse method');
  }

  // Generate JSON Schema from Zod parameters
  let jsonSchema: Record<string, unknown>;

  if (typeof z.toJSONSchema === 'function') {
    jsonSchema = z.toJSONSchema(options.parameters, {
      target: 'draft-7',
      reused: 'ref',
    }) as Record<string, unknown>;
  } else if ('toJSONSchema' in options.parameters && typeof options.parameters.toJSONSchema === 'function') {
    jsonSchema = options.parameters.toJSONSchema({
      target: 'draft-7',
      reused: 'ref',
    }) as Record<string, unknown>;
  } else {
    throw new Error(
      'Zod version does not support toJSONSchema(). ' + 'Please upgrade to Zod >= 3.23 or Zod v4.',
    );
  }

  // Validate that the schema is an object type (required for function parameters)
  if (jsonSchema['type'] !== 'object') {
    throw new Error(
      `Zod schema for tool "${options.name}" must be an object type, ` +
        `but got type: ${jsonSchema['type']}`,
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
          return options.parameters.parse(parsed) as ReturnType<Parameters['parse']>;
        } catch (err: unknown) {
          // Type guard for Zod errors
          if (err && typeof err === 'object' && ('issues' in err || (err as Error).name === 'ZodError')) {
            const zodError = err as ZodError;
            throw new Error(
              `Failed to parse tool arguments for '${options.name}': ${zodError.message}\n` +
                `Issues: ${JSON.stringify(zodError.issues, null, 2)}`,
            );
          }
          throw err;
        }
      },
    },
  );
}
