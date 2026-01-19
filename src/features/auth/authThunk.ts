import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '@/api/authApi';
import { User } from './authTypes';

interface LoginPayload {
  mobile: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginApi(data);

    // 🔐 Persist auth
    await AsyncStorage.multiSet([
      ['authToken', res.token],
      ['authUser', JSON.stringify(res.user)],
    ]);

    return {
      token: res.token,
      user: res.user,
      message: res.message,
    };
  } catch (err: any) {
    console.error('❌ LOGIN ERROR FULL:', err);

    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Login failed. Try again.';

    console.warn('⚠️ LOGIN ERROR MESSAGE:', message);

    return rejectWithValue(message);
  }
});
