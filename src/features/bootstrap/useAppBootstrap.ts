import { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import * as Font from 'expo-font';
import { createPreferenceStorage } from '@/services/storage/preferenceStorage';
import { preferencesKeyValueStore } from '@/services/storage/nativeAdapters';
import { startPreferencePersistence } from '@/store/persistence';
import { hydratePreferences } from '@/store/slices/preferencesSlice';
import type { RootState } from '@/store';
import { describeError, logWarn } from '@/utils/logger';

async function loadFonts(): Promise<void> {
  try {
    await Font.loadAsync({
      'NotoNastaliqUrdu-Regular': require('../../../assets/fonts/NotoNastaliqUrdu-Regular.ttf'),
      'NotoSansArabic-Regular': require('../../../assets/fonts/NotoSansArabic-Regular.ttf'),
    });
  } catch (error) {
    // Fonts are bundled; if loading still fails, fall back to system fonts instead of blocking the app.
    logWarn('Custom font load failed, using system fonts', { error: describeError(error) });
  }
}

/**
 * Loads fonts and persisted preferences before the first screen renders, so the user
 * never sees a flash of the wrong language or the onboarding screen.
 */
export function useAppBootstrap(): { isReady: boolean } {
  const store = useStore<RootState>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storage = createPreferenceStorage(preferencesKeyValueStore);
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function prepare() {
      const [saved] = await Promise.all([storage.load(), loadFonts()]);
      if (cancelled) return;
      if (saved) {
        store.dispatch(hydratePreferences(saved));
      }
      unsubscribe = startPreferencePersistence(store, storage);
      setIsReady(true);
    }

    void prepare();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [store]);

  return { isReady };
}
