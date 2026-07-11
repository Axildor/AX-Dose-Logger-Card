// ──────────────────────────────────────────────
// AX Dose Logger Card — Inventory Pane (Master Tracker, Pane "inventory")
// ──────────────────────────────────────────────
// 2-column grid, one row per granular drink of the master's substance:
//   col 1: clickable refill box (drink name + stock value) → opens the
//          refill dialog targeted at that drink's add_stock number entity.
//   col 2: 7-day avg + trailing-dynamic-to-365-day avg (reuses the medicine
//          "Running N-Day Avg" reveal logic via drinkDaysSinceReveal, reading
//          history_start_date on the 365-day avg sensor).

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass, DrinkInfo } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-inventory-panel')
export class AxDoseInventoryPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
  @property({ attribute: false }) hass?: AxDoseLoggerHass;
  // 30s tick from the container — a reactive trigger so the panel re-renders
  // to refresh time-relative content even when hass/entities/controller refs
  // are unchanged. The panel doesn't read this value; it just needs to change.
  @property({ attribute: false }) tick: number = 0;

  private get _lang(): string {
    return this.controller.lang;
  }

  render() {
    const c = this.controller;
    const substance = this.entities.substance;
    if (!substance) return nothing;
    const drinks = c.getDrinksOfSubstance(substance);

    if (drinks.length === 0) {
      return html`
        <div class="pane pane-inventory">
          <div class="inv-empty">
            <ha-icon icon="mdi:package-variant-closed"></ha-icon>
            <span>${localize(this._lang, 'inventory.empty')}</span>
          </div>
        </div>
      `;
    }

    const substanceIcon = substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee';

    return html`
      <div class="pane pane-inventory">
        <div class="inv-grid">
          ${drinks.map((d) => this._renderRow(d, substanceIcon))}
        </div>
      </div>
    `;
  }

  private _renderRow(d: DrinkInfo, substanceIcon: string) {
    const c = this.controller;
    // Column 1 — refill box (2 lines: drink name + stock | Est. days left + value).
    const stockState = d.stockEntityId ? c.getState(d.stockEntityId) : '';
    const stockNum = parseInt(stockState, 10);
    const stockDisplay = isNaN(stockNum) ? '-' : c.formatInteger(String(stockNum));
    const canRefill = !!d.addStockEntityId;
    // Per-drink "Est. days left" (DrinkDaysLeftSensor). Plain number, no unit
    // suffix (mirrors the master Stats panel's days-left value discipline but
    // without the "days" text — the label already conveys the unit).
    const daysLeftState = d.daysLeftEntityId ? c.getState(d.daysLeftEntityId) : '';
    let daysLeftDisplay = '-';
    if (daysLeftState && daysLeftState !== 'unknown' && daysLeftState !== 'unavailable' && daysLeftState !== 'None') {
      const num = parseFloat(daysLeftState);
      if (!isNaN(num)) daysLeftDisplay = c.formatInteger(daysLeftState);
    }

    // Column 2 — averages.
    const avg7 = d.avg7EntityId ? c.getState(d.avg7EntityId) : '';
    const avg7Display = (avg7 && avg7 !== 'unknown' && avg7 !== 'unavailable') ? avg7 : '-';
    const { hasDaysSensor, daysSince } = c.drinkDaysSinceReveal(d.avg365EntityId);
    const avg365 = d.avg365EntityId ? c.getState(d.avg365EntityId) : '';
    const avg365Display = (avg365 && avg365 !== 'unknown' && avg365 !== 'unavailable') ? avg365 : '-';
    // Trailing dynamic label: "Running N-Day Avg" until 365 days, then "Year Avg".
    const trailingLabel = (hasDaysSensor && daysSince < 365)
      ? localize(this._lang, 'stats.avg_running', { days: String(daysSince) })
      : localize(this._lang, 'stats.avg_yearly');

    return html`
      <div class="inv-row">
        <div
          class="stat-pill ${canRefill ? 'clickable' : ''}"
          role=${canRefill ? 'button' : nothing}
          tabindex=${canRefill ? '0' : nothing}
          aria-label=${localize(this._lang, 'dialog.refill.aria')}
          @click=${canRefill && d.addStockEntityId ? () => c.showRefillDialogFor(d.addStockEntityId, d.name) : null}
          @keydown=${canRefill ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => d.addStockEntityId && c.showRefillDialogFor(d.addStockEntityId, d.name)) : null}
        >
          <div class="stat-pill-header">
            <ha-icon icon="${substanceIcon}"></ha-icon>
            <div class="stat-text">
              <div class="stat-line">
                <span class="stat-label">${d.name} ${localize(this._lang, 'inventory.left')}</span>
                <span class="stat-value">${stockDisplay}</span>
              </div>
              <div class="stat-line">
                <span class="stat-sublabel">${localize(this._lang, 'stats.days_left_est')}</span>
                <span class="stat-subvalue">${daysLeftDisplay}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="avg-cell"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => c.showDeviceInfoFor(d.deviceId, d.name)}
             @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showDeviceInfoFor(d.deviceId, d.name))}
        >
          <div class="avg-line">
            <span class="avg-label">${localize(this._lang, 'inventory.avg_7_day')}</span>
            <span class="avg-value">${avg7Display}</span>
          </div>
          <div class="avg-line">
            <span class="avg-label">${trailingLabel}</span>
            <span class="avg-value">${avg365Display}</span>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
    /* ── Container parity with the Stats pane (.pane-stats) ── */
    .pane-inventory {
      display: flex;
      flex-direction: column;
    }

    .inv-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      text-align: center;
    }
    .inv-empty ha-icon { --mdc-icon-size: 40px; opacity: 0.4; }

    /* ── .inv-grid — mirrors the Stats .stats-grid: 2-col grid, 8px gap ── */
    .inv-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    /* One drink = two adjacent grid cells (col-1 + col-2). The .inv-row
       wrapper spans both columns and holds its own 2-col sub-grid so the
       pair stays together while the outer grid governs inter-pair spacing. */
    .inv-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      grid-column: 1 / -1;
    }

    /* ── .stat-pill + .avg-cell — both adopt the Stats .stat-cell visual
       language: padding 10px 8px, border-radius 10px, primary-tinted
       background rgba(...,0.05), 4px internal gap, column flex. This makes
       the Inventory boxes the same size + spacing as the Stats boxes. */
    .stat-pill {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 10px 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      transition: background 0.15s ease;
    }
    .stat-pill.clickable {
      cursor: pointer;
    }
    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .stat-pill.clickable:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }

    /* ── stat-pill header row: icon + 2-line text block. The icon stays at
       the left (its exact current position) and align-items:center on the
       header row keeps it vertically centered against the 2-line text
       block. The .stat-text wrapper takes flex:1 so the text fills the
       space to the right of the icon. Each .stat-line is a space-between
       row. Sizing matches the Stats .stat-cell: label 14px uppercase (but
       the drink name keeps natural case per the proper-noun rule), value
       18px weight-600. The 2nd line ("Est. days left" + value) uses the
       SAME sizes as the 1st line per user request (label 15px, value 18px)
       so both lines are equally prominent. */
    .stat-pill-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stat-pill-header ha-icon {
      --mdc-icon-size: 24px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }
    .stat-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      line-height: 1.1;
      flex: 1;
      min-width: 0;
    }
    .stat-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .stat-label {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.3px;
    }
    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }
    /* 2nd line — same sizes as the 1st line (label 15px, value 18px). */
    .stat-sublabel {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.3px;
    }
    .stat-subvalue {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    /* ── .avg-cell — col-2 averages box, same .stat-cell visual language. */
    .avg-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      line-height: 1.1;
      padding: 10px 8px;
      border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .avg-cell:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .avg-cell:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .avg-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .avg-label {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
    }
    .avg-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    @media (max-width: 380px) {
      .inv-grid { grid-template-columns: 1fr; }
      .inv-row { grid-template-columns: 1fr; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-inventory-panel': AxDoseInventoryPanel;
  }
}