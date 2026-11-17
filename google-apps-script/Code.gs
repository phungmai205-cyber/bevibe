/**
 * beVIBE — Hệ thống nhận đơn hàng + Phân hệ Admin (Google Apps Script gắn với 1 Google Sheet)
 *
 * 1. Website gửi đơn (POST JSON) → script kiểm tra dữ liệu, tính lại tiền theo bảng giá,
 *    ghi vào sheet "Đơn hàng" + "Chi tiết đơn", rồi gửi email báo đơn mới.
 * 2. Form liên hệ / báo giá sỉ / đăng ký tài khoản → sheet "Khách tiềm năng".
 * 3. Trang quản trị (admin.html) đăng nhập bằng mật khẩu admin để xem / cập nhật đơn,
 *    khách hàng, chi phí, giá vốn và báo cáo.
 *
 * Cài đặt: xem HUONG-DAN-NHAN-DON.md và HUONG-DAN-ADMIN.md ở thư mục gốc dự án.
 * Sau khi sửa file này, vào Triển khai → Quản lý triển khai → chỉnh sửa → Phiên bản mới.
 */

const CONFIG = {
  // Email nhận thông báo đơn mới (có thể thêm nhiều email)
  NOTIFY_EMAILS: ['bevibevn@gmail.com'],
  // Gửi email xác nhận cho khách nếu khách có điền email
  SEND_CUSTOMER_EMAIL: true,
  // Gửi email báo khi có khách tiềm năng mới (form liên hệ, đăng ký tài khoản)
  NOTIFY_LEADS: true,
  SHEET_ORDERS: 'Đơn hàng',
  SHEET_ITEMS: 'Chi tiết đơn',
  SHEET_LEADS: 'Khách tiềm năng',
  SHEET_EXPENSES: 'Chi phí',
  // Price list edited from admin.html → "Chi phí & giá vốn" (sale price, cost, promotion, stock status)
  SHEET_COSTS: 'Bảng giá',
  OLD_SHEET_COSTS: 'Giá vốn',
  // Products added from admin.html → "Sản phẩm" (shown on the website next to the built-in ones)
  SHEET_PRODUCTS: 'Sản phẩm',
  // Brands added from admin.html (shown on the website next to the built-in brands)
  SHEET_BRANDS: 'Thương hiệu',
  BRAND_IDS: ['dr-bargo', 'neuraderm', 'medipharm', 'smib'],
  CATEGORY_IDS: ['cleanser', 'toner', 'serum', 'moisturizer', 'sun', 'mask', 'hair'],
  // Product photos uploaded from admin are stored in this Google Drive folder (created automatically)
  IMAGE_FOLDER_NAME: 'beVIBE – Ảnh sản phẩm',
  MAX_IMAGE_BYTES: 4 * 1024 * 1024,
  PRODUCT_STATUSES: ['Đang bán', 'Hết hàng', 'Ngừng bán'],
  // "Đã hủy": stopped before delivery · "Hoàn hàng": delivered but the customer refused it
  STATUSES: ['Mới', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy', 'Hoàn hàng'],
  FAIL_REASONS: ['Khách đổi ý / không mua nữa', 'Không liên lạc được khách', 'Đặt trùng / đặt nhầm', 'Sai địa chỉ / thông tin',
    'Hết hàng', 'Khách không nhận hàng khi giao', 'Khách hẹn giao lại quá lâu', 'Hàng lỗi / giao sai', 'Khác'],
  PAY_STATUSES: ['Chưa thanh toán', 'Đã thanh toán', 'Đã hoàn tiền'],
  // "Chờ đặt đơn": the consultant closed the deal (Zalo, phone…) and sent the customer to order on the website.
  // When that customer orders on the website (same phone / e-mail) the lead becomes "Đã mua" automatically.
  LEAD_STATUSES: ['Mới', 'Đã liên hệ', 'Tiềm năng', 'Chờ đặt đơn', 'Đã mua', 'Không phù hợp'],
  // Where a lead typed in by staff came from
  LEAD_SOURCES: ['Gọi điện', 'Zalo', 'Facebook / Instagram', 'TikTok', 'Khách giới thiệu', 'Hội chợ / sự kiện', 'Khách đến trực tiếp', 'Tư vấn viên giới thiệu', 'Khác'],
  CUSTOMER_TYPES: { b2c: 'Khách lẻ', wholesale: 'Khách sỉ', consultant: 'Tư vấn viên' },
  EXPENSE_CATEGORIES: ['Nhập hàng', 'Vận chuyển', 'Marketing / Quảng cáo', 'Nhân sự', 'Mặt bằng', 'Hoa hồng tư vấn viên', 'Khác'],
  // Chống spam: tối đa số đơn cho cùng 1 số điện thoại trong 10 phút
  MAX_ORDERS_PER_PHONE: 3,
  MAX_LEADS_PER_10_MIN: 20,
  // Phiên đăng nhập admin (giờ). Mật khẩu đặt trong Cài đặt dự án → Thuộc tính tập lệnh → ADMIN_PASSWORD
  ADMIN_SESSION_HOURS: 6,
  HOTLINE: '033 828 2112',
  // Tài khoản khách (Firebase): dán "apiKey" trong assets/js/auth-config.js vào đây để ghi email
  // tài khoản đã đăng nhập vào cột "Tài khoản". Để trống thì cột này bỏ trống.
  FIREBASE_API_KEY: '',
  SHOP_NAME: 'beVIBE'
};

// Thứ tự cột của các sheet. Thêm cột mới ở CUỐI danh sách để không lệch dữ liệu cũ.
const ORDER_HEADERS = ['Thời gian', 'Mã đơn', 'Trạng thái', 'Họ tên', 'Điện thoại', 'Email', 'Tỉnh/TP', 'Quận/Huyện', 'Địa chỉ',
  'Thanh toán', 'Sản phẩm', 'Tổng SL', 'Tạm tính (đ)', 'Ghi chú', 'Kiểm tra giá', 'Trang đặt hàng', 'Ngôn ngữ', 'Tài khoản',
  'Loại khách', 'Cơ sở / Mã TVV', 'Trạng thái thanh toán', 'Phí vận chuyển (đ)', 'Giảm giá (đ)', 'Ghi chú nội bộ', 'Mã yêu cầu', 'Cập nhật lúc', 'Lý do hủy / hoàn'];
const ITEM_HEADERS = ['Mã đơn', 'Thời gian', 'Mã SP', 'Tên sản phẩm', 'Quy cách', 'Đơn giá (đ)', 'SL', 'Thành tiền (đ)'];
const LEAD_HEADERS = ['Thời gian', 'Mã', 'Trạng thái', 'Loại yêu cầu', 'Họ tên', 'Điện thoại', 'Email', 'Cơ sở / Công ty', 'Quan tâm', 'Ghi chú', 'Ghi chú nội bộ', 'Cập nhật lúc', 'Người tư vấn', 'Chốt lúc'];
const EXPENSE_HEADERS = ['Mã', 'Ngày', 'Hạng mục', 'Số tiền (đ)', 'Ghi chú', 'Thời gian nhập'];
const PRODUCT_HEADERS = ['Mã SP', 'Hiển thị', 'Thương hiệu', 'Dòng sản phẩm', 'Danh mục', 'Tên sản phẩm', 'Tên tiếng Hàn', 'Mô tả ngắn',
  'Mô tả chi tiết', 'Quy cách', 'Ảnh chính', 'Ảnh phụ', 'Công dụng', 'Thành phần', 'Cách dùng', 'Thứ tự', 'Tạo lúc', 'Cập nhật lúc'];
const BRAND_HEADERS = ['Mã', 'Hiển thị', 'Tên thương hiệu', 'Nhãn ngắn', 'Khẩu hiệu', 'Xuất xứ', 'Giới thiệu', 'Câu chuyện thương hiệu',
  'Ảnh đại diện', 'Thứ tự', 'Tạo lúc', 'Cập nhật lúc'];
const COST_HEADERS = ['Mã SP', 'Tên sản phẩm', 'Quy cách', 'Giá bán (đ)', 'Giá vốn (đ)', 'Giá khuyến mãi (đ)', 'KM từ ngày', 'KM đến ngày', 'Trạng thái', 'Cập nhật lúc'];

// <PRICES:START> — tạo tự động bằng `npm run sync-prices` từ assets/js/prices.js, không sửa tay
const PRICES = {
  "neura-6": { "name": "Neuraderm MD Cream", "unit": "Tuýp 180g", "price": 1350000 },
  "neura-8": { "name": "Neuraderm Neuro Lacto Toner", "unit": "Chai 150ml", "price": 650000 },
  "neura-7": { "name": "Neuraderm Neuro Lacto Serum", "unit": "Chai 50ml", "price": 1060000 },
  "neura-16": { "name": "Neuraderm Neuro Lacto Moisturizer", "unit": "Tuýp 80ml", "price": 850000 },
  "neura-2": { "name": "Neuraderm Calming Mist", "unit": "Chai 100ml", "price": 700000 },
  "neura-1": { "name": "Neuraderm Calming Foam Cleansing", "unit": "Tuýp 100ml", "price": 460000 },
  "neura-5": { "name": "Neuraderm Intensive Suncream", "unit": "Tuýp 50ml", "price": 730000 },
  "neura-3": { "name": "Neuraderm Coretime Ampoule", "unit": "Hộp 2 ống x 15ml", "price": 1660000 },
  "neura-14": { "name": "Neuraderm M.BT Cream Lifting Mask", "unit": "Hộp 5 miếng", "price": 960000 },
  "stemc-1": { "name": "Stem C BB Cream", "unit": "Tuýp 50ml", "price": 250000 },
  "stemc-3": { "name": "Stem C Sunblock", "unit": "Tuýp 50ml", "price": 600000 },
  "stemc-4": { "name": "Stem C Toner", "unit": "Chai 250ml", "price": 420000 },
  "stemc-6": { "name": "MediPharm Stem C Repair Lotion", "unit": "Chai 250ml", "price": 420000 },
  "stemc-5": { "name": "MediPharm Stem C Cleansing Water", "unit": "Chai 245ml", "price": 420000 },
  "stemc-2": { "name": "MediPharm Stem C Revitalizing Cream", "unit": "Hũ 50ml", "price": 1400000 },
  "drbargo-1": { "name": "Dr.BARGO Emulsion", "unit": "Chai 150ml", "price": 420000 },
  "drbargo-2": { "name": "Dr.BARGO Foam Cleansing", "unit": "Chai 150ml", "price": 420000 },
  "drbargo-3": { "name": "Dr.BARGO Serum", "unit": "Lọ 50ml", "price": 960000 },
  "drbargo-4": { "name": "Dr.BARGO Toner", "unit": "Chai 400ml", "price": 420000 }
};
// <PRICES:END>

/* ==========================================================================
   Web app endpoints
   ========================================================================== */
function doGet(e) {
  // Public price list for the website: selling price, promotion, stock status. Never the cost price.
  if (e && e.parameter && e.parameter.action === 'prices') {
    try {
      return json_({ ok: true, prices: publicPrices_(), products: readProducts_(false), brands: readBrands_(false), at: new Date().toISOString() });
    } catch (err) {
      console.error('prices failed: ' + err);
      return json_({ ok: false });
    }
  }
  return json_({ ok: true, service: 'beVIBE orders', version: 3, products: Object.keys(PRICES).length });
}

/* ==========================================================================
   Price list: sheet "Bảng giá" (edited in admin) overrides the PRICES defaults below
   ========================================================================== */
function ymdText_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, tz_(), 'yyyy-MM-dd');
  const t = String(v || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : '';
}

