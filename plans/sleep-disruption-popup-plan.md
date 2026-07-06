# Sleep Disruption Pop-up Card — Plan

## Goal
When the user presses the **Sleep Disruption** stat-pill in the Drinks pane (Master Tracker card), open a custom `ha-dialog` pop-up containing the substance-aware Sleep Disruption description (caffeine vs alcohol), instead of the native HA more-info dialog.

The pop-up must:
- Show **only** the description matching the Master Tracker's `substance` (`caffeine` or `alcohol`).
- Use the canonical HA dialog element (`ha-dialog`) so scrim/closing/keyboard behaviour matches every other card dialog.
- Render the markdown body via HA's `ha-markdown` element (already used elsewhere in HA; supports bold + bullet lists).
- Keep the existing more-info fallback for users who long-press / secondary-open (optional — see decision below).

## Affected Files
Frontend repo only (`/workspaces/lovelace-pill-logger-card/`):

1. [`src/ax-dose-logger-card.ts`](src/ax-dose-logger-card.ts)
   - New `@state() private _showSleepDisruptionDialog: boolean = false`
   - New `@state() private _sleepDisruptionSubstance: 'caffeine' | 'alcohol' | null = null`
   - New public method `showSleepDisruptionDialog(substance: 'caffeine' | 'alcohol'): void`
   - New private method `_renderSleepDisruptionDialog(): TemplateResult | typeof nothing`
   - Render the dialog in the main `render()` template chain (next to `_renderToolsDialog`)
   - Reset both flags in the existing view-entry / disconnect reset block
   - Add the new state fields to the `_persistStates` array (so back-navigation survives)

2. [`src/types.ts`](src/types.ts)
   - Add `showSleepDisruptionDialog(substance: 'caffeine' | 'alcohol'): void` to the `CardController` interface (next to `showLogDrinkDialog`)

3. [`src/components/drinks-panel.ts`](src/components/drinks-panel.ts)
   - Change the Sleep Disruption `.stat-pill` `@click` handler from `() => c.openMoreInfo(e.sleepDisruption!)` → `() => c.showSleepDisruptionDialog(substance)`. Guard so it only fires when `e.sleepDisruption` exists.
   - Same swap for `@keydown` (Enter / Space).

4. [`src/localize.ts`](src/localize.ts)
   - New keys for the dialog title + the full markdown body for each substance:
     - `dialog.sleep_disruption.title` = `'Sleep Disruption'`
     - `dialog.sleep_disruption.caffeine` = the caffeine markdown block (None/Low/Moderate/High bullets + Immunity note + README pointer)
     - `dialog.sleep_disruption.alcohol` = the alcohol markdown block (None/Low/Moderate/High bullets + Nightcap note + README pointer)

## Dialog Structure
```
<ha-dialog open width="small" @closed=${close}>
  <div slot="header" class="dialog-header">
    <ha-icon icon="mdi:sleep"></ha-icon>
    Sleep Disruption
  </div>
  <div class="dialog-body">
    <ha-markdown .content=${substance === 'alcohol' ? alcoholMd : caffeineMd}></ha-markdown>
  </div>
  <div class="custom-action-bar">
    <button class="dialog-btn" @click=${close}>
      <ha-icon icon="mdi:close"></ha-icon>
      <span>Close</span>
    </button>
  </div>
</ha-dialog>
```

Markdown bodies (verbatim from user text, localised via the new localize keys):

**Caffeine**
```
### Caffeine Sleep Disruption

* **None (0 - 10 mg):** Negligible impact. Normal sleep cycles and melatonin production.
* **Low (11 - 30 mg):** Minor shift. Deep sleep remains mostly stable.
* **Moderate (31 - 60 mg):** Hidden disruption. Measurable drop in deep sleep and an elevated resting heart rate.
* **High (61+ mg):** Severe disruption. Increased tossing and turning, frequent micro-awakenings, and delayed sleep onset.
* **Note on "Immunity":** Even if you easily fall asleep with caffeine in your system, it still chemically blocks your deep, restorative sleep phases. You are unconscious, but not resting.

*See README for full biological breakdown.*
```

**Alcohol**
```
### Alcohol Sleep Disruption

* **None (0 g):** Clean architecture. Normal resting heart rate and REM cycles.
* **Low (1 - 10 g):** Minor rebound. Slight, brief elevation in heart rate during the night.
* **Moderate (11 - 30 g):** Restless sleep. Mid-night awakenings, temperature dysregulation (sweating), and lowered Heart Rate Variability (HRV).
* **High (31+ g):** Severe stress. Spiked heart rate for hours, frequent waking, and stressful REM rebound (vivid dreams).
* **Note on "The Nightcap":** Using alcohol to fall asleep faster is a biological trap. You trade falling asleep quickly for destroying the restorative quality of the second half of your night.

*See README for full biological breakdown.*
```

## Substance Detection
The Drinks pane already computes `substance = e.substance` (set by the resolver from the master tracker's `substance` attribute on `drink_master_last_dose_*` / `amount_in_body_*`). The pop-up will simply receive the substance as a method argument — no new entity lookups required.

## HA Best-Practices Alignment
- Uses the native `ha-dialog` element (same as all other card dialogs).
- Uses `ha-markdown` for rich content (HA standard — supports the bold + bullets used in the description).
- Pure presentational, `should_poll`-irrelevant frontend change — no backend/coordinator changes.
- Localised strings stored in [`src/localize.ts`](src/localize.ts) (this card keeps its strings inline in a single map; no separate translation file mechanism is wired in for the card).
- No blocking calls; dialog open/close is pure Lit state mutation.

## Decisions
1. **Replace more-info, do not stack dialogs** — The current click opens HA's native more-info (which shows sensor attributes only — not the readable description). The new pop-up replaces it so the user sees the curated description. The more-info dialog is still reachable from the In Body box and from HA's entity registry, so no functionality is lost.
2. **No hold/secondary action** — The stat-pill currently has no separate hold action; keep it that way for parity with the In Body box.
3. **Markdown stored in localize map, not in component** — Keeps all user-facing text in one place, consistent with the card's existing localize convention. Strings use single-quoted template literals (no escaping needed for bullets/`**bold**`).
4. **`width="small"`** — Matches the other card dialogs (device-info, tools, override).

## Verification
- `cd /workspaces/lovelace-pill-logger-card && yarn run build` — must compile cleanly with no TS errors.
- Manual smoke test in HA: open a Caffeine Tracker card → click Disruption → see caffeine description only; same for Alcohol Tracker → see alcohol description only.

## Memory-bank Update (post-verify)
- `README.md` — no change (card UI tweak, not a user-facing feature/installation change).
- `memory-bank/activeContext.md` — update Current Status / What Was Changed / Files Modified.
- `memory-bank/progress.md` — new section.
- `memory-bank/projectstructure.md` — no file added/removed.