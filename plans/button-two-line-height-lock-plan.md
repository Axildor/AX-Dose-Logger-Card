# Plan — Lock Daily button + boxes to a permanent two-line sub-text height

## Problem
On the Daily pane ([`daily-panel.ts`](src/components/daily-panel.ts)), the "Take Pill" button's `.take-sub`
span renders "Last: … • Next: …" (or "• Overdue: …"). The `.take-sub-segment` spans are `white-space: nowrap`,
but the literal ` \u2022 ` (bullet) text nodes between them are NOT, so when the combined width exceeds the
button width the line breaks between segments → the button grows by ~16–19px (one extra line at the 16px
`.take-sub` size + line-height).

`.daily-main` is `display: flex` with the default `align-items: stretch`, so the taller button drives the
row height. The `.stats-column` (two stacked `.stat-pill` boxes, `gap: 10px`, no `flex:1` on the pills)
stretches to match the new row height, but the boxes themselves don't grow — they keep their intrinsic
content height, so the slack lands at the BOTTOM of the column. Result:
- Top box top ↔ button top: still aligned (both anchored at the row top). ✓
- Bottom box bottom ↔ button bottom: MISALIGNED (bottom box floats up, empty space below). ✗

The user perceives the button as "no longer inline with the other boxes and cards."

## User-confirmed constraints
1. The button's size must NOT change when Last/Next wrap to two lines.
2. The ratio of button height to the two-box stack must be preserved so that the top border of the top box
   aligns with the button top, and the bottom border of the bottom box aligns with the button bottom — at
   all times. (Growing only the button breaks the symmetry; the boxes must grow too, proportionally.)
3. The fix is **permanent**: reserve the two-line sub-text height at all times, so the card never resizes
   when dose strings change. Most stable/consistent UX.

## Root cause
- `.take-sub` has no reserved height; it grows from 1 line to 2 lines when content wraps.
- `.stat-pill` has no `flex: 1`; the column's extra height (from the stretch) is not absorbed by the boxes,
  so it pools at the bottom of the column and the bottom box floats up.

## Solution
Two coordinated CSS changes in [`daily-panel.ts`](src/components/daily-panel.ts) (and the same two in
[`drinks-panel.ts`](src/components/drinks-panel.ts) for parity, since it clones Daily's `.daily-main` /
`.stats-column` / `.take-sub` structure verbatim):

### Change A — Reserve the two-line sub-text height on the button
Add `min-height` to `.take-sub` (or to `.take-pill-btn`) sized to hold exactly two lines of the 16px
sub-text. The `.take-pill-btn` already uses `justify-content: center`, so the icon + `.take-label` stay
vertically centered in the now-taller button whether the sub-text fills one line or two — no content shift.

