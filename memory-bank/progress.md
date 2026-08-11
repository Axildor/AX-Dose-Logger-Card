# Progress — Pill Logger Card (Frontend)

> ℹ️ **Older history is archived in [`memory-bank/old/progress-archive.md`](memory-bank/old/progress-archive.md:1).** The sections below are the most recent feature completions; read the archive only if you need older context.

## Color-Scheme Indicator Conflict Signage (2026-08-09)
**Feature**: Surface a visual conflict between the user-configurable card accent (color_scheme) and the four hardcoded medical button-state indicators. The idle Take Pill / Log Drink button's background is tinted by `--primary-color` ([`daily-panel.ts:441`](src/components/daily-panel.ts:441)), and four scheme colors match (or approximate) the four indicator colors, so picking one of them can make the idle button resemble an active medical state at a glance. Frontend-only, no behavior change. Architecture plan: [`plans/color-scheme-indicator-conflict-plan.md`](plans/color-scheme-indicator-conflict-plan.md).

### Planning
- [x] Read frontend memory-bank (activeContext, progress, projectstructure) for context
- [x] Locate color_scheme dropdown ([`ax-dose-logger-editor.ts:197`](src/ax-dose-logger-editor.ts:197)) + scheme hex table ([`helpers.ts:78`](src/helpers.ts:78)) + indicator token definitions ([`daily-panel.ts:422`](src/components/daily-panel.ts:422))
- [x] Confirm the four colliding colors: Red (`#e53935`≈`#db4437` Limit), Blue (`#03a9f4`=`#03a9f4` Dose Due, exact), Orange (`#fb8c00`≈`#f5a623` Overdue Amber, near), Green (`#43a047`=`#43a047` Logged, exact)
- [x] Push back on device-info-dialog explainer placement; user confirmed editor helper text + README is preferred (co-located with the choice, no runtime clutter); Orange stays flagged per user

### Implementation
- [x] [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:177) — (a) reordered color_scheme dropdown: non-colliding hues first (default, yellow, purple, pink, teal, brown, coral, slate, gold, grey), then the four colliding colors last (Red, Blue, Orange, Green) each with a trailing ` *` appended via `localize('en', 'color.X') + ' *'` (option `value` strings unchanged → no config migration); (b) restructured the top of the schema into two rows after user feedback that the long helper cluttered the editor: Row 1 = 2-column grid of `device_id` | `name` (Device | Name Override, device keeps `required: true` inside the grid); Row 2 = `color_scheme` alone on its own full-width row so the helper has room to render on one line. Added an explanatory code comment block.
- [x] [`src/localize.ts`](src/localize.ts:400) — set `config.helper.color_scheme` to the user's exact one-line wording: `'Accent color for the card. Colors with * match the medical button-state indicators and can blur the idle/active read — for more information see the README Button State Matrix.'` (the long paragraph version was reverted after user feedback that it cluttered ~40% of the top settings area; HA's schema helper renders as plain text so the README is referenced by name, not as a clickable link).
- [x] [`README.md`](README.md:81) — Quick Start step 3 now references the starred-colors note; appended a new "⚠️ Color Scheme and Indicator Conflicts" subsection right after the Button State Matrix section listing the four collisions with hex values and the `*` marker convention.

### Verification
- [x] `yarn run build` — clean (exit 0, dist/ax-dose-logger-card.js created in 19.4s)
- [x] Dist grep confirms all four starred labels present (`color.red') + ' *'`, `color.blue') + ' *'`, `color.orange') + ' *'`, `color.green') + ' *'` — count = 1 each)
- [x] Dist grep confirms the expanded helper text present ("match the medical button-state indicators" — count = 1)
- [x] No backend / coordinator / store / config-flow / types changes (frontend strings + editor option order only)
- [x] No config migration (option `value` strings unchanged; only menu order + display labels + helper text changed)
- [x] No projectstructure.md change (no files added/renamed/deleted; primary responsibilities unchanged)
- [x] activeContext.md updated (new Current Status; prior archived per truncation rule)
- [x] progress.md updated (this section; 2 oldest sections archived to memory-bank/old/progress-archive.md to stay near the ~400-line target)

### Key decisions
1. **Explainer in editor helper text, not the device-info dialog** — the device-info dialog (opened by pressing the drug title) is for device navigation, opened rarely and not at the moment of color choice; HA's standard pattern for field-level guidance is the `helper` text co-located with the field — visible exactly when picking the color, silent once configured, no recurring visual noise. User confirmed this placement.
2. **Orange stays flagged** — `#fb8c00` (orange) is close enough to `#f5a623` (amber overdue) to confuse the at-a-glance read; flagging it is the conservative, safety-leaning choice. User confirmed.
3. **`*` suffix appended in the editor, not in localize.ts** — keeps the i18n map clean (the asterisk is a UI annotation, not a translatable string); a future localized build isn't forced to translate the marker.
4. **Reorder, don't remove** — the four colliding colors remain valid choices (some users may want the accent to match a specific indicator deliberately); the signage warns at the point of choice without restricting the option set.
5. **No functional behavior change** — active-state classes still apply their own indicator colors when active; only the idle tint readability is affected, and only cosmetically. Documented as a readability concern, not a bug.

## Medical Color Indicators Explainer Popup + Toggle (2026-08-10)
**Feature**: Added an in-card, ha-dialog + ha-markdown explainer of the medical button-state indicator colors and the Color Scheme interference, reached via a secondary button in the device-info popup. Gated by a top-level config toggle `show_color_indicator_explainer` (default ON) so the button disappears entirely once learned. Frontend-only, no behavior change. Architecture plan: [`plans/color-indicators-explainer-popup-plan.md`](plans/color-indicators-explainer-popup-plan.md).

### Motivation
The prior signage task (starred dropdown colors + one-line helper pointing to the README) left no easily-accessible in-card explainer — the README is canonical but not discoverable at runtime. The user wanted an explainer easy to find but out of the way when learned. Reusing the established [`_renderSleepDisruptionDialog()`](src/ax-dose-logger-card.ts:1905) ha-dialog + `<ha-markdown>` popup pattern keeps it version-stable (no DOM injection) and consistent with existing card UX. The trigger lives in the device-info dialog (opened by pressing the drug title — the natural "tell me about this med" surface), not the editor, preserving the editor's compact layout.

### Implementation
- [x] [`src/types.ts`](src/types.ts:61) — added `show_color_indicator_explainer?: boolean;` to `AxDoseLoggerCardConfig` + `showColorExplainerDialog(): void;` to the `CardController` interface (near `showDeviceInfo`).
- [x] [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:203) — top-level settings restructured into rows: Row 2 = **Color Scheme | Default View** (2-column grid); Row 3 = **Color Explainer Button | Hide Navigation Bar** (2-column grid; `show_color_indicator_explainer` `default: true` moved up beside Hide Nav Bar); Row 4 = Large Text | Bold Text. Color Scheme dropdown ordering unchanged.
- [x] [`src/localize.ts`](src/localize.ts) — `config.show_color_indicator_explainer` label = "Color Explainer Button"; `config.helper.show_color_indicator_explainer` helper = "Show a Medical Color Indicators button in the device-info popup." (default-on note removed per user request); `config.helper.color_scheme` reworded to "Accent color for the card. *Press card title for more info on indicator colors and the starred colors."; added dialog keys `dialog.device_info.color_indicators` ("Medical Color Indicators"), `dialog.device_info.color_indicators_aria`, `dialog.color_indicators.title`, `dialog.color_indicators.close`, and `dialog.color_indicators.explainer` (joined multi-line markdown: indicator-color table + fixed-vs-tinted distinction + Color Scheme interference list with hex values + non-starred recommendation — mirrors the README "⚠️ Color Scheme and Indicator Conflicts" subsection).
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1318) — `_renderDeviceInfoDialog()` widened from `width="small"` → `width="medium"` + `.dialog-body--center` CSS changed to `flex-direction: column; align-items: center; gap: 12px;` so the two stacked buttons no longer touch + added scoped `.dialog-body--center .dialog-btn { width: 50%; box-sizing: border-box; }` so the stacked device-info buttons are half-width and centered (global `.dialog-btn` in other dialogs stays full-width).
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — (1) `@state() private _showColorExplainerDialog: boolean = false;`; (2) `public showColorExplainerDialog(): void` accessor; (3) `_showColorExplainerDialog` added to the `updated()` reactive-property whitelist; (4) reset to `false` in the disconnect cleanup block; (5) new `_renderColorExplainerDialog()` renderer (ha-dialog + `<ha-markdown .content>` + close button, mirroring the Sleep Disruption popup); (6) `_renderDeviceInfoDialog()` renders a second `.dialog-btn` (icon `mdi:palette-outline`, label `dialog.device_info.color_indicators`) below "To Device info" when `config.show_color_indicator_explainer !== false` — clicking it opens the explainer and closes the device-info dialog; (7) render call added to the main render.
- [x] [`README.md`](README.md:148) — added a one-line note in the "⚠️ Color Scheme and Indicator Conflicts" subsection pointing to the in-card popup + fixed a missing blank line before the ACK-flash layout paragraph.

### Verification
- [x] `yarn run build` — clean (exit 0, dist/ax-dose-logger-card.js created in 3.3s)
- [x] Dist grep confirms: `show_color_indicator_explainer` (count = 6), explainer markdown "Button State Indicator Colors" (count = 1), device-info button label `dialog.device_info.color_indicators` (count = 4), `showColorExplainerDialog` accessor (count = 9), `_renderColorExplainerDialog` renderer (count = 2)
- [x] No backend / coordinator / store / config-flow changes (frontend dialog + config field only)
- [x] No config migration (new optional boolean with documented default; existing configs render as today → default ON → button visible, via the negative-false check `!== false`)
- [x] No projectstructure.md change (no files added/renamed/deleted; primary responsibilities unchanged)
- [x] activeContext.md updated (new Current Status; prior Color-Scheme Signage + Hide Next:now kept as Previous Context; oldest Button State Matrix section archived to memory-bank/old/progress-archive.md)
- [x] progress.md updated (this section; oldest section archived to memory-bank/old/progress-archive.md to stay near the ~400-line target)

### Key decisions
1. **Reuse the ha-dialog + ha-markdown popup pattern** — same as the Sleep Disruption popup; version-stable, no DOM injection, consistent card UX. Markdown content lives in `localize.ts` as a joined multi-line string.
2. **Trigger in the device-info dialog, not the editor** — preserves the editor's compact layout (the long helper was the problem last round); the device-info dialog is the natural "tell me about this med" surface.
3. **Toggle defaults ON** — discoverability for new users; turning it OFF hides the button entirely (no runtime clutter once learned). Negative-false check preserves existing configs without the field (default ON → button visible).
4. **Markdown mirrors the README subsection** — single conceptual source of facts (README stays canonical; popup reuses the same indicator-color table + interference list for in-card convenience).
5. **No migration / no functional behavior change** — new optional boolean + a new dialog; existing configs render as today. The indicator colors themselves are unchanged.

---

## Rapid Successive-Click Counter on ACK Flash (2026-08-10)

**Feature:** The green "Logged" flash on the Take Pill and Log Drink buttons now visually tracks rapid back-to-back clicks. When the user taps again while the flash is still active, the text instantly updates to `Logged 2x`, `Logged 3x`, etc. and the fade timer resets; the first press shows the bare `Logged` (no `1x`). In the Big-tickmark layout (no text) a small green `Nx` badge appears below the tick when the count reaches 2 or more. Frontend-only, both buttons for parity. Architecture plan: [`plans/rapid-click-count-plan.md`](plans/rapid-click-count-plan.md).

