import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/app/store';
import { ENV } from '@/env';
import { logout } from '@/features/auth/authSlice';

/* ================= AXIOS INSTANCE ================= */

export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const reduxToken = store.getState().auth.token;
    const storageToken = await AsyncStorage.getItem('authToken');
    const token = reduxToken || storageToken;

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // attach metadata safely
    (config as any).metadata = { startTime: Date.now() };

    if (__DEV__) {
      console.groupCollapsed(
        `➡️ REQUEST ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log('Base URL:', config.baseURL);
      console.log('Headers:', {
        Authorization: token ? 'Bearer ***' : undefined,
      });
      console.log('Params:', config.params);
      console.log('Body:', config.data);
      console.groupEnd();
    }

    return config;
  },
  error => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const duration =
      Date.now() - (response.config as any)?.metadata?.startTime;

    if (__DEV__) {
      console.groupCollapsed(
        `✅ RESPONSE ${response.status} ${response.config.url} (${duration}ms)`
      );
      console.log('Data:', response.data);
      console.groupEnd();
    }

    return response;
  },
  async (error: AxiosError) => {
    if (!error.response) {
      console.error('🌐 NETWORK ERROR — server unreachable');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const duration =
      Date.now() - (error.config as any)?.metadata?.startTime;

    console.groupCollapsed(
      `❌ ERROR ${status} ${error.config?.url} (${duration}ms)`
    );
    console.error('Message:', (data as any)?.message);
    console.error('Errors:', (data as any)?.errors);
    console.groupEnd();

    if (status === 401) {
      await AsyncStorage.multiRemove(['authToken', 'authUser']);
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);
