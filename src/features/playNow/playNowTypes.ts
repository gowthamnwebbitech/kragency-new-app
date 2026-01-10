/* ========= SLOT API ========= */

export interface SlotApiItem {
  slot_time: string; // "10:00:00"
  slot_time_id: number;
}

export interface SlotApiResponse {
  success: boolean;
  close_minutes: number;
  slots: SlotApiItem[];
}

/* ========= GAME API ========= */

export interface DigitMaster {
  id: number;
  name: string;
  type: number;
}

export interface ProviderSlot {
  amount: number;
  winning_amount: number;
}

export interface GameSlotItem {
  id: number;
  slot_time_id: number;
  digit_master: DigitMaster;
  provider_slot: ProviderSlot;
}

export interface GameApiResponse {
  success: boolean;
  gameSlots: Record<string, GameSlotItem[]>;
}

/* ========= UI ========= */

export interface SlotUI {
  slot_time: string;
  slot_time_id: number;
  status: 'active' | 'closed';
}

export interface GameGroup {
  title: string;
  price: number;
  provider: string;
  winAmount: number;
  digits: GameSlotItem[];
}

export interface PlayNowState {
  slots: SlotUI[];
  games: GameGroup[];
  slotsLoading: boolean;
  gamesLoading: boolean;
  error: string | null;
}
