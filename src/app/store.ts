import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import drawResultReducer from '@/features/drawResult/drawResultSlice';
import orderHistoryReducer from '@/features/orderhistory/orderhistorySlice';
import paymentHistoryReducer from '@/features/paymentHistory/paymentHistorySlice';
import withdrawReducer from '@/features/withdraw/withdrawSlice';
import withdrawHistoryReducer from '@/features/withdrawHistory/withdrawHistorySlice';
import bankDetailsReducer from '@/features/bankDetails/bankDetailsSlice';
import profileReducer from '@/features/userProfile/profileSlice';
import walletReducer from '@/features/Walletheader/walletSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drawResults: drawResultReducer,
    orderHistory: orderHistoryReducer,
    paymentHistory: paymentHistoryReducer,
    withdraw: withdrawReducer,
    withdrawHistory: withdrawHistoryReducer,
    bankDetails: bankDetailsReducer,
    profile: profileReducer,
     wallet: walletReducer,

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
