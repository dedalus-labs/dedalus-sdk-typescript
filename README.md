# Dedalus TypeScript API Library

[![NPM version](<https://img.shields.io/npm/v/dedalus-labs.svg?label=npm%20(stable)>)](https://npmjs.org/package/dedalus-labs) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/dedalus-labs)

This library provides convenient access to the Dedalus REST API from server-side TypeScript or JavaScript.

The REST API documentation can be found on [docs.dedaluslabs.ai](https://docs.dedaluslabs.ai). The full API of this library can be found in [api.md](api.md).

It is generated with [Stainless](https://www.stainless.com/).

## Installation

```sh
npm install dedalus-labs
```

## Usage

The full API of this library can be found in [api.md](api.md).

<!-- prettier-ignore -->
```js
import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: process.env['DEDALUS_API_KEY'], // This is the default and can be omitted
  environment: 'development', // defaults to 'production'
});

const completion = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  messages: [
    { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
    { role: 'user', content: 'Hello, how are you today?' },
  ],
});

console.log(completion.id);
```

## Streaming responses

We provide support for streaming responses using Server Sent Events (SSE).

```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus();

const stream = await client.chat.completions.create({
  model: 'openai/gpt-5-nano',
  stream: true,
  messages: [
    { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
    { role: 'user', content: 'What do you think of artificial intelligence?' },
  ],
});
for await (const streamChunk of stream) {
  console.log(streamChunk.id);
}
```

If you need to cancel a stream, you can `break` from the loop
or call `stream.controller.abort()`.

## DedalusRunner

`DedalusRunner` is a high-level wrapper that handles multi-turn conversations with automatic tool execution. It manages the tool-calling loop, conversation history, and supports both server-side and client-side tools.

### Basic usage

```ts
import Dedalus, { DedalusRunner } from 'dedalus-labs';

const client = new Dedalus();
const runner = new DedalusRunner(client);

const result = await runner.run({
  model: 'openai/gpt-4o',
  input: 'What is the weather in San Francisco?',
  tools: [weatherTool],
});

console.log(result.output); // Final text response
console.log(result.toolResults); // Results from tool executions
console.log(result.stepsUsed); // Number of conversation turns
```

### Defining tools

Tools can be defined in two ways: as a `ToolDefinition` object or as a plain function (`ToolFunction`).

#### ToolFunction

A plain function that will be called directly. The schema is minimal (empty parameters):

```ts
import { ToolFunction } from 'dedalus-labs';

const getCurrentTime: ToolFunction = async () => {
  return new Date().toISOString();
};

await runner.run({
  model: 'openai/gpt-4o',
  input: 'What time is it?',
  tools: [getCurrentTime],
});
```

#### ToolDefinition

A structured object with explicit schema. Supports both JSON Schema and Zod schemas for parameters:

```ts
import { ToolDefinition } from 'dedalus-labs';
import { z } from 'zod';

// Using Zod schema
const weatherTool: ToolDefinition = {
  name: 'getWeather',
  description: 'Get current weather for a location',
  parameters: z.object({
    location: z.string().describe('City name'),
    unit: z.enum(['celsius', 'fahrenheit']).optional(),
  }),
  execute: async ({ location, unit }) => {
    const weather = await fetchWeather(location, unit);
    return { temperature: weather.temp, conditions: weather.conditions };
  },
};

// Using JSON Schema
const calculatorTool: ToolDefinition = {
  name: 'calculate',
  description: 'Perform arithmetic calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: { type: 'string', description: 'Math expression to evaluate' },
    },
    required: ['expression'],
  },
  execute: async ({ expression }) => {
    return { result: eval(expression) };
  },
};
```

### Client-side tools

Tools without an `execute` function are treated as client-side tools. When the model calls these tools, the runner pauses and returns control to the client to handle the tool execution.

This pattern is useful for tools that require user interaction (confirmations, form inputs) or access to browser APIs.

```ts
// Client-side tool (no execute function)
const askConfirmation: ToolDefinition = {
  name: 'askConfirmation',
  description: 'Ask the user to confirm an action',
  parameters: z.object({
    message: z.string().describe('Confirmation message to show'),
  }),
  // No execute - handled on client
};

// Server-side tool (has execute function)
const deleteFile: ToolDefinition = {
  name: 'deleteFile',
  description: 'Delete a file from the system',
  parameters: z.object({ path: z.string() }),
  execute: async ({ path }) => {
    await fs.unlink(path);
    return { success: true };
  },
};

const result = await runner.run({
  model: 'openai/gpt-4o',
  input: 'Delete the file at /tmp/test.txt',
  tools: [askConfirmation, deleteFile],
});

// Check if runner paused for client tools
const lastMessage = result.conversationHistory.at(-1);
if (lastMessage?.role === 'assistant' && lastMessage.tool_calls) {
  const clientToolCalls = lastMessage.tool_calls.filter((tc) => tc.function?.name === 'askConfirmation');
  // Handle client tool calls, then continue conversation
}
```

### Streaming

Enable streaming to receive content deltas as they arrive:

```ts
const stream = await runner.run({
  model: 'openai/gpt-4o',
  input: 'Tell me a story',
  stream: true,
});

for await (const chunk of stream) {
  if (chunk.choices?.[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

### RunResult

The `run()` method returns a `RunResult` object with:

| Property              | Type                   | Description                            |
| --------------------- | ---------------------- | -------------------------------------- |
| `output` / `content`  | `string`               | Final text response from the model     |
| `toolResults`         | `ToolResult[]`         | Results from all tool executions       |
| `stepsUsed`           | `number`               | Number of conversation turns           |
| `conversationHistory` | `Message[]`            | Full conversation including tool calls |
| `toolsCalled`         | `string[]`             | Names of tools that were called        |
| `modelsUsed`          | `DedalusModelChoice[]` | Models used during the conversation    |

### Configuration options

```ts
await runner.run({
  model: 'openai/gpt-4o', // Required: model to use
  input: 'User message', // Input string or message array
  tools: [tool1, tool2], // Optional: tools to make available
  maxSteps: 10, // Max conversation turns (default: 10)
  autoExecuteTools: true, // Auto-execute server tools (default: true)
  mcpServers: ['server-name'], // MCP servers for remote tools
  instructions: 'System prompt', // System message prepended to conversation
  stream: false, // Enable streaming (default: false)
  verbose: false, // Enable logging (default: false)
  debug: false, // Enable debug logging (default: false)
});
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  apiKey: process.env['DEDALUS_API_KEY'], // This is the default and can be omitted
  environment: 'development', // defaults to 'production'
});

const params: Dedalus.Chat.CompletionCreateParams = {
  model: 'openai/gpt-5-nano',
  messages: [
    { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
    { role: 'user', content: 'Hello, how are you today?' },
  ],
};
const completion: Dedalus.Chat.Completion = await client.chat.completions.create(params);
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## File uploads

Request parameters that correspond to file uploads can be passed in many different forms:

- `File` (or an object with the same structure)
- a `fetch` `Response` (or an object with the same structure)
- an `fs.ReadStream`
- the return value of our `toFile` helper

```ts
import fs from 'fs';
import Dedalus, { toFile } from 'dedalus-labs';

const client = new Dedalus();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.audio.transcriptions.create({ file: fs.createReadStream('/path/to/file'), model: 'model' });

// Or if you have the web `File` API you can pass a `File` instance:
await client.audio.transcriptions.create({ file: new File(['my bytes'], 'file'), model: 'model' });

// You can also pass a `fetch` `Response`:
await client.audio.transcriptions.create({ file: await fetch('https://somesite/file'), model: 'model' });

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.audio.transcriptions.create({
  file: await toFile(Buffer.from('my bytes'), 'file'),
  model: 'model',
});
await client.audio.transcriptions.create({
  file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
  model: 'model',
});
```

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const completion = await client.chat.completions
  .create({
    model: 'openai/gpt-5-nano',
    messages: [
      { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
      { role: 'user', content: 'Hello, how are you today?' },
    ],
  })
  .catch(async (err) => {
    if (err instanceof Dedalus.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new Dedalus({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.chat.completions.create({ model: 'openai/gpt-5-nano', messages: [{ role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' }, { role: 'user', content: 'Hello, how are you today?' }] }, {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new Dedalus({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.chat.completions.create({ model: 'openai/gpt-5-nano', messages: [{ role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' }, { role: 'user', content: 'Hello, how are you today?' }] }, {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Default Headers

We automatically send the following headers with all requests.

| Header          | Value         |
| --------------- | ------------- |
| `User-Agent`    | `Dedalus-SDK` |
| `X-SDK-Version` | `1.0.0`       |

If you need to, you can override these headers by setting default headers on a per-request basis.

```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus();

const completion = await client.chat.completions.create(
  {
    model: 'openai/gpt-5-nano',
    messages: [
      { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
      { role: 'user', content: 'Hello, how are you today?' },
    ],
  },
  { headers: { 'User-Agent': 'My-Custom-Value' } },
);
```

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new Dedalus();

const response = await client.chat.completions
  .create({
    model: 'openai/gpt-5-nano',
    messages: [
      { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
      { role: 'user', content: 'Hello, how are you today?' },
    ],
  })
  .asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: completion, response: raw } = await client.chat.completions
  .create({
    model: 'openai/gpt-5-nano',
    messages: [
      { role: 'system', content: 'You are Stephen Dedalus. Respond in morose Joycean malaise.' },
      { role: 'user', content: 'Hello, how are you today?' },
    ],
  })
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(completion.id);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `DEDALUS_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import Dedalus from 'dedalus-labs';
import pino from 'pino';

const logger = pino();

const client = new Dedalus({
  logger: logger.child({ name: 'Dedalus' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Making custom/undocumented requests

This library is typed for convenient access to the documented API. If you need to access undocumented
endpoints, params, or response properties, the library can still be used.

#### Undocumented endpoints

To make requests to undocumented endpoints, you can use `client.get`, `client.post`, and other HTTP verbs.
Options on the client, such as retries, will be respected when making these requests.

```ts
await client.post('/some/path', {
  body: { some_prop: 'foo' },
  query: { some_query_arg: 'bar' },
});
```

#### Undocumented request params

To make requests using undocumented parameters, you may use `// @ts-expect-error` on the undocumented
parameter. This library doesn't validate at runtime that the request matches the type, so any extra values you
send will be sent as-is.

```ts
client.chat.completions.create({
  // ...
  // @ts-expect-error baz is not yet public
  baz: 'undocumented option',
});
```

For requests with the `GET` verb, any extra params will be in the query, all other requests will send the
extra param in the body.

If you want to explicitly send an extra argument, you can do so with the `query`, `body`, and `headers` request
options.

#### Undocumented response properties

To access undocumented response properties, you may access the response object with `// @ts-expect-error` on
the response object, or cast the response object to the requisite type. Like the request params, we do not
validate or strip extra properties from the response from the API.

### Customizing the fetch client

By default, this library expects a global `fetch` function is defined.

If you want to use a different `fetch` function, you can either polyfill the global:

```ts
import fetch from 'my-fetch';

globalThis.fetch = fetch;
```

Or pass it to the client:

```ts
import Dedalus from 'dedalus-labs';
import fetch from 'my-fetch';

const client = new Dedalus({ fetch });
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

#### Configuring proxies

To modify proxy behavior, you can provide custom `fetchOptions` that add runtime-specific proxy
options to requests:

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/node.svg" align="top" width="18" height="21"> **Node** <sup>[[docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/ProxyAgent.md#example---proxyagent-with-fetch)]</sup>

```ts
import Dedalus from 'dedalus-labs';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new Dedalus({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/bun.svg" align="top" width="18" height="21"> **Bun** <sup>[[docs](https://bun.sh/guides/http/proxy)]</sup>

```ts
import Dedalus from 'dedalus-labs';

const client = new Dedalus({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

<img src="https://raw.githubusercontent.com/stainless-api/sdk-assets/refs/heads/main/deno.svg" align="top" width="18" height="21"> **Deno** <sup>[[docs](https://docs.deno.com/api/deno/~/Deno.createHttpClient)]</sup>

```ts
import Dedalus from 'npm:dedalus-labs';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new Dedalus({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Frequently Asked Questions

## Semantic versioning

This package generally follows [SemVer](https://semver.org/spec/v2.0.0.html) conventions, though certain backwards-incompatible changes may be released as minor versions:

1. Changes that only affect static types, without breaking runtime behavior.
2. Changes to library internals which are technically public but not intended or documented for external use. _(Please open a GitHub issue to let us know if you are relying on such internals.)_
3. Changes that we do not expect to impact the vast majority of users in practice.

We take backwards-compatibility seriously and work hard to ensure you can rely on a smooth upgrade experience.

We are keen for your feedback; please open an [issue](https://www.github.com/dedalus-labs/dedalus-sdk-typescript/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).
