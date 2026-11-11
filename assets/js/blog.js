/**
 * beVIBE blog — SEO-optimised customer FAQ articles about skincare & product usage.
 *
 * Per post:
 *  - slug            URL part, contains the focus keyword (no accents)
 *  - keyword         focus keyword the article targets
 *  - seoTitle        <title> (≤ 60 characters, keyword first)
 *  - metaDescription meta description (≤ 160 characters, keyword + benefit)
 *  - title / excerpt H1 shown on the page and card summary
 *  - content         HTML body: H2/H3 hierarchy, images with descriptive alt,
 *                    internal links to products, brands and other posts
 *  - faq             rendered as "Câu hỏi thường gặp" + FAQPage structured data
 *  - products        related product ids from translations.js
 */
export const blogCategories = [
  { id: 'kien-thuc', label: 'Kiến thức làn da' },
  { id: 'huong-dan', label: 'Hướng dẫn sử dụng' }
];

const fig = (src, alt) =>
  `<figure class="blog-figure"><img src="${src}" alt="${alt}" loading="lazy" width="1000" height="800"><figcaption>${alt}</figcaption></figure>`;

export const blogPosts = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'thu-tu-skincare-sang-toi',
    keyword: 'thứ tự skincare',
    category: 'huong-dan',
    date: '2026-11-08',
    readTime: 6,
    cover: '/assets/images/dr-bargo/dr.bargo_serum.jpg',
    seoTitle: 'Thứ tự skincare sáng và tối chuẩn cho người mới bắt đầu',
    metaDescription: 'Thứ tự skincare chuẩn buổi sáng và buổi tối: bước nào trước, bước nào sau, chờ bao lâu giữa các bước. Hướng dẫn dễ áp dụng cho mọi loại da.',
    title: 'Thứ tự skincare sáng và tối: bước nào trước, bước nào sau?',
    excerpt: 'Dùng đúng sản phẩm nhưng sai thứ tự skincare có thể làm giảm hiệu quả. Đây là quy tắc đơn giản để sắp xếp routine sáng – tối chuẩn.',
    products: ['drbargo-2', 'drbargo-4', 'drbargo-3', 'drbargo-1'],
    content: `
      <p><strong>Thứ tự skincare chuẩn</strong> là thoa sản phẩm từ kết cấu mỏng nhẹ đến đặc: làm sạch → toner → serum → kem dưỡng, buổi sáng kết thúc bằng kem chống nắng. Sắp xếp đúng giúp mỗi lớp sản phẩm tiếp xúc trực tiếp với da và phát huy tối đa hiệu quả. Bài viết dưới đây hướng dẫn chi tiết routine buổi sáng, buổi tối và những lỗi thường gặp.</p>

      <h2>Vì sao thứ tự skincare quan trọng?</h2>
      <p>Mỗi sản phẩm có kích thước phân tử và kết cấu khác nhau. Nếu thoa kem dưỡng đặc trước, lớp kem sẽ tạo màng ngăn khiến serum phía sau khó thẩm thấu. Ngược lại, thoa đúng thứ tự giúp hoạt chất đi vào da tốt hơn, tiết kiệm sản phẩm và hạn chế vón cục.</p>

      <h2>Quy tắc vàng: từ mỏng đến dày</h2>
      ${fig('/assets/images/dr-bargo/dr.bargo_serum.jpg', 'Serum Dr.BARGO kết cấu lỏng nhẹ được thoa trước kem dưỡng trong thứ tự skincare')}
      <p>Hãy thoa sản phẩm dạng nước trước (toner, essence), sau đó đến dạng lỏng sánh (serum, ampoule), cuối cùng là dạng kem để “khóa” các lớp bên dưới. Dầu dưỡng (nếu có) dùng sau kem dưỡng vào buổi tối.</p>

      <h2>Thứ tự skincare buổi sáng (5 bước)</h2>
      ${fig('/assets/images/catalog/dr-bargo/drbargo-2.jpg', 'Sữa rửa mặt tạo bọt dịu nhẹ – bước đầu tiên trong thứ tự skincare buổi sáng')}
      <ol>
        <li><strong>Làm sạch nhẹ:</strong> sữa rửa mặt dịu nhẹ, hoặc chỉ rửa nước với da khô.</li>
        <li><strong>Toner:</strong> cân bằng độ ẩm, giúp da sẵn sàng hấp thu các bước sau.</li>
        <li><strong>Serum:</strong> serum cấp ẩm, chống oxy hóa hoặc phục hồi.</li>
        <li><strong>Kem dưỡng / emulsion:</strong> giữ ẩm suốt cả ngày.</li>
        <li><strong>Kem chống nắng:</strong> luôn là bước cuối cùng. Xem thêm <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</li>
      </ol>

      <h2>Thứ tự skincare buổi tối (6 bước)</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-11.jpg', 'Mặt nạ dưỡng da Neuraderm dùng 2 – 3 lần mỗi tuần trong routine buổi tối')}
      <ol>
        <li><strong>Tẩy trang:</strong> loại bỏ kem chống nắng, lớp trang điểm và bụi bẩn.</li>
        <li><strong>Sữa rửa mặt:</strong> làm sạch lần hai (double cleansing).</li>
        <li><strong>Toner.</strong></li>
        <li><strong>Serum / ampoule đặc trị:</strong> buổi tối là thời điểm phù hợp nhất cho hoạt chất mạnh — đọc thêm <a href="#/blog/vi-sao-serum-buoi-toi-chong-nang-buoi-sang">vì sao nên dùng serum buổi tối</a>.</li>
        <li><strong>Kem dưỡng:</strong> khóa ẩm và hỗ trợ da phục hồi qua đêm.</li>
        <li><strong>Mặt nạ:</strong> 2 – 3 lần mỗi tuần, đắp sau toner hoặc thay cho bước serum.</li>
      </ol>

      <h3>Nên chờ bao lâu giữa các bước?</h3>
      <p>Khoảng <strong>30 – 60 giây</strong> là đủ để lớp trước thấm bớt. Riêng kem chống nắng nên chờ kem dưỡng khô ráo rồi mới thoa để lớp chống nắng bám đều.</p>

      <h2>Những lỗi thường gặp khi sắp xếp routine</h2>
      <ul>
        <li>Thoa kem dưỡng trước serum.</li>
        <li>Dùng quá nhiều hoạt chất mạnh cùng lúc (retinol, AHA/BHA, vitamin C nồng độ cao).</li>
        <li>Bỏ qua kem chống nắng vào buổi sáng.</li>
        <li>Thêm nhiều sản phẩm mới cùng lúc nên không biết sản phẩm nào gây kích ứng.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Một routine cơ bản chỉ cần <strong>làm sạch – dưỡng ẩm – chống nắng</strong>. Khi đã quen, hãy thêm từng sản phẩm và theo dõi da trong 1 – 2 tuần. Bộ 4 bước <a href="#/thuong-hieu/dr-bargo">Dr.BARGO Dòng 31°C</a> (sữa rửa mặt – toner – serum – emulsion) là ví dụ cho một thứ tự skincare gọn, đủ và dễ duy trì.</p>
    `,
    faq: [
      { q: 'Toner hay serum dùng trước?', a: 'Toner dùng trước serum. Toner có kết cấu dạng nước, giúp cân bằng và làm ẩm da để serum thẩm thấu tốt hơn.' },
      { q: 'Kem chống nắng thoa trước hay sau kem dưỡng?', a: 'Kem chống nắng là bước cuối cùng của routine buổi sáng, thoa sau kem dưỡng và trước lớp trang điểm.' },
      { q: 'Có bắt buộc phải dùng đủ tất cả các bước skincare?', a: 'Không. Routine tối thiểu gồm làm sạch, dưỡng ẩm và chống nắng. Các bước khác bổ sung tùy nhu cầu và tình trạng da.' }
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'vi-sao-serum-buoi-toi-chong-nang-buoi-sang',
    keyword: 'dùng serum buổi tối',
    category: 'kien-thuc',
    date: '2026-11-05',
    readTime: 5,
    cover: '/assets/images/neuraderm/neuraderm_serum_03.webp',
    seoTitle: 'Vì sao nên dùng serum buổi tối, kem chống nắng buổi sáng?',
    metaDescription: 'Giải thích vì sao nên dùng serum buổi tối và kem chống nắng buổi sáng theo nhịp sinh học của da, kèm gợi ý routine sáng – tối dễ áp dụng.',
    title: 'Vì sao nên dùng serum đặc trị buổi tối và kem chống nắng buổi sáng?',
    excerpt: 'Không phải ngẫu nhiên mà chuyên gia khuyên dùng serum buổi tối. Cùng tìm hiểu nhịp sinh học của làn da để chăm sóc đúng thời điểm.',
    products: ['neura-3', 'neura-9', 'stemc-3'],
    content: `
      <p><strong>Nên dùng serum đặc trị buổi tối</strong> vì đây là lúc da nghỉ ngơi, tập trung phục hồi và không bị ánh nắng làm giảm hiệu quả hoạt chất. Ngược lại, ban ngày da liên tục tiếp xúc tia UV nên cần ưu tiên <strong>kem chống nắng</strong> để bảo vệ. Hiểu nhịp sinh học này giúp bạn chọn đúng sản phẩm cho từng thời điểm.</p>

      <h2>Ban ngày: da cần được bảo vệ</h2>
      ${fig('/assets/images/stem-c/stem_c_sunblock_01.png', 'Kem chống nắng MediPharm Stem C Sunblock bảo vệ da khỏi tia UV vào ban ngày')}
      <p>Vào ban ngày, da tiếp xúc với tia UV, khói bụi và ánh sáng xanh — các tác nhân gây lão hóa sớm, sạm nám và làm suy yếu hàng rào bảo vệ da. Vì vậy routine buổi sáng nên tập trung vào <strong>bảo vệ</strong>: cấp ẩm, chống oxy hóa và quan trọng nhất là kem chống nắng phổ rộng.</p>

      <h2>Ban đêm: thời điểm da tự phục hồi</h2>
      ${fig('/assets/images/neuraderm/neuraderm_serum_03.webp', 'Serum phục hồi Neuraderm phát huy tốt nhất khi dùng serum buổi tối')}
      <p>Khi bạn ngủ, da giảm tiếp xúc với tác nhân bên ngoài và tập trung vào quá trình tái tạo, sửa chữa. Đây là lúc lý tưởng để dùng serum, ampoule chứa peptide, hoạt chất chống lão hóa hoặc phục hồi chuyên sâu — da có nhiều thời gian hấp thu hơn.</p>

      <h3>Hoạt chất nào nên dùng vào buổi tối?</h3>
      <ul>
        <li><strong>Retinol / retinoid:</strong> dễ làm da nhạy cảm với ánh nắng.</li>
        <li><strong>AHA, BHA:</strong> tẩy tế bào chết hóa học, tăng nguy cơ bắt nắng.</li>
        <li><strong>Peptide, chống lão hóa:</strong> hỗ trợ tái tạo trong lúc da nghỉ ngơi.</li>
      </ul>

      <h3>Hoạt chất phù hợp buổi sáng</h3>
      <ul>
        <li><strong>Vitamin C, chất chống oxy hóa:</strong> hỗ trợ kem chống nắng chống lại gốc tự do.</li>
        <li><strong>Hyaluronic acid, Panthenol:</strong> cấp ẩm, giúp lớp trang điểm mịn hơn.</li>
      </ul>

      <blockquote><strong>Lưu ý:</strong> dùng serum đặc trị buổi tối không có nghĩa là bỏ qua chống nắng. Khi đang dùng hoạt chất mạnh, kem chống nắng ban ngày càng trở nên bắt buộc.</blockquote>

      <h2>Gợi ý routine sáng – tối dễ áp dụng</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-3.jpg', 'Neuraderm Coretime Ampoule dùng ở bước serum của routine buổi tối')}
      <ul>
        <li><strong>Sáng:</strong> làm sạch nhẹ → toner → serum cấp ẩm/chống oxy hóa → kem dưỡng → <a href="#/san-pham?cat=sun">kem chống nắng</a>.</li>
        <li><strong>Tối:</strong> tẩy trang → sữa rửa mặt → toner → serum/ampoule đặc trị (ví dụ <a href="#/thuong-hieu/neuraderm">Neuraderm Coretime</a>) → kem dưỡng.</li>
      </ul>
      <p>Chưa rõ nên thoa bước nào trước? Xem bài <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare sáng và tối</a>.</p>

      <h2>Kết luận</h2>
      <p>Ban ngày bảo vệ, ban đêm phục hồi — đó là nguyên tắc đơn giản để chọn đúng thời điểm dùng serum và kem chống nắng. Nếu da đang điều trị tại spa hoặc clinic, hãy hỏi ý kiến bác sĩ để chọn hoạt chất và tần suất phù hợp.</p>
    `,
    faq: [
      { q: 'Có thể dùng serum vào buổi sáng không?', a: 'Có. Buổi sáng nên chọn serum cấp ẩm hoặc chống oxy hóa như vitamin C; các serum chứa retinol hay AHA/BHA nên để dành cho buổi tối.' },
      { q: 'Dùng serum buổi tối có cần kem dưỡng không?', a: 'Nên dùng. Kem dưỡng giúp khóa ẩm và giữ hoạt chất của serum trên da trong suốt đêm.' },
      { q: 'Ở trong nhà buổi sáng có cần kem chống nắng không?', a: 'Nên dùng nếu ngồi gần cửa kính hoặc ra ngoài trong ngày, vì tia UVA có thể xuyên qua kính.' }
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'cham-soc-da-sau-laser-peel',
    keyword: 'chăm sóc da sau laser',
    category: 'kien-thuc',
    date: '2026-11-01',
    readTime: 6,
    cover: '/assets/images/catalog/neuraderm/neura-10.jpg',
    seoTitle: 'Chăm sóc da sau laser, peel đúng cách để phục hồi nhanh',
    metaDescription: 'Cách chăm sóc da sau laser, peel trong 1 – 2 tuần đầu: làm sạch dịu nhẹ, phục hồi hàng rào da, chống nắng và những điều cần tránh.',
    title: 'Da nhạy cảm sau laser, peel: chăm sóc thế nào để phục hồi nhanh?',
    excerpt: 'Sau liệu trình xâm lấn, hàng rào bảo vệ da rất yếu. Chăm sóc da sau laser đúng cách trong 1 – 2 tuần đầu quyết định kết quả liệu trình.',
    products: ['drbargo-3', 'drbargo-1', 'neura-10', 'neura-6'],
    content: `
      <p><strong>Chăm sóc da sau laser, peel</strong> cần tuân theo ba nguyên tắc: làm sạch thật dịu nhẹ, phục hồi hàng rào bảo vệ da và chống nắng nghiêm ngặt. Trong 1 – 2 tuần đầu, da thường đỏ, khô, căng rát và rất dễ kích ứng, nên cần tránh hoạt chất mạnh và tuân thủ hướng dẫn của bác sĩ điều trị.</p>

      <h2>Da thay đổi thế nào sau laser, peel?</h2>
      <p>Các liệu trình laser, peel hay phi kim tạo ra tổn thương có kiểm soát để kích thích da tái tạo. Vì vậy ngay sau liệu trình, hàng rào bảo vệ da bị suy yếu: da mất nước nhanh, dễ đỏ, bong tróc và nhạy cảm với ánh nắng hơn bình thường.</p>

      <h2>Nguyên tắc chăm sóc da sau laser: dịu nhẹ – phục hồi – chống nắng</h2>
      ${fig('/assets/images/dr-bargo/dr.bargo_serum.jpg', 'Serum Dr.BARGO chứa Ceramide, Panthenol, Madecassoside hỗ trợ chăm sóc da sau laser')}
      <ul>
        <li><strong>Làm sạch thật dịu:</strong> sữa rửa mặt độ pH nhẹ, không hạt, không chà xát; rửa bằng nước mát hoặc ấm nhẹ.</li>
        <li><strong>Phục hồi hàng rào da:</strong> ưu tiên sản phẩm chứa Ceramide, Panthenol (B5), Madecassoside — các thành phần giúp làm dịu và giữ ẩm.</li>
        <li><strong>Chống nắng nghiêm ngặt:</strong> da sau liệu trình rất dễ tăng sắc tố. Hạn chế ra nắng, che chắn kỹ và dùng kem chống nắng khi bác sĩ cho phép.</li>
      </ul>

      <h2>Những điều cần tránh trong 1 – 2 tuần đầu</h2>
      <ul>
        <li>Tẩy da chết (AHA, BHA, scrub) và retinol.</li>
        <li>Xông hơi, bơi lội, tập luyện ra nhiều mồ hôi.</li>
        <li>Cạy, gãi vùng da bong tróc — hãy để lớp da cũ tự bong.</li>
        <li>Trang điểm dày khi da còn đỏ rát.</li>
      </ul>

      <blockquote><strong>Quan trọng:</strong> mỗi liệu trình có hướng dẫn chăm sóc riêng. Luôn tuân theo chỉ định của bác sĩ; nếu da sưng, nóng, chảy dịch hoặc đau tăng dần, hãy liên hệ ngay cơ sở điều trị.</blockquote>

      <h2>Routine phục hồi da sau laser gợi ý</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-10.jpg', 'Kem dưỡng phục hồi Neuraderm Derma Cream MD cho giai đoạn sau laser, peel')}
      <h3>Buổi sáng</h3>
      <ol>
        <li>Rửa mặt bằng nước mát hoặc sữa rửa mặt dịu nhẹ.</li>
        <li>Serum phục hồi chứa Ceramide / Madecassoside.</li>
        <li>Kem dưỡng phục hồi.</li>
        <li>Kem chống nắng phổ rộng (khi được bác sĩ cho phép) và che chắn kỹ.</li>
      </ol>
      <h3>Buổi tối</h3>
      <ol>
        <li>Sữa rửa mặt dịu nhẹ.</li>
        <li>Serum phục hồi (ví dụ <a href="#/thuong-hieu/dr-bargo">Dr.BARGO Serum dòng 31°C</a>).</li>
        <li>Kem dưỡng phục hồi chuyên sâu (ví dụ <a href="#/thuong-hieu/neuraderm">Neuraderm Derma Cream MD</a>).</li>
      </ol>
      <p>Khi da đã ổn định, hãy quay lại routine thường ngày từ từ — tham khảo <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare chuẩn</a> và <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</p>

      <h2>Kết luận</h2>
      <p>Chăm sóc da sau laser đúng cách giúp da phục hồi nhanh, hạn chế thâm và giữ được kết quả liệu trình. Dòng <a href="#/thuong-hieu/dr-bargo">Dr.BARGO</a> do nhóm bác sĩ da liễu Gangnam phát triển, tập trung vào da tổn thương sau xâm lấn — phù hợp để spa, clinic tư vấn kèm liệu trình.</p>
    `,
    faq: [
      { q: 'Sau laser bao lâu thì được rửa mặt?', a: 'Thông thường có thể rửa mặt nhẹ nhàng bằng nước mát sau liệu trình, nhưng thời điểm cụ thể phụ thuộc loại laser — hãy làm theo hướng dẫn của bác sĩ điều trị.' },
      { q: 'Sau peel bao lâu thì dùng lại retinol, AHA, BHA?', a: 'Nên ngưng ít nhất 1 – 2 tuần hoặc đến khi da hết đỏ, hết bong tróc, và chỉ dùng lại khi bác sĩ cho phép.' },
      { q: 'Da sau laser có cần kem chống nắng không?', a: 'Rất cần. Da sau laser dễ tăng sắc tố, vì vậy cần che chắn kỹ và dùng kem chống nắng phổ rộng khi được bác sĩ cho phép.' }
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'cach-dung-kem-chong-nang-dung',
    keyword: 'cách dùng kem chống nắng',
    category: 'huong-dan',
    date: '2026-10-28',
    readTime: 5,
    cover: '/assets/images/catalog/medipharm/stemc-3.jpg',
    seoTitle: 'Cách dùng kem chống nắng đúng: lượng thoa và thời điểm',
    metaDescription: 'Cách dùng kem chống nắng đúng: thoa bao nhiêu là đủ, thoa lúc nào, bao lâu thoa lại và cách dặm lại khi đang trang điểm.',
    title: 'Dùng kem chống nắng đúng cách: bao nhiêu là đủ và khi nào cần thoa lại?',
    excerpt: 'Thoa quá ít hoặc quên thoa lại khiến kem chống nắng mất phần lớn tác dụng. Hướng dẫn cách dùng kem chống nắng đúng lượng, đúng thời điểm.',
    products: ['stemc-3', 'stemc-1'],
    content: `
      <p><strong>Cách dùng kem chống nắng đúng</strong> gồm ba điểm: thoa đủ lượng (khoảng 1/4 thìa cà phê cho mặt và cổ), thoa ở bước cuối của routine buổi sáng trước khi ra ngoài 15 phút, và thoa lại mỗi 2 – 3 giờ khi ở ngoài trời. Phần lớn chúng ta thoa quá ít nên chỉ số SPF thực tế thấp hơn nhiều so với con số trên bao bì.</p>

      <h2>Thoa kem chống nắng bao nhiêu là đủ?</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-3.jpg', 'Kem chống nắng Stem C Sunblock – thoa theo quy tắc hai ngón tay cho mặt và cổ')}
      <p>Chỉ số SPF được kiểm nghiệm với lượng <strong>2 mg/cm²</strong> da. Với khuôn mặt và cổ, lượng này tương đương khoảng <strong>1/4 thìa cà phê</strong>, hoặc dễ nhớ hơn là <strong>quy tắc hai ngón tay</strong>: bóp kem dài bằng hai đốt ngón tay trỏ và giữa.</p>

      <h2>Thoa kem chống nắng lúc nào?</h2>
      <ul>
        <li>Thoa ở <strong>bước cuối cùng</strong> của routine buổi sáng, sau kem dưỡng (xem <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare</a>).</li>
        <li>Thoa trước khi ra ngoài khoảng <strong>15 phút</strong> để kem bám đều trên da.</li>
        <li>Đừng quên các vùng hay bị bỏ sót: viền hàm, cổ, vành tai, mí mắt.</li>
      </ul>

      <h2>Bao lâu cần thoa lại kem chống nắng?</h2>
      ${fig('/assets/images/stem-c/stem_c_sunblock_01.png', 'Thoa lại kem chống nắng mỗi 2 – 3 giờ khi hoạt động ngoài trời')}
      <p>Kem chống nắng giảm hiệu quả theo thời gian, đặc biệt khi đổ mồ hôi hoặc lau mặt. Hãy thoa lại <strong>mỗi 2 – 3 giờ</strong> khi ở ngoài trời, và luôn thoa lại sau khi bơi, tập luyện hoặc lau mặt.</p>

      <h3>Đang trang điểm thì thoa lại thế nào?</h3>
      <p>Thấm nhẹ lớp dầu thừa bằng giấy thấm, sau đó dùng xịt chống nắng, phấn phủ có SPF hoặc dặm một lớp mỏng BB cream có SPF bằng mút.</p>

      <h2>Ở trong nhà có cần dùng kem chống nắng?</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-1.jpg', 'Stem C BB Cream có SPF tiện dặm lại khi đang trang điểm')}
      <p>Có, nếu bạn ngồi gần cửa kính hoặc ra vào ngoài trời thường xuyên — tia UVA có thể xuyên qua kính. Nếu ở trong phòng kín cả ngày, một lớp vào buổi sáng là đủ.</p>

      <h2>Chọn kem chống nắng theo loại da</h2>
      <ul>
        <li><strong>Da dầu, mụn:</strong> kết cấu mỏng nhẹ, ráo, không gây bí.</li>
        <li><strong>Da khô:</strong> kết cấu kem, có thêm thành phần dưỡng ẩm.</li>
        <li><strong>Da nhạy cảm, sau liệu trình:</strong> công thức dịu nhẹ, ít hương liệu — xem <a href="#/blog/cham-soc-da-sau-laser-peel">chăm sóc da sau laser, peel</a>.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Đủ lượng – đúng thời điểm – thoa lại đều đặn là bí quyết để kem chống nắng phát huy tác dụng. Tham khảo <a href="#/san-pham?cat=sun">danh mục chống nắng &amp; BB</a> của beVIBE, trong đó Stem C Sunblock và Stem C BB Cream của <a href="#/thuong-hieu/medipharm">MediPharm</a> là lựa chọn gọn nhẹ cho cả chống nắng lẫn che phủ nhẹ hằng ngày.</p>
    `,
    faq: [
      { q: 'Thoa kem chống nắng bao nhiêu là đủ cho mặt?', a: 'Khoảng 1/4 thìa cà phê cho mặt và cổ, tương đương quy tắc hai ngón tay — bóp kem dài bằng hai đốt ngón tay trỏ và giữa.' },
      { q: 'Bao lâu nên thoa lại kem chống nắng?', a: 'Mỗi 2 – 3 giờ khi ở ngoài trời, và luôn thoa lại sau khi bơi, đổ nhiều mồ hôi hoặc lau mặt.' },
      { q: 'Kem chống nắng thoa trước hay sau kem dưỡng?', a: 'Thoa sau kem dưỡng, là bước cuối cùng của routine buổi sáng và trước lớp trang điểm.' }
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'goi-dau-dung-cach-da-dau-dau-gau-rung-toc',
    keyword: 'gội đầu đúng cách',
    category: 'huong-dan',
    date: '2026-10-24',
    readTime: 6,
    cover: '/assets/images/catalog/smib/smib-3-g1.jpg',
    seoTitle: 'Gội đầu đúng cách cho da đầu dầu, gàu và tóc dễ rụng',
    metaDescription: 'Hướng dẫn gội đầu đúng cách 5 bước cho da đầu dầu, gàu, tóc dễ rụng: tần suất gội, nhiệt độ nước, cách massage và chọn dầu gội phù hợp.',
    title: 'Gội đầu đúng cách cho da đầu dầu, gàu và tóc dễ rụng',
    excerpt: 'Gội mỗi ngày có hại không? Nên để dầu gội trên da đầu bao lâu? Hướng dẫn gội đầu đúng cách giúp da đầu khỏe và giảm gãy rụng.',
    products: ['smib-3', 'smib-8', 'smib-1'],
    content: `
      <p><strong>Gội đầu đúng cách</strong> gồm 5 bước: chải gỡ rối, làm ướt bằng nước ấm, tạo bọt trên tay, massage da đầu bằng đầu ngón tay 1 – 2 phút và xả thật sạch. Tần suất gội phụ thuộc loại da đầu — da đầu dầu có thể gội hằng ngày, da đầu khô 2 – 3 lần mỗi tuần. Chọn dầu gội phù hợp giúp giảm gàu, bết dầu và hạn chế gãy rụng.</p>

      <h2>Bao lâu nên gội đầu một lần?</h2>
      <p>Không có con số chung cho tất cả. Da đầu dầu có thể gội hằng ngày hoặc cách ngày; da đầu khô nên gội 2 – 3 lần mỗi tuần. Điều quan trọng là chọn dầu gội dịu nhẹ, đủ lành tính để gội thường xuyên mà không làm khô da đầu.</p>

      <h2>5 bước gội đầu đúng cách</h2>
      ${fig('/assets/images/catalog/smib/smib-3-g1.jpg', 'Dầu gội SMIB LactoBio – tạo bọt và massage da đầu khi gội đầu đúng cách')}
      <ol>
        <li><strong>Chải tóc trước khi gội</strong> để gỡ rối, giảm gãy rụng khi tóc ướt.</li>
        <li><strong>Làm ướt bằng nước ấm</strong>, tránh nước quá nóng vì dễ làm khô và kích thích tiết dầu.</li>
        <li><strong>Tạo bọt trên tay</strong> rồi mới thoa lên da đầu, tập trung vào chân tóc.</li>
        <li><strong>Massage bằng đầu ngón tay</strong> (không dùng móng) khoảng 1 – 2 phút để dầu gội tiếp xúc đủ với da đầu.</li>
        <li><strong>Xả thật sạch</strong>, rồi dùng dầu xả hoặc kem ủ ở thân và ngọn tóc, tránh chân tóc.</li>
      </ol>

      <h3>Sau khi gội nên làm gì?</h3>
      <p>Thấm khô bằng khăn mềm, không chà xát mạnh. Sấy khô da đầu bằng chế độ mát hoặc ấm nhẹ — để da đầu ẩm lâu, nhất là khi đi ngủ, là điều kiện thuận lợi cho gàu và ngứa.</p>

      <h2>Tóc rụng bao nhiêu sợi mỗi ngày là bình thường?</h2>
      <p>Mỗi ngày rụng khoảng <strong>50 – 100 sợi</strong> là bình thường vì tóc luôn thay mới theo chu kỳ. Nếu tóc rụng thành mảng, rụng nhiều kéo dài hoặc da đầu đỏ, đau, hãy đi khám bác sĩ da liễu để được tư vấn.</p>

      <h2>Chọn dầu gội theo tình trạng da đầu</h2>
      ${fig('/assets/images/smib-banner.jpg', 'Bộ dầu gội và kem ủ SMIB cho da đầu dầu, gàu và tóc dễ rụng')}
      <ul>
        <li><strong>Da đầu dầu, gàu:</strong> công thức làm sạch dịu nhẹ, có thành phần hỗ trợ cân bằng như Zinc Pyrithione.</li>
        <li><strong>Tóc mỏng, dễ gãy rụng:</strong> ưu tiên sản phẩm có Biotin, Niacinamide, Panthenol.</li>
        <li><strong>Da đầu nhạy cảm:</strong> công thức lành tính, có men vi sinh (postbiotic) giúp cân bằng hệ vi sinh da đầu.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Gội đầu đúng cách và chọn đúng dầu gội là nền tảng cho da đầu khỏe, tóc chắc. Dòng <a href="#/thuong-hieu/smib">SMIB LactoBio</a> ứng dụng công nghệ 100 tỷ Postbiotic, kết hợp dầu gội và kem ủ để chăm sóc da đầu, phục hồi tóc ngay tại nhà — xem thêm trong <a href="#/san-pham?cat=hair">danh mục Tóc &amp; Da đầu</a>.</p>
    `,
    faq: [
      { q: 'Gội đầu mỗi ngày có hại không?', a: 'Không hại nếu dùng dầu gội dịu nhẹ. Da đầu dầu có thể gội hằng ngày; da đầu khô nên giảm còn 2 – 3 lần mỗi tuần.' },
      { q: 'Nên để dầu gội trên da đầu bao lâu?', a: 'Massage khoảng 1 – 2 phút để dầu gội tiếp xúc đủ với da đầu, sau đó xả thật sạch.' },
      { q: 'Rụng bao nhiêu sợi tóc mỗi ngày là bình thường?', a: 'Khoảng 50 – 100 sợi mỗi ngày là bình thường. Nếu rụng thành mảng hoặc kéo dài, nên đi khám bác sĩ da liễu.' }
    ]
  }
];
