export interface DrawResult {
  providerName: string;
  drawTime: string;       // "19:00:00"
  drawResult: string | null;
  createdAt: string;
}

export interface DrawResultState {
  list: DrawResult[];
  loading: boolean;
  error: string | null;
}
