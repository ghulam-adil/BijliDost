import { I18nManager } from 'react-native';

export type SupportedLanguage = 'ur' | 'ur-Latn' | 'en';

/**
 * Checks whether the given language uses Right-to-Left (RTL) script.
 * Urdu ('ur') is RTL.
 * Roman Urdu ('ur-Latn') and English ('en') are LTR.
 */
export function isRtlLanguage(language: SupportedLanguage): boolean {
  return language === 'ur';
}

/**
 * Updates the native I18nManager RTL preference.
 * Note: Changing I18nManager requires an app reload for native view mirrors on some Android devices.
 */
export function applyRtlPreference(language: SupportedLanguage): boolean {
  const shouldBeRtl = isRtlLanguage(language);
  if (I18nManager.isRTL !== shouldBeRtl) {
    I18nManager.allowRTL(shouldBeRtl);
    I18nManager.forceRTL(shouldBeRtl);
    return true; // Indicates layout direction changed
  }
  return false;
}

/**
 * Returns directional flex-direction based on active language.
 */
export function getRowDirection(language: SupportedLanguage): 'row' | 'row-reverse' {
  return isRtlLanguage(language) ? 'row-reverse' : 'row';
}

/**
 * Returns logical text alignment based on language.
 */
export function getTextAlign(language: SupportedLanguage): 'right' | 'left' {
  return isRtlLanguage(language) ? 'right' : 'left';
}

