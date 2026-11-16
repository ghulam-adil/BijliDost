# TECHNICAL_ARCHITECTURE.md — Bijli Dost

**Version:** 0.4.0 (Security & Runtime Hardened Architecture)  
**Target Platform:** Android (primary, low-end friendly, API 26+) & iOS (iOS 15+) via Expo React Native  
**Runtime Baseline:** Expo SDK 58, React Native 0.88, React 19.3.0, TypeScript `strict: true`

---

## 1. Architectural Principles

1. **Feature-Based Modular Architecture**: Features (`onboarding`, `dashboard`, `scanner`, `bill-review`, `bill-explanation`, `comparison`, `history`, `complaints`, `settings`) encapsulate their screens, feature components, and hooks.
2. **Strict Layer Separation**:
   - **Presentation Layer (`app/`, `src/components/`, `src/features/*/screens`)**: React Native UI components + Expo Router routes. Zero tariff math, zero raw storage access.
   - **Business Logic Layer (`src/features/*/hooks`, `src/store/`)**: Redux Toolkit slices and Zod-validated orchestration.
   - **Bill Analysis Engine (`src/engines/bill-analysis/`)**: Pure, deterministic TypeScript with zero React Native, Expo, or network imports. 100% testable in Node/Jest. Preserves unrecognized line items and produces structured evidence.
   - **Provider Isolation (`src/providers/`)**: Utility-specific parsing, field mappings, complaint channels, and tariff schemas live in `src/providers/<provider-id>/` behind `UtilityProviderAdapter`.
   - **Infrastructure Services (`src/services/`)**: Isolated adapters for OCR (`src/services/ocr/`), Storage (`src/services/storage/`), Speech (`src/services/speech/`), and Notifications (`src/services/notifications/`).
3. **Local-First & Encrypted by Default**:
   - Zero mandatory authentication, zero user accounts, zero cloud database dependencies for MVP.
   - Bill records, consumption history, and consumer references are stored locally in an **encrypted database (`expo-sqlite` with SQLCipher)**.
   - **Mandatory Fail-Closed SQLCipher Initialization**: The engine verifies `PRAGMA cipher_version` before setting the key. It **never silently falls back to unencrypted SQLite**.
   - Database encryption keys are generated cryptographically and stored in `expo-secure-store`.
   - Complete bills and bill images are **never stored in `SecureStore`**.
   - **No Permanent Bill Image Retention in MVP**: Temporary camera/crop images are deleted immediately after OCR across success, failure, and cancellation paths.
   - Non-sensitive preferences (language, theme) reside in `AsyncStorage`.
4. **Development & Native Build Discipline**:
   - Built on **Expo Development Builds (`expo-dev-client`)** and **EAS Build**.
   - **Do not depend on Expo Go** for native OCR, SQLCipher, or custom Urdu font verification.
   - All Expo packages must be installed using `npx expo install` to guarantee SDK 58 version alignment.

---

## 2. Complete Folder Structure

