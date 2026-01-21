---
trigger: model_decision
description: Wastewatch Design System & Guidelines
globs: "**/*.{js,jsx,ts,tsx,css,md,html}"
---

# Wastewatch Design System

## 1. Core Vibe & Philosophy
**"Calm, Honest, Purpose-Driven"**
Wastewatch is a platform for environmental action, not a tech startup. The design should feel like a serene nature walk—approachable, organic, and trustworthy. We avoid hype, greenwashing, and "tech-bro" aesthetics.

*   **Keywords**: Organic, Rounded, Gentle, Clear, Optimistic, Human.
*   **Avoid**: High-tech, Cyberpunk, Corporate "SaaS" look, Sharp edges, Neon (except primary CTA), Dark mode, Standard AI-generated layouts.

## 2. Design Tokens

### 2.1 Colors
**Light Mode Only**. We do not use dark mode.

*   **Primary Action**: `primary` (#46e27d) - Use for CTAs, success states, and key highlights.
*   **Secondary**: `secondary` (#26c9b0) - Use for supporting elements and accents.
*   **Backgrounds**: Use soft, tinted backgrounds to create warmth and depth.
    *   `bg-nature-green-50` / `100` (#E0F2F1) - For "Nature/Action" sections.
    *   `bg-calm-blue-50` / `100` (#E3F2FD) - For "Water/Information" sections.
    *   `bg-earth-gray-50` / `100` (#F5F5F3) - For neutral sections.
*   **Text**:
    *   Headings: `text-nature-green-900` (Deep Teal) or `text-gray-900`.
    *   Body: `text-earth-gray-800` or `text-gray-700`.
    *   **Never** use pure black (#000000) for text; it is too harsh.

### 2.2 Typography
We use a specific font pairing to balance approachability with authority.

*   **Headings**: **Merriweather** (`font-heading`). A gentle serif that feels editorial and human.
    *   Usage: `h1`, `h2`, `h3`, large display text.
    *   Weight: Bold (700) or Semibold (600).
    *   Letter Spacing: Tight (`tracking-tight`).
*   **Body**: **Inter** (`font-sans`). Clean, legible, and functional.
    *   Usage: Paragraphs, UI text, buttons, labels, data.
    *   Weight: Regular (400) or Medium (500).

### 2.3 Shapes & Radius
**Everything is Rounded.**
Detailed harsh corners are forbidden.

*   **Cards**: `rounded-3xl` (24px) or `rounded-4xl` (32px).
*   **Buttons**: `rounded-full` (capsule).
*   **Images**: `rounded-2xl` or `rounded-3xl`.
*   **Sections**: Use organic, wavy dividers or curve-masked containers.

## 3. Component Guidelines

### 3.1 Cards
Cards are the primary container for content (Cleanups, Waste Reports, Profiles).
*   **Style**: Minimalist, clean white or very soft tint background.
*   **Padding**: Ample padding (`p-6` or `p-8`) to let content breathe.
*   **Border**: `rounded-3xl` or `rounded-4xl`.
*   **Shadow**: Soft, diffuse shadows (`shadow-sm`, `shadow-md`). **NO** hard, dark drop shadows.
*   **Behavior**: Interactive cards should have a subtle "lift" on hover (scale 1.02) or deep shadow (`shadow-xl`) transition.

### 3.2 Buttons
*   **Primary**: `bg-primary text-white rounded-full hover:scale-105 transition-transform active:scale-95`.
*   **Secondary**: `bg-nature-green-100 text-nature-green-800 rounded-full hover:bg-nature-green-200`.
*   **Ghost**: `text-gray-600 hover:text-primary hover:bg-gray-50 rounded-full`.

### 3.3 Visual Assets
*   **Icons**: Use **Lucide React**. Style them with rounded strokes.
*   **Bespoke SVG**: Use custom wavy dividers and organic shapes (blobs) for cleaner visual breaks.
*   **Images**: Use `OptimizedImage` component. Always round corners.

## 4. Layout & Spacing
*   **Mobile-First**: Design must work flawlessly on touch screens. Elements should stack organically.
*   **Fluidity**: Avoid rigid 12-column grids. Use asymmetrical layouts and overlapping sections where appropriate to break the "grid" feel.
*   **Whitespace**: Be generous. Use `py-24` or `py-32` for section spacing.

## 5. UI/UX "Do's and Don'ts"

### ✅ Do:
*   Use "Card" metaphors for data items (Cleanup Events, Profiles).
*   Use clear, human language (No buzzwords).
*   Use subtle micro-interactions (e.g., gentle wave ripple on hover, fade-in metrics).
*   Show impact through visuals (heatmaps, photos) rather than just numbers.

### ❌ Don't:
*   Use "Boxy" designs (0px or small border-radius).
*   Use Dark Mode (Wastewatch is a Light Mode app).
*   Use generic "Admin Dashboard" aesthetics (dense tables, tiny text).
*   Use standard centered Hero with generic stock photo.

## 6. Process: 90/10 Rule (Retained)
While we have strict guidelines, we leverage AI for the heavy lifting (90%) but rely on **Human Refinement (10%)** to ensure the "Vibe" is correct.
*   **Refine**: Manually tweak padding, colors, and ease-in animations to feel "organic" and not "generated".
*   **Check**: Does this look like a calm nature walk? If it looks like a spreadsheet or a crypto dashboard, REDESIGN it.