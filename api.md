# Root

Types:

- <code><a href="./src/resources/root.ts">RootGetResponse</a></code>

Methods:

- <code title="get /">client.root.<a href="./src/resources/root.ts">get</a>() -> RootGetResponse</code>

# \_Private

# Health

Types:

- <code><a href="./src/resources/health.ts">HealthCheckResponse</a></code>

Methods:

- <code title="get /health">client.health.<a href="./src/resources/health.ts">check</a>() -> HealthCheckResponse</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">ModelsResponse</a></code>
- <code><a href="./src/resources/models.ts">ModelRetrieveResponse</a></code>

Methods:

- <code title="get /v1/models/{model_id}">client.models.<a href="./src/resources/models.ts">retrieve</a>(modelID) -> ModelRetrieveResponse</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelsResponse</code>

# Chat

## Completions

Types:

- <code><a href="./src/resources/chat/completions.ts">ChatCompletionTokenLogprob</a></code>
- <code><a href="./src/resources/chat/completions.ts">Completion</a></code>
- <code><a href="./src/resources/chat/completions.ts">CompletionRequest</a></code>
- <code><a href="./src/resources/chat/completions.ts">TopLogprob</a></code>
