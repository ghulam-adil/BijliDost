import {
  bidiIsolate,
  formatPkr,
  formatUnits,
  formatReferenceNumber,
  formatBidiDate,
  LRI,
  PDI,
} from '../bidi';

describe('Bidirectional Text Isolation Utilities', () => {
  it('should wrap text in LTR isolate markers', () => {
    const isolated = bidiIsolate('0400012345678');
    expect(isolated).toBe(`${LRI}0400012345678${PDI}`);
    expect(isolated.startsWith('\u2066')).toBe(true);
    expect(isolated.endsWith('\u2069')).toBe(true);
  });

  it('should format PKR currency with LTR isolation', () => {
    const formatted = formatPkr(4520);
    expect(formatted).toBe(`${LRI}Rs. 4,520${PDI}`);
  });

  it('should format kWh consumption units with LTR isolation', () => {
    const formatted = formatUnits(245);
    expect(formatted).toBe(`${LRI}245 kWh${PDI}`);
  });

  it('should format 13-digit consumer reference numbers with LTR isolation', () => {
    const formatted = formatReferenceNumber('0400098765432');
    expect(formatted).toBe(`${LRI}0400098765432${PDI}`);
  });

  it('should format calendar dates with LTR isolation', () => {
    const formatted = formatBidiDate('18 Nov 2026');
    expect(formatted).toBe(`${LRI}18 Nov 2026${PDI}`);
  });

  it('should handle null, undefined, or empty values gracefully', () => {
    expect(bidiIsolate('')).toBe('');
    // @ts-expect-error test null resilience
    expect(bidiIsolate(null)).toBe('');
    // @ts-expect-error test undefined resilience
    expect(bidiIsolate(undefined)).toBe('');
  });
});

