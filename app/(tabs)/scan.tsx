import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { AppText } from '@/components/ui/AppText';
import { DecorativeIcon } from '@/components/ui/DecorativeIcon';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';

export default function ScanScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <AppText variant="h1" style={styles.title}>{t('scan.title')}</AppText>

      {/* Camera Guidance Frame Placeholder (replaced by the live camera in Milestone 3) */}
      <View style={styles.cameraPlaceholder}>
        <View style={[styles.corner, styles.cornerTopStart]} />
        <View style={[styles.corner, styles.cornerTopEnd]} />
        <View style={[styles.corner, styles.cornerBottomStart]} />
        <View style={[styles.corner, styles.cornerBottomEnd]} />
        <DecorativeIcon glyph="📸" size={48} style={styles.cameraEmoji} />
        <AppText variant="body" color="#D6E0DC" style={styles.cameraTip}>
          {t('scan.cameraTip')}
        </AppText>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <AccessibleButton
          label={t('scan.takePhoto')}
          onPress={() => {}}
          size="large"
          style={styles.fullWidth}
        />
        <AccessibleButton
          label={t('scan.chooseGallery')}
          variant="outline"
          onPress={() => {}}
          size="large"
          style={styles.fullWidth}
        />
      </View>

      {/* Milestone Roadmap Note */}
      <Card variant="flat" style={styles.noticeCard}>
        <AppText variant="bodySecondary" color={Colors.textSecondary} style={styles.cameraTip}>
          {t('scan.milestoneNotice')}
        </AppText>
      </Card>
    </ScreenContainer>
  );
}

const CORNER_SIZE = 32;
const CORNER_INSET = 20;

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.section,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  cameraPlaceholder: {
    height: 320,
    backgroundColor: '#0F1F18',
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
  },
  cameraEmoji: {
    marginBottom: Spacing.md,
  },
  cameraTip: {
    textAlign: 'center',
  },
  // Logical (start/end) positioning so the reticle mirrors correctly in RTL.
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: Colors.brandPrimary,
  },
  cornerTopStart: {
    top: CORNER_INSET,
    start: CORNER_INSET,
    borderTopWidth: 3,
    borderStartWidth: 3,
  },
  cornerTopEnd: {
    top: CORNER_INSET,
    end: CORNER_INSET,
    borderTopWidth: 3,
    borderEndWidth: 3,
  },
  cornerBottomStart: {
    bottom: CORNER_INSET,
    start: CORNER_INSET,
    borderBottomWidth: 3,
    borderStartWidth: 3,
  },
  cornerBottomEnd: {
    bottom: CORNER_INSET,
    end: CORNER_INSET,
    borderBottomWidth: 3,
    borderEndWidth: 3,
  },
  buttonGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
  noticeCard: {
    backgroundColor: '#F3F6F4',
    borderColor: '#D4DDD8',
  },
});
