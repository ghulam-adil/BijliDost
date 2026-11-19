import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useAppDispatch, useAppSelector, useTranslation } from '@/store/hooks';
import { setLanguage, completeOnboarding } from '@/store/slices/preferencesSlice';
import type { SupportedLanguage } from '@/i18n/rtl';

/** Language names are always shown in their own script, regardless of the active language. */
const LANGUAGE_OPTIONS: ReadonlyArray<{
  code: SupportedLanguage;
  label: string;
  script: 'urdu' | 'latin';
}> = [
  { code: 'ur', label: 'اردو (Urdu)', script: 'urdu' },
  { code: 'ur-Latn', label: 'Roman Urdu', script: 'latin' },
  { code: 'en', label: 'English', script: 'latin' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.preferences.language);
  const { t } = useTranslation();

  const handleContinue = () => {
    dispatch(completeOnboarding());
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer
      scrollable={true}
      contentContainerStyle={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <DecorativeIcon glyph="⚡" size={40} />
        </View>
        <AppText variant="hero" color={Colors.brandPrimaryDark} style={styles.centered}>
          {t('common.appName')}
        </AppText>
        <AppText variant="prose" color={Colors.textSecondary} style={styles.centered}>
          {t('common.tagline')}
        </AppText>
      </View>

      {/* Language Selection Card */}
      <Card variant="elevated" style={styles.languageCard}>
        <AppText variant="h3" style={[styles.centered, styles.selectPrompt]}>
          {t('onboarding.selectLanguage')}
        </AppText>
        <View style={styles.chipRow}>
          {LANGUAGE_OPTIONS.map((option) => (
            <Chip
              key={option.code}
              label={option.label}
              script={option.script}
              isSelected={currentLanguage === option.code}
              onPress={() => dispatch(setLanguage(option.code))}
              style={styles.chip}
            />
          ))}
        </View>
      </Card>

      {/* Independence & Privacy Notice */}
      <Card variant="flat" style={styles.noticeCard}>
        <View style={styles.noticeHeader}>
          <DecorativeIcon glyph="🛡️" size={18} />
          <AppText variant="body" color={Colors.brandPrimaryDark} style={styles.noticeTitle}>
            {t('onboarding.privacyTitle')}
          </AppText>
        </View>
        <AppText variant="prose" color={Colors.textSecondary}>
          {t('onboarding.disclaimer')}
        </AppText>
      </Card>

      {/* Primary Action */}
      <View style={styles.footer}>
        <AccessibleButton
          label={t('common.continue')}
          onPress={handleContinue}
          size="large"
          style={styles.continueButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  centered: {
    textAlign: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.brandPrimary,
  },
  languageCard: {
    marginVertical: Spacing.lg,
  },
  selectPrompt: {
    marginBottom: Spacing.md,
  },
  chipRow: {
    gap: Spacing.md,
  },
  chip: {
    width: '100%',
  },
  noticeCard: {
    backgroundColor: '#F4F9F6',
    borderColor: '#D4E8DC',
    marginVertical: Spacing.md,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  noticeTitle: {
    fontWeight: '700',
    flexShrink: 1,
  },
  footer: {
    marginTop: Spacing.xl,
  },
  continueButton: {
    width: '100%',
  },
});
