import { transformJSONSchema } from '../../../src/lib/schemas/transform';
import type { JSONSchema } from '../../../src/lib/schemas/jsonschema';

/** Array with at least two elements for test assertions */
type TwoElementArray<T> = [T, T, ...T[]];

describe('transformJSONSchema', () => {
  describe('Root Schema Validation', () => {
    it('throws error if root schema is not an object', () => {
      const schema: any = { type: 'string' };

      expect(() => transformJSONSchema(schema)).toThrow("Root schema must have type: 'object'");
    });

    it('throws error if root schema has no type', () => {
      const schema: any = { properties: {} };

      expect(() => transformJSONSchema(schema)).toThrow("Root schema must have type: 'object'");
    });

    it('allows anyOf at root with required fields', () => {
      const schema: JSONSchema = {
        anyOf: [{ type: 'object', properties: { a: { type: 'string' } }, required: ['a'] }],
      };

      expect(() => transformJSONSchema(schema)).not.toThrow();
    });
  });

  describe('Additional Properties', () => {
    it('adds additionalProperties: false to object schemas', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      };

      const strict = transformJSONSchema(schema);
      expect(strict.additionalProperties).toBe(false);
    });

    it('preserves existing additionalProperties value', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: true,
      };

      const strict = transformJSONSchema(schema);
      expect(strict.additionalProperties).toBe(true);
    });

    it('adds additionalProperties: false to nested objects', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
          },
        },
        required: ['user'],
      };

      const strict = transformJSONSchema(schema);
      const user = strict.properties!['user'] as JSONSchema;

      expect(strict.additionalProperties).toBe(false);
      expect(user.additionalProperties).toBe(false);
    });
  });

  describe('Required Properties - OpenAI Strict Mode', () => {
    it('makes all properties required when nullable', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
          age: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
      };

      const strict = transformJSONSchema(schema);

      expect(strict.required).toEqual(['name', 'age']);
      expect(strict.additionalProperties).toBe(false);
    });

    it('throws error for optional properties without nullable', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      };

      expect(() => transformJSONSchema(schema)).toThrow(/uses optional without nullable/);
    });

    it('throws error for nested optional without nullable', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              email: { type: 'string' },
            },
            required: ['name'], // email is not required, not nullable
          },
        },
        required: ['user'],
      };

      expect(() => transformJSONSchema(schema)).toThrow(/properties\/user\/properties\/email/);
    });
  });

  describe('$refs Resolution', () => {
    it('processes $defs but keeps $refs (only inlines with additional properties)', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          address: { $ref: '#/$defs/Address' },
        },
        required: ['address'],
        $defs: {
          Address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
            },
            required: ['street'],
          },
        },
      };

      const strict = transformJSONSchema(schema);

      // $defs should be processed
      const addressDef = strict.$defs!['Address'] as JSONSchema;
      expect(addressDef.additionalProperties).toBe(false);

      // $ref is kept as-is (not inlined unless it has additional properties)
      const address = strict.properties!['address'] as JSONSchema;
      expect(address.$ref).toBe('#/$defs/Address');
    });

    it('handles $ref with additional properties', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          user: {
            $ref: '#/$defs/User',
            description: 'The user object',
          },
        },
        required: ['user'],
        $defs: {
          User: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
            required: ['name'],
          },
        },
      };

      const strict = transformJSONSchema(schema);
      const user = strict.properties!['user'] as JSONSchema;

      expect(user.$ref).toBeUndefined();
      expect(user.type).toBe('object');
      expect(user.description).toBe('The user object');
      expect(user.properties!['name']).toEqual({ type: 'string' });
    });
  });

  describe('Union Types (anyOf/oneOf)', () => {
    it('converts oneOf to anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: {
            oneOf: [{ type: 'string' }, { type: 'number' }],
          },
        },
        required: ['value'],
      };

      const strict = transformJSONSchema(schema);
      const value = strict.properties!['value'] as JSONSchema;

      expect(value.oneOf).toBeUndefined();
      expect(value.anyOf).toHaveLength(2);
      expect(value.anyOf![0]).toEqual({ type: 'string' });
      expect(value.anyOf![1]).toEqual({ type: 'number' });
    });

    it('recursively processes anyOf variants', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          data: {
            anyOf: [
              { type: 'object', properties: { a: { type: 'string' } }, required: ['a'] },
              { type: 'object', properties: { b: { type: 'number' } }, required: ['b'] },
            ],
          },
        },
        required: ['data'],
      };

      const strict = transformJSONSchema(schema);
      const data = strict.properties!['data'] as JSONSchema;
      const variants = data.anyOf as TwoElementArray<JSONSchema>;

      expect(variants[0].additionalProperties).toBe(false);
      expect(variants[1].additionalProperties).toBe(false);
    });
  });

  describe('Intersection Types (allOf)', () => {
    it('flattens single allOf element', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: {
            allOf: [{ type: 'object', properties: { a: { type: 'string' } }, required: ['a'] }],
          },
        },
        required: ['value'],
      };

      const strict = transformJSONSchema(schema);
      const value = strict.properties!['value'] as JSONSchema;

      expect(value.allOf).toBeUndefined();
      expect(value.type).toBe('object');
      expect(value.properties!['a']).toEqual({ type: 'string' });
    });

    it('preserves multiple allOf elements', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: {
            allOf: [
              { type: 'object', properties: { a: { type: 'string' } }, required: ['a'] },
              { type: 'object', properties: { b: { type: 'number' } }, required: ['b'] },
            ],
          },
        },
        required: ['value'],
      };

      const strict = transformJSONSchema(schema);
      const value = strict.properties!['value'] as JSONSchema;

      expect(value.allOf).toHaveLength(2);
      expect((value.allOf![0] as JSONSchema).additionalProperties).toBe(false);
      expect((value.allOf![1] as JSONSchema).additionalProperties).toBe(false);
    });
  });

  describe('Array Types', () => {
    it('recursively processes array items', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
              },
              required: ['name'],
            },
          },
        },
        required: ['users'],
      };

      const strict = transformJSONSchema(schema);
      const users = strict.properties!['users'] as JSONSchema;
      const items = users.items as JSONSchema;

      expect(items.additionalProperties).toBe(false);
    });
  });

  describe('String Format Handling', () => {
    it('preserves supported string formats', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          date: { type: 'string', format: 'date-time' },
          uuid: { type: 'string', format: 'uuid' },
        },
        required: ['email', 'date', 'uuid'],
      };

      const strict = transformJSONSchema(schema);

      expect((strict.properties!['email'] as JSONSchema).format).toBe('email');
      expect((strict.properties!['date'] as JSONSchema).format).toBe('date-time');
      expect((strict.properties!['uuid'] as JSONSchema).format).toBe('uuid');
    });

    it('moves unsupported formats to description', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          customField: {
            type: 'string',
            format: 'custom-format',
            description: 'Original description',
          },
        },
        required: ['customField'],
      };

      const strict = transformJSONSchema(schema);
      const field = strict.properties!['customField'] as JSONSchema;

      expect(field.format).toBeUndefined();
      expect(field.description).toContain('Original description');
      expect(field.description).toContain('Format: custom-format');
    });
  });

  describe('Definitions ($defs)', () => {
    it('processes $defs recursively', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          data: { $ref: '#/$defs/Data' },
        },
        required: ['data'],
        $defs: {
          Data: {
            type: 'object',
            properties: {
              value: { type: 'string' },
            },
            required: ['value'],
          },
        },
      };

      const strict = transformJSONSchema(schema);
      const dataDef = strict.$defs!['Data'] as JSONSchema;

      expect(dataDef.additionalProperties).toBe(false);
    });

    it('handles both $defs and definitions (draft-04 compat)', () => {
      const schema: any = {
        type: 'object',
        properties: {
          a: { $ref: '#/$defs/A' },
          b: { $ref: '#/definitions/B' },
        },
        required: ['a', 'b'],
        $defs: {
          A: { type: 'object', properties: { x: { type: 'string' } }, required: ['x'] },
        },
        definitions: {
          B: { type: 'object', properties: { y: { type: 'number' } }, required: ['y'] },
        },
      };

      const strict = transformJSONSchema(schema);

      expect((strict.$defs!['A'] as JSONSchema).additionalProperties).toBe(false);
      expect((strict.definitions!['B'] as JSONSchema).additionalProperties).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('strips null defaults', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: { type: 'string', default: null },
        },
        required: ['value'],
      };

      const strict = transformJSONSchema(schema);
      const value = strict.properties!['value'] as JSONSchema;

      expect(value.default).toBeUndefined();
    });

    it('does not mutate original schema', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      };

      const original = JSON.parse(JSON.stringify(schema));
      transformJSONSchema(schema);

      expect(schema).toEqual(original);
    });

    it('handles deeply nested structures', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          level1: {
            type: 'object',
            properties: {
              level2: {
                type: 'object',
                properties: {
                  level3: {
                    type: 'object',
                    properties: {
                      value: { type: 'string' },
                    },
                    required: ['value'],
                  },
                },
                required: ['level3'],
              },
            },
            required: ['level2'],
          },
        },
        required: ['level1'],
      };

      const strict = transformJSONSchema(schema);

      // All levels should have additionalProperties: false
      expect(strict.additionalProperties).toBe(false);

      const level1 = strict.properties!['level1'] as JSONSchema;
      expect(level1.additionalProperties).toBe(false);

      const level2 = level1.properties!['level2'] as JSONSchema;
      expect(level2.additionalProperties).toBe(false);

      const level3 = level2.properties!['level3'] as JSONSchema;
      expect(level3.additionalProperties).toBe(false);
    });
  });

  describe('Nullable Detection', () => {
    it('detects null in anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: {
            anyOf: [{ type: 'string' }, { type: 'null' }],
          },
        },
      };

      const strict = transformJSONSchema(schema);
      expect(strict.required).toEqual(['value']);
    });

    it('detects null type directly', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: { type: 'null' },
        },
      };

      const strict = transformJSONSchema(schema);
      expect(strict.required).toEqual(['value']);
    });

    it('detects null in array of types', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: { type: ['string', 'null'] },
        },
      };

      const strict = transformJSONSchema(schema);
      expect(strict.required).toEqual(['value']);
    });
  });
});
