# Progress — Pill Logger Card (Frontend)

> ℹ️ **Older history (lines 2-2635 of the pre-truncation file) is archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1).** The sections below are the ~16 most recent feature completions; read the archive only if you need older context.

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

## Button State Matrix (Prosumer UI) — Take Pill / Log Drink (2026-08-09)
**Feature**: 5-state color matrix (Lockout / Idle / Execution Requested / Latency Warning / ACK Packet) on the Daily "Take Pill" and Drinks "Log Drink" buttons, with per-state 7-option visual-style dropdown + icon-pulse toggle + configurable ACK flash duration. Frontend-only. Architecture plan: [`plans/button-state-matrix-plan.md`](plans/button-state-matrix-plan.md).

- [x] Architecture plan written + approved (overdue-anchored latency 9.1A + ::after CSS ack text 9.2A)
- [x] `src/types.ts` — `ButtonStateStyle` union (7 options) + 13 new config fields on `AxDoseLoggerCardConfig`
- [x] `src/helpers.ts` — `ButtonState` type + `ButtonStateInput` + pure `resolveButtonState()` (precedence: ack → lockout → latency → execution → idle)
- [x] `src/ax-dose-logger-card.ts` — `_resolveGraceHours()` (reads `grace_hours` from adherence sensors, fallback 1.0h); `_computeDailyButtonState()` + `_computeDrinksButtonState()`; `_dailyAckActive`/`_drinksAckActive` reactive flags + `_triggerDailyAck()`/`_triggerDrinksAck()` (non-blocking setTimeout + requestUpdate); ACK triggers wired into `_handleTakePill` (direct + override-dialog confirm) + `_logDrink`; `buttonState`/`ackActive` props passed to panels in `_renderPane*`; public accessors `computeDailyButtonState`/`computeDrinksButtonState`
- [x] `src/components/daily-panel.ts` — `buttonState`/`ackActive` props; `_takeButtonClasses()`; replaced `.safe`/`.danger` + `isLimitReached`/`safeCount` locals with `this.buttonState === 'lockout'`; CSS state-color vars + 7 style options + rotating-glow `::before` + icon-pulse + ACK `::after` flash
- [x] `src/components/drinks-panel.ts` — mirror (lockout + ack only — drinks are PRN with no schedule)
- [x] `src/ax-dose-logger-editor.ts` — `_buttonStyleOptions()` helper; two new "Button" expandables (Daily: 4 state-style + 4 pulse + ack-duration; Drinks: lockout + ack only); computeLabel/computeHelper fall through to new localize keys
- [x] `src/localize.ts` — ~24 new strings (config.button, 14 config labels, 7 button_style option labels, button.ack_text, 14 helper texts)
- [x] `README.md` — Daily "Take Pill" bullet updated + dedicated "🎛️ Button State Matrix" section (state table, grace/latency explanation, 7 options, pulse, ack duration, Daily vs Drinks)
- [x] No backend change (frontend-only — backend already exposes `grace_hours`/`overdue`/`pills_safe_to_take`/`amountLast24h.remaining`)
- [x] No config migration (all 13 new fields optional with documented defaults; existing configs render as today)
- [x] No projectstructure.md change (no files added/renamed/deleted)
- [x] `yarn run build` clean (exit 0, 3.9s); dist grep confirms 23 occurrences of new keys
- [x] activeContext.md updated (new Current Status; prior 2 contexts kept; Two-Line Height Lock archived to old/)
- [x] progress.md updated (this section)

## Button State Matrix — Visual Fixes (2026-08-09)
**Feature**: Fixed three visual bugs in the Button State Matrix shipped the same day: (1) border style options expanded the button, (2) rotating border glow was a pulsing halo instead of a trailing line, (3) ACK animation merged text with the underlying button + left a green "Take Pill" lingering for 2-10s after an override press. Frontend-only. Architecture plan: [`plans/button-state-matrix-visual-fixes-plan.md`](plans/button-state-matrix-visual-fixes-plan.md).

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank (activeContext, progress), daily-panel.ts + drinks-panel.ts CSS (border/glow/ack rules + _takeButtonClasses/_logDrinkButtonClasses), helpers.ts resolveButtonState, container _triggerDailyAck/_triggerDrinksAck + _computeDailyButtonState/_computeDrinksButtonState
- [x] Step 2: Architecture plan — plans/button-state-matrix-visual-fixes-plan.md (root cause for each bug, fix approach, steps, key decisions)
- [x] Step 3: User confirmation — plan approved (45° solid-arc default + ack-as-pure-overlay + inset shadow); proceed to Code mode
- [x] Step 4: src/helpers.ts — resolveButtonState: removed `if (input.ackActive) return 'ack';` line + explanatory comment (ack is now a pure overlay driven by the panel's ackActive flag; 'ack' stays in the union for type compat but is never returned)
- [x] Step 5: src/components/daily-panel.ts — (a) Option 3 border: `border: 2px solid` → `box-shadow: inset 0 0 0 2px` (×4 colors); (b) rotating-glow ::before conic-gradient → solid-arc `color 0deg, color 45deg, transparent 45deg, transparent 360deg` (×4 colors); (c) _takeButtonClasses removed the `state === 'ack'` branch, idle early-return emits ack-flash when active, appended `if (this.ackActive) classes.push('ack-flash')` after style/pulse composition; (d) button template `style=` condition `this.buttonState === 'ack'` → `this.ackActive`; (e) ack ::after rule rewritten — gate `.ack-flash::after` (was `.state-ack.full-green::after`), added `background: var(--btn-green)` + `color: #fff` (opaque surface covers underlying text) + `border-radius: inherit` + `z-index: 2`
- [x] Step 6: src/components/drinks-panel.ts — mirror of daily-panel: (a) border → inset shadow (×2 colors: red/green); (b) rotating-glow → solid-arc (×2 colors); (c) _logDrinkButtonClasses ack branch removed + idle early-return emits ack-flash + ack-flash appended after style/pulse; (d) button `style=` condition → `this.ackActive`; (e) ack ::after rewrite (`.ack-flash::after` + opaque green surface)
- [x] Step 7: Build fix — first build emitted TS parse warnings because the CSS comments contained backticks (`` `border` `` / `` `.ack-flash` ``), which lit's `css` tagged-template parses as substitutions; removed all backticks from the CSS comments in both panels. Second build clean (exit 0, 3.8s, no warnings)
- [x] Step 8: Verification — yarn run build clean (exit 0, 3.8s); dist grep confirms new CSS present (inset 0 0 0 2px=6, ack-flash=9, transparent 45deg=6, this.ackActive ?=4) and old patterns absent (border: 2px solid=0, transparent 35%=0, state-ack.full-green=0, ackActive) return 'ack'=0)
- [x] Step 9: Update memory-bank — activeContext.md (new Current Status: Button State Matrix Visual Fixes; prior Button State Matrix + Box Relabel kept as Previous Context), progress.md (this section). No projectstructure.md change (no files added/renamed/deleted). No README change (bug fixes to visual rendering, not new end-user behavior/config).

### Key decisions
1. **Inset box-shadow for borders (no-grow)** — `box-shadow: inset 0 0 0 2px` paints the colored ring inside the existing padding box so the button's outer dimensions never change. Standard CSS technique; works under `overflow: hidden` (shadows aren't clipped by overflow). The `icon_border` option composes `icon-${color}` + `border-${color}`, so it picks up the inset shadow automatically.
2. **Solid-arc conic gradient for the trailing line** — 45° colored arc on a transparent gradient is the modern-UI trailing-line idiom (Stripe/GitHub loaders). The existing `::before` mask + rotate infrastructure stays; only the gradient value changes. 45° is a tunable default.
3. **Ack = pure overlay, not a button state (core fix for bug 3b)** — `resolveButtonState()` no longer returns `'ack'`; the panel's `ackActive` flag drives a dedicated `.ack-flash` overlay class. The button keeps its true state underneath the flash, so there is no "wrong color lingering" gap between the ack timer expiring and the backend state arriving. The `ack-style` config option is kept in the editor but becomes effectively a no-op for the overlay surface (solid green for legibility) — accepted trade-off to minimize editor churn.
4. **Opaque green overlay surface (fix for bug 3a)** — `background: var(--btn-green)` + `color: #fff` + `border-radius: inherit` fully covers the underlying button text, then fades to reveal the true state. `z-index: 2` places it above the rotating-glow `::before` (z-index 0) and the button content.
5. **`ButtonState` union keeps `'ack'`** — removing it would touch the editor schema + types + localize for no functional benefit; the value stays in the union, the resolver simply never returns it.
6. **`this.ackActive` drives both the class and the inline CSS vars** — the button's `style=` condition changed from `this.buttonState === 'ack'` to `this.ackActive` so `--ack-duration`/`--ack-text` are present whenever the overlay is active (the resolver no longer returns `'ack'`, so the old condition would never fire).
7. **No backticks in lit `css` template comments** — the first build failed TS parsing because the CSS comments contained backticks, which lit's `css` tagged-template literal parses as substitution placeholders. Removed all backticks from CSS comments in both panels; build then clean.
8. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure frontend CSS + one resolver line + one panel-template condition. No new config, no migration. Bug fixes to visual rendering, not new end-user behavior.

