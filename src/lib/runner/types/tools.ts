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

export type { JsonValue };

/** Callable function that returns JSON-serializable data, synchronously or asynchronously. */
export type Tool = (...args: any[]) => JsonValue | Promise<JsonValue>;

/** Tool call type from Dedalus SDK. */
export type ToolCall = ChatCompletionMessageToolCall | ChatCompletionMessageCustomToolCall;

/** Result of executing a tool during a conversation turn. */
export type ToolResult = Record<string, string | number | JsonValue>;

/** Interface for objects that manage tool registration and execution. */
export interface ToolHandler {
  schemas(): Array<ChatCompletionToolParam>;
  exec(name: string, args: Record<string, JsonValue>): Promise<JsonValue>;
}