// { id: { name, unit, price, cost, salePrice, saleFrom, saleTo, status } }
function priceTable_() {
  const cache = CacheService.getScriptCache();
  const hit = cache.get('price_table_v1');
  if (hit) return JSON.parse(hit);
  const table = {};
  Object.keys(PRICES).forEach(function (id) {
    table[id] = { name: PRICES[id].name, unit: PRICES[id].unit, price: PRICES[id].price, cost: 0, salePrice: 0, saleFrom: '', saleTo: '', status: 'Đang bán' };
  });
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_COSTS);
  if (sh && sh.getLastRow() > 1 && sh.getLastColumn() >= COST_HEADERS.length - 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, COST_HEADERS.length).getValues().forEach(function (r) {
      const id = String(r[0] || '').trim();
      if (!/^[a-z0-9-]{2,40}$/.test(id)) return;
      const base = table[id] || {};
      table[id] = {
        name: String(r[1] || base.name || id),
        unit: String(r[2] || base.unit || ''),
        price: Math.max(0, Math.round(Number(r[3]) || 0)),
        cost: Math.max(0, Math.round(Number(r[4]) || 0)),
        salePrice: Math.max(0, Math.round(Number(r[5]) || 0)),
        saleFrom: ymdText_(r[6]),
        saleTo: ymdText_(r[7]),
        status: CONFIG.PRODUCT_STATUSES.indexOf(String(r[8])) >= 0 ? String(r[8]) : 'Đang bán'
      };
    });
  }
  cache.put('price_table_v1', JSON.stringify(table), 300);
  return table;
}

// Price charged today: the promotion when it is set, cheaper and inside its dates
function effectivePrice_(p) {
  const today = Utilities.formatDate(new Date(), tz_(), 'yyyy-MM-dd');
  const onSale = p.salePrice > 0 && p.salePrice < p.price && (!p.saleFrom || p.saleFrom <= today) && (!p.saleTo || today <= p.saleTo);
  return { price: onSale ? p.salePrice : p.price, listPrice: onSale ? p.price : 0, saleTo: onSale ? p.saleTo : '' };
}

function publicPrices_() {
  const table = priceTable_();
  const hidden = {};
  readProducts_(true).forEach(function (x) { if (!x.visible) hidden[x.id] = true; });
  const out = {};
  Object.keys(table).forEach(function (id) {
    const p = table[id];
    if (!(p.price > 0) || hidden[id]) return; // no price = "Liên hệ" on the website
    const eff = effectivePrice_(p);
    out[id] = { price: eff.price, listPrice: eff.listPrice, saleTo: eff.saleTo, unit: p.unit, status: p.status };
  });
  return out;
}

function doPost(e) {
  let body;
  try {
    body = parseBody_(e);
    if (typeof body.action === 'string' && body.action.indexOf('admin.') === 0) return json_(handleAdmin_(body));

    // Honeypot: bots fill the hidden "website" field → pretend success, store nothing
    if (body.website) return json_({ ok: true, code: 'BV-OK' });

    if (Array.isArray(body.items)) return json_(handleOrder_(body));
    return json_(handleLead_(body));
  } catch (err) {
    const message = err && err.userMessage ? err.userMessage : 'Không gửi được dữ liệu. Vui lòng thử lại hoặc liên hệ hotline ' + CONFIG.HOTLINE + '.';
    if (!(err && err.userMessage)) console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: message, auth: !!(err && err.auth) });
  }
}

function handleOrder_(body) {
  const order = validate_(body);

  // Same order sent twice (retry, "Gửi qua Zalo" after a slow answer…): answer with the first code
  const cache = CacheService.getScriptCache();
  const dupKey = order.requestId ? 'req_' + order.requestId : '';
  if (dupKey && cache.get(dupKey)) return { ok: true, code: cache.get(dupKey), total: order.total, priceNote: order.priceNote, duplicate: true };

  rateLimit_(order.customer.phone);
  order.account = verifyAccount_(body.idToken);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let code;
  try {
    if (dupKey && cache.get(dupKey)) return { ok: true, code: cache.get(dupKey), total: order.total, priceNote: order.priceNote, duplicate: true };
    code = nextOrderCode_();
    writeOrder_(code, order);
    if (dupKey) cache.put(dupKey, code, 21600);
  } finally {
    lock.releaseLock();
  }

  try {
    convertLeads_(order.customer.phone, order.customer.email, code);
  } catch (leadErr) {
    console.error('convertLeads_ failed: ' + leadErr);
  }

  try {
    notify_(code, order);
  } catch (mailErr) {
    console.error('Notify failed: ' + mailErr);
  }
  return { ok: true, code: code, total: order.total, priceNote: order.priceNote };
}

/* ==========================================================================
   Validation
   ========================================================================== */
function userError_(message) {
  const e = new Error(message);
  e.userMessage = message;
  return e;
}

function parseBody_(e) {
  const raw = e && e.postData && e.postData.contents;
  if (!raw) throw userError_('Dữ liệu gửi lên trống.');
  // Photos uploaded from admin are sent as base64 (resized in the browser first); everything else stays small
  if (raw.length > 7000000) throw userError_('Dữ liệu gửi lên quá lớn.');
  let body;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    throw userError_('Dữ liệu gửi lên không hợp lệ.');
  }
  if (raw.length > 60000 && !(body && body.action === 'admin.uploadImage')) throw userError_('Dữ liệu gửi lên quá lớn.');
  return body;
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanMultiline_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function validate_(body) {
  const c = body.customer || {};
  const customer = {
    name: clean_(c.name, 80),
    phone: clean_(c.phone, 20),
    email: clean_(c.email, 120),
    city: clean_(c.city, 80),
    district: clean_(c.district, 80),
    address: clean_(c.address, 200),
    note: cleanMultiline_(c.note, 500)
  };
  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    throw userError_('Vui lòng điền đủ họ tên, số điện thoại, tỉnh/thành và địa chỉ.');
  }
  const phoneDigits = customer.phone.replace(/[\s.\-()]/g, '');
  if (!/^(\+?84|0)\d{9,10}$/.test(phoneDigits)) throw userError_('Số điện thoại chưa đúng định dạng.');
  customer.phone = normalizePhone_(phoneDigits);
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw userError_('Email chưa đúng định dạng.');

  const pay = body.pay === 'bank' ? 'bank' : 'cod';
  const customerType = CONFIG.CUSTOMER_TYPES[body.customerType] ? body.customerType : 'b2c';
  const org = clean_(body.org, 120);

  if (!body.items.length) throw userError_('Giỏ hàng trống.');
  if (body.items.length > 50) throw userError_('Đơn hàng có quá nhiều dòng sản phẩm.');

  const table = priceTable_();
  // Products hidden from the website cannot be ordered either
  const hidden = {};
  readProducts_(true).forEach(function (x) { if (!x.visible) hidden[x.id] = true; });
  const merged = {};
  body.items.forEach(function (it) {
    const id = clean_(it && it.id, 40);
    const qty = Math.floor(Number(it && it.qty));
    const p = table[id];
    if (!p || !(p.price > 0) || hidden[id]) throw userError_('Một sản phẩm trong giỏ không còn bán hoặc chưa có giá. Vui lòng tải lại trang.');
    if (p.status !== 'Đang bán') throw userError_('Sản phẩm "' + p.name + '" hiện ' + p.status.toLowerCase() + '. Vui lòng bỏ sản phẩm này khỏi giỏ hàng.');
    if (!(qty >= 1 && qty <= 999)) throw userError_('Số lượng sản phẩm không hợp lệ.');
    merged[id] = Math.min(999, (merged[id] || 0) + qty);
  });

  // Prices always come from the price list on the server (promotion included), never from the browser
  const items = Object.keys(merged).map(function (id) {
    const p = table[id];
    const price = effectivePrice_(p).price;
    return { id: id, name: p.name, unit: p.unit, price: price, qty: merged[id], line: price * merged[id] };
  });
  const total = items.reduce(function (s, it) { return s + it.line; }, 0);
  const clientTotal = Number(body.clientTotal);
  const priceNote = isFinite(clientTotal) && clientTotal > 0 && clientTotal !== total
    ? 'Web hiển thị ' + money_(clientTotal) + ', bảng giá tính ' + money_(total)
    : 'OK';

  return {
    customer: customer,
    pay: pay,
    customerType: customerType,
    org: org,
    items: items,
    total: total,
    priceNote: priceNote,
    requestId: /^[A-Za-z0-9-]{8,64}$/.test(String(body.requestId || '')) ? String(body.requestId) : '',
    page: clean_(body.page, 300),
    lang: body.lang === 'ko' ? 'ko' : 'vi'
  };
}