## Apple Intelligence Border Glow (Comet Sweep) (2026-08-09)
**Feature**: Replaced the "Rotating Border Glow" button style's hard-edged 45° solid-arc conic gradient with a smooth Apple Intelligence / Siri-style "comet sweep" — a bright white-tipped head fading into a transparent tail that travels the masked border ring. Also fixed the ring being half-clipped by the button's `overflow: hidden`. Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes
1. **Hard-edged arc, not a gradient** — the conic-gradient `color 0deg, color 45deg, transparent 45deg` painted a flat wedge with a hard cliff at 45° (a "spinning bar"), not a glowing comet. The Apple effect is a comet: bright head + smooth fading tail over ~20-25% of the ring, the rest transparent.
2. **`overflow: hidden` clipped `inset: -2px`** — the `::before` sat 2px outside the button edge, but the button clips to the padding box, so the outer 2px of the ring was cut — only ~half a thin, off-center ring survived instead of a crisp 2px border-trace.

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank activeContext (Button State Matrix Visual Fixes), located glow CSS in daily-panel.ts + drinks-panel.ts, inspected both `::before` blocks + the `overflow: hidden` container rule
- [x] Step 2: Architecture plan — plans/apple-intelligence-border-glow-plan.md (two root causes, comet-tail gradient spec, inset:0 fix, color-mix decision, steps)
- [x] Step 3: User confirmation — plan approved with `color-mix(in srgb, color, #fff)` white-tipped head; proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) replaced the 4 hard-arc conic-gradients (red/blue/amber/green) with comet-tail `from 0deg, transparent 0→280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg`; (b) shared `::before` block `inset: -2px` → `inset: 0`; (c) animation `2.5s` → `2.2s` linear infinite; (d) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) 2 comet-tail gradients (red/green); (b) `inset: -2px` → `inset: 0`; (c) `2.5s` → `2.2s`; (d) updated comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.1s, no warnings); dist grep confirms new patterns present (`color-mix(in srgb`=6, `transparent 280deg`=6, `2.2s linear infinite`=2, `inset: 0`=4) and old patterns absent (`transparent 45deg`=0, `2.5s linear infinite`=0, `inset: -2px`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow; prior Button State Matrix Visual Fixes + Button State Matrix kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only refinement of an existing style option, not new end-user behavior/config).

### Key decisions
1. **Comet-tail conic gradient** — `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg)`. Transparent for ~78% of the ring, ramps up over 40° to a white-tipped bright head at the 0/360° seam; the whole ring rotates so the head sweeps continuously. This is the masked-gradient-traveling-the-border idiom, not a spinning bar.
2. **`color-mix(in srgb, color, #fff)` white-tipped head** — lifts the comet head toward white for the Apple Intelligence shimmer without a new CSS var. Supported in the HA browser baseline (Chrome 111+/Safari 16.2+/Firefox 113+). User approved this over the plain-state-color alternative.
3. **`inset: -2px` → `inset: 0` (ring-clip fix)** — the ring now sits flush at the button's padding-box edge, fully inside the `overflow: hidden` clip, so the full 2px mask ring is visible and crisp. The `padding: 2px` + `mask-composite: exclude` ring-width mechanism is unchanged.
4. **Duration 2.5s → 2.2s, linear** — slightly brisker to match the Apple sweep cadence; linear (no easing) so the loop reads as constant-speed travel, not stutter.
5. **`color-mix` not escaped in CSS comments** — the new comments avoid backticks (lesson from the prior build's lit `css` template parse failure); build clean on first try.
6. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS refinement of an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering match the name.

## Apple Intelligence Border Glow v2 (Angle-Sweep + Dual Mask) (2026-08-09)
**Feature**: Corrected the v1 comet-tail glow that still rendered as a "static gradient line doing a radar sweep through the middle of the card." v1 changed the gradient shape and `inset` but did not fix the actual rendering failure. v2 fixes the two structural defects: (1) the mask never hollowed the center in modern Chromium (only `-webkit-mask` was declared, but `mask-composite: exclude` operates on the unprefixed `mask` → no list to composite → full conic pie rendered as a radar), and (2) animating `transform: rotate()` on the `::before` clipped the rotating corners under the button's `overflow: hidden`. v2 animates the **gradient angle** via `@property --ax-glow-angle` (element stays static, no corner clip) and declares **both** `mask:` and `-webkit-mask:` (so `mask-composite: exclude` hollows the center → only the 2px ring shows). Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes (v1 failure)
1. **Mask never applied in modern Chromium** — the shared `::before` block declared only `-webkit-mask:` (prefixed shorthand) but set `mask-composite: exclude` (unprefixed composite). In modern Chrome (HA's browser base), `mask-composite` operates on the unprefixed `mask` property, which was never set → no mask image list to composite → the center never hollowed → the full conic-gradient pie rendered → rotating it read as a radar sweep, not a border trace. (Gemini's visual diagnosis confirmed this.)
2. **`transform: rotate()` clips corners under `overflow: hidden`** — rotating the whole `::before` square rotates its bounding box; the parent's `overflow: hidden` clips the rotating corners, producing artifacts even once the mask is fixed.

### Checklist
- [x] Step 1: Context grounding — re-read the v1 glow CSS in daily-panel.ts + drinks-panel.ts; confirmed the `-webkit-mask`-only / `mask-composite: exclude` mismatch; confirmed `overflow: hidden` on the button container
- [x] Step 2: Architecture plan v2 — plans/apple-intelligence-border-glow-plan.md (root cause = mask not applied; fix = dual mask + @property angle-sweep; `@property` browser-baseline note)
- [x] Step 3: User confirmation — plan v2 approved (use @property --ax-glow-angle angle-sweep + dual mask); proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) added `@property --ax-glow-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }` at the top of the `static styles` block; (b) replaced `@keyframes ax-btn-glow-rotate { to { transform: rotate(360deg); } }` with `@keyframes ax-btn-glow-sweep { to { --ax-glow-angle: 360deg; } }`; (c) 4 comet-tail gradients now use `conic-gradient(from var(--ax-glow-angle, 0deg), …)` instead of `from 0deg`; (d) added unprefixed `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)` alongside the existing `-webkit-mask:`; (e) animation ref `ax-btn-glow-rotate` → `ax-btn-glow-sweep`; (f) updated comment header to explain the angle-sweep + dual-mask approach
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) `@property --ax-glow-angle` at top of styles; (b) `ax-drink-btn-glow-rotate` → `ax-drink-btn-glow-sweep` keyframes; (c) 2 gradients use `from var(--ax-glow-angle, 0deg)`; (d) dual mask; (e) animation ref updated; (f) comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.0s, no warnings); dist grep confirms new patterns present (`@property --ax-glow-angle`=2, `var(--ax-glow-angle`=6, `mask: linear-gradient(#000 0 0) content-box`=4, `ax-btn-glow-sweep`=2, `ax-drink-btn-glow-sweep`=2) and old patterns absent (`ax-btn-glow-rotate`=0, `ax-drink-btn-glow-rotate`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v2; v1 + Button State Matrix Visual Fixes kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only structural fix to an existing style option).

