/**
 * auth-modal.js — Tài khoản Khách hàng & Counselor beVIBE (lưu trên trình duyệt này)
 *
 * Form Đăng nhập / Đăng ký nằm trong account.js (nút tài khoản trên header).
 * File này giữ phần dữ liệu và kiểm tra dùng chung:
 *  - Khách hàng: đăng ký bằng email (một email = một tài khoản), đăng nhập bằng email đã đăng ký.
 *  - Counselor: mã do hệ thống cấp (BVxxxxxx). Đăng nhập cần ĐÚNG mã + số điện thoại đã đăng ký.
 *    Mã không có trong danh sách sẽ bị từ chối (không tự tạo Counselor mới).
 *
 * Lưu ý: tài khoản đang lưu trên trình duyệt (localStorage), chưa có máy chủ xác thực.
 * Muốn đăng nhập trên nhiều máy và có mật khẩu thật: bật Firebase (auth-config.js, HUONG-DAN-TAI-KHOAN.md).
 */

import {
  REGISTERED_COUNSELORS,
  normalizeCounselorCode,
  getCurrentCounselor
} from './counselor.js';

const STORAGE_CUSTOMERS = 'bevibe_registered_customers_v1';
const STORAGE_CURRENT_USER = 'bevibe_current_customer_v1';
const STORAGE_CUSTOM_COUNSELORS = 'bevibe_custom_counselors_v1';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 0912 345 678 / +84912345678 / 84912345678 → 0912345678
export function normalizePhone(p) {
  const d = String(p || '').replace(/[^\d+]/g, '');
  return /^\+?84\d{9,10}$/.test(d) ? `0${d.replace(/^\+?84/, '')}` : d.replace(/\+/g, '');
}

export function isValidPhone(p) {
  return /^0\d{9,10}$/.test(normalizePhone(p));
}

function readJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
}

/* ==========================================================================
   Khách hàng
   ========================================================================== */
export function getRegisteredCustomers() {
  const list = readJson(STORAGE_CUSTOMERS, []);
  return Array.isArray(list) ? list.filter((c) => c && typeof c.email === 'string') : [];
}

export function findCustomer(email) {
  const e = String(email || '').trim().toLowerCase();
  return getRegisteredCustomers().find((c) => c.email.toLowerCase() === e) || null;
}

/**
 * Tạo tài khoản khách hàng mới. Email đã có tài khoản → báo lỗi (không ghi đè thông tin của người khác).
 * @returns {{ customer?: object, error?: string }}
 */
