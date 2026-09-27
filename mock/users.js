/**
 * Mock Users Seed Data — จอดตรงไหน @ Walailak University
 */
window.MOCK_USERS_SEED = [
  {
    id: "user-001",
    email: "user@example.com",
    password: "user123",
    name: "User001",
    role: "USER"
  },
  {
    id: "admin-001",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin",
    role: "ADMIN"
  },
  {
    id: "usr_student_001",
    email: "student@wu.ac.th",
    password: "123456",
    name: "สุระนาท สุวรรณรัตน์",
    role: "student",
    studentId: "68100536",
    faculty: "สำนักวิชาสารสนเทศศาสตร์",
    phone: "089-111-2222",
    createdAt: "2024-06-01T00:00:00.000Z",
    schedule: [
      { day: 1, startHour: 8,  startMin: 0,  endHour: 10, endMin: 0,  building: "อาคารไทยบุรี (ศูนย์บริการการศึกษา)",          buildingId: "B_THAIBURI" },
      { day: 1, startHour: 13, startMin: 0,  endHour: 16, endMin: 0,  building: "อาคารเรียนรวม 5 (RC5)",                       buildingId: "B_COMMON5" },
      { day: 2, startHour: 9,  startMin: 0,  endHour: 12, endMin: 0,  building: "อาคารศาสตราจารย์ ดร.สมบัติฯ (ST / โกโกวา)",   buildingId: "B_ST" },
      { day: 2, startHour: 14, startMin: 0,  endHour: 17, endMin: 0,  building: "ศูนย์บรรณสารและสื่อการศึกษา (CLM - หอสมุดกลาง)", buildingId: "B_LIBRARY" },
      { day: 3, startHour: 8,  startMin: 0,  endHour: 11, endMin: 0,  building: "อาคารวิชาการ 4 (สำนักวิชาวิศวกรรมศาสตร์ฯ)",    buildingId: "B_ACAD4" },
      { day: 3, startHour: 13, startMin: 0,  endHour: 15, endMin: 0,  building: "อาคารเรียนรวม 7 (RC7)",                       buildingId: "B_COMMON7" },
      { day: 4, startHour: 10, startMin: 0,  endHour: 12, endMin: 0,  building: "อาคารเรียนรวม 1 (RC1)",                       buildingId: "B_COMMON1" },
      { day: 4, startHour: 14, startMin: 0,  endHour: 16, endMin: 0,  building: "อาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)",      buildingId: "B_ACAD5" },
      { day: 5, startHour: 9,  startMin: 0,  endHour: 11, endMin: 0,  building: "อาคารเรียนรวม 3 (RC3)",                       buildingId: "B_COMMON3" },
      { day: 5, startHour: 13, startMin: 0,  endHour: 17, endMin: 0,  building: "อาคารศูนย์กีฬาและสุขภาพ",                     buildingId: "B_SPORTS" },
    ]
  },
  {
    id: "usr_staff_001",
    email: "staff@wu.ac.th",
    password: "123456",
    name: "ดร.สมศรี มั่นคง",
    role: "staff",
    department: "ศูนย์บรรณสารและสื่อการศึกษา (CLM)",
    officeBuilding: "ศูนย์บรรณสารและสื่อการศึกษา (CLM)",
    officeBuildingId: "B_LIBRARY",
    phone: "075-000-001",
    position: "นักวิชาการศึกษา",
    createdAt: "2023-01-10T00:00:00.000Z"
  },
  {
    id: "usr_guest_001",
    email: "guest@gmail.com",
    password: "123456",
    name: "วิชัย ท่องเที่ยว",
    role: "guest",
    phone: "098-888-9999",
    createdAt: "2026-07-01T00:00:00.000Z"
  }
];
