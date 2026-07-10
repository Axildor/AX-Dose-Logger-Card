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
 * Called from the container's connectedCallback().
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
  const processForms = (): void => {
    document.querySelectorAll('ha-form').forEach((form) => {
      if (form.shadowRoot) {
        injectInto(form.shadowRoot);
      }
    });
  };

  // Process existing forms immediately.
  processForms();

  // Set up a MutationObserver to catch forms that appear later (config dialog).
  if (_formStyleObserver) {
    _formStyleObserver.disconnect();
  }
  _formStyleObserver = new MutationObserver(() => {
    processForms();
  });
  _formStyleObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
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
            name: 'hide_nav_bar',
            selector: { boolean: {} },
          },
        ],
      },
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
            title: 'Safe to Take Box',
            flatten: true,
            schema: [
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
            title: 'Pills Left Box',
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
            title: 'Custom Chips',
            flatten: true,
            schema: [
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'chip_1',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'chip_1_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'chip_2',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'chip_2_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'chip_3',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'chip_3_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'chip_4',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'chip_4_label',
                    selector: { text: {} },
                  },
                ],
              },
            ],
          },
        ],
      },
      // ── Drinks Panel (Master Tracker) — mirrors the Daily Panel ──
      // Same three-box override structure: In Body Box (entity swap + icon/
      // label + actions), Disruption Box (Time to Low 3-option select +
      // entity swap + icon/label + actions), and Custom Chips (4× entity +
      // label pairs). The Disruption Box uses a single 3-option select
      // ('disruption' / 'low_timestamp' / 'low_hours_until') instead of the
      // Pills Left Box boolean toggle — the cleanest expression of three
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
            title: 'In Body Box',
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
            title: 'Disruption Box',
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
            title: 'Custom Chips',
            flatten: true,
            schema: [
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_chip_1',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'drink_chip_1_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_chip_2',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'drink_chip_2_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_chip_3',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'drink_chip_3_label',
                    selector: { text: {} },
                  },
                ],
              },
              {
                type: 'grid',
                name: '',
                column_min_width: '200px',
                schema: [
                  {
                    name: 'drink_chip_4',
                    selector: {
                      entity: {
                        context: { filter_device_id: 'device_id' },
                      },
                    },
                  },
                  {
                    name: 'drink_chip_4_label',
                    selector: { text: {} },
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
              },
              {
                name: 'show_adherence_boxes',
                selector: { boolean: {} },
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
    ] as any,
    computeLabel: (schema: any, _data: any, hass: any) => {
      const lang = hass?.language || 'en';
      // Grid containers have an empty name and are pure layout — no visible
      // label. Returning '' here prevents the localize() 'config.' fallback
      // from leaking as visible text for layout-only schema nodes.
      if (schema.type === 'grid' || !schema.name) {
        return '';
      }
      // Chip entity + label fields: drop BOTH labels so the entity picker and
      // text field render at the same vertical level inside each chip grid row.
      // The entity picker's external "Chip N (optional)" label wraps to 2 lines
      // in the 200px column, making its cell taller than the paired text field
      // (which uses an internal floating label). Returning an EMPTY STRING (not
      // undefined) is the key: ha-form treats a falsy/undefined computeLabel
      // result as "no override" and falls back to the schema field name (which
      // renders as visible "Chip N (optional)" text). An empty string IS a
      // valid label value, so ha-form renders an empty label element with no
      // visible text and no 2-line wrap, equalizing cell heights. This mirrors
      // the grid-container guard above (which also returns '' to suppress
      // layout labels). The helper text under each field conveys role and
      // optionality; the entity-picker UI vs text-field UI distinguishes the
      // two columns. Reversible to Option B (keep chip_N_label) via a one-line
      // edit if per-slot identification is later needed.
      if (
        schema.name === 'chip_1' || schema.name === 'chip_1_label' ||
        schema.name === 'chip_2' || schema.name === 'chip_2_label' ||
        schema.name === 'chip_3' || schema.name === 'chip_3_label' ||
        schema.name === 'chip_4' || schema.name === 'chip_4_label'
      ) {
        return '';
      }
      // Drink chip entity + label fields: same label-suppression rationale as
      // the Daily-panel chips above (entity picker + text field cell-height
      // equalization inside a 200px grid column).
      if (
        schema.name === 'drink_chip_1' || schema.name === 'drink_chip_1_label' ||
        schema.name === 'drink_chip_2' || schema.name === 'drink_chip_2_label' ||
        schema.name === 'drink_chip_3' || schema.name === 'drink_chip_3_label' ||
        schema.name === 'drink_chip_4' || schema.name === 'drink_chip_4_label'
      ) {
        return '';
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
      // disruption_box) that have no translation defined, which then renders as
      // visible text under the expandable headers.
      if (
        schema.type === 'grid' ||
        schema.type === 'expandable' ||
        !schema.selector
      ) {
        return '';
      }
      if (name?.startsWith('chip_') && name?.endsWith('_label')) {
        return localize(lang, 'config.helper.chip_label');
      }
      if (name?.startsWith('chip_')) {
        return localize(lang, 'config.helper.chip');
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
