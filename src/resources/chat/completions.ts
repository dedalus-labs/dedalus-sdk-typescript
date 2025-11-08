// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { Stream } from '../../core/streaming';
import { RequestOptions } from '../../internal/request-options';

export class Completions extends APIResource {
  /**
   * Create a chat completion.
   *
   * Unified chat-completions endpoint that works across many model providers.
   * Supports optional MCP integration, multi-model routing with agentic handoffs,
   * server- or client-executed tools, and both streaming and non-streaming delivery.
   *
   * Request body:
   *
   * - messages: ordered list of chat turns.
   * - model: identifier or a list of identifiers for routing.
   * - tools: optional tool declarations available to the model.
   * - mcp_servers: optional list of MCP server slugs to enable during the run.
   * - stream: boolean to request incremental output.
   * - config: optional generation parameters (e.g., temperature, max_tokens,
   *   metadata).
   *
   * Headers:
   *
   * - Authorization: bearer key for the calling account.
   * - Optional BYOK or provider headers if applicable.
   *
   * Behavior:
   *
   * - If multiple models are supplied, the router may select or hand off across
   *   them.
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
   *   messages: [{ content: 'bar', role: 'bar' }],
   *   model: 'openai/gpt-4',
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
    return this._client.post('/v1/chat/completions', { body, ...options, stream: body.stream ?? false }) as
      | APIPromise<Completion>
      | APIPromise<Stream<StreamChunk>>;
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
      tool_calls?: Array<Message.ChatCompletionMessageToolCall | Message.ChatCompletionMessageCustomToolCall>;
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
      export interface ChatCompletionMessageToolCall {
        /**
         * The ID of the tool call.
         */
        id: string;

        /**
         * The function that the model called.
         */
        function: ChatCompletionMessageToolCall.Function;

