import { postApi } from './apiMethods';
import { User } from '@/features/auth/authTypes';

interface LoginRequest {
  mobile: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const loginApi = (data: LoginRequest): Promise<LoginResponse> =>
  postApi<LoginResponse, LoginRequest>('/customer/login', data);
