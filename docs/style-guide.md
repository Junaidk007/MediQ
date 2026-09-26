# QureFlow: Minimal Design System & Style Guide

**System:** QureFlow Real-Time Clinic Queue Platform  
**Design Philosophy:** Clinical minimalism — light, breathable, and high-trust. Optimized for low cognitive load during high-anxiety waiting room environments and rapid data processing for medical staff.

---

## 1. Color Palette

The palette uses a gradient of trust: starting with clinical, airy whites for primary surfaces, accented with bold charcoal-black for high-contrast legibility, and anchored by secondary blues for interactive and live-queue elements.

### Color Tokens & Usage

| Token | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **`--color-primary-bg`** | `#FAFAFC` | App canvas background; soft off-white to eliminate glare. |
| **`--color-primary-surface`** | `#FFFFFF` | Cards, modals, sheets, input fields (pure white). |
| **`--color-accent-black`** | `#0F172A` | Primary text, primary CTA buttons, high-contrast headings. |
| **`--color-accent-muted`** | `#475569` | Secondary text, field labels, supporting metadata. |
| **`--color-secondary-blue`** | `#2563EB` | Active queue indicators, interactive icons, active tab lines. |
| **`--color-secondary-light`** | `#EFF6FF` | Subtle blue tint for active chips, hovered states, card highlights. |
| **`--color-border`** | `#E2E8F0` | Hairline dividers, card outlines, subtle structural borders. |
| **`--color-success`** | `#10B981` | Completed consultations, on-time status, check-in verified. |
| **`--color-success-bg`** | `#ECFDF5` | Success badge and alert background tint. |
| **`--color-warning`** | `#F59E0B` | Queue delays, doctor on break, 1-patient-ahead alerts. |
| **`--color-warning-bg`** | `#FFFBEB` | Warning badge and banner background tint. |
| **`--color-error`** | `#EF4444` | Missed window, no-shows, offline sync alerts, destructive actions. |
| **`--color-error-bg`** | `#FEF2F2` | Error badge and alert background tint. |

---

## 2. Typography

* **Headings:** **Netflix Sans** (geometric, bold, premium structure)  
* **Body & UI Elements:** **Inter** (neutral, ultra-legible, optimal for timers, tokens, and dense queue tables)  
* **System Fallback Stack:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Type Scale

| Level | Font Family | Size | Weight | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | *Netflix Sans* | `32px` (2.00rem) | 700 (Bold) | `1.2` (38px) | `-0.02em` | Screen titles, token hero number |
| **H2** | *Netflix Sans* | `22px` (1.375rem) | 600 (SemiBold) | `1.3` (28px) | `-0.01em` | Section headers, card group titles |
| **Body** | *Inter* | `15px` (0.9375rem) | 400 (Regular) / 500 (Med) | `1.5` (22px) | `0` | Patient metadata, descriptions, form inputs |
| **Small** | *Inter* | `12px` (0.75rem) | 600 (SemiBold) | `1.4` (16px) | `+0.02em` | Badge text, timestamps, table column headers |

---

## 3. Spacing Scale & Unified Border Radius

### Spacing Scale (4px Base Unit)
* **`--space-1` (4px):** Micro gaps (icon-to-text, badge internal padding)
* **`--space-2` (8px):** Component internal padding (compact lists, chip gaps)
* **`--space-3` (12px):** Input field internal padding, stack spacing
* **`--space-4` (16px):** Standard container gutter, button horizontal padding
* **`--space-6` (24px):** Card interior padding, section separation
* **`--space-8` (32px):** Screen horizontal padding on mobile/tablet
* **`--space-12` (48px):** Hero headers and dashboard column spacing

### Unified Border Radius
To preserve a consistent, monolithic aesthetic, **only one border-radius value** is used across the entire design system:

$$\mathbf{Radius = 8px}$$

*(Applied uniformly to Buttons, Input fields, Cards, Dropdowns, and Badges).*

---

## 4. Component Styles

### A. Buttons (`height: 44px`, `border-radius: 8px`)
* **Primary (Accent Black):**
  * `background: #0F172A; color: #FFFFFF; font-weight: 600; padding: 0 20px; border: none;`
  * *Hover:* `background: #1E293B;` | *Active:* `transform: scale(0.99);`
