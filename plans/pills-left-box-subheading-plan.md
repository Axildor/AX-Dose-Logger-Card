# Plan — Pills Left Box Subheading (Full Override Parity with Safe to Take Box)

## Goal

Move `pills_left_icon` + `pills_left_label` out of the flat Daily Panel grid and into their own
**"Pills Left Box"** expandable subheading inside the Daily Panel, mirroring the existing
**"Safe to Take Box"** expandable. Provide:

1. **"Days left instead of Pills left"** toggle (built-in swap to the backend Days Left sensor)
2. **Entity replacement** (`pills_left_entity`) — show any HA entity in the box
3. **Icon** (`pills_left_icon`) — already exists
4. **Label** (`pills_left_label`) — already exists
5. **Tap action** (`pills_left_tap_action`)
6. **Hold action** (`pills_left_hold_action`)
7. **Double-tap action** (`pills_left_double_tap_action`)

## Current State

- [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:230) — `pills_left_icon` + `pills_left_label`
  sit as a lone `type: 'grid'` row directly under the Daily Panel expandable, *outside* any subheading.
- [`src/components/daily-panel.ts`](src/components/daily-panel.ts:116) — the Pills Left `.stat-pill` is
  clickable **only** when `entities.addRefill` exists; tap opens the card's **Refill dialog**
  (`c.showRefillDialog()`). Value display is `c.formatInteger(pillsLeft)` with `-` for unavailable.
- [`src/types.ts`](src/types.ts:44) — `pills_left_label` + `pills_left_icon` already on
  `AxDoseLoggerCardConfig`; no entity/action fields yet.
- The Safe to Take Box ([`daily-panel.ts`](src/components/daily-panel.ts:96)) is the reference pattern:
  decoupled display entity, tap defaults to more-info on the display entity, custom actions via
  `handleAction`, hold via `@contextmenu`, double-tap via `@dblclick`.
