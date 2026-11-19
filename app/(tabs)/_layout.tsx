import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { resolveTextStyle } from '@/theme/typography';
import { useTranslation } from '@/store/hooks';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';

export default function TabLayout() {
  const { t, language } = useTranslation();
  const insets = useSafeAreaInsets();

  // Provide generous clearance above the Android 3-button navigation bar & accommodate Urdu descenders
  const bottomPadding = Math.max(insets.bottom + 8, Platform.OS === 'android' ? 24 : 14);
  const tabHeight = 64 + bottomPadding;
  const labelTypography = resolveTextStyle(language === 'ur' ? 'urdu' : 'latin', 'caption');

  const renderIcon = (glyph: string) =>
    function TabIcon({ focused }: { focused: boolean }) {
      return <DecorativeIcon glyph={glyph} size={22} style={focused ? styles.iconOn : styles.iconOff} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandPrimary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: tabHeight,
          backgroundColor: Colors.bgSurface,
          borderTopColor: Colors.borderDefault,
          borderTopWidth: 1,
          paddingBottom: bottomPadding,
          paddingTop: 8,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          ...labelTypography,
          fontWeight: '600',
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home'), tabBarIcon: renderIcon('🏠') }} />
      <Tabs.Screen name="scan" options={{ title: t('tabs.scan'), tabBarIcon: renderIcon('📷') }} />
      <Tabs.Screen name="history" options={{ title: t('tabs.history'), tabBarIcon: renderIcon('📑') }} />
      <Tabs.Screen name="complaints" options={{ title: t('tabs.complaints'), tabBarIcon: renderIcon('ℹ️') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconOn: { opacity: 1 },
  iconOff: { opacity: 0.55 },
});
