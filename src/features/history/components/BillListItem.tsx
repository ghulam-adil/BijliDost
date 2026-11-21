import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { Card } from '@/components/ui/Card';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';
import { formatBillingMonth, formatDate } from '@/i18n/format';
import { formatPkr, formatUnits } from '@/utils/bidi';
import type { BillSummary } from '@/services/storage/billRecord';

interface Props {
  bill: BillSummary;
  onTogglePaid: (bill: BillSummary) => void;
  onDelete: (bill: BillSummary) => void;
}

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.detail}>
    <AppText variant="caption" color={Colors.textMuted}>{label}</AppText>
    <AppText variant="body" style={styles.detailValue}>{value}</AppText>
  </View>
);

export const BillListItem: React.FC<Props> = ({ bill, onTogglePaid, onDelete }) => {
  const { t, language } = useTranslation();

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <AppText variant="h3" style={styles.month}>{formatBillingMonth(language, bill.billingMonth)}</AppText>
        <ConfidenceBadge status={bill.isPaid ? 'verified' : 'needsReview'} label={bill.isPaid ? t('history.paid') : t('history.unpaid')} />
      </View>

      <View style={styles.details}>
        <Detail label={t('history.payable')} value={formatPkr(bill.amountWithinDueDate)} />
        <Detail label={t('history.units')} value={formatUnits(bill.unitsKwh)} />
        <Detail label={t('history.due')} value={formatDate(language, bill.dueDate)} />
      </View>

      <ConfidenceBadge status={bill.status === 'verified' ? 'verified' : 'neutral'} style={styles.statusBadge} />

      <View style={styles.actions}>
        <AccessibleButton
          label={bill.isPaid ? t('history.markUnpaid') : t('history.markPaid')}
          variant="secondary"
          size="normal"
          onPress={() => onTogglePaid(bill)}
          style={styles.action}
        />
        <AccessibleButton
          label={t('history.deleteBill')}
          variant="outline"
          size="normal"
          onPress={() => onDelete(bill)}
          style={styles.action}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { padding: Spacing.lg, gap: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  month: { flexShrink: 1 },
  details: { gap: Spacing.sm },
  detail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  detailValue: { fontWeight: '600', flexShrink: 1 },
  statusBadge: { alignSelf: 'flex-start' },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1, paddingHorizontal: Spacing.sm },
});
