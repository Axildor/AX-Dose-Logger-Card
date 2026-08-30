// ──────────────────────────────────────────────
// Shared types for the AX Dose Logger Card
// ──────────────────────────────────────────────
// Central location for interfaces used by both the container (AxDoseLoggerCard)
// and the presentational panel components. Kept in a standalone module to avoid
// circular imports: panels import types + helpers, the container imports types +
// panels, neither imports the other's runtime code except through the static
// editor-module and component imports owned by the container.

import type { HomeAssistant, LovelaceCardConfig, ActionConfig } from 'custom-card-helpers';
// DrinkInfo is defined in this file and referenced by CardController below.

// ──────────────────────────────────────────────
// Configuration / Home Assistant types
// ──────────────────────────────────────────────

export interface AxDoseLoggerCardConfig extends LovelaceCardConfig {
  /** @deprecated Legacy single-medicine device ID. The single Medicine Picker
   *  was removed from the visual editor (the Medicines Picker
   *  `medicine_devices` is now the only medicine picker). Kept only so
   *  setConfig/willUpdate can read it once and lazily migrate it into
   *  `medicine_devices` (a legacy device_id pointing at a Drink Tracker keeps
   *  the legacy master-card path instead). Deleted from persisted config
   *  after migration. Do NOT add new reads outside the migration path and
   *  _effectiveDeviceId(). */
  device_id?: string;
  name?: string;
  color_scheme?: string;
  // ── Custom Chips (Daily Panel) — per-chip full override suite ──
  // Each chip_N pair (entity + label) is now joined by an icon + 3 ui_action
  // overrides, mirroring the Safe to Take / Pills Left box pattern.  The
  // editor nests each chip inside its own collapsable "Chip N" expandable so
  // the full suite does not clutter the editor.
  chip_1?: string;
  chip_1_label?: string;
  chip_1_icon?: string;
  chip_1_show_icon?: boolean;
  chip_1_tap_action?: ActionConfig;
  chip_1_hold_action?: ActionConfig;
  chip_1_double_tap_action?: ActionConfig;
  chip_2?: string;
  chip_2_label?: string;
  chip_2_icon?: string;
  chip_2_show_icon?: boolean;
  chip_2_tap_action?: ActionConfig;
  chip_2_hold_action?: ActionConfig;
  chip_2_double_tap_action?: ActionConfig;
  chip_3?: string;
  chip_3_label?: string;
  chip_3_icon?: string;
  chip_3_show_icon?: boolean;
  chip_3_tap_action?: ActionConfig;
  chip_3_hold_action?: ActionConfig;
  chip_3_double_tap_action?: ActionConfig;
  chip_4?: string;
  chip_4_label?: string;
  chip_4_icon?: string;
  chip_4_show_icon?: boolean;
  chip_4_tap_action?: ActionConfig;
  chip_4_hold_action?: ActionConfig;
  chip_4_double_tap_action?: ActionConfig;
  show_amount_in_body?: boolean;
  amount_in_body_default_timeframe?: string;
  show_day_avg_boxes?: boolean;
  show_adherence_boxes?: boolean;
  stats_3_columns?: boolean;
  big_text?: boolean;
  hide_nav_bar?: boolean;
  bold_text?: boolean;
  /** Show a "Medical Color Indicators" explainer button in the device-info
   *  popup. Default ON so new users can learn the indicator colors; turn OFF
   *  to hide the button entirely once learned. Configured via the top-level
   *  settings in the visual editor. */
  show_color_indicator_explainer?: boolean;
  /** Show a confirmation popup before running any Tools panel action.
   *  Default ON (preserved via the negative-false check in the container).
   *  When set to false, Tools panel buttons fire their service call
   *  immediately with no warning dialog. Configured via the "Settings"
   *  expandable in the visual editor. */
  confirm_tool_actions?: boolean;
  /** Default pane shown when the card loads. One of:
   *  'daily' | 'graphs' | 'stats' | 'drinks' | 'inventory' | 'tools' | 'tracking'.
   *  Falls back to 'daily' when unset/invalid or when the pane is invalid for
   *  the bound device type (handled by the render-time auto-fallback). */
  default_view?: string;
  take_pill_icon?: string;
  take_pill_label?: string;
  safe_to_take_entity?: string;
  safe_to_take_label?: string;
  safe_to_take_icon?: string;
  /** When true, the Daily tab's top stat-pill box shows the Amount in Body
   *  sensor instead of the Safe to Take sensor. Default OFF (Safe to Take).
   *  Mirrors pills_left_show_days_left. Configured via the "Top Box" expandable
   *  in the visual editor. The Take Pill button's LIMIT REACHED logic always
   *  reads the real pillsSafeToTake sensor, so this swap is purely cosmetic. */
  safe_to_take_show_amount_in_body?: boolean;
  safe_to_take_tap_action?: ActionConfig;
  safe_to_take_hold_action?: ActionConfig;
  safe_to_take_double_tap_action?: ActionConfig;
  pills_left_label?: string;
  pills_left_icon?: string;
  pills_left_show_days_left?: boolean;
  pills_left_entity?: string;
  pills_left_tap_action?: ActionConfig;
  pills_left_hold_action?: ActionConfig;
  pills_left_double_tap_action?: ActionConfig;

