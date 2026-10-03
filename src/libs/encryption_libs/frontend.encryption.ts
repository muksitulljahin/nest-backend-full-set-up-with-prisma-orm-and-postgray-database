import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import envConfig from 'src/config/config';

const IV_LENGTH = 16;

const getEncryptionKey = () => {
  const key = envConfig.FRONT_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('❌ Missing FRONT_ENCRYPTION_KEY environment variable.');
  }
  return CryptoJS.enc.Utf8.parse(key);
};

// --- Encryption ---
export const FrontEncryptToken = (token: string): string => {
  // Generate random 16-byte IV
  const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);

  const encrypted = CryptoJS.AES.encrypt(token, getEncryptionKey(), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Combine IV + encrypted data
  const combined = iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();

  // Base64 encode
  return Buffer.from(combined).toString('base64');
};

// --- Decryption ---
export const FrontDecryptTokenx = (safeToken: string): string | null => {
  try {
    const combined = Buffer.from(safeToken, 'base64').toString('utf8');
    const [ivHex, encrypted] = combined.split(':');

    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const decrypted = CryptoJS.AES.decrypt(encrypted, getEncryptionKey(), {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  } catch (err) {
    console.error('❌ Decrypt Error:', err);
    return null;
  }
};
