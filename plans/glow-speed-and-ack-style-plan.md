# Plan — Glow Speed Dropdown + ACK (Logged) Style Rework

**Date:** 2026-08-09
**Scope:** Frontend only (`/workspaces/lovelace-pill-logger-card/`)
**Status:** Draft — pending user approval

---

## 1. Problem Statement (4 user requests)

| # | Request | Root Cause |
|---|---------|------------|
| 1 | Border glow speeds up at corners, not steady | Inherent to rotating a `conic-gradient` around a non-circular shape — the gradient sweeps angle at a constant rate, but the rounded-rect perimeter packs more angle into less arc at the corners. **User decision: keep the conic-gradient sweep look; accept the variation; current 2.2s = "fast".** |
| 2 | Add a glow-speed dropdown (slow / medium / fast) at the bottom of the button settings | The animation duration `2.2s` is hardcoded in two `@keyframes` animation rules. Needs a configurable CSS var. |
| 3 | Remove the "Logged Icon Pulse" config — it does nothing | `take_button_ack_pulse` / `drink_button_ack_pulse` are defined in types + editor + localize but **never read** by `_takeButtonClasses()` / `_logDrinkButtonClasses()`. The ACK overlay is a `::after` flash, not an icon pulse. Dead config. |
| 4 | "Logged Style" dropdown's 7 options don't change anything; replace with 3 own options + use `mdi:check-bold` | `take_button_ack_style` / `drink_button_ack_style` use `_buttonStyleOptions()` (7 options) but are **never read** — the ACK is a fixed `::after` overlay. Dead config. Need 3 real layout options. |

---

## 2. Architecture Changes

### 2.1 Glow Speed Dropdown (slow / medium / fast)

**New config fields** (per-button, inside `take_button_box` and `drink_button_box`):
```typescript
// types.ts — AxDoseLoggerCardConfig
take_button_glow_speed?: 'slow' | 'medium' | 'fast';   // default 'fast'
drink_button_glow_speed?: 'slow' | 'medium' | 'fast';  // default 'fast'
```

**Speed mapping:**
| Setting | Duration | Notes |
|---------|----------|-------|
| `fast` | `2.2s` | Current hardcoded value — the baseline the user sees now |
| `medium` | `4s` | ~1.8× slower |
| `slow` | `6s` | ~2.7× slower |

**Implementation — CSS var, not duplicate keyframes:**
- Both panels' `.glow-track::before` animation rule changes from a hardcoded `2.2s` to `var(--glow-duration, 2.2s)`:
  ```css
  .take-pill-btn .glow-track::before {
    animation: ax-btn-glow-sweep var(--glow-duration, 2.2s) linear infinite;
  }
  ```
- The panel sets the CSS var inline on the button (alongside the existing `--ack-duration` / `--ack-text` inline style), read from config:
  ```typescript
  // daily-panel.ts render()
  style=${`--glow-duration: ${this._glowDuration()};${this.ackActive ? `--ack-duration: ...; --ack-layout: ...;` : ''}`}
  ```
- A `_glowDuration()` helper maps the config string → seconds string:
  ```typescript
  private _glowDuration(): string {
    const speed = this.controller.config?.take_button_glow_speed ?? 'fast';
    return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
  }
  ```
- The `--glow-duration` var is always set (not gated on a glow state class) so it's ready when the state transitions to a glow state; harmless when no glow class is active (the `::before` has no background).

**Editor schema** — added at the bottom of both `take_button_box` and `drink_button_box` expandables:
```typescript
{
  name: 'take_button_glow_speed',
  selector: {
    select: {
      options: [
        { value: 'slow', label: localize('en', 'glow_speed.slow') },
        { value: 'medium', label: localize('en', 'glow_speed.medium') },
        { value: 'fast', label: localize('en', 'glow_speed.fast') },
      ],
    },
  },
},
```

