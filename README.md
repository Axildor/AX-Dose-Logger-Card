# 💊 AX Dose Logger Card

A custom Lovelace dashboard card for the [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) Home Assistant integration.

![AX Dose Logger Card](screenshot.png)

## Prerequisites

This card requires the **AX Dose Logger** integration to be installed and configured first:

1. Install [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) via HACS (Integration category)
2. Add at least one medication through the integration's config flow
3. Then install this card (instructions below)

## Installation

### Via HACS

1. Open HACS in Home Assistant
2. Go to ⋮ → **Custom Repositories**
3. Paste this repository URL: `https://github.com/Axildor/AX-Dose-Logger-Card`
4. Select **Dashboard** as the category
5. Click **Add**
6. Search for "AX Dose Logger Card" in HACS and download it
7. Add the card to your dashboard (see Configuration below)

### Manual

1. Download [`ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) from this repository
2. Place it in your Home Assistant `www/` directory
3. Add it as a dashboard resource (Settings → Dashboards → Resources → Add resource)
4. URL: `/local/ax-dose-logger-card.js`, Type: JavaScript module

## Configuration

### Visual Editor

1. Edit your dashboard → Add Card → Search for "AX Dose Logger"
2. Select your medication device from the dropdown
3. Configure color scheme, custom chips, and graph options as desired

### YAML

```yaml
type: custom:ax-dose-logger-card
device_id: <your medication device ID>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `device_id` | string | **required** | The AX Dose Logger medication device to display |
| `name` | string | — | Custom display name (overrides medication name) |
| `color_scheme` | string | `default` | Card accent color. Options: `default`, `blue`, `red`, `green`, `yellow`, `orange`, `purple`, `pink`, `teal`, `brown`, `coral`, `slate`, `gold`, `grey` |
| `big_text` | boolean | `true` | Use larger text for the main display |
| `stats_3_columns` | boolean | `false` | Use 3-column layout for the stats pane |
| `show_amount_in_body` | boolean | `true` | Show the "Amount in Body" line graph in the Graphs pane |
| `show_day_avg_boxes` | boolean | `true` | Show rolling day-average boxes in the Stats pane |
| `show_adherence_boxes` | boolean | `true` | Show adherence percentage boxes in the Stats pane |
| `hide_nav_bar` | boolean | `false` | Hide the bottom navigation bar (Daily/Graphs/Stats/Tools). Useful for dashboards that only need the Daily pane |
| `chip_1`–`chip_4` | string | — | Entity IDs for custom chips in the Daily pane |
| `chip_1_label`–`chip_4_label` | string | — | Custom labels for the corresponding chips |

### Example

```yaml
type: custom:ax-dose-logger-card
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
- Bar graph of daily doses with selectable timescales (14D, 30D, 60D)
- Amount-in-body line graph with selectable timeframes (12H, 48H, 7D, 14D, 30D)

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

For complete documentation of the AX Dose Logger integration (tracking modes, pharmacokinetics, sensors, automations, etc.), see the [integration repository](https://github.com/Axildor/AX-Dose-Logger).

## License

MIT