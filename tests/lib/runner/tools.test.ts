import { createToolHandler } from '../../../src/lib/runner/tools';
import type { ToolDefinition } from '../../../src/lib/runner/types/tools';

describe('createToolHandler', () => {
  describe('ToolFunction (legacy)', () => {
    it('registers function as server tool', () => {
      function greet(name: string) {
        return `Hello ${name}`;
      }
      const handler = createToolHandler([greet]);

      expect(handler.toolNames).toContain('greet');
      expect(handler.isClientTool('greet')).toBe(false);
    });

    it('executes function tool', async () => {
      function add(a: number, b: number) {
        return a + b;
      }
      const handler = createToolHandler([add]);

      const result = await handler.exec('add', { a: 2, b: 3 });
      expect(result).toBe(5);
    });

    it('generates schema from function signature', () => {
      function search(query: string) {
        return [];
      }
      const handler = createToolHandler([search]);

      expect(handler.schemas).toHaveLength(1);
      expect(handler.schemas![0]?.function.name).toBe('search');
    });
  });

  describe('ToolDefinition with execute', () => {
    it('registers as server tool', () => {
      const tool: ToolDefinition = {
        name: 'weather',
        description: 'Get weather',
        parameters: { type: 'object', properties: { city: { type: 'string' } } },
        execute: async ({ city }) => ({ temp: 72, city }),
      };
      const handler = createToolHandler([tool]);

      expect(handler.toolNames).toContain('weather');
      expect(handler.isClientTool('weather')).toBe(false);
    });

    it('executes tool definition', async () => {
      const tool: ToolDefinition = {
        name: 'double',
        execute: async ({ n }) => (n as number) * 2,
      };
      const handler = createToolHandler([tool]);

      const result = await handler.exec('double', { n: 5 });
      expect(result).toBe(10);
    });

    it('uses explicit schema', () => {
      const tool: ToolDefinition = {
        name: 'search',
        description: 'Search documents',
        parameters: {
          type: 'object',
          properties: { query: { type: 'string' }, limit: { type: 'number' } },
          required: ['query'],
        },
        execute: async () => [],
      };
      const handler = createToolHandler([tool]);

      expect(handler.schemas![0]?.function.parameters).toEqual(tool.parameters);
    });

    it('includes strict option in schema when provided', () => {
      const tool: ToolDefinition = {
        name: 'strictTool',
        parameters: { type: 'object', properties: { input: { type: 'string' } } },
        strict: true,
        execute: async () => 'result',
      };
      const handler = createToolHandler([tool]);

      expect(handler.schemas![0]?.function.strict).toBe(true);
    });
  });

  describe('ToolDefinition without execute (client tool)', () => {
    it('registers as client tool', () => {
      const tool: ToolDefinition = {
        name: 'askConfirmation',
        description: 'Ask user to confirm',
        parameters: { type: 'object', properties: { message: { type: 'string' } } },
        // No execute - client-side
      };
      const handler = createToolHandler([tool]);

      expect(handler.isClientTool('askConfirmation')).toBe(true);
      expect(handler.toolNames).toContain('askConfirmation');
    });

    it('throws when trying to execute client tool', async () => {
      const tool: ToolDefinition = {
        name: 'getLocation',
        parameters: { type: 'object', properties: {} },
      };
      const handler = createToolHandler([tool]);

      await expect(handler.exec('getLocation', {})).rejects.toThrow(
        'Tool "getLocation" is a client-side tool',
      );
    });

    it('includes client tool in schemas', () => {
      const tool: ToolDefinition = {
        name: 'selectFile',
        description: 'Let user select a file',
        parameters: { type: 'object', properties: { accept: { type: 'string' } } },
      };
      const handler = createToolHandler([tool]);

      expect(handler.schemas).toHaveLength(1);
      expect(handler.schemas![0]?.function.name).toBe('selectFile');
    });
  });

  describe('mixed tools', () => {
    it('correctly categorizes mixed tool types', () => {
      function legacyTool() {
        return 'legacy';
      }

      const serverTool: ToolDefinition = {
        name: 'serverTool',
        execute: async () => 'server',
      };

      const clientTool: ToolDefinition = {
        name: 'clientTool',
        // No execute
      };

      const handler = createToolHandler([legacyTool, serverTool, clientTool]);

      // All tools in toolNames
      expect(handler.toolNames).toHaveLength(3);
      expect(handler.toolNames).toContain('legacyTool');
      expect(handler.toolNames).toContain('serverTool');
      expect(handler.toolNames).toContain('clientTool');

      // Client vs server distinction via isClientTool
      expect(handler.isClientTool('legacyTool')).toBe(false);
      expect(handler.isClientTool('serverTool')).toBe(false);
      expect(handler.isClientTool('clientTool')).toBe(true);

      expect(handler.schemas).toHaveLength(3);
    });

    it('generates schemas for all tool types', () => {
      function funcTool(query: string) {
        return query;
      }

      const defTool: ToolDefinition = {
        name: 'defTool',
        description: 'A defined tool',
        parameters: { type: 'object', properties: { x: { type: 'number' } } },
        execute: async () => 42,
      };

      const clientTool: ToolDefinition = {
        name: 'clientTool',
        description: 'Client-side tool',
        parameters: { type: 'object', properties: { msg: { type: 'string' } } },
      };

      const handler = createToolHandler([funcTool, defTool, clientTool]);

      expect(handler.schemas).toHaveLength(3);
      expect(handler.schemas!.map((s) => s.function.name).sort()).toEqual([
        'clientTool',
        'defTool',
        'funcTool',
      ]);
    });
  });

  describe('edge cases', () => {
    it('returns null schemas for empty tools', () => {
      const handler = createToolHandler([]);
      expect(handler.schemas).toBeNull();
    });

    it('throws for unknown tool', async () => {
      const handler = createToolHandler([]);
      await expect(handler.exec('unknown', {})).rejects.toThrow('Unknown tool: unknown');
    });

    it('handles tool with no parameters', () => {
      const tool: ToolDefinition = {
        name: 'noParams',
        description: 'A tool with no params',
        execute: async () => 'done',
      };
      const handler = createToolHandler([tool]);

      expect(handler.schemas![0]?.function.parameters).toEqual({ type: 'object', properties: {} });
    });

    it('handles tool with default description', () => {
      const tool: ToolDefinition = {
        name: 'myTool',
        execute: async () => 'result',
      };
      const handler = createToolHandler([tool]);

      expect(handler.schemas![0]?.function.description).toBe('Execute myTool');
    });
  });

  describe('Zod schema support', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const z = require('zod');

    it('converts Zod schema to JSON Schema', () => {
      const tool: ToolDefinition = {
        name: 'search',
        description: 'Search for items',
        parameters: z.object({
          query: z.string(),
          limit: z.number().optional(),
        }),
        execute: async () => [],
      };
      const handler = createToolHandler([tool]);

      const params = handler.schemas![0]?.function.parameters as any;
      expect(params.type).toBe('object');
      expect(params.properties).toBeDefined();
      expect(params.properties.query).toBeDefined();
      expect(params.properties.limit).toBeDefined();
    });

    it('preserves Zod descriptions in schema', () => {
      const tool: ToolDefinition = {
        name: 'getWeather',
        description: 'Get weather for a location',
        parameters: z.object({
          city: z.string().describe('The city name'),
          units: z.enum(['celsius', 'fahrenheit']).describe('Temperature units'),
        }),
        execute: async () => ({ temp: 72 }),
      };
      const handler = createToolHandler([tool]);

      const params = handler.schemas![0]?.function.parameters as any;
      const properties = params.properties as any;
      expect(properties.city.description).toBe('The city name');
      expect(properties.units.description).toBe('Temperature units');
    });

    it('handles Zod schema with nested objects', () => {
      const tool: ToolDefinition = {
        name: 'createUser',
        parameters: z.object({
          name: z.string(),
          address: z.object({
            street: z.string(),
            city: z.string(),
          }),
        }),
        execute: async () => ({ id: 1 }),
      };
      const handler = createToolHandler([tool]);

      const params = handler.schemas![0]?.function.parameters as any;
      const properties = params.properties as any;
      expect(properties.address.type).toBe('object');
      expect(properties.address.properties.street).toBeDefined();
      expect(properties.address.properties.city).toBeDefined();
    });

    it('handles Zod schema with arrays', () => {
      const tool: ToolDefinition = {
        name: 'processTags',
        parameters: z.object({
          tags: z.array(z.string()),
        }),
        execute: async () => [],
      };
      const handler = createToolHandler([tool]);

      const params = handler.schemas![0]?.function.parameters as any;
      const properties = params.properties as any;
      expect(properties.tags.type).toBe('array');
      expect(properties.tags.items.type).toBe('string');
    });

    it('works with client-side tools using Zod schema', () => {
      const tool: ToolDefinition = {
        name: 'selectOption',
        description: 'Let user select an option',
        parameters: z.object({
          options: z.array(z.string()),
          prompt: z.string(),
        }),
        // No execute - client-side
      };
      const handler = createToolHandler([tool]);

      expect(handler.isClientTool('selectOption')).toBe(true);
      expect(handler.schemas).toHaveLength(1);
      const params = handler.schemas![0]?.function.parameters as any;
      expect(params.type).toBe('object');
    });
  });
});
