/**
 * Chính sách & công thức Counselor beVIBE — SỬA SỐ Ở FILE NÀY khi chính sách thay đổi.
 *
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ CÔNG THỨC (mỗi đơn sỉ)                                                       │
 * │  Doanh số niêm yết (GMV) = Σ Giá niêm yết × Số lượng                         │
 * │  Bậc chiết khấu          = theo NHÓM sản phẩm + TỔNG số lượng của nhóm đó    │
 * │                            trong cùng đơn (bảng DISCOUNT_TIERS bên dưới)     │
 * │  Chiết khấu              = Σ Giá niêm yết × Số lượng × % chiết khấu của nhóm │
 * │  Tiền nhập (thực trả)    = GMV − Chiết khấu                                   │
 * │  Quỹ thưởng cuối năm     = Tiền nhập × 5%   (beVIBE trích, Counselor không   │
 * │                            phải trả thêm; chỉ tính cho đơn đã hoàn tất)      │
 * │  Doanh thu bán ra        = số tiền Counselor bán lại cho khách                │
 * │                            (mặc định = GMV, tức bán đúng giá niêm yết)       │
 * │  Lợi nhuận gộp           = Doanh thu bán ra − Tiền nhập                       │
 * │  Tổng lợi ích            = Lợi nhuận gộp + Quỹ thưởng                         │
 * │  Biên lợi nhuận          = Lợi nhuận gộp ÷ Doanh thu bán ra                   │
 * │  Tỷ suất trên vốn (ROI)  = Tổng lợi ích ÷ Tiền nhập                           │
 * └──────────────────────────────────────────────────────────────────────────────┘
 * Ví dụ 10 lọ serum 660.000đ (Mỹ phẩm, bậc 55%): GMV 6.600.000 → Chiết khấu 3.630.000
 * → Tiền nhập 2.970.000 → Quỹ thưởng 148.500 → Lợi nhuận gộp 3.630.000 → ROI 127,2%.
 *
 * Tiền (đ) luôn làm tròn đến đồng ở từng dòng, tổng = cộng các dòng.
 */

export const PRODUCT_GROUPS = {
  cosmetics: { vi: 'Mỹ phẩm', short: 'MP' },
  tpcn: { vi: 'Thực phẩm chức năng', short: 'TPCN' }
};

/**
 * Bậc chiết khấu theo nhóm sản phẩm. "min" = tổng số lượng tối thiểu của nhóm đó trong một đơn.
 * ⚠ Số liệu MẪU — beVIBE xác nhận lại trước khi dùng chính thức.
 */
export const DISCOUNT_TIERS = {
  cosmetics: [
    { min: 1, rate: 0.50, code: 'CSL-MP50', label: 'Khởi đầu' },
    { min: 10, rate: 0.55, code: 'CSL-MP55', label: 'Tiêu chuẩn' },
    { min: 50, rate: 0.60, code: 'CSL-MP60', label: 'Đơn lớn' }
  ],
  tpcn: [
    { min: 1, rate: 0.35, code: 'CSL-TP35', label: 'Khởi đầu' },
    { min: 10, rate: 0.40, code: 'CSL-TP40', label: 'Tiêu chuẩn' },
    { min: 50, rate: 0.45, code: 'CSL-TP45', label: 'Đơn lớn' }
  ]
};

// Quỹ thưởng cuối năm: % trích trên Tiền nhập (thực trả)
export const BONUS_RATE = 0.05;

/**
 * Hạng Counselor theo TỔNG TIỀN NHẬP trong năm (đơn đã hoàn tất). Cuối năm Counselor nhận
 * toàn bộ quỹ thưởng tích lũy, quy đổi tiền mặt hoặc hiện vật cùng giá trị; hạng cao có thêm quà.
 * ⚠ Số liệu MẪU.
 */
export const REWARD_LEVELS = [
  { min: 0, name: 'Đồng', gift: 'Nhận 100% quỹ thưởng (tiền mặt hoặc hiện vật)' },
  { min: 50000000, name: 'Bạc', gift: 'Quỹ thưởng + bộ quà tặng beVIBE' },
  { min: 150000000, name: 'Vàng', gift: 'Quỹ thưởng + 01 chỉ vàng 9999' },
  { min: 300000000, name: 'Kim cương', gift: 'Quỹ thưởng + chuyến du lịch Hàn Quốc' }
];

// Trạng thái đơn tính vào quỹ thưởng chính thức; các trạng thái khác chỉ là "tạm tính"
export const BONUS_STATUSES = ['Hoàn tất'];
export const CANCELLED_STATUSES = ['Đã hủy', 'Hoàn hàng'];

const round = (n) => Math.round(Number(n) || 0);

