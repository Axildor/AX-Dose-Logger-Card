# Active Context — AX Dose Logger Card (Frontend)

## Current Status
**Complete**: Caffeine Pane Visibility Guard — the caffeine pane (Pane 6, a "coming soon" scaffold) is now hidden for every device by default and only appears when the device's primary sensor (`next_dose`) exposes a `device_type` state attribute with value `"caffeine"`. The backend does not yet emit this attribute for any device, so the pane is invisible everywhere until a real caffeine device is configured; the change is forward-compatible with the planned backend device-type plumbing (which will eventually emit `device_category: 'medicine'|'drink'` + `device_type: 'caffeine'|'alcohol'|…`). Two surgical edits to `ax-dose-logger-card.ts`, both mirroring the existing `hasMetrics`/tracking conditional pattern. Build verified clean (exit 0, no warnings).

## What Was Changed

### Caffeine Pane Visibility Guard (2026-06-26)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — (1) `_renderPaneSelector`: added `hasCaffeine` computed from `(this._getAttr(entities.nextDose, 'device_type') || '').toLowerCase() === 'caffeine'`; removed the previously-unconditional `{ id: 'caffeine', … }` entry from the `panes` array and spread it in only when `hasCaffeine` is true, mirroring the existing `hasMetrics` → tracking conditional-spread pattern. The lookup is defensive (lower-cased, nil-coalesced) since the backend will eventually emit snake_case values. (2) `render()`: added an auto-fallback guard right after the existing tracking fallback — if `this._activePane === 'caffeine'` but the device's `device_type` attribute is not `'caffeine'` (e.g. the attribute was removed, or the user switched devices, or a lingering `_activePane` from a dev session), reset `_activePane = 'daily'`. This prevents the render ternary from rendering `ax-dose-caffeine-panel` for a non-caffeine device even if the nav button is hidden.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

