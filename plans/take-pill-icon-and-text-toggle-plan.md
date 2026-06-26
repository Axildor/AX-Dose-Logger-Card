# Plan — Take-Pill Button Icon + Big Text Toggle Fix

## Goal
Two frontend-only changes to the AX Dose Logger Card:

1. **Configurable Take-Pill button icon** — let the user pick the icon shown on the Take Pill button when LIMIT REACHED is *not* active. The LIMIT REACHED state keeps `mdi:alert`.
2. **Big Text toggle fix + rewording** — the toggle currently defaults to big text visually but starts OFF in the editor, so a fresh card shows big text until the user toggles it on/off. Flip the default to small (OFF) and reword the label/helper so it's clear that turning it ON makes all text bigger.

## Root cause of the big_text default bug
[`src/ax-dose-logger-card.ts:1720`](src/ax-dose-logger-card.ts:1720) uses:
```
--pill-text-offset: ${this.config?.big_text !== false ? '0px' : '-2px'};
```
`big_text` is `undefined` on a fresh card, and `undefined !== false` is `true`, so the offset is `0px` (big). The editor toggle starts unchecked (OFF = `undefined`/`false`), so the visual state and the toggle state disagree until the user interacts. Fix: change the condition to `big_text === true ? '0px' : '-2px'` so only an explicit ON yields big text.

## Changes

### Feature 1 — Configurable Take-Pill icon

**[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)**
- Add `take_pill_icon?: string;` to the `AxDoseLoggerCardConfig` interface (near `big_text` at line 28).
- In `getConfigForm()` schema, add an icon selector near the `big_text` entry:
  ```ts
  {
    name: 'take_pill_icon',
    selector: { icon: {} },
  },
  ```
  HA's `icon` selector renders the native icon picker (search + preview), matching how stock cards expose icon overrides.
- In the take-pill button render at line 833, change the non-limit icon:
  ```ts
  icon="${isLimitReached ? 'mdi:alert' : (this.config?.take_pill_icon || 'mdi:pill')}"
  ```
  The LIMIT REACHED branch is intentionally **not** affected — `mdi:alert` is a safety affordance that should not be user-overridable.

**[`src/localize.ts`](src/localize.ts)**
- Add `'config.take_pill_icon': 'Take Pill Icon'`
- Add `'config.helper.take_pill_icon': 'Icon shown on the Take Pill button when the limit has not been reached. Defaults to mdi:pill. The limit-reached state always uses mdi:alert.'`

### Feature 2 — Big Text default fix + reword

**[`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts:1720)**
- Change:
  ```
  --pill-text-offset: ${this.config?.big_text !== false ? '0px' : '-2px'};
  ```
  to:
  ```
  --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'};
  ```

**[`src/localize.ts`](src/localize.ts)**
- Reword `'config.big_text'` from `'Big Text'` to `'Large Text'` (clearer that ON = bigger).
- Reword `'config.helper.big_text'` from `'When off, all text is 2px smaller. Daily pane shrinks further for compact view.'` to `'When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view.'`

## Files touched
- `src/ax-dose-logger-card.ts` (interface, schema, render, default fix)
- `src/localize.ts` (2 new keys + 2 reworded strings)
- `dist/ax-dose-logger-card.js` (rebuilt)

## Verification
- `yarn run build` in `/workspaces/lovelace-pill-logger-card` — expect exit 0.
- Manual: add a fresh card → text should be small by default; toggle ON → text grows 2px; pick a custom icon → Take Pill button shows it; trigger limit reached → button shows `mdi:alert` regardless of custom icon.

## Memory bank updates (after verification)
- `memory-bank/activeContext.md` — new Current Status + What Was Changed + Files Modified + Key Design Decisions; archive previous.
- `memory-bank/progress.md` — new section with checklist.
- `README.md` — update only if it documents the config options list (add `take_pill_icon` + note `big_text` default change).