  // ── Drinks Panel (Master Tracker) overrides — mirrors the Daily Panel ──
  // Populated by the Drinks Panel expandable in the visual editor. All
  // optional; the Drinks panel falls back to hardcoded defaults when unset.
  log_drink_icon?: string;
  log_drink_label?: string;
  in_body_entity?: string;
  in_body_icon?: string;
  in_body_label?: string;
  in_body_tap_action?: ActionConfig;
  in_body_hold_action?: ActionConfig;
  in_body_double_tap_action?: ActionConfig;
  /** Disruption Box display mode (Option A — single 3-option select):
   *  'disruption' (default) → Sleep Disruption state (None/Low/Moderate/High);
   *  'low_timestamp' → Low - Timestamp sensor formatted HH:MM;
   *  'low_hours_until' → Low - Hours Until countdown sensor formatted X h. */
  disruption_mode?: 'disruption' | 'low_timestamp' | 'low_hours_until';
  disruption_entity?: string;
  disruption_icon?: string;
  disruption_label?: string;
  disruption_tap_action?: ActionConfig;
  disruption_hold_action?: ActionConfig;
  disruption_double_tap_action?: ActionConfig;
  // ── Custom Chips (Drinks Panel) — per-chip full override suite ──
  // Mirrors the Daily Panel chip_* fields above.  Separate namespace so the
  // two panels' chip configs stay fully independent (a card is bound to one
  // device, but shared fields would carry over confusingly on device switch).
  drink_chip_1?: string;
  drink_chip_1_label?: string;
  drink_chip_1_icon?: string;
  drink_chip_1_show_icon?: boolean;
  drink_chip_1_tap_action?: ActionConfig;
  drink_chip_1_hold_action?: ActionConfig;
  drink_chip_1_double_tap_action?: ActionConfig;
  drink_chip_2?: string;
  drink_chip_2_label?: string;
  drink_chip_2_icon?: string;
  drink_chip_2_show_icon?: boolean;
  drink_chip_2_tap_action?: ActionConfig;
  drink_chip_2_hold_action?: ActionConfig;
  drink_chip_2_double_tap_action?: ActionConfig;
  drink_chip_3?: string;
  drink_chip_3_label?: string;
  drink_chip_3_icon?: string;
  drink_chip_3_show_icon?: boolean;
  drink_chip_3_tap_action?: ActionConfig;
  drink_chip_3_hold_action?: ActionConfig;
  drink_chip_3_double_tap_action?: ActionConfig;
  drink_chip_4?: string;
  drink_chip_4_label?: string;
  drink_chip_4_icon?: string;
  drink_chip_4_show_icon?: boolean;
  drink_chip_4_tap_action?: ActionConfig;
  drink_chip_4_hold_action?: ActionConfig;
  drink_chip_4_double_tap_action?: ActionConfig;

  // ── Button State Matrix — Daily (Take Pill button) ──
  // Each scheduled/lockout state maps to a Style option (ButtonStateStyle)
  // + an independent Icon Style option (IconStyle). The 'idle' state is
  // intentionally excluded — it has no color and is not user-configurable
  // (always falls back to the theme default). 'auto' resolves to the
  // per-state default at runtime. See plans/icon-style-dropdown-separation-
  // plan.md for the full state matrix + migration details.
  take_button_lockout_style?: ButtonStateStyle;        // default 'full'
  take_button_lockout_icon_style?: IconStyle;          // default 'none'
  take_button_execution_style?: ButtonStateStyle;      // default 'none'
  take_button_execution_icon_style?: IconStyle;        // default 'color'
  take_button_latency_style?: ButtonStateStyle;        // default 'border'
  take_button_latency_icon_style?: IconStyle;         // default 'color_pulse'
  /** Layout of the transient "Logged" (ACK) flash on the Take Pill button
   *  after a successful press. One of 'top' (default, mirrors button layout),
   *  'inline' (tick + text on one line), or 'big' (large check only). */
  take_button_ack_layout?: AckLayout;
  /** Duration of the transient "Logged" (ACK) flash on the Take Pill button,
   *  in milliseconds. Default 3000 (per the state matrix). */
  take_button_ack_duration_ms?: number;
  /** Speed of the rotating ring animation on the Take Pill button.
   *  'slow' (6s) / 'medium' (4s, default) / 'fast' (2.2s). Only affects the
   *  ring style option. */
  take_button_ring_speed?: RingSpeed;

