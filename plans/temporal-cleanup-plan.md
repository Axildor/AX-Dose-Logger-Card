# Temporal String Cleanup & Button Unification Plan

## Goal
Clear the header of all temporal data and unify past/future timestamps into the button sub-text with raw duration formatting.

## Target Visual Output

**Header:** `Test pill2 - 500 mg` (strictly name + strength, no temporal data)

**Button (safe state):**
```
[icon]
Take Pill
Last: 4h 22m
```

**Button (danger state):**
```
[icon]
LIMIT REACHED
Last: 4h 22m • Next: 2h 15m
```

## Current State Analysis

| Element | Current | Target |
|---------|---------|--------|
| Title | `Pill name - 500 mg - Wait: 2h 15m` | `Pill name - 500 mg` |
| Button safe | `Last dose: 4h 22m ago` | `Last: 4h 22m` |
| Button danger | `Last dose: 4h 22m ago` | `Last: 4h 22m • Next: 2h 15m` |
| `_computeTimeSinceLastDose` | Returns `"4h 22m ago"` | Returns `"4h 22m"` |
| `_computeNextDose` | Returns `"Available now"` | Returns `"now"` |
| `_computeNextDoseLabel` | Returns `"Wait: 2h 15m"` or `""` | **DELETE** |
| `_isAsNeeded` | Used only by `_computeNextDoseLabel` | **DELETE** |
| `.med-countdown` CSS | Exists for title countdown span | **DELETE** |

## Changes Required

### 1. Modify `_computeTimeSinceLastDose()` — strip "ago" suffix

```typescript
// BEFORE
if (hours > 0) return `${hours}h ${minutes}m ago`;
return `${minutes}m ago`;

// AFTER
if (hours > 0) return `${hours}h ${minutes}m`;
return `${minutes}m`;
```

### 2. Modify `_computeNextDose()` — return raw duration

```typescript
// BEFORE
if (isNaN(next.getTime()) || next <= now) return 'Available now';

// AFTER
if (isNaN(next.getTime()) || next <= now) return 'now';
```

Also change `"Unavailable"` stays as-is — it's not a duration prefix, it's a state.

### 3. Delete `_computeNextDoseLabel()` method entirely

No longer needed — the title no longer shows countdown, and the button uses `_computeNextDose()` directly.

### 4. Delete `_isAsNeeded()` method

Only called by `_computeNextDoseLabel()` which we're deleting. No other callers.

### 5. Modify `_renderPane1()` template

**Title** — remove countdown span:
```html
<!-- BEFORE -->
<div class="med-name" @click=${() => this._showDeviceInfo = true}>${this._getMedName(entities)}${nextDoseLabel ? html` <span class="med-countdown">- ${nextDoseLabel}</span>` : nothing}</div>

<!-- AFTER -->
<div class="med-name" @click=${() => this._showDeviceInfo = true}>${this._getMedName(entities)}</div>
```

**Button sub-text** — unified with conditional Next:
```html
<!-- BEFORE -->
<span class="take-sub">Last dose: ${timeSince}</span>

<!-- AFTER -->
<span class="take-sub">${isLimitReached ? html`Last: ${timeSince} • Next: ${nextDose}` : html`Last: ${timeSince}`}</span>
```

**Variables** — remove `nextDoseLabel` and `isAsNeeded`, add `nextDose`:
```typescript
// BEFORE
const nextDoseLabel = this._computeNextDoseLabel(entities);

// AFTER
const nextDose = this._computeNextDose(entities);
```

### 6. Delete `.med-countdown` CSS class

No longer referenced in any template.

### 7. Warning dialog — no change needed

`_handleTakePill()` uses `_computeNextDose()` which will now return `"2h 15m"` or `"now"`. The dialog message `WARNING: limit set does not reset until: 2h 15m. Override?` reads correctly with raw duration.

## File Changes Summary

| File | Change |
|------|--------|
| `src/pill-logger-card.ts` | Modify `_computeTimeSinceLastDose()` — strip "ago" |
| `src/pill-logger-card.ts` | Modify `_computeNextDose()` — "Available now" → "now" |
| `src/pill-logger-card.ts` | Delete `_computeNextDoseLabel()` method |
| `src/pill-logger-card.ts` | Delete `_isAsNeeded()` method |
| `src/pill-logger-card.ts` | Modify `_renderPane1()` — title, button, variables |
| `src/pill-logger-card.ts` | Delete `.med-countdown` CSS |
| `dist/pill-logger-card.js` | Rebuilt output |