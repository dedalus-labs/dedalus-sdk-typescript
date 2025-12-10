// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type {
  ChatCompletionToolParam,
  ChatCompletionMessageToolCall,
  ChatCompletionMessageCustomToolCall,
} from '../../../resources/chat/completions';
import type { JsonValue } from '../../utils/json';
import type { ZodLike } from '../../utils/zod';

export type { JsonValue, ZodLike };

/** JSON Schema for tool parameters */
export interface ToolParametersSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

/**
 * Structured tool definition with explicit schema.
 *
 * - Tools WITH `execute` are server-side tools (executed by the runner)
 * - Tools WITHOUT `execute` are client-side tools (forwarded to client via stream)
 *
 * @example Server-side tool
 * ```ts
 * const weatherTool: ToolDefinition = {
 *   name: 'getWeather',
 *   description: 'Get weather for a location',
 *   parameters: z.object({ location: z.string() }),
 *   execute: async ({ location }) => fetchWeather(location),
 * };
 * ```
 *
 * @example Client-side tool (no execute)
 * ```ts
 * const confirmTool: ToolDefinition = {
 *   name: 'askConfirmation',
 *   description: 'Ask user to confirm an action',
 *   parameters: {
 *     type: 'object',
 *     properties: { message: { type: 'string' } },
 *     required: ['message']
 *   },
 *   // No execute - handled on client via onToolCall
 * };
 * ```
 */
export interface ToolDefinition {
  /** Tool name (a-z, A-Z, 0-9, underscores, dashes, max 64 chars) */
  name: string;
  /** Description of what the tool does */
  description?: string;
  /**
   * JSON Schema for the tool's parameters.
   * Accepts either a plain JSON Schema object or a Zod schema.
   */
  parameters?: ToolParametersSchema | ZodLike;
  /** When true, model strictly follows the schema (OpenAI structured outputs) */
  strict?: boolean;
  /**
   * Execute function for server-side tools.
   * If absent, tool call is forwarded to client for execution.
   */
  execute?: (args: Record<string, any>) => JsonValue | Promise<JsonValue>;
}

/**
 * Callable function tool (server-side only).
 * Schema is auto-generated from function signature.
 */
export type ToolFunction = (...args: any[]) => JsonValue | Promise<JsonValue>;

/** Union type accepting both tool formats */
export type Tool = ToolDefinition | ToolFunction;

/** Tool call type from Dedalus SDK */
export type ToolCall = ChatCompletionMessageToolCall | ChatCompletionMessageCustomToolCall;

/** Result of executing a tool during a conversation turn */
export type ToolResult = Record<string, string | number | JsonValue>;

/** Interface for objects that manage tool registration and execution */
export interface ToolHandler {
  schemas: Array<ChatCompletionToolParam> | null;
  toolNames: string[];
  isClientTool(name: string): boolean;
  exec(name: string, args: Record<string, JsonValue>): Promise<JsonValue>;
}
