import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AccessibleButton } from '@/components/ui/AccessibleButton';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/theme/colors';
import { Spacing, Radius } from '@/theme/spacing';
import { useTranslation } from '@/store/hooks';

export default function ScanScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('scan.title')}</Text>

      {/* Camera Guidance Frame Placeholder */}
      <View style={styles.cameraPlaceholder}>
        <View style={styles.reticleCornerTopLeft} />
        <View style={styles.reticleCornerTopRight} />
        <View style={styles.reticleCornerBottomLeft} />
        <View style={styles.reticleCornerBottomRight} />
        <Text style={styles.cameraEmoji}>📸</Text>
        <Text style={styles.cameraTip}>{t('scan.cameraTip')}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <AccessibleButton
          label={t('scan.takePhoto')}
          onPress={() => {}}
          size="large"
          style={styles.primaryBtn}
        />
        <AccessibleButton
          label={t('scan.chooseGallery')}
          variant="outline"
          onPress={() => {}}
          size="large"
          style={styles.secondaryBtn}
        />
      </View>

      {/* Milestone Roadmap Note */}
      <Card variant="flat" style={styles.noticeCard}>
        <Text style={styles.noticeText}>{t('scan.milestoneNotice')}</Text>
      </Card>
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
  cameraPlaceholder: {
    height: 320,
    backgroundColor: '#0F1F18',
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
    padding: Spacing.xl,
  },
  cameraEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  cameraTip: {
    color: '#D6E0DC',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  reticleCornerTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.brandPrimary,
  },
  reticleCornerTopRight: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.brandPrimary,
  },
  reticleCornerBottomLeft: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.brandPrimary,
  },
  reticleCornerBottomRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.brandPrimary,
  },
  buttonGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
  noticeCard: {
    backgroundColor: '#F3F6F4',
    borderColor: '#D4DDD8',
  },
  noticeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

