# Architecture Plan — Daily Tab Top Box: Amount in Body Toggle + Submenu Rename

**Repo:** Frontend (`/workspaces/lovelace-pill-logger-card/`)
**Date:** 2026-08-08
**Scope:** Frontend-only (no backend / coordinator / sensor / config-flow changes).

## 1. Goal

The Daily tab's **top stat-pill box** (currently hardcoded to the Safe to Take sensor) should gain a toggle that switches its displayed entity to the **Amount in Body** sensor. Safe to Take remains the default (toggle OFF) so existing configs are unchanged and strength-only meds (whose `amount_in_body` sensor renders `unknown`) keep a populated box by default. The two box submenus in the Daily Tab editor expandable rename from "Safe to Take Box" / "Pills Left Box" to **"Top Box"** / **"Bottom Box"** so the submenu names stay truthful regardless of which sensor the box renders.

This mirrors the existing [`pills_left_show_days_left`](src/ax-dose-logger-editor.ts:299) toggle in the Bottom Box submenu (the precedent pattern) and applies the same "built-in mode-swap wins over an arbitrary entity swap" priority rule already used by [`_getPillsLeftBoxEntity`](src/ax-dose-logger-card.ts:1360) and [`_getDisruptionBoxEntity`](src/ax-dose-logger-card.ts:1427).

## 2. Confirmed Design Direction (user-approved)

1. **Default = Safe to Take** (toggle OFF). Existing configs render unchanged; no migration.
2. **Toggle ON = Amount in Body.** The user opts in; a strength-only med showing N/A on the box is then expected (they chose it), avoiding a silent dynamic fallback that would mismatch the editor's promise.
3. **No dynamic default.** The card will NOT silently pick a default based on whether the `amount_in_body` sensor has a usable state — that would make the toggle lie. A predictable default + explicit opt-in is preferred (user-confirmed).
4. **Submenus rename to "Top Box" / "Bottom Box."** Box-identity-agnostic so the submenu name never contradicts the rendered sensor.
5. **Toggle lives in the Top Box submenu**, mirroring how [`pills_left_show_days_left`](src/ax-dose-logger-editor.ts:299) lives in the Bottom Box submenu.
6. **LIMIT REACHED safety read preserved.** The Take Pill button's limit logic ([`safeState`](src/components/daily-panel.ts:40)) already reads the REAL [`e.pillsSafeToTake`](src/components/daily-panel.ts:40) sensor directly — NOT the top box's display entity — so swapping the top box display never affects the safety gating. This invariant stays untouched.

## 3. Current State (verified by reading source)

### 3.1 Daily panel render — top box
[`src/components/daily-panel.ts`](src/components/daily-panel.ts:94):
- `displayEntity = c.getSafeBoxEntity(e)` (line 95) → resolves to `safe_to_take_entity` override OR `entities.pillsSafeToTake` (default).
- `displayState`, `displayIsUnknown`, `isSwapped` flags (lines 96–98).
- Action config + click/hold/double-tap handlers (lines 105–114).
- Box template (lines 143–162): icon `mdi:shield-check`, label `daily.safe_to_take` ("Safe to take"), value formatted as `formatInteger(safeState)` (default) or swapped-entity formatted value.

### 3.2 Container resolver — `_getSafeBoxEntity`
[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1296):
```ts
private _getSafeBoxEntity(entities: ResolvedEntities): string | undefined {
  return this.config?.safe_to_take_entity || entities.pillsSafeToTake;
}
```
No toggle awareness today.

### 3.3 Editor schema — Top Box submenu
[`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:244) (expandable `safe_to_take_box`, title "Safe to Take Box"):
- `safe_to_take_entity` (entity picker, filter_device_id)
- grid: `safe_to_take_icon` + `safe_to_take_label`
- `safe_to_take_tap_action` / `_hold_action` / `_double_tap_action`
- **No toggle** today.

### 3.4 Editor schema — Bottom Box submenu (the precedent)
[`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:293) (expandable `pills_left_box`, title "Pills Left Box"):
- `pills_left_show_days_left` (boolean toggle) — **first field**, mirrors the pattern we'll replicate.
- `pills_left_entity`, grid icon/label, 3 actions.