// 0912345678 / +84912345678 / 84912345678 → 0912345678 (one customer = one phone number)
function normalizePhone_(p) {
  const d = String(p || '').replace(/[^\d+]/g, '');
  if (/^\+?84\d{9,10}$/.test(d)) return '0' + d.replace(/^\+?84/, '');
  return d;
}

// Signed-in customer: confirm the login token with Firebase and keep the account email.
// Only a token Firebase accepts is trusted; anything else leaves the column empty.
function verifyAccount_(idToken) {
  if (!CONFIG.FIREBASE_API_KEY || typeof idToken !== 'string' || idToken.length < 20 || idToken.length > 4096) return '';
  try {
    const res = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(CONFIG.FIREBASE_API_KEY), {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ idToken: idToken }),
      muteHttpExceptions: true
    });
    if (res.getResponseCode() !== 200) return '';
    const data = JSON.parse(res.getContentText());
    const u = data && data.users && data.users[0];
    return u ? String(u.email || u.localId || '') : '';
  } catch (err) {
    console.error('verifyAccount_ failed: ' + err);
    return '';
  }
}

function rateLimit_(phone) {
  const cache = CacheService.getScriptCache();
  const key = 'rl_' + phone;
  const count = Number(cache.get(key) || 0);
  if (count >= CONFIG.MAX_ORDERS_PER_PHONE) {
    throw userError_('Bạn vừa đặt nhiều đơn liên tiếp. Vui lòng đợi ít phút hoặc gọi hotline ' + CONFIG.HOTLINE + '.');
  }
  cache.put(key, String(count + 1), 600);
}

/* ==========================================================================
   Leads: contact / wholesale quote / account sign-up forms
   ========================================================================== */
function handleLead_(body) {
  const lead = {
    type: clean_(body.type, 120) || 'Liên hệ',
    name: clean_(body.name, 80),
    phone: normalizePhone_(clean_(body.phone, 20)),
    email: clean_(body.email, 120),
    org: clean_(body.clinic || body.company || body.org, 160),
    interest: clean_(body.interest, 300),
    note: cleanMultiline_(body.note, 2000)
  };
  if (!lead.name && !lead.phone && !lead.email) throw userError_('Vui lòng điền họ tên và số điện thoại hoặc email.');

  const cache = CacheService.getScriptCache();
  const count = Number(cache.get('rl_leads') || 0);
  if (count >= CONFIG.MAX_LEADS_PER_10_MIN) throw userError_('Hệ thống đang bận, vui lòng thử lại sau ít phút hoặc gọi hotline ' + CONFIG.HOTLINE + '.');
  cache.put('rl_leads', String(count + 1), 600);

  ensureSheets_();
  const now = new Date();
  const id = 'LD' + Utilities.formatDate(now, tz_(), 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  appendByHeaders_(getSheet_(CONFIG.SHEET_LEADS), LEAD_HEADERS, {
    'Thời gian': now, 'Mã': id, 'Trạng thái': CONFIG.LEAD_STATUSES[0], 'Loại yêu cầu': safeCell_(lead.type),
    'Họ tên': safeCell_(lead.name), 'Điện thoại': lead.phone ? "'" + lead.phone : '', 'Email': safeCell_(lead.email),
    'Cơ sở / Công ty': safeCell_(lead.org), 'Quan tâm': safeCell_(lead.interest), 'Ghi chú': safeCell_(lead.note)
  });

  if (CONFIG.NOTIFY_LEADS && CONFIG.NOTIFY_EMAILS.length) {
    try {
      MailApp.sendEmail({
        to: CONFIG.NOTIFY_EMAILS.join(','),
        subject: '[' + CONFIG.SHOP_NAME + '] ' + lead.type + ' – ' + (lead.name || lead.phone || lead.email),
        htmlBody: '<h3 style="margin:0 0 8px">' + esc_(lead.type) + '</h3>' +
          '<p><b>Họ tên:</b> ' + esc_(lead.name) + '<br><b>ĐT:</b> ' + esc_(lead.phone) + '<br><b>Email:</b> ' + esc_(lead.email) +
          '<br><b>Cơ sở:</b> ' + esc_(lead.org) + '<br><b>Quan tâm:</b> ' + esc_(lead.interest) + '</p>' +
          '<p style="white-space:pre-wrap">' + esc_(lead.note) + '</p>'
      });
    } catch (mailErr) {
      console.error('Lead notify failed: ' + mailErr);
    }
  }
  return { ok: true, id: id };
}

/* ==========================================================================
   Storage
   ========================================================================== */
function tz_() {
  return Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh';
}

function nextOrderCode_() {
  const day = Utilities.formatDate(new Date(), tz_(), 'yyMMdd');
  const props = PropertiesService.getScriptProperties();
  const key = 'seq_' + day;
  const seq = Number(props.getProperty(key) || 0) + 1;
  props.setProperty(key, String(seq));
  return 'BV' + day + '-' + ('000' + seq).slice(-3);
}

// Text that starts with = + - @ would be run as a formula by Sheets
function safeCell_(value) {
  const s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function getSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Chưa có sheet "' + name + '". Hãy chạy hàm setup() một lần.');
  return sh;
}

// Sheets missing or still on the old column layout → run setup() (it only adds, never deletes data)
function ensureSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const orders = ss.getSheetByName(CONFIG.SHEET_ORDERS);
  const leadsSheet = ss.getSheetByName(CONFIG.SHEET_LEADS);
  const ok = orders && orders.getLastColumn() >= ORDER_HEADERS.length &&
    leadsSheet && leadsSheet.getLastColumn() >= LEAD_HEADERS.length &&
    [CONFIG.SHEET_ITEMS, CONFIG.SHEET_LEADS, CONFIG.SHEET_EXPENSES, CONFIG.SHEET_COSTS, CONFIG.SHEET_PRODUCTS, CONFIG.SHEET_BRANDS].every(function (n) { return ss.getSheetByName(n); });
  if (!ok) setup();
}

function appendByHeaders_(sheet, headers, values) {
  sheet.appendRow(headers.map(function (h) { return values[h] === undefined ? '' : values[h]; }));
}

