import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { applyRtlPreference, getLayoutDirection } from '@/i18n/rtl';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => { });

function RootNavigationLayout() {
  const [appReady, setAppReady] = useState(false);
  const language = useAppSelector((state) => state.preferences.language);

  // Keep the native RTL flag in sync for the next launch (side effect lives here, not in the reducer).
  useEffect(() => {
    applyRtlPreference(language);
  }, [language]);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'NotoNastaliqUrdu-Regular': require('../assets/fonts/NotoNastaliqUrdu-Regular.ttf'),
          'NotoSansArabic-Regular': require('../assets/fonts/NotoSansArabic-Regular.ttf'),
        });
      } catch (err) {
        // Fonts are bundled; if loading still fails, fall back to system fonts instead of blocking the app.
        if (__DEV__) {
          console.warn('Custom font load failed, using system fonts:', (err as Error).message);
        }
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync().catch(() => { });
      }
    }

    prepare();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <View style={[styles.root, { direction: getLayoutDirection(language) }]}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <RootNavigationLayout />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
