# Design Brief

## Direction

Corporate Modernism — Professional ERP+CRM platform combining data density with executive clarity. Sidebar-driven navigation with slate primary, emerald success accents, warm amber warnings.

## Tone

Utilitarian precision with subtle refinement — trust-inspiring, not sterile. Clean typography hierarchy, intentional elevation, role-based visual cues. Inspired by Linear, Notion Admin, and modern fintech UX.

## Differentiation

Persistent sidebar navigation with icon-label pairs (collapsible). Data tables and KPI cards use color semantics (emerald = positive, amber = warning, red = critical). Chart colors coordinate with status palette. Minimal decoration; information hierarchy drives all visual decisions.

## Color Palette

| Token      | OKLCH           | Role                                        |
|------------|-----------------|---------------------------------------------|
| primary    | 0.38 0.08 240   | Slate blue, primary CTAs, navigation active |
| accent     | 0.58 0.16 130   | Emerald, success/positive metrics           |
| success    | 0.65 0.18 140   | Green, profit, inventory gains              |
| warning    | 0.72 0.19 80    | Amber, attention, inventory low             |
| destructive| 0.55 0.22 25    | Red, critical alerts, deletions              |
| background | 0.96 0.006 230  | Off-white, content area                     |
| foreground | 0.25 0.01 240   | Charcoal, body text                         |
| card       | 1.0 0.004 0     | Pure white, data zones                      |
| sidebar    | 0.18 0.015 240  | Dark charcoal, persistent navigation        |

## Typography

- Display: Space Grotesk — bold headers, KPI titles (h1–h3, weight 600–700)
- Body: Plus Jakarta Sans — form labels, table copy, descriptions (weight 400–500)
- Mono: JetBrains Mono — transaction IDs, codes, invoice numbers
- Scale: hero `text-4xl md:text-5xl font-bold`, h2 `text-2xl md:text-3xl font-semibold`, label `text-xs md:text-sm font-medium`, body `text-sm md:text-base`

## Elevation & Depth

Three-tier elevation: sidebar base, card `shadow-sm` at rest on backgrounds, `shadow-subtle` hover for interactivity; KPI cards and modals use `shadow-elevated` for prominence.

## Structural Zones

| Zone    | Background       | Border                | Notes                                  |
|---------|------------------|----------------------|----------------------------------------|
| Sidebar | `bg-sidebar`     | `border-r border-sidebar-border` | Fixed left nav, white text/icons |
| Header  | `bg-card`        | `border-b border-border/30` | Top bar with user profile, search  |
| Content | `bg-background`  | —                     | Main area with alternating `bg-muted/40` per section |
| Table   | `bg-card`        | `border border-border/20` | Data rows with `bg-muted/20` stripes |
| Footer  | `bg-muted/30`    | `border-t border-border/30` | Pagination, summary info |

## Spacing & Rhythm

Generous breathing room: sidebar `w-64` (collapsible to `w-16`), main content `px-6 md:px-8 py-6 md:py-8`, card gaps `gap-4 md:gap-6`. Tight vertical spacing in tables (`py-2`), loose in detail cards (`p-6`).

## Component Patterns

- KPI card: `bg-card border border-border/20 rounded-lg p-4 md:p-6 shadow-subtle`, title `text-xs font-medium text-muted-foreground`, value `text-2xl md:text-3xl font-bold text-foreground`, accent bar `h-1 bg-accent rounded-full`
- Button primary: `bg-primary text-primary-foreground rounded-md px-3 md:px-4 py-2 font-medium hover:bg-primary/90 transition-smooth`
- Data table: `bg-card border border-border/20`, headers `bg-muted/60 text-muted-foreground text-xs font-medium`, rows `border-t border-border/10 py-3 px-4`, hover `bg-muted/30`
- Status badge: `bg-{semantic}-foreground text-{semantic} text-xs font-semibold px-2.5 py-1.5 rounded-full` (success=emerald, warning=amber, destructive=red)

## Motion

- Entrance: fade-in on page load, slide-in-up on modals/overlays (0.3s smooth)
- Sidebar collapse: width transition 0.3s, icon rotation smooth
- Hover: subtle scale (1.02) on interactive cards, color shift on buttons (0.2s)
- No decorative animations — all motion serves navigation or status clarity

## Constraints

- No gradients in component backgrounds; reserved for primary button gradient only
- Charts use assigned palette (chart-1 through chart-5) matching status colors
- Every table/list alternates background color for readability; no dense monochrome sections
- Dark mode uses higher contrast and slightly brighter accent colors for readability in low light

## Signature Detail

Role-based color semantics throughout: emerald for profit/success, amber for warnings, red for critical — transforming a dry financial UI into an at-a-glance executive dashboard where color tells the business story.
