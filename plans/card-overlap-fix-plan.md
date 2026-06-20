# Card Overlap Fix Plan (Revised)

## Problem
The Pill Logger card overlaps with cards below it in HA's masonry and sections layouts. When switching to the "Graphs" or "Stats" pane, the expanded content bleeds behind the next card instead of pushing it down.

## Previous Fix Failures

### Failure 1: Hallucinated `card-resize` Event
Previous attempt dispatched `new CustomEvent('card-resize', { bubbles: true })`. This event does not exist in Home Assistant core — no layout engine listens for it. The correct event is `ll-rebuild`.

### Failure 2: Removing `overflow: hidden` from `ha-card`
Removing `overflow: hidden` caused the bottom navigation bar and SVG charts to bleed out of the normal document flow and paint over the dashboard background, worsening the visual overlap. The `ha-card` must retain `overflow: hidden` to maintain CSS boundary integrity.

## Corrected Architecture

### Change 1: Restore `ha-card` CSS with flex layout
The `ha-card` must have:
- `display: flex` — enables flex child sizing
- `flex-direction: column` — stacks card-content above pane-selector
- `overflow: hidden` — maintains CSS boundary, prevents content bleeding

Current (broken):
```css
ha-card {
  /* overflow: hidden removed — allow card to expand naturally with content */
}
```

Target:
```css
ha-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
```

### Change 2: Add `flex: 1 1 auto` to `.card-content`
The inner content container must use `flex: 1 1 auto` so the DOM naturally dictates the internal height. This allows the card to grow/shrink based on pane content while staying within the `ha-card` boundary.

Current:
```css
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

Target:
```css
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1 1 auto;
}
```

### Change 3: Replace `card-resize` with `ll-rebuild` event
In the `updated()` lifecycle method, replace the hallucinated `card-resize` event with HA's native `ll-rebuild` event. This event must use `{ bubbles: true, composed: true }` to pierce Shadow DOM boundaries and reach the root layout engine.

Current:
```typescript
if (changedProperties.has('_activePane')) {
  this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true }));
}
```

Target:
```typescript
if (changedProperties.has('_activePane')) {
  this.dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true }));
}
```

### Change 4: Update `getGridOptions()` for Sections layout
The 2026 HA Sections layout uses `rows: 'auto'` to let the card dictate its own height. The old Masonry format with `min_rows`/`max_rows` is deprecated.

Current:
```typescript
getGridOptions() {
  return {
    rows: 4,
    columns: 12,
    min_rows: 3,
    max_rows: 6,
  };
}
```

Target:
```typescript
getGridOptions() {
  return {
    rows: 'auto',
    columns: 12,
  };
}
```

### Change 5: Keep `getCardSize()` dynamic (retained from previous fix)
The dynamic `getCardSize()` returning different values per pane is still useful for Masonry layout fallback. Keep it as-is.

## Files to Modify
- `src/pill-logger-card.ts` — CSS changes (ha-card, .card-content), lifecycle (ll-rebuild), sizing (getGridOptions)