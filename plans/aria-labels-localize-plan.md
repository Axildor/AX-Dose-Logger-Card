# Plan — #8 aria-labels + #9 localization (accessibility/i18n)

## Overview

Two findings, very different scopes:
- **#8 (aria-labels)** — small, additive, zero risk. Add `aria-label` to icon-only buttons; add `role="button"` + `tabindex` + keyboard handler to clickable divs.
- **#9 (localization)** — large, mechanical, low risk. Create a `localize` helper + English language file; route all ~70 user-facing strings through it. Output is identical (English-only), but infrastructure enables future translations.

---

## #8 — Accessibility: aria-labels on interactive elements

### Current state
Zero `aria-label`, `role`, or `title` attributes in the entire file. Screen readers get nothing for icon-only buttons, and clickable `<div>`s are invisible to keyboard/AT users.

### Elements needing fixes

#### A. Icon-only buttons (screen readers announce nothing)

| Element | Location | Fix |
|---|---|---|
| Carousel prev button | [`_renderPane2()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:794) | `aria-label="Previous graph"` |
| Carousel next button | [`_renderPane2()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:804) | `aria-label="Next graph"` |
| Tools pane tab | [`_renderPaneSelector()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:1319) — `label: ''` | `aria-label="Tools"` |

#### B. Clickable `<div>`s (not keyboard-accessible, not announced as interactive)

| Element | Location | Fix |
|---|---|---|
| `.med-name` div | [`_renderPane1()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:722) — `@click` opens device info | `role="button" tabindex="0" aria-label="View device info" @keydown` |
| `.stat-pill.clickable` div | [`_renderPane1()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:740) — `@click` opens refill | `role="button" tabindex="0" aria-label="Refill medication" @keydown` |

For the keyboard handler, add a small private helper:
```typescript
private _onKeyActivate(e: KeyboardEvent, handler: () => void): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handler();
  }
}
```

#### C. Buttons with text (already announced, but adding descriptive aria-label improves context)

| Element | Fix |
|---|---|
| Take Pill button | `aria-label` = dynamic: "Take pill" or "Limit reached, override available" |
| Timeframe chips | `aria-label` = full word: "48 hours" / "7 days" / "14 days" / "30 days" |
| Pane selector (Daily/Graphs/Stats) | Already have text spans — adequate, no change needed |
| Tool buttons | Already have text spans — adequate, no change needed |
| Dialog buttons | Already have text — adequate, no change needed |

### What does NOT change
- No visual changes — `aria-label` and `role`/`tabindex` are invisible to sighted users
- All click handlers remain identical
- The keyboard handler on clickable divs only adds Enter/Space activation (standard button behavior)

---

## #9 — Localization infrastructure

### Current state
All ~70 user-facing strings are hardcoded English. No `localize` helper, no language file. The `hass.localize` / `hass.locale` APIs are unused.

### Approach
Create a lightweight `localize` helper with a static English translation map. Route all user-facing strings through it. Since only English is provided, the output is identical — this is purely infrastructure that enables future translations.

**Why not JSON files + dynamic imports?** The card's build uses Rollup with a single-file output. Dynamic imports of JSON would complicate the build. A static TypeScript object is simpler, type-safe, and works with the existing build.

### New file: `src/localize.ts`

```typescript
// Lightweight localization helper for the Pill Logger card.
// Currently English-only; adding a new language is just adding
// another key to the `translations` object.

