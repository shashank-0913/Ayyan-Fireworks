import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicProductsDir = path.resolve(rootDir, 'public/products');
const ayyanImagesDir = path.resolve(rootDir, 'ayyan_images');

if (!fs.existsSync(publicProductsDir)) {
  fs.mkdirSync(publicProductsDir, { recursive: true });
}

// 1. Read PRODUCTS_LIST from src/data/products.ts
const productsTsPath = path.resolve(rootDir, 'src/data/products.ts');
const tsContent = fs.readFileSync(productsTsPath, 'utf8');

// Parse products using regex from TS file supporting escaped quotes
const productRegex = /\{\s*code:\s*(\d+),\s*name:\s*"((?:\\.|[^"\\])*)",\s*category:\s*"([^"]+)",\s*packing:\s*"([^"]+)",\s*price:\s*([0-9.]+),\s*image:\s*"([^"]+)"\s*\}/g;
const products = [];
let match;
while ((match = productRegex.exec(tsContent)) !== null) {
  products.push({
    code: parseInt(match[1], 10),
    name: match[2].replace(/\\"/g, '"'),
    category: match[3],
    packing: match[4],
    price: parseFloat(match[5]),
    image: match[6]
  });
}

console.log(`Loaded ${products.length} products from src/data/products.ts.`);

// 2. Export src/data/products.json and public/products.json
fs.writeFileSync(path.resolve(rootDir, 'src/data/products.json'), JSON.stringify(products, null, 2));
fs.writeFileSync(path.resolve(rootDir, 'public/products.json'), JSON.stringify(products, null, 2));
console.log('Saved src/data/products.json and public/products.json');

// 3. Scan existing images in public/products and ayyan_images
const existingProductFiles = fs.readdirSync(publicProductsDir);
let existingAyyanFiles = [];
if (fs.existsSync(ayyanImagesDir)) {
  try {
    existingAyyanFiles = fs.readdirSync(ayyanImagesDir);
  } catch (e) {}
}

// Load WP / scraped data if available
let wpProducts = [];
let scraped = [];
let wpMedia = [];
try {
  wpProducts = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'scripts/wp-products.json'), 'utf8'));
} catch (e) {}
try {
  scraped = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'scripts/ayyan-scraped.json'), 'utf8'));
} catch (e) {}
try {
  wpMedia = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'scripts/wp-media.json'), 'utf8'));
} catch (e) {}

// Build online media map: normalized title -> url
const onlineImageMap = [];
for (const p of wpProducts) {
  if (p.images && Array.isArray(p.images)) {
    for (const img of p.images) {
      if (img.src && !img.src.includes('logo.png') && !img.src.includes('cropped-')) {
        const fullUrl = img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
        onlineImageMap.push({ name: p.name, url: fullUrl });
      }
    }
  }
}
for (const s of scraped) {
  if (s.originalUrl && !s.originalUrl.includes('logo.png')) {
    onlineImageMap.push({ name: s.rawAlt || s.name || '', url: s.originalUrl });
  }
}
for (const m of wpMedia) {
  if (m.source_url && !m.source_url.includes('logo.png') && !m.source_url.includes('favicon')) {
    onlineImageMap.push({ name: m.title || '', url: m.source_url });
  }
}

function cleanString(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function tokenize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !['piece', 'box', 'pkt', 'shots', 'shot', 'items'].includes(w));
}

// Fallback logo URL
const FALLBACK_LOGO_URL = 'https://products.ayyanfireworks.in/image/cache/catalog/logo-500x500.png';

