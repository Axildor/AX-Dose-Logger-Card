# Bar Graph Label Layout Rethink — Architecture Plan

## Problem Analysis

The 14-day bar graph labels have three interrelated issues:

1. **Excessive vertical gap**: Chart baseline at y=170, labels at y=202 — 32px of dead space
2. **Misalignment with bars**: `text-anchor="end"` + `rotate(-45, ...)` pivots from the text's end point, causing labels to visually shift left of their corresponding bar centers
3. **ViewBox bloat**: `h=210` was inflated solely to prevent rotated labels from being clipped below the viewBox

**Root cause**: SVG `<text>` with rotation is fundamentally ill-suited for bar chart labels. The rotation pivot, anchor point, and bounding box all fight each other, and the only fix has been to inflate the viewBox — creating the excessive gap.

## Current Rendering Math

```
ViewBox: 320 × 210
padLeft=32, padRight=8, padTop=8, padBottom=40
Chart area: x=[32, 312], y=[8, 170]  (chartH=162)
Bar width: ~18px each, 2px gap
Labels: y=202 (h-8), text-anchor="end", rotate(-45, centerX, 202)
```

## Proposed Solution: Move Labels to HTML

Remove text labels from the SVG entirely and render them as an HTML flex row below the SVG. This gives full CSS control over spacing, rotation, and alignment.

### SVG Changes — `_renderBarGraph()`

| Parameter | Before | After | Reason |
|-----------|--------|-------|--------|
| `h` | 210 | 180 | No labels in SVG, no need for extra height |
| `padBottom` | 40 | 8 | Only need space for baseline stroke |
| `chartH` | 162 | 164 | Slightly taller chart area (180-10-8-8=154... wait) |

Actually let me recalculate:
- `h = 180`, `padTop = 10`, `padBottom = 8`
- `chartH = 180 - 10 - 8 = 162` (same as before, just less wasted space below)

**Removed from SVG**:
- All `<text>` elements inside the buckets `.map()` loop (the date labels)
- The `transform="rotate(-45, ...)"` attribute

**Kept in SVG**:
- Grid lines, Y-axis labels, bar rects, bar `<title>` tooltips
- Baseline `<line>` at `y = h - padBottom` (now y=172)

**Added to SVG**:
- Baseline stroke explicitly at the chart bottom for visual clarity

### HTML Changes — `_renderBarGraph()` return value

Currently returns a single `<svg>` element. After the change, it returns a `<div class="bar-graph-wrapper">` containing:
1. The `<svg>` element (chart only, no labels)
2. A `<div class="bar-labels">` containing 14 `<span>` elements with date labels

```html
<div class="bar-graph-wrapper">
  <svg viewBox="0 0 320 180" ...>
    <!-- bars, grid, Y-axis only -->
  </svg>
  <div class="bar-labels">
    <span>Jun 1</span>
    <span>Jun 2</span>
    ...
    <span>Jun 14</span>
  </div>
</div>
```

### Label Alignment Strategy

The key challenge is aligning HTML labels with SVG bars. The solution uses **proportional padding**:

- SVG `padLeft = 32` out of `w = 320` → `10%` left padding
- SVG `padRight = 8` out of `w = 320` → `2.5%` right padding
- HTML label container uses the same percentage padding
- Each `<span>` gets `flex: 1` → equal width → centers align with bar centers

Since bars are equally spaced within the chart area, and labels are equally spaced within the same proportional area, their centers naturally align.

### CSS for Rotated Labels

```css
.bar-graph-wrapper {
  /* No extra styles needed — SVG handles its own sizing */
}

.bar-labels {
  display: flex;
  padding-left: 10%;    /* matches SVG padLeft/w = 32/320 */
  padding-right: 2.5%;  /* matches SVG padRight/w = 8/320 */
  margin-top: -4px;     /* slight overlap to close gap between SVG and labels */
  overflow: hidden;      /* clip rotated text that extends beyond bounds */
}

.bar-labels span {
  flex: 1;
  text-align: right;            /* right-align so pivot point is near bar center */
  font-size: 9px;
  color: var(--secondary-text-color);
  transform: rotate(-45deg);
  transform-origin: right top;  /* pivot from top-right corner */
  white-space: nowrap;
  line-height: 1;
  padding-right: 2px;           /* slight offset to fine-tune alignment */
}
```

**Why `text-align: right` + `transform-origin: right top`?**
- Each flex item's right edge is close to the bar center (since bars have small gaps)
- The text pivots from its top-right corner, sweeping down-left at 45°
- This naturally places the start of each label near its bar's center
- Much more predictable than SVG's `text-anchor` + `rotate` combo

### Aspect Ratio Update

- Bar graph SVG: `style="aspect-ratio: 320/210"` → `style="aspect-ratio: 320/180"`
- Line graph SVG: unchanged (`style="aspect-ratio: 320/180"`)

### Files Modified

Only [`src/pill-logger-card.ts`](src/pill-logger-card.ts) needs changes:

1. **`_renderBarGraph()` method** (lines 450-503):
   - Change `h` from 210 to 180
   - Change `padTop` from 8 to 10 (slightly more breathing room at top)
   - Change `padBottom` from 40 to 8
   - Remove `<text>` elements from the buckets loop
   - Wrap return value in `<div class="bar-graph-wrapper">` with SVG + label div

2. **CSS** (lines 936-1310):
   - Add `.bar-graph-wrapper` styles
   - Add `.bar-labels` and `.bar-labels span` styles
   - Update `.chart-svg` if needed

## Visual Comparison

### Before
```
┌──────────────────────────────────┐ y=0
│  Y-axis labels + grid lines      │
│  ██████                           │
│  ██████  ██                       │
│  ██████  ██  ██                   │
│  ██████  ██  ██  ██               │ y=170 (chart bottom)
│                                    │
│                                    │ ← 32px dead space
│                                    │
│     Jun 1  Jun 2  Jun 3           │ y=202 (rotated labels)
└──────────────────────────────────┘ y=210
```

### After
```
┌──────────────────────────────────┐ y=0
│  Y-axis labels + grid lines      │
│  ██████                           │
│  ██████  ██                       │
│  ██████  ██  ██                   │
│  ██████  ██  ██  ██               │ y=172 (chart bottom)
└──────────────────────────────────┘ y=180
  Jun 1  Jun 2  Jun 3  Jun 4       ← HTML labels, -45° rotation
```

The gap between chart and labels is eliminated, labels align precisely with bars, and the total height is reduced by ~30px.