const translations: Record<string, Record<string, string>> = {
  en: {
    // ── Card-level ──
    'card.loading': 'Loading...',
    'card.placeholder_title': 'Pill Logger Card',
    'card.placeholder_subtitle': 'Please select a device in the visual editor to begin.',

    // ── Pane tabs ──
    'pane.daily': 'Daily',
    'pane.graphs': 'Graphs',
    'pane.stats': 'Stats',
    'pane.tools': 'Tools',

    // ── Daily pane ──
    'daily.take_pill': 'Take Pill',
    'daily.limit_reached': 'LIMIT REACHED',
    'daily.last': 'Last',
    'daily.next': 'Next',
    'daily.over': 'over',
    'daily.safe_to_take': 'Safe to take',
    'daily.pills_left': 'Pills left',
    'daily.na': 'N/A',

    // ── Graphs pane ──
    'graphs.bar_title': '14-day taken tracker',
    'graphs.line_title': 'Amount in Body',
    'graphs.empty_bar': 'No dose data yet',
    'graphs.loading_history': 'Loading history...',
    'graphs.timeframe_48h': '48H',
    'graphs.timeframe_7d': '7D',
    'graphs.timeframe_14d': '14D',
    'graphs.timeframe_30d': '30D',
    'graphs.aria_prev': 'Previous graph',
    'graphs.aria_next': 'Next graph',

    // ── Stats pane ──
    'stats.total_doses': 'Total Doses',
    'stats.days_since_first_dose': 'Days Since First Dose',
    'stats.last_dose': 'Last Dose',
    'stats.strength': 'Strength',
    'stats.amount_in_body': 'Amount in Body',
    'stats.steady_state': 'Steady State',
    'stats.steady_state_reached': 'Reached ✓',
    'stats.steady_state_days': '{days} days',
    'stats.avg_7_day': '7-Day Average',
    'stats.avg_14_day': '14-Day Average',
    'stats.avg_30_day': '30-Day Average',
    'stats.avg_yearly': 'Yearly Average',
    'stats.avg_running': '{days}-Day Average',
    'stats.adherence_7_day': '7-Day Adherence',
    'stats.adherence_14_day': '14-Day Adherence',
    'stats.adherence_30_day': '30-Day Adherence',
    'stats.adherence_365_day': '365-Day Adherence',
    'stats.adherence_running': '{days}-Day Adherence',

    // ── Averages grid (short labels) ──
    'averages.avg_7_day': '7-Day Avg',
    'averages.avg_14_day': '14-Day Avg',
    'averages.avg_30_day': '30-Day Avg',
    'averages.avg_year': 'Year Avg',
    'averages.avg_running': '{days}-Day Avg',
    'averages.adh_7_day': '7d Adh',
    'averages.adh_14_day': '14d Adh',
    'averages.adh_30_day': '30d Adh',
    'averages.adh_365_day': '365d Adh',
    'averages.adh_running': '{days}d Adh',

    // ── Tools pane ──
    'tools.adherence_header': 'Adherence Tools',
    'tools.general_header': 'General Tools',
    'tools.reset_adherence': 'Reset Adherence %',
    'tools.mark_adherence_taken': 'Mark Last Adherence Taken',
    'tools.reset_history': 'Reset History',
    'tools.undo_dose': 'Undo Dose',
    'tools.empty': 'No maintenance tools available for this medication.',

    // ── Tools dialog descriptors ──
    'tools.desc.reset_adherence': 'Clears the adherence percentage history for all windows. Does NOT affect Amount in Body, dose count, or any other sensor.',
    'tools.desc.mark_adherence_taken': 'Marks the most recent missed dose slot as taken for adherence calculation only. Does NOT add a dose to the pharmacokinetics model or dose count.',
    'tools.desc.reset_history': 'Clears ALL dose history across every sensor — adherence, Amount in Body, totals, and last dose. This cannot be undone.',
    'tools.desc.undo_dose': 'Removes the most recently logged dose from all sensors, including the pharmacokinetics model and adherence calculation.',

    // ── Dialogs ──
    'dialog.warning': 'Warning',
    'dialog.cancel': 'Cancel',
    'dialog.confirm': 'Confirm',
    'dialog.refill.title': 'Refill Medication',
    'dialog.refill.placeholder': 'Enter number of pills',
    'dialog.refill.confirm': 'Refill',
    'dialog.override.body': 'Pill limit does not reset until: {expiry}. Override?',
    'dialog.override.confirm': 'Override',
    'dialog.device_info.button': 'To Device info',
    'dialog.device_info.aria': 'View device info',
    'dialog.refill.aria': 'Refill medication',

    // ── Config form labels ──
    'config.device_id': 'Device',
    'config.big_text': 'Big Text',
    'config.color_scheme': 'Color Scheme',
    'config.name': 'Name Override',
    'config.chips': 'Custom Chips',
    'config.chip_1': 'Chip 1 (optional)',
    'config.chip_1_label': 'Chip 1 Label',
    'config.chip_2': 'Chip 2 (optional)',
    'config.chip_2_label': 'Chip 2 Label',
    'config.chip_3': 'Chip 3 (optional)',
    'config.chip_3_label': 'Chip 3 Label',
    'config.chip_4': 'Chip 4 (optional)',
    'config.chip_4_label': 'Chip 4 Label',
    'config.graph_options': 'Graph',
    'config.show_amount_in_body': 'Amount in Body Graph',
    'config.show_day_avg_boxes': 'Day Avg Boxes',
    'config.show_adherence_boxes': 'Adherence Boxes (If available)',
    'config.stats_3_columns': '3-Column Stats',

    // ── Config form helpers ──
    'config.helper.device_id': 'Select your Pill Logger medication device.',
    'config.helper.big_text': 'When off, all text is 2px smaller. Daily pane shrinks further for compact view.',
    'config.helper.color_scheme': 'Sets the accent color for buttons, icons, and highlights across the card.',
    'config.helper.name': 'Custom name for this medication. Leave empty to use the device name.',
    'config.helper.chip_label': "Custom display name for this chip. Leave empty to use the entity's friendly name.",
    'config.helper.chip': 'Entity from the selected device to display as a chip on the Daily pane.',
    'config.helper.show_amount_in_body': 'Show the Amount in Body line graph as a second slide in the Graphs pane.',
    'config.helper.show_day_avg_boxes': 'Show the 7/14/30-day and yearly average boxes beneath the bar graph.',
    'config.helper.show_adherence_boxes': 'Show the 7/14/30/365-day adherence percentage boxes beneath the bar graph. Only applies when the device has adherence sensors.',
    'config.helper.stats_3_columns': 'Display statistics in 3 columns instead of 2.',

    // ── Color scheme labels ──
    'color.default': 'Default (HA Theme)',
    'color.blue': 'Blue',
    'color.red': 'Red',
    'color.green': 'Green',
    'color.yellow': 'Yellow',
    'color.orange': 'Orange',
    'color.purple': 'Purple',
    'color.pink': 'Pink',
    'color.teal': 'Teal',
    'color.brown': 'Brown',
    'color.coral': 'Coral',
    'color.slate': 'Slate',
    'color.gold': 'Gold',
    'color.grey': 'Grey',

    // ── setConfig error ──
    'setconfig.error.device_required': 'A device is required for the Pill Logger card.',

    // ── aria-labels ──
    'aria.take_pill_safe': 'Take pill',
    'aria.take_pill_limit': 'Limit reached, override available',
    'aria.timeframe_48h': '48 hours',
    'aria.timeframe_7d': '7 days',
    'aria.timeframe_14d': '14 days',
    'aria.timeframe_30d': '30 days',
  },
};

