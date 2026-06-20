# Audit Plan — Findings #12–#20 (Incremental Cleanup)

**Scope:** Categorize the remaining 8 audit findings by **stability** and **performance** priority, and flag anything that blocks acceptance on the **official HACS list**.

**Repo under audit:** `/workspaces/lovelace-pill-logger-card/` (the frontend Lovelace card repository, distributed separately from the backend integration).

---

## 1. HACS Blocker Analysis

### What HACS requires for a Lovelace-card repository

HACS validates repository-level metadata before listing a card on the official/default store. For a **Lovelace** category repository, the hard requirements are:

| Requirement | Status | Detail |
|---|---|---|
| `README.md` in repo root | **MISSING** | The frontend repo has no `README.md` at all. HACS rejects repositories without one. |
| `LICENSE` file in repo root | **MISSING** | No `LICENSE` file in the frontend repo root (only inside `node_modules/`). HACS requires an OSI-approved license file. |
| `hacs.json` in repo root | **MISSING** | The frontend repo has no `hacs.json`. The backend repo has one (`"name": "Pill logger"`, category Integration), but the card repo needs its own with `"Lovelace"` category and a `filename` pointing at the built bundle. |
| Built `.js` artifact tracked in repo | Present | `dist/pill-logger-card.js` is the Rollup output; confirm it is committed (not gitignored). |

> **None of the code-level findings #12–#20 are HACS blockers.** HACS does not lint for `implements LovelaceCard`, type imports, CSS fallback consistency, or `preview: false`. Those are code-quality issues, not listing gates.

### HACS blocker remediation (separate from #12–#20)

These three missing files are the **only** true blockers for official HACS listing of the card repo. They are repo-metadata tasks, not code changes:

1. **`hacs.json`** — minimal:
   ```json
   {
     "name": "Pill Logger Card",
     "render_readme": true,
     "filename": "dist/pill-logger-card.js",
     "content_in_root": false
   }
   ```
   (No `homeassistant`/`hacs` version keys needed for a Lovelace repo — those are for Integration repos. `filename` tells HACS which file to serve as the resource.)

2. **`README.md`** — user-facing install/usage instructions for the card (HACS renders this on the store page when `render_readme: true`).

3. **`LICENSE`** — copy the backend's license (or pick MIT/Apache-2.0) into the frontend repo root.

---

## 2. Findings #12–#20 Categorized

### Tier A — Stability (correctness / robustness)

| # | Finding | Risk | Why it matters |
|---|---|---|---|
| **#16** | `ll-rebuild` + `sessionStorage` flag + 2 s safety-net timeout | **Medium** | The 2 s `setTimeout` is a non-deterministic safety net. If `ll-rebuild` does recreate the element but the timeout fires first (slow render), the flag is cleared early and the next *genuine* view entry could incorrectly restore a stale pane. Conversely if `ll-rebuild` does NOT recreate the element (HA version variance), the pane switch silently fails and the user sees no change. This is the most fragile pattern remaining. |
| **#18** | Config defaults mutated into user config inside `setConfig` | **Low-Medium** | `setConfig` spreads `show_amount_in_body: true`, etc. into `this.config`. Once HA persists the config (visual editor save), those defaults are baked into the user's YAML/storage. If a future version changes a default, existing users won't pick it up — their config explicitly says `true`. Also pollutes YAML exports with keys the user never set. |
| **#14** | Silent `catch {}` in compute helpers | **Low** | The two fetch catch blocks were already upgraded to `console.warn` in Batch 2. The **4 remaining** silent catches are in `_computeNextDose` (line 376), `_computeOverTime` (line 406), `_computeWindowExpiry` (line 431), `_computeTimeSinceLastDose` (line 455). These wrap `new Date(state)` parsing — a `Date` constructor practically never throws on a string, so these catches are defensive-but-dead code. Low real-world risk, but they hide any unexpected throw during debugging. |

### Tier B — Performance

