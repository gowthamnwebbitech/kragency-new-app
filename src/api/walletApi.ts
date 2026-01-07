import { getApi } from '@/api/apiMethods';
import { WalletResponse } from '../features/Walletheader/walletTypes';

export const fetchWalletApi = () =>
  getApi<WalletResponse>('/customer/wallet-bonus-balance');
