# Inventory "-" + Master N/A — Corrected Fix (attribute-based classification)

## Why the first fix failed

The first fix switched `_getDrinksOfSubstance` classification from `entity_id` suffix
to `entityInfo.unique_id` suffix. **This made everything worse** (Log Drink popup
buttons unpressable, refill boxes non-clickable, all values still `-`) because
**`unique_id` is NOT present on the frontend `hass.entities` map.**

HA exposes the entity registry to the frontend via TWO websocket commands
([`components/config/entity_registry.py`](usr/src/homeassistant/homeassistant/components/config/entity_registry.py)):

- `config/entity_registry/list` → full `partial_json_repr` (used by the entity
  registry editor panel) — INCLUDES `unique_id`.
- `config/entity_registry/list_for_display` → compact `display_json_repr`
  (populates `hass.entities` on every Lovelace card) — does NOT include
  `unique_id`.

`_as_display_dict` ([`entity_registry.py:265`](usr/src/homeassistant/homeassistant/helpers/entity_registry.py:265))
emits only `ei` (entity_id) + `pl` (platform) + a few display fields
(`has_entity_name`, `entity_category`, `hidden_by`, `disabled_by`, display name,
display precision). **No `unique_id`.** So `entityInfo.unique_id` is always
`undefined` on the card → every `uid.endsWith(...)` check failed → nothing
matched → all `DrinkInfo` fields stayed `undefined`.

## Root cause (confirmed, both bugs same class)

**The frontend classifies entities by `entity_id` suffix, but `entity_id` is
`slugify(translated_name)`** ([`async_generate_entity_id`](usr/src/homeassistant/homeassistant/helpers/entity.py:114)
+ [`util.slugify`](usr/src/homeassistant/homeassistant/util/__init__.py:39)), and
every drink/master entity sets `_attr_has_entity_name = True`, so the entity_id
is the slugified *translated name*, NOT the unique_id stem. The suffix matches
silently miss:

**Granular (`_getDrinksOfSubstance`):**
- `DrinkStockNumber` (unique_id `_drink_stock`, name "Inventory") → `number.coffee_inventory` ❌
- `DrinkAddStockNumber` (unique_id `_drink_add_stock`, name "Add Stock") → `number.coffee_add_stock` ❌
- `DrinkAvgDosesSensor` 7 (unique_id `_drink_avg_7`, name "Avg Daily Drinks (7 Days)") → `sensor.coffee_avg_daily_drinks_7_days` ❌
- `DrinkAvgDosesSensor` 365 → `sensor.coffee_avg_daily_drinks_365_days` ❌
- `DrinkLogButton` (name "Log Drink") → `button.coffee_log_drink` ✓ coincidental
- `DrinkUndoButton` (name "Undo Drink") → `button.coffee_undo_drink` ❌ (suffix match was `_undo`)
- `DrinkResetButton` (name "Reset History") → `button.coffee_reset_history` ❌ (suffix match was `_reset`)

**Master (`_computeEntities` master branch, lines ~302-314):**
- Sleep Disruption (name "Sleep Disruption") → `sensor.caffeine_tracker_sleep_disruption` ❌ (match was `.sleep_disruption_caffeine`)
- Estimated Low Time (name "Estimated Low Time") → `sensor.caffeine_tracker_estimated_low_time` ❌
- Last Dose (name "Last Caffeine"/"Last Alcohol") → `sensor.caffeine_tracker_last_caffeine` ❌ (match was `.drink_master_last_dose_caffeine`)
- Daily Amount (name "Amount in Last 24h") → `sensor.caffeine_tracker_amount_in_last_24h` ❌ (match was `_daily_amount_`)

The Disruption N/A + Last "Never" on the Drinks pane are the SAME bug class,
pre-existing (not caused by the first fix). The In Body box works because it
classifies by the `pk_model` **attribute** (line 288), not a suffix.

## The correct fix: classify by STATE ATTRIBUTES, never entity_id/unique_id suffixes

