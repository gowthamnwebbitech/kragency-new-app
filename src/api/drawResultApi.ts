import { getApi } from '@/api/apiMethods';
import { DrawResult } from '@/features/drawResult/drawResultTypes';

interface DrawResultApiResponse {
  success: boolean;
  data: {
    provider: string;
    time: string;
    result: string | null;
    created_at: string;
  }[];
}

export const fetchDrawResultsApi = async (): Promise<DrawResult[]> => {
  const res = await getApi<DrawResultApiResponse>('/customer/results');

  return res.data.map(item => ({
    providerName: item.provider,
    drawTime: item.time,
    drawResult: item.result,
    createdAt: item.created_at,
  }));
};
