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

## Features

The card adapts its panes to the selected device type:

- **Medicine devices** — four panes: Daily, Graphs, Stats, Tools (plus Tracking when effectiveness metrics exist).
- **Master Tracker devices** (Caffeine Tracker / Alcohol Tracker) — five panes: Drinks, Graph, Inventory, Stats, Tools.
- **Granular drink devices** (e.g. Coffee, Espresso) — a single redirect pane asking you to select the matching Caffeine/Alcohol Tracker device, since per-drink maintenance belongs on the granular device's own card.

### 📅 Daily
- Take Pill button with next-dose countdown
- Pills safe to take indicator
- Last dose timestamp
- Inventory count (double-tap to refill)
- Custom chips for any related entities

### 📊 Graphs
- Bar graph of daily doses with selectable timescales (14D, 30D, 60D)
- Amount-in-body line graph with selectable timeframes (12H, 24H, 48H, 7D, 14D, 30D)
- Effectiveness line graph (appears automatically when the medication tracks any effectiveness metrics). Shows one point per metric per day on the 0–10 scale. Toggle between **Avg** (average of the visible trackers) and **Individual** (each tracker in its own color). A per-tracker toggle row lets you show/hide individual metrics; this also controls which trackers contribute to the Avg line. Timescales: 14D, 30D, 60D. Requires the Home Assistant recorder to be enabled with retention ≥ the selected timescale

### 📈 Stats
- Rolling averages (7, 14, 30, 365 days)
- Adherence percentages (7, 14, 30, 365 days)
- Total doses and days since first dose

### 🔧 Tools
- Reset adherence percentage
- Mark last missed dose as taken
- Reset dose history
- Undo last dose

## ☕ Drinks Card (Master Tracker Devices)

Selecting a **Caffeine Tracker** or **Alcohol Tracker** device renders a dedicated Drinks card with five panes:

### 🥤 Drinks
- A centered substance title (Caffeine / Alcohol) at the top of the pane — same font size, weight, and placement as the Daily pane's medication name. Tapping it opens the device-info dialog, mirroring the Daily pane.
- A two-column main row identical in layout to the Daily pane:
  - **Left:** a tinted **Log Drink** button (matches the Daily Take Pill button style). Opens a popup listing every granular drink of that substance (e.g. Coffee, Espresso, Energy Drink for caffeine); pressing a drink logs it via that drink's Log Drink button (respects the per-drink cooldown sensor + card soft-disable).
  - **Right:** two boxes with the same transparency and font sizes as the Daily pane's Safe to Take / Pills Left boxes — **In Body** (current body-mass rounded to a whole number + substance unit, mg / g) on top and **Disruption** (sleep-disruption band: None / Low / Moderate / High) on the bottom. Tapping either box opens its more-info dialog.
