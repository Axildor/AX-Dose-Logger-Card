// ──────────────────────────────────────────────
// AX Dose Logger Card — Tools Pane (Pane 4)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane4.
// Renders the maintenance button grid (Adherence Tools + General Tools). Each
// button click opens a shared confirmation dialog via controller.openToolsDialog
// (the dialog itself stays on the container, which owns _toolsDialog state).
// The onConfirm closure (the actual button.press service call) is authored here
// because it's the panel's job; the container just hosts the dialog surface.

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass, DrinkInfo } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-tools-panel')
export class AxDoseToolsPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
  // hass is passed down as a reactive prop so the panel re-renders on every
  // HA state update (HA replaces the top-level hass object reference on each
  // tick). Without this, the panel only re-rendered when its element was
  // remounted on a pane switch, so live changes (e.g. take-pill) did not
  // appear until the user navigated away and back.
  @property({ attribute: false }) hass?: AxDoseLoggerHass;

  private get _lang(): string {
    return this.controller.lang;
  }

  // Each handler opens the shared tools confirmation dialog (hosted by the
  // container) with a localized title + descriptor + an onConfirm closure that
  // fires the matching button.press service call. Mirrors the original
  // _handleAdherenceReset / _handleAdherenceCover / _handleResetHistory /
  // _handleUndoDoseConfirm methods on the container.
  private _handleAdherenceReset(entities: ResolvedEntities): void {
    if (!this.controller.hass || !entities.adherenceResetButton) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.reset_adherence'),
      localize(this._lang, 'tools.desc.reset_adherence'),
      () => {
        this.controller.hass!.callService('button', 'press', { entity_id: entities.adherenceResetButton });
      },
    );
  }

  private _handleAdherenceCover(entities: ResolvedEntities): void {
    if (!this.controller.hass || !entities.adherenceCoverButton) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.mark_adherence_taken'),
      localize(this._lang, 'tools.desc.mark_adherence_taken'),
      () => {
        this.controller.hass!.callService('button', 'press', { entity_id: entities.adherenceCoverButton });
      },
    );
  }

  private _handleResetHistory(entities: ResolvedEntities): void {
    if (!this.controller.hass || !entities.resetButton) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.reset_history'),
      localize(this._lang, 'tools.desc.reset_history'),
      () => {
        this.controller.hass!.callService('button', 'press', { entity_id: entities.resetButton });
      },
    );
  }

  private _handleUndoDoseConfirm(entities: ResolvedEntities): void {
    if (!this.controller.hass || !entities.undoButton) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.undo_dose'),
      localize(this._lang, 'tools.desc.undo_dose'),
      () => {
        this.controller.hass!.callService('button', 'press', { entity_id: entities.undoButton });
      },
    );
  }

  // ── Master Tracker per-granular-drink tools ──
  // When the selected device is a Master Tracker, render a per-granular-drink
  // list of Undo + Reset buttons (one row per granular drink of the
  // substance). Each action opens the shared tools confirmation dialog.
  private _handleDrinkUndo(drink: DrinkInfo): void {
    if (!this.controller.hass || !drink.undoButtonEntityId) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.undo_drink', { name: drink.name }),
      localize(this._lang, 'tools.desc.undo_drink'),
      () => { this.controller.undoDrink(drink.undoButtonEntityId!); },
    );
  }

  private _handleDrinkReset(drink: DrinkInfo): void {
    if (!this.controller.hass || !drink.resetButtonEntityId) return;
    this.controller.openToolsDialog(
      localize(this._lang, 'tools.reset_drink', { name: drink.name }),
      localize(this._lang, 'tools.desc.reset_drink'),
      () => { this.controller.resetDrink(drink.resetButtonEntityId!); },
    );
  }

  private _renderMasterTools(): unknown {
    const substance = this.entities.substance;
    if (!substance) {
      return html`<div class="tools-panel"><div class="tools-empty">${localize(this._lang, 'tools.empty')}</div></div>`;
    }
    const drinks = this.controller.getDrinksOfSubstance(substance);
    const substanceIcon = substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee';
    if (drinks.length === 0) {
      return html`<div class="tools-panel"><div class="tools-empty">${localize(this._lang, 'tools.empty')}</div></div>`;
    }
    return html`
      <div class="tools-panel">
        <div class="tools-section-header">${localize(this._lang, 'tools.drinks_header')}</div>
        ${drinks.map((d) => html`
          <div class="drink-tool-row">
            <div class="drink-tool-name">
              <ha-icon icon="${substanceIcon}"></ha-icon>
              <span>${d.name}</span>
            </div>
            <div class="drink-tool-actions">
              ${d.undoButtonEntityId ? html`
                <button class="tool-btn danger drink-tool-btn" @click=${() => this._handleDrinkUndo(d)}>
                  <ha-icon icon="mdi:undo"></ha-icon>
                  <span>${localize(this._lang, 'tools.undo_dose')}</span>
                </button>
              ` : nothing}
              ${d.resetButtonEntityId ? html`
                <button class="tool-btn danger drink-tool-btn" @click=${() => this._handleDrinkReset(d)}>
                  <ha-icon icon="mdi:history"></ha-icon>
                  <span>${localize(this._lang, 'tools.reset_history')}</span>
                </button>
              ` : nothing}
            </div>
          </div>
        `)}
      </div>
    `;
  }

  render() {
    // Master Tracker branch: per-granular-drink Undo/Reset list.
    if (this.entities.deviceType === 'drink_master') {
      return this._renderMasterTools();
    }

    const e = this.entities;
    const hasAdhTools = !!(e.adherenceResetButton || e.adherenceCoverButton);
    const hasGenTools = !!(e.resetButton || e.undoButton);

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
            ${e.adherenceResetButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleAdherenceReset(e)}
              >
                <ha-icon icon="mdi:percent-circle-outline"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_adherence')}</span>
              </button>
            ` : nothing}
            ${e.adherenceCoverButton ? html`
              <button
                class="tool-btn"
                @click=${() => this._handleAdherenceCover(e)}
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
            ${e.resetButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleResetHistory(e)}
              >
                <ha-icon icon="mdi:history"></ha-icon>
                <span>${localize(this._lang, 'tools.reset_history')}</span>
              </button>
            ` : nothing}
            ${e.undoButton ? html`
              <button
                class="tool-btn danger"
                @click=${() => this._handleUndoDoseConfirm(e)}
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

  static styles = css`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
    .tools-panel {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tools-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      padding: 24px 8px;
    }

    .tools-section-header {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
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
      padding: 12px 14px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      color: var(--primary-text-color, #222);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }

    .tool-btn ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .tool-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .tool-btn:active {
      transform: scale(0.98);
    }

    .tool-btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.06);
    }

    .tool-btn.danger ha-icon {
      color: var(--error-color, #db4437);
    }

    .tool-btn.danger:hover {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
    }

    /* ── Master Tracker per-granular-drink rows ── */
    .drink-tool-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      flex-wrap: wrap;
    }
    .drink-tool-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color);
    }
    .drink-tool-name ha-icon {
      --mdc-icon-size: 22px;
      color: var(--primary-color);
    }
    .drink-tool-actions {
      display: flex;
      gap: 8px;
    }
    .drink-tool-btn {
      flex-direction: row;
      padding: 8px 12px;
      font-size: calc(13px + var(--pill-text-offset, 0px));
    }
    .drink-tool-btn ha-icon { --mdc-icon-size: 20px; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-tools-panel': AxDoseToolsPanel;
  }
}