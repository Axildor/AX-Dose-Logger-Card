# Take Pill Button Restructure — Move Next Dose Into Button

## Goal

Move the standalone "Next dose" display into the Take Pill button, and add "Last dose:" label prefix to the existing time-since counter. For As Needed devices, show "Wait:" instead of "Next dose:". Button and stats column must remain symmetrical in height.

## Current State

```
┌──────────────────────────────────────┐
│         Medication Name              │  ← .med-name
│      Next dose: Available now        │  ← .next-dose (standalone, ~20px + 12px gap)
│ ┌────────────┐ ┌──────────────────┐  │
│ │  [pill]    │ │ Safe to take: 1  │  │
│ │ Take Pill  │ │ Pills left: 30   │  │  ← .daily-main
│ │  2h 15m ago│ │                  │  │
│ └────────────┘ └──────────────────┘  │
└──────────────────────────────────────┘
```

- `.next-dose` is a standalone centered div between `.med-name` and `.daily-main`
- `.take-pill-btn` shows: icon (36px) + "Take Pill" (16px) + `.take-sub` (11px) with padding 20px
- [`_computeNextDose()`](src/pill-logger-card.ts:262) returns "Available now" or "Wait: Xh Ym" (prefix baked in)
- [`_computeTimeSinceLastDose()`](src/pill-logger-card.ts:282) returns "2h 15m ago" or "Never"

## Target State

```
┌──────────────────────────────────────┐
│         Medication Name              │  ← .med-name
│ ┌────────────┐ ┌──────────────────┐  │
│ │  [pill]    │ │ Safe to take: 1  │  │
│ │ Take Pill  │ │ Pills left: 30   │  │  ← .daily-main
│ │Next dose:  │ │                  │  │
│ │  Available │ │                  │  │
│ │Last dose:  │ │                  │  │
│ │ 2h 15m ago │ │                  │  │
│ └────────────┘ └──────────────────┘  │
└──────────────────────────────────────┘
```

For **As Needed** devices, "Next dose:" becomes "Wait:":

```
│ │  Wait:      │ │
│ │  2h 15m    │ │
```

For **danger** state (limit reached):

```
│ │  [alert]    │ │
│ │LIMIT REACHED│ │
│ │Next dose:  │ │
│ │  2h 15m    │ │
│ │Last dose:  │ │
│ │ 5m ago     │ │
```

## Vertical Space Budget — Preserving Symmetry

Removing the standalone `.next-dose` div saves ~32px (20px element + 12px gap above `.daily-main`).
This freed space allows the button to absorb the new "Next dose:" line without growing the overall card.

**Current button internal height:**
- Padding top: 20px
- Icon: 36px + margin 2px
- "Take Pill": ~20px (16px font)
- Gap: 4px
- `.take-sub`: ~14px (11px font)
- Padding bottom: 20px
- **Total: ~96px**

**New button internal height (with compensations):**
- Padding top: 12px (reduced from 20px, saves 8px)
- Icon: 28px + margin 2px (reduced from 36px, saves 8px)
- "Take Pill": ~18px (16px font)
- Gap: 2px (reduced from 4px)
- `.take-sub` "Next dose: Available now": ~13px (10px font)
- `.take-sub` "Last dose: 2h 15m ago": ~13px (10px font)
- Padding bottom: 12px (reduced from 20px, saves 8px)
- **Total: ~88px** — actually 8px shorter than current

The stats column stays the same height. Both flex siblings stretch to match via `align-items: stretch` (default for flex). The overall card is shorter because the standalone `.next-dose` row is eliminated.

## As Needed Detection

The `tracking_type` field is stored in the backend config entry data but **not exposed** as an entity attribute on any sensor. The [`PillNextDoseSensor`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/next_dose.py:10) has `self._tracking_type` but only exposes `timestamps` and `safe_to_take` in [`_attr_extra_state_attributes`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/next_dose.py:222).

**Solution**: Add `tracking_type` to the next_dose sensor's attributes. This is a minimal backend change.

