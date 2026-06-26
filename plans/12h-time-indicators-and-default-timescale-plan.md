# Plan — 12H Time Indicators + 24H Timeframe + Default Timescale Selector

## Overview

Three related enhancements to the Amount-in-Body line graph in the Graphs pane:

1. **12H graph: more time indicators** — hourly tick marks + text labels every 2 hours
2. **Add 24H timeframe option** — new chip between 12H and 48H
3. **Default timescale dropdown** — config-form selector under the "Amount in Body Graph" toggle so each card instance can default to a clinically appropriate timescale (e.g. 12H for caffeine/paracetamol)

All changes are frontend-only (`/workspaces/lovelace-pill-logger-card/`). No backend changes needed.

---

## Feature 1 — 12H Time Indicators (hourly tick marks + every-2h labels)

### Current behavior
[`_renderLineGraph()`](src/ax-dose-logger-card.ts:1217-1245) builds a single `timeLabels` array where each entry drives both a tick mark AND a text label. For `totalHours <= 12`, labels are every 3h (5 labels: -12h, -9h, -6h, -3h, 0h).

### New behavior
Split into two arrays so tick marks and text labels can have different densities:

| Timeframe | Tick marks | Text labels |
|-----------|-----------|-------------|
| 12H       | every 1h (13 marks) | every 2h (7 labels: -12h, -10h, -8h, -6h, -4h, -2h, 0h) |
| 24H       | every 2h (13 marks) | every 4h (7 labels: -24h, -20h, -16h, -12h, -8h, -4h, 0h) |
| 48H       | every 3h (17 marks) | every 6h (9 labels, unchanged text) |
| 7D        | every 12h (15 marks) | every 1d (8 labels, unchanged text) |
| 14D       | every 1d (15 marks) | every 2d (8 labels, unchanged text) |
| 30D       | every 2d (16 marks) | every 5d (7 labels, unchanged text) |

### Implementation
In [`_renderLineGraph()`](src/ax-dose-logger-card.ts:1217-1245):

1. Replace the single `timeLabels` array with two arrays: `tickMarks: Array<{ x: number }>` and `timeLabels: Array<{ label: string; x: number }>`.
2. Build both arrays in a unified branching block by `totalHours`:
   - `<= 12`: tickMarks every 1h, timeLabels every 2h, format `-${hours}h`
   - `<= 24`: tickMarks every 2h, timeLabels every 4h, format `-${hours}h`
   - `<= 48`: tickMarks every 3h, timeLabels every 6h, format `-${hours}h`
   - else (days): tickMarks every `step/2` days (rounded), timeLabels every `step` days, format `-${days}d`
3. In the SVG render block (lines 1283-1290), render tick marks from `tickMarks` (short tick line only, no text) and text labels from `timeLabels` (tick line + text).

### SVG rendering change
```typescript
// Tick marks (no text)
${tickMarks.map(tm => svg`
  <line x1="${tm.x}" y1="${h - padBottom}" x2="${tm.x}" y2="${h - padBottom + 3}"
        stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
`)}

// Text labels (with slightly longer tick)
${timeLabels.map(tl => svg`
  <line x1="${tl.x}" y1="${h - padBottom}" x2="${tl.x}" y2="${h - padBottom + 4}"
        stroke="var(--divider-color)" stroke-width="1"/>
  <text x="${tl.x}" y="${h - 6}" text-anchor="middle"
        style="font-size: calc(9px + var(--pill-text-offset, 0px))"
        fill="var(--secondary-text-color)">${tl.label}</text>
`)}
```

---

## Feature 2 — Add 24H Timeframe

### Changes

1. **[`_getTimeframeHours()`](src/ax-dose-logger-card.ts:514-522)** — add `case '24h': return 24;`
2. **[`_renderTimeframeChips()`](src/ax-dose-logger-card.ts:1098-1113)** — add `{ id: '24h', labelKey: 'graphs.timeframe_24h', ariaKey: 'aria.timeframe_24h' }` between 12h and 48h entries
3. **[`src/localize.ts`](src/localize.ts)** — add `'graphs.timeframe_24h': '24H'` and `'aria.timeframe_24h': '24 hours'`

The time-label branching (Feature 1) already handles 24H via the `<= 24` branch.

---

