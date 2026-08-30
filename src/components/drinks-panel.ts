// ──────────────────────────────────────────────
// AX Dose Logger Card — Drinks Pane (Master Tracker, Pane "drinks")
// ──────────────────────────────────────────────
// Shown when the selected device is a Master Tracker (Caffeine Tracker /
// Alcohol Tracker). Layout mirrors the Daily pane exactly:
//   - Title row is rendered by the card container (ax-dose-logger-card.ts)
//     as a unified Substance - Profile row shown on every pane.
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
import { keyed } from 'lit/directives/keyed.js';
import { delayedAction } from '../delayed-action.js';
import type { ActionConfig } from 'custom-card-helpers';
import type { CardController, ResolvedEntities, AxDoseLoggerHass, ButtonStateStyle, IconStyle, AckLayout, RingSpeed } from '../types.js';
import type { ButtonState } from '../helpers.js';
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
  // ── Button State Matrix (Prosumer UI) — Drinks ──
  // Drinks are PRN/as-needed with no schedule, so only lockout + ack states
  // are possible. Resolved by the container's _computeDrinksButtonState.
  @property({ attribute: false }) buttonState: ButtonState = 'idle';
  @property({ attribute: false }) ackActive: boolean = false;
  // Rapid successive-click count from the container. 0 means no ACK active,
  // 1 means first press (no suffix rendered), 2 and above means "Logged {n}x".
  // Drives the ack-text suffix on top/inline layouts and the Nx badge on the
  // big layout. Mirrors the Daily panel. See plans/rapid-click-count-plan.md.
  @property({ attribute: false }) ackCount: number = 0;

  private get _lang(): string {
    return this.controller.lang;
  }

  /**
   * Build the CSS class string for the Log Drink button from the resolved
   * ButtonState + the per-state style + icon_style options. Mirrors the
   * Daily panel's _takeButtonClasses but only handles lockout + ack (the two
   * states possible for PRN drinks). 'auto' resolves to the per-state default
   * at runtime. 'idle' renders only the base button.
   */
  private _logDrinkButtonClasses(): string {
    const state = this.buttonState;
    const cfg = this.controller.config;
    // Per-state default (used when value is 'auto' or undefined).
    const STATE_DEFAULTS = {
      lockout: { style: 'full' as ButtonStateStyle, iconStyle: 'none' as IconStyle },
    };
    let style: ButtonStateStyle = 'none';
    let iconStyle: IconStyle = 'none';
    if (state === 'lockout') {
      const d = STATE_DEFAULTS.lockout;
      style = cfg?.drink_button_lockout_style ?? d.style;
      if (style === 'auto') style = d.style;
      iconStyle = cfg?.drink_button_lockout_icon_style ?? d.iconStyle;
      if (iconStyle === 'auto') iconStyle = d.iconStyle;
    } else {
      // idle — no color, no style option (theme default).
      return this.ackActive ? 'log-drink-btn ack-flash' : 'log-drink-btn';
    }
    const color = state === 'lockout' ? 'red' : 'green';
    const classes: string[] = ['log-drink-btn', `state-${state}`];
    if (style === 'full') classes.push(`full-${color}`);
    if (style === 'border') classes.push(`border-${color}`);
    if (style === 'ring') classes.push(`ring-${color}`);
    if (style === 'glow') classes.push(`style-none`);  // glow renders on the wrapper backdrop, not the button face
    if (style === 'none') classes.push('style-none');
    if (iconStyle === 'color' || iconStyle === 'color_pulse') classes.push(`icon-${color}`);
    if (iconStyle === 'color_pulse' || iconStyle === 'pulse') classes.push('pulse');
    // ACK overlay is a pure flash layered on top of the true state — it does
    //    not recolor the button, so the real state stays correct underneath.
    if (this.ackActive) classes.push('ack-flash');
    return classes.join(' ');
  }

  /** Resolve the rotating ring animation duration (CSS string) from the
   *  per-button ring_speed config. 'medium' (4s) is the default. Shared by
   *  the ring sweep and the ambilight glow breathing. Mirrors daily-panel. */
  private _ringDuration(): string {
    const speed: RingSpeed = this.controller.config?.drink_button_ring_speed ?? 'medium';
    return speed === 'slow' ? '6s' : speed === 'medium' ? '4s' : '2.2s';
  }

  /** Resolve the wrapper class for the ambilight glow backdrop. Returns ''
   *  when the resolved style is not 'glow' (backdrop hidden, no GPU layer).
   *  Mirrors daily-panel._takeGlowWrapClass. See plans/
   *  architecture-rollback-z-axis-stacking-plan.md. */
  private _logDrinkGlowWrapClass(): string {
    const state = this.buttonState;
    const cfg = this.controller.config;
    let style: ButtonStateStyle = 'none';
    if (state === 'lockout') {
      style = cfg?.drink_button_lockout_style ?? 'full';
      if (style === 'auto') style = 'full';
    } else {
      return ''; // idle — no glow
    }
    if (style !== 'glow') return '';
    const color = state === 'lockout' ? 'red' : 'green';
    return `glow-${color}`;
  }

  /** Resolve the ACK (Logged) flash layout from the per-button ack_layout
   *  config. 'top' is the default and mirrors the normal button layout. */
  private _ackLayout(): AckLayout {
    return this.controller.config?.drink_button_ack_layout ?? 'top';
  }

  /** Resolve the ACK (Logged) flash label text, appending the rapid-click
   *  count suffix ("Logged 2x", "Logged 3x" …) when the count is 2 or more.
   *  The first press (count 1) shows the bare "Logged" with no suffix so no
   *  "1x" is rendered. Mirrors the Daily panel's _ackLabelText. */
  private _ackLabelText(): string {
    const base = localize(this._lang, 'button.ack_text'); // "Logged"
    return this.ackCount >= 2 ? `${base} ${this.ackCount}x` : base;
  }

  render() {
    const c = this.controller;
    const e = this.entities;
    const substance = e.substance;
    const cfg = c.config;
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
    // Tap fallback: the Sleep Disruption popup opens for ALL three disruption
    // modes (disruption / low_timestamp / low_hours_until) as long as a
    // substance is resolved — the popup now shows all three values in its
    // summary, so it's useful regardless of which mode the box is in.  Falls
    // back to more-info on the display entity only when no substance is set.
    const disruptionTapFallback = () => {
      if (substance) {
        c.showSleepDisruptionDialog(substance);
      } else if (disruptionDisplayEntity) {
        c.openMoreInfo(disruptionDisplayEntity);
      }
    };
    const disruptionClickable = dHasCustomTap || dHasHold || dHasDblClick || !!disruptionDisplayEntity || !!substance;

    // ── Custom chips (Drinks panel) — parallel to the Daily panel chips ──
    const drinkChipEntities = c.getDrinkChipEntities();

    return html`
      <div class="pane pane-drinks">

        <div class="daily-main">
          <div class="log-drink-wrap${this._logDrinkGlowWrapClass() ? ' ' + this._logDrinkGlowWrapClass() : ''}"
               style=${`--ring-duration: ${this._ringDuration()}`}
          >
            <div class="glow-backdrop"></div>
            <button
              class=${this._logDrinkButtonClasses()}
              style=${this.ackActive ? `--ack-duration: ${this.controller.config?.drink_button_ack_duration_ms ?? 3000}ms` : ''}
              aria-label=${logDrinkLabel}
              ?disabled=${!substance}
              @click=${delayedAction(() => substance && c.showLogDrinkDialog(substance))}
            >
              <div class="ring-track"></div>
              <ha-ripple ?disabled=${!substance}></ha-ripple>
            <ha-icon icon="${logDrinkIcon}"></ha-icon>
            <span class="take-label">${logDrinkLabel}</span>
            <span class="take-sub"><span class="take-sub-segment">${localize(this._lang, 'daily.last')}: ${timeSince}</span></span>
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
            <div class="stat-pill ${inBodyClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${inBodyClickable ? 0 : -1}
                 aria-label=${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}
                 @click=${inBodyClickable ? delayedAction((ev: Event) => c.handleInBodyBoxAction(ev, 'tap', inBodyActionConfig, inBodyDisplayEntity)) : null}
                 @keydown=${inBodyClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleInBodyBoxAction(null, 'tap', inBodyActionConfig, inBodyDisplayEntity)) : null}
                 @contextmenu=${ibHasHold ? (ev: Event) => { ev.preventDefault(); c.handleInBodyBoxAction(null, 'hold', inBodyActionConfig, inBodyDisplayEntity); } : null}
                 @dblclick=${ibHasDblClick ? () => c.handleInBodyBoxAction(null, 'double_tap', inBodyActionConfig, inBodyDisplayEntity) : null}>
              ${inBodyClickable ? html`<ha-ripple></ha-ripple>` : nothing}
               <ha-icon icon="${cfg?.in_body_icon || 'mdi:chart-bell-curve'}"></ha-icon>
              <span class="stat-label">${cfg?.in_body_label || localize(this._lang, 'drinks.in_body')}</span>
              <span class="stat-value">${inBodyValue}</span>
            </div>
            <div class="stat-pill ${disruptionClickable ? 'clickable' : ''}"
                 role="button"
                 tabindex=${disruptionClickable ? 0 : -1}
                 aria-label=${cfg?.disruption_label || disruptionDefaultLabel}
                 @click=${disruptionClickable ? delayedAction((ev: Event) => c.handleDisruptionBoxAction(ev, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback)) : null}
                 @keydown=${disruptionClickable ? (ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleDisruptionBoxAction(null, 'tap', disruptionActionConfig, disruptionDisplayEntity, disruptionTapFallback)) : null}
                 @contextmenu=${dHasHold ? (ev: Event) => { ev.preventDefault(); c.handleDisruptionBoxAction(null, 'hold', disruptionActionConfig, disruptionDisplayEntity); } : null}
                 @dblclick=${dHasDblClick ? () => c.handleDisruptionBoxAction(null, 'double_tap', disruptionActionConfig, disruptionDisplayEntity) : null}>
              ${disruptionClickable ? html`<ha-ripple></ha-ripple>` : nothing}
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
                      @click=${delayedAction((ev: Event) => c.handleDrinkChipAction(ev, 'tap', chipActionCfg, chip.entityId))}
                      @keydown=${(ev: KeyboardEvent) => c.onKeyActivate(ev, () => c.handleDrinkChipAction(null, 'tap', chipActionCfg, chip.entityId))}
                      @contextmenu=${hasHold ? (ev: Event) => { ev.preventDefault(); c.handleDrinkChipAction(null, 'hold', chipActionCfg, chip.entityId); } : null}
                      @dblclick=${hasDblClick ? () => c.handleDrinkChipAction(null, 'double_tap', chipActionCfg, chip.entityId) : null}>
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
    :host {
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }
    .pane-drinks {
      display: flex;
      flex-direction: column;
      gap: 12px;
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
      position: relative;  /* global z-axis protection — glow bleeds behind stats (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    /* Wrapper for the ambilight glow backdrop. Becomes the .daily-main flex
       child (replaces the button's flex role). isolation:isolate + z-index:0
       spawn a localized z-axis boundary. Mirrors daily-panel .take-pill-wrap.
       See plans/architecture-rollback-z-axis-stacking-plan.md. */
    .log-drink-wrap {
      position: relative;
      z-index: 0;
      isolation: isolate;
      display: flex;
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
      transition: background 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
      flex: 1;
      z-index: 1;  /* stack above the .glow-backdrop (z-index:-1) */
      /* Reserve the full two-line-sub-text button height permanently (mirrors
         daily-panel.ts .take-pill-btn). justify-content: center distributes
         the reserved height as symmetric top/bottom padding so the
         icon→label→sub gap stays the fixed 2px (uniform) and only the outer
         padding changes. min-height in em (relative to 16px base font) scales
         with --pill-text-offset. ≈ 128px = 8em. */
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
    .log-drink-btn > ha-ripple {
      z-index: 3;
    }
    /* State-coloured ripples — the press feedback colour matches the button's
       current medical state (richer than Mushroom's single colour, fits the
       Button State Matrix). The ACK state uses a light tint so the ripple
       reads on the opaque dark-green overlay surface (#212c22). */
    .log-drink-btn.state-lockout { --ha-ripple-color: var(--btn-red); }
    .log-drink-btn.ack-flash { --ha-ripple-color: #ffffff; }

    /* ── Button State Matrix (Prosumer UI) — Drinks ──
       Only lockout + ack are possible for PRN drinks. Mirrors the Daily
       panel's CSS structure (full / border / none / ring / icon / pulse / ack).
       The default (idle / no state class) keeps the original theme-tinted
       safe look. See plans/button-state-matrix-plan.md §1.2. */
    :host {
      --btn-red: var(--error-color, #db4437);
      --rgb-btn-red: var(--rgb-error-color, 219, 68, 55);
      --btn-green: #43a047;
      --rgb-btn-green: 67, 160, 71;
      /* Dark green surface for the Logged Dose Indicator (ACK) overlay.
         High contrast against the bright --btn-green glyph so the tick/text
         are clearly legible; opaque so the underlying button state (red)
         does not bleed through behind the green tick. See plans/
         ack-clarity-and-softening-plan.md (Issue 2). */
      --btn-green-soft: #212c22;
    }

    /* Base idle (no state class) — original theme-tinted safe look.
       Gradient-stack surface: opaque --card-background-color base wall blocks
       the ambilight backlight; flat rgba(...,0.12) tint layer (linear-gradient
       with identical stops = flat color) restores the perceptual tint. See
       plans/gradient-stacking-material-synthesis-plan.md. */
    .log-drink-btn:not(.state-lockout):not(.state-ack) {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .log-drink-btn:not(.state-lockout):not(.state-ack):hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.2), rgba(var(--rgb-primary-color, 3, 169, 244), 0.2));
    }

    /* Option 1 — Full Button (red lockout / green ack). Gradient-stack
       surface: opaque --card-background-color base wall blocks the ambilight
       backlight; flat rgba(var(--rgb-btn-*),0.12) tint layer restores the
       identity-color tint. See plans/
       gradient-stacking-material-synthesis-plan.md. */
    .log-drink-btn.full-red    { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.12), rgba(var(--rgb-btn-red), 0.12));    color: var(--btn-red); }
    .log-drink-btn.full-red:hover    { background-image: linear-gradient(rgba(var(--rgb-btn-red), 0.2), rgba(var(--rgb-btn-red), 0.2)); }
    .log-drink-btn.full-green { background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c)); background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.12), rgba(var(--rgb-btn-green), 0.12)); color: var(--btn-green); }
    .log-drink-btn.full-green:hover { background-image: linear-gradient(rgba(var(--rgb-btn-green), 0.2), rgba(var(--rgb-btn-green), 0.2)); }

    /* Option 2 — Icon recolor only (Icon Style: color / color_pulse). The >
       child combinator scopes the recolor to the button's OWN icon only — the
       nested ACK tick is excluded so it keeps its own color. Do NOT set
       background/color here: every Style option emits its own bg rule with
       equal specificity, and a bg here would tie with .full-{color} and win
       by source order, erasing the Full Button tint (bug: Full Button only
       worked with Icon Style None or Pulse Only). See plans/
       full-button-icon-style-override-fix-plan.md. */
    .log-drink-btn.icon-red > ha-icon    { color: var(--btn-red); }
    .log-drink-btn.icon-green > ha-icon  { color: var(--btn-green); }

    /* Option 3 — Border only (inset box-shadow so the button does not grow;
       a real border would add 2px to the outer size on each side). */
    .log-drink-btn.border-red, .log-drink-btn.border-green {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    .log-drink-btn.border-red    { box-shadow: inset 0 0 0 2px var(--btn-red); }
    .log-drink-btn.border-green  { box-shadow: inset 0 0 0 2px var(--btn-green); }

    /* Option 6 — Rotating Ring (Apple Intelligence perimeter sweep).
       TWO-LAYER architecture (required: the mask-ring and the rotation-oversize
       cannot share one element — oversizing moves the mask's content-box ring
       off the button, where overflow:hidden clips it away → nothing renders).
       Layer 1 .ring-track: button-sized (inset 0), holds the mask that carves
       the 2px ring on the button edge + overflow:hidden to clip the rotating
       child to the rounded perimeter. Layer 2 .ring-track::before: oversized
       (inset -150%) rotating gradient source; the track's mask carves the ring
       from this rotating gradient. transform animates without @property. */
    @keyframes ax-drink-btn-ring-sweep { to { transform: rotate(360deg); } }
    .log-drink-btn.ring-red, .log-drink-btn.ring-green {
      position: relative;
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }
    /* Layer 1 — the static geometry mask. Button-sized so the mask ring sits
       exactly on the button edge. padding:2px defines the ring thickness;
       border-radius:inherit follows the rounded corners; overflow:hidden clips
       the rotating child to the perimeter. */
    .log-drink-btn .ring-track {
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
    .log-drink-btn .ring-track::before {
      content: '';
      position: absolute;
      inset: -150%;
      animation: ax-drink-btn-ring-sweep var(--ring-duration, 2.2s) linear infinite;
    }
    /* State color → gradient. 85% line with a solid-color middle (76.5→229.5,
       153deg = 50% of the line) so the state color stays unambiguous; a
       white-tipped shimmer head at 306deg (color-mix lifts toward #fff); a
       crisp head edge (306→306.1deg near-zero stop); 54deg transparent gap. */
    .log-drink-btn.ring-red .ring-track::before    { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-red)    76.5deg, var(--btn-red)    229.5deg, color-mix(in srgb, var(--btn-red)    60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }
    .log-drink-btn.ring-green .ring-track::before  { background: conic-gradient(from 0deg, transparent 0deg, var(--btn-green)  76.5deg, var(--btn-green)  229.5deg, color-mix(in srgb, var(--btn-green)  60%, #fff) 306deg, transparent 306.1deg, transparent 360deg); }

    /* Option 6 — Ambilight Glow (GPU-composited diffused backlight + breathing).
       Mirrors daily-panel: a .glow-backdrop div behind the button (inside the
       .log-drink-wrap wrapper) bleeds outward (inset:-9px) with a STATIC
       filter:blur(8px); the breathing animates OPACITY only (GPU-composited,
       zero CPU repaint). will-change is sandboxed inside the active glow
       selector so non-glow states release the GPU layer + VRAM. Z-axis: the
       wrapper has isolation:isolate + z-index:0, so the backdrop's z-index:-1
       renders behind the wrapper baseline but in front of the card
       background. See plans/architecture-rollback-z-axis-stacking-plan.md. */
    .log-drink-wrap .glow-backdrop {
      position: absolute;
      inset: -9px;
      z-index: -1;
      border-radius: calc(var(--ha-card-border-radius, 12px) + 9px);
      background: var(--glow-color, transparent);
      filter: blur(8px);
      opacity: 0;
      pointer-events: none;
      /* will-change OMITTED here — sandboxed inside the active glow selector. */
      /* No animation here — gated to the active glow selector below. */
    }
    .log-drink-wrap.glow-red    { --glow-color: rgba(var(--rgb-btn-red), 0.85); }
    .log-drink-wrap.glow-green  { --glow-color: rgba(var(--rgb-btn-green), 0.85); }
    .log-drink-wrap.glow-red .glow-backdrop,
    .log-drink-wrap.glow-green .glow-backdrop {
      opacity: 0.6;
      will-change: opacity;
      animation: ax-btn-glow-breathe var(--ring-duration, 4s) ease-in-out infinite;
    }
    /* Shared breathing keyframe (same name as daily-panel; Lit scopes CSS so
       the two definitions don't conflict — both are identical opacity-only
       keyframes). */
    @keyframes ax-btn-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50%      { opacity: 0.85; }
    }

    /* Option 5 — No change (theme default). The surface is still solidified
       (alpha-1.0) to occlude the ambilight backlight; only the color
       identity is left at the theme default primary tint. */
    .log-drink-btn.style-none {
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
      color: var(--primary-color, #03a9f4);
    }

    /* Icon-pulse animation. */
    @keyframes ax-drink-btn-icon-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%      { transform: scale(1.15); opacity: 0.7; }
    }
    .log-drink-btn.pulse ha-icon {
      animation: ax-drink-btn-icon-pulse 1.2s ease-in-out infinite;
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
    .log-drink-btn .ack-flash {
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
      animation: ax-drink-btn-ack-intro 240ms ease-out both, ax-drink-btn-ack-fade var(--ack-duration, 3000ms) ease-out 240ms forwards;
      pointer-events: none;
      z-index: 2;
    }
    /* Rapid-click repeat: on the 2nd+ press the overlay is already at full
       opacity, so skip the 240ms intro (no flicker) and run only the fade
       animation from the start. The keyed() directive recreates the element
       on each ackCount change, restarting the animation so the fade timer
       effectively resets with each click. */
    .log-drink-btn .ack-flash.ack-repeat {
      animation: ax-drink-btn-ack-fade var(--ack-duration, 3000ms) ease-out forwards;
    }
    /* Option 1 — Top tick mark and text (default; mirrors button layout). */
    .log-drink-btn .ack-flash.ack-top {
      flex-direction: column;
      gap: 4px;
    }
    .log-drink-btn .ack-flash.ack-top .ack-icon { --mdc-icon-size: 28px; }
    .log-drink-btn .ack-flash.ack-top .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 2 — Tick mark and text inline (the prior single-line layout). */
    .log-drink-btn .ack-flash.ack-inline {
      flex-direction: row;
      gap: 8px;
    }
    .log-drink-btn .ack-flash.ack-inline .ack-icon { --mdc-icon-size: 24px; }
    .log-drink-btn .ack-flash.ack-inline .ack-text {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      font-weight: 600;
    }
    /* Option 3 — Big tickmark only (no text). */
    .log-drink-btn .ack-flash.ack-big .ack-icon { --mdc-icon-size: 56px; }
    /* Rapid-click count badge for the big (tickmark-only) ACK layout.
       Hidden on top/inline (those embed the count in ack-text). Sized to
       match the big tickmark's visual weight (56px icon) so the count reads
       as a peer of the tick, not a footnote. Mirrors the Daily panel's badge. */
    .log-drink-btn .ack-flash.ack-big .ack-count-badge {
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
    @keyframes ax-drink-btn-ack-intro {
      0%   { opacity: 0; transform: scale(0.96); }
      100% { opacity: 1; transform: scale(1); }
    }
    /* Hold + fade-out. Starts at opacity 1 (the intro's end state) and is
       delayed by 240ms (see the animation shorthand above) so it begins
       exactly when the intro finishes. */
    @keyframes ax-drink-btn-ack-fade {
      0%   { opacity: 1; transform: scale(1); }
      70%  { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1); }
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
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.06) tint layer restores the
         perceptual tint. The .stats-column at z-index:1 is a sibling of
         .log-drink-wrap. See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.06), rgba(var(--rgb-primary-color, 3, 169, 244), 0.06));
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      flex: 1;
      /* position:relative clips the ha-ripple surface. */
      position: relative;
    }

    .stat-pill.clickable {
      cursor: pointer;
    }

    .stat-pill.clickable:hover {
      background-image: linear-gradient(rgba(var(--rgb-primary-color, 3, 169, 244), 0.12), rgba(var(--rgb-primary-color, 3, 169, 244), 0.12));
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

    /* ── Custom chips — verbatim from daily-panel.ts ──
       Z-axis dependency (Patch 1, belt-and-suspenders): z-index is a null
       operation on static elements, so position:relative MUST accompany
       z-index:1. Without this the 9px .glow-backdrop diffusion (inset:-9px,
       bleeding beyond .daily-main) paints on top of the chips. The wrapper's
       isolation:isolate floor (z-index:0) contains the backdrop at z-index:-1;
       this lifts the chips above that floor. Mirrors daily-panel .chips-row. */
    .chips-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      position: relative;  /* global z-axis protection — glow bleeds behind chips */
      z-index: 1;
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
      /* Gradient-stack surface: opaque --card-background-color base wall blocks
         the ambilight backlight; flat rgba(...,0.05) tint layer restores the
         perceptual tint. The .chips-row (z-index:1) sits below .daily-main.
         See plans/gradient-stacking-material-synthesis-plan.md. */
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
    'ax-dose-drinks-panel': AxDoseDrinksPanel;
  }
}