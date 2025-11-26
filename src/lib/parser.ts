import type { ResponseFormatJSONSchema } from '../resources/shared';
import type {
  Completion,
  CompletionCreateParams,
  CompletionCreateParamsBase,
  Choice,
  ChatCompletionMessage,
} from '../resources/chat/completions';

/**
 * Type-level brand marker for auto-parseable response formats.
 * The __output type is used for type inference only.
 */
export type AutoParseableResponseFormat<ParsedT> = ResponseFormatJSONSchema & {
  __output: ParsedT; // type-level only, for inference
  $brand: 'auto-parseable-response-format';
  $parseRaw(content: string): ParsedT;
};

/**
 * Extract the parsed content type from request parameters.
 * If the response_format is auto-parseable, extracts the ParsedT type.
 * Otherwise returns null.
 */
export type ExtractParsedContentFromParams<Params extends { response_format?: any }> =
  Params['response_format'] extends AutoParseableResponseFormat<infer P> ? P : null;

/**
 * Create an auto-parseable response format object with brand markers.
 * Brand markers are non-enumerable properties that allow runtime detection
 * without polluting JSON serialization.
 *
 * @param response_format - The base response format object
 * @param parser - Function to parse the raw content string
 * @returns An auto-parseable response format with brand markers
 */
export function makeParseableResponseFormat<ParsedT>(
  response_format: ResponseFormatJSONSchema,
  parser: (content: string) => ParsedT,
): AutoParseableResponseFormat<ParsedT> {
  const obj = { ...response_format };

  // Add non-enumerable brand markers
  Object.defineProperties(obj, {
    $brand: {
      value: 'auto-parseable-response-format',
      enumerable: false,
    },
    $parseRaw: {
      value: parser,
      enumerable: false,
    },
  });

  return obj as AutoParseableResponseFormat<ParsedT>;
}

/**
 * Check if a response format is auto-parseable by detecting the brand marker.
 */
export function isAutoParsableResponseFormat<ParsedT>(
  response_format: any,
): response_format is AutoParseableResponseFormat<ParsedT> {
  return response_format?.['$brand'] === 'auto-parseable-response-format';
}

/**
 * Type-level brand marker for auto-parseable tools.
 */
export type AutoParseableTool<OptionsT extends { name: string; arguments: any; function?: Function }> = {
  type: 'function';
  function: {
    name: string;
    parameters?: Record<string, unknown>;
    description?: string;
    strict?: any;
  };
  __arguments: OptionsT['arguments']; // type-level only
  __name: OptionsT['name']; // type-level only
  $brand: 'auto-parseable-tool';
  $callback: ((args: OptionsT['arguments']) => any) | undefined;
  $parseRaw(args: string): OptionsT['arguments'];
};

/**
 * Create an auto-parseable tool with brand markers.
 */
export function makeParseableTool<OptionsT extends { name: string; arguments: any; function?: Function }>(
  tool: any,
  options: {
    parser: (args: string) => OptionsT['arguments'];
    callback: ((args: any) => any) | undefined;
  },
): AutoParseableTool<OptionsT> {
  const obj = { ...tool };

  Object.defineProperties(obj, {
    $brand: {
      value: 'auto-parseable-tool',
      enumerable: false,
    },
    $parseRaw: {
      value: options.parser,
      enumerable: false,
    },
    $callback: {
      value: options.callback,
      enumerable: false,
    },
  });

  return obj as AutoParseableTool<OptionsT>;
}

/**
 * Check if a tool is auto-parseable.
 */
export function isAutoParsableTool(tool: any): tool is AutoParseableTool<any> {
  return tool?.['$brand'] === 'auto-parseable-tool';
}

/**
 * Parsed chat completion with typed parsed field.
 */
export interface ParsedChatCompletion<ParsedT> extends Omit<Completion, 'choices'> {
  choices: ParsedChoice<ParsedT>[];
}

/**
 * Parsed choice with typed parsed content.
 */
export interface ParsedChoice<ParsedT> extends Omit<Choice, 'message'> {
  message: ParsedMessage<ParsedT>;
}

/**
 * Parsed message with typed parsed field and parsed tool calls.
 */
export interface ParsedMessage<ParsedT> extends Omit<ChatCompletionMessage, 'tool_calls'> {
  /**
   * The parsed structured output, if response_format was auto-parseable.
   * Null if parsing failed or content was filtered.
   */
  parsed: ParsedT | null;

  /**
   * Tool calls with parsed arguments.
   */
  tool_calls?: ParsedFunctionToolCall[];
}

/**
 * Function tool call with parsed arguments.
 */
export interface ParsedFunctionToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
    /**
     * Parsed arguments if the tool was auto-parseable or marked as strict.
     * Null if parsing failed or tool wasn't parseable.
     */
    parsed_arguments: any | null;
  };
}

/**
 * Error thrown when completion is cut off due to length limit.
 */
export class LengthFinishReasonError extends Error {
  constructor() {
    super('Completion was cut off due to length limit (finish_reason: length)');
    this.name = 'LengthFinishReasonError';
  }
}

/**
 * Error thrown when content is filtered.
 */
export class ContentFilterFinishReasonError extends Error {
  constructor() {
    super('Content was filtered due to content policy (finish_reason: content_filter)');
    this.name = 'ContentFilterFinishReasonError';
  }
}

/**
 * Parse a chat completion if it has auto-parseable inputs.
 * If no auto-parseable inputs are detected, returns the completion with null parsed fields.
 *
 * @param completion - The raw completion from the API
 * @param params - The request parameters (may be null)
 * @returns ParsedChatCompletion with parsed content
 */
