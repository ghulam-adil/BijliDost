import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'highlight';
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'flat',
  accessibilityLabel,
}) => {
  const cardStyle = [
    styles.base,
    variant === 'elevated' && styles.elevated,
    variant === 'highlight' && styles.highlight,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
  },
  elevated: {
    // Low-end friendly subtle shadow / elevation
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  highlight: {
    borderColor: Colors.brandPrimary,
    borderWidth: 1.5,
  },
  pressed: {
    opacity: 0.92,
    backgroundColor: '#FBFDFB',
  },
});

