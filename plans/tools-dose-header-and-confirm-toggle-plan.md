# Tools Panel — Dose Tools Heading + Confirm-Action Toggle + Color-Scheme Fix

## Goal
Three frontend-only changes to the Tools panel (Pane 4) of the AX Dose Logger Card:

1. **Restructure**: remove Skip Dose from "Adherence Tools" and create a new
   "Dose Tools" heading containing Skip Dose + Undo Dose.
2. **Color scheme**: Reset Adherence %, Reset History, and Undo Dose currently
   use a hardcoded red `danger` class that ignores the card's color scheme.
   Remove the `danger` class so they follow the configured primary color like
   Skip Dose / Mark Last Adherence Taken already do.
3. **Confirm-action toggle**: add a new collapsible "Settings" category in the
   card editor containing a `confirm_tool_actions` boolean (default **on**).
   When on, every Tools panel button shows the existing warning confirmation
   dialog before firing. When off, buttons fire immediately with no popup.

## Files

| File | Change |
|------|--------|
| `src/types.ts` | Add `confirm_tool_actions?: boolean` to `AxDoseLoggerCardConfig`; add `runToolAction(...)` to `CardController` interface |
| `src/ax-dose-logger-card.ts` | Implement `_runToolAction` (dialog vs direct fire) + public `runToolAction` accessor |
| `src/components/tools-panel.ts` | 3-section restructure (Adherence / Dose / General); remove `danger` class from Reset Adherence %, Reset History, Undo Dose; switch all handlers from `openToolsDialog` → `runToolAction` |
| `src/ax-dose-logger-editor.ts` | New `settings_panel` expandable after `stats_panel` with `confirm_tool_actions` boolean selector |
| `src/localize.ts` | `config.settings_panel`, `config.confirm_tool_actions`, `config.helper.confirm_tool_actions`, `tools.dose_header` |
| `README.md` | Tools section: describe Dose Tools heading + confirm-action toggle |

## Design decisions

1. **Toggle default-on via `!== false`** — the config field is optional; the
   container checks `this.config?.confirm_tool_actions !== false`. Existing
   configs without the field keep the current always-confirm behavior, so no
   migration is needed.

2. **Single `runToolAction` method on the controller** — centralizes the
   "dialog vs direct" decision in the container (Home Assistant best practice:
   config-driven behavior, no per-button duplication). The panel stays purely
   presentational. `openToolsDialog` is kept for backward compatibility /
   direct dialog rendering.

3. **Color scheme via removing the `danger` class** — the plain `.tool-btn`
   class already uses `--rgb-primary-color`, which the card overrides via
   `getColorOverrides()` at the `ha-card` level (see
   `src/ax-dose-logger-card.ts:1985`). Removing the class is the minimal fix;
   no new CSS needed. The `.tool-btn.danger` CSS block stays for the
   per-granular-drink master buttons (still red, semantically correct for a
   destructive per-drink reset).

4. **Section ordering**: Adherence Tools → Dose Tools → General Tools. Dose
   Tools sits between the two existing sections because it groups the two
   dose-level actions (skip + undo), and General Tools (reset history) stays
   last as the most destructive whole-history action.

## Verification
- `yarn run build` in `/workspaces/lovelace-pill-logger-card` — exit 0, no warnings.
- Manual: editor shows new "Settings" expandable with confirm toggle (default
  on). Toggle on → dialog before every tools action. Toggle off → immediate
  fire. All tools buttons follow the selected color scheme (no red).