  // ── Button State Matrix — Drinks (Log Drink button) ──
  // Drinks are PRN/as-needed with no schedule, so Execution Requested and
  // Latency Warning can never activate. Only Lockout + ACK are configurable
  // (user-confirmed — see plans/button-state-matrix-plan.md §1.2).
  drink_button_lockout_style?: ButtonStateStyle;   // default 'full'
  drink_button_lockout_icon_style?: IconStyle;     // default 'none'
  /** Layout of the transient "Logged" (ACK) flash on the Log Drink button.
   *  Mirrors take_button_ack_layout (default 'top'). */
  drink_button_ack_layout?: AckLayout;
  /** Duration of the transient "Logged" (ACK) flash on the Log Drink button,
   *  in milliseconds. Default 3000. */
  drink_button_ack_duration_ms?: number;
  /** Speed of the rotating ring animation on the Log Drink button.
    *  'slow' (6s) / 'medium' (4s, default) / 'fast' (2.2s). */
  drink_button_ring_speed?: RingSpeed;

  // ── Multi-User (M2M) — Multi-Tracker State Machine ──
  /** M2M multi-tracker binding: an array of 1..N **Drink Tracker device IDs**
   *  (the Caffeine Tracker / Alcohol Tracker virtual devices, whose single
   *  body-mass `DrinkMasterSensor` carries `drink_master: True`). All selected
   *  devices MUST share the same substance (Caffeine OR Alcohol — the card
   *  validates at load and renders an error placeholder if mixed).
   *
   *  When populated (≥1 entry), the card runs the multi-profile state machine:
   *  - `_activeTrackerIndex` selects the active profile whose sensors drive
   *    all panels (Graph, Stats, Drinks, Inventory, Tools).
   *  - A header profile switcher toggles the active profile when N>1.
   *  - The Log Drink popup one-tap-defaults to the active profile; a shared
   *    drink may still be logged for a different configured tracker via a
   *    profile sub-list restricted to this array (view scope = logging scope).
   *  - localStorage persists the last-used index per card config.
   *
   *  When empty/absent, the card falls back to `device_id` (single medicine /
   *  granular drink card — unchanged behavior). Zero-config single-substance
   *  households auto-discover all matching Drink Tracker devices;
   *  multi-substance households render a "please select" placeholder.
   *
   *  Configured via the "Drink Trackers" device multi-select below the
   *  Medicine Device selector in the visual editor. Lazy migration from the
   *  legacy `drink_master_entities` (entity IDs) and `drink_target_profile`
   *  (Profile Lock UUID) fields happens in _resolveTrackers() on first load.
   *  See plans/drink-tracker-selector-rename-plan.md. */
  drink_tracker_devices?: string[];

  // ── Multi-Medicine State Machine ──
  /** An array of 1..N **medicine device IDs** for the all-in-one medicine
   *  card. Unlike the drinks side there is NO substance constraint — any set
   *  of valid medicine devices is allowed (medicines are independent).
   *
   *  This is the ONLY medicine picker in the visual editor (the former single
   *  `device_id` picker was removed; legacy `device_id` configs are lazily
   *  migrated into this array in willUpdate via _migrateLegacyDeviceId()).
   *
   *  When populated (≥1 entry), the card runs the multi-medicine state
   *  machine:
   *  - `_activeMedicineIndex` selects the active medicine whose entity
   *    bundle drives all panels (Daily, Graphs, Stats, Tracking, Tools) —
   *    the same entity-swap seam the multi-tracker machine uses, so panels
   *    need zero internal change.
   *  - A header title switcher (`MedName ▾`) toggles the active medicine
   *    when N>1; N=1 renders the plain title (device info on tap).
   *  - localStorage persists the last-used index per card config.
   *
   *  When empty/absent (and no legacy `device_id` migration is pending), the
   *  card renders the "please select a device" placeholder.
   *
   *  Validation (error placeholder on failure): each selected device must be
   *  an ax_dose_logger device that is NOT a Drink Tracker (no
   *  `drink_master: True` entity on it — those belong in the Drink Tracker
   *  picker) and must resolve at least one entity (dead/removed device).
   *
   *  Configured via the "Medicines Picker" device multi-select at the top of
   *  the visual editor. See plans/medicine-multi-select-plan.md. */
  medicine_devices?: string[];

