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
    reason: "คาดว่าจะมีนักศึกษาเรียนเสร็จทยอยออกจากอาคารไทยบุรี"
  },

  P02: {
    parkingId: "P02",
    parkingName: "ลานจอดรถอาคารเรียนรวม",
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
    reason: "ใกล้หมดคาบเรียนรอบเช้า จะมีรถทยอยออกจากลานจอด"
  },

  P03: {
    parkingId: "P03",
    parkingName: "ลานจอดรถศูนย์บรรณสารและสื่อการศึกษา",
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
    reason: "มีผู้เข้าใช้บริการหอสมุดเพิ่มขึ้นในช่วงบ่าย"
  },

  P04: {
    parkingId: "P04",
    parkingName: "ลานจอดรถโรงพยาบาลมหาวิทยาลัยวลัยลักษณ์",
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
    parkingName: "ลานจอดรถศูนย์กีฬา",
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
    reason: "ปริมาณการจราจรบริเวณศูนย์กีฬาค่อนข้างสม่ำเสมอ"
  },

  P06: {
    parkingId: "P06",
    parkingName: "ลานจอดรถหอประชุมใหญ่",
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
    reason: "การประชุมรอบเช้าเสร็จสิ้น ผู้เข้าร่วมเริ่มเดินทางออก"
  },

  P07: {
    parkingId: "P07",
    parkingName: "ลานจอดรถสำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี",
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
    reason: "นักศึกษาเริ่มทยอยเข้าเข้าคลาสปฏิบัติการแล็บวิศวกรรม"
  },

  P08: {
    parkingId: "P08",
    parkingName: "ลานจอดรถสำนักวิชาสารสนเทศศาสตร์",
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
  }
};
