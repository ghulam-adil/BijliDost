# CHANGELOG.md — Bijli Dost

All notable changes to this project will be documented in this file.  
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.4.0-docs] — 2026-11-16

### Changed
- **Package Version Corrections**:
  - Corrected `expo-sqlite` version in `TECHNICAL_ARCHITECTURE.md` to official SDK 58 release `~58.0.17`.
  - Confirmed `expo-router` version at `~58.0.31`.
  - Added `expo-dev-client` to the exact Milestone 1 dependencies.
- **Fail-Closed SQLCipher Initialization**:
  - Enforced mandatory verification sequence: query `PRAGMA cipher_version;` and verify SQLCipher is active before executing `PRAGMA key`.
  - Strictly banned silent fallback to unencrypted SQLite; missing SQLCipher halts initialization with `FatalSecurityError`.
  - Added automated security testing acceptance criterion for SQLCipher unavailability.
- **Platform-Specific SecureStore Uninstall Realities**:
  - Corrected documentation regarding uninstall persistence: Android Keystore entries are erased on uninstall, whereas iOS Keychain items may persist under the same bundle ID.
  - Documented deterministic handling across 5 lifecycle states, including orphaned encrypted databases on Android (halting rule: never auto-overwrite; explain recovery limitations and require explicit user confirmation).
  - Specified that "Clear All Data" must atomically delete both the SQLite file and the `SecureStore` key across Android and iOS.
- **Bill Image Retention & Export Warning**:
  - Clarified that MVP includes **no permanent bill image retention**; temporary images are purged immediately in a `finally` block across success, failure, and cancellation paths.
  - Deferred encrypted image retention to a future milestone.
  - Added mandatory security notice on "Export My Data" warning that exported JSON contains unencrypted PII outside the app's encrypted database.
- **Milestone 1 Exit Criteria Refinement**:
  - Explicitly specified exit criteria: Android development build generation, installation/launch on a physical Android device, independent web startup, and on-device Urdu RTL font rendering verification.
  - Clarified that native SQLCipher testing begins in Milestone 2.

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
