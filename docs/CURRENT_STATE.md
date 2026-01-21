# Chiang Ride - Current State Summary

> **Policy Note:** Project rules require **JavaScript-only** files. The repo is still TypeScript-heavy and must be migrated to `.js`/`.jsx`.

**Last Updated:** January 2026

---

## What Works

### Renter Features
| Feature | Status | Notes |
|---------|--------|-------|
| Landing page | ✓ Working | Clean, professional design |
| Shop browsing | ✓ Working | List view with images |
| Shop map view | ✓ Working | Interactive map with markers |
| Scooter details | ✓ Working | Shows specs, pricing |
| Availability calendar | ✓ Working | 14-day grid view |
| Booking creation | ✓ Working | Demo mode only |
| Booking history | ✓ Working | List of user's bookings |
| Language toggle | ✓ Working | EN/TH (causes page reload) |

### Shop Owner Features
| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard | ✓ Working | Basic stats cards |
| Inventory list | ✓ Working | View all scooters |
| Add scooter | ✓ Working | Basic form |
| Edit scooter | ✓ Working | Update details |
| Delete scooter | ✓ Working | With confirmation |
| Availability toggle | ✓ Working | Per-day toggle |
| Booking management | ✓ Working | Accept/reject bookings |

### UI/UX
| Feature | Status | Notes |
|---------|--------|-------|
| Mobile responsive | ✓ Working | Bottom navigation on mobile |
| Role toggle | ✓ Working | Switch Renter/Shop Owner views |
| Loading states | Partial | Basic spinners only |
| Error handling | Minimal | Console logs, no user feedback |

---

## What's Broken or Disabled

### Authentication
| Feature | Status | Issue |
|---------|--------|-------|
| Magic Link OTP | Disabled | Middleware protection commented out |
| Session management | Disabled | No actual user sessions |
| Route protection | Disabled | Anyone can access /app routes |
| User profiles | Bypassed | Using hardcoded demo user |

### Security
| Issue | Severity | Status | Location |
|-------|----------|--------|----------|
| Admin client everywhere | Critical | ✅ Partially Fixed | Shop ownership checks added to bookings/settings actions |
| RLS bypassed | Critical | ⚠️ Demo Mode | MVP uses admin client with ownership scoping |
| No input validation | High | Pending | All forms |
| No CSRF protection | Medium | Pending | Form submissions |
| No rate limiting | Medium | Pending | All endpoints |
| `alert()` usage | Medium | ✅ Fixed | Replaced with inline error messages |

### Performance
| Issue | Impact | Status | Location |
|-------|--------|--------|----------|
| N+1 queries | Slow page loads | ✅ Fixed | getScooters() now batches all queries |
| Unoptimized images | Slow loading | ✅ Fixed | OptimizedImage component created |
| No pagination | Memory issues at scale | Deferred | Shop/scooter lists (not critical for MVP) |
| In-memory calculations | Inefficient | ✅ Fixed | SQL aggregation functions created |
| `revalidate=0` | No caching | ✅ Fixed | Changed to 60 seconds |
| Unindexed foreign keys | Slow joins | ✅ Fixed | 10 indexes added via migration |
| RLS policy re-evaluation | Slow at scale | ✅ Fixed | Optimized to use (SELECT auth.uid()) |

---

## Demo Mode Limitations

### Hardcoded Values
```javascript
// These are hardcoded for demo:
const DEMO_RENTER_ID = 'demo-renter-123'
const DEMO_SHOP_NAME = 'Chiang Mai Scooters'
```

### Demo Behavior
1. **All bookings** created as "Demo Renter"
2. **Shop admin** always shows "Chiang Mai Scooters"
3. **No real auth** - anyone can access any page
4. **Role toggle** is client-side only, no persistence

---

## Technical Debt Summary

### Critical (Must Fix)
1. ✅ Server actions using admin client - **Partially fixed with ownership checks**
2. ⚠️ Authentication disabled - **Intentional for MVP demo mode**
3. No input validation
4. ⚠️ Hardcoded demo data - **Preserved for MVP showcase**

### High Priority
1. JS-only migration (remove TS/TSX)
2. ✅ Image optimization - **OptimizedImage component created**
3. ✅ N+1 query patterns - **Fixed in getScooters(), SQL aggregation for ratings**
4. ✅ Status badge duplication - **StatusBadge component created**
5. ✅ Field naming inconsistencies - **Verified as consistent**
6. ✅ Database performance - **10 indexes added, RLS policies optimized**
7. ✅ Code quality improvements - **A-level: Zero `any` types, structured logging, JSDoc**