### Panel Reactive Prop Fix — hass + graph state as reactive props (2026-06-26)
- **[`src/components/daily-panel.ts`](src/components/daily-panel.ts)** / **[`src/components/stats-panel.ts`](src/components/stats-panel.ts)** / **[`src/components/caffeine-panel.ts`](src/components/caffeine-panel.ts)** / **[`src/components/tools-panel.ts`](src/components/tools-panel.ts)** / **[`src/components/tracking-panel.ts`](src/components/tracking-panel.ts)** / **[`src/components/graphs-panel.ts`](src/components/graphs-panel.ts)** — Added `@property({ attribute: false }) hass?: AxDoseLoggerHass;` to every presentational panel (importing `AxDoseLoggerHass` from `../types.js`). This is the canonical HA card pattern: HA replaces the top-level `hass` object reference on every state update, so binding it as a reactive prop makes the panel re-render on each relevant state change instead of only when its element is remounted on a pane switch.
- **[`src/components/graphs-panel.ts`](src/components/graphs-panel.ts)** — Added five graph-local reactive props: `amountHistory`, `doseHistory`, `activeGraph`, `activeTimeframe`, `activeBarTimeframe`. Replaced every controller-getter read (`this.controller.activeBarTimeframe`, `this.controller.activeTimeframe`, `c.activeGraph`, `c.amountHistory`, and the timeframe-chip `active`-class comparisons) with reads of the new local reactive props. The controller action callbacks (`c.handleTimeframeChange`, `c.setActiveGraph`, `c.handleBarTimeframeChange`) are unchanged — they mutate container `@state`, which re-renders the container, which re-binds the new prop values into the panel. This makes timeframe-chip clicks, carousel nav, and async history-fetch completion re-render the graph panel immediately (fixing the "14-day average doesn't load until a second visit" and "graph doesn't change until pane reload" symptoms).
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — In `render()`, added `.hass=${this.hass}` to all six panel bindings; added `.amountHistory`, `.doseHistory`, `.activeGraph`, `.activeTimeframe`, `.activeBarTimeframe` (bound to the container's `_amountHistory`/`_doseHistory`/`_activeGraph`/`_activeTimeframe`/`_activeBarTimeframe` `@state`) to the graphs-panel binding.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend — `_renderPaneSelector` conditional caffeine entry; `render()` caffeine auto-fallback guard)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **Gate on a state attribute, not a dedicated entity** — A device *type* classifier is metadata about the device, not an observable measurement, so per HA best practice it belongs in `extra_state_attributes` on the primary sensor rather than as its own sensor entity. This mirrors the existing `tracking_type` attribute pattern (read via `this._getAttr(entities.nextDose, 'tracking_type')`).
2. **Mirror the existing hasMetrics/tracking conditional-spread pattern** — The pane selector already conditionally includes the tracking pane only when `entities.metrics.length > 0`. The caffeine pane now uses the identical pattern: `hasCaffeine` is computed once and the caffeine entry is spread into the `panes` array only when true. No new abstraction introduced.
3. **Defensive attribute lookup** — The lookup `(this._getAttr(entities.nextDose, 'device_type') || '').toLowerCase()` is nil-safe and case-insensitive, since the backend does not emit the attribute yet and will eventually emit snake_case values (`'caffeine'`). The pane stays hidden everywhere until a real caffeine device is configured.
4. **Auto-fallback guard mirrors the tracking fallback** — Added a sibling to the existing "tracking pane but no metrics -> daily" guard in `render()`. If `_activePane === 'caffeine'` but the device is not a caffeine device (attribute removed, device switched, or lingering dev-session state), reset to `daily`. Prevents the render ternary from rendering the caffeine panel for a non-caffeine device even when the nav button is hidden.
5. **Frontend-only, forward-compatible** — No backend, config-flow, or README changes. The `caffeine-panel.ts` component, its import, the `'caffeine'` member of the `_activePane` type union, the render ternary, and `getCardSize` all remain unchanged — they're simply not reached until a real caffeine device exists. The guard reads `device_type`, which is forward-compatible with the planned two-field backend design (`device_category: 'medicine'|'drink'` for the config-flow branch + `device_type: 'caffeine'|'alcohol'|…` for pane visibility).

## Previous Context
### Panel Reactive Prop Fix — hass + graph state as reactive props (2026-06-26)

### Grid Alignment CSS Fix — align-items: end in ha-form shadow DOM (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — (1) Reverted the `computeLabel` `undefined` return for `safe_to_take_entity`/`safe_to_take_label` — both fields now show their full localized labels again. (2) Restored chip entity labels to "Chip N (optional)" in [`src/localize.ts`](src/localize.ts). (3) Added `_injectFormGridAlignmentStyle()` static method + `_formStyleObserver` static field. The method uses a `MutationObserver` on `document.body` to find all `ha-form` elements (including ones that appear lazily when the config dialog opens), injects an id-tagged `<style>` into each `ha-form`'s `shadowRoot` with `align-items: end !important` on grid-display divs. This forces the shorter text field (internal floating label, no external label height) to sink to the bottom of the grid row, aligning its control box with the entity picker's control box (which has an external label pushing it down). (4) Called `_injectFormGridAlignmentStyle()` from `connectedCallback`.
- **[`src/localize.ts`](src/localize.ts)** — Restored chip entity labels from "Chip N" back to "Chip N (optional)".
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **Root cause: different label rendering mechanisms** — Entity selectors (`ha-entity-picker`) render an external label above the control box; text selectors (`ha-textfield`) render an internal floating label inside the control box. In a CSS grid row, the entity picker's control box is pushed down by the external label height while the text field's control box starts at the top of the grid cell, causing vertical misalignment.
2. **CSS fix, not schema fix** — HA's `ha-form` does not expose a schema property to force external label rendering on text selectors. The `inset-label` property exists on `ha-input` but `ha-form` controls how labels are passed and doesn't expose it via the schema. The only viable fix without a fully custom editor is CSS alignment.
3. **`align-items: end`** — Forces all grid children to align by their bottom edges. The shorter text field sinks to the bottom of the grid row, matching the entity picker's bottom edge. This aligns the physical input boxes regardless of the label height difference above them.
4. **Shadow DOM injection via MutationObserver** — `ha-form` uses shadow DOM, so external CSS can't reach its internal grid divs. The `MutationObserver` catches `ha-form` elements as they appear (the config dialog opens lazily) and injects the style tag into each form's `shadowRoot`. The style tag is id-tagged (`ax-dose-grid-align-items-end`) so it's only injected once per shadow root.
5. **All field labels restored** — The previous approach of removing labels (returning `undefined` from `computeLabel`) was reverted because it stripped UX context. The CSS alignment fix preserves all labels while fixing the visual misalignment.

## Previous Context
### Label Alignment Fix — Safe to Take + Chips (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — Updated `computeLabel` in `getConfigForm()` to return `undefined` for `safe_to_take_entity` and `safe_to_take_label`, removing the redundant "Safe to Take Entity" / "Safe to Take Label" labels above both grid-paired fields. The expandable title "Safe to Take Box" + the helper texts ("Any entity to show here. Leave empty for default." / "Custom label. Defaults to 'Safe to take'.") already explain what each field does. The entity picker UI (search icon, entity browser) is visually distinct from the text input, so users can tell which is which without labels.
- **[`src/localize.ts`](src/localize.ts)** — Shortened all 4 chip entity labels from "Chip N (optional)" → "Chip N" (removed the "(optional)" suffix). The suffix caused the entity label to wrap to 2 lines in a 200px grid column while the paired "Chip N Label" fit on 1 line, causing vertical misalignment. Both "Chip N" (6 chars) and "Chip N Label" (12 chars) now fit on 1 line. The helper text already conveys that chips are optional (you don't have to fill all 4 slots).
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **Remove both Safe to Take labels, not just one** — Removing only the entity label would leave "Safe to Take Label" above the label field, pushing its input down while the entity picker starts higher — misalignment in the opposite direction. Removing both keeps the two fields at the same vertical level. The expandable title + helpers provide sufficient context.
2. **Chip "(optional)" suffix removed** — The suffix made entity labels ("Chip 1 (optional)" = 16 chars) longer than their paired label fields ("Chip 1 Label" = 12 chars), causing the entity label to wrap to 2 lines in a 200px grid column. "Chip N" (6 chars) fits on 1 line, matching "Chip N Label" (12 chars). The chip number still identifies which pair is being edited; the helper text conveys optionality.
3. **`computeLabel` returning `undefined`** — When `computeLabel` returns `undefined`, `ha-form` renders the field without a label row above it. This is the standard HA pattern for fields where the label would be redundant (e.g. inside an expandable whose title already provides context).

## Previous Context
### Config Helper Text Simplification (2026-06-25)
- **[`src/localize.ts`](src/localize.ts)** — Simplified all 21 `config.helper.*` strings (lines 149-170). Applied the principle: "the label says what it IS; the helper says only what's NOT obvious — the default value, a brief example, or a one-word behavior hint." Removed: brand name repetition, implementation details (pixel measurements, default icon names), edge-case explanations (limit-reached state, safety logic disclaimers), default-state descriptions, and verbose connective tissue. Total reduction: ~1,950 chars → ~750 chars (62% reduction). Key examples: `safe_to_take_box` 253→67 chars, `take_pill_label` 163→72 chars, `amount_in_body_default_timeframe` 163→32 chars, `hide_nav_bar` 106→29 chars.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

## Files Modified
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **Label says what it IS, helper says what's NOT obvious** — The field label already identifies the field. The helper should only add the default value, a brief example, or a one-word behavior hint. E.g. `safe_to_take_tap_action` label is "Tap Action"; helper was "Action to perform when the Safe to Take box is tapped. Defaults to more-info on the displayed entity." → now just "Defaults to more-info."
2. **Removed implementation details** — Pixel measurements ("2px larger"), default icon names ("mdi:pill", "mdi:alert"), and safety logic disclaimers ("The Take Pill button safety logic always uses the real sensor") are implementation details, not config guidance. Users don't need them to configure the field.
3. **Removed edge-case explanations** — "The limit-reached state always uses mdi:alert" and "Only applies when the device has adherence sensors" were shortened to essential behavior hints ("Requires adherence sensors").
4. **Removed verbose connective tissue** — "When on, all text in the card becomes...", "Action to perform when...", "Entity from the selected device to display as..." were all cut. The label + a short behavior phrase is sufficient.
5. **Grid alignment benefit** — In a 2-column grid, a long helper in one column pushes the paired field down, causing misalignment. Shorter helpers keep both columns' fields at the same vertical level.

## Previous Context
### Config Form Grid Layout v2 Fix — name: "" + column_min_width: "200px" (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — Fixed all 9 grid blocks in `getConfigForm()`: (1) changed every `column_min_width` from numeric `250` or `200` to the string `"200px"`; (2) added `name: ''` (empty string) to every grid wrapper object. The v1 implementation omitted `name` on the grid wrapper (required by `ha-form` to not render a label row) and used numeric values that CSS Grid interpreted as pixels but the 250px value forced 500px min for 2 columns, exceeding the ~450px HA editor sidebar. The `schema` array nesting was already correct from v1.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0, no warnings).

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **`name: ""` required on grid wrapper** — `ha-form` expects every schema node to have a `name` attribute. Without it, the grid wrapper renders an empty label row above the columns, breaking the layout. Setting `name: ""` tells `ha-form` this is a layout-only container with no data field.
2. **`column_min_width: "200px"` as string** — HA's grid schema expects a CSS length string (e.g. `"200px"`), not a bare number. The numeric `250` was interpreted as `250px`, making 2 columns require 500px minimum — wider than the ~450px HA card editor sidebar, so CSS Grid fell back to 1 column (stacked). `"200px"` makes 2 columns fit in 400px, working even in the narrow editor sidebar.
3. **All grids use 200px** — Simplified from the v1 split (250px for most, 200px for chips). 200px works for all field types in the narrow editor sidebar; on wider screens the columns simply have more breathing room.

## Previous Context
### Rollup onwarn Filter — Silence @formatjs/intl-utils Warning (2026-06-25)
- **[`rollup.config.js`](rollup.config.js)** — Added an `onwarn` handler that filters out the `THIS_IS_UNDEFINED` warning when it originates from `@formatjs/intl-utils` (matched via `warning.id.includes('@formatjs/intl-utils')`). All other warnings still pass through to the default handler. The warning was harmless (the flagged top-level `this` references are dead code — `Object.assign`/`Object.setPrototypeOf` are universally available in browsers, so the hand-rolled fallbacks never run), but it cluttered every build output since the Override Popup Wording Rework task first imported `formatTime`/`formatDateTime` from `custom-card-helpers`.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, now **completely clean** (no warnings, exit 0).

## Files Modified
- `rollup.config.js` (frontend, new onwarn handler)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)

## Key Design Decisions
1. **Targeted filter, not blanket suppression** — The `onwarn` handler only silences `THIS_IS_UNDEFINED` from `@formatjs/intl-utils`. All other warnings (real type errors, missing imports, etc.) still print. This follows HA community best practice — don't use `--silent` or suppress all warnings.
2. **Root cause is a transitive dependency** — `@formatjs/intl-utils` is pulled in by `custom-card-helpers` via the `formatTime`/`formatDateTime` re-export chain. The warning cannot be fixed at the source without patching `node_modules` (overwritten on next `yarn install`). The `onwarn` filter is the correct layer to handle it.
3. **No runtime impact** — The flagged code path (`var __assign = (this && this.__assign) || function(){}`) is dead in ES module context: top-level `this` is `undefined`, so `this &&` short-circuits, and `Object.assign` (next line) is always available, so the fallback is never reached. The compiled output is functionally identical with or without the warning.

## Previous Context
### Config Form Grid Layout (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — In `getConfigForm()`, wrapped 9 field pairs in `type: 'grid'` blocks: (1) top-level `big_text` + `hide_nav_bar`; (2) top-level `color_scheme` + `name`; (3) `daily_panel` `take_pill_icon` + `take_pill_label`; (4) `safe_to_take_box` `safe_to_take_entity` + `safe_to_take_label`; (5–8) `chips` `chip_1`+`chip_1_label`, `chip_2`+`chip_2_label`, `chip_3`+`chip_3_label`, `chip_4`+`chip_4_label`; (9) `graphs_panel` `show_day_avg_boxes` + `show_adherence_boxes`. Fields with no natural pair (`device_id`, `pills_left_label`, `show_amount_in_body`, `amount_in_body_default_timeframe`, `stats_3_columns`, and the 3 ui-action selectors) remain full-width. `column_min_width`: 250 for most, 200 for chip grids.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated).
- **[`plans/config-form-grid-layout-plan.md`](plans/config-form-grid-layout-plan.md)** — architecture plan documenting all 9 grid groupings + `column_min_width` rationale.

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `plans/config-form-grid-layout-plan.md` (frontend, new plan)

## Key Design Decisions
1. **HA `type: 'grid'` schema** — Uses CSS `repeat(auto-fill, minmax(column_min_width, 1fr))`. Only equal-width columns are possible; no colspan/fractional columns. A 1/3 + 2/3 split would require a fully custom editor (out of scope). Confirmed via Context7 HA docs.
2. **`column_min_width` 250px for most grids** — The config dialog is ~500px wide on desktop, so 2 columns at 250px min fits. On mobile (<500px), fields stack to 1 column automatically.
3. **`column_min_width` 200px for chip grids** — Chip entity + label are shorter fields; 200px allows 2 columns even on narrower screens.
4. **Full-width fields kept alone** — `device_id` (device picker), `pills_left_label` (no natural pair), `show_amount_in_body` + `amount_in_body_default_timeframe` (toggle + dropdown), `stats_3_columns` (lone toggle), and the 3 `ui-action` selectors (wide dropdowns) are not gridded — they stay full-width for readability.
5. **No localization changes needed** — Grid is a pure layout container; `computeLabel`/`computeHelper` still receive the leaf field's `name`, so all existing localize keys work unchanged.

## Previous Context
### Replaceable "Safe to Take" Box v2 — Any Entity + Tap/Hold/Double-Tap Actions (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — (1) Added `ActionConfig` + `handleAction` to the `custom-card-helpers` import. (2) Added 3 action config fields to `AxDoseLoggerCardConfig`: `safe_to_take_tap_action?`, `safe_to_take_hold_action?`, `safe_to_take_double_tap_action?` (all `ActionConfig`). (3) Added `_handleSafeBoxAction()` method: when the requested action has a user-configured `ActionConfig`, delegates to `handleAction(this, this.hass, config, action)`; when no `tap_action` is configured, falls back to `_openMoreInfo(displayEntity)` (v1 default); hold/double_tap with no config are no-ops. (4) In `_renderPane1`, added `safeBoxActionConfig`/`hasCustomTap`/`hasHold`/`hasDblClick`/`safeBoxClickable` locals; the Safe to Take `.stat-pill` now wires `@click` → tap action, `@contextmenu` (preventDefault) → hold action (gated on `hasHold`), `@dblclick` → double_tap action (gated on `hasDblClick`), and `@keydown` Enter/Space → tap action. (5) Restructured `getConfigForm` `daily_panel`: replaced the two flat fields with a nested `safe_to_take_box` expandable (title "Safe to Take Box") containing 5 fields — `safe_to_take_entity` (entity selector, `filter_device_id` context only, NO integration lock so any entity is selectable), `safe_to_take_label` (text), `safe_to_take_tap_action`/`safe_to_take_hold_action`/`safe_to_take_double_tap_action` (all `ui_action` selectors).
- **[`src/localize.ts`](src/localize.ts)** — Added 7 keys: `config.safe_to_take_box` ('Safe to Take Box'), `config.safe_to_take_tap_action` ('Tap Action'), `config.safe_to_take_hold_action` ('Hold Action'), `config.safe_to_take_double_tap_action` ('Double Tap Action'), `config.helper.safe_to_take_box`, `config.helper.safe_to_take_tap_action`, `config.helper.safe_to_take_hold_action`, `config.helper.safe_to_take_double_tap_action`. Updated `config.helper.safe_to_take_entity` to reflect "any entity" (removed integration-lock wording).
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated).
- **[`README.md`](README.md)** — Updated Configuration Options table: `safe_to_take_entity` row reworded to "any entity"; added 3 new action rows (`safe_to_take_tap_action`, `safe_to_take_hold_action`, `safe_to_take_double_tap_action`).
- **[`plans/replace-safe-to-take-box-plan.md`](plans/replace-safe-to-take-box-plan.md)** — updated to v2 (any entity + actions + nested expandable).

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `README.md` (frontend)
- `plans/replace-safe-to-take-box-plan.md` (frontend, updated to v2)

