import { LitElement, html, svg, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import type { LovelaceCard, ActionConfig } from 'custom-card-helpers';
import { fireEvent, formatTime, formatDateTime, handleAction } from 'custom-card-helpers';
import { localize } from './localize.js';
import {
  formatInteger as formatIntegerHelper,
  toLocalDateKey as toLocalDateKeyHelper,
  bridgeGaps as bridgeGapsHelper,
  getColorOverrides as getColorOverridesHelper,
  getState as getStateHelper,
  getAttr as getAttrHelper,
} from './helpers.js';
import { buildEditorForm, installEditorGridAlignment } from './ax-dose-logger-editor.js';
// Panel components are statically imported so Rollup bundles them into the
// single dist/ax-dose-logger-card.js output (HACS downloads exactly one file).
import './components/stats-panel.js';
import './components/tools-panel.js';
import './components/tracking-panel.js';
import './components/daily-panel.js';
import './components/graphs-panel.js';
import './components/caffeine-panel.js';
import type {
  AxDoseLoggerCardConfig,
  AxDoseLoggerHass,
  CardController,
  ResolvedEntities,
  MetricEntity,
  DayBucket,
} from './types.js';

// Re-export the types that downstream code (the editor module, panel components)
// imports from the container's module surface. They are authored in src/types.ts
// to avoid circular imports between the container and the panels.
export type {
  AxDoseLoggerCardConfig,
  AxDoseLoggerHass,
  CardController,
  ResolvedEntities,
  MetricEntity,
  DayBucket,
} from './types.js';

// ──────────────────────────────────────────────
// AxDoseLoggerCard — Main Card Class (Container)
// ──────────────────────────────────────────────

export class AxDoseLoggerCard extends LitElement implements LovelaceCard, CardController {
  @property({ attribute: false }) hass?: AxDoseLoggerHass;
  @property({ attribute: false }) config?: AxDoseLoggerCardConfig;

  @state() private _activePane: 'daily' | 'graphs' | 'stats' | 'caffeine' | 'tools' | 'tracking' = 'daily';
  @state() private _activeGraph: number = 0;
  @state() private _amountHistory: Array<{timestamp: string; value: number}> = [];
  @state() private _doseHistory: Array<[string, number]> = [];
  @state() private _showDeviceInfo: boolean = false;
  @state() private _showRefillDialog: boolean = false;
  @state() private _refillAmount: string = '';
  @state() private _activeTimeframe: string = '48h';
  @state() private _activeBarTimeframe: string = '14d';
  // Effectiveness-graph state. Mirrors the bar/line graph pattern but keyed
  // separately so the three carousel slides don't clobber each other's chips.
  // _effectivenessHistory is keyed by metricKey; _effectivenessVisible is the
  // set of metricKeys currently toggled on (defaults to all metrics). The view
  // toggle ('avg' | 'individual') only matters when metrics.length > 1; the
  // panel hides it for single-metric devices.
  @state() private _activeEffectivenessTimeframe: string = '14d';
  @state() private _activeEffectivenessView: 'avg' | 'individual' = 'avg';
  @state() private _effectivenessHistory: Record<string, Array<{ timestamp: string; value: number }>> = {};
  @state() private _effectivenessVisible: Set<string> = new Set();
  @state() private _toolsDialog: { title: string; descriptor: string; onConfirm: () => void } | null = null;
  // Pill-limit override warning dialog (#6): replaces the synchronous native
  // confirm() box. When non-null, _renderOverrideDialog() shows an ha-dialog
  // asking the user to confirm taking a pill past the safe limit. The body text
  // and time source branch by tracking type: scheduled meds show the next
  // designated dose time (next_dose sensor); As Needed meds show when the
  // rolling safety window resets (window_expires_at attribute).
  @state() private _overrideDialog: {
    timeLabel: string;
    bodyKey: 'dialog.override.body_scheduled' | 'dialog.override.body_as_needed';
    entities: ResolvedEntities;
  } | null = null;
  // Tracking override warning dialog: when user tries to change a daily-locked
  // tracking value that has already been set today, this dialog asks for confirmation.
  @state() private _trackingOverrideDialog: { metricKey: string; metricLabel: string; oldValue: number; newValue: number; entityId: string } | null = null;
  // Tracks entity IDs that have been set but whose HA state hasn't propagated yet.
  // Prevents the override-dialog race condition: without this, a second drag before
  // the first set_value completes would read stale logged_today=false and bypass
  // the override dialog. Cleared in updated() once HA confirms logged_today=true.
  private _pendingTracking: Set<string> = new Set();

  // ── Render-performance optimization ─────────
  // _tick: bumped every 30s by a timer so time-relative panes (daily/stats)
  // refresh their "Xh XXm" countdowns without re-rendering on every system-wide
  // state change. Previously the whole card re-rendered on every HA state tick;
  // with shouldUpdate gating, this timer is what keeps the countdowns live.
  @state() private _tick: number = 0;
  private _tickTimer: number | null = null;

  // Entity-resolution cache (#5): _resolveEntities() previously did an O(n) scan
  // of every HA entity on every render. Cache the result and only re-resolve when
  // the configured device_id changes or the hass.entities registry reference
  // changes (HA replaces this object when the entity registry is updated).
  private _resolvedEntities: ResolvedEntities | null = null;
  private _resolvedDeviceId: string = '';
  private _resolvedEntitiesRef: object | null = null;

  // In-flight fetch management (#3 + #4):
  //  - Separate per-fetch-type tokens prevent cross-stream invalidation. When
  //    both _fetchAmountHistory and _fetchDoseHistory fire on pane entry, a
  //    shared token caused the second call's ++ to invalidate the first call's
  //    result. Each fetch now captures its own token; after `await`, if the
  //    token no longer matches, the result is discarded. disconnectedCallback
  //    bumps both tokens to invalidate all in-flight fetches on disconnect.
  private _amountFetchToken: number = 0;
  private _doseFetchToken: number = 0;
  private _effectivenessFetchToken: number = 0;

  // ── Configuration ──────────────────────────

  setConfig(config: AxDoseLoggerCardConfig) {
    // Backward compat: convert legacy chips[] array to flat chip_N fields
    const raw = config as any;
    if (Array.isArray(raw.chips)) {
      const chips: string[] = raw.chips;
      const mapped: Record<string, string> = {};
      chips.forEach((c: string, i: number) => {
        if (c) mapped[`chip_${i + 1}`] = c;
      });
      const { chips: _chips, ...rest } = raw;
      config = { ...rest, ...mapped };
    }
    // HA contract: throw on invalid config so HA renders an error card with
    // the message. We check for null/undefined (key missing in YAML) but NOT
    // empty string — getStubConfig() returns { device_id: '' } when the card
    // is first added in the visual editor, and that stub case should render
    // the friendly "Please select a device" placeholder in render(), not an
    // error card.
    if (config.device_id == null) {
      throw new Error(localize('en', 'setconfig.error.device_required'));
    }
    const prevDeviceId = this.config?.device_id;
    // Store the raw user config without baking in defaults (#18). All read
    // sites already use the `!== false` pattern (treating undefined as true),
    // so the defaults were redundant — and baking them in polluted persisted
    // YAML and masked future default changes. Now the stored config contains
    // only what the user explicitly set.
    this.config = config;
    // If the device changed, the cached entity map is stale — drop it so the
    // next _resolveEntities() call re-scans for the new device's entities.
    if (prevDeviceId !== this.config.device_id) {
      this._invalidateEntityCache();
    }
  }

  // ── Entity Resolution ──────────────────────

  /**
   * Returns the resolved entity map for the configured device, using a cache
   * so the O(n) scan of hass.entities only runs when the device_id or the
   * entity registry reference actually changes (HA replaces the `entities`
   * object when the registry is updated). Callers that need a fresh scan
   * (e.g. after a config change) should call _invalidateEntityCache() first.
   */
  private _resolveEntities(): ResolvedEntities {
    if (!this.hass || !this.config) {
      return { medicationName: 'Medication', metrics: [] };
    }
    const deviceId = this.config.device_id;
    const entitiesRef = this.hass.entities;
    if (
      this._resolvedEntities &&
      this._resolvedDeviceId === deviceId &&
      this._resolvedEntitiesRef === entitiesRef
    ) {
      return this._resolvedEntities;
    }
    const result = this._computeEntities(deviceId);
    this._resolvedEntities = result;
    this._resolvedDeviceId = deviceId;
    this._resolvedEntitiesRef = entitiesRef;
    return result;
  }

  /** Force the next _resolveEntities() call to re-scan. */
  private _invalidateEntityCache(): void {
    this._resolvedEntities = null;
    this._resolvedEntitiesRef = null;
  }

  private _computeEntities(deviceId: string): ResolvedEntities {
    const result: ResolvedEntities = { medicationName: 'Medication', metrics: [] };
    if (!this.hass) return result;

    // Extract medication name from device registry
    if (this.hass.devices?.[deviceId]?.name) {
      result.medicationName = this.hass.devices[deviceId].name!;
    }

    // Iterate all entities to find those belonging to this device
    for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
      if (entityInfo.device_id !== deviceId) continue;

      // Fallback: extract medication name from first matching entity
      if (result.medicationName === 'Medication' && entityInfo.name) {
        result.medicationName = entityInfo.name;
      }

      // Categorize by domain and suffix
      if (entityId.startsWith('sensor.')) {
        if (entityId.endsWith('_total_doses')) result.totalDoses = entityId;
        else if (entityId.endsWith('_last_dose')) result.lastDose = entityId;
        else if (entityId.endsWith('_pills_safe_to_take')) result.pillsSafeToTake = entityId;
        else if (entityId.endsWith('_amount_in_body')) result.amountInBody = entityId;
        else if (entityId.endsWith('_next_dose')) result.nextDose = entityId;
        else if (entityId.endsWith('_overdue')) result.overdue = entityId;
        else if (entityId.endsWith('_avg_daily_doses_7_days')) result.avg7Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_14_days')) result.avg14Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_30_days')) result.avg30Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;
        else if (entityId.endsWith('_adherence_7_days')) result.adherence7Days = entityId;
        else if (entityId.endsWith('_adherence_14_days')) result.adherence14Days = entityId;
        else if (entityId.endsWith('_adherence_30_days')) result.adherence30Days = entityId;
        else if (entityId.endsWith('_adherence_365_days')) result.adherence365Days = entityId;
        else if (entityId.endsWith('_days_since_first_dose')) result.daysSinceFirstDose = entityId;
        else if (entityId.endsWith('_days_to_steady_state')) result.steadyState = entityId;
        else if (entityId.endsWith('_strength')) result.strength = entityId;
      } else if (entityId.startsWith('button.')) {
        if (entityId.endsWith('_take')) result.takeButton = entityId;
        else if (entityId.endsWith('_reset_history')) result.resetButton = entityId;
        else if (entityId.endsWith('_undo_dose')) result.undoButton = entityId;
        else if (entityId.endsWith('_reset_adherence')) result.adherenceResetButton = entityId;
        else if (entityId.endsWith('_cover_last_missed')) result.adherenceCoverButton = entityId;
      } else if (entityId.startsWith('number.')) {
        if (entityId.endsWith('_pills_left')) result.pillsLeft = entityId;
        else if (entityId.endsWith('_add_refill')) result.addRefill = entityId;
        else if (entityId.endsWith('_effectiveness')) {
          // Effectiveness tracking slider — collect for the Tracking pane
          // Entity ID pattern: number.{device}_{metric_slug}_effectiveness
          // metric_label is the clean metric name (e.g. "Pain") exposed by the backend
          // — friendly_name includes the device prefix (e.g. "Ibuprofen Pain Effectiveness")
          const metricLabel = this._getAttr(entityId, 'metric_label') as string | undefined;
          const label = metricLabel || entityInfo.name?.replace(/\s+Effectiveness$/i, '') || entityId;
          const metricKey = this._getAttr(entityId, 'metric_key') || '';
          result.metrics.push({ entityId, label, metricKey });
        }
      }
    }

    return result;
  }

  // ── Chip Helpers ───────────────────────────

  private _getChipEntities(): Array<{ entityId: string; label?: string }> {
    if (!this.config) return [];
    const chips: Array<{ entityId: string; label?: string }> = [];
    for (const key of ['chip_1', 'chip_2', 'chip_3', 'chip_4'] as const) {
      const val = this.config[key];
      if (val) {
        const labelKey = `${key}_label` as keyof AxDoseLoggerCardConfig;
        chips.push({ entityId: val, label: this.config[labelKey] as string | undefined });
      }
    }
    return chips;
  }

  // ── State Helpers ──────────────────────────

  private _getState(entityId?: string): string {
    return getStateHelper(this.hass, entityId);
  }

  private _getAttr(entityId?: string, attr?: string): any {
    return getAttrHelper(this.hass, entityId, attr);
  }

  private _getStrengthUnit(entities: ResolvedEntities): string {
    const unit = this._getAttr(entities.strength, 'strength_unit');
    return (typeof unit === 'string' && unit) ? unit : 'mg';
  }

  private _formatInteger(value: string): string {
    return formatIntegerHelper(value);
  }

  // ── Color Scheme ───────────────────────────

  private _getColorOverrides(): string {
    return getColorOverridesHelper(this.config?.color_scheme);
  }

  // ── Dose History ───────────────────────────

  private _toLocalDateKey(d: Date): string {
    return toLocalDateKeyHelper(d);
  }

  private _bucketByDay(dayCount: number = 14): DayBucket[] {
    const buckets: Record<string, number> = {};

    // Count doses per day from custom API data
    // Each entry is [iso_timestamp, strength]
    // Use local timezone for date bucketing (NOT .toISOString() which shifts to UTC)
    for (const entry of this._doseHistory) {
      const key = this._toLocalDateKey(new Date(entry[0]));
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const result: DayBucket[] = [];
    const now = new Date();
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = this._toLocalDateKey(d);
      result.push({
        date: key,
        label: d.getDate().toString(),
        count: buckets[key] || 0,
      });
    }
    return result;
  }

  // ── Computed Values ────────────────────────

  private _computeNextDose(entities: ResolvedEntities): string {
    const state = this._getState(entities.nextDose);
    if (state === 'unavailable' || state === 'unknown') return 'Unavailable';

    try {
      const next = new Date(state);
      const now = new Date();
      if (isNaN(next.getTime()) || next <= now) return 'now';

      const diffMs = Math.max(0, next.getTime() - now.getTime());
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[ax-dose-logger-card] _computeNextDose failed:', e);
      return 'Unavailable';
    }
  }

  /**
   * For scheduled medications, returns how long the user is PAST their
   * scheduled next-dose time, formatted as "Xh XXm". Returns null when:
   *   - tracking_type is "As Needed" (no preset schedule)
   *   - next_dose is unavailable/unknown
   *   - next_dose is still in the future (not yet overdue)
   */
  private _computeOverTime(entities: ResolvedEntities): string | null {
    const trackingType = this._getAttr(entities.nextDose, 'tracking_type');
    if (trackingType === 'As Needed') return null;

    const state = this._getState(entities.overdue);
    if (state === 'unavailable' || state === 'unknown' || !state) return null;

    const seconds = parseFloat(state);
    if (isNaN(seconds) || seconds <= 0) return null;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Compute a human-readable label for when the pill-limit rolling window
   * resets (i.e. when safe_to_take will increment). Reads the
   * `window_expires_at` attribute exposed by the Pills Safe to Take sensor.
   * Falls back to the next_dose sensor for back-compat with older backends
   * that don't expose window_expires_at.
   */
  private _computeWindowExpiry(entities: ResolvedEntities): string {
    const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
    if (expiresAt && typeof expiresAt === 'string') {
      try {
        const exp = new Date(expiresAt);
        const now = new Date();
        if (!isNaN(exp.getTime()) && exp > now) {
          const diffMs = exp.getTime() - now.getTime();
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          if (hours > 0) return `${hours}h ${minutes}m`;
          return `${minutes}m`;
        }
      } catch (e) {
        console.warn('[ax-dose-logger-card] _computeWindowExpiry failed:', e);
        // fall through to next_dose fallback
      }
    }
    return this._computeNextDose(entities);
  }

  /**
   * Format an absolute Date as a locale-aware clock time for the override
   * dialog. Same-day times use formatTime (e.g. "2:30 PM"); cross-day times
   * (next dose is tomorrow+) use formatDateTime so the date is visible.
   * Falls back to toLocaleTimeString() if hass.locale is unavailable.
   */
  private _formatOverrideTime(date: Date): string {
    if (!this.hass?.locale) return date.toLocaleTimeString();
    const now = new Date();
    const sameDay = date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
    return sameDay
      ? formatTime(date, this.hass.locale)
      : formatDateTime(date, this.hass.locale);
  }

  private _computeTimeSinceLastDose(entities: ResolvedEntities): string {
    const state = this._getState(entities.lastDose);
    if (state === 'unavailable' || state === 'unknown' || state === 'None' || !state) {
      return 'Never';
    }

    try {
      const last = new Date(state);
      const now = new Date();
      if (isNaN(last.getTime())) return 'Never';

      const diffMs = Math.max(0, now.getTime() - last.getTime());
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[ax-dose-logger-card] _computeTimeSinceLastDose failed:', e);
      return 'Never';
    }
  }

  // ── Computed Values: Timeframe ─────────────

  private _getTimeframeHours(): number {
    switch (this._activeTimeframe) {
      case '12h': return 12;
      case '24h': return 24;
      case '7d': return 168;
      case '14d': return 336;
      case '30d': return 720;
      default: return 48;
    }
  }

  // ── Actions ────────────────────────────────

  private _handleTakePill(entities: ResolvedEntities) {
    if (!this.hass || !entities.takeButton) return;

    const safeState = this._getState(entities.pillsSafeToTake);
    const safeCount = parseInt(safeState, 10);

    if (!isNaN(safeCount) && safeCount <= 0) {
      // Pill limit reached: show the HA-native override confirmation dialog
      // instead of the synchronous browser confirm() box (#6). The actual
      // button.press call happens in the dialog's Confirm handler.
      //
      // Body text + time source branch by tracking type:
      //   - Scheduled (regular_interval / time_of_day / cyclic): show the next
      //     designated dose time from the next_dose sensor.
      //   - As Needed (PRN): show when the rolling safety window resets via the
      //     window_expires_at attribute on the pills_safe_to_take sensor.
      // tracking_type is normalized defensively (snake_case "as_needed" and
      // legacy title-case "As Needed") since the backend stores snake_case
      // (const.py) but older deployments may expose title-case.
      const tt = (this._getAttr(entities.nextDose, 'tracking_type') || '').toLowerCase();
      const isAsNeeded = tt === 'as_needed' || tt === 'as needed';

      let timeLabel: string;
      let bodyKey: 'dialog.override.body_scheduled' | 'dialog.override.body_as_needed';

      if (isAsNeeded) {
        const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
        const expDate = expiresAt ? new Date(expiresAt as string) : null;
        if (expDate && !isNaN(expDate.getTime())) {
          timeLabel = this._formatOverrideTime(expDate);
          bodyKey = 'dialog.override.body_as_needed';
        } else {
          // Fallback: backend without window_expires_at — show relative duration.
          timeLabel = this._computeWindowExpiry(entities);
          bodyKey = 'dialog.override.body_as_needed';
        }
      } else {
        const nextDoseState = this._getState(entities.nextDose);
        const nextDate = (nextDoseState && nextDoseState !== 'unavailable' && nextDoseState !== 'unknown')
          ? new Date(nextDoseState) : null;
        if (nextDate && !isNaN(nextDate.getTime()) && nextDate > new Date()) {
          timeLabel = this._formatOverrideTime(nextDate);
          bodyKey = 'dialog.override.body_scheduled';
        } else {
          // Fallback: next_dose unavailable or already past — relative duration.
          timeLabel = this._computeWindowExpiry(entities);
          bodyKey = 'dialog.override.body_scheduled';
        }
      }

      this._overrideDialog = { timeLabel, bodyKey, entities };
      return;
    }

    this.hass.callService('button', 'press', {
      entity_id: entities.takeButton,
    });
  }

  private _handleUndoDose(entities: ResolvedEntities) {
    if (!this.hass || !entities.undoButton) return;
    this.hass.callService('button', 'press', {
      entity_id: entities.undoButton,
    });
  }

  private _handleRefill(entities: ResolvedEntities) {
    if (!this.hass || !entities.addRefill) return;
    const value = parseFloat(this._refillAmount);
    if (isNaN(value) || value <= 0) return;
    this.hass.callService('number', 'set_value', {
      entity_id: entities.addRefill,
      value: value,
    });
    this._showRefillDialog = false;
    this._refillAmount = '';
  }

  // ── Tools Actions ──────────────────────────

  private _openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void {
    this._toolsDialog = { title, descriptor, onConfirm };
  }

  private _closeToolsDialog(): void {
    this._toolsDialog = null;
  }

  private _handleTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeTimeframe) return;
    this._activeTimeframe = timeframe;
  }

  // Convenience getter for the current HA language code (BCP47). Falls back
  // to 'en' when hass is not yet set (e.g. during initial render).
  private get _lang(): string {
    return this.hass?.language || 'en';
  }

  // ── CardController public accessors ─────────
  // Public read-only views of the container's private @state, exposed to the
  // presentational panel components via the CardController contract (see
  // src/types.ts). Panels read these props instead of touching the container's
  // private fields directly.
  public get lang(): string {
    return this._lang;
  }
  public get activeTimeframe(): string {
    return this._activeTimeframe;
  }
  public get activeBarTimeframe(): string {
    return this._activeBarTimeframe;
  }
  public get activeGraph(): number {
    return this._activeGraph;
  }
  public get amountHistory(): Array<{ timestamp: string; value: number }> {
    return this._amountHistory;
  }
  public get doseHistory(): Array<[string, number]> {
    return this._doseHistory;
  }
  public get activeEffectivenessTimeframe(): string {
    return this._activeEffectivenessTimeframe;
  }
  public get activeEffectivenessView(): 'avg' | 'individual' {
    return this._activeEffectivenessView;
  }
  public get effectivenessHistory(): Record<string, Array<{ timestamp: string; value: number }>> {
    return this._effectivenessHistory;
  }
  public get effectivenessVisible(): Set<string> {
    return this._effectivenessVisible;
  }

  // ── CardController thin action methods ───────
  // These were previously inlined as direct @state mutations inside pane
  // templates (e.g. @click=${() => this._showRefillDialog = true}). Now that
  // panes are presentational components, they call back through the controller
  // so the container owns the state mutation.
  public showRefillDialog(): void {
    this._showRefillDialog = true;
    this._refillAmount = '';
  }
  public showDeviceInfo(): void {
    this._showDeviceInfo = true;
  }
  public setActiveGraph(idx: number): void {
    this._activeGraph = idx;
  }

  // Keyboard activation helper for clickable <div> elements that use
  // role="button". Fires the handler on Enter or Space (standard button
  // behavior) so they're accessible to keyboard and screen-reader users.
  private _onKeyActivate(e: KeyboardEvent, handler: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  }

  // ── CardController public method aliases ────
  // The container keeps its private _-prefixed methods as the implementation
  // (the existing ~49 internal call sites stay untouched, keeping this step
  // low-risk). These public aliases expose them through the CardController
  // contract so the presentational panel components (added in later steps)
  // can call back into the container without touching its private surface.
  // Each alias is a one-line delegate; behavior is unchanged.
  public getState(entityId?: string): string { return this._getState(entityId); }
  public getAttr(entityId?: string, attr?: string): any { return this._getAttr(entityId, attr); }
  public getStrengthUnit(entities: ResolvedEntities): string { return this._getStrengthUnit(entities); }
  public getMedName(entities: ResolvedEntities): string { return this._getMedName(entities); }
  public getSafeBoxEntity(entities: ResolvedEntities): string | undefined { return this._getSafeBoxEntity(entities); }
  public getChipEntities(): Array<{ entityId: string; label?: string }> { return this._getChipEntities(); }
  public formatInteger(value: string): string { return this._formatInteger(value); }
  public computeNextDose(entities: ResolvedEntities): string { return this._computeNextDose(entities); }
  public computeOverTime(entities: ResolvedEntities): string | null { return this._computeOverTime(entities); }
  public computeTimeSinceLastDose(entities: ResolvedEntities): string { return this._computeTimeSinceLastDose(entities); }
  public bucketByDay(dayCount?: number): DayBucket[] { return this._bucketByDay(dayCount); }
  public daysSinceReveal(entities: ResolvedEntities): { hasDaysSensor: boolean; daysSince: number } { return this._daysSinceReveal(entities); }
  public handleTakePill(entities: ResolvedEntities): void { this._handleTakePill(entities); }
  public handleUndoDose(entities: ResolvedEntities): void { this._handleUndoDose(entities); }
  public handleRefill(entities: ResolvedEntities): void { this._handleRefill(entities); }
  public openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void { this._openToolsDialog(title, descriptor, onConfirm); }
  public openMoreInfo(entityId: string): void { this._openMoreInfo(entityId); }
  public handleSafeBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void { this._handleSafeBoxAction(e as MouseEvent | null, kind, cfg, entity); }
  public handleTimeframeChange(timeframe: string): void { this._handleTimeframeChange(timeframe); }
  public handleBarTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeBarTimeframe) return;
    this._activeBarTimeframe = timeframe;
  }
  public handleEffectivenessTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeEffectivenessTimeframe) return;
    this._activeEffectivenessTimeframe = timeframe;
  }
  public setEffectivenessView(view: 'avg' | 'individual'): void {
    if (view === this._activeEffectivenessView) return;
    this._activeEffectivenessView = view;
  }
  public toggleEffectivenessMetric(metricKey: string): void {
    // Mutate a fresh Set so Lit detects the reference change (a Set mutation
    // in place would not trigger re-render since @state compares references).
    const next = new Set(this._effectivenessVisible);
    if (next.has(metricKey)) next.delete(metricKey);
    else next.add(metricKey);
    this._effectivenessVisible = next;
  }
  public handleTrackingChange(metric: MetricEntity, rawValue: string): void { this._handleTrackingChange(metric, rawValue); }
  public onKeyActivate(e: KeyboardEvent, handler: () => void): void { this._onKeyActivate(e, handler); }
  public onStatCellKeydown(e: KeyboardEvent, entityId: string): void { this._onStatCellKeydown(e, entityId); }
  public navigateToDevice(): void { this._navigateToDevice(); }

  // ── Pane Switching ─────────────────────────

  private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats' | 'caffeine' | 'tools' | 'tracking'): void {
    if (paneId === this._activePane) return; // Guard: skip redundant execution
    this._activePane = paneId;
    // Tell HA's layout engine to re-measure the card height. card-resize is
    // non-destructive (unlike ll-rebuild, which tears down and recreates the
    // element) — the @state pane survives, so no sessionStorage persistence
    // or rebuild-flag coordination is needed (#16). Lit auto-renders on the
    // @state mutation above, so no manual requestUpdate() is needed (#17).
    this.updateComplete.then(() => {
      this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true, composed: true }));
    });
  }

  // ── Device Info Dialog ─────────────────────

  private _navigateToDevice() {
    if (!this.config?.device_id) return;
    window.history.pushState(null, '', `/config/devices/device/${this.config.device_id}`);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  private _renderDeviceInfoDialog(entities: ResolvedEntities) {
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._showDeviceInfo = false; }}
      >
        <div slot="header" class="dialog-header">${this._getMedName(entities)}</div>
        <div class="dialog-body dialog-body--center">
          <button class="dialog-btn" @click=${() => { this._navigateToDevice(); this._showDeviceInfo = false; }}>
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${localize(this._lang, 'dialog.device_info.button')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
  }

  private _renderRefillDialog(entities: ResolvedEntities) {
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._showRefillDialog = false; this._refillAmount = ''; }}
      >
        <div slot="header" class="dialog-header">${localize(this._lang, 'dialog.refill.title')}</div>
        <div class="dialog-body">
          <input
            type="number"
            class="refill-input"
            .value=${this._refillAmount}
            @input=${(e: InputEvent) => this._refillAmount = (e.target as HTMLInputElement).value}
            placeholder=${localize(this._lang, 'dialog.refill.placeholder')}
            min="1"
            step="1"
          />
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._showRefillDialog = false; this._refillAmount = ''; }}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => this._handleRefill(entities)}>
            ${localize(this._lang, 'dialog.refill.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // Pill-limit override warning dialog (#6). Rendered when _overrideDialog is
  // non-null (set by _handleTakePill when the safe-to-take count is <= 0).
  // Confirm presses the take-button; Cancel/ESC just closes.
  private _renderOverrideDialog() {
    const dlg = this._overrideDialog;
    if (!dlg) return nothing;
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._overrideDialog = null; }}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, dlg.bodyKey, { time: dlg.timeLabel })}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._overrideDialog = null; }}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => {
                    if (this.hass && dlg.entities.takeButton) {
                      this.hass.callService('button', 'press', {
                        entity_id: dlg.entities.takeButton,
                      });
                    }
                    this._overrideDialog = null;
                  }}>
            ${localize(this._lang, 'dialog.override.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // ── Pane 1: Daily ──────────────────────────

  private _getMedName(entities: ResolvedEntities): string {
    let name = this.config?.name || entities.medicationName;
    const strengthState = this._getState(entities.strength);
    const strengthNum = parseFloat(strengthState);
    if (entities.strength && !isNaN(strengthNum) && strengthNum !== 0
        && strengthState !== 'unknown' && strengthState !== 'unavailable') {
      name += ` - ${this._formatInteger(strengthState)} ${this._getStrengthUnit(entities)}`;
    }
    return name;
  }

  // Resolve the entity to display in the Safe to Take box. If the user
  // configured a replacement (safe_to_take_entity), use it; otherwise fall
  // back to the auto-resolved pills_safe_to_take sensor. The Take Pill
  // button's LIMIT REACHED logic is decoupled and always uses the real
  // pillsSafeToTake sensor (see isLimitReached below).
  private _getSafeBoxEntity(entities: ResolvedEntities): string | undefined {
    return this.config?.safe_to_take_entity || entities.pillsSafeToTake;
  }

  // Fire the configured tap/hold/double-tap action for the Safe to Take box.
  // When the requested action has a user-configured ActionConfig, delegate to
  // custom-card-helpers' handleAction (standard HA action dispatch). When no
  // tap_action is configured, fall back to more-info on the display entity
  // (v1 default behavior). hold/double_tap with no config are no-ops.
  private _handleSafeBoxAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    displayEntity: string | undefined,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && displayEntity) {
      // No custom tap action → default to more-info (backward compat).
      this._openMoreInfo(displayEntity);
    }
    // hold/double_tap with no config and no fallback → no-op.
  }

  // ── Pane 2: Graphs ─────────────────────────

  private async _fetchAmountHistory(entities: ResolvedEntities) {
    if (!this.hass || !entities.amountInBody) return;

    const entityId = entities.amountInBody;
    const now = new Date();
    const startTime = new Date(now.getTime() - this._getTimeframeHours() * 60 * 60 * 1000).toISOString();
    const endTime = now.toISOString();

    // Race guard (#4): capture the token at entry; after `await`, discard the
    // result if a newer fetch (or disconnect) has bumped it. This ensures only
    // the latest timeframe/pane change's result is written to _amountHistory.
    const token = ++this._amountFetchToken;

    try {
      // Use HA's authenticated REST helper (#2) instead of raw fetch + manual
      // access-token extraction. Path is relative to /api/. minimal_response +
      // significant_changes_only (#19) shrink the payload by dropping attributes
      // and unchanged states the card never reads from history.
      const data = await this.hass.callApi(
        'GET',
        `history/period/${startTime}?filter_entity_id=${entityId}&end_time=${endTime}&minimal_response&significant_changes_only=1`
      );

      // Discard if a newer fetch started or the card was disconnected mid-flight.
      if (token !== this._amountFetchToken) return;

      // data is an array of arrays: [[{entity_id, state, last_changed, attributes}, ...]]
      if (data && data[0]) {
        const filteredData = data[0]
          .filter((entry: any) => entry.state && !isNaN(parseFloat(entry.state)))
          .map((entry: any) => ({
            timestamp: entry.last_changed,
            value: parseFloat(entry.state)
          }));

        // Decimation: cap SVG nodes at MAX_NODES to protect render performance
        const MAX_NODES = 800;
        const step = Math.ceil(filteredData.length / MAX_NODES);
        this._amountHistory = step > 1
          ? filteredData.filter((_: any, index: number) => index % step === 0)
          : filteredData;
      }
    } catch (e) {
      // callApi throws on non-2xx; log for debuggability without breaking UX.
      console.warn('[ax-dose-logger-card] amount history fetch failed:', e);
    }
  }

  private async _fetchDoseHistory(entities: ResolvedEntities) {
    if (!this.hass || !this.config?.device_id) return;

    const deviceId = this.config.device_id;
    // Same race guard as _fetchAmountHistory (both are triggered together on
    // pane entry; a new pane/timeframe change invalidates both via the token).
    const token = ++this._doseFetchToken;

    try {
      const data = await this.hass.callApi('GET', `ax_dose_logger/history/${deviceId}`);

      // Discard if a newer fetch started or the card was disconnected mid-flight.
      if (token !== this._doseFetchToken) return;

      // data is [[iso_timestamp, strength], ...]
      if (Array.isArray(data)) {
        this._doseHistory = data;
      }
    } catch (e) {
      // Custom endpoint may not be available on older backends; log for debug.
      console.warn('[ax-dose-logger-card] dose history fetch failed:', e);
    }
  }

  // Effectiveness history fetch — batched single call for ALL effectiveness
  // entities of the device (comma-separated filter_entity_id), split per
  // entity on the client. Effectiveness entities are daily-locked number
  // entities (state changes only when the user logs a value), so the recorder
  // is the source of multi-day history. unknown/unavailable states are
  // dropped so the graph renders gaps on unlogged days instead of zeros.
  // Mirrors _fetchAmountHistory's race-guard token + minimal_response +
  // significant_changes_only optimizations, but covers N entities per call.
  private async _fetchEffectivenessHistory(entities: ResolvedEntities) {
    if (!this.hass || !entities.metrics.length) return;

    const entityIds = entities.metrics.map((m) => m.entityId).join(',');
    const now = new Date();
    const days = this._activeEffectivenessTimeframe === '30d' ? 30
      : this._activeEffectivenessTimeframe === '60d' ? 60 : 14;
    const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    const endTime = now.toISOString();

    const token = ++this._effectivenessFetchToken;

    try {
      const data = await this.hass.callApi(
        'GET',
        `history/period/${startTime}?filter_entity_id=${entityIds}&end_time=${endTime}&minimal_response&significant_changes_only=1`,
      );

      if (token !== this._effectivenessFetchToken) return;

      // data is an array of arrays, one per requested entity (order matches
      // filter_entity_id order). Map each entity's history to its metricKey.
      const result: Record<string, Array<{ timestamp: string; value: number }>> = {};
      if (Array.isArray(data)) {
        entities.metrics.forEach((metric, idx) => {
          const series = data[idx];
          if (!Array.isArray(series)) return;
          result[metric.metricKey] = series
            .filter((entry: any) => entry.state && !isNaN(parseFloat(entry.state)))
            .map((entry: any) => ({
              timestamp: entry.last_changed,
              value: parseFloat(entry.state),
            }));
        });
      }
      this._effectivenessHistory = result;

      // Initialize the visible set to all metrics on first fetch (or when the
      // metric set changed since last fetch, e.g. a custom metric was added
      // in the options flow). We compare against the existing visible set so
      // a user's per-tracker toggles survive timeframe changes.
      const allKeys = entities.metrics.map((m) => m.metricKey);
      const knownKeys = allKeys.filter((k) => this._effectivenessVisible.has(k));
      if (knownKeys.length !== allKeys.length || knownKeys.length === 0) {
        this._effectivenessVisible = new Set(allKeys);
      }
    } catch (e) {
      console.warn('[ax-dose-logger-card] effectiveness history fetch failed:', e);
    }
  }

  // Shared progressive-reveal resolver for avg/adherence boxes and stats rows.
  // Days since first dose drives which windows are shown. When the entity is
  // absent (older backend), hasDaysSensor=false and daysSince=-1 so callers
  // fall back to showing all boxes/rows (no regression for existing installs).
  private _daysSinceReveal(entities: ResolvedEntities): { hasDaysSensor: boolean; daysSince: number } {
    const daysSinceRaw = this._getState(entities.daysSinceFirstDose);
    const hasDaysSensor = !!entities.daysSinceFirstDose && daysSinceRaw !== 'unavailable';
    const daysSince = hasDaysSensor ? (parseInt(daysSinceRaw) || 0) : -1;
    return { hasDaysSensor, daysSince };
  }

  // ── Pane 3: Stats ──────────────────────────

  // Open the native HA more-info dialog for an entity. Uses the canonical
  // `hass-more-info` event (same pattern as every stock Lovelace card via
  // custom-card-helpers' handleAction). fireEvent defaults to bubbles+composed,
  // which is what HA's more-info dialog listener expects.
  private _openMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  // Keyboard activation for accessible stat cells (Enter / Space).
  private _onStatCellKeydown(e: KeyboardEvent, entityId: string): void {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this._openMoreInfo(entityId);
    }
  }

  // ── Pane 4: Tools ──────────────────────────

  private _renderToolsDialog() {
    const dialog = this._toolsDialog;
    if (!dialog) return nothing;

    const onConfirm = () => {
      dialog.onConfirm();
      this._closeToolsDialog();
    };

    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => this._closeToolsDialog()}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">${dialog.descriptor}</div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${() => this._closeToolsDialog()}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${localize(this._lang, 'dialog.cancel')}</span>
          </button>
          <button class="dialog-btn" @click=${onConfirm}>
            <ha-icon icon="mdi:check"></ha-icon>
            <span>${localize(this._lang, 'dialog.confirm')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
  }


  // ── Pane 5: Metrics ──────────────────────────

  private _handleTrackingChange(metric: MetricEntity, rawValue: string): void {
    const newValue = parseFloat(rawValue);
    if (isNaN(newValue)) return;

    const state = this._getState(metric.entityId);
    const attrs = this._getAttr(metric.entityId, 'logged_today');
    const isLogged = attrs === true || attrs === 'True' || attrs === 'true'
      || this._pendingTracking.has(metric.entityId);

    if (isLogged) {
      // Already logged today (or pending) — show override dialog
      const oldValue = parseFloat(state);
      this._trackingOverrideDialog = {
        metricKey: metric.metricKey,
        metricLabel: metric.label,
        oldValue: isNaN(oldValue) ? 0 : oldValue,
        newValue,
        entityId: metric.entityId,
      };
    } else {
      // Not yet logged — set directly via the number entity
      // Track locally to prevent race condition before HA state propagates
      this._pendingTracking.add(metric.entityId);
      if (this.hass) {
        this.hass.callService('number', 'set_value', {
          entity_id: metric.entityId,
          value: newValue,
        });
      }
    }
  }

  private _renderTrackingOverrideDialog() {
    const dlg = this._trackingOverrideDialog;
    if (!dlg) return nothing;

    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._trackingOverrideDialog = null; }}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'tracking.already_set_title')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, 'tracking.already_set_body', {
              metric: localize(this._lang, 'tracking.today_label', { metric: dlg.metricLabel }),
              oldValue: String(dlg.oldValue),
              newValue: String(dlg.newValue),
            })}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._trackingOverrideDialog = null; }}>
            ${localize(this._lang, 'tracking.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${() => {
                    if (this.hass) {
                      this.hass.callService('ax_dose_logger', 'set_metric', {
                        entity_id: dlg.entityId,
                        value: dlg.newValue,
                        override: true,
                      });
                    }
                    this._trackingOverrideDialog = null;
                  }}>
            ${localize(this._lang, 'tracking.override')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // ── Pane Selector ──────────────────────────

  private _renderPaneSelector(entities: ResolvedEntities) {
    const hasMetrics = entities.metrics.length > 0;
    // Caffeine pane is gated on a `device_type` state attribute (value
    // "caffeine") emitted by the device's primary sensor. The backend does
    // not yet emit this attribute for any device, so the pane stays hidden
    // everywhere until a real caffeine device is configured. Mirrors the
    // existing hasMetrics/tracking conditional-spread pattern. The lookup
    // is defensive (lower-cased, nil-coalesced) since the backend will
    // eventually emit snake_case values.
    const deviceType = (this._getAttr(entities.nextDose, 'device_type') || '').toLowerCase();
    const hasCaffeine = deviceType === 'caffeine';
    const panes: Array<{ id: 'daily' | 'graphs' | 'stats' | 'caffeine' | 'tools' | 'tracking'; labelKey: string; icon: string }> = [
      { id: 'daily', labelKey: 'pane.daily', icon: 'mdi:pill' },
      { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
      { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
      ...(hasCaffeine ? [{ id: 'caffeine' as const, labelKey: 'pane.caffeine', icon: 'mdi:coffee' }] : []),
      ...(hasMetrics ? [{ id: 'tracking' as const, labelKey: 'pane.tracking', icon: 'mdi:chart-sankey' }] : []),
      { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
    ];

    return html`
      <div class="pane-selector">
        ${panes.map(pane => {
          const label = localize(this._lang, pane.labelKey);
          const isTools = pane.id === 'tools';
          return html`
            <button
              class="pane-btn ${this._activePane === pane.id ? 'active' : ''} ${isTools ? 'tools' : ''}"
              aria-label=${label}
              @click=${() => this._handlePaneChange(pane.id)}
            >
              <ha-icon icon="${pane.icon}"></ha-icon>
              ${isTools ? nothing : html`<span>${label}</span>`}
            </button>
          `;
        })}
      </div>
    `;
  }

  // ── Main Render ────────────────────────────

  render() {
    if (!this.config || !this.hass) {
      return html`<ha-card><div class="card-content">${localize('en', 'card.loading')}</div></ha-card>`;
    }

    // Graceful fallback when the card is first added and no device is selected
    if (!this.config.device_id) {
      return html`
        <ha-card>
          <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
            <ha-icon icon="mdi:cog" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
            <div style="font-size: 16px; font-weight: 500; color: var(--primary-text-color);">${localize(this._lang, 'card.placeholder_title')}</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">${localize(this._lang, 'card.placeholder_subtitle')}</div>
          </div>
        </ha-card>
      `;
    }

    const entities = this._resolveEntities();

    // Auto-fallback: if the user is on the tracking pane but no tracking items exist
    // (e.g. they were removed in the options flow), fall back to the daily pane.
    if (this._activePane === 'tracking' && entities.metrics.length === 0) {
      this._activePane = 'daily';
    }

    // Auto-fallback: if the user is on the caffeine pane but the device is not
    // a caffeine device (e.g. the device_type attribute was removed or the
    // device was switched), fall back to the daily pane. Mirrors the tracking
    // fallback above. The backend does not yet emit device_type, so any
    // lingering _activePane === 'caffeine' (e.g. from a dev session) is
    // bounced here.
    if (this._activePane === 'caffeine' &&
        (this._getAttr(entities.nextDose, 'device_type') || '').toLowerCase() !== 'caffeine') {
      this._activePane = 'daily';
    }

    return html`
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'};">
        <div class="card-content">
          ${this._activePane === 'daily' ? html`<ax-dose-daily-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-daily-panel>` : nothing}
          ${this._activePane === 'graphs' ? html`<ax-dose-graphs-panel .controller=${this} .entities=${entities} .hass=${this.hass} .amountHistory=${this._amountHistory} .doseHistory=${this._doseHistory} .activeGraph=${this._activeGraph} .activeTimeframe=${this._activeTimeframe} .activeBarTimeframe=${this._activeBarTimeframe} .activeEffectivenessTimeframe=${this._activeEffectivenessTimeframe} .activeEffectivenessView=${this._activeEffectivenessView} .effectivenessHistory=${this._effectivenessHistory} .effectivenessVisible=${this._effectivenessVisible}></ax-dose-graphs-panel>` : nothing}
          ${this._activePane === 'stats' ? html`<ax-dose-stats-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-stats-panel>` : nothing}
          ${this._activePane === 'caffeine' ? html`<ax-dose-caffeine-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-caffeine-panel>` : nothing}
          ${this._activePane === 'tools' ? html`<ax-dose-tools-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tools-panel>` : nothing}
          ${this._activePane === 'tracking' ? html`<ax-dose-tracking-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tracking-panel>` : nothing}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector(entities) : nothing}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : nothing}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : nothing}
        ${this._toolsDialog ? this._renderToolsDialog() : nothing}
        ${this._overrideDialog ? this._renderOverrideDialog() : nothing}
        ${this._trackingOverrideDialog ? this._renderTrackingOverrideDialog() : nothing}
      </ha-card>
    `;
  }

  // ── Lifecycle ──────────────────────────────

  connectedCallback(): void {
    super.connectedCallback();
    // Inject CSS into ha-form shadow roots to align entity picker + text field
    // pairs in grid containers. The implementation lives in the editor module
    // (src/ax-dose-logger-editor.ts) since this is editor-only logic.
    installEditorGridAlignment();
    // Reset to defaults on every connection. With ll-rebuild removed (#16),
    // the element is no longer destroyed/recreated on pane switch, so @state
    // survives naturally. The only time connectedCallback fires is on a
    // genuine view entry (navigate to the dashboard) or initial load — both
    // should start on the daily pane. Lit auto-renders on the @state
    // mutations below, so no manual requestUpdate() is needed (#17).
    this._activePane = 'daily';
    this._activeGraph = 0;
    // Apply configured default timescale for the Amount in Body graph,
    // falling back to '48h' if unset or invalid. Useful for medications
    // (e.g. caffeine, paracetamol) where a shorter window is more informative.
    const validTimeframes = ['12h', '24h', '48h', '7d', '14d', '30d'];
    const configuredTf = this.config?.amount_in_body_default_timeframe;
    this._activeTimeframe = (configuredTf && validTimeframes.includes(configuredTf)) ? configuredTf : '48h';
    this._activeBarTimeframe = '14d';
    this._activeEffectivenessTimeframe = '14d';
    this._activeEffectivenessView = 'avg';
    this._effectivenessHistory = {};
    this._effectivenessVisible = new Set();

    // Clear any dialog that was open when the card was disconnected. Lit
    // pauses reactive updates while an element is detached, so a dialog
    // flag set to false just before navigation may not have flushed its
    // DOM removal before disconnect — leaving ha-dialog's MDC overlay in
    // an "open" state that re-appears on back-navigation. Resetting here
    // guarantees a clean slate on every view entry and covers all four
    // dialogs (device-info, refill, tools, override).
    this._showDeviceInfo = false;
    this._showRefillDialog = false;
    this._refillAmount = '';
    this._toolsDialog = null;
    this._overrideDialog = null;

    // Start a 30s tick so time-relative panes (daily/stats) refresh their
    // "Xh XXm" countdowns. Previously the whole card re-rendered on every
    // system-wide state change; with shouldUpdate gating, this timer keeps
    // the countdowns live without that cost.
    this._startTickTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopTickTimer();
    // Invalidate any in-flight fetch so it can't write state to a detached
    // element. Bumping the token makes every pending _fetchAmountHistory /
    // _fetchDoseHistory result discard itself after its `await` resolves.
    this._amountFetchToken++;
    this._doseFetchToken++;
    this._effectivenessFetchToken++;
  }

  private _startTickTimer(): void {
    if (this._tickTimer !== null) return;
    this._tickTimer = window.setInterval(() => {
      this._tick += 1;
    }, 30000);
  }

  private _stopTickTimer(): void {
    if (this._tickTimer !== null) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  /**
   * Render gating (#1): only re-render when something this card actually
   * depends on changed, instead of on every system-wide HA state tick.
   *
   * - config / internal @state changes always re-render.
   * - _tick re-renders so the daily & stats panes' "Xh XXm" countdowns stay
   *   live (the underlying timestamp sensors don't change every minute).
   * - hass changes only re-render when one of this card's resolved entities
   *   (or a configured chip entity) has a new state object reference.
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config || !this.hass) {
      return changedProps.has('config') || changedProps.has('hass');
    }
    // Any internal reactive state change (pane, timeframe, dialogs, history,
    // graph index) always triggers a render.
    for (const key of [
      'config',
      '_activePane',
      '_activeGraph',
      '_activeTimeframe',
      '_activeBarTimeframe',
      '_amountHistory',
      '_doseHistory',
      '_activeEffectivenessTimeframe',
      '_activeEffectivenessView',
      '_effectivenessHistory',
      '_effectivenessVisible',
      '_showDeviceInfo',
      '_showRefillDialog',
      '_refillAmount',
      '_toolsDialog',
      '_overrideDialog',
      '_trackingOverrideDialog',
    ] as const) {
      if (changedProps.has(key)) return true;
    }

    // The 30s tick refreshes time-relative panes (daily/stats). The graphs and
    // tools panes don't depend on wall-clock time, so skip the tick there to
    // avoid needless SVG re-renders.
    if (changedProps.has('_tick') && (this._activePane === 'daily' || this._activePane === 'stats')) {
      return true;
    }

    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as AxDoseLoggerHass | undefined;
      return this._relevantStateChanged(oldHass);
    }
    return false;
  }

  /**
   * Compare the current hass state for every entity this card reads (resolved
   * medication entities + configured chip entities) against the previous hass
   * snapshot. Returns true if any of them changed (by state object reference,
   * which HA replaces on every state update).
   */
  private _relevantStateChanged(oldHass: AxDoseLoggerHass | undefined): boolean {
    if (!this.hass) return false;
    if (!oldHass) return true;
    const entities = this._resolveEntities();
    const watchedIds: string[] = [];
    for (const value of Object.values(entities)) {
      if (typeof value === 'string' && value) watchedIds.push(value);
    }
    // Include configured chip entities (they may belong to other devices).
    for (const chip of this._getChipEntities()) {
      if (chip.entityId) watchedIds.push(chip.entityId);
    }
    const cur = this.hass.states;
    const prev = oldHass.states;
    for (const id of watchedIds) {
      const curState = cur[id];
      const prevState = prev[id];
      // A state object reference change means HA updated this entity.
      if (curState !== prevState) return true;
      // Also catch the entity disappearing/appearing between snapshots.
      if ((curState === undefined) !== (prevState === undefined)) return true;
    }
    return false;
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (this._activePane === 'graphs' && this.config && this.hass) {
      const entities = this._resolveEntities();
      if (changedProperties.has('_activePane')) {
        this._fetchAmountHistory(entities);
        this._fetchDoseHistory(entities);
        if (entities.metrics.length) {
          this._effectivenessHistory = {};
          this._fetchEffectivenessHistory(entities);
        }
      } else if (changedProperties.has('_activeTimeframe')) {
        this._amountHistory = [];
        this._fetchAmountHistory(entities);
      } else if (changedProperties.has('_activeEffectivenessTimeframe')) {
        if (entities.metrics.length) {
          this._effectivenessHistory = {};
          this._fetchEffectivenessHistory(entities);
        }
      }
    }
    // Clean up _pendingTracking: once HA confirms logged_today=true for an
    // entity, remove it from the pending set so future changes use the real
    // attribute instead of the optimistic local flag.
    if (this.hass && this._pendingTracking.size > 0) {
      for (const entityId of this._pendingTracking) {
        const isLogged = this._getAttr(entityId, 'logged_today') === true;
        if (isLogged) this._pendingTracking.delete(entityId);
      }
    }
  }

  // ── Sizing ─────────────────────────────────

  getCardSize(): number {
    // Dynamic sizing based on active pane to prevent overlap
    switch (this._activePane) {
      case 'graphs': return 8;
      case 'stats': return 7;
      case 'tools': return 6;
      case 'tracking': return 6;
      case 'caffeine': return 6;
      default: return 5; // daily
    }
  }

  getGridOptions() {
    // HA sections-view grid options. Per HA docs, omitting `rows` lets the
    // card ignore grid row snapping (auto-height) — the documented way to
    // achieve what the previous undocumented `rows: 'auto'` attempted.
    // `min_rows: 4` ensures a reasonable minimum height (≈248px, matching
    // the smallest pane — daily at getCardSize() = 5 ≈ 250px). Static
    // options (not dynamic per-pane) avoid grid layout shifts on pane switch.
    return {
      columns: 12,
      min_rows: 4,
    };
  }

  // ── Editor Linkage ─────────────────────────

  static getConfigForm() {
    // The ~280-line schema + computeLabel/computeHelper callbacks live in the
    // editor module (src/ax-dose-logger-editor.ts) so the main card file stays
    // focused on runtime dashboard logic. HA renders <ha-form> from this schema.
    return buildEditorForm();
  }

  static getStubConfig() {
    return {
      device_id: '',
      show_amount_in_body: true,
    };
  }

  // ── Styles ─────────────────────────────────

  static styles = css`
    :host {
      display: block;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .card-content {
      padding: 10px 16px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1 1 auto;
    }

    /* ── Pane Selector ─────────────────────── */

    .pane-selector {
      display: flex;
      border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1));
    }

    .pane-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      border: none;
      background: none;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: color 0.2s, background 0.2s, box-shadow 0.2s;
      border-bottom: 2px solid transparent;
    }

    .pane-btn.tools {
      flex: 0 0 auto;
      min-width: 44px;
      padding: 12px;
    }

    .pane-btn:hover {
      color: var(--primary-text-color, #222);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
    }

    .pane-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: 500;
    }

    .pane-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* ── Pane 3: Stats ──────────────────────── */

    /* ── Dialog content (ha-dialog provides scrim/surface/heading) ─── */

    .dialog-body {
      padding: 8px 0;
    }

    .dialog-body--center {
      display: flex;
      justify-content: center;
    }

    /* Dialog header (slot="header" for HA 2026.3+ Material 3 compatibility).
       Pre-2026.3 used the .heading property / slot="heading"; HA 2026.3
       renamed the slot to "header". Using the slot element works on both. */
    .dialog-header {
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--primary-text-color, #222);
      text-align: center;
    }

    .dialog-header--warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--error-color, #db4437);
    }

    .dialog-header--warning ha-icon {
      --mdc-icon-size: 28px;
    }

    .dialog-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
      font-size: 16px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dialog-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .dialog-btn ha-icon {
      --mdc-icon-size: 24px;
    }

    /* ── Refill Dialog ──────────────────────── */

    .refill-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      border-radius: var(--ha-card-border-radius, 12px);
      font-size: 18px;
      font-family: inherit;
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .refill-input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .dialog-btn--muted {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      color: var(--secondary-text-color, #666);
    }

    .dialog-btn--muted:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .tools-dialog-descriptor {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      text-align: center;
    }

    /* Custom flexbox action bar replacing ha-dialog-footer. HA's native
       <ha-dialog-footer> forces right-aligned primaryAction/secondaryAction
       slots with hard-coded asymmetrical Shadow DOM padding that can't be
       cleanly overridden. This standard DOM flexbox centers the buttons as a
       pair, matching the card's original dialog layout. */
    .custom-action-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 20px;
      width: 100%;
    }
  `;
}

// ──────────────────────────────────────────────
// Registrations
// ──────────────────────────────────────────────

customElements.define('ax-dose-logger-card', AxDoseLoggerCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'ax-dose-logger-card',
  name: 'AX Dose Logger Card',
  preview: true,
  description: 'A custom card for the AX Dose Logger integration — track medications, view dose graphs, and monitor statistics.',
  documentationURL: 'https://github.com/Axildor/AX-Dose-Logger-Card',
});