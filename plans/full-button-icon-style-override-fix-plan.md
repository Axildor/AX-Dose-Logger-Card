# Plan — Full Button + Icon Style Override Fix

## Bug
"The Full Button style only works when None or Pulse only Icon style is selected."

When the user selects **Full Button** (Style) + **Colored** or **Colored + Pulse** (Icon Style),
the button does NOT render the full colored background — it renders the theme-tinted
idle look instead. Full Button only looks correct when Icon Style is **None** or
**Pulse Only** (the two options that do NOT emit an `icon-{color}` class).

## Root Cause
In [`_takeButtonClasses()`](src/components/daily-panel.ts:107) the class builder emits
BOTH classes when style=`full` + iconStyle=`color`/`color_pulse`:

```
classes.push(`full-${color}`);          // e.g. full-red
...
if (iconStyle === 'color' || iconStyle === 'color_pulse') classes.push(`icon-${color}`);  // e.g. icon-red
```

The CSS then has two rules with **equal specificity** (`.take-pill-btn.full-red` and
`.take-pill-btn.icon-red` are both 0,2,0). The `icon-{color}` rule is declared LATER in
source order (lines 611-616, after the `full-{color}` block at 590-597), so it wins the
cascade and overrides the background + text color:

```css
.take-pill-btn.full-red { background-color: ...; background-image: ...red tint...; color: var(--btn-red); }
/* LATER — wins: */
.take-pill-btn.icon-red, .take-pill-btn.icon-blue, ... {
  background-color: var(--card-background-color, ...);
  background-image: linear-gradient(rgba(var(--rgb-primary-color, 3,169,244, 0.12), ...));  /* theme tint */
  color: var(--primary-color, #03a9f4);   /* theme text, NOT state color */
}
```

Result: `full-red` + `icon-red` → theme-tinted background + primary-color text = visually
identical to "No Color" style. The Full Button coloring is erased.

When Icon Style = `none` or `pulse`, no `icon-{color}` class is emitted, so only
`full-{color}` applies → Full Button renders correctly. This matches the user's report
exactly.

## Why the `icon-{color}` background block is redundant
The `icon-{color}` background/color declarations are a leftover from the legacy
pre-separation `icon` composite style. After the Icon Style Dropdown Separation
(2026-08-10), every Style option already emits its own background rule:

| Style     | Background class | Sets its own bg? |
|-----------|------------------|:---:|
| full      | `full-{color}`   | ✅ state-color tint |
| border    | `border-{color}` | ✅ theme tint + shadow |
| ring      | `ring-{color}`   | ✅ theme tint + ring |
| glow      | `style-none`     | ✅ theme tint |
| none      | `style-none`     | ✅ theme tint |

So the `icon-{color}` background block is **always redundant** — every style class already
sets the background. The icon class's sole responsibility (per the Icon Style dropdown's
documented purpose: "controlling the icon independently from the Style dropdown") is to
recolor the `<ha-icon>` child, which the `> ha-icon { color }` rule already handles.

## Fix
Remove the background/color declarations (and the `:hover` override) from the
`icon-{color}` selector blocks in BOTH panels, keeping only the `> ha-icon` recolor rule.
This lets `full-{color}` win the cascade for the background + text while `icon-{color}`
still recolors the icon — which is exactly the documented "Full Button colors everything"
behavior, and also harmless for border/ring/none/glow (their own background rules already
apply, identical to what the removed icon block set).

### Files
1. [`src/components/daily-panel.ts`](src/components/daily-panel.ts:604) — delete the
   `.take-pill-btn.icon-red, .icon-blue, .icon-amber, .icon-green { background... color... }`
   block (lines 608-620, incl. comment + `:hover`); keep the four
   `.take-pill-btn.icon-{color} > ha-icon { color }` rules (604-607).
2. [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts:539) — delete the
   `.log-drink-btn.icon-red, .icon-green { background... color... }` block + `:hover`
   (lines 541-548); keep the two `> ha-icon { color }` rules (539-540).
3. Rebuild `dist/ax-dose-logger-card.js` via `yarn run build`.

### No other changes
- No `types.ts` / editor / config migration — class emission logic is unchanged.
- No README change — the README already documents Full Button as coloring the button;
  this is a bug fix making the documented behavior work.
- No `projectstructure.md` change — no files added/renamed/deleted.

## Verification
- `yarn run build` exit 0.
- Manual matrix check (reasoned, not requiring a running HA):
  - `full` + `none`      → `full-{color}` only → state bg + state text + inherited icon. ✅ (unchanged)
  - `full` + `color`     → `full-{color}` + `icon-{color}` → state bg + state text + explicit icon color. ✅ FIXED
  - `full` + `color_pulse`→ `full-{color}` + `icon-{color}` + `pulse` → state bg + state text + colored pulsing icon. ✅ FIXED
  - `full` + `pulse`     → `full-{color}` + `pulse` → state bg + state text + inherited pulsing icon. ✅ (unchanged)
  - `border` + `color`   → `border-{color}` (theme bg) + `icon-{color}` icon recolor. ✅ (unchanged)
  - `none` + `color`     → `style-none` (theme bg) + `icon-{color}` icon recolor. ✅ (unchanged)
  - `ring` + `color`     → `ring-{color}` (theme bg) + `icon-{color}` icon recolor. ✅ (unchanged)
  - `glow` + `color`     → `style-none` (theme bg) + `icon-{color}` icon recolor. ✅ (unchanged)