### Medium Priority
1. ✅ Duplicate code (status colors, filters) - **Constants extracted, StatusBadge created**
2. ✅ Large components (rental-wizard) - **Refactored into 6 subcomponents**
3. ✅ Missing error boundaries - **ErrorBoundary added to app layout**
4. ✅ Loading skeletons - **Created for all major views**
5. ✅ Accessibility (aria-labels) - **Added to icon buttons**
6. ✅ Type safety - **All `any` types eliminated, proper interfaces added**
7. ✅ Logging - **Structured logger replaces console.log/error**
8. Language toggle reload issue

### Low Priority
1. Tests (zero coverage)

---

## Database State

### Tables Created
- [x] profiles
- [x] shops
- [x] scooters
- [x] availability_days
- [x] bookings
- [x] reviews

### RLS Policies
- [x] Defined in schema.sql
- [ ] Actually enforced (bypassed by admin client)

### Seed Data
- [x] Demo shop: "Chiang Mai Scooters"
- [x] Sample scooters with images
- [x] Availability data
- [ ] Demo bookings
- [ ] Demo reviews

---

## Component Inventory

### Large Components (Need Splitting)
| Component | Lines | Recommendation |
|-----------|-------|----------------|
| rental-wizard.tsx | 358 | Split into 5+ smaller components |
| scooter-list-with-filters.tsx | 245 | Extract filters, card, hook |
| app-shell.tsx | 180 | Extract header, nav components |

### Missing Components
| Component | Purpose | Priority |
|-----------|---------|----------|
| ErrorBoundary | Graceful error handling | High |
| StatusBadge | Reusable status display | Medium |
| LoadingSkeleton | Better loading UX | Medium |
| Pagination | List navigation | Medium |

---

## API Routes

### Existing
| Route | Purpose | Status |
|-------|---------|--------|
| /auth/callback | OAuth callback | Unused (auth disabled) |
| /auth/signout | Sign out | Unused (auth disabled) |

### Missing (For Production)
| Route | Purpose |
|-------|---------|
| /api/webhooks/stripe | Payment processing |
| /api/notifications | Email/SMS triggers |
| /api/admin/* | Admin operations |

---

## Environment Setup

### Required Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=✓ Set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✓ Set
SUPABASE_SERVICE_ROLE_KEY=✓ Set
```

### Image Domains Configured
```javascript
// next.config.ts (to migrate to .js)
images: {
  remotePatterns: [
    { hostname: 'iili.io' }  // ⚠️ Missing: images.unsplash.com
  ]
}
```

---

## Known Bugs

### High Impact
1. **Shop lookup fails** if "Chiang Mai Scooters" doesn't exist
2. **Language toggle** loses all form state on switch
3. **Booking dates** can overlap (no validation)

### Medium Impact
1. **Status colors** inconsistent between pages
2. **Mobile nav** can be covered by modals
3. **Filter state** resets on navigation

### Low Impact
1. **Console.logs** visible in production
2. **Empty states** not styled for some lists
3. **Loading spinners** too generic

---

## Metrics

| Metric | Current | Target |
|--------|---------|--------|
| TypeScript Coverage | ~90% | 0% (migrate to JS) |
| `any` Type Usage | 10+ | 0 |
| Test Coverage | 0% | 80%+ |
| Console.logs | 5+ | 0 |
| Components >200 lines | 3 | 0 |
| Duplicate Code Blocks | 5+ | 0 |

---

## Deployment Readiness

### Blockers for Production
- [ ] Authentication must be enabled
- [ ] Server actions must use proper auth
- [ ] Input validation must be added
- [ ] Hardcoded values must be removed
- [ ] Image domains must be configured

### Nice to Have
- [ ] Error tracking (Sentry)
- [ ] Analytics (GA4)
- [ ] Performance monitoring
- [ ] Automated tests

---

## Quick Reference: Key Files

### Configuration
- `next.config.ts` - Next.js config (to migrate to .js)
- `tailwind.config.ts` - Styling config
- `supabase/schema.sql` - Database schema

### Entry Points
- `src/app/page.tsx` - Landing page (to migrate to .jsx)
- `src/app/app/page.tsx` - Dashboard (to migrate to .jsx)
- `src/middleware.ts` - Auth middleware (to migrate to .js)

### Data Layer
- `src/lib/supabase/` - Client configs
- `src/lib/db/` - Query functions
- `src/app/actions/` - Server actions

### Types
- `src/lib/types/custom.ts` - App interfaces (to migrate to .js + JSDoc)
- `src/lib/types/supabase.ts` - Generated DB types (remove once JS-only)
