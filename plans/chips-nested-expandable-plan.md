# Architecture Plan — Nested Chip Expandables (Third Config Layer)

## Objective

Restructure the **Custom Chips** configuration in both the Daily Panel and Drinks Panel from a flat list of `entity + label` grid rows into **nested collapsible menus** (Chip 1 / Chip 2 / Chip 3 / Chip 4), each containing the full override suite: entity, label, icon, tap/hold/double-tap actions — mirroring the Safe to Take Box / Pills Left Box / In Body Box / Disruption Box pattern.

Additionally:
- **Remove the "Chip 1 (optional)" label** above each entity selector (the nested expandable header "Chip 1" / "Chip 2" / ... now conveys identity — the redundant external label is no longer needed).
- **Render the chip icon** next to the name/value in the card UI (chips currently show only name + value; they gain a small icon, defaulting to a sensible per-chip default, overridable per chip).
- **Default tap action = more-info** on the chip entity (mirrors the Safe to Take Box default), overridable via a custom `chip_N_tap_action`.

## Current State

### Editor schema (layer 2 — flat grid rows inside one expandable)

```
Custom Chips (expandable, name: 'chips', flatten: true)
├── grid: chip_1 (entity) + chip_1_label (text)
├── grid: chip_2 (entity) + chip_2_label (text)
├── grid: chip_3 (entity) + chip_3_label (text)
└── grid: chip_4 (entity) + chip_4_label (text)
```

The Drinks panel mirrors this with `drink_chip_*`.

### Config fields (types.ts)

```
chip_1, chip_1_label, chip_2, chip_2_label, chip_3, chip_3_label, chip_4, chip_4_label
drink_chip_1, drink_chip_1_label, ... drink_chip_4_label
```

No icon, no tap/hold/double-tap action fields exist for chips today.

### Card render (daily-panel.ts / drinks-panel.ts)

Chips render as a horizontal row of name + value cards. No icon, no click handler, no actions wired.

### computeLabel suppression

The `computeLabel` callback currently returns `''` for all `chip_*` and `drink_chip_*` fields to suppress the "Chip N (optional)" external label (cell-height equalization in the 200px grid column). With the new nested expandable structure, the entity field is no longer in a 200px grid alongside a text field — it is a full-width field inside its own expandable — so the label suppression is no longer needed for height equalization. However, the user explicitly asked to **remove the "Chip 1" label above the entity selector**, so the suppression stays (now for a different reason: the expandable header "Chip 1" already identifies the slot).

## Target State

### Editor schema (layer 3 — nested expandables inside the chips expandable)

```
Custom Chips (expandable, name: 'chips', flatten: true)
├── expandable: Chip 1 (name: 'chip_1_box', flatten: true)
│   ├── chip_1 (entity, full-width — no external label)
│   ├── grid: chip_1_icon (icon) + chip_1_label (text)
│   ├── chip_1_tap_action (ui_action)
│   ├── chip_1_hold_action (ui_action)
│   └── chip_1_double_tap_action (ui_action)
├── expandable: Chip 2 (name: 'chip_2_box', flatten: true)
│   └── (same structure with chip_2_* fields)
├── expandable: Chip 3 (name: 'chip_3_box', flatten: true)
│   └── (same structure with chip_3_* fields)
└── expandable: Chip 4 (name: 'chip_4_box', flatten: true)
    └── (same structure with chip_4_* fields)
```

The Drinks panel mirrors this with `drink_chip_*_box` expandables and `drink_chip_*` fields.

### Key schema decisions

