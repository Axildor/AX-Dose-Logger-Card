# Plan — Shared Fetch-Token Race (Amount-in-Body "Loading" on first pane switch)

## Bug
When the user first switches to the Graphs pane and then to the **Amount in Body** (line) graph slide, the graph stays on the "Loading history…" placeholder until the timeframe is manually changed.

## Root Cause
A single shared counter [`_fetchToken`](src/pill-logger-card.ts:123) guards **both** [`_fetchAmountHistory`](src/pill-logger-card.ts:912) and [`_fetchDoseHistory`](src/pill-logger-card.ts:960). On pane entry, [`updated()`](src/pill-logger-card.ts:1541) fires both fetches back-to-back:

```ts
if (changedProperties.has('_activePane')) {
  this._fetchAmountHistory(entities);  // captures token = N
  this._fetchDoseHistory(entities);    // captures token = N+1  → bumps _fetchToken
}
```

Each fetch does `const token = ++this._fetchToken;` at entry. The second call bumps the counter, so when the **first** fetch's `await` resolves, its guard `if (token !== this._fetchToken) return;` is true and the result is **discarded**. `_amountHistory` stays `[]` → [`_renderLineGraph`](src/pill-logger-card.ts:1013) renders the loading placeholder forever.

Manually changing the timeframe only calls `_fetchAmountHistory` (no dose fetch to bump the token), so its result is kept — which is why the workaround "fixes" it.

The dose fetch has the symmetric problem (its result is also discarded on pane entry), but it's less visible because the bar graph's initial render doesn't depend on `_doseHistory`.

## Fix
Give each fetch its **own** token so they can't invalidate each other. Both still share the disconnect invalidation (a single bump on disconnect invalidates both — see alternative below).

### Changes in [`src/pill-logger-card.ts`](src/pill-logger-card.ts)

1. **Replace the single `_fetchToken` field with two independent counters:**
   - `private _amountFetchToken: number = 0;`
   - `private _doseFetchToken: number = 0;`
   - Remove the old `_fetchToken` field and its comment block (lines 117–123).

2. **[`_fetchAmountHistory`](src/pill-logger-card.ts:923):** change `const token = ++this._fetchToken;` → `const token = ++this._amountFetchToken;` and the guard `if (token !== this._fetchToken)` → `if (token !== this._amountFetchToken)`.

3. **[`_fetchDoseHistory`](src/pill-logger-card.ts:966):** change `const token = ++this._fetchToken;` → `const token = ++this._doseFetchToken;` and the guard `if (token !== this._fetchToken)` → `if (token !== this._doseFetchToken)`.

4. **[`disconnectedCallback`](src/pill-logger-card.ts:1442):** bump **both** tokens so a disconnect invalidates all in-flight fetches:
   ```ts
   this._amountFetchToken++;
   this._doseFetchToken++;
   ```
   Update the comment to reference both counters.

5. **(Optional cleanup) Remove dead `_historyLoading` state** — declared at line 90 and listed in [`shouldUpdate`](src/pill-logger-card.ts:1482) but never written anywhere. It's harmless but misleading. Remove the field declaration and the `shouldUpdate` key-list entry. *(Separate concern from the race; can be skipped if you'd rather keep the diff minimal.)*

### Why two tokens (not one shared token captured *before* both calls)
A shared token captured once before both calls would also fix the pane-entry race, but it would **re-introduce** the rapid-timeframe-click race that the token was designed to prevent: two quick timeframe changes would both capture the same "outer" token and the slower one would overwrite the faster one's result. Independent per-fetch tokens preserve the original race-guard semantics for each fetch stream while removing the cross-stream interference.

## Verification
1. `yarn build` — clean compile.
2. Manual: load the card, switch to Graphs pane, switch to the Amount in Body slide → graph should populate without needing a timeframe change.
3. Manual: rapidly click timeframe chips → only the last click's data is shown (race guard still works).
4. Manual: navigate away from the dashboard mid-load and back → no stale data written to a detached element.

## Memory-bank updates (after verification)
- `memory-bank/activeContext.md` — new "Current Status" + "What Was Changed" entry.
- `memory-bank/progress.md` — append section with checklist.
- `README.md` — no change (internal bug fix, no UX/config impact).
- `memory-bank/projectstructure.md` — no change (no files added/removed).