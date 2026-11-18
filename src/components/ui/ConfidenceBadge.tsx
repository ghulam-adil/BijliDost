import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';
import { useTranslation } from '@/store/hooks';

export type BadgeStatus = 'verified' | 'needsReview' | 'alert' | 'neutral';

export interface ConfidenceBadgeProps {
  status: BadgeStatus;
  label?: string;
  style?: ViewStyle;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  status,
  label,
  style,
}) => {
  const { t, language } = useTranslation();
  const isUrdu = language === 'ur';

  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: Colors.statusVerifiedBg,
          text: Colors.statusVerified,
          defaultLabel: t('common.verified'),
        };
      case 'needsReview':
        return {
          bg: Colors.statusReviewBg,
          text: Colors.statusReview,
          defaultLabel: t('common.needsReview'),
        };
      case 'alert':
        return {
          bg: Colors.statusAlertBg,
          text: Colors.statusAlert,
          defaultLabel: 'Alert',
        };
      case 'neutral':
      default:
        return {
          bg: Colors.statusNeutralBg,
          text: Colors.statusNeutral,
          defaultLabel: t('common.unverified'),
        };
    }
  };

  const config = getBadgeConfig();
  const displayLabel = label || config.defaultLabel;

  return (
    <View style={[styles.container, { backgroundColor: config.bg }, style]}>
      <Text
        style={[
          styles.label,
          {
            color: config.text,
            fontFamily: isUrdu ? FontFamilies.urduSans : FontFamilies.latinSans,
          },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});