async function downloadUrlToBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      return Buffer.from(await res.arrayBuffer());
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function populateImages() {
  console.log('Populating official product images in public/products/...');

  let localCopyCount = 0;
  let downloadedCount = 0;
  let alreadyExistCount = 0;
  let fallbackCount = 0;

  for (const prod of products) {
    const filename = path.basename(prod.image); // e.g. "1-ganesh-crackers.jpg"
    const targetPath = path.resolve(publicProductsDir, filename);

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
      alreadyExistCount++;
      continue;
    }

    const cleanName = cleanString(prod.name);
    const tokens = tokenize(prod.name);

    // 1. Try matching an existing file in public/products
    let bestLocalFile = null;
    let bestLocalScore = 0;

    for (const f of existingProductFiles) {
      if (f === filename) continue;
      const cleanF = cleanString(f);
      if (cleanF.includes(cleanName) || cleanName.includes(cleanF)) {
        bestLocalFile = path.resolve(publicProductsDir, f);
        bestLocalScore = 100;
        break;
      }
      let score = 0;
      for (const t of tokens) {
        if (cleanF.includes(t)) score += 2;
      }
      if (score > bestLocalScore && score >= 2) {
        bestLocalScore = score;
        bestLocalFile = path.resolve(publicProductsDir, f);
      }
    }

    // 2. Try matching in ayyan_images
    if (!bestLocalFile && existingAyyanFiles.length > 0) {
      for (const f of existingAyyanFiles) {
        const cleanF = cleanString(f);
        if (cleanF.includes(cleanName) || cleanName.includes(cleanF)) {
          bestLocalFile = path.resolve(ayyanImagesDir, f);
          bestLocalScore = 100;
          break;
        }
        let score = 0;
        for (const t of tokens) {
          if (cleanF.includes(t)) score += 2;
        }
        if (score > bestLocalScore && score >= 2) {
          bestLocalScore = score;
          bestLocalFile = path.resolve(ayyanImagesDir, f);
        }
      }
    }

    if (bestLocalFile && fs.existsSync(bestLocalFile) && fs.statSync(bestLocalFile).size > 1000) {
      fs.copyFileSync(bestLocalFile, targetPath);
      localCopyCount++;
      continue;
    }

    // 3. Try finding online URL match
    let bestOnlineUrl = null;
    let bestOnlineScore = 0;
    for (const entry of onlineImageMap) {
      const cleanE = cleanString(entry.name);
      if (cleanE.includes(cleanName) || cleanName.includes(cleanE)) {
        bestOnlineUrl = entry.url;
        bestOnlineScore = 100;
        break;
      }
      let score = 0;
      for (const t of tokens) {
        if (cleanE.includes(t)) score += 2;
      }
      if (score > bestOnlineScore && score >= 2) {
        bestOnlineScore = score;
        bestOnlineUrl = entry.url;
      }
    }

    if (bestOnlineUrl) {
      const buf = await downloadUrlToBuffer(bestOnlineUrl);
      if (buf && buf.length > 1000) {
        fs.writeFileSync(targetPath, buf);
        downloadedCount++;
        continue;
      }
    }

    // 4. Fallback: Copy category image or placeholder logo
    const categoryFallbacks = [
      path.resolve(rootDir, 'public/ayyan-logo.png'),
      path.resolve(rootDir, 'public/ayyan-emblem.png')
    ];
    let copiedFallback = false;
    for (const fb of categoryFallbacks) {
      if (fs.existsSync(fb) && fs.statSync(fb).size > 1000) {
        fs.copyFileSync(fb, targetPath);
        copiedFallback = true;
        fallbackCount++;
        break;
      }
    }

    if (!copiedFallback) {
      // Last resort: download fallback logo
      const buf = await downloadUrlToBuffer(FALLBACK_LOGO_URL);
      if (buf) {
        fs.writeFileSync(targetPath, buf);
        fallbackCount++;
      }
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Image Population Complete for all ${products.length} products:`);
  console.log(`- Already present: ${alreadyExistCount}`);
  console.log(`- Matched & copied from local official photography: ${localCopyCount}`);
  console.log(`- Downloaded from official repository: ${downloadedCount}`);
  console.log(`- Fallbacks created: ${fallbackCount}`);
  console.log('----------------------------------------------------');
}

populateImages().catch(err => {
  console.error('Error populating images:', err);
  process.exit(1);
});
