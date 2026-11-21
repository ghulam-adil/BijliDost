import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export interface StorageNoticeAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
}

interface Props {
  glyph: string;
  title: string;
  body: string;
  actions: StorageNoticeAction[];
}

/** Blocking notice used for secure-storage failures and recovery decisions. */
export const StorageNoticeScreen: React.FC<Props> = ({ glyph, title, body, actions }) => (
  <ScreenContainer scrollable contentContainerStyle={styles.container} edges={['top', 'bottom', 'left', 'right']}>
    <View style={styles.header}>
      <DecorativeIcon glyph={glyph} size={48} />
      <AppText variant="h1" style={styles.centered}>{title}</AppText>
    </View>
    <AppText variant="prose" color={Colors.textSecondary} style={styles.body}>{body}</AppText>
    <View style={styles.actions}>
      {actions.map((action) => (
        <AccessibleButton
          key={action.label}
          label={action.label}
          variant={action.variant ?? 'primary'}
          onPress={action.onPress}
          style={styles.button}
        />
      ))}
    </View>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', paddingVertical: Spacing.xxxl },
  header: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  centered: { textAlign: 'center' },
  body: { marginBottom: Spacing.xxl },
  actions: { gap: Spacing.md },
  button: { width: '100%' },
});
