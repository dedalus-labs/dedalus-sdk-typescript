// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import * as ModelsAPI from '../models';
import { APIPromise } from '../../core/api-promise';
import { Stream } from '../../core/streaming';
import { RequestOptions } from '../../internal/request-options';

export class Completions extends APIResource {
  /**
   * Create a chat completion.
   *
   * This endpoint provides a vendor-agnostic chat completions API that works with
   * thousands of LLMs. It supports MCP integration, multi-model routing with
   * intelligent agentic handoffs, client-side and server-side tool execution, and
   * streaming and non-streaming responses.
   *
   * Args: request: Chat completion request with messages, model, and configuration.
   * http_request: FastAPI request object for accessing headers and state.
   * background_tasks: FastAPI background tasks for async billing operations. user:
   * Authenticated user with validated API key and sufficient balance.
   *
   * Returns: ChatCompletion: OpenAI-compatible completion response with usage data.
   *
   * Raises: HTTPException: - 401 if authentication fails or insufficient balance. -
   * 400 if request validation fails. - 500 if internal processing error occurs.
   *
   * Billing: - Token usage billed automatically based on model pricing - MCP tool
   * calls billed separately using credits system - Streaming responses billed after
   * completion via background task
   *
   * Example: Basic chat completion: ```python from dedalus_labs import Dedalus
   *
   *     client = Dedalus(api_key="your-api-key")
   *
   *     completion = client.chat.completions.create(
   *         model="openai/gpt-5",
   *         messages=[{"role": "user", "content": "Hello, how are you?"}],
   *     )
   *
   *     print(completion.choices[0].message.content)
   *     ```
   *
   *     With tools and MCP servers:
   *     ```python
   *     completion = client.chat.completions.create(
   *         model="openai/gpt-5",
   *         messages=[{"role": "user", "content": "Search for recent AI news"}],
   *         tools=[
   *             {
   *                 "type": "function",
   *                 "function": {
   *                     "name": "search_web",
   *                     "description": "Search the web for information",
   *                 },
   *             }
   *         ],
   *         mcp_servers=["dedalus-labs/brave-search"],
   *     )
   *     ```
   *
   *     Multi-model routing:
   *     ```python
   *     completion = client.chat.completions.create(
   *         model=[
   *             "openai/gpt-4o-mini",
   *             "openai/gpt-5",
   *             "anthropic/claude-sonnet-4-20250514",
   *         ],
   *         messages=[{"role": "user", "content": "Analyze this complex data"}],
   *         agent_attributes={"complexity": 0.8, "accuracy": 0.9},
   *     )
   *     ```
   *
   *     Streaming response:
   *     ```python
   *     stream = client.chat.completions.create(
   *         model="openai/gpt-5",
   *         messages=[{"role": "user", "content": "Tell me a story"}],
   *         stream=True,
   *     )
   *
   *     for chunk in stream:
   *         if chunk.choices[0].delta.content:
   *             print(chunk.choices[0].delta.content, end="")
   *     ```
   *
   * @example
   * ```ts
   * const streamChunk = await client.chat.completions.create({
   *   messages: [{ content: 'bar', role: 'bar' }],
   *   model: 'openai/gpt-4',
   * });
   * ```
   */
  create(body: CompletionCreateParamsNonStreaming, options?: RequestOptions): APIPromise<StreamChunk>;
  create(body: CompletionCreateParamsStreaming, options?: RequestOptions): APIPromise<Stream<StreamChunk>>;
  create(
    body: CompletionCreateParamsBase,
    options?: RequestOptions,
  ): APIPromise<Stream<StreamChunk> | StreamChunk>;
  create(
    body: CompletionCreateParams,
    options?: RequestOptions,
  ): APIPromise<StreamChunk> | APIPromise<Stream<StreamChunk>> {
    return this._client.post('/v1/chat/completions', { body, ...options, stream: body.stream ?? false }) as
      | APIPromise<StreamChunk>
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
   * Log probability of this token.
   */
  logprob: number;

  /**
   * List of the most likely tokens and their log probability information.
   */
  top_logprobs: Array<TopLogprob>;

  /**
   * Bytes representation of the token.
   */
  bytes?: Array<number> | null;
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
   * Unique identifier for the chat completion
   */
  id: string;

  /**
   * List of completion choices
   */
  choices: Array<Completion.Choice>;

  /**
   * Unix timestamp when the completion was created
   */
  created: number;

  /**
   * ID of the model used for the completion
   */
  model: string;

  /**
   * Information about MCP server failures, if any occurred during the request.
   * Contains details about which servers failed and why, along with recommendations
   * for the user. Only present when MCP server failures occurred.
   */
  mcp_server_errors?: { [key: string]: unknown } | null;

  /**
   * Object type, always 'chat.completion'
   */
  object?: 'chat.completion';

  /**
   * Service tier used for processing the request
   */
  service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;

  /**
   * System fingerprint that represents the backend configuration
   */
  system_fingerprint?: string | null;

  /**
   * List of tool names that were executed server-side (e.g., MCP tools). Only
   * present when tools were executed on the server rather than returned for
   * client-side execution.
   */
  tools_executed?: Array<string> | null;

  /**
   * Usage statistics for the completion
   */
  usage?: Completion.Usage | null;
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
     * The index of this choice in the list of choices
     */
    index: number;

    /**
     * The chat completion message generated by the model
     */
    message: Choice.Message;

    /**
     * The reason the model stopped generating tokens. 'stop' = natural stop, 'length'
     * = max_tokens reached, 'tool_calls' = model called a tool, 'content_filter' =
     * content filtered.
     */
    finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;

    /**
     * Log probability information for the choice.
     */
    logprobs?: Choice.Logprobs | null;
  }