## Key Design Decisions
1. **Decoupled button logic** — The Take Pill button's LIMIT REACHED state and the override dialog always read the real `pills_safe_to_take` sensor (`entities.pillsSafeToTake`), never the display entity. Swapping the box is purely cosmetic; safety is never affected. Confirmed by the user.
2. **Any entity selectable** — v2 dropped the `integration: 'ax_dose_logger'` lock on the entity selector (per user request: "any entity should be selectable"). The `context: { filter_device_id: 'device_id' }` is kept as a soft default filter — HA's entity picker pre-filters to the device but still allows browsing all entities.
3. **Standard HA action pattern** — Tap/hold/double-tap use HA's `ui-action` selector (same as Mushroom + stock cards) and `handleAction` from custom-card-helpers. This gives users the full action set: more-info, toggle, call-service, navigate, url, none, fire-dom-event.
4. **Default tap = more-info** — When no `tap_action` is configured, the click falls back to `_openMoreInfo(displayEntity)` (v1 default behavior). This preserves backward compatibility for v1 configs that set `safe_to_take_entity` but no actions.
5. **Hold via contextmenu** — Long-press is wired to `@contextmenu` with `preventDefault` (the standard HA pattern for hold actions on non-action-handler elements). Gated on `hasHold` so a plain box without a configured hold action doesn't suppress the browser context menu.
6. **Nested expandable** — All 5 settings moved into a nested `safe_to_take_box` expandable inside `daily_panel`, under `take_pill_label`, per user request. Collapsed by default; v1 configs with `safe_to_take_entity` set are preserved inside it.
7. **Non-numeric safe display** — When swapped, the box shows the replacement entity's raw state string (not forced via `_formatInteger`), since the replacement may be a binary sensor or string state. The default sensor path keeps the integer formatting.

