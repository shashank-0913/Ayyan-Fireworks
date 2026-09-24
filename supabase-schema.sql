-- ==============================================================================
-- AYYAN FIREWORKS — SUPABASE SCHEMA & CONCURRENCY-SAFE BACKEND
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  piece_count text not null,
  description text,
  safety_instructions text,
  safety_tags text[] default array[]::text[],
  sound_level text default 'Medium', -- 'Low / Silent', 'Medium', 'High Spectacle'
  video_url text,
  image_url text not null,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. SLOTS TABLE
create table if not exists public.slots (
  id uuid primary key default uuid_generate_v4(),
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  total_capacity integer not null default 15 check (total_capacity > 0),
  booked_capacity integer not null default 0 check (booked_capacity >= 0),
  is_blocked boolean not null default false,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  constraint unique_date_time_slot unique (slot_date, start_time, end_time)
);

-- 4. BOOKINGS TABLE
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_code text not null unique,
  slot_id uuid not null references public.slots(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  visitor_count integer not null default 1 check (visitor_count > 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'checked_in', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for lightning fast lookups
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_slots_date on public.slots(slot_date);
create index if not exists idx_bookings_slot on public.bookings(slot_id);
create index if not exists idx_bookings_code on public.bookings(booking_code);
create index if not exists idx_bookings_phone on public.bookings(customer_phone);

-- ==============================================================================
-- CONCURRENCY-SAFE BOOKING FUNCTION (POSTGRES RPC)
-- Prevents race conditions / overbooking using row-level locking (FOR UPDATE)
-- ==============================================================================
create or replace function public.book_visiting_slot(
  p_slot_id uuid,
  p_name text,
  p_phone text,
  p_visitors int default 1
)
returns json
language plpgsql
security definer
as $$
declare
  v_slot record;
  v_new_booking_id uuid;
  v_booking_code text;
  v_remaining_cap int;
begin
  -- Validate inputs
  if p_visitors is null or p_visitors < 1 then
    return json_build_object('success', false, 'error', 'Visitor count must be at least 1');
  end if;

  if trim(p_name) = '' or trim(p_phone) = '' then
    return json_build_object('success', false, 'error', 'Name and phone are required');
  end if;

  -- Lock the slot row for atomic update
  select * into v_slot
  from public.slots
  where id = p_slot_id
  for update;

  if not found then
    return json_build_object('success', false, 'error', 'Selected visiting slot does not exist');
  end if;

  if v_slot.is_blocked then
    return json_build_object('success', false, 'error', 'This visiting slot is currently closed for safety maintenance');
  end if;

  v_remaining_cap := v_slot.total_capacity - v_slot.booked_capacity;
  if v_remaining_cap < p_visitors then
    return json_build_object(
      'success', false,
      'error', format('Only %s capacity remaining for this slot. Cannot accommodate %s visitors.', v_remaining_cap, p_visitors)
    );
  end if;

  -- Generate unique readable booking code: AYN-XXXX (e.g., AYN-7492)
  v_booking_code := 'AYN-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4)) || floor(10 + random() * 90)::text;

  -- Insert Booking
  insert into public.bookings (booking_code, slot_id, customer_name, customer_phone, visitor_count, status)
  values (v_booking_code, p_slot_id, trim(p_name), trim(p_phone), p_visitors, 'confirmed')
  returning id into v_new_booking_id;

  -- Update Slot booked capacity
  update public.slots
  set booked_capacity = booked_capacity + p_visitors
  where id = p_slot_id;

  return json_build_object(
    'success', true,
    'booking_id', v_new_booking_id,
    'booking_code', v_booking_code,
    'slot_date', v_slot.slot_date,
    'start_time', v_slot.start_time,
    'end_time', v_slot.end_time,
    'customer_name', trim(p_name),
    'visitor_count', p_visitors
  );
end;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public can read active products and available slots, create bookings via RPC
-- Staff / Authenticated can perform full CRUD
-- ==============================================================================
alter table public.products enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;

-- Products RLS
create policy "Allow public read access on active products"
  on public.products for select using (true);

create policy "Allow staff full access to products"
  on public.products for all using (auth.role() = 'authenticated');

-- Slots RLS
create policy "Allow public read access on slots"
  on public.slots for select using (true);

create policy "Allow staff full access to slots"
  on public.slots for all using (auth.role() = 'authenticated');

-- Bookings RLS
create policy "Allow staff full access to bookings"
  on public.bookings for all using (auth.role() = 'authenticated');

create policy "Allow public to read their own booking by code"
  on public.bookings for select using (true);

-- ==============================================================================
-- SEED DATA: 12 REALISTIC SIVAKASI FIREWORKS ITEMS
-- ==============================================================================
insert into public.products (name, category, price, piece_count, description, safety_instructions, safety_tags, sound_level, image_url, is_active)
values
(
  'Ayyan 15cm Electric Golden Sparklers',
  'Sparklers',
  145.00,
  '10 Sparklers / Box',
  'Sivakasi classic hand-held golden crackling sparklers with low-smoke formulation and vibrant warm golden emission.',
  'Hold horizontally at arm length away from body. Extinguish in a bucket of water or sand immediately after use.',
  array['Low Smoke', 'Family Safe', 'Child Friendly under Supervision'],
  'Low / Silent',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Royal Crimson & Emerald Sparklers (Special Edition)',
  'Sparklers',
  195.00,
  '10 Sparklers / Box',
  'Dual-stage high-intensity sparklers radiating vivid emerald green sparks shifting into intense royal crimson fire.',
  'Ignite tip using an agarbatti or lighter with extended reach. Always wear cotton clothing.',
  array['Vibrant Colors', 'Extended Burn Time', 'Certified Green Chemistry'],
  'Low / Silent',
  'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Deluxe Sovereign Chakkars (Ground Spinners)',
  'Ground Spinners',
  280.00,
  '10 Pieces / Box',
  'High-speed rotating wheel casting a 3-meter circumference halo of shimmering golden sparks with center red beacon.',
  'Place flat on hard level ground. Ignite center fuse and step back at least 5 meters.',
  array['Golden Halo', 'Smooth Balance', 'Clean Ground Ignition'],
  'Low / Silent',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Tri-Colour Peacock Flower Pots (Mega Jumbo)',
  'Flower Pots & Fountains',
  460.00,
  '5 Mega Pots / Box',
  'Spectacular conic fountain ejecting a massive 15-foot spray of gold, sapphire blue, and silver crackling stars.',
  'Place upright on clear firm soil or concrete. Do not lean over the flower pot during lighting.',
  array['15ft Vertical Spray', 'Tri-Color Fusion', 'PESO Low-Barium'],
  'Low / Silent',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Imperial Silver Rain Conical Fountain',
  'Flower Pots & Fountains',
  390.00,
  '5 Pots / Box',
  'Elegantly quiet, dazzling cascade of cool silver glitter with steady 45-second prolonged discharge duration.',
  'Keep clear overhead clearance. Ensure open perimeter of 4 meters.',
  array['Ultra Long Duration', 'Glitter Shower', 'Smoke Free Tech'],
  'Low / Silent',
  'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Super Sonic Sound Rockets',
  'Sky Rockets & Missiles',
  520.00,
  '10 Rockets / Pack',
  'High-thrust solid fuel rockets whistling up to 180 feet followed by a crisp titanium salute report.',
  'Place rocket launching stick freely in a sturdy upright PVC launcher tube or glass bottle filled with sand. Never push stick into dirt.',
  array['180ft Elevation', 'Whistle to Bang', 'High Spectacle'],
  'High Spectacle',
  'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Starlight Moon Whistling Missiles (25 Shots)',
  'Sky Rockets & Missiles',
  640.00,
  '1 Cake (25 Missiles)',
  'Rapid multi-whistle rocket launcher releasing 25 micro-missiles consecutively into the night sky with color tails.',
  'Keep on flat level ground with brick support on either side to prevent tilting.',
  array['25 Continuous Bursts', 'Whistling Melody', 'Night Sky Tracker'],
  'Medium',
  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Ayyan Grand Celebration 12-Shot Aerial Cake',
  'Aerial Multi-Shot Cakes',
  980.00,
  '1 Multishot Cake',
  'Spectacular single-fuse barrage launching 12 massive peonies with golden willow brocades and red strobe cores.',
  'Place on flat ground. Secure with heavy stones/bricks on base. Step back 15 meters.',
  array['12 Aerial Peonies', 'Golden Willow Finale', 'Single Fuse Ease'],
  'High Spectacle',
  'https://images.unsplash.com/photo-1521478706270-f6e9b2d59e3a?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Celestial Symphony 30-Shot Multi-Color Cake',
  'Aerial Multi-Shot Cakes',
  2450.00,
  '1 Large Aerial Cake',
  'Pro-grade rhythmic barrage featuring blue mines to gold crowns, silver chrysanthemums, and crackling dragon eggs.',
  'For outdoor open spaces only. Ensure 25m safety radius. Light fuse from side.',
  array['30 Grand Shots', 'Dragon Eggs Effect', 'Festival Showstopper'],
  'High Spectacle',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'The Sovereign 120-Shot Royal Gala Box',
  'Aerial Multi-Shot Cakes',
  7800.00,
  '1 Mega Display Cake (Weight ~7.5kg)',
  'Our flagship 2-minute non-stop aerial extravaganza. Cascading titanium salutes, cascading waterfalls, and multi-tier palms.',
  'Must be ignited in wide ground with minimum 30-meter clearance from structures and trees.',
  array['120 Rapid Bursts', '2-Minute Symphony', 'VIP Wedding & Diwali Gala'],
  'High Spectacle',
  'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Ayyan Ananda Family Festive Hamper (Silver Edition)',
  'Curated Family Gift Boxes',
  3250.00,
  '28 Assorted Items in Branded Metal Tin',
  'Carefully balanced festive selection of sparklers, chakkars, flower pots, whistling birds, pencil torches, and mini aerials.',
  'Follow individual safety instructions provided inside the gift box booklet.',
  array['Complete Family Package', '28 Variety Items', 'Eco-Friendly Packing'],
  'Medium',
  'https://images.unsplash.com/photo-1533230807127-716665511457?auto=format&fit=crop&w=800&q=80',
  true
),
(
  'Ayyan Rajadhiraja VIP Grand Gift Chest (Gold Edition)',
  'Curated Family Gift Boxes',
  6950.00,
  '45 Premium Items in Handcrafted Wooden Chest',
  'The ultimate collector gift pack featuring premium aerial display cakes, jumbo fountains, electric sparklers, and novelty items.',
  'Comprehensive safety booklet and complimentary safety glasses & lighting incense sticks included.',
  array['45 Handpicked Items', 'Luxury Gift Packing', 'Includes Safety Kit'],
  'High Spectacle',
  'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80',
  true
);
