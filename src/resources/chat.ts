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
}

export namespace Completion {
  export interface Choice {
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call';

    index: number;

    message: Choice.Message;

    logprobs?: Choice.Logprobs | null;
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
    }

    export namespace Message {
      export interface Annotation {
        type: 'url_citation';

        url_citation: Annotation.URLCitation;
      }

      export namespace Annotation {
        export interface URLCitation {
          end_index: number;

          start_index: number;

          title: string;

          url: string;
        }
      }

      export interface Audio {
        id: string;

        data: string;

        expires_at: number;

        transcript: string;
      }

      export interface FunctionCall {
        arguments: string;

        name: string;
      }

      export interface ToolCall {
        id: string;

        function: ToolCall.Function;

        type: 'function';
      }

      export namespace ToolCall {
        export interface Function {
          arguments: string;

          name: string;
        }
      }
    }

    export interface Logprobs {
      content?: Array<Logprobs.Content> | null;

      refusal?: Array<Logprobs.Refusal> | null;
    }

    export namespace Logprobs {
      export interface Content {
        token: string;

        logprob: number;

        top_logprobs: Array<Content.TopLogprob>;

        bytes?: Array<number> | null;
      }

      export namespace Content {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;
        }
      }

      export interface Refusal {
        token: string;

        logprob: number;

        top_logprobs: Array<Refusal.TopLogprob>;

        bytes?: Array<number> | null;
      }

      export namespace Refusal {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;
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
  }

  export namespace Usage {
    export interface CompletionTokensDetails {
      accepted_prediction_tokens?: number | null;

      audio_tokens?: number | null;

      reasoning_tokens?: number | null;

      rejected_prediction_tokens?: number | null;
    }

    export interface PromptTokensDetails {
      audio_tokens?: number | null;

      cached_tokens?: number | null;
    }
  }
}

/**
 * Request model for chat completions.
 */
export interface CompletionRequest {
  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Frequency penalty (-2 to 2). Positive values penalize new tokens based on their
   * existing frequency in the text so far.
   */
  frequency_penalty?: number | null;

  /**
   * Input to the model - can be messages, images, or other modalities. Supports
   * OpenAI chat format with role/content structure. For multimodal inputs, content
   * can include text, images, or other media types.
   */
  input?: Array<unknown> | null;

  /**
   * Modify likelihood of specified tokens appearing in the completion.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Maximum number of tokens to generate in the completion.
   */
  max_tokens?: number | null;

  /**
   * Maximum number of turns for agent execution before terminating (default: 10).
   */
  max_turns?: number | null;

  /**
   * MCP (Model Context Protocol) server addresses to make available for server-side
   * tool execution.
   */
  mcp_servers?: Array<string> | null;

  /**
   * Model(s) to use for completion. Can be a single model ID, a Model object, or a
   * list for multi-model routing.
   */
  model?: string | Array<string> | CompletionRequest.Model | Array<CompletionRequest.UnionMember3> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * Number of completions to generate. Note: only n=1 is currently supported.
   */
  n?: number | null;

  /**
   * Presence penalty (-2 to 2). Positive values penalize new tokens based on whether
   * they appear in the text so far.
   */
  presence_penalty?: number | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: Array<string> | null;

  /**
   * Whether to stream back partial message deltas as Server-Sent Events.
   */
  stream?: boolean | null;

  /**
   * Sampling temperature (0 to 2). Higher values make output more random, lower
   * values make it more focused and deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which tool is called by the model.
   */
  tool_choice?: string | unknown | null;

  /**
   * List of tools available to the model in OpenAI function calling format.
   */
  tools?: Array<unknown> | null;

  /**
   * Nucleus sampling parameter (0 to 1). Alternative to temperature.
   */
  top_p?: number | null;

  /**
   * Unique identifier representing your end-user.
   */
  user?: string | null;
}

export namespace CompletionRequest {
  export interface Model {
    /**
     * Model identifier (e.g., 'gpt-4', 'claude-3-5-sonnet')
     */
    name: string;

