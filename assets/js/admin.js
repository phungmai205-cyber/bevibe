/**
 * beVIBE — Phân hệ quản trị (admin.html)
 *
 * Data lives in the Google Sheet behind the order system (google-apps-script/Code.gs).
 * The page signs in with the admin password, then reads / updates orders, leads, expenses
 * and product costs through the same Apps Script web app (ORDER_ENDPOINT).
 * "Xem thử với dữ liệu mẫu" runs the whole page on generated data without touching the Sheet.
 */
import { ORDER_ENDPOINT } from './order-config.js';
import { brandsData } from './translations.js';
import { productPrices } from './prices.js';
import { CATEGORY_DEFS, detectCategory } from './catalog-defs.js';

const TOKEN_KEY = 'bevibe_admin_token_v1';
const PREF_KEY = 'bevibe_admin_prefs_v1';
const PAGE_SIZE = 50;

const STATUS_FLOW = ['Mới', 'Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Đã hủy', 'Hoàn hàng'];
// "Đã hủy": stopped before delivery · "Hoàn hàng": delivered but the customer refused it
const FAILED_STATUSES = ['Đã hủy', 'Hoàn hàng'];
const ACTIVE_STATUSES = ['Đã xác nhận', 'Đang giao', 'Hoàn tất'];
const STATUS_CLASS = { 'Mới': 'new', 'Đã xác nhận': 'confirmed', 'Đang giao': 'shipping', 'Hoàn tất': 'done', 'Đã hủy': 'cancelled', 'Hoàn hàng': 'returned' };
const PAY_CLASS = { 'Chưa thanh toán': 'unpaid', 'Đã thanh toán': 'paid', 'Đã hoàn tiền': 'refunded' };
const LEAD_CLASS = { 'Mới': 'new', 'Đã liên hệ': 'confirmed', 'Tiềm năng': 'shipping', 'Chờ đặt đơn': 'returned', 'Đã mua': 'done', 'Không phù hợp': 'cancelled' };
// Consultant ticks "Chuyển đổi" after closing the deal on Zalo / phone: the customer was sent to order on the website
const LEAD_WAITING = 'Chờ đặt đơn';
const TYPE_KEYS = { 'Khách lẻ': 'b2c', 'Khách sỉ': 'wholesale', 'Tư vấn viên': 'consultant' };

// Menu order: daily work first, the report last. DEFAULT_VIEW is the start page.
const VIEWS = {
  'don-hang': { title: 'Đơn hàng', period: true },
  'khach-hang': { title: 'Khách hàng', period: true },
  'huy-hoan': { title: 'Hủy & hoàn hàng', period: true },
  'tiem-nang': { title: 'Khách tiềm năng', period: true },
  'chi-phi': { title: 'Chi phí & giá vốn', period: true },
  'bao-cao': { title: 'Báo cáo', period: true }
};
const DEFAULT_VIEW = 'don-hang';

// Tabs at the top of "Đơn hàng" and "Khách hàng": one group of customers at a time
const TYPE_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'b2c', label: 'Khách lẻ' },
  { key: 'wholesale', label: 'Khách sỉ' },
  { key: 'consultant', label: 'Tư vấn viên' }
];

const FUNNEL = [
  { key: 'lead', label: 'Lead / liên hệ', color: '#3b4cb8' },
  { key: 'order', label: 'Đặt đơn', color: '#2f6fe0' },
  { key: 'confirmed', label: 'Đã xác nhận', color: '#2a8fd6' },
  { key: 'done', label: 'Hoàn tất', color: '#f2b51d' },
  { key: 'repeat', label: 'Khách trung thành', color: '#2fb35a' }
];

/* ==========================================================================
   Small helpers
   ========================================================================== */
const $ = (sel, root = document) => root.querySelector(sel);

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function money(n) {
  return `${Math.round(Number(n) || 0).toLocaleString('vi-VN')}đ`;
}

function shortMoney(n) {
  const v = Math.abs(Number(n) || 0);
  const sign = n < 0 ? '-' : '';
  if (v >= 1e9) return `${sign}${(v / 1e9).toFixed(v >= 1e10 ? 0 : 1).replace('.', ',')} tỷ`;
  if (v >= 1e6) return `${sign}${(v / 1e6).toFixed(v >= 1e8 ? 0 : 1).replace('.', ',')} tr`;
  if (v >= 1e3) return `${sign}${Math.round(v / 1e3)}k`;
  return `${sign}${Math.round(v)}`;
}

function pct(a, b) {
  if (!b) return '0%';
  const v = (a / b) * 100;
  return `${v >= 10 || v === 0 ? Math.round(v) : v.toFixed(1).replace('.', ',')}%`;
}

function toDate(v) {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmtDate(v) {
  const d = toDate(v);
  return d ? d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
}

function fmtDateTime(v) {
  const d = toDate(v);
  return d ? `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : '';
}

function ymd(d) {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function storeGet(store, key, fallback) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function storeSet(store, key, value) {
  try {
    if (value === null) store.removeItem(key);
    else store.setItem(key, JSON.stringify(value));
  } catch (e) { /* private mode: keep working without storage */ }
}

function chip(text, cls) {
  return `<span class="adm-chip adm-chip-${cls || 'muted'}">${esc(text)}</span>`;
}

function typeKey(label) {
  return TYPE_KEYS[label] || 'b2c';
}

/* ==========================================================================
   State
   ========================================================================== */
const prefs = storeGet(localStorage, PREF_KEY, {});
const state = {
  token: storeGet(sessionStorage, TOKEN_KEY, ''),
  demo: false,
  data: null,
  derived: null,
  view: DEFAULT_VIEW,
  period: { key: prefs.period || '30d', from: '', to: '' },
  funnelStage: 0,
  filters: {
    processing: { q: '', status: '', type: '', pay: '', payStatus: '', reason: '', page: 1 },
    success: { q: '', status: '', type: '', pay: '', payStatus: '', reason: '', page: 1 },
    failed: { q: '', status: '', type: '', pay: '', payStatus: '', reason: '', page: 1 },
    customers: { q: '', type: '', seg: '', mode: 'list', page: 1 },
    leads: { q: '', status: '', source: '', page: 1 },
    pricing: { q: '', brand: '', show: '', page: 1 }
  }
};

/* ==========================================================================
   API
   ========================================================================== */
async function api(action, payload = {}) {
  if (state.demo) return demoApi(action, payload);
  if (!ORDER_ENDPOINT) throw new Error('Chưa cấu hình ORDER_ENDPOINT trong assets/js/order-config.js.');
  let res;
  try {
    res = await fetch(ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, token: state.token, ...payload })
    });
  } catch (err) {
    throw new Error('Không kết nối được hệ thống (Google Apps Script). Kiểm tra mạng hoặc bản triển khai mới nhất của Code.gs.');
  }
  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error('Hệ thống trả về dữ liệu không đọc được. Hãy triển khai lại Code.gs phiên bản mới (xem HUONG-DAN-ADMIN.md).');
  }
  if (!json || !json.ok) {
    const e = new Error((json && json.error) || 'Thao tác không thành công.');
    if (json && json.auth) {
      e.auth = true;
      signOut(true);
    }
    throw e;
  }
  return json;
}

/* ==========================================================================
   Derived data (recomputed after each load / change)
   ========================================================================== */
function contactKey(phone, email) {
  const p = String(phone || '').replace(/[^\d]/g, '');
  if (p.length >= 9) return `p:${p}`;
  const e = String(email || '').trim().toLowerCase();
  return e ? `e:${e}` : '';
}

function derive() {
  const d = state.data;
  const itemsByCode = {};
  d.items.forEach((it) => { (itemsByCode[it.code] = itemsByCode[it.code] || []).push(it); });

  d.orders.forEach((o) => {
    o._date = toDate(o.time);
    o.net = Math.max(0, o.subtotal - o.discount);
    o.total = o.net + o.shipping;
    o.typeKey = typeKey(o.customerType);
    o.key = contactKey(o.phone, o.email);
    o.items = itemsByCode[o.code] || [];
    o.cogs = o.items.reduce((s, it) => s + (Number(d.costs[it.id]) || 0) * it.qty, 0);
  });
  d.orders.sort((a, b) => (b._date ? b._date.getTime() : 0) - (a._date ? a._date.getTime() : 0));
  d.leads.forEach((l) => { l._date = toDate(l.time); l.key = contactKey(l.phone, l.email); });
  d.leads.sort((a, b) => (b._date ? b._date.getTime() : 0) - (a._date ? a._date.getTime() : 0));
  d.expenses.forEach((x) => { x._date = toDate(x.date); });
  d.expenses.sort((a, b) => (b._date ? b._date.getTime() : 0) - (a._date ? a._date.getTime() : 0));

  // Customers: one row per phone number (or email), all time
  const customers = {};
  const touch = (key, info) => {
    if (!key) return null;
    const c = customers[key] || (customers[key] = { key, name: '', phone: '', email: '', type: '', org: '', city: '', orders: [], leads: [] });
    ['name', 'phone', 'email', 'org', 'city'].forEach((k) => { if (!c[k] && info[k]) c[k] = info[k]; });
    return c;
  };
  // Newest first, so the latest name / type wins
  d.orders.forEach((o) => {
    const c = touch(o.key, o);
    if (!c) return;
    if (!c.type) c.type = o.customerType;
    c.orders.push(o);
  });
  d.leads.forEach((l) => {
    const c = touch(l.key, l);
    if (c) c.leads.push(l);
  });
  const list = Object.values(customers).map((c) => {
    const valid = c.orders.filter((o) => !FAILED_STATUSES.includes(o.status));
    const done = c.orders.filter((o) => o.status === 'Hoàn tất');
    const firstOrder = c.orders.length ? c.orders[c.orders.length - 1]._date : null;
    return {
      ...c,
      type: c.type || 'Khách lẻ',
      validCount: valid.length,
      doneCount: done.length,
      revenue: done.reduce((s, o) => s + o.net, 0),
      ordered: valid.reduce((s, o) => s + o.net, 0),
      lastDate: c.orders.length ? c.orders[0]._date : (c.leads[0] ? c.leads[0]._date : null),
      firstOrder,
      seg: !c.orders.length ? 'lead' : done.length >= 2 ? 'repeat' : 'buyer'
    };
  });
  list.sort((a, b) => (b.lastDate ? b.lastDate.getTime() : 0) - (a.lastDate ? a.lastDate.getTime() : 0));
  state.derived = { customers: list, customerByKey: Object.fromEntries(list.map((c) => [c.key, c])) };

  // A lead whose phone / e-mail matches an order on the website is no longer just a lead:
  // it leaves "Khách tiềm năng · Chưa mua" and the person is handled in "Đơn hàng"
  d.leads.forEach((l) => {
    const c = l.key ? state.derived.customerByKey[l.key] : null;
    l.orders = c ? c.orders : [];
    l.converted = l.orders.length > 0;
    // Request sent AFTER the person had already ordered = a returning customer asking again
    l.fromBuyer = l.converted && l.orders.some((o) => o._date && l._date && o._date < l._date);
  });
}

function periodRange() {
  const now = new Date();
  const today = startOfDay(now);
  const day = 86400000;
  const p = state.period;
  switch (p.key) {
    case 'today': return [today, new Date(today.getTime() + day)];
    case '7d': return [new Date(today.getTime() - 6 * day), new Date(today.getTime() + day)];
    case '30d': return [new Date(today.getTime() - 29 * day), new Date(today.getTime() + day)];
    case 'month': return [new Date(now.getFullYear(), now.getMonth(), 1), new Date(today.getTime() + day)];
    case 'lastmonth': return [new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 1)];
    case 'year': return [new Date(now.getFullYear(), 0, 1), new Date(today.getTime() + day)];
    case 'custom': {
      const from = p.from ? new Date(`${p.from}T00:00:00`) : null;
      const to = p.to ? new Date(new Date(`${p.to}T00:00:00`).getTime() + day) : null;
      return [from, to];
    }
    default: return [null, null];
  }
}

function inRange(date, range) {
  if (!date) return range[0] === null && range[1] === null;
  return (!range[0] || date >= range[0]) && (!range[1] || date < range[1]);
}

// Show the exact dates of the chosen period in the "Từ / Đến" boxes
function syncPeriodInputs() {
  const from = $('#admFrom');
  const to = $('#admTo');
  const today = ymd(new Date());
  from.max = today;
  to.max = today;
  if (state.period.key === 'custom') {
    from.value = state.period.from || '';
    to.value = state.period.to || '';
    return;
  }
  const [a, b] = periodRange();
  let first = a;
  if (!first && state.data) {
    // "Toàn bộ": start at the oldest order / lead / expense
    const dates = [...state.data.orders, ...state.data.leads, ...state.data.expenses].map((x) => x._date).filter(Boolean);
    first = dates.length ? new Date(Math.min(...dates.map((d) => d.getTime()))) : null;
  }
  from.value = first ? ymd(first) : '';
  to.value = b ? ymd(new Date(b.getTime() - 1)) : today;
}

function periodLabel() {
  const sel = $('#admPeriod');
  if (state.period.key === 'custom') {
    const [a, b] = periodRange();
    return `${a ? fmtDate(a) : '…'} – ${b ? fmtDate(new Date(b.getTime() - 1)) : '…'}`;
  }
  return sel ? sel.options[sel.selectedIndex].text : '';
}

/* ==========================================================================
   Report numbers
   ========================================================================== */
function computeReport() {
  const d = state.data;
  const range = periodRange();
  const orders = d.orders.filter((o) => inRange(o._date, range));
  const valid = orders.filter((o) => !FAILED_STATUSES.includes(o.status));
  const done = orders.filter((o) => o.status === 'Hoàn tất');
  const processing = valid.filter((o) => o.status !== 'Hoàn tất');
  const cancelled = orders.filter((o) => FAILED_STATUSES.includes(o.status));
  const leads = d.leads.filter((l) => inRange(l._date, range));
  const expenses = d.expenses.filter((x) => inRange(x._date, range));

  const revenue = done.reduce((s, o) => s + o.net, 0);
  const pipeline = processing.reduce((s, o) => s + o.net, 0);
  const cogs = done.reduce((s, o) => s + o.cogs, 0);
  const opex = expenses.reduce((s, x) => s + x.amount, 0);
  const collected = orders.filter((o) => o.payStatus === 'Đã thanh toán').reduce((s, o) => s + o.total, 0);
  const missingCost = done.some((o) => o.items.some((it) => !(Number(d.costs[it.id]) > 0)));

  // Customers in the period
  const custKeys = new Set(valid.map((o) => o.key).filter(Boolean));
  let newCust = 0;
  custKeys.forEach((k) => {
    const c = state.derived.customerByKey[k];
    if (c && c.firstOrder && inRange(c.firstOrder, range)) newCust += 1;
  });

  // Daily / monthly revenue series
  const spanDays = range[0] && range[1] ? (range[1] - range[0]) / 86400000 : 999;
  const byMonth = spanDays > 62;
  const buckets = new Map();
  const bucketKey = (dt) => (byMonth ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}` : ymd(dt));
  if (!byMonth && range[0] && range[1]) {
    for (let t = range[0].getTime(); t < range[1].getTime(); t += 86400000) buckets.set(ymd(new Date(t)), { done: 0, open: 0 });
  }
  valid.forEach((o) => {
    if (!o._date) return;
    const k = bucketKey(o._date);
    const b = buckets.get(k) || { done: 0, open: 0 };
    if (o.status === 'Hoàn tất') b.done += o.net; else b.open += o.net;
    buckets.set(k, b);
  });
  const series = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({ k, ...v }));

  // Breakdowns
  const byType = {};
  valid.forEach((o) => {
    const t = byType[o.customerType] || (byType[o.customerType] = { orders: 0, ordered: 0, revenue: 0 });
    t.orders += 1;
    t.ordered += o.net;
    if (o.status === 'Hoàn tất') t.revenue += o.net;
  });
  const byPay = { bank: { orders: 0, amount: 0, paid: 0, unpaid: 0 }, cod: { orders: 0, amount: 0, paid: 0, unpaid: 0 } };
  valid.forEach((o) => {
    const p = byPay[o.pay];
    p.orders += 1;
    p.amount += o.total;
    if (o.payStatus === 'Đã thanh toán') p.paid += o.total; else p.unpaid += o.total;
  });
  const byStatus = Object.fromEntries(STATUS_FLOW.map((s) => [s, orders.filter((o) => o.status === s).length]));

  const products = {};
  valid.forEach((o) => o.items.forEach((it) => {
    const p = products[it.id] || (products[it.id] = { id: it.id, name: it.name, qty: 0, amount: 0 });
    p.qty += it.qty;
    p.amount += it.line;
  }));
  const topProducts = Object.values(products).sort((a, b) => b.amount - a.amount).slice(0, 8);

  const byCategory = {};
  expenses.forEach((x) => { byCategory[x.category] = (byCategory[x.category] || 0) + x.amount; });

  const byCity = {};
  valid.forEach((o) => { const c = (o.city || 'Khác').trim(); byCity[c] = (byCity[c] || 0) + o.net; });
  const topCities = Object.entries(byCity).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const unpaidBank = valid.filter((o) => o.pay === 'bank' && o.payStatus !== 'Đã thanh toán' && o.status !== 'Hoàn tất');
  const codToCollect = valid.filter((o) => o.pay === 'cod' && o.payStatus !== 'Đã thanh toán' && o.status === 'Đang giao');

  return {
    range, orders, valid, done, cancelled, leads, expenses,
    revenue, pipeline, cogs, opex, profit: revenue - cogs - opex, collected, missingCost,
    aov: valid.length ? valid.reduce((s, o) => s + o.net, 0) / valid.length : 0,
    customers: custKeys.size, newCust, returning: custKeys.size - newCust,
    series, byMonth, byType, byPay, byStatus, topProducts, byCategory, topCities, unpaidBank, codToCollect,
    funnel: computeFunnel(orders, leads)
  };
}

