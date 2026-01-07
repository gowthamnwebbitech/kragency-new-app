import { createSlice } from '@reduxjs/toolkit';
import { OrderHistoryState } from './orderhistoryTypes';
import { fetchOrderHistoryThunk } from './orderhistoryThunk';

const initialState: OrderHistoryState = {
  list: [],
  pagination: null,
  loading: false,
  error: null,
};

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    clearOrderHistory(state) {
      state.list = [];
      state.pagination = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrderHistoryThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistoryThunk.fulfilled, (state, action) => {
        state.loading = false;

        const page = action.meta.arg.page;

        state.pagination = action.payload.pagination;

        if (page === 1) {
          state.list = action.payload.data;
        } else {
          state.list.push(...action.payload.data);
        }
      })
      .addCase(fetchOrderHistoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

export const { clearOrderHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;