  /** @deprecated Legacy form of drink_tracker_devices holding entity IDs
   *  (the body-mass sensors) instead of device IDs. Kept only so setConfig can
   *  read it once and lazily migrate to drink_tracker_devices (resolved via
   *  hass.entities[id].device_id on first _resolveTrackers call, since
   *  setConfig runs before hass is available). Removed from persisted config
   *  immediately on setConfig so it doesn't linger in YAML. Do NOT add new
   *  reads of this field outside the migration path. */
  drink_master_entities?: string[];
}

/**
 * Visual style option for a single button-state color assignment.
 * Controls background, text color, border, rotating ring, and ambilight
 * glow — everything EXCEPT the icon (which is controlled by IconStyle).
 * 'auto' is a sentinel that resolves to the per-state default at runtime.
 * See plans/icon-style-dropdown-separation-plan.md + plans/
 * ambilight-glow-style-plan.md.
 */
export type ButtonStateStyle =
  | 'auto'      // Sentinel — resolve to per-state default at runtime
  | 'full'      // Full Button (background + text colored)
  | 'border'    // Border Only (inset box-shadow ring)
  | 'none'      // No Color (theme-tinted bg, no state color override)
  | 'ring'      // Rotating Ring (conic-gradient ring sweep)
  | 'glow';     // Ambilight Glow (GPU-composited diffused backlight + breathing)

/**
 * Icon visual treatment for a single button-state. Controls icon color
 * and icon pulse animation independently from the Style dropdown. Forms
 * a 2×2 matrix: color on/off × pulse on/off. 'auto' is a sentinel that
 * resolves to the per-state default at runtime. See plans/
 * icon-style-dropdown-separation-plan.md.
 */
export type IconStyle =
  | 'auto'         // Sentinel — resolve to per-state default at runtime
  | 'none'         // No icon color, no pulse
  | 'color'        // Icon colored, no pulse
  | 'color_pulse'  // Icon colored + pulse animation
  | 'pulse';       // No icon color, pulse animation only

/**
 * Layout of the transient "Logged" (ACK) flash overlay shown after a
 * successful button press. See plans/glow-speed-and-ack-style-plan.md §2.3.
 */
export type AckLayout =
  | 'top'     // Option 1 — Top tick mark and text (default; mirrors button layout)
  | 'inline'  // Option 2 — Tick mark and text inline (on one centered line)
  | 'big';    // Option 3 — Big tickmark only (no text)

/**
 * Speed of the rotating ring animation (renamed from GlowSpeed). Maps to a
 * CSS duration set via the --ring-duration var. See plans/
 * icon-style-dropdown-separation-plan.md.
 */
export type RingSpeed =
  | 'slow'    // 6s
  | 'medium'  // 4s
  | 'fast';   // 2.2s (default — the prior hardcoded value)

// Extends the official HomeAssistant type from custom-card-helpers with the
// two HA frontend extensions the card uses (entities + devices). These fields
// are added by the entity registry at runtime and are not part of the
// home-assistant-js-websocket protocol that custom-card-helpers' type is based on.
// All other fields (states, callService, callApi, language, config, etc.) are
// inherited from HomeAssistant — no need to re-declare them.
export interface AxDoseLoggerHass extends HomeAssistant {
  entities: Record<string, {
    device_id?: string;
    platform?: string;
    name?: string;
    config_entry_id?: string;
  }>;
  devices?: Record<string, { name?: string }>;
}

// ──────────────────────────────────────────────
// Entity / data model types
// ──────────────────────────────────────────────

export interface MetricEntity {
  entityId: string;
  label: string;
  metricKey: string;
}

