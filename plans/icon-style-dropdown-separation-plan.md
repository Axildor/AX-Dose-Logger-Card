# Plan — Icon Style Dropdown Separation (Revised)

**Date:** 2026-08-10  
**Scope:** Frontend only (`/workspaces/lovelace-pill-logger-card/`)  
**Goal:** Extract icon color + pulse from the per-state Style dropdown into a dedicated **Icon Style** dropdown, simplifying the Style dropdown from 7 to 4 options + a "Default" sentinel, and rename `glow` → `ring` to free up "glow" for a future uniform glow feature.

---

## 1. Problem

The per-state Style dropdown currently bundles **three independent visual dimensions** into 7 monolithic options, plus a separate Icon Pulse boolean toggle per state:

| Option | Background/Text | Icon Color | Border | Glow |
|--------|:-:|:-:|:-:|:-:|
| `full` | ✅ | (via inheritance) | — | — |
| `icon` | — | ✅ | — | — |
| `border` | — | — | ✅ | — |
| `icon_border` | — | ✅ | ✅ | — |
| `none` | — | — | — | — |
| `glow` | — | — | — | ✅ (rotating ring) |
| `icon_glow` | — | ✅ | — | ✅ (rotating ring) |

Issues:
- Icon color entangled with style choice (3 of 7 options include it).
- Pulse is a separate toggle → 14 combinations (7 × 2), verbose and hard to reason about.
- "No Change" label is ambiguous (could mean "no change from default" or "does nothing").
- `glow` value conflicts with a planned future uniform glow feature.

## 2. Solution — Two Orthogonal Dropdowns + Default Sentinel

### 2.1 Style Dropdown (5 options: 4 visual + 1 default-sentinel)

| Value | Label | Effect |
|-------|-------|--------|
| `auto` | Default | Resolves to the per-state default style at runtime |
| `full` | Full Button | Background + text colored (icon inherits color) |
| `border` | Border Only | Inset box-shadow ring |
| `none` | No Color | Theme-tinted background, no state color override (looks like idle) |
| `ring` | Rotating Ring | Rotating conic-gradient ring sweep around the border |

**Removed:** `icon`, `icon_border`, `icon_glow` — icon-coloring moves to Icon Style; non-icon collapses (`icon_border` → `border`, `icon_glow` → `ring`, `icon` → `none`).

**Renamed:** `glow` → `ring` (frees up `glow` for future uniform glow).

**`auto` sentinel:** Same effect as clearing the field (undefined → runtime `??` fallback). Added for discoverability — users who don't know about the X button can pick "Default" explicitly. If the card's per-state defaults change in a future version, `auto` picks up the new default automatically.

### 2.2 Icon Style Dropdown (5 options: 4 visual + 1 default-sentinel)

| Value | Label | Icon Color | Pulse |
|-------|-------|:-:|:-:|
| `auto` | Default | Resolves to the per-state default icon style at runtime |
| `none` | None | — | — |
| `color` | Colored | ✅ | — |
| `color_pulse` | Colored + Pulse | ✅ | ✅ |
| `pulse` | Pulse Only | — | ✅ |

**UX rationale:** The 4 visual options form a clean 2×2 matrix (color on/off × pulse on/off), ordered from "nothing" → "color" → "both" → "pulse only."

### 2.3 Interaction Matrix

```
Style:      auto | full | border | none | ring
Icon Style: auto | none | color | color_pulse | pulse
```

5 × 5 = 25 combinations (including `auto` sentinels). Excluding `auto`, 4 × 4 = 16 real visual combinations (vs the old 7 × 2 = 14). The 2 new combinations unreachable before:
- `border` + `pulse` (border ring + pulsing icon, no icon color)
- `ring` + `pulse` (rotating ring + pulsing icon, no icon color)

### 2.4 Known Interaction: `full` + Icon Style

When Style = `full`, the button's `color` property is set to the state color, and `<ha-icon>` inherits it via CSS cascade. The `icon-{color}` class (from Icon Style `color`/`color_pulse`) explicitly sets `> ha-icon { color: ... }` — same result, more specific.

