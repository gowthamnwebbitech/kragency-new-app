import { createSlice } from '@reduxjs/toolkit';
import { GamesState } from './homeTypes';
import { fetchHomeGames } from './homeThunk';

const initialState: GamesState = {
  banners: [],
  featuredGames: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // Call this if you want to manually reset the state
    resetHomeState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHomeGames.pending, state => {
        state.loading = true;
        state.error = null; // Clear error when retrying
      })
      .addCase(fetchHomeGames.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners;
        state.featuredGames = action.payload.featuredGames;
        state.error = null;
      })
      .addCase(fetchHomeGames.rejected, (state, action) => {
        state.loading = false;
        // Capture the network error message
        state.error = action.payload ?? 'Network Error';
      });
  },
});

export const { resetHomeState } = homeSlice.actions;
export default homeSlice.reducer;