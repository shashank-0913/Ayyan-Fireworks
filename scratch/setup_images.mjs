import fs from 'fs';
import path from 'path';

const baseDir = 'public/ayyan_images';
const catDir = path.join(baseDir, 'categories');
const prodDir = path.join(baseDir, 'products');

fs.mkdirSync(catDir, { recursive: true });
fs.mkdirSync(prodDir, { recursive: true });

// 1. Copy representative images to categories
const categorySources = {
  'sparklers.png': 'public/products/Twinkling-Star-120-cms.png',
  'chakkars.png': 'public/products/Ninja-Chakkar.png',
  'fountains.png': 'public/products/Mega-Peacock.png',
  'rockets.png': 'public/products/Rocket-Bomb.png',
  'aerial_shots.png': 'public/products/Ayyans-Power-60-shot-crackling.png',
  'gift_boxes.png': 'public/products/Gift-Box-B-28-items.png',
  'novelties.png': 'public/products/Pop-Pop.png'
};

for (const [destFile, srcFile] of Object.entries(categorySources)) {
  const destPath = path.join(catDir, destFile);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destPath);
    console.log(`Copied category visual: ${destFile} from ${srcFile}`);
  } else {
    console.warn(`Source category file not found: ${srcFile}`);
  }
}

// 2. Map known item codes to product photos
const itemImageMap = {
  '001': 'public/products/Ganesh-Crackers-10-Pkt.png',
  '002': 'public/products/Lakshmi-or-King-Carckers-10-Pkt.png',
  '003': 'public/products/Bird-Crackers-10-Pkt.png',
  '015': 'public/products/Twinkling-Star-45-Cms.png',
  '016': 'public/products/Twinkling-Star-60-cms.png',
  '017': 'public/products/Twinkling-Star-120-cms.png',
  '018': 'public/products/Twinkling-Star-120-cms.png',
  '024': 'public/products/Giant-Wheel-5-box.png',
  '025': 'public/products/Zodiac-Spinners-5-Pcs.png',
  '028': 'public/products/Ninja-Chakkar.png',
  '034': 'public/products/Flower-Pots-Special-10-box.png',
  '035': 'public/products/Flower-Pots-Special-10-box.png',
  '037': 'public/products/Flower-Pots-Special-10-box.png',
  '040': 'public/products/Mega-Peacock.png',
  '050': 'public/products/Chota-Bhai-Mini-Siren-5-Pcs.png',
  '054': 'public/products/Mega-Peacock.png',
  '055': 'public/products/Mega-Peacock.png',
  '056': 'public/products/Twinkling-Star-45-Cms.png',
  '058': 'public/products/Electric-Diamond.png',
  '059': 'public/products/Pencil.png',
  '060': 'public/products/Pencil.png',
  '063': 'public/products/Hydrogen-bomb-Foils.png',
  '065': 'public/products/Double-Sound-Crackers-10-Pkt.png',
  '066': 'public/products/Double-Sound-Crackers-10-Pkt.png',
  '067': 'public/products/Three-Sound-with-Colour-10-Pkt.png',
  '068': 'public/products/Ulta-Pulta-Flower-Bomb-5-Pcs.png',
  '070': 'public/products/Ulta-Pulta-Flower-Bomb-5-Pcs.png',
  '072': 'public/products/Loose-Crackers-Red-Bijili.png',
  '073': 'public/products/Multi-colour-Rocket-or-Flower-Missle.png',
  '074': 'public/products/Rocket-Bomb.png',
  '075': 'public/products/Multi-colour-Rocket-or-Flower-Missle.png',
  '079': 'public/products/40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg',
  '080': 'public/products/Parachute-Rocket.png',
  '083': 'public/products/Pop-Pop.png',
  '084': 'public/products/7-shots-red.jpg',
  '085': 'public/products/Seven-Shot-Gold-5-Pcs.png',
  '088': 'public/products/Super-Drone.png',
  '089': 'public/products/Funny-Bunny-10-Pcs.png',
  '093': 'public/products/Ninja-Chakkar.png',
  '094': 'public/products/Pogo-Silvergoldredviolet-2Pcs.png',
  '095': 'public/products/Pogo-gold.jpg',
  '101': 'public/products/Dekhe-Man-12-stars.png',
  '103': 'public/products/Pink-Panther-12-shot-pink.png',
  '106': 'public/products/Chal-Mere-Sath-25-shot.png',
  '107': 'public/products/Thor-Multi-Colour-Cracklings.png',
  '108': 'public/products/Dil-Maange-More-50-shot.png',
  '109': 'public/products/Balle-balle-soneri-barsath-25-shots-cracklin.png',
  '111': 'public/products/Daisy-Bees-12-shot-yellow.png',
  '112': 'public/products/Sky-Storm-12-shot-crackling.png',
  '118': 'public/products/Classic-Night-120-shot-four-colour.png',
  '120': 'public/products/Classic-Night-240-shot-four-colour.png',
  '133': 'public/products/Paris-Paris-3-inch-10-shots.png',
  '137': 'public/products/Gift-Box-A-24-items-by-customer.png',
  '138': 'public/products/Gift-Box-B-28-items.png',
  '139': 'public/products/40117583_1-ayyan-fireworks-crackers-assorted-box-c.jpg',
  '141': 'public/products/Gift-Box-Dino-40-items.png',
  '142': 'public/products/Camel-Dasara-10-colors-10-box.png',
  '143': 'public/products/Camel-Dasara-10-colors-10-box.png',
  '144': 'public/products/Pop-Pop.png',
  '151': 'public/products/amorces-roll-caps-ayyanfire-copy.png',
  '152': 'public/products/ayyan-ring-acp-with-gun-copy.png',
  '153': 'public/products/ayyan-ring-acp-with-gun-copy.png'
};

let copiedCount = 0;
for (const [code, src] of Object.entries(itemImageMap)) {
  if (fs.existsSync(src)) {
    const dest = path.join(prodDir, `${code}.jpg`);
    fs.copyFileSync(src, dest);
    copiedCount++;
  }
}

console.log(`Copied ${copiedCount} product specific photos to ${prodDir}!`);
