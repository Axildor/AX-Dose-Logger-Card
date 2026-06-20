# Text Size Toggle — Architecture Plan

## Overview

Add a **Small / Big** text size toggle to the card configurator. The toggle controls a CSS custom property `--pill-text-offset` that shifts all text sizes uniformly:

| Mode | Daily Pane | Graphs / Stats / Nav |
|------|-----------|----------------------|
| **Big** (default) | Current sizes (no change) | Current + 2px |
| **Small** | Current − 2px | Current sizes (no change) |

## Mechanism

A single CSS custom property `--pill-text-offset` is set as an inline style on `<ha-card>`:

- `big_text: true` → `--pill-text-offset: 0px`
- `big_text: false` → `--pill-text-offset: -2px`

All font-size declarations are then converted to `calc()` expressions:

- **Daily pane**: `calc(Xpx + var(--pill-text-offset, 0px))` — offset applies directly
- **Graphs / Stats / Nav**: `calc(Xpx + 2px + var(--pill-text-offset, 0px))` — offset + 2px baseline shift

When `--pill-text-offset` is `0px` (Big): Daily = X, Other = X+2  
When `--pill-text-offset` is `-2px` (Small): Daily = X−2, Other = X

## Config Schema Changes

### `PillLoggerCardConfig` interface — add field:
```typescript
big_text?: boolean;  // default true
```

### `setConfig()` — add default:
```typescript
this.config = {
  show_amount_in_body: true,
  big_text: true,      // ← new default
  ...config,
};
```

### `getConfigForm()` — add boolean selector:
Insert after `color_scheme` and before `name`:
```typescript
{
  name: 'big_text',
  selector: { boolean: {} },
},
```

### `computeLabel` — add entry:
```typescript
big_text: 'Big Text',
```

### `computeHelper` — add entry:
```typescript
if (schema.name === 'big_text') {
  return 'When off, all text is 2px smaller. Daily pane shrinks further for compact view.';
}
```

## CSS Font-Size Changes

### Daily Pane — `calc(Xpx + var(--pill-text-offset, 0px))`

| Selector | Current | New |
|----------|---------|-----|
| `.med-name` | `20px` | `calc(20px + var(--pill-text-offset, 0px))` |
| `.take-label` | `18px` | `calc(18px + var(--pill-text-offset, 0px))` |
| `.take-sub` | `16px` | `calc(16px + var(--pill-text-offset, 0px))` |
| `.stat-label` | `14px` | `calc(14px + var(--pill-text-offset, 0px))` |
| `.stat-value` | `18px` | `calc(18px + var(--pill-text-offset, 0px))` |
| `.chip-name` | `10px` | `calc(10px + var(--pill-text-offset, 0px))` |
| `.chip-value` | `16px` | `calc(16px + var(--pill-text-offset, 0px))` |

### Graphs Pane — `calc(Xpx + 2px + var(--pill-text-offset, 0px))`

| Selector | Current | New |
|----------|---------|-----|
| `.nav-title` | `13px` | `calc(15px + var(--pill-text-offset, 0px))` |
| `.bar-labels span` | `9px` | `calc(11px + var(--pill-text-offset, 0px))` |
| `.graph-placeholder` | `14px` | `calc(16px + var(--pill-text-offset, 0px))` |
| `.avg-label` | `9px` | `calc(11px + var(--pill-text-offset, 0px))` |
| `.avg-value` | `13px` | `calc(15px + var(--pill-text-offset, 0px))` |

### Stats Pane — `calc(Xpx + 2px + var(--pill-text-offset, 0px))`

| Selector | Current | New |
|----------|---------|-----|
| `.stat-cell-label` | `10px` | `calc(12px + var(--pill-text-offset, 0px))` |
| `.stat-cell-value` | `16px` | `calc(18px + var(--pill-text-offset, 0px))` |

### Navigation Bar — `calc(Xpx + 2px + var(--pill-text-offset, 0px))`

| Selector | Current | New |
|----------|---------|-----|
| `.pane-btn` | `13px` | `calc(15px + var(--pill-text-offset, 0px))` |

### SVG Text Elements — inline `style` attribute

SVG `font-size` presentation attributes don't support `calc()` or `var()`. Convert to inline `style` attributes:

| Location | Current | New |
|----------|---------|-----|
| Bar graph Y-axis labels | `font-size="8"` | `style="font-size: calc(10px + var(--pill-text-offset, 0px))"` |
| Line graph Y-axis labels | `font-size="8"` | `style="font-size: calc(10px + var(--pill-text-offset, 0px))"` |
| Line graph Current text | `font-size="9"` | `style="font-size: calc(11px + var(--pill-text-offset, 0px))"` |
| Line graph X-axis labels | `font-size="7"` | `style="font-size: calc(9px + var(--pill-text-offset, 0px))"` |
| Line graph placeholder | `font-size="11"` | `style="font-size: calc(13px + var(--pill-text-offset, 0px))"` |

### Unchanged — Dialogs and Icons

These are modal overlays, not part of any pane, and remain at fixed sizes:
- `.dialog-title`: 16px
- `.dialog-btn`: 14px
- `.refill-input`: 16px
- All `--mdc-icon-size` declarations (icons, not text)

## render() Change

In the `render()` method, update the `<ha-card>` inline style to include the offset:

```typescript
// Before
<ha-card style="${this._getColorOverrides()}">

// After
<ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text !== false ? '0px' : '-2px'};">
```

Using `big_text !== false` ensures the default is `0px` (big) even when the field is undefined.

## Verification

1. `yarn run build` — clean compilation, zero warnings, zero errors
2. Visual check: Big mode — daily pane unchanged, graphs/stats/nav text 2px larger
3. Visual check: Small mode — daily pane text 2px smaller, graphs/stats/nav unchanged from current