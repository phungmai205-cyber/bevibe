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
  { id: 'huong-dan', label: 'Hướng dẫn sử dụng' },
  { id: 'meo-lam-dep', label: 'Mẹo làm đẹp mỗi ngày' },
  { id: 'xu-huong', label: 'Xu hướng làm đẹp' }
];

/** Categories shown in the "Xu hướng & mẹo làm đẹp" block on the blog page */
export const trendCategoryIds = ['xu-huong', 'meo-lam-dep'];

const fig = (src, alt) =>
  `<figure class="blog-figure"><img src="${src}" alt="${alt}" loading="lazy" width="1000" height="800"><figcaption>${alt}</figcaption></figure>`;

export const blogPosts = [

  /* ================================================================== */
  /* Xu hướng làm đẹp                                                   */
  /* ------------------------------------------------------------------ 16 */
  {
    slug: 'xu-huong-phuc-hoi-da-da-tang-cong-nghe-liposome',
    keyword: 'công nghệ liposome trong mỹ phẩm',
    category: 'xu-huong',
    date: '2026-11-11',
    readTime: 5,
    cover: '/assets/images/blog/xu-huong-liposome-dr-bargo.jpg',
    seoTitle: 'Xu hướng phục hồi da đa tầng với công nghệ Liposome',
    metaDescription: 'Công nghệ Liposome trong mỹ phẩm là gì, vì sao phục hồi da đa tầng đang là xu hướng và cách chọn sản phẩm Liposome phù hợp cho da nhạy cảm, da treatment.',
    title: 'Cập nhật xu hướng phục hồi da đa tầng với công nghệ Liposome',
    excerpt: 'Không chỉ dưỡng bề mặt, xu hướng skincare mới tập trung đưa hoạt chất phục hồi vào nhiều tầng da. Liposome chính là “chiếc xe” giúp làm điều đó.',
    products: ['drbargo-3', 'drbargo-1', 'drbargo-4'],
    content: `
      <p><strong>Phục hồi da đa tầng</strong> là xu hướng chăm sóc da tập trung vào việc đưa hoạt chất đến đúng tầng da cần thiết thay vì chỉ dưỡng trên bề mặt. <strong>Công nghệ Liposome trong mỹ phẩm</strong> đóng vai trò then chốt: bọc hoạt chất trong các hạt lipid siêu nhỏ, giúp chúng thẩm thấu sâu hơn, ổn định hơn và ít gây kích ứng hơn.</p>

      <h2>Liposome là gì?</h2>
      ${fig('/assets/images/blog/xu-huong-liposome-dr-bargo.jpg', 'Bộ sản phẩm Dr.BARGO 31°C First Edition Hyaluronic ứng dụng công nghệ Liposome đa tầng')}
      <p>Liposome là những hạt cầu siêu nhỏ có lớp vỏ phospholipid — cấu trúc tương tự màng tế bào da. Nhờ “giống” với da, liposome dễ dung hợp với lớp sừng và giải phóng hoạt chất từ từ vào bên trong.</p>

      <h2>Vì sao phục hồi đa tầng trở thành xu hướng?</h2>
      <ul>
        <li><strong>Da treatment ngày càng phổ biến:</strong> retinol, peel, laser khiến nhu cầu phục hồi tăng mạnh.</li>
        <li><strong>Người dùng hiểu da hơn:</strong> không chỉ cần “mướt” bề mặt mà cần hàng rào da khỏe từ bên trong.</li>
        <li><strong>Xu hướng tối giản:</strong> ít sản phẩm hơn nhưng mỗi sản phẩm phải hiệu quả hơn.</li>
      </ul>

      <h2>Ưu điểm của công nghệ Liposome</h2>
      <ol>
        <li><strong>Thẩm thấu tốt hơn:</strong> hoạt chất phân tử lớn như Ceramide dễ đi vào lớp biểu bì.</li>
        <li><strong>Ổn định hoạt chất:</strong> lớp vỏ bảo vệ hoạt chất khỏi oxy hóa, ánh sáng.</li>
        <li><strong>Giải phóng từ từ:</strong> hoạt chất tác động kéo dài, ít gây “sốc” cho da nhạy cảm.</li>
        <li><strong>Dịu nhẹ:</strong> phù hợp với da yếu, da đang phục hồi.</li>
      </ol>

      <h2>Những thành phần hay được bọc Liposome</h2>
      <ul>
        <li>Ceramide, Cholesterol – củng cố hàng rào da.</li>
        <li>Panthenol, Madecassoside – làm dịu, giảm đỏ.</li>
        <li>Retinol, Vitamin C – giảm kích ứng, tăng độ ổn định.</li>
        <li>Peptide – hỗ trợ chống lão hóa. Xem thêm <a href="#/blog/peptide-la-gi-cong-dung-chong-lao-hoa">peptide là gì</a>.</li>
      </ul>

      <h2>Cách chọn sản phẩm Liposome</h2>
      <p>Đọc kỹ mô tả công nghệ và bảng thành phần, ưu tiên sản phẩm đến từ thương hiệu có phòng nghiên cứu rõ ràng. Với da nhạy cảm, nên chọn sản phẩm không hương liệu và có nồng độ hoạt chất phục hồi được công bố.</p>

      <h2>Kết luận</h2>
      <p>Phục hồi da đa tầng với Liposome là bước tiến giúp skincare “đúng chỗ” hơn. Dòng <a href="#/thuong-hieu/dr-bargo">Dr.BARGO 31°C</a> ứng dụng Liposome đa tầng để vận chuyển Ceramide NP, Panthenol và Madecassoside — lựa chọn đáng cân nhắc cho da nhạy cảm và da sau treatment. Xem thêm <a href="#/blog/ceramide-ket-hop-panthenol-b5-phuc-hoi-da-treatment">Ceramide kết hợp Panthenol B5</a>.</p>
    `,
    faq: [
      { q: 'Mỹ phẩm Liposome có dùng được cho da dầu không?', a: 'Được. Liposome chỉ là công nghệ vận chuyển hoạt chất; hãy chọn kết cấu mỏng nhẹ phù hợp với da dầu.' },
      { q: 'Liposome có an toàn không?', a: 'Vỏ liposome thường làm từ phospholipid tương tự màng tế bào, được đánh giá là lành tính và phù hợp cả da nhạy cảm.' },
      { q: 'Sản phẩm Liposome có cần dùng riêng không?', a: 'Không. Có thể dùng trong routine bình thường theo thứ tự từ mỏng đến dày.' }
    ]
  },

  /* ------------------------------------------------------------------ 17 */
  {
    slug: 'xu-huong-cham-soc-he-vi-sinh-da-microbiome',
    keyword: 'hệ vi sinh trên da',
    category: 'xu-huong',
    date: '2026-11-10',
    readTime: 5,
    cover: '/assets/images/blog/xu-huong-microbiome-neuraderm.jpg',
    seoTitle: 'Chăm sóc hệ vi sinh trên da: xu hướng skincare microbiome',
    metaDescription: 'Hệ vi sinh trên da là gì và vì sao skincare microbiome với prebiotic, probiotic, postbiotic đang là xu hướng? Cách nuôi dưỡng hệ vi sinh da khỏe mạnh.',
    title: 'Skincare microbiome: xu hướng chăm sóc hệ vi sinh trên da',
    excerpt: 'Prebiotic, probiotic, postbiotic xuất hiện ngày càng nhiều trên nhãn mỹ phẩm. Vì sao chăm sóc hệ vi sinh trên da lại được quan tâm đến vậy?',
    products: ['neura-8', 'neura-7', 'neura-16'],
    content: `
      <p>Trên bề mặt da có hàng tỷ vi sinh vật cùng sinh sống, tạo nên <strong>hệ vi sinh trên da</strong> (skin microbiome). Khi hệ vi sinh cân bằng, da khỏe, ít kích ứng và ít mụn. Đó là lý do skincare microbiome — chăm sóc da bằng prebiotic, probiotic và postbiotic — đang trở thành một trong những xu hướng nổi bật của ngành làm đẹp.</p>

      <h2>Hệ vi sinh trên da làm gì?</h2>
      ${fig('/assets/images/blog/xu-huong-microbiome-neuraderm.jpg', 'Bộ sản phẩm NEURADERM M.Biome với lợi khuẩn LACTO hỗ trợ hệ vi sinh trên da')}
      <ul>
        <li>Cạnh tranh, hạn chế vi khuẩn có hại phát triển.</li>
        <li>Duy trì độ pH hơi axit của da.</li>
        <li>Hỗ trợ hàng rào bảo vệ và phản ứng miễn dịch của da.</li>
      </ul>

      <h2>Điều gì làm mất cân bằng hệ vi sinh?</h2>
      <ul>
        <li>Rửa mặt quá nhiều, dùng sữa rửa mặt có tính tẩy mạnh.</li>
        <li>Lạm dụng tẩy tế bào chết, kháng sinh bôi kéo dài.</li>
        <li>Căng thẳng, thiếu ngủ, ô nhiễm môi trường.</li>
      </ul>

      <h2>Prebiotic, probiotic, postbiotic khác nhau thế nào?</h2>
      <ul>
        <li><strong>Prebiotic:</strong> “thức ăn” nuôi lợi khuẩn có sẵn trên da (ví dụ inulin, một số đường tự nhiên).</li>
        <li><strong>Probiotic:</strong> lợi khuẩn — trong mỹ phẩm thường ở dạng dịch lên men hoặc đã bất hoạt.</li>
        <li><strong>Postbiotic:</strong> các chất do lợi khuẩn tạo ra trong quá trình lên men (axit hữu cơ, peptide…), ổn định và dễ đưa vào công thức.</li>
      </ul>

      <h2>Cách nuôi dưỡng hệ vi sinh da khỏe</h2>
      <ol>
        <li>Làm sạch dịu nhẹ, pH cân bằng, không rửa mặt quá 2 lần/ngày.</li>
        <li>Giảm tần suất tẩy tế bào chết.</li>
        <li>Bổ sung sản phẩm chứa dịch lên men lợi khuẩn (Lactobacillus), prebiotic.</li>
        <li>Dưỡng ẩm đầy đủ — môi trường da đủ ẩm giúp lợi khuẩn phát triển.</li>
      </ol>

      <blockquote><strong>Bạn có biết?</strong> Xu hướng microbiome không chỉ dừng ở da mặt mà còn mở rộng sang da đầu. Các dòng dầu gội postbiotic như <a href="#/thuong-hieu/smib">SMIB LactoBio</a> ứng dụng nguyên lý này cho da đầu nhạy cảm.</blockquote>

      <h2>Kết luận</h2>
      <p>Chăm sóc hệ vi sinh trên da là cách tiếp cận “nuôi da” thay vì “ép da”. Dòng <a href="#/thuong-hieu/neuraderm">Neuraderm Neuro Lacto</a> với lợi khuẩn kết hợp Ceramide phù hợp cho da nhạy cảm, da mất cân bằng muốn theo đuổi xu hướng này.</p>
    `,
    faq: [
      { q: 'Mỹ phẩm probiotic có chứa vi khuẩn sống không?', a: 'Đa số không. Mỹ phẩm thường dùng dịch lên men hoặc lợi khuẩn đã bất hoạt để đảm bảo ổn định và an toàn.' },
      { q: 'Da mụn có nên dùng sản phẩm lợi khuẩn?', a: 'Có thể. Sản phẩm lợi khuẩn giúp cân bằng hệ vi sinh và làm dịu da, nhưng không thay thế thuốc trị mụn khi mụn viêm nặng.' },
      { q: 'Dùng chung lợi khuẩn với BHA, retinol được không?', a: 'Được. Lợi khuẩn còn giúp giảm khô rát do hoạt chất mạnh gây ra.' }
    ]
  },

  /* ------------------------------------------------------------------ 18 */
  {
    slug: 'skinimalism-xu-huong-skincare-toi-gian',
    keyword: 'skincare tối giản',
    category: 'xu-huong',
    date: '2026-11-09',
    readTime: 4,
    cover: '/assets/images/blog/xu-huong-skinimalism-medipharm.jpg',
    seoTitle: 'Skinimalism: xu hướng skincare tối giản cho da khỏe',
    metaDescription: 'Skinimalism – skincare tối giản là gì, vì sao ngày càng nhiều người theo đuổi và cách xây dựng routine tối giản 3 – 4 bước hiệu quả cho mọi loại da.',
    title: 'Skinimalism: xu hướng skincare tối giản “ít mà chất”',
    excerpt: 'Từ 10 bước skincare đến 3 – 4 bước cốt lõi: skinimalism giúp da khỏe hơn, tiết kiệm hơn và dễ duy trì hơn.',
    products: ['stemc-5', 'stemc-4', 'stemc-2', 'stemc-3'],
    content: `
      <p><strong>Skinimalism</strong> (skin + minimalism) là xu hướng <strong>skincare tối giản</strong>: dùng ít sản phẩm hơn nhưng chọn đúng sản phẩm, tập trung vào sức khỏe làn da thay vì chạy theo quá nhiều bước. Sau thời gian dài “nghiện” routine 10 bước, nhiều người nhận ra da lại khỏe hơn khi được chăm sóc đơn giản.</p>

      <h2>Vì sao skinimalism lên ngôi?</h2>
      ${fig('/assets/images/blog/xu-huong-skinimalism-medipharm.jpg', 'Bộ MediPharm Stem C gồm nước tẩy trang, toner, lotion và kem chống nắng cho routine tối giản')}
      <ul>
        <li><strong>Hạn chế quá tải:</strong> chồng quá nhiều hoạt chất dễ khiến da kích ứng, nổi mụn.</li>
        <li><strong>Tiết kiệm thời gian và chi phí.</strong></li>
        <li><strong>Dễ theo dõi:</strong> ít sản phẩm giúp biết rõ sản phẩm nào hợp, sản phẩm nào gây kích ứng.</li>
        <li><strong>Bền vững:</strong> ít bao bì, ít lãng phí.</li>
      </ul>

      <h2>Routine tối giản 4 bước</h2>
      <ol>
        <li><strong>Làm sạch:</strong> tẩy trang (nếu có kem chống nắng/trang điểm) và rửa mặt dịu nhẹ.</li>
        <li><strong>Cấp ẩm:</strong> toner hoặc serum cấp ẩm.</li>
        <li><strong>Dưỡng – phục hồi:</strong> một kem dưỡng phù hợp loại da.</li>
        <li><strong>Chống nắng:</strong> mỗi sáng, không bỏ qua.</li>
      </ol>
      <p>Muốn xử lý vấn đề cụ thể (thâm, lão hóa, mụn)? Chỉ thêm <em>một</em> hoạt chất treatment vào buổi tối.</p>

      <h2>Nguyên tắc chọn sản phẩm theo skinimalism</h2>
      <ul>
        <li>Ưu tiên sản phẩm đa năng, bảng thành phần ngắn gọn, rõ ràng.</li>
        <li>Không hương liệu, không cồn khô nếu da nhạy cảm.</li>
        <li>Thêm sản phẩm mới từng món một, theo dõi 2 – 4 tuần.</li>
      </ul>

      <blockquote><strong>Lưu ý:</strong> tối giản không có nghĩa là bỏ bước. Kem chống nắng và làm sạch vẫn là hai bước bắt buộc. Xem <a href="#/blog/routine-skincare-5-phut-cho-nguoi-ban-ron">routine 5 phút cho người bận rộn</a>.</blockquote>

      <h2>Kết luận</h2>
      <p>Skinimalism là lời nhắc rằng làn da đẹp đến từ sự phù hợp và đều đặn. Bộ <a href="#/thuong-hieu/medipharm">MediPharm Stem C</a> với đủ các bước cơ bản là gợi ý gọn nhẹ cho người theo đuổi xu hướng tối giản.</p>
    `,
    faq: [
      { q: 'Skincare tối giản có phù hợp với da mụn?', a: 'Rất phù hợp. Giảm số sản phẩm giúp hạn chế bít tắc và kích ứng, dễ tìm ra nguyên nhân gây mụn.' },
      { q: 'Bao nhiêu bước là tối giản?', a: 'Thường 3 – 4 bước: làm sạch, cấp ẩm, dưỡng và chống nắng (buổi sáng).' },
      { q: 'Có cần bỏ hết serum khi theo skinimalism?', a: 'Không. Bạn có thể giữ một serum đáp ứng nhu cầu chính của da.' }
    ]
  },

  /* ================================================================== */
  /* Mẹo làm đẹp mỗi ngày                                               */
  /* ------------------------------------------------------------------ 11 */
  {
    slug: 'ceramide-ket-hop-panthenol-b5-phuc-hoi-da-treatment',
    keyword: 'ceramide kết hợp panthenol',
    category: 'meo-lam-dep',
    date: '2026-11-11',
    readTime: 5,
    cover: '/assets/images/catalog/dr-bargo/drbargo-3.jpg',
    seoTitle: 'Ceramide kết hợp Panthenol B5: cứu tinh cho da treatment',
    metaDescription: 'Vì sao Ceramide kết hợp Panthenol B5 được ưa chuộng cho da đang treatment? Cơ chế, cách dùng và công nghệ Liposome giúp hoạt chất thẩm thấu tốt hơn.',
    title: 'Tại sao Ceramide kết hợp Panthenol B5 đang là “cứu tinh” cho da treatment?',
    excerpt: 'Retinol, AHA/BHA hay laser đều khiến da khô, đỏ, châm chích. Bộ đôi Ceramide + Panthenol B5 giúp da vừa được “vá” hàng rào, vừa được làm dịu.',
    products: ['drbargo-3', 'drbargo-1', 'neura-6', 'neura-16'],
    content: `
      <p><strong>Ceramide kết hợp Panthenol B5</strong> là bộ đôi phục hồi được nhiều chuyên gia da liễu khuyên dùng cho da đang treatment (retinol, AHA/BHA, peel, laser). Ceramide bù lại lớp lipid gắn kết tế bào da, còn Panthenol làm dịu và giữ nước. Dùng cùng nhau, hai thành phần giúp da bớt khô rát, đỏ và châm chích trong giai đoạn nhạy cảm nhất.</p>

      <h2>Da treatment cần gì?</h2>
      <p>Các hoạt chất treatment hoạt động bằng cách tăng tốc độ thay mới tế bào hoặc tẩy lớp sừng già. Hệ quả là hàng rào bảo vệ da tạm thời mỏng đi, nước bốc hơi nhanh hơn và da dễ phản ứng với mọi thứ. Lúc này da cần hai việc: <em>vá lại hàng rào</em> và <em>làm dịu phản ứng viêm</em>.</p>

      <h2>Vai trò của từng thành phần</h2>
      ${fig('/assets/images/catalog/dr-bargo/drbargo-3.jpg', 'Serum Dr.BARGO chứa Ceramide NP và Panthenol hỗ trợ phục hồi da sau treatment')}
      <h3>Ceramide – “xi măng” của làn da</h3>
      <p>Ceramide chiếm khoảng một nửa lượng lipid ở lớp sừng. Khi bổ sung Ceramide từ bên ngoài, các khe hở giữa tế bào được lấp đầy, da giữ nước tốt hơn và ít bị kích ứng hơn.</p>
      <h3>Panthenol (Pro-Vitamin B5) – làm dịu và cấp ẩm</h3>
      <p>Panthenol chuyển hóa thành vitamin B5 trong da, có khả năng hút ẩm, làm dịu cảm giác nóng rát và hỗ trợ quá trình tái tạo tự nhiên của da.</p>
      <h3>Vì sao kết hợp lại hiệu quả hơn?</h3>
      <p>Panthenol kéo nước vào da, Ceramide “khóa” lượng nước đó lại. Một bên cấp, một bên giữ — da vừa đủ ẩm vừa không bị mất nước trở lại.</p>

      <h2>Công nghệ Liposome: đưa hoạt chất vào sâu hơn</h2>
      <p>Ceramide có phân tử khá lớn và khó thẩm thấu nếu chỉ hòa trong kem thông thường. Công nghệ Liposome bọc hoạt chất trong các hạt cầu lipid siêu nhỏ có cấu trúc giống màng tế bào, giúp Ceramide và Panthenol đi vào lớp biểu bì hiệu quả hơn. Đây là hướng đi của nhiều dòng phục hồi chuyên nghiệp hiện nay, trong đó có <a href="#/thuong-hieu/dr-bargo">Dr.BARGO 31°C</a>.</p>

      <h2>Cách dùng cho da đang treatment</h2>
      <ol>
        <li>Làm sạch bằng sữa rửa mặt dịu nhẹ, không chứa hạt hay hoạt chất tẩy.</li>
        <li>Thoa serum/emulsion chứa Ceramide + Panthenol khi da còn hơi ẩm.</li>
        <li>Những đêm dùng retinol: có thể thoa lớp phục hồi <em>trước</em> (kỹ thuật “sandwich”) để giảm kích ứng.</li>
        <li>Kết thúc bằng kem dưỡng khóa ẩm; ban ngày luôn dùng kem chống nắng.</li>
      </ol>

      <blockquote><strong>Mẹo nhỏ:</strong> nếu da châm chích mạnh, hãy tạm ngưng treatment 3 – 5 ngày và chỉ dùng bước phục hồi. Xem thêm <a href="#/blog/dau-hieu-hang-rao-bao-ve-da-bi-ton-thuong">dấu hiệu hàng rào da bị tổn thương</a>.</blockquote>

      <h2>Kết luận</h2>
      <p>Ceramide và Panthenol B5 không “trị” mụn hay nám, nhưng là nền tảng giúp da chịu được treatment lâu dài và ít tác dụng phụ hơn. Đây là bước nên có trong mọi routine có hoạt chất mạnh.</p>
    `,
    faq: [
      { q: 'Ceramide và Panthenol có dùng chung với retinol được không?', a: 'Được, và nên dùng. Hai thành phần này giúp giảm khô, bong tróc và châm chích do retinol gây ra.' },
      { q: 'Da dầu có dùng được Ceramide không?', a: 'Được. Nên chọn dạng serum hoặc emulsion mỏng nhẹ thay vì kem đặc để không gây bí da.' },
      { q: 'Bao lâu thì thấy da dịu lại?', a: 'Thường sau 1 – 2 tuần dùng đều đặn, da sẽ bớt đỏ rát và căng khô rõ rệt.' }
    ]
  },

  /* ------------------------------------------------------------------ 12 */
  {
    slug: 'giu-am-tang-sau-cho-da-nhay-cam-khi-chuyen-mua',
    keyword: 'giữ ẩm cho da nhạy cảm khi chuyển mùa',
    category: 'meo-lam-dep',
    date: '2026-11-10',
    readTime: 5,
    cover: '/assets/images/blog/meo-giu-am-neuro-lacto-moisturizer.jpg',
    seoTitle: 'Bí quyết giữ ẩm tầng sâu cho da nhạy cảm khi chuyển mùa',
    metaDescription: 'Cách giữ ẩm cho da nhạy cảm khi chuyển mùa: nguyên tắc cấp – khóa ẩm, kỹ thuật dưỡng nhiều lớp mỏng và thói quen giúp da không khô rát, bong tróc.',
    title: 'Bí quyết giữ ẩm tầng sâu cho da nhạy cảm khi chuyển mùa',
    excerpt: 'Thời tiết hanh khô, gió lạnh và máy sưởi khiến da nhạy cảm dễ căng rát, bong tróc. Áp dụng ngay 6 bí quyết giữ ẩm tầng sâu sau đây.',
    products: ['neura-8', 'neura-7', 'neura-16', 'neura-2'],
    content: `
      <p>Khi chuyển mùa, độ ẩm không khí giảm và nhiệt độ thay đổi liên tục khiến da mất nước nhanh hơn. Với da nhạy cảm, điều này dễ dẫn đến khô căng, đỏ và châm chích. <strong>Giữ ẩm cho da nhạy cảm khi chuyển mùa</strong> cần đủ ba bước: <em>cấp nước – giữ nước – khóa ẩm</em>, kèm điều chỉnh thói quen hằng ngày.</p>

      <h2>Vì sao da nhạy cảm “khổ” nhất khi chuyển mùa?</h2>
      <p>Da nhạy cảm thường có hàng rào bảo vệ mỏng hơn, lượng lipid tự nhiên thấp hơn. Khi không khí khô, nước trong da bốc hơi nhanh, đầu dây thần kinh cảm giác dễ bị kích thích, gây ngứa và rát.</p>

      <h2>6 bí quyết giữ ẩm tầng sâu</h2>
      ${fig('/assets/images/blog/meo-giu-am-neuro-lacto-moisturizer.jpg', 'Neuraderm Neuro Lacto Moisturizer dưỡng ẩm chuyên sâu, hỗ trợ hàng rào bảo vệ da khi chuyển mùa')}
      <h3>1. Rửa mặt bằng nước ấm, không dùng nước nóng</h3>
      <p>Nước nóng cuốn trôi lớp dầu tự nhiên. Chỉ rửa mặt 2 lần/ngày với sữa rửa mặt dịu nhẹ, pH cân bằng.</p>
      <h3>2. Thoa toner/xịt khoáng ngay khi da còn ẩm</h3>
      <p>Trong vòng 1 phút sau khi rửa mặt, hãy thoa toner cấp ẩm để da không kịp khô căng.</p>
      <h3>3. Dưỡng nhiều lớp mỏng thay vì một lớp dày</h3>
      <p>Toner – serum cấp ẩm (Hyaluronic Acid, Glycerin) – kem dưỡng có Ceramide. Mỗi lớp mỏng giúp nước được giữ ở nhiều tầng.</p>
      <h3>4. Ưu tiên thành phần phục hồi, tránh hương liệu</h3>
      <p>Chọn sản phẩm có Ceramide, Panthenol, lợi khuẩn (Lactobacillus), Madecassoside; tránh cồn khô và hương liệu mạnh.</p>
      <h3>5. Giảm tẩy tế bào chết</h3>
      <p>Khi da đang khô, chỉ nên tẩy nhẹ tối đa 1 lần/tuần hoặc tạm ngưng hoàn toàn.</p>
      <h3>6. Dùng máy tạo ẩm và uống đủ nước</h3>
      <p>Ngồi phòng máy lạnh, máy sưởi nhiều giờ? Một máy tạo ẩm nhỏ đặt cạnh bàn làm việc giúp da bớt mất nước đáng kể.</p>

      <h2>Routine gợi ý cho da nhạy cảm mùa hanh khô</h2>
      <ul>
        <li><strong>Sáng:</strong> rửa mặt nhẹ → toner → serum cấp ẩm → kem dưỡng → kem chống nắng.</li>
        <li><strong>Tối:</strong> tẩy trang dịu nhẹ → rửa mặt → toner → serum phục hồi → kem dưỡng dày hơn ban ngày.</li>
        <li><strong>Trong ngày:</strong> xịt khoáng khi da căng, sau đó vỗ nhẹ cho thấm.</li>
      </ul>

      <blockquote><strong>Lưu ý:</strong> xịt khoáng xong mà để bay hơi tự nhiên có thể khiến da khô hơn. Hãy vỗ nhẹ cho thấm hoặc thoa một lớp kem mỏng phía trên.</blockquote>

      <h2>Kết luận</h2>
      <p>Giữ ẩm tầng sâu không nằm ở việc dùng thật nhiều sản phẩm, mà ở việc cấp đủ nước và khóa lại đúng cách. Dòng <a href="#/thuong-hieu/neuraderm">Neuraderm Neuro Lacto</a> với lợi khuẩn và Ceramide là lựa chọn phù hợp cho da nhạy cảm trong giai đoạn chuyển mùa.</p>
    `,
    faq: [
      { q: 'Da nhạy cảm có nên đắp mặt nạ mỗi ngày khi trời khô?', a: 'Có thể đắp mặt nạ cấp ẩm 2 – 3 lần/tuần. Đắp mỗi ngày dễ khiến da bị “ngộp” nước nếu không khóa ẩm đúng cách.' },
      { q: 'Dầu dưỡng có giúp giữ ẩm cho da nhạy cảm không?', a: 'Có, vài giọt dầu dưỡng trộn vào kem buổi tối giúp tăng khả năng khóa ẩm. Nên chọn loại không hương liệu.' },
      { q: 'Bao lâu thì da hết bong tróc?', a: 'Thường 1 – 2 tuần nếu dưỡng ẩm đều đặn và ngưng các sản phẩm gây kích ứng.' }
    ]
  },

  /* ------------------------------------------------------------------ 13 */
  {
    slug: 'cham-soc-da-sau-khi-di-nang-gat',
    keyword: 'chăm sóc da sau khi đi nắng',
    category: 'meo-lam-dep',
    date: '2026-11-10',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-2.jpg',
    seoTitle: 'Chăm sóc da sau khi đi nắng gắt: 5 bước chuẩn y khoa',
    metaDescription: 'Chăm sóc da sau khi đi nắng gắt đúng cách: làm mát, làm dịu, cấp ẩm, tránh hoạt chất mạnh và chống nắng lại. 5 bước giúp da hết đỏ rát, hạn chế thâm sạm.',
    title: 'Chăm sóc da chuẩn y khoa sau khi tiếp xúc với nắng gắt',
    excerpt: 'Đi nắng về da nóng rát, ửng đỏ? 5 bước đơn giản giúp làm dịu da nhanh và hạn chế thâm sạm về sau.',
    products: ['neura-2', 'neura-8', 'neura-16', 'stemc-3'],
    content: `
      <p>Tia UV không chỉ làm da cháy nắng mà còn gây viêm, mất nước và kích thích sản sinh melanin dẫn đến thâm sạm. <strong>Chăm sóc da sau khi đi nắng</strong> đúng cách trong 24 – 48 giờ đầu giúp da hồi phục nhanh, giảm đỏ rát và hạn chế tổn thương lâu dài.</p>

      <h2>5 bước chăm sóc da sau khi đi nắng gắt</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-2.jpg', 'Xịt khoáng Neuraderm Neuro Daily Calming Mist làm dịu da sau khi đi nắng')}
      <h3>Bước 1: Làm mát da</h3>
      <p>Rửa mặt bằng nước mát (không dùng đá chườm trực tiếp). Có thể đắp khăn mát lên vùng da nóng 10 – 15 phút.</p>
      <h3>Bước 2: Làm sạch dịu nhẹ</h3>
      <p>Tẩy trang kem chống nắng bằng nước tẩy trang dịu nhẹ, sau đó rửa mặt bằng sữa rửa mặt không chứa hạt hay AHA/BHA.</p>
      <h3>Bước 3: Làm dịu và cấp ẩm</h3>
      <p>Dùng xịt khoáng hoặc toner làm dịu, tiếp theo là serum/kem chứa Panthenol, Madecassoside, Allantoin hoặc lô hội để giảm viêm.</p>
      <h3>Bước 4: Tạm ngưng hoạt chất mạnh</h3>
      <p>Không dùng retinol, AHA/BHA, vitamin C nồng độ cao, tẩy tế bào chết trong ít nhất 3 – 5 ngày.</p>
      <h3>Bước 5: Chống nắng kỹ hơn những ngày sau</h3>
      <p>Da vừa bị tổn thương rất dễ thâm. Thoa kem chống nắng phổ rộng, thoa lại sau mỗi 2 – 3 giờ khi ra ngoài. Xem <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</p>

      <h2>Những điều không nên làm</h2>
      <ul>
        <li>Bóc lớp da bong tróc — dễ để lại thâm và sẹo.</li>
        <li>Chườm đá trực tiếp lên da.</li>
        <li>Đắp chanh, kem đánh răng hay mẹo dân gian lên vùng da rát.</li>
        <li>Trang điểm dày khi da còn nóng đỏ.</li>
      </ul>

      <blockquote><strong>Khi nào cần gặp bác sĩ?</strong> Nếu da phồng rộp, sưng đau nhiều, kèm sốt hoặc chóng mặt, hãy đến cơ sở y tế thay vì tự xử lý tại nhà.</blockquote>

      <h2>Kết luận</h2>
      <p>Làm mát – làm dịu – cấp ẩm – chống nắng lại là bốn việc quan trọng nhất sau khi đi nắng. Phòng bệnh hơn chữa bệnh: thoa kem chống nắng đủ lượng trước khi ra ngoài vẫn là cách bảo vệ da hiệu quả nhất.</p>
    `,
    faq: [
      { q: 'Da cháy nắng bao lâu thì hồi phục?', a: 'Cháy nắng nhẹ thường hết đỏ sau 3 – 5 ngày; vùng da bong tróc có thể cần 1 – 2 tuần.' },
      { q: 'Có nên đắp mặt nạ sau khi đi nắng không?', a: 'Có thể dùng mặt nạ giấy làm dịu, cấp ẩm, để trong tủ mát. Tránh mặt nạ chứa hoạt chất tẩy hoặc hương liệu.' },
      { q: 'Đi nắng về có cần rửa mặt ngay không?', a: 'Nên làm mát da trước, sau đó làm sạch nhẹ nhàng để loại bỏ kem chống nắng, mồ hôi và bụi bẩn.' }
    ]
  },

  /* ------------------------------------------------------------------ 14 */
  {
    slug: 'da-dau-mun-co-can-kem-duong-am-khong',
    keyword: 'da dầu mụn có cần kem dưỡng ẩm',
    category: 'meo-lam-dep',
    date: '2026-11-09',
    readTime: 4,
    cover: '/assets/images/catalog/dr-bargo/drbargo-1.jpg',
    seoTitle: 'Da dầu mụn có cần kem dưỡng ẩm không? Lầm tưởng & sự thật',
    metaDescription: 'Da dầu mụn có cần kem dưỡng ẩm? Giải mã lầm tưởng phổ biến, vì sao thiếu ẩm khiến da tiết dầu nhiều hơn và cách chọn kem dưỡng không gây bít tắc.',
    title: 'Lầm tưởng & sự thật: Da dầu mụn có thực sự không cần kem dưỡng ẩm?',
    excerpt: '“Da đã nhiều dầu rồi thì dưỡng ẩm làm gì?” — đây là một trong những lầm tưởng khiến da dầu mụn càng chăm càng bóng nhờn.',
    products: ['drbargo-1', 'drbargo-2', 'neura-16'],
    content: `
      <p><strong>Lầm tưởng:</strong> da dầu mụn đã đủ dầu nên không cần kem dưỡng ẩm.<br><strong>Sự thật:</strong> dầu (bã nhờn) và nước là hai thứ khác nhau. Da dầu vẫn có thể thiếu nước, và khi thiếu nước, da thường <em>tiết dầu nhiều hơn</em> để tự bảo vệ. Vì vậy <strong>da dầu mụn vẫn cần kem dưỡng ẩm</strong>, chỉ là cần chọn đúng loại.</p>

      <h2>Vì sao da dầu vẫn thiếu ẩm?</h2>
      ${fig('/assets/images/catalog/dr-bargo/drbargo-1.jpg', 'Sữa dưỡng Dr.BARGO dạng lỏng nhẹ phù hợp cho da dầu mụn')}
      <p>Người da dầu mụn thường rửa mặt nhiều lần, dùng sữa rửa mặt mạnh và thuốc trị mụn (BHA, Benzoyl Peroxide, Retinoid). Những thứ này đều làm mất nước và làm yếu hàng rào da. Kết quả là da “dầu bên ngoài, khô bên trong”: bề mặt bóng nhờn nhưng vẫn căng, bong vảy quanh vùng mụn.</p>

      <h2>Bỏ kem dưỡng ẩm gây hậu quả gì?</h2>
      <ul>
        <li>Da tăng tiết bã nhờn để bù nước → lỗ chân lông dễ bít tắc.</li>
        <li>Hàng rào da yếu → vi khuẩn dễ xâm nhập, mụn viêm lâu lành.</li>
        <li>Da kích ứng mạnh hơn khi dùng thuốc trị mụn.</li>
      </ul>

      <h2>Cách chọn kem dưỡng cho da dầu mụn</h2>
      <ul>
        <li><strong>Kết cấu:</strong> gel, emulsion, lotion mỏng nhẹ, thấm nhanh.</li>
        <li><strong>Nhãn:</strong> “non-comedogenic” (không gây bít tắc), không hương liệu.</li>
        <li><strong>Thành phần nên có:</strong> Ceramide, Panthenol, Niacinamide, Hyaluronic Acid, lợi khuẩn.</li>
        <li><strong>Hạn chế:</strong> dầu khoáng đặc, bơ hạt mỡ nồng độ cao, hương liệu mạnh.</li>
      </ul>

      <h2>Mẹo dùng kem dưỡng cho da dầu</h2>
      <ol>
        <li>Chỉ cần lượng bằng hạt đậu cho toàn mặt.</li>
        <li>Buổi sáng có thể dùng lớp thật mỏng hoặc chọn kem chống nắng có khả năng dưỡng ẩm.</li>
        <li>Buổi tối thoa sau serum trị mụn để giảm khô rát.</li>
      </ol>

      <blockquote><strong>Ghi nhớ:</strong> mục tiêu với da dầu là <em>cân bằng</em>, không phải “làm khô” da. Xem thêm <a href="#/blog/cach-chon-sua-rua-mat-theo-loai-da">cách chọn sữa rửa mặt theo loại da</a>.</blockquote>

      <h2>Kết luận</h2>
      <p>Da dầu mụn không chỉ cần mà còn rất cần kem dưỡng ẩm phù hợp. Một lớp dưỡng mỏng nhẹ giúp da bớt tiết dầu, mụn lành nhanh hơn và chịu được thuốc trị mụn tốt hơn.</p>
    `,
    faq: [
      { q: 'Kem dưỡng có làm da dầu nổi mụn không?', a: 'Kem quá đặc hoặc chứa thành phần gây bít tắc có thể làm nổi mụn. Chọn loại gel/emulsion ghi “non-comedogenic” sẽ hạn chế điều này.' },
      { q: 'Da dầu nên dưỡng ẩm mấy lần một ngày?', a: 'Hai lần sáng và tối là đủ. Buổi sáng có thể thay bằng kem chống nắng có tính dưỡng ẩm.' },
      { q: 'Dùng toner có thay được kem dưỡng không?', a: 'Không. Toner chủ yếu cấp nước, còn kem dưỡng giúp khóa ẩm. Hai bước bổ trợ cho nhau.' }
    ]
  },

  /* ------------------------------------------------------------------ 15 */
  {
    slug: 'routine-skincare-5-phut-cho-nguoi-ban-ron',
    keyword: 'routine skincare cho người bận rộn',
    category: 'meo-lam-dep',
    date: '2026-11-09',
    readTime: 4,
    cover: '/assets/images/blog/meo-routine-neuro-lacto-toner.jpg',
    seoTitle: 'Routine skincare 5 phút cho người bận rộn: sáng và tối',
    metaDescription: 'Routine skincare cho người bận rộn chỉ 5 phút mỗi buổi: 3 – 4 bước tối giản sáng và tối, mẹo chọn sản phẩm đa năng và cách duy trì đều đặn.',
    title: 'Routine nhanh gọn 5 phút cho phái đẹp bận rộn',
    excerpt: 'Không có thời gian cho 10 bước skincare? Chỉ cần 5 phút mỗi buổi với 3 – 4 bước cốt lõi, da vẫn khỏe và đều màu.',
    products: ['stemc-5', 'neura-8', 'stemc-4', 'stemc-6', 'stemc-3'],
    content: `
      <p>Da đẹp không đến từ số bước skincare mà từ sự <em>đều đặn</em>. <strong>Routine skincare cho người bận rộn</strong> chỉ cần giữ những bước cốt lõi: làm sạch – cấp ẩm – dưỡng – chống nắng. Dưới đây là routine 5 phút buổi sáng và buổi tối dễ duy trì mỗi ngày.</p>

      <h2>Routine buổi sáng (khoảng 3 – 5 phút)</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-4.jpg', 'Toner MediPharm Stem C dùng trong routine skincare nhanh gọn buổi sáng')}
      <ol>
        <li><strong>Rửa mặt</strong> bằng nước hoặc sữa rửa mặt dịu nhẹ (da dầu).</li>
        <li><strong>Toner</strong> cấp ẩm — vỗ nhẹ bằng tay, không cần bông.</li>
        <li><strong>Kem dưỡng mỏng nhẹ</strong> hoặc lotion.</li>
        <li><strong>Kem chống nắng</strong> — bước không được bỏ. Có thể chọn loại có màu (BB cream chống nắng) để thay lớp nền.</li>
      </ol>

      <h2>Routine buổi tối (khoảng 5 phút)</h2>
      <ol>
        <li><strong>Tẩy trang</strong> bằng nước tẩy trang nếu có dùng kem chống nắng/trang điểm.</li>
        <li><strong>Rửa mặt</strong> với sữa rửa mặt.</li>
        <li><strong>Serum hoặc lotion phục hồi</strong> theo nhu cầu da.</li>
        <li><strong>Kem dưỡng</strong> khóa ẩm.</li>
      </ol>
      <p>Không chắc thứ tự? Xem <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare sáng và tối</a>.</p>

      <h2>6 mẹo tiết kiệm thời gian</h2>
      <ul>
        <li>Chọn sản phẩm <strong>đa năng</strong>: toner kiêm dưỡng ẩm, kem chống nắng có màu.</li>
        <li>Để sản phẩm ngay cạnh bồn rửa mặt theo đúng thứ tự dùng.</li>
        <li>Thoa toner, serum khi da còn ẩm để không phải chờ lâu giữa các bước.</li>
        <li>Chuẩn bị bộ travel size trong túi xách cho ngày tăng ca.</li>
        <li>Đắp mặt nạ giấy 1 – 2 lần/tuần khi tắm hoặc xem phim.</li>
        <li>Đặt nhắc nhở thoa lại kem chống nắng nếu ra ngoài nhiều.</li>
      </ul>

      <blockquote><strong>Mẹo nhỏ:</strong> mệt quá không muốn skincare? Hãy giữ ít nhất hai bước: <em>tẩy trang + rửa mặt</em> vào buổi tối. Ngủ với lớp kem chống nắng và bụi bẩn trên mặt là nguyên nhân phổ biến gây mụn.</blockquote>

      <h2>Kết luận</h2>
      <p>Một routine 4 bước làm đều mỗi ngày hiệu quả hơn nhiều so với 10 bước làm thất thường. Bộ sản phẩm <a href="#/thuong-hieu/medipharm">MediPharm Stem C</a> gồm nước tẩy trang, toner, lotion và kem chống nắng là lựa chọn gọn nhẹ cho người bận rộn.</p>
    `,
    faq: [
      { q: 'Người bận rộn có cần dùng serum không?', a: 'Không bắt buộc. Nếu da không có vấn đề đặc biệt, toner – kem dưỡng – kem chống nắng là đủ. Serum giúp xử lý vấn đề cụ thể như thâm, lão hóa.' },
      { q: 'Có thể bỏ bước toner không?', a: 'Có thể, nếu kem dưỡng đã đủ ẩm. Tuy nhiên toner giúp da mềm và thấm sản phẩm sau tốt hơn.' },
      { q: 'Buổi sáng chỉ rửa mặt bằng nước được không?', a: 'Được với da khô và nhạy cảm. Da dầu nên dùng sữa rửa mặt dịu nhẹ để loại bỏ dầu thừa qua đêm.' }
    ]
  },

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
      <p><strong>Nên dùng serum buổi tối</strong> — nhất là serum đặc trị — vì đây là lúc da nghỉ ngơi, tập trung phục hồi và không bị ánh nắng làm giảm hiệu quả hoạt chất. Ngược lại, ban ngày da liên tục tiếp xúc tia UV nên cần ưu tiên <strong>kem chống nắng</strong> để bảo vệ. Hiểu nhịp sinh học này giúp bạn chọn đúng sản phẩm cho từng thời điểm.</p>

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
  },
  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'cach-chon-sua-rua-mat-theo-loai-da',
    keyword: 'cách chọn sữa rửa mặt',
    category: 'huong-dan',
    date: '2026-11-10',
    readTime: 5,
    cover: '/assets/images/blog/huong-dan-calming-foam-cleanser.jpg',
    seoTitle: 'Cách chọn sữa rửa mặt phù hợp với từng loại da',
    metaDescription: 'Cách chọn sữa rửa mặt theo loại da dầu, da khô, da nhạy cảm: độ pH, kết cấu, thành phần nên có và cần tránh, rửa mặt mấy lần mỗi ngày.',
    title: 'Cách chọn sữa rửa mặt phù hợp với từng loại da',
    excerpt: 'Sữa rửa mặt quá mạnh làm da khô căng, quá nhẹ thì không sạch. Hướng dẫn cách chọn sữa rửa mặt đúng với loại da của bạn.',
    products: ['neura-1', 'drbargo-2', 'stemc-5'],
    content: `
      <p><strong>Cách chọn sữa rửa mặt</strong> đúng là dựa vào loại da: da dầu chọn dạng gel hoặc bọt làm sạch kỹ nhưng không chứa chất tẩy mạnh, da khô và nhạy cảm chọn dạng kem hoặc gel dịu nhẹ có độ pH 5 – 6, không hương liệu. Sữa rửa mặt tốt là sau khi rửa da sạch, mềm và không căng rít.</p>

      <h2>Vì sao chọn đúng sữa rửa mặt lại quan trọng?</h2>
      <p>Làm sạch là bước nền của mọi routine. Sữa rửa mặt quá mạnh sẽ cuốn trôi lớp dầu tự nhiên, làm suy yếu hàng rào bảo vệ da và khiến da tiết dầu nhiều hơn. Ngược lại, sản phẩm quá nhẹ không lấy hết bụi bẩn, kem chống nắng, dễ gây bít tắc lỗ chân lông.</p>

      <h2>Chọn sữa rửa mặt theo từng loại da</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-1.jpg', 'Sữa rửa mặt dịu nhẹ Neuraderm Calming Foam Cleansing phù hợp da nhạy cảm, da khô')}
      <h3>Da dầu, da mụn</h3>
      <p>Ưu tiên dạng gel hoặc bọt mịn, làm sạch dầu thừa tốt nhưng vẫn giữ độ pH nhẹ. Có thể chọn sản phẩm chứa BHA nồng độ thấp, tràm trà hoặc kẽm để hỗ trợ kiểm soát dầu.</p>
      <h3>Da khô</h3>
      <p>Chọn dạng kem, sữa hoặc gel có thêm thành phần giữ ẩm như Glycerin, Hyaluronic Acid, Ceramide. Tránh sản phẩm tạo quá nhiều bọt vì thường chứa chất làm sạch mạnh.</p>
      <h3>Da nhạy cảm, da đang phục hồi</h3>
      <p>Chọn công thức tối giản, không hương liệu, không cồn, độ pH 5 – 6. Chất làm sạch có nguồn gốc thực vật và thành phần làm dịu như Panthenol, chiết xuất yến mạch là lựa chọn an toàn.</p>
      <h3>Da hỗn hợp</h3>
      <p>Dùng sữa rửa mặt dịu nhẹ cho toàn mặt; nếu vùng chữ T quá dầu có thể dùng thêm sản phẩm làm sạch sâu 1 – 2 lần mỗi tuần.</p>

      <h2>Thành phần nên tránh trong sữa rửa mặt</h2>
      <ul>
        <li><strong>SLS (Sodium Lauryl Sulfate)</strong> nồng độ cao: dễ gây khô và kích ứng.</li>
        <li><strong>Hạt scrub thô:</strong> có thể gây tổn thương vi điểm trên da.</li>
        <li><strong>Hương liệu, cồn khô:</strong> không phù hợp da nhạy cảm.</li>
      </ul>

      <h2>Rửa mặt bao nhiêu lần một ngày?</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-5.jpg', 'Nước tẩy trang Stem C Cleansing Water cho bước làm sạch đầu tiên buổi tối')}
      <p><strong>Hai lần mỗi ngày</strong> là đủ: buổi sáng làm sạch nhẹ, buổi tối làm sạch kỹ. Nếu có trang điểm hoặc dùng kem chống nắng, hãy tẩy trang trước rồi mới dùng sữa rửa mặt (double cleansing). Rửa quá nhiều lần sẽ làm da khô và nhạy cảm hơn.</p>

      <h2>Kết luận</h2>
      <p>Một sữa rửa mặt tốt giúp da sạch mà vẫn mềm mại, là nền tảng để các bước sau phát huy tác dụng. Sau khi chọn được sữa rửa mặt phù hợp, tham khảo <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare sáng và tối</a> và <a href="#/san-pham?cat=cleanser">danh mục sữa rửa mặt</a> của beVIBE.</p>
    `,
    faq: [
      { q: 'Sữa rửa mặt có độ pH bao nhiêu là tốt?', a: 'Khoảng pH 5 – 6, gần với độ pH tự nhiên của da, giúp làm sạch mà không phá vỡ hàng rào bảo vệ da.' },
      { q: 'Da dầu có nên rửa mặt nhiều lần trong ngày?', a: 'Không nên. Rửa quá nhiều lần làm da mất dầu tự nhiên và tiết dầu nhiều hơn; hai lần mỗi ngày là đủ.' },
      { q: 'Có cần tẩy trang nếu không trang điểm?', a: 'Nên tẩy trang nếu bạn dùng kem chống nắng, đặc biệt loại chống nước, để làm sạch hoàn toàn trước khi rửa mặt.' }
    ]
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'toner-co-can-thiet-khong',
    keyword: 'toner có cần thiết không',
    category: 'kien-thuc',
    date: '2026-11-09',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-8.jpg',
    seoTitle: 'Toner có cần thiết không? Công dụng và cách dùng đúng',
    metaDescription: 'Toner có cần thiết không? Giải thích công dụng của toner, khi nào nên dùng, cách chọn theo loại da và 3 cách thoa toner hiệu quả.',
    title: 'Toner có cần thiết không? Công dụng và cách dùng đúng',
    excerpt: 'Nhiều người bỏ qua toner vì nghĩ không cần. Thực tế toner có cần thiết không và dùng thế nào mới hiệu quả?',
    products: ['neura-8', 'stemc-4', 'drbargo-4'],
    content: `
      <p><strong>Toner có cần thiết không?</strong> Toner không bắt buộc, nhưng là bước rất có lợi: giúp cân bằng và cấp ẩm cho da ngay sau khi rửa mặt, làm mềm da để serum và kem dưỡng thẩm thấu tốt hơn. Với da khô, da nhạy cảm hoặc đang dùng hoạt chất, một toner cấp ẩm dịu nhẹ giúp da dễ chịu và ổn định hơn rõ rệt.</p>

      <h2>Toner có công dụng gì?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-8.jpg', 'Toner cấp ẩm Neuraderm Neuro Lacto Toner giúp cân bằng da sau khi rửa mặt')}
      <ul>
        <li><strong>Cân bằng da:</strong> đưa da về trạng thái ổn định sau bước làm sạch.</li>
        <li><strong>Cấp ẩm tức thì:</strong> bổ sung lớp ẩm đầu tiên, giảm cảm giác khô căng.</li>
        <li><strong>Hỗ trợ thẩm thấu:</strong> da ẩm giúp serum, kem dưỡng tán đều và thấm tốt hơn.</li>
        <li><strong>Làm dịu:</strong> các toner chứa lợi khuẩn, Panthenol, chiết xuất yến mạch giúp giảm đỏ, kích ứng.</li>
      </ul>

      <h2>Khi nào nên dùng toner?</h2>
      <p>Dùng toner ngay sau khi rửa mặt, cả sáng và tối, khi da còn hơi ẩm. Toner đặc biệt hữu ích nếu da bạn thường khô căng sau khi rửa, đang dùng retinol hoặc AHA/BHA, hay sống trong môi trường máy lạnh nhiều giờ.</p>

      <h2>Chọn toner theo loại da</h2>
      <ul>
        <li><strong>Da khô, nhạy cảm:</strong> toner cấp ẩm, không cồn, chứa Hyaluronic Acid, Panthenol, lợi khuẩn.</li>
        <li><strong>Da dầu, mụn:</strong> toner mỏng nhẹ, có thể chứa BHA nồng độ thấp hoặc Niacinamide.</li>
        <li><strong>Da thường:</strong> toner cấp ẩm cơ bản, kết cấu nước nhẹ.</li>
      </ul>

      <h2>3 cách thoa toner hiệu quả</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-4.jpg', 'Stem C Toner – vỗ nhẹ toner bằng tay để da hấp thu tốt hơn')}
      <ol>
        <li><strong>Vỗ bằng tay:</strong> đổ vài giọt ra lòng bàn tay, vỗ nhẹ lên mặt — tiết kiệm và dịu da nhất.</li>
        <li><strong>Dùng bông tẩy trang:</strong> lau nhẹ theo chiều từ trong ra ngoài, giúp lấy đi cặn bẩn còn sót.</li>
        <li><strong>Đắp lotion mask:</strong> thấm toner vào bông mỏng, đắp 3 – 5 phút lên vùng da khô.</li>
      </ol>
      <blockquote><strong>Mẹo:</strong> với da rất khô, có thể thoa toner 2 – 3 lớp mỏng (phương pháp “7 skin” rút gọn) để da căng mọng hơn.</blockquote>

      <h2>Kết luận</h2>
      <p>Toner không bắt buộc, nhưng là bước đáng đầu tư nếu bạn muốn da mềm, ẩm và hấp thu dưỡng chất tốt hơn. Xem vị trí của toner trong <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare chuẩn</a> và các toner trong <a href="#/san-pham?cat=toner">danh mục Toner &amp; Xịt khoáng</a>.</p>
    `,
    faq: [
      { q: 'Toner và nước hoa hồng có khác nhau không?', a: 'Nước hoa hồng là một loại toner. Toner là tên gọi chung cho bước cân bằng da, có nhiều công thức khác nhau.' },
      { q: 'Có thể bỏ qua toner không?', a: 'Có thể. Routine tối thiểu chỉ cần làm sạch, dưỡng ẩm và chống nắng; toner là bước bổ sung giúp da ẩm và dịu hơn.' },
      { q: 'Nên dùng toner bằng tay hay bông?', a: 'Vỗ bằng tay tiết kiệm và dịu hơn; dùng bông khi muốn làm sạch thêm cặn bẩn còn sót sau khi rửa mặt.' }
    ]
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'dap-mat-na-giay-bao-nhieu-lan-mot-tuan',
    keyword: 'đắp mặt nạ giấy',
    category: 'huong-dan',
    date: '2026-11-03',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-14.jpg',
    seoTitle: 'Đắp mặt nạ giấy bao nhiêu lần một tuần là đúng?',
    metaDescription: 'Đắp mặt nạ giấy bao nhiêu lần một tuần, nên đắp trong bao lâu, đắp ở bước nào và những sai lầm thường gặp khiến mặt nạ mất tác dụng.',
    title: 'Đắp mặt nạ giấy bao nhiêu lần một tuần là đúng?',
    excerpt: 'Đắp mặt nạ mỗi ngày có tốt không? Để lâu có thấm hơn không? Hướng dẫn đắp mặt nạ giấy đúng tần suất và thời gian.',
    products: ['neura-14', 'neura-12', 'neura-13'],
    content: `
      <p><strong>Đắp mặt nạ giấy</strong> 2 – 3 lần mỗi tuần là phù hợp với đa số làn da, mỗi lần 15 – 20 phút, sau bước toner. Da rất khô hoặc đang phục hồi có thể đắp mặt nạ cấp ẩm dịu nhẹ thường xuyên hơn, nhưng không nên để mặt nạ trên da quá thời gian khuyến nghị.</p>

      <h2>Đắp mặt nạ giấy bao nhiêu lần một tuần?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-14.jpg', 'Mặt nạ Neuraderm M.BT Cream Lifting Mask đắp 2 – 3 lần mỗi tuần')}
      <ul>
        <li><strong>Mặt nạ cấp ẩm, làm dịu:</strong> 2 – 4 lần/tuần.</li>
        <li><strong>Mặt nạ nâng cơ, chống lão hóa:</strong> 2 – 3 lần/tuần.</li>
        <li><strong>Mặt nạ làm sáng chứa hoạt chất:</strong> 1 – 2 lần/tuần, tránh dùng cùng ngày với retinol, AHA/BHA.</li>
      </ul>

      <h2>Đắp mặt nạ trong bao lâu?</h2>
      <p>Thông thường <strong>15 – 20 phút</strong>, hoặc theo hướng dẫn trên bao bì. Để mặt nạ quá lâu, khi miếng giấy bắt đầu khô, nó có thể hút ngược độ ẩm từ da ra ngoài.</p>

      <h2>Đắp mặt nạ ở bước nào trong routine?</h2>
      <ol>
        <li>Tẩy trang và rửa mặt.</li>
        <li>Thoa toner.</li>
        <li><strong>Đắp mặt nạ giấy</strong> 15 – 20 phút.</li>
        <li>Gỡ mặt nạ, vỗ nhẹ phần tinh chất còn lại cho thấm.</li>
        <li>Thoa kem dưỡng để khóa ẩm.</li>
      </ol>

      <h2>Những sai lầm khi đắp mặt nạ</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-12.jpg', 'Mặt nạ phục hồi Neuraderm Repair Lifting Cream Mask Pack')}
      <ul>
        <li><strong>Rửa mặt lại sau khi đắp:</strong> làm trôi dưỡng chất vừa được bổ sung.</li>
        <li><strong>Bỏ qua kem dưỡng:</strong> độ ẩm từ mặt nạ dễ bay hơi nếu không được khóa lại.</li>
        <li><strong>Dùng lại tinh chất thừa nhiều ngày:</strong> dễ nhiễm khuẩn sau khi mở bao bì.</li>
        <li><strong>Đắp khi da đang tổn thương hở:</strong> chỉ dùng mặt nạ khi bác sĩ cho phép.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Đắp mặt nạ giấy đúng tần suất và thời gian giúp da ẩm mượt, căng bóng hơn. Tham khảo các <a href="#/san-pham?cat=mask">mặt nạ Neuraderm</a> và <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare buổi tối</a> để kết hợp hiệu quả.</p>
    `,
    faq: [
      { q: 'Đắp mặt nạ giấy mỗi ngày có tốt không?', a: 'Mặt nạ cấp ẩm dịu nhẹ có thể đắp thường xuyên, nhưng với đa số làn da 2 – 3 lần mỗi tuần là đủ và an toàn.' },
      { q: 'Đắp mặt nạ xong có cần rửa lại mặt không?', a: 'Không cần. Chỉ vỗ nhẹ phần tinh chất còn lại cho thấm rồi thoa kem dưỡng.' },
      { q: 'Nên đắp mặt nạ buổi sáng hay buổi tối?', a: 'Buổi tối là phù hợp nhất vì da được nghỉ ngơi và phục hồi; buổi sáng có thể đắp mặt nạ cấp ẩm trước khi trang điểm.' }
    ]
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'peptide-la-gi-cong-dung-chong-lao-hoa',
    keyword: 'peptide là gì',
    category: 'kien-thuc',
    date: '2026-10-30',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-9.jpg',
    seoTitle: 'Peptide là gì? Công dụng chống lão hóa và cách dùng',
    metaDescription: 'Peptide là gì, vì sao peptide được dùng trong mỹ phẩm chống lão hóa, peptide có kết hợp được với retinol, vitamin C không và cách dùng đúng.',
    title: 'Peptide là gì? Công dụng chống lão hóa và cách dùng đúng',
    excerpt: 'Peptide xuất hiện ngày càng nhiều trong serum chống lão hóa. Peptide là gì, có tác dụng thế nào và ai nên dùng?',
    products: ['neura-3', 'neura-9', 'neura-7'],
    content: `
      <p><strong>Peptide là gì?</strong> Peptide là chuỗi ngắn các axit amin — đơn vị cấu tạo nên protein như collagen và elastin trong da. Trong mỹ phẩm, peptide đóng vai trò như “tín hiệu” hỗ trợ da duy trì độ săn chắc, đàn hồi và làm mờ nếp nhăn. Peptide dịu nhẹ, ít gây kích ứng nên phù hợp cả với da nhạy cảm.</p>

      <h2>Peptide hoạt động như thế nào trên da?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-9.jpg', 'Tinh chất Neuraderm Coretime Synergy Essence chứa phức hợp peptide')}
      <p>Theo tuổi tác, lượng collagen trong da giảm dần khiến da chảy xệ và xuất hiện nếp nhăn. Các peptide trong mỹ phẩm hỗ trợ da duy trì cấu trúc, cải thiện độ ẩm và độ mịn bề mặt. Mỗi loại peptide có cơ chế riêng, vì vậy nhiều sản phẩm kết hợp nhiều peptide trong cùng một công thức.</p>

      <h2>Các nhóm peptide phổ biến</h2>
      <ul>
        <li><strong>Peptide tín hiệu:</strong> hỗ trợ da duy trì độ săn chắc.</li>
        <li><strong>Peptide dẫn truyền:</strong> hỗ trợ đưa khoáng chất cần thiết đến da.</li>
        <li><strong>Peptide thư giãn cơ:</strong> hỗ trợ làm mờ nếp nhăn biểu cảm.</li>
      </ul>

      <h2>Ai nên dùng peptide?</h2>
      <p>Peptide phù hợp với người bắt đầu chống lão hóa từ độ tuổi 25 trở lên, da có dấu hiệu nếp nhăn, kém đàn hồi, hoặc da nhạy cảm không dùng được retinol. Peptide cũng thường được dùng trong giai đoạn phục hồi sau liệu trình thẩm mỹ.</p>

      <h2>Peptide có kết hợp được với hoạt chất khác không?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-3.jpg', 'Neuraderm Coretime Ampoule – peptide dùng trong routine chống lão hóa buổi tối')}
      <ul>
        <li><strong>Hyaluronic Acid, Ceramide, Niacinamide:</strong> kết hợp tốt, tăng hiệu quả cấp ẩm và phục hồi.</li>
        <li><strong>Retinol:</strong> có thể kết hợp; nhiều người dùng retinol và peptide xen kẽ các tối.</li>
        <li><strong>AHA/BHA, vitamin C nồng độ cao:</strong> nên dùng tách buổi để tránh làm giảm hiệu quả và kích ứng.</li>
      </ul>

      <h2>Cách dùng peptide hiệu quả</h2>
      <p>Dùng serum hoặc ampoule peptide sau toner, trước kem dưỡng, tốt nhất vào buổi tối — xem thêm <a href="#/blog/vi-sao-serum-buoi-toi-chong-nang-buoi-sang">vì sao nên dùng serum buổi tối</a>. Kiên trì ít nhất 4 – 8 tuần để thấy da cải thiện rõ, và luôn dùng kem chống nắng vào ban ngày.</p>

      <h2>Kết luận</h2>
      <p>Peptide là hoạt chất chống lão hóa dịu nhẹ, dễ kết hợp và phù hợp nhiều loại da. Dòng <a href="#/thuong-hieu/neuraderm">NEURADERM Coretime</a> ứng dụng phức hợp peptide M.Biome BTX™ từ tập đoàn Medytox, là lựa chọn được nhiều spa, clinic tin dùng.</p>
    `,
    faq: [
      { q: 'Peptide có gây kích ứng không?', a: 'Peptide thường dịu nhẹ và ít gây kích ứng, phù hợp cả da nhạy cảm. Vẫn nên thử trên vùng da nhỏ trước khi dùng toàn mặt.' },
      { q: 'Bao lâu thì thấy hiệu quả khi dùng peptide?', a: 'Thường sau 4 – 8 tuần sử dụng đều đặn, da sẽ cải thiện độ ẩm, độ mịn và đàn hồi.' },
      { q: 'Dùng peptide buổi sáng được không?', a: 'Được, peptide không nhạy cảm với ánh nắng. Tuy nhiên dùng buổi tối giúp da có nhiều thời gian hấp thu hơn.' }
    ]
  },

  /* ------------------------------------------------------------------ 10 */
  {
    slug: 'dau-hieu-hang-rao-bao-ve-da-bi-ton-thuong',
    keyword: 'hàng rào bảo vệ da',
    category: 'kien-thuc',
    date: '2026-10-20',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-6.jpg',
    seoTitle: 'Dấu hiệu hàng rào bảo vệ da bị tổn thương và cách phục hồi',
    metaDescription: '6 dấu hiệu hàng rào bảo vệ da bị tổn thương, nguyên nhân thường gặp và cách phục hồi hàng rào da bằng Ceramide, Panthenol, routine tối giản.',
    title: 'Dấu hiệu hàng rào bảo vệ da bị tổn thương và cách phục hồi',
    excerpt: 'Da bỗng châm chích, đỏ rát khi dùng sản phẩm quen thuộc? Đó có thể là dấu hiệu hàng rào bảo vệ da đang yếu.',
    products: ['neura-6', 'neura-16', 'drbargo-1', 'stemc-6'],
    content: `
      <p><strong>Hàng rào bảo vệ da</strong> là lớp ngoài cùng của da, giữ nước bên trong và ngăn vi khuẩn, chất kích ứng xâm nhập. Khi hàng rào này tổn thương, da trở nên khô căng, đỏ rát, châm chích và dễ nổi mụn. Cách phục hồi là tối giản routine, dừng hoạt chất mạnh và bổ sung Ceramide, Panthenol, chất giữ ẩm.</p>

      <h2>6 dấu hiệu hàng rào bảo vệ da bị tổn thương</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-6.jpg', 'Kem phục hồi Neuraderm MD Cream chứa 13% Ceramide NP hỗ trợ hàng rào bảo vệ da')}
      <ol>
        <li>Da khô căng, bong tróc dù đã dưỡng ẩm.</li>
        <li>Châm chích, nóng rát khi thoa sản phẩm quen thuộc.</li>
        <li>Da đỏ, dễ ửng khi thay đổi nhiệt độ.</li>
        <li>Nổi mụn li ti, mẩn ngứa bất thường.</li>
        <li>Da vừa khô vừa tiết dầu nhiều.</li>
        <li>Bề mặt da sần sùi, xỉn màu.</li>
      </ol>

      <h2>Nguyên nhân khiến hàng rào da suy yếu</h2>
      <ul>
        <li>Rửa mặt quá nhiều lần hoặc dùng sữa rửa mặt quá mạnh.</li>
        <li>Lạm dụng tẩy tế bào chết, retinol, AHA/BHA.</li>
        <li>Sau liệu trình laser, peel, lăn kim — xem <a href="#/blog/cham-soc-da-sau-laser-peel">chăm sóc da sau laser, peel</a>.</li>
        <li>Thời tiết hanh khô, ngồi máy lạnh nhiều giờ, tiếp xúc ánh nắng không được bảo vệ.</li>
      </ul>

      <h2>Cách phục hồi hàng rào bảo vệ da</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-16.jpg', 'Kem dưỡng Neuraderm Neuro Lacto Moisturizer giúp khóa ẩm, củng cố hàng rào da')}
      <h3>1. Tối giản routine</h3>
      <p>Giữ lại các bước cơ bản: sữa rửa mặt dịu nhẹ – toner cấp ẩm – serum phục hồi – kem dưỡng – kem chống nắng. Xem <a href="#/blog/cach-chon-sua-rua-mat-theo-loai-da">cách chọn sữa rửa mặt</a> phù hợp da nhạy cảm.</p>
      <h3>2. Tạm dừng hoạt chất mạnh</h3>
      <p>Ngưng retinol, AHA/BHA, vitamin C nồng độ cao và tẩy tế bào chết trong 2 – 4 tuần, đến khi da hết châm chích.</p>
      <h3>3. Bổ sung thành phần phục hồi</h3>
      <ul>
        <li><strong>Ceramide:</strong> “xi măng” gắn kết các tế bào da.</li>
        <li><strong>Panthenol (B5), Madecassoside:</strong> làm dịu, giảm đỏ.</li>
        <li><strong>Hyaluronic Acid, Glycerin:</strong> giữ nước cho da.</li>
        <li><strong>Lợi khuẩn (Lactobacillus):</strong> hỗ trợ cân bằng hệ vi sinh trên da.</li>
      </ul>
      <h3>4. Chống nắng mỗi ngày</h3>
      <p>Tia UV làm hàng rào da yếu thêm. Xem <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</p>

      <blockquote><strong>Lưu ý:</strong> nếu da đỏ rát kéo dài, sưng hoặc chảy dịch, hãy đến gặp bác sĩ da liễu thay vì tự điều trị tại nhà.</blockquote>

      <h2>Kết luận</h2>
      <p>Hàng rào bảo vệ da khỏe là nền tảng của làn da đẹp. Thông thường da cần 2 – 4 tuần để phục hồi nếu chăm sóc đúng cách. Các dòng <a href="#/thuong-hieu/neuraderm">Neuraderm Neuro Lacto</a> và <a href="#/thuong-hieu/dr-bargo">Dr.BARGO 31°C</a> tập trung vào Ceramide và lợi khuẩn, phù hợp cho giai đoạn phục hồi.</p>
    `,
    faq: [
      { q: 'Hàng rào bảo vệ da phục hồi trong bao lâu?', a: 'Thường mất khoảng 2 – 4 tuần nếu tối giản routine, dừng hoạt chất mạnh và bổ sung thành phần phục hồi.' },
      { q: 'Da yếu có nên đắp mặt nạ không?', a: 'Có thể dùng mặt nạ cấp ẩm, làm dịu với thành phần đơn giản; tránh mặt nạ chứa hoạt chất mạnh hoặc hương liệu.' },
      { q: 'Ceramide có dùng được hằng ngày không?', a: 'Được. Ceramide lành tính, phù hợp dùng hằng ngày cả sáng và tối, đặc biệt với da khô và nhạy cảm.' }
    ]
  }

];

/**
 * "Xem nhiều nhất": thứ tự do biên tập chọn (web chưa có số liệu lượt xem thật).
 * Khi gắn Google Analytics, thay danh sách này bằng 5 bài có lượt xem cao nhất.
 */
export const popularSlugs = [
  'cach-dung-kem-chong-nang-dung',
  'thu-tu-skincare-sang-toi',
  'dau-hieu-hang-rao-bao-ve-da-bi-ton-thuong',
  'peptide-la-gi-cong-dung-chong-lao-hoa',
  'cham-soc-da-sau-laser-peel'
];
