import { Product, Slot, Booking } from '../types';

// Genuine 2026 Sivakasi Bunny Brand Certified Fireworks Catalogue
export const INITIAL_PRODUCTS: Product[] = [
  // 1. SPARKLERS
  {
    id: 'prod-spk-10cm',
    name: '10cm Electric Sparklers',
    category: 'Sparklers',
    price: 75,
    piece_count: '10 Pcs / Box',
    description: 'Classic crackling golden sparks with ultra-low smoke formulation. Perfect for children and family celebrations.',
    safety_instructions: 'Hold at arms length pointing away from body. Light one sparkler at a time using an agarbatti or candle. Dip used wires in a bucket of water.',
    safety_tags: ['Green Firework', 'Low Smoke', 'Child Safe', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-spk-15cm-gold',
    name: '15cm Crackling Golden Sparklers',
    category: 'Sparklers',
    price: 120,
    piece_count: '10 Pcs / Box',
    description: 'Dense golden star clusters with extended burn duration of 60+ seconds. High luminosity.',
    safety_instructions: 'Maintain minimum 2 meter clearance from garments. Wear cotton clothes during lighting.',
    safety_tags: ['Extended Duration', 'Golden Stars', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-spk-30cm-rainbow',
    name: '30cm Deluxe Rainbow Sparklers',
    category: 'Sparklers',
    price: 180,
    piece_count: '5 Pcs / Box',
    description: 'Multi-color shifting sparks transitioning from crimson red to emerald green and royal gold.',
    safety_instructions: 'Outdoor use only. Discard spent rods in water bucket.',
    safety_tags: ['Multi-Color', 'Green Chemistry', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-spk-50cm-mega',
    name: '50cm Mega Royal Sparklers',
    category: 'Sparklers',
    price: 290,
    piece_count: '5 Pcs / Box',
    description: 'Giant festival sparkler rods with 120 seconds of continuous sparkling cascade.',
    safety_instructions: 'Handle with care. Always extinguish in water bucket after display.',
    safety_tags: ['Mega Size', 'Long Duration', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },

  // 2. CHAKKARS (GROUND SPINNERS)
  {
    id: 'prod-chk-special',
    name: 'Ground Chakkars Special',
    category: 'Ground Chakkars',
    price: 140,
    piece_count: '10 Pcs / Box',
    description: 'Fast spinning circular ground fire with bright golden sparks radiating in wide concentric circles.',
    safety_instructions: 'Place flat on a hard, level, open ground away from walls or dry leaves. Light fuse and step back 5 meters.',
    safety_tags: ['High RPM', 'Golden Cascade', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-chk-deluxe-whisper',
    name: 'Deluxe Whispering Chakkars',
    category: 'Ground Chakkars',
    price: 240,
    piece_count: '10 Pcs / Box',
    description: 'Whispering whistling sound paired with multi-colored emission rings that change hues as it spins.',
    safety_instructions: 'Ensure smooth flat concrete surface. Never hold in hand while lighting.',
    safety_tags: ['Whispering Effect', 'Color Ring', 'PESO Certified'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-chk-disco-wheel',
    name: 'Disco Wheels Super Spinners',
    category: 'Ground Chakkars',
    price: 210,
    piece_count: '10 Pcs / Box',
    description: 'High velocity ground spinning wheel producing dynamic strobe sparkles and silver stars.',
    safety_instructions: 'Light from side using extended agarbatti. Keep spectators at 5m radius.',
    safety_tags: ['Strobe Sparkles', 'High Velocity', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-chk-king-size',
    name: 'King Size Golden Rotating Chakkars',
    category: 'Ground Chakkars',
    price: 320,
    piece_count: '10 Pcs / Box',
    description: 'Heavy gauge circular ground wheel with 25-second continuous high-radius spinning fire.',
    safety_instructions: 'Place on clear flat floor. Light and maintain safe distance.',
    safety_tags: ['King Size', 'Wide Radius', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },

  // 3. FLOWER POTS (FOUNTAINS)
  {
    id: 'prod-pot-special',
    name: 'Flower Pots Special',
    category: 'Flower Pots',
    price: 190,
    piece_count: '10 Pcs / Box',
    description: 'Dense shower of golden sparkles shooting 5 to 7 feet high with beautiful bell-shaped cone.',
    safety_instructions: 'Place pot upright on level ground. Do not lean over pot while lighting.',
    safety_tags: ['Classic Shower', 'Family Favorite', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1533230307785-f01f01639d67?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-pot-ashoka-deluxe',
    name: 'Flower Pots Ashoka Deluxe',
    category: 'Flower Pots',
    price: 280,
    piece_count: '10 Pcs / Box',
    description: 'Iconic Ashoka formulation producing 12-foot high shimmering silver and golden sparks spray.',
    safety_instructions: 'Ensure vertical placement. Keep clear of trees and overhead wires.',
    safety_tags: ['12ft Fountain', 'Ashoka Formula', 'PESO Certified'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-pot-color-koti',
    name: 'Color Koti Fountain Pots',
    category: 'Flower Pots',
    price: 390,
    piece_count: '10 Pcs / Box',
    description: 'Vibrant tri-color vertical fountain shifting from deep ruby red to neon green and golden crackles.',
    safety_instructions: 'Light from arms length. Step back 4 meters immediately.',
    safety_tags: ['Tri-Color', 'Neon Sparks', 'PESO Certified'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-pot-tri-color-jumbo',
    name: 'Tri-Color Jumbo Super Fountain',
    category: 'Flower Pots',
    price: 450,
    piece_count: '2 Large Pcs / Box',
    description: 'Massive theatrical stage fountain generating 18-foot luminous spray for 45 seconds.',
    safety_instructions: 'Ensure 10m open clearance. Outdoor use only on solid masonry or soil.',
    safety_tags: ['Jumbo Size', '18ft Spray', 'PESO Certified'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },

  // 4. ROCKETS & MISSILES
  {
    id: 'prod-rkt-baby-whistler',
    name: 'Baby Rocket Whistlers',
    category: 'Sky Rockets',
    price: 160,
    piece_count: '10 Pcs / Box',
    description: 'High pitched screaming whistle rocket soaring 40 meters before bursting into silver stars.',
    safety_instructions: 'Insert guiding stick loosely into a stable launch bottle or pipe. Never stick into soil. Step back 10m.',
    safety_tags: ['Whistling Flight', 'Silver Burst', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1533230307785-f01f01639d67?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-rkt-lunik-sound',
    name: 'Lunik Sound Rockets',
    category: 'Sky Rockets',
    price: 270,
    piece_count: '10 Pcs / Box',
    description: 'Rapid ascending sky rocket with thunderous acoustic report and golden willow tail.',
    safety_instructions: 'Use dedicated metal launcher tube. Clear sky overhead required.',
    safety_tags: ['Thunder Report', 'Willow Tail', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-rkt-parachute-2stage',
    name: '2-Stage Parachute Sky Rocket',
    category: 'Sky Rockets',
    price: 380,
    piece_count: '5 Pcs / Box',
    description: 'Shoots high into stratosphere, bursts with twin colored flares and deploys descending safety parachute.',
    safety_instructions: 'Ensure no overhead trees or balconies. Launch vertically upwards.',
    safety_tags: ['Parachute Descent', 'Twin Flare', 'PESO Certified'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-rkt-tri-star-mega',
    name: 'Tri-Star Mega Sky Rockets',
    category: 'Sky Rockets',
    price: 520,
    piece_count: '3 Giant Pcs / Box',
    description: 'Heavy duty aerial rocket with triple color burst in ruby, cobalt blue, and golden brocade.',
    safety_instructions: 'Use sturdy heavy base launcher. Maintain 15m safety perimeter.',
    safety_tags: ['Triple Burst', 'Pro Pyrotechnic', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },

  // 5. AERIAL MULTI-SHOTS / CAKES
  {
    id: 'prod-aer-12-shot',
    name: '12 Shot Sky Wonders Aerial Cake',
    category: 'Aerial Multi-Shots',
    price: 590,
    piece_count: '12 Continuous Shots',
    description: '12 rapid aerial shots firing in timed succession: Red peony, Green dahlia, Silver palm, and Crackling chrysanthemum.',
    safety_instructions: 'Place cake on flat firm ground. Support sides with bricks or sandbags to prevent tipping. Light fuse and retreat 15m.',
    safety_tags: ['12 Timed Shots', 'Multi-Effect', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-aer-30-shot-brocade',
    name: '30 Shot Golden Brocade Aerial Cake',
    category: 'Aerial Multi-Shots',
    price: 1450,
    piece_count: '30 Continuous Shots',
    description: '30 majestic golden brocade crown shells reaching 120 feet with hanging glitter tails.',
    safety_instructions: 'Secure firmly on ground. Never inspect box if all shots have not finished.',
    safety_tags: ['30 Shots', 'Brocade Crown', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-aer-60-shot-palm',
    name: '60 Shot Multi-Color Palm Festival Cake',
    category: 'Aerial Multi-Shots',
    price: 2850,
    piece_count: '60 Rapid Shots',
    description: '60 synchronized shells forming broad palm tree patterns with crackling pistils in emerald and ruby.',
    safety_instructions: 'Professional consumer cake. Ensure 25m open clearing.',
    safety_tags: ['60 Shells', 'Palm Pattern', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-aer-120-shot-majestic',
    name: '120 Shot Majestic Fireworks Display Mega Cake',
    category: 'Aerial Multi-Shots',
    price: 5400,
    piece_count: '120 Grand Finale Shots',
    description: 'The ultimate consumer showstopper. 120 rapid sequence shots with fan effects, whistles, and gigantic titanium willow finale.',
    safety_instructions: 'Clear 30 meter radius. Must be secured on solid concrete or ground with side supports.',
    safety_tags: ['120 Grand Finale', 'Fan Sequence', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },

  // 6. GIFT BOXES (CURATED FAMILY HAMPERS)
  {
    id: 'prod-box-anandham-18',
    name: '18-Items Anandham Family Gift Box',
    category: 'Gift Boxes',
    price: 999,
    piece_count: '18 Curated Items',
    description: 'Complete family assortment featuring sparklers, chakkars, flower pots, whistling rockets, and pencils.',
    safety_instructions: 'Keep in dry place. Open only one item at a time under adult supervision.',
    safety_tags: ['Family Pack', 'Assorted Varieties', 'PESO Certified'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-box-vijayotsav-32',
    name: '32-Items Vijayotsav Deluxe Family Box',
    category: 'Gift Boxes',
    price: 2450,
    piece_count: '32 Deluxe Items',
    description: 'High-value festival gift hamper with deluxe multi-color pots, 12-shot aerial cake, king chakkars, and rainbow sparklers.',
    safety_instructions: 'Follow individual item safety guides enclosed in box.',
    safety_tags: ['Deluxe Hamper', 'Best Value', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-box-maharaja-45',
    name: '45-Items Maharaja Grand Corporate Box',
    category: 'Gift Boxes',
    price: 4800,
    piece_count: '45 Premium Items',
    description: 'Luxury hardbound celebration gift box with 30-shot aerial cake, stage fountains, parachutes, and mega sparklers.',
    safety_instructions: 'Premium festive carton with safety tamper seal. Keep away from moisture.',
    safety_tags: ['Corporate Luxury', 'Heavy Assortment', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-box-royal-60',
    name: '60-Items Platinum Royal Showstopper Hamper',
    category: 'Gift Boxes',
    price: 7999,
    piece_count: '60 Ultimate Items',
    description: 'The pinnacle of Sivakasi pyrotechnics. Contains 60-shot aerial cake, 120-shot cake, stage jumbo pots, multiple sparkler bundles, and rockets.',
    safety_instructions: 'Heavy wooden reinforced carton. Store in safe locked location away from heat.',
    safety_tags: ['Platinum Collection', 'Complete Night Show', 'PESO Certified'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

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
      { start: '06:00:00', end: '07:00:00', cap: 120 },
      { start: '07:00:00', end: '08:00:00', cap: 120 },
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
      { start: '20:00:00', end: '21:00:00', cap: 120 }
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
