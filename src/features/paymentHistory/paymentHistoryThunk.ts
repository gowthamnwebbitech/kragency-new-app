import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPaymentHistoryApi } from '@/api/paymentHistoryApi';
import { PaymentHistoryApiResponse } from './paymentHistoryTypes';

interface FetchArgs {
  page: number;
  limit: number;
}

export const fetchPaymentHistoryThunk = createAsyncThunk<
  PaymentHistoryApiResponse,
  FetchArgs,
  { rejectValue: string }
>('paymentHistory/fetch', async ({ page, limit }, { rejectWithValue }) => {
  try {
    return await fetchPaymentHistoryApi(page, limit);
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to load payment history',
    );
  }
});
