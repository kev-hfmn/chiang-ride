# Chiang Ride - MVP Roadmap

**Goal:** Transform the current demo into a production-ready MVP
**Approach:** Keep it simple, efficient, and technically solid

> **Policy Note:** The project rules require **JavaScript-only** files. The repo currently uses `.ts`/`.tsx`. The plan below includes a dedicated JS migration phase.

---

## Phase 0: JS-Only Migration (Critical)

**Priority:** CRITICAL

**Tasks:**
- [ ] Migrate all `.ts`/`.tsx` files to `.js`/`.jsx` while preserving functionality
- [ ] Replace `tsconfig.json` with `jsconfig.json` and update ESLint config accordingly
- [ ] Convert `next.config` to `next.config.js`
- [ ] Update import paths after renames
- [ ] Remove TypeScript-only syntax from examples, actions, and components

---

## Phase 1: Security & Foundation (Critical) ✅ PARTIALLY COMPLETED

### 1.1 Fix Server Actions Architecture ✅ PARTIALLY COMPLETED
**Priority:** CRITICAL
**Files:** `src/app/actions/*.js`, `src/lib/db/reviews.js`, `src/lib/db/admin.js`

**Completed (MVP Demo Mode):**
- ✅ Added shop ownership verification to `bookings.ts` and `shop-settings.ts`
- ✅ All ownership checks use `getAdminShop()` which supports both auth and demo mode
- ✅ Scoped all mutations to shop owner's data only

**Deferred (Post-MVP):**
- Replace admin client with server client + full authentication
- Add Zod input validation
- Enable middleware route protection

**Solution:**
```javascript
// Create new pattern in src/app/actions/bookings.js
'use server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const BookingSchema = z.object({
  scooter_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  total_amount: z.number().positive(),
})

export async function createBooking(formData: FormData) {
  const supabase = await createServerClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Validate input
  const parsed = BookingSchema.safeParse({
    scooter_id: formData.get('scooter_id'),
    start_date: formData.get('start_date'),
    end_date: formData.get('end_date'),
    total_amount: Number(formData.get('total_amount')),
  })

  if (!parsed.success) {
    return { error: 'Invalid booking data' }
  }

  // Now RLS policies apply correctly
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...parsed.data,
      renter_id: user.id,
      status: 'requested',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/app/bookings')
  return { data }
}
```

**Tasks:**
- [ ] Create Zod schemas for all forms in `src/lib/validations/`
- [ ] Refactor `bookings.js` to use server client + validation
- [ ] Refactor `inventory.js` to use server client + validation
- [ ] Refactor `renter.js` to use server client + validation
- [ ] Refactor `shop-settings.js` to use server client + validation
- [ ] Remove admin-client usage from `lib/db/reviews.js`
- [ ] Keep admin client ONLY for seed scripts and migrations

---

### 1.2 Enable Authentication
**Priority:** CRITICAL
**Files:** `src/middleware.js`, `src/app/login/page.jsx`

**Tasks:**
- [ ] Uncomment and fix middleware route protection
- [ ] Test Magic Link OTP flow end-to-end
- [ ] Create proper session handling
- [ ] Add user profile creation on first login
- [ ] Remove hardcoded `demo-renter-123`

**Middleware Fix:**
```javascript
// src/middleware.js
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const isProtectedRoute = pathname.startsWith('/app')
  const isAuthRoute = pathname === '/login'

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}
```

---

### 1.3 Remove Hardcoded Demo Data
**Priority:** HIGH
**Files:** `src/lib/db/admin.js`

**Current Problem:**
```javascript
// Hardcoded shop name - breaks if someone creates shop with this name
.eq('name', 'Chiang Mai Scooters')
```

**Solution:**
Use environment variable or user's actual shop association:
```javascript
// For demo mode, use env var
const DEMO_SHOP_ID = process.env.DEMO_SHOP_ID

// For production, get from user's profile
const { data: profile } = await supabase
  .from('profiles')
  .select('shop_id')
  .eq('id', user.id)
  .single()
```

---

### 1.4 Add Rate Limiting
**Priority:** MEDIUM
**Location:** New middleware or server action wrapper

