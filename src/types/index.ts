export type ProductCategory = 
  | 'Maroons'
  | 'Sparklers'
  | 'Ground Chakkars'
  | 'Chakkars'
  | 'Wheels'
  | 'Flower Pots'
  | 'Colourful Fountains'
  | 'Fountains'
  | 'Sky Rockets'
  | 'Rockets'
  | 'Novelties'
  | 'Aerial Multi-Shots'
  | 'Cakes'
  | 'Safety Matches'
  | 'Matches'
  | 'Gift Boxes'
  | string;

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Maroons',
  'Sparklers',
  'Ground Chakkars',
  'Wheels',
  'Flower Pots',
  'Colourful Fountains',
  'Sky Rockets',
  'Novelties',
  'Aerial Multi-Shots',
  'Safety Matches',
  'Gift Boxes'
];

export type SoundLevel = 'Low / Silent' | 'Medium' | 'High Spectacle';

export interface Product {
  id: string;
  code?: string;
  name: string;
  category: ProductCategory;
  price: number;
  piece_count: string;
  unit_price?: number;
  unit_name?: string;
  bundle_rate?: number;
  bundle_unit?: string;
  unit_breakdown?: string;
  description: string;
  safety_instructions: string;
  safety_tags?: string[];
  sound_level?: SoundLevel;
  video_url?: string;
  image_url: string;
  image?: string;
  imageUrl?: string;
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

export type BookingStatus = 'confirmed' | 'completed' | 'checked_in' | 'cancelled' | 'no_show';

export interface Booking {
  id: string;
  booking_code: string;
  ticket_code?: string;
  qr_token: string;
  slot_id?: string;
  customer_name: string;
  customer_phone: string;
  phone?: string;
  slot_date: string;
  slot_time: string;
  visit_date?: string;
  time_slot?: string;
  total_amount: number;
  visitor_count?: number;
  status: BookingStatus;
  is_scanned?: boolean;
  scanned_at?: string | null;
  verified_at?: string | null;
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
  qr_token?: string;
  slot_date?: string;
  slot_time?: string;
  start_time?: string;
  end_time?: string;
  total_amount?: number;
  customer_name?: string;
  visitor_count?: number;
  error?: string;
}
