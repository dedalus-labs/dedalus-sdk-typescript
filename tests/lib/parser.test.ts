import {
  makeParseableResponseFormat,
  makeParseableTool,
  isAutoParsableResponseFormat,
  isAutoParsableTool,
  maybeParseChatCompletion,
  parseChatCompletion,
  hasAutoParseableInput,
  validateInputTools,
  LengthFinishReasonError,
  ContentFilterFinishReasonError,
} from '../../src/lib/parser';
import type { Completion, CompletionCreateParams } from '../../src/resources/chat/completions';
import type { ResponseFormatJSONSchema } from '../../src/resources/shared';

describe('Parser - Brand Markers', () => {
  describe('makeParseableResponseFormat', () => {
    it('creates object with brand markers', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: {
          name: 'test',
          schema: { type: 'object', properties: {} },
        },
      };

      const parser = (content: string) => JSON.parse(content);
      const parseable = makeParseableResponseFormat(format, parser);

      expect((parseable as any).$brand).toBe('auto-parseable-response-format');
      expect(typeof (parseable as any).$parseRaw).toBe('function');
    });

    it('brand markers are non-enumerable', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const parseable = makeParseableResponseFormat(format, JSON.parse);
      const keys = Object.keys(parseable);

      expect(keys).not.toContain('$brand');
      expect(keys).not.toContain('$parseRaw');
      expect(keys).toContain('type');
      expect(keys).toContain('json_schema');
    });

    it('parser function works correctly', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const customParser = (content: string) => ({ parsed: true, content });
      const parseable = makeParseableResponseFormat(format, customParser);

      const result = (parseable as any).$parseRaw('test content');
      expect(result).toEqual({ parsed: true, content: 'test content' });
    });
  });

  describe('isAutoParsableResponseFormat', () => {
    it('detects auto-parseable format', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const parseable = makeParseableResponseFormat(format, JSON.parse);

      expect(isAutoParsableResponseFormat(parseable)).toBe(true);
    });

    it('rejects non-parseable format', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      expect(isAutoParsableResponseFormat(format)).toBe(false);
    });

    it('rejects null and undefined', () => {
      expect(isAutoParsableResponseFormat(null)).toBe(false);
      expect(isAutoParsableResponseFormat(undefined)).toBe(false);
    });

    it('rejects objects without brand', () => {
      const fake = { $parseRaw: () => {}, type: 'json_schema' };
      expect(isAutoParsableResponseFormat(fake)).toBe(false);
    });
  });

  describe('makeParseableTool', () => {
    it('creates tool with brand markers', () => {
      const tool: any = {
        type: 'function',
        function: {
          name: 'test_tool',
          parameters: { type: 'object' },
          strict: true,
        },
      };

      const parser = (args: string) => JSON.parse(args);
      const callback = (args: any) => args;

      const parseable = makeParseableTool(tool, { parser, callback });

      expect((parseable as any).$brand).toBe('auto-parseable-tool');
      expect(typeof (parseable as any).$parseRaw).toBe('function');
      expect((parseable as any).$callback).toBe(callback);
    });

    it('brand markers are non-enumerable', () => {
      const tool: any = {
        type: 'function',
        function: { name: 'test', parameters: {} },
      };

      const parseable = makeParseableTool(tool, {
        parser: JSON.parse,
        callback: undefined,
      });

      const keys = Object.keys(parseable);
      expect(keys).not.toContain('$brand');
      expect(keys).not.toContain('$parseRaw');
      expect(keys).not.toContain('$callback');
    });
  });

  describe('isAutoParsableTool', () => {
    it('detects auto-parseable tool', () => {
      const tool: any = { type: 'function', function: { name: 'test' } };
      const parseable = makeParseableTool(tool, {
        parser: JSON.parse,
        callback: undefined,
      });

      expect(isAutoParsableTool(parseable)).toBe(true);
    });

    it('rejects non-parseable tool', () => {
      const tool = { type: 'function', function: { name: 'test' } };
      expect(isAutoParsableTool(tool)).toBe(false);
    });
  });
});

