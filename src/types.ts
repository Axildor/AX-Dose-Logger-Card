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
  device_id?: string;
  name?: string;
  color_scheme?: string;
  chip_1?: string;
  chip_1_label?: string;
  chip_2?: string;
  chip_2_label?: string;
  chip_3?: string;
  chip_3_label?: string;
  chip_4?: string;
  chip_4_label?: string;
  show_amount_in_body?: boolean;
  amount_in_body_default_timeframe?: string;
  show_day_avg_boxes?: boolean;
  show_adherence_boxes?: boolean;
  stats_3_columns?: boolean;
  big_text?: boolean;
  hide_nav_bar?: boolean;
  take_pill_icon?: string;
  take_pill_label?: string;
  safe_to_take_entity?: string;
  safe_to_take_label?: string;
  safe_to_take_icon?: string;
  safe_to_take_tap_action?: ActionConfig;
  safe_to_take_hold_action?: ActionConfig;
  safe_to_take_double_tap_action?: ActionConfig;
  pills_left_label?: string;
  pills_left_icon?: string;
}

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
  takeButton?: string;
  resetButton?: string;
  undoButton?: string;
  adherenceResetButton?: string;
  adherenceCoverButton?: string;
  pillsLeft?: string;
  addRefill?: string;
  metrics: MetricEntity[];
  // ── Master Tracker (Caffeine/Alcohol) extra fields ──
  // Populated by the master-tracker branch of _computeEntities when the
  // selected device is a Master Tracker. Medicine + granular drink devices
  // leave these undefined so the Stats/Drinks panels' `if (e.x)` guards skip
  // the master-specific rows.
  /** 24h sum-of-strengths sensor (mg caffeine / g alcohol). */
  amountLast24h?: string;
  /** Categorical sleep-disruption sensor state (None/Low/Moderate/High). */
  sleepDisruption?: string;
  /** Timestamp sensor predicting when body-mass enters the Low band. */
  estimatedLowTime?: string;
  /** Device classification: undefined (medicine) | 'drink_master' | 'drink'. */
  deviceType?: 'drink_master' | 'drink';
  /** Substance when deviceType is drink_master or drink: 'caffeine'|'alcohol'. */
  substance?: 'caffeine' | 'alcohol';
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
  getChipEntities(): Array<{ entityId: string; label?: string }>;
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
  /** Press a granular drink's Log Drink button (Master Tracker Drinks popup). */
  logDrink(logButtonEntityId: string): void;
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
  /** Open the shared tools confirmation dialog. */
  openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void;
  /** Fire hass-more-info for an entity id. */
  openMoreInfo(entityId: string): void;
  /** Dispatch a Safe-to-Take box tap/hold/double-tap action (handleAction or more-info fallback). */
  handleSafeBoxAction(
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