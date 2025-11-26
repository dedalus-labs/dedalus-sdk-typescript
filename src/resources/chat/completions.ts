// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { Stream } from '../../core/streaming';
import { RequestOptions } from '../../internal/request-options';
import {
  maybeParseChatCompletion,
  parseChatCompletion,
  validateInputTools,
  type ExtractParsedContentFromParams,
  type ParsedChatCompletion as _ParsedChatCompletion,
  type ParsedChoice as _ParsedChoice,
  type ParsedMessage as _ParsedMessage,
  type ParsedFunctionToolCall,
} from '../../lib/parser';

export class Completions extends APIResource {
  /**
   * Create a chat completion.
   *
   * Generates a model response for the given conversation and configuration.
   * Supports OpenAI-compatible parameters and provider-specific extensions.
   *
   * Headers:
   *
   * - Authorization: bearer key for the calling account.
   * - Optional BYOK or provider headers if applicable.
   *
   * Behavior:
   *
   * - If multiple models are supplied, the first one is used, and the agent may hand
   *   off to another model.
   * - Tools may be invoked on the server or signaled for the client to run.
   * - Streaming responses emit incremental deltas; non-streaming returns a single
   *   object.
   * - Usage metrics are computed when available and returned in the response.
   *
   * Responses:
   *
   * - 200 OK: JSON completion object with choices, message content, and usage.
   * - 400 Bad Request: validation error.
   * - 401 Unauthorized: authentication failed.
   * - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit
   *   issue.
   * - 500 Internal Server Error: unexpected failure.
   *
   * Billing:
   *
   * - Token usage metered by the selected model(s).
   * - Tool calls and MCP sessions may be billed separately.
   * - Streaming is settled after the stream ends via an async task.
   *
   * Example (non-streaming HTTP): POST /v1/chat/completions Content-Type:
   * application/json Authorization: Bearer <key>
   *
   * { "model": "provider/model-name", "messages": [{"role": "user", "content":
   * "Hello"}] }
   *
   * 200 OK { "id": "cmpl_123", "object": "chat.completion", "choices": [ {"index":
   * 0, "message": {"role": "assistant", "content": "Hi there!"}, "finish_reason":
   * "stop"} ], "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens":
   * 7} }
   *
   * Example (streaming over SSE): POST /v1/chat/completions Accept:
   * text/event-stream
   *
   * data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":"Hi"}}]} data:
   * {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":" there!"}}]} data:
   * [DONE]
   *
   * @example
   * ```ts
   * const completion = await client.chat.completions.create({
   *   model: 'openai/gpt-5',
   * });
   * ```
   */
  create(body: CompletionCreateParamsNonStreaming, options?: RequestOptions): APIPromise<Completion>;
  create(body: CompletionCreateParamsStreaming, options?: RequestOptions): APIPromise<Stream<StreamChunk>>;
  create(
    body: CompletionCreateParamsBase,
    options?: RequestOptions,
  ): APIPromise<Stream<StreamChunk> | Completion>;
  create(
    body: CompletionCreateParams,
    options?: RequestOptions,
  ): APIPromise<Completion> | APIPromise<Stream<StreamChunk>> {
    const isStreaming = body.stream ?? false;

    if (!isStreaming) {
      return this._client
        .post<Completion>('/v1/chat/completions', { body, ...options, stream: false })
        .then((completion) => maybeParseChatCompletion(completion, body as any)) as APIPromise<Completion>;
    }

    return this._client.post('/v1/chat/completions', { body, ...options, stream: true }) as APIPromise<
      Stream<StreamChunk>
    >;
  }

  parse<Params extends CompletionCreateParams>(
    body: Params,
    options?: RequestOptions,
  ): APIPromise<_ParsedChatCompletion<ExtractParsedContentFromParams<Params>>> {
    if (body.tools) {
      validateInputTools(body.tools);
    }

    return this._client
      .post<Completion>('/v1/chat/completions', { body, ...options, stream: false })
      .then((completion) => parseChatCompletion(completion, body)) as APIPromise<
      _ParsedChatCompletion<ExtractParsedContentFromParams<Params>>
    >;
  }
}

/**
 * Token log probability information.
 */
export interface ChatCompletionTokenLogprob {
  /**
   * The token.
   */
  token: string;

  /**
   * A list of integers representing the UTF-8 bytes representation of the token.
   * Useful in instances where characters are represented by multiple tokens and
   * their byte representations must be combined to generate the correct text
   * representation. Can be `null` if there is no bytes representation for the token.
   */
  bytes: Array<number> | null;

  /**
   * The log probability of this token, if it is within the top 20 most likely
   * tokens. Otherwise, the value `-9999.0` is used to signify that the token is very
   * unlikely.
   */
  logprob: number;

  /**
   * List of the most likely tokens and their log probability, at this token
   * position. In rare cases, there may be fewer than the number of requested
   * `top_logprobs` returned.
   */
  top_logprobs: Array<TopLogprob>;
}

/**
 * Chat completion response for Dedalus API.
 *
 * OpenAI-compatible chat completion response with Dedalus extensions. Maintains
 * full compatibility with OpenAI API while providing additional features like
 * server-side tool execution tracking and MCP error reporting.
 */
export interface Completion {
  /**
   * A unique identifier for the chat completion.
   */
  id: string;

  /**
   * A list of chat completion choices. Can be more than one if `n` is greater
   * than 1.
   */
  choices: Array<Completion.Choice>;

  /**
   * The Unix timestamp (in seconds) of when the chat completion was created.
   */
  created: number;

  /**
   * The model used for the chat completion.
   */
  model: string;

  /**
   * The object type, which is always `chat.completion`.
   */
  object: 'chat.completion';

  /**
   * Information about MCP server failures, if any occurred during the request.
   * Contains details about which servers failed and why, along with recommendations
   * for the user. Only present when MCP server failures occurred.
   */
  mcp_server_errors?: { [key: string]: unknown } | null;

  /**
   * Specifies the processing type used for serving the request.
   *
   * - If set to 'auto', then the request will be processed with the service tier
   *   configured in the Project settings. Unless otherwise configured, the Project
   *   will use 'default'.
   * - If set to 'default', then the request will be processed with the standard
   *   pricing and performance for the selected model.
   * - If set to '[flex](https://platform.openai.com/docs/guides/flex-processing)' or
   *   '[priority](https://openai.com/api-priority-processing/)', then the request
   *   will be processed with the corresponding service tier.
   * - When not set, the default behavior is 'auto'.
   *
   * When the `service_tier` parameter is set, the response body will include the
   * `service_tier` value based on the processing mode actually used to serve the
   * request. This response value may be different from the value set in the
   * parameter.
   */
  service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;

  /**
   * This fingerprint represents the backend configuration that the model runs with.
   *
   * Can be used in conjunction with the `seed` request parameter to understand when
   * backend changes have been made that might impact determinism.
   */
  system_fingerprint?: string;

  /**
   * List of tool names that were executed server-side (e.g., MCP tools). Only
   * present when tools were executed on the server rather than returned for
   * client-side execution.
   */
  tools_executed?: Array<string> | null;

  /**
   * Usage statistics for the completion request.
   */
  usage?: Completion.Usage;
}

export namespace Completion {
  /**
   * A chat completion choice.
   *
   * OpenAI-compatible choice object for non-streaming responses. Part of the
   * ChatCompletion response.
   */
  export interface Choice {
    /**
     * The index of the choice in the list of choices.
     */
    index: number;

    /**
     * A chat completion message generated by the model.
     */
    message: Choice.Message;

    /**
     * The reason the model stopped generating tokens. This will be `stop` if the model
     * hit a natural stop point or a provided stop sequence, `length` if the maximum
     * number of tokens specified in the request was reached, `content_filter` if
     * content was omitted due to a flag from our content filters, `tool_calls` if the
     * model called a tool, or `function_call` (deprecated) if the model called a
     * function.
     */
    finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;

    /**
     * Log probability information for the choice.
     */
    logprobs?: Choice.Logprobs | null;
  }

  export namespace Choice {
    /**
     * A chat completion message generated by the model.
     */
    export interface Message {
      /**
       * The contents of the message.
       */
      content: string | null;

      /**
       * The refusal message generated by the model.
       */
      refusal: string | null;

      /**
       * The role of the author of this message.
       */
      role: 'assistant';

      /**
       * Annotations for the message, when applicable, as when using the
       * [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat).
       */
      annotations?: Array<Message.Annotation>;

      /**
       * If the audio output modality is requested, this object contains data
       *
       * about the audio response from the model.
       * [Learn more](https://platform.openai.com/docs/guides/audio).
       *
       * Fields:
       *
       * - id (required): str
       * - expires_at (required): int
       * - data (required): str
       * - transcript (required): str
       */
      audio?: Message.Audio | null;

      /**
       * Deprecated and replaced by `tool_calls`. The name and arguments of a function
       * that should be called, as generated by the model.
       */
      function_call?: Message.FunctionCall;

      /**
       * The tool calls generated by the model, such as function calls.
       */
      tool_calls?: Array<
        Message.ChatCompletionMessageToolCallOutput | Message.ChatCompletionMessageCustomToolCallOutput
      >;
    }