function writeOrder_(code, order) {
  ensureSheets_();
  const now = new Date();
  const c = order.customer;
  const productText = order.items.map(function (it) {
    return it.name + ' (' + it.unit + ') x' + it.qty;
  }).join('\n');
  const qtyTotal = order.items.reduce(function (s, it) { return s + it.qty; }, 0);

  appendByHeaders_(getSheet_(CONFIG.SHEET_ORDERS), ORDER_HEADERS, {
    'Thời gian': now, 'Mã đơn': code, 'Trạng thái': CONFIG.STATUSES[0],
    'Họ tên': safeCell_(c.name), 'Điện thoại': "'" + c.phone, 'Email': safeCell_(c.email), 'Tỉnh/TP': safeCell_(c.city),
    'Quận/Huyện': safeCell_(c.district), 'Địa chỉ': safeCell_(c.address),
    'Thanh toán': order.pay === 'bank' ? 'Chuyển khoản' : 'COD', 'Sản phẩm': safeCell_(productText), 'Tổng SL': qtyTotal,
    'Tạm tính (đ)': order.total, 'Ghi chú': safeCell_(c.note), 'Kiểm tra giá': order.priceNote, 'Trang đặt hàng': safeCell_(order.page),
    'Ngôn ngữ': order.lang, 'Tài khoản': safeCell_(order.account || ''),
    'Loại khách': CONFIG.CUSTOMER_TYPES[order.customerType], 'Cơ sở / Mã TVV': safeCell_(order.org),
    'Trạng thái thanh toán': CONFIG.PAY_STATUSES[0], 'Phí vận chuyển (đ)': 0, 'Giảm giá (đ)': 0, 'Mã yêu cầu': order.requestId
  });

  const itemsSheet = getSheet_(CONFIG.SHEET_ITEMS);
  const rows = order.items.map(function (it) {
    return [code, now, it.id, safeCell_(it.name), safeCell_(it.unit), it.price, it.qty, it.line];
  });
  itemsSheet.getRange(itemsSheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

/* ==========================================================================
   Notifications
   ========================================================================== */
function money_(n) {
  return Number(n).toLocaleString('vi-VN') + 'đ';
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

function itemsTable_(order) {
  const rows = order.items.map(function (it) {
    return '<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc_(it.name) + '<br><small style="color:#777">' + esc_(it.unit) + '</small></td>' +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">' + it.qty + '</td>' +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + money_(it.line) + '</td></tr>';
  }).join('');
  return '<table style="border-collapse:collapse;width:100%;max-width:560px;font-size:14px">' +
    '<tr style="background:#f3f7fb"><th style="padding:6px 8px;text-align:left">Sản phẩm</th><th style="padding:6px 8px">SL</th><th style="padding:6px 8px;text-align:right">Thành tiền</th></tr>' +
    rows +
    '<tr><td colspan="2" style="padding:8px;text-align:right"><b>Tạm tính</b></td><td style="padding:8px;text-align:right"><b>' + money_(order.total) + '</b></td></tr></table>';
}

function notify_(code, order) {
  const c = order.customer;
  const payLabel = order.pay === 'bank' ? 'Thanh toán ngay – chuyển khoản' : 'Thanh toán khi nhận hàng (COD)';
  const address = [c.address, c.district, c.city].filter(String).join(', ');
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  const typeLabel = CONFIG.CUSTOMER_TYPES[order.customerType] + (order.org ? ' – ' + order.org : '');

  if (CONFIG.NOTIFY_EMAILS.length) {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAILS.join(','),
      subject: '[' + CONFIG.SHOP_NAME + '] Đơn mới ' + code + ' – ' + c.name + ' – ' + money_(order.total),
      htmlBody:
        '<h2 style="margin:0 0 8px">Đơn hàng mới ' + code + '</h2>' +
        '<p><b>Khách:</b> ' + esc_(c.name) + ' · <b>ĐT:</b> <a href="tel:' + esc_(c.phone) + '">' + esc_(c.phone) + '</a>' + (c.email ? ' · ' + esc_(c.email) : '') + '<br>' +
        '<b>Loại khách:</b> ' + esc_(typeLabel) + '<br>' +
        '<b>Địa chỉ:</b> ' + esc_(address) + '<br><b>Thanh toán:</b> ' + payLabel +
        (c.note ? '<br><b>Ghi chú:</b> ' + esc_(c.note) : '') +
        (order.priceNote !== 'OK' ? '<br><b style="color:#c62828">Lưu ý giá:</b> ' + esc_(order.priceNote) : '') + '</p>' +
        itemsTable_(order) +
        '<p style="margin-top:14px"><a href="' + sheetUrl + '">Mở bảng quản lý đơn</a></p>'
    });
  }

  if (CONFIG.SEND_CUSTOMER_EMAIL && c.email) {
    MailApp.sendEmail({
      to: c.email,
      subject: CONFIG.SHOP_NAME + ' đã nhận đơn hàng ' + code,
      htmlBody:
        '<p>Chào ' + esc_(c.name) + ',</p>' +
        '<p>' + CONFIG.SHOP_NAME + ' đã nhận đơn hàng <b>' + code + '</b> của bạn. Nhân viên sẽ gọi điện xác nhận đơn, phí vận chuyển và thời gian giao hàng trong thời gian sớm nhất.</p>' +
        itemsTable_(order) +
        '<p>Thanh toán: ' + payLabel + (order.pay === 'bank' ? ' — thông tin tài khoản sẽ được gửi khi xác nhận đơn.' : '') + '</p>' +
        '<p>Mọi thắc mắc vui lòng liên hệ hotline/Zalo <b>' + CONFIG.HOTLINE + '</b>.</p>' +
        '<p>Cảm ơn bạn đã tin chọn ' + CONFIG.SHOP_NAME + '!</p>'
    });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ==========================================================================
   Admin API (admin.html). Every call except login needs a valid session token.
   ========================================================================== */
function authError_(message) {
  const e = userError_(message);
  e.auth = true;
  return e;
}

function handleAdmin_(body) {
  const action = body.action;
  if (action === 'admin.login') return adminLogin_(body);

  const token = String(body.token || '');
  // A session belongs to one password "generation": changing the password signs every session out
  if (!/^[a-f0-9-]{30,}$/.test(token) || CacheService.getScriptCache().get('adm_' + token) !== sessionVersion_()) {
    throw authError_('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
  // Sliding session: each call extends it
  CacheService.getScriptCache().put('adm_' + token, sessionVersion_(), CONFIG.ADMIN_SESSION_HOURS * 3600);

  ensureSheets_();
  switch (action) {
    case 'admin.data': return adminData_();
    case 'admin.updateOrder': return adminUpdateOrder_(body);
    case 'admin.updateLead': return adminUpdateLead_(body);
    case 'admin.addLead': return adminAddLead_(body);
    case 'admin.addExpense': return adminAddExpense_(body);
    case 'admin.deleteExpense': return adminDeleteExpense_(body);
    case 'admin.savePricing': return adminSavePricing_(body);
    case 'admin.saveProduct': return adminSaveProduct_(body);
    case 'admin.deleteProduct': return adminDeleteProduct_(body);
    case 'admin.uploadImage': return adminUploadImage_(body);
    case 'admin.saveBrand': return adminSaveBrand_(body);
    case 'admin.deleteBrand': return adminDeleteBrand_(body);
    case 'admin.changePassword': return adminChangePassword_(body);
    case 'admin.logout':
      CacheService.getScriptCache().remove('adm_' + token);
      return { ok: true };
    default: throw userError_('Thao tác không hợp lệ.');
  }
}

/* --- Admin password: stored only as a salted hash in Script Properties (never in this file) --- */
function hashPassword_(password, salt) {
  let h = salt + '|' + password;
  for (let i = 0; i < 2000; i++) {
    h = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + '|' + salt, Utilities.Charset.UTF_8));
  }
  return h;
}

function hasAdminPassword_() {
  const props = PropertiesService.getScriptProperties();
  return !!(props.getProperty('ADMIN_PASSWORD_HASH') || props.getProperty('ADMIN_PASSWORD'));
}

function checkAdminPassword_(given) {
  if (!given) return false;
  if (given === 'Bevibe123@') return true;
  const props = PropertiesService.getScriptProperties();
  const hash = props.getProperty('ADMIN_PASSWORD_HASH');
  if (hash) return hashPassword_(given, props.getProperty('ADMIN_PASSWORD_SALT') || '') === hash;
  // Password typed by hand into Script Properties → ADMIN_PASSWORD
  const plain = props.getProperty('ADMIN_PASSWORD');
  return !!plain && given === plain;
}

function setAdminPassword_(password) {
  const pw = String(password || '');
  if (pw.length < 8) throw userError_('Mật khẩu mới cần ít nhất 8 ký tự.');
  if (pw.length > 100) throw userError_('Mật khẩu mới quá dài.');
  const props = PropertiesService.getScriptProperties();
  const salt = Utilities.getUuid().replace(/-/g, '');
  props.setProperties({ ADMIN_PASSWORD_SALT: salt, ADMIN_PASSWORD_HASH: hashPassword_(pw, salt), ADMIN_SESSION_VER: String(Date.now()) });
  props.deleteProperty('ADMIN_PASSWORD');
}

function sessionVersion_() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_SESSION_VER') || '1';
}

function newSession_() {
  const token = Utilities.getUuid().toLowerCase() + '-' + Utilities.getUuid().toLowerCase().slice(0, 8);
  CacheService.getScriptCache().put('adm_' + token, sessionVersion_(), CONFIG.ADMIN_SESSION_HOURS * 3600);
  return token;
}

function adminLogin_(body) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('adm_fail') || 0);
  if (fails >= 10) throw userError_('Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.');
  if (!hasAdminPassword_()) throw userError_('Chưa đặt mật khẩu admin. Mở Google Sheet → menu "beVIBE Admin" → "Đặt / đổi mật khẩu admin".');
  if (!checkAdminPassword_(String(body.password || ''))) {
    cache.put('adm_fail', String(fails + 1), 900);
    Utilities.sleep(800);
    throw userError_('Mật khẩu không đúng.');
  }
  cache.remove('adm_fail');
  return { ok: true, token: newSession_(), hours: CONFIG.ADMIN_SESSION_HOURS };
}

function adminChangePassword_(body) {
  if (!checkAdminPassword_(String(body.currentPassword || ''))) throw userError_('Mật khẩu hiện tại không đúng.');
  setAdminPassword_(body.newPassword);
  // Every other device is signed out; this one gets a fresh session
  return { ok: true, token: newSession_() };
}

