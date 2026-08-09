# Apple Intelligence Border Glow — v4 Plan (Two-Layer: .glow-track + ::before)

## Status of v3 (just shipped)
v3 "fails to render at all." Root cause: **the rotation-oversize and the mask-ring cannot share one element.**

v3 put both on the `::before`:
- `inset: -150%` (oversized, 400% of the button — to rotate without corner gaps).
- `padding: 2px` + `mask: ... content-box ...; mask-composite: exclude` (carve the 2px ring).

The mask's `content-box` ring follows the `::before`'s **own box** — i.e., the 400%-sized element's perimeter, ~150% beyond the button edge. The button's `overflow: hidden` then clips everything outside the button → the entire mask ring (which is on the giant element's perimeter) is **clipped away** → nothing renders.

In v1/v2 (`inset: 0`), the `::before` was button-sized, so the mask ring sat on the button edge and rendered. v3's `inset: -150%` moved the ring off the button; the clip removed it.

**Fundamental rule: the mask-ring must live on a button-sized element; the rotation-oversize must live on a child of that element.** They cannot be the same element.

## The fix — two-layer architecture (user-provided, correct)

Separate the two concerns onto two elements. This requires adding a real `.glow-track` `<div>` inside the `<button>` (a `::before` on the button cannot simultaneously be the masked button-sized layer AND host a rotating oversized child).

### Layer 1 — `.glow-track` (mask + ring geometry, button-sized)
- `position: absolute; inset: 0` — button-sized, so the mask ring sits exactly on the button edge.
- `padding: 2px` — the ring width.
- `border-radius: inherit` — ring follows the button's rounded corners.
- `pointer-events: none` — doesn't block clicks.
- `z-index: 0` — under content/ack.
- The mask (dual prefixed + unprefixed):
  ```css
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  ```
  → hollows the center → only the 2px ring shows.
- `overflow: hidden` — clips the rotating child to the button's rounded perimeter.

### Layer 2 — `.glow-track::before` (rotation + gradient, oversized)
- `content: ''; position: absolute; inset: -150%` — 400% of the `.glow-track` (which is button-sized → oversized relative to the button). Rotating this square always covers the `.glow-track` at every angle → no corner gaps.
- `background: conic-gradient(...)` — the colored sweep (per state color).
- `animation: ... transform: rotate(360deg) ... 2.2s linear infinite` — rotates the gradient; the `.glow-track`'s mask carves the ring from this rotating gradient.
- **No mask, no padding on this layer** — it's purely the gradient source + rotator.

### State color → gradient mapping
The glow state classes stay on the button (`glow-red`, etc., from `_takeButtonClasses`). The gradient targets the child via descendant selectors (exactly as the user wrote):
```css
.take-pill-btn.glow-red .glow-track::before    { background: conic-gradient(...); }
.take-pill-btn.glow-blue .glow-track::before   { background: conic-gradient(...); }
.take-pill-btn.glow-amber .glow-track::before  { background: conic-gradient(...); }
.take-pill-btn.glow-green .glow-track::before  { background: conic-gradient(...); }
```

### Gradient spec (adopt user's exact stops)
User-provided (white-tipped head at 270°, solid middle 67.5°→202.5°, transparent gap 270.1°→360°):
```css
conic-gradient(from 0deg,
  transparent 0deg,
  var(--btn-XXX) 67.5deg,
  var(--btn-XXX) 202.5deg,
  color-mix(in srgb, var(--btn-XXX) 60%, #fff) 270deg,
  transparent 270.1deg,
  transparent 360deg);
```
- `0°→67.5°`: transparent → solid (head fade-in).
- `67.5°→202.5°`: **solid state color (135°)** — unambiguous middle.
- `202.5°→270°`: solid → white-tipped head (`color-mix(color 60%, #fff)`).
- `270.1°→360°`: transparent gap (the ~25% empty).

The `270deg` → `270.1deg` hard transition creates the crisp comet head edge (a near-zero-width stop), which is the user's intended design — a sharp bright tip rather than a long fade.

### Template change (required)
Insert `<div class="glow-track"></div>` as the **first child** of the `<button>` in both panels:
```html
<button class=${this._takeButtonClasses()} ...>
  <div class="glow-track"></div>
  <ha-icon ...></ha-icon>
  <span class="take-label">...</span>
  ...
</button>
```
- The `.glow-track` only renders visibly when a `glow-*` class is on the button (otherwise its `::before` has no background and the mask ring is transparent). No need to conditionally render it — leaving it always-present is cheap and keeps the template simple.
- It sits under the content (`z-index: 0`; the button's flex children render above it naturally, or we add `position: relative; z-index: 1` to the content if needed — but the existing button content is fine since the track is `position: absolute` and `pointer-events: none`).

### CSS cleanup
- Remove the v3 `::before`-on-button glow rules entirely (they're replaced by `.glow-track` + `.glow-track::before`).
- Keep the `@keyframes ax-btn-glow-sweep { to { transform: rotate(360deg); } }` (now applied to `.glow-track::before`).
- Keep the button's existing `position: relative` (already there for the ack `::after` overlay) and `overflow: hidden`.

## Files to modify
- `src/components/daily-panel.ts` — (a) template: add `<div class="glow-track"></div>` as first child of the Take Pill button; (b) CSS: replace the v3 `::before`-on-button glow block with the two-layer `.glow-track` + `.glow-track::before` block (4 colors).
- `src/components/drinks-panel.ts` — mirror (template + CSS, 2 colors).
- `dist/ax-dose-logger-card.js` — rebuilt.

No backend, config-flow, editor, types, localize, or README changes — CSS + a non-conditional template div.

## Verification
1. `yarn run build` — clean, exit 0.
2. Grep dist: `glow-track` present (template), `.glow-track::before`/`conic-gradient` present, `inset: -150%` present (on the child), `mask-composite: exclude` present (on the track), old v3 `::before`-on-button glow rules absent.
3. Visual: load the card, set a button state to `glow` — confirm a 2px ring traces the button's rounded border, the colored line (75%, solid middle) sweeps continuously around it, white-tipped head, transparent gap, no radar-pie, no corner gaps, not frozen.

## Memory bank updates (post-verify)
- `memory-bank/activeContext.md` — new Current Status (v4); archive v3.
- `memory-bank/progress.md` — new feature section.
- No `projectstructure.md` / README change.