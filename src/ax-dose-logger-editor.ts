// ──────────────────────────────────────────────
// AX Dose Logger Card — Visual Editor module
// ──────────────────────────────────────────────
// Extracted from ax-dose-logger-card.ts to keep the main card file focused on
// the runtime dashboard experience. This module owns the two pieces of editor-
// only logic that previously lived on the card class:
//   1. buildEditorForm()       — the ha-form schema + computeLabel/computeHelper
//                                callbacks returned from getConfigForm().
//   2. installEditorGridAlignment() — injects `align-items: end` CSS into every
//                                ha-form shadow root so entity-picker + text-
//                                field grid pairs align by their bottom edges.
//
// Both are imported statically by the container (no dynamic import() → no
// code-splitting → HACS single-file delivery stays intact).

import { localize } from './localize.js';

// ──────────────────────────────────────────────
// Button State Matrix — shared select options
// ──────────────────────────────────────────────
// The 6 Style options (Default sentinel + 5 visual) used by every per-state
// Style dropdown in the Daily and Drinks "Button" submenus. 'auto' is a
// sentinel that resolves to the per-state default at runtime. Kept module-
// scoped so the schema below references one source of truth (adding/
// reordering an option here updates both submenus). Labels come from
// localize('button_style.*'). See plans/icon-style-dropdown-separation-plan.md
// + plans/ambilight-glow-style-plan.md (the 6th 'glow' option).
function _buttonStyleOptions() {
  return [
    { value: 'auto', label: localize('en', 'button_style.auto') },
    { value: 'full', label: localize('en', 'button_style.full') },
    { value: 'border', label: localize('en', 'button_style.border') },
    { value: 'none', label: localize('en', 'button_style.none') },
    { value: 'ring', label: localize('en', 'button_style.ring') },
    { value: 'glow', label: localize('en', 'button_style.glow') },
  ];
}

// The 5 Icon Style options (Default sentinel + 4 visual) used by every
// per-state Icon Style dropdown. 'auto' resolves to the per-state default
// at runtime. The 4 visual options form a 2x2 matrix (color on/off x pulse
// on/off). Kept module-scoped alongside _buttonStyleOptions. Labels come
// from localize('icon_style.*'). See plans/icon-style-dropdown-separation-plan.md.
function _iconStyleOptions() {
  return [
    { value: 'auto', label: localize('en', 'icon_style.auto') },
    { value: 'none', label: localize('en', 'icon_style.none') },
    { value: 'color', label: localize('en', 'icon_style.color') },
    { value: 'color_pulse', label: localize('en', 'icon_style.color_pulse') },
    { value: 'pulse', label: localize('en', 'icon_style.pulse') },
  ];
}

// The 3 "Logged" (ACK) flash layout options for the take/drink button
// _ack_layout dropdown. Kept module-scoped alongside _buttonStyleOptions so
// all submenus reference one source of truth. Labels come from
// localize('ack_layout.*'). See plans/glow-speed-and-ack-style-plan.md §2.3.
function _ackLayoutOptions() {
  return [
    { value: 'top', label: localize('en', 'ack_layout.top') },
    { value: 'inline', label: localize('en', 'ack_layout.inline') },
    { value: 'big', label: localize('en', 'ack_layout.big') },
  ];
}

// The 3 rotating-ring speed options for the take/drink button _ring_speed
// dropdown. 'medium' (4s) is the default. Labels come from
// localize('ring_speed.*'). See plans/icon-style-dropdown-separation-plan.md.
function _ringSpeedOptions() {
  return [
    { value: 'slow', label: localize('en', 'ring_speed.slow') },
    { value: 'medium', label: localize('en', 'ring_speed.medium') },
    { value: 'fast', label: localize('en', 'ring_speed.fast') },
  ];
}

// ──────────────────────────────────────────────
// Grid-alignment CSS injection
// ──────────────────────────────────────────────

// Module-scoped observer + reference count. The observer is module-scoped so
// repeated installEditorGridAlignment() calls reuse a single observer (one
// process-wide is enough — HA opens at most one card config dialog at a time).
// A reference count guards against premature auto-cleanup when multiple card
// instances on the same dashboard open their editors in quick succession (the
// closing of one editor must not disconnect the observer while another is open).
let _formStyleObserver: MutationObserver | null = null;
let _formStyleRefcount: number = 0;

