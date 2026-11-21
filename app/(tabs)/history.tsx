import React from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation, useAppSelector } from '@/store/hooks';
import { useStorage } from '@/features/storage/StorageProvider';
import { BillListItem } from '@/features/history/components/BillListItem';
import { useBillActions } from '@/features/history/hooks/useBillActions';
import type { BillSummary } from '@/services/storage/billRecord';

export default function HistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const bills = useAppSelector((state) => state.bills.items);
  const { state } = useStorage();
  const { canModify, togglePaid, remove } = useBillActions();

  const confirmDelete = (bill: BillSummary) => {
    Alert.alert(t('history.deleteConfirmTitle'), t('history.deleteConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('history.deleteBill'), style: 'destructive', onPress: () => void remove(bill.id) },
    ]);
  };

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.title}>{t('history.title')}</AppText>

      {state.status === 'unsupported' && (
        <Card variant="flat" style={styles.notice}>
          <AppText variant="bodySecondary" color={Colors.statusReview}>{t('history.unsupported')}</AppText>
        </Card>
      )}

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
          {bills.map((bill) => (
            <BillListItem
              key={bill.id}
              bill={bill}
              onTogglePaid={canModify ? (item) => void togglePaid(item) : () => {}}
              onDelete={canModify ? confirmDelete : () => {}}
            />
          ))}
        </View>
      )}

      <AccessibleButton
        label={t('history.manageData')}
        variant="outline"
        onPress={() => router.push('/settings')}
        style={styles.manageButton}
      />

      {/* Security & backup limitation notice */}
      <View style={styles.securityBox}>
        <DecorativeIcon glyph="🔒" size={14} />
        <AppText variant="caption" color={Colors.textMuted} style={[styles.centered, styles.securityText]}>
          {t('history.securityNote')}
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textMuted} style={[styles.centered, styles.backupNote]}>
        {t('history.backupNote')}
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: Spacing.section },
  title: { marginBottom: Spacing.lg },
  centered: { textAlign: 'center' },
  notice: { backgroundColor: Colors.statusReviewBg, borderColor: Colors.borderWarning, marginBottom: Spacing.md },
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
  emptySubtitle: { paddingHorizontal: Spacing.lg },
  list: { gap: Spacing.md },
  manageButton: { marginTop: Spacing.xl, width: '100%' },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  securityText: { flexShrink: 1 },
  backupNote: { marginTop: Spacing.sm, paddingHorizontal: Spacing.md },
});
