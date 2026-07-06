# Tools Panel — Box Style Parity with Daily / Drinks Cards

## Goal
Make the boxes in the Tools panel share the same surface/UI style as the
`.stat-pill` boxes in the Daily and Drinks panes (primary-tinted transparency,
no border, matching icon/typography treatment, matching hover), so the card
has one consistent "box" vocabulary across all panes.

## Scope
- **Frontend only.** Single file: [`src/components/tools-panel.ts`](src/components/tools-panel.ts).
- No backend, no coordinator, no store, no localize, no types, no config-flow change.
- No README change (visual tweak, not a new user-facing feature / install step,
  per the README update rule — same decision as the Inventory parity pass).

## Reference baseline (Daily/Drinks `.stat-pill`)
Copied verbatim from [`src/components/daily-panel.ts`](src/components/daily-panel.ts):

```css
.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
  border-radius: var(--ha-card-border-radius, 12px);
}
.stat-pill ha-icon {
  --mdc-icon-size: 20px;
  color: var(--primary-color, #03a9f4);
  opacity: 0.7;
}
.stat-pill.clickable:hover {
  background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
}
```

Container parity (`.pane-daily` / `.pane-drinks`):
```css
.pane-daily { display: flex; flex-direction: column; gap: 12px; } /* no padding */
```

## Interpretation decision (to confirm)
The Tools buttons are **action buttons** (column-centered: icon over label),
not stat readouts (row: icon + label + value). The user asked for the *boxes*
to share the Daily/Drinks style. Therefore:
- **Align the SURFACE** (background, border, hover, icon size/opacity, padding,
  border-radius) to the `.stat-pill` baseline.
- **Preserve the internal layout** (column-centered icon + label) because the
  Tools buttons have a different purpose than stat readouts. Forcing a row
  layout with an empty value slot would be wrong.
- **Preserve the `.danger` semantic** — danger buttons use the error-color
  tint instead of the primary tint, mirroring how Daily's
  `.take-pill-btn.danger` uses the error tint. A danger box is still the same
  "box vocabulary", just tinted with the error color.

## Changes — `src/components/tools-panel.ts`

### 1. `.tools-panel` container → Daily/Drinks container parity
- Drop `padding: 8px 4px;` (match `.pane-daily`/`.pane-drinks` no-padding).
- `gap: 16px` → `gap: 12px` (match Daily/Drinks container gap).

### 2. `.tool-btn` surface → `.stat-pill` surface
- `background`: `var(--card-background-color, ...)` →
  `rgba(var(--rgb-primary-color, 3, 169, 244), 0.06)`.
- Remove `border: 1px solid var(--divider-color, ...)`.
  (Set `border: none;` for clarity.)
- `padding: 14px 8px` → `12px 14px` (match `.stat-pill`).
- Keep `border-radius: var(--ha-card-border-radius, 12px)`.
- Keep column layout (`flex-direction: column; align-items: center;
  justify-content: center; gap: 6px`) — action-button shape preserved.
- Keep `cursor: pointer; transition` (drop `border-color` from the transition
  list since the border is gone; keep `background` + `transform`).

### 3. `.tool-btn ha-icon` → `.stat-pill ha-icon` treatment
- `--mdc-icon-size: 24px` → `20px`.
- Add `opacity: 0.7` (match stat-pill icon).
- Keep `color: var(--primary-color, #03a9f4)`.

### 4. `.tool-btn:hover` → `.stat-pill.clickable:hover` treatment
- `background: rgba(rgb-primary, 0.06)` → `rgba(rgb-primary, 0.12)`.
- Drop `border-color: var(--primary-color, ...)` (no border to color).
- Keep `:active { transform: scale(0.98); }` (the Tools buttons' press
  feedback; Daily's `.take-pill-btn` uses 0.96, stat-pill has none — 0.98 is a
  fine Tools-specific value and stays consistent with the prior behavior).

### 5. `.tool-btn.danger` semantic — error-tinted surface
- Add a base `.tool-btn.danger` rule:
  `background: rgba(var(--rgb-error-color, 219, 68, 55), 0.06);`
  (error-tinted equivalent of the primary 0.06 surface, mirroring
  `.take-pill-btn.danger`'s 0.12 fill at half strength for the resting state).
- `.tool-btn.danger ha-icon` → `color: var(--error-color, #db4437);`
  (currently inherits primary color; align to error semantic).
- `.tool-btn.danger:hover`:
  `background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);`
  (error equivalent of the 0.12 hover; drop the `border-color` rule).

### 6. `.drink-tool-row` (Master Tracker) → same primary-tinted surface
- `background: var(--card-background-color, ...)` →
  `rgba(var(--rgb-primary-color, 3, 169, 244), 0.06)`.
- Remove `border: 1px solid var(--divider-color, ...)`.
- Keep `border-radius`, `padding: 10px 12px`, `flex-wrap: wrap`, etc.
  (row container, not a button — no hover/active needed; the buttons inside
  carry the interaction.)

### 7. `.drink-tool-btn` (Master Tracker mini buttons) → `.tool-btn` parity
- These already inherit from `.tool-btn`, so the surface change in step 2
  applies automatically. The `.drink-tool-btn` override only adjusts
  layout (`flex-direction: row; padding: 8px 12px; font-size: 13px`) and
  icon size (`20px`) — keep those. No additional change needed beyond what
  `.tool-btn` + `.tool-btn.danger` already do. (They carry `.danger` so they
  get the error-tinted surface from step 5.)

### 8. `.tools-section-header` — unchanged
- Already `uppercase`, `letter-spacing: 0.5px`, `secondary-text-color`,
  `16px weight 600`. This matches the Daily/Drinks `.stat-label` typography
  spirit (uppercase, letter-spacing 0.5px, secondary-text). No change.

## Files Modified
- `src/components/tools-panel.ts` (CSS only; render/TS logic unchanged)
- `dist/ax-dose-logger-card.js` (rebuilt via `yarn run build`)

## Verification
- `yarn run build` in `/workspaces/lovelace-pill-logger-card/` — exit 0, no
  warnings.
- Visual: Tools pane boxes now share the Daily/Drinks primary-tinted
  transparency, no border, 20px @ 0.7 icons; danger boxes (Reset Adherence,
  Reset History, Undo Dose, per-drink Undo/Reset) use the error-tinted
  equivalent.

## Memory bank updates (after verification)
- `memory-bank/activeContext.md` — new "Current Status" entry for Tools panel
  box-style parity; archive the Inventory parity entry under "Previous
  Context".
- `memory-bank/progress.md` — new section: "Tools Panel Box-Style Parity with
  Daily/Drinks" with checklist.
- `memory-bank/projectstructure.md` — no change (no files added/renamed).
- `README.md` — no change (visual tweak, not a user-facing feature).