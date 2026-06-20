# Plan — #16 Remove `ll-rebuild` + sessionStorage + 2 s timeout

## Problem

The card uses a fragile 3-part mechanism to handle pane switching:

1. **`_handlePaneChange()`** (line 591): sets `_activePane` (a `@state` property), writes the pane to `sessionStorage`, sets a "rebuilding" flag, calls `requestUpdate()`, then dispatches `ll-rebuild` after `updateComplete` resolves, and starts a 2 s safety-net `setTimeout` to clear the flag.

2. **`connectedCallback()`** (line 1421): checks the "rebuilding" flag to decide whether to restore the saved pane from `sessionStorage` or reset to defaults.

3. **`disconnectedCallback()`** (line 1450): clears the `_rebuildTimeout` if pending.

### Why this exists (history)

The `ll-rebuild` event was added in **Iteration 9.1** (Card Overlap Fix) to force HA's masonry layout engine to recalculate the card's height after a pane switch — because `getCardSize()` returns different values per pane (daily=5, graphs=8, stats=7, tools=6), and HA's masonry layout doesn't automatically re-measure when a `@state` property changes.

**Iteration 10.2** added `sessionStorage` pane persistence because `ll-rebuild` is a **destructive** event — HA tears down the card DOM and recreates the element from scratch, resetting all `@state` properties to their defaults. Without persistence, the pane switch was visible for ~1ms before the element was destroyed and recreated on the default pane.

**View-Entry Reset** added the flag + 2 s timeout to distinguish a genuine view entry (navigate away and back → reset to defaults) from an `ll-rebuild` reconnection (restore the pane).

### Why it's fragile

- The 2 s `setTimeout` is a **non-deterministic safety net**. If `ll-rebuild` recreates the element but the timeout fires first (slow render), the flag is cleared early and the next genuine view entry incorrectly restores a stale pane.
- If `ll-rebuild` does NOT recreate the element (HA version variance), the pane switch silently fails — the user clicks a pane tab, the `@state` updates, but `ll-rebuild` tears it down and recreates on the default.
- `sessionStorage` persists across the entire browser session, leaking pane state across unrelated view entries if the flag logic fails.
- The pattern is ~30 lines of coordination code across 3 lifecycle methods for what should be a simple `@state` mutation.

## Root Cause Analysis

The **real problem** `ll-rebuild` was solving: HA's masonry layout doesn't re-measure card height when a `@state` property changes. The card has different heights per pane (`getCardSize()` returns 5/8/7/6), so switching from daily (short) to graphs (tall) leaves the card in a too-small masonry slot, causing content overlap.

