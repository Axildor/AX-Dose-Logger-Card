# Alpha Channel Solidification — Ambilight Glow (Surface Materials Patch)

**Date:** 2026-08-11
**Scope:** Frontend card only (`/workspaces/lovelace-pill-logger-card/src/components/`)
**Type:** CSS-only surface-material patch (no DOM, no JS, no render-pipeline change)

---

## Problem

The Z-axis stacking architecture (v2.1 rollback + belt-and-suspenders audit) is structurally correct:
the `.glow-backdrop` renders at `z-index:-1` inside the wrapper's `isolation:isolate` floor,
the button renders at `z-index:1`, and adjacent UI (`.stats-column`, `.chips-row`, `.med-name`,
`.drinks-title`) sits at `position:relative; z-index:1`.

However, the HA theme's native semi-transparent backgrounds on the foreground UI elements allow the
18px ambilight diffusion (which bleeds outward via `inset:-18px` beyond `.daily-main`) to **transmit
through** the button surface and stat boxes — producing a "tinted glass" effect. The foreground
materials are translucent; the structural z-axis routing cannot help because alpha is a per-pixel
compositing property, not a stacking property.

**Root cause:** Every surface declaration uses `rgba(..., 0.12)` / `rgba(..., 0.06)` / `rgba(..., 0.05)`
alpha-channel values. The backlight's diffusion boundary passes *behind* these translucent fills,
so the glow color blends through the surface tint rather than being occluded.

---

## Architecture Principle

> **Z-index controls paint ORDER. Opacity controls paint BLENDING.**
> Stacking the backdrop below the button does not stop it from being *seen through* a translucent
> button face. Only an opaque (alpha = 1.0) surface material fully occludes the backlight.

The patch therefore **solidifies the surface materials** to alpha-1.0 backgrounds that match the
theme's intent, while leaving the render pipeline (`.glow-backdrop`, `filter:blur(16px)`,
`@keyframes ax-btn-glow-breathe`, `will-change:opacity`, wrapper `isolation:isolate`, z-index
routing) completely untouched.

---

## Material Strategy

The card already follows a single color-mix convention for the `ring-*` gradient shimmers:
`color-mix(in srgb, var(--btn-color) 60%, #fff)`. We reuse the same `color-mix()` primitive to derive
**solid (alpha-1.0)** surface colors that visually match the prior translucent tints, so the user
perceives no visual regression — the surfaces look identical against the card background, but they
now occlude the backlight.

### Color derivation

The prior `rgba(var(--rgb-primary-color, 3, 169, 244), 0.12)` tint, composited over a HA dark card
background `#1c1c1c`, perceptually lands near `#2a2a2c`. To keep the visual identity while making the
fill fully opaque, we composite the tint against the **card-background** color via `color-mix`:

```css
background: color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 12%, var(--card-background-color, var(--primary-background-color, #1c1c1c)));
```

This is the single canonical formula used across ALL patched surfaces. It:
1. Resolves to a fully opaque RGB (alpha = 1.0) — fully occludes the backlight.
2. Adapts to light AND dark themes (follows `--card-background-color`).
3. Visually matches the prior translucent tint (same compositing math the browser was doing).
4. Uses the same `color-mix()` primitive already in the file for `ring-track` shimmers.

### Hover state

Hover previously lifted alpha to `0.2`. We keep the same perceptual step by mixing at `20%`:

```css
background: color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 20%, var(--card-background-color, var(--primary-background-color, #1c1c1c)));
```

### State-color surfaces (`.full-*`, `.icon-*`, `.border-*`)

These states previously used `rgba(var(--rgb-btn-{color}), 0.12)`. The same `color-mix` formula is
applied, substituting `--btn-{color}` for `--rgb-primary-color`. The button's **state identity color**
is preserved (it reads as the same tint), but the fill is now opaque.

### Per-state `--btn-*` tokens

Already declared on `:host` in both panels (daily-panel L555, drinks-panel equivalent). These resolve
`var(--error-color, #db4437)`, etc. — fully opaque hex fallbacks. Safe to feed into `color-mix`.

---

## Patch Map

### A. `src/components/daily-panel.ts`

