# 💊 AX Dose Logger Card

A custom Lovelace dashboard card for the [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) Home Assistant integration — surfacing medications and drinks (caffeine & alcohol) with no template YAML and no Mushroom/Card-Mod dependencies.

[![Buy me a tea](https://img.shields.io/badge/Buy_me_a_tea-☕-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/axildor)

<!-- SCREENSHOT: Card showing the Daily pane — medication name, Take Pill button with next-dose countdown, pills safe to take, last dose, inventory count, custom chips -->

---

## 🃏 Companion Integration

This card was built **in tandem** with the [**AX Dose Logger**](https://github.com/Axildor/AX-Dose-Logger) integration. The two were programmed together and are designed to work as a pair — the card surfaces everything the integration produces (sensors, buttons, services, PK graphs, drink tracking) in a polished, purpose-built UI.

The card requires the integration to be installed and configured first (see [Prerequisites](#prerequisites)).

---

## Table of Contents

- [Companion Integration](#-companion-integration)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Features](#features)
- [Medicine Panes](#medicine-panes)
  - [Daily](#-daily)
  - [Graphs](#-graphs)
  - [Stats](#-stats)
  - [Tracking](#-tracking)
  - [Tools](#-tools)
- [Drinks Card (Master Tracker)](#-drinks-card-master-tracker-devices)
  - [Drinks](#-drinks)
  - [Graph](#-graph)
  - [Inventory](#-inventory)
  - [Stats (Drinks)](#-stats-drinks)
  - [Tools (Drinks)](#-tools-drinks)
- [Configuration Options](#configuration-options-not-needed-for-reference-only)
- [Full Documentation](#full-documentation)
- [License](#license)

---

## Prerequisites

This card requires the **AX Dose Logger** integration to be installed and configured first:

1. Install [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) via HACS (Integration category)
2. Add at least one medication **or** drink through the integration's config flow
3. Then install this card (instructions below)

---

## Installation

### Via HACS

1. Open HACS in Home Assistant
2. Go to ⋮ → **Custom Repositories**
3. Paste this repository URL: `https://github.com/Axildor/AX-Dose-Logger-Card`
4. Select **Dashboard** as the category
5. Click **Add**
6. Search for "AX Dose Logger Card" in HACS and download it
7. Add the card to your dashboard (see [Configuration](#configuration) below)

### Manual

1. Download [`ax-dose-logger-card.js`](dist/ax-dose-logger-card.js) from this repository
2. Place it in your Home Assistant `www/` directory
3. Add it as a dashboard resource (Settings → Dashboards → Resources → Add resource)
4. URL: `/local/ax-dose-logger-card.js`, Type: JavaScript module

---

## Configuration

### Visual Editor

1. Edit your dashboard → Add Card → Search for "AX Dose Logger"
2. Select your medication or Master Tracker device from the dropdown
3. Configure color scheme, custom chips, graph options, and per-box overrides as desired

The visual editor is organized into expandable sections: **Daily Panel** (Take Pill button, Safe to Take Box, Pills Left Box, Custom Chips with per-chip collapsable menus), **Drinks Panel** (Log Drink button, In Body Box, Disruption Box, Custom Chips with per-chip collapsable menus), and **Graphs Panel** (Amount in Body toggle + default timeframe, day-average/adherence boxes). See [Configuration Options](#configuration-options-not-needed-for-reference-only) for the full reference table.

---

## Features

The card adapts its panes to the selected device type:

- **Medicine devices** — five panes: Daily, Graphs, Stats, Tools (plus Tracking when effectiveness metrics exist).
- **Master Tracker devices** (Caffeine Tracker / Alcohol Tracker) — five panes: Drinks, Graph, Inventory, Stats, Tools.
- **Granular drink devices** (e.g. Coffee, Espresso) — a single redirect pane asking you to select the matching Caffeine/Alcohol Tracker device, since per-drink maintenance belongs on the Master Tracker's card.

---

## Medicine Panes

### 📅 Daily

- Take Pill button with next-dose countdown (turns red with a confirmation dialog at the pill limit)
- Pills safe to take indicator
- Last dose timestamp
- Inventory count (double-tap to refill)
- Custom chips for any related entities — each chip has its own collapsable menu in the visual editor with entity, icon, label, and tap/hold/double-tap actions. Tapping a chip defaults to more-info on its entity

The **Safe to Take Box** and **Pills Left Box** are each fully overridable via the visual editor's Daily Panel expandable:
- **Safe to Take Box** — swap in any HA entity, custom icon/label, and tap/hold/double-tap actions. The Take Pill button's safety logic always uses the real sensor regardless of this setting.
- **Pills Left Box** — a "Days left instead of Pills left" toggle swaps the box to the backend Days Left sensor (keeps the Refill dialog as the default tap), plus entity swap, custom icon/label, and tap/hold/double-tap actions.

### 📊 Graphs

- Bar graph of daily doses with selectable timescales (14D, 30D, 60D)
- Amount-in-body line graph with selectable timeframes (12H, 24H, 48H, 7D, 14D, 30D). When `show_amount_in_body` is on, this is the **default graph** shown when entering the Graphs pane.
- Effectiveness line graph (appears automatically when the medication tracks any effectiveness metrics). Shows one point per metric per day on the 0–10 scale. Toggle between **Avg** (average of the visible trackers) and **Individual** (each tracker in its own color). A per-tracker toggle row lets you show/hide individual metrics; this also controls which trackers contribute to the Avg line. Timescales: 14D, 30D, 60D. Requires the Home Assistant recorder to be enabled with retention ≥ the selected timescale.

### 📈 Stats

- Rolling averages (7, 14, 30, 365 days)
- Adherence percentages (7, 14, 30, 365 days)
- Total doses and days since first dose
- Days left / Est. days left (inventory burn rate — scheduled medications divide by doses/day; As-Needed medications divide by the 7-day average)
- Every row is clickable → opens the entity's more-info dialog

### 🔧 Tracking

Appears automatically when the medication has effectiveness metrics enabled. Shows a daily-locked 0–10 slider for each tracked symptom (Pain, Mood, Nausea, Fatigue, plus any custom metrics). Each slider can only be set once per calendar day; an override dialog appears if you try to change it. Sliders reset to **unknown** at midnight.

### 🔧 Tools

- Reset adherence percentage
- Mark last missed dose as taken
- Reset dose history
- Undo last dose

---

## ☕ Drinks Card (Master Tracker Devices)

Selecting a **Caffeine Tracker** or **Alcohol Tracker** device renders a dedicated Drinks card with five panes:

### 🥤 Drinks

- A centered substance title (Caffeine / Alcohol) at the top — same font size, weight, and placement as the Daily pane's medication name. Tapping it opens the device-info dialog.
- A two-column main row identical in layout to the Daily pane:
  - **Left:** a tinted **Log Drink** button. Opens a popup listing every granular drink of that substance (e.g. Coffee, Espresso, Energy Drink for caffeine). Each drink shows a predictive **"Low: hh:mm"** line — the wall-clock time the body-mass would drop into the *Low* sleep band *if that drink were logged now*. "Low: —" means the drink is safe (would not lift body-mass above the Low band). Pressing a drink logs it via that drink's Log Drink button (respects the per-drink cooldown sensor + card soft-disable).
  - **Right:** two boxes — **In Body** (current body-mass rounded to a whole number + substance unit, mg / g) on top and **Disruption** on the bottom. Tapping either box opens its more-info dialog (or the Sleep Disruption popup, depending on the Disruption mode).
- The Disruption box has **three display modes** (selectable via `disruption_mode` in the visual editor):
  - **Sleep Disruption** (default) — shows the band state (None / Low / Moderate / High). Tapping opens the substance-specific Sleep Disruption popup.
  - **Low - Timestamp** — shows the Low - Timestamp sensor formatted as `HH:MM` (24-hour). Tapping opens more-info.
  - **Low - Hours Until** — shows the Low - Hours Until countdown sensor formatted as `X h`. Tapping opens more-info.
- The **In Body Box** and **Disruption Box** are each fully overridable via the visual editor's Drinks Panel expandable (entity swap, custom icon/label, tap/hold/double-tap actions).
- Up to 4 **custom chips** (separate from the Daily pane's chips) can be added. Each chip has its own collapsable menu in the visual editor with entity, icon, label, and tap/hold/double-tap actions. Tapping a chip defaults to more-info on its entity.

### 📊 Graph

- 14-day bar graph of aggregated doses across every granular drink of the substance.
- Amount-in-body line graph of the master body-mass decay (mg caffeine / g alcohol) with the same timeframes as medicine (12H, 24H, 48H, 7D, 14D, 30D).

### 📦 Inventory

- Two-column grid (same box sizing + 8px spacing as the Stats pane), one row per granular drink of the substance:
  - **Left:** clickable refill box with two lines — the drink's name + unit + "Left" + current stock on the first line (e.g. "Tea Bags Left 12"), and "Est. days left" + the per-drink inventory burn rate on the second line. Both lines use the same font size. Tapping opens the refill dialog targeted at that drink's add-stock entity.
  - **Right:** the drink's 7-day average plus a trailing average (both labeled "Day Average"). Clicking the averages box opens the granular drink's device-info popup.

### 📈 Stats (Drinks)

- Amount in Last 24h (mg / g)
- Sleep Disruption
- Low - Timestamp (HH:MM)
- Low - Hours Until (X h countdown)
- Rolling averages (7, 14, 30, 365 days)
- Last drink timestamp
- Every row is clickable → opens the entity's more-info dialog

### 🔧 Tools (Drinks)

- A per-granular-drink list of **Undo** and **Reset** buttons. Each opens a confirmation dialog before acting on that specific granular drink (the master tracker's aggregated history is preserved on a per-drink reset).

---

## Configuration Options (Not needed, for reference only)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `device_id` | string | **required** | The AX Dose Logger device to display (medication or Master Tracker) |
| `name` | string | — | Custom display name (overrides the device name) |
| `color_scheme` | string | `default` | Card accent color. Options: `default`, `blue`, `red`, `green`, `yellow`, `orange`, `purple`, `pink`, `teal`, `brown`, `coral`, `slate`, `gold`, `grey` |
| `default_view` | string | `daily` | Pane shown when the card loads. Options: `daily`, `graphs`, `stats`, `drinks`, `inventory`, `tools`, `tracking`. Falls back to `daily` if the pane is invalid for the bound device type |
| `big_text` | boolean | `false` | When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view |
| `bold_text` | boolean | `false` | When on, all card text becomes 50% bolder for better readability. Independent of Large Text. Off by default |
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
| `drink_chip_1`–`drink_chip_4` | entity | _(empty)_ | Custom chips shown on the Drinks pane (Master Tracker cards). Up to 4 entities, each in its own collapsable menu |
| `drink_chip_1_label`–`drink_chip_4_label` | string | _(empty)_ | Optional label for each Drinks-pane chip. Leave empty to use the entity's friendly name |
| `drink_chip_1_icon`–`drink_chip_4_icon` | icon | _(entity default)_ | Optional icon for each Drinks-pane chip. Leave empty for the entity's default icon |
| `drink_chip_1_show_icon`–`drink_chip_4_show_icon` | boolean | `false` | Show an icon on each Drinks-pane chip. Off by default (clean label-over-value tile matching the Graph panel Day Avg Boxes). When on, the chip box grows taller to fit the icon above the label — useful to make chips larger for a button-like layout |
| `drink_chip_1_tap_action`–`drink_chip_4_tap_action` | action | more-info | Tap action for each Drinks-pane chip. Defaults to more-info on the entity |
| `drink_chip_1_hold_action`–`drink_chip_4_hold_action` | action | _(none)_ | Hold (long-press) action for each Drinks-pane chip |
| `drink_chip_1_double_tap_action`–`drink_chip_4_double_tap_action` | action | _(none)_ | Double-tap action for each Drinks-pane chip |
| `stats_3_columns` | boolean | `false` | Use 3-column layout for the stats pane |
| `show_amount_in_body` | boolean | `true` | Show the "Amount in Body" line graph in the Graphs pane. When on (and the device has a usable Amount in Body state), it is the default graph shown when navigating to the Graphs pane |
| `amount_in_body_default_timeframe` | string | `48h` | Default timescale for the Amount in Body graph on card load. Options: `12h`, `24h`, `48h`, `7d`, `14d`, `30d`. Useful for medications where a shorter window (e.g. 12h) is more informative |
| `show_day_avg_boxes` | boolean | `true` | Show rolling day-average boxes in the Stats pane |
| `show_adherence_boxes` | boolean | `true` | Show adherence percentage boxes in the Stats pane |
| `hide_nav_bar` | boolean | `false` | Hide the bottom navigation bar (Daily/Graphs/Stats/Tools). Useful for dashboards that only need the Daily pane |
| `chip_1`–`chip_4` | string | — | Entity IDs for custom chips in the Daily pane. Each chip has its own collapsable menu in the visual editor |
| `chip_1_label`–`chip_4_label` | string | — | Custom labels for the corresponding chips |
| `chip_1_icon`–`chip_4_icon` | icon | _(entity default)_ | Optional icon for each chip. Leave empty for the entity's default icon |
| `chip_1_show_icon`–`chip_4_show_icon` | boolean | `false` | Show an icon on each chip. Off by default (clean label-over-value tile matching the Graph panel Day Avg Boxes). When on, the chip box grows taller to fit the icon above the label — useful to make chips larger for a button-like layout |
| `chip_1_tap_action`–`chip_4_tap_action` | action | more-info | Tap action for each chip. Defaults to more-info on the entity |
| `chip_1_hold_action`–`chip_4_hold_action` | action | _(none)_ | Hold (long-press) action for each chip |
| `chip_1_double_tap_action`–`chip_4_double_tap_action` | action | _(none)_ | Double-tap action for each chip |

---

## Full Documentation

For complete documentation of the AX Dose Logger integration (tracking modes, pharmacokinetics, drink tracking, sensors, automations, etc.), see the [integration repository](https://github.com/Axildor/AX-Dose-Logger).

---

## ☕ Support the Project

I'm a solo developer on disability building Home Assistant integrations and UI components independently. Your support keeps servers online, API quotas funded, and the black tea brewing while I debug TypeScript.

If this card is useful to you, there's no obligation — but any support is highly appreciated.

[![Buy me a tea](https://img.shields.io/badge/Buy_me_a_tea-on_Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/axildor)

---

## License

MIT