**New localize keys:**
```typescript
'glow_speed.slow': 'Slow',
'glow_speed.medium': 'Medium',
'glow_speed.fast': 'Fast',
'config.take_button_glow_speed': 'Rotating Glow Speed',
'config.drink_button_glow_speed': 'Rotating Glow Speed',
'config.helper.take_button_glow_speed': 'Speed of the rotating border glow animation. Default: Fast.',
'config.helper.drink_button_glow_speed': 'Speed of the rotating border glow animation. Default: Fast.',
```

---

### 2.2 Remove "Logged Icon Pulse" (dead config)

**Delete from `types.ts`:**
- `take_button_ack_pulse?: boolean;`
- `drink_button_ack_pulse?: boolean;`

**Delete from `ax-dose-logger-editor.ts`:**
- The `{ name: 'take_button_ack_pulse', selector: { boolean: {} } }` schema node (inside `take_button_box`)
- The `{ name: 'drink_button_ack_pulse', selector: { boolean: {} } }` schema node (inside `drink_button_box`)

**Delete from `localize.ts`:**
- `'config.take_button_ack_pulse': 'Logged Icon Pulse',`
- `'config.drink_button_ack_pulse': 'Logged Icon Pulse',`
- `'config.helper.take_button_ack_pulse': ...`
- `'config.helper.drink_button_ack_pulse': ...`

**No panel code change needed** — `_takeButtonClasses()` / `_logDrinkButtonClasses()` never read these fields.

---

### 2.3 Replace "Logged Style" with 3 ACK Layout Options + `mdi:check-bold`

#### 2.3.1 New config type
```typescript
// types.ts
export type AckLayout = 'top' | 'inline' | 'big';

// AxDoseLoggerCardConfig — replace ack_style fields:
take_button_ack_layout?: AckLayout;   // default 'top'
drink_button_ack_layout?: AckLayout;  // default 'top'
```

#### 2.3.2 The 3 layouts

| Option | Internal | Visual | Description |
|--------|----------|--------|-------------|
| 1 | `top` | icon (top) → "Logged" text (below) | Mirrors the normal button layout (icon-over-label vertical stack). **Default.** |
| 2 | `inline` | `✓ Logged` on one centered line | What the current `::after` does — check + text horizontally. |
| 3 | `big` | Large check icon only, no text | A single big `mdi:check-bold`, centered. |

#### 2.3.3 Architecture shift — real `<ha-icon>` in template, not CSS `::after`

The current ACK is a `::after` pseudo-element with `content: '✓ ' var(--ack-text)`. A pseudo-element cannot render a real `<ha-icon>` (Lit components need to be in the template). So:

**Replace the `::after` overlay with a real `<div class="ack-flash">` element in the button template** (conditionally rendered when `this.ackActive` is true), containing:
- A `<ha-icon icon="mdi:check-bold">` (always, in all 3 layouts)
- A `<span class="ack-text">Logged</span>` (only in `top` and `inline` layouts; omitted in `big`)

```typescript
// daily-panel.ts — button template
<button class=${this._takeButtonClasses()}
  style=${this.ackActive
    ? `--ack-duration: ${...}ms; --ack-layout: '${this._ackLayout()}';`
    : `--glow-duration: ${this._glowDuration()};`}
  ...>
  <div class="glow-track"></div>
  <ha-icon icon="${...}"></ha-icon>
  <span class="take-label">...</span>
  <span class="take-sub">...</span>
  ${this.ackActive ? html`
    <div class="ack-flash ack-${this._ackLayout()}">
      <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
      ${this._ackLayout() !== 'big' ? html`<span class="ack-text">${localize(this._lang, 'button.ack_text')}</span>` : nothing}
    </div>
  ` : nothing}
</button>
```

**`_ackLayout()` helper:**
```typescript
private _ackLayout(): AckLayout {
  return this.controller.config?.take_button_ack_layout ?? 'top';
}
```

