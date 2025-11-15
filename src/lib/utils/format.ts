// ==============================================================================
//                  © 2025 Dedalus Labs, Inc. and affiliates
//                            Licensed under MIT
//           github.com/dedalus-labs/dedalus-sdk-typescript/LICENSE
// ==============================================================================

/** Converts value to JSON string, passing through strings unchanged. */
export const jsonify = (v: any) => (typeof v === 'string' ? v : JSON.stringify(v));
