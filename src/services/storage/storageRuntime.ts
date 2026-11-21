import { createStorageService } from './storageService';
import {
  isNativeStorageSupported,
  nativeKeyStore,
  nativeRandom,
  nativeSqliteDriver,
} from './nativeAdapters';

/** App-wide storage service bound to the real native modules. */
export const storageService = createStorageService({
  driver: nativeSqliteDriver,
  keyStore: nativeKeyStore,
  random: nativeRandom,
  isSupported: isNativeStorageSupported,
});
