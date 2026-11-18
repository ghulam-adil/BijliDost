import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PressableStateCallbackType,
} from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, TouchTargets, Radius } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';
import { useTranslation } from '@/store/hooks';

export interface AccessibleButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'normal' | 'large';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityHint?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'large',
  isLoading = false,
  isDisabled = false,
  icon,
  style,
  labelStyle,
  accessibilityHint,
}) => {
  const { language } = useTranslation();
  const isUrdu = language === 'ur';

  const minHeight = size === 'large' ? TouchTargets.primaryButton : TouchTargets.min;

  const getBackgroundColor = (pressed: boolean) => {
    if (isDisabled) return Colors.disabledBg;
    if (variant === 'primary') return pressed ? Colors.brandPrimaryDark : Colors.brandPrimary;
    if (variant === 'secondary') return pressed ? '#E2ECE7' : Colors.brandLight;
    if (variant === 'danger') return pressed ? '#7F1D1D' : Colors.statusAlert;
    return 'transparent'; // outline
  };

  const getTextColor = () => {
    if (isDisabled) return Colors.disabledText;
    if (variant === 'primary' || variant === 'danger') return Colors.textOnBrand;
    if (variant === 'secondary') return Colors.brandPrimaryDark;
    return Colors.brandPrimary; // outline
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={({ pressed }: PressableStateCallbackType) => [
        styles.base,
        {
          minHeight,
          backgroundColor: getBackgroundColor(pressed),
          borderColor: variant === 'outline' ? (isDisabled ? Colors.disabledText : Colors.brandPrimary) : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.label,
              {
                color: getTextColor(),
                fontFamily: isUrdu ? FontFamilies.urduSans : FontFamilies.latinSans,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

