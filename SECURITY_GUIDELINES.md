# SECURITY_GUIDELINES.md — Bijli Dost

**Classification:** Mandatory Engineering & Operational Security Policy  
**Scope:** Initial Local-First MVP & Future Extensibility

---

## 1. Core Privacy & Independence Policy

1. **No Utility Credentials or OTPs**: Bijli Dost must NEVER request, store, or transmit K-Electric (or any other utility) account passwords, PINs, or OTPs. Never automate logins to utility portals.
2. **Clear Independent Identity**: Onboarding, settings, and store listings must explicitly state that Bijli Dost is an independent consumer assistance application, not affiliated with K-Electric or NEPRA.
3. **No Mandatory Account Creation**: Consumers can use all MVP features (scanning, review, bill explanation, unit comparison, reminders, history) without signing up, logging in, or providing phone numbers/emails.

---

## 2. Encrypted Local Storage & Fail-Closed SQLCipher Policy

Pakistani electricity bills contain personal information, consumption history, premises details, and financial obligations. To safeguard this data on shared or rooted Android devices:

### 2.1. Mandatory Fail-Closed SQLCipher Initialization
- **Encrypted Application Data (Bills, Line Items & Reference Numbers)**:
  - Must be stored in a **locally encrypted database using `expo-sqlite` with SQLCipher (`useSQLCipher: true`)**.
  - All database pages written to disk are encrypted via **AES-256**.
- **Mandatory Initialization Sequence**:
  1. Open database connection (`SQLite.openDatabaseAsync('bijlidost_bills_secure.db')`).
  2. Query `PRAGMA cipher_version;`.
  3. Verify that SQLCipher is active and returns a valid version string.
     - **FAIL-CLOSED RULE**: If `PRAGMA cipher_version` returns null, empty, or throws, **initialization must halt immediately**. The app must throw a `FatalSecurityError` and display a blocking error screen. **Never silently fall back to unencrypted SQLite.**
  4. Apply the database encryption key via `PRAGMA key = '${encryptionKey}';`.
  5. Verify database access with a test query before permitting any read/write operations.
- **Security Acceptance Criterion**: An automated unit test must simulate an environment where `PRAGMA cipher_version` returns empty, asserting that initialization immediately halts without creating or writing unencrypted records.

### 2.2. SecureStore Key Lifecycle & Platform-Specific Uninstall Matrix
- **SecureStore Restriction**:
  - `expo-secure-store` is **reserved strictly for the 256-bit database encryption key** (and future auth tokens if user accounts are added in a future release).
  - **STRICT PROHIBITION**: Never store complete bill records, line items, or bill images in `SecureStore`. SecureStore has severe platform payload size limits (typically 2 KB on Android).
- **Platform-Specific Uninstall Realities**:
  - **Android**: SecureStore entries are hardware-bound to the app UID and are **cleared upon app uninstall**.
  - **iOS**: Keychain entries are bound to the bundle ID/team ID and **may persist after app uninstall and reinstall**.
- **Edge-Case State Handling**:
  1. **Existing DB + Available Key**: Normal operation. Verify SQLCipher, apply key, open tables.
  2. **Missing DB + Missing Key**: Fresh install. Generate 256-bit key via `expo-crypto`, store in `SecureStore`, create new encrypted DB.
  3. **Missing DB + Existing Key** (e.g. iOS reinstall where Keychain survived): Reuse existing key to initialize a new encrypted DB.
  4. **Existing DB + Missing Key** (e.g. Android reinstall where Keystore was cleared on uninstall):
     - **DO NOT automatically overwrite or delete the existing encrypted database!**
     - Halting rule: Inform the user that previous encrypted data exists on device storage, but the encryption key was erased by OS uninstall.
     - Display a clear recovery limitation dialog explaining that without the key, previous records cannot be recovered.
     - Require explicit user confirmation before clearing the unreadable file to start a fresh database.
  5. **Invalid Key / Access Rejection**: If `PRAGMA key` fails to decrypt, halt initialization immediately and display an integrity error.
  6. **Clear All Data**: Atomically delete the SQLite database file and call `SecureStore.deleteItemAsync('bijlidost_db_encryption_key')`, ensuring a complete wipe across both Android and iOS.

---

## 3. Bill Image Lifecycle & Export Warnings

- **No Permanent Image Retention in MVP**:
  - In MVP, **no permanent bill images are retained on disk**.
  - All bill data is stored strictly as structured, encrypted fields in the SQLCipher database.
  - Permanent encrypted image storage is deferred to a future post-MVP milestone.
- **Temporary Image Cleanup**:
  - Temporary camera and cropping files generated in the cache directory must be purged immediately in a `finally` block upon OCR completion, failure, or cancellation.
- **"Export My Data" Security Warning**:
  - Exporting bill data decrypts records into a user-controlled JSON export.
  - The app must display a clear, prominent security warning before export:
    > *"Warning: The exported JSON file contains unencrypted personal information (including account number, consumption history, and amounts). Once saved or shared outside Bijli Dost, it is no longer protected by the app's encryption."*

---

## 4. PII Redaction & Logging Hygiene

- **Sensitive Fields Identified as PII**:
  - Consumer Name
  - Account Number (13-digit KE account reference)
  - Consumer Number
  - Meter Number
  - Home / Premises Address
  - Phone Number
  - Raw OCR extracted text and raw bill image data
- **Zero PII in Logs**:
  - Never call `console.log`, `console.error`, or pass to crash reporting tools any raw OCR string, bill object, or user reference numbers.
  - All application error loggers must sanitize payloads through a central `redactForLog()` utility:
    ```typescript
    export function redactForLog(obj: Record<string, unknown>): Record<string, unknown> {
      const redacted = { ...obj };
      for (const key of Object.keys(redacted)) {
        if (/account|consumer|name|address|meter|text|raw|image/i.test(key)) {
          redacted[key] = '[REDACTED]';
        }
      }
      return redacted;
    }
    ```

---

## 5. Network & Binary Security

- **Zero Private Keys in Bundle**: No private API keys, database service-role secrets, or administrative credentials may ever exist in the client repository or mobile bundle.
- **Client Environment Variables**: Only build-time public flags (e.g. `EXPO_PUBLIC_APP_ENV=production`) may be used.
- **Strict HTTPS**: If any network request is ever made (e.g. for future static tariff updates), HTTPS (`https://`) is strictly enforced; cleartext traffic (`usesCleartextTraffic`) is disabled in Android builds.
