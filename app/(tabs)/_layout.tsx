import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { FontFamilies } from '@/theme/fonts';
import { useTranslation } from '@/store/hooks';

export default function TabLayout() {
  const { t, language } = useTranslation();
  const insets = useSafeAreaInsets();
  const isUrdu = language === 'ur';

  // Provide generous clearance above the Android 3-button navigation bar & accommodate Urdu descenders
  const bottomPadding = Math.max(insets.bottom + 8, Platform.OS === 'android' ? 24 : 14);
  const tabHeight = 64 + bottomPadding;

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
          fontSize: 12,
          lineHeight: 18,
          fontWeight: '600',
          fontFamily: isUrdu ? FontFamilies.urduSans : FontFamilies.latinSans,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.55 }]}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('tabs.scan'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.55 }]}>📷</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.55 }]}>📑</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: t('tabs.complaints'),
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.55 }]}>ℹ️</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
});

