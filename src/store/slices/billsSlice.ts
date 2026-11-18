import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BillSummary {
  id: string;
  providerId: 'kelectric';
  billingMonth: string;
  dueDate: string;
  unitsKwh: number;
  amountWithinDueDate: number;
  amountAfterDueDate: number;
  isPaid: boolean;
  status: 'verified' | 'unverified';
}

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
    toggleBillPaid: (state, action: PayloadAction<string>) => {
      const bill = state.items.find((b) => b.id === action.payload);
      if (bill) {
        bill.isPaid = !bill.isPaid;
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
  toggleBillPaid,
  clearAllBillsState,
} = billsSlice.actions;

export default billsSlice.reducer;

