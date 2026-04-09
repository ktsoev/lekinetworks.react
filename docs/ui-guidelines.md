# UI Guidelines

Visual style inspired by mint.arcuma.ru: dark theme, clean layout, soft gradients, rounded elements, and a strong focus on readability and conversion.

## Design Tokens

### Colors

```css
:root {
  /* Background */
  --bg-primary: #0A0A0F;
  --bg-secondary: #12121A;
  --bg-tertiary: #1A1A25;
  --bg-card: #16161F;
  --bg-card-hover: #1C1C28;
  --bg-elevated: #1E1E2A;

  /* Accent — Mint */
  --accent-primary: #4AE8A0;
  --accent-primary-hover: #3DD48E;
  --accent-primary-muted: rgba(74, 232, 160, 0.15);
  --accent-primary-glow: rgba(74, 232, 160, 0.25);

  /* Text */
  --text-primary: #EEEEF0;
  --text-secondary: #9494A0;
  --text-tertiary: #5E5E6E;
  --text-inverse: #0A0A0F;

  /* Status */
  --status-active: #4AE8A0;
  --status-expired: #F06868;
  --status-pending: #F0C848;

  /* Border */
  --border-primary: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.14);
  --border-accent: rgba(74, 232, 160, 0.3);

  /* Overlay */
  --overlay: rgba(0, 0, 0, 0.6);
}
```

### Spacing

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
}
```

### Border Radius

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
```

### Typography

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 2rem;       /* 32px */
  --text-4xl: 2.5rem;     /* 40px */
  --text-5xl: 3.5rem;     /* 56px */

  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

### Shadows & Glows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px var(--accent-primary-glow);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--border-primary);
}
```

### Transitions

```css
:root {
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

---

## Component Styles

### Buttons

**Primary Button**
- Background: `var(--accent-primary)`
- Text: `var(--text-inverse)` (dark on mint)
- Border radius: `var(--radius-md)`
- Padding: `12px 24px`
- Font weight: `var(--weight-semibold)`
- Hover: slightly darker accent + subtle glow shadow
- Active: scale(0.98)
- Disabled: opacity 0.5, no pointer events

**Secondary Button**
- Background: `var(--bg-tertiary)`
- Text: `var(--text-primary)`
- Border: `1px solid var(--border-primary)`
- Hover: border color → `var(--border-hover)`, background → `var(--bg-card-hover)`

**Ghost Button**
- Background: transparent
- Text: `var(--text-secondary)`
- Hover: text → `var(--text-primary)`, background → `var(--bg-tertiary)`

### Cards

- Background: `var(--bg-card)`
- Border: `1px solid var(--border-primary)`
- Border radius: `var(--radius-lg)`
- Padding: `var(--space-lg)`
- Hover: border → `var(--border-hover)`, background → `var(--bg-card-hover)`
- Selected state: border → `var(--border-accent)`, soft glow shadow

### Inputs

- Background: `var(--bg-tertiary)`
- Border: `1px solid var(--border-primary)`
- Border radius: `var(--radius-md)`
- Padding: `12px 16px`
- Text: `var(--text-primary)`
- Placeholder: `var(--text-tertiary)`
- Focus: border → `var(--accent-primary)`, subtle glow
- Error: border → `var(--status-expired)`, error message in red below

### Code Input (Verification)

- 6 individual boxes, each 48x56px
- Centered, spaced `var(--space-sm)` apart
- Same styling as inputs
- Auto-focus next box on digit entry
- Auto-submit when all 6 digits entered

### Badges

- Border radius: `var(--radius-full)`
- Padding: `4px 12px`
- Font size: `var(--text-xs)`
- Font weight: `var(--weight-semibold)`
- Active: bg `rgba(74, 232, 160, 0.15)`, text `var(--status-active)`
- Expired: bg `rgba(240, 104, 104, 0.15)`, text `var(--status-expired)`
- Pending: bg `rgba(240, 200, 72, 0.15)`, text `var(--status-pending)`

### Modal

- Centered overlay with `var(--overlay)` backdrop
- Content card: `var(--bg-elevated)`, `var(--radius-xl)`, max-width 480px
- Entrance animation: fade in + slide up
- Backdrop click or ESC to close

---

## Layout Guidelines

### Container
- Max width: 1200px
- Padding: `var(--space-md)` on mobile, `var(--space-xl)` on desktop
- Centered horizontally

### Grid
- Mobile: single column
- Tablet (768px+): 2 columns for cards
- Desktop (1024px+): 3-4 columns where appropriate

### Spacing Between Sections
- Use `var(--space-3xl)` to `var(--space-4xl)` between major page sections
- Use `var(--space-lg)` to `var(--space-xl)` between related elements

---

## Animations

### Page Transitions
- Fade in: opacity 0 → 1, 300ms ease
- Slide up: translateY(10px) → 0, 300ms ease

### Interactive Feedback
- Button press: scale(0.98), 100ms
- Card hover: border color transition, 250ms
- Glow pulse on selected card: subtle pulse animation

### Loading States
- Skeleton screens: gradient shimmer animation on `var(--bg-tertiary)` blocks
- Spinner: rotating mint-colored ring
- Payment processing: pulsing icon with text

### Success Animation
- Checkmark draw: SVG stroke-dashoffset animation
- Scale bounce: scale 0 → 1.1 → 1, 500ms

---

## Responsive Breakpoints

```css
/* Mobile first */
/* Small: default (< 640px) */
/* Medium: 640px+ */
/* Large: 768px+ */
/* Desktop: 1024px+ */
/* Wide: 1280px+ */

@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

---

## Accessibility

- All interactive elements must have focus-visible outlines (`2px solid var(--accent-primary)`, offset 2px).
- Color contrast ratios must meet WCAG AA (4.5:1 for normal text).
- `var(--text-primary)` on `var(--bg-primary)` = #EEEEF0 on #0A0A0F ≈ 16:1 (passes AAA).
- All images and icons must have appropriate alt text or aria-label.
- Keyboard navigation must work for all interactive flows.
