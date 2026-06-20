# Plan — #12 + #13 HomeAssistant type + implements LovelaceCard

## Audit Findings

### `custom-card-helpers@2.0.0` analysis

The package exports `HomeAssistant` and `LovelaceCard` interfaces. However, there are **critical compatibility issues**:

#### Problem 1: `entities` and `devices` are NOT on `HomeAssistant`

The `HomeAssistant` interface from `custom-card-helpers` is based on `home-assistant-js-websocket`'s types. It has:
- `states: HassEntities` ✓
- `callService` ✓ (different signature)
- `callApi` ✓ (different signature)
- `language: string` ✓ (not optional)
- `config: HassConfig`, `themes`, `panels`, `user`, `resources`, `localize`, etc.

It does **NOT** have:
- `entities: Record<string, { device_id?, platform?, name? }>` — this is an HA **frontend** extension added by the entity registry, not part of the websocket protocol
- `devices: Record<string, { name? }>` — same, HA frontend extension

The card uses `this.hass.entities` in `_computeEntities()` (the core entity-resolution logic) and `this.hass.devices` in `_getMedName()`. These are **essential** — the card cannot function without them.

#### Problem 2: `callApi` signature mismatch

| Card's `PillLoggerHass` | `custom-card-helpers` `HomeAssistant` |
|---|---|
| `callApi(method: 'get' \| 'post' \| 'put' \| 'delete', path, data?)` | `callApi<T>(method: "GET" \| "POST" \| "PUT" \| "DELETE", path, parameters?)` |

The card calls `this.hass.callApi('get', 'history/period/...')` with lowercase methods. The official type expects uppercase. At runtime, HA's `callApi` is case-insensitive, but TypeScript would flag this as a type error.

#### Problem 3: `callService` signature mismatch

| Card's `PillLoggerHass` | `custom-card-helpers` `HomeAssistant` |
|---|---|
| `callService(domain, service, data?)` | `callService(domain, service, serviceData?, target?)` |

The card calls `this.hass.callService('button', 'press', { entity_id })`. The parameter name differs (`data` vs `serviceData`) but positionally compatible. The 4th `target` param is optional. This would work but loses the semantic naming.

#### Problem 4: Bundle bloat

`custom-card-helpers` has 4 runtime dependencies:
- `home-assistant-js-websocket` (~50KB)
- `@formatjs/intl-utils`
- `intl-messageformat` (~30KB)
- `superstruct` (~20KB)

The Rollup config uses `nodeResolve()` which would bundle all of these into `dist/pill-logger-card.js`. The current bundle is a single-file card; adding ~100KB of unused dependencies for **type-only** imports is unacceptable.

### `LovelaceCard` interface analysis

```typescript
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  isPanel?: boolean;
  editMode?: boolean;
  getCardSize(): number | Promise<number>;
  setConfig(config: LovelaceCardConfig): void;
}
```

The card has `getCardSize()` and `setConfig()` — compatible. But `LovelaceCard extends HTMLElement`, and the card `extends LitElement`. LitElement extends HTMLElement, so this is structurally compatible. However, `setConfig(config: LovelaceCardConfig)` expects `LovelaceCardConfig` (which has `type: string` + `[key: string]: any`), while the card's `setConfig(config: PillLoggerCardConfig)` uses a specific interface. TypeScript's bivariant function parameter checking would allow this.

## Solution

### Approach: Type-only import + interface extension (no bundle bloat)

The key insight: **TypeScript type imports are erased at compile time**. If we import only the types (using `import type`), Rollup's `nodeResolve` won't bundle the runtime dependencies. We need:

1. Add `custom-card-helpers` as a **devDependency** only (type-only)
2. Use `import type { HomeAssistant, LovelaceCard } from 'custom-card-helpers';`
3. Extend `HomeAssistant` with a thin interface for the HA frontend-specific fields (`entities`, `devices`)
4. Add `implements LovelaceCard` to the class

### Step 1: Install as devDependency

```bash
yarn add -D custom-card-helpers
```

This adds it to `devDependencies` — not shipped in the production bundle.

### Step 2: Type-only import

```typescript
import type { HomeAssistant, LovelaceCard } from 'custom-card-helpers';
```