- `full` + `none` → icon colored by inheritance (expected: "Full Button" colors everything)
- `full` + `pulse` → icon colored by inheritance AND pulses
- `full` + `color` → redundant but harmless (same color)
- `full` + `color_pulse` → same + pulse

No CSS change needed — inherent to what "Full Button" means.

## 3. New Types (types.ts)

```typescript
/**
 * Visual style option for a single button-state color assignment.
 * Controls background, text color, border, and rotating ring — everything
 * EXCEPT the icon (which is controlled by IconStyle). 'auto' resolves to
 * the per-state default at runtime.
 */
export type ButtonStateStyle =
  | 'auto'      // Sentinel — resolve to per-state default
  | 'full'      // Full Button (background + text colored)
  | 'border'    // Border Only (inset box-shadow ring)
  | 'none'      // No Color (theme-tinted bg, no state color override)
  | 'ring';     // Rotating Ring (conic-gradient ring sweep)

/**
 * Icon visual treatment for a single button-state. Controls icon color
 * and icon pulse animation independently from the Style dropdown. Forms
 * a 2×2 matrix: color on/off × pulse on/off. 'auto' resolves to the
 * per-state default at runtime.
 */
export type IconStyle =
  | 'auto'         // Sentinel — resolve to per-state default
  | 'none'         // No icon color, no pulse
  | 'color'        // Icon colored, no pulse
  | 'color_pulse'  // Icon colored + pulse animation
  | 'pulse';       // No icon color, pulse animation only

/**
 * Speed of the rotating ring animation (renamed from GlowSpeed).
 * Maps to a CSS duration set via the --ring-duration var.
 */
export type RingSpeed =
  | 'slow'    // 6s
  | 'medium'  // 4s
  | 'fast';   // 2.2s (default)
```

## 4. Config Field Changes (types.ts)

### Daily (Take Pill button)

| Old field | New field |
|----------|-----------|
| `take_button_lockout_style: ButtonStateStyle` | `take_button_lockout_style: ButtonStateStyle` (5 values now) |
| `take_button_lockout_pulse: boolean` | `take_button_lockout_icon_style: IconStyle` |
| `take_button_execution_style: ButtonStateStyle` | `take_button_execution_style: ButtonStateStyle` |
| `take_button_execution_pulse: boolean` | `take_button_execution_icon_style: IconStyle` |
| `take_button_latency_style: ButtonStateStyle` | `take_button_latency_style: ButtonStateStyle` |
| `take_button_latency_pulse: boolean` | `take_button_latency_icon_style: IconStyle` |
| `take_button_glow_speed: GlowSpeed` | `take_button_ring_speed: RingSpeed` |

### Drinks (Log Drink button)

| Old field | New field |
|----------|-----------|
| `drink_button_lockout_style: ButtonStateStyle` | `drink_button_lockout_style: ButtonStateStyle` |
| `drink_button_lockout_pulse: boolean` | `drink_button_lockout_icon_style: IconStyle` |
| `drink_button_glow_speed: GlowSpeed` | `drink_button_ring_speed: RingSpeed` |

### ButtonStateStyle removed values

**Removed:** `icon`, `icon_border`, `icon_glow`, `glow` (→ `ring`).

## 5. Per-State Defaults

| State | Old default (style + pulse) | New default (style + icon_style) |
|-------|:-:|:-:|
| Lockout | `full` + off | `full` + `none` |
| Execution | `icon` + off | `none` + `color` |
| Latency | `icon_border` + on | `border` + `color_pulse` |
| Drink Lockout | `full` + off | `full` + `none` |

These produce identical visual results to the old defaults — verified via the migration table.

The editor schema `default` for each field is set to `auto` (the sentinel). This means new configs persist `auto`, which resolves to the per-state default at runtime. If the card's defaults change in the future, `auto` picks up the new default automatically.

## 6. Backward Compatibility Migration (setConfig)

Users with existing configs have old `*_style` values (possibly `icon`, `icon_border`, `icon_glow`, `glow`) and old `*_pulse` booleans, plus old `*_glow_speed` fields. The `setConfig()` method already has a migration pattern (legacy `chips[]` → flat `chip_N` fields). We add a second + third migration pass:

