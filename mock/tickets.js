/**
 * Mock Tickets Seed Data — จอดตรงไหน @ Walailak University
 */
window.MOCK_TICKETS_SEED = [
  {
    id: "TKT-0001",
    userId: "user-001",
    userName: "User001",
    userEmail: "user@example.com",
    subject: "ไม่สามารถเข้าสู่ระบบได้",
    description: "กรอกรหัสผ่านแล้ว Login ไม่ได้ ระบบแจ้งเตือนข้อมูลไม่ถูกต้อง",
    category: "Account Issue",
    priority: "High",
    status: "OPEN",
    createdAt: "2026-09-22T10:00:00.000Z",
    replies: []
  },
  {
    id: "TKT-0002",
    userId: "user-001",
    userName: "User001",
    userEmail: "user@example.com",
    subject: "หน้าเว็บแสดงผลผิด",
    description: "ข้อมูลในหน้า Dashboard แสดงไม่ครบถ้วน ลานจอดบางแห่งไม่โหลดข้อมูล",
    category: "Technical Issue",
    priority: "Medium",
    status: "IN_PROGRESS",
    createdAt: "2026-09-22T11:00:00.000Z",
    replies: [
      {
        id: "reply-101",
        senderId: "admin-001",
        senderName: "Admin",
        message: "ทีมงานรับเรื่องแล้วครับ กำลังดำเนินการตรวจสอบระบบแสดงผลให้อยู่นะครับ",
        createdAt: "2026-09-22T11:30:00.000Z"
      }
    ]
  }
];