        /**
         * The type of the tool. Currently, only `function` is supported.
         */
        type: 'function';
      }

      export namespace ChatCompletionMessageToolCall {
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
      export interface ChatCompletionMessageCustomToolCall {
        /**
         * The ID of the tool call.
         */
        id: string;

        /**
         * The custom tool that the model called.
         */
        custom: ChatCompletionMessageCustomToolCall.Custom;

        /**
         * The type of the tool. Always `custom`.
         */
        type: 'custom';
      }

      export namespace ChatCompletionMessageCustomToolCall {
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
 * Chat completion request (OpenAI-compatible).
 *
 * Stateless chat completion endpoint. For stateful conversations with threads, use
 * the Responses API instead.
 */
export interface CompletionRequest {
  /**
   * Conversation history. Accepts either a list of message objects or a string,
   * which is treated as a single user message.
   */
  messages: Array<{ [key: string]: unknown }> | string;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model: ModelID | Shared.DedalusModel | Models;

  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when requesting audio responses (for
   * example, modalities including 'audio').
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * When False, skip server-side tool execution and return raw OpenAI-style
   * tool_calls in the response.
   */
  auto_execute_tools?: boolean;

  /**
   * xAI-specific parameter. If set to true, the request returns a request_id for
   * async completion retrieval via GET /v1/chat/deferred-completion/{request_id}.
   */
  deferred?: boolean | null;

  /**
   * Google-only flag to disable the SDK's automatic function execution. When true,
   * the model returns function calls for the client to execute manually.
   */
  disable_automatic_function_calling?: boolean | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of 'tool_choice'. Controls which function is called by the
   * model (none, auto, or specific name).
   */
  function_call?: string | { [key: string]: unknown } | null;

  /**
   * Deprecated in favor of 'tools'. Legacy list of function definitions the model
   * may generate JSON inputs for.
   */
  functions?: Array<{ [key: string]: unknown }> | null;

  /**
   * Google generationConfig object. Merged with auto-generated config. Use for
   * Google-specific params (candidateCount, responseMimeType, etc.).
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
   * Convenience alias for Responses-style `input`. Used when `messages` is omitted
   * to provide the user prompt directly.
   */
  input?: Array<{ [key: string]: unknown }> | string | null;

  /**
   * Convenience alias for Responses-style `instructions`. Takes precedence over
   * `system` and over system-role messages when provided.
   */
  instructions?: string | Array<{ [key: string]: unknown }> | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a
   * JSON object mapping token IDs (as strings) to bias values from -100 to 100. The
   * bias is added to the logits before sampling; values between -1 and 1 nudge
   * selection probability, while values like -100 or 100 effectively ban or require
   * a token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens. If true, returns the
   * log probabilities for each token in the response content.
   */
  logprobs?: boolean | null;

  /**
   * An upper bound for the number of tokens that can be generated for a completion,
   * including visible output and reasoning tokens.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of tokens that can be generated in the chat completion. This
   * value can be used to control costs for text generated via API. This value is now
   * deprecated in favor of 'max_completion_tokens' and is not compatible with
   * o-series models.
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
   * Set of up to 16 key-value string pairs that can be attached to the request for
   * structured metadata.
   */
  metadata?: { [key: string]: string } | null;

  /**
   * Output types you would like the model to generate. Most models default to
   * ['text']; some support ['text', 'audio'].
   */
  modalities?: Array<string> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Keep 'n' as
   * 1 to minimize costs.
   */
  n?: number | null;

  /**
   * Whether to enable parallel function calling during tool use.
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Configuration for predicted outputs. Improves response times when you already
   * know large portions of the response content.
   */
  prediction?: { [key: string]: unknown } | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests and optimize cache hit
   * rates. Replaces the legacy 'user' field for caching.
   */
  prompt_cache_key?: string | null;

  /**
   * Constrains effort on reasoning for supported reasoning models. Higher values use
   * more compute, potentially improving reasoning quality at the cost of latency and
   * tokens.
   */
  reasoning_effort?: 'low' | 'medium' | 'high' | null;

  /**
   * An object specifying the format that the model must output. Use {'type':
   * 'json_schema', 'json_schema': {...}} for structured outputs or {'type':
   * 'json_object'} for the legacy JSON mode. Currently only OpenAI-prefixed models
   * honour this field; Anthropic and Google requests will return an
   * invalid_request_error if it is supplied.
   */
  response_format?: { [key: string]: unknown } | null;

  /**
   * Stable identifier used to help detect users who might violate OpenAI usage
   * policies. Consider hashing end-user identifiers before sending.
   */
  safety_identifier?: string | null;

  /**
   * Google safety settings (harm categories and thresholds).
   */
  safety_settings?: Array<{ [key: string]: unknown }> | null;

  /**
   * xAI-specific parameter for configuring web search data acquisition. If not set,
   * no data will be acquired by the model.
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * If specified, system will make a best effort to sample deterministically.
   * Determinism is not guaranteed for the same seed across different models or API
   * versions.
   */
  seed?: number | null;

  /**
   * Specifies the processing tier used for the request. 'auto' uses project
   * defaults, while 'default' forces standard pricing and performance.
   */
  service_tier?: 'auto' | 'default' | null;

  /**
   * Not supported with latest reasoning models 'o3' and 'o4-mini'.
   *
   *         Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.
   */
  stop?: Array<string> | null;

  /**
   * Whether to store the output of this chat completion request for OpenAI model
   * distillation or eval products. Image inputs over 8MB are dropped if storage is
   * enabled.
   */
  store?: boolean | null;

  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: boolean;

  /**
   * Options for streaming responses. Only set when 'stream' is true (supports
   * 'include_usage' and 'include_obfuscation').
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System prompt/instructions. Anthropic: pass-through. Google: converted to
   * systemInstruction. OpenAI: extracted from messages.
   */
  system?: string | Array<{ [key: string]: unknown }> | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 make
   * the output more random, while lower values like 0.2 make it more focused and
   * deterministic. We generally recommend altering this or 'top_p' but not both.
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic only). Enables thinking blocks
   * showing reasoning process. Requires min 1,024 token budget.
   */
  thinking?: CompletionRequest.ThinkingConfigDisabled | CompletionRequest.ThinkingConfigEnabled | null;

  /**
   * Controls which (if any) tool is called by the model. 'none' stops tool calling,
   * 'auto' lets the model decide, and 'required' forces at least one tool
   * invocation. Specific tool payloads force that tool.
   */
  tool_choice?: string | { [key: string]: unknown } | null;

  /**
   * Google tool configuration (function calling mode, etc.).
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * A list of tools the model may call. Supports OpenAI function tools and custom
   * tools; use 'mcp_servers' for Dedalus-managed server-side tools.
   */
  tools?: Array<{ [key: string]: unknown }> | null;

  /**
   * Top-k sampling. Anthropic: pass-through. Google: injected into
   * generationConfig.topK.
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying how many of the most likely tokens to
   * return at each position, with log probabilities. Requires 'logprobs' to be true.
   */
  top_logprobs?: number | null;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered. We
   * generally recommend altering this or 'temperature' but not both.
   */
  top_p?: number | null;

  /**
   * Stable identifier for your end-users. Helps OpenAI detect and prevent abuse and
   * may boost cache hit rates. This field is being replaced by 'safety_identifier'
   * and 'prompt_cache_key'.
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values produce concise
   * answers, higher values allow more detail.
   */
  verbosity?: 'low' | 'medium' | 'high' | null;

  /**
   * Configuration for OpenAI's web search tool. Learn more at
   * https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat.
   */
  web_search_options?: { [key: string]: unknown } | null;
}

export namespace CompletionRequest {
  /**
   * Fields:
   *
   * - type (required): Literal['disabled']
   */
  export interface ThinkingConfigDisabled {
    type: 'disabled';
  }

  /**
   * Fields:
   *
   * - budget_tokens (required): int
   * - type (required): Literal['enabled']
   */
  export interface ThinkingConfigEnabled {
    /**
     * Determines how many tokens Claude can use for its internal reasoning process.
     * Larger budgets can enable more thorough analysis for complex problems, improving
     * response quality.
     *
     * Must be ≥1024 and less than `max_tokens`.
     *
     * See
     * [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
     * for details.
     */
    budget_tokens: number;

    type: 'enabled';
  }
}

/**
 * Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').
 */
export type ModelID = string;

/**
 * List of models for multi-model routing.
 */
export type Models = Array<Shared.DedalusModelChoice>;

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
   * Conversation history. Accepts either a list of message objects or a string,
   * which is treated as a single user message.
   */
  messages: Array<{ [key: string]: unknown }> | string;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model: ModelID | Shared.DedalusModel | Models;

  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when requesting audio responses (for
   * example, modalities including 'audio').
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * When False, skip server-side tool execution and return raw OpenAI-style
   * tool_calls in the response.
   */
  auto_execute_tools?: boolean;

  /**
   * xAI-specific parameter. If set to true, the request returns a request_id for
   * async completion retrieval via GET /v1/chat/deferred-completion/{request_id}.
   */
  deferred?: boolean | null;

  /**
   * Google-only flag to disable the SDK's automatic function execution. When true,
   * the model returns function calls for the client to execute manually.
   */
  disable_automatic_function_calling?: boolean | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing the model's likelihood to
   * repeat the same line verbatim.
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of 'tool_choice'. Controls which function is called by the
   * model (none, auto, or specific name).
   */
  function_call?: string | { [key: string]: unknown } | null;

  /**
   * Deprecated in favor of 'tools'. Legacy list of function definitions the model
   * may generate JSON inputs for.
   */
  functions?: Array<{ [key: string]: unknown }> | null;

  /**
   * Google generationConfig object. Merged with auto-generated config. Use for
   * Google-specific params (candidateCount, responseMimeType, etc.).
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
   * Convenience alias for Responses-style `input`. Used when `messages` is omitted
   * to provide the user prompt directly.
   */
  input?: Array<{ [key: string]: unknown }> | string | null;

  /**
   * Convenience alias for Responses-style `instructions`. Takes precedence over
   * `system` and over system-role messages when provided.
   */
  instructions?: string | Array<{ [key: string]: unknown }> | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accepts a
   * JSON object mapping token IDs (as strings) to bias values from -100 to 100. The
   * bias is added to the logits before sampling; values between -1 and 1 nudge
   * selection probability, while values like -100 or 100 effectively ban or require
   * a token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens. If true, returns the
   * log probabilities for each token in the response content.
   */
  logprobs?: boolean | null;

  /**
   * An upper bound for the number of tokens that can be generated for a completion,
   * including visible output and reasoning tokens.
   */
  max_completion_tokens?: number | null;

  /**
   * The maximum number of tokens that can be generated in the chat completion. This
   * value can be used to control costs for text generated via API. This value is now
   * deprecated in favor of 'max_completion_tokens' and is not compatible with
   * o-series models.
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
   * Set of up to 16 key-value string pairs that can be attached to the request for
   * structured metadata.
   */
  metadata?: { [key: string]: string } | null;

  /**
   * Output types you would like the model to generate. Most models default to
   * ['text']; some support ['text', 'audio'].
   */
  modalities?: Array<string> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Keep 'n' as
   * 1 to minimize costs.
   */
  n?: number | null;

  /**
   * Whether to enable parallel function calling during tool use.
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Configuration for predicted outputs. Improves response times when you already
   * know large portions of the response content.
   */
  prediction?: { [key: string]: unknown } | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on
   * whether they appear in the text so far, increasing the model's likelihood to
   * talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests and optimize cache hit
   * rates. Replaces the legacy 'user' field for caching.
   */
  prompt_cache_key?: string | null;

  /**
   * Constrains effort on reasoning for supported reasoning models. Higher values use
   * more compute, potentially improving reasoning quality at the cost of latency and
   * tokens.
   */
  reasoning_effort?: 'low' | 'medium' | 'high' | null;

  /**
   * An object specifying the format that the model must output. Use {'type':
   * 'json_schema', 'json_schema': {...}} for structured outputs or {'type':
   * 'json_object'} for the legacy JSON mode. Currently only OpenAI-prefixed models
   * honour this field; Anthropic and Google requests will return an
   * invalid_request_error if it is supplied.
   */
  response_format?: { [key: string]: unknown } | null;

  /**
   * Stable identifier used to help detect users who might violate OpenAI usage
   * policies. Consider hashing end-user identifiers before sending.
   */
  safety_identifier?: string | null;

  /**
   * Google safety settings (harm categories and thresholds).
   */
  safety_settings?: Array<{ [key: string]: unknown }> | null;

  /**
   * xAI-specific parameter for configuring web search data acquisition. If not set,
   * no data will be acquired by the model.
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * If specified, system will make a best effort to sample deterministically.
   * Determinism is not guaranteed for the same seed across different models or API
   * versions.
   */
  seed?: number | null;

  /**
   * Specifies the processing tier used for the request. 'auto' uses project
   * defaults, while 'default' forces standard pricing and performance.
   */
  service_tier?: 'auto' | 'default' | null;

  /**
   * Not supported with latest reasoning models 'o3' and 'o4-mini'.
   *
   *         Up to 4 sequences where the API will stop generating further tokens; the returned text will not contain the stop sequence.
   */
  stop?: Array<string> | null;

  /**
   * Whether to store the output of this chat completion request for OpenAI model
   * distillation or eval products. Image inputs over 8MB are dropped if storage is
   * enabled.
   */
  store?: boolean | null;

  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: boolean;

  /**
   * Options for streaming responses. Only set when 'stream' is true (supports
   * 'include_usage' and 'include_obfuscation').
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System prompt/instructions. Anthropic: pass-through. Google: converted to
   * systemInstruction. OpenAI: extracted from messages.
   */
  system?: string | Array<{ [key: string]: unknown }> | null;

  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 make
   * the output more random, while lower values like 0.2 make it more focused and
   * deterministic. We generally recommend altering this or 'top_p' but not both.
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic only). Enables thinking blocks
   * showing reasoning process. Requires min 1,024 token budget.
   */
  thinking?:
    | CompletionCreateParams.ThinkingConfigDisabled
    | CompletionCreateParams.ThinkingConfigEnabled
    | null;

  /**
   * Controls which (if any) tool is called by the model. 'none' stops tool calling,
   * 'auto' lets the model decide, and 'required' forces at least one tool
   * invocation. Specific tool payloads force that tool.
   */
  tool_choice?: string | { [key: string]: unknown } | null;

  /**
   * Google tool configuration (function calling mode, etc.).
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * A list of tools the model may call. Supports OpenAI function tools and custom
   * tools; use 'mcp_servers' for Dedalus-managed server-side tools.
   */
  tools?: Array<{ [key: string]: unknown }> | null;

  /**
   * Top-k sampling. Anthropic: pass-through. Google: injected into
   * generationConfig.topK.
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying how many of the most likely tokens to
   * return at each position, with log probabilities. Requires 'logprobs' to be true.
   */
  top_logprobs?: number | null;

  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the
   * model considers the results of the tokens with top_p probability mass. So 0.1
   * means only the tokens comprising the top 10% probability mass are considered. We
   * generally recommend altering this or 'temperature' but not both.
   */
  top_p?: number | null;

  /**
   * Stable identifier for your end-users. Helps OpenAI detect and prevent abuse and
   * may boost cache hit rates. This field is being replaced by 'safety_identifier'
   * and 'prompt_cache_key'.
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values produce concise
   * answers, higher values allow more detail.
   */
  verbosity?: 'low' | 'medium' | 'high' | null;

  /**
   * Configuration for OpenAI's web search tool. Learn more at
   * https://platform.openai.com/docs/guides/tools-web-search?api-mode=chat.
   */
  web_search_options?: { [key: string]: unknown } | null;
}