| # | Finding | Risk | Why it matters |
|---|---|---|---|
| **#17** | Redundant `requestUpdate()` in `connectedCallback` and `_handlePaneChange` | **Low** | `connectedCallback` line 1447 calls `this.requestUpdate()` after setting `_activePane` (a `@state` property) — Lit already schedules a render from the state mutation. The call is redundant. In `_handlePaneChange` line 600, `requestUpdate()` is followed by `ll-rebuild` which recreates the element entirely, making the manual update a wasted cycle. No measurable impact on a single card, but it's noise that obscures the reactive-data-flow story. |

> **Note:** #19 (history fetch optimization params) was already fixed in Batch 2 — `&minimal_response&significant_changes_only=1` is present on line 949. No remaining performance findings in #12–#20.

### Tier C — Type Safety / Contract (developer-facing, zero runtime impact)

| # | Finding | Risk | Why it matters |
|---|---|---|---|
| **#12** | Custom `PillLoggerHass` type instead of official `HomeAssistant` | **Low (dev-only)** | The card re-declares a subset of `HomeAssistant` with `any`-typed `attributes` and a `callService` that drops the return type. This loses IDE autocomplete and type-checking for `hass` usage. **However:** `custom-card-helpers` (which exports `HomeAssistant`) is not installed and the card is a standalone external bundle — importing it would add a build dependency that ships type-only (it's devDependencies). The current `PillLoggerHass` works at runtime. This is a code-quality / maintainability issue, not a runtime bug. |
| **#13** | Class does not `implements LovelaceCard` | **Low (dev-only)** | The class has the right methods (`setConfig`, `getCardSize`, `getGridOptions`, `hass`) but TS doesn't enforce the interface. Adding `implements LovelaceCard` (from `custom-card-helpers`) would catch signature drift at compile time. Same dependency caveat as #12. Zero runtime impact. |

### Tier D — UX / Polish

| # | Finding | Risk | Why it matters |
|---|---|---|---|
| **#15** | `--rgb-error-color` fallback values inconsistent | **Low (visual)** | `.take-pill-btn.danger` uses `244, 67, 54` (Material 2 red) at lines 1876/1881, while `.tool-btn.danger:hover` uses `219, 68, 55` (Google red) at line 2344. When the theme variable is absent (e.g. custom theme that doesn't define `--rgb-error-color`), the two danger buttons render slightly different reds. Trivial visual inconsistency. |
| **#20** | `preview: false` in customCards registration | **Low (UX)** | Line 2380 sets `preview: false`, so the card shows no preview thumbnail in the card-picker dialog. Not a violation — many HACS cards ship without previews. A stub preview improves discoverability but requires the card to render with a fake `hass`/`config`, which is non-trivial for a card that fetches history. Nice-to-have, not a blocker. |

---

## 3. Recommended Fix Order

Grouped by tier, with dependency notes:

### Batch 6 — Stability fixes (#16 + #18 + #14 + #17)
These are the only findings with any runtime/robustness impact. They can be done together since #16 and #17 touch the same pane-change/connectedCallback code.

1. **#16 — Remove `ll-rebuild` + sessionStorage pane persistence.**
   - Modern HA does not recreate Lovelace cards on internal state changes. The `ll-rebuild` pattern was a workaround for an older HA behavior where switching panes via `@state` didn't survive dashboard reflows.
   - **Proposed fix:** Delete the `ll-rebuild` dispatch, the `sessionStorage` flag/pane keys, and the 2 s safety-net timeout entirely. Pane state lives in `@state` and survives because the element is not recreated. If pane persistence across full page reloads is desired, store it in the card config (via `fireEvent('config-changed')`) instead of `sessionStorage`.
   - **Risk:** Must verify pane switching still works after dashboard edit (HA may recreate the element on config save — in that case pane resets to default, which is acceptable).

2. **#17 — Remove redundant `requestUpdate()` calls.**
   - Delete `this.requestUpdate()` at line 1447 (`connectedCallback`) and line 600 (`_handlePaneChange`).
   - Lit auto-renders on `@state` mutation; the manual calls are no-ops or wasted cycles.

