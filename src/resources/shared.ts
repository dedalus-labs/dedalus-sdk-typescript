// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as CompletionsAPI from './chat/completions';

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
  settings?: DedalusModel.Settings | null;
}

export namespace DedalusModel {
  /**
   * Optional default generation settings (e.g., temperature, max_tokens) applied
   * when this model is selected.
   */
  export interface Settings {
    attributes?: { [key: string]: unknown };

    audio?: { [key: string]: unknown } | null;

    deferred?: boolean | null;

    extra_args?: { [key: string]: unknown } | null;

    extra_headers?: { [key: string]: string } | null;

    extra_query?: { [key: string]: unknown } | null;

    frequency_penalty?: number | null;

    generation_config?: { [key: string]: unknown } | null;

    include_usage?: boolean | null;

    input_audio_format?: string | null;

    input_audio_transcription?: { [key: string]: unknown } | null;

    logit_bias?: { [key: string]: number } | null;

    logprobs?: boolean | null;

    max_completion_tokens?: number | null;

    max_tokens?: number | null;

    metadata?: { [key: string]: string } | null;

    modalities?: Array<string> | null;

    n?: number | null;

    output_audio_format?: string | null;

    parallel_tool_calls?: boolean | null;

    prediction?: { [key: string]: unknown } | null;

    presence_penalty?: number | null;

    prompt_cache_key?: string | null;

    reasoning?: CompletionsAPI.Reasoning | null;

    reasoning_effort?: string | null;

    response_format?: { [key: string]: unknown } | null;

    response_include?: Array<
      | 'file_search_call.results'
      | 'web_search_call.results'
      | 'web_search_call.action.sources'
      | 'message.input_image.image_url'
      | 'computer_call_output.output.image_url'
      | 'code_interpreter_call.outputs'
      | 'reasoning.encrypted_content'
      | 'message.output_text.logprobs'
    > | null;

    safety_identifier?: string | null;

    safety_settings?: Array<{ [key: string]: unknown }> | null;

    search_parameters?: { [key: string]: unknown } | null;

    seed?: number | null;

    service_tier?: string | null;

    stop?: string | Array<string> | null;

    store?: boolean | null;

    stream?: boolean | null;

    stream_options?: { [key: string]: unknown } | null;

    structured_output?: unknown;

    system_instruction?: { [key: string]: unknown } | null;

    temperature?: number | null;

    thinking?: { [key: string]: unknown } | null;

    timeout?: number | null;

    tool_choice?: CompletionsAPI.ToolChoice | null;

    tool_config?: { [key: string]: unknown } | null;

    top_k?: number | null;

    top_logprobs?: number | null;

    top_p?: number | null;

    truncation?: 'auto' | 'disabled' | null;

    turn_detection?: { [key: string]: unknown } | null;

    use_responses?: boolean;

    user?: string | null;

    verbosity?: string | null;

    voice?: string | null;

    web_search_options?: { [key: string]: unknown } | null;
  }
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
