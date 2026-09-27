/**
 * api/parkingPredictionApi.js — Mock API Layer for Parking Predictions
 * Interacts with mock/parkingPredictionData.js to provide asynchronous prediction data
 * and auto-updates spots every 1 minute with bounded randomization (-2 to +3).
 */

class ParkingPredictionApi {
  constructor() {
    this._data = window.MOCK_PARKING_PREDICTIONS || {};
    this._lastUpdated = null;
  }

  /** Simulate network delay */
  _delay(ms = 150) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get prediction data for a specific parking lot ID (e.g. 'P01', 'P04')
   * @param {string} parkingId 
   * @returns {Promise<Object>}
   */
  async getPredictionByParkingId(parkingId) {
    await this._delay();
    const data = this._data[parkingId];
    if (data) return { ...data };

    // Dynamic fallback generation for custom or new lots
    return this._generateFallback(parkingId);
  }

  /**
   * Get prediction data for all parking lots
   * @returns {Promise<Object>}
   */
  async getAllParkingPredictions() {
    await this._delay();
    return JSON.parse(JSON.stringify(this._data));
  }

  /**
   * Helper to attach prediction to a lot object
   * @param {Object} lot 
   * @returns {Promise<Object>}
   */
  async getPredictionForLot(lot) {
    if (!lot || !lot.id) return null;
    return await this.getPredictionByParkingId(lot.id);
  }

  /**
   * Update parking spots for all lots by bounded random change (-2 to +3)
   * and recalculate prediction values in tandem.
   * @returns {Object} { lots, predictions, lastUpdated }
   */
  updateParkingDataAndPredictions() {
    const lots = window.parkingApi ? window.parkingApi.getParkingLots() : (window.WU_PARKING_LOTS || []);
    const predictions = window.MOCK_PARKING_PREDICTIONS || {};

    const now = new Date();
    this._lastUpdated = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

    lots.forEach(lot => {
      // Bounded randomization between -2 and +3
      const change = Math.floor(Math.random() * 6) - 2; // -2, -1, 0, +1, +2, +3
      const nextAvailable = Math.min(lot.totalSpots, Math.max(0, lot.availableSpots + change));
      lot.availableSpots = nextAvailable;

      // Update lot status
      const pct = (lot.totalSpots > 0) ? (lot.availableSpots / lot.totalSpots) * 100 : 0;
      if (lot.availableSpots === 0) {
        lot.status = 'full';
      } else if (pct <= 15) {
        lot.status = 'tight';
      } else {
        lot.status = 'available';
      }

      // If prediction object doesn't exist for this lot, create standard prediction record
      if (!predictions[lot.id]) {
        predictions[lot.id] = this._generateFallback(lot.id);
      }

      // Recalculate predictions smoothly based on trend and new available spots
      const predObj = predictions[lot.id];
      if (predObj) {
        predObj.currentAvailable = lot.availableSpots;
        predObj.totalSpots = lot.totalSpots;

        let delta10 = 2, delta20 = 5, delta30 = 8, delta60 = 15;

        if (predObj.trend === 'INCREASING') {
          delta10 = 2; delta20 = 5; delta30 = 8; delta60 = 15;
        } else if (predObj.trend === 'DECREASING') {
          delta10 = -3; delta20 = -6; delta30 = -9; delta60 = -16;
        } else { // STABLE
          delta10 = 0; delta20 = -1; delta30 = -2; delta60 = -4;
        }

        const p10 = Math.min(lot.totalSpots, Math.max(0, lot.availableSpots + delta10));
        const p20 = Math.min(lot.totalSpots, Math.max(0, lot.availableSpots + delta20));
        const p30 = Math.min(lot.totalSpots, Math.max(0, lot.availableSpots + delta30));
        const p60 = Math.min(lot.totalSpots, Math.max(0, lot.availableSpots + delta60));

        predObj.predictions = {
          "10min": p10,
          "20min": p20,
          "30min": p30,
          "60min": p60
        };
        predObj.predictedSpots = p30;

        if (p30 > lot.availableSpots) {
          predObj.trendText = "🟢 มีแนวโน้มว่างเพิ่ม";
          predObj.trendBadgeClass = "trend-up";
        } else if (p30 < lot.availableSpots) {
          predObj.trendText = "🟠 มีแนวโน้มที่จอดลดลง";
          predObj.trendBadgeClass = "trend-down";
        } else {
          predObj.trendText = "🟡 ค่อนข้างคงที่";
          predObj.trendBadgeClass = "trend-stable";
        }
      }
    });

    // Save updated lots to localStorage if parkingApi is present
    if (window.parkingApi && typeof window.parkingApi.saveAllParkingLots === 'function') {
      window.parkingApi.saveAllParkingLots(lots);
    }

    return {
      lots,
      predictions,
      lastUpdated: this._lastUpdated
    };
  }

  /** Get last updated timestamp formatted */
  getLastUpdatedTime() {
    if (!this._lastUpdated) {
      const now = new Date();
      this._lastUpdated = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
    }
    return this._lastUpdated;
  }

  /** Dynamic fallback generator if lot ID doesn't exist in seed data */
  _generateFallback(parkingId) {
    const lot = window.parkingApi ? window.parkingApi.getParkingLotById(parkingId) : (window.WU_PARKING_LOTS || []).find(l => l.id === parkingId);
    const total = lot ? lot.totalSpots : 100;
    const avail = lot ? lot.availableSpots : 10;
    const p10 = Math.min(total, Math.max(0, avail + 2));
    const p20 = Math.min(total, Math.max(0, avail + 4));
    const p30 = Math.min(total, Math.max(0, avail + 6));
    const p60 = Math.min(total, Math.max(0, avail + 10));

    return {
      parkingId: parkingId,
      currentAvailable: avail,
      totalSpots: total,
      predictions: { "10min": p10, "20min": p20, "30min": p30, "60min": p60 },
      targetMin: "30min",
      predictedSpots: p30,
      trend: "INCREASING",
      trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
      trendBadgeClass: "trend-up",
      reason: "คาดว่าจะมีพื้นที่ว่างเพิ่มขึ้นเล็กน้อย"
    };
  }

}

// Global instance export
window.parkingPredictionApi = new ParkingPredictionApi();
