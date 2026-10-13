import fs from 'fs';
import path from 'path';

const RAW_TABLE = `| S.No. | Item Description | Packing / Unit | Rate / Price (₹) |
| --- | --- | --- | --- |
| 1 | Ganesh Cracker | 1 Pkt | 62.00 |
| 2 | Lakshmi Cracker | 1 Pkt | 35.00 |
| 3 | Bird Crackers | 1 Pkt | 15.80 |
| 4 | 7 cm Electric Sparkler | 1 Box / 10 Pcs | 19.60 |
| 5 | 7 cm Colour Sparkler | 1 Box / 10 Pcs | 22.95 |
| 6 | 10 cm Ruby Sparklers | 1 Box / 10 Pcs | 35.65 |
| 7 | 12 cm Electric Sparkler | 1 Box / 10 Pcs | 28.65 |
| 8 | 12 cm Colour Sparkler | 1 Box / 10 Pcs | 38.75 |
| 9 | 15 cm Electric Sparkler | 1 Box / 10 Pcs | 55.80 |
| 10 | 15 cm Colour Sparkler | 1 Box / 10 Pcs | 72.85 |
| 11 | 15 cm Ruby Sparkler | 1 Box / 10 Pcs | 60.50 |
| 12 | 15 cm Panchavarnam Sparkler | 1 Box / 10 Pcs | 66.65 |
| 13 | 30 cm Electric Sparkler | 1 Box / 5 Pcs | 55.80 |
| 14 | 30 cm Colour Sparkler | 1 Box / 5 Pcs | 72.85 |
| 15 | 50 cm Electric Sparkler | 1 Box / 5 Pcs | 168.50 |
| 16 | 50 cm Colour Sparkler | 1 Box / 5 Pcs | 208.50 |
| 17 | 75 cm Electric Sparkler | 1 Box / 5 Pcs | 280.70 |
| 18 | 75 cm Colour Sparklers | 1 Box / 5 Pcs | 338.50 |
| 19 | Ground Chakkar Big | 25 Pcs / 1 Box | 164.30 |
| 20 | Ground Chakkar Spl. | 10 Pcs / 1 Box | 148.80 |
| 21 | Ground Chakkar Deluxe | 10 Pcs / 1 Box | 263.50 |
| 22 | Krishna Chakkar Big | 25 Pcs / 1 Box | 209.15 |
| 23 | Krishna Chakkar Spl. | 10 Pcs / 1 Box | 158.10 |
| 24 | Giant Wheel | 5 Pcs / 1 Box | 189.10 |
| 25 | Joke Wheel | 5 Pcs / 1 Box | 189.10 |
| 26 | Star Wheel | 10 Pcs / 1 Box | 167.40 |
| 27 | Classic Wheel | 10 Pcs / 1 Box | 271.25 |
| 28 | Whistling Wheel | 5 Pcs / 1 Box | 192.20 |
| 28 | Glittering Wheel | 5 Pcs / 1 Box | 189.10 |
| 29 | Tinto Wheel | 5 Pcs / 1 Box | 176.40 |
| 30 | Rio Wheel | 5 Pcs / 1 Box | 176.40 |
| 31 | Lotus | 5 Pcs / 1 Box | 127.10 |
| 32 | Cocktail Spinner | 10 Pcs / 1 Box | 53.00 |
| 33 | Flower Pots Night | 10 Pcs / 1 Box | 133.30 |
| 34 | Flower Pots Spl. | 10 Pcs / 1 Box | 213.90 |
| 35 | Flower Pots Giant | 10 Pcs / 1 Box | 465.00 |
| 37 | Flower Pots Red | 1 Box / 10 Pcs | 226.10 |
| 38 | Tri Colour Fountain | 1 Box / 5 Pcs | 392.15 |
| 39 | Rangoli | 1 Box / 5 Pcs | 244.90 |
| 40 | Colour Koti Deluxe | 1 Box / 10 Pcs | 713.00 |
| 41 | Jugnu | 4 Pcs / 1 Box | 275.90 |
| 42 | Mano Rajai | 4 Pcs / 1 Box | 275.90 |
| 43 | Roop Khela | 10 Pcs / 1 Box | 463.45 |
| 44 | Varna Jalam | 10 Pcs / 1 Box | 443.30 |
| 45 | Kiddy's Joy | 5 Pcs / 1 Pkt | 178.25 |
| 46 | Super Star (Crackling) | 1 Pkt | 145.00 |
| 47 | Dil Se | 1 Box | 180.00 |
| 48 | Little Dove | 1 Box | 195.00 |
| 49 | Crackling Star | 5 Pcs / 1 Box | 367.35 |
| 50 | Chhota Bhai (Mini Siren) | 1 Pkt | 161.20 |
| 51 | Super Sonic (Siren) | 1 Pkt | 260.40 |
| 52 | Lemon Tree (4 Colours) | 1 Box | 380.00 |
| 53 | Tora-Tora | 1 Box / 5 Pcs | 511.50 |
| 54 | Mega Peacock Gold | 1 Pce | 666.50 |
| 54 | Mega Peacock Silver | 1 Piece | 666.50 |
| 55 | Twinkling 45 cm | 1 Box / 10 Pcs | 56.60 |
| 56 | Twinkling Star 120 cm | 1 Box / 10 Pcs | 189.10 |
| 57 | Electric Diamond | 10 Pcs / 1 Box | 72.00 |
| 58 | Pencil | 20 Pcs / 1 Box | 141.05 |
| 59 | Pencil Dlx | 1 Box / 10 Pcs | 137.95 |
| 60 | Mint Candle | 1 Box / 10 Pcs | 168.10 |
| 61 | Rainbow Candle | 1 Box / 5 Pcs | 217.00 |
| 62 | Hydro Bomb | 10 Pcs / 1 Box | 103.85 |
| 63 | Shogun Bomb | 1 Box / 10 Pcs | 181.35 |
| 64 | Double Sound Small | 1 Pkt / 5 Pcs | 49.00 |
| 65 | Double Sound Big | 1 Pkt / 5 Pcs | 66.00 |
| 66 | Three Sound with Colour | 1 Pkt / 5 Pcs | 85.25 |
| 67 | Flower Bomb Deluxe | 1 Box / 1 Pce | 272.80 |
| 68 | Tito Special | 1 Box / 3 Pcs | 114.70 |
| 69 | Ulta Pulta | 1 Box / 1 Pce | 158.10 |
| 70 | Photo Flash | 1 Pkt / 10 Pcs | 62.00 |
| 71 | Laser Red / Green | 1 Pkt / 10 Pcs | 79.05 |
| 72 | Colour Rocket | 1 Box / 10 Pcs | 120.90 |
| 73 | Rocket Bomb | 1 Box / 10 Pcs | 150.35 |
| 74 | Flower Missile | 1 Box / 10 Pcs | 138.70 |
| 75 | Sound Missile | 1 Box / 10 Pcs | 170.50 |
| 76 | Whistle Sound Rocket | 1 Box / 10 Pcs | 209.25 |
| 77 | Dlx Rocket Colour | 1 Box / 10 Pcs | 189.10 |
| 78 | Classic Rocket Sound | 1 Box / 10 Pcs | 223.20 |
| 79 | Parachute Rocket | 1 Box / 4 Pcs | 293.20 |
| 80 | Air Whistle | 1 Box / 10 Pcs | 251.10 |
| 81 | Super Whistle | 1 Box / 10 Pcs | 399.50 |
| 82 | Pop-Pop | 10 Pcs / 1 Box | 49.60 |
| 83 | Seven Shot Red | 5 Pcs / 1 Box | 192.20 |
| 84 | Seven Shot Gold | 5 Pcs / 1 Box | 192.20 |
| 85 | Mojo | 5 Pcs / 1 Box | 260.40 |
| 86 | Dancing Butterfly | 10 Pcs / 1 Box | 136.40 |
| 87 | Super Drone | 5 Pcs / 1 Box | 181.35 |
| 88 | Funny & Bonny | 10 Pcs / 1 Box | 217.00 |
| 89 | Magic Mystery | 10 Pcs / 1 Box | 217.00 |
| 90 | Chori Chori | 10 Pcs / 1 Box | 217.00 |
| 91 | Min Mini | 10 Pcs / 1 Box | 217.00 |
| 92 | Ninja Chakkar | 2 Pcs / 1 Box | 108.50 |
| 93 | Pogo Mixed | 2 Pcs / 1 Box | 69.70 |
| 94 | Helicopter | 5 Pcs / 1 Box | 83.70 |
| 95 | 1¼" Cells | 1 Pkt (5 Pcs) / 1 Box | 562.65 |
| 96 | 1¾" Cells | 1 Pkt (3 Pcs) / 1 Box | 441.75 |
| 97 | 2" Cells | 1 Piece | 186.00 |
| 98 | 3" Cells - Rocky / AK | 1 Piece | 455.70 |
| 93 (B) | 3" Cells Premium | 1 Piece | 511.50 |
| 94 (B) | Dekhe Man (12 Star) | 1 Piece | 214.00 |
| 95 (B) | Daisy Beds (12 Star) | 1 Piece | 232.50 |
| 96 (B) | Pink Panther (12 Star) | 1 Piece | 232.50 |
| 97 (B) | Zeta, Beta, Sigma, Omega (12 Star) | 1 Piece | 291.40 |
| 98 (B) | Sky Storms (25 Shots) | 1 Box | 220.00 |
| 99 | Chal Mere Sath | 1 Box | 418.50 |
| 100 | Thor | 1 Box | 581.25 |
| 101 | Dil Mange More (50 Shots) | 1 Box | 744.00 |
| 102 | Balle - Balle | 1 Box | 533.20 |
| 103 | Sunhari Barsat | 1 Box | 448.00 |
| 104 | Singing Bird (25 Shots) | 1 Box | 837.00 |
| 105 | Singing Bird (12 Shots) | 1 Box | 403.00 |
| 106 | Indian Delight (30 Shots) | 1 Box | 883.50 |
| 107 | Indian Delight (15 Shots) | 1 Box | 475.85 |
| 108 | Wonder Night (60 Shots) | 1 Box | 1542.00 |
| 109 | Mystic Magic | 1 Box | 1635.00 |
| 110 | Rang-O-Rang | 1 Box | 2402.00 |
| 111 | Sky Boomers (120 Shots) | 1 Box | 2852.00 |
| 112 | Classic Night | 1 Box | 2790.00 |
| 113 | Arabian Night (240 Shots) | 1 Box | 3069.00 |
| 114 | Classic Nighty | 1 Box | 5859.00 |
| 115 | Arabian Nights | 1 Box | 6587.50 |
| 116 | Suba Mangalam (500 Shots) | 1 Box | 13872.50 |
| 117 | Sarva Mangalam (1000 Shots) | 1 Box | 27977.50 |
| 118 | Festiva (50 Shots) | 1 Box | 3022.50 |
| 119 | Festiva (100 Shots) | 1 Box | 6045.00 |
| 120 | Floral Fantasy (100 Shots) | 1 Box | 6626.25 |
| 121 | Floral Fantasy (180 Shots) | 1 Box | 11315.00 |
| 122 | Top Star (24 Shots) | 1 Box | 7267.50 |
| 123 | Fun Club (24 Shots) | 1 Box | 6192.35 |
| 124 | Fashion Parade (24 Shots) | 1 Box | 6192.00 |
| 125 | Angel (16 Shots) | 1 Box | 10493.00 |
| 126 | Paris-Paris (10 Shots) | 1 Box | 5347.50 |
| 127 | Casanova (20 Shots) | 1 Box | 10472.50 |
| 128 | Night Rider (100 Shots) | 1 Box | 3875.00 |
| 129 | Big Show (100 Shots) | 1 Box | 6161.25 |
| 130 | Assorted Gift Box - A | 24 Items | 790.50 |
| 131 | Assorted Gift Box - B | 28 Items | 1085.00 |
| 132 | Assorted Gift Box - C | 30 Items | 1581.00 |
| 133 | Assorted Gift Box - D | 36 Items | 1813.50 |
| 134 | Dino Gift Box | 40 Items | 1821.00 |`;

