import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { store } from '@/store';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

SplashScreen.preventAutoHideAsync().catch(() => { });

function RootNavigationLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Attempt to load Noto fonts if present in assets
        await Font.loadAsync({
          'NotoNastaliqUrdu-Regular': require('../assets/fonts/NotoNastaliqUrdu-Regular.ttf'),
          'NotoSansArabic-Regular': require('../assets/fonts/NotoSansArabic-Regular.ttf'),
        }).catch((err) => {
          // If font files are not yet placed on disk, gracefully use system fallbacks
          if (__DEV__) {
            console.log('Custom fonts fallback to system font:', err.message);
          }
        });
      } catch (e) {
        // Fallback
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync().catch(() => { });
      }
    }

    prepare();
  }, []);

  return (
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