1. **`flatten: true` on the chip_N_box expandables** — mirrors the box expandables (safe_to_take_box, pills_left_box, in_body_box, disruption_box). The `flatten` option removes the inner padding/border so the fields sit cleanly inside the parent "Custom Chips" expandable without a double-border. The expandable header ("Chip 1") is still visible and clickable to collapse/expand.
2. **Entity field is full-width** (not in a grid) — the entity selector is the primary field and gets the full row width. The icon + label pair stays in a 200px grid (they are short fields that pair naturally). This differs from the current flat grid layout where entity + label were forced into a 200px grid together (causing the label-wrap height issue that the `computeLabel` suppression was working around).
3. **"Chip 1" label suppression stays** — the `computeLabel` callback continues to return `''` for `chip_1` / `chip_1_label` etc., but now the reason is: the expandable header "Chip 1" already identifies the slot, so the external label is redundant (user explicitly asked to remove it). The suppression also applies to the new `chip_N_icon` field (no visible label — the icon picker UI is self-explanatory).
4. **Expandable titles use localize keys** — `config.chip_1_box` = "Chip 1", `config.chip_2_box` = "Chip 2", etc. Same for `drink_chip_*_box`.

### New config fields (types.ts)

Add to `AxDoseLoggerCardConfig` after the existing chip fields:

```typescript
// Per-chip overrides (Daily panel)
chip_1_icon?: string;
chip_1_tap_action?: ActionConfig;
chip_1_hold_action?: ActionConfig;
chip_1_double_tap_action?: ActionConfig;
chip_2_icon?: string;
chip_2_tap_action?: ActionConfig;
chip_2_hold_action?: ActionConfig;
chip_2_double_tap_action?: ActionConfig;
chip_3_icon?: string;
chip_3_tap_action?: ActionConfig;
chip_3_hold_action?: ActionConfig;
chip_3_double_tap_action?: ActionConfig;
chip_4_icon?: string;
chip_4_tap_action?: ActionConfig;
chip_4_hold_action?: ActionConfig;
chip_4_double_tap_action?: ActionConfig;

// Per-chip overrides (Drinks panel)
drink_chip_1_icon?: string;
drink_chip_1_tap_action?: ActionConfig;
drink_chip_1_hold_action?: ActionConfig;
drink_chip_1_double_tap_action?: ActionConfig;
// ... drink_chip_2 through drink_chip_4 (same pattern)
```

### CardController interface + container methods (types.ts + ax-dose-logger-card.ts)

1. **Extend the chip entity shape** — `_getChipEntities()` and `_getDrinkChipEntities()` currently return `Array<{ entityId: string; label?: string }>`. Extend to:
   ```typescript
   { entityId: string; label?: string; icon?: string; tapAction?: ActionConfig; holdAction?: ActionConfig; doubleTapAction?: ActionConfig }
   ```
   Update `CardController.getChipEntities()` and `CardController.getDrinkChipEntities()` return types to match.

2. **New `handleChipAction(event, kind, chip)` method** — mirrors `handleSafeBoxAction` / `handlePillsLeftBoxAction`:
   - `kind: 'tap' | 'hold' | 'double_tap'`
   - If a custom `ActionConfig` is configured for the kind → `handleAction(...)` (HA standard fire-event path).
   - If no tap config → `_openMoreInfo(chip.entityId)` (more-info default, user-confirmed).
   - Hold / double-tap with no config → no-op (mirrors the box action handlers).
   - Separate `handleDrinkChipAction` method for the Drinks panel (mirrors the `handleInBodyBoxAction` / `handleDisruptionBoxAction` separation pattern — avoids regression risk on the working Daily chip path).

3. **`_relevantStateChanged` already watches chip entities** — no change needed; the entity IDs are already collected from `_getChipEntities()` / `_getDrinkChipEntities()`.

### Panel render (daily-panel.ts + drinks-panel.ts)

1. **Chip icon** — render a small `<ha-icon>` (or `<mwc-icon>`) next to / above the name-value, using:
   - `chip.icon` if configured
   - Fallback: the entity's domain default icon via `hass.states[entityId]?.attributes?.icon` or HA's `domainIcon()` helper if available, else `mdi:chip` (or `mdi:counter` — a neutral default).
   - The icon sits inside the `.chip` flexbox; the CSS adjusts to accommodate it (small icon, 16-18px, centered above or beside the name).

2. **Click / hold / double-tap wiring** — add `@click`, `@contextmenu` (hold), `@dblclick` handlers on the `.chip` element, calling `c.handleChipAction(e, 'tap', chip)` etc. Add `role="button"`, `tabindex="0"`, and `@keydown` (Enter/Space) for accessibility (mirrors the stat-pill clickable pattern).

