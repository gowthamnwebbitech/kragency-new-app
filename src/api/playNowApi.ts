import { getApi, postApi } from '@/api/apiMethods';
import { SlotApiResponse, GameApiResponse } from '@/features/playNow/playNowTypes';

export const fetchSlotsApi = (providerId: number) => {
  return getApi<SlotApiResponse>(`/customer/play-now/${providerId}`);
};

export const fetchGamesApi = (
  providerId: number,
  slotTimeId: number
) => {
  return getApi<GameApiResponse>(
    `/customer/play-now/${providerId}/${slotTimeId}`
  );
};


export interface WalletCheckResponse {
  success: boolean;
  message: string;
  required: { wallet: number; bonus: number };
  available: { wallet: string; bonus: string };
}

export const checkWalletApi = (payload: { game_id: number; quantity: number; amount: number }) => {
  return postApi<WalletCheckResponse>(`/customer/check-wallet`, payload);
};