// Load media and scraped products
const wpMedia = JSON.parse(fs.readFileSync('scripts/wp-media.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('scripts/wp-products.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('scripts/ayyan-scraped.json', 'utf8'));

// Build unified lookup catalog of official Ayyan packaging images
const officialImages = [];

for (const p of wpProducts) {
  if (p.images && p.images.length > 0) {
    for (const img of p.images) {
      if (img.src && !img.src.includes('logo.png')) {
        officialImages.push({
          name: p.name,
          src: img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1'),
          alt: img.alt || img.name || p.name
        });
      }
    }
  }
}

for (const s of scraped) {
  if (s.originalUrl) {
    officialImages.push({
      name: s.rawAlt,
      src: s.originalUrl,
      alt: s.rawAlt
    });
  }
}

for (const m of wpMedia) {
  if (m.source_url && !m.source_url.includes('logo.png') && !m.source_url.includes('icon')) {
    officialImages.push({
      name: m.title || m.alt || '',
      src: m.source_url,
      alt: m.alt || m.title || ''
    });
  }
}

const CATEGORY_FALLBACKS = {
  'Maroons': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ganesh-Crackers-10-Pkt.png',
  'Sparklers': 'https://ayyansworld.com/wp-content/uploads/2024/02/15cm-Coloured-Sparklers-10-box.png',
  'Ground Chakkars': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Special-10-box.png',
  'Wheels': 'https://ayyansworld.com/wp-content/uploads/2024/02/Giant-Wheel-5-box.png',
  'Flower Pots': 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Special-10-box.png',
  'Colourful Fountains': 'https://ayyansworld.com/wp-content/uploads/2024/02/tri-colour-fountain-ayyanfire-copy.png',
  'Sky Rockets': 'https://ayyansworld.com/wp-content/uploads/2024/02/Colour-Rockets-10-box.png',
  'Novelties': 'https://ayyansworld.com/wp-content/uploads/2024/02/Super-Drone-5-box.png',
  'Aerial Multi-Shots': 'https://ayyansworld.com/wp-content/uploads/2024/02/12-Star-Sky-Storms-1-Box.png',
  'Gift Boxes': 'https://ayyansworld.com/wp-content/uploads/2024/02/Assorted-Gift-Boxes-Ayyan.png'
};

function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBestImage(name, category) {
  const normName = normalizeName(name);
  const keywords = normName.split(' ').filter(w => w.length > 2);

  // Exact normalized match
  for (const item of officialImages) {
    if (normalizeName(item.name) === normName) {
      return item.src;
    }
  }

  // Multi-keyword match
  let bestScore = 0;
  let bestImg = null;

  for (const item of officialImages) {
    const itemNorm = normalizeName(item.name);
    let score = 0;
    for (const kw of keywords) {
      if (itemNorm.includes(kw)) score += 2;
    }
    if (itemNorm.includes(normName)) score += 5;

    if (score > bestScore) {
      bestScore = score;
      bestImg = item.src;
    }
  }

  if (bestScore >= 2 && bestImg) {
    return bestImg;
  }

  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS['Sparklers'];
}

function inferCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('sparkler')) return 'Sparklers';
  if (n.includes('chakkar')) return 'Ground Chakkars';
  if (n.includes('wheel') || n.includes('spinner') || n.includes('lotus')) return 'Wheels';
  if (n.includes('flower pot') || n.includes('koti')) return 'Flower Pots';
  if (n.includes('fountain') || n.includes('rangoli') || n.includes('peacock') || n.includes('tora') || n.includes('jugnu') || n.includes('candle') || n.includes('pencil') || n.includes('twinkling') || n.includes('diamond') || n.includes('tree')) return 'Colourful Fountains';
  if (n.includes('rocket') || n.includes('missile') || n.includes('whistle')) return 'Sky Rockets';
  if (n.includes('bomb') || n.includes('sound') || n.includes('cracker') || n.includes('maroon') || n.includes('flash') || n.includes('laser')) return 'Maroons';
  if (n.includes('shot') || n.includes('shots') || n.includes('star') || n.includes('sky') || n.includes('night') || n.includes('mangalam') || n.includes('festiva') || n.includes('fantasy') || n.includes('cells') || n.includes('angel') || n.includes('paris') || n.includes('casanova') || n.includes('thor') || n.includes('delight') || n.includes('magic') || n.includes('boomer')) return 'Aerial Multi-Shots';
  if (n.includes('gift box')) return 'Gift Boxes';
  if (n.includes('pop-pop') || n.includes('drone') || n.includes('butterfly') || n.includes('helicopter') || n.includes('mojo') || n.includes('pogo') || n.includes('ninja')) return 'Novelties';
  return 'Sparklers';
}

