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
  // 30s tick from the container — a reactive trigger so the panel re-renders
  // to refresh "Xh XXm" countdowns even when hass/entities/controller refs are
  // unchanged. The panel doesn't read this value; it just needs to change.
  @property({ attribute: false }) tick: number = 0;

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
    const chipEntities = c.getChipEntities();

    // Display entity for the Pills Left box. Priority:
    //   1. pills_left_show_days_left === true → backend days_left sensor
    //   2. pills_left_entity configured (≠ default sensor) → user's entity
    //   3. default → pills_left number entity
    // (controller.getPillsLeftBoxEntity resolves this; mirrored on the Safe to
    // Take box pattern. The days-left toggle wins over an arbitrary entity
    // swap so the two overrides are mutually unambiguous.)
    const pillsLeftShowDays = c.config?.pills_left_show_days_left === true;
    const pillsLeftDisplayEntity = c.getPillsLeftBoxEntity(e);
    const pillsLeftDisplayState = c.getState(pillsLeftDisplayEntity);
    const pillsLeftUnknown = pillsLeftDisplayState === 'unknown' || pillsLeftDisplayState === 'unavailable' || pillsLeftDisplayState === undefined;
    const pillsLeftIsSwapped = !!(c.config?.pills_left_entity && c.config.pills_left_entity !== e.pillsLeft && !pillsLeftShowDays);

    // Action config for the Pills Left box. When the user configured custom
    // tap/hold/double-tap actions, handleAction fires them. When no tap_action
    // is configured, the tap falls back to the Refill dialog (the card-internal
    // default for ALL display modes — "Refill dialog" can't be expressed in the
    // ui_action dropdown, so it stays the built-in default that a custom action
    // overrides), then to more-info on the display entity. hasHold/hasDblClick
    // gate the action handler so a plain click doesn't trigger them.
    const pillsLeftActionConfig: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig } = {
      entity: pillsLeftDisplayEntity,
      tap_action: c.config?.pills_left_tap_action,
      hold_action: c.config?.pills_left_hold_action,
      double_tap_action: c.config?.pills_left_double_tap_action,
    };
    const plHasCustomTap = !!c.config?.pills_left_tap_action;
    const plHasHold = !!c.config?.pills_left_hold_action;
    const plHasDblClick = !!c.config?.pills_left_double_tap_action;
    const pillsLeftClickable = plHasCustomTap || plHasHold || plHasDblClick || !!pillsLeftDisplayEntity || !!e.addRefill;
    // Tap fallback: Refill dialog when an add-refill entity exists (retain the
    // existing refill-by-tap UX across all display modes), else more-info on the
    // display entity.
    const pillsLeftTapFallback = () => {
      if (e.addRefill) {
        c.showRefillDialog();
      } else if (pillsLeftDisplayEntity) {
        c.openMoreInfo(pillsLeftDisplayEntity);
      }
    };
    // Default label/icon switch to the days-left variants when the toggle is on.
    const pillsLeftDefaultLabel = pillsLeftShowDays
      ? localize(this._lang, e.daysLeftEst ? 'stats.days_left_est' : 'stats.days_left')
      : localize(this._lang, 'daily.pills_left');
    const pillsLeftDefaultIcon = pillsLeftShowDays ? 'mdi:calendar-month' : 'mdi:pill';

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
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span>${overTime
              ? html` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
              : (nextDose !== 'Unavailable'
                ? html` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.next')}: ${nextDose}</span>`
                : nothing)}</span>
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
              <ha-icon icon="${c.config?.safe_to_take_icon || 'mdi:shield-check'}"></ha-icon>
              <span class="stat-label">${c.config?.safe_to_take_label || localize(this._lang, 'daily.safe_to_take')}</span>
              <span class="stat-value">${displayIsUnknown
                ? localize(this._lang, 'daily.na')
                : (isSwapped
                  ? (displayState
                    ? (isNaN(parseFloat(displayState))
                      ? displayState.charAt(0).toUpperCase() + displayState.slice(1)
                      : c.formatInteger(displayState) + (c.getAttr(displayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(displayEntity, 'unit_of_measurement') : ''))
                    : '')
                  : c.formatInteger(safeState))}</span>
            </div>
            <div class="stat-pill ${pillsLeftClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${pillsLeftClickable ? '0' : nothing}
                 aria-label=${c.config?.pills_left_label || pillsLeftDefaultLabel}
                 @click=${pillsLeftClickable ? (ev: MouseEvent) => c.handlePillsLeftBoxAction(ev, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback) : null}
                 @keydown=${pillsLeftClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handlePillsLeftBoxAction(null, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback)) : null}
                 @contextmenu=${plHasHold ? (ev: Event) => { ev.preventDefault(); c.handlePillsLeftBoxAction(null, 'hold', pillsLeftActionConfig, pillsLeftDisplayEntity); } : null}
                 @dblclick=${plHasDblClick ? () => c.handlePillsLeftBoxAction(null, 'double_tap', pillsLeftActionConfig, pillsLeftDisplayEntity) : null}>
              <ha-icon icon="${c.config?.pills_left_icon || pillsLeftDefaultIcon}"></ha-icon>
              <span class="stat-label">${c.config?.pills_left_label || pillsLeftDefaultLabel}</span>
              <span class="stat-value">${pillsLeftUnknown
                ? localize(this._lang, 'daily.na')
                : (pillsLeftShowDays
                  ? c.formatInteger(pillsLeftDisplayState)
                  : (pillsLeftIsSwapped
                    ? (pillsLeftDisplayState
                      ? (isNaN(parseFloat(pillsLeftDisplayState))
                        ? pillsLeftDisplayState.charAt(0).toUpperCase() + pillsLeftDisplayState.slice(1)
                        : c.formatInteger(pillsLeftDisplayState) + (c.getAttr(pillsLeftDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(pillsLeftDisplayEntity, 'unit_of_measurement') : ''))
                      : '')
                    : (pillsLeftDisplayState === 'unavailable' ? '-' : c.formatInteger(pillsLeftDisplayState))))}</span>
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
                  const chipUnit = c.getAttr(chip.entityId, 'unit_of_measurement');
                  const chipDeviceClass = c.getAttr(chip.entityId, 'device_class');
                  // Icon: configured override > entity's own icon attribute > neutral default.
                  // Only rendered when the per-chip show_icon toggle is on (default off).
                  const chipIcon = chip.icon
                    || c.hass?.states[chip.entityId]?.attributes?.icon
                    || 'mdi:chip';
                  // Device-class-aware value: timestamp sensors render HH:MM (24-hour)
                  // so a TIMESTAMP-class entity surfaced as a chip does not show its
                  // year (the formatInteger parseFloat bug — parseFloat('2026-...') → 2026).
                  // Mirrors the Disruption box low_timestamp mode + the Stats panel row.
                  let chipValue: string;
                  if (chipDeviceClass === 'timestamp') {
                    const dt = new Date(chipState);
                    chipValue = isNaN(dt.getTime())
                      ? localize(this._lang, 'daily.na')
                      : dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
                  } else {
                    chipValue = c.formatInteger(chipState) + (chipUnit ? ' ' + chipUnit : '');
                  }
                  const chipActionCfg = {
                    entity: chip.entityId,
                    tap_action: chip.tapAction,
                    hold_action: chip.holdAction,
                    double_tap_action: chip.doubleTapAction,
                  };
                  const hasHold = !!chip.holdAction;
                  const hasDblClick = !!chip.doubleTapAction;
                  return html`
                    <div class="chip clickable${chip.showIcon ? ' with-icon' : ''}"
                      role="button"
                      tabindex="0"
                      aria-label=${chipName}
                      @click=${(ev: MouseEvent) => c.handleChipAction(ev, 'tap', chipActionCfg, chip.entityId)}
                      @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
                      ${chip.showIcon
                        ? html`<ha-icon icon=${chipIcon} class="chip-icon"></ha-icon>`
                        : nothing}
                      <span class="chip-name">${chipName}</span>
                      <span class="chip-value">${chipValue}</span>
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
    /* Bold-text catch-all: sets a base font-weight so text without an explicit
       font-weight declaration still inherits the boost when bold_text is on.
       --pill-font-weight-boost is 1.5 (on) or 1 (off), injected on <ha-card>. */
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
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
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
    }

    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(450 * var(--pill-font-weight-boost, 1));
      opacity: 0.9;
    }

    .take-sub-segment {
      white-space: nowrap;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
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
      line-height: 1.2;
      min-height: 2.6em;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      margin-left: auto;
      line-height: 1.5;
      white-space: nowrap;
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

    /* ── Chips — match the Graph panel Day Avg Boxes format (primary-tinted
       background, uppercase label with letter-spacing, column layout, no icon
       by default) but with the stat-pill min-height so the chip row aligns
       with the two boxes above it on the Daily panel. The .with-icon modifier
       relaxes the min-height so the box grows to fit the icon-on-top. ── */
    .chip {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 6px 4px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      overflow: hidden;
    }

    .chip.with-icon {
      /* gap stays 2px (label→value spacing unchanged); the icon gets its own
         breathing room via .chip-icon margin-bottom so toggling the icon on
         doesn't alter the label-to-value gap. */
    }

    .chip.clickable {
      cursor: pointer;
    }

    .chip.clickable:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .chip-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary-color, #03a9f4);
      opacity: 0.7;
      margin-bottom: 8px;
    }

    .chip-name {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.2;
      text-align: center;
      word-break: break-word;
      max-width: 100%;
    }

    .chip-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      white-space: nowrap;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-daily-panel': AxDoseDailyPanel;
  }
}