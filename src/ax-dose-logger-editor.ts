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
                type: 'grid',
                name: '',
                column_min_width: '200px',
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
            name: 'pills_left_label',
            selector: { text: {} },
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
      return localize(lang, 'config.' + schema.name);
    },
    computeHelper: (schema: any, _data: any, hass: any) => {
      const lang = hass?.language || 'en';
      const name: string = schema.name;
      if (name?.startsWith('chip_') && name?.endsWith('_label')) {
        return localize(lang, 'config.helper.chip_label');
      }
      if (name?.startsWith('chip_')) {
        return localize(lang, 'config.helper.chip');
      }
      return localize(lang, 'config.helper.' + name);
    },
  };
}