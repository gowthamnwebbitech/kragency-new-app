import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '@/env';
import { store } from '@/app/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('authToken') || store.getState().auth.token;

    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }

    // ✅ Log the full URL and method
    console.log('Axios Request:', config.method?.toUpperCase(), config.baseURL + config.url);

    return config;
  },
  error => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  response => {
    console.log('Axios Response:', response.config.url, response.status);
    return response;
  },
  async error => {
    console.error('Axios Error:', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      store.dispatch({ type: 'auth/logout' });
    }
    return Promise.reject(error);
  }
);