```typescript
// Migration 2: old *_style + *_pulse → new *_style + *_icon_style
// Migration 3: old *_glow_speed → *_ring_speed
function _migrateButtonStateConfig(raw: any): void {
  // Daily — 3 states
  _migrateOneState(raw, 'take_button_lockout');
  _migrateOneState(raw, 'take_button_execution');
  _migrateOneState(raw, 'take_button_latency');
  // Drinks — 1 state
  _migrateOneState(raw, 'drink_button_lockout');
  // Ring speed rename (glow_speed → ring_speed)
  if (raw.take_button_glow_speed !== undefined && raw.take_button_ring_speed === undefined) {
    raw.take_button_ring_speed = raw.take_button_glow_speed;
    delete raw.take_button_glow_speed;
  }
  if (raw.drink_button_glow_speed !== undefined && raw.drink_button_ring_speed === undefined) {
    raw.drink_button_ring_speed = raw.drink_button_glow_speed;
    delete raw.drink_button_glow_speed;
  }
}

function _migrateOneState(raw: any, prefix: string): void {
  const oldStyle = raw[`${prefix}_style`];
  const oldPulse = raw[`${prefix}_pulse`];
  // Only migrate if the new field is absent AND at least one old field is present
  if (raw[`${prefix}_icon_style`] !== undefined) return;
  if (oldStyle === undefined && oldPulse === undefined) return;

  // Map old style → new style (strip icon component, rename glow→ring)
  const hasIcon = oldStyle === 'icon' || oldStyle === 'icon_border' || oldStyle === 'icon_glow';
  const newStyle = oldStyle === 'icon' ? 'none'
    : oldStyle === 'icon_border' ? 'border'
    : oldStyle === 'icon_glow' ? 'ring'
    : oldStyle === 'glow' ? 'ring'
    : oldStyle;  // full, border, none unchanged

  // Map old pulse + icon presence → new icon_style
  let iconStyle: IconStyle;
  if (hasIcon) {
    iconStyle = oldPulse ? 'color_pulse' : 'color';
  } else {
    iconStyle = oldPulse ? 'pulse' : 'none';
  }

  raw[`${prefix}_style`] = newStyle;
  raw[`${prefix}_icon_style`] = iconStyle;
  delete raw[`${prefix}_pulse`];
}
```

### Full Migration Mapping Table

| Old `*_style` | Old `*_pulse` | New `*_style` | New `*_icon_style` |
|:-:|:-:|:-:|:-:|
| `full` | `false` | `full` | `none` |
| `full` | `true` | `full` | `pulse` |
| `icon` | `false` | `none` | `color` |
| `icon` | `true` | `none` | `color_pulse` |
| `border` | `false` | `border` | `none` |
| `border` | `true` | `border` | `pulse` |
| `icon_border` | `false` | `border` | `color` |
| `icon_border` | `true` | `border` | `color_pulse` |
| `none` | `false` | `none` | `none` |
| `none` | `true` | `none` | `pulse` |
| `glow` | `false` | `ring` | `none` |
| `glow` | `true` | `ring` | `pulse` |
| `icon_glow` | `false` | `ring` | `color` |
| `icon_glow` | `true` | `ring` | `color_pulse` |

Plus: `take_button_glow_speed` → `take_button_ring_speed`, `drink_button_glow_speed` → `drink_button_ring_speed` (value unchanged, just field rename).

**Idempotent:** The migration checks `if (raw[`${prefix}_icon_style`] !== undefined) return` — if the user already has the new field (post-migration), the old `*_pulse` field is absent (deleted on first migration), so the migration is a no-op on subsequent loads. Same for `*_ring_speed` — checks `if raw.*_ring_speed === undefined`.

## 7. Panel Logic Changes

### 7.1 daily-panel.ts — `_takeButtonClasses()`

