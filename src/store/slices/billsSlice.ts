import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BillSummary } from '@/services/storage/billRecord';

export type { BillSummary };

/**
 * PII-free cache of bill summaries for lists and dashboards.
 * The full records live only in the encrypted database.
 */
export interface BillsState {
  items: BillSummary[];
  isLoading: boolean;
  activeDraftId: string | null;
}

const initialState: BillsState = {
  items: [],
  isLoading: false,
  activeDraftId: null,
};

export const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<BillSummary[]>) => {
      state.items = action.payload;
    },
    addBill: (state, action: PayloadAction<BillSummary>) => {
      state.items.unshift(action.payload);
    },
    removeBill: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((b) => b.id !== action.payload);
    },
    setBillPaid: (state, action: PayloadAction<{ id: string; isPaid: boolean }>) => {
      const bill = state.items.find((b) => b.id === action.payload.id);
      if (bill) {
        bill.isPaid = action.payload.isPaid;
      }
    },
    clearAllBillsState: (state) => {
      state.items = [];
    },
  },
});

export const {
  setBills,
  addBill,
  removeBill,
  setBillPaid,
  clearAllBillsState,
} = billsSlice.actions;

export default billsSlice.reducer;
