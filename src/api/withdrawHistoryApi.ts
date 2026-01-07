import { getApi } from '@/api/apiMethods';
import { WithdrawHistoryResponse } from '@/features/withdrawHistory/withdrawHistoryType';

export const fetchWithdrawHistoryApi = () =>
    getApi<WithdrawHistoryResponse>('/customer/withdraw-history');