function inferSoundLevel(category, name) {
  const n = name.toLowerCase();
  if (category === 'Maroons' || n.includes('bomb') || n.includes('siren') || n.includes('whistle') || n.includes('double sound') || n.includes('three sound')) return 'High Spectacle';
  if (category === 'Aerial Multi-Shots') return 'High Spectacle';
  if (category === 'Sparklers' || n.includes('sparkler') || n.includes('flower pot') || n.includes('candle')) return 'Low / Silent';
  return 'Medium';
}

// Parse markdown table rows
const lines = RAW_TABLE.split('\n').filter(l => l.trim().startsWith('|'));
const parsedProducts = [];
let itemIdx = 1;

for (const line of lines) {
  const cols = line.split('|').map(c => c.trim()).filter(Boolean);
  if (cols.length < 4) continue;
  const sNo = cols[0];
  if (sNo === 'S.No.' || sNo.startsWith('---')) continue;

  const rawName = cols[1];
  const packing = cols[2] && cols[2] !== '—' ? cols[2] : '1 Box';
  let priceStr = cols[3].replace(/[₹,]/g, '').trim();
  let price = parseFloat(priceStr);
  if (isNaN(price)) price = 0;

  const category = inferCategory(rawName);
  const soundLevel = inferSoundLevel(category, rawName);
  const imgUrl = findBestImage(rawName, category);
  const codeNum = String(itemIdx).padStart(3, '0');

  parsedProducts.push({
    id: `ayyan-${codeNum}`,
    code: codeNum,
    name: rawName,
    category: category,
    price: price,
    piece_count: packing,
    description: `Authentic Ayyan Fireworks (Bunny Brand) certified green cracker creation. Manufactured in Sivakasi with QR green emission compliance.`,
    safety_instructions: `Keep safe distance of 10m. Ignite using an agarbatti on an open clear hard surface. Keep water nearby.`,
    safety_tags: ['Bunny Brand', 'Green Cracker', 'Sivakasi Authentic'],
    sound_level: soundLevel,
    image_url: imgUrl,
    is_active: true,
    created_at: new Date().toISOString()
  });

  itemIdx++;
}

