// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import {
  ChatCompletionTokenLogprob,
  Completion,
  CompletionCreateParams,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  CompletionRequest,
  Completions,
  DedalusModelChoice,
  ModelID,
  Models,
  StreamChunk,
  TopLogprob,
} from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

Chat.Completions = Completions;

export declare namespace Chat {
  export {
    Completions as Completions,
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