    export namespace Message {
      /**
       * A URL citation when using web search.
       *
       * Fields:
       *
       * - type (required): Literal['url_citation']
       * - url_citation (required): UrlCitation
       */
      export interface Annotation {
        /**
         * The type of the URL citation. Always `url_citation`.
         */
        type: 'url_citation';

        /**
         * A URL citation when using web search.
         */
        url_citation: Annotation.URLCitation;
      }

      export namespace Annotation {
        /**
         * A URL citation when using web search.
         */
        export interface URLCitation {
          /**
           * The index of the last character of the URL citation in the message.
           */
          end_index: number;

          /**
           * The index of the first character of the URL citation in the message.
           */
          start_index: number;

          /**
           * The title of the web resource.
           */
          title: string;

          /**
           * The URL of the web resource.
           */
          url: string;
        }
      }

      /**
       * If the audio output modality is requested, this object contains data
       *
       * about the audio response from the model.
       * [Learn more](https://platform.openai.com/docs/guides/audio).
       *
       * Fields:
       *
       * - id (required): str
       * - expires_at (required): int
       * - data (required): str
       * - transcript (required): str
       */
      export interface Audio {
        /**
         * Unique identifier for this audio response.
         */
        id: string;

        /**
         * Base64 encoded audio bytes generated by the model, in the format specified in
         * the request.
         */
        data: string;

        /**
         * The Unix timestamp (in seconds) for when this audio response will no longer be
         * accessible on the server for use in multi-turn conversations.
         */
        expires_at: number;

        /**
         * Transcript of the audio generated by the model.
         */
        transcript: string;
      }

      /**
       * Deprecated and replaced by `tool_calls`. The name and arguments of a function
       * that should be called, as generated by the model.
       */
      export interface FunctionCall {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string;

        /**
         * The name of the function to call.
         */
        name: string;
      }

      /**
       * A call to a function tool created by the model.
       *
       * Fields:
       *
       * - id (required): str
       * - type (required): Literal['function']
       * - function (required): Function
       */
      export interface ChatCompletionMessageToolCallOutput {
        /**
         * The ID of the tool call.
         */
        id: string;

        /**
         * The function that the model called.
         */
        function: ChatCompletionMessageToolCallOutput.Function;

        /**
         * The type of the tool. Currently, only `function` is supported.
         */
        type: 'function';
      }

      export namespace ChatCompletionMessageToolCallOutput {
        /**
         * The function that the model called.
         */
        export interface Function {
          /**
           * The arguments to call the function with, as generated by the model in JSON
           * format. Note that the model does not always generate valid JSON, and may
           * hallucinate parameters not defined by your function schema. Validate the
           * arguments in your code before calling your function.
           */
          arguments: string;

          /**
           * The name of the function to call.
           */
          name: string;
        }
      }

      /**
       * A call to a custom tool created by the model.
       *
       * Fields:
       *
       * - id (required): str
       * - type (required): Literal['custom']
       * - custom (required): Custom
       */
      export interface ChatCompletionMessageCustomToolCallOutput {
        /**
         * The ID of the tool call.
         */
        id: string;

        /**
         * The custom tool that the model called.
         */
        custom: ChatCompletionMessageCustomToolCallOutput.Custom;

        /**
         * The type of the tool. Always `custom`.
         */
        type: 'custom';
      }

      export namespace ChatCompletionMessageCustomToolCallOutput {
        /**
         * The custom tool that the model called.
         */
        export interface Custom {
          /**
           * The input for the custom tool call generated by the model.
           */
          input: string;

          /**
           * The name of the custom tool to call.
           */
          name: string;
        }
      }
    }

    /**
     * Log probability information for the choice.
     */
    export interface Logprobs {
      /**
       * A list of message content tokens with log probability information.
       */
      content?: Array<CompletionsAPI.ChatCompletionTokenLogprob> | null;

      /**
       * A list of message refusal tokens with log probability information.
       */
      refusal?: Array<CompletionsAPI.ChatCompletionTokenLogprob> | null;
    }
  }

  /**
   * Usage statistics for the completion request.
   */
  export interface Usage {
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number;

    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number;

    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number;

    /**
     * Breakdown of tokens used in a completion.
     */
    completion_tokens_details?: Usage.CompletionTokensDetails;

    /**
     * Breakdown of tokens used in the prompt.
     */
    prompt_tokens_details?: Usage.PromptTokensDetails;
  }

  export namespace Usage {
    /**
     * Breakdown of tokens used in a completion.
     */
    export interface CompletionTokensDetails {
      /**
       * When using Predicted Outputs, the number of tokens in the prediction that
       * appeared in the completion.
       */
      accepted_prediction_tokens?: number;

      /**
       * Audio input tokens generated by the model.
       */
      audio_tokens?: number;

      /**
       * Tokens generated by the model for reasoning.
       */
      reasoning_tokens?: number;

      /**
       * When using Predicted Outputs, the number of tokens in the prediction that did
       * not appear in the completion. However, like reasoning tokens, these tokens are
       * still counted in the total completion tokens for purposes of billing, output,
       * and context window limits.
       */
      rejected_prediction_tokens?: number;
    }

    /**
     * Breakdown of tokens used in the prompt.
     */
    export interface PromptTokensDetails {
      /**
       * Audio input tokens present in the prompt.
       */
      audio_tokens?: number;

      /**
       * Cached tokens present in the prompt.
       */
      cached_tokens?: number;
    }
  }
}

/**
 * ChatCompletion request schema.
 *
 * Supports OpenAI-compatible parameters, provider-specific extensions, server-side
 * execution, and agent orchestration features.
 */
export interface CompletionRequest {
  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-5',
   * 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview', or a
   * DedalusModel instance. Multi-model routing: ['openai/gpt-5',
   * 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview'] or list
   * of DedalusModel objects - agent will choose optimal model based on task
   * complexity.
   */
  model: string | Shared.DedalusModel | Array<Shared.DedalusModelChoice>;

  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when audio output is requested with
   * `modalities: ["audio"]`.
   * [Learn more](https://platform.openai.com/docs/guides/audio).
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * When False, skip server-side tool execution and return raw OpenAI-style
   * tool_calls in the response.
   */
  auto_execute_tools?: boolean;

  /**
   * Optional. The name of the content
   * [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to
   * serve the prediction. Format: `cachedContents/{cachedContent}`
   */
  cachedContent?: string | null;

  /**
   * If set to `true`, the request returns a `request_id`. You can then get the
   * deferred response by GET `/v1/chat/deferred-completion/{request_id}`.
   */
  deferred?: boolean | null;

  /**
   * Google SDK control: disable automatic function calling. Agent workflows handle
   * tools manually.
   */
  disable_automatic_function_calling?: boolean;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of `tool_choice`. Controls which (if any) function is called
   * by the model. `none` means the model will not call a function and instead
   * generates a message. `auto` means the model can pick between generating a
   * message or calling a function. Specifying a particular function via
   * `{"name": "my_function"}` forces the model to call that function. `none` is the
   * default when no functions are present. `auto` is the default if functions are
   * present.
   */
  function_call?: 'auto' | 'none' | null;

  /**
   * Deprecated in favor of `tools`. A list of functions the model may generate JSON
   * inputs for.
   */
  functions?: Array<CompletionRequest.Function> | null;

  /**
   * Generation parameters wrapper (Google-specific)
   */
  generation_config?: { [key: string]: unknown } | null;

  /**
   * Guardrails to apply to the agent for input/output validation and safety checks.
   * Reserved for future use - guardrails configuration format not yet finalized.
   */
  guardrails?: Array<{ [key: string]: unknown }> | null;

  /**
   * Configuration for multi-model handoffs and agent orchestration. Reserved for
   * future use - handoff configuration format not yet finalized.
   */
  handoff_config?: { [key: string]: unknown } | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a
   * JSON object that maps tokens (specified by their token ID in the tokenizer) to
   * an associated bias value from -100 to 100. Mathematically, the bias is added to
   * the logits generated by the model prior to sampling. The exact effect will vary
   * per model, but values between -1 and 1 should decrease or increase likelihood of
   * selection; values like -100 or 100 should result in a ban or exclusive selection
   * of the relevant token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens or not. If true,
   * returns the log probabilities of each output token returned in the `content` of
   * `message`.
   */
  logprobs?: boolean | null;

  /**
   * An upper bound for the number of tokens that can be generated for a completion,
   * including visible output and reasoning tokens.
   */
  max_completion_tokens?: number | null;

  /**
   * Maximum number of tokens the model can generate in the completion. The total
   * token count (input + output) is limited by the model's context window. Setting
   * this prevents unexpectedly long responses and helps control costs. For newer
   * OpenAI models, use max_completion_tokens instead (more precise accounting). For
   * other providers, max_tokens remains the standard parameter name.
   */
  max_tokens?: number | null;

  /**
   * Maximum number of turns for agent execution before terminating (default: 10).
   * Each turn represents one model inference cycle. Higher values allow more complex
   * reasoning but increase cost and latency.
   */
  max_turns?: number | null;

  /**
   * MCP (Model Context Protocol) server addresses to make available for server-side
   * tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs
   * (e.g., 'dedalus-labs/brave-search'), or structured objects specifying
   * slug/version/url. MCP tools are executed server-side and billed separately.
   */
  mcp_servers?: string | Array<string> | null;

  /**
   * Conversation history. Accepts either a list of message objects or a string,
   * which is treated as a single user message. Optional if `input` or `instructions`
   * is provided.
   */
  messages?:
    | Array<
        | CompletionRequest.ChatCompletionRequestDeveloperMessage
        | CompletionRequest.ChatCompletionRequestSystemMessage
        | CompletionRequest.ChatCompletionRequestUserMessage
        | CompletionRequest.ChatCompletionRequestAssistantMessage
        | CompletionRequest.ChatCompletionRequestToolMessage
        | CompletionRequest.ChatCompletionRequestFunctionMessage
      >
    | string
    | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard. Keys are strings with a maximum
   * length of 64 characters. Values are strings with a maximum length of 512
   * characters.
   */
  metadata?: { [key: string]: string } | null;

  /**
   * Output modalities. Most models generate text by default. Use ['text', 'audio']
   * for audio-capable models.
   */
  modalities?: Array<'text' | 'audio'> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Note that
   * you will be charged based on the number of generated tokens across all of the
   * choices. Keep `n` as `1` to minimize costs.
   */
  n?: number | null;

  /**
   * Whether to enable parallel tool calls (Anthropic uses inverted polarity)
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   */
  prediction?: CompletionRequest.Prediction | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache
   * hit rates. Replaces the `user` field.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching).
   */
  prompt_cache_key?: string | null;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended
   * prompt caching, which keeps cached prefixes active for longer, up to a maximum
   * of 24 hours.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).
   */
  prompt_cache_retention?: '24h' | 'in-memory' | null;