| Selector (line) | Current | New |
|---|---|---|
| `.take-pill-btn:not(...):not(.state-ack)` (L573) | `rgba(var(--rgb-primary-color, 3,169,244), 0.12)` | `color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 12%, var(--card-background-color, var(--primary-background-color, #1c1c1c)))` |
| `.take-pill-btn:not(...):hover` (L577) | `rgba(..., 0.2)` | `color-mix(... 20%, ...)` |
| `.take-pill-btn.full-*` (L582-589) | `rgba(var(--rgb-btn-*), 0.12/0.2)` | `color-mix(in srgb, var(--btn-*) 12%, var(--card-background-color, ...))` + hover `20%` |
| `.take-pill-btn.icon-*` (L601-608) | `rgba(...primary, 0.12/0.2)` | `color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 12%, var(--card-background-color, ...))` + hover `20%` |
| `.take-pill-btn.border-*` (L617-619) | `rgba(...primary, 0.12)` | `color-mix(... 12%, ...)` |
| `.take-pill-btn.style-none` (L733) | `rgba(...primary, 0.12)` | `color-mix(... 12%, ...)` |
| `.stat-pill` (L873) | `rgba(...primary, 0.06)` | `color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 6%, var(--card-background-color, ...))` |
| `.stat-pill.clickable:hover` (L914) | `rgba(...primary, 0.12)` | `color-mix(... 12%, ...)` |
| `.chip` (L938) | `rgba(...primary, 0.05)` | `color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 5%, var(--card-background-color, ...))` |
| `.chip.clickable:hover` | `rgba(...primary, 0.12)` | `color-mix(... 12%, ...)` |

### B. `src/components/drinks-panel.ts`

Mirror the same patches for `.log-drink-btn` (idle L511, full-* L520-523, icon-* L532-537,
border-* L542-543, style-none L639), `.stat-pill` (L782, L795), `.chip` (L853, L871).

### C. NOT TOUCHED (render pipeline protected)

- `.glow-backdrop` (daily L692, drinks L609) — `inset:-18px`, `filter:blur(16px)`, `opacity`, `will-change`, `@keyframes ax-btn-glow-breathe`
- `.take-pill-wrap` / `.log-drink-wrap` — `isolation:isolate`, `z-index:0`, `position:relative`
- Button `z-index:1`, backdrop `z-index:-1`, `> ha-ripple z-index:3`
- `.stats-column` / `.chips-row` / `.med-name` / `.drinks-title` z-index:1 (NO `overflow:hidden` added — glow must bleed freely)
- `--glow-color` tokens (`.glow-red`, `.glow-blue`, `.glow-amber`, `.glow-green`)

---

## Edge Cases & Safeguards

1. **`state-ack` overlay** — The `.ack-flash` overlay (L756 daily, L661 drinks) paints an opaque
   `#212c22` dark-green surface over the button during the "Logged" confirmation. It already
   occludes the glow correctly (it's alpha-1.0). Our patch does NOT touch `.ack-flash` — it remains
   the sole already-correct opaque surface.

2. **`.style-none` "theme default" option** — semantically "no color override" but the prior CSS
   still applied `rgba(primary, 0.12)` as the idle background. We solidify it with the same
   `color-mix` formula so the default surface also occludes the backlight. The "no change" semantic
   is preserved at the *visual* level (the tint is identical), only the *alpha channel* changes.

3. **Light theme** — `var(--card-background-color)` resolves to a light surface (e.g. `#fff`).
   `color-mix(in srgb, primary 12%, #fff)` yields the same perceptual tint the prior `rgba(primary, 0.12)`
   yielded over white. No light-mode regression.

4. **`color-mix` browser support** — Chromium 111+ (HA frontend's target). Already in active use in
   the same file for `ring-track::before` shimmers (L672-675 daily, L597-598 drinks). Safe.

5. **Glow bleed preservation** — We explicitly do NOT add `overflow:hidden` to `.stats-column` or
   `.chips-row`. The glow's 18px outward diffusion must continue to bleed beyond `.daily-main` so
   the ambilight falloff reads as outer light. The opaque surfaces occlude the glow *where they
   are painted* (the button face, the stat-pill boxes, the chip boxes), but the glow still shows
   in the gutters/borders around them. This is the intended visual.

---

## Verification

1. `yarn run build` clean (exit 0) in `/workspaces/lovelace-pill-logger-card`
2. Visual: enable Ambilight Glow state style on the Take Pill button (Daily pane) and Log Drink
   button (Drinks pane). Confirm:
   - Glow still bleeds 18px outward into the gutters (render pipeline intact)
   - Button face no longer shows the glow color tinting through (occluded by opaque surface)
   - `.stat-pill` boxes (Pills Left, Next Dose, etc.) no longer tint with the glow color
   - `.chip` boxes no longer tint with the glow color
   - Hover on stat-pill/chip still darkens perceptually (12% → primary tint over card bg)
   - `.full-*`, `.icon-*`, `.border-*` state styles still read as their identity color
   - `.ack-flash` "Logged" green overlay renders identically (untouched)
3. Dist token grep: `rgba(var(--rgb-primary-color` count drops on patched selectors; `color-mix` count rises.

---

## Memory Bank Updates

- `memory-bank/activeContext.md` — Current Status → Alpha Channel Solidification; archive the Z-Axis
  Dependency Fix block under Previous Context.
- `memory-bank/progress.md` — append "Alpha Channel Solidification — Ambilight Glow Surface Materials" section.
- `README.md` — NO change (internal CSS-only surface-material patch, no end-user UX/config change).
- `memory-bank/projectstructure.md` — NO change (no files added/renamed/deleted).