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
import type { ActionConfig } from 'custom-card-helpers';
import type { CardController, ResolvedEntities, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';

@customElement('ax-dose-drinks-panel')
export class AxDoseDrinksPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
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
    const substance = e.substance;
    const cfg = c.config;
    const substanceLabel = substance === 'alcohol'
      ? localize(this._lang, 'drinks.alcohol')
      : localize(this._lang, 'drinks.caffeine');

    // Log Drink button overrides — icon/label fall back to substance-aware
    // defaults when unset (mdi:coffee for caffeine, mdi:glass-mug-variant for
    // alcohol; "Log Drink" label). Mirrors the Daily panel's take_pill_icon /
    // take_pill_label overrides.
    const logDrinkIcon = cfg?.log_drink_icon
      || (substance === 'alcohol' ? 'mdi:glass-mug-variant' : 'mdi:coffee');
    const logDrinkLabel = cfg?.log_drink_label || localize(this._lang, 'drinks.log_drink');

    // "Last" counter — identical to Daily's take-sub. The resolver populates
    // entities.lastDose for drink masters from the dedicated
    // DrinkMasterLastDoseSensor (see ax-dose-logger-card.ts), so the controller
    // helper works here without any backend change. Drink masters have no
    // Next/Overdue concept (no schedule), so the sub-line is the single
    // "Last: …" segment, matching Daily's simplest branch.
    const timeSince = c.computeTimeSinceLastDose(e);

    // ── In Body box — full override parity with the Daily Safe to Take box ──
    // Display entity: configured in_body_entity wins; else the default
    // amountInBody sensor. Swapped numeric → formatInteger + unit attr;
    // swapped non-numeric → title-case. Default → Math.round + substance unit
    // (mg/g) rounded to 0 decimals for compactness (unchanged from prior).
    const inBodyDisplayEntity = c.getInBodyBoxEntity(e);
    const inBodyRaw = inBodyDisplayEntity ? c.getState(inBodyDisplayEntity) : '';
    const inBodyUnknown = !inBodyRaw || inBodyRaw === 'unknown' || inBodyRaw === 'unavailable';
    const inBodyIsSwapped = !!(cfg?.in_body_entity && cfg.in_body_entity !== e.amountInBody);
    const inBodyUnit = c.getStrengthUnit(e);
    const inBodyBodyNum = parseFloat(inBodyRaw);
    const inBodyValue = inBodyUnknown
      ? localize(this._lang, 'daily.na')
      : (inBodyIsSwapped
        ? (isNaN(inBodyBodyNum)
          ? (inBodyRaw.charAt(0).toUpperCase() + inBodyRaw.slice(1))
          : c.formatInteger(inBodyRaw) + (c.getAttr(inBodyDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(inBodyDisplayEntity, 'unit_of_measurement') : ''))
        : `${isNaN(inBodyBodyNum) ? inBodyRaw : Math.round(inBodyBodyNum)} ${inBodyUnit}`);
    const inBodyActionConfig: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig } = {
      entity: inBodyDisplayEntity,
      tap_action: cfg?.in_body_tap_action,
      hold_action: cfg?.in_body_hold_action,
      double_tap_action: cfg?.in_body_double_tap_action,
    };
    const ibHasCustomTap = !!cfg?.in_body_tap_action;
    const ibHasHold = !!cfg?.in_body_hold_action;
    const ibHasDblClick = !!cfg?.in_body_double_tap_action;
    const inBodyClickable = ibHasCustomTap || ibHasHold || ibHasDblClick || !!inBodyDisplayEntity;

    // ── Disruption box — Time to Low 3-option mode select + entity swap ──
    // Mode priority (mirrors Pills Left Box days-left toggle): built-in mode
    // swap wins over disruption_entity. 'disruption' (default) → Sleep
    // Disruption state (None/Low/Moderate/High, title-cased); 'low_timestamp'
    // → Low - Timestamp sensor formatted HH:MM; 'low_hours_until' → Low -
    // Hours Until countdown sensor formatted X h. An entity swap follows the
    // same numeric/title-case convention as the In Body box.
    const disruptionMode = cfg?.disruption_mode || 'disruption';
    const disruptionDisplayEntity = c.getDisruptionBoxEntity(e);
    const disruptionRaw = disruptionDisplayEntity ? c.getState(disruptionDisplayEntity) : '';
    const disruptionUnknown = !disruptionRaw || disruptionRaw === 'unknown' || disruptionRaw === 'unavailable';
    const disruptionIsSwapped = !!(cfg?.disruption_entity && cfg.disruption_entity !== e.sleepDisruption
      && disruptionMode === 'disruption');
    // Display value per mode.
    let disruptionValue = localize(this._lang, 'daily.na');
    if (!disruptionUnknown) {
      if (disruptionIsSwapped) {
        const num = parseFloat(disruptionRaw);
        disruptionValue = isNaN(num)
          ? (disruptionRaw.charAt(0).toUpperCase() + disruptionRaw.slice(1))
          : c.formatInteger(disruptionRaw) + (c.getAttr(disruptionDisplayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(disruptionDisplayEntity, 'unit_of_measurement') : '');
      } else if (disruptionMode === 'low_timestamp') {
        // Low - Timestamp sensor state is a full ISO datetime; display HH:MM
        // (24-hour) matching the Stats panel format.
        const dt = new Date(disruptionRaw);
        disruptionValue = isNaN(dt.getTime())
          ? localize(this._lang, 'daily.na')
          : dt.toLocaleTimeString(this._lang, { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (disruptionMode === 'low_hours_until') {
        // Low - Hours Until is a DURATION (hours) numeric; display the raw
        // number only — the "Low - Hours Until" label already conveys the unit.
        const num = parseFloat(disruptionRaw);
        disruptionValue = isNaN(num) ? localize(this._lang, 'daily.na') : String(num);
      } else {
        // disruption (default) → title-cased state.
        disruptionValue = disruptionRaw.charAt(0).toUpperCase() + disruptionRaw.slice(1);
      }
    }
    // Default icon/label switch per mode.
    const disruptionDefaultIcon = disruptionMode === 'low_timestamp'
      ? 'mdi:clock-outline'
      : (disruptionMode === 'low_hours_until' ? 'mdi:timer-sand' : 'mdi:sleep');
    const disruptionDefaultLabel = disruptionMode === 'low_timestamp'
      ? localize(this._lang, 'stats.low_timestamp')
      : (disruptionMode === 'low_hours_until' ? localize(this._lang, 'stats.low_hours_until') : localize(this._lang, 'drinks.disruption'));
    const disruptionActionConfig: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig } = {
      entity: disruptionDisplayEntity,
      tap_action: cfg?.disruption_tap_action,
      hold_action: cfg?.disruption_hold_action,
      double_tap_action: cfg?.disruption_double_tap_action,
    };
    const dHasCustomTap = !!cfg?.disruption_tap_action;
    const dHasHold = !!cfg?.disruption_hold_action;
    const dHasDblClick = !!cfg?.disruption_double_tap_action;
    // Tap fallback: Sleep Disruption popup when mode='disruption' + substance;
    // else more-info on the display entity (matches the Low-modes' default).
    const disruptionTapFallback = () => {
      if (disruptionMode === 'disruption' && substance) {
        c.showSleepDisruptionDialog(substance);
      } else if (disruptionDisplayEntity) {
        c.openMoreInfo(disruptionDisplayEntity);
      }
    };
    const disruptionClickable = dHasCustomTap || dHasHold || dHasDblClick || !!disruptionDisplayEntity || (disruptionMode === 'disruption' && !!substance);

    // ── Custom chips (Drinks panel) — parallel to the Daily panel chips ──
    const drinkChipEntities = c.getDrinkChipEntities();

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
            aria-label=${logDrinkLabel}
            ?disabled=${!substance}
            @click=${() => substance && c.showLogDrinkDialog(substance)}
          >
            <ha-icon icon="${logDrinkIcon}"></ha-icon>
            <span class="take-label">${logDrinkLabel}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span></span>
          </button>

          <div class="stats-column">
            <div class="stat-pill ${inBodyClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${inBodyClickable ? '0' : nothing}
                 aria-label=${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}
                 @click=${inBodyClickable ? (ev: MouseEvent) => c.handleInBodyBoxAction(ev, 'tap', inBodyActionConfig, inBodyDisplayEntity) : null}
                 @keydown=${inBodyClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleInBodyBoxAction(null, 'tap', inBodyActionConfig, inBodyDisplayEntity)) : null}
                 @contextmenu=${ibHasHold ? (ev: Event) => { ev.preventDefault(); c.handleInBodyBoxAction(null, 'hold', inBodyActionConfig, inBodyDisplayEntity); } : null}
                 @dblclick=${ibHasDblClick ? () => c.handleInBodyBoxAction(null, 'double_tap', inBodyActionConfig, inBodyDisplayEntity) : null}>
              <ha-icon icon="${cfg?.in_body_icon || 'mdi:chart-bell-curve'}"></ha-icon>
              <span class="stat-label">${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}</span>
              <span class="stat-value">${inBodyValue}</span>
            </div>
            <div class="stat-pill ${disruptionClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${disruptionClickable ? '0' : nothing}
                 aria-label=${cfg?.disruption_label || disruptionDefaultLabel}
                 @click=${disruptionClickable ? (ev: MouseEvent) => c.handleDisruptionBoxAction(ev, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback) : null}
                 @keydown=${disruptionClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleDisruptionBoxAction(null, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback)) : null}
                 @contextmenu=${dHasHold ? (ev: Event) => { ev.preventDefault(); c.handleDisruptionBoxAction(null, 'hold', disruptionActionConfig, disruptionDisplayEntity); } : null}
                 @dblclick=${dHasDblClick ? () => c.handleDisruptionBoxAction(null, 'double_tap', disruptionActionConfig, disruptionDisplayEntity) : null}>
              <ha-icon icon="${cfg?.disruption_icon || disruptionDefaultIcon}"></ha-icon>
              <span class="stat-label">${cfg?.disruption_label || disruptionDefaultLabel}</span>
              <span class="stat-value">${disruptionValue}</span>
            </div>
          </div>
        </div>

        ${drinkChipEntities.length > 0
          ? html`
              <div class="chips-row">
                ${drinkChipEntities.map((chip) => {
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
                      @click=${(ev: MouseEvent) => c.handleDrinkChipAction(ev, 'tap', chipActionCfg, chip.entityId)}
                      @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleDrinkChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleDrinkChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleDrinkChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
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
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
    }
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
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
    }

    /* ── .take-sub — verbatim from daily-panel.ts ── */
    .take-sub {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(450 * var(--pill-font-weight-boost, 1));
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
      padding: 6px 14px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
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

    /* ── Custom chips — verbatim from daily-panel.ts ── */
    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* ── Chips — match the Graph panel Day Avg Boxes format (primary-tinted
       background, uppercase label with letter-spacing, column layout, no icon
       by default) but with the stat-pill min-height so the chip row aligns
       with the two boxes above it on the Drinks panel. The .with-icon modifier
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
    'ax-dose-drinks-panel': AxDoseDrinksPanel;
  }
}