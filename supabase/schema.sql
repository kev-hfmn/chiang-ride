-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- PROFILES
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  role text check (role in ('renter', 'shop_owner', 'admin')) default 'renter',
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;

create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Trigger for new profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'renter');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SHOPS
create table shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) not null,
  name text not null,
  description text,
  address text,
  city text default 'Chiang Mai',
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table shops enable row level security;

create policy "Public read verified shops" on shops for select using (is_verified = true);
create policy "Authenticated read all shops" on shops for select using (auth.role() = 'authenticated');
create policy "Owner can update own shops" on shops for update using (auth.uid() = owner_id);
create policy "Owner can insert own shops" on shops for insert with check (auth.uid() = owner_id);
create policy "Admin can do everything on shops" on shops using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- SCOOTERS
create table scooters (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade not null,
  model text not null,
  brand text,
  engine_cc int,
  daily_price int,
  weekly_price int,
  monthly_price int,
  deposit_amount int,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table scooters enable row level security;

create policy "Authenticated users can read active scooters" on scooters for select using (is_active = true and auth.role() = 'authenticated');
create policy "Shop owner can insert scooters" on scooters for insert with check (
  exists (select 1 from shops where id = shop_id and owner_id = auth.uid())
);
create policy "Shop owner can update scooters" on scooters for update using (
  exists (select 1 from shops where id = shop_id and owner_id = auth.uid())
);
create policy "Admin can do everything on scooters" on scooters using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- AVAILABILITY
create table availability_days (
  id uuid primary key default gen_random_uuid(),
  scooter_id uuid references scooters(id) on delete cascade not null,
  day date not null,
  is_available boolean default true,
  note text,
  unique(scooter_id, day)
);
alter table availability_days enable row level security;

create policy "Authenticated users can read availability" on availability_days for select using (auth.role() = 'authenticated');
create policy "Shop owner can upsert availability" on availability_days for all using (
  exists (
    select 1 from scooters s
    join shops sh on s.shop_id = sh.id
    where s.id = scooter_id and sh.owner_id = auth.uid()
  )
);
create policy "Admin can do everything on availability" on availability_days using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
