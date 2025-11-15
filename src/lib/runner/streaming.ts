// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

/** Merges streaming tool call deltas into complete tool calls by index. */
export function accumulateToolCalls(deltas: any[], acc: any[]): void {
  for (const delta of deltas) {
    const index = delta.index ?? 0;

    while (acc.length <= index) {
      acc.push({ id: '', type: 'function', function: { name: '', arguments: '' } });
    }

    if (delta.id) {
      acc[index].id = delta.id;
    }
    if (delta.function) {
      const fn = delta.function;
      if (fn.name) {
        acc[index].function.name = fn.name;
      }
      if (fn.arguments) {
        acc[index].function.arguments += fn.arguments;
      }
    }
  }
}
