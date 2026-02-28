/**
 * Structural typing interfaces for MCP server integration.
 * Port of: dedalus-sdk-python/src/dedalus_labs/lib/mcp/protocols.py
 */

import { type JsonObject } from '../utils/json';

// --- Type Aliases ---

/** Slug ("org/server") or URL. */
export type MCPServerRef = string;

// --- Interfaces ---

/** Protocol for a single credential binding. */
export interface CredentialProtocol {
  connection: { name: string };
  valuesForEncryption(): JsonObject;
}

/** Protocol for tools service from MCPServer. */
export interface ToolsServiceProtocol {
  _toolSpecs: JsonObject;
}

/** Structural protocol for MCP servers. */
export interface MCPServerProtocol {
  name: string;
  url?: string | null;
  serve(...args: unknown[]): unknown;
}

/** Extended protocol for MCPServer with credential bindings. */
export interface MCPServerWithCredsProtocol extends MCPServerProtocol {
  credentials?: unknown;
  connection?: string | null;
  tools: ToolsServiceProtocol;
}

/** Duck-typed interface for tool specifications. */
export interface MCPToolSpec {
  name: string;
  description?: string;
  inputSchema: JsonObject;
}

// --- Type Guards ---

/** Check if obj satisfies MCPServerProtocol. */
export function isMcpServer(obj: unknown): obj is MCPServerProtocol {
  if (obj == null || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return typeof o['name'] === 'string' && typeof o['serve'] === 'function';
}

/** Split servers into (string refs, server objects). */
export function normalizeMcpServers(
  servers: MCPServerRef | MCPServerProtocol | Array<MCPServerRef | MCPServerProtocol> | null | undefined,
): [MCPServerRef[], MCPServerProtocol[]] {
  if (servers == null) return [[], []];
  if (typeof servers === 'string') return [[servers], []];
  if (isMcpServer(servers)) return [[], [servers]];

  const refs: MCPServerRef[] = [];
  const objects: MCPServerProtocol[] = [];
  for (const item of servers) {
    if (typeof item === 'string') {
      refs.push(item);
    } else if (isMcpServer(item)) {
      objects.push(item);
    } else {
      refs.push(String(item));
    }
  }
  return [refs, objects];
}
