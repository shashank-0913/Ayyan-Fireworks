import fs from 'fs';
import path from 'path';

async function scrapeShopImages() {
  const dir = path.resolve(process.cwd(), 'ayyan_images');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  console.log('Starting image scrape from https://ayyansworld.com/shop/ ...');
  
  const visitedUrls = new Set();
  const pagesToScrape = [
    'https://ayyansworld.com/shop/',
    'https://ayyansworld.com/shop/page/2/',
    'https://ayyansworld.com/shop/page/3/'
  ];

  let totalDownloaded = 0;

  for (const pageUrl of pagesToScrape) {
    try {
      console.log(`Fetching ${pageUrl}...`);
      const res = await fetch(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) {
        console.warn(`Failed to fetch ${pageUrl}: HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      const regex = /<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
      let match;

      while ((match = regex.exec(html)) !== null) {
        const rawUrl = match[1];
        if (/\.(jpg|jpeg|png|webp)/i.test(rawUrl)) {
          try {
            const fullUrl = new URL(rawUrl, pageUrl).href;
            if (visitedUrls.has(fullUrl)) continue;
            visitedUrls.add(fullUrl);

            const imgRes = await fetch(fullUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const parsedName = path.basename(new URL(fullUrl).pathname);
              const savePath = path.join(dir, `item_${totalDownloaded}_${parsedName}`);
              fs.writeFileSync(savePath, buf);
              console.log(`Downloaded: ${parsedName}`);
              totalDownloaded++;
            }
          } catch (err) {
            // ignore download error
          }
        }
      }
    } catch (e) {
      console.error(`Error on ${pageUrl}:`, e.message);
    }
  }

  console.log(`Done! Downloaded ${totalDownloaded} images to ayyan_images/`);
}

scrapeShopImages();
