import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWalletBonusApi, withdrawApi } from '@/api/withdrawApi';
import {
  WithdrawRequestBody,
  WithdrawResponse,
  WalletBonusResponse,
} from './withdrawTypes';

/* =========================================================
   FETCH WALLET & BONUS THUNK
========================================================= */
export const fetchWalletBonusThunk = createAsyncThunk<
  {
    walletBalance: number;
    bonusBalance: number;
    minWithdraw: number;
  },
  void,
  { rejectValue: string }
>('withdraw/fetchWalletBonus', async (_, { rejectWithValue }) => {
  try {
    if (__DEV__) {
      console.log('📤 API CALL → fetchWalletBonusApi');
    }

    const res: WalletBonusResponse = await fetchWalletBonusApi();

    if (__DEV__) {
      console.log('📥 API RESPONSE ← fetchWalletBonusApi', res);
    }

    if (!res.success) {
      throw new Error('Failed to fetch wallet balance');
    }

    const payload = {
      walletBalance: parseFloat(res.wallet_balance ?? '0'),
      bonusBalance: parseFloat(res.bonus_balance ?? '0'),
      minWithdraw: res.min_withdraw ?? 500,
    };

    if (__DEV__) {
      console.log('✅ THUNK PAYLOAD → fetchWalletBonusThunk', payload);
    }

    return payload;
  } catch (err: any) {
    if (__DEV__) {
      console.error('❌ fetchWalletBonusThunk ERROR', err);
    }

    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch wallet balance'
    );
  }
});

/* =========================================================
   WITHDRAW REQUEST THUNK
========================================================= */
export const withdrawThunk = createAsyncThunk<
  {
    message: string;
    newBalance?: {
      walletBalance: number;
      bonusBalance: number;
    };
  },
  WithdrawRequestBody,
  { rejectValue: string }
>('withdraw/send', async (body, { rejectWithValue }) => {
  try {
    if (__DEV__) {
      console.log('📤 API CALL → withdrawApi');
      console.log('📦 REQUEST PAYLOAD → withdrawThunk', body);
    }

    const res: WithdrawResponse = await withdrawApi(body);

    if (__DEV__) {
      console.log('📥 API RESPONSE ← withdrawApi', res);
    }

    if (!res.success) {
      throw new Error(res.message || 'Withdraw failed');
    }

    const newBalance = res.new_balance
      ? {
          walletBalance: parseFloat(res.new_balance.wallet_balance),
          bonusBalance: parseFloat(res.new_balance.bonus_balance),
        }
      : undefined;

    const payload = {
      message: res.message,
      newBalance,
    };

    if (__DEV__) {
      console.log('✅ THUNK PAYLOAD → withdrawThunk', payload);
    }

    return payload;
  } catch (err: any) {
    if (__DEV__) {
      console.error('❌ withdrawThunk ERROR', err);
    }

    return rejectWithValue(
      err?.response?.data?.message ||
        err?.message ||
        'Withdraw request failed'
    );
  }
});
