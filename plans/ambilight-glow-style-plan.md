# Plan — Ambilight Glow Style (GPU-Composited Backdrop + Breathing)

**Date:** 2026-08-11 (v2 — box-shadow rejected for CPU-repaint cost on tablet SOCs; v2.1 — `will-change` sandboxed to active glow selector for VRAM optimization)
**Scope:** Frontend only (`/workspaces/lovelace-pill-logger-card/`)
**Status:** Approved (v2.1) — pending implementation

---

## 1. Problem Statement

The button State Matrix currently offers 4 visual style options per state
(`full` / `border` / `none` / `ring`). The `ring` option is a rotating
conic-gradient perimeter sweep — a "neon border" look.

The user wants a **new, distinct glow** that behaves like an **ambilight TV
against a white wall**:

| Requirement | Meaning |
|-------------|---------|
| Not a neon border | NOT the rotating `ring` sweep |
| Light *behind* the button | A colored halo radiates outward from behind the button |
| Vibrant at the edge, quickly diffusing | Sharpest at the border, fading outward (soft blur falloff) |
| Slow breathing effect | Intensity pulses slowly in/out, not static |
| GPU-friendly | Must NOT animate `box-shadow` (CPU repaint). Use `opacity`/`transform` only, GPU-composited |
| VRAM-safe | `will-change` must NOT pin a GPU layer on inactive (non-glow) states |

### Why v1 (box-shadow) was rejected
Animating `box-shadow` triggers continuous CPU repaints. On tablet SOCs, when
multiple pill buttons breathe simultaneously, this lags the UI. The revised
architecture uses a **dedicated backdrop DOM node** with a **static**
`filter: blur()` and animates only **`opacity`** (GPU-composited, no repaint).

### Why v2.1 sandboxes `will-change`
Applying `will-change: opacity` to the always-present base `.glow-backdrop`
class would pin a GPU compositor layer for EVERY button (even non-glow
states) — a VRAM allocation leak. v2.1 omits `will-change` from the base
class and applies it ONLY inside the active `.glow-{color} .glow-backdrop`
selector. When the glow style is inactive, the property is absent → the
engine implicitly reverts to `will-change: auto` → the GPU layer is released
and the VRAM footprint is flushed.

---

## 2. Architecture — GPU-Composited Backdrop

### 2.1 DOM structure — wrapper + backdrop

