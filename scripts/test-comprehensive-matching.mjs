import fs from 'fs';

const wpMedia = JSON.parse(fs.readFileSync('scripts/wp-media.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('scripts/wp-products.json', 'utf8'));
const scraped = JSON.parse(fs.readFileSync('scripts/ayyan-scraped.json', 'utf8'));

// Build image lookup catalog from all official sources
const allOfficialSources = [];

// 1. From wpProducts
for (const p of wpProducts) {
  if (p.images && p.images.length > 0) {
    for (const img of p.images) {
      if (img.src && !img.src.includes('logo.png')) {
        allOfficialSources.push({
          name: p.name,
          sku: p.sku || '',
          src: img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1'),
          alt: img.alt || img.name || p.name
        });
      }
    }
  }
}

// 2. From scraped table
for (const s of scraped) {
  allOfficialSources.push({
    name: s.rawAlt,
    sku: '',
    src: s.originalUrl,
    alt: s.rawAlt
  });
}

// 3. From wpMedia
for (const m of wpMedia) {
  if (m.source_url && !m.source_url.includes('logo.png')) {
    allOfficialSources.push({
      name: m.title || m.alt || '',
      sku: '',
      src: m.source_url,
      alt: m.alt || m.title || ''
    });
  }
}

console.log('Total official image candidates compiled:', allOfficialSources.length);

// Read initialData.ts
const initialDataContent = fs.readFileSync('src/lib/initialData.ts', 'utf8');
const itemsBlocks = initialDataContent.split(/{\s*id:\s*'/).slice(1);
const products = [];

for (const block of itemsBlocks) {
  const fullBlock = "{ id: '" + block.split(/},\s*{/)[0];
  const idMatch = fullBlock.match(/id:\s*'([^']+)'/);
  const codeMatch = fullBlock.match(/code:\s*'([^']+)'/);
  const nameMatch = fullBlock.match(/name:\s*'([^']+)'/);
  const catMatch = fullBlock.match(/category:\s*'([^']+)'/);
  const priceMatch = fullBlock.match(/price:\s*([0-9.]+)/);

  if (idMatch && nameMatch) {
    products.push({
      id: idMatch[1],
      code: codeMatch ? codeMatch[1] : null,
      name: nameMatch[1],
      category: catMatch ? catMatch[1] : 'General',
      price: priceMatch ? Number(priceMatch[1]) : 0,
      fullBlock
    });
  }
}

console.log('Total products in catalogue:', products.length);

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const matched = [];
const remaining = [];

for (const p of products) {
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
      score = 90;
    } else {
      let matchedTokenCount = 0;
      for (const pt of pTokens) {
        if (sNorm.includes(pt)) matchedTokenCount++;
      }
      if (matchedTokenCount >= pTokens.length && pTokens.length > 0) {
        score = 80;
      } else if (matchedTokenCount >= 2) {
        score = 60 + (matchedTokenCount / pTokens.length) * 10;
      } else if (matchedTokenCount === 1 && pTokens.length === 1) {
        score = 70;
      }
    }

    if (score > highestScore && score >= 60) {
      highestScore = score;
      bestMatch = src;
    }
  }

  if (bestMatch) {
    matched.push({ product: p, image: bestMatch, score: highestScore });
  } else {
    remaining.push(p);
  }
}

console.log(`Matched: ${matched.length} / ${products.length} (${Math.round((matched.length / products.length) * 100)}%)`);
console.log(`Remaining: ${remaining.length}`);

console.log('Sample remaining:', remaining.slice(0, 15).map(r => `[${r.code}] ${r.name} (${r.category})`));
