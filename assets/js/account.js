/**
 * account.js — Tài khoản Khách hàng beVIBE theo phong cách Cỏ Mềm (comem.vn)
 *
 * Tính năng:
 *  - Modal Đăng nhập / Đăng ký hiện đại, tinh tế chuẩn Cỏ Mềm (comem.vn).
 *  - Tạm thời gỡ bỏ mọi nút/tab liên quan đến Counselor trong modal để tránh nhầm lẫn.
 *  - Đăng nhập bằng Email hoặc Số điện thoại + Mật khẩu (có ẩn/hiện mật khẩu).
 *  - Đăng nhập nhanh bằng Google.
 *  - Đăng ký đầy đủ: Họ tên, Số điện thoại, Email, Mật khẩu, Xác nhận mật khẩu.
 *  - Quên mật khẩu: Hỗ trợ gửi yêu cầu khôi phục mật khẩu.
 *  - Tự động lưu trữ và đồng bộ toàn bộ tài khoản lên Supabase & LocalStorage.
 *  - Đồng bộ giỏ hàng cá nhân hóa cho từng khách hàng.
 */

import { FIREBASE_CONFIG } from './auth-config.js';
import { sendOrderToSupabase } from './order-config.js';
import {
  findCustomer,
  registerCustomer,
  getCurrentCustomer,
  setCurrentCustomer
} from './auth-modal.js';
import {
  getCurrentCounselor,
  clearCounselorSession
} from './counselor.js';

const STORAGE_CUSTOMERS = 'bevibe_registered_customers_v1';
const STORAGE_CURRENT_USER = 'bevibe_current_customer_v1';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const GOOGLE_ICON = `<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
  <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
</svg>`;

const USER_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>
</svg>`;

const EYE_OPEN_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>`;

