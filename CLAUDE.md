# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chiang Ride is a mobile-first scooter rental platform for Chiang Mai, Thailand. Renters browse verified shops and book scooters without passport deposits. Shop owners manage inventory and availability.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

### Database Setup

```bash
# Run schema in Supabase SQL Editor
# Content: supabase/schema.sql

# Seed demo data (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
node scripts/seed.js
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router, TypeScript, React 19
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Magic Link OTP (currently disabled for demo)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix primitives), Vaul (drawers), Framer Motion
- **Maps**: Leaflet + react-leaflet

### Directory Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Magic link login
│   ├── auth/                 # OAuth callback & signout routes
│   ├── (renter)/             # Renter route group
│   │   ├── dashboard/        # Renter home
│   │   ├── shops/            # Browse shops & scooters
│   │   ├── scooters/[id]/    # Scooter detail
│   │   ├── bookings/         # My bookings
│   │   └── profile/          # User profile
│   ├── (admin)/admin/        # Shop owner route group
│   │   ├── inventory/        # Manage fleet
│   │   ├── bookings/         # View bookings
│   │   ├── calendar/         # Availability calendar
│   │   └── settings/         # Shop settings
│   └── actions/              # Server actions (inventory, bookings, renter, shop-settings)
├── components/
│   ├── ui/                   # shadcn/ui components (button, card, dialog, sheet, etc.)
│   ├── admin/                # Shop owner components
│   └── bookings/             # Booking flow components
└── lib/
    ├── supabase/             # Client configurations (client, server, admin)
    ├── db/                   # Database query functions
    ├── i18n/                 # Internationalization (EN/TH)
    ├── types/                # TypeScript interfaces
    ├── constants/            # Booking status, etc.
    └── utils.ts              # cn() utility
```

### Supabase Clients

Three client types in `src/lib/supabase/`:
- **client.ts**: Browser client (anon key) - client-side queries
- **server.ts**: Server client (anon key + cookies) - SSR with auth
- **admin.ts**: Admin client (service role key) - bypass RLS for privileged ops

### Database Tables

Core tables with RLS enabled: `profiles`, `shops`, `scooters`, `availability_days`, `bookings`

Schema defined in `supabase/schema.sql`. RLS policies control access by role (renter, shop_owner, admin).

### Server Actions Pattern

Server actions in `src/app/actions/` use admin client for demo mode:
```typescript
// Example: src/app/actions/inventory.ts
'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminShop } from '@/lib/db/admin'

export async function addScooterAction(formData: FormData) {
  const shop = await getAdminShop()  // Gets user's shop or demo shop
  const supabase = createAdminClient()
  // ... perform operation
  revalidatePath('/admin/inventory')
}
```

### Demo Mode

Auth is disabled for demo. The app shell (`src/components/app-shell.tsx`) detects mode from URL path (`/admin` vs `/dashboard`). Demo shop "Chiang Mai Scooters" is loaded when no authenticated user exists.

### Internationalization

Uses React Context for EN/TH translations:
```typescript
import { useLanguage } from '@/lib/i18n/language-context'
const { t, language, setLanguage } = useLanguage()
// Usage: t('bookNow'), t('perDay')
```
Translations defined in `src/lib/i18n/translations.ts`.

## Key Files

- `src/components/app-shell.tsx` - Role-based navigation with Renter/Shop mode toggle
- `src/components/availability-grid.tsx` - Interactive 14-day availability calendar
- `src/lib/db/admin.ts` - Database queries (getAdminShop, getAdminInventory, getAdminBookings)
- `src/lib/types/custom.ts` - TypeScript interfaces (Shop, Scooter, Booking, BookingStatus)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
