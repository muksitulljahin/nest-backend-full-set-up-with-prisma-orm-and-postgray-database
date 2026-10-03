import * as crypto from 'crypto';
import { Buffer } from 'buffer';
import envConfig from 'src/config/config';

// --- Constants ---
const ENCRYPTION_KEY_GET = envConfig.ENCRYPTION_KEY; // Must be 32 bytes (256 bits for AES-256)

if (!ENCRYPTION_KEY_GET)
  throw new Error('❌ Missing ENCRYPTION_KEY environment variable.');

const ENCRYPTION_KEY: string = ENCRYPTION_KEY_GET;
const IV_LENGTH: number = 16; // AES Initialization Vector (IV) length

// --- Key Safety Check ---
if (Buffer.byteLength(ENCRYPTION_KEY, 'utf8') !== 32) {
  console.warn(
    '⚠️ WARNING: ENCRYPTION_KEY must be exactly 32 bytes for aes-256-cbc. Please set process.env.ENCRYPTION_KEY.',
  );
}

// --- Encryption Function ---

/**
 * 🔐 Encrypts a plain token (e.g., JWT) using AES-256-CBC, combines it with the IV,
 * and base64-encodes the result to make it safe for HTTP transmission.
 * @param token The raw token string to encrypt.
 * @returns The base64-encoded safe token string.
 */
export const encryptToken = (token: string): string => {
  // Generate random Initialization Vector (IV)
  const iv: Buffer = crypto.randomBytes(IV_LENGTH);

  // ✅ FIX: Using ReturnType<typeof ...> for universal type resolution
  const cipher: ReturnType<typeof crypto.createCipheriv> =
    crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY, 'utf8'),
      iv,
    );

  // Encrypt the token
  let encrypted: string = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Combine IV (in hex) and encrypted data (IV:EncryptedData)
  const combined: string = iv.toString('hex') + ':' + encrypted;

  // Base64 encode the combined string to make it safe for headers/cookies
  const safeToken: string = Buffer.from(combined).toString('base64');

  return safeToken;
};

// --- Decryption Function ---

/**
 * 🔓 Decrypts a base64-encoded safe token back into the original token string.
 * @param safeToken The base64-encoded, encrypted token (IV:EncryptedData).
 * @returns The original decrypted token string, or null on error (e.g., invalid token).
 */
export const decryptToken = (safeToken: string): string | null => {
  try {
    // Decode base64 back to the combined IV:EncryptedData string
    const combined: string = Buffer.from(safeToken, 'base64').toString('utf8');

    // Split into IV and encrypted data
    const [ivHex, encryptedHex] = combined.split(':');

    if (!ivHex || !encryptedHex) {
      throw new Error('Invalid token format (missing IV or encrypted data)');
    }

    const iv: Buffer = Buffer.from(ivHex, 'hex');

    // ✅ FIX: Using ReturnType<typeof ...> for universal type resolution
    const decipher: ReturnType<typeof crypto.createDecipheriv> =
      crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY, 'utf8'),
        iv,
      );

    // Decrypt the data
    let decrypted: string = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Robust error handling to catch issues like invalid base64 or corrupt decryption
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown decryption error';
    console.error('Decrypt Error:', errorMessage);

    // Return null on failure for predictable error handling in calling code
    return null;
  }
};
