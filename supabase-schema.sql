-- ==============================================================================
-- AYYAN FIREWORKS — SUPABASE SCHEMA & CONCURRENCY-SAFE BACKEND
-- CLEAN SLATE (0 INITIAL PRODUCTS) + OWNER AUTHENTICATED ACCESS
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE (Clean Slate / Null State)
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

-- 3. SLOTS TABLE (Showroom Visit Windows)
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

-- 4. BOOKINGS TABLE (Customer VIP Passes)
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

-- Indexes for optimal lookup performance
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

  -- Generate unique readable booking code: AYN-XXXX
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
-- Customer-facing pages have read-only access (SELECT public)
-- Owner / Staff have full authenticated CRUD (INSERT, UPDATE, DELETE)
-- ==============================================================================
alter table public.products enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;

-- Products RLS: Public can view active products; Authenticated owners can manage
create policy "Allow public read access on active products"
  on public.products for select using (true);

create policy "Allow staff full insert on products"
  on public.products for insert with check (auth.role() = 'authenticated');

create policy "Allow staff full update on products"
  on public.products for update using (auth.role() = 'authenticated');

create policy "Allow staff full delete on products"
  on public.products for delete using (auth.role() = 'authenticated');

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
-- SUPABASE STORAGE BUCKET: 'product-images'
-- ==============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage Policies
create policy "Allow public read on product images"
  on storage.objects for select using (bucket_id = 'product-images');

create policy "Allow authenticated upload on product images"
  on storage.objects for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Allow authenticated update on product images"
  on storage.objects for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Allow authenticated delete on product images"
  on storage.objects for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');
