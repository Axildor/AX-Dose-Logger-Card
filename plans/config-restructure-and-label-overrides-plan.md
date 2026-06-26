# Plan — Config Screen Restructure + Label Overrides

## Goal
Three changes to the AX Dose Logger Card editor (`getConfigForm()`):

1. **Two new full-label text overrides** — `take_pill_label` (button text, default "Take Pill") and `pills_left_label` (stat label, default "Pills left"). Follows the Option B pattern (full phrase, no verb/noun split) so users can write "Inject Dose", "Apply Cream", "Amount Left (ml)", etc.
2. **Restructure the config schema into panel-grouped expandables** — move scattered options into three named dropdowns: "Daily Panel", "Graphs Panel", "Stats Panel". Nest the existing "Custom Chips" expandable inside "Daily Panel".
3. **Unify dropdown labels** — "Graph" → "Graphs Panel"; new "Daily Panel" and "Stats Panel".

## Current schema (flat, lines 1930–2058)
```
device_id (required)
big_text
take_pill_icon
color_scheme
name
[expandable: chips] "Custom Chips" (flatten)
[expandable: graph_options] "Graph" (flatten) — show_amount_in_body, show_day_avg_boxes, show_adherence_boxes
stats_3_columns
hide_nav_bar
```

## Target schema (restructured)
```
device_id (required)          ← top-level, global
big_text                      ← top-level, global display
color_scheme                  ← top-level, global
name                          ← top-level, global override
hide_nav_bar                  ← top-level, global

[expandable: daily_panel] "Daily Panel" (flatten)
  ├─ take_pill_icon           ← moved from top-level
  ├─ take_pill_label          ← NEW (text selector)
  ├─ pills_left_label         ← NEW (text selector)
  └─ [expandable: chips] "Custom Chips" (flatten)  ← NESTED
       └─ chip_1..chip_4 + labels (unchanged)

[expandable: graphs_panel] "Graphs Panel" (flatten)  ← renamed from graph_options
  ├─ show_amount_in_body
  ├─ show_day_avg_boxes
  └─ show_adherence_boxes

[expandable: stats_panel] "Stats Panel" (flatten)  ← NEW
  └─ stats_3_columns          ← moved from top-level
```

**Rationale for what stays top-level**: `device_id`, `big_text`, `color_scheme`, `name`, `hide_nav_bar` are card-global settings (not specific to one pane). Only pane-specific options go inside the panel dropdowns.

## Nesting note
HA's `expandable` schema contains "child controls" which can include other expandables (confirmed via HA frontend docs). The existing expandables use `flatten: true`. If a flattened outer expandable doesn't render a nested inner expandable correctly, fallback is `flatten: false` on the Daily Panel outer (children indented under the header). This will be verified visually during implementation — the build will succeed either way; it's a rendering concern only.

## Changes

### `src/ax-dose-logger-card.ts`

**Interface** (line ~30) — add two fields:
```ts
take_pill_label?: string;
pills_left_label?: string;
```

**`getConfigForm()` schema** (lines 1930–2058) — restructure as shown above:
- Keep `device_id`, `big_text`, `color_scheme`, `name`, `hide_nav_bar` at top level.
- Remove `take_pill_icon` and `stats_3_columns` from top level.
- New `expandable` `daily_panel` (flatten: true) containing: `take_pill_icon` (icon selector), `take_pill_label` (text selector), `pills_left_label` (text selector), and the existing `chips` expandable nested inside.
- Rename `graph_options` expandable → `graphs_panel`, title "Graphs Panel".
- New `expandable` `stats_panel` (flatten: true) containing `stats_3_columns`.

**Render** — two fallbacks:
- Line 834 (take-label): `this.config?.take_pill_label || localize(this._lang, 'daily.take_pill')`
- Lines 828–830 (aria-label for safe state): `this.config?.take_pill_label || localize(this._lang, 'aria.take_pill_safe')` — so screen readers announce the actual action.
- Line 858 (pills-left stat-label): `this.config?.pills_left_label || localize(this._lang, 'daily.pills_left')`
- LIMIT REACHED label (`daily.limit_reached`) and its aria-label unchanged.

### `src/localize.ts`

**New config keys**:
- `'config.daily_panel': 'Daily Panel'`
- `'config.graphs_panel': 'Graphs Panel'`
- `'config.stats_panel': 'Stats Panel'`
- `'config.take_pill_label': 'Take Pill Label'`
- `'config.pills_left_label': 'Pills Left Label'`

**New helper keys**:
- `'config.helper.take_pill_label': 'Text shown on the Take Pill button when the limit has not been reached. Defaults to "Take Pill". Change to match the medicine form, e.g. "Inject Dose", "Apply Cream".'`
- `'config.helper.pills_left_label': 'Label for the remaining-amount stat in the Daily pane. Defaults to "Pills left". Change to match the form/unit, e.g. "Amount Left (ml)", "Doses Left".'`

**Renamed key**:
- `'config.graph_options': 'Graph'` → `'config.graphs_panel': 'Graphs Panel'` (remove old key, add new)

**Note on `computeLabel`**: The existing `computeLabel` does `localize(lang, 'config.' + schema.name)`. For expandable items, `schema.name` is the expandable's `name` field (e.g. `daily_panel`), so adding `config.daily_panel` etc. makes the dropdown headers localize correctly. The existing `title` property on expandables will be removed in favor of computeLabel-driven labels for consistency, EXCEPT `chips` which keeps its `title: 'Custom Chips'` since `config.chips` already exists and computeLabel handles it.

### `README.md`
- Add `take_pill_label` and `pills_left_label` rows to Configuration Options table.
- Note the restructured editor layout (panel-grouped dropdowns).

## Files touched
- `src/ax-dose-logger-card.ts` (interface, schema restructure, render fallbacks)
- `src/localize.ts` (5 new keys, 1 renamed key)
- `dist/ax-dose-logger-card.js` (rebuilt)
- `README.md` (2 new config rows + editor layout note)

## Verification
- `yarn run build` — expect exit 0.
- Manual: open card editor → verify three panel dropdowns (Daily Panel, Graphs Panel, Stats Panel) with correct labels; expand Daily Panel → see take_pill_icon, take_pill_label, pills_left_label, and nested Custom Chips; expand Stats Panel → see 3-column toggle; set take_pill_label to "Inject Dose" → button text + aria update; set pills_left_label to "Amount Left (ml)" → stat label updates.