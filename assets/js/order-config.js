/**
 * Order system configuration.
 *
 * ORDER_ENDPOINT: the Google Apps Script "Web app URL" (ends with /exec) from
 * google-apps-script/Code.gs — see HUONG-DAN-NHAN-DON.md.
 *
 * While it is empty, checkout falls back to sending the order by Zalo / Email.
 */
export const ORDER_ENDPOINT = '';

// Give up waiting for the order system after this many milliseconds
export const ORDER_TIMEOUT_MS = 20000;
