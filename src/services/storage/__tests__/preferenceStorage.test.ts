import { createPreferenceStorage, PersistedPreferences } from '../preferenceStorage';
import { PREFERENCES_STORAGE_KEY } from '../constants';
import type { KeyValueStore } from '../types';

function memoryStore(initial: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => { data.set(key, value); },
    removeItem: async (key) => { data.delete(key); },
  };
}

const prefs: PersistedPreferences = {
  language: 'en',
  hasCompletedOnboarding: true,
  theme: 'light',
  ttsSpeechRate: 1.2,
  dueRemindersEnabled: false,
};

describe('preferenceStorage', () => {
  it('returns null on first launch', async () => {
    expect(await createPreferenceStorage(memoryStore()).load()).toBeNull();
  });

  it('round-trips saved preferences', async () => {
    const storage = createPreferenceStorage(memoryStore());
    await storage.save(prefs);
    expect(await storage.load()).toEqual(prefs);
  });

  it.each([
    ['invalid JSON', '{oops'],
    ['wrong language', JSON.stringify({ ...prefs, language: 'fr' })],
    ['out-of-range speech rate', JSON.stringify({ ...prefs, ttsSpeechRate: 9 })],
    ['missing fields', JSON.stringify({ language: 'ur' })],
  ])('ignores corrupt stored data (%s) and falls back to defaults', async (_label, raw) => {
    const storage = createPreferenceStorage(memoryStore({ [PREFERENCES_STORAGE_KEY]: raw }));
    expect(await storage.load()).toBeNull();
  });

  it('never throws when the underlying store fails', async () => {
    const failing: KeyValueStore = {
      getItem: async () => { throw new Error('boom'); },
      setItem: async () => { throw new Error('boom'); },
      removeItem: async () => { throw new Error('boom'); },
    };
    const storage = createPreferenceStorage(failing);
    expect(await storage.load()).toBeNull();
    await expect(storage.save(prefs)).resolves.toBeUndefined();
    await expect(storage.clear()).resolves.toBeUndefined();
  });

  it('stores nothing but the preference keys (no bill data)', async () => {
    const store = memoryStore();
    await createPreferenceStorage(store).save(prefs);
    expect(Object.keys(JSON.parse(store.data.get(PREFERENCES_STORAGE_KEY) ?? '{}')).sort()).toEqual(
      ['dueRemindersEnabled', 'hasCompletedOnboarding', 'language', 'theme', 'ttsSpeechRate']
    );
  });
});
