# Progress — Pill Logger Card (Frontend)

## Initial Implementation — Complete Custom Lovelace Card

### Planning
- [x] Read backend README for entity/data model understanding
- [x] Read custom-card.md and custom-card-feature.md for HA card API
- [x] Explore frontend workspace structure and available dependencies
- [x] Create detailed architecture plan in plans/implementation-plan.md

### Build Infrastructure
- [x] Create package.json with lit, rollup, typescript dependencies
- [x] Create tsconfig.json (Node16 module resolution, experimentalDecorators)
- [x] Create rollup.config.js (typescript + node-resolve plugins)

### Card Implementation (src/pill-logger-card.ts)
- [x] PillLoggerCard class extending LitElement
- [x] Device-centric entity resolution (iterate hass.entities, filter by device_id)
- [x] Pane 1 (Daily): medication name, Take Pill button (conditional safe/danger), Safe/Left stat pills, Next Dose countdown, custom entity chips (up to 4)
- [x] Pane 2 (Graphs): carousel with 15-day SVG bar chart (dose_history bucketing) and Amount in Body SVG line graph, averages/adherence grid
- [x] Pane 3 (Stats): clean list view of all available statistics
- [x] Bottom pane selector (Daily / Graphs / Stats buttons)
- [x] PillLoggerCardEditor with ha-device-picker, entity pickers for chips, show_amount_in_body toggle
- [x] customElements.define for both card and editor
- [x] window.customCards.push boilerplate

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors
- [x] Output: dist/pill-logger-card.js (56KB, 1129 lines)

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md
- [x] Update memory-bank/projectstructure.md

## Editor Fix — Migrate to getConfigForm()

### Problem Analysis
- [x] Identified root cause: ha-device-picker and ha-entity-picker are lazy-loaded custom elements that don't render when custom editor loads
- [x] Identified secondary issue: entity pickers show all entities instead of filtering by selected device
- [x] Researched HA frontend picker/selector APIs in hass_frontend package

### Planning
- [x] Created architecture plan in plans/editor-fix-plan.md
- [x] Decided on getConfigForm() approach: HA handles lazy-loading, supports device-scoped entity filtering

### Implementation
- [x] Updated PillLoggerCardConfig interface: replaced `chips?: string[]` with `chip_1?` through `chip_4?` flat fields
- [x] Added backward compatibility in setConfig(): converts legacy `chips[]` array to `chip_N` flat fields
- [x] Added `_getChipEntities()` helper method to read chip_1..chip_4 from config
- [x] Updated `_renderPane1()` to use `_getChipEntities()` instead of `config.chips`
- [x] Added `getConfigForm()` static method with device selector (filtered to pill_logger integration), boolean toggle, and entity selectors with `context: { filter_device_id: "device_id" }`
- [x] Added `computeLabel` and `computeHelper` callbacks for user-friendly labels and hints
- [x] Removed `getConfigElement()` static method
- [x] Removed entire `PillLoggerCardEditor` class and its CSS styles
- [x] Removed `pill-logger-card-editor` customElements.define registration
- [x] Updated `getStubConfig()` to return flat chip format (no chips array)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## Layout Restructure — Daily Pane Redesign

### Planning
- [x] Created architecture plan in plans/layout-restructure-plan.md
- [x] Six changes scoped: full-width default, two-column layout, next-dose reposition, renamable chips, strength suffix, name override

### Implementation
- [x] Changed `getGridOptions()` columns: 6 → 12 for full-width card default
- [x] Added `name` field to `PillLoggerCardConfig` for medication name override
- [x] Added `chip_1_label` through `chip_4_label` fields to `PillLoggerCardConfig`
- [x] Added `_getMedName()` helper: config.name override + strength suffix auto-filter
- [x] Restructured `_renderPane1()`: med-name → next-dose → daily-main (two-column) → chips-row
- [x] Updated `_getChipEntities()` to return `{ entityId, label }` objects
- [x] Updated chip rendering: custom label → friendly_name → entity_id fallback chain
- [x] Updated `getConfigForm()`: added `name` text selector, `chip_N_label` text selectors paired after entity selectors
- [x] Updated `computeLabel` and `computeHelper` for all new fields
- [x] CSS: added `.daily-main`, `.stats-column`, `flex: 1` on `.take-pill-btn`, removed `.stat-pills`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## UI Refinements — Labels, Formatting, Stats Layout

### Planning
- [x] Created architecture plan in plans/ui-refinements-plan.md
- [x] Six changes scoped: move show_amount_in_body to bottom, integer formatting for Safe/Left, label renames, Stats pane 2-column grid

### Implementation
- [x] Moved `show_amount_in_body` schema entry from position 2 to bottom of `getConfigForm()` schema array
- [x] Added `_formatInteger()` helper: `parseFloat` + `Math.round()`, returns original string for non-numeric values
- [x] Renamed "Safe" → "Safe to take" in `_renderPane1()` stat-label
- [x] Renamed "Left" → "Pills left" in `_renderPane1()` stat-label
- [x] Applied `_formatInteger()` to `safeState` and `pillsLeft` in `_renderPane1()`
- [x] Converted `_renderPane3()` from single-column `.stats-list`/`.stat-row` to 2-column `.stats-grid`/`.stat-cell`
- [x] Applied `_formatInteger()` to `pillsLeft` and `pillsSafeToTake` in Stats pane; all other values retain entity precision
- [x] CSS: replaced `.stats-list`, `.stat-row`, `.stat-row-left`, `.stat-row-value` with `.stats-grid`, `.stat-cell`, `.stat-cell-header`, `.stat-cell-label`, `.stat-cell-value`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## Config Pane Restructure — Chips Submenu, Color Scheme, Stats Column Toggle

### Planning
- [x] Created architecture plan in plans/config-pane-restructure-plan.md
- [x] Three features scoped: chips in expandable submenu, color scheme selector (14 options), stats 3-column toggle
- [x] Researched HA form schema `expandable` panel type with `flatten: true`
- [x] Designed 14-color palette aligned with medical/pharmaceutical color-coding standards

### Implementation
- [x] Added `color_scheme` and `stats_3_columns` to `PillLoggerCardConfig` interface
- [x] Added `_getColorOverrides()` helper: 14-color lookup table, returns CSS custom property string or empty for Default
- [x] Applied color overrides as inline style on `<ha-card>` in `render()`
- [x] Inserted `color_scheme` select dropdown (14 options) above `name` in `getConfigForm()` schema
- [x] Wrapped 8 chip fields in `type: 'expandable'` panel with `flatten: true` and title "Custom Chips"
- [x] Added `stats_3_columns` boolean toggle below `show_amount_in_body` in schema
- [x] Updated `_renderPane3()`: conditional `three-col` class on `.stats-grid`
- [x] Added CSS rule `.stats-grid.three-col { grid-template-columns: 1fr 1fr 1fr; }`
- [x] Updated `computeLabel` with entries for `color_scheme`, `chips`, `stats_3_columns`
- [x] Updated `computeHelper` with hints for `color_scheme` and `stats_3_columns`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## Graph Pane Fix — SVG Rendering + Averages Compaction

### Problem Analysis
- [x] Identified root cause of SVG not rendering: `height="${h}px"` attribute with `px` suffix is invalid in SVG — SVG attributes must be unitless
- [x] Identified secondary issue: no CSS sizing fallbacks on `.chart-svg` or `.graph-container` — if SVG fails to establish height, container collapses
- [x] Identified variable shadowing: loop variable `h` in `_renderLineGraph()` shadows outer `const h`
- [x] Identified averages grid consuming excessive vertical space: 2-column grid with 8 items creates 4 rows (~160px)

### Planning
- [x] Created architecture plan in plans/graph-fix-plan.md
- [x] Five changes scoped: SVG attribute fix, CSS sizing fallbacks, variable rename, averages compaction, graph height increase

### Implementation
- [x] Removed `width="100%" height="${h}px"` from SVG elements in both `_renderBarGraph()` and `_renderLineGraph()` — sizing now handled by CSS
- [x] Added `width: 100%; height: auto; min-height: 180px` to `.chart-svg` CSS
- [x] Added `min-height: 180px` to `.graph-container` CSS
- [x] Renamed loop variable `h` → `hours` in `_renderLineGraph()` to avoid shadowing
- [x] Increased SVG chart height from 140 to 180 in both graph renderers, `padBottom` 24 → 28
- [x] Changed `.averages-grid` from `grid-template-columns: 1fr 1fr` to `display: flex; flex-wrap: wrap; gap: 6px`
- [x] Reduced `.avg-cell` padding from `10px 8px` to `6px 4px`, added `flex: 1; min-width: 0`
- [x] Reduced `.avg-value` font-size from `16px` to `13px`
- [x] Reduced `.avg-label` font-size from `10px` to `9px`, added `white-space: nowrap`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## Graph Rendering Fix — Variable Shadowing + SVG Intrinsic Dimensions

### Problem Analysis
- [x] Identified Bug 1: Line graph time labels loop body still referenced `h` (SVG height=180) instead of `hours` (loop variable 0-48) — previous fix only renamed the `for` declaration, missed the body references
- [x] Identified Bug 2: Both SVG elements lacked `width`/`height` attributes after previous fix removed them entirely — browsers default to square aspect ratio without intrinsic dimensions
- [x] Identified Bug 3: CSS `min-height: 180px` on `.chart-svg` distorts aspect ratio on narrow cards
- [x] Identified Bug 4: Missing `preserveAspectRatio` on SVG elements

### Planning
- [x] Created architecture plan in plans/graph-rendering-fix-plan.md
- [x] Four changes scoped: fix loop body references, restore unitless width/height, remove min-height from SVG CSS, add preserveAspectRatio

### Implementation
- [x] Fixed `_renderLineGraph()` loop body: `fraction = h / 48` → `fraction = hours / 48`, `hour: h` → `hour: hours`
- [x] Added `width="${w}" height="${h}"` (unitless) to bar graph SVG element
- [x] Added `width="${w}" height="${h}"` (unitless) to line graph SVG element
- [x] Added `preserveAspectRatio="xMidYMid meet"` to both SVG elements
- [x] Removed `min-height: 180px` from `.chart-svg` CSS; kept on `.graph-container` only

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

## CSS Aspect-Ratio Fix — Replace height:auto with aspect-ratio

### Problem Analysis
- [x] Identified root cause: CSS `height: auto` on `.chart-svg` is unreliable for SVG elements — browsers inconsistently derive intrinsic aspect ratio when CSS overrides the width presentation attribute, causing fallback to default replaced-element size (often square)
- [x] Confirmed SVG content is correct via DevTools inspection: grid lines, bars, labels all at correct viewBox coordinates — problem is purely CSS sizing
- [x] Both graphs share `.chart-svg` class, so single CSS fix resolves both symptoms: bar graph "big square box" and line graph "grey line at bottom + blue dotted line"

### Implementation
- [x] Replaced `height: auto` with `aspect-ratio: 320 / 180` in [`.chart-svg`](src/pill-logger-card.ts:1135-1139) CSS
- [x] Kept SVG `width="320" height="180"` presentation attributes as intrinsic dimension fallback
- [x] Kept `preserveAspectRatio="xMidYMid meet"` on both SVG elements

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors
- [x] Verified `aspect-ratio: 320 / 180` present in compiled dist output

## SVG Namespace Fix — LitElement `svg` Tag Function

### Problem Analysis
- [x] Identified root cause: All dynamic SVG children (grid lines, bars, time labels, dose markers) were created using the `html` tag function, which places elements in the HTML DOM namespace instead of the SVG namespace — the browser treats `<rect>`, `<line>`, `<circle>`, `<text>` in HTML namespace as unknown elements and renders nothing
- [x] Confirmed via DevTools: static SVG elements (baseline, dashed line, "Current" text) rendered correctly because they're directly in the template string; dynamic elements (inside `.map()` callbacks) were invisible
- [x] This is a classic LitElement trap: unlike React/JSX which auto-detects SVG context, Lit requires explicit `svg` tag function for dynamically-generated SVG children

### Implementation
- [x] Added `svg` to Lit import: `import { LitElement, html, svg, css, nothing } from 'lit'`
- [x] Changed `html` → `svg` in `_renderBarGraph()`: grid lines (5), bar rects (15), bar labels (every 3rd)
- [x] Changed `html` → `svg` in `_renderLineGraph()`: time labels (9), dose markers, "No doses" fallback
- [x] Retained CSS `aspect-ratio: 320 / 180` from previous fix for reliable SVG sizing

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors
- [x] Verified compiled output: `svg` tag function compiled to `w` in all graph callbacks

## Graph UI Refinements — Edge-to-Edge SVG, Conditional Averages, 14-Day Rename

### Planning
- [x] Analyzed current code: graph-container padding, averages grid rendering, bar graph title and bucket count
- [x] Created architecture plan: three targeted changes scoped to src/pill-logger-card.ts

### Implementation
- [x] Removed `padding: 8px` from `.graph-container` CSS — set to `padding: 0` so SVG fills colored background box edge-to-edge
- [x] Changed `_renderPane2()` to conditionally render averages grid: `${activeSlide === 'bar' ? this._renderAveragesGrid(entities) : nothing}`
- [x] Changed `_bucketByDay()` loop from `for (let i = 14; i >= 0; i--)` (15 buckets) to `for (let i = 13; i >= 0; i--)` (14 buckets)
- [x] Renamed both carousel nav title strings from `'15-Day Doses'` to `'14-day taken tracker'`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Follow-up Fix — SVG Width/Height Attribute Removal
- [x] Removed `width="${w}" height="${h}"` HTML presentation attributes from both SVG elements in `_renderBarGraph()` and `_renderLineGraph()`
- [x] CSS `width: 100%` + `aspect-ratio: 320/180` on `.chart-svg` now fully controls SVG sizing without HTML attribute interference
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Graph UI Refinements — Bar Label Rotation + Line Graph Rewrite

### Planning
- [x] Analyzed bar graph label overlap: 14 labels at font-size 7 with ~18px bar width cause horizontal collision
- [x] Analyzed line graph: current implementation is a scatter plot of dose events, not a line graph
- [x] Created architecture plan: rotate bar labels -45°, rewrite line graph with exponential decay curve

### Implementation — Bar Graph Labels
- [x] Increased `padBottom` from 28 to 40 in `_renderBarGraph()` to accommodate rotated labels
- [x] Removed `i % 3 === 0` filter — now shows all 14 date labels
- [x] Added `transform="rotate(-45, ...)"` and changed `text-anchor` from `"middle"` to `"end"` for vertical orientation

### Implementation — Line Graph Rewrite
- [x] Added `_computeDecayCurve()` helper method: exponential decay formula `amount *= e^(-ln2 × Δt / halfLife)`, half-life from steady state entity (fallback: 12h), 97 points at 30-min intervals
- [x] Rewrote `_renderLineGraph()`: Y-axis grid lines/labels, `<polyline>` decay curve, dose circle markers on the curve, X-axis time labels, "Current: X mg" dashed reference line
- [x] Changed `padLeft` from 32 to 36 for wider Y-axis labels, `padTop` from 20 to 16

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Graph UI Refinements — Bar Label Clipping Fix + Line Graph History API Rewrite

### Problem Analysis
- [x] Bar graph labels clipped: viewBox height 180 with padBottom=40 puts rotated labels at y=172, -45° rotation extends text below y=180, causing clipping
- [x] Line graph uses computed decay curve instead of actual sensor history — user explicitly requested showing real `sensor.*_amount_in_body` history going back 48 hours
- [x] Checked backend `concentration.py`: sensor only stores current state, no time-series history — must use HA REST API `/api/history/period/`
- [x] Dose markers on line graph not needed per user request

### Planning
- [x] Fix 1: Increase bar graph viewBox height from 180 to 210, set `style="aspect-ratio: 320/210"` inline on bar SVG, remove shared `aspect-ratio: 320/180` from `.chart-svg` CSS, add `style="aspect-ratio: 320/180"` inline on line SVG
- [x] Fix 2: Add `_amountHistory` @state, `_fetchAmountHistory()` method using HA REST API with auth token, `updated()` lifecycle callback, remove `_computeDecayCurve()`, rewrite `_renderLineGraph()` to use actual history data, remove all dose markers

### Implementation
- [x] Increased bar graph `h` from 180 to 210 in `_renderBarGraph()`
- [x] Added `style="aspect-ratio: 320/210"` to bar graph SVG element
- [x] Removed `aspect-ratio: 320/180` from `.chart-svg` CSS — each SVG now sets its own inline
- [x] Added `style="aspect-ratio: 320/180"` to line graph SVG element
- [x] Added `@state() private _amountHistory` and `@state() private _historyLoading` properties
- [x] Added `_fetchAmountHistory()` method: fetches 48h history from `/api/history/period/` using `hass.auth.data.access_token`
- [x] Added `updated()` lifecycle callback: triggers `_fetchAmountHistory()` when graphs pane is active
- [x] Removed `_computeDecayCurve()` method entirely
- [x] Rewrote `_renderLineGraph()`: removed `doseHistory` parameter, uses `_amountHistory` state, polyline from actual values, no dose markers, "Loading history..." placeholder
- [x] Updated call site: `_renderLineGraph(entities, doseHistory)` → `_renderLineGraph(entities)`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Bar Graph Label Simplification — Day Numbers Only, No Rotation

### Problem Analysis
- [x] User feedback: 45° rotated labels still problematic — gap, alignment, and visual complexity
- [x] Decision: drop rotation entirely, use day-of-month numbers only (1–2 characters fit horizontally without overlap)

### Planning
- [x] Two targeted edits: change label format in `_bucketByDay()`, remove rotation CSS from `.bar-labels span`

### Implementation
- [x] Changed `_bucketByDay()` label from `toLocaleDateString('en-US', { month: 'short', day: 'numeric' })` to `d.getDate().toString()` — labels now "1", "2", ... "14"
- [x] Removed `transform: rotate(-45deg)`, `transform-origin: right top`, `text-align: right`, `padding-right: 2px` from `.bar-labels span` CSS
- [x] Changed `.bar-labels span` to `text-align: center` — clean, centered, horizontal day numbers
- [x] Retained HTML label row structure from Iteration 4 (flex row below SVG with proportional padding)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## UI Tweaks — Strength Formatting, Device Dialog, Label Margin

### Planning
- [x] Analyzed source code: identified strength display locations (title line 321, Stats pane line 668), bar label CSS (lines 1223-1238), and dialog integration points
- [x] Created architecture plan in plans/ui-tweaks-plan.md
- [x] Three changes scoped: strength integer formatting, title click → device info dialog, date label bottom margin

### Implementation
- [x] Changed `_getMedName()` line 321: `strengthState` → `this._formatInteger(strengthState)` — title shows integer strength
- [x] Changed `_renderPane3()` line 668: `this._getState(entities.strength)` → `this._formatInteger(this._getState(entities.strength))` — Stats pane shows integer strength
- [x] Added `@state() _showDeviceInfo: boolean = false` property
- [x] Added `_navigateToDevice()` method: `window.location.href = /config/devices/device/${device_id}`
- [x] Added `_renderDeviceInfoDialog()` method: fixed overlay with backdrop, dialog box, title, "To Device info" button
- [x] Added `@click` handler on `.med-name` to set `_showDeviceInfo = true`
- [x] Added conditional dialog rendering in `render()`: `${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : nothing}`
- [x] Added `cursor: pointer` to `.med-name` CSS
- [x] Added dialog CSS: `.dialog-backdrop`, `.dialog-box`, `.dialog-title`, `.dialog-btn` with hover
- [x] Added `padding-bottom: 6px` to `.bar-labels` CSS
- [x] Changed `.bar-labels span` `line-height` from `1` to `1.4`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Bar Graph Label Layout Rethink — HTML Labels with CSS Rotation

### Problem Analysis
- [x] Identified three interrelated issues: excessive 32px gap between chart baseline and labels, label-to-bar misalignment from SVG `text-anchor="end"` + `rotate(-45)`, viewBox bloat (h=210) solely to prevent clipping
- [x] Root cause: SVG `<text>` rotation has unpredictable pivot/anchor behavior — the only fix was inflating the viewBox, creating dead space

### Planning
- [x] Created architecture plan in plans/bar-label-rethink-plan.md
- [x] Decided on HTML label approach: remove text from SVG, render labels as CSS flex row below SVG with proportional padding for alignment

### Implementation
- [x] Reduced bar graph SVG viewBox from 320×210 to 320×180 in `_renderBarGraph()`
- [x] Reduced `padBottom` from 40 to 8 (only baseline stroke needed)
- [x] Increased `padTop` from 8 to 10 (slightly more breathing room)
- [x] Removed all `<text>` elements from SVG buckets loop — date labels extracted from SVG
- [x] Added explicit baseline `<line>` at `y = h - padBottom`
- [x] Wrapped SVG in `<div class="bar-graph-wrapper">` with sibling `<div class="bar-labels">`
- [x] Labels rendered as 14 `<span>` elements using `html` tag function (not `svg`)
- [x] Label container uses `padding-left: 10%` and `padding-right: 2.5%` matching SVG pad ratios
- [x] Each label `<span>` gets `flex: 1` for equal-width distribution matching bar centers
- [x] Labels use CSS `transform: rotate(-45deg)` with `transform-origin: right top`
- [x] Added `.bar-graph-wrapper`, `.bar-labels`, and `.bar-labels span` CSS rules
- [x] Bar graph aspect-ratio changed from `320/210` to `320/180` (now matches line graph)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Refill Button — Next Dose Row + Refill Dialog

### Planning
- [x] Analyzed current codebase: next-dose layout, entity resolution (addRefill already resolved), dialog pattern
- [x] Created architecture plan in plans/refill-button-plan.md
- [x] Six changes scoped: state properties, _handleRefill() action, _renderRefillDialog(), pane1 restructure, CSS additions, render() conditional

### Implementation
- [x] Added `@state() _showRefillDialog: boolean = false` and `@state() _refillAmount: string = ''` properties
- [x] Added `_handleRefill()` method: validates input (isNaN, <= 0), calls `hass.callService('number', 'set_value', { entity_id, value })` on `entities.addRefill`, closes dialog and clears input
- [x] Added `_renderRefillDialog()` method: fixed-position dialog overlay with number input (min=1, step=1), Cancel and Refill buttons, backdrop-click/Escape dismiss
- [x] Restructured `_renderPane1()`: wrapped `.next-dose` in `.next-dose-row` flex container; added conditional `.refill-btn` (only when `entities.addRefill` exists)
- [x] Added `.next-dose-row` CSS: `display: flex; gap: 8px`
- [x] Added `.next-dose-row .next-dose` CSS: `flex: 1` (half width)
- [x] Added `.refill-btn` CSS: `flex: 1`, styled with primary-color background/hover
- [x] Added `.refill-input` CSS: full-width number input with focus border-color
- [x] Added `.dialog-actions` CSS: flex row for Cancel/Refill buttons
- [x] Added `.dialog-cancel` and `.dialog-confirm` CSS: styled action buttons
- [x] Added conditional refill dialog rendering in `render()`: `${this._showRefillDialog ? this._renderRefillDialog(entities) : nothing}`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Pane 1 Overhaul — Next Dose Unboxed + Clickable Pills Left

### Planning
- [x] Analyzed current Pane 1 layout: next-dose-row flex wrapper, next-dose box, refill button, stats-column
- [x] Created architecture plan in plans/pane1-overhaul-plan.md
- [x] Seven changes scoped: HTML template restructure (2), CSS rule deletion (1), CSS restyle (4)

### Implementation — Phase 1 (Next Dose Unboxed)
- [x] Removed `.next-dose-row` wrapper — next-dose is now a direct child of `.pane-daily`
- [x] Restyled `.next-dose`: removed box styling (padding, background, border-radius), added `justify-content: center`, reduced font to 13px, set `font-weight: 400`
- [x] Changed `.next-dose ha-icon` color from `var(--primary-color)` to `var(--secondary-text-color)` — icon matches text color
- [x] Deleted `.next-dose-row` and `.next-dose-row .next-dose` CSS rules

### Implementation — Phase 2 (Clickable Pills Left)
- [x] Removed the separate "Refill Medication" button entirely
- [x] "Pills left" stat-pill now conditionally clickable: when `entities.addRefill` exists, gets `.clickable` class and `@click` handler opening refill dialog
- [x] When `addRefill` missing, stat-pill remains static display with no click behavior
- [x] Removed all `.refill-btn`, `.refill-btn:hover`, `.refill-btn ha-icon` CSS rules
- [x] Added `.stat-pill.clickable` CSS: `cursor: pointer` + hover background

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Card Overlap Fix — Remove overflow:hidden, Add card-resize, Dynamic getCardSize

### Problem Analysis
- [x] Identified root cause 1: `overflow: hidden` on `ha-card` CSS clips bottom nav buttons and expanding pane content
- [x] Identified root cause 2: Static `getCardSize()` returns fixed 5 regardless of pane height
- [x] Identified root cause 3: No `card-resize` event dispatch on pane switch — HA masonry layout never recalculates

### Planning
- [x] Created architecture plan in plans/card-overlap-fix-plan.md
- [x] Four changes scoped: remove overflow:hidden from ha-card, add overflow:hidden to .graph-container, dispatch card-resize event, dynamic getCardSize()

### Implementation
- [x] Removed `overflow: hidden` from `ha-card` CSS rule (line 1026) — replaced with comment
- [x] Added `overflow: hidden` to `.graph-container` CSS rule (line 1301) — preserves SVG clipping only where needed
- [x] Added `card-resize` event dispatch in `updated()` lifecycle (line 842): `if (changedProperties.has('_activePane')) { this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true })); }`
- [x] Changed `getCardSize()` from static `return 5` to dynamic switch: graphs→8, stats→7, daily→5

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## ll-rebuild Infinite Loop Fix — Human-Bound Pane Switching

### Problem Analysis
- [x] Identified root cause: `ll-rebuild` event dispatched inside `updated()` lifecycle hook creates infinite loop — HA property updates re-trigger `updated()`, which fires `ll-rebuild` again
- [x] Identified secondary cause: `_activePane` transitions from `undefined` → `'daily'` on initial render, so `changedProperties.has('_activePane')` is `true` even on first load
- [x] Identified tertiary cause: `@click` directive directly mutates `_activePane` inline, triggering `updated()` → `ll-rebuild` → HA property update → `updated()` again

### Planning
- [x] Created architecture plan in plans/ll-rebuild-loop-fix.md
- [x] Three surgical changes scoped: remove ll-rebuild from updated(), add _handlePaneChange() method, reroute @click directive

### Implementation
- [x] Removed `ll-rebuild` dispatch block from `updated()` (lines 851-854 deleted) — lifecycle hook no longer fires layout rebuild events
- [x] Added `_handlePaneChange(paneId)` private method (line 330): guard check `if (paneId === this._activePane) return`, state update `this._activePane = paneId`, micro-tick dispatch `this.updateComplete.then(() => { this.dispatchEvent(...) })`
- [x] Rerouted `@click` directive in `_renderPaneSelector()` (line 797): `this._activePane = pane.id` → `this._handlePaneChange(pane.id)`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Dead Navigation Button Fix — Explicit requestUpdate()

### Problem Analysis
- [x] Identified root cause: `_handlePaneChange()` sets `this._activePane = paneId` but LitElement's internal batching suppresses the update cycle when a property is set inside a method that also chains `updateComplete` — the `@state()` setter's internal `requestUpdate()` gets deduped by the pending promise resolution
- [x] Confirmed `@click` binding syntax is already correct: `@click=${() => this._handlePaneChange(pane.id)}` — arrow function passing string `pane.id`

### Implementation
- [x] Added explicit `this.requestUpdate()` call in `_handlePaneChange()` after `this._activePane = paneId` — forces LitElement to schedule a fresh render cycle that cannot be deduped

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Pane State Persistence — sessionStorage across ll-rebuild

### Problem Analysis
- [x] Identified root cause: `ll-rebuild` is a destructive event in HA's Masonry layout — it tears down the card DOM and recreates the element from scratch, resetting `_activePane` to its default `'daily'`
- [x] The card switches to the new pane for ~1ms, gets destroyed by the layout engine, and reincarnates back on the default state
- [x] Solution: persist pane state to `sessionStorage` with a device-specific key, recover it in `setConfig()` when the card is recreated

### Implementation
- [x] Added `sessionStorage.setItem('pill_logger_pane_' + device_id, paneId)` in `_handlePaneChange()` after setting `this._activePane = paneId` — saves pane state before `requestUpdate()`
- [x] Added `sessionStorage.getItem('pill_logger_pane_' + device_id)` recovery in `setConfig()` — after setting `this.config`, checks for saved pane state and assigns to `this._activePane` if valid (`'daily' | 'graphs' | 'stats'`)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Card Overlap Fix (Revised) — ll-rebuild Event + CSS Container Integrity + Sections Layout

### Problem Analysis
- [x] Identified Failure 1: `card-resize` event is a hallucination — HA core does not listen for this event
- [x] Identified Failure 2: Removing `overflow: hidden` from `ha-card` caused content to bleed out of normal document flow
- [x] Identified correct event: HA's native `ll-rebuild` event with `{ bubbles: true, composed: true }` pierces Shadow DOM
- [x] Identified correct CSS: `ha-card` must retain `display: flex; flex-direction: column; overflow: hidden` for boundary integrity
- [x] Identified Sections layout requirement: `getGridOptions()` must return `{ rows: 'auto', columns: 12 }` for 2026 standard

### Planning
- [x] Created revised architecture plan in plans/card-overlap-fix-plan.md
- [x] Five changes scoped: restore ha-card flex+overflow, add flex:1 1 auto to .card-content, replace card-resize with ll-rebuild, update getGridOptions, keep dynamic getCardSize

### Implementation
- [x] Restored `ha-card` CSS: `display: flex; flex-direction: column; overflow: hidden` (line 1034)
- [x] Added `flex: 1 1 auto` to `.card-content` CSS (line 1038)
- [x] Replaced `card-resize` with `ll-rebuild` event in `updated()` (line 842): `new CustomEvent('ll-rebuild', { bubbles: true, composed: true })`
- [x] Updated `getGridOptions()` (line 858): `{ rows: 'auto', columns: 12 }` — removes deprecated min_rows/max_rows
- [x] Retained dynamic `getCardSize()` (line 849): graphs→8, stats→7, daily→5

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Dose History API Refactor — Custom REST Endpoint + Local Timezone Fix

### Problem Analysis
- [x] Identified root cause: `dose_history` array stored in `_attr_extra_state_attributes` on `PillConcentrationSensor` causes SQLite bloat and risks 16KB attribute limit
- [x] Identified secondary issue: Core `/api/history/period/` endpoint logs ALL state transitions including Undo actions and reboots, inflating dose counts
- [x] Identified tertiary issue: `.toISOString().split('T')[0]` in `_bucketByDay()` shifts timestamps to UTC, causing late-night doses to appear on wrong day for users ahead of UTC

### Planning
- [x] Created architecture plan in plans/dose-history-api-refactor.md
- [x] Decided on custom REST endpoint (`/api/pill_logger/history/{device_id}`) instead of core History API
- [x] Decided on `storage.Store` for backend persistence instead of entity attributes
- [x] Decided on `_toLocalDateKey()` helper for timezone-safe date bucketing

### Backend Implementation
- [x] Created `store.py` — `PillLoggerStore` class using `storage.Store` for dose history persistence
- [x] Created `views.py` — `PillLoggerHistoryView` REST endpoint at `/api/pill_logger/history/{device_id}`
- [x] Modified `__init__.py` — initialize store singleton, register REST view
- [x] Modified `concentration.py` — removed `dose_history` from `_attr_extra_state_attributes`, added `_save_dose_history()` helper, legacy migration path from attributes to store
- [x] Python syntax check — all 4 files compile cleanly

### Frontend Implementation
- [x] Added `_doseHistory` `@state()` property — `Array<[string, number]>`
- [x] Added `_fetchDoseHistory()` async method — fetches from `/api/pill_logger/history/{device_id}`
- [x] Added `_toLocalDateKey()` helper — constructs `YYYY-MM-DD` using local timezone components
- [x] Refactored `_bucketByDay()` — no longer takes parameter, reads from `this._doseHistory`, uses `_toLocalDateKey()`
- [x] Removed `_getDoseHistory()` method entirely
- [x] Updated `_renderPane2()` — removed `_getDoseHistory()` call, calls `_bucketByDay()` directly
- [x] Updated `updated()` lifecycle — now calls both `_fetchAmountHistory()` and `_fetchDoseHistory()`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors
- [x] Python syntax check — all 4 backend files compile cleanly

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## `updated()` Lifecycle Guard Fix — Prevent Network Spam on Hass State Updates

### Problem Analysis
- [x] Identified root cause: `updated()` guard `this._activePane === 'graphs'` is true on every `hass` state update (multiple times per second), causing `_fetchAmountHistory()` and `_fetchDoseHistory()` to fire in a tight loop
- [x] Identified symptom: Fresh page load succeeds, but navigating away and back causes silent fetch failures (browser throttles saturated connection pool), leaving charts empty with "No dose data yet"
- [x] Identified correct fix: Add `changedProperties.has('_activePane')` as first guard condition so fetches only fire on pane switch

### Implementation
- [x] Changed [`updated()`](src/pill-logger-card.ts:886) guard from `if (this._activePane === 'graphs' && ...)` to `if (changedProperties.has('_activePane') && this._activePane === 'graphs' && ...)`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Take Pill Button Restructure — Move Next Dose Into Button

### Planning
- [x] Analyzed current Pane 1 layout: standalone `.next-dose` div + button with 3 lines
- [x] Analyzed backend As Needed detection: `tracking_type` in config entry data, not exposed as entity attribute
- [x] Created architecture plan in plans/take-pill-button-restructure-plan.md
- [x] Designed vertical space budget: removing `.next-dose` div frees 32px, button shrinks padding/icon to compensate