* **Secondary (Blue Tint):**
  * `background: #EFF6FF; color: #2563EB; font-weight: 600; border: 1px solid #DBEAFE;`
  * *Hover:* `background: #DBEAFE;`
* **Ghost / Destructive:**
  * `background: transparent; color: #EF4444; border: 1px solid #FECACA; font-weight: 500;`

### B. Form Inputs (`height: 44px`, `border-radius: 8px`)
* **Default:**
  * `background: #FFFFFF; border: 1px solid #E2E8F0; color: #0F172A; padding: 0 14px; font-size: 15px;`
  * `placeholder-color: #94A3B8;`
* **Focus State:**
  * `border-color: #2563EB; outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);`
* **Error State:**
  * `border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);`

### C. Cards (`border-radius: 8px`)
* `background: #FFFFFF;`
* `border: 1px solid #E2E8F0;`
* `padding: 20px;`
* `box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02);`

### D. Badges / Status Tags (`height: 24px`, `border-radius: 8px`)
* `padding: 2px 10px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;`
* **Blue (In Queue / Active):** `background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE;`
* **Green (Completed / Verified):** `background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;`
* **Amber (Delayed / Break):** `background: #FFFBEB; color: #B45309; border: 1px solid #FDE68A;`
* **Red (No-Show / Cancelled):** `background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA;`

---

## 5. CSS Custom Properties (:root)

```css
:root {
  /* Colors */
  --color-primary-bg: #FAFAFC;
  --color-primary-surface: #FFFFFF;
  --color-accent-black: #0F172A;
  --color-accent-muted: #475569;
  --color-secondary-blue: #2563EB;
  --color-secondary-light: #EFF6FF;
  --color-border: #E2E8F0;

  /* Feedback */
  --color-success: #10B981;
  --color-success-bg: #ECFDF5;
  --color-warning: #F59E0B;
  --color-warning-bg: #FFFBEB;
  --color-error: #EF4444;
  --color-error-bg: #FEF2F2;

  /* Typography */
  --font-heading: 'Netflix Sans', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  /* Radius */
  --radius-unified: 8px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Shadows */
  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02);
}
```

---

## 6. Prompt-Ready Style Guide Block

> **Copy and paste this block into any prompt to enforce 100% UI consistency:**

```markdown
[STYLE GUIDE: QureFlow Minimal UI]
- Canvas: #FAFAFC | Cards/Surfaces: #FFFFFF (border: 1px solid #E2E8F0).
- Accent Black: #0F172A (Primary text & CTAs) | Secondary Blue: #2563EB (Interactions & Queue highlights) | Tint: #EFF6FF.
- Feedback: Success #10B981 (#ECFDF5) | Warning #F59E0B (#FFFBEB) | Error #EF4444 (#FEF2F2).
- Typography: Headings: 'Netflix Sans', 700/600 | Body & UI: 'Inter', 400/500/600.
- Type Scale: H1: 32px/1.2 (-0.02em) | H2: 22px/1.3 | Body: 15px/1.5 (#0F172A) | Small: 12px/1.4 (#475569).
- Spacing Scale: 4px | 8px | 12px | 16px | 24px | 32px | 48px.
- Radius: STRICT SINGLE VALUE = 8px (all buttons, inputs, cards, badges).
- Card: #FFFFFF fill, 1px border #E2E8F0, shadow: 0 1px 3px rgba(15,23,42,0.04), padding: 20px.
- Button: h: 44px, r: 8px, px: 20px, font: 14px/600. Primary: #0F172A (text #FFF). Secondary: #EFF6FF (text #2563EB).
- Input: h: 44px, r: 8px, bg: #FFF, border: 1px #E2E8F0, focus: #2563EB ring (3px/12%), text: 15px #0F172A.
- Badge: h: 24px, r: 8px, px: 10px, font: 12px/600, bg: light tint, text: saturated status color.
- Layout Vibe: Clinical, clean white space, zero visual clutter, single dominant CTA per view.
```