  export namespace Choice {
    /**
     * The chat completion message generated by the model
     */
    export interface Message {
      role: 'assistant';

      annotations?: Array<Message.Annotation> | null;

      audio?: Message.Audio | null;

      content?: string | null;

      function_call?: Message.FunctionCall | null;

      refusal?: string | null;

      tool_calls?: Array<
        Message.ChatCompletionMessageFunctionToolCall | Message.ChatCompletionMessageCustomToolCall
      > | null;

      [k: string]: unknown;
    }

    export namespace Message {
      export interface Annotation {
        type: 'url_citation';

        url_citation: Annotation.URLCitation;

        [k: string]: unknown;
      }

      export namespace Annotation {
        export interface URLCitation {
          end_index: number;

          start_index: number;

          title: string;

          url: string;

          [k: string]: unknown;
        }
      }

      export interface Audio {
        id: string;

        data: string;

        expires_at: number;

        transcript: string;

        [k: string]: unknown;
      }

      export interface FunctionCall {
        arguments: string;

        name: string;

        [k: string]: unknown;
      }

      export interface ChatCompletionMessageFunctionToolCall {
        id: string;

        function: ChatCompletionMessageFunctionToolCall.Function;

        type: 'function';

        [k: string]: unknown;
      }

      export namespace ChatCompletionMessageFunctionToolCall {
        export interface Function {
          arguments: string;

          name: string;

          [k: string]: unknown;
        }
      }

      export interface ChatCompletionMessageCustomToolCall {
        id: string;

        custom: ChatCompletionMessageCustomToolCall.Custom;

        type: 'custom';

        [k: string]: unknown;
      }

      export namespace ChatCompletionMessageCustomToolCall {
        export interface Custom {
          input: string;

          name: string;

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
   * Usage statistics for the completion
   */
  export interface Usage {
    completion_tokens: number;

    prompt_tokens: number;

    total_tokens: number;

    completion_tokens_details?: Usage.CompletionTokensDetails | null;

    prompt_tokens_details?: Usage.PromptTokensDetails | null;

    [k: string]: unknown;
  }

  export namespace Usage {
    export interface CompletionTokensDetails {
      accepted_prediction_tokens?: number | null;

      audio_tokens?: number | null;

      reasoning_tokens?: number | null;

      rejected_prediction_tokens?: number | null;

      [k: string]: unknown;
    }

    export interface PromptTokensDetails {
      audio_tokens?: number | null;

      cached_tokens?: number | null;

      [k: string]: unknown;
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
   * A list of messages comprising the conversation so far. Depending on the model
   * you use, different message types (modalities) are supported, like text, images,
   * and audio.
   */
  messages: Array<{ [key: string]: unknown }>;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model: ModelID | ModelsAPI.DedalusModel | Models;

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
  mcp_servers?:
    | Array<string | CompletionRequest.MCPServerSpec>
    | string
    | CompletionRequest.MCPServerSpec
    | null;

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
   * 'json_object'} for the legacy JSON mode.
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
   * Structured representation of an MCP server reference.
   */
  export interface MCPServerSpec {
    /**
     * Optional metadata associated with the MCP server entry.
     */
    metadata?: { [key: string]: unknown } | null;

