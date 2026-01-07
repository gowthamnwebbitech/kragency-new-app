import { createSlice } from '@reduxjs/toolkit';
import { DrawResultState } from './drawResultTypes';
import { fetchDrawResultsThunk } from './drawResultThunk';

const initialState: DrawResultState = {
  list: [],
  loading: false,
  error: null,
};

const drawResultSlice = createSlice({
  name: 'drawResults',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDrawResultsThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrawResultsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDrawResultsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export default drawResultSlice.reducer;
