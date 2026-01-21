# Chiang Ride - Architecture Documentation

> **Note:** This project uses TypeScript (`.ts`/`.tsx` files) with Next.js 16, React 19, and Tailwind CSS 4.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Landing   │  │    Renter   │  │ Shop Owner  │                 │
│  │    Page     │  │    Views    │  │   Views     │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│         │                │                │                         │
└─────────┼────────────────┼────────────────┼─────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     App Router                               │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │
│  │  │ (public)│  │  /login │  │  /auth  │  │      /app       │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│  ┌───────────────────────────┼───────────────────────────────────┐ │
│  │                    Server Actions                              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │ │
│  │  │ bookings │  │inventory │  │  renter  │                     │ │
│  │  └──────────┘  └──────────┘  └──────────┘                     │ │
│  └───────────────────────────┼───────────────────────────────────┘ │
│                              │                                      │
│  ┌───────────────────────────┼───────────────────────────────────┐ │
│  │                    Database Layer                              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │
│  │  │  shops   │  │ scooters │  │ bookings │  │ reviews  │      │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │ │
│  └───────────────────────────┼───────────────────────────────────┘ │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          SUPABASE                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │              │
│  │   + RLS      │  │  (Magic Link)│  │   (Images)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## User Roles & Permissions

### Renter (Default Role)
| Action | Allowed |
|--------|---------|
| Browse shops | ✓ |
| View scooter details | ✓ |
| Create bookings | ✓ |
| View own bookings | ✓ |
| Cancel own bookings | ✓ |
| Write reviews | ✓ |

### Shop Owner
| Action | Allowed |
|--------|---------|
| Everything a Renter can do | ✓ |
| View shop dashboard | ✓ (own shop only) |
| Manage inventory | ✓ (own shop only) |
| Update availability | ✓ (own scooters only) |
| Accept/reject bookings | ✓ (own shop only) |

### Admin (Future)
| Action | Allowed |
|--------|---------|
| Everything above | ✓ |
| Verify shops | ✓ |
| Manage users | ✓ |
| System configuration | ✓ |

---

## Route Structure

```
/                           # Landing page (public)
├── /login                  # Magic link authentication
├── /auth
│   ├── /callback          # OAuth callback handler
│   └── /signout           # Sign out handler
└── /app                    # Protected app routes
    ├── /                   # Dashboard (role-based)
    ├── /shops              # Shop directory with map
    │   └── /[id]          # Shop detail page
    ├── /scooters
    │   └── /[id]          # Scooter detail & booking
    ├── /bookings           # Renter's booking history
    └── /shop-admin         # Shop owner section
        ├── /               # Shop dashboard
        ├── /inventory      # Manage scooters
        │   ├── /new       # Add new scooter
        │   └── /[id]/edit # Edit scooter
        ├── /bookings       # Manage bookings
        ├── /calendar       # Availability calendar
        └── /settings       # Shop settings
```

---

## Component Hierarchy

```
<RootLayout>
├── <LanguageProvider>
│   └── <body>
│       ├── (public) pages render here
│       └── /app routes:
│           └── <AppShell>               # Navigation wrapper
│               ├── <Header>             # Top bar with role toggle
│               │   ├── <RoleToggle>     # Renter/Shop Owner switch
│               │   └── <LanguageToggle> # EN/TH switch
│               ├── <main>
│               │   └── {children}       # Page content
│               └── <MobileNav>          # Bottom navigation
│
└── Key Pages:
    ├── /app/shops
    │   ├── <ShopMap>                    # Interactive map
    │   └── <ShopList>
    │       └── <ShopCard>               # Individual shop
    │
    ├── /app/scooters/[id]
    │   ├── <ScooterDetails>
    │   ├── <AvailabilityGrid>           # 14-day calendar
    │   └── <BookingForm>
    │
    ├── /app/bookings
    │   └── <BookingCard>                # Booking with status
    │
    └── /app/shop-admin
        ├── <StatCards>                  # Dashboard metrics
        ├── <ScooterList>
        │   └── <ScooterCard>
        └── <BookingTable>
```

---

## Data Flow

### Booking Creation Flow
```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  User    │────>│ BookingForm  │────>│ createBooking│────>│ Supabase │
│ Selects  │     │  Component   │     │ Server Action│     │ Database │
│  Dates   │     │              │     │              │     │          │
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘
                        │                    │                   │
                        │                    │                   │
                 1. Validate dates    2. Check availability     │
                 2. Calculate total   3. Create booking         │
                 3. Submit form       4. Update availability    │
                                      5. Revalidate path        │
                                                                │
                        ┌────────────────────────────────────────┘
                        │
                        ▼
               ┌─────────────────┐
               │  Booking List   │
               │   Refreshes     │
               └─────────────────┘
```

