# Chip Rework — Day-Avg-Box Format + Per-Chip Icon Toggle + Timestamp Bug Fix

## Goal

Rework the custom chips on the Daily and Drinks panels so that:

1. **Default (icon OFF)** — chips are formatted identically to the **Day Avg Boxes** in the Graph panel (primary-tinted background, uppercase label with letter-spacing, column layout, no icon), but with the **same box height as the stat-pill boxes** to the right of the Take Pill / Log Drink button (~51px). This gives a clean, label-over-value tile that matches the Graph panel's averages-grid.

2. **Icon toggle ON** — a new per-chip boolean `chip_N_show_icon` / `drink_chip_N_show_icon` (default `false`) renders the `<ha-icon>` as a **header element on top** of the label/value column (icon-above-text, column layout preserved). When the icon is on, the chip's `min-height` constraint relaxes so the box grows to fit the icon. Off by default; no icon renders when off.

3. **Timestamp bug fix** — when a chip's entity has `device_class === 'timestamp'` (e.g. `sensor.caffeine_tracker_low_timestamp`), the value renders as `HH:MM` (24-hour) via `new Date(state).toLocaleTimeString(...)`, mirroring the Disruption box `low_timestamp` mode and the Stats panel Low-Timestamp row. The current bug: `formatInteger('2026-07-11T06:00:00+00:00')` → `parseFloat` extracts `2026` → `Math.round` → `'2026'`. The box to the right of the button (Disruption box) already handles this correctly because it has an explicit `low_timestamp` mode branch.

## Root Cause of the Timestamp Bug

[`formatInteger`](src/helpers.ts:16) does `parseFloat(value)` then `Math.round()`. For an ISO datetime string, `parseFloat` stops at the first non-numeric char (`-`) and returns the leading digits — the year (`2026`). The chip render path in both [`daily-panel.ts:216`](src/components/daily-panel.ts:216) and [`drinks-panel.ts:238`](src/components/drinks-panel.ts:238) unconditionally calls `c.formatInteger(chipState)`, so any timestamp-class entity surfaced as a chip shows the year instead of a formatted time. The stat-pill boxes are unaffected because they either hold numeric sensors or have explicit timestamp branches (Disruption box `low_timestamp` mode).

## Visual Comparison (Target State)

| Property | Icon OFF (default) | Icon ON |
|---|---|---|
| Layout | column: label over value | column: icon over label over value |
| Background | `rgba(var(--rgb-primary-color), 0.05)` (matches `.avg-cell`) | same |
| Label | uppercase, `letter-spacing: 0.3px`, 12px | same |
| Value | 16px, font-weight 600 | same |
| Icon | — | 18px, `--mdc-icon-size: 18px`, secondary color, centered on top |
| min-height | stat-pill height (~51px) via `min-height` + `justify-content: center` | `auto` (box grows to fit icon + content) |
| Padding | `6px 4px` (matches `.avg-cell`) | same |
| Border-radius | 10px | 10px |

## Implementation Plan

### Step 1 — `src/types.ts`
- Add 8 new optional boolean fields to `AxDoseLoggerCardConfig`: `chip_1_show_icon` … `chip_4_show_icon`, `drink_chip_1_show_icon` … `drink_chip_4_show_icon`.
- Add `showIcon?: boolean` to the [`ChipConfig`](src/types.ts:228) interface.

### Step 2 — `src/ax-dose-logger-card.ts`
- In [`_getChipEntities()`](src/ax-dose-logger-card.ts:390) and [`_getDrinkChipEntities()`](src/ax-dose-logger-card.ts:1449), read the new `*_show_icon` config key and populate `showIcon: this.config[showKey] === true` on each `ChipConfig`.

### Step 3 — `src/components/daily-panel.ts`
**Render changes** (the chip `.map()` block, ~lines 184-222):
- Gate the `<ha-icon>` on `chip.showIcon` (conditionally render; omit entirely when false).
- Icon goes **above** the label (column order: icon → name → value).
- Device-class-aware value: read `c.getAttr(chip.entityId, 'device_class')`. If `=== 'timestamp'`, parse `new Date(chipState)` and format `HH:MM` via `toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false })` with an `isNaN(dt.getTime())` guard → `daily.na` fallback. Else keep `c.formatInteger(chipState) + unit`.
- Keep the existing clickable / role / tabindex / action wiring unchanged.