export interface ResolvedEntities {
  medicationName: string;
  totalDoses?: string;
  lastDose?: string;
  pillsSafeToTake?: string;
  amountInBody?: string;
  nextDose?: string;
  avg7Days?: string;
  avg14Days?: string;
  avg30Days?: string;
  avgYearly?: string;
  adherence7Days?: string;
  adherence14Days?: string;
  adherence30Days?: string;
  adherence365Days?: string;
  daysSinceFirstDose?: string;
  steadyState?: string;
  strength?: string;
  overdue?: string;
  /** Binary sensor: on when 24h strength limit is/would be exceeded
   *  (medicine only, created when daily_limit > 0). Resolved via entity_id
   *  suffix `_24h_limit_exceeded`. Powers the `limit_24h` ButtonState. */
  limit24hExceeded?: string;
  /** Dose Status enum sensor (backend single source of truth for the button
   *  state machine). Resolved via entity_id suffix `_dose_status`. States:
   *  not_due / due / overdue / limit_reached / limit_24h / ok. When present
   *  and available, the card maps it directly to a ButtonState instead of
   *  re-deriving the state from 4 entities; the legacy derivation remains
   *  as a fail-open fallback for older backends. */
  doseStatus?: string;
  takeButton?: string;
  resetButton?: string;
  undoButton?: string;
  adherenceResetButton?: string;
  adherenceCoverButton?: string;
  skipButton?: string;
  /** Reset Averages button (medicine + granular drink + Master Tracker
   *  devices). Resolved via the backend `role: "averages_reset"` state
   *  attribute — the robust pattern shared with the cover/skip buttons. */
  averagesResetButton?: string;
  pillsLeft?: string;
  addRefill?: string;
  metrics: MetricEntity[];
  // ── Master Tracker (Caffeine/Alcohol) extra fields ──
  // Populated by the master-tracker branch of _computeEntities when the
  // selected device is a Master Tracker. Medicine + granular drink devices
  // leave these undefined so the Stats/Drinks panels' `if (e.x)` guards skip
  // the master-specific rows.
  /** 24h sum-of-strengths sensor (mg caffeine / g alcohol). Medicine
   *  devices populate this via the backend `role: "daily_amount"` state
   *  attribute (PillDailyAmountSensor); masters via the master role. */
  amountLast24h?: string;
  /** Daily-limit remaining sensor (daily_limit − amount_24h; negative =
   *  overage). Medicine + master; created by the backend only when a daily
   *  limit is configured. Resolved via the `role: "daily_remaining"` state
   *  attribute. */
  dailyRemaining?: string;
  /** Master only: TIMESTAMP sensor predicting when body-mass enters the
   *  sleep-safe None band (Estimated None Time). Resolved via the
   *  `role: "estimated_none_time"` state attribute. */
  estimatedNoneTime?: string;
  /** Master only: categorical next-lower disruption band sensor (state =
   *  band label; attrs minutes_until_next_band + next_band_at). Resolved
   *  via the `role: "next_band"` state attribute. */
  nextBand?: string;
  /** Categorical sleep-disruption sensor state (None/Low/Moderate/High). */
  sleepDisruption?: string;
  /** Timestamp sensor predicting when body-mass enters the Low band (Low - Timestamp). */
  estimatedLowTime?: string;
  /** DURATION (hours) countdown to the Low band (Low - Hours Until). */
  lowHoursUntil?: string;
  /** Days-left inventory-burn sensor (scheduled "Days left" or estimated
   *  "Est. days left"). `daysLeftEst` mirrors the backend `estimation`
   *  attribute so the Stats row picks the matching label. */
  daysLeft?: string;
  daysLeftEst?: boolean;
  /** Device classification: undefined (medicine) | 'drink_master' | 'drink'. */
  deviceType?: 'drink_master' | 'drink';
  /** Substance when deviceType is drink_master or drink: 'caffeine'|'alcohol'. */
  substance?: 'caffeine' | 'alcohol';
}

/**
 * One resolved Drink Tracker in the multi-tracker state machine (Phase 2).
 * Built by _resolveTrackers() from drink_tracker_devices (or auto-discovery).
 * The active tracker's `entities` drives ALL panels — the state machine swaps
 * the entity bundle ahead of the panels, so panels receive a normal
 * ResolvedEntities and need zero internal change. profileId/profileName/
 * substance are read from the Drink Tracker body-mass sensor's state
 * attributes (drink_master: True).
 */
export interface ResolvedTracker {
  /** The body-mass sensor entity_id (`drink_master: True`, no role) — the
   *  canonical Drink Tracker entity resolved from the selected device, whose
   *  device_id feeds _computeEntities(). */
  entityId: string;
  /** The device_id of this Drink Tracker device — passed to _computeEntities()
   *  and the source of the selector config (drink_tracker_devices entry). */
  deviceId: string;
  /** Immutable profile UUID (backend profile_id attribute). */
  profileId: string;
  /** Mutable display name (backend profile_name attribute). */
  profileName: string;
  /** Substance shared by all trackers in the array (validated single). */
  substance: 'caffeine' | 'alcohol';
  /** Resolved entity bundle for this tracker's device. */
  entities: ResolvedEntities;
}