  /**
   * Allows toggling between the reasoning mode and no system prompt. When set to
   * `reasoning` the system prompt for reasoning models will be used.
   */
  prompt_mode?: { [key: string]: unknown } | null;

  /**
   * Constrains effort on reasoning for
   * [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
   * supported values are `none`, `minimal`, `low`, `medium`, and `high`. Reducing
   * reasoning effort can result in faster responses and fewer tokens used on
   * reasoning in a response. - `gpt-5.1` defaults to `none`, which does not perform
   * reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`,
   * `medium`, and `high`. Tool calls are supported for all reasoning values in
   * gpt-5.1. - All models before `gpt-5.1` default to `medium` reasoning effort, and
   * do not support `none`. - The `gpt-5-pro` model defaults to (and only supports)
   * `high` reasoning effort.
   */
  reasoning_effort?: 'high' | 'low' | 'medium' | 'minimal' | 'none' | null;

  /**
   * An object specifying the format that the model must output. Setting to
   * `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs
   * which ensures the model will match your supplied JSON schema. Learn more in the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   * Setting to `{ "type": "json_object" }` enables the older JSON mode, which
   * ensures the message the model generates is valid JSON. Using `json_schema` is
   * preferred for models that support it.
   */
  response_format?:
    | Shared.ResponseFormatText
    | Shared.ResponseFormatJSONSchema
    | Shared.ResponseFormatJSONObject
    | null;

  /**
   * Whether to inject a safety prompt before all conversations.
   */
  safe_prompt?: boolean | null;

  /**
   * A stable identifier used to help detect users of your application that may be
   * violating OpenAI's usage policies. The IDs should be a string that uniquely
   * identifies each user. We recommend hashing their username or email address, in
   * order to avoid sending us any identifying information.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  safety_identifier?: string | null;

  /**
   * Safety/content filtering settings (Google-specific)
   */
  safety_settings?: Array<CompletionRequest.SafetySetting> | null;

  /**
   * Set the parameters to be used for searched data. If not set, no data will be
   * acquired by the model.
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * Random seed for deterministic output
   */
  seed?: number | null;

  /**
   * Service tier for request processing
   */
  service_tier?: 'auto' | 'default' | 'flex' | 'priority' | 'scale' | 'standard_only' | null;

  /**
   * Not supported with latest reasoning models 'o3' and 'o4-mini'. Up to 4 sequences
   * where the API will stop generating further tokens; the returned text will not
   * contain the stop sequence.
   */
  stop?: string | Array<string> | null;

  /**
   * Whether or not to store the output of this chat completion request for use in
   * our [model distillation](https://platform.openai.com/docs/guides/distillation)
   * or [evals](https://platform.openai.com/docs/guides/evals) products. Supports
   * text and image inputs. Note: image inputs over 8MB will be dropped.
   */
  store?: boolean | null;

  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: boolean | null;

  /**
   * Options for streaming response. Only set this when you set `stream: true`.
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System-level instructions defining the assistant's behavior, role, and
   * constraints. Sets the context and personality for the entire conversation.
   * Different from user/assistant messages as it provides meta-instructions about
   * how to respond rather than conversation content. OpenAI: Provided as system role
   * message in messages array. Google: Top-level systemInstruction field (adapter
   * extracts from messages). Anthropic: Top-level system parameter (adapter extracts
   * from messages). Accepts both string and structured object formats depending on
   * provider capabilities.
   */
  system_instruction?: { [key: string]: unknown } | string | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic. We generally recommend altering this or top_p but not
   * both.
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic-specific)
   */
  thinking?: CompletionRequest.ThinkingConfigEnabled | CompletionRequest.ThinkingConfigDisabled | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tool and instead generates a message. `auto` means the model can
   * pick between generating a message or calling one or more tools. `required` means
   * the model must call one or more tools. Specifying a particular tool via
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool. `none` is the default when no tools are present. `auto` is the
   * default if tools are present.
   */
  tool_choice?:
    | CompletionRequest.ToolChoiceAuto
    | CompletionRequest.ToolChoiceAny
    | CompletionRequest.ToolChoiceTool
    | CompletionRequest.ToolChoiceNone
    | null;

  /**
   * Tool calling configuration (Google-specific)
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * A list of tools the model may call. You can provide either custom tools or
   * function tools. All providers support tools. Adapters handle translation to
   * provider-specific formats.
   */
  tools?: Array<CompletionRequest.Tool> | null;

  /**
   * Top-k sampling parameter limiting token selection to k most likely candidates.
   * Only considers the top k highest probability tokens at each generation step,
   * setting all other tokens' probabilities to zero. Reduces tail probability mass.
   * Helps prevent selection of highly unlikely tokens, improving output coherence.
   * Supported by Google and Anthropic; not available in OpenAI's API.
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying the number of most likely tokens to
   * return at each token position, each with an associated log probability.
   * `logprobs` must be set to `true` if this parameter is used.
   */
  top_logprobs?: number | null;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered. We
   * generally recommend altering this or temperature but not both.
   */
  top_p?: number | null;

  /**
   * This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use
   * `prompt_cache_key` instead to maintain caching optimizations. A stable
   * identifier for your end-users. Used to boost cache hit rates by better bucketing
   * similar requests and to help OpenAI detect and prevent abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in
   * more concise responses, while higher values will result in more verbose
   * responses. Currently supported values are `low`, `medium`, and `high`.
   */
  verbosity?: 'high' | 'low' | 'medium' | null;

  /**
   * This tool searches the web for relevant results to use in a response. Learn more
   * about the
   * [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat).
   */
  web_search_options?: { [key: string]: unknown } | null;

  [k: string]: unknown;
}

export namespace CompletionRequest {
  /**
   * Fields:
   *
   * - description (optional): str
   * - name (required): str
   * - parameters (optional): FunctionParameters
   */
  export interface Function {
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
    parameters?: { [key: string]: unknown };
  }

  /**
   * Developer-provided instructions that the model should follow, regardless of
   *
   * messages sent by the user. With o1 models and newer, `developer` messages
   * replace the previous `system` messages.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestMessageContentPartText],
   *   Field(json_schema_extra={"title": "Content3"}), MinLen(1)]
   * - role (required): Literal['developer']
   * - name (optional): str
   */
  export interface ChatCompletionRequestDeveloperMessage {
    /**
     * The contents of the developer message.
     */
    content: string | Array<ChatCompletionRequestDeveloperMessage.Content3>;