    /**
     * Model attributes as scores between 0-1. Used for multi-model routing decisions.
     */
    attributes?: { [key: string]: number } | null;

    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    settings?: Model.Settings | null;
  }

  export namespace Model {
    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    export interface Settings {
      frequency_penalty?: number | null;

      include_usage?: boolean | null;

      input_audio_format?: string | null;

      max_tokens?: number | null;

      metadata?: { [key: string]: string } | null;

      modalities?: Array<string> | null;

      output_audio_format?: string | null;

      parallel_tool_calls?: boolean | null;

      presence_penalty?: number | null;

      store?: boolean | null;

      temperature?: number | null;

      top_p?: number | null;

      voice?: string | null;
    }
  }

  export interface UnionMember3 {
    /**
     * Model identifier (e.g., 'gpt-4', 'claude-3-5-sonnet')
     */
    name: string;

    /**
     * Model attributes as scores between 0-1. Used for multi-model routing decisions.
     */
    attributes?: { [key: string]: number } | null;

    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    settings?: UnionMember3.Settings | null;
  }

  export namespace UnionMember3 {
    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    export interface Settings {
      frequency_penalty?: number | null;

      include_usage?: boolean | null;

      input_audio_format?: string | null;

      max_tokens?: number | null;

      metadata?: { [key: string]: string } | null;

      modalities?: Array<string> | null;

      output_audio_format?: string | null;

      parallel_tool_calls?: boolean | null;

      presence_penalty?: number | null;

      store?: boolean | null;

      temperature?: number | null;

      top_p?: number | null;

      voice?: string | null;
    }
  }
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
}

export namespace StreamChunk {
  export interface Choice {
    delta: Choice.Delta;

    index: number;

    finish_reason?: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;

    logprobs?: Choice.Logprobs | null;
  }

  export namespace Choice {
    export interface Delta {
      content?: string | null;

      function_call?: Delta.FunctionCall | null;

      refusal?: string | null;

      role?: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | null;

      tool_calls?: Array<Delta.ToolCall> | null;
    }

    export namespace Delta {
      export interface FunctionCall {
        arguments?: string | null;

        name?: string | null;
      }

      export interface ToolCall {
        index: number;

        id?: string | null;

        function?: ToolCall.Function | null;

        type?: 'function' | null;
      }

      export namespace ToolCall {
        export interface Function {
          arguments?: string | null;

          name?: string | null;
        }
      }
    }

    export interface Logprobs {
      content?: Array<Logprobs.Content> | null;

      refusal?: Array<Logprobs.Refusal> | null;
    }

    export namespace Logprobs {
      export interface Content {
        token: string;

        logprob: number;

        top_logprobs: Array<Content.TopLogprob>;

        bytes?: Array<number> | null;
      }

      export namespace Content {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;
        }
      }

      export interface Refusal {
        token: string;

        logprob: number;

        top_logprobs: Array<Refusal.TopLogprob>;

        bytes?: Array<number> | null;
      }

      export namespace Refusal {
        export interface TopLogprob {
          token: string;

          logprob: number;

          bytes?: Array<number> | null;
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
  }

  export namespace Usage {
    export interface CompletionTokensDetails {
      accepted_prediction_tokens?: number | null;

      audio_tokens?: number | null;

      reasoning_tokens?: number | null;

      rejected_prediction_tokens?: number | null;
    }

    export interface PromptTokensDetails {
      audio_tokens?: number | null;

      cached_tokens?: number | null;
    }
  }
}

export type ChatCreateParams = ChatCreateParamsNonStreaming | ChatCreateParamsStreaming;

export interface ChatCreateParamsBase {
  /**
   * Attributes for the agent itself, influencing behavior and model selection.
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Frequency penalty (-2 to 2). Positive values penalize new tokens based on their
   * existing frequency in the text so far.
   */
  frequency_penalty?: number | null;

  /**
   * Input to the model - can be messages, images, or other modalities. Supports
   * OpenAI chat format with role/content structure. For multimodal inputs, content
   * can include text, images, or other media types.
   */
  input?: Array<unknown> | null;

