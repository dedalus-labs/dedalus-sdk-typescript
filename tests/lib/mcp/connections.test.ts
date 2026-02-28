/**
 * Tests for Connection/Credential wire format serialization.
 * Port of: dedalus-sdk-python/tests/test_mcp_wire_connections.py
 */

import {
  serializeConnection,
  collectUniqueConnections,
  matchCredentialsToConnections,
  validateCredentialsForServers,
} from '../../../src/lib/mcp';

// --- Mock objects ---

class MockConnection {
  private _name: string;
  private _baseUrl: string | null;
  private _timeoutMs: number;

  constructor(name: string, baseUrl?: string | null, timeoutMs = 30000) {
    this._name = name;
    this._baseUrl = baseUrl ?? null;
    this._timeoutMs = timeoutMs;
  }

  get name() {
    return this._name;
  }
  get base_url() {
    return this._baseUrl;
  }
  get timeout_ms() {
    return this._timeoutMs;
  }

  toDict(): Record<string, unknown> {
    const result: Record<string, unknown> = { name: this._name };
    if (this._baseUrl != null) result['base_url'] = this._baseUrl;
    if (this._timeoutMs !== 30000) result['timeout_ms'] = this._timeoutMs;
    return result;
  }
}

class MockCredential {
  private _connection: MockConnection;
  private _values: Record<string, unknown>;

  constructor(connection: MockConnection, values: Record<string, unknown>) {
    this._connection = connection;
    this._values = values;
  }

  get connection() {
    return this._connection;
  }
  get values() {
    return { ...this._values };
  }

  toDict(): Record<string, unknown> {
    return { connection_name: this._connection.name, values: { ...this._values } };
  }

  valuesForEncryption(): Record<string, unknown> {
    return { ...this._values };
  }
}

class MockServer {
  name: string;
  connections: unknown[];
  constructor(name: string, connections?: unknown[]) {
    this.name = name;
    this.connections = connections ?? [];
  }
}

// --- TestSerializeConnection ---

describe('TestSerializeConnection', () => {
  test('with connection object (toDict)', () => {
    const conn = new MockConnection('github', 'https://api.github.com', 60000);
    const result = serializeConnection(conn);
    expect(result['name']).toBe('github');
    expect(result['base_url']).toBe('https://api.github.com');
    expect(result['timeout_ms']).toBe(60000);
  });

  test('with dict passthrough', () => {
    const data = { name: 'dedalus', base_url: 'https://api.dedaluslabs.ai/v1' };
    const result = serializeConnection(data);
    expect(result).toEqual(data);
  });

  test('duck type extraction', () => {
    class BareConnection {
      name = 'bare';
      base_url = 'https://bare.api.com';
      timeout_ms = 15000;
    }
    const result = serializeConnection(new BareConnection());
    expect(result['name']).toBe('bare');
    expect(result['base_url']).toBe('https://bare.api.com');
    expect(result['timeout_ms']).toBe(15000);
  });
});

// --- TestMatchCredentialsToConnections ---

describe('TestMatchCredentialsToConnections', () => {
  test('basic matching by name', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');

    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });
    const dedalusSecret = new MockCredential(dedalus, { api_key: 'sk_xxx' });

    const pairs = matchCredentialsToConnections(
      [github, dedalus],
      [dedalusSecret, githubSecret], // Different order
    );

    expect(pairs).toHaveLength(2);
    expect((pairs[0]![0] as MockConnection).name).toBe('github');
    expect((pairs[0]![1] as MockCredential).values).toEqual({ token: 'ghp_xxx' });
    expect((pairs[1]![0] as MockConnection).name).toBe('dedalus');
    expect((pairs[1]![1] as MockCredential).values).toEqual({ api_key: 'sk_xxx' });
  });

  test('missing secret raises error', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');

    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });

    expect(() => matchCredentialsToConnections([github, dedalus], [githubSecret])).toThrow(
      /Missing credentials.*dedalus/,
    );
  });

  test('with dict inputs', () => {
    const connections = [{ name: 'api' }];
    const secrets = [{ connection_name: 'api', values: { key: 'xxx' } }];

    const pairs = matchCredentialsToConnections(connections, secrets);

    expect(pairs).toHaveLength(1);
    expect((pairs[0]![0] as Record<string, unknown>)['name']).toBe('api');
    expect((pairs[0]![1] as Record<string, unknown>)['values']).toEqual({ key: 'xxx' });
  });

  test('missing multiple secrets lists all', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');
    const slack = new MockConnection('slack');

    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });

    expect(() => matchCredentialsToConnections([github, dedalus, slack], [githubSecret])).toThrow(/dedalus/);
    expect(() => matchCredentialsToConnections([github, dedalus, slack], [githubSecret])).toThrow(/slack/);
  });
});

