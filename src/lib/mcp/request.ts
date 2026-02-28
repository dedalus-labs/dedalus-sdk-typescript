/**
 * MCP request preparation.
 * Port of: dedalus-sdk-python/src/dedalus_labs/lib/mcp/request.py
 *
 * Handles client-side preparation of MCP requests:
 * 1. Serializes MCPServer objects to wire format
 * 2. Deep copies to protect retry logic from mutation
 * 3. Encrypts credentials client-side before transmission
 */

import { type JsonObject } from '../utils/json';
import { encryptCredentials, fetchEncryptionKey } from '../crypto/encryption';
import { type CredentialProtocol } from './protocols';
import { serializeMcpServers, slugToConnectionName, type MCPServerWireOutput } from './wire';

/** Map of connection names to encrypted envelopes (base64url). */
export interface EncryptedCredentials {
  [connectionName: string]: string;
}

// --- Request Preparation ---

/**
 * Serialize mcp_servers, deep copy, and encrypt credentials.
 *
 * @param data - Request body dict.
 * @param asUrl - Authorization server URL for fetching encryption key.
 * @param fetchFn - Optional fetch implementation (defaults to global fetch).
 * @returns A new dict with serialized servers and encrypted credentials.
 */
export async function prepareMcpRequest(
  data: JsonObject,
  asUrl?: string | null,
  fetchFn?: typeof fetch,
): Promise<JsonObject> {
  const servers = data['mcp_servers'];
  const serializedServers =
    servers == null ? null : serializeMcpServers(servers as Parameters<typeof serializeMcpServers>[0]);

  // Read credentials from original data BEFORE deep clone (functions survive)
  const credentials = data['credentials'];

  // If credentials are provided, encrypt them on the client side
  if (credentials && servers && asUrl) {
    const publicKey = await fetchEncryptionKey(asUrl, fetchFn);
    const credList = Array.isArray(credentials) ? credentials : [credentials];
    const encrypted = await encryptCredentialsList(credList, publicKey);

    // Deep copy to avoid mutation side effects
    const result = JSON.parse(JSON.stringify(data)) as JsonObject;
    if (serializedServers != null) {
      result['mcp_servers'] = serializedServers;
    }

    if (Object.keys(encrypted).length > 0) {
      result['mcp_servers'] = embedCredentials(
        (result['mcp_servers'] ?? serializedServers) as MCPServerWireOutput[],
        encrypted,
      );
      delete result['credentials'];
    }

    return result;
  }

  // No encryption needed — just deep copy
  const result = JSON.parse(JSON.stringify(data)) as JsonObject;
  if (serializedServers != null) {
    result['mcp_servers'] = serializedServers;
  }
  return result;
}

// --- Internal Helpers ---

/**
 * Encrypt each credential.
 *
 * Supports both CredentialProtocol objects (from dedalus_mcp) and
 * plain {connection_name, values} dicts (API type format).
 */
export async function encryptCredentialsList(
  credentials: unknown[],
  publicKey: CryptoKey,
): Promise<EncryptedCredentials> {
  const encrypted: EncryptedCredentials = {};

  for (const cred of credentials) {
    if (cred == null || typeof cred !== 'object') continue;
    const c = cred as JsonObject;

    // Extract connection name
    let connectionName: string | null = null;
    if (c['connection'] != null && typeof c['connection'] === 'object') {
      connectionName = (c['connection'] as JsonObject)['name'] as string | null;
    } else if (typeof c['connection_name'] === 'string') {
      connectionName = c['connection_name'];
    }

    // Extract values
    let values: JsonObject | null = null;
    if (typeof c['valuesForEncryption'] === 'function') {
      values = (c as CredentialProtocol).valuesForEncryption();
    } else if (c['values'] != null && typeof c['values'] === 'object') {
      values = c['values'] as JsonObject;
    }

    if (connectionName && values) {
      encrypted[connectionName] = await encryptCredentials(publicKey, values);
    }
  }

  return encrypted;
}

/**
 * Return the subset of encrypted credentials that belongs to a server, or null.
 *
 * Derives the connection name via slugToConnectionName and looks it up in the
 * full encrypted map.
 */
function credentialsForServer(
  name: string,
  allCreds: EncryptedCredentials,
): { [conn: string]: string } | null {
  const conn = slugToConnectionName(name);
  const blob = allCreds[conn];
  return blob ? { [conn]: blob } : null;
}

/**
 * Embed encrypted credentials into each server spec.
 *
 * Each server receives only its own credentials, matched by connection name
 * via slugToConnectionName.
 */
export function embedCredentials(
  servers: MCPServerWireOutput[],
  encrypted: EncryptedCredentials,
): JsonObject[] {
  return servers.map((server) => {
    if (typeof server === 'string') {
      const creds = credentialsForServer(server, encrypted);
      if (server.startsWith('http://') || server.startsWith('https://')) {
        return { url: server, name: server, credentials: creds };
      }
      return { slug: server, name: server, credentials: creds };
    }
    // Existing spec dict → derive name and scope credentials
    const name = (server['name'] ?? server['slug'] ?? server['url'] ?? '') as string;
    const creds = credentialsForServer(name, encrypted);
    return { ...server, name, credentials: creds };
  });
}