`import type` tells TypeScript and Rollup that this is type-only — no runtime code is emitted, and `nodeResolve` won't try to bundle the package's runtime dependencies.

### Step 3: Replace `PillLoggerHass` with extended `HomeAssistant`

```typescript
// HA frontend extensions not in custom-card-helpers' HomeAssistant type.
// These are added by the entity registry at runtime.
interface PillLoggerHass extends HomeAssistant {
  entities: Record<string, {
    device_id?: string;
    platform?: string;
    name?: string;
  }>;
  devices?: Record<string, { name?: string }>;
}
```

This keeps the official `HomeAssistant` type as the base (with all its fields: `states`, `callService`, `callApi`, `language`, `config`, `themes`, etc.) and adds only the two frontend-specific fields the card uses.

**But** — the `callApi` signature mismatch (lowercase vs uppercase methods) means the card's `callApi('get', ...)` calls would be type errors. We need to either:
- (a) Change all `callApi('get', ...)` to `callApi('GET', ...)` — 2 call sites
- (b) Override `callApi` in the extension interface

Option (a) is cleaner — HA's runtime `callApi` accepts both cases, and the uppercase form matches the official type. Only 2 call sites to change.

### Step 4: Add `implements LovelaceCard`

```typescript
export class PillLoggerCard extends LitElement implements LovelaceCard {
```

This enforces the contract at compile time. The card already has `hass?`, `setConfig()`, and `getCardSize()` — all compatible. `isPanel?` and `editMode?` are optional and not needed.

### Step 5: Fix `callApi` call sites

Change lowercase method strings to uppercase:
- `_fetchAmountHistory`: `callApi('get', ...)` → `callApi('GET', ...)`
- `_fetchDoseHistory`: `callApi('get', ...)` → `callApi('GET', ...)`

### Step 6: Update `shouldUpdate` and `_relevantStateChanged` type references

Change `PillLoggerHass | undefined` to just `PillLoggerHass | undefined` (still the extension interface, which now extends `HomeAssistant`). No functional change — the type is still the same name, just a richer base.

### Step 7: Remove redundant fields from `PillLoggerHass`

The current `PillLoggerHass` re-declares `states`, `callService`, `callApi`, `language`. After extending `HomeAssistant`, these are inherited — only `entities` and `devices` need to be declared.

## Risk Analysis

### Risk 1: `import type` not erased by Rollup

**Mitigation:** TypeScript's `isolatedModules` + Rollup's TypeScript plugin handle `import type` correctly — the import is erased during transpilation. The `@rollup/plugin-typescript` plugin respects this. If there's any doubt, we can verify by checking the bundle size before/after (should be identical).

### Risk 2: `HomeAssistant` type doesn't match runtime shape

The `custom-card-helpers` `HomeAssistant` type is based on `home-assistant-js-websocket@9.6.0`. The actual HA frontend may have additional fields. But since we're using `skipLibCheck: true` in tsconfig, and the card only accesses fields it knows exist, this is safe. The type is a **subset** guarantee, not a complete match.

### Risk 3: `LovelaceCard.setConfig(config: LovelaceCardConfig)` vs card's `setConfig(config: PillLoggerCardConfig)`

TypeScript's bivariant function parameter checking (enabled by default when `strict: false`) allows this. The card's `PillLoggerCardConfig` is a narrower type than `LovelaceCardConfig` (which has `[key: string]: any`), so it's structurally compatible.

### Risk 4: `getCardSize()` return type

`LovelaceCard` expects `getCardSize(): number | Promise<number>`. The card returns `number` — compatible (number is a subtype).

## What does NOT change

- All runtime behavior — the `hass` object at runtime is the same HA frontend object
- All `hass.states`, `hass.entities`, `hass.devices`, `hass.callService`, `hass.callApi` calls work identically
- The bundle size — `import type` adds zero runtime code
- The build process — same Rollup config, same tsconfig

## Verification

1. `yarn build` — must compile without errors
2. Check bundle size — should be identical to pre-change (type-only import adds nothing)
3. Grep for any remaining `PillLoggerHass` references that need updating

## Files to modify

- `package.json` — add `custom-card-helpers` to devDependencies
- `src/pill-logger-card.ts` — add `import type`, rewrite `PillLoggerHass` as extension, add `implements LovelaceCard`, fix `callApi` call sites (2)