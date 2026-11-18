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
import { sendOrderToSupabase } from './order-config.js';

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
    container.innerHTML = `
      <div class="auth-logged-pill is-csl" id="userAccountDropdown">
        <span class="auth-avatar">💎</span>
        <span class="auth-name"><strong>${counselor.code}</strong> (${counselor.name.split(' ').pop()})</span>
        <a href="#/counselor" class="auth-action-link" title="Mở Dashboard">Dashboard</a>
        <button type="button" class="auth-logout-link" id="btnLogoutAll" title="Đăng xuất">Thoát</button>
      </div>
    `;
  } else if (customer) {
    container.innerHTML = `
      <div class="auth-logged-pill is-cust" id="userAccountDropdown">
        <span class="auth-avatar">👤</span>
        <span class="auth-name">${customer.name}</span>
        <button type="button" class="auth-logout-link" id="btnLogoutAll" title="Đăng xuất">Thoát</button>
      </div>
    `;
  } else {
    // Trạng thái chưa đăng nhập - Giống y chang Ảnh 2
    container.innerHTML = `
      <button type="button" class="btn-auth btn-auth-login" id="btnHeaderLogin">Đăng nhập</button>
      <button type="button" class="btn-auth btn-auth-register" id="btnHeaderRegister">Đăng ký</button>
    `;

    document.getElementById('btnHeaderLogin')?.addEventListener('click', () => openLoginModal());
    document.getElementById('btnHeaderRegister')?.addEventListener('click', () => openRegisterModal());
  }

  // Gắn sự kiện nút đăng xuất
  document.getElementById('btnLogoutAll')?.addEventListener('click', () => {
    if (confirm('Bạn có muốn đăng xuất khỏi hệ thống beVIBE?')) {
      clearCounselorSession();
      setCurrentCustomer(null);
      window.location.hash = '#';
      window.location.reload();
    }
  });
}

// -----------------------------------------------------------------------------
// UI: Modal ĐĂNG KÝ (Khách hàng & Counselor)
// -----------------------------------------------------------------------------
export function openRegisterModal() {
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
                <strong>Counselor (Tư vấn viên)</strong>
                <small>Giá sỉ giảm 55% + Thưởng 5%</small>
              </div>
            </label>
          </div>
        </div>

        <!-- Khối mật khẩu dành riêng cho Khách hàng -->
        <div id="customerPasswordFields" class="auth-pw-block">
          <label class="auth-field">
            <span>Mật khẩu <strong class="req">*</strong></span>
            <input type="password" name="password" class="auth-input" placeholder="Nhập ít nhất 6 ký tự">
          </label>

          <label class="auth-field">
            <span>Xác nhận mật khẩu <strong class="req">*</strong></span>
            <input type="password" name="passwordConfirm" class="auth-input" placeholder="Nhập lại mật khẩu">
          </label>
        </div>

        <!-- Ghi chú dành riêng cho Counselor -->
        <div id="counselorNoteField" class="auth-csl-note" hidden>
          <div class="csl-note-badge">✨ Lưu ý dành cho Counselor</div>
          <p>Mật khẩu sẽ là <strong>Mã số Counselor (như BV0001)</strong> được hệ thống tự động cấp phát và gửi vào Gmail của bạn kèm đường link kích hoạt tài khoản.</p>
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
  const pwBlock = modal.querySelector('#customerPasswordFields');
  const cslNote = modal.querySelector('#counselorNoteField');
  const lblCustomer = modal.querySelector('#labelRoleCustomer');
  const lblCounselor = modal.querySelector('#labelRoleCounselor');
  const errBox = modal.querySelector('#authRegisterError');

  // Đổi role
  roleRadios.forEach((r) => {
    r.addEventListener('change', () => {
      const isCsl = r.value === 'counselor';
      pwBlock.hidden = isCsl;
      cslNote.hidden = !isCsl;
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

    if (!name || !phone || !email) {
      errBox.textContent = 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).';
      errBox.hidden = false;
      return;
    }

    // XỬ LÝ KHÁCH HÀNG
    if (role === 'customer') {
      const pw = form.password.value;
      const pw2 = form.passwordConfirm.value;

      if (!pw || pw.length < 6) {
        errBox.textContent = 'Mật khẩu cần ít nhất 6 ký tự.';
        errBox.hidden = false;
        return;
      }
      if (pw !== pw2) {
        errBox.textContent = 'Xác nhận mật khẩu không trùng khớp.';
        errBox.hidden = false;
        return;
      }

      // Lưu khách hàng
      const customers = getRegisteredCustomers();
      if (customers.some((c) => c.email === email)) {
        errBox.textContent = 'Email này đã được đăng ký tài khoản khách hàng. Vui lòng bấm Đăng nhập.';
        errBox.hidden = false;
        return;
      }

      const newCustomer = {
        id: `CUST-${Date.now()}`,
        name,
        phone,
        email,
        password: pw,
        role: 'customer',
        createdAt: new Date().toISOString()
      };

      customers.push(newCustomer);
      localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
      setCurrentCustomer(newCustomer);

      // Lưu Supabase
      sendOrderToSupabase({
        order_type: 'Khách hàng đăng ký mới',
        customer_name: name,
        phone: phone,
        email: email,
        clinic_or_spa: 'Khách hàng cá nhân',
        collaboration_need: 'Tạo tài khoản website beVIBE',
        note: 'Đăng ký thành công từ website'
      }).catch(() => {});

      closeAuthModal();
      alert(`Đăng ký tài khoản thành công!\nXin chào ${name}, hệ thống sẽ chuyển bạn về Trang chủ.`);
      window.location.hash = '#';
      window.location.reload();
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
        status: 'pending_activation',
        createdAt: new Date().toISOString()
      };

      saveNewCounselor(newCounselor);

      // Gửi Supabase ghi nhận
      sendOrderToSupabase({
        order_type: `Đăng ký Counselor mới [${newCode}]`,
        customer_name: `${name} (${newCode})`,
        phone: phone,
        email: email,
        clinic_or_spa: `Counselor beVIBE`,
        collaboration_need: 'Đăng ký làm Tư vấn viên sỉ',
        note: `Mã cấp phát: ${newCode} | Mật khẩu: ${newCode}`
      }).catch(() => {});

      closeAuthModal();

      // Hiện modal mô phỏng gửi Gmail xác nhận cho Counselor
      showCounselorEmailConfirmationModal(newCounselor);
    }
  });
}

