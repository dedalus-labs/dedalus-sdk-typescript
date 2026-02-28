/**
 * Tests for MCP request preparation orchestrator.
 * Tests prepareMcpRequest, encryptCredentialsList, embedCredentials.
 */

import { prepareMcpRequest, embedCredentials, slugToConnectionName } from '../../../src/lib/mcp';
import { b64urlDecode, NONCE_LEN } from '../../../src/lib/crypto/encryption';

const RSA_ALGORITHM = { name: 'RSA-OAEP', hash: 'SHA-256' } as const;

let privateKey: CryptoKey;
let publicKey: CryptoKey;
let jwk: JsonWebKey;

// Mock fetch that returns JWKS
function createMockFetch(jwkKey: JsonWebKey): typeof fetch {
  return (async (_url: string | URL | Request) => {
    return new Response(JSON.stringify({ keys: [{ ...jwkKey, use: 'enc', kid: 'test-1' }] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;
}

async function decryptEnvelope(
  privKey: CryptoKey,
  b64: string,
  keySize: number,
): Promise<Record<string, unknown>> {
  const envelope = b64urlDecode(b64);
  const keySizeBytes = keySize / 8;
  const wrappedKey = envelope.slice(1, 1 + keySizeBytes);
  const nonce = envelope.slice(1 + keySizeBytes, 1 + keySizeBytes + NONCE_LEN);
  const ct = envelope.slice(1 + keySizeBytes + NONCE_LEN);
  const aesKeyRaw = await crypto.subtle.decrypt(RSA_ALGORITHM, privKey, wrappedKey);
  const aesKey = await crypto.subtle.importKey('raw', aesKeyRaw, { name: 'AES-GCM' }, false, ['decrypt']);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, aesKey, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}

beforeAll(async () => {
  const kp = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
  privateKey = kp.privateKey;
  publicKey = kp.publicKey;
  jwk = await crypto.subtle.exportKey('jwk', publicKey);
});

// --- TestPrepareMcpRequest ---

describe('TestPrepareMcpRequest', () => {
  test('full orchestration: encrypt, embed, strip plaintext', async () => {
    const mockFetch = createMockFetch(jwk);
    const data: Record<string, unknown> = {
      model: 'openai/gpt-4o-mini',
      mcp_servers: ['org/server'],
      credentials: [
        { connection: { name: 'org-server' }, valuesForEncryption: () => ({ token: 'ghp_xxx' }) },
      ],
    };

    const result = await prepareMcpRequest(data, 'https://as.example.com', mockFetch);

    // credentials field removed
    expect(result['credentials']).toBeUndefined();
    // mcp_servers converted to spec dicts with scoped credentials
    const servers = result['mcp_servers'] as Record<string, unknown>[];
    expect(servers).toHaveLength(1);
    expect(servers[0]!['slug']).toBe('org/server');
    expect(servers[0]!['credentials']).toBeDefined();

    // Verify per-server scoping: only org-server credential present
    const creds = servers[0]!['credentials'] as Record<string, string>;
    expect(Object.keys(creds)).toEqual(['org-server']);
    const decrypted = await decryptEnvelope(privateKey, creds['org-server']!, 2048);
    expect(decrypted).toEqual({ token: 'ghp_xxx' });
  });

  test('single credential object normalized to array', async () => {
    const mockFetch = createMockFetch(jwk);
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: { connection: { name: 'org-server' }, valuesForEncryption: () => ({ key: 'sk_xxx' }) },
    };

    const result = await prepareMcpRequest(data, 'https://as.example.com', mockFetch);

    expect(result['credentials']).toBeUndefined();
    const servers = result['mcp_servers'] as Record<string, unknown>[];
    const creds = servers[0]!['credentials'] as Record<string, string>;
    expect(creds['org-server']).toBeDefined();
  });

  test('multi-server: each server gets only its own credential', async () => {
    const mockFetch = createMockFetch(jwk);
    const data: Record<string, unknown> = {
      mcp_servers: ['acme/github', 'acme/slack'],
      credentials: [
        { connection: { name: 'acme-github' }, valuesForEncryption: () => ({ token: 'ghp_xxx' }) },
        {
          connection: { name: 'acme-slack' },
          valuesForEncryption: () => ({ webhook: 'https://hooks.slack.com/xxx' }),
        },
      ],
    };

    const result = await prepareMcpRequest(data, 'https://as.example.com', mockFetch);

    const servers = result['mcp_servers'] as Record<string, unknown>[];
    expect(servers).toHaveLength(2);

    // First server gets only github credential
    const ghCreds = servers[0]!['credentials'] as Record<string, string>;
    expect(Object.keys(ghCreds)).toEqual(['acme-github']);
    const gh = await decryptEnvelope(privateKey, ghCreds['acme-github']!, 2048);
    expect(gh).toEqual({ token: 'ghp_xxx' });

    // Second server gets only slack credential
    const slCreds = servers[1]!['credentials'] as Record<string, string>;
    expect(Object.keys(slCreds)).toEqual(['acme-slack']);
    const sl = await decryptEnvelope(privateKey, slCreds['acme-slack']!, 2048);
    expect(sl).toEqual({ webhook: 'https://hooks.slack.com/xxx' });
  });

  test('plain Credential dicts work', async () => {
    const mockFetch = createMockFetch(jwk);
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: [{ connection_name: 'org-server', values: { key: 'sk_test' } }],
    };

    const result = await prepareMcpRequest(data, 'https://as.example.com', mockFetch);

    const servers = result['mcp_servers'] as Record<string, unknown>[];
    const creds = servers[0]!['credentials'] as Record<string, string>;
    const decrypted = await decryptEnvelope(privateKey, creds['org-server']!, 2048);
    expect(decrypted).toEqual({ key: 'sk_test' });
  });

  test('no credentials → passthrough', async () => {
    const data = { model: 'openai/gpt-4o-mini', mcp_servers: ['org/server'] };
    const result = await prepareMcpRequest(data, 'https://as.example.com');

    expect(result['mcp_servers']).toEqual(['org/server']);
  });

  test('no mcp_servers → passthrough', async () => {
    const data = {
      model: 'openai/gpt-4o-mini',
      credentials: [{ connection_name: 'api', values: { key: 'x' } }],
    };
    const result = await prepareMcpRequest(data, 'https://as.example.com');

    expect(result['credentials']).toBeDefined(); // Not stripped since no servers
  });

  test('no asUrl → passthrough', async () => {
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: [{ connection_name: 'api', values: { key: 'x' } }],
    };
    const result = await prepareMcpRequest(data, null);

    expect(result['credentials']).toBeDefined();
  });

  test('deep clone protects original data', async () => {
    const mockFetch = createMockFetch(jwk);
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: [{ connection: { name: 'org-server' }, valuesForEncryption: () => ({ key: 'secret' }) }],
      extra: { nested: 'value' },
    };

    const result = await prepareMcpRequest(data, 'https://as.example.com', mockFetch);

    // Result is a separate object
    expect(result).not.toBe(data);
    // Mutation of result doesn't affect original nested objects
    (result['extra'] as Record<string, unknown>)['nested'] = 'mutated';
    expect((data['extra'] as Record<string, unknown>)['nested']).toBe('value');
  });

  test('JWKS fetch error propagates', async () => {
    const failFetch = (async () => new Response('', { status: 500 })) as typeof fetch;
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: [{ connection_name: 'api', values: { key: 'x' } }],
    };

    await expect(prepareMcpRequest(data, 'https://as.example.com', failFetch)).rejects.toThrow(
      'failed to fetch JWKS',
    );
  });

  test('no suitable RSA enc key throws', async () => {
    const noKeyFetch = (async () =>
      new Response(JSON.stringify({ keys: [{ kty: 'EC', use: 'sig' }] }), {
        status: 200,
      })) as typeof fetch;
    const data: Record<string, unknown> = {
      mcp_servers: ['org/server'],
      credentials: [{ connection_name: 'api', values: { key: 'x' } }],
    };

    await expect(prepareMcpRequest(data, 'https://as.example.com', noKeyFetch)).rejects.toThrow(
      'no RSA encryption key found',
    );
  });
});