### Shop Owner Booking Management
```
┌──────────────┐     ┌────────────────┐     ┌─────────────────┐
│ Shop Owner   │────>│ Booking Table  │────>│ updateBookingStatus│
│ Dashboard    │     │ with Actions   │     │  Server Action   │
└──────────────┘     └────────────────┘     └─────────────────┘
                            │                       │
                     View pending            Accept/Reject
                     bookings                booking
                                                    │
                                                    ▼
                                            ┌─────────────┐
                                            │  Supabase   │
                                            │  Updates    │
                                            │  Status     │
                                            └─────────────┘
```

---

## Database Schema

### Entity Relationship Diagram
```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  profiles   │       │    shops    │       │  scooters   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)     │
│ role        │  │    │ name        │  │    │ shop_id(FK) │──┐
│ full_name   │  │    │ description │  │    │ model       │  │
│ phone       │  │    │ address     │  │    │ engine_size │  │
│ created_at  │  │    │ latitude    │  │    │ price_per_day│ │
└─────────────┘  │    │ longitude   │  │    │ image_url   │  │
                 │    │ image_url   │  │    │ is_available│  │
                 │    │ owner_id(FK)│◄─┘    │ created_at  │  │
                 │    │ is_verified │       └─────────────┘  │
                 │    │ created_at  │                        │
                 │    └─────────────┘                        │
                 │                                           │
                 │    ┌─────────────┐       ┌───────────────┐│
                 │    │  bookings   │       │availability_  ││
                 │    ├─────────────┤       │    days       ││
                 │    │ id (PK)     │       ├───────────────┤│
                 └───>│ renter_id(FK)       │ id (PK)       ││
                      │ scooter_id(FK)◄─────│ scooter_id(FK)│◄┘
                      │ start_date  │       │ day           │
                      │ end_date    │       │ is_available  │
                      │ total_amount│       │ created_at    │
                      │ status      │       └───────────────┘
                      │ created_at  │
                      └─────────────┘

┌─────────────┐
│   reviews   │
├─────────────┤
│ id (PK)     │
│ shop_id(FK) │──> shops
│ user_id(FK) │──> profiles
│ rating      │
│ comment     │
│ created_at  │
└─────────────┘
```

### Key Constraints
- `availability_days`: UNIQUE(scooter_id, day)
- `bookings.status`: ENUM constraint on valid statuses
- All foreign keys have appropriate CASCADE rules

---

## Supabase Client Usage

### Three Client Types

| Client | Use Case | RLS |
|--------|----------|-----|
| `createBrowserClient()` | Client components, user actions | ✓ Enforced |
| `createServerClient()` | Server components, SSR with auth | ✓ Enforced |
| `createAdminClient()` | Seed scripts, migrations only | ✗ Bypassed |

**Current wrappers:**
- `src/lib/supabase/client.ts` exports `createClient()` (browser)
- `src/lib/supabase/server.ts` exports `createClient()` (server)
- `src/lib/supabase/admin.ts` exports `createAdminClient()` (service role)

### Current Issue (To Fix)
All server actions currently use admin client, bypassing RLS. This must be changed to use server client with proper auth checks.

```javascript
// WRONG (current)
import { createAdminClient } from '@/lib/supabase/admin'

// CORRECT (target)
import { createClient } from '@/lib/supabase/server'
```

---

## Authentication Flow

### Magic Link OTP (Currently Disabled)
```
┌──────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│ User │────>│ /login    │────>│ Supabase │────>│  Email   │
│      │     │ Enter     │     │ Send OTP │     │  Inbox   │
│      │     │ Email     │     │          │     │          │
└──────┘     └───────────┘     └──────────┘     └──────────┘
                                                     │
   ┌─────────────────────────────────────────────────┘
   │
   ▼
┌──────────┐     ┌───────────────┐     ┌──────────┐
│ Click    │────>│ /auth/callback │────>│  /app    │
│ Link     │     │ Verify token  │     │ Redirect │
│          │     │ Create session│     │          │
└──────────┘     └───────────────┘     └──────────┘
```

### Session Management
- Sessions stored in cookies (httpOnly)
- Middleware checks session on protected routes
- Auto-refresh handled by Supabase client

---

## State Management

### Current Approach
- **Server State**: Fetched directly in server components
- **Client State**: React useState for local UI state
- **URL State**: Search params for filters (not yet implemented)
- **Language**: Context provider with localStorage persistence

### Recommended Improvements
1. Use URL state for filters (shareable links)
2. Consider Zustand for complex client state
3. Implement optimistic updates for better UX

