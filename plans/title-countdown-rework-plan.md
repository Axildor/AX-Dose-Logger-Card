# Title Countdown Rework Plan

## Goal
Move the Wait/Next dose countdown from the Take Pill button into the card title, and hide it when the dose is available now (instead of showing "Available Now").

## Current State

**Title** (`.med-name`): `Pill name - 200 mg` (centered, clickable for device info)

**Take Pill button** (4 lines):
1. Icon (mdi:pill or mdi:alert)
2. "Take Pill" / "LIMIT REACHED"
3. "Wait: Xh Xm" / "Next dose: Xh Xm"
4. "Last dose: Xh Xm ago"

## Target State

**Title** (`.med-name`): 
- When countdown active: `Pill name - 200 mg - Wait: 2h 15m` (or `Next dose: 2h 15m` for non-As-Needed)
- When available now: `Pill name - 200 mg` (no third segment)
- Centered, still clickable for device info

**Take Pill button** (3 lines):
1. Icon (mdi:pill or mdi:alert)
2. "Take Pill" / "LIMIT REACHED"
3. "Last dose: Xh Xm ago"

## Changes Required

### 1. Modify `_getMedName()` → `_getMedName(entities, nextDoseText)`

Currently at line 413-422, `_getMedName` builds `name - strength`. We need to add an optional third segment for the countdown.

**New logic:**
```typescript
private _getMedName(entities: ResolvedEntities, nextDoseText?: string): string {
  let name = this.config?.name || entities.medicationName;
  const strengthState = this._getState(entities.strength);
  const strengthNum = parseFloat(strengthState);
  if (entities.strength && !isNaN(strengthNum) && strengthNum !== 0
      && strengthState !== 'unknown' && strengthState !== 'unavailable') {
    name += ` - ${this._formatInteger(strengthState)} mg`;
  }
  if (nextDoseText) {
    name += ` - ${nextDoseText}`;
  }
  return name;
}
```

### 2. Create `_computeNextDoseLabel(entities)` helper

We need a function that returns the countdown string only when it's an actual countdown (not "Available now" or "Unavailable"). Returns `undefined`/empty string when the dose is available now.

```typescript
private _computeNextDoseLabel(entities: ResolvedEntities): string {
  const isAsNeeded = this._isAsNeeded(entities);
  const prefix = isAsNeeded ? 'Wait' : 'Next dose';
  const state = this._getState(entities.nextDose);
  if (state === 'unavailable' || state === 'unknown') return '';
  
  try {
    const next = new Date(state);
    const now = new Date();
    if (isNaN(next.getTime()) || next <= now) return ''; // Available now → hide
    const diffMs = next.getTime() - now.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return `${prefix}: ${timeStr}`;
  } catch {
    return '';
  }
}
```

This is distinct from `_computeNextDose()` which is also used in the warning dialog — that function should remain unchanged since it needs to return "Available now" for the override warning message.

### 3. Modify `_renderPane1()` — Title and Button

**Title line** (currently line 437):
```html
<!-- BEFORE -->
<div class="med-name" @click=${() => this._showDeviceInfo = true}>${this._getMedName(entities)}</div>

<!-- AFTER -->
<div class="med-name" @click=${() => this._showDeviceInfo = true}>${this._getMedName(entities, nextDoseLabel)}</div>
```

Where `nextDoseLabel` is computed at the top of `_renderPane1`:
```typescript
const nextDoseLabel = this._computeNextDoseLabel(entities);
```

**Button** (currently lines 440-448) — remove the Wait/Next dose line:
```html
<!-- BEFORE -->
<button class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}" @click=${() => this._handleTakePill(entities)}>
  <ha-icon icon="${isLimitReached ? 'mdi:alert' : 'mdi:pill'}"></ha-icon>
  <span class="take-label">${isLimitReached ? 'LIMIT REACHED' : 'Take Pill'}</span>
  <span class="take-sub">${isAsNeeded ? 'Wait:' : 'Next dose:'} ${nextDose}</span>
  <span class="take-sub">Last dose: ${timeSince}</span>
</button>

<!-- AFTER -->
<button class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}" @click=${() => this._handleTakePill(entities)}>
  <ha-icon icon="${isLimitReached ? 'mdi:alert' : 'mdi:pill'}"></ha-icon>
  <span class="take-label">${isLimitReached ? 'LIMIT REACHED' : 'Take Pill'}</span>
  <span class="take-sub">Last dose: ${timeSince}</span>
</button>
```

### 4. CSS — No major changes needed

The `.med-name` style already has `text-align: center` and `font-size: 18px`. The countdown text appended to the title will naturally inherit these styles. The button loses one line, which will make it slightly shorter — this is fine and actually desirable since the button was "too busy."

We may want to slightly reduce the countdown portion's visual weight. A lightweight approach: wrap the countdown in a `<span>` with a secondary color class so it's visually distinct from the name+strength:

```html
<div class="med-name" @click=${() => this._showDeviceInfo = true}>
  ${this._getMedName(entities)}${nextDoseLabel ? html` <span class="med-countdown">- ${nextDoseLabel}</span>` : nothing}
</div>
```

With CSS:
```css
.med-countdown {
  font-weight: 400;
  font-size: 14px;
  color: var(--secondary-text-color, #666);
}
```

This way the countdown is visually subordinate to the name+strength but still part of the centered title.

### 5. Keep `_computeNextDose()` unchanged

This function is still used by `_handleTakePill()` for the warning dialog message. It should continue returning "Available now" and full time strings. The new `_computeNextDoseLabel()` is a separate, display-only helper.

## Summary of File Changes

| File | Change |
|------|--------|
| `src/pill-logger-card.ts` | Add `_computeNextDoseLabel()` method |
| `src/pill-logger-card.ts` | Modify `_getMedName()` to not include countdown (keep it simple, handle in template) |
| `src/pill-logger-card.ts` | Modify `_renderPane1()` template: title includes conditional countdown, button drops Wait/Next dose line |
| `src/pill-logger-card.ts` | Add `.med-countdown` CSS class |
| `dist/pill-logger-card.js` | Rebuilt output |