# Pill Logger Card — Home Assistant Best-Practices Audit

Scope: [`src/pill-logger-card.ts`](src/pill-logger-card.ts) (the Lovelace custom card).
Reference: Home Assistant Developers docs (custom-card, getCardSize, hass-action) + HA frontend conventions.

Findings are grouped by severity. Each item lists the offending code, why it diverges from HA best practice, and the recommended fix.

---

## 🔴 High — Correctness / Performance / Stability

### 1. No `shouldUpdate()` — full re-render on every HA state tick
- **Where:** [`PillLoggerCard`](src/pill-logger-card.ts:79) — class has no `shouldUpdate` override.
- **Issue:** `hass` is declared `@property({ attribute: false })` ([line 80](src/pill-logger-card.ts:80)). HA replaces the `hass` object reference on **every** state change system-wide, so Lit's default `shouldUpdate` returns `true` and the entire card (SVG graphs, grids, dialogs) re-renders even when none of this card's entities changed. With a large HA instance this is a measurable CPU/render cost.
- **Best practice:** Implement `shouldUpdate(changedProps)` to return `true` only when `config`, internal `@state`, or a relevant entity state changed. Common pattern:
  ```ts
  shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('config')) return true;
    if (changedProps.has('_activePane') || changedProps.has('_activeTimeframe')
        || changedProps.has('_amountHistory') || changedProps.has('_doseHistory')
        || changedProps.has('_toolsDialog') || changedProps.has('_showRefillDialog')
        || changedProps.has('_showDeviceInfo')) return true;
    if (changedProps.has('hass') && this.hass && this.config) {
      const entities = this._resolveEntities();
      const ids = Object.values(entities).filter(Boolean) as string[];
      return ids.some(id => this.hass!.states[id] !== (changedProps.get('hass') as PillLoggerHass)?.states?.[id]);
    }
    return false;
  }
  ```

### 2. Direct `fetch()` + manual access-token extraction instead of HA's connection layer
- **Where:** [`_fetchAmountHistory()`](src/pill-logger-card.ts:753) and [`_fetchDoseHistory()`](src/pill-logger-card.ts:794).
- **Issue:** Both do `(this.hass as any).auth?.data?.access_token` then raw `fetch('/api/...')`. This:
  - bypasses HA's authenticated websocket/REST helper layer,
  - is fragile across HA versions (the `auth.data.access_token` shape is internal),
  - does not refresh expired tokens,
  - cannot be mocked/tested by HA's tooling.
- **Best practice:** Use `this.hass.callApi('GET', path)` (returns parsed JSON, handles auth + errors) for REST, or the `home-assistant-js-websocket` history helpers (`fetchRecent`, `subscribeHistory`) for the history API. For the custom `/api/pill_logger/history/` endpoint, `callApi` is the correct path.

### 3. No `disconnectedCallback()` — async fetches & timeouts mutate a detached element
- **Where:** class has `connectedCallback()` ([line 1226](src/pill-logger-card.ts:1226)) but no `disconnectedCallback`.
- **Issue:**
  - `_fetchAmountHistory` / `_fetchDoseHistory` are fire-and-forget; if the card is removed mid-fetch, `this._amountHistory = ...` writes state to a detached element (wasted work, potential warnings).
  - `_handlePaneChange` schedules `setTimeout(..., 2000)` ([line 500](src/pill-logger-card.ts:500)) that is never cleared.
- **Best practice:** Add `disconnectedCallback()` that cancels in-flight fetches (AbortController) and clears pending timeouts.

### 4. Concurrent fetch races on rapid timeframe/pane changes
- **Where:** [`updated()`](src/pill-logger-card.ts:1249) calls `_fetchAmountHistory` without guarding against overlapping requests.
- **Issue:** Rapidly clicking 48H → 7D → 30D fires three fetches; whichever resolves **last** wins, which may not be the latest click. Result: graph shows stale timeframe data.
- **Best practice:** Track a request token (`this._fetchId++`) and ignore responses whose token != current, or use an `AbortController` per in-flight request.

### 5. `_resolveEntities()` runs on every render and iterates all HA entities
- **Where:** [`_resolveEntities()`](src/pill-logger-card.ts:122) is called from `render()` ([line 1206](src/pill-logger-card.ts:1206)) and `updated()` ([line 1252](src/pill-logger-card.ts:1252)).
- **Issue:** O(n) scan of every entity in the instance on every render. Combined with finding #1 (no `shouldUpdate`), this runs on every state tick system-wide.
- **Best practice:** Cache the resolved map keyed by `this.config.device_id` + a hash of `hass.entities` references; only re-resolve when the device id or entity registry changes.

---

## 🟠 Medium — UX / Accessibility / HA Conventions

