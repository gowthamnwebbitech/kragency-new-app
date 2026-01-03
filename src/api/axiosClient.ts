import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/app/store';
import { ENV } from '@/env';
import { logout } from '@/features/auth/authSlice';

export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL, 
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 🔐 REQUEST INTERCEPTOR */
axiosClient.interceptors.request.use(
  async config => {
    const reduxToken = store.getState().auth.token;
    const storageToken = await AsyncStorage.getItem('authToken');
    const token = reduxToken || storageToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      '➡️',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    return config;
  },
  error => Promise.reject(error)
);

/* 🚫 RESPONSE INTERCEPTOR */
axiosClient.interceptors.response.use(
  response => {
    console.log('✅', response.config.url, response.status);
    return response;
  },
  async error => {
    console.error(
      '❌',
      error.config?.url,
      error.response?.status
    );

    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);
