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
import type { CardController, ResolvedEntities, AxDoseLoggerHass, ButtonStateStyle, IconStyle, AckLayout, RingSpeed } from '../types.js';
import type { ButtonState } from '../helpers.js';
import { localize } from '../localize.js';
import { keyed } from 'lit/directives/keyed.js';
import { delayedAction } from '../delayed-action.js';

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
  // ── Button State Matrix (Prosumer UI) ──
  // Resolved ButtonState from the container's _computeDailyButtonState(). The
  // panel maps it to a CSS class string using the per-state style option +
  // icon style option from the card config. 'idle' renders no state class
  // default). See plans/button-state-matrix-plan.md.
  @property({ attribute: false }) buttonState: ButtonState = 'idle';
  // Transient ACK flag from the container (mirrors buttonState==='ack' but
  // kept separate so the panel can drive the ack-duration CSS var even when
  // the state resolver already collapsed to 'ack').
  @property({ attribute: false }) ackActive: boolean = false;
  // Rapid successive-click count from the container. 0 means no ACK active,
  // 1 means first press (no suffix rendered), 2 and above means "Logged {n}x".
  // Drives the ack-text suffix on top/inline layouts and the Nx badge on the
  // big layout. See plans/rapid-click-count-plan.md.
  @property({ attribute: false }) ackCount: number = 0;

  private get _lang(): string {
    return this.controller.lang;
  }

  /**
   * Build the CSS class string for the Take Pill button from the resolved
   * ButtonState + the per-state style option + pulse toggle in the card
   * config. Maps the 4 style options (full / border / none / ring) + 4
   * icon style options (none / color / color_pulse / pulse) onto
   * state-color class pairs. The 'auto' sentinel resolves to the per-state
   * default at runtime. The 'idle' state renders only the base button (no
   * color override). Returns the full class list including the base
   * 'take-pill-btn'.
   */
  private _takeButtonClasses(): string {
    const state = this.buttonState;
    const cfg = this.controller.config;
    // Per-state defaults (used when value is 'auto' or undefined).
    const STATE_DEFAULTS = {
      lockout:   { style: 'full' as ButtonStateStyle,  iconStyle: 'none' as IconStyle },
      execution: { style: 'none' as ButtonStateStyle,  iconStyle: 'color' as IconStyle },
      latency:   { style: 'border' as ButtonStateStyle, iconStyle: 'color_pulse' as IconStyle },
    };
    // State → color token + configured style + icon_style (auto resolves).
    let style: ButtonStateStyle = 'none';
    let iconStyle: IconStyle = 'none';
    if (state === 'lockout' || state === 'limit_24h') {
      // limit_24h inherits ALL lockout style config (same red color, same
      // CSS classes, same take_button_lockout_style/_icon_style fields).
      // Only the label + override dialog text differ.
      const d = STATE_DEFAULTS.lockout;
      style = cfg?.take_button_lockout_style ?? d.style;
      if (style === 'auto') style = d.style;
      iconStyle = cfg?.take_button_lockout_icon_style ?? d.iconStyle;
      if (iconStyle === 'auto') iconStyle = d.iconStyle;
    } else if (state === 'execution') {
      const d = STATE_DEFAULTS.execution;
      style = cfg?.take_button_execution_style ?? d.style;
      if (style === 'auto') style = d.style;
      iconStyle = cfg?.take_button_execution_icon_style ?? d.iconStyle;
      if (iconStyle === 'auto') iconStyle = d.iconStyle;
    } else if (state === 'latency') {
      const d = STATE_DEFAULTS.latency;
      style = cfg?.take_button_latency_style ?? d.style;
      if (style === 'auto') style = d.style;
      iconStyle = cfg?.take_button_latency_icon_style ?? d.iconStyle;
      if (iconStyle === 'auto') iconStyle = d.iconStyle;
    } else {
      // idle — no color, no style option (theme default).
      return this.ackActive ? 'take-pill-btn ack-flash' : 'take-pill-btn';
    }
    // State → color name.
    const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
      : state === 'execution' ? 'blue'
      : state === 'latency' ? 'amber'
      : 'green'; // ack
    // Style option → class fragments (5 options; auto already resolved).
    const classes: string[] = ['take-pill-btn', `state-${state}`];
    if (style === 'full') classes.push(`full-${color}`);
    if (style === 'border') classes.push(`border-${color}`);
    if (style === 'ring') classes.push(`ring-${color}`);
    if (style === 'glow') classes.push(`style-none`);  // glow renders on the wrapper backdrop, not the button face
    if (style === 'none') classes.push(`style-none`);
    // Icon Style option → class fragments (2x2 matrix; auto resolved).
    if (iconStyle === 'color' || iconStyle === 'color_pulse') classes.push(`icon-${color}`);
    if (iconStyle === 'color_pulse' || iconStyle === 'pulse') classes.push('pulse');
    // ACK overlay is a pure flash layered on top of the true state — it does
    //    not recolor the button, so the real state stays correct underneath.
    if (this.ackActive) classes.push('ack-flash');
    return classes.join(' ');
  }

  /** Resolve the rotating ring animation duration (CSS string) from the
   *  per-button ring_speed config. 'medium' (4s) is the default. Shared by
   *  the ring sweep and the ambilight glow breathing animation. See plans/
   *  ambilight-glow-style-plan.md. */
  private _ringDuration(): string {
    const speed: RingSpeed = this.controller.config?.take_button_ring_speed ?? 'medium';
    return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
  }

  /** Resolve the wrapper class for the ambilight glow backdrop. Returns ''
   *  when the resolved style is not 'glow' (backdrop hidden, no GPU layer).
   *  The glow-{color} class goes on the WRAPPER (not the button) because the
   *  button has overflow:hidden which would clip the bleeding backdrop. See
   *  plans/architecture-rollback-z-axis-stacking-plan.md. */
  private _takeGlowWrapClass(): string {
    const state = this.buttonState;
    const cfg = this.controller.config;
    // Re-resolve the style using the same defaults as _takeButtonClasses.
    let style: ButtonStateStyle = 'none';
    if (state === 'lockout' || state === 'limit_24h') {
      style = cfg?.take_button_lockout_style ?? 'full';
      if (style === 'auto') style = 'full';
    } else if (state === 'execution') {
      style = cfg?.take_button_execution_style ?? 'none';
      if (style === 'auto') style = 'none';
    } else if (state === 'latency') {
      style = cfg?.take_button_latency_style ?? 'border';
      if (style === 'auto') style = 'border';
    } else {
      return ''; // idle — no glow
    }
    if (style !== 'glow') return '';
    const color = (state === 'lockout' || state === 'limit_24h') ? 'red'
      : state === 'execution' ? 'blue'
      : state === 'latency' ? 'amber' : 'green';
    return `glow-${color}`;
  }

  /** Resolve the ACK (Logged) flash layout from the per-button ack_layout
   *  config. 'top' is the default and mirrors the normal button layout. */
  private _ackLayout(): AckLayout {
    return this.controller.config?.take_button_ack_layout ?? 'top';
  }

  /** Resolve the ACK (Logged) flash label text, appending the rapid-click
   *  count suffix ("Logged 2x", "Logged 3x" …) when the count is 2 or more.
   *  The first press (count 1) shows the bare "Logged" with no suffix so no
   *  "1x" is rendered. See plans/rapid-click-count-plan.md. */
  private _ackLabelText(): string {
    const base = localize(this._lang, 'button.ack_text'); // "Logged"
    return this.ackCount >= 2 ? `${base} ${this.ackCount}x` : base;
  }

  render() {
    const c = this.controller;
    const e = this.entities;
    // safeState powers the Safe to Take box display value below. The lockout
    // detection (safeCount <= 0) now lives in the container's
    // _computeDailyButtonState so this panel stays presentational; the
    // resolved buttonState prop drives the Take Pill button styling.
    const safeState = c.getState(e.pillsSafeToTake);
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

    // Display entity for the top box (Safe to Take / Amount in Body). May
    // differ from the real pillsSafeToTake sensor (toggle on → amountInBody).
    const topShowAmountInBody = c.config?.safe_to_take_show_amount_in_body === true;
    const displayEntity = c.getSafeBoxEntity(e);
    const displayState = c.getState(displayEntity);
    const displayIsUnknown = displayState === 'unknown' || displayState === 'unavailable' || displayState === undefined;
    const isSwapped = !!(c.config?.safe_to_take_entity && c.config.safe_to_take_entity !== e.pillsSafeToTake);
    // Default label/icon switch to the Amount in Body variants when the
    // toggle is on (mirrors the pillsLeftDefaultLabel/Icon pattern below).
    const topDefaultLabel = topShowAmountInBody
      ? localize(this._lang, 'stats.amount_in_body')
      : localize(this._lang, 'daily.safe_to_take');
    const topDefaultIcon = topShowAmountInBody ? 'mdi:chart-bell-curve' : 'mdi:shield-check';

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
             @click=${delayedAction(() => c.showDeviceInfo())}
             @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.showDeviceInfo())}
        ><ha-ripple></ha-ripple>${c.getMedName(e)}</div>

        <div class="daily-main">
          <div class="take-pill-wrap${this._takeGlowWrapClass() ? ' ' + this._takeGlowWrapClass() : ''}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._takeButtonClasses()}
              style=${this.ackActive ? `--ack-duration: ${this.controller.config?.take_button_ack_duration_ms ?? 3000}ms` : ''}
              aria-label=${this.buttonState === 'lockout'
                ? localize(this._lang, 'aria.take_pill_limit')
                : this.buttonState === 'limit_24h'
                ? localize(this._lang, 'aria.take_pill_24h_limit')
                : (c.config?.take_pill_label || localize(this._lang, 'aria.take_pill_safe'))}
              @click=${delayedAction(() => c.handleTakePill(e))}
            >
              <div class="ring-track"></div>
              <ha-ripple></ha-ripple>
            <ha-icon icon="${(this.buttonState === 'lockout' || this.buttonState === 'limit_24h') ? 'mdi:alert' : (c.config?.take_pill_icon || 'mdi:pill')}"></ha-icon>
            <span class="take-label">${this.buttonState === 'lockout'
              ? localize(this._lang, 'daily.limit_reached')
              : this.buttonState === 'limit_24h'
              ? localize(this._lang, 'daily.24h_limit_reached')
              : (c.config?.take_pill_label || localize(this._lang, 'daily.take_pill'))}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span>${overTime
              ? html` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.overdue')}: ${overTime}</span>`
              : (nextDose !== 'Unavailable' && nextDose !== 'now'
                ? html` \u2022 <span class="take-sub-segment">${localize(this._lang, 'daily.next')}: ${nextDose}</span>`
                : nothing)}</span>
            ${this.ackActive ? keyed(this.ackCount, html`
              <div class="ack-flash ack-${this._ackLayout()}${this.ackCount >= 2 ? ' ack-repeat' : ''}">
                <ha-icon icon="mdi:check-bold" class="ack-icon"></ha-icon>
                ${this._ackLayout() !== 'big'
                  ? html`<span class="ack-text">${this._ackLabelText()}</span>`
                  : (this.ackCount >= 2
                    ? html`<span class="ack-count-badge">${this.ackCount}x</span>`
                    : nothing)}
              </div>
            `) : nothing}
            </button>
          </div>

          <div class="stats-column">
            <div class="stat-pill ${safeBoxClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${safeBoxClickable ? '0' : nothing}
                 aria-label=${c.config?.safe_to_take_label || topDefaultLabel}
                 @click=${safeBoxClickable ? delayedAction((ev: MouseEvent) => c.handleSafeBoxAction(ev, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @keydown=${safeBoxClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleSafeBoxAction(null, 'tap', safeBoxActionConfig, displayEntity)) : null}
                 @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleSafeBoxAction(null, 'hold', safeBoxActionConfig, displayEntity); } : null}
                 @dblclick=${hasDblClick ? () => c.handleSafeBoxAction(null, 'double_tap', safeBoxActionConfig, displayEntity) : null}>
              ${safeBoxClickable ? html`<ha-ripple></ha-ripple>` : nothing}
               <ha-icon icon="${c.config?.safe_to_take_icon || topDefaultIcon}"></ha-icon>
              <span class="stat-label">${c.config?.safe_to_take_label || topDefaultLabel}</span>
              <span class="stat-value">${displayIsUnknown
                ? localize(this._lang, 'daily.na')
                : (topShowAmountInBody && !isSwapped
                  ? (() => {
                      // Toggle ON default → Amount in Body value formatted
                      // Math.round(num) + strength unit, mirroring the Drinks
                      // panel In Body box (drinks-panel.ts:81).
                      const aibNum = parseFloat(displayState);
                      const unit = c.getStrengthUnit(e);
                      return isNaN(aibNum) ? displayState : `${Math.round(aibNum)}${unit ? ' ' + unit : ''}`;
                    })()
                  : (isSwapped
                    ? (displayState
                      ? (isNaN(parseFloat(displayState))
                        ? displayState.charAt(0).toUpperCase() + displayState.slice(1)
                        : c.formatInteger(displayState) + (c.getAttr(displayEntity, 'unit_of_measurement') ? ' ' + c.getAttr(displayEntity, 'unit_of_measurement') : ''))
                      : '')
                    : c.formatInteger(safeState)))}</span>
            </div>
            <div class="stat-pill ${pillsLeftClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${pillsLeftClickable ? '0' : nothing}
                 aria-label=${c.config?.pills_left_label || pillsLeftDefaultLabel}
                 @click=${pillsLeftClickable ? delayedAction((ev: MouseEvent) => c.handlePillsLeftBoxAction(ev, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback)) : null}
                 @keydown=${pillsLeftClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handlePillsLeftBoxAction(null, 'tap', pillsLeftActionConfig, pillsLeftDisplayEntity, pillsLeftTapFallback)) : null}
                 @contextmenu=${plHasHold ? (ev: Event) => { ev.preventDefault(); c.handlePillsLeftBoxAction(null, 'hold', pillsLeftActionConfig, pillsLeftDisplayEntity); } : null}
                 @dblclick=${plHasDblClick ? () => c.handlePillsLeftBoxAction(null, 'double_tap', pillsLeftActionConfig, pillsLeftDisplayEntity) : null}>
              ${pillsLeftClickable ? html`<ha-ripple></ha-ripple>` : nothing}
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
                      @click=${delayedAction((ev: MouseEvent) => c.handleChipAction(ev, 'tap', chipActionCfg, chip.entityId))}
                      @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
                      <ha-ripple></ha-ripple>
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
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). Per-element overrides below
         set the ripple colour to the element's own identity colour. */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
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
      /* position:relative + overflow:hidden clip the ha-ripple surface. */
      position: relative;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
      z-index: 1;  /* global z-axis protection — glow bleeds behind title (Patch 1, belt-and-suspenders) */
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
      position: relative;  /* global z-axis protection — glow bleeds behind stats (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    /* Wrapper for the ambilight glow backdrop. Becomes the .daily-main flex
       child (replaces the button's flex role). isolation:isolate + z-index:0
       spawn a localized z-axis boundary so the backdrop's z-index:-1 can't
       bleed behind the card background. NO overflow:hidden — the backdrop
       must bleed freely beyond the button (the button keeps its own
       overflow:hidden for ring-track/ripple clipping). See plans/
       architecture-rollback-z-axis-stacking-plan.md. */
    .take-pill-wrap {
      position: relative;
      z-index: 0;
      isolation: isolate;
      display: flex;
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
      transition: background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
      z-index: 1;  /* stack above the .glow-backdrop (z-index:-1) */
      /* Reserve the full two-line-sub-text button height permanently. The
         button's justify-content: center distributes the reserved height as
         symmetric top/bottom padding around the icon + take-label + sub-text
         block, so the icon→label→sub gap stays the fixed 2px (uniform) while
         only the button's top/bottom breathing room grows to fit the reserved
         two lines. This keeps the internal spacing visually consistent between
         the one-line and two-line configurations; only the outer padding
         changes. min-height is expressed in em units (relative to the button's
         inherited 16px base font) so it scales with --pill-text-offset:
           icon 28px + icon margin-bottom 2px + take-label 18px (line ~1.2)
           + gap 2px + two sub lines (16px × 1.5 × 2) + gap 2px + padding 24px
         ≈ 28+2+22+2+48+2+24 = 128px ≈ 8em. */
      min-height: 8em;
    }

    /* :active scale transform removed — ha-ripple provides the press feedback
       (Material Design radiating circle), so the physical compression is
       redundant and can fight the ripple's layout. */
    /* ha-ripple sits above the .ring-track (z-index 0) AND above the
       .ack-flash overlay (z-index 2) so the native ripple keeps radiating
       over the opaque green "Logged" surface after an ACK press. The
       ripple fires at pointerdown (t=0) and animates ~300ms; the green
       overlay mounts ~110ms later (delayedAction), so raising the ripple
       to z-index 3 lets the user see press feedback even when their
       finger covers the Nx text. Matches Mushroom template-card
       layering (ripple renders over content). */
    .take-pill-btn > ha-ripple {
      z-index: 3;
    }
    /* State-coloured ripples — the press feedback colour matches the button's
       current medical state (richer than Mushroom's single colour, fits the
       Button State Matrix). The ACK state uses a light tint so the ripple
       reads on the opaque dark-green overlay surface (#212c22). */
    .take-pill-btn.state-lockout { --ha-ripple-color: var(--btn-red); }
    .take-pill-btn.state-limit_24h { --ha-ripple-color: var(--btn-red); }
    .take-pill-btn.state-execution { --ha-ripple-color: var(--btn-blue); }
    .take-pill-btn.state-latency { --ha-ripple-color: var(--btn-amber); }
    .take-pill-btn.ack-flash { --ha-ripple-color: #ffffff; }

    /* ── Button State Matrix (Prosumer UI) ──
       Replaces the prior binary .safe/.danger classes with a 5-state, 7-style-
       option system. The default (idle / no state class) keeps the original
       theme-tinted look. Each colored state composes a state-color class
       (e.g. .full-red, .icon-blue, .border-amber, .ring-green) from the panel's
       _takeButtonClasses() helper. See plans/button-state-matrix-plan.md. */

    /* State color tokens (CSS vars so the rules below stay generic). */
    :host {
      --btn-red: var(--error-color, #db4437);
      --rgb-btn-red: var(--rgb-error-color, 219, 68, 55);
      --btn-blue: #03a9f4;
      --rgb-btn-blue: 3, 169, 244;
      --btn-amber: #f5a623;
      --rgb-btn-amber: 245, 166, 35;
      --btn-green: #43a047;
      --rgb-btn-green: 67, 160, 71;
      /* Dark green surface for the Logged Dose Indicator (ACK) overlay.
         High contrast against the bright --btn-green glyph so the tick/text
         are clearly legible; opaque so the underlying button state
         (red/amber/blue) does not bleed through behind the green tick.
         See plans/ack-clarity-and-softening-plan.md (Issue 2). */
      --btn-green-soft: #212c22;
    }

    /* Base idle state (no state class) — original theme-tinted safe look.
       Gradient-stack surface: opaque --card-background-color base wall blocks
       the ambilight backlight; flat rgba(...,0.12) tint layer (linear-gradient
       with identical stops = flat color) restores the perceptual tint. See
       plans/gradient-stacking-material-synthesis-plan.md. */
    .take-pill-btn:not(.state-lockout):not(.state-limit_24h):not(.state-execution):not(.state-latency):not(.state-ack) {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .take-pill-btn:not(.state-lockout):not(.state-limit_24h):not(.state-execution):not(.state-latency):not(.state-ack):hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.2), rgba(var(--rgb-primary-color, 3, 169, 244), 0.2));
    }

    /* Option 1 — Full Button (per color). Gradient-stack surface: opaque
       --card-background-color base wall blocks the ambilight backlight; flat
       rgba(var(--rgb-btn-*),0.12) tint layer restores the identity-color tint.
       See plans/gradient-stacking-material-synthesis-plan.md. */
    .take-pill-btn.full-red    { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));    color: var(--btn-red); }
    .take-pill-btn.full-red:hover    { background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.2), rgba(var(--rgb-btn-red), 0.2)); }
    .take-pill-btn.full-blue   { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-blue), 0.12), rgba(var(--rgb-btn-blue), 0.12));   color: var(--btn-blue); }
    .take-pill-btn.full-blue:hover   { background-image: linear-gradient(rgba(var(--rgb-btn-blue), 0.2), rgba(var(--rgb-btn-blue), 0.2)); }
    .take-pill-btn.full-amber  { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-amber), 0.12), rgba(var(--rgb-btn-amber), 0.12));  color: var(--btn-amber); }
    .take-pill-btn.full-amber:hover  { background-image: linear-gradient(rgba(var(--rgb-btn-amber), 0.2), rgba(var(--rgb-btn-amber), 0.2)); }
    .take-pill-btn.full-green { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.12), rgba(var(--rgb-btn-green), 0.12)); color: var(--btn-green); }
    .take-pill-btn.full-green:hover { background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.2), rgba(var(--rgb-btn-green), 0.2)); }

    /* Option 2 — Icon recolor only (Icon Style: color / color_pulse). The >
       child combinator scopes the recolor to the button's OWN icon only — the
       nested ACK tick is excluded so it keeps its own color. Do NOT set
       background/color here: every Style option emits its own bg rule with
       equal specificity, and a bg here would tie with .full-{color} and win
       by source order, erasing the Full Button tint (bug: Full Button only
       worked with Icon Style None or Pulse Only). See plans/
       full-button-icon-style-override-fix-plan.md. */
    .take-pill-btn.icon-red > ha-icon    { color: var(--btn-red); }
    .take-pill-btn.icon-blue > ha-icon   { color: var(--btn-blue); }
    .take-pill-btn.icon-amber > ha-icon  { color: var(--btn-amber); }
    .take-pill-btn.icon-green > ha-icon  { color: var(--btn-green); }

    /* Option 3 — Border only (inset box-shadow so the button does not grow;
       a real border would add 2px to the outer size on each side). */
    .take-pill-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
    .take-pill-btn.border-blue   { box-shadow: inset 0 0 0 2px var(--btn-blue); }
    .take-pill-btn.border-amber  { box-shadow: inset 0 0 0 2px var(--btn-amber); }
    .take-pill-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }
    .take-pill-btn.border-red, .take-pill-btn.border-blue,
    .take-pill-btn.border-amber, .take-pill-btn.border-green {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Option 6 — Rotating Ring (Apple Intelligence perimeter sweep).
       TWO-LAYER architecture (required: the mask-ring and the rotation-oversize
       cannot share one element — oversizing moves the mask's content-box ring
       off the button, where overflow:hidden clips it away → nothing renders).
       Layer 1 .ring-track: button-sized (inset 0), holds the mask that carves
       the 2px ring on the button edge + overflow:hidden to clip the rotating
       child to the rounded perimeter. Layer 2 .ring-track::before: oversized
       (inset -150%) rotating gradient source; the track's mask carves the ring
       from this rotating gradient. transform animates without @property. */
    @keyframes ax-btn-ring-sweep { to { transform: rotate(360deg); } }
    .take-pill-btn.ring-red, .take-pill-btn.ring-blue,
    .take-pill-btn.ring-amber, .take-pill-btn.ring-green {
      position: relative;
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    /* Layer 1 — the static geometry mask. Button-sized so the mask ring sits
       exactly on the button edge. padding:2px defines the ring thickness;
       border-radius:inherit follows the rounded corners; overflow:hidden clips
       the rotating child to the perimeter. */
    .take-pill-btn .ring-track {
      position: absolute;
      inset: 0;
      padding: 2px;
      border-radius: inherit;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      /* Both prefixed AND unprefixed mask must be declared: mask-composite
         operates on the unprefixed mask in modern Chromium. */
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
              mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
    }
    /* Layer 2 — the rotating oversized gradient engine. 400% of the track
       (button-sized) so its rotating square always covers the track at every
       angle (no corner gaps). The track's mask carves the 2px ring from this
       rotating gradient. */
    .take-pill-btn .ring-track::before {
      content: '';
      position: absolute;
      inset: -150%;
      animation: ax-btn-ring-sweep var(--ring-duration, 2.2s) linear infinite;
    }
    /* State color → gradient. 85% line with a solid-color middle (76.5→229.5,
       153deg = 50% of the line) so the state color stays unambiguous; a
       white-tipped shimmer head at 306deg (color-mix lifts toward #fff); a
       crisp head edge (306→306.1deg near-zero stop); 54deg transparent gap. */
    .take-pill-btn.ring-red .ring-track::before    { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-red)    76.5deg, var(--btn-red)    229.5deg, color-mix(in srgb, var(--btn-red)    60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-blue .ring-track::before   { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-blue)   76.5deg, var(--btn-blue)   229.5deg, color-mix(in srgb, var(--btn-blue)   60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-amber .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-amber)  76.5deg, var(--btn-amber)  229.5deg, color-mix(in srgb, var(--btn-amber)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .take-pill-btn.ring-green .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-green)  76.5deg, var(--btn-green)  229.5deg, color-mix(in srgb, var(--btn-green)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }

    /* Option 6 — Ambilight Glow (GPU-composited diffused backlight + breathing).
       A dedicated .glow-backdrop div sits behind the button (inside the
       .take-pill-wrap wrapper) and bleeds outward (inset:-9px) with a STATIC
       filter:blur(8px) that produces the ambilight falloff (vibrant edge,
       quickly diffusing). The breathing animation animates OPACITY only
       (compositor-only property → GPU layer, zero CPU repaint — safe for
       tablet SOCs). will-change is sandboxed inside the active glow selector
       below so inactive (non-glow) states revert to will-change:auto and
       release the GPU compositor layer + VRAM. The button face stays
       theme-tinted (style-none) — the glow is purely an outer light.
       Z-axis: the wrapper has isolation:isolate + z-index:0, so the
       backdrop's z-index:-1 renders behind the wrapper baseline but in
       front of the card background. The 9px diffusion bleeds outside the
       wrapper but stays behind adjacent siblings (z-index:1). See plans/
       architecture-rollback-z-axis-stacking-plan.md. */
   .take-pill-wrap .glow-backdrop {
     position: absolute;
     inset: -9px;
     z-index: -1;
     border-radius: calc(var(--ha-card-border-radius, 12px) + 9px);
     background: var(--glow-color, transparent);
     filter: blur(8px);
     opacity: 0;
      pointer-events: none;
      /* will-change OMITTED from the base class — sandboxed inside the active
         .glow-{color} .glow-backdrop selector so non-glow states revert to
         will-change:auto and flush the VRAM footprint (no GPU layer pinned). */
      /* No animation here — gated to the active glow selector below. */
    }
    /* Per-color activation: the wrapper's glow-{color} class sets the color
       token consumed by the backdrop's background. */
    .take-pill-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
    .take-pill-wrap.glow-blue   { --glow-color: rgba(var(--rgb-btn-blue), 0.85); }
    .take-pill-wrap.glow-amber  { --glow-color: rgba(var(--rgb-btn-amber), 0.85); }
    .take-pill-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }
    /* Active-glow selector: animation + will-change scoped here ONLY. When no
       glow-{color} class is on the wrapper, these rules do not apply → the
       backdrop is opacity:0 with no animation and no will-change → zero GPU
       layer cost (VRAM-safe). */
    .take-pill-wrap.glow-red .glow-backdrop,
    .take-pill-wrap.glow-blue .glow-backdrop,
    .take-pill-wrap.glow-amber .glow-backdrop,
    .take-pill-wrap.glow-green .glow-backdrop {
      opacity: 0.6;
      will-change: opacity;
      animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
    }
    /* Breathing keyframe — opacity only (GPU-composited). The static
       filter:blur(8px) is rasterized once when the layer is created; the
       keyframe just fades the pre-blurred layer in/out. No per-frame CPU work. */
    @keyframes ax-btn-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 0.85; }
    }

    /* Option 5 — No change (theme default, no color override). The surface
       is still solidified (alpha-1.0) to occlude the ambilight backlight;
       only the color identity is left at the theme default primary tint. */
    .take-pill-btn.style-none {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Icon-pulse animation (independent toggle per state). */
    @keyframes ax-btn-icon-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.15); opacity: 0.7; }
    }
    .take-pill-btn.pulse ha-icon {
      animation: ax-btn-icon-pulse 1.2s ease-in-out infinite;
    }

    /* ACK (logged) transient overlay — a pure flash layered on top of the
       button's true state. The button keeps its real color underneath; the
       overlay paints an opaque green surface + white tick ("mdi:check-bold")
       and optional "Logged" text, fully covering the underlying button, then
       fades to reveal the true state. Rendered as a real <div class="ack-flash">
       element (conditionally added to the template when ackActive is true) so
       it can host a real <ha-icon>. The layout is selected by the ack-top /
       ack-inline / ack-big modifier class from the per-button ack_layout
       config. Duration comes from the inline --ack-duration var. */
    .take-pill-btn .ack-flash {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      /* Issue 2 — dark green surface (not the saturated --btn-green) so the
         flash is less jarring; opaque so the underlying button state does
         not bleed through. The tick + text use solid --btn-green (bright
         green) for clear, legible success semantics on the dark surface. */
      background: var(--btn-green-soft);
      color: var(--btn-green);
      border-radius: inherit;
      opacity: 0;
      transform-origin: center;
      /* Issue 3 — two-animation split on a single line (a multi-line
         animation shorthand breaks the Lit CSS compiler, which drops the
         whole rule + the keyframes). A FIXED 240ms press-in intro (so the
         press feel stays snappy even when a long ack_duration is set — a
         proportional intro would stretch to ~800ms at 10000ms and feel
         sluggish), then the hold+fade animation delayed by 240ms. The intro
         uses "both" fill so its end state (opacity 1, scale 1) holds during
         the 240ms delay before the fade animation takes over. */
      animation: ax-btn-ack-intro 240ms ease-out both, ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out 240ms forwards;
      pointer-events: none;
      z-index: 2;
    }
    /* Rapid-click repeat: on the 2nd+ press the overlay is already at full
       opacity, so skip the 240ms intro (no flicker) and run only the fade
       animation from the start. The key() directive recreates the element
       on each ackCount change, restarting the animation so the fade timer
       effectively resets with each click. */
    .take-pill-btn .ack-flash.ack-repeat {
      animation: ax-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
    }
    /* Option 1 — Top tick mark and text (default; mirrors button layout). */
    .take-pill-btn .ack-flash.ack-top {
      flex-direction: column;
      gap: 4px;
    }
    .take-pill-btn .ack-flash.ack-top .ack-icon { --mdc-icon-size: 28px; }
    .take-pill-btn .ack-flash.ack-top .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 2 — Tick mark and text inline (the prior single-line layout). */
    .take-pill-btn .ack-flash.ack-inline {
      flex-direction: row;
      gap: 8px;
    }
    .take-pill-btn .ack-flash.ack-inline .ack-icon { --mdc-icon-size: 24px; }
    .take-pill-btn .ack-flash.ack-inline .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 3 — Big tickmark only (no text). */
    .take-pill-btn .ack-flash.ack-big .ack-icon { --mdc-icon-size: 56px; }
    /* Rapid-click count badge for the big (tickmark-only) ACK layout.
       Hidden on top/inline (those embed the count in ack-text). Sized to
       match the big tickmark's visual weight (56px icon) so the count reads
       as a peer of the tick, not a footnote. Uses the bright --btn-green
       glyph color so it reads as part of the success indicator; a
       translucent green chip background ties it to the green overlay
       surface. */
    .take-pill-btn .ack-flash.ack-big .ack-count-badge {
      font-size: calc(28px + var(--pill-text-offset, 0px));
      font-weight: 700;
      color: var(--btn-green);
      background: rgba(67, 160, 71, 0.18);
      padding: 4px 14px;
      border-radius: 14px;
      margin-top: 10px;
      line-height: 1.1;
    }
    /* Issue 3 — FIXED 240ms press-in intro mirrors the button's own
       :active { transform: scale(0.96) } press so the overlay reads like a
       button press instead of a hard cut. Fixed (not proportional to
       --ack-duration) so the press feel stays snappy even when a long flash
       interval is set. */
    @keyframes ax-btn-ack-intro {
      0%   { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    /* Hold + fade-out. Starts at opacity 1 (the intro's end state) and is
       delayed by 240ms (see the animation shorthand above) so it begins
       exactly when the intro finishes. */
    @keyframes ax-btn-ack-fade {
      0%   { opacity: 1; transform: scale(1); }
      70%  { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1); }
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
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.06) tint layer restores the
         perceptual tint. The stat-pill is an adjacent UI surface on
         .stats-column (z-index:1 sibling of .take-pill-wrap). See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.06), rgba(var(--rgb-primary-color, 3, 169, 244), 0.06));
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      flex: 1;
      /* position:relative clips the ha-ripple surface (overflow:hidden
         already present). */
      position: relative;
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
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
    }

    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      position: relative;  /* global z-axis protection — glow bleeds behind chips (Patch 1, belt-and-suspenders) */
      z-index: 1;
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
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.05) tint layer restores the
         perceptual tint. The chip row (.chips-row, z-index:1) sits below
         .daily-main. See plans/gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.05), rgba(var(--rgb-primary-color, 3, 169, 244), 0.05));
      border-radius: 10px;
      overflow: hidden;
      /* position:relative clips the ha-ripple surface. */
      position: relative;
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
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
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