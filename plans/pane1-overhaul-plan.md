# Pane 1 Overhaul Plan — Next Dose Unboxed + Refill to Stats Column

## Goal
Two changes to the Daily pane:
1. **Next dose → plain centered text** under the medication name (no box/background, smaller non-bold font, icon same color as text)
2. **Refill button → replaces "Pills left" stat-pill** in the stats column (content stays the same: icon + "Refill Medication" label)

## Current Layout

```
┌─────────────────────────────────────┐
│         Medication Name             │  ← .med-name (centered, bold 18px)
├──────────────────┬──────────────────┤
│ ⏱ Next dose:    │ 💊 Refill       │  ← .next-dose-row (flex row)
│ Wait: 2h 30m     │   Medication    │     .next-dose (boxed) + .refill-btn
├──────────────────┼──────────────────┤
│                  │ ✓ Safe to take  │  ← .daily-main (flex row)
│   Take Pill      │   3             │     .take-pill-btn + .stats-column
│                  ├──────────────────┤
│                  │ 💊 Pills left   │
│                  │   28            │
└──────────────────┴──────────────────┘
```

## Target Layout

```
┌─────────────────────────────────────┐
│         Medication Name             │  ← .med-name (unchanged)
│     ⏱ Next dose: Wait: 2h 30m      │  ← .next-dose (plain, centered, smaller)
├──────────────────┬──────────────────┤
│                  │ ✓ Safe to take  │  ← .daily-main (unchanged)
│   Take Pill      │   3             │
│                  ├──────────────────┤
│                  │ 💊 Refill       │  ← .refill-btn (replaces Pills left)
│                  │   Medication    │     Falls back to Pills left stat-pill
└──────────────────┴──────────────────┘     if addRefill entity missing
```

## Changes Required

### 1. HTML Template — `_renderPane1()` (line ~393)

**Remove** the `.next-dose-row` wrapper. The next-dose div becomes a direct child of `.pane-daily`, placed between `.med-name` and `.daily-main`.

**Before:**
```html
<div class="next-dose-row">
  <div class="next-dose">
    <ha-icon icon="mdi:clock-outline"></ha-icon>
    <span>Next dose: ${nextDose}</span>
  </div>
  ${entities.addRefill ? html`
    <button class="refill-btn" @click=...>
      <ha-icon icon="mdi:pill"></ha-icon>
      <span>Refill Medication</span>
    </button>
  ` : nothing}
</div>
```

**After:**
```html
<div class="next-dose">
  <ha-icon icon="mdi:clock-outline"></ha-icon>
  <span>Next dose: ${nextDose}</span>
</div>
```

**Move refill button** into `.stats-column`, replacing the "Pills left" stat-pill. If `addRefill` entity exists, show the refill button; otherwise fall back to the original "Pills left" stat-pill.

**Before (stats-column):**
```html
<div class="stats-column">
  <div class="stat-pill">...Safe to take...</div>
  <div class="stat-pill">...Pills left...</div>
</div>
```

**After (stats-column):**
```html
<div class="stats-column">
  <div class="stat-pill">...Safe to take...</div>
  ${entities.addRefill ? html`
    <button class="refill-btn" @click=${() => { this._showRefillDialog = true; this._refillAmount = ''; }}>
      <ha-icon icon="mdi:pill"></ha-icon>
      <span>Refill Medication</span>
    </button>
  ` : html`
    <div class="stat-pill">
      <ha-icon icon="mdi:pill"></ha-icon>
      <span class="stat-label">Pills left</span>
      <span class="stat-value">${pillsLeft === 'unavailable' ? '-' : this._formatInteger(pillsLeft)}</span>
    </div>
  `}
</div>
```

### 2. CSS Changes

**Remove** `.next-dose-row` (line ~1190):
- Delete the entire `.next-dose-row` rule
- Delete the `.next-dose-row .next-dose` rule

**Restyle** `.next-dose` (line ~1199):
- Remove: `padding`, `background`, `border-radius` (no more box)
- Remove: `display: flex; align-items: center; gap: 8px;` → keep flex but adjust
- Add: `text-align: center; justify-content: center;` (centered)
- Add: `font-size: 13px;` (slightly smaller, was 14px)
- Add: `font-weight: 400;` (non-bold, explicit)
- Keep: `color: var(--secondary-text-color, #666);`
- Keep: `display: flex; align-items: center; gap: 8px;` (for icon+text alignment)

**Update** `.next-dose ha-icon` (line ~1210):
- Change `color: var(--primary-color, #03a9f4)` → `color: var(--secondary-text-color, #666)` (icon matches text color)
- Keep `--mdc-icon-size: 20px;`

**Update** `.refill-btn` (line ~1215):
- Remove: `flex: 1;` (was for next-dose-row context, not needed in stats-column)
- Add: `width: 100%;` (fill the stats-column width)
- Keep all other styles (background, color, border-radius, etc.)

### 3. No Changes Needed

- `_renderRefillDialog()` — unchanged
- `_handleRefill()` — unchanged
- `_showRefillDialog` / `_refillAmount` state — unchanged
- Refill dialog rendering in `render()` — unchanged
- All other panes — unchanged

## Summary of Edits

| # | File | Location | Change |
|---|------|----------|--------|
| 1 | `src/pill-logger-card.ts` | `_renderPane1()` ~L407-419 | Remove `.next-dose-row` wrapper; make `.next-dose` a direct child; remove refill button from this section |
| 2 | `src/pill-logger-card.ts` | `_renderPane1()` ~L437-441 | Replace "Pills left" stat-pill with conditional: refill button if `addRefill` exists, else original stat-pill |
| 3 | `src/pill-logger-card.ts` | CSS `.next-dose-row` ~L1190-1192 | Delete rule |
| 4 | `src/pill-logger-card.ts` | CSS `.next-dose-row .next-dose` ~L1195-1197 | Delete rule |
| 5 | `src/pill-logger-card.ts` | CSS `.next-dose` ~L1199-1208 | Restyle: remove box, center, smaller font, non-bold |
| 6 | `src/pill-logger-card.ts` | CSS `.next-dose ha-icon` ~L1210-1213 | Change color to match text (`var(--secondary-text-color)`) |
| 7 | `src/pill-logger-card.ts` | CSS `.refill-btn` ~L1215-1231 | Remove `flex: 1`, add `width: 100%` |