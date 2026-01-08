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
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchHomeGames.pending, state => {
        state.loading = true;
      })
      .addCase(fetchHomeGames.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners;
        state.featuredGames = action.payload.featuredGames;
      })
      .addCase(fetchHomeGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default homeSlice.reducer;
