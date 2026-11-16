# IMPLEMENTATION_PLAN.md — Bijli Dost

**Rule:** Do not start any implementation milestone until the preceding milestone's exit criteria are met and approved. Do not write application code or install dependencies in Milestone 0.

---

## Milestone 0: Architecture, Safety Rules & Evaluation Protocols (Current)
**Goal:** Establish architecture, fail-closed SQLCipher security design, mixed typography verification, OCR candidate evaluation plan, and collect verified K-Electric ground truth before writing application code.
- **Deliverables:**
  - `AGENTS.md`, `PRODUCT_REQUIREMENTS.md`, `TECHNICAL_ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`, `DESIGN_SYSTEM.md`, `SECURITY_GUIDELINES.md`, `BILL_ANALYSIS_RULES.md`, `CHANGELOG.md`.
- **Ground Truth & Evaluation Prerequisites:**
  - Collect 5–10 real, anonymized K-Electric sample bills (Protected, Non-Protected, different months).
  - Obtain official current NEPRA / K-Electric tariff schedule PDFs and tax notifications.
  - Review and approve the OCR evaluation protocol against the sample bills.
  - Review the encrypted storage architecture (`expo-sqlite` with SQLCipher + `expo-secure-store` fail-closed design).
- **Exit Criteria:** User reviews and approves updated architecture documents and gives explicit approval to proceed to Milestone 1.

---

## Milestone 1: Expo Bootstrap, Navigation, Mixed Typography & Development Build
**Goal:** Initialize Expo SDK 58 project with development build support, verify bottom tab navigation, load dual Urdu fonts, and validate RTL layouts on a physical Android device.
- **Verified Package Baseline (Expo SDK 58 via `npx expo install`):**
  - `expo`: `~58.0.0`
  - `react-native`: `0.88.x`
  - `react`: `19.3.0`
  - `expo-router`: `~58.0.31`
  - `expo-dev-client`: SDK 58 aligned
  - `expo-localization`, `expo-font`, `react-native-safe-area-context`, `react-native-screens`
  - `@reduxjs/toolkit`, `react-redux`, `zod`
- **Tasks:**
  1. Initialize clean project repository via `npx create-expo-app@latest` and configure `tsconfig.json` (`strict: true`, path alias `@/* -> src/*`).
  2. Install `expo-dev-client` and configure Android development build configuration (`app.config.ts`).
  3. Implement `src/theme/` design tokens (colors, accessible touch targets >=48 dp, spacing).
  4. Load and configure mixed typography: `Noto Nastaliq Urdu` (prose/voice scripts), `Noto Sans Arabic` (compact UI buttons/labels/tables), and system sans-serif (Latin/numerals).
  5. Write typography shaping and bidi tests: verify diacritics, joined ligatures, and bidirectional isolation (`\u2066...\u2069`) on reference numbers (`0400012345678`) and currency (`Rs. 4,520`).
  6. Implement `src/i18n/` (`ur`, `ur-Latn`, `en`) with RTL toggling and directional helpers.
  7. Build `src/components/ui/` primitives (`AccessibleButton`, `Card`, `ConfidenceBadge`, `Chip`).
  8. Build Welcome & Language Selection screen (`app/onboarding.tsx`) and Home Dashboard shell (`app/(tabs)/index.tsx`).
- **Milestone 1 Exit Criteria (Must be fully demonstrated):**
  - [ ] Android development build successfully generated.
  - [ ] App successfully installed and launched on a physical Android device.
  - [ ] Web startup tested separately.
  - [ ] Urdu RTL and mixed font rendering tested on the physical device with zero text clipping up to 1.3× scale.
  - *(Note: Native SQLCipher database functionality is NOT tested in Milestone 1; it is scheduled for Milestone 2).*

---

