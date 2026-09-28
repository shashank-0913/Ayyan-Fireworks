import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS } from '../src/lib/initialData';

if (!globalThis.WebSocket) {
  (globalThis as any).WebSocket = class WebSocket {};
}

// Load .env variables manually if exists
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    });
  }
} catch (e) {
  // ignore
}

// CLI argument parsing for service role key or admin credentials
const args = process.argv.slice(2);
let serviceKeyArg = '';
let emailArg = '';
let passwordArg = '';

for (const arg of args) {
  if (arg.startsWith('--key=')) serviceKeyArg = arg.split('=')[1];
  if (arg.startsWith('--service-key=')) serviceKeyArg = arg.split('=')[1];
  if (arg.startsWith('--email=')) emailArg = arg.split('=')[1];
  if (arg.startsWith('--password=')) passwordArg = arg.split('=')[1];
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://bdvrcpisjatvbbqffswp.supabase.co';
const SUPABASE_KEY = serviceKeyArg ||
                     process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.SUPABASE_SERVICE_KEY || 
                     process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.VITE_SUPABASE_ANON_KEY || 
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

async function syncImagesToDb() {
  console.log('================================================================');
  console.log('AYYAN FIREWORKS — SUPABASE PRODUCT IMAGES & MASTER SYNC');
  console.log('================================================================');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Key role used: ${SUPABASE_KEY.includes('service_role') ? 'SERVICE_ROLE' : 'CONFIGURED'}`);
  console.log(`Total Master Products to Sync: ${INITIAL_PRODUCTS.length}`);
  console.log('----------------------------------------------------------------');

  if (emailArg && passwordArg) {
    console.log(`Authenticating as staff user: ${emailArg}...`);
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: emailArg,
      password: passwordArg
    });
    if (authErr) {
      console.warn('⚠️ Supabase staff auth failed:', authErr.message);
    } else {
      console.log('✅ Staff authenticated successfully! User ID:', authData.user?.id);
    }
  }

  let updatedCount = 0;
  let insertedCount = 0;
  let matchByNameCount = 0;
  let matchByIdCount = 0;
  let errorCount = 0;

  // First fetch any existing rows in products table
  const { data: existingRows, error: fetchErr } = await supabase
    .from('products')
    .select('*');

  if (fetchErr) {
    console.warn('⚠️ Warning querying existing rows:', fetchErr.message);
  } else {
    console.log(`Current existing rows in remote 'products' table: ${existingRows?.length || 0}`);
  }

  const existingMapByName = new Map();
  const existingMapById = new Map();
  if (Array.isArray(existingRows)) {
    for (const row of existingRows) {
      if (row.name) existingMapByName.set(row.name.trim().toLowerCase(), row);
      if (row.id) existingMapById.set(String(row.id), row);
    }
  }

  for (let i = 0; i < INITIAL_PRODUCTS.length; i++) {
    const item = INITIAL_PRODUCTS[i];
    const targetImageUrl = item.image_url || item.imageUrl || item.image || '';

    // Check if row already exists in DB
    const existingByName = existingMapByName.get(item.name.trim().toLowerCase());
    const existingById = existingMapById.get(item.id);
    const existing = existingByName || existingById;

    if (existing) {
      // Update existing row
      let updateQuery = supabase
        .from('products')
        .update({
          image_url: targetImageUrl,
          price: item.price,
          category: item.category,
          description: item.description
        });

      if (existingByName) {
        updateQuery = updateQuery.eq('name', item.name);
        matchByNameCount++;
      } else {
        updateQuery = updateQuery.eq('id', existing.id);
        matchByIdCount++;
      }

      const { error: updateErr } = await updateQuery;
      if (updateErr) {
        console.error(`❌ Error updating ${item.name} (${item.code}):`, updateErr.message);
        errorCount++;
      } else {
        updatedCount++;
        if (updatedCount % 25 === 0 || updatedCount === 1) {
          console.log(`✅ [${updatedCount}/${INITIAL_PRODUCTS.length}] Updated: ${item.name} -> ${targetImageUrl}`);
        }
      }
    } else {
      // If product does not exist in DB, insert standard product record
      const payload: Record<string, any> = {
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        image_url: targetImageUrl
      };

      const { error: insertErr } = await supabase
        .from('products')
        .insert([payload]);

      if (insertErr) {
        // If RLS prevents anon insert or missing column, log politely
        if (i === 0) {
          console.warn(`Note on inserts: ${insertErr.message}`);
        }
        errorCount++;
      } else {
        insertedCount++;
        if (insertedCount % 25 === 0 || insertedCount === 1) {
          console.log(`✨ [${insertedCount}] Inserted: ${item.name} -> ${targetImageUrl}`);
        }
      }
    }
  }

  console.log('----------------------------------------------------------------');
  console.log('SYNC COMPLETE SUMMARY:');
  console.log(`• Master Inventory Items: ${INITIAL_PRODUCTS.length}`);
  console.log(`• Updated Existing Rows: ${updatedCount} (Name matches: ${matchByNameCount}, ID matches: ${matchByIdCount})`);
  console.log(`• Inserted New Rows: ${insertedCount}`);
  console.log(`• Encountered Issues/RLS Guards: ${errorCount}`);
  console.log('================================================================');
}

syncImagesToDb().catch(err => {
  console.error('Fatal sync script error:', err);
  process.exit(1);
});
