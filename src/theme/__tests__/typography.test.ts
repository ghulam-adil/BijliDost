import {
  resolveTextStyle,
  TextVariant,
  NASTALIQ_VERTICAL_PADDING,
} from '../typography';
import { FontFamilies } from '../fonts';

const ALL_VARIANTS: TextVariant[] = [
  'display', 'hero', 'h1', 'h2', 'h3', 'button', 'body', 'bodySecondary', 'caption', 'prose', 'proseLarge',
];

describe('resolveTextStyle', () => {
  it.each(['prose', 'proseLarge'] as const)(
    'uses Nastaliq with 1.8-2.2x line height and vertical padding for Urdu %s',
    (variant) => {
      const style = resolveTextStyle('urdu', variant);
      const ratio = (style.lineHeight as number) / (style.fontSize as number);
      expect(style.fontFamily).toBe(FontFamilies.nastaliq);
      expect(ratio).toBeGreaterThanOrEqual(1.8);
      expect(ratio).toBeLessThanOrEqual(2.2);
      expect(style.paddingVertical).toBe(NASTALIQ_VERTICAL_PADDING);
    }
  );

  it.each(['hero', 'h1', 'h2', 'h3', 'button', 'body', 'bodySecondary', 'caption'] as const)(
    'uses Noto Sans Arabic with 1.4-1.6x line height for Urdu UI variant %s',
    (variant) => {
      const style = resolveTextStyle('urdu', variant);
      const ratio = (style.lineHeight as number) / (style.fontSize as number);
      expect(style.fontFamily).toBe(FontFamilies.urduSans);
      expect(ratio).toBeGreaterThanOrEqual(1.4);
      expect(ratio).toBeLessThanOrEqual(1.6);
    }
  );

  it('keeps large amounts in the Latin font even for Urdu', () => {
    expect(resolveTextStyle('urdu', 'display').fontFamily).toBe(FontFamilies.latinSans);
  });

  it('never applies Urdu fonts to Latin script', () => {
    for (const variant of ALL_VARIANTS) {
      expect(resolveTextStyle('latin', variant).fontFamily).toBe(FontFamilies.latinSans);
    }
  });

  it('always provides a font size and a line height that fits it', () => {
    for (const script of ['urdu', 'latin'] as const) {
      for (const variant of ALL_VARIANTS) {
        const style = resolveTextStyle(script, variant);
        expect(style.fontSize).toBeGreaterThan(0);
        expect(style.lineHeight as number).toBeGreaterThanOrEqual(style.fontSize as number);
      }
    }
  });
});