## Milestone 2: Encrypted Local Storage, Bill History & Preferences
**Goal:** Reliable offline persistence for bills and user preferences using fail-closed SQLCipher encryption.
- **Verified Package Baseline (Expo SDK 58 via `npx expo install`):**
  - `expo-sqlite`: `~58.0.17` (with `useSQLCipher: true` config plugin)
  - `expo-secure-store`
  - `expo-crypto`
  - `@react-native-async-storage/async-storage`
- **Tasks:**
  1. Configure `app.config.ts` plugin `["expo-sqlite", { "useSQLCipher": true }]`.
  2. Implement `src/services/storage/databaseKeyManager.ts`: handle SecureStore key generation, retrieval, and platform uninstall matrix (Android Keystore reset vs iOS Keychain persistence).
  3. Implement `src/services/storage/encryptedBillDatabase.ts` with mandatory fail-closed sequence:
     - Check `PRAGMA cipher_version;`. Halt immediately if unavailable; never silently fall back to unencrypted SQLite.
     - Apply `PRAGMA key = '...'` and verify access with test query.
     - Create `bills` table with strict Zod validation.
  4. Add automated security test asserting that a build lacking SQLCipher throws `FatalSecurityError` and halts.
  5. Implement `src/services/storage/preferenceStorage.ts`: backed by `AsyncStorage` for non-sensitive UI settings (language, theme).
  6. Implement `src/store/slices/billsSlice.ts` and `src/store/slices/preferencesSlice.ts`.
  7. Build Local Bill History screen (`app/(tabs)/history.tsx`) with empty state, month sorting, delete action, and "Mark as Paid" toggle.
  8. Build Settings data management controls:
     - "Export My Bills" (decrypted JSON export with prominent security warning).
     - "Clear All Data" (atomically deletes SQLite file and removes SecureStore key across Android and iOS).
- **Exit Criteria:** Bills persist encrypted at rest across app restarts; unit tests verify that database file cannot be read without SQLCipher key; zero bill data stored in SecureStore; fail-closed behavior verified.

---

## Milestone 3: Camera Capture, Cropping, OCR Candidate Evaluation & Manual Review
**Goal:** Capture or pick bill image, crop/rotate it, execute the on-device OCR candidate evaluation, and present a mandatory manual review screen.
- **Verified Package Baseline (Expo SDK 58 via `npx expo install`):**
  - `expo-camera`, `expo-image-picker`, `expo-image-manipulator`
  - `react-hook-form`, `@hookform/resolvers`
  - On-device OCR library (selected after candidate evaluation report approval)
- **Tasks:**
  1. Implement camera capture (`expo-camera`) and gallery pick (`expo-image-picker`) with visual alignment overlay.
  2. Implement `app/bill/crop.tsx` with `expo-image-manipulator` (free crop, 90° rotation, downscale/compress for memory efficiency).
  3. **Execute OCR Evaluation**: Run the evaluated on-device OCR candidates against 5–10 anonymized sample bills; submit field-level accuracy and latency report for user sign-off.
  4. Implement `OcrAdapter` with the approved library + `kelectric` field parser with per-field confidence (`high`, `medium`, `low`, `missing`) and bounding-box coordinates.
  5. Implement `app/bill/review.tsx` with React Hook Form + Zod, highlighting uncertain/missing fields in amber for mandatory user verification.
  6. Implement immediate temp image purge in a `finally` block across success, failure, and cancellation. No permanent bill image retention in MVP.
- **Exit Criteria:** End-to-end scan → crop → OCR → manual review → encrypted local save flow succeeds on a physical Android Development Build (2–4 GB RAM) without out-of-memory errors; temporary images are purged from cache.

---

