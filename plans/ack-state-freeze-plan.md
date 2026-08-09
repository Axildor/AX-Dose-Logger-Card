# Plan — Freeze Button State During ACK Intro (Hide Post-Press Color Flash)

## Problem

When the user presses **Take Pill** (or **Log Drink**) and the press triggers a
state change on the underlying button (most visibly: `default → lockout` red
when the dose hits the daily limit), the button's *real* state transitions
**immediately** while the green ACK (Logged Dose Indicator) overlay is still in
its 240ms intro fade-in (`opacity 0 → 1`). During that 240ms the overlay is
semi-transparent, so the new red state flashes through for ~240ms before the
overlay reaches full opacity and hides it.

Sequence today:
1. Press → [`_handleTakePill`](src/ax-dose-logger-card.ts:638) fires
   `button.press` + [`_triggerDailyAck`](src/ax-dose-logger-card.ts:830) sets
   `_dailyAckActive = true`.
2. ACK overlay starts [`ax-btn-ack-intro 240ms`](src/components/daily-panel.ts:622)
   (opacity `0 → 1`).
3. HA pushes new `pillsSafeToTake = 0` → [`_computeDailyButtonState`](src/ax-dose-logger-card.ts:884)
   reads the **live** sensor and returns `'lockout'` → button snaps to red
   **immediately**, visible through the still-fading-in overlay.
4. After 240ms the overlay is opaque → red is hidden — but the flash already
   happened.

User-requested fix: delay the underlying state transition by 240ms so it
commits only once the overlay is fully opaque.

## Design Decision — JS-side state freeze (not CSS-side overlay opacity)

**Chosen: freeze the resolved `buttonState` in the container for the 240ms intro
window while ACK is active.** The panel keeps receiving the *pre-press* state
during the intro; after 240ms the freeze releases and the resolver reads live
state, so the real transition (e.g. `idle → lockout`) happens behind the now
opaque overlay.

Rejected alternatives:
- **Make the ACK overlay opaque instantly / drop the 240ms intro** — discards
  the press-feel refinement the user explicitly approved in the prior task
  (Issue 3: fixed 240ms intro so the overlay reads like a button press). The
  user wants to *keep* the 240ms intro, just hide the color change behind it.
- **CSS-only: delay the button's color transition by 240ms via `transition-delay`**
  — the button color is driven by class swaps (`full-red`, `icon-red`, etc.),
  not a single animatable property, and the style options (`border`, `glow`,
  `icon`) don't all map to a `transition`-able change. A CSS delay would also
  fire on *every* state change (e.g. a genuine lockout appearing from a backend
  refresh with no press), which is wrong — the freeze must be scoped to the ACK
  window only.
- **Freeze in the panel** — the panel is presentational and stateless; the
  container owns the ACK flag and the state resolver. Keeping the freeze in the
  container preserves the panel/container boundary and lets the panel stay a
  pure function of its props.

The 240ms freeze is **fixed** (not proportional to `ack_duration_ms`) — it
mirrors the fixed 240ms intro animation exactly, so the release always coincides
with the overlay reaching opacity 1.

## Implementation

### 1. Shared intro-duration constant — [`src/helpers.ts`](src/helpers.ts)

Add a named constant so the JS freeze and the CSS intro stay in sync from one
source of truth:

```ts
/** Fixed duration (ms) of the ACK overlay's press-in intro animation
 *  (ax-btn-ack-intro / ax-drink-btn-ack-intro). The container freezes the
 *  resolved button state for this long after an ACK trigger so the underlying
 *  state transition (e.g. idle → lockout) is hidden behind the overlay by the
 *  time it commits. Mirrors the CSS keyframe duration exactly — update both
 *  together. */
export const ACK_INTRO_MS = 240;
```

Re-export it from [`src/types.ts`](src/types.ts) if the container imports from
there (it imports `ButtonState` from helpers via types — verify import path; the
container currently imports `ButtonState` from `./helpers.js` indirectly through
`types.js` re-exports — check and import `ACK_INTRO_MS` directly from
`./helpers.js`).

### 2. Frozen-state holders + release timers — [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)

Add new private state next to the existing ACK flags/timers (~line 93-96):

```ts
// Frozen button state held for the ACK intro window so the underlying state
// transition (e.g. idle → lockout) is hidden behind the opaque overlay by the
// time it commits. Set when _triggerDailyAck/_triggerDrinksAck fires; cleared
// by a 240ms timer (ACK_INTRO_MS) that then requests a re-render so the
// resolver reads live state again.
@state() private _dailyFrozenState: ButtonState | null = null;
@state() private _drinksFrozenState: ButtonState | null = null;
private _dailyFreezeTimer?: number;
private _drinksFreezeTimer?: number;
```

### 3. Arm the freeze in the ACK triggers — [`_triggerDailyAck`](src/ax-dose-logger-card.ts:830) & [`_triggerDrinksAck`](src/ax-dose-logger-card.ts:844)

At the top of each trigger, **capture the current resolved state as the frozen
value** before setting the ACK flag, then arm a 240ms release timer:

```ts
private _triggerDailyAck(): void {
  const duration = this.config?.take_button_ack_duration_ms ?? 3000;
  // Freeze the button state for the ACK intro window so the post-press state
  // transition (e.g. idle → lockout) is hidden behind the overlay once it's
  // opaque. Capture the PRE-press state from the live entities first.
  const entities = this._resolveEntities();
  this._dailyFrozenState = this._computeDailyButtonState(entities);
  if (this._dailyFreezeTimer !== undefined) {
    window.clearTimeout(this._dailyFreezeTimer);
  }
  this._dailyFreezeTimer = window.setTimeout(() => {
    this._dailyFrozenState = null;
    this._dailyFreezeTimer = undefined;
    this.requestUpdate();
  }, ACK_INTRO_MS);

  this._dailyAckActive = true;
  // ... existing ack-duration timer unchanged ...
}
```

Mirror identically in `_triggerDrinksAck` using `_drinksFrozenState`,
`_drinksFreezeTimer`, and `_computeDrinksButtonState`.

**Why capture from `_resolveEntities()` here:** the trigger fires synchronously
right after `button.press`, before HA has pushed the new state, so the resolved
state is still the pre-press state (e.g. `idle` / `execution`). This is exactly
the value we want to hold through the intro.

### 4. Consume the freeze in the resolvers — [`_computeDailyButtonState`](src/ax-dose-logger-card.ts:884) & [`_computeDrinksButtonState`](src/ax-dose-logger-card.ts:921)

At the top of each resolver, short-circuit while a frozen state is held:

```ts
private _computeDailyButtonState(entities: ResolvedEntities): ButtonState {
  // While the ACK intro freeze is active, return the captured pre-press state
  // so the underlying color doesn't transition until the overlay is opaque.
  if (this._dailyFrozenState !== null) {
    return this._dailyFrozenState;
  }
  // ... existing live-state resolution unchanged ...
}
```

Mirror in `_computeDrinksButtonState` with `_drinksFrozenState`.

### 5. Cleanup — [`disconnectedCallback`](src/ax-dose-logger-card.ts:2262)

Clear the freeze timers alongside the existing ACK-timer cleanup (the existing
callback doesn't currently clear `_dailyAckTimer`/`_drinksAckTimer` either —
note this as a pre-existing gap; add cleanup for all four timers as a small
defensive improvement, or scope strictly to the new freeze timers to avoid
touching unrelated behavior). **Decision: add cleanup for the two NEW freeze
timers only**, to keep the change scoped; file a separate note about the
pre-existing ACK-timer leak.

```ts
if (this._dailyFreezeTimer !== undefined) {
  window.clearTimeout(this._dailyFreezeTimer);
  this._dailyFreezeTimer = undefined;
}
if (this._drinksFreezeTimer !== undefined) {
  window.clearTimeout(this._drinksFreezeTimer);
  this._drinksFreezeTimer = undefined;
}
```

### 6. No CSS / panel / config / editor / localize / types changes

The freeze is pure JS in the container. The panels, keyframes, config schema,
editor, and localize strings are untouched. No new config field — the 240ms is
fixed to match the CSS intro (single source of truth via `ACK_INTRO_MS`).

## Scope Notes & Edge Cases

- **Override-confirm path:** the limit-reached override dialog's Confirm button
  ([line 1414](src/ax-dose-logger-card.ts:1414)) also calls `_triggerDailyAck`.
  By the time the user confirms, `pillsSafeToTake` may *already* be 0 (the
  dialog was shown because it was 0). The freeze captures the current resolved
  state — which on the override path is already `'lockout'`. Freezing
  `'lockout'` for 240ms while the overlay fades in is harmless (the button was
  already red, stays red, then the overlay covers it). No special-casing needed.
- **Rapid double-press / re-trigger:** the existing pattern (clear any in-flight
  timer before arming a new one) is mirrored for the freeze timer, so a
  re-trigger within 240ms cleanly resets the freeze window.
- **State changes unrelated to the press during the 240ms window** (e.g. a
  backend refresh flips lockout on for an unrelated reason): these are delayed
  by at most 240ms — acceptable and imperceptible, and consistent with the
  user's intent (hide transitions behind the overlay).
- **`shouldPoll` / HA best practices:** no polling or blocking calls introduced;
  the freeze is a pure synchronous state hold + a `setTimeout` (non-blocking),
  mirroring the existing ACK timer pattern. Compliant with HA custom-card
  best practices.

## Verification

1. `yarn run build` (clean, exit 0).
2. Dist grep: confirm `ACK_INTRO_MS` / frozen-state symbols present; no
   accidental removal of existing ack keyframes.
3. Manual (user): press Take Pill at the daily-limit boundary and confirm the
   red flash no longer shows during the 240ms intro; the overlay reaches opacity
   1 and only then does the button commit to red (revealed as the overlay fades
   out). Repeat for Log Drink at the drink daily-limit boundary.

## Files Modified

- [`src/helpers.ts`](src/helpers.ts) — add `ACK_INTRO_MS` constant + doc-comment.
- [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — frozen-state
  holders + timers, arm freeze in `_triggerDailyAck`/`_triggerDrinksAck`,
  consume freeze in `_computeDailyButtonState`/`_computeDrinksButtonState`,
  cleanup freeze timers in `disconnectedCallback`.
- [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt.
- [`README.md`](README.md) — update the Button State Matrix / Logged Dose
  Indicator paragraph to note the 240ms state freeze hides the post-press color
  transition behind the overlay.
- [`memory-bank/activeContext.md`](memory-bank/activeContext.md),
  [`memory-bank/progress.md`](memory-bank/progress.md) — update per workflow.

No panel CSS, config, editor, localize, or types changes. No backend changes.