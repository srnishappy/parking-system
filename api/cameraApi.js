/**
 * api/cameraApi.js — API Service Layer for CCTV Camera Management
 */

class CameraApi {
  constructor() {
    this._cameras = window.MOCK_CAMERAS || [];
  }

  async _delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /** Get all registered CCTV cameras */
  async getCameras() {
    await this._delay();
    return window.MOCK_CAMERAS || this._cameras;
  }

  /** Get camera details by ID */
  async getCameraById(id) {
    await this._delay();
    const cameras = window.MOCK_CAMERAS || this._cameras;
    return cameras.find(c => c.id === id) || null;
  }

  /** Get camera covering a specific zone */
  async getCameraForZone(zone) {
    await this._delay();
    const cameras = window.MOCK_CAMERAS || this._cameras;
    return cameras.find(c => c.zone === zone) || null;
  }
}

window.cameraApi = new CameraApi();
