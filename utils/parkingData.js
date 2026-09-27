/**
 * parkingData.js — Mock Parking & Building Data for Walailak University
 *
 * Coordinates are approximate real GPS positions within Walailak University campus
 * (Nakhon Si Thammarat, Thailand ~8.645°N, 99.897°E)
 *
 * Replace this file's data source with an API call in production.
 */

// ---------------------------------------------------------------------------
// BUILDINGS (reference points for distance calculations & search)
// Real Walailak University Campus Buildings
// ---------------------------------------------------------------------------
const WU_BUILDINGS = {
  // ── อาคารไทยบุรี & ศูนย์บริการ ──────────────────────────────────────────────
  B_THAIBURI:    { id: 'B_THAIBURI',    name: 'อาคารไทยบุรี (ศูนย์บริการการศึกษา / หอประชุมใหญ่)', lat: 8.6441, lng: 99.8978 },

  // ── กลุ่มอาคารเรียนรวม (RC) ────────────────────────────────────────────────
  B_COMMON1:     { id: 'B_COMMON1',     name: 'อาคารเรียนรวม 1 (RC1)',                         lat: 8.6449, lng: 99.8970 },
  B_COMMON3:     { id: 'B_COMMON3',     name: 'อาคารเรียนรวม 3 (RC3)',                         lat: 8.6453, lng: 99.8967 },
  B_COMMON5:     { id: 'B_COMMON5',     name: 'อาคารเรียนรวม 5 (RC5)',                         lat: 8.6436, lng: 99.8976 },
  B_COMMON7:     { id: 'B_COMMON7',     name: 'อาคารเรียนรวม 7 (RC7)',                         lat: 8.6432, lng: 99.8979 },
  B_ST:          { id: 'B_ST',          name: 'อาคารศาสตราจารย์ ดร.สมบัติ ธำรงธัญวงศ์ (อาคาร ST / ตึกโกโกวา)', lat: 8.6447, lng: 99.8983 },
  B_NG:          { id: 'B_NG',          name: 'อาคารเรียน Next Gen (NG)',                       lat: 8.6439, lng: 99.8986 },

  // ── หอสมุด & ศูนย์สารสนเทศ ────────────────────────────────────────────────
  B_LIBRARY:     { id: 'B_LIBRARY',     name: 'ศูนย์บรรณสารและสื่อการศึกษา (CLM - หอสมุดกลาง)',  lat: 8.6458, lng: 99.8965 },

  // ── กลุ่มอาคารวิชาการ (Zone C) ─────────────────────────────────────────────
  B_ACAD1:       { id: 'B_ACAD1',       name: 'อาคารวิชาการ 1 (สำนักวิชาศิลปศาสตร์)',            lat: 8.6465, lng: 99.8963 },
  B_ACAD2:       { id: 'B_ACAD2',       name: 'อาคารวิชาการ 2 (สำนักวิชาพยาบาลศาสตร์)',          lat: 8.6468, lng: 99.8967 },
  B_ACAD3:       { id: 'B_ACAD3',       name: 'อาคารวิชาการ 3 (สำนักวิชาการจัดการ)',              lat: 8.6471, lng: 99.8971 },
  B_ACAD4:       { id: 'B_ACAD4',       name: 'อาคารวิชาการ 4 (สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี)', lat: 8.6473, lng: 99.8976 },
  B_ACAD5:       { id: 'B_ACAD5',       name: 'อาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)',         lat: 8.6464, lng: 99.8987 },
  B_ACAD7:       { id: 'B_ACAD7',       name: 'อาคารวิชาการ 7 (สำนักวิชาวิทยาศาสตร์)',            lat: 8.6477, lng: 99.8982 },
  B_ACAD9:       { id: 'B_ACAD9',       name: 'อาคารวิชาการ 9 (สำนักวิชาเภสัชศาสตร์)',            lat: 8.6480, lng: 99.8986 },
  B_AD:          { id: 'B_AD',          name: 'อาคารปฏิบัติการสถาปัตยกรรมและการออกแบบ (AD)',       lat: 8.6475, lng: 99.8964 },

  // ── ศูนย์วิทยาศาสตร์ & สุขภาพ ──────────────────────────────────────────────
  B_SEC:         { id: 'B_SEC',         name: 'ศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี (กลุ่ม F1-F8)', lat: 8.6452, lng: 99.8954 },
  B_HEALTHRES:   { id: 'B_HEALTHRES',   name: 'อาคารวิจัยวิทยาการสุขภาพ',                         lat: 8.6439, lng: 99.8958 },
  B_HOSPITAL:    { id: 'B_HOSPITAL',    name: 'โรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยวลัยลักษณ์ (WMC)', lat: 8.6365, lng: 99.8925 },

  // ── ศูนย์กีฬาและทางเข้า ─────────────────────────────────────────────────────
  B_SPORTS:      { id: 'B_SPORTS',      name: 'อาคารศูนย์กีฬาและสุขภาพ (WU Sports Complex)',     lat: 8.6488, lng: 99.8998 },
  B_GATE:        { id: 'B_GATE',        name: 'ซุ้มประตูมหาวิทยาลัยวลัยลักษณ์ (ทางเข้าหลัก)',       lat: 8.6420, lng: 99.8945 },

  // ── Compatibility Aliases ─────────────────────────────────────────────────
  B_COMMON2:     { id: 'B_COMMON3',     name: 'อาคารเรียนรวม 3 (RC3)',                         lat: 8.6453, lng: 99.8967 },
  B_ENGINEERING: { id: 'B_ACAD4',       name: 'อาคารวิชาการ 4 (สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี)', lat: 8.6473, lng: 99.8976 },
  B_IT:          { id: 'B_ACAD5',       name: 'อาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)',         lat: 8.6464, lng: 99.8987 },
  B_HALL:        { id: 'B_THAIBURI',    name: 'อาคารไทยบุรี (หอประชุมใหญ่)',                     lat: 8.6441, lng: 99.8978 },
  B_MEDSCIENCE:  { id: 'B_HEALTHRES',   name: 'อาคารวิจัยวิทยาการสุขภาพ',                         lat: 8.6439, lng: 99.8958 },
};

