import type { Completion, Choice } from '../../src/resources/chat/completions';
import type { ParsedChatCompletion, ParsedChoice } from '../../src/lib/parser';

/** Array guaranteed to have at least one element */
export type NonEmptyArray<T> = [T, ...T[]];

/** Completion with guaranteed non-empty choices */
export interface MockCompletion extends Omit<Completion, 'choices'> {
  choices: NonEmptyArray<Choice>;
}

/** ParsedChatCompletion with guaranteed non-empty choices */
export interface MockParsedCompletion<ParsedT> extends Omit<ParsedChatCompletion<ParsedT>, 'choices'> {
  choices: NonEmptyArray<ParsedChoice<ParsedT>>;
}

/**
 * Create a mock completion response for testing without API calls
 */
export function createMockCompletion(overrides?: Partial<Completion>): MockCompletion {
  return {
    id: 'cmpl_test_123',
    object: 'chat.completion' as const,
    created: Math.floor(Date.now() / 1000),
    model: 'test-model',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant' as const,
          content: '{"result": "test"}',
          refusal: null,
        },
        finish_reason: 'stop' as const,
      },
    ],
    ...overrides,
  } as MockCompletion;
}

/**
 * Create a mock completion with specific content
 */
export function createMockCompletionWithContent(
  content: string,
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls' = 'stop',
): MockCompletion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant' as const,
          content,
          refusal: null,
        },
        finish_reason: finishReason,
      },
    ],
  });
}

/**
 * Create a mock completion with refusal
 */
export function createMockCompletionWithRefusal(refusal: string): MockCompletion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant' as const,
          content: null,
          refusal,
        },
        finish_reason: 'stop' as const,
      },
    ],
  });
}

/**
 * Create a mock completion with tool calls
 */
export function createMockCompletionWithTools(
  toolCalls: Array<{
    id: string;
    name: string;
    arguments: string;
  }>,
): MockCompletion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant' as const,
          content: null,
          refusal: null,
          tool_calls: toolCalls.map((tc) => ({
            id: tc.id,
            type: 'function' as const,
            function: {
              name: tc.name,
              arguments: tc.arguments,
            },
          })),
        },
        finish_reason: 'tool_calls' as const,
      },
    ],
  });
}