    /**
     * Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').
     */
    slug?: string | null;

    /**
     * Explicit MCP server URL.
     */
    url?: string | null;

    /**
     * Optional explicit version to target when using a slug.
     */
    version?: string | null;

    [k: string]: unknown;
  }

  /**
   * Structured representation of an MCP server reference.
   */
  export interface MCPServerSpec {
    /**
     * Optional metadata associated with the MCP server entry.
     */
    metadata?: { [key: string]: unknown } | null;

    /**
     * Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').
     */
    slug?: string | null;

    /**
     * Explicit MCP server URL.
     */
    url?: string | null;

    /**
     * Optional explicit version to target when using a slug.
     */
    version?: string | null;

    [k: string]: unknown;
  }

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
 * Dedalus model choice - either a string ID or DedalusModel configuration object.
 */
export type DedalusModelChoice = ModelID | ModelsAPI.DedalusModel;

/**
 * Model identifier string (e.g., 'openai/gpt-5', 'anthropic/claude-3-5-sonnet').
 */
export type ModelID = string;

/**
 * List of models for multi-model routing.
 */
export type Models = Array<DedalusModelChoice>;

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
   * Usage statistics (only in final chunk with stream_options.include_usage=true)
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
   * Usage statistics (only in final chunk with stream_options.include_usage=true)
   */
  export interface Usage {
    completion_tokens: number;

    prompt_tokens: number;

    total_tokens: number;

    completion_tokens_details?: Usage.CompletionTokensDetails | null;

    prompt_tokens_details?: Usage.PromptTokensDetails | null;

    [k: string]: unknown;
  }

  export namespace Usage {
    export interface CompletionTokensDetails {
      accepted_prediction_tokens?: number | null;

      audio_tokens?: number | null;

      reasoning_tokens?: number | null;

      rejected_prediction_tokens?: number | null;

      [k: string]: unknown;
    }

    export interface PromptTokensDetails {
      audio_tokens?: number | null;

      cached_tokens?: number | null;

      [k: string]: unknown;
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
   * Log probability of this token.
   */
  logprob: number;

  /**
   * Bytes representation of the token.
   */
  bytes?: Array<number> | null;
}

export type CompletionCreateParams = CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming;

export interface CompletionCreateParamsBase {
  /**
   * A list of messages comprising the conversation so far. Depending on the model
   * you use, different message types (modalities) are supported, like text, images,
   * and audio.
   */
  messages: Array<{ [key: string]: unknown }>;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model: ModelID | ModelsAPI.DedalusModel | Models;

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
  mcp_servers?:
    | Array<string | CompletionCreateParams.MCPServerSpec>
    | string
    | CompletionCreateParams.MCPServerSpec
    | null;

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
   * 'json_object'} for the legacy JSON mode.
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
   * Structured representation of an MCP server reference.
   */
  export interface MCPServerSpec {
    /**
     * Optional metadata associated with the MCP server entry.
     */
    metadata?: { [key: string]: unknown } | null;

    /**
     * Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').
     */
    slug?: string | null;

    /**
     * Explicit MCP server URL.
     */
    url?: string | null;

    /**
     * Optional explicit version to target when using a slug.
     */
    version?: string | null;

    [k: string]: unknown;
  }

  /**
   * Structured representation of an MCP server reference.
   */
  export interface MCPServerSpec {
    /**
     * Optional metadata associated with the MCP server entry.
     */
    metadata?: { [key: string]: unknown } | null;

    /**
     * Slug identifying an MCP server (e.g., 'dedalus-labs/brave-search').
     */
    slug?: string | null;

    /**
     * Explicit MCP server URL.
     */
    url?: string | null;

    /**
     * Optional explicit version to target when using a slug.
     */
    version?: string | null;

    [k: string]: unknown;
  }

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
    type DedalusModelChoice as DedalusModelChoice,
    type ModelID as ModelID,
    type Models as Models,
    type StreamChunk as StreamChunk,
    type TopLogprob as TopLogprob,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}
