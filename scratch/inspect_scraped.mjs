import fs from 'fs';
import path from 'path';

const scraped = JSON.parse(fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/scripts/ayyan-scraped.json', 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/scripts/wp-products.json', 'utf8'));
const publicProductsDir = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/products';
const productFiles = fs.readdirSync(publicProductsDir);

console.log('Scraped count:', scraped.length);
console.log('Sample scraped items:');
for (let i = 0; i < 15; i++) {
  console.log(`- ${scraped[i].rawAlt} -> ${scraped[i].originalUrl}`);
}

console.log('\nSample WP products:');
for (let i = 0; i < 15; i++) {
  console.log(`- ${wpProducts[i].name} -> ${wpProducts[i].images?.[0]?.src}`);
}
