# Plan — Panel Reactive Prop Fix (no visual update until pane reload)

## Symptom
After the presentational/container refactoring, no pane updates visually until the
user switches to a different pane and back. Examples:
- Click "Take Pill" → nothing changes; switch pane away+back → change visible.
- Click a graph carousel arrow / timeframe chip → graph doesn't update until pane reload.
- 14-day-average line graph doesn't load on first entry; only after a pane round-trip.

## Root Cause
The refactoring split each pane into a child `LitElement`
(`ax-dose-daily-panel`, `ax-dose-graphs-panel`, `ax-dose-stats-panel`,
`ax-dose-caffeine-panel`, `ax-dose-tools-panel`, `ax-dose-tracking-panel`).
Each panel declares exactly **two** reactive `@property` inputs:

```ts
@property({ attribute: false }) controller!: CardController;  // the card instance — reference NEVER changes
@property({ attribute: false }) entities!: ResolvedEntities;   // cached in _resolveEntities() — reference stable across state ticks
```

The container passes them as:

```ts
<ax-dose-daily-panel .controller=${this} .entities=${entities}></ax-dose-daily-panel>
```

- `this` (the card) is a single object whose reference is invariant for the
  card's lifetime → Lit never records a `controller` property change.
- `entities` comes from `_resolveEntities()`, which memoizes on
  `device_id` + `hass.entities` registry reference. The registry ref only
  changes when entities are added/removed — **not** on a normal sensor state
  update. So `entities` reference is also stable across state ticks.

Because neither reactive input changes reference, **the child panels never
re-render** between mount and unmount. They are only re-rendered when the
container's render ternary toggles them out and back in:

```ts
${this._activePane === 'daily' ? html`<ax-dose-daily-panel ...>` : nothing}
```

That is precisely the reported behavior: changes appear only after switching
to a different pane and back (which remounts the element).

The container's own `shouldUpdate` (ax-dose-logger-card.ts:1175) is correct —
it re-renders the container on relevant state changes. But the container's
render only re-evaluates the ternaries; it passes the **same** `.controller`
and `.entities` references to the children, so the children stay frozen.

The graph panel has an additional, related fault: it reads container-local
`@state` (`_amountHistory`, `_doseHistory`, `_activeGraph`,
`_activeTimeframe`, `_activeBarTimeframe`) via `c.amountHistory` etc., but
because `c` (the controller) reference never changes, those reads never
trigger a graph-panel re-render either — including the timeframe-chip clicks
and carousel nav.

## Fix
Make the data the panels actually depend on flow through **reactive** inputs
so Lit detects changes and re-renders the panels.

### 1. Pass `hass` as a reactive prop to every panel
HA replaces the top-level `hass` object reference on every state update. The
container's `shouldUpdate` already gates container re-renders to relevant
entity changes, so when the container re-renders it will pass a **new** `hass`
reference down. Adding `hass` as a `@property` on each panel makes the panel
re-render at the same moment.

This is the canonical HA card pattern: pass `hass` down to child components.

### 2. Pass the graph-panel's container-local state as reactive props
The graphs panel reads container `@state` via the controller getters
(`c.amountHistory`, `c.doseHistory`, `c.activeGraph`, `c.activeTimeframe`,
`c.activeBarTimeframe`). Promote these to reactive `@property` inputs on the
graphs panel and bind them in the container render. This makes timeframe-chip
clicks, carousel nav, and async history fetch completion all re-render the
graph panel immediately.

The other panels (daily, stats, caffeine, tools, tracking) only read state
through `c.getState(...)` / `c.getAttr(...)`, which dereference `this.hass`
internally — so giving them `hass` is sufficient. They don't read container
`@state` directly.

## Files to Edit

### `src/ax-dose-logger-card.ts` (container)
- In `render()` (line ~1080), add `.hass=${this.hass}` to every panel binding.
- For the graphs panel, also bind `.amountHistory=${this._amountHistory}`,
  `.doseHistory=${this._doseHistory}`, `.activeGraph=${this._activeGraph}`,
  `.activeTimeframe=${this._activeTimeframe}`,
  `.activeBarTimeframe=${this._activeBarTimeframe}`.

### `src/components/daily-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Import `AxDoseLoggerHass` type.
- (Optional) Replace `c.hass?.states[...]` reads with `this.hass?.states[...]`
  for consistency; the controller `getState`/`getAttr` already read container
  `this.hass`, so the `hass` prop primarily exists to drive reactivity.

### `src/components/stats-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Import `AxDoseLoggerHass` type.

### `src/components/caffeine-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Import `AxDoseLoggerHass` type. (Static placeholder pane, but kept consistent.)

### `src/components/tools-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Import `AxDoseLoggerHass` type.

### `src/components/tracking-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Import `AxDoseLoggerHass` type.

### `src/components/graphs-panel.ts`
- Add `@property({ attribute: false }) hass?: AxDoseLoggerHass;`
- Add reactive props:
  - `@property({ attribute: false }) amountHistory: Array<{timestamp: string; value: number}> = [];`
  - `@property({ attribute: false }) doseHistory: Array<[string, number]> = [];`
  - `@property({ type: Number }) activeGraph = 0;`
  - `@property({ attribute: false }) activeTimeframe = '48h';`
  - `@property({ attribute: false }) activeBarTimeframe = '14d';`
- Replace the controller-getter reads (`c.amountHistory`, `c.activeGraph`,
  `this.controller.activeTimeframe`, etc.) with the local reactive props.
- Keep the controller action callbacks (`c.handleTimeframeChange`,
  `c.setActiveGraph`, `c.handleBarTimeframeChange`) — they mutate container
  state, which re-renders the container, which re-binds the new prop values
  into the panel.
- Import `AxDoseLoggerHass` type.

### `src/types.ts` (CardController interface)
- The controller getters (`amountHistory`, `doseHistory`, `activeGraph`,
  `activeTimeframe`, `activeBarTimeframe`) can stay — they're harmless and
  used only by the container now. No interface change strictly required.
  Optionally mark them deprecated in a comment. No change needed for `hass`
  since it's already on the interface.

## Why this is correct and minimal
- It uses Lit's standard reactivity model instead of manual `requestUpdate()`
  hacks (the codebase explicitly notes at line 642 that manual requestUpdate
  is not needed and Lit auto-renders on @state mutation — the regression was
  that this auto-render only reached the container, not the children).
- The container's `shouldUpdate` remains the single gate for *whether* the
  card re-renders at all; the new `hass` prop just ensures that when it does,
  the active panel also re-renders.
- No backend changes. No behavior changes. Purely re-establishing the data
  flow that the refactoring accidentally severed.

## Verification
- `yarn run build` — clean compile, no warnings.
- Manual: take a pill → daily pane updates immediately; click graph carousel
  → graph switches immediately; click timeframe chip → graph + averages
  refresh immediately; 14-day average line graph loads on first graphs-pane
  entry without a pane round-trip.