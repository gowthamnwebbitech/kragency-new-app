import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSlotsApi, fetchGamesApi } from '@/api/playNowApi';
import { SlotUI, GameGroup } from './playNowTypes';
import { isSlotOpen } from '@/utils/isSlotOpen';

/* ================= FETCH SLOTS ================= */
export const fetchSlots = createAsyncThunk<
  SlotUI[],
  number,
  { rejectValue: string }
>('playNow/fetchSlots', async (providerId, { rejectWithValue }) => {
  try {
    const res = await fetchSlotsApi(providerId);

    // Check if gameSlots exists
    if (!res.gameSlots || typeof res.gameSlots !== 'object') {
      return rejectWithValue('No slots available');
    }

    // Extract all unique slots from gameSlots
    const slotsMap: Record<number, SlotUI> = {};

    Object.values(res.gameSlots).forEach((gamesArray: any[]) => {
      gamesArray.forEach(game => {
        if (game.slot_time_id && !slotsMap[game.slot_time_id]) {
          const isActive = isSlotOpen(game.slot_time, res.close_minutes ?? 0);
          slotsMap[game.slot_time_id] = {
            slot_time: game.slot_time,
            slot_time_id: game.slot_time_id,
            status: isActive ? 'active' : 'closed',
          };
        }
      });
    });

    const slots = Object.values(slotsMap).sort(
      (a, b) => a.slot_time.localeCompare(b.slot_time)
    );

    if (!slots.length) return rejectWithValue('No slots available');

    return slots;
  } catch (error) {
    console.error('[fetchSlots] ERROR:', error);
    return rejectWithValue('Failed to load slots');
  }
});

/* ================= FETCH GAMES ================= */
export const fetchGames = createAsyncThunk<
  GameGroup[],
  { providerId: number; slotTimeId: number },
  { rejectValue: string }
>(
  'playNow/fetchGames',
  async ({ providerId, slotTimeId }, { rejectWithValue }) => {
    try {
      const res = await fetchGamesApi(providerId, slotTimeId);

      if (!res.gameSlots || typeof res.gameSlots !== 'object') {
        return rejectWithValue('Invalid games response');
      }
      
// Get the provider name from the root of the response
      const providerName = res.betting_provider_name || "PROVIDER";

      // Filter only games for this slotTimeId
      const groups: GameGroup[] = Object.entries(res.gameSlots)
        .map(([key, items]) => {
          const filteredItems = items.filter(
            game => game.slot_time_id === slotTimeId
          );
          if (!filteredItems.length) return null;

          const parts = key.split('_');
          if (parts.length < 3) return null;

          const price = Number(parts[1]);
          const winAmount = Number(parts[2]);

          return {
            title: `Win ₹${winAmount}`,
            price,
            winAmount,
            digits: filteredItems,
            betting_provider_name: providerName,
          };
        })
        .filter(Boolean) as GameGroup[];

      return groups;
    } catch (error) {
      console.error('[fetchGames] ERROR:', error);
      return rejectWithValue('Failed to load games');
    }
  }
);
