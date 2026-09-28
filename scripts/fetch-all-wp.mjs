import fs from 'fs';

async function fetchAllWpData() {
  const allMedia = [];
  let page = 1;
  while (true) {
    try {
      const url = `https://ayyansworld.com/wp-json/wp/v2/media?per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        console.log(`Media page ${page} returned status ${res.status}, stopping.`);
        break;
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      
      for (const item of data) {
        allMedia.push({
          id: item.id,
          title: item.title?.rendered || '',
          alt: item.alt_text || '',
          source_url: item.source_url || '',
          media_details: {
            width: item.media_details?.width,
            height: item.media_details?.height,
            file: item.media_details?.file
          }
        });
      }
      console.log(`Fetched media page ${page}: ${data.length} items. Total: ${allMedia.length}`);
      page++;
    } catch (e) {
      console.error('Media fetch error:', e);
      break;
    }
  }

  // Also fetch store products
  const allStoreProducts = [];
  page = 1;
  while (true) {
    try {
      const url = `https://ayyansworld.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
      const res = await fetch(url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'application/json'
        }
      });
      if (!res.ok) {
        console.log(`Store products page ${page} returned status ${res.status}, stopping.`);
        break;
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;
      for (const p of data) {
        allStoreProducts.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          description: p.description,
          images: p.images?.map(img => ({ src: img.src, alt: img.alt, name: img.name }))
        });
      }
      console.log(`Fetched store products page ${page}: ${data.length} items. Total: ${allStoreProducts.length}`);
      page++;
    } catch (e) {
      console.error('Store products error:', e);
      break;
    }
  }

  fs.writeFileSync('scripts/wp-media.json', JSON.stringify(allMedia, null, 2));
  fs.writeFileSync('scripts/wp-products.json', JSON.stringify(allStoreProducts, null, 2));
  console.log(`Saved ${allMedia.length} media items and ${allStoreProducts.length} store products.`);
}

fetchAllWpData();
