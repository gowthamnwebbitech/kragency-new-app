import { axiosClient } from './axiosClient';
import { AxiosRequestConfig } from 'axios';

export const getApi = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosClient.get<T>(url, config);
  return response.data;
};

export const postApi = async <T, B = object>(
  url: string,
  data?: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosClient.post<T>(url, data, config);
  return response.data;
};
