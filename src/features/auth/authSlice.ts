import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from './authTypes';
import { loginThunk } from './authThunk';
import { loadAuthFromStorage } from './authStorageThunk';

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: true, 
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.multiRemove(['authToken', 'authUser']);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loadAuthFromStorage.pending, state => {
        state.loading = true;
      })
      .addCase(loadAuthFromStorage.fulfilled, (state, action) => {
        if (action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
