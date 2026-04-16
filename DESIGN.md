# Design Brief

## Direction

Cool Serene E-commerce — Premium, conversion-optimized storefront with refined minimalism and strategic color accents.

## Tone

Clean modern SaaS aesthetic with light, airy, spa-like calm (cool undertones); confident product-first composition inspired by Stripe's premium UX.

## Differentiation

Gradient accents on primary CTAs (teal → light teal) and warm amber secondary buttons create visual hierarchy without chrome; product cards float with subtle elevation.

## Color Palette

| Token      | OKLCH           | Role                              |
|-----------|-----------------|----------------------------------|
| background | 0.98 0.008 230 | Light: off-white, cool undertone |
| foreground | 0.18 0.015 230 | Light: deep blue-grey text       |
| card       | 1.0 0.004 230  | Bright white, pristine           |
| primary    | 0.42 0.14 240  | Ocean blue, deep trust/CTAs      |
| accent     | 0.6 0.15 170   | Teal, secondary CTAs/highlights  |
| muted      | 0.94 0.01 230  | Light grey, subtle backgrounds   |

## Typography

- Display: Space Grotesk — strong, modern headers (h1, h2, hero text)
- Body: Plus Jakarta Sans — UI labels, product descriptions, clarity at all sizes
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-semibold`, labels `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Subtle elevation layers: cards use soft `shadow-subtle` at rest, `shadow-elevated` on hover; backgrounds alternate `bg-background` and `bg-muted/20` to create visual rhythm without visual noise.

## Structural Zones

| Zone    | Background       | Border            | Notes                           |
|---------|------------------|-------------------|--------------------------------|
| Header  | `bg-card`        | `border-b border-border/40` | Clean, elevated foundation |
| Content | `bg-background`  | —                 | Alternating `bg-muted/20` per section |
| Footer  | `bg-muted/30`    | `border-t border-border/40` | Light grey, accessible contrast |

## Spacing & Rhythm

Spacious, breathing layout: `gap-8 md:gap-12` between product sections, `p-6 md:p-8` card padding; tight tracking on headlines (`tracking-tight`), loose on labels (`tracking-widest`).

## Component Patterns

- Buttons: primary `gradient-primary text-primary-foreground`, hover `scale-105 transition-smooth`, rounded `rounded-lg`
- Cards: `rounded-lg shadow-subtle hover:shadow-elevated`, `bg-card` with `border border-border/20`
- Badges: `bg-accent/10 text-accent rounded-full px-3 py-1 text-sm`

## Motion

- Entrance: fade-in + subtle slide-up on product cards (`animate-fade-in animate-slide-in-up`)
- Hover: scale 1.05 on cards, color shift on buttons (all 0.3s smooth)
- Decorative: none — functional motion only, no distracting animations

## Constraints

- No decorative patterns or textures; clean, minimal surfaces
- Product photography drives visual interest; UI is neutral backdrop
- Warm amber accent reserved for secondary/tertiary CTAs (cart, wishlist)

## Signature Detail

Gradient primary buttons (teal → light teal) against soft backgrounds create subtle depth and guide user attention toward conversion without aggression — luxury e-commerce aesthetic.
