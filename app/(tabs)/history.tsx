import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation, useAppSelector } from '@/store/hooks';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const bills = useAppSelector((state) => state.bills.items);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('history.title')}</Text>

      {bills.length === 0 ? (
        <Card variant="flat" style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.emptyIcon}>📁</Text>
          </View>
          <Text style={styles.emptyTitle}>{t('history.emptyTitle')}</Text>
          <Text style={styles.emptySubtitle}>{t('history.emptyDesc')}</Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {bills.map((item) => (
            <Card key={item.id} style={styles.billCard}>
              <Text>{item.billingMonth}</Text>
            </Card>
          ))}
        </View>
      )}

      {/* Security notice */}
      <View style={styles.securityBox}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.securityText}>{t('history.securityNote')}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.section,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    backgroundColor: '#F9FCFA',
    borderColor: '#D8E4DE',
    borderStyle: 'dashed',
    marginVertical: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: '#EDF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyIcon: {
    fontSize: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: 22,
  },
  list: {
    gap: Spacing.sm,
  },
  billCard: {
    padding: Spacing.lg,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  lockIcon: {
    fontSize: 14,
  },
  securityText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