export function localize(
  lang: string,
  key: string,
  params?: Record<string, string | number>
): string {
  let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
```

### Changes to `pill-logger-card.ts`

1. **Import**: `import { localize } from './localize';`
2. **Add `_onKeyActivate` helper method** for keyboard accessibility on clickable divs
3. **Replace all hardcoded strings** with `localize(this.hass!.language, 'key')` calls
4. **Add aria-labels** to all interactive elements per #8 above
5. **Update `computeLabel`/`computeHelper`** to accept `hass` as 3rd param and use `localize`
6. **Update `setConfig` throw message** to use `localize('en', 'setconfig.error.device_required')` (no `this.hass` available in `setConfig`)
7. **Update color scheme labels** in `getConfigForm` schema to use `localize`

### Dynamic strings with parameters
Strings like `${daysSince}-Day Average` become:
```typescript
localize(this.hass!.language, 'stats.avg_running', { days: daysSince })
```
The en.json value is `"{days}-Day Average"` — the `localize` function interpolates `{days}`.

### Config form `computeLabel`/`computeHelper`
HA passes `hass` as the 3rd argument to these callbacks in newer versions. Update signatures:
```typescript
computeLabel: (schema: any, _data: any, hass: any) => {
  return localize(hass?.language || 'en', 'config.' + schema.name);
},
computeHelper: (schema: any, _data: any, hass: any) => {
  return localize(hass?.language || 'en', 'config.helper.' + schema.name);
},
```
The helper key mapping needs a small lookup for chip fields (chip_label vs chip pattern).

### What does NOT change
- **Number/date formatting** — the card's custom `_formatInteger()`, `_toLocalDateKey()`, `_computeTimeSinceLastDose()`, `_computeNextDose()` functions are kept as-is. Migrating to `hass.formatEntityState()` / `hass.locale` would change displayed output and risks visual regressions. This can be a future batch.
- **Entity state values** — sensor states (e.g., "42", "3.5") come from the backend and are already numeric. No localization needed.
- **Chip entity names** — come from `friendly_name` attribute, already localized by the backend.
- **Medication name** — comes from device name or config `name` override, already localized by the backend.

---

## Functionality-preservation checklist

### #8 (aria-labels)
- [x] No visual changes — aria-label/role/tabindex are invisible
- [x] All click handlers remain identical
- [x] Keyboard handler only adds Enter/Space activation (standard button behavior)
- [x] Clickable divs gain `tabindex="0"` — they become focusable (improvement, not regression)

### #9 (localization)
- [x] All English strings are moved verbatim to the translation map — output is identical
- [x] Dynamic strings with `{param}` placeholders produce the same output as template literals
- [x] `localize` falls back to English, then to the key itself — no crashes on missing keys
- [x] `setConfig` error message uses `localize('en', ...)` (no `this.hass` available)
- [x] Config form `computeLabel`/`computeHelper` accept `hass` as 3rd param (HA passes it); falls back to `'en'` if undefined
- [x] Number/date formatting functions unchanged — no visual regressions
- [x] Entity state values, chip names, medication name — unchanged (backend-localized)

## Verification
- `yarn build` — clean compilation
- Grep: zero hardcoded English strings in render methods (all routed through `localize`)
- Grep: all icon-only buttons have `aria-label`; all clickable divs have `role="button"` + `tabindex="0"`

## Files to modify/create
- `src/localize.ts` — **new** — localization helper + English translation map
- `src/pill-logger-card.ts` — import `localize`; add `_onKeyActivate` helper; replace all hardcoded strings; add aria-labels; update `computeLabel`/`computeHelper`