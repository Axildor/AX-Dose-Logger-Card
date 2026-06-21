import { LitElement, html, svg, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import type { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';
import { localize } from './localize.js';

// ──────────────────────────────────────────────
// Interfaces
// ──────────────────────────────────────────────

interface PillLoggerCardConfig extends LovelaceCardConfig {
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
  show_day_avg_boxes?: boolean;
  show_adherence_boxes?: boolean;
  stats_3_columns?: boolean;
  big_text?: boolean;
  hide_nav_bar?: boolean;
}

// Extends the official HomeAssistant type from custom-card-helpers with the
// two HA frontend extensions the card uses (entities + devices). These fields
// are added by the entity registry at runtime and are not part of the
// home-assistant-js-websocket protocol that custom-card-helpers' type is based on.
// All other fields (states, callService, callApi, language, config, etc.) are
// inherited from HomeAssistant — no need to re-declare them.
interface PillLoggerHass extends HomeAssistant {
  entities: Record<string, {
    device_id?: string;
    platform?: string;
    name?: string;
  }>;
  devices?: Record<string, { name?: string }>;
}

interface ResolvedEntities {
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
  takeButton?: string;
  resetButton?: string;
  undoButton?: string;
  adherenceResetButton?: string;
  adherenceCoverButton?: string;
  pillsLeft?: string;
  addRefill?: string;
}

interface DayBucket {
  date: string;
  label: string;
  count: number;
}

// ──────────────────────────────────────────────
// PillLoggerCard — Main Card Class
// ──────────────────────────────────────────────

export class PillLoggerCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) hass?: PillLoggerHass;
  @property({ attribute: false }) config?: PillLoggerCardConfig;

  @state() private _activePane: 'daily' | 'graphs' | 'stats' | 'tools' = 'daily';
  @state() private _activeGraph: number = 0;
  @state() private _amountHistory: Array<{timestamp: string; value: number}> = [];
  @state() private _doseHistory: Array<[string, number]> = [];
  @state() private _showDeviceInfo: boolean = false;
  @state() private _showRefillDialog: boolean = false;
  @state() private _refillAmount: string = '';
  @state() private _activeTimeframe: string = '48h';
  @state() private _activeBarTimeframe: string = '14d';
  @state() private _toolsDialog: { title: string; descriptor: string; onConfirm: () => void } | null = null;
  // Pill-limit override warning dialog (#6): replaces the synchronous native
  // confirm() box. When non-null, _renderOverrideDialog() shows an ha-dialog
  // asking the user to confirm taking a pill past the safe limit.
  @state() private _overrideDialog: { windowExpiry: string; entities: ResolvedEntities } | null = null;

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

  // ── Configuration ──────────────────────────

  setConfig(config: PillLoggerCardConfig) {
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
      return { medicationName: 'Medication' };
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
    const result: ResolvedEntities = { medicationName: 'Medication' };
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
        else if (entityId.endsWith('_avg_daily_doses_7_days')) result.avg7Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_14_days')) result.avg14Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_30_days')) result.avg30Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;
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
        const labelKey = `${key}_label` as keyof PillLoggerCardConfig;
        chips.push({ entityId: val, label: this.config[labelKey] as string | undefined });
      }
    }
    return chips;
  }

  // ── State Helpers ──────────────────────────

  private _getState(entityId?: string): string {
    if (!entityId || !this.hass) return 'unavailable';
    const state = this.hass.states[entityId];
    return state ? state.state : 'unavailable';
  }

  private _getAttr(entityId?: string, attr?: string): any {
    if (!entityId || !attr || !this.hass) return undefined;
    const state = this.hass.states[entityId];
    return state?.attributes?.[attr];
  }

  private _getStrengthUnit(entities: ResolvedEntities): string {
    const unit = this._getAttr(entities.strength, 'strength_unit');
    return (typeof unit === 'string' && unit) ? unit : 'mg';
  }

  private _formatInteger(value: string): string {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return Math.round(num).toString();
  }

  // ── Color Scheme ───────────────────────────

  private _getColorOverrides(): string {
    const schemes: Record<string, { primary: string; rgb: string }> = {
      default: { primary: '', rgb: '' },
      blue:    { primary: '#03a9f4', rgb: '3, 169, 244' },
      red:     { primary: '#e53935', rgb: '229, 57, 53' },
      green:   { primary: '#43a047', rgb: '67, 160, 71' },
      yellow:  { primary: '#fdd835', rgb: '253, 216, 53' },
      orange:  { primary: '#fb8c00', rgb: '251, 140, 0' },
      purple:  { primary: '#7e57c2', rgb: '126, 87, 194' },
      pink:    { primary: '#d81b60', rgb: '216, 27, 96' },
      teal:    { primary: '#00897b', rgb: '0, 137, 123' },
      brown:   { primary: '#795548', rgb: '121, 85, 72' },
      coral:   { primary: '#ff7043', rgb: '255, 112, 67' },
      slate:   { primary: '#546e7a', rgb: '84, 110, 122' },
      gold:    { primary: '#daa520', rgb: '218, 165, 32' },
      grey:    { primary: '#9e9e9e', rgb: '158, 158, 158' },
    };
    const scheme = this.config?.color_scheme || 'default';
    const colors = schemes[scheme];
    if (!colors || !colors.primary) return '';
    return `--primary-color: ${colors.primary}; --rgb-primary-color: ${colors.rgb};`;
  }

  // ── Dose History ───────────────────────────

  private _toLocalDateKey(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _getBarTimeframeDays(): number {
    switch (this._activeBarTimeframe) {
      case '30d': return 30;
      case '60d': return 60;
      default: return 14;
    }
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

      const diffMs = next.getTime() - now.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[pill-logger-card] _computeNextDose failed:', e);
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

    const state = this._getState(entities.nextDose);
    if (state === 'unavailable' || state === 'unknown' || !state) return null;

    try {
      const next = new Date(state);
      const now = new Date();
      if (isNaN(next.getTime())) return null;
      if (next > now) return null; // not overdue yet

      const diffMs = now.getTime() - next.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[pill-logger-card] _computeOverTime failed:', e);
      return null;
    }
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
        console.warn('[pill-logger-card] _computeWindowExpiry failed:', e);
        // fall through to next_dose fallback
      }
    }
    return this._computeNextDose(entities);
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

      const diffMs = now.getTime() - last.getTime();
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[pill-logger-card] _computeTimeSinceLastDose failed:', e);
      return 'Never';
    }
  }

  // ── Computed Values: Timeframe ─────────────

  private _getTimeframeHours(): number {
    switch (this._activeTimeframe) {
      case '12h': return 12;
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
      this._overrideDialog = {
        windowExpiry: this._computeWindowExpiry(entities),
        entities,
      };
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

  private _handleAdherenceReset(entities: ResolvedEntities) {
    if (!this.hass || !entities.adherenceResetButton) return;
    this._openToolsDialog(
      localize(this._lang, 'tools.reset_adherence'),
      localize(this._lang, 'tools.desc.reset_adherence'),
      () => {
        this.hass!.callService('button', 'press', { entity_id: entities.adherenceResetButton });
      }
    );
  }

  private _handleAdherenceCover(entities: ResolvedEntities) {
    if (!this.hass || !entities.adherenceCoverButton) return;
    this._openToolsDialog(
      localize(this._lang, 'tools.mark_adherence_taken'),
      localize(this._lang, 'tools.desc.mark_adherence_taken'),
      () => {
        this.hass!.callService('button', 'press', { entity_id: entities.adherenceCoverButton });
      }
    );
  }

  private _handleResetHistory(entities: ResolvedEntities) {
    if (!this.hass || !entities.resetButton) return;
    this._openToolsDialog(
      localize(this._lang, 'tools.reset_history'),
      localize(this._lang, 'tools.desc.reset_history'),
      () => {
        this.hass!.callService('button', 'press', { entity_id: entities.resetButton });
      }
    );
  }

  private _handleUndoDoseConfirm(entities: ResolvedEntities) {
    if (!this.hass || !entities.undoButton) return;
    this._openToolsDialog(
      localize(this._lang, 'tools.undo_dose'),
      localize(this._lang, 'tools.desc.undo_dose'),
      () => {
        this.hass!.callService('button', 'press', { entity_id: entities.undoButton });
      }
    );
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

  // Keyboard activation helper for clickable <div> elements that use
  // role="button". Fires the handler on Enter or Space (standard button
  // behavior) so they're accessible to keyboard and screen-reader users.
  private _onKeyActivate(e: KeyboardEvent, handler: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  }

  // ── Pane Switching ─────────────────────────

  private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats' | 'tools'): void {
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
            ${localize(this._lang, 'dialog.override.body', { expiry: dlg.windowExpiry })}
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

  private _renderPane1(entities: ResolvedEntities) {
    const safeState = this._getState(entities.pillsSafeToTake);
    const safeCount = parseInt(safeState, 10);
    const isLimitReached = !isNaN(safeCount) && safeCount <= 0;
    const isUnknown = safeState === 'unknown' || safeState === 'unavailable';
    const timeSince = this._computeTimeSinceLastDose(entities);
    const nextDose = this._computeNextDose(entities);
    const overTime = this._computeOverTime(entities);
    const pillsLeft = this._getState(entities.pillsLeft);
    const chipEntities = this._getChipEntities();

    return html`
      <div class="pane pane-daily">
        <div class="med-name"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => this._showDeviceInfo = true}
             @keydown=${(e: KeyboardEvent) => this._onKeyActivate(e, () => this._showDeviceInfo = true)}
        >${this._getMedName(entities)}</div>

        <div class="daily-main">
          <button
            class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}"
            aria-label=${isLimitReached
              ? localize(this._lang, 'aria.take_pill_limit')
              : localize(this._lang, 'aria.take_pill_safe')}
            @click=${() => this._handleTakePill(entities)}
          >
            <ha-icon icon="${isLimitReached ? 'mdi:alert' : 'mdi:pill'}"></ha-icon>
            <span class="take-label">${isLimitReached ? localize(this._lang, 'daily.limit_reached') : localize(this._lang, 'daily.take_pill')}</span>
            <span class="take-sub">${isLimitReached
              ? html`${localize(this._lang, 'daily.last')}: ${timeSince} \u2022 ${localize(this._lang, 'daily.next')}: ${nextDose}`
              : (overTime
                ? html`${localize(this._lang, 'daily.over')}: ${overTime}`
                : html`${localize(this._lang, 'daily.last')}: ${timeSince}`)}</span>
          </button>

          <div class="stats-column">
            <div class="stat-pill">
              <ha-icon icon="mdi:shield-check"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'daily.safe_to_take')}</span>
              <span class="stat-value">${isUnknown ? localize(this._lang, 'daily.na') : this._formatInteger(safeState)}</span>
            </div>
            <div class="stat-pill ${entities.addRefill ? 'clickable' : ''}"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'dialog.refill.aria')}
                 @click=${entities.addRefill ? () => { this._showRefillDialog = true; this._refillAmount = ''; } : null}
                 @keydown=${entities.addRefill ? (e: KeyboardEvent) => this._onKeyActivate(e, () => { this._showRefillDialog = true; this._refillAmount = ''; }) : null}>
              <ha-icon icon="mdi:pill"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'daily.pills_left')}</span>
              <span class="stat-value">${pillsLeft === 'unavailable' ? '-' : this._formatInteger(pillsLeft)}</span>
            </div>
          </div>
        </div>

        ${chipEntities.length > 0
          ? html`
              <div class="chips-row">
                ${chipEntities.map((chip) => {
                  const chipState = this._getState(chip.entityId);
                  const chipName = chip.label
                    || this.hass?.states[chip.entityId]?.attributes?.friendly_name
                    || chip.entityId;
                  return html`
                    <div class="chip">
                      <span class="chip-name">${chipName}</span>
                      <span class="chip-value">${chipState}</span>
                    </div>
                  `;
                })}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  // ── Pane 2: Graphs ─────────────────────────

  private _renderPane2(entities: ResolvedEntities) {
    const dailyBuckets = this._bucketByDay(this._getBarTimeframeDays());
    const hasAmountInBody = entities.amountInBody &&
      this._getState(entities.amountInBody) !== '0' &&
      this._getState(entities.amountInBody) !== 'unknown' &&
      this._getState(entities.amountInBody) !== 'unavailable';

    // Determine available slides
    const slides: Array<'bar' | 'line'> = ['bar'];
    if (hasAmountInBody && (this.config?.show_amount_in_body !== false)) {
      slides.push('line');
    }

    // Clamp active graph index
    const activeIdx = Math.min(this._activeGraph, slides.length - 1);
    const activeSlide = slides[activeIdx];

    return html`
      <div class="pane pane-graphs">
        ${slides.length > 1 ? html`
          <div class="carousel-nav">
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_prev')}
              @click=${() => this._activeGraph = (activeIdx - 1 + slides.length) % slides.length}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <span class="nav-title">
              ${activeSlide === 'bar' ? localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() }) : localize(this._lang, 'graphs.line_title')}
            </span>
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_next')}
              @click=${() => this._activeGraph = (activeIdx + 1) % slides.length}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        ` : html`
          <div class="carousel-nav">
            <span class="nav-title">${localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() })}</span>
          </div>
        `}

        <div class="graph-container">
          ${activeSlide === 'bar'
            ? this._renderBarGraph(dailyBuckets)
            : this._renderLineGraph(entities)}
        </div>

        ${activeSlide === 'bar' ? this._renderAveragesGrid(entities) : nothing}
      </div>
    `;
  }

  private _renderBarGraph(buckets: DayBucket[]) {
    const maxCount = Math.max(...buckets.map(b => b.count), 1);
    const hasData = buckets.some(b => b.count > 0);
    const dayCount = this._getBarTimeframeDays();

    if (!hasData) {
      return html`
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderBarTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:chart-bar"></ha-icon>
            <span>${localize(this._lang, 'graphs.empty_bar')}</span>
          </div>
        </div>
      `;
    }

    const w = 320;
    const h = 180;
    const padLeft = 32;
    const padRight = 8;
    const padTop = 16;
    const padBottom = 8;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const barGap = 2;
    const barW = (chartW - barGap * (buckets.length - 1)) / buckets.length;

    // Label decimation: show every Nth label to keep 60-bar view readable
    let labelStep: number;
    if (dayCount <= 14) labelStep = 1;       // 14D: every day
    else if (dayCount <= 30) labelStep = 2;   // 30D: every 2 days
    else labelStep = 5;                        // 60D: every 5 days

    return html`
      <div class="bar-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderBarTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          ${[0, 0.25, 0.5, 0.75, 1].map(fraction => {
            const y = padTop + chartH * (1 - fraction);
            return svg`
              <line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${Math.round(maxCount * fraction)}</text>
            `;
          })}

          ${buckets.map((bucket, i) => {
            const barH = Math.max((bucket.count / maxCount) * chartH, bucket.count > 0 ? 2 : 0);
            const x = padLeft + i * (barW + barGap);
            const y = padTop + chartH - barH;
            return svg`
              <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2"
                    fill="var(--primary-color)" opacity="0.85">
                <title>${bucket.label}: ${bucket.count} dose${bucket.count !== 1 ? 's' : ''}</title>
              </rect>
            `;
          })}

          <!-- Baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>
        </svg>
        <div class="bar-labels">
          ${buckets.map((bucket, i) => html`
            <span>${i % labelStep === 0 ? bucket.label : ''}</span>
          `)}
        </div>
      </div>
    `;
  }

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
      console.warn('[pill-logger-card] amount history fetch failed:', e);
    }
  }

  private async _fetchDoseHistory(entities: ResolvedEntities) {
    if (!this.hass || !this.config?.device_id) return;

    const deviceId = this.config.device_id;
    // Same race guard as _fetchAmountHistory (both are triggered together on
    // pane entry; a new pane/timeframe change invalidates both via the token).
    const token = ++this._doseFetchToken;

    try {
      const data = await this.hass.callApi('GET', `pill_logger/history/${deviceId}`);

      // Discard if a newer fetch started or the card was disconnected mid-flight.
      if (token !== this._doseFetchToken) return;

      // data is [[iso_timestamp, strength], ...]
      if (Array.isArray(data)) {
        this._doseHistory = data;
      }
    } catch (e) {
      // Custom endpoint may not be available on older backends; log for debug.
      console.warn('[pill-logger-card] dose history fetch failed:', e);
    }
  }

  private _renderTimeframeChips() {
    const timeframes: Array<{ id: string; labelKey: string; ariaKey: string }> = [
      { id: '12h', labelKey: 'graphs.timeframe_12h', ariaKey: 'aria.timeframe_12h' },
      { id: '48h', labelKey: 'graphs.timeframe_48h', ariaKey: 'aria.timeframe_48h' },
      { id: '7d', labelKey: 'graphs.timeframe_7d', ariaKey: 'aria.timeframe_7d' },
      { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
      { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
    ];
    return timeframes.map(tf => html`
      <button
        class="timeframe-chip ${this._activeTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => this._handleTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
  }

  private _renderBarTimeframeChips() {
    const timeframes: Array<{ id: string; labelKey: string; ariaKey: string }> = [
      { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
      { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
      { id: '60d', labelKey: 'graphs.timeframe_60d', ariaKey: 'aria.timeframe_60d' },
    ];
    return timeframes.map(tf => html`
      <button
        class="timeframe-chip ${this._activeBarTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => this._handleBarTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
  }

  private _handleBarTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeBarTimeframe) return;
    this._activeBarTimeframe = timeframe;
  }

  private _renderLineGraph(entities: ResolvedEntities) {
    const amountInBody = this._getState(entities.amountInBody);
    const history = this._amountHistory;

    const w = 320;
    const h = 180;
    const padLeft = 36;
    const padRight = 8;
    const padTop = 16;
    const padBottom = 28;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    if (history.length === 0) {
      return html`
        <div class="line-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderTimeframeChips()}
          </div>
          <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
            <text x="${w / 2}" y="${h / 2}" text-anchor="middle"
                  style="font-size: calc(13px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${localize(this._lang, 'graphs.loading_history')}</text>
          </svg>
        </div>
      `;
    }

    const now = new Date();
    const timeframeHours = this._getTimeframeHours();
    const startTime = new Date(now.getTime() - timeframeHours * 60 * 60 * 1000);

    // Find max value for Y-axis scaling
    const values = history.map(p => p.value);
    const maxAmount = Math.max(...values, 1);

    // Build polyline points from actual history
    const polylinePoints = history.map(p => {
      const t = new Date(p.timestamp);
      const fraction = Math.max(0, Math.min(1, (t.getTime() - startTime.getTime()) / (timeframeHours * 60 * 60 * 1000)));
      const x = padLeft + fraction * chartW;
      const y = padTop + chartH * (1 - p.value / maxAmount);
      return `${x},${y}`;
    }).join(' ');

    // Compute Y position for the current-amount dashed line
    const currentAmountNum = parseFloat(amountInBody);
    const currentY = (amountInBody && amountInBody !== 'unavailable' && !isNaN(currentAmountNum))
      ? Math.max(padTop, Math.min(padTop + chartH, padTop + chartH * (1 - currentAmountNum / maxAmount)))
      : padTop;
    const currentLabelY = Math.max(padTop + 8, currentY - 5);

    // Dynamic time labels based on timeframe
    const timeLabels: Array<{ label: string; x: number }> = [];
    const totalHours = this._getTimeframeHours();

    if (totalHours <= 12) {
      // 12H: labels every 3 hours, format "-Xh"
      for (let h = 0; h <= totalHours; h += 3) {
        const fraction = h / totalHours;
        timeLabels.push({ label: `-${totalHours - h}h`, x: padLeft + fraction * chartW });
      }
    } else if (totalHours <= 48) {
      // 48H: labels every 6 hours, format "-Xh"
      for (let h = 0; h <= totalHours; h += 6) {
        const fraction = h / totalHours;
        timeLabels.push({ label: `-${totalHours - h}h`, x: padLeft + fraction * chartW });
      }
    } else {
      // 7D/14D/30D: labels in days
      const totalDays = totalHours / 24;
      let step: number;
      if (totalDays <= 7) step = 1;       // 7D: every 1 day
      else if (totalDays <= 14) step = 2;   // 14D: every 2 days
      else step = 5;                        // 30D: every 5 days

      for (let d = 0; d <= totalDays; d += step) {
        const fraction = d / totalDays;
        timeLabels.push({ label: `-${Math.round(totalDays - d)}d`, x: padLeft + fraction * chartW });
      }
    }

    return html`
      <div class="line-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          <!-- Y-axis grid lines and labels -->
          ${[0, 0.25, 0.5, 0.75, 1].map(fraction => {
            const y = padTop + chartH * (1 - fraction);
            return svg`
              <line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${(maxAmount * fraction).toFixed(1)}</text>
            `;
          })}

          <!-- History polyline -->
          <polyline points="${polylinePoints}"
                    fill="none" stroke="var(--primary-color)" stroke-width="1.5"
                    stroke-linejoin="round" opacity="0.8"/>

          <!-- Current amount dashed line -->
          ${amountInBody && amountInBody !== 'unavailable' ? svg`
            <line x1="${padLeft}" y1="${currentY}" x2="${w - padRight}" y2="${currentY}"
                  stroke="var(--primary-color)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
            <text x="${padLeft}" y="${currentLabelY}" style="font-size: calc(11px + var(--pill-text-offset, 0px))" fill="var(--primary-color)">
              Current: ${amountInBody} ${this._getStrengthUnit(entities)}
            </text>
          ` : nothing}

          <!-- X-axis baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>

          <!-- X-axis time labels -->
          ${timeLabels.map(tl => svg`
            <line x1="${tl.x}" y1="${h - padBottom}" x2="${tl.x}" y2="${h - padBottom + 4}"
                  stroke="var(--divider-color)" stroke-width="1"/>
            <text x="${tl.x}" y="${h - 6}" text-anchor="middle"
                  style="font-size: calc(9px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${tl.label}</text>
          `)}
        </svg>
      </div>
    `;
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

  private _renderAveragesGrid(entities: ResolvedEntities) {
    const items: Array<{ label: string; value: string }> = [];
    const { hasDaysSensor, daysSince } = this._daysSinceReveal(entities);

    if (this.config?.show_day_avg_boxes !== false) {
      if (entities.avg7Days && (!hasDaysSensor || daysSince >= 7)) items.push({ label: localize(this._lang, 'averages.avg_7_day'), value: this._getState(entities.avg7Days) });
      if (entities.avg14Days && (!hasDaysSensor || daysSince >= 14)) items.push({ label: localize(this._lang, 'averages.avg_14_day'), value: this._getState(entities.avg14Days) });
      if (entities.avg30Days && (!hasDaysSensor || daysSince >= 30)) items.push({ label: localize(this._lang, 'averages.avg_30_day'), value: this._getState(entities.avg30Days) });
      // Year slot doubles as the running elapsed-days average until 365 days pass.
      // The avgYearly sensor already computes min(days_since_start, 365), so its
      // value IS the running average from the first dose until the year mark.
      if (entities.avgYearly && (!hasDaysSensor || daysSince > 0)) {
        const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.avg_running', { days: daysSince }) : localize(this._lang, 'averages.avg_year');
        items.push({ label, value: this._getState(entities.avgYearly) });
      }
    }
    if (this.config?.show_adherence_boxes !== false) {
      if (entities.adherence7Days && (!hasDaysSensor || daysSince >= 7)) items.push({ label: localize(this._lang, 'averages.adh_7_day'), value: this._getState(entities.adherence7Days) + '%' });
      if (entities.adherence14Days && (!hasDaysSensor || daysSince >= 14)) items.push({ label: localize(this._lang, 'averages.adh_14_day'), value: this._getState(entities.adherence14Days) + '%' });
      if (entities.adherence30Days && (!hasDaysSensor || daysSince >= 30)) items.push({ label: localize(this._lang, 'averages.adh_30_day'), value: this._getState(entities.adherence30Days) + '%' });
      // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
      if (entities.adherence365Days && (!hasDaysSensor || daysSince > 0)) {
        const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.adh_running', { days: daysSince }) : localize(this._lang, 'averages.adh_365_day');
        items.push({ label, value: this._getState(entities.adherence365Days) + '%' });
      }
    }

    if (items.length === 0) return nothing;

    return html`
      <div class="averages-grid">
        ${items.map(item => html`
          <div class="avg-cell">
            <span class="avg-label">${item.label}</span>
            <span class="avg-value">${item.value === 'unavailable' ? '-' : item.value}</span>
          </div>
        `)}
      </div>
    `;
  }

  // ── Pane 3: Stats ──────────────────────────

  private _renderPane3(entities: ResolvedEntities) {
    const rows: Array<{ label: string; value: string; icon: string }> = [];

    if (entities.totalDoses) rows.push({ label: localize(this._lang, 'stats.total_doses'), value: this._getState(entities.totalDoses), icon: 'mdi:counter' });
    if (entities.daysSinceFirstDose) rows.push({ label: localize(this._lang, 'stats.days_since_first_dose'), value: this._getState(entities.daysSinceFirstDose), icon: 'mdi:calendar-start' });
    if (entities.lastDose) rows.push({ label: localize(this._lang, 'stats.last_dose'), value: this._computeTimeSinceLastDose(entities), icon: 'mdi:clock-outline' });
    const strengthUnit = this._getStrengthUnit(entities);
    if (entities.strength) rows.push({ label: localize(this._lang, 'stats.strength'), value: this._formatInteger(this._getState(entities.strength)) + ' ' + strengthUnit, icon: 'mdi:scale' });
    if (entities.amountInBody) rows.push({ label: localize(this._lang, 'stats.amount_in_body'), value: this._getState(entities.amountInBody) + ' ' + strengthUnit, icon: 'mdi:chart-bell-curve' });
    if (entities.steadyState) {
      const ss = this._getState(entities.steadyState);
      const display = (ss === '0.0' || ss === '0') ? localize(this._lang, 'stats.steady_state_reached') : localize(this._lang, 'stats.steady_state_days', { days: ss });
      rows.push({ label: localize(this._lang, 'stats.steady_state'), value: display, icon: 'mdi:chart-timeline-variant' });
    }
    // Avg / Adherence rows mirror the Graph panel's progressive reveal driven
    // by days-since-first-dose. When the sensor is absent, all rows show.
    const { hasDaysSensor: hasDays, daysSince: days } = this._daysSinceReveal(entities);
    if (entities.avg7Days && (!hasDays || days >= 7)) rows.push({ label: localize(this._lang, 'stats.avg_7_day'), value: this._getState(entities.avg7Days), icon: 'mdi:chart-line' });
    if (entities.avg14Days && (!hasDays || days >= 14)) rows.push({ label: localize(this._lang, 'stats.avg_14_day'), value: this._getState(entities.avg14Days), icon: 'mdi:chart-line' });
    if (entities.avg30Days && (!hasDays || days >= 30)) rows.push({ label: localize(this._lang, 'stats.avg_30_day'), value: this._getState(entities.avg30Days), icon: 'mdi:chart-line' });
    // Year slot doubles as the running elapsed-days average until 365 days pass.
    if (entities.avgYearly && (!hasDays || days > 0)) {
      const label = (hasDays && days < 365) ? localize(this._lang, 'stats.avg_running', { days }) : localize(this._lang, 'stats.avg_yearly');
      rows.push({ label, value: this._getState(entities.avgYearly), icon: 'mdi:chart-line' });
    }
    if (entities.adherence7Days && (!hasDays || days >= 7)) rows.push({ label: localize(this._lang, 'stats.adherence_7_day'), value: this._getState(entities.adherence7Days) + '%', icon: 'mdi:check-decagram' });
    if (entities.adherence14Days && (!hasDays || days >= 14)) rows.push({ label: localize(this._lang, 'stats.adherence_14_day'), value: this._getState(entities.adherence14Days) + '%', icon: 'mdi:check-decagram' });
    if (entities.adherence30Days && (!hasDays || days >= 30)) rows.push({ label: localize(this._lang, 'stats.adherence_30_day'), value: this._getState(entities.adherence30Days) + '%', icon: 'mdi:check-decagram' });
    // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
    if (entities.adherence365Days && (!hasDays || days > 0)) {
      const label = (hasDays && days < 365) ? localize(this._lang, 'stats.adherence_running', { days }) : localize(this._lang, 'stats.adherence_365_day');
      rows.push({ label, value: this._getState(entities.adherence365Days) + '%', icon: 'mdi:check-decagram' });
    }

    return html`
      <div class="pane pane-stats">
        <div class="stats-grid ${this.config?.stats_3_columns ? 'three-col' : ''}">
          ${rows.map(row => html`
            <div class="stat-cell">
              <div class="stat-cell-header">
                <ha-icon icon="${row.icon}"></ha-icon>
                <span class="stat-cell-label">${row.label}</span>
              </div>
              <span class="stat-cell-value">${row.value === 'unavailable' ? '-' : row.value}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // ── Pane 4: Tools ──────────────────────────

  private _renderPane4(entities: ResolvedEntities) {
    const hasAdhTools = !!(entities.adherenceResetButton || entities.adherenceCoverButton);
    const hasGenTools = !!(entities.resetButton || entities.undoButton);

    if (!hasAdhTools && !hasGenTools) {
      return html`
        <div class="tools-panel">
          <div class="tools-empty">${localize(this._lang, 'tools.empty')}</div>
        </div>
      `;
    }

    return html`
      <div class="tools-panel">
        ${hasAdhTools ? html`
          <div class="tools-section-header">${localize(this._lang, 'tools.adherence_header')}</div>
          <div class="tools-grid">
            ${entities.adherenceResetButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleAdherenceReset(entities)}
              >
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_adherence')}</span>
              </button>
            ` : nothing}
            ${entities.adherenceCoverButton ? html`
              <button
                class="tool-btn"
                @click=${() => this._handleAdherenceCover(entities)}
              >
                <ha-icon icon="mdi:check-underline-circle"></ha-icon>
                <span>${localize(this._lang, 'tools.mark_adherence_taken')}</span>
              </button>
            ` : nothing}
          </div>
        ` : nothing}

        ${hasGenTools ? html`
          <div class="tools-section-header tools-section-header--spaced">${localize(this._lang, 'tools.general_header')}</div>
          <div class="tools-grid">
            ${entities.resetButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleResetHistory(entities)}
              >
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_history')}</span>
              </button>
            ` : nothing}
            ${entities.undoButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleUndoDoseConfirm(entities)}
              >
                <ha-icon icon="mdi:undo"></ha-icon>
                <span>${localize(this._lang, 'tools.undo_dose')}</span>
              </button>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

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

  // ── Pane Selector ──────────────────────────

  private _renderPaneSelector() {
    const panes: Array<{ id: 'daily' | 'graphs' | 'stats' | 'tools'; labelKey: string; icon: string }> = [
      { id: 'daily', labelKey: 'pane.daily', icon: 'mdi:pill' },
      { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
      { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
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
            <div style="font-size: 13px; color: var(--secondary-text-color);">${localize(this._lang, 'card.placeholder_subtitle')}</div>
          </div>
        </ha-card>
      `;
    }

    const entities = this._resolveEntities();

    return html`
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text !== false ? '0px' : '-2px'};">
        <div class="card-content">
          ${this._activePane === 'daily' ? this._renderPane1(entities) : nothing}
          ${this._activePane === 'graphs' ? this._renderPane2(entities) : nothing}
          ${this._activePane === 'stats' ? this._renderPane3(entities) : nothing}
          ${this._activePane === 'tools' ? this._renderPane4(entities) : nothing}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector() : nothing}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : nothing}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : nothing}
        ${this._toolsDialog ? this._renderToolsDialog() : nothing}
        ${this._overrideDialog ? this._renderOverrideDialog() : nothing}
      </ha-card>
    `;
  }

  // ── Lifecycle ──────────────────────────────

  connectedCallback(): void {
    super.connectedCallback();
    // Reset to defaults on every connection. With ll-rebuild removed (#16),
    // the element is no longer destroyed/recreated on pane switch, so @state
    // survives naturally. The only time connectedCallback fires is on a
    // genuine view entry (navigate to the dashboard) or initial load — both
    // should start on the daily pane. Lit auto-renders on the @state
    // mutations below, so no manual requestUpdate() is needed (#17).
    this._activePane = 'daily';
    this._activeGraph = 0;
    this._activeTimeframe = '48h';
    this._activeBarTimeframe = '14d';

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
      '_showDeviceInfo',
      '_showRefillDialog',
      '_refillAmount',
      '_toolsDialog',
      '_overrideDialog',
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
      const oldHass = changedProps.get('hass') as PillLoggerHass | undefined;
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
  private _relevantStateChanged(oldHass: PillLoggerHass | undefined): boolean {
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
      } else if (changedProperties.has('_activeTimeframe')) {
        this._amountHistory = [];
        this._fetchAmountHistory(entities);
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
    return {
      schema: [
        {
          name: 'device_id',
          required: true,
          selector: {
            device: {
              filter: { integration: 'pill_logger' },
            },
          },
        },
        {
          name: 'big_text',
          selector: { boolean: {} },
        },
        {
          name: 'color_scheme',
          selector: {
            select: {
              options: [
                { value: 'default', label: localize('en', 'color.default') },
                { value: 'blue', label: localize('en', 'color.blue') },
                { value: 'red', label: localize('en', 'color.red') },
                { value: 'green', label: localize('en', 'color.green') },
                { value: 'yellow', label: localize('en', 'color.yellow') },
                { value: 'orange', label: localize('en', 'color.orange') },
                { value: 'purple', label: localize('en', 'color.purple') },
                { value: 'pink', label: localize('en', 'color.pink') },
                { value: 'teal', label: localize('en', 'color.teal') },
                { value: 'brown', label: localize('en', 'color.brown') },
                { value: 'coral', label: localize('en', 'color.coral') },
                { value: 'slate', label: localize('en', 'color.slate') },
                { value: 'gold', label: localize('en', 'color.gold') },
                { value: 'grey', label: localize('en', 'color.grey') },
              ],
            },
          },
        },
        {
          name: 'name',
          selector: { text: {} },
        },
        {
          type: 'expandable',
          name: 'chips',
          title: 'Custom Chips',
          flatten: true,
          schema: [
            {
              name: 'chip_1',
              selector: {
                entity: {
                  context: { filter_device_id: 'device_id' },
                },
              },
            },
            {
              name: 'chip_1_label',
              selector: { text: {} },
            },
            {
              name: 'chip_2',
              selector: {
                entity: {
                  context: { filter_device_id: 'device_id' },
                },
              },
            },
            {
              name: 'chip_2_label',
              selector: { text: {} },
            },
            {
              name: 'chip_3',
              selector: {
                entity: {
                  context: { filter_device_id: 'device_id' },
                },
              },
            },
            {
              name: 'chip_3_label',
              selector: { text: {} },
            },
            {
              name: 'chip_4',
              selector: {
                entity: {
                  context: { filter_device_id: 'device_id' },
                },
              },
            },
            {
              name: 'chip_4_label',
              selector: { text: {} },
            },
          ],
        },
        {
          type: 'expandable',
          name: 'graph_options',
          title: 'Graph',
          flatten: true,
          schema: [
            {
              name: 'show_amount_in_body',
              selector: { boolean: {} },
            },
            {
              name: 'show_day_avg_boxes',
              selector: { boolean: {} },
            },
            {
              name: 'show_adherence_boxes',
              selector: { boolean: {} },
            },
          ],
        },
        {
          name: 'stats_3_columns',
          selector: { boolean: {} },
        },
        {
          name: 'hide_nav_bar',
          selector: { boolean: {} },
        },
      ] as any,
      computeLabel: (schema: any, _data: any, hass: any) => {
        const lang = hass?.language || 'en';
        return localize(lang, 'config.' + schema.name);
      },
      computeHelper: (schema: any, _data: any, hass: any) => {
        const lang = hass?.language || 'en';
        const name: string = schema.name;
        if (name?.startsWith('chip_') && name?.endsWith('_label')) {
          return localize(lang, 'config.helper.chip_label');
        }
        if (name?.startsWith('chip_')) {
          return localize(lang, 'config.helper.chip');
        }
        return localize(lang, 'config.helper.' + name);
      },
    };
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
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: color 0.2s, background 0.2s, box-shadow 0.2s;
      border-bottom: 2px solid transparent;
    }

    .pane-btn.tools {
      flex: 0 0 auto;
      min-width: 44px;
      padding: 10px;
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

    /* ── Pane 1: Daily ─────────────────────── */

    .pane-daily {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .med-name {
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      text-align: center;
      cursor: pointer;
    }

    .daily-main {
      display: flex;
      gap: 12px;
    }

    .stats-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .take-pill-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      padding: 12px 16px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.15s, background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
    }

    .take-pill-btn:active {
      transform: scale(0.96);
    }

    .take-pill-btn.safe {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .take-pill-btn.safe:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .take-pill-btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
      color: var(--error-color, #db4437);
    }

    .take-pill-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.2);
    }

    .take-pill-btn ha-icon {
      --mdc-icon-size: 28px;
      margin-bottom: 2px;
    }

    .take-label {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 550;
    }

    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 450;
      opacity: 0.9;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-label {
      font-size: calc(14px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chip {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 6px;
      background: var(--chip-background, rgba(128,128,128,0.08));
      border-radius: 10px;
    }

    .chip-name {
      font-size: calc(10px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .chip-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }

    /* ── Pane 2: Graphs ─────────────────────── */

    .pane-graphs {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .carousel-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      transition: background 0.2s;
    }

    .nav-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
    }

    .nav-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 20px;
    }

    .nav-title {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: 500;
      color: var(--secondary-text-color, #666);
      min-width: 100px;
      text-align: center;
    }

    .graph-container {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.03);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 0;
      min-height: 180px;
      overflow: hidden;
    }

    .chart-svg {
      display: block;
      width: 100%;
    }

    .line-graph-wrapper {
      position: relative;
    }

    .timeframe-chips {
      position: absolute;
      top: 4px;
      right: 4px;
      display: flex;
      gap: 2px;
      z-index: 1;
    }

    .timeframe-chip {
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: none;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
      line-height: 1.4;
    }

    .timeframe-chip:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .timeframe-chip.active {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
      font-weight: 600;
    }

    .bar-graph-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .bar-labels {
      display: flex;
      padding-left: 10%;
      padding-right: 2.5%;
      margin-top: -2px;
      padding-bottom: 6px;
      overflow: hidden;
    }

    .bar-labels span {
      flex: 1;
      text-align: center;
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      line-height: 1.4;
    }

    .graph-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
    }

    .graph-placeholder ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }

    .averages-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .avg-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      padding: 6px 4px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      flex: 1;
      min-width: 0;
    }

    .avg-label {
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .avg-value {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }

    /* ── Pane 3: Stats ──────────────────────── */

    .pane-stats {
      display: flex;
      flex-direction: column;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .stats-grid.three-col {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .stat-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
    }

    .stat-cell-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-cell-header ha-icon {
      --mdc-icon-size: 16px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-cell-label {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-cell-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }

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
      font-size: 1.25rem;
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
      --mdc-icon-size: 24px;
    }

    .dialog-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dialog-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .dialog-btn ha-icon {
      --mdc-icon-size: 20px;
    }

    /* ── Refill Dialog ──────────────────────── */

    .refill-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      border-radius: var(--ha-card-border-radius, 12px);
      font-size: 16px;
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

    /* ── Tools Panel ─────────────────────────── */

    .tools-panel {
      padding: 8px 4px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tools-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(13px + var(--pill-text-offset, 0px));
      padding: 24px 8px;
    }

    .tools-section-header {
      font-size: calc(14px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tools-section-header--spaced {
      margin-top: 8px;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .tool-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 14px 8px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.12));
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color, var(--primary-background-color, #fff));
      color: var(--primary-text-color, #222);
      font-size: calc(13px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.1s;
    }

    .tool-btn ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color, #03a9f4);
    }

    .tool-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-color: var(--primary-color, #03a9f4);
    }

    .tool-btn:active {
      transform: scale(0.98);
    }

    .tool-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.06);
      border-color: var(--error-color, #db4437);
    }

    .tools-dialog-descriptor {
      font-size: calc(14px + var(--pill-text-offset, 0px));
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

customElements.define('pill-logger-card', PillLoggerCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'pill-logger-card',
  name: 'Pill Logger',
  preview: true,
  description: 'A custom card for the Pill Logger integration — track medications, view dose graphs, and monitor statistics.',
  documentationURL: 'https://github.com/adix992/Home-Assistant-Pill-Logger',
});