import fs from 'fs';
import path from 'path';

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
  {"sno": 51, "name": "Ice Cream Fountain", "2 piece / box": "2 piece / box", "price": 372.0, "category": "Fountains", "packing": "2 piece / box"},
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

function getSoundLevel(cat, name) {
  const c = cat.toLowerCase();
  const n = name.toLowerCase();
  if (c.includes('sparkler') || n.includes('sparkler') || n.includes('smoke') || n.includes('pencil') || n.includes('candle')) {
    return 'Low / Silent';
  }
  if (c.includes('bomb') || c.includes('marron') || c.includes('rocket') || n.includes('bomb') || n.includes('sound') || n.includes('thunder')) {
    return 'High Spectacle';
  }
  return 'Medium';
}

const headerCode = `import { Slot, Booking, SoundLevel } from '../types';

// =============================================================================
// AYYAN FIREWORKS FACTORY — VERIFIED 141-ITEM SHOWROOM INVENTORY & PRICELIST
// Official Sivakasi Bunny Brand Green Crackers Catalogue (001 - 141)
// =============================================================================

export interface Product {
  id: string;
  item_code: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  packing?: string;
  pieces_per_box?: string;
  piece_count?: string;
  video_url?: string;
  image_url?: string;
  code?: string;
  unit_price?: number;
  unit_name?: string;
  bundle_rate?: number;
  bundle_unit?: string;
  unit_breakdown?: string;
  description?: string;
  telugu_name?: string;
  safety_instructions?: string;
  safety_tags?: string[];
  sound_level?: SoundLevel;
  image?: string;
  imageUrl?: string;
  is_active?: boolean;
  inStock?: boolean;
  created_at?: string;
}

export type ProductItem = Product;

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Marrons': '/ayyan_images/categories/sparklers.png',
  'Sparklers': '/ayyan_images/categories/sparklers.png',
  'Chakkars': '/ayyan_images/categories/chakkars.png',
  'Ground Chakkars': '/ayyan_images/categories/chakkars.png',
  'Fountains': '/ayyan_images/categories/fountains.png',
  'Colourful Fountains': '/ayyan_images/categories/fountains.png',
  'NOVELTY FIREWORKS': '/ayyan_images/categories/novelties.png',
  'Novelty Fireworks': '/ayyan_images/categories/novelties.png',
  'ATOM BOMBS': '/ayyan_images/categories/rockets.png',
  'Atom Bombs': '/ayyan_images/categories/rockets.png',
  'CHORSA FIREWORKS': '/ayyan_images/categories/sparklers.png',
  'Chorsa Fireworks': '/ayyan_images/categories/sparklers.png',
  'ROCKETS': '/ayyan_images/categories/rockets.png',
  'Rockets': '/ayyan_images/categories/rockets.png',
  'Sky Rockets': '/ayyan_images/categories/rockets.png',
  'FANCY NOVELTIES': '/ayyan_images/categories/novelties.png',
  'Fancy Novelties': '/ayyan_images/categories/novelties.png',
  'ALL NEW 1 3/4" SHELLS': '/ayyan_images/categories/aerial_shots.png',
  'ALL NEW 2': '/ayyan_images/categories/aerial_shots.png',
  '3 SHELLS ROCKING': '/ayyan_images/categories/aerial_shots.png',
  '3 SHELLS PREMIUM': '/ayyan_images/categories/aerial_shots.png',
  'Aerial Shells': '/ayyan_images/categories/aerial_shots.png',
  'COMBINATION FIREWORKS': '/ayyan_images/categories/aerial_shots.png',
  'Combination Fireworks': '/ayyan_images/categories/aerial_shots.png',
  'CAKE ITEMS': '/ayyan_images/categories/aerial_shots.png',
  'Cake Items': '/ayyan_images/categories/aerial_shots.png',
  'Aerial Multi-Shots': '/ayyan_images/categories/aerial_shots.png',
  'ASSORTED GIFT PACKS': '/ayyan_images/categories/gift_boxes.png',
  'Assorted Gift Packs': '/ayyan_images/categories/gift_boxes.png',
  'Gift Boxes': '/ayyan_images/categories/gift_boxes.png',
  'Novelties': '/ayyan_images/categories/novelties.png'
};

export const getCategoryFallbackImage = (category?: string): string => {
  if (!category) return '/ayyan-emblem.png';
  if (CATEGORY_FALLBACK_IMAGES[category]) return CATEGORY_FALLBACK_IMAGES[category];
  
  const c = category.toLowerCase();
  if (c.includes('sparkler') || c.includes('marron') || c.includes('chorsa')) return '/ayyan_images/categories/sparklers.png';
  if (c.includes('chakkar') || c.includes('wheel')) return '/ayyan_images/categories/chakkars.png';
  if (c.includes('fountain') || c.includes('pot')) return '/ayyan_images/categories/fountains.png';
  if (c.includes('rocket') || c.includes('bomb')) return '/ayyan_images/categories/rockets.png';
  if (c.includes('aerial') || c.includes('shot') || c.includes('shell') || c.includes('cake') || c.includes('combination') || c.includes('cell')) return '/ayyan_images/categories/aerial_shots.png';
  if (c.includes('gift')) return '/ayyan_images/categories/gift_boxes.png';
  if (c.includes('novelty') || c.includes('novelties') || c.includes('match') || c.includes('cap') || c.includes('gun') || c.includes('toy')) return '/ayyan_images/categories/novelties.png';
  
  return '/ayyan-emblem.png';
};

export const getCategoryBadgeStyle = (category?: string): string => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('marron')) return 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300';
  if (cat.includes('sparkler')) return 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-gold-300';
  if (cat.includes('chakkar')) return 'bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-300';
  if (cat.includes('fountain')) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
  if (cat.includes('bomb')) return 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300';
  if (cat.includes('chorsa')) return 'bg-pink-500/15 border-pink-500/30 text-pink-700 dark:text-pink-300';
  if (cat.includes('rocket')) return 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300';
  if (cat.includes('fancy novelties')) return 'bg-teal-500/15 border-teal-500/30 text-teal-700 dark:text-teal-300';
  if (cat.includes('shell') || cat.includes('cell') || cat === 'all new 2') return 'bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300';
  if (cat.includes('combination')) return 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300';
  if (cat.includes('cake')) return 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300';
  if (cat.includes('gift')) return 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-200';
  return 'bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300';
};

export const getProductImageUrl = (item_code: string, _category?: string): string => {
  return \`/ayyan_images/products/\${item_code}.jpg\`;
};

export const initialProducts: Product[] = [
`;

