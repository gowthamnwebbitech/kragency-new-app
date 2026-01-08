/* ===== API MODELS ===== */

export interface Slider {
  id: number;
  image_path: string;
}

export interface Schedule {
  betting_providers_id: number;
  name: string;
  next_slot_time: string;
  imagepath: string;
  next_slot_id: number;
}

/* ===== UI MODELS ===== */

export interface Banner {
  id: number;
  image: string;
}

export interface FeaturedGame {
  id: number;
  name: string;
  time: string;
  logo: string;
   providerId: number;
}

/* ===== API RAW RESPONSE ===== */

export interface HomeApiResponse {
  sliders: Slider[];
  schedules: Schedule[];
}

/* ===== SLICE STATE ===== */

export interface GamesState {
  banners: Banner[];
  featuredGames: FeaturedGame[];
  loading: boolean;
  error: string | null;
}
