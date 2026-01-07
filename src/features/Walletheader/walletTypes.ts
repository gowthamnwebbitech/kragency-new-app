export interface WalletData {
  wallet_balance: string;
  bonus_balance: string;
}

export interface WalletResponse {
  success: boolean;
  data: WalletData;
  message?: string;
}

export interface WalletState {
  data: WalletData | null;
  loading: boolean;
  error: string | null;
}
