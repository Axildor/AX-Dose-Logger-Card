# Graph Rendering Fix Plan

## Problem Statement
Both graphs in the Graphs pane are broken:
1. **15-Day Doses** renders as a big square box (no visible bars)
2. **Amount in Body** shows only a grey line at the bottom and a blue dotted line with "Current: 394.4 mg"

## Root Cause Analysis

### Bug 1: Line Graph — Variable references still use `h` instead of `hours` (CRITICAL)

In `_renderLineGraph()` at lines 520-522, the loop variable was renamed from `h` to `hours` in the `for` declaration, but the **body** still references `h` (the SVG height constant = 180):

```typescript
for (let hours = 0; hours <= 48; hours += 6) {
  const fraction = h / 48;      // BUG: h=180, should be hours/48
  timeLabels.push({ hour: h, x: padLeft + fraction * chartW });  // BUG: hour=180, should be hours
}
```

**Impact**: 
- `fraction = 180/48 = 3.75` instead of `hours/48` (should be 0→1 range) — all time labels positioned far off the right edge of the SVG
- `hour = 180` instead of `hours` (0, 6, 12...48) — label text renders as `-${48-180}h` = `--132h` instead of `-48h`, `-42h`, etc.
- Result: all time labels and dose markers are invisible (off-screen), leaving only the grey baseline and the blue "Current" dotted line

**Fix**: Change `h` to `hours` in both places inside the loop body.

### Bug 2: Bar Graph — SVG missing intrinsic dimensions

Both SVG elements had their `width` and `height` HTML attributes removed in the previous fix (to solve the `px` suffix issue). However, without these attributes, browsers cannot determine the SVG's intrinsic aspect ratio from `viewBox` alone — especially in Shadow DOM / flex contexts. The SVG defaults to filling the container as a square, making the bar chart appear as a "big square box."

**Fix**: Restore `width` and `height` attributes with **unitless** values (which are valid in SVG). The `px` suffix was the original bug; unitless values like `width="320" height="180"` are perfectly valid.

### Bug 3: CSS `min-height: 180px` on `.chart-svg` distorts aspect ratio

The `min-height: 180px` on `.chart-svg` forces the SVG to be at least 180px tall regardless of its width. On narrow cards, this stretches the SVG vertically, distorting the chart.

**Fix**: Remove `min-height` from `.chart-svg`. Keep `min-height: 180px` only on `.graph-container` (which is the outer wrapper and doesn't affect SVG aspect ratio).

### Bug 4: Missing `preserveAspectRatio` on SVG elements

Without explicit `preserveAspectRatio`, browsers may not maintain the correct aspect ratio when the SVG is scaled.

**Fix**: Add `preserveAspectRatio="xMidYMid meet"` to both SVG elements.

## Implementation Plan

### Step 1: Fix line graph time labels loop
- In `_renderLineGraph()`, change line 521 from `const fraction = h / 48;` to `const fraction = hours / 48;`
- Change line 522 from `timeLabels.push({ hour: h, x: ... })` to `timeLabels.push({ hour: hours, x: ... })`

### Step 2: Add unitless width/height to bar graph SVG
- In `_renderBarGraph()`, change `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">` to `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet">`

### Step 3: Add unitless width/height to line graph SVG
- In `_renderLineGraph()`, change `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">` to `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet">`

### Step 4: Fix CSS for `.chart-svg`
- Remove `min-height: 180px` from `.chart-svg`
- Keep `width: 100%; height: auto; display: block;`

### Step 5: Build and verify
- Run `yarn run build` to verify clean compilation

## Files Modified
- `src/pill-logger-card.ts` — All changes above