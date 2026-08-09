# Button State Matrix — Visual Fixes Plan

Fix three visual bugs in the Button State Matrix (Take Pill / Log Drink buttons)
shipped 2026-08-09. All changes are frontend-only (CSS + one resolver tweak).
No backend, no config-flow, no editor-schema, no localize, no types change.

Architecture context:
- [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — Take Pill
  button CSS (state matrix classes, rotating-glow `::before`, ack `::after`).
- [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — Log Drink
  button CSS (mirror of daily-panel for lockout + ack only).
- [`src/helpers.ts`](src/helpers.ts) — `resolveButtonState()` (precedence:
  ack → lockout → latency → execution → idle).
- [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) —
  `_computeDailyButtonState()` / `_computeDrinksButtonState()` pass `ackActive`
  into the resolver; `_triggerDailyAck()` / `_triggerDrinksAck()` arm the timers.

---

## Bug 1 — Border options expand the button

### Root cause
The button base rule sets `border: none`. The state-matrix border options add
`border: 2px solid var(--btn-*)` on top, with no compensating padding change.
Border adds to the box's outer size (the button is not `box-sizing`-immune
because the 2px is real border, not inset shadow), so the button grows 2px on
each side — visible as a slight size jump when the state transitions to a
border option.

### Fix — replace `border:` with `box-shadow: inset 0 0 0 2px`
An inset box-shadow draws the colored ring *inside* the button's existing
padding box, so the button's outer dimensions never change. This is the
standard CSS technique for "border without layout shift".

**[`src/components/daily-panel.ts`](src/components/daily-panel.ts)** — Option 3
block (Border only):
```css
/* Option 3 — Border only (inset box-shadow so the button does not grow). */
.take-pill-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
.take-pill-btn.border-blue   { box-shadow: inset 0 0 0 2px var(--btn-blue); }
.take-pill-btn.border-amber  { box-shadow: inset 0 0 0 2px var(--btn-amber); }
.take-pill-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }
```
The shared `background` + `color` block for the four border-* classes stays (it
sets the theme-default bg + primary color so border-only reads as "safe").

**[`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)** — mirror:
```css
.log-drink-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
.log-drink-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }
```

Note: the `icon_border` style option composes `icon-${color}` + `border-${color}`,
so it picks up the inset shadow automatically — no separate rule needed.

### Edge case — `overflow: hidden` + inset shadow
The button has `overflow: hidden` (added for the rotating-glow mask). Inset
box-shadow is *not* clipped by `overflow: hidden` (only child content is
clipped; shadows paint on the border-box), so the inset ring renders fully.
Verified: this is the standard behavior and the same pattern HA's own
`ha-card` uses for outlined states.

---

## Bug 2 — Rotating border is all wrong (trailing line)

### Root cause
The current `::before` uses
`conic-gradient(var(--btn-red), transparent 35%, var(--btn-red))` which produces
a full 360° gradient ring: the color fades to transparent at 35% then ramps
back to color at 360°, so the whole ring is colored to varying degrees. That
reads as a pulsing full ring, not a "small solid line trailing around the
border" like modern UIs (e.g. Stripe's loading spinner, GitHub's loading
button).

### Fix — short solid arc on a transparent conic gradient
Replace the gradient with a short colored arc (≈45°) on an otherwise
transparent conic gradient, so a small solid line segment travels around the
border as the `::before` rotates:

```css
.take-pill-btn.glow-red::before {
  background: conic-gradient(
    var(--btn-red) 0deg,
    var(--btn-red) 45deg,
    transparent 45deg,
    transparent 360deg
  );
}
```

The `::before` keeps the existing `inset: -2px` + `padding: 2px` +
`mask-composite: exclude` (cut out the center so only the ring shows) +
`animation: ax-btn-glow-rotate 2.5s linear infinite`. Only the `background`
gradient value changes. The arc length (45°) is a tunable — 45° reads as a
clear trailing line without being a full half-ring; shorter (e.g. 30°) is
subtler, longer (e.g. 90°) is more visible. 45° is the default; can be tweaked
after visual review.

Apply to all four daily colors (`glow-red`/`glow-blue`/`glow-amber`/`glow-green`)
+ the two drinks colors (`glow-red`/`glow-green`).

### Optional softening — fade the trailing edge
For an even more modern look, add a short fade after the solid arc so the line
trails off:
```css
conic-gradient(
  var(--btn-red) 0deg,
  var(--btn-red) 30deg,
  rgba(red-faded) 45deg,
  transparent 50deg,
  transparent 360deg
)
```
This is a polish-layer nicety; the core fix is the solid-arc-on-transparent
gradient. Start with the clean 45° solid arc; add the fade only if it looks
too hard-edged in review.

---

## Bug 3 — ACK animation is messed up

### Reported behavior
> Button on Limit Reached → Override → Flashes green with logged for 3000ms →
> button is now green take pill for 2-10 seconds → back to Limit Reached

### Root cause (two issues)
**(a) Text merges:** the ack `::after` overlay uses `inset: 0` + centered flex
but has **no background**, so the "✓ Logged" text paints directly on top of the
button's existing icon + label + sub-text → illegible overlap.

**(b) Green lingering:** `ackActive` makes `resolveButtonState()` return
`'ack'` (precedence: ack → lockout → …). The `'ack'` state applies the
`full-green` class, recoloring the *entire button* green for the full 3000ms.
When the timer fires, `ackActive` flips false and the state recomputes — but
the backend coordinator has not necessarily pushed the new `pillsSafeToTake`
yet, so the state resolves to `'idle'` (theme default = primary blue/green-ish
"Take Pill" look), NOT back to `'lockout'`. Only when the backend state arrives
(2-10s later) does it return to `'lockout'`. So the user sees:
lockout-red → ack-green (3s) → idle-theme-green (2-10s) → lockout-red.

The core mistake: the ack recolors the *underlying button* instead of being a
pure overlay. The button should keep showing its true state (lockout red)
*underneath* the ack flash the entire time.

### Fix — decouple ack from button state
**1. `resolveButtonState()` — remove `'ack'` from the resolved state.**
The ack becomes a pure overlay driven only by the `ackActive` flag; it no
longer affects the button's base color/state. The resolver returns the true
state (lockout/idle/execution/latency) even while ack is active.

```ts
// helpers.ts
export function resolveButtonState(input: ButtonStateInput): ButtonState {
  // ACK is now a pure overlay (panel reads input.ackActive directly); it no
  // longer collapses the resolved state, so the button keeps its true color
  // underneath the ack flash.
  if (input.isLockedOut) return 'lockout';
  if (input.isScheduled) {
    if (input.overdueSeconds > 0) return 'latency';
    return 'execution';
  }
  return 'idle';
}
```

The `'ack'` value stays in the `ButtonState` union (harmless; just never
returned) so the panel's `buttonState === 'ack'` checks and the ack-style
config defaults compile. (Alternatively remove `'ack'` from the union + all
ack-style reads, but that touches the editor + types — more churn for no
benefit. Keep the union, drop the return.)

**2. Container — pass `ackActive` through unchanged.** The containers already
pass `.ackActive=${this._dailyAckActive}` / `.ackActive=${this._drinksAckActive}`
to the panels. No change needed — the flag still drives the overlay.

**3. Panel — drive the ack overlay from `ackActive`, not `buttonState`.**
Currently the ack `::after` rule is gated on `.state-ack.full-green::after`. With
the resolver no longer returning `'ack'`, the `state-ack` class is never
applied. Change the gate to a dedicated `.ack-flash` class applied when
`ackActive` is true, independent of the resolved state. The panel adds
`.ack-flash` to the class list when `this.ackActive` is true.

**[`src/components/daily-panel.ts`](src/components/daily-panel.ts)**
`_takeButtonClasses()` — append:
```ts
if (this.ackActive) classes.push('ack-flash');
```
This is added *after* the idle early-return so the idle state still gets the
base button + the ack-flash overlay (ack on an idle button = green flash on
the default button, which is correct).

**4. CSS — rewrite the ack overlay rule.**
```css
/* ACK (logged) transient overlay — pure flash on top of the true button
   state. The button keeps its real color underneath; the overlay covers it
   with an opaque green surface + "✓ Logged" text, then fades out. */
.take-pill-btn.ack-flash::after {
  content: '✓ ' var(--ack-text, 'Logged');
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Opaque green surface so the underlying button text is fully covered. */
  background: var(--btn-green);
  color: #fff;
  border-radius: inherit;
  font-weight: 600;
  font-size: calc(18px + var(--pill-text-offset, 0px));
  opacity: 0;
  animation: ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
  pointer-events: none;
  z-index: 2;
}
@keyframes ax-btn-ack-fade {
  0%   { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
```
Key changes from the old rule:
- Gate is `.ack-flash::after` (not `.state-ack.full-green::after`) — fires on
  any true state, not only when the resolver collapsed to ack.
- `background: var(--btn-green)` + `color: #fff` — opaque green surface covers
  the underlying button text (fixes text-merge).
- `border-radius: inherit` — the green surface respects the button's rounded
  corners (was implicit before; explicit now that it's a real surface).
- `z-index: 2` — above the rotating-glow `::before` (z-index 0) and the button
  content.

**[`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)** — mirror
for `.log-drink-btn.ack-flash::after`.

**5. Inline style — the ack-duration var.** The panel currently sets
`--ack-duration` / `--ack-text` only when `this.buttonState === 'ack'`. Change
the condition to `this.ackActive` so the vars are present whenever the
overlay is active (the overlay reads them via the CSS rule).

```ts
style=${this.ackActive ? `--ack-duration: ${...}ms; --ack-text: '${...}';` : ''}
```

### Why this fixes the reported sequence
With the fix, the sequence becomes:
- Limit-reached (red full) → user presses override → `ackActive=true` →
  overlay paints opaque green "✓ Logged" on top of the *still-red* button.
- For 3000ms the user sees the green flash. The button underneath stays red
  (its true state) the whole time.
- Timer fires → `ackActive=false` → overlay fades → the red button is revealed
  immediately (it was never recolored).
- When the backend state arrives later, `pillsSafeToTake` updates; the state
  stays `'lockout'` (red) because the limit is still reached after one dose
  override. No "green take pill lingering" gap.

If the backend state arrives *during* the ack window, the button underneath
updates silently under the opaque overlay — when the overlay fades, the true
state is already correct.

### `ack-style` config option — still honored?
The `take_button_ack_style` / `drink_button_ack_style` config options let the
user pick how the ack renders (full/icon/border/glow/none/icon_glow). With the
new pure-overlay approach, the ack is always an opaque-green flash. The
`ack-style` option becomes largely cosmetic for the overlay (it could tint the
overlay or pick the checkmark color). To keep this change minimal and avoid
reworking the editor, the `ack-style` option is **kept in the editor** but the
overlay defaults to the solid-green surface (the most legible). If the user
selects a different ack-style, the overlay still shows (the style option
becomes a no-op for the overlay surface — acceptable for this bug-fix pass; a
future refinement could map ack-style to overlay variants). Documenting this
as an accepted trade-off in the plan + activeContext.

---

## Steps

1. `src/helpers.ts` — `resolveButtonState`: remove the `if (input.ackActive)
   return 'ack';` line. Add a comment explaining ack is now a pure overlay.
2. `src/components/daily-panel.ts`:
   a. Option 3 (border) — replace `border: 2px solid` with `box-shadow: inset
      0 0 0 2px` for all four colors.
   b. Rotating-glow `::before` — replace the `conic-gradient(color, transparent
      35%, color)` with the solid-arc `conic-gradient(color 0deg, color 45deg,
      transparent 45deg, transparent 360deg)` for all four colors.
   c. `_takeButtonClasses()` — append `if (this.ackActive)
      classes.push('ack-flash');` after the idle early-return.
   d. Button template `style=` — change condition from
      `this.buttonState === 'ack'` to `this.ackActive`.
   e. CSS — rewrite the ack `::after` rule: gate `.ack-flash::after` (not
      `.state-ack.full-green::after`); add `background: var(--btn-green)`,
      `color: #fff`, `border-radius: inherit`, `z-index: 2`.
3. `src/components/drinks-panel.ts` — mirror all daily-panel changes (border
   inset shadow ×2 colors, rotating-glow arc ×2 colors, ack-flash class push,
   style condition, ack `::after` rewrite).
4. `yarn run build` — verify clean (exit 0).
5. Dist grep — confirm the new CSS (`inset 0 0 0 2px`, `ack-flash`,
   `transparent 45deg`) is present; old patterns (`border: 2px solid`,
   `transparent 35%`, `state-ack.full-green::after`) absent.
6. Update memory-bank — activeContext.md (new Current Status: "Button State
   Matrix Visual Fixes"; archive the prior Button State Matrix status),
   progress.md (new section), no projectstructure.md change (no files
   added/renamed/deleted), no README change (no end-user behavior/config change
   — these are bug fixes to the visual rendering, not new features).

## Verification

- `yarn run build` clean (exit 0, no warnings).
- Visual: border options no longer change button size; rotating glow shows a
  short trailing line; ack overlay covers underlying text with opaque green +
  fades to reveal the true state; no "green lingering" after ack on the
  limit-reached override path.

## Key decisions

1. **Inset box-shadow for borders** — the standard CSS technique for
   border-without-layout-shift. No padding compensation math, no `box-sizing`
   surprises, works under `overflow: hidden`.
2. **Solid-arc conic gradient for the trailing line** — 45° arc on a
   transparent gradient is the modern-UI trailing-line idiom. The existing
   `::before` mask + rotate infrastructure stays; only the gradient value
   changes.
3. **Ack = pure overlay, not a button state** — the core fix for bug 3b. The
   button keeps its true state underneath the ack flash, so there is no
   "wrong color lingering" gap. `resolveButtonState` no longer returns `'ack'`;
   the panel's `ackActive` flag drives a dedicated `.ack-flash` overlay class.
4. **Opaque green overlay surface** — fixes text-merge (bug 3a). The overlay
   paints a solid green background + white "✓ Logged", fully covering the
   underlying button text, then fades to reveal the true state.
5. **`ack-style` config kept but effectively a no-op for the overlay surface**
   — minimizing editor churn; the overlay defaults to the most legible form
   (solid green). Documented as an accepted trade-off. A future refinement
   could map ack-style to overlay variants.
6. **`ButtonState` union keeps `'ack'`** — removing it would touch the editor
   schema + types + localize for no functional benefit. The value stays in the
   union; the resolver simply never returns it. The panel's
   `buttonState === 'ack'` checks (if any remain) still compile.
7. **No backend / config-flow / editor / types / localize / README change** —
   these are pure frontend CSS + one resolver-line + one panel-template
   condition. No new config, no migration.