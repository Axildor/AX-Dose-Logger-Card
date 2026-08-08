# Progress — Pill Logger Card (Frontend)

> ℹ️ **Older history (lines 2-2635 of the pre-truncation file) is archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1).** The sections below are the ~16 most recent feature completions; read the archive only if you need older context.

## MEDIUM + LOW Audit Findings Fix — Complete

### Planning
- [x] Plan M1-M4 + L1-L7 fixes → plans/fix-medium-low-audit-findings-plan.md

### L1 — Unused svg import
- [x] ax-dose-logger-card.ts: removed `svg` from `import { LitElement, html, svg, css, nothing } from 'lit'`

### L2 — Dead localize keys
- [x] localize.ts: removed `pane.caffeine`, `caffeine.placeholder` + comment, `config.graph_options` + backward-compat comment

### L3 — Dead type re-exports
- [x] ax-dose-logger-card.ts: removed the 8-type `export type { ... } from './types.js'` block (all downstream imports from types.js directly)

### L4 — _predictLowToken should not be @state()
- [x] ax-dose-logger-card.ts: demoted `@state() private _predictLowToken` to `private _predictLowToken` (plain field)
- [x] ax-dose-logger-card.ts: removed `'_predictLowToken'` from the shouldUpdate whitelist

### L5 — Duplicate _getTimeframeHours()
- [x] helpers.ts: added exported `getTimeframeHours(timeframe)` function
- [x] ax-dose-logger-card.ts: imported `getTimeframeHours as getTimeframeHoursHelper`; `_getTimeframeHours()` body replaced with delegate
- [x] graphs-panel.ts: imported `getTimeframeHours` from helpers; `_getTimeframeHours()` body replaced with delegate

### L6 — _pendingTracking not cleared on disconnect
- [x] ax-dose-logger-card.ts: added `this._pendingTracking.clear()` to connectedCallback() (after dialog resets)

### L7 — _computeEntities() double iteration (DEFERRED)
- [x] Decision: deferred — merging the two loops risks a regression (suffix-based vs attribute-based logic); result is cached so perf impact is minimal

### M1 — Mutating @state inside render()
- [x] ax-dose-logger-card.ts: new `willUpdate(changedProps)` method with the auto-fallback logic (tracking→daily, master/medicine pane mismatch)
- [x] ax-dose-logger-card.ts: removed the 3 mutation lines + comments from render()

### M2 — 30s _tick doesn't propagate to panels
- [x] ax-dose-logger-card.ts: added `.tick=${this._tick}` to daily/stats/drinks/inventory panel bindings in render()
- [x] daily-panel.ts: added `@property({ attribute: false }) tick: number = 0`
- [x] stats-panel.ts: added `@property({ attribute: false }) tick: number = 0`
- [x] drinks-panel.ts: added `@property({ attribute: false }) tick: number = 0`
- [x] inventory-panel.ts: added `@property({ attribute: false }) tick: number = 0`

### M3 — Global CSS injection (cross-card pollution)
- [x] No code change — largely resolved by H1 (observer only runs while editor is open); other ha-form elements behind the modal dialog are not user-visible. Documented as accepted.

### M4 — History re-fetch on every state change while on graphs pane
- [x] ax-dose-logger-card.ts: added `_graphsRefetchTimer` field + `GRAPHS_REFETCH_DEBOUNCE_MS = 500` static
- [x] ax-dose-logger-card.ts: updated() hass branch now debounces 3 fetches via setTimeout(500ms) + re-resolves entities inside timeout
- [x] ax-dose-logger-card.ts: disconnectedCallback() clears the debounce timer

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3.1s)
- [x] No projectstructure.md change (no files added/renamed/deleted)
- [x] activeContext.md updated (new Current Status, H1/H2 status archived)
- [x] progress.md updated (this section)

## Master Stats Box Removal + Inventory 2-Line "Est. days left"
- [x] Step 1: Context grounding (read frontend memory banks, stats-panel, inventory-panel, types, _computeEntities, _getDrinksOfSubstance)
- [x] Step 2: Architecture plan (../Home-Assistant-Pill-Logger/plans/master-days-left-and-inventory-2line-plan.md)
- [x] Step 3: Remove master totalDoses mapping in _computeEntities (dose_count + pk_model block)
- [x] Step 4: Remove master days_left role mapping in _computeEntities (masterRole === 'days_left' block)
- [x] Step 5: Add daysLeftEntityId to DrinkInfo type + JSDoc
- [x] Step 6: Resolve daysLeftEntityId in _getDrinksOfSubstance (sensor branch: role === 'days_left')
- [x] Step 7: Add daysLeftEntityId to _relevantStateChanged inventory watch list
- [x] Step 8: Restructure inventory-panel col-1 to 2-line layout (name+stock | Est. days left+value) with icon staying in exact current position (left, vertically centered via align-items:center); add .stat-text/.stat-line/.stat-sublabel/.stat-subvalue CSS
- [x] Step 9: Reuse stats.days_left_est localize key for 2nd line label (no new strings)
- [x] Step 10: Update frontend README (Inventory col-1 description + Stats Drinks section rows)
- [x] Step 11: Verification — yarn run build exit 0 (3.3s, no warnings)
- [x] Step 12: Update memory-bank files (activeContext.md, progress.md)

**Key decisions:**
1. **Icon position preserved exactly** — stays at the left (after padding + gap), vertically centered against the 2-line text block via align-items:center. Does NOT move to box center.
2. **Plain number, no unit suffix** — days-left value shown as a plain number (e.g. 12), not 12 d. The label conveys the unit.
3. **Reuse stats.days_left_est localize key** — no new translation strings.
4. **Master totalDoses removal is master-only** — medicine devices keep suffix-based _total_doses mapping.
5. **Granular-drink daysLeft mapping preserved** — classifier completeness; daysLeftEntityId on DrinkInfo is the per-drink variant for the Inventory panel.
6. **_relevantStateChanged watch list** — daysLeftEntityId added so days-left state changes trigger inventory re-render without waiting for the 30s tick.

## Inventory Panel Refinement — Font Parity + "left" Suffix + Stats Formatting
- [x] Step 1: Change 2nd-line "Est. days left" label + value font sizes to match the 1st line (label 15px, value 18px)
- [x] Step 2: Add "left" suffix to the device-name line (new inventory.left localize key) so it reads "device-name left"
- [x] Step 3: Reformat Inventory to match Stats page box sizing + spacing (2-col grid gap 8px, padding 10px 8px, border-radius 10px, primary-tinted 0.05 bg, 16px icon in .stat-pill-header row)
- [x] Step 4: Update frontend README Inventory section
- [x] Step 5: Verification — yarn run build exit 0 (3s, no warnings)
- [x] Step 6: Update memory-bank files (activeContext.md, progress.md)

**Key decisions:**
1. **2nd-line font parity** — label 15px + value 18px (was 13px/16px), matching the 1st-line device name + stock so both lines are equally prominent.
2. **"left" suffix** — new `inventory.left` localize key ("left") appended to the drink name → "Coffee left 12". Conveys that the number is the remaining stock.
3. **Stats visual language** — .stat-pill + .avg-cell now mirror .stat-cell (padding 10px 8px, border-radius 10px, bg rgba 0.05, 8px grid gap, 16px icon at opacity 0.7 in a .stat-pill-header row). Icon stays in its exact current position (left, vertically centered via align-items:center on the header row).
4. **.stat-pill restructured** — was a row flex (icon direct child); now a column flex with a .stat-pill-header wrapper holding icon + 2-line .stat-text, matching the Stats .stat-cell internal structure.

