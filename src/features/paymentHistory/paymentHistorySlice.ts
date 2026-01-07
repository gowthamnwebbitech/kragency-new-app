import { createSlice } from '@reduxjs/toolkit';
import { fetchPaymentHistoryThunk } from './paymentHistoryThunk';
import {
  PaymentHistoryItem,
  Pagination,
  PaymentSummary,
} from './paymentHistoryTypes';

interface PaymentHistoryState {
  list: PaymentHistoryItem[];
  summary: PaymentSummary | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentHistoryState = {
  list: [],
  summary: null,
  pagination: null,
  loading: false,
  error: null,
};

const paymentHistorySlice = createSlice({
  name: 'paymentHistory',
  initialState,
  reducers: {
    resetPaymentHistory: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPaymentHistoryThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistoryThunk.fulfilled, (state, action) => {
        const { data, pagination, summary } = action.payload;

        state.loading = false;
        state.pagination = pagination;
        state.summary = summary;

        if (pagination.current_page === 1) {
          state.list = data;
        } else {
          state.list = [...state.list, ...data];
        }
      })
      .addCase(fetchPaymentHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export const { resetPaymentHistory } = paymentHistorySlice.actions;
export default paymentHistorySlice.reducer;
