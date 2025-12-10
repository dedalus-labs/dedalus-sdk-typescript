import type { Dedalus } from '../../src/client';
import type { Completion } from '../../src/resources/chat/completions';

/**
 * Creates a mock Dedalus client that returns predefined responses in sequence.
 * Useful for testing DedalusRunner without making real API calls.
 *
 * @example
 * ```ts
 * const mockClient = createMockClient([
 *   createMockCompletionWithTools([{ id: 'call_1', name: 'getTool', arguments: '{}' }]),
 *   createMockCompletionWithContent('Final answer'),
 * ]);
 *
 * const runner = new DedalusRunner(mockClient);
 * const result = await runner.run({ model: 'test', input: 'Hello' });
 *
 * expect(mockClient.chat.completions.create).toHaveBeenCalledTimes(2);
 * ```
 */
export function createMockClient(responses: Completion[]) {
  let callIndex = 0;

  const mockCreate = jest.fn().mockImplementation(async () => {
    return responses[callIndex++];
  });

  return {
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  } as unknown as Dedalus;
}
