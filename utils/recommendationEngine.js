/**
 * recommendationEngine.js — Smart Parking Recommendation Business Logic
 * Walailak University Parking System
 *
 * Completely UI-independent. Replace data source functions with API calls to
 * connect a real backend without touching any UI code.
 */

// ---------------------------------------------------------------------------
// UTILITY: Haversine Distance (metres)
// ---------------------------------------------------------------------------
function haversineMetres(lat1, lng1, lat2, lng2) {
  const R   = 6371000; // Earth radius in metres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a   =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(metres) {
  return metres < 1000
    ? `${Math.round(metres)} ม.`
    : `${(metres / 1000).toFixed(1)} กม.`;
}

// ---------------------------------------------------------------------------
// UTILITY: Get current class for Student
// ---------------------------------------------------------------------------
/**
 * Find the most relevant class for a student at a given date/time.
 * Returns the class that is currently happening, or the NEXT class today,
 * or the NEXT class in the week (for demo outside WU schedule hours).
 *
 * @param {Array} schedule — from user.schedule
 * @param {Date}  [now]    — injectable for testing; defaults to new Date()
 */
function getCurrentOrNextClass(schedule, now = new Date()) {
  if (!schedule || schedule.length === 0) return null;

  const dayOfWeek = now.getDay(); // 0=Sun…6=Sat
  const curMins   = now.getHours() * 60 + now.getMinutes();

  // 1. Check if there is an ONGOING class today
  const ongoing = schedule.find(c =>
    c.day === dayOfWeek &&
    curMins >= c.startHour * 60 + c.startMin &&
    curMins <  c.endHour   * 60 + c.endMin
  );
  if (ongoing) return { ...ongoing, timing: 'ongoing' };

  // 2. Find NEXT class today (after current time)
  const laterToday = schedule
    .filter(c => c.day === dayOfWeek && c.startHour * 60 + c.startMin > curMins)
    .sort((a, b) => (a.startHour * 60 + a.startMin) - (b.startHour * 60 + b.startMin));
  if (laterToday.length > 0) return { ...laterToday[0], timing: 'upcoming' };

  // 3. Find next class in the week (wrapping)
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (dayOfWeek + offset) % 7;
    const classes = schedule
      .filter(c => c.day === nextDay)
      .sort((a, b) => (a.startHour * 60 + a.startMin) - (b.startHour * 60 + b.startMin));
    if (classes.length > 0) return { ...classes[0], timing: 'future' };
  }

  return null;
}

// ---------------------------------------------------------------------------
// CORE: Sort parking lots by distance from a point and return top N
// ---------------------------------------------------------------------------
function rankParkingByDistance(originLat, originLng, lots, topN = 3) {
  return lots
    .map(lot => ({
      ...lot,
      distanceMetres: haversineMetres(originLat, originLng, lot.lat, lot.lng),
      distanceText:   formatDistance(haversineMetres(originLat, originLng, lot.lat, lot.lng)),
    }))
    .sort((a, b) => a.distanceMetres - b.distanceMetres)
    .slice(0, topN);
}

// ---------------------------------------------------------------------------
// MAIN API: getRecommendations
// ---------------------------------------------------------------------------
/**
 * @param {Object}  user            — from authService.getCurrentUser()
 * @param {Object}  [guestLocation] — { lat, lng } for guest geolocation
 * @returns {Promise<{
 *   lots: Array,
 *   context: Object,
 *   reason: string
 * }>}
 */
async function getRecommendations(user, guestLocation = null) {
  // Simulate slight async delay (replace with fetch() call to real API)
  await new Promise(r => setTimeout(r, 400));

  const allLots = window.WU_PARKING_LOTS;
  const buildings = window.WU_BUILDINGS;

  // ── STUDENT ──────────────────────────────────────────────────────────────
  if (user.role === 'student') {
    const currentClass = getCurrentOrNextClass(user.schedule);

    if (!currentClass) {
      // No class found — recommend general central lots
      const centralLat = 8.6450, centralLng = 99.8975;
      return {
        lots: rankParkingByDistance(centralLat, centralLng, allLots, 3),
        context: { type: 'student_no_class' },
        reason: 'ไม่พบตารางเรียนที่ใกล้เคียง — แสดงที่จอดรถที่ใกล้ใจกลางมหาวิทยาลัย'
      };
    }

    const bldg = buildings[currentClass.buildingId];
    const timingMap = { ongoing: 'กำลังเรียนอยู่', upcoming: 'คาบถัดไปในวันนี้', future: 'คาบเรียนต่อไป' };

    return {
      lots: rankParkingByDistance(bldg.lat, bldg.lng, allLots, 3),
      context: {
        type:          'student_class',
        timing:        timingMap[currentClass.timing] || 'ถัดไป',
        buildingName:  bldg.name,
        timeRange:     `${String(currentClass.startHour).padStart(2,'0')}:${String(currentClass.startMin).padStart(2,'0')} – ${String(currentClass.endHour).padStart(2,'0')}:${String(currentClass.endMin).padStart(2,'0')}`,
        dayName:       ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'][currentClass.day],
      },
      reason: `แนะนำที่จอดรถใกล้ ${bldg.name} สำหรับคาบ${timingMap[currentClass.timing] || ''}ของคุณ`
    };
  }

  // ── STAFF ─────────────────────────────────────────────────────────────────
  if (user.role === 'staff') {
    const bldg = buildings[user.officeBuildingId] || buildings['B_LIBRARY'];
    return {
      lots: rankParkingByDistance(bldg.lat, bldg.lng, allLots, 3),
      context: {
        type:         'staff_office',
        buildingName: bldg.name,
        department:   user.department || user.officeBuilding || '',
      },
      reason: `แนะนำที่จอดรถที่ใกล้ ${bldg.name} มากที่สุด`
    };
  }

  // ── GUEST ─────────────────────────────────────────────────────────────────
  const location = guestLocation || window.WU_MOCK_GUEST_LOCATION;
  const isMock   = !guestLocation;
  return {
    lots: rankParkingByDistance(location.lat, location.lng, allLots, 6),
    context: {
      type:    'guest_location',
      lat:     location.lat,
      lng:     location.lng,
      isMock,
    },
    reason: isMock
      ? 'ใช้ตำแหน่ง Mock (ประตูทางเข้าหลัก) — กดปุ่ม "ใช้ตำแหน่งของฉัน" เพื่อรับคำแนะนำที่แม่นยำขึ้น'
      : 'แสดงที่จอดรถที่ใกล้ตำแหน่งของคุณมากที่สุด'
  };
}

// ---------------------------------------------------------------------------
// SEARCH: buildings + parking lots
// ---------------------------------------------------------------------------
/**
 * Full-text search across buildings and parking lots.
 * @param {string} query
 * @returns {{ buildings: Array, parkingLots: Array }}
 */
function searchParkingAndBuildings(query) {
  if (!query || query.trim().length < 1) return { buildings: [], parkingLots: [] };

  const q = query.trim().toLowerCase();

  const buildings = Object.values(window.WU_BUILDINGS)
    .filter(b => b.name.toLowerCase().includes(q))
    .slice(0, 5);

  const parkingLots = window.WU_PARKING_LOTS
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
    .slice(0, 6);

  return { buildings, parkingLots };
}

// Export
window.RecommendationEngine = {
  getRecommendations,
  searchParkingAndBuildings,
  getCurrentOrNextClass,
  rankParkingByDistance,
  haversineMetres,
  formatDistance,
};