## Previous Context
### Replaceable "Safe to Take" Box v1 (2026-06-25)
- v1 added `safe_to_take_entity` + `safe_to_take_label` as flat fields in `daily_panel`, locked to the integration. v2 superseded this: any entity + actions + nested expandable.

### Day Average Boxes Entity ID Suffix Mismatch Fix (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — Line 258: changed the yearly avg_doses suffix match from `entityId.endsWith('_avg_daily_doses_yearly')` to `entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly')` so both newer devices (which produce `_avg_daily_doses_365_days` from the backend unique_id `_avg_doses_365`) and legacy devices (which retain `_avg_daily_doses_yearly`) resolve the yearly avg entity.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated).
- **[`plans/fix-day-avg-boxes-mismatch.md`](plans/fix-day-avg-boxes-mismatch.md)** — architecture plan documenting the root cause analysis and fix.

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `plans/fix-day-avg-boxes-mismatch.md` (frontend, new plan)

## Key Design Decisions
1. **Frontend-only fix** — The backend unique_id `_avg_doses_365` is correct and consistent with the adherence pattern (`_adherence_365`). Changing the backend would break existing entity registry entries and require a migration handler. The frontend dual-match approach handles both legacy and new entity_ids without any backend disruption.
2. **Why adherence boxes worked but avg boxes didn't** — The adherence sensors use `_adherence_365_days` (numeric) which the frontend correctly matched. The avg_doses sensors use `_avg_daily_doses_365_days` (newer) or `_avg_daily_doses_yearly` (legacy), but the frontend only matched the legacy suffix. The 7/14/30-day avg suffixes matched correctly; only the yearly slot was mismatched.
3. **Why some users saw it and some didn't** — Older devices (created before the unique_id changed to `_avg_doses_365`) have `_avg_daily_doses_yearly` in the entity registry → frontend matched → boxes appeared. Newer devices have `_avg_daily_doses_365_days` → frontend didn't match → boxes didn't appear.

