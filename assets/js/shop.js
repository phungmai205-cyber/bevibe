/**
 * beVIBE storefront module
 * - Skin-concern tags + 5-step routine (data + home section)
 * - Product detail page (#/san-pham/<productId>)
 * - Cart drawer + checkout (COD / bank transfer). Orders are posted to the Google Apps Script
 *   order system (order-config.js). Without an endpoint, or if it cannot be reached, the order
 *   is sent to beVIBE by Zalo or e-mail from the confirmation step instead.
 */
import { ORDER_ENDPOINT, ORDER_TIMEOUT_MS } from './order-config.js';

/* ==========================================================================
   Skin concerns & routine data
   ========================================================================== */
export const CONCERN_DEFS = [
  { id: 'repair', vi: 'Phục hồi hàng rào da', ko: '피부 장벽 회복', descVi: 'Da yếu, tổn thương sau treatment', descKo: '시술 후 손상·약해진 피부', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'soothing', vi: 'Làm dịu da nhạy cảm', ko: '민감 피부 진정', descVi: 'Da đỏ, dễ kích ứng', descKo: '붉고 쉽게 자극받는 피부', icon: 'M12 2.7c3 3.6 6 6.9 6 10.3a6 6 0 0 1-12 0c0-3.4 3-6.7 6-10.3z' },
  { id: 'hydration', vi: 'Cấp ẩm & giữ ẩm', ko: '수분 공급', descVi: 'Da khô, thiếu nước', descKo: '건조하고 수분이 부족한 피부', icon: 'M12 2.7c3 3.6 6 6.9 6 10.3a6 6 0 0 1-12 0c0-3.4 3-6.7 6-10.3zM9 14a3 3 0 0 0 3 3' },
  { id: 'antiaging', vi: 'Chống lão hóa & săn chắc', ko: '안티에이징 · 탄력', descVi: 'Nếp nhăn, da chảy xệ', descKo: '주름, 탄력 저하', icon: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z' },
  { id: 'brightening', vi: 'Sáng da & đều màu', ko: '브라이트닝 · 톤 개선', descVi: 'Da xỉn màu, không đều', descKo: '칙칙하고 고르지 않은 톤', icon: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4' },
  { id: 'scalp', vi: 'Tóc & da đầu', ko: '헤어 · 두피', descVi: 'Rụng tóc, tóc bạc, da đầu yếu', descKo: '탈모, 새치, 약한 두피', icon: 'M4 20c2-6 5-9 8-9s6 3 8 9M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0' }
];

// Tags reviewed against each product's own description in translations.js
export const CONCERN_TAGS = {
  'drbargo-2': ['repair', 'hydration', 'soothing'],
  'drbargo-4': ['hydration', 'soothing', 'brightening'],
  'drbargo-3': ['repair', 'antiaging', 'soothing'],
  'drbargo-1': ['repair', 'hydration', 'soothing'],
  'neura-3': ['antiaging'],
  'neura-9': ['hydration'],
  'neura-10': ['repair', 'hydration'],
  'neura-6': ['repair', 'hydration'],
  'neura-11': ['antiaging'],
  'neura-12': ['repair', 'antiaging'],
  'neura-13': ['hydration', 'brightening'],
  'neura-4': ['repair', 'hydration', 'soothing'],
  'neura-14': ['antiaging'],
  'neura-15': ['hydration'],
  'neura-1': ['hydration', 'soothing'],
  'neura-8': ['soothing', 'brightening'],
  'neura-7': ['repair', 'soothing', 'brightening'],
  'neura-16': ['hydration', 'soothing', 'brightening'],
  'neura-17': ['hydration', 'soothing'],
  'neura-2': ['hydration', 'soothing'],
  'neura-5': ['hydration', 'brightening'],
  'stemc-5': ['hydration'],
  'stemc-4': ['hydration', 'soothing', 'brightening'],
  'stemc-6': ['repair'],
  'stemc-2': ['antiaging', 'hydration'],
  'stemc-3': ['hydration', 'brightening'],
  'stemc-1': ['hydration'],
  'smib-3': ['scalp'], 'smib-4': ['scalp'], 'smib-8': ['scalp'], 'smib-9': ['scalp'],
  'smib-1': ['scalp'], 'smib-2': ['scalp'], 'smib-5': ['scalp'], 'smib-6': ['scalp'], 'smib-7': ['scalp']
};

// 5-step routine, mapped from the product category used across the site
export const ROUTINE_STEPS = [
  { step: 1, id: 'cleanse', cats: ['cleanser'], vi: 'Làm sạch', ko: '클렌징', descVi: 'Loại bỏ bụi bẩn, lớp trang điểm', descKo: '노폐물·메이크업 제거' },
  { step: 2, id: 'tone', cats: ['toner'], vi: 'Cân bằng', ko: '토닝', descVi: 'Toner, xịt khoáng cân bằng da', descKo: '토너·미스트로 피부결 정돈' },
  { step: 3, id: 'treat', cats: ['serum', 'mask'], vi: 'Đặc trị', ko: '트리트먼트', descVi: 'Serum, ampoule, mặt nạ chuyên sâu', descKo: '세럼·앰플·집중 마스크' },
  { step: 4, id: 'moisturize', cats: ['moisturizer'], vi: 'Dưỡng ẩm', ko: '보습', descVi: 'Khóa ẩm, nuôi dưỡng da', descKo: '수분 잠금·영양 공급' },
  { step: 5, id: 'protect', cats: ['sun'], vi: 'Chống nắng', ko: '자외선 차단', descVi: 'Bảo vệ da khỏi tia UV (ban ngày)', descKo: '낮 시간 자외선 차단' }
];

export function routineStepOf(category) {
  return ROUTINE_STEPS.find((s) => s.cats.includes(category)) || null;
}

/* ==========================================================================
   Store module
   ========================================================================== */
const CART_KEY = 'bevibe_cart_v1';
const CUSTOMER_KEY = 'bevibe_checkout_info_v1';
// Last signed-in account on this browser: its cart is shown at once while the login is restored
const LAST_UID_KEY = 'bevibe_last_uid';
const ORDER_ZALO = '0338282112';
const ORDER_EMAIL = 'bevibevn@gmail.com';
const ICON_CART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>';

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable: keep in memory */ }
}

/**
 * ctx: {
 *   productIndex, brandsData, getLang, localized, formatVnd, escapeHtml, showToast,
 *   navigate, lineLabel, categoryLabel, productCardHtml, prefillProductInquiry
 * }
 */
