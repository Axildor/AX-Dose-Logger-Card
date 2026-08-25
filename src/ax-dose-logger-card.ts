import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { PropertyValues, TemplateResult } from 'lit';
import type { LovelaceCard, ActionConfig } from 'custom-card-helpers';
import { fireEvent, formatTime, formatDateTime, handleAction } from 'custom-card-helpers';
import { localize } from './localize.js';
import { delayedAction } from './delayed-action.js';
import {
  formatInteger as formatIntegerHelper,
  toLocalDateKey as toLocalDateKeyHelper,
  bridgeGaps as bridgeGapsHelper,
  getColorOverrides as getColorOverridesHelper,
  getState as getStateHelper,
  getAttr as getAttrHelper,
  getTimeframeHours as getTimeframeHoursHelper,
  ACK_INTRO_MS,
  resolveButtonState as resolveButtonStateHelper,
} from './helpers.js';
import type { ButtonState, ButtonStateInput } from './helpers.js';
import { buildEditorForm, installEditorGridAlignment } from './ax-dose-logger-editor.js';
// Panel components are statically imported so Rollup bundles them into the
// single dist/ax-dose-logger-card.js output (HACS downloads exactly one file).
import './components/stats-panel.js';
import './components/tools-panel.js';
import './components/tracking-panel.js';
import './components/daily-panel.js';
import './components/graphs-panel.js';
import './components/drinks-panel.js';
import './components/inventory-panel.js';
import type {
  AxDoseLoggerCardConfig,
  AxDoseLoggerHass,
  CardController,
  ResolvedEntities,
  ResolvedTracker,
  MetricEntity,
  DayBucket,
  DrinkInfo,
  ChipConfig,
  ButtonStateStyle,
  IconStyle,
} from './types.js';

// ──────────────────────────────────────────────
// Button State Matrix — config migration (old *_style + *_pulse -> new
// *_style + *_icon_style, and *_glow_speed -> *_ring_speed). Runs in
// setConfig() so existing user configs are migrated transparently.
// Idempotent: a no-op once the new *_icon_style field is present.
// See plans/icon-style-dropdown-separation-plan.md §5-6.
// ──────────────────────────────────────────────
function _migrateOneButtonState(raw: any, prefix: string): void {
  const oldStyle = raw[`${prefix}_style`];
  const oldPulse = raw[`${prefix}_pulse`];
  // Skip if the new field is already present (post-migration) or neither old
  // field exists.
  if (raw[`${prefix}_icon_style`] !== undefined) return;
  if (oldStyle === undefined && oldPulse === undefined) return;

  // Detect legacy icon-composite style names (icon, icon_border, icon_glow).
  const hasIcon = oldStyle === 'icon' || oldStyle === 'icon_border' || oldStyle === 'icon_glow';

  // Modern styles (full, border, none, ring, glow, auto) with no legacy pulse
  // field are already in the new format — skip migration. This is critical
  // for idempotency: HA's visual editor omits the *_icon_style field when it
  // is at its default ('auto'), so the earlier guard (line 55) does NOT fire
  // after a style-only change. Without this guard, migration would re-run
  // every time the user changes the style dropdown, injecting
  // icon_style='none' into the stored config and causing the editor to show
  // 'none' instead of 'auto'. By returning early for modern configs, we
  // ensure only truly legacy configs (those with *_pulse or icon-composite
  // style names) are migrated.
  if (oldPulse === undefined && !hasIcon) return;

  // Map old style -> new style (strip icon component from legacy names).
  // NOTE: 'glow' is NO LONGER remapped — it is a valid ButtonStateStyle as of
  // the Ambilight Glow feature. Legacy 'glow' (which meant the old rotating
  // ring) is left as 'glow' so those users get the new Ambilight Glow style
  // instead of a silent downgrade to 'ring'. The old ring is still available
  // by explicitly selecting 'ring' in the editor.
  const newStyle = oldStyle === 'icon' ? 'none'
    : oldStyle === 'icon_border' ? 'border'
    : oldStyle === 'icon_glow' ? 'ring'
    : oldStyle;  // full, border, none, ring, glow unchanged

  // Map old pulse + icon presence -> new icon_style.
  let iconStyle: IconStyle;
  if (hasIcon) {
    iconStyle = oldPulse ? 'color_pulse' : 'color';
  } else {
    iconStyle = oldPulse ? 'pulse' : 'none';
  }

  raw[`${prefix}_style`] = newStyle;
  raw[`${prefix}_icon_style`] = iconStyle;
  delete raw[`${prefix}_pulse`];
}

function _migrateButtonStateConfig(raw: any): void {
  // Daily — 3 states
  _migrateOneButtonState(raw, 'take_button_lockout');
  _migrateOneButtonState(raw, 'take_button_execution');
  _migrateOneButtonState(raw, 'take_button_latency');
  // Drinks — 1 state
  _migrateOneButtonState(raw, 'drink_button_lockout');
  // Ring speed rename (glow_speed -> ring_speed).
  if (raw.take_button_glow_speed !== undefined && raw.take_button_ring_speed === undefined) {
    raw.take_button_ring_speed = raw.take_button_glow_speed;
    delete raw.take_button_glow_speed;
  }
  if (raw.drink_button_glow_speed !== undefined && raw.drink_button_ring_speed === undefined) {
    raw.drink_button_ring_speed = raw.drink_button_glow_speed;
    delete raw.drink_button_glow_speed;
  }
}

// ──────────────────────────────────────────────
// AxDoseLoggerCard — Main Card Class (Container)
// ──────────────────────────────────────────────

export class AxDoseLoggerCard extends LitElement implements LovelaceCard, CardController {
  @property({ attribute: false }) hass?: AxDoseLoggerHass;
  @property({ attribute: false }) config?: AxDoseLoggerCardConfig;

  @state() private _activePane: 'daily' | 'graphs' | 'stats' | 'drinks' | 'inventory' | 'tools' | 'tracking' = 'daily';
  @state() private _activeGraph: number = 0;
  @state() private _amountHistory: Array<{timestamp: string; value: number}> = [];
  @state() private _doseHistory: Array<[string, number]> = [];
  @state() private _showDeviceInfo: boolean = false;
  @state() private _showRefillDialog: boolean = false;
  @state() private _refillAmount: string = '';
  // Refill dialog target. When undefined the dialog targets the medicine
  // device's own addRefill entity (entities.addRefill); when set (Master
  // Tracker Inventory panel) it targets a specific granular drink's
  // add_stock number entity + shows that drink's name in the header.
  @state() private _refillTarget: { addStockEntityId: string; drinkName: string } | null = null;
  // Device-info dialog target. When undefined the dialog shows the Master
  // Tracker (or medicine) device name + navigates to the card's configured
  // device; when set (Inventory panel averages-box click) it shows the
  // granular drink's name + navigates to that drink's own device page.
  @state() private _deviceInfoTarget: { deviceId: string; name: string } | null = null;
  // Log Drink popup (Master Tracker Drinks panel). When open, shows a grid of
  // granular drink buttons for the master's substance; pressing one calls
  // button.press on that drink's DrinkLogButton and closes the dialog.
  @state() private _showLogDrinkDialog: boolean = false;
  @state() private _logDrinkSubstance: 'caffeine' | 'alcohol' | null = null;
  // Predicted Low-band timestamp per drink (Log Drink popup). Keyed by the
  // drink's logButtonEntityId; value is the ISO low_time string or null.
  // Populated on dialog open via the backend predict_low REST endpoint so the
  // user sees the predicted impact ("Low: hh:mm") before pressing a drink.
  // "Low: —" (null) means the drink would not lift body-mass above the Low
  // band, so there is no predicted descent — an explicit "safe" signal.
  @state() private _drinkLowPredictions: Record<string, string | null> = {};
  // Race-guard token for the predict_low fetches (mirrors _amountFetchToken).
  // Not @state() — a race-guard token has no rendering impact; making it
  // reactive caused unnecessary shouldUpdate evaluations on every increment.
  private _predictLowToken: number = 0;
  // M2M profile-picker sub-step (Log Drink popup). When non-null, the popup
  // switches from the drink grid to a profile sub-list for the tapped shared
  // drink (2+ allowed_profiles). Each row is a profile-name button; tapping
  // one calls _logDrink with that profile's UUID. The Back button clears this
  // to return to the drink grid. Reset to null on dialog close.
  @state() private _logDrinkProfileTarget: {
    drinkName: string;
    logButtonEntityId: string;
    allowedProfiles: string[];
  } | null = null;
  // Sleep Disruption popup (Master Tracker Drinks panel). When open, renders
  // a substance-aware markdown description of how the current body-mass load
  // affects sleep (caffeine vs alcohol), via HA's native ha-markdown element.
  @state() private _showSleepDisruptionDialog: boolean = false;
  @state() private _sleepDisruptionSubstance: 'caffeine' | 'alcohol' | null = null;

  // Medical Color Indicators explainer popup. Opened via a button in the
  // device-info dialog (when show_color_indicator_explainer is not false).
  // ha-dialog + ha-markdown, mirroring the Sleep Disruption popup pattern.
  @state() private _showColorExplainerDialog: boolean = false;

  // ── Button State Matrix — transient ACK (logged) flash flags ──
  // Set true on a successful button.press of the Take Pill / Log Drink button
  // and auto-cleared after the configured ack_duration_ms (default 3000) via
  // a non-blocking setTimeout. Passed to the panels as reactive props so the
  // green "Logged" flash renders + reverts. The timer handles are NOT @state
  // (no rendering impact); only the boolean flags are reactive.
  // Rapid successive clicks: while the ACK flag is true, each additional
  // press increments the paired counter and resets the fade timer so the
  // overlay text updates to "Logged 2x", "Logged 3x" etc. The counter is
  // coupled to the ACK flag lifecycle — 0 means inactive, 1 means first
  // press (no suffix rendered), 2 and above means "Logged {n}x". When the
  // timer expires the flag flips false AND the counter resets to 0 in the
  // same tick. See plans/rapid-click-count-plan.md.
  @state() private _dailyAckActive: boolean = false;
  @state() private _drinksAckActive: boolean = false;
  @state() private _dailyAckCount: number = 0;
  @state() private _drinksAckCount: number = 0;
  private _dailyAckTimer?: number;
  private _drinksAckTimer?: number;
  // Frozen button state held for the ACK intro window (ACK_INTRO_MS) so the
  // underlying state transition (e.g. idle to lockout) is hidden behind the
  // overlay by the time it commits. Captured at ACK-trigger time from the live
  // entities (pre-press state); cleared by a release timer that then requests
  // a re-render so the resolver reads live state again.
  @state() private _dailyFrozenState: ButtonState | null = null;
  @state() private _drinksFrozenState: ButtonState | null = null;
  private _dailyFreezeTimer?: number;
  private _drinksFreezeTimer?: number;

  @state() private _activeTimeframe: string = '48h';
  @state() private _activeBarTimeframe: string = '14d';
  // Effectiveness-graph state. Mirrors the bar/line graph pattern but keyed
  // separately so the three carousel slides don't clobber each other's chips.
  // _effectivenessHistory is keyed by metricKey; _effectivenessVisible is the
  // set of metricKeys currently toggled on (defaults to all metrics). The view
  // toggle ('avg' | 'individual') only matters when metrics.length > 1; the
  // panel hides it for single-metric devices.
  @state() private _activeEffectivenessTimeframe: string = '14d';
  @state() private _activeEffectivenessView: 'avg' | 'individual' = 'avg';
  @state() private _effectivenessHistory: Record<string, Array<{ timestamp: string; value: number }>> = {};
  @state() private _effectivenessVisible: Set<string> = new Set();
  @state() private _toolsDialog: { title: string; descriptor: string; onConfirm: () => void } | null = null;
  // Pill-limit override warning dialog (#6): replaces the synchronous native
  // confirm() box. When non-null, _renderOverrideDialog() shows an ha-dialog
  // asking the user to confirm taking a pill past the safe limit. The body text
  // and time source branch by tracking type: scheduled meds show the next
  // designated dose time (next_dose sensor); As Needed meds show when the
  // rolling safety window resets (window_expires_at attribute).
  @state() private _overrideDialog: {
    timeLabel: string;
    bodyKey: 'dialog.override.body_scheduled' | 'dialog.override.body_as_needed'
      | 'dialog.override.body_24h_exceeded' | 'dialog.override.body_24h_would_exceed';
    entities: ResolvedEntities;
  } | null = null;
  // Extra context for the 24h limit override dialog body placeholders
  // (current amount, limit, next dose strength, projected total, unit).
  // Only populated when bodyKey is a 24h_limit variant; null otherwise.
  private _overrideDialogExtras: {
    current: string; limit: string; next: string; projected: string; unit: string;
  } | null = null;
  // Tracking override warning dialog: when user tries to change a daily-locked
  // tracking value that has already been set today, this dialog asks for confirmation.
  @state() private _trackingOverrideDialog: { metricKey: string; metricLabel: string; oldValue: number; newValue: number; entityId: string } | null = null;
  // Tracks entity IDs that have been set but whose HA state hasn't propagated yet.
  // Prevents the override-dialog race condition: without this, a second drag before
  // the first set_value completes would read stale logged_today=false and bypass
  // the override dialog. Cleared in updated() once HA confirms logged_today=true.
  private _pendingTracking: Set<string> = new Set();

  // Connection flag (N3 defense-in-depth): set true in connectedCallback,
  // false in disconnectedCallback. Timer callbacks that mutate @state and
  // call requestUpdate() check this flag before acting, so even if a
  // setTimeout callback was already queued before disconnectedCallback's
  // clearTimeout ran, it can't mutate state on a detached element. The
  // existing clearTimeout calls in disconnectedCallback are the primary
  // guard; this is belt-and-suspenders for the microtask-race edge case.
  private _connected: boolean = false;

  // ── Render-performance optimization ─────────
  // _tick: bumped every 30s by a timer so time-relative panes (daily/stats)
  // refresh their "Xh XXm" countdowns without re-rendering on every system-wide
  // state change. Previously the whole card re-rendered on every HA state tick;
  // with shouldUpdate gating, this timer is what keeps the countdowns live.
  @state() private _tick: number = 0;
  private _tickTimer: number | null = null;

  // Entity-resolution cache (#5): _resolveEntities() previously did an O(n) scan
  // of every HA entity on every render. Cache the result and only re-resolve when
  // the configured device_id changes or the hass.entities registry reference
  // changes (HA replaces this object when the entity registry is updated).
  private _resolvedEntities: ResolvedEntities | null = null;
  private _resolvedDeviceId: string = '';
  private _resolvedEntitiesRef: object | null = null;

  // Cache for _getDrinksOfSubstance() — mirrors the _resolvedEntities cache
  // pattern. DrinkInfo stores only entity IDs (stable identifiers), not
  // entity states, so the cache is valid until the entity registry reference
  // changes (HA replaces hass.entities on registry updates). Without this
  // cache the method did a full O(n) entity scan on every call, including
  // inside _relevantStateChanged() on every HA state change while the
  // inventory pane was active.
  private _drinksCache: { substance: 'caffeine' | 'alcohol'; entitiesRef: object; drinks: DrinkInfo[]; activeProfileId: string } | null = null;

  // Cache for _getProfileNameMap() — mirrors the _drinksCache pattern. The
  // map stores only stable UUID→name pairs (read from the Master Tracker
  // sensor attributes), so it is valid until the entity registry reference
  // changes (HA replaces hass.entities on registry updates). Used by the
  // Log Drink popup profile picker + the multi-tracker header switcher.
  private _profilesCache: { entitiesRef: object; map: Record<string, string> } | null = null;

  // ── Multi-Tracker State Machine (Phase 2) ──
  // Resolved tracker array + active index. Built once per drink_tracker_devices
  // config change or hass.entities registry change. The active tracker's
  // ResolvedEntities drives ALL panels (zero panel-internal change — the state
  // machine swaps the entity bundle ahead of the panels). _activeTrackerIndex is
  // @state so a profile switch re-renders; it is persisted to localStorage keyed
  // by a hash of drink_tracker_devices so a shared dashboard remembers each
  // browser's last view. _trackersError is @state so a mixed-substance /
  // non-tracker-device validation failure renders the error placeholder.
  @state() private _activeTrackerIndex: number = 0;
  private _resolvedTrackers: ResolvedTracker[] = [];
  @state() private _trackersError: string | null = null;
  private _trackersCache: { entitiesRef: object; configKey: string } | null = null;
  // Header profile-switcher popup (shown only when N>1).
  @state() private _showProfileSwitcher: boolean = false;
  // Legacy Profile Lock UUID stashed by setConfig migration for lazy
  // resolution in _resolveTrackers (setConfig runs before hass is available).
  // Consumed once then cleared; auto-discovery takes over if the UUID is dead.
  private _legacyProfileLock: string | null = null;
  // Legacy drink_master_entities (entity IDs) stashed by setConfig migration
  // for lazy resolution to drink_tracker_devices (device IDs) in
  // _resolveTrackers. setConfig runs before hass is available, so the
  // entity→device mapping (hass.entities[id].device_id) cannot run there.
  // Consumed once then cleared; auto-discovery takes over for dead entities.
  private _legacyMasterEntities: string[] | null = null;

  // In-flight fetch management (#3 + #4):
  //  - Separate per-fetch-type tokens prevent cross-stream invalidation. When
  //    both _fetchAmountHistory and _fetchDoseHistory fire on pane entry, a
  //    shared token caused the second call's ++ to invalidate the first call's
  //    result. Each fetch now captures its own token; after `await`, if the
  //    token no longer matches, the result is discarded. disconnectedCallback
  //    bumps both tokens to invalidate all in-flight fetches on disconnect.
  private _amountFetchToken: number = 0;
  private _doseFetchToken: number = 0;
  private _effectivenessFetchToken: number = 0;

  // Debounce timer for graphs-pane history re-fetch on hass change. Rapid
  // successive state changes (e.g. take-pill + state propagation) coalesce
  // into one fetch after the debounce delay instead of firing 3 fetches
  // (2 of which hit the recorder DB) per state change. The per-fetch race-
  // guard tokens still discard stale results from superseded fetches.
  private _graphsRefetchTimer: number | null = null;
  private static readonly GRAPHS_REFETCH_DEBOUNCE_MS = 500;

  // ── Configuration ──────────────────────────

  setConfig(config: AxDoseLoggerCardConfig) {
    // Defensive shallow clone: HA's Lovelace editor may pass a frozen
    // (Object.freeze) config object to setConfig, especially during live
    // editing. The migration code below mutates the config in place, which
    // would throw "Cannot assign to read only property" on a frozen object.
    // Clone once at the entry point so all downstream code owns a writable
    // copy. A shallow clone is sufficient — all nested button-state config
    // lives at the top level (take_button_*, drink_button_*), and the only
    // nested structure (chips[]) is handled separately below.
    config = { ...(config as any) };
    // Backward compat: convert legacy chips[] array to flat chip_N fields
    const raw = config as any;
    if (Array.isArray(raw.chips)) {
      const chips: string[] = raw.chips;
      const mapped: Record<string, string> = {};
      chips.forEach((c: string, i: number) => {
        if (c) mapped[`chip_${i + 1}`] = c;
      });
      const { chips: _chips, ...rest } = raw;
      config = { ...rest, ...mapped };
    }
    // Migrate old button-state config (7-style + pulse -> 4-style + 4-icon_style,
    // glow_speed -> ring_speed). Idempotent. See plans/
    // icon-style-dropdown-separation-plan.md §5-6.
    _migrateButtonStateConfig(config as any);
    // ── Phase 2 → Phase 3: Multi-Tracker migration (device-driven) ──
    // The selector is now drink_tracker_devices (device IDs). Two legacy
    // fields migrate lazily in _resolveTrackers (setConfig runs before hass
    // is available, so entity→device / UUID→device resolution can't happen
    // here):
    //   - drink_master_entities (entity IDs) → stashed on _legacyMasterEntities
    //     for lazy resolution to drink_tracker_devices device IDs.
    //   - drink_target_profile (Profile Lock UUID) → stashed on
    //     _legacyProfileLock for lazy resolution to a single device ID.
    // Both legacy fields are deleted from config immediately so they don't
    // linger in persisted YAML; the active-profile default replaces the lock
    // (N=1 = the new "lock"). Dead entities/UUIDs fall through to
    // auto-discovery. See plans/drink-tracker-selector-rename-plan.md.
    const raw2 = config as any;
    // Normalize drink_tracker_devices to an array (HA may store a single
    // string when the user picks one device in the multi-select).
    if (typeof raw2.drink_tracker_devices === 'string') {
      raw2.drink_tracker_devices = raw2.drink_tracker_devices ? [raw2.drink_tracker_devices] : [];
    } else if (!Array.isArray(raw2.drink_tracker_devices)) {
      raw2.drink_tracker_devices = [];
    }
    // Stash legacy drink_master_entities (entity IDs) for lazy migration.
    if (Array.isArray(raw2.drink_master_entities) && raw2.drink_master_entities.length > 0 &&
        raw2.drink_tracker_devices.length === 0) {
      this._legacyMasterEntities = raw2.drink_master_entities
        .filter((e: unknown) => typeof e === 'string' && e);
    } else if (typeof raw2.drink_master_entities === 'string' && raw2.drink_master_entities &&
               raw2.drink_tracker_devices.length === 0) {
      this._legacyMasterEntities = [raw2.drink_master_entities];
    }
    delete raw2.drink_master_entities;
    // Stash legacy Profile Lock UUID for lazy migration (only when no
    // tracker devices and no legacy entity IDs are already queued).
    if (raw2.drink_target_profile &&
        raw2.drink_tracker_devices.length === 0 &&
        !this._legacyMasterEntities) {
      this._legacyProfileLock = String(raw2.drink_target_profile);
    }
    delete raw2.drink_target_profile;
    // HA contract: throw on invalid config so HA renders an error card with
    // the message. We check for null/undefined (key missing in YAML) but NOT
    // empty string — getStubConfig() returns { device_id: '' } when the card
    // is first added in the visual editor, and that stub case should render
    // the friendly "Please select a device" placeholder in render(), not an
    // error card. A multi-tracker card may legitimately have an empty
    // device_id, so the check is skipped when drink_tracker_devices is set
    // (or a legacy migration is pending).
    if (config.device_id == null &&
        !(config as any).drink_tracker_devices?.length &&
        !this._legacyMasterEntities) {
      throw new Error(localize('en', 'setconfig.error.device_required'));
    }
    const prevDeviceId = this.config?.device_id;
    const prevTrackersKey = this._trackerConfigKey();
    // Store the raw user config without baking in defaults (#18). All read
    // sites already use the `!== false` pattern (treating undefined as true),
    // so the defaults were redundant — and baking them in polluted persisted
    // YAML and masked future default changes. Now the stored config contains
    // only what the user explicitly set.
    this.config = config;
    // If the device changed OR the trackers config changed, the cached entity
    // map is stale — drop it so the next _resolveEntities() call re-scans.
    if (prevDeviceId !== this.config.device_id || prevTrackersKey !== this._trackerConfigKey()) {
      this._invalidateEntityCache();
    }
  }

