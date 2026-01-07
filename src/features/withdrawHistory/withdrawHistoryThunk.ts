import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWithdrawHistoryApi } from '@/api/withdrawHistoryApi';
import { WithdrawHistoryResponse } from './withdrawHistoryType';

export const fetchWithdrawHistoryThunk = createAsyncThunk<
    WithdrawHistoryResponse['data'],
    void,
    { rejectValue: string }
>('withdrawHistory/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await fetchWithdrawHistoryApi();

        if (!res.success) {
            throw new Error('Failed to fetch withdrawal history');
        }

        return res.data;
    } catch (err: any) {
        return rejectWithValue(
            err?.response?.data?.message ||
            err?.message ||
            'Network error'
        );
    }
});