export function registerCustomer({ name, email, phone }) {
  const mail = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(mail)) return { error: 'Vui lòng nhập địa chỉ email hợp lệ.' };
  if (findCustomer(mail)) return { error: 'Email này đã có tài khoản. Vui lòng chọn "Đăng nhập".' };
  const cleanPhone = phone ? normalizePhone(phone) : '';
  if (cleanPhone && !isValidPhone(cleanPhone)) return { error: 'Số điện thoại chưa đúng định dạng.' };
  const customer = {
    id: `CUST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: String(name || '').trim().slice(0, 80) || mail.split('@')[0],
    email: mail,
    phone: cleanPhone,
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  writeJson(STORAGE_CUSTOMERS, [...getRegisteredCustomers(), customer]);
  return { customer };
}

export function getCurrentCustomer() {
  const c = readJson(STORAGE_CURRENT_USER, null);
  return c && typeof c === 'object' && c.email ? c : null;
}

export function setCurrentCustomer(customer) {
  if (customer) writeJson(STORAGE_CURRENT_USER, customer);
  else {
    try { localStorage.removeItem(STORAGE_CURRENT_USER); } catch (e) { /* ignore */ }
  }
  updateHeaderAuthUI();
}

/* ==========================================================================
   Counselor
   ========================================================================== */
export function getAllCounselors() {
  const custom = readJson(STORAGE_CUSTOM_COUNSELORS, []);
  return [...REGISTERED_COUNSELORS, ...(Array.isArray(custom) ? custom.filter((c) => c && c.code) : [])];
}

export function findCounselor(code) {
  const norm = normalizeCounselorCode(code);
  return norm ? getAllCounselors().find((c) => normalizeCounselorCode(c.code) === norm) || null : null;
}

/**
 * Đăng nhập Counselor: mã phải có trong danh sách và số điện thoại phải khớp với số đã đăng ký.
 * @returns {{ counselor?: object, error?: string }}
 */
export function authenticateCounselor(code, phone) {
  const norm = normalizeCounselorCode(code);
  if (!/^BV\d{4,8}$/.test(norm)) return { error: 'Mã Counselor không hợp lệ (dạng BV kèm số, ví dụ BV0001).' };
  if (!isValidPhone(phone)) return { error: 'Vui lòng nhập số điện thoại đã đăng ký Counselor.' };
  const found = findCounselor(norm);
  // Same message for "unknown code" and "wrong phone": don't reveal which codes exist
  if (!found || normalizePhone(found.phone) !== normalizePhone(phone)) {
    return { error: 'Mã Counselor hoặc số điện thoại chưa đúng. Chưa có mã? Hãy đăng ký Counselor hoặc gọi 033 828 2112.' };
  }
  return { counselor: found };
}

/**
 * Quên mã Counselor: phải khớp CẢ số điện thoại và email đã đăng ký (chỉ số điện thoại thì người khác
 * cũng đoán được, vì đăng nhập dùng mã + số điện thoại).
 * @returns {{ counselor?: object, error?: string, notFound?: boolean }}
 */
export function recoverCounselorCode(phone, email) {
  if (!isValidPhone(phone)) return { error: 'Vui lòng nhập số điện thoại đã đăng ký Counselor.' };
  const mail = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(mail)) return { error: 'Vui lòng nhập email đã đăng ký Counselor.' };
  const p = normalizePhone(phone);
  const found = getAllCounselors().find((c) => normalizePhone(c.phone) === p && String(c.email || '').toLowerCase() === mail);
  return found ? { counselor: found } : { notFound: true };
}

// Mã mới khó đoán và không trùng giữa các máy: BV + 6 chữ số ngẫu nhiên
export function generateNextCounselorCode() {
  for (let i = 0; i < 50; i++) {
    const n = new Uint32Array(1);
    (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(n) : (n[0] = Math.floor(Math.random() * 1e9));
    const code = `BV${String(100000 + (n[0] % 900000))}`;
    if (!findCounselor(code)) return code;
  }
  return `BV${String(Date.now()).slice(-6)}`;
}

/**
 * Đăng ký Counselor mới. Email hoặc số điện thoại đã đăng ký → báo lỗi.
 * @returns {{ counselor?: object, error?: string }}
 */
export function registerCounselor({ name, email, phone }) {
  const mail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || '').trim().slice(0, 80);
  if (!EMAIL_RE.test(mail)) return { error: 'Vui lòng nhập địa chỉ email hợp lệ.' };
  if (!cleanName) return { error: 'Vui lòng nhập họ và tên Counselor.' };
  if (!isValidPhone(phone)) return { error: 'Vui lòng nhập số điện thoại hợp lệ (ví dụ 0912 345 678).' };
  const cleanPhone = normalizePhone(phone);
  const dup = getAllCounselors().find((c) => (c.email && c.email.toLowerCase() === mail) || normalizePhone(c.phone) === cleanPhone);
  if (dup) return { error: 'Email hoặc số điện thoại này đã đăng ký Counselor. Vui lòng đăng nhập bằng mã đã được cấp.' };
  const now = new Date();
  const counselor = {
    code: generateNextCounselorCode(),
    name: cleanName,
    phone: cleanPhone,
    email: mail,
    level: 'Tập sự ⭐',
    region: 'Toàn quốc',
    joinDate: now.toLocaleDateString('vi-VN'),
    discountRate: 0.55,
    bonusRate: 0.05,
    targetReward: 20000000,
    targetRewardName: 'Phần thưởng tiền mặt / Hiện vật cuối năm',
    status: 'active',
    activatedAt: now.toISOString(),
    createdAt: now.toISOString()
  };
  writeJson(STORAGE_CUSTOM_COUNSELORS, [...readJson(STORAGE_CUSTOM_COUNSELORS, []), counselor]);
  return { counselor };
}

/* ==========================================================================
   UI: cụm đăng nhập trên header / mobile drawer
   ========================================================================== */
export function updateHeaderAuthUI() {
  const container = document.getElementById('headerAuthGroup');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }

  const counselor = getCurrentCounselor();
  const customer = getCurrentCustomer();

  const mobLoginBtn = document.getElementById('counselorMobileLoginBtn');
  const mobGroup = mobLoginBtn ? mobLoginBtn.parentElement : null;
  if (mobGroup && (counselor || customer)) {
    mobGroup.innerHTML = counselor
      ? `<div class="auth-logged-pill is-csl" style="width: 100%; justify-content: space-between;">
          <span>💎 <strong>${escapeHtml(counselor.code)}</strong> · ${escapeHtml(counselor.name)}</span>
          <button type="button" class="auth-logout-link" id="btnMobLogout">Đăng xuất</button>
        </div>`
      : `<div class="auth-logged-pill is-cust" style="width: 100%; justify-content: space-between;">
          <span>👤 <strong>${escapeHtml(customer.name)}</strong></span>
          <button type="button" class="auth-logout-link" id="btnMobLogout">Đăng xuất</button>
        </div>`;
    document.getElementById('btnMobLogout')?.addEventListener('click', () => {
      // Same sign-out as the account menu (also clears the customer's cart on this device)
      if (typeof window.__bevibeSignOut === 'function') window.__bevibeSignOut();
    });
  }
}

if (typeof window !== 'undefined') {
  window.__updateHeaderAuthUI = updateHeaderAuthUI;
  window.addEventListener('bevibe:auth-change', updateHeaderAuthUI);
}

/* ==========================================================================
   Mở form Đăng nhập / Đăng ký (form nằm trong account.js)
   ========================================================================== */
export function openRegisterModal() {
  if (typeof window.__bevibeOpenAccountModal === 'function') window.__bevibeOpenAccountModal('register');
}

export function openLoginModal(prefillCode = '') {
  if (typeof window.__bevibeOpenAccountModal === 'function') {
    window.__bevibeOpenAccountModal('login', prefillCode ? { role: 'counselor', code: prefillCode } : {});
  }
}

export function closeAuthModal() {
  const el = document.getElementById('authMasterModal');
  if (el) el.remove();
}

/* ==========================================================================
   Đăng ký Counselor thành công: hiện mã để khách ghi lại
   ========================================================================== */
export function showCounselorSuccessModal(counselor, onLogin) {
  closeAuthModal();
  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card auth-card-notice" style="max-width: 480px;">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn" aria-label="Đóng">&times;</button>
      <div class="auth-card-head" style="margin-bottom: 16px;">
        <h2 style="color: #0f2347; font-size: 1.35rem; margin-bottom: 6px;">Đăng ký Counselor thành công!</h2>
        <p style="color: #475569; font-size: 0.92rem;">Vui lòng ghi lại mã Counselor bên dưới.</p>
      </div>

      <div class="auth-notice-box" style="border: 2px solid #f59e0b; background: #fffbeb;">
        <div class="auth-notice-row"><span class="auth-notice-lbl">Họ và tên:</span><strong>${escapeHtml(counselor.name)}</strong></div>
        <div class="auth-notice-row"><span class="auth-notice-lbl">Email:</span><strong>${escapeHtml(counselor.email)}</strong></div>
        <div class="auth-notice-row"><span class="auth-notice-lbl">Số điện thoại:</span><strong>${escapeHtml(counselor.phone)}</strong></div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Mã Counselor:</span>
          <span class="auth-notice-code" style="font-size: 1.12rem; background: #fef08a; color: #854d0e; font-weight: 800; padding: 4px 10px; border-radius: 6px;">${escapeHtml(counselor.code)}</span>
        </div>
        <div style="font-size: 0.85rem; color: #78350f; margin-top: 8px; text-align: center; border-top: 1px dashed #fed7aa; padding-top: 8px;">
          Lần sau đăng nhập bằng <strong>mã Counselor</strong> + <strong>số điện thoại đã đăng ký</strong>.
        </div>
      </div>

      <div class="auth-notice-guide" style="background: #f0fdf4; border-color: #bbf7d0;">
        <p style="margin: 0; font-size: 0.88rem; color: #166534; line-height: 1.5;">
          Đơn sỉ của Counselor được beVIBE xác nhận trước khi giao. Nhân viên sẽ liên hệ qua số điện thoại bạn đã đăng ký.
        </p>
      </div>

      <div class="auth-notice-actions">
        <button type="button" class="auth-submit-btn" id="btnDirectLoginCsl" style="background: #16a34a; font-weight: 700; padding: 13px;">
          <span>Vào Phân hệ Counselor</span>
        </button>
        <button type="button" class="auth-btn-close-notice" id="btnNoticeDismiss"><span>Về trang chủ</span></button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnNoticeDismiss').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnDirectLoginCsl').addEventListener('click', () => {
    closeAuthModal();
    if (onLogin) onLogin(counselor);
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAuthModal(); });
}

/* ==========================================================================
   Link cũ #/xac-nhan-counselor?code=BVxxxx: mở form đăng nhập Counselor với mã điền sẵn.
   Không hiện mật khẩu, không đưa nội dung trên link vào trang.
   ========================================================================== */
export function handleCounselorActivationRoute() {
  const hash = window.location.hash;
  if (!hash.startsWith('#/xac-nhan-counselor')) return false;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const norm = normalizeCounselorCode(params.get('code'));
  const code = /^BV\d{4,8}$/.test(norm) ? norm : '';
  window.location.hash = '#/';
  setTimeout(() => openLoginModal(code), 200);
  return true;
}
