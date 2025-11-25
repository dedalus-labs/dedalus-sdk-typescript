# Dedalus TypeScript MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export DEDALUS_API_KEY="My API Key"
export DEDALUS_X_API_KEY="My X API Key"
export DEDALUS_ORG_ID="My Organization"
export DEDALUS_PROVIDER="My Provider"
export DEDALUS_PROVIDER_KEY="My Provider Key"
export DEDALUS_PROVIDER_MODEL="My Provider Model"
export DEDALUS_ENVIRONMENT="production"
npx -y dedalus-labs-mcp@latest
```

### Via MCP Client

There is a partial list of existing clients at [modelcontextprotocol.io](https://modelcontextprotocol.io/clients). If you already
have a client, consult their documentation to install the MCP server.

For clients with a configuration JSON, it might look something like this:

```json
{
  "mcpServers": {
    "dedalus_labs_api": {
      "command": "npx",
      "args": ["-y", "dedalus-labs-mcp", "--client=claude", "--tools=all"],
      "env": {
        "DEDALUS_API_KEY": "My API Key",
        "DEDALUS_X_API_KEY": "My X API Key",
        "DEDALUS_ORG_ID": "My Organization",
        "DEDALUS_PROVIDER": "My Provider",
        "DEDALUS_PROVIDER_KEY": "My Provider Key",
        "DEDALUS_PROVIDER_MODEL": "My Provider Model",
        "DEDALUS_ENVIRONMENT": "production"
      }
    }
  }
}
```

### Cursor

If you use Cursor, you can install the MCP server by using the button below. You will need to set your environment variables
in Cursor's `mcp.json`, which can be found in Cursor Settings > Tools & MCP > New MCP Server.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=dedalus-labs-mcp&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsImRlZGFsdXMtbGFicy1tY3AiXSwiZW52Ijp7IkRFREFMVVNfQVBJX0tFWSI6IlNldCB5b3VyIERFREFMVVNfQVBJX0tFWSBoZXJlLiIsIkRFREFMVVNfWF9BUElfS0VZIjoiU2V0IHlvdXIgREVEQUxVU19YX0FQSV9LRVkgaGVyZS4iLCJERURBTFVTX09SR19JRCI6IlNldCB5b3VyIERFREFMVVNfT1JHX0lEIGhlcmUuIiwiREVEQUxVU19QUk9WSURFUiI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVIgaGVyZS4iLCJERURBTFVTX1BST1ZJREVSX0tFWSI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVJfS0VZIGhlcmUuIiwiREVEQUxVU19QUk9WSURFUl9NT0RFTCI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVJfTU9ERUwgaGVyZS4ifX0)

### VS Code

If you use MCP, you can install the MCP server by clicking the link below. You will need to set your environment variables
in VS Code's `mcp.json`, which can be found via Command Palette > MCP: Open User Configuration.

[Open VS Code](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22dedalus-labs-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22dedalus-labs-mcp%22%5D%2C%22env%22%3A%7B%22DEDALUS_API_KEY%22%3A%22Set%20your%20DEDALUS_API_KEY%20here.%22%2C%22DEDALUS_X_API_KEY%22%3A%22Set%20your%20DEDALUS_X_API_KEY%20here.%22%2C%22DEDALUS_ORG_ID%22%3A%22Set%20your%20DEDALUS_ORG_ID%20here.%22%2C%22DEDALUS_PROVIDER%22%3A%22Set%20your%20DEDALUS_PROVIDER%20here.%22%2C%22DEDALUS_PROVIDER_KEY%22%3A%22Set%20your%20DEDALUS_PROVIDER_KEY%20here.%22%2C%22DEDALUS_PROVIDER_MODEL%22%3A%22Set%20your%20DEDALUS_PROVIDER_MODEL%20here.%22%7D%7D)

### Claude Code

If you use Claude Code, you can install the MCP server by running the command below in your terminal. You will need to set your
environment variables in Claude Code's `.claude.json`, which can be found in your home directory.

```
claude mcp add --transport stdio dedalus_labs_api --env DEDALUS_API_KEY="Your DEDALUS_API_KEY here." DEDALUS_X_API_KEY="Your DEDALUS_X_API_KEY here." DEDALUS_ORG_ID="Your DEDALUS_ORG_ID here." DEDALUS_PROVIDER="Your DEDALUS_PROVIDER here." DEDALUS_PROVIDER_KEY="Your DEDALUS_PROVIDER_KEY here." DEDALUS_PROVIDER_MODEL="Your DEDALUS_PROVIDER_MODEL here." -- npx -y dedalus-labs-mcp
```

## Exposing endpoints to your MCP Client

There are three ways to expose endpoints as tools in the MCP server:

1. Exposing one tool per endpoint, and filtering as necessary
2. Exposing a set of tools to dynamically discover and invoke endpoints from the API
3. Exposing a docs search tool and a code execution tool, allowing the client to write code to be executed against the TypeScript client

### Filtering endpoints and tools

You can run the package on the command line to discover and filter the set of tools that are exposed by the
MCP Server. This can be helpful for large APIs where including all endpoints at once is too much for your AI's
context window.

You can filter by multiple aspects:

- `--tool` includes a specific tool by name
- `--resource` includes all tools under a specific resource, and can have wildcards, e.g. `my.resource*`
- `--operation` includes just read (get/list) or just write operations

### Dynamic tools

If you specify `--tools=dynamic` to the MCP server, instead of exposing one tool per endpoint in the API, it will
expose the following tools:

1. `list_api_endpoints` - Discovers available endpoints, with optional filtering by search query
2. `get_api_endpoint_schema` - Gets detailed schema information for a specific endpoint
3. `invoke_api_endpoint` - Executes any endpoint with the appropriate parameters

This allows you to have the full set of API endpoints available to your MCP Client, while not requiring that all
of their schemas be loaded into context at once. Instead, the LLM will automatically use these tools together to
search for, look up, and invoke endpoints dynamically. However, due to the indirect nature of the schemas, it
can struggle to provide the correct properties a bit more than when tools are imported explicitly. Therefore,
you can opt-in to explicit tools, the dynamic tools, or both.

See more information with `--help`.

All of these command-line options can be repeated, combined together, and have corresponding exclusion versions (e.g. `--no-tool`).

Use `--list` to see the list of available tools, or see below.

### Code execution

If you specify `--tools=code` to the MCP server, it will expose just two tools:

- `search_docs` - Searches the API documentation and returns a list of markdown results
- `execute` - Runs code against the TypeScript client

This allows the LLM to implement more complex logic by chaining together many API calls without loading
intermediary results into its context window.

The code execution itself happens in a Deno sandbox that has network access only to the base URL for the API.

### Specifying the MCP Client

Different clients have varying abilities to handle arbitrary tools and schemas.

You can specify the client you are using with the `--client` argument, and the MCP server will automatically
serve tools and schemas that are more compatible with that client.

- `--client=<type>`: Set all capabilities based on a known MCP client

  - Valid values: `openai-agents`, `claude`, `claude-code`, `cursor`
  - Example: `--client=cursor`

Additionally, if you have a client not on the above list, or the client has gotten better
over time, you can manually enable or disable certain capabilities:

- `--capability=<name>`: Specify individual client capabilities
  - Available capabilities:
    - `top-level-unions`: Enable support for top-level unions in tool schemas
    - `valid-json`: Enable JSON string parsing for arguments
    - `refs`: Enable support for $ref pointers in schemas
    - `unions`: Enable support for union types (anyOf) in schemas
    - `formats`: Enable support for format validations in schemas (e.g. date-time, email)
    - `tool-name-length=N`: Set maximum tool name length to N characters
  - Example: `--capability=top-level-unions --capability=tool-name-length=40`
  - Example: `--capability=top-level-unions,tool-name-length=40`

### Examples

1. Filter for read operations on cards:

```bash
--resource=cards --operation=read
```

2. Exclude specific tools while including others:

```bash
--resource=cards --no-tool=create_cards
```

3. Configure for Cursor client with custom max tool name length:

```bash
--client=cursor --capability=tool-name-length=40
```

4. Complex filtering with multiple criteria:

```bash
--resource=cards,accounts --operation=read --tag=kyc --no-tool=create_cards
```

## Running remotely

Launching the client with `--transport=http` launches the server as a remote server using Streamable HTTP transport. The `--port` setting can choose the port it will run on, and the `--socket` setting allows it to run on a Unix socket.

Authorization can be provided via the `Authorization` header using the Bearer scheme.

Additionally, authorization can be provided via the following headers:
| Header | Equivalent client option | Security scheme |
| ------------------- | ------------------------ | --------------- |
| `x-dedalus-api-key` | `apiKey` | Bearer |
| `x-api-key` | `xAPIKey` | ApiKeyAuth |

A configuration JSON for this server might look like this, assuming the server is hosted at `http://localhost:3000`:

```json
{
  "mcpServers": {
    "dedalus_labs_api": {
      "url": "http://localhost:3000",
      "headers": {
        "Authorization": "Bearer <auth value>"
      }
    }
  }
}
```

The command-line arguments for filtering tools and specifying clients can also be used as query parameters in the URL.
For example, to exclude specific tools while including others, use the URL:

```
http://localhost:3000?resource=cards&resource=accounts&no_tool=create_cards
```

Or, to configure for the Cursor client, with a custom max tool name length, use the URL:

```
http://localhost:3000?client=cursor&capability=tool-name-length%3D40
```

## Importing the tools and server individually

```js
// Import the server, generated endpoints, or the init function
import { server, endpoints, init } from "dedalus-labs-mcp/server";

// import a specific tool
import getClient from "dedalus-labs-mcp/tools/top-level/get-client";

// initialize the server and all endpoints
init({ server, endpoints });

// manually start server
const transport = new StdioServerTransport();
await server.connect(transport);

// or initialize your own server with specific tools
const myServer = new McpServer(...);

// define your own endpoint
const myCustomEndpoint = {
  tool: {
    name: 'my_custom_tool',
    description: 'My custom tool',
    inputSchema: zodToJsonSchema(z.object({ a_property: z.string() })),
  },
  handler: async (client: client, args: any) => {
    return { myResponse: 'Hello world!' };
  })
};

// initialize the server with your custom endpoints
init({ server: myServer, endpoints: [getClient, myCustomEndpoint] });
```