## Changes

### 1. Backend: Expose `tracking_type` in next_dose sensor attributes

**File**: [`next_dose.py`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/next_dose.py:222)

Add `tracking_type` to `_attr_extra_state_attributes`:

```python
self._attr_extra_state_attributes = {
    "timestamps": [ts.isoformat() for ts in self._timestamps],
    "safe_to_take": safe_to_take,
    "tracking_type": self._tracking_type,  # NEW
}
```

### 2. Frontend: Add `_isAsNeeded()` helper

**File**: [`src/pill-logger-card.ts`](src/pill-logger-card.ts)

New method that reads `tracking_type` from the next_dose entity's attributes:

```typescript
private _isAsNeeded(entities: ResolvedEntities): boolean {
  if (!entities.nextDose || !this.hass) return false;
  return this._getAttr(entities.nextDose, 'tracking_type') === 'As Needed';
}
```

### 3. Frontend: Refactor `_computeNextDose()` — remove "Wait:" prefix

**File**: [`src/pill-logger-card.ts`](src/pill-logger-card.ts:262)

Current return values: `"Available now"`, `"Wait: 2h 15m"`, `"Unavailable"`

New return values: `"Available now"`, `"2h 15m"`, `"Unavailable"`

The "Wait:" prefix is redundant because the template label will be either "Next dose:" or "Wait:" depending on device type.

```typescript
private _computeNextDose(entities: ResolvedEntities): string {
  // ... same logic ...
  if (hours > 0) return `${hours}h ${minutes}m`;   // removed "Wait: " prefix
  return `${minutes}m`;                              // removed "Wait: " prefix
  // ...
}
```

### 4. Frontend: Remove standalone `.next-dose` div from `_renderPane1()`

**File**: [`src/pill-logger-card.ts`](src/pill-logger-card.ts:435-438)

Remove the 4-line `.next-dose` block between `.med-name` and `.daily-main`.

### 5. Frontend: Restructure Take Pill button template

**File**: [`src/pill-logger-card.ts`](src/pill-logger-card.ts:441-448)

Current button content:
```html
<ha-icon icon="..."></ha-icon>
<span>${isLimitReached ? 'LIMIT REACHED' : 'Take Pill'}</span>
<span class="take-sub">${timeSince}</span>
```

New button content:
```html
<ha-icon icon="..."></ha-icon>
<span class="take-label">${isLimitReached ? 'LIMIT REACHED' : 'Take Pill'}</span>
<span class="take-sub">${isAsNeeded ? 'Wait:' : 'Next dose:'} ${nextDose}</span>
<span class="take-sub">Last dose: ${timeSince}</span>
```

### 6. Frontend: CSS updates

**File**: [`src/pill-logger-card.ts`](src/pill-logger-card.ts:1242-1255)

- **Delete** `.next-dose` and `.next-dose ha-icon` CSS rules (no longer used)
- **Modify** `.take-pill-btn` padding from `20px 16px` to `12px 16px` (tighter vertical, same horizontal)
- **Modify** `.take-pill-btn` gap from `4px` to `2px` (tighter with 4 lines)
- **Modify** `.take-pill-btn ha-icon` `--mdc-icon-size` from `36px` to `28px` (smaller icon compensates for extra line)
- **Modify** `.take-pill-btn span:first-of-type` to `.take-label` (named class instead of positional selector)
- **Modify** `.take-sub` font-size from `11px` to `10px` (slightly smaller to fit two info lines)

## File Change Summary

| File | Change |
|------|--------|
| [`next_dose.py`](../Home-Assistant-Pill-Logger/custom_components/pill_logger/sensors/next_dose.py:222) | Add `tracking_type` to `_attr_extra_state_attributes` |
| [`src/pill-logger-card.ts`](src/pill-logger-card.ts) | Add `_isAsNeeded()`, refactor `_computeNextDose()`, remove `.next-dose` div, restructure button template, update CSS |