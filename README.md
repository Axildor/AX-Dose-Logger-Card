[![GitHub Release](https://img.shields.io/github/v/release/Axildor/AX-Dose-Logger-Card?style=flat-square)](https://github.com/Axildor/AX-Dose-Logger-Card/releases)
[![HACS Status](https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square)](https://github.com/hacs/integration)
[![HACS Validation Status](https://img.shields.io/github/actions/workflow/status/Axildor/AX-Dose-Logger-Card/hacs.yaml?branch=master&label=HACS%20Validation&style=flat-square)](https://github.com/Axildor/AX-Dose-Logger-Card/actions/workflows/hacs.yaml)
[![Buy me a tea](https://img.shields.io/badge/Buy_me_a_tea-☕-FF5E5B?style=flat-square&logo=ko-fi&logoColor=white)](https://ko-fi.com/axildor)

# 💊 AX Dose Logger Card

A custom Lovelace dashboard card for the [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) Home Assistant integration — surfacing medications and drinks (caffeine & alcohol) in a polished, purpose-built UI with no template YAML and no Mushroom/Card-Mod dependencies.

<!-- SCREENSHOT: Hero — Daily tab of a medication card showing medication name, Take Pill button with next-dose countdown, pills safe to take, last dose, inventory count, custom boxes -->
> 📸 **Screenshot needed:** Hero image — the Daily tab of a medication card (name, Take Pill button, pills safe to take, last dose, inventory, custom boxes).

---

## Companion Integration

This card is the purpose-built UI for the [**AX Dose Logger**](https://github.com/Axildor/AX-Dose-Logger) integration. It surfaces everything the integration produces — sensors, buttons, PK graphs, drink tracking — so you don't need template YAML. The integration must be installed and configured first.

---

## Quick Start

1. **Install the integration** — [AX Dose Logger](https://github.com/Axildor/AX-Dose-Logger) via HACS (Integration category), then add at least one medication or drink through its config flow.
2. **Install this card** — via HACS (Dashboard category), repository URL `https://github.com/Axildor/AX-Dose-Logger-Card` (see [Installation](#installation)).
3. **Add the card** — Edit your dashboard → Add Card → search "AX Dose Logger" → pick your Medicine device, or select one or more Drink Trackers (Caffeine/Alcohol Tracker) in the visual editor. Done.

---

## Table of Contents

- [Companion Integration](#companion-integration)
- [Quick Start](#quick-start)
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
- [Drinks Card (Master Tracker)](#-drinks-card-master-tracker)
  - [Drinks](#-drinks)
  - [Graph](#-graph)
  - [Inventory](#-inventory)
  - [Stats (Drinks)](#-stats-drinks)
  - [Tools (Drinks)](#-tools-drinks)
- [Full Documentation](#full-documentation)
- [Support the Project](#-support-the-project)
- [License](#license)

> 🔧 Power users customizing button styling, animations, color schemes, or writing YAML by hand: see **[Advanced-Users.md](Advanced-Users.md)**.

---

## Prerequisites

- The **AX Dose Logger** integration installed and configured (at least one medication or drink added).
- Home Assistant dashboards enabled.

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

## Configuration

### Visual Editor

1. Edit your dashboard → Add Card → Search for "AX Dose Logger"
2. Select one or more **Medicines** (top selector — all-in-one medicine card with a switcher when you pick more than one) or one or more **Drink Trackers** (Caffeine/Alcohol Tracker) in the lower selector
3. Configure color scheme, custom boxes, graph options, and per-box overrides as desired

The visual editor is organized into expandable sections: **Daily Tab**, **Drinks Tab**, and **Graphs Tab**, each with collapsable per-box menus. The full reference table of every config option is in [Advanced-Users.md](Advanced-Users.md#configuration-options).

---

## Features

The card adapts its tabs to the selected device type:

- **Medicine devices** — five tabs: Daily, Graphs, Stats, Tools (plus Tracking when effectiveness metrics exist).
- **Master Tracker devices** (Caffeine Tracker / Alcohol Tracker) — five tabs: Drinks, Graph, Inventory, Stats, Tools.
- **Granular drink devices** (e.g. Coffee, Espresso) — a single redirect tab asking you to select the matching Caffeine/Alcohol Tracker device, since per-drink maintenance belongs on the Master Tracker's card.

---

## Medicine Tabs

### 📅 Daily

- **Take Pill button** with next-dose countdown. The button color encodes the system's current status:
  - 💊 **Multi-pill slots** — when your medication is configured with more than one pill per dose time (backend *Pills per dose time* setting), the button shows **"N left this slot"** in place of the next-dose countdown until the current dose time is fully taken. The button stays blue "due" until every pill of the slot is taken.
  - � **Red** — limit reached (an override confirmation dialog appears)
  - 🔵 **Blue** — a scheduled dose is due now
  - 🟠 **Amber** — overdue (the on-time window is closing)
  - 🟢 **Green** — brief "Logged" flash after a successful press
  - ⚪ **Theme** — idle
  - For the full state matrix, style/icon options, and animation internals, see [Advanced-Users.md](Advanced-Users.md#button-state-matrix).
- **Pills safe to take** indicator
- **Last dose** timestamp
- **Inventory count** (double-tap to refill)
- **Custom boxes** for any related entities — each with its own collapsable menu in the visual editor (entity, icon, label, tap/hold/double-tap actions). Tapping a box defaults to more-info.
- **Top Box** and **Bottom Box** — fully overridable via the visual editor's Daily Tab expandable:
  - **Top Box** — toggle to show Amount in Body instead of Safe to Take, or swap to any entity with a custom icon/label and actions.
  - **Bottom Box** — toggle to show Days Left instead of Pills Left, or swap to any entity with a custom icon/label and actions.

<!-- SCREENSHOT: Daily tab -->
<img width="441" alt="Screenshot 2026-08-11 210821" src="https://github.com/user-attachments/assets/a31f8115-1157-4d40-86c4-921d66abb45d" /> <img width="441" alt="Screenshot 2026-08-11 210929" src="https://github.com/user-attachments/assets/7f276b4d-d27f-4a26-9bdd-08ca4a0331e3" />

### 📊 Graphs

- **Bar graph** of daily doses (14D / 30D / 60D).
- **Amount-in-body line graph** (12H / 24H / 48H / 7D / 14D / 30D) — the default graph when enabled.
- **Effectiveness line graph** — appears automatically when the medication tracks effectiveness metrics. Toggle Avg vs Individual, show/hide per-tracker metrics. Requires the HA recorder enabled with retention ≥ the selected timescale.

<!-- SCREENSHOT: Graphs tab -->
> 📸 **Screenshot needed:** Graphs tab — bar graph + amount-in-body line graph.

### 📈 Stats

- Rolling averages (7, 14, 30, 365 days)
- Adherence percentages (7, 14, 30, 365 days)
- Total doses and days since first dose
- Days left / Est. days left (inventory burn rate)
- Medicines also show: Amount in Last 24h, Daily Remaining (when a daily limit is set), Pills Safe to Take, Next Dose, and Overdue
- Drink Trackers also show: Daily Remaining (when a daily limit is set), Sleep-Safe Time, and Next Band (with countdown)
- Every row is clickable → opens the entity's more-info dialog

<!-- SCREENSHOT: Stats tab -->
> 📸 **Screenshot needed:** Stats tab — rolling averages, adherence, totals, days left.

### 🔧 Tracking

Appears automatically when the medication has effectiveness metrics enabled. Shows a daily-locked 0–10 slider for each tracked symptom (Pain, Mood, Nausea, Fatigue, plus any custom metrics). Each slider can only be set once per calendar day; an override dialog appears if you try to change it. Sliders reset to **unknown** at midnight.

<!-- SCREENSHOT: Tracking tab -->
> 📸 **Screenshot needed:** Tracking tab — daily-locked 0–10 symptom sliders.

### 🔧 Tools

Maintenance actions grouped into three sections. Every button follows the card's configured color scheme.

- **Adherence Tools** — Reset adherence percentage · Mark last missed dose as taken
- **Dose Tools** — Skip dose · Undo last dose
- **General Tools** — Reset dose history

A confirmation popup appears before any Tools action runs by default. Turn it off in the visual editor under **Settings Tab → Confirm Tool Actions**.

<!-- SCREENSHOT: Tools tab -->
> 📸 **Screenshot needed:** Tools tab — Adherence / Dose / General tool buttons.

---

## ☕ Drinks Card (Master Tracker)

Selecting a **Caffeine Tracker** or **Alcohol Tracker** device renders a dedicated Drinks card with five tabs:

### 🥤 Drinks

- A centered substance title (Caffeine / Alcohol) at the top — tapping opens the device-info dialog.
- A two-column main row identical in layout to the Daily tab:
  - **Left:** a tinted **Log Drink** button. Opens a popup listing every granular drink of that substance (e.g. Coffee, Espresso, Energy Drink for caffeine). Each drink shows a predictive **"Low: hh:mm"** line — the wall-clock time body-mass would drop into the *Low* sleep band *if logged now*. "Low: —" means the drink is safe. Pressing a drink logs it.
    - **Multi-user households:** if a drink is shared across multiple profiles (the backend M2M topology), tapping it reveals a **"Who is logging this?"** sub-list so you pick which profile receives the PK payload. Drinks assigned to a single profile (or none) log immediately with one tap. See [Profile Lock](#profile-lock-multi-user) below.
  - **Right:** two boxes — **In Body** (current body-mass + substance unit) on top and **Disruption** on the bottom. Tapping either opens its more-info dialog (or the Sleep Disruption popup, depending on the Disruption mode).
- The **Disruption box** has three display modes (Sleep Disruption, Low - Timestamp, Low - Hours Until) — see [Advanced-Users.md](Advanced-Users.md#disruption-box-display-modes) for the mode details.
- **Top Box** and **Bottom Box** — fully overridable via the visual editor's Drinks Tab expandable (entity swap, custom icon/label, actions). Top Box defaults to In Body; Bottom Box defaults to Sleep Disruption (with a selector to switch to the Low timestamp/hours sensors).
- Up to 4 **custom boxes** (separate from the Daily tab's boxes), each with its own collapsable menu.

<!-- SCREENSHOT: Drinks tab -->
> 📸 **Screenshot needed:** Drinks tab — substance title, Log Drink button, In Body + Disruption boxes, custom boxes.

### 📊 Graph

- 14-day bar graph of aggregated doses across every granular drink of the substance.
- Amount-in-body line graph of the master body-mass decay with the same timeframes as medicine (12H / 24H / 48H / 7D / 14D / 30D).

<!-- SCREENSHOT: Drinks Graph -->
> 📸 **Screenshot needed:** Drinks Graph tab — 14-day bar graph + body-mass decay line.

### 📦 Inventory

- Two-column grid, one row per granular drink of the substance:
  - **Left:** clickable refill box — the drink's name + unit + "Left" + current stock, and "Est. days left" + the per-drink burn rate. Tapping opens the refill dialog.
  - **Right:** the drink's 7-day average plus a trailing average. Clicking opens the granular drink's device-info popup.

<!-- SCREENSHOT: Drinks Inventory -->
> 📸 **Screenshot needed:** Drinks Inventory tab — per-drink refill + average boxes.

### 📈 Stats (Drinks)

- Amount in Last 24h (mg / g)
- Sleep Disruption
- Low - Timestamp (HH:MM)
- Low - Hours Until (X h countdown)
- Rolling averages (7, 14, 30, 365 days)
- Last drink timestamp
- Every row is clickable → opens the entity's more-info dialog

<!-- SCREENSHOT: Drinks Stats -->
> 📸 **Screenshot needed:** Drinks Stats tab — amount, disruption, low timestamp/hours, averages.

### 🔧 Tools (Drinks)

A per-granular-drink list of **Undo** and **Reset** buttons. Each opens a confirmation dialog before acting on that specific granular drink (the master tracker's aggregated history is preserved on a per-drink reset).

<!-- SCREENSHOT: Drinks Tools -->
> 📸 **Screenshot needed:** Drinks Tools tab — per-drink Undo / Reset buttons.

---

### 💊 All-in-One Medicine Card (Multi-Medicine)

Just like the Drinks side, a single card can host **multiple medicine devices**. In the visual editor, pick one or more medicine devices in the **Medicines Picker** (the top selector):

- **Two or more medicines selected** — the card runs the multi-medicine state machine. The card title becomes a switcher (`MedName ▾`) — tap it to pick which medicine the Daily, Graphs, Stats, Tracking, and Tools panes show. Your last-viewed medicine is remembered per browser.
- **One medicine selected** — the card always renders that single medicine.
- **No Medicines selected** — the card renders a "please select a device" placeholder.

Selecting a Caffeine/Alcohol Tracker in the Medicines Picker renders an "Invalid Medicine selection" error — trackers belong in the Drink Trackers picker.

---

### 👥 Multi-Profile (Multi-User)

In a multi-user household using the backend's [M2M multi-profile topology](https://github.com/Axildor/AX-Dose-Logger), each person can have their own **Drink Tracker** device (a Caffeine Tracker or Alcohol Tracker, with a per-profile PK curve). The card's visual editor exposes a **Drink Trackers** device multi-select (just below the **Medicines Picker**) where you pick one or more of these tracker devices.

- **One tracker selected** — the card always renders that single profile. Logging a shared drink (e.g. a Coca-Cola device assigned to multiple profiles) is one-tap; it always logs to the selected profile.
- **Two or more trackers selected (same substance)** — the card runs the multi-profile state machine. A header profile switcher lets you switch the active view, and shared drinks show a **"Who is logging this?"** picker when you tap them so the PK payload routes to the right person. All selected trackers must be the same substance (all Caffeine **or** all Alcohol); mixed selections render an "Invalid Drink Tracker selection" error.
- **No Drink Trackers selected** — the card falls back to the **Medicines Picker** (single medicine / granular drink card). Zero-config single-substance households auto-discover all matching tracker devices.

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
