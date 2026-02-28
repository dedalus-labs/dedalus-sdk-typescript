/**
 * Client-side credential encryption using hybrid RSA-OAEP + AES-GCM.
 *
 * Credentials are encrypted locally before transmission. The envelope format:
 *   [version:1][wrapped_key:keySize/8][nonce:12][ciphertext+tag:variable]
 *
 * Uses the Web Crypto API (built-in to Node.js 15+ and browsers).
 */

import type { CryptoKey, JsonWebKey } from './types';
import { type JsonObject } from '../utils/json';

// Envelope constants
export const ENVELOPE_VERSION = 0x01;
export const NONCE_LEN = 12;
export const AES_KEY_LEN = 32;

const RSA_ALGORITHM = { name: 'RSA-OAEP', hash: 'SHA-256' } as const;

/** Base64url encode without padding. */
export function b64urlEncode(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Base64url decode (restores padding). */
export function b64urlDecode(s: string): Uint8Array {
  let padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (padded.length % 4);
  if (pad !== 4) {
    padded += '='.repeat(pad);
  }
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Validate a JWK and import as an RSA-OAEP CryptoKey.
 *
 * @param jwk - JWK dict with kty="RSA", n, and e fields.
 * @param minKeySize - Minimum key size in bits (default 2048).
 * @returns CryptoKey for RSA-OAEP encryption.
 */
export async function jwkToPublicKey(jwk: JsonWebKey, minKeySize: number = 2048): Promise<CryptoKey> {
  if (jwk.kty !== 'RSA') {
    throw new Error(`expected RSA key type, got: ${jwk.kty}`);
  }

  if (!jwk.n) {
    throw new Error("missing required JWK field: 'n'");
  }
  if (!jwk.e) {
    throw new Error("missing required JWK field: 'e'");
  }

  // Check key size from the n parameter
  const nBytes = b64urlDecode(jwk.n);
  const keySizeBits = nBytes.length * 8;
  if (keySizeBits < minKeySize) {
    throw new Error(`key size ${keySizeBits} bits below minimum ${minKeySize}`);
  }

  return crypto.subtle.importKey('jwk', { kty: 'RSA', n: jwk.n, e: jwk.e }, RSA_ALGORITHM, false, [
    'encrypt',
  ]);
}

/**
 * Encrypt credentials using hybrid RSA-OAEP + AES-GCM.
 *
 * @param publicKey - RSA public key from jwkToPublicKey().
 * @param credentials - Credential values to encrypt.
 * @returns Base64url-encoded encrypted envelope.
 */
export async function encryptCredentials(publicKey: CryptoKey, credentials: JsonObject): Promise<string> {
  const plaintext = new TextEncoder().encode(JSON.stringify(credentials));

  // Generate ephemeral AES key and nonce
  const aesKeyRaw = crypto.getRandomValues(new Uint8Array(AES_KEY_LEN));
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LEN));

  // Wrap AES key with RSA-OAEP
  const wrappedKeyBuf = await crypto.subtle.encrypt(RSA_ALGORITHM, publicKey, aesKeyRaw);
  const wrappedKey = new Uint8Array(wrappedKeyBuf);

  // Import AES key for GCM encryption
  const aesKey = await crypto.subtle.importKey('raw', aesKeyRaw, { name: 'AES-GCM' }, false, ['encrypt']);

  // Encrypt with AES-GCM
  const ciphertextBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, plaintext);
  const ciphertext = new Uint8Array(ciphertextBuf);

  // Assemble envelope: version || wrapped_key || nonce || ciphertext+tag
  const envelope = new Uint8Array(1 + wrappedKey.length + NONCE_LEN + ciphertext.length);
  envelope[0] = ENVELOPE_VERSION;
  envelope.set(wrappedKey, 1);
  envelope.set(nonce, 1 + wrappedKey.length);
  envelope.set(ciphertext, 1 + wrappedKey.length + NONCE_LEN);

  return b64urlEncode(envelope);
}

/**
 * Fetch encryption public key from authorization server JWKS.
 *
 * @param asUrl - Authorization server base URL.
 * @param fetchFn - Optional fetch implementation (defaults to global fetch).
 * @param keyId - Optional specific key ID.
 * @returns RSA public CryptoKey.
 */
export async function fetchEncryptionKey(
  asUrl: string,
  fetchFn: typeof fetch = fetch,
  keyId?: string,
): Promise<CryptoKey> {
  const url = `${asUrl.replace(/\/+$/, '')}/.well-known/jwks.json`;
  const response = await fetchFn(url);

  if (!response.ok) {
    throw new Error(`failed to fetch JWKS from ${url}: ${response.status}`);
  }

  const jwks = (await response.json()) as { keys?: JsonWebKey[] };

  for (const key of jwks.keys ?? []) {
    if (key.kty !== 'RSA' || key.use !== 'enc') continue;
    if (keyId && key.kid !== keyId) continue;
    return jwkToPublicKey(key);
  }

  throw new Error(`no RSA encryption key found at ${url}`);
}