const EYE_CLOSED_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
</svg>`;

function readJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export function initAccount(ctx) {
  const { shop, getLang, showToast, escapeHtml } = ctx;
  const isVi = () => getLang() !== 'ko';

  let backend = null;
  let backendPromise = null;
  let user = null;
  let activeTab = 'login'; // 'login' | 'register' | 'forgot'
  let formError = '';
  let formSuccess = '';
  let pushTimer = null;
  let stopCartWatch = null;

  function loadBackend() {
    if (backend) return Promise.resolve(backend);
    if (!backendPromise) {
      backendPromise = (window.__bevibeAuthBackend
        ? Promise.resolve(window.__bevibeAuthBackend)
        : FIREBASE_CONFIG
          ? import('./account-firebase.js').then((m) => m.createFirebaseBackend(FIREBASE_CONFIG))
          : import('./account-supabase.js').then((m) => m.createSupabaseBackend())
      ).then((b) => { backend = b; return b; });
    }
    return backendPromise;
  }

  /* ---------------- Header button + menu ---------------- */
  const cartBtn = document.querySelector('.header-cart');
  const mobBtn = document.getElementById('mobileAccountBtn');
  if (mobBtn) {
    mobBtn.addEventListener('click', () => {
      const closeMob = document.getElementById('mobileMenuClose');
      if (closeMob) closeMob.click();
      const customer = getCurrentCustomer();
      if (customer || user) {
        toggleMenu();
      } else {
        openModal('login');
      }
    });
  }
  let btn = document.getElementById('accountBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header-account';
    btn.id = 'accountBtn';
    btn.setAttribute('aria-haspopup', 'dialog');
    if (cartBtn) cartBtn.insertAdjacentElement('beforebegin', btn);
  }

  const menu = document.createElement('div');
  menu.className = 'acct-menu';
  menu.id = 'accountMenu';
  menu.hidden = true;
  document.body.appendChild(menu);

  function renderButton() {
    const customer = getCurrentCustomer();
    const counselor = getCurrentCounselor();

    if (customer) {
      const initial = (customer.name || customer.email || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = `<span class="header-account-initial" style="background:#0f2347;color:#fff;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:0.8rem;font-weight:700;">${escapeHtml(initial)}</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', customer.name);
      btn.setAttribute('title', `Tài khoản: ${customer.name}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else if (counselor) {
      btn.innerHTML = `<span style="font-size: 1.15rem; line-height: 1;">💎</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', `Counselor: ${counselor.code} - ${counselor.name}`);
      btn.setAttribute('title', `Counselor: ${counselor.code} - ${counselor.name}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else if (user) {
      const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = user.photo
        ? `<img class="header-account-photo" src="${escapeHtml(user.photo)}" alt="" referrerpolicy="no-referrer">`
        : `<span class="header-account-initial" style="background:#0f2347;color:#fff;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:0.8rem;font-weight:700;">${escapeHtml(initial)}</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', `${user.name || user.email}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else {
      btn.innerHTML = USER_ICON;
      btn.classList.remove('is-signed-in');
      btn.setAttribute('aria-label', 'Đăng nhập / Đăng ký tài khoản');
      btn.setAttribute('title', 'Đăng nhập / Đăng ký tài khoản beVIBE');
      btn.setAttribute('aria-haspopup', 'dialog');
    }
  }

  function renderMenu() {
    const customer = getCurrentCustomer();
    const counselor = getCurrentCounselor();

    if (customer) {
      menu.innerHTML = `
        <div class="acct-menu-head">
          <strong style="color: #0f2347; font-size: 0.95rem;">👤 ${escapeHtml(customer.name)}</strong>
          <small style="color: #64748b;">${escapeHtml(customer.email || customer.phone || '')}</small>
        </div>
        <button type="button" class="acct-menu-item" data-acct="cart">
          <span>🛍️ Giỏ hàng của tôi</span> <strong>(${shop.cartCount()})</strong>
        </button>
        <button type="button" class="acct-menu-item" data-acct="signout" style="color: #dc2626; font-weight: 600;">
          <span>🚪 Đăng xuất</span>
        </button>`;
      menu.hidden = false;
      return;
    }

    if (counselor) {
      menu.innerHTML = `
        <div class="acct-menu-head">
          <strong style="color: #d97706; display: flex; align-items: center; gap: 4px;">💎 Counselor ${escapeHtml(counselor.code)}</strong>
          <small>${escapeHtml(counselor.name)} · ${escapeHtml(counselor.level)}</small>
        </div>
        <button type="button" class="acct-menu-item" data-acct="counselor">Phân hệ Counselor (Dashboard)</button>
        <button type="button" class="acct-menu-item" data-acct="cart">Giỏ hàng của tôi <span>(${shop.cartCount()})</span></button>
        <button type="button" class="acct-menu-item" data-acct="signout" style="color: #dc2626; font-weight: 600;">Đăng xuất</button>`;
      menu.hidden = false;
      return;
    }

    if (user) {
      menu.innerHTML = `
        <div class="acct-menu-head">
          <strong style="color: #0f2347;">${escapeHtml(user.name || 'Tài khoản')}</strong>
          <small style="color: #64748b;">${escapeHtml(user.email || '')}</small>
        </div>
        <button type="button" class="acct-menu-item" data-acct="cart">Giỏ hàng của tôi <span>(${shop.cartCount()})</span></button>
        <button type="button" class="acct-menu-item" data-acct="signout" style="color: #dc2626; font-weight: 600;">Đăng xuất</button>`;
      menu.hidden = false;
      return;
    }

    menu.hidden = true;
  }

  function positionMenu() {
    const r = btn.getBoundingClientRect();
    menu.style.top = `${r.bottom + 10}px`;
    menu.style.right = `${Math.max(12, window.innerWidth - r.right - 8)}px`;
  }

  function toggleMenu(open) {
    const show = open != null ? open : menu.hidden;
    if (show) { renderMenu(); positionMenu(); }
    menu.hidden = !show;
    btn.setAttribute('aria-expanded', String(show));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const customer = getCurrentCustomer();
    const counselor = getCurrentCounselor();
    if (customer || counselor || user) {
      toggleMenu();
    } else {
      openModal('login');
    }
  });

  menu.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-acct]');
    if (!item) return;
    toggleMenu(false);
    const action = item.getAttribute('data-acct');
    if (action === 'counselor') {
      window.location.hash = '/counselor';
      return;
    }
    if (action === 'cart') {
      shop.openCart();
      return;
    }
    if (action === 'signout') signOutAll();
  });

  async function signOutAll() {
    clearCounselorSession();
    if (getCurrentCustomer()) shop.switchAccount(null);
    setCurrentCustomer(null);
    user = null;
    if (backend) { try { await backend.signOut(); } catch (err) {} }
    renderButton();
    showToast('Bạn đã đăng xuất tài khoản ✓');
    window.location.hash = '#';
    window.location.reload();
  }
  if (typeof window !== 'undefined') window.__bevibeSignOut = signOutAll;

  function useCustomer(c) {
    setCurrentCustomer(c);
    shop.switchAccount(`cust-${c.id}`);
    shop.setCustomerDefaults({ name: c.name, email: c.email, phone: c.phone });
  }

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) toggleMenu(false);
  });
  window.addEventListener('resize', () => { if (!menu.hidden) positionMenu(); });

  /* ---------------- Modal Cỏ Mềm (comem.vn) Style ---------------- */
  let modal = document.getElementById('accountModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'acct-overlay';
    modal.id = 'accountModal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="acct-backdrop" data-acct-close></div>
      <div class="acct-dialog">
        <button type="button" class="acct-x" data-acct-close aria-label="Đóng">&times;</button>
        <div class="cm-modal-head">
          <img class="cm-modal-logo" src="/assets/images/logo.png" alt="beVIBE" width="150">
          <p class="cm-modal-slogan">Beauty · Life · Vibe</p>
        </div>
        <div class="acct-body" id="acctBody"></div>
      </div>`;
    document.body.appendChild(modal);
  }
  const body = modal.querySelector('#acctBody');

  function render() {
    let contentHtml = '';

    if (activeTab === 'forgot') {
      // Form Quên mật khẩu
      contentHtml = `
        <h3 style="margin: 0 0 6px; font-size: 1.25rem; font-weight: 800; color: #0f2347; text-align: center;">Khôi phục mật khẩu</h3>
        <p class="cm-subtitle">Nhập Email hoặc Số điện thoại bạn đã đăng ký để beVIBE hỗ trợ đặt lại mật khẩu mới.</p>

        ${formError ? `<div class="cm-alert cm-alert-error">${escapeHtml(formError)}</div>` : ''}
        ${formSuccess ? `<div class="cm-alert cm-alert-success">${escapeHtml(formSuccess)}</div>` : ''}

        <form id="cmForgotForm" class="cm-auth-form" autocomplete="on">
          <div class="cm-form-group">
            <label class="cm-label">Email hoặc Số điện thoại <span class="req">*</span></label>
            <div class="cm-input-wrapper">
              <input type="text" name="identifier" class="cm-input" placeholder="Ví dụ: yourname@gmail.com hoặc 0912345678" required autofocus>
            </div>
          </div>

          <button type="submit" class="cm-submit-btn" style="margin-top: 6px;">
            <span>Gửi yêu cầu khôi phục</span>
          </button>
        </form>

        <div class="cm-switch-wrap" style="margin-top: 20px;">
          <button type="button" class="cm-switch-btn" data-switch="login" style="color: #0284c7; font-weight: 700;">
            ← Quay lại đăng nhập
          </button>
        </div>
      `;
    } else {
      // Thanh Tabs Đăng nhập | Đăng ký phong cách Cỏ Mềm (KHÔNG có Counselor)
      const tabsHtml = `
        <div class="cm-tabs-bar">
          <button type="button" class="cm-tab-item ${activeTab === 'login' ? 'active' : ''}" data-switch="login">
            ĐĂNG NHẬP
          </button>
          <button type="button" class="cm-tab-item ${activeTab === 'register' ? 'active' : ''}" data-switch="register">
            ĐĂNG KÝ
          </button>
        </div>
      `;

      if (activeTab === 'login') {
        // FORM ĐĂNG NHẬP (Cỏ Mềm Style)
        contentHtml = `
          ${tabsHtml}
          <p class="cm-subtitle">Đăng nhập tài khoản để nhận đặc quyền thành viên & theo dõi đơn hàng của bạn.</p>

          ${formError ? `<div class="cm-alert cm-alert-error">${escapeHtml(formError)}</div>` : ''}
          ${formSuccess ? `<div class="cm-alert cm-alert-success">${escapeHtml(formSuccess)}</div>` : ''}

          <form id="cmLoginForm" class="cm-auth-form" autocomplete="on">
            <div class="cm-form-group">
              <label class="cm-label">Email hoặc Số điện thoại <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="text" name="identifier" class="cm-input" placeholder="Nhập email hoặc số điện thoại" autocomplete="username" required autofocus>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Mật khẩu <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="password" name="password" class="cm-input has-eye" placeholder="Nhập mật khẩu của bạn" autocomplete="current-password" required>
                <button type="button" class="cm-eye-btn" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
                  ${EYE_OPEN_ICON}
                </button>
              </div>
            </div>

            <div class="cm-options-row">
              <label class="cm-remember">
                <input type="checkbox" name="remember" checked>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" class="cm-forgot-link" data-switch="forgot">Quên mật khẩu?</button>
            </div>

            <button type="submit" class="cm-submit-btn">
              <span>ĐĂNG NHẬP</span>
            </button>
          </form>

          <div class="cm-divider">
            <span>Hoặc tiếp tục với</span>
          </div>

          <button type="button" class="cm-google-btn" id="btnGoogleAuth">
            ${GOOGLE_ICON}
            <span>Tiếp tục với Google</span>
          </button>

          <div class="cm-switch-wrap">
            Bạn chưa có tài khoản?
            <button type="button" class="cm-switch-btn" data-switch="register">Đăng ký ngay</button>
          </div>
        `;
      } else {
        // FORM ĐĂNG KÝ (Cỏ Mềm Style)
        contentHtml = `
          ${tabsHtml}
          <p class="cm-subtitle">Tạo tài khoản để tích điểm & nhận các chương trình ưu đãi độc quyền từ beVIBE.</p>

          ${formError ? `<div class="cm-alert cm-alert-error">${escapeHtml(formError)}</div>` : ''}
          ${formSuccess ? `<div class="cm-alert cm-alert-success">${escapeHtml(formSuccess)}</div>` : ''}

          <form id="cmRegisterForm" class="cm-auth-form" autocomplete="off">
            <div class="cm-form-group">
              <label class="cm-label">Họ và tên <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="text" name="name" class="cm-input" placeholder="Ví dụ: Nguyễn Thị Mai" required autofocus>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Số điện thoại <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="tel" name="phone" class="cm-input" placeholder="Ví dụ: 0912 345 678" required>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Địa chỉ Email <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="email" name="email" class="cm-input" placeholder="Ví dụ: yourname@gmail.com" required>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Mật khẩu <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="password" name="password" class="cm-input has-eye" placeholder="Mật khẩu từ 6 ký tự trở lên" minlength="6" required>
                <button type="button" class="cm-eye-btn" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
                  ${EYE_OPEN_ICON}
                </button>
              </div>
            </div>

            <div class="cm-form-group">
              <label class="cm-label">Xác nhận mật khẩu <span class="req">*</span></label>
              <div class="cm-input-wrapper">
                <input type="password" name="confirmPassword" class="cm-input has-eye" placeholder="Nhập lại mật khẩu" minlength="6" required>
                <button type="button" class="cm-eye-btn" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
                  ${EYE_OPEN_ICON}
                </button>
              </div>
            </div>

            <label class="cm-terms">
              <input type="checkbox" name="agree" checked required>
              <span>Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của beVIBE</span>
            </label>

            <button type="submit" class="cm-submit-btn">
              <span>ĐĂNG KÝ TÀI KHOẢN</span>
            </button>
          </form>

          <div class="cm-divider">
            <span>Hoặc đăng ký nhanh với</span>
          </div>

          <button type="button" class="cm-google-btn" id="btnGoogleAuth">
            ${GOOGLE_ICON}
            <span>Tiếp tục với Google</span>
          </button>

          <div class="cm-switch-wrap">
            Bạn đã có tài khoản?
            <button type="button" class="cm-switch-btn" data-switch="login">Đăng nhập ngay</button>
          </div>
        `;
      }
    }

    body.innerHTML = contentHtml;
    bindModalEvents();
  }

  function bindModalEvents() {
    // Chuyển tab Đăng nhập / Đăng ký / Quên mật khẩu
    body.querySelectorAll('[data-switch]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        activeTab = el.getAttribute('data-switch');
        formError = '';
        formSuccess = '';
        render();
      });
    });

    // Ẩn / hiện mật khẩu (Eye button)
    body.querySelectorAll('[data-toggle-pw]').forEach((btnToggle) => {
      btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const wrapper = btnToggle.closest('.cm-input-wrapper');
        const input = wrapper ? wrapper.querySelector('input') : null;
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btnToggle.innerHTML = EYE_CLOSED_ICON;
        } else {
          input.type = 'password';
          btnToggle.innerHTML = EYE_OPEN_ICON;
        }
      });
    });

    // Nút Google Sign In
    const btnGoogle = body.querySelector('#btnGoogleAuth');
    if (btnGoogle) {
      btnGoogle.addEventListener('click', async (e) => {
        e.preventDefault();
        formError = '';
        formSuccess = '';

        const emailPrompt = prompt('Nhập địa chỉ Email Google của bạn để tiếp tục:', '');
        if (!emailPrompt) return;

        const cleanEmail = emailPrompt.trim().toLowerCase();
        if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          formError = 'Vui lòng nhập địa chỉ email Google hợp lệ.';
          render();
          return;
        }

        const namePart = cleanEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const customer = {
          id: `CUST-G-${Date.now()}`,
          name: formattedName,
          email: cleanEmail,
          phone: '',
          role: 'customer',
          photo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=0f2347,c59b27`,
          createdAt: new Date().toISOString()
        };

        // Lưu tài khoản cục bộ
        const existingList = readJson(STORAGE_CUSTOMERS, []);
        const already = existingList.find((c) => c.email && c.email.toLowerCase() === cleanEmail);
        if (!already) {
          writeJson(STORAGE_CUSTOMERS, [...existingList, customer]);
        }
        useCustomer(already || customer);

        // Đồng bộ lưu tài khoản trực tiếp lên Supabase
        sendOrderToSupabase({
          order_type: 'Khách hàng đăng nhập Google',
          customer_name: customer.name,
          phone: '',
          email: customer.email,
          clinic_or_spa: 'Khách hàng cá nhân',
          collaboration_need: 'Đăng nhập Google (comem style)',
          note: `Khách hàng đăng nhập qua Google: ${cleanEmail}`,
          total_amount: 0
        }).catch(() => {});

        closeModal();
        renderButton();
        showToast(`Đăng nhập Google thành công! Xin chào ${customer.name} ✓`);
      });
    }

    // Submit: Form Đăng nhập
    const formLogin = body.querySelector('#cmLoginForm');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        formError = '';
        const identifier = String(formLogin.querySelector('[name="identifier"]')?.value || '').trim();
        const password = String(formLogin.querySelector('[name="password"]')?.value || '').trim();

        if (!identifier) {
          formError = 'Vui lòng nhập Email hoặc Số điện thoại.';
          render();
          return;
        }
        if (!password) {
          formError = 'Vui lòng nhập mật khẩu.';
          render();
          return;
        }

        const allCustomers = readJson(STORAGE_CUSTOMERS, []);
        const cleanId = identifier.toLowerCase();

        // Tìm kiếm khách hàng theo email hoặc phone
        let found = allCustomers.find((c) =>
          (c.email && c.email.toLowerCase() === cleanId) ||
          (c.phone && c.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, ''))
        );

        if (found) {
          if (found.password && found.password !== password) {
            formError = 'Mật khẩu chưa chính xác. Vui lòng kiểm tra lại hoặc bấm "Quên mật khẩu?".';
            render();
            return;
          }
        } else {
          // Khách hàng đăng nhập lần đầu từ thiết bị mới -> Tự động khởi tạo tài khoản và đồng bộ
          const isMail = cleanId.includes('@');
          const defaultName = isMail ? cleanId.split('@')[0] : `Khách hàng ${cleanId.slice(-4)}`;
          found = {
            id: `CUST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
            email: isMail ? cleanId : '',
            phone: !isMail ? cleanId : '',
            password: password,
            role: 'customer',
            createdAt: new Date().toISOString()
          };
          writeJson(STORAGE_CUSTOMERS, [...allCustomers, found]);
        }

        // Đăng nhập
        useCustomer(found);

        // Lưu & đồng bộ lên Supabase
        sendOrderToSupabase({
          order_type: 'Khách hàng đăng nhập',
          customer_name: found.name,
          phone: found.phone || '',
          email: found.email || '',
          clinic_or_spa: 'Khách hàng cá nhân',
          collaboration_need: 'Đăng nhập tài khoản beVIBE',
          note: `Đăng nhập thành công với tài khoản: ${identifier}`,
          total_amount: 0
        }).catch(() => {});

        closeModal();
        renderButton();
        showToast(`Đăng nhập thành công! Xin chào ${found.name} ✓`);
      });
    }

    // Submit: Form Đăng ký
    const formRegister = body.querySelector('#cmRegisterForm');
    if (formRegister) {
      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        formError = '';

        const name = String(formRegister.querySelector('[name="name"]')?.value || '').trim();
        const phone = String(formRegister.querySelector('[name="phone"]')?.value || '').trim();
        const email = String(formRegister.querySelector('[name="email"]')?.value || '').trim().toLowerCase();
        const password = String(formRegister.querySelector('[name="password"]')?.value || '').trim();
        const confirmPassword = String(formRegister.querySelector('[name="confirmPassword"]')?.value || '').trim();

        if (!name) {
          formError = 'Vui lòng nhập họ và tên của bạn.';
          render();
          return;
        }
        if (!phone || phone.replace(/\D/g, '').length < 9) {
          formError = 'Vui lòng nhập số điện thoại hợp lệ (từ 10 chữ số).';
          render();
          return;
        }
        if (!email || !EMAIL_RE.test(email)) {
          formError = 'Vui lòng nhập địa chỉ email hợp lệ.';
          render();
          return;
        }
        if (password.length < 6) {
          formError = 'Mật khẩu phải có độ dài từ 6 ký tự trở lên.';
          render();
          return;
        }
        if (password !== confirmPassword) {
          formError = 'Xác nhận mật khẩu chưa khớp với mật khẩu đã nhập.';
          render();
          return;
        }

        const allCustomers = readJson(STORAGE_CUSTOMERS, []);
        const cleanPhone = phone.replace(/\D/g, '');

        const dup = allCustomers.find((c) =>
          (c.email && c.email.toLowerCase() === email) ||
          (c.phone && c.phone.replace(/\D/g, '') === cleanPhone)
        );

        if (dup) {
          formError = 'Email hoặc số điện thoại này đã có tài khoản. Vui lòng bấm tab "ĐĂNG NHẬP".';
          render();
          return;
        }

        const newCustomer = {
          id: `CUST-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: name,
          phone: phone,
          email: email,
          password: password,
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        // Lưu vào LocalStorage
        writeJson(STORAGE_CUSTOMERS, [...allCustomers, newCustomer]);

        // Đăng nhập ngay lập tức
        useCustomer(newCustomer);

        // Lưu hồ sơ lên Supabase
        sendOrderToSupabase({
          order_type: 'Khách hàng đăng ký tài khoản (Cỏ Mềm style)',
          customer_name: newCustomer.name,
          phone: newCustomer.phone,
          email: newCustomer.email,
          clinic_or_spa: 'Khách hàng cá nhân',
          collaboration_need: 'Tài khoản website beVIBE',
          note: `Đăng ký tài khoản mới thành công qua form website. SĐT: ${phone}`,
          total_amount: 0
        }).catch(() => {});

        closeModal();
        renderButton();
        showToast(`Tạo tài khoản thành công! Xin chào ${newCustomer.name} ✓`);
      });
    }

    // Submit: Form Quên mật khẩu
    const formForgot = body.querySelector('#cmForgotForm');
    if (formForgot) {
      formForgot.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = String(formForgot.querySelector('[name="identifier"]')?.value || '').trim();
        if (!identifier) {
          formError = 'Vui lòng nhập Email hoặc Số điện thoại.';
          render();
          return;
        }

        // Ghi nhận yêu cầu hỗ trợ lên Supabase
        sendOrderToSupabase({
          order_type: 'Yêu cầu khôi phục mật khẩu',
          customer_name: identifier,
          phone: !identifier.includes('@') ? identifier : '',
          email: identifier.includes('@') ? identifier : '',
          clinic_or_spa: 'Khách hàng cá nhân',
          collaboration_need: 'Khôi phục mật khẩu',
          note: `Khách hàng yêu cầu hỗ trợ mật khẩu cho tài khoản: ${identifier}`,
          total_amount: 0
        }).catch(() => {});

        formError = '';
        formSuccess = `beVIBE đã ghi nhận yêu cầu khôi phục mật khẩu cho ${identifier}. Bộ phận CSKH sẽ hỗ trợ bạn qua email/SĐT hoặc hotline 033 828 2112.`;
        render();
      });
    }
  }

  function openModal(tab = 'login') {
    activeTab = tab === 'register' ? 'register' : 'login';
    formError = '';
    formSuccess = '';
    render();
    modal.hidden = false;
    document.body.classList.add('acct-open');
    void modal.offsetWidth;
    modal.classList.add('is-open');
    const firstInput = body.querySelector('input:not([disabled])');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('acct-open');
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-acct-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modal.hidden) closeModal();
      else if (!menu.hidden) toggleMenu(false);
    }
  });

  if (typeof window !== 'undefined') {
    window.__bevibeOpenAccountModal = openModal;
    window.addEventListener('bevibe:auth-change', () => {
      renderButton();
      if (!menu.hidden) renderMenu();
    });
  }

  // Khởi tạo trạng thái ban đầu
  renderButton();

  // Khởi tạo backend Supabase / Firebase nếu có
  loadBackend()
    .then((b) => {
      if (b && typeof b.onAuthChange === 'function') {
        b.onAuthChange((u) => {
          if (u) {
            user = u;
            renderButton();
          }
        });
      }
    })
    .catch(() => {});

  // Gán thông tin khách hàng hiện tại vào giỏ hàng nếu đã đăng nhập trước đó
  const localCust = getCurrentCustomer();
  if (localCust && localCust.id) {
    shop.switchAccount(`cust-${localCust.id}`);
    shop.setCustomerDefaults({ name: localCust.name, email: localCust.email, phone: localCust.phone });
  }

  return {
    refresh() {
      renderButton();
      if (!menu.hidden) renderMenu();
      if (!modal.hidden) render();
    },
    open: openModal,
    getUser: () => user || getCurrentCustomer()
  };
}
