# Drinks Panel — Daily Panel Layout/Style Parity

## Goal
Make [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) match
[`src/components/daily-panel.ts`](src/components/daily-panel.ts) for layout, font
sizes, transparency, and title location — so the Drinks (master tracker) pane is
visually identical in structure to the Daily (medicine) pane, just with
caffeine/alcohol-relevant boxes.

## Final target layout (mirrors Daily's `.daily-main`)
```
        [ centered substance title — 20px, weight 600, opens device-info dialog ]
┌──────────────────────┐  ┌──────────────────────────────┐
│                      │  │  📊 IN BODY          <val>   │  ← .stat-pill (rgba primary 0.06)
│   Log Drink          │  │      15px uppercase label    │
│   (tinted primary    │  ├──────────────────────────────┤
│    .take-pill-btn    │  │  🛏 SLEEP DISRUPTION  <val>  │  ← .stat-pill (rgba primary 0.06)
│    .safe style)      │  │      15px uppercase label    │
│   flex: 1            │  │  flex: 1, gap 10px           │
└──────────────────────┘  └──────────────────────────────┘
```

## Decisions (user-confirmed)
1. **Title** — centered, 20px, weight 600, no icon, opens device-info dialog on
   click/Enter/Space (full Daily `.med-name` parity). Title text = substance
   label (`drinks.caffeine` / `drinks.alcohol`).
2. **Two-column `.daily-main`** — Left = Log Drink button styled verbatim like
   Daily's `.take-pill-btn.safe` (tinted primary 0.12 bg / 0.2 hover, 28px icon,
   18px weight-550 label, `:active` scale 0.96). Right = `.stats-column` (flex 1,
   gap 10px) with exactly 2 `.stat-pill` boxes.
3. **Right boxes** (user-specified mapping):
   - TOP: **In Body** — `entities.amountInBody` state + `getStrengthUnit(e)`
     unit (mg caffeine / g alcohol). Label key `stats.amount_in_body`.
   - BOTTOM: **Sleep Disruption** — `entities.sleepDisruption` state, first
     letter title-cased. Label key `drinks.sleep_disruption`.
4. **Box transparency + fonts = Daily verbatim** — `.stat-pill` bg
   `rgba(var(--rgb-primary-color, 3,169,244), 0.06)`, hover 0.12, no border,
   `--ha-card-border-radius`. `.stat-label` 15px uppercase letter-spaced 0.5px,
   `--secondary-text-color`. `.stat-value` 18px weight-600,
   `--primary-text-color`, `margin-left: auto`. `.stat-pill ha-icon` 20px,
   primary color, opacity 0.7.
5. **Boxes clickable → more-info** — `role="button"`, `tabindex="0"`,
   `aria-label`, `@click` + `@keydown` → `controller.openMoreInfo(entityId)`
   via `controller.onKeyActivate(...)` (identical accessibility wiring to the
   Daily clickable stat-pills). Gated on the entity existing.
6. **Estimated Low Time removed from the Drinks pane** (user-confirmed) — keep
   strictly 2 right boxes, identical to Daily. The readout still lives in the
   Stats pane (`entities.estimatedLowTime` + backend `_computeEntities`
   detection unchanged). Orphaned `drinks.estimated_low` localize key removed;
   `stats.estimated_low_time` retained (Stats panel still uses it).
7. **No chips row** — Drinks master has no chip config (Daily's chips row is
   conditional on `chipEntities.length > 0`; Drinks simply omits it).
8. **Frontend-only** — no backend, controller-surface, or new localize keys.
   Reuses existing `controller.openMoreInfo` / `controller.onKeyActivate` /
   `controller.showDeviceInfo` / `controller.getStrengthUnit` /
   `controller.showLogDrinkDialog` and existing `stats.amount_in_body` /
   `drinks.sleep_disruption` / `daily.na` / `dialog.device_info.aria` keys.

## Changes applied

### [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)
- Full body rewrite: `.daily-main` row with `.log-drink-btn.safe` (left) +
  `.stats-column` (right) holding 2 `.stat-pill` boxes (In Body, Sleep
  Disruption). Removed the old stacked Log Drink button + `.sleep-row` /
  `.sleep-cell` / `.sleep-label` / `.sleep-value` block + the
  `formatTime`/`formatDateTime` import (was only for the deleted Estimated Low
  Time cell). Copied Daily's `.daily-main` / `.stats-column` / `.take-pill-btn`
  / `.stat-pill` / `.stat-label` / `.stat-value` CSS verbatim. Retained the
  centered clickable `.drinks-title` from the prior parity pass.

### [`src/localize.ts`](src/localize.ts)
- Removed orphaned `drinks.estimated_low` key.

### [`README.md`](README.md)
- Rewrote the 🥤 Drinks pane section to describe the two-column layout (Left:
  tinted Log Drink button; Right: In Body top + Sleep Disruption bottom, same
  transparency/font sizes as Daily's Safe to Take / Pills Left boxes, tap →
  more-info) + note that Estimated Low Time moved to the Stats pane.

### [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)
- Rebuilt via `yarn run build`, clean (exit 0, no warnings).

## Verification
- `yarn run build` in `/workspaces/lovelace-pill-logger-card` — clean, exit 0.

## Out of scope
- Backend changes (none needed — `amountInBody` / `sleepDisruption` /
  `estimatedLowTime` are already wired into `ResolvedEntities` by the
  master-tracker `_computeEntities` branch).
- Changing the Stats pane's Estimated Low Time row (kept as-is).
- Adding a chips row to the Drinks pane (no chip config exists for masters).