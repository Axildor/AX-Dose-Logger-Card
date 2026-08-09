// ──────────────────────────────────────────────
// Pure helpers for the AX Dose Logger Card
// ──────────────────────────────────────────────
// Stateless functions decoupled from the card instance, so they can be shared
// by the container (AxDoseLoggerCard) and the presentational panel components
// without each needing a `this` reference. The container's `_foo` private
// methods become one-line delegates to these (see ax-dose-logger-card.ts), and
// the panel components import them directly.

import type { AxDoseLoggerHass } from './types.js';

/**
 * Parse a state string to an integer display string. Returns the original
 * string untouched when it isn't a number (e.g. 'unavailable', 'unknown').
 */
export function formatInteger(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return Math.round(num).toString();
}

/**
 * Build a YYYY-MM-DD date key from a Date using LOCAL timezone components
 * (NOT .toISOString(), which shifts to UTC and mis-buckets late-night doses
 * for users ahead of UTC).
 */
export function toLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Bridge gaps in an amount-in-body history series so the polyline renders flat
 * holds + vertical steps instead of misleading diagonal slopes across flat
 * plateaus (HA's recorder discards same-value sensor reports, so a constant
 * value produces sparse points).
 *
 * For each gap > gapMs, inserts a hold point (previous value at nextTimestamp
 * − 1s) so the line stays flat until the value actually changes.
 */
export function bridgeGaps(
  history: Array<{ timestamp: string | number | Date; value: number }>,
  gapMs: number = 3 * 60 * 1000,
): Array<{ timestamp: number; value: number }> {
  if (history.length < 2) {
    return history.map((p) => ({
      timestamp: new Date(p.timestamp).getTime(),
      value: p.value,
    }));
  }
  const bridged: Array<{ timestamp: number; value: number }> = [];
  for (let i = 0; i < history.length; i++) {
    const current = {
      timestamp: new Date(history[i].timestamp).getTime(),
      value: history[i].value,
    };
    if (i > 0) {
      const prev = bridged[bridged.length - 1];
      if (current.timestamp - prev.timestamp > gapMs) {
        bridged.push({
          timestamp: current.timestamp - 1000,
          value: prev.value,
        });
      }
    }
    bridged.push(current);
  }
  return bridged;
}

/**
 * Resolve a color-scheme name into an inline CSS custom-property string
 * overriding --primary-color + --rgb-primary-color. Returns '' for the default
 * scheme (lets HA's theme variables pass through).
 */
export function getColorOverrides(scheme?: string): string {
  const schemes: Record<string, { primary: string; rgb: string }> = {
    default: { primary: '', rgb: '' },
    blue: { primary: '#03a9f4', rgb: '3, 169, 244' },
    red: { primary: '#e53935', rgb: '229, 57, 53' },
    green: { primary: '#43a047', rgb: '67, 160, 71' },
    yellow: { primary: '#fdd835', rgb: '253, 216, 53' },
    orange: { primary: '#fb8c00', rgb: '251, 140, 0' },
    purple: { primary: '#7e57c2', rgb: '126, 87, 194' },
    pink: { primary: '#d81b60', rgb: '216, 27, 96' },
    teal: { primary: '#00897b', rgb: '0, 137, 123' },
    brown: { primary: '#795548', rgb: '121, 85, 72' },
    coral: { primary: '#ff7043', rgb: '255, 112, 67' },
    slate: { primary: '#546e7a', rgb: '84, 110, 122' },
    gold: { primary: '#daa520', rgb: '218, 165, 32' },
    grey: { primary: '#9e9e9e', rgb: '158, 158, 158' },
  };
  const colors = schemes[scheme || 'default'];
  if (!colors || !colors.primary) return '';
  return `--primary-color: ${colors.primary}; --rgb-primary-color: ${colors.rgb};`;
}

/**
 * Read a HA entity's state string. Returns 'unavailable' when the entity id is
 * missing, hass isn't set yet, or the entity doesn't exist in the states map.
 */
export function getState(hass: AxDoseLoggerHass | undefined, entityId?: string): string {
  if (!entityId || !hass) return 'unavailable';
  const state = hass.states[entityId];
  return state ? state.state : 'unavailable';
}

