# Progress — Pill Logger Card (Frontend)

> ℹ️ **Older history (lines 2-2635 of the pre-truncation file) is archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1).** The sections below are the 16 most recent feature completions; read the archive only if you need older context.

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
