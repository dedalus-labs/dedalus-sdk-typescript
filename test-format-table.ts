import Dedalus from './src/index';
import { DedalusRunner } from './src/index';
import { readFileSync } from 'fs';

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

const client = new Dedalus({
  apiKey: env['DEDALUS_API_KEY'],
  provider: 'openai',
  providerKey: env['OPENAI_API_KEY_1'],
  providerModel: 'gpt-4o-mini',
});
const runner = new DedalusRunner(client, true);

function formatTable(rows: Record<string, any>[]): string {
  if (!rows.length) return 'No results.';
  const cols = Object.keys(rows[0]);
  const header = `| ${cols.join(' | ')} |`;
  const sep = `| ${cols.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${cols.map((c) => String(r?.[c] ?? '')).join(' | ')} |`);
  return [header, sep, ...body].join('\n');
}

async function main() {
  const result = await runner.run({
    input:
      'Take the following events and call formatTable with a list of rows (one row per event).\n\n' +
      'Events:\n' +
      '- {"name":"Warriors vs Lakers","city":"San Francisco","date":"2026-01-18"}\n' +
      '- {"name":"Warriors vs Suns","city":"San Francisco","date":"2026-01-22"}\n' +
      '- {"name":"Warriors vs Celtics","city":"San Francisco","date":"2026-01-29"}\n\n' +
      'Return only the table.',
    model: 'openai/gpt-4o-mini',
    tools: [formatTable],
  });

  console.log((result as any).finalOutput);
}

main();