const productsCode = raw141.map(item => {
  const itemCode = String(item.sno).padStart(3, '0');
  const soundLevel = getSoundLevel(item.category, item.name);
  const origPrice = Math.round(item.price * 1.25 * 100) / 100;

  return `  {
    id: 'ayyan-${item.sno}',
    item_code: '${itemCode}',
    code: '${itemCode}',
    name: ${JSON.stringify(item.name)},
    category: ${JSON.stringify(item.category)},
    price: ${item.price.toFixed(2)},
    original_price: ${origPrice.toFixed(2)},
    packing: ${JSON.stringify(item.packing)},
    pieces_per_box: ${JSON.stringify(item.packing)},
    piece_count: ${JSON.stringify(item.packing)},
    sound_level: '${soundLevel}',
    image_url: '/ayyan_images/products/${itemCode}.jpg',
    image: '/ayyan_images/products/${itemCode}.jpg',
    imageUrl: '/ayyan_images/products/${itemCode}.jpg',
    is_active: true,
    inStock: true
  }`;
}).join(',\n');

const footerCode = `
];

// Alias for codebase compatibility
export const INITIAL_PRODUCTS: Product[] = initialProducts;

// Helper date offset function
export const getFormattedDateOffset = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Seed Slot generation for showroom visitations (Visakhapatnam showroom)
export const generateInitialSlots = (): Slot[] => {
  const slots: Slot[] = [];
  const today = new Date();

  for (let d = 0; d < 14; d++) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + d);
    const dateStr = slotDate.toISOString().split('T')[0];

    const hours = [
      { start: '08:00:00', end: '09:00:00', cap: 120 },
      { start: '09:00:00', end: '10:00:00', cap: 120 },
      { start: '10:00:00', end: '11:00:00', cap: 120 },
      { start: '11:00:00', end: '12:00:00', cap: 120 },
      { start: '12:00:00', end: '13:00:00', cap: 120 },
      { start: '14:00:00', end: '15:00:00', cap: 120 },
      { start: '15:00:00', end: '16:00:00', cap: 120 },
      { start: '16:00:00', end: '17:00:00', cap: 120 },
      { start: '17:00:00', end: '18:00:00', cap: 120 },
      { start: '18:00:00', end: '19:00:00', cap: 120 },
      { start: '19:00:00', end: '20:00:00', cap: 120 },
      { start: '20:00:00', end: '21:00:00', cap: 120 },
      { start: '21:00:00', end: '22:00:00', cap: 120 }
    ];

    hours.forEach((h, index) => {
      slots.push({
        id: \`slot-\${dateStr}-\${index}\`,
        slot_date: dateStr,
        start_time: h.start,
        end_time: h.end,
        total_capacity: h.cap,
        booked_capacity: 0,
        is_blocked: false,
        created_at: new Date().toISOString()
      });
    });
  }

  return slots;
};

export const generateInitialBookings = (_slots?: Slot[]): Booking[] => {
  return [];
};
`;

const completeFile = headerCode + productsCode + footerCode;
const targetPath = 'c:/Users/Shash/OneDrive/Desktop/my space/ayyan/src/lib/initialData.ts';
fs.writeFileSync(targetPath, completeFile, 'utf8');
console.log('Successfully wrote src/lib/initialData.ts with', raw141.length, 'verified products!');
