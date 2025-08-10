# Dedalus TypeScript MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export DEDALUS_API_KEY="My API Key"
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
        "DEDALUS_API_KEY": "My API Key"
      }
    }
  }
}
```

## Exposing endpoints to your MCP Client

There are two ways to expose endpoints as tools in the MCP server:

1. Exposing one tool per endpoint, and filtering as necessary
2. Exposing a set of tools to dynamically discover and invoke endpoints from the API

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

## Importing the tools and server individually

```js
// Import the server, generated endpoints, or the init function
import { server, endpoints, init } from "dedalus-labs-mcp/server";

// import a specific tool
import getRoot from "dedalus-labs-mcp/tools/root/get-root";

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
init({ server: myServer, endpoints: [getRoot, myCustomEndpoint] });
```

## Available Tools

The following tools are available in this MCP server.

### Resource `root`:

- `get_root` (`read`): Root

### Resource `health`:

- `check_health` (`read`): Simple health check.

### Resource `models`:

- `retrieve_models` (`read`): Get information about a specific model.

  Returns detailed information about a specific model by ID.
  The model must be available to your API key's configured providers.

  Args:
  model_id: The ID of the model to retrieve (e.g., 'gpt-4', 'claude-3-5-sonnet-20241022')
  user: Authenticated user obtained from API key validation

  Returns:
  Model: Information about the requested model

  Raises:
  HTTPException: - 401 if authentication fails - 404 if model not found or not accessible with current API key - 500 if internal error occurs

  Requires:
  Valid API key with 'read' scope permission

  Example:

  ````python
  import dedalus_labs

      client = dedalus_labs.Client(api_key="your-api-key")
      model = client.models.retrieve("gpt-4")

      print(f"Model: {model.id}")
      print(f"Owner: {model.owned_by}")
      ```

      Response:
      ```json
      {
          "id": "gpt-4",
          "object": "model",
          "created": 1687882411,
          "owned_by": "openai"
      }
      ```

  ````

- `list_models` (`read`): List available models.

  Returns a list of available models from all configured providers.
  Models are filtered based on provider availability and API key configuration.
  Only models from providers with valid API keys are returned.

  Args:
  user: Authenticated user obtained from API key validation

  Returns:
  ModelsResponse: Object containing list of available models

  Raises:
  HTTPException: - 401 if authentication fails - 500 if internal error occurs during model listing

  Requires:
  Valid API key with 'read' scope permission

  Example:

  ````python
  import dedalus_labs

      client = dedalus_labs.Client(api_key="your-api-key")
      models = client.models.list()

      for model in models.data:
          print(f"Model: {model.id} (Owner: {model.owned_by})")
      ```

      Response:
      ```json
      {
          "object": "list",
          "data": [
              {
                  "id": "gpt-4",
                  "object": "model",
                  "owned_by": "openai"
              },
              {
                  "id": "claude-3-5-sonnet-20241022",
                  "object": "model",
                  "owned_by": "anthropic"
              }
          ]
      }
      ```
  ````

### Resource `chat`:

- `create_chat` (`write`): Create a chat completion using the Agent framework.

  This endpoint provides a vendor-agnostic chat completion API that works with
  100+ LLM providers via the Agent framework. It supports both single and
  multi-model routing, client-side and server-side tool execution, and
  integration with MCP (Model Context Protocol) servers.

  Features: - Cross-vendor compatibility (OpenAI, Anthropic, Cohere, etc.) - Multi-model routing with intelligent agentic handoffs - Client-side tool execution (tools returned as JSON) - Server-side MCP tool execution with automatic billing - Streaming and non-streaming responses - Advanced agent attributes for routing decisions - Automatic usage tracking and billing

  Args:
  request: Chat completion request with messages, model, and configuration
  http_request: FastAPI request object for accessing headers and state
  background_tasks: FastAPI background tasks for async billing operations
  user: Authenticated user with validated API key and sufficient balance

  Returns:
  ChatCompletion: OpenAI-compatible completion response with usage data

  Raises:
  HTTPException: - 401 if authentication fails or insufficient balance - 400 if request validation fails - 500 if internal processing error occurs

  Billing: - Token usage billed automatically based on model pricing - MCP tool calls billed separately using credits system - Streaming responses billed after completion via background task

  Example:
  Basic chat completion:

  ````python
  import dedalus_labs

      client = dedalus_labs.Client(api_key="your-api-key")

      completion = client.chat.create(
          model="gpt-4",
          input=[{"role": "user", "content": "Hello, how are you?"}],
      )

      print(completion.choices[0].message.content)
      ```

      With tools and MCP servers:
      ```python
      completion = client.chat.create(
          model="gpt-4",
          input=[{"role": "user", "content": "Search for recent AI news"}],
          tools=[
              {
                  "type": "function",
                  "function": {
                      "name": "search_web",
                      "description": "Search the web for information",
                  },
              }
          ],
          mcp_servers=["dedalus-labs/brave-search"],
      )
      ```

      Multi-model routing:
      ```python
      completion = client.chat.create(
          model=["gpt-4o-mini", "gpt-4", "claude-3-5-sonnet"],
          input=[{"role": "user", "content": "Analyze this complex data"}],
          agent_attributes={"complexity": 0.8, "accuracy": 0.9},
      )
      ```

      Streaming response:
      ```python
      stream = client.chat.create(
          model="gpt-4",
          input=[{"role": "user", "content": "Tell me a story"}],
          stream=True,
      )

      for chunk in stream:
          if chunk.choices[0].delta.content:
              print(chunk.choices[0].delta.content, end="")
      ```
  ````
