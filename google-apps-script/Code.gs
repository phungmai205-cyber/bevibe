/**
 * beVIBE — Hệ thống nhận đơn hàng (Google Apps Script gắn với 1 Google Sheet)
 *
 * Website gửi đơn (POST JSON) → script kiểm tra dữ liệu, tính lại tiền theo bảng giá,
 * ghi vào sheet "Đơn hàng" + "Chi tiết đơn", rồi gửi email báo đơn mới.
 *
 * Cài đặt: xem file HUONG-DAN-NHAN-DON.md ở thư mục gốc dự án.
 * Sau khi sửa file này, vào Triển khai → Quản lý triển khai → chỉnh sửa → Phiên bản mới.
 */

const CONFIG = {
  // Email nhận thông báo đơn mới (có thể thêm nhiều email)
  NOTIFY_EMAILS: ['bevibevn@gmail.com'],
  // Gửi email xác nhận cho khách nếu khách có điền email
  SEND_CUSTOMER_EMAIL: true,
  SHEET_ORDERS: 'Đơn hàng',
  SHEET_ITEMS: 'Chi tiết đơn',
  STATUSES: ['Mới', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy'],
  // Chống spam: tối đa số đơn cho cùng 1 số điện thoại trong 10 phút
  MAX_ORDERS_PER_PHONE: 3,
  HOTLINE: '033 828 2112',
  // Tài khoản khách (Firebase): dán "apiKey" trong assets/js/auth-config.js vào đây để ghi email
  // tài khoản đã đăng nhập vào cột "Tài khoản". Để trống thì cột này bỏ trống.
  FIREBASE_API_KEY: '',
  SHOP_NAME: 'beVIBE'
};

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
function doGet() {
  return json_({ ok: true, service: 'beVIBE orders', products: Object.keys(PRICES).length });
}

function doPost(e) {
  try {
    const body = parseBody_(e);

    // Honeypot: bots fill the hidden "website" field → pretend success, store nothing
    if (body.website) return json_({ ok: true, code: 'BV-OK' });

    const order = validate_(body);
    rateLimit_(order.customer.phone);
    order.account = verifyAccount_(body.idToken);

    const lock = LockService.getScriptLock();
    lock.waitLock(15000);
    let code;
    try {
      code = nextOrderCode_();
      writeOrder_(code, order);
    } finally {
      lock.releaseLock();
    }

    try {
      notify_(code, order);
    } catch (mailErr) {
      console.error('Notify failed: ' + mailErr);
    }

    return json_({ ok: true, code: code, total: order.total, priceNote: order.priceNote });
  } catch (err) {
    const message = err && err.userMessage ? err.userMessage : 'Không gửi được đơn hàng. Vui lòng thử lại hoặc liên hệ hotline ' + CONFIG.HOTLINE + '.';
    if (!(err && err.userMessage)) console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: message });
  }
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
  if (!raw) throw userError_('Dữ liệu đơn hàng trống.');
  if (raw.length > 20000) throw userError_('Dữ liệu đơn hàng quá lớn.');
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw userError_('Dữ liệu đơn hàng không hợp lệ.');
  }
}

function clean_(value, max) {
  return String(value == null ? '' : value).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
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
    note: String(c.note == null ? '' : c.note).replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').trim().slice(0, 500)
  };
  if (!customer.name || !customer.phone || !customer.city || !customer.address) {
    throw userError_('Vui lòng điền đủ họ tên, số điện thoại, tỉnh/thành và địa chỉ.');
  }
  const phoneDigits = customer.phone.replace(/[\s.\-()]/g, '');
  if (!/^(\+?84|0)\d{9,10}$/.test(phoneDigits)) throw userError_('Số điện thoại chưa đúng định dạng.');
  customer.phone = phoneDigits;
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) throw userError_('Email chưa đúng định dạng.');

  const pay = body.pay === 'bank' ? 'bank' : 'cod';

  if (!Array.isArray(body.items) || !body.items.length) throw userError_('Giỏ hàng trống.');
  if (body.items.length > 50) throw userError_('Đơn hàng có quá nhiều dòng sản phẩm.');

  const merged = {};
  body.items.forEach(function (it) {
    const id = clean_(it && it.id, 40);
    const qty = Math.floor(Number(it && it.qty));
    if (!PRICES[id]) throw userError_('Một sản phẩm trong giỏ không còn bán hoặc chưa có giá. Vui lòng tải lại trang.');
    if (!(qty >= 1 && qty <= 99)) throw userError_('Số lượng sản phẩm không hợp lệ.');
    merged[id] = Math.min(99, (merged[id] || 0) + qty);
  });

  // Prices always come from PRICES (server side), never from the browser
  const items = Object.keys(merged).map(function (id) {
    const p = PRICES[id];
    return { id: id, name: p.name, unit: p.unit, price: p.price, qty: merged[id], line: p.price * merged[id] };
  });
  const total = items.reduce(function (s, it) { return s + it.line; }, 0);
  const clientTotal = Number(body.clientTotal);
  const priceNote = isFinite(clientTotal) && clientTotal > 0 && clientTotal !== total
    ? 'Web hiển thị ' + money_(clientTotal) + ', bảng giá tính ' + money_(total)
    : 'OK';

  return {
    customer: customer,
    pay: pay,
    items: items,
    total: total,
    priceNote: priceNote,
    page: clean_(body.page, 300),
    lang: body.lang === 'ko' ? 'ko' : 'vi'
  };
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
   Storage
   ========================================================================== */
