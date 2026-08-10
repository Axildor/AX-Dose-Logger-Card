# Progress — Pill Logger Card (Frontend)

> ℹ️ **Older history (lines 2-2635 of the pre-truncation file) is archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1).** The sections below are the ~16 most recent feature completions; read the archive only if you need older context.

## Apple Intelligence Border Glow (Comet Sweep) (2026-08-09)
**Feature**: Replaced the "Rotating Border Glow" button style's hard-edged 45° solid-arc conic gradient with a smooth Apple Intelligence / Siri-style "comet sweep" — a bright white-tipped head fading into a transparent tail that travels the masked border ring. Also fixed the ring being half-clipped by the button's `overflow: hidden`. Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes
1. **Hard-edged arc, not a gradient** — the conic-gradient `color 0deg, color 45deg, transparent 45deg` painted a flat wedge with a hard cliff at 45° (a "spinning bar"), not a glowing comet. The Apple effect is a comet: bright head + smooth fading tail over ~20-25% of the ring, the rest transparent.
2. **`overflow: hidden` clipped `inset: -2px`** — the `::before` sat 2px outside the button edge, but the button clips to the padding box, so the outer 2px of the ring was cut — only ~half a thin, off-center ring survived instead of a crisp 2px border-trace.

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank activeContext (Button State Matrix Visual Fixes), located glow CSS in daily-panel.ts + drinks-panel.ts, inspected both `::before` blocks + the `overflow: hidden` container rule
- [x] Step 2: Architecture plan — plans/apple-intelligence-border-glow-plan.md (two root causes, comet-tail gradient spec, inset:0 fix, color-mix decision, steps)
- [x] Step 3: User confirmation — plan approved with `color-mix(in srgb, color, #fff)` white-tipped head; proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) replaced the 4 hard-arc conic-gradients (red/blue/amber/green) with comet-tail `from 0deg, transparent 0→280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg`; (b) shared `::before` block `inset: -2px` → `inset: 0`; (c) animation `2.5s` → `2.2s` linear infinite; (d) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) 2 comet-tail gradients (red/green); (b) `inset: -2px` → `inset: 0`; (c) `2.5s` → `2.2s`; (d) updated comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.1s, no warnings); dist grep confirms new patterns present (`color-mix(in srgb`=6, `transparent 280deg`=6, `2.2s linear infinite`=2, `inset: 0`=4) and old patterns absent (`transparent 45deg`=0, `2.5s linear infinite`=0, `inset: -2px`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow; prior Button State Matrix Visual Fixes + Button State Matrix kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only refinement of an existing style option, not new end-user behavior/config).

### Key decisions
1. **Comet-tail conic gradient** — `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg)`. Transparent for ~78% of the ring, ramps up over 40° to a white-tipped bright head at the 0/360° seam; the whole ring rotates so the head sweeps continuously. This is the masked-gradient-traveling-the-border idiom, not a spinning bar.
2. **`color-mix(in srgb, color, #fff)` white-tipped head** — lifts the comet head toward white for the Apple Intelligence shimmer without a new CSS var. Supported in the HA browser baseline (Chrome 111+/Safari 16.2+/Firefox 113+). User approved this over the plain-state-color alternative.
3. **`inset: -2px` → `inset: 0` (ring-clip fix)** — the ring now sits flush at the button's padding-box edge, fully inside the `overflow: hidden` clip, so the full 2px mask ring is visible and crisp. The `padding: 2px` + `mask-composite: exclude` ring-width mechanism is unchanged.
4. **Duration 2.5s → 2.2s, linear** — slightly brisker to match the Apple sweep cadence; linear (no easing) so the loop reads as constant-speed travel, not stutter.
5. **`color-mix` not escaped in CSS comments** — the new comments avoid backticks (lesson from the prior build's lit `css` template parse failure); build clean on first try.
6. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS refinement of an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering match the name.

## Apple Intelligence Border Glow v2 (Angle-Sweep + Dual Mask) (2026-08-09)
**Feature**: Corrected the v1 comet-tail glow that still rendered as a "static gradient line doing a radar sweep through the middle of the card." v1 changed the gradient shape and `inset` but did not fix the actual rendering failure. v2 fixes the two structural defects: (1) the mask never hollowed the center in modern Chromium (only `-webkit-mask` was declared, but `mask-composite: exclude` operates on the unprefixed `mask` → no list to composite → full conic pie rendered as a radar), and (2) animating `transform: rotate()` on the `::before` clipped the rotating corners under the button's `overflow: hidden`. v2 animates the **gradient angle** via `@property --ax-glow-angle` (element stays static, no corner clip) and declares **both** `mask:` and `-webkit-mask:` (so `mask-composite: exclude` hollows the center → only the 2px ring shows). Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes (v1 failure)
1. **Mask never applied in modern Chromium** — the shared `::before` block declared only `-webkit-mask:` (prefixed shorthand) but set `mask-composite: exclude` (unprefixed composite). In modern Chrome (HA's browser base), `mask-composite` operates on the unprefixed `mask` property, which was never set → no mask image list to composite → the center never hollowed → the full conic-gradient pie rendered → rotating it read as a radar sweep, not a border trace. (Gemini's visual diagnosis confirmed this.)
2. **`transform: rotate()` clips corners under `overflow: hidden`** — rotating the whole `::before` square rotates its bounding box; the parent's `overflow: hidden` clips the rotating corners, producing artifacts even once the mask is fixed.

### Checklist
- [x] Step 1: Context grounding — re-read the v1 glow CSS in daily-panel.ts + drinks-panel.ts; confirmed the `-webkit-mask`-only / `mask-composite: exclude` mismatch; confirmed `overflow: hidden` on the button container
- [x] Step 2: Architecture plan v2 — plans/apple-intelligence-border-glow-plan.md (root cause = mask not applied; fix = dual mask + @property angle-sweep; `@property` browser-baseline note)
- [x] Step 3: User confirmation — plan v2 approved (use @property --ax-glow-angle angle-sweep + dual mask); proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) added `@property --ax-glow-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }` at the top of the `static styles` block; (b) replaced `@keyframes ax-btn-glow-rotate { to { transform: rotate(360deg); } }` with `@keyframes ax-btn-glow-sweep { to { --ax-glow-angle: 360deg; } }`; (c) 4 comet-tail gradients now use `conic-gradient(from var(--ax-glow-angle, 0deg), …)` instead of `from 0deg`; (d) added unprefixed `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)` alongside the existing `-webkit-mask:`; (e) animation ref `ax-btn-glow-rotate` → `ax-btn-glow-sweep`; (f) updated comment header to explain the angle-sweep + dual-mask approach
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) `@property --ax-glow-angle` at top of styles; (b) `ax-drink-btn-glow-rotate` → `ax-drink-btn-glow-sweep` keyframes; (c) 2 gradients use `from var(--ax-glow-angle, 0deg)`; (d) dual mask; (e) animation ref updated; (f) comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.0s, no warnings); dist grep confirms new patterns present (`@property --ax-glow-angle`=2, `var(--ax-glow-angle`=6, `mask: linear-gradient(#000 0 0) content-box`=4, `ax-btn-glow-sweep`=2, `ax-drink-btn-glow-sweep`=2) and old patterns absent (`ax-btn-glow-rotate`=0, `ax-drink-btn-glow-rotate`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v2; v1 + Button State Matrix Visual Fixes kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only structural fix to an existing style option).

### Key decisions
1. **Animate the gradient angle, not the element transform (core fix for the radar-pie + corner-clip)** — `@property --ax-glow-angle { syntax: '<angle>'; initial-value: 0deg; }` + `conic-gradient(from var(--ax-glow-angle, 0deg), …)` + `@keyframes { to { --ax-glow-angle: 360deg } }`. The `::before` stays static → no corner clipping under `overflow: hidden`; only the gradient sweeps around the ring. This is the Apple-style robust technique (vs. rotating the element).
2. **Dual mask (prefixed + unprefixed) — core fix for the mask never applying** — declared both `-webkit-mask:` and `mask:` (and both `-webkit-mask-composite: xor` and `mask-composite: exclude`). The unprefixed `mask` is what `mask-composite` composites against in modern Chromium; declaring only `-webkit-mask` left no list → center never hollowed → radar pie. The fix is a one-line addition (`mask: …`).
3. **`@property` browser baseline** — supported in Chrome 85+/Edge 85+/Safari 16.4+/Firefox 128+, within HA's evergreen browser baseline. Without `@property` registration, animating a `--angle` var would not interpolate (it would jump, not sweep). This is a slightly newer dependency than v1's `color-mix` but still within baseline.
4. **Comet-tail gradient + geometry kept from v1 (correct)** — `from var(--ax-glow-angle, 0deg), transparent 0→280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg`; `inset: 0`, `padding: 2px`, `border-radius: inherit`, 2.2s linear. v1's gradient shape and ring geometry were correct; only the mask and animation mechanism were broken.
5. **`@property` at top of `css` block (not nested)** — `@property` is a top-level at-rule; placing it inside a selector would be invalid. Registered once per panel's shadow DOM with the same `--ax-glow-angle` name (identical `initial-value`); cheap and correct.
6. **No backticks in lit `css` template comments** — continued discipline from the earlier build parse failure; build clean on first try.
7. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS structural fix to an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it.