- `entities.daysLeft` is already resolved ([`ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:269)
  via `_days_left` suffix), with a `daysLeftEst` flag. The [`stats.days_left`](src/localize.ts:73) /
  [`stats.days_left_est`](src/localize.ts:74) localize keys already exist. The Stats panel renders
  Days Left as `formatInteger(v) + ' d'`.

## Tap-Action Precedence (key decision — revised per user feedback)

The Pills Left box differs from Safe to Take: its default tap opens the card's own **Refill dialog**,
not more-info. "Refill dialog" **cannot** be chosen from the `ui_action` dropdown (it's a card-internal
feature, not a standard HA action), so it must remain the built-in default that a custom tap action
overrides. Precedence when the new overrides are added:

| Custom tap action? | Display mode | `addRefill` exists? | Tap behavior |
|---|---|---|---|
| yes | * | * | `handleAction` (custom) — overrides everything below |
| no  | Days-left toggle ON | yes | **Refill dialog** (retain refill-by-tap UX) |
| no  | Days-left toggle ON | no  | more-info on `entities.daysLeft` |
| no  | Entity swapped | yes | **Refill dialog** (still the default; user-confirmed) |
| no  | Entity swapped | no  | more-info on the **display** entity |
| no  | Default (pills-left sensor) | yes | **Refill dialog** (existing UX, unchanged) |
| no  | Default (pills-left sensor) | no  | more-info on `entities.pillsLeft` |

Hold / double-tap: if configured → `handleAction`; else no-op (identical to Safe to Take).

**Rationale:** The Refill dialog is a card-internal UX that can't be expressed in the `ui_action`
dropdown, so it stays the built-in default for *all* display modes (default pills-left, days-left
toggle, and arbitrary entity swap), not just the un-swapped default sensor. A custom tap action always
wins (user-confirmed). This means a swapped box (e.g. showing a battery %) tapping to open the Refill
dialog is the *intended* behavior — the user explicitly wants the Refill dialog retained across swaps.
If the user wants more-info on a swapped entity instead, they set a `tap_action: more-info`.

## Display Modes (3-way)

The box has three mutually-known display modes, computed in priority order:

1. **Days-left toggle ON** (`pills_left_show_days_left === true`) → display `entities.daysLeft`,
   value = `formatInteger(state) + ' d'` (mirrors the Stats panel Days Left row). Label defaults to
   `stats.days_left` ("Days left") or `stats.days_left_est` ("Est. days left") based on
   `entities.daysLeftEst`. Icon defaults to `mdi:calendar-month`. (Backend `daysLeft` sensor exposes
   a `unit_of_measurement` of `d`, so appending ` d` is consistent; alternatively read the attribute.)
2. **Entity swapped** (`pills_left_entity` set and ≠ `entities.pillsLeft`) → display the configured
   entity, value mirrors the Safe to Take swapped path (numeric → `formatInteger` + unit attribute;
   non-numeric → title-case). Label/icon default to the entity's friendly name / `mdi:pill`.
3. **Default** → display `entities.pillsLeft`, value = `formatInteger(state)` (unchanged).

`pills_left_show_days_left` and `pills_left_entity` are independent; if both are set, the toggle wins
(the toggle is a first-class built-in swap, treated as a higher-priority mode). A clarifying helper
comment documents this.

## Implementation Steps

### 1. `src/types.ts` — add config fields + controller method

- Add to `AxDoseLoggerCardConfig` (after `pills_left_icon`):
  - `pills_left_show_days_left?: boolean`
  - `pills_left_entity?: string`
  - `pills_left_tap_action?: ActionConfig`
  - `pills_left_hold_action?: ActionConfig`
  - `pills_left_double_tap_action?: ActionConfig`
- Add to `CardController` interface (after `getSafeBoxEntity` / `handleSafeBoxAction`):
  - `getPillsLeftBoxEntity(entities: ResolvedEntities): string | undefined`
  - `handlePillsLeftBoxAction(e: Event | null, action: 'tap' | 'hold' | 'double_tap', config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig }, displayEntity: string | undefined, fallback?: () => void): void`

### 2. `src/ax-dose-logger-card.ts` — controller logic

- Add `_getPillsLeftBoxEntity(entities)`:
  - `if (this.config?.pills_left_show_days_left === true) return entities.daysLeft;`
  - `return this.config?.pills_left_entity || entities.pillsLeft;`
  - (mirrors `_getSafeBoxEntity` shape). Expose via public `getPillsLeftBoxEntity`.
- Add `_handlePillsLeftBoxAction(_e, action, config, displayEntity, fallback?)`:
  - `if (actionConfig) → handleAction(this, this.hass, config, action)`
  - `else if (action === 'tap' && fallback) → fallback()`
  - `else if (action === 'tap' && displayEntity) → this._openMoreInfo(displayEntity)`
  - else no-op
  - (Generalizes `_handleSafeBoxAction` with an optional `fallback`; Safe to Take stays on its
    own method to avoid regression risk — duplication is ~6 lines.)
- Expose public `handlePillsLeftBoxAction` wrapper (mirrors `handleSafeBoxAction`).

### 3. `src/ax-dose-logger-editor.ts` — schema restructure

Replace the lone `pills_left_icon` + `pills_left_label` grid row with a new `pills_left_box`
expandable (mirroring `safe_to_take_box`), with the days-left toggle at the top:

```
{
  type: 'expandable',
  name: 'pills_left_box',
  title: 'Pills Left Box',
  flatten: true,
  schema: [
    { name: 'pills_left_show_days_left', selector: { boolean: {} } },
    { name: 'pills_left_entity', selector: { entity: { context: { filter_device_id: 'device_id' } } } },
    { type: 'grid', name: '', column_min_width: '200px', schema: [
      { name: 'pills_left_icon', selector: { icon: {} } },
      { name: 'pills_left_label', selector: { text: {} } },
    ]},
    { name: 'pills_left_tap_action',   selector: { ui_action: {} } },
    { name: 'pills_left_hold_action',  selector: { ui_action: {} } },
    { name: 'pills_left_double_tap_action', selector: { ui_action: {} } },
  ],
}
```

- Update the `computeHelper` guard comment to list `pills_left_box` alongside the other containers.
- No `computeLabel` change needed (mirrors `safe_to_take_box`: keep labels on leaf fields; grid
  alignment handled by the injected `align-items: end` CSS).

### 4. `src/localize.ts` — new keys

Labels:
- `config.pills_left_box` = 'Pills Left Box'
- `config.pills_left_show_days_left` = 'Days left instead of Pills left'
- `config.pills_left_entity` = 'Pills Left Entity'
- `config.pills_left_tap_action` = 'Tap Action'
- `config.pills_left_hold_action` = 'Hold Action'
- `config.pills_left_double_tap_action` = 'Double Tap Action'

Helpers:
- `config.helper.pills_left_box` = 'Replace the box with any entity, or switch to the Days left sensor. Leave empty for the default sensor.'
- `config.helper.pills_left_show_days_left` = 'Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap.'
- `config.helper.pills_left_entity` = 'Any entity to show here. Leave empty for default.'
- `config.helper.pills_left_tap_action` = 'Defaults to the Refill dialog. A custom action overrides it.'
- `config.helper.pills_left_hold_action` = 'Long-press action.'
- `config.helper.pills_left_double_tap_action` = 'Double-tap action.'

(`config.pills_left_label`, `config.pills_left_icon`, `config.helper.pills_left_label`,
`config.helper.pills_left_icon` already exist — unchanged.)

### 5. `src/components/daily-panel.ts` — render + tap precedence

In `render()`, after the Safe to Take box block, compute Pills Left locals:

- `pillsLeftShowDays = c.config?.pills_left_show_days_left === true`
- `pillsLeftDisplayEntity = c.getPillsLeftBoxEntity(e)` (controller resolves days-left vs swapped vs default)
- `pillsLeftDisplayState = c.getState(pillsLeftDisplayEntity)`
- `pillsLeftIsSwapped = !!(c.config?.pills_left_entity && c.config.pills_left_entity !== e.pillsLeft && !pillsLeftShowDays)`
- `pillsLeftUnknown = state is 'unknown'/'unavailable'/undefined`
- Build `pillsLeftActionConfig` object (entity/tap/hold/double_tap from config).
- `plHasCustomTap`, `plHasHold`, `plHasDblClick`.
- `pillsLeftClickable = plHasCustomTap || plHasHold || plHasDblClick || !!pillsLeftDisplayEntity || !!e.addRefill`
- Tap fallback closure: `() => { if (e.addRefill) c.showRefillDialog(); else if (pillsLeftDisplayEntity) c.openMoreInfo(pillsLeftDisplayEntity); }`

Pills Left `.stat-pill` template:
- `class="stat-pill ${pillsLeftClickable ? 'clickable' : ''}"`
- `role="button"`, `tabindex=${pillsLeftClickable ? '0' : nothing}`
- `aria-label` = `c.config?.pills_left_label || (pillsLeftShowDays ? localize(...daysLeftKey) : localize(... 'daily.pills_left'))`
- `@click` = `pillsLeftClickable ? (ev) => c.handlePillsLeftBoxAction(ev, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, tapFallback) : null`
- `@keydown` = same via `c.onKeyActivate`
- `@contextmenu` = `plHasHold ? (ev) => { ev.preventDefault(); c.handlePillsLeftBoxAction(null, 'hold', ...) } : null`
- `@dblclick` = `plHasDblClick ? () => c.handlePillsLeftBoxAction(null, 'double_tap', ...) : null`
- `<ha-icon icon="${c.config?.pills_left_icon || (pillsLeftShowDays ? 'mdi:calendar-month' : 'mdi:pill')}">`
- `<span class="stat-label">` = `c.config?.pills_left_label || (pillsLeftShowDays ? localize(e.daysLeftEst ? 'stats.days_left_est' : 'stats.days_left') : localize(... 'daily.pills_left'))`
- `<span class="stat-value">` = display-mode-aware:
  - `pillsLeftUnknown → localize('daily.na')`
  - `pillsLeftShowDays → c.formatInteger(pillsLeftDisplayState) + ' d'`
  - `pillsLeftIsSwapped → numeric? formatInteger + unit : title-case` (same logic as Safe to Take swapped path)
  - default → `c.formatInteger(pillsLeftDisplayState)` (unchanged), with `'unavailable' → '-'`

No CSS changes (the Pills Left box already uses the same `.stat-pill` surface as Safe to Take).

### 6. `README.md` — Configuration Options table

Add 5 new rows after the existing `pills_left_icon` row:
- `pills_left_show_days_left` | boolean | `false` | Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap
- `pills_left_entity` | entity | _(empty)_ | Any Home Assistant entity to display in the Pills Left box. Leave empty to use the built-in sensor. Tapping still opens the Refill dialog by default
- `pills_left_tap_action` | action | `refill` | Action when the Pills Left box is tapped. Defaults to the Refill dialog; a custom action overrides it
- `pills_left_hold_action` | action | _(none)_ | Long-press action
- `pills_left_double_tap_action` | action | _(none)_ | Double-tap action

### 7. Verify + update memory bank

- `yarn run build` (exit 0, no warnings)
- Update frontend `memory-bank/activeContext.md`, `progress.md` per the end-of-task protocol
- No `projectstructure.md` change (no files added/renamed/deleted)

## Files Modified

- `src/types.ts` — 5 config fields + 2 controller methods
- `src/ax-dose-logger-card.ts` — `_getPillsLeftBoxEntity` + `_handlePillsLeftBoxAction` + public wrappers
- `src/ax-dose-logger-editor.ts` — `pills_left_box` expandable replaces the lone grid row
- `src/localize.ts` — 6 label keys + 6 helper keys
- `src/components/daily-panel.ts` — Pills Left render: days-left mode, swapped value, tap/hold/double-tap wiring
- `README.md` — 5 new config rows
- `dist/ax-dose-logger-card.js` — rebuilt

## Key Decisions

1. **Full parity with Safe to Take Box + a built-in days-left swap** — entity replacement + icon +
   label + 3 actions, all under a "Pills Left Box" expandable, plus a "Days left instead of Pills
   left" toggle. Confirmed by user.
2. **Custom tap action always wins** — overrides the Refill dialog default (user-confirmed).
3. **Refill dialog stays the default tap for ALL display modes** (default, days-left, entity swap) —
   because "Refill dialog" cannot be chosen from the `ui_action` dropdown, it must remain the
   built-in default; a custom tap action overrides it when desired. User-confirmed.
4. **Days-left toggle is a first-class built-in swap** — when on, the box shows `entities.daysLeft`
   with ` d` suffix and the label/icon default switch to the days-left variants; the Refill dialog
   default tap is retained (user-confirmed).
5. **No safety decoupling needed** — nothing consumes the real `pillsLeft` for logic (Stats row
   removed Iteration 20; refill uses `addRefill`), unlike Safe to Take's LIMIT REACHED coupling.
6. **Separate `handlePillsLeftBoxAction` method, not a refactor of `handleSafeBoxAction`** — avoids
   regression risk on the working Safe to Take path; duplication is minimal (~6 lines).