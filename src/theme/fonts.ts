import { Platform } from 'react-native';

/**
 * Bijli Dost Font Family Identifiers & Platform Fallbacks
 */
export const FontFamilies = {
  // Editorial / Narrative Urdu (Long explanations, Voice script display)
  nastaliq: Platform.select({
    ios: 'NotoNastaliqUrdu',
    android: 'NotoNastaliqUrdu-Regular',
    default: 'Noto Nastaliq Urdu, serif',
  }),

  // Compact UI / Tables / Navigation (Urdu Buttons, Tab bar, Chips)
  urduSans: Platform.select({
    ios: 'NotoSansArabic',
    android: 'NotoSansArabic-Regular',
    default: 'Noto Sans Arabic, sans-serif',
  }),

  // Latin / Numbers / English (Roman Urdu, Currency, Dates, Reference Numbers)
  latinSans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'system-ui, sans-serif',
  }),
};

