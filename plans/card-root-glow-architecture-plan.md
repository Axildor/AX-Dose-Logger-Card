# Plan — Card-Root Ambilight Glow (Behind Entire Card)

## 1. Problem Statement

The current Ambilight Glow implementation wraps the button in `.take-pill-wrap` / `.log-drink-wrap` and injects `.glow-backdrop` as a sibling of the button inside that wrapper. This confines the glow to just behind the button.

**User requirement:** The glow should render behind the ENTIRE card — the right-side stat boxes, custom chip boxes, navigation bar, and title. "Basically behind everything."

Additionally, the current implementation has a z-index stacking bug (glow renders on top of the button instead of behind it).

## 2. Architecture — Move Backdrop to Card Root

### 2.1 DOM structure — backdrop as first child of `<ha-card>`

The glow backdrop moves from the panel-level wrapper to the **card root** (`ax-dose-logger-card.ts` render), becoming the first child of `<ha-card>` (or `.card-content`), positioned absolutely behind all content.

```
<ha-card style="...">
  <div class="card-glow-backdrop"></div>   ← NEW: root-level backdrop
  <div class="card-content">
    <ax-dose-daily-panel> ... </ax-dose-daily-panel>
  </div>
  ${pane-selector}                          ← nav bar
  ${dialogs}
</ha-card>
```