State attributes are:
1. **Present on the frontend** (`hass.states[entityId].attributes` — full state object, unlike the display-dict entity registry).
2. **Integration-controlled** (set in `_attr_extra_state_attributes`).
3. **Stable** (survive entity renames).
4. **Already used successfully** for `device_type`, `substance`, `pk_model`, `window_days`, `drink_master`.

### Step 1 — Backend: add a `role` attribute to every drink/master entity

Add `role` to `_attr_extra_state_attributes` so the frontend can classify by a
single stable string instead of fragile suffix/name heuristics. This is additive
(no migration, no entity-registry change, no translation change).

**Granular entities** ([`number.py`](custom_components/ax_dose_logger/number.py), [`button.py`](custom_components/ax_dose_logger/button.py), [`sensors/drink_avg_doses.py`](custom_components/ax_dose_logger/sensors/drink_avg_doses.py)):
- `DrinkStockNumber` → `role: "stock"`
- `DrinkAddStockNumber` → `role: "add_stock"`
- `DrinkLogButton` → `role: "log"`
- `DrinkUndoButton` → `role: "undo"`
- `DrinkResetButton` → `role: "reset"`
- `DrinkAvgDosesSensor` → `role: "avg"` (already has `window_days` to distinguish 7/365/14/30)

**Master entities** ([`sensors/drink_master_sleep_disruption.py`](custom_components/ax_dose_logger/sensors/drink_master_sleep_disruption.py), [`sensors/drink_master_last_dose.py`](custom_components/ax_dose_logger/sensors/drink_master_last_dose.py), [`sensors/drink_master_daily_amount.py`](custom_components/ax_dose_logger/sensors/drink_master_daily_amount.py), plus the existing estimated-low-time sensor):
- `DrinkMasterSleepDisruptionSensor` → `role: "sleep_disruption"`
- `DrinkMasterEstimatedLowTimeSensor` → `role: "estimated_low_time"`
- `DrinkMasterLastDoseSensor` → `role: "last_dose"`
- `DrinkMasterDailyAmountSensor` → `role: "daily_amount"`

(All already carry `substance` + `drink_master: True`; `role` is the missing
piece that makes suffix matching unnecessary.)

### Step 2 — Frontend: revert the `unique_id` switch; classify by `role` + `window_days`

**[`src/types.ts`](src/types.ts)** — REVERT the `unique_id` field addition (it's
not on the display dict; keeping it would be misleading). No type change needed.

**[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) `_getDrinksOfSubstance`**
— revert to `entityId.startsWith(...)` domain gating, but classify by
`_getAttr(entityId, 'role')` instead of any suffix:

```ts
const role = this._getAttr(entityId, 'role');
if (entityId.startsWith('button.')) {
  if (role === 'log')   info.logButtonEntityId   = entityId;
  else if (role === 'undo')  info.undoButtonEntityId  = entityId;
  else if (role === 'reset') info.resetButtonEntityId = entityId;
} else if (entityId.startsWith('number.')) {
  if (role === 'stock')      info.stockEntityId   = entityId;
  else if (role === 'add_stock') info.addStockEntityId = entityId;
} else if (entityId.startsWith('sensor.')) {
  if (role === 'avg') {
    const wd = this._getAttr(entityId, 'window_days');
    if (wd === 7)   info.avg7EntityId   = entityId;
    else if (wd === 365) info.avg365EntityId = entityId;
  }
}
```

**[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) `_computeEntities`
master branch (lines ~288-319)** — replace the entity_id suffix matches with
`role` attribute matches:

```ts
// Sleep disruption: role === 'sleep_disruption'
if (this._getAttr(entityId, 'role') === 'sleep_disruption') result.sleepDisruption = entityId;
// Estimated low time: role === 'estimated_low_time'
if (this._getAttr(entityId, 'role') === 'estimated_low_time') result.estimatedLowTime = entityId;
// Last dose: role === 'last_dose' (replaces the .drink_master_last_dose_{substance} suffix match)
if (this._getAttr(entityId, 'role') === 'last_dose') result.lastDose = entityId;
// Daily amount: role === 'daily_amount' (replaces the _daily_amount_ substring match)
if (this._getAttr(entityId, 'role') === 'daily_amount') result.amountLast24h = entityId;
```