export function maybeParseChatCompletion<
  Params extends CompletionCreateParams | null,
  ParsedT = Params extends null ? null : ExtractParsedContentFromParams<NonNullable<Params>>,
>(completion: Completion, params: Params): ParsedChatCompletion<ParsedT> {
  if (!params || !hasAutoParseableInput(params)) {
    // No auto-parseable inputs - return completion with null parsed fields
    return {
      ...completion,
      choices: completion.choices.map((choice) => ({
        ...choice,
        message: {
          ...choice.message,
          parsed: null,
          tool_calls: choice.message.tool_calls?.map((tc: any) => ({
            ...tc,
            function: {
              ...tc.function,
              parsed_arguments: null,
            },
          })),
        },
      })),
    } as ParsedChatCompletion<ParsedT>;
  }

  return parseChatCompletion(completion, params);
}

/**
 * Parse a chat completion with auto-parseable inputs.
 * Throws errors for length or content_filter finish reasons.
 *
 * @param completion - The raw completion from the API
 * @param params - The request parameters
 * @returns ParsedChatCompletion with parsed content
 */
export function parseChatCompletion<
  Params extends CompletionCreateParams,
  ParsedT = ExtractParsedContentFromParams<Params>,
>(completion: Completion, params: Params): ParsedChatCompletion<ParsedT> {
  const choices: ParsedChoice<ParsedT>[] = completion.choices.map((choice): ParsedChoice<ParsedT> => {
    // Throw on problematic finish reasons
    if (choice.finish_reason === 'length') {
      throw new LengthFinishReasonError();
    }
    if (choice.finish_reason === 'content_filter') {
      throw new ContentFilterFinishReasonError();
    }

    return {
      ...choice,
      message: {
        ...choice.message,
        tool_calls: choice.message.tool_calls?.map((toolCall: any) => parseToolCall(params, toolCall)),
        parsed:
          choice.message.content && !choice.message.refusal ?
            parseResponseFormat(params, choice.message.content)
          : null,
      },
    } as ParsedChoice<ParsedT>;
  });

  return { ...completion, choices };
}

/**
 * Parse the response format content if auto-parseable.
 */
function parseResponseFormat<
  Params extends CompletionCreateParams,
  ParsedT = ExtractParsedContentFromParams<Params>,
>(params: Params, content: string): ParsedT | null {
  if (params.response_format?.type !== 'json_schema') {
    return null;
  }

  if ('$parseRaw' in params.response_format) {
    const response_format = params.response_format as AutoParseableResponseFormat<ParsedT>;
    return response_format.$parseRaw(content);
  }

  // Even if not auto-parseable, try to parse as JSON if strict mode
  if (params.response_format.json_schema?.strict) {
    return JSON.parse(content) as ParsedT;
  }

  return null;
}

/**
 * Parse a tool call's arguments if the tool is auto-parseable.
 */
function parseToolCall(
  params: CompletionCreateParams,
  toolCall: { id: string; type: string; function: { name: string; arguments: string } },
): ParsedFunctionToolCall {
  const inputTool = params.tools?.find((t) => {
    if (!t || typeof t !== 'object') return false;
    return (
      'type' in t &&
      t.type === 'function' &&
      'function' in t &&
      typeof t.function === 'object' &&
      t.function &&
      'name' in t.function &&
      t.function.name === toolCall.function.name
    );
  });

  let parsed_arguments: unknown = null;

  if (inputTool && isAutoParsableTool(inputTool)) {
    parsed_arguments = inputTool.$parseRaw(toolCall.function.arguments);
  } else if (
    inputTool &&
    'function' in inputTool &&
    inputTool.function &&
    typeof inputTool.function === 'object' &&
    'strict' in inputTool.function
  ) {
    parsed_arguments = JSON.parse(toolCall.function.arguments);
  }

  return {
    id: toolCall.id,
    type: 'function',
    function: {
      name: toolCall.function.name,
      arguments: toolCall.function.arguments,
      parsed_arguments,
    },
  };
}

/**
 * Check if parameters have any auto-parseable inputs (response format or tools).
 */
export function hasAutoParseableInput(params: CompletionCreateParams): boolean {
  if (isAutoParsableResponseFormat(params.response_format)) {
    return true;
  }

  return (
    params.tools?.some((t) => {
      if (isAutoParsableTool(t)) return true;
      if (!t || typeof t !== 'object') return false;
      return (
        'type' in t &&
        t.type === 'function' &&
        'function' in t &&
        typeof t.function === 'object' &&
        t.function &&
        'strict' in t.function &&
        t.function.strict === true
      );
    }) ?? false
  );
}

/**
 * Validate that all tools are marked as strict for auto-parsing.
 * Throws if any tool is not strict.
 */
export function validateInputTools(tools: CompletionCreateParamsBase['tools']): void {
  for (const tool of tools ?? []) {
    if (!tool || typeof tool !== 'object') {
      throw new Error('Tool must be an object');
    }

    if (!('type' in tool) || tool.type !== 'function') {
      throw new Error(
        `Only 'function' tool types support auto-parsing; received type: ${
          'type' in tool ? tool.type : 'unknown'
        }`,
      );
    }

    if ('function' in tool && typeof tool.function === 'object' && tool.function) {
      const func = tool.function;
      const funcName = 'name' in func ? String(func.name) : 'unknown';
      const isStrict = 'strict' in func && func.strict === true;

      if (!isStrict) {
        throw new Error(
          `Tool '${funcName}' must be marked with 'strict: true' for auto-parsing. ` +
            `Only strict function tools can be auto-parsed.`,
        );
      }
    }
  }
}
