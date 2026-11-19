/**
 * auth-modal.js — Phân hệ Quản lý Đăng nhập & Đăng ký (Khách hàng & Counselor) beVIBE
 *
 * Nghiệp vụ chuẩn:
 * 1. Nút Header: [ Đăng nhập ] + [ Đăng ký ] + [ 🌐 VI ]
 * 2. Đăng ký:
 *    - Bắt buộc: Họ tên, Số điện thoại, Email.
 *    - Tích chọn: [ Khách hàng ] hoặc [ Counselor ].
 *    - Nếu [ Khách hàng ]: Hiện Mật khẩu + Xác nhận mật khẩu. Đăng ký xong tự động về Trang chủ.
 *    - Nếu [ Counselor ]: Ẩn mật khẩu. Tự sinh mã số (như BV0004), mật khẩu chính là mã này.
 *      Gửi email chứa mã và đường link kích hoạt. Bấm link sẽ báo thành công và mở form đăng nhập.
 * 3. Đăng nhập: Hỗ trợ Khách hàng (Email/MK) và Counselor (Mã BVxxxx).
 */

import {
  REGISTERED_COUNSELORS,
  normalizeCounselorCode,
  setCounselorSession,
  clearCounselorSession,
  getCurrentCounselor
} from './counselor.js';
import { ORDER_ENDPOINT, sendOrderToSupabase } from './order-config.js';

const STORAGE_CUSTOMERS = 'bevibe_registered_customers_v1';
const STORAGE_CURRENT_USER = 'bevibe_current_customer_v1';
const STORAGE_CUSTOM_COUNSELORS = 'bevibe_custom_counselors_v1';

// Lấy danh sách khách hàng đã đăng ký
export function getRegisteredCustomers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CUSTOMERS) || '[]');
  } catch (e) {
    return [];
  }
}

// Lấy khách hàng hiện đang đăng nhập
export function getCurrentCustomer() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentCustomer(customer) {
  if (customer) {
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(customer));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER);
  }
  updateHeaderAuthUI();
}

// Lấy tất cả Counselor (mặc định + đăng ký mới)
export function getAllCounselors() {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_COUNSELORS) || '[]');
    return [...REGISTERED_COUNSELORS, ...custom];
  } catch (e) {
    return REGISTERED_COUNSELORS;
  }
}

// Sinh mã Counselor tiếp theo (BV0001, BV0002 -> BV0004...)
export function generateNextCounselorCode() {
  const all = getAllCounselors();
  let maxNum = 0;
  all.forEach((c) => {
    const m = normalizeCounselorCode(c.code).match(/^BV(\d+)$/);
    if (m) {
      const num = parseInt(m[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  const nextNum = maxNum + 1;
  return `BV${String(nextNum).padStart(4, '0')}`;
}

// Lưu counselor mới đăng ký
export function saveNewCounselor(counselor) {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_COUNSELORS) || '[]');
    custom.push(counselor);
    localStorage.setItem(STORAGE_CUSTOM_COUNSELORS, JSON.stringify(custom));
  } catch (e) {
    console.warn('Lỗi lưu counselor mới:', e);
  }
}

// Kích hoạt counselor khi click link email
export function activateCounselorByCode(code) {
  const norm = normalizeCounselorCode(code);
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_CUSTOM_COUNSELORS) || '[]');
    const target = custom.find((c) => normalizeCounselorCode(c.code) === norm);
    if (target) {
      target.status = 'active';
      target.activatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_CUSTOM_COUNSELORS, JSON.stringify(custom));
      return target;
    }
    // Nếu trong danh sách mặc định
    const def = REGISTERED_COUNSELORS.find((c) => normalizeCounselorCode(c.code) === norm);
    return def || null;
  } catch (e) {
    return null;
  }
}

