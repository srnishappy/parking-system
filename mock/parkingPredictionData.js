/**
 * mock/parkingPredictionData.js — Mock Parking Prediction Data
 * Walailak University Smart Parking Prediction Engine
 */

window.MOCK_PARKING_PREDICTIONS = {
  P01: {
    parkingId: "P01",
    parkingName: "ลานจอดรถอาคารไทยบุรี",
    currentAvailable: 45,
    totalSpots: 120,
    predictions: {
      "10min": 47,
      "20min": 50,
      "30min": 52,
      "60min": 58
    },
    targetMin: "30min",
    predictedSpots: 52,
    trend: "INCREASING", // INCREASING | DECREASING | STABLE
    trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
    trendBadgeClass: "trend-up",
    reason: "คาดว่าจะมีนักศึกษาและผู้มาติดต่อทยอยออกจากอาคารไทยบุรี"
  },

  P02: {
    parkingId: "P02",
    parkingName: "ลานจอดรถกลุ่มอาคารเรียนรวม (เรียนรวม 5 และ 7)",
    currentAvailable: 12,
    totalSpots: 80,
    predictions: {
      "10min": 14,
      "20min": 16,
      "30min": 18,
      "60min": 25
    },
    targetMin: "30min",
    predictedSpots: 18,
    trend: "INCREASING",
    trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
    trendBadgeClass: "trend-up",
    reason: "ใกล้หมดคาบเรียนรอบเช้าของอาคารเรียนรวม 5 และ 7 จะมีรถทยอยออก"
  },

  P03: {
    parkingId: "P03",
    parkingName: "ลานจอดรถศูนย์บรรณสารและสื่อการศึกษา (CLM)",
    currentAvailable: 80,
    totalSpots: 150,
    predictions: {
      "10min": 77,
      "20min": 74,
      "30min": 72,
      "60min": 65
    },
    targetMin: "30min",
    predictedSpots: 72,
    trend: "DECREASING",
    trendText: "🟠 มีแนวโน้มที่จอดลดลง",
    trendBadgeClass: "trend-down",
    reason: "มีผู้เข้าใช้บริการหอสมุดกลางเพิ่มขึ้นในช่วงบ่าย"
  },

  P04: {
    parkingId: "P04",
    parkingName: "ลานจอดรถโรงพยาบาลศูนย์การแพทย์มหาวิทยาลัยวลัยลักษณ์",
    currentAvailable: 0,
    totalSpots: 200,
    predictions: {
      "10min": 3,
      "20min": 7,
      "30min": 12,
      "60min": 20
    },
    targetMin: "30min",
    predictedSpots: 12,
    trend: "INCREASING",
    trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
    trendBadgeClass: "trend-up",
    reason: "ผู้ป่วยและญาติเริ่มทยอยเดินทางกลับหลังรับยาเสร็จ"
  },

  P05: {
    parkingId: "P05",
    parkingName: "ลานจอดรถศูนย์กีฬาและสุขภาพ",
    currentAvailable: 120,
    totalSpots: 300,
    predictions: {
      "10min": 120,
      "20min": 119,
      "30min": 118,
      "60min": 115
    },
    targetMin: "30min",
    predictedSpots: 118,
    trend: "STABLE",
    trendText: "🟡 ค่อนข้างคงที่",
    trendBadgeClass: "trend-stable",
    reason: "ปริมาณการจราจรบริเวณศูนย์กีฬาและสุขภาพค่อนข้างสม่ำเสมอ"
  },

  P06: {
    parkingId: "P06",
    parkingName: "ลานจอดรถอาคารศาสตราจารย์ ดร.สมบัติ ธำรงธัญวงศ์ (อาคาร ST)",
    currentAvailable: 7,
    totalSpots: 100,
    predictions: {
      "10min": 9,
      "20min": 12,
      "30min": 15,
      "60min": 22
    },
    targetMin: "30min",
    predictedSpots: 15,
    trend: "INCREASING",
    trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
    trendBadgeClass: "trend-up",
    reason: "คาบเรียน Smart Classroom อาคาร ST เลิกเรียน เริ่มมีรถออก"
  },

  P07: {
    parkingId: "P07",
    parkingName: "ลานจอดรถกลุ่มอาคารวิชาการ (วิศวกรรมศาสตร์และเทคโนโลยี)",
    currentAvailable: 35,
    totalSpots: 90,
    predictions: {
      "10min": 33,
      "20min": 31,
      "30min": 30,
      "60min": 24
    },
    targetMin: "30min",
    predictedSpots: 30,
    trend: "DECREASING",
    trendText: "🟠 มีแนวโน้มที่จอดลดลง",
    trendBadgeClass: "trend-down",
    reason: "นักศึกษาเริ่มทยอยเข้าคลาสปฏิบัติการแล็บวิศวกรรมศาสตร์"
  },

  P08: {
    parkingId: "P08",
    parkingName: "ลานจอดรถอาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)",
    currentAvailable: 18,
    totalSpots: 60,
    predictions: {
      "10min": 19,
      "20min": 21,
      "30min": 22,
      "60min": 28
    },
    targetMin: "30min",
    predictedSpots: 22,
    trend: "INCREASING",
    trendText: "🟢 มีแนวโน้มว่างเพิ่ม",
    trendBadgeClass: "trend-up",
    reason: "นักศึกษาสารสนเทศเลิกคลาสห้องปฏิบัติการคอมพิวเตอร์"
  },

  P09: {
    parkingId: "P09",
    parkingName: "ลานจอดรถกลุ่มอาคารเรียนรวม 1 และ 3 (RC1, RC3)",
    currentAvailable: 52,
    totalSpots: 110,
    predictions: {
      "10min": 50,
      "20min": 48,
      "30min": 45,
      "60min": 40
    },
    targetMin: "30min",
    predictedSpots: 45,
    trend: "DECREASING",
    trendText: "🟠 มีแนวโน้มที่จอดลดลง",
    trendBadgeClass: "trend-down",
    reason: "เริ่มมีนักศึกษาทยอยเข้าคาบเรียนภาคบ่ายที่อาคารเรียนรวม 1 และ 3"
  },

  P10: {
    parkingId: "P10",
    parkingName: "ลานจอดรถศูนย์เครื่องมือวิทยาศาสตร์และเทคโนโลยี",
    currentAvailable: 24,
    totalSpots: 70,
    predictions: {
      "10min": 23,
      "20min": 22,
      "30min": 21,
      "60min": 19
    },
    targetMin: "30min",
    predictedSpots: 21,
    trend: "DECREASING",
    trendText: "🟠 มีแนวโน้มที่จอดลดลง",
    trendBadgeClass: "trend-down",
    reason: "มีการอบรมและการทำวิจัยในช่วงบ่ายที่ศูนย์เครื่องมือวิทยาศาสตร์ฯ"
  }
};
