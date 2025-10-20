// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-python/LICENSE
// ==============================================================================

/**
 * Mirrors: Message = Dict[str, Union[str, List[Dict[str, str]]]]
 *
 * This intentionally stays loose to match the Python shape.
 * If you want a stricter OpenAI-style shape, create a separate
 * `ChatMessage` type and map into it.
 */
export type Message = Record<string, string | Array<Record<string, string>>>;
