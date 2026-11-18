import ur from './locales/ur.json';
import urLatn from './locales/ur-Latn.json';
import en from './locales/en.json';
import { SupportedLanguage, isRtlLanguage } from './rtl';

export * from './rtl';

export type TranslationSchema = typeof ur;

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  ur,
  'ur-Latn': urLatn,
  en,
};

/**
 * Nested key path type helper for translations
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationSchema>;

/**
 * Retrieve translation string by dot-notated key path.
 * Example: t('ur', 'common.appName') => 'بجلی دوست'
 */
export function getTranslation(language: SupportedLanguage, path: string): string {
  const localeData = translations[language] || translations.ur;
  const segments = path.split('.');

  let current: unknown = localeData;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      // Fallback to English if key missing
      let fallbackCurrent: unknown = translations.en;
      for (const fallbackSegment of segments) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fallbackSegment in fallbackCurrent) {
          fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fallbackSegment];
        } else {
          return path;
        }
      }
      return typeof fallbackCurrent === 'string' ? fallbackCurrent : path;
    }
  }

  return typeof current === 'string' ? current : path;
}