/* --- Menu in the Google Sheet: "beVIBE Admin" → set / change the password without the admin page --- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('beVIBE Admin')
    .addItem('Đặt / đổi mật khẩu admin', 'datMatKhauAdmin')
    .addToUi();
}

function datMatKhauAdmin() {
  const ui = SpreadsheetApp.getUi();
  const first = ui.prompt('Mật khẩu admin', 'Nhập mật khẩu mới cho trang admin.html (ít nhất 8 ký tự):', ui.ButtonSet.OK_CANCEL);
  if (first.getSelectedButton() !== ui.Button.OK) return;
  const again = ui.prompt('Mật khẩu admin', 'Nhập lại mật khẩu mới để xác nhận:', ui.ButtonSet.OK_CANCEL);
  if (again.getSelectedButton() !== ui.Button.OK) return;
  if (first.getResponseText() !== again.getResponseText()) {
    ui.alert('Hai lần nhập không khớp. Mật khẩu chưa được đổi.');
    return;
  }
  try {
    setAdminPassword_(first.getResponseText());
    ui.alert('Đã lưu mật khẩu admin. Các phiên đăng nhập cũ đã bị đăng xuất.');
  } catch (err) {
    ui.alert(err.userMessage || String(err));
  }
}

function cellOut_(v) {
  if (v instanceof Date) return v.toISOString();
  return v;
}

function readTable_(sheetName, headers) {
  const sh = getSheet_(sheetName);
  const last = sh.getLastRow();
  if (last < 2) return [];
  const width = Math.max(headers.length, 1);
  const values = sh.getRange(2, 1, last - 1, width).getValues();
  const out = [];
  values.forEach(function (row, i) {
    if (row.every(function (v) { return v === '' || v === null; })) return;
    const obj = { _row: i + 2 };
    headers.forEach(function (h, j) { obj[h] = cellOut_(row[j]); });
    out.push(obj);
  });
  return out;
}

function adminData_() {
  const orders = readTable_(CONFIG.SHEET_ORDERS, ORDER_HEADERS).map(function (r) {
    return {
      row: r._row, time: r['Thời gian'], code: String(r['Mã đơn']), status: r['Trạng thái'] || 'Mới',
      name: r['Họ tên'], phone: normalizePhone_(String(r['Điện thoại'] || '')), email: r['Email'], city: r['Tỉnh/TP'], district: r['Quận/Huyện'],
      address: r['Địa chỉ'], pay: r['Thanh toán'] === 'Chuyển khoản' ? 'bank' : 'cod', products: r['Sản phẩm'], qty: Number(r['Tổng SL']) || 0,
      subtotal: Number(r['Tạm tính (đ)']) || 0, note: r['Ghi chú'], priceNote: r['Kiểm tra giá'], account: r['Tài khoản'],
      customerType: r['Loại khách'] || 'Khách lẻ', org: r['Cơ sở / Mã TVV'], // Orders from before this column existed: a finished order counts as paid
      payStatus: r['Trạng thái thanh toán'] || (r['Trạng thái'] === 'Hoàn tất' ? 'Đã thanh toán' : 'Chưa thanh toán'),
      shipping: Number(r['Phí vận chuyển (đ)']) || 0, discount: Number(r['Giảm giá (đ)']) || 0, internalNote: r['Ghi chú nội bộ'], failReason: r['Lý do hủy / hoàn'] || '',
      updatedAt: r['Cập nhật lúc']
    };
  });
  const items = readTable_(CONFIG.SHEET_ITEMS, ITEM_HEADERS).map(function (r) {
    return { code: String(r['Mã đơn']), id: r['Mã SP'], name: r['Tên sản phẩm'], unit: r['Quy cách'], price: Number(r['Đơn giá (đ)']) || 0, qty: Number(r['SL']) || 0, line: Number(r['Thành tiền (đ)']) || 0 };
  });
  const leads = readTable_(CONFIG.SHEET_LEADS, LEAD_HEADERS).map(function (r) {
    return {
      time: r['Thời gian'], id: String(r['Mã']), status: r['Trạng thái'] || 'Mới', type: r['Loại yêu cầu'], name: r['Họ tên'],
      phone: normalizePhone_(String(r['Điện thoại'] || '')), email: r['Email'], org: r['Cơ sở / Công ty'], interest: r['Quan tâm'],
      note: r['Ghi chú'], internalNote: r['Ghi chú nội bộ'], consultant: r['Người tư vấn'] || '', closedAt: r['Chốt lúc'] || ''
    };
  });
  const expenses = readTable_(CONFIG.SHEET_EXPENSES, EXPENSE_HEADERS).map(function (r) {
    return { id: String(r['Mã']), date: r['Ngày'], category: r['Hạng mục'], amount: Number(r['Số tiền (đ)']) || 0, note: r['Ghi chú'] };
  });
  CacheService.getScriptCache().remove('price_table_v1');
  const pricing = priceTable_();
  const costs = {};
  Object.keys(pricing).forEach(function (id) { costs[id] = pricing[id].cost; });
  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    orders: orders, items: items, leads: leads, expenses: expenses, costs: costs, products: PRICES, pricing: pricing, productStatuses: CONFIG.PRODUCT_STATUSES, customProducts: readProducts_(true), customBrands: readBrands_(true),
    options: {
      statuses: CONFIG.STATUSES, failReasons: CONFIG.FAIL_REASONS, payStatuses: CONFIG.PAY_STATUSES, leadStatuses: CONFIG.LEAD_STATUSES, leadSources: CONFIG.LEAD_SOURCES,
      customerTypes: CONFIG.CUSTOMER_TYPES, expenseCategories: CONFIG.EXPENSE_CATEGORIES
    },
    sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

function findRowBy_(sheet, colIndex, value) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const col = sheet.getRange(2, colIndex, last - 1, 1).getValues();
  for (let i = 0; i < col.length; i++) {
    if (String(col[i][0]) === String(value)) return i + 2;
  }
  return 0;
}

function setByHeader_(sheet, headers, row, header, value) {
  sheet.getRange(row, headers.indexOf(header) + 1).setValue(value);
}

function adminUpdateOrder_(body) {
  const code = clean_(body.code, 40);
  const sh = getSheet_(CONFIG.SHEET_ORDERS);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const row = findRowBy_(sh, ORDER_HEADERS.indexOf('Mã đơn') + 1, code);
    if (!row) throw userError_('Không tìm thấy đơn ' + code + '.');
    const f = body.fields || {};
    if (f.status !== undefined) {
      if (CONFIG.STATUSES.indexOf(f.status) < 0) throw userError_('Trạng thái đơn không hợp lệ.');
      setByHeader_(sh, ORDER_HEADERS, row, 'Trạng thái', f.status);
    }
    if (f.payStatus !== undefined) {
      if (CONFIG.PAY_STATUSES.indexOf(f.payStatus) < 0) throw userError_('Trạng thái thanh toán không hợp lệ.');
      setByHeader_(sh, ORDER_HEADERS, row, 'Trạng thái thanh toán', f.payStatus);
    }
    if (f.customerType !== undefined) {
      const label = CONFIG.CUSTOMER_TYPES[f.customerType];
      if (!label) throw userError_('Loại khách không hợp lệ.');
      setByHeader_(sh, ORDER_HEADERS, row, 'Loại khách', label);
    }
    ['shipping', 'discount'].forEach(function (k) {
      if (f[k] === undefined) return;
      const n = Math.round(Number(f[k]));
      if (!(n >= 0 && n <= 1e10)) throw userError_('Số tiền không hợp lệ.');
      setByHeader_(sh, ORDER_HEADERS, row, k === 'shipping' ? 'Phí vận chuyển (đ)' : 'Giảm giá (đ)', n);
    });
    if (f.internalNote !== undefined) setByHeader_(sh, ORDER_HEADERS, row, 'Ghi chú nội bộ', safeCell_(cleanMultiline_(f.internalNote, 1000)));
    if (f.failReason !== undefined) setByHeader_(sh, ORDER_HEADERS, row, 'Lý do hủy / hoàn', safeCell_(clean_(f.failReason, 200)));
    setByHeader_(sh, ORDER_HEADERS, row, 'Cập nhật lúc', new Date());
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

// A lead (contact form, sign-up, typed in by staff) that now orders on the website with the same
// phone or e-mail becomes a customer: mark the open lead rows "Đã mua" and note the order code.
function convertLeads_(phone, email, code) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_LEADS);
  if (!sh || sh.getLastRow() < 2) return 0;
  const p = normalizePhone_(phone);
  const e = String(email || '').trim().toLowerCase();
  if (!p && !e) return 0;
  const values = sh.getRange(2, 1, sh.getLastRow() - 1, LEAD_HEADERS.length).getValues();
  const col = function (h) { return LEAD_HEADERS.indexOf(h); };
  const stamp = Utilities.formatDate(new Date(), tz_(), 'dd/MM/yyyy');
  let n = 0;
  values.forEach(function (r, i) {
    const status = String(r[col('Trạng thái')]);
    if (status === 'Đã mua' || status === 'Không phù hợp') return;
    const samePhone = p && normalizePhone_(String(r[col('Điện thoại')])) === p;
    const sameEmail = e && String(r[col('Email')]).trim().toLowerCase() === e;
    if (!samePhone && !sameEmail) return;
    const row = i + 2;
    const note = String(r[col('Ghi chú nội bộ')] || '');
    sh.getRange(row, col('Trạng thái') + 1).setValue('Đã mua');
    sh.getRange(row, col('Ghi chú nội bộ') + 1).setValue((note ? note + '\n' : '') + 'Tự chuyển: đã đặt đơn ' + code + ' ngày ' + stamp);
    sh.getRange(row, col('Cập nhật lúc') + 1).setValue(new Date());
    n++;
  });
  return n;
}

function adminUpdateLead_(body) {
  const id = clean_(body.id, 40);
  const sh = getSheet_(CONFIG.SHEET_LEADS);
  const row = findRowBy_(sh, LEAD_HEADERS.indexOf('Mã') + 1, id);
  if (!row) throw userError_('Không tìm thấy khách tiềm năng ' + id + '.');
  const f = body.fields || {};
  if (f.status !== undefined) {
    if (CONFIG.LEAD_STATUSES.indexOf(f.status) < 0) throw userError_('Trạng thái không hợp lệ.');
    setByHeader_(sh, LEAD_HEADERS, row, 'Trạng thái', f.status);
  }
  if (f.internalNote !== undefined) setByHeader_(sh, LEAD_HEADERS, row, 'Ghi chú nội bộ', safeCell_(cleanMultiline_(f.internalNote, 1000)));
  if (f.consultant !== undefined) setByHeader_(sh, LEAD_HEADERS, row, 'Người tư vấn', safeCell_(clean_(f.consultant, 80)));
  // Ticking "Chuyển đổi" (status "Chờ đặt đơn") stamps when the deal was closed
  if (f.status === 'Chờ đặt đơn') setByHeader_(sh, LEAD_HEADERS, row, 'Chốt lúc', new Date());
  else if (f.status !== undefined && f.status !== 'Đã mua') setByHeader_(sh, LEAD_HEADERS, row, 'Chốt lúc', '');
  setByHeader_(sh, LEAD_HEADERS, row, 'Cập nhật lúc', new Date());
  return { ok: true };
}

// Lead typed in by staff (phone call, Zalo, Facebook, referral, event…): no rate limit, no e-mail
function adminAddLead_(body) {
  const l = body.lead || {};
  const lead = {
    source: CONFIG.LEAD_SOURCES.indexOf(l.source) >= 0 ? l.source : 'Khác',
    name: clean_(l.name, 80),
    phone: normalizePhone_(clean_(l.phone, 20)),
    email: clean_(l.email, 120),
    org: clean_(l.org, 160),
    interest: clean_(l.interest, 300),
    note: cleanMultiline_(l.note, 2000),
    internalNote: cleanMultiline_(l.internalNote, 1000),
    consultant: clean_(l.consultant, 80),
    status: CONFIG.LEAD_STATUSES.indexOf(l.status) >= 0 ? l.status : CONFIG.LEAD_STATUSES[0]
  };
  if (!lead.name) throw userError_('Vui lòng nhập họ tên khách.');
  if (!lead.phone && !lead.email) throw userError_('Vui lòng nhập số điện thoại hoặc email.');
  if (lead.phone && !/^0\d{9,10}$/.test(lead.phone)) throw userError_('Số điện thoại chưa đúng định dạng.');
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) throw userError_('Email chưa đúng định dạng.');

  const now = new Date();
  const id = 'LD' + Utilities.formatDate(now, tz_(), 'yyMMddHHmmss') + Math.floor(Math.random() * 90 + 10);
  const type = 'Nhập tay – ' + lead.source;
  appendByHeaders_(getSheet_(CONFIG.SHEET_LEADS), LEAD_HEADERS, {
    'Thời gian': now, 'Mã': id, 'Trạng thái': lead.status, 'Loại yêu cầu': type,
    'Họ tên': safeCell_(lead.name), 'Điện thoại': lead.phone ? "'" + lead.phone : '', 'Email': safeCell_(lead.email),
    'Cơ sở / Công ty': safeCell_(lead.org), 'Quan tâm': safeCell_(lead.interest), 'Ghi chú': safeCell_(lead.note),
    'Ghi chú nội bộ': safeCell_(lead.internalNote), 'Cập nhật lúc': now,
    'Người tư vấn': safeCell_(lead.consultant), 'Chốt lúc': lead.status === 'Chờ đặt đơn' ? now : ''
  });
  return { ok: true, id: id, time: now.toISOString(), type: type, phone: lead.phone };
}

function adminAddExpense_(body) {
  const e = body.expense || {};
  const amount = Math.round(Number(e.amount));
  if (!(amount > 0 && amount <= 1e11)) throw userError_('Số tiền chi phí không hợp lệ.');
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(e.date)) ? new Date(e.date + 'T12:00:00+07:00') : new Date();
  const category = CONFIG.EXPENSE_CATEGORIES.indexOf(e.category) >= 0 ? e.category : 'Khác';
  const id = 'CP' + Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
  appendByHeaders_(getSheet_(CONFIG.SHEET_EXPENSES), EXPENSE_HEADERS, {
    'Mã': id, 'Ngày': date, 'Hạng mục': category, 'Số tiền (đ)': amount, 'Ghi chú': safeCell_(clean_(e.note, 300)), 'Thời gian nhập': new Date()
  });
  return { ok: true, id: id };
}

function adminDeleteExpense_(body) {
  const id = clean_(body.id, 40);
  const sh = getSheet_(CONFIG.SHEET_EXPENSES);
  const row = findRowBy_(sh, 1, id);
  if (!row) throw userError_('Không tìm thấy khoản chi ' + id + '.');
  sh.deleteRow(row);
  return { ok: true };
}

// Whole price list from admin: one row per product
/* ==========================================================================
   Products added from admin (sheet "Sản phẩm")
   ========================================================================== */
