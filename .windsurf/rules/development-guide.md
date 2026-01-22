---
trigger: always_on
---



## Critical Rules (MUST READ)

### ⛔ NEVER Do This

- ❌ Create custom card implementations - Use `<Card>` component
- ❌ Create custom modals - Use `<Modal>`, `<ConfirmModal>`, or `<FormModal>`
- ❌ Use `alert()` - BANNED (use `showToast()` instead)
- ❌ Use inline styles - BANNED (use Tailwind classes)
- ❌ Use CSS modules or styled-components - BANNED (Tailwind only)
- ❌ Use ModalPortal - DEPRECATED (use unified Modal system)
- ❌ Fetch data without TanStack Query - Use existing hooks from `/hooks/`
- ❌ Exceed Firebase query limit of 20 items - Cost optimization
- ❌ Use `<img>` tags - Use `<OptimizedImage>` component
- ❌ Create abstractions for single use - Keep it simple
- ❌ Add features not requested - Stick to requirements

### ✅ ALWAYS Do This
- ✅ USE ONLY MCP SUPABASE-CHIANG WHEN DECIDING BETWEEN MCP STARTING WITH "SUPABASE"
- ✅ Use unified Card component for all card-like UIs
- ✅ Use unified Modal components for all dialogs
- ✅ Use TanStack Query hooks for data fetching
- ✅ Use optimistic updates for user actions (bookmarks, likes, joins)
- ✅ Use toast notifications for user feedback
- ✅ Add loading states to all async operations
- ✅ Wrap Firebase calls in try/catch with error handling
- ✅ Use Tailwind CSS classes for all styling
- ✅ Add `'use client'` when using hooks or browser APIs
- ✅ Test on mobile viewports (responsive design required)
- ✅ Use semantic HTML (buttons are buttons, not divs)
- ✅ Clean up Firebase listeners in useEffect return

## Core Principles

1. **Use existing patterns** - Don't reinvent. We have established component systems.
2. **Performance first** - Every decision should consider Firebase read costs and bundle size.
3. **Accessibility matters** - Use semantic HTML and ARIA labels.
4. **Mobile responsive** - Test all components on mobile viewports.
5. **Follow conventions** - Consistency > cleverness.
6. **Keep it simple** - Minimum code needed for the current task.

---

## Project Architecture

### Tech Stack (Complete)

**Core Framework:**
- **Next.js** 16.0.8 (App Router, React 19, Turbopack enabled)
- **React** 19.0.0 (Server Components, Suspense, React Compiler enabled)

**Styling & UI:**
- **Tailwind CSS** 3.x (primary styling - no CSS modules, no styled-components)
- **shadcn/ui** + **Radix UI** (accessible component primitives)
- **Headless UI** (modals, dialogs)
- **Class Variance Authority (CVA)** (type-safe component variants)
- **Tailwind Merge** (className merging utility)
- **Framer Motion** (animations)
- **Lucide React** (icons)

**State Management:**
- **TanStack Query** v5 (server state, caching, data fetching)
- **Zustand** (minimal UI state)
- **React Context** (auth state via useAuth)

**Backend & Database:**
- **Firebase** 12.x (Firestore, Authentication, Storage, Cloud Functions)
- **Firebase Admin** (server-side SDK for ISR/SSR)
- **GeoFire Common** (geolocation proximity queries)

**Maps & Location:**
- **Mapbox GL** 3.x (interactive maps)
- **React Map GL** (React wrapper for Mapbox)

**Forms & Validation:**
- **React Easy Crop** (image cropping)
- **@tailwindcss/forms** (form styling)

**Utilities:**
- **date-fns** (date formatting and manipulation)
- **clsx** (conditional className composition)
- **lodash** (utility functions)
- **axios** (HTTP client)

**Performance & Analytics:**
- **@vercel/analytics** (user analytics)
- **@vercel/speed-insights** (Web Vitals tracking)
- **PostHog** (product analytics)
- **React Intersection Observer** (lazy loading)

**Social & Sharing:**
- **React Share** (social media sharing)
- **React Scroll** (smooth scrolling)

**Error Handling:**
- **React Error Boundary** (error boundaries)

**Development:**
- **ESLint** (linting with Next.js config)
- **Prettier** (code formatting)
- **Playwright** (E2E testing)
- **Vitest** (unit/component testing)

### Key Features
- Waste/litter reporting with geolocation
- Cleanup event organization and management
- User profiles (individual + organization accounts)
- Real-time messaging
- Social features (follow, support, bookmark)

---

## Component Architecture

### 1. ALWAYS Use Unified Components

