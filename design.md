# BAJUS Website Revamp — UI/UX Design System & Guidelines

This document details the visual style, design tokens, typography, grid layouts, and user experience rules governing the BAJUS (Bangladesh Jewellers' Association) website revamp. Use this guide to maintain aesthetic consistency across new pages and components.

---

## 1. Design Language & Brand Identity

The BAJUS digital interface is designed to evoke **legacy, premium quality, trust, and national heritage**. The combination of fine serif typography with deep charcoal background bands and gold accents creates a high-end editorial feel akin to luxury brand catalogs and prestigious trade institutions.

---

## 2. Color Palette (Design Tokens)

The brand uses a highly curated, minimal, and harmonious palette. Avoid generic bright primary colors.

| Token Name | Hex Value | Tailwind Class Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Cream** | `#fcfaf2` | `bg-cream` / `text-cream` | Core body background. Soft on the eyes compared to stark white. |
| **Cream 50** | `#fdfbf5` | `bg-cream-50` | Secondary section background (e.g., News sections, alternate blocks). |
| **Gold** | `#b8860b` | `bg-gold` / `text-gold` | Primary accent color. Used for badges, links, active states, and focus states. |
| **Gold Light** | `#c9a24c` | `text-gold-light` | Hover accents, chart fills, or subheadings on dark backgrounds. |
| **Gold Soft** | `#efe6cf` | `bg-gold-soft` | Subtle container background alerts or highlighting. |
| **Charcoal** | `#27272a` | `bg-charcoal` / `text-charcoal` | Primary readable text, dark section dividers, footer background. |
| **Ink** | `#1a1a1a` | `bg-zinc-900` | Header overlays, dark hero sections, primary branding surfaces. |

---

## 3. Typography Hierarchy

The type scales are optimized for high readability, blending global sans-serif readability with elegant editorial serif headers.

### Core Typefaces:
1. **Primary Serif:** `Playfair Display`, `Cormorant Garamond` (used for editorial headers, blockquotes, dates).
2. **Primary Sans-Serif:** `Inter` (used for body copy, buttons, labels, and numeric figures).
3. **Bengali Sans-Serif:** `Hind Siliguri`, `Noto Sans Bengali` (harmonized height to display beside Inter seamlessly).

### Hierarchy Rules:
- **Hero Headers (`H1`):** `font-serif text-4xl md:text-6xl tracking-tight leading-[1.05]`
- **Section Headers (`H2`):** `font-serif text-3xl md:text-4xl leading-tight`
- **Sub-headings / Cards (`H3`):** `font-serif text-xl leading-snug`
- **Utility / Overlines (Uppercase):** `text-[11px] uppercase tracking-[0.25em] font-semibold text-gold`
- **Body Copy:** `text-sm md:text-base text-zinc-600 leading-relaxed font-light`

---

## 4. Spacing, Grid & Responsive Layouts

### Spacing Guidelines:
- **Consistent Gaps:** Rely strictly on Tailwind's default spacing steps. Use `gap-6` or `gap-8` for standard grid configurations, and `gap-10` to `gap-16` for major section splits.
- **Section Padding:** Sections should feel airy. Avoid tight paddings. Use `py-20` on smaller pages and `py-24` on major pages.
- **Standard Width Constraint:** All main content segments are wrapped in:
  ```html
  <div class="max-w-7xl mx-auto px-6"></div>
  ```

### Responsive Grids:
- **Homepage Stats:** Grid breaks from 2 columns on mobile/tablet to 4 columns on large displays:
  ```html
  <div class="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-200"></div>
  ```
- **News / Press Cards:** Grid transitions from 1 column on mobile to 3 columns on medium/large screens:
  ```html
  <div class="grid md:grid-cols-3 gap-10"></div>
  ```
- **About/President layouts:** Uses two unequal columns breaking from a single stacked column on mobile:
  ```html
  <div class="grid lg:grid-cols-12 gap-16 items-center">
    <div class="lg:col-span-7">...</div>
    <div class="lg:col-span-5">...</div>
  </div>
  ```

---

## 5. UI Components & Elements

### A. Gold Accents
- **Gold Rule:** A minimalist inline separator block (`.gold-rule` class in CSS) used to draw attention to titles.
  ```html
  <span class="inline-block w-14 h-[2px] bg-gold mb-4"></span>
  ```

### B. Buttons
1. **Solid Gold Button (`.btn-gold`):**
   - Style: Dark gold background, cream text, sharp edges (2px border radius or square), tracked-out sans-serif text.
   - Tailwind equivalent: `bg-gold text-cream text-[11px] font-bold tracking-widest uppercase px-6 py-3.5 hover:bg-[#a3760a] transition-colors`
2. **Outline Button (`.btn-outline`):**
   - Style: Bordered layout matching the background. Smooth transition (`all 0.3s ease`).
   - Hover Action: Fills with solid gold (`bg-gold`), turns text into cream (`text-cream`), and adds a soft gold shadow overlay.
3. **Text Action Link (`.btn-text-link`):**
   - Style: Inline-flex gold link with a thin bottom border (`border-gold/40`) and nested SVG arrow inside headers.
   - Hover Action: SVG arrow shifts smoothly 4px to the right (`translateX(4px)`), border opacity increases, and text color brightens to `--color-gold-light`.
   - HTML Structure:
     ```html
     <a href="./news.html" class="inline-flex btn-text-link">
       View News Archive
       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
     </a>
     ```

### C. Form Styling
- All inputs must have minimal border radius, matching the high-end premium aesthetic.
- Avoid rounded pill forms. Use clean square-ish containers (`rounded-sm` or `rounded-[2px]`).
- Focus states must glow with a light gold ring.
  ```html
  <input class="w-full bg-white border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-3 focus:ring-gold/10 transition-all" />
  ```

---

## 6. Micro-Animations & Interactivity

Modern luxury web design relies heavily on subtle micro-animations that make the page feel reactive and high quality:

1. **Scroll Reveal:** Elements use the class `.reveal`. They start with `opacity-0` and `translateY(16px)` and smoothly glide to `opacity-1` and `translateY(0)` using JavaScript's Intersection Observer.
2. **Underline Reveal (`.link-underline`):** Custom nav links and anchor elements grow a bottom border from the center/left out on hover.
3. **Card Shadow Shifting (`.card-shadow`):** Instead of sudden borders, hovered cards (e.g. membership options, news articles) use a transition duration of `250ms` to slightly translate upwards (`-2px`) and gain a soft, wide golden-brown tinted shadow:
   ```css
   .card-shadow:hover { 
     box-shadow: 0 24px 40px -20px rgba(40, 30, 0, 0.18); 
     transform: translateY(-2px); 
   }
   ```
4. **Hero Image Transitions:** Slider images fade using `transition: opacity 1.2s ease` to avoid abrupt slide cuts.

---

## 7. Imagery & Photography Guidelines

Imagery plays a vital role in reinforcing the brand's premium prestige. All photographs must adhere to these aesthetics:

- **Craftsmanship Images:** Show close-up, high-contrast, shallow-depth-of-field shots of gold crafting processes. Focus on detail, warm lighting, and metallic highlights.
- **Portraits (Executive/President):** Should feature professional lighting, low-saturation corporate color schemes, or subtle warm overlays matching the cream backdrop.
- **Event / Gathering Images:** Use natural lighting with soft focus. Crop or align them into grids with high-contrast borders (`border-white/5` or `border-zinc-200`) to anchor them visually.
- **Overlays:** Dark layouts (like the main hero slide or President's message panel) must use dark gradients to ensure text meets accessibility contrast ratios:
  ```html
  <div class="absolute inset-0 bg-gradient-to-r from-zinc-900/85 via-zinc-900/55 to-transparent"></div>
  ```

---

## 8. Usability & Accessibility (a11y) Standards

- **Contrast Ratios:** Ensure body text on the cream background uses Charcoal (`#27272a` or `text-zinc-600`) to guarantee contrast ratios conform to WCAG AA requirements.
- **Semantic Tags:** Avoid using `<div>` for everything. Use `<section>` for layout divisions, `<article>` for news and blog cards, `<header>` and `<footer>` for primary bars, and `<nav>` for list-based site navigations.
- **Interactive States:** All custom buttons and click inputs must have visible focus-visible ring styles. Screen readers must be supported via descriptive `aria-label` settings on logo tags, mobile burgers, and slide dots.
- **Responsive Layout Scalability:** Font scaling must handle browser enlargement without overlapping layout text containers.

---

## 9. Performance & Production Recommendations

To elevate user satisfaction and SEO rankings:
- **Tailwind compilation:** The playground CDN is currently integrated using `<script src="https://cdn.tailwindcss.com"></script>`. For production, compile Tailwind to a static, minified CSS stylesheet to eliminate browser parser latency.
- **Modern Formats:** Convert large assets (such as `hero.jpg` and `craft.jpg`) into `.webp` or `.avif` formats with proper widths to reduce bundle footprints.
- **Lazy Loading:** Add `loading="lazy"` tags to images below the fold (e.g., news list cards, gallery section, and maps) to lower initial load payloads.