3. **Cursor + hover** — add `cursor: pointer` and a hover background (subtle, mirrors `.stat-pill.clickable:hover`).

4. **CSS** — extend `.chip` to include an icon slot. The `.chips-row` flex layout stays the same. The chip gains `.clickable` variant CSS (or the click handlers are always present when an entity exists).

### Localize (localize.ts)

Add label keys:
- `config.chip_1_box` = "Chip 1", `config.chip_2_box` = "Chip 2", `config.chip_3_box` = "Chip 3", `config.chip_4_box` = "Chip 4"
- `config.chip_1_icon` = "Chip 1 Icon", ... `config.chip_4_icon` = "Chip 4 Icon"
- `config.chip_1_tap_action` = "Tap Action", ... (tap/hold/double-tap — can reuse the same "Tap Action" / "Hold Action" / "Double Tap Action" strings the box fields use)
- Same set for `drink_chip_*_box` and `drink_chip_*_icon`

Add helper keys:
- `config.helper.chip_1_box` ... `config.helper.chip_4_box` = "Show as a chip on the Daily pane." (or per-slot context)
- `config.helper.chip_icon` = "Override the chip icon. Leave empty for the entity default."
- `config.helper.chip_tap_action` = "Defaults to more-info on the entity."
- Same for `drink_chip_*`

### computeLabel / computeHelper updates (ax-dose-logger-editor.ts)

