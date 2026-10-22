import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Slot, Booking, StaffUser, BookingRpcResponse, BookingStatus } from '../types';
import { INITIAL_PRODUCTS, generateInitialSlots, getCategoryFallbackImage, getProductImageUrl } from '../lib/initialData';
import { PRODUCTS_LIST } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isAuthorizedAdminEmail, ADMIN_EMAIL, generateUUID, formatTime, formatDateReadable, validateSlotTiming, getSlotStartDateTime, normalizeId, isProductMatch } from '../lib/utils';
import { extractCleanQrPayload } from '../lib/cameraUtils';

export interface GateScanResult {
  status: 'confirmed' | 'completed' | 'early_arrival' | 'expired' | 'invalid';
  booking?: Booking;
  message: string;
  verified_at?: string;
  slot_time?: string;
  slot_date?: string;
}

interface AppContextType {
  products: Product[];
  slots: Slot[];
  bookings: Booking[];
  currentUser: StaffUser | null;
  isEmergencyBlocked: boolean;
  isLoading: boolean;
  
  // Booking API
  bookSlot: (slotId: string, name: string, phone: string, visitors: number, notes?: string) => Promise<BookingRpcResponse>;
  getBookingByCode: (code: string) => Booking | undefined;
  verifyGateTicket: (tokenOrCode: string) => Promise<GateScanResult>;
  
  // Products Management
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  updateProduct: (id: string | number, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string | number) => Promise<void>;
  toggleProductActive: (id: string | number) => Promise<void>;
  refreshProducts: () => Promise<Product[]>;
  
  // Slots & Capacity Management
  updateSlotCapacity: (slotId: string, totalCapacity: number) => Promise<void>;
  toggleSlotBlock: (slotId: string) => Promise<void>;
  batchGenerateSlots: (startDate: string, endDate: string, startHour: number, endHour: number, capacity: number) => Promise<number>;
  
  // Bookings & Manifest Management
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  toggleEmergencyBlock: () => Promise<void>;
  
  // Staff Auth
  staffLogin: (email: string, role?: StaffUser['role'], password?: string) => Promise<boolean>;
  staffLogout: () => void;
  
  // System Reset
  resetToDefaultSeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'ayyan_products_catalog',
  SLOTS: 'ayyan_slots_clean_v8_cdn',
  BOOKINGS: 'ayyan_bookings_clean_v8_cdn',
  STAFF_USER: 'ayyan_staff_user_clean_v8_cdn',
  EMERGENCY_BLOCK: 'ayyan_emergency_block_clean_v8_cdn',
};

