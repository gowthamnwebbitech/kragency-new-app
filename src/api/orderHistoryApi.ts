import { getApi } from '@/api/apiMethods';
import { OrderHistoryApiResponse } from '@/features/orderhistory/orderhistoryTypes';

export const fetchOrderHistoryApi = (): Promise<OrderHistoryApiResponse> => {
  return getApi<OrderHistoryApiResponse>('/customer/orders-history');
};
