import { getApi } from '@/api/apiMethods';
import { PaymentHistoryApiResponse } from '@/features/paymentHistory/paymentHistoryTypes';

export const fetchPaymentHistoryApi = (
  page: number,
  limit: number,
): Promise<PaymentHistoryApiResponse> => {
  return getApi<PaymentHistoryApiResponse>(
    `/customer/payment-history?page=${page}&limit=${limit}`,
  );
};
