// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { ChatCompletionToolParam } from '../../resources/chat/completions';
import type { JsonValue, Tool, PlainTool } from './types/tools';
import { isAutoParsableTool } from '../parser';
import { toSchema } from '../utils/schemas';

/** Extract the name from a tool (plain function or AutoParseableTool). */
function getToolName(tool: Tool): string {
  if (isAutoParsableTool(tool)) {
    return tool.function.name;
  }
  return (tool as PlainTool).name;
}

/** Creates a tool registry with schema generation and execution capabilities. */
export function createToolHandler(tools: Iterable<Tool>) {
  const toolsByName = new Map(Array.from(tools).map((tool) => [getToolName(tool), tool]));

  return {
    schemas(): Array<ChatCompletionToolParam> {
      const schemas: Array<ChatCompletionToolParam> = [];
      for (const tool of toolsByName.values()) {
        try {
          if (isAutoParsableTool(tool)) {
            // Use embedded schema from AutoParseableTool
            schemas.push({
              type: 'function',
              function: {
                name: tool.function.name,
                ...(tool.function.description ? { description: tool.function.description } : {}),
                ...(tool.function.parameters ? { parameters: tool.function.parameters } : {}),
                strict: tool.function.strict,
              },
            });
          } else {
            // Fall back to regex-based schema extraction for plain functions
            schemas.push(toSchema(tool as PlainTool));
          }
        } catch (err) {
          throw new Error(`[DedalusRunner] Invalid tool "${getToolName(tool)}": ${String(err)}`);
        }
      }
      return schemas;
    },

    async exec(name: string, args: Record<string, any>): Promise<JsonValue> {
      const tool = toolsByName.get(name);
      if (!tool) throw new Error(`Unknown tool: ${name}`);

      if (isAutoParsableTool(tool)) {
        // Use $callback and $parseRaw for AutoParseableTool
        if (!tool.$callback) {
          throw new Error(`Tool "${name}" has no implementation ($callback not defined)`);
        }
        const parsedArgs = tool.$parseRaw(JSON.stringify(args));
        const res = tool.$callback(parsedArgs);
        return await Promise.resolve(res);
      }

      // Plain function execution
      const fn = tool as PlainTool;
      const res = fn.length === 1 ? fn(args) : fn(...Object.values(args));
      return await Promise.resolve(res);
    },

    listNames(): string[] {
      return Array.from(toolsByName.keys());
    },
  };
}
