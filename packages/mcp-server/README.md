# Dedalus TypeScript MCP Server

It is generated with [Stainless](https://www.stainless.com/).

## Installation

### Direct invocation

You can run the MCP Server directly via `npx`:

```sh
export DEDALUS_API_KEY="My API Key"
export DEDALUS_X_API_KEY="My X API Key"
export DEDALUS_AS_URL="My As Base URL"
export DEDALUS_ORG_ID="My Dedalus Org ID"
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
      "args": ["-y", "dedalus-labs-mcp"],
      "env": {
        "DEDALUS_API_KEY": "My API Key",
        "DEDALUS_X_API_KEY": "My X API Key",
        "DEDALUS_AS_URL": "My As Base URL",
        "DEDALUS_ORG_ID": "My Dedalus Org ID",
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

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en-US/install-mcp?name=dedalus-labs-mcp&config=eyJuYW1lIjoiZGVkYWx1cy1sYWJzLW1jcCIsInRyYW5zcG9ydCI6InNzZSIsInVybCI6Imh0dHBzOi8vZGVkYWx1cy1zZGsuc3RsbWNwLmNvbS9zc2UiLCJlbnYiOnsiREVEQUxVU19BUElfS0VZIjoiU2V0IHlvdXIgREVEQUxVU19BUElfS0VZIGhlcmUuIiwiREVEQUxVU19YX0FQSV9LRVkiOiJTZXQgeW91ciBERURBTFVTX1hfQVBJX0tFWSBoZXJlLiIsIkRFREFMVVNfQVNfVVJMIjoiU2V0IHlvdXIgREVEQUxVU19BU19VUkwgaGVyZS4iLCJERURBTFVTX09SR19JRCI6IlNldCB5b3VyIERFREFMVVNfT1JHX0lEIGhlcmUuIiwiREVEQUxVU19QUk9WSURFUiI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVIgaGVyZS4iLCJERURBTFVTX1BST1ZJREVSX0tFWSI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVJfS0VZIGhlcmUuIiwiREVEQUxVU19QUk9WSURFUl9NT0RFTCI6IlNldCB5b3VyIERFREFMVVNfUFJPVklERVJfTU9ERUwgaGVyZS4ifX0)

### VS Code

If you use MCP, you can install the MCP server by clicking the link below. You will need to set your environment variables
in VS Code's `mcp.json`, which can be found via Command Palette > MCP: Open User Configuration.

[Open VS Code](https://vscode.stainless.com/mcp/%7B%22name%22%3A%22dedalus-labs-mcp%22%2C%22type%22%3A%22sse%22%2C%22url%22%3A%22https%3A%2F%2Fdedalus-sdk.stlmcp.com%2Fsse%22%2C%22env%22%3A%7B%22DEDALUS_API_KEY%22%3A%22Set%20your%20DEDALUS_API_KEY%20here.%22%2C%22DEDALUS_X_API_KEY%22%3A%22Set%20your%20DEDALUS_X_API_KEY%20here.%22%2C%22DEDALUS_AS_URL%22%3A%22Set%20your%20DEDALUS_AS_URL%20here.%22%2C%22DEDALUS_ORG_ID%22%3A%22Set%20your%20DEDALUS_ORG_ID%20here.%22%2C%22DEDALUS_PROVIDER%22%3A%22Set%20your%20DEDALUS_PROVIDER%20here.%22%2C%22DEDALUS_PROVIDER_KEY%22%3A%22Set%20your%20DEDALUS_PROVIDER_KEY%20here.%22%2C%22DEDALUS_PROVIDER_MODEL%22%3A%22Set%20your%20DEDALUS_PROVIDER_MODEL%20here.%22%7D%7D)

### Claude Code

If you use Claude Code, you can install the MCP server by running the command below in your terminal. You will need to set your
environment variables in Claude Code's `.claude.json`, which can be found in your home directory.

```
claude mcp add dedalus_labs_mcp_api --env DEDALUS_API_KEY="Your DEDALUS_API_KEY here." DEDALUS_X_API_KEY="Your DEDALUS_X_API_KEY here." DEDALUS_AS_URL="Your DEDALUS_AS_URL here." DEDALUS_ORG_ID="Your DEDALUS_ORG_ID here." DEDALUS_PROVIDER="Your DEDALUS_PROVIDER here." DEDALUS_PROVIDER_KEY="Your DEDALUS_PROVIDER_KEY here." DEDALUS_PROVIDER_MODEL="Your DEDALUS_PROVIDER_MODEL here." --transport sse https://dedalus-sdk.stlmcp.com/sse
```

## Code Mode

This MCP server is built on the "Code Mode" tool scheme. In this MCP Server,
your agent will write code against the TypeScript SDK, which will then be executed in an
isolated sandbox. To accomplish this, the server will expose two tools to your agent:

- The first tool is a docs search tool, which can be used to generically query for
  documentation about your API/SDK.

- The second tool is a code tool, where the agent can write code against the TypeScript SDK.
  The code will be executed in a sandbox environment without web or filesystem access. Then,
  anything the code returns or prints will be returned to the agent as the result of the
  tool call.

Using this scheme, agents are capable of performing very complex tasks deterministically
and repeatably.

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