    /**
     * The role of the messages author, in this case `developer`.
     */
    role: 'developer';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestDeveloperMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content3 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Developer-provided instructions that the model should follow, regardless of
   *
   * messages sent by the user. With o1 models and newer, use `developer` messages
   * for this purpose instead.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestSystemMessageContentPart],
   *   Field(json_schema_extra={"title": "Content4"}), MinLen(1)]
   * - role (required): Literal['system']
   * - name (optional): str
   */
  export interface ChatCompletionRequestSystemMessage {
    /**
     * The contents of the system message.
     */
    content: string | Array<ChatCompletionRequestSystemMessage.Content4>;

    /**
     * The role of the messages author, in this case `system`.
     */
    role: 'system';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestSystemMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content4 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Messages sent by an end user, containing prompts or additional context
   *
   * information.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestUserMessageContentPart],
   *   Field(json_schema_extra={"title": "Content5"}), MinLen(1)]
   * - role (required): Literal['user']
   * - name (optional): str
   */
  export interface ChatCompletionRequestUserMessage {
    /**
     * The contents of the user message.
     */
    content:
      | string
      | Array<
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartText
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartImage
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartAudio
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartFile
        >;

    /**
     * The role of the messages author, in this case `user`.
     */
    role: 'user';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestUserMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface ChatCompletionRequestMessageContentPartText {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }

    /**
     * Learn about [image inputs](https://platform.openai.com/docs/guides/vision).
     *
     * Fields:
     *
     * - type (required): Literal['image_url']
     * - image_url (required): ImageUrl
     */
    export interface ChatCompletionRequestMessageContentPartImage {
      /**
       * Fields:
       *
       * - url (required): AnyUrl
       * - detail (optional): Literal['auto', 'low', 'high']
       */
      image_url: ChatCompletionRequestMessageContentPartImage.ImageURL;

      /**
       * The type of the content part.
       */
      type: 'image_url';
    }

    export namespace ChatCompletionRequestMessageContentPartImage {
      /**
       * Fields:
       *
       * - url (required): AnyUrl
       * - detail (optional): Literal['auto', 'low', 'high']
       */
      export interface ImageURL {
        /**
         * Either a URL of the image or the base64 encoded image data.
         */
        url: string;

        /**
         * Specifies the detail level of the image. Learn more in the
         * [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).
         */
        detail?: 'auto' | 'low' | 'high';
      }
    }

    /**
     * Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - type (required): Literal['input_audio']
     * - input_audio (required): InputAudio82c696db
     */
    export interface ChatCompletionRequestMessageContentPartAudio {
      /**
       * Fields:
       *
       * - data (required): str
       * - format (required): Literal['wav', 'mp3']
       */
      input_audio: ChatCompletionRequestMessageContentPartAudio.InputAudio;

      /**
       * The type of the content part. Always `input_audio`.
       */
      type: 'input_audio';
    }

    export namespace ChatCompletionRequestMessageContentPartAudio {
      /**
       * Fields:
       *
       * - data (required): str
       * - format (required): Literal['wav', 'mp3']
       */
      export interface InputAudio {
        /**
         * Base64 encoded audio data.
         */
        data: string;

        /**
         * The format of the encoded audio data. Currently supports "wav" and "mp3".
         */
        format: 'wav' | 'mp3';
      }
    }

    /**
     * Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text
     * generation.
     *
     * Fields:
     *
     * - type (required): Literal['file']
     * - file (required): File
     */
    export interface ChatCompletionRequestMessageContentPartFile {
      /**
       * Fields:
       *
       * - filename (optional): str
       * - file_data (optional): str
       * - file_id (optional): str
       */
      file: ChatCompletionRequestMessageContentPartFile.File;

      /**
       * The type of the content part. Always `file`.
       */
      type: 'file';
    }

    export namespace ChatCompletionRequestMessageContentPartFile {
      /**
       * Fields:
       *
       * - filename (optional): str
       * - file_data (optional): str
       * - file_id (optional): str
       */
      export interface File {
        /**
         * The base64 encoded file data, used when passing the file to the model as a
         * string.
         */
        file_data?: string;

        /**
         * The ID of an uploaded file to use as input.
         */
        file_id?: string;

        /**
         * The name of the file, used when passing the file to the model as a string.
         */
        filename?: string;
      }
    }
  }

  /**
   * Messages sent by the model in response to user messages.
   *
   * Fields:
   *
   * - content (optional): str |
   *   Annotated[list[ChatCompletionRequestAssistantMessageContentPart],
   *   Field(json_schema_extra={"title": "Content6"}), MinLen(1)] | None
   * - refusal (optional): str | None
   * - role (required): Literal['assistant']
   * - name (optional): str
   * - audio (optional): Audio815cb4c9 | None
   * - tool_calls (optional): ChatCompletionMessageToolCalls
   * - function_call (optional): FunctionCall | None
   */
  export interface ChatCompletionRequestAssistantMessage {
    /**
     * The role of the messages author, in this case `assistant`.
     */
    role: 'assistant';

    /**
     * Data about a previous audio response from the model.
     *
     * [Learn more](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - id (required): str
     */
    audio?: ChatCompletionRequestAssistantMessage.Audio | null;

    /**
     * The contents of the assistant message. Required unless `tool_calls` or
     * `function_call` is specified.
     */
    content?:
      | string
      | Array<
          | ChatCompletionRequestAssistantMessage.ChatCompletionRequestMessageContentPartText
          | ChatCompletionRequestAssistantMessage.ChatCompletionRequestMessageContentPartRefusal
        >
      | null;

    /**
     * Deprecated and replaced by `tool_calls`. The name and arguments of a function
     * that should be called, as generated by the model.
     *
     * Fields:
     *
     * - arguments (required): str
     * - name (required): str
     */
    function_call?: ChatCompletionRequestAssistantMessage.FunctionCall | null;

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;

    /**
     * The refusal message by the assistant.
     */
    refusal?: string | null;

    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: Array<
      | ChatCompletionRequestAssistantMessage.ChatCompletionMessageToolCallInput
      | ChatCompletionRequestAssistantMessage.ChatCompletionMessageCustomToolCallInput
    >;
  }

  export namespace ChatCompletionRequestAssistantMessage {
    /**
     * Data about a previous audio response from the model.
     *
     * [Learn more](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - id (required): str
     */
    export interface Audio {
      /**
       * Unique identifier for a previous audio response from the model.
       */
      id: string;
    }

    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface ChatCompletionRequestMessageContentPartText {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }

    /**
     * Fields:
     *
     * - type (required): Literal['refusal']
     * - refusal (required): str
     */
    export interface ChatCompletionRequestMessageContentPartRefusal {
      /**
       * The refusal message generated by the model.
       */
      refusal: string;

      /**
       * The type of the content part.
       */
      type: 'refusal';
    }

    /**
     * Deprecated and replaced by `tool_calls`. The name and arguments of a function
     * that should be called, as generated by the model.
     *
     * Fields:
     *
     * - arguments (required): str
     * - name (required): str
     */
    export interface FunctionCall {
      /**
       * The arguments to call the function with, as generated by the model in JSON
       * format. Note that the model does not always generate valid JSON, and may
       * hallucinate parameters not defined by your function schema. Validate the
       * arguments in your code before calling your function.
       */
      arguments: string;

      /**
       * The name of the function to call.
       */
      name: string;
    }

    /**
     * A call to a function tool created by the model.
     *
     * Fields:
     *
     * - id (required): str
     * - type (required): Literal['function']
     * - function (required): FunctionD877ee33
     */
    export interface ChatCompletionMessageToolCallInput {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The function that the model called.
       */
      function: ChatCompletionMessageToolCallInput.Function;

      /**
       * The type of the tool. Currently, only `function` is supported.
       */
      type: 'function';
    }

    export namespace ChatCompletionMessageToolCallInput {
      /**
       * The function that the model called.
       */
      export interface Function {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string;

        /**
         * The name of the function to call.
         */
        name: string;
      }
    }

    /**
     * A call to a custom tool created by the model.
     *
     * Fields:
     *
     * - id (required): str
     * - type (required): Literal['custom']
     * - custom (required): Custom314518a6
     */
    export interface ChatCompletionMessageCustomToolCallInput {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The custom tool that the model called.
       */
      custom: ChatCompletionMessageCustomToolCallInput.Custom;

      /**
       * The type of the tool. Always `custom`.
       */
      type: 'custom';
    }

    export namespace ChatCompletionMessageCustomToolCallInput {
      /**
       * The custom tool that the model called.
       */
      export interface Custom {
        /**
         * The input for the custom tool call generated by the model.
         */
        input: string;

        /**
         * The name of the custom tool to call.
         */
        name: string;
      }
    }
  }

  /**
   * Fields:
   *
   * - role (required): Literal['tool']
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestToolMessageContentPart],
   *   Field(json_schema_extra={"title": "Content7"}), MinLen(1)]
   * - tool_call_id (required): str
   */
  export interface ChatCompletionRequestToolMessage {
    /**
     * The contents of the tool message.
     */
    content: string | Array<ChatCompletionRequestToolMessage.Content7>;

    /**
     * The role of the messages author, in this case `tool`.
     */
    role: 'tool';

    /**
     * Tool call that this message is responding to.
     */
    tool_call_id: string;
  }

  export namespace ChatCompletionRequestToolMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content7 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Fields:
   *
   * - role (required): Literal['function']
   * - content (required): str | None
   * - name (required): str
   */
  export interface ChatCompletionRequestFunctionMessage {
    /**
     * The contents of the function message.
     */
    content: string | null;

    /**
     * The name of the function to call.
     */
    name: string;

    /**
     * The role of the messages author, in this case `function`.
     */
    role: 'function';
  }

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   */
  export interface Prediction {
    content: { [key: string]: unknown };

    type?: 'content';
  }

  /**
   * Safety setting, affecting the safety-blocking behavior.
   *
   * Passing a safety setting for a category changes the allowed probability that
   * content is blocked.
   *
   * Fields:
   *
   * - category (required): Literal['HARM_CATEGORY_UNSPECIFIED',
   *   'HARM_CATEGORY_DEROGATORY', 'HARM_CATEGORY_TOXICITY',
   *   'HARM_CATEGORY_VIOLENCE', 'HARM_CATEGORY_SEXUAL', 'HARM_CATEGORY_MEDICAL',
   *   'HARM_CATEGORY_DANGEROUS', 'HARM_CATEGORY_HARASSMENT',
   *   'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
   *   'HARM_CATEGORY_DANGEROUS_CONTENT', 'HARM_CATEGORY_CIVIC_INTEGRITY']
   * - threshold (required): Literal['HARM_BLOCK_THRESHOLD_UNSPECIFIED',
   *   'BLOCK_LOW_AND_ABOVE', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_ONLY_HIGH',
   *   'BLOCK_NONE', 'OFF']
   */
  export interface SafetySetting {
    /**
     * Required. The category for this setting.
     */
    category:
      | 'HARM_CATEGORY_UNSPECIFIED'
      | 'HARM_CATEGORY_DEROGATORY'
      | 'HARM_CATEGORY_TOXICITY'
      | 'HARM_CATEGORY_VIOLENCE'
      | 'HARM_CATEGORY_SEXUAL'
      | 'HARM_CATEGORY_MEDICAL'
      | 'HARM_CATEGORY_DANGEROUS'
      | 'HARM_CATEGORY_HARASSMENT'
      | 'HARM_CATEGORY_HATE_SPEECH'
      | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
      | 'HARM_CATEGORY_DANGEROUS_CONTENT'
      | 'HARM_CATEGORY_CIVIC_INTEGRITY';

    /**
     * Required. Controls the probability threshold at which harm is blocked.
     */
    threshold:
      | 'HARM_BLOCK_THRESHOLD_UNSPECIFIED'
      | 'BLOCK_LOW_AND_ABOVE'
      | 'BLOCK_MEDIUM_AND_ABOVE'
      | 'BLOCK_ONLY_HIGH'
      | 'BLOCK_NONE'
      | 'OFF';
  }

  export interface ThinkingConfigEnabled {
    budget_tokens: number;

    type?: 'enabled';
  }

  export interface ThinkingConfigDisabled {
    type?: 'disabled';
  }

  /**
   * The model will automatically decide whether to use tools.
   */
  export interface ToolChoiceAuto {
    disable_parallel_tool_use?: boolean | null;

    type?: 'auto';
  }

  /**
   * The model will use any available tools.
   */
  export interface ToolChoiceAny {
    disable_parallel_tool_use?: boolean | null;

    type?: 'any';
  }

  /**
   * The model will use the specified tool with `tool_choice.name`.
   */
  export interface ToolChoiceTool {
    name: string;

    disable_parallel_tool_use?: boolean | null;

    type?: 'tool';
  }

  /**
   * The model will not be allowed to use tools.
   */
  export interface ToolChoiceNone {
    type?: 'none';
  }

  /**
   * A function tool that can be used to generate a response.
   *
   * Fields:
   *
   * - type (required): Literal['function']
   * - function (required): FunctionObject
   */
  export interface Tool {
    /**
     * Fields:
     *
     * - description (optional): str
     * - name (required): str
     * - parameters (optional): FunctionParameters
     * - strict (optional): bool | None
     */
    function: Tool.Function;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
  }

  export namespace Tool {
    /**
     * Fields:
     *
     * - description (optional): str
     * - name (required): str
     * - parameters (optional): FunctionParameters
     * - strict (optional): bool | None
     */
    export interface Function {
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
      parameters?: { [key: string]: unknown };

      /**
       * Whether to enable strict schema adherence when generating the function call. If
       * set to true, the model will follow the exact schema defined in the `parameters`
       * field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn
       * more about Structured Outputs in the
       * [function calling guide](https://platform.openai.com/docs/guides/function-calling).
       */
      strict?: boolean | null;
    }
  }
}