- The Estimated Low Time readout moved to the Stats pane (it's no longer shown on the Drinks pane, to keep the two-box right column identical to the Daily pane).

### 📊 Graph
- 14-day bar graph of aggregated doses across every granular drink of the substance (how many and on which days).
- Amount-in-body line graph of the master body-mass decay (mg caffeine / g alcohol) with the same timeframes as medicine (12H, 24H, 48H, 7D, 14D, 30D). The master tracker's body-mass sensor is labeled "Amount in Body" to align with medicine trackers.

### 📦 Inventory
- Two-column grid, one row per granular drink of the substance:
  - **Left:** clickable refill box showing the drink's current stock. Tapping opens the refill dialog targeted at that drink's add-stock entity.
  - **Right:** the drink's 7-day average plus a trailing average that runs as "N-Day Average" until 365 days elapse, then becomes "Yearly Average" (mirrors the medicine Stats reveal logic).

### 📈 Stats
- Amount in Last 24h (mg / g), Sleep Disruption, Estimated Low Time, plus the rolling averages (7, 14, 30, 365 days) and total doses aggregated across every granular drink of the substance.

### 🔧 Tools
- A per-granular-drink list of **Undo** and **Reset** buttons. Each opens a confirmation dialog before acting on that specific granular drink (the master tracker's aggregated history is preserved on a per-drink reset).

## Configuration Options (Not needed, for reference only)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `device_id` | string | **required** | The AX Dose Logger medication device to display |
| `name` | string | — | Custom display name (overrides medication name) |
| `color_scheme` | string | `default` | Card accent color. Options: `default`, `blue`, `red`, `green`, `yellow`, `orange`, `purple`, `pink`, `teal`, `brown`, `coral`, `slate`, `gold`, `grey` |
| `big_text` | boolean | `false` | When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view |
| `take_pill_icon` | string | `mdi:pill` | Icon shown on the Take Pill button when the limit has not been reached. The limit-reached state always uses `mdi:alert` |
| `take_pill_label` | string | `Take Pill` | Text shown on the Take Pill button when the limit has not been reached. Change to match the medicine form, e.g. `Inject Dose`, `Apply Cream` |
| `safe_to_take_entity` | entity | _(empty)_ | Any Home Assistant entity to display in the Safe to Take box. Leave empty to use the built-in Pills Safe to Take sensor. The Take Pill button safety logic always uses the real sensor regardless of this setting |
| `safe_to_take_label` | string | `Safe to take` | Custom label for the Safe to Take stat box |
| `safe_to_take_icon` | icon | `mdi:shield-check` | Icon shown on the Safe to Take stat box |
| `safe_to_take_tap_action` | action | `more-info` | Action to perform when the Safe to Take box is tapped. Defaults to more-info on the displayed entity |
| `safe_to_take_hold_action` | action | _(none)_ | Action to perform when the Safe to Take box is long-pressed |
| `safe_to_take_double_tap_action` | action | _(none)_ | Action to perform when the Safe to Take box is double-tapped |
| `pills_left_label` | string | `Pills left` | Label for the remaining-amount stat in the Daily pane. Change to match the form/unit, e.g. `Amount Left (ml)`, `Doses Left` |
| `pills_left_icon` | icon | `mdi:pill` | Icon shown on the remaining-amount stat box in the Daily pane |
| `pills_left_show_days_left` | boolean | `false` | Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap |
| `pills_left_entity` | entity | _(empty)_ | Any Home Assistant entity to display in the Pills Left box. Leave empty to use the built-in sensor. Tapping still opens the Refill dialog by default |
| `pills_left_tap_action` | action | `refill` | Action when the Pills Left box is tapped. Defaults to the Refill dialog; a custom action overrides it |
| `pills_left_hold_action` | action | _(none)_ | Action when the Pills Left box is long-pressed |
| `pills_left_double_tap_action` | action | _(none)_ | Action when the Pills Left box is double-tapped |
| `log_drink_icon` | icon | `mdi:coffee` / `mdi:glass-mug-variant` | Icon for the Log Drink button on the Drinks pane (Master Tracker cards). Substance-aware default |
| `log_drink_label` | string | `Log Drink` | Label for the Log Drink button |
| `in_body_entity` | entity | _(empty)_ | Any Home Assistant entity to display in the In Body box. Leave empty to use the built-in sensor |
| `in_body_icon` | icon | `mdi:chart-bell-curve` | Icon for the In Body box |
| `in_body_label` | string | `In Body` | Label for the In Body box |
| `in_body_tap_action` | action | `more-info` | Action when the In Body box is tapped |
| `in_body_hold_action` | action | _(none)_ | Action when the In Body box is long-pressed |
| `in_body_double_tap_action` | action | _(none)_ | Action when the In Body box is double-tapped |
| `disruption_mode` | select | `disruption` | Display mode for the Disruption box. `disruption` = Sleep Disruption state (None/Low/Moderate/High); `low_timestamp` = Low - Timestamp (HH:MM); `low_hours_until` = Low - Hours Until countdown (X h). Overrides `disruption_entity` when set to a Low mode |
| `disruption_entity` | entity | _(empty)_ | Any Home Assistant entity to display in the Disruption box. Leave empty to use the built-in sensor. Overridden by the `disruption_mode` Low modes |
| `disruption_icon` | icon | `mdi:sleep` / `mdi:clock-outline` / `mdi:timer-sand` | Icon for the Disruption box. Defaults to the mode-specific icon |
| `disruption_label` | string | `Disruption` / `Low - Timestamp` / `Low - Hours Until` | Label for the Disruption box. Defaults to the mode-specific label |
| `disruption_tap_action` | action | `popup` / `more-info` | Action when the Disruption box is tapped. Defaults to the Sleep Disruption popup (`disruption` mode) or more-info (Low modes) |
| `disruption_hold_action` | action | _(none)_ | Action when the Disruption box is long-pressed |
| `disruption_double_tap_action` | action | _(none)_ | Action when the Disruption box is double-tapped |
| `drink_chip_1`–`drink_chip_4` | entity | _(empty)_ | Custom chips shown on the Drinks pane (Master Tracker cards). Up to 4 entities |
| `drink_chip_1_label`–`drink_chip_4_label` | string | _(empty)_ | Optional label for each Drinks-pane chip. Leave empty to use the entity's friendly name |
| `stats_3_columns` | boolean | `false` | Use 3-column layout for the stats pane |
| `show_amount_in_body` | boolean | `true` | Show the "Amount in Body" line graph in the Graphs pane. When on (and the device has a usable Amount in Body state), it is the default graph shown when navigating to the Graphs pane |
| `amount_in_body_default_timeframe` | string | `48h` | Default timescale for the Amount in Body graph on card load. Options: `12h`, `24h`, `48h`, `7d`, `14d`, `30d`. Useful for medications where a shorter window (e.g. 12h) is more informative |
| `show_day_avg_boxes` | boolean | `true` | Show rolling day-average boxes in the Stats pane |
| `show_adherence_boxes` | boolean | `true` | Show adherence percentage boxes in the Stats pane |
| `hide_nav_bar` | boolean | `false` | Hide the bottom navigation bar (Daily/Graphs/Stats/Tools). Useful for dashboards that only need the Daily pane |
| `chip_1`–`chip_4` | string | — | Entity IDs for custom chips in the Daily pane |
| `chip_1_label`–`chip_4_label` | string | — | Custom labels for the corresponding chips |

## Full Documentation

For complete documentation of the AX Dose Logger integration (tracking modes, pharmacokinetics, sensors, automations, etc.), see the [integration repository](https://github.com/Axildor/AX-Dose-Logger).

## License

MIT