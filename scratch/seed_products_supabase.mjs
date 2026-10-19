import fs from 'fs';

const SUPABASE_URL = 'https://bdvrcpisjatvbbqffswp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI';

// Parse initialProducts from src/lib/initialData.ts
const content = fs.readFileSync('src/lib/initialData.ts', 'utf8');
const regex = /\{\s*id:\s*['"]item_(\d+)['"],\s*item_code:\s*['"](\d+)['"],\s*code:\s*['"](\d+)['"],\s*name:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"],\s*price:\s*([\d.]+),\s*pieces_per_box:\s*['"]([^'"]+)['"]/g;

const products = [];
let match;
while ((match = regex.exec(content)) !== null) {
  const codeNum = parseInt(match[2], 10);
  products.push({
    id: codeNum,
    name: match[4],
    category: match[5],
    price: parseFloat(match[6]),
    piece_count: match[7],
    description: null,
    in_stock: true,
    is_active: true,
    safety_instructions: 'Keep 10m clearance. Light with agarbatti on an open clear hard surface. Keep water nearby.',
    sound_level: 'Medium',
    image_url: '/images/placeholder.webp'
  });
}

console.log('Parsed products count:', products.length);

async function postWithRetry(url, options, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      const text = await res.text();
      console.warn(`Attempt ${i + 1} HTTP ${res.status}:`, text);
    } catch (e) {
      console.warn(`Attempt ${i + 1} network error:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
  throw new Error(`Failed after ${retries} retries`);
}

async function run() {
  // Check which ids are already in Supabase
  const existingRes = await postWithRetry(`${SUPABASE_URL}/rest/v1/products?select=id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const existingData = await existingRes.json();
  const existingIds = new Set(existingData.map(p => p.id));
  console.log('Already in Supabase:', existingIds.size);

  const missingProducts = products.filter(p => !existingIds.has(p.id));
  console.log('Remaining to insert:', missingProducts.length);

  // Insert in batches of 25 with retry
  for (let i = 0; i < missingProducts.length; i += 25) {
    const chunk = missingProducts.slice(i, i + 25);
    await postWithRetry(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(chunk)
    });
    console.log(`Successfully inserted chunk of ${chunk.length} items (IDs ${chunk[0].id} - ${chunk[chunk.length - 1].id})`);
    await new Promise(r => setTimeout(r, 500));
  }

  // Final check
  const finalRes = await postWithRetry(`${SUPABASE_URL}/rest/v1/products?select=id,name,category,price,piece_count&order=id.asc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const finalData = await finalRes.json();
  console.log('FINAL VERIFICATION: Total products in Supabase:', finalData.length);
  console.log('Item 1:', finalData[0]);
  console.log('Item 153:', finalData[finalData.length - 1]);
}

run().catch(console.error);
