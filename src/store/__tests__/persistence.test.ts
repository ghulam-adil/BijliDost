import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer, { hydratePreferences, setLanguage } from '../slices/preferencesSlice';
import billsReducer, { addBill } from '../slices/billsSlice';
import { startPreferencePersistence } from '../persistence';
import type { PreferenceStorage, PersistedPreferences } from '@/services/storage/preferenceStorage';
import type { RootState } from '../index';

function setup() {
  const store = configureStore({ reducer: { preferences: preferencesReducer, bills: billsReducer } });
  const save = jest.fn<Promise<void>, [PersistedPreferences]>(async () => {});
  const storage: PreferenceStorage = { load: async () => null, save, clear: async () => {} };
  const stop = startPreferencePersistence(
    store as unknown as { getState(): RootState; subscribe(l: () => void): () => void },
    storage
  );
  return { store, save, stop };
}

describe('startPreferencePersistence', () => {
  it('saves the new preferences whenever they change', () => {
    const { store, save } = setup();
    store.dispatch(setLanguage('en'));
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0]?.[0].language).toBe('en');
  });

  it('does not save when unrelated state changes', () => {
    const { store, save } = setup();
    store.dispatch(
      addBill({
        id: 'a', providerId: 'kelectric', billingMonth: '2026-10', dueDate: '2026-11-18',
        unitsKwh: 1, amountWithinDueDate: 1, amountAfterDueDate: 1, isPaid: false, status: 'unverified',
      })
    );
    expect(save).not.toHaveBeenCalled();
  });

  it('stops saving after unsubscribe', () => {
    const { store, save, stop } = setup();
    stop();
    store.dispatch(setLanguage('ur-Latn'));
    expect(save).not.toHaveBeenCalled();
  });

  it('hydratePreferences replaces state with the persisted values', () => {
    const { store } = setup();
    store.dispatch(
      hydratePreferences({
        language: 'en', hasCompletedOnboarding: true, theme: 'light', ttsSpeechRate: 1.5, dueRemindersEnabled: false,
      })
    );
    expect(store.getState().preferences.hasCompletedOnboarding).toBe(true);
    expect(store.getState().preferences.language).toBe('en');
  });
});
