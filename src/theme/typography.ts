import type { TextStyle } from 'react-native';
import { FontFamilies } from './fonts';

/**
 * Bijli Dost typography resolver.
 *
 * Pure function of (script, variant) so it can be unit tested in Node.
 * - Urdu prose (explanations, voice scripts) -> Noto Nastaliq Urdu, ~2.0x line height + vertical padding.
 * - Urdu compact UI (buttons, tabs, labels)  -> Noto Sans Arabic, ~1.5x line height.
 * - Latin (English, Roman Urdu) and numerals -> system sans.
 */

export type TextScript = 'urdu' | 'latin';

export type TextVariant =
  | 'display' // large amounts (always Latin numerals)
  | 'hero' // brand / screen hero title
  | 'h1'
  | 'h2'
  | 'h3'
  | 'button'
  | 'body'
  | 'bodySecondary'
  | 'caption'
  | 'prose' // long-form explanation text
  | 'proseLarge';

type VariantKind = 'ui' | 'prose' | 'numeric';

interface VariantSpec {
  fontSize: number;
  fontWeight: NonNullable<TextStyle['fontWeight']>;
  latinLineHeight: number;
  kind: VariantKind;
}

/** Design-system ranges: Nastaliq 1.8-2.2x, Noto Sans Arabic 1.4-1.6x. */
export const NASTALIQ_LINE_HEIGHT_RATIO = 2.0;
export const URDU_SANS_LINE_HEIGHT_RATIO = 1.5;
/** Prevents top-diacritic / bottom-descender clipping on Android views. */
export const NASTALIQ_VERTICAL_PADDING = 4;

const VARIANTS: Record<TextVariant, VariantSpec> = {
  display: { fontSize: 32, fontWeight: '700', latinLineHeight: 40, kind: 'numeric' },
  hero: { fontSize: 30, fontWeight: '700', latinLineHeight: 38, kind: 'ui' },
  h1: { fontSize: 24, fontWeight: '700', latinLineHeight: 32, kind: 'ui' },
  h2: { fontSize: 20, fontWeight: '600', latinLineHeight: 28, kind: 'ui' },
  h3: { fontSize: 18, fontWeight: '600', latinLineHeight: 24, kind: 'ui' },
  button: { fontSize: 18, fontWeight: '600', latinLineHeight: 24, kind: 'ui' },
  body: { fontSize: 16, fontWeight: '400', latinLineHeight: 24, kind: 'ui' },
  bodySecondary: { fontSize: 15, fontWeight: '400', latinLineHeight: 22, kind: 'ui' },
  caption: { fontSize: 13, fontWeight: '500', latinLineHeight: 18, kind: 'ui' },
  prose: { fontSize: 17, fontWeight: '400', latinLineHeight: 26, kind: 'prose' },
  proseLarge: { fontSize: 20, fontWeight: '400', latinLineHeight: 30, kind: 'prose' },
};

export function resolveTextStyle(script: TextScript, variant: TextVariant): TextStyle {
  const spec = VARIANTS[variant];
  const base = { fontSize: spec.fontSize, fontWeight: spec.fontWeight };

  if (script === 'latin' || spec.kind === 'numeric') {
    return {
      ...base,
      fontFamily: FontFamilies.latinSans,
      lineHeight: spec.latinLineHeight,
    };
  }

  if (spec.kind === 'prose') {
    return {
      ...base,
      fontFamily: FontFamilies.nastaliq,
      lineHeight: Math.round(spec.fontSize * NASTALIQ_LINE_HEIGHT_RATIO),
      paddingVertical: NASTALIQ_VERTICAL_PADDING,
    };
  }

  return {
    ...base,
    fontFamily: FontFamilies.urduSans,
    lineHeight: Math.round(spec.fontSize * URDU_SANS_LINE_HEIGHT_RATIO),
  };
}
