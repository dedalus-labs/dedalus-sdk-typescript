// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//          github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

import type { CompletionCreateParamsBase } from '../../../resources/chat/completions';

export type Message = Extract<CompletionCreateParamsBase['messages'], Array<any>>[number];
