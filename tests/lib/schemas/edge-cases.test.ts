import { transformJSONSchema } from '../../../src/lib/schemas/transform';
import { JSONSchema } from '../../../src/lib/schemas/jsonschema';

describe('transformJSONSchema - Edge Cases', () => {
  describe('Circular References', () => {
    it('preserves $refs without additional properties (no inlining)', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          parent: { $ref: '#' }, // Self-reference without additional props
        },
        required: ['name', 'parent'],
      };

      const strict = transformJSONSchema(schema);
      // $ref is preserved as-is when no additional properties
      expect((strict.properties!['parent'] as any).$ref).toBe('#');
    });

    it('processes $defs with mutual recursion', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          nodeA: { $ref: '#/$defs/NodeA' },
        },
        required: ['nodeA'],
        $defs: {
          NodeA: {
            type: 'object',
            properties: {
              value: { type: 'string' },
              nodeB: { $ref: '#/$defs/NodeB' }, // nullable not needed if $ref
            },
            required: ['value', 'nodeB'],
          },
          NodeB: {
            type: 'object',
            properties: {
              data: { type: 'number' },
              nodeA: { $ref: '#/$defs/NodeA' }, // nullable not needed if $ref
            },
            required: ['data', 'nodeA'],
          },
        },
      };

      const strict = transformJSONSchema(schema);

      // $defs should be processed and have additionalProperties: false
      const nodeA = strict.$defs!['NodeA'] as JSONSchema;
      const nodeB = strict.$defs!['NodeB'] as JSONSchema;

      expect(nodeA.additionalProperties).toBe(false);
      expect(nodeB.additionalProperties).toBe(false);
    });
  });

  describe('Complex Nested Structures', () => {
    it('handles arrays of unions of objects', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['a'] },
                    valueA: { type: 'string' },
                  },
                  required: ['type', 'valueA'],
                },
                {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['b'] },
                    valueB: { type: 'number' },
                  },
                  required: ['type', 'valueB'],
                },
              ],
            },
          },
        },
        required: ['items'],
      };

      const strict = transformJSONSchema(schema);
      const items = strict.properties!['items'] as JSONSchema;
      const itemSchema = items.items as JSONSchema;
      const variants = itemSchema.anyOf as JSONSchema[];

      expect(variants[0].additionalProperties).toBe(false);
      expect(variants[1].additionalProperties).toBe(false);
    });

    it('handles union of arrays and objects', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          data: {
            anyOf: [
              { type: 'array', items: { type: 'string' } },
              {
                type: 'object',
                properties: { value: { type: 'string' } },
                required: ['value'],
              },
            ],
          },
        },
        required: ['data'],
      };

      const strict = transformJSONSchema(schema);
      const data = strict.properties!['data'] as JSONSchema;
      const variants = data.anyOf as JSONSchema[];

      expect(variants[1].additionalProperties).toBe(false);
    });
  });

  describe('$ref Edge Cases', () => {
    it('throws on invalid $ref format', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          ref: {
            $ref: 'http://example.com/schema.json',
            description: 'External ref',
          },
        },
        required: ['ref'],
      };

      expect(() => transformJSONSchema(schema)).toThrow(/Unsupported \$ref format/);
    });

    it('throws on missing $ref target when inlining', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          ref: {
            $ref: '#/$defs/Missing',
            description: 'This extra property triggers inlining',
          },
        },
        required: ['ref'],
      };

      expect(() => transformJSONSchema(schema)).toThrow(/not found/);
    });

    it('handles deeply nested $ref paths', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          data: { $ref: '#/$defs/level1/level2/level3' },
        },
        required: ['data'],
        $defs: {
          level1: {
            level2: {
              level3: {
                type: 'object',
                properties: { value: { type: 'string' } },
                required: ['value'],
              },
            },
          },
        },
      };

      expect(() => transformJSONSchema(schema)).not.toThrow();
    });
  });

  describe('AllOf Flattening', () => {
    it('flattens single allOf with merge', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          data: {
            allOf: [
              {
                type: 'object',
                properties: {
                  a: { type: 'string' },
                  b: { type: 'number' },
                },
                required: ['a', 'b'],
              },
            ],
            description: 'Data object',
          },
        },
        required: ['data'],
      };

      const strict = transformJSONSchema(schema);
      const data = strict.properties!['data'] as JSONSchema;

      expect(data.allOf).toBeUndefined();
      expect(data.type).toBe('object');
      expect(data.description).toBe('Data object');
      expect(data.properties!['a']).toEqual({ type: 'string' });
    });

    it('preserves allOf with multiple elements', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          merged: {
            allOf: [
              { type: 'object', properties: { a: { type: 'string' } }, required: ['a'] },
              { type: 'object', properties: { b: { type: 'number' } }, required: ['b'] },
            ],
          },
        },
        required: ['merged'],
      };

      const strict = transformJSONSchema(schema);
      const merged = strict.properties!['merged'] as JSONSchema;

      expect(merged.allOf).toHaveLength(2);
    });
  });

  describe('Nullable Variants', () => {
    it('detects nullable in oneOf before conversion to anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: {
            oneOf: [{ type: 'string' }, { type: 'null' }],
          },
        },
      };

      const strict = transformJSONSchema(schema);
      expect(strict.required).toEqual(['value']);
    });

    it('detects nullable in deeply nested anyOf', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          complex: {
            anyOf: [
              {
                type: 'object',
                properties: {
                  inner: {
                    anyOf: [{ type: 'string' }, { type: 'null' }],
                  },
                },
                required: ['inner'],
              },
              { type: 'null' },
            ],
          },
        },
      };

      const strict = transformJSONSchema(schema);
      expect(strict.required).toEqual(['complex']);
    });
  });

  describe('Format Handling', () => {
    it('preserves all supported formats', () => {
      const supportedFormats = [
        'date-time',
        'time',
        'date',
        'email',
        'hostname',
        'ipv4',
        'ipv6',
        'uri',
        'uuid',
      ];

      const properties: Record<string, JSONSchema> = {};
      supportedFormats.forEach((format) => {
        properties[format] = { type: 'string', format };
      });

      const schema: JSONSchema = {
        type: 'object',
        properties,
        required: Object.keys(properties),
      };

      const strict = transformJSONSchema(schema);

      supportedFormats.forEach((format) => {
        const prop = strict.properties![format] as JSONSchema;
        expect(prop.format).toBe(format);
      });
    });

    it('strips multiple unsupported formats', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          field1: { type: 'string', format: 'custom1' },
          field2: { type: 'string', format: 'custom2' },
          field3: { type: 'string', format: 'email' }, // supported
        },
        required: ['field1', 'field2', 'field3'],
      };

      const strict = transformJSONSchema(schema);

      expect((strict.properties!['field1'] as JSONSchema).format).toBeUndefined();
      expect((strict.properties!['field1'] as JSONSchema).description).toContain('Format: custom1');

      expect((strict.properties!['field2'] as JSONSchema).format).toBeUndefined();
      expect((strict.properties!['field2'] as JSONSchema).description).toContain('Format: custom2');

      expect((strict.properties!['field3'] as JSONSchema).format).toBe('email');
    });
  });

  describe('Default Value Handling', () => {
    it('strips null defaults from all levels', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          field1: { type: 'string', default: null },
          nested: {
            type: 'object',
            properties: {
              field2: { type: 'number', default: null },
            },
            required: ['field2'],
            default: null,
          },
        },
        required: ['field1', 'nested'],
      };

      const strict = transformJSONSchema(schema);

      expect((strict.properties!['field1'] as JSONSchema).default).toBeUndefined();

      const nested = strict.properties!['nested'] as JSONSchema;
      expect(nested.default).toBeUndefined();
      expect((nested.properties!['field2'] as JSONSchema).default).toBeUndefined();
    });

    it('preserves non-null defaults', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          count: { type: 'number', default: 0 },
          name: { type: 'string', default: 'unknown' },
        },
        required: ['count', 'name'],
      };

      const strict = transformJSONSchema(schema);

      expect((strict.properties!['count'] as JSONSchema).default).toBe(0);
      expect((strict.properties!['name'] as JSONSchema).default).toBe('unknown');
    });
  });

  describe('Boolean Schema Rejection', () => {
    it('throws on boolean schema at any level', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {
          value: true as any,
        },
        required: ['value'],
      };

      expect(() => transformJSONSchema(schema)).toThrow(/Boolean schemas are not supported/);
    });
  });

  describe('Empty and Minimal Schemas', () => {
    it('handles object with no properties', () => {
      const schema: JSONSchema = {
        type: 'object',
      };

      const strict = transformJSONSchema(schema);

      expect(strict.additionalProperties).toBe(false);
      // No properties means no required array is set
      expect(strict.required).toBeUndefined();
    });

    it('handles object with empty properties', () => {
      const schema: JSONSchema = {
        type: 'object',
        properties: {},
      };

      const strict = transformJSONSchema(schema);

      expect(strict.additionalProperties).toBe(false);
      // Empty properties array creates empty required array
      expect(strict.required).toEqual([]);
    });
  });
});
