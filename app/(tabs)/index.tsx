import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { FontFamilies } from '@/theme/fonts';
import { useTranslation, useAppSelector } from '@/store/hooks';

export default function HomeScreen() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isUrdu = language === 'ur';
  const recentBills = useAppSelector((state) => state.bills.items);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* Welcome Top Banner */}
      <View style={styles.topBanner}>
        <View>
          <Text style={styles.greetingText}>{t('dashboard.greeting')}</Text>
          <Text style={styles.subGreetingText}>{t('common.appName')}</Text>
        </View>
        <View style={styles.logoPill}>
          <Text style={styles.boltIcon}>⚡</Text>
        </View>
      </View>

      {/* Primary Action Card: Scan Bill */}
      <Card variant="highlight" style={styles.scanActionCard}>
        <View style={styles.scanIconContainer}>
          <Text style={styles.scanEmoji}>📸</Text>
        </View>
        <Text style={styles.scanCardTitle}>{t('dashboard.scanCardTitle')}</Text>
        <Text style={styles.scanCardSubtitle}>{t('dashboard.scanCardSubtitle')}</Text>
        <AccessibleButton
          label={t('dashboard.scanCta')}
          onPress={() => router.push('/(tabs)/scan')}
          size="large"
          style={styles.scanButton}
        />
      </Card>

      {/* Recent Bills Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dashboard.recentBillsTitle')}</Text>
      </View>

      {recentBills.length === 0 ? (
        <Card variant="flat" style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>{t('dashboard.noRecentBills')}</Text>
          <Text style={styles.emptySubtitle}>{t('dashboard.noRecentBillsDesc')}</Text>
        </Card>
      ) : (
        <View style={styles.billsList}>
          {recentBills.map((bill) => (
            <Card key={bill.id} style={styles.billItemCard}>
              <Text>{bill.billingMonth}</Text>
            </Card>
          ))}
        </View>
      )}

      {/* Monthly Consumption Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dashboard.consumptionTitle')}</Text>
      </View>

      <Card variant="flat" style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>{t('dashboard.noConsumptionData')}</Text>
        <Text style={styles.emptySubtitle}>{t('dashboard.noConsumptionDesc')}</Text>
      </Card>

      {/* Quick Help & Official Contacts Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dashboard.quickHelpTitle')}</Text>
      </View>

      <Card variant="flat" style={styles.helpCard}>
        <View style={styles.helpRow}>
          <Text style={styles.helpIcon}>📞</Text>
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>K-Electric 118</Text>
            <Text style={styles.helpDesc}>{t('dashboard.quickHelpDesc')}</Text>
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
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subGreetingText: {
    fontSize: 16,
    color: Colors.brandPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  logoPill: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boltIcon: {
    fontSize: 22,
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
  scanEmoji: {
    fontSize: 34,
  },
  scanCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  scanCardSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  scanButton: {
    width: '90%',
  },
  sectionHeader: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#F9FCFA',
    borderStyle: 'dashed',
    borderColor: '#CFDCD6',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
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
  helpIcon: {
    fontSize: 28,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  helpDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  helpButton: {
    width: '100%',
  },
});

