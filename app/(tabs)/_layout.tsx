import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, TouchTargets } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';
import { useTranslation } from '@/store/hooks';

export default function TabLayout() {
  const { t, language } = useTranslation();
  const isUrdu = language === 'ur';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brandPrimary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          height: TouchTargets.tabBarHeight,
          backgroundColor: Colors.bgSurface,
          borderTopColor: Colors.borderDefault,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
          paddingTop: Spacing.sm,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          fontFamily: isUrdu ? FontFamilies.urduSans : FontFamilies.latinSans,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: t('tabs.scan'),
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📷</Text>,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📑</Text>,
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: t('tabs.complaints'),
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>ℹ️</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