**Note on `--glow-duration`:** Set it always (even when not in ACK flash) so the glow works in non-ACK states. The inline style will combine both:
```typescript
style=${[
  `--glow-duration: ${this._glowDuration()}`,
  this.ackActive ? `--ack-duration: ${...}ms` : '',
].filter(Boolean).join('; ')}
```

#### 2.3.4 CSS — 3 layout classes

```css
/* Base ack-flash overlay — replaces the old ::after rule. */
.ack-flash {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--btn-green);
  color: #fff;
  border-radius: inherit;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  animation: ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
}

/* Option 1 — Top tick mark and text (default; mirrors button layout). */
.ack-top {
  flex-direction: column;
  gap: 4px;
}
.ack-top .ack-icon { --mdc-icon-size: 28px; }
.ack-top .ack-text {
  font-size: calc(18px + var(--pill-text-offset, 0px));
  font-weight: 600;
}

/* Option 2 — Tick mark and text inline (current behavior). */
.ack-inline {
  flex-direction: row;
  gap: 8px;
}
.ack-inline .ack-icon { --mdc-icon-size: 24px; }
.ack-inline .ack-text {
  font-size: calc(18px + var(--pill-text-offset, 0px));
  font-weight: 600;
}

/* Option 3 — Big tickmark only. */
.ack-big .ack-icon { --mdc-icon-size: 56px; }

/* Same @keyframes ax-btn-ack-fade (unchanged). */
@keyframes ax-btn-ack-fade {
  0%   { opacity: 1; }
  70%  { opacity: 1; }
  100% { opacity: 0; }
}
```

#### 2.3.5 Remove old `::after` rule