```typescript
// Current (7 style options + separate pulse):
if (style === 'full') classes.push(`full-${color}`);
if (style === 'icon' || style === 'icon_border' || style === 'icon_glow') classes.push(`icon-${color}`);
if (style === 'border' || style === 'icon_border') classes.push(`border-${color}`);
if (style === 'glow' || style === 'icon_glow') classes.push(`glow-${color}`);
if (style === 'none') classes.push(`style-none`);
if (pulse) classes.push('pulse');

// New (5 style options + 5 icon_style options):
// 'auto' resolves to per-state default before this point
if (style === 'full') classes.push(`full-${color}`);
if (style === 'border') classes.push(`border-${color}`);
if (style === 'ring') classes.push(`ring-${color}`);
if (style === 'none') classes.push(`style-none`);
// 'auto' never reaches here — resolved earlier

if (iconStyle === 'color' || iconStyle === 'color_pulse') classes.push(`icon-${color}`);
if (iconStyle === 'color_pulse' || iconStyle === 'pulse') classes.push('pulse');
// 'auto' never reaches here — resolved earlier
```

State → config field resolution with `auto` sentinel:

```typescript
// New:
// Per-state defaults (used when value is 'auto' or undefined)
const STATE_DEFAULTS = {
  lockout:    { style: 'full',   iconStyle: 'none' },
  execution:  { style: 'none',   iconStyle: 'color' },
  latency:    { style: 'border',  iconStyle: 'color_pulse' },
};

if (state === 'lockout') {
  const d = STATE_DEFAULTS.lockout;
  style = cfg?.take_button_lockout_style ?? d.style;
  if (style === 'auto') style = d.style;
  iconStyle = cfg?.take_button_lockout_icon_style ?? d.iconStyle;
  if (iconStyle === 'auto') iconStyle = d.iconStyle;
} else if (state === 'execution') {
  const d = STATE_DEFAULTS.execution;
  style = cfg?.take_button_execution_style ?? d.style;
  if (style === 'auto') style = d.style;
  iconStyle = cfg?.take_button_execution_icon_style ?? d.iconStyle;
  if (iconStyle === 'auto') iconStyle = d.iconStyle;
} else if (state === 'latency') {
  const d = STATE_DEFAULTS.latency;
  style = cfg?.take_button_latency_style ?? d.style;
  if (style === 'auto') style = d.style;
  iconStyle = cfg?.take_button_latency_icon_style ?? d.iconStyle;
  if (iconStyle === 'auto') iconStyle = d.iconStyle;
}
```

### 7.2 drinks-panel.ts — `_logDrinkButtonClasses()`

Same pattern — `drink_button_lockout_pulse` → `drink_button_lockout_icon_style`, default `none`. Per-state default: `{ style: 'full', iconStyle: 'none' }`.

### 7.3 CSS Renames (glow → ring)

All CSS classes and variables renamed for consistency with the value rename:

```css
/* RENAMED: .glow-{color} → .ring-{color} */
.take-pill-btn.ring-red, .take-pill-btn.ring-blue,
.take-pill-btn.ring-amber, .take-pill-btn.ring-green { ... }

/* RENAMED: .glow-track → .ring-track */
.take-pill-btn .ring-track { ... }

/* RENAMED: --glow-duration → --ring-duration */
animation: ax-btn-ring-sweep var(--ring-duration, 2.2s) linear infinite;

/* RENAMED: @keyframes ax-btn-glow-sweep → ax-btn-ring-sweep */
@keyframes ax-btn-ring-sweep { to { transform: rotate(360deg); } }

/* RENAMED: .glow-{color} .glow-track::before → .ring-{color} .ring-track::before */
.take-pill-btn.ring-red .ring-track::before { ... }
```

Same renames in drinks-panel.ts.

**No new CSS rules** — just renames of existing ones. The class-generation logic produces the same visual output, just with `ring-*` class names instead of `glow-*`.

### 7.4 Ring speed resolution

```typescript
// Current (daily-panel.ts):
private _glowDuration(): string {
  const speed: GlowSpeed = this.controller.config?.take_button_glow_speed ?? 'medium';
  return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
}

// New:
private _ringDuration(): string {
  const speed: RingSpeed = this.controller.config?.take_button_ring_speed ?? 'medium';
  return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
}
```

