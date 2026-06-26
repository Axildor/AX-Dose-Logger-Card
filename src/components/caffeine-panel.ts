// ──────────────────────────────────────────────
// AX Dose Logger Card — Caffeine Pane (Pane 6, scaffold)
// ──────────────────────────────────────────────
// New pane reserved for a future Caffeine tracking feature. This is a scaffold
// only for Scope 3 — it proves the extraction pattern on a brand-new panel and
// reserves the nav slot. Real feature content (caffeine intake logging, half-life
// graph, daily totals) is a separate task that needs a backend spec.

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-caffeine-panel')
export class AxDoseCaffeinePanel extends LitElement {
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
    return html`
      <div class="pane pane-caffeine">
        <div class="caffeine-placeholder">
          <ha-icon icon="mdi:coffee"></ha-icon>
          <span>${localize(this._lang, 'caffeine.placeholder')}</span>
        </div>
      </div>
    `;
  }

  static styles = css`
    .pane-caffeine {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .caffeine-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      text-align: center;
    }

    .caffeine-placeholder ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-caffeine-panel': AxDoseCaffeinePanel;
  }
}