import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  KeyValueStore,
  RandomSource,
  SecureKeyStore,
  SqlDatabase,
  SqlValue,
  SqliteDriver,
} from './types';

/** Thin wrappers binding the injected storage interfaces to the real native modules. */

function wrapDatabase(db: SQLite.SQLiteDatabase): SqlDatabase {
  return {
    execAsync: (sql) => db.execAsync(sql),
    getFirstAsync: <T>(sql: string, params: readonly SqlValue[] = []) =>
      db.getFirstAsync<T>(sql, [...params]),
    getAllAsync: <T>(sql: string, params: readonly SqlValue[] = []) =>
      db.getAllAsync<T>(sql, [...params]),
    runAsync: async (sql, params = []) => {
      await db.runAsync(sql, [...params]);
    },
    withTransactionAsync: (task) => db.withTransactionAsync(task),
    closeAsync: () => db.closeAsync(),
  };
}

export const nativeSqliteDriver: SqliteDriver = {
  openDatabaseAsync: async (name) => wrapDatabase(await SQLite.openDatabaseAsync(name)),
  deleteDatabaseAsync: (name) => SQLite.deleteDatabaseAsync(name),
};

export const nativeKeyStore: SecureKeyStore = {
  getItemAsync: (key) => SecureStore.getItemAsync(key),
  // Device-only: the key must never be restored onto another device from a backup.
  setItemAsync: (key, value) =>
    SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    }),
  deleteItemAsync: (key) => SecureStore.deleteItemAsync(key),
};

export const nativeRandom: RandomSource = {
  getRandomBytes: (byteCount) => Crypto.getRandomBytes(byteCount),
};

export const generateId = (): string => Crypto.randomUUID();

/** SQLCipher is available on Android and iOS development/production builds only (not web, not Expo Go). */
export const isNativeStorageSupported = Platform.OS === 'android' || Platform.OS === 'ios';

/** Unencrypted storage: non-sensitive preferences ONLY. */
export const preferencesKeyValueStore: KeyValueStore = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};
