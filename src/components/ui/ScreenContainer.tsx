import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  edges = ['top', 'left', 'right'],
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      <StatusBar style="dark" />
      {scrollable ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, styles.staticContent, contentContainerStyle]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.section,
  },
  staticContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
});

