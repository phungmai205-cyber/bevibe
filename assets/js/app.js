/**
 * beVIBE - Interactive Web Application Logic
 * Korean Aesthetic & B2B Cosmetic Partnership Platform
 */
import { i18nData, brandsData, servicesDetailsData } from './translations.js';
import { blogPosts, blogCategories, popularSlugs, trendCategoryIds } from './blog.js';
import { productPrices, formatVnd, BEST_SELLER_IDS, BEST_SELLER_IMAGES, BEST_SELLER_HOVER, BEST_SELLER_TABS, HOME_EXPLORE_LINES, HOME_OFFICIAL_BRAND } from './prices.js';
import { CONCERN_DEFS, CONCERN_TAGS, initShop } from './shop.js';
import { initAccount } from './account.js';
import { buildSearchEntry, searchIndex } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentLang = localStorage.getItem('bevibe_lang') || 'vi';
  let currentActiveBrandId = 'dr-bargo';
  let currentActiveServiceId = 'distribution';
  let account = null; // customer accounts (account.js) — set by initAccount()
  let shop = null; // storefront module (cart, product page, skin concerns) — set by initShop()

  // --- Elements ---
  const langToggleBtn = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const brandsGrid = document.getElementById('brandsGrid');
  const productCatalogGrid = document.getElementById('productCatalogGrid');
  const inquiryForm = document.getElementById('inquiryForm');
  const formResultArea = document.getElementById('formResultArea');
  const proposalTextarea = document.getElementById('proposalTextarea');
  const copyProposalBtn = document.getElementById('copyProposalBtn');
  const sendZaloBtn = document.getElementById('sendZaloBtn');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  const toastNotification = document.getElementById('toastNotification');

  // OEM Steps
  const stepItems = document.querySelectorAll('.step-card');

  // --- Modals Elements ---
  const brandDetailModal = document.getElementById('brandDetailModal');
  const closeBrandModalBtn = document.getElementById('closeBrandModalBtn');
  const closeBrandModalFooterBtn = document.getElementById('closeBrandModalFooterBtn');
  const modalRequestBrandQuoteBtn = document.getElementById('modalRequestBrandQuoteBtn');

  const serviceDetailModal = document.getElementById('serviceDetailModal');
  const productDetailModal = document.getElementById('productDetailModal');
  const closeProductModalBtn = document.getElementById('closeProductModalBtn');
  const closeProductModalFooterBtn = document.getElementById('closeProductModalFooterBtn');
  const prodModalRequestQuoteBtn = document.getElementById('prodModalRequestQuoteBtn');
  const prodModalExtraLink = document.getElementById('prodModalExtraLink');
  const productModalBody = document.getElementById('productModalBody');
  const prodModalBrandBadge = document.getElementById('prodModalBrandBadge');
  let currentActiveProductId = null;
  const closeServiceModalBtn = document.getElementById('closeServiceModalBtn');
  const closeServiceModalFooterBtn = document.getElementById('closeServiceModalFooterBtn');
  const modalRequestServiceQuoteBtn = document.getElementById('modalRequestServiceQuoteBtn');

  // --- Functions ---

  /**
   * Translate the entire application based on currentLang
   */
  function applyTranslations() {
    const t = i18nData[currentLang];
    if (!t) return;

    document.documentElement.lang = currentLang;
    document.title = t.metaTitle;

    // Update text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.innerHTML = t[key];
      }
    });

    // Update input placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const key = el.getAttribute('data-i18n-ph');
      if (t[key]) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Update language button text
    if (langToggleBtn) {
      langToggleBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span>${currentLang === 'vi' ? 'KR · 한국어' : 'VN · Tiếng Việt'}</span>
      `;
      langToggleBtn.setAttribute('aria-label', currentLang === 'vi' ? 'Chuyển sang tiếng Hàn' : 'Switch to Vietnamese');
    }
    if (langToggleMobile) {
      langToggleMobile.textContent = currentLang === 'vi' ? 'KR · 한국어' : 'VN · Tiếng Việt';
    }

    // Re-render brands with new language
    renderBrands();

    // Re-render navigation, product catalog & trend tags with new language
    renderNavigation();
    renderProductCatalog();
    renderTrendTags();
    if (searchDropdown && !searchDropdown.hidden) renderSearchDropdown();
    if (typeof renderPageHero === 'function') renderPageHero();
    if (shop) shop.refresh(currentRoute && currentRoute.page === 'product' ? currentRoute.productId : null);
    if (account) account.refresh();

    // Update modal if currently opened
    if (brandDetailModal && brandDetailModal.classList.contains('active')) {
      openBrandModal(currentActiveBrandId);
    }
    if (serviceDetailModal && serviceDetailModal.classList.contains('active')) {
      openServiceModal(currentActiveServiceId);
    }

    // Save preference
    localStorage.setItem('bevibe_lang', currentLang);
  }

  /* ==========================================================================
     Catalogue model: categories, product index, filters & search
     ========================================================================== */
  const CATEGORY_DEFS = [
    { id: 'cleanser', vi: 'Sữa rửa mặt', ko: '클렌저' },
    { id: 'toner', vi: 'Toner & Xịt khoáng', ko: '토너 & 미스트' },
    { id: 'serum', vi: 'Serum & Ampoule', ko: '세럼 & 앰플' },
    { id: 'moisturizer', vi: 'Kem & Sữa dưỡng', ko: '크림 & 에멀전' },
    { id: 'sun', vi: 'Chống nắng & BB', ko: '선케어 & BB' },
    { id: 'mask', vi: 'Mặt nạ', ko: '마스크팩' },
    { id: 'hair', vi: 'Tóc & Da đầu', ko: '헤어 & 두피' }
  ];

  const TREND_TERMS = {
    vi: ['Kem chống nắng', 'Serum phục hồi', 'Dầu gội', 'Men vi sinh', 'Tế bào gốc', 'Mặt nạ', 'Ceramide', 'Toner'],
    ko: ['선크림', '세럼', '샴푸', '포스트바이오틱스', '줄기세포', '마스크', 'Ceramide', '토너']
  };

  const catalogState = { brand: 'all', line: 'all', category: 'all', query: '', expanded: false };
  // Products page sidebar filters (multi-select)
  const pageFilter = { cats: new Set(), brands: new Set(), lines: new Set(), concerns: new Set() };

  function getLine(brandId, lineId) {
    const brand = brandsData.find((b) => b.id === brandId);
    return brand && brand.lines ? brand.lines.find((l) => l.id === lineId) : null;
  }

  function lineLabel(brandId, lineId) {
    const line = getLine(brandId, lineId);
    if (!line) return '';
    return currentLang === 'vi' ? line.nameVi : line.nameKo;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function normalizeText(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd');
  }

  function detectCategory(viName, brandId) {
    if (brandId === 'smib') return 'hair';
    const n = viName.toLowerCase();
    if (/sun|bb cream/.test(n)) return 'sun';
    if (/mask/.test(n)) return 'mask';
    if (/cleansing|foam/.test(n)) return 'cleanser';
    if (/toner|mist/.test(n)) return 'toner';
    if (/serum|ampoule|essence/.test(n)) return 'serum';
    return 'moisturizer';
  }

  function categoryLabel(catId) {
    const def = CATEGORY_DEFS.find((c) => c.id === catId);
    if (!def) return '';
    return currentLang === 'vi' ? def.vi : def.ko;
  }

  // Bilingual index: one entry per product id, built once.
  const productIndex = [];
  brandsData.forEach((brand) => {
    brand.productsVi.forEach((pVi) => {
      const pKo = (brand.productsKo || []).find((x) => x.id === pVi.id) || pVi;
      const category = detectCategory(pVi.name, brand.id);
      const def = CATEGORY_DEFS.find((c) => c.id === category);
      const line = (brand.lines || []).find((l) => l.id === pVi.line) || {};
      productIndex.push({
        id: pVi.id,
        brandId: brand.id,
        brandName: brand.name,
        line: pVi.line || '',
        category,
        vi: pVi,
        ko: pKo,
        price: productPrices[pVi.id] ? productPrices[pVi.id].price : null,
        priceUnit: productPrices[pVi.id] ? productPrices[pVi.id].unit : '',
        image: pVi.image || pKo.image || brand.coverImage || '/assets/images/hero.jpg',
        hasVideo: !!(pVi.video || pKo.video),
        strong: normalizeText([pVi.name, pKo.name, brand.name, line.nameVi, line.nameKo].join(' ')),
        medium: normalizeText([pVi.tag, pKo.tag, def.vi, def.ko, brand.badge].join(' ')),
        weak: normalizeText([pVi.desc, pKo.desc, pVi.spec].join(' '))
      });
    });
  });

  // Skin-concern tags (shop.js) — used by the products filter, search and the skin-care section
  productIndex.forEach((e) => {
    e.concerns = CONCERN_TAGS[e.id] || [];
    e.medium += ' ' + normalizeText(e.concerns.map((cid) => {
      const c = CONCERN_DEFS.find((d) => d.id === cid);
      return c ? `${c.vi} ${c.ko}` : '';
    }).join(' '));
  });

  function localized(entry) {
    const p = currentLang === 'vi' ? entry.vi : entry.ko;
    // Quy cách theo bảng giá (nếu có) để giá và dung tích luôn khớp nhau
    return { ...entry, name: p.name, tag: p.tag, spec: entry.priceUnit || p.spec };
  }

  // Search index (search.js): product names, type line, concerns and descriptions in both languages
  const searchItems = productIndex.map((e) => {
    const brand = brandsData.find((b) => b.id === e.brandId) || {};
    const line = (brand.lines || []).find((l) => l.id === e.line) || {};
    const def = CATEGORY_DEFS.find((c) => c.id === e.category) || {};
    const concernLabels = e.concerns.map((cid) => CONCERN_DEFS.find((d) => d.id === cid)).filter(Boolean).flatMap((c) => [c.vi, c.ko]);
    return {
      entry: e,
      s: buildSearchEntry({
        name: [e.vi.name, e.ko.name, e.brandName, line.nameVi, line.nameKo],
        type: [e.vi.tag, e.ko.tag, def.vi, def.ko],
        meta: [brand.badge, e.vi.spec, e.ko.spec, e.priceUnit, ...concernLabels],
        body: [e.vi.desc, e.ko.desc],
        kind: [e.vi.name, e.ko.name, e.vi.tag, e.ko.tag]
      }, e.category)
    };
  });

  function searchProducts(query) {
    return searchIndex(searchItems, query);
  }

  function getFilteredProducts() {
    const base = catalogState.query ? searchProducts(catalogState.query) : productIndex;
    return base.filter((e) =>
      (catalogState.brand === 'all' || e.brandId === catalogState.brand) &&
      (catalogState.line === 'all' || e.line === catalogState.line) &&
      (catalogState.category === 'all' || e.category === catalogState.category)
    );
  }

  /**
   * Brand tiles (compact, logo-grid style)
   */
  function renderBrands() {
    if (!brandsGrid) return;
    const isVi = currentLang === 'vi';
    brandsGrid.innerHTML = brandsData.map((b) => {
      const count = b.productsVi.length;
      const desc = isVi ? b.descVi : b.descKo;
      return `
        <article class="brand-tile">
          <button type="button" class="brand-tile-media" data-action="brand-products" data-brand-id="${b.id}" aria-label="${b.name}">
            <img src="${b.coverImage || '/assets/images/hero.jpg'}" alt="${b.name}" loading="lazy">
            <span class="brand-tile-count">${count} ${isVi ? 'sản phẩm' : '개 품목'}</span>
          </button>
          <div class="brand-tile-body">
            <span class="brand-tile-badge">${b.badge}</span>
            <h3 class="brand-tile-name">${b.name}</h3>
            <p class="brand-tile-desc">${desc}</p>
            ${(b.lines || []).length ? `
              <div class="brand-tile-lines">
                <span class="brand-tile-lines-label">${isVi ? 'Dòng sản phẩm' : '제품 라인'}</span>
                ${b.lines.map((l) => {
                  const n = b.productsVi.filter((p) => p.line === l.id).length;
                  return `<button type="button" class="line-chip" data-action="line" data-brand-id="${b.id}" data-line="${l.id}">${isVi ? l.nameVi : l.nameKo} <span>${n}</span></button>`;
                }).join('')}
              </div>
            ` : ''}
            <div class="brand-tile-actions">
              <button type="button" class="brand-tile-primary" data-action="brand-products" data-brand-id="${b.id}">
                ${isVi ? 'Xem chi tiết →' : '자세히 보기 →'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * Header mega menu, category dropdown, mobile drawer brand list
   */
  function renderNavigation() {
    const isVi = currentLang === 'vi';
    const megaBrands = document.getElementById('megaBrands');
    if (megaBrands) {
      megaBrands.innerHTML = `
        <div class="container mega-inner">
          ${brandsData.map((b) => `
              <div class="mega-col">
                <button type="button" class="mega-brand" data-action="brand-products" data-brand-id="${b.id}">
                  <img src="${b.coverImage || '/assets/images/hero.jpg'}" alt="" loading="lazy">
                  <span><strong>${b.name}</strong><small>${b.badge}</small></span>
                </button>
              </div>
            `).join('')}
        </div>
      `;
    }

    const navCategoryMenu = document.getElementById('navCategoryMenu');
    if (navCategoryMenu) {
      navCategoryMenu.innerHTML = CATEGORY_DEFS.map((c) => {
        const count = productIndex.filter((e) => e.category === c.id).length;
        return `
          <button type="button" class="hnav-dd-item" data-action="category" data-category="${c.id}">
            <span>${isVi ? c.vi : c.ko}</span><span class="hnav-dd-badge">${count}</span>
          </button>
        `;
      }).join('');
    }

    const drawerBrandList = document.getElementById('drawerBrandList');
    if (drawerBrandList) {
      drawerBrandList.innerHTML = brandsData.map((b) => `
        <button type="button" class="drawer-brand" data-action="brand-products" data-brand-id="${b.id}">
          <img src="${b.coverImage || '/assets/images/hero.jpg'}" alt="" loading="lazy">
          <span>${b.name}</span>
        </button>
      `).join('');
    }
  }

  /**
   * Category rail (circle thumbnails) + brand tabs
   */
  function renderCatalogFilters() {
    const isVi = currentLang === 'vi';
    const rail = document.getElementById('categoryRail');
    if (rail) {
      const items = [{ id: 'all', vi: 'Tất cả', ko: '전체' }, ...CATEGORY_DEFS];
      rail.innerHTML = items.map((c) => {
        const inCat = c.id === 'all' ? productIndex : productIndex.filter((e) => e.category === c.id);
        const thumb = inCat[0] ? inCat[0].image : '/assets/images/lineup.jpg';
        return `
          <button type="button" class="category-chip ${catalogState.category === c.id ? 'active' : ''}" data-action="category" data-category="${c.id}">
            <span class="category-chip-img"><img src="${thumb}" alt="" loading="lazy"></span>
            <span class="category-chip-label">${isVi ? c.vi : c.ko}</span>
            <span class="category-chip-count">${inCat.length}</span>
          </button>
        `;
      }).join('');
    }

    const tabs = document.getElementById('catalogTabsGroup');
    if (tabs) {
      const unit = isVi ? 'SP' : '개';
      const tabItems = [{ id: 'all', name: isVi ? 'Tất cả' : '전체', count: productIndex.length },
        ...brandsData.map((b) => ({ id: b.id, name: b.name, count: b.productsVi.length }))];
      tabs.innerHTML = tabItems.map((t) => `
        <button type="button" class="catalog-tab-btn ${catalogState.brand === t.id ? 'active' : ''}" data-action="brand-tab" data-brand-id="${t.id}">
          ${t.name} <span class="catalog-tab-count">${t.count} ${unit}</span>
        </button>
      `).join('');
    }

    // Line chips: only when one brand is selected and it has product lines
    let lineRow = document.getElementById('catalogLineRow');
    if (!lineRow && tabs) {
      lineRow = document.createElement('div');
      lineRow.id = 'catalogLineRow';
      lineRow.className = 'catalog-line-row';
      tabs.insertAdjacentElement('afterend', lineRow);
    }
    if (lineRow) {
      const brand = brandsData.find((b) => b.id === catalogState.brand);
      const lines = brand && brand.lines ? brand.lines : [];
      lineRow.hidden = lines.length === 0;
      lineRow.innerHTML = lines.length ? `
        <span class="catalog-line-label">${isVi ? 'Dòng sản phẩm:' : '제품 라인:'}</span>
        <button type="button" class="line-chip ${catalogState.line === 'all' ? 'active' : ''}" data-action="line" data-brand-id="${brand.id}" data-line="all">${isVi ? 'Tất cả' : '전체'} <span>${brand.productsVi.length}</span></button>
        ${lines.map((l) => `
          <button type="button" class="line-chip ${catalogState.line === l.id ? 'active' : ''}" data-action="line" data-brand-id="${brand.id}" data-line="${l.id}">
            ${isVi ? l.nameVi : l.nameKo} <span>${brand.productsVi.filter((p) => p.line === l.id).length}</span>
          </button>
        `).join('')}
      ` : '';
    }
  }

  function productCardHtml(entry) {
    const isVi = currentLang === 'vi';
    const p = localized(entry);
    return `
      <article class="pcard" data-action="product-modal" data-product-id="${p.id}" tabindex="0">
        <div class="pcard-media">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
          <span class="pcard-badge-brand">${p.brandName}</span>
          ${p.hasVideo ? `<span class="pcard-badge-video"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Video</span>` : ''}
        </div>
        <div class="pcard-body">
          <span class="pcard-cat">${[lineLabel(p.brandId, p.line), categoryLabel(p.category)].filter(Boolean).join(' · ')}</span>
          <h3 class="pcard-title">${p.name}</h3>
          <p class="pcard-tag">${p.tag || ''}</p>
          <span class="pcard-spec">${p.spec || ''}</span>
          <div class="pcard-foot">
            <div class="pcard-price">
              <small>${isVi ? 'Giá niêm yết' : '정가'}</small>
              <strong>${p.price ? formatVnd(p.price) : (isVi ? 'Liên hệ' : '문의')}</strong>
            </div>
            ${p.price ? `
              <button type="button" class="pcard-cart" data-shop="add" data-product-id="${p.id}" aria-label="${isVi ? 'Thêm vào giỏ' : '장바구니 담기'}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                <span>${isVi ? 'Thêm vào giỏ' : '담기'}</span>
              </button>` : `
              <button type="button" class="pcard-quote" data-action="product-quote" data-product-name="${escapeHtml(p.name)}" data-brand-name="${p.brandName}">
                ${isVi ? 'Báo giá sỉ' : '견적 요청'}
              </button>`}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Product catalogue: carousel by default, grid when expanded / filtered by search
   */
  /**
   * Home showcases: "Sản phẩm bán chạy" + Dr.BARGO slider in "Sản phẩm phân phối chính hãng"
   */
  // Few products would leave a gap in the endless slider: repeat them to fill it
  const loopFill = (list) => (list.length && list.length < 8 ? [...list, ...list] : list);

  // ---------- Home (whoo-style): line stickers · Best Sellers with tabs · explore line tiles ----------
  let bestSellerTab = 'all';

  function renderHomeLines() {
    const track = document.getElementById('homeLinesTrack');
    if (!track) return;
    const isVi = currentLang === 'vi';
    const items = [];
    brandsData.forEach((b) => (b.lines || []).forEach((l) => {
      const first = productIndex.find((e) => e.brandId === b.id && e.line === l.id);
      if (!first) return;
      const img = BEST_SELLER_IMAGES[first.id] || first.image;
      items.push(`
        <button type="button" class="hline" data-action="line" data-brand-id="${b.id}" data-line="${l.id}">
          <span class="hline-img"><img src="${img}" alt="" loading="lazy"></span>
          <span class="hline-brand">${escapeHtml(b.name)}</span>
          <span class="hline-name">${escapeHtml(isVi ? l.nameVi : l.nameKo)}</span>
        </button>`);
    }));
    track.innerHTML = items.join('');
  }

  function bestCardHtml(entry, rank) {
    const isVi = currentLang === 'vi';
    const p = localized(entry);
    const img = BEST_SELLER_IMAGES[p.id] || p.image;
    const hover = BEST_SELLER_HOVER[p.id];
    return `
      <article class="bs-card" data-action="product-modal" data-product-id="${p.id}" tabindex="0">
        <div class="bs-card-media ${hover ? 'has-hover' : ''}">
          <img class="bs-img-main" src="${img}" alt="${escapeHtml(p.name)}" loading="lazy">
          ${hover ? `<img class="bs-img-hover" src="${hover}" alt="" loading="lazy">` : ''}
          <span class="bs-rank">TOP ${rank}</span>
          ${p.price ? `<button type="button" class="bs-cart" data-shop="add" data-product-id="${p.id}" aria-label="${isVi ? 'Thêm vào giỏ' : '장바구니 담기'}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          </button>` : ''}
        </div>
        <div class="bs-card-body">
          <span class="bs-card-brand">${escapeHtml(p.brandName)}</span>
          <h3 class="bs-card-name">${p.name}</h3>
          <p class="bs-card-price">${p.price ? formatVnd(p.price) : (isVi ? 'Liên hệ' : '문의')}${p.spec ? `<small>${escapeHtml(p.spec)}</small>` : ''}</p>
          <div class="bs-card-actions">
            <button type="button" class="bs-btn bs-btn-detail">${isVi ? 'Xem chi tiết' : '상세 보기'}</button>
            <button type="button" class="bs-btn bs-btn-quick" data-action="product-quick" data-product-id="${p.id}">${isVi ? 'Xem nhanh' : '빠른 보기'}</button>
          </div>
        </div>
      </article>`;
  }

  function renderBestSellers() {
    const grid = document.getElementById('bestSellerTrack');
    if (!grid) return;
    const isVi = currentLang === 'vi';
    const tabsEl = document.getElementById('bestSellerTabs');
    const all = BEST_SELLER_IDS.map((id) => productIndex.find((e) => e.id === id)).filter(Boolean);
    if (tabsEl) {
      tabsEl.innerHTML = BEST_SELLER_TABS.map((t) => `
        <button type="button" role="tab" class="bs-tab ${bestSellerTab === t.id ? 'active' : ''}" aria-selected="${bestSellerTab === t.id}" data-action="bs-tab" data-tab="${t.id}">${isVi ? t.vi : t.ko}</button>`).join('');
    }
    const tab = BEST_SELLER_TABS.find((t) => t.id === bestSellerTab) || BEST_SELLER_TABS[0];
    const list = tab.ids ? all.filter((e) => tab.ids.includes(e.id)) : all;
    grid.innerHTML = list.map((e) => bestCardHtml(e, BEST_SELLER_IDS.indexOf(e.id) + 1)).join('');
  }

  function renderExploreLines() {
    const grid = document.getElementById('exploreGrid');
    if (!grid) return;
    const isVi = currentLang === 'vi';
    grid.innerHTML = HOME_EXPLORE_LINES.map((t) => `
      <button type="button" class="explore-tile" data-action="line" data-brand-id="${t.brand}" data-line="${t.line}">
        <img src="${t.image}" alt="${escapeHtml(isVi ? t.vi : t.ko)}" loading="lazy">
        <span class="explore-tile-body">
          <strong>${escapeHtml(isVi ? t.vi : t.ko)}</strong>
          <small>${escapeHtml(isVi ? t.subVi : t.subKo)}</small>
          <span class="explore-tile-cta">${isVi ? 'Khám phá' : '자세히 보기'} →</span>
        </span>
      </button>`).join('');
  }

  function renderHomeShowcases() {
    renderHomeLines();
    renderBestSellers();
    renderExploreLines();
    // "Top tìm kiếm": Dr.BARGO products as round image + name
    const top = document.getElementById('topSearchTrack');
    if (top) {
      const list = productIndex.filter((e) => e.brandId === HOME_OFFICIAL_BRAND).map(localized);
      top.innerHTML = loopFill(list).map((p) => `
        <article class="tcard" data-action="product-modal" data-product-id="${p.id}" tabindex="0">
          <div class="tcard-media"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
          <h3 class="tcard-name">${p.name}</h3>
        </article>`).join('');
    }
    const official = document.getElementById('homeOfficialTrack');
    if (official) {
      const list = getFilteredProducts();
      official.innerHTML = list.length
        ? loopFill(list).map(productCardHtml).join('')
        : `<p class="showcase-empty">${currentLang === 'vi' ? 'Chưa có sản phẩm phù hợp.' : '해당 제품이 없습니다.'}</p>`;
    }
  }

  // Endless slider: next moves the first card to the end, prev brings the last card to the front
  function slideShowcase(track, dir) {
    if (!track || track.dataset.busy) return;
    const items = Array.from(track.children);
    if (items.length < 2) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const step = items[0].getBoundingClientRect().width + gap;
    const ease = 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1)';
    track.dataset.busy = '1';
    if (dir > 0) {
      items.forEach((c) => { c.style.transition = ease; c.style.transform = `translateX(${-step}px)`; });
      setTimeout(() => {
        items.forEach((c) => { c.style.transition = 'none'; c.style.transform = ''; });
        track.appendChild(items[0]);
        void track.offsetWidth;
        items.forEach((c) => { c.style.transition = ''; });
        delete track.dataset.busy;
      }, 460);
    } else {
      track.insertBefore(items[items.length - 1], items[0]);
      const now = Array.from(track.children);
      now.forEach((c) => { c.style.transition = 'none'; c.style.transform = `translateX(${-step}px)`; });
      void track.offsetWidth;
      now.forEach((c) => { c.style.transition = ease; c.style.transform = ''; });
      setTimeout(() => {
        now.forEach((c) => { c.style.transition = ''; });
        delete track.dataset.busy;
      }, 460);
    }
  }

  document.querySelectorAll('[data-showcase-dir]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      slideShowcase(document.getElementById(btn.getAttribute('data-showcase-target')), Number(btn.getAttribute('data-showcase-dir')));
    });
  });
  // Swipe on touch screens
  document.querySelectorAll('.showcase-track').forEach((track) => {
    let startX = null;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) slideShowcase(track, dx < 0 ? 1 : -1);
    });
  });

  function renderProductCatalog() {
    renderHomeShowcases();
    if (!productCatalogGrid) return;
    if (isFilterPage()) { renderFilterPage(); return; }
    const isVi = currentLang === 'vi';
    const list = getFilteredProducts();
    const selectedBrand = brandsData.find((b) => b.id === catalogState.brand);
    // One brand selected without narrower filters → show it grouped by product line
    const grouped = !!(selectedBrand && selectedBrand.lines && selectedBrand.lines.length &&
      catalogState.line === 'all' && catalogState.category === 'all' && !catalogState.query);
    const useGrid = grouped || catalogState.expanded || !!catalogState.query || (selectedBrand && catalogState.line !== 'all');

    renderCatalogFilters();

    productCatalogGrid.classList.toggle('is-carousel', !useGrid);
    productCatalogGrid.classList.toggle('is-grid', useGrid && !grouped);
    productCatalogGrid.classList.toggle('is-grouped', grouped);

    if (grouped) {
      productCatalogGrid.innerHTML = selectedBrand.lines.map((l) => {
        const items = list.filter((e) => e.line === l.id);
        if (!items.length) return '';
        return `
          <section class="line-group">
            <div class="line-group-head">
              <div>
                <span class="line-group-brand">${selectedBrand.name}</span>
                <h3 class="line-group-title">${isVi ? l.nameVi : l.nameKo} <span>${items.length} ${isVi ? 'sản phẩm' : '개 제품'}</span></h3>
                <p class="line-group-desc">${isVi ? l.descVi : l.descKo}</p>
              </div>
            </div>
            <div class="line-group-grid">${items.map(productCardHtml).join('')}</div>
          </section>
        `;
      }).join('');
    } else if (!list.length) {
      productCatalogGrid.innerHTML = `
        <div class="catalog-empty">
          <p>${isVi ? 'Chưa có sản phẩm phù hợp với bộ lọc hiện tại.' : '현재 필터에 맞는 제품이 없습니다.'}</p>
          <button type="button" class="btn-secondary" data-action="reset-filters">${isVi ? 'Xem toàn bộ sản phẩm' : '전체 제품 보기'}</button>
        </div>
      `;
    } else {
      productCatalogGrid.innerHTML = list.map(productCardHtml).join('');
    }
    productCatalogGrid.scrollLeft = 0;

    // Result meta + active filter chips
    const meta = document.getElementById('catalogResultMeta');
    if (meta) {
      const chips = [];
      if (catalogState.query) chips.push({ key: 'query', label: `“${escapeHtml(catalogState.query)}”` });
      if (catalogState.category !== 'all') chips.push({ key: 'category', label: categoryLabel(catalogState.category) });
      if (catalogState.brand !== 'all') {
        const b = brandsData.find((x) => x.id === catalogState.brand);
        if (b) chips.push({ key: 'brand', label: b.name });
      }
      if (catalogState.line !== 'all') chips.push({ key: 'line', label: lineLabel(catalogState.brand, catalogState.line) });
      meta.innerHTML = `
        <span>${isVi ? `Hiển thị <strong>${list.length}</strong> sản phẩm` : `<strong>${list.length}</strong>개 제품`}</span>
        ${chips.map((c) => `<button type="button" class="filter-chip" data-action="clear-filter" data-filter="${c.key}">${c.label} <span aria-hidden="true">✕</span></button>`).join('')}
      `;
    }

    const viewAllBtn = document.getElementById('catalogViewAllBtn');
    if (viewAllBtn) {
      viewAllBtn.hidden = !!selectedBrand && currentRoute.page !== 'home';
      viewAllBtn.textContent = useGrid
        ? (isVi ? 'Thu gọn ↑' : '접기 ↑')
        : (isVi ? `Xem tất cả (${list.length}) →` : `전체 보기 (${list.length}) →`);
    }
    document.querySelectorAll('#catalogPrev, #catalogNext').forEach((btn) => {
      btn.hidden = useGrid || list.length === 0;
    });
  }

  function scrollToProducts() {
    const target = document.getElementById('products');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  function setCatalogFilter(partial, { scroll = true } = {}) {
    Object.assign(catalogState, partial);
    renderProductCatalog();
    if (scroll) scrollToProducts();
  }

  /**
   * Trending search tags
   */
  function renderTrendTags() {
    const wrap = document.getElementById('trendTags');
    if (!wrap) return;
    const terms = TREND_TERMS[currentLang] || TREND_TERMS.vi;
    wrap.innerHTML = terms.map((t) => `<button type="button" class="trend-tag" data-action="search-term" data-term="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')
      + `<a href="#oem" class="trend-tag trend-tag-accent">${currentLang === 'vi' ? 'Gia công OEM' : 'OEM 제조'}</a>`;
  }

  /**
   * Header live search
   */
  const headerSearchForm = document.getElementById('headerSearchForm');
  const headerSearchInput = document.getElementById('headerSearchInput');
  const searchDropdown = document.getElementById('searchDropdown');

  function closeSearchDropdown() {
    if (searchDropdown) searchDropdown.hidden = true;
  }

  function renderSearchDropdown() {
    if (!searchDropdown || !headerSearchInput) return;
    const isVi = currentLang === 'vi';
    const q = headerSearchInput.value.trim();
    if (!q) {
      const terms = TREND_TERMS[currentLang] || TREND_TERMS.vi;
      searchDropdown.innerHTML = `
        <div class="search-group-title">${isVi ? 'Tìm kiếm phổ biến' : '인기 검색어'}</div>
        <div class="search-trend-row">
          ${terms.slice(0, 6).map((t) => `<button type="button" class="trend-tag" data-action="search-term" data-term="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join('')}
        </div>
      `;
      searchDropdown.hidden = false;
      return;
    }

    const results = searchProducts(q);
    const nq = normalizeText(q);
    const brandHits = brandsData.filter((b) => normalizeText(b.name).includes(nq));

    if (!results.length && !brandHits.length) {
      searchDropdown.innerHTML = `<div class="search-empty">${isVi ? `Không tìm thấy kết quả cho “${escapeHtml(q)}”.` : `“${escapeHtml(q)}” 검색 결과가 없습니다.`}</div>`;
      searchDropdown.hidden = false;
      return;
    }

    searchDropdown.innerHTML = `
      ${brandHits.length ? `
        <div class="search-group-title">${isVi ? 'Thương hiệu' : '브랜드'}</div>
        ${brandHits.map((b) => `
          <button type="button" class="search-result" data-action="brand-products" data-brand-id="${b.id}">
            <img src="${b.coverImage}" alt="" loading="lazy">
            <span><strong>${b.name}</strong><small>${b.badge} · ${b.productsVi.length} ${isVi ? 'sản phẩm' : '개 품목'}</small></span>
          </button>
        `).join('')}
      ` : ''}
      ${results.length ? `
        <div class="search-group-title">${isVi ? 'Sản phẩm' : '제품'}</div>
        ${results.slice(0, 5).map((e) => {
          const p = localized(e);
          return `
            <button type="button" class="search-result" data-action="product-modal" data-product-id="${p.id}">
              <img src="${p.image}" alt="" loading="lazy">
              <span><strong>${p.name}</strong><small>${[p.brandName, p.spec, p.price ? formatVnd(p.price) : ''].filter(Boolean).join(" · ")}</small></span>
            </button>
          `;
        }).join('')}
        <button type="button" class="search-see-all" data-action="search-submit">
          ${isVi ? `Xem tất cả ${results.length} kết quả cho “${escapeHtml(q)}” →` : `“${escapeHtml(q)}” 결과 ${results.length}개 모두 보기 →`}
        </button>
      ` : ''}
    `;
    searchDropdown.hidden = false;
  }

  function runSearch(term) {
    const q = (term !== undefined ? term : (headerSearchInput ? headerSearchInput.value : '')).trim();
    if (headerSearchInput && term !== undefined) headerSearchInput.value = q;
    closeSearchDropdown();
    if (headerSearchInput) headerSearchInput.blur();
    document.querySelector('.site-header')?.classList.remove('search-open');
    navigate(q ? `san-pham?q=${encodeURIComponent(q)}` : 'san-pham');
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', renderSearchDropdown);
    headerSearchInput.addEventListener('focus', renderSearchDropdown);
    headerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeSearchDropdown(); headerSearchInput.blur(); }
    });
  }
  if (headerSearchForm) {
    headerSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      runSearch();
    });
  }
  document.addEventListener('click', (e) => {
    if (headerSearchForm && !headerSearchForm.contains(e.target)) closeSearchDropdown();
  });

  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  if (mobileSearchToggle) {
    mobileSearchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const siteHeader = document.querySelector('.site-header');
      const open = siteHeader.classList.toggle('search-open');
      if (open && headerSearchInput) headerSearchInput.focus();
    });
  }

  /**
   * Carousel arrows & expand toggle
   */
  function scrollCarousel(dir) {
    if (!productCatalogGrid) return;
    const card = productCatalogGrid.querySelector('.pcard');
    const step = card ? (card.getBoundingClientRect().width + 20) * 2 : productCatalogGrid.clientWidth * 0.8;
    productCatalogGrid.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  document.getElementById('catalogPrev')?.addEventListener('click', () => scrollCarousel(-1));
  document.getElementById('catalogNext')?.addEventListener('click', () => scrollCarousel(1));
  document.getElementById('catalogViewAllBtn')?.addEventListener('click', () => {
    if (currentRoute.page === 'home') { navigate('san-pham'); return; }
    const wasGrid = catalogState.expanded || !!catalogState.query;
    if (wasGrid) {
      catalogState.expanded = false;
      catalogState.query = '';
      if (headerSearchInput) headerSearchInput.value = '';
    } else {
      catalogState.expanded = true;
    }
    renderProductCatalog();
    scrollToProducts();
  });

  /**
   * Inquiry form helpers (select by index so they also work after KO translation)
   */
  const SERVICE_OPTION = { distribution: 0, partnership: 1, oem: 2 };
  function setServiceOption(key) {
    const serviceSelect = document.getElementById('formService');
    if (serviceSelect && serviceSelect.options[SERVICE_OPTION[key]]) {
      serviceSelect.selectedIndex = SERVICE_OPTION[key];
    }
  }

  // Catalogue & wholesale price-list request (from the "Nhận Catalogue & bảng giá sỉ" form)
  function prefillCatalogRequest(email) {
    const isVi = currentLang === 'vi';
    setServiceOption('distribution');
    const messageInput = document.getElementById('formMessage');
    if (messageInput && !messageInput.value.trim()) {
      messageInput.value = isVi
        ? 'Tôi muốn nhận catalogue sản phẩm, bảng giá sỉ và chính sách đại lý mới nhất của beVIBE.'
        : 'beVIBE 제품 카탈로그, 도매 단가표 및 최신 대리점 정책을 요청합니다.';
    }
    if (email) {
      const emailInput = document.getElementById('formEmail');
      if (emailInput) emailInput.value = email;
    }
    openContactModal();
    showToast(isVi ? 'Đã điền yêu cầu nhận catalogue & bảng giá sỉ — vui lòng hoàn tất thông tin liên hệ.' : '카탈로그 & 도매 단가표 요청이 입력되었습니다. 연락처를 입력해 주세요.');
  }

  document.getElementById('catalogSignupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('signupEmail');
    prefillCatalogRequest(emailInput ? emailInput.value.trim() : '');
    if (emailInput) emailInput.value = '';
  });

  /**
   * Top bar rotating promos
   */
  (function initTopbarPromos() {
    const promos = document.querySelectorAll('.topbar-promo');
    if (promos.length < 2) return;
    let i = 0;
    setInterval(() => {
      promos[i].classList.remove('active');
      i = (i + 1) % promos.length;
      promos[i].classList.add('active');
    }, 4000);
  })();


  /* ==========================================================================
     Products page: checkbox filter sidebar (multi-select per group)
     ========================================================================== */
  function isFilterPage() {
    const section = document.getElementById('products');
    return !!(section && section.classList.contains('is-filter-page'));
  }

  function getPageFilteredProducts() {
    const base = catalogState.query ? searchProducts(catalogState.query) : productIndex;
    return base.filter((e) =>
      (pageFilter.cats.size === 0 || pageFilter.cats.has(e.category)) &&
      (pageFilter.brands.size === 0 || pageFilter.brands.has(e.brandId)) &&
      (pageFilter.lines.size === 0 || pageFilter.lines.has(`${e.brandId}|${e.line}`)) &&
      (pageFilter.concerns.size === 0 || (e.concerns || []).some((c) => pageFilter.concerns.has(c)))
    );
  }

  function filterOptionsFor(group) {
    const isVi = currentLang === 'vi';
    if (group === 'cats') {
      return CATEGORY_DEFS.map((c) => ({
        value: c.id,
        label: isVi ? c.vi : c.ko,
        count: productIndex.filter((e) => e.category === c.id).length
      }));
    }
    if (group === 'brands') {
      return brandsData.map((b) => ({ value: b.id, label: b.name, count: b.productsVi.length }));
    }
    if (group === 'concerns') {
      return CONCERN_DEFS.map((c) => ({
        value: c.id,
        label: isVi ? c.vi : c.ko,
        count: productIndex.filter((e) => (e.concerns || []).includes(c.id)).length
      }));
    }
    // lines: only for the selected brands (all brands when none selected)
    const brands = pageFilter.brands.size ? brandsData.filter((b) => pageFilter.brands.has(b.id)) : brandsData;
    return brands.flatMap((b) => (b.lines || []).map((l) => ({
      value: `${b.id}|${l.id}`,
      label: isVi ? l.nameVi : l.nameKo,
      sub: b.name,
      count: b.productsVi.filter((p) => p.line === l.id).length
    })));
  }

  function filterLabel(group, value) {
    const opt = filterOptionsFor(group).find((o) => o.value === value) ||
      (group === 'lines' ? (() => {
        const [bId, lId] = value.split('|');
        return { label: lineLabel(bId, lId) };
      })() : null);
    return opt ? opt.label : value;
  }

  function renderCatalogSidebar() {
    const sidebar = document.getElementById('catalogSidebar');
    if (!sidebar) return;
    const isVi = currentLang === 'vi';
    const active = pageFilter.cats.size + pageFilter.brands.size + pageFilter.lines.size + pageFilter.concerns.size;
    const groups = [
      { key: 'cats', title: isVi ? 'Danh mục' : '카테고리' },
      { key: 'concerns', title: isVi ? 'Vấn đề da' : '피부 고민' },
      { key: 'brands', title: isVi ? 'Thương hiệu' : '브랜드' },
      { key: 'lines', title: isVi ? 'Dòng sản phẩm' : '제품 라인' }
    ];
    sidebar.innerHTML = `
      <div class="filter-head">
        <strong>${isVi ? 'Bộ lọc' : '필터'}</strong>
        ${active ? `<button type="button" class="filter-clear" data-action="pf-clear">${isVi ? 'Xóa tất cả' : '전체 해제'}</button>` : ''}
      </div>
      ${groups.map((g) => {
        const opts = filterOptionsFor(g.key);
        if (!opts.length) return '';
        return `
          <section class="filter-group">
            <h3 class="filter-group-title">${g.title}</h3>
            <ul class="filter-list">
              ${opts.map((o) => `
                <li>
                  <label class="filter-option">
                    <input type="checkbox" data-pf-group="${g.key}" value="${escapeHtml(o.value)}" ${pageFilter[g.key].has(o.value) ? 'checked' : ''}>
                    <span class="filter-option-label">${escapeHtml(o.label)}${o.sub ? ` <small>· ${escapeHtml(o.sub)}</small>` : ''}</span>
                    <span class="filter-option-count">(${o.count})</span>
                  </label>
                </li>
              `).join('')}
            </ul>
          </section>
        `;
      }).join('')}
    `;
  }

  function renderFilterPage() {
    const isVi = currentLang === 'vi';
    const list = getPageFilteredProducts();

    renderCatalogSidebar();

    productCatalogGrid.classList.remove('is-carousel', 'is-grouped');
    productCatalogGrid.classList.add('is-grid');
    productCatalogGrid.innerHTML = list.length
      ? list.map(productCardHtml).join('')
      : `
        <div class="catalog-empty">
          <p>${isVi ? 'Chưa có sản phẩm phù hợp với bộ lọc hiện tại.' : '현재 필터에 맞는 제품이 없습니다.'}</p>
          <button type="button" class="btn-secondary" data-action="pf-clear">${isVi ? 'Xóa bộ lọc' : '필터 해제'}</button>
        </div>
      `;

    const meta = document.getElementById('catalogResultMeta');
    if (meta) {
      const chips = [];
      if (catalogState.query) {
        chips.push(`<button type="button" class="filter-chip" data-action="clear-filter" data-filter="query">“${escapeHtml(catalogState.query)}” <span aria-hidden="true">✕</span></button>`);
      }
      ['cats', 'concerns', 'brands', 'lines'].forEach((g) => {
        pageFilter[g].forEach((v) => {
          chips.push(`<button type="button" class="filter-chip" data-action="pf-remove" data-group="${g}" data-value="${escapeHtml(v)}">${escapeHtml(filterLabel(g, v))} <span aria-hidden="true">✕</span></button>`);
        });
      });
      meta.innerHTML = `
        <span>${isVi ? `Hiển thị <strong>${list.length}</strong> sản phẩm` : `<strong>${list.length}</strong>개 제품`}</span>
        ${chips.join('')}
      `;
    }

    const viewAllBtn = document.getElementById('catalogViewAllBtn');
    if (viewAllBtn) viewAllBtn.hidden = true;
    document.querySelectorAll('#catalogPrev, #catalogNext').forEach((btn) => { btn.hidden = true; });

    const toggle = document.getElementById('catalogFilterToggle');
    if (toggle) {
      const n = pageFilter.cats.size + pageFilter.brands.size + pageFilter.lines.size + pageFilter.concerns.size;
      toggle.querySelector('span').textContent = (isVi ? 'Bộ lọc' : '필터') + (n ? ` (${n})` : '');
    }
  }

  document.getElementById('catalogSidebar')?.addEventListener('change', (e) => {
    const cb = e.target.closest('input[data-pf-group]');
    if (!cb) return;
    const group = cb.getAttribute('data-pf-group');
    if (cb.checked) pageFilter[group].add(cb.value);
    else pageFilter[group].delete(cb.value);
    // Unticking a brand also drops its product lines
    if (group === 'brands' && !cb.checked) {
      Array.from(pageFilter.lines).forEach((v) => { if (v.startsWith(`${cb.value}|`)) pageFilter.lines.delete(v); });
    }
    renderProductCatalog();
  });

  document.getElementById('catalogFilterToggle')?.addEventListener('click', () => {
    document.getElementById('catalogLayout')?.classList.toggle('filters-open');
  });


  /* ==========================================================================
     Blog: featured posts (home), list (#/blog) and post detail (#/blog/<slug>)
     ========================================================================== */
  const blogState = { featured: 'all', page: 'all', trend: 'all' };

  function formatPostDate(iso) {
    const d = new Date(`${iso}T00:00:00`);
    return currentLang === 'vi'
      ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
      : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  function blogCategoryLabel(id) {
    const c = blogCategories.find((x) => x.id === id);
    return c ? c.label : '';
  }

  function blogCardHtml(post) {
    return `
      <a class="blog-card" href="#/blog/${post.slug}">
        <span class="blog-card-media">
          <img src="${post.cover}" alt="${escapeHtml(post.title)}" loading="lazy">
          <span class="blog-card-cat">${escapeHtml(blogCategoryLabel(post.category))}</span>
        </span>
        <span class="blog-card-body">
          <span class="blog-card-title">${escapeHtml(post.title)}</span>
          <span class="blog-card-meta">${formatPostDate(post.date)} · ${post.readTime} phút đọc</span>
        </span>
      </a>
    `;
  }

  function blogChipsHtml(active, target) {
    const items = [{ id: 'all', label: 'Tất cả' }, ...blogCategories];
    return items.map((c) => `
      <button type="button" class="blog-chip ${active === c.id ? 'active' : ''}" data-action="blog-cat" data-target="${target}" data-cat="${c.id}">${escapeHtml(c.label)}</button>
    `).join('');
  }

  function sortedPosts(cat) {
    return blogPosts
      .filter((p) => cat === 'all' || p.category === cat)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function renderBlogFeatured() {
    const chips = document.getElementById('blogFeaturedChips');
    const grid = document.getElementById('blogFeaturedGrid');
    if (!grid) return;
    if (chips) chips.innerHTML = blogChipsHtml(blogState.featured, 'featured');
    grid.innerHTML = sortedPosts(blogState.featured).slice(0, 4).map(blogCardHtml).join('');
  }

  // "Xu hướng & mẹo làm đẹp": newest post large on the left, next 3 listed on the right
  function renderBlogTrend() {
    const chips = document.getElementById('blogTrendChips');
    const wrap = document.getElementById('blogTrend');
    if (!wrap) return;
    const cats = blogCategories.filter((c) => trendCategoryIds.includes(c.id));
    if (chips) {
      chips.innerHTML = [{ id: 'all', label: 'Tất cả' }, ...cats].map((c) => `
        <button type="button" class="blog-chip ${blogState.trend === c.id ? 'active' : ''}" data-action="blog-cat" data-target="trend" data-cat="${c.id}">${escapeHtml(c.label)}</button>
      `).join('');
    }
    const posts = blogPosts
      .filter((p) => (blogState.trend === 'all' ? trendCategoryIds.includes(p.category) : p.category === blogState.trend))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);
    if (!posts.length) { wrap.innerHTML = ''; return; }
    const [lead, ...rest] = posts;
    const meta = (p) => `<span class="spot-date"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>${formatPostDate(p.date)} · ${p.readTime} phút đọc</span>`;
    wrap.innerHTML = `
      <a class="spot-lead" href="#/blog/${lead.slug}">
        <img src="${lead.cover}" alt="${escapeHtml(lead.title)}" loading="lazy">
        <span class="spot-lead-body">
          <span class="spot-tag">${escapeHtml(blogCategoryLabel(lead.category))}</span>
          <span class="spot-lead-title">${escapeHtml(lead.title)}</span>
          ${meta(lead)}
        </span>
      </a>
      <div class="spot-list">
        ${rest.map((p) => `
          <a class="spot-item" href="#/blog/${p.slug}">
            <span class="spot-thumb"><img src="${p.cover}" alt="${escapeHtml(p.title)}" loading="lazy"></span>
            <span class="spot-item-body">
              <span class="spot-tag">${escapeHtml(blogCategoryLabel(p.category))}</span>
              <span class="spot-item-title">${escapeHtml(p.title)}</span>
              ${meta(p)}
            </span>
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderBlogPage() {
    renderBlogTrend();
    const chips = document.getElementById('blogPageChips');
    const grid = document.getElementById('blogPageGrid');
    if (!grid) return;
    if (chips) chips.innerHTML = blogChipsHtml(blogState.page, 'page');
    grid.innerHTML = sortedPosts(blogState.page).map(blogCardHtml).join('');
    grid.scrollLeft = 0;
    updateBlogArrows();

    const popular = document.getElementById('blogPopular');
    if (popular) {
      popular.innerHTML = popularSlugs
        .map((slug) => blogPosts.find((p) => p.slug === slug))
        .filter(Boolean)
        .map((post, i) => blogCardHtml(post).replace('<span class="blog-card-media">', `<span class="blog-card-media"><span class="blog-card-rank">${i + 1}</span>`))
        .join('');
      popular.scrollLeft = 0;
      updateBlogArrows();
    }
  }

  function updateBlogArrows() {
    document.querySelectorAll('.blog-carousel').forEach((wrap) => {
      const track = wrap.querySelector('.blog-track');
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth - 2;
      wrap.querySelectorAll('[data-blog-scroll]').forEach((btn) => {
        const dir = Number(btn.getAttribute('data-blog-scroll'));
        btn.hidden = max <= 0 || (dir < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max);
      });
    });
  }

  document.querySelectorAll('[data-blog-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const track = btn.closest('.blog-carousel')?.querySelector('.blog-track');
      const card = track && track.querySelector('.blog-card');
      if (!track) return;
      const step = card ? (card.getBoundingClientRect().width + 24) * 2 : track.clientWidth * 0.8;
      track.scrollBy({ left: Number(btn.getAttribute('data-blog-scroll')) * step, behavior: 'smooth' });
    });
  });
  document.querySelectorAll('.blog-track').forEach((t) => t.addEventListener('scroll', () => updateBlogArrows(), { passive: true }));
  window.addEventListener('resize', () => updateBlogArrows());

  function renderBlogPost(post) {
    const body = document.getElementById('blogPostBody');
    if (!body || !post) return;
    const products = (post.products || [])
      .map((id) => productIndex.find((e) => e.id === id))
      .filter(Boolean);
    const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
    body.innerHTML = `
      <article class="blog-article">
        ${post.content}
        ${(post.faq || []).length ? `
          <section class="blog-faq">
            <h2>Câu hỏi thường gặp</h2>
            ${post.faq.map((f, i) => `
              <details class="blog-faq-item" ${i === 0 ? 'open' : ''}>
                <summary>${escapeHtml(f.q)}</summary>
                <p>${escapeHtml(f.a)}</p>
              </details>
            `).join('')}
          </section>` : ''}
      </article>
      ${products.length ? `
        <section class="blog-related-products">
          <h2 class="blog-section-title">Sản phẩm gợi ý</h2>
          <div class="product-catalog-grid is-grid blog-products-grid">${products.map(productCardHtml).join('')}</div>
        </section>` : ''}
      <section class="blog-related">
        <h2 class="blog-section-title">Bài viết liên quan</h2>
        <div class="blog-grid blog-grid--related">${related.map(blogCardHtml).join('')}</div>
        <div class="blog-more"><a href="#/blog" class="blog-more-btn">Xem tất cả bài viết</a></div>
      </section>
    `;
  }


  /* ==========================================================================
     SEO: per-page <title>, meta description, canonical, Open Graph, JSON-LD
     ========================================================================== */
  const DEFAULT_SEO = {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  };

  function upsertHeadTag(selector, create) {
    let el = document.head.querySelector(selector);
    if (!el) { el = create(); document.head.appendChild(el); }
    return el;
  }

  function setMeta(attr, key, content) {
    const el = upsertHeadTag(`meta[${attr}="${key}"]`, () => {
      const m = document.createElement('meta');
      m.setAttribute(attr, key);
      return m;
    });
    el.setAttribute('content', content);
  }

  function setSeo({ title, description, url, image, type = 'website', jsonLd = null }) {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', 'beVIBE');
    setMeta('property', 'og:locale', 'vi_VN');
    if (image) setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertHeadTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }).setAttribute('href', url);

    const old = document.getElementById('seoJsonLd');
    if (old) old.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = 'seoJsonLd';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }

  function absoluteUrl(path) {
    return new URL(path, window.location.origin).href;
  }

  function postSeo(post) {
    const url = absoluteUrl(`/#/blog/${post.slug}`);
    const image = absoluteUrl(post.cover);
    const plainFaq = (post.faq || []).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }));
    setSeo({
      title: `${post.seoTitle} | beVIBE`,
      description: post.metaDescription,
      url,
      image,
      type: 'article',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.metaDescription,
          image: [image],
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: 'vi-VN',
          keywords: post.keyword,
          articleSection: blogCategoryLabel(post.category),
          mainEntityOfPage: url,
          author: { '@type': 'Organization', name: 'beVIBE' },
          publisher: {
            '@type': 'Organization',
            name: 'beVIBE',
            logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/images/logo.png') }
          }
        },
        ...(plainFaq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: plainFaq }] : []),
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/#/blog') },
            { '@type': 'ListItem', position: 3, name: post.title, item: url }
          ]
        }
      ]
    });
  }

  function pageSeo(route) {
    if (route.page === 'product' && shop) {
      const seo = shop.productSeo(route.productId, absoluteUrl);
      if (seo) { setSeo(seo); return; }
    }
    if (route.page === 'post') {
      const post = blogPosts.find((p) => p.slug === route.slug);
      if (post) { postSeo(post); return; }
    }
    if (route.page === 'home') {
      setSeo({ title: DEFAULT_SEO.title, description: DEFAULT_SEO.description, url: absoluteUrl('/') });
      return;
    }
    if (route.page === 'blog') {
      setSeo({
        title: 'Blog chăm sóc da & kiến thức mỹ phẩm Hàn Quốc | beVIBE',
        description: 'Blog beVIBE: hướng dẫn skincare, cách dùng mỹ phẩm Hàn Quốc đúng cách và giải đáp thắc mắc về da mặt, da đầu từ chuyên gia.',
        url: absoluteUrl('/#/blog'),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog beVIBE',
          inLanguage: 'vi-VN',
          blogPost: blogPosts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: absoluteUrl(`/#/blog/${p.slug}`), datePublished: p.date }))
        }
      });
      return;
    }
    // Other sub-pages keep the title set by renderPageHero, with the default description
    setSeo({ title: document.title, description: DEFAULT_SEO.description, url: absoluteUrl(window.location.hash ? `/${window.location.hash}` : '/') });
  }


  /* ==========================================================================
     Partnership form as a popup (the inline contact section was removed).
     Opened by every "#contact" link and by the quote / catalogue actions.
     ========================================================================== */
  const contactSection = document.getElementById('contact');
  let contactCloseBtn = null;

  function closeContactModal() {
    if (!contactSection) return;
    contactSection.classList.remove('as-modal');
    contactSection.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onContactKey);
  }

  function onContactKey(e) {
    if (e.key === 'Escape') closeContactModal();
  }

  function openContactModal() {
    if (!contactSection) return;
    if (!contactCloseBtn) {
      contactCloseBtn = document.createElement('button');
      contactCloseBtn.type = 'button';
      contactCloseBtn.className = 'contact-modal-close';
      contactCloseBtn.setAttribute('aria-label', 'Đóng');
      contactCloseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      contactCloseBtn.addEventListener('click', closeContactModal);
      const formCol = contactSection.querySelector('.inquiry-form-wrap');
      (formCol || contactSection).prepend(contactCloseBtn);
      // click on the dark backdrop closes it
      contactSection.addEventListener('click', (e) => { if (e.target === contactSection) closeContactModal(); });
    }
    contactSection.hidden = false;
    contactSection.classList.add('as-modal');
    contactSection.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onContactKey);
  }

  // Links to "#contact" open the popup instead of jumping to a section
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#contact"]');
    if (!link) return;
    e.preventDefault();
    if (mobileNavDrawer && mobileNavDrawer.contains(link)) closeMobileMenu();
    openContactModal();
  });

  /**
   * Single delegated handler for every [data-action] element
   */
  const headerNav = document.getElementById('headerNav');
  if (headerNav) {
    headerNav.addEventListener('mouseleave', () => headerNav.classList.remove('menu-closed'));
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.getAttribute('data-action');

    // Close menus that triggered the action
    if (headerNav && headerNav.contains(el)) {
      headerNav.classList.add('menu-closed');
      if (document.activeElement) document.activeElement.blur();
    }
    if (mobileNavDrawer && mobileNavDrawer.contains(el)) closeMobileMenu();
    if (searchDropdown && searchDropdown.contains(el) && action !== 'search-term') closeSearchDropdown();

    switch (action) {
      case 'brand-modal':
        openBrandModal(el.getAttribute('data-brand-id'));
        break;
      case 'brand-products':
        if (headerSearchInput) headerSearchInput.value = '';
        navigate(`thuong-hieu/${el.getAttribute('data-brand-id')}`);
        break;
      case 'brand-quote':
        prefillBrandInquiry(el.getAttribute('data-brand-name'));
        break;
      case 'brand-tab':
        setCatalogFilter({ brand: el.getAttribute('data-brand-id'), line: 'all' }, { scroll: false });
        break;
      case 'line': {
        const insideProducts = !!el.closest('#products');
        if (insideProducts) {
          setCatalogFilter({ brand: el.getAttribute('data-brand-id'), line: el.getAttribute('data-line') }, { scroll: false });
        } else {
          if (headerSearchInput) headerSearchInput.value = '';
          navigate(`thuong-hieu/${el.getAttribute('data-brand-id')}?line=${encodeURIComponent(el.getAttribute('data-line'))}`);
        }
        break;
      }
      case 'category': {
        // Filter in place only on the products / brand pages; elsewhere open the products page
        const insideProducts = !!el.closest('#products') && currentRoute.page !== 'home';
        if (insideProducts) {
          setCatalogFilter({ category: el.getAttribute('data-category') }, { scroll: false });
        } else {
          const cat = el.getAttribute('data-category');
          navigate(cat && cat !== 'all' ? `san-pham?cat=${encodeURIComponent(cat)}` : 'san-pham');
        }
        break;
      }
      case 'clear-filter': {
        const key = el.getAttribute('data-filter');
        if (key === 'brand' && currentRoute.page === 'brand') {
          navigate('san-pham');
          break;
        }
        if (key === 'query') {
          catalogState.query = '';
          if (headerSearchInput) headerSearchInput.value = '';
        } else {
          catalogState[key] = 'all';
          if (key === 'brand') catalogState.line = 'all';
        }
        renderProductCatalog();
        break;
      }
      case 'pf-remove': {
        const group = el.getAttribute('data-group');
        const value = el.getAttribute('data-value');
        if (pageFilter[group]) pageFilter[group].delete(value);
        if (group === 'brands') {
          Array.from(pageFilter.lines).forEach((v) => { if (v.startsWith(`${value}|`)) pageFilter.lines.delete(v); });
        }
        renderProductCatalog();
        break;
      }
      case 'blog-cat':
        blogState[el.getAttribute('data-target')] = el.getAttribute('data-cat');
        if (el.getAttribute('data-target') === 'page') renderBlogPage();
        else if (el.getAttribute('data-target') === 'trend') renderBlogTrend();
        else renderBlogFeatured();
        break;
      case 'pf-clear':
        pageFilter.cats.clear();
        pageFilter.brands.clear();
        pageFilter.lines.clear();
        pageFilter.concerns.clear();
        catalogState.query = '';
        if (headerSearchInput) headerSearchInput.value = '';
        renderProductCatalog();
        break;
      case 'reset-filters':
        if (headerSearchInput) headerSearchInput.value = '';
        setCatalogFilter({ brand: 'all', line: 'all', category: 'all', query: '' }, { scroll: false });
        break;
      case 'search-term':
        runSearch(el.getAttribute('data-term'));
        break;
      case 'search-submit':
        runSearch();
        break;
      case 'product-modal':
        if (e.target.closest('[data-action="product-quote"]') || e.target.closest('[data-action="product-quick"]') || e.target.closest('[data-shop]')) return;
        navigate(`san-pham/${el.getAttribute('data-product-id')}`);
        break;
      case 'product-quick':
        e.stopPropagation();
        openProductModal(el.getAttribute('data-product-id'));
        break;
      case 'bs-tab':
        bestSellerTab = el.getAttribute('data-tab') || 'all';
        renderBestSellers();
        break;
      case 'product-quote':
        e.stopPropagation();
        prefillProductInquiry(el.getAttribute('data-product-name'), el.getAttribute('data-brand-name'));
        break;
      case 'service-modal':
        openServiceModal(el.getAttribute('data-service'));
        break;
      default:
        break;
    }
  });

  // Keyboard support for focusable product cards
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const card = e.target.closest && e.target.closest('.pcard, .bs-card');
    if (card && e.target === card) openProductModal(card.getAttribute('data-product-id'));
  });

  function prefillProductInquiry(productName, brandName) {
    const isVi = currentLang === 'vi';
    const serviceSelect = document.getElementById('formService');
    const messageInput = document.getElementById('formMessage');
    if (serviceSelect) {
      setServiceOption('distribution');
    }
    if (messageInput) {
      messageInput.value = isVi 
        ? `Tôi quan tâm đến sản phẩm [${productName}] thuộc hãng ${brandName}. Vui lòng cung cấp bảng giá đại lý, số lượng đặt hàng tối thiểu (MOQ) và hồ sơ kiểm nghiệm sản phẩm.`
        : `beVIBE의 [${productName}] (${brandName}) 제품에 관심이 있습니다. 도매 단가표, 최소 발주 수량(MOQ) 및 위생허가 서류를 요청합니다.`;
    }
    openContactModal();
    showToast(isVi ? `Đã chọn [${productName}] vào mẫu liên hệ!` : `[${productName}] 견적 요청이 적용되었습니다!`);
  }

  /**
   * Prefill inquiry form for specific brand
   */
  function prefillBrandInquiry(brandName) {
    const isVi = currentLang === 'vi';
    const serviceSelect = document.getElementById('formService');
    const messageInput = document.getElementById('formMessage');
    if (serviceSelect) {
      setServiceOption('partnership');
    }
    if (messageInput) {
      messageInput.value = isVi 
        ? `Tôi quan tâm đến thương hiệu ${brandName} của beVIBE. Vui lòng gửi bảng báo giá sỉ, chính sách đại lý và catalogue sản phẩm chi tiết.`
        : `beVIBE의 ${brandName} 브랜드에 관심이 있습니다. 도매 공급가, 파트너십 정책 및 상세 카탈로그를 요청합니다.`;
    }
    openContactModal();
    showToast(isVi ? `Đã chọn thương hiệu ${brandName} vào mẫu liên hệ!` : `${brandName} 문의 내용이 적용되었습니다!`);
  }

  /**
   * Open Brand Detail Modal
   */
  function openBrandModal(brandId) {
    const brand = brandsData.find(b => b.id === brandId) || brandsData[0];
    if (!brand) return;
    currentActiveBrandId = brand.id;
    const isVi = currentLang === 'vi';

    // Update active tab button in modal header
    document.querySelectorAll('[data-brand-tab]').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-brand-tab') === brand.id);
    });

    // Content variables
    const story = isVi ? brand.storyVi : brand.storyKo;
    const tech = isVi ? brand.techVi : brand.techKo;
    const products = isVi ? brand.productsVi : brand.productsKo;
    const policy = isVi ? brand.policyVi : brand.policyKo;

    const brandModalBody = document.getElementById('brandModalBody');
    if (brandModalBody) {
      brandModalBody.innerHTML = `
        <div class="modal-brand-hero">
          <div>
            <h3 class="modal-brand-name">${brand.name}</h3>
            <p class="modal-brand-tagline">${brand.tagline}</p>
          </div>
          <div class="modal-brand-meta">
            <span class="brand-badge" style="font-size: 0.8rem; padding: 6px 14px; font-weight: 700;">${brand.badge}</span>
            <span class="brand-origin" style="font-size: 0.85rem; font-weight: 600; color: var(--text-ink);">${brand.origin}</span>
          </div>
        </div>

        ${brand.ebookUrl ? `
          <div class="modal-ebook-banner modal-resource-banner">
            <div class="ebook-banner-left">
              <span class="ebook-badge">📖 TÀI LIỆU CHÍNH HÃNG</span>
              <h4>${isVi ? 'Cẩm Nang Sản Phẩm Điện Tử (Ebook) — ' + brand.name : brand.name + ' 공식 E-Book 카탈로그'}</h4>
              <p>${isVi ? 'Xem trọn bộ 10 trang cẩm nang sản phẩm với hình ảnh độ phân giải cao, thành phần hoạt tính và hướng dẫn sử dụng.' : '10페이지 전 분량의 고해상도 제품 이미지와 성분 해설 E-Book 바로보기.'}</p>
            </div>
            <a href="${brand.ebookUrl}" target="_blank" rel="noopener noreferrer" class="btn-ebook-open">
              <span>${isVi ? 'Đọc Ebook Toàn Màn Hình ↗' : '전체 E-Book 열기 ↗'}</span>
            </a>
          </div>
        ` : brand.driveFolder ? `
          <div class="modal-ebook-banner modal-resource-banner">
            <div class="ebook-banner-left">
              <span class="ebook-badge">📁 TƯ LIỆU SẢN PHẨM GỐC</span>
              <h4>${isVi ? 'Thư Mục Ảnh Gốc & Hồ Sơ — ' + brand.name : brand.name + ' 공식 원본 드라이브 자료'}</h4>
              <p>${isVi ? 'Truy cập thư mục Google Drive chính hãng chứa hình ảnh sản phẩm độ phân giải cao, ảnh chụp thực tế và quy cách đóng gói.' : '고해상도 제품 실물 이미지 및 규격이 포함된 공식 Google Drive 폴더 바로가기.'}</p>
            </div>
            <a href="${brand.driveFolder}" target="_blank" rel="noopener noreferrer" class="btn-ebook-open">
              <span>${isVi ? 'Mở Google Drive Hãng ↗' : '드라이브 열기 ↗'}</span>
            </a>
          </div>
        ` : ''}

        <div class="modal-grid-2col">
          <!-- Col 1: Câu chuyện & Công nghệ -->
          <div>
            <div class="modal-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>${isVi ? 'Câu chuyện thương hiệu' : '브랜드 히스토리'}</span>
            </div>
            <div class="modal-story-box">
              <p>${story}</p>
            </div>

            <div class="modal-section-title" style="margin-top: 24px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>${isVi ? 'Công nghệ sinh học & Hoạt chất độc quyền' : '핵심 독자 기술 및 유효 성분'}</span>
            </div>
            <div class="modal-tech-box">
              <p>${tech}</p>
            </div>
          </div>

          <!-- Col 2: Sản phẩm chủ lực & Chính sách -->
          <div>
            <div class="modal-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span>${isVi ? `Dòng sản phẩm phân phối (${products.length} SP)` : `대표 주력 제품군 (${products.length}개)`}</span>
            </div>
            <div class="modal-products-list">
              ${(brand.lines && brand.lines.length ? brand.lines : [null]).map(line => { const items = line ? products.filter(p => p.line === line.id) : products; return (line ? `<div class="modal-line-head"><strong>${isVi ? line.nameVi : line.nameKo}</strong><span>${items.length} ${isVi ? "SP" : "개"}</span><p>${isVi ? line.descVi : line.descKo}</p></div>` : "") + items.map(p => `
                <div class="modal-product-card ${p.image ? 'has-img' : ''}" style="cursor: pointer;" onclick="window.openProductModal('${p.id}')" title="${isVi ? 'Bấm để xem video & chi tiết' : '영상 및 상세 정보 보기'}">
                  ${p.image ? `
                    <div class="modal-product-thumb-wrap">
                      <img src="${p.image}" alt="${p.name}" class="modal-product-thumb" loading="lazy">
                      ${p.tag ? `<span class="modal-product-tag">${p.tag}</span>` : ''}
                    </div>
                  ` : ''}
                  <div class="modal-product-content">
                    <div class="modal-product-header">
                      <span class="modal-product-name">${p.name}</span>
                      <span class="modal-product-spec">${p.spec}</span>
                    </div>
                    <p class="modal-product-desc">${p.desc}</p>
                    ${p.ebookPage ? `
                      <a href="${p.ebookPage}" target="_blank" rel="noopener noreferrer" class="btn-product-ebook-link">
                        <span>${isVi ? 'Xem trang chi tiết trong Ebook ↗' : 'E-Book 상세 페이지 보기 ↗'}</span>
                      </a>
                    ` : ''}
                  </div>
                </div>
              `).join(''); }).join('')}
            </div>

            <div class="modal-section-title" style="margin-top: 24px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>${isVi ? 'Chính sách đại lý & Quyền lợi phân phối' : '베트남 공식 파트너십 혜택'}</span>
            </div>
            <div class="modal-policy-box">
              <ul class="modal-policy-list">
                ${policy.map(pol => `
                  <li>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${pol}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    if (modalRequestBrandQuoteBtn) {
      modalRequestBrandQuoteBtn.querySelector('span').textContent = isVi 
        ? `Nhận bảng báo giá ${brand.name} ↗`
        : `${brand.name} 공급 단가 및 정책 문의 ↗`;
    }

    if (brandDetailModal) {
      brandDetailModal.classList.add('active');
      brandDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBrandModal() {
    if (brandDetailModal) {
      brandDetailModal.classList.remove('active');
      brandDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Make openBrandModal globally accessible
  window.openBrandModal = openBrandModal;

  /**
   * Open Service Detail Modal
   */
  function openServiceModal(serviceKey) {
    const service = servicesDetailsData[serviceKey] || servicesDetailsData.distribution;
    if (!service) return;
    currentActiveServiceId = serviceKey;
    const isVi = currentLang === 'vi';

    document.querySelectorAll('[data-service-tab]').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-service-tab') === serviceKey);
    });

    const title = isVi ? service.titleVi : service.titleKo;
    const lead = isVi ? service.leadVi : service.leadKo;
    const points = isVi ? service.pointsVi : service.pointsKo;

    const body = document.getElementById('serviceModalBody');
    if (body) {
      body.innerHTML = `
        <div style="margin-bottom: 24px; padding-bottom: 18px; border-bottom: 1px solid var(--border-subtle);">
          <span class="eyebrow" style="margin-bottom: 8px;">${service.tag}</span>
          <h3 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-ink); margin-bottom: 10px;">${title}</h3>
          <p style="font-size: 1.05rem; color: var(--text-body); max-width: 750px;">${lead}</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${points.map((pt, idx) => `
            <div style="background-color: var(--bg-porcelain); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 20px 24px;">
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--accent-crimson); margin-bottom: 6px;">0${idx+1}. ${pt.title}</h4>
              <p style="font-size: 0.92rem; color: var(--text-body);">${pt.desc}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (modalRequestServiceQuoteBtn) {
      modalRequestServiceQuoteBtn.querySelector('span').textContent = isVi 
        ? `Tư vấn hợp tác: ${title} ↗`
        : `${title} 상담 신청하기 ↗`;
    }

    if (serviceDetailModal) {
      serviceDetailModal.classList.add('active');
      serviceDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeServiceModal() {
    if (serviceDetailModal) {
      serviceDetailModal.classList.remove('active');
      serviceDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  window.openServiceModal = openServiceModal;

  /**
   * Open Interactive Product Detail & Video Modal
   */
  function openProductModal(productId) {
    const isVi = currentLang === 'vi';
    currentActiveProductId = productId;
    
    // Find product across all brands
    let foundProduct = null;
    let foundBrand = null;

    for (const b of brandsData) {
      const list = isVi ? b.productsVi : b.productsKo;
      const p = list.find(item => item.id === productId);
      if (p) {
        foundProduct = p;
        foundBrand = b;
        break;
      }
    }

    if (!foundProduct || !foundBrand) return;

    if (prodModalBrandBadge) {
      prodModalBrandBadge.textContent = foundBrand.name.toUpperCase();
    }

    const hasVideo = !!foundProduct.video;
    const videoSrc = foundProduct.video || '';
    const imgSrc = foundProduct.image || foundBrand.coverImage || '/assets/images/hero.jpg';

    const t = i18nData[currentLang] || {};

    if (productModalBody) {
      productModalBody.innerHTML = `
        <div class="prod-modal-grid">
          <!-- Left Column: Visual & Video Showcase -->
          <div class="prod-modal-media-col">
            <!-- Media Nav Tabs -->
            <div class="prod-media-nav">
              <button type="button" class="prod-media-tab-btn ${hasVideo ? 'active' : ''}" id="tabMediaVideo" data-mediatab="video" ${!hasVideo ? 'style="display:none;"' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span>${t.modalProdVideoTab || (isVi ? '🎬 Video giới thiệu (HD)' : '🎬 제품 소개 영상 (HD)')}</span>
              </button>
              <button type="button" class="prod-media-tab-btn ${!hasVideo ? 'active' : ''}" id="tabMediaPhoto" data-mediatab="photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>${t.modalProdPhotoTab || (isVi ? '🖼️ Ảnh chụp thực tế' : '🖼️ 제품 실물 이미지')}</span>
              </button>
            </div>

            <!-- Video Player Box -->
            ${hasVideo ? `
              <div class="prod-video-wrapper" id="prodModalVideoWrapper">
                <video id="prodModalVideoPlayer" class="prod-video-player" playsinline controls loop preload="auto">
                  <source src="${videoSrc}" type="video/mp4">
                  Trình duyệt không hỗ trợ video MP4.
                </video>
                <div class="prod-video-badge-overlay">
                  <span class="pulse-dot"></span>
                  <span>Official Video 4K/HD</span>
                </div>
              </div>
            ` : ''}

            <!-- Photo Box -->
            <div class="prod-photo-wrapper ${hasVideo ? 'hidden' : ''}" id="prodModalPhotoWrapper" ${!hasVideo ? 'style="display:flex;"' : 'style="display:none;"'}>
              <img src="${imgSrc}" alt="${foundProduct.name}" id="prodModalImage">
            </div>

            ${(foundProduct.gallery && foundProduct.gallery.length) ? `
              <div class="prod-gallery-strip" id="prodGalleryStrip">
                ${[imgSrc, ...foundProduct.gallery].map((src, i) => `<button type="button" class="prod-gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${src}" aria-label="Ảnh ${i + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}
              </div>
            ` : ''}

            <!-- Direct Drive fallback link -->
            ${foundProduct.driveVideoUrl ? `
              <a href="${foundProduct.driveVideoUrl}" target="_blank" rel="noopener noreferrer" class="prod-drive-direct-link" title="Mở video gốc trên Google Drive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                <span>${t.modalProdDriveLink || (isVi ? 'Mở video gốc trên Google Drive ↗' : 'Google Drive에서 원본 영상 보기 ↗')}</span>
              </a>
            ` : ''}

            <!-- Specs Highlights -->
            <div class="prod-specs-row">
              <div class="prod-spec-item">
                <span class="spec-label">${isVi ? 'Quy cách' : '용량/규격'}</span>
                <span class="spec-val">${(productPrices[foundProduct.id] && productPrices[foundProduct.id].unit) || foundProduct.spec || 'Tiêu chuẩn'}</span>
              </div>
              <div class="prod-spec-item prod-spec-price">
                <span class="spec-label">${isVi ? 'Giá niêm yết' : '정가'}</span>
                <span class="spec-val">${productPrices[foundProduct.id] ? formatVnd(productPrices[foundProduct.id].price) : (isVi ? 'Liên hệ' : '문의')}</span>
              </div>
              <div class="prod-spec-item">
                <span class="spec-label">${isVi ? 'Thương hiệu' : '브랜드'}</span>
                <span class="spec-val">${foundBrand.name}</span>
              </div>
              <div class="prod-spec-item">
                <span class="spec-label">${isVi ? 'Chứng nhận' : '품질 인증'}</span>
                <span class="spec-val">CGMP & ISO 22716</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Ingredients, Benefits, Usage -->
          <div class="prod-modal-info-col">
            <span class="prod-info-category">${foundProduct.tag || foundBrand.badge}</span>
            <h3 class="prod-info-title">${foundProduct.name}</h3>
            <p class="prod-info-desc">${foundProduct.desc}</p>

            <!-- Block 1: Thành phần chính (only when real data exists) -->
            ${foundProduct.ingredients && foundProduct.ingredients.length > 0 ? `
            <div class="prod-detail-block">
              <h4 class="prod-block-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 2v7.31L4.62 18.6A2 2 0 0 0 6.34 22h11.32a2 2 0 0 0 1.72-3.4L14 9.31V2"/></svg>
                <span>${t.modalProdIngredients || (isVi ? 'Thành phần hoạt tính chính' : '주요 활성 성분')}</span>
              </h4>
              <div class="prod-ingredients-list">
                ${foundProduct.ingredients && foundProduct.ingredients.length > 0 ? foundProduct.ingredients.map(ing => `
                  <div class="prod-ingredient-card">
                    <span class="ingredient-name">${ing.name}</span>
                    <p class="ingredient-desc">${ing.desc}</p>
                  </div>
                `).join('') : `
                  <div class="prod-ingredient-card">
                    <span class="ingredient-name">${isVi ? 'Hoạt chất sinh học chuẩn CGMP Hàn Quốc' : 'CGMP 인증 바이오 유효 성분'}</span>
                    <p class="ingredient-desc">${isVi ? 'Ứng dụng công nghệ nuôi cấy và chiết xuất sinh học tiên tiến từ Seoul.' : '서울 연구소의 첨단 바이오 추출 및 발효 공법 적용.'}</p>
                  </div>
                `}
              </div>
            </div>
            ` : ''}

            <!-- Block 2: Công dụng & Hiệu quả -->
            <div class="prod-detail-block">
              <h4 class="prod-block-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>${t.modalProdBenefits || (isVi ? 'Công dụng & Hiệu quả vượt trội' : '핵심 효능 및 임상 효과')}</span>
              </h4>
              <ul class="prod-benefits-list">
                ${foundProduct.benefits && foundProduct.benefits.length > 0 ? foundProduct.benefits.map(b => `
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${b}</span>
                  </li>
                `).join('') : `
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${foundProduct.desc}</span>
                  </li>
                `}
              </ul>
            </div>

            <!-- Block 3: Hướng dẫn sử dụng -->
            <div class="prod-detail-block">
              <h4 class="prod-block-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${t.modalProdUsage || (isVi ? 'Hướng dẫn sử dụng chuẩn Clinic' : '사용 방법 및 추천 루틴')}</span>
              </h4>
              <div class="prod-usage-card">
                <p>${foundProduct.usage || (isVi ? 'Lấy lượng vừa đủ thoa đều khắp mặt và cổ sau bước làm sạch. Dùng 2 lần sáng và tối.' : '세안 후 적당량을 덜어 피부 결을 따라 부드럽게 흡수시킵니다. 아침, 저녁 데일리 사용.')}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Gallery thumbnails → swap main photo (and switch to the photo tab)
      const galleryStrip = document.getElementById('prodGalleryStrip');
      if (galleryStrip) {
        galleryStrip.addEventListener('click', (ev) => {
          const thumb = ev.target.closest('.prod-gallery-thumb');
          if (!thumb) return;
          const mainImg = document.getElementById('prodModalImage');
          if (mainImg) mainImg.src = thumb.getAttribute('data-src');
          galleryStrip.querySelectorAll('.prod-gallery-thumb').forEach((t) => t.classList.toggle('active', t === thumb));
          const photoTab = document.getElementById('tabMediaPhoto');
          if (photoTab && !photoTab.classList.contains('active')) photoTab.click();
        });
      }

      // Media Tab switching
      const tabVideo = document.getElementById('tabMediaVideo');
      const tabPhoto = document.getElementById('tabMediaPhoto');
      const wrapperVideo = document.getElementById('prodModalVideoWrapper');
      const wrapperPhoto = document.getElementById('prodModalPhotoWrapper');
      const videoPlayer = document.getElementById('prodModalVideoPlayer');

      if (tabVideo && tabPhoto && wrapperVideo && wrapperPhoto) {
        tabVideo.addEventListener('click', () => {
          tabVideo.classList.add('active');
          tabPhoto.classList.remove('active');
          wrapperVideo.style.display = 'flex';
          wrapperPhoto.style.display = 'none';
          if (videoPlayer) {
            videoPlayer.play().catch(() => {});
          }
        });

        tabPhoto.addEventListener('click', () => {
          tabPhoto.classList.add('active');
          tabVideo.classList.remove('active');
          wrapperPhoto.style.display = 'flex';
          wrapperVideo.style.display = 'none';
          if (videoPlayer) {
            videoPlayer.pause();
          }
        });
      }

      // Setup Extra Link Button (Ebook or Drive)
      if (prodModalExtraLink) {
        if (foundProduct.ebookPage || foundBrand.ebookUrl) {
          prodModalExtraLink.href = foundProduct.ebookPage || foundBrand.ebookUrl;
          prodModalExtraLink.style.display = 'inline-flex';
          prodModalExtraLink.querySelector('span').textContent = isVi ? '📖 Đọc Cẩm Nang Ebook ↗' : '📖 공식 E-Book 열기 ↗';
        } else if (foundProduct.driveVideoUrl || foundBrand.driveFolder) {
          prodModalExtraLink.href = foundProduct.driveVideoUrl || foundBrand.driveFolder;
          prodModalExtraLink.style.display = 'inline-flex';
          prodModalExtraLink.querySelector('span').textContent = isVi ? '📁 Thư Mục Google Drive ↗' : '📁 구글 드라이브 자료 ↗';
        } else {
          prodModalExtraLink.style.display = 'none';
        }
      }

      // Setup Request Quote Button
      if (prodModalRequestQuoteBtn) {
        prodModalRequestQuoteBtn.onclick = () => {
          closeProductModal();
          prefillProductInquiry(foundProduct.name, foundBrand.name);
        };
        prodModalRequestQuoteBtn.querySelector('span').textContent = t.modalProdInquireBtn || (isVi ? 'Nhận báo giá sỉ sản phẩm này ↗' : '이 제품 도매 견적 문의 ↗');
      }

      // Open modal
      if (productDetailModal) {
        productDetailModal.classList.add('active');
        productDetailModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }

      // Autoplay video
      if (videoPlayer) {
        videoPlayer.currentTime = 0;
        videoPlayer.play().catch(e => {
          console.log('Video autoplay handled:', e.message);
        });
      }
    }
  }

  function closeProductModal() {
    if (productDetailModal) {
      const videoPlayer = productModalBody ? productModalBody.querySelector('video') : null;
      if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
      }
      productDetailModal.classList.remove('active');
      productDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  window.openProductModal = openProductModal;
  window.closeProductModal = closeProductModal;

  /**
   * Toast notification helper
   */
  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3200);
  }

  // --- Event Listeners ---

  // Language Switcher
  const toggleLanguage = () => {
    currentLang = currentLang === 'vi' ? 'ko' : 'vi';
    applyTranslations();
    showToast(currentLang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : '한국어로 변경되었습니다');
  };

  if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
  if (langToggleMobile) langToggleMobile.addEventListener('click', () => {
    toggleLanguage();
    closeMobileMenu();
  });

  // Mobile Drawer Menu
  function openMobileMenu() {
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavDrawer.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
  document.getElementById('mobileMenuClose')?.addEventListener('click', closeMobileMenu);

  // Navigation Links & Dropdowns (brand/category/service actions use [data-action] delegation)
  document.querySelectorAll('.open-brand-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const brandId = btn.getAttribute('data-brand') || 'dr-bargo';
      openBrandModal(brandId);
    });
  });

  document.querySelectorAll('.open-service-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceId = btn.getAttribute('data-service') || 'distribution';
      openServiceModal(serviceId);
    });
  });

  // Brand Modal Tabs Switching
  document.querySelectorAll('[data-brand-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const brandId = tab.getAttribute('data-brand-tab');
      openBrandModal(brandId);
    });
  });

  if (closeProductModalBtn) closeProductModalBtn.addEventListener('click', closeProductModal);
  if (closeProductModalFooterBtn) closeProductModalFooterBtn.addEventListener('click', closeProductModal);
  if (productDetailModal) {
    productDetailModal.addEventListener('click', (e) => {
      if (e.target === productDetailModal) closeProductModal();
    });
  }

  if (closeBrandModalBtn) closeBrandModalBtn.addEventListener('click', closeBrandModal);
  if (closeBrandModalFooterBtn) closeBrandModalFooterBtn.addEventListener('click', closeBrandModal);
  if (brandDetailModal) {
    brandDetailModal.addEventListener('click', (e) => {
      if (e.target === brandDetailModal) closeBrandModal();
    });
  }

  if (modalRequestBrandQuoteBtn) {
    modalRequestBrandQuoteBtn.addEventListener('click', () => {
      const brand = brandsData.find(b => b.id === currentActiveBrandId);
      closeBrandModal();
      if (brand) {
        prefillBrandInquiry(brand.name);
      }
    });
  }

  // Service Modal Tabs Switching
  document.querySelectorAll('[data-service-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      const sId = tab.getAttribute('data-service-tab');
      openServiceModal(sId);
    });
  });

  if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', closeServiceModal);
  if (closeServiceModalFooterBtn) closeServiceModalFooterBtn.addEventListener('click', closeServiceModal);
  if (serviceDetailModal) {
    serviceDetailModal.addEventListener('click', (e) => {
      if (e.target === serviceDetailModal) closeServiceModal();
    });
  }

  if (modalRequestServiceQuoteBtn) {
    modalRequestServiceQuoteBtn.addEventListener('click', () => {
      const service = servicesDetailsData[currentActiveServiceId];
      closeServiceModal();
      const isVi = currentLang === 'vi';
      const serviceSelect = document.getElementById('formService');
      const messageInput = document.getElementById('formMessage');
      if (serviceSelect && service) {
        if (currentActiveServiceId === 'distribution') setServiceOption('distribution');
        else if (currentActiveServiceId === 'partnership') setServiceOption('partnership');
        else setServiceOption('oem');
      }
      if (messageInput && service) {
        messageInput.value = isVi
          ? `Tôi muốn tìm hiểu chi tiết về gói hợp tác: ${service.titleVi}. Vui lòng liên hệ tư vấn lộ trình và chính sách ưu đãi.`
          : `beVIBE의 ${service.titleKo} 제휴 방안에 대해 상세한 상담을 요청합니다.`;
      }
      openContactModal();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBrandModal();
      closeServiceModal();
      closeProductModal();
    }
  });

  // Interactive Process Step Click
  stepItems.forEach(step => {
    step.addEventListener('click', () => {
      stepItems.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  // Inquiry Form Submission & Text Generator
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isVi = currentLang === 'vi';

      const name = document.getElementById('formName').value.trim();
      const company = document.getElementById('formCompany').value.trim() || (isVi ? 'Cá nhân / Chưa công bố' : '개인 / 미공개');
      const email = document.getElementById('formEmail').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const service = document.getElementById('formService').value;
      const budget = document.getElementById('formBudget') ? document.getElementById('formBudget').value : '';
      const message = document.getElementById('formMessage').value.trim();

      const timeStamp = new Date().toLocaleString(isVi ? 'vi-VN' : 'ko-KR');

      let summaryText = '';
      if (isVi) {
        summaryText = [
          `=========================================`,
          `PHIẾU YÊU CẦU HỢP TÁC — BEVIBE KOREA & VIETNAM`,
          `Thời gian: ${timeStamp}`,
          `=========================================`,
          `1. THÔNG TIN ĐỐI TÁC:`,
          `   - Họ và tên: ${name}`,
          `   - Đơn vị / Thương hiệu: ${company}`,
          `   - Số điện thoại / Zalo: ${phone}`,
          `   - Email: ${email}`,
          ``,
          `2. NHU CẦU HỢP TÁC:`,
          `   - Hạng mục: ${service}`,
          budget ? `   - Ngân sách dự toán: ${budget}` : '',
          ``,
          `3. MÔ TẢ CHI TIẾT DỰ ÁN:`,
          `   ${message.replace(/\n/g, '\n   ')}`,
          `=========================================`,
          `Gửi trực tiếp đến beVIBE:`,
          `Hotline/Zalo: 033 828 2112 | Email: bevibevn@gmail.com`
        ].filter(Boolean).join('\n');
      } else {
        summaryText = [
          `=========================================`,
          `beVIBE 파트너십 상담 신청서 (KOREA & VIETNAM)`,
          `접수 일시: ${timeStamp}`,
          `=========================================`,
          `1. 신청자 및 회사 정보:`,
          `   - 담당자 성함: ${name}`,
          `   - 회사명 / 브랜드: ${company}`,
          `   - 연락처 / Zalo: ${phone}`,
          `   - 이메일: ${email}`,
          ``,
          `2. 문의 분야:`,
          `   - 분야: ${service}`,
          budget ? `   - 예상 예산: ${budget}` : '',
          ``,
          `3. 프로젝트 세부 내용:`,
          `   ${message.replace(/\n/g, '\n   ')}`,
          `=========================================`,
          `beVIBE 공식 접수처:`,
          `전화/Zalo: (+84) 33 828 2112 | 이메일: bevibevn@gmail.com`
        ].filter(Boolean).join('\n');
      }

      if (proposalTextarea) {
        proposalTextarea.value = summaryText;
      }
      if (formResultArea) {
        formResultArea.classList.remove('hidden');
        formResultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      showToast(isVi ? 'Đã tạo bản yêu cầu hợp tác thành công! ✓' : '상담 신청서가 성공적으로 생성되었습니다! ✓');
    });
  }

  // Copy Proposal Button
  if (copyProposalBtn && proposalTextarea) {
    copyProposalBtn.addEventListener('click', async () => {
      const isVi = currentLang === 'vi';
      const text = proposalTextarea.value;
      try {
        await navigator.clipboard.writeText(text);
        copyProposalBtn.innerHTML = `✓ ${isVi ? 'Đã sao chép vào bộ nhớ!' : '복사 완료!'}`;
        copyProposalBtn.classList.add('btn-success');
        showToast(isVi ? 'Đã sao chép nội dung thành công! Bạn có thể dán vào Zalo/Email.' : '클립보드에 복사되었습니다.');
        setTimeout(() => {
          copyProposalBtn.innerHTML = isVi ? 'Sao chép nội dung' : '요청서 복사';
          copyProposalBtn.classList.remove('btn-success');
        }, 3000);
      } catch (err) {
        proposalTextarea.select();
        document.execCommand('copy');
        showToast(isVi ? 'Đã chọn và sao chép văn bản' : '텍스트가 선택되었습니다.');
      }
    });
  }

  // Direct Zalo Link
  if (sendZaloBtn) {
    sendZaloBtn.addEventListener('click', () => {
      const isVi = currentLang === 'vi';
      const zaloUrl = `https://zalo.me/0338282112`;
      window.open(zaloUrl, '_blank');
      showToast(isVi ? 'Đang mở cửa sổ Zalo beVIBE...' : 'beVIBE Zalo 창을 엽니다...');
    });
  }

  // Direct Email Link
  if (sendEmailBtn && proposalTextarea) {
    sendEmailBtn.addEventListener('click', () => {
      const isVi = currentLang === 'vi';
      const subject = encodeURIComponent(isVi ? 'Yêu cầu hợp tác beVIBE Korea - Vietnam' : 'beVIBE 파트너십 제휴 문의');
      const body = encodeURIComponent(proposalTextarea.value);
      window.location.href = `mailto:bevibevn@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // Header Scroll & Glass Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Floating quick bar: arrow button shows / hides the contact buttons
  const quickBar = document.querySelector('.floating-quick-bar');
  const quickToggleBtn = document.getElementById('quickToggleBtn');
  if (quickBar && quickToggleBtn) {
    const setQuickBarOpen = (open) => {
      quickBar.classList.toggle('is-collapsed', !open);
      quickToggleBtn.setAttribute('aria-expanded', String(open));
      quickToggleBtn.setAttribute('aria-label', open ? 'Thu gọn liên hệ' : 'Mở liên hệ');
      try { localStorage.setItem('bevibe_quickbar_open', open ? '1' : '0'); } catch (e) { /* storage unavailable */ }
    };
    let startOpen = true;
    try { startOpen = localStorage.getItem('bevibe_quickbar_open') !== '0'; } catch (e) { /* storage unavailable */ }
    setQuickBarOpen(startOpen);
    quickToggleBtn.addEventListener('click', () => {
      setQuickBarOpen(quickBar.classList.contains('is-collapsed'));
    });
  }

  /**
   * Hero Rotating Product Slideshow Controller
   */
  function initHeroSlideshow() {
    const bannerCard = document.getElementById('heroBannerCard');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-indicator-dot');
    const chips = document.querySelectorAll('.glass-brand-chip');
    const prevBtn = document.getElementById('heroSlidePrev');
    const nextBtn = document.getElementById('heroSlideNext');
    const progressFill = document.getElementById('heroProgressFill');
    const activeBrandDesc = document.getElementById('heroActiveBrandDesc');

    if (!bannerCard || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideDuration = 5000; // 5s per slide (auto-advance)
    let progressStartTime = performance.now();
    let animFrame = null;
    let isPaused = false;

    const brandDescriptionsVi = {
      'neuraderm': 'Medytox · Basic Derma & Clinic Derma (17 sản phẩm)',
      'dr-bargo': 'Gangnam Clinic Formula · Serum phục hồi màng bảo vệ da chuyên sâu',
      'medipharm': 'MediPharm · Dòng Stem C tế bào gốc (6 sản phẩm)',
      'smib': '100 Tỷ Postbiotic · Dầu gội phủ bạc tự nhiên & trị liệu da đầu',
      'cellgrams': 'CELLGRAMS · Dòng chăm sóc da chuyên sâu'
    };

    const brandDescriptionsKo = {
      'neuraderm': '메디톡스 바이오 · 코어타임 앰플 및 병원 처방 MD 크림',
      'dr-bargo': '강남 피부과 처방 · 손상 장벽 급속 리페어 세럼',
      'medipharm': '메디팜 · 스템씨 줄기세포 라인 (6개 제품)',
      'smib': '1000억 포스트바이오틱스 · 컬러 체인지 샴푸 및 두피 케어',
      'cellgrams': '셀그램스 · 집중 스킨케어 라인'
    };

    // dir: 1 = next slide slides in from the right, -1 = previous slides in from the left
    function updateSlide(index, dir = 1) {
      const prevSlide = currentSlide;
      currentSlide = (index + totalSlides) % totalSlides;

      // Update slide elements
      slides.forEach((slide, i) => {
        slide.classList.remove('is-leaving');
        if (i === currentSlide && i !== prevSlide) {
          // place the incoming slide off-screen without animating, then slide it in
          slide.style.transition = 'none';
          slide.style.transform = `translateX(${dir > 0 ? 100 : -100}%)`;
          void slide.offsetWidth;
          slide.style.transition = '';
          slide.style.transform = '';
          slide.classList.add('active');
        } else if (i === prevSlide && i !== currentSlide) {
          slide.classList.remove('active');
          slide.classList.add('is-leaving');
          slide.style.transform = `translateX(${dir > 0 ? -100 : 100}%)`;
        } else {
          slide.classList.toggle('active', i === currentSlide);
          if (i !== currentSlide) slide.style.transform = '';
        }
      });

      // Update indicators
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });

      // Update brand chips
      const activeSlideBrand = slides[currentSlide].getAttribute('data-brand');
      chips.forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-brand-chip') === activeSlideBrand);
      });

      // Update description text in floating card
      if (activeBrandDesc) {
        const isVi = currentLang === 'vi';
        const descs = isVi ? brandDescriptionsVi : brandDescriptionsKo;
        if (descs[activeSlideBrand]) {
          activeBrandDesc.textContent = descs[activeSlideBrand];
        }
      }

      resetProgress();
    }

    function resetProgress() {
      cancelAnimationFrame(animFrame);
      if (progressFill) progressFill.style.width = '0%';
      progressStartTime = performance.now();
      stepProgress();
    }

    function stepProgress() {
      if (isPaused) {
        animFrame = requestAnimationFrame(stepProgress);
        return;
      }
      const elapsed = performance.now() - progressStartTime;
      const pct = Math.min(100, (elapsed / slideDuration) * 100);
      if (progressFill) progressFill.style.width = `${pct}%`;

      if (elapsed >= slideDuration) {
        updateSlide(currentSlide + 1);
      } else {
        animFrame = requestAnimationFrame(stepProgress);
      }
    }

    // Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1, -1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-goto'), 10);
        updateSlide(target, target < currentSlide ? -1 : 1);
      });
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const brandKey = chip.getAttribute('data-brand-chip');
        const targetIndex = Array.from(slides).findIndex(s => s.getAttribute('data-brand') === brandKey);
        if (targetIndex !== -1) {
          updateSlide(targetIndex, targetIndex < currentSlide ? -1 : 1);
        } else {
          // No hero slide for this brand: open its brand page instead
          window.location.hash = `#/thuong-hieu/${brandKey}`;
        }
      });
    });


    // Expose globally for convenience
    window.heroGoToSlide = function(idx) {
      updateSlide(idx);
    };

    // Initial start
    updateSlide(0);
  }

  /* ==========================================================================
     Page router (hash based). Each header menu item opens its own page:
     #/san-pham, #/thuong-hieu, #/thuong-hieu/<brandId>, #/ve-bevibe, #/blog.
     Empty hash shows the home page; plain anchors (#contact…) just scroll.
     ========================================================================== */
  const publicMain = document.querySelector('#publicWebsiteView > main');
  const pageHero = document.getElementById('pageHero');
  const productsSection = document.getElementById('products');
  const baseTitle = document.title;
  let currentRoute = { page: 'home', params: {} };

  const PAGE_DEFS = {
    'san-pham': {
      sections: ['#products'],
      vi: { eyebrow: 'OFFICIAL CATALOG', title: 'Danh mục sản phẩm', desc: 'Toàn bộ mỹ phẩm Hàn Quốc chính hãng do beVIBE phân phối. Lọc theo danh mục, thương hiệu và dòng sản phẩm để tìm đúng sản phẩm bạn cần.' },
      ko: { eyebrow: 'OFFICIAL CATALOG', title: '제품 카탈로그', desc: '비바이브가 공식 유통하는 한국 화장품 전 제품. 카테고리, 브랜드, 제품 라인별로 찾아보세요.' }
    },
    'thuong-hieu': {
      sections: ['#brands'],
      vi: { eyebrow: 'OUR BRANDS', title: 'Thương hiệu', desc: 'Các thương hiệu mỹ phẩm Hàn Quốc được beVIBE phân phối độc quyền tại Việt Nam. Chọn một thương hiệu để xem đầy đủ sản phẩm theo từng dòng.' },
      ko: { eyebrow: 'OUR BRANDS', title: '브랜드', desc: '비바이브가 베트남에서 독점 유통하는 한국 화장품 브랜드. 브랜드를 선택하면 라인별 전체 제품을 볼 수 있습니다.' }
    },
    'brand': {
      sections: ['#products']
    },
    'post': {
      sections: ['#blogPost']
    },
    'product': {
      sections: ['#productPage']
    },
    've-bevibe': {
      sections: ['#about', '#aboutStory', '.usp-strip'],
      vi: { eyebrow: 'ABOUT US', title: 'Về beVIBE', desc: 'Sản xuất và phân phối độc quyền mỹ phẩm Hàn Quốc – được hơn 5000 TMV, Spa, Phòng khám da liễu Hàn Quốc và Việt Nam tin yêu.' },
      ko: { eyebrow: 'ABOUT US', title: '비바이브 소개', desc: '한국 화장품 제조 및 독점 유통 – 한국과 베트남 5,000곳 이상의 성형외과·스파·클리닉이 신뢰합니다.' }
    },
    'lien-he': {
      sections: ['#contactPage'],
      vi: { eyebrow: 'CONTACT', title: 'Liên hệ', desc: 'Hotline, Zalo, email và địa chỉ văn phòng beVIBE – chọn kênh phù hợp để được hỗ trợ nhanh nhất.' },
      ko: { eyebrow: 'CONTACT', title: '연락처', desc: '비바이브 핫라인, Zalo, 이메일 및 사무소 주소 – 알맞은 채널로 빠르게 문의하세요.' }
    },
    'blog': {
      sections: ['#blog'],
      vi: { eyebrow: 'BLOG', title: 'Blog', desc: 'Tin tức, kiến thức K-Beauty và cập nhật mới nhất từ beVIBE.' },
      ko: { eyebrow: 'BLOG', title: '블로그', desc: 'K-뷰티 소식과 비바이브의 최신 업데이트.' }
    }
  };

  function parseRoute() {
    const hash = window.location.hash;
    if (!hash || hash === '#' || hash === '#/') return { page: 'home', params: {} };
    if (!hash.startsWith('#/')) return null; // plain in-page anchor
    const [path, query = ''] = hash.slice(2).split('?');
    const parts = path.split('/').filter(Boolean);
    const params = Object.fromEntries(new URLSearchParams(query));
    if (parts[0] === 'blog' && parts[1] && blogPosts.some((p) => p.slug === parts[1])) {
      return { page: 'post', slug: parts[1], params };
    }
    if (parts[0] === 'san-pham' && parts[1] && productIndex.some((e) => e.id === parts[1])) {
      return { page: 'product', productId: parts[1], params };
    }
    if (parts[0] === 'thuong-hieu' && parts[1] && brandsData.some((b) => b.id === parts[1])) {
      return { page: 'brand', brandId: parts[1], params };
    }
    return PAGE_DEFS[parts[0]] ? { page: parts[0], params } : { page: 'home', params: {} };
  }

  function navigate(path) {
    const target = `#/${path}`;
    if (window.location.hash === target) renderRoute();
    else window.location.hash = target;
  }

  function renderPageHero() {
    if (!pageHero || currentRoute.page === 'home' || currentRoute.page === 'product') return;
    const isVi = currentLang === 'vi';
    const crumbs = [`<a href="#">${isVi ? 'Trang chủ' : '홈'}</a>`];
    let eyebrow = '';
    let title = '';
    let desc = '';
    let media = '';
    const meta = [];
    let actions = '';
    let extra = '';

    if (currentRoute.page === 'post') {
      const post = blogPosts.find((p) => p.slug === currentRoute.slug);
      crumbs.push(`<a href="#/blog">Blog</a>`);
      title = post.title;
      desc = escapeHtml(post.excerpt);
      meta.push(blogCategoryLabel(post.category), formatPostDate(post.date), `${post.readTime} phút đọc`);
    } else if (currentRoute.page === 'brand') {
      const b = brandsData.find((x) => x.id === currentRoute.brandId);
      crumbs.push(`<a href="#/thuong-hieu">${isVi ? 'Thương hiệu' : '브랜드'}</a>`);
      eyebrow = b.badge || '';
      title = b.name;
      desc = isVi ? b.descVi : b.descKo;
      media = b.coverImage ? `<div class="page-hero-media"><img src="${b.coverImage}" alt="${escapeHtml(b.name)}"></div>` : '';
      meta.push(`${b.productsVi.length} ${isVi ? 'sản phẩm' : '개 제품'}`);
      if ((b.lines || []).length) meta.push(`${b.lines.length} ${isVi ? 'dòng sản phẩm' : '제품 라인'}`);
      const story = isVi ? b.storyVi : b.storyKo;
      const tech = isVi ? b.techVi : b.techKo;
      const infoCard = (icon, heading, text) => text ? `
        <article class="brand-info-card">
          <h2 class="brand-info-title">${icon}<span>${heading}</span></h2>
          <p>${text}</p>
        </article>` : '';
      extra = (story || tech) ? `
        <div class="brand-info-grid">
          ${infoCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
            isVi ? 'Câu chuyện thương hiệu' : '브랜드 히스토리', story)}
          ${infoCard('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            isVi ? 'Công nghệ sinh học & hoạt chất độc quyền' : '핵심 독자 기술 및 유효 성분', tech)}
        </div>` : '';
    } else {
      const t = PAGE_DEFS[currentRoute.page][isVi ? 'vi' : 'ko'];
      eyebrow = t.eyebrow;
      title = t.title;
      desc = t.desc;
      if (currentRoute.page === 'san-pham') {
        meta.push(
          `${productIndex.length} ${isVi ? 'sản phẩm' : '개 제품'}`,
          `${brandsData.length} ${isVi ? 'thương hiệu' : '개 브랜드'}`,
          `${CATEGORY_DEFS.length} ${isVi ? 'danh mục' : '개 카테고리'}`
        );
      } else if (currentRoute.page === 'thuong-hieu') {
        meta.push(`${brandsData.length} ${isVi ? 'thương hiệu' : '개 브랜드'}`, `${productIndex.length} ${isVi ? 'sản phẩm' : '개 제품'}`);
      }
    }
    crumbs.push(`<span>${escapeHtml(title)}</span>`);

    pageHero.innerHTML = `
      <div class="container page-hero-inner ${media ? 'has-media' : ''} ${currentRoute.page === 'post' ? 'is-post' : ''}">
        <div>
          <nav class="page-breadcrumb" aria-label="Breadcrumb">${crumbs.join('<span class="sep">/</span>')}</nav>
          <h1 class="page-hero-title">${escapeHtml(title)}</h1>
          ${desc ? `<p class="page-hero-desc">${desc}</p>` : ''}
          ${extra}
          ${meta.length ? `<div class="page-hero-meta">${meta.map((m) => `<span>${m}</span>`).join('')}</div>` : ''}
          ${actions}
        </div>
        ${media}
      </div>
    `;
    document.title = `${title} · ${baseTitle}`;
  }

  function renderRoute({ initial = false } = {}) {
    if (contactSection && contactSection.classList.contains('as-modal')) closeContactModal();
    let route = parseRoute();
    if (!route) {
      if (!initial) return; // in-page anchor while on a page: keep the page
      route = { page: 'home', params: {} };
    }
    currentRoute = route;
    const isHome = route.page === 'home';
    const def = PAGE_DEFS[route.page];

    if (publicMain) {
      const visible = new Set();
      if (!isHome) {
        def.sections.forEach((sel) => publicMain.querySelectorAll(`:scope > ${sel}`).forEach((el) => visible.add(el)));
      }
      Array.from(publicMain.children).forEach((el) => {
        if (el === pageHero) el.hidden = isHome;
        else el.hidden = isHome ? el.hasAttribute('data-page-only') : !visible.has(el);
      });
      publicMain.classList.toggle('is-subpage', !isHome);
    }

    // Catalogue state for the products / brand pages; home goes back to the carousel
    const p = route.params || {};
    if (route.page === 'san-pham') {
      Object.assign(catalogState, { brand: 'all', line: 'all', category: 'all', query: p.q || '', expanded: true });
      pageFilter.cats = new Set(p.cat ? [p.cat] : []);
      pageFilter.brands = new Set(p.brand ? [p.brand] : []);
      pageFilter.lines = new Set();
      pageFilter.concerns = new Set(p.concern && CONCERN_DEFS.some((c) => c.id === p.concern) ? [p.concern] : []);
    } else if (route.page === 'brand') {
      Object.assign(catalogState, { brand: route.brandId, line: p.line || 'all', category: 'all', query: '', expanded: true });
    } else {
      Object.assign(catalogState, { brand: HOME_OFFICIAL_BRAND, line: 'all', category: 'all', query: '', expanded: false });
    }
    if (headerSearchInput) headerSearchInput.value = catalogState.query;
    if (productsSection) {
      productsSection.classList.toggle('is-page', route.page === 'san-pham' || route.page === 'brand');
      productsSection.classList.toggle('is-brand-page', route.page === 'brand');
      productsSection.classList.toggle('is-filter-page', route.page === 'san-pham');
      document.getElementById('catalogLayout')?.classList.remove('filters-open');
    }
    renderProductCatalog();

    if (route.page === 'product') {
      if (pageHero) pageHero.hidden = true;
      if (shop) shop.renderProductPage(route.productId);
    } else if (shop) {
      shop.leaveProductPage();
    }

    if (isHome) document.title = baseTitle;
    else renderPageHero();
    if (route.page === 'blog') renderBlogPage();
    if (route.page === 'post') renderBlogPost(blogPosts.find((p) => p.slug === route.slug));
    pageSeo(route);

    const navKey = route.page === 'brand' ? 'thuong-hieu' : route.page === 'post' ? 'blog' : route.page === 'product' ? 'san-pham' : route.page;
    document.querySelectorAll('.hnav-link, .mobile-nav-link').forEach((a) => {
      a.classList.toggle('is-active', !isHome && a.getAttribute('href') === `#/${navKey}`);
    });

    if (!(initial && isHome)) window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', () => renderRoute());

  // Clicking the link of the page you are already on still resets it to the top
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === window.location.hash) renderRoute();
  });

  // Initial Initialization
  shop = initShop({
    productIndex,
    brandsData,
    getLang: () => currentLang,
    localized,
    formatVnd,
    escapeHtml,
    showToast,
    navigate,
    lineLabel,
    categoryLabel,
    productCardHtml,
    prefillProductInquiry
  });
  account = initAccount({ shop, getLang: () => currentLang, showToast, escapeHtml });
  applyTranslations();
  initHeroSlideshow();
  renderBlogFeatured();
  renderRoute({ initial: true });

  /**
   * Thank-you promo popup: shows once per browser session on the public site.
   * Clicking the card opens the products page; X / backdrop / Esc closes it.
   */
  (function initPromoPopup() {
    const popup = document.getElementById('promoPopup');
    if (!popup) return;
    const SEEN_KEY = 'bevibe_promo_seen';
    const markSeen = () => { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {} };
    const close = () => {
      popup.classList.remove('open');
      markSeen();
      setTimeout(() => { popup.hidden = true; }, 250);
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };

    popup.querySelectorAll('[data-promo-close]').forEach((el) => el.addEventListener('click', close));
    document.getElementById('promoCardLink')?.addEventListener('click', () => close());

    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
    if (seen) return;
    setTimeout(() => {
      popup.hidden = false;
      requestAnimationFrame(() => popup.classList.add('open'));
      document.addEventListener('keydown', onKey);
    }, 1200);
  })();

});