```text
BijliDost/
├── .env.example                         # Build-time environment config template
├── .gitignore                           # Ignores .env*, node_modules, android/, ios/, certs
├── app.config.ts                        # Dynamic Expo config (plugins: expo-sqlite with SQLCipher)
├── package.json                         # Verified against Expo SDK 58
├── tsconfig.json                        # strict: true, path aliases (@/* -> src/*)
├── AGENTS.md                            # AI agent & engineering guidelines
├── BILL_ANALYSIS_RULES.md               # Deterministic bill calculation & tariff rules
├── CHANGELOG.md                         # Project changelog
├── DESIGN_SYSTEM.md                     # Mixed typography, RTL/bidi, colors, tokens
├── IMPLEMENTATION_PLAN.md               # Milestone-gated roadmap (Milestones 0–7)
├── PRODUCT_REQUIREMENTS.md              # MVP requirements & non-goals
├── SECURITY_GUIDELINES.md               # PII redaction, encrypted storage, security rules
├── TECHNICAL_ARCHITECTURE.md            # System architecture, storage security, OCR eval
├── app/                                 # Expo Router file-based routes (thin wrappers)
│   ├── _layout.tsx                      # Root layout (Redux Provider, i18n, Theme, SafeArea)
│   ├── index.tsx                        # Entry redirect (onboarding vs. tabs)
│   ├── onboarding.tsx                   # Welcome & language selection
│   ├── (tabs)/
│   │   ├── _layout.tsx                  # Bottom tabs (Home, Scan, History, Help)
│   │   ├── index.tsx                    # Simple Home Dashboard
│   │   ├── scan.tsx                     # Scan / Pick Bill entry
│   │   ├── history.tsx                  # Encrypted Local Bill History
│   │   └── complaints.tsx               # Complaint Guidance & Settings
│   └── bill/
│       ├── crop.tsx                     # Image crop & 90° rotation
│       ├── review.tsx                   # OCR field review & manual correction (mandatory gate)
│       ├── [id].tsx                     # Bill Explanation + Urdu TTS (with written fallback)
│       └── comparison.tsx               # Monthly Unit Comparison charts
├── src/
│   ├── components/                      # Shared UI primitives
│   │   ├── ui/                          # AccessibleButton, Card, ConfidenceBadge, Chip
│   │   ├── layout/                      # ScreenContainer, RTLRow, BidiText
│   │   └── charts/                      # Reusable react-native-svg bar/line charts
│   ├── features/                        # Feature modules (UI + hooks + state)
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── scanner/
│   │   ├── bill-review/
│   │   ├── bill-explanation/
│   │   ├── comparison/
│   │   ├── history/
│   │   ├── complaints/
│   │   └── settings/
│   ├── engines/                         # Pure TypeScript domain engines (NO RN/Expo imports)
│   │   └── bill-analysis/
│   │       ├── types.ts                 # CanonicalBill, BillLineItem, AnalysisResult, Confidence
│   │       ├── analyzer.ts              # Pure deterministic breakdown & delta calculator
│   │       ├── tariffRegistry.ts        # Versioned tariff config loader & Zod validator
│   │       └── __tests__/
│   ├── providers/                       # Isolated utility provider adapters
│   │   ├── types.ts                     # UtilityProviderAdapter interface
│   │   ├── registry.ts                  # Provider lookup (kelectric; future: lesco, sngpl...)
│   │   └── kelectric/
│   │       ├── adapter.ts               # KE-specific field parser & complaint channels
│   │       ├── schemas.ts               # Zod schemas for KE extracted bill fields
│   │       ├── tariffs/                 # Versioned local tariff JSON files (empty until verified)
│   │       └── __tests__/
│   ├── services/                        # Device & infrastructure adapters
│   │   ├── ocr/
│   │   │   ├── types.ts                 # OcrAdapter, OcrRawResult, FieldConfidence, BoundingBox
│   │   │   ├── imagePreprocessor.ts     # Resize, compress, rotate via expo-image-manipulator
│   │   │   ├── mockOcrAdapter.ts        # Mock adapter for unit/integration testing
│   │   │   └── index.ts                 # Adapter factory (concrete adapter injected after eval)
│   │   ├── storage/
│   │   │   ├── types.ts                 # BillRepository, PreferenceRepository interfaces
│   │   │   ├── databaseKeyManager.ts    # SecureStore key lifecycle & edge-case handling
│   │   │   ├── encryptedBillDatabase.ts # expo-sqlite + SQLCipher fail-closed persistence
│   │   │   └── preferenceStorage.ts     # AsyncStorage for non-sensitive preferences
│   │   ├── speech/
│   │   │   ├── types.ts                 # TtsService interface & VoiceAvailability status
│   │   │   └── ttsService.ts            # expo-speech wrapper with runtime voice check & fallback
│   │   └── notifications/
│   │       └── reminderService.ts       # expo-notifications due-date scheduler (100% offline)
│   ├── i18n/                            # Localization (ur, ur-Latn, en)
│   │   ├── index.ts
│   │   ├── rtl.ts                       # Directional styles & bidi isolation utilities
│   │   └── locales/
│   │       ├── ur.json                  # Urdu translations
│   │       ├── ur-Latn.json             # Roman Urdu translations
│   │       └── en.json                  # English translations
│   ├── store/                           # Redux Toolkit store & slices
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── preferencesSlice.ts      # Language, theme, TTS speed, reminder preferences
│   │       └── billsSlice.ts            # Active bill draft, local bills cache, filters
│   ├── theme/                           # Colors, mixed typography tokens, spacing
│   ├── utils/                           # Formatting (PKR, dates, bidi numbers), PII redaction
│   └── config/                          # Typed client config (app version, supported providers)
└── assets/
    ├── fonts/                           # NotoNastaliqUrdu, NotoSansArabic (compact UI)
    └── images/
```