### Backend Implementation
- [x] Added `tracking_type` to `_attr_extra_state_attributes` in [`next_dose.py`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/next_dose.py:222)
- [x] Python syntax check — compiles cleanly

### Frontend Implementation
- [x] Added [`_isAsNeeded()`](src/pill-logger-card.ts:305) helper reading `tracking_type` attribute from next_dose entity
- [x] Refactored [`_computeNextDose()`](src/pill-logger-card.ts:262) — removed "Wait: " prefix, returns raw time values
- [x] Removed standalone `.next-dose` div from [`_renderPane1()`](src/pill-logger-card.ts:421)
- [x] Restructured Take Pill button: icon → "Take Pill" → "Next dose:/Wait: + time" → "Last dose: + time"
- [x] Added `isAsNeeded` variable in `_renderPane1()` for conditional label
- [x] Renamed button span to `.take-label` class (from positional `span:first-of-type` selector)
- [x] Deleted `.next-dose` and `.next-dose ha-icon` CSS rules
- [x] Reduced `.take-pill-btn` padding from `20px 16px` to `12px 16px`
- [x] Reduced `.take-pill-btn` gap from `4px` to `2px`
- [x] Reduced `.take-pill-btn ha-icon` `--mdc-icon-size` from `36px` to `28px`
- [x] Reduced `.take-sub` font-size from `11px` to `10px`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Warning Dialog Update — Show next_dose Entity in Override Prompt

### Implementation
- [x] Changed [`_handleTakePill()`](src/pill-logger-card.ts:318) confirm message from `'WARNING: 0 pills safe to take. Override?'` to `` `WARNING: limit set does not reset until: ${nextDoseTime}. Override?` ``
- [x] Uses `_computeNextDose(entities)` to resolve the next_dose sensor into human-readable relative time (e.g. "2h 15m", "Available now")

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 15 — Title Countdown Rework

### Planning
- [x] Analyze current `_renderPane1()`, `_getMedName()`, and `_computeNextDose()` logic
- [x] Design new `_computeNextDoseLabel()` helper (display-only, hides "Available now")
- [x] Plan title format: `Pill name - Strength - Wait: 2h 15m` (countdown) vs `Pill name - Strength` (available)
- [x] Plan button simplification: remove Wait/Next dose line from Take Pill button

### Implementation
- [x] Add `_computeNextDoseLabel()` method — returns countdown string only when active, empty string otherwise
- [x] Modify `_renderPane1()` — compute `nextDoseLabel` instead of `nextDose`/`isAsNeeded`
- [x] Modify title in `_renderPane1()` — append conditional `<span class="med-countdown">` with countdown
- [x] Remove Wait/Next dose line from Take Pill button (4 lines → 3 lines)
- [x] Add `.med-countdown` CSS class (font-weight: 400, font-size: 14px, secondary-text-color)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 16 — Temporal String Cleanup & Button Unification

### Planning
- [x] Analyze current temporal string methods and button template
- [x] Design raw duration format (strip "ago", "Wait:", "Available in:")
- [x] Design button sub-text: safe=`Last: 4h 22m`, danger=`Last: 4h 22m • Next: 2h 15m`
- [x] Identify deletable methods: `_computeNextDoseLabel()`, `_isAsNeeded()`

### Implementation
- [x] Modify `_computeTimeSinceLastDose()` — strip " ago" suffix
- [x] Modify `_computeNextDose()` — "Available now" → "now"
- [x] Delete `_computeNextDoseLabel()` method
- [x] Delete `_isAsNeeded()` method
- [x] Modify `_renderPane1()` — title stripped to name+strength only, button sub-text unified with `Last:` / `Next:` prefixes and `•` separator
- [x] Delete `.med-countdown` CSS class

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 17 — Text Size Toggle

### Planning
- [x] Analyzed all font-size declarations across 3 panes + navigation bar (15 CSS rules + 5 SVG attributes)
- [x] Designed `--pill-text-offset` CSS custom property mechanism: `0px` for Big, `-2px` for Small
- [x] Designed base+2px pattern for Graphs/Stats/Nav: `calc(Xpx + 2px + var(--pill-text-offset))` so Big = current+2px, Small = current
- [x] Created architecture plan in plans/text-size-toggle-plan.md

### Implementation
- [x] Added `big_text?: boolean` to `PillLoggerCardConfig` interface
- [x] Added `big_text: true` default in `setConfig()`
- [x] Added `big_text` boolean selector to `getConfigForm()` schema (after `device_id`)
- [x] Added `big_text: 'Big Text'` to `computeLabel`
- [x] Added helper text for `big_text` in `computeHelper`
- [x] Added `--pill-text-offset` CSS custom property to `<ha-card>` inline style in `render()`
- [x] Converted 7 Daily pane font-sizes to `calc(Xpx + var(--pill-text-offset, 0px))`
- [x] Converted 5 Graphs pane font-sizes to `calc(Xpx + 2px + var(--pill-text-offset, 0px))`
- [x] Converted 2 Stats pane font-sizes to `calc(Xpx + 2px + var(--pill-text-offset, 0px))`
- [x] Converted 1 Nav bar font-size to `calc(15px + var(--pill-text-offset, 0px))`
- [x] Converted 5 SVG `font-size` attributes to inline `style` with `calc()`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 18 — OLED Trap Fix (`.take-sub` Accessibility)

### Problem Analysis
- [x] Identified "OLED Trap": `.take-sub` inherits accent color (teal/red) from parent `.take-pill-btn` and applies `opacity: 0.7`, producing poor contrast on dark/OLED themes under screen glare

### Implementation
- [x] Added `color: var(--primary-text-color)` to `.take-sub` CSS rule — decouples from button accent color, uses HA's high-contrast theme variable
- [x] Retained `opacity: 0.7` — keeps sub-text visually subordinate to main button label

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 18.1 — OLED Trap Fix (Revised)

### Problem Analysis
- [x] Iteration 18's `color: var(--primary-text-color)` on `.take-sub` caused chromatic detachment — sub-text no longer matched button accent colors, breaking visual cohesion

### Implementation
- [x] Removed `color: var(--primary-text-color)` from `.take-sub` CSS rule — restores natural accent color inheritance from parent `.take-pill-btn`
- [x] Changed `opacity` from `0.7` to `0.9` — improves contrast under screen glare while keeping sub-text subordinate to main label

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 19 — Timeframe Chips + Array Decimation

### Planning
- [x] Analyzed current `_fetchAmountHistory()` (hardcoded 48h), `_renderLineGraph()` (hardcoded 48h time range/labels), `updated()` lifecycle
- [x] Created architecture plan in plans/timeframe-chips-decimation-plan.md
- [x] Designed decimation formula: `MAX_NODES = 800`, `step = Math.ceil(filteredData.length / MAX_NODES)`, filter by `index % step === 0`
- [x] Designed dynamic time labels: hours for 48H, days with adaptive step for 7D/14D/30D

### Implementation
- [x] Added `@state() private _activeTimeframe: string = '48h'` property
- [x] Added `_getTimeframeHours()` helper — maps timeframe ID to hours (48/168/336/720)
- [x] Added `_handleTimeframeChange()` method — updates `_activeTimeframe`, triggers re-fetch via `updated()`
- [x] Modified `_fetchAmountHistory()` — dynamic `startTime` using `_getTimeframeHours()` instead of hardcoded 48h
- [x] Added decimation logic in `_fetchAmountHistory()` — `MAX_NODES = 800`, step filter after parsing
- [x] Modified `updated()` lifecycle — split guard: pane switch fetches both histories, timeframe change clears `_amountHistory` and re-fetches only amount history
- [x] Added `_renderTimeframeChips()` helper — renders [48H] [7D] [14D] [30D] buttons
- [x] Rewrote `_renderLineGraph()` — wrapped SVG in `.line-graph-wrapper` with `.timeframe-chips` overlay, dynamic time range, dynamic time labels
- [x] Added CSS for `.line-graph-wrapper`, `.timeframe-chips`, `.timeframe-chip` (inactive/active/hover)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Iteration 20 — Stats Pane De-duplication

### Planning
- [x] Identify duplicate metrics between Daily pane (`_renderPane1`) and Stats pane (`_renderPane3`)
- [x] Confirm "Pills left" (Daily line ~471) and "Safe to take" (Daily line ~465) are the duplicated rows

### Implementation
- [x] Removed `Pills Left` row push from `_renderPane3()` (was line 853)
- [x] Removed `Pills Safe to Take` row push from `_renderPane3()` (was line 854)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Iteration 21 — Current-Amount Dashed Line Position Fix

### Planning
- [x] Investigated `_renderLineGraph()` — found the "Current amount" dashed line had `y1`/`y2` hardcoded to `padTop`, so it always rendered at the top of the chart regardless of the actual `amountInBody` value
- [x] Confirmed the label text showed the correct number but the line position was fixed

### Implementation
- [x] Added `currentAmountNum`/`currentY`/`currentLabelY` computation after the polyline points block in `_renderLineGraph()` — uses the same `padTop + chartH * (1 - value / maxAmount)` formula as the history curve
- [x] Clamped `currentY` to `[padTop, padTop + chartH]` so out-of-range values don't escape the chart
- [x] Clamped `currentLabelY` to `Math.max(padTop + 8, currentY - 5)` so the "Current: X mg" label never clips above the chart top
- [x] Replaced hardcoded `padTop` in the dashed `<line>` `y1`/`y2` with `currentY`
- [x] Replaced hardcoded `padTop - 5` in the label `<text>` `y` with `currentLabelY`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## View-Entry State Reset — Distinguish ll-rebuild from Genuine View Entry

### Problem Analysis
- [x] Identified root cause: `sessionStorage` pane persistence (added in Iteration 10.2 to survive `ll-rebuild`) survives the entire browser session, so a fresh element on a new view entry restores the last-used pane instead of resetting
- [x] Identified secondary cause: when HA reattaches (rather than recreates) the element on view change, `setConfig()` is not called again and `@state()` properties persist in memory
- [x] Identified core conflict: both "view entry" and "ll-rebuild" can cause element recreation/reconnection, and the card could not distinguish between them

### Planning
- [x] Created architecture plan in plans/view-entry-reset-plan.md
- [x] Designed short-lived `pill_logger_rebuilding_<device_id>` flag set before `ll-rebuild` dispatch, consumed in `connectedCallback()`

### Implementation
- [x] Added `connectedCallback()` lifecycle hook: checks rebuild flag — present restores saved pane and clears flag; absent resets `_activePane`/`_activeGraph`/`_activeTimeframe` to defaults and clears saved pane
- [x] Removed pane-restore block from `setConfig()` (lines 107-113) — restore/reset now handled by `connectedCallback()`
- [x] Updated `_handlePaneChange()` to set `pill_logger_rebuilding_<device_id>` flag before dispatching `ll-rebuild`, with a 2s self-clearing `setTimeout` safety net for HA versions where `ll-rebuild` does not recreate the element

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Iteration 23 — Dose Strength Unit Selector (Frontend)

### Planning
- [x] Read backend config_flow.py, strength.py, concentration.py to understand unit storage
- [x] Created architecture plan in plans/strength-unit-selector-plan.md
- [x] Designed `_getStrengthUnit()` helper reading `strength_unit` attribute with `mg` fallback

### Implementation
- [x] Added `_getStrengthUnit(entities)` helper after `_getAttr()` — reads `strength_unit` attribute, falls back to `'mg'`
- [x] Replaced hardcoded `mg` in `_getMedName()` title suffix with dynamic unit
- [x] Replaced hardcoded `mg` in `_renderPane3()` Strength and Amount in Body rows with dynamic unit
- [x] Replaced hardcoded `mg` in `_renderLineGraph()` "Current" dashed-line label with dynamic unit

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

## Iteration 24 — Adherence Reset & Tools Panel

### Planning
- [x] Analyzed backend adherence sensor: confirmed `_timestamps` list is independent from concentration `_dose_history`
- [x] Confirmed feasibility: adherence-only signals can modify adherence % without PK impact
- [x] Created architecture plan in plans/adherence-reset-override-plan.md
- [x] Refined plan: dedicated 4th Tools panel (wrench icon, compact), two section headers (Adherence Tools / General Tools), confirmation popups for all 4 buttons

### Backend Implementation
- [x] Added `PillAdherenceResetButton` class in button.py — fires `pill_adherence_reset_{entry_id}`, EntityCategory.CONFIG
- [x] Added `PillAdherenceCoverButton` class in button.py — fires `pill_adherence_override_{entry_id}`, EntityCategory.CONFIG
- [x] Registered both new buttons in `async_setup_entry()`
- [x] Added dispatcher connections for `pill_adherence_reset_` and `pill_adherence_override_` in adherence.py
- [x] Added `adherence_reset()` callback — clears `_timestamps` + resets `history_start_date`
- [x] Added `adherence_override()` callback — finds + covers last missed slot
- [x] Added `_find_last_missed_slot()` dispatcher method
- [x] Added `_find_last_missed_time_of_day()` helper
- [x] Added `_find_last_missed_regular_interval()` helper
- [x] Added `_find_last_missed_cyclic()` helper
- [x] Python syntax check — both files compile cleanly

### Frontend Implementation
- [x] Added `adherenceResetButton?` and `adherenceCoverButton?` to `ResolvedEntities` interface
- [x] Added `_reset_adherence` and `_cover_last_missed` suffix matching in `_resolveEntities()`
- [x] Extended `_activePane` type to `'daily' | 'graphs' | 'stats' | 'tools'` across all references
- [x] Added 4th `{ id: 'tools', label: '', icon: 'mdi:wrench' }` pane entry in `_renderPaneSelector()`
- [x] Conditionally omitted label `<span>` when empty; applied `.tools` class for compact styling
- [x] Added `_toolsDialog` state property
- [x] Added `_openToolsDialog()` / `_closeToolsDialog()` helpers
- [x] Added `_handleAdherenceReset()`, `_handleAdherenceCover()`, `_handleResetHistory()`, `_handleUndoDoseConfirm()` handlers
- [x] Added `_renderPane4()` — Tools panel with two section headers + 2-column grids
- [x] Added `_renderToolsDialog()` — shared confirmation popup with title + descriptor + Cancel/Confirm
- [x] Added `case 'tools': return 6` to `getCardSize()`
- [x] Added `.pane-btn.tools` CSS (compact fixed-width)
- [x] Added `.tools-panel`, `.tools-empty`, `.tools-section-header`, `.tools-grid`, `.tool-btn` (+ `:hover`/`:active`), `.tool-btn.danger`, `.tools-dialog-descriptor` CSS

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md
- [x] Update memory-bank/projectstructure.md

---

## Iteration 24.1 — Tools Panel UI Refinements

### Problem Analysis
- Confirmation popups used separate `.dialog-cancel`/`.dialog-confirm` classes with `!important` overrides — visually inconsistent with the "To Device info" dialog
- 3 of 4 tool buttons were `.danger` with red icons (`var(--error-color)`) that ignored the selected card color scheme
- Section headers had a `border-bottom` underline that looked messy, and no spacing between the Adherence Tools grid and the General Tools header

### Implementation
- [x] Refactor [`_renderToolsDialog()`](src/pill-logger-card.ts:1030) — Cancel/Confirm buttons now use `.dialog-btn` with `mdi:close`/`mdi:check` icons, matching the device info dialog
- [x] Add `.dialog-btn--muted` CSS modifier for Cancel (lighter bg, secondary text); remove `.dialog-cancel`/`.dialog-confirm` rules
- [x] Remove `.tool-btn.danger ha-icon` color override — all tool icons now use `var(--primary-color)` from the card color scheme
- [x] Remove `border-bottom` + `padding-bottom` from `.tools-section-header`
- [x] Add `.tools-section-header--spaced` modifier (`margin-top: 8px`) + apply to General Tools header in [`_renderPane4()`](src/pill-logger-card.ts:965)

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 25 — Graph Options Configurator Section

### Problem Analysis
- The `show_amount_in_body` toggle sat loose at the bottom of the card configurator with no grouping
- Users had no way to hide the Day Avg boxes (7/14/30/Year) or Adherence boxes (7/14/30/365d) shown beneath the bar graph, even when those sensors existed but weren't of interest
- The static `getConfigForm()` schema cannot inspect whether the selected device has adherence sensors, so conditional visibility was not feasible

### Implementation
- [x] Extend [`PillLoggerCardConfig`](src/pill-logger-card.ts:8) interface with `show_day_avg_boxes?: boolean` and `show_adherence_boxes?: boolean`
- [x] Set both new flags to `true` by default in [`setConfig()`](src/pill-logger-card.ts:93) (preserves current behavior)
- [x] Restructure [`getConfigForm()`](src/pill-logger-card.ts:1182) schema — wrap `show_amount_in_body` + the two new toggles in an `expandable` group `graph_options` titled 'Graph' (`flatten: true`)
- [x] Add `computeLabel` entries: `graph_options` → 'Graph', `show_amount_in_body` → 'Amount in Body Graph', `show_day_avg_boxes` → 'Day Avg Boxes', `show_adherence_boxes` → 'Adherence Boxes (If available)'
- [x] Add `computeHelper` entries explaining each toggle (adherence helper notes it only applies when the device has adherence sensors)
- [x] Update [`_renderAveragesGrid()`](src/pill-logger-card.ts:896) — gate Day Avg items behind `this.config?.show_day_avg_boxes !== false` and Adherence items behind `this.config?.show_adherence_boxes !== false`

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Update memory-bank/activeContext.md
- [x] Update memory-bank/progress.md

---

## Iteration 26 — Days Since First Dose + Progressive Avg/Adherence Boxes

### Planning
- [x] Confirmed backend bug: avg/adherence `history_start_date` anchored to setup time, not first dose
- [x] Decided to anchor windows to earliest recorded dose timestamp from PillLoggerStore
- [x] Decided to reuse 365-day sensors as the running-box value source (no new arbitrary-window sensor)
- [x] Created architecture plan in plans/days-since-first-dose-plan.md

### Backend Implementation (coordinated changes in /workspaces/Home-Assistant-Pill-Logger/)
- [x] Created `sensors/days_since_first_dose.py` — `PillDaysSinceFirstDoseSensor`
- [x] Re-anchored `avg_doses.py` and `adherence.py` `history_start_date` to earliest dose
- [x] Registered new sensor in `sensor.py`
- [x] python3 -m py_compile — all backend files clean

### Frontend Implementation
- [x] Added `daysSinceFirstDose?: string` to `ResolvedEntities` interface
- [x] Added `_days_since_first_dose` suffix matching in `_resolveEntities()`
- [x] Reworked `_renderAveragesGrid()` — progressive reveal of 7/14/30 boxes by `daysSince` threshold; Year/365d slot relabeled to running `${daysSince}-Day Avg` / `${daysSince}d Adh` until 365 days, then `Year Avg` / `365d Adh`; graceful fallback when sensor absent
- [x] Added "Days Since First Dose" row to `_renderPane3()` Stats pane

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md
- [x] Updated memory-bank/projectstructure.md

## Adherence Button Rename (2026-06-19)

- [x] Updated `src/pill-logger-card.ts` Tools pane button label and confirmation dialog title from "Mark Last Missed Taken" to "Mark Last Adherence Taken" (matches backend `PillAdherenceCoverButton._attr_name` rename)
- [x] Rebuilt `dist/pill-logger-card.js` via `yarn build` — succeeded
- [x] No frontend gating change needed: the Adherence Tools section already auto-hides when the backend stops exposing the adherence button entities for As Needed devices

## Stats Pane Avg/Adherence Reveal Consistency (2026-06-19)

### Planning
- [x] Inspected Graph panel `_renderAveragesGrid()` progressive-reveal logic (days-since thresholds + running slot relabel)
- [x] Inspected Stats panel `_renderPane3()` avg/adherence rows (previously unconditional)
- [x] Confirmed label wording with user: Stats-style "23-Day Average" / "23-Day Adherence"

### Implementation
- [x] Extracted shared `_daysSinceReveal(entities)` helper returning `{ hasDaysSensor, daysSince }` — DRYs the 3-line block previously inlined in `_renderAveragesGrid()`
- [x] Refactored `_renderAveragesGrid()` to call the helper (no behavior change)
- [x] Updated `_renderPane3()` avg/adherence rows to mirror Graph panel gating:
  - 7/14/30 Day Average rows hide until `daysSince >= 7/14/30`
  - Yearly slot shows as `${daysSince}-Day Average` while `daysSince < 365`, else `Yearly Average`; guarded by `daysSince > 0`
  - 7/14/30-Day Adherence rows hide until thresholds
  - 365 slot shows as `${daysSince}-Day Adherence` while `< 365`, else `365-Day Adherence`
  - Fallback preserved: when `daysSinceFirstDose` sensor absent, all rows show as before

### Verification
- [x] yarn run build — clean compilation, zero warnings, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md

## Over-Time Display on Take-Pill Button

### Planning
- [x] Analyzed current `_renderPane1()` take-sub logic: limit-reached → `Last: … • Next: …`, else → `Last: …`
- [x] Confirmed `PillNextDoseSensor._update_state()` already exposes `tracking_type` as a state attribute on the `next_dose` sensor (no backend change needed)
- [x] Confirmed `_computeNextDose()` returns `'now'` when `next <= now` (overdue condition detectable)
- [x] Designed `_computeOverTime()` helper and sub-label rendering rules
- [x] Wrote plan to `plans/over-time-display-plan.md`
- [x] User decision: limit-reached branch stays `Last: … • Next: …` (over: only when NOT limit-reached)

### Implementation
- [x] Added `_computeOverTime(entities)` helper — returns `Xh XXm` when overdue, `null` for As Needed / unavailable / not-yet-due
- [x] Updated `_renderPane1()` sub-label branch:
  - Limit reached → `Last: … • Next: …` (unchanged)
  - Not limit, overdue → `over: Xh XXm` (NEW)
  - Not limit, not overdue → `Last: Xh XXm` (unchanged)

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 1.2s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md

## Card Best-Practices Audit — shouldUpdate + Entity Cache (#1 + #5)

### Planning
- [x] Audited `src/pill-logger-card.ts` against HA Developers custom-card docs + frontend conventions
- [x] Saved full 20-finding report to `plans/card-best-practices-audit.md`
- [x] Verified backend sensor update cadence (`next_dose`/`last_dose` update only at dose/midnight boundaries, not every minute) — confirmed that gating `shouldUpdate` to entity-state-changes-only would freeze the daily/stats "Xh XXm" countdowns unless a wall-clock tick is added

### Implementation
- [x] #5 Entity cache: split `_resolveEntities()` into cached accessor + `_computeEntities()` worker; cache keyed by `device_id` + `hass.entities` reference; `_invalidateEntityCache()` called from `setConfig` when device changes
- [x] #1 `shouldUpdate(changedProps)`: returns true only for config / internal `@state` changes, the 30s `_tick` (daily & stats panes only), or when a relevant entity's state object reference changed
- [x] Added `_relevantStateChanged(oldHass)` — compares state object references for all resolved medication entities + configured chip entities
- [x] Added 30s `_tick` timer (`_startTickTimer`/`_stopTickTimer`) started in `connectedCallback`, cleared in new `disconnectedCallback` — preserves countdown UX without re-rendering on every system-wide state tick
- [x] Imported `PropertyValues` type from lit

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 1.2s, zero errors
- [x] Confirmed new symbols present in compiled bundle (15 references to shouldUpdate/_relevantStateChanged/_tickTimer/_invalidateEntityCache)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md
- [x] No README change (internal perf refactor, no end-user UX change)

## Card Best-Practices Audit — Batch 2: callApi + fetch race guard + disconnectedCallback (#2 + #4 + #3 + #19)

### Planning
- [x] Confirmed `hass.callApi(method, path, data?)` signature via HA Developers `frontend/data.md` (path relative to `/api/`, handles auth + throws on non-2xx)
- [x] Confirmed history endpoint supports `&minimal_response&significant_changes_only=1` (audit #19 — free payload-size win)
- [x] Noted `custom-card-helpers` not installed → must add `callApi` to the card's custom `PillLoggerHass` interface
- [x] Wrote plan to `plans/callapi-fetch-race-disconnect-plan.md`

### Implementation
- [x] Added `callApi(method, path, data?)` to `PillLoggerHass` interface — removes `(this.hass as any).auth?.data?.access_token` access
- [x] Added `_fetchToken` (race-guard counter) and `_rebuildTimeout` (tracks 2s ll-rebuild safety net) fields
- [x] Rewrote `_fetchAmountHistory()` → `hass.callApi('get', 'history/period/...&minimal_response&significant_changes_only=1')` with token-guard + `console.warn` on error
- [x] Rewrote `_fetchDoseHistory()` → `hass.callApi('get', 'pill_logger/history/' + deviceId)` with token-guard + `console.warn` on error
- [x] Extended `disconnectedCallback()` — bumps `_fetchToken` (discard in-flight results) + clears `_rebuildTimeout` if pending
- [x] `_handlePaneChange()` — 2s safety-net `setTimeout` now tracked in `_rebuildTimeout` for cleanup

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 1.2s, zero errors
- [x] Grep confirmed: `callApi` present (3 refs), `access_token` fully removed (0 refs), `_fetchToken` race guard in (7 refs), `minimal_response` optimization in (2 refs)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md
- [x] No README change (internal correctness/stability refactor, no end-user UX change)

## Batch 3 — ha-dialog migration + confirm() removal (#6 + #7) (2026-06-19)

### Planning
- [x] Researched `ha-dialog` availability for external cards — confirmed globally registered at runtime (same pattern as `ha-card`/`ha-icon`), no import needed
- [x] Wrote plan to `plans/ha-dialog-migration-plan.md` with layman UI explanation + functionality-preservation checklist

### Implementation
- [x] Added `_overrideDialog` state field (`{ windowExpiry; entities } | null`)
- [x] Rewrote `_handleTakePill()` — sets `_overrideDialog` instead of calling native `confirm()`; actual `button.press` moved to dialog Confirm handler
- [x] Added `_renderOverrideDialog()` — `<ha-dialog open .heading @closed>` + `<ha-dialog-footer>` with Cancel/Override
- [x] Migrated `_renderDeviceInfoDialog()` to `<ha-dialog open .heading @closed>`; "To Device info" button in body
- [x] Migrated `_renderRefillDialog()` to `<ha-dialog>`; input in body, Cancel/Refill in `<ha-dialog-footer>`; `@closed` resets `_refillAmount`
- [x] Migrated `_renderToolsDialog()` to `<ha-dialog>`; descriptor in body, Cancel/Confirm in `<ha-dialog-footer>`; `@closed` calls `_closeToolsDialog()`
- [x] Added `_overrideDialog` to `shouldUpdate` key list
- [x] Added `${this._overrideDialog ? this._renderOverrideDialog() : nothing}` to `render()`
- [x] CSS cleanup — removed `.dialog-backdrop`, `.dialog-box`, `.dialog-title`, `.dialog-actions`; added `.dialog-body`; kept `.dialog-btn`, `.dialog-btn--muted`, `.refill-input`, `.tools-dialog-descriptor`

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.3s, zero errors
- [x] Grep confirmed: `ha-dialog` (16 refs), `ha-dialog-footer` (6 refs), `_overrideDialog` (10 refs), `dialog-backdrop` (0 refs — CSS removed), native `confirm()` calls (0 — only comment references remain)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md
- [x] No README change needed — backend README's dialog mentions remain accurate at a high level; frontend repo has no README

## Batch 3 Follow-up — custom-action-bar refactor (2026-06-19)

### Problem Analysis
- [x] HA's native `<ha-dialog-footer>` forces right-aligned `primaryAction`/`secondaryAction` named slots with hard-coded asymmetrical Shadow DOM padding; `justify-content: center` override caused visual misalignment that couldn't be cleanly fixed

### Implementation
- [x] Deleted `ha-dialog-footer { justify-content: center; gap: 8px; }` CSS block
- [x] Added `.custom-action-bar { display: flex; justify-content: center; gap: 12px; margin-top: 20px; width: 100%; }` CSS
- [x] `_renderRefillDialog()` — removed `<ha-dialog-footer>`, wrapped Cancel/Refill buttons in `<div class="custom-action-bar">`, removed `slot` attributes
- [x] `_renderOverrideDialog()` — removed `<ha-dialog-footer>`, wrapped Cancel/Override buttons in `<div class="custom-action-bar">`, removed `slot` attributes
- [x] `_renderToolsDialog()` — removed `<ha-dialog-footer>`, wrapped Cancel/Confirm buttons in `<div class="custom-action-bar">`, removed `slot` attributes
- [x] Device-info dialog left unchanged (no footer — centered button in body)

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.5s, zero errors
- [x] Grep confirmed: `ha-dialog-footer` (0 tag refs — only CSS comment), `slot="primaryAction"`/`slot="secondaryAction"` (0 refs), `custom-action-bar` (3 dialog refs + 1 CSS rule)

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 3 follow-up section + Key Design Decisions #6/#7)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — purely a CSS/DOM layout refactor with no end-user behavior change

## Batch 4 — setConfig throw + numeric getGridOptions (#10 + #11) (2026-06-19)

### Planning
- [x] Researched HA docs via Context7 — confirmed `setConfig` should throw on invalid config (HA renders error card); confirmed `getGridOptions` `rows` should be numeric or omitted (not `'auto'`)
- [x] Identified stub-config nuance: `getStubConfig()` returns `{ device_id: '' }` — must NOT throw on empty string, only null/undefined
- [x] Wrote plan to `plans/setconfig-getgridoptions-plan.md` with functionality-preservation checklist

### Implementation
- [x] `setConfig()` — added `if (config.device_id == null) throw new Error('A device is required for the Pill Logger card.');` after legacy chips migration, before storing config (loose equality catches undefined/null, not empty string)
- [x] `getGridOptions()` — replaced `rows: 'auto'` with `{ columns: 12, min_rows: 4 }` (omit `rows` for documented auto-height; `min_rows: 4` for reasonable minimum)

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.3s, zero errors
- [x] Grep confirmed in dist: throw guard present (`device is required`), `min_rows: 4` present, no `rows: 'auto'` remaining

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 4 section + Files Modified + Remaining Findings 10 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — `setConfig` throw only affects misconfigured YAML (error card is HA-native UX); `getGridOptions` is internal layout metadata

## Batch 5 — aria-labels + localization (#8 + #9) (2026-06-19)

### Planning
- [x] Researched HA docs via Context7 — confirmed `hass.formatEntityState`/`hass.locale` for number/date formatting; confirmed `setConfig` throw pattern; confirmed `getGridOptions` numeric contract
- [x] Surveyed all interactive elements (20 `@click`/`<button>` matches) and all user-facing strings (~90 strings across 4 panes, 4 dialogs, config form)
- [x] Wrote plan to `plans/aria-labels-localize-plan.md` with full string inventory + functionality-preservation checklist

### Implementation — #8 aria-labels
- [x] Added `_onKeyActivate(e, handler)` helper for Enter/Space activation on clickable divs
- [x] Added `aria-label` to carousel prev/next buttons (`"Previous graph"`/`"Next graph"`)
- [x] Added `aria-label="Tools"` to Tools pane tab (was `label: ''`)
- [x] Added dynamic `aria-label` to Take Pill button (`"Take pill"` / `"Limit reached, override available"`)
- [x] Added `aria-label` to timeframe chips (full words: `"48 hours"`/`"7 days"`/`"14 days"`/`"30 days"`)
- [x] Added `aria-label` to all pane selector buttons
- [x] Added `role="button"` + `tabindex="0"` + `aria-label` + `@keydown` to `.med-name` div (`"View device info"`)
- [x] Added `role="button"` + `tabindex="0"` + `aria-label` + `@keydown` to `.stat-pill.clickable` div (`"Refill medication"`)

### Implementation — #9 localization
- [x] Created `src/localize.ts` — `localize(lang, key, params?)` helper + English translation map (~90 strings with `{param}` interpolation)
- [x] Added `language?: string` to `PillLoggerHass` interface
- [x] Added `_lang` getter (`this.hass?.language || 'en'`)
- [x] Added `import { localize } from './localize.js'` (Node16 moduleResolution requires `.js` extension)
- [x] Routed all card-level strings through `localize()` (Loading, placeholder title/subtitle)
- [x] Routed all pane tab labels through `localize()` (Daily, Graphs, Stats, Tools)
- [x] Routed all daily pane strings (Take Pill, LIMIT REACHED, Last, Next, over, Safe to take, Pills left, N/A)
- [x] Routed all graphs pane strings (bar/line titles, empty state, loading history, timeframe chip labels)
- [x] Routed all stats pane strings (14 row labels + dynamic `{days}-Day Average`/`{days}-Day Adherence`)
- [x] Routed all averages grid strings (8 short labels + dynamic `{days}-Day Avg`/`{days}d Adh`)
- [x] Routed all tools pane strings (headers, 4 button labels, empty state)
- [x] Routed all tools dialog descriptors (4 warning texts)
- [x] Routed all dialog strings (Warning, Cancel, Confirm, Refill title/placeholder/confirm, Override body/confirm, device info button)
- [x] Routed `setConfig` error message through `localize('en', ...)`
- [x] Routed all config form labels through `localize()` via `computeLabel` with `hass` 3rd param
- [x] Routed all config form helpers through `localize()` via `computeHelper` with `hass` 3rd param
- [x] Routed color scheme labels through `localize('en', ...)` (static schema, no `hass` at build time)

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 3.2s, zero errors
- [x] Grep confirmed in dist: 53 `localize()` calls + `aria-label` attributes present
- [x] Grep confirmed in src: zero hardcoded English strings in `pill-logger-card.ts` render methods (only in `localize.ts` translation map values — correct)

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 5 section + Files Modified + Key Design Decisions #8-11 + Remaining Findings 8 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — a11y attributes are invisible; localization output is identical (English-only, infrastructure for future translations)

## Audit #12–#20 + Batch 6 — ll-rebuild removal + redundant requestUpdate (#16 + #17) (2026-06-19)

### Problem Analysis — Audit #12–#20
- [x] Read full audit findings #12–#20 from `plans/card-best-practices-audit.md`
- [x] Categorized by stability/performance priority: Tier A (stability: #16, #18, #14, #17), Tier B (perf: #17), Tier C (type safety: #12, #13), Tier D (UX: #15, #20)
- [x] Analyzed HACS acceptance criteria — identified 3 missing repo-metadata files as the only true HACS blockers (README.md, LICENSE, hacs.json)
- [x] Wrote categorized audit to `plans/findings-12-20-audit-plan.md`

### Planning — #16 ll-rebuild removal
- [x] Traced `ll-rebuild` history across 3 iterations: 9.1 (card overlap fix), 10.2 (sessionStorage pane persistence), View-Entry Reset (flag + 2s timeout)
- [x] Identified root cause: `ll-rebuild` is destructive (tears down + recreates element, losing @state), requiring sessionStorage + flag + timeout coordination
- [x] Identified solution: replace with non-destructive `card-resize` event (HA's documented way to trigger height re-measure without element destruction)
- [x] Verified #17 scope: only 2 `requestUpdate()` calls in codebase, both in #16 target methods — fully covered by #16 changes
- [x] Wrote plan to `plans/ll-rebuild-removal-plan.md`

### Implementation — #16 + #17
- [x] `_handlePaneChange()` — replaced `ll-rebuild` dispatch with `card-resize`; removed sessionStorage pane/flag writes, `requestUpdate()`, and 2s setTimeout safety net
- [x] `connectedCallback()` — removed all sessionStorage logic (flag check, pane restore, pane key removal); unconditional reset to defaults; removed `requestUpdate()`
- [x] `disconnectedCallback()` — removed `_rebuildTimeout` cleanup block
- [x] Field declarations — removed `_rebuildTimeout` field + updated comment block
- [x] `setConfig()` — removed stale comment about pane restore in connectedCallback for ll-rebuild

### Verification
- [x] Grep confirmed: zero remaining references to `_rebuildTimeout`, `ll-rebuild` (in code), `pill_logger_pane`, `pill_logger_rebuilding`, `requestUpdate`, `sessionStorage` (only in explanatory comments)
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 3.3s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 6 section + Files Modified + Remaining Findings 6 of 20 + batch-2 notes corrected)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — pane-switching behavior is unchanged from the user's perspective (panes still switch immediately, masonry still resizes); the change is internal architecture

## Batch 6b — config-default mutation + error logging (#18 + #14) (2026-06-19)

### Problem Analysis
- [x] #18: `setConfig()` spread 4 defaults (`show_amount_in_body`, `show_day_avg_boxes`, `show_adherence_boxes`, `big_text`) into `this.config`, baking them into persisted YAML
- [x] Verified all 4 read sites already use `!== false` pattern (treats `undefined` as `true`) — defaults were redundant at runtime
- [x] Verified `color_scheme` read site uses `|| 'default'` — also handles `undefined` natively
- [x] #14: 4 silent `catch {}` blocks in compute helpers (lines 370/400/425/449) — wrap `new Date(state)` parsing, practically never throw, but hide debugging info
- [x] Confirmed both findings are trivial, non-overlapping, zero-risk, same file → solved as one task

### Implementation — #18
- [x] `setConfig()` — replaced `this.config = { show_amount_in_body: true, ...big_text: true, ...config }` with `this.config = config` (raw user config, no defaults baked in)
- [x] Added explanatory comment documenting why defaults are safe to omit (read sites use `!== false`)

### Implementation — #14
- [x] `_computeNextDose` catch (line 370) — `catch {` → `catch (e) { console.warn('[pill-logger-card] _computeNextDose failed:', e); }`
- [x] `_computeOverTime` catch (line 400) — `catch {` → `catch (e) { console.warn('[pill-logger-card] _computeOverTime failed:', e); }`
- [x] `_computeWindowExpiry` catch (line 425) — `catch {` → `catch (e) { console.warn('[pill-logger-card] _computeWindowExpiry failed:', e); }` (preserved "fall through" comment)
- [x] `_computeTimeSinceLastDose` catch (line 449) — `catch {` → `catch (e) { console.warn('[pill-logger-card] _computeTimeSinceLastDose failed:', e); }`

### Verification
- [x] Grep confirmed: zero `catch {` blocks remain in `src/` (all 4 now have `(e)` + `console.warn`)
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.9s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 6b section + Remaining Findings 4 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — config storage and error logging are internal; user-visible behavior unchanged

## Batch 9 — HACS Metadata Files (2026-06-19)

### Planning
- [x] Researched HACS requirements for Dashboard Plugin (Lovelace card) repositories via Context7
- [x] Confirmed 3 mandatory files: `hacs.json`, `README.md`, `LICENSE` in repo root
- [x] Confirmed `dist/pill-logger-card.js` already satisfies HACS JS file-location requirement (dist/ directory, name matches repo with lovelace- prefix stripped)
- [x] Wrote plan: `plans/batch9-hacs-metadata-plan.md`
- [x] User confirmed copyright holder: `adix992` (GitHub username), year: `2026`

### Implementation
- [x] Created `hacs.json` — `name: "Pill Logger Card"`, `filename: "pill-logger-card.js"`, `homeassistant: "2026.3.2"`, `hacs: "2.0.5"` (content_in_root omitted = false default, JS in dist/)
- [x] Created `LICENSE` — MIT, copyright 2026 adix992
- [x] Created `README.md` — card-specific (prerequisites, HACS + manual installation, visual editor + YAML configuration, full options table, 4-pane features, link to integration repo)

### Verification
- [x] `ls -la` confirmed all 3 files exist in frontend repo root (hacs.json 119B, LICENSE 1063B, README.md 3754B)
- [x] `python3 -c "json.load(open('hacs.json'))"` — valid JSON
- [x] No build step needed (static metadata files, no source code changes)

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 9 section + Files Modified + Remaining Findings 2 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] Updated memory-bank/projectstructure.md (added hacs.json, LICENSE, README.md to tree)
- [x] README.md created as part of this batch (the HACS-required README itself)

## Batch 7 — HomeAssistant type + implements LovelaceCard (#12 + #13) (2026-06-19)

### Planning
- [x] Analyzed `custom-card-helpers@2.0.0` type definitions (npm pack + inspect types.d.ts)
- [x] Identified 3 compatibility issues: missing `entities`/`devices`, `callApi` signature mismatch (lowercase vs uppercase), bundle bloat risk (4 runtime deps)
- [x] Solution: `import type` (erased at compile time) + devDependency + extend `HomeAssistant` with thin interface for 2 frontend-specific fields
- [x] Wrote plan: `plans/homeassistant-type-lovelacecard-plan.md`
- [x] User reviewed pros/cons in context of HACS listing; approved proceeding after Batch 9

### Implementation
- [x] `yarn add -D custom-card-helpers` — installed `custom-card-helpers@2.0.0` as devDependency (9 packages, +1.53 MiB in node_modules — not in production bundle)
- [x] Added `import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';` (type-only, erased by Rollup)
- [x] Rewrote `PillLoggerHass` as `interface PillLoggerHass extends HomeAssistant` — inherits all standard HA fields; only `entities` + `devices` declared (HA frontend extensions not in websocket protocol)
- [x] Changed `PillLoggerCardConfig` to `extends LovelaceCardConfig` — inherits `type: string` + `[key: string]: any` index signature for structural compatibility with `LovelaceCard.setConfig`
- [x] Changed `device_id` from required to optional in `PillLoggerCardConfig` (runtime already handles missing/empty via throw guard + placeholder)
- [x] Added `implements LovelaceCard` to class declaration
- [x] Fixed 2 `callApi` call sites: `'get'` → `'GET'` in `_fetchAmountHistory` and `_fetchDoseHistory`

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.2s, zero errors
- [x] Bundle size verified identical: 116,856 bytes before and after (type-only import adds zero runtime code — `import type` correctly erased by Rollup)

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + Batch 7 section + Files Modified + Remaining Findings 1 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — type imports and interface implementation are internal; user-visible behavior unchanged

## Batch 8 — CSS fallback consistency + card-picker preview (#15 + #20) (2026-06-19)

### Problem Analysis
- [x] #15: `--rgb-error-color` fallback mismatch — `.take-pill-btn.danger` (lines 1843/1844/1848) used `244, 67, 54` / `#f44336` (Material Design 2 red), while `.tool-btn.danger:hover` (line 2311/2312) used `219, 68, 55` / `#db4437` (HA default theme red). At runtime HA sets the variable so both get the same red; inconsistency only affects non-HA fallback environments.
- [x] #20: `preview: false` in customCards registration (line 2347) disabled the card preview in HA's "Add Card" gallery. Card already has `getStubConfig()` returning `{ device_id: '', show_amount_in_body: true }` and `render()` handles empty `device_id` with a friendly placeholder.

### Implementation
- [x] #15: Standardized `.take-pill-btn.danger` fallback values to `219, 68, 55` / `#db4437` (HA default theme red) — 3 values changed across lines 1843/1844/1848. `.tool-btn.danger:hover` (line 2311/2312) already had correct values — no change needed.
- [x] #20: Changed `preview: false` to `preview: true` in customCards registration (line 2347). Card picker now shows a live preview using `getStubConfig()` → friendly "Please select a device" placeholder.

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 1.3s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status → all 20 findings resolved; Batch 8 section; Remaining Findings 0 of 20)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — CSS fallback values and preview flag are internal; the card-picker preview is a HA UI feature not documented in the README

