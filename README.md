[![GitHub Release](https://img.shields.io/github/v/release/Axildor/AX-Dose-Logger-Card?style=flat-square)](https://github.com/Axildor/AX-Dose-Logger-Card/releases)
[![HACS Status](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![HACS Validation Status](https://img.shields.io/github/actions/workflow/status/Axildor/AX-Dose-Logger-Card/hacs.yaml?branch=master&label=HACS%20Validation&style=flat-square)](https://github.com/Axildor/AX-Dose-Logger-Card/actions/workflows/hacs.yaml)
[![Buy me a tea](https://img.shields.io/badge/Buy_me_a_tea-☕-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/axildor)
# 💊 AX Dose Logger Card

A custom Lovelace dashboard card for the [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) Home Assistant integration — surfacing medications and drinks (caffeine & alcohol) with no template YAML and no Mushroom/Card-Mod dependencies.


<!-- SCREENSHOT: Card showing the Daily tab — medication name, Take Pill button with next-dose countdown, pills safe to take, last dose, inventory count, custom boxes -->

---

## Companion Integration

This card was built **in tandem** with the [**AX Dose Logger**](https://github.com/Axildor/AX-Dose-Logger) integration. The two were programmed together and are designed to work as a pair — the card surfaces everything the integration produces (sensors, buttons, services, PK graphs, drink tracking) in a polished, purpose-built UI.

The card requires the integration to be installed and configured first (see [Prerequisites](#prerequisites)).

---

## Table of Contents

- [Companion Integration](#-companion-integration)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Features](#features)
- [Medicine Tabs](#medicine-tabs)
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
- [Releasing](#releasing)
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

1. Download [`ax-dose-logger-card.js`](https://github.com/Axildor/AX-Dose-Logger-Card/releases) from the [latest release](https://github.com/Axildor/AX-Dose-Logger-Card/releases)
2. Place it in your Home Assistant `www/` directory
3. Add it as a dashboard resource (Settings → Dashboards → Resources → Add resource)
4. URL: `/local/ax-dose-logger-card.js`, Type: JavaScript module

---

## Releasing

This repository is a **HACS plugin**, not an integration. HACS expects the compiled
card JavaScript to be shipped as a **GitHub Release asset** — the `dist/` directory
is intentionally gitignored and never committed. If a release has no attached
`ax-dose-logger-card.js`, HACS reports *"Repository structure for \<tag\> is not
compliant"*.

Releases are automated by the [`release.yaml`](.github/workflows/release.yaml)
workflow: pushing a tag builds the card in CI and attaches
`dist/ax-dose-logger-card.js` to the matching GitHub Release.

```bash
yarn install
yarn run build
git tag 1.0.1
git push --tags   # triggers release.yaml → auto-attached JS asset
```

To attach the JS to an **existing** release (e.g. an older release created before
the workflow existed), build locally and upload `dist/ax-dose-logger-card.js` via
*Release → Edit → Attach binaries*. The asset filename must be exactly
`ax-dose-logger-card.js` to match the `filename` declared in [`hacs.json`](hacs.json).

---

## Configuration

### Visual Editor

1. Edit your dashboard → Add Card → Search for "AX Dose Logger"
2. Select your medication or Master Tracker device from the dropdown
3. Configure color scheme (see the note on starred colors below), custom boxes, graph options, and per-box overrides as desired

The visual editor is organized into expandable sections: **Daily Tab** (Take Pill button, Top Box, Bottom Box, Custom Boxes with per-box collapsable menus), **Drinks Tab** (Log Drink button, Top Box, Bottom Box, Custom Boxes with per-box collapsable menus), and **Graphs Tab** (Amount in Body toggle + default timeframe, day-average/adherence boxes). See [Configuration Options](#configuration-options-not-needed-for-reference-only) for the full reference table.

---

## Features

The card adapts its tabs to the selected device type:

- **Medicine devices** — five tabs: Daily, Graphs, Stats, Tools (plus Tracking when effectiveness metrics exist).
- **Master Tracker devices** (Caffeine Tracker / Alcohol Tracker) — five tabs: Drinks, Graph, Inventory, Stats, Tools.
- **Granular drink devices** (e.g. Coffee, Espresso) — a single redirect tab asking you to select the matching Caffeine/Alcohol Tracker device, since per-drink maintenance belongs on the Master Tracker's card.

---

## Medicine Tabs

### 📅 Daily

- Take Pill button with next-dose countdown. The button follows a 6-state color matrix (see [Button State Matrix](#button-state-matrix) below) — it turns **red** at the pill limit (with an override confirmation dialog), **red** with a "24H LIMIT REACHED" label when the 24h strength limit would be exceeded (with a reworded override dialog explaining the strength cap), **blue** when a scheduled dose is due, **amber** when overdue, briefly **green** ("Logged") after a successful press, and falls back to the theme default when idle.
- Pills safe to take indicator
- Last dose timestamp
- Inventory count (double-tap to refill)
- Custom boxes for any related entities — each box has its own collapsable menu in the visual editor with entity, icon, label, and tap/hold/double-tap actions. Tapping a box defaults to more-info on its entity

The **Top Box** and **Bottom Box** are each fully overridable via the visual editor's Daily Tab expandable (the names refer to physical position so they stay truthful regardless of which sensor the box renders):
- **Top Box** — a "Amount in body instead of Safe to take" toggle swaps the box to the Amount in Body sensor (default is Safe to Take; the Take Pill button's safety logic always uses the real Safe to Take sensor regardless of this setting), plus entity swap, custom icon/label, and tap/hold/double-tap actions.
- **Bottom Box** — a "Days left instead of Pills left" toggle swaps the box to the backend Days Left sensor (keeps the Refill dialog as the default tap), plus entity swap, custom icon/label, and tap/hold/double-tap actions.

### 🎛️ Button State Matrix

The Take Pill (Daily tab) and Log Drink (Drinks tab) buttons follow a 6-state color matrix so the button's appearance encodes the system's current status. Each colored state is independently configurable — pick how (and whether) the color is rendered via the **Style** dropdown, and independently pick the icon treatment via the **Icon Style** dropdown.

| State | When active | Color | Daily default | Drinks |
|-------|-------------|-------|---------------|--------|
| **Limit Reached** | Pill count limit reached / cooldown active | Red | Full Button | Full Button |
| **24H Limit Reached** | 24h strength limit already exceeded or next dose would exceed it | Red (inherits Limit Reached style) | Full Button (shares Limit Reached config) | n/a |
| **Idle** | No schedule due, no limit | Theme default | — (not configurable) | — |
| **Take Pill** | Scheduled dose due (within the first half of the on-time window) | Blue | No Color + Colored icon | n/a (drinks have no schedule) |
| **Overdue Warning** | Overdue (past half the on-time window) | Amber | Border Only + Colored + Pulse icon | n/a |
| **Logged Dose Indicator** | Transient flash on a successful press | Green | Top tick mark + "Logged" text (default layout) | Top tick mark + "Logged" text (default layout) |

The **24H Limit Reached** state inherits all **Limit Reached** style config — same red color, same CSS, same `take_button_lockout_style` / `take_button_lockout_icon_style` editor fields. Only the button label ("24H LIMIT REACHED") and the override dialog text differ (the dialog explains it's the 24h strength cap, not the pill count, that is reached).

The overdue boundary is derived from the **On-Time Window** (the "on-time buffer" you configured for the medication, in minutes) — the button stays blue for the **first half** of the window (on-time, no rush) and turns amber at the **halfway point** (proactive heads-up that the window is closing). This applies to **all scheduled medications**, whether or not adherence tracking is enabled. It fixes a prior disconnect where the card warned "overdue" the instant a dose was due while the adherence system still considered it on-time.

**5 style options** are available per state (each state has its own Style dropdown), plus a **Default** sentinel that resolves to the per-state default at runtime:

1. Default (resolves to the per-state default)
2. Full Button
3. Border Only
4. No Color (theme-tinted background, no state color override)
5. Rotating Ring
6. Ambilight Glow — a soft, diffused colored light radiates outward from behind the button like an ambilight TV against a wall: vibrant at the edge, quickly diffusing, with a slow breathing pulse. The button face stays theme-tinted (the glow is an outer backlight; it does not recolor the button itself). GPU-composited (animates `opacity` only on a static `filter: blur` layer) so multiple breathing buttons don't lag tablet-class hardware.

Each state also has its own **Icon Style** dropdown (4 options plus a Default sentinel), controlling the icon independently from the Style dropdown:

1. Default (resolves to the per-state default)
2. None (no icon color, no pulse)
3. Colored (icon colored, no pulse)
4. Colored + Pulse (icon colored + pulse animation)
5. Pulse Only (no icon color, pulse animation only)

The 4 visual Icon Style options form a 2×2 matrix (color on/off × pulse on/off). The Overdue Warning icon style defaults to Colored + Pulse; all others default to None (or Colored for Take Pill).

#### ⚠️ Color Scheme and Indicator Conflicts

The card's **Color Scheme** setting tints the idle Take Pill / Log Drink button with your chosen accent. Four of the scheme colors — **Red**, **Blue**, **Orange**, and **Green** — match (or closely approximate) the four medical button-state indicators in the matrix above:

- **Red** ≈ Limit Reached (`#db4437`)
- **Blue** = Dose Due (`#03a9f4`) — exact match
- **Orange** ≈ Overdue Amber (`#f5a623`) — near match
- **Green** = Logged (`#43a047`) — exact match

In the visual editor these four are listed last and marked with a trailing `*` so the conflict is visible at the point of choice. With the default button styles, the idle button is tinted by the accent, so picking one of the starred colors can make the idle button resemble an active medical state at a glance. The active-state coloring still overrides correctly (this is a readability concern, not a functional bug), but for an unambiguous read of the indicators prefer a non-starred color.

This same information is available in-card: press the drug title to open the device-info popup, then the **Medical Color Indicators** button (shown by default — toggle it off in the card's top-level settings once learned).

The **Logged Dose Indicator** flash has its own layout dropdown instead of the 7 style options:

1. **Top tick mark and text** (default) — the tick (`mdi:check-bold`) sits above the "Logged" text, mirroring the normal button's icon-over-label layout.
2. **Tick mark and text inline** — the tick and "Logged" text on one centered line.
3. **Big tick mark** — a single large tick, no text.

The flash renders on a **dark green** surface (`#212C22`) with a bright-green tick and text (`#43A047`) — high contrast for legibility, and opaque so the underlying button state stays hidden behind it. It **presses in** with a short fixed 240ms scale+fade animation at the start (mirroring the button's own press) so it reads like a button press rather than a hard cut; the intro is a fixed duration (not proportional to the flash length) so it stays snappy even when a long flash interval is configured. The tick mark always keeps its own color — it is not recolored by the per-state Icon style override, so a "Logged" tick is never red even when pressed while the Limit Reached state is active.

Because the 240ms intro is a fade-in (the overlay starts semi-transparent), the card **freezes the resolved button state for that same 240ms** on a successful press — the post-press color change (e.g. the default color flipping to the Limit Reached red when the dose hits the daily limit) is held until the overlay reaches full opacity, so it commits behind the now-opaque green and is never visible as a flash. The freeze releases automatically once the intro completes.

The **Logged Animation Duration** controls how long the flash appears (default 3000ms, configurable 500–10000ms). The **Glow / Ring Speed** dropdown (Slow / Medium / Fast) controls the cadence of both the rotating ring (used by the Rotating Ring style option) and the breathing pulse (used by the Ambilight Glow style option); default is Medium (4s per cycle). The ring line sweeps ~85% of the button perimeter (a small transparent gap lets the bright comet head remain visible as it travels). Note: because the ring rotates a gradient around the button's rounded-rect perimeter, the sweep appears to speed up at the corners — this is inherent to the technique and accepted.

**Rapid successive clicks:** if you tap the button again while the green "Logged" flash is still visible, the text instantly updates to reflect the running total — `Logged 2x`, `Logged 3x`, and so on — and the fade timer resets so each press gets the full duration. The first press shows the bare `Logged` (no `1x`). In the **Big tick mark** layout (no text) a small `Nx` badge appears below the tick when the count reaches 2 or more. The counter resets to zero once the flash fades out, so the next press starts a fresh `Logged`. This is a visual tally only — each tap fires a real dose log on the backend.

**Press ripple (ha-ripple):** every clickable element in the card — except the tab navigation bar and the Graphs tab state toggles (timeframe chips, carousel arrows, effectiveness tabs) — uses Home Assistant's native `<ha-ripple>` web component for Material Design press feedback, giving 1:1 parity with Lovelace Mushroom cards. A smooth radiating circle ripples out from the exact tap point on press, and a subtle hover tint signals the element is interactive before you tap. The Take Pill button's ripple colour matches its current medical state (red on Limit Reached, amber on Overdue, blue on Take Pill, green during the Logged flash); danger actions (Undo Dose, Reset History, etc.) ripple red. The ACK buttons keep their `Nx` rapid-click counter alongside the ripple.

These options live in the visual editor under the **Daily Tab → Button** and **Drinks Tab → Button** expandables. Inside each Button expandable, the aspect fields are a flat list where each Style dropdown is paired side-by-side with its Icon Style dropdown in a grid row, so it is visually obvious which dropdown belongs to which aspect. Every dropdown renders as a single dropdown box (not a stack of radio buttons) and is pre-populated with its default value (Default). The Drinks submenu only offers Limit Reached and Logged Dose Indicator (drinks are PRN/as-needed with no schedule, so Take Pill and Overdue Warning never apply). The Idle state has no color and is intentionally not shown in the editor.

### 📊 Graphs

- Bar graph of daily doses with selectable timescales (14D, 30D, 60D)
- Amount-in-body line graph with selectable timeframes (12H, 24H, 48H, 7D, 14D, 30D). When `show_amount_in_body` is on, this is the **default graph** shown when entering the Graphs tab.
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

Maintenance actions grouped into three sections. Every button follows the card's configured color scheme.

- **Adherence Tools**
  - Reset adherence percentage
  - Mark last missed dose as taken
- **Dose Tools**
  - Skip dose
  - Undo last dose
- **General Tools**
  - Reset dose history

By default a confirmation popup appears before any Tools action runs. This can be turned off in the visual editor under the **Settings Tab** expandable via the **Confirm Tool Actions** toggle (on by default).

---

## ☕ Drinks Card (Master Tracker Devices)

Selecting a **Caffeine Tracker** or **Alcohol Tracker** device renders a dedicated Drinks card with five tabs:

### 🥤 Drinks

- A centered substance title (Caffeine / Alcohol) at the top — same font size, weight, and placement as the Daily tab's medication name. Tapping it opens the device-info dialog.
- A two-column main row identical in layout to the Daily tab:
  - **Left:** a tinted **Log Drink** button. Opens a popup listing every granular drink of that substance (e.g. Coffee, Espresso, Energy Drink for caffeine). Each drink shows a predictive **"Low: hh:mm"** line — the wall-clock time the body-mass would drop into the *Low* sleep band *if that drink were logged now*. "Low: —" means the drink is safe (would not lift body-mass above the Low band). Pressing a drink logs it via that drink's Log Drink button (respects the per-drink cooldown sensor + card soft-disable).
  - **Right:** two boxes — **In Body** (current body-mass rounded to a whole number + substance unit, mg / g) on top and **Disruption** on the bottom. Tapping either box opens its more-info dialog (or the Sleep Disruption popup, depending on the Disruption mode).
- The Disruption box has **three display modes** (selectable via `disruption_mode` in the visual editor):
  - **Sleep Disruption** (default) — shows the band state (None / Low / Moderate / High). Tapping opens the substance-specific Sleep Disruption popup.
  - **Low - Timestamp** — shows the Low - Timestamp sensor formatted as `HH:MM` (24-hour). Tapping opens more-info.
  - **Low - Hours Until** — shows the Low - Hours Until countdown sensor formatted as `X h`. Tapping opens more-info.
- The Drinks tab's **Top Box** and **Bottom Box** are each fully overridable via the visual editor's Drinks Tab expandable (entity swap, custom icon/label, tap/hold/double-tap actions). The Top Box defaults to the In Body sensor; the Bottom Box defaults to the Sleep Disruption sensor (with a Time to Low selector to switch to the Low - Timestamp / Low - Hours Until sensor).
- Up to 4 **custom boxes** (separate from the Daily tab's boxes) can be added. Each box has its own collapsable menu in the visual editor with entity, icon, label, and tap/hold/double-tap actions. Tapping a box defaults to more-info on its entity.

### 📊 Graph

- 14-day bar graph of aggregated doses across every granular drink of the substance.
- Amount-in-body line graph of the master body-mass decay (mg caffeine / g alcohol) with the same timeframes as medicine (12H, 24H, 48H, 7D, 14D, 30D).

### 📦 Inventory

- Two-column grid (same box sizing + 8px spacing as the Stats tab), one row per granular drink of the substance:
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
| `default_view` | string | `daily` | Tab shown when the card loads. Options: `daily`, `graphs`, `stats`, `drinks`, `inventory`, `tools`, `tracking`. Falls back to `daily` if the tab is invalid for the bound device type |
| `big_text` | boolean | `false` | When on, all text in the card becomes 2px larger for easier reading. Off by default for a compact view |
| `bold_text` | boolean | `false` | When on, all card text becomes 50% bolder for better readability. Independent of Large Text. Off by default |
| `take_pill_icon` | string | `mdi:pill` | Icon shown on the Take Pill button when the limit has not been reached. The limit-reached state always uses `mdi:alert` |
| `take_pill_label` | string | `Take Pill` | Text shown on the Take Pill button when the limit has not been reached. Change to match the medicine form, e.g. `Inject Dose`, `Apply Cream` |
| `safe_to_take_show_amount_in_body` | boolean | `false` | Show the Amount in Body sensor instead of Safe to take. The Take Pill limit check still uses the real Safe to Take sensor. Overrides `safe_to_take_entity` when on |
| `safe_to_take_entity` | entity | _(empty)_ | Override Entity for the Top Box (Safe to Take). Any Home Assistant entity to display. Leave empty to use the built-in Safe to Take sensor (or Amount in Body when the toggle is on). The Take Pill button safety logic always uses the real Safe to Take sensor regardless of this setting |
| `safe_to_take_label` | string | `Safe to take` / `Amount in Body` | Override Label for the Top Box (Safe to Take). Defaults depend on the toggle |
| `safe_to_take_icon` | icon | `mdi:shield-check` / `mdi:chart-bell-curve` | Override Icon for the Top Box (Safe to Take). Defaults depend on the toggle |
| `safe_to_take_tap_action` | action | `more-info` | Action to perform when the Top Box (Safe to Take) is tapped. Defaults to more-info on the displayed entity |
| `safe_to_take_hold_action` | action | _(none)_ | Action to perform when the Top Box (Safe to Take) is long-pressed |
| `safe_to_take_double_tap_action` | action | _(none)_ | Action to perform when the Top Box (Safe to Take) is double-tapped |
| `pills_left_label` | string | `Pills left` | Override Label for the Bottom Box (Pills Left). Change to match the form/unit, e.g. `Amount Left (ml)`, `Doses Left` |
| `pills_left_icon` | icon | `mdi:pill` | Override Icon for the Bottom Box (Pills Left) |
| `pills_left_show_days_left` | boolean | `false` | Show the Days left sensor instead of Pills left. Keeps the Refill dialog as the default tap |
| `pills_left_entity` | entity | _(empty)_ | Override Entity for the Bottom Box (Pills Left). Any Home Assistant entity to display. Leave empty to use the built-in Pills Left number entity (or Days left when the toggle is on). Overridden by the Days Left toggle. Tapping still opens the Refill dialog by default |
| `pills_left_tap_action` | action | `refill` | Action when the Bottom Box (Pills Left) is tapped. Defaults to the Refill dialog; a custom action overrides it |
| `pills_left_hold_action` | action | _(none)_ | Action when the Bottom Box (Pills Left) is long-pressed |
| `pills_left_double_tap_action` | action | _(none)_ | Action when the Bottom Box (Pills Left) is double-tapped |
| `log_drink_icon` | icon | `mdi:coffee` / `mdi:glass-mug-variant` | Icon for the Log Drink button on the Drinks tab (Master Tracker cards). Substance-aware default |
| `log_drink_label` | string | `Log Drink` | Label for the Log Drink button |
| `in_body_entity` | entity | _(empty)_ | Override Entity for the Top Box (In Body). Any Home Assistant entity to display. Leave empty to use the built-in In Body sensor |
| `in_body_icon` | icon | `mdi:chart-bell-curve` | Override Icon for the Top Box (In Body) |
| `in_body_label` | string | `In Body` | Override Label for the Top Box (In Body) |
| `in_body_tap_action` | action | `more-info` | Action when the Top Box (In Body) is tapped |
| `in_body_hold_action` | action | _(none)_ | Action when the Top Box (In Body) is long-pressed |
| `in_body_double_tap_action` | action | _(none)_ | Action when the Top Box (In Body) is double-tapped |
| `disruption_mode` | select | `disruption` | Display mode for the Bottom Box (Disruption). `disruption` = Sleep Disruption state (None/Low/Moderate/High); `low_timestamp` = Low - Timestamp (HH:MM); `low_hours_until` = Low - Hours Until countdown (X h). Overrides `disruption_entity` when set to a Low mode |
| `disruption_entity` | entity | _(empty)_ | Override Entity for the Bottom Box (Disruption). Any Home Assistant entity to display. Leave empty to use the built-in sensor. Overridden by the `disruption_mode` Low modes |
| `disruption_icon` | icon | `mdi:sleep` / `mdi:clock-outline` / `mdi:timer-sand` | Override Icon for the Bottom Box (Disruption). Defaults to the mode-specific icon |
| `disruption_label` | string | `Disruption` / `Low - Timestamp` / `Low - Hours Until` | Override Label for the Bottom Box (Disruption). Defaults to the mode-specific label |
| `disruption_tap_action` | action | `popup` / `more-info` | Action when the Bottom Box (Disruption) is tapped. Defaults to the Sleep Disruption popup (`disruption` mode) or more-info (Low modes) |
| `disruption_hold_action` | action | _(none)_ | Action when the Bottom Box (Disruption) is long-pressed |
| `disruption_double_tap_action` | action | _(none)_ | Action when the Bottom Box (Disruption) is double-tapped |
| `drink_chip_1`–`drink_chip_4` | entity | _(empty)_ | Custom boxes shown on the Drinks tab (Master Tracker cards). Up to 4 entities, each in its own collapsable menu |
| `drink_chip_1_label`–`drink_chip_4_label` | string | _(empty)_ | Optional label for each Drinks-tab box. Leave empty to use the entity's friendly name |
| `drink_chip_1_icon`–`drink_chip_4_icon` | icon | _(entity default)_ | Optional icon for each Drinks-tab box. Leave empty for the entity's default icon |
| `drink_chip_1_show_icon`–`drink_chip_4_show_icon` | boolean | `false` | Show an icon on each Drinks-tab box. Off by default (clean label-over-value tile matching the Graph tab Day Avg Boxes). When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout |
| `drink_chip_1_tap_action`–`drink_chip_4_tap_action` | action | more-info | Tap action for each Drinks-tab box. Defaults to more-info on the entity |
| `drink_chip_1_hold_action`–`drink_chip_4_hold_action` | action | _(none)_ | Hold (long-press) action for each Drinks-tab box |
| `drink_chip_1_double_tap_action`–`drink_chip_4_double_tap_action` | action | _(none)_ | Double-tap action for each Drinks-tab box |
| `stats_3_columns` | boolean | `false` | Use 3-column layout for the stats tab |
| `show_amount_in_body` | boolean | `true` | Show the "Amount in Body" line graph in the Graphs tab. When on (and the device has a usable Amount in Body state), it is the default graph shown when navigating to the Graphs tab |
| `amount_in_body_default_timeframe` | string | `48h` | Default timescale for the Amount in Body graph on card load. Options: `12h`, `24h`, `48h`, `7d`, `14d`, `30d`. Useful for medications where a shorter window (e.g. 12h) is more informative |
| `show_day_avg_boxes` | boolean | `true` | Show rolling day-average boxes in the Stats tab |
| `show_adherence_boxes` | boolean | `true` | Show adherence percentage boxes in the Stats tab |
| `hide_nav_bar` | boolean | `false` | Hide the bottom navigation bar (Daily/Graphs/Stats/Tools). Useful for dashboards that only need the Daily tab |
| `confirm_tool_actions` | boolean | `true` | Show a confirmation popup before running any Tools tab action. Turn off to fire actions immediately without a popup. Configured under the Settings Tab expandable in the visual editor |
| `chip_1`–`chip_4` | string | — | Entity IDs for custom boxes in the Daily tab. Each box has its own collapsable menu in the visual editor |
| `chip_1_label`–`chip_4_label` | string | — | Custom labels for the corresponding boxes |
| `chip_1_icon`–`chip_4_icon` | icon | _(entity default)_ | Optional icon for each box. Leave empty for the entity's default icon |
| `chip_1_show_icon`–`chip_4_show_icon` | boolean | `false` | Show an icon on each box. Off by default (clean label-over-value tile matching the Graph tab Day Avg Boxes). When on, the box grows taller to fit the icon above the label — useful to make boxes larger for a button-like layout |
| `chip_1_tap_action`–`chip_4_tap_action` | action | more-info | Tap action for each box. Defaults to more-info on the entity |
| `chip_1_hold_action`–`chip_4_hold_action` | action | _(none)_ | Hold (long-press) action for each box |
| `chip_1_double_tap_action`–`chip_4_double_tap_action` | action | _(none)_ | Double-tap action for each box |

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
