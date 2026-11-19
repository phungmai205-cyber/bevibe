/**
 * counselor.js — Phân hệ Quản lý & Báo cáo dành cho Counselor (Tư vấn viên / Đại lý sỉ) beVIBE
 *
 * Cơ chế hoạt động:
 * 1. Đăng nhập bằng Mã Counselor + số điện thoại đã đăng ký (form trong account.js).
 * 2. Chiết khấu sỉ theo nhóm sản phẩm + số lượng (bảng trong counselor-policy.js, ví dụ Mỹ phẩm 55%).
 * 3. Quỹ thưởng cuối năm: 5% trên tiền nhập (thực trả), trao tiền mặt / hiện vật cuối năm.
 * 4. Báo cáo: doanh số niêm yết, chiết khấu, tiền nhập, lợi nhuận gộp, quỹ thưởng, ROI (công thức ở counselor-policy.js).
 * 5. Đơn sỉ gửi vào hệ thống đơn hàng (admin → Đơn hàng → Tư vấn viên), beVIBE xác nhận chiết khấu.
 */

import { productPrices, formatVnd, SOLD_OUT_CATEGORIES } from './prices.js';
import { brandsData, tpcnData } from './translations.js';
import { ORDER_ENDPOINT, sendOrderToSupabase } from './order-config.js';
import { detectCategory } from './catalog-defs.js';
import {
  PRODUCT_GROUPS, DISCOUNT_TIERS, BONUS_RATE, REWARD_LEVELS, BONUS_STATUSES, CANCELLED_STATUSES,
  calcOrder, summarize, rewardLevel
} from './counselor-policy.js';

const esc = (str) => String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const STORAGE_KEY_COUNSELOR = 'bevibe_counselor_session_v1';
const STORAGE_KEY_ORDERS = 'bevibe_counselor_orders_v1';

// Danh sách Counselor mặc định do beVIBE cấp mã
export const REGISTERED_COUNSELORS = [
  {
    code: 'BV0001',
    name: 'Nguyễn Thu Hà',
    phone: '0912 345 678',
    level: 'Kim Cương ⭐⭐⭐',
    region: 'Hà Nội',
    joinDate: '15/01/2026',
    discountRate: 0.55, // 55%
    bonusRate: 0.05,    // 5% trích thưởng
    targetReward: 50000000,
    targetRewardName: 'Chuyến du lịch Hàn Quốc 5N4Đ + Thưởng 10.000.000 đ'
  },
  {
    code: 'BV0002',
    name: 'Trần Minh Tâm',
    phone: '0987 654 321',
    level: 'Vàng ⭐⭐',
    region: 'TP. Hồ Chí Minh',
    joinDate: '20/02/2026',
    discountRate: 0.55,
    bonusRate: 0.05,
    targetReward: 30000000,
    targetRewardName: '01 Chỉ vàng 9999 PNJ + Bộ quà tặng beVIBE VIP'
  },
  {
    code: 'BV0003',
    name: 'Lê Hoàng Yến',
    phone: '0903 112 233',
    level: 'Bạc ⭐',
    region: 'Đà Nẵng',
    joinDate: '10/03/2026',
    discountRate: 0.55,
    bonusRate: 0.05,
    targetReward: 15000000,
    targetRewardName: 'Phần thưởng tiền mặt 15.000.000 đ'
  }
];

// Chuẩn hóa mã Counselor: BV 0001, bv0001, BV-0001 -> BV0001
export function normalizeCounselorCode(input) {
  if (!input) return '';
  return String(input).trim().toUpperCase().replace(/[\s\-_]/g, '');
}

// Lấy thông tin Counselor hiện tại đang đăng nhập
export function getCurrentCounselor() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUNSELOR);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Lưu phiên đăng nhập Counselor
export function setCounselorSession(counselor) {
  localStorage.setItem(STORAGE_KEY_COUNSELOR, JSON.stringify(counselor));
  updateCounselorNavUI();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bevibe:auth-change'));
    if (typeof window.__updateHeaderAuthUI === 'function') {
      window.__updateHeaderAuthUI();
    }
  }
}

// Đăng xuất
export function clearCounselorSession() {
  localStorage.removeItem(STORAGE_KEY_COUNSELOR);
  updateCounselorNavUI();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bevibe:auth-change'));
    if (typeof window.__updateHeaderAuthUI === 'function') {
      window.__updateHeaderAuthUI();
    }
  }
}

// Lấy danh sách đơn hàng sỉ của Counselor
export function getCounselorOrders(code) {
  const norm = normalizeCounselorCode(code);
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
    return all.filter((o) => normalizeCounselorCode(o.counselorCode) === norm);
  } catch (e) {
    return [];
  }
}

