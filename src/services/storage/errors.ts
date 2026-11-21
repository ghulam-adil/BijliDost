/**
 * Raised when the encrypted storage guarantees cannot be met (e.g. SQLCipher is not
 * available in this build). Callers must halt and never fall back to plain SQLite.
 * Messages are generic on purpose: never include keys, bill data or PII.
 */
export class FatalSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FatalSecurityError';
    Object.setPrototypeOf(this, FatalSecurityError.prototype);
  }
}

/** Raised when stored data is structurally unusable (e.g. a newer schema than this app understands). */
export class StorageIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageIntegrityError';
    Object.setPrototypeOf(this, StorageIntegrityError.prototype);
  }
}
