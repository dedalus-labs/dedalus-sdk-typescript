import * as Schema from 'effect/Schema';
import * as SchemaDeprecated from '@effect/schema/Schema';
import { effectFunction, effectResponseFormat } from '../../src/helpers/effect';

describe('Effect Helpers', () => {
  describe('effectResponseFormat', () => {
    it('creates auto-parseable response format', () => {
      const schema = Schema.Struct({
        city: Schema.String,
        temperature: Schema.Number,
      });

      const format = effectResponseFormat(schema, 'weather');

      expect(format.type).toBe('json_schema');
      expect(format.json_schema.name).toBe('weather');
      expect(format.json_schema.schema).toHaveProperty('type', 'object');
      expect(format.json_schema.schema).toHaveProperty('properties');
      expect(format.json_schema.schema).toHaveProperty('additionalProperties', false);
      expect(format.json_schema.schema).toHaveProperty('required', ['city', 'temperature']);
    });

    it('adds brand markers for auto-parsing', () => {
      const schema = Schema.Struct({ value: Schema.String });
      const format = effectResponseFormat(schema, 'test');

      expect((format as any).$brand).toBe('auto-parseable-response-format');
      expect(typeof (format as any).$parseRaw).toBe('function');
    });

    it('brand markers are non-enumerable', () => {
      const schema = Schema.Struct({ value: Schema.String });
      const format = effectResponseFormat(schema, 'test');

      const keys = Object.keys(format);
      expect(keys).not.toContain('$brand');
      expect(keys).not.toContain('$parseRaw');
    });

    it('parses valid JSON with Effect validation', () => {
      const schema = Schema.Struct({
        name: Schema.String,
        age: Schema.Number,
      });

      const format = effectResponseFormat(schema, 'person');
      const content = JSON.stringify({ name: 'Alice', age: 30 });

      const parsed = (format as any).$parseRaw(content);

      expect(parsed).toEqual({ name: 'Alice', age: 30 });
    });

    it('throws on invalid Effect validation', () => {
      const schema = Schema.Struct({
        name: Schema.String,
        age: Schema.Number,
      });

      const format = effectResponseFormat(schema, 'person');
      const content = JSON.stringify({ name: 'Alice', age: 'invalid' });

      expect(() => (format as any).$parseRaw(content)).toThrow(/Failed to parse structured output/);
    });

    it('enforces strict mode - throws on optional without nullable', () => {
      const schema = Schema.Struct({
        required_field: Schema.String,
        optional_field: Schema.optional(Schema.String), // This should fail
      });

      expect(() => effectResponseFormat(schema, 'test')).toThrow(/uses optional without nullable/);
    });

    it('allows nullable optional fields', () => {
      const schema = Schema.Struct({
        required_field: Schema.String,
        optional_field: Schema.NullOr(Schema.String),
      });

      expect(() => effectResponseFormat(schema, 'test')).not.toThrow();
    });

    it('accepts schemas from @effect/schema (deprecated)', () => {
      const schema = SchemaDeprecated.Struct({
        name: SchemaDeprecated.String,
        age: SchemaDeprecated.Number,
      });

      const format = effectResponseFormat(schema as any, 'person');
      const parsed = (format as any).$parseRaw(JSON.stringify({ name: 'Alice', age: 30 }));

      expect(parsed).toEqual({ name: 'Alice', age: 30 });
    });
  });

  describe('effectFunction', () => {
    it('creates auto-parseable tool', () => {
      const func = effectFunction({
        name: 'get_weather',
        parameters: Schema.Struct({
          location: Schema.String,
          unit: Schema.Literal('celsius', 'fahrenheit'),
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
      const func = effectFunction({
        name: 'test',
        parameters: Schema.Struct({ input: Schema.String }),
      });

      expect((func as any).$brand).toBe('auto-parseable-tool');
      expect(typeof (func as any).$parseRaw).toBe('function');
      expect(typeof (func as any).$callback).toBe('undefined'); // No function provided
    });

    it('parses valid arguments', () => {
      const func = effectFunction({
        name: 'calculator',
        parameters: Schema.Struct({
          a: Schema.Number,
          b: Schema.Number,
          operation: Schema.Literal('add', 'subtract'),
        }),
      });

      const args = JSON.stringify({ a: 5, b: 3, operation: 'add' });
      const parsed = (func as any).$parseRaw(args);

      expect(parsed).toEqual({ a: 5, b: 3, operation: 'add' });
    });

    it('throws on invalid arguments', () => {
      const func = effectFunction({
        name: 'strict_func',
        parameters: Schema.Struct({
          value: Schema.Number,
        }),
      });

      const invalidArgs = JSON.stringify({ value: 'not a number' });

      expect(() => (func as any).$parseRaw(invalidArgs)).toThrow(/Failed to parse tool arguments/);
    });

    it('throws if parameters schema is not an object', () => {
      expect(() =>
        effectFunction({
          name: 'invalid',
          parameters: Schema.String as any,
        }),
      ).toThrow(/must be an object type/);
    });

    it('includes callback function', () => {
      const callback = jest.fn((args) => `Result: ${args.value}`);

      const func = effectFunction({
        name: 'test_callback',
        parameters: Schema.Struct({ value: Schema.String }),
        function: callback,
      });

      expect((func as any).$callback).toBe(callback);
    });

    it('accepts parameter schemas from @effect/schema (deprecated)', () => {
      const func = effectFunction({
        name: 'get_weather',
        parameters: SchemaDeprecated.Struct({
          location: SchemaDeprecated.String,
          unit: SchemaDeprecated.Literal('celsius', 'fahrenheit'),
        }) as any,
      });

      const parsed = (func as any).$parseRaw(JSON.stringify({ location: 'SF', unit: 'celsius' }));
      expect(parsed).toEqual({ location: 'SF', unit: 'celsius' });
    });
  });
});