---

## 3. Technology Stack & Verified Package Baseline

Starting with **Expo SDK 55**, Expo synchronized major version numbering of core packages with the SDK release. In **Expo SDK 58**, all official packages must be installed using `npx expo install` to guarantee that the Expo CLI resolves the exact peer-matched versions.

| Capability | Package / Technology | Verified Version (SDK 58) | Notes & Official Documentation Reference |
|---|---|---|---|
| **Core Framework** | `expo` | `~58.0.0` | Official Expo SDK 58 release baseline. |
| **Mobile Runtime** | `react-native` | `0.88.x` | React Native 0.88 with New Architecture support. |
| **UI Library** | `react` | `19.3.0` | React 19.3.0 baseline for SDK 58. |
| **Navigation & Routing** | `expo-router` | `~58.0.31` | Synchronized SDK 58 release (`expo.dev/router`). Stable native tabs, async web routes. |
| **Development Build Client** | `expo-dev-client` | SDK 58 aligned | Required for native modules (SQLCipher, on-device OCR, custom fonts). |
| **Safe Area & Screens** | `react-native-safe-area-context`, `react-native-screens` | SDK 58 aligned | Managed via `npx expo install`. |
| **State Management** | `@reduxjs/toolkit`, `react-redux` | `^2.5.x`, `^9.2.x` | Predictable local state, zero network overhead. |
| **Validation & Schemas** | `zod` | `^3.24.x` | Strict boundary validation for tariff configs, forms, and OCR data. |
| **Form Management** | `react-hook-form`, `@hookform/resolvers` | `^7.54.x`, `^3.10.x` | Uncontrolled inputs for low-end Android performance. |
| **Encrypted Local Database** | `expo-sqlite` (with SQLCipher) | `~58.0.17` | Official SDK 58 release (`expo.dev/versions/latest/sdk/sqlite/`). |
| **Secure Key Storage** | `expo-secure-store` | SDK 58 aligned | **Reserved strictly for the 256-bit database encryption key.** Never for full bills. |
| **Non-Sensitive Preferences** | `@react-native-async-storage/async-storage` | SDK 58 aligned | Unencrypted storage for UI preferences (language, theme). |
| **Image Capture & Cropping** | `expo-camera`, `expo-image-picker`, `expo-image-manipulator` | SDK 58 aligned | Image capture, gallery pick, 90° rotation, downscaling/compression before OCR. |
| **Speech (TTS)** | `expo-speech` | SDK 58 aligned | Abstracted wrapper. **Urdu TTS marked as UNVERIFIED pending device checks.** |
| **Reminders** | `expo-notifications` | SDK 58 aligned | Local scheduled notifications (100% offline). |
| **Charts** | `react-native-svg` | SDK 58 aligned | SVG bar and line charts for monthly unit comparisons. |

---

## 4. Encrypted Local Storage Architecture & Fail-Closed SQLCipher

Pakistani electricity bills contain sensitive personal and financial data:
- Consumer Name & Premises Address.
- 13-digit K-Electric Account / Consumer Reference Number.
- Meter Number & Tariff Category.
- Detailed consumption history (units `kWh`) and monthly financial charges.

Because `AsyncStorage` stores data in plain unencrypted text files on device storage, using it for bill history creates a significant privacy exposure on rooted devices, ADB backups, or shared household Android phones.

### 4.1. Storage Technology Evaluation