**Card Components - REQUIRED**
```jsx
import { Card } from '@/components/ui/Card';

// Default card (most common)
<Card variant="default" padding="md">
  {content}
</Card>

// Interactive card (clickable)
<Card variant="interactive" padding="none" onClick={handleClick}>
  {content}
</Card>

// Other variants: "landing", "elevated", "flat"
```

**❌ NEVER do this:**
```jsx
<div className="bg-white rounded-3xl shadow-md p-6">
```

**✅ ALWAYS do this:**
```jsx
<Card variant="default" padding="md">
```

**Modal Components - REQUIRED**
```jsx
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormModal } from '@/components/ui/FormModal';

// General modal
<Modal isOpen={open} onClose={close} title="Title" size="md">
  <ModalBody>{content}</ModalBody>
  <ModalFooter>{actions}</ModalFooter>
</Modal>

// Confirmation dialog
<ConfirmModal
  isOpen={open}
  onClose={close}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure?"
  variant="danger"
/>

// Form modal
<FormModal
  isOpen={open}
  onClose={close}
  onSubmit={handleSubmit}
  title="Edit Profile"
  submitText="Save"
  isLoading={saving}
>
  {formFields}
</FormModal>
```

**❌ NEVER create custom modal implementations**
**❌ NEVER use ModalPortal (deprecated)**

### 2. Component File Structure

```jsx
'use client'; // Only if needed (hooks, browser APIs, interactivity)

// 1. Imports (grouped)
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getCleanups } from '@/lib/firebase/cleanups';

// 2. Component
export default function CleanupList() {
  // Hooks first
  const router = useRouter();
  const { userData } = useAuth();

  // State
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Handlers
  const handleClick = async () => {
    // ...
  };

  // Render
  return (
    <Card variant="default">
      {/* JSX */}
    </Card>
  );
}
```

### 3. Server vs Client Components

**Use Server Components (Default) For:**
- Static content
- Data fetching with Admin SDK
- SEO-critical pages
- No interactivity needed

**Use Client Components (`'use client'`) For:**
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, clipboard, etc.)
- Event handlers (onClick, onChange, etc.)
- Real-time Firebase listeners
- Next.js client hooks (useRouter, useSearchParams, etc.)

**✅ Best Practice:**
```jsx
// Server Component (app/cleanups/[id]/page.tsx)
export default async function CleanupPage({ params }) {
  const cleanup = await getCleanupServer(params.id);
  return <CleanupDetailClient initialCleanup={cleanup} />;
}

// Client Component (components/cleanups/CleanupDetailClient.tsx)
'use client';
export function CleanupDetailClient({ initialCleanup }) {
  // Interactive features, real-time updates
}
```

---

## State Management

### 1. TanStack Query for Server State (REQUIRED)

**Use existing query hooks from `/hooks/`:**

```jsx
import { useCleanups } from '@/hooks/use-cleanups';
import { useWaste } from '@/hooks/use-waste';
import { useUser } from '@/hooks/use-users';

function CleanupList() {
  const { data: cleanups, isLoading } = useCleanups({
    status: 'upcoming'
  });

  if (isLoading) return <CleanupListSkeleton />;

  return cleanups.map(cleanup => <CleanupCard key={cleanup.id} {...cleanup} />);
}
```

**Available Query Hooks (21 total):**
- `use-cleanups.js` - 7 hooks for cleanup operations
- `use-waste.js` - 7 hooks for waste operations
- `use-users.js` - 6 hooks for user operations
- `use-notifications-query.js` - 2 hooks for notifications

**❌ NEVER fetch directly with Firebase in components**
**✅ ALWAYS use TanStack Query hooks**

### 2. Optimistic Updates (REQUIRED for User Actions)

```jsx
import { useOptimisticToggle } from '@/hooks/use-optimistic-action';

const { isActive, toggle, isLoading } = useOptimisticToggle({
  initialState: hasBookmarked,
  onToggle: async (willBookmark) => {
    if (willBookmark) {
      await addBookmark(userId, itemId);
    } else {
      await removeBookmark(userId, itemId);
    }
    return willBookmark;
  },
  onError: (err) => {
    showToast.error('Failed to update');
  },
});

<Button onClick={toggle} isLoading={isLoading}>
  {isActive ? 'Bookmarked' : 'Bookmark'}
</Button>
```

**Use optimistic updates for:**
- Bookmarks, likes, claps
- Follow/unfollow, support
- Join/leave cleanups
- Any user action that should feel instant

### 3. Loading States (REQUIRED)

