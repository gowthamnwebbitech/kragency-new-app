import { createSlice } from '@reduxjs/toolkit';
import { ProfileState } from './profileTypes';
import { fetchProfileThunk } from './profileThunk';

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  success: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileMessage(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfileThunk.pending, state => {
        state.loading = true;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      });
  },
});

export const { clearProfileMessage } = profileSlice.actions;
export default profileSlice.reducer;
