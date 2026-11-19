import { isRtlLanguage, getLayoutDirection, getTranslation, translations } from '../index';

type Tree = { [key: string]: string | Tree };

function flattenKeys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === 'string' ? [`${prefix}${key}`] : flattenKeys(value, `${prefix}${key}.`)
  );
}

function flattenValues(tree: Tree): string[] {
  return Object.values(tree).flatMap((value) =>
    typeof value === 'string' ? [value] : flattenValues(value)
  );
}

describe('Localization & RTL Configuration', () => {
  it('should identify Urdu as RTL and Roman Urdu / English as LTR', () => {
    expect(isRtlLanguage('ur')).toBe(true);
    expect(isRtlLanguage('ur-Latn')).toBe(false);
    expect(isRtlLanguage('en')).toBe(false);
  });

  it('should derive the root layout direction from the language', () => {
    expect(getLayoutDirection('ur')).toBe('rtl');
    expect(getLayoutDirection('ur-Latn')).toBe('ltr');
    expect(getLayoutDirection('en')).toBe('ltr');
  });

  it('should retrieve correct translated strings for all supported languages', () => {
    expect(getTranslation('ur', 'common.appName')).toBe('بجلی دوست');
    expect(getTranslation('ur-Latn', 'common.appName')).toBe('Bijli Dost');
    expect(getTranslation('en', 'common.appName')).toBe('Bijli Dost');
  });

  it('should have full (deep) key parity across all three locale JSON files', () => {
    const urKeys = flattenKeys(translations.ur as Tree).sort();
    expect(flattenKeys(translations['ur-Latn'] as Tree).sort()).toEqual(urKeys);
    expect(flattenKeys(translations.en as Tree).sort()).toEqual(urKeys);
  });

  it('should not contain empty translation values', () => {
    for (const locale of Object.values(translations)) {
      for (const value of flattenValues(locale as Tree)) {
        expect(value.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('should fall back to the key path if an unknown key is queried', () => {
    const missing = getTranslation('ur', 'nonexistent.section.key');
    expect(missing).toBe('nonexistent.section.key');
  });
});