export namespace CompletionCreateParams {
  /**
   * Fields:
   *
   * - type (required): Literal['disabled']
   */
  export interface ThinkingConfigDisabled {
    type: 'disabled';
  }

  /**
   * Fields:
   *
   * - budget_tokens (required): int
   * - type (required): Literal['enabled']
   */
  export interface ThinkingConfigEnabled {
    /**
     * Determines how many tokens Claude can use for its internal reasoning process.
     * Larger budgets can enable more thorough analysis for complex problems, improving
     * response quality.
     *
     * Must be ≥1024 and less than `max_tokens`.
     *
     * See
     * [extended thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
     * for details.
     */
    budget_tokens: number;

    type: 'enabled';
  }

  export type CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}

export interface CompletionCreateParamsNonStreaming extends CompletionCreateParamsBase {
  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream?: false;
}

export interface CompletionCreateParamsStreaming extends CompletionCreateParamsBase {
  /**
   * If true, the model response data is streamed to the client as it is generated
   * using Server-Sent Events.
   */
  stream: true;
}

export declare namespace Completions {
  export {
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type Completion as Completion,
    type CompletionRequest as CompletionRequest,
    type ModelID as ModelID,
    type Models as Models,
    type StreamChunk as StreamChunk,
    type TopLogprob as TopLogprob,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}
