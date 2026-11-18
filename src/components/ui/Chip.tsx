import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius, TouchTargets } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';

export interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  isUrdu?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  isSelected,
  onPress,
  style,
  labelStyle,
  isUrdu = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      style={({ pressed }) => [
        styles.base,
        isSelected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: isSelected ? Colors.brandPrimaryDark : Colors.textPrimary,
            fontFamily: isUrdu ? FontFamilies.urduSans : FontFamilies.latinSans,
            fontWeight: isSelected ? '700' : '500',
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
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
    fontSize: 16,
    textAlign: 'center',
  },
});