### Planning
- [x] Step 1: Context grounding — read frontend memory-bank (activeContext + progress), [`daily-panel.ts`](src/components/daily-panel.ts), [`drinks-panel.ts`](src/components/drinks-panel.ts), [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) ACK state machine (`_triggerDailyAck` / `_triggerDrinksAck` / `disconnectedCallback` / render props), [`helpers.ts`](src/helpers.ts) (`ACK_INTRO_MS`, `ackActive`), [`localize.ts`](src/localize.ts) (`button.ack_text`)
- [x] Step 2: Wrote architecture plan → [`plans/rapid-click-count-plan.md`](plans/rapid-click-count-plan.md) (state model, sequence diagram, panel render changes, CSS, disconnect hardening)
- [x] Step 3: User confirmed scope — (a) both Take Pill + Log Drink buttons for parity; (b) `big` layout gets a small `Nx` badge below the tickmark when count ≥ 2 (not textless)
- [x] Step 4: User approved the plan and switched to Code mode

### Implementation
- [x] Step 5: Container state — added `@state() _dailyAckCount: number = 0` + `@state() _drinksAckCount: number = 0` (zero ⟺ inactive, 1 ⟺ first press, 2+ ⟺ `Logged {n}x`); documented the rapid-click lifecycle in the field-group comment
- [x] Step 6: Rewrote [`_triggerDailyAck()`](src/ax-dose-logger-card.ts:854) — increment-or-init: if `_dailyAckActive` true, `_dailyAckCount += 1`; else init to 1 + arm flag. Fade timer always cleared + re-armed (covers first + subsequent). On expiry both flag and counter reset together
- [x] Step 7: Rewrote [`_triggerDrinksAck()`](src/ax-dose-logger-card.ts:885) — mirror of `_triggerDailyAck` with `_drinksAckCount`
- [x] Step 8: Container render props — added `.ackCount=${this._dailyAckCount}` to the daily-panel render site and `.ackCount=${this._drinksAckCount}` to the drinks-panel render site
- [x] Step 9: Container disconnect — extended [`disconnectedCallback()`](src/ax-dose-logger-card.ts:2415) to cancel `_dailyAckTimer` / `_drinksAckTimer` alongside the existing freeze-timer cancellation (hardening; ACK timers were previously left to fire harmlessly on a detached element)
- [x] Step 10: Daily panel — added `@property ackCount: number = 0`; added `_ackLabelText()` helper returning `Logged` at count 1 and `Logged {n}x` at count ≥ 2; rewrote the ACK overlay render block to call `_ackLabelText()` for top/inline and render `<span class="ack-count-badge">Nx</span>` for big when count ≥ 2; added `.ack-count-badge` CSS scoped under `.ack-flash.ack-big`
- [x] Step 11: Drinks panel — mirror of the daily panel (prop, helper, render block, CSS under `.log-drink-btn`)
- [x] Step 12: Fixed CSS-comment backtick issue — the `.ack-count-badge` CSS comments used backticks (`` `big` ``) inside the `css` tagged template, which Lit's CSS compiler interpreted as template-literal interpolation and emitted TS1005 errors in drinks-panel.ts. Removed the backticks from the comments in both panels

### Verification
- [x] Step 13: `yarn run build` — exit 0, 3.8s, no TS errors (after the backtick fix)
- [x] Step 14: Dist grep — `grep -c 'ackCount\|_dailyAckCount\|_drinksAckCount\|ack-count-badge\|_ackLabelText' dist/ax-dose-logger-card.js` = 29 matches (all new logic compiled in)

### Documentation
- [x] Step 15: [`README.md`](README.md) — added a "Rapid successive clicks" paragraph at the end of the Logged Dose Indicator section (text suffix on top/inline, `Nx` badge on big, counter resets on fade, pure visual tally)
- [x] Step 16: `memory-bank/activeContext.md` — new Current Status; prior Color Indicators Explainer + Color-Scheme Signage kept as Previous Context
- [x] Step 17: `memory-bank/progress.md` — this section
- [x] Step 18: No `projectstructure.md` change (no files added/renamed/deleted; only in-place edits to 3 source files + new plan doc)

### Key decisions
1. **Counter coupled to the ACK flag lifecycle** — `_dailyAckCount === 0` iff inactive, so one source of truth clears itself on timer expiry. No second timer, no reset-on-expire edge case. Existing single-timer architecture preserved; only the bookkeeping inside it changes.
2. **Both buttons for parity** — Take Pill and Log Drink share an identical ACK-flash state machine; the counter logic is mirrored on both.
3. **`big` layout gets an `Nx` badge (user-confirmed)** — no text to append the suffix to, so a small green `Nx` badge renders below the tick when count ≥ 2. Satisfies "all the styles should have the 2x, 3x, 4x indicators always on" across all three ACK layouts.
4. **Suffix built by interpolation, no new localize key** — `${base} ${count}x` off the existing `button.ack_text` (`"Logged"`). Matches the user's verbatim examples; a `button.ack_count_suffix` placeholder key can replace the literal `x` later if i18n needs it.
5. **No new config option / no editor-schema change** — the counter is always-on behaviour. The fade duration (`ack_duration_ms`, default 3000), freeze window (`ACK_INTRO_MS`, 240ms), and layout (`ack_layout`) are unchanged.
6. **Disconnect hardening** — the ACK fade timers are now cancelled in `disconnectedCallback` alongside the existing freeze-timer cancellation; previously they fired `requestUpdate` on a detached element (harmless but unclean).
7. **CSS comment backtick fix** — backticks inside a `css` tagged template are interpreted as interpolation by Lit's CSS compiler; removed from the new comments in both panels. (The daily panel compiled clean on the first pass despite the same comment; the drinks-panel build surfaced the TS1005; both fixed for consistency.)
8. **No backend / coordinator / store / config-flow / migration change** — each tap already fires `hass.callService('button','press')`; the counter is a pure UI affordance (running tally over the ACK window), not a new backend log.

## Icon Style Dropdown Separation (2026-08-10)
**Feature**: Split the per-state button Style dropdown (was 7 monolithic options bundling background + icon + border + glow) + its separate Icon Pulse boolean toggle into two orthogonal dropdowns: a reduced **Style** dropdown (5 options: Default sentinel + Full Button / Border Only / No Color / Rotating Ring) and a new **Icon Style** dropdown (5 options: Default sentinel + None / Colored / Colored + Pulse / Pulse Only). The 4 visual Icon Style options form a 2×2 matrix (color on/off × pulse on/off). 'auto' (labeled "Default") is a sentinel resolving to the per-state default at runtime. Renamed `glow` → `ring` (value, CSS classes, var, field, type) to free up "glow" for a future uniform glow feature. Relabeled "No Change" → "No Color". Backward-compatible migration in setConfig() (14-row mapping table, idempotent). New defaults produce identical visuals to old defaults. Frontend-only. Architecture plan: [`plans/icon-style-dropdown-separation-plan.md`](plans/icon-style-dropdown-separation-plan.md).

