/**
 * Unicode Bidirectional (Bidi) Isolation Utilities
 *
 * Prevents LTR numbers, reference numbers, dates, and currency from flipping
 * or corrupting word order when rendered inside RTL Urdu text.
 *
 * Unicode Markers:
 * \u2066 - LEFT-TO-RIGHT ISOLATE (LRI)
 * \u2069 - POP DIRECTIONAL ISOLATE (PDI)
 */

export const LRI = '\u2066';
export const PDI = '\u2069';

/**
 * Wrap text in an LTR isolate marker.
 */
export function bidiIsolate(text: string | number): string {
  if (text === null || text === undefined) return '';
  const trimmed = String(text).trim();
  if (trimmed === '') return '';
  return `${LRI}${trimmed}${PDI}`;
}

/**
 * Format currency amount with PKR symbol and LTR isolation.
 * Example: "Rs. 4,520"
 */
export function formatPkr(amount: number): string {
  const formattedNumber = Math.round(amount).toLocaleString('en-US');
  return bidiIsolate(`Rs. ${formattedNumber}`);
}

/**
 * Format kilowatt-hour units with LTR isolation.
 * Example: "245 kWh"
 */
export function formatUnits(units: number): string {
  const formattedNumber = Math.round(units).toLocaleString('en-US');
  return bidiIsolate(`${formattedNumber} kWh`);
}

/**
 * Format 13-digit Pakistani utility reference number with LTR isolation.
 * Example: "0400012345678"
 */
export function formatReferenceNumber(ref: string): string {
  return bidiIsolate(ref);
}

/**
 * Format date string with LTR isolation.
 * Example: "18 Nov 2026"
 */
export function formatBidiDate(dateStr: string): string {
  return bidiIsolate(dateStr);
}

