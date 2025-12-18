// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Credential for MCP server authentication.
 *
 * Passed at endpoint level (e.g., chat.completions.create) and matched to MCP
 * servers by connection name. Wire format matches
 * dedalus_mcp.Credential.to_dict().
 */
export interface Credential {
  /**
   * Connection name. Must match a connection in MCPServer.connections.
   */
  connection_name: string;

  /**
   * Credential values. Keys are credential field names, values are the secrets.
   */
  values: { [key: string]: string | number | boolean };
}

/**
 * Structured model selection entry used in request payloads.
 *
 * Supports OpenAI-style semantics (string model id) while enabling optional
 * per-model default settings for Dedalus multi-model routing.
 */
export interface DedalusModel {
  /**
   * Model identifier with provider prefix (e.g., 'openai/gpt-5',
   * 'anthropic/claude-3-5-sonnet').
   */
  model: string;

  /**
   * Optional default generation settings (e.g., temperature, max_tokens) applied
   * when this model is selected.
   */
  settings?: ModelSettings | null;
}

/**
 * Dedalus model choice - either a string ID or DedalusModel configuration object.
 */
export type DedalusModelChoice = string | DedalusModel;

/**
 * Schema for FunctionObject.
 *
 * Fields:
 *
 * - description (optional): str
 * - name (required): str
 * - parameters (optional): FunctionParameters
 * - strict (optional): bool | None
 */
export interface FunctionDefinition {
  /**
   * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
   * underscores and dashes, with a maximum length of 64.
   */
  name: string;

  /**
   * A description of what the function does, used by the model to choose when and
   * how to call the function.
   */
  description?: string;

  /**
   * The parameters the functions accepts, described as a JSON Schema object. See the
   * [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
   * and the
   * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
   * documentation about the format.
   *
   * Omitting `parameters` defines a function with an empty parameter list.
   */
  parameters?: FunctionParameters;

  /**
   * Whether to enable strict schema adherence when generating the function call. If
   * set to true, the model will follow the exact schema defined in the `parameters`
   * field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn
   * more about Structured Outputs in the
   * [function calling guide](https://platform.openai.com/docs/guides/function-calling).
   */
  strict?: boolean | null;
}

/**
 * The parameters the functions accepts, described as a JSON Schema object. See the
 * [guide](https://platform.openai.com/docs/guides/function-calling) for examples,
 * and the
 * [JSON Schema reference](https://json-schema.org/understanding-json-schema/) for
 * documentation about the format.
 *
 * Omitting `parameters` defines a function with an empty parameter list.
 */
export type FunctionParameters = { [key: string]: unknown };

export type JSONObjectInput = { [key: string]: JSONValueInput | null };

export type JSONObjectOutput = { [key: string]: JSONValueOutput | null };

export type JSONValueInput =
  | string
  | number
  | boolean
  | { [key: string]: JSONValueInput | null }
  | Array<JSONValueInput | null>;

export type JSONValueOutput =
  | string
  | number
  | boolean
  | { [key: string]: JSONValueOutput | null }
  | Array<JSONValueOutput | null>;

/**
 * List of credentials for MCP server authentication.
 */
export type MCPCredentials = Array<Credential>;

/**
 * Structured MCP server specification.
 *
 * Slug-based: {"slug": "dedalus-labs/brave-search", "name": "github-integration",
 * "version": "v1.0.0"} URL-based: {"url":
 * "https://mcp.dedaluslabs.ai/acme/my-server/mcp", "name": "custom-server"}
 */
export interface MCPServerSpec {
  /**
   * Server instance name for credential matching.
   */
  name: string;

  /**
   * Encrypted credential blobs keyed by connection name. Values are base64url
   * ciphertext produced by the SDK (client-side encryption with the AS public key).
   */
  credentials?: { [key: string]: string } | null;

  /**
   * Marketplace identifier.
   */
  slug?: string | null;

  /**
   * Direct URL to MCP server endpoint (Pro users).
   */
  url?: string | null;

  /**
   * Version constraint for slug-based servers.
   */
  version?: string | null;
}

/**
 * List of MCP server inputs (slugs or structured specs).
 */
export type MCPServers = Array<string | MCPServerSpec>;

/**
 * Result of a single MCP tool execution.
 *
 * Provides visibility into MCP tool calls including the full input arguments and
 * structured output, enabling debugging and audit trails.
 */
export interface MCPToolResult {
  /**
   * Input arguments passed to the tool
   */
  arguments: JSONObjectOutput;

  /**
   * Whether the tool execution resulted in an error
   */
  is_error: boolean;

  /**
   * Name of the MCP server that handled the tool
   */
  server_name: string;

  /**
   * Name of the MCP tool that was executed
   */
  tool_name: string;

  /**
   * Execution time in milliseconds
   */
  duration_ms?: number | null;

  /**
   * Structured result from the tool (parsed from structuredContent or content)
   */
  result?: JSONValueOutput | null;
}

export interface ModelSettings {
  attributes?: { [key: string]: unknown };

