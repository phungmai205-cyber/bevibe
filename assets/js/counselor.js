/**
 * counselor.js — Phân hệ Quản lý & Báo cáo dành cho Counselor (Tư vấn viên / Đại lý sỉ) beVIBE
 *
 * Cơ chế hoạt động:
 * 1. Đăng nhập bằng Mã Counselor (ví dụ: BV0001 hoặc BV 0001) - Không cần email/mật khẩu phức tạp.
 * 2. Chiết khấu sỉ: Giảm 55%, Counselor thực trả 45%.
 * 3. Quỹ thưởng cuối năm: Trích 5% trên số tiền thực trả (45%) để trao thưởng tiền mặt/hiện vật cuối năm.
 * 4. Báo cáo tài chính chuẩn: Doanh số bán lẻ, Giá vốn mua sỉ, Lợi nhuận tức thì, Quỹ thưởng tích lũy.
 */

import { productPrices, formatVnd } from './prices.js';
import { brandsData, tpcnData } from './translations.js';
import { sendOrderToSupabase } from './order-config.js';

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
 * Công thức tính toán tài chính cho đơn sỉ:
 * @param {number} retailTotal Tổng giá bán lẻ niêm yết
 * @param {number} discountRate Tỷ lệ giảm (mặc định 0.55 = 55%)
 * @param {number} bonusRate Tỷ lệ trích thưởng (mặc định 0.05 = 5%)
 */
export function calculateWholesaleFinance(retailTotal, discountRate = 0.55, bonusRate = 0.05) {
  const retail = Math.max(0, Number(retailTotal) || 0);
  const wholesaleCost = Math.round(retail * (1 - discountRate)); // Thực trả (45%)
  const directProfit = retail - wholesaleCost;                  // Lợi nhuận tức thì khi bán lẻ (55%)
  const bonusReward = Math.round(wholesaleCost * bonusRate);    // 5% trích thưởng cuối năm từ tiền thực trả
  const totalGain = directProfit + bonusReward;                 // Tổng giá trị thu về
  const roi = wholesaleCost > 0 ? (totalGain / wholesaleCost) * 100 : 0; // Tỷ suất sinh lời / vốn

  return {
    retailTotal: retail,
    discountRate,
    discountAmount: directProfit,
    wholesaleCost,
    directProfit,
    bonusRate,
    bonusReward,
    totalGain,
    roi: Math.round(roi * 10) / 10
  };
}

/**
 * Danh sách toàn bộ sản phẩm (Mỹ phẩm + TPCN) để Counselor chọn đặt sỉ
 */
export function getAllAvailableProducts() {
  const list = [];

  // 1. Mỹ phẩm từ brandsData
  if (Array.isArray(brandsData)) {
    brandsData.forEach((b) => {
      const prods = b.productsVi || [];
      prods.forEach((p) => {
        const pr = productPrices[p.id];
        const price = pr && pr.price ? pr.price : 450000; // Giá fallback hợp lý
        list.push({
          id: p.id,
          name: p.name,
          brand: b.name,
          category: 'Mỹ phẩm',
          image: p.image || '/assets/images/lineup.jpg',
          price: price,
          spec: p.spec || ''
        });
      });
    });
  }

  // 2. TPCN Healing Farm
  if (Array.isArray(tpcnData)) {
    tpcnData.forEach((b) => {
      const prods = b.productsVi || [];
      prods.forEach((p) => {
        list.push({
          id: p.id,
          name: p.name,
          brand: b.name,
          category: 'TPCN Hàn Quốc',
          image: p.image || '/assets/images/lineup.jpg',
          price: p.price || 2800000,
          spec: p.spec || ''
        });
      });
    });
  }

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
    ? `<span class="csl-badge-dot"></span><span>${counselor.code} · ${counselor.name.split(' ').pop()}</span>`
    : `<span>Đăng nhập Counselor</span>`;

  if (btnDesktop) {
    btnDesktop.innerHTML = label;
    btnDesktop.classList.toggle('is-logged-in', !!counselor);
  }
  if (btnMobile) {
    btnMobile.innerHTML = counselor
      ? `💎 Counselor: ${counselor.code} (${counselor.name})`
      : `💎 Đăng nhập Counselor (Tư vấn viên)`;
    btnMobile.classList.toggle('is-logged-in', !!counselor);
  }
}

