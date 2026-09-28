import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://bdvrcpisjatvbbqffswp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdnJjcGlzamF0dmJicWZmc3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzUxMDQsImV4cCI6MjEwNTgxMTEwNH0.amQFqHKdkcHNFFa-HNFSXL-uFvDkGzJA9NyPErSRKOI";

// Load scraped and WP data
const wpMedia = JSON.parse(fs.readFileSync('scripts/wp-media.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('scripts/wp-products.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('scripts/ayyan-scraped.json', 'utf8'));

// Build image lookup catalog from all official sources
const allOfficialSources = [];

for (const p of wpProducts) {
  if (p.images && p.images.length > 0) {
    for (const img of p.images) {
      if (img.src && !img.src.includes('logo.png')) {
        allOfficialSources.push({
          name: p.name,
          src: img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1'),
          alt: img.alt || img.name || p.name
        });
      }
    }
  }
}

for (const s of scraped) {
  allOfficialSources.push({
    name: s.rawAlt,
    src: s.originalUrl,
    alt: s.rawAlt
  });
}

for (const m of wpMedia) {
  if (m.source_url && !m.source_url.includes('logo.png') && !m.source_url.includes('icon')) {
    allOfficialSources.push({
      name: m.title || m.alt || '',
      src: m.source_url,
      alt: m.alt || m.title || ''
    });
  }
}

// Category fallback packaging visuals from authentic Ayyan library
const CATEGORY_FALLBACKS = {
  'Maroons': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ganesh-Crackers-10-Pkt.png',
  'Sparklers': 'https://ayyansworld.com/wp-content/uploads/2024/02/15cm-Coloured-Sparklers-10-box.png',
  'Ground Chakkars': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Big-25-pcs.png',
  'Chakkars': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Big-25-pcs.png',
  'Wheels': 'https://ayyansworld.com/wp-content/uploads/2024/02/Whistling-Wheel.png',
  'Flower Pots': 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Special-10-Pcs.png',
  'Colourful Fountains': 'https://ayyansworld.com/wp-content/uploads/2024/02/12-fountain-Colour-Whistle.png',
  'Fountains': 'https://ayyansworld.com/wp-content/uploads/2024/02/12-fountain-Colour-Whistle.png',
  'Sky Rockets': 'https://ayyansworld.com/wp-content/uploads/2024/02/Baby-Rocket-10Pcs.png',
  'Rockets': 'https://ayyansworld.com/wp-content/uploads/2024/02/Baby-Rocket-10Pcs.png',
  'Novelties': 'https://ayyansworld.com/wp-content/uploads/2024/02/Colour-Smokes-3Pcs.png',
  'Aerial Multi-Shots': 'https://ayyansworld.com/wp-content/uploads/2024/02/12-Shots-Rider.png',
  'Cakes': 'https://ayyansworld.com/wp-content/uploads/2024/02/12-Shots-Rider.png',
  'Safety Matches': 'https://ayyansworld.com/wp-content/uploads/2024/02/Golden-Touch-10-box.png',
  'Matches': 'https://ayyansworld.com/wp-content/uploads/2024/02/Golden-Touch-10-box.png',
  'Gift Boxes': 'https://ayyansworld.com/wp-content/uploads/2024/02/Family-Kit.png',
  'Celebration Crackers': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ganesh-Crackers-10-Pkt.png',
  'General': 'https://ayyansworld.com/wp-content/uploads/2024/02/Family-Kit.png'
};

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findBestImageForProduct(p) {
  const pNorm = normalize(p.name);
  const pTokens = pNorm.split(' ').filter(t => t.length > 2);

  let bestMatch = null;
  let highestScore = 0;

  for (const src of allOfficialSources) {
    const sNorm = normalize(src.name + ' ' + src.alt);
    const sTokens = sNorm.split(' ').filter(t => t.length > 2);

    let score = 0;
    if (sNorm === pNorm) {
      score = 100;
    } else if (p.code && (sNorm.includes(p.code) || src.src.includes(p.code))) {
      score = 95;
    } else {
      let matchedTokenCount = 0;
      for (const pt of pTokens) {
        if (sNorm.includes(pt)) matchedTokenCount++;
      }
      if (matchedTokenCount === pTokens.length && pTokens.length > 0) {
        score = 85;
      } else if (matchedTokenCount >= 2) {
        score = 65 + (matchedTokenCount / Math.max(1, pTokens.length)) * 15;
      } else if (matchedTokenCount === 1 && pTokens.length === 1) {
        score = 75;
      }
    }

    if (score > highestScore && score >= 60) {
      highestScore = score;
      bestMatch = src;
    }
  }

  if (bestMatch) {
    return { url: bestMatch.src, score: highestScore, isExact: highestScore >= 75 };
  }

  // Fallback
  const fallbackUrl = CATEGORY_FALLBACKS[p.category] || CATEGORY_FALLBACKS['General'];
  return { url: fallbackUrl, score: 0, isExact: false };
}

// Read and parse initialData.ts
const initialDataPath = 'src/lib/initialData.ts';
let initialDataContent = fs.readFileSync(initialDataPath, 'utf8');

// Parse products
const itemsBlocks = initialDataContent.split(/{\s*id:\s*'/).slice(1);
const parsedProducts = [];

for (const block of itemsBlocks) {
  const idMatch = block.match(/^([^']+)'/);
  const codeMatch = block.match(/code:\s*'([^']+)'/);
  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const catMatch = block.match(/category:\s*'([^']+)'/);
  const priceMatch = block.match(/price:\s*([0-9.]+)/);
  const currentImgMatch = block.match(/image_url:\s*'([^']+)'/);

  if (idMatch && nameMatch) {
    parsedProducts.push({
      id: idMatch[1],
      code: codeMatch ? codeMatch[1] : idMatch[1].replace('ayyan-', ''),
      name: nameMatch[1],
      category: catMatch ? catMatch[1] : 'General',
      price: priceMatch ? Number(priceMatch[1]) : 0,
      currentImageUrl: currentImgMatch ? currentImgMatch[1] : ''
    });
  }
}

console.log(`Starting Image Enrichment Pipeline for ${parsedProducts.length} Ayyan Fireworks products...`);

// Cache to avoid re-downloading identical source images
const urlToSupabaseMap = new Map();

async function downloadAndUploadImage(sourceUrl, productCode) {
  if (urlToSupabaseMap.has(sourceUrl)) {
    return urlToSupabaseMap.get(sourceUrl);
  }

  try {
    const res = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to download: status ${res.status}`);
    }

    const arrayBuf = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    if (buffer.length < 500) {
      throw new Error('Image buffer too small');
    }

    // Determine extension
    let ext = 'png';
    if (sourceUrl.endsWith('.jpg') || sourceUrl.endsWith('.jpeg')) ext = 'jpg';
    if (sourceUrl.endsWith('.webp')) ext = 'webp';

    const cleanCode = productCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    const storagePath = `official/ayyan_${cleanCode}.${ext}`;

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${storagePath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Upload error ${uploadRes.status}: ${errText}`);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${storagePath}`;
    urlToSupabaseMap.set(sourceUrl, publicUrl);
    return publicUrl;
  } catch (err) {
    console.warn(`[Storage Upload Error for ${productCode}]:`, err.message);
    return null;
  }
}

async function runPipeline() {
  const results = [];
  let successCount = 0;
  let fallbackCount = 0;
  const replacedMap = new Map();

  for (let i = 0; i < parsedProducts.length; i++) {
    const p = parsedProducts[i];
    const matchResult = findBestImageForProduct(p);
    
    process.stdout.write(`[${i + 1}/${parsedProducts.length}] Processing "${p.name}" (${p.code})... `);

    let supabaseUrl = await downloadAndUploadImage(matchResult.url, p.code || p.id);

    if (!supabaseUrl) {
      // If upload failed, use category fallback
      const fallbackUrl = CATEGORY_FALLBACKS[p.category] || CATEGORY_FALLBACKS['General'];
      supabaseUrl = await downloadAndUploadImage(fallbackUrl, `cat_${p.category.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
      fallbackCount++;
      console.log(`FALLBACK (${matchResult.url})`);
    } else {
      if (matchResult.isExact) {
        successCount++;
        console.log(`OK (Exact packaging)`);
      } else {
        fallbackCount++;
        console.log(`OK (Category series)`);
      }
    }

    if (supabaseUrl) {
      replacedMap.set(p.id, supabaseUrl);
      results.push({
        id: p.id,
        code: p.code,
        name: p.name,
        category: p.category,
        originalImage: matchResult.url,
        supabaseUrl: supabaseUrl,
        isExact: matchResult.isExact
      });
    }
  }

  // Update initialData.ts
  console.log('\nUpdating src/lib/initialData.ts with permanent Supabase Storage URLs...');
  
  let updatedContent = initialDataContent;
  for (const r of results) {
    // Replace product image_url in initialData.ts
    // Match the specific block for this product
    const blockRegex = new RegExp(`(id:\\s*'${r.id}'[\\s\\S]*?image_url:\\s*')[^']+(')`, 'g');
    updatedContent = updatedContent.replace(blockRegex, `$1${r.supabaseUrl}$2`);
  }

  fs.writeFileSync(initialDataPath, updatedContent, 'utf8');
  console.log('src/lib/initialData.ts updated successfully!');

  // Save report
  fs.writeFileSync('scripts/enrichment-report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalProcessed: parsedProducts.length,
    exactMatches: successCount,
    seriesFallbacks: fallbackCount,
    uniqueUploadedUrls: urlToSupabaseMap.size,
    products: results
  }, null, 2));

  console.log('\n=============================================================');
  console.log('AYYAN FIREWORKS IMAGE ENRICHMENT PIPELINE COMPLETED');
  console.log('=============================================================');
  console.log(`Total Products Processed: ${parsedProducts.length}`);
  console.log(`Authentic Packaging Matches: ${successCount}`);
  console.log(`Category Series Fallbacks: ${fallbackCount}`);
  console.log(`Unique Supabase CDN Images: ${urlToSupabaseMap.size}`);
  console.log('Report written to: scripts/enrichment-report.json');
}

runPipeline();
