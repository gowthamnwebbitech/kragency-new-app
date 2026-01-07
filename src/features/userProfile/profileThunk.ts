import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProfileApi } from '@/api/profileApi';
import { UserProfile } from './profileTypes';

export const fetchProfileThunk = createAsyncThunk<UserProfile | null, void, { rejectValue: string }>(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchProfileApi();
      if (!res.success) throw new Error(res.message || 'Failed to fetch profile');
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Something went wrong');
    }
  }
);
