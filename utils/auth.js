/**
 * Mock Authentication Service — จอดตรงไหน @ Walailak University
 *
 * Manages user sessions via localStorage.
 * Designed to be swapped with a real API (fetch/axios) in the future
 * by replacing the async methods below without touching UI code.
 */

const STORAGE_USERS_KEY      = 'parking_app_users';
const STORAGE_CURRENT_USER   = 'parking_app_current_user';
const STORAGE_LOGGED_IN_KEY  = 'parking_app_is_logged_in';

// ---------------------------------------------------------------------------
// MOCK USER SEED DATA
// ---------------------------------------------------------------------------
const MOCK_USERS = [
  // ── 0. DEMO ACCOUNTS ────────────────────────────────────────────────────
  {
    id: "user-001",
    email: "user@example.com",
    password: "user123",
    name: "User001",
    role: "USER",
    createdAt: "2026-09-22T08:00:00.000Z"
  },
  {
    id: "admin-001",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin",
    role: "ADMIN",
    createdAt: "2026-09-22T08:00:00.000Z"
  },

  // ── 1. นักศึกษา ────────────────────────────────────────────────────────
  {
    id: 'usr_student_001',
    role: 'student',
    name: 'สุระนาท สุวรรณรัตน์',
    email: 'student@wu.ac.th',
    password: '123456',
    studentId: '68100536',
    faculty: 'สำนักวิชาสารสนเทศศาสตร์',
    phone: '089-111-2222',
    createdAt: '2024-06-01T00:00:00.000Z',
    // ตารางเรียนประจำสัปดาห์ (day: 0=Sun 1=Mon ... 6=Sat) ตามอาคารจริง ม.วลัยลักษณ์
    schedule: [
      { day: 1, startHour: 8,  startMin: 0,  endHour: 10, endMin: 0,  building: 'อาคารไทยบุรี (ศูนย์บริการการศึกษา)',          buildingId: 'B_THAIBURI' },
      { day: 1, startHour: 13, startMin: 0,  endHour: 16, endMin: 0,  building: 'อาคารเรียนรวม 5 (RC5)',                       buildingId: 'B_COMMON5' },
      { day: 2, startHour: 9,  startMin: 0,  endHour: 12, endMin: 0,  building: 'อาคารศาสตราจารย์ ดร.สมบัติฯ (ST / โกโกวา)',   buildingId: 'B_ST' },
      { day: 2, startHour: 14, startMin: 0,  endHour: 17, endMin: 0,  building: 'ศูนย์บรรณสารและสื่อการศึกษา (CLM - หอสมุดกลาง)', buildingId: 'B_LIBRARY' },
      { day: 3, startHour: 8,  startMin: 0,  endHour: 11, endMin: 0,  building: 'อาคารวิชาการ 4 (สำนักวิชาวิศวกรรมศาสตร์ฯ)',    buildingId: 'B_ACAD4' },
      { day: 3, startHour: 13, startMin: 0,  endHour: 15, endMin: 0,  building: 'อาคารเรียนรวม 7 (RC7)',                       buildingId: 'B_COMMON7' },
      { day: 4, startHour: 10, startMin: 0,  endHour: 12, endMin: 0,  building: 'อาคารเรียนรวม 1 (RC1)',                       buildingId: 'B_COMMON1' },
      { day: 4, startHour: 14, startMin: 0,  endHour: 16, endMin: 0,  building: 'อาคารวิชาการ 5 (สำนักวิชาสารสนเทศศาสตร์)',      buildingId: 'B_ACAD5' },
      { day: 5, startHour: 9,  startMin: 0,  endHour: 11, endMin: 0,  building: 'อาคารเรียนรวม 3 (RC3)',                       buildingId: 'B_COMMON3' },
      { day: 5, startHour: 13, startMin: 0,  endHour: 17, endMin: 0,  building: 'อาคารศูนย์กีฬาและสุขภาพ',                     buildingId: 'B_SPORTS' },
    ]
  },

  // ── 2. บุคลากร / อาจารย์ ────────────────────────────────────────────────
  {
    id: 'usr_staff_001',
    role: 'staff',
    name: 'ดร.สมศรี มั่นคง',
    email: 'staff@wu.ac.th',
    password: '123456',
    department: 'ศูนย์บรรณสารและสื่อการศึกษา (CLM)',
    officeBuilding: 'ศูนย์บรรณสารและสื่อการศึกษา (CLM)',
    officeBuildingId: 'B_LIBRARY',
    phone: '075-000-001',
    position: 'นักวิชาการศึกษา',
    createdAt: '2023-01-10T00:00:00.000Z',
  },

  // ── 3. บุคคลภายนอก ──────────────────────────────────────────────────────
  {
    id: 'usr_guest_001',
    role: 'guest',
    name: 'วิชัย ท่องเที่ยว',
    email: 'guest@gmail.com',
    password: '123456',
    phone: '098-888-9999',
    createdAt: '2026-07-01T00:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// AuthService Class
// ---------------------------------------------------------------------------
class AuthService {
  constructor() {
    this._init();
  }

  /** Seed default users if localStorage is empty or version updated */
  _init() {
    const AUTH_VERSION_KEY = 'parking_app_auth_version';
    const CURRENT_AUTH_VER = 'v2_wu_real_buildings';
    const savedVer = localStorage.getItem(AUTH_VERSION_KEY);

    if (!localStorage.getItem(STORAGE_USERS_KEY) || savedVer !== CURRENT_AUTH_VER) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(MOCK_USERS));
      localStorage.setItem(AUTH_VERSION_KEY, CURRENT_AUTH_VER);

      // Automatically refresh current user session with updated building and schedule data
      const curr = this.getCurrentUser();
      if (curr) {
        const updated = MOCK_USERS.find(u => u.email === curr.email);
        if (updated) {
          const sessionUser = { ...updated };
          delete sessionUser.password;
          localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(sessionUser));
        }
      }
    } else {
      // Ensure mock accounts always exist (re-seed missing ones)
      const stored = this._getUsers();
      let updated = false;
      MOCK_USERS.forEach(mockUser => {
        if (!stored.find(u => u.email === mockUser.email)) {
          stored.push(mockUser);
          updated = true;
        }
      });
      if (updated) localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(stored));
    }
  }

  _getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
    } catch { return []; }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  isValidPassword(password) {
    return typeof password === 'string' && password.trim().length >= 6;
  }

  /**
   * Login — returns Promise for future API compatibility
   */
  async login(email, password) {
    await new Promise(r => setTimeout(r, 600));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass  = (password || '').trim();

    if (!cleanEmail || !cleanPass)          return { success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
    if (!this.isValidEmail(cleanEmail))     return { success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
    if (!this.isValidPassword(cleanPass))   return { success: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };

    const users = this._getUsers();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
    if (!found) return { success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };

    const sessionUser = { ...found };
    delete sessionUser.password;

    localStorage.setItem(STORAGE_LOGGED_IN_KEY, 'true');
    localStorage.setItem(STORAGE_CURRENT_USER,  JSON.stringify(sessionUser));

    return { success: true, message: 'เข้าสู่ระบบสำเร็จ!', user: sessionUser };
  }

  /**
   * Register a new account (for general registration flow)
   */
  async register({ name, email, password, confirmPassword }) {
    await new Promise(r => setTimeout(r, 500));

    const cleanName  = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass  = (password || '').trim();
    const cleanCon   = (confirmPassword || '').trim();

    if (!cleanName || !cleanEmail || !cleanPass || !cleanCon)
      return { success: false, message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' };
    if (!this.isValidEmail(cleanEmail))
      return { success: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
    if (!this.isValidPassword(cleanPass))
      return { success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' };
    if (cleanPass !== cleanCon)
      return { success: false, message: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน' };

    const users = this._getUsers();
    if (users.find(u => u.email.toLowerCase() === cleanEmail))
      return { success: false, message: 'อีเมลนี้ถูกลงทะเบียนในระบบแล้ว' };

    const newUser = {
      id: 'usr_' + Date.now(),
      role: 'guest',
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      phone: '',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    return { success: true, message: 'ลงทะเบียนสำเร็จ! กำลังนำคุณไปหน้าเข้าสู่ระบบ...', user: newUser };
  }

  /** Logout and clear session */
  async logout() {
    await new Promise(r => setTimeout(r, 200));
    localStorage.setItem(STORAGE_LOGGED_IN_KEY, 'false');
    localStorage.removeItem(STORAGE_CURRENT_USER);
    return { success: true };
  }

  isAuthenticated() {
    return (
      localStorage.getItem(STORAGE_LOGGED_IN_KEY) === 'true' &&
      !!localStorage.getItem(STORAGE_CURRENT_USER)
    );
  }

  getCurrentUser() {
    if (!this.isAuthenticated()) return null;
    try { return JSON.parse(localStorage.getItem(STORAGE_CURRENT_USER)); }
    catch { return null; }
  }

  async updateProfile(data) {
    await new Promise(r => setTimeout(r, 400));
    const current = this.getCurrentUser();
    if (!current) return { success: false, message: 'กรุณาเข้าสู่ระบบก่อน' };

    const users    = this._getUsers();
    const idx      = users.findIndex(u => u.id === current.id);
    if (idx === -1) return { success: false, message: 'ไม่พบข้อมูลผู้ใช้' };

    users[idx] = { ...users[idx], ...data };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    const updated = { ...users[idx] };
    delete updated.password;
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(updated));

    return { success: true, message: 'อัปเดตข้อมูลส่วนตัวสำเร็จ', user: updated };
  }
}

window.authService = new AuthService();