```jsx
import { useLoadingState } from '@/hooks/use-loading-state';

const { setLoading, isLoading } = useLoadingState();

async function handleDelete() {
  setLoading('delete', true);
  try {
    await deleteItem(id);
  } finally {
    setLoading('delete', false);
  }
}

<Button isLoading={isLoading('delete')}>Delete</Button>
```

---

## Firebase Conventions

### 1. Query Limits (Cost Optimization)

**Default limit: 20 items (NOT 50)**
```jsx
// ✅ Correct
const cleanups = await getDocs(query(ref, limit(20)));

// ❌ Wrong
const cleanups = await getDocs(query(ref, limit(50)));
```

### 2. Real-time Listeners (Proper Cleanup)

```jsx
useEffect(() => {
  const unsubscribe = subscribeToAttendees(cleanupId, (attendees) => {
    setAttendees(attendees);
  });

  return () => unsubscribe(); // REQUIRED cleanup
}, [cleanupId]);
```

### 3. Firestore Collection Structure

```
/users/{userId}/
/usersPrivate/{userId}/
/cleanups/{cleanupId}/
  /attendees/{userId}
  /interested/{userId}
  /comments/{commentId}
/waste/{wasteId}/
  /comments/{commentId}
/messenger/{chatRoomId}/
  /messages/{messageId}
```

### 4. Image Uploads

```jsx
import OptimizedImage from '@/components/ui/OptimizedImage';

<OptimizedImage
  src={waste.images?.[0]}
  thumb={waste.thumbImages?.[0]}
  original={waste.originalImages?.[0]}
  alt={waste.label}
  fill
  priority={isAboveFold}
/>
```

**Rules:**
- Max 10 images per waste report
- Use Firebase Storage with progress tracking
- Always use OptimizedImage component (lazy loading + blur placeholder)

---

## Styling Guidelines

### 1. Tailwind CSS Only

**✅ Correct:**
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-xl">
```

**❌ Wrong:**
```jsx
<div style={{ display: 'flex', padding: '1rem' }}>
```

### 2. Brand Colors (Exact Values)

```jsx
primary: '#46e27d'    // Bright green
secondary: '#26c9b0'  // Teal
gradient: 'linear-gradient(to right, #46e27d, rgba(70, 226, 125, 0.5), #26c9b0)'
```

**Use Tailwind classes:**
- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary`, `border-secondary`

### 3. Responsive Padding Pattern

```jsx
className="2xl:px-24 lg:px-16 md:px-10 sm:px-5"
```

### 4. Card Styling Pattern

```jsx
className="rounded-3xl shadow-md hover:shadow-xl transition-all duration-300"
```

**But use Card component instead of manual classes!**

---

## User Feedback

### 1. Toast Notifications (REQUIRED)

```jsx
import { useToast } from '@/hooks/use-toast';

const { showToast } = useToast();

// Success
showToast.success('Cleanup created!');

// Error
showToast.error('Failed to save', 'Please try again.');

// Info
showToast.info('Please sign in to continue');
```

**❌ NEVER use alert()** - 100% banned
**✅ ALWAYS use toast notifications**

### 2. Loading Skeletons

```jsx
import {
  CleanupCardSkeleton,
  WasteCardSkeleton,
  CleanupDetailsSkeleton
} from '@/components/ui/LoadingSkeleton';

{isLoading ? <CleanupCardSkeleton /> : <CleanupCard data={cleanup} />}
```

### 3. Error Handling

```jsx
try {
  await performAction();
  showToast.success('Success!');
} catch (error) {
  console.error('Action failed:', error);
  showToast.error('Something went wrong', 'Please try again.');
}
```

**ALWAYS wrap Firebase calls in try/catch**

---

## Next.js 16 Patterns

### 1. Server-Side Data Fetching (ISR)

```jsx
// app/cleanups/[id]/page.tsx
import { getCleanupServer } from '@/lib/firebase/server';

export const revalidate = 3600; // 1 hour ISR

export default async function CleanupPage({ params }) {
  const cleanup = await getCleanupServer(params.cleanupId);

  if (!cleanup) {
    notFound();
  }

  return <CleanupDetailClient initialCleanup={cleanup} />;
}
```

### 2. Dynamic Metadata (SEO)

```jsx
export async function generateMetadata({ params }) {
  const cleanup = await getCleanupServer(params.cleanupId);

  return {
    title: cleanup.title,
    description: cleanup.description,
    openGraph: {
      title: cleanup.title,
      images: cleanup.images,
    },
  };
}
```

### 3. Suspense Boundaries