/**
 * Server-Sent Event streaming format for chat completions
 */
export interface StreamChunk {
  /**
   * Unique identifier for the chat completion
   */
  id: string;

  /**
   * List of completion choice chunks
   */
  choices: Array<StreamChunk.Choice>;

  /**
   * Unix timestamp when the chunk was created
   */
  created: number;

  /**
   * ID of the model used for the completion
   */
  model: string;

  /**
   * Object type, always 'chat.completion.chunk'
   */
  object?: 'chat.completion.chunk';

  /**
   * Service tier used for processing the request
   */
  service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;

  /**
   * System fingerprint representing backend configuration
   */
  system_fingerprint?: string | null;

  /**
   * Usage statistics for the completion request.
   *
   * Fields:
   *
   * - completion_tokens (required): int
   * - prompt_tokens (required): int
   * - total_tokens (required): int
   * - completion_tokens_details (optional): CompletionTokensDetails
   * - prompt_tokens_details (optional): PromptTokensDetails
   */
  usage?: StreamChunk.Usage | null;
}

export namespace StreamChunk {
  /**
   * A streaming chat completion choice chunk.
   *
   * OpenAI-compatible choice object for streaming responses. Part of the
   * ChatCompletionChunk response in SSE streams.
   */
  export interface Choice {
    /**
     * Delta content for streaming responses
     */
    delta: Choice.Delta;

    /**
     * The index of this choice in the list of choices
     */
    index: number;

    /**
     * The reason the model stopped (only in final chunk)
     */
    finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;

    /**
     * Log probability information for the choice.
     */
    logprobs?: Choice.Logprobs | null;
  }

  export namespace Choice {
    /**
     * Delta content for streaming responses
     */
    export interface Delta {
      content?: string | null;

      function_call?: Delta.FunctionCall | null;

      refusal?: string | null;

      role?: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | null;

      tool_calls?: Array<Delta.ToolCall> | null;

      [k: string]: unknown;
    }

    export namespace Delta {
      export interface FunctionCall {
        arguments?: string | null;

        name?: string | null;

        [k: string]: unknown;
      }

      export interface ToolCall {
        index: number;

        id?: string | null;

        function?: ToolCall.Function | null;

        type?: 'function' | null;

        [k: string]: unknown;
      }

      export namespace ToolCall {
        export interface Function {
          arguments?: string | null;

          name?: string | null;

          [k: string]: unknown;
        }
      }
    }

    /**
     * Log probability information for the choice.
     */
    export interface Logprobs {
      /**
       * A list of message content tokens with log probability information.
       */
      content?: Array<CompletionsAPI.ChatCompletionTokenLogprob> | null;

      /**
       * A list of message refusal tokens with log probability information.
       */
      refusal?: Array<CompletionsAPI.ChatCompletionTokenLogprob> | null;
    }
  }

  /**
   * Usage statistics for the completion request.
   *
   * Fields:
   *
   * - completion_tokens (required): int
   * - prompt_tokens (required): int
   * - total_tokens (required): int
   * - completion_tokens_details (optional): CompletionTokensDetails
   * - prompt_tokens_details (optional): PromptTokensDetails
   */
  export interface Usage {
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number;

    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number;

    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number;

    /**
     * Breakdown of tokens used in a completion.
     */
    completion_tokens_details?: Usage.CompletionTokensDetails;

    /**
     * Breakdown of tokens used in the prompt.
     */
    prompt_tokens_details?: Usage.PromptTokensDetails;
  }

  export namespace Usage {
    /**
     * Breakdown of tokens used in a completion.
     */
    export interface CompletionTokensDetails {
      /**
       * When using Predicted Outputs, the number of tokens in the prediction that
       * appeared in the completion.
       */
      accepted_prediction_tokens?: number;

      /**
       * Audio input tokens generated by the model.
       */
      audio_tokens?: number;

      /**
       * Tokens generated by the model for reasoning.
       */
      reasoning_tokens?: number;

      /**
       * When using Predicted Outputs, the number of tokens in the prediction that did
       * not appear in the completion. However, like reasoning tokens, these tokens are
       * still counted in the total completion tokens for purposes of billing, output,
       * and context window limits.
       */
      rejected_prediction_tokens?: number;
    }

    /**
     * Breakdown of tokens used in the prompt.
     */
    export interface PromptTokensDetails {
      /**
       * Audio input tokens present in the prompt.
       */
      audio_tokens?: number;

      /**
       * Cached tokens present in the prompt.
       */
      cached_tokens?: number;
    }
  }
}

/**
 * Token and its log probability.
 */
export interface TopLogprob {
  /**
   * The token.
   */
  token: string;

  /**
   * A list of integers representing the UTF-8 bytes representation of the token.
   * Useful in instances where characters are represented by multiple tokens and
   * their byte representations must be combined to generate the correct text
   * representation. Can be `null` if there is no bytes representation for the token.
   */
  bytes: Array<number> | null;

  /**
   * The log probability of this token, if it is within the top 20 most likely
   * tokens. Otherwise, the value `-9999.0` is used to signify that the token is very
   * unlikely.
   */
  logprob: number;
}

export type CompletionCreateParams = CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming;

