import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHomeGamesApi } from '@/api/homeApi';
import { GamesState, HomeApiResponse } from './homeTypes';
import { ENV } from '@/env';

export const fetchHomeGames = createAsyncThunk<
    Pick<GamesState, 'banners' | 'featuredGames'>,
    void,
    { rejectValue: string }
>('home/fetchHomeGames', async (_, { rejectWithValue }) => {
    try {
        const response = await fetchHomeGamesApi<HomeApiResponse>();

        return {
            banners: response.sliders?.map(item => ({
                id: item.id,
                image: `${ENV.IMAGE_API_URL}${item.image_path}`,
            })) ?? [],

            featuredGames: response.schedules?.map(item => ({
                id: item.next_slot_id,
                providerId: item.betting_providers_id,
                name: item.name,
                time: item.next_slot_time,
                logo: `${ENV.IMAGE_API_URL}storage/${item.imagepath}`,
            })) ?? [],
        };
    } catch (error: any) {
        return rejectWithValue(
            error?.response?.data?.message || 'Failed to load home data',
        );
    }
});
