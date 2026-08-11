# Ripple Timing + Action-Handler Migration Plan

**Date:** 2026-08-10
**Repository:** Frontend (`lovelace-pill-logger-card`)
**Goal:** Make the `<ha-ripple>` press feedback render fully (matching Mushroom card timing) by replacing raw `@click` / `@contextmenu` / `@dblclick` with HA's standard `actionHandler` directive, which introduces a natural pre-action delay (~200–250 ms tap/double-tap disambiguation window) that lets the ripple animation play before the controller fires the action and triggers a Lit re-render.

---

## Root Cause

### Problem 1 — "The ripple effect is too fast compared to Mushroom"

`<ha-ripple>` is the **same** web component Mushroom uses — HA registers it globally (`customElements.define("ha-ripple", …)`) and Mushroom simply injects `<ha-ripple></ha-ripple>` as a child of the interactive surface, exactly as we do. The CSS vars (`--ha-ripple-color`, `--ha-ripple-hover-opacity`, `--ha-ripple-pressed-opacity`) are identical. MdRipple's animation duration is fixed by the Material spec; Mushroom does **not** override it.

So the ripple is not "faster" — it is being **interrupted**.

### Problem 2 — "The effect is canceled out by the button presses being instant"

Our interactive elements use raw Lit `@click` bindings:

```ts
@click=${() => c.handleTakePill(e)}
@click=${(ev: MouseEvent) => c.handleSafeBoxAction(ev, 'tap', safeBoxActionConfig, displayEntity)}
@contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', …); } : null}
@dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', …) : null}
```

`@click` fires **synchronously on pointerup**. The controller immediately:
1. Calls `hass.callService` (fires a WebSocket message).
2. Sets `_dailyAckActive = true` (Lit `@state` mutation → re-render).
3. Sets `_dailyFrozenState` (another `@state` mutation → re-render).

Each `@state` mutation triggers a synchronous Lit update cycle. MdRipple drives its radiating-circle animation via `requestAnimationFrame` callbacks; when Lit re-renders the parent (or replaces the `<ha-ripple>` node via `keyed()` / conditional templates), the ripple's animation-frame chain is disrupted and the ripple **freezes mid-expansion or never visibly completes**. The user perceives this as "the ripple is too fast / gets canceled."

### How Mushroom avoids this

Mushroom's `template-card.ts` uses HA's `actionHandler` **directive** instead of raw `@click`:

```ts
<div
  class="background"
  @action=${this._handleAction}
  .actionHandler=${actionHandler({
    disabled: !this._hasCardAction,
    hasHold: hasAction(this._config!.hold_action),
    hasDoubleClick: hasAction(this._config!.double_tap_action),
  })}
>
  <ha-ripple .disabled=${!this._hasCardAction}></ha-ripple>
</div>
```

