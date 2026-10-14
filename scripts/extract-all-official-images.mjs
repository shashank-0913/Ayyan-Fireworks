import fs from 'fs';
import path from 'path';

// Target directories
const ayyanImagesDir = path.resolve(process.cwd(), 'ayyan_images');
const publicProductsDir = path.resolve(process.cwd(), 'public/products');

if (!fs.existsSync(ayyanImagesDir)) fs.mkdirSync(ayyanImagesDir, { recursive: true });
if (!fs.existsSync(publicProductsDir)) fs.mkdirSync(publicProductsDir, { recursive: true });

// Load existing scraped catalogs
const wpMedia = JSON.parse(fs.readFileSync('scripts/wp-media.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('scripts/wp-products.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('scripts/ayyan-scraped.json', 'utf8'));

console.log('================================================================');
console.log('EXTRACTING OFFICIAL AYYAN FIREWORKS PACKAGING IMAGES (NO AI)');
console.log('================================================================');

// Collect all unique official image URLs
const imageMap = new Map(); // cleanFileName -> { url, name, category }

// 1. From wpProducts
for (const p of wpProducts) {
  if (p.images && Array.isArray(p.images)) {
    for (const img of p.images) {
      if (img.src && !img.src.includes('logo.png') && !img.src.includes('cropped-')) {
        const fullUrl = img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');
        const filename = path.basename(new URL(fullUrl).pathname);
        if (!imageMap.has(filename)) {
          imageMap.set(filename, {
            url: fullUrl,
            name: p.name,
            source: 'woocommerce'
          });
        }
      }
    }
  }
}

// 2. From scraped
for (const s of scraped) {
  if (s.originalUrl && !s.originalUrl.includes('logo.png')) {
    const filename = path.basename(new URL(s.originalUrl).pathname);
    if (!imageMap.has(filename)) {
      imageMap.set(filename, {
        url: s.originalUrl,
        name: s.rawAlt,
        category: s.category,
        source: 'store-scrape'
      });
    }
  }
}

// 3. From wpMedia
for (const m of wpMedia) {
  if (m.source_url && !m.source_url.includes('logo.png') && !m.source_url.includes('favicon')) {
    const filename = path.basename(new URL(m.source_url).pathname);
    if (!imageMap.has(filename)) {
      imageMap.set(filename, {
        url: m.source_url,
        name: m.title || filename,
        source: 'wp-media'
      });
    }
  }
}

console.log(`Found ${imageMap.size} unique official Ayyan product photographs.`);

// Download images in controlled concurrency
async function downloadAll() {
  const entries = Array.from(imageMap.entries());
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < entries.length; i++) {
    const [filename, item] = entries[i];
    const saveAyyanPath = path.join(ayyanImagesDir, filename);
    const savePublicPath = path.join(publicProductsDir, filename);

    // Skip if already downloaded
    if (fs.existsSync(saveAyyanPath) && fs.existsSync(savePublicPath)) {
      successCount++;
      continue;
    }

    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(saveAyyanPath, buf);
        fs.writeFileSync(savePublicPath, buf);
        successCount++;
        if (successCount % 20 === 0 || i === entries.length - 1) {
          console.log(`[${i + 1}/${entries.length}] Downloaded: ${filename} (${item.name})`);
        }
      } else {
        failCount++;
      }
    } catch (err) {
      failCount++;
    }
  }

  console.log('----------------------------------------------------------------');
  console.log(`Extraction complete! Successfully downloaded: ${successCount} images.`);
  console.log(`Saved to: ${ayyanImagesDir} and ${publicProductsDir}`);
}

downloadAll();