## Apple Intelligence Border Glow v3 (Oversized Rotating ::before + Extended Solid-Middle Gradient) (2026-08-09)
**Feature**: Corrected the v2 glow that rendered the border trace correctly but (1) did not animate (frozen gradient) and (2) the comet was too short with no solid color section (amber/red confusion risk). v3 drops the unreliable `@property --ax-glow-angle` angle-sweep (which silently failed to register inside Lit's adopted stylesheet → `--ax-glow-angle` stayed unregistered → not interpolable → frozen) and switches to the **oversized rotating `::before`** technique (`inset: -150%`, `transform: rotate(360deg)`) — the element is 400% of the button size so its rotating square always covers the button at every angle (no corner gaps), the button's `overflow: hidden` clips it to the rounded rect, and the `padding: 2px` + dual `mask-composite: exclude` hollows the center → only the 2px ring shows. The gradient is also redesigned to a **75% line with a solid-color middle 50%** so the state color stays unambiguous: `0deg→33deg` transparent→white-tipped head (`color-mix(color 60%, #fff)`), `33deg→67.5deg` head→solid ramp, `67.5deg→202.5deg` SOLID state color (135deg, the unambiguous middle), `202.5deg→270deg` solid→transparent tail, `270deg→360deg` transparent gap (90deg). Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes (v2 failure)
1. **`@property` silently unregistered inside Lit adopted stylesheet** — the `@property --ax-glow-angle` block survived into the dist (verified) but did not reliably register the custom property when processed in the constructed-stylesheet context used by Lit's `css` tagged template + `adoptedStyleSheets`. An unregistered CSS custom property is not interpolable, so `@keyframes { to { --ax-glow-angle: 360deg } }` jumped to the end state on frame 1 → frozen gradient ("static gradient like on the top right"). This is a known Lit/Chromium fragility; relying on `@property` for the animation was the wrong call.
2. **Comet too short + no solid color section** — the v2 gradient was transparent for ~78% of the ring with only a ~40deg colored sweep; the user wanted a longer line (~75%) with a solid-color middle so amber vs red cannot be confused.

### Checklist
- [x] Step 1: Context grounding — re-read the v2 glow CSS in daily-panel.ts + drinks-panel.ts; verified `@property` survived into dist (lines 3123 + 4895) but the animation was frozen; confirmed Lit 3.3.2 + adopted-stylesheet `@property` fragility as the cause
- [x] Step 2: Architecture plan v3 — plans/apple-intelligence-border-glow-plan.md (animation fix = oversized rotating ::before, no @property; gradient = 75% line with solid middle 50% + white-tipped head + 90deg gap)
- [x] Step 3: User confirmation — plan v3 approved; proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) removed the `@property --ax-glow-angle` block from the top of `static styles`; (b) `@keyframes ax-btn-glow-sweep { to { --ax-glow-angle: 360deg } }` → `@keyframes ax-btn-glow-sweep { to { transform: rotate(360deg) } }`; (c) 4 gradients rewritten to the extended solid-middle shape (`from 0deg, transparent 0deg, color-mix(color 60%, #fff) 33deg, color 67.5deg, color 202.5deg, transparent 270deg, transparent 360deg`) — no `var(--ax-glow-angle)`; (d) `::before` shared block: `inset: 0` → `inset: -150%`, removed `border-radius: inherit` (oversized element; the button's overflow:hidden + border-radius clip to the rounded rect), kept dual mask + `padding: 2px`; (e) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: removed `@property`; `ax-drink-btn-glow-sweep` keyframes → `transform: rotate(360deg)`; 2 gradients rewritten; `::before` `inset: -150%` + dropped `border-radius: inherit`; dual mask kept; comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.0s, no warnings); dist grep confirms new patterns present (`inset: -150%`=4, `ax-btn-glow-sweep`/`ax-drink-btn-glow-sweep`=4, `202.5deg`=6, `transparent 270deg`=6) and old v2 patterns absent (`@property --ax-glow-angle`=0, `var(--ax-glow-angle`=0, `transparent 280deg`=0). The 2 remaining `border-radius: inherit` are in the ack `::after` overlay (unrelated, correct to keep).
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v3; v2 + v1 kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only structural fix to an existing style option).

### Key decisions
1. **Oversized rotating `::before` (core animation fix)** — `inset: -150%` makes the element 400% of the button size, centered. A rotating square that large always fully contains the button at every angle → no corner gaps. The button's `overflow: hidden` clips it to the rounded rect, and `padding: 2px` + `mask-composite: exclude` hollows the center → only the 2px ring shows. Animates via `transform: rotate()` (always interpolable, no `@property`). This is the standard "overflow-hidden parent + oversized rotating child" CSS spinner technique — robust and cross-browser.
2. **Drop `@property --ax-glow-angle`** — it survived the build but silently failed to register inside Lit's adopted stylesheet in the target browser, leaving the custom property unregistered → not interpolable → frozen gradient. `transform` animation does not need `@property` and animates reliably. This removes the v2 `@property`/browser-baseline dependency entirely.
3. **Extended 75% line with solid middle 50% (color-clarity fix)** — `0deg→33deg` transparent→white-tipped head, `33deg→67.5deg` head→solid ramp, `67.5deg→202.5deg` SOLID state color (135deg), `202.5deg→270deg` solid→transparent tail, `270deg→360deg` transparent gap (90deg). The solid 135deg middle makes the state color unambiguous (amber vs red cannot be confused); the white-tipped head + fading tail keep the Apple aesthetic.
4. **Drop `border-radius: inherit` on the oversized `::before`** — the 400%-sized element has no meaningful radius; the button's own `overflow: hidden` + `border-radius` clip the painted area to the rounded rect, and the mask's `content-box` produces the rounded ring. Keeping `border-radius: inherit` on the oversized element would have produced a giant rounded shape, not the desired flat-clip-then-mask behavior.
5. **Dual mask kept from v2 (correct)** — both `-webkit-mask:` and `mask:` (and both composites) stay; this is what makes `mask-composite: exclude` actually hollow the center in modern Chromium. v2's mask fix was correct; only the animation mechanism was broken.
6. **No backticks in lit `css` template comments** — continued discipline; build clean on first try.
7. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS structural fix to an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it (animated + color-clear).