The backdrop is `position: absolute; inset: 0` (fills the entire `ha-card`), behind all content via `z-index: 0`. All existing content gets `position: relative; z-index: 1` (or the content already stacks above due to the backdrop's low z-index).

### 2.2 CSS — root-level backdrop

```css
/* Root-level glow backdrop — behind ALL card content.
   Positioned absolutely inside ha-card (which has overflow:hidden,
   position:relative by default for ha-card). The backdrop fills
   the entire card area; the static filter:blur(16px) produces the
   ambilight falloff; opacity-only breathing animation is GPU-composited.
   will-change is sandboxed inside the active glow-color selector. */
ha-card {
  position: relative;  /* establish containing block for the backdrop */
}

.card-glow-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--ha-card-border-radius, 12px);
  background: var(--card-glow-color, transparent);
  filter: blur(16px);
  opacity: 0;
  pointer-events: none;
  /* will-change OMITTED from base — sandboxed in active selector. */
}

/* Per-color activation — set on the <ha-card> itself. */
ha-card.glow-red    { --card-glow-color: rgba(var(--rgb-btn-red), 0.85); }
ha-card.glow-blue   { --card-glow-color: rgba(var(--rgb-btn-blue), 0.85); }
ha-card.glow-amber  { --card-glow-color: rgba(var(--rgb-btn-amber), 0.85); }
ha-card.glow-green  { --card-glow-color: rgba(var(--rgb-btn-green), 0.85); }

/* Active-glow selector: animation + will-change scoped here ONLY. */
ha-card.glow-red .card-glow-backdrop,
ha-card.glow-blue .card-glow-backdrop,
ha-card.glow-amber .card-glow-backdrop,
ha-card.glow-green .card-glow-backdrop {
  opacity: 0.6;
  will-change: opacity;
  animation: ax-card-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
}

@keyframes ax-card-glow-breathe {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.85; }
}
```

### 2.3 Glow class resolution — card root level

The card root (`ax-dose-logger-card.ts`) already computes the button state (`_computeDailyButtonState` / `_computeDrinksButtonState`) and passes it to the panel. A new helper at the card root resolves the glow class from the button state + per-state style config, mirroring the panel's `_takeGlowWrapClass` / `_logDrinkGlowWrapClass`:

```typescript
private _cardGlowClass(): string {
  // Only the daily and drinks panes have button states with glow support.
  // Other panes (graphs, stats, tools, tracking, inventory) have no button
  // state → no glow.
  if (this._activePane === 'daily') {
    const state = this._computeDailyButtonState(this._resolveEntities());
    return this._resolveGlowForState(state, 'take_button');
  } else if (this._activePane === 'drinks') {
    const state = this._computeDrinksButtonState(this._resolveEntities());
    return this._resolveGlowForState(state, 'drink_button');
  }
  return '';
}

private _resolveGlowForState(state: ButtonState, prefix: 'take_button' | 'drink_button'): string {
  let style: ButtonStateStyle = 'none';
  if (prefix === 'take_button') {
    if (state === 'lockout' || state === 'limit_24h') {
      style = this.config?.take_button_lockout_style ?? 'full';
      if (style === 'auto') style = 'full';
    } else if (state === 'execution') {
      style = this.config?.take_button_execution_style ?? 'none';
      if (style === 'auto') style = 'none';
    } else if (state === 'latency') {
      style = this.config?.take_button_latency_style ?? 'border';
      if (style === 'auto') style = 'border';
    } else {
      return ''; // idle — no glow
    }
  } else {
    if (state === 'lockout') {
      style = this.config?.drink_button_lockout_style ?? 'full';
      if (style === 'auto') style = 'full';
    } else {
      return ''; // idle — no glow
    }
  }
  if (style !== 'glow') return '';
  const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
    : state === 'execution' ? 'blue'
    : state === 'latency' ? 'amber' : 'green';
  return `glow-${color}`;
}
```

The `ha-card` element gets the glow class + `--ring-duration` style:
```typescript
<ha-card
  class=${this._cardGlowClass()}
  style="${this._getColorOverrides()}; --ring-duration: ${this._ringDuration()}; ..."
>
  <div class="card-glow-backdrop"></div>
  <div class="card-content"> ... </div>
  ...
</ha-card>
```

### 2.4 Removal — panel-level wrapper + backdrop

The panel-level `.take-pill-wrap` / `.log-drink-wrap` wrapper and `<div class="glow-backdrop">` are **removed** from `daily-panel.ts` and `drinks-panel.ts`. The button goes back to being a direct child of `.daily-main` (its original position), restoring the pre-glow flex layout.

The `_takeGlowWrapClass()` / `_logDrinkGlowWrapClass()` helpers are **removed** from the panels (their logic moves to the card root's `_cardGlowClass()`).

The `_takeButtonClasses()` / `_logDrinkButtonClasses()` helpers **keep** the `style === 'glow' → push 'style-none'` branch (the button face stays theme-tinted; the glow is now rendered at the card root, not the wrapper).

The `--ring-duration` inline style moves from the wrapper to the `ha-card` element.

### 2.5 z-index / stacking — root level

`ha-card` already has `overflow: hidden` — but the backdrop is INSIDE `ha-card` at `inset: 0`, so it fills the card and the `overflow: hidden` clips it to the card boundary (which is what we want — the glow bleeds to the card edges but not beyond).

`ha-card` needs `position: relative` to establish the containing block for the absolutely-positioned backdrop. HA's `ha-card` already has `position: relative` by default (from HA's card styles), but we add it explicitly to be safe.

All content inside `ha-card` (`.card-content`, `.pane-selector`, dialogs) needs to stack above the backdrop (z-index: 0). Since these are positioned elements or have natural stacking, adding `position: relative; z-index: 1` to `.card-content` and `.pane-selector` ensures they sit above the backdrop.

### 2.6 VRAM — will-change sandboxing preserved

The `will-change: opacity` remains sandboxed inside the active `ha-card.glow-{color} .card-glow-backdrop` selector. When no glow class is on `ha-card`, the backdrop is `opacity: 0` + no animation + no will-change → zero GPU layer cost.

### 2.7 Breathing speed — `--ring-duration` on `ha-card`

The `--ring-duration` CSS var (from `_ringDuration()`) is set on the `ha-card` element alongside the existing `_getColorOverrides()` inline style. The backdrop inherits it from the `ha-card` context.

### 2.8 Multi-button consideration — daily has Take Pill, drinks has Log Drink

Only ONE button state is active at a time per pane (daily pane → daily button state; drinks pane → drinks button state). The card root resolves the glow class based on the active pane's button state. There is no conflict — only one glow color is active at a time.

## 3. Files to Modify

1. **`src/ax-dose-logger-card.ts`**
   - Add `_cardGlowClass()` + `_resolveGlowForState()` helpers
   - Add `_ringDuration()` helper (or reuse if it already exists at the card root — check; it may be in the panels only)
   - Template: add `class=${this._cardGlowClass()}` + `--ring-duration` to `<ha-card>`, inject `<div class="card-glow-backdrop"></div>` as first child
   - CSS: add `.card-glow-backdrop` base, per-color `ha-card.glow-{color}` tokens, active-glow selector (sandboxed will-change + animation), `@keyframes ax-card-glow-breathe`, `position: relative` on `ha-card`, `position: relative; z-index: 1` on `.card-content` + `.pane-selector`

2. **`src/components/daily-panel.ts`**
   - Remove `_takeGlowWrapClass()` helper
   - Remove `.take-pill-wrap` wrapper from template — button goes back to direct child of `.daily-main`
   - Remove `.glow-backdrop` div from template
   - Remove `.take-pill-wrap` CSS + `.take-pill-wrap .glow-backdrop` CSS + per-color tokens + active-glow selector + `@keyframes ax-btn-glow-breathe`
   - Remove `z-index: 1` from `.take-pill-btn` (no longer needs to stack above a backdrop sibling)
   - Keep `style === 'glow' → push 'style-none'` in `_takeButtonClasses()`

3. **`src/components/drinks-panel.ts`**
   - Mirror: remove `_logDrinkGlowWrapClass()`, `.log-drink-wrap` wrapper, `.glow-backdrop` div, glow CSS, `z-index: 1` from `.log-drink-btn`
   - Keep `style === 'glow' → push 'style-none'` in `_logDrinkButtonClasses()`

## 4. Verification

- `yarn run build` — exit 0, no TS errors
- Dist grep: `card-glow-backdrop` present, `take-pill-wrap` absent (removed), `glow-backdrop` absent in panels (only card root)
- `will-change: opacity` exactly ×1 (only in the active glow selector at card root)
- Visual: glow renders behind the entire card (button, stat boxes, chips, nav bar)
- Visual: glow does NOT render on top of the button
- Visual: button face stays theme-tinted (style-none) when glow is active

## 5. Memory Bank / README Updates (post-verification)

- **activeContext.md** — new Current Status: Card-Root Glow Architecture
- **progress.md** — new feature section
- **README.md** — update the Ambilight Glow description to note it now radiates behind the entire card
- No `projectstructure.md` change (no files added/renamed/deleted)

## 6. Key Design Decisions

1. **Backdrop at card root, not panel level** — the user wants the glow behind everything (stat boxes, nav bar, title, custom boxes). Only the card root (`<ha-card>`) contains all of these. The panel-level wrapper only contained the button.
2. **`ha-card` gets the glow class** — the glow-{color} class goes on `<ha-card>` (the containing element), and the backdrop reads `--card-glow-color` from it. This mirrors the panel-level pattern but at the root.
3. **`overflow: hidden` on `ha-card` clips the glow** — unlike the panel wrapper (which needed no overflow:hidden so the glow could bleed beyond the button), the card root WANTS the glow clipped to the card boundary. `ha-card` already has `overflow: hidden`.
4. **`isolation: isolate` NOT needed** — at the card root, the backdrop is the first child with `z-index: 0`, and all content stacks above it naturally. The `filter: blur()` stacking-context issue from the panel level doesn't apply here because the backdrop and content are not competing siblings inside a flex container — the backdrop is absolutely positioned and content is in normal flow.
5. **`--ring-duration` moves to `ha-card`** — the breathing cadence var is set on the `ha-card` inline style alongside the existing color overrides.
6. **Panel wrappers removed** — `.take-pill-wrap` / `.log-drink-wrap` are no longer needed. The button returns to its original position as a direct child of `.daily-main`. This simplifies the layout and removes the flex-child-replacement complexity.
7. **`_takeButtonClasses` / `_logDrinkButtonClasses` unchanged for glow** — they still push `style-none` for the `glow` style (button face stays theme-tinted). The glow is purely a card-root backlight.