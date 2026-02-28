import { transformRequestBody } from '../../src/lib/case-conversion';

describe('transformRequestBody', () => {
  test('preserves credentials map keys inside mcp_servers', () => {
    const body = {
      toolChoice: 'auto',
      mcp_servers: [{ slug: 'MyOrg/Server', credentials: { 'MyOrg-Server': 'encrypted_blob' } }],
    };

    const result = transformRequestBody(body) as Record<string, unknown>;
    const servers = result['mcp_servers'] as Record<string, unknown>[];
    const server = servers[0] as Record<string, unknown>;

    expect(result['tool_choice']).toBe('auto');
    expect(server['credentials']).toEqual({ 'MyOrg-Server': 'encrypted_blob' });
  });
});
