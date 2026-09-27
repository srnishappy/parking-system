/**
 * api/detectionApi.js — CCTV Computer Vision Detection API Layer
 * Abstracts AI Computer Vision inference pipeline outputs.
 */

class DetectionApi {
  constructor() {
    this._mockEngine = window.detectionMockData;
  }

  async _delay(ms = 120) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch current detection frame for a given camera
   * @param {string} cameraId 
   * @param {Array} spacesList 
   * @returns {Promise<Object>} Detection Frame Payload
   */
  async getDetectionFrame(cameraId, spacesList = []) {
    await this._delay();
    if (this._mockEngine) {
      return this._mockEngine.getDetectionFrame(cameraId, spacesList);
    }
    return {
      cameraId,
      timestamp: new Date().toLocaleTimeString(),
      detectedSpaces: {},
      confidenceMap: {},
      disclaimer: 'Mock CCTV AI Detection (Simulation Only)'
    };
  }
}

window.detectionApi = new DetectionApi();
