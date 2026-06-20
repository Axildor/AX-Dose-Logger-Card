# Plan — Hide Navigation Bar Toggle

## Goal
Add a card-configurator toggle (`hide_nav_bar`) that hides the bottom pane-selector navigation bar (Daily / Graphs / Stats / Tools). Intended for dashboards that only need the Daily pane and don't require the advanced options.

## Background
- The bottom nav bar is rendered by [`_renderPaneSelector()`](src/pill-logger-card.ts:1388) and unconditionally included in [`render()`](src/pill-logger-card.ts:1446).
- Config schema lives in [`getConfigForm()`](src/pill-logger-card.ts:1633); existing boolean toggles (`big_text`, `stats_3_columns`, `show_amount_in_body`, etc.) follow a consistent pattern.
- Localization strings live in [`src/localize.ts`](src/localize.ts:116) under `config.*` and `config.helper.*`.

## Design Decisions
1. **Default = shown** — `hide_nav_bar` defaults to `false` (undefined → shown). Existing dashboards are unaffected. Uses the same `!== true` opt-in pattern as `show_amount_in_body !== false` opt-out, but inverted because hiding is the opt-in direction.
2. **Hide the whole bar, not individual panes** — when hidden, the card stays on the Daily pane (the `connectedCallback` already resets `_activePane = 'daily'`). Users who hide the bar are explicitly opting into a Daily-only experience. No need to expose pane-switching via another mechanism.
3. **No stub-config change** — `getStubConfig()` only seeds `device_id` and `show_amount_in_body`. New optional toggle does not need a stub value; undefined → bar shown.
4. **Placement in schema** — add as a top-level toggle after `stats_3_columns` (the last existing top-level boolean). Keeps the simple toggles grouped; the expandable "Custom Chips" and "Graph" groups stay nested.

## Changes

### [`src/pill-logger-card.ts`](src/pill-logger-card.ts)
1. **Config interface** (~line 26) — add `hide_nav_bar?: boolean;` to `PillLoggerCardConfig`.
2. **`render()`** (~line 1446) — gate the pane selector:
   ```ts
   ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector() : nothing}
   ```
3. **`getConfigForm()`** (~line 1755, after `stats_3_columns`) — add:
   ```ts
   {
     name: 'hide_nav_bar',
     selector: { boolean: {} },
   },
   ```

### [`src/localize.ts`](src/localize.ts)
- Add `'config.hide_nav_bar': 'Hide Navigation Bar'` (after `config.stats_3_columns`, ~line 120).
- Add `'config.helper.hide_nav_bar': 'Hide the bottom Daily/Graphs/Stats/Tools navigation bar. Use for dashboards that only need the Daily pane.'` (after `config.helper.stats_3_columns`, ~line 132).

### [`README.md`](README.md)
- Add a one-line mention in the Configuration section: a "Hide Navigation Bar" toggle for Daily-only dashboards.

### Build & Memory Bank
- `yarn run build` → verify clean compilation, rebuild [`dist/pill-logger-card.js`](dist/pill-logger-card.js).
- Update `memory-bank/activeContext.md`, `memory-bank/progress.md`, `memory-bank/projectstructure.md` per repo conventions.

## Verification
- `yarn run build` completes with no TypeScript errors.
- Manual: toggle on → bar disappears, card shows Daily pane only; toggle off → bar returns.

## Mermaid — Render flow with toggle

```mermaid
flowchart TD
  A[render] --> B{hide_nav_bar === true?}
  B -- yes --> C[Render active pane only, no selector]
  B -- no --> D[Render active pane + _renderPaneSelector]
  C --> E[ha-card]
  D --> E