// Lưu đơn hàng sỉ mới
export function recordCounselorOrder(order) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
    all.unshift(order);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(all));
  } catch (e) {
    console.warn('Lỗi lưu đơn counselor:', e);
  }
}

/**
 * Đơn cũ (một sản phẩm, lưu trước khi có bảng chính sách) → dạng mới để báo cáo đọc được.
 */
function normalizeOrder(o) {
  if (o && Array.isArray(o.lines)) return o;
  const gmv = Number(o.retailTotal) || 0;
  const cost = Number(o.wholesaleCost) || 0;
  const [d, m, y] = String(o.date || '').split('/').map(Number);
  return {
    orderId: o.orderId,
    code: '',
    counselorCode: o.counselorCode,
    createdAt: y ? new Date(y, (m || 1) - 1, d || 1, 12).toISOString() : new Date(0).toISOString(),
    status: o.status === 'Chờ duyệt sỉ' ? 'Chờ xác nhận' : (o.status || 'Chờ xác nhận'),
    lines: [{ id: o.productId, name: o.productName, group: 'cosmetics', price: Number(o.unitPrice) || 0, qty: Number(o.quantity) || 0, gmv, discount: gmv - cost, cost, tierCode: '' }],
    qty: Number(o.quantity) || 0,
    gmv,
    discount: gmv - cost,
    cost,
    bonus: Number(o.bonusReward) || 0,
    sellRevenue: gmv,
    note: o.note || ''
  };
}

/**
 * Sản phẩm Counselor được đặt sỉ: chỉ sản phẩm có giá trong bảng giá (giá admin cập nhật trên web)
 * và không thuộc danh mục đang hết hàng. Không bịa giá cho sản phẩm "Liên hệ".
 */
export function getAllAvailableProducts() {
  const list = [];
  const add = (b, p, category, group) => {
    const pr = productPrices[p.id];
    if (!pr || !(Number(pr.price) > 0)) return;
    if (SOLD_OUT_CATEGORIES.includes(category)) return;
    list.push({
      id: p.id,
      name: p.name,
      brand: b.name,
      group,
      image: p.image || '/assets/images/lineup.jpg',
      price: Number(pr.price),
      spec: pr.unit || p.spec || ''
    });
  };
  (brandsData || []).forEach((b) => (b.productsVi || []).forEach((p) => add(b, p, detectCategory(p.name, b.id), 'cosmetics')));
  (tpcnData || []).forEach((b) => (b.productsVi || []).forEach((p) => add(b, p, p.category || 'tpcn', 'tpcn')));
  return list;
}

// -----------------------------------------------------------------------------
// UI: Cập nhật hiển thị nút Counselor trên Header & Mobile
// -----------------------------------------------------------------------------
export function updateCounselorNavUI() {
  const counselor = getCurrentCounselor();
  const btnDesktop = document.getElementById('counselorNavBtn');
  const btnMobile = document.getElementById('counselorMobileBtn');

  const label = counselor
    ? `<span class="csl-badge-dot"></span><span>${esc(counselor.code)} · ${esc(String(counselor.name || '').split(' ').pop())}</span>`
    : `<span>Đăng nhập Counselor</span>`;

  if (btnDesktop) {
    btnDesktop.innerHTML = label;
    btnDesktop.classList.toggle('is-logged-in', !!counselor);
  }
  if (btnMobile) {
    btnMobile.innerHTML = counselor
      ? `💎 Counselor: ${esc(counselor.code)} (${esc(counselor.name)})`
      : `💎 Đăng nhập Counselor (Tư vấn viên)`;
    btnMobile.classList.toggle('is-logged-in', !!counselor);
  }
}

// -----------------------------------------------------------------------------
// Đăng nhập Counselor: dùng form chung trong account.js (mã + số điện thoại)
// -----------------------------------------------------------------------------
export function openCounselorLoginModal() {
  if (typeof window !== 'undefined' && typeof window.__bevibeOpenAccountModal === 'function') {
    window.__bevibeOpenAccountModal('login', { role: 'counselor' });
  }
}

// -----------------------------------------------------------------------------
// UI: Phân hệ Counselor #/counselor
//   Báo cáo (doanh số, tiền nhập, lợi nhuận, quỹ thưởng) · Chính sách chiết khấu · Đặt hàng sỉ · Lịch sử
// -----------------------------------------------------------------------------
const DRAFT_KEY = 'bevibe_counselor_draft_v1';
const ui = { period: 'year', group: 'all', q: '', tab: 'order' };