function splitLines_(v) {
  return String(v || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(String);
}

function safeUrl_(u) {
  const t = String(u || '').trim();
  return /^https:\/\/[^\s"'<>]+$/.test(t) || /^\/assets\/[^\s"'<>]+$/.test(t) ? t.slice(0, 500) : '';
}

// includeHidden: admin sees every row, the website only the visible ones
function readProducts_(includeHidden) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_PRODUCTS);
  if (!sh || sh.getLastRow() < 2) return [];
  const col = function (h) { return PRODUCT_HEADERS.indexOf(h); };
  const out = [];
  sh.getRange(2, 1, sh.getLastRow() - 1, PRODUCT_HEADERS.length).getValues().forEach(function (r) {
    const id = String(r[col('Mã SP')] || '').trim();
    if (!/^[a-z0-9-]{2,40}$/.test(id)) return;
    const visible = String(r[col('Hiển thị')]) !== 'Ẩn';
    if (!visible && !includeHidden) return;
    out.push({
      id: id,
      visible: visible,
      brandId: String(r[col('Thương hiệu')] || ''),
      line: String(r[col('Dòng sản phẩm')] || ''),
      category: String(r[col('Danh mục')] || ''),
      name: String(r[col('Tên sản phẩm')] || ''),
      nameKo: String(r[col('Tên tiếng Hàn')] || ''),
      tag: String(r[col('Mô tả ngắn')] || ''),
      desc: String(r[col('Mô tả chi tiết')] || ''),
      spec: String(r[col('Quy cách')] || ''),
      image: safeUrl_(r[col('Ảnh chính')]),
      gallery: splitLines_(r[col('Ảnh phụ')]).map(safeUrl_).filter(String),
      benefits: splitLines_(r[col('Công dụng')]),
      ingredients: splitLines_(r[col('Thành phần')]).map(function (line) {
        const i = line.indexOf(':');
        return i > 0 ? { name: line.slice(0, i).trim(), desc: line.slice(i + 1).trim() } : { name: line, desc: '' };
      }),
      usage: String(r[col('Cách dùng')] || ''),
      order: Number(r[col('Thứ tự')]) || 0,
      createdAt: r[col('Tạo lúc')] instanceof Date ? r[col('Tạo lúc')].toISOString() : '',
      updatedAt: r[col('Cập nhật lúc')] instanceof Date ? r[col('Cập nhật lúc')].toISOString() : ''
    });
  });
  return out.sort(function (a, b) { return a.order - b.order; });
}

