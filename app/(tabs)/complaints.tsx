import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';
import type { TranslationKey } from '@/i18n';

const CHECKLIST_KEYS: readonly TranslationKey[] = [
  'complaints.checklistItem1',
  'complaints.checklistItem2',
  'complaints.checklistItem3',
];

export default function ComplaintsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.title}>{t('complaints.title')}</AppText>

      {/* Official Helplines Card */}
      <Card variant="elevated" style={styles.helplineCard}>
        <View style={styles.helplineRow}>
          <DecorativeIcon glyph="📞" size={28} />
          <View style={styles.channelText}>
            <AppText variant="h3" color={Colors.brandPrimaryDark}>{t('complaints.keHelpline')}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{t('complaints.keHelplineDesc')}</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.helplineRow}>
          <DecorativeIcon glyph="💬" size={28} />
          <View style={styles.channelText}>
            <AppText variant="h3" color={Colors.brandPrimaryDark}>{t('complaints.smsService')}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{t('complaints.smsServiceDesc')}</AppText>
          </View>
        </View>
      </Card>

      {/* Checklist Card */}
      <Card variant="flat" style={styles.checklistCard}>
        <AppText variant="h3" style={styles.checklistHeader}>{t('complaints.checklistTitle')}</AppText>

        {CHECKLIST_KEYS.map((key, index) => (
          <View key={key} style={styles.checkItem}>
            <View style={styles.checkBadge}>
              <AppText variant="caption" color={Colors.brandPrimaryDark} script="latin" style={styles.checkBadgeText}>
                {String(index + 1)}
              </AppText>
            </View>
            <AppText variant="body" style={styles.checkText}>{t(key)}</AppText>
          </View>
        ))}
      </Card>

      {/* Independence Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <AppText variant="caption" color={Colors.textMuted} style={styles.centered}>
          {t('complaints.independentNotice')}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.section,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  centered: {
    textAlign: 'center',
  },
  helplineCard: {
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  channelText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
    marginVertical: Spacing.md,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: Spacing.xl,
  },
  checklistHeader: {
    marginBottom: Spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    fontWeight: '700',
  },
  checkText: {
    flex: 1,
  },
  disclaimerContainer: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
});
