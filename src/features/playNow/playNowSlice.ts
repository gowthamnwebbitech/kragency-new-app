import { createSlice } from '@reduxjs/toolkit';
import { fetchSlots, fetchGames } from './playNowThunk';
import { PlayNowState } from './playNowTypes';

const initialState: PlayNowState = {
  slots: [],
  games: [],
  slotsLoading: false,
  gamesLoading: false,
  error: null,
};

const playNowSlice = createSlice({
  name: 'playNow',
  initialState,
  reducers: {
    clearGames: state => {
      state.games = [];
    },
  },
  extraReducers: builder => {
    builder
      /* Slots */
      .addCase(fetchSlots.pending, state => {
        state.slotsLoading = true;
        state.error = null;
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.slots = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.slotsLoading = false;
        state.slots = [];
        state.error = action.payload ?? null;
      })

      /* Games */
      .addCase(fetchGames.pending, state => {
        state.gamesLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.gamesLoading = false;
        state.games = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.gamesLoading = false;
        state.games = [];
        state.error = action.payload ?? null;
      });
  },
});

export const { clearGames } = playNowSlice.actions;
export default playNowSlice.reducer;