## Inventory Panel Refinement 2 — Day Average Font Parity + Line Spacing + Icon 50% Bigger
- [x] Step 1: Increase .avg-label 13px→15px + .avg-value 16px→18px (match inventory box 15px/18px)
- [x] Step 2: Confirm line spacing parity (.stat-text gap 4px == .avg-cell gap 4px — already identical; perceived difference was the font-size mismatch fixed in step 1)
- [x] Step 3: Make icon 50% bigger (.stat-pill-header ha-icon --mdc-icon-size 16px→24px)
- [x] Step 4: Verification — yarn run build exit 0 (3s, no warnings)
- [x] Step 5: Update memory-bank files (activeContext.md, progress.md)

## Inventory Panel Refinement 3 — Inter-line Gap 4px→3px
- [x] Step 1: Decrease .stat-text gap 4px→3px (col-1 between the two .stat-line rows)
- [x] Step 2: Decrease .avg-cell gap 4px→3px (col-2 between the two .avg-line rows)
- [x] Step 3: Verification — yarn run build exit 0 (2.8s, no warnings)
- [x] Step 4: Update memory-bank files (activeContext.md, progress.md)

## Inventory Panel Refinement 4 — Inter-line Gap 3px→2px + line-height 1.1
- [x] Step 1: Decrease .stat-text + .avg-cell gap 3px→2px
- [x] Step 2: Add line-height: 1.1 to .stat-text + .avg-cell (root cause: default ~1.2 line-height dwarfed the 1px gap change)
- [x] Step 3: Verification — yarn run build exit 0 (3.1s, no warnings)
- [x] Step 4: Update memory-bank files (activeContext.md, progress.md)

## Sleep Disruption Popup — README Link + Live Summary + Wider Box (2026-07-11)

### Goal
Three improvements to the card-internal Sleep Disruption popup dialog (Drinks panel → Disruption box tap on a Master Tracker card): (1) add a clickable link to the integration README's per-substance Sleep Disruption Bands section (was a static italic "See README" line); (2) show the live Disruption band + ETA Low (HH:MM) at the top of the dialog body so they're visible at a glance; (3) make the dialog a bit wider.

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank (activeContext, progress), `_renderSleepDisruptionDialog` in `ax-dose-logger-card.ts`, localize strings, backend README anchors, HA Frontend `ha-dialog` width presets via Context7
- [x] Step 2: Architecture plan — `plans/sleep-disruption-popup-readme-link-plan.md` (3-part design, key decisions, Mermaid before/after)
- [x] Step 3: User approval — plan approved, proceed to Code mode
- [x] Step 4: `src/localize.ts` — replaced the trailing `*See README for full biological breakdown.*` italic line with a Markdown link `[See README for full biological breakdown.](https://github.com/Axildor/AX-Dose-Logger#caffeine--sleep-disruption-bands)` in `dialog.sleep_disruption.caffeine` + the `#alcohol--sleep-disruption-bands` anchor in `.alcohol`; added 3 new keys: `dialog.sleep_disruption.disruption_label` ("Disruption"), `.eta_low_label` ("ETA Low"), `.not_applicable` ("—")
- [x] Step 5: `src/ax-dose-logger-card.ts` `_renderSleepDisruptionDialog` — `width="small"` → `width="medium"` (580px); added live summary read (`this._resolveEntities()` + `this._getState(entities.sleepDisruption)` + `this._getState(entities.estimatedLowTime)`; Disruption title-cased, ETA Low formatted via `toLocaleTimeString({ hour: '2-digit', minute: '2-digit', hour12: false })`); rendered new `.disruption-summary` block (2 `.disruption-summary-row` rows) above `<ha-markdown>`
- [x] Step 6: `src/ax-dose-logger-card.ts` CSS — added `.disruption-summary` (primary-tinted `rgba(rgb-primary, 0.06)` surface, `border-radius: 10px`, `padding: 10px 12px`, `margin-bottom: 12px`) + `.disruption-summary-row` (space-between baseline) + `.disruption-summary-label` (13px uppercase secondary) + `.disruption-summary-value` (16px weight-600 primary) after `.dialog-body--center`
- [x] Step 7: Verification — `yarn run build` clean (exit 0, 2.1s, no warnings); README anchors verified via `grep -nE "^#### (Caffeine|Alcohol) — Sleep Disruption Bands" README.md` (backend repo lines 290 + 301)
- [x] Step 8: Update memory-bank — activeContext.md (new Current Status + archive previous), progress.md (this section)

### Key decisions
1. **`width="medium"` (580px), not `large`** — `medium` is the HA default preset; `large` (1024px) is for entity-picker grids / multi-column forms. A 4-row band table + summary fits `medium` comfortably. HA Frontend docs explicitly discourage custom sizing.
2. **Live state read at render time, no new fetch** — the popup renders inside the card's `render()`, which re-runs on hass state changes via `shouldUpdate` + `_relevantStateChanged`. Reading `this._getState(entities.sleepDisruption)` / `this._getState(entities.estimatedLowTime)` at render time gives fresh values on every coordinator push (backend pushes on every dose + 1-min decay tick). Mirrors the Log Drink popup pattern.
3. **Title-case the Disruption band for display** — sensor state is `None`/`Low`/`Moderate`/`High` (already title-case), but the Disruption box title-cases the first letter for display; the popup follows the same convention. `unknown`/`unavailable` → `-`.
4. **ETA Low format mirrors the Stats panel + Log Drink popup** — `toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false })` → 24-hour `HH:MM`. Same format as `stats-panel.ts` + the Log Drink popup `formatLow`. `—` when unknown/in-Low/unparseable.
5. **Markdown link in the localize string** — `ha-markdown` renders standard Markdown links, so replacing the trailing italic line with `[See README...](url)` makes it clickable with zero template changes. The link lives in the localize string alongside the band text.
6. **Link to the backend README, not the card README** — the band-by-band biological breakdown lives in the integration README (`#caffeine--sleep-disruption-bands` / `#alcohol--sleep-disruption-bands`); the card README documents installation/config. URL = integration's GitHub repo (`manifest.json` → `documentation`: `https://github.com/Axildor/AX-Dose-Logger`). GitHub anchor algorithm confirmed for em-dash headings.
7. **Summary box above the Markdown, not inside it** — styled `.disruption-summary` div keeps the live values visually distinct from the static band-description text + lets us style them with the card's primary-tinted surface + bold values.
8. **No `types.ts` change** — `ResolvedEntities` already has `sleepDisruption` + `estimatedLowTime`. No new `CardController` method needed.
9. **No backend change** — the backend sensors are correct; the popup just wasn't surfacing the live state. Pure frontend rendering change. No `projectstructure.md` change (no files added/renamed/deleted).

## Sleep Disruption Popup — Refinement (all 3 modes + 3-value summary) (2026-07-11)

### Goal
Two refinements to the Sleep Disruption popup following user feedback: (a) the popup should be the default tap behavior for ALL three `disruption_mode` options (disruption / low_timestamp / low_hours_until), not just the `disruption` mode; (b) the summary at the top should show all three Sleep Disruption-family values (Sleep Disruption / Low - Timestamp / Low - Hours Until), not just Disruption + ETA Low.

### Checklist
- [x] Step 1: `src/components/drinks-panel.ts` — `disruptionTapFallback`: dropped the `disruptionMode === 'disruption'` gate; now opens `c.showSleepDisruptionDialog(substance)` whenever `substance` is resolved (regardless of mode); falls back to `c.openMoreInfo(disruptionDisplayEntity)` only when no substance. `disruptionClickable` guard: `(disruptionMode === 'disruption' && !!substance)` → `!!substance`.
- [x] Step 2: `src/ax-dose-logger-card.ts` `_renderSleepDisruptionDialog` — replaced the 2-row summary (Disruption + ETA Low) with a 3-row summary: Sleep Disruption (band, title-cased) / Low - Timestamp (HH:MM) / Low - Hours Until (numeric, no unit suffix). Added 3rd entity read `this._getState(entities.lowHoursUntil)` with `parseFloat` + `String(num)` formatting (mirrors `stats-panel.ts:125`). HTML template: 3 `.disruption-summary-row` rows.
- [x] Step 3: `src/localize.ts` — `dialog.sleep_disruption.disruption_label` "Disruption" → "Sleep Disruption"; removed `dialog.sleep_disruption.eta_low_label`; added `dialog.sleep_disruption.low_timestamp_label` ("Low - Timestamp") + `dialog.sleep_disruption.low_hours_until_label` ("Low - Hours Until").
- [x] Step 4: Verification — `yarn run build` clean (exit 0, 1.8s, no warnings)
- [x] Step 5: Update memory-bank — activeContext.md (refinement note appended to the Current Status), progress.md (this section)