3. **#18 — Stop mutating defaults into user config.**
   - Replace the spread-defaults pattern in `setConfig` (lines 156–162) with a `_getEffectiveConfig()` accessor that merges defaults at read time, leaving `this.config` as the raw user-provided object.
   - All reads of `this.config?.show_amount_in_body` etc. route through the accessor.
   - **Risk:** Must audit every `this.config?.` read site (~15 usages) to ensure they use the accessor or handle the absent key. Low risk but touches many lines.

4. **#14 — Add `console.warn` to the 4 silent compute-helper catches.**
   - Lines 376, 406, 431, 455: change `catch {` to `catch (e) { console.warn('[pill-logger-card] compute failed:', e); }`.
   - These catches are practically dead (Date constructor doesn't throw on strings), but the logging costs nothing and aids debugging.

### Batch 7 — Type safety / contract (#12 + #13)
These are dev-only improvements with zero runtime impact. They require adding `custom-card-helpers` as a dev dependency.

5. **#12 + #13 — Import `HomeAssistant` and `LovelaceCard` from `custom-card-helpers`.**
   - `yarn add -D custom-card-helpers`
   - Replace `PillLoggerHass` with `HomeAssistant` (keep a thin extension interface only if the card uses fields not on `HomeAssistant` — it doesn't; `callApi`/`callService`/`states`/`entities`/`language` are all on the official type).
   - Add `implements LovelaceCard` to the class declaration.
   - **Risk:** `custom-card-helpers` types may not perfectly match the installed HA version's runtime shape. `skipLibCheck: true` in tsconfig mitigates this. The dependency is type-only (devDependency), so it doesn't ship in the bundle.

### Batch 8 — UX polish (#15 + #20)
Cosmetic; can be done independently.

6. **#15 — Unify `--rgb-error-color` fallback.**
   - Pick one value (recommend `244, 67, 54` — Material 2/3 standard) and use it in all 3 CSS rules.
   - Optionally extract to a CSS custom property: `--pill-logger-error-rgb: 244, 67, 54;` and reference `var(--rgb-error-color, var(--pill-logger-error-rgb))`.

7. **#20 — Card-picker preview.**
   - Either set `preview: true` (HA generates a default preview) or provide a `preview()` function that returns a stub element with fake data.
   - **Recommendation:** Defer unless the card can render meaningfully without a live `hass`. A broken preview is worse than no preview. Mark as optional/future.

### Batch 9 — HACS listing metadata (separate from code)
Not part of the audit findings, but required for official HACS listing:

8. **Create `hacs.json`** in the frontend repo root (Lovelace category, `filename: dist/pill-logger-card.js`).
9. **Create `README.md`** with install/usage instructions for the card.
10. **Create `LICENSE`** (copy from backend or pick MIT).

---

## 4. Summary Matrix

| # | Tier | HACS Blocker? | Batch | Effort |
|---|---|---|---|---|
| #12 | Type safety | No | 7 | Low (add dep, swap type) |
| #13 | Type safety | No | 7 | Low (add `implements`) |
| #14 | Stability | No | 6 | Trivial (4 catch blocks) |
| #15 | UX polish | No | 8 | Trivial (CSS fallback) |
| #16 | Stability | No | 6 | Medium (remove ll-rebuild, verify) |
| #17 | Performance | No | 6 | Trivial (delete 2 calls) |
| #18 | Stability | No | 6 | Medium (accessor refactor) |
| #20 | UX polish | No | 8 | Optional (preview) |
| — | **HACS metadata** | **YES** | 9 | Low (3 files) |

**Bottom line:** No code finding in #12–#20 blocks HACS acceptance. The **only** HACS blockers are the missing `README.md`, `LICENSE`, and `hacs.json` in the frontend repo root. Among the code findings, #16 (ll-rebuild fragility) is the highest-priority stability item and #18 (config-default mutation) is the highest-priority correctness item; both belong in Batch 6.