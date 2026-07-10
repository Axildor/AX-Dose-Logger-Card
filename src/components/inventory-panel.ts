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
    // Column 1 — refill box.
    const stockState = d.stockEntityId ? c.getState(d.stockEntityId) : '';
    const stockNum = parseInt(stockState, 10);
    const stockDisplay = isNaN(stockNum) ? '-' : c.formatInteger(String(stockNum));
    const canRefill = !!d.addStockEntityId;

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
          <ha-icon icon="${substanceIcon}"></ha-icon>
          <span class="stat-label">${d.name}</span>
          <span class="stat-value">${stockDisplay}</span>
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
    /* ── Container parity with .pane-daily / .pane-drinks ── */
    .pane-inventory {
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    .inv-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .inv-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    /* ── .stat-pill — verbatim from daily-panel.ts / drinks-panel.ts ──
       (primary-tinted transparency, no border, 12px 14px padding, 8px gap,
       20px primary-tinted icon at opacity 0.7). */
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
    }
    .stat-pill.clickable {
      cursor: pointer;
    }
    .stat-pill.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .stat-pill.clickable:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    /* ── .stat-label — Daily/Drinks parity for size/color/letter-spacing,
       with a per-element case override: text-transform: uppercase is
       intentionally OMITTED because col-1's label is the drink's configured
       proper-noun name ("Coffee", "Espresso"), which should keep its
       natural case. The sub-labels in .avg-cell below keep natural case
       too (they were never uppercased). */
    .stat-label {
      flex: 1;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      letter-spacing: 0.5px;
    }

    /* ── .stat-value — verbatim from daily-panel.ts / drinks-panel.ts ── */
    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    /* ── .avg-cell — col-2 averages box. No Daily equivalent; adopts the
       same primary-tinted transparency surface as .stat-pill for parity,
       keeps its two-row .avg-line internal layout. Padding/gap compressed
       (12px→10px / 6px→4px) and .avg-value sized 18px→16px so the cell's
       natural height matches the Stats panel's .stat-cell (~72px); the
       col-1 .stat-pill stretches to the same height via grid
       align-items: stretch, so both Inventory boxes match the Stats box
       height. */
    .avg-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 4px;
      padding: 10px 14px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      cursor: pointer;
    }
    .avg-cell:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }
    .avg-cell:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .avg-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .avg-label {
      font-size: calc(13px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
    }
    /* ── .avg-value — sized to match .stat-value for visual parity ── */
    .avg-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      margin-left: auto;
    }

    @media (max-width: 380px) {
      .inv-row { grid-template-columns: 1fr; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-inventory-panel': AxDoseInventoryPanel;
  }
}