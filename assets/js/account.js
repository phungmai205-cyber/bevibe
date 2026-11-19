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
  getRegisteredCustomers,
  getCurrentCustomer,
  setCurrentCustomer,
  getAllCounselors,
  generateNextCounselorCode,
  saveNewCounselor,
  showCounselorSuccessModal
} from './auth-modal.js';
import {
  getCurrentCounselor,
  setCounselorSession,
  clearCounselorSession,
  normalizeCounselorCode
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

  // Tests can provide their own login service; otherwise Firebase when configured
  const enabled = () => !!(window.__bevibeAuthBackend || FIREBASE_CONFIG);

  function loadBackend() {
    if (backend) return Promise.resolve(backend);
    if (!backendPromise) {
      backendPromise = (window.__bevibeAuthBackend
        ? Promise.resolve(window.__bevibeAuthBackend)
        : import('./account-firebase.js').then((m) => m.createFirebaseBackend(FIREBASE_CONFIG))
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
  let roleTab = 'customer'; // 'customer' | 'counselor'
  let regRole = 'customer'; // 'customer' | 'counselor'
  let formError = '';

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
    if (action === 'signout') {
      clearCounselorSession();
      setCurrentCustomer(null);
      if (backend) { try { await backend.signOut(); } catch (err) {} }
      renderButton();
      window.location.hash = '#';
      window.location.reload();
    }
  });

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
      contentHtml = `
        ${tabsHtml}
        <div class="auth-tabs" style="margin-bottom: 16px;">
          <button type="button" class="auth-tab ${roleTab === 'customer' ? 'active' : ''}" data-role-tab="customer">Khách hàng</button>
          <button type="button" class="auth-tab ${roleTab === 'counselor' ? 'active' : ''}" data-role-tab="counselor">Counselor (Tư vấn viên)</button>
        </div>

        <!-- 1. Form Đăng nhập Khách hàng -->
        <form id="acctLoginFormCust" class="auth-form" ${roleTab === 'customer' ? '' : 'hidden'} autocomplete="on">
          <label class="auth-field">
            <span>Địa chỉ Email</span>
            <input type="email" name="email" class="auth-input" placeholder="email@gmail.com" required>
          </label>
          <label class="auth-field">
            <span>Mật khẩu</span>
            <input type="password" name="password" class="auth-input" placeholder="Mật khẩu của bạn" required>
          </label>
          <div class="auth-error-box" id="acctLoginCustErr" ${formError && roleTab === 'customer' ? '' : 'hidden'}>${escapeHtml(formError)}</div>
          <button type="submit" class="auth-submit-btn">
            <span>Đăng nhập Khách hàng</span>
          </button>
        </form>

        <!-- 2. Form Đăng nhập Counselor -->
        <form id="acctLoginFormCsl" class="auth-form" ${roleTab === 'counselor' ? '' : 'hidden'} autocomplete="on">
          <label class="auth-field">
            <span>Mã Counselor / Mật khẩu (dạng BV0001)</span>
            <input type="text" name="cslCode" class="auth-input" placeholder="Ví dụ: BV0001 hoặc BV 0001" required>
            <small class="auth-hint">Nhập mã số Counselor do beVIBE cấp để truy cập Dashboard giá sỉ &amp; quỹ thưởng.</small>
          </label>
          <div class="auth-error-box" id="acctLoginCslErr" ${formError && roleTab === 'counselor' ? '' : 'hidden'}>${escapeHtml(formError)}</div>
          <button type="submit" class="auth-submit-btn auth-submit-csl">
            <span>Đăng nhập Phân hệ Counselor</span>
          </button>
          <div class="auth-demo-chips">
            <span>Mã mẫu:</span>
            <button type="button" class="btn-demo-chip" data-code="BV0001">BV0001</button>
            <button type="button" class="btn-demo-chip" data-code="BV0002">BV0002</button>
            <button type="button" class="btn-demo-chip" data-code="BV0003">BV0003</button>
          </div>
        </form>

        <p class="acct-switch" style="margin-top: 16px; font-size: 0.88rem; text-align: center; color: #64748b;">
          Chưa có tài khoản? <button type="button" class="acct-link" data-nav-tab="register" style="color: #0284c7; font-weight: 700; background: none; border: none; cursor: pointer;">Tạo tài khoản mới</button>
        </p>
      `;
    } else {
      // TAB ĐĂNG KÝ
      contentHtml = `
        ${tabsHtml}
        <form id="acctRegisterForm" class="auth-form" autocomplete="off">
          <label class="auth-field">
            <span>Họ và tên <strong class="req" style="color: #dc2626;">*</strong></span>
            <input type="text" name="name" class="auth-input" placeholder="Ví dụ: Nguyễn Văn An" required>
          </label>

          <label class="auth-field">
            <span>Số điện thoại <strong class="req" style="color: #dc2626;">*</strong></span>
            <input type="tel" name="phone" class="auth-input" placeholder="Ví dụ: 0912 345 678" required>
          </label>

          <label class="auth-field">
            <span>Địa chỉ Email <strong class="req" style="color: #dc2626;">*</strong></span>
            <input type="email" name="email" class="auth-input" placeholder="email@gmail.com" required>
          </label>

          <!-- Chọn vai trò -->
          <div class="auth-field">
            <span>Loại tài khoản:</span>
            <div class="auth-role-group">
              <label class="auth-role-opt ${regRole === 'customer' ? 'is-active' : ''}" id="acctRoleOptCust">
                <input type="radio" name="accountRole" value="customer" ${regRole === 'customer' ? 'checked' : ''}>
                <div>
                  <strong>Khách hàng cá nhân</strong>
                  <small>Mua sắm, lưu giỏ hàng &amp; địa chỉ</small>
                </div>
              </label>
              <label class="auth-role-opt ${regRole === 'counselor' ? 'is-active' : ''}" id="acctRoleOptCsl">
                <input type="radio" name="accountRole" value="counselor" ${regRole === 'counselor' ? 'checked' : ''}>
                <div>
                  <strong>Counselor (Tư vấn viên sỉ)</strong>
                  <small>Giảm giá sỉ 55% + Thưởng 5%</small>
                </div>
              </label>
            </div>
          </div>

          <div id="acctCustPwFields" class="auth-pw-block" ${regRole === 'customer' ? '' : 'hidden'}>
            <label class="auth-field">
              <span>Mật khẩu <strong class="req" style="color: #dc2626;">*</strong></span>
              <input type="password" name="password" class="auth-input" placeholder="Nhập ít nhất 6 ký tự">
            </label>
            <label class="auth-field">
              <span>Xác nhận mật khẩu <strong class="req" style="color: #dc2626;">*</strong></span>
              <input type="password" name="passwordConfirm" class="auth-input" placeholder="Nhập lại mật khẩu">
            </label>
          </div>

          <div id="acctCslNoteField" class="auth-csl-note" ${regRole === 'counselor' ? '' : 'hidden'}>
            <div class="csl-note-badge">✨ Lưu ý dành cho Counselor</div>
            <p>Mật khẩu đăng nhập sẽ là <strong>Mã số Counselor (như BV0001)</strong> do hệ thống cấp. Tài khoản được kích hoạt tức thì để bạn đăng nhập ngay mà không cần chờ đợi!</p>
          </div>

          <div class="auth-error-box" id="acctRegErr" ${formError ? '' : 'hidden'}>${escapeHtml(formError)}</div>

          <button type="submit" class="auth-submit-btn" id="btnAcctSubmitRegister">
            <span>Đăng ký ngay</span>
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
        formError = '';
        render();
      });
    });

    body.querySelectorAll('.btn-demo-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const input = body.querySelector('#acctLoginFormCsl input[name="cslCode"]');
        if (input) {
          input.value = chip.dataset.code;
          input.focus();
        }
      });
    });

    const radioRoles = body.querySelectorAll('input[name="accountRole"]');
    const optCust = body.querySelector('#acctRoleOptCust');
    const optCsl = body.querySelector('#acctRoleOptCsl');
    const custPwFields = body.querySelector('#acctCustPwFields');
    const cslNoteField = body.querySelector('#acctCslNoteField');

    radioRoles.forEach((r) => {
      r.addEventListener('change', () => {
        regRole = r.value;
        if (r.value === 'counselor') {
          optCsl?.classList.add('is-active');
          optCust?.classList.remove('is-active');
          if (custPwFields) custPwFields.hidden = true;
          if (cslNoteField) cslNoteField.hidden = false;
        } else {
          optCust?.classList.add('is-active');
          optCsl?.classList.remove('is-active');
          if (custPwFields) custPwFields.hidden = false;
          if (cslNoteField) cslNoteField.hidden = true;
        }
      });
    });

    const formLoginCust = body.querySelector('#acctLoginFormCust');
    if (formLoginCust) {
      formLoginCust.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = formLoginCust.email.value.trim().toLowerCase();
        const pwVal = formLoginCust.password.value;
        const allCust = getRegisteredCustomers();
        const found = allCust.find((c) => c.email === emailVal && c.password === pwVal);
        if (!found) {
          formError = 'Email hoặc mật khẩu chưa chính xác. Vui lòng thử lại hoặc chọn Đăng ký.';
          const errEl = body.querySelector('#acctLoginCustErr');
          if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
          return;
        }
        setCurrentCustomer(found);
        closeModal();
        renderButton();
        showToast(`Đăng nhập thành công! Xin chào ${found.name} ✓`);
        window.location.reload();
      });
    }

    const formLoginCsl = body.querySelector('#acctLoginFormCsl');
    if (formLoginCsl) {
      formLoginCsl.addEventListener('submit', (e) => {
        e.preventDefault();
        const codeVal = formLoginCsl.cslCode.value.trim();
        const norm = normalizeCounselorCode(codeVal);
        if (!norm) {
          formError = 'Vui lòng nhập mã Counselor hợp lệ.';
          const errEl = body.querySelector('#acctLoginCslErr');
          if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
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
        closeModal();
        renderButton();
        window.location.hash = '/counselor';
      });
    }

    const formReg = body.querySelector('#acctRegisterForm');
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = formReg.name.value.trim();
        const phoneVal = formReg.phone.value.trim();
        const emailVal = formReg.email.value.trim().toLowerCase();
        const errEl = body.querySelector('#acctRegErr');

        if (!nameVal || !phoneVal || !emailVal) {
          formError = 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email.';
          if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
          return;
        }

        if (regRole === 'customer') {
          const pw = formReg.password ? formReg.password.value : '';
          const pw2 = formReg.passwordConfirm ? formReg.passwordConfirm.value : '';
          if (pw.length < 6) {
            formError = 'Mật khẩu cần ít nhất 6 ký tự.';
            if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
            return;
          }
          if (pw !== pw2) {
            formError = 'Hai mật khẩu chưa trùng khớp.';
            if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
            return;
          }
          const allCust = getRegisteredCustomers();
          if (allCust.some((c) => c.email === emailVal)) {
            formError = 'Email này đã được đăng ký tài khoản. Vui lòng chọn Đăng nhập.';
            if (errEl) { errEl.textContent = formError; errEl.hidden = false; }
            return;
          }
          const newCust = { name: nameVal, phone: phoneVal, email: emailVal, password: pw, createdAt: new Date().toISOString() };
          allCust.push(newCust);
          localStorage.setItem('bevibe_registered_customers_v1', JSON.stringify(allCust));
          setCurrentCustomer(newCust);
          sendOrderToSupabase({
            order_type: 'Khách hàng đăng ký mới',
            customer_name: nameVal,
            phone: phoneVal,
            email: emailVal,
            clinic_or_spa: 'Khách hàng cá nhân',
            collaboration_need: 'Tạo tài khoản website beVIBE',
            note: 'Đăng ký thành công từ website'
          }).catch(() => {});
          closeModal();
          renderButton();
          showToast(`Xin chào ${nameVal}! Đăng ký tài khoản thành công ✓`);
          window.location.reload();
        } else {
          // Counselor
          const newCode = generateNextCounselorCode();
          const newCounselor = {
            code: newCode,
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
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
          sendOrderToSupabase({
            order_type: `Đăng ký Counselor mới [${newCode}]`,
            customer_name: `${nameVal} (${newCode})`,
            phone: phoneVal,
            email: emailVal,
            clinic_or_spa: 'Counselor beVIBE',
            collaboration_need: 'Đăng ký làm Tư vấn viên sỉ (Giảm 55% + Thưởng 5%)',
            note: `Mã cấp phát: ${newCode} | Mật khẩu: ${newCode} | Kích hoạt tự động tức thì`
          }).catch(() => {});
          closeModal();
          renderButton();
          showCounselorSuccessModal(newCounselor);
        }
      });
    }
  }

  let lastFocus = null;
  function openModal(tab = 'login') {
    lastFocus = document.activeElement;
    activeTab = tab === 'register' ? 'register' : 'login';
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
    // Accounts switched off: make sure an old signed-in cart is not left in use
    shop.switchAccount(null);
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
