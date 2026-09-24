import { Product, Slot, Booking } from '../types';

// ZERO INITIAL PRODUCTS (Clean slate / Null state)
export const INITIAL_PRODUCTS: Product[] = [];

// Helper date offset function
export const getFormattedDateOffset = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Seed Slot generation for showroom visitations (Visakhapatnam showroom)
export const generateInitialSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const today = new Date();

  for (let d = 0; d < 14; d++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + d);
    const dateStr = slotDate.toISOString().split('T')[0];

    const hours = [
      { start: '09:00:00', end: '10:00:00', cap: 120 },
      { start: '10:00:00', end: '11:00:00', cap: 120 },
      { start: '11:00:00', end: '12:00:00', cap: 120 },
      { start: '12:00:00', end: '13:00:00', cap: 120 },
      { start: '14:00:00', end: '15:00:00', cap: 120 },
      { start: '15:00:00', end: '16:00:00', cap: 120 },
      { start: '16:00:00', end: '17:00:00', cap: 120 },
      { start: '17:00:00', end: '18:00:00', cap: 120 },
      { start: '18:00:00', end: '19:00:00', cap: 120 },
      { start: '19:00:00', end: '20:00:00', cap: 120 },
      { start: '20:00:00', end: '21:00:00', cap: 120 }
    ];

    hours.forEach((h, index) => {
      slots.push({
        id: `slot-${dateStr}-${index}`,
        slot_date: dateStr,
        start_time: h.start,
        end_time: h.end,
        total_capacity: h.cap,
        booked_capacity: 0,
        is_blocked: false,
        created_at: new Date().toISOString()
      });
    });
  }

  return slots;
};

export const generateInitialBookings = (_slots: Slot[]): Booking[] => {
  return [];
};