// Safe localStorage wrappers to guarantee no QuotaExceededError crashes
export const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`[Storage] Failed to read key "${key}":`, e);
    return null;
  }
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[Storage] Failed to write key "${key}":`, e);
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`[Storage] Failed to remove key "${key}":`, e);
  }
};

/**
 * Sanitizes product objects so that no raw Base64 data strings enter localStorage
 */
const sanitizeProductImage = (url?: string, code?: string, category?: string): string => {
  if (!url || url.startsWith('data:') || url.includes('placeholder') || url.includes('Ganesh-Crackers')) {
    if (code) return getProductImageUrl(code);
    return getCategoryFallbackImage(category);
  }
  return url;
};

const sanitizeProductsForStorage = (prods: Product[]): Product[] => {
  return prods.map(p => {
    const rawNum = String(p.id || p.code || p.item_code || '').replace(/\D/g, '');
    const num = rawNum ? parseInt(rawNum, 10) : undefined;
    const codeStr = num ? String(num).padStart(3, '0') : (p.item_code || '001');
    const normalizedId = p.id && !p.id.startsWith('ayyan-') ? p.id : `item_${codeStr}`;
    const codeVal = typeof p.code === 'number' ? p.code : (num !== undefined ? num : (p.code || codeStr));
    return {
      ...p,
      id: normalizedId,
      code: codeVal,
      item_code: p.item_code || codeStr,
      image_url: sanitizeProductImage(p.image_url, p.item_code || (p.code !== undefined ? String(p.code) : undefined), p.category)
    };
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    // 1. Check primary persistent key
    let saved = safeGetItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    // 2. Migration fallback from previous key
    if (!saved) {
      saved = safeGetItem('ayyan_products_141_official_2026');
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name) {
          return sanitizeProductsForStorage(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [slots, setSlots] = useState<Slot[]>(() => {
    const saved = safeGetItem(LOCAL_STORAGE_KEYS.SLOTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPre8AmSlots = parsed.some((s: any) => s.start_time < '08:00:00');
          if (hasPre8AmSlots) {
            const filtered = parsed.filter((s: any) => s.start_time >= '08:00:00');
            if (filtered.length > 0) return filtered;
            return generateInitialSlots();
          }
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved slots:', e);
      }
    }
    return generateInitialSlots();
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = safeGetItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved bookings:', e);
      }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(() => {
    const saved = safeGetItem(LOCAL_STORAGE_KEYS.STAFF_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && isAuthorizedAdminEmail(parsed.email)) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved user:', e);
      }
    }
    return null;
  });

  const [isEmergencyBlocked, setIsEmergencyBlocked] = useState<boolean>(() => {
    const saved = safeGetItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage with sanitization & error guarding
  useEffect(() => {
    try {
      const sanitized = sanitizeProductsForStorage(products);
      safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitized));
    } catch (err) {
      console.warn('Could not save products to localStorage:', err);
    }
  }, [products]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser && isAuthorizedAdminEmail(currentUser.email)) {
      safeSetItem(LOCAL_STORAGE_KEYS.STAFF_USER, JSON.stringify(currentUser));
    } else {
      safeRemoveItem(LOCAL_STORAGE_KEYS.STAFF_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK, JSON.stringify(isEmergencyBlocked));
  }, [isEmergencyBlocked]);

  // Load live data and sync Auth from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    // Check active Supabase session
    client.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (isAuthorizedAdminEmail(user.email)) {
          setCurrentUser({
            id: user.id,
            email: user.email!,
            name: 'Prasad Kolla (Admin)',
            role: 'admin'
          });
        } else {
          client.auth.signOut();
          setCurrentUser(null);
        }
      }
    }).catch(err => {
      console.warn('Supabase auth getUser check error:', err);
    });

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (isAuthorizedAdminEmail(session.user.email)) {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email!,
            name: 'Prasad Kolla (Admin)',
            role: 'admin'
          });
        } else {
          client.auth.signOut();
          setCurrentUser(null);
        }
      }
    });

    const fetchSupabaseData = async () => {
      try {
        setIsLoading(true);
        const { data: dbProducts, error: prodErr } = await client
          .from('products')
          .select('*')
          .order('id', { ascending: true });

        if (!prodErr && Array.isArray(dbProducts) && dbProducts.length > 0) {
          const mapped: Product[] = dbProducts.map(p => {
            const rawNumeric = String(p.id).replace(/\D/g, '');
            const codeNum = rawNumeric ? rawNumeric.padStart(3, '0') : '001';
            const codeInt = parseInt(rawNumeric, 10) || 1;
            const official = PRODUCTS_LIST.find(item => item.code === codeInt);

            // Database values ALWAYS take precedence over static defaults
            const productName = (p.name && p.name.trim()) ? p.name.trim() : (official?.name || 'Firework SKU');
            const productCategory = (p.category && p.category.trim()) ? p.category.trim() : (official?.category || 'Sparklers');
            const productPrice = (p.price !== undefined && p.price !== null) ? Number(p.price) : (official?.price || 0);
            const productMrp = (p.discount_price !== undefined && p.discount_price !== null) 
              ? Number(p.discount_price) 
              : (official?.mrp || undefined);
            const productPacking = p.piece_count || official?.packing || '1 Box';

            return {
              id: `item_${codeNum}`,
              item_code: codeNum,
              code: codeInt,
              name: productName,
              category: productCategory,
              price: productPrice,
              mrp: productMrp,
              original_price: productMrp,
              packing: productPacking,
              pieces_per_box: productPacking,
              piece_count: productPacking,
              video_url: p.video_url || '',
              image: p.image_url || official?.image || getProductImageUrl(codeNum),
              image_url: p.image_url || official?.image || getProductImageUrl(codeNum),
              sound_level: p.sound_level || 'Low',
              safety_instructions: p.safety_instructions || 'Keep safe distance. Light with agarbatti on an open clear hard surface.',
              is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
              inStock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
              created_at: p.created_at || new Date().toISOString()
            };
          });

          setProducts(mapped);
          safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(mapped)));
        } else if (prodErr) {
          console.warn('Supabase fetch products error on initial load (preserving persisted catalog):', prodErr.message);
        }

        // Query bookings directly from Supabase 'bookings' table
        const { data: dbBookings, error: bookErr } = await client
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bookErr && dbBookings !== null && Array.isArray(dbBookings)) {
          setBookings(dbBookings as Booking[]);
          safeSetItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(dbBookings));

          // Calculate slot occupancy directly from the live bookings table
          setSlots(prevSlots => prevSlots.map(slot => {
            const activeBookings = dbBookings.filter(b => 
              (b.slot_id === slot.id || (b.slot_date === slot.slot_date && b.slot_time?.includes(slot.start_time.substring(0, 2)))) &&
              b.status !== 'cancelled'
            );
            const count = activeBookings.reduce((sum, b) => sum + (b.visitor_count || 1), 0);
            return {
              ...slot,
              booked_capacity: count
            };
          }));
        }
      } catch (err) {
        console.warn('Could not sync with Supabase cloud, operating with local persistent store:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Atomic Slot Booking (Using the 'bookings' table directly)
  const bookSlot = useCallback(async (
    slotId: string,
    name: string,
    phone: string,
    visitors: number,
    notes?: string
  ): Promise<BookingRpcResponse> => {
    if (isEmergencyBlocked) {
      return {
        success: false,
        error: 'Showroom visiting slots are temporarily on hold due to maximum safety threshold.'
      };
    }

    if (!name.trim() || !phone.trim()) {
      return { success: false, error: 'Customer Name and 10-digit Phone Number are mandatory.' };
    }

    if (visitors < 1) {
      return { success: false, error: 'Visitor count must be at least 1 person.' };
    }

    const currentSlot = slots.find(s => s.id === slotId);
    if (!currentSlot) {
      return { success: false, error: 'The requested visiting slot was not found.' };
    }

    const slotDateTime = getSlotStartDateTime(currentSlot.slot_date, currentSlot.start_time);
    const requestedDateTime = slotDateTime ? slotDateTime.getTime() : 0;
    if (!requestedDateTime || requestedDateTime <= Date.now()) {
      return {
        success: false,
        error: 'This time slot has passed and cannot be booked.'
      };
    }

    if (currentSlot.is_blocked) {
      return { success: false, error: 'This time slot is closed for safety maintenance.' };
    }

    const available = currentSlot.total_capacity - currentSlot.booked_capacity;
    if (available < visitors) {
      return {
        success: false,
        error: `Only ${available} slot${available === 1 ? '' : 's'} remaining for this window. Cannot accommodate ${visitors} visitors.`
      };
    }

    let newBookingId = generateUUID();
    const bookingCode = `AYN-${Math.floor(100000 + Math.random() * 900000)}`;
    const slotTimeFormatted = `${formatTime(currentSlot.start_time)} – ${formatTime(currentSlot.end_time)}`;
    const slotDate = currentSlot.slot_date;

    // Insert directly into Supabase 'bookings' table
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: insertErr } = await supabase
          .from('bookings')
          .insert([{
            customer_name: name.trim(),
            phone: phone.trim(),
            customer_phone: phone.trim(),
            slot_date: slotDate,
            slot_time: slotTimeFormatted,
            status: 'confirmed'
          }])
          .select()
          .single();

        if (insertErr) {
          console.error('Supabase booking error:', insertErr);
        } else if (data?.id) {
          newBookingId = data.id;
        }
      } catch (e) {
        console.warn('Supabase direct booking insert exception:', e);
      }
    }

    const updatedSlot = {
      ...currentSlot,
      booked_capacity: currentSlot.booked_capacity + visitors
    };

    const newBooking: Booking = {
      id: newBookingId,
      booking_code: bookingCode,
      ticket_code: bookingCode,
      qr_token: newBookingId,
      slot_id: slotId,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      phone: phone.trim(),
      slot_date: slotDate,
      slot_time: slotTimeFormatted,
      total_amount: 0,
      visitor_count: visitors,
      status: 'confirmed',
      verified_at: null,
      notes: notes?.trim(),
      created_at: new Date().toISOString(),
      slot: updatedSlot
    };

    // Save confirmed booking details to localStorage for page-refresh persistence
    try {
      const activePassPayload = {
        booking: newBooking,
        slot: updatedSlot
      };
      safeSetItem('ayyan_active_visiting_pass', JSON.stringify(activePassPayload));
      safeSetItem('ayyan_confirmed_booking_id', newBookingId);
      
      const existingRaw = safeGetItem('ayyan_my_bookings');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const mergedList = [newBooking, ...existingList.filter((b: any) => b.id !== newBookingId)];
      safeSetItem('ayyan_my_bookings', JSON.stringify(mergedList));
    } catch (lsErr) {
      console.warn('LocalStorage save notice:', lsErr);
    }

    // Atomic state update
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return updatedSlot;
      }
      return s;
    }));

    setBookings(prev => [newBooking, ...prev]);

    return {
      success: true,
      booking_id: newBookingId,
      booking_code: bookingCode,
      qr_token: newBookingId,
      slot_date: slotDate,
      slot_time: slotTimeFormatted,
      start_time: currentSlot.start_time,
      end_time: currentSlot.end_time,
      total_amount: 0,
      customer_name: name.trim(),
      visitor_count: visitors
    };
  }, [slots, bookings, isEmergencyBlocked]);

  const getBookingByCode = useCallback((code: string) => {
    return bookings.find(b => b.booking_code.toUpperCase() === code.trim().toUpperCase());
  }, [bookings]);

  // Gate Scanner Verification Engine
  const verifyGateTicket = useCallback(async (tokenOrCode: string): Promise<GateScanResult> => {
    // Console Logging as required for developer diagnosis
    console.log("Raw Scanned Payload:", tokenOrCode);

    const cleanedPayload = extractCleanQrPayload(tokenOrCode);
    const cleanedId = (cleanedPayload || tokenOrCode || '').trim();
    if (!cleanedId) {
      return { status: 'invalid', message: 'Invalid or Empty Ticket Payload!' };
    }

    const upperPayload = cleanedId.toUpperCase();
    let matchedBooking: Booking | null = null;

    // a. Query Supabase: Primary key 'id' and booking code/ticket_code column
    if (isSupabaseConfigured && supabase) {
      try {
        // Required Supabase check against both primary key and ticket_code column
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .or(`id.eq.${cleanedId},ticket_code.eq.${cleanedId}`)
          .maybeSingle();

        console.log("Supabase Verification Result:", { data, error });

        if (!error && data) {
          matchedBooking = data as Booking;
        }

        // Additional fallback query across booking_code and qr_token if primary query returned null
        if (!matchedBooking) {
          const { data: altData, error: altError } = await supabase
            .from("bookings")
            .select("*")
            .or(`id.eq.${cleanedId},booking_code.eq.${upperPayload},qr_token.eq.${cleanedId}`)
            .maybeSingle();

          if (!altError && altData) {
            matchedBooking = altData as Booking;
            console.log("Supabase Verification Result (Alt Columns):", { data: altData, error: altError });
          }
        }

        // Direct primary key ID lookup fallback
        if (!matchedBooking) {
          const { data: idData } = await supabase
            .from("bookings")
            .select("*")
            .eq("id", cleanedId)
            .maybeSingle();

          if (idData) {
            matchedBooking = idData as Booking;
          }
        }

        // Direct booking_code lookup fallback
        if (!matchedBooking) {
          const { data: codeData } = await supabase
            .from("bookings")
            .select("*")
            .eq("booking_code", upperPayload)
            .maybeSingle();

          if (codeData) {
            matchedBooking = codeData as Booking;
          }
        }
      } catch (err) {
        console.warn("Supabase verifyGateTicket lookup error:", err);
      }
    }

    // Local state fallback check
    if (!matchedBooking) {
      matchedBooking = bookings.find(
        b => b.id?.trim().toLowerCase() === cleanedId.toLowerCase() ||
             b.qr_token?.trim().toLowerCase() === cleanedId.toLowerCase() ||
             b.booking_code?.trim().toUpperCase() === upperPayload ||
             (b as any).ticket_code?.trim().toUpperCase() === upperPayload ||
             (b as any).ticket_code?.trim().toLowerCase() === cleanedId.toLowerCase()
      ) || null;
    }

    // b. If not found: Display clear red warning
    if (!matchedBooking) {
      return {
        status: 'invalid',
        message: 'Invalid or Fake Ticket! No matching booking record found.'
      };
    }

    // c. Status & Time Validation: Support both `status` and `booking_status`
    const rawStatus = String(
      matchedBooking.status || 
      (matchedBooking as any).booking_status || 
      'confirmed'
    ).toLowerCase();

    // Prevent Re-Scanning: If found AND already used/scanned:
    const isAlreadyScanned = 
      rawStatus === 'completed' ||
      rawStatus === 'checked_in' ||
      matchedBooking.is_scanned === true;

    if (isAlreadyScanned) {
      const scannedTime = matchedBooking.verified_at || matchedBooking.scanned_at;
      const verifiedAtDate = scannedTime
        ? `${formatDateReadable(scannedTime.split('T')[0])} at ${new Date(scannedTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
        : 'earlier today';

      return {
        status: 'completed',
        booking: matchedBooking,
        verified_at: scannedTime || undefined,
        slot_time: matchedBooking.slot_time || (matchedBooking as any).time_slot,
        slot_date: matchedBooking.slot_date || (matchedBooking as any).visit_date,
        message: `Already Scanned at ${verifiedAtDate}`
      };
    }

    // Cancelled reservation rejection
    if (rawStatus === 'cancelled') {
      return {
        status: 'invalid',
        booking: matchedBooking,
        message: 'Booking Cancelled: This slot reservation is no longer active.'
      };
    }

    // d. Strict Time-Slot Validation:
    const slotDate = matchedBooking.slot_date || (matchedBooking as any).visit_date || (matchedBooking.slot?.slot_date) || '';
    const slotTime = matchedBooking.slot_time || (matchedBooking as any).time_slot || '';
    const startTime = matchedBooking.slot?.start_time || (matchedBooking as any).start_time;
    const endTime = matchedBooking.slot?.end_time || (matchedBooking as any).end_time;

    const timingCheck = validateSlotTiming(slotDate, slotTime, startTime, endTime, 15);

    if (!timingCheck.isValid) {
      if (timingCheck.reason === 'early_arrival') {
        return {
          status: 'early_arrival',
          booking: matchedBooking,
          slot_time: timingCheck.formattedTime || slotTime,
          slot_date: timingCheck.formattedDate || slotDate,
          message: timingCheck.message || `Too Early! This slot is valid only at ${timingCheck.formattedTime || slotTime}.`
        };
      }

      if (timingCheck.reason === 'expired') {
        return {
          status: 'expired',
          booking: matchedBooking,
          slot_time: timingCheck.formattedTime || slotTime,
          slot_date: timingCheck.formattedDate || slotDate,
          message: timingCheck.message || `Slot Expired! This pass was valid for ${timingCheck.formattedTime || slotTime}.`
        };
      }
    }

    // e. Access Granted: Within active window — Mark as scanned/completed
    const nowIso = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('bookings')
          .update({
            status: 'completed',
            booking_status: 'completed',
            verified_at: nowIso,
            is_scanned: true,
            scanned_at: nowIso
          })
          .eq('id', matchedBooking.id);
      } catch (err) {
        try {
          await supabase
            .from('bookings')
            .update({
              status: 'completed',
              verified_at: nowIso
            })
            .eq('id', matchedBooking.id);
        } catch (err2) {
          console.warn('Supabase status update error:', err2);
        }
      }
    }

    const completedBooking: Booking = {
      ...matchedBooking,
      status: 'completed',
      verified_at: nowIso,
      is_scanned: true,
      scanned_at: nowIso
    };

    setBookings(prev => prev.map(b => b.id === matchedBooking!.id ? completedBooking : b));

    return {
      status: 'confirmed',
      booking: completedBooking,
      verified_at: nowIso,
      slot_time: timingCheck.formattedTime || slotTime,
      slot_date: timingCheck.formattedDate || slotDate,
      message: 'Access Granted — Admission Verified'
    };
  }, [bookings]);

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const sanitizedImage = sanitizeProductImage(productData.image_url || productData.image);
    const packingVal = productData.packing || productData.piece_count || (productData as any).pieces_per_box || '1 Box';

    // Strictly clean payload with only valid columns (no pieces_per_box)
    const dbPayload: Record<string, any> = {
      name: productData.name.trim(),
      category: productData.category.trim(),
      price: Number(productData.price) || 0,
      discount_price: productData.mrp ? Number(productData.mrp) : (productData.original_price ? Number(productData.original_price) : null),
      piece_count: packingVal,
      packing: packingVal,
      description: productData.description || '',
      safety_instructions: productData.safety_instructions || 'Keep safe clearance. Light with agarbatti on an open clear hard surface.',
      sound_level: productData.sound_level || 'Medium',
      video_url: productData.video_url || '',
      image_url: sanitizedImage,
      is_active: productData.is_active !== undefined ? Boolean(productData.is_active) : true,
      in_stock: true
    };

    if (isSupabaseConfigured && supabase) {
      let { data, error } = await supabase
        .from('products')
        .insert([dbPayload])
        .select()
        .single();

      // Guard against any schema cache column mismatch
      if (error && error.message && error.message.includes("Could not find the '") && error.message.includes("' column of 'products'")) {
        const colMatch = error.message.match(/Could not find the '([^']+)' column/);
        if (colMatch && colMatch[1]) {
          const badCol = colMatch[1];
          console.warn(`[Supabase] Column "${badCol}" not in table schema, retrying insert without it.`);
          delete dbPayload[badCol];
          const retry = await supabase
            .from('products')
            .insert([dbPayload])
            .select()
            .single();
          data = retry.data;
          error = retry.error;
        }
      }

      if (error) {
        console.error('Supabase product insert error:', error);
        throw new Error(error.message || 'Remote database insert failed');
      }

      if (data) {
        const codeNum = String(data.id).padStart(3, '0');
        const createdFromDb: Product = {
          ...data,
          id: `item_${codeNum}`,
          item_code: codeNum,
          code: Number(data.id),
          name: data.name,
          category: data.category,
          price: Number(data.price) || 0,
          mrp: data.discount_price ? Number(data.discount_price) : undefined,
          original_price: data.discount_price ? Number(data.discount_price) : undefined,
          packing: data.packing || data.piece_count || '1 Box',
          piece_count: data.piece_count || data.packing || '1 Box',
          pieces_per_box: data.piece_count || data.packing || '1 Box',
          image_url: sanitizedImage,
          image: sanitizedImage,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
          created_at: data.created_at || new Date().toISOString()
        };
        setProducts(prev => {
          const next = [createdFromDb, ...prev.filter(p => p.id !== createdFromDb.id)];
          safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(next)));
          return next;
        });
        return createdFromDb;
      }
    }

    const localCode = Date.now();
    const localNewProduct: Product = {
      ...productData,
      id: `item_${String(localCode).slice(-3)}`,
      item_code: String(localCode).slice(-3),
      code: localCode,
      price: Number(productData.price) || 0,
      mrp: productData.mrp ? Number(productData.mrp) : undefined,
      packing: packingVal,
      piece_count: packingVal,
      pieces_per_box: packingVal,
      image_url: sanitizedImage,
      image: sanitizedImage,
      created_at: new Date().toISOString()
    };
    setProducts(prev => {
      const next = [localNewProduct, ...prev];
      safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(next)));
      return next;
    });
    return localNewProduct;
  };

  const updateProduct = async (id: string | number, updates: Partial<Product>): Promise<Product> => {
    // 1. Resolve numeric ID for Supabase bigint/integer column
    const norm = normalizeId(id);
    const numericId = typeof norm === 'number' && !isNaN(norm) ? norm : (typeof updates.code === 'number' ? updates.code : null);

    // 2. Prepare database payload strictly containing existing columns on the remote 'products' table
    // Guard against pieces_per_box - do NOT add pieces_per_box to the remote dbPayload!
    const dbPayload: Record<string, any> = {};
    if (updates.name !== undefined) {
      dbPayload.name = updates.name.trim();
    }
    if (updates.category !== undefined) {
      dbPayload.category = updates.category.trim();
    }
    if (updates.price !== undefined) {
      dbPayload.price = Number(updates.price) || 0;
    }
    if (updates.mrp !== undefined) {
      dbPayload.discount_price = updates.mrp !== null && !isNaN(Number(updates.mrp)) ? Number(updates.mrp) : null;
    } else if (updates.original_price !== undefined) {
      dbPayload.discount_price = updates.original_price !== null && !isNaN(Number(updates.original_price)) ? Number(updates.original_price) : null;
    }
    
    // Safely map packing without sending unverified pieces_per_box
    const packingVal = updates.packing || updates.piece_count || (updates as any).pieces_per_box;
    if (packingVal !== undefined) {
      dbPayload.piece_count = packingVal;
      dbPayload.packing = packingVal;
    }

    if (updates.description !== undefined) {
      dbPayload.description = updates.description;
    }
    if (updates.safety_instructions !== undefined) {
      dbPayload.safety_instructions = updates.safety_instructions;
    }
    if (updates.video_url !== undefined) {
      dbPayload.video_url = updates.video_url;
    }
    if (updates.sound_level !== undefined) {
      dbPayload.sound_level = updates.sound_level;
    }
    if (updates.image_url !== undefined || updates.image !== undefined) {
      dbPayload.image_url = sanitizeProductImage(updates.image_url || updates.image);
    }
    if (updates.is_active !== undefined) {
      dbPayload.is_active = Boolean(updates.is_active);
    }
    if (updates.inStock !== undefined) {
      dbPayload.in_stock = Boolean(updates.inStock);
    }

    // 3. If Supabase is configured and we have a valid numeric ID, execute update directly
    if (isSupabaseConfigured && supabase && numericId !== null && !isNaN(numericId)) {
      let { error } = await supabase
        .from('products')
        .update(dbPayload)
        .eq('id', numericId);

      // Guard: if error mentions a missing column, strip it and retry once
      if (error && error.message && error.message.includes("Could not find the '") && error.message.includes("' column of 'products'")) {
        const colMatch = error.message.match(/Could not find the '([^']+)' column/);
        if (colMatch && colMatch[1]) {
          const badCol = colMatch[1];
          console.warn(`[Supabase] Column "${badCol}" not in table schema, retrying update without it.`);
          delete dbPayload[badCol];
          const retry = await supabase
            .from('products')
            .update(dbPayload)
            .eq('id', numericId);
          error = retry.error;
        }
      }

      if (error) {
        console.error('Supabase product update error:', error);
        throw new Error(error.message || 'Remote database update failed');
      }
    }

    // 4. Update local state and synchronize immediately with localStorage
    let updatedProduct: Product | null = null;
    setProducts((prev) => {
      const targetIndex = prev.findIndex(
        (p) =>
          p.id === id ||
          p.code === id ||
          normalizeId(p.id ?? p.code) === normalizeId(id) ||
          isProductMatch(p, id)
      );

      if (targetIndex !== -1) {
        const existing = prev[targetIndex];
        const merged: Product = {
          ...existing,
          ...updates,
          id: existing.id || `item_${String(existing.code || id).padStart(3, '0')}`,
          name: updates.name !== undefined ? updates.name.trim() : existing.name,
          category: updates.category !== undefined ? updates.category.trim() : existing.category,
          price: updates.price !== undefined ? Number(updates.price) : existing.price,
          mrp: updates.mrp !== undefined 
            ? (updates.mrp ? Number(updates.mrp) : undefined) 
            : (updates.original_price !== undefined ? (updates.original_price ? Number(updates.original_price) : undefined) : existing.mrp),
          original_price: updates.mrp !== undefined 
            ? (updates.mrp ? Number(updates.mrp) : undefined) 
            : (updates.original_price !== undefined ? (updates.original_price ? Number(updates.original_price) : undefined) : existing.original_price),
          packing: updates.packing || updates.piece_count || updates.pieces_per_box || existing.packing,
          piece_count: updates.piece_count || updates.packing || updates.pieces_per_box || existing.piece_count,
          pieces_per_box: updates.pieces_per_box || updates.piece_count || updates.packing || existing.pieces_per_box,
          image_url: updates.image_url ? sanitizeProductImage(updates.image_url) : existing.image_url,
          image: updates.image || updates.image_url || existing.image,
          is_active: updates.is_active !== undefined ? Boolean(updates.is_active) : existing.is_active
        };
        updatedProduct = merged;
        const next = [...prev];
        next[targetIndex] = merged;
        safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(next)));
        return next;
      }

      // Fallback: If not found in current state, search fallback catalogs to guarantee save
      const seed = PRODUCTS_LIST.find(p => isProductMatch(p, id)) || INITIAL_PRODUCTS.find(p => isProductMatch(p, id));
      const normVal = normalizeId(id);
      const codeNum = typeof normVal === 'number' && !isNaN(normVal) ? normVal : Date.now();
      const codeStr = String(codeNum).padStart(3, '0');
      const fallbackItem: Product = {
        id: `item_${codeStr}`,
        item_code: codeStr,
        code: codeNum,
        name: updates.name?.trim() || seed?.name || `Product ${id}`,
        category: updates.category?.trim() || seed?.category || 'Sparklers',
        price: updates.price !== undefined ? Number(updates.price) : (seed?.price || 0),
        mrp: updates.mrp !== undefined ? Number(updates.mrp) : seed?.mrp,
        original_price: updates.mrp !== undefined ? Number(updates.mrp) : ((seed as any)?.original_price || seed?.mrp),
        packing: updates.packing || seed?.packing || '1 Box',
        piece_count: updates.packing || seed?.packing || '1 Box',
        pieces_per_box: updates.packing || seed?.packing || '1 Box',
        image_url: updates.image_url ? sanitizeProductImage(updates.image_url) : (seed?.image || `/products/${codeNum}.jpg`),
        image: updates.image || updates.image_url || seed?.image || `/products/${codeNum}.jpg`,
        is_active: updates.is_active !== undefined ? Boolean(updates.is_active) : true,
        created_at: new Date().toISOString(),
        ...updates
      };

      updatedProduct = fallbackItem;
      const next = [fallbackItem, ...prev];
      safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(next)));
      return next;
    });

    if (!updatedProduct) {
      throw new Error(`Product ${id} not found in catalog`);
    }

    return updatedProduct;
  };

  const deleteProduct = async (id: string | number): Promise<void> => {
    const norm = normalizeId(id);
    const numericId = typeof norm === 'number' && !isNaN(norm) ? norm : null;

    if (isSupabaseConfigured && supabase && numericId !== null && !isNaN(numericId)) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', numericId);

      if (error) {
        console.error('Supabase product delete error:', error);
        throw new Error(error.message || 'Remote database delete failed');
      }
    }

    setProducts(prev => {
      const next = prev.filter(p => !isProductMatch(p, id));
      safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(next)));
      return next;
    });
  };

  const refreshProducts = useCallback(async (): Promise<Product[]> => {
    if (!isSupabaseConfigured || !supabase) return products;
    try {
      setIsLoading(true);
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (prodErr) {
        console.error('Supabase fetch products error:', prodErr.message);
        return products;
      }

      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        const mapped: Product[] = dbProducts.map(p => {
          const rawNumeric = String(p.id).replace(/\D/g, '');
          const codeNum = rawNumeric ? rawNumeric.padStart(3, '0') : '001';
          const codeInt = parseInt(rawNumeric, 10) || 1;
          const official = PRODUCTS_LIST.find(item => item.code === codeInt);

          // Database values ALWAYS take precedence over static defaults
          const productName = (p.name && p.name.trim()) ? p.name.trim() : (official?.name || 'Firework SKU');
          const productCategory = (p.category && p.category.trim()) ? p.category.trim() : (official?.category || 'Sparklers');
          const productPrice = (p.price !== undefined && p.price !== null) ? Number(p.price) : (official?.price || 0);
          const productMrp = (p.discount_price !== undefined && p.discount_price !== null) 
            ? Number(p.discount_price) 
            : (official?.mrp || undefined);
          const productPacking = p.piece_count || official?.packing || '1 Box';

          return {
            id: `item_${codeNum}`,
            item_code: codeNum,
            code: codeInt,
            name: productName,
            category: productCategory,
            price: productPrice,
            mrp: productMrp,
            original_price: productMrp,
            packing: productPacking,
            pieces_per_box: productPacking,
            piece_count: productPacking,
            video_url: p.video_url || '',
            image: p.image_url || official?.image || getProductImageUrl(codeNum),
            image_url: p.image_url || official?.image || getProductImageUrl(codeNum),
            sound_level: p.sound_level || 'Low',
            safety_instructions: p.safety_instructions || 'Keep safe distance. Light with agarbatti on an open clear hard surface.',
            is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
            inStock: p.in_stock !== undefined ? Boolean(p.in_stock) : true,
            created_at: p.created_at || new Date().toISOString()
          };
        });

        setProducts(mapped);
        safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(mapped)));
        return mapped;
      }
    } catch (err) {
      console.error('refreshProducts exception:', err);
    } finally {
      setIsLoading(false);
    }
    return products;
  }, [products]);

  const toggleProductActive = async (id: string | number): Promise<void> => {
    const product = products.find(p => isProductMatch(p, id));
    if (!product) return;
    await updateProduct(id, { is_active: !product.is_active });
  };

  // Slot Actions (Operates directly on slot state without nonexistent slots table)
  const updateSlotCapacity = async (slotId: string, totalCapacity: number): Promise<void> => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, total_capacity: Math.max(s.booked_capacity, totalCapacity) };
      }
      return s;
    }));
  };

  const toggleSlotBlock = async (slotId: string): Promise<void> => {
    let nextBlocked = false;
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        nextBlocked = !s.is_blocked;
        return { ...s, is_blocked: nextBlocked };
      }
      return s;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('slots').update({ is_blocked: nextBlocked }).eq('id', slotId);
      } catch (e) {
        console.warn('[AppContext] Supabase slot block update error:', e);
      }
    }
  };

  const batchGenerateSlots = async (
    startDate: string,
    endDate: string,
    startHour: number,
    endHour: number,
    capacity: number
  ): Promise<number> => {
    const newSlots: Slot[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      for (let h = startHour; h < endHour; h++) {
        const startStr = `${String(h).padStart(2, '0')}:00:00`;
        const endStr = `${String(h + 1).padStart(2, '0')}:00:00`;
        const slotId = `slot-${dateStr}-${String(h).padStart(2, '0')}00`;

        const exists = slots.some(s => s.slot_date === dateStr && s.start_time.startsWith(String(h).padStart(2, '0')));
        if (!exists) {
          newSlots.push({
            id: slotId,
            slot_date: dateStr,
            start_time: startStr,
            end_time: endStr,
            total_capacity: capacity,
            booked_capacity: 0,
            is_blocked: false,
            created_at: new Date().toISOString()
          });
        }
      }

      current.setDate(current.getDate() + 1);
    }

    if (newSlots.length > 0) {
      setSlots(prev => [...prev, ...newSlots]);
    }

    return newSlots.length;
  };

  // Manifest Actions
  const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<void> => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('bookings').update({ status }).eq('id', bookingId);
      } catch (e) {
        console.warn('Supabase booking update fallback:', e);
      }
    }
  };

  const toggleEmergencyBlock = async (): Promise<void> => {
    setIsEmergencyBlocked(prev => !prev);
  };

  // Staff & Admin Auth (Single Authorized Email Enforcement)
  const staffLogin = async (email: string, role: StaffUser['role'] = 'admin', password?: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Strict Single-Email Authorization Check
    if (!isAuthorizedAdminEmail(normalizedEmail)) {
      throw new Error('Access Denied: You are not authorized to access the Admin Portal.');
    }

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: password.trim()
        });
        if (error) {
          throw new Error(error.message || 'Supabase authentication failed');
        }
        if (data.user) {
          if (!isAuthorizedAdminEmail(data.user.email)) {
            await supabase.auth.signOut();
            throw new Error('Access Denied: You are not authorized to access the Admin Portal.');
          }
          const user: StaffUser = {
            id: data.user.id,
            email: data.user.email!,
            name: 'Prasad Kolla (Admin)',
            role: 'admin'
          };
          setCurrentUser(user);
          return true;
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Access Denied')) {
          throw err;
        }
        // If Supabase credentials failed, throw explicit message
        throw err;
      }
    }

    const staffName = normalizedEmail === ADMIN_EMAIL ? 'Prasad Kolla (Admin)' : 'Authorized Admin';
    const user: StaffUser = {
      id: `admin-${Date.now()}`,
      email: normalizedEmail,
      name: staffName,
      role: role || 'admin'
    };
    setCurrentUser(user);
    return true;
  };

  const staffLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut fallback:', e);
      }
    }
    setCurrentUser(null);
    safeRemoveItem(LOCAL_STORAGE_KEYS.STAFF_USER);
  };

  const resetToDefaultSeed = () => {
    const seedSlots = generateInitialSlots();
    setProducts(INITIAL_PRODUCTS);
    setSlots(seedSlots);
    setBookings([]);
    setIsEmergencyBlocked(false);
    safeRemoveItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    safeRemoveItem(LOCAL_STORAGE_KEYS.SLOTS);
    safeRemoveItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    safeRemoveItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        slots,
        bookings,
        currentUser,
        isEmergencyBlocked,
        isLoading,
        bookSlot,
        getBookingByCode,
        verifyGateTicket,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        refreshProducts,
        updateSlotCapacity,
        toggleSlotBlock,
        batchGenerateSlots,
        updateBookingStatus,
        toggleEmergencyBlock,
        staffLogin,
        staffLogout,
        resetToDefaultSeed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAyyanStore = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAyyanStore must be used within an AppProvider');
  }
  return context;
};
