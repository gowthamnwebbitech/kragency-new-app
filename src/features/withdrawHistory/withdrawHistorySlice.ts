import { createSlice } from '@reduxjs/toolkit';
import { WithdrawHistoryState } from './withdrawHistoryType';
import { fetchWithdrawHistoryThunk } from './withdrawHistoryThunk';

const initialState: WithdrawHistoryState = {
    list: [],
    loading: false,
    error: null,
};

const withdrawHistorySlice = createSlice({
    name: 'withdrawHistory',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchWithdrawHistoryThunk.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawHistoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchWithdrawHistoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to load history';
            });
    },
});

export default withdrawHistorySlice.reducer;