**But** — the card now uses `getGridOptions()` with `{ columns: 12, min_rows: 4 }` and omits `rows` (Batch 4 fix #11). In **sections view** (the modern HA layout), the card auto-sizes to its content height — no `ll-rebuild` needed. The `getCardSize()` dynamic sizing only matters in **masonry view** (legacy).

The question is: **does HA's masonry view re-measure when `getCardSize()` changes?**

- `getCardSize()` is called by HA when it needs to know the card's height. HA calls it on initial layout and on `ll-rebuild`.
- When a `@state` property changes, HA does NOT automatically re-call `getCardSize()`.
- **However**, HA's masonry view listens for the `card-resize` event (or `ll-rebuild`) to trigger a re-measure.

So the layout-recalculation need is real **in masonry view**. The question is whether we can trigger it without the destructive element recreation.

## Solution

**Replace the destructive `ll-rebuild` with a non-destructive `card-resize` event.**

HA's masonry layout engine listens for the `card-resize` custom event (bubbles, composed) to trigger a re-measure of the card's height — **without** destroying and recreating the element. This is the documented, non-destructive way to tell HA "my height changed, please re-measure."

This eliminates all three fragile parts:
1. No `ll-rebuild` → no element destruction → `@state` survives → no `sessionStorage` needed
2. No element recreation → no "rebuilding" flag needed
3. No flag → no 2 s safety-net timeout needed

### What changes

#### `_handlePaneChange()` (line 591) — simplified

**Before:**
```typescript
private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats' | 'tools'): void {
  if (paneId === this._activePane) return;
  this._activePane = paneId;
  const deviceId = this.config?.device_id || '';
  sessionStorage.setItem('pill_logger_pane_' + deviceId, paneId);
  sessionStorage.setItem('pill_logger_rebuilding_' + deviceId, '1');
  this.requestUpdate();
  this.updateComplete.then(() => {
    this.dispatchEvent(new CustomEvent('ll-rebuild', { bubbles: true, composed: true }));
    this._rebuildTimeout = window.setTimeout(() => {
      sessionStorage.removeItem('pill_logger_rebuilding_' + deviceId);
      this._rebuildTimeout = null;
    }, 2000);
  });
}
```

**After:**
```typescript
private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats' | 'tools'): void {
  if (paneId === this._activePane) return;
  this._activePane = paneId;
  // Tell HA's layout engine to re-measure the card height. card-resize is
  // non-destructive (unlike ll-rebuild, which tears down and recreates the
  // element) — the @state pane survives, so no sessionStorage persistence
  // or rebuild-flag coordination is needed.
  this.updateComplete.then(() => {
    this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true, composed: true }));
  });
}
```

Key changes:
- Removed `sessionStorage.setItem('pill_logger_pane_...')` — no longer needed
- Removed `sessionStorage.setItem('pill_logger_rebuilding_...')` — no longer needed
- Removed `this.requestUpdate()` — Lit auto-renders on `@state` mutation (this also fixes #17 for this method)
- Replaced `ll-rebuild` with `card-resize`
- Removed the 2 s `setTimeout` safety net

#### `connectedCallback()` (line 1421) — simplified

**Before:**
```typescript
connectedCallback(): void {
  super.connectedCallback();
  const deviceId = this.config?.device_id || '';
  const flagKey = 'pill_logger_rebuilding_' + deviceId;
  const paneKey = 'pill_logger_pane_' + deviceId;

  if (sessionStorage.getItem(flagKey)) {
    const saved = sessionStorage.getItem(paneKey);
    if (saved === 'daily' || saved === 'graphs' || saved === 'stats' || 'tools') {
      this._activePane = saved;
    }
    sessionStorage.removeItem(flagKey);
  } else {
    this._activePane = 'daily';
    this._activeGraph = 0;
    this._activeTimeframe = '48h';
    sessionStorage.removeItem(paneKey);
  }

  this._startTickTimer();
  this.requestUpdate();
}
```

**After:**
```typescript
connectedCallback(): void {
  super.connectedCallback();
  // Reset to defaults on every connection. With ll-rebuild removed, the
  // element is no longer destroyed/recreated on pane switch, so @state
  // survives naturally. The only time connectedCallback fires is on a
  // genuine view entry (navigate to the dashboard) or initial load — both
  // should start on the daily pane.
  this._activePane = 'daily';
  this._activeGraph = 0;
  this._activeTimeframe = '48h';
  this._startTickTimer();
}
```

Key changes:
- Removed all `sessionStorage` logic (flag check, pane restore, pane key removal)
- Removed `this.requestUpdate()` — Lit auto-renders on `@state` mutation (this also fixes #17 for this method)
- Reset to defaults is now unconditional — correct for genuine view entries

#### `disconnectedCallback()` (line 1450) — simplified

**Before:**
```typescript
disconnectedCallback(): void {
  super.disconnectedCallback();
  this._stopTickTimer();
  this._fetchToken++;
  if (this._rebuildTimeout !== null) {
    window.clearTimeout(this._rebuildTimeout);
    this._rebuildTimeout = null;
  }
}
```

**After:**
```typescript
disconnectedCallback(): void {
  super.disconnectedCallback();
  this._stopTickTimer();
  this._fetchToken++;
}
```

Key change:
- Removed `_rebuildTimeout` cleanup — the field no longer exists

#### Field declarations (line 130) — remove `_rebuildTimeout`

Remove:
```typescript
private _rebuildTimeout: number | null = null;
```

And update the comment block (lines 121-130) to remove the `_rebuildTimeout` mention.

#### `setConfig()` comment (lines 168-170) — update

Remove the comment about pane restore being handled in `connectedCallback()` for ll-rebuild, since that logic is gone.

## Risk Analysis

### Risk 1: `card-resize` may not trigger masonry re-measure in all HA versions

**Mitigation:** `card-resize` is a long-standing HA event (used by many built-in cards like `picture-card`, `iframe-card`, etc.). It's more stable than `ll-rebuild` for this purpose. If a specific HA version doesn't respond to `card-resize`, the visual symptom is a too-small/too-large masonry slot — not a crash or data loss. The card content still renders correctly; only the masonry slot size is wrong until the next layout pass.

### Risk 2: Pane state may not survive dashboard edit (config save)

When the user edits the card config via the visual editor and saves, HA may recreate the element. In that case, `connectedCallback` resets to the daily pane. This is **acceptable behavior** — the user was just in the config editor, not actively viewing a specific pane. The old `ll-rebuild` + sessionStorage pattern tried to preserve the pane across this, but that's a niche case and the reset-to-defaults behavior is more predictable.

### Risk 3: Pane state lost on HA navigation (view switch)

When the user navigates away from the dashboard and back, `connectedCallback` fires and resets to daily. This is the **correct** behavior — the old "View-Entry Reset" iteration explicitly designed for this. The sessionStorage flag was the workaround for `ll-rebuild` interfering with this reset; without `ll-rebuild`, the reset works naturally.

### What does NOT change

- `getCardSize()` still returns dynamic per-pane sizes — HA calls this on layout passes
- `getGridOptions()` still returns `{ columns: 12, min_rows: 4 }` — sections view auto-height
- `shouldUpdate()` gating still works — `@state` mutations trigger renders as before
- `updated()` lifecycle still fetches history on pane switch to graphs
- `_fetchToken` race guard still works — unrelated to ll-rebuild
- `_tickTimer` still refreshes countdowns every 30s

## Verification

1. `yarn build` — must compile without errors
2. Manual test (if HA instance available):
   - Switch between all 4 panes — pane should change immediately, no flicker/reset
   - Switch to graphs pane — masonry slot should resize to fit the taller content
   - Navigate away from dashboard and back — should reset to daily pane
   - Edit card config via visual editor and save — should reset to daily pane

## Files to modify

- [`src/pill-logger-card.ts`](src/pill-logger-card.ts) — `_handlePaneChange()`, `connectedCallback()`, `disconnectedCallback()`, field declarations, `setConfig()` comment