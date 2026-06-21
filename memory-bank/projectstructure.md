# Project Structure — AX Dose Logger Card (Frontend)

```
/workspaces/lovelace-pill-logger-card/
├── hacs.json                 # HACS manifest (name: "AX Dose Logger Card", filename: ax-dose-logger-card.js)
├── LICENSE                   # MIT license, copyright 2026 Axildor
├── README.md                 # Card-specific README (installation, configuration, features)
├── package.json              # Project metadata (name: ax-dose-logger-card), scripts (build/watch), dependencies
├── tsconfig.json             # TypeScript config (Node16, experimentalDecorators)
├── rollup.config.js          # Rollup build config (input: src/ax-dose-logger-card.ts, output: dist/ax-dose-logger-card.js)
├── dist/
│   └── ax-dose-logger-card.js   # Compiled output (ES module)
├── src/
│   ├── ax-dose-logger-card.ts   # Main source — card class, getConfigForm() schema, CSS, registrations
│   ├── localize.ts           # Localization helper — localize() function + English translation map
│   ├── components/           # (empty — reserved for future component extraction)
│   ├── helpers/              # (empty — reserved for future helper extraction)
│   └── localize/
│       └── languages/        # (empty — reserved for future localization)
├── docs/
│   ├── custom-card.md        # HA custom card documentation (reference)
│   └── custom-card-feature.md # HA custom card feature documentation (reference)
├── plans/
│   ├── implementation-plan.md    # Initial architecture plan and design decisions
│   ├── editor-fix-plan.md       # getConfigForm() migration plan
│   ├── layout-restructure-plan.md # Daily pane redesign plan
│   ├── ui-refinements-plan.md   # Labels, formatting, stats layout plan
│   ├── config-pane-restructure-plan.md # Chips submenu, color scheme, stats column toggle plan
│   ├── graph-fix-plan.md        # SVG rendering fix + averages grid compaction plan
│   ├── graph-rendering-fix-plan.md # Variable shadowing fix + SVG intrinsic dimensions + preserveAspectRatio
│   ├── bar-label-rethink-plan.md # HTML labels with CSS rotation replacing SVG text labels
│   ├── ui-tweaks-plan.md         # Strength formatting, device dialog, label margin plan
│   ├── refill-button-plan.md     # Refill button + dialog plan
│   ├── pane1-overhaul-plan.md    # Next dose unboxed + refill button moved to stats column plan
│   ├── take-pill-button-restructure-plan.md # Move next dose into take pill button, As Needed detection
│   └── adherence-reset-override-plan.md # Adherence-only reset + mark-last-missed + dedicated Tools panel plan
├── memory-bank/
│   ├── activeContext.md      # Current feature status and recent changes
│   ├── progress.md           # Full history of completed work
│   └── projectstructure.md   # This file — directory tree and file responsibilities
├── .devcontainer/            # Dev container configuration
├── .github/                  # GitHub templates and workflows
├── .vscode/                  # VS Code settings
├── .yarn/                    # Yarn internal files
└── node_modules/             # Dependencies (lit, rollup, typescript, etc.)
```

## File Responsibilities

| File | Responsibility |
|------|---------------|
| [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Complete card implementation: `AxDoseLoggerCard` (LitElement main card), `getConfigForm()` schema with expandable chips panel, color scheme selector, expandable "Graph" options group (`show_amount_in_body`, `show_day_avg_boxes`, `show_adherence_boxes` toggles), stats column toggle, `_getColorOverrides()` helper, `_isAsNeeded()` helper (reads `tracking_type` attribute from next_dose sensor), Take Pill button with 4-line layout (icon, label, Next dose:/Wait:, Last dose:), SVG bar graph (14-day, 320×180 viewBox) and line graph with timeframe chips (48H/7D/14D/30D) and array decimation (MAX_NODES=800), dynamic time labels (hours for 48H, days for 7D/14D/30D), `_fetchAmountHistory()` with dynamic timeframe and decimation, `_getTimeframeHours()` helper, `_handleTimeframeChange()` action, `connectedCallback()` lifecycle with rebuild-flag disambiguation (restores pane on ll-rebuild, resets to defaults on genuine view entry), `updated()` lifecycle with split guards for pane switch vs timeframe change, compact flex-row averages grid (`_renderAveragesGrid()` gates Day Avg + Adherence boxes behind `show_day_avg_boxes`/`show_adherence_boxes` config flags; progressive reveal driven by `days_since_first_dose` sensor — 7/14/30 boxes hide until their window elapses, Year/365d slot relabels to running `${daysSince}-Day Avg`/`${daysSince}d Adh` until 365 days then `Year Avg`/`365d Adh`; falls back to showing all boxes when sensor absent), "Days Since First Dose" row in Stats pane, refill dialog with number input, device info dialog, 4th "Tools" panel (`_renderPane4()`) with two section headers (Adherence Tools / General Tools) and 2-column grid of maintenance buttons (Reset Adherence %, Mark Last Missed Taken, Reset History, Undo Dose) each with a shared confirmation popup (`_renderToolsDialog()` + `_toolsDialog` state), 5th "Metrics" panel (`_renderPane5()`) with daily-locked ha-slider per effectiveness metric (badge showing Set/Not set status, override dialog via `ax_dose_logger.set_metric` service with `override: true`), compact wrench-icon-only tab in pane selector, all CSS styles, `customElements.define('ax-dose-logger-card', AxDoseLoggerCard)` call, `window.customCards` registration (name: "AX Dose Logger Card", documentationURL: `https://github.com/Axildor/AX-Dose-Logger-Card`). HTTP endpoint: `ax_dose_logger/history/{deviceId}`. Device picker filter: `integration: 'ax_dose_logger'`. |
| [`src/localize.ts`](src/localize.ts) | Lightweight localization helper: `localize(lang, key, params?)` function with a static English translation map (~100 strings including metrics pane strings). Supports `{param}` interpolation for dynamic strings. Falls back to English, then to the key itself. Adding a new language is just adding a key to the `translations` object. |
| [`package.json`](package.json) | NPM package metadata (name: `ax-dose-logger-card`), `build` and `watch` scripts, dependency declarations |
| [`tsconfig.json`](tsconfig.json) | TypeScript compiler configuration |
| [`rollup.config.js`](rollup.config.js) | Rollup bundler configuration (input: `src/ax-dose-logger-card.ts`, output: `dist/ax-dose-logger-card.js`) |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Compiled output — loaded by Home Assistant as a dashboard resource |
| [`hacs.json`](hacs.json) | HACS manifest — name: "AX Dose Logger Card", filename: "ax-dose-logger-card.js" |
| [`plans/pane1-overhaul-plan.md`](plans/pane1-overhaul-plan.md) | Architecture plan for Pane 1 overhaul: next dose unboxed (plain centered text, smaller non-bold, icon matches text color) and refill button moved from next-dose row into stats column replacing Pills left stat-pill |
