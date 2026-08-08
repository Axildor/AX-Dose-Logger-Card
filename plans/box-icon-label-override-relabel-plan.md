# Architecture Plan — Box Naming + Icon/Label Override Relabel (Daily + Drinks Tabs)

## Objective

Achieve full cross-tab naming consistency in the card's visual editor after the "Custom Chips → Custom Boxes" rename:

1. **Icon/Label override + entity-picker input boxes have wrong labels.** The Top Box and Bottom Box (Daily tab) still label their icon/label override pickers `Safe to Take Icon` / `Safe to Take Label` and `Pills Left Icon` / `Pills Left Label` — stale product names. The Drinks tab `In Body Box` / `Disruption Box` icon/label pickers have the same redundancy (`In Body Icon` / `In Body Label` / `Disruption Icon` / `Disruption Label`). All icon/label override pickers should become generic **`Override Icon`** / **`Override Label`** — the expandable header conveys which box. The **entity-picker fields** (`Safe to Take Entity`, `Pills Left Entity`, `In Body Entity`, `Disruption Entity`) carry the same stale product-name prefixes and are renamed to **`Override Entity`** across all four boxes for full consistency (user-confirmed). The Custom Boxes (both tabs) icon/label pickers are currently *label-suppressed* (no label renders), so the existing `Box N Icon` / `Box N Label` translation values never reach the user — un-suppress them.
2. **Drinks tab box headers → `Top Box` / `Bottom Box`.** Rename `In Body Box` → `Top Box` and `Disruption Box` → `Bottom Box` so both tabs use identical positional box naming. The inner fields (toggles/selectors/labels) carry the semantic meaning, mirroring the Daily tab decision where `Safe to Take Box` → `Top Box` already established this pattern.
3. **Bottom Box entity-override helper consistency.** Append **`Overridden by the Days Left toggle.`** to the Daily `pills_left_entity` helper so it matches the Top Box helper's `...Overridden by the Amount in body toggle.` wording.

## Scope

- Frontend only ([`/workspaces/lovelace-pill-logger-card/`](../../lovelace-pill-logger-card/)).
- Backend repo untouched. No coordinator / store / config-flow / types / schema changes.
- No config migration — internal config keys (`safe_to_take_icon`, `pills_left_icon`, `in_body_box`, `disruption_box`, `chip_1_icon`, …) unchanged; only translation *values*, two editor `title` literals, one `computeLabel` suppression block, and README prose change.
- **README updated** — the Drinks tab box rename is a user-facing UX change (editor headers + the visual-editor description + config-options table reference these box names).
- No `projectstructure.md` change — no files added/renamed/deleted.

## Out of Scope (deliberately unchanged)

1. **`Take Pill Icon` / `Take Pill Label`** and **`Log Drink Icon` / `Log Drink Label`** — top-level fields (not inside an expandable), so the prefix conveys necessary context. Correct as-is.
3. **Drinks `disruption_entity` helper** — already ends `...Overridden by the Time to Low selector.` (consistent; no change).
4. **Drinks `in_body_entity` helper** — no toggle overrides the In Body box, so no override-note append is needed (correct as-is).
5. **Internal config keys / CSS classes / TS identifiers** — untouched (mirrors the values-only rename precedent).

## Change Inventory

### File 1 — [`src/localize.ts`](src/localize.ts)

Translation *value* edits only; *keys* unchanged.

**Daily tab — Top Box + Bottom Box icon/label → generic:**

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.safe_to_take_icon` | 195 | `Safe to Take Icon` | `Override Icon` |
| `config.safe_to_take_label` | 194 | `Safe to Take Label` | `Override Label` |
| `config.pills_left_icon` | 201 | `Pills Left Icon` | `Override Icon` |
| `config.pills_left_label` | 200 | `Pills Left Label` | `Override Label` |

**Drinks tab — box headers → `Top Box` / `Bottom Box`:**

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.in_body_box` | 212 | `In Body Box` | `Top Box` |
| `config.disruption_box` | 219 | `Disruption Box` | `Bottom Box` |

