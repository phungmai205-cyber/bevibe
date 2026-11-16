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
