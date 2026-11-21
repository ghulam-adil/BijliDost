import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { removeBill, setBillPaid } from '@/store/slices/billsSlice';
import type { BillSummary } from '@/services/storage/billRecord';
import { useBillRepository } from '@/features/storage/StorageProvider';
import { describeError, logWarn } from '@/utils/logger';

/**
 * Bill history mutations. The encrypted repository is updated first; the Redux summary
 * cache only changes after the write succeeded, so the UI never shows unsaved state.
 */
export function useBillActions() {
  const repository = useBillRepository();
  const dispatch = useAppDispatch();

  const togglePaid = useCallback(
    async (bill: BillSummary): Promise<boolean> => {
      if (!repository) return false;
      const isPaid = !bill.isPaid;
      try {
        await repository.setPaid(bill.id, isPaid);
        dispatch(setBillPaid({ id: bill.id, isPaid }));
        return true;
      } catch (error) {
        logWarn('Could not update bill paid state', { error: describeError(error) });
        return false;
      }
    },
    [repository, dispatch]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!repository) return false;
      try {
        await repository.remove(id);
        dispatch(removeBill(id));
        return true;
      } catch (error) {
        logWarn('Could not delete bill', { error: describeError(error) });
        return false;
      }
    },
    [repository, dispatch]
  );

  return { canModify: repository !== null, togglePaid, remove };
}
