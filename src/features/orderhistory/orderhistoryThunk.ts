import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOrderHistoryApi } from '@/api/orderHistoryApi';
import {
  OrderHistoryApiResponse,
  FetchOrderHistoryArgs,
} from './orderhistoryTypes';

export const fetchOrderHistoryThunk = createAsyncThunk<
  OrderHistoryApiResponse,
  FetchOrderHistoryArgs,
  { rejectValue: string }
>('orderHistory/fetch', async ({ page, limit }, { rejectWithValue }) => {
  try {
    return await fetchOrderHistoryApi({ page, limit });
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || 'Failed to load order history'
    );
  }
});
