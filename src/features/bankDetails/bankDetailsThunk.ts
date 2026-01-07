import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBankDetailsApi, storeBankDetailsApi } from '@/api/bankDetailsApi';
import { BankDetails, BankDetailsResponse } from './bankDetailsTypes';

// Fetch existing bank details
export const fetchBankDetailsThunk = createAsyncThunk<
  BankDetails | null,
  void,
  { rejectValue: string }
>('bankDetails/fetch', async (_, { rejectWithValue }) => {
  try {
    const res: BankDetailsResponse = await fetchBankDetailsApi();
    if (!res.success) throw new Error(res.message);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Failed to load bank details');
  }
});

// Store / update bank details
export const storeBankDetailsThunk = createAsyncThunk<
  string,
  BankDetails,
  { rejectValue: string }
>('bankDetails/store', async (body, { rejectWithValue }) => {
  try {
    const res: BankDetailsResponse = await storeBankDetailsApi(body);
    if (!res.success) throw new Error(res.message);
    return res.message || 'Bank details updated successfully';
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Failed to save bank details');
  }
});
