import { z } from 'zod';
import { zodResponseFormat, zodFunction } from '../../src/helpers/zod';

describe('Zod Helpers', () => {
  describe('zodResponseFormat', () => {
    it('creates auto-parseable response format', () => {
      const schema = z.object({
        city: z.string(),
        temperature: z.number(),
      });

      const format = zodResponseFormat(schema, 'weather');

      expect(format.type).toBe('json_schema');
      expect(format.json_schema.name).toBe('weather');
      expect(format.json_schema.schema).toHaveProperty('type', 'object');
      expect(format.json_schema.schema).toHaveProperty('properties');
      expect(format.json_schema.schema).toHaveProperty('additionalProperties', false);
      expect(format.json_schema.schema).toHaveProperty('required', ['city', 'temperature']);
    });

    it('adds brand markers for auto-parsing', () => {
      const schema = z.object({ value: z.string() });
      const format = zodResponseFormat(schema, 'test');

      expect((format as any).$brand).toBe('auto-parseable-response-format');
      expect(typeof (format as any).$parseRaw).toBe('function');
    });

    it('brand markers are non-enumerable', () => {
      const schema = z.object({ value: z.string() });
      const format = zodResponseFormat(schema, 'test');

      const keys = Object.keys(format);
      expect(keys).not.toContain('$brand');
      expect(keys).not.toContain('$parseRaw');
    });

    it('parses valid JSON with Zod validation', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const format = zodResponseFormat(schema, 'person');
      const content = JSON.stringify({ name: 'Alice', age: 30 });

      const parsed = (format as any).$parseRaw(content);

      expect(parsed).toEqual({ name: 'Alice', age: 30 });
    });

    it('throws on invalid Zod validation', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const format = zodResponseFormat(schema, 'person');
      const content = JSON.stringify({ name: 'Alice', age: 'invalid' });

      expect(() => (format as any).$parseRaw(content)).toThrow(/Failed to parse structured output/);
    });

    it('enforces strict mode - throws on optional without nullable', () => {
      const schema = z.object({
        required_field: z.string(),
        optional_field: z.string().optional(), // This should fail
      });

      expect(() => zodResponseFormat(schema, 'test')).toThrow(/uses optional without nullable/);
    });

    it('allows nullable optional fields', () => {
      const schema = z.object({
        required_field: z.string(),
        optional_field: z.string().nullable(),
      });

      expect(() => zodResponseFormat(schema, 'test')).not.toThrow();
    });

    it('handles nested objects', () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string(),
        }),
      });

      const format = zodResponseFormat(schema, 'user_data');
      const jsonSchema = format.json_schema.schema as any;

      expect(jsonSchema.properties.user.additionalProperties).toBe(false);
      expect(jsonSchema.additionalProperties).toBe(false);
    });

    it('handles arrays of objects', () => {
      const schema = z.object({
        items: z.array(
          z.object({
            id: z.string(),
            value: z.number(),
          }),
        ),
      });

      const format = zodResponseFormat(schema, 'items_list');
      const jsonSchema = format.json_schema.schema as any;

      expect(jsonSchema.properties.items.type).toBe('array');
      expect(jsonSchema.properties.items.items.type).toBe('object');
      expect(jsonSchema.properties.items.items.additionalProperties).toBe(false);
    });

    it('handles enums', () => {
      const schema = z.object({
        status: z.enum(['active', 'inactive', 'pending']),
      });

      const format = zodResponseFormat(schema, 'status_obj');
      const jsonSchema = format.json_schema.schema as any;

      expect(jsonSchema.properties.status.enum).toEqual(['active', 'inactive', 'pending']);
    });

    it('handles unions (anyOf)', () => {
      const schema = z.object({
        value: z.union([z.string(), z.number()]),
      });

      const format = zodResponseFormat(schema, 'union_test');
      const jsonSchema = format.json_schema.schema as any;

      expect(jsonSchema.properties.value.anyOf).toBeDefined();
      expect(jsonSchema.properties.value.anyOf).toHaveLength(2);
    });

    it('handles recursive schemas with z.lazy()', () => {
      const Node: any = z.lazy(() =>
        z.object({
          value: z.string(),
          children: z.array(Node).nullable(),
        }),
      );

      const schema = z.object({
        root: Node,
      });

      const format = zodResponseFormat(schema, 'tree');
      const jsonSchema = format.json_schema.schema as any;

      // Zod v4 uses 'definitions' for recursive schemas
      expect(jsonSchema.definitions || jsonSchema.$defs).toBeDefined();
      expect(jsonSchema.properties).toBeDefined();
      expect(jsonSchema.additionalProperties).toBe(false);
    });
  });

  describe('zodFunction', () => {
    it('creates auto-parseable tool', () => {
      const func = zodFunction({
        name: 'get_weather',
        parameters: z.object({
          location: z.string(),
          unit: z.enum(['celsius', 'fahrenheit']),
        }),
        description: 'Get weather for a location',
      });

      expect(func.type).toBe('function');
      expect(func.function.name).toBe('get_weather');
      expect(func.function.description).toBe('Get weather for a location');
      expect(func.function.parameters).toHaveProperty('type', 'object');
      expect(func.function.parameters).toHaveProperty('additionalProperties', false);
      expect(func.function.parameters).toHaveProperty('required', ['location', 'unit']);
    });

    it('adds brand markers', () => {
      const func = zodFunction({
        name: 'test',
        parameters: z.object({ input: z.string() }),
      });

      expect((func as any).$brand).toBe('auto-parseable-tool');
      expect(typeof (func as any).$parseRaw).toBe('function');
      expect(typeof (func as any).$callback).toBe('undefined'); // No function provided
    });

    it('parses valid arguments', () => {
      const func = zodFunction({
        name: 'calculator',
        parameters: z.object({
          a: z.number(),
          b: z.number(),
          operation: z.enum(['add', 'subtract']),
        }),
      });

      const args = JSON.stringify({ a: 5, b: 3, operation: 'add' });
      const parsed = (func as any).$parseRaw(args);

      expect(parsed).toEqual({ a: 5, b: 3, operation: 'add' });
    });

    it('throws on invalid arguments', () => {
      const func = zodFunction({
        name: 'strict_func',
        parameters: z.object({
          value: z.number(),
        }),
      });

      const invalidArgs = JSON.stringify({ value: 'not a number' });

      expect(() => (func as any).$parseRaw(invalidArgs)).toThrow(/Failed to parse tool arguments/);
    });

    it('throws if parameters schema is not an object', () => {
      expect(() =>
        zodFunction({
          name: 'invalid',
          parameters: z.string() as any,
        }),
      ).toThrow(/must be an object type/);
    });

    it('includes callback function', () => {
      const callback = jest.fn((args) => `Result: ${args.value}`);

      const func = zodFunction({
        name: 'test_callback',
        parameters: z.object({ value: z.string() }),
        function: callback,
      });

      expect((func as any).$callback).toBe(callback);
    });
  });

  describe('Error Handling', () => {
    it('provides helpful error for missing Zod', () => {
      // This test would need to mock require.resolve to simulate missing Zod
      // Skipping for now as it requires complex mocking
    });

    it('validates Zod schema object', () => {
      expect(() => zodResponseFormat({} as any, 'test')).toThrow(/must be a Zod schema/);

      expect(() => zodFunction({ name: 'test', parameters: {} as any })).toThrow(/must be a Zod schema/);
    });
  });
});
