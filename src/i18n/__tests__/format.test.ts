import { formatBillingMonth, formatDate } from '../format';

describe('i18n date formatting', () => {
  it('formats billing months with localised names and an LTR-isolated year', () => {
    expect(formatBillingMonth('en', '2026-10')).toBe('October ⁦2026⁩');
    expect(formatBillingMonth('ur', '2026-10')).toBe('اکتوبر ⁦2026⁩');
    expect(formatBillingMonth('ur-Latn', '2026-01')).toBe('Janwari ⁦2026⁩');
  });

  it('formats due dates and strips leading zeros from the day', () => {
    expect(formatDate('en', '2026-11-08')).toBe('⁦8⁩ November ⁦2026⁩');
    expect(formatDate('ur', '2026-12-18')).toBe('⁦18⁩ دسمبر ⁦2026⁩');
  });

  it('returns the input unchanged when it is not a valid month or date', () => {
    expect(formatBillingMonth('en', 'OCT 2026')).toBe('OCT 2026');
    expect(formatBillingMonth('en', '2026-13')).toBe('2026-13');
    expect(formatDate('en', '18/11/2026')).toBe('18/11/2026');
  });
});
