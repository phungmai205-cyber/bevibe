/**
 * Product categories shared by the website (app.js) and the admin page (admin.js).
 * The ids are also accepted by the order system (Code.gs → CONFIG.CATEGORY_IDS).
 */
export const CATEGORY_DEFS = [
  { id: 'cleanser', vi: 'Sữa rửa mặt', ko: '클렌저' },
  { id: 'toner', vi: 'Toner & Xịt khoáng', ko: '토너 & 미스트' },
  { id: 'serum', vi: 'Serum & Ampoule', ko: '세럼 & 앰플' },
  { id: 'moisturizer', vi: 'Kem & Sữa dưỡng', ko: '크림 & 에멀전' },
  { id: 'sun', vi: 'Chống nắng & BB', ko: '선케어 & BB' },
  { id: 'mask', vi: 'Mặt nạ', ko: '마스크팩' },
  { id: 'hair', vi: 'Tóc & Da đầu', ko: '헤어 & 두피' }
];

// Same rule the website uses for built-in products without an explicit category
export function detectCategory(viName, brandId) {
  if (brandId === 'smib') return 'hair';
  const n = String(viName || '').toLowerCase();
  if (/sun|bb cream/.test(n)) return 'sun';
  if (/mask/.test(n)) return 'mask';
  if (/cleansing|foam/.test(n)) return 'cleanser';
  if (/toner|mist/.test(n)) return 'toner';
  if (/serum|ampoule|essence/.test(n)) return 'serum';
  return 'moisturizer';
}
