# Plan: "over: Xh XXm" Display on Take-Pill Button

## Goal
For scheduled medications (everything except **As Needed**), when the user is
past their scheduled next-dose time, the take-pill button's sub-label should
show `over: Xh XXm` (how long overdue) instead of only `Last: Xh XXm`.

## Current Behavior
[`_renderPane1()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:561)
renders the sub-label as:

```ts
<span class="take-sub">
  ${isLimitReached
    ? html`Last: ${timeSince} \u2022 Next: ${nextDose}`
    : html`Last: ${timeSince}`}
</span>
```

- Limit reached → `Last: … • Next: …`
- Otherwise → `Last: …` only (even when next-dose time has already passed)

[`_computeNextDose()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:277)
returns `'now'` when `next <= now`, so the "past scheduled time" condition is
already detectable.

## Backend Context
[`PillNextDoseSensor._update_state()`](custom_components/pill_logger/sensors/next_dose.py:222)
already exposes `tracking_type` as a state attribute on the `next_dose` sensor:

```python
self._attr_extra_state_attributes = {
    "timestamps": [...],
    "safe_to_take": safe_to_take,
    "tracking_type": self._tracking_type,
}
```

So the frontend can read it via `_getAttr(entities.nextDose, 'tracking_type')`
— **no backend change required**.

## Design

### 1. New helper `_computeOverTime(entities)`
Located next to [`_computeNextDose()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:277).

```ts
/**
 * For scheduled medications, returns how long the user is PAST their
 * scheduled next-dose time, formatted as "Xh XXm". Returns null when:
 *   - tracking_type is "As Needed" (no preset schedule)
 *   - next_dose is unavailable/unknown
 *   - next_dose is still in the future (not yet overdue)
 */
private _computeOverTime(entities: ResolvedEntities): string | null {
  const trackingType = this._getAttr(entities.nextDose, 'tracking_type');
  if (trackingType === 'As Needed') return null;

  const state = this._getState(entities.nextDose);
  if (state === 'unavailable' || state === 'unknown' || !state) return null;

  try {
    const next = new Date(state);
    const now = new Date();
    if (isNaN(next.getTime())) return null;
    if (next > now) return null; // not overdue yet

    const diffMs = now.getTime() - next.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch {
    return null;
  }
}
```

### 2. Updated sub-label rendering in `_renderPane1()`
Compute `overTime` once, then branch:

```ts
const overTime = this._computeOverTime(entities);
// ...
<span class="take-sub">
  ${isLimitReached
    ? html`Last: ${timeSince} \u2022 Next: ${nextDose}`
    : (overTime
        ? html`over: ${overTime}`
        : html`Last: ${timeSince}`)}
</span>
```

### Rendering Rules Summary

| Condition | Sub-label |
|---|---|
| As Needed (any state) | `Last: Xh XXm` (unchanged) |
| Scheduled, not overdue, not limit | `Last: Xh XXm` (unchanged) |
| Scheduled, **overdue**, not limit | `over: Xh XXm` ← **NEW** |
| Limit reached (any type) | `Last: … • Next: …` (unchanged) |

### 3. Backward compatibility
- Older backends without the `tracking_type` attribute: `_getAttr` returns
  `undefined`, so `trackingType === 'As Needed'` is false → the over-time
  path runs. This is safe because old backends still expose a `next_dose`
  timestamp; if it's in the past, showing `over:` is correct behavior. No
  regression for As-Needed on old backends either, since As-Needed
  `next_dose` is typically `None`/`unavailable` → `_computeOverTime`
  returns null → falls back to `Last:`.

## Files Modified
- `../lovelace-pill-logger-card/src/pill-logger-card.ts` — add
  `_computeOverTime()`, update `_renderPane1()` sub-label branch.
- `../lovelace-pill-logger-card/dist/pill-logger-card.js` — rebuild via
  `yarn build`.

## Verification
- `yarn build` in the card directory (clean compile).
- Manual: set a scheduled med's next_dose to a past time → button shows
  `over: Xh XXm`. Set As Needed → still shows `Last: …`.

## Open Question for User
Should the **limit-reached** branch also show `over:` when overdue, or keep
`Last: … • Next: …`? (Default plan keeps limit-reached unchanged.)