/**
 * One resolved Medicine in the multi-medicine state machine. Built by
 * _resolveMedicines() from medicine_devices. The active medicine's `entities`
 * drives ALL panels — the state machine swaps the entity bundle ahead of the
 * panels (same seam as the multi-tracker machine), so panels receive a normal
 * ResolvedEntities and need zero internal change. `name` comes from the
 * device registry and labels the header switcher.
 */
export interface ResolvedMedicine {
  /** The device_id of this medicine device — passed to _computeEntities()
   *  and the source of the selector config (medicine_devices entry). */
  deviceId: string;
  /** Device registry display name (switcher label + title row). */
  name: string;
  /** Resolved entity bundle for this medicine's device. */
  entities: ResolvedEntities;
}

/**
 * One granular drink of a substance, as enumerated by
 * CardController.getDrinksOfSubstance() for the Master Tracker Drinks popup +
 * Inventory + Tools panels.  Each field is the entity_id of the granular
 * device's corresponding entity (or undefined if that entity is absent).
 */
export interface DrinkInfo {
  deviceId: string;
  name: string;
  substance: 'caffeine' | 'alcohol';
  logButtonEntityId?: string;
  undoButtonEntityId?: string;
  resetButtonEntityId?: string;
  stockEntityId?: string;
  addStockEntityId?: string;
  avg7EntityId?: string;
  avg365EntityId?: string;
  /** Per-granular-drink "Est. days left" sensor (DrinkDaysLeftSensor,
    *  role=days_left). Powers the Inventory panel's col-1 2nd line. */
  daysLeftEntityId?: string;
  /** M2M: list of profile UUIDs allowed to route PK from this drink.
   *  Read from the DrinkLogButton / DrinkTotalSensor `allowed_profiles`
   *  attribute. Undefined for backends predating M2M (treated as
   *  ["default"]). Length ≤ 1 = single/zero-profile (one-tap log); ≥ 2 =
   *  shared drink (profile picker). */
  allowedProfiles?: string[];
  /** The granular drink's config entry id (resolved from hass.entities).
   *  Required for the log_drink service call (entry_id field). */
  configEntryId?: string;
}

/**
 * Per-chip configuration surfaced to the panel render by
 * CardController.getChipEntities() / getDrinkChipEntities().  Mirrors the box
 * override pattern: entity + label + icon + 3 ui_action configs.  The panel
 * reads the configured overrides and passes them back to handleChipAction /
 * handleDrinkChipAction on click/hold/double-tap.
 */
export interface ChipConfig {
  entityId: string;
  label?: string;
  icon?: string;
  showIcon?: boolean;
  tapAction?: ActionConfig;
  holdAction?: ActionConfig;
  doubleTapAction?: ActionConfig;
}

export interface DayBucket {
  date: string;
  label: string;
  count: number;
}

// ──────────────────────────────────────────────
// CardController — the contract between the container and the panel components
// ──────────────────────────────────────────────
// A panel never mutates container state directly and never reads `hass`/`config`
// off the container's private fields. Instead it receives a CardController (the
// container itself, which `implements CardController`) and calls the methods
// declared here. This makes a missing method a TypeScript compile error rather
// than a silent runtime bug, which is the primary safety mechanism for the
// presentational/container split.

export interface CardController {
  // ── Accessors the panels read ──
  // hass/config are optional on the container (HA assigns them after the
  // element connects); the panels guard with `this.controller.hass?.…`.
  readonly hass?: AxDoseLoggerHass;
  readonly config?: AxDoseLoggerCardConfig;
  /** Current HA language code (e.g. 'en'), falling back to 'en'. */
  readonly lang: string;

