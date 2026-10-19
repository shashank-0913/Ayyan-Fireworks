import fs from 'fs';

const content = fs.readFileSync('src/lib/initialData.ts', 'utf8');
const matches = content.match(/item_code:\s*["'](\d+)["']/g);
console.log('Total items matched in initialData.ts:', matches ? matches.length : 0);
if (matches) {
  console.log('First item:', matches[0]);
  console.log('Last item:', matches[matches.length - 1]);
}