/**
 * Inject a `<style>` into `ha-form` shadow roots **inside a config dialog**
 * so that entity-picker + text-field pairs inside `type: 'grid'` containers
 * align by their bottom edges.
 *
 * Entity pickers render an external label above the control; text fields render
 * an internal floating label. In a CSS grid row, the text field's control box
 * sits higher than the entity picker's because the entity picker has extra
 * vertical space from the external label. `align-items: end` forces both grid
 * children to align by their bottom edges, so the physical input boxes line up.
 *
 * Uses a MutationObserver to catch `ha-form` elements that appear after the
 * card connects (the config editor dialog opens lazily). The style tag is
 * id-tagged so it's only injected once per shadow root.
 *
 * Called from the container's static getConfigForm() — i.e. only when the
 * user opens the visual editor, not on every dashboard load (was previously
 * in connectedCallback, which installed the observer for every card instance
 * on every dashboard view and never disconnected it → memory leak + needless
 * document-wide DOM scanning). The observer auto-cleans when the config
 * dialog is removed from the DOM, using a **reference count** so that if two
 * card instances' editors are open (or one closes while another is opening),
 * the observer is only disconnected when the last reference is released — not
 * when a transient "0 forms" state occurs during a dialog swap. uninstall-
 * EditorGridAlignment() is available for explicit cleanup if ever needed.
 */
