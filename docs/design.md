# Design System Specification

This document defines the visual language governing every component, surface, and interaction in the Zorvyn Finance Dashboard. The system draws inspiration from modern fintech interfaces, prioritizing clarity, restraint, and a premium tactile quality across both light and dark modes.

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Shape and Radius](#shape-and-radius)
- [Surface and Elevation](#surface-and-elevation)
- [Button System](#button-system)
- [Form Controls](#form-controls)
- [Motion and Animation](#motion-and-animation)
- [Chart Styling](#chart-styling)
- [Dark Mode Implementation](#dark-mode-implementation)
- [Scrollbar and Selection](#scrollbar-and-selection)

---

## Design Philosophy

The interface follows three governing principles:

1. **Flat hierarchy through color, not shadow.** The application contains zero `box-shadow` or `drop-shadow` declarations. Visual depth is communicated exclusively through surface color differentiation and border contrast.

2. **Two shape languages.** Static containers use a `20px` border radius. Interactive elements (buttons, inputs, badges, toggles) use a fully rounded `9999px` pill shape. This binary distinction immediately communicates clickability without relying on color alone.

3. **Restrained motion.** Animations serve functional purposes (communicating state changes, directing attention) rather than decorative ones. No transition exceeds 300ms. Spring physics are used for physical metaphors (drawer slides, toggle switches) while opacity fades handle page-level transitions.

---

## Color System

### Theme Variables

All colors are defined as CSS custom properties in `globals.css`, enabling instant theme switching without class recalculation:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | `#ffffff` | `#191c1f` | Page background |
| `--foreground` | `#191c1f` | `#ffffff` | Primary text |
| `--surface` | `#ffffff` | `#232628` | Card and panel backgrounds |
| `--surface-alt` | `#f4f4f4` | `rgba(244,244,244,0.06)` | Input fields, secondary surfaces |
| `--border` | `#c9c9cd` | `#44474a` | Dividers, card borders |
| `--muted` | `#8d969e` | `#828488` | Secondary text, labels |
| `--mid-slate` | `#505a63` | `#a0a4a8` | Tertiary text |

### Brand and Semantic Colors

These colors remain constant across themes:

| Token | Hex | Application |
|-------|-----|-------------|
| `--color-brand` | `#494fdf` | Primary brand accent, active states |
| `--color-brand-action` | `#4f55f1` | Hover states on brand elements |
| `--color-brand-link` | `#376cd5` | Hyperlinks |
| `--color-success` | `#00a87e` | Income indicators, positive trends |
| `--color-danger` | `#e23b4a` | Expense indicators, destructive actions |
| `--color-warning` | `#ec7e00` | Cautionary notices, warning badges |
| `--color-info` | `#007bc2` | Informational elements |
| `--color-attention` | `#b09000` | Budget warning indicators |

### Chart Color Palette

Each of the 10 transaction categories maps to a fixed color for visual consistency across all chart types:

| Category | Color | Rationale |
|----------|-------|-----------|
| Salary | `#00a87e` | Success teal, associated with income |
| Freelance | `#007bc2` | Informational blue, secondary income |
| Food | `#ec7e00` | Warm orange, everyday spending |
| Transport | `#505a63` | Neutral slate, utility category |
| Entertainment | `#494fdf` | Brand blue, discretionary spending |
| Utilities | `#b09000` | Muted gold, essential services |
| Healthcare | `#e61e49` | Deep pink, health-related |
| Shopping | `#4f55f1` | Action blue, retail purchases |
| Rent | `#e23b4a` | Danger red, high-value fixed cost |
| Investment | `#936d62` | Earth brown, long-term financial |

---

## Typography

### Font Stack

The application uses a two-tier font strategy:

- **Display font** (`--font-display`): `Aeonik Pro`, falling back to `Inter`, then `system-ui`. Used for headings, card values, and buttons.
- **Body font** (`--font-body`): `Inter`, falling back to `system-ui`. Used for paragraph text, labels, and form inputs.

### Heading Scale

All headings use weight 500 (Medium) rather than bold. Authority is established through size and negative tracking, not weight:

| Class | Letter Spacing | Line Height | Usage |
|-------|---------------|-------------|-------|
| `.heading-display` | `-0.02em` | `1.0` | Hero text, large numerical displays |
| `.heading-section` | `-0.01em` | `1.21` | Page titles (2rem) |
| `.heading-card` | `-0.01em` | `1.19` | Card headings, chart titles |

### Body Text

Body text uses `+0.015em` letter spacing for an open, airy reading experience. Font smoothing is enabled via `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale`.

### Numerical Display

Financial values use `tabular-nums` (via Tailwind's `tabular-nums` class) to ensure consistent vertical alignment in transaction columns and summary cards.

---

## Shape and Radius

The radius system uses exactly three values:

| Token | Value | Application |
|-------|-------|-------------|
| `--radius-card` | `20px` | Cards, panels, chart containers, modal overlays |
| `--radius-standard` | `12px` | Icon containers, notification badges, inner panels |
| `--radius-pill` | `9999px` | Buttons, inputs, select dropdowns, category badges, toggles |

This strict two-tier system (container vs. interactive) creates an immediate visual grammar. Users intuitively recognize pill-shaped elements as interactive and rectangular elements as informational.

---

## Surface and Elevation

### Card Component (`.card-surface`)

The foundational container component applies:

```css
.card-surface {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
}
```

No shadows, no gradients, no backdrop filters. Hierarchy is established through background color stepping between `--background`, `--surface`, and `--surface-alt`.

### Elevation Model

Instead of shadow-based elevation, the system uses three background tiers:

1. **Page level**: `--background` (the base canvas)
2. **Card level**: `--surface` (primary content containers)
3. **Inset level**: `--surface-alt` (inputs, secondary panels within cards)

---

## Button System

All buttons share a common base class (`.btn-pill`) providing consistent sizing, alignment, and interaction behavior:

```css
.btn-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 9999px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}
```

### Button Variants

| Variant | Light Mode | Dark Mode | Use Case |
|---------|-----------|-----------|----------|
| `.btn-primary` | Black background, white text | White background, black text | Primary actions (Add Transaction) |
| `.btn-secondary` | `--surface-alt` background | `--surface-alt` background | Secondary actions (Edit Profile, Export) |
| `.btn-outlined` | Transparent with foreground border | Transparent with foreground border | Tertiary actions |
| `.btn-danger` | `#e23b4a` background, white text | Same | Destructive actions (Reset, Delete) |
| `.btn-ghost` | Semi-transparent white | Same | Actions on dark overlays |

### Focus States

All buttons implement a double-ring focus indicator using `box-shadow` rather than `outline`, ensuring the focus ring respects the pill radius:

```css
.btn-pill:focus-visible {
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px #494fdf;
}
```

---

## Form Controls

### Text Inputs

Inputs use the pill shape with `--surface-alt` backgrounds. On focus, a `2px` ring in brand color (`#494fdf`) appears via Tailwind's `focus:ring-2 focus:ring-[#494fdf]`. Placeholder text uses the `--muted` color token.

### Select Dropdowns

Native `<select>` elements require explicit background and color declarations because browser dropdown menus do not inherit CSS custom properties. The application forces these values in both light and dark modes:

```css
select, select option {
  background-color: var(--surface-alt);
  color: var(--foreground);
}
.dark select option {
  background-color: #232628;
  color: #ffffff;
}
```

### Date Inputs

Date pickers use the same pill styling as text inputs. The native calendar widget inherits the page color scheme through the `color-scheme` meta property.

---

## Motion and Animation

### Animation Presets

All Framer Motion configurations are centralized in `constants/animations.ts`:

| Preset | Trigger | Properties | Duration |
|--------|---------|-----------|----------|
| `ANIM.page` | Page mount | Fade in + 8px upward slide | 250ms |
| `ANIM.row(i)` | Staggered list items | Fade in with `i * 50ms` delay (capped at 500ms) | Default spring |
| `ANIM.drawer` | Side panel open | Horizontal slide from right | Spring (damping: 30, stiffness: 300) |
| `ANIM.toast` | Notification display | Drop in from 50px above | Default spring |
| `ANIM.collapse` | Expandable sections | Height auto-animation with opacity | Default spring |

### Hover Interactions

Interactive elements use `transition-all duration-200` for color and opacity changes. Icon containers within summary cards scale to `1.1x` on group hover using `group-hover:scale-110` with a 300ms transition.

### Modal Animations

Modals use `AnimatePresence` for enter/exit coordination. The backdrop fades in while the modal body scales from `0.97` to `1.0` with simultaneous opacity transition.

---

## Chart Styling

### Tooltip Design

All Recharts tooltips use custom React components matching the design system:

- Background: `--surface` (theme-aware)
- Border: `1px solid --border`
- Border radius: `12px`
- No shadow, no outline
- Font size: `13px`
- Color indicators: `8px` circular dots matching the data series color

### Axis Styling

Chart axes suppress default lines and ticks (`axisLine={false}`, `tickLine={false}`). Tick labels use `11px` font size in `--muted` color. Y-axis values are formatted as abbreviated currency (for example, `150k`).

### Grid Lines

Cartesian grids use dashed horizontal lines (`strokeDasharray="3 3"`) with vertical lines disabled. Stroke color adapts to the theme (`#44474a` in dark mode, `#e8e8ec` in light mode).

### Recharts Overrides

Global CSS overrides strip the default Recharts tooltip wrapper styling:

```css
.recharts-tooltip-wrapper {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
```

---

## Dark Mode Implementation

Dark mode is toggled by adding the `.dark` class to the `<html>` element. Tailwind v4 is configured with a custom variant:

```css
@custom-variant dark (&:is(.dark *));
```

This enables class-based dark mode (rather than the default media-query approach) while maintaining compatibility with Tailwind's `dark:` prefix utilities.

Theme initialization reads localStorage synchronously before the first render to prevent a visible flash of the wrong theme. The `getInitialTheme()` function in `AppContext.tsx` handles this with a fallback chain: stored preference, then system `prefers-color-scheme`, then light mode as the default.

---

## Scrollbar and Selection

### Custom Scrollbar

Webkit scrollbars are styled to be minimal and theme-consistent:

- Width: `6px`
- Track: transparent
- Thumb: `--border` color with full pill radius
- Thumb hover: `--muted` color

### Text Selection

Selection colors invert the foreground/background relationship:

- Light mode: black background, white text
- Dark mode: white background, black text