```jsx
import { Suspense } from 'react';

<Suspense fallback={<CleanupDetailsSkeleton />}>
  <CleanupContent cleanupId={id} />
</Suspense>
```

### 4. Static Generation (Top Pages)

```jsx
export async function generateStaticParams() {
  const cleanups = await getAllCleanupIdsServer();

  return cleanups.slice(0, 100).map(cleanup => ({
    cleanupId: cleanup.slug || cleanup.cleanupId,
  }));
}
```

---

## Performance Optimizations

### 1. Image Optimization (REQUIRED)

**✅ Always use:**
```jsx
<OptimizedImage
  src={image.url}
  thumb={image.thumb}
  alt="description"
  fill
  priority={false}
/>
```

**❌ Never use:**
```jsx
<img src={url} alt="..." />
```

### 2. Dynamic Imports

```jsx
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/maps/CleanupLocationMap'),
  {
    loading: () => <MapSkeleton />,
    ssr: false
  }
);
```

### 3. React Compiler (Already Enabled)

- **Don't add manual `useMemo`/`useCallback`** unless profiling shows it's needed
- React Compiler handles most optimizations automatically
- Focus on correct dependencies instead

---

## Testing

### 1. E2E Tests (Playwright)

**When adding new features:**
- Add E2E test for critical user flows
- Test across desktop + mobile viewports
- Location: `tests/e2e/`

```bash
npm run test:e2e        # Run tests
npm run test:e2e:ui     # Interactive UI
```

### 2. Component Tests (Vitest)

**Note:** Currently has JSX-in-.js limitation (documented)
- Focus on E2E tests for now
- Component tests are optional

---

## Code Quality Standards

### 1. File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.js | `CleanupCard.js` |
| Hooks | use-kebab-case.js | `use-auth.js` |
| Utilities | kebab-case.js | `date-utils.js` |
| Pages | page.js / page.tsx | `app/cleanups/page.js` |

### 2. Component Naming Pattern

```
{Domain}{ComponentType}

Examples:
- CleanupCard (not CleanupListElement)
- WasteDetail (not ViewWaste)
- UserProfileHeader (not Header)
```

### 3. Import Organization

```jsx
// 1. React/Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party
import { useQuery } from '@tanstack/react-query';

// 3. Internal hooks
import { useAuth } from '@/hooks/use-auth';

// 4. Components
import { Card } from '@/components/ui/Card';

// 5. Utilities
import { formatDate } from '@/lib/utils/dates';

// 6. Firebase
import { getCleanups } from '@/lib/firebase/cleanups';
```

### 4. No Console.logs in Production

```jsx
// ✅ Development only
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}

// ❌ Never commit these
console.log('Debug stuff');
```

---

## Feature-Specific Patterns

### 1. Waste Reporting (7 Fields - Exact Order)

1. Label (text, required)
2. Description (textarea, optional)
3. Location Picker (Mapbox + draggable marker)
4. Amount Slider (0-3: "Just a piece" → "A big mess")
5. Image Upload (max 10)
6. Finding Date (Quick chips: Today, Yesterday, 2 days ago + DatePicker)
7. Cleaned Checkbox ("Did you clean it up?" → shows heart)

**Never change this order or structure**

### 2. Cleanup Events (5-Step Wizard)

- Step 1: Basic Info
- Step 2: Date & Time
- Step 3: Location
- Step 4: Settings
- Step 5: Images

**Status Flow:** 0 (Init) → 1 (Completed) → 2 (Results) / 99 (Cancelled)

### 3. Authentication

```jsx
import { useAuth } from '@/hooks/use-auth';

const { userData, loading } = useAuth();

if (userData?.type === 'guest') {
  showToast.info('Please sign in to continue');
  return;
}

// User is authenticated
```

---

## Common Patterns Reference

### Button with Loading

```jsx
<Button
  onClick={handleSubmit}
  isLoading={isLoading}
  disabled={isLoading}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### Conditional Rendering

```jsx
{isLoading ? (
  <CleanupCardSkeleton />
) : cleanups.length === 0 ? (
  <EmptyState message="No cleanups found" />
) : (
  cleanups.map(cleanup => <CleanupCard key={cleanup.id} {...cleanup} />)
)}
```

### Form Validation

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!title.trim()) newErrors.title = 'Title is required';
  if (!date) newErrors.date = 'Date is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  // Submit...
};
```

---

## What NOT to Do

### ❌ Don't Over-Engineer

- Don't add features not requested
- Don't refactor working code without reason
- Don't add comments where code is self-evident
- Don't create abstractions for one-time use

### ❌ Don't Break Patterns

