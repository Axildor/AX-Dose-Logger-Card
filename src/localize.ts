// Lightweight localization helper for the AX Dose Logger card.
// Currently English-only; adding a new language is just adding
// another key to the `translations` object.

const translations: Record<string, Record<string, string>> = {
  en: {
    // ── Card-level ──
    'card.loading': 'Loading...',
    'card.placeholder_title': 'AX Dose Logger Card',
    'card.placeholder_subtitle': 'Please select a device in the visual editor to begin.',

    // ── Pane tabs ──
    'pane.daily': 'Daily',
    'pane.graphs': 'Graphs',
    'pane.stats': 'Stats',
    'pane.tools': 'Tools',
    'pane.caffeine': 'Caffeine',
    'pane.drinks': 'Drinks',
    'pane.inventory': 'Inventory',

    // ── Daily pane ──
    'daily.take_pill': 'Take Pill',
    'daily.limit_reached': 'LIMIT REACHED',
    'daily.last': 'Last',
    'daily.next': 'Next',
    'daily.overdue': 'Overdue',
    'daily.safe_to_take': 'Safe to take',
    'daily.pills_left': 'Pills left',
    'daily.na': 'N/A',

    // ── Graphs pane ──
    'graphs.bar_title': '{days}-day taken tracker',
    'graphs.line_title': 'Amount in Body',
    'graphs.empty_bar': 'No dose data yet',
    'graphs.empty_effectiveness': 'No effectiveness data yet',
    'graphs.effectiveness_title': 'Effectiveness',
    'graphs.effectiveness_avg': 'Avg',
    'graphs.effectiveness_individual': 'Individual',
    'graphs.loading_history': 'Loading history...',
    'graphs.timeframe_12h': '12H',
    'graphs.timeframe_24h': '24H',
    'graphs.timeframe_48h': '48H',
    'graphs.timeframe_7d': '7D',
    'graphs.timeframe_14d': '14D',
    'graphs.timeframe_30d': '30D',
    'graphs.timeframe_60d': '60D',
    'graphs.aria_prev': 'Previous graph',
    'graphs.aria_next': 'Next graph',

    // ── Stats pane ──
    'stats.total_doses': 'Total Doses',
    'stats.days_since_first_dose': 'Days Since First Dose',
    'stats.last_dose': 'Last Dose',
    'stats.strength': 'Strength',
    'stats.amount_in_body': 'Amount in Body',
    'stats.steady_state': 'Steady State',
    'stats.steady_state_reached': 'Reached ✓',
    'stats.steady_state_days': '{days} days',
    'stats.avg_7_day': '7-Day Average',
    'stats.avg_14_day': '14-Day Average',
    'stats.avg_30_day': '30-Day Average',
    'stats.avg_yearly': 'Yearly Average',
    'stats.avg_running': '{days}-Day Average',
    'stats.adherence_7_day': '7-Day Adherence',
    'stats.adherence_14_day': '14-Day Adherence',
    'stats.adherence_30_day': '30-Day Adherence',
    'stats.adherence_365_day': '365-Day Adherence',
    'stats.adherence_running': '{days}-Day Adherence',
    'stats.amount_last_24h': 'Amount in Last 24h',
    'stats.sleep_disruption': 'Sleep Disruption',
    'stats.estimated_low_time': 'Estimated Low Time',

    // ── Averages grid (short labels) ──
    'averages.avg_7_day': '7-Day Avg',
    'averages.avg_14_day': '14-Day Avg',
    'averages.avg_30_day': '30-Day Avg',
    'averages.avg_year': 'Year Avg',
    'averages.avg_running': '{days}-Day Avg',
    'averages.adh_7_day': '7d Adh',
    'averages.adh_14_day': '14d Adh',
    'averages.adh_30_day': '30d Adh',
    'averages.adh_365_day': '365d Adh',
    'averages.adh_running': '{days}d Adh',

    // ── Drinks pane (Master Tracker) ──
    'drinks.caffeine': 'Caffeine',
    'drinks.alcohol': 'Alcohol',
    'drinks.log_drink': 'Log Drink',
    'drinks.in_body': 'In Body',
    'drinks.disruption': 'Disruption',
    'drinks.sleep_disruption': 'Sleep Disruption',
    'drinks.redirect_caffeine': 'Please select the Caffeine device to view this drink.',
    'drinks.redirect_alcohol': 'Please select the Alcohol device to view this drink.',

    // ── Inventory pane (Master Tracker) ──
    'inventory.empty': 'No drinks of this category configured.',
    'inventory.avg_7_day': '7-Day Avg',

    // ── Caffeine pane (legacy scaffold, retained one release) ──
    'caffeine.placeholder': 'Caffeine tracking — coming soon',

    // ── Tracking pane ──
    'pane.tracking': 'Tracking',
    'tracking.today_label': "Today's {metric}",
    'tracking.not_set': 'Not set',
    'tracking.set_today': 'Set for today',
    'tracking.already_set_title': 'Already Set Today',
    'tracking.already_set_body': "You already set {metric} to {oldValue} today. Change to {newValue}?",
    'tracking.override': 'Override',
    'tracking.cancel': 'Cancel',

    // ── Tools pane ──
    'tools.adherence_header': 'Adherence Tools',
    'tools.general_header': 'General Tools',
    'tools.reset_adherence': 'Reset Adherence %',
    'tools.mark_adherence_taken': 'Mark Last Adherence Taken',
    'tools.reset_history': 'Reset History',
    'tools.undo_dose': 'Undo Dose',
    'tools.empty': 'No maintenance tools available for this medication.',

    // ── Tools dialog descriptors ──
    'tools.desc.reset_adherence': 'Clears the adherence percentage history for all windows. Does NOT affect Amount in Body, dose count, or any other sensor.',
    'tools.desc.mark_adherence_taken': 'Marks the most recent missed dose slot as taken for adherence calculation only. Does NOT add a dose to the pharmacokinetics model or dose count.',
    'tools.desc.reset_history': 'Clears ALL dose history across every sensor — adherence, Amount in Body, totals, and last dose. This cannot be undone.',
    'tools.desc.undo_dose': 'Removes the most recently logged dose from all sensors, including the pharmacokinetics model and adherence calculation.',
    'tools.drinks_header': 'Drink Maintenance',
    'tools.undo_drink': 'Undo {name}',
    'tools.reset_drink': 'Reset {name}',
    'tools.desc.undo_drink': "Removes the most recently logged drink of this granular device from the master tracker and this drink's own stats.",
    'tools.desc.reset_drink': 'Clears ALL dose history for this granular drink — totals, last dose, and averages. The master tracker keeps its aggregated history. This cannot be undone.',

    // ── Dialogs ──
    'dialog.warning': 'Warning',
    'dialog.cancel': 'Cancel',
    'dialog.confirm': 'Confirm',
    'dialog.refill.title': 'Refill Medication',
    'dialog.refill.placeholder': 'Enter number of pills',
    'dialog.refill.confirm': 'Refill',
    'dialog.refill.title_drink': 'Refill {name}',
    'dialog.log_drink.title': 'Log Drink',
    'dialog.log_drink.empty': 'No drinks of this category configured.',
    'dialog.override.body_scheduled': 'Your next scheduled dose is not until {time}. Take a dose now anyway?',
    'dialog.override.body_as_needed': 'Your next safe dose is not until {time}. Take a dose now anyway?',
    'dialog.override.confirm': 'Override',
    'dialog.device_info.button': 'To Device info',
    'dialog.device_info.aria': 'View device info',
    'dialog.refill.aria': 'Refill medication',

    // ── Sleep Disruption dialog (Master Tracker) ──
    'dialog.sleep_disruption.title': 'Sleep Disruption',
    'dialog.sleep_disruption.close': 'Close',
    'dialog.sleep_disruption.caffeine': [
      '### Caffeine Sleep Disruption',
      '',
      '* **None (0 - 10 mg):** Negligible impact. Normal sleep cycles and melatonin production.',
      '* **Low (11 - 30 mg):** Minor shift. Deep sleep remains mostly stable.',
      '* **Moderate (31 - 60 mg):** Hidden disruption. Measurable drop in deep sleep and an elevated resting heart rate.',
      '* **High (61+ mg):** Severe disruption. Increased tossing and turning, frequent micro-awakenings, and delayed sleep onset.',
      '* **Note on "Immunity":** Even if you easily fall asleep with caffeine in your system, it still chemically blocks your deep, restorative sleep phases. You are unconscious, but not resting.',
      '',
      '*See README for full biological breakdown.*',
    ].join('\n'),
    'dialog.sleep_disruption.alcohol': [
      '### Alcohol Sleep Disruption',
      '',
      '* **None (0 g):** Clean architecture. Normal resting heart rate and REM cycles.',
      '* **Low (1 - 10 g):** Minor rebound. Slight, brief elevation in heart rate during the night.',
      '* **Moderate (11 - 30 g):** Restless sleep. Mid-night awakenings, temperature dysregulation (sweating), and lowered Heart Rate Variability (HRV).',
      '* **High (31+ g):** Severe stress. Spiked heart rate for hours, frequent waking, and stressful REM rebound (vivid dreams).',
      '* **Note on "The Nightcap":** Using alcohol to fall asleep faster is a biological trap. You trade falling asleep quickly for destroying the restorative quality of the second half of your night.',
      '',
      '*See README for full biological breakdown.*',
    ].join('\n'),

    // ── Config form labels ──
    'config.device_id': 'Device',
    'config.big_text': 'Large Text',
    'config.take_pill_icon': 'Take Pill Icon',
    'config.take_pill_label': 'Take Pill Label',
    'config.safe_to_take_box': 'Safe to Take Box',
    'config.safe_to_take_entity': 'Safe to Take Entity',
    'config.safe_to_take_label': 'Safe to Take Label',
    'config.safe_to_take_icon': 'Safe to Take Icon',
    'config.safe_to_take_tap_action': 'Tap Action',
    'config.safe_to_take_hold_action': 'Hold Action',
    'config.safe_to_take_double_tap_action': 'Double Tap Action',
    'config.pills_left_label': 'Pills Left Label',
    'config.pills_left_icon': 'Pills Left Icon',
    'config.color_scheme': 'Color Scheme',
    'config.name': 'Name Override',
    'config.daily_panel': 'Daily Panel',
    'config.graphs_panel': 'Graphs Panel',
    'config.stats_panel': 'Stats Panel',
    'config.chips': 'Custom Chips',
    'config.chip_1': 'Chip 1 (optional)',
    'config.chip_1_label': 'Chip 1 Label',
    'config.chip_2': 'Chip 2 (optional)',
    'config.chip_2_label': 'Chip 2 Label',
    'config.chip_3': 'Chip 3 (optional)',
    'config.chip_3_label': 'Chip 3 Label',
    'config.chip_4': 'Chip 4 (optional)',
    'config.chip_4_label': 'Chip 4 Label',
    'config.graph_options': 'Graph',
    // (graph_options key retained for backward compat; graphs_panel is the active expandable name)
    'config.show_amount_in_body': 'Amount in Body Graph',
    'config.amount_in_body_default_timeframe': 'Amount in Body Default Timescale',
    'config.show_day_avg_boxes': 'Day Avg Boxes',
    'config.show_adherence_boxes': 'Adherence Boxes (If available)',
    'config.stats_3_columns': '3-Column Stats',
    'config.hide_nav_bar': 'Hide Navigation Bar',

    // ── Config form helpers ──
    'config.helper.device_id': 'Choose a medication device.',
    'config.helper.big_text': 'Enlarges all card text for easier reading.',
    'config.helper.take_pill_icon': 'Icon for the Take Pill button. Defaults to mdi:pill.',
    'config.helper.take_pill_label': 'Button text. Defaults to "Take Pill". E.g. "Inject Dose", "Apply Cream".',
    'config.helper.safe_to_take_box': 'Replace the box with any entity. Leave empty for the default sensor.',
    'config.helper.safe_to_take_entity': 'Any entity to show here. Leave empty for default.',
    'config.helper.safe_to_take_label': 'Custom label. Defaults to "Safe to take".',
    'config.helper.safe_to_take_icon': 'Icon on the Safe to Take box. Defaults to mdi:shield-check.',
    'config.helper.safe_to_take_tap_action': 'Defaults to more-info.',
    'config.helper.safe_to_take_hold_action': 'Long-press action.',
    'config.helper.safe_to_take_double_tap_action': 'Double-tap action.',
    'config.helper.pills_left_label': 'Defaults to "Pills left". E.g. "Amount Left (ml)", "Doses Left".',
    'config.helper.pills_left_icon': 'Icon on the Pills Left box. Defaults to mdi:pill.',
    'config.helper.color_scheme': 'Accent color for the card.',
    'config.helper.name': 'Leave empty to use the device name.',
    'config.helper.chip_label': "Leave empty to use the entity's name.",
    'config.helper.chip': 'Show as a chip on the Daily pane.',
    'config.helper.show_amount_in_body': 'Show in the Graphs pane.',
    'config.helper.amount_in_body_default_timeframe': 'Default timescale on card load.',
    'config.helper.show_day_avg_boxes': 'Show beneath the bar graph.',
    'config.helper.show_adherence_boxes': 'Show beneath the bar graph. Requires adherence sensors.',
    'config.helper.stats_3_columns': '3 columns instead of 2.',
    'config.helper.hide_nav_bar': 'Hide the pane navigation bar.',

    // ── Color scheme labels ──
    'color.default': 'Default (HA Theme)',
    'color.blue': 'Blue',
    'color.red': 'Red',
    'color.green': 'Green',
    'color.yellow': 'Yellow',
    'color.orange': 'Orange',
    'color.purple': 'Purple',
    'color.pink': 'Pink',
    'color.teal': 'Teal',
    'color.brown': 'Brown',
    'color.coral': 'Coral',
    'color.slate': 'Slate',
    'color.gold': 'Gold',
    'color.grey': 'Grey',

    // ── setConfig error ──
    'setconfig.error.device_required': 'A device is required for the AX Dose Logger card.',

    // ── aria-labels ──
    'aria.take_pill_safe': 'Take pill',
    'aria.take_pill_limit': 'Limit reached, override available',
    'aria.timeframe_12h': '12 hours',
    'aria.timeframe_24h': '24 hours',
    'aria.timeframe_48h': '48 hours',
    'aria.timeframe_7d': '7 days',
    'aria.timeframe_14d': '14 days',
    'aria.timeframe_30d': '30 days',
    'aria.timeframe_60d': '60 days',
    'aria.effectiveness_avg': 'Average of visible effectiveness trackers',
    'aria.effectiveness_individual': 'Individual effectiveness trackers',
  },
};

/**
 * Look up a localized string.
 * @param lang  BCP47 language code from hass.language (e.g. "en", "de")
 * @param key   Dot-separated key into the translation map
 * @param params  Optional { placeholder: value } for {placeholder} interpolation
 * @returns  The translated string, falling back to English, then to the key
 */
export function localize(
  lang: string,
  key: string,
  params?: Record<string, string | number>
): string {
  let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}