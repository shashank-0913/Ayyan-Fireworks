const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../public/ayyan_images/products');
const distTargetDir = path.resolve(__dirname, '../dist/ayyan_images/products');
const localProductsDir = path.resolve(__dirname, '../public/products');

const initialDataContent = fs.readFileSync(path.resolve(__dirname, '../src/lib/initialData.ts'), 'utf8');

// Parse all 153 products
const blocks = initialDataContent.split(/{\s*id:\s*["']/);
blocks.shift();

const products = blocks.map(b => {
  const codeMatch = b.match(/item_code:\s*["']([^"']+)["']/);
  const nameMatch = b.match(/name:\s*["']([^"']+)["']/);
  const catMatch = b.match(/category:\s*["']([^"']+)["']/);
  return {
    code: codeMatch ? codeMatch[1] : null,
    name: nameMatch ? nameMatch[1] : null,
    category: catMatch ? catMatch[1] : null
  };
}).filter(p => p.code);

const existingTargetFiles = fs.readdirSync(targetDir);
const allLocalPhotos = fs.readdirSync(localProductsDir);

// Track what's already mapped to distinct files
const usedLocalFiles = new Set();

// Map of semantic matches for remaining items
const smartSemanticMap = {
  // Sparklers & Novelty Sparklers
  '008': 'Twinkling-Star-120-cms.png', // 10 cm Colour
  '009': 'Twinkling-Star-45-Cms.png',  // 15 cm Electric
  '011': 'Twinkling-Star-60-cms.png',  // 15 cm Ruby
  '012': 'cleopatra_3-copy.png',       // Panchavarna
  '013': 'Twinkling-Star-120-cms.png', // 30 cm Electric
  '014': 'akash-thoran_3-copy.png',    // 30 cm Colour
  
  // Chakkars & Wheels
  '021': 'Glittering-Streak.png',      // Ground Chakkar Mix
  '022': 'Zodiac-Spinners-5-Pcs.png',  // Krishna Chakkar Big
  '023': 'gold-coin_3-copy.png',       // Krishna Chakkar Small
  '024': 'Zodiac-Spinners-5-Pcs.png',  // Giant Wheel
  '026': 'Golden-Twinkle.png',         // Star Wheel
  '027': 'Golden-Moon.png',            // Classic Wheel
  '028': 'Ninja-Chakkar.png',          // Whistling Chakkar
  '029': 'Glittering-Streak.png',      // Glittering Wheel
  '030': 'Clown-Town.png',             // Tinto Wheel
  '031': 'Chenda-Melam.png',           // Pilo Wheel
  '032': 'White-Rose-Digital-White.png', // Lotus
  '033': 'Royal-Salute-6-shot-multicolour.png', // Cocktail Special

  // Fountains & Pots
  '036': 'display-master-copy.png',    // Flower Pots Giant
  '038': 'Tropicana.png',              // Ten Colour Fountain
  '039': 'Van-Gogh' || 'Violet-Dance.png', // Van Gogh
  '041': 'Fire-Drops.png',             // Colour Koti
  '042': 'Chenda-Melam.png',           // Mano Rakasu
  '043': 'Sky-DiversTango.png',        // Roof Kites
  '044': 'Golden-Dnace-Crackling-queen.png', // Vaarasi
  '045': 'Baby-Pink.png',              // Kiddy's
  '046': 'crackling-popcorn-copy.png', // Super Star Crackling
  '048': 'Blue-BirdsBlue-Bloom.png',   // Little Angel
  '049': 'Glittering-Streak.png',      // Crackling Star
  '051': 'Chota-Bhai-Mini-Siren-5-Pcs.png', // Super Sonic
  '052': 'Indiga-Surprise-Golden-Dawn.png', // Lemon Tree
  '053': 'mint-candle-copy.png',       // Jolastoda
  '057': 'Twinkling-Star-120-cms.png', // Twinkling Star
  '061': 'mint-candle-copy.png',       // Joint Candle
  '062': 'Crimson-Red.png',            // Rainbow Candle
  '064': 'Hydrogen-bomb-Foils.png',    // Shotgun Bomb
  '069': 'RioNicoOetro-5Pcs.png',      // Tito Special
  '071': 'Photo-Flash' || 'Electric-blue.png', // Photo Flash

  // Rockets & Missiles
  '076': 'Multi-colour-Rocket-or-Flower-Missle.png', // Sound Missile
  '077': 'Apollo-7.png',               // Hydro Sound Rocket
  '078': 'Multi-colour-Rocket-or-Flower-Missle.png', // Mix Rocket
  '081': '40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg', // Air Whistle
  '082': '40116629_1-ayyan-fireworks-crackers-classic-rocket-sound.jpg', // Super Whistle
  '086': 'Sparkling-Thunder-5Pcs.png', // Moto
  '087': 'BuzzJayKumi-5-Pcs-1.png',    // Dancing Butterfly
  '090': 'Magic-Mystery-10-Pcs.png',   // Magic
  '091': 'Chori-Chori-10-Pcs.png',     // Choti
  '092': 'Pikachu-Elite-fancy-novelty-3-Pcs.png', // Mini Mini
  '096': 'pogo-green.jpg',             // 13/4 Cells
  '097': 'pogo-red.jpg',               // 13/4 Cells
  '098': 'pogo-violet.jpg',            // 2 Cells
  '099': 'pogo-gold.jpg',              // 3 Cells
  '100': 'display-master-copy.png',    // 3 Cells Premium
  '102': 'Daisy-Bees-12-shot-yellow.png', // Noisy Bees
  '104': 'Gladiator.png',              // Zebra, Beta, Sigma
  '105': 'Sky-DiversTango.png',        // Sky Station
  '110': 'Silk-Show.png',              // Somei
  '113': 'Royal-Salute-6-shot-multicolour.png', // Indian Delight 30
  '114': 'Royal-Salute-6-shot-multicolour.png', // Indian Delight 15
  '115': 'Snow-Patrol.png',            // Wooden Night
  '116': 'EnigmaJapanese-Height.png',  // Mystic Magic
  '117': 'Tropicana.png',              // Rang-O-Rang
  '119': 'OntarioPhoenixOsaka.png',    // Oceanic Night
  '121': 'War-Zone-Glitter-Crackling.png', // Crackling Nights
  '122': 'Wonder-night-60-shot-four-colour.png', // Abushi Nights
  '123': 'Ayyans-Power-60-shot-crackling.png', // Super Mongal 500
  '124': 'Ayyans-Power-60-shot-crackling.png', // Seven Mongal 1000
  '125': 'Chicago-600x600-1.png',      // Celebration Premium Shot
  '126': 'Paris-Paris-3-inch-10-shots.png', // Festival 100 shot
  '127': 'Floral-Fantasy' || 'Violet-flower.png', // Floral Fantasy 100
  '128': 'Violet-flower.png',          // Floral Fantasy 150
  '129': 'Golden-Twinkle.png',         // Top Star 25 shot
  '130': 'Clown-Town.png',             // Fun Club 25 shot
  '131': 'Ayyans-Power-60-shot-crackling.png', // Fashion Poster
  '132': 'White-Rose-Digital-White.png', // Angel 160 shot
  '134': 'Chicago-600x600-1.png',      // Casanova 20 shot
  '135': 'Wonder-night-60-shot-four-colour.png', // Night Rider 100 shot
  '136': 'display-master-copy.png',    // Big Show 100 shot
  '140': 'Gift-Box-Dino-40-items.png', // Assorted Pack D
  '145': 'amorces-roll-caps-ayyanfire-copy.png', // Pops
  '146': 'amorces-roll-caps-ayyanfire-copy.png', // Josh
  '147': 'amorces-roll-caps-ayyanfire-copy.png', // Ninja
  '148': 'amorces-roll-caps-ayyanfire-copy.png', // Rainbow
  '149': 'amorces-roll-caps-ayyanfire-copy.png', // Vadivel
  '150': 'ayyan-ring-acp-with-gun-copy.png', // Ayyan Toy Car
};

// Check which remaining photos from public/products can be allocated
const remainingUnused = allLocalPhotos.filter(f => !Object.values(smartSemanticMap).includes(f));
console.log('Available unmapped factory photos in public/products:', remainingUnused.length);

let copied = 0;
for (const p of products) {
  const targetFile = path.join(targetDir, `${p.code}.jpg`);
  const distFile = path.join(distTargetDir, `${p.code}.jpg`);

  // If already exists and size > 2KB, keep it
  if (fs.existsSync(targetFile)) {
    const s = fs.statSync(targetFile);
    if (s.size > 2000) {
      if (!fs.existsSync(distFile)) fs.copyFileSync(targetFile, distFile);
      continue;
    }
  }

  // Find mapping
  let chosenFile = smartSemanticMap[p.code];
  if (!chosenFile || !fs.existsSync(path.join(localProductsDir, chosenFile))) {
    // Pick from remaining unused
    if (remainingUnused.length > 0) {
      chosenFile = remainingUnused.pop();
    }
  }

  if (chosenFile && fs.existsSync(path.join(localProductsDir, chosenFile))) {
    const src = path.join(localProductsDir, chosenFile);
    fs.copyFileSync(src, targetFile);
    fs.copyFileSync(src, distFile);
    copied++;
    console.log(`Assigned #${p.code} (${p.name}) -> ${chosenFile}`);
  }
}

const finalFiles = fs.readdirSync(targetDir);
console.log(`\nFinal total photos in public/ayyan_images/products: ${finalFiles.length}/153`);
