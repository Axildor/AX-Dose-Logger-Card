# Color Explainer — On-Time Window Text Update

**Type:** Frontend-only, single-file documentation/text fix
**Scope:** [`src/localize.ts`](src/localize.ts) — the `dialog.color_indicators.explainer` markdown array (the Medical Color Indicators popup reached via the device-info dialog).

## Problem

The Medical Color Indicators explainer popup still uses **stale terminology** from before the On-Time Window — Overdue-Gate Fix + Hours→Minutes Migration (2026-08-11). The popup's table rows describe the Blue and Amber states using the old "adherence grace window" framing, which no longer matches the actual behavior or the rest of the docs.

### Current (stale) explainer table rows

| Color | State | When active |
|-------|-------|-------------|
| **Blue** | Dose Due | Scheduled dose due (within the **adherence grace window**) |
| **Amber** | Overdue Warning | Overdue (past the **adherence grace window**) |

### Why it's wrong

1. **"adherence grace window"** is the old term. The setting is now called the **On-Time Window** (renamed in the backend config flow + translations + Advanced-Users.md during the 2026-08-11 migration).
2. **"within the grace window" / "past the grace window"** misdescribes the actual boundary. Per [`helpers.ts`](src/helpers.ts:204) `resolveButtonState()`:
   - Blue (execution) = `overdueSeconds <= (graceHours * 3600) / 2` → **first half** of the on-time window
   - Amber (latency) = `overdueSeconds > (graceHours * 3600) / 2` → **past half** the on-time window
3. The old wording implied the warning fired only when adherence tracking was on. The fix made it apply to **all scheduled medications** regardless of the adherence toggle (the Overdue sensor is the single source of truth). The explainer doesn't mention this.

The README Button State Matrix ([`README.md`](README.md:120)) was already corrected in the 2026-08-11 work:

> | **Take Pill** | Scheduled dose due (within the first half of the on-time window) | Blue | … |
> | **Overdue Warning** | Overdue (past half the on-time window) | Amber | … |

…plus a paragraph explaining the half-window boundary applies to all scheduled meds. **Only the in-card explainer popup was missed.**

## Proposed change

Single edit to the `dialog.color_indicators.explainer` array in [`src/localize.ts`](src/localize.ts:163).

### 1. Update the two table rows

```
| **Blue** | Dose Due | Scheduled dose due (within the first half of the on-time window) |
| **Amber** | Overdue Warning | Overdue (past half the on-time window) |
```

### 2. Add a short explanatory note (after the "fixed colors" line, before "Color Scheme Conflict")

Mirroring the README's overdue-boundary paragraph, kept concise for the popup:

```
The **on-time window** is the on-time buffer you configured for the medication (in minutes). The button stays blue for the **first half** of the window (on-time, no rush) and turns amber at the **halfway point** — a proactive heads-up that the window is closing. This applies to **all scheduled medications**, whether or not adherence tracking is enabled.
```

### No other changes

- The Red, Green, Color Scheme Conflict, and starred-colors sections are already accurate — untouched.
- No backend change, no config-flow change, no editor change, no `types.ts` change, no README change (README is already correct).
- No version bump, no migration.

## Files to modify

| File | Change |
|------|--------|
| [`src/localize.ts`](src/localize.ts) | `dialog.color_indicators.explainer` array: rewrite 2 table rows + insert 1 explanatory paragraph |
| [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) | Rebuilt via `yarn run build` |

## Verification

1. `yarn run build` in `/workspaces/lovelace-pill-logger-card` — exit 0, no warnings.
2. Dist grep: `first half of the on-time window` present, `past half the on-time window` present, `adherence grace window` absent from the explainer block.
3. Manual (optional): open the card → press drug title → "Medical Color Indicators" → confirm Blue/Amber rows + new paragraph render correctly in the popup.

## Memory-bank update (end of task)

Frontend repo only:
- [`memory-bank/activeContext.md`](memory-bank/activeContext.md) — new Current Status; archive the Ambilight Glow Radius block under Previous Context.
- [`memory-bank/progress.md`](memory-bank/progress.md) — append "Color Explainer — On-Time Window Text Update" section.
- No `projectstructure.md` change (no files added/renamed/deleted; `localize.ts` responsibility unchanged).
- No README change (already correct).