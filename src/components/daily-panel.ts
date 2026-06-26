// ──────────────────────────────────────────────
// AX Dose Logger Card — Daily Pane (Pane 1)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane1.
// The highest event-surface pane: med-name (device-info dialog), take-pill
// button (press / override dialog), safe-to-take box (tap/hold/double-tap
// actions), pills-left stat-pill (refill dialog), custom chips. Every action
// calls back into the controller so the container owns the dialog state.

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ActionConfig } from 'custom-card-helpers';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-daily-panel')
export class AxDoseDailyPanel extends LitElement {
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
    const e = this.entities;
    // Button limit logic — always uses the REAL pills_safe_to_take sensor,
    // never the display entity, so swapping the box doesn't affect safety.
    const safeState = c.getState(e.pillsSafeToTake);
    const safeCount = parseInt(safeState, 10);
    const isLimitReached = !isNaN(safeCount) && safeCount <= 0;
    const timeSince = c.computeTimeSinceLastDose(e);
    const nextDose = c.computeNextDose(e);
    const overTime = c.computeOverTime(e);
    const pillsLeft = c.getState(e.pillsLeft);
    const chipEntities = c.getChipEntities();

    // Display entity for the Safe to Take box (may differ from the real sensor).
    const displayEntity = c.getSafeBoxEntity(e);
    const displayState = c.getState(displayEntity);
    const displayIsUnknown = displayState === 'unknown' || displayState === 'unavailable' || displayState === undefined;
    const isSwapped = !!(c.config?.safe_to_take_entity && c.config.safe_to_take_entity !== e.pillsSafeToTake);

    // Action config for the Safe to Take box. When the user configured custom
    // tap/hold/double-tap actions, handleAction fires them. When no tap_action
    // is configured, the click falls back to more-info on the display entity
    // (v1 default behavior). hasHold/hasDoubleClick gate the action handler so
    // a plain click doesn't trigger hold/double-tap logic.
    const safeBoxActionConfig: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig } = {
      entity: displayEntity,
      tap_action: c.config?.safe_to_take_tap_action,
      hold_action: c.config?.safe_to_take_hold_action,
      double_tap_action: c.config?.safe_to_take_double_tap_action,
    };
    const hasCustomTap = !!c.config?.safe_to_take_tap_action;
    const hasHold = !!c.config?.safe_to_take_hold_action;
    const hasDblClick = !!c.config?.safe_to_take_double_tap_action;
    const safeBoxClickable = !!displayEntity || hasCustomTap || hasHold || hasDblClick;

    return html`
      <div class="pane pane-daily">
        <div class="med-name"
             role="button" tabindex="0"
             aria-label=${localize(this._lang, 'dialog.device_info.aria')}
             @click=${() => c.showDeviceInfo()}
             @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showDeviceInfo())}
        >${c.getMedName(e)}</div>

        <div class="daily-main">
          <button
            class="take-pill-btn ${isLimitReached ? 'danger' : 'safe'}"
            aria-label=${isLimitReached
              ? localize(this._lang, 'aria.take_pill_limit')
              : (c.config?.take_pill_label || localize(this._lang, 'aria.take_pill_safe'))}
            @click=${() => c.handleTakePill(e)}
          >
            <ha-icon icon="${isLimitReached ? 'mdi:alert' : (c.config?.take_pill_icon || 'mdi:pill')}"></ha-icon>
            <span class="take-label">${isLimitReached ? localize(this._lang, 'daily.limit_reached') : (c.config?.take_pill_label || localize(this._lang, 'daily.take_pill'))}</span>
            <span class="take-sub">${isLimitReached
              ? (overTime
                ? html`<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span> \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
                : html`<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span> \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.next')}: ${nextDose}</span>`)
              : (overTime
                ? html`<span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
                : html`<span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span>`)}</span>
          </button>

          <div class="stats-column">
            <div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${safeBoxClickable ? '0' : nothing}
                 aria-label=${localize(this._lang, 'daily.safe_to_take')}
                 @click=${safeBoxClickable ? (ev: MouseEvent) => c.handleSafeBoxAction(ev, 'tap', safeBoxActionConfig, displayEntity) : null}
                 @keydown=${safeBoxClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', safeBoxActionConfig, displayEntity); } : null}
                 @dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', safeBoxActionConfig, displayEntity) : null}>
              <ha-icon icon="mdi:shield-check"></ha-icon>
              <span class="stat-label">${c.config?.safe_to_take_label || localize(this._lang, 'daily.safe_to_take')}</span>
              <span class="stat-value">${displayIsUnknown
                ? localize(this._lang, 'daily.na')
                : (isSwapped ? displayState : c.formatInteger(safeState))}</span>
            </div>
            <div class="stat-pill ${e.addRefill ? 'clickable' : ''}"
                 role="button"
                 tabindex="0"
                 aria-label=${localize(this._lang, 'dialog.refill.aria')}
                 @click=${e.addRefill ? () => c.showRefillDialog() : null}
                 @keydown=${e.addRefill ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showRefillDialog()) : null}>
              <ha-icon icon="mdi:pill"></ha-icon>
              <span class="stat-label">${c.config?.pills_left_label || localize(this._lang, 'daily.pills_left')}</span>
              <span class="stat-value">${pillsLeft === 'unavailable' ? '-' : c.formatInteger(pillsLeft)}</span>
            </div>
          </div>
        </div>

        ${chipEntities.length > 0
          ? html`
              <div class="chips-row">
                ${chipEntities.map((chip) => {
                  const chipState = c.getState(chip.entityId);
                  const chipName = chip.label
                    || c.hass?.states[chip.entityId]?.attributes?.friendly_name
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

  static styles = css`
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

    .take-sub-segment {
      white-space: nowrap;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-daily-panel': AxDoseDailyPanel;
  }
}