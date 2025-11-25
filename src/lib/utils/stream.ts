// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

/**
 * Minimal structural types to match the Python-side StreamChunk.
 * If you have generated SDK types, replace these with imports.
 */

export type ToolCallDelta = {
  id?: string;
  function?: { name?: string };
};

export type Delta = {
  content?: string;
  tool_calls?: ToolCallDelta[];
};

export type Choice = {
  delta: Delta;
  finish_reason?: string;
};

export type StreamChunk = {
  choices?: Choice[];
  /** Mirrors Python: sometimes metadata is stashed here by pydantic */
  __pydantic_extra__?: Record<string, any>;
};

const isVerbose = () => {
  const v = (process.env['DEDALUS_SDK_VERBOSE'] || '').toLowerCase();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on' || v === 'debug';
};

/** Stream text content from an async streaming response. */
export async function streamAsync(stream: AsyncIterable<StreamChunk>): Promise<void> {
  const verbose = isVerbose();

  for await (const chunk of stream) {
    // Print server-side metadata events if present (verbose-only)
    if (verbose) {
      const extra = (chunk as any).__pydantic_extra__;
      if (extra && typeof extra === 'object') {
        const meta = (extra as any).dedalus_event;
        if (meta && typeof meta === 'object') {
          console.log(`\n[EVENT] ${JSON.stringify(meta)}`);
        }
      }
    }

    if (chunk.choices && chunk.choices.length) {
      const choice = chunk.choices[0];
      if (!choice) continue;

      const delta = choice.delta || {};

      // Print tool-call deltas as debug (verbose-only)
      if (verbose && Array.isArray(delta.tool_calls)) {
        for (const tc of delta.tool_calls) {
          const name = tc.function?.name;
          const tcid = tc.id;

          console.log(`\n[TOOL_CALL] name=${name} id=${tcid}`);
        }
      }

      // Always print content
      if (delta.content) {
        process.stdout.write(delta.content);
      }

      // Print finish reason (verbose-only)
      if (verbose && choice.finish_reason) {
        console.log(`\n[FINISH] reason=${choice.finish_reason}`);
      }
    }
  }

  console.log(); // Final newline
}

/** Stream text content from a sync iterator-like streaming response. */
export function streamSync(stream: Iterable<StreamChunk>): void {
  const verbose = isVerbose();

  for (const chunk of stream) {
    // Print server-side metadata events if present (verbose-only)
    if (verbose) {
      const extra = (chunk as any).__pydantic_extra__;
      if (extra && typeof extra === 'object') {
        const meta = (extra as any).dedalus_event;
        if (meta && typeof meta === 'object') {
          console.log(`\n[EVENT] ${JSON.stringify(meta)}`);
        }
      }
    }

    if (chunk.choices && chunk.choices.length) {
      const choice = chunk.choices[0];
      if (!choice) continue;

      const delta = choice.delta || {};

      // Print tool-call deltas as debug (verbose-only)
      if (verbose && Array.isArray(delta.tool_calls)) {
        for (const tc of delta.tool_calls) {
          const name = tc.function?.name;
          const tcid = tc.id;

          console.log(`\n[TOOL_CALL] name=${name} id=${tcid}`);
        }
      }

      // Always print content
      if (delta.content) {
        process.stdout.write(delta.content);
      }

      // Print finish reason (verbose-only)
      if (verbose && choice.finish_reason) {
        console.log(`\n[FINISH] reason=${choice.finish_reason}`);
      }
    }
  }

  console.log(); // Final newline
}
