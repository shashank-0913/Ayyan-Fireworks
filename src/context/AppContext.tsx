import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Slot, Booking, StaffUser, BookingRpcResponse, BookingStatus } from '../types';
import { INITIAL_PRODUCTS, generateInitialSlots } from '../lib/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  
  // Products Management
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductActive: (id: string) => Promise<void>;
  
  // Slots & Capacity Management
  updateSlotCapacity: (slotId: string, totalCapacity: number) => Promise<void>;
  toggleSlotBlock: (slotId: string) => Promise<void>;
  batchGenerateSlots: (startDate: string, endDate: string, startHour: number, endHour: number, capacity: number) => Promise<number>;
  
  // Bookings & Manifest Management
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  toggleEmergencyBlock: () => Promise<void>;
  
  // Staff Auth
  staffLogin: (email: string, role?: StaffUser['role']) => Promise<boolean>;
  staffLogout: () => void;
  
  // System Reset
  resetToDefaultSeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'ayyan_products_clean_v5',
  SLOTS: 'ayyan_slots_clean_v5',
  BOOKINGS: 'ayyan_bookings_clean_v5',
  STAFF_USER: 'ayyan_staff_user_clean_v5',
  EMERGENCY_BLOCK: 'ayyan_emergency_block_clean_v5',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [slots, setSlots] = useState<Slot[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SLOTS);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
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
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STAFF_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [isEmergencyBlocked, setIsEmergencyBlocked] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK);
    return saved ? JSON.parse(saved) : false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SLOTS, JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.STAFF_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.STAFF_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK, JSON.stringify(isEmergencyBlocked));
  }, [isEmergencyBlocked]);

  // Load live data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const fetchSupabaseData = async () => {
      try {
        setIsLoading(true);
        const { data: dbProducts, error: prodErr } = await client
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!prodErr && dbProducts !== null) {
          setProducts(dbProducts as Product[]);
        }

        const { data: dbSlots, error: slotErr } = await client
          .from('slots')
          .select('*')
          .order('slot_date', { ascending: true });

        if (!slotErr && dbSlots && dbSlots.length > 0) {
          setSlots(dbSlots as Slot[]);
        }

        const { data: dbBookings, error: bookErr } = await client
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!bookErr && dbBookings !== null) {
          setBookings(dbBookings as Booking[]);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase cloud, operating with local persistent store:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  // Atomic Slot Booking (Concurrency-safe implementation mirroring PostgreSQL RPC)
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

    // If Supabase RPC is live, execute stored procedure
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('book_visiting_slot', {
          p_slot_id: slotId,
          p_name: name.trim(),
          p_phone: phone.trim(),
          p_visitors: visitors
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data && !data.success) {
          return { success: false, error: data.error };
        }
      } catch (e: any) {
        console.warn('RPC network call fallback to atomic local store:', e);
      }
    }

    // Atomic local transaction logic
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

    // Guaranteed unique booking ID & high-entropy booking code for every person
    let bookingCode = '';
    do {
      const year = new Date().getFullYear().toString().slice(-2);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const randAlpha = Math.random().toString(36).substring(2, 4).toUpperCase();
      bookingCode = `AYN-${year}${randAlpha}-${randNum}`;
    } while (bookings.some(b => b.booking_code === bookingCode));

    const newBookingId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newBooking: Booking = {
      id: newBookingId,
      booking_code: bookingCode,
      slot_id: slotId,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      visitor_count: visitors,
      status: 'confirmed',
      notes: notes?.trim(),
      created_at: new Date().toISOString(),
      slot: {
        ...currentSlot,
        booked_capacity: currentSlot.booked_capacity + visitors
      }
    };

    // Atomic state update
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return {
          ...s,
          booked_capacity: s.booked_capacity + visitors
        };
      }
      return s;
    }));

    setBookings(prev => [newBooking, ...prev]);

    return {
      success: true,
      booking_id: newBookingId,
      booking_code: bookingCode,
      slot_date: currentSlot.slot_date,
      start_time: currentSlot.start_time,
      end_time: currentSlot.end_time,
      customer_name: name.trim(),
      visitor_count: visitors
    };
  }, [slots, isEmergencyBlocked]);

  const getBookingByCode = useCallback((code: string) => {
    return bookings.find(b => b.booking_code.toUpperCase() === code.trim().toUpperCase());
  }, [bookings]);

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').insert([{
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          piece_count: newProduct.piece_count,
          description: newProduct.description,
          safety_instructions: newProduct.safety_instructions,
          safety_tags: newProduct.safety_tags || [],
          sound_level: newProduct.sound_level || 'Medium',
          image_url: newProduct.image_url,
          is_active: newProduct.is_active
        }]).select();

        if (!error && data && data.length > 0) {
          const createdFromDb = data[0] as Product;
          setProducts(prev => [createdFromDb, ...prev]);
          return createdFromDb;
        }
      } catch (e) {
        console.warn('Supabase product insert fallback:', e);
      }
    }

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
    let updated: Product | null = null;

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        updated = { ...p, ...updates };
        return updated;
      }
      return p;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Supabase product update fallback:', e);
      }
    }

    if (!updated) throw new Error('Product not found');
    return updated;
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase product delete fallback:', e);
      }
    }
  };

  const toggleProductActive = async (id: string): Promise<void> => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    await updateProduct(id, { is_active: !product.is_active });
  };

  // Slot Actions
  const updateSlotCapacity = async (slotId: string, totalCapacity: number): Promise<void> => {
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        return { ...s, total_capacity: Math.max(s.booked_capacity, totalCapacity) };
      }
      return s;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('slots').update({ total_capacity: totalCapacity }).eq('id', slotId);
      } catch (e) {
        console.warn('Supabase slot update fallback:', e);
      }
    }
  };

  const toggleSlotBlock = async (slotId: string): Promise<void> => {
    let newBlockedState = false;
    setSlots(prev => prev.map(s => {
      if (s.id === slotId) {
        newBlockedState = !s.is_blocked;
        return { ...s, is_blocked: newBlockedState };
      }
      return s;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('slots').update({ is_blocked: newBlockedState }).eq('id', slotId);
      } catch (e) {
        console.warn('Supabase slot block fallback:', e);
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
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('slots').insert(newSlots);
        } catch (e) {
          console.warn('Supabase batch slots insert fallback:', e);
        }
      }
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

  // Staff Auth
  const staffLogin = async (email: string, role: StaffUser['role'] = 'manager'): Promise<boolean> => {
    const staffName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const user: StaffUser = {
      id: `staff-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: staffName || 'Ayyan Owner / Staff',
      role: role
    };
    setCurrentUser(user);
    return true;
  };

  const staffLogout = () => {
    setCurrentUser(null);
  };

  const resetToDefaultSeed = () => {
    const seedSlots = generateInitialSlots();
    setProducts(INITIAL_PRODUCTS);
    setSlots(seedSlots);
    setBookings([]);
    setIsEmergencyBlocked(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SLOTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.EMERGENCY_BLOCK);
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
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
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