## Previous Context
### 12H Time Indicators + 24H Timeframe + Default Timescale Selector (2026-06-25)
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — (1) Added `amount_in_body_default_timeframe?: string` to `AxDoseLoggerCardConfig` interface. (2) Added `case '24h': return 24;` to `_getTimeframeHours()`. (3) Added `{ id: '24h', ... }` entry to `_renderTimeframeChips()` between 12h and 48h. (4) Rewrote `connectedCallback()` `_activeTimeframe` reset to read from `this.config?.amount_in_body_default_timeframe` with a validation guard (valid set: 12h/24h/48h/7d/14d/30d; falls back to '48h' if unset/invalid). (5) Rewrote `_renderLineGraph()` time-indicator block: replaced single `timeLabels` array with separate `tickMarks` (visual only, no text) + `timeLabels` (tick + text) arrays, with per-timeframe density branching — 12H: ticks every 1h / labels every 2h; 24H: ticks every 2h / labels every 4h; 48H: ticks every 3h / labels every 6h; 7D: ticks every 12h / labels every 1d; 14D: ticks every 1d / labels every 2d; 30D: ticks every 2d / labels every 5d. (6) Updated SVG render block to render tick marks (short 3px lines, 0.5 stroke, 0.6 opacity) separately from text labels (4px tick + text). (7) Added `amount_in_body_default_timeframe` select dropdown to `getConfigForm()` `graphs_panel` expandable, immediately after `show_amount_in_body` toggle, with 6 options (12h/24h/48h/7d/14d/30d).
- **[`src/localize.ts`](src/localize.ts)** — Added `graphs.timeframe_24h` ('24H'), `aria.timeframe_24h` ('24 hours'), `config.amount_in_body_default_timeframe` ('Amount in Body Default Timescale'), `config.helper.amount_in_body_default_timeframe` (helper explaining the use case for shorter windows).
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build`, clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated).
- **[`README.md`](README.md)** — Added `amount_in_body_default_timeframe` row to Configuration Options table; updated Graphs feature line to include 24H in the timeframe list.
- **[`plans/12h-time-indicators-and-default-timescale-plan.md`](plans/12h-time-indicators-and-default-timescale-plan.md)** — architecture plan for the feature.

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `README.md` (frontend)
- `plans/12h-time-indicators-and-default-timescale-plan.md` (frontend, new plan)

## Key Design Decisions
1. **Tick marks vs text labels separated** — The user wanted "more time indicators, pref every hour" on the 12H graph. Rendering 13 text labels in 320px would be ~21px each — too dense. Splitting tick marks (visual only, no text) from text labels gives hourly visual granularity + readable text every 2h. This also improved density for all other timeframes (24H/48H/7D/14D/30D get finer tick marks while keeping readable text spacing).
2. **24H added to all timeframes** — The 24H option bridges the gap between 12H (acute tracking) and 48H (longer view). Useful for medications with ~12h half-lives where 48H shows too much flat tail.
3. **Config default applied in `connectedCallback`** — This is the single reset point for `_activeTimeframe` (already reset to '48h' there). Reading from config at this location means the default applies on every fresh view entry without interfering with in-session chip changes.
4. **Validation guard on configured value** — If a user manually edits YAML with an invalid value, the card falls back to '48h' instead of breaking the graph. Valid set checked against `['12h', '24h', '48h', '7d', '14d', '30d']`.
5. **Dropdown in `graphs_panel` expandable** — Placed right after `show_amount_in_body` toggle so it's contextually grouped with the amount-in-body feature it controls.

## Previous Context
## Previous Context
### Take-Pill Button Icon + Big Text Toggle Fix (2026-06-25)
- **`src/ax-dose-logger-card.ts`** — (1) Added `take_pill_icon?: string` to the `AxDoseLoggerCardConfig` interface. (2) Added an `{ name: 'take_pill_icon', selector: { icon: {} } }` entry to the `getConfigForm()` schema, placed immediately after `big_text`. (3) Changed the take-pill button `<ha-icon>` from `isLimitReached ? 'mdi:alert' : 'mdi:pill'` to `isLimitReached ? 'mdi:alert' : (this.config?.take_pill_icon || 'mdi:pill')` so the custom icon applies only in the non-limit state. (4) Fixed the `--pill-text-offset` default in the `<ha-card>` style from `${this.config?.big_text !== false ? '0px' : '-2px'}` to `${this.config?.big_text === true ? '0px' : '-2px'}` so undefined/OFF defaults to small text.
- **`src/localize.ts`** — Reworded `'config.big_text'` from `'Big Text'` to `'Large Text'`; rewrote `'config.helper.big_text'` to "When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view."; added `'config.take_pill_icon': 'Take Pill Icon'` and `'config.helper.take_pill_icon': 'Icon shown on the Take Pill button when the limit has not been reached. Defaults to mdi:pill. The limit-reached state always uses mdi:alert.'`.
- **`dist/ax-dose-logger-card.js`** — rebuilt via `yarn run build`, clean compilation (exit 0; pre-existing `@formatjs/intl-utils` "this rewritten to undefined" warnings are transitive-dependency noise, unrelated).
- **`README.md`** — Updated Configuration Options table: `big_text` default changed from `true` to `false` with reworded description; added new `take_pill_icon` row.
- **`plans/take-pill-icon-and-text-toggle-plan.md`** — architecture plan for the feature.

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `src/localize.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `README.md` (frontend)
- `plans/take-pill-icon-and-text-toggle-plan.md` (frontend, new plan)

