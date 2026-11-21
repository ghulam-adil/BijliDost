import { DATABASE_NAME } from './constants';
import { FatalSecurityError } from './errors';
import { isValidKeyHex } from './databaseKeyManager';
import type { DatabaseKeyManager } from './databaseKeyManager';
import { runMigrations } from './migrations';
import type { SqlDatabase, SqliteDriver } from './types';

export type OpenDatabaseResult =
  | { status: 'ready'; db: SqlDatabase }
  /** Encrypted database exists but its key is gone (e.g. Android reinstall). Needs explicit user choice. */
  | { status: 'orphaned-database' }
  /** A stored key exists but cannot open the database (wrong key / corruption). Needs explicit user choice. */
  | { status: 'access-rejected' };

async function safeClose(db: SqlDatabase): Promise<void> {
  try {
    await db.closeAsync();
  } catch {
    // Closing is best effort; the original outcome is what matters.
  }
}

/** Step 2-3: SQLCipher must be active before any key or data is touched. Fails closed. */
async function assertCipherAvailable(db: SqlDatabase): Promise<void> {
  let version: unknown;
  try {
    const row = await db.getFirstAsync<{ cipher_version?: unknown }>('PRAGMA cipher_version;');
    version = row?.cipher_version;
  } catch {
    throw new FatalSecurityError('SQLCipher unavailable');
  }
  if (typeof version !== 'string' || version.trim() === '') {
    throw new FatalSecurityError('SQLCipher unavailable');
  }
}

/** Step 5: prove the key opens the database by reading the schema. */
async function canReadSchema(db: SqlDatabase): Promise<boolean> {
  try {
    await db.getFirstAsync<{ n: number }>('SELECT count(*) AS n FROM sqlite_master;');
    return true;
  } catch {
    return false;
  }
}

/**
 * Mandatory fail-closed initialisation sequence:
 *  1. open  2. PRAGMA cipher_version  3. halt if SQLCipher is not active
 *  4. PRAGMA key (raw 256-bit hex)    5. verify access  6. persist a NEW key only after access is proven
 *  7. run migrations.
 * Never falls back to unencrypted SQLite and never deletes or overwrites an unreadable database.
 */
export async function openEncryptedDatabase(deps: {
  driver: SqliteDriver;
  keys: DatabaseKeyManager;
}): Promise<OpenDatabaseResult> {
  const { driver, keys } = deps;

  const stored = await keys.read();
  if (stored.status === 'malformed') {
    return { status: 'access-rejected' };
  }

  const key = stored.status === 'present' ? stored.key : keys.generate();
  if (!isValidKeyHex(key)) {
    throw new FatalSecurityError('Invalid database key');
  }

  const db = await driver.openDatabaseAsync(DATABASE_NAME);
  try {
    await assertCipherAvailable(db);

    // The key is validated hex, so interpolation cannot inject SQL (PRAGMA does not accept bound params).
    await db.execAsync(`PRAGMA key = "x'${key}'";`);

    if (!(await canReadSchema(db))) {
      await safeClose(db);
      return stored.status === 'missing'
        ? { status: 'orphaned-database' }
        : { status: 'access-rejected' };
    }

    if (stored.status === 'missing') {
      await keys.persist(key);
    }

    await runMigrations(db);
    return { status: 'ready', db };
  } catch (error) {
    await safeClose(db);
    throw error;
  }
}
