/* ========= SHARED / SUB-INTERFACES ========= */
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
  slot_time: string; // Added because fetchSlots uses game.slot_time
  digit_master: DigitMaster;
  provider_slot: ProviderSlot;
}

/* ========= API RESPONSES ========= */

export interface SlotApiResponse {
  success: boolean;
  betting_provider_id: string;
  betting_provider_name: string; // From your JSON
  close_minutes: number;
  show_slot: number;
  slot_time_id: string;
  // Note: Your JSON shows gameSlots as the primary data container
  gameSlots: Record<string, GameSlotItem[]>; 
}

export interface GameApiResponse {
  success: boolean;
  betting_provider_id: string;
  betting_provider_name: string; // Crucial for showing provider name
  close_minutes: number;
  gameSlots: Record<string, GameSlotItem[]>;
}

/* ========= UI STATE MODELS ========= */

export interface SlotUI {
  slot_time: string;
  slot_time_id: number;
  status: 'active' | 'closed';
}

export interface GameGroup {
  title: string;
  price: number;
  betting_provider_name: string;
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