# Design System v1.0 — Vimal Eye Hospital

> **LOCKED & FROZEN DESIGN SYSTEM**  
> **Status:** Production Approved (Design Freeze Active)  
> **Version:** v1.0  
> **Target Platform:** Web (Desktop First, Tablet, Mobile)  
> **Aesthetic Philosophy:** Apple Product Launch / VisionOS Digital Showcase (Ultra Premium, Glassmorphism, Floating UI)

---

## Table of Contents
1. [Design Philosophy & Visual Identity](#1-design-philosophy--visual-identity)
2. [UI Style & Glassmorphism Rules](#2-ui-style--glassmorphism-rules)
3. [Design Tokens & Theme System](#3-design-tokens--theme-system)
4. [Typography Scale](#4-typography-scale)
5. [Color Palette](#5-color-palette)
6. [Border Radius & Shadow System](#6-border-radius--shadow-system)
7. [Layout Rules & Container System](#7-layout-rules--container-system)
8. [Section Order & Hierarchy](#8-section-order--hierarchy)
9. [Component Registry & Permanent IDs](#9-component-registry--permanent-ids)
10. [Detailed Component Specifications](#10-detailed-component-specifications)
11. [Animation & Micro-Interactions](#11-animation--micro-interactions)
12. [Responsive Breakpoint Rules](#12-responsive-breakpoint-rules)
13. [Safe Modification Rules & Governance](#13-safe-modification-rules--governance)
14. [Do's and Don'ts](#14-dos-and-donts)

---

## 1. Design Philosophy & Visual Identity

Vimal Eye Hospital's digital presence is designed to feel like an **Apple Product Showcase**, breaking away from traditional, sterile hospital templates. It represents **Precision, Clarity, Innovation, and Clinical Trust**.

### Core Pillars
- **VisionOS Glassmorphism**: Translucent floating surfaces (`backdrop-filter: blur(28px)`), subtle frosted light borders, and depth layering.
- **Cinematic Spatial Hierarchy**: Centered ultra-large typography, ambient mesh gradient lighting, and floating depth badges.
- **Editorial Whitespace**: Generous breathing room (`clamp(100px, 12vw, 160px)` vertical section padding) allowing clinical content to feel calm and authoritative.
- **Zero Cheap Artifacts**: No harsh pure red/green, no generic Bootstrap cards, no sharp contrast blocks, no unstyled forms.

---

## 2. UI Style & Glassmorphism Rules

### Glassmorphism Formula
Every card, modal, floating navbar, and interactive panel MUST conform to the frosted glass standard:

```css
/* Light Surface Glass */
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.8);
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);

/* Dark Void Glass */
background: rgba(10, 16, 30, 0.65);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
```

### Depth Rules
- Floating elements must float above background layers using `position: fixed` or `position: relative` with ambient glow shadows (`0 20px 50px rgba(0,0,0,0.12)`).
- Hover effects MUST use subtle scale (`transform: scale(1.02)` to `scale(1.04)`) and upward translation (`transform: translateY(-8px)`).

---

## 3. Design Tokens & Theme System

Located in `src/index.css`:

```css
:root {
  /* Colors */
  --apple-blue:         #0071E3;
  --apple-blue-hover:   #0077ED;
  --apple-blue-glow:    rgba(0, 113, 227, 0.35);
  
  --dark-void:          #050811;
  --dark-surface:       #0B0F19;
  --dark-card:          rgba(15, 23, 42, 0.65);
  --dark-border:        rgba(255, 255, 255, 0.12);

  --ice-white:          #F5F5F7;
  --pure-white:         #FFFFFF;
  --surface-light:      #FAFBFD;

  --glass-light-bg:     rgba(255, 255, 255, 0.72);
  --glass-light-border: rgba(255, 255, 255, 0.6);
  --glass-dark-bg:      rgba(10, 16, 30, 0.65);
  --glass-dark-border:  rgba(255, 255, 255, 0.12);

  /* Text Colors */
  --text-dark-primary:   #000000;
  --text-dark-secondary: #1D1D1F;
  --text-muted:          #86868B;
  --text-light-muted:    #6E6E73;
  --text-white-pure:     #FFFFFF;
  --text-white-dim:      rgba(255, 255, 255, 0.75);

  /* Typography */
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Shadows */
  --shadow-glass:       0 20px 50px rgba(0, 0, 0, 0.06);
  --shadow-float:       0 30px 70px rgba(0, 0, 0, 0.12);
  --shadow-blue-glow:   0 12px 40px rgba(0, 113, 227, 0.28);
  --shadow-card-hover:  0 30px 80px rgba(0, 0, 0, 0.18);

  /* Radii */
  --r-pill: 9999px;
  --r-2xl:  36px;
  --r-xl:   28px;
  --r-lg:   20px;
  --r-md:   14px;
  --r-sm:   10px;

  /* Blur & Transitions */
  --blur-nav:   blur(28px);
  --blur-glass: blur(24px);
  --blur-modal: blur(36px);

  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-fast: 0.2s var(--ease-apple);
  --transition-base: 0.35s var(--ease-apple);
  --transition-slow: 0.6s var(--ease-apple);
}
```

---

## 4. Typography Scale

| Class / Role | Font Family | Font Size | Weight | Tracking | Line Height |
|---|---|---|---|---|---|
| `.apple-hero-title` | `Plus Jakarta Sans` | `clamp(48px, 7vw, 96px)` | 800 | `-0.04em` | 1.02 |
| `.apple-h1` | `Plus Jakarta Sans` | `clamp(48px, 6.5vw, 92px)` | 800 | `-0.04em` | 1.02 |
| `.apple-h2` | `Plus Jakarta Sans` | `clamp(36px, 4.5vw, 64px)` | 800 | `-0.03em` | 1.05 |
| `.apple-badge` | `Inter` | `0.78rem` | 700 | `0.05em` | 1.0 |
| Section Subtitle | `Inter` | `clamp(1.05rem, 1.8vw, 1.35rem)` | 400 | Normal | 1.6 |
| Card Title | `Plus Jakarta Sans` | `1.15rem` | 700 | `-0.02em` | 1.25 |
| Body Text | `Inter` | `0.9375rem` / `1rem` | 400 | Normal | 1.7 |

---

## 5. Color Palette

- **Apple Blue (`#0071E3`)**: Primary Brand Accent, Active Pills, Glow Highlights.
- **VisionOS Dark Void (`#050811`)**: Deep Section Backgrounds (Why Choose Us, Testimonials, Footer).
- **Ice White (`#F5F5F7`)**: Main Page Canvas Background.
- **Pure White (`#FFFFFF`)**: Glass Card Core Fill & High Contrast Headings.
- **Muted Text (`#86868B`)**: Secondary Labels & Captions.

---

## 6. Border Radius & Shadow System

### Radii Scale
- **Capsule Pills (`--r-pill: 9999px`)**: Navbar, Primary Buttons, Category Badges, Filter Pills.
- **Extra Large Cards (`--r-2xl: 36px`)**: Hero Visual Frame, Quick Action Tiles, Treatment Cards, Masonry Cards, Contact Cards.
- **Large Components (`--r-xl: 28px`)**: Floating Glass Badges, Modal Bodies, Inner Panels.
- **Medium Inputs (`--r-md: 14px`)**: Input Fields, Small Controls, Step Pills.

### Shadow System
- **Soft Ambient Glass**: `0 20px 50px rgba(0, 0, 0, 0.06)`
- **Floating Elevated Component**: `0 30px 70px rgba(0, 0, 0, 0.12)`
- **Apple Blue Neon Glow**: `0 12px 40px rgba(0, 113, 227, 0.28)`

---

## 7. Layout Rules & Container System

- **Max Container Width**: `1280px` (`margin: 0 auto`).
- **Container Padding**: `clamp(20px, 4vw, 48px)` side padding.
- **Section Padding**: `clamp(100px, 12vw, 160px)` top and bottom padding.
- **Section Alternation**: Light Canvas (`#F5F5F7`) → Dark Void (`#050811`) → Light Canvas → Dark Void.

---

## 8. Section Order & Hierarchy

The section order on the Home page is **PERMANENTLY LOCKED** in this exact order:

1. **Header Nav (NAV-001)**: Floating Glass Pill Navbar
2. **Hero Section (HERO-001)**: VisionOS Ambient Mesh Stage + Double Pill CTAs
3. **Quick Actions (QUICK-001)**: 5 Floating Glass Grid Tiles
4. **About Section (ABOUT-001)**: Asymmetric Glass Panel + Hospital Photo
5. **Treatments Showcase (TREAT-001)**: Micro-Phaco Cataract Hero Banner + 3D Glass Grid
6. **Why Choose Us (WHY-001)**: Dark Void Gradient Feature Cards
7. **Facility Gallery (GALLERY-001)**: Staggered Masonry + Glass Lightbox & 360° Modal
8. **Testimonials (TEST-001)**: VisionOS Glass Review Carousel + 5-Star Rating Pill
9. **Contact Section (CONTACT-001)**: Latur Split Card + Google Maps Embed
10. **Footer (FOOTER-001)**: Dark Luxury Glass Footer + Legal Modals

---

## 9. Component Registry & Permanent IDs

Every UI element is assigned a permanent identifier. **These IDs must never change.**

| Component ID | Component Name | Source File | Description |
|---|---|---|---|
| `NAV-001` | Floating Glass Navbar | `src/components/Header.jsx` | Centered floating glass pill with logo, links, and CTA |
| `HERO-001` | VisionOS Hero Stage | `src/components/Hero.jsx` | Centered 96px title, mesh glow, floating cards, CTAs |
| `QUICK-001` | Quick Action Grid | `src/components/QuickActions.jsx` | 5 glass tile cards with scale-up hover physics |
| `ABOUT-001` | Asymmetric About | `src/components/AboutSection.jsx` | Curved photo card + overlapping glass badge & pillars |
| `TREAT-001` | Treatment Showcase | `src/components/TreatmentsSection.jsx` | Cataract dark hero banner + 3D glass service cards |
| `TREAT-MOD-001` | Treatment Detail Modal | `src/components/TreatmentModal.jsx` | Full-screen frosted glass overlay modal |
| `WHY-001` | Why Choose Us Grid | `src/components/WhyChooseUs.jsx` | Dark void container with glowing gradient numbers |
| `GALLERY-001` | Masonry Gallery | `src/components/GallerySection.jsx` | Staggered photo grid, glass filters, lightbox & 360° modal |
| `TEST-001` | VisionOS Testimonials | `src/components/TestimonialsSection.jsx` | Floating glass review card carousel with rating pill |
| `CONTACT-001` | Latur Contact Split | `src/components/ContactSection.jsx` | Dark left card + light glass form + Latur Google Map |
| `FOOTER-001` | Dark Glass Footer | `src/components/Footer.jsx` | Ultra-spacious 4-column dark footer with policy modals |
| `BOOK-MOD-001` | Booking Wizard Modal | `src/components/BookingModal.jsx` | 4-step frosted glass booking modal wizard |
| `AI-BOT-001` | AI Eye Assistant | `src/components/AIAssistant.jsx` | Floating glass launcher & multilingual chat window |

---

## 10. Detailed Component Specifications

### NAV-001 (Floating Glass Navbar)
- **Position**: `fixed`, `top: 20px`, centered via `left: 0; right: 0; display: flex; justify-content: center`.
- **Dimensions**: `width: min(1080px, 92vw)`, `height: 64px`.
- **Styles**: `background: rgba(255,255,255,0.75)`, `backdrop-filter: blur(30px)`, `border-radius: 9999px`.

### HERO-001 (VisionOS Hero Stage)
- **Background**: `radial-gradient(circle at 50% 20%, rgba(0, 113, 227, 0.08) 0%, transparent 60%), #F5F5F7`.
- **Headline**: `"The Future of Vision Care."` with blue gradient span.
- **Stage**: Centered `16/9` curved card with two floating glass cards (`.apple-hero-float-left`, `.apple-hero-float-right`).

### CONTACT-001 (Latur Location Lock)
- **Hospital Address**: `Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512, Maharashtra, India`.
- **Coordinates**: `18.4017301, 76.5647644`.
- **Map Embed**: `https://maps.google.com/maps?q=18.4017301,76.5647644&t=&z=17&ie=UTF8&iwloc=&output=embed`.

---

## 11. Animation & Micro-Interactions

- **Hover Physics**: Spring-like scale (`transform: scale(1.03)`) and upward translation (`transform: translateY(-8px)`).
- **Easing Function**: `cubic-bezier(0.16, 1, 0.3, 1)` (Apple Standard Ease).
- **Transitions**: `0.35s var(--ease-apple)`.
- **Ambient Lighting**: Radial blur spots with keyframe opacity pulsing.

---

## 12. Responsive Breakpoint Rules

- **Desktop Large (≥ 1280px)**: Full multi-column grid layouts.
- **Desktop / Laptop (1100px - 1279px)**: 3-column quick actions, 2-column treatment grid.
- **Tablet (640px - 899px)**: Mobile toggle enabled, drawer active, single-column about/contact split.
- **Mobile (≤ 639px)**: Single column stacked grids, 100% width pill buttons, 36px heading sizes.

---

## 13. Safe Modification Rules & Governance

1. **Design Freeze Enforcement**: The approved homepage layout is locked. No prompt may redesign, restructure, or swap out approved sections.
2. **Single-Section Scope**: Future modifications must affect ONLY the explicitly requested section or component.
3. **Token Preservation**: `index.css` design tokens (`--apple-blue`, `--glass-light-bg`, `--r-2xl`, etc.) are permanent and MUST NOT be altered or removed.
4. **Location Lock**: All location strings MUST remain locked to **Latur, Maharashtra** (`Opposite Shantai Hotel, Ambejogai Road, Shivaji Chowk, Latur – 413512`).
5. **Versioning Control**: Any approved minor enhancement must increment version to `v1.1`, `v1.2`, etc. Major approved redesigns increment to `v2.0`.

---

## 14. Do's and Don'ts

### ✅ DO
- Keep `backdrop-filter: blur(...)` and frosted glass borders on all cards.
- Use `Plus Jakarta Sans` for titles and `Inter` for body text.
- Use Apple Blue (`#0071E3`) for primary actions and glowing accents.
- Preserve generous whitespace (`clamp(100px, 12vw, 160px)`).
- Maintain Latur location accuracy across all pages.

### ❌ DON'T
- Do NOT introduce generic white card grids or Bootstrap layouts.
- Do NOT use harsh primary red, green, or yellow colors.
- Do NOT remove backdrop blur or glass borders.
- Do NOT revert navigation to a full-width flat header.
- Do NOT invent fake statistics, fake awards, or fake doctor profiles.
