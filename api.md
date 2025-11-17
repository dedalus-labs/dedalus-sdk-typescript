# Dedalus

Types:

- <code><a href="./src/resources/top-level.ts">GetResponse</a></code>

Methods:

- <code title="get /">client.<a href="./src/index.ts">get</a>() -> GetResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">DedalusModel</a></code>
- <code><a href="./src/resources/shared.ts">DedalusModelChoice</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatJSONObject</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatJSONSchema</a></code>
- <code><a href="./src/resources/shared.ts">ResponseFormatText</a></code>

# \_Private

# Health

Types:

- <code><a href="./src/resources/health.ts">HealthCheckResponse</a></code>

Methods:

- <code title="get /health">client.health.<a href="./src/resources/health.ts">check</a>() -> HealthCheckResponse</code>

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

- <code><a href="./src/resources/chat/completions.ts">ChatCompletionTokenLogprob</a></code>
- <code><a href="./src/resources/chat/completions.ts">Completion</a></code>
- <code><a href="./src/resources/chat/completions.ts">CompletionRequest</a></code>
- <code><a href="./src/resources/chat/completions.ts">StreamChunk</a></code>
- <code><a href="./src/resources/chat/completions.ts">TopLogprob</a></code>

Methods:

- <code title="post /v1/chat/completions">client.chat.completions.<a href="./src/resources/chat/completions.ts">create</a>({ ...params }) -> Completion</code>
