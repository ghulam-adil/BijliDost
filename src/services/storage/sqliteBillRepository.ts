import { BillRow, StoredBill, rowToBill } from './billRecord';
import type { BillRepository, SqlDatabase } from './types';

const SELECT_COLUMNS = `id, provider_id, consumer_reference, billing_month, due_date, units_kwh,
  amount_within_due_date, amount_after_due_date, meter_number, tariff_category,
  line_items_json, unclassified_line_items_json, is_paid, status, created_at`;

export function createSqliteBillRepository(db: SqlDatabase): BillRepository {
  return {
    async list() {
      const rows = await db.getAllAsync<BillRow>(
        `SELECT ${SELECT_COLUMNS} FROM bills ORDER BY billing_month DESC, created_at DESC;`
      );
      const bills: StoredBill[] = [];
      for (const row of rows) {
        const bill = rowToBill(row);
        if (bill) bills.push(bill);
      }
      return bills;
    },

    async getById(id) {
      const row = await db.getFirstAsync<BillRow>(
        `SELECT ${SELECT_COLUMNS} FROM bills WHERE id = ?;`,
        [id]
      );
      return row ? rowToBill(row) : null;
    },

    async save(bill) {
      await db.runAsync(
        `INSERT INTO bills (${SELECT_COLUMNS})
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (provider_id, consumer_reference, billing_month) DO UPDATE SET
           due_date = excluded.due_date,
           units_kwh = excluded.units_kwh,
           amount_within_due_date = excluded.amount_within_due_date,
           amount_after_due_date = excluded.amount_after_due_date,
           meter_number = excluded.meter_number,
           tariff_category = excluded.tariff_category,
           line_items_json = excluded.line_items_json,
           unclassified_line_items_json = excluded.unclassified_line_items_json,
           status = excluded.status;`,
        [
          bill.id,
          bill.providerId,
          bill.consumerReference,
          bill.billingMonth,
          bill.dueDate,
          bill.unitsKwh,
          bill.amountWithinDueDate,
          bill.amountAfterDueDate,
          bill.meterNumber,
          bill.tariffCategory,
          JSON.stringify(bill.lineItems),
          JSON.stringify(bill.unclassifiedLineItems),
          bill.isPaid ? 1 : 0,
          bill.status,
          bill.createdAt,
        ]
      );
    },

    async setPaid(id, isPaid) {
      await db.runAsync('UPDATE bills SET is_paid = ? WHERE id = ?;', [isPaid ? 1 : 0, id]);
    },

    async remove(id) {
      await db.runAsync('DELETE FROM bills WHERE id = ?;', [id]);
    },
  };
}