describe('Parser - Completion Parsing', () => {
  describe('maybeParseChatCompletion', () => {
    it('returns completion with null parsed when no auto-parseable inputs', () => {
      const completion: Completion = {
        id: 'test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: '{"result": "test"}',
              refusal: null,
            },
            finish_reason: 'stop',
          },
        ],
      };

      const params: CompletionCreateParams = {
        model: 'test-model',
        messages: [],
      };

      const parsed = maybeParseChatCompletion(completion, params);

      expect(parsed.choices[0].message.parsed).toBeNull();
    });

    it('parses when auto-parseable format detected', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const parseable = makeParseableResponseFormat(format, (content) => JSON.parse(content));

      const completion: Completion = {
        id: 'test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: '{"result": "success"}',
              refusal: null,
            },
            finish_reason: 'stop',
          },
        ],
      };

      const params: CompletionCreateParams = {
        model: 'test-model',
        messages: [],
        response_format: parseable,
      };

      const parsed = maybeParseChatCompletion(completion, params);

      expect(parsed.choices[0].message.parsed).toEqual({ result: 'success' });
    });

    it('sets parsed to null on refusal', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const parseable = makeParseableResponseFormat(format, JSON.parse);

      const completion: Completion = {
        id: 'test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: 'I cannot help with that',
            },
            finish_reason: 'stop',
          },
        ],
      };

      const params: CompletionCreateParams = {
        model: 'test-model',
        messages: [],
        response_format: parseable,
      };

      const parsed = maybeParseChatCompletion(completion, params);

      expect(parsed.choices[0].message.parsed).toBeNull();
      expect(parsed.choices[0].message.refusal).toBe('I cannot help with that');
    });
  });

  describe('parseChatCompletion', () => {
    it('throws LengthFinishReasonError on length finish reason', () => {
      const completion: Completion = {
        id: 'test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'truncated...',
              refusal: null,
            },
            finish_reason: 'length',
          },
        ],
      };

      const params: CompletionCreateParams = {
        model: 'test-model',
        messages: [],
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(LengthFinishReasonError);
      expect(() => parseChatCompletion(completion, params)).toThrow(/length limit/);
    });

    it('throws ContentFilterFinishReasonError on content_filter', () => {
      const completion: Completion = {
        id: 'test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'test-model',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              refusal: null,
            },
            finish_reason: 'content_filter',
          },
        ],
      };

      const params: CompletionCreateParams = {
        model: 'test-model',
        messages: [],
      };

      expect(() => parseChatCompletion(completion, params)).toThrow(ContentFilterFinishReasonError);
      expect(() => parseChatCompletion(completion, params)).toThrow(/content policy/);
    });
  });

  describe('hasAutoParseableInput', () => {
    it('detects auto-parseable response format', () => {
      const format: ResponseFormatJSONSchema = {
        type: 'json_schema',
        json_schema: { name: 'test', schema: {} },
      };

      const parseable = makeParseableResponseFormat(format, JSON.parse);

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        response_format: parseable,
      };

      expect(hasAutoParseableInput(params)).toBe(true);
    });

    it('detects auto-parseable tools', () => {
      const tool: any = { type: 'function', function: { name: 'test' } };
      const parseable = makeParseableTool(tool, {
        parser: JSON.parse,
        callback: undefined,
      });

      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        tools: [parseable],
      };

      expect(hasAutoParseableInput(params)).toBe(true);
    });

    it('detects strict tools', () => {
      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
        tools: [
          {
            type: 'function',
            function: { name: 'test', strict: true, parameters: {} },
          } as any,
        ],
      };

      expect(hasAutoParseableInput(params)).toBe(true);
    });

    it('returns false when no auto-parseable inputs', () => {
      const params: CompletionCreateParams = {
        model: 'test',
        messages: [],
      };

      expect(hasAutoParseableInput(params)).toBe(false);
    });
  });

  describe('validateInputTools', () => {
    it('passes for strict tools', () => {
      const tools: any[] = [{ type: 'function', function: { name: 'test', strict: true } }];

      expect(() => validateInputTools(tools)).not.toThrow();
    });

    it('throws for non-function tools', () => {
      const tools: any[] = [{ type: 'custom', name: 'test' }];

      expect(() => validateInputTools(tools)).toThrow(/Only 'function' tool types/);
    });

    it('throws for non-strict tools', () => {
      const tools: any[] = [{ type: 'function', function: { name: 'test', strict: false } }];

      expect(() => validateInputTools(tools)).toThrow(/must be marked with 'strict: true'/);
    });

    it('throws for tools without strict field', () => {
      const tools: any[] = [{ type: 'function', function: { name: 'test' } }];

      expect(() => validateInputTools(tools)).toThrow(/must be marked with 'strict: true'/);
    });
  });
});
