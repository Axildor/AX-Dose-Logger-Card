# Active Context — AX Dose Logger Card (Frontend)

## Current Status
**Complete**: Tracking Scale & Override Fix (v2) — fixed two remaining issues: (1) tick mark scale alignment — "0" was at ~0.5 position (too far right) and "10" needed to shift right ~1/4 spacing; (2) override button closed dialog but didn't actually change the value — root cause was the `set_metric` service requiring `entry_id` + `metric_key` which the frontend couldn't reliably resolve from a Lovelace card context. Fixed by changing the service to accept `entity_id` directly (the effectiveness number entity), with the backend resolving entity_id → coordinator + metric_key via the entity registry.

## What Was Changed

### Tracking Scale & Override Fix v2 (2026-06-21)
- **`src/ax-dose-logger-card.ts`** — (1) Scale alignment: changed `.tracking-scale` from symmetric `padding: 0 12px` to asymmetric `padding-left: 6px; padding-right: 2px` with `box-sizing: border-box`; removed `min-width: 14px` from `.tracking-scale-tick` so ticks size to content width for precise center alignment with slider thumb positions. (2) Override fix: override button handler now calls `ax_dose_logger.set_metric` with `entity_id` + `value` + `override: true` (no more `entry_id` or `metric_key` — the backend resolves these from the entity). Removed `configEntryId` from `ResolvedEntities` interface and `_computeEntities()` (no longer needed). Removed dead `_getEntryId()` method.
- **`dist/ax-dose-logger-card.js`** — rebuilt via `yarn run build`, clean compilation (exit 0).

### Backend Changes (2026-06-21)
- **`custom_components/ax_dose_logger/services.py`** — Changed `set_metric` service schema from `entry_id` + `metric_key` to `entity_id`. Added `_get_coordinator_for_entity()` helper that resolves `entity_id` → entity registry → `config_entry_id` → coordinator, and reads `metric_key` from the entity's state attributes. Added `ATTR_ENTITY_ID` constant. Added `entity_registry as er` import and `HomeAssistantError` import.
- **`custom_components/ax_dose_logger/services.yaml`** — Updated `set_metric` fields: replaced `entry_id` (config_entry selector) + `metric_key` (text selector) with `entity_id` (entity selector filtered to number domain + ax_dose_logger integration).
- **`custom_components/ax_dose_logger/strings.json`** + **`translations/en.json`** — Updated `set_metric` service field labels: replaced `entry_id` ("Medication") + `metric_key` ("Metric Key") with `entity_id` ("Tracking Entity").

## Files Modified
- `src/ax-dose-logger-card.ts` (frontend)
- `dist/ax-dose-logger-card.js` (frontend, rebuilt)
- `custom_components/ax_dose_logger/services.py` (backend)
- `custom_components/ax_dose_logger/services.yaml` (backend)
- `custom_components/ax_dose_logger/strings.json` (backend)
- `custom_components/ax_dose_logger/translations/en.json` (backend)

## Key Design Decisions
1. **Scale alignment via asymmetric padding** — The ha-slider thumb sits ~10px from each track edge at min/max. Single-digit ticks are ~8px wide (center at 4px), so `padding-left: 6px` places "0" center at 10px. The "10" tick is two digits (~14px, center at 7px), so `padding-right: 2px` shifts it right to match the thumb at max. Removed `min-width: 14px` so ticks don't add extra offset.
2. **Entity-based service (the real fix)** — The first attempt (configEntryId in ResolvedEntities) failed because `hass.entities[entityId].config_entry_id` is not reliably available in a Lovelace card context. The correct fix is to change the `set_metric` service to accept `entity_id` directly — the frontend already knows the entity_id (it's the slider's entity). The backend resolves entity_id → coordinator + metric_key via the entity registry (`er.async_get(hass).async_get(entity_id)`) and state attributes (`hass.states.get(entity_id).attributes['metric_key']`). This is the same pattern used by `number.set_value` and `button.press` — entity-targeted services that don't require the caller to resolve config entries.
3. **Why the first attempt failed** — `hass.entities` in the HA frontend is populated via a websocket subscription, but `config_entry_id` may not be present in all contexts or may be undefined for entities created via certain mechanisms. The entity-based approach eliminates this fragility entirely — the frontend just passes the entity_id it already has.

## Previous Context
### Tracking Dialog & Scale Fixes (2026-06-21)
- Added `_trackingOverrideDialog` to `shouldUpdate()` key list (root cause of dialog buttons not working). Restructured tick marks into `.tracking-slider-wrapper`.

### Tracking Pane Fixes (2026-06-21)
- Label derivation via `metric_label` attribute; `_pendingTracking` Set for race condition; 0-10 tick marks; "Today's {metric}" dialog format.

### Metrics → Tracking Rename (2026-06-21)
- Renamed pane ID, CSS classes, localize keys. "Tracking" is standard clinical terminology.

### Overdue Display Fix (2026-06-21)
- Added `overdue` sensor support; rewrote `_computeOverTime()`.

### Line Graph Gap-Bridging Fix (2026-06-21)
- Added `_bridgeGaps()` helper to eliminate misleading diagonal slopes.

### Rebrand to AX Dose Logger Card (2026-06-21)
- Full rename from "Pill Logger Card" to "AX Dose Logger Card".
