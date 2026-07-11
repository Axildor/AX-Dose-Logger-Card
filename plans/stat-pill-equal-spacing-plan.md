# Plan — Stat-Pill + Chip Equal Spacing for Two-Line Text (Revision)

## Problem

The previous fix (line-height 0.9 / 0.75) kept boxes the same height but squeezed two-line text too tightly — the lines are visually cramped. The user wants:
1. More space between the two lines
2. Ideally, equal spacing above / between / below the lines

## Solution

Use `line-height: 1.2` (comfortable 3px between-line gap for 15px font, 2.4px for 12px font) + `min-height: 2.6em` + `display: flex; flex-direction: column; justify-content: center;` on the label/name elements.

### The "equal spacing" formula

For a text element with:
- `line-height: L` (where L > 1.0)
- `min-height: (3L - 1)em` (em = element's own font-size)
- `display: flex; flex-direction: column; justify-content: center;`

**Two-line text** fills `2 × L × font-size` and flex centering adds `((3L-1) - 2L) × font-size / 2 = (L-1)/2 × font-size` padding top/bottom. The result:
- Space above first line = flex_padding + half_leading = (L-1)/2 × F + (L-1)/2 × F = (L-1) × F
- Space between lines = full_leading = (L-1) × F
- Space below last line = half_leading + flex_padding = (L-1)/2 × F + (L-1)/2 × F = (L-1) × F
- **All three are equal!** ✓

**One-line text** (18px for stat-label at line-height 1.2) centers in the min-height (39px) with 10.5px top/bottom — comfortable, balanced.

### Concrete values

| Element | Font | line-height | min-height | Between-line gap | Equal spacing |
|---------|------|-------------|------------|------------------|---------------|
| `.stat-label` | 15px | 1.2 | 2.6em (39px) | 3px | 3px above/between/below ✓ |
| `.chip-name` | 12px | 1.2 | 2.6em (31.2px) | 2.4px | 2.4px above/between/below ✓ |

### Height impact

All boxes remain the same height regardless of one-line vs two-line content:
- **Stat-pill:** content = max(label 39px, value 27px) = 39px + 24px padding = **63px** (was ~51px with tight line-height)
- **Chip:** 8 + 18 + 2 + 31.2 + 2 + 24 + 8 = **93.2px** (was ~71px with tight line-height)

The height increase is the unavoidable cost of giving two-line text real breathing room instead of squeezing it.

### CSS changes (identical in both daily-panel.ts and drinks-panel.ts)

**`.stat-label`** — change `line-height: 0.9` → `line-height: 1.2`; add `min-height: 2.6em; display: flex; flex-direction: column; justify-content: center;`

**`.chip-name`** — change `line-height: 0.75` → `line-height: 1.2`; add `min-height: 2.6em; display: flex; flex-direction: column; justify-content: center;` (keep `text-align: center; word-break: break-word; max-width: 100%`)

**Unchanged:** `.stat-pill` (overflow: hidden), `.stat-value` (line-height 1.5, nowrap), `.chip` (overflow: hidden), `.chip-value` (line-height 1.5, nowrap)

## Files to Modify

1. [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — `.stat-label` + `.chip-name` CSS
2. [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — `.stat-label` + `.chip-name` CSS
3. [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

## Verification

- `yarn run build` — exit 0, no warnings
- Visual check: two-line labels have equal spacing above/between/below; all boxes same height

## Memory Bank Updates (post-verification)

- `memory-bank/activeContext.md` — update Current Status
- `memory-bank/progress.md` — new section
- No `projectstructure.md` or `README.md` changes