import { buildExportJson, EXPORT_FORMAT_VERSION } from '../exportBills';
import { buildSampleBill } from '../sampleBill';
import { StoredBillSchema } from '@/services/storage/billRecord';

describe('buildSampleBill', () => {
  const now = new Date('2026-11-20T10:00:00.000Z');

  it('produces a valid, clearly fake bill', () => {
    const bill = buildSampleBill('id-1', now, 0);
    expect(StoredBillSchema.safeParse(bill).success).toBe(true);
    expect(bill.consumerReference).toBe('0000000000000');
    expect(bill.lineItems[0]?.label).toContain('SAMPLE');
    expect(bill.status).toBe('unverified');
  });

  it('uses a different billing month for each offset, wrapping across years', () => {
    expect(buildSampleBill('a', now, 0).billingMonth).toBe('2026-11');
    expect(buildSampleBill('b', now, 1).billingMonth).toBe('2026-10');
    expect(buildSampleBill('c', now, 11).billingMonth).toBe('2025-12');
    expect(buildSampleBill('d', now, 0).dueDate).toBe('2026-12-18');
  });
});

describe('buildExportJson', () => {
  it('wraps bills with app, version and timestamp metadata', () => {
    const bill = buildSampleBill('id-1', new Date('2026-11-20T10:00:00.000Z'), 0);
    const parsed = JSON.parse(buildExportJson([bill], new Date('2026-11-21T00:00:00.000Z')));
    expect(parsed.app).toBe('bijli-dost');
    expect(parsed.formatVersion).toBe(EXPORT_FORMAT_VERSION);
    expect(parsed.exportedAt).toBe('2026-11-21T00:00:00.000Z');
    expect(parsed.bills).toHaveLength(1);
    expect(parsed.bills[0].id).toBe('id-1');
  });
});
