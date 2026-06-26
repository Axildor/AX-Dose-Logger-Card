// ──────────────────────────────────────────────
// AX Dose Logger Card — Graphs Pane (Pane 2)
// ──────────────────────────────────────────────
// Presentational component extracted from AxDoseLoggerCard._renderPane2 +
// _renderBarGraph + _renderLineGraph + _renderTimeframeChips +
// _renderBarTimeframeChips + _renderAveragesGrid. The largest template in the
// card. Reads amount/dose history + active timeframes from the controller
// props and calls back for timeframe changes + carousel navigation. The actual
// history fetching stays on the container (updated() lifecycle).

import { LitElement, html, svg, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CardController, ResolvedEntities, DayBucket, AxDoseLoggerHass } from '../types.js';
import { localize } from '../localize.js';
import { bridgeGaps } from '../helpers.js';

@customElement('ax-dose-graphs-panel')
export class AxDoseGraphsPanel extends LitElement {
  @property({ attribute: false }) controller!: CardController;
  @property({ attribute: false }) entities!: ResolvedEntities;
  // hass is passed down as a reactive prop so the panel re-renders on every
  // HA state update (HA replaces the top-level hass object reference on each
  // tick). Without this, the panel only re-rendered when its element was
  // remounted on a pane switch, so live changes (e.g. take-pill) did not
  // appear until the user navigated away and back.
  @property({ attribute: false }) hass?: AxDoseLoggerHass;

  // Graph-local state mirrored from the container as reactive props. The
  // graphs pane reads container @state (history fetch results, active
  // timeframe / carousel index) through these props instead of via
  // controller getters, because the controller object reference never
  // changes (it is the card itself) so getter reads would never trigger a
  // panel re-render. Binding them here lets timeframe-chip clicks, carousel
  // nav, and async history-fetch completion re-render the panel immediately.
  @property({ attribute: false }) amountHistory: Array<{ timestamp: string; value: number }> = [];
  @property({ attribute: false }) doseHistory: Array<[string, number]> = [];
  @property({ type: Number }) activeGraph: number = 0;
  @property({ attribute: false }) activeTimeframe: string = '48h';
  @property({ attribute: false }) activeBarTimeframe: string = '14d';

  private get _lang(): string {
    return this.controller.lang;
  }
  private get _config() {
    return this.controller.config;
  }

  // Timeframe helpers — read the controller's active timeframe state.
  private _getBarTimeframeDays(): number {
    switch (this.activeBarTimeframe) {
      case '30d': return 30;
      case '60d': return 60;
      default: return 14;
    }
  }

  private _getTimeframeHours(): number {
    switch (this.activeTimeframe) {
      case '12h': return 12;
      case '24h': return 24;
      case '7d': return 168;
      case '14d': return 336;
      case '30d': return 720;
      default: return 48;
    }
  }

