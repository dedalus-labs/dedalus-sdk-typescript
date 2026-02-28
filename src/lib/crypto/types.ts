/**
 * Minimal Web Crypto API type declarations.
 *
 * The build tsconfig uses "lib": ["es2020"] which excludes DOM types.
 * These declarations provide the subset used by the encryption module.
 */

/** @ts-ignore */
type _CryptoKey = CryptoKey;

/** @ts-ignore */
type _JsonWebKey = JsonWebKey;

export type { _CryptoKey as CryptoKey, _JsonWebKey as JsonWebKey };
