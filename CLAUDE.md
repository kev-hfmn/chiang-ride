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

### Directory Structure

```
src/
├── app/
│   ├── (public)/         # Landing page
│   ├── login/            # Magic link login
│   ├── auth/             # OAuth callback & signout routes
│   ├── app/              # Protected app routes
│   │   ├── shops/        # Renter: browse & book
│   │   ├── bookings/     # Renter: my bookings
│   │   └── shop-admin/   # Shop owner: dashboard, inventory, calendar
│   └── actions/          # Server actions (inventory, bookings, renter)
├── components/           # Shared UI components
└── lib/
    ├── supabase/         # Client configurations (client, server, admin)
    ├── db/               # Database query functions
    ├── types/            # TypeScript interfaces
    └── utils.ts          # cn() utility
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
```

### Demo Mode

Auth is disabled for demo. Hardcoded demo renter ID: `'demo-renter-123'`. The app shell (`src/app/app/app-shell.tsx`) has a role toggle to switch between Renter and Shop Owner views.

## Key Files

- `src/app/app/app-shell.tsx` - Role-based navigation with mode toggle
- `src/components/availability-grid.tsx` - Interactive 14-day calendar
- `src/middleware.ts` - Auth middleware (protections commented out)
- `src/lib/db/admin.ts` - Database query functions (getAdminShop, getAdminInventory)

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