  // ── Entity Resolution ──────────────────────

  /**
   * Returns the resolved entity map for the configured device, using a cache
   * so the O(n) scan of hass.entities only runs when the device_id or the
   * entity registry reference actually changes (HA replaces the `entities`
   * object when the registry is updated). Callers that need a fresh scan
   * (e.g. after a config change) should call _invalidateEntityCache() first.
   */
  private _resolveEntities(): ResolvedEntities {
    if (!this.hass || !this.config) {
      return { medicationName: 'Medication', metrics: [] };
    }
    // ── Multi-tracker state machine (Phase 3) ──
    // When drink_tracker_devices is populated, return the active tracker's
    // pre-computed entities. The trackers array (built by _resolveTrackers)
    // already calls _computeEntities per tracker, so this is a cache hit — no
    // duplicate O(n) scan. Switching profile invalidates _resolvedEntities so
    // the next call re-resolves. Validation failures set _trackersError; the
    // caller (render) checks _trackersError and shows the placeholder instead.
    if (this._isMultiTrackerMode()) {
      const trackers = this._resolveTrackers();
      if (trackers.length === 0) {
        return { medicationName: 'Medication', metrics: [] };
      }
      const idx = Math.min(this._activeTrackerIndex, trackers.length - 1);
      this._resolvedEntities = trackers[idx].entities;
      this._resolvedDeviceId = trackers[idx].deviceId;
      this._resolvedEntitiesRef = this.hass.entities;
      return this._resolvedEntities;
    }
    // ── Single-device (legacy) path ──
    const deviceId = this.config.device_id;
    const entitiesRef = this.hass.entities;
    if (
      this._resolvedEntities &&
      this._resolvedDeviceId === deviceId &&
      this._resolvedEntitiesRef === entitiesRef
    ) {
      return this._resolvedEntities;
    }
    const result = this._computeEntities(deviceId);
    this._resolvedEntities = result;
    this._resolvedDeviceId = deviceId;
    this._resolvedEntitiesRef = entitiesRef;
    return result;
  }

  /** Force the next _resolveEntities() call to re-scan. Also clears the
    *  drinks-of-substance + profile-name caches so a device_id change
    *  re-scans granular drinks and profiles. */
  private _invalidateEntityCache(): void {
    this._resolvedEntities = null;
    this._resolvedEntitiesRef = null;
    this._drinksCache = null;
    this._profilesCache = null;
    this._trackersCache = null;
  }

  // ── Multi-Tracker State Machine (Phase 2/3) ──
  // The card has two modes:
  //   - Multi-tracker (state machine): drink_tracker_devices populated (≥1).
  //     _resolveTrackers() builds the array; _resolveEntities() returns the
  //     active tracker's entities; panels render unchanged.
  //   - Single device (legacy): drink_tracker_devices empty → fall back to
  //     device_id. _resolveEntities() uses the original device_id path.
  //
  // Auto-discovery (P2.2): when drink_tracker_devices is empty/absent AND the
  // configured device_id is NOT a Drink Tracker device, scan hass.entities for
  // all drink_master: True entities (collecting their device IDs). If the
  // found set is a single substance → auto-whitelist all of them. If multiple
  // substances → render the "please select" placeholder (do NOT silently mix
  // substances). When the configured device_id IS a Drink Tracker device
  // (legacy master card), the single-device path is used (migration in
  // setConfig converts it to the multi-tracker array so this branch is the
  // zero-config fallback only).

  /** True when the card is running the multi-tracker state machine. */
  private _isMultiTrackerMode(): boolean {
    return Array.isArray(this.config?.drink_tracker_devices) &&
      (this.config!.drink_tracker_devices!.length > 0);
  }

  /** Resolve the configured Drink Tracker devices into ResolvedTracker[].
   *  Cached keyed by the hass.entities reference + a config-derived key (so a
   *  config change forces a rebuild). For each selected device, resolves its
   *  single `drink_master: True` body-mass entity and validates single-substance.
   *  Sets _trackersError on failure and returns an empty array so render()
   *  shows the error placeholder. */
  private _resolveTrackers(): ResolvedTracker[] {
    if (!this.hass || !this.config) return [];
    const entitiesRef = this.hass.entities;
    const configKey = this._trackerConfigKey();
    // Cache hit.
    if (
      this._trackersCache &&
      this._trackersCache.entitiesRef === entitiesRef &&
      this._trackersCache.configKey === configKey &&
      this._resolvedTrackers.length > 0
    ) {
      return this._resolvedTrackers;
    }
    let deviceIds = Array.isArray(this.config.drink_tracker_devices)
      ? this.config.drink_tracker_devices.slice()
      : [];
    // ── Lazy legacy migrations (hass is now available) ──
    // Both stashes were queued by setConfig (which runs pre-hass). Resolve
    // them to device IDs here, persist into drink_tracker_devices, and clear.
    // Dead entities / UUIDs are skipped (don't hard-fail); auto-discovery
    // takes over if the stash resolves to nothing.
    if (deviceIds.length === 0 && this._legacyMasterEntities) {
      const legacyEntityIds = this._legacyMasterEntities;
      this._legacyMasterEntities = null;
      const migrated: string[] = [];
      for (const entityId of legacyEntityIds) {
        if (!entityId) continue;
        const info = this.hass.entities[entityId];
        if (!info) continue; // dead entity — skip
        if (this._getAttr(entityId, 'drink_master') !== true) continue; // not a tracker
        if (info.device_id) migrated.push(info.device_id);
      }
      if (migrated.length > 0) {
        deviceIds = migrated;
        // Persist the migration so the array is saved on next config write.
        (this.config as any).drink_tracker_devices = migrated;
      }
    }
    if (deviceIds.length === 0 && this._legacyProfileLock) {
      const lockUuid = this._legacyProfileLock;
      this._legacyProfileLock = null;
      for (const [entityId, info] of Object.entries(this.hass.entities)) {
        if (
          this._getAttr(entityId, 'drink_master') === true &&
          this._getAttr(entityId, 'profile_id') === lockUuid &&
          (info as any).device_id
        ) {
          deviceIds = [(info as any).device_id];
          // Persist the migration so the array is saved on next config write.
          (this.config as any).drink_tracker_devices = deviceIds;
          break;
        }
      }
    }
    // ── Auto-discovery fallback (zero-config) ──
    if (deviceIds.length === 0) {
      const did = this.config?.device_id;
      // Only auto-discover when there is no explicit non-tracker device
      // selected. A configured medicine / granular-drink card must NOT be
      // hijacked by a global scan for Drink Tracker devices — that would
      // render the mixed-substance error placeholder instead of the medicine
      // card when the install also has Caffeine + Alcohol trackers. Empty
      // device_id (zero-config) and a device_id that IS a Drink Tracker
      // (legacy master card) both legitimately fall through to discovery.
      if (!did || this._masterEntityForDevice(did)) {
        deviceIds = this._autoDiscoverMasterDevices();
      }
    }
    // Build trackers, validating each device.
    const trackers: ResolvedTracker[] = [];
    const seenSubstances = new Set<'caffeine' | 'alcohol'>();
    for (const deviceId of deviceIds) {
      if (!deviceId) continue;
      const entityId = this._masterEntityForDevice(deviceId);
      if (!entityId) {
        // Not a Drink Tracker device (no drink_master: True entity on it).
        this._trackersError = localize(this._lang, 'card.trackers_error_not_master');
        this._resolvedTrackers = [];
        this._trackersCache = { entitiesRef, configKey };
        return [];
      }
      const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
      if (substance !== 'caffeine' && substance !== 'alcohol') {
        this._trackersError = localize(this._lang, 'card.trackers_error_not_master');
        this._resolvedTrackers = [];
        this._trackersCache = { entitiesRef, configKey };
        return [];
      }
      seenSubstances.add(substance as 'caffeine' | 'alcohol');
      const profileId = (this._getAttr(entityId, 'profile_id') as string) || '';
      const profileName = (this._getAttr(entityId, 'profile_name') as string) || 'Default';
      const entities = this._computeEntities(deviceId);
      trackers.push({ entityId, deviceId, profileId, profileName, substance: substance as 'caffeine' | 'alcohol', entities });
    }
    // ── Single-substance validation ──
    if (seenSubstances.size > 1) {
      this._trackersError = localize(this._lang, 'card.trackers_error_mixed_substance');
      this._resolvedTrackers = [];
      this._trackersCache = { entitiesRef, configKey };
      return [];
    }
    this._trackersError = null;
    this._resolvedTrackers = trackers;
    this._trackersCache = { entitiesRef, configKey };
    // Clamp the active index to bounds + read localStorage persistence.
    this._activeTrackerIndex = this._readActiveTrackerIndex(trackers.length);
    return trackers;
  }

  /** Resolve the single `drink_master: True` body-mass entity living on a
   *  Drink Tracker device, or '' if the device is not a Drink Tracker. Only
   *  DrinkMasterSensor carries `drink_master: True` and there is exactly one
   *  per tracker device, so the match is unambiguous. */
  private _masterEntityForDevice(deviceId: string): string {
    if (!this.hass || !deviceId) return '';
    for (const [entityId, info] of Object.entries(this.hass.entities)) {
      if ((info as any).device_id === deviceId &&
          this._getAttr(entityId, 'drink_master') === true) {
        return entityId;
      }
    }
    return '';
  }

  /** Auto-discover all Drink Tracker devices (devices hosting a
   *  `drink_master: True` entity). Returns their device IDs, de-duplicated.
   *  The caller (_resolveTrackers) validates single-substance; if multiple
   *  substances are found, the card renders the placeholder. */
  private _autoDiscoverMasterDevices(): string[] {
    if (!this.hass) return [];
    const ids: string[] = [];
    const seen = new Set<string>();
    for (const [entityId, info] of Object.entries(this.hass.entities)) {
      if (this._getAttr(entityId, 'drink_master') !== true) continue;
      const devId = (info as any).device_id;
      if (devId && !seen.has(devId)) {
        seen.add(devId);
        ids.push(devId);
      }
    }
    return ids;
  }

  /** True when auto-discovery found multiple substances (render the
   *  placeholder). Only relevant in zero-config mode (drink_tracker_devices
   *  empty). A configured array is validated in _resolveTrackers instead. */
  private _autoDiscoveryIsMultiSubstance(): boolean {
    const deviceIds = this._autoDiscoverMasterDevices();
    if (deviceIds.length === 0) return false;
    const substances = new Set<string>();
    for (const deviceId of deviceIds) {
      const entityId = this._masterEntityForDevice(deviceId);
      if (!entityId) continue;
      const s = (this._getAttr(entityId, 'substance') || '').toLowerCase();
      if (s) substances.add(s);
    }
    return substances.size > 1;
  }

  /** A stable key derived from drink_tracker_devices for localStorage scoping. */
  private _trackerConfigKey(): string {
    const ids = Array.isArray(this.config?.drink_tracker_devices)
      ? this.config!.drink_tracker_devices!
      : [];
    return ids.slice().sort().join('|');
  }

  /** localStorage persistence: store the last-used _activeTrackerIndex keyed by
   *  a hash of drink_tracker_devices so a shared dashboard remembers each
   *  browser's last view. Clamp to array bounds (handles a removed tracker). */
  private _readActiveTrackerIndex(length: number): number {
    if (length === 0) return 0;
    const key = `ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;
    let stored = 0;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        const n = parseInt(raw, 10);
        if (!isNaN(n)) stored = n;
      }
    } catch { /* localStorage unavailable */ }
    if (stored < 0 || stored >= length) return 0;
    return stored;
  }

  /** Persist the active tracker index to localStorage (called on switch). */
  private _persistActiveTrackerIndex(): void {
    const key = `ax-dose-logger:tracker-idx:${this._trackerConfigKey()}`;
    try {
      window.localStorage.setItem(key, String(this._activeTrackerIndex));
    } catch { /* localStorage unavailable */ }
  }

  /** The active tracker, or null when not in multi-tracker mode / no trackers. */
  private _activeTracker(): ResolvedTracker | null {
    if (!this._isMultiTrackerMode()) return null;
    const trackers = this._resolveTrackers();
    if (trackers.length === 0) return null;
    const idx = Math.min(this._activeTrackerIndex, trackers.length - 1);
    return trackers[idx];
  }

  /** Switch the active profile (header switcher). Persists + re-renders. */
  private _switchTracker(index: number): void {
    const trackers = this._resolveTrackers();
    if (index < 0 || index >= trackers.length) return;
    this._activeTrackerIndex = index;
    this._persistActiveTrackerIndex();
    this._showProfileSwitcher = false;
    // Invalidate downstream caches so panels re-resolve for the new tracker.
    this._resolvedEntities = null;
    this._drinksCache = null;
    this.requestUpdate();
  }

  /** True when the card is in zero-config auto-discovery mode:
   *  drink_tracker_devices is empty/absent AND no explicit non-tracker
   *  device_id is selected. The card then scans hass.entities for all
   *  drink_master: True entities (collecting their device IDs). A configured
   *  drink_tracker_devices array is NOT auto-discovery (it's explicit
   *  multi-tracker). A configured medicine / granular-drink device_id is also
   *  NOT auto-discovery — it's an explicit single-device card, and running the
   *  global tracker scan here would hijack it (rendering the mixed-substance
   *  error placeholder instead of the medicine card when the install also has
   *  Caffeine + Alcohol trackers). Only an empty device_id (zero-config) OR a
   *  device_id that already points at a Drink Tracker (legacy master card)
   *  fall through to discovery. The discriminator reuses
   *  _masterEntityForDevice() (returns '' for any non-tracker device). Used by
   *  render() to decide whether to run the trackers-validation path before the
   *  device_id fallback. */
  private _autoDiscoveryActive(): boolean {
    if (this._isMultiTrackerMode()) return false;
    const did = this.config?.device_id;
    if (did && !this._masterEntityForDevice(did)) return false;
    return true;
  }

  /** The active tracker's display name (for the header switcher chip). Empty
   *  when not in multi-tracker mode or no trackers resolved. */
  private _activeTrackerName(): string {
    return this._activeTracker()?.profileName ?? '';
  }

  /** Render the trackers error placeholder (non-master entity or mixed
   *  substance). Shown in place of the card so the admin can fix the config. */
  private _renderTrackersError(): TemplateResult {
    const msg = this._trackersError || localize(this._lang, 'card.trackers_error_generic');
    return html`
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:alert-circle" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.trackers_error_title')}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${msg}</div>
        </div>
      </ha-card>
    `;
  }

  /** Render the "please select" placeholder (zero-config multi-substance
   *  household or no master trackers found). */
  private _renderTrackersPlaceholder(): TemplateResult {
    return html`
      <ha-card>
        <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
          <ha-icon icon="mdi:account-group" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
          <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.trackers_placeholder_title')}</div>
          <div style="font-size: 14px; color: var(--secondary-text-color);">${localize(this._lang, 'card.trackers_placeholder_subtitle')}</div>
        </div>
      </ha-card>
    `;
  }

  /** Render the header profile switcher popup (shown when N>1). Lists the
   *  configured trackers as buttons; tapping one switches the active profile. */
  private _renderProfileSwitcher(): TemplateResult {
    const trackers = this._resolveTrackers();
    const close = () => { this._showProfileSwitcher = false; };
    return html`
      <ha-dialog open width="small" @closed=${close}>
        <div slot="header" class="dialog-header">${localize(this._lang, 'card.profile_switcher_title')}</div>
        <div class="dialog-body">
          <div class="log-drink-grid">
            ${trackers.map((t, i) => html`
              <button
                class="dialog-btn log-drink-btn ${i === this._activeTrackerIndex ? 'active' : ''}"
                @click=${delayedAction(() => this._switchTracker(i))}
              >
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:account"></ha-icon>
                <span class="log-drink-name">${t.profileName}</span>
              </button>
            `)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // ── M2M Multi-Profile — profile UUID → display-name map ──
  // Builds a { profileId: profileName } map by scanning hass.entities for
  // drink_master: True and reading the profile_id + profile_name state
  // attributes (exposed by DrinkMasterSensor in the backend). The map is
  // cached keyed by the hass.entities reference (HA replaces it on registry
  // updates), mirroring the _drinksCache pattern. Used by:
  //   - The Log Drink popup profile picker (shared drinks) — to show
  //     human-readable profile names on the sub-list buttons.
  //   - The multi-tracker header switcher (active profile display name).
  // Fallbacks:
  //   - profile_name null/missing → "Default" (the legacy singleton).
  //   - A UUID in a drink's allowed_profiles with no matching master sensor
  //     (profile deleted but not yet scrubbed) → not in the map; the popup
  //     falls back to a truncated-UUID label. The backend _validate_profile_id
  //     guard raises HomeAssistantError if a dead UUID is actually submitted.
  private _getProfileNameMap(): Record<string, string> {
    if (!this.hass) return {};
    const entitiesRef = this.hass.entities;
    if (
      this._profilesCache &&
      this._profilesCache.entitiesRef === entitiesRef
    ) {
      return this._profilesCache.map;
    }
    const map: Record<string, string> = {};
    for (const [entityId] of Object.entries(this.hass.entities)) {
      if (this._getAttr(entityId, 'drink_master') !== true) continue;
      const pid = this._getAttr(entityId, 'profile_id');
      if (typeof pid !== 'string' || !pid) continue;
      const pname = this._getAttr(entityId, 'profile_name');
      map[pid] = (typeof pname === 'string' && pname) ? pname : 'Default';
    }
    this._profilesCache = { entitiesRef, map };
    return map;
  }

  /** Resolve a display name for a profile UUID, with a truncated-UUID
   *  fallback when the profile is not found in the map (deleted / not yet
   *  loaded). The fallback shows the first 4 chars + "…" so the user sees
   *  *something* rather than a blank; the backend guard prevents a real log
   *  to a dead UUID. */
  private _profileDisplayName(profileId: string): string {
    const map = this._getProfileNameMap();
    const name = map[profileId];
    if (name) return name;
    return profileId.length > 8 ? `${profileId.slice(0, 4)}…` : profileId;
  }

  private _computeEntities(deviceId: string): ResolvedEntities {
    const result: ResolvedEntities = { medicationName: 'Medication', metrics: [] };
    if (!this.hass) return result;

    // Extract medication name from device registry
    if (this.hass.devices?.[deviceId]?.name) {
      result.medicationName = this.hass.devices[deviceId].name!;
    }

    // Iterate all entities to find those belonging to this device. This single
    // pass handles both suffix-based medicine categorization AND master-tracker
    // / granular-drink detection (N5: previously two separate loops over the
    // same hass.entities object — merged since the result is cached and only
    // runs on device-id or registry change, but the double iteration was a
    // code-quality smell).
    let isMaster = false;
    let isGranularDrink = false;
    for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
      if (entityInfo.device_id !== deviceId) continue;

      // Fallback: extract medication name from first matching entity
      if (result.medicationName === 'Medication' && entityInfo.name) {
        result.medicationName = entityInfo.name;
      }

      // Categorize by domain and suffix
      if (entityId.startsWith('sensor.')) {
        if (entityId.endsWith('_total_doses')) result.totalDoses = entityId;
        else if (entityId.endsWith('_last_dose')) result.lastDose = entityId;
        else if (entityId.endsWith('_pills_safe_to_take')) result.pillsSafeToTake = entityId;
        else if (entityId.endsWith('_amount_in_body')) result.amountInBody = entityId;
        else if (entityId.endsWith('_next_dose')) result.nextDose = entityId;
        else if (entityId.endsWith('_overdue')) result.overdue = entityId;
        else if (entityId.endsWith('_avg_daily_doses_7_days')) result.avg7Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_14_days')) result.avg14Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_30_days')) result.avg30Days = entityId;
        else if (entityId.endsWith('_avg_daily_doses_365_days') || entityId.endsWith('_avg_daily_doses_yearly')) result.avgYearly = entityId;
        else if (entityId.endsWith('_adherence_7_days')) result.adherence7Days = entityId;
        else if (entityId.endsWith('_adherence_14_days')) result.adherence14Days = entityId;
        else if (entityId.endsWith('_adherence_30_days')) result.adherence30Days = entityId;
        else if (entityId.endsWith('_adherence_365_days')) result.adherence365Days = entityId;
        else if (entityId.endsWith('_days_since_first_dose')) result.daysSinceFirstDose = entityId;
        else if (entityId.endsWith('_days_to_steady_state')) result.steadyState = entityId;
        // Days-left inventory-burn sensor. Two suffixes exist (scheduled
        // "_days_left" vs As Needed "_days_left_est"); longest-first so the
        // shorter suffix doesn't shadow the longer. The estimation flag is
        // read from the backend `estimation` state attribute so the Stats
        // row picks the matching label ("Days left" vs "Est. days left").
        else if (entityId.endsWith('_days_left_est')) {
          result.daysLeft = entityId;
          result.daysLeftEst = true;
        }
        else if (entityId.endsWith('_days_left')) {
          result.daysLeft = entityId;
          result.daysLeftEst = false;
        }
        else if (entityId.endsWith('_strength')) result.strength = entityId;
        else if (entityId.endsWith('_24h_limit_exceeded')) result.limit24hExceeded = entityId;
      } else if (entityId.startsWith('button.')) {
        if (entityId.endsWith('_take')) result.takeButton = entityId;
        else if (entityId.endsWith('_reset_history')) result.resetButton = entityId;
        else if (entityId.endsWith('_undo_dose')) result.undoButton = entityId;
        else if (entityId.endsWith('_reset_adherence')) result.adherenceResetButton = entityId;
        else {
          // Adherence cover + skip buttons are resolved by the backend
          // `role` state attribute, NOT entity_id suffix. The friendly
          // name "Mark Last Adherence Taken" slugifies to
          // `_mark_last_adherence_taken`, not `_cover_last_missed` (the
          // translation_key), so suffix-matching failed and the button
          // never resolved — it was missing from the Tools pane. The
          // `role` attribute is set explicitly by the backend and is the
          // same pattern the drink buttons already use.
          const btnRole = this._getAttr(entityId, 'role');
          if (btnRole === 'cover') result.adherenceCoverButton = entityId;
          else if (btnRole === 'skip') result.skipButton = entityId;
        }
      } else if (entityId.startsWith('number.')) {
        if (entityId.endsWith('_pills_left')) result.pillsLeft = entityId;
        else if (entityId.endsWith('_add_refill')) result.addRefill = entityId;
        else if (entityId.endsWith('_effectiveness')) {
          // Effectiveness tracking slider — collect for the Tracking pane
          // Entity ID pattern: number.{device}_{metric_slug}_effectiveness
          // metric_label is the clean metric name (e.g. "Pain") exposed by the backend
          // — friendly_name includes the device prefix (e.g. "Ibuprofen Pain Effectiveness")
          const metricLabel = this._getAttr(entityId, 'metric_label') as string | undefined;
          const label = metricLabel || entityInfo.name?.replace(/\s+Effectiveness$/i, '') || entityId;
          const metricKey = this._getAttr(entityId, 'metric_key') || '';
          result.metrics.push({ entityId, label, metricKey });
        }
      }

      // ── Master Tracker (Caffeine/Alcohol) + granular drink detection ──
      // Merged into the same single pass as the suffix categorization above
      // (N5: previously a second Object.entries loop). Master tracker entities
      // use different suffixes than medicine entities, so the suffix block
      // above doesn't populate ResolvedEntities for them. Detect them by state
      // attributes (`drink_master: True` for masters, `device_type: "drink"`
      // for granular drinks) and populate the master fields. Granular drink
      // devices set deviceType='drink' so render() can show the redirect
      // placeholder.
      const drinkMaster = this._getAttr(entityId, 'drink_master');
      const dt = (this._getAttr(entityId, 'device_type') || '').toLowerCase();
      if (drinkMaster === true) {
        isMaster = true;
        const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
        if (substance === 'caffeine' || substance === 'alcohol') result.substance = substance;
        // Body-mass sensor: has pk_model attribute + no window_days.
        if (this._getAttr(entityId, 'pk_model') && this._getAttr(entityId, 'window_days') === undefined) {
          result.amountInBody = entityId;
        }
        // Avg sensors: have window_days attribute.
        const wd = this._getAttr(entityId, 'window_days');
        if (wd !== undefined && wd !== null) {
          if (wd === 7) result.avg7Days = entityId;
          else if (wd === 14) result.avg14Days = entityId;
          else if (wd === 30) result.avg30Days = entityId;
          else if (wd === 365) result.avgYearly = entityId;
        }
        // Master-specific sensors are classified by the backend `role` STATE
        // ATTRIBUTE, NOT entity_id suffix. HA derives entity_id from
        // slugify(translated_name), so the old suffix matches (e.g.
        // `.sleep_disruption_caffeine`, `.drink_master_last_dose_caffeine`,
        // `_daily_amount_`) never matched the name-derived entity_ids
        // (sensor.caffeine_tracker_sleep_disruption, …_last_caffeine,
        // …_amount_in_last_24h) → Disruption showed N/A, Last showed "Never",
        // Amount-in-24h was undefined. State attributes survive renames and
        // are present on hass.states (unlike unique_id, which the
        // list_for_display websocket omits).
        const masterRole = this._getAttr(entityId, 'role');
        if (masterRole === 'daily_amount') result.amountLast24h = entityId;
        else if (masterRole === 'sleep_disruption') result.sleepDisruption = entityId;
        else if (masterRole === 'estimated_low_time') result.estimatedLowTime = entityId;
        else if (masterRole === 'low_hours_until') result.lowHoursUntil = entityId;
        // Dedicated Master Tracker last-dose TIMESTAMP sensor — its state IS
        // the last-dose timestamp (single source of truth), so the Daily
        // panel's computeTimeSinceLastDose helper works unchanged for masters.
        else if (masterRole === 'last_dose') result.lastDose = entityId;
        // The Master Tracker no longer has a days-left sensor (removed in
        // backend v14 — the aggregate has no single inventory). The per-
        // granular-drink DrinkDaysLeftSensor powers the Inventory panel's
        // per-drink "Est. days left" 2nd line instead. Do NOT map a master
        // days_left role here — the Stats panel's `if (e.daysLeft)` guard
        // then skips the row for master devices.
        //
        // The Master Tracker also has no dedicated "Total Doses" sensor.
        // The body-mass sensor (amountInBody, mapped above) carries a
        // dose_count attribute, but surfacing it as a "Total Doses" Stats
        // box on the aggregate device is misleading — the box is omitted
        // for master devices by NOT mapping totalDoses here. Medicine
        // devices still map totalDoses via the `_total_doses` suffix above.
      } else if (dt === 'drink') {
        isGranularDrink = true;
        const substance = (this._getAttr(entityId, 'substance') || '').toLowerCase();
        if (substance === 'caffeine' || substance === 'alcohol') result.substance = substance;
        // Granular drink days-left sensor (classified by role like the master
        // variant). Granular devices redirect to the Master Tracker so the
        // Stats panel never renders for them, but resolving the field keeps
        // the classifier complete and available for any future surface.
        if (this._getAttr(entityId, 'role') === 'days_left') {
          result.daysLeft = entityId;
          result.daysLeftEst = true;
        }
      }
    }
    if (isMaster) {
      result.deviceType = 'drink_master';
    } else if (isGranularDrink) {
      result.deviceType = 'drink';
    }

