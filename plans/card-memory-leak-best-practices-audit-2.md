# AX Dose Logger Card — Memory Leak & Best-Practices Audit (Round 2)

**Date:** 2026-08-11
**Scope:** [`src/`](src/) (all TypeScript source in the frontend card repo)
**Focus:** Memory leaks · Home Assistant / Lit guidelines · Performance regressions
**Prior audits:** [`plans/card-best-practices-audit.md`](plans/card-best-practices-audit.md) (Round 1, 20 findings) + [`plans/card-integration-audit.md`](plans/card-integration-audit.md) (Round 1.5, 12 findings)

---

## Executive Summary

The card has matured significantly since the two prior audits. The majority of Round 1 / Round 1.5 findings are now **fixed and verified in the current source**:

| Prior Finding | Status | Evidence |
|---------------|--------|----------|
| R1-#1 No `shouldUpdate` | ✅ Fixed | [`shouldUpdate`](src/ax-dose-logger-card.ts:2640) gates on config + internal `@state` + `_tick` + `_relevantStateChanged` |
| R1-#2 Raw `fetch` + manual token | ✅ Fixed | All 3 fetches use [`this.hass.callApi`](src/ax-dose-logger-card.ts:1984) |
| R1-#3 No `disconnectedCallback` | ✅ Fixed | [`disconnectedCallback`](src/ax-dose-logger-card.ts:2575) cancels tick, ACK, freeze, refetch timers + bumps fetch tokens |
| R1-#4 Fetch races | ✅ Fixed | Per-stream race tokens ([`_amountFetchToken`](src/ax-dose-logger-card.ts:268) etc.) |
| R1-#5 `_resolveEntities` O(n) every render | ✅ Fixed | Cache at [`_resolvedEntities`](src/ax-dose-logger-card.ts:248) keyed on deviceId + entities ref |
| R1-#6 Native `confirm()` | ✅ Fixed | `_overrideDialog` + [`ha-dialog`](src/ax-dose-logger-card.ts:1645) |
| R1-#7 Custom dialogs → `ha-dialog` | ✅ Fixed | All 8 dialogs use `<ha-dialog>` |
| R1-#8 Icon-only buttons missing `aria-label` | ✅ Fixed | Pane selector + box buttons carry `aria-label` |
| R1-#9 No localization | ✅ Fixed | [`localize()`](src/localize.ts) helper + `hass.locale` formatting |
| R1-#10 `setConfig` doesn't throw | ✅ Fixed | [`throw new Error`](src/ax-dose-logger-card.ts:314) on missing device_id |
| R1-#11 `getGridOptions` string rows | ✅ Fixed | [`getGridOptions`](src/ax-dose-logger-card.ts:2839) returns numeric `columns`/`min_rows` |
| R1-#12 Custom `PillLoggerHass` | ✅ Fixed | [`AxDoseLoggerHass extends HomeAssistant`](src/types.ts:252) |
| R1-#13 No `implements LovelaceCard` | ✅ Fixed | [`implements LovelaceCard, CardController`](src/ax-dose-logger-card.ts:119) |
| R1-#14 Errors swallowed | ✅ Fixed | `console.warn` with context in all catch blocks |
| R1-#16 `ll-rebuild` + sessionStorage | ✅ Fixed | Removed; pane state survives in `@state`; `card-resize` event instead |
| R1-#17 Redundant `requestUpdate()` | ✅ Fixed | Removed from `connectedCallback` + `_handlePaneChange` |
| R1-#18 Defaults mutated into config | ✅ Fixed | [`setConfig`](src/ax-dose-logger-card.ts:282) stores raw config; `!== false` pattern at read sites |
| R1-#19 History fetch lacks optimization | ✅ Fixed | `&minimal_response&significant_changes_only=1` in all history calls |
| R1-#20 `preview: false` | ✅ Fixed | [`preview: true`](src/ax-dose-logger-card.ts:3165) |
| R1.5-H1 MutationObserver leak | ✅ Fixed | Moved to [`getConfigForm()`](src/ax-dose-logger-card.ts:2863) + auto-cleanup on 0 forms |
| R1.5-H2 `_getDrinksOfSubstance` no cache | ✅ Fixed | [`_drinksCache`](src/ax-dose-logger-card.ts:259) keyed on substance + entities ref |
| R1.5-M1 Mutating state in `render()` | ✅ Fixed | Moved to [`willUpdate()`](src/ax-dose-logger-card.ts:2426) |
| R1.5-M2 Tick not reaching panels | ✅ Fixed | `.tick=${this._tick}` passed to daily/stats/drinks/inventory panels |
| R1.5-M4 Graphs re-fetch every state change | ✅ Fixed | Debounced ([`GRAPHS_REFETCH_DEBOUNCE_MS`](src/ax-dose-logger-card.ts:278)) |
| R1.5-L1 Unused `svg` import | ✅ Fixed | Main file imports only `LitElement, html, css, nothing` |
| R1.5-L3 Dead type re-exports | ✅ Fixed | Main file imports types only, no `export type {}` block |
| R1.5-L4 `_predictLowToken` is `@state` | ✅ Fixed | Now a plain field ([`private _predictLowToken`](src/ax-dose-logger-card.ts:155)) |
| R1.5-L6 `_pendingTracking` not cleared | ✅ Fixed | [`this._pendingTracking.clear()`](src/ax-dose-logger-card.ts:2566) in `connectedCallback` |