The CSS var reference in the template changes from `--glow-duration` to `--ring-duration`.

## 8. Editor Schema Changes (ax-dose-logger-editor.ts)

### 8.1 `_buttonStyleOptions()` — 5 options (was 7)

```typescript
function _buttonStyleOptions() {
  return [
    { value: 'auto', label: localize('en', 'button_style.auto') },
    { value: 'full', label: localize('en', 'button_style.full') },
    { value: 'border', label: localize('en', 'button_style.border') },
    { value: 'none', label: localize('en', 'button_style.none') },
    { value: 'ring', label: localize('en', 'button_style.ring') },
  ];
}
```

### 8.2 New `_iconStyleOptions()` — 5 options

```typescript
function _iconStyleOptions() {
  return [
    { value: 'auto', label: localize('en', 'icon_style.auto') },
    { value: 'none', label: localize('en', 'icon_style.none') },
    { value: 'color', label: localize('en', 'icon_style.color') },
    { value: 'color_pulse', label: localize('en', 'icon_style.color_pulse') },
    { value: 'pulse', label: localize('en', 'icon_style.pulse') },
  ];
}
```

### 8.3 `_glowSpeedOptions()` → `_ringSpeedOptions()` — rename

```typescript
function _ringSpeedOptions() {
  return [
    { value: 'slow', label: localize('en', 'ring_speed.slow') },
    { value: 'medium', label: localize('en', 'ring_speed.medium') },
    { value: 'fast', label: localize('en', 'ring_speed.fast') },
  ];
}
```

### 8.4 Schema grids — replace pulse toggle with icon_style dropdown

Each per-state grid pairs style dropdown + icon_style dropdown (was: style + boolean toggle):

```typescript
// ── Limit Reached: style + icon_style ──
{
  type: 'grid',
  name: '',
  column_min_width: '200px',
  schema: [
    {
      name: 'take_button_lockout_style',
      default: 'auto',
      selector: { select: { options: _buttonStyleOptions(), mode: 'dropdown' } },
    },
    {
      name: 'take_button_lockout_icon_style',
      default: 'auto',
      selector: { select: { options: _iconStyleOptions(), mode: 'dropdown' } },
    },
  ],
},
```

Ring speed field rename:

```typescript
{
  name: 'take_button_ring_speed',   // was: take_button_glow_speed
  default: 'medium',
  selector: { select: { options: _ringSpeedOptions(), mode: 'dropdown' } },
},
```

Same pattern for all 4 state grids (Daily: lockout, execution, latency; Drinks: lockout) + both ring_speed fields.

## 9. Localize Changes (localize.ts)

### 9.1 Remove old pulse labels + helpers

```
// DELETE:
'config.take_button_lockout_pulse': 'Limit Reached Icon Pulse',
'config.take_button_execution_pulse': 'Take Pill Icon Pulse',
'config.take_button_latency_pulse': 'Overdue Warning Icon Pulse',
'config.drink_button_lockout_pulse': 'Limit Reached Icon Pulse',
'config.helper.take_button_lockout_pulse': '...',
'config.helper.take_button_execution_pulse': '...',
'config.helper.take_button_latency_pulse': '...',
'config.helper.drink_button_lockout_pulse': '...',
```

### 9.2 Update button_style labels

```
// ADD:
'button_style.auto': 'Default',
// KEEP (unchanged value, same label):
'button_style.full': 'Full Button',
'button_style.border': 'Border Only',
// CHANGE label:
'button_style.none': 'No Color',    // was 'No Change'
// RENAME key + label:
'button_style.ring': 'Rotating Ring',  // was 'button_style.glow': 'Rotating Border Glow'
// DELETE (options removed):
// 'button_style.icon': 'Icon Only',
// 'button_style.icon_border': 'Icon and Border',
// 'button_style.icon_glow': 'Icon and Rotating Border Glow',
```

### 9.3 Add icon_style labels

