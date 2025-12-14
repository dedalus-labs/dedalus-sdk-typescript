import { z } from 'zod';
import * as Schema from 'effect/Schema';
import { createToolHandler } from '../../../src/lib/runner/tools';
import { zodFunction } from '../../../src/helpers/zod';
import { effectFunction } from '../../../src/helpers/effect';
import type { JsonValue } from '../../../src/lib/runner/types/tools';

describe('createToolHandler', () => {
  describe('with plain functions', () => {
    it('creates schemas from plain functions', () => {
      function greet(name: string): string {
        return `Hello, ${name}!`;
      }

      const handler = createToolHandler([greet]);
      const schemas = handler.schemas();

      expect(schemas).toHaveLength(1);
      expect(schemas[0]!.function.name).toBe('greet');
      expect(schemas[0]!.type).toBe('function');
    });

    it('executes plain functions with args object', async () => {
      function add(args: { a: number; b: number }): number {
        return args.a + args.b;
      }

      const handler = createToolHandler([add]);
      const result = await handler.exec('add', { a: 5, b: 3 });

      expect(result).toBe(8);
    });

    it('lists tool names', () => {
      function foo(): string {
        return 'foo';
      }
      function bar(): string {
        return 'bar';
      }

      const handler = createToolHandler([foo, bar]);
      expect(handler.listNames()).toEqual(['foo', 'bar']);
    });
  });

  describe('with AutoParseableTool (zodFunction)', () => {
    it('creates schemas from zodFunction tools', () => {
      const getWeather = zodFunction({
        name: 'get_weather',
        parameters: z.object({
          location: z.string(),
          unit: z.enum(['celsius', 'fahrenheit']),
        }),
        description: 'Get weather for a location',
      });

      const handler = createToolHandler([getWeather]);
      const schemas = handler.schemas();

      expect(schemas).toHaveLength(1);
      expect(schemas[0]!.function.name).toBe('get_weather');
      expect(schemas[0]!.function.description).toBe('Get weather for a location');
      expect(schemas[0]!.function.parameters).toHaveProperty('type', 'object');
      expect(schemas[0]!.function.parameters).toHaveProperty('properties');
      expect((schemas[0]!.function.parameters as any).properties.location).toBeDefined();
      expect((schemas[0]!.function.parameters as any).properties.unit).toBeDefined();
    });

    it('executes zodFunction tools with $callback', async () => {
      const calculator = zodFunction({
        name: 'calculator',
        parameters: z.object({
          a: z.number(),
          b: z.number(),
          operation: z.enum(['add', 'subtract', 'multiply']),
        }),
        function: (args) => {
          switch (args.operation) {
            case 'add':
              return args.a + args.b;
            case 'subtract':
              return args.a - args.b;
            case 'multiply':
              return args.a * args.b;
          }
        },
      });

      const handler = createToolHandler([calculator]);
      const result = await handler.exec('calculator', { a: 10, b: 5, operation: 'multiply' });

      expect(result).toBe(50);
    });

    it('validates arguments using Zod schema', async () => {
      const strictTool = zodFunction({
        name: 'strict_tool',
        parameters: z.object({
          value: z.number(),
        }),
        function: (args) => args.value * 2,
      });

      const handler = createToolHandler([strictTool]);

      // Invalid args should throw via Zod validation
      await expect(handler.exec('strict_tool', { value: 'not a number' })).rejects.toThrow();
    });

    it('handles async $callback functions', async () => {
      const asyncTool = zodFunction({
        name: 'async_tool',
        parameters: z.object({
          delay: z.number(),
        }),
        function: async (args) => {
          await new Promise((resolve) => setTimeout(resolve, args.delay));
          return `Waited ${args.delay}ms`;
        },
      });

      const handler = createToolHandler([asyncTool]);
      const result = await handler.exec('async_tool', { delay: 10 });

      expect(result).toBe('Waited 10ms');
    });

    it('throws if zodFunction has no $callback and exec is called', async () => {
      const noCallbackTool = zodFunction({
        name: 'no_callback',
        parameters: z.object({ input: z.string() }),
        // No function provided
      });

      const handler = createToolHandler([noCallbackTool]);

      await expect(handler.exec('no_callback', { input: 'test' })).rejects.toThrow(
        /no implementation/i,
      );
    });
  });

  describe('mixed tools', () => {
    it('handles mix of plain functions and zodFunction tools', () => {
      function plainGreet(name: string): string {
        return `Hello, ${name}!`;
      }

      const typedCalculator = zodFunction({
        name: 'calculator',
        parameters: z.object({
          a: z.number(),
          b: z.number(),
        }),
        function: (args) => args.a + args.b,
      });

      const handler = createToolHandler([plainGreet, typedCalculator]);
      const schemas = handler.schemas();
      const names = handler.listNames();

      expect(names).toEqual(['plainGreet', 'calculator']);
      expect(schemas).toHaveLength(2);

      // Plain function schema (regex-extracted)
      const plainSchema = schemas.find((s) => s.function.name === 'plainGreet');
      expect(plainSchema).toBeDefined();

      // zodFunction schema (Zod-derived)
      const typedSchema = schemas.find((s) => s.function.name === 'calculator');
      expect(typedSchema).toBeDefined();
      expect(typedSchema!.function.parameters).toHaveProperty('additionalProperties', false);
    });

    it('executes both tool types correctly', async () => {
      function multiply(args: { x: number; y: number }): number {
        return args.x * args.y;
      }

      const divide = zodFunction({
        name: 'divide',
        parameters: z.object({
          numerator: z.number(),
          denominator: z.number(),
        }),
        function: (args) => args.numerator / args.denominator,
      });

      const handler = createToolHandler([multiply, divide]);

      const multiplyResult = await handler.exec('multiply', { x: 6, y: 7 });
      expect(multiplyResult).toBe(42);

      const divideResult = await handler.exec('divide', { numerator: 100, denominator: 5 });
      expect(divideResult).toBe(20);
    });
  });

  describe('with AutoParseableTool (effectFunction)', () => {
    it('creates schemas from effectFunction tools', () => {
      const getWeather = effectFunction({
        name: 'get_weather',
        parameters: Schema.Struct({
          location: Schema.String,
          unit: Schema.Literal('celsius', 'fahrenheit'),
        }),
        description: 'Get weather for a location',
      });

      const handler = createToolHandler([getWeather]);
      const schemas = handler.schemas();

      expect(schemas).toHaveLength(1);
      expect(schemas[0]!.function.name).toBe('get_weather');
      expect(schemas[0]!.function.description).toBe('Get weather for a location');
      expect(schemas[0]!.function.parameters).toHaveProperty('type', 'object');
      expect(schemas[0]!.function.parameters).toHaveProperty('properties');
    });

    it('executes effectFunction tools with $callback', async () => {
      const calculator = effectFunction({
        name: 'calculator',
        parameters: Schema.Struct({
          a: Schema.Number,
          b: Schema.Number,
          operation: Schema.Literal('add', 'subtract', 'multiply'),
        }),
        function: (args) => {
          switch (args.operation) {
            case 'add':
              return args.a + args.b;
            case 'subtract':
              return args.a - args.b;
            case 'multiply':
              return args.a * args.b;
          }
        },
      });

      const handler = createToolHandler([calculator]);
      const result = await handler.exec('calculator', { a: 10, b: 5, operation: 'multiply' });

      expect(result).toBe(50);
    });

    it('validates arguments using Effect schema', async () => {
      const strictTool = effectFunction({
        name: 'strict_tool',
        parameters: Schema.Struct({
          value: Schema.Number,
        }),
        function: (args) => args.value * 2,
      });

      const handler = createToolHandler([strictTool]);

      // Invalid args should throw via Effect validation
      await expect(handler.exec('strict_tool', { value: 'not a number' })).rejects.toThrow();
    });
  });

  describe('mixed Zod and Effect tools', () => {
    it('handles mix of zodFunction and effectFunction tools', async () => {
      const zodTool = zodFunction({
        name: 'zod_tool',
        parameters: z.object({
          input: z.string(),
        }),
        function: (args) => `Zod: ${args.input}`,
      });

      const effectTool = effectFunction({
        name: 'effect_tool',
        parameters: Schema.Struct({
          input: Schema.String,
        }),
        function: (args) => `Effect: ${args.input}`,
      });

      const handler = createToolHandler([zodTool, effectTool]);
      const schemas = handler.schemas();
      const names = handler.listNames();

      expect(names).toEqual(['zod_tool', 'effect_tool']);
      expect(schemas).toHaveLength(2);

      const zodResult = await handler.exec('zod_tool', { input: 'hello' });
      expect(zodResult).toBe('Zod: hello');

      const effectResult = await handler.exec('effect_tool', { input: 'world' });
      expect(effectResult).toBe('Effect: world');
    });
  });

  describe('error handling', () => {
    it('throws for unknown tool name', async () => {
      const handler = createToolHandler([]);
      await expect(handler.exec('nonexistent', {})).rejects.toThrow(/Unknown tool/);
    });

    it('propagates errors from tool execution', async () => {
      const errorTool = zodFunction({
        name: 'error_tool',
        parameters: z.object({}),
        function: () => {
          throw new Error('Intentional error');
        },
      });

      const handler = createToolHandler([errorTool]);
      await expect(handler.exec('error_tool', {})).rejects.toThrow('Intentional error');
    });
  });
});
