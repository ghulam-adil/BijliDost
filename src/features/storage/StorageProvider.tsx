import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storageService as defaultService } from '@/services/storage/storageRuntime';
import type { StorageService } from '@/services/storage/storageService';
import type { BillRepository } from '@/services/storage/types';
import { toBillSummary } from '@/services/storage/billRecord';
import { clearAllBillsState, setBills } from '@/store/slices/billsSlice';
import { useAppDispatch } from '@/store/hooks';
import { describeError, logWarn } from '@/utils/logger';

export type StorageState =
  | { status: 'loading' }
  | { status: 'ready'; repository: BillRepository }
  | { status: 'unsupported' }
  | { status: 'recovery'; reason: 'orphaned-database' | 'access-rejected' }
  | { status: 'fatal' };

interface StorageContextValue {
  state: StorageState;
  /** Re-runs initialisation (e.g. after a recovery screen "Try again"). */
  retry: () => Promise<void>;
  /** Permanently deletes the database and key, then re-initialises with a fresh encrypted database. */
  eraseAll: () => Promise<void>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export const StorageProvider: React.FC<{ children: React.ReactNode; service?: StorageService }> = ({
  children,
  service = defaultService,
}) => {
  const dispatch = useAppDispatch();
  const [state, setState] = useState<StorageState>({ status: 'loading' });

  const bootstrap = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setState({ status: 'loading' });
    }
    const result = await service.bootstrap();

    if (result.status !== 'ready') {
      dispatch(clearAllBillsState());
      setState(result);
      return;
    }

    try {
      const bills = await result.repository.list();
      dispatch(setBills(bills.map(toBillSummary)));
      setState(result);
    } catch (error) {
      logWarn('Could not load saved bills', { error: describeError(error) });
      dispatch(clearAllBillsState());
      setState({ status: 'fatal' });
    }
  }, [service, dispatch]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const retry = useCallback(() => bootstrap(true), [bootstrap]);

  const eraseAll = useCallback(async () => {
    await service.eraseAll();
    dispatch(clearAllBillsState());
    // Silent: keep the current screen mounted instead of flashing the loading screen.
    await bootstrap(false);
  }, [service, dispatch, bootstrap]);

  const value = useMemo(() => ({ state, retry, eraseAll }), [state, retry, eraseAll]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export function useStorage(): StorageContextValue {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used inside StorageProvider');
  }
  return context;
}

/** The bill repository when encrypted storage is ready, otherwise null. */
export function useBillRepository(): BillRepository | null {
  const { state } = useStorage();
  return state.status === 'ready' ? state.repository : null;
}
