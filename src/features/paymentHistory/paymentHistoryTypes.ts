export type PaymentType = 'credit' | 'debit';

export interface PaymentHistoryItem {
  date: string;
  type: PaymentType;
  description: string | null;
  amount: string;
}

export interface PaymentSummary {
  total_amount: string;
  bonus_amount: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaymentHistoryApiResponse {
  success: boolean;
  summary: PaymentSummary;
  pagination: Pagination;
  data: PaymentHistoryItem[];
}