**Remaining from prior audits (not yet addressed):**
- R1-#15 Inconsistent `--rgb-error-color` fallbacks — cosmetic, low priority.
- R1.5-L2 Dead localize keys (`pane.caffeine`, `caffeine.placeholder`, `config.graph_options`) — search returned 0 references, confirming they are dead.
- R1.5-L5 Duplicate `_getTimeframeHours` — already deduplicated into [`helpers.ts`](src/helpers.ts:130) `getTimeframeHours()`; the container's [`_getTimeframeHours`](src/ax-dose-logger-card.ts:749) delegates to it. The graphs panel also delegates to the same helper. **This is now fixed.**
- R1.5-L7 `_computeEntities` double iteration — still present (two `Object.entries` loops in [`_computeEntities`](src/ax-dose-logger-card.ts:367)), but cached so impact is minimal. Low priority.
- R1.5-M3 Global CSS injection affects all `ha-form` elements — the CSS is still injected into every `ha-form` shadow root in the document (cross-card pollution persists). The observer leak is fixed but the scoping is not.

**NEW findings introduced since the prior audits are detailed below.**

---

## 🔴 High — Memory Leak / Correctness

### N1. `delayedAction()` creates a new timer per render and never clears across renders — timer + closure leak on every Lit update

**File:** [`src/delayed-action.ts`](src/delayed-action.ts:36)

```typescript
export function delayedAction<T extends Event>(
  callback: (ev: T) => void,
): (ev: T) => void {
  let timer: number | undefined;
  let latest: (ev: T) => void = callback;
  latest = callback;
  return (ev: T) => {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      timer = undefined;
      latest(ev);
    }, RIPPLE_ACTION_DELAY_MS);
  };
}
```

**The bug:** `delayedAction()` is called **inline in every Lit `render()` template** — 28 call sites across 7 files (confirmed by search). Each call to `delayedAction()` creates a **brand-new closure** with its own `timer` and `latest` variables. This happens on **every render** of the host element (card or panel), not once.

The doc-comment claims "The wrapper is stable across renders (it captures the latest callback via a closure-reassigned ref) so Lit's `@click` event binding is not re-attached on every update — only the callback reference changes." **This claim is false.** The wrapper is *not* stable across renders because `delayedAction()` is invoked fresh inside `render()` each time, producing a new function identity. The `latest = callback` reassigment is dead code (it reassigns immediately after initialization on the line above).

**Consequences:**

