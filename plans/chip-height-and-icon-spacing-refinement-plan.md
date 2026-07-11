# Chip Refinement — Height Fix + Icon Spacing + README Button-Use Note

## Problem 1: Chips too tall
`.chip` has `min-height: calc(51px + var(--pill-text-offset, 0px))`. LitElement Shadow DOM defaults to `box-sizing: content-box` (HA's global `border-box` only applies in the main DOM, not shadow DOM). So `min-height: 51px` applies to the **content area**, and `padding: 6px + 6px = 12px` adds on top → total height **63px**. The stat-pill (~51px) has no explicit min-height — its height comes naturally from `.stat-label { min-height: 2.6em }` (≈39px) + padding (12px) = ~51px.

**Fix:** Remove `min-height` from `.chip` entirely. The chip's natural column height (chip-name ~14.4px + gap 2px + chip-value ~24px + padding 12px = ~52.4px) already matches the stat-pill (~51px) without any forced min-height. Remove `justify-content: center` too (no longer needed without min-height — the column content fills the box naturally). Also remove the `.chip.with-icon { min-height: auto }` rule (no min-height to relax).

## Problem 2: Icon too close to label when toggled on
`.chip` has `gap: 2px`. When the icon renders above the label, 2px is too tight. The `.with-icon` variant needs a larger gap so the icon has breathing room.

**Fix:** Add `.chip.with-icon { gap: 6px; }` (was inheriting the 2px gap). This gives the icon-on-top 6px of space above the label. The box grows naturally to fit (icon 18px + gap 6px + label 14.4px + gap 2px + value 24px + padding 12px = ~76.4px).

## Problem 3: README note about intentional button-like use
The user noted that the icon toggle can be used intentionally to make chips bigger (button-like use). Add this to the README config row description.

**Fix:** Update the `chip_N_show_icon` / `drink_chip_N_show_icon` README rows to mention that enabling the icon also makes the chip box taller, which can be used intentionally to create larger button-like chips.

## Files to modify
- `src/components/daily-panel.ts` — `.chip` CSS: remove `min-height` + `justify-content: center`; remove `.chip.with-icon { min-height: auto }`; add `.chip.with-icon { gap: 6px }`
- `src/components/drinks-panel.ts` — same CSS changes (parity)
- `README.md` — update the 2 `show_icon` config row descriptions to note the button-like use
- `dist/ax-dose-logger-card.js` — rebuild

## Verification
- `yarn run build` clean (exit 0, no warnings)
- Memory bank: append to progress.md, update activeContext.md Current Status