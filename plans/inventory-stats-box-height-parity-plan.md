# Plan — Inventory Panel Box Height Parity with Stats Panel

## Goal
Make the boxes in the Inventory panel the same height as the boxes in the Stats panel.

## Root cause analysis
The Inventory panel ([`src/components/inventory-panel.ts`](src/components/inventory-panel.ts)) renders one `.inv-row` per granular drink as a 2-column CSS grid:

- Col 1 `.stat-pill` (refill box): single row of icon + label + value.
- Col 2 `.avg-cell`: two stacked `.avg-line` rows (7-day avg + trailing-dynamic avg).

CSS grid default `align-items: stretch` makes both columns share the tallest row's height. The `.avg-cell`'s two stacked lines at 18px value + `padding: 12px 14px` + `gap: 6px` give it a natural height of ~84px. The `.stat-pill` therefore stretches to ~84px too.

The Stats panel ([`src/components/stats-panel.ts`](src/components/stats-panel.ts)) `.stat-cell` is a column layout: 16px icon + 14px label header, then 18px value, `padding: 10px 8px`, `gap: 4px` → natural height ~72px.

Net: Inventory boxes (~84px) are taller than Stats boxes (~72px) by ~12px.

## Decision (user-confirmed 2026-07-06)
Compress the `.avg-cell` to fit the Stats height — reduce the avg-value size, padding, and gap so both Inventory boxes shrink to ~72px and match the Stats boxes. No content changes; only the col-2 averages box CSS is touched. The col-1 `.stat-pill` follows automatically via grid stretch (no CSS change to `.stat-pill` is required).

The col-1 `.stat-label`/`.stat-value` and the `.avg-label` (13px) sizes stay unchanged to preserve the prior Daily/Drinks visual-parity decisions documented in the memory bank. Only the `.avg-cell` container metrics + the `.avg-value` font-size are adjusted.

## CSS changes — [`src/components/inventory-panel.ts`](src/components/inventory-panel.ts)
Static `styles` block only. Three rules adjusted:

1. `.avg-cell`
   - `padding: 12px 14px` → `padding: 10px 14px` (match Stats `.stat-cell` 10px vertical)
   - `gap: 6px` → `gap: 4px` (match Stats `.stat-cell` gap)
   - Keep `justify-content: center`, surface `rgba(rgb-primary, 0.06)`, border-radius.

2. `.avg-value`
   - `font-size: calc(18px + var(--pill-text-offset, 0px))` → `calc(16px + var(--pill-text-offset, 0px))`
   - Keep `font-weight: 600`, `color`, `margin-left: auto`.

3. `.avg-label` — unchanged (13px secondary-text already smaller than Stats label; reduces visual weight inside the compressed cell).

No change to:
- `.stat-pill` (col 1 stretches via grid `align-items: stretch`, already correct)
- `.stat-label`, `.stat-value` (preserve Daily/Drinks parity)
- `.inv-row` grid template / 380px responsive fallback
- Stats panel — untouched (it is the reference target)

## Why no min-height
A shared explicit `min-height` was rejected: it would either fail to compress the Inventory row when content overflows (min-height is a floor, not a ceiling) or require `max-height` + overflow handling that risks clipping the two-line `.avg-cell`. Matching the natural content height by tuning padding/gap/value-size is the robust, content-driven approach and keeps the box self-sizing if a long translated label ever wraps.

## Verification
- `yarn run build` in `/workspaces/lovelace-pill-logger-card` — must exit 0, no warnings.
- Visual check (manual): Inventory `.stat-pill` + `.avg-cell` should match the Stats `.stat-cell` height within a few pixels (grid stretch will pull col 1 up to col 2's reduced height).

## Files modified
- `src/components/inventory-panel.ts` — static `styles` block (3 CSS rules adjusted)
- `dist/ax-dose-logger-card.js` — rebuilt
- `plans/inventory-stats-box-height-parity-plan.md` — this plan

## Memory bank updates
- `memory-bank/activeContext.md` — new Current Status entry; archive prior under Previous Context.
- `memory-bank/progress.md` — new section with checklist.
- No `projectstructure.md` change (no files added/renamed/deleted/repurposed).
- No README change (visual tweak, not a user-facing feature/installation change per the README update rule).