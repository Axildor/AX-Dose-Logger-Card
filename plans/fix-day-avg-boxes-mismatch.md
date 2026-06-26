# Fix: Day Average Boxes Not Appearing (Entity ID Suffix Mismatch)

## Problem

The Day Average boxes are not appearing in either the Graph or Stats panel, while the Adherence boxes appear correctly.

## Root Cause

The frontend [`_computeEntities()`](src/ax-dose-logger-card.ts:255) in [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) matches avg_doses entities by suffix, but the suffixes it expects **do not match** what the backend actually creates.

### Backend (correct — what HA actually generates)

The backend [`PillAvgDosesSensor`](custom_components/ax_dose_logger/sensors/avg_doses.py:59) sets:

```python
self._attr_unique_id = f"{entry.entry_id}_avg_doses_{window_days}"
```

With `window_days` values of `7`, `14`, `30`, `365` (from [`sensor.py:31-34`](custom_components/ax_dose_logger/sensor.py:31)).

HA derives the `entity_id` from the device name + unique_id suffix. The actual entity_ids in the registry (confirmed from `config/.storage/core.entity_registry`) are:

| Window | Actual entity_id suffix |
|--------|--------------------------|
| 7      | `_avg_daily_doses_7_days` |
| 14     | `_avg_daily_doses_14_days` |
| 30     | `_avg_daily_doses_30_days` |
| 365    | `_avg_daily_doses_365_days` (newer devices) **OR** `_avg_daily_doses_yearly` (older devices) |

The `_avg_daily_doses_` prefix comes from the translation key `avg_daily_doses` in [`strings.json:505`](custom_components/ax_dose_logger/strings.json:505) — HA slugifies the entity name "Avg Daily Doses (7 Days)" → `avg_daily_doses_7_days`.

### Frontend (wrong — what the card looks for)

[`_computeEntities()`](src/ax-dose-logger-card.ts:255) in the card:

```typescript
else if (entityId.endsWith('_avg_daily_doses_7_days')) result.avg7Days = entityId;     // ✓ matches
else if (entityId.endsWith('_avg_daily_doses_14_days')) result.avg14Days = entityId;   // ✓ matches
else if (entityId.endsWith('_avg_daily_doses_30_days')) result.avg30Days = entityId;   // ✓ matches
else if (entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;    // ✗ MISMATCH
```

The 7/14/30-day suffixes **match** correctly. The problem is the **365-day / yearly** slot:

- Frontend expects: `_avg_daily_doses_yearly`
- Backend creates: `_avg_daily_doses_365_days` (newer devices, e.g. `my_day_on_off`, `test_pill2`, `test_pill_z`)
- Older devices (e.g. `my_medication`, `test_pill`, `pill_deef`, `b_my_pill`) have `_avg_daily_doses_yearly` (legacy entity_id from before the unique_id was `_avg_doses_365`)

### Why Adherence boxes work but Avg boxes don't

The adherence sensors have a **consistent** suffix pattern:

```python
self._attr_unique_id = f"{entry.entry_id}_adherence_{window_days}"  # _adherence_7, _adherence_14, _adherence_30, _adherence_365
```

Frontend matches:
```typescript
else if (entityId.endsWith('_adherence_7_days'))    // ✓
else if (entityId.endsWith('_adherence_14_days'))   // ✓
else if (entityId.endsWith('_adherence_30_days'))   // ✓
else if (entityId.endsWith('_adherence_365_days'))  // ✓
```

All four adherence suffixes match because the backend uses `_adherence_365` (numeric) and HA slugifies to `_adherence_365_days`. The frontend correctly expects `_adherence_365_days`.

But for avg_doses, the frontend expects `_avg_daily_doses_yearly` for the 365-day slot instead of `_avg_daily_doses_365_days`. This is the mismatch.

### Why some users see it and some don't

- **Older devices** (created before the unique_id changed to `_avg_doses_365`): entity_id ends with `_avg_daily_doses_yearly` → frontend matches → boxes appear.
- **Newer devices** (created after the unique_id became `_avg_doses_365`): entity_id ends with `_avg_daily_doses_365_days` → frontend does NOT match → boxes don't appear.

The user's newer devices (`my_day_on_off`, `test_pill2`, `test_pill_z`) all have `_avg_daily_doses_365_days`, so the yearly avg box never resolves.

## Fix

### Frontend: [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)

Change the yearly avg_doses suffix match in `_computeEntities()` to accept **both** the new `_avg_daily_doses_365_days` and the legacy `_avg_daily_doses_yearly`:

```typescript
// Line 258 — before:
else if (entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;

// Line 258 — after:
else if (entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;
```

This is a **frontend-only fix**. No backend changes needed — the backend unique_id `_avg_doses_365` is correct and consistent with the adherence pattern (`_adherence_365`).

### Why not change the backend instead?

Changing the backend unique_id from `_avg_doses_365` to `_avg_doses_yearly` would:
1. Break existing entity registry entries (HA would create new entities with new unique_ids, orphaning the old ones)
2. Require a migration handler
3. Be inconsistent with the adherence sensor which uses `_adherence_365` (numeric)

The frontend dual-match approach is the correct fix — it handles both legacy and new entity_ids without any backend disruption.

## Files to Modify

1. [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts) — line 258: add `_avg_daily_doses_365_days` to the yearly avg match
2. [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) — rebuild via `yarn run build`

## Verification

1. `yarn run build` — clean compilation
2. Manual check: card on a newer device (e.g. `my_day_on_off`) should now show the yearly avg box
3. Manual check: card on an older device (e.g. `my_medication`) should still show the yearly avg box (legacy suffix still matched)