### 3.5 Localize strings
[`src/localize.ts`](src/localize.ts:192):
- `config.safe_to_take_box`: 'Safe to Take Box' (used as expandable `title` — NOT via computeLabel, since expandable containers return '' from computeLabel/computeHelper per lines 984/1030).
- `config.pills_left_box`: 'Pills Left Box' (same — expandable title).
- `daily.safe_to_take`: 'Safe to take' (box default label).
- `stats.amount_in_body`: 'Amount in Body' (reusable as the toggle-ON default label).
- `drinks.in_body`: 'In Body' (Drinks panel — not reused here; Daily uses the fuller "Amount in Body" phrasing).
- Helpers: `config.helper.safe_to_take_box` etc. exist.

### 3.6 Entity availability
[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:257): `entities.amountInBody` is resolved for medicine devices via suffix `_amount_in_body`. For master trackers it's resolved via the `pk_model` attribute check (line 338). Strength-only meds have the sensor entity present but its state is `unknown` — hence the "no dynamic default" decision (§2.3).

## 4. Implementation Plan

### 4.1 New config field
**File:** [`src/types.ts`](src/types.ts:80) — add to `AxDoseLoggerCardConfig`:
```ts
/** When true, the Daily tab's top stat-pill box shows the Amount in Body
 *  sensor instead of the Safe to Take sensor. Default OFF (Safe to Take).
 *  Mirrors pills_left_show_days_left. Configured via the "Top Box" expandable
 *  in the visual editor. The Take Pill button's LIMIT REACHED logic always
 *  reads the real pillsSafeToTake sensor, so this swap is purely cosmetic. */
safe_to_take_show_amount_in_body?: boolean;
```
Field name chosen to keep the `safe_to_take_*` prefix grouping (the box's config family) and parallel `pills_left_show_days_left`. Kept optional + negative-presence test (=== true) so existing configs are unchanged.

### 4.2 Container resolver — `_getSafeBoxEntity`
**File:** [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1296) — extend with toggle priority:
```ts
private _getSafeBoxEntity(entities: ResolvedEntities): string | undefined {
  // Built-in mode-swap wins over an arbitrary entity swap so the two
  // overrides are mutually unambiguous (mirrors _getPillsLeftBoxEntity).
  if (this.config?.safe_to_take_show_amount_in_body === true) {
    return entities.amountInBody || entities.pillsSafeToTake;
  }
  return this.config?.safe_to_take_entity || entities.pillsSafeToTake;
}
```
- Toggle ON → `entities.amountInBody` when present, else fall back to `entities.pillsSafeToTake` (per user direction: "Always fall back to the pillsSafeToTake sensor when the toggle is OFF or amountInBody is absent" — keeps the box non-empty even on a device whose amountInBody sensor entity failed to resolve).
- Toggle OFF → unchanged (override entity, else default sensor).
- The fallback-when-absent is at the resolver level (not a silent dynamic default in the panel), so the toggle still truthfully says "Amount in Body" — the only fall-back case is a structurally missing sensor entity, which is a device-config issue not a state-quality issue. (If the user prefers the box show N/A when the sensor exists but reads `unknown`, the panel's existing `displayIsUnknown` branch already handles that — no resolver change needed.)

### 4.3 Daily panel — top box render
**File:** [`src/components/daily-panel.ts`](src/components/daily-panel.ts:94) — add toggle-aware default label/icon and keep the existing swapped-entity value formatting:

```ts
// Top box mode: toggle ON → Amount in Body, else Safe to Take (default).
const topShowAmountInBody = c.config?.safe_to_take_show_amount_in_body === true;
const displayEntity = c.getSafeBoxEntity(e);
const displayState = c.getState(displayEntity);
const displayIsUnknown = displayState === 'unknown' || displayState === 'unavailable' || displayState === undefined;
const isSwapped = !!(c.config?.safe_to_take_entity && c.config.safe_to_take_entity !== e.pillsSafeToTake);
// Default label/icon switch to the Amount in Body variants when the toggle is on
// (mirrors the pillsLeftDefaultLabel/Icon pattern at lines 89–92).
const topDefaultLabel = topShowAmountInBody
  ? localize(this._lang, 'stats.amount_in_body')
  : localize(this._lang, 'daily.safe_to_take');
const topDefaultIcon = topShowAmountInBody ? 'mdi:chart-bell-curve' : 'mdi:shield-check';
```
Then in the box template (lines 151–152):
```ts
<ha-icon icon="${c.config?.safe_to_take_icon || topDefaultIcon}"></ha-icon>
<span class="stat-label">${c.config?.safe_to_take_label || topDefaultLabel}</span>
```
And the value branch (lines 153–161): the existing `isSwapped` branch already handles arbitrary entity swaps (numeric → formatInteger + unit, non-numeric → title-case). For the toggle-ON default-amountInBody case we want the same formatting the Drinks panel's In Body box uses ([`drinks-panel.ts`](src/components/drinks-panel.ts:75): `Math.round(num) + ' ' + strengthUnit`). Add an explicit branch:
```ts
${displayIsUnknown
  ? localize(this._lang, 'daily.na')
  : (topShowAmountInBody && !isSwapped
    ? (() => {
        const aibNum = parseFloat(displayState);
        const unit = c.getStrengthUnit(e);
        return isNaN(aibNum) ? displayState : `${Math.round(aibNum)}${unit ? ' ' + unit : ''}`;
      })()
    : (isSwapped
      ? (displayState
        ? (isNaN(parseFloat(displayState))
          ? displayState.charAt(0).toUpperCase() + displayState.slice(1)
          : c.formatInteger(displayState) + (c.getAttr(displayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(displayEntity, 'unit_of_measurement') : ''))
        : '')
      : c.formatInteger(safeState)))}
```
- Toggle ON + no entity swap → Amount in Body value formatted `Math.round(num) + strengthUnit` (mirrors Drinks In Body box at line 81).
- Toggle ON + user also set `safe_to_take_entity` → the toggle wins (built-in mode-swap priority, per §4.2), so `isSwapped` is effectively overridden by the resolver returning `amountInBody`. The `topShowAmountInBody && !isSwapped` branch handles this; `isSwapped` is only true when the toggle is OFF and an entity override is set.

### 4.4 Editor schema — Top Box submenu rename + toggle
**File:** [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:244):
1. Change the expandable `title` from `'Safe to Take Box'` → `'Top Box'` (line 246). (Title is a literal string, not a localize key — matches the existing literal titles.)
2. Add the toggle as the **first** field in the schema array (mirroring [`pills_left_show_days_left`](src/ax-dose-logger-editor.ts:299) being first in the Bottom Box submenu):
```ts
{
  name: 'safe_to_take_show_amount_in_body',
  selector: { boolean: {} },
},
```
Placed before `safe_to_take_entity`.

### 4.5 Editor schema — Bottom Box submenu rename
**File:** [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:295):
- Change `title: 'Pills Left Box'` → `title: 'Bottom Box'` (line 295).

### 4.6 Localize strings
**File:** [`src/localize.ts`](src/localize.ts:192):
1. Update the two existing box-title localize keys (kept for documentation/parity even though the editor uses literal `title` strings; if any future code path reads them they should be correct):
   - `config.safe_to_take_box`: 'Safe to Take Box' → 'Top Box'
   - `config.pills_left_box`: 'Pills Left Box' → 'Bottom Box'
2. Add the new toggle label + helper:
   - `config.safe_to_take_show_amount_in_body`: 'Amount in body instead of Safe to take' (mirrors `config.pills_left_show_days_left`: 'Days left instead of Pills left')
   - `config.helper.safe_to_take_show_amount_in_body`: 'Show the Amount in Body sensor instead of Safe to take. The Take Pill limit check still uses the real Safe to Take sensor.' (mirrors `config.helper.pills_left_show_days_left` + notes the safety invariant)
3. Update the box-level helpers to reflect the new agnostic naming:
   - `config.helper.safe_to_take_box`: 'Replace the box with any entity, or switch to the Amount in Body sensor. Leave empty for the default Safe to Take sensor.' (mirrors `config.helper.pills_left_box`: 'Replace the box with any entity, or switch to the Days left sensor. Leave empty for the default sensor.')
   - `config.helper.safe_to_take_label`: 'Custom label. Defaults to "Safe to take" or "Amount in Body" depending on the toggle.'
   - `config.helper.safe_to_take_icon`: 'Icon on the box. Defaults to mdi:shield-check or mdi:chart-bell-curve depending on the toggle.'

### 4.7 README
**File:** [`README.md`](README.md) — update the Daily Tab section's box description + the configuration options table:
- Note the top box can show Safe to Take (default) or Amount in Body (toggle on).
- Add the `safe_to_take_show_amount_in_body` row to the config options table.
- Rename "Safe to Take Box" / "Pills Left Box" submenu references to "Top Box" / "Bottom Box" in the editor walkthrough.

## 5. Files Modified

| File | Change |
|------|--------|
| [`src/types.ts`](src/types.ts) | Add `safe_to_take_show_amount_in_body?: boolean` to `AxDoseLoggerCardConfig` |
| [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) | Extend `_getSafeBoxEntity` with toggle priority + fallback |
| [`src/components/daily-panel.ts`](src/components/daily-panel.ts) | Toggle-aware default label/icon + Amount-in-Body value formatting branch |
| [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) | Rename 2 expandable titles; add toggle as first field in Top Box submenu |
| [`src/localize.ts`](src/localize.ts) | Rename 2 box-title keys; add toggle label + helper; update 3 box helpers |
| [`README.md`](README.md) | Daily Tab box description + config options table row + submenu names |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Rebuilt via `yarn run build` |

No backend / coordinator / store / config-flow / sensor changes. No `projectstructure.md` change (no files added/renamed/deleted).

## 6. Key Design Decisions

1. **Safe to Take stays the default (toggle OFF)** — preserves existing configs with zero migration; strength-only meds keep a populated box; avoids the silent-fallback/toggle-mismatch problem the user identified. The toggle is an explicit opt-in to Amount in Body.
2. **No dynamic default** — the card does not silently pick a sensor based on state quality. A predictable default + explicit opt-in keeps the editor's promise and the rendered box in sync (user-confirmed principle).
3. **Resolver-level fallback when `amountInBody` entity is structurally absent** — `entities.amountInBody || entities.pillsSafeToTake`. If the sensor entity exists but reads `unknown` (strength-only med), the panel's existing `displayIsUnknown` branch shows N/A (the user opted in, so N/A is expected). This is distinct from a state-quality-driven dynamic default, which we reject.
4. **Built-in mode-swap wins over entity swap** — mirrors [`_getPillsLeftBoxEntity`](src/ax-dose-logger-card.ts:1360) + [`_getDisruptionBoxEntity`](src/ax-dose-logger-card.ts:1427). When the toggle is ON, a configured `safe_to_take_entity` is overridden (the toggle is the first-class built-in swap). When OFF, `safe_to_take_entity` works as before. The two overrides are mutually unambiguous.
5. **LIMIT REACHED safety read preserved** — the Take Pill button's [`safeState`](src/components/daily-panel.ts:40) already reads the real `e.pillsSafeToTake` sensor directly (line 40), NOT the top box's display entity. Swapping the top box is purely cosmetic. No change to this path.
6. **Submenus renamed to "Top Box" / "Bottom Box"** — box-identity-agnostic so the submenu name never contradicts the rendered sensor (a box titled "Safe to Take Box" but showing Amount in Body would be a lie). "Top"/"Bottom" reflect physical position, which is stable regardless of sensor.
7. **Toggle field name `safe_to_take_show_amount_in_body`** — keeps the `safe_to_take_*` config-family prefix (the box's editor family) and parallels `pills_left_show_days_left`. The `_show_` infix matches the existing convention.
8. **Default icon `mdi:chart-bell-curve` for Amount in Body** — mirrors the Drinks panel In Body box default ([`drinks-panel.ts`](src/components/drinks-panel.ts:194)); `mdi:shield-check` stays the Safe to Take default.
9. **Value formatting mirrors the Drinks In Body box** — `Math.round(num) + ' ' + strengthUnit` (via [`c.getStrengthUnit(e)`](src/components/drinks-panel.ts:73)); the swapped-entity branch keeps the existing numeric/title-case convention. Consistent with the Drinks panel's established Amount-in-Body rendering.
10. **Editor `title` is a literal string, not a localize key** — matches the existing pattern (the `safe_to_take_box` / `pills_left_box` expandables set `title` directly). The localize keys are updated for documentation/parity but are not read by the expandable headers (computeLabel returns '' for expandables per line 984).

## 7. Verification

1. `yarn run build` — clean (exit 0, no warnings).
2. Dist grep: confirm the new toggle field name, the renamed titles ("Top Box" / "Bottom Box"), and the `stats.amount_in_body` default-label branch are present in `dist/ax-dose-logger-card.js`.
3. Manual editor check (if possible): open a medicine card's visual editor → Daily Tab → Top Box submenu shows the toggle first + "Top Box" header; Bottom Box submenu shows "Bottom Box" header. Toggle ON → Daily tab top box shows the Amount in Body value + "Amount in Body" label + `mdi:chart-bell-curve` icon; Take Pill button's LIMIT REACHED logic still reads the real Safe to Take sensor.
4. No backend verification needed (frontend-only change).

## 8. Memory Bank Updates (post-verification)

- `memory-bank/activeContext.md` — new Current Status; archive previous under Previous Context.
- `memory-bank/progress.md` — new section at the bottom.
- `README.md` — updated per §4.7.
- No `memory-bank/projectstructure.md` change.