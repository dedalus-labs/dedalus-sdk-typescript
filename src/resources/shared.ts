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

    disable_automatic_function_calling?: boolean;

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

    reasoning?: Settings.Reasoning | null;

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

    tool_choice?:
      | 'auto'
      | 'required'
      | 'none'
      | string
      | { [key: string]: unknown }
      | Settings.MCPToolChoice
      | null;

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

  export namespace Settings {
    export interface Reasoning {
      effort?: 'minimal' | 'low' | 'medium' | 'high' | null;

      generate_summary?: 'auto' | 'concise' | 'detailed' | null;

      summary?: 'auto' | 'concise' | 'detailed' | null;

      [k: string]: unknown;
    }

    export interface MCPToolChoice {
      name: string;

      server_label: string;
    }
  }
}

/**
 * Dedalus model choice - either a string ID or DedalusModel configuration object.
 */
export type DedalusModelChoice = CompletionsAPI.ModelID | DedalusModel;
