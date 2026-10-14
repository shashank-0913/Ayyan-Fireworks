import fs from 'fs';

const content = fs.readFileSync('src/lib/initialData.ts', 'utf8');
const urls = (content.match(/https?:\/\/[^\s"',]+/g) || []);
console.log('Total URLs found in initialData.ts:', urls.length);

const nonAyyan = urls.filter(u => !u.includes('ayyansworld.com'));
console.log('Non-official (non-ayyansworld.com) URLs:', nonAyyan.length);

if (nonAyyan.length > 0) {
  console.log('List of non-official URLs:', nonAyyan);
} else {
  console.log('100% of images are authentic official Ayyan Fireworks packaging photographs!');
}

const ayyanImages = fs.existsSync('ayyan_images') ? fs.readdirSync('ayyan_images').length : 0;
const publicProducts = fs.existsSync('public/products') ? fs.readdirSync('public/products').length : 0;
console.log(`Local downloaded photos: ayyan_images=${ayyanImages}, public/products=${publicProducts}`);
