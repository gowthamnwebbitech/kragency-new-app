import { createAsyncThunk } from '@reduxjs/toolkit';
import { DrawResult } from './drawResultTypes';
import { fetchDrawResultsApi } from '@/api/drawResultApi';

export const fetchDrawResultsThunk = createAsyncThunk<
    DrawResult[],
    void,
    { rejectValue: string }
>('drawResults/fetch', async (_, { rejectWithValue }) => {
    try {
        return await fetchDrawResultsApi();
    } catch (err: any) {
        return rejectWithValue(
            err?.response?.data?.message || 'Failed to load results'
        );
    }
});
