import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWalletApi } from '../../api/walletApi';
import { WalletData, WalletResponse } from './walletTypes';

export const fetchWalletThunk = createAsyncThunk<
  WalletData,
  void,
  { rejectValue: string }
>('wallet/fetch', async (_, { rejectWithValue }) => {
  try {
    const res: WalletResponse = await fetchWalletApi();
    if (!res.success) throw new Error(res.message);
    return res.data;
  } catch (e: any) {
    return rejectWithValue(e?.message || 'Failed to load wallet balance');
  }
});
