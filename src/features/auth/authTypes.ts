export interface User {
  id: number;
  name: string;
  mobile: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}