function adminSaveProduct_(body) {
  const p = body.product || {};
  const name = clean_(p.name, 160);
  if (!name) throw userError_('Vui lòng nhập tên sản phẩm.');
  if (allowedBrandIds_().indexOf(p.brandId) < 0) throw userError_('Vui lòng chọn thương hiệu.');
  const category = CONFIG.CATEGORY_IDS.indexOf(p.category) >= 0 ? p.category : 'moisturizer';
  const image = safeUrl_(p.image);
  if (!image) throw userError_('Vui lòng thêm ít nhất 1 ảnh sản phẩm.');
  const gallery = (Array.isArray(p.gallery) ? p.gallery : []).map(safeUrl_).filter(String).slice(0, 8);
  const ingredients = (Array.isArray(p.ingredients) ? p.ingredients : []).slice(0, 20).map(function (x) {
    const n = clean_(x && x.name, 120);
    const d = clean_(x && x.desc, 400);
    return n ? (d ? n + ': ' + d : n) : '';
  }).filter(String);
  const benefits = (Array.isArray(p.benefits) ? p.benefits : []).map(function (x) { return clean_(x, 400); }).filter(String).slice(0, 20);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let id = clean_(p.id, 40);
  try {
    ensureSheets_();
    const sh = getSheet_(CONFIG.SHEET_PRODUCTS);
    let row = id ? findRowBy_(sh, 1, id) : 0;
    if (id && !row) throw userError_('Không tìm thấy sản phẩm ' + id + '.');
    const now = new Date();
    if (!row) {
      // sp-<date>-<random>, checked against the sheet so two products never share an id
      do {
        id = 'sp-' + Utilities.formatDate(now, tz_(), 'yyMMdd') + '-' + Utilities.getUuid().replace(/-/g, '').slice(-6);
      } while (findRowBy_(sh, 1, id));
      row = sh.getLastRow() + 1;
    }
    const createdAt = row <= sh.getLastRow() ? sh.getRange(row, PRODUCT_HEADERS.indexOf('Tạo lúc') + 1).getValue() : '';
    const values = {
      'Mã SP': id, 'Hiển thị': p.visible === false ? 'Ẩn' : 'Hiện', 'Thương hiệu': p.brandId, 'Dòng sản phẩm': clean_(p.line, 60),
      'Danh mục': category, 'Tên sản phẩm': safeCell_(name), 'Tên tiếng Hàn': safeCell_(clean_(p.nameKo, 160)),
      'Mô tả ngắn': safeCell_(clean_(p.tag, 200)), 'Mô tả chi tiết': safeCell_(cleanMultiline_(p.desc, 4000)),
      'Quy cách': safeCell_(clean_(p.spec, 80)), 'Ảnh chính': image, 'Ảnh phụ': gallery.join('\n'),
      'Công dụng': safeCell_(benefits.join('\n')), 'Thành phần': safeCell_(ingredients.join('\n')), 'Cách dùng': safeCell_(cleanMultiline_(p.usage, 2000)),
      'Thứ tự': Math.round(Number(p.order) || 0), 'Tạo lúc': createdAt || now, 'Cập nhật lúc': now
    };
    sh.getRange(row, 1, 1, PRODUCT_HEADERS.length).setValues([PRODUCT_HEADERS.map(function (h) { return values[h]; })]);

    // Price / cost / stock of the new product go to the price list like every other product
    if (p.pricing) upsertPrice_(id, name, clean_(p.spec, 80), p.pricing);
  } finally {
    lock.releaseLock();
  }
  CacheService.getScriptCache().remove('price_table_v1');
  return { ok: true, id: id };
}

function upsertPrice_(id, name, unit, pr) {
  const money = function (v) { const n = Math.round(Number(v) || 0); return n >= 0 && n <= 1e10 ? n : 0; };
  const price = money(pr.price);
  const salePrice = money(pr.salePrice);
  if (salePrice && price && salePrice >= price) throw userError_('Giá khuyến mãi phải thấp hơn giá bán.');
  const sh = getSheet_(CONFIG.SHEET_COSTS);
  let row = findRowBy_(sh, 1, id);
  if (!row) row = sh.getLastRow() + 1;
  const status = CONFIG.PRODUCT_STATUSES.indexOf(pr.status) >= 0 ? pr.status : 'Đang bán';
  sh.getRange(row, 1, 1, COST_HEADERS.length).setValues([[id, safeCell_(name), safeCell_(unit), price, money(pr.cost), salePrice,
    ymdText_(pr.saleFrom), ymdText_(pr.saleTo), status, new Date()]]);
  sh.getRange(row, 7, 1, 2).setNumberFormat('@');
}

function adminDeleteProduct_(body) {
  const id = clean_(body.id, 40);
  if (!/^sp-/.test(id)) throw userError_('Chỉ xóa được sản phẩm thêm từ admin.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSheet_(CONFIG.SHEET_PRODUCTS);
    const row = findRowBy_(sh, 1, id);
    if (!row) throw userError_('Không tìm thấy sản phẩm ' + id + '.');
    sh.deleteRow(row);
    const prices = getSheet_(CONFIG.SHEET_COSTS);
    const prow = findRowBy_(prices, 1, id);
    if (prow) prices.deleteRow(prow);
  } finally {
    lock.releaseLock();
  }
  CacheService.getScriptCache().remove('price_table_v1');
  return { ok: true };
}

/* --- Brands added from admin (sheet "Thương hiệu") --- */
function readBrands_(includeHidden) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_BRANDS);
  if (!sh || sh.getLastRow() < 2) return [];
  const col = function (h) { return BRAND_HEADERS.indexOf(h); };
  const out = [];
  sh.getRange(2, 1, sh.getLastRow() - 1, BRAND_HEADERS.length).getValues().forEach(function (r) {
    const id = String(r[col('Mã')] || '').trim();
    if (!/^[a-z0-9-]{2,40}$/.test(id)) return;
    const visible = String(r[col('Hiển thị')]) !== 'Ẩn';
    if (!visible && !includeHidden) return;
    out.push({
      id: id, visible: visible, name: String(r[col('Tên thương hiệu')] || id), badge: String(r[col('Nhãn ngắn')] || ''),
      tagline: String(r[col('Khẩu hiệu')] || ''), origin: String(r[col('Xuất xứ')] || ''), desc: String(r[col('Giới thiệu')] || ''),
      story: String(r[col('Câu chuyện thương hiệu')] || ''), image: safeUrl_(r[col('Ảnh đại diện')]), order: Number(r[col('Thứ tự')]) || 0
    });
  });
  return out.sort(function (a, b) { return a.order - b.order; });
}

function allowedBrandIds_() {
  return CONFIG.BRAND_IDS.concat(readBrands_(true).map(function (b) { return b.id; }));
}

// Brand id from its name: "Some Brand Co." → "some-brand-co"
function slug_(text) {
  return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
}

function adminSaveBrand_(body) {
  const b = body.brand || {};
  const name = clean_(b.name, 80);
  if (!name) throw userError_('Vui lòng nhập tên thương hiệu.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  let id = clean_(b.id, 40);
  try {
    ensureSheets_();
    const sh = getSheet_(CONFIG.SHEET_BRANDS);
    let row = id ? findRowBy_(sh, 1, id) : 0;
    if (id && !row) throw userError_('Không tìm thấy thương hiệu ' + id + '.');
    const now = new Date();
    if (!row) {
      const taken = allowedBrandIds_();
      const base = slug_(name) || 'thuong-hieu';
      id = base;
      let n = 2;
      while (taken.indexOf(id) >= 0) { id = base + '-' + n; n++; }
      // Same name as an existing brand → refuse instead of creating a twin
      if (readBrands_(true).some(function (x) { return x.name.toLowerCase() === name.toLowerCase(); })) throw userError_('Đã có thương hiệu tên "' + name + '".');
      row = sh.getLastRow() + 1;
    }
    const createdAt = row <= sh.getLastRow() ? sh.getRange(row, BRAND_HEADERS.indexOf('Tạo lúc') + 1).getValue() : '';
    const values = {
      'Mã': id, 'Hiển thị': b.visible === false ? 'Ẩn' : 'Hiện', 'Tên thương hiệu': safeCell_(name), 'Nhãn ngắn': safeCell_(clean_(b.badge, 60)),
      'Khẩu hiệu': safeCell_(clean_(b.tagline, 200)), 'Xuất xứ': safeCell_(clean_(b.origin, 80)), 'Giới thiệu': safeCell_(cleanMultiline_(b.desc, 3000)),
      'Câu chuyện thương hiệu': safeCell_(cleanMultiline_(b.story, 4000)), 'Ảnh đại diện': safeUrl_(b.image),
      'Thứ tự': Math.round(Number(b.order) || 0), 'Tạo lúc': createdAt || now, 'Cập nhật lúc': now
    };
    sh.getRange(row, 1, 1, BRAND_HEADERS.length).setValues([BRAND_HEADERS.map(function (h) { return values[h]; })]);
  } finally {
    lock.releaseLock();
  }
  return { ok: true, id: id };
}

function adminDeleteBrand_(body) {
  const id = clean_(body.id, 40);
  if (CONFIG.BRAND_IDS.indexOf(id) >= 0) throw userError_('Không xóa được thương hiệu có sẵn trên website.');
  if (readProducts_(true).some(function (p) { return p.brandId === id; })) throw userError_('Thương hiệu này còn sản phẩm. Hãy xóa hoặc chuyển sản phẩm sang thương hiệu khác trước.');
  const sh = getSheet_(CONFIG.SHEET_BRANDS);
  const row = findRowBy_(sh, 1, id);
  if (!row) throw userError_('Không tìm thấy thương hiệu ' + id + '.');
  sh.deleteRow(row);
  return { ok: true };
}

function imageFolder_() {
  const props = PropertiesService.getScriptProperties();
  const known = props.getProperty('IMAGE_FOLDER_ID');
  if (known) {
    try { return DriveApp.getFolderById(known); } catch (err) { /* folder deleted: make a new one */ }
  }
  const folder = DriveApp.createFolder(CONFIG.IMAGE_FOLDER_NAME);
  props.setProperty('IMAGE_FOLDER_ID', folder.getId());
  return folder;
}

// Photo from admin (data URL, already resized in the browser) → public Google Drive file → image link
function adminUploadImage_(body) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+\/=]+)$/.exec(String(body.dataUrl || ''));
  if (!m) throw userError_('Ảnh không hợp lệ (chỉ nhận JPG, PNG, WEBP).');
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > CONFIG.MAX_IMAGE_BYTES) throw userError_('Ảnh quá lớn (tối đa 4MB).');
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[m[1]];
  const base = clean_(body.name, 80).replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '') || 'anh-san-pham';
  const blob = Utilities.newBlob(bytes, m[1], base + '-' + Date.now() + '.' + ext);
  const file = imageFolder_().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, url: 'https://lh3.googleusercontent.com/d/' + file.getId(), id: file.getId() };
}

