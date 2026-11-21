import { StorageIntegrityError } from './errors';
import type { SqlDatabase } from './types';

/**
 * Ordered, append-only schema migrations. Index N upgrades schema version N -> N+1.
 * Never edit a released migration; add a new one.
 */
export const MIGRATIONS: ReadonlyArray<readonly string[]> = [
  [
    `CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY NOT NULL,
      provider_id TEXT NOT NULL,
      consumer_reference TEXT NOT NULL,
      billing_month TEXT NOT NULL,
      due_date TEXT NOT NULL,
      units_kwh REAL NOT NULL,
      amount_within_due_date REAL NOT NULL,
      amount_after_due_date REAL NOT NULL,
      meter_number TEXT,
      tariff_category TEXT,
      line_items_json TEXT NOT NULL,
      unclassified_line_items_json TEXT NOT NULL,
      is_paid INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_bills_identity
      ON bills (provider_id, consumer_reference, billing_month);`,
    `CREATE INDEX IF NOT EXISTS idx_bills_month
      ON bills (billing_month DESC, created_at DESC);`,
  ],
];

export const LATEST_SCHEMA_VERSION = MIGRATIONS.length;

export async function runMigrations(db: SqlDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  const current = row?.user_version ?? 0;

  if (current > LATEST_SCHEMA_VERSION) {
    // Data written by a newer app version. Never downgrade or touch it.
    throw new StorageIntegrityError('Database schema is newer than this app version');
  }

  for (let version = current; version < LATEST_SCHEMA_VERSION; version += 1) {
    const statements = MIGRATIONS[version];
    if (!statements) {
      throw new StorageIntegrityError('Missing database migration');
    }
    await db.withTransactionAsync(async () => {
      for (const statement of statements) {
        await db.execAsync(statement);
      }
      await db.execAsync(`PRAGMA user_version = ${version + 1};`);
    });
  }
}