// -----------------------------------------------------------------------------
// UI: Modal Đăng nhập bằng Mã Counselor (ví dụ: BV0001)
// -----------------------------------------------------------------------------
export function openCounselorLoginModal() {
  const existing = document.getElementById('counselorLoginModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'counselorLoginModal';
  modal.className = 'csl-modal-overlay';
  modal.innerHTML = `
    <div class="csl-modal-card">
      <button type="button" class="csl-modal-close" id="closeCslLoginBtn" aria-label="Đóng">✕</button>
      <div class="csl-login-head">
        <div class="csl-logo-badge">beVIBE Counselor</div>
        <h2>Phân hệ Tư vấn viên &amp; Đại lý Sỉ</h2>
        <p>Nhập mã tư vấn viên do beVIBE cấp để kích hoạt quyền lợi sỉ <strong>giảm đến 55%</strong> và theo dõi <strong>quỹ thưởng cuối năm 5%</strong>.</p>
      </div>

      <form id="cslLoginForm" class="csl-login-form" autocomplete="off">
        <label class="csl-label">
          <span>Mã Counselor của bạn:</span>
          <div class="csl-input-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" id="cslCodeInput" class="csl-input" placeholder="Ví dụ: BV 0001 hoặc BV0001" autofocus required>
          </div>
          <small class="csl-hint">Định dạng mã: <code>BV 0001</code>, <code>BV 0002</code>, <code>BV 0003</code>...</small>
        </label>

        <div id="cslLoginError" class="csl-error-msg" hidden></div>

        <button type="submit" class="csl-btn-primary">
          <span>Đăng nhập vào Phân hệ Counselor</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>

        <div class="csl-demo-accounts">
          <span>Mã mẫu để trải nghiệm:</span>
          <div class="csl-chips">
            <button type="button" class="csl-chip" data-code="BV0001">BV0001 (Nguyễn Thu Hà)</button>
            <button type="button" class="csl-chip" data-code="BV0002">BV0002 (Trần Minh Tâm)</button>
            <button type="button" class="csl-chip" data-code="BV0003">BV0003 (Lê Hoàng Yến)</button>
          </div>
        </div>

        <div class="csl-support-line">
          Chưa có mã Counselor? Liên hệ hotline quản lý đối tác: <strong><a href="tel:0338282112">033 828 2112</a></strong>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Focus & sự kiện
  const input = modal.querySelector('#cslCodeInput');
  const errBox = modal.querySelector('#cslLoginError');
  const form = modal.querySelector('#cslLoginForm');
  const closeBtn = modal.querySelector('#closeCslLoginBtn');

  modal.querySelectorAll('.csl-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.getAttribute('data-code');
      errBox.hidden = true;
      input.focus();
    });
  });

  closeBtn.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawCode = input.value.trim();
    const norm = normalizeCounselorCode(rawCode);

    if (!norm || !norm.startsWith('BV')) {
      errBox.textContent = 'Mã Counselor không hợp lệ. Mã chuẩn bắt đầu bằng "BV" (Ví dụ: BV 0001).';
      errBox.hidden = false;
      return;
    }

    // Tìm trong danh sách hoặc cấp quyền tự động cho mã BV
    let found = REGISTERED_COUNSELORS.find((c) => normalizeCounselorCode(c.code) === norm);
    if (!found) {
      // Cho phép mã BV hợp lệ bất kỳ
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
        targetRewardName: 'Phần thưởng hiện vật / Tiền mặt cuối năm'
      };
    }

    setCounselorSession(found);
    modal.remove();

    // Mở trang Dashboard Counselor
    window.location.hash = '/counselor';
  });
}

// -----------------------------------------------------------------------------
// UI: Render toàn bộ Dashboard Phân hệ Counselor
// -----------------------------------------------------------------------------
export function renderCounselorDashboard() {
  const counselor = getCurrentCounselor();
  if (!counselor) {
    openCounselorLoginModal();
    return;
  }

  const container = document.getElementById('counselorPortalView');
  if (!container) return;

  // Lấy danh sách đơn hàng của counselor
  const orders = getCounselorOrders(counselor.code);

  // Tính tổng tài chính tích lũy
  let totalRetail = 0;
  let totalWholesale = 0;
  let totalBonus = 0;

  orders.forEach((o) => {
    totalRetail += Number(o.retailTotal) || 0;
    totalWholesale += Number(o.wholesaleCost) || 0;
    totalBonus += Number(o.bonusReward) || 0;
  });

  const totalDirectProfit = totalRetail - totalWholesale;
  const progressPercent = Math.min(100, Math.round((totalBonus / counselor.targetReward) * 100));

  const allProducts = getAllAvailableProducts();

  container.innerHTML = `
    <div class="container csl-dashboard-wrap">
      <!-- Top header bar -->
      <div class="csl-dash-top">
        <div class="csl-user-info">
          <div class="csl-avatar">${counselor.code.slice(0, 2)}</div>
          <div>
            <div class="csl-title-row">
              <h2>${counselor.name}</h2>
              <span class="csl-pill-code">${counselor.code}</span>
              <span class="csl-pill-level">${counselor.level}</span>
            </div>
            <p class="csl-meta-sub">Khu vực: <strong>${counselor.region}</strong> · Tham gia: <strong>${counselor.joinDate}</strong> · Hotline: <strong>${counselor.phone}</strong></p>
          </div>
        </div>
        <div class="csl-top-actions">
          <button type="button" class="csl-btn-outline" id="cslLogoutBtn">Đăng xuất Counselor</button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="csl-kpi-grid">
        <div class="csl-kpi-card">
          <div class="csl-kpi-label">Tổng Doanh Số Bán Lẻ (GMV)</div>
          <div class="csl-kpi-value text-gold">${formatVnd(totalRetail)}</div>
          <div class="csl-kpi-note">Giá niêm yết bán cho khách hàng</div>
        </div>

        <div class="csl-kpi-card">
          <div class="csl-kpi-label">Giá Vốn Nhập Sỉ Thực Trả (45%)</div>
          <div class="csl-kpi-value">${formatVnd(totalWholesale)}</div>
          <div class="csl-kpi-note">Đã được giảm 55% theo chính sách sỉ</div>
        </div>

        <div class="csl-kpi-card highlight-green">
          <div class="csl-kpi-label">Lợi Nhuận Bán Lẻ Tức Thì (55%)</div>
          <div class="csl-kpi-value text-green">${formatVnd(totalDirectProfit)}</div>
          <div class="csl-kpi-note">Chênh lệch thu ngay khi bán hàng</div>
        </div>

        <div class="csl-kpi-card highlight-purple">
          <div class="csl-kpi-label">Quỹ Thưởng Cuối Năm Tích Lũy (5%)</div>
          <div class="csl-kpi-value text-purple">${formatVnd(totalBonus)}</div>
          <div class="csl-kpi-note">Trích 5% từ tiền sỉ để trao thưởng Tết</div>
        </div>
      </div>

      <!-- Year-End Bonus Progress Bar -->
      <div class="csl-bonus-banner">
        <div class="csl-bonus-content">
          <div class="csl-bonus-head">
            <div>
              <h3>🎁 Quỹ Thưởng &amp; Quà Tặng Cuối Năm 2026</h3>
              <p>Mục tiêu thưởng của bạn: <strong>${counselor.targetRewardName}</strong> (Mốc: ${formatVnd(counselor.targetReward)})</p>
            </div>
            <div class="csl-bonus-digit">
              <span>Đã tích lũy:</span>
              <strong>${formatVnd(totalBonus)}</strong>
            </div>
          </div>
          <div class="csl-progress-bar-wrap">
            <div class="csl-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="csl-progress-labels">
            <span>Tiến độ hoàn thành: <strong>${progressPercent}%</strong></span>
            <span>Còn thiếu: <strong>${formatVnd(Math.max(0, counselor.targetReward - totalBonus))}</strong> để rinh giải!</span>
          </div>
        </div>
      </div>

      <!-- Quick Wholesale Order & Profit Calculator -->
      <div class="csl-section-box">
        <div class="csl-section-head">
          <div>
            <h3>🛒 Đặt Hàng Sỉ Nhanh &amp; Máy Tính Lợi Nhuận</h3>
            <p>Chọn sản phẩm, nhập số lượng để hệ thống tính chi tiết số tiền thực trả (giảm 55%) và khoản thưởng tích lũy (5%).</p>
          </div>
          <span class="csl-badge-policy">Chính sách: Giảm 55% + Thưởng năm 5%</span>
        </div>

        <div class="csl-calc-grid">
          <div class="csl-calc-form">
            <label class="csl-field">
              <span>1. Chọn sản phẩm cần nhập:</span>
              <select id="cslProductSelect" class="csl-select">
                ${allProducts.map((p) => `
                  <option value="${p.id}" data-price="${p.price}" data-name="${p.name}" data-spec="${p.spec}" data-img="${p.image}">
                    [${p.category}] ${p.name} — ${formatVnd(p.price)}
                  </option>
                `).join('')}
              </select>
            </label>

            <div class="csl-field-row">
              <label class="csl-field">
                <span>2. Số lượng nhập sỉ:</span>
                <input type="number" id="cslQtyInput" class="csl-input" value="10" min="1" max="1000">
              </label>

              <label class="csl-field">
                <span>3. Mức chiết khấu áp dụng:</span>
                <select id="cslDiscountSelect" class="csl-select">
                  <option value="0.55" selected>Chiết khấu Counselor: Giảm 55% (Thực trả 45%)</option>
                  <option value="0.50">Nhập thử nghiệm: Giảm 50%</option>
                  <option value="0.60">Đơn sỉ lớn: Giảm 60%</option>
                </select>
              </label>
            </div>

            <label class="csl-field">
              <span>Ghi chú đơn sỉ / Địa chỉ giao hàng:</span>
              <input type="text" id="cslOrderNote" class="csl-input" placeholder="Ví dụ: Giao về Clinic Hà Nội, xuất hóa đơn VAT...">
            </label>
          </div>

          <!-- Result Preview Box -->
          <div class="csl-calc-result" id="cslCalcResult">
            <!-- Rendered by updateCalculatorPreview() -->
          </div>
        </div>
      </div>

      <!-- Order History Table -->
      <div class="csl-section-box">
        <div class="csl-section-head">
          <h3>📑 Lịch Sử Đơn Hàng Sỉ Của Bạn</h3>
          <span class="csl-order-count">${orders.length} đơn hàng</span>
        </div>

        ${orders.length === 0 ? `
          <div class="csl-empty-orders">
            <p>Bạn chưa có đơn đặt hàng sỉ nào trên hệ thống.</p>
            <p>Hãy dùng bảng máy tính bên trên để đặt đơn hàng đầu tiên và bắt đầu tích lũy thưởng Tết nhé!</p>
          </div>
        ` : `
          <div class="csl-table-wrap">
            <table class="csl-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Doanh số giá lẻ</th>
                  <th>Tiền thực trả (45%)</th>
                  <th>Lãi bán lẻ (55%)</th>
                  <th>Thưởng Tết (5%)</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map((o) => `
                  <tr>
                    <td><strong>${o.orderId}</strong></td>
                    <td>${o.date}</td>
                    <td>${o.productName}</td>
                    <td>${o.quantity}</td>
                    <td>${formatVnd(o.retailTotal)}</td>
                    <td class="text-bold">${formatVnd(o.wholesaleCost)}</td>
                    <td class="text-green">${formatVnd(o.directProfit)}</td>
                    <td class="text-purple">+${formatVnd(o.bonusReward)}</td>
                    <td><span class="csl-status-badge ${o.statusClass || 'is-paid'}">${o.status || 'Đã ghi nhận'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;

  // Gắn sự kiện
  const logoutBtn = container.querySelector('#cslLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đăng xuất phân hệ Counselor?')) {
        clearCounselorSession();
        window.location.hash = '#';
        window.location.reload();
      }
    });
  }

  // Cập nhật máy tính chiết khấu
  const prodSelect = container.querySelector('#cslProductSelect');
  const qtyInput = container.querySelector('#cslQtyInput');
  const discSelect = container.querySelector('#cslDiscountSelect');

  function updateCalc() {
    const opt = prodSelect.options[prodSelect.selectedIndex];
    const price = Number(opt.dataset.price) || 0;
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    const disc = parseFloat(discSelect.value) || 0.55;

    const retailTotal = price * qty;
    const res = calculateWholesaleFinance(retailTotal, disc, counselor.bonusRate);

    const resultBox = container.querySelector('#cslCalcResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <h4>Bảng phân bổ tài chính đơn hàng</h4>
        <div class="csl-res-row">
          <span>Doanh số giá lẻ niêm yết:</span>
          <strong>${formatVnd(res.retailTotal)}</strong>
        </div>
        <div class="csl-res-row text-gold">
          <span>Chiết khấu sỉ (${Math.round(disc * 100)}%):</span>
          <strong>-${formatVnd(res.discountAmount)}</strong>
        </div>
        <div class="csl-res-row total-row">
          <span>Số tiền thực thanh toán (45%):</span>
          <span class="csl-big-price">${formatVnd(res.wholesaleCost)}</span>
        </div>
        <div class="csl-res-breakdown">
          <div class="csl-pill-row">
            <span>📈 Lãi bán lẻ bỏ túi ngay:</span>
            <strong class="text-green">${formatVnd(res.directProfit)}</strong>
          </div>
          <div class="csl-pill-row">
            <span>🎁 Trích vào Quỹ thưởng cuối năm (5%):</span>
            <strong class="text-purple">+${formatVnd(res.bonusReward)}</strong>
          </div>
          <div class="csl-pill-row">
            <span>🚀 Tỷ suất sinh lời trên vốn (ROI):</span>
            <strong>${res.roi}%</strong>
          </div>
        </div>

        <button type="button" class="csl-btn-submit-order" id="cslSubmitOrderBtn">
          <span>Gửi đơn sỉ này ngay ↗</span>
        </button>
      `;

      // Gắn sự kiện submit đơn
      const submitBtn = resultBox.querySelector('#cslSubmitOrderBtn');
      if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Đang xử lý đơn sỉ...';

          const note = container.querySelector('#cslOrderNote')?.value || '';
          const newOrderId = `CS-${Date.now().toString().slice(-6)}`;
          const today = new Date().toLocaleDateString('vi-VN');

          const newOrder = {
            orderId: newOrderId,
            counselorCode: counselor.code,
            counselorName: counselor.name,
            counselorPhone: counselor.phone,
            productName: opt.dataset.name,
            productId: opt.value,
            unitPrice: price,
            quantity: qty,
            retailTotal: res.retailTotal,
            wholesaleCost: res.wholesaleCost,
            directProfit: res.directProfit,
            bonusReward: res.bonusReward,
            date: today,
            note: note,
            status: 'Chờ duyệt sỉ',
            statusClass: 'is-pending'
          };

          // Lưu local
          recordCounselorOrder(newOrder);

          // Gửi lên Supabase
          try {
            await sendOrderToSupabase({
              order_type: `Đơn sỉ Counselor [${counselor.code}]`,
              customer_name: `${counselor.name} (${counselor.code})`,
              phone: counselor.phone,
              email: `${counselor.code.toLowerCase()}@counselor.bevibe.vn`,
              clinic_or_spa: `Counselor beVIBE (${counselor.region})`,
              collaboration_need: `Đơn sỉ: ${opt.dataset.name} x ${qty} hộp (CK ${Math.round(disc * 100)}%)`,
              note: `Giá lẻ: ${formatVnd(res.retailTotal)} | Thực thu: ${formatVnd(res.wholesaleCost)} | Quỹ thưởng 5%: ${formatVnd(res.bonusReward)}. Ghi chú: ${note}`,
              shipping_address: counselor.region,
              total_amount: res.wholesaleCost
            });
          } catch (err) {
            console.warn('Lỗi gửi Supabase:', err);
          }

          alert(`Đặt hàng sỉ thành công!\nMã đơn: ${newOrderId}\nSố tiền sỉ thực trả: ${formatVnd(res.wholesaleCost)}\nQuỹ thưởng năm cộng thêm: +${formatVnd(res.bonusReward)}`);
          renderCounselorDashboard();
        });
      }
    }
  }

  prodSelect.addEventListener('change', updateCalc);
  qtyInput.addEventListener('input', updateCalc);
  discSelect.addEventListener('change', updateCalc);

  // Chạy lần đầu
  updateCalc();
}

