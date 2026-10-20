import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SETTINGS_STORAGE_KEY = 'ayyan_vip_booking_enabled';
const SETTINGS_EVENT = 'ayyan-store-settings-changed';

export interface StoreSettings {
  vip_booking_enabled: boolean;
  isVipBookingEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  updateVipBookingEnabled: (enabled: boolean) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

/**
 * Custom hook to read and update store settings from Supabase table 'store_settings'.
 * Key: 'vip_booking_enabled' (defaults to false).
 * Gracefully falls back to localStorage if table is offline or not yet initialized in Supabase.
 */
export function useStoreSettings(): StoreSettings {
  // Initialize with false by default, or persisted preference from localStorage
  const [isVipBookingEnabled, setIsVipBookingEnabled] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (cached !== null) {
        return cached === 'true';
      }
    } catch {
      // LocalStorage unavailable
    }
    return false; // Strict default: false
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync state and notify all listeners on the page
  const applySettingLocally = useCallback((enabled: boolean) => {
    setIsVipBookingEnabled(enabled);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, String(enabled));
    } catch (e) {
      console.warn('[useStoreSettings] Failed to write localStorage:', e);
    }
    // Dispatch window event so all hook instances stay synchronized
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(SETTINGS_EVENT, { detail: { vip_booking_enabled: enabled } })
      );
    }
  }, []);

  // Fetch 'vip_booking_enabled' from Supabase
  const refreshSettings = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Try querying key-value structure: { key: 'vip_booking_enabled', value: boolean | json }
      const { data, error: fetchErr } = await supabase
        .from('store_settings')
        .select('*')
        .eq('key', 'vip_booking_enabled')
        .maybeSingle();

      if (fetchErr) {
        // If table doesn't exist yet (PGRST205 or similar PostgREST errors), fallback gracefully
        if (fetchErr.code === 'PGRST205' || fetchErr.message?.includes('does not exist')) {
          console.info('[useStoreSettings] store_settings table not created yet in Supabase, using local fallback.');
          setIsLoading(false);
          return;
        }
        throw fetchErr;
      }

      if (data) {
        let parsed = false;
        if (typeof data.value === 'boolean') {
          parsed = data.value;
        } else if (typeof data.value === 'string') {
          parsed = data.value.toLowerCase() === 'true';
        } else if (typeof data.value === 'object' && data.value !== null) {
          parsed = Boolean(data.value.enabled ?? data.value.vip_booking_enabled ?? false);
        } else if (typeof data.vip_booking_enabled === 'boolean') {
          parsed = data.vip_booking_enabled;
        }
        applySettingLocally(parsed);
      } else {
        // Row doesn't exist yet: check if table uses columnar format instead
        const { data: colData } = await supabase
          .from('store_settings')
          .select('vip_booking_enabled')
          .limit(1)
          .maybeSingle();

        if (colData && typeof colData.vip_booking_enabled === 'boolean') {
          applySettingLocally(colData.vip_booking_enabled);
        } else {
          // No record found: defaults strictly to false
          applySettingLocally(false);
        }
      }
    } catch (err: any) {
      console.warn('[useStoreSettings] Error reading store_settings:', err?.message || err);
      setError(err?.message || 'Failed to fetch store settings');
    } finally {
      setIsLoading(false);
    }
  }, [applySettingLocally]);

  // Update 'vip_booking_enabled' in Supabase
  const updateVipBookingEnabled = useCallback(
    async (enabled: boolean): Promise<boolean> => {
      // 1. Instantly update local state & broadcast for responsive UI
      applySettingLocally(enabled);

      if (!isSupabaseConfigured || !supabase) {
        return true;
      }

      try {
        setError(null);

        // 2. Try upserting key-value row { key: 'vip_booking_enabled', value: enabled }
        const { error: upsertErr } = await supabase
          .from('store_settings')
          .upsert(
            {
              key: 'vip_booking_enabled',
              value: enabled,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'key' }
          );

        if (upsertErr) {
          // If key column failed, try updating as column attribute
          if (upsertErr.code === 'PGRST204' || upsertErr.message?.includes('column')) {
            const { error: colErr } = await supabase
              .from('store_settings')
              .update({ vip_booking_enabled: enabled })
              .neq('id', '0');

            if (colErr) throw colErr;
          } else {
            throw upsertErr;
          }
        }

        return true;
      } catch (err: any) {
        console.error('[useStoreSettings] Failed to save setting to Supabase:', err);
        setError(err?.message || 'Failed to update store settings');
        return false;
      }
    },
    [applySettingLocally]
  );

  // Initial load on mount
  useEffect(() => {
    refreshSettings();

    // Listen for cross-component and cross-tab setting sync
    const handleLocalSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ vip_booking_enabled: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.vip_booking_enabled === 'boolean') {
        setIsVipBookingEnabled(customEvent.detail.vip_booking_enabled);
      }
    };

    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === SETTINGS_STORAGE_KEY && e.newValue !== null) {
        setIsVipBookingEnabled(e.newValue === 'true');
      }
    };

    window.addEventListener(SETTINGS_EVENT, handleLocalSync);
    window.addEventListener('storage', handleStorageSync);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleLocalSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, [refreshSettings]);

  return {
    vip_booking_enabled: isVipBookingEnabled,
    isVipBookingEnabled,
    isLoading,
    error,
    updateVipBookingEnabled,
    refreshSettings
  };
}

export default useStoreSettings;