  audio?: JSONObjectInput | null;

  deferred?: boolean | null;

  extra_args?: { [key: string]: unknown } | null;

  extra_headers?: { [key: string]: string } | null;

  extra_query?: { [key: string]: unknown } | null;

  frequency_penalty?: number | null;

  generation_config?: JSONObjectInput | null;

  include_usage?: boolean | null;

  input_audio_format?: string | null;

  input_audio_transcription?: JSONObjectInput | null;

  logit_bias?: { [key: string]: number } | null;

  logprobs?: boolean | null;

  max_completion_tokens?: number | null;

  max_tokens?: number | null;

  metadata?: { [key: string]: string } | null;

  modalities?: Array<string> | null;

  n?: number | null;

  output_audio_format?: string | null;

  parallel_tool_calls?: boolean | null;

  prediction?: JSONObjectInput | null;

  presence_penalty?: number | null;

  prompt_cache_key?: string | null;

  /**
   * **gpt-5 and o-series models only**
   *
   * Configuration options for
   * [reasoning models](https://platform.openai.com/docs/guides/reasoning).
   */
  reasoning?: Reasoning | null;

  reasoning_effort?: string | null;

  response_format?: JSONObjectInput | null;

  safety_identifier?: string | null;

  safety_settings?: Array<JSONObjectInput> | null;

  search_parameters?: JSONObjectInput | null;

  seed?: number | null;

  service_tier?: string | null;

  stop?: string | Array<string> | null;

  store?: boolean | null;

  stream?: boolean | null;

  stream_options?: JSONObjectInput | null;

  structured_output?: unknown;

  system_instruction?: JSONObjectInput | null;

  temperature?: number | null;

  thinking?: JSONObjectInput | null;

  timeout?: number | null;

  tool_choice?: ToolChoice | null;

  tool_config?: JSONObjectInput | null;

  top_k?: number | null;

  top_logprobs?: number | null;

  top_p?: number | null;

  truncation?: 'auto' | 'disabled' | null;

  turn_detection?: JSONObjectInput | null;

  user?: string | null;

  verbosity?: string | null;

  voice?: string | null;

  web_search_options?: JSONObjectInput | null;
}

/**
 * **gpt-5 and o-series models only**
 *
 * Configuration options for
 * [reasoning models](https://platform.openai.com/docs/guides/reasoning).
 */
export interface Reasoning {
  effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | null;

  generate_summary?: 'auto' | 'concise' | 'detailed' | null;

  summary?: 'auto' | 'concise' | 'detailed' | null;

  [k: string]: unknown;
}

/**
 * JSON object response format. An older method of generating JSON responses. Using
 * `json_schema` is recommended for models that support it. Note that the model
 * will not generate JSON without a system or user message instructing it to do so.
 *
 * Fields:
 *
 * - type (required): Literal["json_object"]
 */
export interface ResponseFormatJSONObject {
  /**
   * The type of response format being defined. Always `json_object`.
   */
  type: 'json_object';
}

/**
 * JSON Schema response format. Used to generate structured JSON responses. Learn
 * more about
 * [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs).
 *
 * Fields:
 *
 * - type (required): Literal["json_schema"]
 * - json_schema (required): JSONSchema
 */
export interface ResponseFormatJSONSchema {
  /**
   * Structured Outputs configuration options, including a JSON Schema.
   */
  json_schema: ResponseFormatJSONSchema.JSONSchema;

  /**
   * The type of response format being defined. Always `json_schema`.
   */
  type: 'json_schema';
}

export namespace ResponseFormatJSONSchema {
  /**
   * Structured Outputs configuration options, including a JSON Schema.
   */
  export interface JSONSchema {
    /**
     * The name of the response format. Must be a-z, A-Z, 0-9, or contain underscores
     * and dashes, with a maximum length of 64.
     */
    name: string;

    /**
     * A description of what the response format is for, used by the model to determine
     * how to respond in the format.
     */
    description?: string;

    /**
     * The schema for the response format, described as a JSON Schema object. Learn how
     * to build JSON schemas [here](https://json-schema.org/).
     */
    schema?: { [key: string]: unknown };

    /**
     * Whether to enable strict schema adherence when generating the output. If set to
     * true, the model will always follow the exact schema defined in the `schema`
     * field. Only a subset of JSON Schema is supported when `strict` is `true`. To
     * learn more, read the
     * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
     */
    strict?: boolean | null;
  }
}

/**
 * Default response format. Used to generate text responses.
 *
 * Fields:
 *
 * - type (required): Literal["text"]
 */
export interface ResponseFormatText {
  /**
   * The type of response format being defined. Always `text`.
   */
  type: 'text';
}

export type ToolChoice =
  | 'auto'
  | 'required'
  | 'none'
  | string
  | { [key: string]: unknown }
  | ToolChoice.MCPToolChoice;

export namespace ToolChoice {
  export interface MCPToolChoice {
    name: string;

    server_label: string;
  }
}
