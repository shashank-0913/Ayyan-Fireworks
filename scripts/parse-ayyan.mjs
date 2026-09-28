import fs from 'fs';

async function parseAllAyyanItems() {
  const res = await fetch('https://ayyansworld.com/shop/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  // Extract all table rows
  const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  console.log('Total TRs:', trMatches.length);

  const parsedItems = [];
  let currentCategory = 'General';

  for (const tr of trMatches) {
    // Check if category header row
    const catMatch = tr.match(/<h3[^>]*>([^<]+)<\/h3>/i) || tr.match(/<td[^>]*class="newcatvar"[^>]*>([^<]+)<\/td>/i);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    // Extract image tag
    const imgMatch = tr.match(/<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"[^>]*>/i)
      || tr.match(/<img[^>]*alt="([^">]*)"[^>]+src="([^">]+)"[^>]*>/i);
    
    if (imgMatch) {
      let src = '';
      let alt = '';
      if (imgMatch[1].startsWith('http')) {
        src = imgMatch[1];
        alt = imgMatch[2];
      } else {
        alt = imgMatch[1];
        src = imgMatch[2];
      }

      // Ignore logo or decorative images
      if (src.includes('logo.png') || !alt.trim()) continue;

      // Clean image URL to get full-resolution original
      const originalUrl = src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1');

      // Extract table cells text
      const tdMatches = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

      parsedItems.push({
        rawAlt: alt.trim(),
        category: currentCategory,
        thumbUrl: src,
        originalUrl: originalUrl,
        cells: tdMatches
      });
    }
  }

  console.log(`Parsed ${parsedItems.length} official items from ayyansworld.com!`);
  fs.writeFileSync('scripts/ayyan-scraped.json', JSON.stringify(parsedItems, null, 2));
  console.log('Sample 10 items:', JSON.stringify(parsedItems.slice(0, 10), null, 2));
}

parseAllAyyanItems();
