# Plan — #6 replace `confirm()` + #7 migrate custom dialogs to `ha-dialog`

Scope: [`src/pill-logger-card.ts`](src/pill-logger-card.ts). Addresses audit findings #6 and #7 (UX/accessibility).

## Architectural decision: how to use `ha-dialog` from a standalone custom card

The HA frontend docs confirm `ha-dialog` and `showAlertDialog` are imported via **relative paths inside the HA frontend source tree** (`../dialogs/generic/show-alert-dialog`). A custom card loaded as an external JS resource (this repo's model) **cannot** use those import paths — it's a separate bundle with no access to HA's module graph. `custom-card-helpers` isn't installed either.

**However**, `ha-dialog` is registered as a **global custom element** at runtime by the HA frontend (it's used by HA's own dialogs). An external card can use `<ha-dialog>` as a tag in its Lit template **without importing it** — the element is already defined in the page's global registry once HA loads. This card **already** relies on this exact pattern for `<ha-card>` and `<ha-icon>` (35 usages, no imports). Using `<ha-dialog>` the same way is consistent with the card's existing approach and the established HACS community convention (mushroom, bubble-card, etc. do this).

**Risk:** if HA ever removes/renames `ha-dialog`, the card breaks — but that's the same risk the card already accepts for `ha-card`/`ha-icon`. Acceptable.

**TypeScript:** `<ha-dialog>` has no type declaration in this project. Lit's `html` template literal accepts unknown tags, so it compiles fine (the existing `<ha-icon>`/`<ha-card>` usages prove this — no types for those either). No `@types` install needed.

## What the user will see (layman explanation)

Today the card has **four** popup-style things, each built differently:

1. **Pill-limit override warning** — when you press "Take Pill" at the limit, the **browser's native `confirm()` box** appears. It's a plain grey OS dialog with "WARNING: pill limit does not reset until: Xh XXm. Override?" and OK/Cancel. It looks nothing like Home Assistant, freezes the page while open, can't be styled, and on mobile looks particularly out of place.

2. **Device info popup** — a small centered box with the medication name and a "To Device info" button. Hand-built with a darkened backdrop.

3. **Refill popup** — a centered box with a number input and Cancel/Refill buttons. Hand-built.

4. **Tools confirmation popup** — a centered box (Reset Adherence, Mark Last Adherence Taken, Reset History, Undo Dose) with a description and Cancel/Confirm. Hand-built.

**After the change, all four become HA-native `ha-dialog` popups.** What that means for the user:

- **Same look as the rest of Home Assistant.** The popups will use HA's standard dialog styling — rounded card, HA's theme colors, HA's standard button look, the familiar scrim (darkened background) HA uses everywhere. They'll feel like part of HA instead of a foreign overlay.
- **They appear centered and animate in** the way HA's own dialogs do (the standard slide/fade), instead of the current instant-appear.
- **Better on mobile.** HA dialogs are responsive — they adapt to phone screens properly. The current hand-built ones can clip or mis-size on small screens.
- **Keyboard & screen-reader friendly.** HA dialogs trap focus inside them (Tab won't escape to the dashboard behind), return focus to the button you pressed when closed, lock background scrolling, and announce themselves as dialogs to screen readers. The current ones don't do any of this — ESC handling is partial, there's no focus trap, and screen readers see them as plain divs.
- **The pill-limit warning stops freezing the page.** The native `confirm()` is synchronous and blocks the UI thread; the new dialog is asynchronous and doesn't block.
- **No behaviour changes.** Every popup still opens on the same trigger, shows the same text, and does the same thing when you confirm/cancel. The refill input still works the same way. The "To Device info" button still navigates to the same place. Only the *container* and *styling* change.

## Changes

### 1. New `_overrideDialog` state for the pill-limit warning (#6)
Replace the synchronous `confirm()` in [`_handleTakePill()`](src/pill-logger-card.ts:457) with an async dialog. Add:
```ts
@state() private _overrideDialog: { windowExpiry: string; entities: ResolvedEntities } | null = null;
```
`_handleTakePill` sets `_overrideDialog` instead of calling `confirm()`; a new `_renderOverrideDialog()` renders the `ha-dialog`; the Confirm handler calls `callService` and closes; Cancel just closes. The `shouldUpdate` key list gains `'_overrideDialog'`.

### 2. Migrate `_renderDeviceInfoDialog` to `ha-dialog` (#7)
```html
<ha-dialog open .heading=${this._getMedName(entities)} @closed=${() => this._showDeviceInfo = false}>
  <div class="dialog-body"> ... "To Device info" button ... </div>
  <ha-dialog-footer> ... </ha-dialog-footer>
</ha-dialog>
```
- `@closed` replaces the manual backdrop-click + ESC handlers (ha-dialog handles both natively, including scrim click).
- The "To Device info" button stays; its `@click` calls `_navigateToDevice()` then sets `_showDeviceInfo = false`.

### 3. Migrate `_renderRefillDialog` to `ha-dialog` (#7)
- Same pattern. The number `<input>` moves into the dialog body; Cancel/Refill into `<ha-dialog-footer>`.
- Cancel and the `@closed` handler both reset `_refillAmount` (preserving current cleanup behaviour).
- Refill button calls `_handleRefill` (unchanged logic).

### 4. Migrate `_renderToolsDialog` to `ha-dialog` (#7)
- Title → `.heading`; descriptor → body; Cancel/Confirm → `<ha-dialog-footer>`.
- `@closed` calls `_closeToolsDialog()` (replaces backdrop-click handler).
- Confirm handler unchanged (`dialog.onConfirm()` + close).

### 5. CSS adjustments
- Remove the now-unused `.dialog-backdrop`, `.dialog-box`, `.dialog-title` rules (ha-dialog provides its own scrim, surface, and heading).
- Keep `.dialog-btn`, `.dialog-btn--muted`, `.refill-input`, `.tools-dialog-descriptor`, `.dialog-actions` — these style the *contents* (buttons, input, descriptor text) which still live inside the dialog. Adjust `.dialog-actions` to lay out the footer buttons (ha-dialog-footer is a flex row already, so `.dialog-actions` may become redundant — verify during implementation).
- Add a small `.dialog-body { padding: 8px 0; }` helper if needed for spacing.

## What does NOT change
- **Triggers:** every dialog opens on the exact same user action as before.
- **Text/labels:** all titles, descriptions, button labels, and the refill placeholder are identical.
- **Actions:** Confirm/Refill/To-Device-Info/Cancel all call the same handlers (`_handleRefill`, `_navigateToDevice`, `dialog.onConfirm`, `_closeToolsDialog`, etc.).
- **State management:** `_showDeviceInfo`, `_showRefillDialog`, `_refillAmount`, `_toolsDialog` all stay; only `_overrideDialog` is new (replacing `confirm()`).
- **`shouldUpdate`:** gains `'_overrideDialog'` to the key list; everything else unchanged.
- **Backend / integration:** zero changes — this is purely frontend dialog chrome.

## Functionality-preservation checklist
- [ ] Pill-limit override: pressing Take Pill at limit → dialog appears → Confirm presses the button → Cancel does nothing. (Was: native confirm → OK presses / Cancel does nothing.)
- [ ] Device info: clicking med name → dialog → "To Device info" navigates to device page. (Unchanged.)
- [ ] Refill: clicking Pills left → dialog → enter number → Refill calls `number.set_value`; Cancel/ESC closes and clears input. (Unchanged.)
- [ ] Tools: each tool button → dialog with title+description → Confirm runs the action; Cancel/ESC closes. (Unchanged.)
- [ ] No new backend calls, no new entities, no config-schema changes.
- [ ] `ha-dialog` is already globally registered by HA (same as `ha-card`/`ha-icon` the card already uses) — no import needed, no new dependency.

## Risk & mitigation
- **Risk:** `ha-dialog` not yet defined when card first renders (HA lazy-loads it). **Mitigation:** `ha-dialog` is defined as soon as any HA dialog has been opened anywhere; the card's own dialogs are user-triggered (well after HA load). If a dialog is opened before `ha-dialog` is defined, the tag simply renders as an unknown element (no crash) — but in practice this can't happen because the triggers require user interaction on an already-loaded dashboard. No `customElements.whenDefined` guard needed for this card's usage pattern.
- **Risk:** TS compile error on unknown `<ha-dialog>` tag. **Mitigation:** Lit's `html` literal doesn't type-check tag names (proven by existing `<ha-icon>`/`<ha-card>` usage with no type defs). Will verify with `yarn build`.

## Verification
- `yarn build` — must compile with zero errors.
- Grep compiled bundle: `confirm(` no longer present; `<ha-dialog` / `ha-dialog-footer` present.
- Manual smoke test (user): trigger each of the 4 dialogs, confirm they open styled like HA, confirm Confirm/Cancel/Refill/To-Device-Info all work, confirm ESC and scrim-click close them, confirm focus returns to the trigger button.

## Files to modify
- `src/pill-logger-card.ts` — `_overrideDialog` state; `_handleTakePill` rewrite; 4 dialog render methods rewritten to `ha-dialog`; `shouldUpdate` key list; CSS cleanup.
- `dist/pill-logger-card.js` — rebuilt.
- `memory-bank/activeContext.md` + `memory-bank/progress.md` — updated.
- **README update IS warranted this time** — the dialog appearance changes are user-visible UX (HA-native dialogs instead of custom/browser popups). A short note in the README's features section.