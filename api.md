# Root

Types:

- <code><a href="./src/resources/root.ts">RootGetResponse</a></code>

Methods:

- <code title="get /">client.root.<a href="./src/resources/root.ts">get</a>() -> RootGetResponse</code>

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

Types:

- <code><a href="./src/resources/chat.ts">Completion</a></code>
- <code><a href="./src/resources/chat.ts">CompletionRequest</a></code>

Methods:

- <code title="post /v1/chat">client.chat.<a href="./src/resources/chat.ts">create</a>({ ...params }) -> Completion</code>
