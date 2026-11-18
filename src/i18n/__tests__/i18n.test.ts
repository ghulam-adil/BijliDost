import { isRtlLanguage, getTranslation, translations } from '../index';

describe('Localization & RTL Configuration', () => {
  it('should identify Urdu as RTL and Roman Urdu / English as LTR', () => {
    expect(isRtlLanguage('ur')).toBe(true);
    expect(isRtlLanguage('ur-Latn')).toBe(false);
    expect(isRtlLanguage('en')).toBe(false);
  });

  it('should retrieve correct translated strings for all supported languages', () => {
    expect(getTranslation('ur', 'common.appName')).toBe('بجلی دوست');
    expect(getTranslation('ur-Latn', 'common.appName')).toBe('Bijli Dost');
    expect(getTranslation('en', 'common.appName')).toBe('Bijli Dost');
  });

  it('should have key parity across all three locale JSON files', () => {
    const urKeys = Object.keys(translations.ur).sort();
    const urLatnKeys = Object.keys(translations['ur-Latn']).sort();
    const enKeys = Object.keys(translations.en).sort();

    expect(urLatnKeys).toEqual(urKeys);
    expect(enKeys).toEqual(urKeys);

    // Deep check sub-keys
    for (const section of urKeys as Array<keyof typeof translations.ur>) {
      const urSubKeys = Object.keys(translations.ur[section]).sort();
      const urLatnSubKeys = Object.keys(translations['ur-Latn'][section]).sort();
      const enSubKeys = Object.keys(translations.en[section]).sort();

      expect(urLatnSubKeys).toEqual(urSubKeys);
      expect(enSubKeys).toEqual(urSubKeys);
    }
  });

  it('should fallback gracefully to English if an unknown key is queried', () => {
    const missing = getTranslation('ur', 'nonexistent.section.key');
    expect(missing).toBe('nonexistent.section.key');
  });
});

