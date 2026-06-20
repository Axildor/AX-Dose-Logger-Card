# Layout Restructure Plan — Pill Logger Card

## Overview
Six changes to the Daily pane layout and card configuration:
1. Full-width card by default
2. Two-column layout: Take Pill (left half) + Safe/Left stats (right half)
3. Next dose moved to directly under the pill name
4. Renamable chip titles via config (separate text field per chip in visual editor)
5. Strength displayed after medication name (auto-filtered: hidden when 0)
6. Medication name label override via config

---

## 1. Full-Width Default

**File:** `src/pill-logger-card.ts`

**Current** (`getGridOptions` at line 641):
```ts
columns: 6,
```

**Change to:**
```ts
columns: 12,
```

HA's section view uses a 12-column grid. `columns: 6` = half-width. `columns: 12` = full-width.

---

## 2. Two-Column Layout: Take Pill + Safe/Left

### Current HTML structure (lines 282-330):
```
med-name
take-pill-btn (full width)
stat-pills (row: Safe | Left)
next-dose
chips-row
```

### New HTML structure:
```
med-name (with strength suffix if non-zero)
next-dose
daily-main (flex row)
  +-- take-pill-btn (left half, flex: 1)
  +-- stats-column (right half, flex: 1, flex-direction: column)
       +-- stat-pill (Safe)
       +-- stat-pill (Left)
chips-row
```

### CSS changes:
- Add `.daily-main` — `display: flex; gap: 12px;`
- Add `.stats-column` — `display: flex; flex-direction: column; gap: 10px; flex: 1;`
- Modify `.take-pill-btn` — add `flex: 1;` so it fills the left half
- Modify `.stat-pill` — remove `flex: 1` (no longer in a row), ensure it fills the column width
- Remove `.stat-pills` class (replaced by `.stats-column`)

---

## 3. Next Dose Under Pill Name

Move the `next-dose` div above the two-column row, directly after `med-name`. No structural change beyond reordering in `_renderPane1()`.

---

## 4. Renamable Chip Titles

### Config interface changes:
Add to `PillLoggerCardConfig`:
```ts
chip_1_label?: string;
chip_2_label?: string;
chip_3_label?: string;
chip_4_label?: string;
```

### Editor schema changes (`getConfigForm`):
Add text selectors immediately after each chip entity selector, so each chip has a paired entity picker + label field:
```ts
{
  name: 'chip_1',
  selector: { entity: { context: { filter_device_id: 'device_id' } } },
},
{
  name: 'chip_1_label',
  selector: { text: {} },
},
{
  name: 'chip_2',
  selector: { entity: { context: { filter_device_id: 'device_id' } } },
},
{
  name: 'chip_2_label',
  selector: { text: {} },
},
// ... same pattern for chip_3 / chip_3_label and chip_4 / chip_4_label
```

This gives the visual editor a clear paired layout:
```
Device                          [device picker]
Show Amount in Body Graph       [toggle]
Name Override                   [text input]
Chip 1 (optional)              [entity picker]
Chip 1 Label                    [text input]
Chip 2 (optional)              [entity picker]
Chip 2 Label                    [text input]
Chip 3 (optional)              [entity picker]
Chip 3 Label                    [text input]
Chip 4 (optional)              [entity picker]
Chip 4 Label                    [text input]
```

### computeLabel additions:
```ts
name: 'Name Override',
chip_1_label: 'Chip 1 Label',
chip_2_label: 'Chip 2 Label',
chip_3_label: 'Chip 3 Label',
chip_4_label: 'Chip 4 Label',
```

### computeHelper additions:
- `name`: "Custom name for this medication. Leave empty to use the device name."
- `chip_N_label`: "Custom display name for this chip. Leave empty to use the entity's friendly name."

### Rendering changes:
Update `_getChipEntities()` to return objects with both entity ID and label:
```ts
private _getChipEntities(): Array<{ entityId: string; label?: string }> {
  const chips: Array<{ entityId: string; label?: string }> = [];
  for (const key of ['chip_1', 'chip_2', 'chip_3', 'chip_4'] as const) {
    const val = this.config?.[key];
    if (val) {
      const labelKey = `${key}_label` as keyof PillLoggerCardConfig;
      chips.push({ entityId: val, label: this.config?.[labelKey] as string | undefined });
    }
  }
  return chips;
}
```

