const fs = require('fs');
const path = require('path');

const wpMedia = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'wp-media.json'), 'utf8'));
const wpProducts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'wp-products.json'), 'utf8'));
const scraped = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ayyan-scraped.json'), 'utf8'));
const localFiles = fs.readdirSync(path.resolve(__dirname, '../public/products'));

const allUrls = new Set();
wpProducts.forEach(p => (p.images || []).forEach(img => img.src && allUrls.add(img.src.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1'))));
scraped.forEach(s => s.originalUrl && allUrls.add(s.originalUrl));
wpMedia.forEach(m => m.source_url && allUrls.add(m.source_url));

const items = [
  { code: '001', name: 'Ganesh-Crackers' },
  { code: '002', name: 'Lakshmi-Crackers' },
  { code: '004', name: '7cm-electric-sparklers' },
  { code: '005', name: '7cm-colour-sparklers' },
  { code: '006', name: '10cm-ruby-sparklers' },
  { code: '007', name: '10cm-electric-sparklers' },
  { code: '008', name: '10cm-colour-sparklers' },
  { code: '009', name: '15cm-electric-sparklers' },
  { code: '010', name: '15cm-colour-sparklers' },
  { code: '013', name: '30cm-electric-sparklers' },
  { code: '014', name: '30cm-colour-sparklers' },
  { code: '015', name: '50cm-electric-sparklers' },
  { code: '016', name: '50cm-colour-sparklers' },
  { code: '019', name: 'Ground-Chakkar-Big' },
  { code: '020', name: 'Ground-Chakkar-Special' },
  { code: '022', name: 'Krishna-Chakkar-Big' },
  { code: '024', name: 'Giant-Wheel' },
  { code: '034', name: 'Flower-Pots-Big' },
  { code: '035', name: 'Flower-Pots-Special' },
  { code: '037', name: 'Flower-Pots-Deluxe' },
  { code: '040', name: 'Colour-Koti' },
  { code: '047', name: 'Dil-Se' },
  { code: '050', name: 'Chota-Bhai' },
  { code: '051', name: 'Super-Sonic-Siren' },
  { code: '054', name: 'Peacock-Fountain' },
  { code: '063', name: 'Hydro-Bomb' },
  { code: '071', name: 'Photo-Flash' },
  { code: '073', name: 'Colour-Rocket' },
  { code: '074', name: 'Rocket-Bomb' },
  { code: '075', name: 'Flower-Missile' },
  { code: '084', name: 'Seven-Shot-Red' },
  { code: '085', name: 'Seven-Shot-Gold' },
  { code: '127', name: 'Floral-Fantasy' },
  { code: '134', name: 'Casanova' },
  { code: '135', name: 'Night-Rider' },
  { code: '137', name: 'Assorted-Gift-Box-A' }
];

const matches = [];

items.forEach(it => {
  const clean = it.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const localMatch = localFiles.find(f => {
    const cf = f.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cf.includes(clean);
  });

  const urlList = Array.from(allUrls);
  const urlMatch = urlList.find(u => {
    const cu = path.basename(u).toLowerCase().replace(/[^a-z0-9]/g, '');
    return cu.includes(clean);
  });

  matches.push({
    code: it.code,
    name: it.name,
    local: localMatch || null,
    url: urlMatch || null
  });
  console.log(`${it.code} (${it.name}) -> Local: ${localMatch || 'NONE'} | URL: ${urlMatch || 'NONE'}`);
});