/** Bậc chiết khấu áp dụng cho một nhóm với tổng số lượng qty */
export function tierFor(group, qty) {
  const tiers = DISCOUNT_TIERS[group] || DISCOUNT_TIERS.cosmetics;
  let t = tiers[0];
  tiers.forEach((x) => { if (qty >= x.min) t = x; });
  return t;
}

/** Bậc kế tiếp (để gợi ý "mua thêm N sản phẩm để đạt X%"), hoặc null nếu đã cao nhất */
export function nextTierFor(group, qty) {
  return (DISCOUNT_TIERS[group] || []).find((x) => x.min > qty) || null;
}

/**
 * Tính một đơn sỉ.
 * @param {Array<{id, name, group, price, qty}>} lines  price = giá niêm yết 1 sản phẩm
 * @param {{ sellRevenue?: number }} opts  doanh thu bán ra thực tế (mặc định = GMV)
 */
export function calcOrder(lines, opts = {}) {
  const clean = (lines || []).filter((l) => l && Number(l.price) > 0 && Number(l.qty) > 0)
    .map((l) => ({ ...l, price: round(l.price), qty: Math.floor(Number(l.qty)), group: PRODUCT_GROUPS[l.group] ? l.group : 'cosmetics' }));
  const groupQty = {};
  clean.forEach((l) => { groupQty[l.group] = (groupQty[l.group] || 0) + l.qty; });
  const groups = {};
  Object.keys(groupQty).forEach((g) => {
    groups[g] = { qty: groupQty[g], tier: tierFor(g, groupQty[g]), next: nextTierFor(g, groupQty[g]), gmv: 0, discount: 0, cost: 0 };
  });
  const out = clean.map((l) => {
    const tier = groups[l.group].tier;
    const gmv = l.price * l.qty;
    const discount = round(gmv * tier.rate);
    const cost = gmv - discount;
    const g = groups[l.group];
    g.gmv += gmv; g.discount += discount; g.cost += cost;
    return { ...l, rate: tier.rate, tierCode: tier.code, gmv, discount, cost };
  });
  const gmv = out.reduce((s, l) => s + l.gmv, 0);
  const discount = out.reduce((s, l) => s + l.discount, 0);
  const cost = gmv - discount;
  const bonus = round(cost * BONUS_RATE);
  const sellRevenue = opts.sellRevenue != null && Number(opts.sellRevenue) >= 0 ? round(opts.sellRevenue) : gmv;
  const grossProfit = sellRevenue - cost;
  const totalGain = grossProfit + bonus;
  return {
    lines: out,
    groups,
    qty: out.reduce((s, l) => s + l.qty, 0),
    gmv,
    discount,
    cost,
    bonus,
    sellRevenue,
    grossProfit,
    totalGain,
    margin: sellRevenue > 0 ? grossProfit / sellRevenue : 0,
    roi: cost > 0 ? totalGain / cost : 0,
    avgRate: gmv > 0 ? discount / gmv : 0
  };
}

/**
 * Báo cáo trên nhiều đơn (đơn hủy / hoàn hàng bị loại).
 * Quỹ thưởng chính thức chỉ gồm đơn có trạng thái trong BONUS_STATUSES; còn lại là tạm tính.
 */
export function summarize(orders) {
  const valid = (orders || []).filter((o) => !CANCELLED_STATUSES.includes(o.status));
  const sum = (k) => valid.reduce((s, o) => s + (Number(o[k]) || 0), 0);
  const done = valid.filter((o) => BONUS_STATUSES.includes(o.status));
  const gmv = sum('gmv');
  const cost = sum('cost');
  const sellRevenue = sum('sellRevenue');
  const grossProfit = sellRevenue - cost;
  const bonusConfirmed = done.reduce((s, o) => s + (Number(o.bonus) || 0), 0);
  const bonusPending = sum('bonus') - bonusConfirmed;
  return {
    orders: valid.length,
    cancelled: (orders || []).length - valid.length,
    qty: sum('qty'),
    gmv,
    discount: sum('discount'),
    cost,
    sellRevenue,
    grossProfit,
    bonusConfirmed,
    bonusPending,
    bonus: bonusConfirmed + bonusPending,
    totalGain: grossProfit + bonusConfirmed + bonusPending,
    margin: sellRevenue > 0 ? grossProfit / sellRevenue : 0,
    roi: cost > 0 ? (grossProfit + bonusConfirmed + bonusPending) / cost : 0,
    costConfirmed: done.reduce((s, o) => s + (Number(o.cost) || 0), 0)
  };
}

/** Hạng hiện tại và hạng kế tiếp theo tổng tiền nhập trong năm */
export function rewardLevel(yearCost) {
  let level = REWARD_LEVELS[0];
  REWARD_LEVELS.forEach((l) => { if (yearCost >= l.min) level = l; });
  const next = REWARD_LEVELS.find((l) => l.min > yearCost) || null;
  return { level, next, progress: next ? Math.min(1, (yearCost - level.min) / (next.min - level.min)) : 1 };
}
