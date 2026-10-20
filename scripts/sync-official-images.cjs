const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const targetDir = path.resolve(__dirname, '../public/ayyan_images/products');
const distTargetDir = path.resolve(__dirname, '../dist/ayyan_images/products');
const localProductsDir = path.resolve(__dirname, '../public/products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (!fs.existsSync(distTargetDir)) {
  fs.mkdirSync(distTargetDir, { recursive: true });
}

// 1. Live verified official Ayyan distributor assets from ayyansworld.com
const verifiedOnlineAssets = {
  '001': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ganesh-Crackers-10-Pkt.png',
  '002': 'https://ayyansworld.com/wp-content/uploads/2024/02/lakshmi-crackers.jpg',
  '004': 'https://ayyansworld.com/wp-content/uploads/2024/02/7-cm-Electric-Sparklers-10-box.png',
  '006': 'https://ayyansworld.com/wp-content/uploads/2024/02/10cm-Ruby-Sparklers-10-box.png',
  '007': 'https://ayyansworld.com/wp-content/uploads/2017/12/10cm-electric-sparklers.png',
  '010': 'https://ayyansworld.com/wp-content/uploads/2024/02/15cm-Coloured-Sparklers-10-box.png',
  '015': 'https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png',
  '019': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Big-25-pcs.png',
  '020': 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Special.png',
  '034': 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Big-600x600-1.png',
  '035': 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Special-600x600-1.png',
  '037': 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Deluxe-5-Pcs.png',
  '047': 'https://ayyansworld.com/wp-content/uploads/2024/02/DilSe.webp',
  '050': 'https://ayyansworld.com/wp-content/uploads/2024/02/Chota-Bhai-Mini-Siren-5-Pcs.png',
  '073': 'https://ayyansworld.com/wp-content/uploads/2024/02/Multi-colour-Rocket-or-Flower-Missle.png',
  '074': 'https://ayyansworld.com/wp-content/uploads/2024/02/Rocket-Bomb.png',
  '085': 'https://ayyansworld.com/wp-content/uploads/2024/02/Seven-Shot-Gold-5-Pcs.png',
  '137': 'https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-A-24-items-by-customer.png',
  '138': 'https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-B-28-items.png',
  '141': 'https://ayyansworld.com/wp-content/uploads/2024/02/Gift-Box-Dino-40-items.png',
};

// 2. Local verified factory box photos in public/products
const localProductMap = {
  '003': 'Bird-Crackers-10-Pkt.png',
  '016': 'Twinkling-Star-60-cms.png',
  '017': 'Twinkling-Star-120-cms.png',
  '018': 'Twinkling-Star-120-cms.png',
  '024': 'Giant-Wheel-5-box.png', // if available or fallback
  '025': 'Zodiac-Spinners-5-Pcs.png',
  '028': 'Ninja-Chakkar.png',
  '040': 'tri-colour-fountain-ayyanfire-copy.png',
  '054': 'Mega-Peacock.png',
  '055': 'Mega-Peacock.png',
  '058': 'Electric-Diamond.png',
  '059': 'Pencil.png',
  '060': 'Pencil.png',
  '063': 'Hydrogen-bomb-Foils.png',
  '065': 'Double-Sound-Crackers-10-Pkt.png',
  '066': 'Double-Sound-Crackers-10-Pkt.png',
  '067': 'Three-Sound-with-Colour-10-Pkt.png',
  '068': 'Ulta-Pulta-Flower-Bomb-5-Pcs.png',
  '070': 'Ulta-Pulta-Flower-Bomb-5-Pcs.png',
  '072': 'Loose-Crackers-Red-Bijili.png',
  '075': 'Multi-colour-Rocket-or-Flower-Missle.png',
  '079': '40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg',
  '080': 'Parachute-Rocket.png',
  '083': 'Pop-Pop.png',
  '084': '7-shots-red.jpg',
  '088': 'Super-Drone.png',
  '089': 'Funny-Bunny-10-Pcs.png',
  '093': 'Ninja-Chakkar.png',
  '094': 'Pogo-Silvergoldredviolet-2Pcs.png',
  '095': 'pogo-gold.jpg',
  '101': 'Dekhe-Man-12-stars.png',
  '103': 'Pink-Panther-12-shot-pink.png',
  '106': 'Chal-Mere-Sath-25-shot.png',
  '107': 'Thor-Multi-Colour-Cracklings.png',
  '108': 'Dil-Maange-More-50-shot.png',
  '109': 'Balle-balle-soneri-barsath-25-shots-cracklin.png',
  '111': 'Daisy-Bees-12-shot-yellow.png',
  '112': 'Sky-Storm-12-shot-crackling.png',
  '118': 'Classic-Night-120-shot-four-colour.png',
  '120': 'Classic-Night-240-shot-four-colour.png',
  '133': 'Paris-Paris-3-inch-10-shots.png',
  '139': '40117583_1-ayyan-fireworks-crackers-assorted-box-c.jpg',
  '142': 'Camel-Dasara-10-colors-10-box.png',
  '143': 'Camel-Dasara-10-colors-10-box.png',
  '151': 'amorces-roll-caps-ayyanfire-copy.png',
  '152': 'ayyan-ring-acp-with-gun-copy.png',
  '153': 'ayyan-ring-acp-with-gun-copy.png',
};

function downloadUrl(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadUrl(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stats = fs.statSync(dest);
            if (stats.size > 500) {
              // Copy to dist as well
              fs.copyFileSync(dest, path.join(distTargetDir, path.basename(dest)));
              resolve({ success: true, size: stats.size });
            } else {
              fs.unlink(dest, () => {});
              resolve({ success: false });
            }
          });
        });
      } else {
        resolve({ success: false, statusCode: res.statusCode });
      }
    }).on('error', () => resolve({ success: false }));
  });
}

async function run() {
  console.log('--- Syncing Local Photos ---');
  let localCount = 0;
  for (const [code, fileName] of Object.entries(localProductMap)) {
    const src = path.join(localProductsDir, fileName);
    if (fs.existsSync(src)) {
      const dest = path.join(targetDir, `${code}.jpg`);
      fs.copyFileSync(src, dest);
      fs.copyFileSync(src, path.join(distTargetDir, `${code}.jpg`));
      localCount++;
    }
  }
  console.log(`Synced ${localCount} local product photos.`);

  console.log('--- Downloading Online Verified Photos ---');
  let dlCount = 0;
  for (const [code, url] of Object.entries(verifiedOnlineAssets)) {
    const dest = path.join(targetDir, `${code}.jpg`);
    const res = await downloadUrl(url, dest);
    if (res.success) {
      console.log(`Saved SKU ${code}: ${path.basename(dest)} (${res.size} bytes)`);
      dlCount++;
    }
  }
  console.log(`Downloaded ${dlCount} verified images.`);

  const allImages = fs.readdirSync(targetDir);
  console.log(`\nTotal SKU images in ${targetDir}: ${allImages.length}`);
}

run();
