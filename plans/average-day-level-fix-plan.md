# Plan — Average Doses/Day: Day-Level Counting (PDC-aligned)

## Problem

The "Day Average" sensors (7/14/30/365) for **scheduled** tracking types
(Time of Day, Regular Interval, Cyclic) currently compute the average as:

```
average = covered_slots / total_days
```

where a slot is only "covered" if a dose falls within **±grace** of the
scheduled time (see [`avg_doses.py`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/avg_doses.py:117)
`_get_grace_hours` → 25% of interval, clamped [1,6]h).

### Reported symptom
- Scheduled dose: 11:00. Grace for a single daily dose = 6h → window is
  05:00–17:00.
- Dose taken at 18:40 → **7h40m late → outside grace → slot NOT covered**.
- That day scores 0 in the average numerator, so a 14-day average drops
  below 1.0 even though a dose was taken every single day.
- Meanwhile the frontend 14-day bar graph
  ([`_bucketByDay()`](src/pill-logger-card.ts:249)) counts **any dose on a
  calendar day** as "taken" → shows a bar every day.
- **Inconsistency**: bar graph says "14/14 days taken", average says
  "0.9/day".

### Root cause
The average sensor conflates two clinically distinct concepts:

1. **Dose-day coverage** (PDC — did you take ≥1 dose on each scheduled
   day?) — binary per day, the pharmacy-claims gold standard
   (CMS / NCQA / PQA / WHO 80% threshold).
2. **Timing adherence** (was each dose on time?) — binary per slot, the
   job of the separate Adherence % sensor.

By gating the average numerator on ±grace timing, the average silently
becomes a timing metric, not a coverage metric — which is why a
late-but-taken day reads as 0.

## Medical / Pharmaceutical Basis

- **PDC (Proportion of Days Covered)** — the validated adherence metric
  used by CMS, NCQA, PQA. Binary per day: covered if ≥1 dose taken that
   day. No partial credit, no timing component.
- **WHO / pharmacy 80% threshold** is derived from PDC — purely
  day-coverage based.
- **MEMS** (electronic monitoring) reports dose-count and timing as
  **separate** binary metrics, never blended.
- Partial credit (e.g. 0.5 for late) is **not** a validated clinical
  instrument; it muddies interpretation and is rejected here.

**Decision**: The "Day Average" must be a **day-level dose-count
metric** (PDC-aligned). Timing strictness stays in the Adherence %
sensor, which is **untouched** by this change.

## Scope

- **Backend only**: [`avg_doses.py`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/avg_doses.py)
- **Adherence sensor**: NO CHANGE (remains strict timing metric).
- **Frontend**: NO CHANGE (bar graph already uses day-level counting;
  average boxes will now agree with it).
- **Config flow / grace option**: NO CHANGE (grace still governs the
  Adherence % sensor only).

## New Average Definition

For **all** tracking types (including As Needed), the average over the
window is:

```
average = (number of scheduled days in window with ≥1 dose) / (number of scheduled days in window)
```

Where "scheduled day" is tracking-type-aware:

| Tracking type | Scheduled days in window | "Day has a dose" |
|---------------|--------------------------|------------------|
| Time of Day | every calendar day in window | ≥1 dose timestamp whose **local calendar date** equals that day |
| Regular Interval | every calendar day in window | ≥1 dose timestamp whose local calendar date equals that day |
| Cyclic/Calendar | every **ON** day in window (OFF days excluded from numerator AND denominator) | ≥1 dose timestamp whose local calendar date equals that ON day |
| As Needed | every calendar day in window | ≥1 dose timestamp whose local calendar date equals that day |

Key properties:
- **No grace / timing gate** on the average numerator. A dose at 18:40
  on an 11:00-scheduled day still counts that day as covered.
- **Local calendar date** bucketing — matches the frontend
  [`_toLocalDateKey()`](src/pill-logger-card.ts:242) definition exactly,
  so average and bar graph can never disagree on which day a dose
  belongs to.
- **Today** is included only if a dose has already been taken today;
  otherwise today is excluded from both numerator and denominator (the
  day is not yet "decided"). This prevents the average from being
  artificially dragged down by an incomplete current day.
- **Multi-dose days** (e.g. 2 doses on one scheduled day) count as **1
  covered day**, not 2. The average measures *day coverage*, not *dose
  count* — consistent with PDC. (A separate "doses per covered day"
  attribute can be exposed if desired, but the primary state stays
  coverage-based.)

> Note: This changes the semantic of the sensor from "doses/day" to
> "covered scheduled days / scheduled days". For a once-daily regimen
> the numeric range is identical (0–1). For multi-dose regimens the
> value now caps at 1.0 (full coverage) instead of exceeding 1.0 when
  extra doses are taken — which is the medically correct behavior for a
  coverage metric. The sensor name "Day Average" already implies this.

## Implementation Steps

### 1. Add a local-date helper to `avg_doses.py`

Add a module-level helper (or static method) that converts a tz-aware
datetime to a local `date` object, mirroring the frontend
`_toLocalDateKey`:

```python
def _local_date(dt: datetime) -> date:
    """Convert a tz-aware datetime to its local calendar date.

    Mirrors the frontend _toLocalDateKey() so backend average and
    frontend bar graph always agree on day bucketing.
    """
    return dt.astimezone().date() if dt.tzinfo else dt.date()
```

### 2. Replace the scheduled-mode average computation in `_update_state`

Replace the four tracking-type branches
([`avg_doses.py:343-382`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/avg_doses.py:343))
with a single unified day-coverage calculation. The grace-based slot
helpers (`_count_covered_slots_*`) are **removed** from the average
path (kept only if reused elsewhere — they are not; safe to delete or
leave dead — prefer delete for clarity).

New logic (pseudocode):

```python
def _update_state(self):
    now = dt_util.now()
    ...history_start_date / actual_window_days as today...

    base_cutoff = now - timedelta(days=actual_window_days)
    # Keep timestamps within the window (no grace extension needed now)
    self._timestamps = [ts for ts in self._timestamps if ts >= base_cutoff]

    # Build set of local dates that have ≥1 dose
    dose_dates = {_local_date(ts) for ts in self._timestamps}

    # Determine scheduled days in window and count covered
    if self._tracking_type == "Cyclic/Calendar Pattern":
        scheduled_days, covered = self._count_cyclic_days(now, base_cutoff, dose_dates, today_local)
    else:
        # Time of Day, Regular Interval, As Needed, fallback → every calendar day
        scheduled_days, covered = self._count_daily_days(base_cutoff, dose_dates, today_local)

    if scheduled_days > 0:
        self._attr_native_value = round(covered / scheduled_days, 1)
    else:
        self._attr_native_value = 0.0
```

### 3. Add `_count_daily_days` helper

Iterate calendar days from `base_cutoff.date()` up to **yesterday**
(today excluded unless it has a dose). For each day, +1 to denominator;
+1 to numerator if that date is in `dose_dates`.

```python
def _count_daily_days(self, cutoff, dose_dates, today):
    covered = 0
    total = 0
    d = cutoff.date()
    while d < today:
        total += 1
        if d in dose_dates:
            covered += 1
        d += timedelta(days=1)
    # Today: count only if a dose has been taken today
    if today in dose_dates:
        total += 1
        covered += 1
    return total, covered
```

### 4. Add `_count_cyclic_days` helper

Same iteration but skip OFF days (excluded from both numerator and
denominator), reusing the existing cycle math from
`_count_covered_slots_cyclic`.

### 5. Remove now-dead grace code from the average path

- Delete `_get_grace_hours`, `_count_covered_slots_time_of_day`,
  `_count_covered_slots_regular_interval`, `_count_covered_slots_cyclic`
  from `avg_doses.py` (they are not used by adherence.py, which has its
  own copies).
- Remove the `extended_cutoff` / grace-extended pruning (plain
  `base_cutoff` prune now).
- Remove the `_get_next_dose_time` / `_on_next_dose_timeout`
  grace-expiry scheduling — no longer needed since the average no longer
  depends on grace windows. (Midnight recalc still handles day
  rollover.)
- Drop `grace_hours` from the average sensor's attributes.

### 6. Update attributes

New attributes for transparency:
```python
{
    "covered_days": covered,
    "scheduled_days": scheduled_days,
    "window_days": self._window_days_target,
    "effective_window_days": round(actual_window_days, 1),
    "history_start_date": ...,
    "timestamps": [...],   # keep for restore
}
```

### 7. Verify

- `python3 -m py_compile custom_components/pill_logger/sensors/avg_doses.py`
- `hass -c ./config --script check_config` (if available)
- Manual reasoning: 14 days, dose every day (one late by 7h40m) →
  covered=14, scheduled=14 → average=1.0. ✅ Matches bar graph.

### 8. Documentation (backend repo)

- `memory-bank/activeContext.md` — new status: average now PDC-aligned
  day-coverage; adherence unchanged.
- `memory-bank/progress.md` — new section with checklist.
- `README.md` — update the "Day Average" description if it currently
  mentions timing/grace, to state it measures day-level coverage
  (PDC-aligned), and that timing adherence is reported by the separate
  Adherence % sensor.

## Out of Scope (explicitly deferred)

- Adherence % sensor — unchanged (strict timing, binary).
- No new Coverage % sensor entity (user chose minimal change).
- No config-flow changes.
- No frontend changes.

## Risk / Regression Notes

- **Numeric behavior change for multi-dose regimens**: average now caps
  at 1.0 instead of exceeding 1.0 when extra doses are taken. This is
  intended and medically correct for a coverage metric. Users with
  2x/day regimens who previously saw "2.0" will now see "1.0" when
  fully covered — the sensor name "Day Average" already implies
  per-day coverage, and the new `covered_days`/`scheduled_days`
  attributes make the meaning explicit.
- **Restore-state compatibility**: old restored `timestamps` lists are
  still valid; the new code only changes how they're aggregated, not
  how they're stored.
- **Adherence sensor** is in a separate file with its own grace
  helpers — deleting the average's copies does not affect it.