### Key decisions
1. **Popup useful in all 3 modes** — since the popup now shows all three values in its summary, opening it from any mode gives the user the full picture (the band + both countdown forms). The mode only controls what the *box* displays; the *popup* is the comprehensive view.
2. **3-row summary mirrors the Stats panel** — the formatting (Disruption title-cased; Low - Timestamp HH:MM via `toLocaleTimeString`; Low - Hours Until bare numeric via `String(parseFloat(v))`) is byte-identical to the Stats panel rows, so the popup summary reads as a compact version of the Stats panel's three rows.
3. **Labels match the sensor names** — "Sleep Disruption" / "Low - Timestamp" / "Low - Hours Until" match the Stats panel labels (`stats.sleep_disruption` / `stats.low_timestamp` / `stats.low_hours_until`) so users see consistent naming across surfaces.


## Inventory Panel Label — "Name Unit Left" (2026-07-11)

### Goal
Rework the Master Tracker Inventory panel's col-1 first-line label from `Name left` (e.g. "Coffee left") to `Name Unit Left` (e.g. "Tea Bags Left") so the drink's configured unit-of-measurement is surfaced in the label and the "Left" suffix is capitalized.

### Checklist
- [x] Step 1: `src/localize.ts` — `inventory.left` value `'left'` → `'Left'` (capitalize L)
- [x] Step 2: `src/components/inventory-panel.ts` `_renderRow` — added `stockUnit` (reads `unit_of_measurement` from the stock entity via `c.getAttr`), `unitSegment` (guarded string interpolation with leading space only when a unit exists), `leftLabel` (composed `${d.name}${unitSegment} ${localize('inventory.left')}`); bound `<span class="stat-label">` to `${leftLabel}`
- [x] Step 3: `README.md` — Inventory section col-1 description updated (example "Coffee left 12" → "Tea Bags Left 12"; description `name + "left"` → `name + unit + "Left"`)
- [x] Step 4: Verification — `yarn run build` clean (exit 0, 1.9s, no warnings)
- [x] Step 5: Update memory-bank — activeContext.md (new Current Status + archive previous), progress.md (this section)

### Key decisions
1. **Read the unit live from the stock entity** — `unit_of_measurement` is already on the `DrinkStockNumber` entity (backend `_attr_native_unit_of_measurement`). Reading it at render time via `c.getAttr(d.stockEntityId, 'unit_of_measurement')` keeps it in sync with options-flow reconfiguration without a `DrinkInfo` type change or controller rescan. Mirrors `daily-panel.ts:181` + `drinks-panel.ts:80`.
2. **Graceful fallback to `Name Left`** — `typeof stockUnit === 'string' && stockUnit` guard prevents rendering `undefined`/`null`/empty as a literal and avoids a stray double-space when the unit is absent.
3. **Capitalize "Left"** — title-cased label ("Tea Bags Left") matches the medicine "Pills Left" convention.
4. **No `DrinkInfo` type change / no backend change / no `projectstructure.md` change** — the unit is read from the already-resolved `stockEntityId`; the backend already exposes it. Change is localized to the panel + one localize value.

---

> 📜 **Full history (all ~40 iteration/feature sections back to project start) archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1)** — read it only if the 16 recent sections above lack context for the current task.

## Memory Bank Truncation Restructure (2026-08-08)

**Meta-task (paired with backend repo):** truncated the 2 main narrative memory-bank files (activeContext + progress) to cut per-task token cost; `projectstructure.md` left unchanged (already 72 lines). Full history preserved in `memory-bank/old/`.

- [x] Step 1: Read all 3 frontend memory-bank files to measure sizes
- [x] Step 2: Created `memory-bank/old/` + copied `activeContext.md` (814 lines) + `progress.md` (3041 lines) as byte-identical archives
- [x] Step 3: Truncated `activeContext.md` (814 → 64 lines; kept current status + first prior block with its 4 follow-on refinements)
- [x] Step 4: Truncated `progress.md` (3041 → 414 lines; kept last 16 `##` iteration/feature sections)
- [x] Step 5: Left `projectstructure.md` unchanged (72 lines — already at the floor)
- [x] Step 6: Verified both archives byte-identical to pre-truncation originals; pointer line present in both truncated files

**Result:** frontend per-task read ~3,927 → 550 lines (~86% reduction). Full history in `memory-bank/old/activeContext-archive.md` (814) + `memory-bank/old/progress-archive.md` (3041). See backend repo's `plans/memory-bank-truncation-plan.md` for the full strategy.

## Tools Panel — Dose Tools Heading + Color-Scheme Fix + Confirm-Action Toggle (2026-08-08)

### Planning
- [x] Read frontend memory-bank/activeContext.md + projectstructure.md for context
- [x] Read tools-panel.ts (handlers + render + CSS) to map current 2-section structure + danger class
- [x] Read ax-dose-logger-card.ts _renderToolsDialog + _openToolsDialog + override dialog for dialog patterns
- [x] Read ax-dose-logger-editor.ts schema (stats_panel expandable, computeLabel/computeHelper) for new expandable placement
- [x] Confirmed with user: new "Dose Tools" section holds Skip Dose + Undo Dose; danger class removed from Reset Adherence % / Reset History / Undo Dose (follow color scheme); existing tools dialog made toggleable via new `confirm_tool_actions` config (default ON, fires immediately when off)
- [x] Wrote architecture plan to plans/tools-dose-header-and-confirm-toggle-plan.md