  /**
   * Modify likelihood of specified tokens appearing in the completion.
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Maximum number of tokens to generate in the completion.
   */
  max_tokens?: number | null;

  /**
   * Maximum number of turns for agent execution before terminating (default: 10).
   */
  max_turns?: number | null;

  /**
   * MCP (Model Context Protocol) server addresses to make available for server-side
   * tool execution.
   */
  mcp_servers?: Array<string> | null;

  /**
   * Model(s) to use for completion. Can be a single model ID, a Model object, or a
   * list for multi-model routing.
   */
  model?: string | Array<string> | ChatCreateParams.Model | Array<ChatCreateParams.UnionMember3> | null;

  /**
   * Attributes for individual models used in routing decisions during multi-model
   * execution.
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * Number of completions to generate. Note: only n=1 is currently supported.
   */
  n?: number | null;

  /**
   * Presence penalty (-2 to 2). Positive values penalize new tokens based on whether
   * they appear in the text so far.
   */
  presence_penalty?: number | null;

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   */
  stop?: Array<string> | null;

  /**
   * Whether to stream back partial message deltas as Server-Sent Events.
   */
  stream?: boolean | null;

  /**
   * Sampling temperature (0 to 2). Higher values make output more random, lower
   * values make it more focused and deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which tool is called by the model.
   */
  tool_choice?: string | unknown | null;

  /**
   * List of tools available to the model in OpenAI function calling format.
   */
  tools?: Array<unknown> | null;

  /**
   * Nucleus sampling parameter (0 to 1). Alternative to temperature.
   */
  top_p?: number | null;

  /**
   * Unique identifier representing your end-user.
   */
  user?: string | null;
}

export namespace ChatCreateParams {
  export interface Model {
    /**
     * Model identifier (e.g., 'gpt-4', 'claude-3-5-sonnet')
     */
    name: string;

    /**
     * Model attributes as scores between 0-1. Used for multi-model routing decisions.
     */
    attributes?: { [key: string]: number } | null;

    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    settings?: Model.Settings | null;
  }

  export namespace Model {
    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    export interface Settings {
      frequency_penalty?: number | null;

      include_usage?: boolean | null;

      input_audio_format?: string | null;

      max_tokens?: number | null;

      metadata?: { [key: string]: string } | null;

      modalities?: Array<string> | null;

      output_audio_format?: string | null;

      parallel_tool_calls?: boolean | null;

      presence_penalty?: number | null;

      store?: boolean | null;

      temperature?: number | null;

      top_p?: number | null;

      voice?: string | null;
    }
  }

  export interface UnionMember3 {
    /**
     * Model identifier (e.g., 'gpt-4', 'claude-3-5-sonnet')
     */
    name: string;

    /**
     * Model attributes as scores between 0-1. Used for multi-model routing decisions.
     */
    attributes?: { [key: string]: number } | null;

    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    settings?: UnionMember3.Settings | null;
  }

  export namespace UnionMember3 {
    /**
     * Model generation settings including temperature, max_tokens, and other
     * parameters.
     */
    export interface Settings {
      frequency_penalty?: number | null;

      include_usage?: boolean | null;

      input_audio_format?: string | null;

      max_tokens?: number | null;

      metadata?: { [key: string]: string } | null;

      modalities?: Array<string> | null;

      output_audio_format?: string | null;

      parallel_tool_calls?: boolean | null;

      presence_penalty?: number | null;

      store?: boolean | null;

      temperature?: number | null;

      top_p?: number | null;

      voice?: string | null;
    }
  }

  export type ChatCreateParamsNonStreaming = ChatAPI.ChatCreateParamsNonStreaming;
  export type ChatCreateParamsStreaming = ChatAPI.ChatCreateParamsStreaming;
}

export interface ChatCreateParamsNonStreaming extends ChatCreateParamsBase {
  /**
   * Whether to stream back partial message deltas as Server-Sent Events.
   */
  stream?: false | null;
}

export interface ChatCreateParamsStreaming extends ChatCreateParamsBase {
  /**
   * Whether to stream back partial message deltas as Server-Sent Events.
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
