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
