import fs from 'fs';
import path from 'path';

const scraped = JSON.parse(fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/scripts/ayyan-scraped.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/scripts/wp-products.json', 'utf8'));
const wpMedia = JSON.parse(fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/scripts/wp-media.json', 'utf8'));
const publicFiles = fs.readdirSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/products');

console.log('Scraped:', scraped.length);
console.log('WP Products:', wpProducts.length);
console.log('WP Media:', wpMedia.length);
console.log('Public Products:', publicFiles.length);

// Print all unique titles in WP products
console.log('\n--- All WP product names ---');
wpProducts.forEach((p, idx) => {
  console.log(`${idx+1}. ${p.name} | ${p.images?.[0]?.src}`);
});
