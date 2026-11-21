/**
 * PII-safe logging. Bill objects, OCR text, account/consumer/meter numbers, names,
 * addresses and encryption keys must never reach logs.
 */

const SENSITIVE_KEY_PATTERN = /account|consumer|name|address|meter|text|raw|image|key|phone|secret|token/i;

export function redactForLog(context: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    redacted[key] = SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : value;
  }
  return redacted;
}

/** Development-only warning with redacted context. Silent in production builds. */
export function logWarn(message: string, context: Record<string, unknown> = {}): void {
  if (__DEV__) {
    console.warn(message, redactForLog(context));
  }
}

/** Safe description of an unknown error: its class name only, never its message (messages may echo data). */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}
