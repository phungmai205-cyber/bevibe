/**
 * Customer accounts: sign in with Google or email + password, one cart per customer.
 *
 * The login service lives in account-firebase.js and is only downloaded when FIREBASE_CONFIG
 * (auth-config.js) is filled in, so the rest of the site does not get heavier.
 *
 * ctx: { shop, getLang, showToast, escapeHtml }
 */
import { FIREBASE_CONFIG } from './auth-config.js';
import { ORDER_ENDPOINT, sendOrderToSupabase } from './order-config.js';
import {
  findCustomer,
  registerCustomer,
  getCurrentCustomer,
  setCurrentCustomer,
  authenticateCounselor,
  registerCounselor,
  recoverCounselorCode,
  showCounselorSuccessModal
} from './auth-modal.js';

// Request to beVIBE (order system → admin "Khách tiềm năng" + e-mail báo, plus the Supabase copy)
async function sendLead(payload) {
  sendOrderToSupabase({
    order_type: payload.type, customer_name: payload.name, phone: payload.phone || '', email: payload.email || '',
    clinic_or_spa: payload.clinic || '', collaboration_need: payload.interest || '', note: payload.note || ''
  }).catch(() => {});
  if (!ORDER_ENDPOINT) return false;
  try {
    await fetch(ORDER_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
    return true;
  } catch (err) {
    return false;
  }
}
import {
  getCurrentCounselor,
  setCounselorSession,
  clearCounselorSession
} from './counselor.js';

const T = {
  vi: {
    account: 'Tài khoản',
    signIn: 'Đăng nhập',
    google: 'Tiếp tục với Google',
    or: 'Hoặc',
    emailPh: 'Nhập địa chỉ email',
    next: 'Tiếp tục',
    back: 'Quay lại và tiếp tục mua hàng',
    welcome: 'Đăng nhập hoặc tạo tài khoản để lưu giỏ hàng và đặt hàng nhanh hơn.',
    loginTitle: 'Nhập mật khẩu',
    pwPh: 'Mật khẩu',
    login: 'Đăng nhập',
    forgot: 'Quên mật khẩu?',
    noAccount: 'Chưa có tài khoản?',
    createLink: 'Tạo tài khoản mới',
    hasAccount: 'Đã có tài khoản?',
    loginLink: 'Đăng nhập',
    registerTitle: 'Tạo tài khoản mới',
    namePh: 'Họ và tên',
    pwNewPh: 'Mật khẩu (ít nhất 6 ký tự)',
    pw2Ph: 'Nhập lại mật khẩu',
    register: 'Tạo tài khoản',
    changeEmail: 'Đổi',
    resetSent: 'Nếu email này đã đăng ký, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (cả mục Spam).',
    welcomeToast: (n) => `Xin chào ${n}! Giỏ hàng của bạn đã được đồng bộ ✓`,
    createdToast: 'Tạo tài khoản thành công ✓',
    signedOut: 'Bạn đã đăng xuất',
    myCart: 'Giỏ hàng của tôi',
    signOut: 'Đăng xuất',
    off: 'Tính năng đăng nhập đang được thiết lập. Bạn vẫn có thể thêm sản phẩm vào giỏ và đặt hàng bình thường.',
    errEmail: 'Email không hợp lệ.',
    errPwShort: 'Mật khẩu cần ít nhất 6 ký tự.',
    errPwMatch: 'Hai mật khẩu chưa khớp nhau.',
    errName: 'Vui lòng nhập họ tên.',
    errWrong: 'Email hoặc mật khẩu chưa đúng. Nếu bạn chưa có tài khoản, hãy chọn “Tạo tài khoản mới”.',
    errExists: 'Email này đã có tài khoản. Vui lòng đăng nhập bằng mật khẩu.',
    errMany: 'Bạn thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.',
    errNet: 'Không kết nối được. Vui lòng kiểm tra mạng và thử lại.',
    errPopup: 'Trình duyệt đã chặn cửa sổ đăng nhập Google. Hãy cho phép cửa sổ bật lên rồi thử lại.',
    errDomain: 'Tên miền website chưa được cho phép đăng nhập. Vui lòng báo quản trị viên.',
    errOther: 'Có lỗi xảy ra. Vui lòng thử lại.'
  },
  ko: {
    account: '계정',
    signIn: '로그인',
    google: 'Google로 계속하기',
    or: '또는',
    emailPh: '이메일 주소 입력',
    next: '계속',
    back: '쇼핑 계속하기',
    welcome: '로그인하거나 계정을 만들어 장바구니를 저장하고 더 빠르게 주문하세요.',
    loginTitle: '비밀번호 입력',
    pwPh: '비밀번호',
    login: '로그인',
    forgot: '비밀번호를 잊으셨나요?',
    noAccount: '계정이 없으신가요?',
    createLink: '새 계정 만들기',
    hasAccount: '이미 계정이 있으신가요?',
    loginLink: '로그인',
    registerTitle: '새 계정 만들기',
    namePh: '이름',
    pwNewPh: '비밀번호 (6자 이상)',
    pw2Ph: '비밀번호 확인',
    register: '계정 만들기',
    changeEmail: '변경',
    resetSent: '등록된 이메일이라면 비밀번호 재설정 링크를 보냈습니다. 메일함(스팸함 포함)을 확인해 주세요.',
    welcomeToast: (n) => `${n}님, 환영합니다! 장바구니가 동기화되었습니다 ✓`,
    createdToast: '계정이 생성되었습니다 ✓',
    signedOut: '로그아웃되었습니다',
    myCart: '내 장바구니',
    signOut: '로그아웃',
    off: '로그인 기능을 준비 중입니다. 장바구니 담기와 주문은 그대로 이용하실 수 있습니다.',
    errEmail: '유효하지 않은 이메일입니다.',
    errPwShort: '비밀번호는 6자 이상이어야 합니다.',
    errPwMatch: '비밀번호가 일치하지 않습니다.',
    errName: '이름을 입력해 주세요.',
    errWrong: '이메일 또는 비밀번호가 올바르지 않습니다. 계정이 없다면 “새 계정 만들기”를 선택하세요.',
    errExists: '이미 가입된 이메일입니다. 비밀번호로 로그인해 주세요.',
    errMany: '시도 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.',
    errNet: '연결할 수 없습니다. 네트워크를 확인해 주세요.',
    errPopup: '브라우저가 Google 로그인 창을 차단했습니다. 팝업을 허용한 뒤 다시 시도해 주세요.',
    errDomain: '이 도메인은 로그인이 허용되지 않았습니다. 관리자에게 문의해 주세요.',
    errOther: '오류가 발생했습니다. 다시 시도해 주세요.'
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GOOGLE_ICON = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const USER_ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>';

export function initAccount(ctx) {
  const { shop, getLang, showToast, escapeHtml } = ctx;
  const t = () => T[getLang() === 'ko' ? 'ko' : 'vi'];

  let backend = null;         // login service, once loaded
  let backendPromise = null;
  let user = null;            // { uid, name, email, photo }
  let step = 'start';         // start | login | register
  let email = '';
  let busy = false;
  let message = null;         // { type: 'error' | 'info', text }
  let stopCartWatch = null;
  let pushTimer = null;

  // Customer accounts are active and powered by Supabase (or Firebase if configured)
  const enabled = () => true;

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
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'header-account';
  btn.id = 'accountBtn';
  btn.setAttribute('aria-haspopup', 'dialog');
  if (cartBtn) cartBtn.insertAdjacentElement('beforebegin', btn);

  const menu = document.createElement('div');
  menu.className = 'acct-menu';
  menu.id = 'accountMenu';
  menu.hidden = true;
  document.body.appendChild(menu);

  let activeTab = 'login'; // 'login' | 'register'
  let prefillCode = '';     // counselor code filled in (link #/xac-nhan-counselor?code=…)
  let roleTab = 'customer'; // 'customer' | 'counselor'
  let regRole = 'customer'; // 'customer' | 'counselor'
  let formError = '';
  let cslForgot = false;     // "Quên mã Counselor?" form instead of the counselor login
  let cslRecovered = null;   // { code, name } found by phone + e-mail
  let cslRequestSent = false;

  function renderButton() {
    const counselor = getCurrentCounselor();
    const customer = getCurrentCustomer();
    if (counselor) {
      btn.innerHTML = `<span style="font-size: 1.15rem; line-height: 1;">💎</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', `Counselor: ${counselor.code} - ${counselor.name}`);
      btn.setAttribute('title', `Counselor: ${counselor.code} - ${counselor.name}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else if (customer) {
      const initial = (customer.name || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = `<span class="header-account-initial" style="background:#0f2347;color:#fff;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;font-size:0.75rem;font-weight:700;">${escapeHtml(initial)}</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', customer.name);
      btn.setAttribute('title', customer.name);
      btn.setAttribute('aria-haspopup', 'menu');
    } else if (user) {
      const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = user.photo
        ? `<img class="header-account-photo" src="${escapeHtml(user.photo)}" alt="" referrerpolicy="no-referrer">`
        : `<span class="header-account-initial">${escapeHtml(initial)}</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', `${user.name || user.email}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else {
      btn.innerHTML = USER_ICON;
      btn.classList.remove('is-signed-in');
      btn.setAttribute('aria-label', 'Đăng nhập / Đăng ký tài khoản');
      btn.setAttribute('title', 'Đăng nhập / Đăng ký tài khoản');
      btn.setAttribute('aria-haspopup', 'dialog');
    }
  }

  function renderMenu() {
    const counselor = getCurrentCounselor();
    const customer = getCurrentCustomer();
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
    if (customer) {
      menu.innerHTML = `
        <div class="acct-menu-head">
          <strong>👤 ${escapeHtml(customer.name)}</strong>
          <small>${escapeHtml(customer.email)}</small>
        </div>
        <button type="button" class="acct-menu-item" data-acct="cart">Giỏ hàng của tôi <span>(${shop.cartCount()})</span></button>
        <button type="button" class="acct-menu-item" data-acct="signout" style="color: #dc2626; font-weight: 600;">Đăng xuất</button>`;
      menu.hidden = false;
      return;
    }
    if (user) {
      const L = t();
      menu.innerHTML = `
        <div class="acct-menu-head">
          <strong>${escapeHtml(user.name || L.account)}</strong>
          <small>${escapeHtml(user.email || '')}</small>
        </div>
        <button type="button" class="acct-menu-item" data-acct="cart">${L.myCart} <span>(${shop.cartCount()})</span></button>
        <button type="button" class="acct-menu-item" data-acct="signout" style="color: #dc2626;">${L.signOut}</button>`;
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
    const counselor = getCurrentCounselor();
    const customer = getCurrentCustomer();
    if (counselor || customer || user) {
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

  // Sign out of every kind of account; the signed-in customer's cart copy is removed from this device
  async function signOutAll() {
    clearCounselorSession();
    if (getCurrentCustomer()) shop.switchAccount(null);
    setCurrentCustomer(null);
    if (backend) { try { await backend.signOut(); } catch (err) { /* ignore */ } }
    renderButton();
    window.location.hash = '#';
    window.location.reload();
  }
  if (typeof window !== 'undefined') window.__bevibeSignOut = signOutAll;

  // Local customer account: own cart on this device + name / email / phone fill the checkout form
  function useCustomer(c) {
    setCurrentCustomer(c);
    shop.switchAccount(`cust-${c.id}`);
    shop.setCustomerDefaults({ name: c.name, email: c.email, phone: c.phone });
  }

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) toggleMenu(false);
  });
  window.addEventListener('resize', () => { if (!menu.hidden) positionMenu(); });

  /* ---------------- Sign-in & Register dialog ---------------- */
  const modal = document.createElement('div');
  modal.className = 'acct-overlay';
  modal.id = 'accountModal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'acctTitle');
  modal.innerHTML = `
    <div class="acct-backdrop" data-acct-close></div>
    <div class="acct-dialog">
      <button type="button" class="acct-x" data-acct-close aria-label="Đóng">&times;</button>
      <img class="acct-logo" src="/assets/images/logo.png" alt="beVIBE" width="160">
      <div class="acct-body" id="acctBody"></div>
    </div>`;
  document.body.appendChild(modal);
  const body = modal.querySelector('#acctBody');

  function render() {
    const L = t();
    let contentHtml = '';

    const tabsHtml = `
      <div class="acct-main-tabs">
        <button type="button" class="acct-main-tab ${activeTab === 'login' ? 'active' : ''}" data-nav-tab="login">Đăng nhập</button>
        <button type="button" class="acct-main-tab ${activeTab === 'register' ? 'active' : ''}" data-nav-tab="register">Đăng ký</button>
      </div>
    `;

    if (activeTab === 'login') {
      let loginFormHtml = '';
      if (roleTab === 'customer') {
        loginFormHtml = `
          <!-- Form Đăng nhập Khách hàng (CHỈ CẦN GMAIL) -->
          <form id="acctLoginFormCust" class="auth-form" autocomplete="on">
            <label class="auth-field">
              <span>Email đã đăng ký</span>
              <input type="email" name="email" class="auth-input" placeholder="Ví dụ: yourname@gmail.com" autocomplete="email" required>
              <small class="auth-hint">Chưa có tài khoản? Chọn tab "Đăng ký".</small>
            </label>
            <div class="auth-error-box" id="acctLoginCustErr" ${formError ? '' : 'hidden'}>${escapeHtml(formError)}</div>
            <button type="submit" class="auth-submit-btn">
              <span>Đăng nhập</span>
            </button>
          </form>
        `;
      } else if (cslForgot) {
        loginFormHtml = cslRecovered ? `
          <div class="auth-csl-note">
            <div class="csl-note-badge">Đã tìm thấy mã Counselor</div>
            <p>Xin chào <strong>${escapeHtml(cslRecovered.name)}</strong>, mã Counselor của bạn là
              <strong style="font-size:1.1rem;color:#854d0e;background:#fef08a;padding:2px 8px;border-radius:6px;">${escapeHtml(cslRecovered.code)}</strong></p>
          </div>
          <button type="button" class="auth-submit-btn auth-submit-csl" data-csl-forgot="use">Đăng nhập với mã này</button>
        ` : cslRequestSent ? `
          <div class="auth-csl-note">
            <div class="csl-note-badge">Đã gửi yêu cầu</div>
            <p>beVIBE đã nhận yêu cầu lấy lại mã Counselor. Nhân viên sẽ gọi vào số điện thoại bạn đăng ký để xác minh và báo lại mã.
              Cần gấp: gọi <a href="tel:0338282112"><strong>033 828 2112</strong></a>.</p>
          </div>
          <button type="button" class="auth-submit-btn auth-submit-csl" data-csl-forgot="back">Quay lại đăng nhập</button>
        ` : `
          <form id="acctCslForgotForm" class="auth-form" autocomplete="on">
            <p class="auth-hint" style="margin:0 0 4px;">Nhập <strong>số điện thoại</strong> và <strong>email</strong> bạn dùng khi đăng ký Counselor.</p>
            <label class="auth-field">
              <span>Số điện thoại đã đăng ký</span>
              <input type="tel" name="phone" class="auth-input" placeholder="Ví dụ: 0912 345 678" autocomplete="tel" required>
            </label>
            <label class="auth-field">
              <span>Email đã đăng ký</span>
              <input type="email" name="email" class="auth-input" placeholder="Ví dụ: yourname@gmail.com" autocomplete="email" required>
            </label>
            <div class="auth-error-box" id="acctCslForgotErr" ${formError ? '' : 'hidden'}>${escapeHtml(formError)}</div>
            <button type="submit" class="auth-submit-btn auth-submit-csl"><span>Lấy lại mã Counselor</span></button>
            <button type="button" class="acct-link" data-csl-forgot="back" style="margin-top:10px;color:#0284c7;font-weight:700;background:none;border:none;cursor:pointer;">← Quay lại đăng nhập</button>
          </form>
        `;
      } else {
        loginFormHtml = `
          <!-- Form Đăng nhập Counselor -->
          <form id="acctLoginFormCsl" class="auth-form" autocomplete="on">
            <label class="auth-field">
              <span>Mã Counselor</span>
              <input type="text" name="cslCode" class="auth-input" placeholder="Ví dụ: BV482913" value="${escapeHtml(prefillCode)}" autocomplete="username" required>
            </label>
            <label class="auth-field">
              <span>Số điện thoại đã đăng ký</span>
              <input type="tel" name="cslPhone" class="auth-input" placeholder="Ví dụ: 0912 345 678" autocomplete="tel" required>
              <small class="auth-hint">Nhập đúng số điện thoại bạn dùng khi đăng ký Counselor.</small>
            </label>
            <div class="auth-error-box" id="acctLoginCslErr" ${formError ? '' : 'hidden'}>${escapeHtml(formError)}</div>
            <button type="submit" class="auth-submit-btn auth-submit-csl">
              <span>Đăng nhập Phân hệ Counselor</span>
            </button>
            <button type="button" class="acct-link" data-csl-forgot="open" style="margin-top:10px;color:#0284c7;font-weight:700;background:none;border:none;cursor:pointer;">Quên mã Counselor?</button>
          </form>
        `;
      }

      contentHtml = `
        ${tabsHtml}
        <div class="auth-tabs" style="margin-bottom: 16px;">
          <button type="button" class="auth-tab ${roleTab === 'customer' ? 'active' : ''}" data-role-tab="customer">Khách hàng</button>
          <button type="button" class="auth-tab ${roleTab === 'counselor' ? 'active' : ''}" data-role-tab="counselor">Counselor</button>
        </div>
        ${loginFormHtml}
        <p class="acct-switch" style="margin-top: 16px; font-size: 0.88rem; text-align: center; color: #64748b;">
          Chưa có tài khoản? <button type="button" class="acct-link" data-nav-tab="register" style="color: #0284c7; font-weight: 700; background: none; border: none; cursor: pointer;">Tạo tài khoản mới</button>
        </p>
      `;
    } else {
      // TAB ĐĂNG KÝ
      contentHtml = `
        ${tabsHtml}
        <!-- Lựa chọn vai trò đăng ký -->
        <div class="auth-tabs" style="margin-bottom: 16px;">
          <button type="button" class="auth-tab ${regRole === 'customer' ? 'active' : ''}" data-reg-role="customer">Khách hàng</button>
          <button type="button" class="auth-tab ${regRole === 'counselor' ? 'active' : ''}" data-reg-role="counselor">Counselor</button>
        </div>

        <form id="acctRegisterForm" class="auth-form" autocomplete="off">
          <!-- Trường Gmail -->
          <label class="auth-field">
            <span>Email <strong class="req" style="color: #dc2626;">*</strong></span>
            <input type="email" name="email" class="auth-input" placeholder="Ví dụ: yourname@gmail.com" autocomplete="email" required>
            <small class="auth-hint" id="acctEmailHint">${regRole === 'customer' ? 'Mỗi email chỉ đăng ký một tài khoản.' : 'beVIBE dùng email và số điện thoại để liên hệ xác nhận đơn sỉ.'}</small>
          </label>

          <!-- Họ và tên -->
          <label class="auth-field" id="acctNameField">
            <span>Họ và tên <strong class="req" id="acctNameReq" style="color: #dc2626; ${regRole === 'customer' ? 'display:none;' : ''}">*</strong></span>
            <input type="text" name="name" class="auth-input" placeholder="Ví dụ: Nguyễn Văn An" ${regRole === 'counselor' ? 'required' : ''}>
          </label>

          <!-- Số điện thoại: chỉ dành cho Counselor -->
          <label class="auth-field" id="acctPhoneField" ${regRole === 'counselor' ? '' : 'hidden'}>
            <span>Số điện thoại <strong class="req" style="color: #dc2626;">*</strong></span>
            <input type="tel" name="phone" class="auth-input" placeholder="Ví dụ: 0912 345 678">
          </label>

          <!-- Chú thích Counselor: mật khẩu tương ứng mã số -->
          <div id="acctCslNoteField" class="auth-csl-note" ${regRole === 'counselor' ? '' : 'hidden'}>
            <div class="csl-note-badge">Cấp mã Counselor</div>
            <p>Sau khi đăng ký, hệ thống cấp <strong>mã Counselor</strong>. Lần sau đăng nhập bằng <strong>mã Counselor + số điện thoại</strong> đã đăng ký.</p>
          </div>

          <div class="auth-error-box" id="acctRegErr" ${formError ? '' : 'hidden'}>${escapeHtml(formError)}</div>

          <button type="submit" class="auth-submit-btn ${regRole === 'counselor' ? 'auth-submit-csl' : ''}" id="btnAcctSubmitRegister">
            <span>${regRole === 'customer' ? 'Tạo tài khoản' : 'Đăng ký Counselor beVIBE'}</span>
          </button>
        </form>

        <p class="acct-switch" style="margin-top: 16px; font-size: 0.88rem; text-align: center; color: #64748b;">
          Đã có tài khoản? <button type="button" class="acct-link" data-nav-tab="login" style="color: #0284c7; font-weight: 700; background: none; border: none; cursor: pointer;">Đăng nhập ngay</button>
        </p>
      `;
    }

    body.innerHTML = `
      ${contentHtml}
      <button type="button" class="acct-back" data-acct-close>${L.back}</button>
    `;
    bindModalEvents();
  }

  function bindModalEvents() {
    body.querySelectorAll('[data-nav-tab]').forEach((b) => {
      b.addEventListener('click', () => {
        activeTab = b.dataset.navTab;
        formError = '';
        render();
      });
    });

    body.querySelectorAll('[data-role-tab]').forEach((b) => {
      b.addEventListener('click', () => {
        roleTab = b.dataset.roleTab;
        cslForgot = false;
        formError = '';
        render();
      });
    });

    body.querySelectorAll('[data-reg-role]').forEach((b) => {
      b.addEventListener('click', () => {
        regRole = b.dataset.regRole;
        formError = '';
        render();
      });
    });

    // Read an input by name (form.name would be the form's own name, not the "name" input)
    const field = (form, name) => String((form.querySelector(`[name="${name}"]`) || {}).value || '').trim();

    const showErr = (id, text) => {
      formError = text;
      const errEl = body.querySelector(id);
      if (errEl) { errEl.textContent = text; errEl.hidden = false; }
    };

    const formLoginCust = body.querySelector('#acctLoginFormCust');
    if (formLoginCust) {
      formLoginCust.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = field(formLoginCust, 'email').toLowerCase();
        if (!EMAIL_RE.test(emailVal)) return showErr('#acctLoginCustErr', 'Vui lòng nhập địa chỉ email hợp lệ.');
        // Login and sign-up are separate: an unknown e-mail is not turned into an account silently
        const found = findCustomer(emailVal);
        if (!found) return showErr('#acctLoginCustErr', 'Email này chưa có tài khoản trên trình duyệt này. Vui lòng chọn tab "Đăng ký".');
        clearCounselorSession();
        useCustomer(found);
        closeModal();
        renderButton();
        showToast(`Đăng nhập thành công! Xin chào ${found.name} ✓`);
      });
    }

    body.querySelectorAll('[data-csl-forgot]').forEach((b) => {
      b.addEventListener('click', () => {
        const act = b.dataset.cslForgot;
        if (act === 'use' && cslRecovered) prefillCode = cslRecovered.code;
        cslForgot = act === 'open';
        cslRecovered = null;
        cslRequestSent = false;
        formError = '';
        render();
        const next = body.querySelector(act === 'use' ? '#acctLoginFormCsl [name="cslPhone"]' : 'input');
        if (next) next.focus();
      });
    });

    const formCslForgot = body.querySelector('#acctCslForgotForm');
    if (formCslForgot) {
      formCslForgot.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = field(formCslForgot, 'phone');
        const mail = field(formCslForgot, 'email').toLowerCase();
        const res = recoverCounselorCode(phone, mail);
        if (res.error) return showErr('#acctCslForgotErr', res.error);
        if (res.counselor) {
          cslRecovered = { code: res.counselor.code, name: res.counselor.name };
          formError = '';
          render();
          return;
        }
        // Not registered on this browser: beVIBE checks and calls back (the code is never shown to an unverified person)
        const btn = formCslForgot.querySelector('button[type="submit"]');
        btn.disabled = true;
        const ok = await sendLead({
          type: 'Counselor quên mã',
          name: 'Counselor quên mã',
          phone,
          email: mail,
          clinic: 'Counselor beVIBE',
          interest: 'Lấy lại mã Counselor',
          note: 'Khách yêu cầu lấy lại mã Counselor trên website. Gọi lại số điện thoại này để xác minh (họ tên, email) trước khi báo mã.'
        });
        btn.disabled = false;
        if (!ok) return showErr('#acctCslForgotErr', 'Chưa gửi được yêu cầu do lỗi kết nối. Vui lòng gọi 033 828 2112.');
        cslRequestSent = true;
        formError = '';
        render();
      });
    }

    const formLoginCsl = body.querySelector('#acctLoginFormCsl');
    if (formLoginCsl) {
      formLoginCsl.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = authenticateCounselor(field(formLoginCsl, 'cslCode'), field(formLoginCsl, 'cslPhone'));
        if (res.error) return showErr('#acctLoginCslErr', res.error);
        if (getCurrentCustomer()) { shop.switchAccount(null); setCurrentCustomer(null); }
        setCounselorSession(res.counselor);
        closeModal();
        renderButton();
        window.location.hash = '/counselor';
      });
    }

    const formReg = body.querySelector('#acctRegisterForm');
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = field(formReg, 'email').toLowerCase();
        const nameVal = field(formReg, 'name');
        const phoneVal = field(formReg, 'phone');

        if (regRole === 'customer') {
          const res = registerCustomer({ name: nameVal, email: emailVal, phone: phoneVal });
          if (res.error) return showErr('#acctRegErr', res.error);
          clearCounselorSession();
          useCustomer(res.customer);
          sendOrderToSupabase({
            order_type: 'Khách hàng đăng ký tài khoản',
            customer_name: res.customer.name,
            phone: res.customer.phone || 'Chưa cung cấp',
            email: res.customer.email,
            clinic_or_spa: 'Khách hàng cá nhân',
            collaboration_need: 'Tài khoản website beVIBE',
            note: 'Đăng ký tài khoản trên website'
          }).catch(() => {});
          closeModal();
          renderButton();
          showToast(`Tạo tài khoản thành công! Xin chào ${res.customer.name} ✓`);
          return;
        }

        const res = registerCounselor({ name: nameVal, email: emailVal, phone: phoneVal });
        if (res.error) return showErr('#acctRegErr', res.error);
        const c = res.counselor;
        sendOrderToSupabase({
          order_type: `Đăng ký Counselor mới [${c.code}]`,
          customer_name: `${c.name} (${c.code})`,
          phone: c.phone,
          email: c.email,
          clinic_or_spa: 'Counselor beVIBE',
          collaboration_need: 'Đăng ký làm Tư vấn viên sỉ',
          note: `Mã cấp phát: ${c.code}`
        }).catch(() => {});
        closeModal();
        renderButton();
        showCounselorSuccessModal(c, (counselor) => {
          if (getCurrentCustomer()) { shop.switchAccount(null); setCurrentCustomer(null); }
          setCounselorSession(counselor);
          renderButton();
          window.location.hash = '/counselor';
        });
      });
    }
  }

  let lastFocus = null;
  function openModal(tab = 'login', opts = {}) {
    lastFocus = document.activeElement;
    activeTab = tab === 'register' ? 'register' : 'login';
    if (opts.role === 'counselor' || opts.role === 'customer') {
      roleTab = opts.role;
      regRole = opts.role;
    }
    prefillCode = typeof opts.code === 'string' ? opts.code.slice(0, 20) : '';
    cslForgot = false;
    cslRecovered = null;
    cslRequestSent = false;
    formError = '';
    render();
    modal.hidden = false;
    document.body.classList.add('acct-open');
    void modal.offsetWidth;
    modal.classList.add('is-open');
    const first = body.querySelector('input:not([disabled])');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('acct-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-acct-close]')) { closeModal(); return; }
  });

  if (typeof window !== 'undefined') {
    window.__bevibeOpenAccountModal = openModal;
    window.addEventListener('bevibe:auth-change', () => {
      renderButton();
      if (!menu.hidden) renderMenu();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    else if (!menu.hidden) toggleMenu(false);
  });

  /* ---------------- Account ↔ cart ---------------- */
  async function onSignedIn(u, b) {
    const firstTime = !user || user.uid !== u.uid;
    user = u;
    renderButton();
    shop.setTokenProvider(() => b.getIdToken());
    shop.setCustomerDefaults({ name: u.name, email: u.email });
    if (!firstTime) return;

    let remote = null;
    try { remote = await b.loadCart(u.uid); } catch (err) { remote = null; }
    if (!user || user.uid !== u.uid) return; // signed out meanwhile
    // Listen first, so the guest items merged in by switchAccount are saved to the account too
    shop.onCartChange((items) => {
      clearTimeout(pushTimer);
      pushTimer = setTimeout(() => { b.saveCart(u.uid, items).catch(() => {}); }, 500);
    });
    shop.switchAccount(u.uid, remote);
    if (stopCartWatch) stopCartWatch();
    stopCartWatch = b.watchCart ? b.watchCart(u.uid, (items) => shop.applyRemoteCart(items)) : null;
    if (sessionStorage.getItem('bevibe_acct_greeted') !== u.uid) {
      try { sessionStorage.setItem('bevibe_acct_greeted', u.uid); } catch (err) { /* ignore */ }
      showToast(t().welcomeToast(u.name || u.email));
    }
  }

  function onSignedOut() {
    const was = !!user;
    user = null;
    clearTimeout(pushTimer);
    if (stopCartWatch) { stopCartWatch(); stopCartWatch = null; }
    shop.onCartChange(null);
    shop.setTokenProvider(null);
    shop.switchAccount(null);
    try { sessionStorage.removeItem('bevibe_acct_greeted'); } catch (err) { /* ignore */ }
    renderButton();
    toggleMenu(false);
    if (was) showToast(t().signedOut);
  }

  renderButton();
  if (enabled()) {
    loadBackend()
      .then((b) => b.onAuthChange((u) => (u ? onSignedIn(u, b) : onSignedOut())))
      .catch((err) => { console.error('Account service failed to load', err); shop.switchAccount(null); });
  } else {
    // Firebase off: the local customer account (if signed in) keeps its own cart, otherwise the guest cart
    const local = getCurrentCustomer();
    if (local && local.id) {
      shop.switchAccount(`cust-${local.id}`);
      shop.setCustomerDefaults({ name: local.name, email: local.email, phone: local.phone });
    } else {
      shop.switchAccount(null);
    }
  }

  return {
    refresh() {
      renderButton();
      if (!menu.hidden) renderMenu();
      if (!modal.hidden) render();
    },
    open: openModal,
    getUser: () => user
  };
}
