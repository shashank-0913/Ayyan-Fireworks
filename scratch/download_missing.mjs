import fs from 'fs';
import path from 'path';
import https from 'https';

const raw141 = [
  {"sno": 1, "name": "Ganesh Crackers", "packing": "1 pkt", "price": 62.0, "category": "Marrons"},
  {"sno": 2, "name": "Lakshmi Crackers", "packing": "1 pkt", "price": 35.0, "category": "Marrons"},
  {"sno": 3, "name": "Bird Crackers", "packing": "1 pkt", "price": 15.8, "category": "Marrons"},
  {"sno": 4, "name": "7 cm Electric Sparkler", "packing": "10 piece / box", "price": 19.6, "category": "Sparklers"},
  {"sno": 5, "name": "7 cm Colour Sparkler", "packing": "10 piece / box", "price": 22.95, "category": "Sparklers"},
  {"sno": 6, "name": "10 cm Ruby Sparkler", "packing": "10 piece / box", "price": 35.65, "category": "Sparklers"},
  {"sno": 7, "name": "10 cm Electric Sparkler", "packing": "10 piece / box", "price": 28.65, "category": "Sparklers"},
  {"sno": 8, "name": "10 cm Colour Sparkler", "packing": "10 piece / box", "price": 38.75, "category": "Sparklers"},
  {"sno": 9, "name": "15 cm Electric Sparkler", "packing": "10 piece / box", "price": 55.8, "category": "Sparklers"},
  {"sno": 10, "name": "15 cm Colour Sparkler", "packing": "10 piece / box", "price": 72.85, "category": "Sparklers"},
  {"sno": 11, "name": "15 cm Ruby Sparkler", "packing": "10 piece / box", "price": 60.5, "category": "Sparklers"},
  {"sno": 12, "name": "15 CM Panchavarnam 5 in 1", "packing": "10 piece / box", "price": 66.65, "category": "Sparklers"},
  {"sno": 13, "name": "30 cm Electric Sparkler", "packing": "5 piece / box", "price": 55.8, "category": "Sparklers"},
  {"sno": 14, "name": "30 cm Colour Sparkler", "packing": "5 piece / box", "price": 72.85, "category": "Sparklers"},
  {"sno": 15, "name": "50 cm Electric Sparkler", "packing": "5 piece / box", "price": 168.5, "category": "Sparklers"},
  {"sno": 16, "name": "50 cm Colour Sparkler", "packing": "5 piece / box", "price": 208.3, "category": "Sparklers"},
  {"sno": 17, "name": "75 cm Electric Sparkler", "packing": "5 piece / box", "price": 280.7, "category": "Sparklers"},
  {"sno": 18, "name": "75 cm Colour Sparkler", "packing": "5 piece / box", "price": 338.5, "category": "Sparklers"},
  {"sno": 19, "name": "Ground Chakkar Big", "packing": "25 piece / box", "price": 164.3, "category": "Chakkars"},
  {"sno": 20, "name": "Ground Chakkar Special", "packing": "10 piece / box", "price": 148.8, "category": "Chakkars"},
  {"sno": 21, "name": "Ground Chakkar Deluxe", "packing": "10 piece / box", "price": 208.3, "category": "Chakkars"},
  {"sno": 22, "name": "4\" Plastic Chakkar", "packing": "10 piece / box", "price": 302.25, "category": "Chakkars"},
  {"sno": 23, "name": "Super Deluxe Chakkar", "packing": "10 piece / box", "price": 240.25, "category": "Chakkars"},
  {"sno": 24, "name": "Spin-o-Magic", "packing": "10 piece / box", "price": 356.5, "category": "Chakkars"},
  {"sno": 25, "name": "Dynamite Wheel", "packing": "10 piece / box", "price": 372.0, "category": "Chakkars"},
  {"sno": 26, "name": "Disco Chakkar", "packing": "10 piece / box", "price": 170.5, "category": "Chakkars"},
  {"sno": 27, "name": "Golden Whistle Wheel", "packing": "5 piece / box", "price": 232.5, "category": "Chakkars"},
  {"sno": 28, "name": "Whistling Wheel", "packing": "5 piece / box", "price": 232.5, "category": "Chakkars"},
  {"sno": 29, "name": "Golden Globe", "packing": "1 piece / box", "price": 105.4, "category": "Chakkars"},
  {"sno": 30, "name": "Tri Colour Fountain", "packing": "5 piece / box", "price": 387.5, "category": "Fountains"},
  {"sno": 31, "name": "Flower Pots Big", "packing": "10 piece / box", "price": 155.0, "category": "Fountains"},
  {"sno": 32, "name": "Flower Pots Special", "packing": "10 piece / box", "price": 186.0, "category": "Fountains"},
  {"sno": 33, "name": "Flower Pots Ashoka", "packing": "10 piece / box", "price": 248.0, "category": "Fountains"},
  {"sno": 34, "name": "Colour Koti", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 35, "name": "Flower Pots Giant", "packing": "10 piece / box", "price": 403.0, "category": "Fountains"},
  {"sno": 36, "name": "Flower Pots Deluxe", "packing": "5 piece / box", "price": 310.0, "category": "Fountains"},
  {"sno": 37, "name": "Flower Pots Super Deluxe", "packing": "5 piece / box", "price": 356.5, "category": "Fountains"},
  {"sno": 38, "name": "Colour Changing Flower Pots", "packing": "10 piece / box", "price": 387.5, "category": "Fountains"},
  {"sno": 39, "name": "Pink Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 40, "name": "Orange Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 41, "name": "Yellow Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 42, "name": "Multi Colour Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 43, "name": "Violet Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 44, "name": "Green Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 45, "name": "Blue Flower Pots", "packing": "10 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 46, "name": "Golden Glitter Flower Pots", "packing": "10 piece / box", "price": 434.0, "category": "Fountains"},
  {"sno": 47, "name": "Silver Glitter Flower Pots", "packing": "10 piece / box", "price": 434.0, "category": "Fountains"},
  {"sno": 48, "name": "Crackling Flower Pots", "packing": "10 piece / box", "price": 434.0, "category": "Fountains"},
  {"sno": 49, "name": "12 in 1 Fountain", "packing": "12 piece / box", "price": 341.0, "category": "Fountains"},
  {"sno": 50, "name": "Gems Fountain", "packing": "5 piece / box", "price": 387.5, "category": "Fountains"},
  {"sno": 51, "name": "Ice Cream Fountain", "packing": "2 piece / box", "price": 372.0, "category": "Fountains"},
  {"sno": 52, "name": "Drone", "packing": "5 piece / box", "price": 279.0, "category": "NOVELTY FIREWORKS"},
  {"sno": 53, "name": "Helicopter", "packing": "5 piece / box", "price": 201.5, "category": "NOVELTY FIREWORKS"},
  {"sno": 54, "name": "Butterfly", "packing": "10 piece / box", "price": 279.0, "category": "NOVELTY FIREWORKS"},
  {"sno": 55, "name": "Bambaram (Top)", "packing": "10 piece / box", "price": 201.5, "category": "NOVELTY FIREWORKS"},
  {"sno": 56, "name": "Siru Malli (Pencil)", "packing": "10 piece / box", "price": 108.5, "category": "NOVELTY FIREWORKS"},
  {"sno": 57, "name": "Red & Green Torch (Pencil)", "packing": "5 piece / box", "price": 201.5, "category": "NOVELTY FIREWORKS"},
  {"sno": 58, "name": "Crackling Torch (Pencil)", "packing": "5 piece / box", "price": 201.5, "category": "NOVELTY FIREWORKS"},
  {"sno": 59, "name": "Mega Hydro Bomb", "packing": "10 piece / box", "price": 124.0, "category": "ATOM BOMBS"},
  {"sno": 60, "name": "Bullet Bomb", "packing": "10 piece / box", "price": 62.0, "category": "ATOM BOMBS"},
  {"sno": 61, "name": "Express", "packing": "1 piece / box", "price": 116.25, "category": "COMBINATION FIREWORKS"},
  {"sno": 62, "name": "Peacock Feather", "packing": "1 piece / box", "price": 403.0, "category": "COMBINATION FIREWORKS"},
  {"sno": 63, "name": "Peacock Dance", "packing": "1 piece / box", "price": 325.5, "category": "COMBINATION FIREWORKS"},
  {"sno": 64, "name": "Bada Peacock", "packing": "1 piece / box", "price": 635.5, "category": "COMBINATION FIREWORKS"},
  {"sno": 65, "name": "Star Express", "packing": "1 piece / box", "price": 248.0, "category": "COMBINATION FIREWORKS"},
  {"sno": 66, "name": "Selfie Stick", "packing": "1 piece / box", "price": 186.0, "category": "COMBINATION FIREWORKS"},
  {"sno": 67, "name": "Cocktail", "packing": "1 piece / box", "price": 294.5, "category": "COMBINATION FIREWORKS"},
  {"sno": 68, "name": "28 Chorsa", "packing": "1 pkt", "price": 27.9, "category": "CHORSA FIREWORKS"},
  {"sno": 69, "name": "Rocket Bomb", "packing": "10 piece / box", "price": 155.0, "category": "ROCKETS"},
  {"sno": 70, "name": "Lunik Rocket", "packing": "10 piece / box", "price": 201.5, "category": "ROCKETS"},
  {"sno": 71, "name": "Super Sound Rocket", "packing": "10 piece / box", "price": 232.5, "category": "ROCKETS"},
  {"sno": 72, "name": "Silver Shower Rocket", "packing": "10 piece / box", "price": 232.5, "category": "ROCKETS"},
  {"sno": 73, "name": "Golden Shower Rocket", "packing": "10 piece / box", "price": 232.5, "category": "ROCKETS"},
  {"sno": 74, "name": "Tri Colour Rocket", "packing": "10 piece / box", "price": 232.5, "category": "ROCKETS"},
  {"sno": 75, "name": "Sky Whistling Rocket", "packing": "10 piece / box", "price": 310.0, "category": "ROCKETS"},
  {"sno": 76, "name": "2 Sound Rocket", "packing": "10 piece / box", "price": 310.0, "category": "ROCKETS"},
  {"sno": 77, "name": "3 Sound Rocket", "packing": "10 piece / box", "price": 341.0, "category": "ROCKETS"},
  {"sno": 78, "name": "Signal Rocket (Red, Green)", "packing": "10 piece / box", "price": 341.0, "category": "ROCKETS"},
  {"sno": 79, "name": "Chotta Fancy", "packing": "1 piece / box", "price": 69.75, "category": "FANCY NOVELTIES"},
  {"sno": 80, "name": "2\" Magic Ball", "packing": "3 piece / box", "price": 279.0, "category": "FANCY NOVELTIES"},
  {"sno": 81, "name": "3\" Fancy Single", "packing": "1 piece / box", "price": 310.0, "category": "FANCY NOVELTIES"},
  {"sno": 82, "name": "3 1/2\" Fancy Single", "packing": "1 piece / box", "price": 403.0, "category": "FANCY NOVELTIES"},
  {"sno": 83, "name": "4\" Fancy Single", "packing": "1 piece / box", "price": 527.0, "category": "FANCY NOVELTIES"},
  {"sno": 84, "name": "4\" Fancy (2 pcs)", "packing": "2 piece / box", "price": 1054.0, "category": "FANCY NOVELTIES"},
  {"sno": 85, "name": "4\" Ultra Deluxe (2 pcs)", "packing": "2 piece / box", "price": 1395.0, "category": "FANCY NOVELTIES"},
  {"sno": 86, "name": "3\" Multicolour (3 pcs)", "packing": "3 piece / box", "price": 1023.0, "category": "FANCY NOVELTIES"},
  {"sno": 87, "name": "3 1/2\" Multicolour (3 pcs)", "packing": "3 piece / box", "price": 1395.0, "category": "FANCY NOVELTIES"},
  {"sno": 88, "name": "5\" Fancy Single", "packing": "1 piece / box", "price": 775.0, "category": "FANCY NOVELTIES"},
  {"sno": 89, "name": "6\" Fancy Single", "packing": "1 piece / box", "price": 1085.0, "category": "FANCY NOVELTIES"},
  {"sno": 90, "name": "7\" Fancy Single", "packing": "1 piece / box", "price": 1472.5, "category": "FANCY NOVELTIES"},
  {"sno": 91, "name": "8\" Fancy Single", "packing": "1 piece / box", "price": 1860.0, "category": "FANCY NOVELTIES"},
  {"sno": 92, "name": "1 3/4\" Shells (3 pcs)", "packing": "3 piece / box", "price": 434.0, "category": "ALL NEW 1 3/4\" SHELLS"},
  {"sno": 93, "name": "1 3/4\" Shells (6 pcs)", "packing": "6 piece / box", "price": 868.0, "category": "ALL NEW 1 3/4\" SHELLS"},
  {"sno": 94, "name": "2\" Fancy (3 pcs)", "packing": "3 piece / box", "price": 604.5, "category": "ALL NEW 2"},
  {"sno": 95, "name": "Sky Out (3 pcs)", "packing": "3 piece / box", "price": 1395.0, "category": "3 SHELLS ROCKING"},
  {"sno": 96, "name": "Top Gun (3 pcs)", "packing": "3 piece / box", "price": 1472.5, "category": "3 SHELLS PREMIUM"},
  {"sno": 97, "name": "12 Shot Rider", "packing": "1 piece / box", "price": 279.0, "category": "CAKE ITEMS"},
  {"sno": 98, "name": "15 Shot Multicolour", "packing": "1 piece / box", "price": 527.0, "category": "CAKE ITEMS"},
  {"sno": 99, "name": "30 Shot Multicolour", "packing": "1 piece / box", "price": 1054.0, "category": "CAKE ITEMS"},
  {"sno": 100, "name": "60 Shot Multicolour", "packing": "1 piece / box", "price": 2108.0, "category": "CAKE ITEMS"},
  {"sno": 101, "name": "120 Shot Multicolour", "packing": "1 piece / box", "price": 4216.0, "category": "CAKE ITEMS"},
  {"sno": 102, "name": "100 Shot Multicolour", "packing": "1 piece / box", "price": 4030.0, "category": "CAKE ITEMS"},
  {"sno": 103, "name": "240 Shot Multicolour", "packing": "1 piece / box", "price": 8680.0, "category": "CAKE ITEMS"},
  {"sno": 104, "name": "12 Shot Classic", "packing": "1 piece / box", "price": 418.5, "category": "CAKE ITEMS"},
  {"sno": 105, "name": "25 Shot Classic", "packing": "1 piece / box", "price": 930.0, "category": "CAKE ITEMS"},
  {"sno": 106, "name": "50 Shot Classic", "packing": "1 piece / box", "price": 1860.0, "category": "CAKE ITEMS"},
  {"sno": 107, "name": "12 Shot Super Classic", "packing": "1 piece / box", "price": 620.0, "category": "CAKE ITEMS"},
  {"sno": 108, "name": "25 Shot Super Classic", "packing": "1 piece / box", "price": 1395.0, "category": "CAKE ITEMS"},
  {"sno": 109, "name": "50 Shot Super Classic", "packing": "1 piece / box", "price": 2790.0, "category": "CAKE ITEMS"},
  {"sno": 110, "name": "12 Shot Signature", "packing": "1 piece / box", "price": 821.5, "category": "CAKE ITEMS"},
  {"sno": 111, "name": "25 Shot Signature", "packing": "1 piece / box", "price": 1782.5, "category": "CAKE ITEMS"},
  {"sno": 112, "name": "50 Shot Signature", "packing": "1 piece / box", "price": 3565.0, "category": "CAKE ITEMS"},
  {"sno": 113, "name": "25 Shot Festival", "packing": "1 piece / box", "price": 2170.0, "category": "CAKE ITEMS"},
  {"sno": 114, "name": "50 Shot Festival", "packing": "1 piece / box", "price": 4340.0, "category": "CAKE ITEMS"},
  {"sno": 115, "name": "100 Shot Festival", "packing": "1 piece / box", "price": 8680.0, "category": "CAKE ITEMS"},
  {"sno": 116, "name": "7 Shot Multicolour", "packing": "1 piece / box", "price": 170.5, "category": "CAKE ITEMS"},
  {"sno": 117, "name": "12 Shot Crackling", "packing": "1 piece / box", "price": 310.0, "category": "CAKE ITEMS"},
  {"sno": 118, "name": "15 Shot Crackling", "packing": "1 piece / box", "price": 589.0, "category": "CAKE ITEMS"},
  {"sno": 119, "name": "30 Shot Crackling", "packing": "1 piece / box", "price": 1178.0, "category": "CAKE ITEMS"},
  {"sno": 120, "name": "60 Shot Crackling", "packing": "1 piece / box", "price": 2356.0, "category": "CAKE ITEMS"},
  {"sno": 121, "name": "30 Shot Whistling", "packing": "1 piece / box", "price": 1395.0, "category": "CAKE ITEMS"},
  {"sno": 122, "name": "Sky Symphony (16 Shot)", "packing": "1 piece / box", "price": 930.0, "category": "CAKE ITEMS"},
  {"sno": 123, "name": "Carnival Lights (16 Shot)", "packing": "1 piece / box", "price": 930.0, "category": "CAKE ITEMS"},
  {"sno": 124, "name": "Colourful Fantasy (16 Shot)", "packing": "1 piece / box", "price": 930.0, "category": "CAKE ITEMS"},
  {"sno": 125, "name": "City of Lights (25 Shot)", "packing": "1 piece / box", "price": 1472.5, "category": "CAKE ITEMS"},
  {"sno": 126, "name": "Majestic Night (25 Shot)", "packing": "1 piece / box", "price": 1472.5, "category": "CAKE ITEMS"},
  {"sno": 127, "name": "Fireworks Fantasy (25 Shot)", "packing": "1 piece / box", "price": 1472.5, "category": "CAKE ITEMS"},
  {"sno": 128, "name": "Star Dust (36 Shot)", "packing": "1 piece / box", "price": 2015.0, "category": "CAKE ITEMS"},
  {"sno": 129, "name": "Golden Symphony (36 Shot)", "packing": "1 piece / box", "price": 2015.0, "category": "CAKE ITEMS"},
  {"sno": 130, "name": "Mystic Charm (36 Shot)", "packing": "1 piece / box", "price": 2015.0, "category": "CAKE ITEMS"},
  {"sno": 131, "name": "Arabian Nights (49 Shot)", "packing": "1 piece / box", "price": 3100.0, "category": "CAKE ITEMS"},
  {"sno": 132, "name": "Rainbow Wonder (49 Shot)", "packing": "1 piece / box", "price": 3100.0, "category": "CAKE ITEMS"},
  {"sno": 133, "name": "Golden Eye (19 Shot)", "packing": "1 piece / box", "price": 1085.0, "category": "CAKE ITEMS"},
  {"sno": 134, "name": "Crackling Waterfall", "packing": "1 piece / box", "price": 465.0, "category": "CAKE ITEMS"},
  {"sno": 135, "name": "Colour Smoke", "packing": "3 piece / box", "price": 310.0, "category": "CAKE ITEMS"},
  {"sno": 136, "name": "Popping Strips", "packing": "1 piece / box", "price": 46.5, "category": "CAKE ITEMS"},
  {"sno": 137, "name": "Match Box (10 in 1)", "packing": "10 in 1 box", "price": 77.5, "category": "ASSORTED GIFT PACKS"},
  {"sno": 138, "name": "Family Pack", "packing": "1 box", "price": 1550.0, "category": "ASSORTED GIFT PACKS"},
  {"sno": 139, "name": "Celebration Pack", "packing": "1 box", "price": 3100.0, "category": "ASSORTED GIFT PACKS"},
  {"sno": 140, "name": "Mega Delight", "packing": "1 box", "price": 5425.0, "category": "ASSORTED GIFT PACKS"},
  {"sno": 141, "name": "Royal Fiesta", "packing": "1 box", "price": 8525.0, "category": "ASSORTED GIFT PACKS"}
];

const publicProductsDir = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/products';
const ayyanImgsDir = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/public/ayyan_images/products';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
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

// Download list of scraped items that were missing from public/products
const downloads = [
  { file: '7cm-Coloured-Sparklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/7cm-Coloured-Sparklers-10-box.png' },
  { file: '10cm-Electric-Saprklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/10cm-Electric-Saprklers-10-box.png' },
  { file: '15cm-Electric-Saprklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/15cm-Electric-Saprklers-10-box.png' },
  { file: '15cm-Coloured-Sparklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/15cm-Coloured-Sparklers-10-box.png' },
  { file: '30cm-Electric-Saprklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/30cm-Electric-Saprklers-10-box.png' },
  { file: '30cm-Coloured-Sparklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/30cm-Coloured-Sparklers-10-box.png' },
  { file: '50cm-electric-sparklers.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/50cm-electric-sparklers.png' },
  { file: '50-cm-Coloured-Sparklers-10-box.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/50-cm-Coloured-Sparklers-10-box.png' },
  { file: 'Ground-Chakkar-Big-25-pcs.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Big-25-pcs.png' },
  { file: 'Ground-Chakkar-Special.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Ground-Chakkar-Special.png' },
  { file: '1696660841-AYYAN-Ground-Super-Deluxe.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/1696660841-AYYAN-Ground-Super-Deluxe.png' },
  { file: 'Whistling-Wheel.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Whistling-Wheel.png' },
  { file: 'Tri-Colour-Fountain-5-Pcs.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Tri-Colour-Fountain-5-Pcs.png' },
  { file: 'Flower-Pots-Red-1.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Red-1.png' },
  { file: 'Flower-Pots-Deluxe-5-Pcs.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Deluxe-5-Pcs.png' },
  { file: 'Flower-Pots-Special-600x600-1.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Special-600x600-1.png' },
  { file: 'Flower-Pots-Big-600x600-1.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Flower-Pots-Big-600x600-1.png' },
  { file: 'Shogun-Bomb.png', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/Shogun-Bomb.png' },
  { file: 'rio-wheel-1.jpg', url: 'https://ayyansworld.com/wp-content/uploads/2024/02/rio-wheel-1.jpg' }
];

async function run() {
  console.log('Downloading official Ayyan images...');
  for (const d of downloads) {
    const dest = path.join(publicProductsDir, d.file);
    if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
      try {
        await downloadFile(d.url, dest);
        console.log(`Downloaded: ${d.file}`);
      } catch (e) {
        console.warn(`Failed ${d.file}: ${e.message}`);
      }
    } else {
      console.log(`Already exists: ${d.file}`);
    }
  }
}

run();