function nextOrderCode_() {
  const tz = Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh';
  const day = Utilities.formatDate(new Date(), tz, 'yyMMdd');
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

function writeOrder_(code, order) {
  // First order before setup() was run: create the sheets automatically
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(CONFIG.SHEET_ORDERS) || !ss.getSheetByName(CONFIG.SHEET_ITEMS)) setup();
  const now = new Date();
  const c = order.customer;
  const payLabel = order.pay === 'bank' ? 'Chuyển khoản' : 'COD';
  const productText = order.items.map(function (it) {
    return it.name + ' (' + it.unit + ') x' + it.qty;
  }).join('\n');
  const qtyTotal = order.items.reduce(function (s, it) { return s + it.qty; }, 0);

  getSheet_(CONFIG.SHEET_ORDERS).appendRow([
    now, code, CONFIG.STATUSES[0],
    safeCell_(c.name), "'" + c.phone, safeCell_(c.email), safeCell_(c.city), safeCell_(c.district), safeCell_(c.address),
    payLabel, safeCell_(productText), qtyTotal, order.total, safeCell_(c.note), order.priceNote, safeCell_(order.page), order.lang, safeCell_(order.account || '')
  ]);

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
  const payLabel = order.pay === 'bank' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng (COD)';
  const address = [c.address, c.district, c.city].filter(String).join(', ');
  const sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

  if (CONFIG.NOTIFY_EMAILS.length) {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAILS.join(','),
      subject: '[' + CONFIG.SHOP_NAME + '] Đơn mới ' + code + ' – ' + c.name + ' – ' + money_(order.total),
      htmlBody:
        '<h2 style="margin:0 0 8px">Đơn hàng mới ' + code + '</h2>' +
        '<p><b>Khách:</b> ' + esc_(c.name) + ' · <b>ĐT:</b> <a href="tel:' + esc_(c.phone) + '">' + esc_(c.phone) + '</a>' + (c.email ? ' · ' + esc_(c.email) : '') + '<br>' +
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
   One-time setup: run setup() from the Apps Script editor
   ========================================================================== */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');

  const orderHeaders = ['Thời gian', 'Mã đơn', 'Trạng thái', 'Họ tên', 'Điện thoại', 'Email', 'Tỉnh/TP', 'Quận/Huyện', 'Địa chỉ',
    'Thanh toán', 'Sản phẩm', 'Tổng SL', 'Tạm tính (đ)', 'Ghi chú', 'Kiểm tra giá', 'Trang đặt hàng', 'Ngôn ngữ', 'Tài khoản'];
  const itemHeaders = ['Mã đơn', 'Thời gian', 'Mã SP', 'Tên sản phẩm', 'Quy cách', 'Đơn giá (đ)', 'SL', 'Thành tiền (đ)'];

  const orders = ss.getSheetByName(CONFIG.SHEET_ORDERS) || ss.insertSheet(CONFIG.SHEET_ORDERS);
  if (orders.getLastRow() === 0) orders.appendRow(orderHeaders);
  else orders.getRange(1, 1, 1, orderHeaders.length).setValues([orderHeaders]); // add new columns to an older sheet
  orders.getRange(1, 1, 1, orderHeaders.length).setFontWeight('bold').setBackground('#1a5092').setFontColor('#ffffff');
  orders.setFrozenRows(1);
  orders.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  orders.getRange('M:M').setNumberFormat('#,##0');
  orders.getRange('K:K').setWrap(true);
  [150, 120, 120, 160, 120, 180, 120, 120, 240, 110, 320, 70, 120, 220, 200, 200, 70, 200].forEach(function (w, i) { orders.setColumnWidth(i + 1, w); });

  const statusRule = SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.STATUSES, true).setAllowInvalid(false).build();
  orders.getRange(2, 3, orders.getMaxRows() - 1, 1).setDataValidation(statusRule);

  const colors = { 'Mới': '#fff3cd', 'Đã xác nhận': '#d9eaff', 'Đang giao': '#e8dcff', 'Hoàn tất': '#d4edda', 'Đã hủy': '#f8d7da' };
  const statusRange = orders.getRange(2, 3, orders.getMaxRows() - 1, 1);
  const rules = Object.keys(colors).map(function (s) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s).setBackground(colors[s]).setRanges([statusRange]).build();
  });
  orders.setConditionalFormatRules(rules);

  const items = ss.getSheetByName(CONFIG.SHEET_ITEMS) || ss.insertSheet(CONFIG.SHEET_ITEMS);
  if (items.getLastRow() === 0) items.appendRow(itemHeaders);
  items.getRange(1, 1, 1, itemHeaders.length).setFontWeight('bold').setBackground('#1a5092').setFontColor('#ffffff');
  items.setFrozenRows(1);
  items.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm');
  items.getRange('F:F').setNumberFormat('#,##0');
  items.getRange('H:H').setNumberFormat('#,##0');

  const blank = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(blank);

  // Ask for the permissions the web app needs (Sheets + Mail) right now
  MailApp.getRemainingDailyQuota();
  return 'Đã tạo sheet "' + CONFIG.SHEET_ORDERS + '" và "' + CONFIG.SHEET_ITEMS + '".';
}

/** Gửi thử 1 đơn mẫu (chạy trong trình soạn thảo để kiểm tra email + sheet). Xóa dòng mẫu sau đó. */
function testOrder() {
  const firstId = Object.keys(PRICES)[0];
  const res = doPost({ postData: { contents: JSON.stringify({
    customer: { name: 'Khách thử nghiệm', phone: '0900000000', email: '', city: 'Hà Nội', district: 'Hà Đông', address: 'Đơn thử – có thể xóa', note: 'Đơn kiểm tra hệ thống' },
    pay: 'cod',
    items: [{ id: firstId, qty: 1 }],
    clientTotal: PRICES[firstId].price,
    page: 'testOrder()',
    lang: 'vi'
  }) } });
  console.log(res.getContent());
}