Delete the `.take-pill-btn.ack-flash::after { ... }` CSS block entirely from both panels (replaced by the real `.ack-flash` div). The `ack-flash` class is still pushed by `_takeButtonClasses()` / `_logDrinkButtonClasses()` (harmless — it's just a marker; the visible rendering now comes from the `.ack-flash` div in the template).

Actually, since the `.ack-flash` div is conditionally rendered in the template and carries its own layout class (`ack-top` / `ack-inline` / `ack-big`), the `ack-flash` class on the button is no longer needed for CSS targeting. But it's harmless to keep for potential state-query use. **Decision: keep pushing `ack-flash` on the button** (minimal code change — just remove the `::after` CSS, keep the class push).

#### 2.3.6 Editor schema — replace `ack_style` dropdown

**Delete** the `take_button_ack_style` / `drink_button_ack_style` schema nodes (7-option `_buttonStyleOptions()` select).

**Add** new `ack_layout` select in the same position:
```typescript
{
  name: 'take_button_ack_layout',
  selector: {
    select: {
      options: [
        { value: 'top', label: localize('en', 'ack_layout.top') },
        { value: 'inline', label: localize('en', 'ack_layout.inline') },
        { value: 'big', label: localize('en', 'ack_layout.big') },
      ],
    },
  },
},
```

**New localize keys:**
```typescript
'ack_layout.top': 'Top tick mark and text',
'ack_layout.inline': 'Tick mark and text inline',
'ack_layout.big': 'Big tick mark',
'config.take_button_ack_layout': 'Logged Style',
'config.drink_button_ack_layout': 'Logged Style',
'config.helper.take_button_ack_layout': 'Layout of the transient "Logged" flash after pressing. Default: Top tick mark and text.',
'config.helper.drink_button_ack_layout': 'Layout of the transient "Logged" flash after logging a drink. Default: Top tick mark and text.',
```

**Delete old localize keys:**
- `'config.take_button_ack_style'`, `'config.drink_button_ack_style'`
- `'config.helper.take_button_ack_style'`, `'config.helper.drink_button_ack_style'`

**Note:** The field is renamed `ack_style` → `ack_layout`. Existing configs with `take_button_ack_style` set will simply be ignored (the new field defaults to `'top'`). No migration needed — the old field was dead config (never read), so no user has a meaningful value to migrate.

---

## 3. Files to Modify

| File | Changes |
|------|---------|
| [`src/types.ts`](src/types.ts) | Remove `take_button_ack_pulse`, `drink_button_ack_pulse`, `take_button_ack_style`, `drink_button_ack_style`. Add `take_button_glow_speed`, `drink_button_glow_speed` (`'slow'\|'medium'\|'fast'`). Add `take_button_ack_layout`, `drink_button_ack_layout` (`AckLayout` type + fields). |
| [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) | In `take_button_box`: replace `ack_style` select with `ack_layout` select; remove `ack_pulse` boolean; add `glow_speed` select at bottom. Mirror in `drink_button_box`. |
| [`src/localize.ts`](src/localize.ts) | Add `glow_speed.*`, `ack_layout.*`, `config.*_glow_speed`, `config.*_ack_layout` + helpers. Remove `config.*_ack_pulse`, `config.*_ack_style` + helpers. |
| [`src/components/daily-panel.ts`](src/components/daily-panel.ts) | (a) `_glowDuration()` + `_ackLayout()` helpers; (b) inline `--glow-duration` style on button; (c) replace `::after` ACK with conditional `<div class="ack-flash ack-*">` containing `<ha-icon icon="mdi:check-bold">` + optional text span; (d) CSS: change glow animation duration to `var(--glow-duration, 2.2s)`; delete `.ack-flash::after` block; add `.ack-flash` base + `.ack-top` / `.ack-inline` / `.ack-big` layout CSS. |
| [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) | Mirror of daily-panel: `_glowDuration()` + `_ackLayout()` helpers; `--glow-duration` inline style; conditional ACK div; CSS changes. |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Rebuilt via `yarn run build`. |

---

## 4. Verification

```bash
cd /workspaces/lovelace-pill-logger-card && yarn run build
```
- Exit 0, no new warnings.
- Grep dist for `glow-duration` (new CSS var), `ack-layout` / `ack-top` / `ack-inline` / `ack-big` (new classes), `check-bold` (new icon), and absence of `ack_pulse` / `ack_style` in the schema-related code paths.

---

## 5. Memory Bank / README Updates (post-verification)

- **README.md** — Update the "Button State Matrix" section if it documents the per-state style options; note the 3 ACK layout options + glow speed.
- **memory-bank/activeContext.md** — Replace Current Status; archive previous glow v4 context.
- **memory-bank/progress.md** — Add new feature section with checklist.
- **memory-bank/projectstructure.md** — No file additions/removals; no change needed.

---

## 6. Key Design Decisions

1. **Keep conic-gradient (user decision)** — the corner speed variation is accepted; current 2.2s becomes "fast". No engine rewrite.
2. **CSS var `--glow-duration`** rather than multiple `@keyframes` — one animation rule, the duration is a variable. Clean + minimal CSS.
3. **Per-button glow speed** (not a single card-level field) — matches the existing per-button structure (`take_button_box` / `drink_button_box` are separate expandables). Each button can have its own speed.
4. **Remove dead config, don't migrate** — `ack_pulse` and `ack_style` were never read, so no user has meaningful values. Renaming `ack_style` → `ack_layout` with a fresh option set is clean; old keys are silently ignored.
5. **Real `<ha-icon>` in template** (not CSS `::after`) — required because `ha-icon` is a Lit component that can't render inside a pseudo-element. The tradeoff: a conditional template element instead of pure CSS, but this is the correct HA pattern (HA cards render real `ha-icon` elements, not unicode glyphs).
6. **`mdi:check-bold`** — the user-specified icon. Rendered via `<ha-icon icon="mdi:check-bold">` in all 3 layouts.
7. **`ack-flash` class on button kept** — harmless marker, minimal code change to the class helpers (only the CSS `::after` rule is deleted; the class push stays).