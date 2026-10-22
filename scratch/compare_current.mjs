import fs from 'fs';

const initialDataText = fs.readFileSync('c:/Users/Shash/OneDrive/Desktop/my space/ayyan/src/lib/initialData.ts', 'utf8');

// Extract all items from initialProducts
const regex = /{\s*id:\s*['"]([^'"]+)['"],\s*item_code:\s*['"]([^'"]+)['"],[\s\S]*?name:\s*['"]([^'"]+)['"],[\s\S]*?category:\s*['"]([^'"]+)['"],[\s\S]*?price:\s*([\d.]+),/g;

let match;
const currentItems = [];
while ((match = regex.exec(initialDataText)) !== null) {
  currentItems.push({
    id: match[1],
    item_code: match[2],
    name: match[3],
    category: match[4],
    price: parseFloat(match[5])
  });
}

console.log('Current items in initialData.ts count:', currentItems.length);
console.log('First 25 items:');
currentItems.slice(0, 25).forEach(c => console.log(`${c.item_code}: ${c.name} (${c.category}) - ₹${c.price}`));
console.log('Items 25-40:');
currentItems.slice(25, 40).forEach(c => console.log(`${c.item_code}: ${c.name} (${c.category}) - ₹${c.price}`));