// --- TestCollectUniqueConnections ---

describe('TestCollectUniqueConnections', () => {
  test('single server', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');
    const server = new MockServer('bot', [github, dedalus]);

    const result = collectUniqueConnections([server]);

    expect(result).toHaveLength(2);
    expect((result[0] as MockConnection).name).toBe('github');
    expect((result[1] as MockConnection).name).toBe('dedalus');
  });

  test('shared connection deduplicated', () => {
    const github = new MockConnection('github');

    const serverA = new MockServer('issues', [github]);
    const serverB = new MockServer('prs', [github]);

    const result = collectUniqueConnections([serverA, serverB]);

    expect(result).toHaveLength(1);
    expect((result[0] as MockConnection).name).toBe('github');
  });

  test('same name different objects', () => {
    const githubA = new MockConnection('github', 'https://api.github.com');
    const githubB = new MockConnection('github', 'https://api.github.com');

    const serverA = new MockServer('a', [githubA]);
    const serverB = new MockServer('b', [githubB]);

    const result = collectUniqueConnections([serverA, serverB]);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(githubA); // First occurrence kept
  });

  test('multiple servers multiple connections', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');
    const slack = new MockConnection('slack');

    const serverA = new MockServer('bot1', [github, dedalus]);
    const serverB = new MockServer('bot2', [github, slack]);

    const result = collectUniqueConnections([serverA, serverB]);

    expect(result).toHaveLength(3);
    const names = result.map((c) => (c as MockConnection).name);
    expect(names).toEqual(['github', 'dedalus', 'slack']);
  });

  test('server without connections', () => {
    const serverA = new MockServer('empty');
    const serverB = new MockServer('has', [new MockConnection('api')]);

    const result = collectUniqueConnections([serverA, serverB]);

    expect(result).toHaveLength(1);
  });
});

// --- TestValidateCredentialsForServers ---

describe('TestValidateCredentialsForServers', () => {
  test('all connections have secrets', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');

    const server = new MockServer('bot', [github, dedalus]);

    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });
    const dedalusSecret = new MockCredential(dedalus, { api_key: 'sk_xxx' });

    const pairs = validateCredentialsForServers([server], [githubSecret, dedalusSecret]);

    expect(pairs).toHaveLength(2);
  });

  test('shared connection one secret', () => {
    const github = new MockConnection('github');

    const serverA = new MockServer('issues', [github]);
    const serverB = new MockServer('prs', [github]);

    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });

    const pairs = validateCredentialsForServers([serverA, serverB], [githubSecret]);

    expect(pairs).toHaveLength(1);
    expect((pairs[0]![0] as MockConnection).name).toBe('github');
  });

  test('missing secret fails fast', () => {
    const github = new MockConnection('github');
    const dedalus = new MockConnection('dedalus');

    const server = new MockServer('bot', [github, dedalus]);
    const githubSecret = new MockCredential(github, { token: 'ghp_xxx' });

    expect(() => validateCredentialsForServers([server], [githubSecret])).toThrow(/dedalus/);
    expect(() => validateCredentialsForServers([server], [githubSecret])).toThrow(/Missing credentials/);
  });
});
