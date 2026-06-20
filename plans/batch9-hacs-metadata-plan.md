# Plan — Batch 9: HACS Metadata Files (README.md, LICENSE, hacs.json)

## Goal

Create the 3 missing repository metadata files required for HACS listing acceptance.
These are the **only true HACS blockers** — without them, the repository cannot be submitted.

## HACS Requirements for a Dashboard Plugin (Lovelace Card)

Per [HACS documentation](https://hacs.xyz/docs/publish/plugin):

1. **`hacs.json`** in repository root — mandatory manifest
2. **`README.md`** in repository root — mandatory
3. **`LICENSE`** in repository root — mandatory (HACS checks for its presence)
4. A `.js` file matching the repository name (with `lovelace-` prefix stripped) in `/dist/` — **already satisfied**: [`dist/pill-logger-card.js`](../lovelace-pill-logger-card/dist/pill-logger-card.js) exists

HACS search order for the JS file: `/dist/` → latest GitHub release → root.
Our file is in `/dist/`, so `content_in_root` should be `false` (the default).

## File 1: `hacs.json`

```json
{
  "name": "Pill Logger Card",
  "filename": "pill-logger-card.js",
  "homeassistant": "2026.3.2",
  "hacs": "2.0.5"
}
```

### Field rationale

| Field | Value | Why |
|-------|-------|-----|
| `name` | `"Pill Logger Card"` | Display name in HACS UI. Matches the card's identity as a companion to the Pill Logger integration. |
| `filename` | `"pill-logger-card.js"` | Explicitly tells HACS which JS file to download. Matches the file in `dist/`. HACS would auto-detect this (repo name `lovelace-pill-logger-card` → strip prefix → `pill-logger-card.js`), but being explicit is safer. |
| `homeassistant` | `"2026.3.2"` | Minimum HA version. Matches the backend integration's requirement for consistency. The card uses `ha-card`, `ha-dialog`, `ha-icon`, `getConfigForm()` schema — all stable HA frontend APIs available since well before this version. |
| `hacs` | `"2.0.5"` | Minimum HACS version. Matches the backend's hacs.json. HACS 2.0+ is the current generation. |

### Fields NOT included (and why)

- `content_in_root` — defaults to `false`; our JS is in `dist/`, not root. Correct default.
- `zip_release` — defaults to `false`; we're not using GitHub release zips. HACS downloads the raw JS from `dist/`.
- `country` — not set; the card is not country-specific.
- `hide_default_branch` — defaults to `false`; no reason to hide.
- `persistent_directory` — not needed; the card stores no persistent files.

## File 2: `LICENSE`

MIT license, matching the backend repository's license choice.

```
MIT License

Copyright (c) 2025 adix992

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

> **Note:** The copyright holder is set to `adix992` based on the GitHub URL in the backend README (`https://github.com/adix992/Home-Assistant-Pill-Logger`). The user should verify this is the correct name/year.

## File 3: `README.md`

A focused, user-friendly README for the **card repository** (not the integration).
The backend repo already has a comprehensive 1000-line README; this one should be
concise and card-specific, with a link to the integration repo for full docs.

### Structure

1. **Title + one-line description** — what the card is
2. **Screenshot placeholder** — `[Screenshot of the card]` (user will add actual image)
3. **Prerequisites** — requires the Pill Logger integration installed first
4. **Installation** — HACS custom repository steps (Dashboard category)
5. **Configuration** — how to add the card to a dashboard (visual editor + YAML)
6. **Configuration Options** — table of all config fields from [`PillLoggerCardConfig`](../lovelace-pill-logger-card/src/pill-logger-card.ts:10)
7. **Features** — 4 panes (Daily, Graphs, Stats, Tools), color schemes, custom chips
8. **Link to integration repo** — for full Pill Logger documentation

### Content

```markdown
# 💊 Pill Logger Card

A custom Lovelace dashboard card for the [Pill Logger](https://github.com/adix992/Home-Assistant-Pill-Logger) Home Assistant integration.

![Pill Logger Card](screenshot.png)

## Prerequisites

This card requires the **Pill Logger** integration to be installed and configured first:

1. Install [Pill Logger](https://github.com/adix992/Home-Assistant-Pill-Logger) via HACS (Integration category)
2. Add at least one medication through the integration's config flow
3. Then install this card (instructions below)

## Installation

### Via HACS

1. Open HACS in Home Assistant
2. Go to ⋮ → **Custom Repositories**
3. Paste this repository URL: `https://github.com/adix992/lovelace-pill-logger-card`
4. Select **Dashboard** as the category
5. Click **Add**
6. Search for "Pill Logger Card" in HACS and download it
7. Add the card to your dashboard (see Configuration below)

### Manual

1. Download [`pill-logger-card.js`](dist/pill-logger-card.js) from this repository
2. Place it in your Home Assistant `www/` directory
3. Add it as a dashboard resource (Settings → Dashboards → Resources → Add resource)
4. URL: `/local/pill-logger-card.js`, Type: JavaScript module

## Configuration

### Visual Editor

1. Edit your dashboard → Add Card → Search for "Pill Logger"
2. Select your medication device from the dropdown
3. Configure color scheme, custom chips, and graph options as desired

### YAML

```yaml
type: custom:pill-logger-card
device_id: <your medication device ID>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `device_id` | string | **required** | The Pill Logger medication device to display |
| `name` | string | — | Custom display name (overrides medication name) |
| `color_scheme` | string | `default` | Card accent color. Options: `default`, `blue`, `red`, `green`, `yellow`, `orange`, `purple`, `pink`, `teal`, `brown`, `coral`, `slate`, `gold`, `grey` |
| `big_text` | boolean | `true` | Use larger text for the main display |
| `stats_3_columns` | boolean | `false` | Use 3-column layout for the stats pane |
| `show_amount_in_body` | boolean | `true` | Show the "Amount in Body" line graph in the Graphs pane |
| `show_day_avg_boxes` | boolean | `true` | Show rolling day-average boxes in the Stats pane |
| `show_adherence_boxes` | boolean | `true` | Show adherence percentage boxes in the Stats pane |
| `chip_1`–`chip_4` | string | — | Entity IDs for custom chips in the Daily pane |
| `chip_1_label`–`chip_4_label` | string | — | Custom labels for the corresponding chips |

### Example

```yaml
type: custom:pill-logger-card
device_id: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
color_scheme: blue
big_text: true
show_amount_in_body: true
chip_1: sensor.ibuprofen_pills_safe_to_take
chip_1_label: Safe to Take
```

## Features

The card has four panes, selectable via tabs at the bottom:

### 📅 Daily
- Take Pill button with next-dose countdown
- Pills safe to take indicator
- Last dose timestamp
- Inventory count (double-tap to refill)
- Custom chips for any related entities

### 📊 Graphs
- 14-day bar graph of daily doses
- Amount-in-body line graph with selectable timeframes (48H, 7D, 14D, 30D)

### 📈 Stats
- Rolling averages (7, 14, 30, 365 days)
- Adherence percentages (7, 14, 30, 365 days)
- Total doses and days since first dose

### 🔧 Tools
- Reset adherence percentage
- Mark last missed dose as taken
- Reset dose history
- Undo last dose

## Full Documentation

For complete documentation of the Pill Logger integration (tracking modes, pharmacokinetics, sensors, automations, etc.), see the [integration repository](https://github.com/adix992/Home-Assistant-Pill-Logger).

## License

MIT
```

## Verification

1. Confirm all 3 files exist in the frontend repo root:
   - `README.md`
   - `LICENSE`
   - `hacs.json`
2. Validate `hacs.json` is valid JSON with required fields
3. No build step needed — these are static metadata files
4. Optionally validate with HACS's [repository checker](https://github.com/hacs/repository-check) (run locally if available)

## Files to create

| File | Path | Type |
|------|------|------|
| `hacs.json` | `../lovelace-pill-logger-card/hacs.json` | New |
| `LICENSE` | `../lovelace-pill-logger-card/LICENSE` | New |
| `README.md` | `../lovelace-pill-logger-card/README.md` | New |

## What does NOT change

- No source code changes
- No build config changes
- No dependency changes
- The existing `dist/pill-logger-card.js` already satisfies HACS's file-location requirement

## Post-Batch 9

After Batch 9 is complete, proceed to Batch 7 (#12 + #13) per the existing plan in [`homeassistant-type-lovelacecard-plan.md`](homeassistant-type-lovelacecard-plan.md).