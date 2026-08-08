# Architecture Plan — Custom "Chips" → "Boxes" Naming Convention

## Objective

Rename the user-facing **"Custom Chips"** feature naming convention to **"Custom Boxes"** in the card's visual editor (Daily tab + Drinks tab settings), so the editor labels match what actually renders. The custom-chip entities (`chip_1`..`chip_4`, `drink_chip_1`..`drink_chip_4`) render as box-style tiles (primary-tinted background, uppercase label, column layout — the same visual language as the Graphs-panel Day Avg Boxes), not small pill-style chips. The current "Chip N" / "Custom Chips" labels contradict the rendered output and violate user expectation.

This applies to **both** the Daily tab and the Drinks tab (user-confirmed) — both render identically as boxes, and the [`daily-panel.ts`](src/components/daily-panel.ts:422) / [`drinks-panel.ts`](src/components/drinks-panel.ts:422) `.chip` CSS comments both state "match the Graph panel Day Avg Boxes format".

## Out of Scope (deliberately unchanged)

1. **Graphs-panel timeframe chips** (`.timeframe-chip` in [`graphs-panel.ts`](src/components/graphs-panel.ts:882)) — these genuinely render as small pill-style buttons (48H / 7D / 14D / 30D selectors), so "chip" is accurate. They have no user-facing config label anyway.
2. **Effectiveness tracker chips** (`.eff-tracker-chip` in [`graphs-panel.ts`](src/components/graphs-panel.ts:1047)) — same rationale; small toggle pills, no config label.
3. **Internal config keys / schema `name` fields** (`chip_1`, `chips`, `drink_chips`, `chip_1_box`, `drink_chip_1_box`, etc.) — left untouched so existing saved configs keep working with **zero migration**, mirroring the ["Panel/pane → Tab/tab"](plans/unify-category-naming-plan.md) precedent where only translation *values* changed. The schema `name` fields are internal persistence identifiers invisible to end users.
4. **Internal CSS class names** (`.chip`, `.chips-row`, `.chip-name`, `.chip-value`, `.chip-icon`, `.with-icon`) — left untouched. Renaming CSS classes is a broad no-user-benefit refactor; they are invisible to consumers. Mirrors the precedent of leaving internal identifiers (`_activePane`, `pane-btn`, `*-panel.ts`) untouched in the Panel→Tab rename.
5. **Internal TypeScript identifiers** (`ChipConfig` interface, `_getChipEntities()`, `handleChipAction`, `_handleDrinkChipAction`, `getDrinkChipEntities`, etc.) — left untouched. Internal API surface; renaming would be a broad refactor with no user benefit and regression risk.
6. **Internal code comments** mentioning "chip" — largely left as-is (they reference the unchanged config keys / CSS classes / identifiers). Only the most prominent user-facing-facing comment lines that describe the *feature* in editor-facing terms may be lightly updated for consistency; this is optional polish, not a functional requirement.

## Precedent

This is a **frontend strings-only rename**, exactly parallel to the completed ["Unify Card Settings Category Naming — Panel/pane → Tab/tab"](plans/unify-category-naming-plan.md) task:
- Only translation *values* change; *keys* unchanged → no lookup regressions.
- Only user-facing `title` literals on expandables change; schema `name` fields unchanged → existing configs keep working.
- README consumer-facing prose + config-options table updated.
- No backend / coordinator / store / config-flow / types changes.
- `projectstructure.md` unchanged (no files added/renamed/deleted).

## Change Inventory

### File 1 — [`src/localize.ts`](src/localize.ts)

All changes are to translation *values*; *keys* unchanged.

**Daily tab chips (lines 268–303, 358–365):**
| Key | Current value | New value |
|---|---|---|
| `config.chips` (268) | `Custom Chips` | `Custom Boxes` |
| `config.chip_1_box` (270) | `Chip 1` | `Box 1` |
| `config.chip_2_box` (271) | `Chip 2` | `Box 2` |
| `config.chip_3_box` (272) | `Chip 3` | `Box 3` |
| `config.chip_4_box` (273) | `Chip 4` | `Box 4` |
| `config.chip_1` (276) | `Chip 1 (optional)` | `Box 1 (optional)` |
| `config.chip_1_label` (277) | `Chip 1 Label` | `Box 1 Label` |
| `config.chip_1_icon` (278) | `Chip 1 Icon` | `Box 1 Icon` |
| `config.chip_2` … `config.chip_4` (283–297) | `Chip N (optional)` | `Box N (optional)` |
| `config.chip_2_label` … `config.chip_4_label` (284–298) | `Chip N Label` | `Box N Label` |
| `config.chip_2_icon` … `config.chip_4_icon` (285–299) | `Chip N Icon` | `Box N Icon` |
| `config.helper.chip` (359) | `Show as a chip on the Daily tab.` | `Show as a box on the Daily tab.` |
| `config.helper.chip_icon` (361) | `Override the chip icon. Leave empty for the entity's default icon.` | `Override the box icon. Leave empty for the entity's default icon.` |
| `config.helper.chip_show_icon` (362) | `Display an icon on this chip. Off by default. When on, the chip box grows taller to fit the icon above the label — useful to make chips larger for a button-like layout.` | `Display an icon on this box. Off by default. When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout.` |

