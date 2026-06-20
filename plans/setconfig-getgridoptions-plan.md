# Plan — #10 setConfig throw + #11 numeric getGridOptions (HA contract)

## Finding #10 — `setConfig` does not throw on invalid config

### Current behavior
[`setConfig()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:131) silently stores config even when `device_id` is missing. [`render()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:1336) shows a friendly "Please select a device" fallback for any falsy `device_id` (both `undefined` and `''`).

### Problem
HA's contract: throw an `Error` from `setConfig` so HA renders an **error card** with the message. Silent fallback hides YAML misconfiguration from the user.

### The stub-config nuance
[`getStubConfig()`](../lovelace-pill-logger-card/src/pill-logger-card.ts:1723) returns `{ device_id: '', ... }`. HA calls `setConfig` with this stub when a card is first added in the visual editor (before the user configures it). If we throw on empty string, the card shows an error card instead of the friendly placeholder — bad UX for the visual editor flow.

### Fix
Distinguish between "key missing entirely" (YAML misconfiguration → throw) and "key present but empty" (stub → friendly placeholder):

```typescript
// After legacy chips migration, before storing config:
if (config.device_id == null) {  // catches undefined + null, NOT ''
  throw new Error('A device is required for the Pill Logger card.');
}
```

| Scenario | `config.device_id` | Before | After |
|---|---|---|---|
| YAML without `device_id` | `undefined` | Silent fallback | **Throws → error card** |
| YAML `device_id: null` | `null` | Silent fallback | **Throws → error card** |
| Visual editor stub | `''` | Friendly placeholder | Friendly placeholder (unchanged) |
| Normal configured card | real string | Normal render | Normal render (unchanged) |

### What does NOT change
- Legacy `chips[]` → `chip_N` migration still runs before the throw check
- The friendly placeholder in `render()` stays for the `device_id: ''` stub case
- Entity cache invalidation on device change
- Pane restore/reset logic (in `connectedCallback`)

---

## Finding #11 — `getGridOptions()` returns `rows: 'auto'` as a string

### Current behavior
```typescript
getGridOptions() {
  return {
    rows: 'auto',
    columns: 12,
  };
}
```

### Problem
HA docs show numeric `rows`/`min_rows`/`max_rows`/`columns`. `'auto'` is not the documented contract and can produce inconsistent section layouts.

### HA docs reference
> `rows`: Default number of rows the card takes. **Do not define this value** if you want your card to ignore the rows of the grid (not defined by default)

The original intent of `rows: 'auto'` was "let the card dictate its own height." The documented way to achieve this is to **omit `rows` entirely**.

### Fix
```typescript
getGridOptions() {
  return {
    columns: 12,
    min_rows: 4,
  };
}
```

- **`rows` omitted** → card ignores grid row snapping (auto-height, as originally intended — the documented behavior)
- **`min_rows: 4`** → ensures a reasonable minimum height in sections view (4 rows ≈ 248px, matching the smallest pane — daily at `getCardSize() = 5` ≈ 250px)
- **`columns: 12`** → full width (unchanged)

### Why not dynamic per-pane rows?
`getGridOptions` is called by HA's sections layout manager when the card is placed in the grid. Making it dynamic based on `_activePane` would cause layout shifts every time the user switches panes (daily↔graphs↔stats↔tools). The static approach with auto-height is better — the card grows/shrinks naturally with its content, and the grid accommodates it.

### What does NOT change
- Masonry view: `getGridOptions` is not used (only `getCardSize`) → zero impact
- `getCardSize()` dynamic sizing (5/6/7/8 per pane) → unchanged
- Sections view column span (12) → unchanged

---

## Functionality-preservation checklist

- [x] Visual editor "add card" flow: stub config (`device_id: ''`) → no throw → friendly placeholder renders
- [x] Visual editor config dialog: `device_id` has `required: true` in schema → user can't save without selecting → no throw
- [x] YAML with valid `device_id` → normal render (unchanged)
- [x] YAML without `device_id` → now throws (was: silent fallback) — **intended behavior change**
- [x] Legacy `chips[]` config → still migrated before throw check
- [x] Masonry view → `getGridOptions` not used → no impact
- [x] Sections view → auto-height preserved (documented "omit rows" replaces undocumented `'auto'`)
- [x] Pane switching → no grid layout shifts (static `getGridOptions`)

## Verification
- `yarn build` — clean compilation
- Grep: no `rows: 'auto'` remaining; `setConfig` has throw guard

## Files to modify
- `src/pill-logger-card.ts` — `setConfig()` (add throw guard), `getGridOptions()` (numeric fix)