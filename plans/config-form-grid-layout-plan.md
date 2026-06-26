# Plan: Config Form Column Layout (Grid) — Full Restructure

## Goal
Make the config form more compact by placing related fields side-by-side in 2-column grids, like Mushroom cards.

## Constraint
HA's `type: 'grid'` uses CSS auto-fill with equal-width columns (`repeat(auto-fill, minmax(column_min_width, 1fr))`). **No colspan/fractional columns** — only equal 50/50 splits are possible. A 1/3 + 2/3 split requires a fully custom editor (out of scope).

## All grid groupings

### Top-level (outside expandables)
1. `device_id` (full width — stays alone)
2. **grid**: `big_text` + `hide_nav_bar`
3. **grid**: `color_scheme` + `name`

### Inside `daily_panel` expandable
4. **grid**: `take_pill_icon` + `take_pill_label`
5. `safe_to_take_box` (nested expandable) — inside it:
   - **grid**: `safe_to_take_entity` + `safe_to_take_label`
   - `safe_to_take_tap_action` (full width — ui-action selector is wide)
   - `safe_to_take_hold_action` (full width)
   - `safe_to_take_double_tap_action` (full width)
6. `pills_left_label` (full width — stays alone, no natural pair)
7. `chips` (nested expandable) — inside it, 4 grids:
   - **grid**: `chip_1` + `chip_1_label`
   - **grid**: `chip_2` + `chip_2_label`
   - **grid**: `chip_3` + `chip_3_label`
   - **grid**: `chip_4` + `chip_4_label`

### Inside `graphs_panel` expandable
8. `show_amount_in_body` (full width — toggle)
9. `amount_in_body_default_timeframe` (full width — select dropdown)
10. **grid**: `show_day_avg_boxes` + `show_adherence_boxes`

### Inside `stats_panel` expandable
11. `stats_3_columns` (full width — stays alone)

## Schema structure (pseudocode)
```
schema: [
  { name: 'device_id', ... },                          // full width

  { type: 'grid', column_min_width: 250, schema: [    // 50/50
    { name: 'big_text', ... },
    { name: 'hide_nav_bar', ... },
  ]},

  { type: 'grid', column_min_width: 250, schema: [    // 50/50
    { name: 'color_scheme', ... },
    { name: 'name', ... },
  ]},

  { type: 'expandable', name: 'daily_panel', schema: [
    { type: 'grid', column_min_width: 250, schema: [  // 50/50
      { name: 'take_pill_icon', ... },
      { name: 'take_pill_label', ... },
    ]},
    { type: 'expandable', name: 'safe_to_take_box', schema: [
      { type: 'grid', column_min_width: 250, schema: [  // 50/50
        { name: 'safe_to_take_entity', ... },
        { name: 'safe_to_take_label', ... },
      ]},
      { name: 'safe_to_take_tap_action', ... },       // full width
      { name: 'safe_to_take_hold_action', ... },      // full width
      { name: 'safe_to_take_double_tap_action', ... },// full width
    ]},
    { name: 'pills_left_label', ... },                // full width
    { type: 'expandable', name: 'chips', schema: [
      { type: 'grid', column_min_width: 200, schema: [
        { name: 'chip_1', ... },
        { name: 'chip_1_label', ... },
      ]},
      { type: 'grid', column_min_width: 200, schema: [
        { name: 'chip_2', ... },
        { name: 'chip_2_label', ... },
      ]},
      { type: 'grid', column_min_width: 200, schema: [
        { name: 'chip_3', ... },
        { name: 'chip_3_label', ... },
      ]},
      { type: 'grid', column_min_width: 200, schema: [
        { name: 'chip_4', ... },
        { name: 'chip_4_label', ... },
      ]},
    ]},
  ]},

  { type: 'expandable', name: 'graphs_panel', schema: [
    { name: 'show_amount_in_body', ... },
    { name: 'amount_in_body_default_timeframe', ... },
    { type: 'grid', column_min_width: 250, schema: [
      { name: 'show_day_avg_boxes', ... },
      { name: 'show_adherence_boxes', ... },
    ]},
  ]},

  { type: 'expandable', name: 'stats_panel', schema: [
    { name: 'stats_3_columns', ... },
  ]},
]
```

## `column_min_width` rationale
- **250px** for most grids: the config dialog is ~500px wide on desktop, so 2 columns at 250px min fits. On mobile (<500px), fields stack to 1 column automatically.
- **200px** for chip grids: chip entity + label are shorter fields; 200px allows 2 columns even on narrower screens.

## Files to modify
1. [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — `getConfigForm` schema: wrap field pairs in `type: 'grid'` blocks.
2. [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuild.
3. Memory-bank — update.

## Verification
- `yarn run build` — clean compile.
- Manual: open card config editor → fields appear side-by-side on desktop, stack on mobile.