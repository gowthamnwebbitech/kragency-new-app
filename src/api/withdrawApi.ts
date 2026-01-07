import { getApi, postApi } from '@/api/apiMethods';
import { WalletBonusResponse, WithdrawRequestBody, WithdrawResponse } from '@/features/withdraw/withdrawTypes';

// Fetch wallet & bonus
export const fetchWalletBonusApi = async (): Promise<WalletBonusResponse> => {
  return getApi<WalletBonusResponse>('/customer/withdraw');
};

// Send withdraw request
export const withdrawApi = async (body: WithdrawRequestBody): Promise<WithdrawResponse> => {
  return postApi<WithdrawResponse>('/customer/withdraw-request', body);
};