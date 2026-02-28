/**
 * Tests for credential encryption (envelope v1 format).
 * Port of: dedalus-sdk-python/tests/test_encryption.py
 */

import {
  jwkToPublicKey,
  encryptCredentials,
  b64urlEncode,
  b64urlDecode,
  ENVELOPE_VERSION,
  NONCE_LEN,
} from '../../../src/lib/crypto/encryption';

const TAG_LEN = 16;

const RSA_ALGORITHM = { name: 'RSA-OAEP', hash: 'SHA-256' } as const;

// --- Test helpers ---

let privateKey2048: CryptoKey;
let publicKey2048: CryptoKey;
let jwk2048: JsonWebKey;
let privateKey3072: CryptoKey;
let publicKey3072: CryptoKey;

async function decryptEnvelopeV1(privKey: CryptoKey, envelope: Uint8Array, keySize: number): Promise<Uint8Array> {
  const keySizeBytes = keySize / 8;

  expect(envelope[0]).toBe(ENVELOPE_VERSION);

  const wrappedKey = envelope.slice(1, 1 + keySizeBytes);
  const nonce = envelope.slice(1 + keySizeBytes, 1 + keySizeBytes + NONCE_LEN);
  const ciphertextWithTag = envelope.slice(1 + keySizeBytes + NONCE_LEN);

  const aesKeyRaw = await crypto.subtle.decrypt(RSA_ALGORITHM, privKey, wrappedKey);
  const aesKey = await crypto.subtle.importKey('raw', aesKeyRaw, { name: 'AES-GCM' }, false, ['decrypt']);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, aesKey, ciphertextWithTag);

  return new Uint8Array(plaintext);
}

beforeAll(async () => {
  // Generate 2048-bit keypair
  const kp2048 = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
  privateKey2048 = kp2048.privateKey;
  publicKey2048 = kp2048.publicKey;
  jwk2048 = await crypto.subtle.exportKey('jwk', publicKey2048);

  // Generate 3072-bit keypair
  const kp3072 = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 3072, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['encrypt', 'decrypt'],
  );
  privateKey3072 = kp3072.privateKey;
  publicKey3072 = kp3072.publicKey;
});

// --- TestJwkToPublicKey ---

describe('TestJwkToPublicKey', () => {
  test('valid JWK converts to public key', async () => {
    const key = await jwkToPublicKey(jwk2048);
    expect(key).toBeInstanceOf(CryptoKey);
    expect(key.algorithm.name).toBe('RSA-OAEP');
    // Verify by roundtrip: encrypt with imported key, decrypt with known private key
    const ct = await encryptCredentials(key, { test: 'value' });
    const envelope = b64urlDecode(ct);
    const pt = await decryptEnvelopeV1(privateKey2048, envelope, 2048);
    expect(JSON.parse(new TextDecoder().decode(pt))).toEqual({ test: 'value' });
  });

  test('wrong kty raises error', async () => {
    await expect(jwkToPublicKey({ kty: 'EC', n: 'xxx', e: 'xxx' })).rejects.toThrow('expected RSA key type');
  });

  test('missing n field raises error', async () => {
    const badJwk = { ...jwk2048 };
    delete badJwk.n;
    await expect(jwkToPublicKey(badJwk)).rejects.toThrow('missing required JWK field');
  });

  test('small key rejected below minimum', async () => {
    // Create a fake JWK with a small n (128 bytes = 1024 bits)
    const smallN = b64urlEncode(new Uint8Array(128));
    const smallJwk: JsonWebKey = { kty: 'RSA', n: smallN, e: jwk2048.e };
    await expect(jwkToPublicKey(smallJwk, 2048)).rejects.toThrow('below minimum');
  });
});

// --- TestEncryptCredentials ---

describe('TestEncryptCredentials', () => {
  test('produces valid envelope v1 format', async () => {
    const credentials = { token: 'ghp_xxx123' };
    const ctB64 = await encryptCredentials(publicKey2048, credentials);
    const envelope = b64urlDecode(ctB64);

    const keySizeBytes = 2048 / 8;
    const minLen = 1 + keySizeBytes + NONCE_LEN + TAG_LEN;
    expect(envelope.length).toBeGreaterThanOrEqual(minLen);
    expect(envelope[0]).toBe(ENVELOPE_VERSION);
  });

  test('roundtrip encrypt then decrypt', async () => {
    const credentials = { api_key: 'sk_test_123', org_id: 'org_456' };
    const ctB64 = await encryptCredentials(publicKey2048, credentials);
    const envelope = b64urlDecode(ctB64);
    const plaintext = await decryptEnvelopeV1(privateKey2048, envelope, 2048);
    expect(JSON.parse(new TextDecoder().decode(plaintext))).toEqual(credentials);
  });

  test('large payload exceeding RSA block', async () => {
    const credentials = { large_token: 'x'.repeat(1000), another: 'y'.repeat(500) };
    const ctB64 = await encryptCredentials(publicKey2048, credentials);
    const envelope = b64urlDecode(ctB64);
    const plaintext = await decryptEnvelopeV1(privateKey2048, envelope, 2048);
    expect(JSON.parse(new TextDecoder().decode(plaintext))).toEqual(credentials);
  });

  test('same plaintext produces different ciphertext', async () => {
    const credentials = { token: 'same_value' };
    const ct1 = await encryptCredentials(publicKey2048, credentials);
    const ct2 = await encryptCredentials(publicKey2048, credentials);
    expect(ct1).not.toBe(ct2);
  });

  test('works with 3072-bit keys', async () => {
    const credentials = { token: 'production_token' };
    const ctB64 = await encryptCredentials(publicKey3072, credentials);
    const envelope = b64urlDecode(ctB64);
    const plaintext = await decryptEnvelopeV1(privateKey3072, envelope, 3072);
    expect(JSON.parse(new TextDecoder().decode(plaintext))).toEqual(credentials);
  });
});

// --- TestSecurityInvariants ---

describe('TestSecurityInvariants', () => {
  test('plaintext not in ciphertext', async () => {
    const secret = 'ghp_super_secret_token_12345';
    const ciphertext = await encryptCredentials(publicKey2048, { token: secret });
    expect(ciphertext).not.toContain(secret);
    expect(ciphertext).not.toContain('ghp_');
  });

  test('wrong key fails decryption', async () => {
    const attackerKp = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['encrypt', 'decrypt'],
    );

    const ctB64 = await encryptCredentials(publicKey2048, { token: 'secret' });
    const envelope = b64urlDecode(ctB64);

    await expect(decryptEnvelopeV1(attackerKp.privateKey, envelope, 2048)).rejects.toThrow();
  });

  test('tampered ciphertext fails GCM auth', async () => {
    const ctB64 = await encryptCredentials(publicKey2048, { token: 'test' });
    const envelope = new Uint8Array(b64urlDecode(ctB64));

    // Tamper with ciphertext portion
    const keySizeBytes = 2048 / 8;
    envelope[1 + keySizeBytes + NONCE_LEN + 5] ^= 0xff;

    await expect(decryptEnvelopeV1(privateKey2048, envelope, 2048)).rejects.toThrow();
  });

  test('tampered wrapped key fails', async () => {
    const ctB64 = await encryptCredentials(publicKey2048, { token: 'test' });
    const envelope = new Uint8Array(b64urlDecode(ctB64));

    // Tamper with wrapped key at offset 10
    envelope[10] ^= 0xff;

    await expect(decryptEnvelopeV1(privateKey2048, envelope, 2048)).rejects.toThrow();
  });
});