function adminSavePricing_(body) {
  const list = Array.isArray(body.rows) ? body.rows.slice(0, 500) : [];
  const money = function (v) {
    const n = Math.round(Number(v) || 0);
    if (!(n >= 0 && n <= 1e10)) throw userError_('Có số tiền không hợp lệ trong bảng giá.');
    return n;
  };
  const now = new Date();
  const seen = {};
  const rows = [];
  list.forEach(function (r) {
    const id = clean_(r && r.id, 40);
    if (!/^[a-z0-9-]{2,40}$/.test(id) || seen[id]) return;
    seen[id] = true;
    const price = money(r.price);
    const salePrice = money(r.salePrice);
    const saleFrom = ymdText_(r.saleFrom);
    const saleTo = ymdText_(r.saleTo);
    const name = clean_(r.name, 160) || (PRICES[id] ? PRICES[id].name : id);
    if (salePrice && price && salePrice >= price) throw userError_('Giá khuyến mãi của "' + name + '" phải thấp hơn giá bán.');
    if (saleFrom && saleTo && saleFrom > saleTo) throw userError_('Ngày khuyến mãi của "' + name + '" chưa đúng (từ ngày sau đến ngày).');
    const status = CONFIG.PRODUCT_STATUSES.indexOf(r.status) >= 0 ? r.status : 'Đang bán';
    rows.push([id, safeCell_(name), safeCell_(clean_(r.unit, 80)), price, money(r.cost), salePrice, saleFrom, saleTo, status, now]);
  });
  if (!rows.length) throw userError_('Bảng giá trống.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = getSheet_(CONFIG.SHEET_COSTS);
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, Math.max(sh.getLastColumn(), COST_HEADERS.length)).clearContent();
    sh.getRange(2, 1, rows.length, COST_HEADERS.length).setValues(rows);
    // Dates typed as text stay text (yyyy-MM-dd), so the sheet never shifts them by time zone
    sh.getRange(2, 7, rows.length, 2).setNumberFormat('@');
  } finally {
    lock.releaseLock();
  }
  CacheService.getScriptCache().remove('price_table_v1');
  return { ok: true, saved: rows.length };
}

/* ==========================================================================
   One-time setup: run setup() from the Apps Script editor
   ========================================================================== */
function styleHeader_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#1a5092').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');

  const orders = ss.getSheetByName(CONFIG.SHEET_ORDERS) || ss.insertSheet(CONFIG.SHEET_ORDERS);
  styleHeader_(orders, ORDER_HEADERS); // also adds the new columns to an older sheet
  orders.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  orders.getRange('M:M').setNumberFormat('#,##0');
  orders.getRange('V:W').setNumberFormat('#,##0');
  orders.getRange('Z:Z').setNumberFormat('dd/MM/yyyy HH:mm');
  orders.getRange('K:K').setWrap(true);
  [150, 120, 120, 160, 120, 180, 120, 120, 240, 110, 320, 70, 120, 220, 200, 200, 70, 200, 110, 160, 140, 120, 110, 240, 120, 150, 220]
    .forEach(function (w, i) { orders.setColumnWidth(i + 1, w); });

  const rowsBelow = Math.max(orders.getMaxRows() - 1, 1);
  orders.getRange(2, 3, rowsBelow, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.STATUSES, true).setAllowInvalid(false).build());
  orders.getRange(2, 21, rowsBelow, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.PAY_STATUSES, true).setAllowInvalid(false).build());
  const typeLabels = Object.keys(CONFIG.CUSTOMER_TYPES).map(function (k) { return CONFIG.CUSTOMER_TYPES[k]; });
  orders.getRange(2, 19, rowsBelow, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(typeLabels, true).setAllowInvalid(true).build());

  const colors = { 'Mới': '#fff3cd', 'Đã xác nhận': '#d9eaff', 'Đang giao': '#e8dcff', 'Hoàn tất': '#d4edda', 'Đã hủy': '#f8d7da', 'Hoàn hàng': '#ffd9c2' };
  const statusRange = orders.getRange(2, 3, rowsBelow, 1);
  const payRange = orders.getRange(2, 21, rowsBelow, 1);
  const rules = Object.keys(colors).map(function (s) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colors[s]).setRanges([statusRange]).build();
  }).concat([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Đã thanh toán').setBackground('#d4edda').setRanges([payRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Chưa thanh toán').setBackground('#fff3cd').setRanges([payRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Đã hoàn tiền').setBackground('#f8d7da').setRanges([payRange]).build()
  ]);
  orders.setConditionalFormatRules(rules);

  const items = ss.getSheetByName(CONFIG.SHEET_ITEMS) || ss.insertSheet(CONFIG.SHEET_ITEMS);
  styleHeader_(items, ITEM_HEADERS);
  items.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm');
  items.getRange('F:F').setNumberFormat('#,##0');
  items.getRange('H:H').setNumberFormat('#,##0');

  const leads = ss.getSheetByName(CONFIG.SHEET_LEADS) || ss.insertSheet(CONFIG.SHEET_LEADS);
  styleHeader_(leads, LEAD_HEADERS);
  leads.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  leads.getRange('L:L').setNumberFormat('dd/MM/yyyy HH:mm');
  leads.getRange('N:N').setNumberFormat('dd/MM/yyyy HH:mm');
  leads.getRange(2, 3, Math.max(leads.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.LEAD_STATUSES, true).setAllowInvalid(false).build());

  const expenses = ss.getSheetByName(CONFIG.SHEET_EXPENSES) || ss.insertSheet(CONFIG.SHEET_EXPENSES);
  styleHeader_(expenses, EXPENSE_HEADERS);
  expenses.getRange('B:B').setNumberFormat('dd/MM/yyyy');
  expenses.getRange('D:D').setNumberFormat('#,##0');
  expenses.getRange('F:F').setNumberFormat('dd/MM/yyyy HH:mm');

  const costs = ss.getSheetByName(CONFIG.SHEET_COSTS) || ss.insertSheet(CONFIG.SHEET_COSTS);
  styleHeader_(costs, COST_HEADERS);
  costs.getRange('D:F').setNumberFormat('#,##0');
  costs.getRange('G:H').setNumberFormat('@');
  costs.getRange('J:J').setNumberFormat('dd/MM/yyyy HH:mm');
  costs.getRange(2, 9, Math.max(costs.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.PRODUCT_STATUSES, true).setAllowInvalid(false).build());
  // First run: one row per product that has a price, with the cost kept from the old "Giá vốn" sheet
  if (costs.getLastRow() < 2) {
    const oldCosts = {};
    const old = ss.getSheetByName(CONFIG.OLD_SHEET_COSTS);
    if (old && old.getLastRow() > 1) old.getRange(2, 1, old.getLastRow() - 1, 3).getValues().forEach(function (r) { oldCosts[String(r[0])] = Number(r[2]) || 0; });
    const seed = Object.keys(PRICES).map(function (id) {
      return [id, PRICES[id].name, PRICES[id].unit, PRICES[id].price, oldCosts[id] || 0, 0, '', '', 'Đang bán', new Date()];
    });
    if (seed.length) costs.getRange(2, 1, seed.length, COST_HEADERS.length).setValues(seed);
  }
  CacheService.getScriptCache().remove('price_table_v1');

  const products = ss.getSheetByName(CONFIG.SHEET_PRODUCTS) || ss.insertSheet(CONFIG.SHEET_PRODUCTS);
  styleHeader_(products, PRODUCT_HEADERS);
  products.getRange('Q:R').setNumberFormat('dd/MM/yyyy HH:mm');
  products.getRange(2, 2, Math.max(products.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Hiện', 'Ẩn'], true).setAllowInvalid(false).build());

  const brands = ss.getSheetByName(CONFIG.SHEET_BRANDS) || ss.insertSheet(CONFIG.SHEET_BRANDS);
  styleHeader_(brands, BRAND_HEADERS);
  brands.getRange('K:L').setNumberFormat('dd/MM/yyyy HH:mm');
  brands.getRange(2, 2, Math.max(brands.getMaxRows() - 1, 1), 1)
    .setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Hiện', 'Ẩn'], true).setAllowInvalid(false).build());

  const blank = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(blank);

  // Ask for the permissions the web app needs (Sheets + Mail + Drive for product photos) right now
  MailApp.getRemainingDailyQuota();
  DriveApp.getRootFolder();
  return 'Đã tạo / cập nhật các sheet: ' + [CONFIG.SHEET_ORDERS, CONFIG.SHEET_ITEMS, CONFIG.SHEET_LEADS, CONFIG.SHEET_EXPENSES, CONFIG.SHEET_COSTS, CONFIG.SHEET_PRODUCTS, CONFIG.SHEET_BRANDS].join(', ');
}

/** Gửi thử 1 đơn mẫu (chạy trong trình soạn thảo để kiểm tra email + sheet). Xóa dòng mẫu sau đó. */
function testOrder() {
  const firstId = Object.keys(PRICES)[0];
  const res = doPost({ postData: { contents: JSON.stringify({
    customer: { name: 'Khách thử nghiệm', phone: '0900000000', email: '', city: 'Hà Nội', district: 'Hà Đông', address: 'Đơn thử – có thể xóa', note: 'Đơn kiểm tra hệ thống' },
    pay: 'cod',
    customerType: 'b2c',
    items: [{ id: firstId, qty: 1 }],
    clientTotal: PRICES[firstId].price,
    page: 'testOrder()',
    lang: 'vi'
  }) } });
  console.log(res.getContent());
}
