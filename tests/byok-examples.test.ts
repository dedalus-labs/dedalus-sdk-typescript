// Example: BYOK (Bring Your Own Key) with the Dedalus SDK
//
// Runs every code example from BYOK.md against the live API.
// Run: npx tsx tests/byok-examples.test.ts

import Dedalus, { DedalusRunner } from 'dedalus-labs';
import { RunResult } from '../src/lib/runner';
import { zodFunction } from 'dedalus-labs/helpers/zod';
import { z } from 'zod';
import { readFileSync } from 'fs';

// --- Load keys from .env file ---
function loadEnv(path: string): Record<string, string> {
  const content = readFileSync(path, 'utf-8');
  const env: Record<string, string> = {};
  for (const line of content.split('\n')) {
    if (line.startsWith('#') || !line.includes('=')) continue;
    const eqIdx = line.indexOf('=');
    const key = line.slice(0, eqIdx).trim();
    const val = line.slice(eqIdx + 1).trim();
    env[key] = val;
  }
  return env;
}

const envFile = '/Users/tsionkergo/dedalus/sdk/test-typescript-sdk/.env';
const env = loadEnv(envFile);

process.env['DEDALUS_API_KEY'] = env['DEDALUS_API_KEY']!;
process.env['OPENAI_API_KEY'] = env['OPENAI_API_KEY_1']!;
process.env['ANTHROPIC_API_KEY'] = env['ANTHROPIC_API_KEY_1']!;
process.env['GOOGLE_API_KEY'] = env['GEMINI_API_KEY_1']!;

// --- OpenAI BYOK ---

async function openAIExample() {
  console.log('\nExample: OpenAI BYOK\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const response = await client.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [{ role: 'user', content: 'Explain quantum computing in one sentence.' }],
  });

  console.log(response.choices[0]?.message?.content);
}

// --- Anthropic BYOK ---

async function anthropicExample() {
  console.log('\nExample: Anthropic BYOK\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'anthropic',
    providerKey: process.env['ANTHROPIC_API_KEY'],
    providerModel: 'claude-sonnet-4-20250514',
  });

  const response = await client.chat.completions.create({
    model: 'anthropic/claude-sonnet-4-20250514',
    messages: [{ role: 'user', content: 'Write a haiku about TypeScript.' }],
    max_tokens: 50,
  });

  console.log(response.choices[0]?.message?.content);
}

// --- Google BYOK ---

async function googleExample() {
  console.log('\nExample: Google BYOK\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'google',
    providerKey: process.env['GOOGLE_API_KEY'],
    providerModel: 'gemini-2.0-flash',
  });

  const response = await client.chat.completions.create({
    model: 'google/gemini-2.0-flash',
    messages: [{ role: 'user', content: 'What is the capital of France?' }],
  });

  console.log(response.choices[0]?.message?.content);
}

// --- Streaming with BYOK ---

async function streamingExample() {
  console.log('\nExample: Streaming with BYOK\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const stream = await client.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    stream: true,
    messages: [{ role: 'user', content: 'Tell me a short story.' }],
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) process.stdout.write(content);
  }
  console.log();
}

// --- Switching Providers at Runtime ---

async function switchProvidersExample() {
  console.log('\nExample: Switching Providers at Runtime\n');

  const openaiClient = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const anthropicClient = openaiClient.withOptions({
    provider: 'anthropic',
    providerKey: process.env['ANTHROPIC_API_KEY'],
    providerModel: 'claude-sonnet-4-20250514',
  });

  const [openaiResponse, anthropicResponse] = await Promise.all([
    openaiClient.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: 'Hello from OpenAI' }],
    }),
    anthropicClient.chat.completions.create({
      model: 'anthropic/claude-sonnet-4-20250514',
      messages: [{ role: 'user', content: 'Hello from Anthropic' }],
      max_tokens: 50,
    }),
  ]);

  console.log('OpenAI:', openaiResponse.choices[0]?.message?.content);
  console.log('Anthropic:', anthropicResponse.choices[0]?.message?.content);
}

// --- DedalusRunner: Basic ---