1. **Lit re-binds the `@click` listener on every render** — because the function identity changes each time `delayedAction()` is called. This defeats the stated optimization and adds `addEventListener`/`removeEventListener` churn on every update. For a card with ~15 `delayedAction` bindings on the daily pane, that's ~15 listener swaps per render.
2. **Stale timer leak:** When the user clicks, a 110ms `setTimeout` is armed inside the *current* closure. If a re-render happens within those 110ms (very common — HA state updates arrive continuously, and the card's `shouldUpdate` returns `true` on relevant state changes), a **new** closure is created, and the old closure's `timer` variable is no longer reachable by the new closure. The old timer **still fires** (it's in the browser's timer queue), invoking `latest(ev)` with the stale callback. If the callback references stale state (e.g. an old `entities` object), the action fires against outdated data. The new closure's `timer` is `undefined`, so a second click arms a *second* timer — the "cancel pending timer" deduplication only works within a single closure instance, which is replaced on every render.
3. **Rapid-click double-fire:** Because each render produces a fresh closure with `timer === undefined`, a rapid double-click where a re-render happens between the two clicks will **not** cancel the first timer (the second click's closure is a different object). Both timers fire → the action runs twice. This directly undermines the rapid-click counter's correctness.

**Why it diverges from best practice:** Lit's `@click` binding uses function identity to decide whether to re-attach the listener. A stable wrapper (e.g. created in `connectedCallback` or as an instance field) avoids re-binding. The inline `delayedAction()` pattern is the opposite of stable. HA's own `actionHandler` uses a long-lived `ActionHandler` instance per element to avoid this exact problem.

**Recommended fix:** Make the wrapper **stable per element + event target**. Two viable approaches:

**Option A — Instance-bound stable wrappers (recommended):**
Replace `delayedAction(() => handler())` with a stable per-element helper that memoizes the wrapper by a key (e.g. the handler's semantic identity). The simplest correct form:

```typescript
// On the panel/card class:
private _delayedClicks = new Map<string, (ev: Event) => void>();

private _delayed(key: string, cb: () => void): (ev: Event) => void {
  let wrapper = this._delayedClicks.get(key);
  if (!wrapper) {
    let timer: number | undefined;
    let latest: () => void = cb;
    wrapper = (ev: Event) => {
      if (timer !== undefined) clearTimeout(timer);
      timer = window.setTimeout(() => { timer = undefined; latest(); }, RIPPLE_ACTION_DELAY_MS);
    };
    this._delayedClicks.set(key, wrapper);
  }
  // Update the callback the existing wrapper will call (stable identity).
  // This requires the wrapper to read `latest` from a mutable slot.
  // ...
  return wrapper;
}
```

The key insight: the **wrapper function identity must be stable** across renders; only the **callback** it dispatches to should be updated. A `Map<key, { wrapper, latestCb }>` where the wrapper reads `latestCb` from the map entry achieves this.

**Option B — Move the delay into `ha-ripple` lifecycle instead of wrapping callbacks:**
HA's `<ha-ripple>` already coordinates with the action handler. The 110ms delay exists to let the ripple render before Lit re-renders. A cleaner approach is to defer the *re-render* (e.g. via `shouldUpdate` returning false for one frame after a click) rather than deferring the action. This is a larger refactor but eliminates the helper entirely.

**At minimum (quick fix):** Change `delayedAction` to return a stable wrapper by hoisting the closure out of `render()`. The callers must store the wrapper on the element instance (e.g. `this._takePillClick = delayedAction(() => …)` in `connectedCallback` or as a field initializer) and reference `this._takePillClick` in the template. This keeps the wrapper identity stable and the `clearTimeout` dedup correct.

**Severity rationale:** High because (a) it causes **measurable listener churn on every render** across 28 bindings, (b) it can **double-fire actions** on rapid clicks when a re-render intervenes — a correctness bug for a medical logging card, and (c) the stale-callback path can fire `button.press` against an outdated entity context.

---

## 🟠 Medium — Best-Practice Violations

### N2. Global CSS injection still pollutes other cards' `ha-form` editors

**File:** [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:109) — `installEditorGridAlignment()`

**Status:** Partially fixed from R1.5-H1/R1.5-M3. The observer leak is fixed (auto-cleanup on 0 forms + explicit `uninstallEditorGridAlignment()`), and it's now called from `getConfigForm()` instead of `connectedCallback()`. **However, the cross-card CSS pollution persists.**

**Issue:** [`processForms()`](src/ax-dose-logger-editor.ts:133) runs `document.querySelectorAll('ha-form')` and injects the `<style id="ax-dose-grid-align-items-end">` into **every** `ha-form` shadow root in the entire document — not just this card's editor dialog. Any other custom card using `type: 'grid'` in its `getConfigForm()` schema receives the `align-items: end !important` override, which may break their intended layout.

**Why it diverges from best practice:** A custom card's editor CSS should be scoped to its own dialog. HA opens each card's config in a dialog; the observer can verify the `ha-form` is inside a dialog triggered for `ax-dose-logger-card` before injecting. Alternatively, the grid-alignment fix can be applied via the schema's own layout options (HA's `ha-form` grid supports `column_min_width`, which is already used) rather than CSS injection.

**Recommended fix:** Scope the injection. The simplest correct approach: check that the `ha-form`'s closest dialog was opened for this card type (HA sets a `data-card-type` or the dialog contains the card's editor). If that's not reliably available, inject the style only into `ha-form` elements whose schema contains a field name unique to this card (e.g. `device_id` with the `ax_dose_logger` integration filter). Failing that, accept the pollution but document it as a known limitation — `align-items: end` is a mild override unlikely to break most layouts, but it is technically a guideline violation.

### N3. `window` timer handles typed as `number` but used with `window.setTimeout` — works but non-standard for HA's TS config

**File:** [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:184) — `_dailyAckTimer?: number;` and all timer fields.

**Issue:** All timer handles (`_dailyAckTimer`, `_drinksAckTimer`, `_dailyFreezeTimer`, `_drinksFreezeTimer`, `_tickTimer`, `_graphsRefetchTimer`) are typed `number | undefined` and use `window.setTimeout`/`window.clearTimeout`. In a browser context this is correct (DOM `setTimeout` returns `number`). However, the `@state`-adjacent fields and the `requestUpdate()` calls inside timer callbacks are the only thing keeping the ACK flash alive after disconnect-cancellation was added — this is correct, but the pattern of calling `this.requestUpdate()` inside a `setTimeout` callback is a known Lit anti-pattern when the element may be detached.

**Current state:** `disconnectedCallback()` does cancel all timers (verified), so the detached-element `requestUpdate()` risk is mitigated. This is **not a bug** — just a note that the timer-callback-mutates-reactive-state pattern is fragile and should be guarded with a `_connected` flag for defense-in-depth.

**Recommended fix (optional):** Add a `private _connected = false;` flag set in `connectedCallback`/`disconnectedCallback`, and guard the timer callbacks:

```typescript
this._dailyAckTimer = window.setTimeout(() => {
  if (!this._connected) return;
  this._dailyAckActive = false;
  this._dailyAckCount = 0;
  this._dailyAckTimer = undefined;
  this.requestUpdate();
}, Math.max(500, duration));
```

This is belt-and-suspenders on top of the existing `clearTimeout` in `disconnectedCallback`. Low priority since the cleanup is already correct.

---

## 🟡 Low — Dead Code / Code Quality

### N4. Dead localize keys still present (confirmed from R1.5-L2)

**File:** [`src/localize.ts`](src/localize.ts)

A search for `pane.caffeine`, `caffeine.placeholder`, and `config.graph_options` across `src/` returned **0 references** outside `localize.ts` itself, confirming all three are dead.

**Fix:** Remove the three keys. Trivial.

### N5. `_computeEntities()` still double-iterates `hass.entities` (R1.5-L7, unchanged)

**File:** [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:367) — two `Object.entries(this.hass.entities)` loops (lines 377 + 462).

**Status:** Cached, so the cost is only paid on device-id or registry change. Still a code-quality smell.

**Fix (optional):** Merge into one pass. Low priority.

### N6. `_formStyleObserver` is module-scoped — single global observer across all card instances

**File:** [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:84)

**Issue:** `let _formStyleObserver` is module-scoped. If two card instances are on the same dashboard and both open their editors (unlikely but possible in a multi-card dashboard with two browser tabs), the second `installEditorGridAlignment()` call disconnects the first's observer and replaces it. This is actually **correct** (only one observer is needed process-wide), but the auto-cleanup logic (`if (formCount === 0) disconnect`) can fire prematurely if one editor closes while another is still open — the closing editor removes its `ha-form`, `formCount` may still be > 0 from the other, but if the timing is such that the mutation callback runs between close and the other's form being present, the observer disconnects and the still-open editor loses its CSS injection.

**Severity:** Low — requires two editors open simultaneously, which HA generally prevents (only one config dialog open at a time). Documenting for completeness.

**Recommended fix:** Guard the auto-cleanup with a reference count, or simply never auto-disconnect (the observer is cheap when idle; `document.body` mutations are infrequent in a config dialog context). The explicit `uninstallEditorGridAlignment()` is available if needed.

---

## ✅ Confirmed Correct (New Checks)

Patterns verified during this audit that are **not** problems:

- ✅ **`disconnectedCallback()` is comprehensive** — cancels tick interval, ACK timers, freeze timers, graphs-refetch debounce timer, and bumps all three fetch race tokens. This is exemplary cleanup.
- ✅ **All dialogs use `<ha-dialog>`** with `@closed` handlers and `open` prop — 8 dialogs verified (device-info, refill, log-drink, sleep-disruption, color-explainer, tools, override, tracking-override). Focus trapping + scroll lock handled by HA's MDC-based dialog.
- ✅ **`shouldUpdate` gating is correct** — internal `@state` whitelist + `_tick` (gated to daily/stats/drinks/inventory panes only) + `_relevantStateChanged` comparing state object references. No re-render on unrelated system-wide ticks.
- ✅ **Entity resolution + drinks cache** — both keyed on entity-registry reference; invalidated on device-id change. `_drinksCache` prevents the O(n) scan on every state change while inventory pane is active.
- ✅ **`callApi` used for all REST** — no raw `fetch`, no manual access-token extraction. Auth + errors handled by HA's connection layer.
- ✅ **History fetch optimization** — `&minimal_response&significant_changes_only=1` on both amount + effectiveness history calls.
- ✅ **Fetch race guards** — per-stream tokens (`_amountFetchToken`, `_doseFetchToken`, `_effectivenessFetchToken`, `_predictLowToken`) bumped on disconnect; results discarded if token mismatched after `await`.
- ✅ **`willUpdate()` used for auto-fallback** — reactive property mutations moved out of `render()` per Lit's contract.
- ✅ **Tick propagates to panels** — `.tick=${this._tick}` passed to daily/stats/drinks/inventory panels as a reactive prop.
- ✅ **`implements LovelaceCard, CardController`** — TypeScript enforces the Lovelace card contract.
- ✅ **`AxDoseLoggerHass extends HomeAssistant`** — official type reused; only `entities` + `devices` extension added.
- ✅ **Static imports of panel components** — no dynamic `import()`, correct for HACS single-file delivery.
- ✅ **`preview: true`** — card picker preview enabled.
- ✅ **`card-resize` event** instead of `ll-rebuild` — non-destructive height re-measure.

---

## Summary Table — Current Findings

| # | Severity | Area | One-line | Prior? |
|---|----------|------|----------|--------|
| N1 | 🔴 High | Leak/Correctness | `delayedAction()` creates new closure per render → listener churn + stale-timer double-fire | NEW |
| N2 | 🟠 Medium | HA Conventions | Global `ha-form` CSS injection pollutes other cards' editors | R1.5-M3 (unfixed) |
| N3 | 🟠 Medium | Lifecycle | Timer callbacks mutate `@state` without `_connected` guard (mitigated by disconnect cleanup) | NEW |
| N4 | 🟡 Low | Dead Code | 3 dead localize keys (`pane.caffeine`, `caffeine.placeholder`, `config.graph_options`) | R1.5-L2 (unfixed) |
| N5 | 🟡 Low | Code Quality | `_computeEntities` double-iterates `hass.entities` (cached, minimal impact) | R1.5-L7 (unfixed) |
| N6 | 🟡 Low | Concurrency | Module-scoped `_formStyleObserver` auto-cleanup can race with concurrent editors | NEW |

---

## Recommended Fix Order

1. **N1 — `delayedAction()` stable wrapper** — biggest impact (listener churn on every render + double-fire correctness bug on a medical logger). Should be fixed first.
2. **N2 — Scope `ha-form` CSS injection** — cross-card pollution; medium UX risk for other HACS cards.
3. **N4 — Remove dead localize keys** — trivial, do alongside N1/N2.
4. **N3 + N6 — Defense-in-depth guards** — optional hardening; current code is correct, these are belt-and-suspenders.
5. **N5 — Merge `_computeEntities` loops** — optional; cached so low impact.

---

## Mermaid — N1 `delayedAction` leak flow

```mermaid
flowchart TD
    A[Lit render] --> B[delayedAction called inline]
    B --> C[New closure created with timer=undefined]
    C --> D[Lit re-binds @click listener]
    D --> E[User clicks]
    E --> F[setTimeout 110ms armed in current closure]
    F --> G{Re-render within 110ms?}
    G -->|Yes — HA state update| H[New closure replaces old]
    H --> I[Old timer still in queue]
    I --> J[Old timer fires stale callback]
    G -->|No| K[Timer fires current callback]
    J --> L[Stale entity context action]
    E --> M{Second click before fire?}
    M -->|With re-render between| N[New closure, timer=undefined]
    N --> O[Second timer armed — no dedup]
    O --> P[Action fires twice]