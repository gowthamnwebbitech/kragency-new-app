import { createSlice } from '@reduxjs/toolkit';
import { WalletState } from './walletTypes';
import { fetchWalletThunk } from './walletThunk';

const initialState: WalletState = {
  data: null,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWalletThunk.pending, state => {
        state.loading = true;
      })
      .addCase(fetchWalletThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWalletThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });
  },
});

export default walletSlice.reducer;
