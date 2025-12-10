// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { ChatCompletionToolParam } from '../../resources/chat/completions';
import type { JsonValue, Tool, ToolDefinition } from './types/tools';
import { toSchema, toSchemaFromDefinition } from '../utils/schemas';

type ExecuteFn = (args: Record<string, any>) => JsonValue | Promise<JsonValue>;

interface RegisteredTool {
  schema: ChatCompletionToolParam;
  execute: ExecuteFn | undefined;
}

/** Type guard to check if tool is a ToolDefinition */
function isToolDefinition(tool: Tool): tool is ToolDefinition {
  return typeof tool !== 'function' && typeof tool === 'object' && 'name' in tool;
}

/** Creates a tool registry with schema generation and execution capabilities. */
export function createToolHandler(tools: Iterable<Tool>) {
  const toolsByName = new Map<string, RegisteredTool>();

  for (const tool of tools) {
    if (isToolDefinition(tool)) {
      // ToolDefinition - explicit schema
      try {
        toolsByName.set(tool.name, {
          schema: toSchemaFromDefinition(tool),
          execute: tool.execute,
        });
      } catch (err) {
        throw new Error(`[DedalusRunner] Invalid tool "${tool.name}": ${String(err)}`);
      }
    } else {
      // ToolFunction - always server-side, auto-generate schema
      try {
        toolsByName.set(tool.name, {
          schema: toSchema(tool),
          execute: tool,
        });
      } catch (err) {
        throw new Error(`[DedalusRunner] Invalid tool "${tool.name}": ${String(err)}`);
      }
    }
  }

  const allSchemas = Array.from(toolsByName.values()).map((t) => t.schema);
  const toolNames = Array.from(toolsByName.keys());

  return {
    schemas: allSchemas.length ? allSchemas : null,
    toolNames,

    isClientTool(name: string): boolean {
      const tool = toolsByName.get(name);
      return tool ? !tool.execute : false;
    },

    async exec(name: string, args: Record<string, any>): Promise<JsonValue> {
      const tool = toolsByName.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }
      if (!tool.execute) {
        throw new Error(`Tool "${name}" is a client-side tool and cannot be executed on server`);
      }
      // For functions that take a single object arg, pass args directly
      // For functions with multiple params, spread the values
      const res =
        tool.execute.length === 1 ? tool.execute(args) : (tool.execute as Function)(...Object.values(args));
      return await Promise.resolve(res);
    },
  };
}