## Available Tools

The following tools are available in this MCP server.

### Resource `$client`:

- `get_client` (`read`): Root

### Resource `health`:

- `check_health` (`read`): Simple health check.

### Resource `models`:

- `retrieve_models` (`read`): Retrieve a model.

  Retrieve detailed information about a specific model, including its capabilities,
  provider, and supported features.

  Args:
  model_id: The ID of the model to retrieve (e.g., 'openai/gpt-4', 'anthropic/claude-3-5-sonnet-20241022')
  user: Authenticated user obtained from API key validation

  Returns:
  Model: Information about the requested model

  Raises:
  HTTPException: - 401 if authentication fails - 404 if model not found or not accessible with current API key - 500 if internal error occurs

  Requires:
  Valid API key with 'read' scope permission

  Example:
  ```python
  import dedalus_labs

      client = dedalus_labs.Client(api_key="your-api-key")
      model = client.models.retrieve("openai/gpt-4")

      print(f"Model: {model.id}")
      print(f"Owner: {model.owned_by}")
      ```

      Response:
      ```json
      {
          "id": "openai/gpt-4",
          "object": "model",
          "created": 1687882411,
          "owned_by": "openai"
      }
      ```

- `list_models` (`read`): List available models.

  Retrieve the complete list of models available to your organization, including
  models from OpenAI, Anthropic, Google, xAI, Mistral, Fireworks, and DeepSeek.

  Returns:
  ListModelsResponse: List of available models across all supported providers

### Resource `embeddings`:

- `create_embeddings` (`write`): Create embeddings using the configured provider.

### Resource `audio.speech`:

