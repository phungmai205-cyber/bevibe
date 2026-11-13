/**
 * Customer accounts: sign in with Google or email + password, one cart per customer.
 *
 * The login service lives in account-firebase.js and is only downloaded when FIREBASE_CONFIG
 * (auth-config.js) is filled in, so the rest of the site does not get heavier.
 *
 * ctx: { shop, getLang, showToast, escapeHtml }
 */
import { FIREBASE_CONFIG } from './auth-config.js';

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

  function renderButton() {
    const L = t();
    if (user) {
      const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
      btn.innerHTML = user.photo
        ? `<img class="header-account-photo" src="${escapeHtml(user.photo)}" alt="" referrerpolicy="no-referrer">`
        : `<span class="header-account-initial">${escapeHtml(initial)}</span>`;
      btn.classList.add('is-signed-in');
      btn.setAttribute('aria-label', `${L.account}: ${user.name || user.email}`);
      btn.setAttribute('aria-haspopup', 'menu');
    } else {
      btn.innerHTML = USER_ICON;
      btn.classList.remove('is-signed-in');
      btn.setAttribute('aria-label', L.signIn);
      btn.setAttribute('aria-haspopup', 'dialog');
    }
  }

  function renderMenu() {
    if (!user) { menu.hidden = true; return; }
    const L = t();
    menu.innerHTML = `
      <div class="acct-menu-head">
        <strong>${escapeHtml(user.name || L.account)}</strong>
        <small>${escapeHtml(user.email || '')}</small>
      </div>
      <button type="button" class="acct-menu-item" data-acct="cart">${L.myCart} <span>(${shop.cartCount()})</span></button>
      <button type="button" class="acct-menu-item" data-acct="signout">${L.signOut}</button>`;
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
    if (user) toggleMenu();
    else openModal();
  });

  menu.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-acct]');
    if (!item) return;
    toggleMenu(false);
    if (item.getAttribute('data-acct') === 'cart') shop.openCart();
    if (item.getAttribute('data-acct') === 'signout') {
      try { await (await loadBackend()).signOut(); } catch (err) { /* already signed out */ }
    }
  });

  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) toggleMenu(false);
  });
  window.addEventListener('resize', () => { if (!menu.hidden) positionMenu(); });

  /* ---------------- Sign-in dialog ---------------- */
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

  function msgHtml() {
    if (!message) return '';
    return `<p class="acct-msg acct-msg--${message.type}" role="${message.type === 'error' ? 'alert' : 'status'}">${escapeHtml(message.text)}</p>`;
  }

  function render() {
    const L = t();
    const off = !enabled();
    const dis = busy || off ? 'disabled' : '';
    const emailChip = `
      <div class="acct-email-chip"><span>${escapeHtml(email)}</span>
        <button type="button" class="acct-link" data-acct-step="start">${L.changeEmail}</button></div>`;
    let html = '';
    if (step === 'start') {
      html = `
        <h2 class="acct-title" id="acctTitle">${L.signIn}</h2>
        <p class="acct-lead">${off ? '' : L.welcome}</p>
        ${off ? `<p class="acct-msg acct-msg--info">${L.off}</p>` : ''}
        <button type="button" class="acct-btn acct-btn-google" data-acct-google ${dis}>${GOOGLE_ICON}<span>${L.google}</span></button>
        <div class="acct-divider"><span>${L.or}</span></div>
        <form class="acct-form" data-acct-form="email" novalidate>
          <input class="acct-input" type="email" name="email" autocomplete="email" inputmode="email" placeholder="${L.emailPh}" value="${escapeHtml(email)}" aria-label="Email" ${off ? 'disabled' : ''}>
          ${msgHtml()}
          <button type="submit" class="acct-btn acct-btn-primary" data-acct-next ${dis}>${L.next}</button>
        </form>`;
    } else if (step === 'login') {
      html = `
        <h2 class="acct-title" id="acctTitle">${L.loginTitle}</h2>
        ${emailChip}
        <form class="acct-form" data-acct-form="login" novalidate>
          <input class="acct-input" type="password" name="password" autocomplete="current-password" placeholder="${L.pwPh}" aria-label="${L.pwPh}">
          ${msgHtml()}
          <button type="submit" class="acct-btn acct-btn-primary is-ready" ${dis}>${L.login}</button>
        </form>
        <button type="button" class="acct-link acct-forgot" data-acct-reset ${dis}>${L.forgot}</button>
        <p class="acct-switch">${L.noAccount} <button type="button" class="acct-link" data-acct-step="register">${L.createLink}</button></p>`;
    } else {
      html = `
        <h2 class="acct-title" id="acctTitle">${L.registerTitle}</h2>
        ${emailChip}
        <form class="acct-form" data-acct-form="register" novalidate>
          <input class="acct-input" type="text" name="name" autocomplete="name" placeholder="${L.namePh}" aria-label="${L.namePh}">
          <input class="acct-input" type="password" name="password" autocomplete="new-password" placeholder="${L.pwNewPh}" aria-label="${L.pwNewPh}">
          <input class="acct-input" type="password" name="password2" autocomplete="new-password" placeholder="${L.pw2Ph}" aria-label="${L.pw2Ph}">
          ${msgHtml()}
          <button type="submit" class="acct-btn acct-btn-primary is-ready" ${dis}>${L.register}</button>
        </form>
        <p class="acct-switch">${L.hasAccount} <button type="button" class="acct-link" data-acct-step="login">${L.loginLink}</button></p>`;
    }
    body.innerHTML = `${html}<button type="button" class="acct-back" data-acct-close>${L.back}</button>`;
    body.classList.toggle('is-busy', busy);
    updateNextState();
  }

  // "Tiếp tục" turns black once the email looks valid (grey before, as in the reference design)
  function updateNextState() {
    const input = body.querySelector('input[name="email"]');
    const next = body.querySelector('[data-acct-next]');
    if (input && next) next.classList.toggle('is-ready', EMAIL_RE.test(input.value.trim()));
  }

  function setStep(s, keepMessage = false) {
    step = s;
    if (!keepMessage) message = null;
    render();
    const first = body.querySelector('input:not([disabled])');
    if (first) first.focus();
  }

  let lastFocus = null;
  function openModal() {
    lastFocus = document.activeElement;
    step = 'start';
    message = null;
    busy = false;
    render();
    modal.hidden = false;
    document.body.classList.add('acct-open');
    void modal.offsetWidth; // start the fade-in from the hidden state
    modal.classList.add('is-open');
    if (enabled()) loadBackend().catch(() => {}); // start downloading while the customer types
    const first = body.querySelector('input:not([disabled]), button:not([disabled])');
    if (first) first.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.classList.remove('acct-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function errorText(err) {
    const L = t();
    const code = (err && err.code) || '';
    if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(code)) return L.errWrong;
    if (/email-already-in-use/.test(code)) return L.errExists;
    if (/invalid-email/.test(code)) return L.errEmail;
    if (/weak-password/.test(code)) return L.errPwShort;
    if (/too-many-requests/.test(code)) return L.errMany;
    if (/network-request-failed/.test(code)) return L.errNet;
    if (/popup-blocked/.test(code)) return L.errPopup;
    if (/unauthorized-domain/.test(code)) return L.errDomain;
    return L.errOther;
  }

  async function run(task) {
    if (busy) return;
    busy = true;
    message = null;
    render();
    try {
      await task(await loadBackend());
    } catch (err) {
      const code = (err && err.code) || '';
      // Customer closed the Google window: nothing to report
      if (!/popup-closed-by-user|cancelled-popup-request/.test(code)) {
        message = { type: 'error', text: errorText(err) };
        if (/email-already-in-use/.test(code)) step = 'login';
      }
    } finally {
      busy = false;
      if (!modal.hidden) render();
    }
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-acct-close]')) { closeModal(); return; }
    const stepBtn = e.target.closest('[data-acct-step]');
    if (stepBtn) { setStep(stepBtn.getAttribute('data-acct-step')); return; }
    if (e.target.closest('[data-acct-google]')) {
      run(async (b) => { await b.signInWithGoogle(); closeModal(); });
      return;
    }
    if (e.target.closest('[data-acct-reset]')) {
      run(async (b) => {
        await b.resetPassword(email);
        message = { type: 'info', text: t().resetSent };
      });
    }
  });

  modal.addEventListener('input', (e) => {
    if (e.target.name === 'email') updateNextState();
  });

  modal.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const kind = form.getAttribute('data-acct-form');
    const L = t();
    const fail = (text) => {
      message = { type: 'error', text };
      render();
      const bad = body.querySelector('input');
      if (bad) bad.focus();
    };
    if (kind === 'email') {
      const v = form.email.value.trim();
      if (!EMAIL_RE.test(v)) { fail(L.errEmail); return; }
      email = v;
      setStep('login');
    } else if (kind === 'login') {
      const pw = form.password.value;
      if (pw.length < 6) { fail(L.errWrong); return; }
      run(async (b) => { await b.signInWithEmail(email, pw); closeModal(); });
    } else if (kind === 'register') {
      const name = form.name.value.trim();
      const pw = form.password.value;
      if (!name) { fail(L.errName); return; }
      if (pw.length < 6) { fail(L.errPwShort); return; }
      if (pw !== form.password2.value) { fail(L.errPwMatch); return; }
      run(async (b) => {
        const created = await b.register(name, email, pw);
        if (created && user && user.uid === created.uid) {
          user = { ...user, name: created.name || name };
          renderButton();
          shop.setCustomerDefaults({ name: user.name, email: user.email });
        }
        closeModal();
        showToast(t().createdToast);
      });
    }
  });

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