**Simple Implementation:**
```javascript
// src/lib/rate-limit.js
import { headers } from 'next/headers'

const rateLimitMap = new Map()

export function rateLimit(limit, windowMs) {
  return async function checkRateLimit() {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') ?? 'unknown'
    const now = Date.now()

    const record = rateLimitMap.get(ip)

    if (!record || now - record.timestamp > windowMs) {
      rateLimitMap.set(ip, { count: 1, timestamp: now })
      return { limited: false }
    }

    if (record.count >= limit) {
      return { limited: true }
    }

    record.count++
    return { limited: false }
  }
}
```

---

## Phase 2: Code Quality & Consistency ✅ COMPLETED

### 2.1 Fix Field Naming Inconsistencies ✅ COMPLETED
**Priority:** HIGH
**Files:** `src/lib/types/custom.js`, database queries

**Completed:**
- ✅ Verified latitude/longitude naming is consistent (`location_lat`/`location_lng`)
- ✅ Created `src/lib/constants/booking-status.ts` with centralized status definitions
- ✅ Created `src/components/ui/StatusBadge.tsx` for type-safe status rendering

**Deferred:**
- Replace remaining `any` usage with runtime validation
- Add JSDoc documentation for key modules

**Type Fixes:**
```javascript
// src/lib/types/custom.js
// Use shared constants + runtime validators instead of TS-only types
export const BOOKING_STATUSES = [
  'requested',
  'pending',
  'confirmed',
  'active',
  'completed',
  'cancelled',
  'rejected',
]

export function isValidStatus(status) {
  return ['requested', 'pending', 'confirmed', 'active',
          'completed', 'cancelled', 'rejected'].includes(status)
}
```

---

### 2.2 Extract Duplicated Code ✅ COMPLETED
**Priority:** MEDIUM
**Created:** `src/lib/constants/booking-status.ts`, `src/components/scooter-list/constants.ts`

**Completed:**
- ✅ Engine sizes and price ranges extracted to `src/components/scooter-list/constants.ts`
- ✅ Booking status colors and labels extracted to `src/lib/constants/booking-status.ts`
- ✅ StatusBadge component created for consistent status UI
- ✅ Applied StatusBadge to shop admin bookings and dashboard pages

**Example:**
```typescript
// src/lib/constants/booking-status.ts
export const BOOKING_STATUS_COLORS = {
  requested: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  // ... all statuses
} 

export const PRICE_RANGES = [
  { min: 0, max: 200, label: 'Under 200 THB' },
  { min: 200, max: 350, label: '200-350 THB' },
  { min: 350, max: 500, label: '350-500 THB' },
  { min: 500, max: Infinity, label: '500+ THB' },
] 

export const BOOKING_STATUS_COLORS = {
  requested: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  active: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
}
```

**Status Badge Component:**
```javascript
// src/components/status-badge.jsx
import { cn } from '@/lib/utils'
import { BOOKING_STATUS_COLORS } from '@/lib/constants'
import { BOOKING_STATUSES } from '@/lib/types/custom'

export function StatusBadge({ status }) {
  if (!BOOKING_STATUSES.includes(status)) return null
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      BOOKING_STATUS_COLORS[status]
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
```

---

### 2.3 Refactor Large Components ✅ COMPLETED
**Priority:** MEDIUM
**Target:** `src/components/bookings/rental-wizard.tsx` (was 358 lines, now ~210)

**Created Components:**
- ✅ `rental-wizard/steps.ts` - Step definitions (shared data)
- ✅ `rental-wizard/header.tsx` - Progress header with back button
- ✅ `rental-wizard/footer.tsx` - Navigation footer with error display
- ✅ `rental-wizard/photo-capture.tsx` - Photo capture UI
- ✅ `rental-wizard/success.tsx` - Success state view
- ✅ `rental-wizard/already-active.tsx` - Already active state view

**Scooter List Refactoring:**
- ✅ `scooter-list/types.ts` - Shared type definitions
- ✅ `scooter-list/constants.ts` - Engine sizes, price ranges
- ✅ `scooter-list/use-scooter-filters.ts` - Reusable filter hook
- ✅ `scooter-list/filters.tsx` - Filter UI component
- ✅ `scooter-list/scooter-card.tsx` - Reusable card component

---

