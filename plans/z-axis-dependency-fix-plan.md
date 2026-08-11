# Z-Axis Dependency Fix & DOM Reordering — Architecture Patch

## Goal
Eliminate the glow "wash out the button / bleed over adjacent static UI" defect
on the Drinks panel by closing the one remaining z-axis dependency gap, and
defensively re-verify all 5 invariants across both panels + the card root.

## Audit Summary (pre-patch)
All 5 patches were audited against the live source. Result: 4.9 / 5 already
satisfied by the v2.1 rollback. The ONLY missing piece is the Drinks panel
`.chips-row` — it lacks `position: relative; z-index: 1;`, so the 18px vertical
diffusion paints on top of the chips row.

| # | Invariant | daily | drinks | card root |
|---|-----------|-------|--------|-----------|
| 1 | Adjacent UI `position:relative; z-index:1` | ✅ med-name / stats-column / chips-row | ✅ drinks-title / stats-column  ❌ **chips-row** | ✅ pane-selector |
| 2 | Button `position:relative; z-index:1` | ✅ take-pill-btn | ✅ log-drink-btn | — |
| 3 | DOM: `<div class="glow-backdrop">` BEFORE `<button>` | ✅ L276→L277 | ✅ L273→L274 | — |
| 4 | `.glow-backdrop` `position:absolute; z-index:-1` | ✅ L693/L695 | ✅ L610/L612 | — |
| 5 | Wrapper `isolation:isolate; position:relative; z-index:0` | ✅ take-pill-wrap | ✅ log-drink-wrap | — |

## The Single Code Delta

### `src/components/drinks-panel.ts` — `.chips-row` (L826–830)
Add the z-axis dependency that the Daily panel's `.chips-row` already has:

```css
.chips-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  position: relative;  /* global z-axis protection — glow bleeds behind chips */
  z-index: 1;
}
```

No other source edits are required — patches #2, #3, #4, #5 and the remaining
#1 selectors are already present and correct.

## Why This Fixes Both Reported Symptoms

1. **"Bleed over adjacent static UI"** — Without `position: relative`, the
   Drinks `.chips-row`'s `z-index` is a null operation. The element stays in
   the wrapper's `isolation: isolate` floor (z-index auto), so the 18px
   vertical diffusion from `.glow-backdrop` (which bleeds `inset: -18px`
   beyond `.daily-main`) paints on top of the chips. Adding
   `position: relative; z-index: 1;` lifts the chips above the wrapper's
   stacking-context floor, mirroring the Daily panel's working behavior.

2. **"Washes out the button"** — The source DOM order is already correct
   (backdrop before button, z-index -1 vs 1). The perceived washout is the
   chips-row bleed creating a visual impression of overall glow overflow.
   Closing the chips-row gap removes the overflow; a fresh `dist/` rebuild
   rules out any stale-build hypothesis.

## Verification
1. `yarn run build` — must exit 0.
2. Grep `dist/ax-dose-logger-card.js`:
   - `take-pill-wrap` ≥ 13, `log-drink-wrap` ≥ 8
   - `isolation: isolate` × 2
   - `z-index: -1` × 2
   - `glow-backdrop` ≥ 15
   - `chips-row` retains `position: relative` + `z-index: 1` in the drinks block
3. No new `card-glow-backdrop` / `ax-card-glow-breathe` tokens (card-root glow
   must stay stripped).

## Memory-Bank Updates (post-verification)
- `memory-bank/activeContext.md` — replace Current Status; archive prior.
- `memory-bank/progress.md` — append new feature section.
- `README.md` — no end-user UX change (internal z-axis fix); skip.
- `memory-bank/projectstructure.md` — no file added/removed/renamed; skip.