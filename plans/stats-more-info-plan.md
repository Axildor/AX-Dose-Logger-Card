# Plan — Stats Pane: Clickable Cells Open More-Info Dialog

## Goal
Each box (`.stat-cell`) in the Stats pane should open the native Home Assistant
more-info dialog for the entity it displays when clicked.

## Current State
- [`_renderPane3()`](src/ax-dose-logger-card.ts:1285) builds a `rows` array of
  `{ label: string; value: string; icon: string }` and renders them as
  `.stat-cell` divs inside a `.stats-grid`.
- The entity_id for each row is available on the `entities` object
  (e.g. `entities.totalDoses`, `entities.avg7Days`, `entities.adherence7Days`,
  `entities.daysSinceFirstDose`, `entities.steadyState`, `entities.strength`,
  `entities.amountInBody`, `entities.lastDose`, `entities.avgYearly`,
  `entities.adherence365Days`).
- The card already dispatches custom events via native
  `this.dispatchEvent(new CustomEvent(..., { bubbles: true, composed: true }))`
  (see `card-resize` at line 625 and `location-changed` at line 634).
- `custom-card-helpers` (already a devDependency) exports `fireEvent`, which is
  the canonical HA helper for dispatching `hass-more-info`.

## Design

### 1. Carry the entity_id into each row
Extend the row type in `_renderPane3` to include an optional `entityId` field:

```ts
const rows: Array<{ label: string; value: string; icon: string; entityId?: string }> = [];
```

Each `rows.push(...)` call already has the entity reference in scope
(e.g. `entities.totalDoses`), so add `entityId: entities.totalDoses` to each
push. Rows that are computed/derived (none currently — all rows map 1:1 to an
entity) simply omit the field.

### 2. Fire `hass-more-info` on click
Add a click handler on each `.stat-cell`:

```ts
@click=${row.entityId ? () => this._openMoreInfo(row.entityId!) : undefined}
```

New helper method:

```ts
private _openMoreInfo(entityId: string): void {
  fireEvent(this, 'hass-more-info', { entityId });
}
```

Import `fireEvent` from `custom-card-helpers`:

```ts
import { fireEvent } from 'custom-card-helpers';
```

`fireEvent` defaults to `{ bubbles: true, composed: true }`, which is exactly
what HA's more-info dialog listener expects. This matches the pattern used by
every stock Lovelace card (the same `hass-more-info` event is fired by
`handleAction` in custom-card-helpers at line 1117).

### 3. CSS — make cells look clickable
Add to the existing `.stat-cell` rule:

```css
.stat-cell {
  cursor: pointer;
  transition: background 0.15s ease;
}
.stat-cell:hover {
  background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
}
```

Only apply the pointer cursor when the row has an entity. Use a modifier
class `.stat-cell.clickable` gated on `row.entityId` to avoid showing a pointer
on any future entity-less rows.

### 4. Accessibility
Add `role="button"` and `tabindex="0"` to clickable cells, plus a
`@keydown` handler that fires the same more-info action on Enter/Space —
matching the pattern already used by the refill `.stat-pill.clickable` at
line 788.

## Files Modified
| File | Change |
|------|--------|
| [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Import `fireEvent`; extend row type with `entityId`; add `entityId` to each `rows.push`; add `_openMoreInfo()` helper; add `@click`/`@keydown` + a11y attrs to `.stat-cell`; add `.clickable` + `:hover` CSS |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Rebuilt via `yarn run build` |

## Verification
- `yarn run build` exits 0 (clean rollup compile).
- Manual: click a stat cell in a running HA instance → native more-info dialog
  opens for that entity.

## Non-Goals
- No changes to the Graphs pane averages grid (`_renderAveragesGrid`) — that is
  a separate compact display; the user specifically referenced the "stats
  panel" boxes.
- No backend changes required.