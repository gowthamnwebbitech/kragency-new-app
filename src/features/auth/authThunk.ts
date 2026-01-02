import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '@/api/authApi';
import { User } from './authTypes';
import { ENV } from '@/env';

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
    const url = ENV.API_BASE_URL + '/customer/login';
    console.log('Login API called:', url, 'Payload:', data);

    const res = await loginApi(data);

    console.log('Login Success:', res);

    await AsyncStorage.setItem('authToken', res.token);

    return {
      token: res.token,
      user: res.user,
      message: res.message,
    };
  } catch (err: any) {
    // Full error logging
    console.error('Login Error full object:', err);

    // Safe extraction of error message
    const message =
      err?.response?.data?.message || // server message
      err?.message ||                // network error
      'Something went wrong. Please try again.';

    console.warn('Login Error message:', message);

    return rejectWithValue(message);
  }
});
