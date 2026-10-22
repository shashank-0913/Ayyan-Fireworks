import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/products');
console.log('Total files in public/products:', files.length);
files.forEach((f, i) => {
  console.log(`${i+1}. ${f}`);
});