```
'icon_style.auto': 'Default',
'icon_style.none': 'None',
'icon_style.color': 'Colored',
'icon_style.color_pulse': 'Colored + Pulse',
'icon_style.pulse': 'Pulse Only',
```

### 9.4 Rename glow_speed → ring_speed

```
// RENAME keys:
'ring_speed.slow': 'Slow',       // was 'glow_speed.slow'
'ring_speed.medium': 'Medium',   // was 'glow_speed.medium'
'ring_speed.fast': 'Fast',        // was 'glow_speed.fast'
```

### 9.5 Update config labels for renamed fields

```
// ADD (new icon_style field labels — though these may not be needed
// if the select selector renders option labels, not field labels):
'config.take_button_lockout_icon_style': 'Limit Reached Icon Style',
'config.take_button_execution_icon_style': 'Take Pill Icon Style',
'config.take_button_latency_icon_style': 'Overdue Warning Icon Style',
'config.drink_button_lockout_icon_style': 'Limit Reached Icon Style',

// RENAME:
'config.take_button_ring_speed': 'Rotating Ring Speed',  // was 'config.take_button_glow_speed': 'Rotating Glow Speed'
'config.drink_button_ring_speed': 'Rotating Ring Speed',  // was 'config.drink_button_glow_speed'
```

### 9.6 Update helper texts

```
// ADD icon_style helpers:
'config.helper.take_button_lockout_icon_style': 'Icon color and pulse when the limit is reached. Default: None.',
'config.helper.take_button_execution_icon_style': 'Icon color and pulse when a dose is due. Default: Colored.',
'config.helper.take_button_latency_icon_style': 'Icon color and pulse when overdue. Default: Colored + Pulse.',
'config.helper.drink_button_lockout_icon_style': 'Icon color and pulse when the limit is reached. Default: None.',

// RENAME glow_speed helpers:
'config.helper.take_button_ring_speed': 'Speed of the rotating ring animation. Default: Medium (4s per rotation).',
'config.helper.drink_button_ring_speed': 'Speed of the rotating ring animation. Default: Medium (4s per rotation).',

// UPDATE style helpers (mention "auto" = default):
'config.helper.take_button_lockout_style': 'Visual style when the daily limit is reached. Default: Full Button.',
'config.helper.take_button_execution_style': 'Visual style when a scheduled dose is due. Default: No Color.',
'config.helper.take_button_latency_style': 'Visual style when the dose is overdue. Default: Border Only.',
'config.helper.drink_button_lockout_style': 'Visual style when the substance daily limit is reached. Default: Full Button.',
```

## 10. README Changes

The Button State Matrix section needs updating:

1. **State table** — update defaults column:
   - Limit Reached: Full Button (style) + None (icon)
   - Take Pill: No Color (style) + Colored (icon)
   - Overdue Warning: Border Only (style) + Colored + Pulse (icon)

2. **"7 visual style options" section** → **"4 style options + Default"** — list: Default, Full Button, Border Only, No Color, Rotating Ring.

3. **"Icon Pulse toggle" paragraph** → **"Icon Style dropdown"** — describe the 4 options + Default (None / Colored / Colored + Pulse / Pulse Only) as a 2×2 matrix controlling icon color and pulse independently from the style.

4. **Editor layout description** — update to mention two dropdowns per state (Style + Icon Style) instead of style dropdown + pulse toggle.

5. **"Rotating Glow Speed"** → **"Rotating Ring Speed"** throughout.

6. **"Rotating Border Glow"** → **"Rotating Ring"** throughout.

## 11. Verification Checklist

After implementation:

