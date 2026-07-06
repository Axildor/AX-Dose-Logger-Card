// ──────────────────────────────────────────────
// AX Dose Logger Card — Drinks Pane (Master Tracker, Pane "drinks")
// ──────────────────────────────────────────────
// Shown when the selected device is a Master Tracker (Caffeine Tracker /
// Alcohol Tracker). Layout mirrors the Daily pane exactly:
//   - Centered .drinks-title (20px, weight 600, opens device-info dialog)
//     — identical to Daily's .med-name.
//   - .daily-main two-column row:
//       Left  (.log-drink-btn, flex:1): tinted-primary "Log Drink" button
//              styled like Daily's .take-pill-btn.safe (icon + label column).
//       Right (.stats-column, flex:1, gap 10px): two .stat-pill boxes
//              using Daily's transparency + 15px uppercase label / 18px
//              weight-600 value:
//                Top    "In Body"         — entities.amountInBody + unit (mg/g)
//                Bottom "Sleep Disruption" — entities.sleepDisruption state
//   No chips row (Drinks master has no chip config). Estimated Low Time was
//   intentionally removed to keep exactly 2 right boxes, identical to Daily.

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-drinks-panel')
export class AxDoseDrinksPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
  @property({ attribute: false }) hass?: AxDoseLoggerHass;

  private get _lang(): string {
    return this.controller.lang;
  }

  render() {
    const c = this.controller;
    const e = this.entities;
    const substance = e.substance;
    const substanceLabel = substance === 'alcohol'
      ? localize(this._lang, 'drinks.alcohol')
      : localize(this._lang, 'drinks.caffeine');

    // Default icon by substance — mirrors Daily's per-state icon convention.
    // A user-configurable log_drink_icon override is planned but not yet wired
    // into the config schema; this default covers both substances.
    const logDrinkIcon = substance === 'alcohol'
      ? 'mdi:glass-mug-variant'
      : 'mdi:coffee';

    // "Last" counter — identical to Daily's take-sub. The resolver populates
    // entities.lastDose for drink masters from the pk_model body-mass sensor's
    // last_dose_time attribute (see ax-dose-logger-card.ts), so the controller
    // helper works here without any backend change. Drink masters have no
    // Next/Overdue concept (no schedule), so the sub-line is the single
    // "Last: …" segment, matching Daily's simplest branch.
    const timeSince = c.computeTimeSinceLastDose(e);

    // In Body value — master body-mass sensor + substance unit (mg/g).
    // Card displays the value rounded to 0 decimals (integer); the backend
    // sensor stores 1 decimal (see drink_master.py), but the card box shows
    // a clean integer for compactness.
    const unit = c.getStrengthUnit(e);
    const rawBody = e.amountInBody ? c.getState(e.amountInBody) : '';
    const bodyKnown = !!(e.amountInBody && rawBody && rawBody !== 'unknown' && rawBody !== 'unavailable');
    const bodyNum = parseFloat(rawBody);
    const inBodyValue = bodyKnown
      ? `${isNaN(bodyNum) ? rawBody : Math.round(bodyNum)} ${unit}`
      : localize(this._lang, 'daily.na');

    // Sleep Disruption readout (None/Low/Moderate/High) — title-cased first
    // letter, matching the swapped Safe-to-Take box display convention.
    const rawSleep = e.sleepDisruption ? c.getState(e.sleepDisruption) : '';
    const sleepKnown = !!(e.sleepDisruption && rawSleep && rawSleep !== 'unknown' && rawSleep !== 'unavailable');
    const sleepValue = sleepKnown
      ? (rawSleep.charAt(0).toUpperCase() + rawSleep.slice(1))
      : localize(this._lang, 'daily.na');

    return html`
      <div class="pane pane-drinks">
        <div class="drinks-title"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => c.showDeviceInfo()}
             @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showDeviceInfo())}
        >${substanceLabel}</div>

        <div class="daily-main">
          <button
            class="log-drink-btn safe"
            aria-label=${localize(this._lang, 'drinks.log_drink')}
            ?disabled=${!substance}
            @click=${() => substance && c.showLogDrinkDialog(substance)}
          >
            <ha-icon icon="${logDrinkIcon}"></ha-icon>
            <span class="take-label">${localize(this._lang, 'drinks.log_drink')}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span></span>
          </button>

          <div class="stats-column">
            <div class="stat-pill"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'drinks.in_body')}
                 @click=${e.amountInBody ? () => c.openMoreInfo(e.amountInBody!) : null}
                 @keydown=${e.amountInBody ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.openMoreInfo(e.amountInBody!)) : null}>
              <ha-icon icon="mdi:chart-bell-curve"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'drinks.in_body')}</span>
              <span class="stat-value">${inBodyValue}</span>
            </div>
            <div class="stat-pill"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'drinks.disruption')}
                 @click=${e.sleepDisruption && substance ? () => c.showSleepDisruptionDialog(substance!) : null}
                 @keydown=${e.sleepDisruption && substance ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showSleepDisruptionDialog(substance!)) : null}>
              <ha-icon icon="mdi:sleep"></ha-icon>
              <span class="stat-label">${localize(this._lang, 'drinks.disruption')}</span>
              <span class="stat-value">${sleepValue}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .pane-drinks {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .drinks-title {
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      text-align: center;
      cursor: pointer;
    }

    /* ── .daily-main / .stats-column — verbatim from daily-panel.ts ── */
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

    /* ── Log Drink button — styled like Daily's .take-pill-btn.safe ── */
    .log-drink-btn {
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

    .log-drink-btn:active {
      transform: scale(0.96);
    }

    .log-drink-btn.safe {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
    }

    .log-drink-btn.safe:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .log-drink-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .log-drink-btn ha-icon {
      --mdc-icon-size: 28px;
      margin-bottom: 2px;
    }

    .take-label {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 550;
    }

    /* ── .take-sub — verbatim from daily-panel.ts ── */
    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: 450;
      opacity: 0.9;
    }

    .take-sub-segment {
      white-space: nowrap;
    }

    /* ── .stat-pill / .stat-label / .stat-value — verbatim from daily-panel.ts ── */
    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
      cursor: pointer;
    }

    .stat-pill:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .stat-pill ha-icon {
      --mdc-icon-size: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
    }

    .stat-label {
      font-size: calc(15px + var(--pill-text-offset, 0px));
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-drinks-panel': AxDoseDrinksPanel;
  }
}