## Audit Complete — All 20 Findings Resolved ✅
Batches 1–9 complete. The Pill Logger Card has been audited against HA best practices and all 20 findings resolved. The frontend repository is structurally ready for HACS submission (hacs.json, LICENSE, README.md present).

## Sticky "To Device" Dialog Fix (2026-06-20)

### Problem Analysis
- [x] User reports: clicking the medication name → device-info dialog opens → clicking "To Device info" → navigating to the HA device page → pressing the browser back button leaves the device-info dialog still visible on the dashboard.
- [x] Root cause: The "To Device info" button handler (`src/pill-logger-card.ts:614`) sets `_showDeviceInfo = false` then immediately calls `_navigateToDevice()` which dispatches `location-changed`. HA's router disconnects the card mid-Lit-update-flush, leaving `ha-dialog`'s MDC overlay in an "open" state. On back-navigation `connectedCallback` fired but only reset pane/graph/timeframe — not the dialog flags — so the stale overlay re-appeared.

### Implementation
- [x] Added 5 dialog-flag resets to `connectedCallback()` (after the `_activeTimeframe` reset, before the tick-timer start): `_showDeviceInfo = false`, `_showRefillDialog = false`, `_refillAmount = ''`, `_toolsDialog = null`, `_overrideDialog = null`. This guarantees a clean slate on every view entry (initial load or back-navigation) and future-proofs the same sticky-dialog bug for the refill, tools, and override dialogs.
- [x] Added explanatory comment documenting the Lit update-flush race and why the reset is needed.

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.4s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + What Was Changed + Files Modified + Key Design Decisions)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — internal dialog lifecycle fix, no user-facing config/UX documentation impact
- [x] Plan written: plans/sticky-device-dialog-fix-plan.md

## Shared Fetch-Token Race Fix — Amount-in-Body "Loading" on First Pane Switch

### Problem Analysis
- [x] User reports: switching to the Amount in Body graph slide shows "Loading history…" indefinitely until the timeframe is manually changed.
- [x] Root cause: `_fetchAmountHistory` and `_fetchDoseHistory` share a single `_fetchToken` counter. On pane entry, `updated()` fires both back-to-back; each does `++this._fetchToken`, so the second call bumps the counter and causes the first call's result to be discarded by its `if (token !== this._fetchToken) return;` guard. `_amountHistory` stays `[]` → line graph shows loading placeholder forever. Timeframe change only calls `_fetchAmountHistory` (no dose fetch to bump the token), so its result is kept — which is why the workaround works.

### Implementation
- [x] Replaced single `_fetchToken` with two independent counters: `_amountFetchToken` and `_doseFetchToken`.
- [x] Updated `_fetchAmountHistory` to use `++this._amountFetchToken` / `this._amountFetchToken` guard.
- [x] Updated `_fetchDoseHistory` to use `++this._doseFetchToken` / `this._doseFetchToken` guard.
- [x] Updated `disconnectedCallback` to bump both tokens (`this._amountFetchToken++; this._doseFetchToken++;`).
- [x] Removed dead `_historyLoading` state field (declared but never written) and its `shouldUpdate` key-list entry.
- [x] Updated comment block above the token fields to explain the per-fetch-type design.

### Verification
- [x] `yarn build` — clean compilation, `dist/pill-logger-card.js` created in 2.7s, zero errors

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + What Was Changed + Files Modified)
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — internal bug fix, no user-facing config/UX documentation impact
- [x] Plan written: plans/shared-fetch-token-race-plan.md

## Graph Timescale Options — 2026-06-20

### Bar Graph (Taken Tracker): 14D / 30D / 60D
- [x] Add `@state _activeBarTimeframe = '14d'` field and add to `shouldUpdate` key list
- [x] Add `_getBarTimeframeDays()` helper (14/30/60 mapping)
- [x] Generalize `_bucketByDay(dayCount)` to accept day-count param (default 14)
- [x] Add `_renderBarTimeframeChips()` (14D/30D/60D with active state + aria labels)
- [x] Add `_handleBarTimeframeChange()` handler
- [x] Render bar timeframe chips above bar graph (data + empty states)
- [x] Dynamic bar title: `localize('graphs.bar_title', { days })` → "14-day taken tracker" / "30-day" / "60-day"
- [x] Label decimation: 14D→every label, 30D→every 2nd, 60D→every 5th
- [x] Reset `_activeBarTimeframe = '14d'` in `connectedCallback`

### Line Graph (Amount in Body): 12H timescale
- [x] Add `'12h'` to `_renderTimeframeChips()` array (first position)
- [x] Add `'12h' → 12` to `_getTimeframeHours()`
- [x] Refine time-label step: `totalHours <= 12` → every 3h (separate from `<= 48` which uses 6h)
- [x] Default remains `'48h'` — no change to `_activeTimeframe` initial value

### Localization
- [x] `graphs.bar_title` parameterized: `'{days}-day taken tracker'`
- [x] New keys: `graphs.timeframe_12h`, `graphs.timeframe_60d`, `aria.timeframe_12h`, `aria.timeframe_60d`

### Build & Docs
- [x] `yarn build` — clean compilation
- [x] Updated `README.md` — Graphs section reflects new timescales
- [x] Updated `memory-bank/activeContext.md`
- [x] Updated `memory-bank/progress.md` (this section)

## Hide Navigation Bar Toggle

### Planning
- [x] Read activeContext, projectstructure, and relevant source sections
- [x] Write plan file to `plans/hide-nav-bar-plan.md`

### Implementation
- [x] Add `hide_nav_bar?: boolean` to `PillLoggerCardConfig` interface
- [x] Add `hide_nav_bar` boolean toggle to `getConfigForm()` schema (after `stats_3_columns`)
- [x] Gate `_renderPaneSelector()` in `render()` behind `this.config?.hide_nav_bar !== true`
- [x] Add localize keys: `config.hide_nav_bar` + `config.helper.hide_nav_bar`

### Build & Docs
- [x] `yarn run build` — clean compilation
- [x] Updated `README.md` — Configuration Options table with `hide_nav_bar` row
- [x] Updated `memory-bank/activeContext.md`
- [x] Updated `memory-bank/progress.md` (this section)

## Rebrand to AX Dose Logger Card

### Planning
- [x] Read backend rebrand follow-up plan (plans/frontend-card-rebrand-followup.md)
- [x] Verify current state of frontend repo (package.json, hacs.json, rollup.config.js, src/)
- [x] Confirm naming convention: spaces for user-facing labels, hyphens for GitHub/folder syntax

### Implementation
- [x] `git mv src/pill-logger-card.ts src/ax-dose-logger-card.ts`
- [x] Update `rollup.config.js` — input/output paths
- [x] Update `package.json` — name, description, main
- [x] Update `src/ax-dose-logger-card.ts`:
  - [x] HTTP endpoint: `pill_logger/history/` → `ax_dose_logger/history/`
  - [x] Device picker filter: `integration: 'pill_logger'` → `integration: 'ax_dose_logger'`
  - [x] customElements.define: `'pill-logger-card'` → `'ax-dose-logger-card'`
  - [x] customCards registration: type, name ("AX Dose Logger Card"), description, documentationURL (→ card repo)
  - [x] Console prefixes: `[pill-logger-card]` → `[ax-dose-logger-card]`
  - [x] Class rename: `PillLoggerCard` → `AxDoseLoggerCard`
  - [x] Interface rename: `PillLoggerCardConfig` → `AxDoseLoggerCardConfig`, `PillLoggerHass` → `AxDoseLoggerHass`
- [x] Update `src/localize.ts` — "Pill Logger" strings → "AX Dose Logger"
- [x] Update `hacs.json` — name: "AX Dose Logger Card", filename: "ax-dose-logger-card.js"
- [x] Rewrite `README.md` — branding, GitHub URLs, YAML examples
- [x] Update `LICENSE` — copyright holder adix992 → Axildor

### Verification
- [x] `yarn install` — clean install after package name change (cleared .yarn/install-state.gz)
- [x] `yarn run build` — clean compilation, zero errors
- [x] Verify `dist/ax-dose-logger-card.js` exists
- [x] Delete old `dist/pill-logger-card.js`
- [x] Grep for remnants — no unintended references remain

### Documentation
- [x] Updated `memory-bank/activeContext.md`
- [x] Updated `memory-bank/progress.md` (this section)
- [x] Updated `memory-bank/projectstructure.md`

## Take-Pill Button UX Fix — Negative Time & Line Wrapping

### Planning
- [x] Identified `_computeTimeSinceLastDose()` producing `-1m` when `diffMs` is slightly negative (clock skew or just-taken dose)
- [x] Identified `_renderPane1()` limit-reached branch rendering `Last: X • Next: Y` as flat inline text, allowing browser to split "Next:" from its value

### Implementation
- [x] `_computeNextDose()`: clamped `diffMs` with `Math.max(0, next.getTime() - now.getTime())`
- [x] `_computeOverTime()`: clamped `diffMs` with `Math.max(0, now.getTime() - next.getTime())`
- [x] `_computeTimeSinceLastDose()`: clamped `diffMs` with `Math.max(0, now.getTime() - last.getTime())`
- [x] `_renderPane1()`: wrapped each `Label: value` segment in `<span class="take-sub-segment">` for nowrap behavior
- [x] CSS: added `.take-sub-segment { white-space: nowrap; }` rule after `.take-sub`

### Verification
- [x] `yarn run build` — clean compilation, zero errors

### Documentation
- [x] Updated `memory-bank/activeContext.md`
- [x] Updated `memory-bank/progress.md` (this section)

## Line Graph Gap-Bridging Fix — Slope from Past Zero

### Diagnosis
- [x] Read backend concentration sensor + coordinator source
- [x] Inspected HA Core `async_set_internal` — confirmed state dedup: same state + attributes → `EVENT_STATE_REPORTED` only, no `last_changed` advance
- [x] Inspected HA Core recorder `significant_changes_only` filter — confirmed `sensor` domain NOT in `SIGNIFICANT_DOMAINS`, so same-value state reports are discarded
- [x] Inspected frontend `_fetchAmountHistory()` — confirmed `significant_changes_only=1` query parameter
- [x] Inspected frontend `_renderLineGraph()` — confirmed SVG polyline linearly interpolates between sparse points
- [x] Root cause confirmed: three mechanisms combine — (1) rounding suppresses state changes during decay, (2) recorder discards same-value reports, (3) polyline linearly interpolates across gaps → diagonal slope artifact
- [x] Confirmed this is NOT a reset-button edge case — occurs any time the rounded value plateaus for >3 min then changes

### Implementation
- [x] Added `_bridgeGaps()` private method — detects gaps > 3 min between consecutive history points, inserts hold points (prev value at nextTimestamp − 1s)
- [x] Updated `_renderLineGraph()` — renamed `history` → `rawHistory`, added `bridgedHistory = this._bridgeGaps(rawHistory)`, updated polyline point building to use pre-computed ms timestamps

### Verification
- [x] `yarn run build` — clean compilation, zero errors

### Documentation
- [x] Updated `memory-bank/activeContext.md`
- [x] Updated `memory-bank/progress.md` (this section)

## Overdue Display Fix (Backend + Frontend)
- [x] Step 1: Context grounding (read next_dose.py, frontend card _computeOverTime/_computeNextDose/_renderPane1, schedule.py)
- [x] Step 2: Trace scenario — confirmed next_dose always future-pointing after schedule-anchor fix, so _computeOverTime always returns null for missed slots
- [x] Step 3: Create architecture plan (plans/overdue-display-fix.md) — dedicated PillOverdueSensor + frontend rewrite
- [x] Step 4: Backend — create sensors/overdue.py (PillOverdueSensor, DURATION seconds, 0 when not overdue, overdue_since attribute, per tracking type logic)
- [x] Step 5: Backend — register PillOverdueSensor in sensor.py (gated for scheduled medications, not As Needed)
- [x] Step 6: Backend — add entity cleanup in __init__.py (overdue removal alongside steady_state when tracking_type → As Needed)
- [x] Step 7: Backend — add translation keys in strings.json + translations/en.json (entity.sensor.overdue)
- [x] Step 8: Frontend — add `overdue` to ResolvedEntities, `_overdue` suffix resolution in _computeEntities, rewrite _computeOverTime to read overdue sensor state (seconds), update _renderPane1 to show "Last: X • Overdue: Y" when limit reached AND overdue
- [x] Step 9: Frontend — rename localize key `daily.over` → `daily.overdue` with label "Overdue"
- [x] Step 10: Verify backend (py_compile OK, hass check_config exit 0, JSON validation OK)
- [x] Step 11: Verify frontend (yarn run build OK)
- [x] Step 12: Update memory-bank files (activeContext, progress)

## Daily-Locked Metrics Pane
- [x] Step 1: Context grounding (read ax-dose-logger-card.ts interfaces, _computeEntities, _renderPaneSelector, render, localize.ts, CSS section)
- [x] Step 2: Add MetricEntity interface, metrics to ResolvedEntities, config_entry_id to AxDoseLoggerHass, _metricOverrideDialog state variable
- [x] Step 3: Add _eff_ entity collection in _computeEntities (suffix → label conversion, push to metrics array)
- [x] Step 4: Add _renderPane5() — ha-slider per metric, badge (Set for today / Not set), value display (— for unknown)
- [x] Step 5: Add _handleMetricChange() — check logged_today attribute, direct set_value if not logged, open override dialog if logged
- [x] Step 6: Add _renderMetricOverrideDialog() — show old/new values, Cancel + Override buttons, Override calls ax_dose_logger.set_metric with override:true
- [x] Step 7: Add _getEntryId() helper — resolve config_entry_id from hass.entities
- [x] Step 8: Update _handlePaneChange type to include 'metrics'
- [x] Step 9: Update _renderPaneSelector — add 5th Metrics tab (mdi:chart-sankey icon)
- [x] Step 10: Update render() — add metrics pane rendering + metric override dialog
- [x] Step 11: Update getCardSize() — add metrics case (6)
- [x] Step 12: Add CSS — metrics-panel, metric-row, metric-header, metric-label, metric-badge (--set/--unset), metric-slider-row, metric-value
- [x] Step 13: Add localize strings — pane.metrics, metrics.not_set, metrics.set_today, metrics.already_set_title/body, metrics.override/cancel
- [x] Step 14: Fix TypeScript warning — add metrics: [] to fallback return in _resolveEntities
- [x] Step 15: Verify — yarn run build (exit 0, no errors or warnings)
- [x] Step 16: Update memory-bank files (activeContext, progress)
- Key decisions: (1) 5th pane "Metrics" between Stats and Tools; (2) Daily-lock enforcement via logged_today attribute check; (3) Override dialog calls ax_dose_logger.set_metric service with override:true; (4) Entry ID resolved from entity registry config_entry_id; (5) Badge shows Set/Not set status; (6) Unknown state displayed as — (em dash) with slider at position 0.

## Metrics → Tracking Rename
- [x] Step 1: Frontend localize.ts — rename pane.metrics→pane.tracking (value "Tracking"), metrics.*→tracking.*, add tracking.today_label = "Today's {metric}"
- [x] Step 2: Frontend ax-dose-logger-card.ts — rename pane ID 'metrics'→'tracking' in all type unions (_activePane, _handlePaneChange, _renderPaneSelector, render, getCardSize)
- [x] Step 3: Frontend ax-dose-logger-card.ts — rename _metricOverrideDialog→_trackingOverrideDialog, _handleMetricChange→_handleTrackingChange, _renderMetricOverrideDialog→_renderTrackingOverrideDialog
- [x] Step 4: Frontend ax-dose-logger-card.ts — use localize('tracking.today_label', { metric }) for "Today's Pain" label format
- [x] Step 5: Frontend ax-dose-logger-card.ts — rename CSS classes metrics-panel→tracking-panel, metric-row→tracking-row, metric-badge→tracking-badge, etc.
- [x] Step 6: Frontend ax-dose-logger-card.ts — update all localize() calls from metrics.*→tracking.*
- [x] Step 7: Frontend verification — yarn run build (exit 0, no errors or warnings)
- [x] Step 8: Update memory-bank files (activeContext, progress)
- Key decisions: (1) "Tracking" is medically more appropriate than "Metrics" — standard clinical terminology; (2) "Today's {metric}" label format eliminates pill-name repetitiveness; (3) Internal MetricEntity interface and metrics field in ResolvedEntities kept unchanged (internal TypeScript types); (4) All CSS classes renamed for consistency.

## Tracking Pane Fixes
- [x] Step 1: Backend number.py — expose metric_label in extra_state_attributes (clean name without device prefix)
- [x] Step 2: Frontend — read metric_label from attributes instead of stripping friendly_name
- [x] Step 3: Frontend — add _pendingTracking Set to fix override dialog race condition (no extra clicks)
- [x] Step 4: Frontend — use "Today's {metric}" label in override dialog body
- [x] Step 5: Frontend — add 0-10 tick marks below slider for number visibility (no confirm button)
- [x] Step 6: Frontend — add CSS for tracking-scale / tracking-scale-tick
- [x] Step 7: Frontend — cleanup _pendingTracking in updated() lifecycle
- [x] Step 8: Verification — yarn run build (exit 0), hass check_config (exit 0)
- [x] Step 9: Update memory-bank files (activeContext, progress)
- Key decisions: (1) metric_label exposed by backend to avoid friendly_name device-prefix contamination; (2) _pendingTracking Set prevents race condition without extra clicks — tracks entity IDs locally, cleaned up in updated() once HA confirms logged_today=true; (3) Tick marks (0-10 NRS scale) below slider — clinically standard, no confirm button needed (one click per item); (4) Override dialog uses "Today's {metric}" format for consistency with pane labels.

## Tracking Dialog & Scale Fixes
- [x] Step 1: Add `_trackingOverrideDialog` to `shouldUpdate` key list (ROOT CAUSE of dialog buttons not working — shouldUpdate blocked re-render when state changed)
- [x] Step 2: Restructure tick marks — wrap slider + scale in `.tracking-slider-wrapper` so scale aligns with slider track only (not the value span)
- [x] Step 3: Update CSS — `.tracking-slider-wrapper` flex column, `.tracking-scale` padding 0 12px to match ha-slider internal padding
- [x] Step 4: Verification — yarn run build (exit 0)
- Key decisions: (1) shouldUpdate was missing `_trackingOverrideDialog` — this is why the dialog appeared rarely (only on coincidental hass changes) and buttons didn't work (setting state to null didn't trigger re-render); (2) Scale wrapped inside slider-wrapper to align with slider track, not the full row including value span.

## Tracking Scale Alignment & Override Value Fix
- [x] Step 1: Fix scale alignment — changed `.tracking-scale` from symmetric `padding: 0 12px` to asymmetric `padding-left: 6px; padding-right: 2px` with `box-sizing: border-box`; removed `min-width: 14px` from `.tracking-scale-tick` so ticks size to content width for precise center alignment with slider thumb positions
- [x] Step 2: Fix override not changing value — added `configEntryId?: string` to `ResolvedEntities` interface; populated in `_computeEntities()` by capturing `config_entry_id` from first entity on device (all entities on a device share one config entry)
- [x] Step 3: Override button handler now reads `entities.configEntryId` via `_resolveEntities()` instead of calling `_getEntryId()`; added `console.warn` diagnostic if configEntryId is undefined
- [x] Step 4: Removed dead `_getEntryId()` method
- [x] Step 5: Verification — yarn run build (exit 0)
- Key decisions: (1) Scale offset root cause — `justify-content: space-between` with `padding: 0 12px` and `min-width: 14px` placed "0" center at 19px (12px padding + 7px half-width), but slider thumb at 0 sits at ~10px; asymmetric padding (6px left, 2px right) with content-width ticks aligns tick centers with thumb centers. (2) Override root cause — `_getEntryId()` returned `undefined` because `config_entry_id` wasn't reliably available via per-entity lookup, causing `if (entryId)` guard to silently skip the service call; capturing `configEntryId` in `ResolvedEntities` during `_computeEntities()` is the HA best-practice pattern (synchronous, no WS calls, all entities on a device share one config entry).

## Tracking Override — Entity-Based Service Fix (v2)
- [x] Step 1: Backend `services.py` — changed `set_metric` schema from `entry_id` + `metric_key` to `entity_id`; added `_get_coordinator_for_entity()` helper that resolves entity_id → entity registry → config_entry_id → coordinator, and reads metric_key from state attributes; added `ATTR_ENTITY_ID`, `er` import, `HomeAssistantError` import
- [x] Step 2: Backend `services.yaml` — replaced `entry_id` (config_entry selector) + `metric_key` (text selector) with `entity_id` (entity selector: number domain + ax_dose_logger integration)
- [x] Step 3: Backend `strings.json` + `translations/en.json` — replaced `entry_id` ("Medication") + `metric_key` ("Metric Key") field labels with `entity_id` ("Tracking Entity")
- [x] Step 4: Frontend `ax-dose-logger-card.ts` — override handler now calls `set_metric` with `entity_id` + `value` + `override: true` (no entry_id/metric_key); removed `configEntryId` from `ResolvedEntities` and `_computeEntities()`; removed dead `_getEntryId()` method
- [x] Step 5: Verification — yarn run build (exit 0), python3 -m py_compile (OK), hass check_config (exit 0)
- Key decision: The first attempt (configEntryId in ResolvedEntities) failed because `hass.entities[entityId].config_entry_id` is not reliably available in a Lovelace card context. The correct fix is to change the `set_metric` service to accept `entity_id` directly — the frontend already knows the entity_id (it's the slider's entity). The backend resolves entity_id → coordinator + metric_key via the entity registry and state attributes. This is the same pattern used by `number.set_value` and `button.press` — entity-targeted services that don't require the caller to resolve config entries.

## Stats Pane Clickable More-Info
- [x] Step 1: Investigate `_renderPane3()` — confirmed each row maps 1:1 to an entity on the `entities` object (totalDoses, daysSinceFirstDose, lastDose, strength, amountInBody, steadyState, avg7/14/30/Yearly, adherence7/14/30/365)
- [x] Step 2: Confirm HA more-info event pattern — `custom-card-helpers` exports `fireEvent`; `handleAction` fires `hass-more-info` with `{ entityId }` (line 1117); `fireEvent` defaults to `{ bubbles: true, composed: true }`
- [x] Step 3: Write architecture plan — `plans/stats-more-info-plan.md`
- [x] Step 4: Get user approval on plan
- [x] Step 5: Implement — `import { fireEvent } from 'custom-card-helpers'`; extend row type with `entityId?`; thread entity_id into every `rows.push()`; add `_openMoreInfo()` + `_onStatCellKeydown()` helpers; add `@click`/`@keydown`/`role`/`tabindex` to `.stat-cell`; add `.clickable` + `:hover` + `:focus-visible` CSS
- [x] Step 6: Verification — yarn run build (exit 0)
- Key decisions: (1) Used canonical `fireEvent` from custom-card-helpers rather than a hand-rolled CustomEvent — same `hass-more-info` event every stock Lovelace card uses. (2) Entity_id threaded into rows as a one-field-per-row change since each `rows.push()` already had the entity reference in scope. (3) Accessibility parity with existing `.stat-pill.clickable` (role="button") plus `tabindex="0"`, `@keydown` for Enter/Space, and `:focus-visible` outline.

