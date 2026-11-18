import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';

export default function ComplaintsScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('complaints.title')}</Text>

      {/* Official Helplines Card */}
      <Card variant="elevated" style={styles.helplineCard}>
        <View style={styles.helplineRow}>
          <Text style={styles.channelIcon}>📞</Text>
          <View style={styles.channelText}>
            <Text style={styles.channelTitle}>{t('complaints.keHelpline')}</Text>
            <Text style={styles.channelSubtitle}>24/7 Call Center for electricity emergencies & complaints</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.helplineRow}>
          <Text style={styles.channelIcon}>💬</Text>
          <View style={styles.channelText}>
            <Text style={styles.channelTitle}>{t('complaints.smsService')}</Text>
            <Text style={styles.channelSubtitle}>SMS your 13-digit account number to 8119 for bill/status</Text>
          </View>
        </View>
      </Card>

      {/* Checklist Card */}
      <Card variant="flat" style={styles.checklistCard}>
        <Text style={styles.checklistHeader}>{t('complaints.checklistTitle')}</Text>
        
        <View style={styles.checkItem}>
          <Text style={styles.checkBadge}>1</Text>
          <Text style={styles.checkText}>{t('complaints.checklistItem1')}</Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkBadge}>2</Text>
          <Text style={styles.checkText}>{t('complaints.checklistItem2')}</Text>
        </View>

        <View style={styles.checkItem}>
          <Text style={styles.checkBadge}>3</Text>
          <Text style={styles.checkText}>{t('complaints.checklistItem3')}</Text>
        </View>
      </Card>

      {/* Independence Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>{t('complaints.independentNotice')}</Text>
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
  helplineCard: {
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  helplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  channelIcon: {
    fontSize: 28,
  },
  channelText: {
    flex: 1,
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.brandPrimaryDark,
    marginBottom: 2,
  },
  channelSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
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
    color: Colors.brandPrimaryDark,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    fontSize: 14,
  },
  checkText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  disclaimerContainer: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

