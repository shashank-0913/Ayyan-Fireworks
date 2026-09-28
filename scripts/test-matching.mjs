import fs from 'fs';

// Read scraped Ayyan products
const scraped = JSON.parse(fs.readFileSync('scripts/ayyan-scraped.json', 'utf8'));
console.log('Total scraped from ayyansworld.com:', scraped.length);

// Read initialData.ts
const initialDataContent = fs.readFileSync('src/lib/initialData.ts', 'utf8');

// Parse products from initialData.ts using regex
const productRegex = /{\s*id:\s*'([^']+)'[\s\S]*?name:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?price:\s*([0-9.]+)[\s\S]*?piece_count:\s*'([^']+)'[\s\S]*?}/g;

let match;
const products = [];
// Also extract code if present
const itemsBlocks = initialDataContent.split(/{\s*id:\s*'/).slice(1);

for (const block of itemsBlocks) {
  const fullBlock = "{ id: '" + block.split(/},\s*{/)[0];
  const idMatch = fullBlock.match(/id:\s*'([^']+)'/);
  const codeMatch = fullBlock.match(/code:\s*'([^']+)'/);
  const nameMatch = fullBlock.match(/name:\s*'([^']+)'/);
  const catMatch = fullBlock.match(/category:\s*'([^']+)'/);
  const priceMatch = fullBlock.match(/price:\s*([0-9.]+)/);
  const imgMatch = fullBlock.match(/image_url:\s*'([^']+)'/);

  if (idMatch && nameMatch) {
    products.push({
      id: idMatch[1],
      code: codeMatch ? codeMatch[1] : null,
      name: nameMatch[1],
      category: catMatch ? catMatch[1] : 'General',
      price: priceMatch ? Number(priceMatch[1]) : 0,
      image_url: imgMatch ? imgMatch[1] : ''
    });
  }
}

console.log('Parsed products from initialData.ts:', products.length);

function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical pack info e.g. (1 Box), (10 Pcs)
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let directMatches = 0;
let fuzzyMatches = 0;
const matchedPairs = [];
const unmatched = [];

for (const p of products) {
  const normP = normalizeName(p.name);
  
  // 1. Direct or normalized match
  let found = scraped.find(s => normalizeName(s.rawAlt) === normP);
  
  // 2. Substring or token overlap match
  if (!found) {
    const pTokens = normP.split(' ').filter(t => t.length > 2);
    found = scraped.find(s => {
      const normS = normalizeName(s.rawAlt);
      const sTokens = normS.split(' ').filter(t => t.length > 2);
      
      // If code in scraped alt matches
      if (p.code && normS.includes(p.code)) return true;
      
      // Token overlap
      const matchingTokens = pTokens.filter(t => normS.includes(t));
      return matchingTokens.length >= Math.min(2, pTokens.length) && (normS.includes(pTokens[0]) || pTokens.length === 1);
    });
  }

  if (found) {
    directMatches++;
    matchedPairs.push({ product: p, scraped: found });
  } else {
    unmatched.push(p);
  }
}

console.log(`Matched: ${directMatches} / ${products.length}`);
console.log(`Unmatched: ${unmatched.length}`);
console.log('Sample 10 matches:');
for (const m of matchedPairs.slice(0, 10)) {
  console.log(`- "${m.product.name}" (${m.product.category}) -> "${m.scraped.rawAlt}" | ${m.scraped.originalUrl}`);
}

console.log('Sample 10 unmatched:');
for (const u of unmatched.slice(0, 10)) {
  console.log(`- "${u.name}" (${u.category}) code: ${u.code}`);
}
