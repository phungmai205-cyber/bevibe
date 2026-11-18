/**
 * Giá niêm yết theo "Bảng giá phân phối" beVIBE cập nhật 27/08/2026.
 * Key = product id trong translations.js. price tính bằng VNĐ, unit = quy cách theo bảng giá.
 * Sản phẩm không có trong bảng giá sẽ hiển thị "Liên hệ".
 * Khi có bảng giá mới: chỉ cần sửa số ở file này.
 */
export const PRICE_LIST_DATE = '27/08/2026';

// Chiết khấu sỉ tham khảo (không còn hiển thị trên web sau khi gỡ Phân hệ B2B).
export const WHOLESALE_DISCOUNT = 0.38;

/**
 * Danh mục đang HẾT HÀNG: mọi sản phẩm thuộc danh mục này hiện dấu "Hết hàng" và không đặt mua được.
 * Có hàng trở lại: xóa id danh mục khỏi danh sách (vd. để trống []).
 * Id danh mục: cleanser, toner, serum, moisturizer, sun, mask, hair (xem catalog-defs.js).
 */
export const SOLD_OUT_CATEGORIES = ['mask'];

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
  'drbargo-1': { price: 420000, unit: 'Chai 130ml' },     // #22 Sữa dưỡng Emulsion Dr Bargo 31 độ C
  'drbargo-2': { price: 420000, unit: 'Tuýp 150ml' },     // #23 Sữa rửa mặt Dr Bargo 31 độ C
  'drbargo-3': { price: 660000, unit: 'Chai 50ml' },      // #26 Serum Niacinamide 20%
  'drbargo-4': { price: 420000, unit: 'Chai 150ml' },     // #24 Toner Dr Bargo 31 độ C
  'drbargo-6': { price: 510000, unit: 'Tuýp 30ml' },      // DBB LAB Kojic Acid Dipalmitate Cream 30 mL
  'drbargo-7': { price: 510000, unit: 'Tuýp 15ml' },      // Whitening Cream Alpha Arbutin 7% Cream 15mL

  // SMIB (Hair & Scalp Care)
  'smib-5': { price: 740000, unit: 'Chai 500ml' },        // SMIB INNABI SHAMPOO
  'smib-6': { price: 740000, unit: 'Chai 500ml' },        // SMIB INNABI TREATMENT
  'smib-7': { price: 689000, unit: 'Chai xịt 115ml' },    // SMIB INNABI SCALP ESSENCE
  'smib-3': { price: 580000, unit: 'Chai 400ml' },        // SMIB LACTO BIO REPAIR SHAMPOO 400ml
  'smib-1': { price: 565000, unit: 'Chai 200ml' },        // SMIB LACTO BIO COLOR CHANGE SHAMPOO BLACK
  'smib-2': { price: 565000, unit: 'Chai 200ml' },        // SMIB LACTO BIO COLOR CHANGE SHAMPOO BROWN
  'smib-8': { price: 520000, unit: 'Hũ 400g' },           // SMIB LACTO BIO SILK HAIR TREATMENT

  // THỰC PHẨM CHỨC NĂNG · VN Healing Farm
  'hoat-luc-truong-tho': { price: 3500000, unit: '3,75g × 50 viên / hộp' },
  'd-tox-slim':          { price: 2800000, unit: '80ml × 30 gói / hộp' },
  'hong-sam-6-nam-tuoi': { price: 1200000, unit: '10g × 30 gói / hộp' },
  'khop-chac-khoe':      { price: 3000000, unit: '70ml × 30 gói / hộp' },
};

/**
 * "Sản phẩm bán chạy" trên trang chủ: thứ tự do biên tập chọn (chưa có số liệu bán hàng thật).
 * Sửa danh sách id (theo translations.js) để đổi sản phẩm hiển thị.
 */
export const BEST_SELLER_IDS = ['drbargo-3', 'neura-3', 'neura-7', 'neura-6', 'neura-8', 'neura-14', 'neura-5', 'neura-1'];