export interface CompletionCreateParamsBase {
  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-5',
   * 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview', or a
   * DedalusModel instance. Multi-model routing: ['openai/gpt-5',
   * 'anthropic/claude-sonnet-4-5-20250929', 'google/gemini-3-pro-preview'] or list
   * of DedalusModel objects - agent will choose optimal model based on task
   * complexity.
   */
  model: string | Shared.DedalusModel | Array<Shared.DedalusModelChoice>;

  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when audio output is requested with
   * `modalities: ["audio"]`.
   * [Learn more](https://platform.openai.com/docs/guides/audio).
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * When False, skip server-side tool execution and return raw OpenAI-style
   * tool_calls in the response.
   */
  auto_execute_tools?: boolean;

  /**
   * Optional. The name of the content
   * [cached](https://ai.google.dev/gemini-api/docs/caching) to use as context to
   * serve the prediction. Format: `cachedContents/{cachedContent}`
   */
  cachedContent?: string | null;

  /**
   * If set to `true`, the request returns a `request_id`. You can then get the
   * deferred response by GET `/v1/chat/deferred-completion/{request_id}`.
   */
  deferred?: boolean | null;

  /**
   * Google SDK control: disable automatic function calling. Agent workflows handle
   * tools manually.
   */
  disable_automatic_function_calling?: boolean;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of `tool_choice`. Controls which (if any) function is called
   * by the model. `none` means the model will not call a function and instead
   * generates a message. `auto` means the model can pick between generating a
   * message or calling a function. Specifying a particular function via
   * `{"name": "my_function"}` forces the model to call that function. `none` is the
   * default when no functions are present. `auto` is the default if functions are
   * present.
   */
  function_call?: 'auto' | 'none' | null;

  /**
   * Deprecated in favor of `tools`. A list of functions the model may generate JSON
   * inputs for.
   */
  functions?: Array<CompletionCreateParams.Function> | null;

  /**
   * Generation parameters wrapper (Google-specific)
   */
  generation_config?: { [key: string]: unknown } | null;

  /**
   * Guardrails to apply to the agent for input/output validation and safety checks.
   * Reserved for future use - guardrails configuration format not yet finalized.
   */
  guardrails?: Array<{ [key: string]: unknown }> | null;

  /**
   * Configuration for multi-model handoffs and agent orchestration. Reserved for
   * future use - handoff configuration format not yet finalized.
   */
  handoff_config?: { [key: string]: unknown } | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a
   * JSON object that maps tokens (specified by their token ID in the tokenizer) to
   * an associated bias value from -100 to 100. Mathematically, the bias is added to
   * the logits generated by the model prior to sampling. The exact effect will vary
   * per model, but values between -1 and 1 should decrease or increase likelihood of
   * selection; values like -100 or 100 should result in a ban or exclusive selection
   * of the relevant token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens or not. If true,
   * returns the log probabilities of each output token returned in the `content` of
   * `message`.
   */
  logprobs?: boolean | null;

  /**
   * An upper bound for the number of tokens that can be generated for a completion,
   * including visible output and reasoning tokens.
   */
  max_completion_tokens?: number | null;

  /**
   * Maximum number of tokens the model can generate in the completion. The total
   * token count (input + output) is limited by the model's context window. Setting
   * this prevents unexpectedly long responses and helps control costs. For newer
   * OpenAI models, use max_completion_tokens instead (more precise accounting). For
   * other providers, max_tokens remains the standard parameter name.
   */
  max_tokens?: number | null;

  /**
   * Maximum number of turns for agent execution before terminating (default: 10).
   * Each turn represents one model inference cycle. Higher values allow more complex
   * reasoning but increase cost and latency.
   */
  max_turns?: number | null;

  /**
   * MCP (Model Context Protocol) server addresses to make available for server-side
   * tool execution. Entries can be URLs (e.g., 'https://mcp.example.com'), slugs
   * (e.g., 'dedalus-labs/brave-search'), or structured objects specifying
   * slug/version/url. MCP tools are executed server-side and billed separately.
   */
  mcp_servers?: string | Array<string> | null;

  /**
   * Conversation history. Accepts either a list of message objects or a string,
   * which is treated as a single user message. Optional if `input` or `instructions`
   * is provided.
   */
  messages?:
    | Array<
        | CompletionCreateParams.ChatCompletionRequestDeveloperMessage
        | CompletionCreateParams.ChatCompletionRequestSystemMessage
        | CompletionCreateParams.ChatCompletionRequestUserMessage
        | CompletionCreateParams.ChatCompletionRequestAssistantMessage
        | CompletionCreateParams.ChatCompletionRequestToolMessage
        | CompletionCreateParams.ChatCompletionRequestFunctionMessage
      >
    | string
    | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be useful
   * for storing additional information about the object in a structured format, and
   * querying for objects via API or the dashboard. Keys are strings with a maximum
   * length of 64 characters. Values are strings with a maximum length of 512
   * characters.
   */
  metadata?: { [key: string]: string } | null;

  /**
   * Output modalities. Most models generate text by default. Use ['text', 'audio']
   * for audio-capable models.
   */
  modalities?: Array<'text' | 'audio'> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Note that
   * you will be charged based on the number of generated tokens across all of the
   * choices. Keep `n` as `1` to minimize costs.
   */
  n?: number | null;

  /**
   * Whether to enable parallel tool calls (Anthropic uses inverted polarity)
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   */
  prediction?: CompletionCreateParams.Prediction | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache
   * hit rates. Replaces the `user` field.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching).
   */
  prompt_cache_key?: string | null;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended
   * prompt caching, which keeps cached prefixes active for longer, up to a maximum
   * of 24 hours.
   * [Learn more](https://platform.openai.com/docs/guides/prompt-caching#prompt-cache-retention).
   */
  prompt_cache_retention?: '24h' | 'in-memory' | null;

  /**
   * Allows toggling between the reasoning mode and no system prompt. When set to
   * `reasoning` the system prompt for reasoning models will be used.
   */
  prompt_mode?: { [key: string]: unknown } | null;

  /**
   * Constrains effort on reasoning for
   * [reasoning models](https://platform.openai.com/docs/guides/reasoning). Currently
   * supported values are `none`, `minimal`, `low`, `medium`, and `high`. Reducing
   * reasoning effort can result in faster responses and fewer tokens used on
   * reasoning in a response. - `gpt-5.1` defaults to `none`, which does not perform
   * reasoning. The supported reasoning values for `gpt-5.1` are `none`, `low`,
   * `medium`, and `high`. Tool calls are supported for all reasoning values in
   * gpt-5.1. - All models before `gpt-5.1` default to `medium` reasoning effort, and
   * do not support `none`. - The `gpt-5-pro` model defaults to (and only supports)
   * `high` reasoning effort.
   */
  reasoning_effort?: 'high' | 'low' | 'medium' | 'minimal' | 'none' | null;

  /**
   * An object specifying the format that the model must output. Setting to
   * `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs
   * which ensures the model will match your supplied JSON schema. Learn more in the
   * [Structured Outputs guide](https://platform.openai.com/docs/guides/structured-outputs).
   * Setting to `{ "type": "json_object" }` enables the older JSON mode, which
   * ensures the message the model generates is valid JSON. Using `json_schema` is
   * preferred for models that support it.
   */
  response_format?:
    | Shared.ResponseFormatText
    | Shared.ResponseFormatJSONSchema
    | Shared.ResponseFormatJSONObject
    | null;

  /**
   * Whether to inject a safety prompt before all conversations.
   */
  safe_prompt?: boolean | null;

  /**
   * A stable identifier used to help detect users of your application that may be
   * violating OpenAI's usage policies. The IDs should be a string that uniquely
   * identifies each user. We recommend hashing their username or email address, in
   * order to avoid sending us any identifying information.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  safety_identifier?: string | null;

  /**
   * Safety/content filtering settings (Google-specific)
   */
  safety_settings?: Array<CompletionCreateParams.SafetySetting> | null;

  /**
   * Set the parameters to be used for searched data. If not set, no data will be
   * acquired by the model.
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * Random seed for deterministic output
   */
  seed?: number | null;

  /**
   * Service tier for request processing
   */
  service_tier?: 'auto' | 'default' | 'flex' | 'priority' | 'scale' | 'standard_only' | null;

  /**
   * Not supported with latest reasoning models 'o3' and 'o4-mini'. Up to 4 sequences
   * where the API will stop generating further tokens; the returned text will not
   * contain the stop sequence.
   */
  stop?: string | Array<string> | null;

  /**
   * Whether or not to store the output of this chat completion request for use in
   * our [model distillation](https://platform.openai.com/docs/guides/distillation)
   * or [evals](https://platform.openai.com/docs/guides/evals) products. Supports
   * text and image inputs. Note: image inputs over 8MB will be dropped.
   */
  store?: boolean | null;

  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: boolean | null;

  /**
   * Options for streaming response. Only set this when you set `stream: true`.
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System-level instructions defining the assistant's behavior, role, and
   * constraints. Sets the context and personality for the entire conversation.
   * Different from user/assistant messages as it provides meta-instructions about
   * how to respond rather than conversation content. OpenAI: Provided as system role
   * message in messages array. Google: Top-level systemInstruction field (adapter
   * extracts from messages). Anthropic: Top-level system parameter (adapter extracts
   * from messages). Accepts both string and structured object formats depending on
   * provider capabilities.
   */
  system_instruction?: { [key: string]: unknown } | string | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
   * make the output more random, while lower values like 0.2 will make it more
   * focused and deterministic. We generally recommend altering this or top_p but not
   * both.
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic-specific)
   */
  thinking?:
    | CompletionCreateParams.ThinkingConfigEnabled
    | CompletionCreateParams.ThinkingConfigDisabled
    | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tool and instead generates a message. `auto` means the model can
   * pick between generating a message or calling one or more tools. `required` means
   * the model must call one or more tools. Specifying a particular tool via
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool. `none` is the default when no tools are present. `auto` is the
   * default if tools are present.
   */
  tool_choice?:
    | CompletionCreateParams.ToolChoiceAuto
    | CompletionCreateParams.ToolChoiceAny
    | CompletionCreateParams.ToolChoiceTool
    | CompletionCreateParams.ToolChoiceNone
    | null;

