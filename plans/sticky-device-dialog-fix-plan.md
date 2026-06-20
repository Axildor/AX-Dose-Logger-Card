# Plan — Sticky "To Device" Dialog Fix

## Problem
When the user clicks the medication name → device-info dialog opens → clicks
"To Device info" → navigates to the HA device page → presses the browser back
button, the device-info dialog is **still visible** on the dashboard.

## Root Cause
The click handler at [`src/pill-logger-card.ts:614`](src/pill-logger-card.ts:614)
sets `_showDeviceInfo = false` and then calls `_navigateToDevice()`, which
dispatches `location-changed`. HA's router navigates away and the card's
`disconnectedCallback` fires.

The problem is a **Lit update-flush race**: the `_showDeviceInfo = false`
mutation schedules a reactive update, but when the element is disconnected
mid-flight Lit **pauses** the update. The `ha-dialog` element (based on
`mwc-dialog`/MDC) has a close transition; tearing the element down before the
transition completes leaves MDC's internal overlay state in an "open" posture.
On back-navigation `connectedCallback` fires and Lit resumes/flushes the
pending update — but the `ha-dialog` instance may have already re-rendered with
`open` still effectively true from its internal MDC state, so the dialog
re-appears even though `_showDeviceInfo` is `false`.

Compounding this: [`connectedCallback()`](src/pill-logger-card.ts:1404) resets
`_activePane`, `_activeGraph`, and `_activeTimeframe` on every (re)connection
but does **not** reset any of the four dialog flags
(`_showDeviceInfo`, `_showRefillDialog`, `_toolsDialog`, `_overrideDialog`).
So any dialog that was open at disconnect-time is not explicitly cleared on
reconnect, leaving the door open for stale overlay state.

## Fix
**Reset all four dialog flags in `connectedCallback()`**, mirroring the
existing pane/graph/timeframe reset. This guarantees a clean slate on every
genuine view entry (initial load or back-navigation) and is consistent with the
documented intent at
[`src/pill-logger-card.ts:1406-1411`](src/pill-logger-card.ts:1406):

> "The only time connectedCallback fires is on a genuine view entry (navigate
> to the dashboard) or initial load — both should start on the daily pane."

Dialogs are transient UI — they should never survive a view exit/re-entry.

### Change in `connectedCallback()` (src/pill-logger-card.ts:1404)
Add after the `_activeTimeframe` reset:

```ts
// Clear any dialog that was open when the card was disconnected. Lit pauses
// reactive updates while an element is detached, so a dialog flag set to
// false just before navigation may not have flushed its DOM removal before
// disconnect — leaving ha-dialog's MDC overlay in an "open" state that
// re-appears on back-navigation. Resetting here guarantees a clean slate
// on every view entry. (#sticky-device-dialog)
this._showDeviceInfo = false;
this._showRefillDialog = false;
this._refillAmount = '';
this._toolsDialog = null;
this._overrideDialog = null;
```

### Why this is the right fix (vs. alternatives)
- **Alternative A — close the dialog before navigating:** Reorder line 614 to
  set `_showDeviceInfo = false` first, then navigate. This doesn't solve the
  Lit-flush race; the update is still scheduled, not synchronous, and
  disconnect can still pre-empt it.
- **Alternative B — call `this.requestUpdate()` / `await this.updateComplete`
  before navigating:** Adds latency to navigation and is fragile (the
  `location-changed` dispatch is what triggers disconnect, so awaiting
  `updateComplete` before dispatching would work but is heavier than needed).
- **Chosen fix — reset in `connectedCallback`:** Simplest, most robust, and
  matches the existing reset pattern. It also future-proofs against the same
  sticky-dialog bug affecting the refill, tools, and override dialogs if a
  user navigates away while one of those is open.

## Verification
1. `yarn build` — clean compile.
2. Manual: open device-info dialog → click "To Device info" → press back →
   confirm dialog is gone and daily pane shows.
3. Manual: open refill dialog → navigate away (e.g. click a chip that
   navigates, or use browser back) → return → confirm refill dialog is gone.

## Files Modified
- `src/pill-logger-card.ts` — `connectedCallback()` gains 5 dialog-flag resets.
- `dist/pill-logger-card.js` — rebuilt.
- `memory-bank/activeContext.md`, `memory-bank/progress.md` — updated.