    return result;
  }

  // ── Chip Helpers ───────────────────────────

  // Enumerate configured Daily-panel custom chips (chip_1..4 + icon/label +
  // 3 ui_action overrides).  Each chip now carries the full override suite
  // mirroring the Safe to Take / Pills Left box pattern: entity + label +
  // icon + tap/hold/double_tap actions.  The panel passes the configs back to
  // handleChipAction on click/hold/double-tap.
  private _getChipEntities(): ChipConfig[] {
    if (!this.config) return [];
    const chips: ChipConfig[] = [];
    for (const key of ['chip_1', 'chip_2', 'chip_3', 'chip_4'] as const) {
      const val = this.config[key];
      if (val) {
        const labelKey = `${key}_label` as keyof AxDoseLoggerCardConfig;
        const iconKey = `${key}_icon` as keyof AxDoseLoggerCardConfig;
        const showIconKey = `${key}_show_icon` as keyof AxDoseLoggerCardConfig;
        const tapKey = `${key}_tap_action` as keyof AxDoseLoggerCardConfig;
        const holdKey = `${key}_hold_action` as keyof AxDoseLoggerCardConfig;
        const dblKey = `${key}_double_tap_action` as keyof AxDoseLoggerCardConfig;
        chips.push({
          entityId: val,
          label: this.config[labelKey] as string | undefined,
          icon: this.config[iconKey] as string | undefined,
          showIcon: this.config[showIconKey] === true,
          tapAction: this.config[tapKey] as ActionConfig | undefined,
          holdAction: this.config[holdKey] as ActionConfig | undefined,
          doubleTapAction: this.config[dblKey] as ActionConfig | undefined,
        });
      }
    }
    return chips;
  }

  // ── State Helpers ──────────────────────────

  private _getState(entityId?: string): string {
    return getStateHelper(this.hass, entityId);
  }

  private _getAttr(entityId?: string, attr?: string): any {
    return getAttrHelper(this.hass, entityId, attr);
  }

  private _getStrengthUnit(entities: ResolvedEntities): string {
    // Medicine devices expose a `strength` sensor with a `strength_unit` attr.
    // Master Trackers have no strength sensor; read the native unit off the
    // body-mass (amountInBody) sensor instead so alcohol masters show "g" and
    // caffeine masters show "mg" in the Graph + Stats panels.
    const unit = this._getAttr(entities.strength, 'strength_unit');
    if (typeof unit === 'string' && unit) return unit;
    const bodyUnit = this._getAttr(entities.amountInBody, 'unit_of_measurement');
    return (typeof bodyUnit === 'string' && bodyUnit) ? bodyUnit : 'mg';
  }

  private _formatInteger(value: string): string {
    return formatIntegerHelper(value);
  }

  // ── Color Scheme ───────────────────────────

  private _getColorOverrides(): string {
    return getColorOverridesHelper(this.config?.color_scheme);
  }

  // ── Dose History ───────────────────────────

  private _toLocalDateKey(d: Date): string {
    return toLocalDateKeyHelper(d);
  }

  private _bucketByDay(dayCount: number = 14): DayBucket[] {
    const buckets: Record<string, number> = {};

    // Count doses per day from custom API data
    // Each entry is [iso_timestamp, strength]
    // Use local timezone for date bucketing (NOT .toISOString() which shifts to UTC)
    for (const entry of this._doseHistory) {
      const key = this._toLocalDateKey(new Date(entry[0]));
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const result: DayBucket[] = [];
    const now = new Date();
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = this._toLocalDateKey(d);
      result.push({
        date: key,
        label: d.getDate().toString(),
        count: buckets[key] || 0,
      });
    }
    return result;
  }

  // ── Computed Values ────────────────────────

  private _computeNextDose(entities: ResolvedEntities): string {
    const state = this._getState(entities.nextDose);
    if (state === 'unavailable' || state === 'unknown') return 'Unavailable';

    try {
      const next = new Date(state);
      const now = new Date();
      if (isNaN(next.getTime()) || next <= now) return 'now';

      const diffMs = Math.max(0, next.getTime() - now.getTime());
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[ax-dose-logger-card] _computeNextDose failed:', e);
      return 'Unavailable';
    }
  }

  /**
   * For scheduled medications, returns how long the user is PAST their
   * scheduled next-dose time, formatted as "Xh XXm". Returns null when:
   *   - tracking_type is "As Needed" (no preset schedule)
   *   - next_dose is unavailable/unknown
   *   - next_dose is still in the future (not yet overdue)
   */
  private _computeOverTime(entities: ResolvedEntities): string | null {
    const trackingType = this._getAttr(entities.nextDose, 'tracking_type');
    if (trackingType === 'As Needed') return null;

    const state = this._getState(entities.overdue);
    if (state === 'unavailable' || state === 'unknown' || !state) return null;

    const seconds = parseFloat(state);
    if (isNaN(seconds) || seconds <= 0) return null;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Compute a human-readable label for when the pill-limit rolling window
   * resets (i.e. when safe_to_take will increment). Reads the
   * `window_expires_at` attribute exposed by the Pills Safe to Take sensor.
   * Falls back to the next_dose sensor for back-compat with older backends
   * that don't expose window_expires_at.
   */
  private _computeWindowExpiry(entities: ResolvedEntities): string {
    const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
    if (expiresAt && typeof expiresAt === 'string') {
      try {
        const exp = new Date(expiresAt);
        const now = new Date();
        if (!isNaN(exp.getTime()) && exp > now) {
          const diffMs = exp.getTime() - now.getTime();
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          if (hours > 0) return `${hours}h ${minutes}m`;
          return `${minutes}m`;
        }
      } catch (e) {
        console.warn('[ax-dose-logger-card] _computeWindowExpiry failed:', e);
        // fall through to next_dose fallback
      }
    }
    return this._computeNextDose(entities);
  }

  /**
   * Format an absolute Date as a locale-aware clock time for the override
   * dialog. Same-day times use formatTime (e.g. "2:30 PM"); cross-day times
   * (next dose is tomorrow+) use formatDateTime so the date is visible.
   * Falls back to toLocaleTimeString() if hass.locale is unavailable.
   */
  private _formatOverrideTime(date: Date): string {
    if (!this.hass?.locale) return date.toLocaleTimeString();
    const now = new Date();
    const sameDay = date.getFullYear() === now.getFullYear()
      && date.getMonth() === now.getMonth()
      && date.getDate() === now.getDate();
    return sameDay
      ? formatTime(date, this.hass.locale)
      : formatDateTime(date, this.hass.locale);
  }

  private _computeTimeSinceLastDose(entities: ResolvedEntities): string {
    const state = this._getState(entities.lastDose);
    if (state === 'unavailable' || state === 'unknown' || state === 'None' || !state) {
      return 'Never';
    }

    try {
      const last = new Date(state);
      const now = new Date();
      if (isNaN(last.getTime())) return 'Never';

      const diffMs = Math.max(0, now.getTime() - last.getTime());
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours > 0) return `${hours}h ${minutes}m`;
      return `${minutes}m`;
    } catch (e) {
      console.warn('[ax-dose-logger-card] _computeTimeSinceLastDose failed:', e);
      return 'Never';
    }
  }

  // ── Computed Values: Timeframe ─────────────

  private _getTimeframeHours(): number {
    // Delegates to the shared helper so the container + graphs panel use the
    // same timeframe→hours mapping without duplicating the switch.
    return getTimeframeHoursHelper(this._activeTimeframe);
  }

  // ── Actions ────────────────────────────────

  private _handleTakePill(entities: ResolvedEntities) {
    if (!this.hass || !entities.takeButton) return;

    const safeState = this._getState(entities.pillsSafeToTake);
    const safeCount = parseInt(safeState, 10);

    // 24h Strength Limit reached — show override dialog with 24h-specific
    // text. This fires when the next dose would push the 24h strength sum
    // over the daily_limit, or the limit is already exceeded. Checked
    // before the pill-count lockout so the user sees the more specific
    // 24h strength warning even when pills are still available.
    if (entities.limit24hExceeded) {
      const limitState = this._getState(entities.limit24hExceeded);
      if (limitState === 'on') {
        const currentAmount = this._getAttr(entities.limit24hExceeded, 'current_amount');
        const dailyLimit = this._getAttr(entities.limit24hExceeded, 'daily_limit');
        const nextStrength = this._getAttr(entities.limit24hExceeded, 'next_dose_strength');
        const alreadyExceeded = this._getAttr(entities.limit24hExceeded, 'already_exceeded');
        const unit = this._getAttr(entities.limit24hExceeded, 'unit_of_measurement') || 'mg';
        const projected = (typeof currentAmount === 'number' ? currentAmount : 0)
          + (typeof nextStrength === 'number' ? nextStrength : 0);
        const timeLabel = `${currentAmount} / ${dailyLimit} ${unit}`;
        const bodyKey = alreadyExceeded
          ? 'dialog.override.body_24h_exceeded'
          : 'dialog.override.body_24h_would_exceed';
        this._overrideDialog = {
          timeLabel,
          bodyKey,
          entities,
        };
        // Store extra context for the dialog body placeholders.
        this._overrideDialogExtras = {
          current: String(currentAmount),
          limit: String(dailyLimit),
          next: String(nextStrength),
          projected: String(projected),
          unit: String(unit),
        };
        return;
      }
    }

    if (!isNaN(safeCount) && safeCount <= 0) {
      // Pill limit reached: show the HA-native override confirmation dialog
      // instead of the synchronous browser confirm() box (#6). The actual
      // button.press call happens in the dialog's Confirm handler.
      //
      // Body text + time source branch by tracking type:
      //   - Scheduled (regular_interval / time_of_day / cyclic): show the next
      //     designated dose time from the next_dose sensor.
      //   - As Needed (PRN): show when the rolling safety window resets via the
      //     window_expires_at attribute on the pills_safe_to_take sensor.
      // tracking_type is normalized defensively (snake_case "as_needed" and
      // legacy title-case "As Needed") since the backend stores snake_case
      // (const.py) but older deployments may expose title-case.
      const tt = (this._getAttr(entities.nextDose, 'tracking_type') || '').toLowerCase();
      const isAsNeeded = tt === 'as_needed' || tt === 'as needed';

      let timeLabel: string;
      let bodyKey: 'dialog.override.body_scheduled' | 'dialog.override.body_as_needed';

      if (isAsNeeded) {
        const expiresAt = this._getAttr(entities.pillsSafeToTake, 'window_expires_at');
        const expDate = expiresAt ? new Date(expiresAt as string) : null;
        if (expDate && !isNaN(expDate.getTime())) {
          timeLabel = this._formatOverrideTime(expDate);
          bodyKey = 'dialog.override.body_as_needed';
        } else {
          // Fallback: backend without window_expires_at — show relative duration.
          timeLabel = this._computeWindowExpiry(entities);
          bodyKey = 'dialog.override.body_as_needed';
        }
      } else {
        const nextDoseState = this._getState(entities.nextDose);
        const nextDate = (nextDoseState && nextDoseState !== 'unavailable' && nextDoseState !== 'unknown')
          ? new Date(nextDoseState) : null;
        if (nextDate && !isNaN(nextDate.getTime()) && nextDate > new Date()) {
          timeLabel = this._formatOverrideTime(nextDate);
          bodyKey = 'dialog.override.body_scheduled';
        } else {
          // Fallback: next_dose unavailable or already past — relative duration.
          timeLabel = this._computeWindowExpiry(entities);
          bodyKey = 'dialog.override.body_scheduled';
        }
      }

      this._overrideDialog = { timeLabel, bodyKey, entities };
      return;
    }

    this.hass.callService('button', 'press', {
      entity_id: entities.takeButton,
    });
    // Trigger the transient ACK (logged) flash on the Take Pill button.
    this._triggerDailyAck();
  }

  private _handleUndoDose(entities: ResolvedEntities) {
    if (!this.hass || !entities.undoButton) return;
    this.hass.callService('button', 'press', {
      entity_id: entities.undoButton,
    });
  }

  private _handleRefill(entities: ResolvedEntities) {
    if (!this.hass) return;
    // Target is the Master Tracker Inventory override when set, otherwise the
    // medicine device's own addRefill entity.
    const targetEntityId = this._refillTarget?.addStockEntityId ?? entities.addRefill;
    if (!targetEntityId) return;
    const value = parseFloat(this._refillAmount);
    if (isNaN(value) || value <= 0) return;
    this.hass.callService('number', 'set_value', {
      entity_id: targetEntityId,
      value: value,
    });
    this._showRefillDialog = false;
    this._refillAmount = '';
    this._refillTarget = null;
  }

  // ── Master Tracker Drinks actions ──────────
  // Enumerate every granular drink device of a substance for the Log Drink
  // popup, Inventory panel, and Tools panel.  Groups hass.entities by
  // device_id after filtering on platform + device_type='drink' state attr +
  // matching substance, then resolves each device's log/undo/reset buttons,
  // stock + add_stock numbers, and 7/365-day avg sensors.
  //
  // Classification uses the backend `role` STATE ATTRIBUTE (set in
  // _attr_extra_state_attributes on each granular entity), NOT the entity_id
  // suffix. HA derives entity_id from slugify(translated_name)
  // (async_generate_entity_id + util.slugify), and every drink entity sets
  // _attr_has_entity_name = True, so the entity_id is the slugified *name*
  // (e.g. DrinkStockNumber → number.coffee_inventory), NOT the unique_id stem
  // (_drink_stock) — an entity_id-suffix match silently misses every entity
  // except DrinkLogButton (whose "Log Drink" name coincidentally slugifies to
  // log_drink). unique_id is NOT present on hass.entities either (HA's
  // list_for_display websocket omits it — see _as_display_dict), so matching
  // unique_id stems also fails. State attributes ARE present on
  // hass.states[entityId].attributes, integration-controlled, and survive
  // renames — the same approach already proven by device_type/substance/
  // pk_model. Avg sensors also carry window_days to distinguish 7/365.
  private _getDrinksOfSubstance(substance: 'caffeine' | 'alcohol'): DrinkInfo[] {
    if (!this.hass) return [];
    // Cache hit: if the substance + entity-registry reference + active profile
    // are unchanged since the last scan, return the cached result. DrinkInfo
    // stores only entity IDs (stable), so the cache is valid until the registry
    // reference changes or is explicitly invalidated. The active profile ID is
    // part of the key so a profile switch re-scans with a different filter
    // (Phase 2 multi-tracker inventory filtering).
    const entitiesRef = this.hass.entities;
    const activeProfileId = this._activeTracker()?.profileId ?? '';
    if (
      this._drinksCache &&
      this._drinksCache.substance === substance &&
      this._drinksCache.entitiesRef === entitiesRef &&
      this._drinksCache.activeProfileId === activeProfileId
    ) {
      return this._drinksCache.drinks;
    }
    const byDevice: Record<string, DrinkInfo> = {};
    for (const [entityId, entityInfo] of Object.entries(this.hass.entities)) {
      if (entityInfo.platform !== 'ax_dose_logger') continue;
      const deviceId = entityInfo.device_id;
      if (!deviceId) continue;
      const dt = (this._getAttr(entityId, 'device_type') || '').toLowerCase();
      if (dt !== 'drink') continue;
      const sub = (this._getAttr(entityId, 'substance') || '').toLowerCase();
      if (sub !== substance) continue;
      const info = byDevice[deviceId] ?? {
        deviceId,
        name: this.hass.devices?.[deviceId]?.name || entityInfo.name || entityId,
        substance,
      };
      // Classify by the backend `role` state attribute (+ window_days for avg
      // sensors). Store entity_id for state lookups / service calls.
      const role = this._getAttr(entityId, 'role');
      if (entityId.startsWith('button.')) {
        if (role === 'log') {
          info.logButtonEntityId = entityId;
          // M2M: read allowed_profiles from the DrinkLogButton attribute so
          // the popup can decide single-tap vs. profile-picker without a
          // second entity lookup on every render. config_entry_id is needed
          // for the log_drink service call (entry_id field). Both are read
          // once here and cached in DrinkInfo.
          const ap = this._getAttr(entityId, 'allowed_profiles');
          if (Array.isArray(ap)) info.allowedProfiles = ap.map(String);
          if (entityInfo.config_entry_id) info.configEntryId = entityInfo.config_entry_id;
        }
        else if (role === 'undo') info.undoButtonEntityId = entityId;
        else if (role === 'reset') info.resetButtonEntityId = entityId;
      } else if (entityId.startsWith('number.')) {
        if (role === 'stock') info.stockEntityId = entityId;
        else if (role === 'add_stock') info.addStockEntityId = entityId;
      } else if (entityId.startsWith('sensor.')) {
        if (role === 'avg') {
          const wd = this._getAttr(entityId, 'window_days');
          if (wd === 7) info.avg7EntityId = entityId;
          else if (wd === 365) info.avg365EntityId = entityId;
        }
        // Per-granular-drink "Est. days left" sensor (DrinkDaysLeftSensor).
        // Powers the Inventory panel's col-1 2nd line.
        else if (role === 'days_left') info.daysLeftEntityId = entityId;
      }
      byDevice[deviceId] = info;
    }
    let result = Object.values(byDevice).sort((a, b) => a.name.localeCompare(b.name));
    // ── Phase 2: inventory filtering by active profile ──
    // In multi-tracker mode, only drinks the active profile is allowed to log
    // render. Switching profile remounts the Drinks panel with a different
    // drink set. Single-device mode (activeProfileId === '') skips the filter.
    if (activeProfileId) {
      result = result.filter(d => (d.allowedProfiles ?? []).includes(activeProfileId));
    }
    // Cache the scan result so subsequent calls (e.g. _relevantStateChanged
    // on every HA state change while inventory pane is active) skip the scan.
    this._drinksCache = { substance, entitiesRef, drinks: result, activeProfileId };
    return result;
  }

  // Days-since reveal for a granular drink, reading the history_start_date
  // attribute on its 365-day avg sensor (DrinkAvgDosesSensor exposes it).
  private _drinkDaysSinceReveal(avg365EntityId?: string): { hasDaysSensor: boolean; daysSince: number } {
    if (!avg365EntityId) return { hasDaysSensor: false, daysSince: 0 };
    const startIso = this._getAttr(avg365EntityId, 'history_start_date');
    if (!startIso) return { hasDaysSensor: false, daysSince: 0 };
    const start = new Date(startIso);
    if (isNaN(start.getTime())) return { hasDaysSensor: false, daysSince: 0 };
    const days = Math.floor((Date.now() - start.getTime()) / 86400000);
    return { hasDaysSensor: true, daysSince: Math.max(0, days) };
  }

  /** Log a granular drink via the ax_dose_logger.log_drink service.
   *
   *  M2M routing: the optional targetProfile routes the PK payload to a
   *  specific profile's Master Tracker. When omitted, the backend applies
   *  the single-profile convenience default (single/zero-profile drinks) or
   *  raises for shared drinks (the popup resolves the target before calling
   *  so this path only receives an omitted target for single/zero-profile
   *  drinks). The local inventory always decrements regardless.
   *
   *  Phase 2 active-profile inheritance: when no explicit targetProfile is
   *  passed AND the card is in multi-tracker mode, the active tracker's
   *  profileId is the implicit default — the popup's single-tap path (which
   *  calls _logDrink with no target) routes to the active profile for shared
   *  drinks the active profile is allowed to log. The popup's profile-picker
   *  path passes an explicit targetProfile (the user picked a profile manually
   *  from the sub-list restricted to _resolvedTrackers). N=1 cards never show
   *  a sub-list — one-tap, always the sole profile.
   *
   *  Replaces the prior button.press call: the DrinkLogButton is stateless
   *  and raises HomeAssistantError for multi-profile drinks (cannot carry a
   *  per-press target_profile). The service path is the backend's documented
   *  contract for the card. entry_id is resolved from the log button's
   *  config_entry_id (hass.entities).
   */
  private _logDrink(logButtonEntityId: string, targetProfile?: string): void {
    if (!this.hass || !logButtonEntityId) return;
    // Resolve the drink's config entry id (required for the service call).
    const entryId = this.hass.entities[logButtonEntityId]?.config_entry_id;
    if (!entryId) {
      console.warn('[ax-dose-logger-card] _logDrink: no config_entry_id for', logButtonEntityId);
      return;
    }
    // Phase 2: apply the active tracker's profile as the implicit default when
    // no explicit target was passed. The popup passes an explicit target from
    // the picker; the single-tap path passes nothing, so the active profile
    // kicks in here for shared drinks the active profile is allowed to log.
    // In single-device mode (no active tracker) the effective target is
    // undefined → backend convenience default / single-profile short-circuit.
    const activeProfileId = this._activeTracker()?.profileId;
    const effectiveTarget = targetProfile ?? activeProfileId;
    this.hass.callService('ax_dose_logger', 'log_drink', {
      entry_id: entryId,
      ...(effectiveTarget ? { target_profile: effectiveTarget } : {}),
    });
    this._showLogDrinkDialog = false;
    this._logDrinkSubstance = null;
    this._logDrinkProfileTarget = null;
    // Trigger the transient ACK flash on the Drinks panel's Log Drink button.
    this._triggerDrinksAck();
  }

  /**
   * Trigger the transient ACK (logged) flash on the Daily Take Pill button.
   * Called after a successful button.press (both the direct press path and the
   * limit-reached override-dialog confirm path). Sets the reactive flag true,
   * clears any in-flight timer, then arms a new setTimeout that flips it back
   * to false after the configured ack_duration_ms (default 3000). Non-blocking
   * — the container keeps rendering normally while the flash plays out.
   */
  private _triggerDailyAck(): void {
    const duration = this.config?.take_button_ack_duration_ms ?? 3000;
    // Freeze the resolved button state for the ACK intro window so the
    // post-press state transition (e.g. idle to lockout) is hidden behind the
    // overlay once it's opaque. Capture the PRE-press state from the live
    // entities first — the trigger fires synchronously right after
    // button.press, before HA has pushed the new state, so the resolved state
    // is still the pre-press value.
    const entities = this._resolveEntities();
    this._dailyFrozenState = this._computeDailyButtonState(entities);
    if (this._dailyFreezeTimer !== undefined) {
      window.clearTimeout(this._dailyFreezeTimer);
    }
    this._dailyFreezeTimer = window.setTimeout(() => {
      if (!this._connected) return; // N3: detached guard
      this._dailyFrozenState = null;
      this._dailyFreezeTimer = undefined;
      this.requestUpdate();
    }, ACK_INTRO_MS);

    // Rapid successive clicks: if a flash is already active, increment the
    // running counter (1st press showed "Logged", 2nd shows "Logged 2x" etc.)
    // and reset the fade timer. If this is the first press in the window,
    // initialise the counter to 1 and arm the flag. The counter and flag are
    // cleared together when the timer fires so there is one source of truth.
    if (this._dailyAckActive) {
      this._dailyAckCount += 1;
    } else {
      this._dailyAckCount = 1;
      this._dailyAckActive = true;
    }
    if (this._dailyAckTimer !== undefined) {
      window.clearTimeout(this._dailyAckTimer);
    }
    this._dailyAckTimer = window.setTimeout(() => {
      if (!this._connected) return; // N3: detached guard
      this._dailyAckActive = false;
      this._dailyAckCount = 0;
      this._dailyAckTimer = undefined;
      this.requestUpdate();
    }, Math.max(500, duration));
  }

  /** Trigger the transient ACK flash on the Drinks Log Drink button. */
  private _triggerDrinksAck(): void {
    const duration = this.config?.drink_button_ack_duration_ms ?? 3000;
    // Freeze the resolved button state for the ACK intro window — mirrors
    // _triggerDailyAck so the post-press state transition (e.g. idle to
    // lockout when the daily drink limit is hit) is hidden behind the overlay
    // once it's opaque.
    const entities = this._resolveEntities();
    this._drinksFrozenState = this._computeDrinksButtonState(entities);
    if (this._drinksFreezeTimer !== undefined) {
      window.clearTimeout(this._drinksFreezeTimer);
    }
    this._drinksFreezeTimer = window.setTimeout(() => {
      if (!this._connected) return; // N3: detached guard
      this._drinksFrozenState = null;
      this._drinksFreezeTimer = undefined;
      this.requestUpdate();
    }, ACK_INTRO_MS);

    // Rapid successive clicks: mirrors _triggerDailyAck. Each press while the
    // flash is active increments the counter ("Logged 2x", "Logged 3x" …) and
    // resets the fade timer; the first press initialises to 1 and arms the
    // flag. The timer clears both together on expiry.
    if (this._drinksAckActive) {
      this._drinksAckCount += 1;
    } else {
      this._drinksAckCount = 1;
      this._drinksAckActive = true;
    }
    if (this._drinksAckTimer !== undefined) {
      window.clearTimeout(this._drinksAckTimer);
    }
    this._drinksAckTimer = window.setTimeout(() => {
      if (!this._connected) return; // N3: detached guard
      this._drinksAckActive = false;
      this._drinksAckCount = 0;
      this._drinksAckTimer = undefined;
      this.requestUpdate();
    }, Math.max(500, duration));
  }

  /**
   * Cancel an in-flight Daily ACK (the "Logged" flash on the Take Pill
   * button). Called when the user navigates away from the Daily pane while
   * the flash is still playing. Pane navigation destroys the daily-panel DOM
   * (render is conditional on _activePane), so the CSS animation is gone —
   * but without this cancel, the surviving _dailyAckActive flag would remount
   * a fresh .ack-flash div on return and replay the animation from t=0. This
   * mirrors the cleanup the fade-timer callback and disconnectedCallback
   * already perform. No requestUpdate() here — _handlePaneChange's own
   * _activePane mutation already triggers the render that drops the panel.
   */
  private _cancelDailyAck(): void {
    if (this._dailyAckTimer !== undefined) {
      window.clearTimeout(this._dailyAckTimer);
      this._dailyAckTimer = undefined;
    }
    if (this._dailyFreezeTimer !== undefined) {
      window.clearTimeout(this._dailyFreezeTimer);
      this._dailyFreezeTimer = undefined;
    }
    this._dailyFrozenState = null;
    this._dailyAckActive = false;
    this._dailyAckCount = 0;
  }

  /**
   * Cancel an in-flight Drinks ACK (the "Logged" flash on the Log Drink
   * button). Mirrors _cancelDailyAck for the Drinks pane.
   */
  private _cancelDrinksAck(): void {
    if (this._drinksAckTimer !== undefined) {
      window.clearTimeout(this._drinksAckTimer);
      this._drinksAckTimer = undefined;
    }
    if (this._drinksFreezeTimer !== undefined) {
      window.clearTimeout(this._drinksFreezeTimer);
      this._drinksFreezeTimer = undefined;
    }
    this._drinksFrozenState = null;
    this._drinksAckActive = false;
    this._drinksAckCount = 0;
  }

  /**
   * Resolve the adherence grace period (on-time buffer) in hours. Powers the
   * Button State Matrix latency boundary (overdue warning at half grace).
   *
   * Resolution order (fixes the bug where the card silently fell back to a
   * hardcoded 1.0h when adherence tracking was off, ignoring the user's
   * configured value):
   *   1. The Overdue sensor's `grace_minutes` attribute — the Overdue sensor
   *      is created for every scheduled medication (independent of
   *      enable_adherence), so it is the reliable single source of truth.
   *      Convert minutes -> hours for the internal ButtonStateInput contract.
   *   2. The adherence sensors' `grace_hours` attribute (legacy path, when
   *      the Overdue sensor somehow lacks grace_minutes — defensive).
   *   3. The backend default 60 min (== 1.0h).
   */
  private _resolveGraceHours(entities: ResolvedEntities): number {
    // 1. Prefer the Overdue sensor's grace_minutes (always present for
    //    scheduled meds, regardless of whether adherence tracking is on).
    if (entities.overdue) {
      const gm = this._getAttr(entities.overdue, 'grace_minutes');
      if (typeof gm === 'number' && gm > 0) return gm / 60;
    }
    // 2. Fall back to adherence sensors' grace_hours (legacy).
    const candidates = [
      entities.adherence7Days,
      entities.adherence14Days,
      entities.adherence30Days,
      entities.adherence365Days,
    ];
    for (const eid of candidates) {
      if (!eid) continue;
      const gh = this._getAttr(eid, 'grace_hours');
      if (typeof gh === 'number' && gh > 0) return gh;
    }
    // 3. Final fallback (matches the backend default 60 min).
    return 1.0;
  }

  /**
   * Compute the resolved ButtonState for the Daily (Take Pill) button from the
   * current entities + the transient ACK flag. Pure read of hass state; the
   * panel receives the resulting state as a reactive prop.
   */
  private _computeDailyButtonState(entities: ResolvedEntities): ButtonState {
    // While the ACK intro freeze is active, return the captured pre-press
    // state so the underlying color doesn't transition until the overlay is
    // opaque. The freeze is released by the ACK_INTRO_MS timer armed in
    // _triggerDailyAck.
    if (this._dailyFrozenState !== null) {
      return this._dailyFrozenState;
    }
    // Lockout — always reads the REAL pillsSafeToTake sensor (never the
    // display-swapped entity) so the safety gate is decoupled from the box.
    const safeState = this._getState(entities.pillsSafeToTake);
    const safeCount = parseInt(safeState, 10);
    const isLockedOut = !isNaN(safeCount) && safeCount <= 0;

    // 24h Strength Limit — reads the binary sensor (on when the next dose
    // would push the 24h strength sum over the daily_limit, or the limit is
    // already exceeded). Distinct from the pill-count lockout (isLockedOut)
    // which reads pillsSafeToTake. Takes precedence after lockout but before
    // latency/execution in the state machine.
    let is24hLimitReached = false;
    if (entities.limit24hExceeded) {
      const limitState = this._getState(entities.limit24hExceeded);
      is24hLimitReached = limitState === 'on';
    }

    // Scheduled = tracking_type != as_needed. Defensive snake/title-case
    // normalization mirroring _handleTakePill.
    const tt = (this._getAttr(entities.nextDose, 'tracking_type') || '').toLowerCase();
    const isScheduled = tt !== 'as_needed' && tt !== 'as needed' && tt !== '';

    // Overdue seconds (0 when on-time / not yet due / as-needed).
    const overdueState = this._getState(entities.overdue);
    let overdueSeconds = 0;
    if (overdueState && overdueState !== 'unavailable' && overdueState !== 'unknown') {
      const s = parseFloat(overdueState);
      if (!isNaN(s) && s > 0) overdueSeconds = s;
    }

    // "Due now" = the next scheduled slot has arrived. Read the next_dose
    // sensor: a valid ISO timestamp <= now means the slot is here (freshly
    // due or overdue); a future timestamp means not yet due. The overdue
    // sensor alone can't distinguish these (it reads 0 in both cases), so
    // next_dose is the authoritative "has the slot arrived" signal.
    // Fail-open: when next_dose is unavailable/unknown/unparseable, treat as
    // due-now so a genuinely-due dose is never hidden behind idle.
    let isDueNow = true;
    const nextDoseState = this._getState(entities.nextDose);
    if (nextDoseState && nextDoseState !== 'unavailable' && nextDoseState !== 'unknown') {
      const next = new Date(nextDoseState);
      if (!isNaN(next.getTime())) {
        isDueNow = next.getTime() <= Date.now();
      }
    }

    const input: ButtonStateInput = {
      isLockedOut,
      is24hLimitReached,
      isScheduled,
      isDueNow,
      overdueSeconds,
      graceHours: this._resolveGraceHours(entities),
      ackActive: this._dailyAckActive,
    };
    return resolveButtonStateHelper(input);
  }

  /**
   * Compute the resolved ButtonState for the Drinks (Log Drink) button.
   * Drinks are PRN/as-needed with no schedule → execution/latency never active;
   * only lockout (daily limit reached) + idle + transient ack are possible.
   * Lockout reads the master daily-amount sensor's `remaining` attribute
   * (caffeine/alcohol daily limit); absent sensor/limit → never locks out.
   */
  private _computeDrinksButtonState(entities: ResolvedEntities): ButtonState {
    // While the ACK intro freeze is active, return the captured pre-press
    // state (mirrors _computeDailyButtonState).
    if (this._drinksFrozenState !== null) {
      return this._drinksFrozenState;
    }
    let isLockedOut = false;
    if (entities.amountLast24h) {
      const remaining = this._getAttr(entities.amountLast24h, 'remaining');
      if (typeof remaining === 'number' && remaining <= 0) {
        isLockedOut = true;
      } else if (typeof remaining === 'string') {
        const r = parseFloat(remaining);
        if (!isNaN(r) && r <= 0) isLockedOut = true;
      }
    }
    const input: ButtonStateInput = {
      isLockedOut,
      is24hLimitReached: false, // drinks have no 24h strength limit
      isScheduled: false, // drinks have no schedule
      isDueNow: false, // no schedule → unreachable in the resolver
      overdueSeconds: 0,
      graceHours: 1.0,
      ackActive: this._drinksAckActive,
    };
    return resolveButtonStateHelper(input);
  }

  private _undoDrink(undoButtonEntityId: string): void {
    if (!this.hass || !undoButtonEntityId) return;
    this.hass.callService('button', 'press', { entity_id: undoButtonEntityId });
  }

  private _resetDrink(resetButtonEntityId: string): void {
    if (!this.hass || !resetButtonEntityId) return;
    this.hass.callService('button', 'press', { entity_id: resetButtonEntityId });
  }

  // ── Tools Actions ──────────────────────────

  private _openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void {
    this._toolsDialog = { title, descriptor, onConfirm };
  }

  private _closeToolsDialog(): void {
    this._toolsDialog = null;
  }

  // Run a Tools panel action respecting the `confirm_tool_actions` config.
  // Default ON (negative-false check preserves existing configs without the
  // field): the shared tools confirmation dialog opens first. When the user
  // explicitly disables the toggle, the action fires immediately with no
  // popup. Centralizes the dialog-vs-direct decision in the container so the
  // Tools panel stays purely presentational.
  private _runToolAction(title: string, descriptor: string, onConfirm: () => void): void {
    if (this.config?.confirm_tool_actions !== false) {
      this._openToolsDialog(title, descriptor, onConfirm);
    } else {
      onConfirm();
    }
  }

  private _handleTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeTimeframe) return;
    this._activeTimeframe = timeframe;
  }

  // Convenience getter for the current HA language code (BCP47). Falls back
  // to 'en' when hass is not yet set (e.g. during initial render).
  private get _lang(): string {
    return this.hass?.language || 'en';
  }

  // ── CardController public accessors ─────────
  // Public read-only views of the container's private @state, exposed to the
  // presentational panel components via the CardController contract (see
  // src/types.ts). Panels read these props instead of touching the container's
  // private fields directly.
  public get lang(): string {
    return this._lang;
  }
  public get activeTimeframe(): string {
    return this._activeTimeframe;
  }
  public get activeBarTimeframe(): string {
    return this._activeBarTimeframe;
  }
  public get activeGraph(): number {
    return this._activeGraph;
  }
  public get amountHistory(): Array<{ timestamp: string; value: number }> {
    return this._amountHistory;
  }
  public get doseHistory(): Array<[string, number]> {
    return this._doseHistory;
  }
  public get activeEffectivenessTimeframe(): string {
    return this._activeEffectivenessTimeframe;
  }
  public get activeEffectivenessView(): 'avg' | 'individual' {
    return this._activeEffectivenessView;
  }
  public get effectivenessHistory(): Record<string, Array<{ timestamp: string; value: number }>> {
    return this._effectivenessHistory;
  }
  public get effectivenessVisible(): Set<string> {
    return this._effectivenessVisible;
  }

  // ── CardController thin action methods ───────
  // These were previously inlined as direct @state mutations inside pane
  // templates (e.g. @click=${() => this._showRefillDialog = true}). Now that
  // panes are presentational components, they call back through the controller
  // so the container owns the state mutation.
  public showRefillDialog(): void {
    this._showRefillDialog = true;
    this._refillAmount = '';
    this._refillTarget = null;
  }
  public showRefillDialogFor(addStockEntityId: string, drinkName: string): void {
    this._refillTarget = { addStockEntityId, drinkName };
    this._showRefillDialog = true;
    this._refillAmount = '';
  }
  public showDeviceInfo(): void {
    this._deviceInfoTarget = null;
    this._showDeviceInfo = true;
  }
  public showDeviceInfoFor(deviceId: string, name: string): void {
    this._deviceInfoTarget = { deviceId, name };
    this._showDeviceInfo = true;
  }
  public showColorExplainerDialog(): void {
    this._showColorExplainerDialog = true;
  }
  public showLogDrinkDialog(substance: 'caffeine' | 'alcohol'): void {
    this._logDrinkSubstance = substance;
    this._showLogDrinkDialog = true;
    this._fetchDrinkLowPredictions(substance);
  }

  // Fetch the predicted Low-band timestamp for every granular drink of the
  // substance, in parallel, via the backend predict_low REST endpoint. The
  // backend builds a throwaway what-if dose list (current master history +
  // this drink's dose_strength + drinking_duration) and forecasts the
  // post-dose peak + Low-band ETA — the real coordinator state is never
  // mutated, so closing the popup without pressing a drink has no effect.
  // Results are race-guarded by _predictLowToken so a stale substance switch
  // can't clobber the current dialog.
  private async _fetchDrinkLowPredictions(substance: 'caffeine' | 'alcohol'): Promise<void> {
    if (!this.hass) return;
    const drinks = this._getDrinksOfSubstance(substance);
    const token = ++this._predictLowToken;
    // Reset so a freshly-opened dialog shows "—" placeholders until the
    // predictions resolve, rather than the previous substance's values.
    this._drinkLowPredictions = {};
    await Promise.all(drinks.map(async (d) => {
      if (!d.logButtonEntityId) return;
      try {
        const data = await this.hass!.callApi<{ low_time: string | null }>(
          'GET',
          `ax_dose_logger/predict_low?entity_id=${encodeURIComponent(d.logButtonEntityId)}`,
        );
        if (token !== this._predictLowToken) return; // stale
        this._drinkLowPredictions = {
          ...this._drinkLowPredictions,
          [d.logButtonEntityId]: data?.low_time ?? null,
        };
      } catch (e) {
        console.warn('[ax-dose-logger-card] predict_low fetch failed for', d.logButtonEntityId, e);
      }
    }));
  }
  public showSleepDisruptionDialog(substance: 'caffeine' | 'alcohol'): void {
    this._sleepDisruptionSubstance = substance;
    this._showSleepDisruptionDialog = true;
  }
  public setActiveGraph(idx: number): void {
    this._activeGraph = idx;
  }

  // Keyboard activation helper for clickable <div> elements that use
  // role="button". Fires the handler on Enter or Space (standard button
  // behavior) so they're accessible to keyboard and screen-reader users.
  private _onKeyActivate(e: KeyboardEvent, handler: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  }

  // ── CardController public method aliases ────
  // The container keeps its private _-prefixed methods as the implementation
  // (the existing ~49 internal call sites stay untouched, keeping this step
  // low-risk). These public aliases expose them through the CardController
  // contract so the presentational panel components (added in later steps)
  // can call back into the container without touching its private surface.
  // Each alias is a one-line delegate; behavior is unchanged.
  public getState(entityId?: string): string { return this._getState(entityId); }
  public getAttr(entityId?: string, attr?: string): any { return this._getAttr(entityId, attr); }
  public getStrengthUnit(entities: ResolvedEntities): string { return this._getStrengthUnit(entities); }
  public getMedName(entities: ResolvedEntities): string { return this._getMedName(entities); }
  public getSafeBoxEntity(entities: ResolvedEntities): string | undefined { return this._getSafeBoxEntity(entities); }
  public getChipEntities(): ChipConfig[] { return this._getChipEntities(); }
  public handleChipAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void { this._handleChipAction(e as MouseEvent | null, kind, cfg, entity); }
  public formatInteger(value: string): string { return this._formatInteger(value); }
  public computeNextDose(entities: ResolvedEntities): string { return this._computeNextDose(entities); }
  public computeOverTime(entities: ResolvedEntities): string | null { return this._computeOverTime(entities); }
  public computeTimeSinceLastDose(entities: ResolvedEntities): string { return this._computeTimeSinceLastDose(entities); }
  /** Resolve the Daily (Take Pill) button state for the Button State Matrix.
   *  Delegates to the private resolver so the panel stays presentational. */
  public computeDailyButtonState(entities: ResolvedEntities): ButtonState { return this._computeDailyButtonState(entities); }
  /** Resolve the Drinks (Log Drink) button state for the Button State Matrix. */
  public computeDrinksButtonState(entities: ResolvedEntities): ButtonState { return this._computeDrinksButtonState(entities); }
  public bucketByDay(dayCount?: number): DayBucket[] { return this._bucketByDay(dayCount); }
  public daysSinceReveal(entities: ResolvedEntities): { hasDaysSensor: boolean; daysSince: number } { return this._daysSinceReveal(entities); }
  public getDrinksOfSubstance(substance: 'caffeine' | 'alcohol'): DrinkInfo[] { return this._getDrinksOfSubstance(substance); }
  /** M2M: enumerate all profiles as dropdown options. Returns
   *  [{ value: uuid, label: name }] sorted by name. Used by the visual editor
   *  + the multi-tracker header switcher. Delegates to the cached
   *  _getProfileNameMap. */
  public getProfileOptions(): Array<{ value: string; label: string }> {
    const map = this._getProfileNameMap();
    return Object.entries(map)
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
  public drinkDaysSinceReveal(avg365EntityId?: string): { hasDaysSensor: boolean; daysSince: number } { return this._drinkDaysSinceReveal(avg365EntityId); }
  public logDrink(logButtonEntityId: string, targetProfile?: string): void { this._logDrink(logButtonEntityId, targetProfile); }
  public undoDrink(undoButtonEntityId: string): void { this._undoDrink(undoButtonEntityId); }
  public resetDrink(resetButtonEntityId: string): void { this._resetDrink(resetButtonEntityId); }
  public handleTakePill(entities: ResolvedEntities): void { this._handleTakePill(entities); }
  public handleUndoDose(entities: ResolvedEntities): void { this._handleUndoDose(entities); }
  public handleRefill(entities: ResolvedEntities): void { this._handleRefill(entities); }
  public openToolsDialog(title: string, descriptor: string, onConfirm: () => void): void { this._openToolsDialog(title, descriptor, onConfirm); }
  public runToolAction(title: string, descriptor: string, onConfirm: () => void): void { this._runToolAction(title, descriptor, onConfirm); }
  public openMoreInfo(entityId: string): void { this._openMoreInfo(entityId); }
  public handleSafeBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void { this._handleSafeBoxAction(e as MouseEvent | null, kind, cfg, entity); }
  public getPillsLeftBoxEntity(entities: ResolvedEntities): string | undefined { return this._getPillsLeftBoxEntity(entities); }
  public handlePillsLeftBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
    fallback?: () => void,
  ): void { this._handlePillsLeftBoxAction(e as MouseEvent | null, kind, cfg, entity, fallback); }
  // ── Drinks panel public wrappers ──
  public getInBodyBoxEntity(entities: ResolvedEntities): string | undefined { return this._getInBodyBoxEntity(entities); }
  public handleInBodyBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void { this._handleInBodyBoxAction(e as MouseEvent | null, kind, cfg, entity); }
  public getDisruptionBoxEntity(entities: ResolvedEntities): string | undefined { return this._getDisruptionBoxEntity(entities); }
  public handleDisruptionBoxAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
    fallback?: () => void,
  ): void { this._handleDisruptionBoxAction(e as MouseEvent | null, kind, cfg, entity, fallback); }
  public getDrinkChipEntities(): ChipConfig[] { return this._getDrinkChipEntities(); }
  public handleDrinkChipAction(
    e: Event | null,
    kind: 'tap' | 'hold' | 'double_tap',
    cfg: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    entity?: string,
  ): void { this._handleDrinkChipAction(e as MouseEvent | null, kind, cfg, entity); }
  public handleTimeframeChange(timeframe: string): void { this._handleTimeframeChange(timeframe); }
  public handleBarTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeBarTimeframe) return;
    this._activeBarTimeframe = timeframe;
  }
  public handleEffectivenessTimeframeChange(timeframe: string): void {
    if (timeframe === this._activeEffectivenessTimeframe) return;
    this._activeEffectivenessTimeframe = timeframe;
  }
  public setEffectivenessView(view: 'avg' | 'individual'): void {
    if (view === this._activeEffectivenessView) return;
    this._activeEffectivenessView = view;
  }
  public toggleEffectivenessMetric(metricKey: string): void {
    // Mutate a fresh Set so Lit detects the reference change (a Set mutation
    // in place would not trigger re-render since @state compares references).
    const next = new Set(this._effectivenessVisible);
    if (next.has(metricKey)) next.delete(metricKey);
    else next.add(metricKey);
    this._effectivenessVisible = next;
  }
  public handleTrackingChange(metric: MetricEntity, rawValue: string): void { this._handleTrackingChange(metric, rawValue); }
  public onKeyActivate(e: KeyboardEvent, handler: () => void): void { this._onKeyActivate(e, handler); }
  public onStatCellKeydown(e: KeyboardEvent, entityId: string): void { this._onStatCellKeydown(e, entityId); }
  public navigateToDevice(): void { this._navigateToDevice(); }

  // ── Pane Switching ─────────────────────────

  private _handlePaneChange(paneId: 'daily' | 'graphs' | 'stats' | 'drinks' | 'inventory' | 'tools' | 'tracking'): void {
    if (paneId === this._activePane) return; // Guard: skip redundant execution

    // If leaving the Daily / Drinks pane while a "Logged" ACK flash is still
    // playing, cancel it now. Pane navigation destroys the panel DOM (render
    // is conditional on _activePane), so the CSS animation is gone; without
    // this cancel, the surviving _dailyAckActive/_drinksAckActive flag would
    // remount a fresh .ack-flash div on return and replay the animation.
    // See plans/ack-navigate-away-replay-fix-plan.md.
    if (this._activePane === 'daily') this._cancelDailyAck();
    else if (this._activePane === 'drinks') this._cancelDrinksAck();

    this._activePane = paneId;

    // Default the graphs carousel to the Amount in Body line graph when the
    // user navigates to the graphs pane, provided the Amount in Body toggle is
    // on (show_amount_in_body !== false) and the device actually has a usable
    // amount-in-body state (entity exists + state is not 0/unknown/unavailable).
    // This mirrors the exact slide-gating the panel applies in render(), so the
    // default landing slide always points at a slide that will actually render.
    // Resetting on every graphs-pane entry keeps the Amount in Body graph the
    // default landing view even after the user carousels away and back; manual
    // prev/next navigation still works within a session (it is reset only on a
    // pane switch, not on a re-render).
    if (paneId === 'graphs' && this.config && this.hass) {
      const entities = this._resolveEntities();
      const amountState = this._getState(entities.amountInBody);
      const hasAmountInBody = !!entities.amountInBody &&
        amountState !== '0' &&
        amountState !== 'unknown' &&
        amountState !== 'unavailable';
      this._activeGraph = (this.config.show_amount_in_body !== false && hasAmountInBody) ? 1 : 0;
    }

    // Tell HA's layout engine to re-measure the card height. card-resize is
    // non-destructive (unlike ll-rebuild, which tears down and recreates the
    // element) — the @state pane survives, so no sessionStorage persistence
    // or rebuild-flag coordination is needed (#16). Lit auto-renders on the
    // @state mutation above, so no manual requestUpdate() is needed (#17).
    this.updateComplete.then(() => {
      this.dispatchEvent(new CustomEvent('card-resize', { bubbles: true, composed: true }));
    });
  }

  // ── Device Info Dialog ─────────────────────

  private _navigateToDevice(deviceId?: string) {
    const target = deviceId ?? this.config?.device_id;
    if (!target) return;
    window.history.pushState(null, '', `/config/devices/device/${target}`);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  private _renderDeviceInfoDialog(entities: ResolvedEntities) {
    const targetName = this._deviceInfoTarget?.name ?? this._getMedName(entities);
    const targetDeviceId = this._deviceInfoTarget?.deviceId;
    const close = () => { this._showDeviceInfo = false; this._deviceInfoTarget = null; };
    return html`
      <ha-dialog
        open
        width="medium"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${targetName}</div>
        <div class="dialog-body dialog-body--center">
          <button class="dialog-btn" @click=${delayedAction(() => { this._navigateToDevice(targetDeviceId); close(); })}>
            <ha-ripple></ha-ripple>
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <span>${localize(this._lang, 'dialog.device_info.button')}</span>
          </button>
          ${this.config?.show_color_indicator_explainer !== false
            ? html`<button class="dialog-btn" aria-label=${localize(this._lang, 'dialog.device_info.color_indicators_aria')} @click=${delayedAction(() => { this.showColorExplainerDialog(); close(); })}>
                <ha-ripple></ha-ripple>
                <ha-icon icon="mdi:palette-outline"></ha-icon>
                <span>${localize(this._lang, 'dialog.device_info.color_indicators')}</span>
              </button>`
            : nothing}
        </div>
      </ha-dialog>
    `;
  }

  private _renderRefillDialog(entities: ResolvedEntities) {
    // Header shows the drink name when refilling a granular drink from the
    // Master Tracker Inventory panel; otherwise the generic refill title.
    const header = this._refillTarget
      ? localize(this._lang, 'dialog.refill.title_drink', { name: this._refillTarget.drinkName })
      : localize(this._lang, 'dialog.refill.title');
    const close = () => { this._showRefillDialog = false; this._refillAmount = ''; this._refillTarget = null; };
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${header}</div>
        <div class="dialog-body">
          <input
            type="number"
            class="refill-input"
            .value=${this._refillAmount}
            @input=${(e: InputEvent) => this._refillAmount = (e.target as HTMLInputElement).value}
            placeholder=${localize(this._lang, 'dialog.refill.placeholder')}
            min="1"
            step="1"
          />
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn" @click=${delayedAction(() => this._handleRefill(entities))}>
            <ha-ripple></ha-ripple>
            ${localize(this._lang, 'dialog.refill.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // Log Drink popup (Master Tracker Drinks panel). Phase 2 multi-tracker flow:
  //   1. Drink grid — tap a drink to log it. The active profile is the one-tap
  //      default for any drink the active profile is allowed to log. N=1 cards
  //      NEVER show a sub-list (one-tap, always the sole profile). A shared
  //      drink the active profile is NOT allowed to log (but another
  //      configured tracker is) switches to the profile sub-list (step 2).
  //   2. Profile sub-list — "Who is logging this?" — shows the configured
  //      trackers ∩ the drink's allowed_profiles (view scope = logging scope)
  //      as name buttons; tap one to log_drink with that profile's UUID. Back
  //      returns to the drink grid.
  // Logging calls _logDrink() which uses the ax_dose_logger.log_drink service
  // (not button.press — the stateless button raises for shared drinks).
  private _renderLogDrinkDialog() {
    const substance = this._logDrinkSubstance;
    if (!substance) return nothing;
    const drinks = this._getDrinksOfSubstance(substance);
    // Phase 2: the active tracker is the one-tap default for any drink the
    // active profile is allowed to log. N=1 cards never show a sub-list
    // (one-tap, always the sole profile). N>1 cards show a profile sub-list
    // for shared drinks, restricted to the card's configured trackers (view
    // scope = logging scope), NOT the drink's full allowed_profiles.
    const trackers = this._resolveTrackers();
    const activeProfileId = this._activeTracker()?.profileId ?? '';
    const singleTracker = trackers.length <= 1;
    const close = () => {
      this._showLogDrinkDialog = false;
      this._logDrinkSubstance = null;
      this._drinkLowPredictions = {};
      this._predictLowToken++; // invalidate any in-flight fetch
      this._logDrinkProfileTarget = null; // reset the profile sub-step
    };
    // Format the predicted Low-band wall-clock time as HH:MM (24-hour, no
    // date, no seconds) — matches the Stats panel's Low - Timestamp format.
    // "Low: —" when the prediction is null (the drink would not lift body-mass
    // above the Low band, so there is no predicted descent — a "safe" signal).
    // While the fetch is in flight (no key yet), show "Low: …" as a loading
    // placeholder so the user knows a prediction is coming.
    const formatLow = (entityId: string | undefined): string => {
      if (!entityId) return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
      const iso = this._drinkLowPredictions[entityId];
      if (iso === undefined) {
        return `${localize(this._lang, 'dialog.log_drink.predicted_low')}: …`;
      }
      if (iso === null) {
        return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
      }
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) {
        return localize(this._lang, 'dialog.log_drink.predicted_low_dash');
      }
      const hhmm = dt.toLocaleTimeString(
        this._lang,
        { hour: '2-digit', minute: '2-digit', hour12: false },
      );
      return `${localize(this._lang, 'dialog.log_drink.predicted_low')}: ${hhmm}`;
    };

    // ── Step 2: profile sub-list for a shared drink ──
    // Rendered when _logDrinkProfileTarget is set (the user tapped a shared
    // drink). Shows the configured trackers (view scope = logging scope) as
    // name buttons + a Back button to return to the drink grid. The sub-list is
    // restricted to _resolvedTrackers, NOT the drink's full allowed_profiles —
    // a profile not on this card cannot be logged from this card. The active
    // profile is NOT specially marked (it's just one option in the list); the
    // user explicitly chose to log for a different profile by reaching step 2.
    const target = this._logDrinkProfileTarget;
    if (target) {
      // Intersect the drink's allowed_profiles with the card's configured
      // tracker profile IDs (logging scope = view scope). Falls back to the
      // drink's allowed_profiles when not in multi-tracker mode (single-device
      // cards still support the legacy picker for shared drinks).
      const allowedSet = new Set(target.allowedProfiles);
      const subListProfiles = singleTracker
        ? target.allowedProfiles
        : trackers
            .map(t => t.profileId)
            .filter(pid => allowedSet.has(pid));
      const substanceIcon = substance === 'caffeine' ? 'mdi:coffee' : 'mdi:glass-wine';
      return html`
        <ha-dialog
          open
          width="small"
          @closed=${close}
        >
          <div slot="header" class="dialog-header">${target.drinkName}</div>
          <div class="dialog-body">
            <div class="tools-dialog-descriptor">${localize(this._lang, 'dialog.log_drink.select_profile')}</div>
            <div class="log-drink-grid">
              ${subListProfiles.map((pid) => html`
                <button
                  class="dialog-btn log-drink-btn"
                  @click=${delayedAction(() => this._logDrink(target.logButtonEntityId, pid))}
                >
                  <ha-ripple></ha-ripple>
                  <ha-icon icon="mdi:account"></ha-icon>
                  <span class="log-drink-name">${this._profileDisplayName(pid)}</span>
                </button>
              `)}
            </div>
          </div>
          <div class="custom-action-bar">
            <button class="dialog-btn dialog-btn--muted" @click=${() => { this._logDrinkProfileTarget = null; }}>
              ${localize(this._lang, 'dialog.log_drink.back')}
            </button>
            <button class="dialog-btn dialog-btn--muted" @click=${close}>
              ${localize(this._lang, 'dialog.cancel')}
            </button>
          </div>
        </ha-dialog>
      `;
    }

    // ── Step 1: drink grid ──
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">${localize(this._lang, 'dialog.log_drink.title')}</div>
        <div class="dialog-body">
          ${drinks.length === 0
            ? html`<div class="tools-dialog-descriptor">${localize(this._lang, 'dialog.log_drink.empty')}</div>`
            : html`<div class="log-drink-grid">
                ${drinks.map((d) => {
                  // Decide single-tap vs. profile-picker (Phase 2):
                  //   - N=1 (single tracker or single-device) → NEVER show a
                  //     sub-list. One-tap log to the sole/active profile.
                  //   - The active profile is in the drink's allowed_profiles
                  //     → one-tap log to the active profile (the common case).
                  //   - Otherwise (a shared drink the active profile is NOT
                  //     allowed to log, but another configured tracker is) →
                  //     switch to the profile sub-list (step 2), restricted to
                  //     _resolvedTrackers ∩ the drink's allowed_profiles.
                  //   - allowedProfiles length ≤ 1 → one-tap (backend
                  //     convenience default / inventory only for zero-profile).
                  const ap = d.allowedProfiles ?? [];
                  const activeCanLog = activeProfileId !== '' && ap.includes(activeProfileId);
                  const isShared = !singleTracker && ap.length >= 2 && !activeCanLog;
                  return html`
                    <button
                      class="dialog-btn log-drink-btn"
                      ?disabled=${!d.logButtonEntityId}
                      @click=${delayedAction(() => {
                        if (!d.logButtonEntityId) return;
                        if (isShared) {
                          // Show the profile sub-list for this shared drink.
                          this._logDrinkProfileTarget = {
                            drinkName: d.name,
                            logButtonEntityId: d.logButtonEntityId,
                            allowedProfiles: d.allowedProfiles!,
                          };
                        } else {
                          // One-tap log: active profile (multi-tracker) or
                          // backend default (single/zero-profile). The active
                          // profile is applied inside _logDrink when no explicit
                          // targetProfile is passed.
                          this._logDrink(d.logButtonEntityId);
                        }
                      })}
                    >
                      <ha-ripple ?disabled=${!d.logButtonEntityId}></ha-ripple>
                      <ha-icon icon=${substance === 'caffeine' ? 'mdi:coffee' : 'mdi:glass-wine'}></ha-icon>
                      <span class="log-drink-name">${d.name}</span>
                      <span class="log-drink-low">${formatLow(d.logButtonEntityId)}</span>
                    </button>
                  `;
                })}
              </div>`}
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${close}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // Pill-limit override warning dialog (#6). Rendered when _overrideDialog is
  // non-null (set by _handleTakePill when the safe-to-take count is <= 0).
  // Confirm presses the take-button; Cancel/ESC just closes.
  private _renderOverrideDialog() {
    const dlg = this._overrideDialog;
    if (!dlg) return nothing;
    const extras = this._overrideDialogExtras;
    // Build the placeholder map: always includes `time` (used by the
    // pill-count lockout dialog). For 24h limit dialogs, also includes
    // current/limit/next/projected/unit so the body text can show the
    // specific numbers (e.g. "600 / 700 mg — next dose 200 mg → 800 mg").
    const placeholders: Record<string, string> = { time: dlg.timeLabel };
    if (extras) {
      placeholders.current = extras.current;
      placeholders.limit = extras.limit;
      placeholders.next = extras.next;
      placeholders.projected = extras.projected;
      placeholders.unit = extras.unit;
    }
    const closeDialog = () => { this._overrideDialog = null; this._overrideDialogExtras = null; };
    return html`
      <ha-dialog
        open
        width="small"
        @closed=${closeDialog}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, dlg.bodyKey, placeholders)}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${closeDialog}>
            ${localize(this._lang, 'dialog.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${delayedAction(() => {
                    if (this.hass && dlg.entities.takeButton) {
                      this.hass.callService('button', 'press', {
                        entity_id: dlg.entities.takeButton,
                      });
                      // Limit-reached override confirm also counts as a
                      // successful dose log → trigger the ACK flash.
                      this._triggerDailyAck();
                    }
                    closeDialog();
                  })}>
            <ha-ripple></ha-ripple>
            ${localize(this._lang, 'dialog.override.confirm')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // ── Pane 1: Daily ──────────────────────────

  private _getMedName(entities: ResolvedEntities): string {
    let name = this.config?.name || entities.medicationName;
    const strengthState = this._getState(entities.strength);
    const strengthNum = parseFloat(strengthState);
    if (entities.strength && !isNaN(strengthNum) && strengthNum !== 0
        && strengthState !== 'unknown' && strengthState !== 'unavailable') {
      name += ` - ${this._formatInteger(strengthState)} ${this._getStrengthUnit(entities)}`;
    }
    return name;
  }

  // Resolve the entity to display in the top (Safe to Take / Amount in Body)
  // box. Priority (mirrors _getPillsLeftBoxEntity — built-in mode-swap wins
  // over an arbitrary entity swap so the two overrides are mutually
  // unambiguous):
  //   1. safe_to_take_show_amount_in_body === true → amountInBody sensor
  //      (the toggle is a first-class built-in swap; wins over a configured
  //      safe_to_take_entity). Falls back to pillsSafeToTake when amountInBody
  //      is structurally absent (e.g. a device without a PK model) so the box
  //      is never empty — distinct from a state-quality dynamic default, which
  //      we reject (the panel's displayIsUnknown branch shows N/A when the
  //      sensor exists but reads unknown, which is expected for an opt-in).
  //   2. safe_to_take_entity configured → the user's chosen entity.
  //   3. default → the auto-resolved pills_safe_to_take sensor.
  // The Take Pill button's LIMIT REACHED logic is decoupled and always uses
  // the real pillsSafeToTake sensor (see isLimitReached in daily-panel.ts),
  // so swapping the box display is purely cosmetic.
  private _getSafeBoxEntity(entities: ResolvedEntities): string | undefined {
    if (this.config?.safe_to_take_show_amount_in_body === true) {
      return entities.amountInBody || entities.pillsSafeToTake;
    }
    return this.config?.safe_to_take_entity || entities.pillsSafeToTake;
  }

  // Fire the configured tap/hold/double-tap action for the Safe to Take box.
  // When the requested action has a user-configured ActionConfig, delegate to
  // custom-card-helpers' handleAction (standard HA action dispatch). When no
  // tap_action is configured, fall back to more-info on the display entity
  // (v1 default behavior). hold/double_tap with no config are no-ops.
  private _handleSafeBoxAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    displayEntity: string | undefined,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && displayEntity) {
      // No custom tap action → default to more-info (backward compat).
      this._openMoreInfo(displayEntity);
    }
    // hold/double_tap with no config and no fallback → no-op.
  }

  // ── Custom chips (Daily panel) ─────────────────────────

  // Fire the configured tap/hold/double-tap action for a Daily-panel custom
  // chip.  Mirrors _handleSafeBoxAction: custom ActionConfig → handleAction;
  // no tap config → more-info on the chip entity (user-confirmed default, same
  // as the Safe to Take box).  hold/double_tap with no config are no-ops.
  // Separate method (not a refactor of _handleSafeBoxAction) to avoid any
  // regression risk on the working Safe to Take path.
  private _handleChipAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    chipEntity: string | undefined,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && chipEntity) {
      // No custom tap action → default to more-info on the chip entity.
      this._openMoreInfo(chipEntity);
    }
    // hold/double_tap with no config → no-op.
  }

  // Resolve the entity to display in the Pills Left box. Priority:
  //   1. pills_left_show_days_left === true → backend days_left sensor
  //      (the toggle is a first-class built-in swap; wins over a configured
  //      pills_left_entity so the two overrides are mutually unambiguous).
  //   2. pills_left_entity configured (and differs from the default sensor) →
  //      the user's chosen entity (arbitrary HA entity).
  //   3. default → the auto-resolved pills_left number entity.
  // Unlike the Safe to Take box, no safety-critical logic reads the real
  // pills_left entity (the Stats "Pills Left" row was removed in the
  // de-duplication pass; the Refill dialog reads entities.addRefill, a
  // separate entity), so swapping is purely cosmetic.
  private _getPillsLeftBoxEntity(entities: ResolvedEntities): string | undefined {
    if (this.config?.pills_left_show_days_left === true) return entities.daysLeft;
    return this.config?.pills_left_entity || entities.pillsLeft;
  }

  // Fire the configured tap/hold/double-tap action for the Pills Left box.
  // When the requested action has a user-configured ActionConfig, delegate to
  // handleAction (standard HA action dispatch). When no tap_action is
  // configured, run the fallback (the Refill dialog for the default/days-left/
  // swapped modes — retained across all display modes because "Refill dialog"
  // can't be expressed in the ui_action dropdown); if no fallback applies, fall
  // back to more-info on the display entity. hold/double_tap with no config are
  // no-ops.
  private _handlePillsLeftBoxAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    displayEntity: string | undefined,
    fallback?: () => void,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && fallback) {
      // No custom tap action → card-internal fallback (Refill dialog).
      fallback();
    } else if (action === 'tap' && displayEntity) {
      this._openMoreInfo(displayEntity);
    }
    // hold/double_tap with no config and no fallback → no-op.
  }

  // ── Drinks panel In Body box ─────────────────────────

  // Resolve the entity to display in the Drinks panel In Body box. Mirrors
  // _getSafeBoxEntity: the configured in_body_entity wins; otherwise the
  // auto-resolved amountInBody sensor. No safety-critical logic reads the
  // In Body sensor (the Take Pill button's LIMIT REACHED logic is medicine-
  // only), so swapping is purely cosmetic.
  private _getInBodyBoxEntity(entities: ResolvedEntities): string | undefined {
    return this.config?.in_body_entity || entities.amountInBody;
  }

  // Fire the configured tap/hold/double-tap action for the In Body box.
  // Mirrors _handleSafeBoxAction: custom ActionConfig → handleAction; no tap
  // config → more-info on the display entity (the Drinks panel default).
  private _handleInBodyBoxAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    displayEntity: string | undefined,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && displayEntity) {
      this._openMoreInfo(displayEntity);
    }
    // hold/double_tap with no config and no fallback → no-op.
  }

  // ── Drinks panel Disruption box ─────────────────────────

  // Resolve the entity to display in the Drinks panel Disruption box.
  // Priority (mirrors _getPillsLeftBoxEntity — built-in mode swap wins over
  // an arbitrary entity swap so the two overrides are mutually unambiguous):
  //   1. disruption_mode === 'low_timestamp' → estimatedLowTime sensor
  //      (Low - Timestamp, HH:MM display).
  //   2. disruption_mode === 'low_hours_until' → lowHoursUntil sensor
  //      (Low - Hours Until, X h display).
  //   3. disruption_entity configured → the user's chosen entity.
  //   4. default (disruption / unset) → the auto-resolved sleepDisruption sensor.
  private _getDisruptionBoxEntity(entities: ResolvedEntities): string | undefined {
    if (this.config?.disruption_mode === 'low_timestamp') return entities.estimatedLowTime;
    if (this.config?.disruption_mode === 'low_hours_until') return entities.lowHoursUntil;
    return this.config?.disruption_entity || entities.sleepDisruption;
  }

  // Fire the configured tap/hold/double-tap action for the Disruption box.
  // Mirrors _handlePillsLeftBoxAction: custom ActionConfig → handleAction; no
  // tap config → the card-internal fallback (the Sleep Disruption popup when
  // mode='disruption' + substance exists; otherwise more-info on the display
  // entity, matching the Low-modes' default). hold/double_tap with no config
  // are no-ops.
  private _handleDisruptionBoxAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    displayEntity: string | undefined,
    fallback?: () => void,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && fallback) {
      fallback();
    } else if (action === 'tap' && displayEntity) {
      this._openMoreInfo(displayEntity);
    }
    // hold/double_tap with no config and no fallback → no-op.
  }

  // ── Drinks panel custom chips ─────────────────────────

  // Fire the configured tap/hold/double-tap action for a Drinks-panel custom
  // chip.  Mirrors _handleChipAction (which mirrors _handleSafeBoxAction):
  // custom ActionConfig → handleAction; no tap config → more-info on the chip
  // entity.  hold/double_tap with no config are no-ops.  Separate method (not
  // a refactor of _handleChipAction) to keep the two panels' action paths
  // independent (mirrors the _handleInBodyBoxAction / _handleDisruptionBoxAction
  // separation from _handleSafeBoxAction / _handlePillsLeftBoxAction).
  private _handleDrinkChipAction(
    _e: MouseEvent | null,
    action: 'tap' | 'hold' | 'double_tap',
    config: { entity?: string; tap_action?: ActionConfig; hold_action?: ActionConfig; double_tap_action?: ActionConfig },
    chipEntity: string | undefined,
  ): void {
    if (!this.hass) return;
    const actionKey = `${action}_action` as 'tap_action' | 'hold_action' | 'double_tap_action';
    const actionConfig = config[actionKey];
    if (actionConfig) {
      handleAction(this, this.hass, config, action);
    } else if (action === 'tap' && chipEntity) {
      // No custom tap action → default to more-info on the chip entity.
      this._openMoreInfo(chipEntity);
    }
    // hold/double_tap with no config → no-op.
  }


  // Enumerate configured Drinks-panel custom chips (drink_chip_1..4 + icon/
  // label + 3 ui_action overrides).  Parallel to _getChipEntities but reads
  // the drink_chip_* config namespace so the Daily and Drinks panels' chip
  // configs stay fully independent.
  private _getDrinkChipEntities(): ChipConfig[] {
    if (!this.config) return [];
    const chips: ChipConfig[] = [];
    for (const key of ['drink_chip_1', 'drink_chip_2', 'drink_chip_3', 'drink_chip_4'] as const) {
      const val = this.config[key];
      if (val) {
        const labelKey = `${key}_label` as keyof AxDoseLoggerCardConfig;
        const iconKey = `${key}_icon` as keyof AxDoseLoggerCardConfig;
        const showIconKey = `${key}_show_icon` as keyof AxDoseLoggerCardConfig;
        const tapKey = `${key}_tap_action` as keyof AxDoseLoggerCardConfig;
        const holdKey = `${key}_hold_action` as keyof AxDoseLoggerCardConfig;
        const dblKey = `${key}_double_tap_action` as keyof AxDoseLoggerCardConfig;
        chips.push({
          entityId: val,
          label: this.config[labelKey] as string | undefined,
          icon: this.config[iconKey] as string | undefined,
          showIcon: this.config[showIconKey] === true,
          tapAction: this.config[tapKey] as ActionConfig | undefined,
          holdAction: this.config[holdKey] as ActionConfig | undefined,
          doubleTapAction: this.config[dblKey] as ActionConfig | undefined,
        });
      }
    }
    return chips;
  }

  // ── Pane 2: Graphs ─────────────────────────

  private async _fetchAmountHistory(entities: ResolvedEntities) {
    if (!this.hass || !entities.amountInBody) return;

    const entityId = entities.amountInBody;
    const now = new Date();
    const startTime = new Date(now.getTime() - this._getTimeframeHours() * 60 * 60 * 1000).toISOString();
    const endTime = now.toISOString();

    // Race guard (#4): capture the token at entry; after `await`, discard the
    // result if a newer fetch (or disconnect) has bumped it. This ensures only
    // the latest timeframe/pane change's result is written to _amountHistory.
    const token = ++this._amountFetchToken;

    try {
      // Use HA's authenticated REST helper (#2) instead of raw fetch + manual
      // access-token extraction. Path is relative to /api/. minimal_response +
      // significant_changes_only (#19) shrink the payload by dropping attributes
      // and unchanged states the card never reads from history.
      const data = await this.hass.callApi(
        'GET',
        `history/period/${startTime}?filter_entity_id=${entityId}&end_time=${endTime}&minimal_response&significant_changes_only=1`
      );

      // Discard if a newer fetch started or the card was disconnected mid-flight.
      if (token !== this._amountFetchToken) return;

      // data is an array of arrays: [[{entity_id, state, last_changed, attributes}, ...]]
      if (data && data[0]) {
        const filteredData = data[0]
          .filter((entry: any) => entry.state && !isNaN(parseFloat(entry.state)))
          .map((entry: any) => ({
            timestamp: entry.last_changed,
            value: parseFloat(entry.state)
          }));

        // Decimation: cap SVG nodes at MAX_NODES to protect render performance
        const MAX_NODES = 800;
        const step = Math.ceil(filteredData.length / MAX_NODES);
        this._amountHistory = step > 1
          ? filteredData.filter((_: any, index: number) => index % step === 0)
          : filteredData;
      }
    } catch (e) {
      // callApi throws on non-2xx; log for debuggability without breaking UX.
      console.warn('[ax-dose-logger-card] amount history fetch failed:', e);
    }
  }

  private async _fetchDoseHistory(entities: ResolvedEntities) {
    if (!this.hass || !this.config?.device_id) return;

    const deviceId = this.config.device_id;
    // Same race guard as _fetchAmountHistory (both are triggered together on
    // pane entry; a new pane/timeframe change invalidates both via the token).
    const token = ++this._doseFetchToken;

    try {
      const data = await this.hass.callApi('GET', `ax_dose_logger/history/${deviceId}`);

      // Discard if a newer fetch started or the card was disconnected mid-flight.
      if (token !== this._doseFetchToken) return;

      // data is [[iso_timestamp, strength], ...]
      if (Array.isArray(data)) {
        this._doseHistory = data;
      }
    } catch (e) {
      // Custom endpoint may not be available on older backends; log for debug.
      console.warn('[ax-dose-logger-card] dose history fetch failed:', e);
    }
  }

  // Effectiveness history fetch — batched single call for ALL effectiveness
  // entities of the device (comma-separated filter_entity_id), split per
  // entity on the client. Effectiveness entities are daily-locked number
  // entities (state changes only when the user logs a value), so the recorder
  // is the source of multi-day history. unknown/unavailable states are
  // dropped so the graph renders gaps on unlogged days instead of zeros.
  // Mirrors _fetchAmountHistory's race-guard token + minimal_response +
  // significant_changes_only optimizations, but covers N entities per call.
  private async _fetchEffectivenessHistory(entities: ResolvedEntities) {
    if (!this.hass || !entities.metrics.length) return;

    const entityIds = entities.metrics.map((m) => m.entityId).join(',');
    const now = new Date();
    const days = this._activeEffectivenessTimeframe === '30d' ? 30
      : this._activeEffectivenessTimeframe === '60d' ? 60 : 14;
    const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    const endTime = now.toISOString();

    const token = ++this._effectivenessFetchToken;

    try {
      const data = await this.hass.callApi(
        'GET',
        `history/period/${startTime}?filter_entity_id=${entityIds}&end_time=${endTime}&minimal_response&significant_changes_only=1`,
      );

      if (token !== this._effectivenessFetchToken) return;

      // data is an array of arrays, one per requested entity (order matches
      // filter_entity_id order). Map each entity's history to its metricKey.
      const result: Record<string, Array<{ timestamp: string; value: number }>> = {};
      if (Array.isArray(data)) {
        entities.metrics.forEach((metric, idx) => {
          const series = data[idx];
          if (!Array.isArray(series)) return;
          result[metric.metricKey] = series
            .filter((entry: any) => entry.state && !isNaN(parseFloat(entry.state)))
            .map((entry: any) => ({
              timestamp: entry.last_changed,
              value: parseFloat(entry.state),
            }));
        });
      }
      this._effectivenessHistory = result;

      // Initialize the visible set to all metrics on first fetch (or when the
      // metric set changed since last fetch, e.g. a custom metric was added
      // in the options flow). We compare against the existing visible set so
      // a user's per-tracker toggles survive timeframe changes.
      const allKeys = entities.metrics.map((m) => m.metricKey);
      const knownKeys = allKeys.filter((k) => this._effectivenessVisible.has(k));
      if (knownKeys.length !== allKeys.length || knownKeys.length === 0) {
        this._effectivenessVisible = new Set(allKeys);
      }
    } catch (e) {
      console.warn('[ax-dose-logger-card] effectiveness history fetch failed:', e);
    }
  }

  // Shared progressive-reveal resolver for avg/adherence boxes and stats rows.
  // Days since first dose drives which windows are shown. When the entity is
  // absent (older backend), hasDaysSensor=false and daysSince=-1 so callers
  // fall back to showing all boxes/rows (no regression for existing installs).
  private _daysSinceReveal(entities: ResolvedEntities): { hasDaysSensor: boolean; daysSince: number } {
    const daysSinceRaw = this._getState(entities.daysSinceFirstDose);
    const hasDaysSensor = !!entities.daysSinceFirstDose && daysSinceRaw !== 'unavailable';
    const daysSince = hasDaysSensor ? (parseInt(daysSinceRaw) || 0) : -1;
    return { hasDaysSensor, daysSince };
  }

  // ── Pane 3: Stats ──────────────────────────

  // Open the native HA more-info dialog for an entity. Uses the canonical
  // `hass-more-info` event (same pattern as every stock Lovelace card via
  // custom-card-helpers' handleAction). fireEvent defaults to bubbles+composed,
  // which is what HA's more-info dialog listener expects.
  private _openMoreInfo(entityId: string): void {
    fireEvent(this, 'hass-more-info', { entityId });
  }

  // Keyboard activation for accessible stat cells (Enter / Space).
  private _onStatCellKeydown(e: KeyboardEvent, entityId: string): void {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      this._openMoreInfo(entityId);
    }
  }

  // ── Pane 4: Tools ──────────────────────────

  private _renderSleepDisruptionDialog() {
    const substance = this._sleepDisruptionSubstance;
    if (!substance) return nothing;
    const close = () => { this._showSleepDisruptionDialog = false; this._sleepDisruptionSubstance = null; };
    const mdKey = substance === 'alcohol'
      ? 'dialog.sleep_disruption.alcohol'
      : 'dialog.sleep_disruption.caffeine';

    // Live summary — show ALL three Sleep Disruption-family values at the
    // top of the dialog so the user can see them at a glance regardless of
    // which disruption_mode the box is in:
    //   1. Sleep Disruption (band: None/Low/Moderate/High)
    //   2. Low - Timestamp (HH:MM, 24-hour)
    //   3. Low - Hours Until (numeric, no unit suffix)
    // Mirrors the Log Drink popup pattern (reads resolved state at render
    // time; the card re-renders on every hass state change via shouldUpdate
    // + _relevantStateChanged, and the backend pushes on every
    // dose/undo/reset + 1-min decay tick, so the values stay fresh with no
    // extra fetch/polling).  Formatting mirrors the Stats panel rows.
    const entities = this._resolveEntities();
    const dash = localize(this._lang, 'dialog.sleep_disruption.not_applicable');
    let disruptionDisplay = dash;
    const rawDisruption = this._getState(entities.sleepDisruption);
    if (rawDisruption && rawDisruption !== 'unknown' && rawDisruption !== 'unavailable') {
      disruptionDisplay = rawDisruption.charAt(0).toUpperCase() + rawDisruption.slice(1);
    }
    let lowTimestampDisplay = dash;
    const rawLowTs = this._getState(entities.estimatedLowTime);
    if (rawLowTs && rawLowTs !== 'unknown' && rawLowTs !== 'unavailable' && rawLowTs !== 'None') {
      const dt = new Date(rawLowTs);
      if (!isNaN(dt.getTime())) {
        lowTimestampDisplay = dt.toLocaleTimeString(
          this._lang,
          { hour: '2-digit', minute: '2-digit', hour12: false },
        );
      }
    }
    let lowHoursDisplay = dash;
    const rawLowHours = this._getState(entities.lowHoursUntil);
    if (rawLowHours && rawLowHours !== 'unknown' && rawLowHours !== 'unavailable' && rawLowHours !== 'None') {
      const num = parseFloat(rawLowHours);
      if (!isNaN(num)) {
        lowHoursDisplay = String(num);
      }
    }

    return html`
      <ha-dialog
        open
        width="medium"
        @closed=${close}
      >
        <div slot="header" class="dialog-header">
          <ha-icon icon="mdi:sleep"></ha-icon>
          ${localize(this._lang, 'dialog.sleep_disruption.title')}
        </div>
        <div class="dialog-body">
          <div class="disruption-summary">
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.disruption_label')}</span>
              <span class="disruption-summary-value">${disruptionDisplay}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.low_timestamp_label')}</span>
              <span class="disruption-summary-value">${lowTimestampDisplay}</span>
            </div>
            <div class="disruption-summary-row">
              <span class="disruption-summary-label">${localize(this._lang, 'dialog.sleep_disruption.low_hours_until_label')}</span>
              <span class="disruption-summary-value">${lowHoursDisplay}</span>
            </div>
          </div>
          <ha-markdown .content=${localize(this._lang, mdKey)}></ha-markdown>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn" @click=${close}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${localize(this._lang, 'dialog.sleep_disruption.close')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
  }

 // Medical Color Indicators explainer popup. ha-dialog + ha-markdown, mirroring
 // the Sleep Disruption popup pattern. Reached via a button in the device-info
 // dialog (when show_color_indicator_explainer is not false). Content is the
 // indicator-color table + the Color Scheme interference note — the same facts
 // documented in the README "⚠️ Color Scheme and Indicator Conflicts"
 // subsection, surfaced in-card for discoverability.
 private _renderColorExplainerDialog() {
   const close = () => { this._showColorExplainerDialog = false; };
   return html`
     <ha-dialog
       open
       width="medium"
       @closed=${close}
     >
       <div slot="header" class="dialog-header">
         <ha-icon icon="mdi:palette-outline"></ha-icon>
         ${localize(this._lang, 'dialog.color_indicators.title')}
       </div>
       <div class="dialog-body">
         <ha-markdown .content=${localize(this._lang, 'dialog.color_indicators.explainer')}></ha-markdown>
       </div>
       <div class="custom-action-bar">
         <button class="dialog-btn" @click=${close}>
           <ha-icon icon="mdi:close"></ha-icon>
           <span>${localize(this._lang, 'dialog.color_indicators.close')}</span>
         </button>
       </div>
     </ha-dialog>
   `;
 }

 private _renderToolsDialog() {
    const dialog = this._toolsDialog;
    if (!dialog) return nothing;

    const onConfirm = () => {
      dialog.onConfirm();
      this._closeToolsDialog();
    };

    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => this._closeToolsDialog()}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'dialog.warning')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">${dialog.descriptor}</div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted" @click=${() => this._closeToolsDialog()}>
            <ha-icon icon="mdi:close"></ha-icon>
            <span>${localize(this._lang, 'dialog.cancel')}</span>
          </button>
          <button class="dialog-btn" @click=${delayedAction(onConfirm)}>
            <ha-ripple></ha-ripple>
            <ha-icon icon="mdi:check"></ha-icon>
            <span>${localize(this._lang, 'dialog.confirm')}</span>
          </button>
        </div>
      </ha-dialog>
    `;
  }


  // ── Pane 5: Metrics ──────────────────────────

  private _handleTrackingChange(metric: MetricEntity, rawValue: string): void {
    const newValue = parseFloat(rawValue);
    if (isNaN(newValue)) return;

    const state = this._getState(metric.entityId);
    const attrs = this._getAttr(metric.entityId, 'logged_today');
    const isLogged = attrs === true || attrs === 'True' || attrs === 'true'
      || this._pendingTracking.has(metric.entityId);

    if (isLogged) {
      // Already logged today (or pending) — show override dialog
      const oldValue = parseFloat(state);
      this._trackingOverrideDialog = {
        metricKey: metric.metricKey,
        metricLabel: metric.label,
        oldValue: isNaN(oldValue) ? 0 : oldValue,
        newValue,
        entityId: metric.entityId,
      };
    } else {
      // Not yet logged — set directly via the number entity
      // Track locally to prevent race condition before HA state propagates
      this._pendingTracking.add(metric.entityId);
      if (this.hass) {
        this.hass.callService('number', 'set_value', {
          entity_id: metric.entityId,
          value: newValue,
        });
      }
    }
  }

  private _renderTrackingOverrideDialog() {
    const dlg = this._trackingOverrideDialog;
    if (!dlg) return nothing;

    return html`
      <ha-dialog
        open
        width="small"
        @closed=${() => { this._trackingOverrideDialog = null; }}
      >
        <div slot="header" class="dialog-header dialog-header--warning">
          <ha-icon icon="mdi:alert"></ha-icon>
          ${localize(this._lang, 'tracking.already_set_title')}
        </div>
        <div class="dialog-body">
          <div class="tools-dialog-descriptor">
            ${localize(this._lang, 'tracking.already_set_body', {
              metric: localize(this._lang, 'tracking.today_label', { metric: dlg.metricLabel }),
              oldValue: String(dlg.oldValue),
              newValue: String(dlg.newValue),
            })}
          </div>
        </div>
        <div class="custom-action-bar">
          <button class="dialog-btn dialog-btn--muted"
                  @click=${() => { this._trackingOverrideDialog = null; }}>
            ${localize(this._lang, 'tracking.cancel')}
          </button>
          <button class="dialog-btn"
                  @click=${delayedAction(() => {
                    if (this.hass) {
                      this.hass.callService('ax_dose_logger', 'set_metric', {
                        entity_id: dlg.entityId,
                        value: dlg.newValue,
                        override: true,
                      });
                    }
                    this._trackingOverrideDialog = null;
                  })}>
            <ha-ripple></ha-ripple>
            ${localize(this._lang, 'tracking.override')}
          </button>
        </div>
      </ha-dialog>
    `;
  }

  // ── Pane Selector ──────────────────────────

  private _renderPaneSelector(entities: ResolvedEntities) {
    const hasMetrics = entities.metrics.length > 0;
    // Nav set branches by device type:
    //  - Master Tracker (drink_master): Drinks | Graph | Inventory | Stats | Tools
    //  - Medicine (default): Daily | Graphs | Stats | Tools (+ Tracking if metrics)
    // Granular drink devices render no nav bar (the redirect placeholder is
    // shown instead — see render()).
    type PaneId = 'daily' | 'graphs' | 'stats' | 'drinks' | 'inventory' | 'tools' | 'tracking';
    let panes: Array<{ id: PaneId; labelKey: string; icon: string }>;
    if (entities.deviceType === 'drink_master') {
      panes = [
        { id: 'drinks', labelKey: 'pane.drinks', icon: entities.substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee' },
        { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
        { id: 'inventory', labelKey: 'pane.inventory', icon: 'mdi:package-variant-closed' },
        { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
        { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
      ];
    } else {
      panes = [
        { id: 'daily', labelKey: 'pane.daily', icon: 'mdi:pill' },
        { id: 'graphs', labelKey: 'pane.graphs', icon: 'mdi:chart-bar' },
        { id: 'stats', labelKey: 'pane.stats', icon: 'mdi:clipboard-list' },
        ...(hasMetrics ? [{ id: 'tracking' as PaneId, labelKey: 'pane.tracking', icon: 'mdi:chart-sankey' }] : []),
        { id: 'tools', labelKey: 'pane.tools', icon: 'mdi:wrench' },
      ];
    }

    return html`
      <div class="pane-selector">
        ${panes.map(pane => {
          const label = localize(this._lang, pane.labelKey);
          const isTools = pane.id === 'tools';
          return html`
            <button
              class="pane-btn ${this._activePane === pane.id ? 'active' : ''} ${isTools ? 'tools' : ''}"
              aria-label=${label}
              @click=${() => this._handlePaneChange(pane.id)}
            >
              <ha-icon icon="${pane.icon}"></ha-icon>
              ${isTools ? nothing : html`<span>${label}</span>`}
            </button>
          `;
        })}
      </div>
    `;
  }

  // ── Pre-Render Auto-Fallback ───────────────

  /**
   * Lit calls willUpdate() BEFORE render(), so reactive property mutations
   * here are safe and reflected in the same render pass. This is the correct
   * place for the auto-fallback logic that was previously mutating
   * this._activePane inside render() — Lit's docs explicitly say "Do not
   * update reactive properties in render()."
   *
   * Auto-fallback rules:
   *  - tracking pane with no metrics → daily (metrics removed in options flow)
   *  - master-tracker pane on a medicine device → daily (device switched)
   *  - medicine pane on a master tracker → drinks (device switched)
   * Granular drink devices render a placeholder (handled in render() before
   * this logic matters) so they're skipped here.
   */
  protected willUpdate(changedProps: PropertyValues): void {
    if (!this.config || !this.hass) return;
    if (!(changedProps.has('_activePane') || changedProps.has('config') || changedProps.has('hass'))) return;
    const entities = this._resolveEntities();
    if (entities.deviceType === 'drink') return; // granular drink → placeholder, no fallback
    if (this._activePane === 'tracking' && entities.metrics.length === 0) {
      this._activePane = 'daily';
    }
    const isMaster = entities.deviceType === 'drink_master';
    const masterPanes = ['drinks', 'inventory'];
    const medicinePanes = ['daily', 'tracking'];
    if (isMaster && medicinePanes.includes(this._activePane)) this._activePane = 'drinks';
    if (!isMaster && masterPanes.includes(this._activePane)) this._activePane = 'daily';
  }

  // ── Main Render ────────────────────────────

  render() {
    if (!this.config || !this.hass) {
      return html`<ha-card><div class="card-content">${localize('en', 'card.loading')}</div></ha-card>`;
    }

    // ── Multi-tracker state machine (Phase 3) ──
    // When drink_tracker_devices is populated (or auto-discovery is active),
    // the card runs the state machine and ignores device_id. Validation
    // failures (non-master entity, mixed substance) render an error placeholder.
    // Zero-config multi-substance discovery renders a "please select" placeholder.
    // A multi-tracker card may legitimately have an empty device_id, so these
    // checks run BEFORE the device_id empty-check below.
    if (this._isMultiTrackerMode() || this._autoDiscoveryActive()) {
      const trackers = this._resolveTrackers();
      // Validation error (non-master entity or mixed substance).
      if (this._trackersError) {
        return this._renderTrackersError();
      }
      // Zero-config auto-discovery found multiple substances → placeholder.
      if (trackers.length === 0 && this._autoDiscoveryIsMultiSubstance()) {
        return this._renderTrackersPlaceholder();
      }
      // No master trackers found at all (zero-config, empty household).
      if (trackers.length === 0 && !this.config.device_id) {
        return this._renderTrackersPlaceholder();
      }
      // Trackers resolved → fall through to the main render (entities resolved
      // by _resolveEntities() return the active tracker's bundle). The header
      // profile switcher is rendered when N>1 (added to the main render below).
    }

    // Graceful fallback when the card is first added and no device is selected
    // (single-device mode). Multi-tracker mode bypassed this above.
    if (!this.config.device_id && !this._isMultiTrackerMode()) {
      return html`
        <ha-card>
          <div class="graph-placeholder" style="padding: 40px 16px; text-align: center;">
            <ha-icon icon="mdi:cog" style="--mdc-icon-size: 48px; opacity: 0.5; margin-bottom: 12px;"></ha-icon>
            <div style="font-size: 16px; font-weight: calc(500 * var(--pill-font-weight-boost, 1)); color: var(--primary-text-color);">${localize(this._lang, 'card.placeholder_title')}</div>
            <div style="font-size: 14px; color: var(--secondary-text-color);">${localize(this._lang, 'card.placeholder_subtitle')}</div>
          </div>
        </ha-card>
      `;
    }

    const entities = this._resolveEntities();

    // Granular drink device: render a single redirect placeholder pane and no
    // nav bar. The user must select the Master Tracker (Caffeine/Alcohol)
    // device to get the full Drinks card.
    if (entities.deviceType === 'drink') {
      const substanceLabel = entities.substance === 'alcohol'
        ? localize(this._lang, 'drinks.redirect_alcohol')
        : localize(this._lang, 'drinks.redirect_caffeine');
      return html`
        <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'}; --pill-font-weight-boost: ${this.config?.bold_text === true ? '1.5' : '1'};">
          <div class="card-content">
            <div class="caffeine-placeholder">
              <ha-icon icon=${entities.substance === 'alcohol' ? 'mdi:glass-wine' : 'mdi:coffee'}></ha-icon>
              <span>${substanceLabel}</span>
            </div>
          </div>
        </ha-card>
      `;
    }

    // Auto-fallback now handled in willUpdate() (mutating @state in render()
    // violates Lit's contract). The device-type / metrics guards there ensure
    // this._activePane always points at a valid pane for the current device
    // before render() runs.

    // Unified card title — shown at the top of .card-content on every pane
    // for both card types, so the title is consistent across all panels:
    //   - Drink Master (N>=1): [ Substance ]  -  [ ProfileName (chevron N>1) ]
    //     The substance button opens the device-info dialog; the profile button
    //     opens the profile-switcher popup when N>1, or the device-info dialog
    //     when N=1 (keeps the row visually consistent so single-user cards still
    //     show "Caffeine - Adam" rather than a bare substance label). The '-' is
    //     a non-interactive divider.
    //   - Medicine (default): a single centered button showing
    //     "MedName - Strength" (e.g. "Ritalin - 10 mg") that opens device-info.
    //     This supersedes the old per-Daily-pane .med-name div — the title now
    //     appears on Graphs, Stats, Tools, and Tracking too, matching the Drink
    //     Master card's consistent title across all panes.
    let cardTitle: TemplateResult | typeof nothing = nothing;
    if (entities.deviceType === 'drink_master') {
      const substanceLabel = entities.substance === 'alcohol'
        ? localize(this._lang, 'drinks.alcohol')
        : localize(this._lang, 'drinks.caffeine');
      const trackers = this._resolveTrackers();
      const profileName = this._activeTrackerName() || localize(this._lang, 'drinks.default_profile');
      const multi = trackers.length > 1;
      cardTitle = html`
        <div class="card-title-row">
          <button class="card-title-btn"
            role="button" tabindex="0"
            aria-label=${substanceLabel}
            @click=${delayedAction(() => this.showDeviceInfo())}
            @keydown=${(ev: KeyboardEvent) => this.onKeyActivate(ev, () => this.showDeviceInfo())}
          ><ha-ripple></ha-ripple>${substanceLabel}</button>
          <span class="card-title-divider" aria-hidden="true">-</span>
          <button class="card-title-btn${multi ? ' is-selector' : ''}"
            role="button" tabindex="0"
            aria-label=${profileName}
            @click=${delayedAction(() => multi
              ? (this._showProfileSwitcher = true)
              : this.showDeviceInfo())}
            @keydown=${(ev: KeyboardEvent) => this.onKeyActivate(ev, () => multi
              ? (this._showProfileSwitcher = true)
              : this.showDeviceInfo())}
          ><ha-ripple></ha-ripple><span class="card-title-name">${profileName}</span>${multi
            ? html`<ha-icon icon="mdi:chevron-down" class="card-title-chevron"></ha-icon>`
            : nothing}</button>
        </div>
      `;
    } else {
      // Medicine card — single centered title button (MedName - Strength).
      const medName = this._getMedName(entities);
      cardTitle = html`
        <div class="card-title-row">
          <button class="card-title-btn"
            role="button" tabindex="0"
            aria-label=${medName}
            @click=${delayedAction(() => this.showDeviceInfo())}
            @keydown=${(ev: KeyboardEvent) => this.onKeyActivate(ev, () => this.showDeviceInfo())}
          ><ha-ripple></ha-ripple>${medName}</button>
        </div>
      `;
    }
    return html`
      <ha-card style="${this._getColorOverrides()}; --pill-text-offset: ${this.config?.big_text === true ? '0px' : '-2px'}; --pill-font-weight-boost: ${this.config?.bold_text === true ? '1.5' : '1'};">
        <div class="card-content">
          ${cardTitle}
          ${this._activePane === 'daily' ? html`<ax-dose-daily-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDailyButtonState(entities)} .ackActive=${this._dailyAckActive} .ackCount=${this._dailyAckCount}></ax-dose-daily-panel>` : nothing}
          ${this._activePane === 'graphs' ? html`<ax-dose-graphs-panel .controller=${this} .entities=${entities} .hass=${this.hass} .amountHistory=${this._amountHistory} .doseHistory=${this._doseHistory} .activeGraph=${this._activeGraph} .activeTimeframe=${this._activeTimeframe} .activeBarTimeframe=${this._activeBarTimeframe} .activeEffectivenessTimeframe=${this._activeEffectivenessTimeframe} .activeEffectivenessView=${this._activeEffectivenessView} .effectivenessHistory=${this._effectivenessHistory} .effectivenessVisible=${this._effectivenessVisible}></ax-dose-graphs-panel>` : nothing}
          ${this._activePane === 'stats' ? html`<ax-dose-stats-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick}></ax-dose-stats-panel>` : nothing}
          ${this._activePane === 'drinks' ? html`<ax-dose-drinks-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick} .buttonState=${this._computeDrinksButtonState(entities)} .ackActive=${this._drinksAckActive} .ackCount=${this._drinksAckCount}></ax-dose-drinks-panel>` : nothing}
          ${this._activePane === 'inventory' ? html`<ax-dose-inventory-panel .controller=${this} .entities=${entities} .hass=${this.hass} .tick=${this._tick}></ax-dose-inventory-panel>` : nothing}
          ${this._activePane === 'tools' ? html`<ax-dose-tools-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tools-panel>` : nothing}
          ${this._activePane === 'tracking' ? html`<ax-dose-tracking-panel .controller=${this} .entities=${entities} .hass=${this.hass}></ax-dose-tracking-panel>` : nothing}
        </div>
        ${this.config?.hide_nav_bar !== true ? this._renderPaneSelector(entities) : nothing}
        ${this._showProfileSwitcher ? this._renderProfileSwitcher() : nothing}
        ${this._showDeviceInfo ? this._renderDeviceInfoDialog(entities) : nothing}
        ${this._showRefillDialog ? this._renderRefillDialog(entities) : nothing}
        ${this._showLogDrinkDialog ? this._renderLogDrinkDialog() : nothing}
        ${this._showSleepDisruptionDialog ? this._renderSleepDisruptionDialog() : nothing}
        ${this._showColorExplainerDialog ? this._renderColorExplainerDialog() : nothing}
        ${this._toolsDialog ? this._renderToolsDialog() : nothing}
        ${this._overrideDialog ? this._renderOverrideDialog() : nothing}
        ${this._trackingOverrideDialog ? this._renderTrackingOverrideDialog() : nothing}
      </ha-card>
    `;
  }

  // ── Lifecycle ──────────────────────────────

  connectedCallback(): void {
    super.connectedCallback();
    this._connected = true; // N3: guard timer callbacks from detached mutation
    // Reset to defaults on every connection. With ll-rebuild removed (#16),
    // the element is no longer destroyed/recreated on pane switch, so @state
    // survives naturally. The only time connectedCallback fires is on a
    // genuine view entry (navigate to the dashboard) or initial load — both
    // should start on the daily pane. Lit auto-renders on the @state
    // mutations below, so no manual requestUpdate() is needed (#17).
    // Apply configured default pane, validated against the 7 valid pane IDs.
    // Invalid/unset falls back to 'daily'. The render-time auto-fallback
    // (see render()) handles device-type mismatches (e.g. 'drinks' on a
    // medicine device bounces to 'daily'), so no extra validation here.
    const validPanes = ['daily', 'graphs', 'stats', 'drinks', 'inventory', 'tools', 'tracking'];
    const configuredView = this.config?.default_view;
    this._activePane = (configuredView && validPanes.includes(configuredView))
      ? (configuredView as 'daily' | 'graphs' | 'stats' | 'drinks' | 'inventory' | 'tools' | 'tracking')
      : 'daily';
    this._activeGraph = 0;
    // Apply configured default timescale for the Amount in Body graph,
    // falling back to '48h' if unset or invalid. Useful for medications
    // (e.g. caffeine, paracetamol) where a shorter window is more informative.
    const validTimeframes = ['12h', '24h', '48h', '7d', '14d', '30d'];
    const configuredTf = this.config?.amount_in_body_default_timeframe;
    this._activeTimeframe = (configuredTf && validTimeframes.includes(configuredTf)) ? configuredTf : '48h';
    this._activeBarTimeframe = '14d';
    this._activeEffectivenessTimeframe = '14d';
    this._activeEffectivenessView = 'avg';
    this._effectivenessHistory = {};
    this._effectivenessVisible = new Set();

    // Clear any dialog that was open when the card was disconnected. Lit
    // pauses reactive updates while an element is detached, so a dialog
    // flag set to false just before navigation may not have flushed its
    // DOM removal before disconnect — leaving ha-dialog's MDC overlay in
    // an "open" state that re-appears on back-navigation. Resetting here
    // guarantees a clean slate on every view entry and covers all four
    // dialogs (device-info, refill, tools, override).
    this._showDeviceInfo = false;
    this._deviceInfoTarget = null;
    this._showRefillDialog = false;
    this._refillAmount = '';
    this._refillTarget = null;
    this._showLogDrinkDialog = false;
    this._logDrinkSubstance = null;
    this._showSleepDisruptionDialog = false;
    this._sleepDisruptionSubstance = null;
    this._showColorExplainerDialog = false;
    this._toolsDialog = null;
    this._overrideDialog = null;
    this._overrideDialogExtras = null;
    // Clear pending tracking flags so stale entries from a prior session
    // (set_value calls that never got confirmed by HA before disconnect)
    // don't suppress the override dialog on the next tracking change.
    this._pendingTracking.clear();

    // Start a 30s tick so time-relative panes (daily/stats) refresh their
    // "Xh XXm" countdowns. Previously the whole card re-rendered on every
    // system-wide state change; with shouldUpdate gating, this timer keeps
    // the countdowns live without that cost.
    this._startTickTimer();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._connected = false; // N3: guard timer callbacks from detached mutation
    this._stopTickTimer();
    // Invalidate any in-flight fetch so it can't write state to a detached
    // element. Bumping the token makes every pending _fetchAmountHistory /
    // _fetchDoseHistory result discard itself after its `await` resolves.
    this._amountFetchToken++;
    this._doseFetchToken++;
    this._effectivenessFetchToken++;
    // Cancel any pending debounced graphs re-fetch so it doesn't fire after
    // the card is detached (the token bumps above would discard its result
    // anyway, but cancelling the timer avoids a needless detached fetch).
    if (this._graphsRefetchTimer !== null) {
      window.clearTimeout(this._graphsRefetchTimer);
      this._graphsRefetchTimer = null;
    }
    // Cancel any pending ACK intro state-freeze timers so they can't flip the
    // frozen state (and request a re-render) on a detached element.
    if (this._dailyFreezeTimer !== undefined) {
      window.clearTimeout(this._dailyFreezeTimer);
      this._dailyFreezeTimer = undefined;
    }
    if (this._drinksFreezeTimer !== undefined) {
      window.clearTimeout(this._drinksFreezeTimer);
      this._drinksFreezeTimer = undefined;
    }
    // Cancel any pending ACK fade timers so they can't flip the ACK flag (and
    // request a re-render) on a detached element. Hardening that falls out of
    // the rapid-click counter work — the ACK timers were previously left to
    // fire harmlessly on a detached element; now they are cancelled for
    // cleanliness alongside the freeze timers.
    if (this._dailyAckTimer !== undefined) {
      window.clearTimeout(this._dailyAckTimer);
      this._dailyAckTimer = undefined;
    }
    if (this._drinksAckTimer !== undefined) {
      window.clearTimeout(this._drinksAckTimer);
      this._drinksAckTimer = undefined;
    }
  }

  private _startTickTimer(): void {
    if (this._tickTimer !== null) return;
    this._tickTimer = window.setInterval(() => {
      this._tick += 1;
    }, 30000);
  }

  private _stopTickTimer(): void {
    if (this._tickTimer !== null) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  /**
   * Render gating (#1): only re-render when something this card actually
   * depends on changed, instead of on every system-wide HA state tick.
   *
   * - config / internal @state changes always re-render.
   * - _tick re-renders so the daily & stats panes' "Xh XXm" countdowns stay
   *   live (the underlying timestamp sensors don't change every minute).
   * - hass changes only re-render when one of this card's resolved entities
   *   (or a configured chip entity) has a new state object reference.
   */
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config || !this.hass) {
      return changedProps.has('config') || changedProps.has('hass');
    }
    // Any internal reactive state change (pane, timeframe, dialogs, history,
    // graph index) always triggers a render.
    for (const key of [
      'config',
      '_activePane',
      '_activeGraph',
      '_activeTimeframe',
      '_activeBarTimeframe',
      '_amountHistory',
      '_doseHistory',
      '_activeEffectivenessTimeframe',
      '_activeEffectivenessView',
      '_effectivenessHistory',
      '_effectivenessVisible',
      '_showDeviceInfo',
      '_deviceInfoTarget',
      '_showRefillDialog',
      '_refillAmount',
      '_refillTarget',
      '_showLogDrinkDialog',
      '_logDrinkSubstance',
      // Predict-Low popup: the fetch resolves asynchronously after the dialog
      // is open (showLogDrinkDialog already triggered the initial render). The
      // resolved predictions live in _drinkLowPredictions; without these in the
      // whitelist, shouldUpdate returns false on the async mutation and the
      // popup stays on "Low: …" until the next unrelated re-render (~20s).
      // (_predictLowToken is NOT here — it's a plain race-guard field, not
      // @state(), so it has no rendering impact and shouldn't trigger shouldUpdate.)
      '_drinkLowPredictions',
      '_showSleepDisruptionDialog',
      '_sleepDisruptionSubstance',
      '_showColorExplainerDialog',
      '_toolsDialog',
      '_overrideDialog',
      '_trackingOverrideDialog',
      // Profile switcher + multi-tracker state machine. Without these three
      // keys in the whitelist, shouldUpdate returns false on the @state
      // mutation (no hass change, no other whitelisted prop) and the dialog
      // open/close + profile selection is deferred until the next whitelisted
      // event (the 30s _tick timer), matching the reported ~40s delay.
      // _showProfileSwitcher gates the popup open/close; _activeTrackerIndex
      // gates the profile switch re-render; _logDrinkProfileTarget gates the
      // Log Drink popup profile sub-step.
      '_showProfileSwitcher',
      '_activeTrackerIndex',
      '_logDrinkProfileTarget',
      // ACK flash state — the fade-timer expiry sets _dailyAckActive = false
      // and _dailyAckCount = 0, then calls requestUpdate(). Without these in
      // the whitelist, shouldUpdate returns false (no hass change, no other
      // whitelisted prop), the .ack-flash div is never removed from the DOM,
      // and a rapid re-press with the same ackCount (1) reuses the stale
      // keyed() instance — the CSS animation does not restart and the flash
      // is invisible. Same for the drinks panel and the frozen-state cleanup.
      '_dailyAckActive',
      '_dailyAckCount',
      '_drinksAckActive',
      '_drinksAckCount',
      '_dailyFrozenState',
      '_drinksFrozenState',
    ] as const) {
      if (changedProps.has(key)) return true;
    }

    // The 30s tick refreshes time-relative panes (daily/stats). The graphs and
    // tools panes don't depend on wall-clock time, so skip the tick there to
    // avoid needless SVG re-renders.
    if (changedProps.has('_tick') && (this._activePane === 'daily' || this._activePane === 'stats' || this._activePane === 'drinks' || this._activePane === 'inventory')) {
      return true;
    }

    if (changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as AxDoseLoggerHass | undefined;
      return this._relevantStateChanged(oldHass);
    }
    return false;
  }

  /**
   * Compare the current hass state for every entity this card reads (resolved
   * medication entities + configured chip entities) against the previous hass
   * snapshot. Returns true if any of them changed (by state object reference,
   * which HA replaces on every state update).
   */
  private _relevantStateChanged(oldHass: AxDoseLoggerHass | undefined): boolean {
    if (!this.hass) return false;
    if (!oldHass) return true;
    const entities = this._resolveEntities();
    const watchedIds: string[] = [];
    for (const value of Object.values(entities)) {
      if (typeof value === 'string' && value) watchedIds.push(value);
    }
    // Include configured chip entities (they may belong to other devices).
    for (const chip of this._getChipEntities()) {
      if (chip.entityId) watchedIds.push(chip.entityId);
    }
    // Include configured Drinks-panel custom chips (parallel to the Daily
    // chips above; they may belong to other devices and only render on the
    // drinks pane, but keeping them always watched mirrors the Daily pattern).
    for (const chip of this._getDrinkChipEntities()) {
      if (chip.entityId) watchedIds.push(chip.entityId);
    }
    // The Inventory pane renders granular-drink entities (stock, add_stock,
    // avg sensors) that belong to different devices than the Master Tracker.
    // Those entities are NOT in the master's ResolvedEntities, so without
    // including them here a refill (which changes number.<drink>_inventory)
    // would not trigger a re-render until the 30s tick timer fires. Only
    // include them when the inventory pane is actually active to avoid
    // needless re-renders on other panes where these entities aren't shown.
    if (this._activePane === 'inventory' && entities.substance) {
      for (const d of this._getDrinksOfSubstance(entities.substance)) {
        if (d.stockEntityId) watchedIds.push(d.stockEntityId);
        if (d.addStockEntityId) watchedIds.push(d.addStockEntityId);
        if (d.avg7EntityId) watchedIds.push(d.avg7EntityId);
        if (d.avg365EntityId) watchedIds.push(d.avg365EntityId);
        if (d.daysLeftEntityId) watchedIds.push(d.daysLeftEntityId);
      }
    }
    const cur = this.hass.states;
    const prev = oldHass.states;
    for (const id of watchedIds) {
      const curState = cur[id];
      const prevState = prev[id];
      // A state object reference change means HA updated this entity.
      if (curState !== prevState) return true;
      // Also catch the entity disappearing/appearing between snapshots.
      if ((curState === undefined) !== (prevState === undefined)) return true;
    }
    return false;
  }

  updated(changedProperties: Map<string, any>) {
    super.updated(changedProperties);
    if (this._activePane === 'graphs' && this.config && this.hass) {
      const entities = this._resolveEntities();
      if (changedProperties.has('_activePane')) {
        this._fetchAmountHistory(entities);
        this._fetchDoseHistory(entities);
        if (entities.metrics.length) {
          this._effectivenessHistory = {};
          this._fetchEffectivenessHistory(entities);
        }
      } else if (changedProperties.has('_activeTimeframe')) {
        this._amountHistory = [];
        this._fetchAmountHistory(entities);
      } else if (changedProperties.has('_activeEffectivenessTimeframe')) {
        if (entities.metrics.length) {
          this._effectivenessHistory = {};
          this._fetchEffectivenessHistory(entities);
        }
      } else if (changedProperties.has('hass')) {
        // A relevant entity changed while the graphs pane is open (shouldUpdate
        // already gated on _relevantStateChanged, so a watched sensor — lastDose,
        // total, amountInBody, an effectiveness number — actually updated, not a
        // system-wide state tick). Re-fetch so the bar/line/effectiveness graphs
        // reflect a just-taken dose (or undo/reset) without requiring the user to
        // navigate away and back. Debounced so rapid successive state changes
        // (e.g. take-pill + immediate state propagation) coalesce into one fetch
        // instead of 3 fetches per change — 2 of which hit the recorder DB via
        // the history/period endpoint. The per-fetch race-guard tokens discard
        // stale results from superseded fetches. The dose-history fetch
        // (ax_dose_logger/history/ custom endpoint) is in-memory, but it's
        // bundled with the DB-backed fetches for simplicity.
        // Note: this branch does NOT fire on the _tick timer (shouldUpdate
        // excludes _tick for the graphs pane), so there is no periodic polling.
        if (this._graphsRefetchTimer !== null) {
          window.clearTimeout(this._graphsRefetchTimer);
        }
        this._graphsRefetchTimer = window.setTimeout(() => {
          this._graphsRefetchTimer = null;
          if (!this._connected) return; // N3: detached guard
          // Re-resolve entities inside the timeout in case the device changed
          // during the debounce window (unlikely but defense-in-depth).
          const e = this._resolveEntities();
          this._fetchDoseHistory(e);
          this._fetchAmountHistory(e);
          if (e.metrics.length) {
            this._fetchEffectivenessHistory(e);
          }
        }, AxDoseLoggerCard.GRAPHS_REFETCH_DEBOUNCE_MS);
      }
    }
    // Clean up _pendingTracking: once HA confirms logged_today=true for an
    // entity, remove it from the pending set so future changes use the real
    // attribute instead of the optimistic local flag.
    if (this.hass && this._pendingTracking.size > 0) {
      for (const entityId of this._pendingTracking) {
        const isLogged = this._getAttr(entityId, 'logged_today') === true;
        if (isLogged) this._pendingTracking.delete(entityId);
      }
    }
  }

  // ── Sizing ─────────────────────────────────

  getCardSize(): number {
    // Dynamic sizing based on active pane to prevent overlap
    switch (this._activePane) {
      case 'graphs': return 8;
      case 'stats': return 7;
      case 'tools': return 6;
      case 'tracking': return 6;
      case 'drinks': return 6;
      case 'inventory': return 8;
      default: return 5; // daily
    }
  }

  getGridOptions() {
    // HA sections-view grid options. Per HA docs, omitting `rows` lets the
    // card ignore grid row snapping (auto-height) — the documented way to
    // achieve what the previous undocumented `rows: 'auto'` attempted.
    // `min_rows: 4` ensures a reasonable minimum height (≈248px, matching
    // the smallest pane — daily at getCardSize() = 5 ≈ 250px). Static
    // options (not dynamic per-pane) avoid grid layout shifts on pane switch.
    return {
      columns: 12,
      min_rows: 4,
    };
  }

  // ── Editor Linkage ─────────────────────────

  static getConfigForm() {
    // The ~280-line schema + computeLabel/computeHelper callbacks live in the
    // editor module (src/ax-dose-logger-editor.ts) so the main card file stays
    // focused on runtime dashboard logic. HA renders <ha-form> from this schema.
    // Install the grid-alignment CSS observer here (only when the user opens
    // the visual editor), not in connectedCallback (which fired on every
    // dashboard load for every card instance and never disconnected the
    // observer → memory leak + needless document-wide DOM scanning). The
    // observer auto-cleans when the editor dialog closes.
    installEditorGridAlignment();
    return buildEditorForm();
  }

  static getStubConfig() {
    return {
      device_id: '',
      show_amount_in_body: true,
    };
  }

  // ── Styles ─────────────────────────────────

  static styles = css`
    :host {
      display: block;
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      /* ha-ripple defaults — Material Design radiating-circle press feedback
         on dialog action buttons (1:1 parity with Lovelace Mushroom cards). */
      --ha-ripple-color: var(--primary-color, #03a9f4);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
    }

    /* ── Unified Card Title ──
       Shown at the top of .card-content on every pane for both card types
       (Drink Master and Medicine), so the title is consistent across all
       panels. For Drink Master (N>=1): two invisible buttons (substance +
       profile) separated by a '-' divider, with a trailing chevron-down on
       the profile button when N>1. For Medicine: a single centered button
       showing "MedName - Strength". Typography: 20px, weight 600, with
       ha-ripple press feedback. Replaces the old card-header
       .profile-switcher-bar (N>1 only), the per-pane .drinks-title, and the
       per-Daily-pane .med-name div. */
    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: calc(20px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
      z-index: 1;  /* global z-axis protection — glow bleeds behind title */
    }
    .card-title-btn {
      position: relative;
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 12px);
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
    }
    .card-title-btn:hover {
      background: var(--secondary-background-color, rgba(0,0,0,0.04));
    }
    .card-title-divider {
      opacity: 0.5;
      user-select: none;
    }
    .card-title-name {
       /* profile name text — inherits title typography from the button */
     }
    .card-title-chevron {
      --mdc-icon-size: 18px;
      opacity: 0.6;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    ha-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .card-content {
      padding: 10px 16px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1 1 auto;
    }

    /* ── Pane Selector ─────────────────────── */

    .pane-selector {
      display: flex;
      border-top: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      /* Solidified opaque surface — the same alpha-channel transmission bug
         that affected .stat-pill/.chip applies here at the card-root level:
         .pane-selector is a sibling of .card-content (which contains the
         .glow-backdrop), and the 9px+8px glow diffusion bleeds past the
         bottom of .card-content into the nav bar's territory. With
         background:none the glow was visible THROUGH the transparent nav bar
         despite correct z-index:1 (z-index controls paint ORDER, opacity
         controls paint BLENDING). An opaque background-color matching the
         card bg fully occludes the backlight. See plans/
         gradient-stacking-material-synthesis-plan.md. */
      background-color: var(--card-background-color, var(--primary-background-color, #1c1c1c));
      position: relative;  /* global z-axis protection — glow bleeds behind nav bar (Patch 1, belt-and-suspenders) */
      z-index: 1;
    }

    .pane-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 8px;
      border: none;
      background: none;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-family: inherit;
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      cursor: pointer;
      transition: color 0.2s, background 0.2s, box-shadow 0.2s;
      border-bottom: 2px solid transparent;
    }

    .pane-btn.tools {
      flex: 0 0 auto;
      min-width: 44px;
      padding: 12px;
    }

    .pane-btn:hover {
      color: var(--primary-text-color, #222);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
    }

    .pane-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
    }

    .pane-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* ── Pane 3: Stats ──────────────────────── */

    /* ── Dialog content (ha-dialog provides scrim/surface/heading) ─── */

    .dialog-body {
      padding: 8px 0;
    }

    .dialog-body--center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    /* Device-info dialog: stacked buttons kept narrow (half-width) and
       centered, since they no longer share a row. Scoped to
       .dialog-body--center (used only by the device-info dialog) so the
       full-width .dialog-btn in other dialogs is unaffected. */
    .dialog-body--center .dialog-btn {
      width: 50%;
      box-sizing: border-box;
    }

    /* Sleep Disruption popup — live Disruption + ETA Low summary box
       above the band-description markdown.  Mirrors the card's
       primary-tinted surface (rgba primary 0.06) used by .stat-pill /
       .avg-cell so the summary reads as a card-native stat box. */
    .disruption-summary {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 10px 12px;
      margin-bottom: 12px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      border-radius: 10px;
    }

    .disruption-summary-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .disruption-summary-label {
      font-size: calc(13px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #727272);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .disruption-summary-value {
      font-size: calc(16px + var(--pill-text-offset, 0px));
      font-weight: calc(600 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
    }

    /* Dialog header (slot="header" for HA 2026.3+ Material 3 compatibility).
       Pre-2026.3 used the .heading property / slot="heading"; HA 2026.3
       renamed the slot to "header". Using the slot element works on both. */
    .dialog-header {
      font-size: 1.5rem;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      color: var(--primary-text-color, #222);
      text-align: center;
    }

    .dialog-header--warning {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--error-color, #db4437);
    }

    .dialog-header--warning ha-icon {
      --mdc-icon-size: 28px;
    }

    .dialog-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border: none;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color, #03a9f4);
      font-size: 16px;
      font-weight: calc(500 * var(--pill-font-weight-boost, 1));
      font-family: inherit;
      cursor: pointer;
      transition: background 0.2s;
      /* position:relative + overflow:hidden clip the ha-ripple surface to the
         button's rounded border (MdRipple geometry requirement). */
      position: relative;
      overflow: hidden;
    }

    .dialog-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
    }

    .dialog-btn ha-icon {
      --mdc-icon-size: 24px;
    }

    /* ── Log Drink popup (Master Tracker) ───── */

    .log-drink-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .log-drink-btn {
      flex-direction: column;
      gap: 6px;
      padding: 14px 8px;
      font-size: calc(14px + var(--pill-text-offset, 0px));
    }
    .log-drink-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .log-drink-name {
      font-weight: calc(550 * var(--pill-font-weight-boost, 1));
      text-align: center;
    }
    /* Predicted Low-band timestamp under each drink name ("Low: hh:mm" /
       "Low: —" while loading or when the drink would not lift body-mass
       above the Low band). Muted + smaller so the name stays primary. */
    .log-drink-low {
      font-size: calc(12px + var(--pill-text-offset, 0px));
      font-weight: calc(400 * var(--pill-font-weight-boost, 1));
      color: var(--secondary-text-color, rgba(0,0,0,0.5));
      text-align: center;
    }

    /* ── Refill Dialog ──────────────────────── */

    .refill-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--divider-color, rgba(0,0,0,0.1));
      border-radius: var(--ha-card-border-radius, 12px);
      font-size: 18px;
      font-family: inherit;
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
      box-sizing: border-box;
    }

    .refill-input:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }

    .dialog-btn--muted {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
      color: var(--secondary-text-color, #666);
    }

    .dialog-btn--muted:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
    }

    .tools-dialog-descriptor {
      font-size: calc(18px + var(--pill-text-offset, 0px));
      color: var(--primary-text-color, #222);
      line-height: 1.5;
      text-align: center;
    }

    /* Custom flexbox action bar replacing ha-dialog-footer. HA's native
       <ha-dialog-footer> forces right-aligned primaryAction/secondaryAction
       slots with hard-coded asymmetrical Shadow DOM padding that can't be
       cleanly overridden. This standard DOM flexbox centers the buttons as a
       pair, matching the card's original dialog layout. */
    .custom-action-bar {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 20px;
      width: 100%;
    }
  `;
}

// ──────────────────────────────────────────────
// Registrations
// ──────────────────────────────────────────────

customElements.define('ax-dose-logger-card', AxDoseLoggerCard);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'ax-dose-logger-card',
  name: 'AX Dose Logger Card',
  preview: true,
  description: 'A custom card for the AX Dose Logger integration — track medications, view dose graphs, and monitor statistics.',
  documentationURL: 'https://github.com/Axildor/AX-Dose-Logger-Card',
});