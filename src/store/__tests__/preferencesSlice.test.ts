import preferencesReducer, {
  setLanguage,
  completeOnboarding,
  resetOnboarding,
  setTheme,
} from '../slices/preferencesSlice';

describe('Preferences Redux Slice', () => {
  const initial = {
    language: 'ur' as const,
    hasCompletedOnboarding: false,
    theme: 'system' as const,
    ttsSpeechRate: 1.0,
    dueRemindersEnabled: true,
  };

  it('should default to Urdu-first with onboarding incomplete', () => {
    const state = preferencesReducer(undefined, { type: 'unknown' });
    expect(state.language).toBe('ur');
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('should handle setLanguage to Roman Urdu and English', () => {
    let state = preferencesReducer(initial, setLanguage('ur-Latn'));
    expect(state.language).toBe('ur-Latn');

    state = preferencesReducer(state, setLanguage('en'));
    expect(state.language).toBe('en');
  });

  it('should keep setLanguage a pure reducer (no native RTL side effect)', () => {
    const { I18nManager } = jest.requireActual('react-native');
    const forceRTL = jest.spyOn(I18nManager, 'forceRTL');
    preferencesReducer(initial, setLanguage('en'));
    expect(forceRTL).not.toHaveBeenCalled();
    forceRTL.mockRestore();
  });

  it('should handle completeOnboarding and resetOnboarding', () => {
    let state = preferencesReducer(initial, completeOnboarding());
    expect(state.hasCompletedOnboarding).toBe(true);

    state = preferencesReducer(state, resetOnboarding());
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('should handle setTheme', () => {
    const state = preferencesReducer(initial, setTheme('light'));
    expect(state.theme).toBe('light');
  });
});