  /**
   * Tool calling configuration (Google-specific)
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * A list of tools the model may call. You can provide either custom tools or
   * function tools. All providers support tools. Adapters handle translation to
   * provider-specific formats.
   */
  tools?: Array<CompletionCreateParams.Tool> | null;

  /**
   * Top-k sampling parameter limiting token selection to k most likely candidates.
   * Only considers the top k highest probability tokens at each generation step,
   * setting all other tokens' probabilities to zero. Reduces tail probability mass.
   * Helps prevent selection of highly unlikely tokens, improving output coherence.
   * Supported by Google and Anthropic; not available in OpenAI's API.
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying the number of most likely tokens to
   * return at each token position, each with an associated log probability.
   * `logprobs` must be set to `true` if this parameter is used.
   */
  top_logprobs?: number | null;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered. We
   * generally recommend altering this or temperature but not both.
   */
  top_p?: number | null;

  /**
   * This field is being replaced by `safety_identifier` and `prompt_cache_key`. Use
   * `prompt_cache_key` instead to maintain caching optimizations. A stable
   * identifier for your end-users. Used to boost cache hit rates by better bucketing
   * similar requests and to help OpenAI detect and prevent abuse.
   * [Learn more](https://platform.openai.com/docs/guides/safety-best-practices#safety-identifiers).
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in
   * more concise responses, while higher values will result in more verbose
   * responses. Currently supported values are `low`, `medium`, and `high`.
   */
  verbosity?: 'high' | 'low' | 'medium' | null;

  /**
   * This tool searches the web for relevant results to use in a response. Learn more
   * about the
   * [web search tool](https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat).
   */
  web_search_options?: { [key: string]: unknown } | null;

  [k: string]: unknown;
}

export namespace CompletionCreateParams {
  /**
   * Fields:
   *
   * - description (optional): str
   * - name (required): str
   * - parameters (optional): FunctionParameters
   */
  export interface Function {
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
    parameters?: { [key: string]: unknown };
  }

  /**
   * Developer-provided instructions that the model should follow, regardless of
   *
   * messages sent by the user. With o1 models and newer, `developer` messages
   * replace the previous `system` messages.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestMessageContentPartText],
   *   Field(json_schema_extra={"title": "Content3"}), MinLen(1)]
   * - role (required): Literal['developer']
   * - name (optional): str
   */
  export interface ChatCompletionRequestDeveloperMessage {
    /**
     * The contents of the developer message.
     */
    content: string | Array<ChatCompletionRequestDeveloperMessage.Content3>;

