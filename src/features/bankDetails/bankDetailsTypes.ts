export interface BankDetails {
  bank_name: string;
  ifsc_code: string;
  branch_name: string;
  account_number: string;
  notes?: string;
}

export interface BankDetailsResponse {
  success: boolean;
  data: BankDetails | null;
  message?: string;
}

export interface BankDetailsState {
  data: BankDetails | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
}