### 2.4 Create Service Layer
**Priority:** MEDIUM
**Create:** `src/lib/services/`

**Booking Service:**
```javascript
// src/lib/services/booking.js
import { BOOKING_STATUSES } from '@/lib/types/custom'

export class BookingService {
  constructor(supabase) {
    this.supabase = supabase
  }

  async create(data) {
    // Validation, availability check, insert
  }

  async updateStatus(id, status) {
    // Status transition validation
  }

  async getForUser(userId) {
    // Fetch user's bookings with related data
  }

  async getForShop(shopId) {
    // Fetch shop's bookings with related data
  }
}
```

---

## Phase 3: Performance Optimization

### 3.1 Fix Image Loading
**Priority:** HIGH
**Files:** `next.config.js`, components using images

**Config Fix:**
```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'iili.io' },
      { hostname: 'images.unsplash.com' },
      { hostname: '*.supabase.co' },
    ],
  },
}
```

**Component Fix:**
```javascript
// Replace all <img> with next/image
import Image from 'next/image'

<Image
  src={shop.image_url}
  alt={shop.name}
  width={400}
  height={300}
  className="object-cover"
/>
```

---

### 3.2 Fix N+1 Queries
**Priority:** HIGH
**Files:** `src/lib/db/shops.js`

**Current (Bad):**
```javascript
const scooters = await supabase.from('scooters')...
const bookings = await supabase.from('bookings').in('scooter_id', ids)...
const availability = await supabase.from('availability_days').in('scooter_id', ids)...
```

**Fixed (Single Query with Joins):**
```javascript
const { data: scooters } = await supabase
  .from('scooters')
  .select(`
    *,
    bookings!inner (
      id,
      status,
      start_date,
      end_date
    ),
    availability_days (
      day,
      is_available
    )
  `)
  .eq('shop_id', shopId)
```

---

### 3.3 Database-Level Aggregations
**Priority:** MEDIUM
**Files:** `src/lib/db/reviews.js`

**Create SQL Function:**
```sql
-- In supabase/migrations/
CREATE OR REPLACE FUNCTION get_shop_rating(shop_uuid UUID)
RETURNS TABLE (average_rating NUMERIC, review_count BIGINT) AS $$
  SELECT
    COALESCE(AVG(rating), 0) as average_rating,
    COUNT(*) as review_count
  FROM reviews
  WHERE shop_id = shop_uuid
$$ LANGUAGE SQL;
```

**Use in Code:**
```javascript
const { data } = await supabase.rpc('get_shop_rating', { shop_uuid: shopId })
```

---

### 3.4 Add Pagination
**Priority:** MEDIUM
**Files:** Shop and scooter listings

**Implementation:**
```javascript
// src/lib/db/shops.js
export async function getShops(page = 1, limit = 12) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count } = await supabase
    .from('shops')
    .select('*', { count: 'exact' })
    .eq('is_verified', true)
    .range(from, to)

  return {
    shops: data,
    total: count,
    pages: Math.ceil((count ?? 0) / limit),
    currentPage: page,
  }
}
```

---

### 3.5 Lazy Load Heavy Components
**Priority:** LOW
**Files:** `rental-wizard.jsx`

```javascript
// src/app/app/scooters/[id]/page.jsx
import dynamic from 'next/dynamic'

const RentalWizard = dynamic(
  () => import('@/components/rental-wizard'),
  {
    loading: () => <RentalWizardSkeleton />,
    ssr: false
  }
)
```

---

## Phase 4: User Experience

### 4.1 Add Error Boundaries
**Priority:** HIGH
**Create:** `src/components/error-boundary.jsx`

```javascript
'use client'

export function ErrorBoundary({
  children,
  fallback
}) {
  return (
    <ErrorBoundaryInner fallback={fallback}>
      {children}
    </ErrorBoundaryInner>
  )
}

// Use in layouts
export default function AppLayout({ children }) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </ErrorBoundary>
  )
}
```

---

### 4.2 Fix Language Toggle
**Priority:** MEDIUM
**Files:** `src/lib/i18n/language-context.jsx`

**Current (Bad):**
```javascript
window.location.reload()  // Loses all state
```

