// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { ChatCompletionToolParam } from '../../resources/chat/completions';
import type { JsonValue, Tool } from './types/tools';
import { toSchema } from '../utils/schemas';

/** Creates a tool registry with schema generation and execution capabilities. */
export function createToolHandler(tools: Iterable<Tool>) {
  const toolsByName = new Map(Array.from(tools).map((fn) => [fn.name, fn]));

  return {
    schemas(): Array<ChatCompletionToolParam> {
      const schemas: Array<ChatCompletionToolParam> = [];
      for (const fn of toolsByName.values()) {
        try {
          schemas.push(toSchema(fn));
        } catch (err) {
          throw new Error(`[DedalusRunner] Invalid tool "${fn.name}": ${String(err)}`);
        }
      }
      return schemas;
    },

    async exec(name: string, args: Record<string, any>): Promise<JsonValue> {
      const fn = toolsByName.get(name);
      if (!fn) throw new Error(`Unknown tool: ${name}`);
      const res = fn.length === 1 ? fn(args) : fn(...Object.values(args));
      return await Promise.resolve(res);
    },

    listNames(): string[] {
      return Array.from(toolsByName.keys());
    },
  };
}