1. **computeLabel** — extend the chip field suppression to include the new `chip_N_icon` / `chip_N_tap_action` / `chip_N_hold_action` / `chip_N_double_tap_action` fields (return `''` for these — the expandable header identifies the slot). Same for `drink_chip_*`. Actually: the `ui_action` fields (`tap_action` etc.) may want a visible label ("Tap Action") to distinguish them inside the expandable — **decision: keep labels for the action fields** (they are full-width, not in a 200px grid, so the height-equalization issue doesn't apply; the label helps the user identify which action is which). Only suppress the entity + icon + label fields.
   - Suppress: `chip_N`, `chip_N_label`, `chip_N_icon`, `drink_chip_N`, `drink_chip_N_label`, `drink_chip_N_icon`
   - Keep: `chip_N_tap_action`, `chip_N_hold_action`, `chip_N_double_tap_action` (render "Tap Action" / "Hold Action" / "Double Tap Action")

2. **computeHelper** — extend the `chip_*` / `drink_chip_*` branches to cover the new icon + action fields:
   - `chip_N_icon` / `drink_chip_N_icon` → `config.helper.chip_icon`
   - `chip_N_tap_action` etc. → `config.helper.chip_tap_action` ("Defaults to more-info on the entity.")
   - `chip_N_hold_action` / `chip_N_double_tap_action` → existing generic action helper or a new `config.helper.chip_hold_action` / `config.helper.chip_double_tap_action`

3. **Container-name guard** — add `chip_1_box` ... `chip_4_box` and `drink_chip_1_box` ... `drink_chip_4_box` to the container-guard list in `computeHelper` (they are expandable containers with no helper text).

### README

Add new Configuration Options rows for the new fields:
- `chip_1_icon` ... `chip_4_icon` (and drink equivalents)
- `chip_1_tap_action` / `chip_1_hold_action` / `chip_1_double_tap_action` ... (and drink equivalents)

Update the visual editor description to mention the nested Chip 1–4 collapsables.

## Backward Compatibility

- Existing configs with only `chip_1` + `chip_1_label` (no icon/actions) continue to work — the new fields are all optional. The chip renders with the entity default icon and more-info default tap.
- The `setConfig` legacy `chips[]` array → `chip_N` migration (lines 154–164 of ax-dose-logger-card.ts) is untouched — it only maps the entity IDs, and the new icon/action fields default to undefined (no change needed).
- The `_getChipEntities()` return type extension is additive (new optional fields on the returned object) — panels that only read `entityId` / `label` are unaffected.

## File Impact Summary

| File | Change |
|------|--------|
| `src/types.ts` | Add 16 `chip_N_icon` + `chip_N_*_action` fields + 16 `drink_chip_N_icon` + `drink_chip_N_*_action` fields to `AxDoseLoggerCardConfig`. Extend `getChipEntities()` / `getDrinkChipEntities()` return type. Add `handleChipAction` / `handleDrinkChipAction` to `CardController`. |
| `src/ax-dose-logger-editor.ts` | Replace flat grid rows with nested `chip_N_box` / `drink_chip_N_box` expandables (entity + grid icon/label + 3 ui_action selectors). Update `computeLabel` suppression + `computeHelper` branches. |
| `src/ax-dose-logger-card.ts` | Extend `_getChipEntities()` / `_getDrinkChipEntities()` to include icon + 3 action configs. Add `_handleChipAction` + `_handleDrinkChipAction` private methods + public wrappers. |
| `src/components/daily-panel.ts` | Chip render: add icon, wire click/hold/double-tap, add cursor + hover CSS. |
| `src/components/drinks-panel.ts` | Same chip render changes as daily-panel (drink chips). |
| `src/localize.ts` | Add ~24 label keys + ~6 helper keys. |
| `README.md` | Add new config option rows; update visual editor description. |
| `dist/ax-dose-logger-card.js` | Rebuilt via `yarn run build`. |

No backend changes. No `projectstructure.md` change (no files added/renamed/deleted).

## Implementation Steps

1. **types.ts** — add the 32 new config fields (16 per panel: 4 icons + 12 actions) + extend the chip entity return types + add the 2 new `CardController` methods.
2. **ax-dose-logger-editor.ts** — replace the 4 flat grid rows in the `chips` expandable with 4 nested `chip_N_box` expandables (each: entity full-width → grid icon+label → 3 ui_action selectors). Same for `drink_chips` → `drink_chip_N_box`. Update `computeLabel` suppression list + `computeHelper` branches + container-guard list.
3. **localize.ts** — add label keys (`chip_1_box`..`chip_4_box`, `drink_chip_1_box`..`drink_chip_4_box`, `chip_N_icon` / `drink_chip_N_icon`) + action labels (reuse "Tap Action" / "Hold Action" / "Double Tap Action") + helper keys.
4. **ax-dose-logger-card.ts** — extend `_getChipEntities()` / `_getDrinkChipEntities()` to read icon + 3 action fields. Add `_handleChipAction` + `_handleDrinkChipAction` (custom action → handleAction; no tap → more-info; hold/double-tap no config → no-op). Add public wrappers.
5. **daily-panel.ts** — chip render: add `<ha-icon>` with default fallback, wire `@click` / `@contextmenu` / `@dblclick` + `@keydown`, add `role="button"` + `tabindex="0"` + cursor + hover CSS.
6. **drinks-panel.ts** — same chip render changes for drink chips.
7. **README.md** — add new config rows + update editor description.
8. **Build + verify** — `yarn run build`, confirm exit 0, no warnings.

## Mermaid — Editor Schema Hierarchy (Daily Panel, layer 3 nesting)

```mermaid
flowchart TD
    A["Daily Panel expandable"] --> B["Safe to Take Box expandable"]
    A --> C["Pills Left Box expandable"]
    A --> D["Custom Chips expandable"]
    D --> D1["Chip 1 expandable"]
    D --> D2["Chip 2 expandable"]
    D --> D3["Chip 3 expandable"]
    D --> D4["Chip 4 expandable"]
    D1 --> D1a["chip_1 entity selector"]
    D1 --> D1b["grid: chip_1_icon + chip_1_label"]
    D1 --> D1c["chip_1_tap_action ui_action"]
    D1 --> D1d["chip_1_hold_action ui_action"]
    D1 --> D1e["chip_1_double_tap_action ui_action"]
    D2 --> D2a["chip_2 entity selector"]
    D2 --> D2b["grid: chip_2_icon + chip_2_label"]
    D2 --> D2c["chip_2_tap_action ui_action"]
    D2 --> D2d["chip_2_hold_action ui_action"]
    D2 --> D2e["chip_2_double_tap_action ui_action"]