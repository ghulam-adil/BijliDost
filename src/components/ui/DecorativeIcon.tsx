import React from 'react';
import { Text, TextStyle } from 'react-native';

export interface DecorativeIconProps {
  /** Emoji glyph. Hidden from screen readers; never carries meaning on its own. */
  glyph: string;
  size?: number;
  style?: TextStyle;
}

export const DecorativeIcon: React.FC<DecorativeIconProps> = ({ glyph, size = 24, style }) => (
  <Text
    accessible={false}
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden
    allowFontScaling={false}
    style={[{ fontSize: size, lineHeight: Math.round(size * 1.3) }, style]}
  >
    {glyph}
  </Text>
);
