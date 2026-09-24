export type ProductCategory = 
  | 'Sparklers'
  | 'Ground Chakkars'
  | 'Ground Spinners'
  | 'Flower Pots'
  | 'Flower Pots & Fountains'
  | 'Sky Rockets'
  | 'Sky Rockets & Missiles'
  | 'Aerial Multi-Shots'
  | 'Aerial Multi-Shot Cakes'
  | 'Gift Boxes'
  | 'Curated Family Gift Boxes';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Sparklers',
  'Ground Chakkars',
  'Flower Pots',
  'Sky Rockets',
  'Aerial Multi-Shots',
  'Gift Boxes'
];

export type SoundLevel = 'Low / Silent' | 'Medium' | 'High Spectacle';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  piece_count: string;
  description: string;
  safety_instructions: string;
  safety_tags?: string[];
  sound_level?: SoundLevel;
  video_url?: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface Slot {
  id: string;
  slot_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS or HH:MM
  end_time: string; // HH:MM:SS or HH:MM
  total_capacity: number;
  booked_capacity: number;
  is_blocked: boolean;
  created_at?: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  booking_code: string;
  slot_id: string;
  customer_name: string;
  customer_phone: string;
  visitor_count: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  slot?: Slot;
}

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'floor_staff';
  token?: string;
}

export interface BookingRpcResponse {
  success: boolean;
  booking_id?: string;
  booking_code?: string;
  slot_date?: string;
  start_time?: string;
  end_time?: string;
  customer_name?: string;
  visitor_count?: number;
  error?: string;
}
