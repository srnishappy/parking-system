/**
 * ParkingCard.js — Reusable Parking Lot Card Renderer
 * Returns an HTMLElement for a parking lot item.
 */

const STATUS_CONFIG = {
  available: { label: 'ว่าง',     color: 'var(--go-green)',   dim: 'var(--go-green-dim)',   barClass: 'avail' },
  tight:     { label: 'ใกล้เต็ม', color: 'var(--warn-amber)', dim: '#4a3820',               barClass: 'tight' },
  full:      { label: 'เต็ม',     color: 'var(--stop-red)',   dim: 'var(--stop-red-dim)',   barClass: 'full'  },
};

window.ParkingCard = {
  /**
   * Create a parking lot card element.
   * @param {Object} lot        — parking lot data (from WU_PARKING_LOTS + distanceText)
   * @param {number} rank       — 1-based rank (shown as recommended badge)
   * @param {boolean} showRank  — show "อันดับที่ N" badge
   * @returns {HTMLElement}
   */
  create(lot, rank = 0, showRank = true) {
    const cfg  = STATUS_CONFIG[lot.status] || STATUS_CONFIG.available;
    const pct  = Math.round((lot.availableSpots / lot.totalSpots) * 100);
    const dist = lot.distanceText || '—';

    // Prediction Data resolution
    const pred = lot.prediction || (window.MOCK_PARKING_PREDICTIONS && window.MOCK_PARKING_PREDICTIONS[lot.id]) || {
      predictedSpots: lot.availableSpots,
      trendText: '🟡 ค่อนข้างคงที่',
      trendBadgeClass: 'trend-stable',
      predictions: { '10min': lot.availableSpots, '20min': lot.availableSpots, '30min': lot.availableSpots, '60min': lot.availableSpots }
    };

    const el = document.createElement('div');
    el.className = 'p-card';
    el.innerHTML = `
      <div class="p-card-status-bar" style="background:${cfg.color}"></div>
      ${showRank && rank <= 3 ? `<div class="p-card-rank">#${rank}</div>` : ''}
      <div class="p-card-top">
        <div class="p-card-title">${lot.name}</div>
        <span class="p-card-badge" style="background:${cfg.dim};color:${cfg.color};">${cfg.label}</span>
      </div>
      <div class="p-card-distance">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${dist} จากจุดหมาย
      </div>
      <div class="p-card-features">
        ${lot.features.map(f => `<span class="p-card-feature-tag">${f}</span>`).join('')}
      </div>
      <div class="p-card-meter">
        <div class="p-card-meter-top">
          <span class="p-card-count" data-target="${lot.availableSpots}">0</span>
          <span class="p-card-total">/ ${lot.totalSpots} ช่อง</span>
        </div>
        <div class="p-card-track">
          <div class="p-card-fill ${cfg.barClass}" style="width:0%" data-pct="${pct}"></div>
        </div>
      </div>

      <!-- 🔮 PARKING PREDICTION SECTION -->
      <div class="p-card-prediction">
        <div class="p-pred-header">
          <span class="p-pred-title">🔮 Prediction (คาดการณ์ 30 นาที)</span>
          <span class="p-pred-trend ${pred.trendBadgeClass}">${pred.trendText}</span>
        </div>
        <div class="p-pred-main">
          อีก 30 นาทีข้างหน้า คาดว่าจะว่างประมาณ <span class="p-pred-highlight">${pred.predictedSpots}</span> ช่อง
        </div>
        <div class="p-pred-breakdown">
          <div style="text-align:center;">10น: <b>${pred.predictions['10min']}</b></div>
          <div style="text-align:center;">20น: <b>${pred.predictions['20min']}</b></div>
          <div style="text-align:center;">30น: <b style="color:var(--road-yellow);">${pred.predictions['30min']}</b></div>
          <div style="text-align:center;">60น: <b>${pred.predictions['60min']}</b></div>
        </div>
      </div>

      <div class="p-card-footer">
        <span class="p-card-hours">⏰ ${lot.openHours}</span>
        <button class="p-card-nav-btn" onclick="window.open('https://maps.google.com/?q=${lot.lat},${lot.lng}','_blank')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          นำทาง
        </button>
      </div>
    `;

    // Animate counter & bar when visible
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill    = el.querySelector('.p-card-fill');
        const counter = el.querySelector('.p-card-count');
        const target  = parseInt(counter.dataset.target, 10);
        fill.style.width = fill.dataset.pct + '%';
        let cur = 0;
        const step = Math.max(1, Math.round(target / 20));
        const tmr  = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(tmr); }
          counter.textContent = cur;
        }, 22);
        observer.unobserve(el);
      });
    }, { threshold: 0.2 });
    observer.observe(el);

    return el;
  },

  /** Render a search result row (compact) */
  createSearchRow(item, type = 'parking') {
    const el = document.createElement('div');
    el.className = 'search-result-row';
    const icon = type === 'parking'
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;

    el.innerHTML = `
      <span class="search-result-icon" style="color:${type === 'parking' ? 'var(--road-yellow)' : 'var(--go-green)'}">${icon}</span>
      <div class="search-result-info">
        <div class="search-result-name">${item.name}</div>
        ${type === 'parking' ? `<div class="search-result-sub">${item.availableSpots} ช่องว่าง · ${STATUS_CONFIG[item.status]?.label || ''}</div>` : ''}
      </div>
    `;
    return el;
  }
};
