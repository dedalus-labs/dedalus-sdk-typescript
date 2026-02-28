/**
 * Tests for MCP server wire format serialization.
 * Port of: dedalus-sdk-python/tests/test_mcp_wire.py
 */

import {
  validateWireSpec,
  wireSpecToWire,
  wireSpecFromSlug,
  wireSpecFromUrl,
  serializeMcpServers,
  isMcpServer,
  type MCPServerProtocol,
  type MCPServerWireSpecFields,
} from '../../../src/lib/mcp';

// --- Fixtures ---

class FakeMCPServer implements MCPServerProtocol {
  name: string;
  url?: string | null;
  constructor(name: string, url?: string | null) {
    this.name = name;
    this.url = url ?? null;
  }
  serve() {}
}

class IncompleteServer {
  name = 'incomplete';
}

// --- MCPServerWireSpec Construction ---

describe('TestMCPServerWireSpecConstruction', () => {
  test('from slug simple', () => {
    const spec = wireSpecFromSlug('dedalus-labs/example-server');
    expect(spec.slug).toBe('dedalus-labs/example-server');
    expect(spec.version).toBeNull();
  });

  test('from slug with version', () => {
    const spec = wireSpecFromSlug('dedalus-labs/example-server', 'v1.2.0');
    expect(spec.version).toBe('v1.2.0');
  });

  test('from slug with embedded version @v2', () => {
    const spec = wireSpecFromSlug('dedalus-labs/example-server@v2');
    expect(spec.slug).toBe('dedalus-labs/example-server');
    expect(spec.version).toBe('v2');
  });

  test('from slug with trailing @ throws', () => {
    expect(() => wireSpecFromSlug('dedalus-labs/example-server@')).toThrow('version in slug cannot be empty');
  });

  test('from url', () => {
    const spec = wireSpecFromUrl('http://127.0.0.1:8000/mcp');
    expect(spec.url).toBe('http://127.0.0.1:8000/mcp');
  });
});

// --- MCPServerWireSpec Validation ---

describe('TestMCPServerWireSpecValidation', () => {
  test('requires slug or url', () => {
    expect(() => validateWireSpec({})).toThrow("requires either 'slug' or 'url'");
  });

  test('rejects both slug and url', () => {
    expect(() =>
      validateWireSpec({ slug: 'dedalus-labs/example-server', url: 'http://localhost:8000/mcp' }),
    ).toThrow('cannot have both');
  });

  test('url must start with http', () => {
    expect(() => validateWireSpec({ url: 'localhost:8000/mcp' })).toThrow('must start with http://');
  });

  test('https url accepted', () => {
    expect(() => validateWireSpec({ url: 'https://mcp.dedaluslabs.ai/acme/my-server/mcp' })).not.toThrow();
  });

  test('localhost url accepted', () => {
    expect(() => validateWireSpec({ url: 'http://127.0.0.1:8000/mcp' })).not.toThrow();
  });

  test('slug format validation', () => {
    expect(() => validateWireSpec({ slug: 'dedalus-labs/example-server' })).not.toThrow();
    expect(() => validateWireSpec({ slug: 'org_123/project_456' })).not.toThrow();
    expect(() => validateWireSpec({ slug: 'a/b' })).not.toThrow();

    expect(() => validateWireSpec({ slug: 'invalid-no-slash' })).toThrow();
    expect(() => validateWireSpec({ slug: 'too/many/slashes' })).toThrow();
  });

  test('slug with @ and version field rejected with conflict error', () => {
    expect(() => validateWireSpec({ slug: 'org/project@v1', version: 'v2' })).toThrow(
      "cannot specify both 'version' field and version in slug",
    );

    // Correct way: use wireSpecFromSlug which parses the version
    const spec = wireSpecFromSlug('org/project@v1');
    expect(spec.slug).toBe('org/project');
    expect(spec.version).toBe('v1');
  });

  test('empty string slug rejected', () => {
    expect(() => validateWireSpec({ slug: '' })).toThrow('slug must match org/name pattern');
  });

  test('empty string url rejected', () => {
    expect(() => validateWireSpec({ url: '' })).toThrow('URL must start with http:// or https://');
  });

  test('extra fields forbidden', () => {
    expect(() =>
      validateWireSpec({ slug: 'org/test', unknownField: 'value' } as unknown as MCPServerWireSpecFields),
    ).toThrow('extra field not allowed');
  });
});

// --- MCPServerWireSpec Serialization ---

