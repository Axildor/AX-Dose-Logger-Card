# Plan — #2 callApi + #4 fetch race guard + #3 disconnectedCallback cleanup

Scope: [`src/pill-logger-card.ts`](src/pill-logger-card.ts). Addresses audit findings #2, #3, #4 (and a free win on #19 — history fetch optimization params).

## Context confirmed
- **`hass.callApi(method, path, data?)`** is the HA-sanctioned REST helper (per HA Developers `frontend/data.md`). It handles auth headers, token refresh, and error handling. Path is relative to `/api/` (no leading `/api/`). Returns parsed JSON; throws on non-2xx.
- The card's custom [`PillLoggerHass`](src/pill-logger-card.ts:27) interface does **not** declare `callApi` — the current code casts to `any` to grab `auth.data.access_token`. I must add `callApi` to the interface.
- History endpoint supports `&minimal_response&significant_changes_only=1` (audit #19) — free payload-size win while we're rewriting the fetch.
- Current `disconnectedCallback` only stops the tick timer; the 2 s `ll-rebuild` safety-net `setTimeout` in [`_handlePaneChange`](src/pill-logger-card.ts:554) is never cleared.

## Changes

### 1. Add `callApi` to the `PillLoggerHass` interface
```ts
interface PillLoggerHass {
  states: ...;
  entities: ...;
  devices?: ...;
  callService(...): Promise<void>;
  callApi(method: 'get' | 'post' | 'put' | 'delete', path: string, data?: Record<string, any>): Promise<any>;
}
```
This removes the `(this.hass as any).auth?.data?.access_token` access entirely.

### 2. Add fetch-cancellation + race-guard fields
```ts
// In-flight fetch management (#3 + #4): AbortController lets disconnectedCallback
// cancel pending requests so they never write state to a detached element. The
// _fetchToken guards against races when the user rapidly switches timeframes.
private _fetchAbort: AbortController | null = null;
private _fetchToken: number = 0;
private _rebuildTimeout: number | null = null;  // tracks the 2s ll-rebuild safety net
```

### 3. Rewrite `_fetchAmountHistory()` (#2 + #4 + #19)
- Replace `fetch(url, { headers: Bearer token })` with `this.hass.callApi('get', 'history/period/' + startTime + '?filter_entity_id=' + entityId + '&end_time=' + endTime + '&minimal_response&significant_changes_only=1')`.
- Capture `const token = ++this._fetchToken` at entry; after `await`, `if (token !== this._fetchToken) return;` so a stale (older) request can't overwrite a newer one.
- Wrap in `try/catch` — `callApi` throws on error (no more `response.ok` check needed). Keep the silent-fail behavior but log at `console.warn` (audit #14 partial — improves debuggability without changing UX).
- No `AbortController` signal needed for `callApi` (it doesn't accept one), but the token guard handles the race; `disconnectedCallback` bumps the token so any in-flight result is discarded.

### 4. Rewrite `_fetchDoseHistory()` (#2 + #4)
- Same pattern: `this.hass.callApi('get', 'pill_logger/history/' + deviceId)`.
- Same token-guard + try/catch + warn-on-error treatment.
- Uses the same `_fetchToken` counter (both fetches are triggered together on pane entry; a new pane/timeframe change invalidates both).

### 5. Extend `disconnectedCallback()` (#3)
```ts
disconnectedCallback(): void {
  super.disconnectedCallback();
  this._stopTickTimer();
  // Invalidate any in-flight fetch so it can't write state to a detached element.
  this._fetchToken++;
  this._fetchAbort = null;
  // Clear the 2s ll-rebuild safety-net timeout if it's still pending.
  if (this._rebuildTimeout !== null) {
    window.clearTimeout(this._rebuildTimeout);
    this._rebuildTimeout = null;
  }
}
```

### 6. Track the `ll-rebuild` safety-net timeout in `_handlePaneChange()` (#3)
Replace the bare `setTimeout(...)` at [line 554](src/pill-logger-card.ts:554) with:
```ts
this._rebuildTimeout = window.setTimeout(() => {
  sessionStorage.removeItem('pill_logger_rebuilding_' + deviceId);
  this._rebuildTimeout = null;
}, 2000);
```

## What does NOT change
- The history response shape (`[[{state, last_changed, ...}], ...]`) is unchanged — `callApi` returns the same parsed JSON the manual `fetch` did.
- The decimation logic (MAX_NODES=800) is untouched.
- The `updated()` lifecycle triggers for fetches are untouched.
- All render paths, dialogs, pane switching, countdowns — untouched.
- `callService` calls (button presses, number set_value) are already correct and stay as-is.

## Functionality-preservation checklist
- [ ] `callApi('get', 'history/period/...')` returns the same `[[{state, last_changed}]]` shape → graph renders identically.
- [ ] `callApi('get', 'pill_logger/history/...')` returns the same `[[ts, strength]]` array → bar graph buckets identically.
- [ ] Token guard: only the **latest** fetch writes `_amountHistory`/`_doseHistory` — fixes the current race where the last-to-resolve wins regardless of click order.
- [ ] `disconnectedCallback` token bump: in-flight results discarded → no state write to detached element.
- [ ] `minimal_response&significant_changes_only=1`: smaller payload, same `state`+`last_changed` fields the card reads (attributes dropped, which the card never uses from history).
- [ ] 2s rebuild timeout cleared on disconnect → no orphaned timer firing after card removal.

## Verification
- `yarn build` — must compile with zero errors.
- Grep compiled bundle for `callApi` (replaces `access_token`/`Bearer` references).
- Manual smoke test (user): open Graphs pane, switch 48H→7D→30D rapidly, confirm graph shows the last-clicked timeframe (not a stale one).

## Files to modify
- `src/pill-logger-card.ts` — interface, fields, two fetch methods, `disconnectedCallback`, `_handlePaneChange`.
- `dist/pill-logger-card.js` — rebuilt.
- `memory-bank/activeContext.md` + `memory-bank/progress.md` — updated.
- No README change (internal correctness/stability refactor, no end-user UX change).