# CHANGELOG.md — Bijli Dost

All notable changes to this project will be documented in this file.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.5.0-m1] — 2026-11-16

### Added
- **Milestone 1: Project Foundation & Initial Screens**:
  - Initialized Expo SDK 58 application structure with React Native 0.88, React 19.3.0, TypeScript `strict: true`, and Expo Router `~58.0.31`.
  - Added `expo-dev-client` for native Android development builds.
  - Implemented Redux Toolkit store (`store/index.ts`, `store/hooks.ts`) with `preferencesSlice` (language, onboarding, theme) and `billsSlice` (active draft state).
  - Implemented comprehensive design system tokens: accessible color palette (WCAG AAA/AA compliant), touch targets (>=48dp, 56dp for primary CTAs), and spacing metrics (`src/theme/`).
  - Implemented mixed typography foundations: `Noto Nastaliq Urdu` (1.8–2.2× line-height) and `Noto Sans Arabic` (1.4–1.6× line-height) with system font fallbacks.
  - Implemented localization for Urdu (`ur`), Roman Urdu (`ur-Latn`), and English (`en`) with RTL/LTR management and directional layout utilities (`src/i18n/`).
  - Implemented Unicode Bidirectional (Bidi) text isolation utilities (`src/utils/bidi.ts`) to isolate LTR reference numbers (`0400012345678`), PKR currency, dates, and kWh units inside Urdu RTL text.
  - Built reusable, accessible UI primitives:
    - `AccessibleButton` (min-height 56dp, high-contrast, loading spinner, disabled state)
    - `Card` (low-end friendly 1px border, subtle elevation, no blur)
    - `Chip` (selection chip for languages/categories)
    - `ConfidenceBadge` (verified, needsReview, alert, neutral)
    - `ScreenContainer` (anti-glare background `#F7FAF8`, SafeAreaView, scrollable option)
    - `ErrorBoundary` (graceful Urdu/English crash recovery)
  - Built initial screens:
    - **Welcome / Onboarding (`app/onboarding.tsx`)**: Bijli Dost branding, tagline, 3-language selector, independence disclaimer, and continue CTA.
    - **Home Dashboard (`app/(tabs)/index.tsx`)**: Welcome greeting, prominent Scan Bill CTA card, Recent Bills empty state, Monthly Consumption empty state, and Quick Help card.
    - **Tab Layout & Navigation (`app/(tabs)/_layout.tsx`)**: Polished bottom navigation for Home, Scan, History, and Complaints.
    - **Scan Screen Placeholder (`app/(tabs)/scan.tsx`)**: Camera reticle alignment guide and Milestone 3 notice.
    - **History Screen Placeholder (`app/(tabs)/history.tsx`)**: Encrypted storage notice and empty state.
    - **Complaints Screen (`app/(tabs)/complaints.tsx`)**: Official K-Electric helpline 118, SMS 8119, and pre-call checklist.
  - Added unit test suites for bidi isolation, localization key parity, and Redux preferences slice.

## [0.4.0-docs] — 2026-11-16

### Changed
- Corrected `expo-sqlite` version to `~58.0.17` and `expo-router` to `~58.0.31`.
- Enforced fail-closed SQLCipher initialization (`PRAGMA cipher_version` verification).
- Documented platform-specific SecureStore uninstall behavior (Android keystore reset vs. iOS keychain persistence).
- Explicitly prohibited permanent bill image retention in MVP.
- Added `expo-dev-client` to Milestone 1 dependencies and refined physical device testing exit criteria.

## [0.3.0-docs] — 2026-11-16

### Changed
- Expo Router version corrected to `~58.0.x`.
- Encrypted local storage established with `expo-sqlite` (SQLCipher) and `expo-secure-store`.
- Urdu TTS classified as UNVERIFIED pending device checks, with graceful written fallback.

## [0.2.0-docs] — 2026-11-16

### Changed
- Local-first MVP architecture pivot: removed cloud database / Supabase dependencies from MVP.
- Formulated on-device OCR candidate evaluation matrix for Expo SDK 58.
- Established mixed Urdu typography system (`Noto Nastaliq Urdu` + `Noto Sans Arabic`).

## [0.1.0-docs] — 2026-11-12

### Added
- Initial project governance documentation (`AGENTS.md`, `PRODUCT_REQUIREMENTS.md`, `TECHNICAL_ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `DESIGN_SYSTEM.md`, `SECURITY_GUIDELINES.md`, `BILL_ANALYSIS_RULES.md`, `CHANGELOG.md`).