| Option | SDK 58 Compatibility | Security / Encryption | Performance & Scale | Verdict |
|---|---|---|---|---|
| **Option A: `expo-sqlite` with SQLCipher (`useSQLCipher: true`)** | Official Expo SDK 58 package (`~58.0.17`) via config plugin (`app.config.ts`) | **Full database-level AES-256 encryption via SQLCipher**. Page-level encryption on disk. | High. Fast indexed queries for monthly comparison and history filtering. Native C implementation. | **Recommended & Selected**. Built-in Expo config plugin support, zero third-party build friction. |
| **Option B: `@op-engineering/op-sqlite` (SQLCipher flag)** | Compatible with Development Builds | Full SQLCipher AES-256 encryption. | Very high (JSI / C++ bridge). | **Rejected for MVP**. Third-party package requiring custom build configurations in `package.json`; unnecessary complexity over official `expo-sqlite`. |
| **Option C: App-Level Encryption over JSON Files (e.g. `expo-crypto` / AES-GCM)** | Pure JS / Expo Crypto | Encrypted ciphertext at rest. | Low. Requires full decrypt/encrypt cycle on every bill insert, update, or query. Prone to memory spikes on low-end Android. | **Rejected**. Inefficient for tabular data querying and history sorting. |
| **Option D: `expo-secure-store` for Complete Bills** | Official Expo SDK 58 | Android Keystore / iOS Keychain. | **Fails**. Platform limits (typically 2 KB per key on Android). Not designed for documents or lists. | **Strictly Prohibited** for complete bills or images. |

### 4.2. Mandatory Fail-Closed Initialization Sequence

To guarantee that unencrypted database files are never created or written to disk:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             MANDATORY SQLCIPHER INITIALIZATION SEQUENCE                │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Open Database: SQLite.openDatabaseAsync('bijlidost_bills_secure.db') │
│ 2. Query PRAGMA:  db.getFirstAsync<{ cipher_version: string }>(        │
│                   'PRAGMA cipher_version;'                             │
│                   )                                                    │
│ 3. Verify Cipher: Check if result?.cipher_version is non-empty string. │
│    ├── FAIL: If empty/null/throws: HALT IMMEDIATELY.                   │
│    │         Throw FatalSecurityError("SQLCipher unavailable").         │
│    │         Prevent any bill data from being read or written.         │
│    │         Display blocking UI: "Secure storage unavailable".        │
│    └── PASS: SQLCipher is confirmed active. Proceed to Step 4.         │
│ 4. Apply Key:     db.execAsync(`PRAGMA key = '${encryptionKey}';`)     │
│ 5. Verify Access: Execute test query (e.g. read schema or test table). │
│    ├── FAIL: If key rejected or file corrupted: HALT.                  │
│    │         Do NOT overwrite or delete database automatically.        │
│    │         Display recovery error dialog to user.                    │
│    └── PASS: Database is ready for secure operations.                  │
└────────────────────────────────────────────────────────────────────────┘
```

**Security Acceptance Criterion:** Under no circumstances may the application silently fall back to standard unencrypted SQLite. An automated test in the test suite must simulate an environment where `PRAGMA cipher_version` returns null/empty and verify that initialization immediately halts with a fatal security rejection.

### 4.3. Platform-Specific SecureStore Uninstall Behavior & Lifecycle Matrix

Hardware keystore and keychain persistence differs fundamentally across mobile operating systems:
- **Android (`expo-secure-store`)**: Keystore entries are bound to the app's UID and are **cleared upon app uninstall**. Reinstalling the app results in a blank Keystore.
- **iOS (`expo-secure-store`)**: Keychain items are bound to the provisioning profile / team ID / bundle ID and **may persist across app uninstall and reinstall**.

The application must handle all lifecycle states deterministically:

| State | Condition | Handling Policy |
|---|---|---|
| **1. Normal State** | Existing DB + Available Key | Open DB, verify `PRAGMA cipher_version`, apply `PRAGMA key`, verify access. Complete initialization. |
| **2. Fresh Install / Cleared State** | Missing DB + Missing Key | Generate fresh 256-bit cryptographically random key via `expo-crypto`, store in `SecureStore`, create and encrypt new DB. |
| **3. Orphaned Key State** (e.g. iOS reinstall or Android DB wiped via file manager) | Missing DB + Existing Key | Reuse the existing valid key from `SecureStore` (or rotate if fresh install flag is set) to initialize a new encrypted DB. |
| **4. Orphaned Encrypted DB State** (e.g. Android reinstall where Keystore was cleared upon uninstall) | Existing DB + Missing Key | **CRITICAL: Do NOT automatically delete or overwrite the existing encrypted database!** Halting rule: Inform user that past encrypted data was found on disk but the decryption key was cleared by OS uninstall. Offer explicit user choices: (A) Clear and start fresh (wipes past DB and generates new key), or (B) Cancel. |
| **5. Invalid Key / Corruption State** | Existing DB + Key Fails Access | Halt initialization. Display a clear integrity error. Never overwrite corrupted or locked files without explicit user confirmation. |
| **6. User "Clear All Data"** | Explicit User Action in Settings | Atomically delete the SQLite database file and delete the key from `SecureStore` (`SecureStore.deleteItemAsync`). Ensures a complete, synchronized wipe across both Android and iOS. |

### 4.4. Bill Image Retention & Export Warning
- **No Permanent Image Retention in MVP**:
  - The app stores strictly structured, verified bill records (amounts, units, dates, line items) in encrypted SQLite.
  - Full bill image retention is deferred to a future milestone.
  - Temporary camera and cropping images generated during scanning are purged immediately in a `finally` block upon OCR completion, failure, or cancellation.
- **"Export My Data" Security Warning**:
  - Exporting bill data decrypts records into a user-controlled JSON file or share sheet.
  - Before export, the app displays a prominent security notice:
    > *"Notice: The exported file contains unencrypted personal information (including account number, amounts, and dates). Once saved outside Bijli Dost or shared via messaging apps, it is no longer protected by the app's encryption."*

---

## 5. OCR Architecture & Evaluation Plan

The OCR layer is strictly decoupled behind an abstract `OcrAdapter` interface. No concrete OCR library is locked until the evaluation plan is executed and approved.

### 5.1. OcrAdapter Interface Contract
```typescript
export interface OcrBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OcrRecognizedLine {
  text: string;
  confidence?: number;
  boundingBox?: OcrBoundingBox;
}

