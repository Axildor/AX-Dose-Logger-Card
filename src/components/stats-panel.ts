// ──────────────────────────────────────────────
// AX Dose Logger Card — Stats Pane (Pane 3)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane3.
// Receives the resolved entities + a CardController and renders the read-only
// statistics grid. Calls back into the controller for more-info opens (click +
// keyboard). All formatting/computation is delegated to the controller so this
// component holds only the template + its CSS.

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-stats-panel')
export class AxDoseStatsPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
  // hass is passed down as a reactive prop so the panel re-renders on every
  // HA state update (HA replaces the top-level hass object reference on each
  // tick). Without this, the panel only re-rendered when its element was
  // remounted on a pane switch, so live changes (e.g. take-pill) did not
  // appear until the user navigated away and back.
  @property({ attribute: false }) hass?: AxDoseLoggerHass;
  // 30s tick from the container — a reactive trigger so the panel re-renders
  // to refresh time-relative rows even when hass/entities/controller refs are
  // unchanged. The panel doesn't read this value; it just needs to change.
  @property({ attribute: false }) tick: number = 0;

  private get _lang(): string {
    return this.controller.lang;
  }
  private get _config() {
    return this.controller.config;
  }

  render() {
    const c = this.controller;
    const e = this.entities;
    const rows: Array<{ label: string; value: string; icon: string; entityId?: string }> = [];

    if (e.totalDoses) rows.push({ label: localize(this._lang, 'stats.total_doses'), value: c.getState(e.totalDoses), icon: 'mdi:counter', entityId: e.totalDoses });
    if (e.daysSinceFirstDose) rows.push({ label: localize(this._lang, 'stats.days_since_first_dose'), value: c.getState(e.daysSinceFirstDose), icon: 'mdi:calendar-start', entityId: e.daysSinceFirstDose });
    if (e.daysLeft) {
      // Days-left inventory-burn sensor. Scheduled medicine → "Days left"
      // (integer, config-derived doses/day); As Needed + drinks + master →
      // "Est. days left" (empirical 7-day average). The backend sets the
      // `estimation` state attribute; the resolver mirrors it onto
      // daysLeftEst so this row picks the matching label. Whole-number
      // display via formatInteger matches the Amount in Body discipline.
      const v = c.getState(e.daysLeft);
      let display = '-';
      if (v && v !== 'unknown' && v !== 'unavailable' && v !== 'None') {
        const formatted = c.formatInteger(v);
        display = (formatted && formatted !== 'unknown' && formatted !== 'unavailable') ? formatted + ' days' : '-';
      }
      const label = e.daysLeftEst
        ? localize(this._lang, 'stats.days_left_est')
        : localize(this._lang, 'stats.days_left');
      rows.push({ label, value: display, icon: 'mdi:calendar-clock', entityId: e.daysLeft });
    }
    if (e.lastDose) rows.push({ label: localize(this._lang, 'stats.last_dose'), value: c.computeTimeSinceLastDose(e), icon: 'mdi:clock-outline', entityId: e.lastDose });
    const strengthUnit = c.getStrengthUnit(e);
    if (e.strength) rows.push({ label: localize(this._lang, 'stats.strength'), value: c.formatInteger(c.getState(e.strength)) + ' ' + strengthUnit, icon: 'mdi:scale', entityId: e.strength });
    if (e.amountInBody) {
      // When elimination is disabled (half_life = 0) the backend emits
      // `unknown` (N/A) instead of a meaningless accumulating value —
      // render a bare dash rather than "unknown mg".
      const aibRaw = c.getState(e.amountInBody);
      const aibDisplay = (aibRaw === 'unknown' || aibRaw === 'unavailable' || !aibRaw)
        ? '-'
        : c.formatInteger(aibRaw) + ' ' + strengthUnit;
      rows.push({ label: localize(this._lang, 'stats.amount_in_body'), value: aibDisplay, icon: 'mdi:chart-bell-curve', entityId: e.amountInBody });
    }
    if (e.steadyState) {
      const ss = c.getState(e.steadyState);
      const display = (ss === '0.0' || ss === '0') ? localize(this._lang, 'stats.steady_state_reached') : localize(this._lang, 'stats.steady_state_days', { days: ss });
      rows.push({ label: localize(this._lang, 'stats.steady_state'), value: display, icon: 'mdi:chart-timeline-variant', entityId: e.steadyState });
    }
    // Avg / Adherence rows mirror the Graph panel's progressive reveal driven
    // by days-since-first-dose. When the sensor is absent, all rows show.
    const { hasDaysSensor: hasDays, daysSince: days } = c.daysSinceReveal(e);
    if (e.avg7Days && (!hasDays || days >= 7)) rows.push({ label: localize(this._lang, 'stats.avg_7_day'), value: c.getState(e.avg7Days), icon: 'mdi:chart-line', entityId: e.avg7Days });
    if (e.avg14Days && (!hasDays || days >= 14)) rows.push({ label: localize(this._lang, 'stats.avg_14_day'), value: c.getState(e.avg14Days), icon: 'mdi:chart-line', entityId: e.avg14Days });
    if (e.avg30Days && (!hasDays || days >= 30)) rows.push({ label: localize(this._lang, 'stats.avg_30_day'), value: c.getState(e.avg30Days), icon: 'mdi:chart-line', entityId: e.avg30Days });
    // Year slot doubles as the running elapsed-days average until 365 days pass.
    if (e.avgYearly && (!hasDays || days > 0)) {
      const label = (hasDays && days < 365) ? localize(this._lang, 'stats.avg_running', { days }) : localize(this._lang, 'stats.avg_yearly');
      rows.push({ label, value: c.getState(e.avgYearly), icon: 'mdi:chart-line', entityId: e.avgYearly });
    }
    if (e.adherence7Days && (!hasDays || days >= 7)) rows.push({ label: localize(this._lang, 'stats.adherence_7_day'), value: c.getState(e.adherence7Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence7Days });
    if (e.adherence14Days && (!hasDays || days >= 14)) rows.push({ label: localize(this._lang, 'stats.adherence_14_day'), value: c.getState(e.adherence14Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence14Days });
    if (e.adherence30Days && (!hasDays || days >= 30)) rows.push({ label: localize(this._lang, 'stats.adherence_30_day'), value: c.getState(e.adherence30Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence30Days });
    // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
    if (e.adherence365Days && (!hasDays || days > 0)) {
      const label = (hasDays && days < 365) ? localize(this._lang, 'stats.adherence_running', { days }) : localize(this._lang, 'stats.adherence_365_day');
      rows.push({ label, value: c.getState(e.adherence365Days) + '%', icon: 'mdi:check-decagram', entityId: e.adherence365Days });
    }

    // ── Master Tracker (Caffeine/Alcohol) extra rows ──
    // These fields are only populated by the master-tracker branch of
    // _computeEntities; medicine + granular drink devices leave them
    // undefined so the guards skip the rows.
    if (e.amountLast24h) {
      const v = c.getState(e.amountLast24h);
      rows.push({ label: localize(this._lang, 'stats.amount_last_24h'), value: (v === 'unknown' || v === 'unavailable' ? '-' : v + ' ' + c.getStrengthUnit(e)), icon: 'mdi:calendar-clock', entityId: e.amountLast24h });
    }
    if (e.sleepDisruption) {
      const v = c.getState(e.sleepDisruption);
      rows.push({ label: localize(this._lang, 'stats.sleep_disruption'), value: (v === 'unknown' || v === 'unavailable' ? '-' : v), icon: 'mdi:bed-clock', entityId: e.sleepDisruption });
    }
    if (e.estimatedLowTime) {
      const v = c.getState(e.estimatedLowTime);
      let display = '-';
      if (v && v !== 'unknown' && v !== 'unavailable') {
        const dt = new Date(v);
        if (!isNaN(dt.getTime())) {
          // HH:MM only (24-hour, no date, no seconds) — the backend keeps the
          // TIMESTAMP device class so automations + the history graph still see
          // the full datetime; the card surfaces just the time for compactness.
          display = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        }
      }
      rows.push({ label: localize(this._lang, 'stats.low_timestamp'), value: display, icon: 'mdi:clock-alert-outline', entityId: e.estimatedLowTime });
    }
    if (e.lowHoursUntil) {
      const v = c.getState(e.lowHoursUntil);
      let display = '-';
      if (v && v !== 'unknown' && v !== 'unavailable' && v !== 'None') {
        const num = parseFloat(v);
        // No unit suffix — the "Low - Hours Until" label already conveys the
        // unit (hours). The backend keeps UnitOfTime.HOURS for automations /
        // history; the card surfaces only the numeric value.
        if (!isNaN(num)) display = String(num);
      }
      rows.push({ label: localize(this._lang, 'stats.low_hours_until'), value: display, icon: 'mdi:timer-sand', entityId: e.lowHoursUntil });
    }

    return html`
      <div class="pane pane-stats">
        <div class="stats-grid ${this._config?.stats_3_columns ? 'three-col' : ''}">
          ${rows.map((row) => html`
            <div
              class="stat-cell ${row.entityId ? 'clickable' : ''}"
              role=${row.entityId ? 'button' : nothing}
              tabindex=${row.entityId ? '0' : nothing}
              @click=${row.entityId ? () => this.controller.openMoreInfo(row.entityId!) : undefined}
              @keydown=${row.entityId ? (ev: KeyboardEvent) => this.controller.onStatCellKeydown(ev, row.entityId!) : undefined}
            >
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

  static styles = css`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
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
      transition: background 0.15s ease;
    }

    .stat-cell.clickable {
      cursor: pointer;
    }

    .stat-cell.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .stat-cell.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
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
      font-size: calc(14px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .stat-cell-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-stats-panel': AxDoseStatsPanel;
  }
}