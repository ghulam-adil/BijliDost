import React from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, TouchTargets } from '@/theme/spacing';
import type { TextScript } from '@/theme/typography';
import { AppText } from './AppText';

export interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  /** Force the label script (e.g. language names are always shown in their own script). */
  script?: TextScript;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isSelected,
  onPress,
  style,
  labelStyle,
  script,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.base,
        isSelected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText
        variant="body"
        script={script}
        color={isSelected ? Colors.brandPrimaryDark : Colors.textPrimary}
        style={[styles.label, { fontWeight: isSelected ? '700' : '500' }, labelStyle]}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: TouchTargets.min,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselected: {
    backgroundColor: Colors.bgSecondary,
    borderColor: Colors.borderDefault,
  },
  selected: {
    backgroundColor: Colors.brandLight,
    borderColor: Colors.brandPrimary,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    textAlign: 'center',
  },
});
