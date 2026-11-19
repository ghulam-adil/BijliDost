import React, { useMemo } from 'react';
import { Text, TextProps } from 'react-native';
import { Colors } from '@/theme/colors';
import { resolveTextStyle, TextScript, TextVariant } from '@/theme/typography';
import { AppConfig } from '@/config';
import { useTranslation } from '@/store/hooks';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  /** Force a script (e.g. language names that are always shown in Urdu). Defaults to the active language. */
  script?: TextScript;
}

/**
 * Language-aware text. Picks Nastaliq / Noto Sans Arabic / system sans and the
 * matching line height from the design system, and caps OS font scaling so
 * layouts stay intact at the 1.3x accessibility target.
 */
export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = Colors.textPrimary,
  script,
  style,
  ...rest
}) => {
  const { language } = useTranslation();
  const resolvedScript: TextScript = script ?? (language === 'ur' ? 'urdu' : 'latin');
  const typography = useMemo(
    () => resolveTextStyle(resolvedScript, variant),
    [resolvedScript, variant]
  );

  return (
    <Text
      maxFontSizeMultiplier={AppConfig.maxFontScale}
      {...rest}
      style={[typography, { color }, style]}
    />
  );
};