Then in the template:
```ts
const chipName = chip.label 
  || this.hass?.states[chip.entityId]?.attributes?.friendly_name 
  || chip.entityId;
```

---

## 5. Strength After Medication Name (Auto-Filtered)

The card already resolves `entities.strength` from the backend (line 131). The display logic:

- If strength is `"0"`, `"0.0"`, `"unknown"`, `"unavailable"`, empty, or missing → show just the medication name
- Otherwise → show `"Medication Name - 10 mg"`

### Implementation in `_renderPane1()`:
```ts
private _getMedName(entities: ResolvedEntities): string {
  let name = this.config?.name || entities.medicationName;
  const strengthState = this._getState(entities.strength);
  const strengthNum = parseFloat(strengthState);
  if (entities.strength && !isNaN(strengthNum) && strengthNum !== 0
      && strengthState !== 'unknown' && strengthState !== 'unavailable') {
    name += ` - ${strengthState} mg`;
  }
  return name;
}
```

Then in the template:
```html
<div class="med-name">${this._getMedName(entities)}</div>
```

No toggle needed — the filter is automatic.

---

## 6. Medication Name Override

### Config interface addition:
```ts
name?: string;  // Override for the auto-detected device name
```

### Editor schema addition:
Add a text selector at the top (after `show_amount_in_body`):
```ts
{
  name: 'name',
  selector: { text: {} },
},
```

### Rendering:
Already handled in `_getMedName()` above — `this.config?.name` takes priority over `entities.medicationName`.

---

## Visual Comparison

### Before:
```
+----------------------------+
|      Medication Name       |
|                             |
|     +--------------+       |
|     |  Take Pill    |       |
|     |   2h 15m ago  |       |
|     +--------------+       |
|                             |
|  +------+  +------+       |
|  | Safe  |  | Left  |       |
|  |   2   |  |  45   |       |
|  +------+  +------+       |
|                             |
|  Next dose: Wait: 2h       |
|                             |
|  +-----+ +-----+          |
|  |Chip1| |Chip2|          |
|  +-----+ +-----+          |
+----------------------------+
```

### After:
```
+--------------------------------------+
|    Medication Name - 10 mg           |
|    Next dose: Wait: 2h               |
|                                       |
|  +--------------+  +------------+    |
|  |              |  | Safe: 2     |    |
|  |  Take Pill   |  |------------|    |
|  |  2h 15m ago  |  | Left: 45    |    |
|  |              |  +------------+    |
|  +--------------+                     |
|                                       |
|  +-----+ +-----+                   |
|  |Chip1| |Chip2|                   |
|  +-----+ +-----+                   |
+--------------------------------------+
```

When strength is 0 or unavailable, the header shows just "Medication Name" without the suffix.

---

## Implementation Checklist

- [ ] Update `PillLoggerCardConfig` — add `name`, `chip_1_label` through `chip_4_label`
- [ ] Update `getGridOptions()` — change `columns: 6` to `columns: 12`
- [ ] Add `_getMedName()` helper — config name override + strength suffix with auto-filter
- [ ] Update `_getChipEntities()` — return `{ entityId, label }` objects
- [ ] Restructure `_renderPane1()` — move next-dose under med-name, wrap Take Pill + stats in two-column row, use `_getMedName()` for header
- [ ] Update chip rendering to use custom labels with fallback to `friendly_name`
- [ ] Update CSS — add `.daily-main`, `.stats-column`, adjust `.take-pill-btn` and `.stat-pill`
- [ ] Update `getConfigForm()` — add `name` text selector, add `chip_N_label` text selectors paired after each entity selector
- [ ] Update `computeLabel` and `computeHelper` for new fields
- [ ] Update `getStubConfig()` if needed
- [ ] Build and verify
- [ ] Update memory-bank