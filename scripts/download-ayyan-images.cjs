const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const targetDir = path.resolve(__dirname, '../public/ayyan_images/products');
const distTargetDir = path.resolve(__dirname, '../dist/ayyan_images/products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
if (fs.existsSync(path.resolve(__dirname, '../dist')) && !fs.existsSync(distTargetDir)) {
  fs.mkdirSync(distTargetDir, { recursive: true });
}

// Direct authentic Ayyan / Bunny Brand product image assets from official distributor catalog
const officialAyyanImageMap = {
  '001': 'https://ayyansworld.com/wp-content/uploads/2021/08/Ganesh-Crackers.jpg',
  '002': 'https://ayyansworld.com/wp-content/uploads/2021/08/Lakshmi-Crackers.jpg',
  '004': 'https://ayyansworld.com/wp-content/uploads/2021/08/7cm-electric-sparklers.jpg',
  '005': 'https://ayyansworld.com/wp-content/uploads/2021/08/7cm-colour-sparklers.jpg',
  '006': 'https://ayyansworld.com/wp-content/uploads/2021/08/10cm-ruby-sparklers.jpg',
  '007': 'https://ayyansworld.com/wp-content/uploads/2021/08/10cm-electric-sparklers.jpg',
  '008': 'https://ayyansworld.com/wp-content/uploads/2021/08/10cm-colour-sparklers.jpg',
  '009': 'https://ayyansworld.com/wp-content/uploads/2021/08/15cm-electric-sparklers.jpg',
  '010': 'https://ayyansworld.com/wp-content/uploads/2021/08/15cm-colour-sparklers.jpg',
  '013': 'https://ayyansworld.com/wp-content/uploads/2021/08/30cm-electric-sparklers.jpg',
  '014': 'https://ayyansworld.com/wp-content/uploads/2021/08/30cm-colour-sparklers.jpg',
  '015': 'https://ayyansworld.com/wp-content/uploads/2021/08/50cm-electric-sparklers.jpg',
  '016': 'https://ayyansworld.com/wp-content/uploads/2021/08/50cm-colour-sparklers.jpg',
  '019': 'https://ayyansworld.com/wp-content/uploads/2021/08/Ground-Chakkar-Big.jpg',
  '020': 'https://ayyansworld.com/wp-content/uploads/2021/08/Ground-Chakkar-Special.jpg',
  '022': 'https://ayyansworld.com/wp-content/uploads/2021/08/Krishna-Chakkar-Big.jpg',
  '024': 'https://ayyansworld.com/wp-content/uploads/2021/08/Giant-Wheel.jpg',
  '034': 'https://ayyansworld.com/wp-content/uploads/2021/08/Flower-Pots-Big.jpg',
  '035': 'https://ayyansworld.com/wp-content/uploads/2021/08/Flower-Pots-Special.jpg',
  '037': 'https://ayyansworld.com/wp-content/uploads/2021/08/Flower-Pots-Deluxe.jpg',
  '040': 'https://ayyansworld.com/wp-content/uploads/2021/08/Colour-Koti.jpg',
  '047': 'https://ayyansworld.com/wp-content/uploads/2021/08/Dil-Se.jpg',
  '050': 'https://ayyansworld.com/wp-content/uploads/2021/08/Chota-Bhai.jpg',
  '051': 'https://ayyansworld.com/wp-content/uploads/2021/08/Super-Sonic-Siren.jpg',
  '054': 'https://ayyansworld.com/wp-content/uploads/2021/08/Peacock-Fountain.jpg',
  '063': 'https://ayyansworld.com/wp-content/uploads/2021/08/Hydro-Bomb.jpg',
  '071': 'https://ayyansworld.com/wp-content/uploads/2021/08/Photo-Flash.jpg',
  '073': 'https://ayyansworld.com/wp-content/uploads/2021/08/Colour-Rocket.jpg',
  '074': 'https://ayyansworld.com/wp-content/uploads/2021/08/Rocket-Bomb.jpg',
  '075': 'https://ayyansworld.com/wp-content/uploads/2021/08/Flower-Missile.jpg',
  '084': 'https://ayyansworld.com/wp-content/uploads/2021/08/Seven-Shot-Red.jpg',
  '085': 'https://ayyansworld.com/wp-content/uploads/2021/08/Seven-Shot-Gold.jpg',
  '127': 'https://ayyansworld.com/wp-content/uploads/2021/08/Floral-Fantasy.jpg',
  '134': 'https://ayyansworld.com/wp-content/uploads/2021/08/Casanova.jpg',
  '135': 'https://ayyansworld.com/wp-content/uploads/2021/08/Night-Rider.jpg',
  '137': 'https://ayyansworld.com/wp-content/uploads/2021/08/Assorted-Gift-Box-A.jpg',
};

function downloadUrl(url, dest) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };

    client.get(url, options, (response) => {
      // Follow redirect if 301 or 302
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadUrl(response.headers.location, dest).then(resolve);
      }

      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stats = fs.statSync(dest);
            if (stats.size > 500) {
              console.log(`Saved: ${path.basename(dest)} (${stats.size} bytes)`);
              // Sync to dist if it exists
              if (fs.existsSync(distTargetDir)) {
                fs.copyFileSync(dest, path.join(distTargetDir, path.basename(dest)));
              }
              resolve({ code: path.basename(dest, '.jpg'), success: true, size: stats.size });
            } else {
              // Too small, likely an error response
              fs.unlink(dest, () => {});
              console.warn(`File too small, rejected: ${path.basename(dest)} (${stats.size} bytes)`);
              resolve({ code: path.basename(dest, '.jpg'), success: false, status: 'too_small' });
            }
          });
        });
        file.on('error', (err) => {
          fs.unlink(dest, () => {});
          resolve({ code: path.basename(dest, '.jpg'), success: false, error: err.message });
        });
      } else {
        console.warn(`HTTP ${response.statusCode} for ${url}`);
        resolve({ code: path.basename(dest, '.jpg'), success: false, statusCode: response.statusCode });
      }
    }).on('error', (err) => {
      console.error(`Request error for ${url}:`, err.message);
      resolve({ code: path.basename(dest, '.jpg'), success: false, error: err.message });
    });
  });
}

async function main() {
  console.log(`Starting download of ${Object.keys(officialAyyanImageMap).length} official Ayyan cracker images...`);
  const tasks = Object.entries(officialAyyanImageMap).map(([code, url]) => {
    const dest = path.join(targetDir, `${code}.jpg`);
    return downloadUrl(url, dest);
  });

  const results = await Promise.all(tasks);
  const successful = results.filter(r => r.success);
  console.log(`\nCompleted! Successfully downloaded ${successful.length}/${results.length} images.`);
}

main();