### Implementation
- [x] src/types.ts: added `confirm_tool_actions?: boolean` to `AxDoseLoggerCardConfig` (default-on doc); added `runToolAction(...)` to `CardController` interface (kept `openToolsDialog` for compat)
- [x] src/ax-dose-logger-card.ts: added `_runToolAction` (negative-false check → dialog vs direct fire) + public `runToolAction` accessor next to `openToolsDialog`
- [x] src/components/tools-panel.ts: switched all 7 handlers (adherence reset/cover/skip, reset history, undo, drink undo/reset) from `openToolsDialog` → `runToolAction`; restructured render into 3 sections (Adherence Tools / Dose Tools / General Tools) with `hasDoseTools` gate; removed `danger` class from Reset Adherence %, Reset History, Undo Dose; updated file-header comment
- [x] src/ax-dose-logger-editor.ts: added `settings_panel` expandable after `stats_panel` with `confirm_tool_actions` boolean selector; updated computeHelper expandable-name comment
- [x] src/localize.ts: added `tools.dose_header` ("Dose Tools") + `config.settings_panel` ("Settings") + `config.confirm_tool_actions` ("Confirm Tool Actions") + `config.helper.confirm_tool_actions`
- [x] README.md: restructured Tools section into 3 grouped bullets + confirm-toggle note; added `confirm_tool_actions` row to config options table

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.1s)
- [x] No backend / coordinator / store / config-flow changes (frontend-only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **`runToolAction` centralizes the dialog-vs-direct decision in the container** — the Tools panel stays purely presentational; the controller checks `config?.confirm_tool_actions !== false` so existing configs (without the field) keep the always-confirm behavior with no migration.
2. **Section ordering Adherence → Dose → General** — Dose Tools groups the two dose-level actions (skip + undo) between the adherence actions and the whole-history reset (most destructive, stays last).
3. **Color fix via removing the `danger` class** — the plain `.tool-btn` class already uses `--rgb-primary-color` (overridden at the ha-card level via `getColorOverrides()`), so removing the class is the minimal fix with no new CSS. The `.tool-btn.danger` block stays for the per-granular-drink master Undo/Reset buttons (still red — semantically correct for a destructive per-drink reset).
4. **Default-on via `!== false`** — optional field, negative-false test preserves existing behavior; no config migration needed.

## Unify Card Settings Category Naming — "Panel"/"pane" → "Tab"/"tab" (2026-08-08)

### Planning
- [x] Audit all consumer-facing "panel"/"pane" usages in src/localize.ts + README.md
- [x] Identify the 3-way terminology split: editor headers "X Panel", helper text "pane", nav bar bare names
- [x] Confirm scope with user: editor headers → "X Tab", helper text → "tab", nav bar stays bare, internal identifiers unchanged, Settings also gets "Tab" suffix in editor
- [x] Write architecture plan to plans/unify-category-naming-plan.md

### Implementation
- [x] src/localize.ts: 5 editor section labels — Daily/Graphs/Stats/Drinks "Panel"→"Tab", Settings→"Settings Tab"
- [x] src/localize.ts: 6 helper-text strings — "pane"/"panel" → "tab" (confirm_tool_actions, chip, drink_chip, drink_chips, show_amount_in_body, hide_nav_bar)
- [x] README.md: full pass replacing consumer-facing "pane"→"tab" and "Panel"→"Tab" (~30 occurrences: Visual Editor description, Features, section headings, prose, config options table); "Medicine Panes"→"Medicine Tabs"
- [x] Leave on-card nav-bar labels bare (pane.* keys: 'Daily', 'Graphs', etc.) — unchanged
- [x] Leave internal code identifiers untouched (_activePane, pane-btn, *-panel.ts, custom-element tags, schema name fields)

### Verification
- [x] yarn run build — clean (exit 0, dist/ax-dose-logger-card.js created in 3.9s, no warnings)
- [x] Dist grep confirms new strings present (Daily Tab / Drinks Tab / Graphs Tab / Stats Tab / Settings Tab / Tools tab action / Daily tab. / Drinks tab. / Graphs tab. / tab navigation bar)
- [x] No backend / coordinator / store / config-flow / editor / types changes (frontend strings only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **"Tab" over "Panel"** — matches what the user clicks (a tab bar of icon buttons switching visible content), avoids HA's sidebar-panel terminology collision, unifies the 3 previously-inconsistent surfaces.
2. **Nav-bar labels stay bare** ("Daily", "Graphs") — only the editor + helper text gained "tab" wording; visible card UI unchanged.
3. **`Settings` gets "Tab" suffix in editor** for category consistency even though it's not a nav-bar tab (holds confirm_tool_actions toggle).
4. **Internal identifiers untouched** — invisible to consumers; renaming would be a broad refactor with no user benefit. Only translation *values* changed; *keys* unchanged → no lookup regressions.
5. **Schema `name` fields untouched** (daily_panel, drinks_panel, etc.) — existing saved configs keep working with no migration.

## Sync Editor Toggle Visual Defaults with Runtime Defaults (2026-08-08)

### Planning
- [x] User report: `confirm_tool_actions` toggle visually OFF despite functionally ON; asked to check all toggles
- [x] Audit all 17 boolean selectors in ax-dose-logger-editor.ts against their runtime read pattern
- [x] Identify 4 out-of-sync toggles (negative-false `!== false` runtime test = ON, but no `default` → editor renders OFF): confirm_tool_actions, show_amount_in_body, show_day_avg_boxes, show_adherence_boxes
- [x] Confirm 13 in-sync toggles (=== true / truthy / !== true where default IS off) — no change needed
- [x] Write fix plan to plans/sync-editor-toggle-defaults-plan.md

### Implementation
- [x] ax-dose-logger-editor.ts: add `default: true` to show_amount_in_body selector
- [x] ax-dose-logger-editor.ts: add `default: true` to show_day_avg_boxes selector
- [x] ax-dose-logger-editor.ts: add `default: true` to show_adherence_boxes selector
- [x] ax-dose-logger-editor.ts: add `default: true` to confirm_tool_actions selector
- [x] ax-dose-logger-editor.ts: update comment block above settings_panel (Panel→Tab, add default rationale)
- [x] Leave 13 in-sync toggles untouched (stats_3_columns, hide_nav_bar, big_text, bold_text, pills_left_show_days_left, 8 chip show_icon toggles)

### Verification
- [x] yarn run build — clean (exit 0, dist/ax-dose-logger-card.js created in 3.7s, no warnings)
- [x] Dist grep confirms all 4 `default: true` entries present (lines 1726, 1751, 1756, 1788); 13 in-sync toggles unchanged (stats_3_columns at line 1769 has no default)
- [x] No runtime / setConfig / getStubConfig / localize / types / README changes (editor schema only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **`default: true` on the schema entry, not in `setConfig`** — ha-form honors the schema `default` only for visual rendering when data is `undefined`; it does NOT write it into persisted config. Preserves decision #18 (no baked defaults).
2. **Only the 4 out-of-sync toggles fixed** — the other 13 were audited and correct; adding `default: true` to them would create a NEW mismatch (visually ON but functionally OFF).
3. **Negative-false runtime tests stay** — `!== false` is correct for default-ON fields; the bug was purely on the editor-rendering side.
4. **`getStubConfig` left as-is** — its `show_amount_in_body: true` covers only freshly-added cards; the schema `default` covers both new + existing cards uniformly, so the stub value is redundant but harmless; left as-is to avoid touching runtime config.
5. **Full audit table documented** in plans/sync-editor-toggle-defaults-plan.md (17 toggles × runtime read × editor default × sync status).
## Daily/Drinks Button Two-Line Height Lock (2026-08-08)

### Planning
- [x] Read frontend memory-bank/activeContext.md + projectstructure.md for context
- [x] Read daily-panel.ts (.take-sub / .take-pill-btn / .stat-pill / .stats-column CSS + render template) — confirmed root cause: `.take-sub-segment` spans are `white-space: nowrap` but the literal ` • ` separators between them are NOT, so when the combined "Last: … • Next: …" width exceeds the button the line breaks between segments → button grows ~16-19px taller; `.daily-main` is `display:flex` with default `align-items: stretch`, so the taller button drives the row height; `.stats-column`'s two `.stat-pill` boxes have no `flex:1`, so they keep their intrinsic content height and the slack pools at the bottom of the column → bottom-of-bottom-box ↔ button-bottom misaligns
- [x] Confirm fix direction with user (3-option question): user chose to increase BOTH the button and the boxes with the same ratio so top/bottom borders stay aligned — NOT a button-only fix
- [x] Confirm permanent-vs-reactive with user: user chose PERMANENT two-line height (reserve space always, card never resizes on dose-string changes)
- [x] Confirm Drinks-pane parity with user: user approved applying the same two changes to drinks-panel.ts for visual consistency + future-proofing (its button only has one sub-text segment today, so wrapping is rare but the reserved height keeps the two panes consistent)
- [x] Write architecture plan to plans/button-two-line-height-lock-plan.md (root cause, two coordinated CSS changes, scope, steps, risk notes)

### Implementation
- [x] daily-panel.ts: `.take-sub` CSS — added `min-height: 3em;` (reserve two lines of sub-text height permanently; 3em = 2 × 16px × 1.5 line-height = 48px; the button's existing `justify-content: center` keeps the icon + take-label centered above the reserved block whether it fills one line or two)
- [x] daily-panel.ts: `.stat-pill` CSS — added `flex: 1;` (the two boxes split the column's now-taller stretched height evenly; their existing `align-items: center` keeps icon/label/value centered inside each taller box, so the top border of the top box and the bottom border of the bottom box both stay flush with the button top/bottom at all times — preserving the button↔boxes ratio)
- [x] drinks-panel.ts: `.take-sub` CSS — added `min-height: 3em;` (same change, for visual parity; the Drinks pane clones Daily's `.take-sub` / `.stat-pill` CSS verbatim per its header comment)
- [x] drinks-panel.ts: `.stat-pill` CSS — added `flex: 1;` (same change, for visual parity)

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.2s)
- [x] Dist read confirms all 4 new CSS rules present: Daily `.take-sub` `min-height: 3em` (line 2933), Daily `.stat-pill` `flex: 1` (line 2948), Drinks `.take-sub` `min-height: 3em` (line 4496), Drinks `.stat-pill` `flex: 1` (line 4512)
- [x] No backend / coordinator / store / config-flow / editor / types / localize changes (frontend CSS-only layout-stability fix)
- [x] No README change (no end-user-facing behavior change — the card is the same size it was on single-line content, just stable when content wraps)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **Permanent two-line height, not reactive** — the user explicitly chose to reserve space for two sub-text lines at all times so the card never resizes when dose strings change length. A reactive grow-on-wrap approach would make the card height change on every dose update (jarring). The permanent reservation makes the card a constant size — the most stable/consistent UX.
2. **`min-height` on `.take-sub`, not `.take-pill-btn`** — scoping the reserved height to the sub-text block keeps the button's other children (icon, `.take-label`) at their existing gaps; the button's `justify-content: center` distributes the reserved height around all children. Reserving on the button itself would change the gap math between the icon/label/sub.
3. **`flex: 1` on `.stat-pill` preserves the ratio** — the user's core constraint was that the button↔boxes ratio (top-of-top-box ↔ button-top, bottom-of-bottom-box ↔ button-bottom) must stay aligned at all times. Growing only the button would break the symmetry (the boxes would float in a taller column). `flex: 1` makes the two boxes share the column's stretched height equally so their outer borders reach the row edges — matching the button — while `align-items: center` keeps their content centered (no internal shift).
4. **`3em` sizing** — `.take-sub` is `font-size: calc(16px + offset)` with inherited line-height ~1.5; `3em` = 2 lines × 16px × 1.5 = 48px, guaranteeing both wrapped lines fit with consistent leading whether the browser wraps or not. `em` (not `px`) keeps it correct if the text-offset CSS var is set.
5. **Drinks-pane parity** — the Drinks pane's "Log Drink" button currently renders only one sub-text segment ("Last: …"), so wrapping is rare there today. Applying the same two changes keeps the two panes visually consistent (same button + box heights) and future-proofs the Drinks button if a second segment is ever added. The user explicitly approved the parity scope.
6. **No README change** — this is a pure layout-stability fix with no end-user-facing behavior change (the card is the same size it was on single-line content, just stable when content wraps). Internal CSS-only; not a config/feature change worth documenting.
### Follow-on refinement — uniform internal spacing via button min-height (same day)
- [x] User feedback on the initial flex-centering approach (inner span + `.take-sub` flex): the gap between the Take Pill/Drink Tea label and the Last/Next/Overdue text became non-uniform — ~2px when two sub-text lines present (content fills the reserved 3em block) but ~14px when one line present (content floated mid-block, adding ~12px internal top space). User asked for only the top/bottom padding to change so internal spacing stays visually consistent across the one-line and two-line configurations.
- [x] Reverted the inner-span template change in both daily-panel.ts (line 135) and drinks-panel.ts (line 182) — `.take-sub` content back to its original form (segments + bullets, no `.take-sub-inner` wrapper).
- [x] Reverted the `.take-sub` CSS in both files — removed `min-height: 3em`, `display: flex`, `align-items: center`, `align-self: stretch`; removed the `.take-sub-inner` rule block. `.take-sub` back to its original 3 lines (font-size, font-weight, opacity).
- [x] Added `min-height: 8em` to `.take-pill-btn` (daily-panel.ts line 281) and `.log-drink-btn` (drinks-panel.ts line 305) — the button's existing `justify-content: center` distributes the reserved height as symmetric top/bottom padding around the icon + take-label + sub-text block, so the icon→label→sub gap stays the fixed 2px (uniform) while only the button's outer breathing room grows to fit the reserved two lines.
- [x] 8em sizing rationale (expressed in em relative to the button's 16px base font so it scales with --pill-text-offset): icon 28px + margin-bottom 2px + label 18px (line ~1.2 ≈ 22px) + gap 2px + two sub lines (16px × 1.5 × 2 = 48px) + gap 2px + padding 24px ≈ 128px = 8em.
- [x] `.stat-pill { flex: 1 }` from the prior fix stays — the two right-hand boxes still absorb the now-taller column height proportionally; button↔boxes ratio stays aligned at all times.
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.2s)
- [x] Dist verified: `min-height: 8em` present on both buttons (Daily line 2907, Drinks line 4479); `.take-sub` reverted to its original 3-line form (lines 2942-2946); no `take-sub-inner` class anywhere; both templates reverted to `<span class="take-sub">` without the inner span (Daily line 2733, Drinks line 4334).

### Key decisions (corrected follow-on)
1. **Button min-height, not `.take-sub` min-height** — reserving the height on the button (not the sub-text block) lets `justify-content: center` distribute the extra height as symmetric top/bottom padding around ALL the button's children. The icon→label→sub gap stays at the fixed 2px regardless of how many sub-text lines are present, so the internal spacing is visually consistent between the one-line and two-line configs (the user's core ask). Reserving on `.take-sub` instead made the gap variable (the empty reserved line pooled inside the sub-text block, inflating the label→sub gap when one line was present).
2. **Reverted the inner-span + flex-centering approach** — the prior approach vertically centered the sub-text content inside the reserved 3em block, but that made the label→sub gap non-uniform (~2px two-line, ~14px one-line) because the centered content floated mid-block when one line was present. The button-min-height approach produces uniform gaps by construction.
3. **8em ≈ 128px in em units** — expressed in em (relative to the button's 16px base font) so the reserved height scales correctly if the card's --pill-text-offset CSS var is set. Sized from the sum of the button's intrinsic content (icon + margin + label + gap + two sub lines + gap + padding).
4. **`.stat-pill { flex: 1 }` stays** — the prior fix's box-flex rule is still needed so the two right-hand boxes absorb the now-taller column height proportionally; without it the boxes would float in a taller column and the button↔boxes ratio would break again.

## Daily Tab Top Box — Amount in Body Toggle + Submenu Rename (2026-08-08)

### Planning
- [x] Read frontend memory-bank/activeContext.md + projectstructure.md + progress.md for context
- [x] Read daily-panel.ts (top box render + Safe to Take resolver call site), types.ts (config fields), ax-dose-logger-card.ts (_getSafeBoxEntity + _getPillsLeftBoxEntity precedent), ax-dose-logger-editor.ts (Top/Bottom Box expandables + pills_left_show_days_left toggle precedent), localize.ts (box strings + helpers), drinks-panel.ts (In Body box value formatting precedent)
- [x] Confirm with user: original request asked for Amount in Body default with a revert toggle; user reversed to "Safe to Take default, toggle opts into Amount in Body" because a dynamic default based on sensor state quality would mismatch the toggle's promise; confirmed the card cannot cleanly pick its own default without that mismatch (strength-only meds have the amount_in_body sensor entity present but reading `unknown`)
- [x] Confirm with user: submenus rename to "Top Box" / "Bottom Box" (box-identity-agnostic); toggle lives in the Top Box submenu (mirrors pills_left_show_days_left in the Bottom Box submenu)
- [x] Write architecture plan to plans/amount-in-body-box-plan.md

### Implementation
- [x] src/types.ts: added `safe_to_take_show_amount_in_body?: boolean` to AxDoseLoggerCardConfig (with JSDoc noting default-OFF + LIMIT-REACHED safety invariant)
- [x] src/ax-dose-logger-card.ts: extended `_getSafeBoxEntity` with toggle priority — `safe_to_take_show_amount_in_body === true` → `entities.amountInBody || entities.pillsSafeToTake` (built-in mode-swap wins over safe_to_take_entity; falls back to pillsSafeToTake when amountInBody structurally absent); toggle OFF → unchanged. Updated the doc comment.
- [x] src/components/daily-panel.ts: added `topShowAmountInBody` flag + `topDefaultLabel`/`topDefaultIcon` (Amount in Body variants when on: stats.amount_in_body + mdi:chart-bell-curve; Safe to Take variants when off: daily.safe_to_take + mdi:shield-check); updated the top box template aria-label/icon/label to use the toggle-aware defaults; added a `topShowAmountInBody && !isSwapped` value branch formatting Amount in Body as `Math.round(num) + ' ' + strengthUnit` (mirrors drinks-panel.ts:81)
- [x] src/ax-dose-logger-editor.ts: renamed Top Box expandable title 'Safe to Take Box' → 'Top Box'; added `safe_to_take_show_amount_in_body` boolean selector as the FIRST field in its schema (mirrors pills_left_show_days_left being first in Bottom Box); renamed Bottom Box expandable title 'Pills Left Box' → 'Bottom Box'
- [x] src/localize.ts: renamed `config.safe_to_take_box` 'Safe to Take Box' → 'Top Box' + `config.pills_left_box` 'Pills Left Box' → 'Bottom Box'; added `config.safe_to_take_show_amount_in_body` 'Amount in body instead of Safe to take' + `config.helper.safe_to_take_show_amount_in_body`; updated 4 box helpers (safe_to_take_box, safe_to_take_entity, safe_to_take_label, safe_to_take_icon) to reflect agnostic naming + toggle-dependent defaults
- [x] README.md: visual editor description "Safe to Take Box, Pills Left Box" → "Top Box, Bottom Box"; box section renamed both bullets + added the toggle description; config options table gained the safe_to_take_show_amount_in_body row + safe_to_take_label/icon defaults now show both toggle variants

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3.8s)
- [x] Dist grep confirms: `safe_to_take_show_amount_in_body` (6 occurrences), "Top Box" (2), "Bottom Box" (2), "Amount in body instead of Safe to take" (1)
- [x] No backend / coordinator / store / config-flow changes (frontend-only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **Safe to Take stays the default (toggle OFF)** — preserves existing configs with zero migration; strength-only meds keep a populated box; avoids the silent-fallback/toggle-mismatch the user identified. The user explicitly reversed the original "Amount in Body default" direction for this reason.
2. **No dynamic default based on state quality** — the card does not silently pick a sensor based on whether amountInBody has a usable state. A predictable default + explicit opt-in keeps the editor's promise and the rendered box in sync (user-confirmed principle). Distinct from the resolver-level fallback when the sensor ENTITY is structurally absent (§4).
3. **Resolver-level fallback when amountInBody entity is absent** — `entities.amountInBody || entities.pillsSafeToTake`. If the sensor entity exists but reads `unknown` (strength-only med), the panel's existing displayIsUnknown branch shows N/A (expected for an opt-in). Keeps the box non-empty on a device whose amountInBody sensor entity failed to resolve.
4. **Built-in mode-swap wins over entity swap** — mirrors _getPillsLeftBoxEntity + _getDisruptionBoxEntity. When the toggle is ON, a configured safe_to_take_entity is overridden; when OFF, safe_to_take_entity works as before. The two overrides are mutually unambiguous.
5. **LIMIT REACHED safety read preserved** — the Take Pill button's safeState (daily-panel.ts:40) already reads the real e.pillsSafeToTake sensor directly, NOT the top box's display entity. Swapping the top box is purely cosmetic. No change to this path.
6. **Submenus renamed to "Top Box" / "Bottom Box"** — box-identity-agnostic so the submenu name never contradicts the rendered sensor. "Top"/"Bottom" reflect physical position, which is stable regardless of sensor. User explicitly requested this rename.
7. **Toggle field name `safe_to_take_show_amount_in_body`** — keeps the safe_to_take_* config-family prefix and parallels pills_left_show_days_left. The `_show_` infix matches the existing convention.
8. **Default icon `mdi:chart-bell-curve` for Amount in Body** — mirrors the Drinks panel In Body box default; `mdi:shield-check` stays the Safe to Take default.
9. **Value formatting mirrors the Drinks In Body box** — `Math.round(num) + ' ' + strengthUnit` (via c.getStrengthUnit(e)); the swapped-entity branch keeps the existing numeric/title-case convention.
10. **Editor `title` is a literal string, not a localize key** — matches the existing pattern; the localize keys are updated for documentation/parity but are not read by the expandable headers (computeLabel returns '' for expandables).

## Custom "Chips" → "Boxes" Naming Convention Rename (2026-08-08)

### Goal
Rename the user-facing **"Custom Chips"** feature labels to **"Custom Boxes"** in the card's visual editor (Daily tab + Drinks tab settings) so the editor labels match what actually renders. The `chip_1`..`chip_4` / `drink_chip_1`..`drink_chip_4` custom-chip entities render as box-style tiles (primary-tinted background, uppercase label, column layout — the same visual language as the Graphs-panel Day Avg Boxes), not small pill-style chips; the old "Chip N" / "Custom Chips" labels contradicted the rendered output and violated user expectation. Both tabs renamed together (user-confirmed).

### Planning
- [x] Read frontend memory-bank (activeContext, progress, projectstructure) for context
- [x] Search all "chip" usages across src/ + README.md to build a complete change inventory
- [x] Confirm scope with user: both Daily + Drinks tabs renamed; Graphs-panel timeframe chips + effectiveness tracker chips out of scope (genuinely render as small pill-style buttons, no user-facing config label)
- [x] Write architecture plan → plans/custom-chips-to-boxes-rename-plan.md (values-only rename parallel to the completed Panel→Tab rename; internal config keys / CSS classes / TS identifiers untouched so existing saved configs keep working with zero migration)

### Implementation
- [x] src/localize.ts:230 — Drinks-tab chip translation *values* (keys unchanged): `config.drink_chips` `Custom Chips` → `Custom Boxes`; `config.drink_chip_1`..`drink_chip_4` + `_label` + `_icon` `Chip N (optional)`/`Chip N Label`/`Chip N Icon` → `Box N` variants; comment reworded (`Drink chip field labels` → `Drink box field labels`)
- [x] src/localize.ts:268 — Daily-tab chip translation *values* (keys unchanged): `config.chips` `Custom Chips` → `Custom Boxes`; `config.chip_1_box`..`chip_4_box` `Chip N` → `Box N` (also reused by the `drink_chip_N_box` expandable titles per the existing comment, so Drinks sub-headers update automatically); `config.chip_1`..`chip_4` + `_label` + `_icon` → `Box N` variants; comments reworded (`Chip box expandable titles` → `Box expandable titles`; `Chip field labels` → `Box field labels`)
- [x] src/localize.ts:353 — 4 helper strings reworded: `config.helper.drink_chips` / `config.helper.drink_chip` `Show as a chip on the Drinks tab` → `Show as a box on the Drinks tab`; `config.helper.chip` `Show as a chip on the Daily tab` → `Show as a box on the Daily tab`; `config.helper.chip_icon` `Override the chip icon` → `Override the box icon`; `config.helper.chip_show_icon` `Display an icon on this chip... the chip box grows taller... make chips larger` → `Display an icon on this box... the box grows taller... make boxes larger`; comment reworded (`Chip override helpers` → `Box override helpers`). Generic action labels (Tap/Hold/Double Tap Action), Show Icon, and chip_label/drink_chip_label helpers left untouched (no "chip" word).
- [x] src/ax-dose-logger-editor.ts:352 — Daily `chips` expandable `title: 'Custom Chips'` → `'Custom Boxes'`
- [x] src/ax-dose-logger-editor.ts:702 — Drinks `drink_chips` expandable `title: 'Custom Chips'` → `'Custom Boxes'`
- [x] src/ax-dose-logger-editor.ts:564 — reworded one stale code comment (`Custom Chips (4× entity +` → `Custom Boxes (4× entity +`) to avoid leaving a stale feature reference next to the renamed feature
- [x] README.md — screenshot comment (`custom chips` → `custom boxes`); Quick Start step 3; Visual Editor description (`Custom Chips with per-chip collapsable menus` → `Custom Boxes with per-box collapsable menus`, ×2); Daily Features bullet; Drinks Features bullet; full config-options table (14 description cells reworded across the `drink_chip_*` and `chip_*` rows)
- [x] dist/ax-dose-logger-card.js — rebuilt via yarn run build

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.0s)
- [x] Dist grep confirms `Custom Boxes` (5 occurrences), `Custom Chips` (0 occurrences), `Box 1`..`Box 4` (all present), `Show as a box on the Daily tab` (1), `Show as a box on the Drinks tab` (1)
- [x] README grep confirms no remaining user-facing "Custom Chips"/"per-chip"/"each chip"/"Tapping a chip"/"chip box"/"make chips" references (config key names like `chip_1` correctly stay)
- [x] No backend / coordinator / store / config-flow / types changes (frontend strings-only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **Values-only rename, keys untouched** — exactly mirrors the completed ["Panel/pane → Tab/tab"](plans/unify-category-naming-plan.md) precedent. Internal config keys (`chip_1`, `chips`, `drink_chips`, `chip_1_box`) are persistence identifiers invisible to end users; changing them would force a config migration with no user benefit. The user's goal is editor-UI expectation matching, which is purely a translation-value concern.
2. **Graphs-panel timeframe chips + effectiveness tracker chips stay "chips"** — those genuinely render as small pill-style buttons and have no user-facing config label, so "chip" is accurate. The user's request is specifically about the "Custom Chips" feature that renders as boxes.
3. **Internal CSS class names + TS identifiers untouched** — `.chip`, `ChipConfig`, `_getChipEntities()`, `handleChipAction`, etc. are internal API surface; renaming is a broad no-user-benefit refactor with regression risk. Same principle as the Panel→Tab rename leaving `_activePane`, `pane-btn`, `*-panel.ts` untouched.
4. **`config.chip_N_show_icon` / action labels stay generic** — these values (`Show Icon`, `Tap Action`, `Hold Action`, `Double Tap Action`) contain no "chip" word, so they need no change. Keeps the diff minimal.
5. **Both tabs renamed together** — user-confirmed. Both Daily and Drinks custom-chip features render identically as boxes; renaming only one would leave a cross-card inconsistency.
6. **Editor `title` is a literal, not a localize key** — per the established pattern (Top Box key decision #10). The two `title: 'Custom Chips'` literal edits are the user-visible change; the localize `config.chips` / `config.drink_chips` value edits are for consistency/future-proofing.
7. **One stale code comment reworded** — line 564 of ax-dose-logger-editor.ts was the only remaining "Custom Chips" literal after the user-facing edits; reworded to `Custom Boxes` for consistency. Other internal comments referencing config keys / CSS classes / identifiers left as-is (they reference unchanged internal names).
8. **No backend change** — the feature is entirely frontend (editor labels + README). Frontend-only, like the Panel→Tab rename.

## Box Override Field Relabel + Drinks Box Rename to Top/Bottom Box (2026-08-08)

### Planning
- [x] Read memory-bank context (frontend activeContext, progress, projectstructure)
- [x] Read daily-panel.ts, drinks-panel.ts (rendered box structure)
- [x] Read ax-dose-logger-editor.ts (Top Box, Bottom Box, Custom Boxes, Drinks In Body Box, Disruption Box expandables + computeLabel/computeHelper)
- [x] Read localize.ts (current field labels + helpers)
- [x] Audit for cross-tab inconsistencies: found Drinks In Body Box / Disruption Box headers + icon/label/entity fields use stale product-name prefixes; Custom Boxes icon/label fields are label-suppressed (Box N Icon/Label values never render); Bottom Box entity helper missing the Days Left override note
- [x] Confirm scope with user: Top/Bottom Box icon/label → Override Icon/Override Label; Drinks boxes → Top Box/Bottom Box; entity-picker fields → Override Entity (all 4 boxes); Custom Boxes un-suppress icon/label; append Days Left note to pills_left_entity helper
- [x] Write architecture plan → plans/box-icon-label-override-relabel-plan.md

### Implementation
- [x] src/localize.ts: relabel all 4 box override fields to Override Entity/Override Icon/Override Label (keys unchanged) — Daily Top Box (safe_to_take_*), Daily Bottom Box (pills_left_*), Drinks Top Box (in_body_*), Drinks Bottom Box (disruption_*)
- [x] src/localize.ts: rename Drinks box headers — config.in_body_box 'In Body Box' → 'Top Box'; config.disruption_box 'Disruption Box' → 'Bottom Box'
- [x] src/localize.ts: append 'Overridden by the Days Left toggle.' to config.helper.pills_left_entity (mirrors Top Box helper's Amount in body toggle note)
- [x] src/localize.ts: reword config.helper.in_body_icon 'Icon on the In Body box' → 'Icon on the box' (matches the already-generic disruption_icon/safe_to_take_icon wording)
- [x] src/ax-dose-logger-editor.ts: change two editor expandable title literals — line 591 'In Body Box' → 'Top Box'; line 640 'Disruption Box' → 'Bottom Box'
- [x] src/ax-dose-logger-editor.ts: computeLabel — drop _icon/_label clauses from chip + drink_chip suppression blocks so Box N Icon/Box N Label render; keep chip_N/drink_chip_N entity-picker suppressed (Box N (optional) redundant inside Box N expandable); update the two comment blocks
- [x] src/ax-dose-logger-editor.ts: reword the stale // ── Drinks Panel ── comment block (In Body Box/Disruption Box → Top Box (In Body)/Bottom Box (Disruption)) so the bundled dist carries no stale feature references
- [x] README.md: line 83 visual editor description — Drinks In Body Box, Disruption Box → Top Box, Bottom Box
- [x] README.md: line 160 — 'The In Body Box and Disruption Box are each fully overridable...' → 'The Drinks tab's Top Box and Bottom Box are each fully overridable...'
- [x] README.md: Drinks config-options table rows 218-230 — use Top Box (In Body)/Bottom Box (Disruption) parentheticals + Override Icon/Label/Entity wording; entity rows retain default-sensor semantic
- [x] README.md: Daily config-options table rows 202-208 — use Top Box (Safe to Take)/Bottom Box (Pills Left) parentheticals + Override Icon/Label/Entity wording; pills_left_entity row now carries the 'Overridden by the Days Left toggle.' note
- [x] Leave README line 155 (rendered-card label description: In Body on top, Disruption on bottom) as-is — describes rendered default labels, not editor headers

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.2s)
- [x] Dist grep confirms new strings present: Override Icon (4), Override Label (4), Override Entity (4), Box 1 Icon (2), Box 4 Icon (2), Overridden by the Days Left toggle (1)
- [x] Dist grep confirms all stale strings absent: In Body Box (0), Disruption Box (0), Safe to Take Icon/Label/Entity (0), Pills Left Icon/Label/Entity (0), In Body Icon/Label/Entity (0), Disruption Icon/Label/Entity (0)
- [x] No backend change (frontend-only — editor labels + helper text + README)
- [x] No config migration (keys unchanged; only translation values + editor title literals + computeLabel suppression block)
- [x] No projectstructure.md change (no files added/renamed/deleted)
- [x] activeContext.md updated (new Current Status, prior archived per truncation rule)
- [x] progress.md updated (this section; oldest section archived to memory-bank/old/progress-archive.md to stay under ~400 lines)

### Follow-on Adjustment — Custom Box Entity-Picker Label Suppression + Icon/Label Same-Line (2026-08-08)

#### Reported by user
After the box relabel task, under each Custom Box (Daily + Drinks) the entity picker still showed a humanized "Chip N" / "Drinks chip N" label above it, and the Box icon + Box label pickers appeared stacked rather than side-by-side like the Top/Bottom Box.

#### Root cause
- The entity-picker schema nodes (`chip_1`..`chip_4`, `drink_chip_1`..`drink_chip_4`) had no inline `label` field and relied on `computeLabel` returning `''` to suppress the label. In the user's HA version, ha-form humanizes the schema `name` (`chip_1` → "Chip 1", `drink_chip_1` → "Drinks chip 1") when `computeLabel` returns `''` — so the humanize fallback rendered the stale "Chip N" text.
- The Custom Box icon+label grids were already structurally identical to the Top Box grid (type:'grid', name:'', column_min_width:'200px', icon+label pickers) — the stacked appearance was a side-effect of the unsuppressed "Chip N" entity label disrupting the visual rhythm above the grid.

#### Implementation
- [x] src/ax-dose-logger-editor.ts: added inline `label: ''` directly on each of the 8 entity-picker schema nodes (chip_1..chip_4 at ~374/422/471/520; drink_chip_1..drink_chip_4 at ~724/773/822/871). The inline `label: ''` reliably suppresses the label the same way the show_icon boolean field's inline `label: localize(...)` works (an inline label overrides ha-form's humanize fallback; `computeLabel` returning '' does not). Kept the computeLabel suppression block as defense-in-depth.
- [x] No grid structure change needed — the icon+label grids were already byte-identical to the Top Box grid; removing the unsuppressed entity label lets the grid render side-by-side like the Top/Bottom Box.

#### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.1s)
- [x] Dist grep confirms inline `label: ''` present on all 8 entity pickers (count = 8), grids present (count = 19), Box 1 Icon present (count = 2)
- [x] No backend change (frontend-only — editor schema label override)
- [x] No config migration (keys unchanged; inline label is a schema-node presentation attribute, not persisted)
- [x] No projectstructure.md change
- [x] activeContext.md updated (follow-on note added to the box relabel Current Status)
- [x] progress.md updated (this section)

### Follow-on Fix v2 — Non-Breaking-Space Label + 180px Grid (2026-08-08)

#### Reported by user (after v1 follow-on)
The v1 inline `label: ''` did NOT suppress the entity-picker label — ha-form still rendered "Chip N" / "Drinks chip N" above the entity selector. And the Box N Icon + Box N Label pickers were still stacked instead of side-by-side.

#### Root cause
- **Label:** ha-form treats an empty-string `label` (inline `label: ''` OR `computeLabel` returning `''`) as falsy → falls back to humanizing the schema `name` (`chip_1` → "Chip 1", `drink_chip_1` → "Drinks chip 1"). Both the `computeLabel` `return ''` AND inline `label: ''` attempts failed for the same reason.
- **Grid stacking:** the Custom Box icon+label grids were structurally identical to the Top Box grid BUT nested 3 levels deep (panel → chips expandable → chip_N_box expandable → grid), so the available width is narrower than the 2-level-deep Top Box grid. The `column_min_width: '200px'` (same as Top Box) forced a single-column wrap.

#### Implementation
- [x] src/ax-dose-logger-editor.ts: changed inline `label: ''` → `label: '\u00A0'` (non-breaking space) on all 8 entity-picker schema nodes (chip_1..chip_4 + drink_chip_1..drink_chip_4). A non-empty whitespace string is truthy → overrides ha-form's humanize fallback while rendering as effectively blank (the known-working HA-form label-suppression trick; empty string fails, whitespace succeeds).
- [x] src/ax-dose-logger-editor.ts: reduced column_min_width from '200px' → '180px' on the 8 Custom Box icon+label grids only (Daily chip_1..chip_4 grids at ~384/434/484/534; Drinks drink_chip_1..drink_chip_4 grids at ~735/785/835/885). User-confirmed value (180px). The Top/Bottom Box grids (1 level shallower) keep '200px'.

#### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.1s)
- [x] Dist grep confirms: `label: '\u00A0'` present on all 8 entity pickers (count = 8); `column_min_width: '180px'` on the 8 Custom Box grids (count = 8); `column_min_width: '200px'` remains on the 10 Top/Bottom Box + other grids (count = 10)
- [x] No backend change (frontend-only — editor schema label override + grid column_min_width)
- [x] No config migration (keys unchanged; inline label + column_min_width are schema-node presentation attributes, not persisted)
- [x] No projectstructure.md change
- [x] activeContext.md updated (follow-on note corrected to reflect v2 final fix)
- [x] progress.md updated (this section)

### Follow-on Fix v3 — "Settings" Label for Custom Box Entity Picker (2026-08-08)

#### Reported by user (after v2 follow-on)
The v2 non-breaking-space inline `label: '\u00A0'` STILL did not suppress the entity-picker label — ha-form still rendered "Chip N" / "Drinks chip N" above the entity selector. (The grid 180px fix from v2 DID work — boxes now render side-by-side.)

#### Root cause (definitive)
ha-form treats a falsy/empty `computeLabel` return (empty string `''`, undefined, null) as "no label provided" and falls back to humanizing the schema `name` (`chip_1` → "Chip 1", `drink_chip_1` → "Drinks chip N"). The inline schema `label` field is IGNORED when a `computeLabel` callback is provided to ha-form — so inline `label: ''` and `label: '\u00A0'` had no effect. The ONLY way to override the humanize fallback is to make `computeLabel` return a non-empty string.

#### Implementation (user suggestion: label as "Settings")
- [x] src/localize.ts: added `'config.box_settings': 'Settings'` key (neutral label for the Custom Box entity picker — the "Box N" expandable header already conveys identity; "Settings" groups the entity picker + the icon/label overrides below it).
- [x] src/ax-dose-logger-editor.ts: changed the two `computeLabel` `return ''` blocks (chip_1..chip_4 + drink_chip_1..drink_chip_4) to `return localize(lang, 'config.box_settings')` ("Settings"). Non-empty string overrides ha-form's humanize fallback cleanly. Updated the two comment blocks to document the definitive root cause (empty computeLabel → humanize) and the "Settings" rationale.
- [x] src/ax-dose-logger-editor.ts: removed the redundant inline `label: '\u00A0'` from all 8 entity-picker schema nodes (computeLabel takes precedence over the inline label, so the inline label was dead weight from the v2 attempt).

#### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.4s)
- [x] Dist grep confirms: inline `label: '\u00A0'` removed (count = 0); `config.box_settings` key present (count = 3 — localize definition + 2 computeLabel returns); `'Settings'` value present (count = 1); `column_min_width: '180px'` on the 8 Custom Box grids still in place (count = 8) from v2
- [x] No backend change (frontend-only — editor computeLabel + localize key)
- [x] No config migration (keys unchanged; computeLabel return value + inline label removal are runtime presentation, not persisted)
- [x] No projectstructure.md change
- [x] activeContext.md updated (follow-on note corrected to reflect v3 final fix — "Settings" label, definitive root cause)
- [x] progress.md updated (this section)
