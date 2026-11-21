import type {
  RandomSource,
  SecureKeyStore,
  SqlDatabase,
  SqliteDriver,
  SqlValue,
} from '../types';
import { DATABASE_KEY_NAME } from '../constants';

export type CipherBehaviour = string | null | 'throw';

export interface FakeWorld {
  /** Ordered log of everything observable: SQL, key store writes, file deletes, closes. */
  events: string[];
  /** Key the on-disk database file is encrypted with. null = no file / empty file. */
  fileKey: string | null;
  cipher: CipherBehaviour;
  userVersion: number;
  secrets: Map<string, string>;
  opened: number;
}

export function createWorld(overrides: Partial<FakeWorld> = {}): FakeWorld {
  return {
    events: [],
    fileKey: null,
    cipher: '4.6.1 community',
    userVersion: 0,
    secrets: new Map(),
    opened: 0,
    ...overrides,
  };
}

export function hex(char: string): string {
  return char.repeat(64);
}

class FakeDb implements SqlDatabase {
  private appliedKey: string | null = null;

  constructor(private readonly world: FakeWorld) {}

  private canRead(): boolean {
    return this.world.fileKey === null || this.world.fileKey === this.appliedKey;
  }

  async execAsync(sql: string): Promise<void> {
    const keyMatch = /PRAGMA key = "x'([0-9a-f]+)'"/.exec(sql);
    if (keyMatch) {
      this.appliedKey = keyMatch[1] ?? null;
      this.world.events.push('sql:PRAGMA key');
      return;
    }
    const versionMatch = /PRAGMA user_version = (\d+)/.exec(sql);
    if (versionMatch) {
      this.world.userVersion = Number(versionMatch[1]);
      this.world.events.push(`sql:user_version=${versionMatch[1]}`);
      return;
    }
    // Any other write creates / modifies the encrypted file with the applied key.
    if (this.world.fileKey === null) this.world.fileKey = this.appliedKey;
    this.world.events.push(`sql:${sql.trim().split(/\s+/).slice(0, 3).join(' ')}`);
  }

  async getFirstAsync<T>(sql: string, _params?: readonly SqlValue[]): Promise<T | null> {
    if (sql.includes('cipher_version')) {
      this.world.events.push('sql:PRAGMA cipher_version');
      if (this.world.cipher === 'throw') throw new Error('no such pragma');
      return (this.world.cipher === null ? null : { cipher_version: this.world.cipher }) as T | null;
    }
    if (sql.includes('sqlite_master')) {
      this.world.events.push('sql:read schema');
      if (!this.canRead()) throw new Error('file is not a database');
      return { n: 0 } as T;
    }
    if (sql.includes('user_version')) {
      return { user_version: this.world.userVersion } as T;
    }
    return null;
  }

  async getAllAsync<T>(): Promise<T[]> {
    return [];
  }

  async runAsync(): Promise<void> {}

  async withTransactionAsync(task: () => Promise<void>): Promise<void> {
    this.world.events.push('tx:begin');
    await task();
    this.world.events.push('tx:commit');
  }

  async closeAsync(): Promise<void> {
    this.world.events.push('close');
  }
}

export function createFakeDriver(world: FakeWorld): SqliteDriver {
  return {
    async openDatabaseAsync() {
      world.opened += 1;
      world.events.push('open');
      return new FakeDb(world);
    },
    async deleteDatabaseAsync() {
      world.events.push('db:delete');
      world.fileKey = null;
    },
  };
}

export function createFakeKeyStore(world: FakeWorld): SecureKeyStore {
  return {
    async getItemAsync(key) {
      return world.secrets.get(key) ?? null;
    },
    async setItemAsync(key, value) {
      world.events.push('key:set');
      world.secrets.set(key, value);
    },
    async deleteItemAsync(key) {
      world.events.push('key:delete');
      world.secrets.delete(key);
    },
  };
}

export function createFakeRandom(byte = 0xab): RandomSource {
  return { getRandomBytes: (count) => new Uint8Array(count).fill(byte) };
}

/** Key produced by createFakeRandom() with its default byte (0xab). */
export const FRESH_KEY = 'ab'.repeat(32);
export { DATABASE_KEY_NAME };
