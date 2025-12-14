// Example: Zod schema integration with the Dedalus SDK

import { z } from 'zod';
import { Dedalus } from 'dedalus-labs';
import { zodFunction } from 'dedalus-labs/helpers/zod';
import 'dotenv/config';

const client = new Dedalus();

// Tool calling with Zod schema
async function toolCallingExample() {
  console.log('\nExample: Tool Calling with Zod Schema\n');

  const calculatorTool = zodFunction({
    name: 'calculator',
    description: 'Perform basic math operations',
    parameters: z.object({
      a: z.number(),
      b: z.number(),
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    }),
  });

  console.log('Tool definition:', JSON.stringify(calculatorTool, null, 2));

  const completion = await client.chat.completions.parse({
    model: 'openai/gpt-5-nano',
    messages: [
      {
        role: 'user',
        content: 'What is 42 multiplied by 17?',
      },
    ],
    tools: [calculatorTool],
  });

  const toolCall = completion.choices[0]?.message.tool_calls?.[0];
  console.log('Tool call name:', toolCall?.function.name);
  console.log('Parsed arguments:', toolCall?.function.parsed_arguments);
}

toolCallingExample().catch(console.error);
