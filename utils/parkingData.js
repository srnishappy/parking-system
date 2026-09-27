/**
 * parkingData.js — Mock Parking & Building Data for Walailak University
 *
 * Coordinates are approximate real GPS positions within Walailak University campus
 * (Nakhon Si Thammarat, Thailand ~8.645°N, 99.897°E)
 *
 * Replace this file's data source with an API call in production.
 */

// ---------------------------------------------------------------------------
// BUILDINGS (reference points for distance calculations)
// ---------------------------------------------------------------------------
const WU_BUILDINGS = {
  B_THAIBURI:    { id: 'B_THAIBURI',    name: 'อาคารไทยบุรี',                     lat: 8.6458, lng: 99.8985 },
  B_COMMON1:     { id: 'B_COMMON1',     name: 'อาคารเรียนรวม 1',                  lat: 8.6445, lng: 99.8972 },
  B_COMMON2:     { id: 'B_COMMON2',     name: 'อาคารเรียนรวม 2',                  lat: 8.6443, lng: 99.8978 },
  B_MEDSCIENCE:  { id: 'B_MEDSCIENCE',  name: 'อาคารวิทยาศาสตร์การแพทย์',         lat: 8.6435, lng: 99.8960 },
  B_LIBRARY:     { id: 'B_LIBRARY',     name: 'ศูนย์บรรณสารและสื่อการศึกษา',       lat: 8.6462, lng: 99.8968 },
  B_ENGINEERING: { id: 'B_ENGINEERING', name: 'อาคารสำนักวิชาวิศวกรรมศาสตร์',      lat: 8.6472, lng: 99.8975 },
  B_HALL:        { id: 'B_HALL',        name: 'หอประชุมใหญ่',                      lat: 8.6440, lng: 99.8962 },
  B_IT:          { id: 'B_IT',          name: 'อาคารสารสนเทศ (สำนักวิชาสารสนเทศ)',  lat: 8.6456, lng: 99.8992 },
  B_SPORTS:      { id: 'B_SPORTS',      name: 'ศูนย์กีฬา',                         lat: 8.6470, lng: 99.8998 },
  B_HOSPITAL:    { id: 'B_HOSPITAL',    name: 'โรงพยาบาลมหาวิทยาลัยวลัยลักษณ์',   lat: 8.6435, lng: 99.8955 },
  B_GATE:        { id: 'B_GATE',        name: 'ประตูมหาวิทยาลัย (ทางเข้าหลัก)',    lat: 8.6420, lng: 99.8945 },
};