function computeFunnel(orders, leads) {
  const contacts = new Map();
  const get = (key, info) => {
    if (!key) return null;
    if (!contacts.has(key)) contacts.set(key, { key, name: info.name || '', phone: info.phone || '', email: info.email || '', orders: [], leads: [] });
    const c = contacts.get(key);
    if (!c.name && info.name) c.name = info.name;
    return c;
  };
  leads.forEach((l) => { const c = get(l.key, l); if (c) c.leads.push(l); });
  orders.forEach((o) => { const c = get(o.key, o); if (c) c.orders.push(o); });

  const list = [...contacts.values()].map((c) => {
    const doneCount = c.orders.filter((o) => o.status === 'Hoàn tất').length;
    let reached = 1;
    if (c.orders.length) reached = 2;
    if (c.orders.some((o) => ACTIVE_STATUSES.includes(o.status))) reached = 3;
    if (doneCount >= 1) reached = 4;
    if (doneCount >= 2) reached = 5;
    const lost = (c.orders.length > 0 && c.orders.every((o) => FAILED_STATUSES.includes(o.status)))
      || (!c.orders.length && c.leads.length > 0 && c.leads.every((l) => l.status === 'Không phù hợp'));
    return { ...c, reached, lost };
  });
  const reachedCount = FUNNEL.map((_, i) => list.filter((c) => c.reached >= i + 1).length);
  return { list, reachedCount, lost: list.filter((c) => c.lost) };
}

/* ==========================================================================
   Rendering: shell, routing, toast, drawer
   ========================================================================== */
const content = () => $('#admContent');

function toast(msg, isError) {
  const el = $('#admToast');
  el.textContent = msg;
  el.classList.toggle('is-error', !!isError);
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, isError ? 5000 : 2600);
}

function openDrawer(html) {
  $('#admDrawerBody').innerHTML = html;
  $('#admDrawer').classList.add('is-open');
  $('#admDrawer').setAttribute('aria-hidden', 'false');
  $('#admDrawerBackdrop').hidden = false;
  $('#admDrawer').focus();
}

function closeDrawer() {
  $('#admDrawer').classList.remove('is-open');
  $('#admDrawer').setAttribute('aria-hidden', 'true');
  $('#admDrawerBackdrop').hidden = true;
}

