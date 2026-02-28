/**
 * MCP server wire format serialization.
 * Port of: dedalus-sdk-python/src/dedalus_labs/lib/mcp/wire.py
 *
 * Converts MCPServer objects and various input formats to the API wire format.
 */

import { type JsonObject } from '../utils/json';
import { type MCPServerProtocol, type CredentialProtocol, isMcpServer } from './protocols';

// --- Type Aliases ---

/** Serialized wire output: slug string or spec dict. */
export type MCPServerWireOutput = string | JsonObject;

/** Input types that serializeMcpServers accepts. */
export type MCPServerInput = string | JsonObject | MCPServerProtocol;

/** Connection/credential pair for provisioning. */
export type ConnectionCredentialPair = [connection: unknown, credential: CredentialProtocol];

// --- Wire Format ---

/** Derive canonical connection name from a server slug (org/server → org-server). */
export function slugToConnectionName(slug: string): string {
  return slug.replace(/\//g, '-');
}

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;

export interface MCPServerWireSpecFields {
  slug?: string | null;
  url?: string | null;
  version?: string | null;
}

/** Validate a wire spec. Throws on invalid input. */
export function validateWireSpec(spec: MCPServerWireSpecFields): void {
  const hasSlug = spec.slug != null;
  const hasUrl = spec.url != null;

  if (!hasSlug && !hasUrl) {
    throw new Error("requires either 'slug' or 'url'");
  }
  if (hasSlug && hasUrl) {
    throw new Error("cannot have both 'slug' and 'url'");
  }
  if (hasUrl && !spec.url!.startsWith('http://') && !spec.url!.startsWith('https://')) {
    throw new Error(`URL must start with http:// or https://, got: ${spec.url}`);
  }
  if (hasSlug && spec.version && spec.slug!.includes('@')) {
    throw new Error("cannot specify both 'version' field and version in slug");
  }
  if (hasSlug && !SLUG_PATTERN.test(spec.slug!)) {
    throw new Error(`slug must match org/name pattern, got: ${spec.slug}`);
  }

  // Extra fields check: only slug, url, version allowed
  const allowed = new Set(['slug', 'url', 'version']);
  for (const key of Object.keys(spec)) {
    if (!allowed.has(key)) {
      throw new Error(`extra field not allowed: '${key}'`);
    }
  }
}

/** Convert wire spec fields to wire output. Simple slugs become strings. */
export function wireSpecToWire(spec: MCPServerWireSpecFields): MCPServerWireOutput {
  if (spec.slug && !spec.version) {
    return spec.slug;
  }
  const result: JsonObject = {};
  if (spec.slug != null) result['slug'] = spec.slug;
  if (spec.url != null) result['url'] = spec.url;
  if (spec.version != null) result['version'] = spec.version;
  return result;
}

/** Create wire spec from slug, extracting version if embedded. */
export function wireSpecFromSlug(slug: string, version?: string | null): MCPServerWireSpecFields {
  if (slug.includes('@') && version == null) {
    const atIdx = slug.lastIndexOf('@');
    const parsedSlug = slug.slice(0, atIdx);
    const parsedVersion = slug.slice(atIdx + 1);
    return { slug: parsedSlug, version: parsedVersion };
  }
  return { slug, version: version ?? null };
}

/** Create wire spec from URL. */
export function wireSpecFromUrl(url: string): MCPServerWireSpecFields {
  return { url };
}

// --- MCP Server Serialization ---

/** Convert mcp_servers input to API wire format. */
export function serializeMcpServers(
  servers: MCPServerInput | MCPServerInput[] | null | undefined,
): MCPServerWireOutput[] {
  if (servers == null) return [];
  if (typeof servers === 'string') return [serializeSingle(servers)];
  if (isMcpServer(servers)) return [serializeSingle(servers)];
  if (!Array.isArray(servers) && typeof servers === 'object') {
    return [serializeSingle(servers as JsonObject)];
  }
  return (servers as MCPServerInput[]).map(serializeSingle);
}

/** Serialize a single MCP server input to wire format. */
export function serializeSingle(item: MCPServerInput): MCPServerWireOutput {
  if (typeof item === 'string') {
    if (item.startsWith('http://') || item.startsWith('https://')) {
      return item;
    }
    if (item.includes('@')) {
      const spec = wireSpecFromSlug(item);
      validateWireSpec(spec);
      return wireSpecToWire(spec);
    }
    return item;
  }

  if (isMcpServer(item)) {
    const url = item.url;
    if (url != null) {
      const spec = wireSpecFromUrl(url);
      validateWireSpec(spec);
      return wireSpecToWire(spec);
    }
    const name = item.name;
    if (name != null) return name;
    throw new Error("MCP server must have either 'url' or 'name' attribute");
  }

  if (typeof item === 'object' && item !== null) {
    const spec = item as MCPServerWireSpecFields;
    validateWireSpec(spec);
    return wireSpecToWire(spec);
  }

  return String(item);
}

// --- Credential Serialization ---

/** Serialize Credentials schema to wire format. */
export function serializeCredentials(creds: unknown): JsonObject | null {
  if (creds == null) return null;
  if (typeof creds === 'object' && 'toDict' in (creds as object)) {
    return (creds as { toDict(): JsonObject }).toDict();
  }
  return null;
}

/** Serialize tool specs to intents manifest format. */
export function serializeToolSpecs(toolsService: unknown): Record<string, JsonObject> {
  if (toolsService == null) return {};
  const specs = (toolsService as JsonObject)['_toolSpecs'];
  if (!specs || typeof specs !== 'object') return {};

  const manifest: Record<string, JsonObject> = {};
  for (const [name, spec] of Object.entries(specs as JsonObject)) {
    if (spec != null && typeof spec === 'object') {
      const s = spec as JsonObject;
      if ('description' in s) {
        manifest[name] = {
          description: s['description'],
          schema: s['inputSchema'] ?? s['input_schema'] ?? {},
        };
      }
    }
  }
  return manifest;
}

/** Serialize MCPServer with credentials for connection provisioning. */
export function serializeMcpServerWithCreds(server: MCPServerProtocol): JsonObject {
  const result: JsonObject = { name: server.name ?? 'unknown' };

  const creds = (server as JsonObject)['credentials'];
  if (creds != null) {
    const credsDict = serializeCredentials(creds);
    if (credsDict) result['credentials'] = credsDict;
  }

  const connection = (server as JsonObject)['connection'];
  if (connection) result['connection'] = connection;

  return result;
}

// --- Connection Serialization ---

/** Serialize a Connection object to wire format. */
export function serializeConnection(connection: unknown): JsonObject {
  if (connection != null && typeof connection === 'object') {
    if ('toDict' in connection && typeof (connection as JsonObject)['toDict'] === 'function') {
      return (connection as { toDict(): JsonObject }).toDict();
    }
    if (connection instanceof Object && !Array.isArray(connection) && 'name' in connection) {
      // Check if it's a plain dict
      const proto = Object.getPrototypeOf(connection);
      if (proto === Object.prototype || proto === null) {
        return connection as JsonObject;
      }
    }
  }
  // Duck-type extraction
  const obj = connection as JsonObject;
  return {
    name: obj?.['name'] ?? 'unknown',
    base_url: obj?.['base_url'] ?? obj?.['baseUrl'] ?? null,
    timeout_ms: obj?.['timeout_ms'] ?? obj?.['timeoutMs'] ?? 30000,
  };
}

/** Collect unique connections from multiple MCPServer instances. */
export function collectUniqueConnections(servers: unknown[]): unknown[] {
  const seenNames = new Set<string>();
  const unique: unknown[] = [];

  for (const server of servers) {
    const serverObj = server as JsonObject;
    const connections = serverObj['connections'];
    if (connections == null) continue;

    const connList: unknown[] =
      Array.isArray(connections) ? connections
      : typeof connections === 'object' ? Object.values(connections as JsonObject)
      : [];

    for (const conn of connList) {
      let name: string | null = null;
      if (conn != null && typeof conn === 'object') {
        name = (conn as JsonObject)['name'] as string | null;
      }
      if (name && !seenNames.has(name)) {
        seenNames.add(name);
        unique.push(conn);
      }
    }
  }

  return unique;
}

// --- Credential Matching ---

/** Match Credential objects to their Connection definitions. */
export function matchCredentialsToConnections(
  connections: unknown[],
  credentials: unknown[],
): ConnectionCredentialPair[] {
  // Build lookup by connection name
  const credsByName = new Map<string, unknown>();
  for (const cred of credentials) {
    let name: string | null = null;
    if (cred != null && typeof cred === 'object') {
      const c = cred as JsonObject;
      if ('connection' in c && c['connection'] != null && typeof c['connection'] === 'object') {
        name = (c['connection'] as JsonObject)['name'] as string | null;
      } else if ('connection_name' in c) {
        name = c['connection_name'] as string | null;
      }
    }
    if (name) credsByName.set(name, cred);
  }

  const pairs: ConnectionCredentialPair[] = [];
  const missing: string[] = [];

  for (const conn of connections) {
    let name: string | null = null;
    if (conn != null && typeof conn === 'object') {
      name = (conn as JsonObject)['name'] as string | null;
    }
    if (name && credsByName.has(name)) {
      pairs.push([conn, credsByName.get(name) as CredentialProtocol]);
    } else if (name) {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing credentials for connections: ${JSON.stringify(missing.sort())}. ` +
        'Each Connection declared in mcp_servers must have a corresponding Credential.',
    );
  }

  return pairs;
}

/** Validate that all connections across servers have credentials. */
export function validateCredentialsForServers(
  servers: unknown[],
  credentials: unknown[],
): ConnectionCredentialPair[] {
  const connections = collectUniqueConnections(servers);
  return matchCredentialsToConnections(connections, credentials);
}

/** Build a connection record. */
export function buildConnectionRecord(
  server: MCPServerProtocol,
  credentials: Record<string, JsonObject>,
  orgId: string,
): JsonObject {
  const connection = (server as JsonObject)['connection'] as string | null;
  let matchedCreds: JsonObject | null = null;
  if (connection && connection in credentials) {
    matchedCreds = credentials[connection]!;
  }

  return {
    org_id: orgId,
    connection,
    credentials: serializeCredentials((server as JsonObject)['credentials']),
    credential_values: matchedCreds,
  };
}
