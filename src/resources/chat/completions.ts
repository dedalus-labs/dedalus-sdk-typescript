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
 * A URL citation when using web search.
 *
 * Fields:
 *
 * - type (required): Literal["url_citation"]
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
  url_citation: URLCitation;
}

/**
 * Messages sent by the model in response to user messages.
 *
 * Fields:
 *
 * - content (optional): str |
 *   Annotated[list[ChatCompletionRequestAssistantMessageContentPart], MinLen(1)] |
 *   None
 * - refusal (optional): str | None
 * - role (required): Literal["assistant"]
 * - name (optional): str
 * - audio (optional): Audio | None
 * - tool_calls (optional): ChatCompletionMessageToolCalls
 * - function_call (optional): FunctionCallInline | None
 */
export interface ChatCompletionAssistantMessageParam {
  /**
   * The role of the messages author, in this case `assistant`.
   */
  role: 'assistant';

  /**
   * Data about a previous audio response from the model.
   * [Learn more](https://platform.openai.com/docs/guides/audio).
   *
   * Fields:
   *
   * - id (required): str
   */
  audio?: ChatCompletionAudioParam | null;

  /**
   * The contents of the assistant message. Required unless `tool_calls` or
   * `function_call` is specified.
   */
  content?: string | Array<ChatCompletionContentPartTextParam | ChatCompletionContentPartRefusalParam> | null;

  /**
   * Deprecated and replaced by `tool_calls`. The name and arguments of a function
   * that should be called, as generated by the model.
   *
   * Fields:
   *
   * - arguments (required): str
   * - name (required): str
   */
  function_call?: ChatCompletionAssistantMessageParam.FunctionCall | null;

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
    | ChatCompletionAssistantMessageParam.ChatCompletionMessageToolCallInput
    | ChatCompletionMessageCustomToolCall
  >;
}

export namespace ChatCompletionAssistantMessageParam {
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
   * - type (required): Literal["function"]
   * - function (required): ChatCompletionMessageToolCallFunction
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
}

/**
 * If the audio output modality is requested, this object contains data about the
 * audio response from the model.
 * [Learn more](https://platform.openai.com/docs/guides/audio).
 *
 * Fields:
 *
 * - id (required): str
 * - expires_at (required): int
 * - data (required): str
 * - transcript (required): str
 */
export interface ChatCompletionAudio {
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
 * Data about a previous audio response from the model.
 * [Learn more](https://platform.openai.com/docs/guides/audio).
 *
 * Fields:
 *
 * - id (required): str
 */
export interface ChatCompletionAudioParam {
  /**
   * Unique identifier for a previous audio response from the model.
   */
  id: string;
}

/**
 * Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).
 *
 * Fields:
 *
 * - type (required): Literal["input_audio"]
 * - input_audio (required): ChatCompletionRequestMessageContentPartAudioInputAudio
 */
export interface ChatCompletionContentPartAudioParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartAudioInputAudio.
   *
   * Fields:
   *
   * - data (required): str
   * - format (required): Literal["wav", "mp3"]
   */
  input_audio: ChatCompletionContentPartAudioParam.InputAudio;

  /**
   * The type of the content part. Always `input_audio`.
   */
  type: 'input_audio';
}

export namespace ChatCompletionContentPartAudioParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartAudioInputAudio.
   *
   * Fields:
   *
   * - data (required): str
   * - format (required): Literal["wav", "mp3"]
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
 * - type (required): Literal["file"]
 * - file (required): ChatCompletionRequestMessageContentPartFileFile
 */
export interface ChatCompletionContentPartFileParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartFileFile.
   *
   * Fields:
   *
   * - filename (optional): str
   * - file_data (optional): str
   * - file_id (optional): str
   */
  file: ChatCompletionContentPartFileParam.File;

  /**
   * The type of the content part. Always `file`.
   */
  type: 'file';
}

export namespace ChatCompletionContentPartFileParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartFileFile.
   *
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

/**
 * Learn about [image inputs](https://platform.openai.com/docs/guides/vision).
 *
 * Fields:
 *
 * - type (required): Literal["image_url"]
 * - image_url (required): ChatCompletionRequestMessageContentPartImageImageUrl
 */
export interface ChatCompletionContentPartImageParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartImageImageUrl.
   *
   * Fields:
   *
   * - url (required): AnyUrl
   * - detail (optional): Literal["auto", "low", "high"]
   */
  image_url: ChatCompletionContentPartImageParam.ImageURL;

  /**
   * The type of the content part.
   */
  type: 'image_url';
}