## Override Popup Wording Rework
- [x] Step 1: Audit current override dialog wording (`dialog.override.body` = "Pill limit does not reset until: {expiry}. Override?") and confirm Reset History scope (user clarified: reset untouched, only override popup in scope)
- [x] Step 2: Confirm backend `tracking_type` values (snake_case: `as_needed` per `const.py:18`) and that `custom-card-helpers` re-exports `formatTime`/`formatDateTime` from `src/datetime/`
- [x] Step 3: Clarify with user — scheduled meds show `next_dose` sensor time; As Needed shows `window_expires_at` attribute time; "Override" button label stays (intentional repetition); "rolling window" wording replaced with "next safe dose"
- [x] Step 4: Write architecture plan — `plans/override-popup-wording-plan.md`
- [x] Step 5: Get user approval on plan
- [x] Step 6: Implement `src/localize.ts` — replaced `dialog.override.body` with `dialog.override.body_scheduled` ("Your next scheduled dose is not until {time}. Take a dose now anyway?") + `dialog.override.body_as_needed` ("Your next safe dose is not until {time}. Take a dose now anyway?")
- [x] Step 7: Implement `src/ax-dose-logger-card.ts` — added `formatTime, formatDateTime` import; extended `_overrideDialog` state to `{ timeLabel, bodyKey, entities }`; added `_formatOverrideTime()` helper (same-day → formatTime, cross-day → formatDateTime, fallback → toLocaleTimeString); rewrote `_handleTakePill` override trigger to normalize `tracking_type` (snake_case + title-case), branch time source + body key by tracking type with fallback to `_computeWindowExpiry()`; updated `_renderOverrideDialog` body to use `dlg.bodyKey` + `{ time: dlg.timeLabel }`
- [x] Step 8: Verification — yarn run build (exit 0; pre-existing `@formatjs/intl-utils` "this rewritten to undefined" warnings are transitive-dependency noise, unrelated)
- Key decisions: (1) Branch by tracking type — scheduled meds have a designated dose time (`next_dose` sensor); As Needed has no schedule so the only relevant time is the rolling safety window reset (`window_expires_at`). (2) Absolute clock time over relative duration — locale-aware `formatTime`/`formatDateTime` produces "2:30 PM" / "Tomorrow, 8:00 AM" instead of "3h 45m". (3) Defensive `tracking_type` normalization (lowercase, accept both `as_needed` and `as needed`) because the pre-existing `_computeOverTime()` checked title-case `As Needed` while the backend stores snake_case. (4) "Override" button label retained per user — repetition conveys weight. (5) Fallback to `_computeWindowExpiry()` relative duration when absolute-time source is missing/invalid — never shows "Invalid Date". (6) Reset History untouched per user clarification.

## Take-Pill Button Icon + Big Text Toggle Fix
- [x] Step 1: Audit current take-pill button render (`mdi:alert` for limit-reached, `mdi:pill` for safe) and `big_text` default logic (`big_text !== false ? '0px' : '-2px'` at line 1720)
- [x] Step 2: Confirm with user — flip `big_text` default to small (OFF); reword toggle label/helper to explain ON = bigger; add configurable take-pill icon (limit-reached stays `mdi:alert`)
- [x] Step 3: Write architecture plan — `plans/take-pill-icon-and-text-toggle-plan.md`
- [x] Step 4: Get user approval on plan
- [x] Step 5: Implement `src/ax-dose-logger-card.ts` — added `take_pill_icon?: string` to config interface; added `{ name: 'take_pill_icon', selector: { icon: {} } }` to `getConfigForm()` schema after `big_text`; changed take-pill `<ha-icon>` to `isLimitReached ? 'mdi:alert' : (this.config?.take_pill_icon || 'mdi:pill')`; fixed `--pill-text-offset` default from `big_text !== false` to `big_text === true`
- [x] Step 6: Implement `src/localize.ts` — reworded `config.big_text` "Big Text" → "Large Text"; rewrote `config.helper.big_text` to "When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view."; added `config.take_pill_icon` + `config.helper.take_pill_icon`
- [x] Step 7: Update `README.md` Configuration Options table — `big_text` default `true` → `false` with reworded description; added `take_pill_icon` row
- [x] Step 8: Verification — yarn run build (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)
- Key decisions: (1) LIMIT REACHED icon locked to `mdi:alert` — safety affordance, not user-overridable. (2) HA native `icon` selector renders the standard icon picker (search + preview), no custom UI. (3) `big_text === true` over `!== false` — fixes the fresh-card default-state mismatch where `undefined` was treated as big. (4) Label "Big Text" → "Large Text" + helper reword makes directionality explicit (ON = bigger).

## README YAML Card Configuration Explainer Removal
- [x] Step 1: Context grounding — read frontend [`README.md`](README.md) and backend [`README.md`](../Home-Assistant-Pill-Logger/README.md) to locate YAML card configuration explainers
- [x] Step 2: Remove the `### YAML` subsection (minimal `device_id: <your medication device ID>` code block) from frontend README.md
- [x] Step 3: Remove the `### Example` block (`device_id: a1b2c3d4e5f6...` + color_scheme/chips YAML snippet) from frontend README.md
- [x] Step 4: Retain the Visual Editor subsection and the Configuration Options table (documents the visual editor field schema; the `device_id` row notes it is auto-populated by the device dropdown, not hand-entered)
- [x] Step 5: Verify — searched frontend README for `device_id` (1 result in the Configuration Options table row, which is the visual editor field schema, not a hand-entered YAML snippet)
- [x] Step 6: Update memory-bank files (activeContext.md, progress.md)
- Key decision: The Configuration Options table was retained because it documents the visual editor's field schema. Only the YAML code snippets that asked users to manually find and paste a `device_id` were removed. Users cannot reasonably find their medication `device_id` manually, so the YAML examples were misleading.

## Config Screen Restructure + Label Overrides
- [x] Step 1: Audit current flat schema (device_id, big_text, take_pill_icon, color_scheme, name, chips expandable, graph_options expandable, stats_3_columns, hide_nav_bar) and the take-pill/pills-left render sites
- [x] Step 2: UX audit of label-override approaches — Option A (form token) vs Option B (full-label) vs Option C (verb+form split). User clarified need for "Amount Left (ml)" override → Option B chosen (full phrase handles units + verbs a token can't)
- [x] Step 3: Confirm HA `expandable` supports nested child expandables via Context7 frontend docs ("Expansion panels require a type of expandable, a name, and a schema of child controls")
- [x] Step 4: Write architecture plan — `plans/config-restructure-and-label-overrides-plan.md`
- [x] Step 5: Get user approval on plan
- [x] Step 6: Implement `src/ax-dose-logger-card.ts` — added `take_pill_label` + `pills_left_label` to interface; restructured schema into top-level globals + 3 panel expandables (daily_panel with nested chips, graphs_panel, stats_panel); added render fallbacks for take-pill label/aria + pills-left stat-label
- [x] Step 7: Implement `src/localize.ts` — added 5 label keys (take_pill_label, pills_left_label, daily_panel, graphs_panel, stats_panel) + 2 helper keys; retained graph_options for backward compat
- [x] Step 8: Update `README.md` Configuration Options table — added take_pill_label + pills_left_label rows
- [x] Step 9: Verification — yarn run build (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)
- Key decisions: (1) Option B (full-label override) over form-token — "Amount Left (ml)" includes a unit a form token can't generate; verb independent of noun; two full-label overrides give complete control without decomposition. (2) Two-field verb+form split audited and rejected — invites half-configured "Take Cream" awkwardness, no reuse benefit. (3) LIMIT REACHED label locked — safety state, not overridable. (4) aria-label follows visible label so screen readers announce actual action. (5) Panel-grouped expandables reduce editor bloat; card-global options stay top-level. (6) Custom Chips nested inside Daily Panel (HA expandable supports nesting). (7) Unified "X Panel" naming convention. (8) `flatten: true` on all panels; fallback to `flatten: false` on outer Daily Panel if nested chips don't render correctly (visual concern only).

## 12H Time Indicators + 24H Timeframe + Default Timescale Selector (2026-06-25)

### Planning
- [x] Read activeContext, progress, projectstructure, line graph code, config form schema, README
- [x] Clarify 12H time indicator density with user (tick marks hourly + labels every 2h)
- [x] Clarify default-timescale dropdown options with user (12H/24H/48H/7D/14D/30D, add 24H)
- [x] Created architecture plan in plans/12h-time-indicators-and-default-timescale-plan.md
- [x] User approved plan, switched to Code mode

### Implementation
- [x] Added `amount_in_body_default_timeframe?: string` to `AxDoseLoggerCardConfig` interface
- [x] Added `case '24h': return 24;` to `_getTimeframeHours()`
- [x] Added `{ id: '24h', ... }` entry to `_renderTimeframeChips()` between 12h and 48h
- [x] Rewrote `connectedCallback()` `_activeTimeframe` reset to read from config with validation guard
- [x] Rewrote `_renderLineGraph()` time-indicator block: split single `timeLabels` array into `tickMarks` + `timeLabels` with per-timeframe density branching
- [x] Updated SVG render block: tick marks (short 3px lines, 0.5 stroke, 0.6 opacity) separate from text labels (4px tick + text)
- [x] Added `amount_in_body_default_timeframe` select dropdown to `getConfigForm()` `graphs_panel` expandable
- [x] Added localize keys: `graphs.timeframe_24h`, `aria.timeframe_24h`, `config.amount_in_body_default_timeframe`, `config.helper.amount_in_body_default_timeframe`
- [x] Updated `README.md` — added `amount_in_body_default_timeframe` row to Configuration Options table; updated Graphs feature line to include 24H

### Verification
- [x] `yarn run build` — clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)
- [x] Grep confirmed: 13 references to `amount_in_body_default_timeframe`/`timeframe_24h`/`tickMarks` in compiled dist output

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- [x] Updated README.md (Configuration Options table + Graphs feature line)
- Key decisions: (1) Tick marks vs text labels separated — 13 text labels in 320px would be too dense; splitting gives hourly visual granularity + readable text every 2h. (2) 24H bridges the gap between 12H (acute) and 48H (longer view). (3) Config default applied in `connectedCallback` (single reset point) with validation guard falling back to '48h'. (4) Dropdown in `graphs_panel` expandable right after `show_amount_in_body` toggle for contextual grouping.

## Day Average Boxes Entity ID Suffix Mismatch Fix (2026-06-25)

### Problem Analysis
- [x] User reported: Day Average boxes not appearing in Graph or Stats panel; adherence boxes appearing as expected
- [x] Inspected backend [`sensors/avg_doses.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/avg_doses.py:59) — unique_id uses numeric window: `f"{entry.entry_id}_avg_doses_{window_days}"` with window_days = 7/14/30/365
- [x] Inspected frontend [`_computeEntities()`](src/ax-dose-logger-card.ts:255) — yearly avg match used legacy suffix `_avg_daily_doses_yearly`
- [x] Inspected `config/.storage/core.entity_registry` — confirmed newer devices (my_day_on_off, test_pill2, test_pill_z) produce `_avg_daily_doses_365_days`; older devices (my_medication, test_pill, pill_deef, b_my_pill) retain `_avg_daily_doses_yearly`
- [x] Confirmed adherence sensors use `_adherence_365_days` (numeric) which frontend correctly matches — explains why adherence boxes worked but avg boxes didn't
- [x] Root cause: backend unique_id `_avg_doses_365` → HA slugifies entity_id to `_avg_daily_doses_365_days`, but frontend only matched `_avg_daily_doses_yearly`

### Planning
- [x] Created architecture plan in `plans/fix-day-avg-boxes-mismatch.md`
- [x] Decided on frontend-only fix (accept both suffixes) — avoids breaking existing entity registry entries and keeps backend consistent with adherence pattern
- [x] User approved plan, switched to Code mode

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) line 258 — changed `entityId.endsWith('_avg_daily_doses_yearly')` to `entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly')`
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)
- [x] Grep confirmed: `_avg_daily_doses_365_days` present in compiled dist output (line 540)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- [x] No README change needed — bug fix, no new user-facing config/UX feature
- Key decisions: (1) Frontend-only fix — backend unique_id `_avg_doses_365` is correct and consistent with adherence pattern (`_adherence_365`); changing backend would break existing entity registry entries and require migration. (2) Dual-suffix match handles both legacy (`_avg_daily_doses_yearly`) and newer (`_avg_daily_doses_365_days`) entity_ids. (3) 7/14/30-day avg suffixes already matched correctly; only the yearly slot was mismatched.

---

## Replaceable "Safe to Take" Box — 2026-06-25

### Planning
- [x] Analyze current Safe to Take box implementation in `_renderPane1` + `_computeEntities`
- [x] Confirm decoupled design with user (button logic stays on real sensor)
- [x] Write architecture plan: `plans/replace-safe-to-take-box-plan.md`

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added `safe_to_take_entity` + `safe_to_take_label` to `AxDoseLoggerCardConfig` interface
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added `_getSafeBoxEntity()` helper (returns config override or auto-resolved sensor)
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Updated `_renderPane1` Safe to Take `.stat-pill`: display entity for state + label override, raw state when swapped (non-numeric safe), clickable more-info
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added 2 schema entries to `getConfigForm` `daily_panel` between `take_pill_label` and `pills_left_label` (entity selector with `filter_device_id` + `integration: 'ax_dose_logger'`, text selector for label)
- [x] [`src/localize.ts`](src/localize.ts) — Added 4 keys: `config.safe_to_take_entity`, `config.safe_to_take_label`, `config.helper.safe_to_take_entity`, `config.helper.safe_to_take_label`
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)

### Documentation
- [x] Updated README.md Configuration Options table (2 new rows)
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- [x] Created plans/replace-safe-to-take-box-plan.md
- Key decisions: (1) Decoupled button — LIMIT REACHED + override dialog always read real `pills_safe_to_take` sensor; only box display swaps. (2) Integration + device locked picker via `integration: 'ax_dose_logger'` + `context: { filter_device_id: 'device_id' }`. (3) Non-numeric safe — swapped box shows raw state string. (4) Seamless revert — empty field falls back to default sensor. (5) Placement between `take_pill_label` and `pills_left_label` per user request.

---

## Replaceable "Safe to Take" Box v2 — Any Entity + Tap/Hold/Double-Tap Actions — 2026-06-25

### Planning
- [x] User requested: any entity selectable (not integration-locked) + tap/hold/double-tap actions (Mushroom-style) + nested collapsable under take_pill_label
- [x] Investigated `handleAction` + `ActionConfig` from custom-card-helpers (standard HA action dispatch)
- [x] Updated plans/replace-safe-to-take-box-plan.md to v2

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added `ActionConfig` + `handleAction` to custom-card-helpers import
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added 3 action fields to `AxDoseLoggerCardConfig`: `safe_to_take_tap_action`, `safe_to_take_hold_action`, `safe_to_take_double_tap_action`
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Added `_handleSafeBoxAction()` method (handleAction dispatch + more-info fallback)
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Updated `_renderPane1`: `safeBoxActionConfig`/`hasCustomTap`/`hasHold`/`hasDblClick`/`safeBoxClickable` locals; wired `@click`/`@contextmenu`/`@dblclick`/`@keydown`
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Restructured `getConfigForm`: nested `safe_to_take_box` expandable with 5 fields (entity selector without integration lock, label, 3 ui-action selectors)
- [x] [`src/localize.ts`](src/localize.ts) — Added 7 keys (safe_to_take_box title + 3 action labels + 4 helpers); updated safe_to_take_entity helper wording
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)

### Documentation
- [x] Updated README.md Configuration Options table (reworded entity row + 3 new action rows)
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- [x] Updated plans/replace-safe-to-take-box-plan.md to v2
- Key decisions: (1) Any entity — dropped `integration` lock per user request; kept `filter_device_id` as soft default. (2) Standard HA action pattern — `ui-action` selector + `handleAction` (same as Mushroom/stock cards). (3) Default tap = more-info (backward compat with v1). (4) Hold via `@contextmenu` preventDefault, gated on `hasHold`. (5) Nested expandable under `take_pill_label` per user request. (6) Decoupled button logic retained from v1.

## Config Form Grid Layout (2026-06-25)

### Planning
- [x] User requested: columns in config screens (like Mushroom) — Large Text + Hide Nav Bar side-by-side; Color Scheme + Name Override (50/50 since 1/3+2/3 not possible)
- [x] User extended: also group Take Pill Icon + Take Pill Label; Safe to Take Entity + Safe to Take Label; all chip pairs; Day Avg Boxes + Adherence Boxes
- [x] Investigated HA `type: 'grid'` schema via Context7 — confirmed only equal-width columns (50/50), no colspan/fractional
- [x] Wrote plans/config-form-grid-layout-plan.md with all 9 grid groupings + column_min_width rationale

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Wrapped 9 field pairs in `type: 'grid'` blocks in `getConfigForm()`: (1) big_text+hide_nav_bar; (2) color_scheme+name; (3) take_pill_icon+take_pill_label; (4) safe_to_take_entity+safe_to_take_label; (5–8) chip_1..4 + chip_N_label; (9) show_day_avg_boxes+show_adherence_boxes
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0; pre-existing `@formatjs/intl-utils` warnings are transitive-dependency noise, unrelated)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- [x] Created plans/config-form-grid-layout-plan.md
- Key decisions: (1) HA `type: 'grid'` = CSS auto-fill equal-width columns only — no 1/3+2/3 possible. (2) `column_min_width` 250px for most (fits 2 cols at ~500px dialog), 200px for chips (shorter fields). (3) Full-width fields kept alone (device_id, pills_left_label, show_amount_in_body, amount_in_body_default_timeframe, stats_3_columns, 3 ui-action selectors). (4) No localization changes — grid is pure layout, computeLabel/computeHelper receive leaf field name unchanged.

## Rollup onwarn Filter — Silence @formatjs/intl-utils Warning (2026-06-25)

### Problem Analysis
- [x] User noticed the `(!) "this" has been rewritten to "undefined"` Rollup warning and asked when it first appeared + whether to fix it
- [x] Traced via memory-bank/progress.md: first appeared in the **Override Popup Wording Rework** task (line 1581) — the task that first imported `formatTime, formatDateTime` from `custom-card-helpers`
- [x] Root cause: `custom-card-helpers` re-exports `formatTime`/`formatDateTime` from its datetime module, which transitively pulls in `@formatjs/intl-utils`; that package has TypeScript-compiled `__assign`/`__extends` helpers with top-level `this` references that Rollup flags as `THIS_IS_UNDEFINED` in ES module context
- [x] Confirmed the warning is harmless: the flagged code path is dead (top-level `this` is `undefined` in ES modules; `Object.assign`/`Object.setPrototypeOf` are universally available so the hand-rolled fallbacks never run); build exits 0; no runtime impact; HA loads the card fine

### Implementation
- [x] [`rollup.config.js`](rollup.config.js) — Added `onwarn` handler that filters `THIS_IS_UNDEFINED` from `@formatjs/intl-utils` (matched via `warning.id.includes('@formatjs/intl-utils')`); all other warnings pass through to default handler
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — **completely clean** (no warnings, exit 0; output is just `src/ax-dose-logger-card.ts → dist/ax-dose-logger-card.js... created dist/ax-dose-logger-card.js in 3.1s`)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- Key decisions: (1) Targeted filter — only silences `THIS_IS_UNDEFINED` from `@formatjs/intl-utils`, all other warnings visible. (2) Root cause is transitive dep — can't fix at source without patching node_modules (overwritten on yarn install); onwarn is the correct layer. (3) No runtime impact — flagged code is dead in ES module context. (4) HA best practice — don't use --silent or suppress all warnings; filter known-harmless transitive noise only.

## Config Form Grid Layout v2 Fix — name: "" + column_min_width: "200px" (2026-06-25)

### Problem Analysis
- [x] User reported: grid layout fields still rendering as a single stacked list in the HA visual editor sidebar
- [x] Root cause 1: `column_min_width: 250` (numeric) → CSS Grid calculated 500px minimum for 2 columns → exceeded the ~450px HA card editor sidebar → CSS Grid fell back to 1 column (stacked)
- [x] Root cause 2: grid wrapper objects omitted `name` attribute → `ha-form` requires `name: ""` on layout-only containers to avoid rendering an empty label row
- [x] Audited all 9 grid blocks in `getConfigForm()` — confirmed all had both issues

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Fixed all 9 grid blocks: (1) changed every `column_min_width` from numeric `250`/`200` to string `"200px"`; (2) added `name: ''` to every grid wrapper object. The `schema` array nesting was already correct from v1.
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0, no warnings)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- Key decisions: (1) `name: ""` required on grid wrapper — `ha-form` expects every schema node to have a `name`; empty string = layout-only container with no data field. (2) `column_min_width: "200px"` as string — HA grid schema expects CSS length string, not bare number; 200px makes 2 columns fit in 400px min, working in the narrow ~450px editor sidebar. (3) All grids use 200px — simplified from v1 split (250/200); 200px works for all field types in the narrow sidebar.

## Config Helper Text Simplification (2026-06-25)

### Problem Analysis
- [x] User reported: description text under boxes/toggles takes up too much space and misaligns paired fields in the 2-column grid layout
- [x] Audited all 21 `config.helper.*` strings in `src/localize.ts` (lines 149-170)
- [x] Identified redundancy patterns: (1) repeating the label, (2) implementation details (pixel measurements, default icon names), (3) edge-case explanations (limit-reached state, safety logic disclaimers), (4) default-state descriptions, (5) verbose connective tissue

### Implementation
- [x] [`src/localize.ts`](src/localize.ts) — Simplified all 21 helper strings. Applied principle: "label says what it IS; helper says only what's NOT obvious — default value, brief example, or one-word behavior hint." Total reduction: ~1,950 chars → ~750 chars (62% reduction). Key examples: `safe_to_take_box` 253→67, `take_pill_label` 163→72, `amount_in_body_default_timeframe` 163→32, `hide_nav_bar` 106→29.
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0, no warnings)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- Key decisions: (1) Label says what it IS, helper says what's NOT obvious — field label already identifies the field; helper only adds default value, brief example, or behavior hint. (2) Removed implementation details — pixel measurements, default icon names, safety logic disclaimers are not config guidance. (3) Removed edge-case explanations — shortened to essential behavior hints. (4) Removed verbose connective tissue — "When on, all text...", "Action to perform when...", "Entity from the selected device to display as..." all cut. (5) Grid alignment benefit — shorter helpers keep both columns' fields at the same vertical level in 2-column grids.

## Label Alignment Fix — Safe to Take + Chips (2026-06-25)

### Problem Analysis
- [x] User reported: "Safe to Take Entity" title above the box is redundant and misaligns the 2 paired fields
- [x] User reported: chip pairs have the same misalignment issue, but chips need some label to indicate which chip is being modified
- [x] Root cause 1 (Safe to Take): both `safe_to_take_entity` ("Safe to Take Entity") and `safe_to_take_label` ("Safe to Take Label") labels are redundant — the expandable title "Safe to Take Box" already provides context; the labels add height above each field, and if one wraps differently than the other, the inputs misalign
- [x] Root cause 2 (Chips): entity labels "Chip N (optional)" (16 chars) are longer than paired label fields "Chip N Label" (12 chars), causing the entity label to wrap to 2 lines in a 200px grid column while the label field stays on 1 line → vertical misalignment

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — Updated `computeLabel` in `getConfigForm()` to return `undefined` for `safe_to_take_entity` and `safe_to_take_label`, removing both labels above the grid-paired fields
- [x] [`src/localize.ts`](src/localize.ts) — Shortened all 4 chip entity labels from "Chip N (optional)" → "Chip N" (removed "(optional)" suffix)
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0, no warnings)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- Key decisions: (1) Remove both Safe to Take labels, not just one — removing only the entity label would leave "Safe to Take Label" above the label field, causing misalignment in the opposite direction. (2) Chip "(optional)" suffix removed — made entity labels longer than paired label fields, causing wrapping; "Chip N" (6 chars) matches "Chip N Label" (12 chars) on 1 line. (3) `computeLabel` returning `undefined` — standard HA pattern for fields where the label would be redundant (e.g. inside an expandable whose title provides context).
- **NOTE: This approach was SUPERSEDED by the Grid Alignment CSS Fix below.** The label removal stripped UX context and the chip label shortening didn't address the real root cause (different label rendering mechanisms between entity pickers and text fields).

## Grid Alignment CSS Fix — align-items: end in ha-form shadow DOM (2026-06-25)

### Problem Analysis
- [x] User corrected: the misalignment root cause is NOT text length/wrapping — it's that entity pickers (`ha-entity-picker`) render an EXTERNAL label above the control while text fields (`ha-textfield`) render an INTERNAL floating label inside the control box
- [x] In a CSS grid row, the grid aligns children by their top edges — the entity picker's external label pushes its control box down while the text field's control box starts at the top → physical input boxes misaligned
- [x] Confirmed via Context7 HA frontend docs: `ha-form` does not expose a schema property to force external label rendering on text selectors; `ha-input` has `inset-label` property but `ha-form` controls how labels are passed and doesn't expose it via the schema
- [x] Conclusion: must fix via CSS in the main Lit element (inject `align-items: end` into `ha-form` shadow roots), not via JSON schema

