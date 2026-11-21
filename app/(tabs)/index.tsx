import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation, useAppSelector } from '@/store/hooks';
import { formatBillingMonth } from '@/i18n/format';

export default function HomeScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const recentBills = useAppSelector((state) => state.bills.items).slice(0, 3);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Welcome Top Banner */}
      <View style={styles.topBanner}>
        <View style={styles.bannerText}>
          <AppText variant="h2">{t('dashboard.greeting')}</AppText>
          <AppText variant="body" color={Colors.brandPrimary} style={styles.bold}>
            {t('common.appName')}
          </AppText>
        </View>
        <View style={styles.logoPill}>
          <DecorativeIcon glyph="⚡" size={22} />
        </View>
      </View>

      {/* Primary Action Card: Scan Bill */}
      <Card variant="highlight" style={styles.scanActionCard}>
        <View style={styles.scanIconContainer}>
          <DecorativeIcon glyph="📸" size={34} />
        </View>
        <AppText variant="h2" style={styles.centered}>{t('dashboard.scanCardTitle')}</AppText>
        <AppText variant="bodySecondary" color={Colors.textSecondary} style={[styles.centered, styles.scanSubtitle]}>
          {t('dashboard.scanCardSubtitle')}
        </AppText>
        <AccessibleButton
          label={t('dashboard.scanCta')}
          onPress={() => router.push('/(tabs)/scan')}
          size="large"
          style={styles.scanButton}
        />
      </Card>

      {/* Recent Bills Section */}
      <AppText variant="h3" style={styles.sectionTitle}>{t('dashboard.recentBillsTitle')}</AppText>

      {recentBills.length === 0 ? (
        <Card variant="flat" style={styles.emptyCard}>
          <DecorativeIcon glyph="📄" size={32} style={styles.emptyIcon} />
          <AppText variant="body" style={[styles.centered, styles.bold]}>{t('dashboard.noRecentBills')}</AppText>
          <AppText variant="bodySecondary" color={Colors.textMuted} style={[styles.centered, styles.emptySubtitle]}>
            {t('dashboard.noRecentBillsDesc')}
          </AppText>
        </Card>
      ) : (
        <View style={styles.billsList}>
          {recentBills.map((bill) => (
            <Card key={bill.id} style={styles.billItemCard}>
              <AppText variant="body">{formatBillingMonth(language, bill.billingMonth)}</AppText>
            </Card>
          ))}
        </View>
      )}

      {/* Monthly Consumption Section */}
      <AppText variant="h3" style={styles.sectionTitle}>{t('dashboard.consumptionTitle')}</AppText>

      <Card variant="flat" style={styles.emptyCard}>
        <DecorativeIcon glyph="📊" size={32} style={styles.emptyIcon} />
        <AppText variant="body" style={[styles.centered, styles.bold]}>{t('dashboard.noConsumptionData')}</AppText>
        <AppText variant="bodySecondary" color={Colors.textMuted} style={[styles.centered, styles.emptySubtitle]}>
          {t('dashboard.noConsumptionDesc')}
        </AppText>
      </Card>

      {/* Quick Help & Official Contacts Section */}
      <AppText variant="h3" style={styles.sectionTitle}>{t('dashboard.quickHelpTitle')}</AppText>

      <Card variant="flat" style={styles.helpCard}>
        <View style={styles.helpRow}>
          <DecorativeIcon glyph="📞" size={28} />
          <View style={styles.helpTextContainer}>
            <AppText variant="body" style={styles.bold}>{t('complaints.keHelpline')}</AppText>
            <AppText variant="bodySecondary" color={Colors.textSecondary}>
              {t('dashboard.quickHelpDesc')}
            </AppText>
          </View>
        </View>
        <AccessibleButton
          label={t('dashboard.viewHelp')}
          variant="outline"
          onPress={() => router.push('/(tabs)/complaints')}
          style={styles.helpButton}
        />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.section,
  },
  centered: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  bannerText: {
    flexShrink: 1,
  },
  logoPill: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanActionCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginBottom: Spacing.xl,
    backgroundColor: '#FFFFFF',
    borderColor: Colors.brandPrimary,
    borderWidth: 2,
  },
  scanIconContainer: {
    width: 68,
    height: 68,
    borderRadius: Radius.full,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  scanSubtitle: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  scanButton: {
    width: '90%',
  },
  sectionTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#F9FCFA',
    borderStyle: 'dashed',
    borderColor: '#CFDCD6',
  },
  emptyIcon: {
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    paddingHorizontal: Spacing.lg,
  },
  billsList: {
    gap: Spacing.sm,
  },
  billItemCard: {
    padding: Spacing.md,
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    marginTop: Spacing.xs,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpButton: {
    width: '100%',
  },
});