### Key decisions
1. **Animate the gradient angle, not the element transform (core fix for the radar-pie + corner-clip)** — `@property --ax-glow-angle { syntax: '<angle>'; initial-value: 0deg; }` + `conic-gradient(from var(--ax-glow-angle, 0deg), …)` + `@keyframes { to { --ax-glow-angle: 360deg } }`. The `::before` stays static → no corner clipping under `overflow: hidden`; only the gradient sweeps around the ring. This is the Apple-style robust technique (vs. rotating the element).
2. **Dual mask (prefixed + unprefixed) — core fix for the mask never applying** — declared both `-webkit-mask:` and `mask:` (and both `-webkit-mask-composite: xor` and `mask-composite: exclude`). The unprefixed `mask` is what `mask-composite` composites against in modern Chromium; declaring only `-webkit-mask` left no list → center never hollowed → radar pie. The fix is a one-line addition (`mask: …`).
3. **`@property` browser baseline** — supported in Chrome 85+/Edge 85+/Safari 16.4+/Firefox 128+, within HA's evergreen browser baseline. Without `@property` registration, animating a `--angle` var would not interpolate (it would jump, not sweep). This is a slightly newer dependency than v1's `color-mix` but still within baseline.
4. **Comet-tail gradient + geometry kept from v1 (correct)** — `from var(--ax-glow-angle, 0deg), transparent 0→280deg, color 320deg, color-mix(color 60%, #fff) 350deg, #fff 360deg`; `inset: 0`, `padding: 2px`, `border-radius: inherit`, 2.2s linear. v1's gradient shape and ring geometry were correct; only the mask and animation mechanism were broken.
5. **`@property` at top of `css` block (not nested)** — `@property` is a top-level at-rule; placing it inside a selector would be invalid. Registered once per panel's shadow DOM with the same `--ax-glow-angle` name (identical `initial-value`); cheap and correct.
6. **No backticks in lit `css` template comments** — continued discipline from the earlier build parse failure; build clean on first try.
7. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS structural fix to an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it.

## Apple Intelligence Border Glow v3 (Oversized Rotating ::before + Extended Solid-Middle Gradient) (2026-08-09)
**Feature**: Corrected the v2 glow that rendered the border trace correctly but (1) did not animate (frozen gradient) and (2) the comet was too short with no solid color section (amber/red confusion risk). v3 drops the unreliable `@property --ax-glow-angle` angle-sweep (which silently failed to register inside Lit's adopted stylesheet → `--ax-glow-angle` stayed unregistered → not interpolable → frozen) and switches to the **oversized rotating `::before`** technique (`inset: -150%`, `transform: rotate(360deg)`) — the element is 400% of the button size so its rotating square always covers the button at every angle (no corner gaps), the button's `overflow: hidden` clips it to the rounded rect, and the `padding: 2px` + dual `mask-composite: exclude` hollows the center → only the 2px ring shows. The gradient is also redesigned to a **75% line with a solid-color middle 50%** so the state color stays unambiguous: `0deg→33deg` transparent→white-tipped head (`color-mix(color 60%, #fff)`), `33deg→67.5deg` head→solid ramp, `67.5deg→202.5deg` SOLID state color (135deg, the unambiguous middle), `202.5deg→270deg` solid→transparent tail, `270deg→360deg` transparent gap (90deg). Frontend-only. Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root causes (v2 failure)
1. **`@property` silently unregistered inside Lit adopted stylesheet** — the `@property --ax-glow-angle` block survived into the dist (verified) but did not reliably register the custom property when processed in the constructed-stylesheet context used by Lit's `css` tagged template + `adoptedStyleSheets`. An unregistered CSS custom property is not interpolable, so `@keyframes { to { --ax-glow-angle: 360deg } }` jumped to the end state on frame 1 → frozen gradient ("static gradient like on the top right"). This is a known Lit/Chromium fragility; relying on `@property` for the animation was the wrong call.
2. **Comet too short + no solid color section** — the v2 gradient was transparent for ~78% of the ring with only a ~40deg colored sweep; the user wanted a longer line (~75%) with a solid-color middle so amber vs red cannot be confused.

### Checklist
- [x] Step 1: Context grounding — re-read the v2 glow CSS in daily-panel.ts + drinks-panel.ts; verified `@property` survived into dist (lines 3123 + 4895) but the animation was frozen; confirmed Lit 3.3.2 + adopted-stylesheet `@property` fragility as the cause
- [x] Step 2: Architecture plan v3 — plans/apple-intelligence-border-glow-plan.md (animation fix = oversized rotating ::before, no @property; gradient = 75% line with solid middle 50% + white-tipped head + 90deg gap)
- [x] Step 3: User confirmation — plan v3 approved; proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) removed the `@property --ax-glow-angle` block from the top of `static styles`; (b) `@keyframes ax-btn-glow-sweep { to { --ax-glow-angle: 360deg } }` → `@keyframes ax-btn-glow-sweep { to { transform: rotate(360deg) } }`; (c) 4 gradients rewritten to the extended solid-middle shape (`from 0deg, transparent 0deg, color-mix(color 60%, #fff) 33deg, color 67.5deg, color 202.5deg, transparent 270deg, transparent 360deg`) — no `var(--ax-glow-angle)`; (d) `::before` shared block: `inset: 0` → `inset: -150%`, removed `border-radius: inherit` (oversized element; the button's overflow:hidden + border-radius clip to the rounded rect), kept dual mask + `padding: 2px`; (e) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: removed `@property`; `ax-drink-btn-glow-sweep` keyframes → `transform: rotate(360deg)`; 2 gradients rewritten; `::before` `inset: -150%` + dropped `border-radius: inherit`; dual mask kept; comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.0s, no warnings); dist grep confirms new patterns present (`inset: -150%`=4, `ax-btn-glow-sweep`/`ax-drink-btn-glow-sweep`=4, `202.5deg`=6, `transparent 270deg`=6) and old v2 patterns absent (`@property --ax-glow-angle`=0, `var(--ax-glow-angle`=0, `transparent 280deg`=0). The 2 remaining `border-radius: inherit` are in the ack `::after` overlay (unrelated, correct to keep).
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v3; v2 + v1 kept as Previous Context), progress.md (this section). No projectstructure.md change. No README change (CSS-only structural fix to an existing style option).

### Key decisions
1. **Oversized rotating `::before` (core animation fix)** — `inset: -150%` makes the element 400% of the button size, centered. A rotating square that large always fully contains the button at every angle → no corner gaps. The button's `overflow: hidden` clips it to the rounded rect, and `padding: 2px` + `mask-composite: exclude` hollows the center → only the 2px ring shows. Animates via `transform: rotate()` (always interpolable, no `@property`). This is the standard "overflow-hidden parent + oversized rotating child" CSS spinner technique — robust and cross-browser.
2. **Drop `@property --ax-glow-angle`** — it survived the build but silently failed to register inside Lit's adopted stylesheet in the target browser, leaving the custom property unregistered → not interpolable → frozen gradient. `transform` animation does not need `@property` and animates reliably. This removes the v2 `@property`/browser-baseline dependency entirely.
3. **Extended 75% line with solid middle 50% (color-clarity fix)** — `0deg→33deg` transparent→white-tipped head, `33deg→67.5deg` head→solid ramp, `67.5deg→202.5deg` SOLID state color (135deg), `202.5deg→270deg` solid→transparent tail, `270deg→360deg` transparent gap (90deg). The solid 135deg middle makes the state color unambiguous (amber vs red cannot be confused); the white-tipped head + fading tail keep the Apple aesthetic.
4. **Drop `border-radius: inherit` on the oversized `::before`** — the 400%-sized element has no meaningful radius; the button's own `overflow: hidden` + `border-radius` clip the painted area to the rounded rect, and the mask's `content-box` produces the rounded ring. Keeping `border-radius: inherit` on the oversized element would have produced a giant rounded shape, not the desired flat-clip-then-mask behavior.
5. **Dual mask kept from v2 (correct)** — both `-webkit-mask:` and `mask:` (and both composites) stay; this is what makes `mask-composite: exclude` actually hollow the center in modern Chromium. v2's mask fix was correct; only the animation mechanism was broken.
6. **No backticks in lit `css` template comments** — continued discipline; build clean on first try.
7. **No backend / config-flow / editor / types / localize / README / projectstructure change** — pure CSS structural fix to an existing style option. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it (animated + color-clear).

