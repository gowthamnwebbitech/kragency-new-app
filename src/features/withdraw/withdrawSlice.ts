import { createSlice } from '@reduxjs/toolkit';
import { WithdrawState } from './withdrawTypes';
import { fetchWalletBonusThunk, withdrawThunk } from './withdrawThunks';

const initialState: WithdrawState = {
  walletBalance: 0,
  bonusBalance: 0,
  minWithdraw: 500,
  loading: false,
  withdrawLoading: false,
  error: null,
  withdrawSuccess: null,
};

const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.error = null;
      state.withdrawSuccess = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wallet
    builder.addCase(fetchWalletBonusThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWalletBonusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.walletBalance = action.payload.walletBalance;
      state.bonusBalance = action.payload.bonusBalance;
      state.minWithdraw = action.payload.minWithdraw;
    });
    builder.addCase(fetchWalletBonusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch wallet';
    });

    // Withdraw
    builder.addCase(withdrawThunk.pending, (state) => {
      state.withdrawLoading = true;
      state.error = null;
      state.withdrawSuccess = null;
    });
    builder.addCase(withdrawThunk.fulfilled, (state, action) => {
      state.withdrawLoading = false;
      state.withdrawSuccess = action.payload.message;
      if (action.payload.newBalance) {
        state.walletBalance = action.payload.newBalance.walletBalance;
        state.bonusBalance = action.payload.newBalance.bonusBalance;
      }
    });
    builder.addCase(withdrawThunk.rejected, (state, action) => {
      state.withdrawLoading = false;
      state.error = action.payload ?? 'Withdraw failed';
    });
  },
});

export const { clearMessage } = withdrawSlice.actions;
export default withdrawSlice.reducer;