- [ ] `yarn run build` clean (exit 0, no TS errors)
- [ ] Dist grep: `_iconStyleOptions` present, `_ringSpeedOptions` present, old `_glowSpeedOptions` absent
- [ ] Dist grep: no `take_button_*_pulse` or `drink_button_*_pulse` in editor schema
- [ ] Dist grep: `ring-speed` CSS var present, `glow-duration` absent
- [ ] Logic trace — all 16 real combinations produce correct CSS classes:
  - `full` + `none` → `full-{color}` (icon inherits color) ✓
  - `full` + `pulse` → `full-{color} pulse` ✓
  - `border` + `color` → `border-{color} icon-{color}` ✓
  - `border` + `color_pulse` → `border-{color} icon-{color} pulse` ✓
  - `none` + `none` → `style-none` ✓
  - `none` + `color` → `style-none icon-{color}` ✓
  - `ring` + `color_pulse` → `ring-{color} icon-{color} pulse` ✓
  - `ring` + `pulse` → `ring-{color} pulse` ✓ (NEW combination)
  - `border` + `pulse` → `border-{color} pulse` ✓ (NEW combination)
  - (all remaining combinations follow the same pattern)
- [ ] `auto` sentinel: `auto` + `auto` for Lockout → resolves to `full` + `none` (identical to old default)
- [ ] Migration trace — old `icon_border` + `pulse: true` → `border` + `color_pulse` (identical CSS output)
- [ ] Migration trace — old `glow` style → `ring` style (identical CSS output, renamed classes)
- [ ] Migration trace — old `take_button_glow_speed: 'fast'` → `take_button_ring_speed: 'fast'` (value unchanged)
- [ ] Migration idempotent — running setConfig twice produces the same config
- [ ] CSS renames: all `.glow-*` → `.ring-*`, `--glow-duration` → `--ring-duration`, `ax-btn-glow-sweep` → `ax-btn-ring-sweep`

## 12. Files to Modify

| File | Changes |
|------|--------|
| [`src/types.ts`](src/types.ts) | Add `IconStyle` type; reduce `ButtonStateStyle` to 5 values (`auto`/`full`/`border`/`none`/`ring`); rename `GlowSpeed` → `RingSpeed`; rename `*_pulse` → `*_icon_style`; rename `*_glow_speed` → `*_ring_speed` |
| [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) | Reduce `_buttonStyleOptions()` to 5; add `_iconStyleOptions()` with 5; rename `_glowSpeedOptions()` → `_ringSpeedOptions()`; update 4 state grids (Daily: 3, Drinks: 1) to use icon_style dropdown; rename glow_speed fields to ring_speed; update comments |
| [`src/components/daily-panel.ts`](src/components/daily-panel.ts) | Update `_takeButtonClasses()` class generation + state→field resolution with `auto` sentinel; rename `_glowDuration()` → `_ringDuration()`; rename CSS `.glow-*` → `.ring-*`, `--glow-duration` → `--ring-duration`, `ax-btn-glow-sweep` → `ax-btn-ring-sweep`; update comments |
| [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) | Same changes as daily-panel for `_logDrinkButtonClasses()` + CSS renames |
| [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Add `_migrateButtonStateConfig()` call in `setConfig()` after chips migration |
| [`src/localize.ts`](src/localize.ts) | Remove `*_pulse` labels + helpers; update `button_style.*` (add `auto`, change `none` label, rename `glow` → `ring`); add `icon_style.*`; rename `glow_speed.*` → `ring_speed.*`; update helper texts |
| [`README.md`](README.md) | Update Button State Matrix section (options, defaults, labels, editor layout, "Glow" → "Ring" terminology) |
| [`memory-bank/activeContext.md`](memory-bank/activeContext.md) | New status block |
| [`memory-bank/progress.md`](memory-bank/progress.md) | New feature section |

## 13. Migration Summary Diagram

```mermaid
graph TD
    subgraph Old Config Fields
        OS[old_style: 7 values]
        OP[old_pulse: boolean]
        OGS[old_glow_speed: slow/medium/fast]
    end
    subgraph Migration in setConfig
        M1[Strip icon from style]
        M2[Rename glow to ring]
        M3[Map pulse + icon to icon_style]
        M4[Rename glow_speed to ring_speed]
    end
    subgraph New Config Fields
        NS[new_style: auto/full/border/none/ring]
        NI[new_icon_style: auto/none/color/color_pulse/pulse]
        NRS[new_ring_speed: slow/medium/fast]
    end
    OS --> M1 --> NS
    OS --> M2 --> NS
    OS --> M3 --> NI
    OP --> M3 --> NI
    OGS --> M4 --> NRS