function routeFromHash() {
  const v = (window.location.hash || '').replace(/^#\/?/, '').split('/')[0];
  return VIEWS[v] ? v : DEFAULT_VIEW;
}

function render() {
  if (!state.data) return;
  state.view = routeFromHash();
  const def = VIEWS[state.view];
  $('#admTitle').textContent = def.title;
  document.title = `${def.title} · beVIBE Admin`;
  $('#admPeriodWrap').hidden = !def.period;
  syncPeriodInputs();
  document.querySelectorAll('.adm-nav a').forEach((a) => a.classList.toggle('is-active', a.dataset.view === state.view));
  $('#admUpdated').textContent = `${state.demo ? 'Dữ liệu mẫu · ' : ''}Cập nhật ${fmtDateTime(state.data.generatedAt)}${def.period ? ` · ${periodLabel()}` : ''}`;

  // New orders + new requests from returning customers (both wait in "Đơn hàng")
  const newOrders = state.data.orders.filter((o) => o.status === 'Mới').length
    + state.data.leads.filter((l) => l.fromBuyer && l.status === 'Mới').length;
  const newLeads = state.data.leads.filter((l) => l.status === 'Mới' && !l.converted).length;
  $('#admNewOrders').hidden = !newOrders;
  $('#admNewOrders').textContent = newOrders;
  $('#admNewLeads').hidden = !newLeads;
  $('#admNewLeads').textContent = newLeads;

  const views = { 'bao-cao': renderReport, 'don-hang': renderOrders, 'khach-hang': renderCustomers, 'huy-hoan': renderFailed, 'tiem-nang': renderLeads, 'chi-phi': renderCosts };
  content().innerHTML = views[state.view]();
}

/* ==========================================================================
   View: Báo cáo
   ========================================================================== */
function kpi(label, value, sub, tone) {
  return `<div class="adm-kpi ${tone ? `adm-kpi-${tone}` : ''}"><span class="adm-kpi-label">${label}</span><strong class="adm-kpi-value">${value}</strong>${sub ? `<span class="adm-kpi-sub">${sub}</span>` : ''}</div>`;
}

function barRow(label, value, max, valueText, color) {
  const w = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return `<div class="adm-bar-row"><span class="adm-bar-label" title="${esc(label)}">${esc(label)}</span><span class="adm-bar-track"><span class="adm-bar-fill" style="width:${w}%;${color ? `background:${color}` : ''}"></span></span><span class="adm-bar-value">${valueText}</span></div>`;
}

function renderFunnel(f) {
  const widths = [100, 84, 68, 53, 40];
  const top = f.reachedCount[0];
  const bands = FUNNEL.map((st, i) => {
    const w = widths[i];
    const next = widths[i + 1] || w * 0.78;
    const inset = ((w - next) / 2 / w) * 100;
    const band = `<button type="button" class="adm-funnel-band ${state.funnelStage === i ? 'is-active' : ''}" data-act="funnel-stage" data-stage="${i}"
        style="width:${w}%;background:${st.color};clip-path:polygon(0 0,100% 0,${100 - inset}% 100%,${inset}% 100%)">
        <span>B${i + 1} · ${st.label}</span><b>${f.reachedCount[i]}</b></button>`;
    const conv = i < FUNNEL.length - 1
      ? `<div class="adm-funnel-conv" style="width:${next}%">${pct(f.reachedCount[i + 1], f.reachedCount[i])} chuyển tiếp</div>` : '';
    return band + conv;
  }).join('');

  const s = state.funnelStage;
  const reached = f.reachedCount[s];
  const stayList = f.list.filter((c) => c.reached === s + 1 && !c.lost);
  const lostHere = f.list.filter((c) => c.reached === s + 1 && c.lost).length;
  const nextReached = f.reachedCount[s + 1] || 0;
  const people = stayList.slice(0, 40).map((c) => `<li><button type="button" class="adm-linkish" data-act="open-customer" data-key="${esc(c.key)}">${esc(c.name || c.phone || c.email)}</button><small>${esc(c.phone || c.email)}</small></li>`).join('');

  return `
    <section class="adm-card adm-funnel-card">
      <div class="adm-card-head">
        <div><h2>Phễu khách hàng</h2><p class="adm-muted">${top} liên hệ · ${periodLabel()} · bấm một bậc để xem chi tiết</p></div>
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-goto="khach-hang">Danh sách khách →</button>
      </div>
      <div class="adm-funnel-wrap">
        <div class="adm-funnel">${top ? bands : '<p class="adm-empty">Chưa có liên hệ hoặc đơn hàng trong khoảng thời gian này.</p>'}</div>
        ${top ? `
        <div class="adm-funnel-side">
          <div class="adm-funnel-detail">
            ${chip(`B${s + 1} · ${FUNNEL[s].label}`, 'info')}
            <dl>
              <div><dt>Đã từng đạt bậc</dt><dd>${reached}</dd></div>
              <div><dt>Đang ở bậc này</dt><dd>${stayList.length}</dd></div>
              <div><dt>Đã đi tiếp</dt><dd>${s < FUNNEL.length - 1 ? nextReached : '—'}</dd></div>
              <div><dt>Rời phễu tại bậc này</dt><dd>${lostHere}</dd></div>
              <div><dt>So với đầu phễu</dt><dd>${pct(reached, top)}</dd></div>
              <div><dt>Lên bậc kế</dt><dd>${s < FUNNEL.length - 1 ? pct(nextReached, reached) : '—'}</dd></div>
            </dl>
            ${people ? `<p class="adm-mini-title">Đang ở bậc này</p><ul class="adm-people">${people}</ul>${stayList.length > 40 ? `<p class="adm-muted">… và ${stayList.length - 40} khách khác</p>` : ''}` : ''}
          </div>
          <div class="adm-funnel-lost">${chip('Rời phễu', 'cancelled')}<strong>${f.lost.length}</strong><small>Mọi đơn đều hủy / hoàn hàng, hoặc lead "Không phù hợp"</small></div>
        </div>` : ''}
      </div>
      <p class="adm-fineprint">Mỗi bậc đếm số khách ĐÃ TỪNG ĐẠT bậc đó (gồm cả khách đã đi tiếp). Một khách = một số điện thoại (hoặc email nếu không có số).
      B1: để lại thông tin hoặc đặt đơn · B2: có đơn · B3: có đơn đã xác nhận / đang giao · B4: có đơn hoàn tất · B5: khách trung thành (từ 2 đơn hoàn tất).</p>
    </section>`;
}

function renderChart(r) {
  if (!r.series.length) return '<p class="adm-empty">Chưa có đơn hàng.</p>';
  const max = Math.max(...r.series.map((b) => b.done + b.open), 1);
  const n = r.series.length;
  const W = Math.max(n * 22, 320);
  const H = 180;
  const bw = Math.max(4, (W / n) * 0.62);
  const bars = r.series.map((b, i) => {
    const x = (i + 0.5) * (W / n) - bw / 2;
    const hDone = (b.done / max) * (H - 20);
    const hOpen = (b.open / max) * (H - 20);
    const label = r.byMonth ? `T${Number(b.k.slice(5))}/${b.k.slice(2, 4)}` : `${b.k.slice(8)}/${b.k.slice(5, 7)}`;
    const showLabel = n <= 16 || i % Math.ceil(n / 12) === 0 || i === n - 1;
    return `<g><title>${label}: hoàn tất ${money(b.done)} · đang xử lý ${money(b.open)}</title>
      <rect x="${x}" y="${H - hDone - hOpen}" width="${bw}" height="${hOpen}" rx="2" class="adm-bar-open"></rect>
      <rect x="${x}" y="${H - hDone}" width="${bw}" height="${hDone}" rx="2" class="adm-bar-done"></rect>
      ${showLabel ? `<text x="${x + bw / 2}" y="${H + 16}" text-anchor="middle">${label}</text>` : ''}</g>`;
  }).join('');
  return `<div class="adm-chart-scroll"><svg class="adm-chart" viewBox="0 0 ${W} ${H + 22}" style="min-width:${Math.min(W, 900)}px" role="img" aria-label="Doanh thu theo ${r.byMonth ? 'tháng' : 'ngày'}">
      <line x1="0" y1="${H}" x2="${W}" y2="${H}" class="adm-axis"></line>${bars}</svg></div>
    <p class="adm-legend"><span class="adm-dot adm-dot-done"></span>Hoàn tất <span class="adm-dot adm-dot-open"></span>Đang xử lý (mới, đã xác nhận, đang giao) · cao nhất ${money(max)}</p>`;
}

function renderReport() {
  const r = computeReport();
  const typeRows = Object.entries(r.byType).sort((a, b) => b[1].ordered - a[1].ordered);
  const maxType = Math.max(...typeRows.map(([, v]) => v.ordered), 1);
  const typeColors = { 'Khách lẻ': '#2f6fe0', 'Khách sỉ': '#1a5092', 'Tư vấn viên': '#2fb35a' };
  const catRows = Object.entries(r.byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...catRows.map(([, v]) => v), 1);
  const maxProd = Math.max(...r.topProducts.map((p) => p.amount), 1);
  const maxCity = Math.max(...r.topCities.map(([, v]) => v), 1);
  const totalOrders = r.orders.length;

  return `
    ${r.unpaidBank.length || r.codToCollect.length || r.byStatus['Mới'] ? `
    <div class="adm-alerts">
      ${r.byStatus['Mới'] ? `<button type="button" class="adm-alert" data-act="filter-orders" data-status="Mới"><b>${r.byStatus['Mới']}</b> đơn mới chờ xác nhận</button>` : ''}
      ${r.unpaidBank.length ? `<button type="button" class="adm-alert" data-act="filter-orders" data-pay="bank" data-pay-status="Chưa thanh toán"><b>${r.unpaidBank.length}</b> đơn "Thanh toán ngay" chưa nhận tiền · ${money(r.unpaidBank.reduce((s, o) => s + o.total, 0))}</button>` : ''}
      ${r.codToCollect.length ? `<button type="button" class="adm-alert" data-act="filter-orders" data-pay="cod" data-pay-status="Chưa thanh toán"><b>${r.codToCollect.length}</b> đơn COD đang giao / đã giao chưa thu tiền · ${money(r.codToCollect.reduce((s, o) => s + o.total, 0))}</button>` : ''}
    </div>` : ''}

    <section class="adm-kpis">
      ${kpi('Doanh thu (đơn hoàn tất)', money(r.revenue), `+ ${money(r.pipeline)} đang xử lý`, 'primary')}
      ${kpi('Lợi nhuận', money(r.profit), `Biên lợi nhuận ${pct(r.profit, r.revenue)}${r.missingCost ? ' · thiếu giá vốn' : ''}`, r.profit >= 0 ? 'good' : 'bad')}
      ${kpi('Chi phí', money(r.cogs + r.opex), `Giá vốn ${shortMoney(r.cogs)} · Vận hành ${shortMoney(r.opex)}`)}
      ${kpi('Đã thu tiền', money(r.collected), 'Đơn có trạng thái "Đã thanh toán"')}
      ${kpi('Đơn hàng', r.valid.length, `Hủy / hoàn ${r.cancelled.length} (${pct(r.cancelled.length, totalOrders)})`)}
      ${kpi('Giá trị đơn TB', money(r.aov), 'Không tính đơn hủy')}
      ${kpi('Khách mua hàng', r.customers, `Mới ${r.newCust} · Quay lại ${r.returning}`)}
      ${kpi('Khách tiềm năng', r.leads.length, `Form liên hệ, báo giá sỉ, đăng ký`)}
    </section>

    ${renderFunnel(r.funnel)}

    <section class="adm-card">
      <div class="adm-card-head"><div><h2>Doanh thu theo ${r.byMonth ? 'tháng' : 'ngày'}</h2><p class="adm-muted">Giá trị hàng (tạm tính − giảm giá), không gồm phí vận chuyển, không tính đơn hủy</p></div></div>
      ${renderChart(r)}
    </section>

    <div class="adm-grid-2">
      <section class="adm-card">
        <div class="adm-card-head"><h2>Theo loại khách</h2></div>
        ${typeRows.length ? typeRows.map(([t, v]) => barRow(t, v.ordered, maxType, `${money(v.ordered)}<small>${v.orders} đơn · hoàn tất ${shortMoney(v.revenue)}</small>`, typeColors[t])).join('') : '<p class="adm-empty">Chưa có đơn.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Theo hình thức thanh toán</h2></div>
        <div class="adm-pay-split">
          ${[['bank', 'Thanh toán ngay (chuyển khoản)'], ['cod', 'Thanh toán khi nhận hàng (COD)']].map(([k, label]) => {
            const p = r.byPay[k];
            return `<div class="adm-pay-box"><span>${label}</span><strong>${money(p.amount)}</strong><small>${p.orders} đơn</small>
              <div class="adm-pay-progress"><span style="width:${p.amount ? (p.paid / p.amount) * 100 : 0}%"></span></div>
              <small>Đã thu ${money(p.paid)} · Chưa thu ${money(p.unpaid)}</small></div>`;
          }).join('')}
        </div>
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Sản phẩm bán chạy</h2></div>
        ${r.topProducts.length ? r.topProducts.map((p) => barRow(p.name, p.amount, maxProd, `${money(p.amount)}<small>${p.qty} sp</small>`)).join('') : '<p class="adm-empty">Chưa có dữ liệu.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Trạng thái đơn</h2></div>
        <div class="adm-status-grid">
          ${STATUS_FLOW.map((s) => `<button type="button" class="adm-status-box" data-act="filter-orders" data-status="${esc(s)}">${chip(s, STATUS_CLASS[s])}<strong>${r.byStatus[s]}</strong></button>`).join('')}
        </div>
        <div class="adm-card-head adm-mt"><h2>Tỉnh / thành mua nhiều</h2></div>
        ${r.topCities.length ? r.topCities.map(([c, v]) => barRow(c, v, maxCity, money(v))).join('') : '<p class="adm-empty">Chưa có dữ liệu.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Chi phí vận hành</h2><p class="adm-muted">Tổng ${money(r.opex)}</p></div><button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-goto="chi-phi">Nhập chi phí →</button></div>
        ${catRows.length ? catRows.map(([c, v]) => barRow(c, v, maxCat, money(v), '#e07a2f')).join('') : '<p class="adm-empty">Chưa nhập chi phí trong khoảng thời gian này.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Kết quả kinh doanh</h2></div>
        <table class="adm-pl">
          <tr><td>Doanh thu (đơn hoàn tất)</td><td>${money(r.revenue)}</td></tr>
          <tr><td>− Giá vốn hàng bán</td><td>${money(r.cogs)}</td></tr>
          <tr class="adm-pl-sub"><td>= Lợi nhuận gộp</td><td>${money(r.revenue - r.cogs)}</td></tr>
          <tr><td>− Chi phí vận hành</td><td>${money(r.opex)}</td></tr>
          <tr class="adm-pl-total"><td>= Lợi nhuận</td><td>${money(r.profit)}</td></tr>
        </table>
        ${r.missingCost ? '<p class="adm-fineprint adm-warn-text">Một số sản phẩm đã bán chưa có giá vốn nên lợi nhuận đang cao hơn thực tế. Nhập giá vốn ở mục "Chi phí & giá vốn".</p>' : ''}
      </section>
    </div>`;
}

/* ==========================================================================
   View: Đơn hàng
   ========================================================================== */
// Each order lives in exactly one place depending on its status:
//   processing → "Đơn hàng" · success → "Khách hàng" (Đơn thành công) · failed → "Hủy & hoàn hàng"
const ORDER_GROUPS = {
  processing: { statuses: ['Mới', 'Đã xác nhận', 'Đang giao'], view: 'don-hang', label: 'Đơn hàng' },
  success: { statuses: ['Hoàn tất'], view: 'khach-hang', label: 'Khách hàng' },
  failed: { statuses: FAILED_STATUSES, view: 'huy-hoan', label: 'Hủy & hoàn hàng' }
};

function groupOf(status) {
  return Object.keys(ORDER_GROUPS).find((g) => ORDER_GROUPS[g].statuses.includes(status)) || 'processing';
}

function filteredOrders(group, ignoreType) {
  const f = state.filters[group];
  const range = periodRange();
  const q = f.q.trim().toLowerCase();
  const statuses = ORDER_GROUPS[group].statuses;
  return state.data.orders.filter((o) => statuses.includes(o.status)
    && inRange(o._date, range)
    && (!f.status || o.status === f.status)
    && (ignoreType || !f.type || o.typeKey === f.type)
    && (!f.pay || o.pay === f.pay)
    && (!f.payStatus || o.payStatus === f.payStatus)
    && (!f.reason || o.failReason === f.reason)
    && (!q || [o.code, o.name, o.phone, o.email, o.org, o.city, o.products, o.failReason].some((v) => String(v || '').toLowerCase().includes(q))));
}

function select(name, value, options, placeholder, extra = '') {
  return `<select data-filter="${name}" ${extra}>${placeholder ? `<option value="">${placeholder}</option>` : ''}${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
}

function pager(total, page, scope) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return '';
  return `<div class="adm-pager"><button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="page" data-scope="${scope}" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹ Trước</button>
    <span>Trang ${page}/${pages}</span>
    <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="page" data-scope="${scope}" data-page="${page + 1}" ${page >= pages ? 'disabled' : ''}>Sau ›</button></div>`;
}

function typeTabs(scope, current, groups) {
  return `<div class="adm-tabs" role="tablist">${TYPE_TABS.map((t) => {
    const g = groups[t.key] || { count: 0 };
    return `<button type="button" role="tab" aria-selected="${current === t.key}" class="adm-tab ${current === t.key ? 'is-active' : ''}" data-act="type-tab" data-scope="${scope}" data-type="${t.key}">
      <span>${t.label}</span><b>${g.count}</b>${g.alert ? `<em title="${esc(g.alertTitle || '')}">${esc(g.alert)}</em>` : ''}</button>`;
  }).join('')}</div>`;
}

function summaryBox(label, value, cls) {
  return `<div><span>${label}</span><strong class="${cls || ''}">${value}</strong></div>`;
}

/* --- One order table, used by "Đơn hàng", "Khách hàng → Đơn thành công" and "Hủy & hoàn hàng" --- */
// Returning customers who sent a form on the website again (quote, contact…) and are still waiting
// for a call: listed with the orders being processed, under the tab of their customer type.
// They are open tasks, so they show whatever the period until someone changes their status.
function buyerRequests(ignoreType) {
  const f = state.filters.processing;
  // They count as new orders: shown with "Mọi trạng thái" or "Mới", not with payment filters
  if ((f.status && f.status !== 'Mới') || f.pay || f.payStatus) return [];
  const q = f.q.trim().toLowerCase();
  return state.data.leads.filter((l) => {
    if (!l.fromBuyer || l.status !== 'Mới') return false;
    const c = state.derived.customerByKey[l.key];
    l.buyerType = c ? c.type : 'Khách lẻ';
    l.buyerOrg = (c && c.org) || l.org || '';
    if (!ignoreType && f.type && typeKey(l.buyerType) !== f.type) return false;
    return !q || [l.name, l.phone, l.email, l.org, l.type, l.interest, l.note].some((v) => String(v || '').toLowerCase().includes(q));
  });
}

// Same columns and look as an order row; amount and payment are settled when staff call back
function requestRowHtml(l, orgTab) {
  return `
          <tr data-act="open-lead" data-id="${esc(l.id)}" tabindex="0">
            <td><b>${esc(l.id)}</b></td>
            <td>${fmtDateTime(l._date)}</td>
            <td><span class="adm-cell-main">${esc(l.name || l.phone)}</span><small>${esc(l.phone)}</small></td>
            <td>${orgTab ? `<span class="adm-cell-main">${esc(l.buyerOrg || '—')}</span>` : `${esc(l.buyerType)}${l.buyerOrg ? `<small>${esc(l.buyerOrg)}</small>` : ''}`}</td>
            <td class="num"><b>Chờ báo giá</b>${l.interest ? `<small>${esc(l.interest)}</small>` : ''}</td>
            <td>${esc(l.type)}</td>
            <td>${chip('Mới', STATUS_CLASS['Mới'])}</td>
          </tr>`;
}

function renderOrderList(group, opts = {}) {
  const f = state.filters[group];
  const list = filteredOrders(group);
  const sum = list.reduce((s, o) => s + o.total, 0);
  const unpaid = list.filter((o) => o.payStatus !== 'Đã thanh toán').reduce((s, o) => s + o.total, 0);
  const statuses = ORDER_GROUPS[group].statuses;
  const processing = group === 'processing';
  const reqs = processing ? buyerRequests() : [];
  const allReqs = processing ? buyerRequests(true) : [];
  // Orders and returning customers' requests in one list, newest first
  const merged = [...list.map((o) => ({ d: o._date, o })), ...reqs.map((l) => ({ d: l._date, l }))]
    .sort((a, b) => (b.d ? b.d.getTime() : 0) - (a.d ? a.d.getTime() : 0));
  const page = Math.min(f.page, Math.max(1, Math.ceil(merged.length / PAGE_SIZE)));
  const pageItems = merged.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rows = pageItems.filter((x) => x.o).map((x) => x.o);

  // Tab counts follow every other filter (period, status, search…) except the customer type itself
  const base = filteredOrders(group, true);
  const groups = {};
  TYPE_TABS.forEach((t) => {
    const inTab = base.filter((o) => !t.key || o.typeKey === t.key);
    const reqTab = allReqs.filter((l) => !t.key || typeKey(l.buyerType) === t.key);
    let alert = '';
    if (processing) { const n = inTab.filter((o) => o.status === 'Mới').length + reqTab.length; alert = n ? `${n} mới` : ''; }
    if (group === 'failed') { const n = inTab.filter((o) => o.status === 'Hoàn hàng').length; alert = n ? `${n} hoàn` : ''; }
    groups[t.key] = { count: inTab.length + reqTab.length, alert, alertTitle: processing ? 'Đơn mới chờ xác nhận và yêu cầu mới từ khách đã mua' : 'Đơn hoàn hàng' };
  });

  let summary;
  if (processing) {
    const waiting = list.filter((o) => o.status === 'Mới').length + reqs.length;
    summary = summaryBox('Đang xử lý', list.length + reqs.length)
      + summaryBox('Chờ xác nhận', waiting, waiting ? 'adm-warn-text' : '')
      + summaryBox('Tổng tiền', money(sum))
      + summaryBox('Chưa thu', money(unpaid), unpaid ? 'adm-warn-text' : '');
  } else if (group === 'success') {
    summary = summaryBox('Khách đã mua', new Set(list.map((o) => o.key || o.code)).size)
      + summaryBox('Lượt mua thành công', list.length)
      + summaryBox('Doanh thu', money(list.reduce((s, o) => s + o.net, 0)))
      + summaryBox('Chưa thu', money(unpaid), unpaid ? 'adm-warn-text' : '');
  } else {
    const range = periodRange();
    const allInPeriod = state.data.orders.filter((o) => inRange(o._date, range) && (!f.type || o.typeKey === f.type)).length;
    summary = summaryBox('Đã hủy', list.filter((o) => o.status === 'Đã hủy').length)
      + summaryBox('Hoàn hàng', list.filter((o) => o.status === 'Hoàn hàng').length, list.some((o) => o.status === 'Hoàn hàng') ? 'adm-warn-text' : '')
      + summaryBox('Giá trị đơn mất', money(list.reduce((s, o) => s + o.net, 0)))
      + summaryBox('Tỷ lệ hủy / hoàn', pct(list.length, allInPeriod));
  }

  // Wholesale / consultant tabs: show the shop or consultant code instead of the type column
  const orgTab = f.type === 'wholesale' || f.type === 'consultant';
  const orgHead = f.type === 'wholesale' ? 'Spa / Clinic / Đại lý' : f.type === 'consultant' ? 'Mã / tên tư vấn viên' : 'Loại khách';
  const orgCell = (o) => (orgTab
    ? `<span class="adm-cell-main">${esc(o.org || '—')}</span>`
    : `${esc(o.customerType)}${o.org ? `<small>${esc(o.org)}</small>` : ''}`);
  const tabLabel = TYPE_TABS.find((t) => t.key === f.type).label;
  const failed = group === 'failed';
  const reasons = state.data.options.failReasons || [];

  return `
    ${opts.before || ''}
    ${typeTabs(group, f.type, groups)}
    <section class="adm-card adm-card-tabbed">
      <div class="adm-tab-summary">${summary}</div>
      <div class="adm-toolbar" data-scope="${group}">
        <input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Tìm mã đơn, tên, SĐT, ${f.type === 'wholesale' ? 'tên spa, ' : f.type === 'consultant' ? 'mã TVV, ' : ''}${failed ? 'lý do, ' : ''}sản phẩm…" aria-label="Tìm đơn hàng">
        ${statuses.length > 1 ? select('status', f.status, statuses.map((s) => [s, s]), 'Mọi trạng thái') : ''}
        ${failed ? select('reason', f.reason, reasons.map((r) => [r, r]), 'Mọi lý do') : ''}
        ${select('pay', f.pay, [['bank', 'Thanh toán ngay'], ['cod', 'COD']], 'Mọi hình thức TT')}
        ${select('payStatus', f.payStatus, state.data.options.payStatuses.map((s) => [s, s]), 'Mọi trạng thái TT')}
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="export-orders" data-group="${group}">Xuất CSV</button>
      </div>
      <p class="adm-muted adm-result-meta">${tabLabel} · ${list.length + reqs.length} ${opts.purchase ? 'lần mua thành công' : 'đơn'}${opts.note ? ` · ${opts.note}` : ''}</p>
      ${rows.length && opts.purchase ? `
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Khách hàng</th><th>${orgHead}</th><th>Sản phẩm đã mua</th><th>Ngày mua</th><th class="num">Thành tiền</th><th>Thanh toán</th></tr></thead>
        <tbody>${rows.map((o) => `
          <tr data-act="open-order" data-code="${esc(o.code)}" tabindex="0">
            <td><span class="adm-cell-main">${esc(o.name)}</span><small>${esc(o.phone)}${o.city ? ` · ${esc(o.city)}` : ''}</small></td>
            <td>${orgCell(o)}</td>
            <td class="adm-products-cell">${o.items.length
              ? o.items.map((it) => `<span>${esc(it.name)} <b>×${it.qty}</b></span>`).join('')
              : `<span>${esc(o.products)}</span>`}</td>
            <td>${fmtDate(o._date)}<small>${esc(o.code)}</small></td>
            <td class="num"><b>${money(o.total)}</b></td>
            <td>${o.pay === 'bank' ? 'Thanh toán ngay' : 'COD'}<br>${chip(o.payStatus, PAY_CLASS[o.payStatus])}</td>
          </tr>`).join('')}</tbody>
      </table></div>${pager(list.length, page, group)}` : rows.length || reqs.length ? `
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Mã đơn</th><th>Thời gian</th><th>Khách hàng</th><th>${orgHead}</th><th class="num">Tổng tiền</th>${failed ? '<th>Lý do</th>' : '<th>Thanh toán</th>'}<th>Trạng thái</th></tr></thead>
        <tbody>${pageItems.map(({ o, l }) => (l ? requestRowHtml(l, orgTab) : `
          <tr data-act="open-order" data-code="${esc(o.code)}" tabindex="0">
            <td><b>${esc(o.code)}</b></td>
            <td>${fmtDateTime(o._date)}</td>
            <td><span class="adm-cell-main">${esc(o.name)}</span><small>${esc(o.phone)}${o.city ? ` · ${esc(o.city)}` : ''}</small></td>
            <td>${orgCell(o)}</td>
            <td class="num"><b>${money(o.total)}</b><small>${o.qty} sp</small></td>
            ${failed
              ? `<td>${esc(o.failReason || 'Chưa ghi lý do')}${o.payStatus !== 'Chưa thanh toán' ? `<br>${chip(o.payStatus, PAY_CLASS[o.payStatus])}` : ''}</td>`
              : `<td>${o.pay === 'bank' ? 'Thanh toán ngay' : 'COD'}<br>${chip(o.payStatus, PAY_CLASS[o.payStatus])}</td>`}
            <td>${chip(o.status, STATUS_CLASS[o.status])}</td>
          </tr>`)).join('')}</tbody>
      </table></div>${pager(merged.length, page, group)}` : `<p class="adm-empty">${opts.empty || 'Không có đơn nào phù hợp.'}</p>`}
    </section>
    ${opts.after || ''}`;
}

function renderOrders() {
  return renderOrderList('processing', {
    note: 'Đơn hoàn tất chuyển sang mục Khách hàng, đơn hủy / hoàn chuyển sang mục Hủy & hoàn hàng',
    empty: 'Không có đơn nào đang chờ xử lý.'
  });
}

/* ==========================================================================
   View: Hủy & hoàn hàng
   ========================================================================== */
function renderFailed() {
  const f = state.filters.failed;
  const list = filteredOrders('failed');
  const byReason = {};
  list.forEach((o) => { const r = o.failReason || 'Chưa ghi lý do'; byReason[r] = (byReason[r] || 0) + 1; });
  const reasonRows = Object.entries(byReason).sort((a, b) => b[1] - a[1]);
  const maxReason = Math.max(...reasonRows.map(([, n]) => n), 1);

  // Customers who refused / cancelled again and again (all time): call before shipping their next order
  const repeat = state.derived.customers
    .map((c) => ({ c, n: c.orders.filter((o) => o.status === 'Hoàn hàng').length, m: c.orders.filter((o) => FAILED_STATUSES.includes(o.status)).length }))
    .filter((x) => x.n >= 1 && x.m >= 2 && (!f.type || typeKey(x.c.type) === f.type))
    .sort((a, b) => b.m - a.m)
    .slice(0, 12);

  const after = `
    <div class="adm-grid-2">
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Lý do hủy / hoàn</h2><p class="adm-muted">${periodLabel()}</p></div></div>
        ${reasonRows.length ? reasonRows.map(([r, n]) => barRow(r, n, maxReason, `${n} đơn`, r === 'Khách không nhận hàng khi giao' ? '#e07a2f' : '#c62828')).join('') : '<p class="adm-empty">Không có đơn hủy hoặc hoàn trong khoảng thời gian này.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Khách cần lưu ý</h2><p class="adm-muted">Từng hoàn hàng và có từ 2 đơn hủy / hoàn trở lên (toàn bộ thời gian)</p></div></div>
        ${repeat.length ? `<ul class="adm-people adm-people-wide">${repeat.map(({ c, n, m }) => `<li><button type="button" class="adm-linkish" data-act="open-customer" data-key="${esc(c.key)}">${esc(c.name || c.phone)}</button><small>${esc(c.phone)} · ${m} đơn hủy / hoàn, ${n} lần hoàn hàng</small></li>`).join('')}</ul>` : '<p class="adm-empty">Chưa có khách nào hủy / hoàn nhiều lần.</p>'}
      </section>
    </div>`;
  return renderOrderList('failed', { empty: 'Không có đơn hủy hoặc hoàn hàng trong khoảng thời gian này.', after });
}

function orderDrawer(code) {
  const o = state.data.orders.find((x) => x.code === code);
  if (!o) return;
  const opts = state.data.options;
  const costKnown = o.items.length && o.items.every((it) => Number(state.data.costs[it.id]) > 0);
  const tel = String(o.phone || '').replace(/[^\d+]/g, '');
  const isFailed = FAILED_STATUSES.includes(o.status);
  const cust = o.key ? state.derived.customerByKey[o.key] : null;
  const pastFails = cust ? cust.orders.filter((x) => x.code !== o.code && FAILED_STATUSES.includes(x.status)).length : 0;
  const pastReturns = cust ? cust.orders.filter((x) => x.code !== o.code && x.status === 'Hoàn hàng').length : 0;
  const reasons = opts.failReasons || [];
  openDrawer(`
    <form class="adm-order-form" data-code="${esc(o.code)}">
      <p class="adm-muted">${fmtDateTime(o._date)} · đang ở mục <b>${ORDER_GROUPS[groupOf(o.status)].label}</b></p>
      <h2>Đơn ${esc(o.code)} ${chip(o.status, STATUS_CLASS[o.status])}</h2>

      ${isFailed
        ? `<p class="adm-note adm-note-bad">${o.status === 'Hoàn hàng' ? 'Đã giao đến nơi nhưng khách không nhận.' : 'Đơn đã hủy trước khi giao.'} Lý do: <b>${esc(o.failReason || 'chưa ghi')}</b></p>`
        : `<div class="adm-steps">${STATUS_FLOW.slice(0, 4).map((s, i) => `<span class="${STATUS_FLOW.indexOf(o.status) >= i ? 'is-done' : ''}">${s}</span>`).join('')}</div>`}
      ${pastFails ? `<p class="adm-note adm-note-warn">Khách này đã có ${pastFails} đơn hủy / hoàn trước đó${pastReturns ? ` (${pastReturns} lần không nhận hàng)` : ''}. Nên gọi xác nhận kỹ trước khi giao.</p>` : ''}

      <section class="adm-d-section">
        <h3>Khách hàng</h3>
        <p><b>${esc(o.name)}</b> · ${esc(o.customerType)}${o.org ? ` – ${esc(o.org)}` : ''}</p>
        <p><a href="tel:${esc(tel)}">${esc(o.phone)}</a> · <a href="https://zalo.me/${esc(tel)}" target="_blank" rel="noopener noreferrer">Zalo</a>${o.email ? ` · <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>` : ''}</p>
        <p>${esc([o.address, o.district, o.city].filter(Boolean).join(', '))}</p>
        ${o.account ? `<p class="adm-muted">Tài khoản: ${esc(o.account)}</p>` : ''}
        ${o.note ? `<p class="adm-note">Ghi chú của khách: ${esc(o.note)}</p>` : ''}
        ${(() => {
          // Lead recorded before this order with the same phone / e-mail = where the customer came from
          const src = state.data.leads.filter((l) => l.key && l.key === o.key && l._date && o._date && l._date <= o._date)
            .sort((a, b) => b._date - a._date)[0];
          return src ? `<p class="adm-note">Khách tiềm năng từ <b>${esc(src.type)}</b>${src.consultant ? ` · tư vấn: <b>${esc(src.consultant)}</b>` : ''}${src.closedAt ? ` · chốt ${fmtDate(src.closedAt)}` : ''} · <button type="button" class="adm-linkish" data-act="open-lead" data-id="${esc(src.id)}">xem</button></p>` : '';
        })()}
        ${o.key ? `<button type="button" class="adm-linkish" data-act="open-customer" data-key="${esc(o.key)}">Xem lịch sử mua hàng →</button>` : ''}
      </section>

      <section class="adm-d-section">
        <h3>Sản phẩm</h3>
        ${o.items.length ? `<table class="adm-mini-table">${o.items.map((it) => `<tr><td>${esc(it.name)}<small>${esc(it.unit)} · ${money(it.price)}</small></td><td>×${it.qty}</td><td class="num">${money(it.line)}</td></tr>`).join('')}</table>`
          : `<p class="adm-pre">${esc(o.products)}</p>`}
        <div class="adm-d-grid">
          <label class="adm-field"><span>Giảm giá (đ)</span><input type="number" name="discount" min="0" step="1000" value="${o.discount}"></label>
          <label class="adm-field"><span>Phí vận chuyển thu khách (đ)</span><input type="number" name="shipping" min="0" step="1000" value="${o.shipping}"></label>
        </div>
        <table class="adm-pl">
          <tr><td>Tạm tính</td><td>${money(o.subtotal)}</td></tr>
          <tr class="adm-pl-total"><td>Khách cần thanh toán</td><td data-total>${money(o.total)}</td></tr>
          ${costKnown ? `<tr><td class="adm-muted">Giá vốn ước tính · lãi gộp</td><td class="adm-muted">${money(o.cogs)} · ${money(o.net - o.cogs)}</td></tr>` : ''}
        </table>
        ${o.priceNote && o.priceNote !== 'OK' ? `<p class="adm-fineprint adm-warn-text">Kiểm tra giá: ${esc(o.priceNote)}</p>` : ''}
      </section>

      <section class="adm-d-section">
        <h3>Xử lý đơn</h3>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Trạng thái đơn</span><select name="status">${opts.statuses.map((s) => `<option ${s === o.status ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Thanh toán · ${o.pay === 'bank' ? 'Thanh toán ngay (CK)' : 'COD'}</span><select name="payStatus">${opts.payStatuses.map((s) => `<option ${s === o.payStatus ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Loại khách</span><select name="customerType">${Object.entries(opts.customerTypes).map(([k, l]) => `<option value="${k}" ${k === o.typeKey ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>
          <label class="adm-field adm-fail-field" ${isFailed ? '' : 'hidden'}><span>Lý do hủy / hoàn *</span><select name="failReason"><option value="">— Chọn lý do —</option>${reasons.map((r) => `<option ${r === o.failReason ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select></label>
        </div>
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="3" placeholder="Đã gọi xác nhận, mã vận đơn, hẹn giao, phí ship hoàn…">${esc(o.internalNote)}</textarea></label>
        <p class="adm-error" data-order-error hidden></p>
      </section>

      <div class="adm-d-actions">
        ${o.status === 'Mới' ? '<button type="button" class="adm-btn adm-btn-ghost" data-act="quick-status" data-status="Đã xác nhận">Xác nhận đơn</button>' : ''}
        ${o.status === 'Đã xác nhận' ? '<button type="button" class="adm-btn adm-btn-ghost" data-act="quick-status" data-status="Đang giao">Chuyển sang đang giao</button>' : ''}
        ${o.status === 'Đang giao' ? '<button type="button" class="adm-btn adm-btn-ghost" data-act="quick-status" data-status="Hoàn tất">Đã giao xong</button>' : ''}
        ${o.status === 'Mới' || o.status === 'Đã xác nhận' ? '<button type="button" class="adm-btn adm-btn-danger" data-act="mark-failed" data-status="Đã hủy">Hủy đơn</button>' : ''}
        ${o.status === 'Đang giao' ? '<button type="button" class="adm-btn adm-btn-danger" data-act="mark-failed" data-status="Hoàn hàng" data-reason="Khách không nhận hàng khi giao">Khách không nhận (hoàn hàng)</button>' : ''}
        <button type="submit" class="adm-btn adm-btn-primary">Lưu thay đổi</button>
      </div>
      ${o.updatedAt ? `<p class="adm-fineprint">Cập nhật lần cuối ${fmtDateTime(o.updatedAt)}</p>` : ''}
    </form>`);
}

// "Hủy đơn" / "Khách không nhận": switch the form to that status and ask for the reason before saving
function markFailed(form, status, reason) {
  form.querySelector('[name="status"]').value = status;
  const field = form.querySelector('.adm-fail-field');
  field.hidden = false;
  const sel = form.querySelector('[name="failReason"]');
  if (reason && !sel.value) sel.value = reason;
  const err = form.querySelector('[data-order-error]');
  err.textContent = sel.value ? 'Kiểm tra lý do rồi bấm "Lưu thay đổi".' : 'Chọn lý do rồi bấm "Lưu thay đổi".';
  err.hidden = false;
  sel.focus();
}

async function saveOrder(form, overrides = {}) {
  const code = form.dataset.code;
  const o = state.data.orders.find((x) => x.code === code);
  const fd = new FormData(form);
  const fields = {
    status: fd.get('status'),
    payStatus: fd.get('payStatus'),
    customerType: fd.get('customerType'),
    shipping: Math.max(0, Math.round(Number(fd.get('shipping')) || 0)),
    discount: Math.max(0, Math.round(Number(fd.get('discount')) || 0)),
    internalNote: String(fd.get('internalNote') || ''),
    failReason: String(fd.get('failReason') || ''),
    ...overrides
  };
  const err = form.querySelector('[data-order-error]');
  if (FAILED_STATUSES.includes(fields.status) && !fields.failReason) {
    form.querySelector('.adm-fail-field').hidden = false;
    err.textContent = `Chọn lý do trước khi chuyển đơn sang "${fields.status}".`;
    err.hidden = false;
    form.querySelector('[name="failReason"]').focus();
    return;
  }
  if (!FAILED_STATUSES.includes(fields.status)) fields.failReason = '';
  // COD delivered = money collected, unless the admin chose otherwise in the form
  if (overrides.status === 'Hoàn tất' && o.pay === 'cod' && fields.payStatus === 'Chưa thanh toán') fields.payStatus = 'Đã thanh toán';
  const before = groupOf(o.status);
  const btns = form.querySelectorAll('button');
  btns.forEach((b) => { b.disabled = true; });
  try {
    await api('admin.updateOrder', { code, fields });
    Object.assign(o, {
      status: fields.status, payStatus: fields.payStatus, shipping: fields.shipping, discount: fields.discount,
      internalNote: fields.internalNote, failReason: fields.failReason,
      customerType: state.data.options.customerTypes[fields.customerType] || o.customerType,
      updatedAt: new Date().toISOString()
    });
    derive();
    render();
    orderDrawer(code);
    const after = groupOf(fields.status);
    toast(after !== before ? `Đã lưu · đơn ${code} chuyển sang mục ${ORDER_GROUPS[after].label}` : `Đã lưu đơn ${code}`);
  } catch (e) {
    btns.forEach((b) => { b.disabled = false; });
    if (!e.auth) toast(e.message, true);
  }
}

function exportOrders(group) {
  const list = filteredOrders(group);
  const head = ['Mã đơn', 'Thời gian', 'Trạng thái', 'Lý do hủy / hoàn', 'Họ tên', 'Điện thoại', 'Email', 'Loại khách', 'Cơ sở / Mã TVV', 'Tỉnh/TP', 'Địa chỉ', 'Hình thức TT', 'Trạng thái TT', 'Tạm tính', 'Giảm giá', 'Phí vận chuyển', 'Tổng thanh toán', 'Sản phẩm', 'Ghi chú nội bộ'];
  const rows = list.map((o) => [o.code, fmtDateTime(o._date), o.status, o.failReason, o.name, o.phone, o.email, o.customerType, o.org, o.city,
    [o.address, o.district].filter(Boolean).join(', '), o.pay === 'bank' ? 'Thanh toán ngay' : 'COD', o.payStatus,
    o.subtotal, o.discount, o.shipping, o.total, o.products, o.internalNote]);
  const csv = [head, ...rows].map((r) => r.map((v) => {
    let s = String(v == null ? '' : v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  }).join(',')).join('\r\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `bevibe-${{ processing: 'don-dang-xu-ly', success: 'don-thanh-cong', failed: 'don-huy-hoan' }[group]}-${ymd(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ==========================================================================
   View: Khách hàng — customers with at least one successful order + their successful orders
   ========================================================================== */
const LOYAL_MIN_ORDERS = 2; // "Khách hàng trung thành" = at least this many successful orders

function renderCustomers() {
  const f = state.filters.customers;
  const loyalMode = f.mode === 'loyal';
  const modeTabs = `<div class="adm-mode-switch" role="tablist">
      <button type="button" role="tab" class="${!loyalMode ? 'is-active' : ''}" aria-selected="${!loyalMode}" data-act="customer-mode" data-mode="list">Danh sách khách hàng</button>
      <button type="button" role="tab" class="${loyalMode ? 'is-active' : ''}" aria-selected="${loyalMode}" data-act="customer-mode" data-mode="loyal">Khách hàng trung thành</button>
    </div>`;

  // 1) Every successful purchase: customer A bought this, customer A bought that…
  if (!loyalMode) {
    return renderOrderList('success', {
      before: modeTabs,
      purchase: true,
      note: `khách mua từ ${LOYAL_MIN_ORDERS} lần trở lên được tổng hợp ở "Khách hàng trung thành"`,
      empty: 'Chưa có khách mua thành công trong khoảng thời gian này.'
    });
  }

  // 2) Loyal customers: one row per person who bought successfully again and again (all time),
  //    shown when they bought in the chosen period
  const range = periodRange();
  const q = f.q.trim().toLowerCase();
  const all = state.derived.customers.filter((c) => c.doneCount >= LOYAL_MIN_ORDERS
    && c.orders.some((o) => o.status === 'Hoàn tất' && inRange(o._date, range)));
  const groups = {};
  TYPE_TABS.forEach((t) => { groups[t.key] = { count: all.filter((c) => !t.key || typeKey(c.type) === t.key).length }; });
  const inTab = all.filter((c) => !f.type || typeKey(c.type) === f.type);
  const list = inTab.filter((c) => !q || [c.name, c.phone, c.email, c.org, c.city].some((v) => String(v || '').toLowerCase().includes(q)))
    .sort((a, b) => b.doneCount - a.doneCount || b.revenue - a.revenue);
  const page = Math.min(f.page, Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const buyersInTab = state.derived.customers.filter((c) => c.doneCount > 0
    && c.orders.some((o) => o.status === 'Hoàn tất' && inRange(o._date, range))
    && (!f.type || typeKey(c.type) === f.type)).length;
  const topProducts = (c) => {
    const m = {};
    c.orders.filter((o) => o.status === 'Hoàn tất').forEach((o) => o.items.forEach((it) => { m[it.name] = (m[it.name] || 0) + it.qty; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 3);
  };

  return `
    ${modeTabs}
    ${typeTabs('customers', f.type, groups)}
    <section class="adm-card adm-card-tabbed">
      <div class="adm-tab-summary">
        ${summaryBox('Khách trung thành', inTab.length)}
        ${summaryBox('Trên tổng khách đã mua', pct(inTab.length, buyersInTab))}
        ${summaryBox('Tổng chi tiêu', money(inTab.reduce((s, c) => s + c.revenue, 0)))}
        ${summaryBox('Số lần mua trung bình', inTab.length ? (inTab.reduce((s, c) => s + c.doneCount, 0) / inTab.length).toFixed(1).replace('.', ',') : '0')}
      </div>
      <div class="adm-toolbar" data-scope="customers">
        <input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Tìm tên, SĐT, email, cơ sở…" aria-label="Tìm khách hàng trung thành">
      </div>
      <p class="adm-muted adm-result-meta">${list.length} khách đã mua thành công từ ${LOYAL_MIN_ORDERS} lần trở lên (có mua trong kỳ đang xem) · xếp theo số lần mua</p>
      ${rows.length ? `
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Khách hàng</th><th>Loại khách</th><th class="num">Số lần mua</th><th class="num">Tổng chi tiêu</th><th>Sản phẩm hay mua</th><th>Lần đầu · gần nhất</th></tr></thead>
        <tbody>${rows.map((c) => {
          const done = c.orders.filter((o) => o.status === 'Hoàn tất');
          return `
          <tr data-act="open-customer" data-key="${esc(c.key)}" tabindex="0">
            <td><span class="adm-cell-main">${esc(c.name || '(chưa có tên)')}</span><small>${esc(c.phone)}${c.email ? ` · ${esc(c.email)}` : ''}</small></td>
            <td>${esc(c.type)}${c.org ? `<small>${esc(c.org)}</small>` : ''}</td>
            <td class="num"><b>${c.doneCount}</b><small>lần</small></td>
            <td class="num"><b>${money(c.revenue)}</b></td>
            <td class="adm-products-cell">${topProducts(c).map(([n, qty]) => `<span>${esc(n)} <b>×${qty}</b></span>`).join('')}</td>
            <td>${fmtDate(done[done.length - 1]._date)}<small>gần nhất ${fmtDate(done[0]._date)}</small></td>
          </tr>`;
        }).join('')}</tbody>
      </table></div>${pager(list.length, page, 'customers')}` : `<p class="adm-empty">Chưa có khách nào mua thành công từ ${LOYAL_MIN_ORDERS} lần trở lên trong khoảng thời gian này.</p>`}
    </section>`;
}

function customerDrawer(key) {
  const c = state.derived.customerByKey[key];
  if (!c) return;
  const tel = String(c.phone || '').replace(/[^\d+]/g, '');
  openDrawer(`
    <h2>${esc(c.name || '(chưa có tên)')}</h2>
    <p>${esc(c.type)}${c.org ? ` – ${esc(c.org)}` : ''}</p>
    <p>${c.phone ? `<a href="tel:${esc(tel)}">${esc(c.phone)}</a> · <a href="https://zalo.me/${esc(tel)}" target="_blank" rel="noopener noreferrer">Zalo</a>` : ''}${c.email ? ` · <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}</p>
    <div class="adm-kpis adm-kpis-3 adm-kpis-compact">
      ${kpi('Đơn hợp lệ', c.validCount)}
      ${kpi('Doanh thu', money(c.revenue))}
      ${kpi('Mua lần đầu', c.firstOrder ? fmtDate(c.firstOrder) : '—')}
    </div>
    <section class="adm-d-section">
      <h3>Đơn hàng (${c.orders.length})</h3>
      ${c.orders.length ? `<table class="adm-mini-table">${c.orders.map((o) => `<tr class="adm-click" data-act="open-order" data-code="${esc(o.code)}"><td><b>${esc(o.code)}</b><small>${fmtDateTime(o._date)}</small></td><td>${chip(o.status, STATUS_CLASS[o.status])}</td><td class="num">${money(o.total)}</td></tr>`).join('')}</table>` : '<p class="adm-muted">Chưa có đơn hàng.</p>'}
    </section>
    <section class="adm-d-section">
      <h3>Liên hệ / yêu cầu (${c.leads.length})</h3>
      ${c.leads.length ? c.leads.map((l) => `<div class="adm-lead-mini adm-click" data-act="open-lead" data-id="${esc(l.id)}"><b>${esc(l.type)}</b> ${chip(l.status, LEAD_CLASS[l.status])}<small>${fmtDateTime(l._date)}${l.interest ? ` · ${esc(l.interest)}` : ''}</small></div>`).join('') : '<p class="adm-muted">Không có.</p>'}
    </section>`);
}

/* ==========================================================================
   View: Khách tiềm năng
   ========================================================================== */
const DEFAULT_LEAD_SOURCES = ['Gọi điện', 'Zalo', 'Facebook / Instagram', 'TikTok', 'Khách giới thiệu', 'Hội chợ / sự kiện', 'Khách đến trực tiếp', 'Tư vấn viên giới thiệu', 'Khác'];

function isManualLead(l) {
  return String(l.type || '').indexOf('Nhập tay') === 0;
}

/* --- Staff types a lead in by hand (call, Zalo, Facebook, referral, event…) --- */
function addLeadDrawer() {
  const sources = state.data.options.leadSources || DEFAULT_LEAD_SOURCES;
  const statuses = state.data.options.leadStatuses;
  openDrawer(`
    <form class="adm-lead-add-form" autocomplete="off">
      <h2>Thêm khách tiềm năng</h2>
      <p class="adm-muted">Khách liên hệ qua điện thoại, Zalo, Facebook, được giới thiệu, gặp ở sự kiện…</p>
      <section class="adm-d-section">
        <div class="adm-d-grid">
          <label class="adm-field"><span>Họ tên *</span><input name="name" maxlength="80" required></label>
          <label class="adm-field"><span>Số điện thoại</span><input name="phone" inputmode="tel" maxlength="20" placeholder="VD: 0912 345 678"></label>
          <label class="adm-field"><span>Email</span><input name="email" type="email" maxlength="120"></label>
          <label class="adm-field"><span>Spa / Clinic / Công ty</span><input name="org" maxlength="160"></label>
          <label class="adm-field"><span>Nguồn khách</span><select name="source">${sources.map((s) => `<option>${esc(s)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Trạng thái</span><select name="status">${statuses.map((s, i) => `<option ${i === 0 ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
        </div>
        <label class="adm-field"><span>Quan tâm</span><input name="interest" maxlength="300" placeholder="VD: Báo giá sỉ Dr.BARGO, nhập hàng cho spa, gia công OEM…"></label>
        <label class="adm-field"><span>Nội dung khách hỏi</span><textarea name="note" rows="3" maxlength="2000"></textarea></label>
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="2" maxlength="1000" placeholder="Hẹn gọi lại, đã gửi báo giá…"></textarea></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Người tư vấn</span><input name="consultant" maxlength="80" placeholder="Tên tư vấn viên phụ trách" value="${esc(storeGet(localStorage, 'bevibe_admin_consultant', ''))}"></label>
          <label class="adm-field adm-check"><input type="checkbox" name="converted"><span>Đã chốt, chờ khách đặt đơn trên web</span></label>
        </div>
        <p class="adm-note adm-note-warn" data-dup hidden></p>
        <p class="adm-error" data-lead-error hidden></p>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu khách tiềm năng</button></div>
    </form>`);
  setTimeout(() => { const i = $('.adm-lead-add-form [name="name"]'); if (i) i.focus(); }, 50);
}

// Same phone / email already in the system → say who it is before saving a second copy
function findExisting(phone, email) {
  const key = contactKey(phone, email);
  return key ? state.derived.customerByKey[key] : null;
}

async function addLead(form) {
  const fd = new FormData(form);
  const lead = Object.fromEntries(['name', 'phone', 'email', 'org', 'source', 'status', 'interest', 'note', 'internalNote', 'consultant'].map((k) => [k, String(fd.get(k) || '').trim()]));
  if (fd.get('converted') === 'on') lead.status = LEAD_WAITING;
  // Remember the consultant's name on this computer for the next lead
  storeSet(localStorage, 'bevibe_admin_consultant', lead.consultant || null);
  const err = form.querySelector('[data-lead-error]');
  const fail = (m) => { err.textContent = m; err.hidden = false; };
  err.hidden = true;
  // 0912… / +84912… / 84912… → 0912… so the same person matches orders and other leads
  const raw = lead.phone.replace(/[\s.\-()]/g, '');
  const digits = /^\+?84\d{9,10}$/.test(raw) ? `0${raw.replace(/^\+?84/, '')}` : raw;
  if (!lead.name) return fail('Vui lòng nhập họ tên khách.');
  if (!digits && !lead.email) return fail('Vui lòng nhập số điện thoại hoặc email.');
  if (digits && !/^(\+?84|0)\d{9,10}$/.test(digits)) return fail('Số điện thoại chưa đúng định dạng.');
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return fail('Email chưa đúng định dạng.');

  const dupBox = form.querySelector('[data-dup]');
  const existing = findExisting(digits, lead.email);
  if (existing && dupBox.hidden) {
    const done = existing.orders.filter((o) => o.status === 'Hoàn tất').length;
    dupBox.innerHTML = `Số / email này đã có trong hệ thống: <b>${esc(existing.name || existing.phone || existing.email)}</b>
      (${existing.orders.length} đơn${done ? `, ${done} đơn hoàn tất` : ''}, ${existing.leads.length} lần liên hệ).
      <button type="button" class="adm-linkish" data-act="open-customer" data-key="${esc(existing.key)}">Xem hồ sơ</button> · bấm <b>Lưu</b> lần nữa để vẫn thêm lần liên hệ mới.`;
    dupBox.hidden = false;
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const res = await api('admin.addLead', { lead: { ...lead, phone: digits } });
    state.data.leads.push({
      time: res.time || new Date().toISOString(), id: res.id, status: lead.status, type: res.type || `Nhập tay – ${lead.source}`,
      name: lead.name, phone: res.phone || digits, email: lead.email, org: lead.org, interest: lead.interest, note: lead.note, internalNote: lead.internalNote,
      consultant: lead.consultant, closedAt: lead.status === LEAD_WAITING ? new Date().toISOString() : ''
    });
    derive();
    state.filters.leads.page = 1;
    // Same phone / e-mail as an order → this person is a buyer: the request shows in "Đơn hàng"
    const added = state.data.leads.find((x) => x.id === res.id);
    const isBuyer = added && added.converted;
    // Make sure the new lead is visible: it was created today
    if (!isBuyer && !inRange(new Date(), periodRange())) { state.period.key = '30d'; $('#admPeriod').value = '30d'; }
    closeDrawer();
    render();
    toast(isBuyer
      ? `${lead.name} đã từng đặt đơn: yêu cầu được đưa vào mục Đơn hàng`
      : `Đã thêm khách tiềm năng ${lead.name}`);
  } catch (e) {
    btn.disabled = false;
    if (!e.auth) fail(e.message);
  }
}

function renderLeads() {
  const f = state.filters.leads;
  const range = periodRange();
  const q = f.q.trim().toLowerCase();
  // Only people who have not ordered yet: once they order on the website (same phone / e-mail)
  // they leave this list and are handled in "Đơn hàng"
  const list = state.data.leads.filter((l) => inRange(l._date, range) && !l.converted
    && (!f.status || l.status === f.status)
    && (!f.source || (f.source === 'manual') === isManualLead(l))
    && (!q || [l.name, l.phone, l.email, l.org, l.type, l.interest, l.note].some((v) => String(v || '').toLowerCase().includes(q))));
  const page = Math.min(f.page, Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
  const rows = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const statuses = state.data.options.leadStatuses;

  return `
    <p class="adm-muted adm-mode-hint adm-mode-hint-top">Người chưa đặt đơn. Tư vấn chốt được (Zalo, điện thoại…) thì tích <b>Chuyển đổi</b> và hướng dẫn khách đặt trên website. Khi khách đặt đơn với cùng số điện thoại / email, khách tự rời khỏi đây và đơn vào mục Đơn hàng.</p>
    ${(() => {
      const waiting = state.data.leads.filter((l) => !l.converted && l.status === LEAD_WAITING);
      return waiting.length ? `<div class="adm-alerts"><button type="button" class="adm-alert" data-act="filter-leads-waiting"><b>${waiting.length}</b> khách đã chốt, đang chờ đặt đơn trên web</button></div>` : '';
    })()}
    <section class="adm-card">
      <div class="adm-toolbar" data-scope="leads">
        <input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Tìm tên, SĐT, công ty, nội dung…" aria-label="Tìm khách tiềm năng">
        ${select('status', f.status, statuses.map((s) => [s, s]), 'Mọi trạng thái')}
        ${select('source', f.source, [['web', 'Từ website'], ['manual', 'Nhập tay']], 'Mọi nguồn')}
        <button type="button" class="adm-btn adm-btn-primary adm-btn-sm" data-act="add-lead">+ Thêm khách tiềm năng</button>
      </div>
      <p class="adm-muted adm-result-meta">${list.length} yêu cầu ·${statuses.map((s) => `${s}: ${list.filter((l) => l.status === s).length}`).join(' · ')}</p>
      ${rows.length ? `
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Thời gian</th><th>Loại yêu cầu</th><th>Khách</th><th>Cơ sở / quan tâm</th><th>Người tư vấn</th><th>Chuyển đổi</th><th>Trạng thái</th></tr></thead>
        <tbody>${rows.map((l) => `
          <tr data-act="open-lead" data-id="${esc(l.id)}" tabindex="0">
            <td>${fmtDateTime(l._date)}</td>
            <td>${esc(l.type)}${l.fromBuyer ? '<small>Khách cũ gửi yêu cầu mới</small>' : ''}</td>
            <td><span class="adm-cell-main">${esc(l.name)}</span><small>${esc(l.phone)}${l.email ? ` · ${esc(l.email)}` : ''}</small></td>
            <td>${esc(l.org)}<small>${esc(l.interest)}</small></td>
            <td>${esc(l.consultant || '—')}</td>
            <td><label class="adm-convert" title="Đã chốt trên Zalo / điện thoại, chờ khách đặt đơn trên web"><input type="checkbox" data-act="lead-convert" data-id="${esc(l.id)}" ${l.status === LEAD_WAITING ? 'checked' : ''}><span>${l.status === LEAD_WAITING ? `Chờ đặt đơn${l.closedAt ? `<small>chốt ${fmtDate(l.closedAt)}</small>` : ''}` : 'Chuyển đổi'}</span></label></td>
            <td><select class="adm-inline-select adm-chip-${LEAD_CLASS[l.status] || 'muted'}" data-act="lead-status" data-id="${esc(l.id)}" aria-label="Trạng thái">${statuses.map((s) => `<option ${s === l.status ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></td>
          </tr>`).join('')}</tbody>
      </table></div>${pager(list.length, page, 'leads')}` : '<p class="adm-empty">Chưa có khách tiềm năng trong khoảng thời gian này.</p>'}
    </section>`;
}

function leadDrawer(id) {
  const l = state.data.leads.find((x) => x.id === id);
  if (!l) return;
  const tel = String(l.phone || '').replace(/[^\d+]/g, '');
  openDrawer(`
    <form class="adm-lead-form" data-id="${esc(l.id)}">
      <p class="adm-muted">${fmtDateTime(l._date)} · ${esc(l.id)}</p>
      <h2>${esc(l.name || '(chưa có tên)')}</h2>
      <p>${esc(l.type)}</p>
      <section class="adm-d-section">
        <p>${l.phone ? `<a href="tel:${esc(tel)}">${esc(l.phone)}</a> · <a href="https://zalo.me/${esc(tel)}" target="_blank" rel="noopener noreferrer">Zalo</a>` : ''}${l.email ? ` · <a href="mailto:${esc(l.email)}">${esc(l.email)}</a>` : ''}</p>
        ${l.org ? `<p><b>Cơ sở / công ty:</b> ${esc(l.org)}</p>` : ''}
        ${l.interest ? `<p><b>Quan tâm:</b> ${esc(l.interest)}</p>` : ''}
        ${l.note ? `<p class="adm-pre">${esc(l.note)}</p>` : ''}
      </section>
      ${l.converted ? `
      <section class="adm-d-section">
        <h3>${l.fromBuyer ? 'Khách cũ gửi yêu cầu mới' : 'Đã chuyển thành khách đặt đơn'}</h3>
        <p class="adm-muted">Cùng số điện thoại / email với ${l.orders.length} đơn trên website. Đơn được xử lý ở mục Đơn hàng.</p>
        <table class="adm-mini-table">${l.orders.slice(0, 5).map((o) => `<tr class="adm-click" data-act="open-order" data-code="${esc(o.code)}"><td><b>${esc(o.code)}</b><small>${fmtDateTime(o._date)}</small></td><td>${chip(o.status, STATUS_CLASS[o.status])}</td><td class="num">${money(o.total)}</td></tr>`).join('')}</table>
        <button type="button" class="adm-linkish" data-act="open-customer" data-key="${esc(l.key)}">Xem hồ sơ khách →</button>
      </section>` : ''}
      <section class="adm-d-section">
        <div class="adm-d-grid">
          <label class="adm-field"><span>Trạng thái</span><select name="status">${state.data.options.leadStatuses.map((s) => `<option ${s === l.status ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Người tư vấn</span><input name="consultant" maxlength="80" value="${esc(l.consultant || '')}"></label>
        </div>
        ${l.status === LEAD_WAITING ? `<p class="adm-note adm-note-warn">Đã chốt${l.closedAt ? ` ngày ${fmtDate(l.closedAt)}` : ''}, đang chờ khách đặt đơn trên website. Nhắc khách dùng đúng số ${esc(l.phone || l.email)} khi đặt để hệ thống nhận ra.</p>` : ''}
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="4" placeholder="Nội dung đã tư vấn, hẹn gọi lại…">${esc(l.internalNote)}</textarea></label>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu</button></div>
    </form>`);
}

async function saveLead(id, fields, form) {
  const l = state.data.leads.find((x) => x.id === id);
  const before = { status: l.status, internalNote: l.internalNote, consultant: l.consultant, closedAt: l.closedAt };
  Object.assign(l, fields);
  if (fields.status === LEAD_WAITING && before.status !== LEAD_WAITING) l.closedAt = new Date().toISOString();
  else if (fields.status && fields.status !== LEAD_WAITING && fields.status !== 'Đã mua') l.closedAt = '';
  derive();
  try {
    await api('admin.updateLead', { id, fields });
    toast('Đã lưu khách tiềm năng');
    render();
    if (form) leadDrawer(id);
  } catch (err) {
    Object.assign(l, before);
    derive();
    render();
    if (!err.auth) toast(err.message, true);
  }
}

/* ==========================================================================
   View: Chi phí & giá vốn
   ========================================================================== */
/* ==========================================================================
   Products & brands added from admin (used by the "Chi phí & giá vốn" screen)
   ========================================================================== */

// Every brand: built into the website code, then the ones added from admin
function allBrands() {
  const custom = state.data.customBrands || [];
  return [
    ...brandsData.map((b) => ({ id: b.id, name: b.name, builtin: true, visible: true, lines: b.lines || [], image: b.coverImage })),
    ...custom.filter((c) => !brandsData.some((b) => b.id === c.id)).map((c) => ({ ...c, builtin: false, lines: [] }))
  ];
}

function brandName(id) {
  const b = allBrands().find((x) => x.id === id);
  return b ? b.name : id;
}

/* --- Photo upload: resize in the browser, then store on Google Drive through the order system --- */
function resizeImage(file, maxSide = 1400) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { reject(new Error('Chỉ nhận ảnh JPG, PNG hoặc WEBP.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ảnh bị lỗi, hãy thử ảnh khác.'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function imagesHtml(images) {
  return images.length
    ? images.map((u, i) => `<figure class="adm-img-item ${i === 0 ? 'is-main' : ''}">
        <img src="${esc(u)}" alt="">
        ${i === 0 ? '<span class="adm-img-main">Ảnh chính</span>' : `<button type="button" class="adm-img-btn" data-act="img-main" data-i="${i}" title="Đặt làm ảnh chính">★</button>`}
        <button type="button" class="adm-img-btn adm-img-del" data-act="img-del" data-i="${i}" aria-label="Xóa ảnh" title="Xóa ảnh">×</button>
      </figure>`).join('')
    : '<p class="adm-muted">Chưa có ảnh. Ảnh đầu tiên là ảnh chính hiện trên thẻ sản phẩm.</p>';
}

let drawerImages = [];

function renderDrawerImages() {
  const box = $('#admDrawerBody [data-images]');
  if (box) box.innerHTML = imagesHtml(drawerImages);
}

async function uploadFiles(files, statusEl) {
  for (const file of files) {
    statusEl.textContent = `Đang tải ảnh ${file.name}…`;
    statusEl.hidden = false;
    try {
      const dataUrl = await resizeImage(file);
      const res = await api('admin.uploadImage', { name: file.name.replace(/\.[^.]+$/, ''), dataUrl });
      drawerImages.push(res.url);
      renderDrawerImages();
    } catch (e) {
      if (!e.auth) toast(e.message, true);
    }
  }
  statusEl.hidden = true;
}

function imageField(label) {
  return `
    <div class="adm-field">
      <span>${label}</span>
      <div class="adm-img-grid" data-images>${imagesHtml(drawerImages)}</div>
      <div class="adm-img-add">
        <label class="adm-btn adm-btn-ghost adm-btn-sm adm-file-btn">Tải ảnh lên<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-upload hidden></label>
        <input type="url" data-img-url placeholder="hoặc dán link ảnh (https://…)">
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="img-add-url">Thêm link</button>
      </div>
      <small data-upload-status hidden></small>
    </div>`;
}

function productDrawer(id, presetBrand) {
  const p = id ? (state.data.customProducts || []).find((x) => x.id === id) : null;
  const pr = id ? ((state.pricing || []).find((x) => x.id === id) || {}) : {};
  drawerImages = p ? [p.image, ...(p.gallery || [])].filter(Boolean) : [];
  const brands = allBrands();
  const brandId = (p && p.brandId) || presetBrand || brands[0].id;
  const lines = (brandsData.find((b) => b.id === brandId) || {}).lines || [];
  openDrawer(`
    <form class="adm-product-form" data-id="${esc(id || '')}" autocomplete="off">
      <h2>${p ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
      <p class="adm-muted">${p ? esc(p.id) : 'Sản phẩm sẽ hiện trên website (danh mục, tìm kiếm, trang chi tiết) sau khi lưu.'}</p>
      <section class="adm-d-section">
        <h3>Thông tin chính</h3>
        <label class="adm-field"><span>Tên sản phẩm *</span><input name="name" maxlength="160" required value="${esc(p ? p.name : '')}" placeholder="VD: Dr.BARGO Cleansing Oil"></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Thương hiệu *</span><select name="brandId" data-brand-select>${brands.map((b) => `<option value="${esc(b.id)}" ${b.id === brandId ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Dòng sản phẩm</span><select name="line" data-line-select><option value="">— Không thuộc dòng nào —</option>${lines.map((l) => `<option value="${esc(l.id)}" ${p && p.line === l.id ? 'selected' : ''}>${esc(l.nameVi)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Danh mục</span><select name="category">${CATEGORY_DEFS.map((c) => `<option value="${c.id}" ${(p ? p.category : 'moisturizer') === c.id ? 'selected' : ''}>${esc(c.vi)}</option>`).join('')}</select></label>
          <label class="adm-field"><span>Quy cách</span><input name="spec" maxlength="80" value="${esc(p ? p.spec : '')}" placeholder="VD: Chai 150ml"></label>
        </div>
        <label class="adm-field"><span>Mô tả ngắn (hiện trên thẻ sản phẩm)</span><input name="tag" maxlength="200" value="${esc(p ? p.tag : '')}" placeholder="VD: Dầu tẩy trang dịu nhẹ cho da nhạy cảm"></label>
        <label class="adm-field"><span>Tên tiếng Hàn (không bắt buộc)</span><input name="nameKo" maxlength="160" value="${esc(p ? p.nameKo : '')}"></label>
      </section>
      <section class="adm-d-section">
        <h3>Ảnh sản phẩm *</h3>
        ${imageField('Ảnh (tối đa 9)')}
      </section>
      <section class="adm-d-section">
        <h3>Giá &amp; tình trạng</h3>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Giá bán (đ)</span><input type="number" name="price" min="0" step="1000" value="${pr.price || ''}" placeholder="Để trống = Liên hệ"></label>
          <label class="adm-field"><span>Giá vốn (đ)</span><input type="number" name="cost" min="0" step="1000" value="${pr.cost || ''}"></label>
          <label class="adm-field"><span>Trạng thái</span><select name="status">${PRODUCT_STATUSES.map((s) => `<option ${s === (pr.status || 'Đang bán') ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
          <label class="adm-field adm-check"><input type="checkbox" name="visible" ${!p || p.visible ? 'checked' : ''}><span>Hiện trên website</span></label>
        </div>
        <p class="adm-fineprint">Giá khuyến mãi đặt ở mục Chi phí &amp; giá vốn.</p>
      </section>
      <section class="adm-d-section">
        <h3>Nội dung trang chi tiết</h3>
        <label class="adm-field"><span>Mô tả chi tiết</span><textarea name="desc" rows="4" maxlength="4000">${esc(p ? p.desc : '')}</textarea></label>
        <label class="adm-field"><span>Công dụng (mỗi dòng một ý)</span><textarea name="benefits" rows="3">${esc(p ? (p.benefits || []).join('\n') : '')}</textarea></label>
        <label class="adm-field"><span>Thành phần (mỗi dòng: Tên thành phần: tác dụng)</span><textarea name="ingredients" rows="3" placeholder="Ceramide NP: phục hồi hàng rào da">${esc(p ? (p.ingredients || []).map((x) => (x.desc ? `${x.name}: ${x.desc}` : x.name)).join('\n') : '')}</textarea></label>
        <label class="adm-field"><span>Cách dùng</span><textarea name="usage" rows="2" maxlength="2000">${esc(p ? p.usage : '')}</textarea></label>
      </section>
      <p class="adm-error" data-product-error hidden></p>
      <div class="adm-d-actions">
        ${p ? `<button type="button" class="adm-btn adm-btn-danger" data-act="delete-product" data-id="${esc(p.id)}">Xóa sản phẩm</button>` : ''}
        <button type="submit" class="adm-btn adm-btn-primary">${p ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
      </div>
    </form>`);
}

function brandDrawer(id) {
  const b = id ? (state.data.customBrands || []).find((x) => x.id === id) : null;
  drawerImages = b && b.image ? [b.image] : [];
  openDrawer(`
    <form class="adm-brand-form" data-id="${esc(id || '')}" autocomplete="off">
      <h2>${b ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}</h2>
      <p class="adm-muted">Thương hiệu sẽ hiện trong menu Thương hiệu và trang thương hiệu trên website.</p>
      <section class="adm-d-section">
        <label class="adm-field"><span>Tên thương hiệu *</span><input name="name" maxlength="80" required value="${esc(b ? b.name : '')}"></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Nhãn ngắn</span><input name="badge" maxlength="60" value="${esc(b ? b.badge : '')}" placeholder="VD: Clinical Formula"></label>
          <label class="adm-field"><span>Xuất xứ</span><input name="origin" maxlength="80" value="${esc(b ? b.origin : '')}" placeholder="VD: Seoul, Korea"></label>
        </div>
        <label class="adm-field"><span>Khẩu hiệu</span><input name="tagline" maxlength="200" value="${esc(b ? b.tagline : '')}"></label>
        <label class="adm-field"><span>Giới thiệu ngắn</span><textarea name="desc" rows="3" maxlength="3000">${esc(b ? b.desc : '')}</textarea></label>
        <label class="adm-field"><span>Câu chuyện thương hiệu</span><textarea name="story" rows="4" maxlength="4000">${esc(b ? b.story : '')}</textarea></label>
        ${imageField('Ảnh đại diện (ảnh đầu tiên được dùng)')}
        <label class="adm-field adm-check"><input type="checkbox" name="visible" ${!b || b.visible ? 'checked' : ''}><span>Hiện trên website</span></label>
      </section>
      <p class="adm-error" data-brand-error hidden></p>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">${b ? 'Lưu thay đổi' : 'Thêm thương hiệu'}</button></div>
    </form>`);
}

async function saveProduct(form) {
  const fd = new FormData(form);
  const err = form.querySelector('[data-product-error]');
  const fail = (m) => { err.textContent = m; err.hidden = false; };
  const name = String(fd.get('name') || '').trim();
  if (!name) return fail('Vui lòng nhập tên sản phẩm.');
  if (!drawerImages.length) return fail('Vui lòng thêm ít nhất 1 ảnh sản phẩm.');
  const id = form.dataset.id || '';
  const product = {
    id, name, nameKo: String(fd.get('nameKo') || '').trim(), brandId: fd.get('brandId'), line: fd.get('line') || '', category: fd.get('category'),
    spec: String(fd.get('spec') || '').trim(), tag: String(fd.get('tag') || '').trim(), desc: String(fd.get('desc') || '').trim(),
    usage: String(fd.get('usage') || '').trim(), visible: fd.get('visible') === 'on',
    image: drawerImages[0], gallery: drawerImages.slice(1, 9),
    benefits: String(fd.get('benefits') || '').split('\n').map((x) => x.trim()).filter(Boolean),
    ingredients: String(fd.get('ingredients') || '').split('\n').map((x) => x.trim()).filter(Boolean).map((line) => {
      const i = line.indexOf(':');
      return i > 0 ? { name: line.slice(0, i).trim(), desc: line.slice(i + 1).trim() } : { name: line, desc: '' };
    })
  };
  const old = (state.pricing || []).find((x) => x.id === id) || {};
  product.pricing = {
    price: Math.max(0, Math.round(Number(fd.get('price')) || 0)), cost: Math.max(0, Math.round(Number(fd.get('cost')) || 0)), status: fd.get('status'),
    salePrice: old.salePrice || 0, saleFrom: old.saleFrom || '', saleTo: old.saleTo || ''
  };
  if (product.pricing.salePrice && product.pricing.salePrice >= product.pricing.price) { product.pricing.salePrice = 0; product.pricing.saleFrom = ''; product.pricing.saleTo = ''; }
  const btns = form.querySelectorAll('button');
  btns.forEach((b) => { b.disabled = true; });
  try {
    const res = await api('admin.saveProduct', { product });
    const saved = { ...product, id: res.id, updatedAt: new Date().toISOString() };
    delete saved.pricing;
    const list = state.data.customProducts || (state.data.customProducts = []);
    const i = list.findIndex((x) => x.id === res.id);
    if (i >= 0) list[i] = { ...list[i], ...saved }; else list.push(saved);
    state.data.pricing = { ...(state.data.pricing || {}), [res.id]: { name, unit: product.spec, ...product.pricing } };
    state.data.costs = { ...state.data.costs, [res.id]: product.pricing.cost };
    if (!state.pricingDirty || !state.pricingDirty.size) {
      state.pricing = null;
    } else {
      // Unsaved edits in the price list: keep them and just put this product's row in
      const draftRow = {
        id: res.id, brand: brandName(product.brandId), brandId: product.brandId, image: product.image, custom: true, visible: product.visible,
        name, unit: product.spec, ...product.pricing
      };
      const k = state.pricing.findIndex((x) => x.id === res.id);
      if (k >= 0) state.pricing[k] = draftRow; else state.pricing.push(draftRow);
    }
    derive();
    closeDrawer();
    render();
    toast(id ? `Đã lưu ${name}` : `Đã thêm ${name} · khách thấy sản phẩm khi tải lại trang`);
  } catch (e) {
    btns.forEach((b) => { b.disabled = false; });
    if (!e.auth) fail(e.message);
  }
}

async function saveBrand(form) {
  const fd = new FormData(form);
  const err = form.querySelector('[data-brand-error]');
  const name = String(fd.get('name') || '').trim();
  if (!name) { err.textContent = 'Vui lòng nhập tên thương hiệu.'; err.hidden = false; return; }
  const id = form.dataset.id || '';
  const brand = {
    id, name, badge: String(fd.get('badge') || '').trim(), origin: String(fd.get('origin') || '').trim(), tagline: String(fd.get('tagline') || '').trim(),
    desc: String(fd.get('desc') || '').trim(), story: String(fd.get('story') || '').trim(), image: drawerImages[0] || '', visible: fd.get('visible') === 'on'
  };
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const res = await api('admin.saveBrand', { brand });
    const list = state.data.customBrands || (state.data.customBrands = []);
    const i = list.findIndex((x) => x.id === res.id);
    const saved = { ...brand, id: res.id };
    if (i >= 0) list[i] = { ...list[i], ...saved }; else list.push(saved);
    state.filters.pricing.brand = res.id;
    closeDrawer();
    render();
    toast(id ? `Đã lưu thương hiệu ${name}` : `Đã thêm thương hiệu ${name} · bấm "+ Thêm sản phẩm" để thêm sản phẩm`);
  } catch (e) {
    btn.disabled = false;
    if (!e.auth) { err.textContent = e.message; err.hidden = false; }
  }
}

async function toggleProduct(id) {
  const p = (state.data.customProducts || []).find((x) => x.id === id);
  if (!p) return;
  const pr = (state.pricing || []).find((x) => x.id === id) || {};
  try {
    await api('admin.saveProduct', { product: { ...p, visible: !p.visible, pricing: { price: pr.price || 0, cost: pr.cost || 0, status: pr.status || 'Đang bán', salePrice: pr.salePrice || 0, saleFrom: pr.saleFrom || '', saleTo: pr.saleTo || '' } } });
    p.visible = !p.visible;
    const row = (state.pricing || []).find((x) => x.id === id);
    if (row) row.visible = p.visible;
    render();
    toast(p.visible ? `Đã hiện ${p.name} trên website` : `Đã ẩn ${p.name} khỏi website`);
  } catch (e) {
    if (!e.auth) toast(e.message, true);
  }
}

async function deleteProduct(id) {
  const p = (state.data.customProducts || []).find((x) => x.id === id);
  if (!p || !window.confirm(`Xóa sản phẩm "${p.name}"? Sản phẩm sẽ biến mất khỏi website. Đơn hàng cũ vẫn giữ nguyên.`)) return;
  try {
    await api('admin.deleteProduct', { id });
    state.data.customProducts = state.data.customProducts.filter((x) => x.id !== id);
    if (state.data.pricing) delete state.data.pricing[id];
    if (!state.pricingDirty || !state.pricingDirty.size) state.pricing = null;
    else { state.pricing = state.pricing.filter((x) => x.id !== id); state.pricingDirty.delete(id); }
    closeDrawer();
    render();
    toast(`Đã xóa ${p.name}`);
  } catch (e) {
    if (!e.auth) toast(e.message, true);
  }
}

async function deleteBrand(id) {
  const b = (state.data.customBrands || []).find((x) => x.id === id);
  if (!b) return;
  if ((state.data.customProducts || []).some((p) => p.brandId === id)) { toast('Thương hiệu này còn sản phẩm. Hãy xóa hoặc chuyển sản phẩm sang thương hiệu khác trước.', true); return; }
  if (!window.confirm(`Xóa thương hiệu "${b.name}" khỏi website?`)) return;
  try {
    await api('admin.deleteBrand', { id });
    state.data.customBrands = state.data.customBrands.filter((x) => x.id !== id);
    state.filters.pricing.brand = '';
    render();
    toast(`Đã xóa thương hiệu ${b.name}`);
  } catch (e) {
    if (!e.auth) toast(e.message, true);
  }
}

/* --- Price list: every product of the catalogue, priced or "Liên hệ" --- */
const PRODUCT_STATUSES = ['Đang bán', 'Hết hàng', 'Ngừng bán'];
const CATALOG = brandsData.flatMap((b) => b.productsVi.map((p) => ({ id: p.id, name: p.name, spec: p.spec || '', brand: b.name, brandId: b.id })));

// Draft rows the admin is editing (saved together with "Lưu bảng giá")
function buildPricingDraft() {
  const server = state.data.pricing || {};
  const legacy = state.data.products || {};
  const custom = (state.data.customProducts || []).map((p) => ({ id: p.id, name: p.name, spec: p.spec || '', brand: brandName(p.brandId), brandId: p.brandId, image: p.image, custom: true, visible: p.visible !== false }));
  const builtin = CATALOG.map((c) => {
    const raw = brandsData.find((b) => b.id === c.brandId).productsVi.find((x) => x.id === c.id) || {};
    return { ...c, image: raw.image || '', custom: false, visible: true };
  });
  const catalog = [...builtin, ...custom];
  const ids = [...new Set([...catalog.map((c) => c.id), ...Object.keys(server), ...Object.keys(legacy)])];
  state.pricing = ids.map((id) => {
    const c = catalog.find((x) => x.id === id) || { name: id, brand: '', spec: '' };
    const s = server[id] || {};
    const l = legacy[id] || {};
    const base = productPrices[id] || {};
    return {
      id,
      brand: c.brand,
      brandId: c.brandId || '',
      image: c.image || '',
      custom: !!c.custom,
      visible: c.visible !== false,
      name: s.name || l.name || c.name,
      unit: s.unit || l.unit || base.unit || c.spec || '',
      price: Number(s.price ?? l.price ?? 0) || 0,
      cost: Number(s.cost ?? state.data.costs[id] ?? 0) || 0,
      salePrice: Number(s.salePrice) || 0,
      saleFrom: s.saleFrom || '',
      saleTo: s.saleTo || '',
      status: PRODUCT_STATUSES.includes(s.status) ? s.status : 'Đang bán'
    };
  });
  state.pricingDirty = new Set();
}

function effectiveOf(r) {
  const today = ymd(new Date());
  const onSale = r.salePrice > 0 && r.price > 0 && r.salePrice < r.price && (!r.saleFrom || r.saleFrom <= today) && (!r.saleTo || today <= r.saleTo);
  const upcoming = r.salePrice > 0 && r.salePrice < r.price && r.saleFrom && r.saleFrom > today;
  const ended = r.salePrice > 0 && r.saleTo && r.saleTo < today;
  return { price: onSale ? r.salePrice : r.price, onSale, upcoming, ended };
}

function pricePreview(r) {
  if (!(r.price > 0)) return '<span class="adm-muted">Liên hệ (chưa có giá)</span>';
  const e = effectiveOf(r);
  const stock = r.status !== 'Đang bán' ? ` ${chip(r.status, r.status === 'Hết hàng' ? 'returned' : 'cancelled')}` : '';
  if (e.onSale) return `<b class="adm-sale-price">${money(e.price)}</b> <del class="adm-muted">${money(r.price)}</del> ${chip(`-${Math.round((1 - e.price / r.price) * 100)}%`, 'cancelled')}${stock}`;
  return `<b>${money(r.price)}</b>${e.upcoming ? ` <small>KM bắt đầu ${fmtDate(`${r.saleFrom}T00:00:00`)}</small>` : ''}${e.ended ? ' <small>KM đã kết thúc</small>' : ''}${stock}`;
}

function pricingRowMatches(r, f) {
  const q = (f.q || '').trim().toLowerCase();
  if (q && ![r.name, r.id, r.brand, r.unit].some((v) => String(v || '').toLowerCase().includes(q))) return false;
  if (f.brand && r.brandId !== f.brand) return false;
  const e = effectiveOf(r);
  switch (f.show) {
    case 'sale': return e.onSale || e.upcoming;
    case 'out': return r.status === 'Hết hàng';
    case 'stop': return r.status === 'Ngừng bán';
    case 'noprice': return !(r.price > 0);
    case 'nocost': return r.price > 0 && !(r.cost > 0);
    default: return true;
  }
}

/* ==========================================================================
   View: Chi phí & giá vốn — the price list the website sells with
   ========================================================================== */
function renderCosts() {
  if (!state.pricing) buildPricingDraft();
  const f = state.filters.pricing;
  const rows = state.pricing.filter((r) => pricingRowMatches(r, f));
  const all = state.pricing;
  const count = (fn) => all.filter(fn).length;
  const brands = allBrands();
  if (f.brand && !brands.some((b) => b.id === f.brand)) f.brand = '';
  const current = brands.find((b) => b.id === f.brand);
  const dirty = state.pricingDirty.size;
  const tabs = `<div class="adm-tabs adm-brand-tabs" role="tablist">
      ${[{ id: '', name: 'Tất cả' }, ...brands].map((b) => {
        const n = all.filter((r) => !b.id || r.brandId === b.id).length;
        return `<button type="button" role="tab" aria-selected="${f.brand === b.id}" class="adm-tab ${f.brand === b.id ? 'is-active' : ''}" data-act="brand-tab" data-brand="${esc(b.id)}">
          <span>${esc(b.name)}</span><b>${n}</b>${b.id && !b.builtin ? `<em class="adm-tab-new" title="${b.visible ? 'Thương hiệu thêm từ admin' : 'Đang ẩn trên website'}">${b.visible ? 'mới' : 'ẩn'}</em>` : ''}</button>`;
      }).join('')}
      <button type="button" class="adm-tab adm-tab-add" data-act="add-brand">+ Thêm thương hiệu</button>
    </div>`;
  const brandCard = current && !current.builtin ? `
    <div class="adm-brand-head">
      ${current.image ? `<img src="${esc(current.image)}" alt="" loading="lazy">` : ''}
      <div>
        <h2>${esc(current.name)} ${chip(current.visible ? 'Thêm từ admin' : 'Đang ẩn trên web', current.visible ? 'done' : 'muted')}</h2>
        <p class="adm-muted">${esc(current.tagline || current.desc || 'Hiện trong menu Thương hiệu của website.')}</p>
      </div>
      <div class="adm-brand-actions">
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="edit-brand" data-id="${esc(current.id)}">Sửa thương hiệu</button>
        <button type="button" class="adm-btn adm-btn-danger adm-btn-sm" data-act="delete-brand" data-id="${esc(current.id)}">Xóa</button>
      </div>
    </div>` : '';

  const range = periodRange();
  const expenses = state.data.expenses.filter((x) => inRange(x._date, range));
  const total = expenses.reduce((s, x) => s + x.amount, 0);

  return `
    <section class="adm-kpis">
      ${kpi('Sản phẩm đang bán', count((r) => r.price > 0 && r.status === 'Đang bán'), `${count((r) => !(r.price > 0))} sản phẩm để "Liên hệ"`, 'primary')}
      ${kpi('Đang khuyến mãi', count((r) => effectiveOf(r).onSale), `${count((r) => effectiveOf(r).upcoming)} chương trình sắp bắt đầu`)}
      ${kpi('Hết hàng / ngừng bán', count((r) => r.status !== 'Đang bán'), 'Khách không thêm vào giỏ được')}
      ${kpi('Thiếu giá vốn', count((r) => r.price > 0 && !(r.cost > 0)), 'Cần nhập để báo cáo tính đúng lợi nhuận', count((r) => r.price > 0 && !(r.cost > 0)) ? 'bad' : 'good')}
    </section>

    ${tabs}
    <section class="adm-card adm-card-tabbed">
      ${brandCard}
      <div class="adm-card-head">
        <div><h2>Sản phẩm &amp; bảng giá${current ? ` · ${esc(current.name)}` : ''}</h2>
        <p class="adm-muted">Sửa giá bán, giá vốn, khuyến mãi, trạng thái ngay trong bảng rồi bấm "Lưu bảng giá". Giá vốn chỉ hiện trong admin.</p></div>
      </div>
      <div class="adm-toolbar" data-scope="pricing">
        <input type="search" data-filter="q" value="${esc(f.q)}" placeholder="Tìm tên, mã sản phẩm…" aria-label="Tìm sản phẩm">
        ${select('show', f.show, [['sale', 'Đang / sắp khuyến mãi'], ['out', 'Hết hàng'], ['stop', 'Ngừng bán'], ['noprice', 'Chưa có giá (Liên hệ)'], ['nocost', 'Thiếu giá vốn']], 'Tất cả sản phẩm')}
        <button type="button" class="adm-btn adm-btn-primary adm-btn-sm" data-act="add-product">+ Thêm sản phẩm${current ? ` cho ${esc(current.name)}` : ''}</button>
      </div>
      <p class="adm-muted adm-result-meta">${rows.length} sản phẩm${current ? ` của ${esc(current.name)}` : ''} · để trống giá bán = website hiện "Liên hệ" · giá khuyến mãi chỉ áp dụng trong khoảng ngày đã chọn (để trống = không giới hạn)</p>
      <form id="admPricingForm" novalidate>
        <div class="adm-table-wrap"><table class="adm-table adm-pricing-table">
          <thead><tr>
            <th></th><th>Sản phẩm</th><th>Quy cách</th><th class="num">Giá bán (đ)</th><th class="num">Giá vốn (đ)</th><th class="num">Lãi gộp</th>
            <th>Khuyến mãi</th><th>Trạng thái</th><th>Website đang hiện</th><th></th>
          </tr></thead>
          <tbody>${rows.map((r) => {
            const e = effectiveOf(r);
            const margin = r.price > 0 && r.cost > 0 ? pct(e.price - r.cost, e.price) : '—';
            return `
            <tr data-price-row="${esc(r.id)}" class="${state.pricingDirty.has(r.id) ? 'is-dirty' : ''}">
              <td class="adm-thumb-cell">${r.image ? `<img src="${esc(r.image)}" alt="" loading="lazy">` : '<span class="adm-thumb-empty"></span>'}</td>
              <td><span class="adm-cell-main">${esc(r.name)}</span><small>${esc(r.brand)} · ${esc(r.id)}</small>${r.custom ? `<small>${chip(r.visible ? 'Thêm từ admin' : 'Đang ẩn trên web', r.visible ? 'done' : 'muted')}</small>` : ''}</td>
              <td><input class="adm-pin adm-pin-unit" data-field="unit" value="${esc(r.unit)}" maxlength="80" aria-label="Quy cách ${esc(r.name)}"></td>
              <td class="num"><input class="adm-pin" type="number" min="0" step="1000" data-field="price" value="${r.price || ''}" placeholder="Liên hệ" aria-label="Giá bán ${esc(r.name)}"></td>
              <td class="num"><input class="adm-pin" type="number" min="0" step="1000" data-field="cost" value="${r.cost || ''}" placeholder="0" aria-label="Giá vốn ${esc(r.name)}"></td>
              <td class="num" data-cell="margin">${margin}</td>
              <td class="adm-sale-cell">
                <input class="adm-pin" type="number" min="0" step="1000" data-field="salePrice" value="${r.salePrice || ''}" placeholder="Giá KM" aria-label="Giá khuyến mãi ${esc(r.name)}">
                <span class="adm-sale-dates"><input type="date" class="adm-pin" data-field="saleFrom" value="${esc(r.saleFrom)}" aria-label="Khuyến mãi từ ngày"><span>–</span><input type="date" class="adm-pin" data-field="saleTo" value="${esc(r.saleTo)}" aria-label="Khuyến mãi đến ngày"></span>
              </td>
              <td><select class="adm-pin adm-pin-status adm-status-${r.status === 'Đang bán' ? 'on' : r.status === 'Hết hàng' ? 'out' : 'stop'}" data-field="status" aria-label="Trạng thái ${esc(r.name)}">${PRODUCT_STATUSES.map((s) => `<option ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
              <td data-cell="preview">${pricePreview(r)}</td>
              <td class="adm-row-actions">${r.custom
                ? `<button type="button" class="adm-linkish" data-act="edit-product" data-id="${esc(r.id)}">Sửa</button><button type="button" class="adm-linkish" data-act="toggle-product" data-id="${esc(r.id)}">${r.visible ? 'Ẩn' : 'Hiện'}</button>`
                : '<span class="adm-muted" title="Tên, ảnh, mô tả nằm trong code website">Có sẵn</span>'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>
        <div class="adm-save-bar ${dirty ? 'is-dirty' : ''}">
          <span>${dirty ? `<b>${dirty}</b> sản phẩm có thay đổi chưa lưu` : 'Chưa có thay đổi'}</span>
          ${dirty ? '<button type="button" class="adm-btn adm-btn-ghost" data-act="pricing-reset">Hoàn tác</button>' : ''}
          <button type="submit" class="adm-btn adm-btn-primary" ${dirty ? '' : 'disabled'}>Lưu bảng giá</button>
        </div>
      </form>
    </section>

    <section class="adm-card">
      <div class="adm-card-head"><div><h2>Chi phí vận hành trong kỳ</h2><p class="adm-muted">${periodLabel()} · tổng ${money(total)} · nhập ở sheet "Chi phí" trong Google Sheet, dùng để tính lợi nhuận trong Báo cáo</p></div></div>
      ${expenses.length ? `<div class="adm-table-wrap adm-table-short"><table class="adm-table adm-table-plain">
        <thead><tr><th>Ngày</th><th>Hạng mục</th><th class="num">Số tiền</th><th></th></tr></thead>
        <tbody>${expenses.map((x) => `<tr><td>${fmtDate(x._date)}</td><td>${esc(x.category)}${x.note ? `<small>${esc(x.note)}</small>` : ''}</td><td class="num">${money(x.amount)}</td>
          <td class="num"><button type="button" class="adm-icon-btn" data-act="delete-expense" data-id="${esc(x.id)}" aria-label="Xóa khoản chi" title="Xóa">×</button></td></tr>`).join('')}</tbody>
      </table></div>` : '<p class="adm-empty">Chưa có khoản chi nào trong khoảng thời gian này.</p>'}
    </section>`;
}

// Typing in the price table: keep the draft, refresh the row's margin / preview without re-rendering
function onPricingInput(el) {
  const tr = el.closest('[data-price-row]');
  const r = state.pricing.find((x) => x.id === tr.dataset.priceRow);
  const field = el.dataset.field;
  r[field] = ['price', 'cost', 'salePrice'].includes(field) ? Math.max(0, Math.round(Number(el.value) || 0)) : el.value;
  state.pricingDirty.add(r.id);
  tr.classList.add('is-dirty');
  if (field === 'status') el.className = `adm-pin adm-pin-status adm-status-${r.status === 'Đang bán' ? 'on' : r.status === 'Hết hàng' ? 'out' : 'stop'}`;
  const e = effectiveOf(r);
  tr.querySelector('[data-cell="margin"]').textContent = r.price > 0 && r.cost > 0 ? pct(e.price - r.cost, e.price) : '—';
  tr.querySelector('[data-cell="preview"]').innerHTML = pricePreview(r);
  const bar = content().querySelector('.adm-save-bar');
  if (bar) {
    bar.classList.add('is-dirty');
    bar.querySelector('span').innerHTML = `<b>${state.pricingDirty.size}</b> sản phẩm có thay đổi chưa lưu`;
    bar.querySelector('button[type="submit"]').disabled = false;
    if (!bar.querySelector('[data-act="pricing-reset"]')) bar.querySelector('button[type="submit"]').insertAdjacentHTML('beforebegin', '<button type="button" class="adm-btn adm-btn-ghost" data-act="pricing-reset">Hoàn tác</button>');
  }
}

async function savePricing(form) {
  // Check the edited rows before sending
  for (const r of state.pricing) {
    if (!state.pricingDirty.has(r.id)) continue;
    if (r.salePrice && !(r.price > 0)) return toast(`"${r.name}": cần nhập giá bán trước khi đặt giá khuyến mãi.`, true);
    if (r.salePrice && r.salePrice >= r.price) return toast(`"${r.name}": giá khuyến mãi phải thấp hơn giá bán.`, true);
    if (r.saleFrom && r.saleTo && r.saleFrom > r.saleTo) return toast(`"${r.name}": ngày khuyến mãi chưa đúng (từ ngày sau đến ngày).`, true);
  }
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Đang lưu…';
  try {
    const rows = state.pricing.map(({ brand, brandId, image, custom, visible, ...r }) => r);
    await api('admin.savePricing', { rows });
    state.data.pricing = Object.fromEntries(rows.map((r) => [r.id, r]));
    state.data.costs = Object.fromEntries(rows.map((r) => [r.id, r.cost]));
    state.pricingDirty = new Set();
    derive();
    render();
    toast('Đã lưu bảng giá · khách thấy giá mới khi tải lại trang');
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Lưu bảng giá';
    if (!err.auth) toast(err.message, true);
  }
}

/* ==========================================================================
   Events
   ========================================================================== */
function bindEvents() {
  window.addEventListener('hashchange', () => { closeDrawer(); render(); window.scrollTo(0, 0); });
  window.addEventListener('beforeunload', (e) => {
    if (state.pricingDirty && state.pricingDirty.size) { e.preventDefault(); e.returnValue = ''; }
  });

  $('#admPeriod').value = state.period.key;
  $('#admPeriod').addEventListener('change', (e) => {
    state.period.key = e.target.value;
    if (state.period.key === 'custom') {
      // Start from the dates already shown, so "Tùy chọn…" just unlocks them
      state.period.from = $('#admFrom').value;
      state.period.to = $('#admTo').value;
    }
    storeSet(localStorage, PREF_KEY, { ...prefs, period: state.period.key === 'custom' ? '30d' : state.period.key });
    Object.values(state.filters).forEach((f) => { f.page = 1; });
    render();
  });
  // Typing a date switches the period to "Tùy chọn…"
  ['#admFrom', '#admTo'].forEach((sel) => $(sel).addEventListener('change', () => {
    let from = $('#admFrom').value;
    let to = $('#admTo').value;
    if (from && to && from > to) [from, to] = [to, from];
    Object.assign(state.period, { key: 'custom', from, to });
    $('#admPeriod').value = 'custom';
    Object.values(state.filters).forEach((f) => { f.page = 1; });
    render();
  }));

  $('#admRefresh').addEventListener('click', () => loadData(true));
  $('#admLogout').addEventListener('click', () => signOut(false));
  $('#admChangePw').addEventListener('click', passwordDrawer);
  $('#admDrawerClose').addEventListener('click', closeDrawer);
  $('#admDrawerBackdrop').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
    if (e.key === 'Enter' && e.target.matches('tr[data-act]')) e.target.click();
  });

  // Filters (search typing waits a moment before re-rendering)
  let typing;
  content().addEventListener('input', (e) => {
    const el = e.target;
    if (el.matches('.adm-pin')) {
      onPricingInput(el);
      return;
    }
    if (!el.matches('[data-filter]')) return;
    const scope = el.closest('[data-scope]').dataset.scope;
    clearTimeout(typing);
    const apply = () => {
      state.filters[scope][el.dataset.filter] = el.value;
      state.filters[scope].page = 1;
      render();
      if (el.type === 'search') {
        const again = content().querySelector(`[data-scope="${scope}"] [data-filter="q"]`);
        if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
      }
    };
    if (el.type === 'search') typing = setTimeout(apply, 250); else apply();
  });

  content().addEventListener('change', (e) => {
    const el = e.target;
    if (el.matches('[data-act="lead-status"]')) saveLead(el.dataset.id, { status: el.value });
    if (el.matches('[data-act="lead-convert"]')) saveLead(el.dataset.id, { status: el.checked ? LEAD_WAITING : 'Tiềm năng' });
  });

  const clickHandler = (e) => {
    const go = e.target.closest('[data-goto]');
    if (go) { window.location.hash = `#/${go.dataset.goto}`; return; }
    // The "Chuyển đổi" tick sits in a clickable row: ticking must not open the row
    if (e.target.closest('.adm-convert')) return;
    const el = e.target.closest('[data-act]');
    if (!el || el.matches('select')) return;
    const act = el.dataset.act;
    if (act === 'open-order') orderDrawer(el.dataset.code);
    else if (act === 'open-customer') customerDrawer(el.dataset.key);
    else if (act === 'open-lead') leadDrawer(el.dataset.id);
    else if (act === 'type-tab') {
      state.filters[el.dataset.scope].type = el.dataset.type;
      state.filters[el.dataset.scope].page = 1;
      render();
    } else if (act === 'funnel-stage') { state.funnelStage = Number(el.dataset.stage); render(); }
    else if (act === 'page') { state.filters[el.dataset.scope].page = Number(el.dataset.page); render(); window.scrollTo(0, 0); }
    else if (act === 'export-orders') exportOrders(el.dataset.group);
    else if (act === 'filter-orders') {
      // Open the section that holds orders with this status, already filtered
      const group = groupOf(el.dataset.status || 'Mới');
      const many = ORDER_GROUPS[group].statuses.length > 1;
      Object.assign(state.filters[group], { q: '', status: many ? (el.dataset.status || '') : '', type: '', pay: el.dataset.pay || '', payStatus: el.dataset.payStatus || '', reason: '', page: 1 });
      if (group === 'success') state.filters.customers.mode = 'list';
      window.location.hash = `#/${ORDER_GROUPS[group].view}`;
      render();
    } else if (act === 'customer-mode') {
      state.filters.customers.mode = el.dataset.mode;
      render();
    } else if (act === 'brand-tab') {
      state.filters.pricing.brand = el.dataset.brand;
      render();
    } else if (act === 'add-brand') {
      brandDrawer();
    } else if (act === 'edit-brand') {
      brandDrawer(el.dataset.id);
    } else if (act === 'delete-brand') {
      deleteBrand(el.dataset.id);
    } else if (act === 'add-product') {
      productDrawer('', state.filters.pricing.brand);
    } else if (act === 'edit-product') {
      productDrawer(el.dataset.id);
    } else if (act === 'toggle-product') {
      toggleProduct(el.dataset.id);
    } else if (act === 'delete-product') {
      deleteProduct(el.dataset.id);
    } else if (act === 'img-del') {
      drawerImages.splice(Number(el.dataset.i), 1);
      renderDrawerImages();
    } else if (act === 'img-main') {
      const [img] = drawerImages.splice(Number(el.dataset.i), 1);
      drawerImages.unshift(img);
      renderDrawerImages();
    } else if (act === 'img-add-url') {
      const input = $('#admDrawerBody [data-img-url]');
      const url = input ? input.value.trim() : '';
      if (!/^https:\/\/[^\s"'<>]+$/.test(url)) { toast('Link ảnh cần bắt đầu bằng https://', true); return; }
      drawerImages.push(url);
      input.value = '';
      renderDrawerImages();
    } else if (act === 'pricing-reset') {
      buildPricingDraft();
      render();
    } else if (act === 'filter-leads-waiting') {
      Object.assign(state.filters.leads, { status: LEAD_WAITING, q: '', source: '', page: 1 });
      state.period.key = 'all';
      $('#admPeriod').value = 'all';
      render();
    } else if (act === 'add-lead') {
      addLeadDrawer();
    } else if (act === 'mark-failed') {
      markFailed(el.closest('form'), el.dataset.status, el.dataset.reason || '');
    } else if (act === 'quick-status') {
      const form = el.closest('form');
      saveOrder(form, { status: el.dataset.status });
    } else if (act === 'delete-expense') deleteExpense(el.dataset.id);
  };
  content().addEventListener('click', clickHandler);
  $('#admDrawerBody').addEventListener('click', clickHandler);

  // Drawer forms
  $('#admDrawerBody').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.matches('.adm-order-form')) saveOrder(form);
    else if (form.matches('.adm-pw-form')) changePassword(form);
    else if (form.matches('.adm-lead-add-form')) addLead(form);
    else if (form.matches('.adm-product-form')) saveProduct(form);
    else if (form.matches('.adm-brand-form')) saveBrand(form);
    else if (form.matches('.adm-lead-form')) {
      const fd = new FormData(form);
      saveLead(form.dataset.id, { status: fd.get('status'), internalNote: String(fd.get('internalNote') || ''), consultant: String(fd.get('consultant') || '').trim() }, form);
    }
  });
  // Product / brand form: photo upload and the line list that follows the brand
  $('#admDrawerBody').addEventListener('change', (e) => {
    const el = e.target;
    if (el.matches('[data-upload]') && el.files && el.files.length) {
      const room = Math.max(0, 9 - drawerImages.length);
      uploadFiles(Array.from(el.files).slice(0, room), $('#admDrawerBody [data-upload-status]'));
      el.value = '';
    } else if (el.matches('[data-brand-select]')) {
      const lines = (brandsData.find((b) => b.id === el.value) || {}).lines || [];
      const sel = $('#admDrawerBody [data-line-select]');
      if (sel) sel.innerHTML = `<option value="">— Không thuộc dòng nào —</option>${lines.map((l) => `<option value="${esc(l.id)}">${esc(l.nameVi)}</option>`).join('')}`;
    }
  });
  // Choosing "Đã hủy" / "Hoàn hàng" in the status box shows the reason box
  $('#admDrawerBody').addEventListener('change', (e) => {
    if (e.target.name !== 'status' || !e.target.closest('.adm-order-form')) return;
    const form = e.target.closest('.adm-order-form');
    form.querySelector('.adm-fail-field').hidden = !FAILED_STATUSES.includes(e.target.value);
  });
  $('#admDrawerBody').addEventListener('input', (e) => {
    const form = e.target.closest('.adm-order-form');
    if (!form || !['discount', 'shipping'].includes(e.target.name)) return;
    const o = state.data.orders.find((x) => x.code === form.dataset.code);
    const fd = new FormData(form);
    const total = Math.max(0, o.subtotal - (Number(fd.get('discount')) || 0)) + (Number(fd.get('shipping')) || 0);
    form.querySelector('[data-total]').textContent = money(total);
  });

  // Content forms
  content().addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.id === 'admPricingForm') savePricing(form);
  });
}

function passwordDrawer() {
  openDrawer(`
    <form class="adm-pw-form" autocomplete="off">
      <h2>Đổi mật khẩu admin</h2>
      <p class="adm-muted">Sau khi đổi, các máy khác đang đăng nhập sẽ bị đăng xuất. Máy này vẫn giữ đăng nhập.</p>
      ${state.demo ? '<p class="adm-note">Đang xem dữ liệu mẫu: thử đổi ở đây không ảnh hưởng mật khẩu thật.</p>' : ''}
      <section class="adm-d-section">
        <label class="adm-field"><span>Mật khẩu hiện tại</span><input type="password" name="current" autocomplete="current-password" required></label>
        <label class="adm-field"><span>Mật khẩu mới (ít nhất 8 ký tự)</span><input type="password" name="next" autocomplete="new-password" minlength="8" required></label>
        <label class="adm-field"><span>Nhập lại mật khẩu mới</span><input type="password" name="confirm" autocomplete="new-password" minlength="8" required></label>
        <p class="adm-error" data-pw-error hidden></p>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu mật khẩu mới</button></div>
      <p class="adm-fineprint">Quên mật khẩu: mở Google Sheet nhận đơn → menu <b>beVIBE Admin</b> → <b>Đặt / đổi mật khẩu admin</b>.</p>
    </form>`);
}

async function changePassword(form) {
  const fd = new FormData(form);
  const current = String(fd.get('current') || '');
  const next = String(fd.get('next') || '');
  const err = form.querySelector('[data-pw-error]');
  const fail = (m) => { err.textContent = m; err.hidden = false; };
  if (next.length < 8) return fail('Mật khẩu mới cần ít nhất 8 ký tự.');
  if (next !== String(fd.get('confirm') || '')) return fail('Hai lần nhập mật khẩu mới không khớp.');
  if (next === current) return fail('Mật khẩu mới phải khác mật khẩu hiện tại.');
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const res = await api('admin.changePassword', { currentPassword: current, newPassword: next });
    if (res.token) {
      state.token = res.token;
      storeSet(sessionStorage, TOKEN_KEY, res.token);
    }
    closeDrawer();
    toast('Đã đổi mật khẩu admin');
  } catch (e) {
    btn.disabled = false;
    if (!e.auth) fail(e.message);
  }
}

async function deleteExpense(id) {
  const x = state.data.expenses.find((e) => e.id === id);
  if (!x || !window.confirm(`Xóa khoản chi ${x.category} ${money(x.amount)} ngày ${fmtDate(x._date)}?`)) return;
  try {
    await api('admin.deleteExpense', { id });
    state.data.expenses = state.data.expenses.filter((e) => e.id !== id);
    derive();
    render();
    toast('Đã xóa khoản chi');
  } catch (err) {
    if (!err.auth) toast(err.message, true);
  }
}

/* ==========================================================================
   Login / data loading
   ========================================================================== */
function showLogin(message) {
  $('#admShell').hidden = true;
  $('#admLogin').hidden = false;
  const err = $('#admLoginError');
  err.hidden = !message;
  err.textContent = message || '';
  $('#admEndpointNote').textContent = ORDER_ENDPOINT ? '' : 'Chưa cấu hình ORDER_ENDPOINT trong assets/js/order-config.js — chỉ xem được dữ liệu mẫu.';
  setTimeout(() => $('#admPassword').focus(), 50);
}

function signOut(expired) {
  if (state.token && !state.demo && !expired) api('admin.logout').catch(() => {});
  state.token = '';
  state.data = null;
  state.demo = false;
  storeSet(sessionStorage, TOKEN_KEY, null);
  closeDrawer();
  showLogin(expired ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : '');
}

async function loadData(manual) {
  const btn = $('#admRefresh');
  btn.disabled = true;
  btn.classList.add('is-loading');
  if (!state.data) content().innerHTML = '<div class="adm-loading">Đang tải dữ liệu…</div>';
  try {
    const data = await api('admin.data');
    state.data = data;
    if (!state.pricingDirty || !state.pricingDirty.size) state.pricing = null;
    derive();
    $('#admLogin').hidden = true;
    $('#admShell').hidden = false;
    $('#admDemoTag').hidden = !state.demo;
    const link = $('#admSheetLink');
    link.hidden = !data.sheetUrl;
    if (data.sheetUrl) link.href = data.sheetUrl;
    render();
    if (manual) toast('Đã tải dữ liệu mới nhất');
  } catch (err) {
    if (!err.auth) {
      if (state.data) toast(err.message, true);
      else showLogin(err.message);
    }
  } finally {
    btn.disabled = false;
    btn.classList.remove('is-loading');
  }
}

function initLogin() {
  $('#admLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = $('#admPassword').value;
    if (!password) return;
    const btn = $('#admLoginBtn');
    btn.disabled = true;
    btn.textContent = 'Đang đăng nhập…';
    state.demo = false;
    try {
      const res = await api('admin.login', { password });
      state.token = res.token;
      storeSet(sessionStorage, TOKEN_KEY, res.token);
      $('#admPassword').value = '';
      await loadData();
    } catch (err) {
      showLogin(err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Đăng nhập';
    }
  });
  $('#admDemoBtn').addEventListener('click', () => {
    state.demo = true;
    state.token = '';
    loadData();
  });
}

/* ==========================================================================
   Demo data (no Sheet needed)
   ========================================================================== */
let demoDb = null;

function buildDemo() {
  let seed = 20261116;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const products = {
    'drbargo-1': { name: 'Dr.BARGO Emulsion', unit: 'Chai 150ml', price: 420000 },
    'drbargo-2': { name: 'Dr.BARGO Foam Cleansing', unit: 'Chai 150ml', price: 420000 },
    'drbargo-3': { name: 'Dr.BARGO Serum', unit: 'Lọ 50ml', price: 960000 },
    'drbargo-4': { name: 'Dr.BARGO Toner', unit: 'Chai 400ml', price: 420000 },
    'neura-6': { name: 'Neuraderm MD Cream', unit: 'Tuýp 180g', price: 1350000 },
    'neura-8': { name: 'Neuraderm Neuro Lacto Toner', unit: 'Chai 150ml', price: 650000 },
    'neura-7': { name: 'Neuraderm Neuro Lacto Serum', unit: 'Chai 50ml', price: 1060000 },
    'neura-16': { name: 'Neuraderm Neuro Lacto Moisturizer', unit: 'Tuýp 80ml', price: 850000 },
    'stemc-3': { name: 'Stem C Sunblock', unit: 'Tuýp 50ml', price: 600000 },
    'stemc-2': { name: 'MediPharm Stem C Revitalizing Cream', unit: 'Hũ 50ml', price: 1400000 }
  };
  const ids = Object.keys(products);
  const costs = {};
  ids.forEach((id, i) => { if (i !== 9) costs[id] = Math.round((products[id].price * (0.42 + rnd() * 0.1)) / 1000) * 1000; });
  const last = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
  const mid = ['Thị', 'Văn', 'Minh', 'Thu', 'Ngọc', 'Hải', 'Thanh', 'Quốc'];
  const first = ['Lan', 'Hương', 'Linh', 'Trang', 'Hà', 'Nam', 'Tuấn', 'Mai', 'Yến', 'Phương', 'Anh', 'Thảo', 'Hùng', 'Vy'];
  const cities = ['Hà Nội', 'Hà Nội', 'Hà Nội', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Bắc Ninh', 'Cần Thơ', 'Quảng Ninh'];
  const orgs = ['Spa Hoa Sen', 'Clinic Da Liễu An Khang', 'Thẩm mỹ viện Mộc', 'Cửa hàng Bé Xinh', 'Spa Ngọc Trai'];
  const people = Array.from({ length: 70 }, (_, i) => ({
    name: `${pick(last)} ${pick(mid)} ${pick(first)}`,
    phone: `09${String(10000000 + Math.floor(rnd() * 89999999)).slice(0, 8)}`,
    email: rnd() > 0.5 ? `khach${i + 1}@example.com` : '',
    city: pick(cities),
    type: rnd() < 0.68 ? 'Khách lẻ' : rnd() < 0.6 ? 'Khách sỉ' : 'Tư vấn viên'
  }));
  people.forEach((p) => { if (p.type === 'Khách sỉ') p.org = pick(orgs); if (p.type === 'Tư vấn viên') p.org = `TVV-${Math.floor(rnd() * 900 + 100)}`; });

  const now = Date.now();
  const orders = [];
  const items = [];
  for (let i = 0; i < 140; i++) {
    const p = people[Math.floor(Math.pow(rnd(), 1.6) * people.length)];
    const t = new Date(now - Math.floor(rnd() * 90 * 86400000));
    const code = `BV${ymd(t).slice(2).replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`;
    const n = 1 + Math.floor(rnd() * (p.type === 'Khách lẻ' ? 2 : 4));
    let subtotal = 0;
    let qty = 0;
    const lines = [];
    for (let k = 0; k < n; k++) {
      const id = pick(ids);
      const q = p.type === 'Khách lẻ' ? 1 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 10);
      const pr = products[id];
      items.push({ code, id, name: pr.name, unit: pr.unit, price: pr.price, qty: q, line: pr.price * q });
      subtotal += pr.price * q;
      qty += q;
      lines.push(`${pr.name} (${pr.unit}) x${q}`);
    }
    const age = (now - t.getTime()) / 86400000;
    const r = rnd();
    const status = age < 2 ? (r < 0.6 ? 'Mới' : 'Đã xác nhận') : age < 6 ? pick(['Đã xác nhận', 'Đang giao', 'Hoàn tất', 'Mới']) : (r < 0.09 ? 'Đã hủy' : r < 0.15 ? 'Hoàn hàng' : r < 0.22 ? 'Đang giao' : 'Hoàn tất');
    const pay = rnd() < 0.45 ? 'bank' : 'cod';
    const failReason = status === 'Hoàn hàng' ? pick(['Khách không nhận hàng khi giao', 'Khách không nhận hàng khi giao', 'Khách hẹn giao lại quá lâu', 'Sai địa chỉ / thông tin'])
      : status === 'Đã hủy' ? pick(['Khách đổi ý / không mua nữa', 'Không liên lạc được khách', 'Đặt trùng / đặt nhầm', 'Hết hàng']) : '';
    const payStatus = FAILED_STATUSES.includes(status) ? (pay === 'bank' && rnd() < 0.3 ? 'Đã hoàn tiền' : 'Chưa thanh toán')
      : status === 'Hoàn tất' ? 'Đã thanh toán' : pay === 'bank' && rnd() < 0.55 ? 'Đã thanh toán' : 'Chưa thanh toán';
    orders.push({
      time: t.toISOString(), code, status, name: p.name, phone: p.phone, email: p.email, city: p.city, district: '', address: `${Math.floor(rnd() * 200) + 1} phố mẫu`,
      pay, products: lines.join('\n'), qty, subtotal, note: '', priceNote: 'OK', account: '', customerType: p.type, org: p.org || '', payStatus,
      shipping: rnd() < 0.5 ? 30000 : 0, discount: p.type === 'Khách lẻ' ? 0 : Math.round(subtotal * 0.1 / 1000) * 1000, internalNote: '', updatedAt: '', failReason
    });
  }
  const leadTypes = ['Yêu cầu hợp tác / Báo giá sỉ', 'Đăng ký tài khoản khách hàng mới', 'Yêu cầu hợp tác / Báo giá sỉ (qua Zalo)'];
  const leads = [];
  for (let i = 0; i < 90; i++) {
    const p = i < 55 ? people[i % people.length] : { name: `${pick(last)} ${pick(mid)} ${pick(first)}`, phone: `08${String(10000000 + Math.floor(rnd() * 89999999)).slice(0, 8)}`, email: '' };
    const t = new Date(now - Math.floor(rnd() * 95 * 86400000));
    leads.push({
      time: t.toISOString(), id: `LD${ymd(t).slice(2).replace(/-/g, '')}${String(i).padStart(4, '0')}`,
      status: pick(['Mới', 'Đã liên hệ', 'Tiềm năng', 'Chờ đặt đơn', 'Đã mua', 'Không phù hợp', 'Đã liên hệ']), type: pick(leadTypes), consultant: pick(['', 'Ms. Kim Yến', 'Thu Trang']),
      name: p.name, phone: p.phone, email: p.email || '', org: p.org || '', interest: pick(['Phân phối Dr.BARGO', 'Báo giá sỉ NEURADERM', 'Gia công OEM', 'Mua cho spa']), note: '', internalNote: ''
    });
  }
  const cats = ['Nhập hàng', 'Vận chuyển', 'Marketing / Quảng cáo', 'Nhân sự', 'Mặt bằng', 'Hoa hồng tư vấn viên', 'Khác'];
  const expenses = [];
  for (let m = 0; m < 3; m++) {
    const base = new Date();
    base.setMonth(base.getMonth() - m, 5);
    [['Mặt bằng', 12000000], ['Nhân sự', 28000000], ['Marketing / Quảng cáo', 9000000 + rnd() * 6000000], ['Vận chuyển', 2500000 + rnd() * 2000000], ['Hoa hồng tư vấn viên', 3000000 + rnd() * 3000000]]
      .forEach(([c, a], k) => {
        const d = new Date(base.getTime() + k * 3 * 86400000);
        if (d.getTime() <= now) expenses.push({ id: `CPDEMO${m}${k}`, date: d.toISOString(), category: c, amount: Math.round(a / 1000) * 1000, note: '' });
      });
  }
  return {
    ok: true, generatedAt: new Date().toISOString(), orders, items, leads, expenses, costs, products, sheetUrl: '', customProducts: [], customBrands: [],
    // Sample price list: one product on promotion this month, one out of stock
    pricing: Object.fromEntries(Object.entries(products).map(([id, p]) => {
      const saleMonth = new Date();
      const from = ymd(new Date(saleMonth.getFullYear(), saleMonth.getMonth(), 1));
      const to = ymd(new Date(saleMonth.getFullYear(), saleMonth.getMonth() + 1, 0));
      return [id, {
        name: p.name, unit: p.unit, price: p.price, cost: costs[id] || 0,
        salePrice: id === 'drbargo-3' ? 790000 : 0, saleFrom: id === 'drbargo-3' ? from : '', saleTo: id === 'drbargo-3' ? to : '',
        status: id === 'drbargo-2' ? 'Hết hàng' : 'Đang bán'
      }];
    })),
    options: {
      statuses: STATUS_FLOW,
      failReasons: ['Khách đổi ý / không mua nữa', 'Không liên lạc được khách', 'Đặt trùng / đặt nhầm', 'Sai địa chỉ / thông tin', 'Hết hàng', 'Khách không nhận hàng khi giao', 'Khách hẹn giao lại quá lâu', 'Hàng lỗi / giao sai', 'Khác'],
      payStatuses: ['Chưa thanh toán', 'Đã thanh toán', 'Đã hoàn tiền'], leadStatuses: ['Mới', 'Đã liên hệ', 'Tiềm năng', 'Chờ đặt đơn', 'Đã mua', 'Không phù hợp'], leadSources: DEFAULT_LEAD_SOURCES,
      customerTypes: { b2c: 'Khách lẻ', wholesale: 'Khách sỉ', consultant: 'Tư vấn viên' }, expenseCategories: cats
    }
  };
}

async function demoApi(action, payload) {
  await new Promise((r) => setTimeout(r, 150));
  if (!demoDb) demoDb = buildDemo();
  // Changes are kept in memory for this tab only (reloading the page starts over)
  if (action === 'admin.data') return JSON.parse(JSON.stringify({ ...demoDb, generatedAt: new Date().toISOString() }));
  if (action === 'admin.updateOrder') {
    const o = demoDb.orders.find((x) => x.code === payload.code);
    if (o) {
      const { customerType, ...rest } = payload.fields;
      Object.assign(o, rest, customerType ? { customerType: demoDb.options.customerTypes[customerType] } : {}, { updatedAt: new Date().toISOString() });
    }
  } else if (action === 'admin.addLead') {
    const l = payload.lead;
    const id = `LDDEMO${Date.now()}`;
    const row = { time: new Date().toISOString(), id, status: l.status, type: `Nhập tay – ${l.source}`, name: l.name, phone: l.phone, email: l.email, org: l.org, interest: l.interest, note: l.note, internalNote: l.internalNote };
    demoDb.leads.push(row);
    return { ok: true, id, time: row.time, type: row.type, phone: l.phone };
  } else if (action === 'admin.updateLead') {
    const l = demoDb.leads.find((x) => x.id === payload.id);
    if (l) Object.assign(l, payload.fields);
  } else if (action === 'admin.addExpense') {
    const id = `CPDEMO${Date.now()}`;
    const e = payload.expense;
    demoDb.expenses.push({ id, date: `${e.date}T12:00:00+07:00`, category: e.category, amount: e.amount, note: e.note });
    return { ok: true, id };
  } else if (action === 'admin.deleteExpense') {
    demoDb.expenses = demoDb.expenses.filter((x) => x.id !== payload.id);
  } else if (action === 'admin.uploadImage') {
    return { ok: true, url: payload.dataUrl };
  } else if (action === 'admin.saveProduct') {
    const pr = payload.product;
    const id = pr.id || `sp-demo-${Date.now().toString(36)}`;
    const row = { ...pr, id };
    delete row.pricing;
    const i = demoDb.customProducts.findIndex((x) => x.id === id);
    if (i >= 0) demoDb.customProducts[i] = row; else demoDb.customProducts.push(row);
    if (pr.pricing) demoDb.pricing[id] = { name: pr.name, unit: pr.spec, ...pr.pricing };
    return { ok: true, id };
  } else if (action === 'admin.deleteProduct') {
    demoDb.customProducts = demoDb.customProducts.filter((x) => x.id !== payload.id);
    delete demoDb.pricing[payload.id];
  } else if (action === 'admin.saveBrand') {
    const b = payload.brand;
    const id = b.id || (b.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `brand-${Date.now()}`);
    if (!b.id && (brandsData.some((x) => x.id === id) || demoDb.customBrands.some((x) => x.id === id))) throw new Error(`Đã có thương hiệu tên "${b.name}".`);
    const i = demoDb.customBrands.findIndex((x) => x.id === id);
    if (i >= 0) demoDb.customBrands[i] = { ...b, id }; else demoDb.customBrands.push({ ...b, id });
    return { ok: true, id };
  } else if (action === 'admin.deleteBrand') {
    demoDb.customBrands = demoDb.customBrands.filter((x) => x.id !== payload.id);
  } else if (action === 'admin.savePricing') {
    demoDb.pricing = Object.fromEntries(payload.rows.map((r) => [r.id, { ...r }]));
    demoDb.costs = Object.fromEntries(payload.rows.map((r) => [r.id, r.cost]));
  } else if (action === 'admin.saveCosts') {
    demoDb.costs = { ...payload.costs };
  }
  return { ok: true };
}

/* ==========================================================================
   Boot
   ========================================================================== */
initLogin();
bindEvents();
if (state.token && ORDER_ENDPOINT) loadData();
else showLogin('');
