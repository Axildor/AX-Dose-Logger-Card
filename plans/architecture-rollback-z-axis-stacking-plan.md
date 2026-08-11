# Plan — Architecture Rollback & Global Z-Axis Stacking Patch (v2.1)

## 1. Problem Statement

The v3 card-root implementation is rejected. Elevating the backdrop to `<ha-card>` destroys the local spatial mapping. A rollback to the v2 localized wrapper architecture is required, coupled with explicit z-index routing to protect adjacent DOM nodes.

The key insight: the glow must bleed outward from behind the button (18px diffusion via `inset: -18px`), but it must bleed **strictly behind** the adjacent UI (card title, stats column, nav bar, chips) — not on top of them. The v2 architecture kept the backdrop localized but the z-index routing was wrong (backdrop `z-index: 0` + button `z-index: 1` but no `isolation` on the wrapper, causing `filter: blur()` stacking-context bleed onto adjacent siblings).

## 2. Architecture — v2 Wrapper with Z-Axis Isolation

### 2.1 Rollback — strip card-root glow from `ax-dose-logger-card.ts`

Remove ALL card-root glow additions:
- Remove `_cardGlowClass()` + `_resolveGlowForState()` helpers
- Remove `_ringDuration()` helper (moved back to panels)
- Remove `RingSpeed` import (no longer used at card root)
- Remove `--btn-*` / `--rgb-btn-*` color token duplication from `:host`
- Remove `class=${this._cardGlowClass()}` + `--ring-duration` from `<ha-card>`
- Remove `<div class="card-glow-backdrop"></div>` from `<ha-card>`
- Remove ALL `.card-glow-backdrop` CSS + `ha-card.glow-{color}` CSS + `@keyframes ax-card-glow-breathe`
- Remove `position: relative` from `ha-card`
- Remove `position: relative; z-index: 1` from `.card-content` + `.pane-selector`
- **KEEP** the `setConfig()` clone + migration guard fixes (those are separate bug fixes, not part of the glow architecture)

### 2.2 Restore v2 wrapper — `daily-panel.ts` + `drinks-panel.ts`

Re-inject the localized wrapper around the button:

```html
<!-- daily-panel.ts -->
<div class="daily-main">
  <div class="take-pill-wrap {glow-class}"
       style="--ring-duration: {duration}"
  >
    <div class="glow-backdrop"></div>
    <button class="take-pill-btn ..."> ... </button>
  </div>
  <div class="stats-column"> ... </div>
</div>
```

Restore the helpers:
- `_takeGlowWrapClass()` / `_logDrinkGlowWrapClass()` — resolve `glow-{color}` or `''`
- `_ringDuration()` — resolve `--ring-duration` from `*_ring_speed` config
- Restore `RingSpeed` import

### 2.3 Stacking Context — the wrapper (KEY FIX)

The wrapper creates a **localized z-axis boundary** so the backdrop's negative z-index can't bleed behind the card background, and the backdrop's `filter: blur()` stacking context stays contained:

```css
.take-pill-wrap {
  position: relative;
  z-index: 0;          /* establish stacking context at wrapper level */
  isolation: isolate;  /* spawn localized z-axis boundary */
  display: flex;
  flex: 1;
}
```

### 2.4 Z-Index Routing — the glow + button

