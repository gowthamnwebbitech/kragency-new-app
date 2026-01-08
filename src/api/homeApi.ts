import { getApi } from '@/api/apiMethods';
import { GamesResponse } from '@/features/home/homeTypes';

/* GET HOME DATA */
export const fetchHomeGamesApi = () => {
  return getApi<GamesResponse>('/customer/game-schedule');
};