### 6. Native `window.confirm()` for the pill-limit override
- **Where:** [`_handleTakePill()`](src/pill-logger-card.ts:397) — `if (!confirm(...)) return;`.
- **Issue:** `confirm()` is synchronous, blocks the UI thread, is not themeable, is not focus-trapped, and breaks the HA visual language. The Tools panel already uses a custom dialog for the same kind of confirmation — this is inconsistent.
- **Best practice:** Reuse the existing `_toolsDialog`/`_renderToolsDialog` pattern (or HA's `showAlertDialog` / `ha-dialog`) for the override confirmation.

### 7. Custom dialog implementation instead of `ha-dialog`
- **Where:** [`_renderDeviceInfoDialog`](src/pill-logger-card.ts:512), [`_renderRefillDialog`](src/pill-logger-card.ts:527), [`_renderToolsDialog`](src/pill-logger-card.ts:1132) — hand-rolled `.dialog-backdrop` with `position: fixed; z-index: 999`.
- **Issue:** No focus trapping, no restore-focus, no scroll-lock, no `role="dialog"`/`aria-modal`, ESC handling is partial, stacking context can be broken by parent transforms. HA ships `ha-dialog` (MDC-based) specifically to solve these.
- **Best practice:** Migrate to `ha-dialog` (or `showAlertDialog`/`showConfirmationDialog` from `home-assistant/src/dialogs/...`) which handle a11y, focus, and stacking correctly.

### 8. Accessibility: icon-only buttons lack `aria-label`
- **Where:** Tools pane selector button ([line 1168](src/pill-logger-card.ts:1168) — `label: ''`), graph carousel nav buttons ([lines 655, 665](src/pill-logger-card.ts:655)), timeframe chips, stat-pill click targets.
- **Issue:** Screen readers announce only the icon (or nothing). The Tools tab has an empty `<span>`.
- **Best practice:** Add `aria-label` to every icon-only / low-text interactive element.

### 9. No localization — hardcoded English throughout
- **Where:** Every render string ("Take Pill", "LIMIT REACHED", "Loading history...", "No dose data yet", "Refill Medication", "Cancel", "Confirm", etc.) and `computeLabel`/`computeHelper` in [`getConfigForm()`](src/pill-logger-card.ts:1408).
- **Issue:** HA cards are expected to support `hass.localize` / a language file. The project even reserves `src/localize/languages/` (empty) but never wires it up.
- **Best practice:** Add a `localize` helper backed by a language file and route all user-facing strings through it; use `hass.locale` for number/date formatting.

### 10. `setConfig` does not throw on invalid config
- **Where:** [`setConfig()`](src/pill-logger-card.ts:96) — silently stores config even when `device_id` is missing; `render()` later shows a fallback.
- **Issue:** HA's contract is: throw an `Error` from `setConfig` so HA renders an **error card** with the message. Silent fallback hides misconfiguration from the user in the YAML editor.
- **Best practice:** `if (!config.device_id) throw new Error('A device is required');` (after the legacy-chips migration). Keep the visual fallback only for the "newly added, not yet configured" stub case.

### 11. `getGridOptions()` returns `rows: 'auto'` as a string
- **Where:** [`getGridOptions()`](src/pill-logger-card.ts:1275).
- **Issue:** HA docs show numeric `rows`/`min_rows`/`max_rows`/`columns`. `'auto'` works in some versions but is not the documented contract and can produce inconsistent section layouts.
- **Best practice:** Return explicit numeric sizing (e.g. `rows: 4, min_rows: 4, max_rows: 8, columns: 12`) per pane, or compute from `getCardSize()`.

---

## 🟡 Low — Code Quality / Maintainability

### 12. Custom `PillLoggerHass` type instead of the official `HomeAssistant` type
- **Where:** [`PillLoggerHass`](src/pill-logger-card.ts:27).
- **Issue:** Re-declares a subset of `HomeAssistant` with `any`-typed `attributes` and a `callService` signature that drops the return type. Loses type safety and bypasses `custom-card-helpers` / `home-assistant` typings.
- **Best practice:** `import { HomeAssistant } from 'custom-card-helpers';` and `hass?: HomeAssistant;`. Keep a thin extension only for genuinely extra fields.

### 13. Class does not implement the `LovelaceCard` interface
- **Where:** [`PillLoggerCard extends LitElement`](src/pill-logger-card.ts:79).
- **Issue:** Has the right methods (`setConfig`, `getCardSize`, `getGridOptions`, `hass`) but no `implements LovelaceCard`, so TS doesn't enforce the contract.
- **Best practice:** `implements LovelaceCard` from `custom-card-helpers`.

### 14. Errors silently swallowed
- **Where:** [`_fetchAmountHistory`](src/pill-logger-card.ts:789) `catch (_e) {}`, [`_fetchDoseHistory`](src/pill-logger-card.ts:815) `catch (_e) {}`, and several `catch {}` in compute helpers.
- **Issue:** Impossible to debug failed history fetches in production.
- **Best practice:** Log via a module-level `const logger = console;` (or HA's `Logger`) at `debug`/`warn` level, and surface a user-visible error state when the custom endpoint is unreachable.

### 15. `--rgb-error-color` fallback values are inconsistent
- **Where:** `.take-pill-btn.danger` uses `244, 67, 54` ([line 1603](src/pill-logger-card.ts:1603)) while `.tool-btn.danger:hover` uses `219, 68, 55` ([line 2077](src/pill-logger-card.ts:2077)).
- **Issue:** Two different "error red" fallbacks; if the theme var is absent the colors mismatch.
- **Best practice:** Use one shared fallback constant.

### 16. `ll-rebuild` + `sessionStorage` flag + 2 s safety-net timeout
- **Where:** [`_handlePaneChange()`](src/pill-logger-card.ts:485) and [`connectedCallback()`](src/pill-logger-card.ts:1226).
- **Issue:** This is a known fragile pattern; the 2 s `setTimeout` "safety net" is a code smell indicating the rebuild detection isn't deterministic. Modern HA cards generally avoid `ll-rebuild` for internal pane state — pane state can live in `@state` and survive because the element isn't recreated.
- **Best practice:** Investigate whether `ll-rebuild` is still needed at all; if pane state must persist across dashboard edits, prefer storing it in the card config (via `fireEvent('config-changed')`) rather than `sessionStorage` + rebuild flags.

### 17. `requestUpdate()` called manually in `connectedCallback` and `_handlePaneChange`
- **Where:** [line 1246](src/pill-logger-card.ts:1246) and [line 494](src/pill-logger-card.ts:494).
- **Issue:** Lit already re-renders on `@state`/`@property` mutation; manual `requestUpdate()` is usually redundant. In `_handlePaneChange` it is immediately followed by `ll-rebuild` which recreates the element anyway.
- **Best practice:** Remove redundant `requestUpdate()` calls; rely on reactive state.

### 18. Config defaults mutated into user config inside `setConfig`
- **Where:** [`setConfig()`](src/pill-logger-card.ts:108) spreads defaults into `this.config`.
- **Issue:** Persisted config then contains the defaults, which can mask future default changes and pollute YAML.
- **Best practice:** Keep defaults in a separate accessor (e.g. `_effectiveConfig()`) or use `hasConfigChanged`-style checks, rather than writing defaults into the stored config object.

### 19. History fetch omits optimization params
- **Where:** [`_fetchAmountHistory()`](src/pill-logger-card.ts:765) — `/api/history/period/${startTime}?filter_entity_id=...&end_time=...`.
- **Issue:** No `minimal_response` or `significant_changes_only=1`, so the payload includes full attribute dicts for every change. For a sensor that updates every 2 minutes over 30 days this is large.
- **Best practice:** Add `&minimal_response&significant_changes_only=1` (the card only reads `state` + `last_changed`).

### 20. `preview: false` in the customCards registration
- **Where:** [line 2100](src/pill-logger-card.ts:2100).
- **Issue:** Disables the card preview in the card picker. Not a guideline violation, but a missed UX opportunity; a stub preview improves discoverability.
- **Best practice:** Provide a `preview` function or `preview: true` with a stub config once the card is preview-safe.

---

## Summary Table

| # | Severity | Area | One-line |
|---|----------|------|----------|
| 1 | High | Perf | No `shouldUpdate` → re-render on every state tick |
| 2 | High | API | Raw `fetch` + manual token instead of `hass.callApi` |
| 3 | High | Lifecycle | No `disconnectedCallback` cleanup |
| 4 | High | Correctness | Fetch races on rapid timeframe changes |
| 5 | High | Perf | `_resolveEntities` O(n) scan every render |
| 6 | Medium | UX | Native `confirm()` for override |
| 7 | Medium | A11y | Custom dialogs instead of `ha-dialog` |
| 8 | Medium | A11y | Icon-only buttons missing `aria-label` |
| 9 | Medium | i18n | Hardcoded English, no localize |
| 10 | Medium | Contract | `setConfig` doesn't throw on invalid config |
| 11 | Medium | Layout | `getGridOptions` returns string `rows` |
| 12 | Low | Types | Custom `PillLoggerHass` not `HomeAssistant` |
| 13 | Low | Types | No `implements LovelaceCard` |
| 14 | Low | Diagnostics | Errors silently swallowed |
| 15 | Low | CSS | Inconsistent error-color fallbacks |
| 16 | Low | Design | Fragile `ll-rebuild` + sessionStorage + timeout |
| 17 | Low | Lit | Redundant manual `requestUpdate()` |
| 18 | Low | Config | Defaults mutated into user config |
| 19 | Low | Perf | History fetch lacks `minimal_response` |
| 20 | Low | UX | `preview: false` — no card picker preview |

## Recommended Fix Order
1. #1 + #5 (shouldUpdate + entity cache) — biggest perf win, low risk.
2. #2 + #4 + #3 (callApi + fetch token + disconnectedCallback) — correctness & stability.
3. #6 + #7 (replace `confirm` and custom dialogs with `ha-dialog`) — UX/a11y.
4. #10 + #11 (setConfig throw, getGridOptions numbers) — HA contract compliance.
5. #8 + #9 (aria-labels, localize) — accessibility/i18n.
6. #12–#20 — incremental cleanup.