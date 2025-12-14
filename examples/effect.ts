// Example: Effect schema integration with the Dedalus SDK

import * as Schema from 'effect/Schema';
import { Dedalus } from 'dedalus-labs';
import { effectResponseFormat, effectFunction } from 'dedalus-labs/helpers/effect';
import 'dotenv/config';

const client = new Dedalus();

// Example 1: Structured output with Effect schema
async function structuredOutputExample() {
  console.log('\nExample 1: Structured Output with Effect Schema\n');

  const WeatherSchema = Schema.Struct({
    location: Schema.String,
    temperature: Schema.Number,
    conditions: Schema.String,
    humidity: Schema.Number,
  });

  const completion = await client.chat.completions.parse({
    model: 'openai/gpt-5-nano',
    messages: [
      {
        role: 'user',
        content: 'What is the weather like in San Francisco today? Make up realistic values.',
      },
    ],
    response_format: effectResponseFormat(WeatherSchema, 'weather'),
  });

  const parsed = completion.choices[0]?.message.parsed;
  console.log('Parsed weather:', parsed);
  console.log('Type check - location is string:', typeof parsed?.location === 'string');
  console.log('Type check - temperature is number:', typeof parsed?.temperature === 'number');
}

// Example 2: Tool calling with Effect schema
async function toolCallingExample() {
  console.log('\nExample 2: Tool Calling with Effect Schema\n');

  const calculatorTool = effectFunction({
    name: 'calculator',
    description: 'Perform basic math operations',
    parameters: Schema.Struct({
      a: Schema.Number,
      b: Schema.Number,
      operation: Schema.Literal('add', 'subtract', 'multiply', 'divide'),
    }),
  });

  // Debug: print what's being sent
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
    toolChoice: { type: 'tool', name: 'calculator' },
  });

  const toolCall = completion.choices[0]?.message.tool_calls?.[0];
  console.log('Tool call name:', toolCall?.function.name);
  console.log('Parsed arguments:', toolCall?.function.parsed_arguments);

  if (toolCall?.function.parsed_arguments) {
    const args = toolCall.function.parsed_arguments as { a: number; b: number; operation: string };
    console.log(`Operation: ${args.a} ${args.operation} ${args.b}`);
  }
}

// Example 3: Complex nested schema
async function nestedSchemaExample() {
  console.log('\nExample 3: Complex Nested Schema\n');

  const PersonSchema = Schema.Struct({
    name: Schema.String,
    age: Schema.Number,
    address: Schema.Struct({
      street: Schema.String,
      city: Schema.String,
      country: Schema.String,
    }),
    hobbies: Schema.Array(Schema.String),
  });

  const completion = await client.chat.completions.parse({
    model: 'openai/gpt-5-nano',
    messages: [
      {
        role: 'user',
        content:
          'Generate a fictional person profile with name, age, address (street, city, country), and 3 hobbies.',
      },
    ],
    response_format: effectResponseFormat(PersonSchema, 'person'),
  });

  const parsed = completion.choices[0]?.message.parsed;
  console.log('Parsed person:', JSON.stringify(parsed, null, 2));
}

// Run all examples
async function main() {
  try {
    await structuredOutputExample();
    await toolCallingExample();
    await nestedSchemaExample();
    console.log('\n=== All examples completed successfully ===\n');
  } catch (error) {
    console.error('Example failed:', error);
    process.exit(1);
  }
}

main();
