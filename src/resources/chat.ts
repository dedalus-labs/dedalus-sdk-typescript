// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as ChatAPI from './chat';
import * as ModelsAPI from './models';
import { APIPromise } from '../core/api-promise';
import { Stream } from '../core/streaming';
import { RequestOptions } from '../internal/request-options';

export class Chat extends APIResource {
  /**
   * Create a chat completion using the Agent framework.
   *
   * This endpoint provides a vendor-agnostic chat completion API that works with
   * 100+ LLM providers via the Agent framework. It supports both single and
   * multi-model routing, client-side and server-side tool execution, and integration
   * with MCP (Model Context Protocol) servers.
   *
   * Features: - Cross-vendor compatibility (OpenAI, Anthropic, Cohere, etc.) -
   * Multi-model routing with intelligent agentic handoffs - Client-side tool
   * execution (tools returned as JSON) - Server-side MCP tool execution with
   * automatic billing - Streaming and non-streaming responses - Advanced agent
   * attributes for routing decisions - Automatic usage tracking and billing
   *
   * Args: request: Chat completion request with messages, model, and configuration
   * http_request: FastAPI request object for accessing headers and state
   * background_tasks: FastAPI background tasks for async billing operations user:
   * Authenticated user with validated API key and sufficient balance
   *
   * Returns: ChatCompletion: OpenAI-compatible completion response with usage data
   *
   * Raises: HTTPException: - 401 if authentication fails or insufficient balance -
   * 400 if request validation fails - 500 if internal processing error occurs
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
   * const streamChunk = await client.chat.create();
   * ```
   */
  create(body: ChatCreateParamsNonStreaming, options?: RequestOptions): APIPromise<StreamChunk>;
  create(body: ChatCreateParamsStreaming, options?: RequestOptions): APIPromise<Stream<StreamChunk>>;
  create(body: ChatCreateParamsBase, options?: RequestOptions): APIPromise<Stream<StreamChunk> | StreamChunk>;
  create(
    body: ChatCreateParams,
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
   * The token
   */
  token: string;

  /**
   * Log probability of this token
   */
  logprob: number;

  /**
   * List of most likely tokens and their log probabilities
   */
  top_logprobs: Array<TopLogprob>;

  /**
   * Bytes representation of the token
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
       * Log probabilities for the content tokens
       */
      content?: Array<ChatAPI.ChatCompletionTokenLogprob> | null;

      /**
       * Log probabilities for refusal tokens, if any
       */
      refusal?: Array<ChatAPI.ChatCompletionTokenLogprob> | null;
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
 * Request model for chat completions.
 *
 * Validates incoming chat requests with support for multimodality, multi-model
 * routing, and agent-enhanced features. Compatible with OpenAI API format while
 * extending functionality for advanced use cases.
 *
 * This model supports both the 'messages' field and the 'input' field for maximum
 * compatibility. The 'input' field can handle various modalities beyond text
 * messages.
 *
 * Key Features: - Multi-model routing with intelligent handoffs - MCP (Model
 * Context Protocol) server integration - Advanced agent attributes for routing
 * decisions - Client-side and server-side tool execution - Streaming and
 * non-streaming responses - Automatic usage tracking and billing
 *
 * Examples: Basic chat completion:
 * `python request = ChatCompletionRequest( model="openai/gpt-4", messages=[{"role": "user", "content": "Hello, how are you?"}], ) `
 *
 *     Multi-model routing with attributes:
 *     ```python
 *     request = ChatCompletionRequest(
 *         model=["openai/gpt-4o-mini", "openai/gpt-4", "anthropic/claude-3-5-sonnet"],
 *         messages=[{"role": "user", "content": "Analyze this complex problem"}],
 *         agent_attributes={"complexity": 0.8, "accuracy": 0.9},
 *         model_attributes={
 *             "gpt-4": {"intelligence": 0.9, "cost": 0.8},
 *             "claude-3-5-sonnet": {"intelligence": 0.95, "cost": 0.7},
 *         },
 *     )
 *     ```
 *
 *     With tools and MCP servers:
 *     ```python
 *     request = ChatCompletionRequest(
 *         model="openai/gpt-5",
 *         messages=[{"role": "user", "content": "Search for AI news"}],
 *         tools=[
 *             {
 *                 "type": "function",
 *                 "function": {
 *                     "name": "search_web",
 *                     "description": "Search the web",
 *                 },
 *             }
 *         ],
 *         mcp_servers=["dedalus-labs/brave-search"],
 *         temperature=0.7,
 *         max_tokens=1000,
 *     )
 *     ```
 */
export interface CompletionRequest {
  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Frequency penalty (-2 to 2). Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing likelihood of repeated
   * phrases.
   */
  frequency_penalty?: number | null;

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
   * Modify likelihood of specified tokens appearing in the completion. Maps token
   * IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100
   * = strongly favor token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Maximum number of tokens to generate in the completion. Does not include tokens
   * in the input messages.
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
   * tool execution. Can be URLs (e.g., 'https://mcp.example.com') or slugs (e.g.,
   * 'dedalus-labs/brave-search'). MCP tools are executed server-side and billed
   * separately.
   */
  mcp_servers?: Array<string> | null;

  /**
   * Messages to the model - accepts either 'messages' (OpenAI) or 'input' (Dedalus).
   * Supports role/content structure and multimodal content arrays.
   */
  messages?: Array<{ [key: string]: unknown }> | null;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model?: string | ModelsAPI.Model | Array<string | ModelsAPI.Model> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * Number of completions to generate. Note: only n=1 is currently supported.
   */
  n?: number | null;

  /**
   * Presence penalty (-2 to 2). Positive values penalize new tokens based on whether
   * they appear in the text so far, encouraging the model to talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens. The model
   * will stop as soon as it encounters any of these sequences.
   */
  stop?: Array<string> | null;

  /**
   * Whether to stream back partial message deltas as Server-Sent Events. When true,
   * partial message deltas will be sent as OpenAI-compatible chunks.
   */
  stream?: boolean;

  /**
   * Sampling temperature (0 to 2). Higher values make output more random, lower
   * values make it more focused and deterministic. 0 = deterministic, 1 = balanced,
   * 2 = very creative.
   */
  temperature?: number | null;

  /**
   * Controls which tool is called by the model. Options: 'auto' (default), 'none',
   * 'required', or specific tool name. Can also be a dict specifying a particular
   * tool.
   */
  tool_choice?: string | { [key: string]: unknown } | null;

  /**
   * list of tools available to the model in OpenAI function calling format. Tools
   * are executed client-side and returned as JSON for the application to handle. Use
   * 'mcp_servers' for server-side tool execution.
   */
  tools?: Array<{ [key: string]: unknown }> | null;

  /**
   * Nucleus sampling parameter (0 to 1). Alternative to temperature. 0.1 = only top
   * 10% probability mass, 1.0 = consider all tokens.
   */
  top_p?: number | null;

  /**
   * Unique identifier representing your end-user. Used for monitoring and abuse
   * detection. Should be consistent across requests from the same user.
   */
  user?: string | null;
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
       * Log probabilities for the content tokens
       */
      content?: Array<ChatAPI.ChatCompletionTokenLogprob> | null;

      /**
       * Log probabilities for refusal tokens, if any
       */
      refusal?: Array<ChatAPI.ChatCompletionTokenLogprob> | null;
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
   * The token
   */
  token: string;

  /**
   * Log probability of this token
   */
  logprob: number;

  /**
   * Bytes representation of the token
   */
  bytes?: Array<number> | null;
}

export type ChatCreateParams = ChatCreateParamsNonStreaming | ChatCreateParamsStreaming;

export interface ChatCreateParamsBase {
  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   * Format: {'attribute': value}, where values are 0.0-1.0. Common attributes:
   * 'complexity', 'accuracy', 'efficiency', 'creativity', 'friendliness'. Higher
   * values indicate stronger preference for that characteristic.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Frequency penalty (-2 to 2). Positive values penalize new tokens based on their
   * existing frequency in the text so far, decreasing likelihood of repeated
   * phrases.
   */
  frequency_penalty?: number | null;

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
   * Modify likelihood of specified tokens appearing in the completion. Maps token
   * IDs (as strings) to bias values (-100 to 100). -100 = completely ban token, +100
   * = strongly favor token.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Maximum number of tokens to generate in the completion. Does not include tokens
   * in the input messages.
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
   * tool execution. Can be URLs (e.g., 'https://mcp.example.com') or slugs (e.g.,
   * 'dedalus-labs/brave-search'). MCP tools are executed server-side and billed
   * separately.
   */
  mcp_servers?: Array<string> | null;

  /**
   * Messages to the model - accepts either 'messages' (OpenAI) or 'input' (Dedalus).
   * Supports role/content structure and multimodal content arrays.
   */
  messages?: Array<{ [key: string]: unknown }> | null;

  /**
   * Model(s) to use for completion. Can be a single model ID, a DedalusModel object,
   * or a list for multi-model routing. Single model: 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet-20241022', 'openai/gpt-4o-mini', or a DedalusModel
   * instance. Multi-model routing: ['openai/gpt-4o-mini', 'openai/gpt-4',
   * 'anthropic/claude-3-5-sonnet'] or list of DedalusModel objects - agent will
   * choose optimal model based on task complexity.
   */
  model?: string | ModelsAPI.Model | Array<string | ModelsAPI.Model> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution. Format: {'model_name': {'attribute': value}}, where values are
   * 0.0-1.0. Common attributes: 'intelligence', 'speed', 'cost', 'creativity',
   * 'accuracy'. Used by agent to select optimal model based on task requirements.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * Number of completions to generate. Note: only n=1 is currently supported.
   */
  n?: number | null;

  /**
   * Presence penalty (-2 to 2). Positive values penalize new tokens based on whether
   * they appear in the text so far, encouraging the model to talk about new topics.
   */
  presence_penalty?: number | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens. The model
   * will stop as soon as it encounters any of these sequences.
   */
  stop?: Array<string> | null;

  /**
   * Whether to stream back partial message deltas as Server-Sent Events. When true,
   * partial message deltas will be sent as OpenAI-compatible chunks.
   */
  stream?: boolean;

  /**
   * Sampling temperature (0 to 2). Higher values make output more random, lower
   * values make it more focused and deterministic. 0 = deterministic, 1 = balanced,
   * 2 = very creative.
   */
  temperature?: number | null;

  /**
   * Controls which tool is called by the model. Options: 'auto' (default), 'none',
   * 'required', or specific tool name. Can also be a dict specifying a particular
   * tool.
   */
  tool_choice?: string | { [key: string]: unknown } | null;

  /**
   * list of tools available to the model in OpenAI function calling format. Tools
   * are executed client-side and returned as JSON for the application to handle. Use
   * 'mcp_servers' for server-side tool execution.
   */
  tools?: Array<{ [key: string]: unknown }> | null;

  /**
   * Nucleus sampling parameter (0 to 1). Alternative to temperature. 0.1 = only top
   * 10% probability mass, 1.0 = consider all tokens.
   */
  top_p?: number | null;

  /**
   * Unique identifier representing your end-user. Used for monitoring and abuse
   * detection. Should be consistent across requests from the same user.
   */
  user?: string | null;
}

export namespace ChatCreateParams {
  export type ChatCreateParamsNonStreaming = ChatAPI.ChatCreateParamsNonStreaming;
  export type ChatCreateParamsStreaming = ChatAPI.ChatCreateParamsStreaming;
}

export interface ChatCreateParamsNonStreaming extends ChatCreateParamsBase {
  /**
   * Whether to stream back partial message deltas as Server-Sent Events. When true,
   * partial message deltas will be sent as OpenAI-compatible chunks.
   */
  stream?: false;
}

export interface ChatCreateParamsStreaming extends ChatCreateParamsBase {
  /**
   * Whether to stream back partial message deltas as Server-Sent Events. When true,
   * partial message deltas will be sent as OpenAI-compatible chunks.
   */
  stream: true;
}

export declare namespace Chat {
  export {
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type Completion as Completion,
    type CompletionRequest as CompletionRequest,
    type StreamChunk as StreamChunk,
    type TopLogprob as TopLogprob,
    type ChatCreateParams as ChatCreateParams,
    type ChatCreateParamsNonStreaming as ChatCreateParamsNonStreaming,
    type ChatCreateParamsStreaming as ChatCreateParamsStreaming,
  };
}