  // ── Pane-local state the graphs panel reads ──
  /** Active amount-in-body line-graph timeframe id ('12h'|'24h'|'48h'|'7d'|'14d'|'30d'). */
  readonly activeTimeframe: string;
  /** Active bar-graph timeframe id ('14d'|'30d'|'60d'). */
  readonly activeBarTimeframe: string;
  /** Active carousel slide index (0=bar, 1=line when present). */
  readonly activeGraph: number;
  /** Decimated amount-in-body history points for the line graph. */
  readonly amountHistory: Array<{ timestamp: string; value: number }>;
  /** Dose history tuples from the custom REST endpoint. */
  readonly doseHistory: Array<[string, number]>;
  /** Active effectiveness-graph timeframe id ('14d'|'30d'|'60d'). */
  readonly activeEffectivenessTimeframe: string;
  /** Active effectiveness-graph view ('avg'|'individual'). */
  readonly activeEffectivenessView: 'avg' | 'individual';
  /** Per-metric effectiveness history, keyed by metricKey (from the HA recorder). */
  readonly effectivenessHistory: Record<string, Array<{ timestamp: string; value: number }>>;
  /** Set of metricKeys currently visible (toggled on) in the effectiveness graph. */
  readonly effectivenessVisible: Set<string>;

  // ── Read-only helpers (delegate to helpers.ts internally) ──
  getState(entityId?: string): string;
  getAttr(entityId?: string, attr?: string): any;
  getStrengthUnit(entities: ResolvedEntities): string;
  getMedName(entities: ResolvedEntities): string;
  getSafeBoxEntity(entities: ResolvedEntities): string | undefined;
  /** Resolve the entity to display in the Pills Left box: days-left toggle > swapped entity > default sensor. */
  getPillsLeftBoxEntity(entities: ResolvedEntities): string | undefined;
  /** Resolve the entity to display in the Drinks panel In Body box: swapped entity > default amountInBody sensor. */
  getInBodyBoxEntity(entities: ResolvedEntities): string | undefined;
  /** Resolve the entity to display in the Drinks panel Disruption box:
   *  disruption_mode (low_timestamp / low_hours_until) > swapped entity > default sleepDisruption sensor. */
  getDisruptionBoxEntity(entities: ResolvedEntities): string | undefined;
  /** Per-chip configuration surfaced to the panel render.  Mirrors the box
   *  override pattern: entity + label + icon + 3 ui_action configs. */
  getChipEntities(): ChipConfig[];
  /** Enumerate configured Drinks-panel custom chips (drink_chip_1..4 + labels). */
  getDrinkChipEntities(): ChipConfig[];
  formatInteger(value: string): string;
  computeNextDose(entities: ResolvedEntities): string;
  computeOverTime(entities: ResolvedEntities): string | null;
  computeTimeSinceLastDose(entities: ResolvedEntities): string;
  bucketByDay(dayCount?: number): DayBucket[];
  daysSinceReveal(entities: ResolvedEntities): { hasDaysSensor: boolean; daysSince: number };
  // ── Master Tracker (Drinks) helpers ──
  /**
   * Enumerate every granular drink device of a substance (caffeine/alcohol).
   * Iterates hass.entities filtering by `platform === 'ax_dose_logger'` +
   * `device_type === 'drink'` state attribute + matching `substance`, groups
   * by device_id, and returns one DrinkInfo per granular drink with its
   * log/undo/reset buttons, stock + add_stock numbers, and 7/365-day avg
   * sensors.  Used by the Drinks (Log Drink popup), Inventory, and Tools
   * panels of a Master Tracker card.
   */
  getDrinksOfSubstance(substance: 'caffeine' | 'alcohol'): DrinkInfo[];
  /**
   * M2M: enumerate all profiles (Drink Settings entries) as dropdown options
   * for the Profile Lock config field. Returns [{ value: uuid, label: name }]
   * by scanning hass.entities for drink_master: True and reading the
   * profile_id + profile_name attributes. Used by the visual editor so the
   * admin can pick which profile a card is locked to. Cached keyed by the
   * hass.entities reference (mirrors the drinks cache pattern).
   */
  getProfileOptions(): Array<{ value: string; label: string }>;
  /**
   * Days-since-first-dose reveal for a granular drink, mirroring
   * daysSinceReveal() but reading the `history_start_date` attribute on the
   * drink's 365-day avg sensor (DrinkAvgDosesSensor exposes it) instead of a
   * dedicated days_since_first_dose sensor.  Returns hasDaysSensor=false when
   * the attribute is absent so callers fall back to showing all boxes.
   */
  drinkDaysSinceReveal(avg365EntityId?: string): { hasDaysSensor: boolean; daysSince: number };
  /**
   * Open the refill dialog targeted at a specific granular drink's add_stock
   * number entity (Master Tracker Inventory panel).  The medicine
   * showRefillDialog() hardcodes the card's own addRefill entity; this
   * generalization accepts the target so the same dialog reuses across
   * medicine + drinks.
   */
  showRefillDialogFor(addStockEntityId: string, drinkName: string): void;
  /** Open the Log Drink popup for a substance (Master Tracker Drinks panel). */
  showLogDrinkDialog(substance: 'caffeine' | 'alcohol'): void;
  /** Open the substance-aware Sleep Disruption popup (Master Tracker Drinks panel). */
  showSleepDisruptionDialog(substance: 'caffeine' | 'alcohol'): void;
  /** Log a granular drink via the ax_dose_logger.log_drink service
   *  (Master Tracker Drinks popup). The optional targetProfile routes the
   *  PK payload to a specific profile's master (M2M). When omitted, the
   *  backend applies the single-profile convenience default or raises for
   *  shared drinks (the popup resolves the target before calling). */
  logDrink(logButtonEntityId: string, targetProfile?: string): void;
  /** Press a granular drink's Undo button (Master Tracker Tools panel). */
  undoDrink(undoButtonEntityId: string): void;
  /** Press a granular drink's Reset button (Master Tracker Tools panel). */
  resetDrink(resetButtonEntityId: string): void;

