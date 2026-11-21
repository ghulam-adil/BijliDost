import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SupportedLanguage } from '@/i18n/rtl';
import type { PersistedPreferences } from '@/services/storage/preferenceStorage';

export type PreferencesState = PersistedPreferences;

export const initialPreferencesState: PreferencesState = {
  language: 'ur', // Default Urdu-first
  hasCompletedOnboarding: false,
  theme: 'system',
  ttsSpeechRate: 1.0,
  dueRemindersEnabled: true,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: initialPreferencesState,
  reducers: {
    /** Replaces state with validated persisted preferences at startup. */
    hydratePreferences: (_state, action: PayloadAction<PreferencesState>) => action.payload,
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.language = action.payload;
    },
    completeOnboarding: (state) => {
      state.hasCompletedOnboarding = true;
    },
    resetOnboarding: (state) => {
      state.hasCompletedOnboarding = false;
    },
    setTheme: (state, action: PayloadAction<'system' | 'light'>) => {
      state.theme = action.payload;
    },
    setTtsSpeechRate: (state, action: PayloadAction<number>) => {
      state.ttsSpeechRate = action.payload;
    },
    toggleDueReminders: (state) => {
      state.dueRemindersEnabled = !state.dueRemindersEnabled;
    },
  },
});

export const {
  hydratePreferences,
  setLanguage,
  completeOnboarding,
  resetOnboarding,
  setTheme,
  setTtsSpeechRate,
  toggleDueReminders,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;