- `create_audio_speech` (`write`): Generate speech audio from text.

  Generates audio from the input text using text-to-speech models. Supports multiple
  voices and output formats including mp3, opus, aac, flac, wav, and pcm.

  Returns streaming audio data that can be saved to a file or streamed directly to users.

### Resource `audio.transcriptions`:

- `create_audio_transcriptions` (`write`): Transcribe audio into text.

  Transcribes audio files using OpenAI's Whisper model. Supports multiple audio formats
  including mp3, mp4, mpeg, mpga, m4a, wav, and webm. Maximum file size is 25 MB.

  Args:
  file: Audio file to transcribe (required)
  model: Model ID to use (e.g., "openai/whisper-1")
  language: ISO-639-1 language code (e.g., "en", "es") - improves accuracy
  prompt: Optional text to guide the model's style
  response_format: Format of the output (json, text, srt, verbose_json, vtt)
  temperature: Sampling temperature between 0 and 1

  Returns:
  Transcription object with the transcribed text

### Resource `audio.translations`:

- `create_audio_translations` (`write`): Translate audio into English.

  Translates audio files in any supported language to English text using OpenAI's
  Whisper model. Supports the same audio formats as transcription. Maximum file size
  is 25 MB.

  Args:
  file: Audio file to translate (required)
  model: Model ID to use (e.g., "openai/whisper-1")
  prompt: Optional text to guide the model's style
  response_format: Format of the output (json, text, srt, verbose_json, vtt)
  temperature: Sampling temperature between 0 and 1

  Returns:
  Translation object with the English translation

### Resource `images`:

- `create_variation_images` (`write`): Create variations of an image.

  DALL·E 2 only. Upload an image to generate variations.

- `edit_images` (`write`): Edit images using inpainting.

  Supports dall-e-2 and gpt-image-1. Upload an image and optionally a mask
  to indicate which areas to regenerate based on the prompt.

- `generate_images` (`write`): Generate images from text prompts.

  Pure image generation models only (DALL-E, GPT Image).
  For multimodal models like gemini-2.5-flash-image, use /v1/chat/completions.

### Resource `chat.completions`:

- `create_chat_completions` (`write`): Create a chat completion.

  Generates a model response for the given conversation and configuration.
  Supports OpenAI-compatible parameters and provider-specific extensions.

  Headers:

  - Authorization: bearer key for the calling account.
  - Optional BYOK or provider headers if applicable.

  Behavior:

  - If multiple models are supplied, the first one is used, and the agent may hand off to another model.
  - Tools may be invoked on the server or signaled for the client to run.
  - Streaming responses emit incremental deltas; non-streaming returns a single object.
  - Usage metrics are computed when available and returned in the response.

  Responses:

  - 200 OK: JSON completion object with choices, message content, and usage.
  - 400 Bad Request: validation error.
  - 401 Unauthorized: authentication failed.
  - 402 Payment Required or 429 Too Many Requests: quota, balance, or rate limit issue.
  - 500 Internal Server Error: unexpected failure.

  Billing:

  - Token usage metered by the selected model(s).
  - Tool calls and MCP sessions may be billed separately.
  - Streaming is settled after the stream ends via an async task.

  Example (non-streaming HTTP):
  POST /v1/chat/completions
  Content-Type: application/json
  Authorization: Bearer <key>

  {
  "model": "provider/model-name",
  "messages": [{"role": "user", "content": "Hello"}]
  }

  200 OK
  {
  "id": "cmpl_123",
  "object": "chat.completion",
  "choices": [
  {"index": 0, "message": {"role": "assistant", "content": "Hi there!"}, "finish_reason": "stop"}
  ],
  "usage": {"prompt_tokens": 3, "completion_tokens": 4, "total_tokens": 7}
  }

  Example (streaming over SSE):
  POST /v1/chat/completions
  Accept: text/event-stream

  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":"Hi"}}]}
  data: {"id":"cmpl_123","choices":[{"index":0,"delta":{"content":" there!"}}]}
  data: [DONE]
