# DESIGN_SYSTEM.md — Bijli Dost

**Design Philosophy:** Calm, trustworthy, Urdu-first, zero clutter, built for elderly users and low-end Android phones.

---

## 1. Mixed Typography Strategy & Verification

Rendering Urdu text in mobile applications presents distinct typographic challenges: traditional Nastaliq script is vertically cascading with tall ascenders, deep descenders, and intricate diacritics (nuqtas, A'raab), whereas modern app UI (compact buttons, tab bars, dense tables) requires predictable baseline heights and tight line-boxes.

Bijli Dost adopts a **purpose-driven mixed typography system**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MIXED TYPOGRAPHY ROLES                          │
├─────────────────────────┬──────────────────────────────────────────────┤
│ 1. Noto Nastaliq Urdu   │ - Urdu bill explanations & plain summaries   │
│    (Editorial / Prose)  │ - Voice readout (TTS) display text           │
│                         │ - Onboarding welcome & guidance paragraphs   │
├─────────────────────────┼──────────────────────────────────────────────┤
│ 2. Noto Sans Arabic     │ - Compact UI buttons & chips (CTA min-h 56dp)│
│    (UI / Tabular / Nav) │ - Bottom tab navigation labels               │
│                         │ - Bill review input labels & table headers   │
│                         │ - Numeric line-item lists                    │
├─────────────────────────┼──────────────────────────────────────────────┤
│ 3. System Sans (Latin)  │ - English & Roman Urdu strings               │
│    (Roboto / SF Pro)    │ - Numeric values (PKR, kWh, dates)           │
└─────────────────────────┴──────────────────────────────────────────────┘
```

### 1.1. Urdu Character Support & Shaping Verification Checklist
Both `Noto Nastaliq Urdu` and `Noto Sans Arabic` must be verified against the full Urdu Unicode block:
- **Urdu-Specific Characters**:
  - `ٹ` (U+0679), `ڈ` (U+0688), `ڑ` (U+0691)
  - `پ` (U+067E), `چ` (U+0686), `ژ` (U+0698), `گ` (U+06AF)
  - `ں` (Noon Ghunna, U+06BA), `ں` in medial forms
  - `ھ` (Do-chashmi He, U+06BE) vs `ہ` (Gol He, U+06C1)
  - `ے` (Bari Ye, U+06D2) vs `ی` (Chhoti Ye, U+06CC)
  - `ئ` (Hamza on Ye, U+0626), `ؤ` (Hamza on Waw, U+0624)
- **A'raab & Diacritics**:
  - Zer (`ِ` U+0650), Zabar (`َ` U+064E), Pesh (`ُ` U+064F)
  - Do-Zabar / Tanween (`ً` U+064B)
  - Sukoon / Jazm (`ْ` U+0652), Tashdeed (`ّ` U+0651), Khari Zabar (`ٰ` U+0670)
- **Urdu Numerals & Punctuation**:
  - Eastern Arabic-Indic digits: `۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹` (U+06F0–U+06F9)
  - Urdu comma (`،` U+060C), semicolon (`؛` U+061B), question mark (`؟` U+061F), Urdu full stop (`۔` U+06D4)

### 1.2. Line-Height & Clipping Prevention Rules
- **Noto Nastaliq Urdu**:
  - Requires **`lineHeight` of 1.8× to 2.2× of `fontSize`** (e.g., `fontSize: 18`, `lineHeight: 36`).
  - Container views must supply vertical padding (`paddingVertical: 4–8dp`) to prevent native Android view clipping on top diacritics and bottom descenders.
  - Never set `numberOfLines={1}` with `ellipsizeMode="tail"` on Nastaliq body text.
- **Noto Sans Arabic**:
  - Uses standard **`lineHeight` of 1.4× to 1.6× of `fontSize`**.
  - Provides consistent vertical metrics for compact buttons, chips, and tight tabular rows.
- **Font Fallback Stack**:
  - Android: `NotoNastaliqUrdu-Regular`, `NotoSansArabic-Regular`, `sans-serif`.
  - iOS: `NotoNastaliqUrdu`, `GeezaPro`, `system-ui`.

### 1.3. Bidirectional (Bidi) Text & Numeric Formatting
When LTR numbers (e.g. `Rs. 4,520`, `245 kWh`, `18 Nov 2026`) and 13-digit consumer reference numbers (e.g. `0400012345678`) are embedded inside RTL Urdu sentences, bidirectional algorithms can cause digits, signs, or units to flip or render in reverse order.

**Mandatory Rule:** All embedded numbers, currencies, dates, unit quantities, and reference numbers must be wrapped using **Unicode Bidi Isolation markers**:
```typescript
// LTR isolate: \u2066 ... \u2069 (PDI - Pop Directional Isolate)
export function bidiIsolate(text: string | number): string {
  return `\u2066${text}\u2069`;
}

// Example usage in Urdu string:
// "آپ کا اکاؤنٹ نمبر " + bidiIsolate("0400012345678") + " ہے اور واجب الادا رقم " + bidiIsolate("Rs. 4,520") + " ہے۔"
// Ensures "0400012345678" and "Rs. 4,520" stay strictly LTR without corrupting surrounding Urdu RTL flow.
```

### 1.4. RTL Alignment & Directional Layout Rules
- Never use physical `left` or `right` properties in styles.
- Always use logical directional properties:
  - `marginStart` / `marginEnd`
  - `paddingStart` / `paddingEnd`
  - `alignItems: 'flex-start'` (resolves correctly to the start side in RTL/LTR)
- For text elements: use `textAlign: 'auto'` so text naturally aligns right in Urdu and left in English/Roman Urdu, or use explicit logical alignment helpers.

---

## 2. Accessible Color Palette

All color pairs are verified for WCAG AA (minimum 4.5:1 for body text) and WCAG AAA (minimum 7:1) contrast against their respective backgrounds.

| Token | Hex | Role | Contrast Ratio |
|---|---|---|---|
| `bgPrimary` | `#F7FAF8` | Screen background (warm off-white, anti-glare) | — |
| `bgSurface` | `#FFFFFF` | Cards, modals, text inputs | — |
| `textPrimary` | `#0F1F18` | Primary text (Urdu, English, Roman Urdu) | >14:1 on `#FFFFFF` (AAA) |
| `textSecondary` | `#3D5248` | Supporting text, captions, secondary labels | >7:1 on `#FFFFFF` (AAA) |
| `brandPrimary` | `#0E7C5B` | Primary action buttons, active tab indicators | >5.0:1 on `#FFFFFF` (AA) |
| `brandPrimaryDark` | `#095C43` | Pressed states, high-emphasis headers | >7.8:1 on `#FFFFFF` (AAA) |
| `statusVerified` | `#166534` | Verified bill data, paid badge text | >6.5:1 on `#DCFCE7` (AA) |
| `statusVerifiedBg` | `#DCFCE7` | Verified badge container background | — |
| `statusReview` | `#92400E` | OCR uncertain field / Needs user check | >5.8:1 on `#FEF3C7` (AA) |
| `statusReviewBg` | `#FEF3C7` | Needs review container background | — |
| `statusAlert` | `#991B1B` | Urgent due date / Overdue alert | >6.2:1 on `#FEE2E2` (AA) |
| `statusAlertBg` | `#FEE2E2` | Alert container background | — |
| `borderDefault` | `#D6E0DC` | Card, divider, and input borders | Crisp 1px boundary |

---

## 3. Typography Scale & Hierarchy

All sizes support OS system font scaling up to **1.3×** without clipping or overlap.

```typescript
export const Typography = {
  // Editorial / Explanation (Noto Nastaliq Urdu)
  nastaliqBodyLarge: {
    fontFamily: 'NotoNastaliqUrdu-Regular',
    fontSize: 20,
    lineHeight: 40, // 2.0x
  },
  nastaliqBody: {
    fontFamily: 'NotoNastaliqUrdu-Regular',
    fontSize: 17,
    lineHeight: 34, // 2.0x
  },

  // Compact UI & Buttons (Noto Sans Arabic for UR / System Sans for EN)
  uiDisplayAmount: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  uiH1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  uiH2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  uiButtonLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  uiBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  uiCaption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
};
```

---

## 4. UI Components & Interaction Standards

1. **Touch Targets**:
   - Minimum tap target: **48×48 dp**.
   - Primary Action Button (`AccessibleButton`): **Min-height 56 dp** (full width or large pill).
2. **Minimal Typing**:
   - Free-text inputs are avoided wherever possible.
   - For bill review: numeric-only keypad (`keyboardType="numeric"`), custom date picker for due date, and one-tap selection chips for categories.
3. **Low-End Android Optimization**:
   - Zero blur views (`BlurView` is prohibited).
   - Flat 1px border (`#D6E0DC`) + subtle elevation (`elevation: 1–2` on Android).
   - Minimal layout animations; respect OS "Reduce Motion" setting.
4. **Uncertain Field Visual Cue**:
   - Fields requiring user review have a distinct amber border (`#D97706`), an amber background tint (`#FEF3C7`), and an explicit icon prompt (*"براہ کرم چیک کریں"* / *"Please verify"*).
