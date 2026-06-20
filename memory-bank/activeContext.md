# Active Context — Pill Logger Card (Frontend)

## Current Status
**Complete**: Hide Navigation Bar toggle — added `hide_nav_bar` config option to the card configurator that hides the bottom Daily/Graphs/Stats/Tools navigation bar. Intended for dashboards that only need the Daily pane.

### Config Option: `hide_nav_bar`
- New `hide_nav_bar?: boolean` field on `PillLoggerCardConfig` interface (line 28).
- Defaults to `false` (undefined → bar shown). Uses `!== true` opt-in pattern so existing dashboards are unaffected.
- When `true`, `_renderPaneSelector()` is replaced with `nothing` in `render()`, completely removing the bottom nav bar.
- Card stays on the Daily pane (the `connectedCallback` already resets `_activePane = 'daily'`).
- Added to `getConfigForm()` schema as a top-level boolean toggle after `stats_3_columns`.
- Localization: `config.hide_nav_bar` label ("Hide Navigation Bar") and `config.helper.hide_nav_bar` helper text.
- README Configuration table updated with the new option.

**Previous**: Graph timescale options — added 30D and 60D timescales to the taken bar graph, and 12H timescale to the Amount in Body line graph (still defaults to 48H).

## What Was Changed

### Hide Navigation Bar Toggle (2026-06-20)
- **`src/pill-logger-card.ts`** — added `hide_nav_bar?: boolean` to config interface; gated `_renderPaneSelector()` in `render()` with `this.config?.hide_nav_bar !== true ? … : nothing`; added `hide_nav_bar` boolean selector to `getConfigForm()` schema after `stats_3_columns`.
- **`src/localize.ts`** — added `config.hide_nav_bar` and `config.helper.hide_nav_bar` strings.
- **`README.md`** — added `hide_nav_bar` row to Configuration Options table.
- **`dist/pill-logger-card.js`** — rebuilt via `yarn run build`, clean compilation.
- **`memory-bank/activeContext.md`** — this file.
- **`memory-bank/progress.md`** — appended section with checklist.

## Files Modified
- `src/pill-logger-card.ts` — config interface, render() gate, getConfigForm() schema.
- `src/localize.ts` — two new localization keys.
- `README.md` — Configuration Options table.
- `dist/pill-logger-card.js` — rebuilt.
- `memory-bank/activeContext.md` — this file.
- `memory-bank/progress.md` — appended section.

## Key Design Decisions
1. **Default = shown** — `hide_nav_bar` defaults to `false` (undefined → bar shown). Hiding is the opt-in direction, so existing dashboards are unaffected.
2. **Hide the whole bar** — when hidden, the card stays on the Daily pane. Users who hide the bar are explicitly opting into a Daily-only experience. No need for alternative pane-switching mechanisms.
3. **No stub-config change** — `getStubConfig()` only seeds `device_id` and `show_amount_in_body`. The new optional toggle needs no stub value.
4. **Top-level schema placement** — added after `stats_3_columns` to keep simple boolean toggles grouped; expandable groups (Custom Chips, Graph) stay nested.

## Previous Context
### Graph Timescale Options (2026-06-20)
- New `@state _activeBarTimeframe` field; new `_getBarTimeframeDays()` helper; `_bucketByDay(dayCount)` parameterized; new `_renderBarTimeframeChips()` and `_handleBarTimeframeChange()`; bar graph renders timeframe chips; bar title uses `{days}` interpolation; label decimation; `_getTimeframeHours()` gains `'12h' → 12`; `_renderTimeframeChips()` adds `'12h'`; line graph time-label branch for 12h with 3h step.

### Shared Fetch-Token Race Fix (2026-06-20)
- Replaced single `_fetchToken` with per-fetch-type counters `_amountFetchToken` and `_doseFetchToken`.

### Batch 1–9 (2026-05 to 2026-06)
- See `memory-bank/progress.md` for full history.
