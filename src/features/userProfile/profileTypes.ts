export interface UserProfile {
  name: string;
  mobile: string;
  wallet_balance: string;
  bonus_balance: string;
  order_count: number;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile | null;
  message?: string;
}

export interface ProfileState {
  data: UserProfile | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}