**CSS changes** (`.chip`, `.chip-name`, `.chip-value`, `.chip-icon`):
- `.chip`: change `background` from `rgba(128,128,128,0.08)` → `rgba(var(--rgb-primary-color, 3, 169, 244), 0.05)` (matches `.avg-cell`). Keep `flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 6px` → adjust padding to `6px 4px` (matches `.avg-cell`). Add `min-height` to match stat-pill height (~51px) + `justify-content: center`. Add a `.chip.with-icon` modifier that sets `min-height: auto` (relaxes the fixed height so the box grows).
- `.chip-name`: add `text-transform: uppercase; letter-spacing: 0.3px` (matches `.avg-label`). Keep `font-size: 12px`, `line-height: 1.2`, `text-align: center`, `word-break`. Remove the `min-height: 2.6em` (the box-level min-height now controls height; the label no longer needs its own min-height).
- `.chip-value`: keep `font-size: 16px; font-weight: 600; line-height: 1.5; white-space: nowrap`.
- `.chip-icon`: keep `--mdc-icon-size: 18px` + secondary color; ensure it centers (margin auto or flex centering inherited from `.chip`'s `align-items: center`).

### Step 4 — `src/components/drinks-panel.ts`
- Apply the **same** render + CSS changes verbatim (the drinks-panel chip block is already a copy of the daily-panel chip block). Update the `.chip` / `.chip-name` / `.chip-value` / `.chip-icon` CSS in the drinks-panel `static styles` to match. Add the `with-icon` class gate.

### Step 5 — `src/ax-dose-logger-editor.ts`
- In each `chip_N_box` / `drink_chip_N_box` expandable schema, add a **boolean toggle** field at the top (before the entity selector): `{ name: 'chip_N_show_icon', selector: { boolean: {} } }` (and the `drink_chip_N_show_icon` equivalents).
- Update the `computeLabel` guard to suppress the label for the new `*_show_icon` fields (they render as a labeled toggle switch; the `localize` key provides the visible label — actually `boolean` selectors in HA show their label, so we keep the label visible via `computeLabel` returning the localize string). Decision: do NOT suppress — let `computeLabel` return `localize('en', 'config.chip_N_show_icon')` so the toggle shows "Show Icon" next to the switch.

### Step 6 — `src/localize.ts`
- Add label keys: `config.chip_1_show_icon` … `config.chip_4_show_icon` = `"Show Icon"`, `config.drink_chip_1_show_icon` … `config.drink_chip_4_show_icon` = `"Show Icon"`.
- Add helper key: `config.helper.chip_show_icon` = `"Display an icon on this chip. Off by default. When on, the chip box grows to fit the icon above the label."`

### Step 7 — `README.md`
- Add 8 new rows to the Configuration Options table (4 for `chip_N_show_icon`, 4 for `drink_chip_N_show_icon`), documenting the default-off behavior and the box-grows-when-on semantics.

### Step 8 — Build + Verify
- `cd /workspaces/lovelace-pill-logger-card && yarn run build` — expect exit 0, no warnings.
- Confirm the dist file rebuilt.

### Step 9 — Memory Bank
- Update `memory-bank/activeContext.md` (Current Status, What Was Changed, Files Modified, Key Design Decisions, archive previous).
- Append a new section to `memory-bank/progress.md`.
- `projectstructure.md` — no change (no new files; only edits to existing files).

## Key Design Decisions

1. **Icon OFF by default** — matches the user's request to "lose the icons by default." The clean Day-Avg-Box format (label-over-value, primary-tinted, uppercase) is the default appearance.
2. **Day-Avg-Box format + stat-pill height** — the chip adopts the Graph panel averages-grid visual language (primary-tinted bg, uppercase label, column layout) but with a `min-height` matching the stat-pill boxes so the chip row aligns visually with the two boxes above it on the Daily/Drinks panel.
3. **Icon on top (column)** — user-confirmed. Preserves the column direction; the icon is a header above the label/value. The box grows taller; the `min-height` relaxes to `auto` via a `.with-icon` class.
4. **Device-class-aware value** — generic detection via `c.getAttr(entityId, 'device_class') === 'timestamp'`. This is the same attribute HA exposes on all `SensorDeviceClass.TIMESTAMP` sensors (verified: the backend sets `_attr_device_class = SensorDeviceClass.TIMESTAMP` on `drink_master_sleep_disruption.py`, `drink_last_dose.py`, `next_dose.py`, `last_dose.py`). No hardcoded entity-id matching — any timestamp-class entity the user picks as a chip will format correctly.
5. **No backend change** — the bug is purely a frontend rendering concern. The backend timestamp sensors are correct (the Disruption box already renders them correctly via the same `new Date` + `toLocaleTimeString` pattern).
6. **Parity across both panels** — daily-panel and drinks-panel chip blocks are already parallel copies; the same changes apply verbatim to both.

## Files Modified

- [`src/types.ts`](src/types.ts) — 8 config fields + `ChipConfig.showIcon`
- [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — `_getChipEntities` + `_getDrinkChipEntities` read `show_icon`
- [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — chip render + CSS
- [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — chip render + CSS (parity)
- [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — 8 boolean toggle fields in schema + computeLabel
- [`src/localize.ts`](src/localize.ts) — 8 label keys + 1 helper key
- [`README.md`](README.md) — 8 config rows
- [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt

No backend changes. No `projectstructure.md` change (no files added/renamed/deleted).