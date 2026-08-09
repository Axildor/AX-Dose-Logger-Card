# Button Submenu Optimization Plan

**Date:** 2026-08-09  
**Scope:** Frontend only ([`lovelace-pill-logger-card`](../lovelace-pill-logger-card)) — no backend changes.  
**Files:** [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts), [`src/localize.ts`](src/localize.ts), [`README.md`](README.md).

---

## 1. Problem Summary

The **Button** submenu inside the Daily Tab and Drinks Tab of the visual card editor has four issues:

| # | Issue | Root cause |
|---|-------|------------|
| A | **Labels are unclear** — "Lockout Style", "Execution Requested Style", "Latency Warning Style", "Logged Style" use internal state-machine jargon instead of user-facing language. | [`localize.ts`](src/localize.ts) labels were written from the developer's state-machine perspective, not the patient's perspective. |
| B | **"Logged Style" and "Rotating Glow Speed" render as 3 stacked selectors** instead of 1 dropdown box. | The `select` selectors for `take_button_ack_layout`, `take_button_glow_speed`, `drink_button_ack_layout`, `drink_button_glow_speed` have **3 options** and no `mode: 'dropdown'`. HA's `ha-selector-select` auto-selects **LIST mode** (stacked radio buttons) when a select has ≤3 options and no explicit `mode`. The 7-option style selects (`_buttonStyleOptions()`) auto-select DROPDOWN because >3 options triggers the dropdown fallback. |
| C | **No visual breaks between aspects** — it is unclear at a glance whether a tickbox pairs with the selector above or below it. | The 9 Daily fields (5 selects + 3 booleans + 1 number) are a flat list inside one expandable. Each state's style select + its pulse toggle are adjacent but not visually grouped. |
| D | **Defaults don't show in the editor** — e.g. "Logged Animation Duration" is blank (doesn't say 3000ms), toggles don't reflect their default ON/OFF state. | No `default:` property on the button submenu schema fields. `ha-form` renders an empty/unset control when `default` is absent and the stored config value is `undefined`. The runtime `?? <default>` fallbacks in [`daily-panel.ts`](src/components/daily-panel.ts) and [`drinks-panel.ts`](src/components/drinks-panel.ts) work correctly, but the editor visual doesn't match. |

---

## 2. Solution Design

### 2.1 Label Renames (Issue A)

Pure [`localize.ts`](src/localize.ts) string changes — no config-key renames, no migration, no type changes. The config keys (`take_button_lockout_style`, `take_button_execution_style`, etc.) stay identical; only the user-facing label text changes.

| Config key (unchanged) | Old label | New label |
|------------------------|-----------|-----------|
| `take_button_lockout_style` / `drink_button_lockout_style` | Lockout Style | **Limit Reached Style** |
| `take_button_execution_style` | Execution Requested Style | **Take Pill Style** |
| `take_button_latency_style` | Latency Warning Style | **Overdue Warning Style** |
| `take_button_ack_layout` / `drink_button_ack_layout` | Logged Style | **Logged Dose Indicator Style** |

The helper strings in [`localize.ts`](src/localize.ts) (`config.helper.take_button_*`) are also updated to use the new terminology (e.g. "Visual style when the daily limit is reached" → stays the same conceptually, but references the new label name where applicable).

The `config.take_button_lockout_pulse` / `execution_pulse` / `latency_pulse` labels also update:
- "Lockout Icon Pulse" → **"Limit Reached Icon Pulse"**
- "Execution Requested Icon Pulse" → **"Take Pill Icon Pulse"**
- "Latency Warning Icon Pulse" → **"Overdue Warning Icon Pulse"**

### 2.2 Dropdown Mode Fix (Issue B)

Add `mode: 'dropdown'` to **every** `select` selector in the Button submenu. This forces the dropdown rendering regardless of option count, so the 3-option selects (`_ackLayoutOptions()`, `_glowSpeedOptions()`) render as a single dropdown box instead of 3 stacked radio buttons.

