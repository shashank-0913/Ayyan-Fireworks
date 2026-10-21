/**
 * Feature Flags Configuration
 * 
 * Controls visibility of feature triggers across the user interface.
 * Set SHOW_SLOT_BOOKING_UI to true to reveal all "Book VIP Slot" buttons,
 * banners, navigation links, and visiting pass visual triggers.
 * 
 * When set to false, all visual triggers are hidden while preserving
 * 100% of the underlying slot booking logic, Supabase hooks, types,
 * and modal handlers for instant reactivation.
 */
export const SHOW_SLOT_BOOKING_UI = false;
