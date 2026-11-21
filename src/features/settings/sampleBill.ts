import type { StoredBill } from '@/services/storage/billRecord';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Debug-only placeholder bill used to exercise encrypted saving before the scanner exists.
 * All values are obviously fake and arbitrary: this is NOT a tariff calculation.
 * `monthsAgo` keeps each sample in a different billing month.
 */
export function buildSampleBill(id: string, now: Date, monthsAgo: number): StoredBill {
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 1));
  const due = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 18));
  const amount = 1000 + monthsAgo * 100;

  return {
    id,
    providerId: 'kelectric',
    consumerReference: '0000000000000',
    billingMonth: `${month.getUTCFullYear()}-${pad(month.getUTCMonth() + 1)}`,
    dueDate: `${due.getUTCFullYear()}-${pad(due.getUTCMonth() + 1)}-${pad(due.getUTCDate())}`,
    unitsKwh: 120 + ((monthsAgo * 53) % 180),
    amountWithinDueDate: amount,
    amountAfterDueDate: amount + 100,
    meterNumber: null,
    tariffCategory: null,
    lineItems: [{ label: 'SAMPLE (fake data)', amount }],
    unclassifiedLineItems: [],
    isPaid: false,
    status: 'unverified',
    createdAt: now.toISOString(),
  };
}
