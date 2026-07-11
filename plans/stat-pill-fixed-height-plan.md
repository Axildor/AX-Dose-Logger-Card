# Plan — Stat-Pill + Chip Fixed Height for UI Consistency

## Problem

Both the Daily panel ([`src/components/daily-panel.ts`](src/components/daily-panel.ts)) and Drinks panel ([`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)) share two UI patterns that break visual consistency when text wraps:

### 1. Stat-pill boxes (right of the button)

`.stats-column` is a flex column (`gap: 10px`) with two stacked `.stat-pill` boxes. Each `.stat-pill` is a flex row (`align-items: center`): `<ha-icon>` + `.stat-label` + `.stat-value` (`margin-left: auto`). No explicit `line-height` — they inherit the theme default (~1.5). No fixed height — auto-sizes to content.

When a label (e.g. "LOW - HOURS UNTIL" in the Drinks Disruption box, or a long swapped-entity label in the Daily Pills Left box) **wraps to two lines**, the label height doubles (15px × 1.5 × 2 = 45px) and exceeds the value's single-line height (18px × 1.5 = 27px), growing the pill by ~18px. This breaks visual consistency across cards.

### 2. Custom chips (below the button)

`.chips-row` is a flex row (`gap: 8px`, `flex-wrap: wrap`) of `.chip` elements. Each `.chip` is a **flex column** (`align-items: center`, `gap: 2px`): `.chip-icon` (18px) + `.chip-name` (12px) + `.chip-value` (16px). The `.chip-name` currently has `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` — long names are **truncated with `…`** rather than shown in full. When one chip's name is truncated and another's fits, the chips look inconsistent (one shows a full name, one shows `Caffeine To…`).

The user wants: **all `.stat-pill` boxes AND all `.chip` elements to have the same height regardless of whether their text wraps to two lines.** The user accepted "it will be a tight fit."

## Solution

Pure CSS. Lock `line-height` relationships so that **two lines of the smaller text = one line of the larger text**, keeping the container's natural height constant. No fragile pixel constants (`min-height` / `max-height` / fixed `height`) — the larger element's locked `line-height` establishes the baseline, and the smaller element's tight `line-height` makes its two-line height match it.

### Part A — Stat-pill (flex row)

The value (always short: a number, "N/A", HH:MM, or short title-cased state) sets the pill's baseline. The label's tight `line-height` makes its two-line height match the value's single-line height.

| Element | Font size | line-height | One-line height | Two-line height |
|---------|-----------|-------------|-----------------|-----------------|
| `.stat-value` | 18px | **1.5** (explicit) | 27px | — (`white-space: nowrap`, never wraps) |
| `.stat-label` | 15px | **0.9** (tight) | 13.5px | **27px** ← matches value! |

Pill content height = max(27px, 27px) = 27px + 24px padding = **51px**, constant. Single-line labels (13.5px) center via the existing `align-items: center` — no visual change.

**CSS changes:**
- `.stat-pill` → add `overflow: hidden` (safety net for rare 3-line overflow)
- `.stat-label` → add `line-height: 0.9` (core fix)
- `.stat-value` → add `line-height: 1.5; white-space: nowrap` (lock baseline, prevent value wrapping)

### Part B — Chip (flex column)

The chip is a column, so total height = icon + name + value (with `gap: 2px`). The name is the only element that can wrap. Currently it's forced to one line via `nowrap` + truncation. The fix: **allow wrapping** (remove truncation so full names are visible) but set a tight `line-height` so two lines of name = one line of name at default line-height.

| Element | Font size | line-height | One-line height | Two-line height |
|---------|-----------|-------------|-----------------|-----------------|
| `.chip-value` | 16px | **1.5** (explicit) | 24px | — (`white-space: nowrap`) |
| `.chip-name` | 12px | **0.75** (tight) | 9px | **18px** ← matches one line at default (12 × 1.5 = 18px) |

One line of name at the previous default line-height (12px × 1.5 = 18px) = two lines at 0.75 (12px × 0.75 × 2 = 18px). The chip's total column height stays constant whether the name is one line or two.

**CSS changes:**
- `.chip` → add `overflow: hidden` (safety net)
- `.chip-name` → remove `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis` (allow wrapping, show full name); add `line-height: 0.75` (core fix) + `text-align: center` (centered multi-line looks better in the column layout) + `word-break: break-word` (so long unbroken entity-name fragments wrap instead of overflowing)
- `.chip-value` → add `line-height: 1.5; white-space: nowrap` (lock baseline, prevent value wrapping)

### What does NOT change

- No `min-height` / `max-height` / fixed `height` on any element — the locked `line-height` relationships establish consistent natural heights without fragile pixel constants.
- No changes to `padding`, `gap`, `background`, `border-radius`, `align-items`, or `flex` properties.
- No HTML / TypeScript / render logic changes — purely CSS.
- No backend changes.

## Files to Modify

1. [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — `.stat-pill` / `.stat-label` / `.stat-value` (lines ~313–340) + `.chip` / `.chip-name` / `.chip-value` (lines ~356–396)
2. [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — `.stat-pill` / `.stat-label` / `.stat-value` (lines ~335–370) + `.chip` / `.chip-name` / `.chip-value` (lines ~379–419)
3. [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

## Verification

- `yarn run build` — exit 0, no warnings
- Visual check: two cards side-by-side, one with a two-line label (e.g. Drinks panel with `disruption_mode: low_hours_until` on a narrow card) and one with a single-line label — both `.stat-pill` boxes should be identical height. Chips with long names should show full text (wrapped to two lines) and be the same height as chips with short names.

## Memory Bank Updates (post-verification)

- `memory-bank/activeContext.md` — new Current Status, archive previous
- `memory-bank/progress.md` — new section with checklist
- No `projectstructure.md` change (no files added/renamed/deleted)
- No `README.md` change (internal CSS refinement, not a user-facing config/UX feature change)