  // ── Actions the panels fire back to the container ──
  handleTakePill(entities: ResolvedEntities): void;
  handleUndoDose(entities: ResolvedEntities): void;
  /** Refill dialog Confirm handler — validates + calls number.set_value. */
  handleRefill(entities: ResolvedEntities): void;
  /** Open the refill dialog (sets _showRefillDialog + resets _refillAmount). */
  showRefillDialog(): void;
  /** Open the device-info dialog (sets _showDeviceInfo). */
  showDeviceInfo(): void;
  /** Open the device-info dialog targeted at a specific device (Inventory panel averages-box click). */
  showDeviceInfoFor(deviceId: string, name: string): void;
  /** Open the Medical Color Indicators explainer popup (ha-dialog +
   *  ha-markdown). Reached via a button in the device-info dialog when
   *  `show_color_indicator_explainer` is not false. */
  showColorExplainerDialog(): void;
  /** Open the shared tools confirmation dialog directly. */
  openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void;
  /** Run a Tools panel action. Respects the `confirm_tool_actions` config:
   *  when ON (default), opens the shared tools confirmation dialog first;
   *  when OFF, fires onConfirm immediately with no popup. */
  runToolAction(title: string, descriptor: string, onConfirm: () => void): void;
  /** Fire hass-more-info for an entity id. */
  openMoreInfo(entityId: string): void;
  /** Dispatch a Safe-to-Take box tap/hold/double-tap action (handleAction or more-info fallback). */
  handleSafeBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void;
  /** Dispatch a Pills-Left box tap/hold/double-tap action (handleAction, fallback, or more-info). */
  handlePillsLeftBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
    fallback?: () => void,
  ): void;
  /** Dispatch a Drinks-panel In Body box tap/hold/double-tap action (handleAction or more-info). */
  handleInBodyBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void;
  /** Dispatch a Drinks-panel Disruption box tap/hold/double-tap action (handleAction, fallback, or more-info). */
  handleDisruptionBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
    fallback?: () => void,
  ): void;
  /** Dispatch a Daily-panel custom chip tap/hold/double-tap action
   *  (handleAction or more-info fallback on the chip entity). */
  handleChipAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void;
  /** Dispatch a Drinks-panel custom chip tap/hold/double-tap action
   *  (handleAction or more-info fallback on the chip entity). */
  handleDrinkChipAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void;
  /** Line-graph timeframe chip click. */
  handleTimeframeChange(timeframe: string): void;
  /** Bar-graph timeframe chip click. */
  handleBarTimeframeChange(timeframe: string): void;
  /** Effectiveness-graph timeframe chip click. */
  handleEffectivenessTimeframeChange(timeframe: string): void;
  /** Effectiveness-graph Avg/Individual view toggle. */
  setEffectivenessView(view: 'avg' | 'individual'): void;
  /** Effectiveness-graph per-tracker visibility toggle. */
  toggleEffectivenessMetric(metricKey: string): void;
  /** Carousel prev/next — sets the active graph index. */
  setActiveGraph(idx: number): void;
  /** Tracking slider change — direct set or override dialog depending on logged_today. */
  handleTrackingChange(metric: MetricEntity, rawValue: string): void;
  /** Keyboard activation helper for accessible clickable divs (Enter / Space). */
  onKeyActivate(e: KeyboardEvent, handler: () => void): void;
  /** Keyboard activation for stat cells (Enter / Space → more-info). */
  onStatCellKeydown(e: KeyboardEvent, entityId: string): void;
  /** Navigate to the HA device config page. */
  navigateToDevice(): void;
}