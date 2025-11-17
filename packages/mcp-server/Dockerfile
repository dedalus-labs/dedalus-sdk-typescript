# Dockerfile for Dedalus MCP Server
    #
    # This Dockerfile builds a Docker image for the MCP Server.
    #
    # To build the image locally:
    #   docker build -f packages/mcp-server/Dockerfile -t dedalus-labs-mcp:local .
    #
    # To run the image:
    #   docker run -i dedalus-labs-mcp:local [OPTIONS]
    #
    # Common options:
    #   --tool=<name>              Include specific tools
    #   --resource=<name>          Include tools for specific resources
    #   --operation=read|write     Filter by operation type
    #   --client=<type>            Set client compatibility (e.g., claude, cursor)
    #   --transport=<type>         Set transport type (stdio or http)
    #
    # For a full list of options:
    #   docker run -i dedalus-labs-mcp:local --help
    #
    # Note: The MCP server uses stdio transport by default. Docker's -i flag
    # enables interactive mode, allowing the container to communicate over stdin/stdout.

    # Build stage
    FROM node:20-alpine AS builder

    # Install bash for build script
    RUN apk add --no-cache bash openssl

    # Set working directory
    WORKDIR /build

    # Copy entire repository
    COPY . .

    # Install all dependencies and build everything
    RUN yarn install --frozen-lockfile && \
        yarn build

    # Production stage

            FROM denoland/deno:alpine
            RUN apk add --no-cache npm

    # Add non-root user
    RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

    # Set working directory
    WORKDIR /app

# Copy the built mcp-server dist directory
COPY --from=builder /build/packages/mcp-server/dist ./

# Copy node_modules from mcp-server (includes all production deps)
COPY --from=builder /build/packages/mcp-server/node_modules ./node_modules

    # Copy the built dedalus-labs into node_modules
    COPY --from=builder /build/dist ./node_modules/dedalus-labs

    # Change ownership to nodejs user
    RUN chown -R nodejs:nodejs /app

    # Switch to non-root user
    USER nodejs

    # The MCP server uses stdio transport by default
    # No exposed ports needed for stdio communication

    # This is needed for node to run on the deno:alpine image.
    # See <https://github.com/denoland/deno_docker/issues/373>.
    ENV LD_LIBRARY_PATH=/usr/lib:/usr/local/lib

    # Set the entrypoint to the MCP server
    ENTRYPOINT ["node", "index.js"]

    # Allow passing arguments to the MCP server
    CMD []
