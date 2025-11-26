import { z } from 'zod';
import {
  maybeParseChatCompletion,
  parseChatCompletion,
  LengthFinishReasonError,
  ContentFilterFinishReasonError,
} from '../../src/lib/parser';
import { zodResponseFormat, zodFunction } from '../../src/helpers/zod';
import {
  createMockCompletionWithContent,
  createMockCompletionWithRefusal,
  createMockCompletionWithTools,
  type MockParsedCompletion,
} from '../utils/mock-completions';
import type { CompletionCreateParams } from '../../src/resources/chat/completions';

describe('Parser - Mock-Based Integration Tests', () => {
  describe('Response Format Parsing', () => {
    it('parses valid JSON with Zod schema', () => {
      interface Weather {
        city: string;
        temperature: number;
      }

      const schema = z.object({
        city: z.string(),
        temperature: z.number(),
      });

      const format = zodResponseFormat(schema, 'weather');
      const completion = createMockCompletionWithContent(
        JSON.stringify({ city: 'San Francisco', temperature: 72 }),
      );

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<Weather>;

      expect(parsed.choices[0].message.parsed).toEqual({
        city: 'San Francisco',
        temperature: 72,
      });
    });

    it('throws on invalid JSON schema', () => {
      const schema = z.object({
        value: z.number(),
      });

      const format = zodResponseFormat(schema, 'test');
      const completion = createMockCompletionWithContent(JSON.stringify({ value: 'not a number' }));

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(/Failed to parse structured output/);
    });

    it('returns null parsed on refusal', () => {
      const schema = z.object({ answer: z.string() });
      const format = zodResponseFormat(schema, 'test');
      const completion = createMockCompletionWithRefusal('I cannot help with that');

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<{ answer: string }>;

      expect(parsed.choices[0].message.parsed).toBeNull();
      expect(parsed.choices[0].message.refusal).toBe('I cannot help with that');
    });

    it('throws LengthFinishReasonError', () => {
      const schema = z.object({ data: z.string() });
      const format = zodResponseFormat(schema, 'test');
      const completion = createMockCompletionWithContent('{"data": "truncated', 'length');

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(LengthFinishReasonError);
    });

    it('throws ContentFilterFinishReasonError', () => {
      const schema = z.object({ data: z.string() });
      const format = zodResponseFormat(schema, 'test');
      const completion = createMockCompletionWithContent('', 'content_filter');

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(ContentFilterFinishReasonError);
    });
  });

  describe('Tool Call Parsing', () => {
    it('parses tool calls with Zod schema', () => {
      const tool = zodFunction({
        name: 'calculator',
        parameters: z.object({
          a: z.number(),
          b: z.number(),
          operation: z.enum(['add', 'subtract']),
        }),
      });

      const completion = createMockCompletionWithTools([
        {
          id: 'call_123',
          name: 'calculator',
          arguments: JSON.stringify({ a: 5, b: 3, operation: 'add' }),
        },
      ]);

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        tools: [tool],
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<null>;
      const toolCall = parsed.choices[0].message.tool_calls?.[0];

      expect(toolCall?.function.parsed_arguments).toEqual({
        a: 5,
        b: 3,
        operation: 'add',
      });
    });

    it('throws on invalid tool arguments', () => {
      const tool = zodFunction({
        name: 'strict_tool',
        parameters: z.object({
          value: z.number(),
        }),
      });

      const completion = createMockCompletionWithTools([
        {
          id: 'call_123',
          name: 'strict_tool',
          arguments: JSON.stringify({ value: 'not a number' }),
        },
      ]);

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        tools: [tool],
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(/Failed to parse tool arguments/);
    });

    it('handles multiple tool calls', () => {
      const getTool = zodFunction({
        name: 'get_weather',
        parameters: z.object({ location: z.string() }),
      });

      const calcTool = zodFunction({
        name: 'calculate',
        parameters: z.object({ expr: z.string() }),
      });

      const completion = createMockCompletionWithTools([
        {
          id: 'call_1',
          name: 'get_weather',
          arguments: JSON.stringify({ location: 'NYC' }),
        },
        {
          id: 'call_2',
          name: 'calculate',
          arguments: JSON.stringify({ expr: '2+2' }),
        },
      ]);

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        tools: [getTool, calcTool],
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<null>;

      expect(parsed.choices[0].message.tool_calls).toHaveLength(2);
      expect(parsed.choices[0].message.tool_calls?.[0]?.function.parsed_arguments).toEqual({
        location: 'NYC',
      });
      expect(parsed.choices[0].message.tool_calls?.[1]?.function.parsed_arguments).toEqual({
        expr: '2+2',
      });
    });
  });

  describe('maybeParseChatCompletion', () => {
    it('returns null parsed when no auto-parseable format', () => {
      const completion = createMockCompletionWithContent('{"data": "test"}');

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
      };

      const result = maybeParseChatCompletion(completion, params) as MockParsedCompletion<null>;

      expect(result.choices[0].message.parsed).toBeNull();
    });

    it('auto-parses when format is detected', () => {
      interface DataResult {
        data: string;
      }

      const schema = z.object({ data: z.string() });
      const format = zodResponseFormat(schema, 'test');
      const completion = createMockCompletionWithContent('{"data": "hello"}');

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      const result = maybeParseChatCompletion(completion, params) as MockParsedCompletion<DataResult>;

      expect(result.choices[0].message.parsed).toEqual({ data: 'hello' });
    });
  });

  describe('Complex Schemas', () => {
    it('handles deeply nested objects', () => {
      interface NestedUser {
        user: {
          profile: {
            personal: {
              name: string;
              age: number;
            };
          };
        };
      }

      const schema = z.object({
        user: z.object({
          profile: z.object({
            personal: z.object({
              name: z.string(),
              age: z.number(),
            }),
          }),
        }),
      });

      const format = zodResponseFormat(schema, 'nested');
      const completion = createMockCompletionWithContent(
        JSON.stringify({
          user: {
            profile: {
              personal: {
                name: 'Alice',
                age: 30,
              },
            },
          },
        }),
      );

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<NestedUser>;

      expect(parsed.choices[0].message.parsed?.user.profile.personal.name).toBe('Alice');
    });

    it('handles arrays of complex objects', () => {
      interface ItemsResult {
        items: Array<{
          id: string;
          metadata: {
            tags: string[];
          };
        }>;
      }

      const schema = z.object({
        items: z.array(
          z.object({
            id: z.string(),
            metadata: z.object({
              tags: z.array(z.string()),
            }),
          }),
        ),
      });

      const format = zodResponseFormat(schema, 'items');
      const completion = createMockCompletionWithContent(
        JSON.stringify({
          items: [
            { id: '1', metadata: { tags: ['a', 'b'] } },
            { id: '2', metadata: { tags: ['c'] } },
          ],
        }),
      );

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: format,
      };

      const parsed = parseChatCompletion(completion, params) as MockParsedCompletion<ItemsResult>;

      expect(parsed.choices[0].message.parsed?.items).toHaveLength(2);
      expect(parsed.choices[0].message.parsed?.items[0]?.metadata.tags).toEqual(['a', 'b']);
    });
  });
});
