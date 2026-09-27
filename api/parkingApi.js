/**
 * api/parkingApi.js — Data Access Layer for Admin & User Parking Management
 * Uses localStorage ('parking_app_parking_lots') as single source of truth.
 */

class ParkingApi {
  constructor() {
    this.STORAGE_KEY = 'parking_app_parking_lots';
    this.STORAGE_SPACES_KEY = 'parking_app_spaces';
    this._initStorage();
    this._initSpaces();
  }

  /**
   * Seed default 3D Parking Spaces (A01-A10, B01-B10, C01-C10)
   */
  _initSpaces() {
    if (!localStorage.getItem(this.STORAGE_SPACES_KEY)) {
      const defaultSpaces = [];
      const zones = [
        { zone: 'A', cameraId: 'CAM-01', prefix: 'A', count: 10, occ: [2, 4, 7], res: [9] },
        { zone: 'B', cameraId: 'CAM-02', prefix: 'B', count: 10, occ: [1, 3, 5, 8], res: [10] },
        { zone: 'C', cameraId: 'CAM-03', prefix: 'C', count: 10, occ: [2, 6], res: [4] }
      ];

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      zones.forEach(z => {
        for (let i = 1; i <= z.count; i++) {
          const id = `${z.prefix}${String(i).padStart(2, '0')}`;
          let status = 'AVAILABLE';
          if (z.occ.includes(i)) status = 'OCCUPIED';
          if (z.res.includes(i)) status = 'RESERVED';

          defaultSpaces.push({
            id: id,
            zone: z.zone,
            cameraId: z.cameraId,
            status: status,
            lastUpdated: timeStr
          });
        }
      });

      localStorage.setItem(this.STORAGE_SPACES_KEY, JSON.stringify(defaultSpaces));
    }
  }

  /**
   * Seed localStorage with default WU_PARKING_LOTS if empty
   */
  _initStorage() {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const defaultLots = window.WU_PARKING_LOTS || [];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultLots));
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
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        const defaults = window.WU_PARKING_LOTS || [];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      const lots = JSON.parse(raw);
      this._syncGlobal(lots);
      return lots;
    } catch (e) {
      console.error('Failed to parse parking lots from localStorage', e);
      return window.WU_PARKING_LOTS || [];
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

  // ---------------------------------------------------------------------------
  // 3D PARKING SPACES MANAGEMENT (A01 - C10)
  // ---------------------------------------------------------------------------

  /**
   * Get all 3D parking spaces
   * @returns {Array} Array of 3D parking space objects
   */
  getParkingSpaces() {
    try {
      const raw = localStorage.getItem(this.STORAGE_SPACES_KEY);
      if (!raw) {
        this._initSpaces();
        return JSON.parse(localStorage.getItem(this.STORAGE_SPACES_KEY)) || [];
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse parking spaces from localStorage', e);
      return [];
    }
  }

  /**
   * Get single 3D parking space by ID (e.g. 'A02')
   */
  getParkingSpaceById(spaceId) {
    const spaces = this.getParkingSpaces();
    return spaces.find(s => s.id === spaceId) || null;
  }

  /**
   * Get 3D parking spaces filtered by Zone ('A', 'B', 'C')
   */
  getSpacesByZone(zone) {
    const spaces = this.getParkingSpaces();
    return spaces.filter(s => s.zone === zone);
  }

  /**
   * Update single 3D parking space status ('AVAILABLE' | 'OCCUPIED' | 'RESERVED')
   */
  updateParkingSpaceStatus(spaceId, newStatus) {
    const spaces = this.getParkingSpaces();
    const index = spaces.findIndex(s => s.id === spaceId);
    if (index === -1) {
      throw new Error(`ไม่พบช่องจอดรถรหัส ${spaceId}`);
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    spaces[index].status = newStatus;
    spaces[index].lastUpdated = timeStr;

    localStorage.setItem(this.STORAGE_SPACES_KEY, JSON.stringify(spaces));
    this._syncSpacesWithLotSummary(spaces);

    return spaces[index];
  }

  /**
   * Save all spaces directly (used by 1-min simulation updater)
   */
  saveAllParkingSpaces(spaces) {
    if (!Array.isArray(spaces)) return;
    localStorage.setItem(this.STORAGE_SPACES_KEY, JSON.stringify(spaces));
    this._syncSpacesWithLotSummary(spaces);
  }

  /**
   * Helper to sync space-level counts with main parking lots summary (P01, P02, P03)
   */
  _syncSpacesWithLotSummary(spaces) {
    const lots = this.getParkingLots();

    // Map Zone A -> P01 (Thaiburi), Zone B -> P02 (Rienruam), Zone C -> P03 (Bannasarn)
    const zoneMap = { 'A': 'P01', 'B': 'P02', 'C': 'P03' };

    Object.keys(zoneMap).forEach(zone => {
      const lotId = zoneMap[zone];
      const zoneSpaces = spaces.filter(s => s.zone === zone);
      const availCount = zoneSpaces.filter(s => s.status === 'AVAILABLE').length;

      const lotIndex = lots.findIndex(l => l.id === lotId);
      if (lotIndex !== -1) {
        lots[lotIndex].availableSpots = availCount;
        lots[lotIndex].status = this._calculateStatus(availCount, lots[lotIndex].totalSpots);
      }
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lots));
    this._syncGlobal(lots);
  }
}

// Global instance export
window.parkingApi = new ParkingApi();
}

// Global instance export
window.parkingApi = new ParkingApi();
