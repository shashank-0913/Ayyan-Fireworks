import fs from 'fs';
import path from 'path';

const productsDir = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/products';
const ayyanImgsDir = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/ayyan_images/products';

const productFiles = fs.readdirSync(productsDir);
const ayyanFiles = fs.readdirSync(ayyanImgsDir);

const productSizes = {};
for (const f of productFiles) {
  const stat = fs.statSync(path.join(productsDir, f));
  productSizes[stat.size] = f;
}

const mapping = {};
for (const af of ayyanFiles) {
  const stat = fs.statSync(path.join(ayyanImgsDir, af));
  const matched = productSizes[stat.size];
  mapping[af] = matched || 'unknown';
}

console.log('Mapping of ayyan_images/products to public/products:');
for (let i = 1; i <= 60; i++) {
  const code = String(i).padStart(3, '0') + '.jpg';
  console.log(`${code} -> ${mapping[code]}`);
}