### Implementation
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — (1) Reverted `computeLabel` `undefined` return for safe_to_take fields — both show full localized labels again. (2) Added `_injectFormGridAlignmentStyle()` static method + `_formStyleObserver` static field: uses a `MutationObserver` on `document.body` to find all `ha-form` elements (including lazily-opened config dialog forms), injects an id-tagged `<style>` into each `ha-form`'s `shadowRoot` with `align-items: end !important` on grid-display divs. (3) Called from `connectedCallback`.
- [x] [`src/localize.ts`](src/localize.ts) — Restored chip entity labels from "Chip N" back to "Chip N (optional)"
- [x] [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt via `yarn run build`

### Verification
- [x] `yarn run build` — clean compilation (exit 0, no warnings)

### Documentation
- [x] Updated memory-bank/activeContext.md
- [x] Updated memory-bank/progress.md (this section)
- Key decisions: (1) Root cause = different label rendering — entity pickers have external labels (push control down), text fields have internal floating labels (control starts at top). (2) CSS fix, not schema fix — `ha-form` doesn't expose a way to force external labels on text selectors; only viable fix without a fully custom editor is CSS `align-items: end`. (3) `align-items: end` forces bottom-edge alignment — shorter text field sinks to match entity picker's bottom. (4) Shadow DOM injection via MutationObserver — `ha-form` uses shadow DOM, external CSS can't reach internals; observer catches forms as they appear and injects style into `shadowRoot`. (5) All field labels restored — previous label removal stripped UX context; CSS fix preserves all labels.

## Panel Reactive Prop Fix — Restore Live Visual Updates Across Panes
- [x] Step 1: Investigate frontend card source to locate the visual-update regression
- [x] Step 2: Confirm root cause — presentational panel children only receive stable-reference props (`.controller` = the card itself, `.entities` = memoized `ResolvedEntities` cache), so Lit never re-renders them between mount and unmount; changes only appeared after a pane switch remounted the element
- [x] Step 3: Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;` to all 6 presentational panels (daily, stats, caffeine, tools, tracking, graphs) + import `AxDoseLoggerHass`
- [x] Step 4: Add 5 graph-local reactive props to `graphs-panel.ts` (`amountHistory`, `doseHistory`, `activeGraph`, `activeTimeframe`, `activeBarTimeframe`); replace controller-getter reads with local reactive props
- [x] Step 5: Update container `render()` to bind `.hass=${this.hass}` to all panels + bind the 5 graph props to the graphs panel
- [x] Step 6: Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt
- [x] Step 7: Update memory-bank/activeContext.md and memory-bank/progress.md (this section)
- Created architecture plan: `plans/panel-reactive-prop-fix-plan.md`
- Key decisions: (1) Root cause = stable-reference inputs starved Lit reactivity — the refactoring passed only `.controller` (card instance, invariant reference) and `.entities` (memoized on device_id + hass.entities registry ref, which only changes on entity add/remove, not on a normal state tick), so neither input changed reference during normal use and the panels never re-rendered except on pane-switch remount. (2) `hass` is the canonical HA reactivity signal — HA replaces the top-level `hass` object reference on every state update; binding it as a reactive prop makes the panel re-render whenever the container's `shouldUpdate` lets the container re-render. (3) Graph panel needed more than `hass` — it reads container `@state` (`_amountHistory`, `_doseHistory`, `_activeGraph`, `_activeTimeframe`, `_activeBarTimeframe`) that changes independently of HA ticks (async fetch completion, carousel/timeframe UI); promoting these to reactive props lets those changes re-render the panel immediately, fixing the "14-day average doesn't load until a second visit" and "graph doesn't change until pane reload" symptoms. (4) Controller getters kept on the `CardController` interface — now only used by the container, harmless; `hass` was already declared so no interface change needed. (5) No backend / config-flow / README changes — pure frontend reactivity bug fix.

## Caffeine Pane Visibility Guard — Hide Caffeine Pane Unless device_type === 'caffeine'
- [x] Step 1: Confirm gating contract with user — caffeine pane visible only when the device's primary sensor (`next_dose`) exposes a `device_type` state attribute with value `"caffeine"`. Backend does not emit this attribute yet, so pane stays hidden everywhere until a real caffeine device is configured.
- [x] Step 2: In `src/ax-dose-logger-card.ts` `_renderPaneSelector` — compute `hasCaffeine` from `(this._getAttr(entities.nextDose, 'device_type') || '').toLowerCase() === 'caffeine'`; remove the previously-unconditional `{ id: 'caffeine', … }` entry from the `panes` array; spread it in only when `hasCaffeine` is true (mirrors the existing `hasMetrics`/tracking conditional-spread pattern).
- [x] Step 3: In `src/ax-dose-logger-card.ts` `render()` — add an auto-fallback guard right after the existing tracking fallback: if `_activePane === 'caffeine'` but the device's `device_type` attribute is not `'caffeine'`, reset `_activePane = 'daily'`. Prevents the render ternary from rendering the caffeine panel for a non-caffeine device even when the nav button is hidden.
- [x] Step 4: Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Step 5: Update memory-bank/activeContext.md and memory-bank/progress.md (this section).
- Key decisions: (1) Gate on a state attribute, not a dedicated entity — a device *type* classifier is metadata about the device, not an observable measurement, so per HA best practice it belongs in `extra_state_attributes` on the primary sensor (mirrors the existing `tracking_type` pattern read via `this._getAttr(entities.nextDose, 'tracking_type')`). (2) Mirror the existing `hasMetrics`/tracking conditional-spread pattern — no new abstraction; `hasCaffeine` computed once, caffeine entry spread in only when true. (3) Defensive attribute lookup — nil-coalesced + lower-cased, since the backend doesn't emit the attribute yet and will eventually emit snake_case values; pane hidden everywhere until a real caffeine device exists. (4) Auto-fallback guard mirrors the tracking fallback — handles attribute removal, device switch, or lingering dev-session `_activePane` state. (5) Frontend-only, forward-compatible — `caffeine-panel.ts`, its import, the `'caffeine'` union member, the render ternary, and `getCardSize` all unchanged; simply not reached until a real caffeine device exists. Guard reads `device_type`, forward-compatible with the planned two-field backend design (`device_category: 'medicine'|'drink'` for the config-flow branch + `device_type: 'caffeine'|'alcohol'|…` for pane visibility).

## Safe to Take + Pills Left Icon Selectors + Title-Case Swapped State (2026-06-26)

### Planning
- [x] Read frontend memory-bank/activeContext.md and card source (daily-panel.ts, ax-dose-logger-editor.ts, types.ts, localize.ts) to establish current Safe to Take + Pills Left rendering and config form structure.
- [x] Confirm title-case formatting rule with user (first letter capitalized, rest unchanged: `on` -> `On`, `off` -> `Off`, `available` -> `Available`).

### Implementation
- [x] Step 1: In `src/types.ts` — add `safe_to_take_icon?: string;` after `safe_to_take_label` and `pills_left_icon?: string;` after `pills_left_label` to `AxDoseLoggerCardConfig`.
- [x] Step 2: In `src/ax-dose-logger-editor.ts` — restructure the `safe_to_take_box` expandable: move `safe_to_take_entity` out of the grid to a full-width top row; add a new `type: 'grid'` row pairing `safe_to_take_icon` (`selector: { icon: {} }`) with `safe_to_take_label` (`selector: { text: {} }`). Wrap the lone `pills_left_label` field in a `type: 'grid'` row pairing `pills_left_icon` (`selector: { icon: {} }`) with `pills_left_label`.
- [x] Step 3: In `src/localize.ts` — add 4 keys: `config.safe_to_take_icon`, `config.pills_left_icon`, `config.helper.safe_to_take_icon`, `config.helper.pills_left_icon`.
- [x] Step 4: In `src/components/daily-panel.ts` — wire `c.config?.safe_to_take_icon || 'mdi:shield-check'` into the Safe to Take `<ha-icon>`; wire `c.config?.pills_left_icon || 'mdi:pill'` into the Pills Left `<ha-icon>`; replace the swapped Safe to Take `stat-value` with `displayState ? displayState.charAt(0).toUpperCase() + displayState.slice(1) : ''` (title-case, empty-guarded).
- [x] Step 5: Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Step 6: Update README.md Configuration Options table (two new icon rows).
- [x] Step 7: Update memory-bank/activeContext.md and memory-bank/progress.md (this section).
- Key decisions: (1) HA-native `icon` selector (`selector: { icon: {} }`) for both new fields — same selector already used by `take_pill_icon`; gives users the HA icon picker UI rather than free text. (2) Entity on its own row, icon+label on the next row — per user request; `safe_to_take_entity` is full-width (entity pickers benefit from horizontal room), and the visually-related `safe_to_take_icon` + `safe_to_take_label` share a 200px grid row underneath, mirroring the existing take-pill icon/label grid. (3) Pills Left grid pairing — the previously lone `pills_left_label` text field is now wrapped in a 200px grid row with `pills_left_icon`, matching the take-pill and safe-to-take icon/label pairing pattern for visual consistency. (4) Title-case rule: first letter only — per user confirmation, uppercase the first character and leave the remainder unchanged (`on` -> `On`, `not_home` -> `Not_home`); avoids over-transforming states with underscores or mixed casing while fixing the all-lowercase complaint for the common `on`/`off`/`available` cases. (5) Defensive empty-string guard — the title-case expression checks `displayState ?` before `.charAt(0)`, so an empty/undefined swapped state renders an empty string instead of throwing. (6) Frontend-only — icons and title-case display are pure card-config cosmetic concerns; no backend, config-flow, or sensor changes; the default-sensor (non-swapped) Safe to Take path is unchanged.

## Dialog Font-Size UX Audit + Uniform Enlargement (2026-06-26)

### Planning / Audit
- [x] Read frontend memory-bank/activeContext.md and inspect shared dialog CSS in `src/ax-dose-logger-card.ts` `_getStyles()` (`.dialog-header`, `.tools-dialog-descriptor`, `.dialog-btn`, `.dialog-btn ha-icon`, `.dialog-header--warning ha-icon`, `.refill-input`).
- [x] Confirm scope with user: all five card dialogs (pill-limit override, tracking override, tools, refill, device-info) — enlarge body + header + buttons uniformly.
- [x] UX audit against WCAG 1.4.3 (body min 16px), WCAG 2.5.5 (44px touch target), and Material 3 type scale (body-medium 14px = supporting text, title-medium 18px = primary message, headline-small 24px). Confirmed via Context7 HA frontend docs that `ha-dialog` `width="small"` = 320px and custom sizing is not recommended, so the fix is content font-size, not dialog width.
- [x] Conclusion: 14px override body fails WCAG 1.4.3 and is the wrong M3 token role (body-medium) for a safety-critical medication warning; buttons ~40px tall fail WCAG 2.5.5.

### Implementation
- [x] Step 1: `.dialog-header` font-size `1.25rem` (20px) -> `1.5rem` (24px) — M3 headline-small, clear hierarchy above enlarged body.
- [x] Step 2: `.dialog-header--warning ha-icon` `--mdc-icon-size` 24px -> 28px — proportional to enlarged header.
- [x] Step 3: `.dialog-btn` font-size 14px -> 16px (M3 body-large / WCAG body min) + padding `12px 20px` -> `14px 24px` (brings button height to ~44px = WCAG 2.5.5 touch-target min).
- [x] Step 4: `.dialog-btn ha-icon` `--mdc-icon-size` 20px -> 24px — scales with 16px label.
- [x] Step 5: `.refill-input` font-size 16px -> 18px — balances with enlarged buttons.
- [x] Step 6: `.tools-dialog-descriptor` font-size `calc(14px + var(--pill-text-offset, 0px))` -> `calc(18px + var(--pill-text-offset, 0px))` — M3 title-medium for a safety-critical primary message; preserves the existing `big_text` opt-in bump (`--pill-text-offset`) on top of the new 18px baseline.
- [x] Step 7: Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Step 8: Update memory-bank/activeContext.md and memory-bank/progress.md (this section).
- Key decisions: (1) **18px body, not 16px** — 16px is the WCAG *minimum* for body text, but a medication-safety override is not ordinary body copy; it's a single critical sentence the user must read before confirming an unsafe action. 18px (M3 title-medium) gives it the prominence a warning deserves while staying inside the M3 type scale (no ad-hoc pixel value). (2) **Preserve the `--pill-text-offset` opt-in** — kept `calc(18px + var(--pill-text-offset, 0px))`; users who enabled `big_text` still get their extra bump on top of the new 18px baseline, and users who didn't still get the audited-safe 18px. Avoids regressing the existing accessibility feature. (3) **One shared ruleset, not per-dialog overrides** — all five dialogs already reuse `.dialog-header`/`.tools-dialog-descriptor`/`.dialog-btn`; bumping them once scales every dialog uniformly, matching the user's "all dialogs uniformly" scope without CSS duplication. (4) **44px touch targets** — padding bump to `14px 24px` brings button height to ~44px, the WCAG 2.5.5 minimum; a genuine accessibility fix, not just cosmetic. (5) **Frontend-only, CSS-only** — pure changes to the static `_getStyles()` CSS block; no template logic, localization, backend, or README impact (visual tweak, not a user-facing config change). No new CSS custom properties or hardcoded theme-breaking values — all rules continue to use the existing HA tokens (`--primary-text-color`, `--primary-color`, `--error-color`, `--ha-card-border-radius`).

## Full-Card Font-Size & Touch-Target UX Audit + Implementation (2026-06-26)

### Planning / Audit
- [x] Inventory every `font-size` and `--mdc-icon-size` declaration across all 6 source files (`ax-dose-logger-card.ts`, `daily-panel.ts`, `stats-panel.ts`, `tracking-panel.ts`, `tools-panel.ts`, `graphs-panel.ts`, `caffeine-panel.ts`).
- [x] Audit each against WCAG 1.4.3 (body min 16px), WCAG 2.5.5 (touch target min 44×44px, 24×24 AA concession), and the Material 3 type scale (headline-small 24, title-large 22, title-medium 18, body-large 16, body-medium 14, body-small 13, label-medium 12, label-small 11).
- [x] Tier the findings: Tier 1 primary content (18-20px, PASS), Tier 2 secondary labels (12-15px, NEEDS WORK), Tier 3 tertiary/chart annotations (9-13px, MIXED), Tier 4 touch targets (20-32px, NEEDS WORK).
- [x] Write full audit to `plans/full-card-font-audit.md`.
- [x] Confirm chart-annotation scope with user: modest bump to 11px (preserves graph density on the 320px-wide chart while improving on 9-10px).

### Implementation
- [x] `daily-panel.ts` — `.stat-label` 14px -> 15px (M3 body-medium, secondary context); `.chip-name` 10px -> 12px (M3 label-medium, identifies chip entity).
- [x] `stats-panel.ts` — `.stat-cell-label` 12px -> 14px (M3 body-medium; "7-Day Avg" labels must be readable).
- [x] `tracking-panel.ts` — `.tracking-label` 14px -> 16px (WCAG body min); `.tracking-badge` 11px -> 12px (M3 label-medium); `.tracking-scale-tick` 10px -> 11px (chart annotation, density preserved).
- [x] `tools-panel.ts` — tools body text 13px -> 14px (×2 rules: empty-state + tool-btn); `.tools-section-header` 14px -> 16px (WCAG body min).
- [x] `graphs-panel.ts` — (1) `.nav-btn` 32×32 -> 40×40px (WCAG 2.5.5 AA concession for dense carousel header); (2) `.nav-title` 15px -> 16px (WCAG body min); (3) `.timeframe-chip` padding 2px 6px -> 4px 10px + font 10px -> 12px (WCAG 2.5.5 + legibility); (4) Y-axis labels 10px -> 11px (×2 inline SVG styles: dose-count + amount); (5) "Current:" label 11px -> 12px (safety-relevant annotation); (6) time labels 9px -> 11px (smallest text on card, chart density preserved); (7) loading text 13px -> 14px (M3 body-small); (8) `.avg-label` 11px -> 12px (M3 label-medium); (9) `.avg-value` 15px -> 16px (WCAG body min).
- [x] `ax-dose-logger-card.ts` — nav bar title 15px -> 16px (WCAG body min); `.pane-btn` padding 10px -> 12px (borderline ~40px -> safer ~44px touch target); placeholder subtitle 13px -> 14px (M3 body-small, inline style).
- [x] No change to already-compliant elements: med name (20px), take-pill label/sub (18/16px), stat values (18px), chip value (16px), caffeine placeholder (16px), graph placeholder title (16px).
- [x] Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Update memory-bank/activeContext.md and memory-bank/progress.md (this section).
- Key decisions: (1) **Preserve `--pill-text-offset` on every bumped rule** — the existing `big_text` opt-in (`0px` when ON, `-2px` when OFF) must keep working; all bumps stay `calc(newN + var(--pill-text-offset, 0px))` so users who enabled Large Text still get their extra bump on top of the new baselines. (2) **Chart annotations get a modest bump to 11px, not 16px** — per user confirmation; the 320px-wide graph cannot fit 13 time labels at 16px without overlap, so Y-axis labels, time labels, and scale ticks go to 11px (M3 label-small), improving on 9-10px while preserving information density. (3) **Content labels (chip name, badge, "Current:", avg-label) -> 12px (M3 label-medium)** — these are genuine content identifiers, not annotations; 12px is the smallest M3 token that's still a "label" role rather than ad-hoc. (4) **Touch targets use the AA concession** — graph nav-btn 32 -> 40px (full 44×44 would break the compact carousel header); timeframe chip padding + font bump brings it from ~20px to ~28px tall (still compact for the chip row but more tappable); pane-btn padding 10 -> 12px brings the borderline ~40px button to ~44px. (5) **No README / localization / backend changes** — pure CSS across 6 component files + the main card file; all rules continue using existing HA theme tokens (`--primary-text-color`, `--secondary-text-color`, `--primary-color`, `--ha-card-border-radius`). (6) **Tier 1 primary content untouched** — med name (20px), take-pill label (18px), stat values (18px) were already at M3 title-medium/title-large and pass the audit; no change needed.

## Chart Top-Buffer Fix for Enlarged Timeframe Chips (2026-06-26)

### Problem
The Tier 4 timeframe-chip enlargement (padding 2px 6px -> 4px 10px + font 10px -> 12px, bringing chip height from ~20px to ~28px) caused the chips to overlap the chart plot area. Both charts use `viewBox="0 0 320 180"` with `padTop = 16` (the y-coordinate where the plot area begins), and the chips are absolutely positioned at `top: 4px` over the chart. With the enlarged chips occupying ~32px from the top (4px offset + ~28px height), they overlapped the plot area starting at y=16.

### Implementation
- [x] `src/components/graphs-panel.ts` — `_renderBarChart`: `padTop` 16 -> 36 (line 152). `_renderLineChart`: `padTop` 16 -> 36 (line 251). `chartH` recalculates automatically (`h - padTop - padBottom`), so the plot area shrinks proportionally while the SVG viewBox stays 320×180 — no layout shift, just ~20% more breathing room at the top (36px = 20% of the 180px chart height).
- [x] Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Update memory-bank/progress.md (this section).
- Key decisions: (1) **Bump padTop, not the SVG height** — keeping the viewBox at 320×180 means the chart's rendered size (controlled by `aspect-ratio: 320/180` and `min-height: 180px`) is unchanged; only the internal plot area shrinks, so the card layout doesn't shift. (2) **36px = 20% of 180px** — per user request for ~20% more buffer; clears the ~32px chip zone (4px top offset + ~28px chip height) with a small gap. (3) **Both charts get the same padTop** — bar and line charts share the identical chip positioning (`top: 4px`), so both need the same buffer; using 36px for both keeps the visual rhythm consistent across the carousel slides. (4) **No CSS-only fix possible** — the overlap is between the absolutely-positioned HTML chips and the SVG plot area whose top boundary is computed in JS (`padTop`); the chips can't be pushed up (they're already at the top edge) and the SVG can't be pushed down via CSS without creating a gap above the chart background, so the JS `padTop` is the correct fix point.

## Chart Top-Buffer Adjustment to 28px (2026-06-26)

### Change
- [x] `src/components/graphs-panel.ts` — revised `padTop` from 36 -> 28 on both bar chart (line 152) and line chart (line 251), per user request for a tighter buffer than the initial 36px. 28px still clears the enlarged timeframe chips (~32px zone) with a minimal gap while giving more plot area back to the chart.
- [x] Build (`yarn run build`) — clean compilation, exit 0, no warnings; dist rebuilt.
- [x] Update memory-bank/progress.md (this section).

## Card Visual Editor — Raw Translation Key Leak Fix (2026-06-26)

### Problem
In the card visual editor, expandable section headers (`Daily Panel`, `Graphs Panel`, `Stats Panel`, `Custom Chips`, `Safe to Take Box`) and `type: 'grid'` layout containers showed raw translation keys as visible helper/label text — e.g. `config.helper.daily_panel`, `config.helper.graphs_panel`, `config.helper.stats_panel`, `config.helper.chips`, `config.helper.safe_to_take_box`, and the empty-name `config.helper.`.

### Root Cause
`ha-form` invokes the `computeHelper` and `computeLabel` callbacks for **every** schema node, including container nodes (`type: 'expandable'`, `type: 'grid'`). The callbacks in `buildEditorForm()` blindly ran `localize(lang, 'config.helper.' + name)` / `localize(lang, 'config.' + schema.name)` for all nodes. The translation map in `localize.ts` only defines helpers/labels for **leaf input fields** (those with a `selector`). For containers, `localize()` falls back to **returning the raw key string** (`translations[lang]?.[key] ?? translations.en[key] ?? key`), which then rendered as visible text.

### Implementation
- [x] `src/ax-dose-logger-editor.ts` — `computeHelper`: added a guard at the top that returns `''` when `schema.type === 'grid' || schema.type === 'expandable' || !schema.selector` (layout/container nodes have no input control, so helper text does not apply). The existing `chip_` prefix logic is preserved for leaf chip fields.
- [x] `src/ax-dose-logger-editor.ts` — `computeLabel`: added a guard returning `''` when `schema.type === 'grid' || !schema.name` (grid containers have `name: ''` and are pure layout; returning '' prevents the `config.` fallback from leaking). Expandable containers keep their labels (real section headers like `daily_panel` -> "Daily Panel").
- [x] Build (`yarn run build`) — clean compilation, exit 0, no warnings; `dist/ax-dose-logger-card.js` rebuilt.
- [x] Update memory-bank/progress.md (this section).
- Key decisions: (1) **Guard at the top of the callbacks, not in the translation map** — the missing helpers are a symptom of containers not needing them; adding empty `config.helper.daily_panel` keys would mask the real issue and require an entry for every future container. Guarding by schema shape (`type`/`selector`) is the correct abstraction. (2) **Expandable containers keep their label** — `daily_panel`, `graphs_panel`, `stats_panel` are real section headers with defined `config.<name>` translations; only their helper text is suppressed. Grid containers suppress both label and helper (pure layout, empty name). (3) **No README change** — this is an internal editor-rendering bug fix; no user-facing config surface or installation step changed. (4) **No `localize.ts` change** — the fallback-to-key behavior is correct for genuine missing-key diagnostics; the bug was that containers were being asked for helpers they should never produce.

## Effectiveness Tracking Line Graph (2026-06-26)

### Planning / UX Audit
- [x] Read backend effectiveness store/coordinator (`coordinator.py`, `store.py`, `number.py`) to confirm data source: metrics are daily-locked (one value per metric per day); the integration's own store keeps only today's value, so multi-day history must come from the HA recorder.
- [x] Read frontend graphs-panel, daily-panel, types, history-fetch (`graphs-panel.ts`, `ax-dose-logger-card.ts:796`) to understand the existing bar/line graph patterns + the `history/period/` REST API usage.
- [x] UX audit written to [`plans/effectiveness-graph-audit.md`](../../Home-Assistant-Pill-Logger/plans/effectiveness-graph-audit.md): 11 friction points identified; two design decisions confirmed with user (3rd carousel slide in Graphs pane; Avg recomputes over visible-only metrics). Resolved a hidden-state friction: the per-tracker toggle row is always rendered (in both Avg and Individual views) so the user can always see/edit which metrics feed the Avg line.
- [x] Implementation plan (section 6 of the audit doc) written for Code mode.

### Implementation (frontend-only, no backend changes)
- [x] `src/types.ts` — Added `activeEffectivenessTimeframe`, `activeEffectivenessView`, `effectivenessHistory`, `effectivenessVisible` to `CardController`; added `handleEffectivenessTimeframeChange`, `setEffectivenessView`, `toggleEffectivenessMetric` action methods.
- [x] `src/ax-dose-logger-card.ts` — (1) New `@state`: `_activeEffectivenessTimeframe` ('14d'), `_activeEffectivenessView` ('avg'), `_effectivenessHistory` (keyed by metricKey), `_effectivenessVisible` (Set). (2) New `_effectivenessFetchToken` race guard. (3) New `_fetchEffectivenessHistory` — batched single `history/period/…?filter_entity_id=e1,e2,e3&minimal_response&significant_changes_only=1` call covering ALL effectiveness entities, split per metricKey on the client; drops unknown/unavailable states so unlogged days render as gaps. Initializes the visible set to all metrics on first fetch (and when the metric set changes). (4) Public getters + action methods (`handleEffectivenessTimeframeChange`, `setEffectivenessView`, `toggleEffectivenessMetric` — the last mutates a fresh Set so Lit detects the reference change). (5) `updated()`: fetch on pane entry + on `_activeEffectivenessTimeframe` change. (6) `shouldUpdate`: added the four new `@state` keys to the always-render list. (7) `connectedCallback`: reset effectiveness state on view entry. (8) `disconnectedCallback`: bump the effectiveness fetch token. (9) Render: pass the four new reactive props to `<ax-dose-graphs-panel>`.
- [x] `src/components/graphs-panel.ts` — (1) Added `MetricEntity` import. (2) New reactive props: `activeEffectivenessTimeframe`, `activeEffectivenessView`, `effectivenessHistory`, `effectivenessVisible`. (3) New static `METRIC_COLORS` palette (8 hues, hex since there's no multi-hue HA token). (4) `render()`: added `'effectiveness'` to the slides array (gated on `entities.metrics.length > 0`); carousel title dispatches to the new slide. (5) New `_renderEffectivenessGraph`: one-point-per-day line(s) on a fixed 0–10 Y-axis; `14d/30d/60d` chips (dedicated `_renderEffectivenessTimeframeChips`); `_bucketByDay` resamples recorder history to last-value-per-day; `buildSegments` produces polyline segments with gap-breaks across unlogged days (svg M move, no L line → gaps not zeros); `_metricColor` indexes by sorted metricKey position for stable colors. Avg view = single primary-color polyline of the average-of-visible per day. Individual view = one colored polyline per visible metric. Per-point `<circle>` + `<title>` for hover/AT. Empty-state placeholder when no history. (6) New `_renderEffectivenessViewToggle` — `role="tablist"`/`role="tab"`/`aria-selected`; shown only when metrics.length > 1. (7) New `_renderEffectivenessTrackerRow` — `flex-wrap` row of color-swatch + label + `aria-pressed` toggle buttons; **always rendered** when metrics.length > 1 (resolves the hidden-state friction; doubles as legend). (8) New CSS: `.effectiveness-wrapper`, `.eff-view-toggle`, `.eff-view-tab[.active]`, `.eff-tracker-row`, `.eff-tracker-chip[.off]`, `.eff-swatch`, `.eff-tracker-label`.
- [x] `src/localize.ts` — Added 5 keys: `graphs.empty_effectiveness`, `graphs.effectiveness_title`, `graphs.effectiveness_avg`, `graphs.effectiveness_individual`, plus `aria.effectiveness_avg`, `aria.effectiveness_individual`.
- [x] `README.md` — Added the Effectiveness graph to the Graphs pane feature list (auto-appears, Avg/Individual toggle, per-tracker visibility, 14D/30D/60D timescales, recorder requirement).
- [x] Build (`yarn run build`) — clean compilation, exit 0, no warnings; `dist/ax-dose-logger-card.js` rebuilt.
- [x] TypeScript type check (`npx tsc --noEmit`) — exit 0, no errors.
- [x] Update memory-bank/progress.md (this section).

### Key Design Decisions
1. **No backend changes** — effectiveness history comes from the HA recorder via the same `history/period/` REST pattern the Amount-in-Body graph uses. The integration's own store only keeps today's value (`coordinator.py` daily-lock + midnight clear).
2. **Batched history fetch** — single comma-separated `filter_entity_id` call for all effectiveness entities, split per metricKey on the client. Keeps the graph snappy with many custom metrics and reuses the race-guard token pattern.
3. **One point per day + gap preservation** — effectiveness is daily-locked, so one-point-per-day is the natural representation (not the continuous polyline of the amount-in-body graph). Unlogged days were filtered out by the fetch, so the polyline naturally gaps (svg M move) rather than plotting zeros.
4. **Fixed 0–10 Y-axis** — `PillEffectivenessSlider` hardcodes min=0/max=10 for both standard and custom metrics, so the axis is fixed and averaging across metrics is apples-to-apples. Caveat logged in the audit: if custom metrics ever gain per-metric min/max, the Avg toggle becomes meaningless.
5. **Avg recomputes over visible-only metrics** (user-confirmed) — the per-tracker toggle row is therefore always rendered (in both views) so the user can always see/edit what feeds the Avg line. Resolves the hidden-state friction identified in the audit.
6. **Stable color assignment by sorted metricKey** — toggling visibility doesn't reassign colors; the swatch in the tracker row matches the line color. Color-blind accessibility: swatch + label, not hue alone.
7. **3rd carousel slide** (user-confirmed) — reuses the existing `activeGraph` index + carousel nav; the Avg/Individual toggle is an in-slide sub-control below the chart, kept out of the carousel nav row to avoid conflating "which graph" with "which view".
8. **Toggle hidden when only 1 metric** — Avg ≡ Individual for a single metric; showing a no-op toggle is friction.
9. **Accessibility** — `role="tablist"`/`role="tab"`/`aria-selected` on the view toggle; `aria-pressed` on per-tracker chips; `<title>` per data point for hover/AT.

## Custom Chips Dropdown Alignment Fix (2026-06-26)
Fixed the misaligned config boxes in the Custom Chips expandable of the card visual editor by dropping both labels (entity picker + text field) for all 4 chip grid rows, so the input boxes align on the same horizontal line.

- [x] Audit the chip dropdown misalignment + review the user's "drop the title" proposal against 5 alternative solutions
- [x] Confirm approach with user (Option A: drop both labels for full symmetry)
- [x] Write architecture plan to `plans/chip-dropdown-alignment-fix.md` (root cause, 5 alternatives, chosen solution, reversible fallback to Option B)
- [x] Add name-based early-return in `computeLabel` ([`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:384)) returning `undefined` for the 8 chip field names (`chip_1`/`chip_1_label` ... `chip_4`/`chip_4_label`) so `ha-form` renders no label row above either field
- [x] `yarn run build` — clean compilation (exit 0, no warnings)
- [x] Update `memory-bank/activeContext.md` (Current Status, What Was Changed, Files Modified, Key Design Decisions, archive previous context)
- [x] Append this section to `memory-bank/progress.md`

### Root cause
Each chip pair is a `type: 'grid'` row with an entity picker (external label above the control — "Chip N (optional)", 16 chars, wraps to 2 lines in the 200px column) and a text field (internal floating label, no extra height). The entity picker cell is taller than the text field cell. The existing `installEditorGridAlignment()` `align-items: end` CSS injection aligns only the bottoms, so the input lines still sit at different vertical positions.

### Solution
`computeLabel` returns `undefined` for the 8 chip field names → `ha-form` renders no label row above either field → both cells contain only the control box → equal cell heights → input boxes align naturally. The `localize.ts` `config.chip_N` / `config.chip_N_label` keys are retained (reversal is a one-line edit). Helper text under each field still conveys role + optionality; the entity-picker UI vs text-field UI distinguishes the two columns.

### Key design decisions
1. **Option A — drop both labels** (user-confirmed) — full symmetry over per-slot identification.
2. **Reversible to Option B** — keep `chip_N_label` text-field floating label, drop only the entity label, if per-slot identification is later requested.
3. **`installEditorGridAlignment()` kept** — still needed for Safe-to-Take + take-pill grids; now a harmless no-op for chip grids.
4. **Frontend-only, editor-only** — no backend, config-flow, sensor, runtime, or README impact.

## Drinks Card for Master Tracker Devices (2026-06-28)

Full Drinks card rendered when the selected device is a Master Tracker (Caffeine Tracker / Alcohol Tracker): 5-item nav (Drinks | Graph | Inventory | Stats | Tools) + per-granular-drink Log Drink / Undo / Reset. Granular drink devices show a redirect placeholder; medicine devices unchanged. Depends on backend Drinks Card Backend Support (substance + device_type attrs, master rename, REST master history).