export namespace ChatCompletionContentPartImageParam {
  /**
   * Schema for ChatCompletionRequestMessageContentPartImageImageUrl.
   *
   * Fields:
   *
   * - url (required): AnyUrl
   * - detail (optional): Literal["auto", "low", "high"]
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
 * Schema for ChatCompletionRequestMessageContentPartRefusal.
 *
 * Fields:
 *
 * - type (required): Literal["refusal"]
 * - refusal (required): str
 */
export interface ChatCompletionContentPartRefusalParam {
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
 * Learn about
 * [text inputs](https://platform.openai.com/docs/guides/text-generation).
 *
 * Fields:
 *
 * - type (required): Literal["text"]
 * - text (required): str
 */
export interface ChatCompletionContentPartTextParam {
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
 * Developer-provided instructions that the model should follow, regardless of
 * messages sent by the user. With o1 models and newer, `developer` messages
 * replace the previous `system` messages.
 *
 * Fields:
 *
 * - content (required): str |
 *   Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]
 * - role (required): Literal["developer"]
 * - name (optional): str
 */
export interface ChatCompletionDeveloperMessageParam {
  /**
   * The contents of the developer message.
   */
  content: string | Array<ChatCompletionContentPartTextParam>;

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

/**
 * Schema for ChatCompletionRequestFunctionMessage.
 *
 * Fields:
 *
 * - role (required): Literal["function"]
 * - content (required): str | None
 * - name (required): str
 */
export interface ChatCompletionFunctionMessageParam {
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
 * Schema for ChatCompletionFunctions.
 *
 * Fields:
 *
 * - description (optional): str
 * - name (required): str
 * - parameters (optional): FunctionParameters
 */
export interface ChatCompletionFunctions {
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
  parameters?: Shared.FunctionParameters;
}

/**
 * A chat completion message generated by the model.
 *
 * Fields:
 *
 * - content (required): str | None
 * - refusal (required): str | None
 * - tool_calls (optional): ChatCompletionMessageToolCalls
 * - annotations (optional): list[AnnotationsItem]
 * - role (required): Literal["assistant"]
 * - function_call (optional): FunctionCall
 * - audio (optional): Audio | None
 */
export interface ChatCompletionMessage {
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
  annotations?: Array<Annotation>;

  /**
   * If the audio output modality is requested, this object contains data about the
   * audio response from the model.
   * [Learn more](https://platform.openai.com/docs/guides/audio).
   *
   * Fields:
   *
   * - id (required): str
   * - expires_at (required): int
   * - data (required): str
   * - transcript (required): str
   */
  audio?: ChatCompletionAudio | null;

  /**
   * Deprecated and replaced by `tool_calls`. The name and arguments of a function
   * that should be called, as generated by the model.
   */
  function_call?: FunctionCall;

  /**
   * The tool calls generated by the model, such as function calls.
   */
  tool_calls?: Array<ChatCompletionMessageToolCall | ChatCompletionMessageCustomToolCall>;
}

/**
 * A call to a custom tool created by the model.
 *
 * Fields:
 *
 * - id (required): str
 * - type (required): Literal["custom"]
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
  custom: Custom;

  /**
   * The type of the tool. Always `custom`.
   */
  type: 'custom';
}

/**
 * A call to a function tool created by the model.
 *
 * Fields:
 *
 * - id (required): str
 * - type (required): Literal["function"]
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
  function: Function;

  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
}

/**
 * Developer-provided instructions that the model should follow, regardless of
 * messages sent by the user. With o1 models and newer, use `developer` messages
 * for this purpose instead.
 *
 * Fields:
 *
 * - content (required): str |
 *   Annotated[list[ChatCompletionRequestSystemMessageContentPart], MinLen(1)]
 * - role (required): Literal["system"]
 * - name (optional): str
 */
export interface ChatCompletionSystemMessageParam {
  /**
   * The contents of the system message.
   */
  content: string | Array<ChatCompletionContentPartTextParam>;

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
 * Schema for ChatCompletionRequestToolMessage.
 *
 * Fields:
 *
 * - role (required): Literal["tool"]
 * - content (required): str |
 *   Annotated[list[ChatCompletionRequestToolMessageContentPart], MinLen(1)]
 * - tool_call_id (required): str
 */
export interface ChatCompletionToolMessageParam {
  /**
   * The contents of the tool message.
   */
  content: string | Array<ChatCompletionContentPartTextParam>;

  /**
   * The role of the messages author, in this case `tool`.
   */
  role: 'tool';

  /**
   * Tool call that this message is responding to.
   */
  tool_call_id: string;
}

/**
 * A function tool that can be used to generate a response.
 *
 * Fields:
 *
 * - type (required): Literal["function"]
 * - function (required): FunctionObject
 */
export interface ChatCompletionToolParam {
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
  function: Shared.FunctionDefinition;

  /**
   * The type of the tool. Currently, only `function` is supported.
   */
  type: 'function';
}

/**
 * Messages sent by an end user, containing prompts or additional context
 * information.
 *
 * Fields:
 *
 * - content (required): str |
 *   Annotated[list[ChatCompletionRequestUserMessageContentPart], MinLen(1)]
 * - role (required): Literal["user"]
 * - name (optional): str
 */
export interface ChatCompletionUserMessageParam {
  /**
   * The contents of the user message.
   */
  content:
    | string
    | Array<
        | ChatCompletionContentPartTextParam
        | ChatCompletionContentPartImageParam
        | ChatCompletionContentPartAudioParam
        | ChatCompletionContentPartFileParam
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
  message: ChatCompletionMessage;

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
  logprobs?: ChoiceLogprobs | null;
}

export interface ChoiceDelta {
  content?: string | null;

  function_call?: ChoiceDeltaFunctionCall | null;

  refusal?: string | null;

  role?: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | null;

  tool_calls?: Array<ChoiceDeltaToolCall> | null;

  [k: string]: unknown;
}

export interface ChoiceDeltaFunctionCall {
  arguments?: string | null;

  name?: string | null;

  [k: string]: unknown;
}

export interface ChoiceDeltaToolCall {
  index: number;

  id?: string | null;

  function?: ChoiceDeltaToolCallFunction | null;

  type?: 'function' | null;

  [k: string]: unknown;
}

export interface ChoiceDeltaToolCallFunction {
  arguments?: string | null;

  name?: string | null;

  [k: string]: unknown;
}

/**
 * Log probability information for the choice.
 */
export interface ChoiceLogprobs {
  /**
   * A list of message content tokens with log probability information.
   */
  content?: Array<ChatCompletionTokenLogprob> | null;

  /**
   * A list of message refusal tokens with log probability information.
   */
  refusal?: Array<ChatCompletionTokenLogprob> | null;
}

/**
 * A streaming chat completion choice chunk.
 *
 * OpenAI-compatible choice object for streaming responses. Part of the
 * ChatCompletionChunk response in SSE streams.
 */
export interface ChunkChoice {
  /**
   * Delta content for streaming responses
   */
  delta: ChoiceDelta;

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
  logprobs?: ChoiceLogprobs | null;
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
  choices: Array<Choice>;

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
  usage?: CompletionUsage;
}

/**
 * ChatCompletion request schema.
 *
 * Supports OpenAI-compatible parameters, provider-specific extensions, server-side
 * execution, and agent orchestration features.
 */
export interface CompletionRequest {
  /**
   * Model identifier. Accepts model ID strings, lists for routing, or DedalusModel
   * objects with per-model settings.
   */
  model: string | Shared.DedalusModel | Array<Shared.DedalusModelChoice>;

  /**
   * Agent attributes. Values in [0.0, 1.0].
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when audio output is requested with `mo...
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * Execute tools server-side. If false, returns raw tool calls for manual handling.
   */
  automatic_tool_execution?: boolean;

  /**
   * Optional. The name of the content [cached](https://ai.google.dev/gemini-api/d...
   */
  cachedContent?: string | null;

  /**
   * If set to `true`, the request returns a `request_id`. You can then get the de...
   */
  deferred?: boolean | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on the...
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of `tool_choice`. Controls which (if any) function is ca...
   */
  function_call?: string | null;

  /**
   * Deprecated in favor of `tools`. A list of functions the model may generate J...
   */
  functions?: Array<ChatCompletionFunctions> | null;

  /**
   * Generation parameters wrapper (Google-specific)
   */
  generation_config?: { [key: string]: unknown } | null;

  /**
   * Content filtering and safety policy configuration.
   */
  guardrails?: Array<{ [key: string]: unknown }> | null;

  /**
   * Configuration for multi-model handoffs.
   */
  handoff_config?: { [key: string]: unknown } | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accep...
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens or not. If true, ret...
   */
  logprobs?: boolean | null;

  /**
   * Maximum tokens in completion (newer parameter name)
   */
  max_completion_tokens?: number | null;

  /**
   * Maximum tokens in completion
   */
  max_tokens?: number | null;

  /**
   * Maximum conversation turns.
   */
  max_turns?: number | null;

  /**
   * MCP server identifiers. Accepts URLs, repository slugs, or server IDs.
   */
  mcp_servers?: string | Array<string> | null;

  /**
   * Conversation history (OpenAI: messages, Google: contents, Responses: input)
   */
  messages?: Array<
    | ChatCompletionDeveloperMessageParam
    | ChatCompletionSystemMessageParam
    | ChatCompletionUserMessageParam
    | ChatCompletionAssistantMessageParam
    | ChatCompletionToolMessageParam
    | ChatCompletionFunctionMessageParam
  > | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be usef...
   */
  metadata?: { [key: string]: unknown } | null;

  /**
   * Output types that you would like the model to generate. Most models are capab...
   */
  modalities?: Array<string> | null;

  /**
   * Model attributes for routing. Maps model IDs to attribute dictionaries with
   * values in [0.0, 1.0].
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Note tha...
   */
  n?: number | null;

  /**
   * Whether to enable parallel tool calls (Anthropic uses inverted polarity)
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   *
   * Fields:
   *
   * - type (required): Literal["content"]
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]
   */
  prediction?: PredictionContent | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whe...
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache...
   */
  prompt_cache_key?: string | null;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended pr...
   */
  prompt_cache_retention?: string | null;

  /**
   * Allows toggling between the reasoning mode and no system prompt. When set to ...
   */
  prompt_mode?: { [key: string]: unknown } | null;

  /**
   * Constrains effort on reasoning for [reasoning models](https://platform.openai...
   */
  reasoning_effort?: string | null;

  /**
   * An object specifying the format that the model must output. Setting to `{ "...
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
   * A stable identifier used to help detect users of your application that may be...
   */
  safety_identifier?: string | null;

  /**
   * Safety/content filtering settings (Google-specific)
   */
  safety_settings?: Array<CompletionRequest.SafetySetting> | null;

  /**
   * Set the parameters to be used for searched data. If not set, no data will be ...
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * Random seed for deterministic output
   */
  seed?: number | null;

  /**
   * Service tier for request processing
   */
  service_tier?: string | null;

  /**
   * Not supported with latest reasoning models `o3` and `o4-mini`. Up to 4 seque...
   */
  stop?: Array<string> | string | null;

  /**
   * Custom text sequences that will cause the model to stop generating. Our mode...
   */
  stop_sequences?: Array<string> | null;

  /**
   * Whether or not to store the output of this chat completion request for use in...
   */
  store?: boolean | null;

  /**
   * Enable streaming response
   */
  stream?: boolean | null;

  /**
   * Options for streaming response. Only set this when you set `stream: true`.
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System instruction/prompt
   */
  system_instruction?: { [key: string]: unknown } | string | null;

  /**
   * Sampling temperature (0-2 for most providers)
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic-specific)
   */
  thinking?: ThinkingConfigEnabled | ThinkingConfigDisabled | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model w...
   */
  tool_choice?: ToolChoiceAuto | ToolChoiceAny | ToolChoiceTool | ToolChoiceNone | null;

  /**
   * Tool calling configuration (Google-specific)
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * Available tools/functions for the model
   */
  tools?: Array<ChatCompletionToolParam | CompletionRequest.CustomToolChatCompletions> | null;

  /**
   * Top-k sampling parameter
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying the number of most likely tokens to re...
   */
  top_logprobs?: number | null;

  /**
   * Nucleus sampling threshold
   */
  top_p?: number | null;

  /**
   * This field is being replaced by `safety_identifier` and `prompt_cache_key`. U...
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in...
   */
  verbosity?: string | null;

  /**
   * This tool searches the web for relevant results to use in a response. Learn m...
   */
  web_search_options?: { [key: string]: unknown } | null;

  [k: string]: unknown;
}

export namespace CompletionRequest {
  /**
   * Safety setting, affecting the safety-blocking behavior.
   *
   * Passing a safety setting for a category changes the allowed probability that
   * content is blocked.
   *
   * Fields:
   *
   * - category (required): HarmCategory
   * - threshold (required): Literal["HARM_BLOCK_THRESHOLD_UNSPECIFIED",
   *   "BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH",
   *   "BLOCK_NONE", "OFF"]
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

  /**
   * A custom tool that processes input using a specified format.
   *
   * Fields:
   *
   * - type (required): Literal["custom"]
   * - custom (required): CustomToolProperties
   */
  export interface CustomToolChatCompletions {
    /**
     * Properties of the custom tool.
     */
    custom: CustomToolChatCompletions.Custom;

    /**
     * The type of the custom tool. Always `custom`.
     */
    type: 'custom';
  }

  export namespace CustomToolChatCompletions {
    /**
     * Properties of the custom tool.
     */
    export interface Custom {
      /**
       * The name of the custom tool, used to identify it in tool calls.
       */
      name: string;

      /**
       * Optional description of the custom tool, used to provide more context.
       */
      description?: string;

      /**
       * The input format for the custom tool. Default is unconstrained text.
       */
      format?: Custom.TextFormat | Custom.GrammarFormat;
    }

    export namespace Custom {
      /**
       * Unconstrained free-form text.
       *
       * Fields:
       *
       * - type (required): Literal["text"]
       */
      export interface TextFormat {
        /**
         * Unconstrained text format. Always `text`.
         */
        type: 'text';
      }

      /**
       * A grammar defined by the user.
       *
       * Fields:
       *
       * - type (required): Literal["grammar"]
       * - grammar (required): GrammarFormatGrammarFormat
       */
      export interface GrammarFormat {
        /**
         * Your chosen grammar.
         */
        grammar: GrammarFormat.Grammar;

        /**
         * Grammar format. Always `grammar`.
         */
        type: 'grammar';
      }

      export namespace GrammarFormat {
        /**
         * Your chosen grammar.
         */
        export interface Grammar {
          /**
           * The grammar definition.
           */
          definition: string;

          /**
           * The syntax of the grammar definition. One of `lark` or `regex`.
           */
          syntax: 'lark' | 'regex';
        }
      }
    }
  }
}

/**
 * Breakdown of tokens used in a completion.
 *
 * Fields:
 *
 * - accepted_prediction_tokens (optional): int
 * - audio_tokens (optional): int
 * - reasoning_tokens (optional): int
 * - rejected_prediction_tokens (optional): int
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
export interface CompletionUsage {
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
  completion_tokens_details?: CompletionTokensDetails;

  /**
   * Breakdown of tokens used in the prompt.
   */
  prompt_tokens_details?: PromptTokensDetails;
}

/**
 * The custom tool that the model called.
 *
 * Fields:
 *
 * - name (required): str
 * - input (required): str
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

/**
 * The function that the model called.
 *
 * Fields:
 *
 * - name (required): str
 * - arguments (required): str
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
 * Details about the input tokens billed for this request.
 *
 * Fields:
 *
 * - text_tokens (optional): int
 * - audio_tokens (optional): int
 */
export interface InputTokenDetails {
  /**
   * Number of audio tokens billed for this request.
   */
  audio_tokens?: number;

  /**
   * Number of text tokens billed for this request.
   */
  text_tokens?: number;
}

/**
 * Static predicted output content, such as the content of a text file that is
 * being regenerated.
 *
 * Fields:
 *
 * - type (required): Literal["content"]
 * - content (required): str |
 *   Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]
 */
export interface PredictionContent {
  /**
   * The content that should be matched when generating a model response. If
   * generated tokens would match this content, the entire model response can be
   * returned much more quickly.
   */
  content: string | Array<ChatCompletionContentPartTextParam>;

  /**
   * The type of the predicted content you want to provide. This type is currently
   * always `content`.
   */
  type: 'content';
}

/**
 * Breakdown of tokens used in the prompt.
 *
 * Fields:
 *
 * - audio_tokens (optional): int
 * - cached_tokens (optional): int
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

export interface Reasoning {
  effort?: 'minimal' | 'low' | 'medium' | 'high' | null;

  generate_summary?: 'auto' | 'concise' | 'detailed' | null;

  summary?: 'auto' | 'concise' | 'detailed' | null;

  [k: string]: unknown;
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
  choices: Array<ChunkChoice>;

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
  usage?: CompletionUsage | null;
}

/**
 * Schema for ThinkingConfigDisabled.
 *
 * Fields:
 *
 * - type (required): Literal["disabled"]
 */
export interface ThinkingConfigDisabled {
  type: 'disabled';
}

/**
 * Schema for ThinkingConfigEnabled.
 *
 * Fields:
 *
 * - budget_tokens (required): int
 * - type (required): Literal["enabled"]
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
   * [extended thinking](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)
   * for details.
   */
  budget_tokens: number;

  type: 'enabled';
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

/**
 * The model will use any available tools.
 *
 * Fields:
 *
 * - disable_parallel_tool_use (optional): bool
 * - type (required): Literal["any"]
 */
export interface ToolChoiceAny {
  type: 'any';

  /**
   * Whether to disable parallel tool use.
   *
   * Defaults to `false`. If set to `true`, the model will output exactly one tool
   * use.
   */
  disable_parallel_tool_use?: boolean;
}

/**
 * The model will automatically decide whether to use tools.
 *
 * Fields:
 *
 * - disable_parallel_tool_use (optional): bool
 * - type (required): Literal["auto"]
 */
export interface ToolChoiceAuto {
  type: 'auto';

  /**
   * Whether to disable parallel tool use.
   *
   * Defaults to `false`. If set to `true`, the model will output at most one tool
   * use.
   */
  disable_parallel_tool_use?: boolean;
}

/**
 * The model will not be allowed to use tools.
 *
 * Fields:
 *
 * - type (required): Literal["none"]
 */
export interface ToolChoiceNone {
  type: 'none';
}

/**
 * The model will use the specified tool with `tool_choice.name`.
 *
 * Fields:
 *
 * - disable_parallel_tool_use (optional): bool
 * - name (required): str
 * - type (required): Literal["tool"]
 */
export interface ToolChoiceTool {
  /**
   * The name of the tool to use.
   */
  name: string;

  type: 'tool';

  /**
   * Whether to disable parallel tool use.
   *
   * Defaults to `false`. If set to `true`, the model will output exactly one tool
   * use.
   */
  disable_parallel_tool_use?: boolean;
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

/**
 * A URL citation when using web search.
 *
 * Fields:
 *
 * - end_index (required): int
 * - start_index (required): int
 * - url (required): str
 * - title (required): str
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

export type CompletionCreateParams = CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming;

export interface CompletionCreateParamsBase {
  /**
   * Model identifier. Accepts model ID strings, lists for routing, or DedalusModel
   * objects with per-model settings.
   */
  model: string | Shared.DedalusModel | Array<Shared.DedalusModelChoice>;

  /**
   * Agent attributes. Values in [0.0, 1.0].
   */
  agent_attributes?: { [key: string]: number } | null;

  /**
   * Parameters for audio output. Required when audio output is requested with `mo...
   */
  audio?: { [key: string]: unknown } | null;

  /**
   * Execute tools server-side. If false, returns raw tool calls for manual handling.
   */
  automatic_tool_execution?: boolean;

  /**
   * Optional. The name of the content [cached](https://ai.google.dev/gemini-api/d...
   */
  cachedContent?: string | null;

  /**
   * If set to `true`, the request returns a `request_id`. You can then get the de...
   */
  deferred?: boolean | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on the...
   */
  frequency_penalty?: number | null;

  /**
   * Deprecated in favor of `tool_choice`. Controls which (if any) function is ca...
   */
  function_call?: string | null;

  /**
   * Deprecated in favor of `tools`. A list of functions the model may generate J...
   */
  functions?: Array<ChatCompletionFunctions> | null;

  /**
   * Generation parameters wrapper (Google-specific)
   */
  generation_config?: { [key: string]: unknown } | null;

  /**
   * Content filtering and safety policy configuration.
   */
  guardrails?: Array<{ [key: string]: unknown }> | null;

  /**
   * Configuration for multi-model handoffs.
   */
  handoff_config?: { [key: string]: unknown } | null;

  /**
   * Modify the likelihood of specified tokens appearing in the completion. Accep...
   */
  logit_bias?: { [key: string]: number } | null;

  /**
   * Whether to return log probabilities of the output tokens or not. If true, ret...
   */
  logprobs?: boolean | null;

  /**
   * Maximum tokens in completion (newer parameter name)
   */
  max_completion_tokens?: number | null;

  /**
   * Maximum tokens in completion
   */
  max_tokens?: number | null;

  /**
   * Maximum conversation turns.
   */
  max_turns?: number | null;

  /**
   * MCP server identifiers. Accepts URLs, repository slugs, or server IDs.
   */
  mcp_servers?: string | Array<string> | null;

  /**
   * Conversation history (OpenAI: messages, Google: contents, Responses: input)
   */
  messages?: Array<
    | ChatCompletionDeveloperMessageParam
    | ChatCompletionSystemMessageParam
    | ChatCompletionUserMessageParam
    | ChatCompletionAssistantMessageParam
    | ChatCompletionToolMessageParam
    | ChatCompletionFunctionMessageParam
  > | null;

  /**
   * Set of 16 key-value pairs that can be attached to an object. This can be usef...
   */
  metadata?: { [key: string]: unknown } | null;

  /**
   * Output types that you would like the model to generate. Most models are capab...
   */
  modalities?: Array<string> | null;

  /**
   * Model attributes for routing. Maps model IDs to attribute dictionaries with
   * values in [0.0, 1.0].
   */
  model_attributes?: { [key: string]: { [key: string]: number } } | null;

  /**
   * How many chat completion choices to generate for each input message. Note tha...
   */
  n?: number | null;

  /**
   * Whether to enable parallel tool calls (Anthropic uses inverted polarity)
   */
  parallel_tool_calls?: boolean | null;

  /**
   * Static predicted output content, such as the content of a text file that is
   * being regenerated.
   *
   * Fields:
   *
   * - type (required): Literal["content"]
   * - content (required): str |
   *   Annotated[list[ChatCompletionRequestMessageContentPartText], MinLen(1)]
   */
  prediction?: PredictionContent | null;

  /**
   * Number between -2.0 and 2.0. Positive values penalize new tokens based on whe...
   */
  presence_penalty?: number | null;

  /**
   * Used by OpenAI to cache responses for similar requests to optimize your cache...
   */
  prompt_cache_key?: string | null;

  /**
   * The retention policy for the prompt cache. Set to `24h` to enable extended pr...
   */
  prompt_cache_retention?: string | null;

  /**
   * Allows toggling between the reasoning mode and no system prompt. When set to ...
   */
  prompt_mode?: { [key: string]: unknown } | null;

  /**
   * Constrains effort on reasoning for [reasoning models](https://platform.openai...
   */
  reasoning_effort?: string | null;

  /**
   * An object specifying the format that the model must output. Setting to `{ "...
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
   * A stable identifier used to help detect users of your application that may be...
   */
  safety_identifier?: string | null;

  /**
   * Safety/content filtering settings (Google-specific)
   */
  safety_settings?: Array<CompletionCreateParams.SafetySetting> | null;

  /**
   * Set the parameters to be used for searched data. If not set, no data will be ...
   */
  search_parameters?: { [key: string]: unknown } | null;

  /**
   * Random seed for deterministic output
   */
  seed?: number | null;

  /**
   * Service tier for request processing
   */
  service_tier?: string | null;

  /**
   * Not supported with latest reasoning models `o3` and `o4-mini`. Up to 4 seque...
   */
  stop?: Array<string> | string | null;

  /**
   * Custom text sequences that will cause the model to stop generating. Our mode...
   */
  stop_sequences?: Array<string> | null;

  /**
   * Whether or not to store the output of this chat completion request for use in...
   */
  store?: boolean | null;

  /**
   * Enable streaming response
   */
  stream?: boolean | null;

  /**
   * Options for streaming response. Only set this when you set `stream: true`.
   */
  stream_options?: { [key: string]: unknown } | null;

  /**
   * System instruction/prompt
   */
  system_instruction?: { [key: string]: unknown } | string | null;

  /**
   * Sampling temperature (0-2 for most providers)
   */
  temperature?: number | null;

  /**
   * Extended thinking configuration (Anthropic-specific)
   */
  thinking?: ThinkingConfigEnabled | ThinkingConfigDisabled | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model w...
   */
  tool_choice?: ToolChoiceAuto | ToolChoiceAny | ToolChoiceTool | ToolChoiceNone | null;

  /**
   * Tool calling configuration (Google-specific)
   */
  tool_config?: { [key: string]: unknown } | null;

  /**
   * Available tools/functions for the model
   */
  tools?: Array<ChatCompletionToolParam | CompletionCreateParams.CustomToolChatCompletions> | null;

  /**
   * Top-k sampling parameter
   */
  top_k?: number | null;

  /**
   * An integer between 0 and 20 specifying the number of most likely tokens to re...
   */
  top_logprobs?: number | null;

  /**
   * Nucleus sampling threshold
   */
  top_p?: number | null;

  /**
   * This field is being replaced by `safety_identifier` and `prompt_cache_key`. U...
   */
  user?: string | null;

  /**
   * Constrains the verbosity of the model's response. Lower values will result in...
   */
  verbosity?: string | null;

  /**
   * This tool searches the web for relevant results to use in a response. Learn m...
   */
  web_search_options?: { [key: string]: unknown } | null;

  [k: string]: unknown;
}

export namespace CompletionCreateParams {
  /**
   * Safety setting, affecting the safety-blocking behavior.
   *
   * Passing a safety setting for a category changes the allowed probability that
   * content is blocked.
   *
   * Fields:
   *
   * - category (required): HarmCategory
   * - threshold (required): Literal["HARM_BLOCK_THRESHOLD_UNSPECIFIED",
   *   "BLOCK_LOW_AND_ABOVE", "BLOCK_MEDIUM_AND_ABOVE", "BLOCK_ONLY_HIGH",
   *   "BLOCK_NONE", "OFF"]
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

  /**
   * A custom tool that processes input using a specified format.
   *
   * Fields:
   *
   * - type (required): Literal["custom"]
   * - custom (required): CustomToolProperties
   */
  export interface CustomToolChatCompletions {
    /**
     * Properties of the custom tool.
     */
    custom: CustomToolChatCompletions.Custom;

    /**
     * The type of the custom tool. Always `custom`.
     */
    type: 'custom';
  }

  export namespace CustomToolChatCompletions {
    /**
     * Properties of the custom tool.
     */
    export interface Custom {
      /**
       * The name of the custom tool, used to identify it in tool calls.
       */
      name: string;

      /**
       * Optional description of the custom tool, used to provide more context.
       */
      description?: string;

      /**
       * The input format for the custom tool. Default is unconstrained text.
       */
      format?: Custom.TextFormat | Custom.GrammarFormat;
    }

    export namespace Custom {
      /**
       * Unconstrained free-form text.
       *
       * Fields:
       *
       * - type (required): Literal["text"]
       */
      export interface TextFormat {
        /**
         * Unconstrained text format. Always `text`.
         */
        type: 'text';
      }

      /**
       * A grammar defined by the user.
       *
       * Fields:
       *
       * - type (required): Literal["grammar"]
       * - grammar (required): GrammarFormatGrammarFormat
       */
      export interface GrammarFormat {
        /**
         * Your chosen grammar.
         */
        grammar: GrammarFormat.Grammar;

        /**
         * Grammar format. Always `grammar`.
         */
        type: 'grammar';
      }

      export namespace GrammarFormat {
        /**
         * Your chosen grammar.
         */
        export interface Grammar {
          /**
           * The grammar definition.
           */
          definition: string;

          /**
           * The syntax of the grammar definition. One of `lark` or `regex`.
           */
          syntax: 'lark' | 'regex';
        }
      }
    }
  }

  export type CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}

export interface CompletionCreateParamsNonStreaming extends CompletionCreateParamsBase {
  /**
   * Enable streaming response
   */
  stream?: false | null;

  [k: string]: unknown;
}

export interface CompletionCreateParamsStreaming extends CompletionCreateParamsBase {
  /**
   * Enable streaming response
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
    type Annotation as Annotation,
    type ChatCompletionAssistantMessageParam as ChatCompletionAssistantMessageParam,
    type ChatCompletionAudio as ChatCompletionAudio,
    type ChatCompletionAudioParam as ChatCompletionAudioParam,
    type ChatCompletionContentPartAudioParam as ChatCompletionContentPartAudioParam,
    type ChatCompletionContentPartFileParam as ChatCompletionContentPartFileParam,
    type ChatCompletionContentPartImageParam as ChatCompletionContentPartImageParam,
    type ChatCompletionContentPartRefusalParam as ChatCompletionContentPartRefusalParam,
    type ChatCompletionContentPartTextParam as ChatCompletionContentPartTextParam,
    type ChatCompletionDeveloperMessageParam as ChatCompletionDeveloperMessageParam,
    type ChatCompletionFunctionMessageParam as ChatCompletionFunctionMessageParam,
    type ChatCompletionFunctions as ChatCompletionFunctions,
    type ChatCompletionMessage as ChatCompletionMessage,
    type ChatCompletionMessageCustomToolCall as ChatCompletionMessageCustomToolCall,
    type ChatCompletionMessageToolCall as ChatCompletionMessageToolCall,
    type ChatCompletionSystemMessageParam as ChatCompletionSystemMessageParam,
    type ChatCompletionTokenLogprob as ChatCompletionTokenLogprob,
    type ChatCompletionToolMessageParam as ChatCompletionToolMessageParam,
    type ChatCompletionToolParam as ChatCompletionToolParam,
    type ChatCompletionUserMessageParam as ChatCompletionUserMessageParam,
    type Choice as Choice,
    type ChoiceDelta as ChoiceDelta,
    type ChoiceDeltaFunctionCall as ChoiceDeltaFunctionCall,
    type ChoiceDeltaToolCall as ChoiceDeltaToolCall,
    type ChoiceDeltaToolCallFunction as ChoiceDeltaToolCallFunction,
    type ChoiceLogprobs as ChoiceLogprobs,
    type ChunkChoice as ChunkChoice,
    type Completion as Completion,
    type CompletionRequest as CompletionRequest,
    type CompletionTokensDetails as CompletionTokensDetails,
    type CompletionUsage as CompletionUsage,
    type Custom as Custom,
    type Function as Function,
    type FunctionCall as FunctionCall,
    type InputTokenDetails as InputTokenDetails,
    type PredictionContent as PredictionContent,
    type PromptTokensDetails as PromptTokensDetails,
    type Reasoning as Reasoning,
    type StreamChunk as StreamChunk,
    type ThinkingConfigDisabled as ThinkingConfigDisabled,
    type ThinkingConfigEnabled as ThinkingConfigEnabled,
    type ToolChoice as ToolChoice,
    type ToolChoiceAny as ToolChoiceAny,
    type ToolChoiceAuto as ToolChoiceAuto,
    type ToolChoiceNone as ToolChoiceNone,
    type ToolChoiceTool as ToolChoiceTool,
    type TopLogprob as TopLogprob,
    type URLCitation as URLCitation,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
    type ParsedChatCompletion as ParsedChatCompletion,
    type ParsedChoice as ParsedChoice,
    type ParsedMessage as ParsedMessage,
    type ParsedFunctionToolCall as ParsedFunctionToolCall,
  };
}