### UI State
- **Mobile drawers**: Use Vaul for bottom sheets (booking flow, filters)
- **Desktop modals**: Use Dialog from shadcn/ui
- **Side panels**: Use Sheet from shadcn/ui

---

## Environment Variables

### Required
```bash
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Server-side only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Optional (For Production)
```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXX

# Error Tracking
SENTRY_DSN=https://xxx@sentry.io/xxx

# Demo Mode (to be removed)
DEMO_SHOP_ID=uuid-here
```

---

## Security Model

### Row Level Security (RLS)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Own only | Own only | Own only | - |
| shops | All verified | Shop owners | Own shop | - |
| scooters | All | Shop owners | Own shop | Own shop |
| availability_days | All | Shop owners | Own shop | Own shop |
| bookings | Own or shop owner | Authenticated | Status only | - |
| reviews | All | Authenticated | Own only | - |

### Middleware Protection
```javascript
// src/middleware.js - Route protection
const protectedRoutes = ['/app']
const authRoutes = ['/login']

// Redirect unauthenticated users from /app to /login
// Redirect authenticated users from /login to /app
```

---

## Performance Considerations

### Server Components (Default)
- Shop listings
- Scooter details
- Dashboard statistics

### Client Components ('use client')
- Interactive forms
- Map component
- Filters with state
- Date pickers
- Role toggle

### Data Fetching Strategy
```javascript
// Server component with cache
export const revalidate = 60 // Revalidate every 60 seconds

async function ShopPage() {
  const shops = await getShops() // Cached
  return <ShopList shops={shops} />
}
```

---

## File Organization

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (no auth)
│   ├── app/               # Protected routes
│   ├── auth/              # Auth handlers
│   ├── login/             # Login page
│   └── actions/           # Server actions
│
├── components/            # Shared React components
│   ├── ui/               # shadcn/ui components (see below)
│   ├── bookings/         # Booking flow components
│   └── *.tsx             # Feature components
│
├── lib/                   # Utilities and configs
│   ├── supabase/         # Supabase client configs
│   ├── db/               # Database query functions
│   ├── types/            # TypeScript interfaces
│   ├── i18n/             # Internationalization
│   └── utils.ts          # Helper functions (cn utility)
│
└── hooks/                 # Custom React hooks
```

---

## UI Component Library

### Stack
- **shadcn/ui** - Copy-paste components built on Radix UI primitives
- **Vaul** - Mobile-native bottom drawer for booking flows
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icon library

### Available Components (`src/components/ui/`)

| Component | File | Use For |
|-----------|------|---------|
| **Button** | `button.tsx` | All buttons (variants: default, destructive, outline, secondary, ghost, link) |
| **Card** | `card.tsx` | Scooter cards, shop cards, content containers |
| **Dialog** | `dialog.tsx` | Desktop modals, confirmations |
| **Sheet** | `sheet.tsx` | Mobile slide-out panels (side drawers) |
| **Input** | `input.tsx` | Form text inputs |
| **Select** | `select.tsx` | Dropdown selections |
| **Calendar** | `calendar.tsx` | Date picker calendar |
| **Badge** | `badge.tsx` | Status indicators, tags |
| **Avatar** | `avatar.tsx` | User profile images |

### Custom Components

| Component | File | Use For |
|-----------|------|---------|
| **OptimizedImage** | `OptimizedImage.tsx` | Next.js Image with loading states |
| **StatusBadge** | `StatusBadge.tsx` | Booking/scooter status indicators |
| **ErrorBoundary** | `ErrorBoundary.tsx` | Error handling wrapper |
| **LoadingSkeleton** | `LoadingSkeleton.tsx` | Loading placeholders |

### Usage Examples

```tsx
// Button with variants
import { Button } from "@/components/ui/button"
<Button variant="default" size="lg">Book Now</Button>
<Button variant="outline" size="sm">Cancel</Button>

// Card for content
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
<Card>
  <CardHeader>
    <CardTitle>Honda PCX 160</CardTitle>
  </CardHeader>
  <CardContent>250 ฿/day</CardContent>
</Card>

// Mobile drawer (Vaul) for booking flow
import { Drawer } from "vaul"
<Drawer.Root>
  <Drawer.Trigger asChild>
    <Button>Select Dates</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
    <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
      {/* Date picker content */}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>

// Sheet for side panels
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost">Filters</Button>
  </SheetTrigger>
  <SheetContent side="right">
    {/* Filter options */}
  </SheetContent>
</Sheet>
```

### Adding New Components

```bash
# Add individual components
npx shadcn@latest add [component-name]

# Examples
npx shadcn@latest add tooltip
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
```

### Configuration

shadcn/ui is configured in `components.json`:
- Style: New York
- Base color: Neutral
- CSS variables: Enabled
- Icon library: Lucide
