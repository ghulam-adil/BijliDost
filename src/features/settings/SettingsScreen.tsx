import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';
import { useDataManagement } from './hooks/useDataManagement';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isStorageReady, exportBills, clearAllData, addSampleBill } = useDataManagement();
  const [isBusy, setIsBusy] = useState(false);

  const runExport = async () => {
    setIsBusy(true);
    const outcome = await exportBills();
    setIsBusy(false);
    if (outcome === 'empty') Alert.alert(t('settings.exportEmpty'));
  };

  // The export contains unencrypted personal data: warn before it leaves the app.
  const confirmExport = () => {
    Alert.alert(t('settings.exportWarningTitle'), t('settings.exportWarningBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.exportCta'), onPress: () => void runExport() },
    ]);
  };

  const runClear = async () => {
    setIsBusy(true);
    const ok = await clearAllData();
    setIsBusy(false);
    Alert.alert(ok ? t('settings.clearDone') : t('storage.eraseFailed'));
  };

  const confirmClear = () => {
    Alert.alert(t('settings.clearConfirmTitle'), t('settings.clearConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.clearCta'), style: 'destructive', onPress: () => void runClear() },
    ]);
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <AccessibleButton label={t('common.back')} variant="outline" size="normal" onPress={() => router.back()} style={styles.back} />
      <AppText variant="h1" style={styles.title}>{t('settings.title')}</AppText>

      <AppText variant="bodySecondary" color={isStorageReady ? Colors.statusVerified : Colors.statusReview} style={styles.status}>
        {isStorageReady ? t('settings.statusReady') : t('settings.statusUnsupported')}
      </AppText>

      <Card style={styles.card}>
        <AppText variant="h3">{t('settings.exportTitle')}</AppText>
        <AppText variant="bodySecondary" color={Colors.textSecondary}>{t('settings.exportDesc')}</AppText>
        <AccessibleButton label={t('settings.exportCta')} variant="secondary" isDisabled={!isStorageReady || isBusy} onPress={confirmExport} />
      </Card>

      <Card style={styles.card}>
        <AppText variant="h3">{t('settings.clearTitle')}</AppText>
        <AppText variant="bodySecondary" color={Colors.textSecondary}>{t('settings.clearDesc')}</AppText>
        <AccessibleButton label={t('settings.clearCta')} variant="danger" isDisabled={!isStorageReady || isBusy} onPress={confirmClear} />
      </Card>

      <AppText variant="caption" color={Colors.textMuted} style={styles.centered}>{t('history.backupNote')}</AppText>

      {__DEV__ && (
        <View style={styles.devBlock}>
          <Card variant="flat" style={styles.card}>
            <AppText variant="h3">{t('settings.devSection')}</AppText>
            <AppText variant="caption" color={Colors.textMuted}>{t('settings.devSampleNote')}</AppText>
            <AccessibleButton
              label={t('settings.devAddSample')}
              variant="outline"
              isDisabled={!isStorageReady || isBusy}
              onPress={() => void addSampleBill()}
            />
          </Card>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: Spacing.section, gap: Spacing.md },
  back: { alignSelf: 'flex-start' },
  title: { marginTop: Spacing.sm },
  status: { fontWeight: '600' },
  card: { gap: Spacing.md },
  centered: { textAlign: 'center', paddingHorizontal: Spacing.md },
  devBlock: { marginTop: Spacing.xl },
});
