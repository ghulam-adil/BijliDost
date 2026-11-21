import { DATABASE_NAME } from './constants';
import { createDatabaseKeyManager } from './databaseKeyManager';
import { openEncryptedDatabase } from './encryptedBillDatabase';
import { createSqliteBillRepository } from './sqliteBillRepository';
import type { BillRepository, RandomSource, SecureKeyStore, SqlDatabase, SqliteDriver } from './types';
import { describeError, logWarn } from '@/utils/logger';

export type StorageBootstrapResult =
  | { status: 'ready'; repository: BillRepository }
  /** Platform has no encrypted storage (e.g. web). The app runs without saving bills. */
  | { status: 'unsupported' }
  /** Needs an explicit user decision before anything is erased. */
  | { status: 'recovery'; reason: 'orphaned-database' | 'access-rejected' }
  /** Encrypted storage cannot be guaranteed. Block bill storage entirely. */
  | { status: 'fatal' };

export interface StorageService {
  bootstrap(): Promise<StorageBootstrapResult>;
  /** Deletes the database file, then the key. Never called without explicit user confirmation. */
  eraseAll(): Promise<void>;
}

export interface StorageServiceDeps {
  driver: SqliteDriver;
  keyStore: SecureKeyStore;
  random: RandomSource;
  isSupported: boolean;
}

const MISSING_FILE_PATTERN = /not exist|no such file|enoent|not found/i;

async function closeQuietly(db: SqlDatabase | null): Promise<void> {
  if (!db) return;
  try {
    await db.closeAsync();
  } catch {
    // already closed
  }
}

export function createStorageService(deps: StorageServiceDeps): StorageService {
  const keys = createDatabaseKeyManager(deps.keyStore, deps.random);
  let openDb: SqlDatabase | null = null;

  return {
    async bootstrap() {
      if (!deps.isSupported) {
        return { status: 'unsupported' };
      }

      await closeQuietly(openDb);
      openDb = null;

      try {
        const result = await openEncryptedDatabase({ driver: deps.driver, keys });
        if (result.status === 'ready') {
          openDb = result.db;
          return { status: 'ready', repository: createSqliteBillRepository(result.db) };
        }
        return { status: 'recovery', reason: result.status };
      } catch (error) {
        logWarn('Encrypted storage initialisation failed', { error: describeError(error) });
        return { status: 'fatal' };
      }
    },

    async eraseAll() {
      await closeQuietly(openDb);
      openDb = null;

      // Database first: if we are interrupted afterwards the key still opens a fresh database.
      try {
        await deps.driver.deleteDatabaseAsync(DATABASE_NAME);
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (!MISSING_FILE_PATTERN.test(message)) {
          throw error;
        }
      }
      await keys.remove();
    },
  };
}
