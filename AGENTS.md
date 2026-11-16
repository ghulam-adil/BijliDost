# AGENTS.md — Bijli Dost Engineering & AI Agent Guidelines

This document defines mandatory rules for all developers and AI coding agents working on **Bijli Dost** ("آپ کا بجلی کا بل، اب آسان!").

---

## 1. Product & Legal Boundaries (Non-Negotiable)

1. **Independent Educational & Assistance App**: Bijli Dost is an independent utility-bill explanation and household tracking tool. Never claim or imply affiliation with K-Electric, NEPRA, SNGPL, SSGC, or any government body.
2. **Do Not Clone KE Live**: Do not replicate K-Electric's proprietary app UI, branding, or private portal workflows.
3. **No Account Credentials or OTPs**: Never ask users for K-Electric (or any utility) account passwords, PINs, or OTPs. Never automate logins to utility portals.
4. **No Invented Tariffs or Taxes**: Never invent, guess, or hardcode K-Electric tariff slabs, fuel charge adjustments (FCA), QTA, GST, electricity duty, TV fee, income tax, or government notifications. All tariff configurations must be versioned, effective-dated, sourced from verified official NEPRA/K-Electric documents, and validated against real sample bills.
5. **No AI Calculation Engine**: Never use an LLM or probabilistic model to compute bill totals, slab breakdowns, taxes, or unit costs. All financial and unit calculations must be **100% deterministic**, pure TypeScript functions backed by versioned tariff configurations.
6. **Evidence-Based Explanations Only**: Never tell a user their bill is "wrong" or "overcharged" without deterministic, verifiable evidence. Clearly label any estimated, partial, or unverified calculation as **Estimated / Unverified**.

---

## 2. Architecture & Separation of Concerns

Follow a **feature-based modular architecture** with strict layer boundaries:

- **Presentation (`src/features/*/screens`, `src/features/*/components`, `src/components/`)**: UI only. No direct storage access, no tariff math.
- **Business Logic / Use Cases (`src/features/*/hooks`, `src/features/*/services`, `src/store/`)**: Orchestrates state, validation, and domain engines.
- **Bill Analysis Engine (`src/engines/bill-analysis/`)**: Pure, deterministic TypeScript. Zero React Native, Expo, or network dependencies. Must be 100% unit-testable in Node/Jest. Preserves unrecognized line items and produces structured evidence.
- **Provider Isolation (`src/providers/`)**: All utility-specific logic (K-Electric today; IESCO/LESCO/MEPCO/SNGPL/SSGC/Water later) must live behind a common `UtilityProviderAdapter` interface. Never leak K-Electric-specific field names or rules into shared UI or core engine types.
- **OCR Processing (`src/services/ocr/`)**: Encapsulates image preprocessing, OCR adapter abstraction (`OcrAdapter`), and raw-to-structured field mapping with per-field confidence metadata and bounding-box evidence. **Do not bind to a concrete OCR implementation until the evaluation plan is approved.**
- **Encrypted Local Storage (`src/services/storage/`)**: Bill records, consumption history, and personal references are stored locally in an encrypted database (`expo-sqlite` with SQLCipher).
  - Mandatory fail-closed initialization: verify `PRAGMA cipher_version` before setting key; never silently fall back to unencrypted SQLite.
  - Encryption keys are generated cryptographically and stored in `expo-secure-store`.
  - **Reserve `SecureStore` strictly for the database encryption key (and future auth tokens); never store complete bill records, line items, or bill images in `SecureStore`.**
  - **No permanent bill image retention in MVP**: temporary images are purged immediately after OCR processing across success, failure, and cancellation paths.
  - Non-sensitive user preferences (language, theme) may reside in `AsyncStorage`.
- **Localization (`src/i18n/`)**: Urdu (`ur`, RTL), Roman Urdu (`ur-Latn`, LTR), and English (`en`, LTR). Mixed typography strategy (`Noto Nastaliq Urdu` for long Urdu prose/voice scripts, `Noto Sans Arabic` for compact UI/tables, system sans for Latin/numerals). No hardcoded user-facing strings.
- **Voice Assistant (`src/services/speech/`)**: Abstracted TTS service (`TtsService`). Inspects device voice availability at runtime. **Urdu offline TTS is marked as an UNVERIFIED capability until verified on physical Android devices.** Always provide a graceful fallback to written Urdu when no Urdu voice is present.
- **Notification Management (`src/services/notifications/`)**: Expo Notifications scheduling for bill due-date reminders (100% offline).

---

## 3. TypeScript, Package & Build Discipline

- **Strict TypeScript**: `strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`. Never use `any` without a written justification comment.
- **Environment & Verified Versions**: Target **Expo SDK 58** (`react-native` 0.88, `react` 19.3.0, `expo-router` `~58.0.31`, `expo-sqlite` `~58.0.17`). Install all Expo packages using `npx expo install` rather than guessing package version numbers.
- **Build Target**: Plan strictly for **Expo Development Builds (`expo-dev-client`)** and **EAS Build**. **Do not rely on Expo Go** for native OCR, SQLCipher, or custom Urdu font testing.
- **Small, Single-Purpose Modules**: Avoid giant components (>200 lines) or monolithic files. Extract reusable hooks and pure helper functions.
- **No Duplicated Logic**: Parameterize shared behaviors instead of copy-pasting across providers, languages, or screens.
- **Validation at Boundaries**: Use **Zod** schemas for all external inputs (OCR output, form inputs, local storage payloads, tariff config JSON).
- **Logging Hygiene**: Never log consumer names, account numbers, consumer numbers, addresses, phone numbers, raw OCR text containing PII, or bill images.

---

## 4. Accessibility, Typography & Low-End Device Rules

- **Urdu-First & RTL-Ready**: Every layout must support RTL (`I18nManager` / directional styles like `marginStart`, `paddingEnd`, `flexDirection`). Test mixed RTL Urdu text with LTR numbers (e.g., `Rs. 4,520`, `245 kWh`) using Unicode bidirectional isolation (`\u2066...\u2069`).
- **Mixed Typography & Font Metrics**:
  - `Noto Nastaliq Urdu` for Urdu explanations and voice text: requires 1.8–2.2× `lineHeight` and vertical padding to prevent diacritic/ligature clipping.
  - `Noto Sans Arabic` for compact UI buttons, tab bars, input labels, and tables: 1.4–1.6× `lineHeight`.
  - System sans-serif for Latin/numerals.
- **Accessible Touch Targets**: Minimum 48×48 dp touch targets (56 dp for primary CTAs). High contrast ratios (WCAG AA minimum, AAA preferred for primary text).
- **Low-End Android Performance**: Avoid heavy blur effects, expensive shadow stacks, or unoptimized full-resolution bitmaps in memory. Compress/resize bill images before OCR.
- **Minimal Typing**: Prefer camera/gallery scan, one-tap selection, steppers, and voice guidance over long text forms.

---

## 5. Testing & Milestone Discipline

- **Unit Tests**: All pure business logic (bill analysis engine, OCR field parsers, Zod schemas, date/reminder calculators, provider adapters) must have unit tests.
- **OCR Review Mandate**: Every OCR-extracted field with low/medium confidence—and all critical billing fields (units, total payable, due date, consumer/account reference)—must pass through a user-reviewable confirmation step before analysis or saving.
- **Gated Milestones**: Do not start any implementation milestone or install dependencies without explicit user review and approval. Do not implement tariff calculations until official source documents and sample bills have been reviewed.
