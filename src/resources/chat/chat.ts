// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import {
  ChatCompletion,
  ChatCompletionAssistantMessageParam,
  ChatCompletionChunk,
  ChatCompletionContentPartFileParam,
  ChatCompletionContentPartImageParam,
  ChatCompletionContentPartInputAudioParam,
  ChatCompletionContentPartRefusalParam,
  ChatCompletionContentPartTextParam,
  ChatCompletionCreateParams,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionFunctionMessageParam,
  ChatCompletionFunctions,
  ChatCompletionMessage,
  ChatCompletionMessageCustomToolCall,
  ChatCompletionMessageToolCall,
  ChatCompletionSystemMessageParam,
  ChatCompletionTokenLogprob,
  ChatCompletionToolMessageParam,
  ChatCompletionToolParam,
  ChatCompletionUserMessageParam,
  ChoiceDelta,
  ChoiceDeltaToolCall,
  CompletionCreateParams,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  CompletionUsage,
  Completions,
  InputTokenDetails,
  PredictionContent,
  ThinkingConfigDisabled,
  ThinkingConfigEnabled,
  ToolChoiceAny,
  ToolChoiceAuto,
  ToolChoiceNone,
  ToolChoiceTool,
} from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

Chat.Completions = Completions;

export declare namespace Chat {
  export {
    Completions as Completions,
    type ChatCompletion as ChatCompletion,
    type ChatCompletionAssistantMessageParam as ChatCompletionAssistantMessageParam,
    type ChatCompletionChunk as ChatCompletionChunk,
    type ChatCompletionContentPartFileParam as ChatCompletionContentPartFileParam,
    type ChatCompletionContentPartImageParam as ChatCompletionContentPartImageParam,
    type ChatCompletionContentPartInputAudioParam as ChatCompletionContentPartInputAudioParam,
    type ChatCompletionContentPartRefusalParam as ChatCompletionContentPartRefusalParam,
    type ChatCompletionContentPartTextParam as ChatCompletionContentPartTextParam,
    type ChatCompletionCreateParams as ChatCompletionCreateParams,
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
    type ChoiceDelta as ChoiceDelta,
    type ChoiceDeltaToolCall as ChoiceDeltaToolCall,
    type CompletionUsage as CompletionUsage,
    type InputTokenDetails as InputTokenDetails,
    type PredictionContent as PredictionContent,
    type ThinkingConfigDisabled as ThinkingConfigDisabled,
    type ThinkingConfigEnabled as ThinkingConfigEnabled,
    type ToolChoiceAny as ToolChoiceAny,
    type ToolChoiceAuto as ToolChoiceAuto,
    type ToolChoiceNone as ToolChoiceNone,
    type ToolChoiceTool as ToolChoiceTool,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}