const pct = (r) => `${Math.round(r * 1000) / 10}%`;
const vnDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('vi-VN');
};

function readDraft(code) {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    return all && typeof all === 'object' && all[code] ? all[code] : { items: {}, ship: {} };
  } catch (e) {
    return { items: {}, ship: {} };
  }
}

function saveDraft(code, draft) {
  try {
    const all = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {};
    all[code] = draft;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
  } catch (e) { /* storage blocked */ }
}

function periodRange(key) {
  const now = new Date();
  const y = now.getFullYear();
  if (key === 'month') return { from: new Date(y, now.getMonth(), 1), label: `Tháng ${now.getMonth() + 1}/${y}` };
  if (key === 'quarter') {
    const q = Math.floor(now.getMonth() / 3);
    return { from: new Date(y, q * 3, 1), label: `Quý ${q + 1}/${y}` };
  }
  if (key === 'year') return { from: new Date(y, 0, 1), label: `Năm ${y}` };
  return { from: new Date(0), label: 'Toàn bộ' };
}

// Order lines from the draft, priced again from the current price list
function draftLines(draft, products) {
  return Object.entries(draft.items || {}).map(([id, qty]) => {
    const p = products.find((x) => x.id === id);
    return p ? { id, name: p.name, group: p.group, price: p.price, qty: Math.min(9999, Math.max(1, parseInt(qty, 10) || 1)), spec: p.spec, image: p.image } : null;
  }).filter(Boolean);
}

async function postOrder(payload) {
  const init = { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) };
  try {
    const res = await fetch(ORDER_ENDPOINT, init);
    try { return await res.json(); } catch (e) { return { ok: true, unverified: true }; }
  } catch (err) {
    // Answer not readable (CORS): send without reading it, the requestId stops a double order
    await fetch(ORDER_ENDPOINT, { ...init, mode: 'no-cors' });
    return { ok: true, unverified: true };
  }
}

