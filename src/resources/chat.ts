// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as ChatAPI from './chat';
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
   * Example: Basic chat completion: ```python import dedalus_labs
   *
   *     client = dedalus_labs.Client(api_key="your-api-key")
   *
   *     completion = client.chat.create(
   *         model="gpt-4",
   *         input=[{"role": "user", "content": "Hello, how are you?"}],
   *     )
   *
   *     print(completion.choices[0].message.content)
   *     ```
   *
   *     With tools and MCP servers:
   *     ```python
   *     completion = client.chat.create(
   *         model="gpt-4",
   *         input=[{"role": "user", "content": "Search for recent AI news"}],
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
   *     completion = client.chat.create(
   *         model=["gpt-4o-mini", "gpt-4", "claude-3-5-sonnet"],
   *         input=[{"role": "user", "content": "Analyze this complex data"}],
   *         agent_attributes={"complexity": 0.8, "accuracy": 0.9},
   *     )
   *     ```
   *
   *     Streaming response:
   *     ```python
   *     stream = client.chat.create(
   *         model="gpt-4",
   *         input=[{"role": "user", "content": "Tell me a story"}],
   *         stream=True,
   *     )
   *
   *     for chunk in stream:
   *         if chunk.choices[0].delta.content:
   *             print(chunk.choices[0].delta.content, end="")
   *     ```
   */
  create(body: ChatCreateParamsNonStreaming, options?: RequestOptions): APIPromise<Completion>;
  create(body: ChatCreateParamsStreaming, options?: RequestOptions): APIPromise<Stream<StreamChunk>>;
  create(body: ChatCreateParamsBase, options?: RequestOptions): APIPromise<Stream<StreamChunk> | Completion>;
  create(
    body: ChatCreateParams,
    options?: RequestOptions,
  ): APIPromise<Completion> | APIPromise<Stream<StreamChunk>> {
    return this._client.post('/v1/chat', { body, ...options, stream: body.stream ?? false }) as
      | APIPromise<Completion>
      | APIPromise<Stream<StreamChunk>>;
  }
}

export interface Completion {
  id: string;

  choices: Array<Completion.Choice>;

  created: number;

  model: string;

  object: 'chat.completion';

  service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;

  system_fingerprint?: string | null;

  usage?: Completion.Usage | null;

  [k: string]: unknown;
}

export namespace Completion {
  export interface Choice {
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call';

    index: number;

    message: Choice.Message;

    logprobs?: Choice.Logprobs | null;

    [k: string]: unknown;
  }

  export namespace Choice {
    export interface Message {
      role: 'assistant';

      annotations?: Array<Message.Annotation> | null;

      audio?: Message.Audio | null;

      content?: string | null;

      function_call?: Message.FunctionCall | null;

      refusal?: string | null;

      tool_calls?: Array<Message.ToolCall> | null;

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

      export interface ToolCall {
        id: string;

        function: ToolCall.Function;

        type: 'function';

        [k: string]: unknown;
      }

      export namespace ToolCall {
        export interface Function {
          arguments: string;

          name: string;

          [k: string]: unknown;
        }
      }
    }

    export interface Logprobs {
      content?: Array<Logprobs.Content> | null;

      refusal?: Array<Logprobs.Refusal> | null;

      [k: string]: unknown;
    }

    export namespace Logprobs {
      export interface Content {
        token: string;

        logprob: number;

        top_logprobs: Array<Content.TopLogprob>;

        bytes?: Array<number> | null;

        [k: string]: unknown;
      }

      export namespace Content {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;

          [k: string]: unknown;
        }
      }

      export interface Refusal {
        token: string;

        logprob: number;

        top_logprobs: Array<Refusal.TopLogprob>;

        bytes?: Array<number> | null;

        [k: string]: unknown;
      }

      export namespace Refusal {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;