### Checklist
- [x] Step 1: Context grounding — read editor schema ([`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts)), types ([`src/types.ts`](src/types.ts)), daily-panel + drinks-panel CSS/logic, localize strings, README Button State Matrix section, setConfig migration pattern
- [x] Step 2: Architecture plan — [`plans/icon-style-dropdown-separation-plan.md`](plans/icon-style-dropdown-separation-plan.md) (two orthogonal dropdowns, 2×2 matrix, `auto` sentinel, `glow`→`ring` rename, 14-row migration table, no CSS changes)
- [x] Step 3: User confirmation — plan approved after two revision rounds (added `auto` Default sentinel, `glow`→`ring` rename, "No Change"→"No Color" relabel)
- [x] Step 4: [`src/types.ts`](src/types.ts) — added `IconStyle` type (5 values), reduced `ButtonStateStyle` (7→5 values), renamed `GlowSpeed`→`RingSpeed`, renamed config fields `*_pulse`→`*_icon_style` + `*_glow_speed`→`*_ring_speed`
- [x] Step 5: [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — reduced `_buttonStyleOptions()` (7→5), added `_iconStyleOptions()` (5), renamed `_glowSpeedOptions()`→`_ringSpeedOptions()`, updated 4 state grids (Style + Icon Style dropdowns, defaults `'auto'`), renamed `*_glow_speed`→`*_ring_speed`
- [x] Step 6: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — rewrote `_takeButtonClasses()` (4 style + 4 icon_style, `auto` sentinel via STATE_DEFAULTS), renamed `_glowDuration()`→`_ringDuration()`, CSS renames `.glow-*`→`.ring-*` + `--glow-duration`→`--ring-duration` + `ax-btn-glow-sweep`→`ax-btn-ring-sweep`, template + import + comments updated
- [x] Step 7: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — mirror of daily-panel (`_logDrinkButtonClasses()` rewritten, `_glowDuration()`→`_ringDuration()`, CSS + template + import + comments)
- [x] Step 8: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — added `_migrateButtonStateConfig()` + `_migrateOneButtonState()` migration helpers (14-row mapping, idempotent), called in `setConfig()` after chips migration, added `IconStyle` import
- [x] Step 9: [`src/localize.ts`](src/localize.ts) — removed 4 `*_pulse` labels + 4 helpers, added `button_style.auto` + 5 `icon_style.*` labels, renamed `button_style.glow`→`button_style.ring` ("Rotating Ring"), `button_style.none` "No Change"→"No Color", renamed `glow_speed.*`→`ring_speed.*`, renamed `*_glow_speed`→`*_ring_speed` config labels, added `*_icon_style` labels + helpers
- [x] Step 10: [`README.md`](README.md) — updated Button State Matrix section (intro, state table defaults, 4 style options + Default, Icon Style 2×2 matrix, editor layout, "Rotating Glow Speed"→"Rotating Ring Speed")
- [x] Step 11: Verification — `yarn run build` clean (exit 0, 4.5s, no TS errors); dist grep: 98 new refs present, 0 old refs
- [x] Step 12: `memory-bank/activeContext.md` — new Current Status; prior ACK Overlay Ripple Visibility demoted to Previous Context
- [x] Step 13: `memory-bank/progress.md` — this section
- [x] Step 14: No `projectstructure.md` change (no files added/renamed/deleted beyond the plan doc)

### Key decisions
1. **Two orthogonal dropdowns over one compound + toggle** — old 7-option Style + separate pulse toggle (14 combos) → 4 Style × 4 Icon Style = 16 real combos (2 new: border+pulse, ring+pulse), each independently controllable.
2. **2×2 matrix for Icon Style** — color on/off × pulse on/off, ordered None → Colored → Colored + Pulse → Pulse Only.
3. **`auto` Default sentinel** — same as clearing the field (undefined → runtime `??`), but discoverable. Editor `default: 'auto'`; picks up future default changes automatically.
4. **`glow` → `ring` rename** — old value was a rotating conic-gradient ring, not a soft glow. Frees up "glow" for a future uniform glow feature. Full rename (value, CSS classes, var, field, type).
5. **"No Change" → "No Color"** — old label ambiguous; new label describes the appearance (theme-tinted bg, no state color, looks like idle).
6. **No CSS rules added/removed** — existing class-based CSS is already orthogonal. New logic produces identical class combinations, just via two dropdowns. Only renames (`.glow-*` → `.ring-*`).
7. **Idempotent migration** — checks `if (raw[`${prefix}_icon_style`] !== undefined) return`; once migrated, old `*_pulse` is absent → no-op on subsequent loads.

## 24h Strength Limit Warning + Overdue Grace Wiring — Frontend Phase (2026-08-11)

**Feature:** Frontend companion to the backend Phase 1 (new `Pill24hLimitExceededSensor` binary sensor). Three coupled frontend changes: (1) new `limit_24h` ButtonState inheriting all lockout style config with "24H LIMIT REACHED" label + reworded override dialog; (2) `graceHours` wired into `resolveButtonState()` so overdue warning appears at half the grace period; (3) binary sensor entity resolution + state computation + override dialog branch. Architecture plan: [`plans/24h-strength-limit-warning-and-effectiveness-reorder-plan.md`](../Home-Assistant-Pill-Logger/plans/24h-strength-limit-warning-and-effectiveness-reorder-plan.md:1).

### Steps
- [x] Step F1: `types.ts` — added `limit24hExceeded` to `ResolvedEntities`; added `'limit_24h'` to `ButtonState` (5→6 states); added `is24hLimitReached` to `ButtonStateInput`
- [x] Step F2: `helpers.ts` — wired `graceHours` into latency boundary (`overdueSeconds > (graceHours * 3600) / 2`); added `limit_24h` to resolver (precedence: lockout → limit_24h → latency → execution → idle)
- [x] Step F3: `ax-dose-logger-card.ts` — added `_24h_limit_exceeded` suffix matching in `_computeEntities()` (auto-included in watched IDs via `Object.values()` loop)
- [x] Step F4: `ax-dose-logger-card.ts` — added `is24hLimitReached` flag in `_computeDailyButtonState()` (reads binary sensor state === 'on'); added `is24hLimitReached: false` to drinks button state input
- [x] Step F5: `ax-dose-logger-card.ts` — added 24h limit override dialog branch in `_handleTakePill()` (checked before pill-count lockout); widened `_overrideDialog` `bodyKey` type; added `_overrideDialogExtras` state field; updated `_renderOverrideDialog()` to merge extras + clear on close; cleared extras in `disconnectedCallback`
- [x] Step F6: `daily-panel.ts` — `_takeButtonClasses()`: `limit_24h` shares lockout branch (same style + icon_style config, same red color); template: aria-label / icon / label handle `limit_24h` distinctly; CSS: added `.state-limit_24h` ripple rule + `:not(.state-limit_24h)` to base idle selectors
- [x] Step F7: `localize.ts` — added `daily.24h_limit_reached`, `aria.take_pill_24h_limit`, `dialog.override.body_24h_exceeded`, `dialog.override.body_24h_would_exceed` (with {current}/{limit}/{next}/{projected}/{unit} placeholders)
- [x] Step F8: `README.md` — updated feature description (5→6 states); updated Button State Matrix table (added 24H Limit Reached row, updated Take Pill + Overdue descriptions for half-grace); added 24H Limit Reached inheritance explanation; updated overdue boundary description
- [x] Step F9: Verify — `yarn run build` exit 0 (5s, no TS errors); dist grep: `limit_24h` ×10, `24h_limit_reached` ×2, `is24hLimitReached` ×5, `limit24hExceeded` ×10, `body_24h` ×4, `graceHours * 3600` ×1

### Key decisions
1. **`limit_24h` inherits ALL lockout style config** — same red color, same CSS, same editor fields. Only label + dialog text differ. No new editor fields, no config migration.
2. **Precedence: lockout → limit_24h → latency → execution → idle** — 24h strength limit after pill-count lockout (stricter gate) but before overdue/schedule states.
3. **Overdue at half grace** — `overdueSeconds > (graceHours * 3600) / 2`. First half = execution (on-time, no rush), second half = latency (proactive heads-up). Fixes the 0-second overdue warning disconnect. Single overdue state, no visual distinction at full grace.
4. **24h limit checked before pill-count lockout in `_handleTakePill()`** — more specific warning shown first. `_overrideDialogExtras` stores current/limit/next/projected/unit for the dialog body placeholders.
5. **No `projectstructure.md` change** — no files added/renamed/deleted (all in-place edits + dist rebuild).


## On-Time Window: Overdue-Gate Fix + Hours→Minutes Migration — Frontend Phase (2026-08-11)

**Feature:** Frontend companion to the backend On-Time Window fix (config-version v14 → v15). Two coupled frontend changes: (1) `_resolveGraceHours()` rewritten to prefer the Overdue sensor's new `grace_minutes` attribute (always present for scheduled meds, independent of `enable_adherence`) over the adherence sensors' `grace_hours`, fixing the silent-1.0h-fallback bug that ignored the user's configured value when adherence tracking was off; (2) `README.md` Button State Matrix + explanatory paragraph updated to reflect that the overdue-at-half-grace boundary applies to ALL scheduled meds (not just adherence-tracked) and is now configured in minutes. Architecture plan: [`plans/on-time-window-fix-and-units-migration-plan.md`](../Home-Assistant-Pill-Logger/plans/on-time-window-fix-and-units-migration-plan.md:1).

### Steps
- [x] Step F1: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1045) — rewrote `_resolveGraceHours()`: (1) prefer `Overdue.grace_minutes / 60` (the Overdue sensor is created for every scheduled med, independent of `enable_adherence` — the reliable single source of truth); (2) fall back to adherence sensors' `grace_hours` (legacy path, defensive); (3) final fallback 1.0h (matches backend default 60 min). Docstring rewritten to explain the resolution order + the bug fix.
- [x] Step F2: [`README.md`](README.md:1) — 2 table rows "adherence grace window" → "on-time window"; explanatory paragraph rewritten: "adherence grace period" → "On-Time Window ... in minutes", added "Applies to all scheduled medications, whether or not adherence tracking is enabled", "before adherence expires" → "the window is closing".
- [x] Step F3: Verify — `yarn run build` exit 0 (5.5s, no TS errors); `grep -c grace_minutes dist/ax-dose-logger-card.js` = 4 (comment + resolver logic).

### Key decisions
1. **Overdue sensor is the new source of truth for grace** — the adherence sensors only exist when `enable_adherence` is on, so reading `grace_hours` from them silently fell back to 1.0h when adherence was off (ignoring the user's configured value). The Overdue sensor is created for every scheduled med (`tracking_type != AS_NEEDED`), so its `grace_minutes` attribute is always available. This fixes Bug 2 at the source.
2. **`helpers.ts` unchanged** — `ButtonStateInput.graceHours` stays in hours internally; the unit conversion (`grace_minutes / 60`) is isolated in `_resolveGraceHours()`. The latency boundary `overdueSeconds > (graceHours * 3600) / 2` is unchanged. Minimal blast radius.
3. **README wording aligned with the backend descriptor fix** — the backend dropped "Only applies when adherence tracking is on" + added "Applies to all scheduled medications"; the frontend README mirrors this so the two docs agree.
4. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edit + dist rebuild).

## Ambilight Glow Style — GPU-Composited Backdrop + Breathing (2026-08-11)

**Feature:** Added a **6th per-state Style option** "Ambilight Glow" to the button State Matrix — a soft, diffused colored light radiating outward from behind the button (like an ambilight TV against a wall: vibrant at the edge, quickly diffusing), with a slow breathing pulse. The architecture rejects the v1 `box-shadow` approach (CPU repaint → tablet-SOC lag) in favor of a GPU-composited backdrop: a dedicated `<div class="glow-backdrop">` sibling of the button (inside a new `.take-pill-wrap` / `.log-drink-wrap` wrapper that becomes the flex child) bleeds outward (`inset: -18px`) with a **static** `filter: blur(16px)`; the breathing animates **`opacity` only** (0.35 ↔ 0.85) on a compositor-only GPU layer (zero repaint). The button face stays theme-tinted. `will-change: opacity` is sandboxed inside the active `.glow-{color} .glow-backdrop` selector so inactive states release the GPU layer + VRAM. The existing `*_ring_speed` dropdown is renamed "Glow / Ring Speed" and its `--ring-duration` var drives both the ring sweep and the glow breathing cadence. Architecture plan: [`plans/ambilight-glow-style-plan.md`](plans/ambilight-glow-style-plan.md).

### Steps
- [x] Step A1: Context grounding — read activeContext, projectstructure, the existing glow/ring plans, types, editor schema, panel CSS + class helpers; analyzed the button State Matrix architecture (5 style options, per-state config fields, class helpers, CSS structure).
- [x] Step A2: Architect — wrote plan v1 (box-shadow approach); user confirmed the breathing-speed approach (shared `--ring-duration`, "Glow / Ring Speed" label).
- [x] Step A3: Plan revision v2 — user rejected box-shadow (CPU-repaint on tablet SOCs); rewrote to GPU-composited backdrop (static `filter: blur` + opacity-only animation, wrapper div, no box-shadow). Verified `.daily-main` / `.pane-daily` have no `overflow: hidden` → backdrop can bleed freely.
- [x] Step A4: Plan revision v2.1 (VRAM patch) — user required `will-change: opacity` sandboxed inside the active `.glow-{color} .glow-backdrop` selector only; base `.glow-backdrop` class omits it so inactive states revert to `will-change: auto` and release the GPU layer + VRAM. Plan approved.
- [x] Step A5: [`src/types.ts`](src/types.ts) — added `'glow'` to the `ButtonStateStyle` union (6 options); updated the doc comment.
- [x] Step A6: [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — appended `{ value: 'glow', label: localize('en', 'button_style.glow') }` to `_buttonStyleOptions()`; updated the comment (5 → 6 options).
- [x] Step A7: [`src/localize.ts`](src/localize.ts) — added `'button_style.glow': 'Ambilight Glow'`; renamed `config.*_ring_speed` → "Glow / Ring Speed"; updated the 4 per-state style helper texts to list all 5 visual options; updated both `*_ring_speed` helper texts to mention the glow breathing.
- [x] Step A8: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — (a) `_takeGlowWrapClass()` helper; (b) `_takeButtonClasses()` pushes `style-none` for glow; (c) template: wrapped the button in `.take-pill-wrap` (carrying the glow class + `--ring-duration`) with `<div class="glow-backdrop">` as its first child; (d) CSS: `.take-pill-wrap`, `z-index: 1` on `.take-pill-btn`, `.glow-backdrop` base (no will-change/animation), per-color `--glow-color` tokens, active-glow selector (sandboxed will-change + animation), `@keyframes ax-btn-glow-breathe`.
- [x] Step A9: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — mirror: `_logDrinkGlowWrapClass()` helper; `_logDrinkButtonClasses()` pushes `style-none` for glow; template `.log-drink-wrap` + `<div class="glow-backdrop">`; CSS `.log-drink-wrap`, `z-index: 1` on `.log-drink-btn`, `.glow-backdrop` base, `glow-red`/`glow-green` tokens, active-glow selector, `@keyframes ax-btn-glow-breathe`. Fixed an unterminated CSS comment introduced during the edit.
- [x] Step A10: [`README.md`](README.md) — updated the Button State Matrix style-options list (4 → 5 visual + Default; added "Ambilight Glow" with a description of the ambilight-backlight effect + GPU-composited breathing); renamed "Rotating Ring Speed" → "Glow / Ring Speed" and noted it drives both the ring sweep and the glow breathing.
- [x] Step A11: Verify — `yarn run build` exit 0 (4.9s, no TS errors). Dist grep: `take-pill-wrap` ×13, `log-drink-wrap` ×8, `glow-backdrop` ×15, `ax-btn-glow-breathe` ×4, `glow-red` ×4, `glow-blue` ×2, `glow-amber` ×2, `glow-green` ×4, `Ambilight Glow` ×7, `Glow / Ring Speed` ×2. `will-change: opacity` exactly ×2 (one per panel, both inside the active glow selector) — VRAM sandboxing verified.
- [x] Step A12: Memory bank — updated [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status; archived On-Time Window fix) + this progress section. No `projectstructure.md` change.

### Key decisions
1. **Dedicated backdrop DOM node, not box-shadow** — animating `box-shadow` repaints on CPU; on tablet SOCs multiple breathing buttons lag. A separate `<div class="glow-backdrop">` with static `filter: blur(16px)` + animated `opacity` is GPU-composited (no repaint). v1 box-shadow rejected after user feedback.
2. **Wrapper div becomes the flex child** — the button has `overflow: hidden` (clips ring-track/ripple), so the backdrop cannot live inside it. The `.take-pill-wrap` / `.log-drink-wrap` wrapper (no overflow:hidden) holds the backdrop as a sibling of the button; the backdrop bleeds outward freely. `.daily-main` / `.pane-daily` have no overflow:hidden (verified) → backdrop is visible.
3. **Static `filter: blur`, animated `opacity` only** — the blur is rasterized once when the compositor layer is created; the keyframe only fades the pre-blurred layer in/out (0.35 ↔ 0.85). Zero per-frame CPU work.
4. **`will-change: opacity` sandboxed to the active glow selector (v2.1 VRAM patch)** — OMITTED from the base `.glow-backdrop` class so inactive (non-glow) states revert to `will-change: auto` and release the GPU compositor layer + flush the VRAM footprint. Applying it to the always-present base class would pin a GPU layer for every button → VRAM leak.
5. **Backdrop always in template, gated by wrapper class** — the empty div is cheap; the `glow-{color}` class on the wrapper is the on/off switch. No glow class → backdrop `opacity: 0` + no animation + no will-change → zero cost for non-glow states.
6. **Button face stays theme-tinted** (`style-none` branch for glow) — the glow is an outer light; the button reads as normal/safe, icon recolored via the orthogonal Icon Style dropdown.
7. **Reuse `--ring-duration` for breathing cadence** (per user decision) — one speed dropdown controls both glow + ring; label renamed "Glow / Ring Speed". Set on the wrapper so the backdrop inherits it.
8. **`glow` is a NEW 6th style option, not a replacement for `ring`** — they are visually opposite (rotating neon perimeter vs. static breathing backlight). Coexisting gives users both. The `glow` name is reclaimed with new semantics; the legacy `glow → ring` migration is unaffected. No new default, no migration — glow is opt-in per state.
9. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edits + dist rebuild).

## Frozen-Config Crash Fix — setConfig Clone + Migration Guard Hardening (2026-08-11)

**Feature:** Fixed the `Configuration error - Cannot assign to read only property 'take_button_lockout_style'` crash that occurred when changing the per-state **Style** dropdown in the visual editor (the Icon Style dropdown worked fine). Root cause: HA's Lovelace editor passes a **frozen** (`Object.freeze`) config object to `setConfig` in some flows; the button-state migration code in `_migrateOneButtonState()` mutated that object in place, which throws in strict mode. A second interacting bug: the legacy `glow → ring` style mapping conflicted with the new `glow` (Ambilight Glow) style, and HA's editor omits the `*_icon_style` field when it's at its default (`'auto'`), defeating the migration guard — so migration re-ran on every style-only edit.

### Steps
- [x] Step B1: Debug — read `_migrateOneButtonState()` + `setConfig()` in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts); confirmed line 74 (`raw['take_button_lockout_style'] = newStyle`) mutates the config in place; confirmed `setConfig` passes the raw config to migration without cloning; confirmed the editor schema omits `*_icon_style` at default; confirmed icon-style works because it sets `*_icon_style` in the emitted config (guard at line 55 fires, skips migration).
- [x] Step B2: Fix 1 — [`src/ax-dose-logger-card.ts:264`](src/ax-dose-logger-card.ts:264) `setConfig()`: added `config = { ...(config as any) }` as the first statement (defensive shallow clone so downstream migrations never mutate HA's frozen object). Added explanatory comment.
- [x] Step B3: Fix 2 — [`src/ax-dose-logger-card.ts:50`](src/ax-dose-logger-card.ts:50) `_migrateOneButtonState()`: removed the `oldStyle === 'glow' ? 'ring'` branch from the `newStyle` ternary (`glow` is now a valid style).
- [x] Step B4: Fix 3 — [`src/ax-dose-logger-card.ts:50`](src/ax-dose-logger-card.ts:50) `_migrateOneButtonState()`: added early-return guard `if (oldPulse === undefined && !hasIcon) return;` so modern configs (modern style + no legacy pulse) skip migration entirely, fixing the idempotency fragility.
- [x] Step B5: Verify — `yarn run build` exit 0 (4.9s, no TS errors). Dist grep: `config = { ...config` present (clone confirmed); `icon_glow ? 'ring'` absent (`glow → ring` removed; `icon_glow → ring` still present, correct for legacy composite styles).
- [x] Step B6: Memory bank — updated [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status; archived Ambilight Glow block) + this progress section. No `projectstructure.md` change.

### Key decisions
1. **Shallow clone at the entry point, not deep** — all nested button-state config lives at the top level (`take_button_*`, `drink_button_*`), and the only nested structure (`chips[]`) is handled by the existing spread at lines 273-275. A shallow clone is sufficient and cheaper than `structuredClone`.
2. **`glow` no longer remapped to `ring`** — reclaiming the `glow` name with new semantics (Ambilight Glow). Legacy users who never migrated (rare edge case) get the new glow style instead of the old ring; the old ring is still selectable explicitly. This is a minor visual change, not a breaking error.
3. **Idempotency guard keyed on legacy markers** — `*_pulse` (deleted during migration, never re-emitted by the modern editor) and `icon`/`icon_border`/`icon_glow` (legacy composite style names, not in the modern dropdown). Modern styles (`full`/`border`/`none`/`ring`/`glow`/`auto`) with no pulse are recognized as already-migrated and skipped. This prevents the editor-omits-default-field footgun.
4. **Why icon style worked but style didn't** — changing the icon style dropdown sets `*_icon_style` in the emitted config, so the existing guard at line 55 (`if (raw[...] !== undefined) return;`) fired and skipped migration. Changing only the style dropdown omitted `*_icon_style` (at default), so the guard failed and migration ran → hit the frozen-object crash.
5. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edits + dist rebuild).

## Card-Root Ambilight Glow Architecture (2026-08-11)

**Feature:** Moved the ambilight glow backdrop from the panel-level wrapper (`.take-pill-wrap` / `.log-drink-wrap`) to the **card root** (`<ha-card>` in `ax-dose-logger-card.ts`), so the glow now renders behind the ENTIRE card content (button, stat boxes, chips, nav bar, title — "basically behind everything"). The `<div class="card-glow-backdrop">` is the first child of `<ha-card>`, positioned absolutely at `inset: 0` with `z-index: 0`; all card content gets `z-index: 1`. The `glow-{color}` class is set on `<ha-card>` by `_cardGlowClass()`. Also diagnosed Bug 1 ("Full Button style not working") as NOT a bug — `full-blue` is visually identical to the default theme because `--btn-blue` (#03a9f4) IS the default primary color. Architecture plan: [`plans/card-root-glow-architecture-plan.md`](plans/card-root-glow-architecture-plan.md).

### Steps
- [x] Step C1: Debug — investigated read-only property error; diagnosed root cause (frozen config + glow→ring migration + idempotency fragility).
- [x] Step C2: Fix frozen-config crash — `setConfig()` shallow-clone at entry + remove `glow → ring` mapping + idempotency guard. Build + verify.
- [x] Step C3: Diagnose Bug 1 (Full Button) — NOT a bug; `full-blue` = `rgba(3,169,244,0.12)` = default theme background because `--btn-blue` = `--primary-color` = `#03a9f4`. "Border Only" is visible because it adds a border, not a background tint.
- [x] Step C4: Architect — wrote card-root glow plan ([`plans/card-root-glow-architecture-plan.md`](plans/card-root-glow-architecture-plan.md)); user approved.
- [x] Step C5: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — added `RingSpeed` import; added `_ringDuration()` + `_cardGlowClass()` + `_resolveGlowForState()` helpers; template: added `class` + `--ring-duration` to `<ha-card>`, injected `<div class="card-glow-backdrop">`; CSS: `position: relative` on `ha-card`, `z-index: 1` on `.card-content` + `.pane-selector`, `.card-glow-backdrop` base + per-color tokens + active-glow selector (sandboxed will-change) + `@keyframes ax-card-glow-breathe`; `:host` — duplicated `--btn-*` / `--rgb-btn-*` color tokens.
- [x] Step C6: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — removed `_takeGlowWrapClass()` + `_ringDuration()` helpers; removed `RingSpeed` import; template: unwrapped button from `.take-pill-wrap`; CSS: removed `.take-pill-wrap` + glow CSS + `@keyframes ax-btn-glow-breathe`; removed `z-index: 1` from `.take-pill-btn`.
- [x] Step C7: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — mirror: removed `_logDrinkGlowWrapClass()` + `_ringDuration()` helpers; removed `RingSpeed` import; unwrapped button from `.log-drink-wrap`; removed glow CSS + keyframe; removed `z-index: 1` from `.log-drink-btn`.
- [x] Step C8: Verify — `yarn run build` exit 0 (5.1s). Dist grep: `card-glow-backdrop` ×11, `take-pill-wrap` ×0, `log-drink-wrap` ×0, `ax-card-glow-breathe` ×2, `ax-btn-glow-breathe` ×0, `will-change: opacity` ×1 (VRAM-safe), `glow-red` ×2, `_cardGlowClass` ×4.
- [x] Step C9: Memory bank — updated [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status; archived panel-level Ambilight Glow + Frozen-Config Fix) + this progress section. No `projectstructure.md` change.

### Key decisions
1. **Glow at card root, not panel level** — the user wants the glow behind everything (stat boxes, nav bar, title). Only `<ha-card>` contains all of these.
2. **`ha-card` gets the `glow-{color}` class** — the glow color token is set on `ha-card`, and the backdrop reads it.
3. **`ha-card` already has `overflow: hidden`** — the glow is clipped to the card boundary (what we want).
4. **No `isolation: isolate` needed** — at the card root, the backdrop is the first child with `z-index: 0`, and all content stacks above it naturally. `isolation: isolate` has zero CPU overhead but is simply unnecessary here.
5. **Color vars duplicated in card root `:host`** — CSS custom properties cascade across shadow boundaries, but the card-root glow CSS lives in the card's own shadow DOM. The `--btn-*` / `--rgb-btn-*` tokens were only defined in the panel's `:host`; duplicating them in the card root `:host` makes them available to both scopes.
6. **Panel wrappers fully removed** — `.take-pill-wrap` / `.log-drink-wrap` are gone. The button returns to its original position as a direct child of `.daily-main`. Simplifies the layout.
7. **Bug 1 (Full Button) was NOT a bug** — `full-blue`'s background is identical to the default theme because `--btn-blue` = `#03a9f4` = the default primary color. No visible change for blue; visible for red/amber/green.
8. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edits + dist rebuild).

## Architecture Rollback & Z-Axis Stacking Patch (v2.1) (2026-08-11)

**Feature:** Rolled back the v3 card-root glow architecture (rejected by user — "Elevating the backdrop to `<ha-card>` destroys the local spatial mapping") and restored the v2 localized wrapper architecture with explicit z-index routing. The wrapper (`.take-pill-wrap` / `.log-drink-wrap`) gets `isolation: isolate` + `z-index: 0` to spawn a localized z-axis boundary. The backdrop gets `z-index: -1` (behind the wrapper, in front of the card background). The button gets `z-index: 1`. Adjacent UI (`.med-name` / `.drinks-title`, `.stats-column`, `.chips-row`, `.pane-selector`) gets `z-index: 1` so the 18px diffusion bleeds behind them. Architecture plan: [`plans/architecture-rollback-z-axis-stacking-plan.md`](plans/architecture-rollback-z-axis-stacking-plan.md).

### Steps
- [x] Step R1: Plan — wrote architecture rollback plan; user approved.
- [x] Step R2: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — stripped ALL card-root glow: `_cardGlowClass()` / `_resolveGlowForState()` / `_ringDuration()` helpers, `RingSpeed` import, `--btn-*` / `--rgb-btn-*` from `:host`, `class` + `--ring-duration` on `<ha-card>`, `<div class="card-glow-backdrop">`, all card-root glow CSS + `@keyframes ax-card-glow-breathe`, `position: relative` on `ha-card`, `z-index: 1` on `.card-content`. Kept `setConfig()` clone + migration guard + `z-index: 1` on `.pane-selector`.
- [x] Step R3: [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — restored `RingSpeed` import + `_takeGlowWrapClass()` + `_ringDuration()` helpers; restored `.take-pill-wrap` wrapper + `<div class="glow-backdrop">`; CSS: wrapper with `isolation: isolate` + `z-index: 0`, backdrop with `z-index: -1`, button with `z-index: 1`, glow CSS + keyframe; `z-index: 1` on `.med-name`, `.stats-column`, `.chips-row`.
- [x] Step R4: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — mirror: restored `RingSpeed` import + helpers + `.log-drink-wrap` wrapper + glow CSS; `z-index: 1` on `.drinks-title`, `.stats-column`.
- [x] Step R5: Verify — `yarn run build` exit 0 (4.7s). Dist grep: `take-pill-wrap` ×13, `log-drink-wrap` ×8, `card-glow-backdrop` ×0, `isolation: isolate` ×2, `z-index: -1` ×2, `ax-btn-glow-breathe` ×4, `ax-card-glow-breathe` ×0, `will-change: opacity` ×2, `glow-backdrop` ×15.
- [x] Step R6: Memory bank — updated [`memory-bank/activeContext.md`](memory-bank/activeContext.md) + this progress section. No `projectstructure.md` change.

### Key decisions
1. **Rollback to v2 wrapper** — the card-root approach destroyed local spatial mapping. The wrapper keeps the glow localized to the button area.
2. **`isolation: isolate` on the wrapper** — spawns a localized z-axis boundary so the backdrop's `z-index: -1` can't bleed behind the card background. No CPU overhead (one-time compositor hint).
3. **`z-index: -1` on the backdrop** — renders behind the wrapper baseline (z-index:0) but in front of the card background (because the wrapper's `isolation: isolate` contains the z-axis). The 18px diffusion bleeds outside the wrapper but stays behind adjacent siblings (z-index:1).
4. **`z-index: 1` on adjacent UI** — `.med-name` / `.drinks-title`, `.stats-column`, `.chips-row`, `.pane-selector` all get `position: relative; z-index: 1` so the glow bleeds behind them, not on top.
5. **VRAM retention** — `will-change: opacity` stays sandboxed inside the active `.glow-{color} .glow-backdrop` selector (×2, one per panel, both VRAM-safe).
6. **Keep `setConfig()` clone + migration guard** — separate bug fixes, not part of the glow architecture.
7. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edits + dist rebuild).

## Z-Axis Dependency Fix & DOM Reordering (Belt-and-Suspenders) (2026-08-11)
**Feature**: Audited the v2.1 z-axis implementation against the user's 5 architecture patches (adjacent UI `position: relative; z-index: 1`; button core z-axis deps; DOM injection order backdrop-before-button; `.glow-backdrop` `position: absolute; z-index: -1`; wrapper `isolation: isolate; position: relative; z-index: 0`). Audit found 4.9/5 patches already satisfied by the v2.1 rollback. The ONLY missing piece was Drinks `.chips-row` — it lacked `position: relative; z-index: 1;`, so z-index was a null operation on the static chips and the 18px `.glow-backdrop` diffusion (`inset: -18px`, bleeding beyond `.daily-main`) painted on top of them. Per user choice, ALL 6 adjacent UI selectors across 3 files were defensively re-tagged "(Patch 1, belt-and-suspenders)" in their inline comments. DOM injection order, button z-axis deps, backdrop z-index floor, and wrapper isolation were all verified already correct in source. Architecture plan: [`plans/z-axis-dependency-fix-plan.md`](plans/z-axis-dependency-fix-plan.md).

### Root cause (Drinks chips-row bleed)
**z-index is a null operation on static (position:auto) elements.** The Drinks `.chips-row` had no `position` declaration, so it stayed in the wrapper's `isolation: isolate` floor (z-index auto). The 18px `.glow-backdrop` diffusion (which bleeds `inset: -18px` beyond `.daily-main`) painted on top of the chips because the backdrop's z-index:-1 (inside the wrapper's isolated stacking context) was below the wrapper baseline (z-index:0) but the chips had no z-index to lift above it. Adding `position: relative; z-index: 1;` lifts the chips above the wrapper's stacking-context floor, mirroring the Daily panel's working behavior.

### Checklist
- [x] Step 1: Context grounding — read memory-bank/activeContext.md (v2.1 rollback status); read daily-panel.ts + drinks-panel.ts + ax-dose-logger-card.ts `.pane-selector` CSS
- [x] Step 2: Audit all 5 patches against live source — built a 5×3 invariant matrix; found 4.9/5 satisfied; only Drinks `.chips-row` missing `position: relative; z-index: 1;`
- [x] Step 3: Architecture plan — plans/z-axis-dependency-fix-plan.md (audit table, single code delta, symptom→cause mapping, verification tokens)
- [x] Step 4: User decision — chose belt-and-suspenders (defensively re-tag ALL adjacent UI selectors even if already present)
- [x] Step 5: src/components/drinks-panel.ts — `.chips-row` (L832): ADDED `position: relative; z-index: 1;` + multi-line rationale comment; `.drinks-title` (L415) + `.stats-column` (L429): re-tagged "(Patch 1, belt-and-suspenders)"
- [x] Step 6: src/components/daily-panel.ts — `.med-name` (L460), `.stats-column` (L473), `.chips-row` (L921): re-tagged "(Patch 1, belt-and-suspenders)" (no functional change)
- [x] Step 7: src/ax-dose-logger-card.ts — `.pane-selector` (L2910): re-tagged "(Patch 1, belt-and-suspenders)" (no functional change)
- [x] Step 8: Verification — `yarn run build` clean (exit 0, 5.4s); dist grep: `take-pill-wrap` ×13, `log-drink-wrap` ×8, `isolation: isolate` ×2, `z-index: -1` ×2, `glow-backdrop` ×16, `card-glow-backdrop` ×0, `ax-card-glow-breathe` ×0, `ax-btn-glow-breathe` ×4, `will-change: opacity` ×10; awk confirms BOTH `.chips-row` CSS blocks in dist contain `position: relative; z-index: 1;`
- [x] Step 9: Update memory-bank — activeContext.md (new Current Status; v2.1 rollback moved to Previous Context), progress.md (this section). No projectstructure.md change. No README change (internal z-axis fix).

### Key decisions
1. **Single real defect = Drinks `.chips-row`** — the only functional change. The Daily `.chips-row` already had the z-axis deps; the Drinks one was missed in the v2.1 rollback. This was the exact vector for the reported "bleed over adjacent static UI" symptom.
2. **"Washes out the button" was a perception/stale-build artifact** — source DOM order was already correct (backdrop before button; z-index -1 vs 1). The chips-row bleed created the visual impression of overall washout. Fresh rebuild + chips-row fix resolves both reported symptoms.
3. **Belt-and-suspenders re-tagging (user choice)** — functional no-ops on the 5 already-correct selectors; the "(Patch 1, belt-and-suspenders)" inline tag makes the z-axis dependency audit-trail visible for future maintainers so the same Drinks `.chips-row` regression can't silently reappear.
4. **No DOM reordering needed** — patches #2/#3/#4/#5 were already satisfied by the v2.1 rollback. Audit confirmed `<div class="glow-backdrop">` physically precedes `<button>` in both panel templates.
5. **No README change** — internal z-axis fix, no end-user UX/config change. Pre-existing `tabindex` lit-plugin warnings unchanged (unrelated to CSS-only change).

## Alpha Channel Solidification — Ambilight Glow Surface Materials (2026-08-11)
**Feature**: Solidified the foreground surface materials (button face, stat-pill, chip) in daily-panel.ts and drinks-panel.ts so the ambilight glow backdrop (`.glow-backdrop`, `z-index:-1`, `inset:-18px`, `filter:blur(16px)`) can no longer transmit through the translucent `rgba(...,0.12/0.06/0.05)` fills. The Z-axis stacking architecture (v2.1 rollback + belt-and-suspenders audit) was structurally correct, but the HA theme's native semi-transparent backgrounds caused a "tinted glass" effect — the glow color blended through the foreground surfaces. Root cause: z-index controls paint ORDER, but opacity controls paint BLENDING; stacking the backdrop below a translucent button face cannot stop it being seen through. Architecture plan: [`plans/alpha-channel-solidification-plan.md`](plans/alpha-channel-solidification-plan.md).

### Root cause (alpha-channel transmission)
**Z-index controls paint ORDER. Opacity controls paint BLENDING.** Every surface declaration used `rgba(var(--rgb-primary-color, 3, 169, 244), 0.12)` / `0.06` / `0.05` alpha-channel values. The 18px ambilight diffusion (bleeding outward via `inset:-18px` beyond `.daily-main`) passed *behind* these translucent fills, so the glow color blended through the surface tint rather than being occluded. Only an alpha-1.0 surface material fully occludes the backlight.

### Strategy (color-mix solidification)
Replaced every translucent `rgba(...)` fill with a fully opaque (alpha-1.0) `color-mix(in srgb, <tint-color> <pct>%, var(--card-background-color, var(--primary-background-color, #1c1c1c)))` composite. This: (1) resolves to alpha-1.0 RGB — fully occludes the backlight; (2) adapts to light AND dark themes via `--card-background-color`; (3) is perceptually identical to the prior translucent tint (same compositing math the browser was already doing); (4) reuses the same `color-mix()` primitive already in the file for `ring-track::before` shimmers. Button idle/icon/border/ring/style-none surfaces use `--ax-btn-surface` / `--ax-btn-surface-hover` tokens (12%/20% primary tint) declared on `:host`. Full-color state surfaces (`.full-red`, `.full-blue`, etc.) inline the formula with their `--btn-*` identity color. stat-pill (6%) and chip (5%) keep their deliberately subtler tints.

### Checklist
- [x] Step 1: Context grounding — read memory-bank/activeContext.md (Z-Axis Dependency Fix status); read daily-panel.ts + drinks-panel.ts CSS for button state matrix, stat-pill, chip, glow-backdrop
- [x] Step 2: Architecture plan — plans/alpha-channel-solidification-plan.md (material strategy, patch map A/B, edge cases, verification)
- [x] Step 3: User approved color-mix solidification approach (chose over flat var(--card-background-color), hardcoded #1c1c1c, and button-only patch variants)
- [x] Step 4: daily-panel.ts — added `--ax-btn-surface` + `--ax-btn-surface-hover` tokens to `:host` block (L580-581 → moved inside :host)
- [x] Step 5: daily-panel.ts — solidified `.take-pill-btn` idle/hover (L584-589), `.full-*` (L594-601), `.icon-*` (L610-617), `.border-*` (L625-628), `.ring-*` (L641-644), `.style-none` (L746-749)
- [x] Step 6: daily-panel.ts — solidified `.stat-pill` base (L879) + `.stat-pill.clickable:hover` (L925), `.chip` base (L949) + `.chip.clickable:hover` (L980)
- [x] Step 7: drinks-panel.ts — added `--ax-btn-surface` + `--ax-btn-surface-hover` tokens to `:host` block (L508-510)
- [x] Step 8: drinks-panel.ts — solidified `.log-drink-btn` idle/hover (L511-517), `.full-*` (L520-527), `.icon-*` (L538-543), `.border-*` (L548-551), `.ring-*` (L565-570), `.style-none` (L650-655)
- [x] Step 9: drinks-panel.ts — solidified `.stat-pill` base (L796) + `.stat-pill.clickable:hover` (L808), `.chip` base (L867) + `.chip.clickable:hover` (L884)
- [x] Step 10: Render-pipeline preservation audit — confirmed `.glow-backdrop` (inset:-18px, filter:blur(16px)), `isolation:isolate`, `will-change:opacity`, `@keyframes ax-btn-glow-breathe`, all z-index routing, and `--glow-color` tokens untouched in both files
- [x] Step 11: Verified `.stats-column` / `.chips-row` / `.med-name` / `.drinks-title` wrappers remain `z-index:1` with NO `overflow:hidden` added (glow must still bleed into gutters)
- [x] Step 12: `yarn run build` clean (exit 0, 5.3s); dist grep: `color-mix` ×38, `ax-btn-surface` ×18, `will-change: opacity` ×2 (active-glow preserved), `isolation:isolate` ×5, `inset:-18px` ×5, `filter:blur(16px)` ×2, `glow-backdrop` ×18, residual `rgba(var(--rgb-primary-color,3,169,244),.12)` ×0 (all button/stat/chip translucent fills removed)
- [x] Step 13: Update memory-bank — activeContext.md (new Current Status; Z-Axis Dependency Fix moved to Previous Context), progress.md (this section). No projectstructure.md change. No README change (internal CSS-only surface-material patch, no end-user UX/config change).

### Key decisions
1. **color-mix over hardcoded hex** — `color-mix(in srgb, tint 12%, var(--card-background-color, ...))` auto-adapts to light/dark themes (user not pinned to dark mode) and is the exact compositing math the browser was already doing for `rgba(...,0.12)` over the card bg, so the tint looks identical — only the alpha channel becomes 1.0. A hardcoded `#1c1c1c` would break light mode and custom themes.
2. **Token + inline hybrid** — idle/icon/border/ring/style-none surfaces (all use the primary tint) reference `--ax-btn-surface` / `--ax-btn-surface-hover` tokens to avoid repeating the long `color-mix` formula 6+ times; full-color states (`.full-red`, `.full-blue`, etc.) inline the formula with their `--btn-*` identity color because each needs a different tint source. stat-pill (6%) and chip (5%) inline their own subtler percentages.
3. **Render pipeline explicitly protected** — `.glow-backdrop` structure, `filter:blur(16px)`, `@keyframes ax-btn-glow-breathe`, `will-change:opacity`, wrapper `isolation:isolate`, all z-index routing, and `--glow-color` tokens (which MUST stay translucent for the ambilight falloff) were carved out as untouched. The patch only changes the *surface materials*; the *light emitter* is unchanged.
4. **No overflow:hidden added** to `.stats-column` or `.chips-row` — the glow's 18px outward diffusion must continue reading as outer light in the gutters. The opaque surfaces occlude the glow *where they are painted*; the glow still shows around them. Adding overflow:hidden would clip the ambilight falloff and revert the "outer light" effect.
5. **Other panels untouched** — tools-panel, inventory-panel, graphs-panel, stats-panel, tracking-panel still use translucent `rgba(...)` backgrounds. These have no `.glow-backdrop` and are not adjacent to the ambilight button, so they don't need solidification. Correctly out of scope.
6. **Pre-existing lit-plugin `tabindex` warnings** — unchanged (per the Z-Axis Dependency Fix memory note). Unrelated to CSS-only change.
7. **Nav-bar follow-up** — `.pane-selector` (card root, [`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)) had the same alpha-channel transmission bug: it's a sibling of `.card-content` (which contains the `.glow-backdrop`), and the 18px+16px glow diffusion bleeds past the bottom of `.card-content` into the nav bar's territory. With `background:none` the glow was visible THROUGH the transparent nav bar despite correct `z-index:1`. Fixed by adding `background-color: var(--card-background-color, ...)` — see the Nav-Bar Glow Overlap follow-up section below.

> ⚠️ **FAILED at runtime** — the `color-mix()` approach in this section produced **invisible elements** because HA's `--rgb-primary-color` is a raw RGB triplet, not a `<color>`. See the next section (Gradient Stacking Material Synthesis) for the replacement that uses `rgba()` over a two-layer background stack.

## Gradient Stacking — Material Synthesis (v2 Surface Patch) (2026-08-11)
**Feature**: Replaced the failed `color-mix()` surface solidification with a universally-supported **gradient-stack** two-layer background structure on `.take-pill-btn`, `.log-drink-btn`, `.stat-pill`, and `.chip` (plus hover/active states) in daily-panel.ts and drinks-panel.ts. The gradient stack bypasses the `color-mix()` parsing failure: `background-color: var(--card-background-color, ...)` (opaque base wall) + `background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(...))` (flat translucent tint — identical stops = flat color) composites into a 100% opaque element that occludes the ambilight backlight, using the exact `rgba()` syntax the component used prior to v2.1. Architecture plan: [`plans/gradient-stacking-material-synthesis-plan.md`](plans/gradient-stacking-material-synthesis-plan.md).

### Root cause (color-mix failure)
Home Assistant's `--rgb-primary-color` is a **raw RGB triplet** (e.g., `3, 169, 244`), NOT a `<color>` value. In `var(--rgb-primary-color, #03a9f4)`, the `#03a9f4` literal is a *fallback* — it only fires when the custom property is **undefined**, not when it resolves to an unparseable triplet. Since HA *defines* `--rgb-primary-color`, the fallback never engaged; `color-mix()` received `3, 169, 244` as its first operand, which is not a valid `<color>` → the entire declaration was invalid and discarded → **invisible elements** (no background at all). This affected all 11 primary-tint selector groups in both panels that consumed `--rgb-primary-color` or the `--ax-btn-surface` token.

### Strategy (gradient stacking)
Every solidified surface becomes a **two-layer background stack**: (1) **Base Layer (Opaque):** `background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c))` — the solid wall that blocks the ambilight glow. (2) **Tint Layer (Translucent):** `background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12))` — the original `rgba()` tint applied as a flat gradient (identical stops = flat color). The browser composites the gradient image over the solid color → 100% opaque element whose tint is perceptually identical to the prior `rgba(...,0.12)` over the card background, but which cannot transmit the backlight.

### Checklist
- [x] Step 1: Context grounding — read memory-bank/activeContext.md (failed Alpha Channel Solidification status); read prior `plans/alpha-channel-solidification-plan.md`; located all `color-mix` / `ax-btn-surface` usages in both panels via search_files
- [x] Step 2: Root-cause verification — confirmed `--rgb-primary-color` / `--rgb-btn-*` are raw RGB triplets (e.g., `--rgb-btn-blue: 3, 169, 244`) designed for `rgba()`, not `color-mix()`; confirmed base button `transition: background 0.2s` (gradient-image transitions snap, matches pre-v2.1 behavior)
- [x] Step 3: Architecture plan — [`plans/gradient-stacking-material-synthesis-plan.md`](plans/gradient-stacking-material-synthesis-plan.md) (root cause, gradient-stack principle, 16+14 patch map, token purge, render-pipeline protection, verification)
- [x] Step 4: User approved; switched to Code mode
- [x] Step 5: daily-panel.ts — REMOVED `--ax-btn-surface` + `--ax-btn-surface-hover` token defs + 10-line comment block from `:host` (L564-579)
- [x] Step 6: daily-panel.ts — patched `.take-pill-btn` idle/hover, `.full-*` (red/blue/amber/green) + hovers, `.icon-*` + hovers, `.border-*`, `.ring-*` base, `.style-none` (16 selector groups) to the two-layer gradient stack
- [x] Step 7: daily-panel.ts — patched `.stat-pill` base (0.06) + hover (0.12), `.chip` base (0.05) + hover (0.12) to the gradient stack
- [x] Step 8: drinks-panel.ts — REMOVED `--ax-btn-surface` + `--ax-btn-surface-hover` tokens + comment block from `:host`
- [x] Step 9: drinks-panel.ts — patched `.log-drink-btn` idle/hover, `.full-red`/`.full-green` + hovers, `.icon-*` + hovers, `.border-*`, `.ring-*` base, `.style-none` (14 selector groups) to the gradient stack
- [x] Step 10: drinks-panel.ts — patched `.stat-pill` base + hover, `.chip` base + hover to the gradient stack
- [x] Step 11: Render-pipeline preservation audit — confirmed `.glow-backdrop` (inset:-18px, filter:blur(16px)), `isolation:isolate`, `will-change:opacity` (×2 sandboxed), `@keyframes ax-btn-glow-breathe`, all z-index routing, and `--glow-color` tokens untouched in both files; the 4 `.ring-track::before` conic-gradient shimmer `color-mix()` calls per panel KEPT (use valid `--btn-*` hex, parse correctly, shimmer effects not surface fills)
- [x] Step 12: `yarn run build` clean (exit 0, 5.2s); dist grep: `color-mix` ×8 (only ring-track shimmers), `ax-btn-surface` ×0 (fully purged), `linear-gradient(rgba(var(--rgb-primary-color` ×22 (new tint layers), `background-color: var(--card-background-color` ×20 (new base walls). Render pipeline: `will-change: opacity` ×2, `isolation:isolate` ×7, `inset:-18px` ×3, `filter:blur(16px)` ×2, `glow-backdrop` ×16
- [x] Step 13: Update memory-bank — activeContext.md (new Current Status; failed color-mix Alpha Channel Solidification archived under Previous Context), progress.md (this section). No projectstructure.md change. No README change (internal CSS-only surface-material patch, no end-user UX/config change).

### Key decisions
1. **`background-image` over `background-color` for the tint** — `background-color` + `background-image` are separate properties; the browser composites the gradient image over the solid color. The element is fully opaque (base layer alpha = 1.0) → backlight cannot transmit. `linear-gradient(c, c)` with identical stops = flat color (not a visible gradient). Standard "flat tint via gradient" trick.
2. **`rgba()` over `color-mix()`** — HA's `--rgb-primary-color` / `--rgb-btn-*` are raw RGB triplets designed for `rgba()`. `rgba(var(--rgb-primary-color, 3, 169, 244), 0.12)` is the exact original syntax the component used prior to v2.1 — no parsing failure. `color-mix()` requires `<color>` operands; triplets are invalid there.
3. **Token purge** — `--ax-btn-surface` / `--ax-btn-surface-hover` were `color-mix()` expressions that fail on HA triplets; removed entirely. Gradient stacks written inline per selector (each references its own tint source + percentage: 12% idle, 20% hover, 6% stat-pill, 5% chip). A single token can't represent all of them.
4. **`.ring-track::before` shimmers KEPT** — the 4 `color-mix(in srgb, var(--btn-*) 60%, #fff)` calls per panel use `--btn-*` (valid hex), parse correctly. Shimmer effects on the ring track (conic-gradient), not surface fills. Out of scope.
5. **Render pipeline explicitly protected** — `.glow-backdrop` structure, `filter:blur(16px)`, `@keyframes ax-btn-glow-breathe`, `will-change:opacity` (×2 sandboxed in active-glow), wrapper `isolation:isolate`, all z-index routing, `--glow-color` tokens (MUST stay translucent for ambilight falloff) all untouched. The patch only changes surface materials; the light emitter is unchanged.
6. **Transition behavior unchanged** — `.take-pill-btn` / `.log-drink-btn` declare `transition: background 0.2s`; gradient-image transitions snap (not interpolatable), but this matches the pre-v2.1 `rgba()` behavior being restored. No regression.
7. **Universally supported** — `linear-gradient()` + `rgba()` + `background-color` are supported in Chromium 40+ (Android WebView). No `color-mix()` (Chromium 111+) dependency. Natively satisfies legacy WebView fallback requirements.
8. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edits + dist rebuild).

## Nav-Bar Glow Overlap — .pane-selector Solidification Follow-up (2026-08-11)
**Feature**: Follow-up to the Gradient Stacking Material Synthesis patch. After the surface-material patch landed, the user reported the ambilight glow was still overlapping the navigation bar at the bottom of the card. Root cause: the **same alpha-channel transmission bug** that affected `.stat-pill` and `.chip`, but at the card-root level. `.pane-selector` (the nav bar) is a sibling of `.card-content` (which contains the `.glow-backdrop` via the panel components). The 18px outward diffusion (`inset:-18px`) + 16px blur bleeds past the bottom of `.card-content` into the nav bar's territory. The nav bar had correct z-axis (`position:relative; z-index:1`), but `background:none` — so the glow was visible THROUGH the transparent nav bar. Z-index controls paint ORDER; opacity controls paint BLENDING — a transparent surface cannot occlude the backlight regardless of z-index.

### Strategy
Applied the same surface-solidification pattern used on `.stat-pill`/`.chip`: added `background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c))` to `.pane-selector`. Visually identical (same color as the card background), but now an opaque wall that fully occludes the backlight. The nav bar's `border-top` divider line renders on top of the opaque background as before.

### Checklist
- [x] Step 1: Diagnose — traced the DOM structure in [`ax-dose-logger-card.ts:2488-2498`](src/ax-dose-logger-card.ts:2488) (`.pane-selector` is a sibling of `.card-content`, which contains the panel → `.take-pill-wrap` → `.glow-backdrop`); confirmed `.pane-selector` had `position:relative; z-index:1` (z-axis correct) but `background:none` (alpha-channel transparent); confirmed `.pane-btn` also `background:none`
- [x] Step 2: Root cause — same alpha-channel transmission as `.stat-pill`/`.chip`; z-index routing was already correct (Patch 1 belt-and-suspenders), but opacity blending let the glow show through the transparent nav bar
- [x] Step 3: User approved the solidification approach (matches the `.stat-pill`/`.chip` surface solidification pattern)
- [x] Step 4: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:2907) — added `background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c))` to `.pane-selector` + explanatory comment block
- [x] Step 5: `yarn run build` clean (exit 0, 5.4s); dist verification: `.pane-selector` block contains `background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c))`; total `background-color: var(--card-background-color` count rose 20→21; render pipeline tokens all preserved (`will-change: opacity` ×2, `isolation:isolate` ×7, `inset:-18px` ×3, `filter:blur(16px)` ×2, `glow-backdrop` ×17, `color-mix` ×8)
- [x] Step 6: Update memory-bank — activeContext.md (append nav-bar fix to current status), progress.md (this section). No projectstructure.md change. No README change.

### Key decisions
1. **Same solidification pattern as `.stat-pill`/`.chip`** — the alpha-channel transmission bug is location-agnostic: any transparent surface in the glow's diffusion path shows the backlight through it regardless of z-index. The fix is always an opaque `background-color` matching the card background.
2. **Card-root level, not panel level** — `.pane-selector` lives in `ax-dose-logger-card.ts` (the card root), not in the panel components. The prior patch only touched `daily-panel.ts` and `drinks-panel.ts`; this follow-up extends the solidification to the card-root nav bar.
3. **`background-color` not `background-image` gradient stack** — the nav bar has no tint (it's the plain card background color, not a primary-tinted surface), so a single opaque `background-color` is sufficient. The gradient-stack two-layer structure is only needed where a translucent tint must be preserved over the opaque base.
4. **`border-top` divider preserved** — the `border-top: 1px solid var(--divider-color, ...)` renders on top of the new opaque background; the divider line remains visible as before.
5. **Render pipeline untouched** — no `.glow-backdrop`, `isolation:isolate`, `filter:blur`, `will-change`, or z-index changes. The fix only adds an opaque surface material to the nav bar.
6. **No `projectstructure.md` change** — no files added/renamed/deleted (in-place edit + dist rebuild).

## Ambilight Glow Radius Halving (2026-08-11)

User requested the Ambilight Glow effect radiate out half as far. The glow radius is the product of two cooperating CSS values on each `.glow-backdrop`: the physical spill (`inset`) and the Gaussian diffusion (`filter:blur`). Both halved together to preserve the ambilight falloff ratio at half the spatial extent.

- [x] Read memory-bank context (activeContext current status, projectstructure) + locate the glow CSS in daily-panel.ts / drinks-panel.ts / ax-dose-logger-card.ts
- [x] Plan the halving: `inset -18px -> -9px`, `border-radius +18px -> +9px`, `blur(16px) -> blur(8px)` in both `.take-pill-wrap` and `.log-drink-wrap` backdrops; update doc comments
- [x] Get user approval on the plan (chose to halve both inset AND blur; switched to Code mode)
- [x] [`src/components/daily-panel.ts`](src/components/daily-panel.ts:705) — `.take-pill-wrap .glow-backdrop`: `inset: -18px` -> `-9px`, `border-radius` `+18px` -> `+9px`, `filter: blur(16px)` -> `blur(8px)`; updated Option 6 doc comment + breathing-keyframe comment
- [x] [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts:621) — `.log-drink-wrap .glow-backdrop`: same three property edits; updated Option 6 doc comment + `.chips-row` cross-reference comment
- [x] [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:2913) — `.pane-selector` comment: "18px+16px glow diffusion" -> "9px+8px glow diffusion" (comment-only; opaque background already occludes bleed-through)
- [x] Source grep verification: 0 remaining references to `inset:-18px`, `blur(16px)`, `+18px`, `18px+16px`, `18px .glow-backdrop` in src/
- [x] Rebuild via `yarn run build` — clean, exit 0, 5.3s
- [x] Dist grep verification: `inset: -9px` =2, `filter: blur(8px)` =2, `inset:-18px` =0, `blur(16px)` =0; render-pipeline tokens preserved (`will-change: opacity` ×2, `isolation:isolate` ×7, `glow-backdrop` ×17)
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; demote Gradient Stacking + Alpha Channel Solidification to Previous Context; archive Z-Axis Dependency Fix to `memory-bank/old/activeContext-archive.md`
- [x] Update [`memory-bank/progress.md`](memory-bank/progress.md) — this section. No `projectstructure.md` change. No README change (internal visual-only tweak).

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `src/components/drinks-panel.ts`, `src/ax-dose-logger-card.ts` (comment-only), `dist/ax-dose-logger-card.js` (rebuilt). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change, no README change.

**Key decisions:** (1) halve BOTH `inset` AND `blur` together — halving only one would distort the falloff ratio (hazy ghost if only inset shrinks; sharp edge if only blur shrinks); scaling both preserves the ambilight character at half the spatial extent. (2) halve the `border-radius` extension too (`+18px` -> `+9px`) so the rounded diffusion stays proportional to the smaller backdrop. (3) comments updated alongside CSS — three doc comments referenced the old values; kept them accurate. (4) render pipeline otherwise untouched — `@keyframes`, `will-change`, `isolation:isolate`, z-index routing, and the translucent `--glow-color` tokens all preserved; only the spatial extent of the light emitter changed.

## Color Explainer — On-Time Window Text Update (2026-08-11)

The in-card Medical Color Indicators explainer popup (reached via the device-info dialog) and two visual-editor button-style helper strings still used stale "adherence grace window" terminology from before the On-Time Window — Overdue-Gate Fix + Hours→Minutes Migration (2026-08-11). The README Button State Matrix had already been corrected during that migration; the explainer popup + editor helpers were missed.

- [x] Read backend memory-bank/activeContext.md + translations + frontend localize.ts + README Button State Matrix + helpers.ts grace logic to establish context
- [x] Identify the stale text: Blue row "within the adherence grace window" + Amber row "past the adherence grace window" in the `dialog.color_indicators.explainer` markdown array; same stale term in 2 editor helper strings (`config.helper.take_button_execution_style` + `config.helper.take_button_latency_style`)
- [x] Write architecture plan -> [`plans/color-explainer-on-time-window-update-plan.md`](plans/color-explainer-on-time-window-update-plan.md)
- [x] Get user approval on plan (chose to update rows + add explanatory paragraph; user then extended scope to also fix the 2 editor helpers for full consistency)
- [x] [`src/localize.ts`](src/localize.ts:171) — `dialog.color_indicators.explainer` Blue row: "within the adherence grace window" -> "within the first half of the on-time window"
- [x] [`src/localize.ts`](src/localize.ts:172) — `dialog.color_indicators.explainer` Amber row: "past the adherence grace window" -> "past half the on-time window"
- [x] [`src/localize.ts`](src/localize.ts:177) — `dialog.color_indicators.explainer` added explanatory paragraph after the "fixed colors" line: defines the on-time window, the half-window blue->amber transition, and that it applies to all scheduled meds regardless of the adherence toggle (mirrors the README overdue-boundary paragraph)
- [x] [`src/localize.ts`](src/localize.ts:466) — `config.helper.take_button_execution_style`: "within the adherence grace window" -> "within the first half of the on-time window"
- [x] [`src/localize.ts`](src/localize.ts:468) — `config.helper.take_button_latency_style`: "past the adherence grace window" -> "past half the on-time window"
- [x] Rebuild via `yarn run build` — clean, exit 0, 5.4s
- [x] Dist grep verification: `adherence grace window` =0 (fully purged); `first half of the on-time window` =2 (explainer + execution helper); `past half the on-time window` =2 (explainer + latency helper); `on-time buffer you configured` =1 (new paragraph)
- [x] Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; archive Ambilight Glow Radius Halving + Gradient Stacking Material Synthesis to Previous Context
- [x] Update [`memory-bank/progress.md`](memory-bank/progress.md) — this section

**Scope:** Frontend only. Files: `src/localize.ts`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/color-explainer-on-time-window-update-plan.md` (new). No backend, no types.ts, no editor, no config keys, no migration, no projectstructure.md change, no README change (already correct).

**Key decisions:** (1) terminology alignment with the 2026-08-11 On-Time Window migration — "adherence grace window" was the pre-migration term; the setting is now the "On-Time Window" (minutes, applies to all scheduled meds); the explainer popup + editor helpers are the last places still using the old term. (2) half-window boundary wording — mirrors the README Button State Matrix + helpers.ts resolveButtonState() logic (blue = first half, amber = past half), so the in-card explainer, the README, the editor helper text, and the actual runtime behavior all use the same language. (3) added explanatory paragraph in the popup — concise mirror of the README's overdue-boundary paragraph; defines the on-time window, the half-window transition, and the all-scheduled-meds applicability so the popup is self-contained (a user reading only the popup gets the full picture). (4) editor helpers updated for full consistency — user-extended scope; the two `config.helper.take_button_*_style` strings are shown in the visual editor when configuring button styles, so keeping them on the old term while the explainer + README moved on would be internally inconsistent. (5) no README change — the Button State Matrix was already corrected during the 2026-08-11 migration; this task only catches the in-card popup + editor helpers that were missed.

## Full Button + Icon Style Override Fix (2026-08-11)

**Feature:** Bug fix — "The Full Button style only works when None or Pulse only Icon style is selected." When the user selected Full Button (Style) + Colored or Colored + Pulse (Icon Style), the button did NOT render the full colored background; it rendered the theme-tinted idle look instead. Full Button only looked correct when Icon Style was None or Pulse Only (the two options that do not emit an `icon-{color}` class).

### Checklist
- [x] Step 1: Context grounding — read frontend memory-bank/activeContext.md + projectstructure; traced `_takeButtonClasses()` in [`daily-panel.ts`](src/components/daily-panel.ts:107) + `_logDrinkButtonClasses()` in [`drinks-panel.ts`](src/components/drinks-panel.ts:82); read the `full-{color}` CSS block (daily-panel.ts:590) + the `icon-{color}` background block (daily-panel.ts:608-620, drinks-panel.ts:541-548); confirmed the Icon Style Dropdown Separation plan (`plans/icon-style-dropdown-separation-plan.md`) documents the `full` + Icon Style interaction as "no CSS change needed — inherent to what Full Button means"
- [x] Step 2: Root cause — CSS specificity tie broken by source order. `_takeButtonClasses()` emits BOTH `full-{color}` AND `icon-{color}` when style=full + iconStyle=color/color_pulse. The `.icon-{color}` selector block (daily-panel.ts:611) set `background-color`/`background-image`/`color` with equal specificity (0,2,0) to `.full-{color}` (daily-panel.ts:590) and was declared LATER in source order → won the cascade → erased the Full Button state-color tint and replaced it with the theme-tinted idle look. The `icon-{color}` background block was a leftover from the legacy pre-separation `icon` composite style; after the Icon Style Dropdown Separation, every Style option (full/border/ring/none/glow) already emits its own background rule, making the `icon-{color}` background block always redundant. Its sole remaining job — recoloring the `<ha-icon>` child via `> ha-icon { color }` — was unaffected.
- [x] Step 3: Architecture plan — [`plans/full-button-icon-style-override-fix-plan.md`](plans/full-button-icon-style-override-fix-plan.md) (root cause, redundant-block analysis, fix, 8-combo verification matrix, no-config-migration rationale)
- [x] Step 4: Get user approval (switched to Code mode)
- [x] Step 5: [`src/components/daily-panel.ts`](src/components/daily-panel.ts:599) — deleted the `.take-pill-btn.icon-red, .icon-blue, .icon-amber, .icon-green { background... color... }` block + its `:hover` override + the preceding "Icon-only states still use the theme default bg" comment (13 lines); kept the 4 `.take-pill-btn.icon-{color} > ha-icon { color }` recolor rules; rewrote the section comment to explain why no background declaration belongs on the `.icon-{color}` selector (specificity-tie hazard with `.full-{color}`)
- [x] Step 6: [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts:534) — mirror: deleted the `.log-drink-btn.icon-red, .icon-green { background... color... }` block + its `:hover` override (8 lines); kept the 2 `> ha-icon { color }` recolor rules; rewrote the section comment with the same hazard note
- [x] Step 7: Rebuild via `yarn run build` — clean, exit 0, 5.1s
- [x] Step 8: Dist grep verification — redundant `.icon-{color}` background blocks: 0 occurrences (removed from both panels); `> ha-icon { color }` recolor rules: 2 occurrences (preserved, one per panel)
- [x] Step 9: Update [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; demote Color Explainer — On-Time Window Text Update + Ambilight Glow Radius Halving to Previous Context; archive oldest 1 block (Gradient Stacking — Material Synthesis) to `memory-bank/old/activeContext-archive.md`
- [x] Step 10: Update [`memory-bank/progress.md`](memory-bank/progress.md) — this section; archived oldest 3 sections (Logged Dose Indicator Clarity, ACK Intro State Freeze, Hide "Next: now") to `memory-bank/old/progress-archive.md` to stay near the ~400-line target

**Scope:** Frontend only. Files: `src/components/daily-panel.ts`, `src/components/drinks-panel.ts`, `dist/ax-dose-logger-card.js` (rebuilt), `plans/full-button-icon-style-override-fix-plan.md` (new). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no config keys, no migration, no `projectstructure.md` change, no README change (bug fix making the documented Full Button behavior work).

**Key decisions:** (1) delete the redundant `icon-{color}` background block rather than bumping specificity on `full-{color}` — the `icon-{color}` background is always redundant (every Style option already emits its own background rule), so removing it is the minimal correct fix and also fixes the latent hazard for any future Style option added at the same specificity; (2) keep the `> ha-icon { color }` recolor rules — the Icon Style dropdown's documented purpose is "controlling the icon independently from the Style dropdown," and the child-combinator recolor is the sole job of the `icon-{color}` class; (3) no guard in `_takeButtonClasses()` — the class emission logic is correct; the bug was purely a CSS cascade artifact, so the fix belongs in CSS; (4) no README change — the README already documents Full Button as coloring the button; this fix makes the documented behavior work; (5) no config migration — no config keys, defaults, or class names changed.

---

## Memory Leak & Best-Practices Audit (Round 2) — All 6 Findings Fixed (2026-08-11)

**Feature:** Reviewed the entire `src/` tree for memory leaks, HA guideline violations, and Lit anti-patterns. Cross-referenced the two prior audit plans ([`card-best-practices-audit.md`](plans/card-best-practices-audit.md), [`card-integration-audit.md`](plans/card-integration-audit.md)) against the current source — confirmed 25 of 32 prior findings already fixed. Identified 6 new/remaining findings (N1–N6) and fixed all of them. Architecture plan: [`plans/card-memory-leak-best-practices-audit-2.md`](plans/card-memory-leak-best-practices-audit-2.md).

### Checklist
- [x] Read frontend memory-bank (activeContext, progress, projectstructure) for context
- [x] Read both prior audit plans; cross-referenced every finding against current source
- [x] Reviewed main card file (`ax-dose-logger-card.ts`), editor (`ax-dose-logger-editor.ts`), helpers, types, `delayed-action.ts`, all 7 panel components
- [x] Searched for `delayedAction` usage (28 sites), event listeners, timers, dead localize keys
- [x] Wrote audit plan doc → [`plans/card-memory-leak-best-practices-audit-2.md`](plans/card-memory-leak-best-practices-audit-2.md)
- [x] **N1** — Rewrote [`src/delayed-action.ts`](src/delayed-action.ts) as a Lit `AsyncDirective` (`DelayedActionDirective`): stable wrapper identity (Lit memoizes the directive instance per binding position → no `@click` re-binding on every render), correct `clearTimeout` dedup across re-renders (timer handle lives on the directive instance, not a per-render closure), auto-cleanup via `disconnected()` lifecycle. Fixes the listener-churn + stale-timer double-fire correctness bug on a medical logger.
- [x] **N2** — Scoped [`installEditorGridAlignment()`](src/ax-dose-logger-editor.ts:109) to only inject CSS into `ha-form` elements inside an `ha-dialog` (config editor scope), preventing cross-card pollution of other custom cards' visual editors.
- [x] **N3** — Added `private _connected: boolean` flag to `AxDoseLoggerCard` (set in `connectedCallback`/`disconnectedCallback`); guarded all 5 timer callbacks (`_dailyFreezeTimer`, `_dailyAckTimer`, `_drinksFreezeTimer`, `_drinksAckTimer`, `_graphsRefetchTimer`) with `if (!this._connected) return;` — belt-and-suspenders defense against a queued setTimeout callback mutating `@state` on a detached element.
- [x] **N4** — Verified the 3 dead localize keys (`pane.caffeine`, `caffeine.placeholder`, `config.graph_options`) were already removed in a prior cleanup — no-op.
- [x] **N5** — Merged the two `Object.entries(this.hass.entities)` loops in [`_computeEntities()`](src/ax-dose-logger-card.ts:376) into a single pass (master-tracker + granular-drink detection now runs in the same iteration as suffix-based medicine categorization).
- [x] **N6** — Added `_formStyleRefcount` to [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:86); the observer auto-cleanup now decrements the ref count and only disconnects when it drops to 0, preventing the concurrent-editor race where one dialog closing disconnects the observer while another is still open.
- [x] `yarn run build` — clean (exit 0, 4.8s) after all edits
- [x] Dist grep confirms: `DelayedActionDirective` + `_formStyleRefcount` + `_connected` = 15 matches in dist

### Key decisions
1. **Lit `AsyncDirective` for `delayedAction` (N1)** — the directive approach gives stable wrapper identity (Lit memoizes per binding position) + automatic timer cleanup on disconnect. The prior inline-closure approach created a new closure on every render → listener churn + stale-timer double-fire. The 22 unconditional call sites get the full benefit; the 6 conditional `delayedAction(...) : null` ternary sites still work correctly (each directive instance has its own timer) but may re-bind on branch switches — acceptable for non-clickable boxes where the condition rarely changes.
2. **Scope to `ha-dialog` not card-specific detection (N2)** — HA doesn't expose a reliable DOM signal that a config dialog belongs to a specific card type. Scoping to `ha-dialog` descendants narrows from "all forms in document" to "forms in config dialogs", which is the practical fix; HA opens one config dialog at a time so the dialog present when `getConfigForm()` is called is ours.
3. **`_connected` flag is belt-and-suspenders (N3)** — the existing `clearTimeout` calls in `disconnectedCallback` are the primary guard; the flag handles the microtask-race edge case where a timer callback was already queued before the clear ran.
4. **Single-pass merge preserves behavior (N5)** — the master/granular-drink detection overwrites `result.amountInBody` etc. after the suffix block may have set them, but this is the same overwrite order as the original two-loop design; the merge is behavior-preserving.
5. **No README change** — all fixes are internal (memory leak, performance, defense-in-depth); no user-facing behavior or config change.
6. **No `projectstructure.md` change** — no files added/renamed/deleted; only in-place edits to 3 source files + 1 plan doc.