## Feature 3 — Default Timescale Dropdown Selector

### Config interface
Add to [`AxDoseLoggerCardConfig`](src/ax-dose-logger-card.ts:8-30):
```typescript
amount_in_body_default_timeframe?: string;
```

### Config form schema
In [`getConfigForm()`](src/ax-dose-logger-card.ts:2052-2070), inside the `graphs_panel` expandable, add a select dropdown immediately after `show_amount_in_body`:

```typescript
{
  name: 'amount_in_body_default_timeframe',
  selector: {
    select: {
      options: [
        { value: '12h', label: '12 Hours' },
        { value: '24h', label: '24 Hours' },
        { value: '48h', label: '48 Hours' },
        { value: '7d', label: '7 Days' },
        { value: '14d', label: '14 Days' },
        { value: '30d', label: '30 Days' },
      ],
    },
  },
},
```

### Default application
In [`connectedCallback()`](src/ax-dose-logger-card.ts:1753), change:
```typescript
this._activeTimeframe = '48h';
```
to:
```typescript
this._activeTimeframe = this.config?.amount_in_body_default_timeframe || '48h';
```

This applies the configured default on every genuine view entry (initial load / dashboard navigation). The user's in-session chip selection is not persisted across view entries (existing behavior — `_activeTimeframe` resets on every `connectedCallback`), so the config default cleanly takes over.

### Validation guard
Add a safety check: if the configured value isn't in the valid set, fall back to `'48h'`. This can be a simple inline check or a small helper. Simplest approach:
```typescript
const validTimeframes = ['12h', '24h', '48h', '7d', '14d', '30d'];
const configured = this.config?.amount_in_body_default_timeframe;
this._activeTimeframe = (configured && validTimeframes.includes(configured)) ? configured : '48h';
```

### Localization
Add to [`src/localize.ts`](src/localize.ts):
- `'config.amount_in_body_default_timeframe': 'Amount in Body Default Timescale'`
- `'config.helper.amount_in_body_default_timeframe': 'Default timescale for the Amount in Body graph when the card loads. Useful for medications where a shorter window (e.g. 12 hours) is more informative than the 48-hour default.'`

### getStubConfig
No change needed — `amount_in_body_default_timeframe` defaults to `undefined`, which falls back to `'48h'` via the `||` guard.

---

## Files to Modify

| File | Changes |
|------|---------|
| [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Config interface field, `_getTimeframeHours()` 24h case, `_renderTimeframeChips()` 24h entry, `connectedCallback()` default-from-config, `_renderLineGraph()` tick/label split, `getConfigForm()` dropdown |
| [`src/localize.ts`](src/localize.ts) | `graphs.timeframe_24h`, `aria.timeframe_24h`, `config.amount_in_body_default_timeframe`, `config.helper.amount_in_body_default_timeframe` |
| [`README.md`](README.md) | Add `amount_in_body_default_timeframe` row to Configuration Options table; update Graphs feature line to include 24H |

---

## Verification

1. `yarn run build` — clean compilation, zero errors
2. Grep confirm: `24h` present in `_getTimeframeHours` + `_renderTimeframeChips` + localize; `amount_in_body_default_timeframe` present in config interface + `getConfigForm` + `connectedCallback`
3. Update memory-bank files (activeContext.md, progress.md)

---

## Key Design Decisions

1. **Tick marks vs text labels separated** — The user wants "more time indicators, pref every hour" on the 12H graph. Rendering 13 text labels in 320px would be ~21px each — too dense. Splitting tick marks (visual only, no text) from text labels gives the best of both: hourly visual granularity + readable text every 2h.
2. **24H added to all timeframes** — The 24H option bridges the gap between 12H (acute tracking) and 48H (longer view). It's useful for medications with ~12h half-lives where 48H shows too much flat tail.
3. **Config default applied in `connectedCallback`** — This is the single reset point for `_activeTimeframe` (already resets to `'48h'` there). Reading from config at this location means the default applies on every fresh view entry without interfering with in-session chip changes.
4. **Validation guard on configured value** — If a user manually edits YAML with an invalid value, the card falls back to `'48h'` instead of breaking the graph.
5. **Dropdown in `graphs_panel` expandable** — Placed right after `show_amount_in_body` toggle so it's contextually grouped with the amount-in-body feature it controls.