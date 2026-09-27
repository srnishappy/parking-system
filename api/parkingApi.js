/**
 * api/parkingApi.js — Data Access Layer for Admin & User Parking Management
 * Uses localStorage ('parking_app_parking_lots') as single source of truth.
 */

class ParkingApi {
  constructor() {
    this.STORAGE_KEY = 'parking_app_parking_lots';
    this._initStorage();
  }

  /**
   * Helper to resolve default parking lots from global scope
   */
  _getDefaultLots() {
    if (Array.isArray(window.WU_RAW_PARKING_LOTS) && window.WU_RAW_PARKING_LOTS.length > 0) {
      return window.WU_RAW_PARKING_LOTS;
    }
    if (Array.isArray(window.WU_PARKING_LOTS) && window.WU_PARKING_LOTS.length > 0) {
      return window.WU_PARKING_LOTS;
    }
    return [];
  }

  /**
   * Seed localStorage with default WU_PARKING_LOTS if empty or version updated
   */
  _initStorage() {
    const LOTS_VERSION_KEY = 'parking_app_lots_version';
    const CURRENT_VERSION  = 'v3_wu_real_lots_fix';
    const savedVer = localStorage.getItem(LOTS_VERSION_KEY);
    const existing = localStorage.getItem(this.STORAGE_KEY);
    const defaultLots = this._getDefaultLots();

    if (defaultLots.length > 0 && (!existing || existing === '[]' || savedVer !== CURRENT_VERSION)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultLots));
      localStorage.setItem(LOTS_VERSION_KEY, CURRENT_VERSION);
      this._syncGlobal(defaultLots);
    }
  }

  /**
   * Helper to recalculate status based on availableSpots and totalSpots (capacity)
   */
  _calculateStatus(availableSpots, totalSpots) {
    if (totalSpots <= 0 || availableSpots === 0) return 'full';
    const pct = (availableSpots / totalSpots) * 100;
    if (pct <= 15) return 'tight';
    return 'available';
  }

  /**
   * Sync global window.WU_PARKING_LOTS reference so all components get updated data
   */
  _syncGlobal(lots) {
    window.WU_PARKING_LOTS = lots;
  }

  /**
   * Get all parking lots
   * @returns {Array} Array of parking lot objects
   */
  getParkingLots() {
    try {
      const defaultLots = this._getDefaultLots();
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw || raw === '[]') {
        if (defaultLots.length > 0) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultLots));
          this._syncGlobal(defaultLots);
          return defaultLots;
        }
      }
      let lots = JSON.parse(raw);
      if (!Array.isArray(lots) || lots.length === 0) {
        if (defaultLots.length > 0) {
          lots = defaultLots;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lots));
        }
      }
      this._syncGlobal(lots);
      return lots;
    } catch (e) {
      console.error('Failed to parse parking lots from localStorage', e);
      return this._getDefaultLots();
    }
  }

  /**
   * Get a single parking lot by ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getParkingLotById(id) {
    const lots = this.getParkingLots();
    return lots.find(l => String(l.id) === String(id)) || null;
  }

  /**
   * Create a new parking lot
   * @param {Object} lotData 
   * @returns {Object} Created parking lot
   */
  createParkingLot(lotData) {
    const name = (lotData.name || '').trim();
    const shortName = (lotData.shortName || name.slice(0, 10)).trim();
    const totalSpots = parseInt(lotData.totalSpots, 10) || 0;
    const availableSpots = parseInt(lotData.availableSpots, 10) || 0;

    if (!name) {
      throw new Error('กรุณาระบุชื่อลานจอดรถ');
    }
    if (totalSpots <= 0) {
      throw new Error('จำนวนความจุ (ช่องจอดทั้งหมด) ต้องมากกว่า 0');
    }
    if (availableSpots < 0) {
      throw new Error('จำนวนช่องว่างต้องไม่ติดลบ');
    }
    if (availableSpots > totalSpots) {
      throw new Error('จำนวนช่องว่างต้องไม่มากกว่าจำนวนช่องจอดทั้งหมด');
    }

    const lots = this.getParkingLots();

    // Auto generate ID
    let newId = lotData.id ? lotData.id.trim() : '';
    if (!newId) {
      const maxNum = lots.reduce((max, l) => {
        const match = String(l.id).match(/^P(\d+)$/i);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
      }, 0);
      newId = `P${String(maxNum + 1).padStart(2, '0')}`;
    } else {
      const exists = lots.some(l => String(l.id).toLowerCase() === newId.toLowerCase());
      if (exists) {
        throw new Error(`รหัสลานจอดรถ "${newId}" มีอยู่ในระบบแล้ว`);
      }
    }

    const status = this._calculateStatus(availableSpots, totalSpots);

    const newLot = {
      id: newId,
      name: name,
      shortName: shortName,
      lat: parseFloat(lotData.lat) || 8.6450,
      lng: parseFloat(lotData.lng) || 99.8970,
      totalSpots: totalSpots,
      availableSpots: availableSpots,
      status: status,
      pricePerHour: parseFloat(lotData.pricePerHour) || 0,
      openHours: lotData.openHours || '06:00–22:00',
      features: Array.isArray(lotData.features) ? lotData.features : (lotData.features ? String(lotData.features).split(',').map(s => s.trim()).filter(Boolean) : ['กล้องวงจรปิด']),
      nearBuildings: Array.isArray(lotData.nearBuildings) ? lotData.nearBuildings : ['B_THAIBURI'],
      description: lotData.description || `ลานจอดรถ ${name}`
    };

    lots.push(newLot);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lots));
    this._syncGlobal(lots);
    return newLot;
  }

  /**
   * Update existing parking lot
   * @param {string} id 
   * @param {Object} updatedFields 
   * @returns {Object} Updated parking lot
   */
  updateParkingLot(id, updatedFields) {
    const lots = this.getParkingLots();
    const index = lots.findIndex(l => String(l.id) === String(id));
    if (index === -1) {
      throw new Error(`ไม่พบลานจอดรถรหัส ${id}`);
    }

    const current = lots[index];
    const name = updatedFields.name !== undefined ? updatedFields.name.trim() : current.name;
    const shortName = updatedFields.shortName !== undefined ? updatedFields.shortName.trim() : current.shortName;
    const totalSpots = updatedFields.totalSpots !== undefined ? parseInt(updatedFields.totalSpots, 10) : current.totalSpots;
    const availableSpots = updatedFields.availableSpots !== undefined ? parseInt(updatedFields.availableSpots, 10) : current.availableSpots;

    if (!name) {
      throw new Error('กรุณาระบุชื่อลานจอดรถ');
    }
    if (totalSpots <= 0) {
      throw new Error('จำนวนความจุ (ช่องจอดทั้งหมด) ต้องมากกว่า 0');
    }
    if (availableSpots < 0) {
      throw new Error('จำนวนช่องว่างต้องไม่ติดลบ');
    }
    if (availableSpots > totalSpots) {
      throw new Error('จำนวนช่องว่างต้องไม่มากกว่าจำนวนช่องจอดทั้งหมด');
    }

    const status = this._calculateStatus(availableSpots, totalSpots);

    const updatedLot = {
      ...current,
      name,
      shortName,
      totalSpots,
      availableSpots,
      status,
      lat: updatedFields.lat !== undefined ? parseFloat(updatedFields.lat) : current.lat,
      lng: updatedFields.lng !== undefined ? parseFloat(updatedFields.lng) : current.lng,
      openHours: updatedFields.openHours !== undefined ? updatedFields.openHours : current.openHours,
      description: updatedFields.description !== undefined ? updatedFields.description : current.description,
      features: updatedFields.features !== undefined ? (Array.isArray(updatedFields.features) ? updatedFields.features : String(updatedFields.features).split(',').map(s => s.trim()).filter(Boolean)) : current.features
    };

    lots[index] = updatedLot;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lots));
    this._syncGlobal(lots);
    return updatedLot;
  }

  /**
   * Delete parking lot by ID
   * @param {string} id 
   * @returns {boolean} Success state
   */
  deleteParkingLot(id) {
    const lots = this.getParkingLots();
    const filtered = lots.filter(l => String(l.id) !== String(id));
    if (filtered.length === lots.length) {
      throw new Error(`ไม่พบลานจอดรถรหัส ${id} ที่ต้องการลบ`);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    this._syncGlobal(filtered);
    return true;
  }

  /**
   * Save full updated array of parking lots directly (e.g. from 1-min auto updater)
   * @param {Array} lots 
   */
  saveAllParkingLots(lots) {
    if (!Array.isArray(lots)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lots));
    this._syncGlobal(lots);
  }
}

// Global instance export
window.parkingApi = new ParkingApi();
