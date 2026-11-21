import { DATABASE_KEY_NAME } from './constants';
import { FatalSecurityError } from './errors';
import type { RandomSource, SecureKeyStore } from './types';

const KEY_BYTES = 32; // 256-bit
const KEY_HEX_PATTERN = /^[0-9a-f]{64}$/;

export type StoredKeyState =
  | { status: 'missing' }
  | { status: 'present'; key: string }
  /** A value exists but is not a valid 256-bit hex key. Never regenerate over it automatically. */
  | { status: 'malformed' };

export function isValidKeyHex(value: string): boolean {
  return KEY_HEX_PATTERN.test(value);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Owns the lifecycle of the database encryption key in the platform secure store.
 * SecureStore holds ONLY this key. Keys are never logged.
 */
export function createDatabaseKeyManager(keyStore: SecureKeyStore, random: RandomSource) {
  return {
    async read(): Promise<StoredKeyState> {
      const raw = await keyStore.getItemAsync(DATABASE_KEY_NAME);
      if (raw === null) return { status: 'missing' };
      return isValidKeyHex(raw) ? { status: 'present', key: raw } : { status: 'malformed' };
    },

    /** Generates a fresh key in memory. It is NOT persisted until database access is proven. */
    generate(): string {
      const bytes = random.getRandomBytes(KEY_BYTES);
      if (bytes.length !== KEY_BYTES) {
        throw new FatalSecurityError('Secure random source returned an unexpected length');
      }
      return toHex(bytes);
    },

    async persist(key: string): Promise<void> {
      if (!isValidKeyHex(key)) {
        throw new FatalSecurityError('Refusing to store a malformed database key');
      }
      await keyStore.setItemAsync(DATABASE_KEY_NAME, key);
    },

    async remove(): Promise<void> {
      await keyStore.deleteItemAsync(DATABASE_KEY_NAME);
    },
  };
}

export type DatabaseKeyManager = ReturnType<typeof createDatabaseKeyManager>;
