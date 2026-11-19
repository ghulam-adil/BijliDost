import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation, useAppSelector } from '@/store/hooks';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const bills = useAppSelector((state) => state.bills.items);

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.title}>{t('history.title')}</AppText>

      {bills.length === 0 ? (
        <Card variant="flat" style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <DecorativeIcon glyph="📁" size={30} />
          </View>
          <AppText variant="h3" style={styles.centered}>{t('history.emptyTitle')}</AppText>
          <AppText variant="bodySecondary" color={Colors.textMuted} style={[styles.centered, styles.emptySubtitle]}>
            {t('history.emptyDesc')}
          </AppText>
        </Card>
      ) : (
        <View style={styles.list}>
          {bills.map((item) => (
            <Card key={item.id} style={styles.billCard}>
              <AppText variant="body">{item.billingMonth}</AppText>
            </Card>
          ))}
        </View>
      )}

      {/* Security notice */}
      <View style={styles.securityBox}>
        <DecorativeIcon glyph="🔒" size={14} />
        <AppText variant="caption" color={Colors.textMuted} style={[styles.centered, styles.securityText]}>
          {t('history.securityNote')}
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
  emptySubtitle: {
    paddingHorizontal: Spacing.lg,
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
  securityText: {
    flexShrink: 1,
  },
});