Applied to these select selectors in [`ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts):

**Daily (`take_button_box`):**
- `take_button_lockout_style`
- `take_button_execution_style`
- `take_button_latency_style`
- `take_button_ack_layout`
- `take_button_glow_speed`

**Drinks (`drink_button_box`):**
- `drink_button_lockout_style`
- `drink_button_ack_layout`
- `drink_button_glow_speed`

Each `selector: { select: { options: ... } }` becomes `selector: { select: { options: ..., mode: 'dropdown' } }`.

This is the HA best-practice approach — the HA Core codebase explicitly sets `mode: SelectSelectorMode.DROPDOWN` on select selectors that should render as dropdowns regardless of option count (hundreds of examples in [`/usr/src/homeassistant/homeassistant/components/`](../../usr/src/homeassistant/homeassistant/components/)).

### 2.3 Visual Grouping (Issue C)

**User decision (Option A):** keep the Button submenu a **flat list** — no nested expandables (3x nesting was rejected as more confusing than helpful). Each aspect's style dropdown + its pulse toggle are paired **side-by-side in a grid row** inside the Button expandable. The grid pairing makes it visually obvious which toggle belongs to which dropdown — resolving the "unclear if a tickbox pairs with the selector above or below it" complaint without the cognitive overhead of nested collapsibles.

**Daily Tab — Button submenu structure (2x nesting only: Button → grids):**

```
Button (expandable, flatten)
├── grid: [Limit Reached Style ▾]      [Limit Reached Icon Pulse ☐]
├── grid: [Take Pill Style ▾]          [Take Pill Icon Pulse ☐]
├── grid: [Overdue Warning Style ▾]    [Overdue Warning Icon Pulse ☐]
├── grid: [Logged Dose Indicator Style ▾] [Logged Animation Duration (ms) ___]
└── [Rotating Glow Speed ▾]
```

**Drinks Tab — Button submenu structure:**

```
Button (expandable, flatten)
├── grid: [Limit Reached Style ▾]      [Limit Reached Icon Pulse ☐]
├── grid: [Logged Dose Indicator Style ▾] [Logged Animation Duration (ms) ___]
└── [Rotating Glow Speed ▾]
```

The label names themselves (Limit Reached Style, Take Pill Style, Overdue Warning Style, Logged Dose Indicator Style, Rotating Glow Speed) convey the aspect identity — no section titles needed. The aspect boundary is implicit in the grid-row grouping (each dropdown + its paired control form one visual unit).

### 2.4 Default Value Alignment (Issue D)

Add `default: <value>` to **every** button submenu field in the schema so `ha-form` pre-populates the control with the default when the stored config value is `undefined`. This makes the editor visual match the runtime `?? <default>` fallbacks in [`daily-panel.ts`](src/components/daily-panel.ts:60) and [`drinks-panel.ts`](src/components/drinks-panel.ts:56).

| Field | Default | Runtime fallback location |
|-------|---------|--------------------------|
| `take_button_lockout_style` | `'full'` | [`daily-panel.ts:61`](src/components/daily-panel.ts:61) |
| `take_button_lockout_pulse` | `false` | [`daily-panel.ts:62`](src/components/daily-panel.ts:62) |
| `take_button_execution_style` | `'icon'` | [`daily-panel.ts:64`](src/components/daily-panel.ts:64) |
| `take_button_execution_pulse` | `false` | [`daily-panel.ts:65`](src/components/daily-panel.ts:65) |
| `take_button_latency_style` | `'icon_border'` | [`daily-panel.ts:67`](src/components/daily-panel.ts:67) |
| `take_button_latency_pulse` | `true` | [`daily-panel.ts:68`](src/components/daily-panel.ts:68) |
| `take_button_ack_layout` | `'top'` | [`daily-panel.ts:103`](src/components/daily-panel.ts:103) |
| `take_button_ack_duration_ms` | `3000` | [`ax-dose-logger-card.ts:831`](src/ax-dose-logger-card.ts:831) |
| `take_button_glow_speed` | `'fast'` | [`daily-panel.ts:96`](src/components/daily-panel.ts:96) |
| `drink_button_lockout_style` | `'full'` | [`drinks-panel.ts:57`](src/components/drinks-panel.ts:57) |
| `drink_button_lockout_pulse` | `false` | [`drinks-panel.ts:58`](src/components/drinks-panel.ts:58) |
| `drink_button_ack_layout` | `'top'` | [`drinks-panel.ts:88`](src/components/drinks-panel.ts:88) |
| `drink_button_ack_duration_ms` | `3000` | [`ax-dose-logger-card.ts:845`](src/ax-dose-logger-card.ts:845) |
| `drink_button_glow_speed` | `'fast'` | [`drinks-panel.ts:81`](src/components/drinks-panel.ts:81) |

**Behavioral note:** when `default` is set and the user saves without changing the field, the default value gets persisted into the config JSON. The runtime `?? <default>` fallbacks still work identically (they only fire when the value is `undefined`). Existing configs with explicit values are unaffected. New configs / configs where the user never touched the button submenu will now show the defaults visually and persist them on save. This is the same pattern already used for `show_amount_in_body` (`default: true`), `show_day_avg_boxes` (`default: true`), and `confirm_tool_actions` (`default: true`) in the existing schema.

---

## 3. Files to Modify

| File | Changes |
|------|---------|
| [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts) | (1) Add `mode: 'dropdown'` to all 8 select selectors in `take_button_box` + `drink_button_box`. (2) Add `default: ...` to all 14 button submenu fields. (3) Restructure the flat field list into nested flatten-expandables per aspect (5 for Daily, 3 for Drinks), each containing a grid that pairs the style dropdown + pulse toggle side-by-side. |
| [`src/localize.ts`](src/localize.ts) | Rename 4 style labels + 3 pulse labels (§2.1). Update the corresponding helper strings to reference the new terminology. Add new `config.` keys for the inner expandable titles (`config.button_section_limit_reached`, `config.button_section_take_pill`, `config.button_section_overdue_warning`, `config.button_section_logged_indicator`, `config.button_section_rotating_glow`). |
| [`README.md`](README.md) | Update the Button State Matrix section: rename "Execution Requested" → "Take Pill", "Latency Warning" → "Overdue Warning", "Lockout" → "Limit Reached" in the table + prose. Update the "Logged Style" → "Logged Dose Indicator" reference. Note the dropdown rendering + default-population improvements. |

**No changes to:** [`src/types.ts`](src/types.ts) (config keys unchanged), [`src/components/daily-panel.ts`](src/components/daily-panel.ts) or [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) (runtime fallbacks already correct), [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts), any backend files.

---

## 4. Verification

1. `cd /workspaces/lovelace-pill-logger-card && yarn run build` — clean compile, exit 0.
2. Visual inspection of the built `dist/ax-dose-logger-card.js`:
   - `mode: 'dropdown'` present on all 8 select selectors.
   - `default:` present on all 14 button fields.
   - Nested expandable titles present (5 Daily + 3 Drinks).
   - Old labels absent (`Lockout Style`, `Execution Requested Style`, `Latency Warning Style`, `Logged Style` as standalone labels).
   - New labels present (`Limit Reached Style`, `Take Pill Style`, `Overdue Warning Style`, `Logged Dose Indicator Style`).

---

## 5. Key Design Decisions

1. **Label renames are localize-only, no config-key changes** — the config keys (`take_button_lockout_style`, etc.) are deeply embedded in [`types.ts`](src/types.ts), the editor schema, the panel runtime fallbacks, and persisted user configs. Renaming keys would require a migration and break existing configs. The user asked for label changes, not structural renames.

2. **`mode: 'dropdown'` on ALL selects, not just the 3-option ones** — consistent rendering across the entire Button submenu. The 7-option style selects already auto-default to dropdown, but explicitly setting `mode: 'dropdown'` makes the intent clear and future-proof (if options are ever reduced to ≤3, the rendering stays dropdown).

3. **Nested flatten-expandables for section breaks** — the proven pattern in this codebase (`safe_to_take_box`, `pills_left_box`, `chip_N_box` all use `flatten: true` + `title:`). Gives explicit section headers + visual grouping without adding new CSS or custom elements. Each aspect's style dropdown + pulse toggle are paired in a grid inside their expandable, making the pairing unambiguous.

4. **Grid pairs style + pulse side-by-side** — the existing `installEditorGridAlignment()` CSS (`align-items: end`) already handles grid alignment in `ha-form` shadow roots. The grid makes it visually obvious that the pulse toggle belongs to the style dropdown in the same row.

5. **`default:` on all fields, accepting that defaults get persisted on save** — this is the same pattern used for `show_amount_in_body`, `show_day_avg_boxes`, and `confirm_tool_actions`. The runtime `?? <default>` fallbacks stay as defense-in-depth. The user's specific complaint ("logged animation is blank and does not say 3000ms by default") is resolved by `default: 3000` on the number field.

6. **No backend changes, no migration, no `projectstructure.md` change** — all changes are frontend editor/localize/README. No source files added or removed.