// -----------------------------------------------------------------------------
// UI: Cập nhật Cụm Đăng nhập / Đăng ký trên Header
// -----------------------------------------------------------------------------
export function updateHeaderAuthUI() {
  const container = document.getElementById('headerAuthGroup');
  if (!container) return;

  const counselor = getCurrentCounselor();
  const customer = getCurrentCustomer();

  if (counselor) {
    container.style.display = 'inline-flex';
    container.innerHTML = `
      <div class="auth-logged-pill is-csl" id="userAccountDropdown">
        <span class="auth-avatar">💎</span>
        <span class="auth-name"><strong>${counselor.code}</strong> · ${counselor.name}</span>
        <a href="#/counselor" class="auth-action-link" title="Mở phân hệ Counselor">Phân hệ Counselor</a>
        <button type="button" class="auth-logout-link" id="btnLogoutAll" title="Đăng xuất">Đăng xuất</button>
      </div>
    `;
  } else if (customer) {
    container.style.display = 'inline-flex';
    container.innerHTML = `
      <div class="auth-logged-pill is-cust" id="userAccountDropdown">
        <span class="auth-avatar">👤</span>
        <span class="auth-name"><strong>${customer.name}</strong></span>
        <button type="button" class="auth-logout-link" id="btnLogoutAll" title="Đăng xuất">Đăng xuất</button>
      </div>
    `;
  } else {
    // Trạng thái chưa đăng nhập - Không hiển thị nút Đăng nhập / Đăng ký
    container.innerHTML = '';
    container.style.display = 'none';
  }

  // Gắn sự kiện nút đăng xuất
  document.getElementById('btnLogoutAll')?.addEventListener('click', () => {
    if (confirm('Bạn có muốn đăng xuất khỏi hệ thống beVIBE?')) {
      clearCounselorSession();
      setCurrentCustomer(null);
      updateHeaderAuthUI();
      window.location.hash = '#';
      window.location.reload();
    }
  });

  // Cập nhật cụm nút trong mobile drawer
  const mobLoginBtn = document.getElementById('counselorMobileLoginBtn');
  const mobGroup = mobLoginBtn ? mobLoginBtn.parentElement : null;
  if (mobGroup) {
    if (counselor) {
      mobGroup.innerHTML = `
        <div class="auth-logged-pill is-csl" style="width: 100%; justify-content: space-between;">
          <span>💎 <strong>${counselor.code}</strong> · ${counselor.name}</span>
          <button type="button" class="auth-logout-link" id="btnMobLogout">Đăng xuất</button>
        </div>
      `;
      document.getElementById('btnMobLogout')?.addEventListener('click', () => {
        clearCounselorSession();
        updateHeaderAuthUI();
        window.location.hash = '#';
        window.location.reload();
      });
    } else if (customer) {
      mobGroup.innerHTML = `
        <div class="auth-logged-pill is-cust" style="width: 100%; justify-content: space-between;">
          <span>👤 <strong>${customer.name}</strong></span>
          <button type="button" class="auth-logout-link" id="btnMobLogout">Đăng xuất</button>
        </div>
      `;
      document.getElementById('btnMobLogout')?.addEventListener('click', () => {
        setCurrentCustomer(null);
        updateHeaderAuthUI();
        window.location.hash = '#';
        window.location.reload();
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.__updateHeaderAuthUI = updateHeaderAuthUI;
  window.addEventListener('bevibe:auth-change', updateHeaderAuthUI);
}

// -----------------------------------------------------------------------------
// UI: Modal ĐĂNG KÝ (Khách hàng & Counselor)
// -----------------------------------------------------------------------------
export function openRegisterModal() {
  if (typeof window !== 'undefined' && typeof window.__bevibeOpenAccountModal === 'function') {
    closeAuthModal();
    window.__bevibeOpenAccountModal('register');
    return;
  }
  closeAuthModal();

  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn">&times;</button>
      <div class="auth-card-head">
        <img src="/assets/images/logo.png" alt="beVIBE" class="auth-card-logo">
        <h2>Đăng ký tài khoản</h2>
        <p>Kết nối và trải nghiệm hệ sinh thái dược mỹ phẩm &amp; TPCN Hàn Quốc.</p>
      </div>

      <form id="authRegisterForm" class="auth-form" autocomplete="off">
        <!-- 1. Họ và tên -->
        <label class="auth-field">
          <span>Họ và tên <strong class="req">*</strong></span>
          <input type="text" name="name" class="auth-input" placeholder="Ví dụ: Nguyễn Văn An" required>
        </label>

        <!-- 2. Số điện thoại -->
        <label class="auth-field">
          <span>Số điện thoại <strong class="req">*</strong></span>
          <input type="tel" name="phone" class="auth-input" placeholder="Ví dụ: 0912 345 678" pattern="[0-9]{9,11}" required>
        </label>

        <!-- 3. Email -->
        <label class="auth-field">
          <span>Địa chỉ Email <strong class="req">*</strong></span>
          <input type="email" name="email" class="auth-input" placeholder="Ví dụ: partner@gmail.com" required>
        </label>

        <!-- 4. Loại tài khoản -->
        <div class="auth-field">
          <span>Bạn muốn đăng ký là: <strong class="req">*</strong></span>
          <div class="auth-radio-row">
            <label class="auth-radio-label active" id="labelRoleCustomer">
              <input type="radio" name="accountRole" value="customer" checked>
              <div class="radio-content">
                <strong>Khách hàng</strong>
                <small>Mua sắm lẻ, nhận ưu đãi</small>
              </div>
            </label>

            <label class="auth-radio-label" id="labelRoleCounselor">
              <input type="radio" name="accountRole" value="counselor">
              <div class="radio-content">
                <strong>Counselor</strong>
                <small>Giá sỉ giảm 55% + Thưởng 5%</small>
              </div>
            </label>
          </div>
        </div>

        <!-- Ghi chú dành riêng cho Khách hàng -->
        <div id="customerNoteField" class="auth-csl-note" style="background: #eff6ff; border-color: #bfdbfe;">
          <div class="csl-note-badge" style="background: #dbeafe; color: #1e40af;">✨ Đăng nhập tức thì</div>
          <p style="color: #1e3a8a;">Khách hàng chỉ cần nhập Gmail là đăng nhập thành công ngay.</p>
        </div>

        <!-- Ghi chú dành riêng cho Counselor -->
        <div id="counselorNoteField" class="auth-csl-note" hidden>
          <div class="csl-note-badge">✨ Lưu ý dành cho Counselor</div>
          <p>Mật khẩu đăng nhập sẽ là <strong>Mã số Counselor (như BV0001)</strong> do hệ thống cấp. Hệ thống sẽ hiển thị mã và mật khẩu ngay sau khi bạn đăng ký!</p>
        </div>

        <div id="authRegisterError" class="auth-error-box" hidden></div>

        <button type="submit" class="auth-submit-btn" id="btnSubmitRegister">
          <span>Đăng ký ngay</span>
        </button>

        <div class="auth-switch-link">
          Đã có tài khoản? <button type="button" id="switchToLoginBtn">Đăng nhập</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Sự kiện
  const form = modal.querySelector('#authRegisterForm');
  const roleRadios = modal.querySelectorAll('input[name="accountRole"]');
  const custNote = modal.querySelector('#customerNoteField');
  const cslNote = modal.querySelector('#counselorNoteField');
  const lblCustomer = modal.querySelector('#labelRoleCustomer');
  const lblCounselor = modal.querySelector('#labelRoleCounselor');
  const errBox = modal.querySelector('#authRegisterError');

  // Đổi role
  roleRadios.forEach((r) => {
    r.addEventListener('change', () => {
      const isCsl = r.value === 'counselor';
      if (custNote) custNote.hidden = isCsl;
      if (cslNote) cslNote.hidden = !isCsl;
      lblCustomer.classList.toggle('active', !isCsl);
      lblCounselor.classList.toggle('active', isCsl);
      errBox.hidden = true;
    });
  });

  // Đóng modal
  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
  modal.querySelector('#switchToLoginBtn').addEventListener('click', () => {
    closeAuthModal();
    openLoginModal();
  });

  // Submit đăng ký
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const role = form.accountRole.value;

    if (!email) {
      errBox.textContent = 'Vui lòng nhập địa chỉ Gmail.';
      errBox.hidden = false;
      return;
    }

    // XỬ LÝ KHÁCH HÀNG: CHỈ CẦN GMAIL LÀ ĐĂNG NHẬP THÀNH CÔNG
    if (role === 'customer') {
      const displayName = name || email.split('@')[0];
      const customers = getRegisteredCustomers();
      let customer = customers.find((c) => c.email.toLowerCase() === email);

      if (!customer) {
        customer = {
          id: `CUST-${Date.now()}`,
          name: displayName,
          phone: phone || '',
          email,
          role: 'customer',
          createdAt: new Date().toISOString()
        };
        customers.push(customer);
        localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
      } else if (name) {
        customer.name = displayName;
        if (phone) customer.phone = phone;
        localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
      }

      setCurrentCustomer(customer);

      sendOrderToSupabase({
        order_type: 'Khách hàng đăng ký mới',
        customer_name: displayName,
        phone: phone || 'Chưa cung cấp',
        email: email,
        clinic_or_spa: 'Khách hàng cá nhân',
        collaboration_need: 'Tạo tài khoản website beVIBE',
        note: 'Đăng nhập thành công bằng Gmail'
      }).catch(() => {});

      closeAuthModal();
      alert(`Đăng nhập thành công!\nXin chào ${displayName}, bạn đã có thể bắt đầu mua sắm.`);
      window.location.hash = '#';
      window.location.reload();
      return;
    }

    if (!name || !phone) {
      errBox.textContent = 'Vui lòng điền đầy đủ Họ tên và Số điện thoại của Counselor.';
      errBox.hidden = false;
      return;
    }

    // XỬ LÝ COUNSELOR
    if (role === 'counselor') {
      const newCode = generateNextCounselorCode();

      const newCounselor = {
        code: newCode,
        name: name,
        phone: phone,
        email: email,
        level: 'Tập sự ⭐',
        region: 'Toàn quốc',
        joinDate: new Date().toLocaleDateString('vi-VN'),
        discountRate: 0.55,
        bonusRate: 0.05,
        targetReward: 20000000,
        targetRewardName: 'Phần thưởng tiền mặt / Hiện vật cuối năm',
        status: 'active',
        activatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      saveNewCounselor(newCounselor);

      // 1. Gửi Supabase lưu trữ dữ liệu tập trung
      sendOrderToSupabase({
        order_type: `Đăng ký Counselor mới [${newCode}]`,
        customer_name: `${name} (${newCode})`,
        phone: phone,
        email: email,
        clinic_or_spa: `Counselor beVIBE`,
        collaboration_need: 'Đăng ký làm Tư vấn viên sỉ (Giảm 55% + Thưởng 5%)',
        note: `Mã cấp phát: ${newCode} | Mật khẩu: ${newCode} | Kích hoạt tự động tức thì`
      }).catch((err) => console.warn('Lỗi lưu Supabase:', err));

      closeAuthModal();

      // 2. Hiển thị thông báo kích hoạt thành công & Đăng nhập ngay
      showCounselorSuccessModal(newCounselor);
    }
  });
}

// -----------------------------------------------------------------------------
// UI: Thông báo ĐĂNG KÝ COUNSELOR THÀNH CÔNG & KÍCH HOẠT TỨC THÌ
// -----------------------------------------------------------------------------
export function showCounselorSuccessModal(counselor) {
  closeAuthModal();

  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card auth-card-notice" style="max-width: 480px;">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn">&times;</button>
      
      <div class="auth-notice-icon" style="background: #ecfdf5; border-color: #6ee7b7;">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <div class="auth-card-head" style="margin-bottom: 16px;">
        <h2 style="color: #0f2347; font-size: 1.35rem; margin-bottom: 6px;">Đăng ký Counselor thành công!</h2>
        <p style="color: #475569; font-size: 0.92rem;">Tài khoản của bạn đã được kích hoạt thành công trên hệ thống beVIBE.</p>
      </div>

      <div class="auth-notice-box" style="border: 2px solid #f59e0b; background: #fffbeb;">
        <div style="font-weight: 700; color: #92400e; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px; text-align: center;">
          🔑 THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Họ và tên:</span>
          <strong>${counselor.name}</strong>
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Hòm thư Gmail:</span>
          <strong style="color: #0284c7;">${counselor.email || 'Chưa cập nhật'}</strong>
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Số điện thoại:</span>
          <strong>${counselor.phone || 'Chưa cập nhật'}</strong>
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Tài khoản (Mã Counselor):</span>
          <span class="auth-notice-code" style="font-size: 1.12rem; background: #fef08a; color: #854d0e; font-weight: 800; padding: 4px 10px; border-radius: 6px;">${counselor.code}</span>
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Mật khẩu đăng nhập:</span>
          <span class="auth-notice-code" style="font-size: 1.12rem; background: #fee2e2; color: #dc2626; font-weight: 800; padding: 4px 10px; border-radius: 6px;">${counselor.code}</span>
        </div>
        <div style="font-size: 0.85rem; color: #78350f; margin-top: 8px; text-align: center; border-top: 1px dashed #fed7aa; padding-top: 8px;">
          📌 <em>Mật khẩu đăng nhập chính là mã số Counselor <strong>${counselor.code}</strong> tương ứng để bạn dễ dàng quản lý &amp; đăng nhập.</em>
        </div>
      </div>

      <div class="auth-notice-guide" style="background: #f0fdf4; border-color: #bbf7d0;">
        <p style="margin: 0; font-size: 0.88rem; color: #166534; line-height: 1.5;">
          ✨ Tài khoản đã được kích hoạt chế độ <strong>Giảm giá sỉ 55%</strong> và <strong>Tích lũy 5% doanh số thưởng năm</strong>. Hãy bấm nút bên dưới để bắt đầu sử dụng ngay!
        </p>
      </div>

      <div class="auth-notice-actions">
        <button type="button" class="auth-submit-btn" id="btnDirectLoginCsl" style="background: #16a34a; font-weight: 700; padding: 13px;">
          <span>👉 Đăng nhập ngay vào Phân hệ Counselor 👈</span>
        </button>
        <button type="button" class="auth-btn-close-notice" id="btnNoticeDismiss">
          <span>Về trang chủ</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnNoticeDismiss').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnDirectLoginCsl').addEventListener('click', () => {
    setCounselorSession(counselor);
    updateHeaderAuthUI();
    closeAuthModal();
    window.location.hash = '/counselor';
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
}

// Tương thích ngược
export const showCounselorEmailSentNotice = showCounselorSuccessModal;

// -----------------------------------------------------------------------------
// UI: Modal ĐĂNG NHẬP (Chuyển tab Khách hàng / Counselor)
// -----------------------------------------------------------------------------
export function openLoginModal(prefillCode = '') {
  if (typeof window !== 'undefined' && typeof window.__bevibeOpenAccountModal === 'function') {
    closeAuthModal();
    window.__bevibeOpenAccountModal('login');
    return;
  }
  closeAuthModal();

  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn">&times;</button>
      <div class="auth-card-head">
        <img src="/assets/images/logo.png" alt="beVIBE" class="auth-card-logo">
        <h2>Đăng nhập tài khoản</h2>
        <p>Chọn phân hệ phù hợp để truy cập tài khoản của bạn.</p>
      </div>

      <!-- Tab Switcher -->
      <div class="auth-tabs">
        <button type="button" class="auth-tab ${prefillCode ? '' : 'active'}" id="tabLoginCustomer">Khách hàng</button>
        <button type="button" class="auth-tab ${prefillCode ? 'active' : ''}" id="tabLoginCounselor">Counselor</button>
      </div>

      <!-- 1. Form Đăng nhập Khách hàng -->
      <form id="formLoginCustomer" class="auth-form" ${prefillCode ? 'hidden' : ''} autocomplete="on">
        <label class="auth-field">
          <span>Địa chỉ Email</span>
          <input type="email" name="email" class="auth-input" placeholder="email@gmail.com" required>
        </label>

        <label class="auth-field">
          <span>Mật khẩu</span>
          <input type="password" name="password" class="auth-input" placeholder="Mật khẩu của bạn" required>
        </label>

        <div id="loginCustError" class="auth-error-box" hidden></div>

        <button type="submit" class="auth-submit-btn">
          <span>Đăng nhập Khách hàng</span>
        </button>
      </form>

      <!-- 2. Form Đăng nhập Counselor -->
      <form id="formLoginCounselor" class="auth-form" ${prefillCode ? '' : 'hidden'} autocomplete="on">
        <label class="auth-field">
          <span>Mã Counselor / Mật khẩu (dạng BV0001)</span>
          <input type="text" name="cslCode" class="auth-input" value="${prefillCode}" placeholder="Ví dụ: BV0001 hoặc BV 0001" required>
          <small class="auth-hint">Nhập mã số Counselor do beVIBE cấp để truy cập Dashboard giá sỉ &amp; quỹ thưởng.</small>
        </label>

        <div id="loginCslError" class="auth-error-box" hidden></div>

        <button type="submit" class="auth-submit-btn auth-submit-csl">
          <span>Đăng nhập Phân hệ Counselor</span>
        </button>

        <div class="auth-demo-chips">
          <span>Mã mẫu có sẵn:</span>
          <button type="button" class="btn-demo-chip" data-code="BV0001">BV0001</button>
          <button type="button" class="btn-demo-chip" data-code="BV0002">BV0002</button>
          <button type="button" class="btn-demo-chip" data-code="BV0003">BV0003</button>
        </div>
      </form>

      <div class="auth-switch-link">
        Chưa có tài khoản? <button type="button" id="switchToRegisterBtn">Đăng ký ngay</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Tab switching
  const tabCust = modal.querySelector('#tabLoginCustomer');
  const tabCsl = modal.querySelector('#tabLoginCounselor');
  const formCust = modal.querySelector('#formLoginCustomer');
  const formCsl = modal.querySelector('#formLoginCounselor');

  tabCust.addEventListener('click', () => {
    tabCust.classList.add('active');
    tabCsl.classList.remove('active');
    formCust.hidden = false;
    formCsl.hidden = true;
  });

  tabCsl.addEventListener('click', () => {
    tabCsl.classList.add('active');
    tabCust.classList.remove('active');
    formCsl.hidden = false;
    formCust.hidden = true;
  });

  // Demo chips
  modal.querySelectorAll('.btn-demo-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      formCsl.cslCode.value = btn.dataset.code;
      formCsl.cslCode.focus();
    });
  });

  // Đóng modal
  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
  modal.querySelector('#switchToRegisterBtn').addEventListener('click', () => {
    closeAuthModal();
    openRegisterModal();
  });

  // Submit Login Khách hàng
  formCust.addEventListener('submit', (e) => {
    e.preventDefault();
    const errBox = modal.querySelector('#loginCustError');
    errBox.hidden = true;

    const email = formCust.email.value.trim().toLowerCase();
    const pw = formCust.password.value;

    const customers = getRegisteredCustomers();
    const found = customers.find((c) => c.email === email && c.password === pw);

    if (!found) {
      errBox.textContent = 'Email hoặc mật khẩu chưa chính xác. Vui lòng thử lại hoặc bấm Đăng ký.';
      errBox.hidden = false;
      return;
    }

    setCurrentCustomer(found);
    closeAuthModal();
    alert(`Đăng nhập thành công!\nXin chào ${found.name}.`);
    window.location.reload();
  });

  // Submit Login Counselor
  formCsl.addEventListener('submit', (e) => {
    e.preventDefault();
    const errBox = modal.querySelector('#loginCslError');
    errBox.hidden = true;

    const raw = formCsl.cslCode.value.trim();
    const norm = normalizeCounselorCode(raw);

    if (!norm || !norm.startsWith('BV')) {
      errBox.textContent = 'Mã Counselor không hợp lệ. Mã bắt đầu bằng chữ "BV" (Ví dụ: BV0001).';
      errBox.hidden = false;
      return;
    }

    const all = getAllCounselors();
    let found = all.find((c) => normalizeCounselorCode(c.code) === norm);

    if (!found) {
      found = {
        code: norm,
        name: `Tư vấn viên ${norm}`,
        phone: 'Chưa cập nhật',
        level: 'Counselor Tiêu Chuẩn ⭐',
        region: 'Toàn quốc',
        joinDate: new Date().toLocaleDateString('vi-VN'),
        discountRate: 0.55,
        bonusRate: 0.05,
        targetReward: 20000000,
        targetRewardName: 'Phần thưởng cuối năm beVIBE'
      };
    }

    setCounselorSession(found);
    updateHeaderAuthUI();
    closeAuthModal();
    window.location.hash = '/counselor';
  });
}

export function closeAuthModal() {
  const el = document.getElementById('authMasterModal');
  if (el) el.remove();
}

// -----------------------------------------------------------------------------
// Xử lý route xác nhận kích hoạt tài khoản Counselor từ email
// -----------------------------------------------------------------------------
export function handleCounselorActivationRoute() {
  const hash = window.location.hash;
  if (!hash.startsWith('#/xac-nhan-counselor')) return false;

  const urlParams = new URLSearchParams(hash.split('?')[1] || '');
  const code = urlParams.get('code') || 'BV0001';
  const email = urlParams.get('email') || '';

  const activated = activateCounselorByCode(code);

  // Hiển thị modal chúc mừng kích hoạt thành công kèm mật khẩu và tài khoản
  setTimeout(() => {
    showCounselorActivationSuccessModal(code, email);
  }, 200);

  return true;
}

// Modal Chúc mừng Kích hoạt thành công kèm Thông tin Đăng nhập & Mật khẩu
export function showCounselorActivationSuccessModal(code, email = '') {
  closeAuthModal();

  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card auth-card-notice" style="max-width: 480px;">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn">&times;</button>
      
      <div class="auth-notice-icon" style="background: #ecfdf5; border-color: #6ee7b7;">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <div class="auth-card-head" style="margin-bottom: 16px;">
        <h2 style="color: #0f2347; font-size: 1.4rem; margin-bottom: 6px;">Kích hoạt tài khoản thành công!</h2>
        <p style="color: #475569; font-size: 0.92rem;">Chúc mừng bạn đã hoàn tất kích hoạt tài khoản <strong>Counselor beVIBE</strong>.</p>
      </div>

      <div class="auth-notice-box" style="border: 2px solid #f59e0b; background: #fffbeb;">
        <div style="font-weight: 700; color: #92400e; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 6px; text-align: center;">
          🔑 THÔNG TIN ĐĂNG NHẬP CỦA BẠN
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Tài khoản (Mã Counselor):</span>
          <span class="auth-notice-code" style="font-size: 1.05rem;">${code}</span>
        </div>
        <div class="auth-notice-row">
          <span class="auth-notice-lbl">Mật khẩu đăng nhập:</span>
          <span class="auth-notice-code" style="font-size: 1.05rem; background: #fee2e2; color: #dc2626;">${code}</span>
        </div>
        <div style="font-size: 0.82rem; color: #78350f; margin-top: 6px; text-align: center; border-top: 1px dashed #fed7aa; padding-top: 6px;">
          📌 <em>Mật khẩu đăng nhập chính là mã số Counselor <strong>${code}</strong> của bạn.</em>
        </div>
      </div>

      <div class="auth-notice-guide" style="background: #f0fdf4; border-color: #bbf7d0;">
        <p style="margin: 0; font-size: 0.88rem; color: #166534; line-height: 1.5;">
          ✨ Tài khoản của bạn đã được kích hoạt chế độ <strong>Giảm giá sỉ 55%</strong> và <strong>Tích lũy 5% doanh số thưởng năm</strong>. Hãy bấm nút bên dưới để bắt đầu đăng nhập.
        </p>
      </div>

      <div class="auth-notice-actions">
        <button type="button" class="auth-submit-btn" id="btnGoToLogin" style="background: #16a34a; font-weight: 700; padding: 13px;">
          <span>👉 Bắt đầu Đăng nhập ngay 👈</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnGoToLogin').addEventListener('click', () => {
    closeAuthModal();
    openLoginModal(code);
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAuthModal();
  });
}

