# Plan v2: Replaceable "Safe to Take" Box — Any Entity + Tap/Hold/Double-Tap Actions

## Goal
Allow users to replace the "Safe to Take" stat box in the Daily pane with **any entity** (not restricted to the integration), and configure **tap / hold / double-tap** click behavior on the box (like a Mushroom card). All settings live in a **nested collapsable** inside the `daily_panel` expandable, located under the `take_pill_label` field. The Take Pill button's LIMIT REACHED logic stays decoupled and always uses the real `pills_safe_to_take` sensor.

## Current State (after v1 implementation)
- `safe_to_take_entity` + `safe_to_take_label` config fields exist, placed directly in `daily_panel` between `take_pill_label` and `pills_left_label`.
- The entity selector is locked to `integration: 'ax_dose_logger'` + `filter_device_id`.
- The box is clickable → `_openMoreInfo(displayEntity)` (hardcoded more-info).

## v2 Changes

### 1. Config interface ([`AxDoseLoggerCardConfig`](src/ax-dose-logger-card.ts:12))
Add action config fields (standard HA `ActionConfig` shape):
```ts
safe_to_take_entity?: string;        // already exists
safe_to_take_label?: string;         // already exists
safe_to_take_tap_action?: ActionConfig;     // new
safe_to_take_hold_action?: ActionConfig;    // new
safe_to_take_double_tap_action?: ActionConfig; // new
```
Import `ActionConfig` type from `custom-card-helpers`.

### 2. Config form schema — nested collapsable
Replace the two flat fields currently sitting between `take_pill_label` and `pills_left_label` with a **nested expandable** titled "Safe to Take Box":
```
daily_panel (expandable)
  ├─ take_pill_icon
  ├─ take_pill_label
  ├─ safe_to_take_box (expandable, nested)   ← NEW
  │   ├─ safe_to_take_entity      (entity selector, NO integration lock — any entity)
  │   ├─ safe_to_take_label       (text)
  │   ├─ safe_to_take_tap_action  (ui-action selector)
  │   ├─ safe_to_take_hold_action (ui-action selector)
  │   └─ safe_to_take_double_tap_action (ui-action selector)
  ├─ pills_left_label
  └─ chips (expandable, nested)
```
The `ui-action` selector is HA's standard action picker (renders the "Tap action / Hold action / Double tap action" dropdowns with options: more-info, toggle, call-service, navigate, url, none, fire-dom-event). This is the same selector Mushroom and stock cards use.

The `safe_to_take_entity` selector drops the `integration` lock (any entity selectable) but **keeps** `context: { filter_device_id: 'device_id' }` as a soft default — HA's entity picker will pre-filter to the device but still allow browsing all entities. (If even the soft filter is undesirable, drop it entirely — confirm with user.)

### 3. Render logic ([`_renderPane1`](src/ax-dose-logger-card.ts:823))
Replace the hardcoded `_openMoreInfo` click handler with the standard HA action handler pattern:
- Import `handleAction` from `custom-card-helpers`.
- Build an action config object from the three config fields:
  ```ts
  const actionConfig = {
    entity: displayEntity,
    tap_action: this.config?.safe_to_take_tap_action,
    hold_action: this.config?.safe_to_take_hold_action,
    double_tap_action: this.config?.safe_to_take_double_tap_action,
  };
  ```
- Wire the `.stat-pill` to HA's action handler. The standard pattern uses the `action` custom event (`@action=${this._handleSafeBoxAction}`) with `hasHold`/`hasDoubleClick` options, OR direct `@click`/`@contextmenu`/double-click via `handleClick`. The cleanest approach: use HA's `installActionHandler`-style event (`hass-action`) — but the simplest reliable path in Lit is:
  - `@click=${(e) => handleAction(this, this.hass!, actionConfig, 'tap')}`
  - `@contextmenu=${(e) => { e.preventDefault(); handleAction(this, this.hass!, actionConfig, 'hold'); }}`
  - Double-tap: use `hasDoubleClick` from custom-card-helpers or a manual double-click timer.
- **Default behavior when no action configured**: fall back to `_openMoreInfo(displayEntity)` (current v1 behavior) so existing configs keep working.
- **Clickable styling**: keep `.clickable` class when `displayEntity` is set.

### 4. Localize strings ([`localize.ts`](src/localize.ts))
Add:
- `config.safe_to_take_box`: `'Safe to Take Box'` (nested expandable title)
- (existing `config.safe_to_take_entity` + `config.safe_to_take_label` stay)
- The `ui-action` selector auto-labels its own fields ("Tap action", etc.) so no new keys needed for the action selectors themselves. Add helper for the expandable if desired.

### 5. Backward compatibility
- Existing v1 configs with `safe_to_take_entity` set but no action fields → box renders with default more-info click (no regression).
- The nested expandable is collapsed by default; users who already set `safe_to_take_entity` in v1 will see their value preserved inside it.

## Edge Cases
1. **No entity configured, no actions** → box uses default `pills_safe_to_take` sensor, not clickable (matches pre-v1 behavior).
2. **Entity configured, no actions** → box shows entity state, click = more-info on that entity (v1 default).
3. **Actions configured, no entity** → actions still fire (e.g. navigate/call-service) but `entity` context is undefined — HA's `handleAction` handles missing entity gracefully (more-info would no-op).
4. **`none` action** → click does nothing (standard HA behavior).
5. **Non-numeric entity** → raw state string displayed (v1 behavior retained).

## Files to Modify
1. [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — config interface (3 action fields + ActionConfig import), `_renderPane1` action wiring, `getConfigForm` nested expandable schema.
2. [`src/localize.ts`](src/localize.ts) — 1 new key (`config.safe_to_take_box`); existing keys retained.
3. [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuild.
4. [`README.md`](README.md) — update the 2 existing rows + add 3 action rows to Configuration Options table.
5. Memory-bank files — update.

## Verification
- `yarn run build` — clean compile.
- Manual: set `safe_to_take_entity` to any entity → box shows its state; configure tap_action = navigate → click navigates; hold_action = call-service → long-press fires service; double_tap = more-info → double-click opens more-info.
- Manual: no actions set → click defaults to more-info (backward compat).