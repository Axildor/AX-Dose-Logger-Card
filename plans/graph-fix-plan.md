# Graph Pane Fix Plan

## Problem Statement
1. **Graphs not rendering** — The SVG bar chart and line chart in Pane 2 (Graphs) are not displaying properly.
2. **Averages grid too tall** — The averages/adherence grid takes up too much vertical space, leaving insufficient room for the graphs.

## Root Cause Analysis

### Graph Rendering Issues

1. **SVG `height` attribute with `px` suffix** — Both `_renderBarGraph()` and `_renderLineGraph()` set `height="${h}px"` on the `<svg>` element. The `height` SVG attribute should be unitless or set via CSS. The `px` suffix can cause parsing failures in some rendering contexts, resulting in the SVG collapsing to zero height.

2. **No CSS dimensions on `.chart-svg`** — The CSS class only sets `display: block`. Without explicit CSS `width`/`height`, the SVG relies entirely on its HTML attributes, which is fragile in flex layouts.

3. **No `min-height` on `.graph-container`** — If the SVG fails to establish its height, the container collapses entirely, making the graph invisible.

4. **Variable shadowing** — In `_renderLineGraph()`, the loop variable `h` at line 520 shadows the outer `const h = 140`. While `let` is block-scoped and doesn't cause a runtime bug, it's confusing and should be renamed for clarity.

### Averages Grid Layout

The current `.averages-grid` uses `grid-template-columns: 1fr 1fr` (2 columns). With up to 8 items (4 averages + 4 adherence values), this creates 4 rows of cells, each with `padding: 10px 8px` and `font-size: 16px` values. This consumes roughly 160-200px of vertical space.

## Implementation Plan

### Step 1: Fix SVG rendering attributes
- In `_renderBarGraph()`: Change `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}px">` to `<svg viewBox="0 0 ${w} ${h}" class="chart-svg">` — remove inline `width` and `height` attributes, let CSS handle sizing.
- In `_renderLineGraph()`: Same change.
- Update `.chart-svg` CSS to: `width: 100%; height: auto; display: block;` with a `min-height` to prevent collapse.

### Step 2: Add min-height to .graph-container
- Add `min-height: 180px` to `.graph-container` CSS to ensure the container never collapses even if SVG sizing fails.

### Step 3: Fix variable shadowing
- In `_renderLineGraph()`, rename the loop variable from `h` to `hours` to avoid shadowing the outer `const h = 140`.

### Step 4: Compact averages grid to single-row layout
- Change `.averages-grid` from `grid-template-columns: 1fr 1fr` to a horizontal flex layout that fits all items on one line.
- Reduce `.avg-cell` padding from `10px 8px` to `6px 4px`.
- Reduce `.avg-value` font-size from `16px` to `13px`.
- Reduce `.avg-label` font-size from `10px` to `9px`.
- This frees up ~120px of vertical space for the graphs.

### Step 5: Increase graph SVG dimensions
- Increase SVG `h` from 140 to 180 in both `_renderBarGraph()` and `_renderLineGraph()`.
- Adjust `padBottom` from 24 to 28 to accommodate the larger chart area.
- This gives the graphs more room to breathe with the space freed from the averages grid.

## Files Modified
- `src/pill-logger-card.ts` — All changes above