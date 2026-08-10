# Plan — Medical Color Indicators Explainer Popup + Toggle

## Goal

Provide an easily-accessible but out-of-the-way explainer of the medical
button-state indicator colors. Reuse the established ha-dialog + ha-markdown
popup pattern (same as the Sleep Disruption popup). Surface the trigger as a
secondary button inside the device-info dialog (opened by pressing the drug
title), gated by a top-level config toggle defaulting ON so the button
disappears entirely once the user has learned the colors.

## Decisions

1. **Reuse the ha-dialog + ha-markdown popup pattern** —
   [`_renderSleepDisruptionDialog()`](src/ax-dose-logger-card.ts:1905) is the
   established, HA-idiomatic way to show a rich explainer in a popup. Markdown
   content lives in `localize.ts` as a joined multi-line string. Reusing this
   pattern keeps the implementation consistent and version-stable (no DOM
   injection).
2. **Trigger lives in the device-info dialog, not the editor** — the device-info
   dialog is opened by pressing the drug title, the natural "tell me about this
   med" surface. Keeping the trigger out of the editor preserves the editor's
   compact layout (the long helper was the problem last round).
3. **Config toggle defaults ON** — `show_color_indicator_explainer: boolean`,
   default `true`, so new users see the button until they turn it off. When
   OFF, the button in the device-info dialog is hidden entirely (the popup
   itself is still reachable programmatically, but there's no visible trigger).
4. **Markdown content mirrors the README subsection** — the indicator-color
   table + interference note already documented in the README "⚠️ Color Scheme
   and Indicator Conflicts" subsection becomes the popup's `ha-markdown`
   content. Single conceptual source (the README stays the canonical doc; the
   popup reuses the same facts for in-card convenience).

## Implementation Steps

### Step 1 — New config field + editor toggle
- **[`src/types.ts`](src/types.ts)** — add `show_color_indicator_explainer?: boolean;`
  to `AxDoseLoggerCardConfig` (near the other top-level booleans like
  `hide_nav_bar`).
- **[`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts)** — add a
  boolean schema node `show_color_indicator_explainer` (default true) in the
  top-level settings area (the Default View | Hide Navigation Bar row, or its
  own slot near `hide_nav_bar`). Pair with a `config.helper.*` key.
- **[`src/localize.ts`](src/localize.ts)** — add `config.show_color_indicator_explainer`
  label + `config.helper.show_color_indicator_explainer` helper ("Show a
  Medical Color Indicators button in the device-info popup. On by default;
  turn off once you've learned the colors.").

### Step 2 — Container state + controller method
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** —
  - `@state() private _showColorExplainerDialog: boolean = false;` (near the
    other dialog flags ~line 53-86).
  - `public showColorExplainerDialog(): void { this._showColorExplainerDialog = true; }`
    (near the other `showXxxDialog` accessors ~line 1082-1141).
  - Add `_showColorExplainerDialog` to the `updated()` reactive-property list
    (~line 2387-2406) so opening/closing triggers a render.
  - Reset `_showColorExplainerDialog = false;` in the disconnect cleanup block
    (~line 2286-2307) alongside the other dialog resets.
  - Add `showColorExplainerDialog(): void;` to the `CardController` interface in
    **[`src/types.ts`](src/types.ts)** (~line 454-462, near `showDeviceInfo`).

### Step 3 — Explainer popup renderer
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)** — new
  `_renderColorExplainerDialog()` method (mirror the Sleep Disruption dialog's
  `ha-dialog` + `<ha-markdown .content>` + close-button structure). Content
  from a new `localize.ts` key `dialog.color_indicators.explainer` (markdown
  table of the 4 indicators + interference note + starred-color convention).
  Title: `dialog.color_indicators.title` ("Medical Color Indicators").

### Step 4 — Device-info dialog trigger button
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1305)** —
  `_renderDeviceInfoDialog()`: when
  `this.config?.show_color_indicator_explainer !== false`, render a second
  `.dialog-btn` below the existing "To Device info" button that calls
  `this.showColorExplainerDialog()` then closes the device-info dialog. Label
  from a new `dialog.device_info.color_indicators` key
  ("Medical Color Indicators"), icon `mdi:palette` or `mdi:palette-outline`.

### Step 5 — Render call + lifecycle
- **[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:2243)** — add
  `${this._showColorExplainerDialog ? this._renderColorExplainerDialog() : nothing}`
  next to the other dialog renders.

### Step 6 — Build + verify
- `yarn run build` must exit 0.
- Dist grep confirms: the new config key, the explainer markdown, the
  device-info button label, and `showColorExplainerDialog` all compiled in.

### Step 7 — Memory bank update (Frontend)
- activeContext.md — new Current Status block; archive the prior.
- progress.md — append a new feature section with the step checklist.
- No projectstructure.md change (no new files; responsibilities unchanged).
- README — optional one-line note that the in-card popup mirrors this section.

## Risk / Notes

- **Default ON preserves discoverability** for new users while keeping the
  trigger in the infrequently-opened device-info dialog (no editor clutter).
- **No DOM injection / no markdown-in-helper** — the popup uses the proven
  ha-dialog + ha-markdown pattern; the editor helper stays plain text.
- **No backend change** — purely frontend dialog + config field.
- **No migration** — new optional boolean with a documented default; existing
  configs without the field render as today (default ON → button visible).