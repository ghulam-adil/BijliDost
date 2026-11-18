import { TextStyle } from 'react-native';
import { FontFamilies } from './fonts';
import { Colors } from './colors';

/**
 * Bijli Dost Typography Scale & Metrics
 * Follows 1.8-2.2x lineHeight for Nastaliq to avoid diacritic clipping.
 * Follows 1.4-1.6x lineHeight for Sans-serif UI elements.
 */
export const Typography: Record<string, TextStyle> = {
  // Editorial / Narrative Urdu (Noto Nastaliq Urdu)
  nastaliqHero: {
    fontFamily: FontFamilies.nastaliq,
    fontSize: 26,
    lineHeight: 52, // 2.0x
    color: Colors.textPrimary,
  },
  nastaliqBodyLarge: {
    fontFamily: FontFamilies.nastaliq,
    fontSize: 20,
    lineHeight: 40, // 2.0x
    color: Colors.textPrimary,
  },
  nastaliqBody: {
    fontFamily: FontFamilies.nastaliq,
    fontSize: 17,
    lineHeight: 34, // 2.0x
    color: Colors.textPrimary,
  },

  // Compact UI & Headings (Urdu Sans or System Sans depending on language)
  uiDisplayAmount: {
    fontFamily: FontFamilies.latinSans,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  uiH1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  uiH2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  uiH3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  uiButtonLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.textOnBrand,
  },
  uiBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  uiBodySecondary: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  uiCaption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: Colors.textMuted,
  },
};