### Steps
- [x] Step 1 (F1): `src/types.ts` — 5 new `ResolvedEntities` fields (`amountLast24h`, `sleepDisruption`, `estimatedLowTime`, `deviceType`, `substance`) + `DrinkInfo` interface + 7 new `CardController` methods (`getDrinksOfSubstance`, `drinkDaysSinceReveal`, `showRefillDialogFor`, `showLogDrinkDialog`, `logDrink`, `undoDrink`, `resetDrink`); `DrinkInfo` re-exported
- [x] Step 2 (F1): `src/ax-dose-logger-card.ts` — `_computeEntities` master + granular detection branch (attribute-based: `drink_master: True` / `device_type: "drink"`); master fields populated into existing `ResolvedEntities` shape
- [x] Step 3 (F2): `render()` granular-drink redirect placeholder pane (no nav) when `deviceType==='drink'`; substance-specific message
- [x] Step 4 (F3): `_renderPaneSelector` branches nav set by `deviceType` (master → Drinks/Graph/Inventory/Stats/Tools; medicine → Daily/Graphs/Stats/Tools/+Tracking); `_handlePaneChange` + grid-options switch + auto-fallback updated for `'drinks'`/`'inventory'` pane ids; `caffeine-panel.js` import → `drinks-panel.js` + `inventory-panel.js`; `_activePane` union type updated
- [x] Step 5 (F4): `src/components/drinks-panel.ts` (NEW, replaces `caffeine-panel.ts`) — substance header + Log Drink button → `showLogDrinkDialog` + Sleep Disruption + Estimated Low Time readout
- [x] Step 6 (F4): `_renderLogDrinkDialog` (ha-dialog grid of granular drink buttons; `button.press` on each drink's `DrinkLogButton`); `_logDrink`/`_undoDrink`/`_resetDrink` controller methods; `_showLogDrinkDialog`/`_logDrinkSubstance`/`_refillTarget` @state
- [x] Step 7 (F5): `src/components/inventory-panel.ts` (NEW) — 2-column per-granular-drink grid; col 1 clickable refill box → `showRefillDialogFor`; col 2 7-day avg + trailing-dynamic avg via `drinkDaysSinceReveal`
- [x] Step 8 (F5): `_handleRefill` generalized to use `_refillTarget?.addStockEntityId ?? entities.addRefill`; `_renderRefillDialog` header shows drink name when target set; `showRefillDialogFor` controller method
- [x] Step 9 (F6): Graph panel works for masters via F1 mapping (`amountInBody`) + backend B3 (REST master history); `_getStrengthUnit` falls back to `amountInBody`'s `unit_of_measurement` (mg/g)
- [x] Step 10 (F7): `src/components/stats-panel.ts` — 3 master rows (Amount in Last 24h, Sleep Disruption, Estimated Low Time) guarded by `if (e.x)`; medicine rows auto-skip (fields undefined)
- [x] Step 11 (F8): `src/components/tools-panel.ts` — master branch (`_renderMasterTools`): per-granular-drink Undo + Reset list, each via `openToolsDialog`; `.drink-tool-row` CSS
- [x] Step 12: `src/localize.ts` — ~22 new keys (pane.drinks/inventory, drinks.*, inventory.*, stats.amount_last_24h/sleep_disruption/estimated_low_time, tools.drinks_header/undo_drink/reset_drink + descriptors, dialog.refill.title_drink, dialog.log_drink.*); kept `pane.caffeine` + `caffeine.placeholder` one release
- [x] Step 13: `shouldUpdate` + `connectedCallback` reset updated for new dialog state + drinks/inventory tick refresh; `.log-drink-grid`/`.log-drink-btn` CSS added
- [x] Step 14: Verify — `yarn run build` clean (exit 0, no warnings); `ruff check` + `py_compile` on backend deps clean
- [x] Step 15: Memory bank update — activeContext.md (Current Status rewritten + previous archived + stray-EOF cleanup), progress.md (this section), projectstructure.md (new components in tree)

### Key decisions
1. Master + granular detection via state attributes (`drink_master: True` / `device_type: "drink"`), not suffixes — robust to suffix drift; one branch populates the master `ResolvedEntities` shape Graph/Stats already consume.
2. `button.press` for Log Drink (user-confirmed) — reuses cooldown sensor wiring + card soft-disable.
3. Refill dialog generalized (`showRefillDialogFor` + `_refillTarget`), not duplicated — one dialog surface, medicine + drinks callers.
4. Trailing-dynamic avg reuses medicine reveal logic via `drinkDaysSinceReveal` (reads `history_start_date` on the 365-day avg sensor) + existing `stats.avg_running`/`stats.avg_yearly` keys.
5. Master nav = Drinks | Graph | Inventory | Stats | Tools (user-confirmed); Tools kept with per-granular-drink Undo/Reset (user-confirmed Option B).
6. Amount-in-body line graph kept for masters (user-confirmed) — recorder has history for the renamed master sensor; bar graph reads aggregated master history via backend B3.
7. Granular drink → redirect placeholder (user-confirmed) — no half-empty medicine card.
8. Translation-only master rename (backend B2) + attribute-based frontend mapping — stable unique_ids preserved (no registry migration); frontend maps master body-mass sensor into `amountInBody` by `drink_master: True` + `pk_model` attrs.
9. `_getStrengthUnit` fallback to `amountInBody.unit_of_measurement` for masters (mg caffeine / g alcohol).
10. Plan: `plans/drinks-panel-master-tracker-plan.md` (resolved decisions: Tools=keep per-drink, Log=button.press, line graph=keep).


## Drinks Panel Layout/Style Parity with Daily Panel (2026-06-28)

### Goal
Make the Drinks (master tracker) pane match the Daily (medicine) pane for layout, font sizes, and title location, and make the Drinks title clickable to open the device-info dialog (full Daily parity, per user-confirmed scope).

### Checklist
- [x] Plan: `plans/drinks-panel-daily-layout-parity-plan.md` (title parity + container parity + clickable-title scope)
- [x] `src/components/drinks-panel.ts` — replaced left-aligned `.drinks-header` (substance icon + 18px title span) with a centered `.drinks-title` mirroring `.med-name` (20px, weight 600, centered, no icon, `cursor: pointer`); title text = substance label (`drinks.caffeine`/`drinks.alcohol`)
- [x] Made `.drinks-title` interactive — `role="button"`, `tabindex="0"`, `aria-label` from `dialog.device_info.aria`, `@click` → `controller.showDeviceInfo()`, `@keydown` → `controller.onKeyActivate(...)` (identical to Daily `.med-name`)
- [x] Aligned `.pane-drinks` container with `.pane-daily` — `gap` 16px→12px, dropped `padding: 8px 4px;`
- [x] Removed unused `substanceIcon` local + `.drinks-header ha-icon` CSS rule
- [x] `README.md` — added bullet to 🥤 Drinks pane section noting the centered substance title matches Daily's medication name in size/weight/placement and opens the device-info dialog on tap
- [x] Verify — `yarn run build` clean (exit 0, no warnings)
- [x] Memory bank update — activeContext.md (Current Status rewritten + new What Was Changed subsection + prior status archived under Previous Context), progress.md (this section). projectstructure.md unchanged (no files added/renamed/deleted; only edits to existing drinks-panel.ts + README + dist).

### Key decisions
1. **Title is the substance label, not the device name** — Daily's `.med-name` shows the medication name; the Drinks master has no single "drink name" string, so the substance label (`drinks.caffeine` / `drinks.alcohol`) is the natural centered title. Keeps the visual treatment identical to `.med-name` without introducing a new data source.
2. **Leading substance icon dropped for parity** — `.med-name` has no icon. Removing `mdi:coffee`/`mdi:glass-wine` from the title row makes the two panes' title treatments pixel-for-pixel consistent. The icon was decorative only (the label already conveys the substance).
3. **Clickability in scope (user-confirmed)** — Originally planned as visual-only parity; the user confirmed the Drinks title should also open the device-info dialog to fully match Daily. Reuses the existing `controller.showDeviceInfo()` + `controller.onKeyActivate()` controller surface (no new controller method needed).
4. **Container gap/padding parity** — `.pane-daily` is `column; gap: 12px;` with no padding. `.pane-drinks` was `column; gap: 16px; padding: 8px 4px;`. Tightening to 12px + dropping the padding aligns vertical rhythm between the two panes.
5. **Drinks-specific body content untouched** — `.log-drink-btn`, `.sleep-row`, `.sleep-cell`, `.sleep-label`, `.sleep-value` are Drinks-only content (no Daily equivalent), so they are out of the "same layout and style as Daily" scope and were left as-is.
6. **Frontend-only, CSS+template** — no backend, localization-key, or controller-surface changes (the title reuses existing `dialog.device_info.aria` + `showDeviceInfo`/`onKeyActivate`).


## Drinks Pane Full Layout/Style Parity with Daily Pane (2026-06-28)

### Goal
Make the Drinks (master tracker) pane mirror the Daily (medicine) pane layout exactly — same two-column `.daily-main` row, same tinted-primary button style, same `.stat-pill` box transparency and font sizes, same centered clickable title — but with caffeine/alcohol-relevant boxes (Log Drink button left; In Body + Sleep Disruption right).

### Checklist
- [x] Plan: `plans/drinks-panel-daily-layout-parity-plan.md` (full two-column parity + Estimated Low Time removal decision)
- [x] `src/components/drinks-panel.ts` — full body rewrite: `.daily-main` flex row with LEFT `.log-drink-btn.safe` (styled verbatim like Daily's `.take-pill-btn.safe`: 28px icon + 18px weight-550 label, rgba primary 0.12 bg / 0.2 hover, `:active` scale 0.96, `flex: 1`) + RIGHT `.stats-column` (flex 1, gap 10px) with 2 `.stat-pill` boxes
- [x] Top right box **In Body** — `mdi:chart-bell-curve` + `stats.amount_in_body` label + `getState(amountInBody) + ' ' + getStrengthUnit(e)` value (mg/g; `daily.na` fallback)
- [x] Bottom right box **Sleep Disruption** — `mdi:bed-clock` + `drinks.sleep_disruption` label + title-cased `entities.sleepDisruption` state (`daily.na` fallback)
- [x] Both boxes clickable → `controller.openMoreInfo(entityId)` with `role="button"`/`tabindex="0"`/`aria-label`/`@click`/`@keydown`→`controller.onKeyActivate(...)` (identical accessibility wiring to Daily clickable stat-pills; gated on entity existing)
- [x] Copied Daily's `.daily-main`/`.stats-column`/`.stat-pill`/`.stat-pill ha-icon`/`.stat-label`/`.stat-value` CSS verbatim into drinks-panel.ts `static styles` (rgba primary 0.06 bg, 0.12 hover, 15px uppercase label, 18px weight-600 value, 20px primary-tinted icon) — pixel-identical transparency + font sizes
- [x] Removed old `.log-drink-btn` solid-filled style + `.sleep-row`/`.sleep-cell`/`.sleep-label`/`.sleep-value` CSS rules + the `formatTime`/`formatDateTime` import (only used by the deleted Estimated Low Time cell)
- [x] Removed Estimated Low Time cell from the Drinks pane (user-confirmed: keep strictly 2 right boxes, identical to Daily); `entities.estimatedLowTime` + backend `_computeEntities` detection + Stats pane row unchanged
- [x] `src/localize.ts` — removed orphaned `drinks.estimated_low` key; `stats.estimated_low_time` retained (Stats panel still uses it)
- [x] `README.md` — rewrote 🥤 Drinks pane section to describe the two-column layout + the Estimated Low Time → Stats pane move
- [x] Verify — `yarn run build` clean (exit 0, no warnings) after the drinks-panel.ts rewrite and again after the localize.ts edit
- [x] Memory bank update — activeContext.md (Current Status rewritten for full layout parity + new What Was Changed subsection + prior title-only parity demoted), progress.md (this section). projectstructure.md unchanged (no files added/renamed/deleted).

### Key decisions
1. **Two-column `.daily-main` parity** — Daily's main row is a flex pair: `.take-pill-btn` (left, `flex: 1`) + `.stats-column` (right, `flex: 1`, gap 10px, two `.stat-pill` boxes). The Drinks pane now uses the identical structure, with the Log Drink button as the left `flex: 1` element and In Body / Sleep Disruption as the two right `.stat-pill` boxes.
2. **Log Drink button uses `.take-pill-btn.safe` styling, not a solid fill** — The prior Drinks pane used a solid `var(--primary-color)` background button. Daily's Take Pill button is a tinted translucent primary (`rgba primary 0.12`, primary-color text). Switching to the tinted style makes the two panes' primary action buttons visually consistent.
3. **Box transparency + fonts copied verbatim** — `.stat-pill` bg `rgba(--rgb-primary-color, 0.06)`, hover 0.12, no border; `.stat-label` 15px uppercase letter-spaced 0.5px; `.stat-value` 18px weight-600 `margin-left: auto`; `.stat-pill ha-icon` 20px primary opacity 0.7. Copied rule-for-rule from `daily-panel.ts` so the boxes are pixel-identical to Daily's Safe to Take / Pills Left boxes.
4. **In Body value = state + substance unit** — Matches the Stats pane's `stats.amount_in_body` row format (`getState(amountInBody) + ' ' + getStrengthUnit(e)`). `getStrengthUnit` already falls back to `amountInBody.unit_of_measurement` for masters (mg caffeine / g alcohol).
5. **Sleep Disruption title-cased** — First letter uppercased, rest unchanged (matches the swapped Safe-to-Take box convention from `daily-panel.ts`). Handles `none`→`None`, `low`→`Low`, etc. without over-transforming underscored states.
6. **Boxes clickable → more-info** — Mirrors the Daily clickable stat-pills (`role="button"`, `tabindex="0"`, `aria-label`, `@click`/`@keydown`→`onKeyActivate`→`openMoreInfo`). Reuses existing controller methods; no new surface. Gated on the entity existing so a missing sensor renders a non-clickable box instead of a broken handler.
7. **Estimated Low Time removed from Drinks pane (user-confirmed)** — Daily has exactly 2 right boxes, so the third Drinks cell was removed to keep the layout identical. The info is preserved in the Stats pane (which already renders an Estimated Low Time row from `entities.estimatedLowTime`), so no data is lost — only the Drinks-pane duplicate. Backend detection + `ResolvedEntities.estimatedLowTime` unchanged.
8. **Orphaned localize key removed** — `drinks.estimated_low` had no remaining references after the cell deletion; removed to keep the localize map clean. `stats.estimated_low_time` retained (Stats panel still references it).
9. **Frontend-only** — no backend, controller-surface, or new localize keys. Reuses `controller.openMoreInfo` / `onKeyActivate` / `showDeviceInfo` / `getStrengthUnit` / `showLogDrinkDialog` and existing `stats.amount_in_body` / `drinks.sleep_disruption` / `daily.na` / `dialog.device_info.aria` keys.


## Drinks Pane Label/Icon/Decimal Refinements (2026-06-28)

### Goal
The two right-column boxes on the Drinks pane both wrapped to two lines (stretching the card) because their labels were too long for the narrow right column. Shorten the labels, swap the sleep icon, and round the In Body value to a whole number on the card. Companion backend change: master body-mass sensor rounds to 1 decimal (was 2).

### Checklist
- [x] `src/components/drinks-panel.ts` — In Body box label key `stats.amount_in_body` → `drinks.in_body` ("In Body"); In Body value rounded to 0 decimals via `Math.round(parseFloat(rawBody))` (raw-string fallback if non-numeric); Sleep Disruption box icon `mdi:bed-clock` → `mdi:sleep`; label key `drinks.sleep_disruption` → `drinks.disruption` ("Disruption"); aria-labels updated to the new keys
- [x] `src/localize.ts` — added `drinks.in_body` = 'In Body' + `drinks.disruption` = 'Disruption' (after `drinks.log_drink`); `stats.amount_in_body` + `drinks.sleep_disruption` retained
- [x] `README.md` — 🥤 Drinks right-box bullet updated ("In Body" notes whole-number rounding; "Sleep Disruption" → "Disruption")
- [x] Backend companion: `custom_components/ax_dose_logger/sensors/drink_master.py` `round(data.body_mass, 2)` → `round(data.body_mass, 1)` (master body-mass sensor stores 1 decimal; other HA UIs follow that)
- [x] Verify — `yarn run build` clean (exit 0, no warnings); `python3 -m py_compile custom_components/ax_dose_logger/sensors/drink_master.py` OK
- [x] Memory bank update — frontend activeContext.md (Current Status rewritten + new What Was Changed subsection + prior full-layout-parity demoted to Prior) + this progress section; backend activeContext.md + progress.md updated for the drink_master.py decimal change

### Key decisions
1. **Shorter labels, not smaller font** — The two-line wrap was caused by label length ("AMOUNT IN BODY", "SLEEP DISRUPTION") in the narrow right column, not by font size. Shortening to "IN BODY" / "DISRUPTION" keeps Daily-verbatim font sizes (15px uppercase label, 18px weight-600 value) while fitting on one line, so the card height matches Daily.
2. **New `drinks.*` keys, not reusing `stats.*`** — `stats.amount_in_body` ("Amount in Body") is still used by the Stats pane row, so a separate shorter `drinks.in_body` ("In Body") avoids changing the Stats pane label. Same for `drinks.disruption` vs `drinks.sleep_disruption` (the latter retained for any aria/Stats references).
3. **Card rounds to 0 decimals; backend stores 1 decimal (user-confirmed split)** — The In Body box shows `Math.round(parseFloat(state))` for a clean integer; the backend master body-mass sensor now stores 1 decimal (`round(data.body_mass, 1)`), so more-info / dashboards / recorder history show 1 decimal. This preserves sub-integer precision in the data while keeping the card compact.
4. **`mdi:sleep` icon** — Per user request, replaces `mdi:bed-clock` on the Sleep Disruption box. Purely cosmetic; the box still opens the sleep-disruption sensor's more-info dialog on tap.
5. **Frontend + backend in one task** — The decimal change spans both repos (frontend display rounding + backend sensor rounding). Both repos' memory banks cross-reference.

## Drinks Pane Log Drink Button — Substance-Aware Icon + Last Counter (2026-06-28)

### Planning
- [x] Inspect `src/components/drinks-panel.ts` (current Log Drink button: hardcoded `mdi:plus-circle-outline`, no sub-line)
- [x] Inspect `src/components/daily-panel.ts` (reference `.take-pill-btn` icon + `.take-sub` "Last" pattern)
- [x] Confirm `computeTimeSinceLastDose(e)` works for drink masters (resolver maps `entities.lastDose` from the pk_model body-mass sensor's `last_dose_time` attribute at `ax-dose-logger-card.ts:308`)
- [x] Confirm `daily.last` localize key already exists; no new key needed
- [x] Confirm icon is a pure default per user direction (no config schema change yet)

### Implementation
- [x] `src/components/drinks-panel.ts` — render body: add `logDrinkIcon` local (alcohol → `mdi:glass-mug-variant`, else `mdi:coffee`) + `timeSince = c.computeTimeSinceLastDose(e)`
- [x] `src/components/drinks-panel.ts` — template: `<ha-icon icon="${logDrinkIcon}">` replaces `mdi:plus-circle-outline`; add `.take-sub` "Last: {timeSince}" line beneath `.take-label`
- [x] `src/components/drinks-panel.ts` — CSS: add `.take-sub` (16px+offset, weight 450, opacity 0.9) + `.take-sub-segment` (nowrap) verbatim from `daily-panel.ts`

### Verification
- [x] `yarn run build` — clean (exit 0, no warnings); `dist/ax-dose-logger-card.js` rebuilt

### Documentation
- [x] `memory-bank/activeContext.md` — Current Status + What Was Changed + Files Modified + Key Design Decisions updated; prior status archived
- [x] `memory-bank/progress.md` — this section added
- [x] No `README.md` change (small visual refinement within an existing pane; no end-user install/config change)
- [x] No `projectstructure.md` change (no file added/removed/renamed)

### Key decisions
1. **Substance-aware default icon, not user-configurable (yet)** — `mdi:coffee`/`mdi:glass-mug-variant` keyed off `e.substance`. A future `log_drink_icon` config override mirroring `take_pill_icon` is planned; the local is structured so that swap is a one-line `${c.config?.log_drink_icon || logDrinkIcon}` change.
2. **Reuse `computeTimeSinceLastDose` + `entities.lastDose`, no backend change** — The resolver already maps `entities.lastDose` for drink masters from the pk_model body-mass sensor's `last_dose_time` attribute, so the Daily pane's controller helper works unchanged in the Drinks pane.
3. **Reuse `daily.last` localize key** — Keeps the strings file lean and produces byte-identical "Last: …" text to the Daily pane.
4. **Single-segment sub-line (no Next/Overdue)** — Drink masters have no schedule concept, so the sub-line is the single "Last: …" segment, matching the Daily pane's simplest branch.
5. **CSS copied verbatim from `daily-panel.ts`** — `.take-sub` + `.take-sub-segment` are byte-identical for pixel-identical visual treatment.
6. **Frontend-only** — No backend/Python changes; the required attribute already exists.


## Drinks Pane "Last" Never Bug — Master Last-Dose Sensor Retarget (2026-06-28)

### Goal
After the substance-aware icon + "Last" sub-line was added to the Drinks pane Log Drink button, the "Last" counter showed "Never" for Master Tracker devices. Root cause: `computeTimeSinceLastDose` reads `entities.lastDose`'s **state** as a timestamp, but the resolver mapped `lastDose` for masters to the **body-mass sensor** (whose state is a number like `42.3`, not a timestamp — `last_dose_time` lived only as an **attribute** on that sensor). `new Date("42.3")` is invalid → "Never". Fix per HA best practice: add a dedicated backend `SensorDeviceClass.TIMESTAMP` sensor (`DrinkMasterLastDoseSensor`) whose state IS the master `last_dose_time`, then retarget the frontend resolver to it.

### Checklist
- [x] Diagnose: `_computeTimeSinceLastDose` reads state, not attributes; master `lastDose` resolved to body-mass sensor (number state) → "Never"
- [x] Confirm HA best practice: one entity = one semantic concept; TIMESTAMP device class for timestamp facts (mirrors medicine `PillLastDoseSensor`)
- [x] Backend: new `custom_components/ax_dose_logger/sensors/drink_master_last_dose.py` + registration in `sensor.py` + translation keys + remove redundant `last_dose_time` attribute from `drink_master.py` (tracked in the backend repo's memory bank)
- [x] Frontend: `src/ax-dose-logger-card.ts` `_computeEntities` master branch — `result.lastDose` now mapped by entity-id suffix (`.drink_master_last_dose_caffeine` / `_alcohol`); dropped the body-mass `last_dose_time`-attribute fallback; `result.totalDoses` (via `dose_count` attr) unchanged
- [x] Verify — `yarn run build` exit 0, clean; `dist/ax-dose-logger-card.js` rebuilt
- [x] Verify — backend `python3 -m py_compile` + `hass -c ./config --script check_config` exit 0 (tracked in the backend repo)
- [x] Memory bank update — frontend activeContext.md (Current Status + What Was Changed + Files Modified + Key Design Decisions updated to reflect the retarget) + this progress section; backend activeContext.md + progress.md + projectstructure.md updated (cross-referenced)

### Key decisions
1. **Resolver retarget by entity-id suffix, not a `deviceType` branch** — `result.lastDose` is mapped by `.drink_master_last_dose_caffeine` / `_alcohol` suffix, identical to the existing `sleep_disruption` / `estimated_low_time` suffix matches. No `deviceType === 'drink_master'` special-case leaked into the generic `computeTimeSinceLastDose` helper.
2. **`computeTimeSinceLastDose` unchanged** — The Daily pane's helper is reused as-is; the only fix was making `entities.lastDose` point at a real TIMESTAMP state for masters. No master-specific logic added to the frontend.
3. **HA best practice drove the backend sensor** — The "Never" bug exposed an anti-pattern (reading a timestamp from an attribute of a non-timestamp entity). The HA-correct fix is a dedicated `SensorDeviceClass.TIMESTAMP` entity (one entity = one semantic concept; state-as-data, attributes-as-metadata), giving locale-aware more-info + history + standard state parsing for free. See the backend repo's memory bank for the full rationale.
4. **Frontend + backend in one task** — The fix spans both repos. Both repos' memory banks cross-reference.

## Sleep Disruption Pop-up Card (2026-07-06)
**Goal**: Pressing the Disruption box in the Drinks pane (Master Tracker card) opens a substance-aware pop-up with the curated Sleep Disruption description (markdown), replacing the native HA more-info dialog.

### Steps completed
- [x] Inspect Drinks pane ([`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)) + the card's existing dialog infrastructure (`ha-dialog`, `_showLogDrinkDialog`, `_toolsDialog`, view-entry reset, `_persistStates` array).
- [x] Draft plan in [`plans/sleep-disruption-popup-plan.md`](plans/sleep-disruption-popup-plan.md).
- [x] Add localize keys in [`src/localize.ts`](src/localize.ts): `dialog.sleep_disruption.title`, `dialog.sleep_disruption.close`, `dialog.sleep_disruption.caffeine` (markdown via array-literal `.join('\n')`), `dialog.sleep_disruption.alcohol` (markdown via array-literal `.join('\n')`).
- [x] Add `showSleepDisruptionDialog(substance: 'caffeine' | 'alcohol'): void` to the `CardController` interface in [`src/types.ts`](src/types.ts).
- [x] Add `_showSleepDisruptionDialog` + `_sleepDisruptionSubstance` `@state` fields, public `showSleepDisruptionDialog`, private `_renderSleepDisruptionDialog` (ha-dialog + ha-markdown + Close action bar), render-chain wiring, view-entry reset, and `_persistStates` entries in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts).
- [x] Swap the Drinks pane Disruption box `@click` + `@keydown` handlers from `c.openMoreInfo(e.sleepDisruption!)` → `c.showSleepDisruptionDialog(substance!)` (guarded on `e.sleepDisruption && substance`) in [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts).
- [x] Verify: `cd /workspaces/lovelace-pill-logger-card && yarn run build` — exit 0, no warnings.
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) + [`memory-bank/progress.md`](memory-bank/progress.md).

### Key decisions
1. **Replace more-info, don't stack dialogs** — The native more-info only showed raw sensor attributes; the curated markdown description is the value the user asked for. more-info is still reachable from the In Body box + HA's entity registry, so no functionality is lost.
2. **`ha-markdown` for rich content (HA standard)** — The description uses bold + bullets; `ha-markdown` is HA's native markdown element, globally registered in Lovelace (no import needed, same as `ha-icon`/`ha-dialog` already used in this card).
3. **Substance passed as a method argument, no new entity lookups** — The Drinks pane already computes `substance = e.substance` from the resolver; it's passed straight into `showSleepDisruptionDialog(substance)`.
4. **Markdown stored as array-literal `.join('\n')` in the localize map** — Keeps all user-facing text in [`src/localize.ts`](src/localize.ts) (the card's single-string-map convention) and satisfies the `Record<string, string>` type without escaping headaches.
5. **`width="small"` + `.custom-action-bar` + `.dialog-header`** — Matches the device-info / tools / override dialogs exactly.
6. **No backend / coordinator / store / migration changes** — Pure presentational frontend change; `should_poll`-irrelevant.
7. **No README change** — Card UI tweak, not a user-facing feature/installation change per the README update rule.


---

## Inventory Panel — Visual Parity with Daily/Drinks + Drink/Master Entity Classifier "-" / N/A Fix (2026-07-06)

**Goal**: (1) Fix the Master Tracker Inventory panel showing `-` for the stock count + 7-day avg + trailing-dynamic avg, the Drinks-pane Disruption N/A, and the Drinks-pane Last "Never" (all one bug class). (2) Bring the Inventory panel's card styling into visual parity with the Daily and Drinks panes.

### Steps completed
- [x] Read frontend memory bank ([`memory-bank/activeContext.md`](memory-bank/activeContext.md)) + inspect the Inventory/Daily/Drinks panel sources ([`src/components/inventory-panel.ts`](src/components/inventory-panel.ts), [`src/components/daily-panel.ts`](src/components/daily-panel.ts), [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)).
- [x] Inspect backend drink number/avg/button unique_ids + translations: [`custom_components/ax_dose_logger/number.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/number.py) (`_drink_stock`, `_drink_add_stock`), [`sensors/drink_avg_doses.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/drink_avg_doses.py) (`_drink_avg_{window_days}`), [`button.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/button.py) (`_log_drink`, `_undo`, `_reset`), [`strings.json`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/strings.json) (translated names "Inventory", "Add Stock", "Avg Daily Drinks (N Days)", "Log Drink", "Undo Drink", "Reset History").
- [x] Confirm HA entity-id generation rule: `entity_id = slugify(translated_name)` via [`async_generate_entity_id`](../../usr/src/homeassistant/homeassistant/helpers/entity.py:114) + [`util.slugify`](../../usr/src/homeassistant/homeassistant/util/__init__.py:39) — NOT derived from `unique_id`.
- [x] Identify root cause of the `-` / N/A bug: [`_getDrinksOfSubstance`](src/ax-dose-logger-card.ts:632) + the `_computeEntities` master branch classified entities by `entity_id` suffix, but the suffixes are `unique_id` stems; the name-derived entity_ids never match (e.g. `number.coffee_inventory` has no `_drink_stock` suffix; `sensor.caffeine_tracker_sleep_disruption` has no `.sleep_disruption_caffeine` suffix). Only `DrinkLogButton` matched by coincidence ("Log Drink" → `log_drink`).
- [x] Identify the visual misalignment: Inventory `.stat-pill`/`.avg-cell` used `--card-background-color` + `1px border` + `14px 16px`/`10px` + `24px` icon (no opacity) + `16px/700` value + non-uppercase label, diverging from the Daily/Drinks primary-tinted `rgba(rgb-primary, 0.06)` transparency baseline.
- [x] Draft architecture plan in [`plans/inventory-panel-parity-and-sensor-fix-plan.md`](plans/inventory-panel-parity-and-sensor-fix-plan.md).
- [x] Confirm the uppercase-label design decision with the user: **keep the drink name in natural case** ("Coffee", "Espresso") via a per-element `text-transform` override; inherit all other Daily/Drinks label styling.
- [x] **First fix attempt (FAILED)**: add `unique_id?: string` to `AxDoseLoggerHass.entities` + switch `_getDrinksOfSubstance` to `entityInfo.unique_id?.endsWith(...)`. Build clean, but live test showed everything WORSE (Log Drink popup buttons unpressable, refill boxes non-clickable, all values still `-`).
- [x] Diagnose the failed fix: `unique_id` is NOT present on the frontend `hass.entities` map — HA's `config/entity_registry/list_for_display` websocket populates it from `_as_display_dict` ([`entity_registry.py:265`](../../usr/src/homeassistant/homeassistant/helpers/entity_registry.py:265)), which emits only `ei`+`pl`+display fields, OMITTING `unique_id`. So `entityInfo.unique_id` was always `undefined` → every `uid.endsWith(...)` failed.
- [x] Identify the correct fix: classify by a backend `role` STATE ATTRIBUTE (present on `hass.states[entityId].attributes`, integration-controlled, survives renames — proven by `device_type`/`substance`/`pk_model`).
- [x] Confirm the cross-repo (backend `role` attributes + frontend reclassify) scope with the user.
- [x] REVERT the failed `unique_id` type addition in [`src/types.ts`](src/types.ts) (net change: none).
- [x] Switch `_getDrinksOfSubstance` classification to `this._getAttr(entityId, 'role')` (+ `window_days` for avg 7/365) in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts).
- [x] Replace the 4 broken entity_id suffix matches in the `_computeEntities` master branch (`sleepDisruption`/`estimatedLowTime`/`lastDose`/`amountLast24h`) with `role` attribute matches in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts).
- [x] Backend companion: add `role` attribute to 10 entities in [`number.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/number.py), [`button.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/button.py), [`drink_avg_doses.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/drink_avg_doses.py), [`drink_master_sleep_disruption.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/drink_master_sleep_disruption.py), [`drink_master_last_dose.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/drink_master_last_dose.py), [`drink_master_daily_amount.py`](../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/drink_master_daily_amount.py) (see backend repo memory bank).
- [x] Rewrite the Inventory panel static styles in [`src/components/inventory-panel.ts`](src/components/inventory-panel.ts) to the Daily/Drinks parity baseline (primary-tinted transparency, no border, `12px 14px`/`8px`, `20px` icon at `opacity: 0.7`, `18px/600` value) with the natural-case `.stat-label` override; preserve the 2-column `.inv-row` grid + 380px responsive fallback.
- [x] Verify: `python3 -m py_compile` on all 6 backend files (ALL PY OK) + `yarn run build` (exit 0, no warnings).
- [x] Update both repos' [`memory-bank/activeContext.md`](memory-bank/activeContext.md) + [`memory-bank/progress.md`](memory-bank/progress.md).

### Key decisions
1. **Classify by a backend `role` STATE ATTRIBUTE, not `entity_id` suffix and not `unique_id** — Two matching keys were tried: (a) `entity_id` suffix — HA derives `entity_id` from `slugify(translated_name)`, and every entity sets `_attr_has_entity_name = True`, so the entity_id is the slugified name (`DrinkStockNumber` → `number.coffee_inventory`, no `_drink_stock` suffix) — the old suffix match silently missed every entity except `DrinkLogButton` (coincidental `log_drink` slug). (b) `entityInfo.unique_id` — NOT present on the frontend `hass.entities` map (`list_for_display` websocket omits it via `_as_display_dict`); the first fix's `unique_id` switch made everything worse. State attributes ARE present on `hass.states[entityId].attributes`, integration-controlled, and survive renames — the HA-correct, robust key. Stored `DrinkInfo`/`ResolvedEntities` fields stay as `entity_id`s; only the matching key changes.
2. **One resolver fix repairs five symptoms** — The `role`-based classification fixes the Inventory `-` (stock + 7-day avg + trailing-dynamic avg), unblocks `drinkDaysSinceReveal`, repairs the Drinks-pane Disruption N/A + Last "Never" (master `_computeEntities` suffix matches were the same bug class), restores the master Amount-in-24h Stats row, AND silently repairs the Tools panel's Undo/Reset. No per-panel fork.
3. **Visual parity via verbatim Daily/Drinks CSS + one per-element case override** — `.stat-pill`/`.stat-label`/`.stat-value` adopted the Daily/Drinks baseline; the 2-column `.inv-row` grid + responsive fallback preserved; `.avg-cell` adopts the same primary-tinted surface.
4. **Natural-case drink-name label (user-confirmed 2026-07-06)** — `.stat-label` omits `text-transform: uppercase` because col-1's label is a proper-noun drink name, unlike Daily's generic "SAFE TO TAKE"/"PILLS LEFT". All other Daily/Drinks label styling inherited.
5. **Backend `role` attribute is additive, no migration** — Set in `_attr_extra_state_attributes`; existing entries gain it on next HA restart. No entity-registry / unique_id / translation / stored-data-shape change.
6. **README NOT updated** — UI tweak + silent bug fix; no new user-facing feature/installation step per the README update rule.
7. **Document the failed unique_id attempt to prevent recurrence** — The `unique_id` switch is a tempting-but-wrong approach that "looks" like HA best practice but fails because the frontend entity-registry display dict omits `unique_id`. The memory bank + plan explicitly record this so the same mistake isn't repeated on future classifier work.


---

## Tools Panel — Box Style Parity with Daily/Drinks Cards (2026-07-06)

**Goal**: Make the boxes in the Tools panel share the same surface/UI style as the `.stat-pill` boxes in the Daily and Drinks panes (primary-tinted transparency, no border, matching icon/typography treatment, matching hover), so the card has one consistent "box" vocabulary across all panes.

### Steps completed
- [x] Read frontend memory bank ([`memory-bank/activeContext.md`](memory-bank/activeContext.md)) + inspect the Daily/Drinks/Tools panel sources ([`src/components/daily-panel.ts`](src/components/daily-panel.ts), [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts), [`src/components/tools-panel.ts`](src/components/tools-panel.ts)).
- [x] Identify the visual mismatch: Tools `.tool-btn` used `--card-background-color` solid fill + `1px border` + `24px` icon (no opacity) + `0.06` hover WITH a primary `border-color` change; `.drink-tool-row` used the same solid-card + border pattern. Daily/Drinks `.stat-pill` use primary-tinted `rgba(rgb-primary, 0.06)` transparency, no border, `20px` icon at `opacity: 0.7`, `0.12` hover.
- [x] Draft architecture plan in [`plans/tools-panel-box-style-parity-plan.md`](plans/tools-panel-box-style-parity-plan.md).
- [x] Confirm the interpretation decision with the user: **align the SURFACE only** (background, border, icon size/opacity, hover, container spacing); preserve the column action-button layout (icon over label, no value slot); give `.danger` buttons an error-tinted surface.
- [x] Restyle `.tools-panel` container: drop `padding: 8px 4px;`, `gap: 16px` → `12px` (Daily/Drinks container parity).
- [x] Restyle `.tool-btn`: `background` → `rgba(rgb-primary, 0.06)`, `border: 1px solid divider` → `border: none`, `padding: 14px 8px` → `12px 14px`; drop `border-color` from the transition list (keep `background` + `transform`). Column action-button layout preserved.
- [x] Restyle `.tool-btn ha-icon`: `--mdc-icon-size: 24px` → `20px`, add `opacity: 0.7`.
- [x] Restyle `.tool-btn:hover`: `0.06` → `0.12` bg; drop the `border-color` rule (no border to color).
- [x] Add `.tool-btn.danger` base (`background: rgba(rgb-error, 0.06)`) + `.tool-btn.danger ha-icon` (`color: error-color`) + `.tool-btn.danger:hover` (`background: rgba(rgb-error, 0.12)`) — error-tinted equivalent of the primary surface, mirroring Daily's `.take-pill-btn.danger` semantic.
- [x] Restyle `.drink-tool-row` (Master Tracker per-drink rows): `--card-background-color` → `rgba(rgb-primary, 0.06)`, drop the `1px solid divider` border. Keep `border-radius`, `padding`, `flex-wrap`.
- [x] Verify `.drink-tool-btn` (Master Tracker mini Undo/Reset buttons) inherits the new surface automatically — they carry both `tool-btn` and `danger` classes (render lines 123/129), so the `.tool-btn` + `.tool-btn.danger` rules apply; the `.drink-tool-btn` override only adjusts row layout + 20px icon, unchanged.
- [x] Build: `yarn run build` in `/workspaces/lovelace-pill-logger-card` — exit 0, no warnings.
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) + [`memory-bank/progress.md`](memory-bank/progress.md).

### Key decisions
1. **Align the SURFACE, preserve the column action-button layout (user-confirmed)** — Tools boxes are action buttons (icon over label, no value), unlike Daily/Drinks stat-pills (row: icon + label + value). The user-confirmed interpretation: share the surface (background, border, icon, hover, container spacing), NOT force the buttons into a row with an empty value slot. The card now has one consistent "box" vocabulary; the action-button purpose is preserved.
2. **`.danger` uses the error-tinted equivalent of the primary surface** — Resting `rgba(rgb-error, 0.06)`, hover `0.12`, error-colored icon. Mirrors Daily's `.take-pill-btn.danger` semantic (error tint at half the take-pill fill strength for the resting state). Danger buttons are still the same "box vocabulary", just tinted with the error color.
3. **CSS-only change; render/TS logic untouched** — No backend / coordinator / store / localize / types / config-flow change. No entity, no config field, no translation affected.
4. **Master-tracker `.drink-tool-row` follows the same surface treatment** — The per-granular-drink row container now uses the primary-tinted 0.06 surface with no border, matching the rest of the card. The mini Undo/Reset buttons inside inherit via `.tool-btn` + `.tool-btn.danger`.
5. **README NOT updated** — A visual style tweak introduces no new user-facing feature, entity, config field, or installation step per the README update rule (same decision as the Inventory parity pass).
6. **No projectstructure.md change** — No files added, renamed, deleted, or repurposed.


---

## Inventory Panel Box Height Parity with Stats Panel (2026-07-06)

**Goal**: Make the boxes in the Inventory panel the same height as the boxes in the Stats panel.

### Steps completed
- [x] Read frontend memory bank ([`memory-bank/activeContext.md`](memory-bank/activeContext.md)) + inspect the Inventory and Stats panel sources ([`src/components/inventory-panel.ts`](src/components/inventory-panel.ts), [`src/components/stats-panel.ts`](src/components/stats-panel.ts)).
- [x] Root-cause the height mismatch: Inventory `.inv-row` is a 2-column CSS grid with default `align-items: stretch`. Col-2 `.avg-cell` stacks two `.avg-line` rows (7-day avg + trailing-dynamic avg) at 18px value + `padding: 12px 14px` + `gap: 6px` → ~84px natural height; col-1 `.stat-pill` stretches to that ~84px. Stats `.stat-cell` (16px icon + 14px label header + 18px value, `padding: 10px 8px`, `gap: 4px`) → ~72px natural height. Inventory boxes were ~12px taller than Stats boxes.
- [x] Draft architecture plan in [`plans/inventory-stats-box-height-parity-plan.md`](plans/inventory-stats-box-height-parity-plan.md).
- [x] Confirm the interpretation decision with the user: **compress the `.avg-cell` to fit the Stats height** (reduce avg-value 18px→16px, padding 12px→10px, gap 6px→4px so both Inventory boxes shrink to ~72px matching Stats). Rejected alternatives: grow the Stats boxes to the taller height; set a shared explicit min-height.
- [x] Edit [`src/components/inventory-panel.ts`](src/components/inventory-panel.ts) static `styles` block (CSS only; render/TS logic unchanged): `.avg-cell` `padding: 12px 14px` → `10px 14px`, `gap: 6px` → `4px` (match Stats `.stat-cell` 10px vertical + 4px gap); `.avg-value` `font-size: calc(18px + var(--pill-text-offset, 0px))` → `calc(16px + var(--pill-text-offset, 0px))`. Updated the `.avg-cell` comment block to document the height-parity rationale. `.stat-label`/`.stat-value`/`.avg-label`/`.stat-pill`/`.inv-row` grid + 380px responsive fallback all unchanged (col-1 `.stat-pill` follows the compressed col-2 via grid stretch, no `.stat-pill` CSS change needed).
- [x] Build: `yarn run build` in `/workspaces/lovelace-pill-logger-card` — exit 0, no warnings.
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) + [`memory-bank/progress.md`](memory-bank/progress.md).

### Key decisions
1. **Compress the taller panel to match the reference, not grow the reference (user-confirmed)** — The Stats panel is the reference target; the Inventory `.avg-cell`'s two stacked lines made it the taller box. Compressing the `.avg-cell` metrics (padding/gap/value-size) to match the Stats `.stat-cell` natural height (~72px) is the content-driven approach. The col-1 `.stat-pill` follows automatically via grid `align-items: stretch` — no `.stat-pill` CSS change is required.
2. **No shared explicit min-height** — A shared `min-height` was rejected: it is a floor, not a ceiling, so it would not compress the Inventory row when content overflows, and pairing it with `max-height` + overflow would risk clipping the two-line `.avg-cell`. Matching the natural content height by tuning padding/gap/value-size keeps the box self-sizing if a long translated label ever wraps.
3. **Preserve prior Daily/Drinks visual-parity decisions** — `.stat-label`/`.stat-value` (Daily/Drinks verbatim) and `.avg-label` (13px secondary-text) stay unchanged; only the `.avg-cell` container metrics + `.avg-value` font-size are adjusted. The `.avg-value` 18px→16px is the one deviation from the earlier "sized to match `.stat-value` for visual parity" note; the height-parity goal takes precedence for col-2's two-line cell.
4. **CSS-only change; render/TS logic untouched** — No backend / coordinator / store / localize / types / config-flow change. No entity, no config field, no translation affected.
5. **README NOT updated** — A visual style tweak introduces no new user-facing feature, entity, config field, or installation step per the README update rule.
6. **No projectstructure.md change** — No files added, renamed, deleted, or repurposed.

## 14-Day Bar Graph Live Refresh
- [x] Step 1: Context grounding — read backend `views.py`, `store.py`, `coordinator.py`, `sensors/total.py`, `sensors/last_dose.py`, `sensors/drink_last_dose.py`, `sensors/drink_master_last_dose.py`; frontend `ax-dose-logger-card.ts` (`_fetchDoseHistory`, `_fetchAmountHistory`, `_fetchEffectivenessHistory`, `updated`, `shouldUpdate`, `_relevantStateChanged`, `_bucketByDay`), `components/graphs-panel.ts`
- [x] Step 2: Investigate which sensor/attribute the 14-day bar graph uses — confirmed it is fed by the custom REST endpoint `/api/ax_dose_logger/history/{device_id}`, not a sensor (medicine → `store.get_history(entry_id)`; master trackers → `store.get_drink_master(substance)`)
- [x] Step 3: Confirm the data source is reliable post-persistence-fix — `store.schedule_save_history` updates the in-memory slice synchronously before the debounced disk save; `async_take_dose` appends to `coordinator.data.dose_history` synchronously before `_save()`; the REST endpoint reads in-memory data
- [x] Step 4: Identify the root cause — frontend `updated()` only re-fetches on `_activePane` / `_activeTimeframe` / `_activeEffectivenessTimeframe`; a dose taken while the graphs pane is open updates `hass` (gated through by `shouldUpdate`/`_relevantStateChanged`) but `render()` reads the stale `this._doseHistory` → the bar for today does not increment until the user navigates away and back
- [x] Step 5: Evaluate whether a better sensor exists — no: `PillTotalSensor` is cumulative (not per-day dose events); `PillLastDoseSensor.timestamps` attribute is capped at 100 entries + pruned 365d (8 doses/day × 14d = 112 > 100 → clipped for heavy schedules) and omits strength; `DrinkMasterLastDoseSensor` has the same cap and is single-last-timestamp; HA recorder has async write latency. The REST endpoint is the correct uncapped full-history source.
- [x] Step 6: Write architecture plan — `plans/14-day-graph-refresh-fix-plan.md`
- [x] Step 7: Present findings + plan to user — approved
- [x] Step 8: Implement the fix — added an `else if (changedProperties.has('hass'))` branch in `updated()` (after the `_activeEffectivenessTimeframe` branch, inside the `if (this._activePane === 'graphs' ...)` block) that re-fetches `_fetchDoseHistory` + `_fetchAmountHistory` + `_fetchEffectivenessHistory` when a relevant entity changes while the graphs pane is open
- [x] Step 9: Build verification — `yarn run build` exit 0, no warnings (`dist/ax-dose-logger-card.js` rebuilt)
- [x] Step 10: Update memory-bank files — `activeContext.md` (new Current Status + archived prior), `progress.md` (this section)
- [ ] Step 11: No `projectstructure.md` change (no files added/renamed/deleted/repurposed); no README change (silent bug fix, not a user-facing feature/installation change)
- [ ] Step 12: No backend change (the data source was already correct)


## Low - Timestamp rename + Low - Hours Until countdown row (2026-07-09)

### Goal
Three related frontend changes to the Master Tracker (Caffeine / Alcohol) Stats panel, paired with a companion backend change (new `DrinkMasterLowHoursUntilSensor` + translation rename — see the backend repo memory bank): (1) simplify the existing "Estimated Low Time" Stats row display to `HH:MM` only (no date, no seconds); (2) add a new "Low - Hours Until" Stats row rendering the backend's new DURATION/hours countdown sensor; (3) rename the row label "Estimated Low Time" → "Low - Timestamp" so the two sensors read as a matched pair.

### Checklist
- [x] Step 1: Context grounding — read [`src/types.ts`](src/types.ts), [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) (`_computeEntities` master branch), [`src/components/stats-panel.ts`](src/components/stats-panel.ts) (Estimated Low Time row), [`src/localize.ts`](src/localize.ts); confirmed the role-based classification pattern (`masterRole === 'estimated_low_time'`) is the established approach
- [x] Step 2: Confirm HH:MM display approach — user chose **Option A** (keep `TIMESTAMP` device class on the backend sensor; the card formats `HH:MM` via `toLocaleTimeString`). Plain-string `HH:MM` (Option B) rejected — would destroy history graph + automation parsing. The backend keeps the full datetime state; the card surfaces just the time for compactness.
- [x] Step 3: [`src/types.ts`](src/types.ts) — add `lowHoursUntil?: string` to `ResolvedEntities` (entity_id of the new countdown sensor), with documenting JSDoc comment
- [x] Step 4: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — add `else if (masterRole === 'low_hours_until') result.lowHoursUntil = entityId;` branch in `_computeEntities` (the new backend `role` attribute; no suffix match needed — role-based classification is the established pattern)
- [x] Step 5: [`src/components/stats-panel.ts`](src/components/stats-panel.ts) — (a) rename the existing row label localize key `stats.estimated_low_time` → `stats.low_timestamp`; (b) change that row's display from `dt.toLocaleString()` (full date+time) → `dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })` (HH:MM 24-hour, no date, no seconds); (c) add a new "Low - Hours Until" row after it — value = `parseFloat(state) + ' h'` (e.g. "3.5 h"), `None`/`unknown`/`unavailable` → `-`, icon `mdi:timer-sand`, guarded by `if (e.lowHoursUntil)`
- [x] Step 6: [`src/localize.ts`](src/localize.ts) — rename `stats.estimated_low_time` key → `stats.low_timestamp` (value "Low - Timestamp"); add `stats.low_hours_until` (value "Low - Hours Until")
- [x] Step 7: Build verification — `yarn run build` exit 0, no warnings (`dist/ax-dose-logger-card.js` rebuilt)
- [x] Step 8: Update memory-bank — `activeContext.md` (Current Status rewritten + prior archived), `progress.md` (this section). No `projectstructure.md` change (no files added/renamed/deleted/repurposed). No README change (the rename + new row are documented in the **backend** README's Master Tracker section; the frontend README documents card config/usage, not individual sensor rows).

### Key decisions
1. **Option A (keep TIMESTAMP, card formats HH:MM) — HA best practice** — the user explicitly chose this over a plain-string `HH:MM` state. The backend keeps `SensorDeviceClass.TIMESTAMP` so the sensor state is a full tz-aware datetime (automations parse it, recorder history graphs it, HA more-info renders it locale-aware). The `HH:MM` display is a frontend card concern only (`toLocaleTimeString` with `hour12: false`). A plain-string `HH:MM` would have destroyed all of those. The new "Low - Hours Until" row is the numeric countdown for users who prefer that form.
2. **Role-based classification (no suffix match)** — the new `lowHoursUntil` field is populated by `masterRole === 'low_hours_until'` (the backend `role` state attribute), identical to the existing `estimated_low_time` / `sleep_disruption` / `last_dose` / `daily_amount` classification. No entity-id suffix match (those never match because HA slugifies the translated name, not the unique_id stem — the lesson from the prior Inventory parity fix).
3. **`HH:MM` via `toLocaleTimeString` (24-hour, no seconds)** — `hour12: false` forces 24-hour "14:32" rather than locale-dependent "2:32 PM"; `hour: '2-digit', minute: '2-digit'` drops seconds + the date. The full datetime remains in the sensor state for HA more-info + history + automations; only the card display is compacted.
4. **`None`/`unknown`/`unavailable` → `-`** — the Low - Hours Until row mirrors the Low - Timestamp row's `-` fallback for unknown/unavailable states; additionally treats the literal string `'None'` as `-` (the backend emits `None` as the state when the body-mass is already in Low or below, since no countdown is needed).
5. **No frontend README change** — the frontend README documents card config/usage (YAML/visual editor, configuration options), not individual sensor rows. The rename + new sensor are user-facing entity/documentation changes that belong in the **backend** README's Master Tracker section (updated there).

## Predictive Low Timestamp in Log Drink Popup (2026-07-09)

**Goal:** Show a per-drink predictive "Low: hh:mm" line under each drink name in the Log Drink popup, so the user can abort a drink based on its predicted sleep impact before pressing it. Paired with a companion backend change (new `GET /api/ax_dose_logger/predict_low` REST endpoint + `DrinkMasterCoordinator.predict_low_time_if_dose` what-if method — see the backend repo memory bank).

### Steps completed
- [x] Step 1: Add localize strings `dialog.log_drink.predicted_low` ("Low") + `dialog.log_drink.predicted_low_dash` ("Low: —") in [`src/localize.ts`](src/localize.ts)
- [x] Step 2: Add `@state _drinkLowPredictions: Record<string, string | null> = {}` (keyed by `logButtonEntityId`) + `@state _predictLowToken` race-guard in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)
- [x] Step 3: Add `_fetchDrinkLowPredictions(substance)` — called from `showLogDrinkDialog`; resets predictions on open, fires parallel `hass.callApi('GET', 'ax_dose_logger/predict_low?entity_id=...')` per drink, discards stale results via the token, logs failures without breaking UX
- [x] Step 4: Update `_renderLogDrinkDialog` to render `<span class="log-drink-name">` + `<span class="log-drink-low">` under each drink button; `formatLow(entityId)` formats the ISO as `HH:MM` (24-hour via `toLocaleTimeString`, matches Stats panel), "Low: —" for null, "Low: …" while loading; close handler clears predictions + bumps the token
- [x] Step 5: Add `.log-drink-name` (font-weight 550) + `.log-drink-low` (12px, secondary-text, centered) CSS
- [x] Step 6: Verify — `yarn run build` exit 0, clean (no warnings)
- [x] Step 7: Update memory-bank — frontend [`activeContext.md`](memory-bank/activeContext.md) (Current Status rewritten + prior archived) + this progress section

### Key decisions
1. **REST fetch on dialog open over a resolved entity / attribute** — the prediction depends on the *current* master body mass, which changes every minute; a static attribute would go stale. A parallel REST fetch on dialog open gets the freshest per-drink prediction without polling, mirroring the proven `/api/ax_dose_logger/history` pattern. No new `ResolvedEntities` field — the prediction is dialog-scoped transient state, not a resolved entity, so `types.ts` is unchanged.
2. **"Low: —" for null = explicit safe-drink signal (user-confirmed)** — when the post-dose peak never exceeds the Low threshold, there's no predicted descent, so "Low: —" tells the user "this drink won't keep you above Low" — genuinely useful abort info (vs hiding the line or showing "now"). The user explicitly chose this over hiding.
3. **"Low: …" loading placeholder** — while the parallel fetches are in flight the key is absent from the map; `formatLow` returns "Low: …" so the user knows a prediction is coming rather than seeing a static "—" that could be mistaken for the null case. The map is reset on every open so a stale previous substance's values can't leak in.
4. **Race-guard token mirrors `_amountFetchToken`** — `_predictLowToken` is bumped on close + on every open, so a stale substance switch or a closed dialog can't clobber the current dialog's predictions after an `await` resolves.
5. **No frontend README change** — the frontend README documents card config/usage (YAML/visual editor), not individual popup affordances. The user-facing note belongs in the **backend** README's Drinks section (updated there).

## Log Drink Popup "Low: …" 20-second render delay fix (2026-07-09)

**Goal:** The popup buttons took up to 20 seconds to go from `Low: …` (loading) to `Low: HH:MM`, even though the backend `predict_low` REST endpoint responded in ~1 ms (confirmed by HA INFO log timestamps — all drink predictions logged within 1 ms of each other). This was a follow-on to the prior Predictive Low Timestamp feature + the backend `lru_cache(solve_ka)` perf fix.

### Steps completed
- [x] Step 1: Diagnose root cause — [`shouldUpdate`](src/ax-dose-logger-card.ts:1680) (the card's render-gate) maintained an explicit whitelist of internal `@state` properties that trigger a re-render, but `_drinkLowPredictions` and `_predictLowToken` were NOT in the list. When `_fetchDrinkLowPredictions` resolved its async `callApi` and mutated `this._drinkLowPredictions = {...}`, Lit detected the `@state` change but `shouldUpdate` returned `false` (the changed prop wasn't whitelisted, and it wasn't a `hass`/`config`/`_tick` change either) — so the popup didn't re-render. It only updated later when an unrelated change (a `hass` state tick passing `_relevantStateChanged`, or the 30s `_tick` for daily/stats/drinks/inventory panes) triggered a full card re-render that happened to include the open dialog → the ~20s wait.
- [x] Step 2: Add `'_drinkLowPredictions'` and `'_predictLowToken'` to the `shouldUpdate` whitelist in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) (with a documenting comment explaining the async-resolve re-render requirement)
- [x] Step 3: Verify — `yarn run build` exit 0, no warnings
- [x] Step 4: Update memory-bank — frontend [`activeContext.md`](memory-bank/activeContext.md) (follow-on paragraph appended to Current Status) + this progress section

### Key decisions
1. **Whitelist addition is the minimal correct fix** — the `shouldUpdate` whitelist pattern was introduced deliberately (Card Best-Practices Audit #1) to avoid the whole card re-rendering on every HA state tick. Adding the two predict-low `@state` props to the whitelist is the idiomatic fix: it lets the async fetch resolution trigger a re-render without weakening the gate for unrelated state. The alternative (removing the gate / broadening to all `@state`) would reintroduce the per-tick re-render cost the audit fixed.
2. **No backend change required** — the backend already responded instantly after the prior `lru_cache(solve_ka)` fix (the HA logs proved sub-millisecond response times). The 20s delay was purely the frontend not re-rendering on the async state mutation. The fix is a one-line whitelist addition.
3. **No `types.ts` / README / localize change** — the fix touches only the existing `shouldUpdate` whitelist; no new state, no new entities, no new strings.

## Inventory Panel — Stock Number Live-Update After Refill (2026-07-10)

### Planning
- [x] Read backend memory-bank context (activeContext, progress, projectstructure)
- [x] Read backend number.py (DrinkStockNumber / DrinkAddStockNumber refill flow)
- [x] Read frontend inventory-panel.ts + ax-dose-logger-card.ts (render + shouldUpdate gating)
- [x] Identify root cause: _relevantStateChanged doesn't watch granular drink entities
- [x] Write architecture plan document (plans/inventory-refill-no-update-plan.md in backend repo)
- [x] Review plan with user — approved, switched to Code mode

### Implementation
- [x] src/ax-dose-logger-card.ts — _relevantStateChanged: added inventory-pane-gated block that appends granular drink entity IDs (stockEntityId, addStockEntityId, avg7EntityId, avg365EntityId) collected via _getDrinksOfSubstance(entities.substance) to the watchedIds list

### Verification
- [x] yarn run build — exit 0, no warnings (dist/ax-dose-logger-card.js rebuilt clean)

### Documentation
- [x] Update memory-bank/activeContext.md (Current Status rewritten + prior Predictive Low Timestamp archived; new What Was Changed / Files Modified / Key Design Decisions entries)
- [x] Update memory-bank/progress.md (this section)

### Key decisions
1. Gate on the active pane (`this._activePane === 'inventory' && entities.substance`) to avoid needless re-renders on other panes — the granular entities are only displayed on the Inventory pane.
2. Watch all four rendered entity types (stock, add_stock, avg7, avg365) so any of them changing state triggers an immediate re-render.
3. The backend was already correct — DrinkStockNumber.add_stock increments and calls async_write_ha_state() immediately; the bug was purely frontend render-gating.
4. The 30s _tick timer was the fallback (whitelisted for the inventory pane), which is why the value eventually refreshed (~30s delay); the fix provides immediate feedback.
5. Frontend-only, single-file, single-method fix — no backend / coordinator / store / localize / types / config-flow changes.

## Inventory Panel — Stock Live-Update + Unified Labels + Averages-Box Device-Info Popup (2026-07-10)

### Planning
- [x] Read frontend localize.ts + inventory-panel.ts + ax-dose-logger-card.ts (labels + device-info dialog flow)
- [x] Identified two issues: (1) inconsistent "Day Avg" vs "Day Average" labels; (2) averages box had no click → device-info action
- [x] User clarification: averages box click should open the "To Device info" popup navigating to the granular drink's own device page; inventory box (col-1) unchanged (stays refill)

### Implementation
- [x] Issue 1 — src/localize.ts: `inventory.avg_7_day` "7-Day Avg" → "7-Day Average" (trailing box already said "Average")
- [x] Issue 2 — src/ax-dose-logger-card.ts: new `_deviceInfoTarget` @state + `showDeviceInfoFor(deviceId, name)` public method; `showDeviceInfo()` clears target; `_navigateToDevice` accepts optional deviceId param; `_renderDeviceInfoDialog` uses target name + navigates to target device; `_deviceInfoTarget` added to shouldUpdate whitelist + connectedCallback reset
- [x] Issue 2 — src/types.ts: `showDeviceInfoFor(deviceId: string, name: string): void` added to CardController interface
- [x] Issue 2 — src/components/inventory-panel.ts: col-2 `.avg-cell` gains `role="button"`, `tabindex="0"`, `@click`/`@keydown` → `c.showDeviceInfoFor(d.deviceId, d.name)`; cursor-pointer + hover + focus-visible CSS

### Verification
- [x] yarn run build — exit 0, no warnings (dist/ax-dose-logger-card.js rebuilt clean)

### Documentation
- [x] Update memory-bank/activeContext.md (Current Status rewritten to cover all three improvements)
- [x] Update memory-bank/progress.md (this section)

### Key decisions
1. **Only the 7-day label needed changing** — the trailing box already used `stats.avg_running`/`stats.avg_yearly` which both say "Average"; only `inventory.avg_7_day` said "Avg". One localize key change unifies both boxes to "Day Average".
2. **Averages box → granular drink's device, not the Master Tracker** — the Inventory row represents a granular drink (`d.deviceId`); clicking its averages box should navigate to that drink's own device page, not the Master Tracker. The new `showDeviceInfoFor(deviceId, name)` sets a `_deviceInfoTarget` that `_renderDeviceInfoDialog` + `_navigateToDevice` use; the existing `showDeviceInfo()` (Daily/Drinks pill-name click) clears the target and falls back to the card's configured device.
3. **Col-1 inventory box unchanged** — per user clarification, the refill click on the stock box stays as-is; only the col-2 averages box gets the device-info action.
4. **`_deviceInfoTarget` in shouldUpdate whitelist + connectedCallback reset** — mirrors the existing dialog-state pattern so the dialog re-renders on target change and doesn't leave a stale MDC overlay on back-navigation.
5. **Frontend-only** — no backend / coordinator / store changes.

## Amount in Body — Default to No Decimal Places (2026-07-10)
- [x] Step 1: Context grounding — read backend concentration.py + drink_master.py rounding + suggested_display_precision; read frontend stats-panel, daily-panel chips, swapped safe-to-take box, graphs-panel rendering of amount-in-body; read backend + frontend memory-bank activeContext
- [x] Step 2: Write architecture plan — plans/amount-in-body-no-decimals-plan.md (in the backend repo: HA-native suggested_display_precision = 0 on backend; explicit formatInteger / Math.round on the custom card surfaces that read raw state)
- [x] Step 3: stats-panel.ts — "Amount in Body" row value wrapped in c.formatInteger (was raw c.getState)
- [x] Step 4: daily-panel.ts — Custom chips render c.formatInteger(chipState) (was raw ${chipState})
- [x] Step 5: daily-panel.ts — swapped Safe-to-Take box: numeric display states rounded via c.formatInteger; non-numeric states keep the capitalization path (parseFloat guard)
- [x] Step 6: graphs-panel.ts — "Current: X unit" line label renders Math.round(parseFloat(amountInBody)) (was raw amountInBody); the dashed-line Y-position math still uses the parsed float unchanged
- [x] Step 7: Build verification — `yarn run build` exit 0 (dist/ax-dose-logger-card.js rebuilt, no warnings)
- [x] Step 8: Update memory-bank (frontend activeContext.md + progress.md)

### Key decisions
1. **`formatInteger` / `Math.round` on the card, not `suggested_display_precision`** — the card reads the raw state string via `c.getState(...)` and does its own formatting, so the backend's `suggested_display_precision = 0` hint (companion backend change) only governs HA's own UI (more-info, standard entities card, history), not the card's custom surfaces. Each custom surface got an explicit `c.formatInteger(...)` / `Math.round(parseFloat(...))` call — display-only, mirroring the existing `formatInteger` helper which already returns the string unchanged for `unknown`/`unavailable`.
2. **Drinks panel "In Body" box already correct** — `drinks-panel.ts` already used `Math.round(bodyNum)` for the In Body value, so no change was needed there.
3. **Swapped Safe-to-Take box preserves non-numeric states** — when a user swaps the box with a non-numeric entity (e.g. a categorical sensor), the capitalization path (`charAt(0).toUpperCase() + slice(1)`) still applies; `formatInteger` only kicks in when `parseFloat(displayState)` is a valid number. Avoids breaking text-state swaps while still rounding numeric ones (the user's amount-in-body case).
4. **Graph dashed-line math unchanged** — the Y-position calculation (`currentAmountNum / maxAmount`) still uses `parseFloat(amountInBody)` directly; only the human-readable "Current: X unit" text label is rounded to an integer. Keeps the line position precise while the label is compact.
5. **No localize / types / config / README / projectstructure change** — display-only rounding; no new entities, labels, config fields, or files.

### Follow-on fix — Unit suffix on swapped Safe-to-Take box + Custom chips (2026-07-10)
- [x] Step 1: User reported "cards are not showing units when amount in body is selected as an entity" — the swapped Safe-to-Take box + Custom chips rendered a bare rounded number with no unit suffix (the prior rounding fix appended the unit only on the Stats row + Graph label, not on the swapped box / chips).
- [x] Step 2: daily-panel.ts swapped box — append `c.getAttr(displayEntity, 'unit_of_measurement')` (with a leading space) when present, inside the numeric branch (after `c.formatInteger(displayState)`); non-numeric branch unchanged.
- [x] Step 3: daily-panel.ts Custom chips — read `chipUnit = c.getAttr(chip.entityId, 'unit_of_measurement')` and append `${chipUnit ? ' ' + chipUnit : ''}` after `c.formatInteger(chipState)`.
- [x] Step 4: Build verification — `yarn run build` exit 0.
- [x] Step 5: Update memory-bank (frontend activeContext.md Current Status rewritten to cover the unit-suffix follow-on; progress.md this subsection).

#### Key decisions (follow-on)
1. **Unit source = the entity's own `unit_of_measurement` attribute (generic)** — the swapped box + chips can host any entity the user picks, so reading the unit off the chosen entity (`c.getAttr(entityId, 'unit_of_measurement')`) is the correct generic approach — it surfaces `mg` for a medicine amount-in-body, `g` for an alcohol master, `%` for an adherence sensor, and omits the suffix for unitless/categorical entities (no spurious trailing space). Mirrors how HA's own standard entities card renders a unit suffix from the entity attribute.
2. **Only the numeric branch gets a unit on the swapped box** — the non-numeric (capitalization) branch is for categorical/string states (e.g. `on`/`off`, `Low`/`Moderate`/`High`) which have no unit; appending one there would be wrong. The `parseFloat` guard already separates the two branches.
3. **Drinks panel "In Body" + Stats row + Graph label were already correct** — the Drinks panel already used `Math.round` + `c.getStrengthUnit`; the Stats row already appended `strengthUnit`; the Graph label already appended `c.getStrengthUnit`. Only the swapped box + chips were missing the unit.
4. **No backend change** — the backend sensors already expose `unit_of_measurement` (mg/g) as a state attribute; the card just wasn't reading it on these two surfaces.

## Days Left Sensor — Stats Panel (2026-07-10)
- [x] Step 1: Context grounding — read backend days_left.py (role:"days_left" + estimation attribute), frontend stats-panel.ts (row pattern), types.ts (ResolvedEntities), ax-dose-logger-card.ts _computeEntities (medicine suffix block + master role block + granular block), localize.ts stats block; wrote architecture plan plans/days-left-sensor-frontend-plan.md
- [x] Step 2: Add ResolvedEntities fields — daysLeft?: string + daysLeftEst?: boolean (types.ts)
- [x] Step 3: Resolver branches — medicine suffix block longest-first (_days_left_est before _days_left) + master role==='days_left' + granular role==='days_left' (ax-dose-logger-card.ts); daysLeftEst mirrors the backend estimation attribute (true for As Needed/drinks/master, false for scheduled)
- [x] Step 4: Localize keys — stats.days_left ("Days left") + stats.days_left_est ("Est. days left") (localize.ts)
- [x] Step 5: Stats panel row — after daysSinceFirstDose; whole-number display via c.formatInteger + ' d'; label picks stats.days_left vs stats.days_left_est by daysLeftEst; unknown/unavailable/None → '-' (stats-panel.ts)
- [x] Step 6: Build verification — yarn run build exit 0, no warnings
- [x] Step 7: Update memory-bank (frontend activeContext.md + progress.md)

### Key decisions
1. **Classify by `role` for master/granular, suffix for medicine** — the medicine branch uses the existing suffix discipline (the backend's entity_id ends in `_days_left` / `_days_left_est` since the translation names slugify cleanly); the master/granular branch uses the proven `role` attribute (entity_id suffixes are unreliable on masters because HA slugifies the translated name — see the 2026-07-06 memory bank). Both set the same `daysLeft` field, so the Stats panel row is device-family-agnostic.
2. **Longest-suffix-first ordering** — `_days_left_est` must be checked before `_days_left` or the shorter suffix matches the longer entity_id (same discipline as `_avg_daily_doses_yearly` vs `_avg_daily_doses_365_days` at the existing line 253).
3. **Whole-number display via formatInteger (user-confirmed)** — "days left" is a planning estimate; showing "12 d" is clearer than "12.4 d". Matches the Amount in Body Stats row discipline established 2026-07-10. The backend retains its precision (scheduled integer floor, estimated 1 decimal) in the recorder + more-info; the card's compact row rounds for display.
4. **Two labels mirroring the backend (user-confirmed)** — the resolver captures the `estimation` attribute onto `daysLeftEst` so the row picks `stats.days_left` ("Days left") for scheduled medicine or `stats.days_left_est` ("Est. days left") for As Needed / drinks / master. This matches the backend's own sensor name in more-info, so the card and HA's UI agree on the label.
5. **Live refresh needs no extra wiring** — the Stats panel already takes `hass` as a reactive prop and re-renders on every state change passing `_relevantStateChanged`. The backend's `async_track_state_change_event` on the stock entity guarantees the sensor's HA state updates instantly on dose/undo/add-stock, so the row updates live with no `shouldUpdate`/`_relevantStateChanged` change.
6. **No README change** — the frontend change is a rendering surface for an already-documented backend sensor; the backend README already documents the Days left / Est. days left sensors. No `projectstructure.md` change (no files added/renamed/deleted).

## Amount in Body Graph — Default Landing Slide on Graphs Pane Entry (2026-07-10)
- [x] Step 1: Context grounding — read frontend memory-bank/activeContext.md, graphs-panel.ts (carousel slide-gating in render() at line 97-103: ['bar'] + conditional 'line' + conditional 'effectiveness'), ax-dose-logger-card.ts (_activeGraph @state at line 57, connectedCallback hardcodes = 0 at line 1650, _handlePaneChange at line 958 does NOT touch _activeGraph, setActiveGraph at 881, updated() graphs-pane entry at 1827); types.ts (CardController.activeGraph getter); confirmed with user that "reset on every graphs-pane entry" is the desired behaviour
- [x] Step 2: Implement default-graph logic in _handlePaneChange (ax-dose-logger-card.ts) — when paneId === 'graphs' && config && hass: resolve entities, read amount-in-body state, compute hasAmountInBody (entity exists + state ≠ 0/unknown/unavailable — the exact check the panel uses), set _activeGraph = (show_amount_in_body !== false && hasAmountInBody) ? 1 : 0; added documenting comment block
- [x] Step 3: README — updated the show_amount_in_body config row to note the Amount in Body line graph is the default graph on Graphs-pane entry when the toggle is on
- [x] Step 4: Build verification — yarn run build exit 0, no warnings
- [x] Step 5: Update memory-bank (frontend activeContext.md Current Status + What Was Changed + Prior status archive; progress.md this section)

### Key decisions
1. **Mirror the panel's own slide-gating exactly** — the graphs panel's render() builds `['bar']` then conditionally pushes `'line'` (when `show_amount_in_body !== false && hasAmountInBody`) then conditionally pushes `'effectiveness'`. The default index must point at a slide that will actually render: `_activeGraph = 1` lands on `'line'` only when the line slide exists; otherwise `_activeGraph = 0` (bar). Computing the same `hasAmountInBody` predicate in `_handlePaneChange` (entity exists + state ≠ 0/unknown/unavailable) guarantees the index and the slide list agree, so the default never lands on the effectiveness slide by mistake (the prior off-by-one risk if a stale index 1 met a `['bar','effectiveness']` list). The panel's existing `Math.min(this.activeGraph, slides.length - 1)` clamp is unchanged (defense-in-depth).
2. **Put the default in `_handlePaneChange`, not `connectedCallback` (user-confirmed behaviour)** — the user confirmed the Amount in Body graph should be the default "when navigating to the graphs panel" — i.e. on every graphs-pane entry, not just on initial card load. `connectedCallback` resets `_activePane = 'daily'`, so the graphs pane is never the initial landing pane; its carousel index is never observed until the user clicks Graphs, at which point `_handlePaneChange` runs first. Putting the default in `_handlePaneChange` satisfies "reset on every graphs-pane entry" (re-applies on each navigation into the pane). The existing `connectedCallback` `this._activeGraph = 0` is left in place — it only sets the index for the non-graphs initial pane and is immediately overwritten by `_handlePaneChange` on the first graphs navigation, so it is harmless.
3. **No new config field, localize key, or types change** — the existing `show_amount_in_body` toggle already gates the line slide's existence; the feature just changes which slide is the landing default, so no new user-facing config option or string is needed. No new `CardController` method (the container already owns `_activeGraph` + `setActiveGraph`); the panel reads `activeGraph` as a reactive prop.
4. **Manual carousel navigation still works within a session** — prev/next call `setActiveGraph`, which sets `_activeGraph`; the new default only runs in `_handlePaneChange` (on pane entry), so a user who carousels to the bar graph keeps it for the rest of that graphs-pane session. Leaving and re-entering the graphs pane re-applies the Amount in Body default — the user-confirmed behaviour.
5. **No backend / coordinator / store / config-flow change** — pure frontend card behaviour; the amount-in-body state is already resolved on the container via `_resolveEntities()` + `_getState()`. No `projectstructure.md` change (no files added/renamed/deleted/repurposed).

## Pills Left Box Subheading — Full Override Parity with Safe to Take Box (2026-07-10)

### Planning
- [x] Read frontend memory-bank (activeContext, progress, projectstructure) for context
- [x] Read editor schema + daily-panel render + controller to understand the Safe to Take Box override pattern
- [x] Confirm scope with user — Full parity (entity replacement + icon + label + tap/hold/double-tap actions)
- [x] Write architecture plan to plans/pills-left-box-subheading-plan.md
- [x] Revise plan per user feedback: add "Days left instead of Pills left" toggle (retaining Refill dialog as default tap); keep Refill dialog as the default tap for ALL display modes
- [x] Get user approval on the revised plan

### Implementation
- [x] src/types.ts — added 5 config fields + 2 CardController methods
- [x] src/ax-dose-logger-card.ts — _getPillsLeftBoxEntity + _handlePillsLeftBoxAction + public wrappers
- [x] src/ax-dose-logger-editor.ts — pills_left_box expandable replaces lone grid row; computeHelper comment updated
- [x] src/localize.ts — 6 label keys + 6 helper keys
- [x] src/components/daily-panel.ts — Pills Left render rewritten: days-left mode, swapped value, tap/hold/double-tap wiring; removed unused pillsLeft local
- [x] README.md — 5 Configuration Options rows

### Verification
- [x] yarn run build — clean compilation (exit 0, no warnings); dist/ax-dose-logger-card.js rebuilt in 1.7s

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + What Was Changed + Prior status archive)
- [x] Updated memory-bank/progress.md (this section)
- [x] No projectstructure.md change (no files added/renamed/deleted/repurposed)

### Key decisions
1. **Full parity with Safe to Take Box + a built-in days-left swap** — entity replacement + icon + label + 3 actions under a "Pills Left Box" expandable, plus a "Days left instead of Pills left" toggle. Confirmed by user.
2. **Custom tap action always wins** — overrides the Refill dialog default (user-confirmed).
3. **Refill dialog stays the default tap for ALL display modes** (default, days-left, entity swap) — "Refill dialog" cannot be chosen from the ui_action dropdown, so it remains the built-in default a custom tap action overrides. User-confirmed. This deliberately diverges from the Safe to Take Box (whose default tap is more-info): a swapped Pills Left box tapping to open the Refill dialog is intended.
4. **Days-left toggle is a first-class built-in swap** — when on, the box shows entities.daysLeft with a " d" suffix and label/icon defaults switch to the days-left variants; the toggle wins over a configured pills_left_entity so the two overrides are mutually unambiguous. The Refill dialog default tap is retained (user-confirmed).
5. **No safety decoupling needed** — nothing consumes the real pillsLeft for logic (Stats row removed Iteration 20; refill uses addRefill), unlike Safe to Take's LIMIT REACHED coupling.
6. **Separate handlePillsLeftBoxAction method, not a refactor of handleSafeBoxAction** — avoids regression risk on the working Safe to Take path; the Pills Left method generalizes the pattern with an optional fallback parameter for the card-internal Refill-dialog default.

## Drinks Panel Settings — Full Parity with Daily Panel (2026-07-10)

### Planning
- [x] Read frontend memory-bank/activeContext.md + projectstructure.md for current Drinks panel structure
- [x] Read src/ax-dose-logger-editor.ts (Daily Panel schema: daily_panel expandable → take_pill grid + safe_to_take_box + pills_left_box + chips)
- [x] Read src/components/drinks-panel.ts (zero editor config — all hardcoded)
- [x] Read src/types.ts (AxDoseLoggerCardConfig + CardController interface)
- [x] Read src/ax-dose-logger-card.ts (_getSafeBoxEntity / _handleSafeBoxAction / _getPillsLeftBoxEntity / _handlePillsLeftBoxAction / _getChipEntities)
- [x] User-confirmed: single 3-option select for Disruption box "Time to Low" (Option A — cleanest, no branching)
- [x] User-confirmed: full parity (In Body Box + Disruption Box + Custom Chips)
- [x] Create architecture plan plans/drinks-panel-settings-parity-plan.md (with Mermaid diagram)

### Implementation
- [x] src/types.ts — Added config fields: log_drink_icon/label, in_body_* (entity/icon/label/actions), disruption_* (mode select/entity/icon/label/actions), drink_chip_1..4 + labels. Added CardController methods: getInBodyBoxEntity, getDisruptionBoxEntity, handleInBodyBoxAction, handleDisruptionBoxAction, getDrinkChipEntities.
- [x] src/ax-dose-logger-editor.ts — Added drinks_panel expandable mirroring daily_panel: grid(log_drink_icon+label) → in_body_box expandable (entity + grid icon/label + 3 actions) → disruption_box expandable (disruption_mode 3-option select + entity + grid icon/label + 3 actions) → drink_chips expandable (4× grid entity+label). Updated computeLabel (drink_chip_* label suppression) + computeHelper (drink_chip_* helpers + container guard list).
- [x] src/localize.ts — Added config label keys (drinks_panel, log_drink_*, in_body_*, disruption_*, disruption_mode option labels, drink_chips, drink_chip_*) + helper keys for all fields.
- [x] src/ax-dose-logger-card.ts — Added _getInBodyBoxEntity (config.in_body_entity || amountInBody), _getDisruptionBoxEntity (mode priority: low_timestamp→estimatedLowTime, low_hours_until→lowHoursUntil, else disruption_entity||sleepDisruption), _handleInBodyBoxAction (more-info fallback, mirrors _handleSafeBoxAction), _handleDisruptionBoxAction (Sleep Disruption popup fallback, mirrors _handlePillsLeftBoxAction), _getDrinkChipEntities (reads drink_chip_1..4). Added public wrappers. Updated _relevantStateChanged to watch drink chip entities.
- [x] src/components/drinks-panel.ts — Rewrote render: Log Drink button icon/label overrides (config.log_drink_icon/label with substance-aware defaults); In Body box full override parity (getInBodyBoxEntity, entity swap numeric→formatInteger+unit / non-numeric→title-case, default→Math.round+unit, icon/label/action overrides, tap/hold/double-tap wiring); Disruption box mode-aware display (disruption→title-case, low_timestamp→HH:MM, low_hours_until→X h, entity swap, icon/label defaults switch per mode, tap fallback = Sleep Disruption popup when mode=disruption+substance else more-info); drink chips row (getDrinkChipEntities + verbatim Daily chips CSS). Removed unused formatTime import attempt.
- [x] README.md — Added Configuration Options rows for all new drinks_panel fields (log_drink_icon/label, in_body_*, disruption_*, drink_chip_*).

### Verification
- [x] yarn run build — clean compilation (exit 0, no warnings); dist/ax-dose-logger-card.js rebuilt in 1.8s

### Documentation
- [x] Updated memory-bank/activeContext.md (Current Status + What Was Changed + Prior status archive)
- [x] Updated memory-bank/progress.md (this section)
- [x] No projectstructure.md change (no files added/renamed/deleted/repurposed)

### Key decisions
1. **Full parity with Daily Panel** — the Drinks Panel expandable mirrors the Daily Panel structure exactly: a Log Drink button override grid (mirrors take_pill grid), an In Body Box expandable (mirrors Safe to Take Box), a Disruption Box expandable (mirrors Pills Left Box), and a Custom Chips expandable (mirrors chips). User-confirmed scope.
2. **3-option select for Disruption box instead of a boolean toggle** (Option A, user-confirmed) — the three display modes (Sleep Disruption / Low - Timestamp / Low - Hours Until) are mutually exclusive states of one box. A single select dropdown is cleaner than a boolean toggle + conditional sub-select. The built-in mode swap wins over disruption_entity (mirrors Pills Left Box's pills_left_show_days_left winning over pills_left_entity).
3. **Disruption box default tap = Sleep Disruption popup** (card-internal, only when mode='disruption' + substance) — retains the current behavior as the fallback. For low_timestamp / low_hours_until modes, the default tap falls back to more-info (like Safe to Take). A custom disruption_tap_action always wins.
4. **In Body box mirrors Safe to Take box** (not Pills Left box) — the In Body box's default tap is more-info (no card-internal dialog), exactly like the Safe to Take box. handleInBodyBoxAction follows the _handleSafeBoxAction signature (no fallback parameter).
5. **Separate drink_chip_* namespace** (not reusing chip_*) — a card is bound to one device, but shared chip fields would carry over confusingly if the user changes device_id from medicine to master tracker. Separate fields keep the two panels' chip configs fully independent.
6. **No backend changes** — all three sensors (sleepDisruption, estimatedLowTime, lowHoursUntil) are already resolved in ResolvedEntities by _computeEntities. The card already has access to all the data; this is purely a frontend config + render change.
7. **Separate controller methods, not a refactor** — _handleInBodyBoxAction and _handleDisruptionBoxAction are separate methods (mirrors _handleSafeBoxAction / _handlePillsLeftBoxAction), avoiding any regression risk on the working Daily panel action paths. _handleDisruptionBoxAction generalizes with an optional fallback parameter for the card-internal Sleep Disruption popup default.
8. **_relevantStateChanged watches drink chip entities always** (parallel to the Daily chips) — they may belong to other devices and only render on the drinks pane, but keeping them always watched mirrors the existing Daily chip pattern (simpler than a pane-conditional guard, and the cost is negligible — at most 4 extra entity-id string comparisons per state-change check).

## README Update to Reflect Current Card State
- [x] Step 1: Read card README.md (154 lines) + memory-bank/activeContext.md + projectstructure.md for context
- [x] Step 2: Analyze 9 gaps between card README and current card state (companion callout, ToC, predictive Low popup, Disruption 3 modes, Days left + Low-Hours-Until Stats rows, Inventory unified labels + popup, Graphs default landing slide, Pills Left Box expandable, prerequisites + broken screenshot)
- [x] Step 3: Design updated structure + write plan to plans/readme-update-plan.md
- [x] Step 4: Present plan to user for approval (approved)
- [x] Step 5: Write the updated card README via write_to_file (154 → ~240 lines)
- [x] Step 6: Verify all 20 ToC anchor links resolve to existing headings
- [x] Step 7: Run yarn run build (exit 0, no warnings — confirms no source files touched)
- [x] Step 8: Update memory-bank/activeContext.md (new Current Status; prior archived)
- [x] Step 9: Update memory-bank/progress.md (this section)
- [x] Step 10: No projectstructure.md update needed (no source files added/renamed/deleted; only README + plan doc changed)
- [x] Step 11: No source code changes (README-only documentation task)

## Ko-fi Support Links Added to Frontend README
- [x] Step 1: Read frontend [`README.md`](README.md:1) to identify strategic insertion points (intro paragraph at line 3, License section at line 238)
- [x] Step 2: Design two-touchpoint placement strategy (compact top badge after intro + dedicated Support section before License) and condensed conversion-optimized blurb distilled from the user's Ko-fi page text
- [x] Step 3: Present plan with mockups to user for approval (approved as-is — paired with backend repo change)
- [x] Step 4: Add compact `flat-square` shields.io "Buy me a tea" badge after the intro paragraph (line 3), before the screenshot comment
- [x] Step 5: Add dedicated "☕ Support the Project" section before `## License` (line 238) with condensed blurb + `for-the-badge` styled badge
- [x] Step 6: Verify markdown — `search_files` confirmed all 3 insertions (top badge, section heading, section badge) present with correct link syntax pointing to `https://ko-fi.com/axildor`
- [x] Step 7: Update memory-bank files (frontend activeContext.md + progress.md)
- Key decisions: (1) Two touchpoints — compact badge near top (low friction, high visibility) + dedicated section near end (context + conversion); (2) Top badge uses `flat-square` style (unobtrusive), section badge uses `for-the-badge` style (primary CTA); (3) Badge color `FF5E5B` (Ko-fi brand red) with white ko-fi logo; (4) Condensed blurb distills the user's Ko-fi page into two conversion-optimized sentences; (5) Top badge placed after the intro paragraph (not the very first thing readers see); (6) Support section placed before License (standard open-source convention); (7) Documentation-only change — no source code, localize, types, editor, or build artifact changes; no `yarn run build` needed (README is not compiled).

---

## Take Pill Sub-Line Next-Label Fix (2026-07-11)

**Feature:** Restructure the Take Pill button sub-line in [`daily-panel.ts`](src/components/daily-panel.ts:131) so the `Next:` segment renders in **all** branches whenever a useful next-dose value exists. Reported by user: Brintellix (cyclic, every-other-day) showed only `Last: 31h 40m` on the Take Pill button with no `Next:` segment, even though [`sensor.brintellix_next_dose`](../../Home-Assistant-Pill-Logger/custom_components/ax_dose_logger/sensors/next_dose.py) correctly reported `2026-07-11T06:00:00+00:00`.

**Root cause:** the sub-line template at [`daily-panel.ts:131`](src/components/daily-panel.ts:131) was a 4-branch ternary. The user's pill was in the **safe + not overdue** branch (`safe_to_take=1`, `overdue=0`), which rendered only `Last: X` — the `Next:` segment was wired only into the limit-reached branch. The "24h limit is up" was a red herring: the 31h-old dose is *outside* the 24h window, so safety correctly reset to 1; the next_dose sensor was correct, but the template never printed it in the safe branches.

### Steps
- [x] Step 1: Investigate — read [`daily-panel.ts`](src/components/daily-panel.ts:1) sub-line template (lines 131-137), confirmed the 4-branch matrix and that the safe branches omit `Next:`.
- [x] Step 2: Investigate — read [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:461) `_computeNextDose` (returns `'Unavailable'` for unavailable/unknown, `'now'` for past-due) and `_computeOverTime` to confirm the guard semantics.
- [x] Step 3: Write architecture plan — [`../../Home-Assistant-Pill-Logger/plans/two-bugs-next-label-and-cyclic-days-left-plan.md`](../../Home-Assistant-Pill-Logger/plans/two-bugs-next-label-and-cyclic-days-left-plan.md:1) (covers the paired backend cyclic days-left fix too).
- [x] Step 4: Implement — replaced the 4-branch ternary with a unified 2-segment structure: always render `Last:` first, then conditionally append `• Overdue: X` (when `overTime` truthy) or `• Next: Y` (when `nextDose !== 'Unavailable'`), or `nothing`. Fixes both safe branches in one edit.
- [x] Step 5: Verify — `yarn run build` clean (`dist/ax-dose-logger-card.js` created in 3.6s, exit 0).
- [x] Step 6: Update memory-bank — [`activeContext.md`](memory-bank/activeContext.md:1) new Current Status + archive previous; [`progress.md`](memory-bank/progress.md:1) this section.
- [x] Step 7: No README change (internal UX tweak — the card README documents installation/config, not sub-line display rules). No `projectstructure.md` change (no files added/renamed/deleted).

**Key decisions:**
1. **Always show Last + one of {Overdue, Next}** — the prior safe+overdue branch showed only `Overdue:`, dropping last-dose context. The new structure mirrors the limit-reached+overdue branch (which always shows `Last: X • Overdue: Y`), making the "always show Last" convention consistent across all four states.
2. **Guard is `nextDose !== 'Unavailable'`** — a past or `'now'` next-dose is informative (dose window opened), so only the unavailable sentinel suppresses the segment. Matches the existing `_computeNextDose` contract.
3. **`isLimitReached` no longer affects the sub-line** — limit state now only controls button color/label (`danger` class + "LIMIT REACHED" label at lines 123-130), not sub-line content. Sub-line is purely time-context (Last/Next/Overdue) — correct separation of concerns.
4. **No backend change for this bug** — the next_dose sensor was already correct; purely a frontend display omission.

---

## Low - Hours Until Redundant Unit Suffix Removal (2026-07-11)

**Feature:** Remove the redundant ` h` unit suffix from both card surfaces that render the "Low - Hours Until" value, since the label itself ("Low - Hours Until") already conveys the unit. User-reported: the box displayed e.g. `3.5 h` even though "Hours Until" in the label makes the ` h` redundant — mirrors the same refinement already applied to the Days Left row (where the "Days left" label conveys the unit and no ` d` suffix is appended).

### Steps
- [x] Step 1: Investigate — `search_files` across both repos for `hours_until` / `low_hours_until` confirmed the ` h` suffix is appended in exactly two frontend locations: the Stats panel row ([`stats-panel.ts`](src/components/stats-panel.ts:118)) and the Disruption box `low_hours_until` display mode ([`drinks-panel.ts`](src/components/drinks-panel.ts:120)).
- [x] Step 2: Architecture plan — presented the two-edit plan (replace `num + ' h'` / `` `${num} h` `` with `String(num)` in both files, backend untouched, `-` fallback preserved); user approved as-is.
- [x] Step 3: Edit [`stats-panel.ts`](src/components/stats-panel.ts:113) — `display = num + ' h'` → `display = String(num)` with an explanatory comment (label conveys unit; backend keeps `UnitOfTime.HOURS` for automations/history).
- [x] Step 4: Edit [`drinks-panel.ts`](src/components/drinks-panel.ts:117) — `` `${num} h` `` → `String(num)` with an explanatory comment; the `disruptionIsSwapped` branch (line 109, appends `unit_of_measurement` from swapped entity) intentionally left untouched.
- [x] Step 5: Verify — `yarn run build` clean (`dist/ax-dose-logger-card.js` created in 3.5s, exit 0).
- [x] Step 6: Update memory-bank — [`activeContext.md`](memory-bank/activeContext.md:1) new Current Status + archive previous; [`progress.md`](memory-bank/progress.md:1) this section.
- [x] Step 7: No README change (internal UX tweak — the card README documents installation/config, not per-row display suffix rules). No `projectstructure.md` change (no files added/renamed/deleted).

**Key decisions:**
1. **Label-conveys-unit convention (mirrors Days Left row)** — the Stats panel Days Left row already renders `formatInteger(state)` with no ` d` suffix because the "Days left" label conveys the unit. Applying the same convention to "Low - Hours Until" keeps the two countdown rows visually consistent.
2. **Backend untouched** — the backend `DrinkMasterLowHoursUntilSensor` (`UnitOfTime.HOURS`, `SensorDeviceClass.DURATION`) stays; automations parsing `states('sensor.*_low_hours_until')` and the history graph still see the `h` unit. The change is purely a card display concern.
3. **Disruption box entity-swap path untouched** — [`drinks-panel.ts`](src/components/drinks-panel.ts:109) `disruptionIsSwapped` branch still appends `unit_of_measurement` from the swapped entity's attributes (a different code path — user-swapped arbitrary entity), intentionally left as-is.
4. **Both display locations covered** — the Disruption box (`disruption_mode: 'low_hours_until'`) and the Stats panel row are the only two card surfaces that render this sensor; both updated in one pass.

## Nested Chip Expandables — Third Config Layer with Full Override Suite (2026-07-11)

### Planning
- [x] Read memory-bank/activeContext.md and projectstructure.md for context
- [x] Examine current chip schema in ax-dose-logger-editor.ts (layer-2 expandable + flat grid rows)
- [x] Examine types.ts chip config fields and CardController interface
- [x] Examine daily-panel.ts + drinks-panel.ts chip render + CSS
- [x] Confirm design decisions with user (icon rendered, both panels, more-info default tap)
- [x] Write architecture plan to plans/chips-nested-expandable-plan.md

### Implementation
- [x] Implement types.ts — add 32 new config fields + ChipConfig interface + 2 CardController methods
- [x] Implement ax-dose-logger-editor.ts — nested chip_N_box / drink_chip_N_box expandables + computeLabel/computeHelper updates
- [x] Implement localize.ts — label + helper keys (chip_N_box titles, chip_N_icon/tap/hold/double_tap labels, helpers)
- [x] Implement ax-dose-logger-card.ts — extend _getChipEntities/_getDrinkChipEntities + _handleChipAction/_handleDrinkChipAction + public wrappers + ChipConfig import/re-export
- [x] Implement daily-panel.ts — chip icon + click/hold/double-tap wiring + .clickable/.chip-icon CSS
- [x] Implement drinks-panel.ts — same chip render changes (drink chips)
- [x] Update README.md — new config rows + editor description + feature descriptions

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.9s)
- [x] No backend / coordinator / store / config-flow changes
- [x] No projectstructure.md change (no files added/renamed/deleted)

## Stat-Pill + Chip Fixed Height for UI Consistency (2026-07-11)

### Planning
- [x] Read memory-bank/activeContext.md for current context
- [x] Read daily-panel.ts + drinks-panel.ts CSS (.stat-pill / .stat-label / .stat-value / .chip / .chip-name / .chip-value)
- [x] Confirm user intent: all .stat-pill boxes same height regardless of 2-line wrapping; also apply to chips
- [x] Write architecture plan to plans/stat-pill-fixed-height-plan.md (stat-pill + chip line-height math)

### Implementation
- [x] daily-panel.ts: .stat-pill → overflow:hidden; .stat-label → line-height 0.9; .stat-value → line-height 1.5 + white-space nowrap
- [x] daily-panel.ts: .chip → overflow:hidden; .chip-name → remove nowrap/ellipsis, add line-height 0.75 + text-align center + word-break break-word; .chip-value → line-height 1.5 + white-space nowrap
- [x] drinks-panel.ts: same 6 CSS changes (stat-pill + chip blocks identical between panels)

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.4s)
- [x] No backend / coordinator / store / config-flow / editor / types / localize / README changes
- [x] No projectstructure.md change (no files added/renamed/deleted)

## Stat-Pill + Chip Equal-Spacing Two-Line Fix — Revision (2026-07-11)

### Planning
- [x] User feedback: first pass (line-height 0.9 / 0.75) squeezed two lines too tightly — needs more space + equal spacing above/between/below
- [x] Derive equal-spacing formula: line-height L + min-height (3L-1)em + flex column centering → all three gaps = (L-1) × font-size
- [x] Choose line-height 1.2 (3px gaps for 15px label, 2.4px for 12px chip-name); min-height 2.6em
- [x] Write revision plan to plans/stat-pill-equal-spacing-plan.md
- [x] User confirmed: implement the equal-spacing formula

### Implementation
- [x] daily-panel.ts: .stat-label → line-height 1.2 + min-height 2.6em + display flex column + justify-content center
- [x] daily-panel.ts: .chip-name → same (line-height 1.2 + min-height 2.6em + flex column centering), keep text-align/word-break/max-width
- [x] drinks-panel.ts: same .stat-label change
- [x] drinks-panel.ts: same .chip-name change

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.8s)
- [x] No backend / coordinator / store / config-flow / editor / types / localize / README changes
- [x] No projectstructure.md change (no files added/renamed/deleted)

## Stat-Pill + Chip Box Padding Reduction (2026-07-11)

### Planning
- [x] User feedback: boxes too big with excess headroom above/below text; between-line spacing is fine
- [x] Identify source of headroom: box vertical padding (.stat-pill 12px, .chip 8px) + label flex centering
- [x] Decision: reduce vertical padding only; keep equal-spacing formula (line-height 1.2 + min-height 2.6em) unchanged

### Implementation
- [x] daily-panel.ts: .stat-pill padding 12px 14px → 6px 14px (vertical halved, horizontal unchanged)
- [x] daily-panel.ts: .chip padding 8px 6px → 4px 6px (vertical halved, horizontal unchanged)
- [x] drinks-panel.ts: same 2 padding reductions

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.9s)
- [x] No backend / coordinator / store / config-flow / editor / types / localize / README changes
- [x] No projectstructure.md change (no files added/renamed/deleted)


## Chip Rework — Day-Avg-Box Format + Per-Chip Icon Toggle + Timestamp Bug Fix (2026-07-11)

### Planning
- [x] User feedback: lose the icons by default; format chips like the Graph panel Day Avg Boxes; match the box height of the stat-pill boxes to the right of the Take Pill / Log Drink button; add a per-chip "Show Icon" toggle in the card settings (box grows when icon on)
- [x] Bug report: sensor.caffeine_tracker_low_timestamp as a chip shows "2026" (year) instead of a formatted time — root cause: formatInteger parseFloat extracts the year from ISO datetime strings
- [x] Architect plan created: plans/chip-rework-format-and-icon-toggle-plan.md
- [x] User-confirmed icon layout: icon on top (column layout) — icon above label/value, box grows taller

### Implementation
- [x] types.ts: added chip_N_show_icon / drink_chip_N_show_icon (8 boolean fields) to AxDoseLoggerCardConfig; added showIcon?: boolean to ChipConfig interface
- [x] ax-dose-logger-card.ts: _getChipEntities() + _getDrinkChipEntities() read *_show_icon config and populate showIcon on each ChipConfig
- [x] daily-panel.ts: chip render gates <ha-icon> on chip.showIcon (icon above label/value); device-class-aware value (timestamp -> HH:MM via new Date + toLocaleTimeString, else formatInteger + unit); .with-icon class added; CSS reworked (.chip primary-tinted bg, padding 6px 4px, justify-content center, min-height ~51px matching stat-pill; .chip.with-icon min-height auto; .chip-name uppercase + letter-spacing 0.3px, removed min-height 2.6em)
- [x] drinks-panel.ts: same chip render + CSS changes verbatim (parity)
- [x] ax-dose-logger-editor.ts: added { name: 'chip_N_show_icon' / 'drink_chip_N_show_icon', selector: { boolean: {} } } toggle at the top of each chip_N_box / drink_chip_N_box expandable schema, with label + helper from localize
- [x] localize.ts: added 8 label keys config.chip_N_show_icon / config.drink_chip_N_show_icon ("Show Icon") + 1 helper key config.helper.chip_show_icon
- [x] README.md: added 2 Configuration Options rows (chip_N_show_icon + drink_chip_N_show_icon) documenting default-off + box-grows-when-on semantics

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3.9s)
- [x] No backend / coordinator / store / config-flow changes (timestamp bug was purely frontend rendering)
- [x] No projectstructure.md change (no files added/renamed/deleted/repurposed — only edits to existing files)


