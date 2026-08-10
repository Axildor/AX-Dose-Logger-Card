# Plan — Color-Scheme Indicator Conflict Signage

## Problem

The card has two independent color systems that can visually collide:

1. **Card accent (color_scheme)** — user-configurable dropdown in the visual editor.
   Resolved in [`getColorOverrides()`](src/helpers.ts:78) → overrides HA's
   `--primary-color` / `--rgb-primary-color`. Fourteen options (default + 13 hues).

2. **Medical button-state indicators** — hardcoded, semantic, NOT user-tintable.
   Defined in [`daily-panel.ts`](src/components/daily-panel.ts:422) `:host` block:

   | State | Token | Hex |
   |-------|-------|-----|
   | Limit Reached | `--btn-red` | `#db4437` |
   | Dose Due (Take Pill) | `--btn-blue` | `#03a9f4` |
   | Overdue Warning | `--btn-amber` | `#f5a623` |
   | Logged Dose Indicator | `--btn-green` | `#43a047` |

The idle Take Pill button's background is tinted by
`rgba(var(--rgb-primary-color), 0.12)` ([`daily-panel.ts:441`](src/components/daily-panel.ts:441)).
Four accent schemes collide with the four indicator colors:

| Scheme value | Scheme hex | Mimics indicator |
   |--------------|------------|------------------|
   | `red` | `#e53935` | Limit Reached (`#db4437`) |
   | `blue` | `#03a9f4` | Dose Due — **exact match** |
   | `orange` | `#fb8c00` | Overdue Amber (`#f5a623`) — near match |
   | `green` | `#43a047` | Logged — **exact match** |

So when the default button styles are in use, choosing one of these four
accents can make the *idle* button visually resemble an *active* medical
indicator. There is no functional bug (the state classes still apply their own
colors when active), but the at-a-glance readability degrades — a concern for a
medical safety-adjacent UI.

## Scope — Frontend only

All changes in `/workspaces/lovelace-pill-logger-card/`. No backend, no new
config keys, no migration. Reordering the dropdown does **not** change stored
`color_scheme` values (the option `value` strings stay `'red'`, `'blue'`,
etc.); only the menu order and display labels change.

## Decisions

1. **Explainer placement: editor helper text on the `color_scheme` field +
   light README touch-up.** NOT the device-info dialog. Rationale:
   - The device-info dialog (opened by pressing the drug title) is for device
     navigation, not configuration education; it's opened rarely and not at the
     moment of color choice.
   - HA's standard pattern for field-level guidance is the `helper` text
     co-located with the field — visible exactly when the user is picking the
     color, and silent once configured.
   - A permanent explainer in a runtime dialog becomes visual noise once the
     colors are learned. Helper text + `*` markers self-explain without
     recurring clutter.
2. **Orange stays flagged.** `#fb8c00` (orange) is close enough to `#f5a623`
   (amber overdue) to confuse the at-a-glance read; flagging it is the
   conservative, safety-leaning choice.

## Implementation Steps

### Step 1 — Reorder + annotate the `color_scheme` dropdown options
File: [`src/ax-dose-logger-editor.ts`](src/ax-dose-logger-editor.ts:197)

Current option order:
```
default, blue, red, green, yellow, orange, purple, pink, teal, brown, coral, slate, gold, grey
```

New order (non-colliding hues first, colliding four last, in the user's
listed order Red → Blue → Orange → Green, each label suffixed with ` *`):
```
default, yellow, purple, pink, teal, brown, coral, slate, gold, grey,
red *, blue *, orange *, green *
```

Implementation: append ` *` inline to the four colliding option labels (e.g.
`label: localize('en', 'color.red') + ' *'`). The `*` is a UI annotation, not
a translation — keep it out of `localize.ts` to avoid polluting the i18n map.
Option `value` strings are unchanged (`'red'`, `'blue'`, `'orange'`,
`'green'`), so existing configs keep working with no migration.

### Step 2 — Expand the `color_scheme` helper text
File: [`src/localize.ts`](src/localize.ts:400)

Current:
```
'config.helper.color_scheme': 'Accent color for the card.',
```

New (concise, names the four starred colors and the specific interference):
```
'config.helper.color_scheme': 'Accent color for the card. Colors marked * (Red, Blue, Orange, Green) match the medical button-state indicators (red = limit reached, blue = dose due, amber = overdue, green = logged). With the default button styles, the idle button is tinted by this accent, so a matching scheme can make the idle button resemble an active medical state. Pick a non-starred color if you want the indicators to stay unambiguous.'
```

### Step 3 — README touch-up
File: [`README.md`](README.md:81)

Two small additions:
- In the Quick Start step that mentions "Configure color scheme" (line 81),
  add a parenthetical pointing to the starred-colors note.
- Add a short subsection under the existing "Color Scheme" mention (near the
  Button State Matrix section, ~line 111) explaining the `*` markers and the
  interference, linking back to the Button State Matrix table for the
  indicator-color reference.

No change to the Button State Matrix table itself — it already correctly
documents the four indicator colors.

### Step 4 — Build + verify
- `cd /workspaces/lovelace-pill-logger-card && yarn run build` — must exit 0.
- Grep the compiled `dist/ax-dose-logger-card.js` to confirm the reordered
  options and the ` *` suffixes are present, and the helper text appears.

### Step 5 — Memory bank update (Frontend repo)
- [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new
  Current Status block; archive the previous.
- [`memory-bank/progress.md`](memory-bank/progress.md) — append a new
  feature section with the step checklist.
- No `projectstructure.md` change (no files added/renamed/deleted; primary
  responsibilities unchanged).

## Risk / Notes

- **No config migration.** Reordering options does not change stored values.
- **No functional behavior change.** Button states still apply their own
  indicator colors when active; only the *idle* tint readability is affected,
  and only cosmetically.
- **i18n stays clean.** The `*` suffix is appended in the editor, not in the
  translation map, so a future localized build isn't forced to translate the
  asterisk annotation (though the helper text itself is in `localize.ts` and
  would need translation per-language as usual).