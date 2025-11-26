import type { Completion } from '../../src/resources/chat/completions';

/**
 * Create a mock completion response for testing without API calls
 */
export function createMockCompletion(overrides?: Partial<Completion>): Completion {
  return {
    id: 'cmpl_test_123',
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
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
    ...overrides,
  };
}

/**
 * Create a mock completion with specific content
 */
export function createMockCompletionWithContent(
  content: string,
  finishReason: 'stop' | 'length' | 'content_filter' | 'tool_calls' = 'stop',
): Completion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
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
export function createMockCompletionWithRefusal(refusal: string): Completion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: null,
          refusal,
        },
        finish_reason: 'stop',
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
): Completion {
  return createMockCompletion({
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
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
        finish_reason: 'tool_calls',
      },
    ],
  });
}