## Apple Intelligence Border Glow v4 (Two-Layer .glow-track + ::before) (2026-08-09)
**Feature**: Corrected the v3 glow that "failed to render at all." v3 put both the rotation-oversize (`inset: -150%`) and the mask-ring (`padding: 2px` + `mask-composite: exclude`) on the **same `::before`** — but the mask's `content-box` ring follows the element's own box, so oversizing the element moved the ring onto the 400%-sized element's perimeter (~150% beyond the button edge), where the button's `overflow: hidden` clipped it away → nothing rendered. v4 adopts the user-provided **two-layer architecture**: Layer 1 `.glow-track` (a real div inserted as the button's first child) is button-sized (`inset: 0`), holds the mask that carves the 2px ring on the button edge, `border-radius: inherit` for rounded corners, and `overflow: hidden` to clip the rotating child to the perimeter; Layer 2 `.glow-track::before` is the oversized (`inset: -150%`) rotating gradient source — no mask, just `transform: rotate(360deg)` + `conic-gradient` — the track's mask carves the 2px ring from this rotating gradient. The glow state classes stay on the button and target the child via descendant selectors (`.glow-red .glow-track::before`). Gradient (user's exact stops): solid color `67.5°→202.5°` (135°, the unambiguous middle 50% of the line), white-tipped head via `color-mix(color 60%, #fff)` at `270deg`, crisp head edge (`270→270.1deg` near-zero stop), transparent gap `270.1°→360°` (~25% empty). Frontend-only (CSS + a non-conditional template div). Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root cause (v3 failure)
**The mask-ring and the rotation-oversize cannot share one element.** v3 put both on the `::before`: `inset: -150%` (oversized, to rotate without corner gaps) + `padding: 2px` + `mask: ... content-box ...; mask-composite: exclude` (carve the ring). The mask's `content-box` ring is computed from the element's **own box** — so with `inset: -150%`, the ring sat on the perimeter of the 400%-sized element, ~150% beyond the button. The button's `overflow: hidden` then clipped everything outside the button → the entire mask ring was clipped away → nothing rendered. In v1/v2 (`inset: 0`), the `::before` was button-sized, so the ring sat on the button edge and rendered; v3's oversize moved the ring off the button and the clip removed it. **Fundamental rule: the mask-ring must live on a button-sized element; the rotation-oversize must live on a child of that element.**

### Checklist
- [x] Step 1: Context grounding — re-read the v3 glow CSS in daily-panel.ts + drinks-panel.ts; diagnosed the v3 render failure (oversize + mask on one element → ring clipped away); inspected both button templates + the `.take-pill-btn`/`.log-drink-btn` base CSS (`overflow: hidden`, `position: relative`)
- [x] Step 2: Architecture plan v4 — plans/apple-intelligence-border-glow-plan.md (two-layer .glow-track + ::before; template change required; adopt user's gradient stops; fundamental rule documented)
- [x] Step 3: User confirmation — plan v4 approved (user provided the exact two-layer snippet); proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) template: added `<div class="glow-track"></div>` as the first child of the Take Pill `<button>` (before the `<ha-icon>`); (b) CSS: replaced the v3 `::before`-on-button glow block with two layers — `.take-pill-btn .glow-track` (button-sized mask layer: `inset: 0`, `padding: 2px`, `border-radius: inherit`, `overflow: hidden`, dual mask + `mask-composite: exclude`, `z-index: 0`, `pointer-events: none`) and `.take-pill-btn .glow-track::before` (oversized rotating gradient: `inset: -150%`, `animation: ax-btn-glow-sweep 2.2s linear infinite`); (c) 4 state-color gradients via descendant selectors `.take-pill-btn.glow-X .glow-track::before` using the user's stops; (d) removed a stray `content: ''` from the real `.glow-track` div (content only applies to pseudo-elements); (e) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) template `<div class="glow-track"></div>` as first child of the Log Drink button; (b) CSS two-layer `.glow-track` + `.glow-track::before`; (c) 2 state-color gradients (red/green) via descendant selectors; (d) comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.4s, no warnings; the 2 lit-plugin `tabindex` errors at lines 212/241 are pre-existing in the stats-column boxes, unrelated to the glow, and rollup transpiles without type-checking); dist grep confirms new patterns present (`glow-track`=16, `glow-track::before`=10, descendant selectors `.glow-X .glow-track::before`=6, `270.1deg`=8, `270deg`=8) and old v3 patterns absent (`.take-pill-btn.glow-X::before`=0, `.log-drink-btn.glow-X::before`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v4; v3 + v2 kept as Previous Context), progress.md (this section). No projectstructure.md change (no source file added — the `.glow-track` div is a template element). No README change (CSS + template div, not new end-user behavior/config).

### Key decisions
1. **Two-layer architecture (the core fix)** — the mask-ring (button-sized, `inset: 0`) and the rotation-oversize (`inset: -150%`) must live on **separate elements**. `.glow-track` (button-sized) holds the mask that carves the 2px ring on the button edge + `overflow: hidden` to clip the rotating child to the rounded perimeter; `.glow-track::before` (oversized) is the rotating gradient source. The track's mask carves the ring from the rotating gradient. This is the only architecture that satisfies both "ring on the button edge" (mask follows the button-sized element) and "no corner gaps" (oversized rotating child).
2. **Real `.glow-track` div in the template (required)** — a `::before` on the button cannot simultaneously be the masked button-sized layer AND host a rotating oversized child. A real `<div class="glow-track"></div>` inserted as the button's first child is the masked layer; its own `::before` is the oversized rotator. The div is always present (cheap; only visibly renders when a `glow-*` class is on the button, since otherwise the `::before` has no background).
3. **Descendant selectors for state color** — the glow state classes (`glow-red` etc.) stay on the button (from `_takeButtonClasses`/`_logDrinkButtonClasses`); the gradient targets the child via `.glow-red .glow-track::before`. No change to the class helper logic.
4. **Adopt user's gradient stops** — `transparent 0deg, color 67.5deg, color 202.5deg, color-mix(color 60%, #fff) 270deg, transparent 270.1deg, transparent 360deg`: solid middle 67.5°→202.5° (135°, unambiguous 50% of the line), white-tipped head at 270°, crisp head edge (270→270.1° near-zero stop), 90° transparent gap. The `270→270.1deg` hard transition creates the sharp comet head the user specified.
5. **`transform: rotate()` animation (kept from v3, no `@property`)** — animates the oversized `.glow-track::before`; always interpolable. The mask lives on the static `.glow-track`, so the ring geometry never moves — only the gradient sweeps.
6. **Dual mask kept (correct since v2)** — both `-webkit-mask:` and `mask:` (and both composites) on the `.glow-track`; this is what makes `mask-composite: exclude` hollow the center in modern Chromium.
7. **Removed stray `content: ''` from the real `.glow-track` div** — `content` only applies to `::before`/`::after`, not real elements; harmless but cleaned up for correctness.
8. **No backticks in lit `css` template comments** — continued discipline; build clean.
9. **No backend / config-flow / editor / types / localize / README / projectstructure change** — CSS + a non-conditional template div. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it (renders + animated + color-clear). The pre-existing lit-plugin `tabindex` errors are unrelated and out of scope.

## Glow Speed Dropdown + ACK (Logged) Style Rework (2026-08-09)
**Feature**: Four user-requested changes to the Take Pill / Log Drink buttons: (1) accepted the conic-gradient glow's corner speed variation (inherent to rotating a gradient around a non-circular shape — the gradient sweeps angle at constant rate but the rounded-rect perimeter packs more angle into less arc at the corners; user confirmed: keep the sweep look, current 2.2s = "fast"); (2) added a per-button "Rotating Glow Speed" dropdown (slow 6s / medium 4s / fast 2.2s) at the bottom of each button settings expandable, driven by a single `--glow-duration` CSS var on the animation rule (one `@keyframes`, variable duration); (3) removed the dead "Logged Icon Pulse" config (`take_button_ack_pulse` / `drink_button_ack_pulse` — defined in types/editor/localize but never read by the class helpers; the ACK is an overlay, not an icon pulse); (4) replaced the dead "Logged Style" 7-option dropdown (also never read — the ACK overlay was fixed) with 3 real `ack_layout` options — `top` (default, mirrors button layout: icon over text), `inline` (tick + text on one line, the prior behavior), `big` (large check only, no text) — using a real `<ha-icon icon="mdi:check-bold">` inside a conditional `<div class="ack-flash ack-top|inline|big">` template element (the prior CSS `::after` pseudo-element cannot render a Lit `ha-icon` component). Frontend-only. Architecture plan: [`plans/glow-speed-and-ack-style-plan.md`](plans/glow-speed-and-ack-style-plan.md).

### Checklist
- [x] Step 1: Context grounding — read activeContext, projectstructure, daily-panel.ts (glow CSS, ACK `::after`, `_takeButtonClasses`), drinks-panel.ts (mirror), editor.ts (`_buttonStyleOptions`, `take_button_box`/`drink_button_box` schemas), types.ts (config fields, `ButtonStateStyle`), helpers.ts (`ButtonState`, `resolveButtonState`), localize.ts (`button_style.*`, `button.ack_text`, config helpers)
- [x] Step 2: User confirmation — keep conic-gradient sweep (accept corner speed variation); current 2.2s = "fast"; no engine rewrite to offset-path
- [x] Step 3: Architecture plan — plans/glow-speed-and-ack-style-plan.md (4 changes: glow speed dropdown via `--glow-duration` CSS var; remove dead `ack_pulse`; replace `ack_style` with `ack_layout` 3 options; shift ACK from CSS `::after` to a real `<div>` + `<ha-icon icon="mdi:check-bold">` in template)
- [x] Step 4: User approval — plan approved; switch to Code mode
- [x] Step 5: src/types.ts — removed `take_button_ack_pulse`, `drink_button_ack_pulse`, `take_button_ack_style`, `drink_button_ack_style`; added `take_button_glow_speed`/`drink_button_glow_speed` (`GlowSpeed` = 'slow'|'medium'|'fast'), `take_button_ack_layout`/`drink_button_ack_layout` (`AckLayout` = 'top'|'inline'|'big'); added `GlowSpeed` + `AckLayout` type definitions after `ButtonStateStyle`
- [x] Step 6: src/ax-dose-logger-editor.ts — added `_ackLayoutOptions()` + `_glowSpeedOptions()` module-scoped helpers (alongside `_buttonStyleOptions`); in `take_button_box`: replaced `ack_style` select with `ack_layout` select, removed `ack_pulse` boolean, added `glow_speed` select at the bottom; mirrored in `drink_button_box`
- [x] Step 7: src/localize.ts — added `glow_speed.*` (Slow/Medium/Fast), `ack_layout.*` (Top tick mark and text / Tick mark and text inline / Big tick mark), `config.*_glow_speed` (Rotating Glow Speed), `config.*_ack_layout` (Logged Style) + helper strings; removed `config.*_ack_pulse`, `config.*_ack_style` + helpers; updated `button.ack_text` comment (CSS `::after` → real ack overlay element)
- [x] Step 8: src/components/daily-panel.ts — (a) imported `AckLayout`, `GlowSpeed` from types; (b) added `_glowDuration()` (slow 6s / medium 4s / fast 2.2s) + `_ackLayout()` (default 'top') helpers after `_takeButtonClasses`; (c) button template: inline `style` now always sets `--glow-duration` (+ `--ack-duration` when ackActive), and conditionally renders `<div class="ack-flash ack-{layout}">` containing `<ha-icon icon="mdi:check-bold" class="ack-icon">` + optional `<span class="ack-text">` (omitted in `big`); (d) CSS: glow `::before` animation duration → `var(--glow-duration, 2.2s)`; replaced the `.ack-flash::after` block with `.ack-flash` base + `.ack-top` / `.ack-inline` / `.ack-big` layout classes
- [x] Step 9: src/components/drinks-panel.ts — mirror of Step 8 (import, helpers, template, glow duration CSS var, ACK `::after` → `.ack-flash` div + 3 layout classes)
- [x] Step 10: Verification — `yarn run build` clean (exit 0, 4.1s, no warnings; the 2 lit-plugin `tabindex` errors are pre-existing, unrelated). Dist grep confirms: new patterns present (`glow-duration`=4, `check-bold`=4, `ack-top|ack-inline|ack-big`=18, `glow_speed|ack_layout`=40, `class="ack-text"`=2) and old dead patterns absent (`ack_pulse`=0, `ack_style`=0, `var(--ack-text)`=0; the lone `ack-flash::after` match is a comment in helpers.ts, not CSS)
- [x] Step 11: Update memory-bank — activeContext.md (new Current Status; glow v4 archived as Previous Context), progress.md (this section). No projectstructure.md change (no source file added/removed). README updated for the new user-facing config options (glow speed + ACK layout).

### Key decisions
1. **Keep conic-gradient (user decision)** — the corner speed variation is inherent to rotating a gradient around a non-circle (angle sweeps at constant rate; perimeter distance per angle is non-uniform on a rounded rect). User confirmed: keep the sweep look, accept the variation, current 2.2s = "fast". No engine rewrite to `offset-path` motion path.
2. **CSS var `--glow-duration`, not duplicate `@keyframes`** — one animation rule per panel, the duration is a variable. The panel sets `--glow-duration` inline on the button (always, not gated on a glow state class) so it's ready when the state transitions; harmless when no glow class is active (the `::before` has no background).
3. **Per-button glow speed** (not a single card-level field) — matches the existing per-button structure (`take_button_box` / `drink_button_box` are separate expandables). Each button can have its own speed.
4. **Remove dead config, no migration** — `ack_pulse` and `ack_style` were never read by `_takeButtonClasses` / `_logDrinkButtonClasses` (the ACK is a fixed overlay), so no user has meaningful values. Renaming `ack_style` → `ack_layout` with a fresh 3-option set is clean; old keys are silently ignored.
5. **Real `<ha-icon>` in template, not CSS `::after`** — required because `ha-icon` is a Lit component that cannot render inside a pseudo-element. The tradeoff: a conditional template element instead of pure CSS, but this is the correct HA pattern (HA cards render real `ha-icon` elements, not unicode glyphs like `✓`).
6. **`mdi:check-bold`** — the user-specified icon, rendered via `<ha-icon icon="mdi:check-bold">` in all 3 layouts.
7. **`ack-flash` class on button kept** — harmless marker; the class helpers still push it (minimal code change — only the CSS `::after` rule is deleted, replaced by `.ack-flash` div CSS; the class push stays). The visible rendering now comes from the `.ack-flash` div + layout modifier in the template.
8. **Pre-existing lit-plugin `tabindex` errors** — 4 total across the two panels (stats-column boxes); unrelated to this work; rollup transpiles without type-checking so the build is clean.

## Button Submenu Optimization (2026-08-09)

**Feature:** Four fixes to the visual editor's **Daily Tab → Button** and **Drinks Tab → Button** submenus: (A) label renames for patient-facing terminology, (B) fix the 3-selector stack bug on Logged Style + Rotating Glow Speed, (C) visual grouping so it is clear which tickbox pairs with which dropdown, (D) editor defaults that match the runtime fallbacks. Architecture plan: [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md).

### Planning
- [x] Step 1: Context grounding — read frontend memory-bank/activeContext.md + projectstructure.md; read [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) (Button submenu schema, lines 603-662 + 1010-1047), [`localize.ts`](src/localize.ts) (button labels + helpers, lines 275-290 + 413-428), [`types.ts`](src/types.ts:150-189) (config keys + defaults comments), [`daily-panel.ts`](src/components/daily-panel.ts:60-104) + [`drinks-panel.ts`](src/components/drinks-panel.ts:56-89) (runtime `?? <default>` fallbacks), [`README.md`](README.md:111-145) (Button State Matrix section)
- [x] Step 2: Root-cause the 3-selector stack bug — verified HA's `SelectSelectorMode` in `/usr/src/homeassistant/homeassistant/helpers/selector.py:1782` has only LIST + DROPDOWN modes; `ha-selector-select` auto-selects LIST (stacked radios) for ≤3 options with no explicit `mode`, DROPDOWN for >3 options. The 7-option style selects auto-defaulted to dropdown; the 3-option `ack_layout` + `glow_speed` selects auto-defaulted to LIST. Confirmed via hundreds of explicit `SelectSelectorMode.DROPDOWN` examples in HA Core config flows.
- [x] Step 3: Draft architecture plan (§2.1 renames, §2.2 dropdown mode, §2.3 nested-expandable section breaks, §2.4 default-population) → [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md)
- [x] Step 4: User approved the plan as written

### Implementation (initial — nested expandables)
- [x] Step 5: [`localize.ts`](src/localize.ts) — renamed 4 style labels + 3 pulse labels (config keys unchanged) + helper strings; added 5 `config.button_section_*` section-title keys
- [x] Step 6: [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — added `mode: 'dropdown'` to all 8 select selectors + `default: ...` to all 14 fields + restructured each Button submenu into nested flatten-expandables (one per aspect, 3x nesting: Button → Aspect → grid)
- [x] Step 7: [`README.md`](README.md) — renamed the state matrix table rows + prose references; added section-break description
- [x] Step 8: `yarn run build` clean (exit 0, 4.7s); dist grep confirmed all new patterns present + old patterns absent

### Revision (user feedback → Option A)
- [x] Step 9: User feedback — "3x nesting can become more confusing than helpful"; asked to separate the button settings without nested collapsibles
- [x] Step 10: Presented 4 options (A: flat list + grid pairing, B: flat + constant-selector dividers, C: keep nested expandables, D: flat no grouping); user chose **Option A** (flat list + grid pairing, 2x nesting only)
- [x] Step 11: [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — collapsed the nested expandables back into a flat list of aspect grids (Daily: 5 grids, Drinks: 3 grids); each style dropdown + its pulse toggle paired side-by-side in a `type: 'grid'` row; 2x nesting only (Button → grids)
- [x] Step 12: [`localize.ts`](src/localize.ts) — removed the 5 `config.button_section_*` section-title keys (no longer needed — Option A has no section titles; the label names themselves convey aspect identity)
- [x] Step 13: [`README.md`](README.md) — updated the section-break description to reflect the flat-list + grid-pairing structure (removed "section header" mention)
- [x] Step 14: [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md) — updated §2.3 to reflect the Option A decision (flat list + grid pairing, no nested expandables)

### Verification
- [x] Step 15: `yarn run build` clean (exit 0, 4.5s)
- [x] Step 16: Dist grep — `mode: 'dropdown'`=8, `button_section_`=0 (removed), `Limit Reached Style`=3, `Take Pill Style`=1, `Overdue Warning Style`=1, `Logged Dose Indicator Style`=2, `Execution Requested Style`=0 (old gone), `Latency Warning Style`=0 (old gone), `default: 'full'`=2, `default: 3000`=2, `default: 'fast'`=2, `default: 'top'`=2, `default: true`=6 (includes pre-existing show_amount_in_body etc). All expected counts confirmed.
- [x] Step 17: No backend / coordinator / store / config-flow / types.ts / daily-panel.ts / drinks-panel.ts / ax-dose-logger-card.ts changes (runtime `?? <default>` fallbacks already correct — they stay as defense-in-depth)
- [x] Step 18: No projectstructure.md change (no source files added/removed — only in-place edits to editor/localize/README + new plan doc)

### Documentation
- [x] Step 19: Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status for Button Submenu Optimization; prior Glow Speed Rework status archived to `old/activeContext-archive.md`; kept the 2 Apple Intelligence Glow prior-context blocks)
- [x] Step 20: Update [`memory-bank/progress.md`](memory-bank/progress.md) (this section; archived oldest Daily/Drinks Button Two-Line Height Lock section to `old/progress-archive.md`)
- [x] Step 21: [`README.md`](README.md) updated (Button State Matrix section — state row renames + prose terminology + editor structure description)

### Key decisions
1. **Label renames are localize-only, no config-key changes** — the config keys are deeply embedded in [`types.ts`](src/types.ts), the editor schema, the panel runtime fallbacks, and persisted user configs. Renaming keys would require a migration and break existing configs. The user asked for label changes, not structural renames.
2. **`mode: 'dropdown'` on ALL selects, not just the 3-option ones** — consistent rendering across the entire Button submenu + future-proof (if options are ever reduced to ≤3, the rendering stays dropdown). The HA best-practice approach (hundreds of explicit `SelectSelectorMode.DROPDOWN` examples in HA Core).
3. **Option A (flat list + grid pairing), NOT nested expandables** — the initial implementation used nested flatten-expandables (3x nesting). User feedback: "3x nesting can become more confusing than helpful." Revised to Option A: flat list of aspect grids (2x nesting only). Each style dropdown + its pulse toggle paired side-by-side in a grid row, making the grouping obvious without nested collapsibles. The label names convey aspect identity (no section titles needed).
4. **`default:` on all fields, accepting that defaults get persisted on save** — same pattern used for `show_amount_in_body` / `confirm_tool_actions`. Runtime `?? <default>` fallbacks stay as defense-in-depth. Resolves the user's "logged animation is blank and does not say 3000ms by default" complaint.
5. **No backend changes, no migration, no `projectstructure.md` change** — all changes are frontend editor/localize/README. No source files added or removed.

## Glow Length 85% + Default Speed Medium (2026-08-09)
**Feature**: Two user-requested tweaks to the rotating border-glow (Apple Intelligence perimeter sweep) used by button style options 6 (glow) and 7 (icon_glow). (1) **Longer glow line** — the conic-gradient sweep was 75% of the perimeter (270deg line / 90deg gap); user wanted ~90% but chose **85% (306deg line / 54deg gap)** during planning so the bright white-tipped comet head stays clearly visible as it travels (a 90% / 36deg gap would read as an almost-continuous ring with only a subtle pulse). (2) **Default glow speed changed from Fast (2.2s) to Medium (4s)** — the per-button `take_button_glow_speed` / `drink_button_glow_speed` dropdown now defaults to Medium. Frontend-only. No architecture plan (two-line CSS + default-value change); planned in architect mode, executed in code mode.

### Checklist
- [x] Step 1: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — 4 glow conic-gradients (red/blue/amber/green) rewritten: stops `67.5/202.5/270/270.1` → `76.5/229.5/306/306.1`; comment header "75% line … 90deg gap" → "85% line … 54deg gap"
- [x] Step 2: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — 2 glow gradients (red/green) mirrored to the same new stops; comment header updated
- [x] Step 3: [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — `default: 'fast'` → `default: 'medium'` on both `take_button_glow_speed` + `drink_button_glow_speed` schema fields; `_glowSpeedOptions()` comment "'fast' (2.2s) is the default" → "'medium' (4s) is the default"
- [x] Step 4: [`src/components/daily-panel.ts`](src/components/daily-panel.ts:96) + [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts:81) — runtime `?? 'fast'` → `?? 'medium'` in both `_glowDuration()` helpers; helper doc-comments updated
- [x] Step 5: [`src/types.ts`](src/types.ts) — doc-comments on `take_button_glow_speed` + `drink_button_glow_speed`: `'fast' (2.2s, default)` → `'medium' (4s, default) / 'fast' (2.2s)`
- [x] Step 6: [`src/localize.ts`](src/localize.ts) — `config.helper.take_button_glow_speed` + `config.helper.drink_button_glow_speed`: "Default: Fast." → "Default: Medium."
- [x] Step 7: [`README.md`](README.md) — glow speed sentence: "default is Fast (2.2s per rotation)" → "default is Medium (4s per rotation)"; added a sentence noting the ~85% perimeter sweep + small transparent gap
- [x] Step 8: Verification — `yarn run build` clean (exit 0, 4.4s). Dist grep confirms new stops present (`306deg`=8 [6 gradients + 2 comment refs], `229.5deg`=6, `76.5deg`=6) + old stops absent (`67.5deg`=0, `202.5deg`=0, `270deg`=0) + `default: 'medium'`=2 + `Default: Medium`=2 + `Default: Fast`=0. The 2 `glow_speed.fast` label matches are the still-valid "Fast" dropdown option, not a default ref.
- [x] Step 9: Update memory-bank — activeContext.md (new Current Status; Button Submenu Optimization archived as Previous Context), progress.md (this section). No projectstructure.md change. README updated in Step 7.

### Key decisions
1. **85% line, not 90%** — at 90% (36deg gap) the comet head sweeps past almost continuously and reads as a subtle pulse rather than a distinct traveling line; 85% (54deg gap) keeps the head clearly visible. User chose this during architect-mode planning after the 90%→comet-head-visibility tradeoff was surfaced.
2. **Preserve the comet-tail shape proportions** — the original 75% gradient used a 25% transparent-ramp / 50% solid-middle / 25% white-tipped-head split. The new 85% gradient scales those same proportions to the 306deg line: `0→76.5deg` ramp (25%), `76.5→229.5deg` solid (50%, 153deg), `229.5→306deg` head (25%), `306→306.1deg` crisp edge, `306.1→360deg` gap (54deg = 15%). Same visual character, longer sweep.
3. **6-place default sync** — `'fast'` → `'medium'` touched: editor schema defaults (×2), panel runtime `?? 'fast'` fallbacks (×2), `types.ts` doc-comments (×2), `localize.ts` helper strings (×2), `README.md` (×1), plus 3 inline comments. All kept in sync so the editor, runtime, docs, and user-facing helper text agree.
4. **No migration** — `take_button_glow_speed` / `drink_button_glow_speed` are optional fields with a runtime `?? <default>` fallback. Existing configs that explicitly set `'fast'` keep their value; only configs with no explicit value pick up the new `'medium'` default. No persisted-config breakage.
5. **No backend changes, no projectstructure.md change** — all changes are frontend CSS + TS defaults + docs. No source files added or removed.

---

## Logged Dose Indicator — Clarity, Softening, Press-Feel (2026-08-09)

Three user-reported issues with the transient Logged Dose Indicator (ACK) overlay on the Take Pill / Log Drink buttons.

- [x] Read memory-bank context (activeContext, projectstructure) + daily-panel.ts / drinks-panel.ts button-state + ack-flash CSS
- [x] Confirm user preference on ack green treatment (chose opaque softened green over 12% translucent)
- [x] Write architecture plan → [`plans/ack-clarity-and-softening-plan.md`](plans/ack-clarity-and-softening-plan.md)
- [x] Get user approval on plan (switched to Code mode)
- [x] **Issue 1 — Red tick on limit-reached press:** scope icon-override color rules to direct-child `ha-icon` (`>` combinator) in daily-panel.ts (4 rules) + drinks-panel.ts (2 rules) so the nested ack tick (`button > .ack-flash > ha-icon`) is excluded and keeps its own color
- [x] **Issue 2 — Green too vibrant:** add `--btn-green-soft: #5fa863` CSS var on `:host` in both panels; `.ack-flash` background `var(--btn-green)` → `var(--btn-green-soft)`; tick/text color `#fff` → `var(--btn-green)` (solid green glyph on calmer surface)
- [x] **Issue 3 — Instant pop-in:** add `0% { opacity: 0; transform: scale(0.96) }` + `8% { opacity: 1; transform: scale(1) }` intro stops to `ax-btn-ack-fade` (daily) + `ax-drink-btn-ack-fade` (drinks); add `transform-origin: center` to `.ack-flash`; ~240ms proportional to `--ack-duration`
- [x] Rebuild via `yarn run build` — clean, exit 0, 4.6s
- [x] Dist grep verification: `btn-green-soft`=4, `> ha-icon`=8, `scale(0.96)`=6, `color: var(--btn-green)`=6
- [x] Update [`README.md`](README.md) — Button State Matrix section: paragraph on softened opaque green + solid-green tick + ~240ms press-in + tick-color independence from Icon override
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; demote Glow Length 85% + Button Submenu Optimization to Previous Context; archive oldest 2 blocks (Glow Speed Dropdown + ACK Rework, Apple Intelligence Border Glow v4) to `memory-bank/old/activeContext-archive.md`

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `src/components/drinks-panel.ts`, `README.md`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/ack-clarity-and-softening-plan.md` (new). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change.

**Key decisions:** (1) child combinator not `:not(.ack-icon)` — keeps state-color rules independent of ack implementation; (2) opaque softened green not 12% translucent — prevents red/amber/blue bleed-through that would contradict Issue 1; (3) `~8%` proportional intro not fixed 240ms — scales with `ack_duration_ms`; (4) pure CSS fixes — no config/editor/localize surface touched.

### User follow-up refinements (2026-08-09, same task)

- [x] **Refinement 1 — ack background too bright / hard to read:** initial `--btn-green-soft: #5fa863` was too bright; user specified final values → background `#212C22` (dark green surface) + tick/text `#43A047` (`var(--btn-green)`, bright green glyph). Updated `--btn-green-soft` to `#212c22` in both panels' `:host`; `.ack-flash` color already `var(--btn-green)` from the initial fix. Updated doc-comments in both panels + README paragraph.
- [x] **Refinement 2 — proportional intro feels sluggish at long intervals:** initial `0% → 8%` proportional intro stretched to ~800ms at a 10000ms flash interval. Switched to a **two-animation split** — a FIXED `ax-btn-ack-intro` (240ms, `both` fill, scale+fade-in) + the hold/fade `ax-btn-ack-fade` delayed by 240ms. The `animation:` shorthand MUST be single-line (multi-line breaks the Lit CSS compiler → drops the rule + keyframes). Split the keyframes into `ax-btn-ack-intro` + `ax-btn-ack-fade` (and `ax-drink-btn-ack-intro` + `ax-drink-btn-ack-fade`) in both panels.
- [x] Rebuild via `yarn run build` — clean, exit 0
- [x] Dist grep verification: `212c22`=2, `5fa863`=0, `btn-green-soft`=4, `background:var(--btn-green-soft)`=2, `ax-btn-ack-intro 240ms ease-out both`=1, `ax-drink-btn-ack-intro 240ms ease-out both`=1, all 4 ack keyframes present
- [x] Update [`README.md`](README.md) — paragraph refined: dark green `#212C22` surface + bright green `#43A047` tick/text + fixed 240ms intro (not proportional)
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — Current Status / What Was Changed / Key Design Decisions / Verification all updated to reflect the final `#212C22` + fixed-240ms-two-animation-split design

**Final key decisions (superseding the initial ones):** (2) opaque dark green `#212C22` surface (not the initial `#5fa863`, not 12% translucent) — high contrast + no bleed-through; (3) bright green `#43A047` glyph on the dark surface for legibility; (4) FIXED 240ms intro via two-animation split (not proportional) — stays snappy at long flash intervals; the `animation:` shorthand must be single-line or the Lit CSS compiler drops the rule.

## ACK Intro State Freeze — Hide Post-Press Color Flash (2026-08-09)

### Goal
When a successful Take Pill / Log Drink press flips the underlying button into a new state (most visibly `default → Limit Reached red` when the dose hits the daily limit), the button's real state transitioned **immediately** while the green ACK (Logged Dose Indicator) overlay was still in its fixed 240ms intro fade-in (`opacity 0 → 1`). During those 240ms the overlay was semi-transparent, so the new red state flashed through for ~240ms before the overlay reached full opacity and hid it. User wanted the underlying transition delayed by 240ms so it commits behind the now-opaque overlay.

### Planning
- [x] Read frontend memory-bank/activeContext.md (most recent: ACK clarity/softening task) + progress.md + relevant source (helpers.ts resolveButtonState, daily-panel.ts/drinks-panel.ts ack-flash CSS, ax-dose-logger-card.ts _triggerDailyAck/_triggerDrinksAck/_computeDailyButtonState/_computeDrinksButtonState/disconnectedCallback)
- [x] Root-cause trace: trigger sets `_dailyAckActive=true` synchronously → overlay starts 240ms intro → HA pushes new `pillsSafeToTake=0` → resolver reads live state → returns `lockout` → button snaps to red immediately, visible through the still-fading-in overlay
- [x] Design decision: JS-side state freeze in the container (not CSS `transition-delay` — button color is driven by class swaps that don't all map to a single animatable property, and a CSS delay would fire on every state change including backend-driven ones with no press). Panel stays presentational; freeze lives in the container which already owns the ACK flag + resolver.
- [x] Write architecture plan → plans/ack-state-freeze-plan.md
- [x] Get user approval on plan (proceed with fixed 240ms freeze, both Daily + Drinks)

### Implementation
- [x] src/helpers.ts: added `export const ACK_INTRO_MS = 240` (with doc-comment noting it mirrors the CSS `ax-btn-ack-intro` / `ax-drink-btn-ack-intro` keyframe duration exactly and MUST stay in sync with them; fixed not proportional to `ack_duration_ms`)
- [x] src/ax-dose-logger-card.ts: imported `ACK_INTRO_MS` from `./helpers.js`
- [x] src/ax-dose-logger-card.ts: added `_dailyFrozenState`/`_drinksFrozenState` (`@state() ButtonState | null = null`) + `_dailyFreezeTimer`/`_drinksFreezeTimer` (`number | undefined`) next to the existing ACK flags/timers
- [x] src/ax-dose-logger-card.ts: `_triggerDailyAck` now captures the pre-press state via `_resolveEntities()` + `_computeDailyButtonState()` into `_dailyFrozenState`, arms a 240ms (`ACK_INTRO_MS`) release timer that clears the frozen state + requests re-render, then sets `_dailyAckActive=true` + arms the existing ack-duration timer (unchanged)
- [x] src/ax-dose-logger-card.ts: `_triggerDrinksAck` mirrors the daily freeze using `_drinksFrozenState`/`_drinksFreezeTimer` + `_computeDrinksButtonState`
- [x] src/ax-dose-logger-card.ts: `_computeDailyButtonState` + `_computeDrinksButtonState` short-circuit at the top — return the frozen state while `_dailyFrozenState !== null` / `_drinksFrozenState !== null`, falling through to live-state resolution once the freeze releases
- [x] src/ax-dose-logger-card.ts: `disconnectedCallback` clears `_dailyFreezeTimer` + `_drinksFreezeTimer` (scoped to the new freeze timers; the pre-existing `_dailyAckTimer`/`_drinksAckTimer` leak is noted as out-of-scope)

### Verification
- [x] `yarn run build` — clean, exit 0, dist/ax-dose-logger-card.js created in 4.4s
- [x] Dist grep: `ACK_INTRO_MS`=5 (1 const def + 1 import + 2 timer args + 1 frozen-state comment), `_dailyFrozenState`=6, `_drinksFrozenState`=6, `ax-btn-ack-intro`=3 + `ax-drink-btn-ack-intro`=3 (CSS keyframes intact: 1 def + 2 animation-shorthand refs each), `240`=15
- [x] No CSS / panel / config / editor / localize / types changes — pure JS in the container
- [x] No backend changes (frontend-only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **JS-side state freeze in the container, not CSS `transition-delay`** — the button color is driven by class swaps (`full-red`, `icon-red`, `border-red`, `glow-red`, etc.) that don't all map to a single animatable `transition` property; a CSS delay would also fire on every state change (e.g. a backend-driven lockout with no press), which is wrong-scope. The freeze is scoped to the ACK window only.
2. **Panel stays presentational** — the freeze lives in the container (which already owns the ACK flag + the resolver); the panel remains a pure function of its `.buttonState` / `.ackActive` props. No panel CSS or logic changes.
3. **Capture the pre-press state at trigger time** — the trigger fires synchronously right after `button.press`, before HA has pushed the new state, so `_resolveEntities()` + `_computeDailyButtonState()` return the pre-press value (e.g. `idle`/`execution`). This is exactly the value to hold through the intro.
4. **Fixed 240ms (`ACK_INTRO_MS`), not proportional to `ack_duration_ms`** — mirrors the fixed CSS intro exactly so the freeze release always coincides with the overlay reaching opacity 1. Single source of truth via the shared constant; the constant's doc-comment notes the CSS keyframes MUST be updated together with it.
5. **Override-confirm path is a harmless no-op** — by the time the limit-reached dialog Confirm fires `_triggerDailyAck`, the state is already `lockout`, so freezing `lockout` for 240ms just holds the already-red button red behind the overlay (no visible change). No special-casing needed.
6. **Rapid re-trigger safe** — mirrors the existing clear-before-arm timer pattern for the freeze timers.
7. **Cleanup scoped to the new freeze timers** — `disconnectedCallback` clears `_dailyFreezeTimer` + `_drinksFreezeTimer`; the pre-existing `_dailyAckTimer`/`_drinksAckTimer` not being cleared on disconnect is noted as an out-of-scope pre-existing gap (filed in the plan) to keep this change scoped.

**Scope:** Frontend only. Files: `src/helpers.ts`, `src/ax-dose-logger-card.ts`, `README.md`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/ack-state-freeze-plan.md` (new). No panel CSS, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change.


## Hide "Next: now" on Take Pill Button (2026-08-09)

**Feature:** Small UX tweak to the Take Pill button's sub-line. Reported by user: the button showed "Next: Now" once the scheduled next-dose time arrived — redundant, since the dose is due now and a future-countdown label has no meaning at that point. Request: when `next` is reached, hide the `Next:` segment entirely; only `Last:` should remain.

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank activeContext (most recent: ACK Intro State Freeze); located the sub-line render in [`daily-panel.ts`](src/components/daily-panel.ts:219) + the `nextDose` source [`_computeNextDose`](src/ax-dose-logger-card.ts:526) (returns literal `'now'` when `next <= now`); confirmed the Overdue precedence (`overTime ? Overdue : Next : nothing`)
- [x] Step 2: Edit [`src/components/daily-panel.ts`](src/components/daily-panel.ts:221) — widened the Next-segment render guard from `nextDose !== 'Unavailable'` to `nextDose !== 'Unavailable' && nextDose !== 'now'` so the entire `Next:` segment (bullet + label + value) is omitted when `next` is reached; `Last:` remains alone
- [x] Step 3: Verification — `yarn run build` clean (exit 0, 4.5s); dist grep confirms new guard present (`nextDose !== 'Unavailable' && nextDose !== 'now'` count = 1)
- [x] Step 4: Update memory-bank — activeContext.md (new Current Status; ACK Intro State Freeze + Logged Dose Indicator Clarity kept as Previous Context), progress.md (this section). No projectstructure.md change (no source files added/removed). No README change (sub-line format is not documented; display refinement of an existing element).

### Key decisions
1. **Purely presentational** — no backend / coordinator / state change. The `'now'` sentinel is already emitted by `_computeNextDose`; the panel simply stops rendering it. Matches the user's direct request with no new config option.
2. **Guard on the sentinel, not a re-derivation** — comparing against `'now'` (the canonical "next dose has arrived" signal in this card) keeps the panel presentational and consistent with how the rest of the card already classifies this state. Re-reading the raw `next_dose` state and recomputing would duplicate `_computeNextDose` logic.
3. **Overdue precedence preserved** — `overTime` still takes priority over `Next:`. The `Next: now` gap only appeared before overdue kicked in (scheduled meds) or never (As-Needed meds whose `_computeOverTime` returns `null`). Hiding `'now'` covers both cases cleanly; the future-countdown path (`Xh Ym`) is unchanged.
4. **No README change** — the `Last: … • Next: …` sub-line format is not documented in the card README; this is a display refinement of an existing element, not new end-user behavior or a config surface.

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `dist/ax-dose-logger-card.js` (rebuilt). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no CSS, no config keys, no migration, no `projectstructure.md` change.

## Color-Scheme Indicator Conflict Signage (2026-08-09)
**Feature**: Surface a visual conflict between the user-configurable card accent (color_scheme) and the four hardcoded medical button-state indicators. The idle Take Pill / Log Drink button's background is tinted by `--primary-color` ([`daily-panel.ts:441`](src/components/daily-panel.ts:441)), and four scheme colors match (or approximate) the four indicator colors, so picking one of them can make the idle button resemble an active medical state at a glance. Frontend-only, no behavior change. Architecture plan: [`plans/color-scheme-indicator-conflict-plan.md`](plans/color-scheme-indicator-conflict-plan.md).

### Planning
- [x] Read frontend memory-bank (activeContext, progress, projectstructure) for context
- [x] Locate color_scheme dropdown ([`ax-dose-logger-editor.ts:197`](src/ax-dose-logger-editor.ts:197)) + scheme hex table ([`helpers.ts:78`](src/helpers.ts:78)) + indicator token definitions ([`daily-panel.ts:422`](src/components/daily-panel.ts:422))
- [x] Confirm the four colliding colors: Red (`#e53935`≈`#db4437` Limit), Blue (`#03a9f4`=`#03a9f4` Dose Due, exact), Orange (`#fb8c00`≈`#f5a623` Overdue Amber, near), Green (`#43a047`=`#43a047` Logged, exact)
- [x] Push back on device-info-dialog explainer placement; user confirmed editor helper text + README is preferred (co-located with the choice, no runtime clutter); Orange stays flagged per user

### Implementation
- [x] [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:177) — (a) reordered color_scheme dropdown: non-colliding hues first (default, yellow, purple, pink, teal, brown, coral, slate, gold, grey), then the four colliding colors last (Red, Blue, Orange, Green) each with a trailing ` *` appended via `localize('en', 'color.X') + ' *'` (option `value` strings unchanged → no config migration); (b) restructured the top of the schema into two rows after user feedback that the long helper cluttered the editor: Row 1 = 2-column grid of `device_id` | `name` (Device | Name Override, device keeps `required: true` inside the grid); Row 2 = `color_scheme` alone on its own full-width row so the helper has room to render on one line. Added an explanatory code comment block.
- [x] [`src/localize.ts`](src/localize.ts:400) — set `config.helper.color_scheme` to the user's exact one-line wording: `'Accent color for the card. Colors with * match the medical button-state indicators and can blur the idle/active read — for more information see the README Button State Matrix.'` (the long paragraph version was reverted after user feedback that it cluttered ~40% of the top settings area; HA's schema helper renders as plain text so the README is referenced by name, not as a clickable link).
- [x] [`README.md`](README.md:81) — Quick Start step 3 now references the starred-colors note; appended a new "⚠️ Color Scheme and Indicator Conflicts" subsection right after the Button State Matrix section listing the four collisions with hex values and the `*` marker convention.

### Verification
- [x] `yarn run build` — clean (exit 0, dist/ax-dose-logger-card.js created in 19.4s)
- [x] Dist grep confirms all four starred labels present (`color.red') + ' *'`, `color.blue') + ' *'`, `color.orange') + ' *'`, `color.green') + ' *'` — count = 1 each)
- [x] Dist grep confirms the expanded helper text present ("match the medical button-state indicators" — count = 1)
- [x] No backend / coordinator / store / config-flow / types changes (frontend strings + editor option order only)
- [x] No config migration (option `value` strings unchanged; only menu order + display labels + helper text changed)
- [x] No projectstructure.md change (no files added/renamed/deleted; primary responsibilities unchanged)
- [x] activeContext.md updated (new Current Status; prior archived per truncation rule)
- [x] progress.md updated (this section; 2 oldest sections archived to memory-bank/old/progress-archive.md to stay near the ~400-line target)

### Key decisions
1. **Explainer in editor helper text, not the device-info dialog** — the device-info dialog (opened by pressing the drug title) is for device navigation, opened rarely and not at the moment of color choice; HA's standard pattern for field-level guidance is the `helper` text co-located with the field — visible exactly when picking the color, silent once configured, no recurring visual noise. User confirmed this placement.
2. **Orange stays flagged** — `#fb8c00` (orange) is close enough to `#f5a623` (amber overdue) to confuse the at-a-glance read; flagging it is the conservative, safety-leaning choice. User confirmed.
3. **`*` suffix appended in the editor, not in localize.ts** — keeps the i18n map clean (the asterisk is a UI annotation, not a translatable string); a future localized build isn't forced to translate the marker.
4. **Reorder, don't remove** — the four colliding colors remain valid choices (some users may want the accent to match a specific indicator deliberately); the signage warns at the point of choice without restricting the option set.
5. **No functional behavior change** — active-state classes still apply their own indicator colors when active; only the idle tint readability is affected, and only cosmetically. Documented as a readability concern, not a bug.

## Medical Color Indicators Explainer Popup + Toggle (2026-08-10)
**Feature**: Added an in-card, ha-dialog + ha-markdown explainer of the medical button-state indicator colors and the Color Scheme interference, reached via a secondary button in the device-info popup. Gated by a top-level config toggle `show_color_indicator_explainer` (default ON) so the button disappears entirely once learned. Frontend-only, no behavior change. Architecture plan: [`plans/color-indicators-explainer-popup-plan.md`](plans/color-indicators-explainer-popup-plan.md).

### Motivation
The prior signage task (starred dropdown colors + one-line helper pointing to the README) left no easily-accessible in-card explainer — the README is canonical but not discoverable at runtime. The user wanted an explainer easy to find but out of the way when learned. Reusing the established [`_renderSleepDisruptionDialog()`](src/ax-dose-logger-card.ts:1905) ha-dialog + `<ha-markdown>` popup pattern keeps it version-stable (no DOM injection) and consistent with existing card UX. The trigger lives in the device-info dialog (opened by pressing the drug title — the natural "tell me about this med" surface), not the editor, preserving the editor's compact layout.

### Implementation
- [x] [`src/types.ts`](src/types.ts:61) — added `show_color_indicator_explainer?: boolean;` to `AxDoseLoggerCardConfig` + `showColorExplainerDialog(): void;` to the `CardController` interface (near `showDeviceInfo`).
- [x] [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:203) — top-level settings restructured into rows: Row 2 = **Color Scheme | Default View** (2-column grid); Row 3 = **Color Explainer Button | Hide Navigation Bar** (2-column grid; `show_color_indicator_explainer` `default: true` moved up beside Hide Nav Bar); Row 4 = Large Text | Bold Text. Color Scheme dropdown ordering unchanged.
- [x] [`src/localize.ts`](src/localize.ts) — `config.show_color_indicator_explainer` label = "Color Explainer Button"; `config.helper.show_color_indicator_explainer` helper = "Show a Medical Color Indicators button in the device-info popup." (default-on note removed per user request); `config.helper.color_scheme` reworded to "Accent color for the card. *Press card title for more info on indicator colors and the starred colors."; added dialog keys `dialog.device_info.color_indicators` ("Medical Color Indicators"), `dialog.device_info.color_indicators_aria`, `dialog.color_indicators.title`, `dialog.color_indicators.close`, and `dialog.color_indicators.explainer` (joined multi-line markdown: indicator-color table + fixed-vs-tinted distinction + Color Scheme interference list with hex values + non-starred recommendation — mirrors the README "⚠️ Color Scheme and Indicator Conflicts" subsection).
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1318) — `_renderDeviceInfoDialog()` widened from `width="small"` → `width="medium"` + `.dialog-body--center` CSS changed to `flex-direction: column; align-items: center; gap: 12px;` so the two stacked buttons no longer touch + added scoped `.dialog-body--center .dialog-btn { width: 50%; box-sizing: border-box; }` so the stacked device-info buttons are half-width and centered (global `.dialog-btn` in other dialogs stays full-width).
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — (1) `@state() private _showColorExplainerDialog: boolean = false;`; (2) `public showColorExplainerDialog(): void` accessor; (3) `_showColorExplainerDialog` added to the `updated()` reactive-property whitelist; (4) reset to `false` in the disconnect cleanup block; (5) new `_renderColorExplainerDialog()` renderer (ha-dialog + `<ha-markdown .content>` + close button, mirroring the Sleep Disruption popup); (6) `_renderDeviceInfoDialog()` renders a second `.dialog-btn` (icon `mdi:palette-outline`, label `dialog.device_info.color_indicators`) below "To Device info" when `config.show_color_indicator_explainer !== false` — clicking it opens the explainer and closes the device-info dialog; (7) render call added to the main render.
- [x] [`README.md`](README.md:148) — added a one-line note in the "⚠️ Color Scheme and Indicator Conflicts" subsection pointing to the in-card popup + fixed a missing blank line before the ACK-flash layout paragraph.

### Verification
- [x] `yarn run build` — clean (exit 0, dist/ax-dose-logger-card.js created in 3.3s)
- [x] Dist grep confirms: `show_color_indicator_explainer` (count = 6), explainer markdown "Button State Indicator Colors" (count = 1), device-info button label `dialog.device_info.color_indicators` (count = 4), `showColorExplainerDialog` accessor (count = 9), `_renderColorExplainerDialog` renderer (count = 2)
- [x] No backend / coordinator / store / config-flow changes (frontend dialog + config field only)
- [x] No config migration (new optional boolean with documented default; existing configs render as today → default ON → button visible, via the negative-false check `!== false`)
- [x] No projectstructure.md change (no files added/renamed/deleted; primary responsibilities unchanged)
- [x] activeContext.md updated (new Current Status; prior Color-Scheme Signage + Hide Next:now kept as Previous Context; oldest Button State Matrix section archived to memory-bank/old/progress-archive.md)
- [x] progress.md updated (this section; oldest section archived to memory-bank/old/progress-archive.md to stay near the ~400-line target)

### Key decisions
1. **Reuse the ha-dialog + ha-markdown popup pattern** — same as the Sleep Disruption popup; version-stable, no DOM injection, consistent card UX. Markdown content lives in `localize.ts` as a joined multi-line string.
2. **Trigger in the device-info dialog, not the editor** — preserves the editor's compact layout (the long helper was the problem last round); the device-info dialog is the natural "tell me about this med" surface.
3. **Toggle defaults ON** — discoverability for new users; turning it OFF hides the button entirely (no runtime clutter once learned). Negative-false check preserves existing configs without the field (default ON → button visible).
4. **Markdown mirrors the README subsection** — single conceptual source of facts (README stays canonical; popup reuses the same indicator-color table + interference list for in-card convenience).
5. **No migration / no functional behavior change** — new optional boolean + a new dialog; existing configs render as today. The indicator colors themselves are unchanged.

---

## Rapid Successive-Click Counter on ACK Flash (2026-08-10)

**Feature:** The green "Logged" flash on the Take Pill and Log Drink buttons now visually tracks rapid back-to-back clicks. When the user taps again while the flash is still active, the text instantly updates to `Logged 2x`, `Logged 3x`, etc. and the fade timer resets; the first press shows the bare `Logged` (no `1x`). In the Big-tickmark layout (no text) a small green `Nx` badge appears below the tick when the count reaches 2 or more. Frontend-only, both buttons for parity. Architecture plan: [`plans/rapid-click-count-plan.md`](plans/rapid-click-count-plan.md).

### Planning
- [x] Step 1: Context grounding — read frontend memory-bank (activeContext + progress), [`daily-panel.ts`](src/components/daily-panel.ts), [`drinks-panel.ts`](src/components/drinks-panel.ts), [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) ACK state machine (`_triggerDailyAck` / `_triggerDrinksAck` / `disconnectedCallback` / render props), [`helpers.ts`](src/helpers.ts) (`ACK_INTRO_MS`, `ackActive`), [`localize.ts`](src/localize.ts) (`button.ack_text`)
- [x] Step 2: Wrote architecture plan → [`plans/rapid-click-count-plan.md`](plans/rapid-click-count-plan.md) (state model, sequence diagram, panel render changes, CSS, disconnect hardening)
- [x] Step 3: User confirmed scope — (a) both Take Pill + Log Drink buttons for parity; (b) `big` layout gets a small `Nx` badge below the tickmark when count ≥ 2 (not textless)
- [x] Step 4: User approved the plan and switched to Code mode

### Implementation
- [x] Step 5: Container state — added `@state() _dailyAckCount: number = 0` + `@state() _drinksAckCount: number = 0` (zero ⟺ inactive, 1 ⟺ first press, 2+ ⟺ `Logged {n}x`); documented the rapid-click lifecycle in the field-group comment
- [x] Step 6: Rewrote [`_triggerDailyAck()`](src/ax-dose-logger-card.ts:854) — increment-or-init: if `_dailyAckActive` true, `_dailyAckCount += 1`; else init to 1 + arm flag. Fade timer always cleared + re-armed (covers first + subsequent). On expiry both flag and counter reset together
- [x] Step 7: Rewrote [`_triggerDrinksAck()`](src/ax-dose-logger-card.ts:885) — mirror of `_triggerDailyAck` with `_drinksAckCount`
- [x] Step 8: Container render props — added `.ackCount=${this._dailyAckCount}` to the daily-panel render site and `.ackCount=${this._drinksAckCount}` to the drinks-panel render site
- [x] Step 9: Container disconnect — extended [`disconnectedCallback()`](src/ax-dose-logger-card.ts:2415) to cancel `_dailyAckTimer` / `_drinksAckTimer` alongside the existing freeze-timer cancellation (hardening; ACK timers were previously left to fire harmlessly on a detached element)
- [x] Step 10: Daily panel — added `@property ackCount: number = 0`; added `_ackLabelText()` helper returning `Logged` at count 1 and `Logged {n}x` at count ≥ 2; rewrote the ACK overlay render block to call `_ackLabelText()` for top/inline and render `<span class="ack-count-badge">Nx</span>` for big when count ≥ 2; added `.ack-count-badge` CSS scoped under `.ack-flash.ack-big`
- [x] Step 11: Drinks panel — mirror of the daily panel (prop, helper, render block, CSS under `.log-drink-btn`)
- [x] Step 12: Fixed CSS-comment backtick issue — the `.ack-count-badge` CSS comments used backticks (`` `big` ``) inside the `css` tagged template, which Lit's CSS compiler interpreted as template-literal interpolation and emitted TS1005 errors in drinks-panel.ts. Removed the backticks from the comments in both panels

### Verification
- [x] Step 13: `yarn run build` — exit 0, 3.8s, no TS errors (after the backtick fix)
- [x] Step 14: Dist grep — `grep -c 'ackCount\|_dailyAckCount\|_drinksAckCount\|ack-count-badge\|_ackLabelText' dist/ax-dose-logger-card.js` = 29 matches (all new logic compiled in)

### Documentation
- [x] Step 15: [`README.md`](README.md) — added a "Rapid successive clicks" paragraph at the end of the Logged Dose Indicator section (text suffix on top/inline, `Nx` badge on big, counter resets on fade, pure visual tally)
- [x] Step 16: `memory-bank/activeContext.md` — new Current Status; prior Color Indicators Explainer + Color-Scheme Signage kept as Previous Context
- [x] Step 17: `memory-bank/progress.md` — this section
- [x] Step 18: No `projectstructure.md` change (no files added/renamed/deleted; only in-place edits to 3 source files + new plan doc)

### Key decisions
1. **Counter coupled to the ACK flag lifecycle** — `_dailyAckCount === 0` iff inactive, so one source of truth clears itself on timer expiry. No second timer, no reset-on-expire edge case. Existing single-timer architecture preserved; only the bookkeeping inside it changes.
2. **Both buttons for parity** — Take Pill and Log Drink share an identical ACK-flash state machine; the counter logic is mirrored on both.
3. **`big` layout gets an `Nx` badge (user-confirmed)** — no text to append the suffix to, so a small green `Nx` badge renders below the tick when count ≥ 2. Satisfies "all the styles should have the 2x, 3x, 4x indicators always on" across all three ACK layouts.
4. **Suffix built by interpolation, no new localize key** — `${base} ${count}x` off the existing `button.ack_text` (`"Logged"`). Matches the user's verbatim examples; a `button.ack_count_suffix` placeholder key can replace the literal `x` later if i18n needs it.
5. **No new config option / no editor-schema change** — the counter is always-on behaviour. The fade duration (`ack_duration_ms`, default 3000), freeze window (`ACK_INTRO_MS`, 240ms), and layout (`ack_layout`) are unchanged.
6. **Disconnect hardening** — the ACK fade timers are now cancelled in `disconnectedCallback` alongside the existing freeze-timer cancellation; previously they fired `requestUpdate` on a detached element (harmless but unclean).
7. **CSS comment backtick fix** — backticks inside a `css` tagged template are interpreted as interpolation by Lit's CSS compiler; removed from the new comments in both panels. (The daily panel compiled clean on the first pass despite the same comment; the drinks-panel build surfaced the TS1005; both fixed for consistency.)
8. **No backend / coordinator / store / config-flow / migration change** — each tap already fires `hass.callService('button','press')`; the counter is a pure UI affordance (running tally over the ACK window), not a new backend log.

## keyed() Arrow-Function Bug Fix (2026-08-10)

**Bug:** The fade-timer-reset feature uses Lit's `keyed()` directive to recreate the `.ack-flash` DOM subtree on each count change (restarting the CSS animation). The initial implementation passed an arrow function `keyed(this.ackCount, () => html\`...\`)` as the second argument, but `keyed()` expects a `TemplateResult` directly — `keyed(key, html\`...\`)`, not a function returning one. Lit rendered the arrow function's source code as a string on the button (visible as `() => b\`<div class="ack-flash...`).

### Root cause
- `keyed(key, value)` — `value` must be a `TemplateResult` (the direct result of `html\`...\``), NOT a function returning it. Passing `() => html\`...\`` causes Lit to coerce the function to a string, rendering its source code as visible text.

### Checklist
- [x] Step 1: Read both render blocks ([`daily-panel.ts:239`](src/components/daily-panel.ts:239), [`drinks-panel.ts:255`](src/components/drinks-panel.ts:255)) to confirm the `() =>` wrapper
- [x] Step 2: Removed the `() =>` wrapper in both panels — `keyed(this.ackCount, html\`...\`)` instead of `keyed(this.ackCount, () => html\`...\`)`
- [x] Step 3: `yarn run build` — exit 0, 3.7s, no TS errors
- [x] Step 4: Dist grep — `grep -c '()=>b\`<div class="ack-flash' dist/ax-dose-logger-card.js` = 0 (bug pattern gone); `grep -c 'ack-count-badge'` = 4 (badge logic intact)

### Key decisions
1. **`keyed()` takes a TemplateResult, not a factory function** — unlike React's `key` prop or some render-prop patterns, Lit's `keyed(key, value)` expects the rendered content directly. The key change triggers a DOM teardown + recreate, so the `html\`...\`` is evaluated fresh each render anyway; wrapping it in a function defeats the purpose and gets stringified.
2. **No CSS or state-machine change needed** — the bug was purely in the render-block argument shape; the `.ack-repeat` CSS class, the counter state machine, and the timer-reset logic were all correct.

## shouldUpdate Whitelist — Invisible First Flash Fix (2026-08-10)

**Bug:** The first "Logged" flash sometimes failed to render visually if the button was pressed right after the fade animation finished, but the click was registered (subsequent clicks showed "2x").

### Root cause
- The ACK state properties (`_dailyAckActive`, `_dailyAckCount`, `_drinksAckActive`, `_drinksAckCount`, `_dailyFrozenState`, `_drinksFrozenState`) were **not in the [`shouldUpdate`](src/ax-dose-logger-card.ts:2458) whitelist**. When the fade timer expired and set `_dailyAckActive = false` + `_dailyAckCount = 0` + called `requestUpdate()`, `shouldUpdate` returned `false` (no `hass` change, no whitelisted prop changed) — the `.ack-flash` div was never removed from the DOM. A rapid re-press with `ackCount = 1` (same key as the first press) reused the stale `keyed()` instance; the CSS animation did not restart and the flash was invisible. The second press incremented to `ackCount = 2` (different key), so `keyed()` recreated the DOM and the animation played — hence "2x" was visible but "1x" was not.

### Checklist
- [x] Step 1: Read [`shouldUpdate`](src/ax-dose-logger-card.ts:2458) + [`_relevantStateChanged`](src/ax-dose-logger-card.ts:2521) — confirmed ACK props not whitelisted
- [x] Step 2: Added `_dailyAckActive`, `_dailyAckCount`, `_drinksAckActive`, `_drinksAckCount`, `_dailyFrozenState`, `_drinksFrozenState` to the `shouldUpdate` whitelist with explanatory comment
- [x] Step 3: `yarn run build` — exit 0, 3.8s, no TS errors
- [x] Step 4: Dist grep — `grep -c '_dailyAckActive\|_drinksAckActive\|_dailyAckCount\|_drinksAckCount\|_dailyFrozenState\|_drinksFrozenState' dist/ax-dose-logger-card.js` = 44 (up from 29; whitelist entries compiled in)

### Key decisions
1. **All six ACK/frozen-state props whitelisted** — the timer-expiry `requestUpdate()` now passes `shouldUpdate` because `_dailyAckActive` (and `_dailyAckCount`) are in the whitelist. The render fires, `ackActive` goes `false`, the `keyed()` block renders `nothing`, and the `.ack-flash` div is removed from the DOM. The next press creates a fresh element with a new CSS animation.
2. **Frozen-state props also whitelisted** — `_dailyFrozenState` / `_drinksFrozenState` are set to `null` by the `ACK_INTRO_MS` (240ms) freeze timer's `requestUpdate()`. Without whitelisting, that cleanup render was also suppressed (harmless because the frozen state is only read during the freeze window, but unclean — and now consistent with the ACK timer cleanup).
3. **No panel-level change needed** — the bug was purely in the container's `shouldUpdate` gate; the panel render blocks, `keyed()` usage, CSS, and state machine were all correct.
