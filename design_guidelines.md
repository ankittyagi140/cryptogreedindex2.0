# Crypto Fear and Greed Index - Design Guidelines

## Design Approach

**Reference-Based Hybrid**: Drawing inspiration from **TradingView** (chart aesthetics), **Coinbase** (clean crypto UI), and **Linear** (modern typography and spacing) to create a professional financial data visualization platform.

## Core Design Principles

1. **Data First**: Information hierarchy prioritizes the Fear & Greed gauge, then supporting metrics
2. **Professional Credibility**: Clean, sophisticated design that conveys trustworthiness for financial data
3. **Dual Theme Excellence**: Both themes must be equally polished, not afterthoughts

---

## Typography

**Font Stack**: 
- Primary: Inter (via Google Fonts) - body text, labels, data points
- Display: Space Grotesk (via Google Fonts) - headings, gauge numbers

**Hierarchy**:
- Hero/Gauge Number: 72px (text-7xl), bold, tabular-nums
- Section Headers: 32px (text-3xl), semibold
- Chart Labels: 14px (text-sm), medium
- Body/Metrics: 16px (text-base), regular
- Small Data: 12px (text-xs), medium, uppercase tracking-wide

---

## Layout System

**Spacing Units**: Consistent use of Tailwind's 4, 6, 8, 12, 16, 24 units (e.g., p-4, gap-8, mb-12)

**Grid Structure**:
- Container: max-w-7xl with px-6
- Dashboard Grid: 12-column system for flexible metric cards
- Mobile: Single column stack with preserved data hierarchy

---

## Component Library

### Header
- Sticky navigation with backdrop blur (backdrop-blur-lg)
- Logo left, language selector + theme toggle right
- Height: h-16, border-b with theme-appropriate divider

### Fear & Greed Gauge (Hero Section)
- Centered circular gauge with 240° arc displaying 0-100 scale
- Color gradient segments: Red (0-25) → Orange (25-50) → Yellow (50-75) → Green (75-100)
- Large number display in center with sentiment label ("Extreme Fear" to "Extreme Greed")
- Metric cards below: Yesterday, Last Week, 1 Month values in 3-column grid (1 col mobile)

### Market Sentiment Timeline
- Horizontal timeline component showing progression over 7 days
- Dot indicators color-coded by sentiment level
- Connecting lines between data points
- Date labels below, values above

### Interactive Chart Section
- Full-width chart container with min-height of 400px
- Dual-axis: Fear & Greed Index (left) + Price overlay (right, optional)
- Cryptocurrency selector dropdown (BTC, ETH, SOL)
- Time range selector: 24H, 7D, 1M, 3M, 1Y, ALL
- Download chart button (icon + text)
- Grid lines, axis labels, tooltip on hover with date + value

### Metric Cards
- Rounded corners (rounded-xl)
- Padding: p-6
- Border with theme-appropriate subtle color
- Label + large number + change indicator (+/- percentage with up/down arrow)

### Theme Toggle
- Sun/Moon icon button in header
- Smooth transitions on all color properties (transition-colors duration-200)
- Persists to localStorage

### Language Selector
- Dropdown menu with flag icons
- Options: EN, ES, PT
- Current language highlighted

---

## Animations

**Minimal Motion**:
- Gauge needle smooth animation on load (1s ease-out)
- Chart line draw-in effect on mount (0.8s)
- Theme transition: 200ms color transitions only
- Hover states: subtle scale (1.02) on interactive cards

---

## Images

**No large hero image required**. This is a data-first dashboard where the Fear & Greed gauge IS the hero visual element.

**Icon Library**: Use Heroicons via CDN for UI elements (language selector, theme toggle, download buttons, arrows for metrics)

---

## Page Structure

1. **Header**: Logo, Language Selector, Theme Toggle
2. **Hero Gauge Section**: Large circular gauge with current index (py-16)
3. **Quick Metrics**: 3-column grid of Yesterday/Last Week/Month cards (py-12)
4. **Sentiment Timeline**: 7-day progression visualization (py-12)
5. **Interactive Chart**: Full-width chart with controls (py-16)
6. **About Section**: 2-column layout explaining the index methodology (py-16)
7. **Footer**: Links, disclaimer, social icons (py-8)

---

## Theme Specifications

**Dark Theme** (Primary - matches reference):
- Background gradients from deep navy to black
- Card backgrounds with subtle transparency
- Bright data visualization colors pop against dark
- Text: white/gray-100 for primary, gray-400 for secondary

**Light Theme**:
- Clean white/gray-50 backgrounds
- Softer card shadows instead of borders
- Muted data visualization colors for readability
- Text: gray-900 for primary, gray-600 for secondary

---

## Accessibility

- WCAG AA contrast ratios in both themes
- Keyboard navigation for all interactive elements
- ARIA labels on gauge, chart, and theme toggle
- Focus indicators with theme-appropriate ring colors