import { BillRow, StoredBill, StoredBillSchema, rowToBill, toBillSummary } from '../billRecord';

const bill: StoredBill = {
  id: 'bill-1',
  providerId: 'kelectric',
  consumerReference: '0000000000000',
  billingMonth: '2026-10',
  dueDate: '2026-11-18',
  unitsKwh: 245,
  amountWithinDueDate: 4520,
  amountAfterDueDate: 4750,
  meterNumber: null,
  tariffCategory: null,
  lineItems: [{ label: 'Electricity Charges', amount: 3000 }],
  unclassifiedLineItems: [
    { rawLabel: 'Other', amount: 120, ocrConfidence: 'low', evidenceText: 'Other 120' },
  ],
  isPaid: false,
  status: 'unverified',
  createdAt: '2026-11-20T10:00:00.000Z',
};

const row: BillRow = {
  id: bill.id,
  provider_id: bill.providerId,
  consumer_reference: bill.consumerReference,
  billing_month: bill.billingMonth,
  due_date: bill.dueDate,
  units_kwh: bill.unitsKwh,
  amount_within_due_date: bill.amountWithinDueDate,
  amount_after_due_date: bill.amountAfterDueDate,
  meter_number: null,
  tariff_category: null,
  line_items_json: JSON.stringify(bill.lineItems),
  unclassified_line_items_json: JSON.stringify(bill.unclassifiedLineItems),
  is_paid: 0,
  status: 'unverified',
  created_at: bill.createdAt,
};

describe('StoredBillSchema', () => {
  it('accepts a valid bill and rejects malformed months, dates and negative values', () => {
    expect(StoredBillSchema.safeParse(bill).success).toBe(true);
    expect(StoredBillSchema.safeParse({ ...bill, billingMonth: '2026-13' }).success).toBe(false);
    expect(StoredBillSchema.safeParse({ ...bill, billingMonth: 'OCT 2026' }).success).toBe(false);
    expect(StoredBillSchema.safeParse({ ...bill, dueDate: '18/11/2026' }).success).toBe(false);
    expect(StoredBillSchema.safeParse({ ...bill, unitsKwh: -1 }).success).toBe(false);
    expect(StoredBillSchema.safeParse({ ...bill, providerId: 'lesco' }).success).toBe(false);
  });

  it('preserves unclassified line items instead of dropping them', () => {
    const parsed = StoredBillSchema.parse(bill);
    expect(parsed.unclassifiedLineItems).toHaveLength(1);
  });
});

describe('rowToBill', () => {
  it('round-trips a valid row', () => {
    expect(rowToBill(row)).toEqual(bill);
  });

  it('maps the integer paid flag to a boolean', () => {
    expect(rowToBill({ ...row, is_paid: 1 })?.isPaid).toBe(true);
  });

  it('returns null for corrupt JSON or schema violations instead of throwing', () => {
    expect(rowToBill({ ...row, line_items_json: '{not json' })).toBeNull();
    expect(rowToBill({ ...row, billing_month: 'bad' })).toBeNull();
    expect(rowToBill({ ...row, status: 'weird' })).toBeNull();
  });
});

describe('toBillSummary', () => {
  it('drops all PII fields', () => {
    const summary = toBillSummary(bill);
    expect(summary).not.toHaveProperty('consumerReference');
    expect(summary).not.toHaveProperty('meterNumber');
    expect(summary).not.toHaveProperty('lineItems');
    expect(summary.id).toBe(bill.id);
  });
});
