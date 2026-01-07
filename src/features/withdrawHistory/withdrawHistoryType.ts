export interface WithdrawHistoryItem {
  id: number;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface WithdrawHistoryResponse {
  success: boolean;
  data: WithdrawHistoryItem[];
}

export interface WithdrawHistoryState {
  list: WithdrawHistoryItem[];
  loading: boolean;
  error: string | null;
}