**Fixed:**
```javascript
const [language, setLanguageState] = useState(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en'
  }
  return 'en'
})

const setLanguage = (lang) => {
  setLanguageState(lang)
  localStorage.setItem('language', lang)
  // No reload - React re-renders with new translations
}
```

---

### 4.3 Add Loading States
**Priority:** MEDIUM
**Create:** Skeleton components

```javascript
// src/components/skeletons/scooter-card-skeleton.jsx
export function ScooterCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-t-lg" />
      <div className="p-4 space-y-2">
        <div className="bg-gray-200 h-4 w-3/4 rounded" />
        <div className="bg-gray-200 h-4 w-1/2 rounded" />
      </div>
    </div>
  )
}
```

---

## Phase 5: Testing & Quality

### 5.1 Add Core Tests
**Priority:** HIGH
**Create:** `__tests__/` directories

**Test Structure:**
```
__tests__/
├── lib/
│   ├── validations.test.js  # Zod schemas
│   └── utils.test.js        # Utility functions
├── components/
│   ├── status-badge.test.jsx
│   └── booking-form.test.jsx
└── actions/
    └── bookings.test.js     # Server action tests
```

**Example Test:**
```javascript
// __tests__/lib/validations.test.js
import { BookingSchema } from '@/lib/validations'

describe('BookingSchema', () => {
  it('validates correct booking data', () => {
    const result = BookingSchema.safeParse({
      scooter_id: '550e8400-e29b-41d4-a716-446655440000',
      start_date: '2026-02-01',
      end_date: '2026-02-05',
      total_amount: 1200,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid dates', () => {
    const result = BookingSchema.safeParse({
      scooter_id: '550e8400-e29b-41d4-a716-446655440000',
      start_date: 'invalid',
      end_date: '2026-02-05',
      total_amount: 1200,
    })
    expect(result.success).toBe(false)
  })
})
```

---

### 5.2 Add ESLint Rules
**Priority:** LOW
**File:** `eslint.config.mjs`

```javascript
export default [
  ...nextConfig,
  {
    rules: {
      'no-console': 'warn',
      'no-alert': 'error',
    }
  }
]
```

---

## Implementation Order

### Week 1: Critical Security
1. Create Zod validation schemas
2. Refactor server actions (remove admin client)
3. Enable authentication middleware
4. Remove hardcoded demo data

### Week 2: Code Quality
1. Fix field naming inconsistencies
2. Create shared constants
3. Add runtime validators
4. Replace alert() with toast notifications

### Week 3: Performance
1. Fix image loading (next/image + config)
2. Fix N+1 queries
3. Add database aggregations
4. Implement pagination

### Week 4: Code Quality
1. Extract duplicated code
2. Split large components
3. Create service layer
4. Add error boundaries

### Week 5: Testing & Polish
1. Add core tests
2. Fix language toggle
3. Add loading skeletons
4. Remove console.logs

---

## Success Criteria

### MVP Ready Checklist
- [ ] Authentication working end-to-end
- [ ] All server actions use proper auth + validation
- [ ] No `any` types in codebase
- [ ] No N+1 queries
- [ ] Images optimized with next/image
- [ ] Core user flows tested
- [ ] No console.logs in production
- [ ] Error boundaries in place
- [ ] Loading states for async operations

### Performance Targets
| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |

---

## Files to Create/Modify Summary

### New Files
```
src/
├── lib/
│   ├── validations/
│   │   ├── booking.js
│   │   ├── inventory.js
│   │   └── index.js
│   ├── constants.js
│   ├── rate-limit.js
│   └── services/
│       ├── booking.js
│       └── shop.js
├── components/
│   ├── error-boundary.jsx
│   ├── status-badge.jsx
│   ├── skeletons/
│   │   └── *.jsx
│   ├── rental-wizard/
│   │   └── *.jsx (split)
│   └── scooter-list/
│       └── *.jsx (split)
docs/
├── CODEBASE_ANALYSIS.md
└── MVP_ROADMAP.md
```

### Modified Files
```
src/
├── app/actions/*.js (all)
├── middleware.js
├── lib/
│   ├── types/custom.js
│   ├── db/shops.js
│   ├── db/reviews.js
│   └── i18n/language-context.jsx
├── next.config.js
└── eslint.config.mjs
```
