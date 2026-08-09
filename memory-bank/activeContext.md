## Current Status
**Complete**: Hide "Next: now" on Take Pill Button (2026-08-09) — small UX tweak to the Take Pill button's sub-line in [`daily-panel.ts`](src/components/daily-panel.ts:219). Reported by user: the button showed "Next: Now" once the scheduled next-dose time arrived, which was redundant — the dose is due now, so a future-countdown label has no meaning at that point. The user wanted: when `next` is reached, hide the `Next:` segment entirely and only display `Last:`.

**Root cause:** [`_computeNextDose()`](src/ax-dose-logger-card.ts:526) returns the literal string `'now'` when the next-dose timestamp has arrived or passed (`next <= now`). The panel's render condition only checked `nextDose !== 'Unavailable'`, so `'now'` rendered as **"Next: now"**. The gap occurs in the window between schedule arrival and the overdue sensor (`_computeOverTime`) flipping non-null — for scheduled meds the Overdue segment replaces Next moments later, and for As-Needed meds (where `_computeOverTime` returns `null`) the `'now'` value lingered until the rolling safety window reset.

**What Was Changed:**
- **[`src/components/daily-panel.ts`](src/components/daily-panel.ts:221)** — widened the Next-segment render guard from `nextDose !== 'Unavailable'` to `nextDose !== 'Unavailable' && nextDose !== 'now'`. When `next` is reached, the entire `Next:` segment (the leading `•` bullet + the `daily.next` label + value) is omitted, leaving only `Last: {timeSince}` on the sub-line. The future-countdown path (`Xh Ym`) is unchanged; the Overdue precedence (`overTime ? Overdue : Next : nothing`) is unchanged.
- **[`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js)** — rebuilt via `yarn run build` (clean, exit 0, 4.5s).

**Files Modified:** [`src/components/daily-panel.ts`](src/components/daily-panel.ts), [`dist/ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) (rebuilt). No backend, no `types.ts`, no `ax-dose-logger-editor.ts`, no `localize.ts`, no CSS, no config keys, no migration, no `projectstructure.md` change.

**Key Design Decisions:**
1. **Purely presentational** — no backend, no coordinator, no state change. The `'now'` sentinel is already emitted by `_computeNextDose`; the panel simply stops rendering it. Matches the user's direct request ("when Next is reached it should be hidden") with no new config option.
2. **Guard on the sentinel, not a re-derivation** — comparing against `'now'` (the canonical "next dose has arrived" signal in this card) keeps the panel presentational and consistent with how the rest of the card already classifies this state. Re-reading the raw `next_dose` state and recomputing the comparison would duplicate `_computeNextDose`'s logic.
3. **Overdue precedence preserved** — `overTime` (the overdue sensor) still takes priority over `Next:`. The `Next: now` gap only appeared before overdue kicked in (scheduled meds) or never (As-Needed meds whose `_computeOverTime` returns `null`). Hiding `'now'` covers both cases cleanly without affecting the future-countdown display (`Xh Ym`).
4. **No README change** — the sub-line format (`Last: … • Next: …`) is not documented in the card README; this is a display refinement of an existing element, not new end-user behavior or a config surface.

**Verification:** `yarn run build` clean (exit 0, 4.5s). Dist grep confirms the new condition (`nextDose !== 'Unavailable' && nextDose !== 'now'`) present (count = 1) and the old `nextDose !== 'Unavailable'` standalone condition absent as a render guard.

### Previous Context — ACK Intro State Freeze (2026-08-09)
**Previous Current Status:**
**Complete**: ACK Intro State Freeze — Hide Post-Press Color Flash (2026-08-09) — user-reported visual glitch where pressing Take Pill / Log Drink at the daily-limit boundary flashed the new button state (e.g. `default → Limit Reached red`) for ~240ms before the green Logged Dose Indicator (ACK) overlay reached full opacity and hid it. Root cause: on a successful press, [`_triggerDailyAck`](src/ax-dose-logger-card.ts:830)/[`_triggerDrinksAck`](src/ax-dose-logger-card.ts:844) set the ACK flag synchronously, so the overlay started its fixed 240ms intro fade-in (`opacity 0 → 1` via [`ax-btn-ack-intro`](src/components/daily-panel.ts:622) / `ax-drink-btn-ack-intro`); meanwhile HA pushed the new `pillsSafeToTake = 0` and [`_computeDailyButtonState`](src/ax-dose-logger-card.ts:884) read the **live** sensor → returned `'lockout'` → the button snapped to red **immediately**, visible through the still-fading-in overlay. Fix: **freeze the resolved ButtonState for the 240ms intro window** while ACK is active, so the post-press color transition commits behind the now-opaque overlay instead of flashing through it. Pure JS in the container; no CSS / panel / config / editor / localize changes.

### Previous Context — Logged Dose Indicator Clarity (2026-08-09)
**Previous Current Status:**
**Complete**: Logged Dose Indicator — Clarity, Softening, Press-Feel (2026-08-09) — three user-reported issues with the transient Logged Dose Indicator (ACK) overlay that flashes on the Take Pill / Log Drink buttons after a successful press. (1) red tick mark on limit-reached press (fixed via child-combinator scoping); (2) ack green too vibrant (final: dark green `#212C22` surface + bright green `#43A047` tick); (3) instant pop-in felt jarring (fixed via a fixed 240ms `ax-btn-ack-intro` scale+fade-in split from the hold/fade `ax-btn-ack-fade`).

---

> 📜 **Older history archived in [`memory-bank/old/activeContext-archive.md`](memory-bank/old/activeContext-archive.md:1)** — read it only if the truncated file above lacks context for the current task. The archive holds the full pre-truncation content (current status + prior-status blocks + earlier "Previous Context" sections back to the project's earliest work).
