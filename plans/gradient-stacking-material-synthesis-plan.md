# Gradient Stacking — Material Synthesis (v2 Surface Patch)

**Date:** 2026-08-11
**Scope:** Frontend card only (`/workspaces/lovelace-pill-logger-card/src/components/`)
**Type:** CSS-only surface-material patch (no DOM, no JS, no render-pipeline change)
**Supersedes:** [`plans/alpha-channel-solidification-plan.md`](alpha-channel-solidification-plan.md) (the `color-mix()` approach — abandoned due to HA's raw RGB triplet variables)

---

## Why `color-mix()` Failed

The prior patch ([`alpha-channel-solidification-plan.md`](alpha-channel-solidification-plan.md)) replaced every translucent `rgba(...,0.12)` fill with:

```css
background: color-mix(in srgb, var(--rgb-primary-color, #03a9f4) 12%, var(--card-background-color, ...));
```

**Root cause of failure:** Home Assistant's `--rgb-primary-color` is a **raw RGB triplet** (e.g., `3, 169, 244`), NOT a `<color>` value. The `#03a9f4` literal in `var(--rgb-primary-color, #03a9f4)` is a *fallback* — it only fires when the custom property is **undefined**, not when it resolves to an unparseable value. Since HA *defines* `--rgb-primary-color`, the `#03a9f4` fallback never engages; `color-mix()` receives `3, 169, 244` as its first operand, which is not a valid `<color>` → the entire declaration is invalid and discarded → **invisible elements** (no background at all).

This affected all 11 solidified selector groups in `daily-panel.ts` and `drinks-panel.ts` that consumed `--rgb-primary-color` or `--ax-btn-surface`. The `.full-*` states (which used `var(--btn-red)` etc. — valid hex) compiled fine, but the primary-tint surfaces (idle/icon/border/ring/style-none + stat-pill + chip) went invisible.

**Note:** The `.full-*` rules used `--btn-red`/`--btn-blue`/`--btn-amber`/`--btn-green` which ARE valid hex colors (`#db4437`, `#03a9f4`, `#f5a623`, `#43a047`) defined in `:host`. These `color-mix()` calls *did* parse. But they are being removed too for architectural consistency and to eliminate the `color-mix()` dependency entirely (universal WebView fallback).

---

## Architecture Principle — Gradient Stacking

> **`background-image` composites over `background-color`. The browser paints the
> opaque base layer first, then the translucent tint layer on top — yielding a
> 100% opaque element whose tint is perceptually identical to the prior
> `rgba(...,0.12)` over the card background, but which cannot transmit the
> ambilight backlight.**

Every solidified surface becomes a **two-layer background stack**:

```css
background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));   /* Base — opaque wall */
background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));  /* Tint — flat translucent overlay */
```

**Why this works where `color-mix()` failed:**
1. `rgba(var(--rgb-primary-color, 3, 169, 244), 0.12)` is the **exact original syntax** the component used prior to v2.1. HA's `--rgb-primary-color` triplet is designed for `rgba()` — it IS valid there. No parsing failure.
2. `background-color` + `background-image` are separate properties. The browser composites the gradient image over the solid color. The element is fully opaque (base layer alpha = 1.0), so the backlight cannot transmit.
3. `linear-gradient(c, c)` with identical stops produces a **flat** color — visually a solid tint, not a gradient. This is the standard "flat tint via gradient" trick.
4. Universally supported — no `color-mix()` (Chromium 111+) dependency. Natively satisfies legacy WebView fallback requirements (Android System WebView, older Chromium).

**Perceptual identity:** The prior `rgba(...,0.12)` over the card background produced tint `T`. The new stack produces `card-bg` (opaque) with `rgba(...,0.12)` composited on top = the same `T`, but with alpha 1.0. Identical visual, opaque result.

---

## State-Color Surfaces (`.full-*`)

These previously used `rgba(var(--rgb-btn-{color}), 0.12)`. The `--rgb-btn-*` tokens are also raw triplets (e.g., `--rgb-btn-red: var(--rgb-error-color, 219, 68, 55)`), so `rgba()` works natively. The two-layer stack becomes:

```css
background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));
```

Identity color preserved at the tint level; fill is opaque.

---

## Token Purge

The `--ax-btn-surface` and `--ax-btn-surface-hover` custom-property tokens (declared in `:host` of both panels) are **removed entirely**. They were `color-mix()` expressions that fail on HA's triplet vars. The gradient-stack surfaces are written inline per selector (each references its own tint source: `--rgb-primary-color` for idle/icon/border/ring/style-none, `--rgb-btn-{color}` for `.full-*`). Inline is chosen over tokens because:

1. The gradient syntax is short enough not to warrant a token.
2. A token would need to encode the tint source + percentage — different per state (12% idle, 20% hover, 6% stat-pill, 5% chip). A single token can't represent all of them.
3. Eliminates a layer of indirection that made the `color-mix()` failure invisible until runtime.

---

## Patch Map

### A. `src/components/daily-panel.ts`

| # | Selector (approx line) | Current (`color-mix`) | New (gradient stack) |
|---|---|---|---|
| 1 | `:host` `--ax-btn-surface` + `--ax-btn-surface-hover` (L570-579) | token defs | **DELETE** the two token lines + their comment block |
| 2 | `.take-pill-btn:not(...)` idle (L584-586) | `background: var(--ax-btn-surface)` | `background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));` |
| 3 | `.take-pill-btn:not(...):hover` (L588-590) | `background: var(--ax-btn-surface-hover)` | same with `0.2` alpha |
| 4 | `.full-red` + hover (L594-595) | `color-mix(... var(--btn-red) 12%/20% ...)` | `background-color: ...card-bg...; background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));` + hover `0.2` |
| 5 | `.full-blue` + hover (L596-597) | `color-mix(... var(--btn-blue) ...)` | same with `--rgb-btn-blue` |
| 6 | `.full-amber` + hover (L598-599) | `color-mix(... var(--btn-amber) ...)` | same with `--rgb-btn-amber` |
| 7 | `.full-green` + hover (L600-601) | `color-mix(... var(--btn-green) ...)` | same with `--rgb-btn-green` |
| 8 | `.icon-*` group (L614-617) | `background: var(--ax-btn-surface)` | gradient stack with `--rgb-primary-color` `0.12` |
| 9 | `.icon-*:hover` group (L619-622) | `background: var(--ax-btn-surface-hover)` | gradient stack with `0.2` |
| 10 | `.border-*` group (L630-633) | `background: var(--ax-btn-surface)` | gradient stack with `0.12` |
| 11 | `.ring-*` base (L648-650) | `background: var(--ax-btn-surface)` | gradient stack with `0.12` |
| 12 | `.style-none` (L748-749) | `background: var(--ax-btn-surface)` | gradient stack with `0.12` |
| 13 | `.stat-pill` (L893-894) | `color-mix(... 6% ...)` | `background-color: ...card-bg...; background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.06), rgba(var(--rgb-primary-color, 3, 169, 244), 0.06));` |
| 14 | `.stat-pill.clickable:hover` (L934-935) | `color-mix(... 12% ...)` | gradient stack with `0.12` |
| 15 | `.chip` (L962-963) | `color-mix(... 5% ...)` | gradient stack with `0.05` |
| 16 | `.chip.clickable:hover` (L980-981) | `color-mix(... 12% ...)` | gradient stack with `0.12` |

### B. `src/components/drinks-panel.ts`

Mirror the same 16 patches (drinks has `.full-red` + `.full-green` only, no blue/amber):

| # | Selector (approx line) | Current | New |
|---|---|---|---|
| 1 | `:host` `--ax-btn-surface` tokens (L508-517) | token defs | **DELETE** |
| 2-3 | `.log-drink-btn:not(...)` idle/hover (L522-527) | `var(--ax-btn-surface)` | gradient stack `0.12`/`0.2` |
| 4 | `.full-red` + hover (L532-533) | `color-mix` | gradient stack `--rgb-btn-red` `0.12`/`0.2` |
| 5 | `.full-green` + hover (L534-535) | `color-mix` | gradient stack `--rgb-btn-green` `0.12`/`0.2` |
| 6 | `.icon-*` group (L544-546) | `var(--ax-btn-surface)` | gradient stack `0.12` |
| 7 | `.icon-*:hover` (L548-550) | `var(--ax-btn-surface-hover)` | gradient stack `0.2` |
| 8 | `.border-*` group (L554-556) | `var(--ax-btn-surface)` | gradient stack `0.12` |
| 9 | `.ring-*` base (L572-574) | `var(--ax-btn-surface)` | gradient stack `0.12` |
| 10 | `.style-none` (L652-653) | `var(--ax-btn-surface)` | gradient stack `0.12` |
| 11 | `.stat-pill` (L801-802) | `color-mix 6%` | gradient stack `0.06` |
| 12 | `.stat-pill.clickable:hover` (L814-815) | `color-mix 12%` | gradient stack `0.12` |
| 13 | `.chip` (L876-877) | `color-mix 5%` | gradient stack `0.05` |
| 14 | `.chip.clickable:hover` (L894-895) | `color-mix 12%` | gradient stack `0.12` |

---

## Hardware Engine Preservation (Untouched)

The render pipeline is explicitly protected — NO changes to:

- `.glow-backdrop` — `inset:-18px`, `filter:blur(16px)`, `opacity`, `will-change`, `@keyframes ax-btn-glow-breathe`
- `.take-pill-wrap` / `.log-drink-wrap` — `isolation:isolate`, `z-index:0`, `position:relative`
- Button `z-index:1`, backdrop `z-index:-1`, `> ha-ripple z-index:3`
- `.stats-column` / `.chips-row` / `.med-name` / `.drinks-title` `z-index:1` (NO `overflow:hidden` — glow must bleed freely)
- `--glow-color` tokens (`.glow-red`, `.glow-blue`, `.glow-amber`, `.glow-green`) — MUST stay translucent for the ambilight falloff
- `.ack-flash` overlay (already opaque `#212c22` — already correct)
- The `color-mix()` calls in `.ring-track::before` conic-gradient shimmers (L685-688 daily, L609-610 drinks) — these use `color-mix(in srgb, var(--btn-*) 60%, #fff)` where `--btn-*` IS a valid hex, so they parse correctly. They are shimmer effects on the ring track, not surface fills. **Kept as-is** (out of scope; not a surface-material declaration).

---

## Transition Behavior Note

`.take-pill-btn` and `.log-drink-btn` declare `transition: background 0.2s, box-shadow 0.2s` (daily L503, drinks L457). The `background` shorthand transitions `background-color` AND `background-image`. `background-image` (gradient) transitions are not interpolatable in most browsers — they snap. This means hover state changes will snap the tint rather than cross-fade smoothly.

**Acceptable because:**
1. The prior `rgba()` approach also used the `background` shorthand and had the same snap behavior (rgba-over-solid is also a `background` swap, not animatable).
2. The `background-color` (base layer) DOES transition smoothly (it's `--card-background-color` → same value on hover, so no visible change), and the tint snap is instantaneous/subtle.
3. This is not a regression — it matches the pre-v2.1 behavior the user is asking us to restore.

No `transition` declaration changes are needed.

---

## Edge Cases & Safeguards

1. **`state-ack` overlay** — `.ack-flash` paints opaque `#212c22`. Already correct. Untouched.
2. **`.style-none` "theme default"** — semantically "no color override" but still needs the opaque base + tint to occlude the backlight. The gradient stack preserves the visual tint while making the fill opaque. Semantic preserved at the visual level.
3. **Light theme** — `var(--card-background-color)` resolves to a light surface; `rgba(primary, 0.12)` over it yields the same perceptual tint as before. No light-mode regression.
4. **Legacy WebView** — `linear-gradient()` + `rgba()` + `background-color` are all supported in Chromium 40+ (Android WebView). No `color-mix()` (Chromium 111+) dependency. Natively satisfies the legacy WebView fallback requirement.
5. **Glow bleed preservation** — NO `overflow:hidden` on `.stats-column` / `.chips-row`. The 18px outward diffusion still reads as outer light in the gutters. Opaque surfaces occlude the glow *where painted*; glow still shows around them.
6. **Other panels untouched** — tools/inventory/graphs/stats/tracking have no `.glow-backdrop`, use `rgba(...)` natively, don't need solidification.

---

## Verification

1. `yarn run build` clean (exit 0) in `/workspaces/lovelace-pill-logger-card`
2. Dist token grep:
   - `color-mix` count **drops** (the surface-material `color-mix` calls removed; the 4 `ring-track::before` shimmer `color-mix` calls remain → expect ~4, down from ~38)
   - `ax-btn-surface` count = **0** (tokens fully purged)
   - `linear-gradient(rgba(var(--rgb-primary-color` count **rises** (the new tint layers)
   - `background-color: var(--card-background-color` count **rises** (the new base layers)
   - Render-pipeline tokens preserved: `will-change: opacity` ×2, `inset:-18px` ×5, `filter:blur(16px)` ×2, `isolation:isolate` ×5, `glow-backdrop` ×18
3. Visual: enable Ambilight Glow on Take Pill + Log Drink. Confirm:
   - Elements are **visible** (the `color-mix()` invisibility bug is fixed)
   - Glow still bleeds 18px outward into gutters (render pipeline intact)
   - Button face no longer shows glow tinting through (occluded)
   - `.stat-pill` + `.chip` no longer tint with glow color
   - Hover still darkens perceptually
   - `.full-*` / `.icon-*` / `.border-*` state styles read as their identity color
   - `.ack-flash` "Logged" green overlay renders identically (untouched)

---

## Memory Bank Updates

- `memory-bank/activeContext.md` — Current Status → Gradient Stacking Material Synthesis; archive the failed `color-mix()` Alpha Channel Solidification block under Previous Context.
- `memory-bank/progress.md` — append "Gradient Stacking — Material Synthesis" section.
- `README.md` — NO change (internal CSS-only surface-material patch, no end-user UX/config change).
- `memory-bank/projectstructure.md` — NO change (no files added/renamed/deleted).