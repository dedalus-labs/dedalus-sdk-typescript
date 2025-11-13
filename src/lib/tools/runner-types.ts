// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-labs-python-sdk/LICENSE
// ==============================================================================

export type JsonPrimitive = string | number | boolean | null;
export type JsonObjectKV = string | number | boolean;
export type JsonValue =
  | JsonPrimitive
  | { [k: string]: JsonObjectKV }
  | Array<string | number | boolean>;

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface ToolCallFunction {
  name: string;
  arguments: string;
}

export interface ToolCall {
  id: string;
  type?: "function";
  function: ToolCallFunction;
}

export interface MessageDict {
  role: MessageRole;
  content?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolResult {
  name?: string;
  result?: JsonValue;
  step?: number;
  error?: string;
}

export interface PolicyContext {
  step: number;
  messages: MessageDict[];
  model: string;
  mcp_servers?: string[];
  tools?: string[];
  available_models?: string[];
  [k: string]: unknown;
}

export type PolicyResultShape = {
  model?: string;
  mcp_servers?: string[];
  model_settings?: Record<string, unknown>;
  message_prepend?: MessageDict[];
  message_append?: MessageDict[];
  max_steps?: number;
};

export type PolicyInput =
  | ((ctx: PolicyContext) => Record<string, JsonValue> | PolicyResultShape)
  | Record<string, JsonValue | unknown>
  | null
  | undefined;

export interface ChatMessageOut {
  role: MessageRole;
  content?: string | null;
  tool_calls?: ToolCall[];
}

export interface ChatChoice {
  message: ChatMessageOut;
  finish_reason?: string | null;
}

export interface ChatCompletionResponse {
  choices: ChatChoice[];
}

export interface ToolCallDelta {
  index: number;
  id?: string;
  function?: Partial<ToolCallFunction>;
}

export interface ChatDelta {
  role?: MessageRole;
  content?: string;
  tool_calls?: ToolCallDelta[];
}

export interface ChatStreamChoice {
  delta: ChatDelta;
  finish_reason?: string | null;
}

export interface ChatCompletionChunk {
  choices: ChatStreamChoice[];
}

export interface ChatCompletionsAPI {
  create(body: any, options?: any): any;
}

export interface DedalusLikeClient {
  chat: {
    completions: ChatCompletionsAPI;
  };
}

export type ToolJSONSchema = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: any;
  };
};

export interface ToolHandler {
  schemas(): ToolJSONSchema[];
  exec(name: string, args: Record<string, JsonValue>): Promise<JsonValue>;
}

export interface ModelConfig {
  id: string;
  temperature?: number | null;
  max_tokens?: number | null;
  top_p?: number | null;
  frequency_penalty?: number | null;
  presence_penalty?: number | null;
  logit_bias?: Record<string, number> | null;
  agent_attributes?: Record<string, number> | null;
  model_attributes?: Record<string, Record<string, number>> | null;
  tool_choice?: string | Record<string, JsonValue> | null;
  guardrails?: Record<string, JsonValue>[] | null;
  handoff_config?: Record<string, JsonValue> | null;
}

export interface ExecutionConfig {
  mcp_servers: string[];
  max_steps: number;
  stream: boolean;
  transport: "http" | "realtime";
  verbose: boolean;
  debug: boolean;
  on_tool_event?: (evt: Record<string, JsonValue>) => void;
  return_intent: boolean;
  policy?: PolicyInput;
  available_models: string[];
  strict_models: boolean;
}

export interface RunResult {
  final_output: string; // Final text output
  tool_results: ToolResult[];
  steps_used: number;
  intents?: Record<string, JsonValue>[] | null;
  tools_called: string[];
  get output(): string;
  get content(): string;
}

export class SchemaProcessingError extends Error {
  constructor(message = "Schema processing error") {
    super(message);
    this.name = "SchemaProcessingError";
  }
}