// ---------------------------------------------------------------------------
// PARKING LOTS (Real Walailak University Locations)
// ---------------------------------------------------------------------------
const WU_PARKING_LOTS = [
  {
    id: 'P01',
    name: 'ลานจอดรถอาคารไทยบุรี',
    shortName: 'ไทยบุรี',
    lat: 8.6439,
    lng: 99.8976,
    totalSpots: 120,
    availableSpots: 45,
    status: 'available',   // 'available' | 'tight' | 'full'
    pricePerHour: 0,       // ฟรีภายในมหาวิทยาลัย
    openHours: '06:00–22:00',
    features: ['หลังคา', 'กล้องวงจรปิด'],
    nearBuildings: ['B_THAIBURI'],
    description: 'ลานจอดรถหลักอาคารไทยบุรี เหมาะสำหรับติดต่อศูนย์บริการการศึกษา (CES) และร่วมกิจกรรมหอประชุมใหญ่'
  },
  {
    id: 'P02',
    name: 'ลานจอดรถกลุ่มอาคารเรียนรวม (เรียนรวม 5 และ 7)',
    shortName: 'เรียนรวม 5-7',
    lat: 8.6435,
    lng: 99.8977,
    totalSpots: 80,
    availableSpots: 12,
    status: 'tight',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_COMMON5', 'B_COMMON7'],
    description: 'ลานจอดรถหน้าอาคารเรียนรวม 5 (RC5) และอาคารเรียนรวม 7 (RC7)'
  },
  {
    id: 'P03',
    name: 'ลานจอดรถศูนย์บรรณสารและสื่อการศึกษา (CLM)',
    shortName: 'บรรณสาร (CLM)',
    lat: 8.6457,
    lng: 99.8964,
    totalSpots: 150,
    availableSpots: 80,
    status: 'available',
    pricePerHour: 0,
    openHours: '07:00–20:00',
    features: ['หลังคา', 'กล้องวงจรปิด', 'จุดชาร์จ EV'],
    nearBuildings: ['B_LIBRARY'],
    description: 'ลานจอดรถขนาดใหญ่ มีหลังคา ใกล้ศูนย์บรรณสารและสื่อการศึกษา (หอสมุดกลาง)'
  },
  {
    id: 'P04',
    name: 'ลานจอดรถโรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยวลัยลักษณ์',
    shortName: 'รพ.ศูนย์การแพทย์',
    lat: 8.6368,
    lng: 99.8928,
    totalSpots: 200,
    availableSpots: 0,
    status: 'full',
    pricePerHour: 0,
    openHours: '24 ชม.',
    features: ['กล้องวงจรปิด', 'เจ้าหน้าที่รักษาความปลอดภัย'],
    nearBuildings: ['B_HOSPITAL'],
    description: 'ลานจอดรถโรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยวลัยลักษณ์ (WMC)'
  },
  {
    id: 'P05',
    name: 'ลานจอดรถศูนย์กีฬาและสุขภาพ',
    shortName: 'ศูนย์กีฬา',
    lat: 8.6486,
    lng: 99.8995,
    totalSpots: 300,
    availableSpots: 120,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_SPORTS'],
    description: 'ลานจอดรถขนาดใหญ่ข้างอาคารศูนย์กีฬาและสุขภาพ สระว่ายน้ำ และสนามกีฬากลาง'
  },
  {
    id: 'P06',
    name: 'ลานจอดรถอาคารศาสตราจารย์ ดร.สมบัติ ธำรงธัญวงศ์ (อาคาร ST)',
    shortName: 'อาคาร ST (โกโกวา)',
    lat: 8.6446,
    lng: 99.8984,
    totalSpots: 100,
    availableSpots: 7,
    status: 'tight',
    pricePerHour: 0,
    openHours: '07:00–21:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_ST', 'B_NG'],
    description: 'ลานจอดรถใกล้อาคารเรียนรวม 6 (ST) และอาคารเรียน Next Gen'
  },
  {
    id: 'P07',
    name: 'ลานจอดรถกลุ่มอาคารวิชาการ (วิศวกรรมศาสตร์และเทคโนโลยี)',
    shortName: 'วิชาการ 4 (วิศวะ)',
    lat: 8.6472,
    lng: 99.8974,
    totalSpots: 90,
    availableSpots: 35,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด', 'จุดชาร์จ EV'],
    nearBuildings: ['B_ACAD4', 'B_ENGINEERING'],
    description: 'ลานจอดรถกลุ่มอาคารวิชาการ Zone C ใกล้อาคารวิชาการ 4 (สำนักวิชาวิศวกรรมศาสตร์)'
  },
  {
    id: 'P08',
    name: 'ลานจอดรถอาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)',
    shortName: 'วิชาการ 5 (สารสนเทศ)',
    lat: 8.6462,
    lng: 99.8989,
    totalSpots: 60,
    availableSpots: 18,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–20:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_ACAD5', 'B_IT'],
    description: 'ลานจอดรถใกล้อาคารวิชาการ 5 เหมาะสำหรับนักศึกษาและบุคลากรสารสนเทศศาสตร์'
  },
  {
    id: 'P09',
    name: 'ลานจอดรถกลุ่มอาคารเรียนรวม 1 และ 3 (RC1, RC3)',
    shortName: 'เรียนรวม 1-3',
    lat: 8.6451,
    lng: 99.8969,
    totalSpots: 110,
    availableSpots: 52,
    status: 'available',
    pricePerHour: 0,
    openHours: '06:00–22:00',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_COMMON1', 'B_COMMON3'],
    description: 'ลานจอดรถระหว่างอาคารเรียนรวม 1 (RC1) และ อาคารเรียนรวม 3 (RC3)'
  },
  {
    id: 'P10',
    name: 'ลานจอดรถศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี',
    shortName: 'ศูนย์เครื่องมือฯ',
    lat: 8.6453,
    lng: 99.8953,
    totalSpots: 70,
    availableSpots: 24,
    status: 'available',
    pricePerHour: 0,
    openHours: '07:30–19:30',
    features: ['กล้องวงจรปิด'],
    nearBuildings: ['B_SEC', 'B_HEALTHRES'],
    description: 'ลานจอดรถศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี และอาคารวิจัยวิทยาการสุขภาพ'
  }
];

// ---------------------------------------------------------------------------
// MOCK LOCATION — ใช้เมื่อ Geolocation ไม่พร้อมใช้งาน (Guest fallback)
// Default = ซุ้มประตูทางเข้าหลักมหาวิทยาลัยวลัยลักษณ์
// ---------------------------------------------------------------------------
const WU_MOCK_GUEST_LOCATION = { lat: 8.6420, lng: 99.8945 };

// Export to global scope
window.WU_BUILDINGS        = WU_BUILDINGS;
window.WU_RAW_PARKING_LOTS = WU_PARKING_LOTS;

let activeLots = WU_PARKING_LOTS;
if (window.parkingApi && typeof window.parkingApi.getParkingLots === 'function') {
  const stored = window.parkingApi.getParkingLots();
  if (Array.isArray(stored) && stored.length > 0) {
    activeLots = stored;
  }
}
window.WU_PARKING_LOTS     = activeLots;
window.WU_MOCK_GUEST_LOCATION = WU_MOCK_GUEST_LOCATION;

