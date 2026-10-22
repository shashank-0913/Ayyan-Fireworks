import { createClient } from '@supabase/supabase-js';
import { INITIAL_PRODUCTS } from '../src/lib/initialData';

if (!globalThis.WebSocket) {
  (globalThis as any).WebSocket = class WebSocket {};
}

const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function syncAll141Products() {
  console.log('=== SYNCING 141 VERIFIED PRODUCTS TO SUPABASE ===');
  console.log(`Total items to sync: ${INITIAL_PRODUCTS.length}`);

  // 1. Delete items > 141
  const delRes = await supabase.from('products').delete().gt('id', 141);
  if (delRes.error) {
    console.error('Error deleting > 141:', delRes.error);
  } else {
    console.log('Cleaned up any items > 141');
  }

  // 2. Prepare payload for all 141 items
  const payload = INITIAL_PRODUCTS.map((p, idx) => {
    const numId = idx + 1;
    const codeNum = String(numId).padStart(3, '0');
    return {
      id: numId,
      name: p.name,
      category: p.category,
      price: p.price,
      discount_price: p.original_price || Math.round(p.price * 1.3),
      piece_count: p.packing || p.pieces_per_box || '1 Box',
      image_url: `/ayyan_images/products/${codeNum}.jpg`,
      in_stock: true,
      is_active: true,
      sound_level: p.sound_level || 'Low',
      safety_instructions: p.safety_instructions || 'Keep safe distance. Light with agarbatti on an open clear hard surface.'
    };
  });

  // Batch upsert in chunks of 20
  for (let i = 0; i < payload.length; i += 20) {
    const chunk = payload.slice(i, i + 20);
    const { error } = await supabase.from('products').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting chunk ${i} - ${i + chunk.length}:`, error);
    } else {
      console.log(`Successfully upserted items ${i + 1} to ${i + chunk.length}`);
    }
  }

  // 3. Verify total count and sample
  const { data, count, error } = await supabase
    .from('products')
    .select('id, name, category, price, piece_count', { count: 'exact' })
    .order('id', { ascending: true });

  console.log('Verification: Total products in Supabase:', count || data?.length, 'Error:', error);
  if (data && data.length > 0) {
    console.log('First item:', data[0]);
    console.log('Item 51:', data[50]);
    console.log('Last item:', data[data.length - 1]);
  }
}

syncAll141Products().catch(console.error);