export interface OcrRawResult {
  fullText: string;
  lines: OcrRecognizedLine[];
  blocks: { text: string; boundingBox?: OcrBoundingBox; lines: OcrRecognizedLine[] }[];
  executionTimeMs: number;
}

export interface OcrAdapter {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  recognizeText(imageUri: string): Promise<OcrRawResult>;
}
```

### 5.2. On-Device OCR Candidates for Expo SDK 58

| Candidate | Integration Type | Expo Config Plugin | Offline | Size Impact | Maintenance & SDK 58 Compatibility |
|---|---|---|---|---|---|
| **Candidate 1: `@infinitered/react-native-mlkit-text-recognition`** | Modern Expo Module API (Google ML Kit on Android & iOS) | Native Expo Module (auto-linking, no custom patch needed) | Yes (100% on-device) | Medium (~4–6 MB Android APK increase via Google Play Services / bundled model) | Actively maintained by Infinite Red; explicit Expo SDK version alignment. Requires Development Build. |
| **Candidate 2: `@react-native-ml-kit/text-recognition`** | Community React Native native module | Requires community config plugin (`@config-plugins/react-native-mlkit` or manual app.config) | Yes (100% on-device) | Medium (~4–6 MB) | Community maintained; releases can lag behind major React Native versions (RN 0.88 new architecture). |
| **Candidate 3: Apple Vision Framework (iOS) + ML Kit (Android)** | Platform-native dual adapter | Custom Native Module / Nitro | Yes | Low on iOS (built-in Vision), Medium on Android | Requires maintaining dual native bridge code; highest maintenance overhead. |
| **Candidate 4: `react-native-vision-camera` + Frame OCR Plugin** | Frame processor worklet | Config plugin available | Yes | High (~10–15 MB due to camera engine, worklet runtime, native C++) | Overkill for static document processing. Best suited for continuous live video AR, not photo capture + crop. |

### 5.3. Field-Level OCR Evaluation Protocol
The evaluation tests **individual field extraction accuracy** on 10 anonymized real K-Electric sample bills (Protected, Non-Protected, single/three-phase, paper photos vs digital PDFs).

**Target Fields & Pass Criteria:**
1. **Consumer Reference Number**: 13-digit format matching pattern `\d{13}`.
2. **Billing Month & Year**: Validated against standard 3-letter month + 4-digit year (e.g., `OCT 2026`).
3. **Due Date**: Validated against valid calendar date in target month.
4. **Units Consumed (`kWh`)**: Numeric integer matching meter reading delta (`currentReading - previousReading`).
5. **Payable Within Due Date**: Numeric amount in PKR.
6. **Payable After Due Date**: Numeric amount with late surcharge.
7. **Line-Item Detection**: Individual recognition of Electricity Charges, FCA, QTA, ED, GST, TV Fee.
8. **Unrecognized Items**: Captured in `unclassifiedLineItems` rather than dropped.

*Implementation remains blocked until this evaluation report is reviewed and approved.*

---

## 6. Revised Urdu Text-to-Speech (TTS) Architecture

### 6.1. Reality of Offline Urdu TTS on Android Devices
In Pakistan, budget Android devices (often running Android Go or customized vendor ROMs) frequently do **not** ship with an Urdu (`ur-PK` / `ur`) voice model preinstalled in the Google Speech Services engine. If an app calls `Speech.speak(text, { language: 'ur-PK' })` on a device lacking an Urdu voice, the system engine either fails silently, falls back to garbled English phonemes, or throws an unhandled error.

### 6.2. Architecture & Fallback Strategy
1. **Offline Urdu TTS is marked as an UNVERIFIED capability** until physical testing on target Pakistani Android devices is completed in Milestone 5.
2. **Abstracted `TtsService`**:
   ```typescript
   export type TtsVoiceStatus = 'ready' | 'missing_language' | 'unsupported';

   export interface TtsService {
     checkVoiceAvailability(language: string): Promise<TtsVoiceStatus>;
     speak(text: string, onDone?: () => void): Promise<void>;
     stop(): Promise<void>;
   }
   ```
3. **Runtime Voice Inspection**:
   - On initializing the Bill Explanation screen, `TtsService.checkVoiceAvailability('ur')` calls `Speech.getAvailableVoicesAsync()`.
   - Checks whether any installed voice lists language `ur` or `ur-PK`.
4. **Graceful Fallback**:
   - **If an Urdu voice is detected and verified**: The "سنیں / Listen" CTA is active with Play/Pause/Stop controls.
   - **If no Urdu voice is installed**:
     - The audio button displays a calm status: *"اس ڈیوائس پر اردو آواز دستیاب نہیں"* (*"Urdu voice not installed on this device"*).
     - The UI automatically renders the **Full Written Urdu Explanation** card with large typography and high contrast, ensuring the consumer is never blocked.
     - A simple help modal explains how the user can optionally download the Urdu voice pack via Android system settings (Settings → Accessibility → Text-to-Speech → Google Speech Services → Install Voice Data → Urdu).

---

## 7. Tariff Configuration & Review Distribution Workflow

Tariff configurations are versioned, effective-dated local JSON files in `src/providers/kelectric/tariffs/`.

1. **No Invented Values**: Files start empty or containing only verified schemas until official NEPRA notifications and gazettes are reviewed.
2. **Review & Distribution Lifecycle**:
   - **Step 1: Official Ingestion**: When NEPRA / K-Electric publishes an updated tariff or fuel surcharge notification, the official PDF gazette is obtained.
   - **Step 2: Dual Verification**: The tariff schedule is translated into versioned JSON (`kelectric-residential-YYYY-MM.json`) and verified by calculating totals against real bills from that billing cycle.
   - **Step 3: Schema Validation**: The JSON is validated against the strict `KelectricTariffSchema` via Zod before inclusion.
   - **Step 4: Distribution**: In MVP, verified tariff schedules are bundled directly into app releases. For post-MVP, an optional HTTPS static endpoint can distribute signed tariff updates without requiring an app store rebuild.
   - **Fallback**: If a bill belongs to an unverified period, the engine flags it as `UNVERIFIED_TARIFF_PERIOD` and displays only extracted line items with clear notices.
