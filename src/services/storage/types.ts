import type { StoredBill } from './billRecord';

export type SqlValue = string | number | null;

/** Minimal subset of expo-sqlite's database used by this app (keeps services testable in Node). */
export interface SqlDatabase {
  execAsync(sql: string): Promise<void>;
  getFirstAsync<T>(sql: string, params?: readonly SqlValue[]): Promise<T | null>;
  getAllAsync<T>(sql: string, params?: readonly SqlValue[]): Promise<T[]>;
  runAsync(sql: string, params?: readonly SqlValue[]): Promise<void>;
  /** Single-connection transaction. Never use exclusive transactions: they open an un-keyed connection. */
  withTransactionAsync(task: () => Promise<void>): Promise<void>;
  closeAsync(): Promise<void>;
}

export interface SqliteDriver {
  openDatabaseAsync(name: string): Promise<SqlDatabase>;
  deleteDatabaseAsync(name: string): Promise<void>;
}

export interface SecureKeyStore {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

export interface RandomSource {
  getRandomBytes(byteCount: number): Uint8Array;
}

/** Async key-value storage for NON-sensitive data only (preferences). */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface BillRepository {
  /** Newest billing month first. */
  list(): Promise<StoredBill[]>;
  getById(id: string): Promise<StoredBill | null>;
  /** Insert, or update the same provider + consumer + billing month while preserving id, createdAt and paid state. */
  save(bill: StoredBill): Promise<void>;
  setPaid(id: string, isPaid: boolean): Promise<void>;
  remove(id: string): Promise<void>;
}
