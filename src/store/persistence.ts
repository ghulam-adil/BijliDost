import type { RootState } from './index';
import type { PreferenceStorage } from '@/services/storage/preferenceStorage';

interface ObservableStore {
  getState(): RootState;
  subscribe(listener: () => void): () => void;
}

/**
 * Saves preferences whenever the preferences slice changes (and only then).
 * Returns an unsubscribe function.
 */
export function startPreferencePersistence(
  store: ObservableStore,
  storage: PreferenceStorage
): () => void {
  let previous = store.getState().preferences;

  return store.subscribe(() => {
    const next = store.getState().preferences;
    if (next !== previous) {
      previous = next;
      void storage.save(next);
    }
  });
}
