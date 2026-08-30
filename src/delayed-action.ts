// ──────────────────────────────────────────────
// AX Dose Logger Card — Delayed-action directive
// ──────────────────────────────────────────────
// Wraps a click callback in a short setTimeout so the <ha-ripple> press
// animation has time to render before the controller fires the action and
// triggers a Lit re-render (which would otherwise interrupt MdRipple's
// requestAnimationFrame chain and truncate the ripple).
//
// The delay (110ms) is deliberately shorter than HA's stock actionHandler
// disambiguation window (~250ms) per user request — enough to let the
// ripple visibly expand past its peak, but not so long that the action
// feels sluggish.
//
// Implemented as a Lit AsyncDirective so the event-listener wrapper is
// STABLE across re-renders (Lit memoizes the directive instance per
// binding position), which:
//   1. Avoids re-binding @click on every render (Lit diffs listener
//      identity; a stable wrapper means no add/removeEventListener churn).
//   2. Keeps the clearTimeout dedup correct across re-renders — the timer
//      handle lives on the directive instance, not in a per-render closure,
//      so a second rapid click always sees + cancels the first timer.
//   3. Auto-cleans the pending timer when the host element is disconnected
//      (disconnected() lifecycle), preventing a stale callback firing on a
//      detached element.
//
// Usage in Lit templates (replaces a raw `@click`):
//   @click=${delayedAction(() => c.handleTakePill(e))}
//
// For elements that also need hold/double-tap, keep the separate
// @contextmenu / @dblclick bindings — those are user-intent-disambiguated
// by the browser and do not interfere with the ripple.

import { AsyncDirective, directive } from 'lit/async-directive.js';
import type { PartInfo } from 'lit/async-directive.js';
import type { Part } from 'lit';

/** Delay in ms before the wrapped action fires. */
export const RIPPLE_ACTION_DELAY_MS = 110;

/**
 * AsyncDirective that binds a stable click listener which fires the latest
 * callback after RIPPLE_ACTION_DELAY_MS.
 *
 * The directive instance is memoized by Lit for the lifetime of the binding
 * position (the `@click=${…}` part), so the listener wrapper returned from
 * `render()` is the SAME function reference across re-renders. Only the
 * callback it dispatches to is updated (via the `_latest` field), which is
 * what we want: no listener churn, correct timer dedup, auto-cleanup.
 *
 * The wrapper cancels any pending timer on a second rapid press so that the
 * action fires once per click even during rapid tapping — and because the
 * timer handle lives on the directive instance (not a per-render closure),
 * the dedup works correctly even when a re-render happens between two
 * rapid clicks (the bug the prior inline-closure implementation had).
 */
class DelayedActionDirective extends AsyncDirective {
  /** Pending setTimeout handle, or undefined when no timer is armed. */
  private _timer: number | undefined;
  /** Latest callback to fire when the timer expires. Updated on every
   *  render via update() so the wrapper always dispatches the fresh
   *  callback (which may close over newer entity state). */
  private _latest: ((ev: Event) => void) | null = null;
  /** The stable event-listener wrapper. Created once per directive
   *  instance and bound to @click for the lifetime of the part. Reads
   *  _latest + _timer off the instance so it stays correct across
   *  re-renders without being recreated. */
  private _wrapper: (ev: Event) => void;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    // Bind the wrapper to this instance once. The same function reference
    // is returned from render() on every update → Lit does NOT re-bind the
    // @click listener (it diffs listener identity and skips if unchanged).
    this._wrapper = (ev: Event) => {
      if (this._timer !== undefined) {
        clearTimeout(this._timer);
      }
      this._timer = window.setTimeout(() => {
        this._timer = undefined;
        // Defensive: the timer may fire after the host element was
        // disconnected (disconnectedCallback clears the timer, but a
        // native setTimeout callback already queued before the clear
        // could still run in the same microtask). Guard with isConnected.
        if (!this.isConnected) return;
        this._latest?.(ev);
      }, RIPPLE_ACTION_DELAY_MS);
    };
  }

  /**
   * Called by Lit on the initial render AND every subsequent update of the
   * @click part. Returns the stable wrapper so Lit keeps the same listener
   * bound, and refreshes _latest so the wrapper dispatches the newest
   * callback (which closes over the current render's state).
   */
  render(callback: (ev: Event) => void): (ev: Event) => void {
    this._latest = callback;
    return this._wrapper;
  }

  /**
   * Called by Lit on every update (including the first). Mirrors render()
   * but runs after the part is committed. We update _latest here as well so
   * the freshest callback is in place regardless of which hook Lit uses.
   */
  update(_part: Part, [callback]: Array<(ev: Event) => void>): unknown {
    this._latest = callback;
    return this.render(callback);
  }

  /**
   * Lit lifecycle hook — fired when the host element is disconnected or the
   * part is removed. Cancels any pending timer so a stale callback can't
   * fire on a detached element (which would call requestUpdate / mutate
   * @state on an element no longer in the DOM).
   */
  protected disconnected(): void {
    if (this._timer !== undefined) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
    // Drop the callback reference so a queued timer callback (cleared
    // above, but defense-in-depth) can't reach a stale closure.
    this._latest = null;
    super.disconnected();
  }

  /**
   * Reconnected lifecycle hook — Lit reuses the directive instance when the
   * host element is re-attached, so _wrapper stays stable. No action needed
   * beyond the base class; the next render() will refresh _latest.
   */
  protected reconnected(): void {
    super.reconnected();
  }
}

/**
 * The internal directive factory. Lit memoizes the directive instance per
 * binding position, so the same DelayedActionDirective (and its stable
 * _wrapper) is reused across re-renders — only the callback argument is
 * refreshed.
 */
const _delayedActionDirective = directive(DelayedActionDirective);

/**
 * Public typed wrapper. Use in Lit templates:
 *   @click=${delayedAction(() => doThing())}
 *
 * WHY THE WRAPPER EXISTS: lit-analyzer cannot see through a directive
 * factory's DirectiveResult<...> return type in an event-listener binding
 * position, so every `@click=${directive(...)}` usage is flagged with
 * "You are setting up an event listener with a non-callable type". At
 * runtime Lit fully supports directives in event bindings — the directive
 * IS the listener (its render() returns the stable wrapper function) — so
 * this is purely a static-analysis limitation. Casting the result to the
 * listener signature in ONE place (here) satisfies the analyzer for every
 * call site without changing any runtime behavior: the DirectiveResult
 * value flows through unchanged and Lit unwraps it exactly as before.
 */
export function delayedAction(callback: (ev: Event) => void): (ev: Event) => void {
  return _delayedActionDirective(callback) as unknown as (ev: Event) => void;
}