/**
 * Read a HA entity state attribute by name. Returns undefined when the entity
 * id / attribute name is missing, hass isn't set yet, or the attribute isn't
 * present on the entity.
 */
export function getAttr(
  hass: AxDoseLoggerHass | undefined,
  entityId?: string,
  attr?: string,
): any {
  if (!entityId || !attr || !hass) return undefined;
  const state = hass.states[entityId];
  return state?.attributes?.[attr];
}

/**
 * Convert an amount-in-body line-graph timeframe id to hours.
 * Shared by the container (_fetchAmountHistory) and the graphs panel
 * (render), so both use the same mapping without duplicating the switch.
 */
export function getTimeframeHours(timeframe: string): number {
  switch (timeframe) {
    case '12h': return 12;
    case '24h': return 24;
    case '7d': return 168;
    case '14d': return 336;
    case '30d': return 720;
    default: return 48;
  }
}

// ──────────────────────────────────────────────
// Button State Matrix (Prosumer UI)
// ──────────────────────────────────────────────
// Pure state resolver shared by the Daily (Take Pill) and Drinks (Log Drink)
// panel buttons. The container computes the ButtonStateInput from resolved
// entities + the transient ACK flag, then this function maps it to one of 5
// states per the Prosumer UI State Matrix (plans/button-state-matrix-plan.md).
//
// Precedence: ack (transient, always wins) → lockout (hard stop) → latency →
// execution → idle. The 'idle' state has no color and is never user-configured.

/**
 * One of the 5 states in the Prosumer UI State Matrix. The 'idle' state has no
 * color assignment (theme default) and is excluded from the editor config.
 */
export type ButtonState = 'lockout' | 'idle' | 'execution' | 'latency' | 'ack';

/**
 * Inputs to resolveButtonState(), supplied by the container from resolved
 * entities + the transient ACK flag. All fields are boolean/numeric so the
 * resolver stays pure + testable with no `this` / hass reference.
 */
export interface ButtonStateInput {
  /** Hard stop: cooldown active or max limit reached (prevents double-dose). */
  isLockedOut: boolean;
  /** True for scheduled (non-PRN) medications — gates execution/latency. */
  isScheduled: boolean;
  /** Seconds past the missed scheduled slot. 0 when on-time / not yet due. */
  overdueSeconds: number;
  /** Adherence grace period in hours (on-time buffer). Read from the
   *  adherence sensor's `grace_hours` attribute; fallback 1.0h. Used only
   *  for the latency boundary — kept here so the resolver is self-contained,
   *  though the overdue-anchored mapping means it's informational. */
  graceHours: number;
  /** Transient ACK flag (container sets it on successful button.press). */
  ackActive: boolean;
}

/**
 * Resolve a ButtonStateInput to a single ButtonState per the matrix precedence.
 * Pure + side-effect-free so both panels share one code path.
 */
export function resolveButtonState(input: ButtonStateInput): ButtonState {
  // ACK is now a pure overlay driven by the panel's `ackActive` flag (rendered
  // via a dedicated `.ack-flash::after` rule). It no longer collapses the
  // resolved state, so the button keeps its true color (lockout/idle/
  // execution/latency) underneath the ack flash. Fixes the "green Take Pill
  // lingering for several seconds after an override press" bug where the ack
  // recolored the whole button green and the recomputed post-ack state fell
  // to 'idle' (theme default) until the backend pushed the new
  // pillsSafeToTake. The 'ack' value stays in the ButtonState union for type
  // compat; it is simply never returned here.
  if (input.isLockedOut) return 'lockout';
  if (input.isScheduled) {
    if (input.overdueSeconds > 0) return 'latency';
    return 'execution';
  }
  return 'idle';
}

/** Fixed duration (ms) of the ACK overlay press-in intro (ax-btn-ack-intro /
 *  ax-drink-btn-ack-intro CSS keyframes). The container freezes the resolved
 *  ButtonState for this long after an ACK trigger so the underlying state
 *  transition (e.g. idle to lockout) is hidden behind the overlay by the time
 *  it commits. Mirrors the CSS keyframe duration exactly — update both
 *  together. Fixed (not proportional to ack_duration_ms). */
export const ACK_INTRO_MS = 240;