## Key Design Decisions
1. **LIMIT REACHED icon locked to `mdi:alert`** — The alert icon is a safety affordance signaling that taking a dose will override the safety gate. Making it user-overridable risks a user picking a benign-looking icon that downplays the override weight. The custom icon applies only in the safe (non-limit) state.
2. **HA native `icon` selector** — Using `selector: { icon: {} }` renders HA's standard icon picker (search + preview grid), matching how stock Lovelace cards expose icon overrides. No custom UI needed.
3. **`big_text === true` over `!== false`** — The previous `!== false` treated `undefined` (a fresh card with the toggle unchecked) as "big", disagreeing with the editor toggle's OFF state. `=== true` makes only an explicit ON yield big text, so the visual state and toggle state agree on a fresh card. Default is now small (compact), per user request.
4. **Label reword "Big Text" → "Large Text"** — "Large Text" paired with the helper "When on, all text becomes 2px larger" makes the directionality explicit: turning it ON makes text bigger. The previous "Big Text" + "When off, all text is 2px smaller" was inverted/confusing.

## Previous Context
### Override Popup Wording Rework (2026-06-25)
- **`src/localize.ts`** — Replaced the single `dialog.override.body` key ("Pill limit does not reset until: {expiry}. Override?") with two type-specific keys: `dialog.override.body_scheduled` ("Your next scheduled dose is not until {time}. Take a dose now anyway?") and `dialog.override.body_as_needed` ("Your next safe dose is not until {time}. Take a dose now anyway?"). The `{time}` placeholder receives a pre-formatted absolute clock time. `dialog.override.confirm` ("Override") and `dialog.cancel` ("Cancel") unchanged.
- **`src/ax-dose-logger-card.ts`** — (1) Added `formatTime, formatDateTime` to the `custom-card-helpers` import (alongside the existing `fireEvent`). (2) Extended the `_overrideDialog` state shape from `{ windowExpiry, entities }` to `{ timeLabel, bodyKey, entities }` where `bodyKey` is the typed union `'dialog.override.body_scheduled' | 'dialog.override.body_as_needed'`. (3) Added `_formatOverrideTime(date: Date): string` helper that picks `formatTime` for same-day times and `formatDateTime` for cross-day times, falling back to `toLocaleTimeString()` when `hass.locale` is unavailable. (4) Rewrote the override-trigger block in `_handleTakePill` to normalize `tracking_type` defensively (snake_case `as_needed` **and** legacy title-case `As Needed`), branch the time source + body key by tracking type (scheduled → `next_dose` sensor state; As Needed → `window_expires_at` attribute), and fall back to the existing `_computeWindowExpiry()` relative-duration string when the absolute-time source is missing/invalid. (5) Updated `_renderOverrideDialog` body to call `localize(this._lang, dlg.bodyKey, { time: dlg.timeLabel })`.
- **`dist/ax-dose-logger-card.js`** — rebuilt via `yarn run build`, clean compilation (exit 0; the `@formatjs/intl-utils` "this rewritten to undefined" warnings are pre-existing transitive-dependency warnings, unrelated to this change).
- **`plans/override-popup-wording-plan.md`** — architecture plan for the feature.

