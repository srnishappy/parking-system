/**
 * mock/detectionData.js — Mock Computer Vision AI Detection Frame Data
 * Simulates real-time AI object detection pipeline outputs.
 */

class DetectionMockData {
  constructor() {
    this._confidenceSeed = {
      'A01': 96, 'A02': 94, 'A03': 98, 'A04': 95, 'A05': 92,
      'A06': 97, 'A07': 93, 'A08': 95, 'A09': 96, 'A10': 91,
      'B01': 95, 'B02': 97, 'B03': 92, 'B04': 96, 'B05': 94,
      'B06': 98, 'B07': 93, 'B08': 95, 'B09': 91, 'B10': 96,
      'C01': 97, 'C02': 94, 'C03': 96, 'C04': 93, 'C05': 98,
      'C06': 95, 'C07': 92, 'C08': 96, 'C09': 94, 'C10': 97
    };
  }

  /**
   * Get simulated AI Detection Frame for a specific Camera
   * @param {string} cameraId 
   * @param {Array} spacesList 
   * @returns {Object} Frame payload
   */
  getDetectionFrame(cameraId, spacesList = []) {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const detectedSpaces = {};
    const confidenceMap = {};

    spacesList.forEach(space => {
      detectedSpaces[space.id] = space.status;
      // Fluctuate confidence slightly between 91% and 99%
      const baseConf = this._confidenceSeed[space.id] || 95;
      const jitter = (Math.random() * 2 - 1).toFixed(1);
      confidenceMap[space.id] = Math.min(99, Math.max(90, parseFloat(baseConf) + parseFloat(jitter)));
    });

    return {
      cameraId,
      timestamp,
      modelName: 'YOLOv8-ParkingSpace-Detector v2.1',
      fps: 29.8,
      detectedSpaces,
      confidenceMap,
      disclaimer: 'Mock CCTV AI Detection (Simulation Only)'
    };
  }
}

window.detectionMockData = new DetectionMockData();
