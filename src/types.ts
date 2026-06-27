// ──────────────────────────────────────────────
// Shared types for the AX Dose Logger Card
// ──────────────────────────────────────────────
// Central location for interfaces used by both the container (AxDoseLoggerCard)
// and the presentational panel components. Kept in a standalone module to avoid
// circular imports: panels import types + helpers, the container imports types +
// panels, neither imports the other's runtime code except through the static
// editor-module and component imports owned by the container.

import type { HomeAssistant, LovelaceCardConfig, ActionConfig } from 'custom-card-helpers';

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