## Apple Intelligence Border Glow v4 (Two-Layer .glow-track + ::before) (2026-08-09)
**Feature**: Corrected the v3 glow that "failed to render at all." v3 put both the rotation-oversize (`inset: -150%`) and the mask-ring (`padding: 2px` + `mask-composite: exclude`) on the **same `::before`** — but the mask's `content-box` ring follows the element's own box, so oversizing the element moved the ring onto the 400%-sized element's perimeter (~150% beyond the button edge), where the button's `overflow: hidden` clipped it away → nothing rendered. v4 adopts the user-provided **two-layer architecture**: Layer 1 `.glow-track` (a real div inserted as the button's first child) is button-sized (`inset: 0`), holds the mask that carves the 2px ring on the button edge, `border-radius: inherit` for rounded corners, and `overflow: hidden` to clip the rotating child to the perimeter; Layer 2 `.glow-track::before` is the oversized (`inset: -150%`) rotating gradient source — no mask, just `transform: rotate(360deg)` + `conic-gradient` — the track's mask carves the 2px ring from this rotating gradient. The glow state classes stay on the button and target the child via descendant selectors (`.glow-red .glow-track::before`). Gradient (user's exact stops): solid color `67.5°→202.5°` (135°, the unambiguous middle 50% of the line), white-tipped head via `color-mix(color 60%, #fff)` at `270deg`, crisp head edge (`270→270.1deg` near-zero stop), transparent gap `270.1°→360°` (~25% empty). Frontend-only (CSS + a non-conditional template div). Architecture plan: [`plans/apple-intelligence-border-glow-plan.md`](plans/apple-intelligence-border-glow-plan.md).

### Root cause (v3 failure)
**The mask-ring and the rotation-oversize cannot share one element.** v3 put both on the `::before`: `inset: -150%` (oversized, to rotate without corner gaps) + `padding: 2px` + `mask: ... content-box ...; mask-composite: exclude` (carve the ring). The mask's `content-box` ring is computed from the element's **own box** — so with `inset: -150%`, the ring sat on the perimeter of the 400%-sized element, ~150% beyond the button. The button's `overflow: hidden` then clipped everything outside the button → the entire mask ring was clipped away → nothing rendered. In v1/v2 (`inset: 0`), the `::before` was button-sized, so the ring sat on the button edge and rendered; v3's oversize moved the ring off the button and the clip removed it. **Fundamental rule: the mask-ring must live on a button-sized element; the rotation-oversize must live on a child of that element.**

### Checklist
- [x] Step 1: Context grounding — re-read the v3 glow CSS in daily-panel.ts + drinks-panel.ts; diagnosed the v3 render failure (oversize + mask on one element → ring clipped away); inspected both button templates + the `.take-pill-btn`/`.log-drink-btn` base CSS (`overflow: hidden`, `position: relative`)
- [x] Step 2: Architecture plan v4 — plans/apple-intelligence-border-glow-plan.md (two-layer .glow-track + ::before; template change required; adopt user's gradient stops; fundamental rule documented)
- [x] Step 3: User confirmation — plan v4 approved (user provided the exact two-layer snippet); proceed to Code mode
- [x] Step 4: src/components/daily-panel.ts — (a) template: added `<div class="glow-track"></div>` as the first child of the Take Pill `<button>` (before the `<ha-icon>`); (b) CSS: replaced the v3 `::before`-on-button glow block with two layers — `.take-pill-btn .glow-track` (button-sized mask layer: `inset: 0`, `padding: 2px`, `border-radius: inherit`, `overflow: hidden`, dual mask + `mask-composite: exclude`, `z-index: 0`, `pointer-events: none`) and `.take-pill-btn .glow-track::before` (oversized rotating gradient: `inset: -150%`, `animation: ax-btn-glow-sweep 2.2s linear infinite`); (c) 4 state-color gradients via descendant selectors `.take-pill-btn.glow-X .glow-track::before` using the user's stops; (d) removed a stray `content: ''` from the real `.glow-track` div (content only applies to pseudo-elements); (e) updated comment header
- [x] Step 5: src/components/drinks-panel.ts — mirror: (a) template `<div class="glow-track"></div>` as first child of the Log Drink button; (b) CSS two-layer `.glow-track` + `.glow-track::before`; (c) 2 state-color gradients (red/green) via descendant selectors; (d) comment header
- [x] Step 6: Verification — `yarn run build` clean (exit 0, 4.4s, no warnings; the 2 lit-plugin `tabindex` errors at lines 212/241 are pre-existing in the stats-column boxes, unrelated to the glow, and rollup transpiles without type-checking); dist grep confirms new patterns present (`glow-track`=16, `glow-track::before`=10, descendant selectors `.glow-X .glow-track::before`=6, `270.1deg`=8, `270deg`=8) and old v3 patterns absent (`.take-pill-btn.glow-X::before`=0, `.log-drink-btn.glow-X::before`=0)
- [x] Step 7: Update memory-bank — activeContext.md (new Current Status: Apple Intelligence Border Glow v4; v3 + v2 kept as Previous Context), progress.md (this section). No projectstructure.md change (no source file added — the `.glow-track` div is a template element). No README change (CSS + template div, not new end-user behavior/config).

### Key decisions
1. **Two-layer architecture (the core fix)** — the mask-ring (button-sized, `inset: 0`) and the rotation-oversize (`inset: -150%`) must live on **separate elements**. `.glow-track` (button-sized) holds the mask that carves the 2px ring on the button edge + `overflow: hidden` to clip the rotating child to the rounded perimeter; `.glow-track::before` (oversized) is the rotating gradient source. The track's mask carves the ring from the rotating gradient. This is the only architecture that satisfies both "ring on the button edge" (mask follows the button-sized element) and "no corner gaps" (oversized rotating child).
2. **Real `.glow-track` div in the template (required)** — a `::before` on the button cannot simultaneously be the masked button-sized layer AND host a rotating oversized child. A real `<div class="glow-track"></div>` inserted as the button's first child is the masked layer; its own `::before` is the oversized rotator. The div is always present (cheap; only visibly renders when a `glow-*` class is on the button, since otherwise the `::before` has no background).
3. **Descendant selectors for state color** — the glow state classes (`glow-red` etc.) stay on the button (from `_takeButtonClasses`/`_logDrinkButtonClasses`); the gradient targets the child via `.glow-red .glow-track::before`. No change to the class helper logic.
4. **Adopt user's gradient stops** — `transparent 0deg, color 67.5deg, color 202.5deg, color-mix(color 60%, #fff) 270deg, transparent 270.1deg, transparent 360deg`: solid middle 67.5°→202.5° (135°, unambiguous 50% of the line), white-tipped head at 270°, crisp head edge (270→270.1° near-zero stop), 90° transparent gap. The `270→270.1deg` hard transition creates the sharp comet head the user specified.
5. **`transform: rotate()` animation (kept from v3, no `@property`)** — animates the oversized `.glow-track::before`; always interpolable. The mask lives on the static `.glow-track`, so the ring geometry never moves — only the gradient sweeps.
6. **Dual mask kept (correct since v2)** — both `-webkit-mask:` and `mask:` (and both composites) on the `.glow-track`; this is what makes `mask-composite: exclude` hollow the center in modern Chromium.
7. **Removed stray `content: ''` from the real `.glow-track` div** — `content` only applies to `::before`/`::after`, not real elements; harmless but cleaned up for correctness.
8. **No backticks in lit `css` template comments** — continued discipline; build clean.
9. **No backend / config-flow / editor / types / localize / README / projectstructure change** — CSS + a non-conditional template div. The "Rotating Border Glow" label already described the intended effect; this makes the rendering actually match it (renders + animated + color-clear). The pre-existing lit-plugin `tabindex` errors are unrelated and out of scope.

## Glow Speed Dropdown + ACK (Logged) Style Rework (2026-08-09)
**Feature**: Four user-requested changes to the Take Pill / Log Drink buttons: (1) accepted the conic-gradient glow's corner speed variation (inherent to rotating a gradient around a non-circular shape — the gradient sweeps angle at constant rate but the rounded-rect perimeter packs more angle into less arc at the corners; user confirmed: keep the sweep look, current 2.2s = "fast"); (2) added a per-button "Rotating Glow Speed" dropdown (slow 6s / medium 4s / fast 2.2s) at the bottom of each button settings expandable, driven by a single `--glow-duration` CSS var on the animation rule (one `@keyframes`, variable duration); (3) removed the dead "Logged Icon Pulse" config (`take_button_ack_pulse` / `drink_button_ack_pulse` — defined in types/editor/localize but never read by the class helpers; the ACK is an overlay, not an icon pulse); (4) replaced the dead "Logged Style" 7-option dropdown (also never read — the ACK overlay was fixed) with 3 real `ack_layout` options — `top` (default, mirrors button layout: icon over text), `inline` (tick + text on one line, the prior behavior), `big` (large check only, no text) — using a real `<ha-icon icon="mdi:check-bold">` inside a conditional `<div class="ack-flash ack-top|inline|big">` template element (the prior CSS `::after` pseudo-element cannot render a Lit `ha-icon` component). Frontend-only. Architecture plan: [`plans/glow-speed-and-ack-style-plan.md`](plans/glow-speed-and-ack-style-plan.md).

### Checklist
- [x] Step 1: Context grounding — read activeContext, projectstructure, daily-panel.ts (glow CSS, ACK `::after`, `_takeButtonClasses`), drinks-panel.ts (mirror), editor.ts (`_buttonStyleOptions`, `take_button_box`/`drink_button_box` schemas), types.ts (config fields, `ButtonStateStyle`), helpers.ts (`ButtonState`, `resolveButtonState`), localize.ts (`button_style.*`, `button.ack_text`, config helpers)
- [x] Step 2: User confirmation — keep conic-gradient sweep (accept corner speed variation); current 2.2s = "fast"; no engine rewrite to offset-path
- [x] Step 3: Architecture plan — plans/glow-speed-and-ack-style-plan.md (4 changes: glow speed dropdown via `--glow-duration` CSS var; remove dead `ack_pulse`; replace `ack_style` with `ack_layout` 3 options; shift ACK from CSS `::after` to a real `<div>` + `<ha-icon icon="mdi:check-bold">` in template)
- [x] Step 4: User approval — plan approved; switch to Code mode
- [x] Step 5: src/types.ts — removed `take_button_ack_pulse`, `drink_button_ack_pulse`, `take_button_ack_style`, `drink_button_ack_style`; added `take_button_glow_speed`/`drink_button_glow_speed` (`GlowSpeed` = 'slow'|'medium'|'fast'), `take_button_ack_layout`/`drink_button_ack_layout` (`AckLayout` = 'top'|'inline'|'big'); added `GlowSpeed` + `AckLayout` type definitions after `ButtonStateStyle`
- [x] Step 6: src/ax-dose-logger-editor.ts — added `_ackLayoutOptions()` + `_glowSpeedOptions()` module-scoped helpers (alongside `_buttonStyleOptions`); in `take_button_box`: replaced `ack_style` select with `ack_layout` select, removed `ack_pulse` boolean, added `glow_speed` select at the bottom; mirrored in `drink_button_box`
- [x] Step 7: src/localize.ts — added `glow_speed.*` (Slow/Medium/Fast), `ack_layout.*` (Top tick mark and text / Tick mark and text inline / Big tick mark), `config.*_glow_speed` (Rotating Glow Speed), `config.*_ack_layout` (Logged Style) + helper strings; removed `config.*_ack_pulse`, `config.*_ack_style` + helpers; updated `button.ack_text` comment (CSS `::after` → real ack overlay element)
- [x] Step 8: src/components/daily-panel.ts — (a) imported `AckLayout`, `GlowSpeed` from types; (b) added `_glowDuration()` (slow 6s / medium 4s / fast 2.2s) + `_ackLayout()` (default 'top') helpers after `_takeButtonClasses`; (c) button template: inline `style` now always sets `--glow-duration` (+ `--ack-duration` when ackActive), and conditionally renders `<div class="ack-flash ack-{layout}">` containing `<ha-icon icon="mdi:check-bold" class="ack-icon">` + optional `<span class="ack-text">` (omitted in `big`); (d) CSS: glow `::before` animation duration → `var(--glow-duration, 2.2s)`; replaced the `.ack-flash::after` block with `.ack-flash` base + `.ack-top` / `.ack-inline` / `.ack-big` layout classes
- [x] Step 9: src/components/drinks-panel.ts — mirror of Step 8 (import, helpers, template, glow duration CSS var, ACK `::after` → `.ack-flash` div + 3 layout classes)
- [x] Step 10: Verification — `yarn run build` clean (exit 0, 4.1s, no warnings; the 2 lit-plugin `tabindex` errors are pre-existing, unrelated). Dist grep confirms: new patterns present (`glow-duration`=4, `check-bold`=4, `ack-top|ack-inline|ack-big`=18, `glow_speed|ack_layout`=40, `class="ack-text"`=2) and old dead patterns absent (`ack_pulse`=0, `ack_style`=0, `var(--ack-text)`=0; the lone `ack-flash::after` match is a comment in helpers.ts, not CSS)
- [x] Step 11: Update memory-bank — activeContext.md (new Current Status; glow v4 archived as Previous Context), progress.md (this section). No projectstructure.md change (no source file added/removed). README updated for the new user-facing config options (glow speed + ACK layout).

### Key decisions
1. **Keep conic-gradient (user decision)** — the corner speed variation is inherent to rotating a gradient around a non-circle (angle sweeps at constant rate; perimeter distance per angle is non-uniform on a rounded rect). User confirmed: keep the sweep look, accept the variation, current 2.2s = "fast". No engine rewrite to `offset-path` motion path.
2. **CSS var `--glow-duration`, not duplicate `@keyframes`** — one animation rule per panel, the duration is a variable. The panel sets `--glow-duration` inline on the button (always, not gated on a glow state class) so it's ready when the state transitions; harmless when no glow class is active (the `::before` has no background).
3. **Per-button glow speed** (not a single card-level field) — matches the existing per-button structure (`take_button_box` / `drink_button_box` are separate expandables). Each button can have its own speed.
4. **Remove dead config, no migration** — `ack_pulse` and `ack_style` were never read by `_takeButtonClasses` / `_logDrinkButtonClasses` (the ACK is a fixed overlay), so no user has meaningful values. Renaming `ack_style` → `ack_layout` with a fresh 3-option set is clean; old keys are silently ignored.
5. **Real `<ha-icon>` in template, not CSS `::after`** — required because `ha-icon` is a Lit component that cannot render inside a pseudo-element. The tradeoff: a conditional template element instead of pure CSS, but this is the correct HA pattern (HA cards render real `ha-icon` elements, not unicode glyphs like `✓`).
6. **`mdi:check-bold`** — the user-specified icon, rendered via `<ha-icon icon="mdi:check-bold">` in all 3 layouts.
7. **`ack-flash` class on button kept** — harmless marker; the class helpers still push it (minimal code change — only the CSS `::after` rule is deleted, replaced by `.ack-flash` div CSS; the class push stays). The visible rendering now comes from the `.ack-flash` div + layout modifier in the template.
8. **Pre-existing lit-plugin `tabindex` errors** — 4 total across the two panels (stats-column boxes); unrelated to this work; rollup transpiles without type-checking so the build is clean.

## Button Submenu Optimization (2026-08-09)

**Feature:** Four fixes to the visual editor's **Daily Tab → Button** and **Drinks Tab → Button** submenus: (A) label renames for patient-facing terminology, (B) fix the 3-selector stack bug on Logged Style + Rotating Glow Speed, (C) visual grouping so it is clear which tickbox pairs with which dropdown, (D) editor defaults that match the runtime fallbacks. Architecture plan: [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md).

### Planning
- [x] Step 1: Context grounding — read frontend memory-bank/activeContext.md + projectstructure.md; read [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) (Button submenu schema, lines 603-662 + 1010-1047), [`localize.ts`](src/localize.ts) (button labels + helpers, lines 275-290 + 413-428), [`types.ts`](src/types.ts:150-189) (config keys + defaults comments), [`daily-panel.ts`](src/components/daily-panel.ts:60-104) + [`drinks-panel.ts`](src/components/drinks-panel.ts:56-89) (runtime `?? <default>` fallbacks), [`README.md`](README.md:111-145) (Button State Matrix section)
- [x] Step 2: Root-cause the 3-selector stack bug — verified HA's `SelectSelectorMode` in `/usr/src/homeassistant/homeassistant/helpers/selector.py:1782` has only LIST + DROPDOWN modes; `ha-selector-select` auto-selects LIST (stacked radios) for ≤3 options with no explicit `mode`, DROPDOWN for >3 options. The 7-option style selects auto-defaulted to dropdown; the 3-option `ack_layout` + `glow_speed` selects auto-defaulted to LIST. Confirmed via hundreds of explicit `SelectSelectorMode.DROPDOWN` examples in HA Core config flows.
- [x] Step 3: Draft architecture plan (§2.1 renames, §2.2 dropdown mode, §2.3 nested-expandable section breaks, §2.4 default-population) → [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md)
- [x] Step 4: User approved the plan as written

### Implementation (initial — nested expandables)
- [x] Step 5: [`localize.ts`](src/localize.ts) — renamed 4 style labels + 3 pulse labels (config keys unchanged) + helper strings; added 5 `config.button_section_*` section-title keys
- [x] Step 6: [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — added `mode: 'dropdown'` to all 8 select selectors + `default: ...` to all 14 fields + restructured each Button submenu into nested flatten-expandables (one per aspect, 3x nesting: Button → Aspect → grid)
- [x] Step 7: [`README.md`](README.md) — renamed the state matrix table rows + prose references; added section-break description
- [x] Step 8: `yarn run build` clean (exit 0, 4.7s); dist grep confirmed all new patterns present + old patterns absent

### Revision (user feedback → Option A)
- [x] Step 9: User feedback — "3x nesting can become more confusing than helpful"; asked to separate the button settings without nested collapsibles
- [x] Step 10: Presented 4 options (A: flat list + grid pairing, B: flat + constant-selector dividers, C: keep nested expandables, D: flat no grouping); user chose **Option A** (flat list + grid pairing, 2x nesting only)
- [x] Step 11: [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — collapsed the nested expandables back into a flat list of aspect grids (Daily: 5 grids, Drinks: 3 grids); each style dropdown + its pulse toggle paired side-by-side in a `type: 'grid'` row; 2x nesting only (Button → grids)
- [x] Step 12: [`localize.ts`](src/localize.ts) — removed the 5 `config.button_section_*` section-title keys (no longer needed — Option A has no section titles; the label names themselves convey aspect identity)
- [x] Step 13: [`README.md`](README.md) — updated the section-break description to reflect the flat-list + grid-pairing structure (removed "section header" mention)
- [x] Step 14: [`plans/button-submenu-optimization-plan.md`](plans/button-submenu-optimization-plan.md) — updated §2.3 to reflect the Option A decision (flat list + grid pairing, no nested expandables)

### Verification
- [x] Step 15: `yarn run build` clean (exit 0, 4.5s)
- [x] Step 16: Dist grep — `mode: 'dropdown'`=8, `button_section_`=0 (removed), `Limit Reached Style`=3, `Take Pill Style`=1, `Overdue Warning Style`=1, `Logged Dose Indicator Style`=2, `Execution Requested Style`=0 (old gone), `Latency Warning Style`=0 (old gone), `default: 'full'`=2, `default: 3000`=2, `default: 'fast'`=2, `default: 'top'`=2, `default: true`=6 (includes pre-existing show_amount_in_body etc). All expected counts confirmed.
- [x] Step 17: No backend / coordinator / store / config-flow / types.ts / daily-panel.ts / drinks-panel.ts / ax-dose-logger-card.ts changes (runtime `?? <default>` fallbacks already correct — they stay as defense-in-depth)
- [x] Step 18: No projectstructure.md change (no source files added/removed — only in-place edits to editor/localize/README + new plan doc)

### Documentation
- [x] Step 19: Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status for Button Submenu Optimization; prior Glow Speed Rework status archived to `old/activeContext-archive.md`; kept the 2 Apple Intelligence Glow prior-context blocks)
- [x] Step 20: Update [`memory-bank/progress.md`](memory-bank/progress.md) (this section; archived oldest Daily/Drinks Button Two-Line Height Lock section to `old/progress-archive.md`)
- [x] Step 21: [`README.md`](README.md) updated (Button State Matrix section — state row renames + prose terminology + editor structure description)

### Key decisions
1. **Label renames are localize-only, no config-key changes** — the config keys are deeply embedded in [`types.ts`](src/types.ts), the editor schema, the panel runtime fallbacks, and persisted user configs. Renaming keys would require a migration and break existing configs. The user asked for label changes, not structural renames.
2. **`mode: 'dropdown'` on ALL selects, not just the 3-option ones** — consistent rendering across the entire Button submenu + future-proof (if options are ever reduced to ≤3, the rendering stays dropdown). The HA best-practice approach (hundreds of explicit `SelectSelectorMode.DROPDOWN` examples in HA Core).
3. **Option A (flat list + grid pairing), NOT nested expandables** — the initial implementation used nested flatten-expandables (3x nesting). User feedback: "3x nesting can become more confusing than helpful." Revised to Option A: flat list of aspect grids (2x nesting only). Each style dropdown + its pulse toggle paired side-by-side in a grid row, making the grouping obvious without nested collapsibles. The label names convey aspect identity (no section titles needed).
4. **`default:` on all fields, accepting that defaults get persisted on save** — same pattern used for `show_amount_in_body` / `confirm_tool_actions`. Runtime `?? <default>` fallbacks stay as defense-in-depth. Resolves the user's "logged animation is blank and does not say 3000ms by default" complaint.
5. **No backend changes, no migration, no `projectstructure.md` change** — all changes are frontend editor/localize/README. No source files added or removed.

## Glow Length 85% + Default Speed Medium (2026-08-09)
**Feature**: Two user-requested tweaks to the rotating border-glow (Apple Intelligence perimeter sweep) used by button style options 6 (glow) and 7 (icon_glow). (1) **Longer glow line** — the conic-gradient sweep was 75% of the perimeter (270deg line / 90deg gap); user wanted ~90% but chose **85% (306deg line / 54deg gap)** during planning so the bright white-tipped comet head stays clearly visible as it travels (a 90% / 36deg gap would read as an almost-continuous ring with only a subtle pulse). (2) **Default glow speed changed from Fast (2.2s) to Medium (4s)** — the per-button `take_button_glow_speed` / `drink_button_glow_speed` dropdown now defaults to Medium. Frontend-only. No architecture plan (two-line CSS + default-value change); planned in architect mode, executed in code mode.

### Checklist
- [x] Step 1: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — 4 glow conic-gradients (red/blue/amber/green) rewritten: stops `67.5/202.5/270/270.1` → `76.5/229.5/306/306.1`; comment header "75% line … 90deg gap" → "85% line … 54deg gap"
- [x] Step 2: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — 2 glow gradients (red/green) mirrored to the same new stops; comment header updated
- [x] Step 3: [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — `default: 'fast'` → `default: 'medium'` on both `take_button_glow_speed` + `drink_button_glow_speed` schema fields; `_glowSpeedOptions()` comment "'fast' (2.2s) is the default" → "'medium' (4s) is the default"
- [x] Step 4: [`src/components/daily-panel.ts`](src/components/daily-panel.ts:96) + [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts:81) — runtime `?? 'fast'` → `?? 'medium'` in both `_glowDuration()` helpers; helper doc-comments updated
- [x] Step 5: [`src/types.ts`](src/types.ts) — doc-comments on `take_button_glow_speed` + `drink_button_glow_speed`: `'fast' (2.2s, default)` → `'medium' (4s, default) / 'fast' (2.2s)`
- [x] Step 6: [`src/localize.ts`](src/localize.ts) — `config.helper.take_button_glow_speed` + `config.helper.drink_button_glow_speed`: "Default: Fast." → "Default: Medium."
- [x] Step 7: [`README.md`](README.md) — glow speed sentence: "default is Fast (2.2s per rotation)" → "default is Medium (4s per rotation)"; added a sentence noting the ~85% perimeter sweep + small transparent gap
- [x] Step 8: Verification — `yarn run build` clean (exit 0, 4.4s). Dist grep confirms new stops present (`306deg`=8 [6 gradients + 2 comment refs], `229.5deg`=6, `76.5deg`=6) + old stops absent (`67.5deg`=0, `202.5deg`=0, `270deg`=0) + `default: 'medium'`=2 + `Default: Medium`=2 + `Default: Fast`=0. The 2 `glow_speed.fast` label matches are the still-valid "Fast" dropdown option, not a default ref.
- [x] Step 9: Update memory-bank — activeContext.md (new Current Status; Button Submenu Optimization archived as Previous Context), progress.md (this section). No projectstructure.md change. README updated in Step 7.

### Key decisions
1. **85% line, not 90%** — at 90% (36deg gap) the comet head sweeps past almost continuously and reads as a subtle pulse rather than a distinct traveling line; 85% (54deg gap) keeps the head clearly visible. User chose this during architect-mode planning after the 90%→comet-head-visibility tradeoff was surfaced.
2. **Preserve the comet-tail shape proportions** — the original 75% gradient used a 25% transparent-ramp / 50% solid-middle / 25% white-tipped-head split. The new 85% gradient scales those same proportions to the 306deg line: `0→76.5deg` ramp (25%), `76.5→229.5deg` solid (50%, 153deg), `229.5→306deg` head (25%), `306→306.1deg` crisp edge, `306.1→360deg` gap (54deg = 15%). Same visual character, longer sweep.
3. **6-place default sync** — `'fast'` → `'medium'` touched: editor schema defaults (×2), panel runtime `?? 'fast'` fallbacks (×2), `types.ts` doc-comments (×2), `localize.ts` helper strings (×2), `README.md` (×1), plus 3 inline comments. All kept in sync so the editor, runtime, docs, and user-facing helper text agree.
4. **No migration** — `take_button_glow_speed` / `drink_button_glow_speed` are optional fields with a runtime `?? <default>` fallback. Existing configs that explicitly set `'fast'` keep their value; only configs with no explicit value pick up the new `'medium'` default. No persisted-config breakage.
5. **No backend changes, no projectstructure.md change** — all changes are frontend CSS + TS defaults + docs. No source files added or removed.

---

## Logged Dose Indicator — Clarity, Softening, Press-Feel (2026-08-09)

Three user-reported issues with the transient Logged Dose Indicator (ACK) overlay on the Take Pill / Log Drink buttons.

- [x] Read memory-bank context (activeContext, projectstructure) + daily-panel.ts / drinks-panel.ts button-state + ack-flash CSS
- [x] Confirm user preference on ack green treatment (chose opaque softened green over 12% translucent)
- [x] Write architecture plan → [`plans/ack-clarity-and-softening-plan.md`](plans/ack-clarity-and-softening-plan.md)
- [x] Get user approval on plan (switched to Code mode)
- [x] **Issue 1 — Red tick on limit-reached press:** scope icon-override color rules to direct-child `ha-icon` (`>` combinator) in daily-panel.ts (4 rules) + drinks-panel.ts (2 rules) so the nested ack tick (`button > .ack-flash > ha-icon`) is excluded and keeps its own color
- [x] **Issue 2 — Green too vibrant:** add `--btn-green-soft: #5fa863` CSS var on `:host` in both panels; `.ack-flash` background `var(--btn-green)` → `var(--btn-green-soft)`; tick/text color `#fff` → `var(--btn-green)` (solid green glyph on calmer surface)
- [x] **Issue 3 — Instant pop-in:** add `0% { opacity: 0; transform: scale(0.96) }` + `8% { opacity: 1; transform: scale(1) }` intro stops to `ax-btn-ack-fade` (daily) + `ax-drink-btn-ack-fade` (drinks); add `transform-origin: center` to `.ack-flash`; ~240ms proportional to `--ack-duration`
- [x] Rebuild via `yarn run build` — clean, exit 0, 4.6s
- [x] Dist grep verification: `btn-green-soft`=4, `> ha-icon`=8, `scale(0.96)`=6, `color: var(--btn-green)`=6
- [x] Update [`README.md`](README.md) — Button State Matrix section: paragraph on softened opaque green + solid-green tick + ~240ms press-in + tick-color independence from Icon override
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; demote Glow Length 85% + Button Submenu Optimization to Previous Context; archive oldest 2 blocks (Glow Speed Dropdown + ACK Rework, Apple Intelligence Border Glow v4) to `memory-bank/old/activeContext-archive.md`

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `src/components/drinks-panel.ts`, `README.md`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/ack-clarity-and-softening-plan.md` (new). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change.

**Key decisions:** (1) child combinator not `:not(.ack-icon)` — keeps state-color rules independent of ack implementation; (2) opaque softened green not 12% translucent — prevents red/amber/blue bleed-through that would contradict Issue 1; (3) `~8%` proportional intro not fixed 240ms — scales with `ack_duration_ms`; (4) pure CSS fixes — no config/editor/localize surface touched.

### User follow-up refinements (2026-08-09, same task)

- [x] **Refinement 1 — ack background too bright / hard to read:** initial `--btn-green-soft: #5fa863` was too bright; user specified final values → background `#212C22` (dark green surface) + tick/text `#43A047` (`var(--btn-green)`, bright green glyph). Updated `--btn-green-soft` to `#212c22` in both panels' `:host`; `.ack-flash` color already `var(--btn-green)` from the initial fix. Updated doc-comments in both panels + README paragraph.
- [x] **Refinement 2 — proportional intro feels sluggish at long intervals:** initial `0% → 8%` proportional intro stretched to ~800ms at a 10000ms flash interval. Switched to a **two-animation split** — a FIXED `ax-btn-ack-intro` (240ms, `both` fill, scale+fade-in) + the hold/fade `ax-btn-ack-fade` delayed by 240ms. The `animation:` shorthand MUST be single-line (multi-line breaks the Lit CSS compiler → drops the rule + keyframes). Split the keyframes into `ax-btn-ack-intro` + `ax-btn-ack-fade` (and `ax-drink-btn-ack-intro` + `ax-drink-btn-ack-fade`) in both panels.
- [x] Rebuild via `yarn run build` — clean, exit 0
- [x] Dist grep verification: `212c22`=2, `5fa863`=0, `btn-green-soft`=4, `background:var(--btn-green-soft)`=2, `ax-btn-ack-intro 240ms ease-out both`=1, `ax-drink-btn-ack-intro 240ms ease-out both`=1, all 4 ack keyframes present
- [x] Update [`README.md`](README.md) — paragraph refined: dark green `#212C22` surface + bright green `#43A047` tick/text + fixed 240ms intro (not proportional)
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — Current Status / What Was Changed / Key Design Decisions / Verification all updated to reflect the final `#212C22` + fixed-240ms-two-animation-split design

**Final key decisions (superseding the initial ones):** (2) opaque dark green `#212C22` surface (not the initial `#5fa863`, not 12% translucent) — high contrast + no bleed-through; (3) bright green `#43A047` glyph on the dark surface for legibility; (4) FIXED 240ms intro via two-animation split (not proportional) — stays snappy at long flash intervals; the `animation:` shorthand must be single-line or the Lit CSS compiler drops the rule.

## ACK Intro State Freeze — Hide Post-Press Color Flash (2026-08-09)

### Goal
When a successful Take Pill / Log Drink press flips the underlying button into a new state (most visibly `default → Limit Reached red` when the dose hits the daily limit), the button's real state transitioned **immediately** while the green ACK (Logged Dose Indicator) overlay was still in its fixed 240ms intro fade-in (`opacity 0 → 1`). During those 240ms the overlay was semi-transparent, so the new red state flashed through for ~240ms before the overlay reached full opacity and hid it. User wanted the underlying transition delayed by 240ms so it commits behind the now-opaque overlay.

### Planning
- [x] Read frontend memory-bank/activeContext.md (most recent: ACK clarity/softening task) + progress.md + relevant source (helpers.ts resolveButtonState, daily-panel.ts/drinks-panel.ts ack-flash CSS, ax-dose-logger-card.ts _triggerDailyAck/_triggerDrinksAck/_computeDailyButtonState/_computeDrinksButtonState/disconnectedCallback)
- [x] Root-cause trace: trigger sets `_dailyAckActive=true` synchronously → overlay starts 240ms intro → HA pushes new `pillsSafeToTake=0` → resolver reads live state → returns `lockout` → button snaps to red immediately, visible through the still-fading-in overlay
- [x] Design decision: JS-side state freeze in the container (not CSS `transition-delay` — button color is driven by class swaps that don't all map to a single animatable property, and a CSS delay would fire on every state change including backend-driven ones with no press). Panel stays presentational; freeze lives in the container which already owns the ACK flag + resolver.
- [x] Write architecture plan → plans/ack-state-freeze-plan.md
- [x] Get user approval on plan (proceed with fixed 240ms freeze, both Daily + Drinks)

### Implementation
- [x] src/helpers.ts: added `export const ACK_INTRO_MS = 240` (with doc-comment noting it mirrors the CSS `ax-btn-ack-intro` / `ax-drink-btn-ack-intro` keyframe duration exactly and MUST stay in sync with them; fixed not proportional to `ack_duration_ms`)
- [x] src/ax-dose-logger-card.ts: imported `ACK_INTRO_MS` from `./helpers.js`
- [x] src/ax-dose-logger-card.ts: added `_dailyFrozenState`/`_drinksFrozenState` (`@state() ButtonState | null = null`) + `_dailyFreezeTimer`/`_drinksFreezeTimer` (`number | undefined`) next to the existing ACK flags/timers
- [x] src/ax-dose-logger-card.ts: `_triggerDailyAck` now captures the pre-press state via `_resolveEntities()` + `_computeDailyButtonState()` into `_dailyFrozenState`, arms a 240ms (`ACK_INTRO_MS`) release timer that clears the frozen state + requests re-render, then sets `_dailyAckActive=true` + arms the existing ack-duration timer (unchanged)
- [x] src/ax-dose-logger-card.ts: `_triggerDrinksAck` mirrors the daily freeze using `_drinksFrozenState`/`_drinksFreezeTimer` + `_computeDrinksButtonState`
- [x] src/ax-dose-logger-card.ts: `_computeDailyButtonState` + `_computeDrinksButtonState` short-circuit at the top — return the frozen state while `_dailyFrozenState !== null` / `_drinksFrozenState !== null`, falling through to live-state resolution once the freeze releases
- [x] src/ax-dose-logger-card.ts: `disconnectedCallback` clears `_dailyFreezeTimer` + `_drinksFreezeTimer` (scoped to the new freeze timers; the pre-existing `_dailyAckTimer`/`_drinksAckTimer` leak is noted as out-of-scope)

### Verification
- [x] `yarn run build` — clean, exit 0, dist/ax-dose-logger-card.js created in 4.4s
- [x] Dist grep: `ACK_INTRO_MS`=5 (1 const def + 1 import + 2 timer args + 1 frozen-state comment), `_dailyFrozenState`=6, `_drinksFrozenState`=6, `ax-btn-ack-intro`=3 + `ax-drink-btn-ack-intro`=3 (CSS keyframes intact: 1 def + 2 animation-shorthand refs each), `240`=15
- [x] No CSS / panel / config / editor / localize / types changes — pure JS in the container
- [x] No backend changes (frontend-only)
- [x] No projectstructure.md change (no files added/renamed/deleted)

### Key decisions
1. **JS-side state freeze in the container, not CSS `transition-delay`** — the button color is driven by class swaps (`full-red`, `icon-red`, `border-red`, `glow-red`, etc.) that don't all map to a single animatable `transition` property; a CSS delay would also fire on every state change (e.g. a backend-driven lockout with no press), which is wrong-scope. The freeze is scoped to the ACK window only.
2. **Panel stays presentational** — the freeze lives in the container (which already owns the ACK flag + the resolver); the panel remains a pure function of its `.buttonState` / `.ackActive` props. No panel CSS or logic changes.
3. **Capture the pre-press state at trigger time** — the trigger fires synchronously right after `button.press`, before HA has pushed the new state, so `_resolveEntities()` + `_computeDailyButtonState()` return the pre-press value (e.g. `idle`/`execution`). This is exactly the value to hold through the intro.
4. **Fixed 240ms (`ACK_INTRO_MS`), not proportional to `ack_duration_ms`** — mirrors the fixed CSS intro exactly so the freeze release always coincides with the overlay reaching opacity 1. Single source of truth via the shared constant; the constant's doc-comment notes the CSS keyframes MUST be updated together with it.
5. **Override-confirm path is a harmless no-op** — by the time the limit-reached dialog Confirm fires `_triggerDailyAck`, the state is already `lockout`, so freezing `lockout` for 240ms just holds the already-red button red behind the overlay (no visible change). No special-casing needed.
6. **Rapid re-trigger safe** — mirrors the existing clear-before-arm timer pattern for the freeze timers.
7. **Cleanup scoped to the new freeze timers** — `disconnectedCallback` clears `_dailyFreezeTimer` + `_drinksFreezeTimer`; the pre-existing `_dailyAckTimer`/`_drinksAckTimer` not being cleared on disconnect is noted as an out-of-scope pre-existing gap (filed in the plan) to keep this change scoped.

**Scope:** Frontend only. Files: `src/helpers.ts`, `src/ax-dose-logger-card.ts`, `README.md`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/ack-state-freeze-plan.md` (new). No panel CSS, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change.


## Hide "Next: now" on Take Pill Button (2026-08-09)

**Feature:** Small UX tweak to the Take Pill button's sub-line. Reported by user: the button showed "Next: Now" once the scheduled next-dose time arrived — redundant, since the dose is due now and a future-countdown label has no meaning at that point. Request: when `next` is reached, hide the `Next:` segment entirely; only `Last:` should remain.

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank activeContext (most recent: ACK Intro State Freeze); located the sub-line render in [`daily-panel.ts`](src/components/daily-panel.ts:219) + the `nextDose` source [`_computeNextDose`](src/ax-dose-logger-card.ts:526) (returns literal `'now'` when `next <= now`); confirmed the Overdue precedence (`overTime ? Overdue : Next : nothing`)
- [x] Step 2: Edit [`src/components/daily-panel.ts`](src/components/daily-panel.ts:221) — widened the Next-segment render guard from `nextDose !== 'Unavailable'` to `nextDose !== 'Unavailable' && nextDose !== 'now'` so the entire `Next:` segment (bullet + label + value) is omitted when `next` is reached; `Last:` remains alone
- [x] Step 3: Verification — `yarn run build` clean (exit 0, 4.5s); dist grep confirms new guard present (`nextDose !== 'Unavailable' && nextDose !== 'now'` count = 1)
- [x] Step 4: Update memory-bank — activeContext.md (new Current Status; ACK Intro State Freeze + Logged Dose Indicator Clarity kept as Previous Context), progress.md (this section). No projectstructure.md change (no source files added/removed). No README change (sub-line format is not documented; display refinement of an existing element).

### Key decisions
1. **Purely presentational** — no backend / coordinator / state change. The `'now'` sentinel is already emitted by `_computeNextDose`; the panel simply stops rendering it. Matches the user's direct request with no new config option.
2. **Guard on the sentinel, not a re-derivation** — comparing against `'now'` (the canonical "next dose has arrived" signal in this card) keeps the panel presentational and consistent with how the rest of the card already classifies this state. Re-reading the raw `next_dose` state and recomputing would duplicate `_computeNextDose` logic.
3. **Overdue precedence preserved** — `overTime` still takes priority over `Next:`. The `Next: now` gap only appeared before overdue kicked in (scheduled meds) or never (As-Needed meds whose `_computeOverTime` returns `null`). Hiding `'now'` covers both cases cleanly; the future-countdown path (`Xh Ym`) is unchanged.
4. **No README change** — the `Last: … • Next: …` sub-line format is not documented in the card README; this is a display refinement of an existing element, not new end-user behavior or a config surface.

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `dist/ax-dose-logger-card.js` (rebuilt). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no CSS, no config keys, no migration, no `projectstructure.md` change.