## Milestone 4: Deterministic Bill Analysis Engine (Gated on Official Docs)
**Goal:** Pure TypeScript K-Electric bill analysis engine, versioned tariff registry, and line-item preservation.
- **Prerequisite:** Official NEPRA/KE tariff notifications and anonymized sample bills verified and documented in `BILL_ANALYSIS_RULES.md`.
- **Tasks:**
  1. Encode versioned tariff JSON schema and Zod validator in `src/providers/kelectric/tariffs/`.
  2. Implement pure TypeScript analyzer in `src/engines/bill-analysis/` (slab calculations, tax breakdown, unit comparison deltas).
  3. Preserve unrecognized line items in `unclassifiedLineItems`.
  4. Write comprehensive Jest unit tests covering:
     - Residential A-1R Protected (<200 units).
     - Residential A-1R Non-Protected (>200 units).
     - Bills falling outside verified tariff periods (flagged as `UNVERIFIED_TARIFF_PERIOD`).
- **Exit Criteria:** 100% deterministic test pass rate against verified real sample bills; zero probabilistic or LLM calculation code; unclassified items preserved cleanly.

---

## Milestone 5: Bill Explanation, Monthly Unit Comparison & Urdu TTS
**Goal:** Deliver clear, calm bill explanations, visual unit comparison charts, and Urdu voice playback with graceful fallback.
- **Verified Package Baseline (Expo SDK 58 via `npx expo install`):**
  - `expo-speech`, `react-native-svg`
- **Tasks:**
  1. Build Bill Explanation screen (`app/bill/[id].tsx`):
     - What you used (units, meter delta).
     - Where the money goes (plain Urdu/Roman Urdu/English breakdown).
     - Unclassified line items section.
     - Verification status badge and disclaimer footer.
  2. Build Monthly Unit Comparison screen (`app/bill/comparison.tsx`) using `react-native-svg` bar/line charts.
  3. Implement `src/services/speech/ttsService.ts` (`expo-speech`):
     - Inspect available device voices via `Speech.getAvailableVoicesAsync()`.
     - Verify whether an Urdu voice (`ur-PK` / `ur`) is installed on the physical device.
     - If voice exists: enable speech synthesis with Play/Pause/Stop controls.
     - If voice is missing: display notice and render the **Full Written Urdu Explanation Card** with an optional help guide for installing Google TTS Urdu data.
- **Exit Criteria:** Elderly-friendly layout with readable Nastaliq text; SVG chart scales on 720p Android displays; Urdu TTS speaks clearly when voice is present or gracefully falls back to written explanation when voice is absent.

---

## Milestone 6: Due-Date Reminders & Complaint Guidance
**Goal:** Offline local due-date alerts and official public complaint guidance.
- **Verified Package Baseline (Expo SDK 58 via `npx expo install`):**
  - `expo-notifications`
- **Tasks:**
  1. Implement `src/services/notifications/reminderService.ts` (schedules local notifications for 3 days before, 1 day before, and due-day morning).
  2. Build Complaint Guidance screen (`app/(tabs)/complaints.tsx`) covering common issues (Meter reading mismatch, Overbilling, Defective meter, Load shedding) with official public channels (`118`, SMS, KE portal links) and a pre-call checklist.
  3. Add reminder toggle settings in `src/features/settings/`.
- **Exit Criteria:** Scheduled local notifications trigger correctly on Android without server dependencies; complaint guide contains zero credential requests or false affiliation claims.

---

## Milestone 7: Low-End Android Optimization, Security Audit & Release Prep
**Goal:** Production hardening and EAS Build setup.
- **Tasks:**
  1. Performance & memory profiling on low-end Android device (2–3 GB RAM).
  2. Accessibility audit: high-contrast text, touch targets >=48 dp, TalkBack/VoiceOver labels, font scale 1.3× check.
  3. Security audit against `SECURITY_GUIDELINES.md`: verify SQLCipher encryption on disk, verify zero PII in logs, verify temp file deletion, verify no hardcoded secrets.
  4. EAS Build configuration (`eas.json`) for Android APK/AAB and iOS IPA.
- **Exit Criteria:** Zero high/critical defects; 100% unit test pass rate; release build generated cleanly via EAS.