## Files Modified
- `src/localize.ts` (frontend)
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `plans/override-popup-wording-plan.md` (frontend, new plan)

## Key Design Decisions
1. **Branch by tracking type** — Scheduled medications have a clinically designated dose time exposed by the `next_dose` sensor; As Needed medications have no schedule, so the only relevant time is when the rolling safety window resets (`window_expires_at` attribute on `pills_safe_to_take`). "Next scheduled dose" / "next safe dose" replaces the jargony "pill limit" / "rolling window" phrasing. The `tracking_type` attribute is already exposed on the `next_dose` sensor (backend `sensors/next_dose.py:134`).
2. **Absolute clock time over relative duration** — "3h 45m" is less actionable than the actual clock time the user is waiting for. HA's locale-aware `formatTime` (same-day) / `formatDateTime` (cross-day) from `custom-card-helpers` produces e.g. "2:30 PM" or "Tomorrow, 8:00 AM", matching the user's HA locale settings.
3. **Defensive tracking_type normalization** — The backend stores `tracking_type` as snake_case (`as_needed`, per `const.py:18`), but the pre-existing `_computeOverTime()` checked `=== 'As Needed'` (title case). The new logic lowercases and accepts both `as_needed` and `as needed` to avoid a silent mismatch on either backend generation.
4. **"Override" button label retained** — The user explicitly confirmed the repetition of "Override" (header question + button) is intentional to convey the weight of taking a dose against the safety gate. Not changed to "Take Now" or similar.
5. **Fallback to relative duration** — If `next_dose` is unavailable/unknown/past for a scheduled med, or `window_expires_at` is missing for As Needed, the dialog falls back to the existing `_computeWindowExpiry()` relative-duration string so it never shows "Invalid Date". `_computeWindowExpiry()` is kept (not removed) for this reason.
6. **Reset History untouched** — Per user clarification, the Reset History button, its dialog, and the backend `PillResetButton` entity are out of scope. Only the take-pill-past-limit override popup was changed.

## Previous Context
### Stats Pane Clickable More-Info (2026-06-25)
- **`src/ax-dose-logger-card.ts`** — (1) Added `import { fireEvent } from 'custom-card-helpers'`. (2) Extended the `_renderPane3()` row type from `{ label, value, icon }` to `{ label, value, icon, entityId? }` and threaded the source entity_id into every `rows.push()` call (totalDoses, daysSinceFirstDose, lastDose, strength, amountInBody, steadyState, avg7/14/30/Yearly, adherence7/14/30/365). (3) Added `@click` + `@keydown` handlers, `role="button"`, and `tabindex="0"` to each `.stat-cell` (gated on `row.entityId`). (4) Added `_openMoreInfo(entityId)` helper that fires the canonical `hass-more-info` event via `fireEvent`. (5) Added `_onStatCellKeydown(e, entityId)` helper for Enter/Space keyboard activation. (6) Added `.stat-cell.clickable` (cursor pointer + hover background + focus-visible outline) and `transition: background 0.15s ease` to the base `.stat-cell` rule.
- **`dist/ax-dose-logger-card.js`** — rebuilt via `yarn run build`, clean compilation (exit 0).
- **`plans/stats-more-info-plan.md`** — architecture plan for the feature.

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `plans/stats-more-info-plan.md` (frontend, new plan)