console.log(`Parsed ${parsedProducts.length} products from the provided price list table.`);

// 1. Generate updated initialData.ts
const initialDataCode = `import { Product, Slot, Booking } from '../types';

// =============================================================================
// AYYAN FIREWORKS FACTORY — OFFICIAL SHOWROOM INVENTORY (${parsedProducts.length} SKUs)
// Bunny Brand Sivakasi Green Cracker Catalogue
// =============================================================================
export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(parsedProducts, null, 2)};

// Helper date offset function
export const getFormattedDateOffset = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Seed Slot generation for showroom visitations (Visakhapatnam showroom)
export const generateInitialSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const today = new Date();

  for (let d = 0; d < 14; d++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + d);
    const dateStr = slotDate.toISOString().split('T')[0];

    const hours = [
      { start: '05:00:00', end: '06:00:00', cap: 120 },
      { start: '06:00:00', end: '07:00:00', cap: 120 },
      { start: '07:00:00', end: '08:00:00', cap: 120 },
      { start: '08:00:00', end: '09:00:00', cap: 120 },
      { start: '09:00:00', end: '10:00:00', cap: 120 },
      { start: '10:00:00', end: '11:00:00', cap: 120 },
      { start: '11:00:00', end: '12:00:00', cap: 120 },
      { start: '12:00:00', end: '13:00:00', cap: 120 },
      { start: '14:00:00', end: '15:00:00', cap: 120 },
      { start: '15:00:00', end: '16:00:00', cap: 120 },
      { start: '16:00:00', end: '17:00:00', cap: 120 },
      { start: '17:00:00', end: '18:00:00', cap: 120 },
      { start: '18:00:00', end: '19:00:00', cap: 120 },
      { start: '19:00:00', end: '20:00:00', cap: 120 },
      { start: '20:00:00', end: '21:00:00', cap: 120 },
      { start: '21:00:00', end: '22:00:00', cap: 120 }
    ];

    hours.forEach((h, index) => {
      slots.push({
        id: \`slot-\${dateStr}-\${index}\`,
        slot_date: dateStr,
        start_time: h.start,
        end_time: h.end,
        total_capacity: h.cap,
        booked_capacity: 0,
        is_blocked: false,
        created_at: new Date().toISOString()
      });
    });
  }

  return slots;
};

export const generateInitialBookings = (_slots?: Slot[]): Booking[] => {
  return [];
};
`;

