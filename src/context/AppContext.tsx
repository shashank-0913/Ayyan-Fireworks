import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Slot, Booking, StaffUser, BookingRpcResponse, BookingStatus } from '../types';
import { INITIAL_PRODUCTS, generateInitialSlots } from '../lib/initialData';
import { supabase, isSupabaseConfigured, DEFAULT_PRODUCT_IMAGE } from '../lib/supabase';
import { isAuthorizedAdminEmail, ADMIN_EMAIL, generateUUID, formatTime, formatDateReadable, validateSlotTiming } from '../lib/utils';
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
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
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
  PRODUCTS: 'ayyan_products_clean_v8_cdn',
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
const sanitizeProductImage = (url?: string): string => {
  if (!url || url.startsWith('data:')) {
    return DEFAULT_PRODUCT_IMAGE;
  }
  return url;
};

const sanitizeProductsForStorage = (prods: Product[]): Product[] => {
  return prods.map(p => ({
    ...p,
    image_url: sanitizeProductImage(p.image_url)
  }));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = safeGetItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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
          .order('id', { ascending: false });

        if (!prodErr && Array.isArray(dbProducts)) {
          const mapped: Product[] = dbProducts.map(p => ({
            id: String(p.id),
            code: p.code || undefined,
            name: p.name || 'Firework SKU',
            category: p.category || 'Sparklers',
            price: Number(p.price) || 0,
            piece_count: p.piece_count || '1 Box',
            description: p.description || '',
            safety_instructions: p.safety_instructions || 'Keep 10m clearance. Light with agarbatti.',
            safety_tags: p.safety_tags || ['Bunny Certified'],
            sound_level: p.sound_level || 'Medium',
            video_url: p.video_url || '',
            image_url: sanitizeProductImage(p.image_url || p.image || p.imageUrl),
            is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
            created_at: p.created_at || new Date().toISOString()
          }));

          setProducts(mapped);
          safeSetItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitizeProductsForStorage(mapped)));
        } else if (prodErr) {
          console.error('Supabase fetch products error on initial load:', prodErr.message);
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
    const sanitizedImage = sanitizeProductImage(productData.image_url);
    // Insert payload strictly omitting is_active to match database columns
    const dbPayload = {
      name: productData.name.trim(),
      category: productData.category,
      price: Number(productData.price) || 0,
      piece_count: productData.piece_count || '1 Box',
      description: productData.description || '',
      safety_instructions: productData.safety_instructions || 'Keep 10m clearance. Light with agarbatti.',
      safety_tags: productData.safety_tags || ['Bunny Certified'],
      sound_level: productData.sound_level || 'Medium',
      video_url: productData.video_url || '',
      image_url: sanitizedImage
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([dbPayload])
        .select()
        .single();

      if (error) {
        console.error('Supabase product insert error:', error);
        alert('Error adding product: ' + error.message);
        throw new Error(error.message);
      }

      if (data) {
        const createdFromDb: Product = {
          ...data,
          id: String(data.id),
          price: Number(data.price) || 0,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
          created_at: data.created_at || new Date().toISOString()
        };
        setProducts(prev => [createdFromDb, ...prev.filter(p => p.id !== createdFromDb.id)]);
        return createdFromDb;
      }
    }

    const localNewProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      image_url: sanitizedImage,
      created_at: new Date().toISOString()
    };
    setProducts(prev => [localNewProduct, ...prev]);
    return localNewProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    const sanitizedUpdates: any = { ...updates };
    if (sanitizedUpdates.image_url !== undefined) {
      sanitizedUpdates.image_url = sanitizeProductImage(sanitizedUpdates.image_url);
    }
    if (sanitizedUpdates.price !== undefined) {
      sanitizedUpdates.price = Number(sanitizedUpdates.price);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase product update error:', error);
        alert('Error updating product: ' + error.message);
        throw new Error(error.message);
      }

      if (data) {
        const updatedDbProd: Product = {
          ...data,
          id: String(data.id),
          price: Number(data.price) || 0,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true
        };
        setProducts(prev => prev.map(p => p.id === id ? updatedDbProd : p));
        return updatedDbProd;
      }
    }

    let updatedProduct: Product | null = null;
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const item: Product = { ...p, ...sanitizedUpdates };
        updatedProduct = item;
        return item;
      }
      return p;
    }));

    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase product delete error:', error);
        alert('Error deleting product: ' + error.message);
        throw new Error(error.message);
      }
    }

    // Await the database response before removing it from UI state
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const refreshProducts = useCallback(async (): Promise<Product[]> => {
    if (!isSupabaseConfigured || !supabase) return products;
    try {
      setIsLoading(true);
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (prodErr) {
        console.error('Supabase fetch products error:', prodErr.message);
        return products;
      }

      if (Array.isArray(dbProducts)) {
        const mapped: Product[] = dbProducts.map(p => ({
          id: String(p.id),
          code: p.code || undefined,
          name: p.name || 'Firework SKU',
          category: p.category || 'Sparklers',
          price: Number(p.price) || 0,
          piece_count: p.piece_count || '1 Box',
          description: p.description || '',
          safety_instructions: p.safety_instructions || 'Keep 10m clearance. Light with agarbatti.',
          safety_tags: p.safety_tags || ['Bunny Certified'],
          sound_level: p.sound_level || 'Medium',
          video_url: p.video_url || '',
          image_url: sanitizeProductImage(p.image_url || p.image || p.imageUrl),
          is_active: p.is_active !== undefined ? Boolean(p.is_active) : true,
          created_at: p.created_at || new Date().toISOString()
        }));

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

  const toggleProductActive = async (id: string): Promise<void> => {
    const product = products.find(p => p.id === id);
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
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, is_blocked: !s.is_blocked };
      }
      return s;
    }));
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
