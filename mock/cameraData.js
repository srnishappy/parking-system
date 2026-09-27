/**
 * mock/cameraData.js — Mock Data for CCTV Cameras covering 3D Parking Zones
 */

const MOCK_CAMERAS = [
  {
    id: 'CAM-01',
    name: 'CCTV-01 (Zone A)',
    locationName: 'โซน A — หน้าอาคารเรียนรวม 1',
    zone: 'A',
    status: 'ONLINE',
    resolution: '1080p FPS: 30',
    ipAddress: '192.168.1.101',
    monitoredSpaces: ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10'],
    // 3D Camera Position & LookAt target
    camPos: { x: -14, y: 12, z: 15 },
    lookTarget: { x: -12, y: 0, z: 0 }
  },
  {
    id: 'CAM-02',
    name: 'CCTV-02 (Zone B)',
    locationName: 'โซน B — หน้าอาคารเรียนรวม 2',
    zone: 'B',
    status: 'ONLINE',
    resolution: '1080p FPS: 30',
    ipAddress: '192.168.1.102',
    monitoredSpaces: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10'],
    camPos: { x: 0, y: 12, z: 15 },
    lookTarget: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'CAM-03',
    name: 'CCTV-03 (Zone C)',
    locationName: 'โซน C — อาคารไทยบุรี',
    zone: 'C',
    status: 'ONLINE',
    resolution: '1080p FPS: 30',
    ipAddress: '192.168.1.103',
    monitoredSpaces: ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10'],
    camPos: { x: 14, y: 12, z: 15 },
    lookTarget: { x: 12, y: 0, z: 0 }
  }
];

window.MOCK_CAMERAS = MOCK_CAMERAS;