export function renderCounselorDashboard() {
  const counselor = getCurrentCounselor();
  if (!counselor) {
    openCounselorLoginModal();
    return;
  }
  const container = document.getElementById('counselorPortalView');
  if (!container) return;

  const products = getAllAvailableProducts();
  const allOrders = getCounselorOrders(counselor.code).map(normalizeOrder)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const range = periodRange(ui.period);
  const orders = allOrders.filter((o) => new Date(o.createdAt) >= range.from);
  const rep = summarize(orders);
  const yearRep = summarize(allOrders.filter((o) => new Date(o.createdAt) >= periodRange('year').from));
  const lvl = rewardLevel(yearRep.cost);
  const draft = readDraft(counselor.code);
  const lines = draftLines(draft, products);
  const calc = calcOrder(lines);

  // Monthly report (this year) and top products in the period
  const y = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, m) => {
    const list = allOrders.filter((o) => { const d = new Date(o.createdAt); return d.getFullYear() === y && d.getMonth() === m; });
    return { m, ...summarize(list) };
  }).filter((r) => r.orders > 0);
  const topMap = {};
  orders.filter((o) => !CANCELLED_STATUSES.includes(o.status)).forEach((o) => o.lines.forEach((l) => {
    const t = topMap[l.id] || (topMap[l.id] = { name: l.name, qty: 0, gmv: 0, cost: 0 });
    t.qty += l.qty; t.gmv += l.gmv; t.cost += l.cost;
  }));
  const top = Object.values(topMap).sort((a, b) => b.gmv - a.gmv).slice(0, 5);

  const shownProducts = products.filter((p) => (ui.group === 'all' || p.group === ui.group)
    && (!ui.q || `${p.name} ${p.brand}`.toLowerCase().includes(ui.q.toLowerCase())));
  const ship = draft.ship || {};

  const kpi = (label, value, note, cls = '') => `
    <div class="csl-kpi-card ${cls}">
      <div class="csl-kpi-label">${label}</div>
      <div class="csl-kpi-value">${value}</div>
      <div class="csl-kpi-note">${note}</div>
    </div>`;

  container.innerHTML = `
    <div class="container csl-dashboard-wrap">
      <div class="csl-dash-top">
        <div class="csl-user-info">
          <div class="csl-avatar">${esc(String(counselor.code).slice(0, 2))}</div>
          <div>
            <div class="csl-title-row">
              <h2>${esc(counselor.name)}</h2>
              <span class="csl-pill-code">${esc(counselor.code)}</span>
              <span class="csl-pill-level">Hạng ${esc(lvl.level.name)} (tạm tính)</span>
            </div>
            <p class="csl-meta-sub">Điện thoại: <strong>${esc(counselor.phone)}</strong>${counselor.email ? ` · Email: <strong>${esc(counselor.email)}</strong>` : ''} · Tham gia: <strong>${esc(counselor.joinDate)}</strong></p>
          </div>
        </div>
        <div class="csl-top-actions">
          <button type="button" class="csl-btn-outline" data-csl="logout">Đăng xuất</button>
        </div>
      </div>

      <!-- Report -->
      <div class="csl-report-head">
        <h3>Báo cáo kinh doanh · ${esc(range.label)}</h3>
        <div class="csl-seg" role="tablist" aria-label="Kỳ báo cáo">
          ${[['month', 'Tháng này'], ['quarter', 'Quý này'], ['year', 'Năm nay'], ['all', 'Toàn bộ']].map(([k, l]) => `
            <button type="button" class="${ui.period === k ? 'active' : ''}" data-csl-period="${k}">${l}</button>`).join('')}
        </div>
      </div>
      <div class="csl-kpi-grid csl-kpi-grid-6">
        ${kpi('Doanh số niêm yết (GMV)', formatVnd(rep.gmv), `${rep.orders} đơn · ${rep.qty} sản phẩm`)}
        ${kpi('Chiết khấu được hưởng', formatVnd(rep.discount), `Bình quân ${pct(rep.gmv ? rep.discount / rep.gmv : 0)} giá niêm yết`, 'highlight-gold')}
        ${kpi('Tiền nhập (thực trả)', formatVnd(rep.cost), 'GMV − Chiết khấu')}
        ${kpi('Lợi nhuận gộp dự kiến', formatVnd(rep.grossProfit), `Biên ${pct(rep.margin)} · nếu bán đúng giá niêm yết`, 'highlight-green')}
        ${kpi('Quỹ thưởng cuối năm (5%)', formatVnd(rep.bonus), `Chính thức ${formatVnd(rep.bonusConfirmed)} · tạm tính ${formatVnd(rep.bonusPending)}`, 'highlight-purple')}
        ${kpi('Tổng lợi ích · ROI', formatVnd(rep.totalGain), `Tỷ suất trên vốn ${pct(rep.roi)}`)}
      </div>

      <div class="csl-bonus-banner">
        <div class="csl-bonus-content">
          <div class="csl-bonus-head">
            <div>
              <h3>Quỹ thưởng &amp; hạng Counselor năm ${y}</h3>
              <p>Hạng <strong>${esc(lvl.level.name)}</strong>: ${esc(lvl.level.gift)}.
                ${lvl.next ? `Nhập thêm <strong>${formatVnd(lvl.next.min - yearRep.cost)}</strong> để lên hạng <strong>${esc(lvl.next.name)}</strong> (${esc(lvl.next.gift)}).` : 'Bạn đang ở hạng cao nhất.'}</p>
            </div>
            <div class="csl-bonus-digit"><span>Quỹ thưởng năm:</span><strong>${formatVnd(yearRep.bonus)}</strong></div>
          </div>
          <div class="csl-progress-bar-wrap"><div class="csl-progress-bar" style="width: ${Math.round(lvl.progress * 100)}%;"></div></div>
          <div class="csl-progress-labels">
            <span>Tiền nhập năm nay: <strong>${formatVnd(yearRep.cost)}</strong></span>
            <span>Quỹ thưởng = 5% × tiền nhập của đơn đã hoàn tất, trao cuối năm bằng tiền mặt hoặc hiện vật</span>
          </div>
        </div>
      </div>

      <div class="csl-tabs" role="tablist">
        ${[['order', 'Đặt hàng sỉ'], ['report', 'Báo cáo chi tiết'], ['history', `Lịch sử đơn (${allOrders.length})`], ['policy', 'Chính sách & công thức']].map(([k, l]) => `
          <button type="button" class="csl-tab ${ui.tab === k ? 'active' : ''}" data-csl-tab="${k}">${l}</button>`).join('')}
      </div>

      ${ui.tab === 'order' ? `
      <div class="csl-section-box">
        <div class="csl-order-grid">
          <div>
            <div class="csl-product-tools">
              <input type="search" class="csl-input" placeholder="Tìm sản phẩm…" value="${esc(ui.q)}" data-csl="search">
              <div class="csl-seg">
                ${[['all', 'Tất cả'], ['cosmetics', 'Mỹ phẩm'], ['tpcn', 'TPCN']].map(([k, l]) => `
                  <button type="button" class="${ui.group === k ? 'active' : ''}" data-csl-group="${k}">${l}</button>`).join('')}
              </div>
            </div>
            <div class="csl-product-list">
              ${shownProducts.length ? shownProducts.map((p) => `
                <div class="csl-product-row">
                  <img src="${esc(p.image)}" alt="" loading="lazy">
                  <div class="csl-product-info">
                    <strong>${esc(p.name)}</strong>
                    <small>${esc(PRODUCT_GROUPS[p.group].vi)} · ${esc(p.spec)} · Giá niêm yết ${formatVnd(p.price)}</small>
                  </div>
                  <button type="button" class="csl-btn-add ${draft.items[p.id] ? 'is-in' : ''}" data-csl-add="${esc(p.id)}">${draft.items[p.id] ? `Đã chọn ${draft.items[p.id]}` : '+ Thêm'}</button>
                </div>`).join('') : '<p class="csl-muted">Không có sản phẩm phù hợp.</p>'}
            </div>
          </div>

          <div class="csl-cart">
            <h4>Đơn sỉ của bạn</h4>
            ${calc.lines.length ? `
              <div class="csl-cart-lines">
                ${calc.lines.map((l) => `
                  <div class="csl-cart-line">
                    <div class="csl-cart-name"><strong>${esc(l.name)}</strong><small>${formatVnd(l.price)} · CK ${pct(l.rate)} (${esc(l.tierCode)})</small></div>
                    <input type="number" class="csl-qty" min="1" max="9999" value="${l.qty}" data-csl-qty="${esc(l.id)}" aria-label="Số lượng ${esc(l.name)}">
                    <span class="csl-cart-cost">${formatVnd(l.cost)}</span>
                    <button type="button" class="csl-cart-x" data-csl-remove="${esc(l.id)}" aria-label="Bỏ ${esc(l.name)}">×</button>
                  </div>`).join('')}
              </div>
              ${Object.entries(calc.groups).map(([g, x]) => `
                <p class="csl-tier-note"><strong>${esc(PRODUCT_GROUPS[g].vi)}</strong>: ${x.qty} sp → bậc <strong>${pct(x.tier.rate)}</strong> (${esc(x.tier.code)})${x.next ? `. Thêm <strong>${x.next.min - x.qty}</strong> sp để được <strong>${pct(x.next.rate)}</strong>.` : '.'}</p>`).join('')}
              <div class="csl-res-row"><span>Doanh số niêm yết (GMV)</span><strong>${formatVnd(calc.gmv)}</strong></div>
              <div class="csl-res-row text-gold"><span>Chiết khấu (${pct(calc.avgRate)})</span><strong>−${formatVnd(calc.discount)}</strong></div>
              <div class="csl-res-row total-row"><span>Tiền nhập (thực trả)</span><span class="csl-big-price">${formatVnd(calc.cost)}</span></div>
              <div class="csl-res-breakdown">
                <div class="csl-pill-row"><span>Lợi nhuận gộp nếu bán đúng giá niêm yết</span><strong class="text-green">${formatVnd(calc.grossProfit)}</strong></div>
                <div class="csl-pill-row"><span>Quỹ thưởng cuối năm (5% tiền nhập)</span><strong class="text-purple">+${formatVnd(calc.bonus)}</strong></div>
                <div class="csl-pill-row"><span>Tỷ suất trên vốn (ROI)</span><strong>${pct(calc.roi)}</strong></div>
              </div>

              <form class="csl-ship-form" data-csl="ship">
                <h4>Thông tin nhận hàng</h4>
                <label class="csl-field"><span>Tỉnh / Thành phố *</span><input class="csl-input" name="city" required value="${esc(ship.city || '')}"></label>
                <label class="csl-field"><span>Địa chỉ nhận hàng *</span><input class="csl-input" name="address" required value="${esc(ship.address || '')}"></label>
                <label class="csl-field"><span>Ghi chú</span><input class="csl-input" name="note" maxlength="200" placeholder="Xuất hóa đơn VAT, giờ nhận hàng…" value="${esc(ship.note || '')}"></label>
                <div class="csl-pay">
                  <label><input type="radio" name="pay" value="bank" ${ship.pay !== 'cod' ? 'checked' : ''}> Chuyển khoản</label>
                  <label><input type="radio" name="pay" value="cod" ${ship.pay === 'cod' ? 'checked' : ''}> Thanh toán khi nhận hàng</label>
                </div>
                <p class="csl-error-msg" data-csl="err" hidden></p>
                <button type="submit" class="csl-btn-submit-order"><span>Gửi đơn sỉ</span></button>
                <small class="csl-muted">beVIBE gọi xác nhận đơn và chiết khấu trước khi giao. Giá và chiết khấu cuối cùng theo xác nhận của beVIBE.</small>
              </form>` : '<p class="csl-muted">Chọn sản phẩm ở bên trái để bắt đầu. Chiết khấu tự tính theo nhóm sản phẩm và số lượng.</p>'}
          </div>
        </div>
      </div>` : ''}

      ${ui.tab === 'report' ? `
      <div class="csl-section-box">
        <div class="csl-section-head"><h3>Báo cáo theo tháng · năm ${y}</h3></div>
        ${months.length ? `
        <div class="csl-table-wrap"><table class="csl-table">
          <thead><tr><th>Tháng</th><th>Số đơn</th><th>SL</th><th>Doanh số niêm yết</th><th>Chiết khấu</th><th>Tiền nhập</th><th>Lợi nhuận gộp</th><th>Quỹ thưởng</th></tr></thead>
          <tbody>${months.map((r) => `<tr><td>Tháng ${r.m + 1}</td><td>${r.orders}</td><td>${r.qty}</td><td>${formatVnd(r.gmv)}</td><td>${formatVnd(r.discount)}</td><td class="text-bold">${formatVnd(r.cost)}</td><td class="text-green">${formatVnd(r.grossProfit)}</td><td class="text-purple">${formatVnd(r.bonus)}</td></tr>`).join('')}
            <tr class="csl-total-row"><td>Cả năm</td><td>${yearRep.orders}</td><td>${yearRep.qty}</td><td>${formatVnd(yearRep.gmv)}</td><td>${formatVnd(yearRep.discount)}</td><td>${formatVnd(yearRep.cost)}</td><td>${formatVnd(yearRep.grossProfit)}</td><td>${formatVnd(yearRep.bonus)}</td></tr>
          </tbody></table></div>` : '<p class="csl-muted">Chưa có đơn sỉ trong năm nay.</p>'}
      </div>
      <div class="csl-section-box">
        <div class="csl-section-head"><h3>Sản phẩm nhập nhiều nhất · ${esc(range.label)}</h3></div>
        ${top.length ? `<div class="csl-table-wrap"><table class="csl-table">
          <thead><tr><th>Sản phẩm</th><th>SL</th><th>Doanh số niêm yết</th><th>Tiền nhập</th><th>Lợi nhuận gộp</th></tr></thead>
          <tbody>${top.map((t) => `<tr><td>${esc(t.name)}</td><td>${t.qty}</td><td>${formatVnd(t.gmv)}</td><td>${formatVnd(t.cost)}</td><td class="text-green">${formatVnd(t.gmv - t.cost)}</td></tr>`).join('')}</tbody>
        </table></div>` : '<p class="csl-muted">Chưa có dữ liệu trong kỳ này.</p>'}
      </div>` : ''}

      ${ui.tab === 'history' ? `
      <div class="csl-section-box">
        ${allOrders.length ? `<div class="csl-table-wrap"><table class="csl-table">
          <thead><tr><th>Mã đơn</th><th>Ngày</th><th>Sản phẩm</th><th>SL</th><th>Doanh số niêm yết</th><th>Tiền nhập</th><th>Quỹ thưởng</th><th>Trạng thái</th></tr></thead>
          <tbody>${allOrders.map((o) => `<tr>
            <td><strong>${esc(o.code || o.orderId)}</strong></td><td>${esc(vnDate(o.createdAt))}</td>
            <td>${o.lines.map((l) => `${esc(l.name)} × ${l.qty}`).join('<br>')}</td><td>${o.qty}</td>
            <td>${formatVnd(o.gmv)}</td><td class="text-bold">${formatVnd(o.cost)}</td><td class="text-purple">${formatVnd(o.bonus)}</td>
            <td><span class="csl-status-badge ${CANCELLED_STATUSES.includes(o.status) ? 'is-cancel' : BONUS_STATUSES.includes(o.status) ? 'is-paid' : 'is-pending'}">${esc(o.status)}</span></td>
          </tr>`).join('')}</tbody></table></div>
          <p class="csl-muted">Trạng thái đơn do beVIBE cập nhật sau khi xác nhận và giao hàng. Quỹ thưởng chỉ tính chính thức cho đơn "Hoàn tất".</p>`
        : '<p class="csl-muted">Bạn chưa có đơn sỉ nào.</p>'}
      </div>` : ''}

      ${ui.tab === 'policy' ? `
      <div class="csl-section-box">
        <div class="csl-section-head"><h3>Bảng chiết khấu theo nhóm sản phẩm &amp; số lượng</h3></div>
        <div class="csl-policy-grid">
          ${Object.entries(DISCOUNT_TIERS).map(([g, tiers]) => `
            <div class="csl-policy-card">
              <h4>${esc(PRODUCT_GROUPS[g].vi)}</h4>
              <table class="csl-table"><thead><tr><th>Tổng SL nhóm / đơn</th><th>Chiết khấu</th><th>Thực trả</th><th>Mã</th></tr></thead>
                <tbody>${tiers.map((t, i) => `<tr><td>${t.min}${tiers[i + 1] ? `–${tiers[i + 1].min - 1}` : '+'} sp</td><td><strong>${pct(t.rate)}</strong></td><td>${pct(1 - t.rate)}</td><td>${esc(t.code)}</td></tr>`).join('')}</tbody></table>
            </div>`).join('')}
        </div>
        <div class="csl-formula">
          <h4>Công thức tính</h4>
          <ol>
            <li><strong>Doanh số niêm yết (GMV)</strong> = Σ giá niêm yết × số lượng</li>
            <li><strong>Chiết khấu</strong> = Σ giá niêm yết × số lượng × % chiết khấu của nhóm (bậc theo tổng số lượng nhóm đó trong đơn)</li>
            <li><strong>Tiền nhập (thực trả)</strong> = GMV − Chiết khấu</li>
            <li><strong>Quỹ thưởng cuối năm</strong> = Tiền nhập × ${pct(BONUS_RATE)} (beVIBE trích, bạn không trả thêm; tính chính thức khi đơn hoàn tất)</li>
            <li><strong>Lợi nhuận gộp</strong> = Doanh thu bán ra − Tiền nhập (báo cáo giả định bán đúng giá niêm yết, nên Lợi nhuận gộp = Chiết khấu)</li>
            <li><strong>Tổng lợi ích</strong> = Lợi nhuận gộp + Quỹ thưởng · <strong>ROI</strong> = Tổng lợi ích ÷ Tiền nhập</li>
          </ol>
          <p class="csl-muted">Ví dụ: 10 lọ Dr.BARGO Serum 660.000đ (Mỹ phẩm, bậc 55%) → GMV 6.600.000đ, chiết khấu 3.630.000đ, tiền nhập 2.970.000đ, quỹ thưởng 148.500đ, lợi nhuận gộp 3.630.000đ, ROI ≈ 127%. Chưa trừ phí vận chuyển và chi phí bán hàng riêng của bạn.</p>
          <h4>Hạng Counselor theo tiền nhập trong năm</h4>
          <ul>${REWARD_LEVELS.map((l) => `<li><strong>${esc(l.name)}</strong> (từ ${formatVnd(l.min)}): ${esc(l.gift)}</li>`).join('')}</ul>
        </div>
      </div>` : ''}
    </div>`;

  bindDashboard(container, counselor, products);
}