## Chip Refinement — Height Fix + Icon Spacing + Button-Use Note (2026-07-11)

### Problem
- Chips were too tall: `.chip` had `min-height: 51px` applied as content-box (Shadow DOM defaults to content-box, not HA's global border-box), so actual height was 51px + 12px padding = 63px, ~12px taller than the stat-pill (~51px).
- Icon sat too close to the label when toggled on (`.chip` gap was 2px).

### Fix
- [x] daily-panel.ts + drinks-panel.ts: removed `min-height` + `justify-content: center` from `.chip` (natural column height ~52px already matches stat-pill); removed `.chip.with-icon { min-height: auto }`; added `.chip.with-icon { gap: 6px }` for icon breathing room
- [x] README.md: updated `chip_N_show_icon` + `drink_chip_N_show_icon` row descriptions to note the icon toggle makes chips taller — useful for a button-like layout
- [x] localize.ts: updated `config.helper.chip_show_icon` helper text to mention the button-like use

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3.4s)
- [x] No backend / coordinator / store / config-flow / types / editor changes
- [x] No projectstructure.md change (no files added/renamed/deleted)


## Chip Icon Spacing + Color Scheme Refinement (2026-07-11)

### Fix
- [x] daily-panel.ts + drinks-panel.ts: .chip.with-icon gap 6px -> 10px (more breathing room between icon and label)
- [x] daily-panel.ts + drinks-panel.ts: .chip-icon color var(--secondary-text-color) -> var(--primary-color) + opacity 0.7 (matches the stat-pill icon color scheme)

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 4.1s)