Unchanged (already generic — no "chip" word): `config.chip_N_show_icon` (`Show Icon`), `config.chip_N_tap_action` (`Tap Action`), `config.chip_N_hold_action` (`Hold Action`), `config.chip_N_double_tap_action` (`Double Tap Action`), `config.helper.chip_label` (`Leave empty to use the entity's name.`), `config.helper.chip_tap_action`, `config.helper.chip_hold_action`, `config.helper.chip_double_tap_action`.

**Drinks tab chips (lines 230–259, 353–355):**
| Key | Current value | New value |
|---|---|---|
| `config.drink_chips` (230) | `Custom Chips` | `Custom Boxes` |
| `config.drink_chip_1` (232) | `Chip 1 (optional)` | `Box 1 (optional)` |
| `config.drink_chip_1_label` (233) | `Chip 1 Label` | `Box 1 Label` |
| `config.drink_chip_1_icon` (234) | `Chip 1 Icon` | `Box 1 Icon` |
| `config.drink_chip_2` … `config.drink_chip_4` (239–253) | `Chip N (optional)` | `Box N (optional)` |
| `config.drink_chip_2_label` … `config.drink_chip_4_label` (240–254) | `Chip N Label` | `Box N Label` |
| `config.drink_chip_2_icon` … `config.drink_chip_4_icon` (241–255) | `Chip N Icon` | `Box N Icon` |
| `config.helper.drink_chips` (353) | `Show as a chip on the Drinks tab.` | `Show as a box on the Drinks tab.` |
| `config.helper.drink_chip` (354) | `Show as a chip on the Drinks tab.` | `Show as a box on the Drinks tab.` |

Unchanged (generic): `config.drink_chip_N_show_icon`, action labels, `config.helper.drink_chip_label`.

Note: the `drink_chip_N_box` expandable titles reuse `config.chip_N_box` (see comment line 231), so they automatically become "Box N" once the `config.chip_N_box` values change.

### File 2 — [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts)

Only user-facing `title` literals change; schema `name` fields unchanged.

- Line 352: `title: 'Custom Chips'` (the `chips` expandable in the Daily tab) → `title: 'Custom Boxes'`
- Line 702: `title: 'Custom Chips'` (the `drink_chips` expandable in the Drinks tab) → `title: 'Custom Boxes'`