The `actionHandler` directive (from `custom-card-helpers`, re-exported from HA's `common.dom.action_handler`) attaches `pointerdown`/`pointerup`/`click` listeners that:

1. Start the ripple on `pointerdown` (MdRipple handles this natively).
2. On `pointerup`, start a **disambiguation timer** — if `hasDoubleClick` is true, it waits ~250 ms to see if a second click arrives before dispatching the `ActionHandlerEvent` with `detail.action = 'tap'`; if `hasDoubleClick` is false, it dispatches on `pointerup` but still after a microtask (the event is `fireEvent(node, 'action', { action })`, which is async-batched).
3. The `@action` handler then calls `handleAction(this, this.hass!, this._config!, ev.detail.action!)`.

The critical effect: there is a **small gap between pointerup and the action firing**. During this gap, the ripple's `requestAnimationFrame` chain runs uninterrupted (no Lit re-render has happened yet), so the ripple visibly expands and fades. By the time the action fires and Lit re-renders, the ripple is already past its peak.

This is the "short delay after the button is pressed to allow the animation to render" the user observed in Mushroom.

---

## Solution: Migrate to the `actionHandler` Directive

Replace every raw `@click` / `@contextmenu` / `@dblclick` triple on interactive elements with the `actionHandler` directive + a single `@action` handler that routes `tap` / `hold` / `double_tap` to the existing controller methods.

### Import

Add to each panel + the card container:

```ts
import { actionHandler, type ActionHandlerEvent } from 'custom-card-helpers';
```

`custom-card-helpers` re-exports both `actionHandler` (the directive function) and the `ActionHandlerEvent` type from HA's frontend — the same symbols Mushroom imports from `../../ha`.

### Element-level change pattern

**Before (current):**
```ts
<div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
     role="button" tabindex=${safeBoxClickable ? '0' : nothing}
     aria-label=${…}
     @click=${safeBoxClickable ? (ev: MouseEvent) => c.handleSafeBoxAction(ev, 'tap', …) : null}
     @keydown=${safeBoxClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', …)) : null}
     @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', …); } : null}
     @dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', …) : null}>
  ${safeBoxClickable ? html`<ha-ripple></ha-ripple>` : nothing}
  …
</div>
```

**After:**
```ts
<div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
     role="button" tabindex=${safeBoxClickable ? '0' : nothing}
     aria-label=${…}
     @action=${safeBoxClickable
       ? (ev: ActionHandlerEvent) => c.handleSafeBoxAction(ev, ev.detail.action!, safeBoxActionConfig, displayEntity)
       : null}
     @keydown=${safeBoxClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', …)) : null}
     .actionHandler=${safeBoxClickable
       ? actionHandler({
           hasHold: hasHold,
           hasDoubleClick: hasDblClick,
         })
       : undefined}>
  ${safeBoxClickable ? html`<ha-ripple></ha-ripple>` : nothing}
  …
</div>
```

Key points:
- `.actionHandler` is a **property binding** (dot prefix), not an attribute — it receives the directive function result.
- `@action` replaces `@click` + `@contextmenu` + `@dblclick`. The `ActionHandlerEvent.detail.action` is `'tap'`, `'hold'`, or `'double_tap'`.
- `@keydown` stays for keyboard accessibility (`onKeyActivate` calls the same controller method with `'tap'`).
- The `<ha-ripple>` injection and CSS vars are **unchanged** — the ripple already works; we're just stopping the re-render from interrupting it.

### Controller signature

`handleSafeBoxAction` and siblings already accept an `(ev: Event | null, action: string, config, entity)` signature. The only change is that `ev` will be an `ActionHandlerEvent` (which extends `Event`) instead of a `MouseEvent` — but we already pass it through to `handleAction(this, this.hass, config, action)` which only reads `action`, so no logic change is needed. We will widen the type annotation from `MouseEvent` to `Event | ActionHandlerEvent` for correctness.

### ACK buttons (Take Pill / Log Drink)

These currently have a bare `@click=${() => c.handleTakePill(e)}`. They have no hold/double-tap, but they still benefit from the actionHandler delay — in fact they benefit **most**, because the ACK flash + `Nx` counter + service call is what disrupts the ripple most aggressively.

**After:**
```ts
<button class=${this._takeButtonClasses()} …
  @action=${() => c.handleTakePill(e)}
  .actionHandler=${actionHandler({ hasHold: false, hasDoubleClick: false })}>
  <div class="glow-track"></div>
  <ha-ripple></ha-ripple>
  …
</button>
```

The `actionHandler` with no hold/double-tap still introduces a one-frame microtask delay before `@action` fires (it dispatches via `fireEvent` which is queued), giving the ripple one animation frame to start. This is the exact Mushroom behavior on a tap-only card.

---

## Scope — Elements to Migrate

Per the existing ripple migration scope (all qualifying clickable elements get `<ha-ripple>`; nav tabs and Graphs toggles stay out):

| File | Element | Current handlers | actionHandler options |
|------|---------|------------------|----------------------|
| [`daily-panel.ts`](src/components/daily-panel.ts) | `.med-name` (device-info dialog) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`daily-panel.ts`](src/components/daily-panel.ts) | `.take-pill-btn` (Take Pill ACK) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`daily-panel.ts`](src/components/daily-panel.ts) | Safe-to-Take `.stat-pill` | `@click` + `@contextmenu` + `@dblclick` | `{ hasHold, hasDoubleClick }` dynamic |
| [`daily-panel.ts`](src/components/daily-panel.ts) | Pills-Left `.stat-pill` | `@click` + `@contextmenu` + `@dblclick` | `{ hasHold, hasDoubleClick }` dynamic |
| [`daily-panel.ts`](src/components/daily-panel.ts) | `.chip` (custom chips) | `@click` + `@contextmenu` + `@dblclick` | `{ hasHold, hasDoubleClick }` dynamic |
| [`drinks-panel.ts`](src/components/drinks-panel.ts) | `.drinks-title` (device-info) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`drinks-panel.ts`](src/components/drinks-panel.ts) | `.log-drink-btn` (Log Drink ACK) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`drinks-panel.ts`](src/components/drinks-panel.ts) | In-Body `.stat-pill` | `@click` + `@contextmenu` + `@dblclick` | dynamic |
| [`drinks-panel.ts`](src/components/drinks-panel.ts) | Disruption `.stat-pill` | `@click` + `@contextmenu` + `@dblclick` | dynamic |
| [`drinks-panel.ts`](src/components/drinks-panel.ts) | `.chip` (drink chips) | `@click` + `@contextmenu` + `@dblclick` | dynamic |
| [`inventory-panel.ts`](src/components/inventory-panel.ts) | Refill `.stat-pill` | `@click` + `@keydown` | `{ hasHold: false, hasDoubleClick: false }` |
| [`inventory-panel.ts`](src/components/inventory-panel.ts) | `.avg-cell` (device-info) | `@click` + `@keydown` | `{ hasHold: false, hasDoubleClick: false }` |
| [`stats-panel.ts`](src/components/stats-panel.ts) | `.stat-cell` (more-info) | `@click` + `@keydown` | `{ hasHold: false, hasDoubleClick: false }` |
| [`tools-panel.ts`](src/components/tools-panel.ts) | 7× `.tool-btn` (maintenance) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | 6× `.dialog-btn` (dialog actions) | `@click` | `{ hasHold: false, hasDoubleClick: false }` |
| [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Drink-picker rows in Log Drink dialog | `@click` + `?disabled` | `{ hasHold: false, hasDoubleClick: false }` + `disabled` |

### Elements NOT migrated (unchanged)
- Nav-bar pane tabs (`_handlePaneChange`) — intentionally no ripple, raw `@click` stays.
- Graphs panel timeframe chips, carousel nav, effectiveness tabs, tracker chips — no ripple, raw `@click` stays.

---

## Controller signature changes

### `types.ts` — `CardController` interface

The box-action methods currently type the event as `MouseEvent | null`:
```ts
handleSafeBoxAction(ev: MouseEvent | null, action: string, …): void;
```

Widen to `Event | ActionHandlerEvent | null` (since `ActionHandlerEvent` extends `Event`, `Event | null` suffices, but `ActionHandlerEvent` is clearer for documentation):
```ts
handleSafeBoxAction(ev: ActionHandlerEvent | Event | null, action: string, …): void;
```

Same for `handlePillsLeftBoxAction`, `handleInBodyBoxAction`, `handleDisruptionBoxAction`, `handleChipAction`, `handleDrinkChipAction`.

`handleTakePill(entities)` and `handleUndoDose(entities)` take no event arg — unchanged.

### `ax-dose-logger-card.ts` — controller methods

`_handleSafeBoxAction`, `_handlePillsLeftBoxAction`, `_handleInBodyBoxAction`, `_handleDisruptionBoxAction`, `_handleChipAction`, `_handleDrinkChipAction` — these already pass `ev` through to `handleAction(this, this.hass, config, action)` and only read `action`. **No logic change**, only the type annotation widening.

---

## CSS — No change

The `:host` ripple vars (`--ha-ripple-color`, `--ha-ripple-hover-opacity: 0.04`, `--ha-ripple-pressed-opacity: 0.12`), the `position: relative` + `overflow: hidden` geometry, the z-index layering, and the stripped `:active` scale transforms all stay. The migration is purely a JS-event-binding change.

---

## Verification

1. `yarn run build` — must compile clean (exit 0, no TS errors). The `actionHandler` and `ActionHandlerEvent` imports from `custom-card-helpers` are typed; verify they resolve.
2. Grep the dist for `actionHandler` occurrences (should be ~15, one per migrated element) and confirm `@contextmenu` / raw `@dblclick` triples are gone from interactive elements (nav tabs / graphs keep their `@click`).
3. Manual trace:
   - Press Take Pill → ripple radiates fully (~300 ms) → then ACK flash + `Nx` appears → no truncation.
   - Press Safe-to-Take with a custom `hold_action` → press-and-hold fires `hold` (no raw `contextmenu` needed).
   - Press a chip with `double_tap_action` → double-click fires `double_tap` (no raw `@dblclick` needed).
   - Press a disabled Log Drink dialog row → no `@action`, no ripple.

---

## Memory-bank update (after verification)

- **README.md** — no change (the ripple paragraph already exists; the timing fix is an internal event-binding refactor, not a user-facing behavior change beyond "the ripple now renders fully").
- **memory-bank/activeContext.md** — replace Current Status with "Ripple Timing — actionHandler Migration (2026-08-10)": replaced raw `@click`/`@contextmenu`/`@dblclick` on all interactive elements with the `actionHandler` directive + `@action` handler (Mushroom parity), fixing the ripple being interrupted by synchronous Lit re-renders.
- **memory-bank/progress.md** — append a new feature section with the checklist.
- **memory-bank/projectstructure.md** — no file added/removed/renamed; no change.