// --- TestSlugToConnectionName ---

describe('TestSlugToConnectionName', () => {
  test('replaces slash with dash', () => {
    expect(slugToConnectionName('org/server')).toBe('org-server');
  });

  test('no slash passes through', () => {
    expect(slugToConnectionName('plain-name')).toBe('plain-name');
  });

  test('URL passes through with slash replaced', () => {
    expect(slugToConnectionName('https://example.com/mcp')).toBe('https:--example.com-mcp');
  });
});

// --- TestEmbedCredentials ---

describe('TestEmbedCredentials', () => {
  // Connection names use slugToConnectionName: org/server → org-server
  const encrypted = { 'org-server': 'encrypted_blob_1', 'acme-slack': 'encrypted_blob_2' };

  test('slug string gets only its own credential', () => {
    const result = embedCredentials(['org/server'], encrypted);
    expect(result[0]).toEqual({
      slug: 'org/server',
      name: 'org/server',
      credentials: { 'org-server': 'encrypted_blob_1' },
    });
  });

  test('multi-server: each gets only its own credential', () => {
    const result = embedCredentials(['org/server', 'acme/slack'], encrypted);
    expect(result[0]!['credentials']).toEqual({ 'org-server': 'encrypted_blob_1' });
    expect(result[1]!['credentials']).toEqual({ 'acme-slack': 'encrypted_blob_2' });
  });

  test('unmatched server gets null credentials', () => {
    const result = embedCredentials(['unknown/other'], encrypted);
    expect(result[0]!['credentials']).toBeNull();
  });

  test('URL string gets scoped credentials', () => {
    const urlCreds = { 'https:--mcp.example.com-server': 'blob_url' };
    const result = embedCredentials(['https://mcp.example.com/server'], urlCreds);
    expect(result[0]).toEqual({
      url: 'https://mcp.example.com/server',
      name: 'https://mcp.example.com/server',
      credentials: { 'https:--mcp.example.com-server': 'blob_url' },
    });
  });

  test('dict spec gets scoped credentials', () => {
    const result = embedCredentials([{ slug: 'org/server', version: 'v2' }], encrypted);
    expect(result[0]).toEqual({
      slug: 'org/server',
      version: 'v2',
      name: 'org/server',
      credentials: { 'org-server': 'encrypted_blob_1' },
    });
  });

  test('name derived from slug/url/name field', () => {
    const r1 = embedCredentials([{ slug: 'org/server' }], encrypted);
    expect(r1[0]!['name']).toBe('org/server');

    const r2 = embedCredentials([{ url: 'https://x.com/mcp' }], encrypted);
    expect(r2[0]!['name']).toBe('https://x.com/mcp');

    const r3 = embedCredentials([{ slug: 'org/server', name: 'custom' }], encrypted);
    expect(r3[0]!['name']).toBe('custom');
  });

  test('dict with custom name uses name for credential lookup', () => {
    const creds = { custom: 'blob_custom' };
    const result = embedCredentials([{ slug: 'org/server', name: 'custom' }], creds);
    expect(result[0]!['credentials']).toEqual({ custom: 'blob_custom' });
  });
});
