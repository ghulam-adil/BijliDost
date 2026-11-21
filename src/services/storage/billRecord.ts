import { z } from 'zod';

const nonNegative = z.number().finite().nonnegative();

export const LineItemSchema = z.object({
  label: z.string().min(1),
  amount: z.number().finite(),
});

export const UnclassifiedLineItemSchema = z.object({
  rawLabel: z.string(),
  amount: z.number().finite(),
  ocrConfidence: z.enum(['high', 'medium', 'low']),
  evidenceText: z.string(),
});

/** Full bill record as persisted in the encrypted database. Contains PII (consumer reference, meter number). */
export const StoredBillSchema = z.object({
  id: z.string().min(1),
  providerId: z.literal('kelectric'),
  consumerReference: z.string().min(1).max(32),
  billingMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'YYYY-MM'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  unitsKwh: nonNegative,
  amountWithinDueDate: nonNegative,
  amountAfterDueDate: nonNegative,
  meterNumber: z.string().nullable(),
  tariffCategory: z.string().nullable(),
  lineItems: z.array(LineItemSchema),
  unclassifiedLineItems: z.array(UnclassifiedLineItemSchema),
  isPaid: z.boolean(),
  status: z.enum(['verified', 'unverified']),
  createdAt: z.string().min(1),
});

export type StoredBill = z.infer<typeof StoredBillSchema>;

/** PII-free projection kept in Redux for lists and dashboards. */
export const BillSummarySchema = StoredBillSchema.pick({
  id: true,
  providerId: true,
  billingMonth: true,
  dueDate: true,
  unitsKwh: true,
  amountWithinDueDate: true,
  amountAfterDueDate: true,
  isPaid: true,
  status: true,
});

export type BillSummary = z.infer<typeof BillSummarySchema>;

export function toBillSummary(bill: StoredBill): BillSummary {
  return {
    id: bill.id,
    providerId: bill.providerId,
    billingMonth: bill.billingMonth,
    dueDate: bill.dueDate,
    unitsKwh: bill.unitsKwh,
    amountWithinDueDate: bill.amountWithinDueDate,
    amountAfterDueDate: bill.amountAfterDueDate,
    isPaid: bill.isPaid,
    status: bill.status,
  };
}

/** Raw SQLite row shape for the `bills` table. */
export interface BillRow {
  id: string;
  provider_id: string;
  consumer_reference: string;
  billing_month: string;
  due_date: string;
  units_kwh: number;
  amount_within_due_date: number;
  amount_after_due_date: number;
  meter_number: string | null;
  tariff_category: string | null;
  line_items_json: string;
  unclassified_line_items_json: string;
  is_paid: number;
  status: string;
  created_at: string;
}

/** Validates a database row at the storage boundary. Returns null if the row is unusable. */
export function rowToBill(row: BillRow): StoredBill | null {
  try {
    const parsed = StoredBillSchema.safeParse({
      id: row.id,
      providerId: row.provider_id,
      consumerReference: row.consumer_reference,
      billingMonth: row.billing_month,
      dueDate: row.due_date,
      unitsKwh: row.units_kwh,
      amountWithinDueDate: row.amount_within_due_date,
      amountAfterDueDate: row.amount_after_due_date,
      meterNumber: row.meter_number,
      tariffCategory: row.tariff_category,
      lineItems: JSON.parse(row.line_items_json),
      unclassifiedLineItems: JSON.parse(row.unclassified_line_items_json),
      isPaid: row.is_paid === 1,
      status: row.status,
      createdAt: row.created_at,
    });
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