Concrete value: reserve two lines of `.take-sub`. `.take-sub` is `font-size: calc(16px + offset)` with
`line-height` inheriting the panel default (~1.5 via `.stat-value`-adjacent rules; `.take-sub` itself sets
no line-height, so it inherits LitElement's default ~1.2). Two lines at 16px × line-height 1.5 ≈ 48px; at
1.2 ≈ 38px. To be safe and consistent, set `min-height` on `.take-sub` to `calc(2em * 1.5)` = `3em`
(relative to the 16px font-size = 48px). This guarantees both lines fit with the same leading whether
the browser wraps or not. Single-line content sits at the top of the reserved block (the second reserved
line is empty), which is the standard way to reserve space; the button body stays a constant height.

> NOTE: We set `min-height` on `.take-sub` (not `.take-pill-btn`) so the reserved height is scoped to the
> sub-text block and the button's other children (icon, `.take-label`) keep their existing gaps. The
> button's `gap: 2px` + `justify-content: center` distribute the reserved height around all children.

### Change B — Let the two stat-pills absorb the extra column height proportionally
Add `flex: 1` to `.stat-pill` so the two boxes share the column's stretched height equally. With
`align-items: center` already on `.stat-pill`, the icon+label+value stay vertically centered inside each
taller box — the boxes grow, but their content doesn't shift. The top border of the top box and the
bottom border of the bottom box now both reach the row edges (button top/bottom) at all times,
preserving the ratio.

> NOTE: `.stat-pill` already has `align-items: center`; adding `flex: 1` only changes its height, not
> its internal alignment. The existing `min-height: 2.6em` on `.stat-label` (line 362) keeps the label
> block from collapsing; the box's new taller body just adds breathing room around the centered content.

### Net effect
- Button: always tall enough for two sub-text lines (icon + Take label stay centered above the
  reserved two-line sub block). Single-line sub content leaves the second reserved line empty — the
  button is the same size either way. ✓
- Boxes: each grows to fill half of the (now two-line-tall) row height; their content stays centered.
  Top of top box ↔ button top; bottom of bottom box ↔ button bottom. ✓
- Card height: constant. No resize when dose strings change length. ✓
- Ratio: button height ≈ box-stack height (both driven by the same reserved two-line row height);
  the visual proportion is preserved. ✓

## Scope — which files
- [`src/components/daily-panel.ts`](src/components/daily-panel.ts) — Change A + Change B in the `styles` block.
- [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts) — Same two CSS changes for parity
  (the Drinks pane clones Daily's `.daily-main` / `.stats-column` / `.take-sub` structure verbatim per its
  header comment). NOTE: the Drinks button only renders ONE `.take-sub-segment` ("Last: …"), so wrapping
  is less likely there, but the reserved height keeps the two panes visually consistent and future-proofs
  the Drinks button if a second segment is ever added. If the user prefers the Drinks pane unchanged,
  this change can be scoped to Daily only — it's a parity decision.
- `dist/ax-dose-logger-card.js` — rebuilt via `yarn run build`.

## Steps
1. Read the exact current `.take-sub`, `.take-pill-btn`, `.stat-pill`, `.stats-column` CSS blocks in
   [`daily-panel.ts`](src/components/daily-panel.ts) to confirm line numbers and surrounding context.
2. In [`daily-panel.ts`](src/components/daily-panel.ts):
   - Add `min-height: 3em;` to `.take-sub` (reserve two lines at the 16px / line-height-1.5 size).
   - Add `flex: 1;` to `.stat-pill` (so the two boxes absorb the column's stretched height equally).
3. In [`drinks-panel.ts`](src/components/drinks-panel.ts) (for parity — confirm with user):
   - Apply the same `min-height: 3em;` to `.take-sub` and `flex: 1;` to `.stat-pill`.
4. Run `yarn run build` from `/workspaces/lovelace-pill-logger-card` — must exit 0, no warnings.
5. Grep the dist for the new rules to confirm they shipped.
6. Update memory-bank per the global instructions:
   - `memory-bank/activeContext.md` — new Current Status, archive previous.
   - `memory-bank/progress.md` — new feature section with checklist.
   - `memory-bank/projectstructure.md` — no change (no files added/renamed/deleted).
   - `README.md` — no change (no end-user-facing behavior change; the card is the same size it was on
     single-line content, just stable when content wraps).

## Open question for the user
- Should the Drinks pane ([`drinks-panel.ts`](src/components/drinks-panel.ts)) get the same two CSS
  changes for visual parity, even though its button only has one sub-text segment today?
  (Recommended: yes, for consistency and future-proofing. Alternative: Daily-only.)

## Risk / notes
- The reserved two-line height makes the Daily button ~18-24px taller than its current single-line
  height. This is the intended trade-off the user explicitly chose ("Permanent two-line height — reserve
  space for two sub-text lines always"). The card is a constant taller size at all times.
- `flex: 1` on `.stat-pill` changes box height only; internal alignment (`align-items: center`) is
  unchanged, so icon/label/value positions inside each box don't shift.
- The `.chip` row below `.daily-main` is unaffected (it's a separate flex row in `.pane-daily` with its
  own `gap: 12px` from the parent).
- No backend, coordinator, store, config-flow, editor, types, or localize changes — this is a pure CSS
  layout fix in two presentational components.