    /**
     * The role of the messages author, in this case `developer`.
     */
    role: 'developer';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestDeveloperMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content3 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Developer-provided instructions that the model should follow, regardless of
   *
   * messages sent by the user. With o1 models and newer, use `developer` messages
   * for this purpose instead.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestSystemMessageContentPart],
   *   Field(json_schema_extra={"title": "Content4"}), MinLen(1)]
   * - role (required): Literal['system']
   * - name (optional): str
   */
  export interface ChatCompletionRequestSystemMessage {
    /**
     * The contents of the system message.
     */
    content: string | Array<ChatCompletionRequestSystemMessage.Content4>;

    /**
     * The role of the messages author, in this case `system`.
     */
    role: 'system';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestSystemMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content4 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Messages sent by an end user, containing prompts or additional context
   *
   * information.
   *
   * Fields:
   *
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestUserMessageContentPart],
   *   Field(json_schema_extra={"title": "Content5"}), MinLen(1)]
   * - role (required): Literal['user']
   * - name (optional): str
   */
  export interface ChatCompletionRequestUserMessage {
    /**
     * The contents of the user message.
     */
    content:
      | string
      | Array<
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartText
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartImage
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartAudio
          | ChatCompletionRequestUserMessage.ChatCompletionRequestMessageContentPartFile
        >;

    /**
     * The role of the messages author, in this case `user`.
     */
    role: 'user';

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;
  }

  export namespace ChatCompletionRequestUserMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface ChatCompletionRequestMessageContentPartText {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }

    /**
     * Learn about [image inputs](https://platform.openai.com/docs/guides/vision).
     *
     * Fields:
     *
     * - type (required): Literal['image_url']
     * - image_url (required): ImageUrl
     */
    export interface ChatCompletionRequestMessageContentPartImage {
      /**
       * Fields:
       *
       * - url (required): AnyUrl
       * - detail (optional): Literal['auto', 'low', 'high']
       */
      image_url: ChatCompletionRequestMessageContentPartImage.ImageURL;

      /**
       * The type of the content part.
       */
      type: 'image_url';
    }

    export namespace ChatCompletionRequestMessageContentPartImage {
      /**
       * Fields:
       *
       * - url (required): AnyUrl
       * - detail (optional): Literal['auto', 'low', 'high']
       */
      export interface ImageURL {
        /**
         * Either a URL of the image or the base64 encoded image data.
         */
        url: string;

        /**
         * Specifies the detail level of the image. Learn more in the
         * [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).
         */
        detail?: 'auto' | 'low' | 'high';
      }
    }

    /**
     * Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - type (required): Literal['input_audio']
     * - input_audio (required): InputAudio82c696db
     */
    export interface ChatCompletionRequestMessageContentPartAudio {
      /**
       * Fields:
       *
       * - data (required): str
       * - format (required): Literal['wav', 'mp3']
       */
      input_audio: ChatCompletionRequestMessageContentPartAudio.InputAudio;

      /**
       * The type of the content part. Always `input_audio`.
       */
      type: 'input_audio';
    }

    export namespace ChatCompletionRequestMessageContentPartAudio {
      /**
       * Fields:
       *
       * - data (required): str
       * - format (required): Literal['wav', 'mp3']
       */
      export interface InputAudio {
        /**
         * Base64 encoded audio data.
         */
        data: string;

        /**
         * The format of the encoded audio data. Currently supports "wav" and "mp3".
         */
        format: 'wav' | 'mp3';
      }
    }

    /**
     * Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text
     * generation.
     *
     * Fields:
     *
     * - type (required): Literal['file']
     * - file (required): File
     */
    export interface ChatCompletionRequestMessageContentPartFile {
      /**
       * Fields:
       *
       * - filename (optional): str
       * - file_data (optional): str
       * - file_id (optional): str
       */
      file: ChatCompletionRequestMessageContentPartFile.File;

      /**
       * The type of the content part. Always `file`.
       */
      type: 'file';
    }

    export namespace ChatCompletionRequestMessageContentPartFile {
      /**
       * Fields:
       *
       * - filename (optional): str
       * - file_data (optional): str
       * - file_id (optional): str
       */
      export interface File {
        /**
         * The base64 encoded file data, used when passing the file to the model as a
         * string.
         */
        file_data?: string;

        /**
         * The ID of an uploaded file to use as input.
         */
        file_id?: string;

        /**
         * The name of the file, used when passing the file to the model as a string.
         */
        filename?: string;
      }
    }
  }

  /**
   * Messages sent by the model in response to user messages.
   *
   * Fields:
   *
   * - content (optional): str |
   *   Annotated[list[ChatCompletionRequestAssistantMessageContentPart],
   *   Field(json_schema_extra={"title": "Content6"}), MinLen(1)] | None
   * - refusal (optional): str | None
   * - role (required): Literal['assistant']
   * - name (optional): str
   * - audio (optional): Audio815cb4c9 | None
   * - tool_calls (optional): ChatCompletionMessageToolCalls
   * - function_call (optional): FunctionCall | None
   */
  export interface ChatCompletionRequestAssistantMessage {
    /**
     * The role of the messages author, in this case `assistant`.
     */
    role: 'assistant';

    /**
     * Data about a previous audio response from the model.
     *
     * [Learn more](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - id (required): str
     */
    audio?: ChatCompletionRequestAssistantMessage.Audio | null;

    /**
     * The contents of the assistant message. Required unless `tool_calls` or
     * `function_call` is specified.
     */
    content?:
      | string
      | Array<
          | ChatCompletionRequestAssistantMessage.ChatCompletionRequestMessageContentPartText
          | ChatCompletionRequestAssistantMessage.ChatCompletionRequestMessageContentPartRefusal
        >
      | null;

    /**
     * Deprecated and replaced by `tool_calls`. The name and arguments of a function
     * that should be called, as generated by the model.
     *
     * Fields:
     *
     * - arguments (required): str
     * - name (required): str
     */
    function_call?: ChatCompletionRequestAssistantMessage.FunctionCall | null;

    /**
     * An optional name for the participant. Provides the model information to
     * differentiate between participants of the same role.
     */
    name?: string;

    /**
     * The refusal message by the assistant.
     */
    refusal?: string | null;

    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: Array<
      | ChatCompletionRequestAssistantMessage.ChatCompletionMessageToolCallInput
      | ChatCompletionRequestAssistantMessage.ChatCompletionMessageCustomToolCallInput
    >;
  }

  export namespace ChatCompletionRequestAssistantMessage {
    /**
     * Data about a previous audio response from the model.
     *
     * [Learn more](https://platform.openai.com/docs/guides/audio).
     *
     * Fields:
     *
     * - id (required): str
     */
    export interface Audio {
      /**
       * Unique identifier for a previous audio response from the model.
       */
      id: string;
    }

    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface ChatCompletionRequestMessageContentPartText {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }

    /**
     * Fields:
     *
     * - type (required): Literal['refusal']
     * - refusal (required): str
     */
    export interface ChatCompletionRequestMessageContentPartRefusal {
      /**
       * The refusal message generated by the model.
       */
      refusal: string;

      /**
       * The type of the content part.
       */
      type: 'refusal';
    }

    /**
     * Deprecated and replaced by `tool_calls`. The name and arguments of a function
     * that should be called, as generated by the model.
     *
     * Fields:
     *
     * - arguments (required): str
     * - name (required): str
     */
    export interface FunctionCall {
      /**
       * The arguments to call the function with, as generated by the model in JSON
       * format. Note that the model does not always generate valid JSON, and may
       * hallucinate parameters not defined by your function schema. Validate the
       * arguments in your code before calling your function.
       */
      arguments: string;

      /**
       * The name of the function to call.
       */
      name: string;
    }

    /**
     * A call to a function tool created by the model.
     *
     * Fields:
     *
     * - id (required): str
     * - type (required): Literal['function']
     * - function (required): FunctionD877ee33
     */
    export interface ChatCompletionMessageToolCallInput {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The function that the model called.
       */
      function: ChatCompletionMessageToolCallInput.Function;

      /**
       * The type of the tool. Currently, only `function` is supported.
       */
      type: 'function';
    }

    export namespace ChatCompletionMessageToolCallInput {
      /**
       * The function that the model called.
       */
      export interface Function {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string;

        /**
         * The name of the function to call.
         */
        name: string;
      }
    }

    /**
     * A call to a custom tool created by the model.
     *
     * Fields:
     *
     * - id (required): str
     * - type (required): Literal['custom']
     * - custom (required): Custom314518a6
     */
    export interface ChatCompletionMessageCustomToolCallInput {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The custom tool that the model called.
       */
      custom: ChatCompletionMessageCustomToolCallInput.Custom;

      /**
       * The type of the tool. Always `custom`.
       */
      type: 'custom';
    }

    export namespace ChatCompletionMessageCustomToolCallInput {
      /**
       * The custom tool that the model called.
       */
      export interface Custom {
        /**
         * The input for the custom tool call generated by the model.
         */
        input: string;

        /**
         * The name of the custom tool to call.
         */
        name: string;
      }
    }
  }

  /**
   * Fields:
   *
   * - role (required): Literal['tool']
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestToolMessageContentPart],
   *   Field(json_schema_extra={"title": "Content7"}), MinLen(1)]
   * - tool_call_id (required): str
   */
  export interface ChatCompletionRequestToolMessage {
    /**
     * The contents of the tool message.
     */
    content: string | Array<ChatCompletionRequestToolMessage.Content7>;

    /**
     * The role of the messages author, in this case `tool`.
     */
    role: 'tool';

    /**
     * Tool call that this message is responding to.
     */
    tool_call_id: string;
  }

  export namespace ChatCompletionRequestToolMessage {
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     *
     * Fields:
     *
     * - type (required): Literal['text']
     * - text (required): str
     */
    export interface Content7 {
      /**
       * The text content.
       */
      text: string;

      /**
       * The type of the content part.
       */
      type: 'text';
    }
  }

  /**
   * Fields:
   *
   * - role (required): Literal['function']
   * - content (required): str | None
   * - name (required): str
   */
  export interface ChatCompletionRequestFunctionMessage {
    /**
     * The contents of the function message.
     */
    content: string | null;

    /**
     * The name of the function to call.
     */
    name: string;

    /**
     * The role of the messages author, in this case `function`.
     */
    role: 'function';
  }

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   */
  export interface Prediction {
    content: { [key: string]: unknown };

    type?: 'content';
  }

  /**
   * Safety setting, affecting the safety-blocking behavior.
   *
   * Passing a safety setting for a category changes the allowed probability that
   * content is blocked.
   *
   * Fields:
   *
   * - category (required): Literal['HARM_CATEGORY_UNSPECIFIED',
   *   'HARM_CATEGORY_DEROGATORY', 'HARM_CATEGORY_TOXICITY',
   *   'HARM_CATEGORY_VIOLENCE', 'HARM_CATEGORY_SEXUAL', 'HARM_CATEGORY_MEDICAL',
   *   'HARM_CATEGORY_DANGEROUS', 'HARM_CATEGORY_HARASSMENT',
   *   'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
   *   'HARM_CATEGORY_DANGEROUS_CONTENT', 'HARM_CATEGORY_CIVIC_INTEGRITY']
   * - threshold (required): Literal['HARM_BLOCK_THRESHOLD_UNSPECIFIED',
   *   'BLOCK_LOW_AND_ABOVE', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_ONLY_HIGH',
   *   'BLOCK_NONE', 'OFF']
   */
  export interface SafetySetting {
    /**
     * Required. The category for this setting.
     */
    category:
      | 'HARM_CATEGORY_UNSPECIFIED'
      | 'HARM_CATEGORY_DEROGATORY'
      | 'HARM_CATEGORY_TOXICITY'
      | 'HARM_CATEGORY_VIOLENCE'
      | 'HARM_CATEGORY_SEXUAL'
      | 'HARM_CATEGORY_MEDICAL'
      | 'HARM_CATEGORY_DANGEROUS'
      | 'HARM_CATEGORY_HARASSMENT'
      | 'HARM_CATEGORY_HATE_SPEECH'
      | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
      | 'HARM_CATEGORY_DANGEROUS_CONTENT'
      | 'HARM_CATEGORY_CIVIC_INTEGRITY';

    /**
     * Required. Controls the probability threshold at which harm is blocked.
     */
    threshold:
      | 'HARM_BLOCK_THRESHOLD_UNSPECIFIED'
      | 'BLOCK_LOW_AND_ABOVE'
      | 'BLOCK_MEDIUM_AND_ABOVE'
      | 'BLOCK_ONLY_HIGH'
      | 'BLOCK_NONE'
      | 'OFF';
  }

  export interface ThinkingConfigEnabled {
    budget_tokens: number;

    type?: 'enabled';
  }

  export interface ThinkingConfigDisabled {
    type?: 'disabled';
  }

  /**
   * The model will automatically decide whether to use tools.
   */
  export interface ToolChoiceAuto {
    disable_parallel_tool_use?: boolean | null;

    type?: 'auto';
  }

  /**
   * The model will use any available tools.
   */
  export interface ToolChoiceAny {
    disable_parallel_tool_use?: boolean | null;

    type?: 'any';
  }

  /**
   * The model will use the specified tool with `tool_choice.name`.
   */
  export interface ToolChoiceTool {
    name: string;

    disable_parallel_tool_use?: boolean | null;

    type?: 'tool';
  }

  /**
   * The model will not be allowed to use tools.
   */
  export interface ToolChoiceNone {
    type?: 'none';
  }

  /**
   * A function tool that can be used to generate a response.
   *
   * Fields:
   *
   * - type (required): Literal['function']
   * - function (required): FunctionObject
   */
  export interface Tool {
    /**
     * Fields:
     *
     * - description (optional): str
     * - name (required): str
     * - parameters (optional): FunctionParameters
     * - strict (optional): bool | None
     */
    function: Tool.Function;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
  }

  export namespace Tool {
    /**
     * Fields:
     *
     * - description (optional): str
     * - name (required): str
     * - parameters (optional): FunctionParameters
     * - strict (optional): bool | None
     */
    export interface Function {
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
      parameters?: { [key: string]: unknown };

      /**
       * Whether to enable strict schema adherence when generating the function call. If
       * set to true, the model will follow the exact schema defined in the `parameters`
       * field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn
       * more about Structured Outputs in the
       * [function calling guide](https://platform.openai.com/docs/guides/function-calling).
       */
      strict?: boolean | null;
    }
  }

  export type CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}

export interface CompletionCreateParamsNonStreaming extends CompletionCreateParamsBase {
  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: false | null;

  [k: string]: unknown;
}

export interface CompletionCreateParamsStreaming extends CompletionCreateParamsBase {
  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream: true;

  [k: string]: unknown;
}

export type ParsedChatCompletion<ParsedT> = _ParsedChatCompletion<ParsedT>;
export type ParsedChoice<ParsedT> = _ParsedChoice<ParsedT>;
export type ParsedMessage<ParsedT> = _ParsedMessage<ParsedT>;
export { type ParsedFunctionToolCall };

export declare namespace Completions {
  export {
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type Completion as Completion,
    type CompletionRequest as CompletionRequest,
    type StreamChunk as StreamChunk,
    type TopLogprob as TopLogprob,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
    type ParsedChatCompletion as ParsedChatCompletion,
    type ParsedChoice as ParsedChoice,
    type ParsedMessage as ParsedMessage,
    type ParsedFunctionToolCall as ParsedFunctionToolCall,
  };
}