/** Ảnh riêng cho thẻ sản phẩm ở mục "Best Sellers" (không đổi ảnh ở các trang khác) */
export const BEST_SELLER_IMAGES = {
  'drbargo-1': '/assets/images/bestseller/drbargo-emulsion.png',
  'drbargo-3': '/assets/images/bestseller/drbargo-serum.png',
  'drbargo-4': '/assets/images/bestseller/drbargo-toner.png',
  'drbargo-2': '/assets/images/bestseller/drbargo-foam-cleansing.png'
};

/** Ảnh thứ hai hiện khi rê chuột lên thẻ Best Sellers */
export const BEST_SELLER_HOVER = {
  'drbargo-3': '/assets/images/dr-bargo/dr.bargo_serum.jpg',
  'neura-3': '/assets/images/neuraderm/hero_coretime.webp',
  'neura-7': '/assets/images/neuraderm/neuraderm_serum_03.webp',
  'neura-6': '/assets/images/neuraderm/md_cream_neura_1_.png',
  'neura-8': '/assets/images/neuraderm/neuraderm_toner_04.webp',
  'neura-5': '/assets/images/neuraderm/kem_chong_nang_neuraderm_03.jpg',
  'neura-1': '/assets/images/neuraderm/sua_rua_mat_01.webp'
};

/** Tab lọc của mục Best Sellers (ids: null = tất cả) */
export const BEST_SELLER_TABS = [
  { id: 'all', vi: 'Tất cả', ko: '전체', ids: null },
  { id: 'serum', vi: 'Serum & Ampoule', ko: '세럼 & 앰플', ids: ['drbargo-3', 'neura-3', 'neura-7'] },
  { id: 'care', vi: 'Dưỡng da & Mặt nạ', ko: '스킨케어 & 마스크', ids: ['neura-6', 'neura-8', 'neura-14', 'neura-5', 'neura-1'] }
];

/** "Khám phá thêm dòng sản phẩm bán chạy": ô ảnh lớn → trang dòng sản phẩm */
export const HOME_EXPLORE_LINES = [
  { brand: 'dr-bargo', line: 'drbargo-31c', image: '/assets/images/dr-bargo/dr.bargo_serum.jpg', vi: 'Dr.BARGO Serum 31°C', ko: 'Dr.BARGO 세럼 31°C', subVi: 'Niacinamide 20% + 5 Cica', subKo: '나이아신아마이드 20% + 5 시카' },
  { brand: 'neuraderm', line: 'neura-basic', image: '/assets/images/neuraderm/hero_coretime.webp', vi: 'NEURADERM Coretime', ko: '뉴라덤 코어타임', subVi: 'Basic Derma · Ampoule trẻ hóa', subKo: 'Basic Derma · 안티에이징 앰플' },
  { brand: 'neuraderm', line: 'neura-clinic', image: '/assets/images/neuraderm/neuraderm_serum_03.webp', vi: 'NEURADERM Neuro Lacto', ko: '뉴라덤 뉴로 락토', subVi: 'Clinic Derma · Phục hồi da', subKo: 'Clinic Derma · 피부 회복' },
  { brand: 'neuraderm', line: 'neura-basic', image: '/assets/images/neuraderm/neura_mask_01.webp', vi: 'NEURADERM M.BT Mask', ko: '뉴라덤 M.BT 마스크', subVi: 'Mặt nạ nâng cơ, cấp ẩm', subKo: '리프팅 · 수분 마스크' },
  { brand: 'medipharm', line: 'medipharm-stemc', image: '/assets/images/stem-c/stem_c_-_toner.jpg', vi: 'MediPharm Stem C', ko: '메디팜 스템씨', subVi: 'Tế bào gốc tái tạo da', subKo: '줄기세포 스킨케어' },
  { brand: 'smib', line: 'smib-colorchange', image: '/assets/images/smib/prod_1.jpg', vi: 'SMIB Color Change', ko: 'SMIB 컬러 체인지', subVi: 'Dầu gội phủ bạc tự nhiên', subKo: '새치 커버 샴푸' }
];

/** Thương hiệu hiển thị ở mục "Sản phẩm phân phối chính hãng" trên trang chủ */
export const HOME_OFFICIAL_BRAND = 'dr-bargo';

export function formatVnd(n) {
  return `${Number(n).toLocaleString('vi-VN')}đ`;
}