The button currently is a direct flex child of `.daily-main` (which has
**no `overflow: hidden`** — verified). The button itself has
[`overflow: hidden`](src/components/daily-panel.ts:454) (required to clip the
`ring-track`'s oversized rotating child + the ha-ripple surface). A backdrop
*inside* the button would be clipped → no outer glow. So the backdrop must be
a **sibling of the button**, living in a new **wrapper** that becomes the flex
child.

Inject a `<div class="glow-backdrop">` as the **first child of a new
`.take-pill-wrap` wrapper** that contains the button. The wrapper is the flex
child (replacing the button's flex role); the button fills the wrapper; the
backdrop bleeds outward behind the button.

```typescript
// daily-panel.ts render() — button section becomes:
<div class="take-pill-wrap${glowClass}"
     style=${`--ring-duration: ${this._ringDuration()}`}
>
  <div class="glow-backdrop"></div>
  <button class=${this._takeButtonClasses()}
    style=${this.ackActive ? `--ack-duration: ${...}ms` : ''}
    ...>
    <div class="ring-track"></div>
    <ha-ripple></ha-ripple>
    ...existing children...
  </button>
</div>
```

The `${glowClass}` is a space-separated string of `glow-{color}` classes pushed
onto the **wrapper** (not the button), e.g. `glow-red` / `glow-blue` /
`glow-amber` / `glow-green`. The wrapper is the gating element — when no glow
class is present, the backdrop is hidden (see §2.4).

The `--ring-duration` CSS var moves to the **wrapper** (the backdrop is a
wrapper child and consumes it for the breathing cadence). The button no longer
needs it on its own inline style (the ring-track animation already reads it
via inheritance; keeping it on the wrapper covers both).

### 2.2 CSS — wrapper + backdrop

```css
/* Wrapper becomes the flex child (replaces the button's flex:1 role).
   position:relative establishes the positioning context for the backdrop.
   display:flex + flex:1 keeps the button filling the wrapper exactly so the
   backdrop (inset:-N) aligns to the button's box. */
.take-pill-wrap {
  position: relative;
  display: flex;
  flex: 1;
  /* No overflow:hidden here — the backdrop must bleed freely. The button
     keeps its own overflow:hidden for ring-track/ripple clipping. */
}

/* The ambilight backdrop. Sits behind the button (z-index:0; button is
   z-index:1 via position:relative). Bleeds outward via negative inset.
   STATIC filter:blur — never animated (animation = opacity only).
   will-change is intentionally OMITTED from this base class — see 2.4. */
.take-pill-wrap .glow-backdrop {
  position: absolute;
  inset: -18px;                 /* bleed 18px beyond the button on all sides */
  z-index: 0;
  border-radius: calc(var(--ha-card-border-radius, 12px) + 18px);
  background: var(--glow-color, transparent);
  filter: blur(16px);           /* STATIC — diffuses the edge (ambilight falloff) */
  opacity: 0;                   /* hidden by default; only glow-* wrapper shows it */
  pointer-events: none;
  /* will-change OMITTED. It is sandboxed inside the active glow selector
     (2.4) so the base class reverts to will-change auto when inactive,
     releasing the GPU compositor layer and flushing the VRAM footprint.
     Applying it to the always-present base class would pin a GPU layer for
     every button, even non-glow states. */
  /* No animation here. It is gated to the glow selector (2.4). */
}

/* Button sits above the backdrop. position:relative already exists; add
   z-index:1 so it stacks above the z-index:0 backdrop. */
.take-pill-btn {
  position: relative;
  z-index: 1;
}

/* Per-color activation: the wrapper's glow-{color} class sets the color
   token. */
.take-pill-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
.take-pill-wrap.glow-blue   { --glow-color: rgba(var(--rgb-btn-blue), 0.85); }
.take-pill-wrap.glow-amber  { --glow-color: rgba(var(--rgb-btn-amber), 0.85); }
.take-pill-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }
```

### 2.3 Breathing keyframe — opacity only (GPU-composited)

```css
@keyframes ax-btn-glow-breathe {
  0%, 100% { opacity: 0.35; }   /* dim — light recedes */
  50%      { opacity: 0.85; }   /* bright — light surges */
}
```

**Why this is GPU-friendly:** `opacity` is a compositor-only property — the
browser creates a separate GPU layer for the backdrop and toggles its opacity
without repainting the button or its text. `filter: blur(16px)` is applied
**once** (statically) when the layer is created; it is NOT in the keyframe, so
the blur is rasterized once and the breathing just fades the pre-blurred
layer in/out. No per-frame CPU work, no repaint, no jank on tablet SOCs.

### 2.4 Activation + VRAM-safe `will-change` sandbox

The backdrop `<div>` is **always present in the template** (cheap — a single
empty div), but stays invisible unless the wrapper carries a `glow-{color}`
class. The animation + `will-change` are scoped to the **active glow
selector only**, so non-glow states pay zero animation cost AND zero GPU
layer cost:

```css
/* Animation + will-change are sandboxed inside the active glow selector.
   When no glow-{color} class is on the wrapper, these rules do not apply,
   so the backdrop has opacity 0, no animation, and no will-change — the
   engine releases the compositor layer and flushes the VRAM footprint. */
.take-pill-wrap.glow-red .glow-backdrop,
.take-pill-wrap.glow-blue .glow-backdrop,
.take-pill-wrap.glow-amber .glow-backdrop,
.take-pill-wrap.glow-green .glow-backdrop {
  opacity: 0.6;                /* mid-breathe baseline; keyframe overrides */
  will-change: opacity;        /* GPU-composited layer ONLY when active */
  animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
}
```

**VRAM optimization (v2.1):** `will-change: opacity` lives ONLY in this
active-glow rule. The base `.glow-backdrop` class omits it, so when the glow
style is inactive the property is absent → the engine reverts to
`will-change: auto` → the GPU compositor layer is released and the VRAM is
flushed. This prevents the VRAM allocation leak that would occur if
`will-change` were on the always-present base class.

### 2.5 Class helper — wrapper glow class

In [`_takeButtonClasses()`](src/components/daily-panel.ts:63), add the `glow`
branch. **But the glow class goes on the wrapper, not the button.** So we
split: the button classes stay as today (style/icon fragments), and a new
helper returns the **wrapper** class:

```typescript
/** Resolve the wrapper class for the ambilight glow backdrop. Returns ''
 *  when the resolved style is not 'glow' (backdrop hidden, no GPU layer). */
private _takeGlowWrapClass(): string {
  const state = this.buttonState;
  const cfg = this.controller.config;
  // Re-resolve the style using the same defaults as _takeButtonClasses.
  let style: ButtonStateStyle = 'none';
  if (state === 'lockout' || state === 'limit_24h') {
    style = cfg?.take_button_lockout_style ?? 'full';
    if (style === 'auto') style = 'full';
  } else if (state === 'execution') {
    style = cfg?.take_button_execution_style ?? 'none';
    if (style === 'auto') style = 'none';
  } else if (state === 'latency') {
    style = cfg?.take_button_latency_style ?? 'border';
    if (style === 'auto') style = 'border';
  } else {
    return ''; // idle — no glow
  }
  if (style !== 'glow') return '';
  const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
    : state === 'execution' ? 'blue'
    : state === 'latency' ? 'amber' : 'green';
  return `glow-${color}`;
}
```

In `_takeButtonClasses()` itself, add
`if (style === 'glow') classes.push('style-none');` so the **button face**
uses the theme-tinted background (the glow is purely the outer backdrop; the
button itself reads as normal/safe, mirroring `border`/`ring`). The icon
recolors via the orthogonal Icon Style dropdown unchanged.

Template:
```typescript
const glowWrap = this._takeGlowWrapClass();
// ...
return html`
  <div class="take-pill-wrap${glowWrap ? ' ' + glowWrap : ''}"
       style=${`--ring-duration: ${this._ringDuration()}`}
  >
    <div class="glow-backdrop"></div>
    <button class=${this._takeButtonClasses()}
      style=${this.ackActive ? `--ack-duration: ${this.controller.config?.take_button_ack_duration_ms ?? 3000}ms` : ''}
      ...>
      ...existing button children...
    </button>
  </div>
  <div class="stats-column">...</div>
`;
```

### 2.6 Drinks panel — mirror

[`drinks-panel.ts`](src/components/drinks-panel.ts:59) mirrors the same
structure: `.log-drink-wrap` wrapper + `.glow-backdrop` + the button. Only
`glow-red` and `glow-green` apply (drinks button has only lockout/ack states).
`_logDrinkGlowWrapClass()` helper resolves the wrapper class from
`drink_button_lockout_style`.

### 2.7 Breathing speed — reuse `--ring-duration`

Per user decision: the existing per-button `*_ring_speed` config (slow 6s /
medium 4s / fast 2.2s) sets `--ring-duration`, which the glow breathing
consumes. The dropdown label renames from "Rotating Ring Speed" → **"Glow /
Ring Speed"** (one cadence control for both animations). The `--ring-duration`
inline style is set on the **wrapper** so the backdrop (a wrapper child)
inherits it.

### 2.8 New Style option — `glow` (6th)

Add `'glow'` to the [`ButtonStateStyle`](src/types.ts:204) union. `glow` is a
per-state Style option in the same dropdown as `full`/`border`/`none`/`ring`.
It is **not** a new default for any state (defaults stay full/none/border).

### 2.9 Editor + localize

- [`_buttonStyleOptions()`](src/ax-dose-logger-editor.ts:26): append
  `{ value: 'glow', label: localize('en', 'button_style.glow') }`.
- [`localize.ts`](src/localize.ts): add
  `'button_style.glow': 'Ambilight Glow'`; rename
  `config.*_ring_speed` → `"Glow / Ring Speed"`; update per-state style
  helper texts to mention the glow option.

### 2.10 Config migration

None. `glow` is a new value; the legacy `glow → ring` migration in
`_migrateOneButtonState` stays (maps the *old* glow meaning to ring). A
config with literal `glow` would now map to the new glow style, but no real
config has it (always migrated to `ring` on load). Safe.

---

## 3. Files to Modify

| File | Changes |
|------|---------|
| [`src/types.ts`](src/types.ts) | Add `'glow'` to `ButtonStateStyle` union + update doc comment. |
| [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) | Append `glow` to `_buttonStyleOptions()`. |
| [`src/localize.ts`](src/localize.ts) | Add `button_style.glow`; rename `config.*_ring_speed` → "Glow / Ring Speed"; update per-state style helper texts. |
| [`src/components/daily-panel.ts`](src/components/daily-panel.ts) | (a) `_takeGlowWrapClass()` helper; (b) `_takeButtonClasses()` pushes `style-none` for glow; (c) template: wrap button in `.take-pill-wrap` + `<div class="glow-backdrop">`; (d) set `--ring-duration` on wrapper; (e) CSS: `.take-pill-wrap`, `.glow-backdrop` (no will-change, no animation), `glow-{color}` tokens, `@keyframes ax-btn-glow-breathe` (opacity only), active-glow selector with `will-change` + animation, button `z-index:1`. |
| [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) | Mirror: `_logDrinkGlowWrapClass()`; template `.log-drink-wrap` + backdrop; CSS `glow-red`/`glow-green` + breathing + sandboxed will-change. |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Rebuilt via `yarn run build`. |

No backend, config-flow, or `projectstructure.md` changes.

---

## 4. Verification

```bash
cd /workspaces/lovelace-pill-logger-card && yarn run build
```
- Exit 0, no new TS warnings.
- Grep dist: `take-pill-wrap` / `glow-backdrop` / `ax-btn-glow-breathe` /
  `glow-red` / `glow-blue` / `glow-amber` / `glow-green` / `Ambilight Glow`
  present.
- Confirm `will-change` appears ONLY in the active glow selector (not in
  the base `.glow-backdrop` rule) — VRAM optimization verified.
- Visual: set a state's Style to "Ambilight Glow" → confirm a soft colored
  halo radiates from behind the button, breathing in/out slowly; button face
  stays theme-tinted; backdrop bleeds ~18px beyond the button edge (not
  clipped by the button's `overflow: hidden`); icon respects the Icon Style
  dropdown.
- Performance: confirm no layout/paint jitter on a tablet-class device with
  the glow active (opacity-only animation on a composited layer) AND no VRAM
  growth when the glow is inactive (will-change absent → layer released).

---

## 5. Memory Bank / README Updates (post-verification)

- **README.md** — Update the Button State Matrix / Style options list to
  include "Ambilight Glow" (6th style). Note it is a diffused backlight with a
  breathing animation (GPU-composited, VRAM-safe), distinct from the rotating
  ring.
- **memory-bank/activeContext.md** — New Current Status; archive previous.
- **memory-bank/progress.md** — New feature section with checklist.
- **memory-bank/projectstructure.md** — No file additions/removals; no change.

---

## 6. Key Design Decisions

1. **Dedicated backdrop DOM node, not box-shadow.** Animating `box-shadow`
   repaints on CPU; on tablet SOCs multiple breathing buttons lag. A separate
   `<div class="glow-backdrop">` with static `filter: blur(16px)` + animated
   `opacity` is GPU-composited (no repaint).
2. **Wrapper div (`.take-pill-wrap`) becomes the flex child.** The button has
   `overflow: hidden` (clips ring-track/ripple), so the backdrop cannot live
   inside it. The wrapper (no overflow:hidden) holds the backdrop as a sibling
   of the button; the backdrop bleeds outward freely. `.daily-main` /
   `.pane-daily` have no overflow:hidden (verified) → backdrop is visible.
3. **Static `filter: blur`, animated `opacity` only.** The blur is rasterized
   once when the compositor layer is created; the keyframe only fades the
   pre-blurred layer in/out (0.35 ↔ 0.85). Zero per-frame CPU work.
4. **`will-change: opacity` SANDBOXED to the active glow selector (v2.1).**
   It is OMITTED from the base `.glow-backdrop` class so inactive (non-glow)
   states revert to `will-change: auto` and release the GPU compositor layer,
   flushing the VRAM footprint. Applying it to the always-present base class
   would pin a GPU layer for every button → VRAM leak.
5. **Backdrop always in template, gated by wrapper class.** The empty div is
   cheap; the `glow-{color}` class on the wrapper is the on/off switch. No
   glow class → backdrop `opacity: 0` + no animation + no will-change → zero
   cost for non-glow states (no animation cycles, no GPU layer).
6. **Button face stays theme-tinted** (`style-none` branch for glow). The
   glow is an outer light; the button reads as normal/safe, icon recolored
   via the orthogonal Icon Style dropdown.
7. **Reuse `--ring-duration` for breathing cadence** (per user decision). One
   speed dropdown controls both glow + ring; label renamed "Glow / Ring
   Speed". Set on the wrapper so the backdrop inherits it.
8. **`glow` is a NEW 6th style option, not a replacement for `ring`.** They
   are visually opposite (rotating neon perimeter vs. static breathing
   backlight). Coexisting gives users both. `glow` name reclaimed with new
   semantics; legacy `glow → ring` migration unaffected.
9. **No new default, no migration.** `glow` is opt-in per state via the Style
   dropdown.

---

## 7. Visual / Layer Spec

```
   .take-pill-wrap  position relative, flex 1, NO overflow hidden
   |
   +-- .glow-backdrop  inset -18px, z-index 0, blur 16px STATIC, opacity-anim
   |   (will-change opacity ONLY when a glow color class is active)
   |   diffused colored halo, vibrant edge, quickly diffusing outward
   |
   +-- .take-pill-btn  z-index 1, overflow hidden, theme-tinted face
       [icon]
       Take Pill
       Next: 8:00 PM
```

```
   @keyframes ax-btn-glow-breathe  (opacity only, GPU-composited)
     0 percent and 100 percent  opacity 0.35  dim, light recedes
     50 percent                  opacity 0.85  bright, light surges
   duration  var(--ring-duration, 4s)  shared with ring, Glow / Ring Speed