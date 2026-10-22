import { Slot, Booking, SoundLevel } from '../types';

// =============================================================================
// AYYAN FIREWORKS FACTORY — STANDARDIZED SHOWROOM INVENTORY (153 SKUs)
// Official Sivakasi Bunny Brand Green Crackers Catalogue
// Latest Website Item Modification List (001 - 153)
// =============================================================================

export interface Product {
  id: string;
  item_code: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  pieces_per_box?: string;
  video_url?: string;
  image_url?: string;
  code?: string;
  piece_count?: string;
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
  return `/ayyan_images/products/${item_code}.jpg`;
};

export const initialProducts: Product[] = [
  // --- MARRONS (001 - 003) ---
  {
    id: 'item_001',
    item_code: '001',
    code: '001',
    name: 'Ganesh Crackers',
    category: 'Marrons',
    price: 62.00,
    pieces_per_box: '1 pkt',
    piece_count: '1 pkt',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/001.jpg',
    is_active: true
  },
  {
    id: 'item_002',
    item_code: '002',
    code: '002',
    name: 'Lakshmi Crackers',
    category: 'Marrons',
    price: 35.00,
    pieces_per_box: '1 pkt',
    piece_count: '1 pkt',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/002.jpg',
    is_active: true
  },
  {
    id: 'item_003',
    item_code: '003',
    code: '003',
    name: 'Bird Crackers',
    category: 'Marrons',
    price: 15.80,
    pieces_per_box: '1 pkt',
    piece_count: '1 pkt',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/003.jpg',
    is_active: true
  },

  // --- SPARKLERS (004 - 018) ---
  {
    id: 'item_004',
    item_code: '004',
    code: '004',
    name: '7 cm Electric Sparkler',
    category: 'Sparklers',
    price: 19.60,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/004.jpg',
    is_active: true
  },
  {
    id: 'item_005',
    item_code: '005',
    code: '005',
    name: '7 cm Colour Sparkler',
    category: 'Sparklers',
    price: 22.95,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/005.jpg',
    is_active: true
  },
  {
    id: 'item_006',
    item_code: '006',
    code: '006',
    name: '10 cm Ruby Sparkler',
    category: 'Sparklers',
    price: 35.65,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/006.jpg',
    is_active: true
  },
  {
    id: 'item_007',
    item_code: '007',
    code: '007',
    name: '10 cm Electric Sparkler',
    category: 'Sparklers',
    price: 28.65,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/007.jpg',
    is_active: true
  },
  {
    id: 'item_008',
    item_code: '008',
    code: '008',
    name: '10 cm Colour Sparkler',
    category: 'Sparklers',
    price: 38.75,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/008.jpg',
    is_active: true
  },
  {
    id: 'item_009',
    item_code: '009',
    code: '009',
    name: '15 cm Electric Sparkler',
    category: 'Sparklers',
    price: 55.80,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/009.jpg',
    is_active: true
  },
  {
    id: 'item_010',
    item_code: '010',
    code: '010',
    name: '15 cm Colour Sparkler',
    category: 'Sparklers',
    price: 72.85,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/010.jpg',
    is_active: true
  },
  {
    id: 'item_011',
    item_code: '011',
    code: '011',
    name: '15 cm Ruby Sparkler',
    category: 'Sparklers',
    price: 60.50,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/011.jpg',
    is_active: true
  },
  {
    id: 'item_012',
    item_code: '012',
    code: '012',
    name: '15 CM Panchavarnam 5 in 1',
    category: 'Sparklers',
    price: 66.65,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/012.jpg',
    is_active: true
  },
  {
    id: 'item_013',
    item_code: '013',
    code: '013',
    name: '30 cm Electric Sparkler',
    category: 'Sparklers',
    price: 55.80,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/013.jpg',
    is_active: true
  },
  {
    id: 'item_014',
    item_code: '014',
    code: '014',
    name: '30 cm Colour Sparkler',
    category: 'Sparklers',
    price: 72.85,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/014.jpg',
    is_active: true
  },
  {
    id: 'item_015',
    item_code: '015',
    code: '015',
    name: '50 cm Electric Sparkler',
    category: 'Sparklers',
    price: 168.50,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/015.jpg',
    is_active: true
  },
  {
    id: 'item_016',
    item_code: '016',
    code: '016',
    name: '50 cm Colour Sparkler',
    category: 'Sparklers',
    price: 208.30,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/016.jpg',
    is_active: true
  },
  {
    id: 'item_017',
    item_code: '017',
    code: '017',
    name: '75 cm Electric Sparkler',
    category: 'Sparklers',
    price: 280.70,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/017.jpg',
    is_active: true
  },
  {
    id: 'item_018',
    item_code: '018',
    code: '018',
    name: '75 cm Colour Sparkler',
    category: 'Sparklers',
    price: 338.50,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/018.jpg',
    is_active: true
  },

  // --- CHAKKARS (019 - 031) ---
  {
    id: 'item_019',
    item_code: '019',
    code: '019',
    name: 'Ground Chakkar Big',
    category: 'Chakkars',
    price: 164.30,
    pieces_per_box: '25 piece / box',
    piece_count: '25 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/019.jpg',
    is_active: true
  },
  {
    id: 'item_020',
    item_code: '020',
    code: '020',
    name: 'Ground Chakkar Special',
    category: 'Chakkars',
    price: 148.80,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/020.jpg',
    is_active: true
  },
  {
    id: 'item_021',
    item_code: '021',
    code: '021',
    name: 'Ground Chakkar Deluxe',
    category: 'Chakkars',
    price: 262.50,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/021.jpg',
    is_active: true
  },
  {
    id: 'item_022',
    item_code: '022',
    code: '022',
    name: 'Krishna Chakkar Big',
    category: 'Chakkars',
    price: 209.25,
    pieces_per_box: '25 piece / box',
    piece_count: '25 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/022.jpg',
    is_active: true
  },
  {
    id: 'item_023',
    item_code: '023',
    code: '023',
    name: 'Krishna Chakkar Special',
    category: 'Chakkars',
    price: 158.10,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/023.jpg',
    is_active: true
  },
  {
    id: 'item_024',
    item_code: '024',
    code: '024',
    name: 'Giant Wheel',
    category: 'Chakkars',
    price: 189.10,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/024.jpg',
    is_active: true
  },
  {
    id: 'item_025',
    item_code: '025',
    code: '025',
    name: 'Joker Wheel',
    category: 'Chakkars',
    price: 189.10,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/025.jpg',
    is_active: true
  },
  {
    id: 'item_026',
    item_code: '026',
    code: '026',
    name: 'Star Wheel',
    category: 'Chakkars',
    price: 167.40,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/026.jpg',
    is_active: true
  },
  {
    id: 'item_027',
    item_code: '027',
    code: '027',
    name: 'Classic Wheel',
    category: 'Chakkars',
    price: 271.25,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/027.jpg',
    is_active: true
  },
  {
    id: 'item_028',
    item_code: '028',
    code: '028',
    name: 'Whistling Chakkar',
    category: 'Chakkars',
    price: 192.20,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/028.jpg',
    is_active: true
  },
  {
    id: 'item_029',
    item_code: '029',
    code: '029',
    name: 'Glittering Wheel',
    category: 'Chakkars',
    price: 189.10,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/029.jpg',
    is_active: true
  },
  {
    id: 'item_030',
    item_code: '030',
    code: '030',
    name: 'Tinto Wheel',
    category: 'Chakkars',
    price: 176.40,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/030.jpg',
    is_active: true
  },
  {
    id: 'item_031',
    item_code: '031',
    code: '031',
    name: 'Pilo Wheel',
    category: 'Chakkars',
    price: 176.40,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/031.jpg',
    is_active: true
  },

  // --- FOUNTAINS (032 - 056) ---
  {
    id: 'item_032',
    item_code: '032',
    code: '032',
    name: 'Lotus',
    category: 'Fountains',
    price: 127.10,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/032.jpg',
    is_active: true
  },
  {
    id: 'item_033',
    item_code: '033',
    code: '033',
    name: 'Cocktail Special',
    category: 'Fountains',
    price: 153.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/033.jpg',
    is_active: true
  },
  {
    id: 'item_034',
    item_code: '034',
    code: '034',
    name: 'Flower Pots Big',
    category: 'Fountains',
    price: 133.30,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/034.jpg',
    is_active: true
  },
  {
    id: 'item_035',
    item_code: '035',
    code: '035',
    name: 'Flower Pots Special',
    category: 'Fountains',
    price: 213.90,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/035.jpg',
    is_active: true
  },
  {
    id: 'item_036',
    item_code: '036',
    code: '036',
    name: 'Flower Pots Giant',
    category: 'Fountains',
    price: 405.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/036.jpg',
    is_active: true
  },
  {
    id: 'item_037',
    item_code: '037',
    code: '037',
    name: 'Flower Pots Deluxe',
    category: 'Fountains',
    price: 226.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/037.jpg',
    is_active: true
  },
  {
    id: 'item_038',
    item_code: '038',
    code: '038',
    name: 'Ten Colour Fountain',
    category: 'Fountains',
    price: 342.15,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/038.jpg',
    is_active: true
  },
  {
    id: 'item_039',
    item_code: '039',
    code: '039',
    name: 'Van Gogh',
    category: 'Fountains',
    price: 244.50,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/039.jpg',
    is_active: true
  },
  {
    id: 'item_040',
    item_code: '040',
    code: '040',
    name: 'Colour Koti 4 ft',
    category: 'Fountains',
    price: 713.20,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/040.jpg',
    is_active: true
  },
  {
    id: 'item_041',
    item_code: '041',
    code: '041',
    name: 'Rain Drop',
    category: 'Fountains',
    price: 273.90,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/041.jpg',
    is_active: true
  },
  {
    id: 'item_042',
    item_code: '042',
    code: '042',
    name: 'Mano Rakasu',
    category: 'Fountains',
    price: 275.90,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/042.jpg',
    is_active: true
  },
  {
    id: 'item_043',
    item_code: '043',
    code: '043',
    name: 'Roop Khela',
    category: 'Fountains',
    price: 463.45,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/043.jpg',
    is_active: true
  },
  {
    id: 'item_044',
    item_code: '044',
    code: '044',
    name: 'Varna Jalam',
    category: 'Fountains',
    price: 443.30,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/044.jpg',
    is_active: true
  },
  {
    id: 'item_045',
    item_code: '045',
    code: '045',
    name: 'Kiddy’s Joy',
    category: 'Fountains',
    price: 178.25,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/045.jpg',
    is_active: true
  },
  {
    id: 'item_046',
    item_code: '046',
    code: '046',
    name: 'Super Star (Crackling)',
    category: 'Fountains',
    price: 178.25,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/046.jpg',
    is_active: true
  },
  {
    id: 'item_047',
    item_code: '047',
    code: '047',
    name: 'Dilse',
    category: 'Fountains',
    price: 193.75,
    pieces_per_box: '1 piece /box',
    piece_count: '1 piece /box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/047.jpg',
    is_active: true
  },
  {
    id: 'item_048',
    item_code: '048',
    code: '048',
    name: 'Little Dove',
    category: 'Fountains',
    price: 57.35,
    pieces_per_box: '1 piece /box',
    piece_count: '1 piece /box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/048.jpg',
    is_active: true
  },
  {
    id: 'item_049',
    item_code: '049',
    code: '049',
    name: 'Crackling Star',
    category: 'Fountains',
    price: 353.85,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/049.jpg',
    is_active: true
  },
  {
    id: 'item_050',
    item_code: '050',
    code: '050',
    name: 'Chota Bhai (Mini Siren)',
    category: 'Fountains',
    price: 161.20,
    pieces_per_box: '3 piece / box',
    piece_count: '3 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/050.jpg',
    is_active: true
  },
  {
    id: 'item_051',
    item_code: '051',
    code: '051',
    name: 'Super Sonic (Siren)',
    category: 'Fountains',
    price: 260.40,
    pieces_per_box: '3 piece / box',
    piece_count: '3 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/051.jpg',
    is_active: true
  },
  {
    id: 'item_052',
    item_code: '052',
    code: '052',
    name: 'Lemon Tree (4 colours)',
    category: 'Fountains',
    price: 108.50,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/052.jpg',
    is_active: true
  },
  {
    id: 'item_053',
    item_code: '053',
    code: '053',
    name: 'Tora-Tora',
    category: 'Fountains',
    price: 380.70,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/053.jpg',
    is_active: true
  },
  {
    id: 'item_054',
    item_code: '054',
    code: '054',
    name: 'Mega Peacock Colour',
    category: 'Fountains',
    price: 511.50,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/054.jpg',
    is_active: true
  },
  {
    id: 'item_055',
    item_code: '055',
    code: '055',
    name: 'Mega Peacock Silver',
    category: 'Fountains',
    price: 666.00,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/055.jpg',
    is_active: true
  },
  {
    id: 'item_056',
    item_code: '056',
    code: '056',
    name: 'Twinkling 45 cm',
    category: 'Fountains',
    price: 56.60,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/056.jpg',
    is_active: true
  },

  // --- NOVELTY FIREWORKS (057 - 062) ---
  {
    id: 'item_057',
    item_code: '057',
    code: '057',
    name: 'Twinkling Star Special',
    category: 'NOVELTY FIREWORKS',
    price: 189.10,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/057.jpg',
    is_active: true
  },
  {
    id: 'item_058',
    item_code: '058',
    code: '058',
    name: 'Electric Diamond',
    category: 'NOVELTY FIREWORKS',
    price: 72.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/058.jpg',
    is_active: true
  },
  {
    id: 'item_059',
    item_code: '059',
    code: '059',
    name: 'Pencil Red & Green',
    category: 'NOVELTY FIREWORKS',
    price: 141.05,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/059.jpg',
    is_active: true
  },
  {
    id: 'item_060',
    item_code: '060',
    code: '060',
    name: 'Pencil 4 in 1',
    category: 'NOVELTY FIREWORKS',
    price: 137.85,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/060.jpg',
    is_active: true
  },
  {
    id: 'item_061',
    item_code: '061',
    code: '061',
    name: 'Joint Candle',
    category: 'NOVELTY FIREWORKS',
    price: 158.10,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/061.jpg',
    is_active: true
  },
  {
    id: 'item_062',
    item_code: '062',
    code: '062',
    name: 'Raja / Rainbow Candle',
    category: 'NOVELTY FIREWORKS',
    price: 217.00,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/062.jpg',
    is_active: true
  },

  // --- ATOM BOMBS (063 - 070) ---
  {
    id: 'item_063',
    item_code: '063',
    code: '063',
    name: 'Hydro Bomb',
    category: 'ATOM BOMBS',
    price: 103.85,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/063.jpg',
    is_active: true
  },
  {
    id: 'item_064',
    item_code: '064',
    code: '064',
    name: 'Shotgun Bomb',
    category: 'ATOM BOMBS',
    price: 181.35,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/064.jpg',
    is_active: true
  },
  {
    id: 'item_065',
    item_code: '065',
    code: '065',
    name: 'Double Sound Small',
    category: 'ATOM BOMBS',
    price: 49.00,
    pieces_per_box: '5 piece / pkt',
    piece_count: '5 piece / pkt',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/065.jpg',
    is_active: true
  },
  {
    id: 'item_066',
    item_code: '066',
    code: '066',
    name: 'Double Sound Big',
    category: 'ATOM BOMBS',
    price: 66.00,
    pieces_per_box: '5 piece / pkt',
    piece_count: '5 piece / pkt',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/066.jpg',
    is_active: true
  },
  {
    id: 'item_067',
    item_code: '067',
    code: '067',
    name: 'Three Sound with Colour',
    category: 'ATOM BOMBS',
    price: 85.25,
    pieces_per_box: '5 piece / pkt',
    piece_count: '5 piece / pkt',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/067.jpg',
    is_active: true
  },
  {
    id: 'item_068',
    item_code: '068',
    code: '068',
    name: 'Flower Bomb / New',
    category: 'ATOM BOMBS',
    price: 272.80,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/068.jpg',
    is_active: true
  },
  {
    id: 'item_069',
    item_code: '069',
    code: '069',
    name: 'Tito Special',
    category: 'ATOM BOMBS',
    price: 114.80,
    pieces_per_box: '2 piece / box',
    piece_count: '2 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/069.jpg',
    is_active: true
  },
  {
    id: 'item_070',
    item_code: '070',
    code: '070',
    name: 'Ulta-Pulta',
    category: 'ATOM BOMBS',
    price: 158.10,
    pieces_per_box: 'Special / box',
    piece_count: 'Special / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/070.jpg',
    is_active: true
  },

  // --- CHORSA FIREWORKS (071 - 072) ---
  {
    id: 'item_071',
    item_code: '071',
    code: '071',
    name: 'Photo Flash',
    category: 'CHORSA FIREWORKS',
    price: 62.85,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/071.jpg',
    is_active: true
  },
  {
    id: 'item_072',
    item_code: '072',
    code: '072',
    name: 'Loose Red 28 Chorsa',
    category: 'CHORSA FIREWORKS',
    price: 79.00,
    pieces_per_box: '100 piece / pkt',
    piece_count: '100 piece / pkt',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/072.jpg',
    is_active: true
  },

  // --- ROCKETS (073 - 083) ---
  {
    id: 'item_073',
    item_code: '073',
    code: '073',
    name: 'Colour Rocket',
    category: 'ROCKETS',
    price: 120.90,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/073.jpg',
    is_active: true
  },
  {
    id: 'item_074',
    item_code: '074',
    code: '074',
    name: 'Rocket Bomb',
    category: 'ROCKETS',
    price: 150.35,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/074.jpg',
    is_active: true
  },
  {
    id: 'item_075',
    item_code: '075',
    code: '075',
    name: 'Flower Missile',
    category: 'ROCKETS',
    price: 138.85,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/075.jpg',
    is_active: true
  },
  {
    id: 'item_076',
    item_code: '076',
    code: '076',
    name: 'Sound Missile',
    category: 'ROCKETS',
    price: 170.30,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/076.jpg',
    is_active: true
  },
  {
    id: 'item_077',
    item_code: '077',
    code: '077',
    name: 'Hydro Sound Rocket',
    category: 'ROCKETS',
    price: 209.60,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/077.jpg',
    is_active: true
  },
  {
    id: 'item_078',
    item_code: '078',
    code: '078',
    name: 'Mix Rocket Colour',
    category: 'ROCKETS',
    price: 223.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/078.jpg',
    is_active: true
  },
  {
    id: 'item_079',
    item_code: '079',
    code: '079',
    name: 'Classic Rocket Sound',
    category: 'ROCKETS',
    price: 223.30,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/079.jpg',
    is_active: true
  },
  {
    id: 'item_080',
    item_code: '080',
    code: '080',
    name: 'Parachute Rocket',
    category: 'ROCKETS',
    price: 373.70,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/080.jpg',
    is_active: true
  },
  {
    id: 'item_081',
    item_code: '081',
    code: '081',
    name: 'Air Whistle',
    category: 'ROCKETS',
    price: 251.10,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/081.jpg',
    is_active: true
  },
  {
    id: 'item_082',
    item_code: '082',
    code: '082',
    name: 'Super Whistle',
    category: 'ROCKETS',
    price: 399.50,
    pieces_per_box: '1 piece / box',
    piece_count: '1 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/082.jpg',
    is_active: true
  },
  {
    id: 'item_083',
    item_code: '083',
    code: '083',
    name: 'Pop-Pop',
    category: 'ROCKETS',
    price: 49.60,
    pieces_per_box: '10 pkt / 1 box',
    piece_count: '10 pkt / 1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/083.jpg',
    is_active: true
  },

  // --- FANCY NOVELTIES (084 - 095) ---
  {
    id: 'item_084',
    item_code: '084',
    code: '084',
    name: 'Seven Shot Red',
    category: 'FANCY NOVELTIES',
    price: 192.20,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/084.jpg',
    is_active: true
  },
  {
    id: 'item_085',
    item_code: '085',
    code: '085',
    name: 'Seven Shot Gold',
    category: 'FANCY NOVELTIES',
    price: 192.20,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/085.jpg',
    is_active: true
  },
  {
    id: 'item_086',
    item_code: '086',
    code: '086',
    name: 'Meto',
    category: 'FANCY NOVELTIES',
    price: 260.40,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/086.jpg',
    is_active: true
  },
  {
    id: 'item_087',
    item_code: '087',
    code: '087',
    name: 'Dancing Butterfly',
    category: 'FANCY NOVELTIES',
    price: 136.40,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/087.jpg',
    is_active: true
  },
  {
    id: 'item_088',
    item_code: '088',
    code: '088',
    name: 'Super Drone',
    category: 'FANCY NOVELTIES',
    price: 181.25,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/088.jpg',
    is_active: true
  },
  {
    id: 'item_089',
    item_code: '089',
    code: '089',
    name: 'Funny / Bunny',
    category: 'FANCY NOVELTIES',
    price: 217.00,
    pieces_per_box: '10 piece / box',
    piece_count: '10 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/089.jpg',
    is_active: true
  },
  {
    id: 'item_090',
    item_code: '090',
    code: '090',
    name: 'Magic Peacock',
    category: 'FANCY NOVELTIES',
    price: 217.00,
    pieces_per_box: '10 piece / 1 box',
    piece_count: '10 piece / 1 box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/090.jpg',
    is_active: true
  },
  {
    id: 'item_091',
    item_code: '091',
    code: '091',
    name: 'Choti Diwali',
    category: 'FANCY NOVELTIES',
    price: 217.00,
    pieces_per_box: '10 piece / 1 box',
    piece_count: '10 piece / 1 box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/091.jpg',
    is_active: true
  },
  {
    id: 'item_092',
    item_code: '092',
    code: '092',
    name: 'Mini-Mini Fountain',
    category: 'FANCY NOVELTIES',
    price: 217.00,
    pieces_per_box: '10 piece / 1 box',
    piece_count: '10 piece / 1 box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/092.jpg',
    is_active: true
  },
  {
    id: 'item_093',
    item_code: '093',
    code: '093',
    name: 'Ninja Chakkar',
    category: 'FANCY NOVELTIES',
    price: 108.30,
    pieces_per_box: '2 piece / box',
    piece_count: '2 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/093.jpg',
    is_active: true
  },
  {
    id: 'item_094',
    item_code: '094',
    code: '094',
    name: 'Pogo Mixed',
    category: 'FANCY NOVELTIES',
    price: 69.70,
    pieces_per_box: '2 piece / box',
    piece_count: '2 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/094.jpg',
    is_active: true
  },
  {
    id: 'item_095',
    item_code: '095',
    code: '095',
    name: 'Helicopter',
    category: 'FANCY NOVELTIES',
    price: 83.70,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'Medium',
    image_url: '/ayyan_images/products/095.jpg',
    is_active: true
  },

  // --- SHELLS (096 - 100) ---
  {
    id: 'item_096',
    item_code: '096',
    code: '096',
    name: '1 3/4" Cells - (5 Pcs)',
    category: 'ALL NEW 1 3/4" SHELLS',
    price: 562.65,
    pieces_per_box: '5 piece / box',
    piece_count: '5 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/096.jpg',
    is_active: true
  },
  {
    id: 'item_097',
    item_code: '097',
    code: '097',
    name: '1 3/4" Cells - (3 Pcs)',
    category: 'ALL NEW 1 3/4" SHELLS',
    price: 441.25,
    pieces_per_box: '3 piece / box',
    piece_count: '3 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/097.jpg',
    is_active: true
  },
  {
    id: 'item_098',
    item_code: '098',
    code: '098',
    name: '2" Cells',
    category: 'ALL NEW 2',
    price: 186.00,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/098.jpg',
    is_active: true
  },
  {
    id: 'item_099',
    item_code: '099',
    code: '099',
    name: '3" Cells - Rocky / AK',
    category: '3 SHELLS ROCKING',
    price: 458.20,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/099.jpg',
    is_active: true
  },
  {
    id: 'item_100',
    item_code: '100',
    code: '100',
    name: '3" Cells Premium',
    category: '3 SHELLS PREMIUM',
    price: 511.50,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/100.jpg',
    is_active: true
  },

  // --- COMBINATION FIREWORKS (101 - 112) ---
  {
    id: 'item_101',
    item_code: '101',
    code: '101',
    name: 'Dekhe Man (12 Star)',
    category: 'COMBINATION FIREWORKS',
    price: 214.00,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/101.jpg',
    is_active: true
  },
  {
    id: 'item_102',
    item_code: '102',
    code: '102',
    name: 'Daisy Beds (12 Star)',
    category: 'COMBINATION FIREWORKS',
    price: 232.10,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/102.jpg',
    is_active: true
  },
  {
    id: 'item_103',
    item_code: '103',
    code: '103',
    name: 'Pink Panther (12 Star)',
    category: 'COMBINATION FIREWORKS',
    price: 232.10,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/103.jpg',
    is_active: true
  },
  {
    id: 'item_104',
    item_code: '104',
    code: '104',
    name: 'Zeta, Beta, Sigma, Omega (12 Star)',
    category: 'COMBINATION FIREWORKS',
    price: 291.40,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/104.jpg',
    is_active: true
  },
  {
    id: 'item_105',
    item_code: '105',
    code: '105',
    name: 'Sky Storms (25 shots)',
    category: 'COMBINATION FIREWORKS',
    price: 220.00,
    pieces_per_box: '2 piece / box',
    piece_count: '2 piece / box',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/105.jpg',
    is_active: true
  },
  {
    id: 'item_106',
    item_code: '106',
    code: '106',
    name: 'Chal Mere Sath',
    category: 'COMBINATION FIREWORKS',
    price: 418.50,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/106.jpg',
    is_active: true
  },
  {
    id: 'item_107',
    item_code: '107',
    code: '107',
    name: 'Thor',
    category: 'COMBINATION FIREWORKS',
    price: 531.25,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/107.jpg',
    is_active: true
  },
  {
    id: 'item_108',
    item_code: '108',
    code: '108',
    name: 'Dil Mange More - 50 shot',
    category: 'COMBINATION FIREWORKS',
    price: 744.30,
    pieces_per_box: '50 shot',
    piece_count: '50 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/108.jpg',
    is_active: true
  },
  {
    id: 'item_109',
    item_code: '109',
    code: '109',
    name: 'Balle - Balle',
    category: 'COMBINATION FIREWORKS',
    price: 533.30,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/109.jpg',
    is_active: true
  },
  {
    id: 'item_110',
    item_code: '110',
    code: '110',
    name: 'Sunhari Barsat',
    category: 'COMBINATION FIREWORKS',
    price: 448.20,
    pieces_per_box: '1 piece',
    piece_count: '1 piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/110.jpg',
    is_active: true
  },
  {
    id: 'item_111',
    item_code: '111',
    code: '111',
    name: 'Singing Bird (25 shot)',
    category: 'COMBINATION FIREWORKS',
    price: 829.00,
    pieces_per_box: '25 shot',
    piece_count: '25 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/111.jpg',
    is_active: true
  },
  {
    id: 'item_112',
    item_code: '112',
    code: '112',
    name: 'Singing Bird (12 shot)',
    category: 'COMBINATION FIREWORKS',
    price: 403.80,
    pieces_per_box: '15 shot',
    piece_count: '15 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/112.jpg',
    is_active: true
  },

  // --- CAKE ITEMS (113 - 136) ---
  {
    id: 'item_113',
    item_code: '113',
    code: '113',
    name: 'Indian Delight (30 shot)',
    category: 'CAKE ITEMS',
    price: 882.50,
    pieces_per_box: '30 shot',
    piece_count: '30 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/113.jpg',
    is_active: true
  },
  {
    id: 'item_114',
    item_code: '114',
    code: '114',
    name: 'Indian Delight (15 shot)',
    category: 'CAKE ITEMS',
    price: 475.80,
    pieces_per_box: '15 shot',
    piece_count: '15 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/114.jpg',
    is_active: true
  },
  {
    id: 'item_115',
    item_code: '115',
    code: '115',
    name: 'Wooden Night',
    category: 'CAKE ITEMS',
    price: 1542.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/115.jpg',
    is_active: true
  },
  {
    id: 'item_116',
    item_code: '116',
    code: '116',
    name: 'Mystic Magic',
    category: 'CAKE ITEMS',
    price: 1635.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/116.jpg',
    is_active: true
  },
  {
    id: 'item_117',
    item_code: '117',
    code: '117',
    name: 'Rang-O-Rang',
    category: 'CAKE ITEMS',
    price: 2402.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/117.jpg',
    is_active: true
  },
  {
    id: 'item_118',
    item_code: '118',
    code: '118',
    name: 'Sky Boomers – 120 colour',
    category: 'CAKE ITEMS',
    price: 2852.00,
    pieces_per_box: '120 colour',
    piece_count: '120 colour',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/118.jpg',
    is_active: true
  },
  {
    id: 'item_119',
    item_code: '119',
    code: '119',
    name: 'Oceanic Night',
    category: 'CAKE ITEMS',
    price: 2790.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/119.jpg',
    is_active: true
  },
  {
    id: 'item_120',
    item_code: '120',
    code: '120',
    name: 'Birthday Night',
    category: 'CAKE ITEMS',
    price: 3067.00,
    pieces_per_box: '240 shot',
    piece_count: '240 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/120.jpg',
    is_active: true
  },
  {
    id: 'item_121',
    item_code: '121',
    code: '121',
    name: 'Crackling Nights',
    category: 'CAKE ITEMS',
    price: 5859.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/121.jpg',
    is_active: true
  },
  {
    id: 'item_122',
    item_code: '122',
    code: '122',
    name: 'Khushi Nights',
    category: 'CAKE ITEMS',
    price: 6587.50,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/122.jpg',
    is_active: true
  },
  {
    id: 'item_123',
    item_code: '123',
    code: '123',
    name: 'Super Musical – 500 shot',
    category: 'CAKE ITEMS',
    price: 13872.50,
    pieces_per_box: '500 shot',
    piece_count: '500 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/123.jpg',
    is_active: true
  },
  {
    id: 'item_124',
    item_code: '124',
    code: '124',
    name: 'Seven Musical – 1000 shot',
    category: 'CAKE ITEMS',
    price: 27977.50,
    pieces_per_box: '1000 shot',
    piece_count: '1000 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/124.jpg',
    is_active: true
  },
  {
    id: 'item_125',
    item_code: '125',
    code: '125',
    name: 'Celebration Premium Shot',
    category: 'CAKE ITEMS',
    price: 3012.00,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/125.jpg',
    is_active: true
  },
  {
    id: 'item_126',
    item_code: '126',
    code: '126',
    name: 'Festival – 100 shot',
    category: 'CAKE ITEMS',
    price: 6045.00,
    pieces_per_box: '100 shot',
    piece_count: '100 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/126.jpg',
    is_active: true
  },
  {
    id: 'item_127',
    item_code: '127',
    code: '127',
    name: 'Floral Fantasy – 100 shot',
    category: 'CAKE ITEMS',
    price: 6608.85,
    pieces_per_box: '100 shot',
    piece_count: '100 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/127.jpg',
    is_active: true
  },
  {
    id: 'item_128',
    item_code: '128',
    code: '128',
    name: 'Floral Fantasy – 180 shot',
    category: 'CAKE ITEMS',
    price: 11315.20,
    pieces_per_box: '180 shot',
    piece_count: '180 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/128.jpg',
    is_active: true
  },
  {
    id: 'item_129',
    item_code: '129',
    code: '129',
    name: 'Top Star – 25 shot',
    category: 'CAKE ITEMS',
    price: 7269.50,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/129.jpg',
    is_active: true
  },
  {
    id: 'item_130',
    item_code: '130',
    code: '130',
    name: 'Fun Club – 25 shot',
    category: 'CAKE ITEMS',
    price: 6192.55,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/130.jpg',
    is_active: true
  },
  {
    id: 'item_131',
    item_code: '131',
    code: '131',
    name: 'Fashion Parade - 24 Shot',
    category: 'CAKE ITEMS',
    price: 6192.55,
    pieces_per_box: '1 Piece',
    piece_count: '1 Piece',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/131.jpg',
    is_active: true
  },
  {
    id: 'item_132',
    item_code: '132',
    code: '132',
    name: 'Angel – 16 shot',
    category: 'CAKE ITEMS',
    price: 10493.00,
    pieces_per_box: '16 shot',
    piece_count: '16 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/132.jpg',
    is_active: true
  },
  {
    id: 'item_133',
    item_code: '133',
    code: '133',
    name: 'Paris-Paris – 10 shot',
    category: 'CAKE ITEMS',
    price: 5347.00,
    pieces_per_box: '10 shot',
    piece_count: '10 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/133.jpg',
    is_active: true
  },
  {
    id: 'item_134',
    item_code: '134',
    code: '134',
    name: 'Casanova – 20 shot',
    category: 'CAKE ITEMS',
    price: 10772.50,
    pieces_per_box: '20 shot',
    piece_count: '20 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/134.jpg',
    is_active: true
  },
  {
    id: 'item_135',
    item_code: '135',
    code: '135',
    name: 'Night Rider – 100 shot',
    category: 'CAKE ITEMS',
    price: 3875.00,
    pieces_per_box: '100 shot',
    piece_count: '100 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/135.jpg',
    is_active: true
  },
  {
    id: 'item_136',
    item_code: '136',
    code: '136',
    name: 'Big Show – 100 shot',
    category: 'CAKE ITEMS',
    price: 6161.25,
    pieces_per_box: '100 shot',
    piece_count: '100 shot',
    sound_level: 'High Spectacle',
    image_url: '/ayyan_images/products/136.jpg',
    is_active: true
  },

  // --- ASSORTED GIFT PACKS (137 - 141) ---
  {
    id: 'item_137',
    item_code: '137',
    code: '137',
    name: 'Gift Box A – Assorted Pack (Gift) – 24 items',
    category: 'ASSORTED GIFT PACKS',
    price: 790.00,
    pieces_per_box: '1 BOX',
    piece_count: '1 BOX',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/137.jpg',
    is_active: true
  },
  {
    id: 'item_138',
    item_code: '138',
    code: '138',
    name: 'Assorted Pack (Gift) B – 28 Items',
    category: 'ASSORTED GIFT PACKS',
    price: 1284.00,
    pieces_per_box: '1 BOX',
    piece_count: '1 BOX',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/138.jpg',
    is_active: true
  },
  {
    id: 'item_139',
    item_code: '139',
    code: '139',
    name: 'Assorted Pack (Gift) C – 30 items',
    category: 'ASSORTED GIFT PACKS',
    price: 1558.00,
    pieces_per_box: '1 BOX',
    piece_count: '1 BOX',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/139.jpg',
    is_active: true
  },
  {
    id: 'item_140',
    item_code: '140',
    code: '140',
    name: 'Assorted Pack (Gift) D – 36 items',
    category: 'ASSORTED GIFT PACKS',
    price: 1813.40,
    pieces_per_box: '1 BOX',
    piece_count: '1 BOX',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/140.jpg',
    is_active: true
  },
  {
    id: 'item_141',
    item_code: '141',
    code: '141',
    name: 'Gift Box Dino – 40 Items',
    category: 'ASSORTED GIFT PACKS',
    price: 1821.00,
    pieces_per_box: '1 BOX',
    piece_count: '1 BOX',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/141.jpg',
    is_active: true
  },

  // --- BATCHES / NOVELTY MATCHES & TOYS (142 - 153) ---
  {
    id: 'item_142',
    item_code: '142',
    code: '142',
    name: 'Camel Red & Green',
    category: 'NOVELTY FIREWORKS',
    price: 25.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/142.jpg',
    is_active: true
  },
  {
    id: 'item_143',
    item_code: '143',
    code: '143',
    name: 'Camel Match Special',
    category: 'NOVELTY FIREWORKS',
    price: 45.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/143.jpg',
    is_active: true
  },
  {
    id: 'item_144',
    item_code: '144',
    code: '144',
    name: 'Pops (5 colours)',
    category: 'NOVELTY FIREWORKS',
    price: 125.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/144.jpg',
    is_active: true
  },
  {
    id: 'item_145',
    item_code: '145',
    code: '145',
    name: 'Josh Match Box',
    category: 'NOVELTY FIREWORKS',
    price: 95.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/145.jpg',
    is_active: true
  },
  {
    id: 'item_146',
    item_code: '146',
    code: '146',
    name: 'Ninja Match Box',
    category: 'NOVELTY FIREWORKS',
    price: 110.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/146.jpg',
    is_active: true
  },
  {
    id: 'item_147',
    item_code: '147',
    code: '147',
    name: 'Rainbow (5 colours)',
    category: 'NOVELTY FIREWORKS',
    price: 135.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/147.jpg',
    is_active: true
  },
  {
    id: 'item_148',
    item_code: '148',
    code: '148',
    name: 'Vadivel (10 colours)',
    category: 'NOVELTY FIREWORKS',
    price: 150.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/148.jpg',
    is_active: true
  },
  {
    id: 'item_149',
    item_code: '149',
    code: '149',
    name: 'Ayyan Toy Car (5 colours)',
    category: 'NOVELTY FIREWORKS',
    price: 180.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/149.jpg',
    is_active: true
  },
  {
    id: 'item_150',
    item_code: '150',
    code: '150',
    name: 'Ayyan Trident (3 colours)',
    category: 'NOVELTY FIREWORKS',
    price: 140.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/150.jpg',
    is_active: true
  },
  {
    id: 'item_151',
    item_code: '151',
    code: '151',
    name: 'Ayyan Roll Cap',
    category: 'NOVELTY FIREWORKS',
    price: 90.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/151.jpg',
    is_active: true
  },
  {
    id: 'item_152',
    item_code: '152',
    code: '152',
    name: 'Ayyan Ring Cap',
    category: 'NOVELTY FIREWORKS',
    price: 120.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/152.jpg',
    is_active: true
  },
  {
    id: 'item_153',
    item_code: '153',
    code: '153',
    name: 'Ayyan Hunter Gun',
    category: 'NOVELTY FIREWORKS',
    price: 180.00,
    pieces_per_box: '1 box',
    piece_count: '1 box',
    sound_level: 'Low / Silent',
    image_url: '/ayyan_images/products/153.jpg',
    is_active: true
  }
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
        id: `slot-${dateStr}-${index}`,
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