Note: per the established pattern (documented in activeContext key decision #10 of the Top Box task), editor expandable `title` is a literal string, not a localize key. The localize keys are updated for documentation/parity but are not read by the expandable headers. So these two literal `title` edits are the user-visible change; the localize value edits are for consistency / future-proofing.

### File 3 — [`README.md`](README.md)

Update consumer-facing "chip" references that describe the Custom Chips feature. Lines to update:

- Line 7 (screenshot comment): `custom chips` → `custom boxes`
- Line 81: `custom chips, graph options` → `custom boxes, graph options`
- Line 83: `Custom Chips with per-chip collapsable menus` → `Custom Boxes with per-box collapsable menus` (×2 — Daily + Drinks)
- Line 105: `Custom chips for any related entities — each chip has its own collapsable menu in the visual editor with entity, icon, label, and tap/hold/double-tap actions. Tapping a chip defaults to more-info on its entity` → reword to use "box"/"boxes"
- Line 161: `custom chips (separate from the Daily tab's chips)` + `Each chip has its own collapsable menu... Tapping a chip defaults to more-info on its entity` → reword to use "box"/"boxes"
- Config options table (lines 231–251): descriptions mentioning "chip" → "box":
  - Line 231: `Custom chips shown on the Drinks tab... Up to 4 entities, each in its own collapsable menu` → `Custom boxes shown on the Drinks tab...`
  - Line 232: `Optional label for each Drinks-tab chip` → `...Drinks-tab box`
  - Line 233: `Optional icon for each Drinks-tab chip` → `...Drinks-tab box`
  - Line 234: `Show an icon on each Drinks-tab chip. Off by default (clean label-over-value tile matching the Graph tab Day Avg Boxes). When on, the chip box grows taller to fit the icon above the label — useful to make chips larger for a button-like layout` → reword to `Show an icon on each Drinks-tab box. Off by default (clean label-over-value tile matching the Graph tab Day Avg Boxes). When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout`
  - Line 235: `Tap action for each Drinks-tab chip` → `...Drinks-tab box`
  - Line 236: `Hold (long-press) action for each Drinks-tab chip` → `...Drinks-tab box`
  - Line 237: `Double-tap action for each Drinks-tab chip` → `...Drinks-tab box`
  - Line 245: `Entity IDs for custom chips in the Daily tab. Each chip has its own collapsable menu` → `Entity IDs for custom boxes in the Daily tab. Each box has its own collapsable menu`
  - Line 246: `Custom labels for the corresponding chips` → `...corresponding boxes`
  - Line 247: `Optional icon for each chip` → `...each box`
  - Line 248: `Show an icon on each chip. Off by default (clean label-over-value tile matching the Graph tab Day Avg Boxes). When on, the chip box grows taller... useful to make chips larger for a button-like layout` → reword to box terminology
  - Line 249: `Tap action for each chip` → `...each box`
  - Line 250: `Hold (long-press) action for each chip` → `...each box`
  - Line 251: `Double-tap action for each chip` → `...each box`

### File 4 — [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)

Rebuilt via `yarn run build` (not hand-edited).

## Steps

1. [`src/localize.ts`](src/localize.ts) — update the Daily-tab + Drinks-tab chip translation *values* (keys unchanged) per the tables above. Leave generic action/show_icon/label-helper values untouched.
2. [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) — change the two `title: 'Custom Chips'` literals (Daily `chips` expandable line 352, Drinks `drink_chips` expandable line 702) → `'Custom Boxes'`.
3. [`README.md`](README.md) — update consumer-facing "chip" references describing the Custom Chips feature (screenshot comment, Quick Start, Visual Editor description, Daily/Drinks Features bullets, config-options table rows) per the inventory above.
4. `yarn run build` from `/workspaces/lovelace-pill-logger-card` — verify clean exit 0, no warnings.
5. Dist grep confirms: `Custom Boxes` (≥2 occurrences), `Box 1`/`Box 2`/`Box 3`/`Box 4` present, `Show as a box on the Daily tab` + `Show as a box on the Drinks tab` present, no remaining `Custom Chips` literal in user-facing strings.
6. Update memory-bank: `activeContext.md` (new Current Status, archive previous per truncation rule) + `progress.md` (new section). No `projectstructure.md` change (no files added/renamed/deleted). Backend repo untouched (frontend-only change).

## Key Design Decisions

1. **Values-only rename, keys untouched** — exactly mirrors the ["Panel/pane → Tab/tab"](plans/unify-category-naming-plan.md) precedent. Internal config keys (`chip_1`, `chips`, `drink_chips`, `chip_1_box`) are persistence identifiers invisible to end users; changing them would force a config migration with no user benefit. The user's goal is editor-UI expectation matching, which is purely a translation-value concern.
2. **Graphs-panel timeframe chips + effectiveness tracker chips stay "chips"** — those genuinely render as small pill-style buttons and have no user-facing config label, so they are out of scope. The user's request is specifically about the "Custom Chips" feature that renders as boxes.
3. **Internal CSS class names + TS identifiers untouched** — `.chip`, `ChipConfig`, `_getChipEntities()`, `handleChipAction`, etc. are internal API surface; renaming is a broad no-user-benefit refactor with regression risk. Same principle as the Panel→Tab rename leaving `_activePane`, `pane-btn`, `*-panel.ts` untouched.
4. **`config.chip_N_show_icon` / action labels stay generic** — these values (`Show Icon`, `Tap Action`, `Hold Action`, `Double Tap Action`) contain no "chip" word, so they need no change. This keeps the diff minimal and avoids touching strings that are already correct.
5. **Both tabs renamed together** — user-confirmed. Both Daily and Drinks custom-chip features render identically as boxes; renaming only one would leave an inconsistency across the card.
6. **Editor `title` is a literal, not a localize key** — per the established pattern (Top Box key decision #10). The two `title: 'Custom Chips'` literal edits are the user-visible change; the localize `config.chips` / `config.drink_chips` value edits are for consistency/future-proofing (not read by the expandable headers, but read by `computeLabel` if it ever falls back, and documented in the localize file).
7. **No backend change** — the feature is entirely frontend (editor labels + README). The backend has no "chip" concept. Frontend-only, like the Panel→Tab rename.
8. **No `projectstructure.md` change** — no files added/renamed/deleted; only edits to existing files.

## Verification

- `yarn run build` — clean (exit 0, no warnings, `dist/ax-dose-logger-card.js` created).
- Dist grep: `Custom Boxes` (≥2), `Box 1`..`Box 4`, `Show as a box on the Daily tab`, `Show as a box on the Drinks tab`, no `Custom Chips` literal remaining in user-facing strings.
- No backend / coordinator / store / config-flow / types / projectstructure changes.