// ---------------------------------------------------------------------------
// PARKING LOTS
// ---------------------------------------------------------------------------
const WU_PARKING_LOTS = [
  {
    id: 'P01',
    name: 'ลานจอดรถอาคารไทยบุรี',
    shortName: 'ไทยบุรี',
    lat: 8.6455,
    lng: 99.8982,
    totalSpots: 120,
    availableSpots: 45,
    status: 'available',   // 'available' | 'tight' | 'full'
    pricePerHour: 0,       // ฟรีภายในมหาวิทยาลัย
    openHours: '06:00–22:00',
    features: ['หลังคา', 'กล้องวงจรปิด'],
    nearBuildings: ['B_THAIBURI'],
    description: 'ลานจอดรถหลักอาคารไทยบุรี เหมาะสำหรับนักศึกษาที่มีคลาสในอาคารไทยบุรี'
  },
  {
    id: 'P02',
    name: 'ลานจอดรถอาคารเรียนรวม',
    shortName: 'เรียนรวม',
    lat: 8.6444,
    lng: 99.8975,
    totalSpots: 80,
    availableSpots: 12,
    status: 'tight',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_COMMON1', 'B_COMMON2'],
    description: 'ลานจอดรถหน้าอาคารเรียนรวม 1 และ 2'
  },
  {
    id: 'P03',
    name: 'ลานจอดรถศูนย์บรรณสารและสื่อการศึกษา',
    shortName: 'บรรณสาร',
    lat: 8.6460,
    lng: 99.8966,
    totalSpots: 150,
    availableSpots: 80,
    status: 'available',
    pricePerHour: 0,
    openHours: '07:00–20:00',
    features: ['หลังคา', 'กล้องวงจรปิด', 'จุดชาร์จ EV'],
    nearBuildings: ['B_LIBRARY'],
    description: 'ลานจอดรถขนาดใหญ่ มีหลังคา ใกล้ศูนย์บรรณสาร'
  },
  {
    id: 'P04',
    name: 'ลานจอดรถโรงพยาบาลมหาวิทยาลัยวลัยลักษณ์',
    shortName: 'โรงพยาบาล',
    lat: 8.6433,
    lng: 99.8953,
    totalSpots: 200,
    availableSpots: 0,
    status: 'full',
    pricePerHour: 0,
    openHours: '24 ชม.',
    features: ['กล้องวงจรปิด', 'เจ้าหน้าที่รักษาความปลอดภัย'],
    nearBuildings: ['B_HOSPITAL'],
    description: 'ลานจอดรถโรงพยาบาลวลัยลักษณ์ (ขณะนี้เต็มแล้ว)'
  },
  {
    id: 'P05',
    name: 'ลานจอดรถศูนย์กีฬา',
    shortName: 'ศูนย์กีฬา',
    lat: 8.6468,
    lng: 99.8996,
    totalSpots: 300,
    availableSpots: 120,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_SPORTS'],
    description: 'ลานจอดรถขนาดใหญ่ที่สุดในมหาวิทยาลัย ข้างศูนย์กีฬา'
  },
  {
    id: 'P06',
    name: 'ลานจอดรถหอประชุมใหญ่',
    shortName: 'หอประชุม',
    lat: 8.6438,
    lng: 99.8960,
    totalSpots: 100,
    availableSpots: 7,
    status: 'tight',
    pricePerHour: 0,
    openHours: '07:00–21:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_HALL'],
    description: 'ลานจอดรถหน้าหอประชุมใหญ่ ใกล้เต็มแล้ว'
  },
  {
    id: 'P07',
    name: 'ลานจอดรถสำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี',
    shortName: 'วิศวกรรมฯ',
    lat: 8.6470,
    lng: 99.8973,
    totalSpots: 90,
    availableSpots: 35,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด', 'จุดชาร์จ EV'],
    nearBuildings: ['B_ENGINEERING'],
    description: 'ลานจอดรถใกล้อาคารสำนักวิชาวิศวกรรมศาสตร์'
  },
  {
    id: 'P08',
    name: 'ลานจอดรถสำนักวิชาสารสนเทศศาสตร์',
    shortName: 'สารสนเทศฯ',
    lat: 8.6454,
    lng: 99.8990,
    totalSpots: 60,
    availableSpots: 18,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–20:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_IT'],
    description: 'ลานจอดรถอาคารสารสนเทศ เหมาะสำหรับนักศึกษาสารสนเทศ'
  },
];

// ---------------------------------------------------------------------------
// MOCK LOCATION — ใช้เมื่อ Geolocation ไม่พร้อมใช้งาน (Guest fallback)
// Default = ประตูทางเข้าหลักมหาวิทยาลัยวลัยลักษณ์
// ---------------------------------------------------------------------------
const WU_MOCK_GUEST_LOCATION = { lat: 8.6420, lng: 99.8945 };

// Export to global scope
window.WU_BUILDINGS        = WU_BUILDINGS;
window.WU_PARKING_LOTS     = (window.parkingApi && typeof window.parkingApi.getParkingLots === 'function') 
  ? window.parkingApi.getParkingLots() 
  : WU_PARKING_LOTS;
window.WU_MOCK_GUEST_LOCATION = WU_MOCK_GUEST_LOCATION;

