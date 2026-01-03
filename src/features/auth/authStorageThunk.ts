import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from './authTypes';

export const loadAuthFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async () => {
    const [token, user] = await Promise.all([
      AsyncStorage.getItem('authToken'),
      AsyncStorage.getItem('authUser'),
    ]);

    return {
      token,
      user: user ? (JSON.parse(user) as User) : null,
    };
  }
);