  render() {
    const c = this.controller;
    const e = this.entities;
    const dailyBuckets = c.bucketByDay(this._getBarTimeframeDays());
    const hasAmountInBody = e.amountInBody &&
      c.getState(e.amountInBody) !== '0' &&
      c.getState(e.amountInBody) !== 'unknown' &&
      c.getState(e.amountInBody) !== 'unavailable';

    // Determine available slides
    const slides: Array<'bar' | 'line'> = ['bar'];
    if (hasAmountInBody && (this._config?.show_amount_in_body !== false)) {
      slides.push('line');
    }

    // Clamp active graph index
    const activeIdx = Math.min(this.activeGraph, slides.length - 1);
    const activeSlide = slides[activeIdx];

    return html`
      <div class="pane pane-graphs">
        ${slides.length > 1 ? html`
          <div class="carousel-nav">
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_prev')}
              @click=${() => c.setActiveGraph((activeIdx - 1 + slides.length) % slides.length)}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <span class="nav-title">
              ${activeSlide === 'bar' ? localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() }) : localize(this._lang, 'graphs.line_title')}
            </span>
            <button
              class="nav-btn"
              aria-label=${localize(this._lang, 'graphs.aria_next')}
              @click=${() => c.setActiveGraph((activeIdx + 1) % slides.length)}
              ?disabled=${slides.length <= 1}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        ` : html`
          <div class="carousel-nav">
            <span class="nav-title">${localize(this._lang, 'graphs.bar_title', { days: this._getBarTimeframeDays() })}</span>
          </div>
        `}

        <div class="graph-container">
          ${activeSlide === 'bar'
            ? this._renderBarGraph(dailyBuckets)
            : this._renderLineGraph(e)}
        </div>

        ${activeSlide === 'bar' ? this._renderAveragesGrid(e) : nothing}
      </div>
    `;
  }

  private _renderBarGraph(buckets: DayBucket[]) {
    const c = this.controller;
    const maxCount = Math.max(...buckets.map((b) => b.count), 1);
    const hasData = buckets.some((b) => b.count > 0);
    const dayCount = this._getBarTimeframeDays();

    if (!hasData) {
      return html`
        <div class="bar-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderBarTimeframeChips()}
          </div>
          <div class="graph-placeholder">
            <ha-icon icon="mdi:chart-bar"></ha-icon>
            <span>${localize(this._lang, 'graphs.empty_bar')}</span>
          </div>
        </div>
      `;
    }

    const w = 320;
    const h = 180;
    const padLeft = 32;
    const padRight = 8;
    const padTop = 16;
    const padBottom = 8;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;
    const barGap = 2;
    const barW = (chartW - barGap * (buckets.length - 1)) / buckets.length;

    // Label decimation: show every Nth label to keep 60-bar view readable
    let labelStep: number;
    if (dayCount <= 14) labelStep = 1;       // 14D: every day
    else if (dayCount <= 30) labelStep = 2;   // 30D: every 2 days
    else labelStep = 5;                        // 60D: every 5 days

    return html`
      <div class="bar-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderBarTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          ${[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padTop + chartH * (1 - fraction);
            return svg`
              <line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${Math.round(maxCount * fraction)}</text>
            `;
          })}

          ${buckets.map((bucket, i) => {
            const barH = Math.max((bucket.count / maxCount) * chartH, bucket.count > 0 ? 2 : 0);
            const x = padLeft + i * (barW + barGap);
            const y = padTop + chartH - barH;
            return svg`
              <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2"
                    fill="var(--primary-color)" opacity="0.85">
                <title>${bucket.label}: ${bucket.count} dose${bucket.count !== 1 ? 's' : ''}</title>
              </rect>
            `;
          })}

          <!-- Baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>
        </svg>
        <div class="bar-labels">
          ${buckets.map((bucket, i) => html`
            <span>${i % labelStep === 0 ? bucket.label : ''}</span>
          `)}
        </div>
      </div>
    `;
  }

  private _renderTimeframeChips() {
    const c = this.controller;
    const timeframes: Array<{ id: string; labelKey: string; ariaKey: string }> = [
      { id: '12h', labelKey: 'graphs.timeframe_12h', ariaKey: 'aria.timeframe_12h' },
      { id: '24h', labelKey: 'graphs.timeframe_24h', ariaKey: 'aria.timeframe_24h' },
      { id: '48h', labelKey: 'graphs.timeframe_48h', ariaKey: 'aria.timeframe_48h' },
      { id: '7d', labelKey: 'graphs.timeframe_7d', ariaKey: 'aria.timeframe_7d' },
      { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
      { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
    ];
    return timeframes.map((tf) => html`
      <button
        class="timeframe-chip ${this.activeTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => c.handleTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
  }

  private _renderBarTimeframeChips() {
    const c = this.controller;
    const timeframes: Array<{ id: string; labelKey: string; ariaKey: string }> = [
      { id: '14d', labelKey: 'graphs.timeframe_14d', ariaKey: 'aria.timeframe_14d' },
      { id: '30d', labelKey: 'graphs.timeframe_30d', ariaKey: 'aria.timeframe_30d' },
      { id: '60d', labelKey: 'graphs.timeframe_60d', ariaKey: 'aria.timeframe_60d' },
    ];
    return timeframes.map((tf) => html`
      <button
        class="timeframe-chip ${this.activeBarTimeframe === tf.id ? 'active' : ''}"
        aria-label=${localize(this._lang, tf.ariaKey)}
        @click=${() => c.handleBarTimeframeChange(tf.id)}
      >${localize(this._lang, tf.labelKey)}</button>
    `);
  }

  private _renderLineGraph(entities: ResolvedEntities) {
    const c = this.controller;
    const amountInBody = c.getState(entities.amountInBody);
    const rawHistory = this.amountHistory;

    const w = 320;
    const h = 180;
    const padLeft = 36;
    const padRight = 8;
    const padTop = 16;
    const padBottom = 28;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    if (rawHistory.length === 0) {
      return html`
        <div class="line-graph-wrapper">
          <div class="timeframe-chips">
            ${this._renderTimeframeChips()}
          </div>
          <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
            <text x="${w / 2}" y="${h / 2}" text-anchor="middle"
                  style="font-size: calc(13px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${localize(this._lang, 'graphs.loading_history')}</text>
          </svg>
        </div>
      `;
    }

    const now = new Date();
    const timeframeHours = this._getTimeframeHours();
    const startTime = new Date(now.getTime() - timeframeHours * 60 * 60 * 1000);

    // Bridge gaps in history so the polyline renders flat holds + vertical
    // steps instead of diagonal slopes across sparse recorder data.
    const bridgedHistory = bridgeGaps(rawHistory);

    // Find max value for Y-axis scaling
    const values = bridgedHistory.map((p) => p.value);
    const maxAmount = Math.max(...values, 1);

    // Build polyline points from gap-bridged history
    const polylinePoints = bridgedHistory.map((p) => {
      const fraction = Math.max(0, Math.min(1, (p.timestamp - startTime.getTime()) / (timeframeHours * 60 * 60 * 1000)));
      const x = padLeft + fraction * chartW;
      const y = padTop + chartH * (1 - p.value / maxAmount);
      return `${x},${y}`;
    }).join(' ');

    // Compute Y position for the current-amount dashed line
    const currentAmountNum = parseFloat(amountInBody);
    const currentY = (amountInBody && amountInBody !== 'unavailable' && !isNaN(currentAmountNum))
      ? Math.max(padTop, Math.min(padTop + chartH, padTop + chartH * (1 - currentAmountNum / maxAmount)))
      : padTop;
    const currentLabelY = Math.max(padTop + 8, currentY - 5);

    // Dynamic time indicators based on timeframe.
    // Tick marks (visual only) and text labels are built separately so they
    // can have different densities — e.g. 12H shows hourly tick marks but text
    // labels only every 2 hours for readability.
    const tickMarks: Array<{ x: number }> = [];
    const timeLabels: Array<{ label: string; x: number }> = [];
    const totalHours = this._getTimeframeHours();

    if (totalHours <= 12) {
      // 12H: tick marks every 1h, text labels every 2h
      for (let hh = 0; hh <= totalHours; hh += 1) {
        const fraction = hh / totalHours;
        tickMarks.push({ x: padLeft + fraction * chartW });
      }
      for (let hh = 0; hh <= totalHours; hh += 2) {
        const fraction = hh / totalHours;
        timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
      }
    } else if (totalHours <= 24) {
      // 24H: tick marks every 2h, text labels every 4h
      for (let hh = 0; hh <= totalHours; hh += 2) {
        const fraction = hh / totalHours;
        tickMarks.push({ x: padLeft + fraction * chartW });
      }
      for (let hh = 0; hh <= totalHours; hh += 4) {
        const fraction = hh / totalHours;
        timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
      }
    } else if (totalHours <= 48) {
      // 48H: tick marks every 3h, text labels every 6h
      for (let hh = 0; hh <= totalHours; hh += 3) {
        const fraction = hh / totalHours;
        tickMarks.push({ x: padLeft + fraction * chartW });
      }
      for (let hh = 0; hh <= totalHours; hh += 6) {
        const fraction = hh / totalHours;
        timeLabels.push({ label: `-${totalHours - hh}h`, x: padLeft + fraction * chartW });
      }
    } else {
      // 7D/14D/30D: tick marks and labels in days
      const totalDays = totalHours / 24;
      let labelStep: number;
      let tickStep: number;
      if (totalDays <= 7) { labelStep = 1; tickStep = 0.5; }       // 7D: ticks every 12h, labels every 1d
      else if (totalDays <= 14) { labelStep = 2; tickStep = 1; }   // 14D: ticks every 1d, labels every 2d
      else { labelStep = 5; tickStep = 2; }                        // 30D: ticks every 2d, labels every 5d

      for (let d = 0; d <= totalDays; d += tickStep) {
        const fraction = d / totalDays;
        tickMarks.push({ x: padLeft + fraction * chartW });
      }
      for (let d = 0; d <= totalDays; d += labelStep) {
        const fraction = d / totalDays;
        timeLabels.push({ label: `-${Math.round(totalDays - d)}d`, x: padLeft + fraction * chartW });
      }
    }

    return html`
      <div class="line-graph-wrapper">
        <div class="timeframe-chips">
          ${this._renderTimeframeChips()}
        </div>
        <svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="xMidYMid meet" style="aspect-ratio: 320/180">
          <!-- Y-axis grid lines and labels -->
          ${[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padTop + chartH * (1 - fraction);
            return svg`
              <line x1="${padLeft}" y1="${y}" x2="${w - padRight}" y2="${y}"
                    stroke="var(--divider-color)" stroke-width="0.5" opacity="0.5"/>
              <text x="${padLeft - 4}" y="${y + 3}" text-anchor="end"
                    style="font-size: calc(10px + var(--pill-text-offset, 0px))"
                    fill="var(--secondary-text-color)">${(maxAmount * fraction).toFixed(1)}</text>
            `;
          })}

          <!-- History polyline -->
          <polyline points="${polylinePoints}"
                    fill="none" stroke="var(--primary-color)" stroke-width="1.5"
                    stroke-linejoin="round" opacity="0.8"/>

          <!-- Current amount dashed line -->
          ${amountInBody && amountInBody !== 'unavailable' ? svg`
            <line x1="${padLeft}" y1="${currentY}" x2="${w - padRight}" y2="${currentY}"
                  stroke="var(--primary-color)" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
            <text x="${padLeft}" y="${currentLabelY}" style="font-size: calc(11px + var(--pill-text-offset, 0px))" fill="var(--primary-color)">
              Current: ${amountInBody} ${c.getStrengthUnit(entities)}
            </text>
          ` : nothing}

          <!-- X-axis baseline -->
          <line x1="${padLeft}" y1="${h - padBottom}" x2="${w - padRight}" y2="${h - padBottom}"
                stroke="var(--divider-color)" stroke-width="1"/>

          <!-- X-axis tick marks (visual only, no text) -->
          ${tickMarks.map((tm) => svg`
            <line x1="${tm.x}" y1="${h - padBottom}" x2="${tm.x}" y2="${h - padBottom + 3}"
                  stroke="var(--divider-color)" stroke-width="0.5" opacity="0.6"/>
          `)}

          <!-- X-axis time labels (with slightly longer tick) -->
          ${timeLabels.map((tl) => svg`
            <line x1="${tl.x}" y1="${h - padBottom}" x2="${tl.x}" y2="${h - padBottom + 4}"
                  stroke="var(--divider-color)" stroke-width="1"/>
            <text x="${tl.x}" y="${h - 6}" text-anchor="middle"
                  style="font-size: calc(9px + var(--pill-text-offset, 0px))"
                  fill="var(--secondary-text-color)">${tl.label}</text>
          `)}
        </svg>
      </div>
    `;
  }

  private _renderAveragesGrid(entities: ResolvedEntities) {
    const c = this.controller;
    const items: Array<{ label: string; value: string }> = [];
    const { hasDaysSensor, daysSince } = c.daysSinceReveal(entities);

    if (this._config?.show_day_avg_boxes !== false) {
      if (entities.avg7Days && (!hasDaysSensor || daysSince >= 7)) items.push({ label: localize(this._lang, 'averages.avg_7_day'), value: c.getState(entities.avg7Days) });
      if (entities.avg14Days && (!hasDaysSensor || daysSince >= 14)) items.push({ label: localize(this._lang, 'averages.avg_14_day'), value: c.getState(entities.avg14Days) });
      if (entities.avg30Days && (!hasDaysSensor || daysSince >= 30)) items.push({ label: localize(this._lang, 'averages.avg_30_day'), value: c.getState(entities.avg30Days) });
      // Year slot doubles as the running elapsed-days average until 365 days pass.
      // The avgYearly sensor already computes min(days_since_start, 365), so its
      // value IS the running average from the first dose until the year mark.
      if (entities.avgYearly && (!hasDaysSensor || daysSince > 0)) {
        const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.avg_running', { days: daysSince }) : localize(this._lang, 'averages.avg_year');
        items.push({ label, value: c.getState(entities.avgYearly) });
      }
    }
    if (this._config?.show_adherence_boxes !== false) {
      if (entities.adherence7Days && (!hasDaysSensor || daysSince >= 7)) items.push({ label: localize(this._lang, 'averages.adh_7_day'), value: c.getState(entities.adherence7Days) + '%' });
      if (entities.adherence14Days && (!hasDaysSensor || daysSince >= 14)) items.push({ label: localize(this._lang, 'averages.adh_14_day'), value: c.getState(entities.adherence14Days) + '%' });
      if (entities.adherence30Days && (!hasDaysSensor || daysSince >= 30)) items.push({ label: localize(this._lang, 'averages.adh_30_day'), value: c.getState(entities.adherence30Days) + '%' });
      // 365d slot doubles as the running elapsed-days adherence until 365 days pass.
      if (entities.adherence365Days && (!hasDaysSensor || daysSince > 0)) {
        const label = (hasDaysSensor && daysSince < 365) ? localize(this._lang, 'averages.adh_running', { days: daysSince }) : localize(this._lang, 'averages.adh_365_day');
        items.push({ label, value: c.getState(entities.adherence365Days) + '%' });
      }
    }

    if (items.length === 0) return nothing;

    return html`
      <div class="averages-grid">
        ${items.map((item) => html`
          <div class="avg-cell">
            <span class="avg-label">${item.label}</span>
            <span class="avg-value">${item.value === 'unavailable' ? '-' : item.value}</span>
          </div>
        `)}
      </div>
    `;
  }

  static styles = css`
    .pane-graphs {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .carousel-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      transition: background 0.2s;
    }

    .nav-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18);
    }

    .nav-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }

    .nav-btn ha-icon {
      --mdc-icon-size: 20px;
    }

    .nav-title {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: 500;
      color: var(--secondary-text-color, #666);
      min-width: 100px;
      text-align: center;
    }

    .graph-container {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.03);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 0;
      min-height: 180px;
      overflow: hidden;
    }

    .chart-svg {
      display: block;
      width: 100%;
    }

    .line-graph-wrapper {
      position: relative;
    }

    .timeframe-chips {
      position: absolute;
      top: 4px;
      right: 4px;
      display: flex;
      gap: 2px;
      z-index: 1;
    }

    .timeframe-chip {
      padding: 2px 6px;
      font-size: 10px;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      border: none;
      font-family: inherit;
      transition: color 0.2s, background 0.2s;
      line-height: 1.4;
    }

    .timeframe-chip:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
    }

    .timeframe-chip.active {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.2);
      font-weight: 600;
    }

    .bar-graph-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .bar-labels {
      display: flex;
      padding-left: 10%;
      padding-right: 2.5%;
      margin-top: -2px;
      padding-bottom: 6px;
      overflow: hidden;
    }

    .bar-labels span {
      flex: 1;
      text-align: center;
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      white-space: nowrap;
      line-height: 1.4;
    }

    .graph-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 40px 16px;
      color: var(--secondary-text-color, #666);
      font-size: calc(16px + var(--pill-text-offset, 0px));
    }

    .graph-placeholder ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }

    .averages-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .avg-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      padding: 6px 4px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      border-radius: 10px;
      flex: 1;
      min-width: 0;
    }

    .avg-label {
      font-size: calc(11px + var(--pill-text-offset, 0px));
      color: var(--secondary-text-color, #666);
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }

    .avg-value {
      font-size: calc(15px + var(--pill-text-offset, 0px));
      font-weight: 600;
      color: var(--primary-text-color, #222);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'ax-dose-graphs-panel': AxDoseGraphsPanel;
  }
}