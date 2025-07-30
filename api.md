# DedalusSDK

Types:

- <code><a href="./src/resources/top-level.ts">GetRootResponse</a></code>

Methods:

- <code title="get /">client.<a href="./src/index.ts">getRoot</a>() -> GetRootResponse</code>

# Health

Types:

- <code><a href="./src/resources/health.ts">HealthCheckResponse</a></code>

Methods:

- <code title="get /health">client.health.<a href="./src/resources/health.ts">check</a>() -> HealthCheckResponse</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">Model</a></code>
- <code><a href="./src/resources/models.ts">ModelListResponse</a></code>

Methods:

- <code title="get /v1/models/{model_id}">client.models.<a href="./src/resources/models.ts">retrieve</a>(modelID) -> Model</code>
- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelListResponse</code>

# Chat

Types:

- <code><a href="./src/resources/chat.ts">ChatCompletionTokenLogprob</a></code>
- <code><a href="./src/resources/chat.ts">ChatCreateResponse</a></code>

Methods:

- <code title="post /v1/chat">client.chat.<a href="./src/resources/chat.ts">create</a>({ ...params }) -> ChatCreateResponse</code>