## Chip Icon Gap-Isolation + Size Match Refinement (2026-07-11)

### Problem
- .chip.with-icon { gap: 10px } changed the gap for ALL flex children, so the label-to-value spacing also jumped to 10px (was 2px) when the icon was toggled on — user wanted label-to-value to stay the same in both modes.
- Chip icon was 18px; stat-pill icons are 20px — not the same size.

### Fix
- [x] daily-panel.ts + drinks-panel.ts: reverted .chip.with-icon gap override (gap stays 2px in both modes); moved the icon breathing room to .chip-icon { margin-bottom: 8px } so only the icon-to-label gap grows, not label-to-value
- [x] daily-panel.ts + drinks-panel.ts: .chip-icon --mdc-icon-size 18px -> 20px + width/height 20px (matches the .stat-pill ha-icon size)

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3.6s)


## Default View Override + Bold Text + Editor Reorder (2026-07-11)

### Planning
- [x] Read activeContext.md + projectstructure.md for current editor schema + CSS architecture context
- [x] Inspect editor schema (ax-dose-logger-editor.ts lines 112-160) — identified 2 existing grid rows: big_text|hide_nav_bar, color_scheme|name
- [x] Inspect connectedCallback pane reset (ax-dose-logger-card.ts line 1930) — hardcoded 'daily'
- [x] Inspect --pill-text-offset CSS custom property pattern (injected on <ha-card>, consumed via calc() in all panels)
- [x] Architect mode: design plan with 3-row editor reorder, default_view select dropdown, bold_text CSS custom property (--pill-font-weight-boost), friendly-name dropdown labels reusing pane.* localize keys

### Implementation
- [x] types.ts: add default_view?: string + bold_text?: boolean to AxDoseLoggerCardConfig
- [x] ax-dose-logger-editor.ts: reorder 2 grid rows → 3 grid rows (Row1: color_scheme|name, Row2: default_view|hide_nav_bar, Row3: big_text|bold_text); add default_view select dropdown with 7 pane options using pane.* localize keys for labels
- [x] localize.ts: add config.bold_text + config.default_view labels, config.helper.bold_text + config.helper.default_view helpers
- [x] ax-dose-logger-card.ts connectedCallback: replace hardcoded 'daily' with validated config.default_view (whitelist of 7 pane IDs, fallback 'daily')
- [x] ax-dose-logger-card.ts: inject --pill-font-weight-boost CSS custom property on both <ha-card> inline styles (100 when bold_text === true, 0 otherwise)
- [x] daily-panel.ts: wrap 4 font-weight declarations in calc(N + var(--pill-font-weight-boost, 0))
- [x] drinks-panel.ts: wrap 4 font-weight declarations (parity with daily-panel)
- [x] stats-panel.ts: wrap 1 font-weight declaration
- [x] inventory-panel.ts: wrap 2 font-weight declarations
- [x] tools-panel.ts: wrap 2 font-weight declarations
- [x] tracking-panel.ts: wrap 3 font-weight declarations
- [x] graphs-panel.ts: wrap 6 font-weight declarations
- [x] ax-dose-logger-card.ts: wrap 6 font-weight declarations (pane selector + dialog CSS + placeholder inline style)
- [x] Verified zero remaining bare font-weight:N declarations across all src/*.ts files
- [x] README.md: add default_view + bold_text config option rows

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.9s)
- [x] No backend / coordinator / store / config-flow changes
- [x] No projectstructure.md change (no files added/renamed/deleted — only edits to existing files)


## Bold Text Revision: 50% Multiplicative + Catch-All + Helper Text Trim (2026-07-11)

### Problem
- First-pass bold_text used a flat +100 additive boost (calc(N + var(..., 0)) with value 0/100) — user feedback: "hardly a difference and some text did not change"
- Elements without an explicit font-weight declaration (inherited text, labels, spans) never received the boost at all
- Helper text for default_view was too verbose ("Pane shown when the card loads." + "for this device.")

### Fix
- [x] Switched --pill-font-weight-boost from additive (0/100) to multiplicative (1/1.5) — formula changed from calc(N + var(..., 0)) to calc(N * var(..., 1)) across all 28 font-weight declarations in all 8 source files
- [x] Added :host { font-weight: calc(400 * var(--pill-font-weight-boost, 1)); } catch-all rule to all 7 panel components + the card's own :host — so inherited text without explicit font-weight also gets boosted (400 → 600 when on)
- [x] Trimmed config.helper.default_view from "Pane shown when the card loads. Falls back to Daily if invalid for this device." to "Falls back to Daily if invalid."
- [x] Updated README bold_text description to "50% bolder"

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 3s)
- [x] grep confirmed zero remaining triple-paren issues from sed
- [x] No projectstructure.md change


## Bold Text Refinements: Title Exclusion + Nav Inactive Buttons + Helper Trim (2026-07-11)

### User Feedback
- Remove ", especially in light mode." from the Bold Text helper description
- Don't apply bold to the title (device name at the top)
- Bold effect only appearing on the active nav button — should apply to inactive panel names too

### Fix
- [x] localize.ts: config.helper.bold_text trimmed "Makes all card text bolder for better readability, especially in light mode." → "Makes all card text bolder for better readability."
- [x] daily-panel.ts: .med-name font-weight reverted from calc(600 * var(...)) → fixed 600 (title excluded from bold)
- [x] drinks-panel.ts: .drinks-title font-weight reverted from calc(600 * var(...)) → fixed 600 (title excluded from bold, parity with daily-panel)
- [x] ax-dose-logger-card.ts: .pane-btn base rule gained explicit font-weight: calc(400 * var(--pill-font-weight-boost, 1)) — so inactive nav buttons now get the 50% boost (400→600 when on); the .pane-btn.active rule's calc(500 * var(...)) still overrides for active buttons (500→750)
- [x] README.md: bold_text description trimmed ", especially in light mode."

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.9s)
- [x] No projectstructure.md change

## Card Integration Audit + HIGH Findings Fix — Complete

### Planning
- [x] Read memory-bank context (activeContext, progress, projectstructure)
- [x] Read main card source (ax-dose-logger-card.ts — 2439 lines)
- [x] Read editor module (ax-dose-logger-editor.ts — 1021 lines)
- [x] Read types, helpers, localize
- [x] Read panel components (daily, graphs, drinks, stats)
- [x] Search for redundant/dead references, unused imports, HA best-practice violations, memory leak patterns
- [x] Compile audit findings into structured report → plans/card-integration-audit.md
- [x] Write fix plan for H1 + H2 → plans/fix-high-audit-findings-plan.md

### Audit Findings (documented in plans/card-integration-audit.md)
- [x] H1 (HIGH): installEditorGridAlignment() MutationObserver leak + global CSS injection — observer on document.body never disconnected, CSS injected into all ha-form elements cross-card
- [x] H2 (HIGH): _getDrinksOfSubstance() no cache — full O(n) entity scan on every call incl. _relevantStateChanged() on every HA state change while inventory pane active
- [x] M1 (MEDIUM): Mutating @state _activePane inside render() — violates Lit "don't update reactive props in render" contract
- [x] M2 (MEDIUM): 30s _tick does not propagate to panel components — countdowns stay stale inside panels
- [x] M3 (MEDIUM): Global CSS injection affects all ha-form elements (cross-card pollution)
- [x] M4 (MEDIUM): History re-fetch on every state change while on graphs pane — 2 recorder DB queries per state change
- [x] L1 (LOW): Unused svg import in ax-dose-logger-card.ts
- [x] L2 (LOW): Dead localize keys (pane.caffeine, caffeine.placeholder, config.graph_options)
- [x] L3 (LOW): Dead type re-exports from main card module (no consumers)
- [x] L4 (LOW): _predictLowToken should not be @state() (race-guard token has no rendering impact)
- [x] L5 (LOW): Duplicate _getTimeframeHours() in container + graphs-panel
- [x] L6 (LOW): _pendingTracking Set not cleared on disconnect/connect
- [x] L7 (LOW): _computeEntities() double iteration (low impact since cached)

### H1 Implementation — MutationObserver Leak + Global CSS Injection
- [x] ax-dose-logger-editor.ts: installEditorGridAlignment() doc-comment updated (reflects getConfigForm() call site + auto-cleanup)
- [x] ax-dose-logger-editor.ts: processForms() now returns ha-form count (was void)
- [x] ax-dose-logger-editor.ts: observer callback auto-disconnects + nulls _formStyleObserver when processForms() returns 0 (editor dialog closed)
- [x] ax-dose-logger-editor.ts: new uninstallEditorGridAlignment() export — explicit cleanup hook (defense-in-depth)
- [x] ax-dose-logger-card.ts: removed installEditorGridAlignment() call from connectedCallback()
- [x] ax-dose-logger-card.ts: added installEditorGridAlignment() call in static getConfigForm() before return buildEditorForm()

### H2 Implementation — _getDrinksOfSubstance() Cache
- [x] ax-dose-logger-card.ts: added _drinksCache field near _resolvedEntities cache
- [x] ax-dose-logger-card.ts: cache-hit check at top of _getDrinksOfSubstance() (substance + entitiesRef match returns cached drinks)
- [x] ax-dose-logger-card.ts: cache result stored after scan
- [x] ax-dose-logger-card.ts: _invalidateEntityCache() now also clears _drinksCache

### Verification
- [x] yarn run build — clean (exit 0, no warnings, dist/ax-dose-logger-card.js created in 2.8s)
- [x] No projectstructure.md change (no files added/renamed/deleted — only edits to existing files + new plan docs)
- [x] activeContext.md updated (new Current Status, prior archived)
- [x] progress.md updated (this section)

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
