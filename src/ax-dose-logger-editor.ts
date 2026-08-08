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
// Grid-alignment CSS injection
// ──────────────────────────────────────────────

// Module-scoped observer so repeated installEditorGridAlignment() calls
// disconnect the previous observer before creating a new one (mirrors the
// previous private-static-field behavior on the card class).
let _formStyleObserver: MutationObserver | null = null;

/**
 * Inject a `<style>` into every `ha-form` shadow root in the document so that
 * entity-picker + text-field pairs inside `type: 'grid'` containers align by
 * their bottom edges.
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
 * document-wide DOM scanning). The observer auto-cleans when the editor
 * dialog closes (no ha-form left in the document), and uninstallEditorGrid-
 * Alignment() is available for explicit cleanup if ever needed.
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

  // Find all ha-form elements and inject into their shadow roots.
  // Returns the count so the caller can detect "no forms left" (editor
  // dialog closed) and self-clean the observer.
  const processForms = (): number => {
    const forms = document.querySelectorAll('ha-form');
    forms.forEach((form) => {
      if (form.shadowRoot) {
        injectInto(form.shadowRoot);
      }
    });
    return forms.length;
  };

  // Process existing forms immediately.
  processForms();

  // Set up a MutationObserver to catch forms that appear later (config dialog).
  if (_formStyleObserver) {
    _formStyleObserver.disconnect();
  }
  _formStyleObserver = new MutationObserver(() => {
    const formCount = processForms();
    // Auto-cleanup: when no ha-form remains in the document, the editor
    // dialog has closed — disconnect the observer so it stops scanning
    // every DOM mutation across the whole dashboard. Without this the
    // observer leaked indefinitely (it was never disconnected before).
    if (formCount === 0) {
      _formStyleObserver?.disconnect();
      _formStyleObserver = null;
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
      {
        name: 'device_id',
        required: true,
        selector: {
          device: {
            filter: { integration: 'ax_dose_logger' },
          },
        },
      },
      // ── Row 1: Color Scheme | Name Override ──
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
                  { value: 'blue', label: localize('en', 'color.blue') },
                  { value: 'red', label: localize('en', 'color.red') },
                  { value: 'green', label: localize('en', 'color.green') },
                  { value: 'yellow', label: localize('en', 'color.yellow') },
                  { value: 'orange', label: localize('en', 'color.orange') },
                  { value: 'purple', label: localize('en', 'color.purple') },
                  { value: 'pink', label: localize('en', 'color.pink') },
                  { value: 'teal', label: localize('en', 'color.teal') },
                  { value: 'brown', label: localize('en', 'color.brown') },
                  { value: 'coral', label: localize('en', 'color.coral') },
                  { value: 'slate', label: localize('en', 'color.slate') },
                  { value: 'gold', label: localize('en', 'color.gold') },
                  { value: 'grey', label: localize('en', 'color.grey') },
                ],
              },
            },
          },
          {
            name: 'name',
            selector: { text: {} },
          },
        ],
      },
      // ── Row 2: Default View | Hide Navigation Bar ──
      {
        type: 'grid',
        name: '',
        column_min_width: '200px',
        schema: [
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
          {
            name: 'hide_nav_bar',
            selector: { boolean: {} },
          },
        ],
      },
      // ── Row 3: Large Text | Bold Text ──
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
