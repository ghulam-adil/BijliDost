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
 * Layout direction applied to the app root so the UI mirrors immediately when the
 * language changes, without waiting for a native reload.
 */
export function getLayoutDirection(language: SupportedLanguage): 'rtl' | 'ltr' {
  return isRtlLanguage(language) ? 'rtl' : 'ltr';
}

/**
 * Syncs the native I18nManager flag so native-level pieces (scroll views, system
 * gestures, default text alignment) match on the NEXT app launch.
 * Must be called from an effect, never from a reducer.
 * Returns true when the native flag changed.
 */
export function applyRtlPreference(language: SupportedLanguage): boolean {
  const shouldBeRtl = isRtlLanguage(language);
  if (I18nManager.isRTL !== shouldBeRtl) {
    I18nManager.allowRTL(shouldBeRtl);
    I18nManager.forceRTL(shouldBeRtl);
    return true;
  }
  return false;
}
