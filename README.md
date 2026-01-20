# Chiang Ride MVP

A mobile-first scooter rental platform for transparency and trust in Chiang Mai.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- A Supabase project

### 2. Environment Setup
Rename `.env.local.example` (if exists) or create `.env.local` with your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Only needed for seeding
```

### 3. Database Setup
1. Go to your Supabase Dashboard > SQL Editor.
2. Copy the content of `supabase/schema.sql` and run it.
   - This creates tables: `profiles`, `shops`, `scooters`, `availability_days`.
   - Sets up Row Level Security (RLS) policies.
   - Sets up a trigger to automatically create a profile on user signup.

### 4. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Seeding Demo Data (Optional)
To populate the database with a verified shop and some scooters:
```bash
# Ensure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
node scripts/seed.js
```

## Features Implemented
- **Landing Page**: Public facing marketing page.
- **Authentication**: Email Magic Link login via Supabase.
- **Role System**: Renter (default), Shop Owner, Admin.
- **Dashboard**: Role-aware protected app shell (`/app`).
- **Shops Integration**:
  - List all verified shops.
  - Shop detail view with scooter inventory.
  - Availability calendar (14-day view).
- **Shop Admin**:
  - Manage owned shops (`/app/shop-admin`).
  - Toggle scooter availability (click on calendar dates).

## Next Steps
- [ ] Implement "Book Now" flow (create `bookings` table).
- [ ] Add image upload for Shop Logos and Scooter photos (Supabase Storage).
- [ ] Create Admin Dashboard to verify shops.
- [ ] Add Profile editing.
