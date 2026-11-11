/**
 * Giá niêm yết theo "Bảng giá phân phối" beVIBE cập nhật 27/08/2026.
 * Key = product id trong translations.js. price tính bằng VNĐ, unit = quy cách theo bảng giá.
 * Sản phẩm không có trong bảng giá sẽ hiển thị "Liên hệ".
 * Khi có bảng giá mới: chỉ cần sửa số ở file này.
 */
export const PRICE_LIST_DATE = '27/08/2026';

// Chiết khấu sỉ mặc định dùng trong Phân hệ B2B (đối tác Vàng). Sửa tại đây nếu chính sách thay đổi.
export const WHOLESALE_DISCOUNT = 0.38;

export const productPrices = {
  // NEURADERM
  'neura-6':  { price: 1350000, unit: 'Tuýp 180g' },      // #1 Medical Device Cream MD
  'neura-8':  { price: 650000,  unit: 'Chai 150ml' },     // #2 Neuro Lacto Toner
  'neura-7':  { price: 1060000, unit: 'Chai 50ml' },      // #3 Neuro Lacto Serum
  'neura-16': { price: 850000,  unit: 'Tuýp 80ml' },      // #4 Neuro Lacto Moisturizer
  'neura-2':  { price: 700000,  unit: 'Chai 100ml' },     // #5 Neuro Daily Calming Mist
  'neura-1':  { price: 460000,  unit: 'Tuýp 100ml' },     // #6 Neuro Daily Calming Cleanser
  'neura-5':  { price: 730000,  unit: 'Tuýp 50ml' },      // #7 Neuro Daily Intensive Sun Cream
  'neura-3':  { price: 1660000, unit: 'Hộp 2 ống x 15ml' },// #8 Core Time Ampoule
  'neura-14': { price: 960000,  unit: 'Hộp 5 miếng' },    // #9 M.BT Cream Lifting Mask

  // MEDIPHARM (Stem C)
  'stemc-1':  { price: 250000,  unit: 'Tuýp 50ml' },      // #10 Stem C BB Cream
  'stemc-3':  { price: 600000,  unit: 'Tuýp 50ml' },      // #18 Stem C Sunblock
  'stemc-4':  { price: 420000,  unit: 'Chai 250ml' },     // #19 Stem C Toner
  'stemc-6':  { price: 420000,  unit: 'Chai 250ml' },     // #19 Stem C Repair Lotion
  'stemc-5':  { price: 420000,  unit: 'Chai 245ml' },     // #20 Stem C Cleansing Water
  'stemc-2':  { price: 1400000, unit: 'Hũ 50ml' },        // #25 Kem dưỡng cấp ẩm TBG Stem C

  // DR.BARGO (31°C)
  'drbargo-1': { price: 420000, unit: 'Chai 150ml' },     // #22 Emulsion
  'drbargo-2': { price: 420000, unit: 'Chai 150ml' },     // #23 Sữa rửa mặt
  'drbargo-4': { price: 420000, unit: 'Chai 400ml' }      // #24 Toner
};

export function formatVnd(n) {
  return `${Number(n).toLocaleString('vi-VN')}đ`;
}