## Key Design Decisions
1. **`fireEvent` from custom-card-helpers** — Used the canonical HA helper rather than a hand-rolled `CustomEvent`. `fireEvent` defaults to `{ bubbles: true, composed: true }`, which is exactly what HA's more-info dialog listener expects. This is the same `hass-more-info` event fired by `handleAction` in custom-card-helpers (line 1117) for every stock Lovelace card's more-info tap action.
2. **Entity_id threaded into rows** — Each `rows.push()` already had the entity reference in scope (e.g. `entities.totalDoses`), so adding `entityId: entities.totalDoses` was a one-field-per-row change with no new lookups. Rows that are purely computed (none currently) simply omit the field and render without the `.clickable` class or click handler.
3. **Accessibility parity with existing `.stat-pill.clickable`** — The refill stat-pill at line 788 already uses `role="button"` for its clickable variant. The stat-cells follow the same pattern plus `tabindex="0"` and a `@keydown` handler for Enter/Space, and a `:focus-visible` outline for keyboard users.

## Previous Context
### Tracking Scale & Override Fix (v2) — 2026-06-21
Fixed two remaining issues: (1) tick mark scale alignment — "0" was at ~0.5 position (too far right) and "10" needed to shift right ~1/4 spacing; (2) override button closed dialog but didn't actually change the value — root cause was the `set_metric` service requiring `entry_id` + `metric_key` which the frontend couldn't reliably resolve from a Lovelace card context. Fixed by changing the service to accept `entity_id` directly (the effectiveness number entity), with the backend resolving entity_id → coordinator + metric_key via the entity registry.

#### Tracking Scale & Override Fix v2 — details
- **`src/ax-dose-logger-card.ts`** — (1) Scale alignment: changed `.tracking-scale` from symmetric `padding: 0 12px` to asymmetric `padding-left: 6px; padding-right: 2px` with `box-sizing: border-box`; removed `min-width: 14px` from `.tracking-scale-tick` so ticks size to content width for precise center alignment with slider thumb positions. (2) Override fix: override button handler now calls `ax_dose_logger.set_metric` with `entity_id` + `value` + `override: true` (no more `entry_id` or `metric_key` — the backend resolves these from the entity). Removed `configEntryId` from `ResolvedEntities` interface and `_computeEntities()` (no longer needed). Removed dead `_getEntryId()` method.
- **`dist/ax-dose-logger-card.js`** — rebuilt via `yarn run build`, clean compilation (exit 0).

#### Backend Changes (2026-06-21)
- **`custom_components/ax_dose_logger/services.py`** — Changed `set_metric` service schema from `entry_id` + `metric_key` to `entity_id`. Added `_get_coordinator_for_entity()` helper that resolves `entity_id` → entity registry → `config_entry_id` → coordinator, and reads `metric_key` from the entity's state attributes. Added `ATTR_ENTITY_ID` constant. Added `entity_registry as er` import and `HomeAssistantError` import.
- **`custom_components/ax_dose_logger/services.yaml`** — Updated `set_metric` fields: replaced `entry_id` (config_entry selector) + `metric_key` (text selector) with `entity_id` (entity selector filtered to number domain + ax_dose_logger integration).
- **`custom_components/ax_dose_logger/strings.json`** + **`translations/en.json`** — Updated `set_metric` service field labels: replaced `entry_id` ("Medication") + `metric_key` ("Metric Key") with `entity_id` ("Tracking Entity").

#### Key Design Decisions (v2)
1. **Scale alignment via asymmetric padding** — The ha-slider thumb sits ~10px from each track edge at min/max. Single-digit ticks are ~8px wide (center at 4px), so `padding-left: 6px` places "0" center at 10px. The "10" tick is two digits (~14px, center at 7px), so `padding-right: 2px` shifts it right to match the thumb at max. Removed `min-width: 14px` so ticks don't add extra offset.
2. **Entity-based service (the real fix)** — The first attempt (configEntryId in ResolvedEntities) failed because `hass.entities[entityId].config_entry_id` is not reliably available in a Lovelace card context. The correct fix is to change the `set_metric` service to accept `entity_id` directly — the frontend already knows the entity_id (it's the slider's entity). The backend resolves entity_id → coordinator + metric_key via the entity registry (`er.async_get(hass).async_get(entity_id)`) and state attributes (`hass.states.get(entity_id).attributes['metric_key']`). This is the same pattern used by `number.set_value` and `button.press` — entity-targeted services that don't require the caller to resolve config entries.
3. **Why the first attempt failed** — `hass.entities` in the HA frontend is populated via a websocket subscription, but `config_entry_id` may not be present in all contexts or may be undefined for entities created via certain mechanisms. The entity-based approach eliminates this fragility entirely — the frontend just passes the entity_id it already has.

### Tracking Dialog & Scale Fixes (2026-06-21)
- Added `_trackingOverrideDialog` to `shouldUpdate()` key list (root cause of dialog buttons not working). Restructured tick marks into `.tracking-slider-wrapper`.

### Tracking Pane Fixes (2026-06-21)
- Label derivation via `metric_label` attribute; `_pendingTracking` Set for race condition; 0-10 tick marks; "Today's {metric}" dialog format.

### Metrics → Tracking Rename (2026-06-21)
- Renamed pane ID, CSS classes, localize keys. "Tracking" is standard clinical terminology.

### Overdue Display Fix (2026-06-21)
- Added `overdue` sensor support; rewrote `_computeOverTime()`.

### Line Graph Gap-Bridging Fix (2026-06-21)
- Added `_bridgeGaps()` helper to eliminate misleading diagonal slopes.

### Rebrand to AX Dose Logger Card (2026-06-21)
- Full rename from "Pill Logger Card" to "AX Dose Logger Card".
