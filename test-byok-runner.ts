// ==============================================================================
//                  BYOK Runner Integration Test
//
// Tests DedalusRunner with real BYOK API calls against production.
// Run: npx tsx test-byok-runner.ts
// ==============================================================================

import Dedalus, { DedalusRunner } from './src/index';
import { zodFunction } from './src/helpers/zod';
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

const DEDALUS_API_KEY = env['DEDALUS_API_KEY']!;
const OPENAI_KEY = env['OPENAI_API_KEY_1']!;
const ANTHROPIC_KEY = env['ANTHROPIC_API_KEY_1']!;

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`PASS  ${name}`);
    passed++;
  } catch (err: any) {
    console.log(`FAIL  ${name}`);
    console.log(`      ${err.message}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

// --- Tests ---

async function main() {
  console.log('=== BYOK Runner Integration Tests ===\n');

  // 1. Basic runner with OpenAI BYOK
  await test('Runner: OpenAI BYOK basic', async () => {
    const client = new Dedalus({
      apiKey: DEDALUS_API_KEY,
      baseURL: 'https://api.dedaluslabs.ai',
      provider: 'openai',
      providerKey: OPENAI_KEY,
      providerModel: 'gpt-4o-mini',
    });

    const runner = new DedalusRunner(client);
    const result = await runner.run({
      model: 'openai/gpt-4o-mini',
      instructions: 'You are a helpful assistant. Keep responses very short.',
      input: 'What is 2 + 2?',
      maxSteps: 3,
    });

    const r = result as any;
    assert(typeof r.output === 'string', 'output should be a string');
    assert(r.output.length > 0, 'output should not be empty');
    assert(r.stepsUsed >= 1, 'should use at least 1 step');
    console.log(`      Response: "${r.output.slice(0, 80)}"`);
  });

  // 2. Runner with Anthropic BYOK
  await test('Runner: Anthropic BYOK basic', async () => {
    const client = new Dedalus({
      apiKey: DEDALUS_API_KEY,
      baseURL: 'https://api.dedaluslabs.ai',
      provider: 'anthropic',
      providerKey: ANTHROPIC_KEY,
      providerModel: 'claude-sonnet-4-20250514',
    });

    const runner = new DedalusRunner(client);
    const result = await runner.run({
      model: 'anthropic/claude-sonnet-4-20250514',
      instructions: 'You are a helpful assistant. Keep responses very short.',
      input: 'What is the capital of France?',
      max_tokens: 50,
      maxSteps: 3,
    });

    const r = result as any;
    assert(typeof r.output === 'string', 'output should be a string');
    assert(r.output.toLowerCase().includes('paris'), 'output should mention Paris');
    console.log(`      Response: "${r.output.slice(0, 80)}"`);
  });

  // 3. Runner with local tool + OpenAI BYOK
  await test('Runner: OpenAI BYOK with Zod tool', async () => {
    const client = new Dedalus({
      apiKey: DEDALUS_API_KEY,
      baseURL: 'https://api.dedaluslabs.ai',
      provider: 'openai',
      providerKey: OPENAI_KEY,
      providerModel: 'gpt-4o-mini',
    });

    const calculator = zodFunction({
      name: 'calculator',
      description: 'Perform basic math. Returns the numeric result.',
      parameters: z.object({
        a: z.number().describe('First number'),
        b: z.number().describe('Second number'),
        operation: z.enum(['add', 'subtract', 'multiply', 'divide']).describe('Operation'),
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
      instructions: 'Use the calculator tool to answer math questions. Report only the number.',
      input: 'What is 15 * 7?',
      tools: [calculator],
      max_tokens: 100,
      maxSteps: 5,
    });

    const r = result as any;
    console.log(
      `      DEBUG: output="${r.output}", steps=${r.stepsUsed}, tools=${JSON.stringify(
        r.toolsCalled,
      )}, toolResults=${JSON.stringify(r.toolResults)}`,
    );
    assert(typeof r.output === 'string', 'output should be a string');
    assert(r.stepsUsed >= 1, 'should use at least 1 step');
    console.log(`      Response: "${r.output.slice(0, 80)}", tools: ${r.toolsCalled}`);
  });

  // 4. Switching providers between runner calls
  await test('Runner: switch providers (OpenAI then Anthropic)', async () => {
    const openaiClient = new Dedalus({
      apiKey: DEDALUS_API_KEY,
      baseURL: 'https://api.dedaluslabs.ai',
      provider: 'openai',
      providerKey: OPENAI_KEY,
      providerModel: 'gpt-4o-mini',
    });

    const anthropicClient = openaiClient.withOptions({
      provider: 'anthropic',
      providerKey: ANTHROPIC_KEY,
      providerModel: 'claude-sonnet-4-20250514',
    });

    const openaiRunner = new DedalusRunner(openaiClient);
    const anthropicRunner = new DedalusRunner(anthropicClient);

    const r1 = await openaiRunner.run({
      model: 'openai/gpt-4o-mini',
      input: 'Say "I am OpenAI" and nothing else.',
      max_tokens: 20,
      maxSteps: 1,
    });

    const r2 = await anthropicRunner.run({
      model: 'anthropic/claude-sonnet-4-20250514',
      input: 'Say "I am Anthropic" and nothing else.',
      max_tokens: 20,
      maxSteps: 1,
    });

    const out1 = (r1 as any).output.toLowerCase();
    const out2 = (r2 as any).output.toLowerCase();
    assert(out1.includes('openai'), `OpenAI runner should mention openai, got: "${out1}"`);
    assert(out2.includes('anthropic'), `Anthropic runner should mention anthropic, got: "${out2}"`);
    console.log(
      `      OpenAI: "${(r1 as any).output.slice(0, 40)}" | Anthropic: "${(r2 as any).output.slice(0, 40)}"`,
    );
  });

  // 5. Streaming with BYOK
  await test('Runner: OpenAI BYOK streaming', async () => {
    const client = new Dedalus({
      apiKey: DEDALUS_API_KEY,
      baseURL: 'https://api.dedaluslabs.ai',
      provider: 'openai',
      providerKey: OPENAI_KEY,
      providerModel: 'gpt-4o-mini',
    });

    const runner = new DedalusRunner(client);
    const stream = await runner.run({
      model: 'openai/gpt-4o-mini',
      input: 'Count from 1 to 5, one number per word.',
      stream: true,
      maxSteps: 3,
    });

    const chunks: string[] = [];
    for await (const chunk of stream as AsyncIterableIterator<any>) {
      const content = chunk.choices?.[0]?.delta?.content;
      if (content) chunks.push(content);
    }

    assert(chunks.length > 0, 'should receive at least one chunk');
    const full = chunks.join('');
    assert(full.length > 0, 'combined output should not be empty');
    console.log(`      Streamed ${chunks.length} chunks: "${full.slice(0, 80)}"`);
  });

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