**Drinks tab — In Body + Disruption icon/label → generic:**

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.in_body_icon` | 215 | `In Body Icon` | `Override Icon` |
| `config.in_body_label` | 214 | `In Body Label` | `Override Label` |
| `config.disruption_icon` | 223 | `Disruption Icon` | `Override Icon` |
| `config.disruption_label` | 222 | `Disruption Label` | `Override Label` |

**Daily tab — entity-picker → `Override Entity`:**

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.safe_to_take_entity` | 193 | `Safe to Take Entity` | `Override Entity` |
| `config.pills_left_entity` | 204 | `Pills Left Entity` | `Override Entity` |

**Daily tab — Bottom Box entity-override helper → append override note:**

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.helper.pills_left_entity` | 330 | `Any entity to show here. Leave empty for default.` | `Any entity to show here. Leave empty for default. Overridden by the Days Left toggle.` |

**Drinks tab — icon helper wording → match the "Icon on the box" pattern** (the Daily `safe_to_take_icon` helper already says "Icon on the box"; the Drinks `in_body_icon` helper still says "Icon on the In Body box"):

| Key | Line | Current value | New value |
|---|---|---|---|
| `config.helper.in_body_icon` | 341 | `Icon on the In Body box. Defaults to mdi:chart-bell-curve.` | `Icon on the box. Defaults to mdi:chart-bell-curve.` |

(`config.helper.disruption_icon` already says "Icon on the box" — no change. `config.helper.in_body_box` / `config.helper.disruption_box` are already generic — no change.)

**Custom Boxes icon/label values already exist** (`Box N Icon` / `Box N Label` at lines 277-298; drink equivalents at 233-254) — no localize edit needed; they render once un-suppressed in the editor step.

### File 2 — [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts)

**Box header literals (Drinks tab):**
- Line 592: `title: 'In Body Box'` → `title: 'Top Box'`
- Line 641: `title: 'Disruption Box'` → `title: 'Bottom Box'`

(The Daily tab `title: 'Top Box'` at line 246 and `title: 'Bottom Box'` at line 299 are already correct.)

**`computeLabel` (lines 1002-1020): un-suppress Custom Boxes icon/label fields.**

Drop the `*_icon` and `*_label` clauses from the chip + drink_chip suppression blocks so `chip_1_icon`, `chip_1_label`, `chip_2_icon`, `chip_2_label`, …, `drink_chip_4_icon`, `drink_chip_4_label` fall through to `localize(lang, 'config.' + schema.name)` and render `Box N Icon` / `Box N Label`. Keep the `chip_N` / `drink_chip_N` *entity-picker* fields suppressed (the `Box N (optional)` external label is redundant inside its own `Box N` expandable).

The chip block changes from:

```ts
if (
  schema.name === 'chip_1' || schema.name === 'chip_1_label' || schema.name === 'chip_1_icon' ||
  schema.name === 'chip_2' || schema.name === 'chip_2_label' || schema.name === 'chip_2_icon' ||
  schema.name === 'chip_3' || schema.name === 'chip_3_label' || schema.name === 'chip_3_icon' ||
  schema.name === 'chip_4' || schema.name === 'chip_4_label' || schema.name === 'chip_4_icon'
) {
  return '';
}
```

to:

```ts
if (
  schema.name === 'chip_1' || schema.name === 'chip_2' ||
  schema.name === 'chip_3' || schema.name === 'chip_4'
) {
  return '';
}
```

Same change for the `drink_chip_*` block (lines 1013-1020): drop `_icon`/`_label` clauses, keep `drink_chip_1` … `drink_chip_4`.

Update the two comment blocks (lines 991-1001 and 1010-1012) to reflect the new behaviour: icon/label override fields now render their `Box N Icon` / `Box N Label` labels; only the entity-picker external label stays suppressed.

### File 3 — [`README.md`](README.md)

Update Drinks-tab box-name references (the rename is a user-facing UX change):

- Line 83 (visual editor description): `Drinks Tab (Log Drink button, In Body Box, Disruption Box, Custom Boxes...)` → `Drinks Tab (Log Drink button, Top Box, Bottom Box, Custom Boxes...)`
- Line 155 (Drinks layout description): describes the *rendered* card labels (`In Body` on top, `Disruption` on bottom) — these are the rendered default labels, not editor headers, so **leave as-is**.
- Line 160: `The In Body Box and Disruption Box are each fully overridable via the visual editor's Drinks Tab expandable` → `The Drinks tab's Top Box and Bottom Box are each fully overridable via the visual editor's Drinks Tab expandable`
- Config-options table (lines 218-230): update the box-name references in descriptions while keeping the semantic context:
  - Line 218: `Any Home Assistant entity to display in the In Body box` → `Any Home Assistant entity to display in the Top Box (In Body)`. Default is the In Body sensor`
  - Line 219: `Icon for the In Body box` → `Override Icon for the Top Box (In Body)`
  - Line 220: `Label for the In Body box` → `Override Label for the Top Box (In Body)`
  - Line 221: `Action when the In Body box is tapped` → `Action when the Top Box (In Body) is tapped`
  - Line 222: `Action when the In Body box is long-pressed` → `Action when the Top Box (In Body) is long-pressed`
  - Line 223: `Action when the In Body box is double-tapped` → `Action when the Top Box (In Body) is double-tapped`
  - Line 224: `Display mode for the Disruption box` → `Display mode for the Bottom Box (Disruption)`
  - Line 225: `Any Home Assistant entity to display in the Disruption box` → `Any Home Assistant entity to display in the Bottom Box (Disruption). Default is the Sleep Disruption sensor`
  - Line 226: `Icon for the Disruption box` → `Override Icon for the Bottom Box (Disruption)`
  - Line 227: `Label for the Disruption box` → `Override Label for the Bottom Box (Disruption)`
  - Line 228: `Action when the Disruption box is tapped` → `Action when the Bottom Box (Disruption) is tapped`
  - Line 229: `Action when the Disruption box is long-pressed` → `Action when the Bottom Box (Disruption) is long-pressed`
  - Line 230: `Action when the Disruption box is double-tapped` → `Action when the Bottom Box (Disruption) is double-tapped`

**Daily tab config-options table** — also rename the icon/label/entity references to `Override *` for consistency (the editor labels and the README descriptions should match):

- Daily `safe_to_take_entity` row: `Any Home Assistant entity to display in the Top Box (Safe to Take)` → add `. Default is the Safe to Take sensor` suffix
- Daily `safe_to_take_icon` row: `Icon for the Top Box (Safe to Take)` → `Override Icon for the Top Box (Safe to Take)`
- Daily `safe_to_take_label` row: `Label for the Top Box (Safe to Take)` → `Override Label for the Top Box (Safe to Take)`
- Daily `pills_left_entity` row: `Any Home Assistant entity to display in the Bottom Box (Pills Left)` → add `. Default is the Pills Left number entity` suffix
- Daily `pills_left_icon` row: `Icon for the Bottom Box (Pills Left)` → `Override Icon for the Bottom Box (Pills Left)`
- Daily `pills_left_label` row: `Label for the Bottom Box (Pills Left)` → `Override Label for the Bottom Box (Pills Left)`

The parenthetical `(In Body)` / `(Disruption)` retains the semantic meaning since the config keys (`in_body_*` / `disruption_*`) are unchanged and the rendered default labels are still "In Body" / "Disruption".

### File 4 — [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)

Rebuilt via `yarn run build` (not hand-edited).

## Steps

1. [`src/localize.ts`](src/localize.ts) — eleven translation-value edits per the tables above (4 Daily icon/label + 2 Drinks box headers + 4 Drinks icon/label + 1 Daily helper append + 1 Drinks icon-helper wording).
2. [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — two `title` literal edits (Drinks Top/Bottom Box) + drop `_icon`/`_label` clauses from the chip and drink_chip `computeLabel` suppression blocks + update the two comment blocks.
3. [`README.md`](README.md) — update Drinks-tab box-name references (line 83, line 160, config-options table lines 218-230) per the inventory above.
4. `cd /workspaces/lovelace-pill-logger-card && yarn run build` — verify clean exit 0.
5. Dist grep confirms: `Override Icon` and `Override Label` present (≥4 each across both tabs), `Box 1 Icon`..`Box 4 Icon` present, `Overridden by the Days Left toggle.` present, no remaining `In Body Box` / `Disruption Box` / `Safe to Take Icon` / `Pills Left Icon` literals in user-facing strings.
6. Update frontend memory-bank: [`memory-bank/activeContext.md`](memory-bank/activeContext.md) (new Current Status, archive previous per truncation rule) + [`memory-bank/progress.md`](memory-bank/progress.md) (new section). No `projectstructure.md` change. Backend repo untouched.

## Key Design Decisions

1. **Generic `Override Icon` / `Override Label`, not `Top Box Icon` / `Bottom Box Icon`** — the expandable header (`Top Box` / `Bottom Box`) already conveys which box the override applies to; repeating the box name in the field label is redundant. `Override Icon` / `Override Label` reads naturally and is the established HA visual-editor convention. User-confirmed.
2. **Drinks tab boxes → `Top Box` / `Bottom Box`** — the Drinks tab two-box layout already conceptually uses "Top"/"Bottom" (see [`drinks-panel.ts`](src/components/drinks-panel.ts) comment lines 14-15: `Top "In Body"` / `Bottom "Sleep Disruption"`). The Daily tab already made this trade-off (`Safe to Take Box` → `Top Box`); the inner toggle/select/label fields carry the semantic meaning. Cross-tab positional naming consistency is the user's stated goal.
3. **Custom Boxes: un-suppress, don't rename to `Override Icon`** — the `Box N Icon` / `Box N Label` values already exist from the chips→boxes rename; they were just never reaching the user because `computeLabel` returned `''`. Un-suppressing is a one-line-per-block editor change with zero localize edit, and the rendered labels (`Box 1 Icon` etc.) match the expandable header (`Box 1`) for clear per-box identity — no need for generic `Override Icon` here because the Custom Boxes don't have a product-name legacy to erase and the `Box N` prefix gives the per-box context the Top/Bottom boxes get from their expandable headers. User-confirmed.
4. **Entity-picker stays suppressed in Custom Boxes** — the `Box N (optional)` external label is redundant inside its own `Box N` expandable (the established rationale). Only the icon/label override fields un-suppress.
5. **Entity-picker renamed to `Override Entity`** (user-confirmed) — the four entity-picker fields (`Safe to Take Entity`, `Pills Left Entity`, `In Body Entity`, `Disruption Entity`) all become `Override Entity` for full consistency with the `Override Icon` / `Override Label` siblings. The default-sensor semantic is retained via the helper text (which still names the default sensor per box) and the README config-table descriptions (which keep the `(Safe to Take)` / `(Pills Left)` / `(In Body)` / `(Disruption)` parenthetical and add a default-sensor suffix).
6. **`Overridden by the Days Left toggle.` mirrors the Top Box helper** — `config.helper.safe_to_take_entity` ends `...Overridden by the Amount in body toggle.` because the toggle overrides any custom entity. The Bottom Box has the same relationship (Days-Left toggle overrides any custom `pills_left_entity`), so the parallel wording is the consistency fix. The Drinks `disruption_entity` helper already has the parallel `...Overridden by the Time to Low selector.` — no change.
7. **README uses `Top Box (In Body)` / `Bottom Box (Disruption)` parentheticals** — the editor headers change to positional names, but the config keys (`in_body_*` / `disruption_*`) and the rendered default labels ("In Body" / "Disruption") are unchanged. The parenthetical retains the semantic mapping so a user cross-referencing the README config table with the editor or the rendered card isn't confused.
8. **No backend change** — the feature is entirely frontend (editor labels + helper text + README). The backend has no "icon" / "label override" concept; those are card-config-only fields.
9. **No `projectstructure.md` change** — no files added/renamed/deleted; only edits to existing files.

## Verification

- `yarn run build` — clean (exit 0, no warnings, `dist/ax-dose-logger-card.js` rebuilt).
- Dist grep: `Override Icon` (≥4), `Override Label` (≥4), `Box 1 Icon`..`Box 4 Icon`, `Overridden by the Days Left toggle.` all present; `In Body Box`, `Disruption Box`, `Safe to Take Icon`, `Pills Left Icon`, `Safe to Take Label`, `Pills Left Label` absent from user-facing strings.
- No backend / coordinator / store / config-flow / types / projectstructure changes.