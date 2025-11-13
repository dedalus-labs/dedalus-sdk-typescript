// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-python/LICENSE
// ==============================================================================

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonArray = JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

/** Mirrors: Tool = Callable[..., JsonValue]  (allowing async in TS) */
export type Tool = (...args: any[]) => JsonValue | Promise<JsonValue>;

/** Mirrors: ToolCall = Dict[str, Union[str, Dict[str, str]]] */
export type ToolCall = Record<string, string | Record<string, string>>;

/** Mirrors: ToolResult = Dict[str, Union[str, int, JsonValue]] */
export type ToolResult = Record<string, string | number | JsonValue>;

/** Protocol-style interface for tool handlers */
export interface ToolHandler {
  /** Return JSON Schemas (or equivalent) describing available tools */
  schemas(): Array<Record<string, any>>;
  /** Execute a named tool with JSON-ish args */
  exec(name: string, args: Record<string, JsonValue>): Promise<JsonValue>;
}
