import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { store } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { applyRtlPreference, getLayoutDirection } from '@/i18n/rtl';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useAppBootstrap } from '@/features/bootstrap/useAppBootstrap';
import { StorageProvider } from '@/features/storage/StorageProvider';
import { StorageGate } from '@/features/storage/StorageGate';

SplashScreen.preventAutoHideAsync().catch(() => { });

function RootNavigationLayout() {
  const { isReady } = useAppBootstrap();
  const language = useAppSelector((state) => state.preferences.language);

  // Keep the native RTL flag in sync for the next launch (side effect lives here, not in the reducer).
  useEffect(() => {
    applyRtlPreference(language);
  }, [language]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => { });
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View style={[styles.root, { direction: getLayoutDirection(language) }]}>
      <StorageProvider>
        <StorageGate>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="settings" />
          </Stack>
        </StorageGate>
      </StorageProvider>
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
