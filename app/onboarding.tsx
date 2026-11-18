import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { Chip } from '@/components/ui/Chip';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';
import { useAppDispatch, useAppSelector, useTranslation } from '@/store/hooks';
import { setLanguage, completeOnboarding } from '@/store/slices/preferencesSlice';
import { SupportedLanguage } from '@/i18n/rtl';

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.preferences.language);
  const { t } = useTranslation();

  const handleSelectLanguage = (lang: SupportedLanguage) => {
    dispatch(setLanguage(lang));
  };

  const handleContinue = () => {
    dispatch(completeOnboarding());
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>
        <Text style={styles.appName}>{t('common.appName')}</Text>
        <Text style={styles.tagline}>{t('common.tagline')}</Text>
      </View>

      {/* Language Selection Card */}
      <Card variant="elevated" style={styles.languageCard}>
        <Text style={styles.selectPrompt}>{t('onboarding.selectLanguage')}</Text>
        <View style={styles.chipRow}>
          <Chip
            label="اردو (Urdu)"
            isSelected={currentLanguage === 'ur'}
            onPress={() => handleSelectLanguage('ur')}
            isUrdu={true}
            style={styles.chip}
          />
          <Chip
            label="Roman Urdu"
            isSelected={currentLanguage === 'ur-Latn'}
            onPress={() => handleSelectLanguage('ur-Latn')}
            style={styles.chip}
          />
          <Chip
            label="English"
            isSelected={currentLanguage === 'en'}
            onPress={() => handleSelectLanguage('en')}
            style={styles.chip}
          />
        </View>
      </Card>

      {/* Independence & Privacy Notice */}
      <Card variant="flat" style={styles.noticeCard}>
        <View style={styles.noticeHeader}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.noticeTitle}>
            {currentLanguage === 'ur'
              ? 'مکمل رازداری اور آزادی'
              : currentLanguage === 'ur-Latn'
              ? 'Mukammal Razdari aur Azadi'
              : 'Privacy & Independent Helper'}
          </Text>
        </View>
        <Text style={styles.noticeText}>{t('onboarding.disclaimer')}</Text>
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
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.brandPrimaryDark,
    marginBottom: Spacing.xs,
    fontFamily: FontFamilies.urduSans,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: FontFamilies.nastaliq,
    lineHeight: 36,
  },
  languageCard: {
    marginVertical: Spacing.lg,
  },
  selectPrompt: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
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
  shieldIcon: {
    fontSize: 18,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.brandPrimaryDark,
  },
  noticeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    marginTop: Spacing.xl,
  },
  continueButton: {
    width: '100%',
  },
});

