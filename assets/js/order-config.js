/**
 * Order system configuration.
 *
 * ORDER_ENDPOINT: the Google Apps Script "Web app URL" (ends with /exec) from
 * google-apps-script/Code.gs — see HUONG-DAN-NHAN-DON.md.
 *
 * While it is empty, checkout falls back to sending the order by Zalo / Email.
 */
export const ORDER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz9ZWyWbpLGjPzy_gE6Qx1ZV4zbphyUhkYu17YGN47j41yR2BcmPZo-6BE08HievxQXZQ/exec';

// Give up waiting for the order system after this many milliseconds
export const ORDER_TIMEOUT_MS = 20000;

// Supabase Database Configuration
export const SUPABASE_URL = 'https://snafphkjjobvwrianmpj.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_-rEPHma8u0O1hcoEXZISyg_w-2saGyd';

// Admin Default Password
export const ADMIN_DEFAULT_PASSWORD = 'Bevibe123@';

/**
 * Save order or inquiry to Supabase table `public.orders`
 * @param {Object} row
 * @returns {Promise<boolean>}
 */
export async function sendOrderToSupabase(row) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    });
    return res.ok;
  } catch (err) {
    console.warn('Lỗi lưu Supabase:', err);
    return false;
  }
}

/**
 * Fetch all orders and inquiries from Supabase
 * @returns {Promise<Array>}
 */
export async function fetchOrdersFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('Lỗi lấy dữ liệu Supabase:', err);
    return [];
  }
}

/**
 * Update order or inquiry in Supabase
 * @param {string|number} id
 * @param {Object} fields
 * @returns {Promise<boolean>}
 */
export async function updateOrderInSupabase(id, fields) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !id) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(fields)
    });
    return res.ok;
  } catch (err) {
    console.warn('Lỗi cập nhật Supabase:', err);
    return false;
  }
}
