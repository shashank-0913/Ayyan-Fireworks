import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  { url: 'https://ayyansworld.com/wp-content/uploads/2024/02/7-cm-Electric-Sparklers-10-box.png', dest: 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/ayyan_images/products/004.jpg' },
  { url: 'https://ayyansworld.com/wp-content/uploads/2024/02/10cm-Ruby-Sparklers-10-box.png', dest: 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/ayyan_images/products/006.jpg' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const d of downloads) {
    try {
      await download(d.url, d.dest);
      console.log(`Downloaded to ${d.dest}`);
    } catch (e) {
      console.error(`Failed ${d.url}:`, e.message);
    }
  }
}

main();
