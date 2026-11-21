import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';
import { useStorage } from './StorageProvider';
import { StorageNoticeScreen } from './components/StorageNoticeScreen';

/**
 * Blocks the app while encrypted storage is starting, unavailable, or needs a user decision.
 * Nothing is ever erased without an explicit confirmation here.
 */
export const StorageGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, retry, eraseAll } = useStorage();
  const { t } = useTranslation();

  const confirmErase = () => {
    Alert.alert(t('storage.eraseConfirmTitle'), t('storage.eraseConfirmBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('storage.eraseCta'),
        style: 'destructive',
        onPress: () => {
          eraseAll().catch(() => Alert.alert(t('storage.eraseFailed')));
        },
      },
    ]);
  };

  switch (state.status) {
    case 'loading':
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.brandPrimary} />
          <AppText variant="body" color={Colors.textSecondary}>{t('storage.loading')}</AppText>
        </View>
      );

    case 'fatal':
      return (
        <StorageNoticeScreen
          glyph="🔒"
          title={t('storage.fatalTitle')}
          body={t('storage.fatalBody')}
          actions={[{ label: t('storage.tryAgain'), onPress: () => void retry() }]}
        />
      );

    case 'recovery': {
      const orphaned = state.reason === 'orphaned-database';
      return (
        <StorageNoticeScreen
          glyph="🗄️"
          title={t(orphaned ? 'storage.recoveryOrphanedTitle' : 'storage.recoveryRejectedTitle')}
          body={t(orphaned ? 'storage.recoveryOrphanedBody' : 'storage.recoveryRejectedBody')}
          actions={[
            { label: t('storage.tryAgain'), onPress: () => void retry() },
            { label: t('storage.eraseAndStartFresh'), variant: 'danger', onPress: confirmErase },
          ]}
        />
      );
    }

    case 'ready':
    case 'unsupported':
      return <>{children}</>;
  }
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgPrimary,
  },
});
