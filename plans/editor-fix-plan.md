# Plan: Fix Card Editor — Missing Selectors & Device-Scoped Chips

## Problem Statement

1. **Entity selector not appearing**: The `ha-device-picker` and `ha-entity-picker` custom elements are lazy-loaded by HA's frontend. When the custom `PillLoggerCardEditor` renders, these components may not yet be registered, causing them to render as invisible/empty elements.

2. **Chips should filter by device**: The current `ha-entity-picker` instances show all entities with no device-based filtering. They should only show entities belonging to the selected device.

## Root Cause

The custom editor class (`PillLoggerCardEditor`) directly uses HA's lazy-loaded picker components (`<ha-device-picker>`, `<ha-entity-picker>`). These components are not guaranteed to be loaded when the editor renders, resulting in empty/invisible selectors.

## Solution: Migrate to `getConfigForm()`

Replace the entire custom editor with HA's built-in form system via `getConfigForm()`. This approach:

- **HA handles lazy-loading** of all selector components automatically — no missing pickers
- **Supports `context: { filter_device_id: "device_id" }`** on entity selectors to filter by the selected device
- **Supports `device` selector** with `filter: { integration: "pill_logger" }` to only show Pill Logger devices
- **Eliminates the entire custom editor class** — less code, fewer bugs

## Config Format Change

The current config uses `chips: string[]` (an array). The form schema doesn't support dynamic arrays, so we'll use flat fields:

```yaml
# Before (YAML):
chips: ["sensor.ibuprofen_strength", "sensor.ibuprofen_total_doses"]

# After (form-compatible):
chip_1: "sensor.ibuprofen_strength"
chip_2: "sensor.ibuprofen_total_doses"
```

Backward compatibility is handled in `setConfig()` — if a user provides `chips: [...]` in YAML, it converts to flat `chip_N` fields.

## Detailed Changes

### 1. Update `PillLoggerCardConfig` interface

```typescript
interface PillLoggerCardConfig {
  device_id: string;
  chip_1?: string;
  chip_2?: string;
  chip_3?: string;
  chip_4?: string;
  show_amount_in_body?: boolean;
}
```

### 2. Update `setConfig()` — backward compatibility

```typescript
setConfig(config: PillLoggerCardConfig) {
  // Backward compat: convert chips[] to chip_N fields
  if (Array.isArray((config as any).chips)) {
    const chips = (config as any).chips as string[];
    const mapped: Record<string, string> = {};
    chips.forEach((c, i) => {
      if (c) mapped[`chip_${i + 1}`] = c;
    });
    config = { ...config, ...mapped };
    delete (config as any).chips;
  }
  this.config = { show_amount_in_body: true, ...config };
}
```

### 3. Add `getConfigForm()` static method

```typescript
static getConfigForm() {
  return {
    schema: [
      {
        name: "device_id",
        required: true,
        selector: {
          device: {
            filter: { integration: "pill_logger" },
          },
        },
      },
      {
        name: "show_amount_in_body",
        selector: { boolean: {} },
      },
      {
        name: "chip_1",
        selector: {
          entity: {
            context: { filter_device_id: "device_id" },
          },
        },
      },
      {
        name: "chip_2",
        selector: {
          entity: {
            context: { filter_device_id: "device_id" },
          },
        },
      },
      {
        name: "chip_3",
        selector: {
          entity: {
            context: { filter_device_id: "device_id" },
          },
        },
      },
      {
        name: "chip_4",
        selector: {
          entity: {
            context: { filter_device_id: "device_id" },
          },
        },
      },
    ],
    computeLabel: (schema: any) => {
      const labels: Record<string, string> = {
        device_id: "Device",
        show_amount_in_body: "Show Amount in Body Graph",
        chip_1: "Chip 1 (optional)",
        chip_2: "Chip 2 (optional)",
        chip_3: "Chip 3 (optional)",
        chip_4: "Chip 4 (optional)",
      };
      return labels[schema.name] || undefined;
    },
    computeHelper: (schema: any) => {
      if (schema.name === "device_id") {
        return "Select your Pill Logger medication device.";
      }
      if (schema.name?.startsWith("chip_")) {
        return "Entity from the selected device to display as a chip on the Daily pane.";
      }
      return undefined;
    },
  };
}
```

### 4. Remove `getConfigElement()` static method

Delete the `getConfigElement()` method from `PillLoggerCard`.

### 5. Remove entire `PillLoggerCardEditor` class

Delete the `PillLoggerCardEditor` class (lines ~1004-1114) and its styles.

### 6. Remove `pill-logger-card-editor` registration

Delete `customElements.define('pill-logger-card-editor', PillLoggerCardEditor);`

### 7. Update card render code to read `chip_1..chip_4`

In `_renderPane1()`, replace:

```typescript
this.config?.chips && this.config.chips.length > 0
  ? this.config.chips.slice(0, 4).map(...)
```

with:

```typescript
['chip_1', 'chip_2', 'chip_3', 'chip_4']
  .filter(key => this.config?.[key as keyof PillLoggerCardConfig])
  .map(key => {
    const chipEntityId = this.config![key as keyof PillLoggerCardConfig] as string;
    ...
  })
```

### 8. Update `getStubConfig()`

```typescript
static getStubConfig() {
  return {
    device_id: '',
    show_amount_in_body: true,
  };
}
```

## Files Modified

- `src/pill-logger-card.ts` — All changes above
- `dist/pill-logger-card.js` — Rebuilt output