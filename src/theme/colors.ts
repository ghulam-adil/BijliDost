/**
 * Bijli Dost Accessible Color Palette
 * Verified against WCAG AA (>4.5:1 for body) and AAA (>7:1 for headers)
 */

export const Colors = {
  // Backgrounds
  bgPrimary: '#F7FAF8',       // Warm off-white screen background (anti-glare)
  bgSurface: '#FFFFFF',       // Card and modal surface
  bgSecondary: '#EEF3F0',     // Subtle contrast background for inputs/chips
  
  // Text
  textPrimary: '#0F1F18',     // High-contrast primary text (>14:1 on white)
  textSecondary: '#3D5248',   // Secondary text, captions, subtitles (>7:1 on white)
  textMuted: '#637A70',       // Placeholder / metadata text (>4.5:1 on white)
  textOnBrand: '#FFFFFF',     // Text on primary brand buttons

  // Brand / Primary Action
  brandPrimary: '#0E7C5B',    // Primary action / active tab indicator (>5.0:1 on white)
  brandPrimaryDark: '#095C43',// Pressed state / high emphasis (>7.8:1 on white)
  brandLight: '#E6F4EF',      // Soft brand tint for active chip backgrounds

  // Verification & Status Badges
  statusVerified: '#166534',   // Verified badge text (AA compliant on statusVerifiedBg)
  statusVerifiedBg: '#DCFCE7', // Soft green container
  statusReview: '#92400E',     // Uncertain / Needs review text (AA compliant)
  statusReviewBg: '#FEF3C7',   // Soft amber container
  statusAlert: '#991B1B',      // Alert / Urgent text (AA compliant)
  statusAlertBg: '#FEE2E2',    // Soft red container
  statusNeutral: '#475569',    // Unverified / draft status
  statusNeutralBg: '#F1F5F9',

  // Borders & Dividers
  borderDefault: '#D6E0DC',   // Crisp 1px card and input boundaries
  borderFocus: '#0E7C5B',     // Active focused input border
  borderWarning: '#D97706',   // Uncertain OCR field warning border

  // Disabled States
  disabledBg: '#E2E8E5',
  disabledText: '#8E9E97',
} as const;

export type ColorToken = keyof typeof Colors;

