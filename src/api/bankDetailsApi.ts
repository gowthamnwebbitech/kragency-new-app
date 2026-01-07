import { getApi, postApi } from '@/api/apiMethods';
import { BankDetails, BankDetailsResponse } from '@/features/bankDetails/bankDetailsTypes';

export const fetchBankDetailsApi = () =>
  getApi<BankDetailsResponse>('/customer/bank-details');

export const storeBankDetailsApi = (body: BankDetails) =>
  postApi<BankDetailsResponse>('/customer/bank-details-store', body);