The existing attribute-based detections (`pk_model` → amountInBody,
`dose_count` → totalDoses, `window_days` → master avg sensors) stay unchanged.

### Step 3 — Inventory panel CSS parity (already done, keep it)

The [`src/components/inventory-panel.ts`](src/components/inventory-panel.ts)
static-styles rewrite to the Daily/Drinks parity baseline + the natural-case
`.stat-label` override is correct and stays. Only the resolver change needs
reverting.

## Why attribute-based (not unique_id, not entity_id suffix)

| Approach | Works? | Why |
|---|---|---|
| entity_id suffix (original) | ❌ | entity_id = slugify(translated_name); suffixes never match except by coincidence (Log Drink) |
| `unique_id` suffix (first fix) | ❌ | unique_id NOT in `hass.entities` display dict |
| **`role` state attribute (this fix)** | ✅ | attributes ARE in `hass.states[entityId].attributes` on the frontend; integration-controlled; survives renames; already proven by `device_type`/`substance`/`pk_model` |

## Files changed

**Backend (additive `role` attribute):**
- [`custom_components/ax_dose_logger/number.py`](custom_components/ax_dose_logger/number.py) — `role` on `DrinkStockNumber`/`DrinkAddStockNumber`
- [`custom_components/ax_dose_logger/button.py`](custom_components/ax_dose_logger/button.py) — `role` on `DrinkLogButton`/`DrinkUndoButton`/`DrinkResetButton`
- [`custom_components/ax_dose_logger/sensors/drink_avg_doses.py`](custom_components/ax_dose_logger/sensors/drink_avg_doses.py) — `role: "avg"` on `DrinkAvgDosesSensor`
- [`custom_components/ax_dose_logger/sensors/drink_master_sleep_disruption.py`](custom_components/ax_dose_logger/sensors/drink_master_sleep_disruption.py) — `role: "sleep_disruption"` on `DrinkMasterSleepDisruptionSensor`; `role: "estimated_low_time"` on `DrinkMasterEstimatedLowTimeSensor`
- [`custom_components/ax_dose_logger/sensors/drink_master_last_dose.py`](custom_components/ax_dose_logger/sensors/drink_master_last_dose.py) — `role: "last_dose"` on `DrinkMasterLastDoseSensor`
- [`custom_components/ax_dose_logger/sensors/drink_master_daily_amount.py`](custom_components/ax_dose_logger/sensors/drink_master_daily_amount.py) — `role: "daily_amount"` on `DrinkMasterDailyAmountSensor`

**Frontend:**
- [`src/types.ts`](src/types.ts) — REVERT the `unique_id` field addition
- [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — `_getDrinksOfSubstance` classify by `role`+`window_days`; `_computeEntities` master branch classify sleepDisruption/estimatedLowTime/lastDose/amountLast24h by `role` (drop the 4 entity_id suffix matches)
- [`src/components/inventory-panel.ts`](src/components/inventory-panel.ts) — CSS parity (already done, unchanged)
- [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuilt

## Verification

1. `cd /workspaces/lovelace-pill-logger-card && yarn run build` — clean.
2. Backend: `hass -c ./config --script check_config` (or just restart — additive attributes need no migration).
3. Live HA: Master Tracker → Inventory pane shows real stock + avgs (no `-`); drink boxes clickable → refill dialog; Log Drink popup buttons pressable; Drinks pane Disruption box shows the band (None/Low/Moderate/High) instead of N/A; Drinks pane "Last" sub-line shows a real time.

## Scope note

This supersedes the first (failed) fix. The first fix's memory-bank entries
will be corrected to reflect the attribute-based approach + the unique_id
display-dict finding (so the same mistake isn't repeated).