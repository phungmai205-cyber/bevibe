/**
 * account.js — Tài khoản Khách hàng beVIBE theo chuẩn giao diện Cỏ Mềm (comem.vn)
 *
 * Mặc định: Hiển thị form Đăng nhập trước (giống 100% ảnh Cỏ Mềm người dùng cung cấp).
 * Khi chưa có tài khoản: bấm "Vui lòng đăng ký Tài khoản mới tại đây" để mở form Đăng ký.
 * Bấm "Lấy lại mật khẩu" để mở form khôi phục mật khẩu.
 * Tạm thời bỏ toàn bộ phân hệ Counselor để tránh nhầm lẫn cho khách mua hàng.
 * Tự động đồng bộ và lưu trữ tài khoản khách hàng trên Supabase & LocalStorage.
 */

import { FIREBASE_CONFIG } from './auth-config.js';
import { sendOrderToSupabase } from './order-config.js';
import {
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

const GOOGLE_ICON = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
  <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
</svg>`;

const FB_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
  const { shop, showToast, escapeHtml } = ctx;

  let backend = null;
  let backendPromise = null;
  let user = null;
  let currentView = 'login'; // 'login' | 'register' | 'forgot'
  let formError = '';
  let formSuccess = '';

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
  let btn = document.getElementById('accountBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'header-account';
    btn.id = 'accountBtn';
    btn.setAttribute('aria-haspopup', 'dialog');
    if (cartBtn) cartBtn.insertAdjacentElement('beforebegin', btn);
  }

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
        <div class="acct-body" id="acctBody"></div>
      </div>`;
    document.body.appendChild(modal);
  }
  const body = modal.querySelector('#acctBody');

  function render() {
    let contentHtml = '';

    if (currentView === 'register') {
      // ================= VIEW: ĐĂNG KÝ (khi bấm "tại đây") =================
      contentHtml = `
        <h2 class="cm-auth-title">Đăng ký</h2>
        <p class="cm-auth-notice">Tạo tài khoản thành viên để lưu trữ giỏ hàng, nhận ưu đãi độc quyền và đặt hàng nhanh hơn tại beVIBE.</p>

        ${formError ? `<div class="cm-auth-alert-err">${escapeHtml(formError)}</div>` : ''}
        ${formSuccess ? `<div class="cm-auth-alert-ok">${escapeHtml(formSuccess)}</div>` : ''}

        <form id="cmRegisterForm" class="cm-auth-form" autocomplete="off">
          <div class="cm-auth-input-group">
            <input type="text" name="name" class="cm-auth-input" placeholder="Họ và tên của bạn" required autofocus>
          </div>

          <div class="cm-auth-input-group">
            <input type="tel" name="phone" class="cm-auth-input" placeholder="Số điện thoại nhận hàng" required>
          </div>

          <div class="cm-auth-input-group">
            <input type="email" name="email" class="cm-auth-input" placeholder="Email của bạn" required>
          </div>

          <div class="cm-auth-input-group cm-auth-pw-wrap">
            <input type="password" name="password" class="cm-auth-input has-eye" placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" minlength="6" required>
            <button type="button" class="cm-auth-pw-toggle" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
              ${EYE_OPEN_ICON}
            </button>
          </div>

          <div class="cm-auth-input-group cm-auth-pw-wrap">
            <input type="password" name="confirmPassword" class="cm-auth-input has-eye" placeholder="Xác nhận mật khẩu" minlength="6" required>
            <button type="button" class="cm-auth-pw-toggle" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
              ${EYE_OPEN_ICON}
            </button>
          </div>

          <div class="cm-auth-options" style="margin-bottom: 16px;">
            <label class="cm-auth-remember">
              <input type="checkbox" name="remember" checked>
              <span>Lưu trạng thái đăng nhập 60 ngày</span>
            </label>
          </div>

          <button type="submit" class="cm-btn-submit-main">
            Đăng ký
          </button>
        </form>

        <div class="cm-auth-divider">
          <span>Hoặc</span>
        </div>

        <button type="button" class="cm-btn-google-social" id="btnGoogleAuth" style="margin-bottom: 10px;">
          ${GOOGLE_ICON}
          <span>Đăng nhập với Google</span>
        </button>

        <button type="button" class="cm-btn-facebook" id="btnFacebookAuth">
          ${FB_ICON}
          <span>Đăng nhập với facebook</span>
        </button>

        <div class="cm-auth-footer-text">
          Bạn đã có Tài khoản? Vui lòng Đăng nhập <button type="button" class="cm-auth-link-here" data-view="login">tại đây</button>
        </div>
      `;
    } else if (currentView === 'forgot') {
      // ================= VIEW: LẤY LẠI MẬT KHẨU =================
      contentHtml = `
        <h2 class="cm-auth-title">Lấy lại mật khẩu</h2>
        <p class="cm-auth-notice">Vui lòng nhập Email hoặc Số điện thoại bạn đã dùng khi đăng ký. beVIBE sẽ hỗ trợ bạn đặt lại mật khẩu mới.</p>

        ${formError ? `<div class="cm-auth-alert-err">${escapeHtml(formError)}</div>` : ''}
        ${formSuccess ? `<div class="cm-auth-alert-ok">${escapeHtml(formSuccess)}</div>` : ''}

        <form id="cmForgotForm" class="cm-auth-form" autocomplete="on">
          <div class="cm-auth-input-group">
            <input type="text" name="identifier" class="cm-auth-input" placeholder="Email hoặc số điện thoại của bạn" required autofocus>
          </div>

          <button type="submit" class="cm-btn-submit-main" style="margin-top: 6px;">
            Gửi yêu cầu lấy lại mật khẩu
          </button>
        </form>

        <div class="cm-auth-footer-text" style="margin-top: 24px;">
          Quay lại Đăng nhập <button type="button" class="cm-auth-link-here" data-view="login">tại đây</button>
        </div>
      `;
    } else {
      // ================= VIEW MẶC ĐỊNH: ĐĂNG NHẬP (GIỐNG 100% ẢNH COMEM.VN) =================
      contentHtml = `
        <h2 class="cm-auth-title">Đăng nhập</h2>
        <p class="cm-auth-notice">Vui lòng đăng nhập để lưu trữ giỏ hàng, nhận ưu đãi độc quyền và theo dõi đơn hàng của bạn.</p>

        ${formError ? `<div class="cm-auth-alert-err">${escapeHtml(formError)}</div>` : ''}
        ${formSuccess ? `<div class="cm-auth-alert-ok">${escapeHtml(formSuccess)}</div>` : ''}

        <form id="cmLoginForm" class="cm-auth-form" autocomplete="on">
          <div class="cm-auth-input-group">
            <input type="text" name="identifier" class="cm-auth-input" placeholder="Email của bạn" autocomplete="username" required autofocus>
          </div>

          <div class="cm-auth-input-group cm-auth-pw-wrap">
            <input type="password" name="password" class="cm-auth-input has-eye" placeholder="Nhập mật khẩu" autocomplete="current-password" required>
            <button type="button" class="cm-auth-pw-toggle" data-toggle-pw aria-label="Hiện/ẩn mật khẩu">
              ${EYE_OPEN_ICON}
            </button>
          </div>

          <div class="cm-auth-options">
            <label class="cm-auth-remember">
              <input type="checkbox" name="remember" checked>
              <span>Lưu trạng thái đăng nhập 60 ngày</span>
            </label>
            <button type="button" class="cm-auth-forgot" data-view="forgot">Lấy lại mật khẩu</button>
          </div>

          <button type="submit" class="cm-btn-submit-main">
            Đăng nhập
          </button>
        </form>

        <div class="cm-auth-divider">
          <span>Hoặc</span>
        </div>

        <button type="button" class="cm-btn-google-social" id="btnGoogleAuth" style="margin-bottom: 10px;">
          ${GOOGLE_ICON}
          <span>Đăng nhập với Google</span>
        </button>

        <button type="button" class="cm-btn-facebook" id="btnFacebookAuth">
          ${FB_ICON}
          <span>Đăng nhập với facebook</span>
        </button>

        <div class="cm-auth-footer-text">
          Bạn chưa có Tài khoản? Vui lòng đăng ký Tài khoản mới <button type="button" class="cm-auth-link-here" data-view="register">tại đây</button>
        </div>
      `;
    }

    body.innerHTML = contentHtml;
    bindModalEvents();
  }

  function bindModalEvents() {
    // Chuyển view qua các nút "tại đây", "Lấy lại mật khẩu"
    body.querySelectorAll('[data-view]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        currentView = el.getAttribute('data-view');
        formError = '';
        formSuccess = '';
        render();
      });
    });

    // Ẩn / hiện mật khẩu (Eye button)
    body.querySelectorAll('[data-toggle-pw]').forEach((btnToggle) => {
      btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        const wrapper = btnToggle.closest('.cm-auth-pw-wrap');
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

    // Nút Facebook Sign In
    const btnFacebook = body.querySelector('#btnFacebookAuth');
    if (btnFacebook) {
      btnFacebook.addEventListener('click', (e) => {
        e.preventDefault();
        const fbPrompt = prompt('Nhập tên hoặc Email Facebook của bạn để đăng nhập:', '');
        if (!fbPrompt) return;

        const fbUser = fbPrompt.trim();
        const customer = {
          id: `CUST-FB-${Date.now()}`,
          name: fbUser,
          email: fbUser.includes('@') ? fbUser : '',
          phone: '',
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        const existingList = readJson(STORAGE_CUSTOMERS, []);
        writeJson(STORAGE_CUSTOMERS, [...existingList, customer]);
        useCustomer(customer);

        sendOrderToSupabase({
          order_type: 'Khách hàng đăng nhập Facebook',
          customer_name: customer.name,
          phone: '',
          email: customer.email,
          clinic_or_spa: 'Khách hàng cá nhân',
          collaboration_need: 'Đăng nhập Facebook (comem style)',
          note: `Khách hàng Facebook: ${fbUser}`,
          total_amount: 0
        }).catch(() => {});

        closeModal();
        renderButton();
        showToast(`Đăng nhập Facebook thành công! Xin chào ${customer.name} ✓`);
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
          formError = 'Vui lòng nhập Email hoặc Số điện thoại của bạn.';
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

        // Tìm khách hàng đã lưu
        let found = allCustomers.find((c) =>
          (c.email && c.email.toLowerCase() === cleanId) ||
          (c.phone && c.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, ''))
        );

        if (found) {
          if (found.password && found.password !== password) {
            formError = 'Mật khẩu chưa chính xác. Vui lòng kiểm tra lại hoặc bấm "Lấy lại mật khẩu".';
            render();
            return;
          }
        } else {
          // Lần đầu đăng nhập trên thiết bị mới -> Khởi tạo tài khoản và đồng bộ
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

        // Đồng bộ lên Supabase
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

    // Submit: Form Đăng ký (khi mở form đăng ký)
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
          formError = 'Vui lòng nhập số điện thoại hợp lệ.';
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
          formError = 'Email hoặc số điện thoại này đã có tài khoản. Vui lòng bấm "Đăng nhập tại đây".';
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

        writeJson(STORAGE_CUSTOMERS, [...allCustomers, newCustomer]);
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
          formError = 'Vui lòng nhập Email hoặc Số điện thoại của bạn.';
          render();
          return;
        }

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
        formSuccess = `beVIBE đã ghi nhận yêu cầu lấy lại mật khẩu cho ${identifier}. Bộ phận CSKH sẽ hỗ trợ bạn qua email/SĐT hoặc hotline 033 828 2112.`;
        render();
      });
    }
  }

  function openModal(view = 'login') {
    currentView = view === 'register' ? 'register' : (view === 'forgot' ? 'forgot' : 'login');
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

  renderButton();

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
