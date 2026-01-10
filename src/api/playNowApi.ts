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

export interface WalletCheckPayload {
  type: string;        
  game_id: string;     
  game_label: string;  // Name of the game (e.g., "XABC")
  digits: string;      // The selected numbers (e.g., "1111")
  quantity: string;    // Quantity as a string
  amount: string;      // Unit price as a string
  is_box: string;      // "true" or "false"
  total: string;       // Cumulative total (Cart Total + New Item)
}


export const checkWalletApi = (payload: WalletCheckPayload) => {
  return postApi<WalletCheckResponse>(`/customer/check-wallet`, payload);
};