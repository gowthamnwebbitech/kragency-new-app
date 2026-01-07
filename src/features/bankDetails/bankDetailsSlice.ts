import { createSlice } from '@reduxjs/toolkit';
import { BankDetailsState } from './bankDetailsTypes';
import { fetchBankDetailsThunk, storeBankDetailsThunk } from './bankDetailsThunk';

const initialState: BankDetailsState = {
    data: null,
    loading: false,
    saving: false,
    error: null,
    success: null,
};

const bankDetailsSlice = createSlice({
    name: 'bankDetails',
    initialState,
    reducers: {
        clearBankMessage(state) {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankDetailsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBankDetailsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBankDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch details';
            })

            // Save / Update Details
            .addCase(storeBankDetailsThunk.pending, (state) => {
                state.saving = true;
                state.error = null;
                state.success = null;
            })
            .addCase(storeBankDetailsThunk.fulfilled, (state, action) => {
                state.saving = false;
                state.success = action.payload; 
                state.data = action.meta.arg;
            })
            .addCase(storeBankDetailsThunk.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload || 'Failed to save details';
            });
    },
});

export const { clearBankMessage } = bankDetailsSlice.actions;
export default bankDetailsSlice.reducer;