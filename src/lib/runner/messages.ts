// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { Message } from './types/messages';

/** Constructs initial conversation history from input parameters. */
export function buildInitialMessages({
  instructions,
  input,
  messages,
}: {
  instructions?: string | undefined;
  input?: string | Message[] | undefined;
  messages?: Message[] | undefined;
}): Message[] {
  if (instructions && messages?.some((m) => (m as any).role === 'system')) {
    throw new Error("Cannot supply both 'instructions' and a system message in 'messages'.");
  }

  let conversation: Message[] = [];
  if (messages) {
    conversation = [...messages];
  } else if (typeof input === 'string') {
    conversation = [{ role: 'user', content: input } as unknown as Message];
  } else if (Array.isArray(input)) {
    conversation = [...input];
  }

  if (instructions) {
    conversation.unshift({ role: 'system', content: instructions } as unknown as Message);
  }

  if (!conversation.length) {
    throw new Error('Must supply one of instructions/messages/input');
  }
  return conversation;
}

/** Normalizes tool call to standard format with required fields. */
export function coerceToolCall(call: any): any {
  const fn = call.function ?? {};
  let args = fn.arguments ?? '{}';
  if (typeof args !== 'string') {
    args = JSON.stringify(args);
  }
  return {
    id: call.id ?? '',
    type: call.type ?? 'function',
    function: {
      name: fn.name ?? '',
      arguments: args,
    },
  };
}