export function initShop(ctx) {
  const { productIndex, brandsData, getLang, localized, formatVnd, escapeHtml, showToast, navigate, lineLabel, categoryLabel, productCardHtml, prefillProductInquiry } = ctx;
  const isVi = () => getLang() === 'vi';
  const entryOf = (id) => productIndex.find((e) => e.id === id) || null;
  const priceOf = (id) => {
    const e = entryOf(id);
    return e && e.price ? e.price : null;
  };

  /* ---------------- Cart state ----------------
     Guests keep their cart under CART_KEY. A signed-in customer has a cart of their own
     (CART_KEY:<uid> on this browser, synced to their account by account.js). */
  const cleanItems = (list) => (Array.isArray(list) ? list : [])
    .filter((it) => it && typeof it.id === 'string' && priceOf(it.id) && it.qty > 0)
    .map((it) => ({ id: it.id, qty: Math.max(1, Math.min(99, parseInt(it.qty, 10) || 1)) }));
  const lastUid = (() => { try { return localStorage.getItem(LAST_UID_KEY) || ''; } catch (e) { return ''; } })();
  let cartKey = lastUid ? `${CART_KEY}:${lastUid}` : CART_KEY;
  let customerKey = lastUid ? `${CUSTOMER_KEY}:${lastUid}` : CUSTOMER_KEY;
  let cart = cleanItems(safeGet(cartKey, []));
  let cartListener = null;   // account.js: push changes to the customer's account
  let tokenProvider = null;  // account.js: login token sent with orders

  function saveCart({ notify = true } = {}) {
    safeSet(cartKey, cart);
    renderCartBadge();
    renderCartDrawer();
    if (notify && cartListener) cartListener(cart.map((it) => ({ ...it })));
  }

  // Sign in: the guest cart is added to the customer's saved cart. Sign out: back to an empty guest cart.
  function switchAccount(uid, remoteItems) {
    if (uid) {
      const userKey = `${CART_KEY}:${uid}`;
      const guest = cartKey === CART_KEY ? cart : [];
      const merged = cleanItems(remoteItems != null ? remoteItems : safeGet(userKey, []));
      guest.forEach((g) => {
        const f = merged.find((x) => x.id === g.id);
        if (f) f.qty = Math.min(99, f.qty + g.qty);
        else merged.push({ ...g });
      });
      cartKey = userKey;
      customerKey = `${CUSTOMER_KEY}:${uid}`;
      cart = merged;
      try { localStorage.removeItem(CART_KEY); localStorage.setItem(LAST_UID_KEY, uid); } catch (e) { /* ignore */ }
      saveCart({ notify: guest.length > 0 || remoteItems == null });
    } else {
      // Remove the signed-out customer's copy so the next person on this device can't see it
      try {
        if (cartKey !== CART_KEY) localStorage.removeItem(cartKey);
        if (customerKey !== CUSTOMER_KEY) localStorage.removeItem(customerKey);
        localStorage.removeItem(LAST_UID_KEY);
      } catch (e) { /* ignore */ }
      cartKey = CART_KEY;
      customerKey = CUSTOMER_KEY;
      cart = cleanItems(safeGet(CART_KEY, []));
      saveCart({ notify: false });
    }
  }

  // Cart changed on another device: show it without sending it back
  function applyRemoteCart(items) {
    const next = cleanItems(items);
    if (JSON.stringify(next) === JSON.stringify(cart)) return;
    cart = next;
    saveCart({ notify: false });
  }

  // Name / email of the signed-in customer fill the checkout form when it has none yet
  function setCustomerDefaults(defaults) {
    const info = safeGet(customerKey, {});
    let changed = false;
    ['name', 'email'].forEach((k) => {
      if (!info[k] && defaults && defaults[k]) { info[k] = defaults[k]; changed = true; }
    });
    if (changed) safeSet(customerKey, info);
  }

  function cartCount() {
    return cart.reduce((n, it) => n + it.qty, 0);
  }

  function cartTotal() {
    return cart.reduce((sum, it) => sum + (priceOf(it.id) || 0) * it.qty, 0);
  }

  function addToCart(id, qty = 1, { silent = false } = {}) {
    if (!priceOf(id)) return false;
    const q = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    const found = cart.find((it) => it.id === id);
    if (found) found.qty = Math.min(99, found.qty + q);
    else cart.push({ id, qty: q });
    saveCart();
    if (!silent) {
      const p = localized(entryOf(id));
      showToast(isVi() ? `Đã thêm “${p.name}” vào giỏ hàng ✓` : `“${p.name}” 장바구니에 담았습니다 ✓`);
      const badge = document.getElementById('cartCount');
      if (badge) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
    }
    return true;
  }

  function setQty(id, qty) {
    const it = cart.find((x) => x.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((x) => x.id !== id);
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  /* ---------------- Cart UI ---------------- */
  const drawer = document.getElementById('cartDrawer');
  const checkout = document.getElementById('checkoutModal');

  function renderCartBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const n = cartCount();
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.hidden = n === 0;
    const btn = badge.closest('button');
    if (btn) btn.setAttribute('aria-label', (isVi() ? 'Giỏ hàng' : '장바구니') + (n ? ` (${n})` : ''));
  }

  function qtyControl(id, qty, scope) {
    return `
      <div class="qty-stepper" data-qty-scope="${scope}">
        <button type="button" data-shop="qty-dec" data-product-id="${id}" aria-label="${isVi() ? 'Giảm' : '감소'}">−</button>
        <input type="number" min="1" max="99" value="${qty}" data-shop-qty="${id}" aria-label="${isVi() ? 'Số lượng' : '수량'}">
        <button type="button" data-shop="qty-inc" data-product-id="${id}" aria-label="${isVi() ? 'Tăng' : '증가'}">+</button>
      </div>`;
  }

  function renderCartDrawer() {
    if (!drawer) return;
    const vi = isVi();
    const title = drawer.querySelector('#cartTitle');
    if (title) title.innerHTML = `${vi ? 'Giỏ hàng' : '장바구니'} <span>(${cartCount()})</span>`;
    const body = drawer.querySelector('#cartItems');
    const foot = drawer.querySelector('#cartFooter');
    if (!body || !foot) return;
    if (!cart.length) {
      body.innerHTML = `
        <div class="cart-empty">
          ${ICON_CART.replace('width="18" height="18"', 'width="44" height="44"')}
          <p>${vi ? 'Giỏ hàng của bạn đang trống.' : '장바구니가 비어 있습니다.'}</p>
          <a href="#/san-pham" class="btn-primary" data-shop="close-cart">${vi ? 'Xem sản phẩm' : '제품 보기'}</a>
        </div>`;
      foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map((it) => {
      const p = localized(entryOf(it.id));
      const price = priceOf(it.id);
      return `
        <div class="cart-item">
          <a href="#/san-pham/${p.id}" class="cart-item-media" data-shop="close-cart"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></a>
          <div class="cart-item-info">
            <a href="#/san-pham/${p.id}" class="cart-item-name" data-shop="close-cart">${p.name}</a>
            <span class="cart-item-meta">${p.brandName}${p.priceUnit ? ` · ${escapeHtml(p.priceUnit)}` : ''}</span>
            <span class="cart-item-unit">${formatVnd(price)}</span>
            <div class="cart-item-row">
              ${qtyControl(p.id, it.qty, 'cart')}
              <strong class="cart-item-line">${formatVnd(price * it.qty)}</strong>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-shop="remove" data-product-id="${p.id}" aria-label="${vi ? 'Xóa' : '삭제'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>`;
    }).join('');
    foot.innerHTML = `
      <div class="cart-sum-row"><span>${vi ? 'Tạm tính' : '소계'}</span><strong>${formatVnd(cartTotal())}</strong></div>
      <p class="cart-note">${vi ? 'Phí vận chuyển được beVIBE báo khi xác nhận đơn.' : '배송비는 주문 확인 시 안내해 드립니다.'}</p>
      <button type="button" class="btn-primary cart-checkout-btn" data-shop="checkout">${vi ? 'Đặt hàng' : '주문하기'} →</button>
      <button type="button" class="cart-continue" data-shop="close-cart">${vi ? 'Tiếp tục mua sắm' : '쇼핑 계속하기'}</button>`;
  }

  let lastFocus = null;
  function openOverlay(el) {
    if (!el) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('open'));
    document.body.style.overflow = 'hidden';
    const focusable = el.querySelector('button, a[href], input, select, textarea');
    if (focusable) setTimeout(() => focusable.focus(), 60);
  }

  function closeOverlay(el) {
    if (!el || el.hidden) return;
    el.classList.remove('open');
    setTimeout(() => { el.hidden = true; }, 250);
    if ((!drawer || drawer.hidden || el === drawer) && (!checkout || checkout.hidden || el === checkout)) {
      document.body.style.overflow = '';
    }
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function openCart() {
    renderCartDrawer();
    openOverlay(drawer);
  }

  /* ---------------- Checkout ---------------- */
  let lastOrder = null;

  function orderCode() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `BV${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function summaryHtml(items) {
    const vi = isVi();
    return `
      <div class="checkout-summary">
        <h3>${vi ? 'Đơn hàng của bạn' : '주문 내역'}</h3>
        <ul class="checkout-lines">
          ${items.map((it) => {
            const p = localized(entryOf(it.id));
            return `<li><img src="${p.image}" alt="" loading="lazy"><span><strong>${p.name}</strong><small>${p.priceUnit ? escapeHtml(p.priceUnit) + ' · ' : ''}${formatVnd(priceOf(it.id))} × ${it.qty}</small></span><b>${formatVnd(priceOf(it.id) * it.qty)}</b></li>`;
          }).join('')}
        </ul>
        <div class="checkout-total-row"><span>${vi ? 'Tạm tính' : '소계'}</span><strong>${formatVnd(items.reduce((s, it) => s + priceOf(it.id) * it.qty, 0))}</strong></div>
        <div class="checkout-total-row muted"><span>${vi ? 'Phí vận chuyển' : '배송비'}</span><span>${vi ? 'Báo khi xác nhận đơn' : '주문 확인 시 안내'}</span></div>
      </div>`;
  }

  function renderCheckoutForm() {
    if (!checkout) return;
    const vi = isVi();
    const info = safeGet(customerKey, {});
    const v = (k) => escapeHtml(info[k] || '');
    checkout.querySelector('#checkoutBody').innerHTML = `
      <div class="checkout-grid">
        <form class="checkout-form" id="checkoutForm" novalidate>
          <h2 class="checkout-title" id="checkoutTitle">${vi ? 'Thông tin đặt hàng' : '주문 정보'}</h2>
          <div class="checkout-fields">
            <label class="cf-field"><span>${vi ? 'Họ và tên' : '이름'} *</span><input name="name" required autocomplete="name" value="${v('name')}"></label>
            <label class="cf-field"><span>${vi ? 'Số điện thoại' : '전화번호'} *</span><input name="phone" required inputmode="tel" autocomplete="tel" value="${v('phone')}" placeholder="VD: 0912 345 678"></label>
            <label class="cf-field full"><span>Email</span><input name="email" type="email" autocomplete="email" value="${v('email')}"></label>
            <label class="cf-field"><span>${vi ? 'Tỉnh / Thành phố' : '시/도'} *</span><input name="city" required autocomplete="address-level1" value="${v('city')}"></label>
            <label class="cf-field"><span>${vi ? 'Quận / Huyện' : '구/군'}</span><input name="district" autocomplete="address-level2" value="${v('district')}"></label>
            <label class="cf-field full"><span>${vi ? 'Địa chỉ nhận hàng' : '배송 주소'} *</span><input name="address" required autocomplete="street-address" value="${v('address')}" placeholder="${vi ? 'Số nhà, tên đường, phường/xã' : '번지, 도로명, 동'}"></label>
            <label class="cf-field full"><span>${vi ? 'Ghi chú' : '메모'}</span><textarea name="note" rows="2" placeholder="${vi ? 'Thời gian nhận hàng, xuất hóa đơn VAT…' : '수령 시간, 세금계산서 발행 등'}"></textarea></label>
          </div>
          <fieldset class="checkout-pay">
            <legend>${vi ? 'Phương thức thanh toán' : '결제 방법'}</legend>
            <label class="pay-option"><input type="radio" name="pay" value="cod" checked><span><strong>${vi ? 'Thanh toán khi nhận hàng (COD)' : '착불 결제 (COD)'}</strong><small>${vi ? 'Trả tiền mặt cho nhân viên giao hàng.' : '배송 기사에게 현금 결제.'}</small></span></label>
            <label class="pay-option"><input type="radio" name="pay" value="bank"><span><strong>${vi ? 'Chuyển khoản ngân hàng' : '계좌 이체'}</strong><small>${vi ? 'beVIBE gửi thông tin tài khoản khi xác nhận đơn.' : '주문 확인 시 계좌 정보를 보내드립니다.'}</small></span></label>
          </fieldset>
          <label class="hp-field" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
          <p class="checkout-error" id="checkoutError" role="alert" hidden></p>
          <button type="submit" class="btn-primary checkout-submit">${vi ? 'Xác nhận đặt hàng' : '주문 확인'}</button>
          <p class="checkout-fineprint">${ORDER_ENDPOINT
            ? (vi ? 'Sau khi đặt hàng, nhân viên beVIBE sẽ gọi điện xác nhận đơn, phí vận chuyển và thời gian giao hàng.' : '주문 후 비바이브 담당자가 전화로 주문, 배송비, 배송 일정을 확인해 드립니다.')
            : (vi ? 'Bước tiếp theo, bạn gửi đơn cho beVIBE qua Zalo hoặc Email. Đơn được ghi nhận khi beVIBE nhận được tin nhắn và gọi xác nhận.' : '다음 단계에서 Zalo 또는 이메일로 주문을 보내 주세요. 비바이브가 메시지를 받고 확인 전화를 드리면 주문이 접수됩니다.')}</p>
        </form>
        ${summaryHtml(cart)}
      </div>`;
    checkout.querySelector('#checkoutForm').addEventListener('submit', onCheckoutSubmit);
  }

  async function sendOrder(payload) {
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), ORDER_TIMEOUT_MS) : null;
    try {
      // text/plain keeps this a "simple" request (no CORS preflight), which Apps Script requires
      const res = await fetch(ORDER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      });
      return await res.json();
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  let submitting = false;

  async function onCheckoutSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const vi = isVi();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach((k) => { data[k] = String(data[k]).trim(); });
    const err = form.querySelector('#checkoutError');
    const phoneDigits = data.phone.replace(/[\s.\-()]/g, '');
    let msg = '';
    if (!data.name || !data.phone || !data.city || !data.address) msg = vi ? 'Vui lòng điền đủ các ô có dấu *.' : '* 표시 항목을 모두 입력해 주세요.';
    else if (!/^(\+?84|0)\d{9,10}$/.test(phoneDigits)) msg = vi ? 'Số điện thoại chưa đúng định dạng.' : '전화번호 형식이 올바르지 않습니다.';
    else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) msg = vi ? 'Email chưa đúng định dạng.' : '이메일 형식이 올바르지 않습니다.';
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      return;
    }
    err.hidden = true;
    safeSet(customerKey, { name: data.name, phone: data.phone, email: data.email, city: data.city, district: data.district, address: data.address });

    const items = cart.map((it) => ({ ...it }));
    let code = orderCode();
    const payLabel = data.pay === 'bank'
      ? (vi ? 'Chuyển khoản ngân hàng' : '계좌 이체')
      : (vi ? 'Thanh toán khi nhận hàng (COD)' : '착불 결제 (COD)');
    const lines = items.map((it, i) => {
      const p = localized(entryOf(it.id));
      return `${i + 1}. ${p.name}${p.priceUnit ? ` (${p.priceUnit})` : ''} x${it.qty} = ${formatVnd(priceOf(it.id) * it.qty)}`;
    });
    const total = items.reduce((s, it) => s + priceOf(it.id) * it.qty, 0);
    const address = [data.address, data.district, data.city].filter(Boolean).join(', ');

    // Order system: post the order, prices are re-checked on the server
    let mode = 'manual';
    if (ORDER_ENDPOINT) {
      submitting = true;
      const btn = form.querySelector('.checkout-submit');
      const btnLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = vi ? 'Đang gửi đơn…' : '주문 전송 중…';
      try {
        let idToken = '';
        try { idToken = tokenProvider ? (await tokenProvider()) || '' : ''; } catch (tokenErr) { idToken = ''; }
        const res = await sendOrder({
          idToken,
          customer: { name: data.name, phone: data.phone, email: data.email, city: data.city, district: data.district, address: data.address, note: data.note },
          pay: data.pay === 'bank' ? 'bank' : 'cod',
          items: items.map((it) => ({ id: it.id, qty: it.qty })),
          clientTotal: total,
          page: window.location.href,
          lang: vi ? 'vi' : 'ko',
          website: data.website || ''
        });
        if (res && res.ok) {
          mode = 'sent';
          code = res.code || code;
        } else {
          err.textContent = (res && res.error) || (vi ? 'Không gửi được đơn hàng, vui lòng thử lại.' : '주문 전송에 실패했습니다. 다시 시도해 주세요.');
          err.hidden = false;
          return;
        }
      } catch (sendErr) {
        mode = 'fallback'; // network / timeout: let the customer send it by Zalo or e-mail
      } finally {
        submitting = false;
        if (mode !== 'sent' && form.isConnected) {
          btn.disabled = false;
          btn.textContent = btnLabel;
        }
      }
    }

    const text = vi
      ? [
        `ĐƠN ĐẶT HÀNG BEVIBE — Mã đơn: ${code}`,
        `Thời gian: ${new Date().toLocaleString('vi-VN')}`,
        '',
        'KHÁCH HÀNG',
        `- Họ tên: ${data.name}`,
        `- Điện thoại: ${data.phone}`,
        data.email ? `- Email: ${data.email}` : '',
        `- Địa chỉ: ${address}`,
        '',
        'SẢN PHẨM',
        ...lines,
        '',
        `Tạm tính: ${formatVnd(total)}`,
        'Phí vận chuyển: beVIBE báo khi xác nhận đơn',
        `Thanh toán: ${payLabel}`,
        data.note ? `Ghi chú: ${data.note}` : ''
      ]
      : [
        `비바이브 주문서 — 주문번호: ${code}`,
        `일시: ${new Date().toLocaleString('ko-KR')}`,
        '',
        '고객 정보',
        `- 이름: ${data.name}`,
        `- 전화: ${data.phone}`,
        data.email ? `- 이메일: ${data.email}` : '',
        `- 주소: ${address}`,
        '',
        '주문 상품',
        ...lines,
        '',
        `소계: ${formatVnd(total)}`,
        '배송비: 주문 확인 시 안내',
        `결제: ${payLabel}`,
        data.note ? `메모: ${data.note}` : ''
      ];
    lastOrder = { code, text: text.filter((l, i, arr) => l !== '' || arr[i - 1] !== '').join('\n'), items, total, mode, pay: data.pay };
    if (mode === 'sent') clearCart();
    renderCheckoutDone();
  }

  function renderCheckoutDone() {
    if (!checkout || !lastOrder) return;
    const vi = isVi();
    if (lastOrder.mode === 'sent') {
      checkout.querySelector('#checkoutBody').innerHTML = `
        <div class="checkout-done">
          <div class="checkout-done-icon" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
          <h2 class="checkout-title" id="checkoutTitle">${vi ? 'Đặt hàng thành công!' : '주문이 완료되었습니다!'}</h2>
          <p class="checkout-done-code">${vi ? 'Mã đơn' : '주문번호'}: <strong>${escapeHtml(lastOrder.code)}</strong></p>
          <p class="checkout-done-lead">${vi
            ? 'beVIBE đã nhận đơn hàng của bạn. Nhân viên sẽ gọi điện xác nhận đơn, phí vận chuyển và thời gian giao hàng trong thời gian sớm nhất.'
            : '비바이브가 주문을 접수했습니다. 담당자가 곧 전화로 주문, 배송비, 배송 일정을 확인해 드립니다.'}${lastOrder.pay === 'bank'
            ? (vi ? ' Thông tin chuyển khoản sẽ được gửi khi xác nhận đơn.' : ' 계좌 정보는 주문 확인 시 안내해 드립니다.') : ''}</p>
          ${summaryHtml(lastOrder.items)}
          <div class="checkout-send">
            <button type="button" class="send-btn email" data-shop="close-checkout">${vi ? 'Tiếp tục mua sắm' : '쇼핑 계속하기'}</button>
            <a class="send-btn zalo" href="https://zalo.me/${ORDER_ZALO}" target="_blank" rel="noopener noreferrer">${vi ? 'Nhắn Zalo cho beVIBE' : 'Zalo로 문의하기'}</a>
          </div>
        </div>`;
      return;
    }
    checkout.querySelector('#checkoutBody').innerHTML = `
      <div class="checkout-done">
        <div class="checkout-done-icon" aria-hidden="true"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
        <h2 class="checkout-title" id="checkoutTitle">${vi ? 'Đơn hàng đã sẵn sàng' : '주문서가 준비되었습니다'}</h2>
        ${lastOrder.mode === 'fallback' ? `<p class="checkout-warn">${vi ? 'Hệ thống chưa nhận được đơn do lỗi kết nối. Vui lòng gửi đơn qua Zalo hoặc Email bên dưới để beVIBE không bỏ lỡ đơn của bạn.' : '연결 오류로 주문이 자동 접수되지 않았습니다. 아래 Zalo 또는 이메일로 주문서를 보내 주세요.'}</p>` : ''}
        <p class="checkout-done-code">${vi ? 'Mã đơn' : '주문번호'}: <strong>${lastOrder.code}</strong></p>
        <p class="checkout-done-lead">${vi ? 'Bấm một nút bên dưới để gửi đơn cho beVIBE. Nhân viên sẽ gọi lại xác nhận đơn, phí vận chuyển và thời gian giao hàng.' : '아래 버튼으로 주문서를 보내 주세요. 담당자가 확인 전화로 배송비와 배송 일정을 안내해 드립니다.'}</p>
        <textarea class="checkout-order-text" readonly rows="9">${escapeHtml(lastOrder.text)}</textarea>
        <div class="checkout-send">
          <button type="button" class="send-btn zalo" data-shop="send-zalo">${vi ? 'Sao chép & gửi qua Zalo' : '복사 후 Zalo로 보내기'}</button>
          <button type="button" class="send-btn email" data-shop="send-email">${vi ? 'Gửi qua Email' : '이메일로 보내기'}</button>
          <button type="button" class="send-btn copy" data-shop="copy-order">${vi ? 'Sao chép nội dung' : '내용 복사'}</button>
        </div>
        <button type="button" class="checkout-finish" data-shop="finish-order">${vi ? 'Đã gửi đơn · Làm trống giỏ hàng' : '주문 전송 완료 · 장바구니 비우기'}</button>
      </div>`;
  }

  function openCheckout() {
    if (!cart.length) return;
    lastOrder = null;
    renderCheckoutForm();
    closeOverlay(drawer);
    openOverlay(checkout);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = checkout && checkout.querySelector('.checkout-order-text');
      if (ta) { ta.select(); try { document.execCommand('copy'); return true; } catch (e2) { return false; } }
      return false;
    }
  }

  /* ---------------- Skin concerns + routine (home) ---------------- */
  let activeStep = 1;

  function renderSkinCare() {
    const vi = isVi();
    const grid = document.getElementById('concernGrid');
    if (grid) {
      const usedThumbs = new Set(); // give every tile a different product photo
      grid.innerHTML = CONCERN_DEFS.map((c) => {
        const items = productIndex.filter((e) => (e.concerns || []).includes(c.id));
        const thumb = items.find((e) => e.price && !usedThumbs.has(e.image)) || items.find((e) => !usedThumbs.has(e.image)) || items[0];
        if (thumb) usedThumbs.add(thumb.image);
        return `
          <a class="concern-tile" href="#/san-pham?concern=${c.id}">
            <span class="concern-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${c.icon}"/></svg></span>
            <span class="concern-text">
              <strong>${vi ? c.vi : c.ko}</strong>
              <small>${vi ? c.descVi : c.descKo}</small>
              <em>${items.length} ${vi ? 'sản phẩm' : '개 제품'} →</em>
            </span>
            ${thumb ? `<img src="${thumb.image}" alt="" loading="lazy">` : ''}
          </a>`;
      }).join('');
    }

    const steps = document.getElementById('routineSteps');
    const list = document.getElementById('routineProducts');
    if (steps && list) {
      steps.innerHTML = ROUTINE_STEPS.map((s) => `
        <button type="button" class="routine-step ${s.step === activeStep ? 'active' : ''}" role="tab" aria-selected="${s.step === activeStep}" data-shop="routine-step" data-step="${s.step}">
          <span class="routine-num">${s.step}</span>
          <span class="routine-label"><strong>${vi ? s.vi : s.ko}</strong><small>${vi ? s.descVi : s.descKo}</small></span>
        </button>`).join('');
      const step = ROUTINE_STEPS.find((s) => s.step === activeStep);
      const items = productIndex.filter((e) => step.cats.includes(e.category));
      const ordered = [...items.filter((e) => e.price), ...items.filter((e) => !e.price)];
      list.innerHTML = `
        <div class="routine-grid">${ordered.slice(0, 4).map(productCardHtml).join('')}</div>
        ${items.length > 4 ? `<div class="routine-more"><a href="#/san-pham?cat=${step.cats[0]}">${vi ? `Xem tất cả ${items.length} sản phẩm bước ${step.step}` : `${step.step}단계 전체 ${items.length}개 보기`} →</a></div>` : ''}`;
    }
  }

  /* ---------------- Product detail page ---------------- */
  function routineSetFor(entry) {
    // One product per step, preferring the same line, then the same brand
    return ROUTINE_STEPS.map((s) => {
      if (s.cats.includes(entry.category)) return entry;
      const pool = productIndex.filter((e) => s.cats.includes(e.category) && e.brandId === entry.brandId);
      return pool.find((e) => e.line === entry.line && e.price) || pool.find((e) => e.price) || pool[0] || null;
    }).map((e, i) => (e ? { step: ROUTINE_STEPS[i], entry: e } : null)).filter(Boolean);
  }

  function renderProductPage(id) {
    const host = document.getElementById('productPage');
    const entry = entryOf(id);
    if (!host || !entry) return false;
    const vi = isVi();
    const p = localized(entry);
    const raw = vi ? entry.vi : entry.ko;
    const brand = brandsData.find((b) => b.id === entry.brandId);
    const line = lineLabel(entry.brandId, entry.line);
    const step = routineStepOf(entry.category);
    const concerns = (entry.concerns || []).map((cid) => CONCERN_DEFS.find((c) => c.id === cid)).filter(Boolean);
    const images = [entry.image, ...((raw.gallery && raw.gallery.length ? raw.gallery : entry.vi.gallery) || [])].filter((v, i, a) => v && a.indexOf(v) === i);
    const video = raw.video || entry.vi.video || null;
    const price = entry.price;
    const ingredients = raw.ingredients || [];
    const benefits = raw.benefits || [];
    const related = productIndex.filter((e) => e.id !== id && e.brandId === entry.brandId && e.line === entry.line).slice(0, 4);
    const similar = productIndex.filter((e) => e.id !== id && e.brandId !== entry.brandId && (e.concerns || []).some((c) => (entry.concerns || []).includes(c))).slice(0, 4);
    const set = routineSetFor(entry);
    const setPriced = set.filter((s) => s.entry.price);
    const setTotal = setPriced.reduce((sum, s) => sum + s.entry.price, 0);

    const tabs = [
      { id: 'desc', label: vi ? 'Mô tả' : '상세 설명', html: `<p>${raw.desc || ''}</p>${raw.tag ? `<p class="pd-tagline">${raw.tag}</p>` : ''}` },
      ingredients.length ? { id: 'ing', label: vi ? 'Thành phần chính' : '주요 성분', html: `<ul class="pd-ingredients">${ingredients.map((i) => `<li><strong>${i.name}</strong><span>${i.desc || ''}</span></li>`).join('')}</ul>` } : null,
      benefits.length ? { id: 'ben', label: vi ? 'Công dụng' : '효능', html: `<ul class="pd-benefits">${benefits.map((b) => `<li>${b}</li>`).join('')}</ul>` } : null,
      raw.usage ? { id: 'use', label: vi ? 'Cách dùng' : '사용 방법', html: `<p>${raw.usage}</p>${step ? `<p class="pd-step-note">${vi ? `Dùng ở <strong>bước ${step.step} · ${step.vi}</strong> trong quy trình chăm sóc da.` : `스킨케어 <strong>${step.step}단계 · ${step.ko}</strong>에 사용하세요.`}</p>` : ''}` } : null,
      video ? { id: 'vid', label: 'Video', html: `<video class="pd-video" src="${video}" controls preload="none" playsinline poster="${entry.image}"></video>` } : null
    ].filter(Boolean);

    host.innerHTML = `
      <div class="container">
        <nav class="page-breadcrumb pd-breadcrumb" aria-label="Breadcrumb">
          <a href="#">${vi ? 'Trang chủ' : '홈'}</a><span class="sep">/</span>
          <a href="#/san-pham">${vi ? 'Sản phẩm' : '제품'}</a><span class="sep">/</span>
          <a href="#/thuong-hieu/${brand.id}">${brand.name}</a><span class="sep">/</span>
          <span>${p.name}</span>
        </nav>

        <div class="pd-main">
          <div class="pd-gallery">
            <div class="pd-stage" id="pdStage">
              <img src="${images[0]}" alt="${escapeHtml(p.name)}" id="pdMainImg">
              ${video ? `<button type="button" class="pd-video-badge" data-shop="pd-tab" data-tab="vid">▶ Video</button>` : ''}
            </div>
            ${images.length > 1 ? `
              <div class="pd-thumbs" role="list">
                ${images.map((src, i) => `<button type="button" class="pd-thumb ${i === 0 ? 'active' : ''}" data-shop="pd-thumb" data-src="${src}" aria-label="${vi ? 'Ảnh' : '이미지'} ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}
              </div>` : ''}
          </div>

          <div class="pd-info">
            <div class="pd-brandrow">
              <a href="#/thuong-hieu/${brand.id}" class="pd-brand">${brand.name}</a>
              ${line ? `<a href="#/thuong-hieu/${brand.id}?line=${entry.line}" class="pd-line">${line}</a>` : ''}
            </div>
            <h1 class="pd-title">${p.name}</h1>
            ${raw.tag ? `<p class="pd-subtitle">${raw.tag}</p>` : ''}

            <div class="pd-price-box">
              ${price
                ? `<span class="pd-price">${formatVnd(price)}</span>${entry.priceUnit ? `<span class="pd-unit">/ ${escapeHtml(entry.priceUnit)}</span>` : ''}`
                : `<span class="pd-price contact">${vi ? 'Giá: Liên hệ' : '가격: 문의'}</span>`}
              <small>${vi ? 'Giá niêm yết bán lẻ. Đại lý, spa, clinic vui lòng nhận báo giá sỉ.' : '소비자 정가입니다. 대리점·스파·클리닉은 도매 견적을 요청해 주세요.'}</small>
            </div>

            <dl class="pd-specs">
              <div><dt>${vi ? 'Quy cách' : '규격'}</dt><dd>${escapeHtml(entry.priceUnit || p.spec || '—')}</dd></div>
              <div><dt>${vi ? 'Danh mục' : '카테고리'}</dt><dd><a href="#/san-pham?cat=${entry.category}">${categoryLabel(entry.category)}</a></dd></div>
              ${step ? `<div><dt>${vi ? 'Bước dùng' : '사용 단계'}</dt><dd>${vi ? `Bước ${step.step} · ${step.vi}` : `${step.step}단계 · ${step.ko}`}</dd></div>` : ''}
              <div><dt>${vi ? 'Xuất xứ' : '원산지'}</dt><dd>${escapeHtml(brand.origin || 'Korea')}</dd></div>
            </dl>

            ${concerns.length ? `
              <div class="pd-concerns">
                <span>${vi ? 'Phù hợp:' : '추천 피부 고민:'}</span>
                ${concerns.map((c) => `<a href="#/san-pham?concern=${c.id}" class="pd-concern-chip">${vi ? c.vi : c.ko}</a>`).join('')}
              </div>` : ''}

            <div class="pd-buy" id="pdBuy">
              ${price ? `
                ${qtyControl(id, 1, 'pd')}
                <button type="button" class="btn-primary pd-add" data-shop="pd-add" data-product-id="${id}">${ICON_CART}<span>${vi ? 'Thêm vào giỏ' : '장바구니 담기'}</span></button>
                <button type="button" class="pd-buynow" data-shop="pd-buynow" data-product-id="${id}">${vi ? 'Mua ngay' : '바로 구매'}</button>
              ` : `
                <button type="button" class="btn-primary pd-add" data-action="product-quote" data-product-name="${escapeHtml(p.name)}" data-brand-name="${escapeHtml(brand.name)}">${vi ? 'Liên hệ báo giá' : '가격 문의'}</button>
              `}
            </div>
            ${price ? `<button type="button" class="pd-wholesale" data-action="product-quote" data-product-name="${escapeHtml(p.name)}" data-brand-name="${escapeHtml(brand.name)}">${vi ? 'Mua số lượng lớn? Nhận báo giá sỉ ↗' : '대량 구매? 도매 견적 요청 ↗'}</button>` : ''}

            <ul class="pd-trust">
              <li>${vi ? '100% chính ngạch, hóa đơn VAT' : '100% 정식 수입 · VAT 계산서'}</li>
              <li>${vi ? 'Sản xuất tại Hàn Quốc, chuẩn CGMP' : '한국 생산 · CGMP 기준'}</li>
              <li>${vi ? 'Thanh toán COD hoặc chuyển khoản' : '착불 또는 계좌 이체 결제'}</li>
            </ul>

            <div class="pd-share">
              <span>${vi ? 'Chia sẻ:' : '공유:'}</span>
              <button type="button" data-shop="share-copy">${vi ? 'Sao chép link' : '링크 복사'}</button>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/#/san-pham/' + id)}" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
        </div>

        <section class="pd-tabs-wrap">
          <div class="pd-tabs" role="tablist">
            ${tabs.map((t, i) => `<button type="button" class="pd-tab ${i === 0 ? 'active' : ''}" role="tab" aria-selected="${i === 0}" data-shop="pd-tab" data-tab="${t.id}">${t.label}</button>`).join('')}
          </div>
          ${tabs.map((t, i) => `<div class="pd-panel" data-panel="${t.id}" role="tabpanel" ${i === 0 ? '' : 'hidden'}>${t.html}</div>`).join('')}
        </section>

        ${set.length > 1 ? `
          <section class="pd-routine">
            <div class="pd-section-head">
              <h2>${vi ? 'Gợi ý quy trình hoàn chỉnh' : '추천 스킨케어 루틴'}</h2>
              <p>${vi ? `Các bước chăm sóc da cùng thương hiệu ${brand.name}` : `${brand.name} 제품으로 구성한 단계별 루틴`}</p>
            </div>
            <ol class="pd-routine-list">
              ${set.map((s) => {
                const sp = localized(s.entry);
                return `
                  <li class="${s.entry.id === id ? 'current' : ''}">
                    <span class="pd-routine-step">${vi ? `Bước ${s.step.step}` : `${s.step.step}단계`}<small>${vi ? s.step.vi : s.step.ko}</small></span>
                    <a href="#/san-pham/${sp.id}" class="pd-routine-item"><img src="${sp.image}" alt="" loading="lazy"><span><strong>${sp.name}</strong><small>${s.entry.price ? formatVnd(s.entry.price) : (vi ? 'Liên hệ' : '문의')}</small></span></a>
                  </li>`;
              }).join('')}
            </ol>
            ${setPriced.length > 1 ? `
              <div class="pd-routine-foot">
                <span>${vi ? `Tổng ${setPriced.length} sản phẩm có giá:` : `가격 표시 제품 ${setPriced.length}개 합계:`} <strong>${formatVnd(setTotal)}</strong></span>
                <button type="button" class="btn-primary" data-shop="add-set" data-ids="${setPriced.map((s) => s.entry.id).join(',')}">${vi ? 'Thêm cả bộ vào giỏ' : '루틴 전체 담기'}</button>
              </div>` : ''}
          </section>` : ''}

        ${related.length ? `
          <section class="pd-related">
            <div class="pd-section-head"><h2>${vi ? `Cùng dòng ${line || brand.name}` : `${line || brand.name} 라인 제품`}</h2></div>
            <div class="pd-related-grid">${related.map(productCardHtml).join('')}</div>
          </section>` : ''}

        ${similar.length ? `
          <section class="pd-related">
            <div class="pd-section-head"><h2>${vi ? 'Có thể bạn quan tâm' : '함께 보면 좋은 제품'}</h2></div>
            <div class="pd-related-grid">${similar.map(productCardHtml).join('')}</div>
          </section>` : ''}
      </div>

      ${price ? `
        <div class="pd-sticky" id="pdSticky" hidden>
          <div class="container pd-sticky-inner">
            <img src="${entry.image}" alt="">
            <span class="pd-sticky-name"><strong>${p.name}</strong><small>${formatVnd(price)}</small></span>
            <button type="button" class="btn-primary" data-shop="pd-add" data-product-id="${id}">${ICON_CART}<span>${vi ? 'Thêm vào giỏ' : '담기'}</span></button>
          </div>
        </div>` : ''}
    `;
    bindProductPage(host);
    return true;
  }

  let stickyObserver = null;
  function bindProductPage(host) {
    const stage = host.querySelector('#pdStage');
    const img = host.querySelector('#pdMainImg');
    if (stage && img && window.matchMedia('(hover: hover)').matches) {
      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
        stage.classList.add('zoom');
      });
      stage.addEventListener('mouseleave', () => stage.classList.remove('zoom'));
    }
    if (stickyObserver) { stickyObserver.disconnect(); stickyObserver = null; }
    const buy = host.querySelector('#pdBuy');
    const sticky = host.querySelector('#pdSticky');
    if (buy && sticky && 'IntersectionObserver' in window) {
      stickyObserver = new IntersectionObserver(([en]) => {
        const out = !en.isIntersecting && en.boundingClientRect.top < 0;
        sticky.hidden = !out;
        sticky.classList.toggle('show', out);
      });
      stickyObserver.observe(buy);
    }
  }

  function leaveProductPage() {
    if (stickyObserver) { stickyObserver.disconnect(); stickyObserver = null; }
    const host = document.getElementById('productPage');
    if (host) host.innerHTML = '';
  }

  function productSeo(id, absoluteUrl) {
    const entry = entryOf(id);
    if (!entry) return null;
    const p = localized(entry);
    const raw = isVi() ? entry.vi : entry.ko;
    const brand = brandsData.find((b) => b.id === entry.brandId);
    const url = absoluteUrl(`/#/san-pham/${id}`);
    const image = absoluteUrl(entry.image);
    const description = String(raw.desc || p.tag || '').replace(/\s+/g, ' ').slice(0, 158);
    const product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      image: [image],
      description,
      sku: id,
      brand: { '@type': 'Brand', name: brand.name },
      category: categoryLabel(entry.category)
    };
    if (entry.price) product.offers = { '@type': 'Offer', price: entry.price, priceCurrency: 'VND', url };
    return {
      title: `${p.name} – ${brand.name} chính hãng | beVIBE`,
      description,
      url,
      image,
      type: 'product',
      jsonLd: [
        product,
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Sản phẩm', item: absoluteUrl('/#/san-pham') },
            { '@type': 'ListItem', position: 3, name: brand.name, item: absoluteUrl(`/#/thuong-hieu/${brand.id}`) },
            { '@type': 'ListItem', position: 4, name: p.name, item: url }
          ]
        }
      ]
    };
  }

  /* ---------------- Events ---------------- */
  function qtyInputFor(id, scopeEl) {
    return (scopeEl || document).querySelector(`input[data-shop-qty="${id}"]`);
  }

  document.addEventListener('click', async (e) => {
    const el = e.target.closest('[data-shop]');
    if (!el) return;
    const act = el.getAttribute('data-shop');
    const id = el.getAttribute('data-product-id');
    const vi = isVi();
    switch (act) {
      case 'add':
        e.preventDefault();
        e.stopPropagation();
        addToCart(id, 1);
        break;
      case 'open-cart':
        openCart();
        break;
      case 'close-cart':
        closeOverlay(drawer);
        break;
      case 'qty-inc':
      case 'qty-dec': {
        const scope = el.closest('[data-qty-scope]');
        const input = qtyInputFor(id, scope);
        const next = (parseInt(input ? input.value : '1', 10) || 1) + (act === 'qty-inc' ? 1 : -1);
        const val = Math.max(1, Math.min(99, next));
        if (scope && scope.getAttribute('data-qty-scope') === 'cart') setQty(id, val);
        else if (input) input.value = val;
        break;
      }
      case 'remove':
        removeFromCart(id);
        break;
      case 'checkout':
        openCheckout();
        break;
      case 'close-checkout':
        closeOverlay(checkout);
        break;
      case 'pd-add':
      case 'pd-buynow': {
        const input = qtyInputFor(id, document.getElementById('pdBuy'));
        const qty = input ? input.value : 1;
        if (act === 'pd-add') addToCart(id, qty);
        else { addToCart(id, qty, { silent: true }); openCheckout(); }
        break;
      }
      case 'add-set': {
        const ids = (el.getAttribute('data-ids') || '').split(',').filter(Boolean);
        ids.forEach((pid) => addToCart(pid, 1, { silent: true }));
        showToast(vi ? `Đã thêm ${ids.length} sản phẩm của quy trình vào giỏ ✓` : `루틴 제품 ${ids.length}개를 담았습니다 ✓`);
        openCart();
        break;
      }
      case 'pd-thumb': {
        const img = document.getElementById('pdMainImg');
        if (img) img.src = el.getAttribute('data-src');
        el.parentElement.querySelectorAll('.pd-thumb').forEach((t) => t.classList.toggle('active', t === el));
        break;
      }
      case 'pd-tab': {
        const tab = el.getAttribute('data-tab');
        const wrap = document.querySelector('.pd-tabs-wrap');
        if (!wrap) break;
        wrap.querySelectorAll('.pd-tab').forEach((t) => {
          const on = t.getAttribute('data-tab') === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-selected', String(on));
        });
        wrap.querySelectorAll('.pd-panel').forEach((pnl) => { pnl.hidden = pnl.getAttribute('data-panel') !== tab; });
        if (el.classList.contains('pd-video-badge')) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'share-copy': {
        const link = `${window.location.origin}/#/san-pham/${(window.location.hash.split('/')[2] || '').split('?')[0]}`;
        try { await navigator.clipboard.writeText(link); showToast(vi ? 'Đã sao chép link sản phẩm ✓' : '제품 링크를 복사했습니다 ✓'); } catch (err) { showToast(link); }
        break;
      }
      case 'routine-step':
        activeStep = parseInt(el.getAttribute('data-step'), 10) || 1;
        renderSkinCare();
        break;
      case 'send-zalo':
        if (lastOrder) {
          const ok = await copyText(lastOrder.text);
          showToast(ok
            ? (vi ? 'Đã sao chép đơn hàng — dán vào khung chat Zalo để gửi.' : '주문서를 복사했습니다 — Zalo 채팅창에 붙여넣어 보내세요.')
            : (vi ? 'Hãy sao chép nội dung đơn rồi dán vào Zalo.' : '주문 내용을 복사해 Zalo에 붙여넣어 주세요.'));
          window.open(`https://zalo.me/${ORDER_ZALO}`, '_blank', 'noopener');
        }
        break;
      case 'send-email':
        if (lastOrder) {
          const subject = encodeURIComponent(`${vi ? 'Đơn đặt hàng beVIBE' : '비바이브 주문'} ${lastOrder.code}`);
          window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${encodeURIComponent(lastOrder.text)}`;
        }
        break;
      case 'copy-order':
        if (lastOrder) {
          const ok = await copyText(lastOrder.text);
          showToast(ok ? (vi ? 'Đã sao chép nội dung đơn hàng ✓' : '주문 내용을 복사했습니다 ✓') : (vi ? 'Không sao chép được, hãy chọn và sao chép thủ công.' : '복사에 실패했습니다. 직접 복사해 주세요.'));
        }
        break;
      case 'finish-order':
        clearCart();
        lastOrder = null;
        closeOverlay(checkout);
        showToast(vi ? 'Cảm ơn bạn! beVIBE sẽ gọi xác nhận đơn sớm nhất.' : '감사합니다! 곧 주문 확인 연락을 드리겠습니다.');
        break;
      default:
        break;
    }
  });

  document.addEventListener('change', (e) => {
    const input = e.target.closest('input[data-shop-qty]');
    if (!input) return;
    const scope = input.closest('[data-qty-scope]');
    const val = Math.max(1, Math.min(99, parseInt(input.value, 10) || 1));
    input.value = val;
    if (scope && scope.getAttribute('data-qty-scope') === 'cart') setQty(input.getAttribute('data-shop-qty'), val);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (checkout && !checkout.hidden) closeOverlay(checkout);
    else if (drawer && !drawer.hidden) closeOverlay(drawer);
  });

  drawer?.querySelectorAll('[data-cart-close]').forEach((x) => x.addEventListener('click', () => closeOverlay(drawer)));
  checkout?.querySelectorAll('[data-checkout-close]').forEach((x) => x.addEventListener('click', () => closeOverlay(checkout)));

  // Keep several tabs in sync
  window.addEventListener('storage', (e) => {
    if (e.key !== cartKey) return;
    cart = cleanItems(safeGet(cartKey, []));
    renderCartBadge();
    renderCartDrawer();
  });

  renderCartBadge();
  renderSkinCare();

  return {
    renderProductPage,
    leaveProductPage,
    productSeo,
    hasProduct: (id) => !!entryOf(id),
    refresh(currentProductId) {
      renderCartBadge();
      renderCartDrawer();
      renderSkinCare();
      if (currentProductId) renderProductPage(currentProductId);
      if (checkout && !checkout.hidden) {
        if (lastOrder) renderCheckoutDone();
        else renderCheckoutForm();
      }
    },
    addToCart,
    cartCount,
    openCart,
    switchAccount,
    applyRemoteCart,
    setCustomerDefaults,
    onCartChange(fn) { cartListener = fn; },
    setTokenProvider(fn) { tokenProvider = fn; }
  };
}
