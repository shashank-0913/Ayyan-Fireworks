import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload product image to Supabase Storage bucket 'product-images'
 * Falls back to local base64 Data URL if Supabase storage is not configured or offline.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const filePath = `products/${Date.now()}_${cleanFileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError) {
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } else {
        console.warn('Supabase storage upload error, using local fallback:', uploadError.message);
      }
    } catch (err) {
      console.warn('Supabase storage exception, using local fallback:', err);
    }
  }

  // Fallback to base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