// -----------------------------------------------------------------------------
// UI: Modal Mô phỏng Gửi Gmail cho Counselor kèm Link Kích hoạt
// -----------------------------------------------------------------------------
export function showCounselorEmailConfirmationModal(counselor) {
  closeAuthModal();

  const confirmUrl = `${window.location.origin}${window.location.pathname}#/xac-nhan-counselor?code=${counselor.code}&email=${encodeURIComponent(counselor.email)}`;

  const modal = document.createElement('div');
  modal.id = 'authMasterModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card auth-card-email">
      <button type="button" class="auth-modal-close" id="closeAuthModalBtn">&times;</button>
      <div class="email-sim-badge">✉️ Hộp thư Gmail kích hoạt tài khoản</div>
      
      <div class="email-sim-box">
        <div class="email-sim-header">
          <div><strong>Người gửi:</strong> beVIBE Partner Center &lt;counselor@bevibe.vn&gt;</div>
          <div><strong>Tới:</strong> ${counselor.email}</div>
          <div><strong>Tiêu đề:</strong> [beVIBE] Chúc mừng bạn đã đăng ký Counselor — Mã số &amp; Link xác nhận kích hoạt</div>
        </div>

        <div class="email-sim-body">
          <p>Xin chào <strong>${counselor.name}</strong>,</p>
          <p>Chúc mừng bạn đã gia nhập mạng lưới <strong>Counselor (Tư vấn viên &amp; Đại lý sỉ)</strong> của beVIBE!</p>
          
          <div class="email-sim-keyinfo">
            <div>Mã Counselor của bạn: <strong class="text-gold">${counselor.code}</strong></div>
            <div>Mật khẩu đăng nhập: <strong class="text-gold">${counselor.code}</strong></div>
            <small>(Mật khẩu chính là mã Counselor của bạn để dễ dàng kiểm soát &amp; đăng nhập)</small>
          </div>

          <p>Để hoàn tất đăng ký và bắt đầu được giảm sỉ 55% + tích lũy thưởng 5% cuối năm, vui lòng <strong>bấm vào đường link xác nhận</strong> bên dưới:</p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${confirmUrl}" class="email-confirm-btn" id="btnClickConfirmLink">
              👉 BẤM VÀO ĐÂY ĐỂ XÁC NHẬN KÍCH HOẠT TÀI KHOẢN 👈
            </a>
          </div>

          <p class="email-note">Đường link xác nhận: <br><code style="word-break: break-all;">${confirmUrl}</code></p>
        </div>
      </div>

      <div class="email-sim-footer">
        <p>💡 <em>Bạn có thể bấm ngay vào nút xanh ở trên để trải nghiệm luồng kích hoạt tài khoản thực tế!</em></p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#closeAuthModalBtn').addEventListener('click', closeAuthModal);
  modal.querySelector('#btnClickConfirmLink').addEventListener('click', (e) => {
    closeAuthModal();
  });
}

// -----------------------------------------------------------------------------
// UI: Modal ĐĂNG NHẬP (Chuyển tab Khách hàng / Counselor)
// -----------------------------------------------------------------------------
export function openLoginModal(prefillCode = '') {
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
        <button type="button" class="auth-tab ${prefillCode ? 'active' : ''}" id="tabLoginCounselor">Counselor (Tư vấn viên)</button>
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

  // Hiển thị thông báo thành công
  setTimeout(() => {
    alert(`🎉 KÍCH HOẠT TÀI KHOẢN COUNSELOR THÀNH CÔNG!\n\nMã số Counselor & Mật khẩu của bạn là: ${code}\nHệ thống sẽ mở màn hình đăng nhập để bạn bắt đầu sử dụng.`);
    openLoginModal(code);
  }, 300);

  return true;
}

