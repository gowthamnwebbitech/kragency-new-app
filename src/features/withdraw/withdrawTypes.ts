export interface WalletBonusBalance {
  wallet_balance: string;
  bonus_balance: string;
  min_withdraw: number;
}

export interface WalletBonusResponse {
  success: boolean;
  wallet_balance: string;
  bonus_balance: string;
  min_withdraw: number;
}

export interface WithdrawRequestBody {
  amount: number;
}

export interface WithdrawResponse {
  success: boolean;
  message: string;
  new_balance?: WalletBonusBalance;
}

export interface WithdrawState {
  walletBalance: number;
  bonusBalance: number;
  minWithdraw: number;
  loading: boolean;
  withdrawLoading: boolean;
  error: string | null;
  withdrawSuccess: string | null;
}
    