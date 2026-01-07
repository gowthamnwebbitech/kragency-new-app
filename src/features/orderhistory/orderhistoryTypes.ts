export type WinningStatus = 'won' | 'lost' | null;

/** Single bet inside an order */
export interface OrderItem {
  provider: string;
  slot_time: string | null;
  digit_type: string;
  entered_digit: string;
  quantity: number;
  amount: string;
  win_amount: string | null;
  win_status: WinningStatus;
}

/** One order */
export interface OrderHistoryOrder {
  order_id: number;
  order_date: string;
  total_amount: string;
  opening_balance: string;
  closing_balance: string;
  bonus_opening_balance: string;
  bonus_closing_balance: string;
  items: OrderItem[];
}

/** Pagination */
export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

/** API response */
export interface OrderHistoryApiResponse {
  success: boolean;
  pagination: Pagination;
  data: OrderHistoryOrder[];
}

export interface FetchOrderHistoryArgs {
  page: number;
  limit: number;
}

/** Redux State */
export interface OrderHistoryState {
  list: OrderHistoryOrder[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}
