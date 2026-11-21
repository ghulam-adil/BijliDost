import { useCallback } from 'react';
import { Share } from 'react-native';
import { useAppDispatch } from '@/store/hooks';
import { setBills } from '@/store/slices/billsSlice';
import { toBillSummary } from '@/services/storage/billRecord';
import { generateId } from '@/services/storage/nativeAdapters';
import { useBillRepository, useStorage } from '@/features/storage/StorageProvider';
import { buildExportJson } from '../exportBills';
import { buildSampleBill } from '../sampleBill';
import { describeError, logWarn } from '@/utils/logger';

export type ExportOutcome = 'shared' | 'empty' | 'failed';

export function useDataManagement() {
  const repository = useBillRepository();
  const { state, eraseAll } = useStorage();
  const dispatch = useAppDispatch();

  const exportBills = useCallback(async (): Promise<ExportOutcome> => {
    if (!repository) return 'failed';
    try {
      const bills = await repository.list();
      if (bills.length === 0) return 'empty';
      await Share.share({ message: buildExportJson(bills, new Date()) });
      return 'shared';
    } catch (error) {
      logWarn('Export failed', { error: describeError(error) });
      return 'failed';
    }
  }, [repository]);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    try {
      await eraseAll();
      return true;
    } catch (error) {
      logWarn('Clear all data failed', { error: describeError(error) });
      return false;
    }
  }, [eraseAll]);

  /** Debug builds only. Saves a clearly fake bill so encrypted persistence can be verified on-device. */
  const addSampleBill = useCallback(async (): Promise<boolean> => {
    if (!__DEV__ || !repository) return false;
    try {
      const existing = await repository.list();
      await repository.save(buildSampleBill(generateId(), new Date(), existing.length));
      const all = await repository.list();
      dispatch(setBills(all.map(toBillSummary)));
      return true;
    } catch (error) {
      logWarn('Could not add sample bill', { error: describeError(error) });
      return false;
    }
  }, [repository, dispatch]);

  return {
    isStorageReady: state.status === 'ready',
    exportBills,
    clearAllData,
    addSampleBill,
  };
}
