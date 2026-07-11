// ──────────────────────────────────────────────
// AX Dose Logger Card — Tracking Pane (Pane 5)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane5.
// Renders one ha-slider per tracking metric with a Set/Not-set badge and value.
// The slider @change calls controller.handleTrackingChange, which owns the
// _pendingTracking race-guard + the override-dialog state on the container —
// so this panel holds only the template + CSS; no state machine lives here.

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-tracking-panel')
export class AxDoseTrackingPanel extends LitElement {
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

  render() {
    const c = this.controller;
    const metrics = this.entities.metrics;
    if (!metrics.length) {
      return html`
        <div class="tracking-panel">
          <div class="tracking-empty">${localize(this._lang, 'tools.empty')}</div>
        </div>
      `;
    }

    return html`
      <div class="tracking-panel">
        ${metrics.map((m) => {
          const state = c.getState(m.entityId);
          const attrs = c.getAttr(m.entityId, 'logged_today');
          const isLogged = attrs === true || attrs === 'True' || attrs === 'true';
          const currentValue = state === 'unavailable' || state === 'unknown' ? null : parseFloat(state);
          const displayValue = currentValue !== null ? currentValue : 0;
          const todayLabel = localize(this._lang, 'tracking.today_label', { metric: m.label });

          return html`
            <div class="tracking-row">
              <div class="tracking-header">
                <span class="tracking-label">${todayLabel}</span>
                ${isLogged
                  ? html`<span class="tracking-badge tracking-badge--set">${localize(this._lang, 'tracking.set_today')}</span>`
                  : html`<span class="tracking-badge tracking-badge--unset">${localize(this._lang, 'tracking.not_set')}</span>`
                }
              </div>
              <div class="tracking-slider-row">
                <div class="tracking-slider-wrapper">
                  <ha-slider
                    .value=${displayValue}
                    .min=${0}
                    .max=${10}
                    .step=${1}
                    .disabled=${false}
                    pin
                    @change=${(e: Event) => this.controller.handleTrackingChange(m, (e.target as HTMLInputElement).value)}
                  ></ha-slider>
                  <div class="tracking-scale">
                    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => html`
                      <span class="tracking-scale-tick">${n}</span>
                    `)}
                  </div>
                </div>
                <span class="tracking-value">${currentValue !== null ? currentValue : '—'}</span>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  static styles = css`
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
    .tracking-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0;
    }

    .tracking-empty {
      text-align: center;
      color: var(--secondary-text-color, #666);
      font-size: calc(14px + var(--pill-text-offset, 0px));
      padding: 24px 0;
    }

    .tracking-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .tracking-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tracking-label {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    .tracking-badge {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
    }

    .tracking-badge--set {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .tracking-badge--unset {
      background: rgba(var(--rgb-secondary-text-color, 102, 102, 102), 0.12);
      color: var(--secondary-text-color, #666);
    }

    .tracking-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tracking-slider-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .tracking-slider-wrapper ha-slider {
      width: 100%;
    }

    .tracking-value {
      min-width: 28px;
      text-align: center;
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    .tracking-scale {
      display: flex;
      justify-content: space-between;
      /* Asymmetric padding aligns tick centers with slider thumb centers.
         The ha-slider thumb sits about 10px from each track edge at min and
         max. Single-digit ticks are about 8px wide (center at 4px), so
         padding-left 6px places the 0 center at 10px. The 10 tick is two
         digits (about 14px, center at 7px), so padding-right 2px shifts it
         right to match the thumb at max. */
      padding-left: 6px;
      padding-right: 2px;
      margin-top: -2px;
      box-sizing: border-box;
    }

    .tracking-scale-tick {
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #888);
      text-align: center;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-tracking-panel': AxDoseTrackingPanel;
  }
}