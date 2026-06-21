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
