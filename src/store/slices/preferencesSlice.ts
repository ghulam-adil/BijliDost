import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportedLanguage, applyRtlPreference } from '@/i18n/rtl';

export interface PreferencesState {
  language: SupportedLanguage;
  hasCompletedOnboarding: boolean;
  theme: 'system' | 'light';
  ttsSpeechRate: number;
  dueRemindersEnabled: boolean;
}

const initialState: PreferencesState = {
  language: 'ur', // Default Urdu-first
  hasCompletedOnboarding: false,
  theme: 'system',
  ttsSpeechRate: 1.0,
  dueRemindersEnabled: true,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.language = action.payload;
      applyRtlPreference(action.payload);
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
  setLanguage,
  completeOnboarding,
  resetOnboarding,
  setTheme,
  setTtsSpeechRate,
  toggleDueReminders,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;