export function installEditorGridAlignment(): void {
  const STYLE_ID = 'ax-dose-grid-align-items-end';
  const CSS = `
    /* Align grid children by bottom edge so entity picker + text field
       control boxes line up despite different label rendering.
       ha-form renders type:grid containers as divs with display:grid
       in their inline style. */
    div[style*="display: grid"],
    div[style*="display:grid"] {
      align-items: end !important;
    }
  `;

  const injectInto = (root: ShadowRoot | HTMLElement): void => {
    if (root.querySelector(`#${STYLE_ID}`)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    root.appendChild(style);
  };

  // Find ha-form elements that are inside an ha-dialog (config editor scope)
  // and inject into their shadow roots. Returns the count of scoped forms so
  // the caller can detect "dialog closed" and self-clean the observer.
  // Only forms inside a dialog receive the injection so we don't pollute
  // ha-form elements used in other dashboard surfaces (N2 cross-card fix).
  const processForms = (): number => {
    const dialogs = document.querySelectorAll('ha-dialog');
    let scopedFormCount = 0;
    dialogs.forEach((dialog) => {
      const forms = dialog.querySelectorAll('ha-form');
      forms.forEach((form) => {
        if (form.shadowRoot) {
          injectInto(form.shadowRoot);
          scopedFormCount++;
        }
      });
    });
    return scopedFormCount;
  };

  // Process existing forms immediately.
  processForms();

  // Bump the reference count — each installEditorGridAlignment() call (one
  // per getConfigForm() invocation, i.e. one per editor open) holds a ref.
  // The observer is only disconnected when the count drops to 0, so a
  // concurrent editor closing while another is open won't prematurely tear
  // down the observer (N6 concurrent-editor race fix).
  _formStyleRefcount++;

  // Set up a MutationObserver to catch forms that appear later (the config
  // dialog's ha-form may render asynchronously after the dialog opens).
  if (_formStyleObserver) {
    // Observer already exists (another editor is open or the prior one's
    // observer hasn't been cleaned up yet) — reuse it, don't disconnect.
    return;
  }
  _formStyleObserver = new MutationObserver(() => {
    const formCount = processForms();
    // Auto-cleanup: when no scoped ha-form remains inside any ha-dialog, the
    // config dialog has closed. Decrement the reference count and disconnect
    // only when no references remain (guards against the concurrent-editor
    // race where one dialog closes while another is still open — N6 fix).
    if (formCount === 0) {
      _formStyleRefcount = Math.max(0, _formStyleRefcount - 1);
      if (_formStyleRefcount === 0) {
        _formStyleObserver?.disconnect();
        _formStyleObserver = null;
      }
    }
  });
  _formStyleObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Explicitly disconnect the editor grid-alignment observer.
 *
 * Not strictly required (the observer auto-cleans when the editor dialog
 * closes), but provided as a defense-in-depth cleanup hook for callers
 * that want to guarantee no observer lingers.
 */
export function uninstallEditorGridAlignment(): void {
  _formStyleRefcount = 0;
  if (_formStyleObserver) {
    _formStyleObserver.disconnect();
    _formStyleObserver = null;
  }
}

// ──────────────────────────────────────────────
// Editor form schema
// ──────────────────────────────────────────────

/**
 * Build the ha-form schema object returned by AxDoseLoggerCard.getConfigForm().
 * HA renders the `<ha-form>` itself from this schema; the container just
 * delegates here so the ~280-line schema + callbacks live in this focused
 * editor module instead of the main card file.
 */
export function buildEditorForm(): { schema: any; computeLabel: any; computeHelper: any } {
  return {
    schema: [
      // ── Top row: Medicine Device (single) ──
      // Medicine / granular-drink device selector. Render-time validation
      // rejects Drink Tracker (Caffeine/Alcohol Tracker) devices here —
      // those belong in the Drink Trackers selector below. HA's device
      // selector only supports `integration` filtering (no negative/
      // attribute filter), so the selector stays unfiltered and the card
      // renders an error placeholder if a tracker device lands in this slot.
      {
        name: 'device_id',
        required: true,
        selector: {
          device: {
            filter: { integration: 'ax_dose_logger' },
          },
        },
      },
      // ── Middle row: Drink Trackers (multi-device) ──
      // Drink Tracker device multi-select (the Caffeine Tracker / Alcohol
      // Tracker virtual devices). When populated (≥1 device), the card runs
      // the multi-profile state machine and ignores the Medicine Device
      // selector above. When empty/absent, the card falls back to the
      // Medicine Device (single medicine / granular drink card — unchanged
      // behavior). The selector is unfiltered (HA's static ha-form device
      // selector cannot filter by a custom device model); the card resolves
      // each selected device to its single `drink_master: True` body-mass
      // sensor and validates single-substance at load, rendering an error
      // placeholder on mismatch. Lazy migration from the legacy
      // `drink_master_entities` (entity IDs) and `drink_target_profile`
      // (Profile Lock UUID) is handled in setConfig() + _resolveTrackers().
      // See plans/drink-tracker-selector-rename-plan.md.
      {
        name: 'drink_tracker_devices',
        selector: {
          device: {
            multiple: true,
            filter: { integration: 'ax_dose_logger' },
          },
        },
      },
      // ── Below both selectors: Name Override ──
      {
        name: 'name',
        selector: { text: {} },
      },
      // ── Row 2: Color Scheme | Default View ──
      // Color Scheme shares a row with Default View; its one-line helper
      // ("*Press card title for more info...") points to the in-card
      // Medical Color Indicators popup (opened via the device-info dialog
      // when the Color Explainer Button toggle is ON). The four colliding
      // colors are listed last and marked with ` *`. Option `value` strings
      // are unchanged, so reordering needs no config migration. See plans/
      // color-scheme-indicator-conflict-plan.md +
      // color-indicators-explainer-popup-plan.md.
      {
        type: 'grid',
        name: '',
        column_min_width: '200px',
        schema: [
          {
            name: 'color_scheme',
            selector: {
              select: {
                options: [
                  { value: 'default', label: localize('en', 'color.default') },
                  { value: 'yellow', label: localize('en', 'color.yellow') },
                  { value: 'purple', label: localize('en', 'color.purple') },
                  { value: 'pink', label: localize('en', 'color.pink') },
                  { value: 'teal', label: localize('en', 'color.teal') },
                  { value: 'brown', label: localize('en', 'color.brown') },
                  { value: 'coral', label: localize('en', 'color.coral') },
                  { value: 'slate', label: localize('en', 'color.slate') },
                  { value: 'gold', label: localize('en', 'color.gold') },
                  { value: 'grey', label: localize('en', 'color.grey') },
                  // Indicator-conflicting colors (see helper text):
                  { value: 'red', label: localize('en', 'color.red') + ' *' },
                  { value: 'blue', label: localize('en', 'color.blue') + ' *' },
                  { value: 'orange', label: localize('en', 'color.orange') + ' *' },
                  { value: 'green', label: localize('en', 'color.green') + ' *' },
                ],
              },
            },
          },
          {
            name: 'default_view',
            selector: {
              select: {
                options: [
                  { value: 'daily', label: localize('en', 'pane.daily') },
                  { value: 'graphs', label: localize('en', 'pane.graphs') },
                  { value: 'stats', label: localize('en', 'pane.stats') },
                  { value: 'drinks', label: localize('en', 'pane.drinks') },
                  { value: 'inventory', label: localize('en', 'pane.inventory') },
                  { value: 'tools', label: localize('en', 'pane.tools') },
                  { value: 'tracking', label: localize('en', 'pane.tracking') },
                ],
              },
            },
          },
        ],
      },
      // ── Row 3: Color Explainer Button | Hide Navigation Bar ──
      {
        type: 'grid',
        name: '',
        column_min_width: '200px',
        schema: [
          {
            name: 'show_color_indicator_explainer',
            default: true,
            selector: { boolean: {} },
          },
          {
            name: 'hide_nav_bar',
            selector: { boolean: {} },
          },
        ],
      },
      // ── Row 4: Large Text | Bold Text ──
      {
        type: 'grid',
        name: '',
        column_min_width: '200px',
        schema: [
          {
            name: 'big_text',
            selector: { boolean: {} },
          },
          {
            name: 'bold_text',
            selector: { boolean: {} },
          },
        ],
      },
      {
        type: 'expandable',
        name: 'daily_panel',
        flatten: true,
        schema: [
          {
            type: 'grid',
            name: '',
            column_min_width: '200px',
            schema: [
              {
                name: 'take_pill_icon',
                selector: { icon: {} },
              },
              {
                name: 'take_pill_label',
                selector: { text: {} },
              },
            ],
          },
          {
            type: 'expandable',
            name: 'safe_to_take_box',
            title: 'Top Box',
            flatten: true,
            schema: [
              {
                name: 'safe_to_take_show_amount_in_body',
                selector: { boolean: {} },
              },
              {
                name: 'safe_to_take_entity',
                selector: {
                  entity: {
                    context: { filter_device_id: 'device_id' },
                  },
                },
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'safe_to_take_icon',
                    selector: { icon: {} },
                  },
                  {
                    name: 'safe_to_take_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                name: 'safe_to_take_tap_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'safe_to_take_hold_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'safe_to_take_double_tap_action',
                selector: {
                  ui_action: {},
                },
              },
            ],
          },
          {
            type: 'expandable',
            name: 'pills_left_box',
            title: 'Bottom Box',
            flatten: true,
            schema: [
              {
                name: 'pills_left_show_days_left',
                selector: { boolean: {} },
              },
              {
                name: 'pills_left_entity',
                selector: {
                  entity: {
                    context: { filter_device_id: 'device_id' },
                  },
                },
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'pills_left_icon',
                    selector: { icon: {} },
                  },
                  {
                    name: 'pills_left_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                name: 'pills_left_tap_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'pills_left_hold_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'pills_left_double_tap_action',
                selector: {
                  ui_action: {},
                },
              },
            ],
          },
          {
            type: 'expandable',
            name: 'chips',
            title: 'Custom Boxes',
            flatten: true,
            schema: [
              // ── Layer 3: each chip gets its own collapsable menu with the
              //    full override suite (entity + icon/label + 3 ui_actions),
              //    mirroring the Safe to Take / Pills Left box expandables.
              //    The expandable header "Chip N" conveys identity, so the
              //    entity field's external label is suppressed in
              //    computeLabel below (no redundant "Chip N (optional)" text).
              {
                type: 'expandable',
                name: 'chip_1_box',
                title: localize('en', 'config.chip_1_box'),
                flatten: true,
                schema: [
                  {
                    name: 'chip_1_show_icon',
                    label: localize('en', 'config.chip_1_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'chip_1',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'chip_1_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'chip_1_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'chip_1_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_1_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_1_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'chip_2_box',
                title: localize('en', 'config.chip_2_box'),
                flatten: true,
                schema: [
                  {
                    name: 'chip_2_show_icon',
                    label: localize('en', 'config.chip_2_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'chip_2',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'chip_2_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'chip_2_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'chip_2_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_2_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_2_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'chip_3_box',
                title: localize('en', 'config.chip_3_box'),
                flatten: true,
                schema: [
                  {
                    name: 'chip_3_show_icon',
                    label: localize('en', 'config.chip_3_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'chip_3',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'chip_3_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'chip_3_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'chip_3_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_3_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_3_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'chip_4_box',
                title: localize('en', 'config.chip_4_box'),
                flatten: true,
                schema: [
                  {
                    name: 'chip_4_show_icon',
                    label: localize('en', 'config.chip_4_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'chip_4',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'chip_4_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'chip_4_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'chip_4_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_4_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'chip_4_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
            ],
          },
          // ── Button State Matrix (Daily — Take Pill button) ──
          // Restructured into nested flatten-expandables, one per aspect, so
          // each Style dropdown + its Icon Style dropdown are visually grouped
          // (grid pairs them side-by-side) and a section header makes the
          // boundary between aspects clear. All select selectors use
          // mode:'dropdown' so the 3-option selects (ack_layout, ring_speed)
          // render as a single dropdown box instead of 3 stacked radio buttons
          // (HA auto-selects LIST mode for <=3 options with no explicit mode).
          // All fields default to 'auto' (the per-state default sentinel) so the
          // editor pre-populates the control when the stored config value is
          // undefined — 'auto' resolves to the per-state default at runtime.
          // Defaults: Lockout=full+none, Execution=none+color,
          // Latency=border+color_pulse, ACK layout=top / duration=3000ms,
          // ring=medium. See plans/icon-style-dropdown-separation-plan.md.
          {
            type: 'expandable',
            name: 'take_button_box',
            title: localize('en', 'config.button'),
            flatten: true,
            schema: [
              // Flat list of aspect grids — no nested expandables (2x nesting
              // only: Button -> grid). Each Style dropdown + its Icon Style
              // dropdown are paired side-by-side in a grid so the grouping is
              // obvious at a glance. The label names (Limit Reached Style, Take
              // Pill Style, etc.) convey the aspect identity without titles.
              // ── Limit Reached: style + icon_style ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'take_button_lockout_style',
                    default: 'auto',
                    selector: {
                      select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'take_button_lockout_icon_style',
                    default: 'auto',
                    selector: {
                      select: { options: _iconStyleOptions(), mode: 'dropdown' },
                    },
                  },
                ],
              },
              // ── Take Pill: style + icon_style ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'take_button_execution_style',
                    default: 'auto',
                    selector: {
                      select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'take_button_execution_icon_style',
                    default: 'auto',
                    selector: {
                      select: { options: _iconStyleOptions(), mode: 'dropdown' },
                    },
                  },
                ],
              },
              // ── Overdue Warning: style + icon_style ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'take_button_latency_style',
                    default: 'auto',
                    selector: {
                      select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'take_button_latency_icon_style',
                    default: 'auto',
                    selector: {
                      select: { options: _iconStyleOptions(), mode: 'dropdown' },
                    },
                  },
                ],
              },
              // ── Logged Dose Indicator: layout + duration ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'take_button_ack_layout',
                    default: 'top',
                    selector: {
                      select: { options: _ackLayoutOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'take_button_ack_duration_ms',
                    default: 3000,
                    selector: { number: { min: 500, max: 10000, step: 100 } },
                  },
                ],
              },
              // ── Rotating Ring: speed ──
              {
                name: 'take_button_ring_speed',
                default: 'medium',
                selector: {
                  select: { options: _ringSpeedOptions(), mode: 'dropdown' },
                },
              },
            ],
          },
        ],
      },
      // ── Drinks Panel (Master Tracker) — mirrors the Daily Panel ──
      // Same three-box override structure: Top Box (In Body — entity swap +
      // icon/label + actions), Bottom Box (Disruption — Time to Low 3-option
      // select + entity swap + icon/label + actions), and Custom Boxes (4×
      // entity + label pairs). The Bottom Box uses a single 3-option select
      // ('disruption' / 'low_timestamp' / 'low_hours_until') instead of the
      // Daily Bottom Box boolean toggle — the cleanest expression of three
      // mutually-exclusive display modes (user-confirmed Option A).
      {
        type: 'expandable',
        name: 'drinks_panel',
        flatten: true,
        schema: [
          {
            type: 'grid',
            name: '',
            column_min_width: '200px',
            schema: [
              {
                name: 'log_drink_icon',
                selector: { icon: {} },
              },
              {
                name: 'log_drink_label',
                selector: { text: {} },
              },
            ],
          },
          // Profile Lock removed — subsumed by the Drink Trackers device
          // multi-select below the Medicine Device selector. N=1 is the new
          // "lock"; N>1 shows the header profile switcher. Migration handles
          // legacy drink_target_profile / drink_master_entities configs
          // transparently in setConfig() + _resolveTrackers().
          {
            type: 'expandable',
            name: 'in_body_box',
            title: 'Top Box',
            flatten: true,
            schema: [
              {
                name: 'in_body_entity',
                selector: {
                  entity: {
                    context: { filter_device_id: 'device_id' },
                  },
                },
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'in_body_icon',
                    selector: { icon: {} },
                  },
                  {
                    name: 'in_body_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                name: 'in_body_tap_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'in_body_hold_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'in_body_double_tap_action',
                selector: {
                  ui_action: {},
                },
              },
            ],
          },
          {
            type: 'expandable',
            name: 'disruption_box',
            title: 'Bottom Box',
            flatten: true,
            schema: [
              {
                name: 'disruption_mode',
                selector: {
                  select: {
                    options: [
                      { value: 'disruption', label: localize('en', 'config.disruption_mode_disruption') },
                      { value: 'low_timestamp', label: localize('en', 'config.disruption_mode_low_timestamp') },
                      { value: 'low_hours_until', label: localize('en', 'config.disruption_mode_low_hours_until') },
                    ],
                  },
                },
              },
              {
                name: 'disruption_entity',
                selector: {
                  entity: {
                    context: { filter_device_id: 'device_id' },
                  },
                },
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'disruption_icon',
                    selector: { icon: {} },
                  },
                  {
                    name: 'disruption_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                name: 'disruption_tap_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'disruption_hold_action',
                selector: {
                  ui_action: {},
                },
              },
              {
                name: 'disruption_double_tap_action',
                selector: {
                  ui_action: {},
                },
              },
            ],
          },
          {
            type: 'expandable',
            name: 'drink_chips',
            title: 'Custom Boxes',
            flatten: true,
            schema: [
              // ── Layer 3: each drink chip gets its own collapsable menu with
              //    the full override suite (entity + icon/label + 3 ui_actions),
              //    mirroring the Daily Panel chip_N_box expandables above.
              {
                type: 'expandable',
                name: 'drink_chip_1_box',
                title: localize('en', 'config.chip_1_box'),
                flatten: true,
                schema: [
                  {
                    name: 'drink_chip_1_show_icon',
                    label: localize('en', 'config.drink_chip_1_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'drink_chip_1',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'drink_chip_1_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'drink_chip_1_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'drink_chip_1_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_1_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_1_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'drink_chip_2_box',
                title: localize('en', 'config.chip_2_box'),
                flatten: true,
                schema: [
                  {
                    name: 'drink_chip_2_show_icon',
                    label: localize('en', 'config.drink_chip_2_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'drink_chip_2',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'drink_chip_2_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'drink_chip_2_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'drink_chip_2_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_2_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_2_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'drink_chip_3_box',
                title: localize('en', 'config.chip_3_box'),
                flatten: true,
                schema: [
                  {
                    name: 'drink_chip_3_show_icon',
                    label: localize('en', 'config.drink_chip_3_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'drink_chip_3',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'drink_chip_3_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'drink_chip_3_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'drink_chip_3_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_3_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_3_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
              {
                type: 'expandable',
                name: 'drink_chip_4_box',
                title: localize('en', 'config.chip_4_box'),
                flatten: true,
                schema: [
                  {
                    name: 'drink_chip_4_show_icon',
                    label: localize('en', 'config.drink_chip_4_show_icon'),
                    helper: localize('en', 'config.helper.chip_show_icon'),
                    selector: { boolean: {} },
                  },
                  {
                    name: 'drink_chip_4',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    type: 'grid',
                    name: '',
                    column_min_width: '180px',
                    schema: [
                      {
                        name: 'drink_chip_4_icon',
                        selector: { icon: {} },
                      },
                      {
                        name: 'drink_chip_4_label',
                        selector: { text: {} },
                      },
                    ],
                  },
                  {
                    name: 'drink_chip_4_tap_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_4_hold_action',
                    selector: { ui_action: {} },
                  },
                  {
                    name: 'drink_chip_4_double_tap_action',
                    selector: { ui_action: {} },
                  },
                ],
              },
            ],
          },
          // ── Button State Matrix (Drinks — Log Drink button) ──
          // Restructured into nested flatten-expandables (mirrors the Daily
          // Take Pill button structure). Only 3 aspects: Limit Reached,
          // Logged Dose Indicator, Rotating Ring (drinks are PRN with no
          // schedule, so Take Pill and Overdue Warning are omitted). All
          // selects use mode:'dropdown'. Style + Icon Style default to 'auto'
          // (the per-state default sentinel), which resolves at runtime.
          // Defaults: Lockout=full+none, ACK layout=top / duration=3000ms,
          // ring=medium. See plans/icon-style-dropdown-separation-plan.md.
          {
            type: 'expandable',
            name: 'drink_button_box',
            title: localize('en', 'config.button'),
            flatten: true,
            schema: [
              // Flat list of aspect grids — no nested expandables (2x nesting
              // only: Button -> grid). Mirrors the Daily Take Pill button
              // structure. Each Style dropdown + its Icon Style dropdown are
              // paired side-by-side in a grid so the grouping is obvious.
              // ── Limit Reached: style + icon_style ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_button_lockout_style',
                    default: 'auto',
                    selector: {
                      select: { options: _buttonStyleOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'drink_button_lockout_icon_style',
                    default: 'auto',
                    selector: {
                      select: { options: _iconStyleOptions(), mode: 'dropdown' },
                    },
                  },
                ],
              },
              // ── Logged Dose Indicator: layout + duration ──
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_button_ack_layout',
                    default: 'top',
                    selector: {
                      select: { options: _ackLayoutOptions(), mode: 'dropdown' },
                    },
                  },
                  {
                    name: 'drink_button_ack_duration_ms',
                    default: 3000,
                    selector: { number: { min: 500, max: 10000, step: 100 } },
                  },
                ],
              },
              // ── Rotating Ring: speed ──
              {
                name: 'drink_button_ring_speed',
                default: 'medium',
                selector: {
                  select: { options: _ringSpeedOptions(), mode: 'dropdown' },
                },
              },
            ],
          },
        ],
      },
      {
        type: 'expandable',
        name: 'graphs_panel',
        flatten: true,
        schema: [
          {
            name: 'show_amount_in_body',
            selector: { boolean: {} },
            default: true,
          },
          {
            name: 'amount_in_body_default_timeframe',
            selector: {
              select: {
                options: [
                  { value: '12h', label: '12 Hours' },
                  { value: '24h', label: '24 Hours' },
                  { value: '48h', label: '48 Hours' },
                  { value: '7d', label: '7 Days' },
                  { value: '14d', label: '14 Days' },
                  { value: '30d', label: '30 Days' },
                ],
              },
            },
          },
          {
            type: 'grid',
            name: '',
            column_min_width: '200px',
            schema: [
              {
                name: 'show_day_avg_boxes',
                selector: { boolean: {} },
                default: true,
              },
              {
                name: 'show_adherence_boxes',
                selector: { boolean: {} },
                default: true,
              },
            ],
          },
        ],
      },
      {
        type: 'expandable',
        name: 'stats_panel',
        flatten: true,
        schema: [
          {
            name: 'stats_3_columns',
            selector: { boolean: {} },
          },
        ],
      },
      // ── Settings Tab ──
      // General card behavior toggles. Currently holds the confirm-action
      // toggle for the Tools tab (default ON); the container checks this
      // via a negative-false test so existing configs keep the confirmation
      // popup without migration. The schema `default: true` makes ha-form
      // render the toggle ON when the field is undefined (existing configs),
      // without baking the value into persisted config (decision #18).
      {
        type: 'expandable',
        name: 'settings_panel',
        flatten: true,
        schema: [
          {
            name: 'confirm_tool_actions',
            selector: { boolean: {} },
            default: true,
          },
        ],
      },
    ] as any,
    computeLabel: (schema: any, _data: any, hass: any) => {
      const lang = hass?.language || 'en';
      // Grid containers have an empty name and are pure layout — no visible
      // label. Returning '' here prevents the localize() 'config.' fallback
      // from leaking as visible text for layout-only schema nodes.
      if (schema.type === 'grid' || !schema.name) {
        return '';
      }
      // Custom Box entity picker: label as "Settings" rather than the
      // localized "Box N (optional)" — the nested expandable header "Box N"
      // already conveys identity, so the entity picker gets a neutral
      // "Settings" label that groups the entity + icon/label overrides below
      // it.  Returning a non-empty string is required: ha-form treats an
      // empty-string (or undefined) computeLabel return as "no label" and
      // falls back to humanizing the schema field name (chip_1 → "Chip 1"),
      // which is the stale text we are replacing.  "Settings" is non-empty
      // so it overrides the humanize fallback cleanly.  The icon/label
      // override fields are NOT touched here: they render their "Box N Icon"
      // / "Box N Label" labels (paired in a grid) so the user can tell the
      // icon-override picker apart from the label-override picker.  The
      // tap/hold/double_tap action fields likewise keep their labels.
      if (
        schema.name === 'chip_1' || schema.name === 'chip_2' ||
        schema.name === 'chip_3' || schema.name === 'chip_4'
      ) {
        return localize(lang, 'config.box_settings');
      }
      // Drink Custom Box entity picker: same "Settings" label as the
      // Daily-panel Custom Boxes above (the nested "Box N" expandable header
      // conveys identity).  Icon/label override fields render.
      if (
        schema.name === 'drink_chip_1' || schema.name === 'drink_chip_2' ||
        schema.name === 'drink_chip_3' || schema.name === 'drink_chip_4'
      ) {
        return localize(lang, 'config.box_settings');
      }
      return localize(lang, 'config.' + schema.name);
    },
    computeHelper: (schema: any, _data: any, hass: any) => {
      const lang = hass?.language || 'en';
      const name: string = schema.name;
      // Layout/container nodes (grid, expandable) and nodes without a selector
      // have no input control, so helper text does not apply. Without this
      // guard, localize() returns the raw 'config.helper.<name>' key for
      // containers (daily_panel, drinks_panel, graphs_panel, stats_panel,
      // chips, drink_chips, safe_to_take_box, pills_left_box, in_body_box,
      // disruption_box, chip_1_box..chip_4_box, drink_chip_1_box..drink_chip_4_box)
      // that have no translation defined, which then renders as visible text
      // under the expandable headers. (Also applies to settings_panel.)
      if (
        schema.type === 'grid' ||
        schema.type === 'expandable' ||
        !schema.selector
      ) {
        return '';
      }
      // Chip icon fields: helper explains the default-icon fallback.
      if (name?.startsWith('chip_') && name?.endsWith('_icon')) {
        return localize(lang, 'config.helper.chip_icon');
      }
      // Chip action fields: tap helper notes the more-info default; hold /
      // double_tap use the generic action helper.
      if (name?.startsWith('chip_') && name?.endsWith('_tap_action')) {
        return localize(lang, 'config.helper.chip_tap_action');
      }
      if (name?.startsWith('chip_') && (name?.endsWith('_hold_action') || name?.endsWith('_double_tap_action'))) {
        return localize(lang, 'config.helper.chip_hold_action');
      }
      if (name?.startsWith('chip_') && name?.endsWith('_label')) {
        return localize(lang, 'config.helper.chip_label');
      }
      if (name?.startsWith('chip_')) {
        return localize(lang, 'config.helper.chip');
      }
      // Drink chip icon + action fields: same helpers as the Daily chips.
      if (name?.startsWith('drink_chip_') && name?.endsWith('_icon')) {
        return localize(lang, 'config.helper.chip_icon');
      }
      if (name?.startsWith('drink_chip_') && name?.endsWith('_tap_action')) {
        return localize(lang, 'config.helper.chip_tap_action');
      }
      if (name?.startsWith('drink_chip_') && (name?.endsWith('_hold_action') || name?.endsWith('_double_tap_action'))) {
        return localize(lang, 'config.helper.chip_hold_action');
      }
      if (name?.startsWith('drink_chip_') && name?.endsWith('_label')) {
        return localize(lang, 'config.helper.drink_chip_label');
      }
      if (name?.startsWith('drink_chip_')) {
        return localize(lang, 'config.helper.drink_chip');
      }
      return localize(lang, 'config.helper.' + name);
    },
  };
}