The backdrop uses `z-index: -1` (BEHIND the wrapper's z-index:0 baseline), and the button uses `z-index: 1` (above):

```css
.take-pill-wrap .glow-backdrop {
  position: absolute;
  inset: -18px;
  z-index: -1;          /* behind the wrapper's z-index:0 baseline */
  border-radius: calc(var(--ha-card-border-radius, 12px) + 18px);
  background: var(--glow-color, transparent);
  filter: blur(16px);
  opacity: 0;
  pointer-events: none;
}

.take-pill-btn {
  ...
  position: relative;
  z-index: 1;            /* above the backdrop (z-index:-1) */
}
```

Because the wrapper has `isolation: isolate` + `z-index: 0`, the backdrop's `z-index: -1` is contained within the wrapper's stacking context. It renders behind the wrapper's background (which is transparent) but in front of the card background. The 18px diffusion bleeds outside the wrapper boundary but stays behind adjacent siblings (which have their own `z-index: 1`).

### 2.5 Global Z-Axis Protection — adjacent UI

To ensure the 18px diffusion bleeds strictly **behind** the surrounding interface components regardless of DOM order, elevate the adjacent siblings:

**daily-panel.ts:**
```css
.med-name {
  ...
  position: relative;
  z-index: 1;
}

.stats-column {
  ...
  position: relative;
  z-index: 1;
}

.chips-row {
  ...
  position: relative;
  z-index: 1;
}
```

**drinks-panel.ts:**
```css
.drinks-title {
  ...
  position: relative;
  z-index: 1;
}

.stats-column {
  ...
  position: relative;
  z-index: 1;
}
```

**ax-dose-logger-card.ts** (nav bar — only if needed; since the wrapper isolation contains the backdrop, the nav bar in a different shadow DOM is already protected, but add it for safety):
```css
.pane-selector {
  ...
  position: relative;
  z-index: 1;
}
```

### 2.6 Per-color activation + sandboxed will-change (unchanged from v2)

```css
.take-pill-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
.take-pill-wrap.glow-blue   { --glow-color: rgba(var(--rgb-btn-blue), 0.85); }
.take-pill-wrap.glow-amber  { --glow-color: rgba(var(--rgb-btn-amber), 0.85); }
.take-pill-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }

.take-pill-wrap.glow-red .glow-backdrop,
.take-pill-wrap.glow-blue .glow-backdrop,
.take-pill-wrap.glow-amber .glow-backdrop,
.take-pill-wrap.glow-green .glow-backdrop {
  opacity: 0.6;
  will-change: opacity;
  animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
}

@keyframes ax-btn-glow-breathe {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.85; }
}
```

### 2.7 Drinks panel mirror

`.log-drink-wrap` gets the same `isolation: isolate` + `z-index: 0` treatment. The glow-backdrop gets `z-index: -1`. The button gets `z-index: 1`. The `.drinks-title` + `.stats-column` get `z-index: 1`.

## 3. Files to Modify

1. **`src/ax-dose-logger-card.ts`**
   - Strip ALL glow logic: `_cardGlowClass()`, `_resolveGlowForState()`, `_ringDuration()`, `RingSpeed` import, `--btn-*` / `--rgb-btn-*` from `:host`, `class` + `--ring-duration` on `<ha-card>`, `<div class="card-glow-backdrop">`, all `.card-glow-backdrop` CSS, `ha-card.glow-{color}` CSS, `@keyframes ax-card-glow-breathe`, `position: relative` on `ha-card`, `z-index: 1` on `.card-content` + `.pane-selector`
   - **KEEP** `setConfig()` clone + migration guard (separate bug fix)
   - **KEEP** `z-index: 1` on `.pane-selector` (global z-axis protection)

2. **`src/components/daily-panel.ts`**
   - Restore `_takeGlowWrapClass()` + `_ringDuration()` helpers, `RingSpeed` import
   - Restore template: `.take-pill-wrap` wrapper + `<div class="glow-backdrop">`
   - CSS: `.take-pill-wrap` with `isolation: isolate` + `z-index: 0`; `.glow-backdrop` with `z-index: -1`; button `z-index: 1`; per-color tokens; active-glow selector (sandboxed will-change); `@keyframes ax-btn-glow-breathe`
   - CSS: `position: relative; z-index: 1` on `.med-name`, `.stats-column`, `.chips-row`

3. **`src/components/drinks-panel.ts`**
   - Mirror: restore `_logDrinkGlowWrapClass()` + `_ringDuration()`, `RingSpeed` import
   - Restore template: `.log-drink-wrap` + `<div class="glow-backdrop">`
   - CSS: `.log-drink-wrap` with `isolation: isolate` + `z-index: 0`; `.glow-backdrop` with `z-index: -1`; button `z-index: 1`; per-color tokens; active-glow selector; keyframe
   - CSS: `position: relative; z-index: 1` on `.drinks-title`, `.stats-column`

## 4. Verification

- `yarn run build` — exit 0, no TS errors
- Dist grep: `take-pill-wrap` present, `log-drink-wrap` present, `card-glow-backdrop` absent, `ax-card-glow-breathe` absent, `ax-btn-glow-breathe` present, `isolation: isolate` present (×2), `will-change: opacity` present (×2, one per panel, both in active glow selectors)
- Visual: glow bleeds outward from behind the button, behind adjacent UI (title, stats, chips, nav bar)
- Visual: glow does NOT render on top of the button or adjacent UI

## 5. Memory Bank Updates (post-verification)

- **activeContext.md** — new Current Status: Architecture Rollback & Z-Axis Stacking Patch
- **progress.md** — new feature section
- **README.md** — no change needed (glow description unchanged)

## 6. Key Design Decisions

1. **Rollback to v2 wrapper** — the card-root approach destroyed local spatial mapping. The wrapper keeps the glow localized to the button area.
2. **`isolation: isolate` on the wrapper** — spawns a localized z-axis boundary so the backdrop's `z-index: -1` can't bleed behind the card background. Without `isolation`, `z-index: -1` on a child of a `z-index: 0` element would render behind the parent's parent (the card background).
3. **`z-index: -1` on the backdrop** — renders behind the wrapper's baseline (z-index: 0) but in front of the card background (because the wrapper's `isolation: isolate` contains the z-axis). The 18px diffusion bleeds outside the wrapper but stays behind adjacent siblings (which have `z-index: 1`).
4. **`z-index: 1` on adjacent UI** — the card title, stats column, chips row, and nav bar all get `position: relative; z-index: 1` so the 18px diffusion bleeds behind them, not on top. This is the "global z-axis protection" that ensures the glow stays behind surrounding UI regardless of DOM order.
5. **VRAM retention** — `will-change: opacity` stays sandboxed inside the active `.glow-{color} .glow-backdrop` selector. No VRAM leak for non-glow states.
6. **No CPU overhead from `isolation: isolate`** — it's a one-time compositor hint, not a per-frame operation. Same category as `will-change` (compositor-only).
7. **Keep `setConfig()` clone + migration guard** — those are separate bug fixes (frozen-config crash), not part of the glow architecture.