fs.writeFileSync('src/lib/initialData.ts', initialDataCode, 'utf8');
console.log('Successfully updated src/lib/initialData.ts with', parsedProducts.length, 'products!');

// 2. Insert into Supabase table 'products'
const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

async function syncToSupabase() {
  console.log('Syncing all products into Supabase products table...');

  // Convert for Supabase insert schema
  const dbPayload = parsedProducts.map(p => ({
    name: p.name,
    category: p.category,
    price: p.price,
    piece_count: p.piece_count,
    description: p.description,
    safety_instructions: p.safety_instructions,
    safety_tags: p.safety_tags,
    sound_level: p.sound_level,
    image_url: p.image_url,
    is_active: true
  }));

  // Insert in batches of 25
  const batchSize = 25;
  let inserted = 0;
  for (let i = 0; i < dbPayload.length; i += batchSize) {
    const batch = dbPayload.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(batch)
    });

    if (res.ok) {
      const data = await res.json();
      inserted += data.length;
      console.log(`Inserted batch ${i / batchSize + 1}: ${data.length} items (Total: ${inserted})`);
    } else {
      const err = await res.text();
      console.error(`Batch insert error at ${i}:`, err);
    }
  }

  console.log(`Successfully synced ${inserted} products to Supabase cloud!`);
}

syncToSupabase();
