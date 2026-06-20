// Lightweight localization helper for the Pill Logger card.
// Currently English-only; adding a new language is just adding
// another key to the `translations` object.

const translations: Record<string, Record<string, string>> = {
  en: {
    // ── Card-level ──
    'card.loading': 'Loading...',
    'card.placeholder_title': 'Pill Logger Card',
    'card.placeholder_subtitle': 'Please select a device in the visual editor to begin.',

    // ── Pane tabs ──
    'pane.daily': 'Daily',
    'pane.graphs': 'Graphs',
    'pane.stats': 'Stats',
    'pane.tools': 'Tools',

    // ── Daily pane ──
    'daily.take_pill': 'Take Pill',
    'daily.limit_reached': 'LIMIT REACHED',
    'daily.last': 'Last',
    'daily.next': 'Next',
    'daily.over': 'over',
    'daily.safe_to_take': 'Safe to take',
    'daily.pills_left': 'Pills left',
    'daily.na': 'N/A',

    // ── Graphs pane ──
    'graphs.bar_title': '{days}-day taken tracker',
    'graphs.line_title': 'Amount in Body',
    'graphs.empty_bar': 'No dose data yet',
    'graphs.loading_history': 'Loading history...',
    'graphs.timeframe_12h': '12H',
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

    // ── Dialogs ──
    'dialog.warning': 'Warning',
    'dialog.cancel': 'Cancel',
    'dialog.confirm': 'Confirm',
    'dialog.refill.title': 'Refill Medication',
    'dialog.refill.placeholder': 'Enter number of pills',
    'dialog.refill.confirm': 'Refill',
    'dialog.override.body': 'Pill limit does not reset until: {expiry}. Override?',
    'dialog.override.confirm': 'Override',
    'dialog.device_info.button': 'To Device info',
    'dialog.device_info.aria': 'View device info',
    'dialog.refill.aria': 'Refill medication',

    // ── Config form labels ──
    'config.device_id': 'Device',
    'config.big_text': 'Big Text',
    'config.color_scheme': 'Color Scheme',
    'config.name': 'Name Override',
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
    'config.show_amount_in_body': 'Amount in Body Graph',
    'config.show_day_avg_boxes': 'Day Avg Boxes',
    'config.show_adherence_boxes': 'Adherence Boxes (If available)',
    'config.stats_3_columns': '3-Column Stats',
    'config.hide_nav_bar': 'Hide Navigation Bar',

    // ── Config form helpers ──
    'config.helper.device_id': 'Select your Pill Logger medication device.',
    'config.helper.big_text': 'When off, all text is 2px smaller. Daily pane shrinks further for compact view.',
    'config.helper.color_scheme': 'Sets the accent color for buttons, icons, and highlights across the card.',
    'config.helper.name': 'Custom name for this medication. Leave empty to use the device name.',
    'config.helper.chip_label': "Custom display name for this chip. Leave empty to use the entity's friendly name.",
    'config.helper.chip': 'Entity from the selected device to display as a chip on the Daily pane.',
    'config.helper.show_amount_in_body': 'Show the Amount in Body line graph as a second slide in the Graphs pane.',
    'config.helper.show_day_avg_boxes': 'Show the 7/14/30-day and yearly average boxes beneath the bar graph.',
    'config.helper.show_adherence_boxes': 'Show the 7/14/30/365-day adherence percentage boxes beneath the bar graph. Only applies when the device has adherence sensors.',
    'config.helper.stats_3_columns': 'Display statistics in 3 columns instead of 2.',
    'config.helper.hide_nav_bar': 'Hide the bottom Daily/Graphs/Stats/Tools navigation bar. Use for dashboards that only need the Daily pane.',

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
    'setconfig.error.device_required': 'A device is required for the Pill Logger card.',

    // ── aria-labels ──
    'aria.take_pill_safe': 'Take pill',
    'aria.take_pill_limit': 'Limit reached, override available',
    'aria.timeframe_12h': '12 hours',
    'aria.timeframe_48h': '48 hours',
    'aria.timeframe_7d': '7 days',
    'aria.timeframe_14d': '14 days',
    'aria.timeframe_30d': '30 days',
    'aria.timeframe_60d': '60 days',
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