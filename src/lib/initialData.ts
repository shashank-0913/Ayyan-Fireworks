import { Product, Slot, Booking } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Ayyan 15cm Electric Golden Sparklers',
    category: 'Sparklers',
    price: 145,
    piece_count: '10 Sparklers / Box',
    description: 'Sivakasi classic hand-held golden crackling sparklers with low-smoke formulation and vibrant warm golden emission.',
    safety_instructions: 'Hold horizontally at arm length away from body. Extinguish in a bucket of water or sand immediately after use.',
    safety_tags: ['Low Smoke', 'Family Safe', 'Child Friendly under Supervision'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-02',
    name: 'Royal Crimson & Emerald Sparklers',
    category: 'Sparklers',
    price: 195,
    piece_count: '10 Sparklers / Box',
    description: 'Dual-stage high-intensity sparklers radiating vivid emerald green sparks shifting into intense royal crimson fire.',
    safety_instructions: 'Ignite tip using an agarbatti or lighter with extended reach. Always wear cotton clothing.',
    safety_tags: ['Vibrant Colors', 'Extended Burn Time', 'Certified Green Chemistry'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-03',
    name: 'Deluxe Sovereign Chakkars (Ground Spinners)',
    category: 'Ground Spinners',
    price: 280,
    piece_count: '10 Pieces / Box',
    description: 'High-speed rotating wheel casting a 3-meter circumference halo of shimmering golden sparks with center red beacon.',
    safety_instructions: 'Place flat on hard level ground. Ignite center fuse and step back at least 5 meters.',
    safety_tags: ['Golden Halo', 'Smooth Balance', 'Clean Ground Ignition'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-04',
    name: 'Tri-Colour Peacock Flower Pots (Mega Jumbo)',
    category: 'Flower Pots & Fountains',
    price: 460,
    piece_count: '5 Mega Pots / Box',
    description: 'Spectacular conic fountain ejecting a massive 15-foot spray of gold, sapphire blue, and silver crackling stars.',
    safety_instructions: 'Place upright on clear firm soil or concrete. Do not lean over the flower pot during lighting.',
    safety_tags: ['15ft Vertical Spray', 'Tri-Color Fusion', 'PESO Low-Barium'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-05',
    name: 'Imperial Silver Rain Conical Fountain',
    category: 'Flower Pots & Fountains',
    price: 390,
    piece_count: '5 Pots / Box',
    description: 'Elegantly quiet, dazzling cascade of cool silver glitter with steady 45-second prolonged discharge duration.',
    safety_instructions: 'Keep clear overhead clearance. Ensure open perimeter of 4 meters.',
    safety_tags: ['Ultra Long Duration', 'Glitter Shower', 'Smoke Free Tech'],
    sound_level: 'Low / Silent',
    image_url: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-06',
    name: 'Super Sonic Sound Rockets',
    category: 'Sky Rockets & Missiles',
    price: 520,
    piece_count: '10 Rockets / Pack',
    description: 'High-thrust solid fuel rockets whistling up to 180 feet followed by a crisp titanium salute report.',
    safety_instructions: 'Place rocket launching stick freely in a sturdy upright PVC launcher tube or glass bottle filled with sand. Never push stick into dirt.',
    safety_tags: ['180ft Elevation', 'Whistle to Bang', 'High Spectacle'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-07',
    name: 'Starlight Moon Whistling Missiles (25 Shots)',
    category: 'Sky Rockets & Missiles',
    price: 640,
    piece_count: '1 Cake (25 Missiles)',
    description: 'Rapid multi-whistle rocket launcher releasing 25 micro-missiles consecutively into the night sky with color tails.',
    safety_instructions: 'Keep on flat level ground with brick support on either side to prevent tilting.',
    safety_tags: ['25 Continuous Bursts', 'Whistling Melody', 'Night Sky Tracker'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-08',
    name: 'Ayyan Grand Celebration 12-Shot Aerial Cake',
    category: 'Aerial Multi-Shot Cakes',
    price: 980,
    piece_count: '1 Multishot Cake',
    description: 'Spectacular single-fuse barrage launching 12 massive peonies with golden willow brocades and red strobe cores.',
    safety_instructions: 'Place on flat ground. Secure with heavy stones/bricks on base. Step back 15 meters.',
    safety_tags: ['12 Aerial Peonies', 'Golden Willow Finale', 'Single Fuse Ease'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1521478706270-f6e9b2d59e3a?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-09',
    name: 'Celestial Symphony 30-Shot Multi-Color Cake',
    category: 'Aerial Multi-Shot Cakes',
    price: 2450,
    piece_count: '1 Large Aerial Cake',
    description: 'Pro-grade rhythmic barrage featuring blue mines to gold crowns, silver chrysanthemums, and crackling dragon eggs.',
    safety_instructions: 'For outdoor open spaces only. Ensure 25m safety radius. Light fuse from side.',
    safety_tags: ['30 Grand Shots', 'Dragon Eggs Effect', 'Festival Showstopper'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'The Sovereign 120-Shot Royal Gala Box',
    category: 'Aerial Multi-Shot Cakes',
    price: 7800,
    piece_count: '1 Mega Display Cake (~7.5kg)',
    description: 'Our flagship 2-minute non-stop aerial extravaganza. Cascading titanium salutes, cascading waterfalls, and multi-tier palms.',
    safety_instructions: 'Must be ignited in wide ground with minimum 30-meter clearance from structures and trees.',
    safety_tags: ['120 Rapid Bursts', '2-Minute Symphony', 'VIP Wedding & Diwali Gala'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'Ayyan Ananda Family Festive Hamper (Silver Edition)',
    category: 'Curated Family Gift Boxes',
    price: 3250,
    piece_count: '28 Assorted Items in Metal Tin',
    description: 'Carefully balanced festive selection of sparklers, chakkars, flower pots, whistling birds, pencil torches, and mini aerials.',
    safety_instructions: 'Follow individual safety instructions provided inside the gift box booklet.',
    safety_tags: ['Complete Family Package', '28 Variety Items', 'Eco-Friendly Packing'],
    sound_level: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1533230807127-716665511457?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Ayyan Rajadhiraja VIP Grand Gift Chest (Gold Edition)',
    category: 'Curated Family Gift Boxes',
    price: 6950,
    piece_count: '45 Premium Items in Wooden Chest',
    description: 'The ultimate collector gift pack featuring premium aerial display cakes, jumbo fountains, electric sparklers, and novelty items.',
    safety_instructions: 'Comprehensive safety booklet and complimentary safety glasses & lighting incense sticks included.',
    safety_tags: ['45 Handpicked Items', 'Luxury Gift Packing', 'Includes Safety Kit'],
    sound_level: 'High Spectacle',
    image_url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Helper to generate dynamic dates formatted YYYY-MM-DD
export function getFormattedDateOffset(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TIME_WINDOWS = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '12:00', end: '13:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
  { start: '17:00', end: '18:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' }
];

export function generateInitialSlots(): Slot[] {
  const slots: Slot[] = [];

  for (let day = 0; day < 14; day++) {
    const slotDate = getFormattedDateOffset(day);
    
    TIME_WINDOWS.forEach((w, index) => {
      // Deterministic realistic initial occupancies
      let booked = 0;
      if (day === 0) {
        // Today has higher bookings for realistic preview
        if (index < 4) booked = 15; // Completed morning slots
        else if (index === 4 || index === 6) booked = 11; // Filling fast
        else if (index === 7) booked = 15; // Peak booked
        else booked = 4;
      } else if (day === 1) {
        booked = (index % 3 === 0) ? 9 : (index % 2 === 0 ? 5 : 2);
      } else {
        booked = Math.min(14, (day * 2 + index * 3) % 11);
      }

      slots.push({
        id: `slot-${slotDate}-${w.start.replace(':', '')}`,
        slot_date: slotDate,
        start_time: `${w.start}:00`,
        end_time: `${w.end}:00`,
        total_capacity: 15,
        booked_capacity: booked,
        is_blocked: false,
        created_at: new Date().toISOString()
      });
    });
  }

  return slots;
}

export function generateInitialBookings(slots: Slot[]): Booking[] {
  const today = getFormattedDateOffset(0);
  const tomorrow = getFormattedDateOffset(1);

  const sampleNames = [
    { name: 'Karthik Subramanian', phone: '9840123456', count: 3 },
    { name: 'Dr. Anand Ramanathan', phone: '9884567890', count: 4 },
    { name: 'Meenakshi Sundaram', phone: '9443218765', count: 2 },
    { name: 'Rajeshwari Natarajan', phone: '9790123987', count: 5 },
    { name: 'Vijay Anand', phone: '9940567123', count: 2 },
    { name: 'Selvi Murugan', phone: '9841876543', count: 4 },
    { name: 'Venkatesh Prabhu', phone: '9840998877', count: 3 },
    { name: 'Archana Jayakumar', phone: '9962345678', count: 2 },
  ];

  const bookings: Booking[] = [];
  const targetSlots = slots.filter(s => s.slot_date === today || s.slot_date === tomorrow);

  sampleNames.forEach((sample, i) => {
    const slot = targetSlots[i % targetSlots.length] || targetSlots[0];
    const status = i < 2 ? 'checked_in' : 'confirmed';
    const codeNumber = 8400 + i * 17;
    bookings.push({
      id: `book-${i + 1}`,
      booking_code: `AYN-${codeNumber}`,
      slot_id: slot.id,
      customer_name: sample.name,
      customer_phone: sample.phone,
      visitor_count: sample.count,
      status: status,
      notes: i === 0 ? 'VIP Customer - Requesting consultation on wedding multi-shots' : undefined,
      created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
      slot: slot
    });
  });

  return bookings;
}