async function runnerBasicExample() {
  console.log('\nExample: DedalusRunner Basic\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const runner = new DedalusRunner(client);

  const result = await runner.run({
    model: 'openai/gpt-4o-mini',
    instructions: 'You are a helpful assistant.',
    input: 'What are the three laws of thermodynamics?',
    maxSteps: 5,
  });

  console.log((result as RunResult).output);
  console.log('Steps used:', (result as RunResult).stepsUsed);
}

// --- DedalusRunner: With Local Tools (Zod) ---

async function runnerZodToolsExample() {
  console.log('\nExample: DedalusRunner with Zod Tools\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const calculator = zodFunction({
    name: 'calculator',
    description: 'Perform basic math operations',
    parameters: z.object({
      a: z.number(),
      b: z.number(),
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    }),
    function: (args) => {
      switch (args.operation) {
        case 'add':
          return args.a + args.b;
        case 'subtract':
          return args.a - args.b;
        case 'multiply':
          return args.a * args.b;
        case 'divide':
          return args.a / args.b;
      }
    },
  });

  const runner = new DedalusRunner(client);

  const result = await runner.run({
    model: 'openai/gpt-4o-mini',
    input: 'What is 42 * 17?',
    tools: [calculator],
    maxSteps: 5,
  });

  console.log((result as RunResult).output);
  console.log('Tools called:', (result as RunResult).toolsCalled);
  console.log('Steps used:', (result as RunResult).stepsUsed);
}

// --- DedalusRunner: With MCP Servers ---

async function runnerMCPExample() {
  console.log('\nExample: DedalusRunner with MCP Servers\n');

  const client = new Dedalus();
  const runner = new DedalusRunner(client);

  const result = await runner.run({
    input: "What's the weather forecast for San Francisco this week?",
    model: 'openai/gpt-4o-mini',
    mcpServers: ['windsor/open-meteo-mcp'],
    maxSteps: 10,
  });

  console.log((result as RunResult).output);
}

// --- DedalusRunner: Streaming ---

async function runnerStreamingExample() {
  console.log('\nExample: DedalusRunner Streaming\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const runner = new DedalusRunner(client);

  const result = await runner.run({
    model: 'openai/gpt-4o-mini',
    input: 'Write a short story about a robot learning to cook.',
    stream: true,
    maxSteps: 5,
  });

  if (Symbol.asyncIterator in result) {
    for await (const chunk of result) {
      if (chunk.choices?.[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }
  }
  console.log();
}

// --- DedalusRunner: Switching Providers ---

async function runnerSwitchProvidersExample() {
  console.log('\nExample: DedalusRunner Switching Providers\n');

  const openaiClient = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    provider: 'openai',
    providerKey: process.env['OPENAI_API_KEY'],
    providerModel: 'gpt-4o-mini',
  });

  const anthropicClient = openaiClient.withOptions({
    provider: 'anthropic',
    providerKey: process.env['ANTHROPIC_API_KEY'],
    providerModel: 'claude-sonnet-4-20250514',
  });

  const openaiRunner = new DedalusRunner(openaiClient);
  const anthropicRunner = new DedalusRunner(anthropicClient);

  const codeResult = await openaiRunner.run({
    model: 'openai/gpt-4o-mini',
    input: 'Write a fizzbuzz function in TypeScript',
    maxSteps: 3,
  });

  const reviewResult = await anthropicRunner.run({
    model: 'anthropic/claude-sonnet-4-20250514',
    input: `Review this code:\n${(codeResult as RunResult).output}`,
    max_tokens: 200,
    maxSteps: 3,
  });

  console.log('Code:', (codeResult as RunResult).output?.slice(0, 100));
  console.log('Review:', (reviewResult as RunResult).output?.slice(0, 100));
}

// --- Partial BYOK ---

async function partialBYOKExample() {
  console.log('\nExample: Partial BYOK (Provider Key Only)\n');

  const client = new Dedalus({
    apiKey: process.env['DEDALUS_API_KEY'],
    providerKey: process.env['OPENAI_API_KEY'],
  });

  const response = await client.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [{ role: 'user', content: 'Hello' }],
  });

  console.log(response.choices[0]?.message?.content);
}

// Run all examples

async function main() {
  try {
    await openAIExample();
    await anthropicExample();
    await googleExample();
    await streamingExample();
    await switchProvidersExample();
    await runnerBasicExample();
    await runnerZodToolsExample();
    await runnerMCPExample();
    await runnerStreamingExample();
    await runnerSwitchProvidersExample();
    await partialBYOKExample();
    console.log('\n=== All BYOK examples completed successfully ===\n');
  } catch (error) {
    console.error('Example failed:', error);
    process.exit(1);
  }
}

main();
