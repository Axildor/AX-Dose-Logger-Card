# Full-Card Font-Size & Touch-Target UX Audit

**Date:** 2026-06-26
**Scope:** All non-dialog text and touch targets across the AX Dose Logger Card.
**Standards:** WCAG 1.4.3 (body text min 16px), WCAG 2.5.5 (touch target min 44×44px, 24×24 AA concession), Material 3 type scale.

## Sizing architecture

Nearly all text uses `calc(Npx + var(--pill-text-offset, 0px))`, where `--pill-text-offset` is `0px` when `big_text` is ON and `-2px` when OFF (see [`ax-dose-logger-card.ts:1098`](src/ax-dose-logger-card.ts:1098)). The **baseline** (`Npx`) is the real size most users see; the audit targets the baseline. The `--pill-text-offset` opt-in mechanism is preserved on every bumped rule.

## Material 3 type scale reference

| Token | Size | Typical use |
|---|---|---|
| headline-small | 24px | Dialog headers |
| title-large | 22px | Card identity |
| title-medium | 18px | Primary actions, stat values |
| body-large | 16px | Primary body text (WCAG min) |
| body-medium | 14px | Secondary body |
| body-small | 13px | Tertiary body |
| label-medium | 12px | Compact labels |
| label-small | 11px | Dense labels |

## Inventory + assessment

### Tier 1 — Critical primary content — PASS

| Element | File:Line | Baseline | Verdict |
|---|---|---|---|
| Med name | `daily-panel.ts:153` | 20px | ✅ |
| Take-pill label | `daily-panel.ts:217` | 18px | ✅ |
| Take-pill subtext | `daily-panel.ts:222` | 16px | ✅ |
| Stat value (Safe/Pills) | `daily-panel.ts:254` | 18px | ✅ |
| Stats cell value | `stats-panel.ts:151` | 18px | ✅ |

### Tier 2 — Secondary labels — NEEDS WORK

| Element | File:Line | Baseline | Verdict | Target |
|---|---|---|---|---|
| Stat label (Safe/Pills) | `daily-panel.ts:247` | 14px | ⚠️ | 15px |
| Stats cell label | `stats-panel.ts:144` | 12px | 🔴 | 14px |
| Nav bar title | `ax-dose-logger-card.ts:1372` | 15px | ⚠️ | 16px |
| Graph nav-title | `graphs-panel.ts:494` | 15px | ⚠️ | 16px |
| Tools section header | `tools-panel.ts:162` | 14px | ⚠️ | 16px |
| Tracking label | `tracking-panel.ts:114` | 14px | ⚠️ | 16px |

### Tier 3 — Tertiary / chart annotations — MIXED

| Element | File:Line | Baseline | Verdict | Target |
|---|---|---|---|---|
| Chip name | `daily-panel.ts:287` | 10px | 🔴 | 12px |
| Chip value | `daily-panel.ts:296` | 16px | ✅ | — |
| Tracking badge | `tracking-panel.ts:120` | 11px | 🔴 | 12px |
| Tracking scale tick | `tracking-panel.ts:176` | 10px | ⚠️ chart | 11px |
| Graph Y-axis labels | `graphs-panel.ts:177,368` | 10px | ⚠️ chart | 11px |
| Graph "Current:" label | `graphs-panel.ts:382` | 11px | 🔴 | 12px |
| Graph time labels | `graphs-panel.ts:402` | 9px | 🔴 smallest | 11px |
| Graph loading text | `graphs-panel.ts:264` | 13px | ⚠️ | 14px |
| Avg-day-box label | `graphs-panel.ts:610` | 11px | 🔴 | 12px |
| Avg-day-box value | `graphs-panel.ts:618` | 15px | ⚠️ | 16px |
| Timeframe chip | `graphs-panel.ts:529` | 10px | 🔴 + touch | 12px |
| Placeholder subtitle | `ax-dose-logger-card.ts:1072` | 13px | ⚠️ | 14px |
| Tools body text | `tools-panel.ts:157,190` | 13px | ⚠️ | 14px |

### Tier 4 — Touch targets (WCAG 2.5.5) — NEEDS WORK

| Element | File:Line | Current | Verdict | Target |
|---|---|---|---|---|
| Graph nav-btn | `graphs-panel.ts:470` | 32×32px | 🔴 | 40×40px (AA) |
| Timeframe chip | `graphs-panel.ts:528` | ~20px tall | 🔴 | 4px 10px padding + 12px font (~28px) |
| Pane-btn | `ax-dose-logger-card.ts:1382` | ~40px | ⚠️ | padding 10→12px |

## Recommended changes

| Priority | Element | Baseline → Target |
|---|---|---|
| High | Stats cell label | 12 → 14px |
| High | Chip name | 10 → 12px |
| High | Tracking badge | 11 → 12px |
| High | Graph "Current:" label | 11 → 12px |
| High | Avg-day-box label | 11 → 12px |
| High | Graph time labels | 9 → 11px |
| Medium | Stat label (Safe/Pills) | 14 → 15px |
| Medium | Nav bar title | 15 → 16px |
| Medium | Graph nav-title | 15 → 16px |
| Medium | Tools section header | 14 → 16px |
| Medium | Tracking label | 14 → 16px |
| Medium | Avg-day-box value | 15 → 16px |
| Medium | Graph loading text | 13 → 14px |
| Medium | Placeholder subtitle | 13 → 14px |
| Medium | Tools body text (×2) | 13 → 14px |
| Medium | Graph Y-axis labels (×2) | 10 → 11px |
| Medium | Tracking scale tick | 10 → 11px |
| Touch | Graph nav-btn | 32 → 40px |
| Touch | Timeframe chip | 10px/2px 6px → 12px/4px 10px |
| Touch | Pane-btn padding | 10 → 12px |

## No change (already compliant)

Med name (20px), take-pill label/sub (18/16px), stat values (18px), chip value (16px), dialog text (fixed in prior task), graph placeholder title (16px), caffeine placeholder (16px).

## Key design decisions

1. **Preserve `--pill-text-offset` on every bumped rule** — the existing `big_text` opt-in must keep working; all bumps stay `calc(newN + var(--pill-text-offset, 0px))`.
2. **Chart annotations get a modest bump, not 16px** — Y-axis labels, time labels, and scale ticks go to 11px, not 16px. The 320px-wide graph cannot fit 13 time labels at 16px without overlap; 11px preserves information density while improving on 9-10px.
3. **Touch targets use the AA concession (24×24 / ~40px)** — full 44×44 would break the compact carousel header and chip row layout; 40px is the WCAG 2.5.5 AA concession for dense UIs.
4. **Content labels (chip name, badge, "Current:", avg-label) → 12px (M3 label-medium)** — these are genuine content identifiers, not annotations; 12px is the smallest M3 token that's still a "label" role rather than ad-hoc.
5. **No README / localization / backend changes** — pure CSS across 6 component files; all rules continue using existing HA theme tokens.