# Shared

Types:

- <code><a href="./src/resources/shared.ts">DedalusModel</a></code>
- <code><a href="./src/resources/shared.ts">DedalusModelChoice</a></code>
- <code><a href="./src/resources/shared.ts">FunctionDefinition</a></code>
- <code><a href="./src/resources/shared.ts">FunctionParameters</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatJSONObject</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatJSONSchema</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatText</a></code>

# Models

Types:

- <code><a href="./src/resources/models.ts">ListModelsResponse</a></code>
- <code><a href="./src/resources/models.ts">Model</a></code>

Methods:

- <code title="get /v1/models/{model_id}">client.models.<a href="./src/resources/models.ts">retrieve</a>(modelID) -> Model</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ListModelsResponse</code>

# Embeddings

Types:

- <code><a href="./src/resources/embeddings.ts">CreateEmbeddingRequest</a></code>
- <code><a href="./src/resources/embeddings.ts">CreateEmbeddingResponse</a></code>

Methods:

- <code title="post /v1/embeddings">client.embeddings.<a href="./src/resources/embeddings.ts">create</a>({ ...params }) -> CreateEmbeddingResponse</code>

# Audio

## Speech

Methods:

- <code title="post /v1/audio/speech">client.audio.speech.<a href="./src/resources/audio/speech.ts">create</a>({ ...params }) -> Response</code>

## Transcriptions

Types:

- <code><a href="./src/resources/audio/transcriptions.ts">TranscriptionCreateResponse</a></code>

Methods:

- <code title="post /v1/audio/transcriptions">client.audio.transcriptions.<a href="./src/resources/audio/transcriptions.ts">create</a>({ ...params }) -> TranscriptionCreateResponse</code>

## Translations

Types:

- <code><a href="./src/resources/audio/translations.ts">TranslationCreateResponse</a></code>

Methods:

- <code title="post /v1/audio/translations">client.audio.translations.<a href="./src/resources/audio/translations.ts">create</a>({ ...params }) -> TranslationCreateResponse</code>

# Images

Types:

- <code><a href="./src/resources/images.ts">CreateImageRequest</a></code>
- <code><a href="./src/resources/images.ts">Image</a></code>
- <code><a href="./src/resources/images.ts">ImagesResponse</a></code>

Methods:

- <code title="post /v1/images/variations">client.images.<a href="./src/resources/images.ts">createVariation</a>({ ...params }) -> ImagesResponse</code>
- <code title="post /v1/images/edits">client.images.<a href="./src/resources/images.ts">edit</a>({ ...params }) -> ImagesResponse</code>
- <code title="post /v1/images/generations">client.images.<a href="./src/resources/images.ts">generate</a>({ ...params }) -> ImagesResponse</code>

# Chat

## Completions

Types:

- <code><a href="./src/resources/chat/completions.ts">Annotation</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionAssistantMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionAudio</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionAudioParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionContentPartAudioParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionContentPartFileParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionContentPartImageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionContentPartRefusalParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionContentPartTextParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionDeveloperMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionFunctionMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionFunctions</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionMessage</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionMessageCustomToolCall</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionMessageToolCall</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionSystemMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionTokenLogprob</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionToolMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionToolParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChatCompletionUserMessageParam</a></code>
- <code><a href="./src/resources/chat/completions.ts">Choice</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChoiceDelta</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChoiceDeltaFunctionCall</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChoiceDeltaToolCall</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChoiceDeltaToolCallFunction</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChoiceLogprobs</a></code>
- <code><a href="./src/resources/chat/completions.ts">ChunkChoice</a></code>
- <code><a href="./src/resources/chat/completions.ts">Completion</a></code>
- <code><a href="./src/resources/chat/completions.ts">CompletionRequest</a></code>
- <code><a href="./src/resources/chat/completions.ts">CompletionTokensDetails</a></code>
- <code><a href="./src/resources/chat/completions.ts">CompletionUsage</a></code>
- <code><a href="./src/resources/chat/completions.ts">Custom</a></code>
- <code><a href="./src/resources/chat/completions.ts">Function</a></code>
- <code><a href="./src/resources/chat/completions.ts">FunctionCall</a></code>
- <code><a href="./src/resources/chat/completions.ts">InputTokenDetails</a></code>
- <code><a href="./src/resources/chat/completions.ts">PredictionContent</a></code>
- <code><a href="./src/resources/chat/completions.ts">PromptTokensDetails</a></code>
- <code><a href="./src/resources/chat/completions.ts">Reasoning</a></code>
- <code><a href="./src/resources/chat/completions.ts">StreamChunk</a></code>
- <code><a href="./src/resources/chat/completions.ts">ThinkingConfigDisabled</a></code>
- <code><a href="./src/resources/chat/completions.ts">ThinkingConfigEnabled</a></code>
- <code><a href="./src/resources/chat/completions.ts">ToolChoice</a></code>
- <code><a href="./src/resources/chat/completions.ts">ToolChoiceAny</a></code>
- <code><a href="./src/resources/chat/completions.ts">ToolChoiceAuto</a></code>
- <code><a href="./src/resources/chat/completions.ts">ToolChoiceNone</a></code>
- <code><a href="./src/resources/chat/completions.ts">ToolChoiceTool</a></code>
- <code><a href="./src/resources/chat/completions.ts">TopLogprob</a></code>
- <code><a href="./src/resources/chat/completions.ts">URLCitation</a></code>

Methods:

- <code title="post /v1/chat/completions">client.chat.completions.<a href="./src/resources/chat/completions.ts">create</a>({ ...params }) -> Completion</code>
