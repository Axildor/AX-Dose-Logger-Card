# Implementation Plan: Fix ll-rebuild Infinite Loop

## Problem

The browser tab locks up at 100% CPU when the card loads. Root cause: an infinite rendering loop created by dispatching `ll-rebuild` from inside the `updated()` lifecycle hook.

### Loop Mechanism

```
updated() fires → changedProperties.has('_activePane') → dispatchEvent('ll-rebuild')
     ↑                                                        ↓
     ← HA recalculates layout → property updates → updated() re-triggers ←
```

On **initial render**, `_activePane` transitions from `undefined` → `'daily'` (its `@state()` default), so `changedProperties.has('_activePane')` is `true` even on the very first update cycle. This means the loop starts immediately on card load, not just on tab clicks.

### Current Code (lines 835–845)

```typescript
updated(changedProperties: Map<string, any>) {
  super.updated(changedProperties);
  if (this._activePane === 'graphs' && this.config && this.hass) {
    const entities = this._resolveEntities();
    this._fetchAmountHistory(entities);
  }
  // ← THIS BLOCK CAUSES THE INFINITE LOOP
  if (changedProperties.has('_activePane')) {
    this.dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true }));
  }
}
```

### Current Click Handler (line 787)

```typescript
@click=${() => this._activePane = pane.id}
```

This inline mutation directly sets `_activePane`, which triggers `updated()`, which fires `ll-rebuild`, which causes HA to push property updates back, re-triggering `updated()`.

---

## Fix: 3 Surgical Changes

### Change 1 — Destroy the Loop

**Remove** the `ll-rebuild` dispatch block from `updated()` entirely (lines 842–844).

The `updated()` method should only retain the history-fetch logic:

```typescript
updated(changedProperties: Map<string, any>) {
  super.updated(changedProperties);
  if (this._activePane === 'graphs' && this.config && this.hass) {
    const entities = this._resolveEntities();
    this._fetchAmountHistory(entities);
  }
  // ll-rebuild dispatch REMOVED — moved to _handlePaneChange()
}
```

### Change 2 — Add `_handlePaneChange()` Method

Add a new private method between the `_handleRefill()` method (line 326) and the Device Info Dialog section (line 328):

```typescript
private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats'): void {
  if (paneId === this._activePane) return; // Guard: skip redundant execution
  this._activePane = paneId;
  this.updateComplete.then(() => {
    this.dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true }));
  });
}
```

**Why this works:**
- **Guard check** (`paneId === this._activePane`) prevents no-op re-dispatches if the user clicks the already-active tab
- **`updateComplete.then()`** ensures the DOM has finished rendering the new pane content before notifying HA's layout engine — HA gets the correct card height after the visual switch
- **Human-bound** — this method is only called from `@click` handlers, never from lifecycle hooks, so there is no feedback loop

### Change 3 — Reroute `@click` Directives

In `_renderPaneSelector()` (line 787), replace the inline mutation:

```typescript
// BEFORE
@click=${() => this._activePane = pane.id}

// AFTER
@click=${() => this._handlePaneChange(pane.id)}
```

---

## What Stays Unchanged

| Item | Reason |
|------|--------|
| `_fetchAmountHistory()` in `updated()` | Not involved in the loop — only fires when `_activePane === 'graphs'` |
| `getCardSize()` | Still returns dynamic sizes (5/7/8) — HA queries this after `ll-rebuild` |
| `getGridOptions()` | Still returns `{ rows: 'auto', columns: 12 }` |
| Carousel nav (`_activeGraph`) | Within-pane switch, no height change, no `ll-rebuild` needed |
| Dialog state (`_showDeviceInfo`, `_showRefillDialog`) | Fixed overlays, no height change |

---

## Verification

1. `yarn run build` — clean compilation, zero errors
2. Manual test: load card in HA dashboard — no CPU spike, no browser freeze
3. Manual test: click each pane tab — pane switches correctly, card height adjusts
4. Manual test: click already-active tab — no redundant dispatch (guard check)