          [k: string]: unknown;
        }
      }
    }
  }

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
 * This model supports both the OpenAI-standard 'messages' field and the
 * Dedalus-specific 'input' field for maximum compatibility. The 'input' field can
 * handle various modalities beyond text messages.
 *
 * Key Features: - Multi-model routing with intelligent handoffs - MCP (Model
 * Context Protocol) server integration - Advanced agent attributes for routing
 * decisions - Client-side and server-side tool execution - Streaming and
 * non-streaming responses - Automatic usage tracking and billing
 *
 * Examples: Basic chat completion:
 * `python request = ChatCompletionRequest( model="gpt-4", input=[ {"role": "user", "content": "Hello, how are you?"} ] ) `
 *
 *     Multi-model routing with attributes:
 *     ```python
 *     request = ChatCompletionRequest(
 *         model=["gpt-4o-mini", "gpt-4", "claude-3-5-sonnet"],
 *         input=[
 *             {"role": "user", "content": "Analyze this complex problem"}
 *         ],
 *         agent_attributes={
 *             "complexity": 0.8,
 *             "accuracy": 0.9
 *         },
 *         model_attributes={
 *             "gpt-4": {"intelligence": 0.9, "cost": 0.8},
 *             "claude-3-5-sonnet": {"intelligence": 0.95, "cost": 0.7}
 *         }
 *     )
 *     ```
 *
 *     With tools and MCP servers:
 *     ```python
 *     request = ChatCompletionRequest(
 *         model="gpt-4",
 *         input=[
 *             {"role": "user", "content": "Search for AI news"}
 *         ],
 *         tools=[
 *             {
 *                 "type": "function",
 *                 "function": {
 *                     "name": "search_web",
 *                     "description": "Search the web"
 *                 }
 *             }
 *         ],
 *         mcp_servers=["dedalus-labs/brave-search"],
 *         temperature=0.7,
 *         max_tokens=1000
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
   * Input to the model - can be messages, images, or other modalities. Supports
   * OpenAI chat format with role/content structure. For multimodal inputs, content
   * can include text, images, or other media types.
   */
  input?: Array<{ [key: string]: unknown }> | null;

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
   * Model(s) to use for completion. Can be a single model ID or a list for
   * multi-model routing. Single model: 'gpt-4', 'claude-3-5-sonnet-20241022',
   * 'gpt-4o-mini'. Multi-model routing: ['gpt-4o-mini', 'gpt-4',
   * 'claude-3-5-sonnet'] - agent will choose optimal model based on task complexity.
   */
  model?: string | Array<string> | null;

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
   * partial message deltas will be sent as chunks in OpenAI format.
   */
  stream?: boolean | null;

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
   * List of tools available to the model in OpenAI function calling format. Tools
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

export interface StreamChunk {
  id: string;

  choices: Array<StreamChunk.Choice>;

  created: number;

  model: string;

  object: 'chat.completion.chunk';

  service_tier?: 'auto' | 'default' | 'flex' | 'scale' | 'priority' | null;

  system_fingerprint?: string | null;

  usage?: StreamChunk.Usage | null;

  [k: string]: unknown;
}

export namespace StreamChunk {
  export interface Choice {
    delta: Choice.Delta;

    index: number;

    finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;

    logprobs?: Choice.Logprobs | null;

    [k: string]: unknown;
  }

  export namespace Choice {
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

    export interface Logprobs {
      content?: Array<Logprobs.Content> | null;

      refusal?: Array<Logprobs.Refusal> | null;

      [k: string]: unknown;
    }

    export namespace Logprobs {
      export interface Content {
        token: string;

        logprob: number;

        top_logprobs: Array<Content.TopLogprob>;

        bytes?: Array<number> | null;

        [k: string]: unknown;
      }

      export namespace Content {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;

          [k: string]: unknown;
        }
      }

      export interface Refusal {
        token: string;

        logprob: number;

        top_logprobs: Array<Refusal.TopLogprob>;

        bytes?: Array<number> | null;

        [k: string]: unknown;
      }

      export namespace Refusal {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;

          [k: string]: unknown;
        }
      }
    }
  }

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
   * Input to the model - can be messages, images, or other modalities. Supports
   * OpenAI chat format with role/content structure. For multimodal inputs, content
   * can include text, images, or other media types.
   */
  input?: Array<{ [key: string]: unknown }> | null;

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
   * Model(s) to use for completion. Can be a single model ID or a list for
   * multi-model routing. Single model: 'gpt-4', 'claude-3-5-sonnet-20241022',
   * 'gpt-4o-mini'. Multi-model routing: ['gpt-4o-mini', 'gpt-4',
   * 'claude-3-5-sonnet'] - agent will choose optimal model based on task complexity.
   */
  model?: string | Array<string> | null;

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
   * partial message deltas will be sent as chunks in OpenAI format.
   */
  stream?: boolean | null;

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
   * List of tools available to the model in OpenAI function calling format. Tools
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
   * partial message deltas will be sent as chunks in OpenAI format.
   */
  stream?: false | null;
}

export interface ChatCreateParamsStreaming extends ChatCreateParamsBase {
  /**
   * Whether to stream back partial message deltas as Server-Sent Events. When true,
   * partial message deltas will be sent as chunks in OpenAI format.
   */
  stream: true;
}

export declare namespace Chat {
  export {
    type Completion as Completion,
    type CompletionRequest as CompletionRequest,
    type StreamChunk as StreamChunk,
    type ChatCreateParams as ChatCreateParams,
    type ChatCreateParamsNonStreaming as ChatCreateParamsNonStreaming,
    type ChatCreateParamsStreaming as ChatCreateParamsStreaming,
  };
}