- Don't create custom card implementations
- Don't create custom modal implementations
- Don't bypass TanStack Query for data fetching
- Don't use inline styles
- Don't use CSS modules

### ❌ Don't Ignore Performance

- Don't fetch data without caching (use TanStack Query)
- Don't skip image optimization
- Don't load heavy components eagerly (use dynamic imports)
- Don't exceed Firebase query limit of 20 items

### ❌ Don't Skip Accessibility

- Don't use `<div>` for buttons
- Don't forget alt text on images
- Don't skip ARIA labels for icon-only buttons
- Don't forget keyboard navigation

---

## Quick Decision Tree

**Need to show data in a card?**
→ Use `<Card>` component with appropriate variant

**Need a modal/dialog?**
→ Use `<Modal>`, `<ConfirmModal>`, or `<FormModal>`

**Need to fetch data?**
→ Use existing TanStack Query hook from `/hooks/`

**Need user feedback?**
→ Use `useToast()` hook (never alert())

**Need loading state?**
→ Use `useLoadingState()` hook or `<Skeleton>` components

**Need optimistic UI?**
→ Use `useOptimisticToggle()` or `useOptimisticAction()`

**Adding interactivity?**
→ Add `'use client'` directive (make it a client component)

**Need authentication?**
→ Use `useAuth()` hook

**Styling component?**
→ Use Tailwind CSS classes (no inline styles, no CSS modules)

---

## Resources

- **Documentation:** `/docs/CODE_STANDARDS.md` (587 lines)
- **Foundation Plan:** `/docs/foundation-plan/FOUNDATION_PLAN.md`
- **Testing Notes:** `/TESTING_NOTES.md`
- **Firebase Modules:** `/lib/firebase/` (17 modules, ~6,700 lines)
- **Query Hooks:** `/hooks/README_QUERY_HOOKS.md`

---

## Remember

1. **Consistency over cleverness** - Use established patterns
2. **Performance matters** - Every Firebase read costs money
3. **User experience first** - Optimistic updates, loading states, error handling
4. **Mobile responsive always** - Test on mobile viewports
5. **Accessibility is not optional** - Semantic HTML, ARIA labels

---

## How to Use This Guide

**Before starting any task:**
1. Read the "Critical Rules" section (⛔ NEVER / ✅ ALWAYS)
2. Check the "Quick Decision Tree" for your specific need
3. Reference the relevant pattern section
4. Review existing code in the same domain for consistency

**When stuck:**
1. Check `/docs/CODE_STANDARDS.md` for detailed standards
2. Look at similar components in the same feature directory
3. Search for existing hooks in `/hooks/` before creating new ones
4. Review Firebase modules in `/lib/firebase/` for data operations

**Before submitting:**
1. Verify mobile responsiveness
2. Test loading states and error scenarios
3. Check that all Firebase listeners are cleaned up
4. Ensure accessibility (semantic HTML, ARIA labels)
5. Run linter: `npm run lint`

---

## Version History

**v2.0 (January 13, 2026)**
- ✅ Added unified Card component system (24 components migrated)
- ✅ Added unified Modal component system (11 modals migrated)
- ✅ Added TanStack Query caching (21 hooks, 60-70% cost reduction)
- ✅ Added optimistic update patterns
- ✅ Added performance monitoring (Web Vitals)
- ✅ Completed Phase 3 foundation optimization
- ✅ Foundation score: 10/10

**v1.0 (Pre-Foundation)**
- Initial Next.js 15 migration from React 17
- Basic Firebase integration
- Component structure established

---

## Quick Reference Card

```
STYLING:        Use Tailwind CSS only
CARDS:          <Card variant="..." padding="...">
MODALS:         <Modal> | <ConfirmModal> | <FormModal>
DATA FETCHING:  TanStack Query hooks from /hooks/
FEEDBACK:       showToast.success/error/info()
LOADING:        useLoadingState() or <Skeleton>
OPTIMISTIC:     useOptimisticToggle/Action()
AUTH:           useAuth() hook
IMAGES:         <OptimizedImage> component
ICONS:          lucide-react
ANIMATIONS:     framer-motion
```

---

**Foundation Status: 10/10 - Production Ready** ✅

**Build features confidently on this solid foundation!**

For questions or clarifications, refer to:
- `/docs/CODE_STANDARDS.md` (587 lines, comprehensive)
- `/docs/foundation-plan/FOUNDATION_PLAN.md` (1920+ lines, complete optimization plan)
- `/TESTING_NOTES.md` (testing setup and known issues)

**Last Updated:** January 13, 2026
**Maintained by:** WasteWatch Development Team