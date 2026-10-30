/**
 * beVIBE - Interactive Web Application Logic
 * Korean Aesthetic & B2B Cosmetic Partnership Platform
 */
import { i18nData, brandsData, servicesDetailsData } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentLang = localStorage.getItem('bevibe_lang') || 'vi';
  let activeBrandFilter = 'all';
  let activeCatalogBrand = 'all';
  let currentActiveBrandId = 'dr-bargo';
  let currentActiveServiceId = 'distribution';

  // --- Elements ---
  const langToggleBtn = document.getElementById('langToggle');
  const langToggleMobile = document.getElementById('langToggleMobile');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const brandsGrid = document.getElementById('brandsGrid');
  const brandFilterBtns = document.querySelectorAll('.brand-filter-btn');
  const productCatalogGrid = document.getElementById('productCatalogGrid');
  const catalogTabBtns = document.querySelectorAll('.catalog-tab-btn');
  const inquiryForm = document.getElementById('inquiryForm');
  const formResultArea = document.getElementById('formResultArea');
  const proposalTextarea = document.getElementById('proposalTextarea');
  const copyProposalBtn = document.getElementById('copyProposalBtn');
  const sendZaloBtn = document.getElementById('sendZaloBtn');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  const toastNotification = document.getElementById('toastNotification');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // OEM Calculator Elements
  const calcProduct = document.getElementById('calcProduct');
  const calcPackaging = document.getElementById('calcPackaging');
  const calcQuantity = document.getElementById('calcQuantity');
  const calcEstCost = document.getElementById('calcEstCost');
  const calcEstTime = document.getElementById('calcEstTime');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  // OEM Steps
  const stepItems = document.querySelectorAll('.step-card');

  // --- Modals Elements ---
  const brandDetailModal = document.getElementById('brandDetailModal');
  const closeBrandModalBtn = document.getElementById('closeBrandModalBtn');
  const closeBrandModalFooterBtn = document.getElementById('closeBrandModalFooterBtn');
  const modalRequestBrandQuoteBtn = document.getElementById('modalRequestBrandQuoteBtn');

  const serviceDetailModal = document.getElementById('serviceDetailModal');
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

    // Re-render product catalog with new language
    renderProductCatalog(activeCatalogBrand);

    // Re-calculate OEM estimate with localized currency/text
    calculateOemEstimate();

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

  /**
   * Render Brand Cards based on active filter and current language
   */
  function renderBrands() {
    if (!brandsGrid) return;
    const isVi = currentLang === 'vi';
    const filtered = activeBrandFilter === 'all'
      ? brandsData
      : brandsData.filter(b => b.category === activeBrandFilter);

    brandsGrid.innerHTML = filtered.map(b => {
      const desc = isVi ? b.descVi : b.descKo;
      const highlights = isVi ? b.highlightsVi : b.highlightsKo;
      const prodCount = isVi ? b.productsVi.length : b.productsKo.length;
      return `
        <article class="brand-card has-cover" data-brand-id="${b.id}">
          <div class="brand-card-cover" style="cursor: pointer;" onclick="window.openBrandModal('${b.id}')">
            <img src="${b.coverImage || '/assets/images/hero.jpg'}" alt="${b.name}" loading="lazy">
            <div class="brand-card-cover-overlay">
              <span class="brand-badge">${b.badge}</span>
              <span class="brand-prods-pill">${prodCount} ${isVi ? 'sản phẩm' : '개 품목'}</span>
            </div>
          </div>
          <div class="brand-card-body" style="cursor: pointer;" onclick="window.openBrandModal('${b.id}')">
            <div class="brand-card-submeta">
              <span class="brand-origin">${b.origin}</span>
              ${b.ebookUrl ? `<span class="brand-ebook-indicator">📖 Ebook Online</span>` : ''}
            </div>
            <h3 class="brand-name">${b.name}</h3>
            <p class="brand-tagline">${b.tagline}</p>
            <p class="brand-desc">${desc}</p>
            <div class="brand-highlights">
              ${highlights.map(h => `<span class="brand-pill"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> ${h}</span>`).join('')}
            </div>
          </div>
          <div class="brand-card-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <button class="btn-text-link trigger-brand-detail-btn" data-brand-id="${b.id}" style="font-weight: 700;">
              ${isVi ? 'Xem chi tiết hãng ℹ️ ↗' : '브랜드 상세 정보 ℹ️ ↗'}
            </button>
            <button class="btn-text-link request-brand-info-btn" data-brand="${b.name}" style="color: var(--text-muted); font-size: 0.78rem;">
              ${isVi ? 'Báo giá sỉ ↗' : '도매 문의 ↗'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click events for direct brand detail modal
    document.querySelectorAll('.trigger-brand-detail-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const brandId = btn.getAttribute('data-brand-id');
        openBrandModal(brandId);
      });
    });

    // Attach click events for direct brand quotation prefill
    document.querySelectorAll('.request-brand-info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const brandName = btn.getAttribute('data-brand');
        prefillBrandInquiry(brandName);
      });
    });
  }

  /**
   * Render Product Catalog Grid in Section 03
   */
  function renderProductCatalog(brandFilter = 'all') {
    if (!productCatalogGrid) return;
    const isVi = currentLang === 'vi';
    
    // Collect products with brand context
    let allProducts = [];
    brandsData.forEach(brand => {
      if (brandFilter === 'all' || brand.id === brandFilter) {
        const prods = isVi ? brand.productsVi : brand.productsKo;
        prods.forEach(p => {
          allProducts.push({
            ...p,
            brandId: brand.id,
            brandName: brand.name,
            brandBadge: brand.badge,
            ebookUrl: brand.ebookUrl,
            driveFolder: brand.driveFolder,
            // Fallback image if product doesn't have its own image
            image: p.image || (brand.id === 'dr-bargo' ? '/assets/images/hero.jpg' : brand.id === 'neuraderm' ? '/assets/images/lineup.jpg' : '/assets/images/hero.jpg')
          });
        });
      }
    });

    productCatalogGrid.innerHTML = allProducts.map(p => `
      <div class="catalog-product-card" data-brand="${p.brandId}">
        <div class="catalog-product-img-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <span class="catalog-brand-badge">${p.brandName}</span>
          ${p.tag ? `<span class="catalog-prod-tag">${p.tag}</span>` : ''}
        </div>
        <div class="catalog-product-body">
          <div class="catalog-product-meta">
            <span class="catalog-product-spec">${p.spec}</span>
            <span class="catalog-product-code">${p.brandBadge}</span>
          </div>
          <h4 class="catalog-product-title">${p.name}</h4>
          <p class="catalog-product-desc">${p.desc}</p>
          <div class="catalog-product-actions">
            ${p.ebookPage ? `
              <a href="${p.ebookPage}" target="_blank" rel="noopener noreferrer" class="btn-catalog-ebook">
                <span>📖 Ebook ↗</span>
              </a>
            ` : p.driveFolder ? `
              <a href="${p.driveFolder}" target="_blank" rel="noopener noreferrer" class="btn-catalog-ebook" style="color: var(--gold-dark); border-color: rgba(201,160,80,0.35);">
                <span>📁 Drive ↗</span>
              </a>
            ` : ''}
            <button class="btn-catalog-inquire" data-product-name="${p.name}" data-brand-name="${p.brandName}">
              <span>${isVi ? 'Báo giá sỉ ↗' : '도매 견적 ↗'}</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listeners to catalog inquiry buttons
    productCatalogGrid.querySelectorAll('.btn-catalog-inquire').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodName = btn.getAttribute('data-product-name');
        const brandName = btn.getAttribute('data-brand-name');
        prefillProductInquiry(prodName, brandName);
      });
    });
  }

  function prefillProductInquiry(productName, brandName) {
    const isVi = currentLang === 'vi';
    const serviceSelect = document.getElementById('formService');
    const messageInput = document.getElementById('formMessage');
    if (serviceSelect) {
      serviceSelect.value = 'Phân phối mỹ phẩm Hàn Quốc (Đại lý / Sỉ)';
    }
    if (messageInput) {
      messageInput.value = isVi 
        ? `Tôi quan tâm đến sản phẩm [${productName}] thuộc hãng ${brandName}. Vui lòng cung cấp bảng giá đại lý, số lượng đặt hàng tối thiểu (MOQ) và hồ sơ kiểm nghiệm sản phẩm.`
        : `beVIBE의 [${productName}] (${brandName}) 제품에 관심이 있습니다. 도매 단가표, 최소 발주 수량(MOQ) 및 위생허가 서류를 요청합니다.`;
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
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
      serviceSelect.value = 'Hợp tác tổng đại diện thương hiệu (Master Agent)';
    }
    if (messageInput) {
      messageInput.value = isVi 
        ? `Tôi quan tâm đến thương hiệu ${brandName} của beVIBE. Vui lòng gửi bảng báo giá sỉ, chính sách đại lý và catalogue sản phẩm chi tiết.`
        : `beVIBE의 ${brandName} 브랜드에 관심이 있습니다. 도매 공급가, 파트너십 정책 및 상세 카탈로그를 요청합니다.`;
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
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
              ${products.map(p => `
                <div class="modal-product-card ${p.image ? 'has-img' : ''}">
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
              `).join('')}
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
   * OEM Cost Calculator Engine
   */
  function calculateOemEstimate() {
    if (!calcProduct || !calcPackaging || !calcQuantity || !calcEstCost) return;
    const isVi = currentLang === 'vi';

    const baseUnitCosts = {
      serum: 45000,
      cream: 55000,
      sun: 48000,
      cleanser: 32000,
      toner: 36000,
      scalp: 52000
    };

    const packagingMultipliers = {
      standard: 1.0,
      premium: 1.35,
      custom: 1.65
    };

    const qty = parseInt(calcQuantity.value, 10) || 1000;
    const productKey = calcProduct.value;
    const packKey = calcPackaging.value;

    const unitBase = (baseUnitCosts[productKey] || 45000) * (packagingMultipliers[packKey] || 1.0);
    let discount = 1.0;
    if (qty >= 10000) discount = 0.82;
    else if (qty >= 5000) discount = 0.88;
    else if (qty >= 3000) discount = 0.94;

    const finalUnit = Math.round(unitBase * discount);
    const totalMin = Math.round(finalUnit * qty * 0.95);
    const totalMax = Math.round(finalUnit * qty * 1.15);

    if (isVi) {
      calcEstCost.textContent = `${(totalMin / 1000000).toFixed(0)} - ${(totalMax / 1000000).toFixed(0)} triệu VNĐ (~${finalUnit.toLocaleString('vi-VN')} đ/sp)`;
      calcEstTime.textContent = qty >= 5000 ? '40 - 50 ngày (sản xuất & thông quan)' : '35 - 42 ngày (chuẩn CGMP)';
    } else {
      const krwMin = Math.round(totalMin * 0.054 / 10000);
      const krwMax = Math.round(totalMax * 0.054 / 10000);
      calcEstCost.textContent = `약 ${krwMin.toLocaleString()}만 ~ ${krwMax.toLocaleString()}만 원 (개당 약 ${(finalUnit * 0.054).toFixed(0)}원)`;
      calcEstTime.textContent = qty >= 5000 ? '약 40~50일 (생산 및 베트남 통관)' : '약 35~42일 (CGMP 생산)';
    }
  }

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

  // Brand Filtering in Section 03
  brandFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      brandFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeBrandFilter = btn.getAttribute('data-filter') || 'all';
      renderBrands();
    });
  });

  // Product Catalog Brand Filtering in Section 03
  if (catalogTabBtns) {
    catalogTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catalogTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCatalogBrand = btn.getAttribute('data-catalog-brand') || 'all';
        renderProductCatalog(activeCatalogBrand);
      });
    });
  }

  // Navigation Links & Dropdowns
  document.querySelectorAll('.open-brand-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const brandId = btn.getAttribute('data-brand') || 'dr-bargo';
      openBrandModal(brandId);
    });
  });

  const navBrandsLink = document.getElementById('navBrandsLink');
  if (navBrandsLink) {
    navBrandsLink.addEventListener('click', (e) => {
      // Open brand modal directly with first brand
      openBrandModal('dr-bargo');
    });
  }

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
        if (currentActiveServiceId === 'distribution') serviceSelect.value = 'Phân phối mỹ phẩm Hàn Quốc (Đại lý / Sỉ)';
        else if (currentActiveServiceId === 'partnership') serviceSelect.value = 'Hợp tác tổng đại diện thương hiệu (Master Agent)';
        else serviceSelect.value = 'Gia công sản xuất mỹ phẩm OEM / ODM trọn gói';
      }
      if (messageInput && service) {
        messageInput.value = isVi
          ? `Tôi muốn tìm hiểu chi tiết về gói hợp tác: ${service.titleVi}. Vui lòng liên hệ tư vấn lộ trình và chính sách ưu đãi.`
          : `beVIBE의 ${service.titleKo} 제휴 방안에 대해 상세한 상담을 요청합니다.`;
      }
      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBrandModal();
      closeServiceModal();
    }
  });

  // OEM Calculator Change Events
  if (calcProduct) calcProduct.addEventListener('change', calculateOemEstimate);
  if (calcPackaging) calcPackaging.addEventListener('change', calculateOemEstimate);
  if (calcQuantity) calcQuantity.addEventListener('input', calculateOemEstimate);

  // Apply Calculator to Contact Form
  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      const isVi = currentLang === 'vi';
      const prodText = calcProduct.options[calcProduct.selectedIndex].text;
      const packText = calcPackaging.options[calcPackaging.selectedIndex].text;
      const qtyText = calcQuantity.value;
      const estText = calcEstCost.textContent;

      const serviceSelect = document.getElementById('formService');
      const messageInput = document.getElementById('formMessage');

      if (serviceSelect) {
        serviceSelect.value = 'Gia công sản xuất mỹ phẩm OEM / ODM trọn gói';
      }

      const noteText = isVi
        ? `[DỰ TOÁN OEM BEVIBE]\n• Sản phẩm: ${prodText}\n• Bao bì: ${packText}\n• Số lượng dự kiến: ${parseInt(qtyText).toLocaleString('vi-VN')} chai/hộp\n• Mức dự toán: ${estText}\n\n[GHI CHÚ DỰ ÁN]: `
        : `[beVIBE OEM 시뮬레이션 결과]\n• 제품군: ${prodText}\n• 패키지: ${packText}\n• 희망 수량: ${parseInt(qtyText).toLocaleString()}개\n• 예상 견적: ${estText}\n\n[문의 내용]: `;

      if (messageInput) {
        messageInput.value = noteText;
        messageInput.focus();
      }

      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      showToast(isVi ? 'Đã điền thông số dự toán vào biểu mẫu!' : '시뮬레이션 견적이 문의 양식에 적용되었습니다!');
    });
  }

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
          `Hotline/Zalo: 0988 123 456 | Email: contact@bevibe.vn`
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
          `전화/Zalo: (+84) 988 123 456 | 이메일: contact@bevibe.vn`
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
      const zaloUrl = `https://zalo.me/0988123456`;
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
      window.location.href = `mailto:contact@bevibe.vn?subject=${subject}&body=${body}`;
    });
  }

  // Header Scroll & Glass Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  });

  // Back To Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const slideDuration = 4500; // 4.5s per slide
    let progressStartTime = performance.now();
    let animFrame = null;
    let isPaused = false;

    const brandDescriptionsVi = {
      'neuraderm': 'Medytox Biotech · Tinh chất Coretime Ampoule & MD Cream y khoa',
      'dr-bargo': 'Gangnam Clinic Formula · Serum phục hồi màng bảo vệ da chuyên sâu',
      'stem-c': 'Cellular Bio Cell · Kem tế bào gốc thực vật & dưỡng sáng Glass Skin',
      'smib': '100 Tỷ Postbiotic · Dầu gội phủ bạc tự nhiên & trị liệu da đầu'
    };

    const brandDescriptionsKo = {
      'neuraderm': '메디톡스 바이오 · 코어타임 앰플 및 병원 처방 MD 크림',
      'dr-bargo': '강남 피부과 처방 · 손상 장벽 급속 리페어 세럼',
      'stem-c': '식물 줄기세포 · 리바이탈 크림 및 3중 기능성 BB크림',
      'smib': '1000억 포스트바이오틱스 · 컬러 체인지 샴푸 및 두피 케어'
    };

    function updateSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;

      // Update slide elements
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
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
      prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-goto'), 10);
        updateSlide(target);
      });
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const brandKey = chip.getAttribute('data-brand-chip');
        const targetIndex = Array.from(slides).findIndex(s => s.getAttribute('data-brand') === brandKey);
        if (targetIndex !== -1) {
          updateSlide(targetIndex);
        }
      });
    });

    // Pause on hover
    bannerCard.addEventListener('mouseenter', () => { isPaused = true; });
    bannerCard.addEventListener('mouseleave', () => { 
      isPaused = false; 
      const currentPct = parseFloat(progressFill?.style.width || '0');
      progressStartTime = performance.now() - (currentPct / 100 * slideDuration);
    });

    // Expose globally for convenience
    window.heroGoToSlide = function(idx) {
      updateSlide(idx);
    };

    // Initial start
    updateSlide(0);
  }

  // Initial Initialization
  applyTranslations();
  calculateOemEstimate();
  initHeroSlideshow();
});
