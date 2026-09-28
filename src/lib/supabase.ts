import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80';

/**
 * Upload product image to Supabase Storage bucket 'products'
 * If storage upload fails, throws a helpful error and does NOT store huge base64 data URLs.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please check your connection or choose a preset photo.');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (PNG, JPG, WebP).');
  }

  // File size guard (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image file is too large (max 5MB). Please upload a smaller photo.');
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${Date.now()}_${cleanFileName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      throw new Error(`Cloud storage upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      return data.publicUrl;
    }

    throw new Error('Could not retrieve public URL for uploaded image.');
  } catch (err: any) {
    console.warn('Supabase storage exception:', err);
    throw new Error(err?.message || 'Storage upload failed. Please try again.');
  }
}
