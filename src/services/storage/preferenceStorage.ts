import { z } from 'zod';
import { PREFERENCES_STORAGE_KEY } from './constants';
import type { KeyValueStore } from './types';
import { describeError, logWarn } from '@/utils/logger';

/** Non-sensitive UI preferences (language, theme, ...). Stored unencrypted on purpose. */
export const PersistedPreferencesSchema = z.object({
  language: z.enum(['ur', 'ur-Latn', 'en']),
  hasCompletedOnboarding: z.boolean(),
  theme: z.enum(['system', 'light']),
  ttsSpeechRate: z.number().min(0.5).max(2),
  dueRemindersEnabled: z.boolean(),
});

export type PersistedPreferences = z.infer<typeof PersistedPreferencesSchema>;

export interface PreferenceStorage {
  /** Returns null when nothing valid is stored (first launch or corrupt data). */
  load(): Promise<PersistedPreferences | null>;
  save(preferences: PersistedPreferences): Promise<void>;
  clear(): Promise<void>;
}

export function createPreferenceStorage(store: KeyValueStore): PreferenceStorage {
  return {
    async load() {
      try {
        const raw = await store.getItem(PREFERENCES_STORAGE_KEY);
        if (raw === null) return null;
        const parsed = PersistedPreferencesSchema.safeParse(JSON.parse(raw));
        return parsed.success ? parsed.data : null;
      } catch (error) {
        logWarn('Could not load preferences', { error: describeError(error) });
        return null;
      }
    },

    async save(preferences) {
      try {
        await store.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        logWarn('Could not save preferences', { error: describeError(error) });
      }
    },

    async clear() {
      try {
        await store.removeItem(PREFERENCES_STORAGE_KEY);
      } catch (error) {
        logWarn('Could not clear preferences', { error: describeError(error) });
      }
    },
  };
}
