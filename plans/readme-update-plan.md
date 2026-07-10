# Plan: Update AX-Dose-Logger-Card README to Reflect Current State

## Goal
Update `/workspaces/lovelace-pill-logger-card/README.md` (currently 154 lines) to reflect the current card + integration state. The card README is structurally sound but has 9 gaps vs. the actual card implementation.

## Gaps Found (card README vs. current card state)

| # | Gap | Source (activeContext) |
|---|-----|------------------------|
| 1 | No mention it was built in tandem with the integration | Backend README now has a prominent companion-card callout; card should reciprocate |
| 2 | No Table of Contents | — |
| 3 | Drinks pane: "Log Drink popup" predictive "Low: hh:mm" feature missing | 2026-07-09 Predictive Low Timestamp popup |
| 4 | Drinks pane: Disruption box now has 3 display modes (`disruption_mode`), not just Sleep Disruption | 2026-07-10 Drinks Panel Settings parity |
| 5 | Stats pane: missing "Days left" / "Est. days left" row + "Low - Hours Until" row | 2026-07-10 Days Left Stats; 2026-07-09 Low - Hours Until |
| 6 | Inventory pane: missing unified "Day Average" labels + averages-box device-info popup | 2026-07-10 Inventory live-update + unified labels + popup |
| 7 | Graphs pane: Amount-in-Body is now the default landing slide when `show_amount_in_body` is on | 2026-07-10 Default landing slide |
| 8 | Pills Left box: missing "Days left instead of Pills left" toggle + full Pills Left Box expandable | 2026-07-10 Pills Left Box subheading |
| 9 | Prerequisites only mention medications (not drinks); `screenshot.png` reference has no actual file | — |

## New Structure

```
1. Title + concise intro (1-2 sentences)
2. ★ Companion Integration callout (built in tandem with AX Dose Logger)
3. Table of Contents (clickable)
4. Prerequisites (integration + medication OR drink)
5. Installation (HACS + Manual — unchanged)
6. Configuration (Visual Editor — unchanged, brief)
7. Features — device-type adaptation table (updated to mention drinks)
8. Medicine Panes
   ├ Daily (updated: Pills Left Box expandable + Days left toggle)
   ├ Graphs (updated: Amount-in-Body default landing slide)
   ├ Stats (updated: Days left row + Low - Hours Until row)
   ├ Tracking (effectiveness — unchanged)
   └ Tools (unchanged)
9. Drinks Card (Master Tracker)
   ├ Drinks (updated: Log Drink popup predictive Low + Disruption 3 modes)
   ├ Graph (unchanged)
   ├ Inventory (updated: unified labels + device-info popup)
   ├ Stats (updated: Days left + Low - Hours Until)
   └ Tools (unchanged)
10. Configuration Options (the big reference table — update disruption_mode rows already present; verify all rows current)
11. Full Documentation (link to integration repo)
12. License
```

## Specific Content Updates

### Prerequisites
- Add: "Add at least one medication OR drink through the integration's config flow"

### Daily pane
- Add a note about the **Pills Left Box** expandable in the visual editor: entity swap, Days-left toggle (`pills_left_show_days_left`), icon/label, tap/hold/double-tap actions
- Note the Safe to Take Box has the same override parity (entity swap + actions)

### Graphs pane
- Update: "When `show_amount_in_body` is on, the Amount in Body line graph is the default slide shown when entering the Graphs pane."
- Keep the effectiveness graph description (already present and accurate)

### Stats pane (medicine)
- Add: "Days left" / "Est. days left" row (inventory burn rate)
- Existing rows (rolling averages, adherence, total doses, days since first dose) stay

### Drinks pane
- Add the **Log Drink popup** predictive "Low: hh:mm" line: "The popup shows a predictive 'Low: hh:mm' line under each drink — the wall-clock time the body-mass would drop into the Low sleep band if that drink were logged now. 'Low: —' means the drink is safe (would not lift body-mass above the Low band)."
- Update the **Disruption box**: now has 3 display modes via `disruption_mode` — Sleep Disruption (None/Low/Moderate/High), Low - Timestamp (HH:MM), Low - Hours Until (X h countdown). Default tap opens the Sleep Disruption popup (in disruption mode) or more-info (in Low modes).
- Note the **In Body box** now has full override parity (entity swap + icon/label + actions)
- Note **drink chips** (up to 4 custom chips, separate from Daily chips)

### Inventory pane
- Update: both average boxes now say "Day Average" (was "7-Day Avg" vs "N-Day Average")
- Add: clicking the averages box opens the granular drink's device-info popup

### Stats pane (drinks)
- Add: "Days left" row (aggregated across all granular drinks of the substance)
- Add: "Low - Hours Until" row
- Existing rows (Amount in Last 24h, Sleep Disruption, Low - Timestamp, rolling averages, total doses) stay

### Configuration Options table
- Verify all rows are current (the 2026-07-10 Drinks Panel Settings task already added 18 rows — they should all be present)
- No new rows needed unless a check reveals missing ones

### Screenshot
- The `screenshot.png` reference at line 5 has no actual file. Options: (a) remove the broken reference, (b) leave it as a placeholder with a SCREENSHOT comment. **Recommend removing the broken reference** and adding a `<!-- SCREENSHOT: ... -->` comment so a screenshot can be added later without a broken image icon.

## Implementation
- Full rewrite of the card README via write_to_file.
- Preserve the Configuration Options reference table (it's the most valuable part and already accurate after the 2026-07-10 update).
- Keep the HACS/Manual install sections unchanged (accurate).
- After rewrite: verify ToC anchors, run `yarn run build` (the README is not compiled, but the global rule mandates a verification command), update the card memory-bank files.

## Verification
- `yarn run build` in the card directory (exit 0 — confirms no source files were accidentally touched).
- Visual review of rendered markdown.
- Confirm every ToC anchor resolves.