function bindDashboard(container, counselor, products) {
  const draft = readDraft(counselor.code);
  const rerender = () => renderCounselorDashboard();
  const store = () => saveDraft(counselor.code, draft);

  container.querySelector('[data-csl="logout"]')?.addEventListener('click', () => {
    if (!confirm('Đăng xuất phân hệ Counselor?')) return;
    if (typeof window.__bevibeSignOut === 'function') window.__bevibeSignOut();
    else { clearCounselorSession(); window.location.hash = '#'; }
  });
  container.querySelectorAll('[data-csl-period]').forEach((b) => b.addEventListener('click', () => { ui.period = b.dataset.cslPeriod; rerender(); }));
  container.querySelectorAll('[data-csl-tab]').forEach((b) => b.addEventListener('click', () => { ui.tab = b.dataset.cslTab; rerender(); }));
  container.querySelectorAll('[data-csl-group]').forEach((b) => b.addEventListener('click', () => { ui.group = b.dataset.cslGroup; rerender(); }));
  const search = container.querySelector('[data-csl="search"]');
  if (search) {
    search.addEventListener('input', () => {
      ui.q = search.value;
      clearTimeout(search._t);
      search._t = setTimeout(() => {
        rerender();
        const s = container.querySelector('[data-csl="search"]');
        if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); }
      }, 250);
    });
  }
  container.querySelectorAll('[data-csl-add]').forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.cslAdd;
    if (!products.some((p) => p.id === id)) return;
    draft.items[id] = (parseInt(draft.items[id], 10) || 0) + 1;
    store(); rerender();
  }));
  container.querySelectorAll('[data-csl-qty]').forEach((inp) => inp.addEventListener('change', () => {
    draft.items[inp.dataset.cslQty] = Math.min(9999, Math.max(1, parseInt(inp.value, 10) || 1));
    store(); rerender();
  }));
  container.querySelectorAll('[data-csl-remove]').forEach((b) => b.addEventListener('click', () => {
    delete draft.items[b.dataset.cslRemove];
    store(); rerender();
  }));

  const form = container.querySelector('[data-csl="ship"]');
  if (!form) return;
  const val = (n) => String((form.querySelector(`[name="${n}"]`) || {}).value || '').trim();
  form.addEventListener('input', () => {
    draft.ship = { city: val('city'), address: val('address'), note: val('note'), pay: (form.querySelector('[name="pay"]:checked') || {}).value || 'bank' };
    store();
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = form.querySelector('[data-csl="err"]');
    const fail = (m) => { err.textContent = m; err.hidden = false; };
    const calc = calcOrder(draftLines(draft, products));
    if (!calc.lines.length) return fail('Đơn sỉ đang trống.');
    if (!val('city') || !val('address')) return fail('Vui lòng nhập tỉnh/thành và địa chỉ nhận hàng.');
    if (!ORDER_ENDPOINT) return fail('Hệ thống nhận đơn chưa sẵn sàng. Vui lòng gọi 033 828 2112.');
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span>Đang gửi đơn…</span>';

    const requestId = `csl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const tiers = Object.entries(calc.groups).map(([g, x]) => `${PRODUCT_GROUPS[g].short} ${x.qty}sp ${x.tier.code}`).join(', ');
    const note = `[ĐƠN SỈ COUNSELOR ${counselor.code}] CK tạm tính ${formatVnd(calc.discount)} (${tiers}) · Thực trả dự kiến ${formatVnd(calc.cost)} · Quỹ thưởng ${formatVnd(calc.bonus)}. Cần đối chiếu mã Counselor và nhập Giảm giá khi xác nhận. ${val('note')}`.slice(0, 480);
    let res;
    try {
      // Real order (admin → Đơn hàng → tab Tư vấn viên). The server prices it at list price;
      // beVIBE enters the counselor discount when confirming.
      res = await postOrder({
        requestId,
        customerType: 'consultant',
        org: counselor.code,
        customer: { name: counselor.name, phone: counselor.phone, email: counselor.email || '', city: val('city'), district: '', address: val('address'), note },
        pay: (form.querySelector('[name="pay"]:checked') || {}).value === 'cod' ? 'cod' : 'bank',
        items: calc.lines.map((l) => ({ id: l.id, qty: l.qty })),
        clientTotal: calc.gmv,
        page: window.location.href,
        lang: 'vi'
      });
    } catch (sendErr) {
      res = null;
    }
    if (!res || !res.ok) {
      btn.disabled = false;
      btn.innerHTML = '<span>Gửi đơn sỉ</span>';
      return fail((res && res.error) || 'Chưa gửi được đơn do lỗi kết nối. Vui lòng thử lại hoặc gọi 033 828 2112.');
    }
    sendOrderToSupabase({
      order_type: `Đơn sỉ Counselor [${counselor.code}]`,
      customer_name: `${counselor.name} (${counselor.code})`,
      phone: counselor.phone,
      email: counselor.email || '',
      clinic_or_spa: `Counselor ${counselor.code}`,
      collaboration_need: calc.lines.map((l) => `${l.name} x${l.qty}`).join('; '),
      note,
      shipping_address: `${val('address')}, ${val('city')}`,
      total_amount: calc.cost
    }).catch(() => {});

    recordCounselorOrder({
      orderId: requestId,
      code: res.code || '',
      counselorCode: counselor.code,
      createdAt: new Date().toISOString(),
      status: 'Chờ xác nhận',
      lines: calc.lines.map(({ id, name, group, price, qty, rate, tierCode, gmv, discount, cost }) => ({ id, name, group, price, qty, rate, tierCode, gmv, discount, cost })),
      qty: calc.qty,
      gmv: calc.gmv,
      discount: calc.discount,
      cost: calc.cost,
      bonus: calc.bonus,
      sellRevenue: calc.gmv,
      note: val('note')
    });
    draft.items = {};
    store();
    ui.tab = 'history';
    rerender();
    alert(`Đã gửi đơn sỉ${res.code ? ` ${res.code}` : ''}.\nTiền nhập dự kiến: ${formatVnd(calc.cost)}.\nbeVIBE sẽ gọi số ${counselor.phone} để xác nhận đơn và chiết khấu.`);
  });
}
