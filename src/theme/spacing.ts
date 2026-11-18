/**
 * Bijli Dost Spacing & Layout Tokens
 * Built for accessibility, large tap targets (>=48dp), and low-end Android displays.
 */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
} as const;

export const TouchTargets = {
  min: 48,          // WCAG minimum touch target (48x48 dp)
  primaryButton: 56,// High-priority CTAs (Scan, Continue, Listen)
  tabBarHeight: 64, // Comfortable bottom navigation bar
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