describe('TestMCPServerWireSpecSerialization', () => {
  test('simple slug serializes to string', () => {
    const spec = wireSpecFromSlug('dedalus-labs/example-server');
    const wire = wireSpecToWire(spec);
    expect(wire).toBe('dedalus-labs/example-server');
    expect(typeof wire).toBe('string');
  });

  test('versioned slug serializes to dict', () => {
    const spec = wireSpecFromSlug('dedalus-labs/example-server', 'v1.0.0');
    const wire = wireSpecToWire(spec);
    expect(wire).toEqual({ slug: 'dedalus-labs/example-server', version: 'v1.0.0' });
  });

  test('url spec serializes to dict', () => {
    const spec = wireSpecFromUrl('http://127.0.0.1:8000/mcp');
    const wire = wireSpecToWire(spec);
    expect(wire).toEqual({ url: 'http://127.0.0.1:8000/mcp' });
  });

  test('serialization is JSON compatible', () => {
    const spec = wireSpecFromUrl('http://127.0.0.1:8000/mcp');
    const jsonStr = JSON.stringify(wireSpecToWire(spec));
    expect(jsonStr).toContain('"url":"http://127.0.0.1:8000/mcp"');
  });
});

// --- MCPServerProtocol ---

describe('TestMCPServerProtocol', () => {
  test('fake server satisfies protocol', () => {
    const server = new FakeMCPServer('test', 'http://localhost:8000/mcp');
    expect(isMcpServer(server)).toBe(true);
  });

  test('string does not satisfy protocol', () => {
    expect(isMcpServer('dedalus-labs/example-server')).toBe(false);
  });

  test('dict does not satisfy protocol', () => {
    expect(isMcpServer({ name: 'test', url: 'http://localhost/mcp' })).toBe(false);
  });

  test('incomplete server does not satisfy', () => {
    expect(isMcpServer(new IncompleteServer())).toBe(false);
  });
});

// --- serializeMcpServers ---

describe('TestSerializeMCPServers', () => {
  test('none returns empty list', () => {
    expect(serializeMcpServers(null)).toEqual([]);
  });

  test('single string slug', () => {
    expect(serializeMcpServers('dedalus-labs/example-server')).toEqual(['dedalus-labs/example-server']);
  });

  test('single string url', () => {
    expect(serializeMcpServers('http://localhost:8000/mcp')).toEqual(['http://localhost:8000/mcp']);
  });

  test('single mcp server object', () => {
    const server = new FakeMCPServer('calculator', 'http://127.0.0.1:8000/mcp');
    expect(serializeMcpServers(server)).toEqual([{ url: 'http://127.0.0.1:8000/mcp' }]);
  });

  test('list of slugs', () => {
    expect(serializeMcpServers(['dedalus-labs/example-server', 'dedalus-labs/weather'])).toEqual([
      'dedalus-labs/example-server',
      'dedalus-labs/weather',
    ]);
  });

  test('versioned slug in list', () => {
    expect(serializeMcpServers(['dedalus-labs/example-server@v2'])).toEqual([
      { slug: 'dedalus-labs/example-server', version: 'v2' },
    ]);
  });

  test('mixed list', () => {
    const server = new FakeMCPServer('local', 'http://127.0.0.1:8000/mcp');
    const result = serializeMcpServers([server, 'dedalus-labs/example-server', 'dedalus-labs/weather@v2']);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ url: 'http://127.0.0.1:8000/mcp' });
    expect(result[1]).toBe('dedalus-labs/example-server');
    expect(result[2]).toEqual({ slug: 'dedalus-labs/weather', version: 'v2' });
  });

  test('server without url uses name as slug', () => {
    const server = new FakeMCPServer('org/my-server', null);
    expect(serializeMcpServers(server)).toEqual(['org/my-server']);
  });

  test('dict input validated', () => {
    expect(serializeMcpServers([{ slug: 'dedalus-labs/test' }])).toEqual(['dedalus-labs/test']);
  });
});

// --- JSON Compatibility ---

describe('TestJSONCompatibility', () => {
  test('full payload structure', () => {
    const server = new FakeMCPServer('calculator', 'http://127.0.0.1:8000/mcp');
    const wireData = serializeMcpServers([server, 'dedalus-labs/example-server', 'dedalus-labs/weather@v2']);

    const payload = {
      model: 'openai/gpt-5-nano',
      messages: [{ role: 'user', content: 'What is 2 + 2?' }],
      mcp_servers: wireData,
    };

    const parsed = JSON.parse(JSON.stringify(payload));
    expect(parsed.mcp_servers[0]).toEqual({ url: 'http://127.0.0.1:8000/mcp' });
    expect(parsed.mcp_servers[1]).toBe('dedalus-labs/example-server');
    expect(parsed.mcp_servers[2].slug).toBe('dedalus-labs/weather');
  });

  test('unicode in url', () => {
    const spec: MCPServerWireSpecFields = { url: 'http://mcp.dedaluslabs.ai/acme/計算機/mcp' };
    validateWireSpec(spec);
    const result = wireSpecToWire(spec);
    const jsonStr = JSON.stringify(result);
    expect(jsonStr).toContain('計算機');
  });
});
