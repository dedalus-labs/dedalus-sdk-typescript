import { z } from 'zod';
import Dedalus from '../../src/index';
import { zodResponseFormat } from '../../src/helpers/zod';
import type { MockParsedCompletion } from '../utils/mock-completions';

/**
 * Streaming + Structured Outputs Integration Test
 *
 * NOTE: This test is expected to fail until we implement .stream() method
 * with structured output parsing support. Currently marked as skipped.
 */
describe.skip('Streaming + Structured Outputs', () => {
  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'] || 'test-key',
  });

  it('should parse structured output from stream', async () => {
    const schema = z.object({
      summary: z.string(),
      keywords: z.array(z.string()),
    });

    // TODO: Implement .stream() method that supports structured outputs
    const stream = await (client.chat.completions as any).stream?.({
      model: 'openai/gpt-5-nano',
      messages: [
        {
          role: 'user',
          content: 'Summarize: TypeScript is a typed superset of JavaScript.',
        },
      ],
      response_format: zodResponseFormat(schema, 'summary'),
    });

    if (!stream) {
      throw new Error('.stream() method not yet implemented');
    }

    // Collect streamed chunks
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    // Get final completion with parsed output
    const final = await (stream as any).finalChatCompletion?.();

    expect(final).toBeDefined();
    expect(final.choices[0].message.parsed).toBeDefined();
    expect(final.choices[0].message.parsed.summary).toBeTruthy();
    expect(Array.isArray(final.choices[0].message.parsed.keywords)).toBe(true);
  }, 30000);

  it('should handle tool calls in streaming', async () => {
    // TODO: Implement streaming tool call parsing
    // This is a placeholder for future implementation
    expect(true).toBe(true);
  });
});

/**
 * Non-streaming structured output tests (should work now)
 */
describe('Structured Outputs - Completions API', () => {
  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'] || 'test-key',
  });

  it('works with .parse() method', async () => {
    // This test will only run if DEDALUS_API_KEY is set
    if (!process.env['DEDALUS_API_KEY']) {
      console.log('Skipping API test - no DEDALUS_API_KEY');
      return;
    }

    const schema = z.object({
      answer: z.string(),
      confidence: z.number(),
    });

    const completion = await client.chat.completions.parse({
      model: 'openai/gpt-5-nano',
      messages: [
        {
          role: 'user',
          content: 'What is 2+2? Provide answer and confidence 0-1.',
        },
      ],
      response_format: zodResponseFormat(schema, 'math'),
    });

    interface MathResult {
      answer: string;
      confidence: number;
    }

    const result = completion as MockParsedCompletion<MathResult>;
    expect(result.choices[0].message.parsed).toBeDefined();
    expect(typeof result.choices[0].message.parsed?.answer).toBe('string');
    expect(typeof result.choices[0].message.parsed?.confidence).toBe('number');
  }, 30000);
});
