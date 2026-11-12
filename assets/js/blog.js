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
  },

  /* ================================================================== */
  /* Bổ sung 11/2026: 5 bài mỗi chủ đề                                   */
  /* ================================================================== */

  /* ---------------- Kiến thức làn da ---------------- */
  {
    slug: 'cach-xac-dinh-loai-da-tai-nha',
    keyword: 'cách xác định loại da',
    category: 'kien-thuc',
    date: '2026-11-12',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-1.jpg',
    seoTitle: 'Cách xác định loại da tại nhà chỉ trong 30 phút',
    metaDescription: 'Hướng dẫn cách xác định loại da tại nhà bằng phép thử giấy thấm dầu và quan sát sau rửa mặt: da dầu, da khô, da hỗn hợp, da thường hay da nhạy cảm.',
    title: 'Cách xác định loại da tại nhà chỉ trong 30 phút',
    excerpt: 'Chọn sai sản phẩm thường bắt đầu từ việc đoán sai loại da. Hai phép thử đơn giản dưới đây giúp bạn biết chính xác da mình thuộc nhóm nào.',
    products: ['neura-1', 'drbargo-2', 'neura-8'],
    content: `
      <p>Biết <strong>cách xác định loại da</strong> là bước đầu tiên để xây dựng routine hiệu quả. Cùng một loại kem, da dầu có thể thấy bí còn da khô lại thấy vừa đủ. Bạn không cần máy soi da chuyên nghiệp — chỉ cần sữa rửa mặt dịu nhẹ, giấy thấm dầu và 30 phút quan sát.</p>

      <h2>5 loại da cơ bản</h2>
      <ul>
        <li><strong>Da thường:</strong> không quá dầu, không quá khô, ít khi kích ứng.</li>
        <li><strong>Da dầu:</strong> bóng nhờn toàn mặt, lỗ chân lông to, dễ nổi mụn.</li>
        <li><strong>Da khô:</strong> căng, thô ráp, có thể bong vảy nhỏ, ít dầu.</li>
        <li><strong>Da hỗn hợp:</strong> vùng chữ T (trán, mũi, cằm) dầu, hai má thường hoặc khô.</li>
        <li><strong>Da nhạy cảm:</strong> dễ đỏ, ngứa, châm chích khi đổi sản phẩm hoặc thời tiết. Đây là "tình trạng" có thể đi kèm bất kỳ loại da nào.</li>
      </ul>

      <h2>Phép thử 1: Rửa mặt và chờ 30 phút</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-1.jpg', 'Sữa rửa mặt dịu nhẹ Neuraderm Calming Foam Cleansing dùng trước khi kiểm tra loại da')}
      <ol>
        <li>Rửa mặt bằng sữa rửa mặt dịu nhẹ, lau khô bằng khăn sạch.</li>
        <li>Không thoa bất kỳ sản phẩm nào, ngồi trong phòng thoáng mát 30 phút.</li>
        <li>Quan sát và cảm nhận: da căng kéo là da khô; bóng toàn mặt là da dầu; chỉ bóng vùng chữ T là da hỗn hợp; thoải mái, không bóng không căng là da thường.</li>
      </ol>

      <h2>Phép thử 2: Giấy thấm dầu</h2>
      <p>Sau 30 phút, ấn nhẹ giấy thấm dầu lên trán, mũi, má và cằm rồi soi giấy dưới ánh sáng. Giấy thấm nhiều dầu ở mọi vị trí → da dầu; chỉ ở trán và mũi → da hỗn hợp; gần như không có dầu → da khô hoặc da thường.</p>

      <h2>Dấu hiệu nhận biết da nhạy cảm</h2>
      <p>Da nhạy cảm thường đỏ lên khi rửa nước nóng, châm chích khi thoa toner có cồn, hoặc nổi mẩn khi đổi mỹ phẩm mới. Nếu bạn gặp từ hai dấu hiệu trở lên, hãy ưu tiên sản phẩm không hương liệu và xem thêm <a href="#/blog/dau-hieu-hang-rao-bao-ve-da-bi-ton-thuong">dấu hiệu hàng rào da bị tổn thương</a>.</p>

      <h2>Loại da có thay đổi không?</h2>
      <p>Có. Nội tiết, tuổi tác, khí hậu và cả việc dùng hoạt chất mạnh đều khiến loại da thay đổi. Nên kiểm tra lại mỗi khi chuyển mùa hoặc khi thấy routine cũ không còn phù hợp.</p>

      <h2>Kết luận</h2>
      <p>Sau khi biết loại da, bạn có thể chọn đúng <a href="#/blog/cach-chon-sua-rua-mat-theo-loai-da">sữa rửa mặt theo loại da</a> và các bước dưỡng phía sau. Một routine đúng loại da luôn hiệu quả hơn một routine đắt tiền nhưng sai hướng.</p>
    `,
    faq: [
      { q: 'Nên kiểm tra loại da vào lúc nào?', a: 'Buổi sáng hoặc sau khi rửa mặt 30 phút, khi da không có sản phẩm nào và không vừa vận động ra mồ hôi.' },
      { q: 'Da dầu nhưng vẫn căng khô là loại da gì?', a: 'Thường là da dầu thiếu nước. Da vẫn tiết dầu nhưng lớp sừng thiếu ẩm, cần bổ sung cấp nước nhẹ thay vì tẩy dầu mạnh.' }
    ]
  },

  {
    slug: 'da-thieu-nuoc-va-da-kho-khac-nhau-the-nao',
    keyword: 'da thiếu nước và da khô',
    category: 'kien-thuc',
    date: '2026-11-07',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-15.jpg',
    seoTitle: 'Da thiếu nước và da khô khác nhau thế nào?',
    metaDescription: 'Phân biệt da thiếu nước và da khô qua dấu hiệu, nguyên nhân và cách chăm sóc: cấp nước bằng chất hút ẩm hay bổ sung dầu để khóa ẩm.',
    title: 'Da thiếu nước và da khô: khác nhau thế nào, chăm sóc ra sao?',
    excerpt: 'Da khô là thiếu dầu, da thiếu nước là thiếu ẩm. Nhầm lẫn hai tình trạng này khiến nhiều người bôi kem đặc mà da vẫn căng rát.',
    products: ['neura-15', 'neura-16', 'drbargo-1'],
    content: `
      <p>Nhiều người nghĩ <strong>da thiếu nước và da khô</strong> là một. Thực tế, da khô là <em>loại da</em> (tuyến dầu hoạt động ít), còn da thiếu nước là <em>tình trạng</em> (lớp sừng thiếu ẩm) — và ngay cả da dầu cũng có thể thiếu nước.</p>

      <h2>Dấu hiệu nhận biết</h2>
      <h3>Da khô</h3>
      <ul>
        <li>Ít dầu quanh năm, lỗ chân lông nhỏ.</li>
        <li>Thô ráp, có thể bong vảy, dễ nứt nẻ khi lạnh.</li>
        <li>Cảm giác khô kéo dài kể cả khi đã dưỡng ẩm nhẹ.</li>
      </ul>
      <h3>Da thiếu nước</h3>
      <ul>
        <li>Vẫn có dầu nhưng bề mặt căng, sạm, kém đàn hồi.</li>
        <li>Xuất hiện nếp nhăn li ti khi véo nhẹ má.</li>
        <li>Lớp nền dễ mốc, da tiết dầu nhiều hơn để "bù".</li>
      </ul>

      <h2>Nguyên nhân</h2>
      <p>Da khô chủ yếu do cơ địa và tuổi tác. Da thiếu nước thường do môi trường điều hòa, uống ít nước, rửa mặt quá sạch, lạm dụng hoạt chất tẩy hoặc hàng rào da suy yếu.</p>

      <h2>Cách chăm sóc khác nhau</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-15.jpg', 'Mặt nạ cấp ẩm ôm khít Neuraderm M.BT Hydration Fit Mask cho da thiếu nước')}
      <ul>
        <li><strong>Da thiếu nước:</strong> ưu tiên chất hút ẩm (Hyaluronic Acid, Glycerin, Panthenol) trong toner, serum, mặt nạ; sau đó khóa bằng kem mỏng nhẹ.</li>
        <li><strong>Da khô:</strong> cần cả nước lẫn dầu — bổ sung Ceramide, Squalane, bơ hạt mỡ trong kem dưỡng giàu dưỡng chất.</li>
      </ul>

      <h2>Thói quen hỗ trợ</h2>
      <ol>
        <li>Rửa mặt bằng nước mát, không dùng nước nóng.</li>
        <li>Thoa dưỡng ẩm trong vòng 1 phút sau khi rửa mặt, khi da còn hơi ẩm.</li>
        <li>Dùng máy tạo ẩm nếu ngồi điều hòa cả ngày.</li>
        <li>Đắp mặt nạ cấp ẩm 2 – 3 lần/tuần. Xem <a href="#/blog/dap-mat-na-giay-bao-nhieu-lan-mot-tuan">đắp mặt nạ giấy bao nhiêu lần một tuần</a>.</li>
      </ol>

      <h2>Kết luận</h2>
      <p>Xác định đúng tình trạng giúp bạn chọn đúng sản phẩm: da thiếu nước cần "nước", da khô cần "dầu". Nhiều làn da cần cả hai — khi đó hãy kết hợp serum cấp ẩm và kem dưỡng phục hồi như <a href="#/thuong-hieu/neuraderm">Neuraderm Neuro Lacto Moisturizer</a>.</p>
    `,
    faq: [
      { q: 'Da dầu có bị thiếu nước không?', a: 'Có, và khá phổ biến. Da dầu thiếu nước thường bóng nhờn nhưng vẫn căng, sần, dễ nổi mụn ẩn.' },
      { q: 'Uống nhiều nước có hết da thiếu nước không?', a: 'Uống đủ nước hỗ trợ cơ thể nhưng không đủ để cấp ẩm cho lớp sừng; vẫn cần sản phẩm dưỡng ẩm bôi ngoài da.' }
    ]
  },

  {
    slug: 'lo-chan-long-to-nguyen-nhan-va-cach-thu-nho',
    keyword: 'lỗ chân lông to',
    category: 'kien-thuc',
    date: '2026-10-31',
    readTime: 5,
    cover: '/assets/images/catalog/medipharm/stemc-4.jpg',
    seoTitle: 'Lỗ chân lông to: nguyên nhân và cách thu nhỏ hiệu quả',
    metaDescription: 'Vì sao lỗ chân lông to? Tìm hiểu nguyên nhân do dầu thừa, lão hóa, ánh nắng và cách chăm sóc giúp lỗ chân lông trông nhỏ và mịn hơn.',
    title: 'Lỗ chân lông to: nguyên nhân và cách thu nhỏ hiệu quả',
    excerpt: 'Không có sản phẩm nào "đóng" được lỗ chân lông, nhưng chăm sóc đúng có thể giúp chúng trông nhỏ và đều màu hơn rõ rệt.',
    products: ['stemc-4', 'stemc-5', 'drbargo-4'],
    content: `
      <p><strong>Lỗ chân lông to</strong> là nỗi lo của nhiều người, đặc biệt da dầu và da hỗn hợp. Kích thước lỗ chân lông phần lớn do gen quyết định, nhưng dầu thừa, bụi bẩn và lão hóa khiến chúng giãn rộng và lộ rõ hơn.</p>

      <h2>Nguyên nhân khiến lỗ chân lông to</h2>
      <ul>
        <li><strong>Tiết dầu nhiều:</strong> dầu và tế bào chết tích tụ làm thành lỗ chân lông căng ra.</li>
        <li><strong>Lão hóa:</strong> collagen giảm, da kém đàn hồi nên lỗ chân lông chảy xệ, trông to hơn.</li>
        <li><strong>Tia UV:</strong> phá hủy collagen quanh lỗ chân lông.</li>
        <li><strong>Nặn mụn sai cách:</strong> gây tổn thương, để lại lỗ chân lông giãn và sẹo rỗ.</li>
      </ul>

      <h2>Cách giúp lỗ chân lông trông nhỏ hơn</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-4.jpg', 'Nước hoa hồng Stem C Toner giúp cân bằng và làm mịn bề mặt da')}
      <h3>1. Làm sạch kỹ nhưng dịu nhẹ</h3>
      <p>Tẩy trang mỗi tối và rửa mặt với sữa rửa mặt pH cân bằng. Làm sạch quá mạnh khiến da tiết dầu bù, lỗ chân lông càng to.</p>
      <h3>2. Tẩy tế bào chết hóa học</h3>
      <p>BHA (Salicylic Acid) tan trong dầu, len vào lỗ chân lông làm sạch bã nhờn. Dùng 2 – 3 lần/tuần, bắt đầu từ nồng độ thấp.</p>
      <h3>3. Cân bằng bằng toner</h3>
      <p>Toner giúp cân bằng độ ẩm, làm mịn bề mặt để lỗ chân lông kém rõ. Xem thêm <a href="#/blog/toner-co-can-thiet-khong">toner có cần thiết không</a>.</p>
      <h3>4. Bổ sung hoạt chất tăng đàn hồi</h3>
      <p>Retinol, Niacinamide và Peptide hỗ trợ collagen, giúp thành lỗ chân lông săn chắc hơn theo thời gian.</p>
      <h3>5. Chống nắng mỗi ngày</h3>
      <p>Bảo vệ collagen là cách phòng lỗ chân lông giãn rộng lâu dài.</p>

      <h2>Những điều nên tránh</h2>
      <ul>
        <li>Tự nặn mụn, lột mụn bằng miếng dán quá thường xuyên.</li>
        <li>Dùng sản phẩm chứa cồn cao để "se" lỗ chân lông — chỉ có tác dụng tức thời và làm khô da.</li>
        <li>Bỏ qua dưỡng ẩm vì sợ bí.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Lỗ chân lông không biến mất, nhưng có thể trông nhỏ và mịn hơn nhiều sau 6 – 8 tuần chăm sóc đúng. Kiên trì với làm sạch, cân bằng và chống nắng là chìa khóa.</p>
    `,
    faq: [
      { q: 'Nước đá có làm se khít lỗ chân lông không?', a: 'Chỉ làm co tạm thời trong vài phút. Không nên chườm đá trực tiếp lâu vì có thể gây tổn thương mao mạch.' },
      { q: 'Bao lâu thì thấy lỗ chân lông nhỏ hơn?', a: 'Thường sau 4 – 8 tuần dùng BHA, retinol hoặc niacinamide đều đặn kết hợp chống nắng.' }
    ]
  },

  {
    slug: 'mun-an-la-gi-cach-xu-ly-mun-an',
    keyword: 'mụn ẩn',
    category: 'kien-thuc',
    date: '2026-10-26',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-7.jpg',
    seoTitle: 'Mụn ẩn là gì? Nguyên nhân và cách xử lý đúng',
    metaDescription: 'Mụn ẩn là gì, vì sao da nổi mụn ẩn li ti dưới da và cách xử lý mụn ẩn an toàn bằng làm sạch, tẩy tế bào chết nhẹ và phục hồi hệ vi sinh.',
    title: 'Mụn ẩn là gì? Nguyên nhân và cách xử lý đúng',
    excerpt: 'Những nốt sần li ti dưới da, sờ thấy cộm nhưng không có nhân trắng — đó là mụn ẩn. Xử lý sai rất dễ biến chúng thành mụn viêm.',
    products: ['neura-7', 'neura-8', 'neura-1'],
    content: `
      <p><strong>Mụn ẩn</strong> là những nốt mụn nhỏ nằm sâu dưới da, chưa có nhân lộ ra ngoài. Chúng làm bề mặt da sần sùi, kém mịn và có thể bùng thành mụn viêm nếu bị kích thích.</p>

      <h2>Vì sao nổi mụn ẩn?</h2>
      <ul>
        <li>Bã nhờn và tế bào chết bít tắc lỗ chân lông.</li>
        <li>Dùng mỹ phẩm quá dày, không tẩy trang kỹ.</li>
        <li>Hàng rào da và hệ vi sinh mất cân bằng.</li>
        <li>Thay đổi nội tiết, căng thẳng, thức khuya.</li>
      </ul>

      <h2>Cách xử lý mụn ẩn</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-7.jpg', 'Serum men vi sinh Neuraderm Neuro Lacto Serum hỗ trợ cân bằng da dễ nổi mụn ẩn')}
      <h3>Làm sạch 2 bước buổi tối</h3>
      <p>Tẩy trang hoặc dầu tẩy trang, sau đó rửa lại bằng sữa rửa mặt dịu nhẹ để loại bỏ hoàn toàn kem chống nắng và bụi bẩn.</p>
      <h3>Tẩy tế bào chết nhẹ nhàng</h3>
      <p>BHA nồng độ 1 – 2% dùng 2 – 3 tối/tuần giúp thông thoáng lỗ chân lông. Không chà hạt mạnh vì dễ gây viêm.</p>
      <h3>Cân bằng hệ vi sinh</h3>
      <p>Da có hệ vi sinh khỏe mạnh sẽ kiểm soát vi khuẩn gây mụn tốt hơn. Sản phẩm chứa lợi khuẩn như dòng Neuro Lacto giúp da ổn định. Xem thêm <a href="#/blog/xu-huong-cham-soc-he-vi-sinh-da-microbiome">xu hướng chăm sóc hệ vi sinh da</a>.</p>
      <h3>Dưỡng ẩm mỏng nhẹ</h3>
      <p>Da thiếu ẩm sẽ tiết dầu nhiều hơn. Chọn kem dạng gel hoặc lotion không gây bít tắc. Xem <a href="#/blog/da-dau-mun-co-can-kem-duong-am-khong">da dầu mụn có cần kem dưỡng ẩm không</a>.</p>

      <h2>Không nên làm gì?</h2>
      <ul>
        <li>Nặn mụn ẩn khi chưa có nhân — dễ để lại thâm và sẹo.</li>
        <li>Dùng cùng lúc quá nhiều hoạt chất trị mụn.</li>
        <li>Thay sản phẩm liên tục khi chưa đủ 4 tuần.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Mụn ẩn cần kiên nhẫn: làm sạch đúng, tẩy tế bào chết vừa phải và giữ hàng rào da khỏe. Nếu mụn ẩn kéo dài hoặc lan rộng, hãy gặp bác sĩ da liễu.</p>
    `,
    faq: [
      { q: 'Mụn ẩn bao lâu thì hết?', a: 'Thường cần 4 – 8 tuần chăm sóc đều đặn, vì đó là thời gian da hoàn thành chu kỳ thay mới.' },
      { q: 'Có nên đắp mặt nạ đất sét trị mụn ẩn không?', a: 'Có thể dùng 1 lần/tuần cho da dầu, nhưng nên dưỡng ẩm ngay sau đó để tránh khô da.' }
    ]
  },

  {
    slug: 'collagen-va-qua-trinh-lao-hoa-da',
    keyword: 'collagen và lão hóa da',
    category: 'kien-thuc',
    date: '2026-10-18',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-3.jpg',
    seoTitle: 'Collagen và lão hóa da: hiểu đúng để chăm sóc đúng',
    metaDescription: 'Collagen giảm từ tuổi 25 khiến da chảy xệ, nếp nhăn xuất hiện. Tìm hiểu mối liên hệ giữa collagen và lão hóa da, cách kích thích collagen tự nhiên.',
    title: 'Collagen và lão hóa da: hiểu đúng để chăm sóc đúng',
    excerpt: 'Từ tuổi 25, mỗi năm da mất khoảng 1% collagen. Biết điều gì phá hủy collagen và cách kích thích nó giúp làm chậm lão hóa hiệu quả.',
    products: ['neura-3', 'neura-9', 'stemc-2'],
    content: `
      <p><strong>Collagen</strong> là protein chiếm khoảng 75% trọng lượng khô của lớp trung bì, giữ cho da căng, đàn hồi. Mối liên hệ giữa <strong>collagen và lão hóa da</strong> rất rõ: collagen giảm đến đâu, nếp nhăn và chảy xệ xuất hiện đến đó.</p>

      <h2>Collagen giảm như thế nào?</h2>
      <p>Cơ thể sản sinh collagen chậm dần từ khoảng tuổi 25, mỗi năm mất khoảng 1%. Sau mãn kinh, tốc độ này có thể tăng mạnh trong vài năm đầu.</p>

      <h2>Những yếu tố phá hủy collagen</h2>
      <ul>
        <li><strong>Tia UV:</strong> nguyên nhân hàng đầu gây lão hóa sớm (photoaging).</li>
        <li><strong>Đường và glycation:</strong> đường gắn vào sợi collagen làm chúng cứng, giòn.</li>
        <li><strong>Hút thuốc, khói bụi:</strong> tạo gốc tự do phá vỡ cấu trúc collagen.</li>
        <li><strong>Thiếu ngủ, căng thẳng:</strong> cortisol cao làm giảm tái tạo da.</li>
      </ul>

      <h2>Cách kích thích collagen tự nhiên</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-3.jpg', 'Ampoule Neuraderm Coretime hỗ trợ nâng cơ và giảm nếp nhăn')}
      <ol>
        <li><strong>Retinoid:</strong> hoạt chất được nghiên cứu nhiều nhất về kích thích collagen.</li>
        <li><strong>Vitamin C:</strong> cần thiết cho quá trình tổng hợp collagen, đồng thời chống oxy hóa.</li>
        <li><strong>Peptide:</strong> "tín hiệu" giúp da tăng sản xuất collagen. Xem <a href="#/blog/peptide-la-gi-cong-dung-chong-lao-hoa">peptide là gì</a>.</li>
        <li><strong>Growth factor (EGF, bFGF):</strong> hỗ trợ tái tạo và phục hồi.</li>
        <li><strong>Chống nắng mỗi ngày:</strong> bước "giữ" collagen quan trọng nhất.</li>
      </ol>

      <h2>Bôi collagen có tác dụng không?</h2>
      <p>Phân tử collagen quá lớn để thấm vào trung bì. Collagen bôi ngoài chủ yếu giữ ẩm bề mặt. Muốn tăng collagen thật sự, hãy dùng các hoạt chất kích thích da tự sản sinh như trên.</p>

      <h2>Kết luận</h2>
      <p>Chống lão hóa hiệu quả là bảo vệ collagen hiện có và kích thích collagen mới. Kết hợp chống nắng, hoạt chất phù hợp và lối sống lành mạnh sẽ giúp da trẻ lâu hơn.</p>
    `,
    faq: [
      { q: 'Nên bắt đầu chống lão hóa từ tuổi nào?', a: 'Chống nắng nên dùng từ rất sớm; hoạt chất như retinol, peptide có thể bắt đầu từ khoảng 25 tuổi.' },
      { q: 'Uống collagen có giúp đẹp da không?', a: 'Một số nghiên cứu cho thấy collagen thủy phân hỗ trợ độ ẩm và đàn hồi, nhưng không thay thế được chống nắng và skincare.' }
    ]
  },

  /* ---------------- Hướng dẫn sử dụng ---------------- */
  {
    slug: 'cach-tay-trang-dung-cach',
    keyword: 'cách tẩy trang đúng cách',
    category: 'huong-dan',
    date: '2026-11-11',
    readTime: 4,
    cover: '/assets/images/catalog/medipharm/stemc-5.jpg',
    seoTitle: 'Cách tẩy trang đúng cách cho từng loại da',
    metaDescription: 'Hướng dẫn cách tẩy trang đúng cách với nước tẩy trang, dầu tẩy trang: các bước, thời gian, lỗi thường gặp và cách chọn sản phẩm theo loại da.',
    title: 'Cách tẩy trang đúng cách: 5 bước sạch sâu mà không khô da',
    excerpt: 'Kem chống nắng và lớp nền không thể sạch chỉ bằng sữa rửa mặt. Tẩy trang đúng là nền móng cho mọi bước dưỡng phía sau.',
    products: ['stemc-5', 'neura-1', 'drbargo-2'],
    content: `
      <p>Kể cả không trang điểm, bạn vẫn cần tẩy trang nếu dùng kem chống nắng. <strong>Cách tẩy trang đúng cách</strong> giúp loại bỏ dầu, bụi mịn và màng lọc chống nắng mà không làm tổn thương hàng rào da.</p>

      <h2>Chọn sản phẩm tẩy trang theo loại da</h2>
      <ul>
        <li><strong>Nước tẩy trang (micellar):</strong> nhẹ, hợp da dầu, da nhạy cảm, trang điểm nhẹ.</li>
        <li><strong>Dầu / sáp tẩy trang:</strong> hòa tan tốt lớp trang điểm dày, kem chống nắng chống nước; hợp da khô, da thường.</li>
        <li><strong>Sữa tẩy trang:</strong> dịu nhẹ, hợp da khô nhạy cảm.</li>
      </ul>

      <h2>5 bước tẩy trang với nước tẩy trang</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-5.jpg', 'Nước tẩy trang MediPharm Stem C Cleansing Water làm sạch sâu dịu nhẹ')}
      <ol>
        <li>Rửa tay sạch, buộc gọn tóc.</li>
        <li>Thấm đẫm bông tẩy trang, không để bông khô.</li>
        <li>Áp bông lên mắt và môi 10 – 15 giây để lớp trang điểm tan ra rồi lau nhẹ theo một chiều.</li>
        <li>Lau toàn mặt từ trong ra ngoài, thay bông đến khi bông sạch.</li>
        <li>Rửa lại bằng sữa rửa mặt dịu nhẹ (làm sạch kép).</li>
      </ol>

      <h2>Với dầu tẩy trang</h2>
      <p>Thoa dầu lên da <em>khô</em>, massage 30 – 60 giây, sau đó làm ướt tay để nhũ hóa (dầu chuyển màu trắng đục) rồi rửa sạch bằng nước ấm, tiếp theo là sữa rửa mặt.</p>

      <h2>Lỗi thường gặp</h2>
      <ul>
        <li>Chà xát mạnh vùng mắt gây nếp nhăn và thâm.</li>
        <li>Bỏ qua bước rửa mặt sau tẩy trang, để cặn tồn đọng.</li>
        <li>Dùng khăn ướt tẩy trang hằng ngày — tiện nhưng dễ kích ứng.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Tẩy trang kỹ, nhẹ tay và làm sạch kép là đủ cho hầu hết làn da. Sau đó, chọn <a href="#/blog/cach-chon-sua-rua-mat-theo-loai-da">sữa rửa mặt theo loại da</a> và tiếp tục routine dưỡng.</p>
    `,
    faq: [
      { q: 'Không trang điểm có cần tẩy trang không?', a: 'Nếu dùng kem chống nắng, đặc biệt loại chống nước, bạn vẫn nên tẩy trang hoặc làm sạch kép vào buổi tối.' },
      { q: 'Tẩy trang xong có cần rửa mặt không?', a: 'Nên rửa lại bằng sữa rửa mặt dịu nhẹ để loại bỏ cặn tẩy trang và bụi bẩn còn sót.' }
    ]
  },

  {
    slug: 'cach-dung-serum-dung-cach',
    keyword: 'cách dùng serum',
    category: 'huong-dan',
    date: '2026-11-06',
    readTime: 4,
    cover: '/assets/images/catalog/dr-bargo/drbargo-3-g1.jpg',
    seoTitle: 'Cách dùng serum đúng cách để thấm nhanh, hiệu quả',
    metaDescription: 'Hướng dẫn cách dùng serum đúng: dùng bao nhiêu giọt, bước nào trong routine, kết hợp nhiều serum ra sao và những lỗi khiến serum kém hiệu quả.',
    title: 'Cách dùng serum đúng cách để thấm nhanh và hiệu quả',
    excerpt: 'Serum là bước chứa hoạt chất đậm đặc nhất. Dùng sai lượng hoặc sai thứ tự sẽ khiến bạn tốn tiền mà da không đổi.',
    products: ['drbargo-3', 'neura-7', 'neura-3'],
    content: `
      <p>Serum chứa nồng độ hoạt chất cao với kết cấu mỏng nhẹ, thấm sâu. Nắm đúng <strong>cách dùng serum</strong> giúp bạn tận dụng tối đa sản phẩm.</p>

      <h2>Serum dùng ở bước nào?</h2>
      <p>Thứ tự cơ bản: làm sạch → toner → <strong>serum</strong> → kem dưỡng → kem chống nắng (ban ngày). Nguyên tắc chung là kết cấu từ mỏng đến dày. Xem chi tiết <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare sáng tối</a>.</p>

      <h2>Các bước thoa serum</h2>
      ${fig('/assets/images/catalog/dr-bargo/drbargo-3-g1.jpg', 'Tinh chất phục hồi Dr.BARGO Serum dùng sau toner')}
      <ol>
        <li>Lấy 2 – 3 giọt (khoảng bằng hạt đậu) cho toàn mặt.</li>
        <li>Chấm lên trán, hai má, mũi, cằm.</li>
        <li>Dàn đều và vỗ nhẹ bằng đầu ngón tay, không chà xát.</li>
        <li>Áp lòng bàn tay lên mặt vài giây để serum thấm.</li>
        <li>Chờ 30 – 60 giây trước bước tiếp theo.</li>
      </ol>

      <h2>Dùng nhiều serum cùng lúc được không?</h2>
      <p>Được, nhưng tối đa 2 loại mỗi lần và tránh các cặp dễ kích ứng như Retinol + AHA/BHA hay Vitamin C nồng độ cao + AHA. Bạn có thể chia: buổi sáng serum chống oxy hóa, buổi tối serum phục hồi hoặc treatment. Xem <a href="#/blog/vi-sao-serum-buoi-toi-chong-nang-buoi-sang">vì sao serum buổi tối, chống nắng buổi sáng</a>.</p>

      <h2>Lỗi thường gặp</h2>
      <ul>
        <li>Dùng quá nhiều giọt khiến da bết, vón và lãng phí.</li>
        <li>Bỏ kem dưỡng sau serum, làm hoạt chất bay hơi cùng nước.</li>
        <li>Bảo quản nơi nóng hoặc có ánh nắng làm hoạt chất mất tác dụng.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Đúng lượng, đúng thứ tự và kiên trì ít nhất 4 tuần — đó là cách để serum phát huy hiệu quả. Hãy chọn serum theo vấn đề chính của da thay vì chạy theo nhiều loại cùng lúc.</p>
    `,
    faq: [
      { q: 'Serum dùng sáng hay tối?', a: 'Tùy hoạt chất. Vitamin C hợp buổi sáng; retinol, AHA/BHA hợp buổi tối; serum cấp ẩm, phục hồi dùng được cả hai.' },
      { q: 'Có cần đợi serum khô hẳn mới thoa kem không?', a: 'Không cần khô hẳn, chỉ cần serum thấm (khoảng 30 – 60 giây) là có thể thoa kem dưỡng.' }
    ]
  },

  {
    slug: 'cach-dung-xit-khoang-dung-cach',
    keyword: 'cách dùng xịt khoáng',
    category: 'huong-dan',
    date: '2026-10-29',
    readTime: 3,
    cover: '/assets/images/catalog/neuraderm/neura-2.jpg',
    seoTitle: 'Cách dùng xịt khoáng đúng cách để không làm khô da',
    metaDescription: 'Xịt khoáng dùng sai có thể làm da khô hơn. Hướng dẫn cách dùng xịt khoáng đúng: khoảng cách, thời điểm, cách thấm và kết hợp với kem dưỡng.',
    title: 'Cách dùng xịt khoáng đúng cách để không làm khô da',
    excerpt: 'Xịt khoáng rồi để tự bay hơi có thể kéo theo cả độ ẩm trên da. Chỉ cần thêm một thao tác nhỏ là khắc phục được.',
    products: ['neura-2', 'stemc-4', 'neura-16'],
    content: `
      <p>Xịt khoáng giúp làm dịu, cấp ẩm tức thì và giữ lớp trang điểm tươi tắn. Tuy nhiên nếu không biết <strong>cách dùng xịt khoáng</strong>, nước bay hơi có thể khiến da khô hơn trước.</p>

      <h2>Cách xịt đúng</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-2.jpg', 'Xịt khoáng Neuraderm Calming Mist cấp ẩm làm dịu tức thì')}
      <ol>
        <li>Lắc nhẹ chai (nếu có hướng dẫn), nhắm mắt.</li>
        <li>Giữ chai cách mặt 20 – 30cm để hạt sương mịn và đều.</li>
        <li>Xịt 2 – 3 lần theo hình chữ Z.</li>
        <li>Đợi 10 – 15 giây rồi vỗ nhẹ hoặc thấm bằng khăn giấy — không để tự bay hơi hoàn toàn.</li>
        <li>Thoa kem dưỡng ngay sau đó để khóa ẩm.</li>
      </ol>

      <h2>Khi nào nên dùng xịt khoáng?</h2>
      <ul>
        <li>Sau rửa mặt, thay toner cho da nhạy cảm.</li>
        <li>Giữa ngày khi ngồi điều hòa lâu.</li>
        <li>Sau khi đi nắng, tập thể dục để làm dịu.</li>
        <li>Trước và sau trang điểm giúp lớp nền ẩm mịn.</li>
        <li>Sau treatment, laser khi da nóng rát. Xem <a href="#/blog/cham-soc-da-sau-laser-peel">chăm sóc da sau laser, peel</a>.</li>
      </ul>

      <h2>Sai lầm thường gặp</h2>
      <ul>
        <li>Xịt quá nhiều lần trong ngày mà không dưỡng ẩm lại.</li>
        <li>Chọn xịt khoáng có cồn, hương liệu cho da nhạy cảm.</li>
        <li>Xịt khi da đang có lớp bụi bẩn mà không làm sạch.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Xịt khoáng là "trợ thủ" tiện lợi, nhưng chỉ phát huy tác dụng khi được thấm nhẹ và khóa ẩm. Hãy chọn sản phẩm có thành phần làm dịu như Panthenol, Allantoin cho da nhạy cảm.</p>
    `,
    faq: [
      { q: 'Xịt khoáng có thay toner được không?', a: 'Được với da nhạy cảm hoặc routine tối giản, nhất là các loại xịt có thành phần cấp ẩm, làm dịu.' },
      { q: 'Một ngày nên xịt bao nhiêu lần?', a: 'Khoảng 2 – 4 lần là đủ, mỗi lần nên thấm nhẹ và dưỡng ẩm lại nếu da khô.' }
    ]
  },

  {
    slug: 'cach-dung-kem-duong-am-hieu-qua',
    keyword: 'cách dùng kem dưỡng ẩm',
    category: 'huong-dan',
    date: '2026-10-22',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-16.jpg',
    seoTitle: 'Cách dùng kem dưỡng ẩm hiệu quả cho mọi loại da',
    metaDescription: 'Hướng dẫn cách dùng kem dưỡng ẩm: lượng dùng, thời điểm thoa, kỹ thuật massage và cách chọn kết cấu kem phù hợp da dầu, da khô, da nhạy cảm.',
    title: 'Cách dùng kem dưỡng ẩm hiệu quả cho mọi loại da',
    excerpt: 'Kem dưỡng là bước khóa lại mọi dưỡng chất phía trước. Thoa đúng thời điểm và đúng lượng giúp da mềm mịn cả ngày.',
    products: ['neura-16', 'neura-10', 'drbargo-1'],
    content: `
      <p>Dù da dầu hay da khô, kem dưỡng ẩm đều là bước không thể thiếu. Biết <strong>cách dùng kem dưỡng ẩm</strong> đúng giúp da giữ nước, củng cố hàng rào bảo vệ và tăng hiệu quả của serum.</p>

      <h2>Chọn kết cấu theo loại da</h2>
      <ul>
        <li><strong>Da dầu, da mụn:</strong> gel, gel-cream, lotion mỏng nhẹ.</li>
        <li><strong>Da hỗn hợp:</strong> emulsion, cream nhẹ; có thể dùng kem đặc hơn cho vùng má.</li>
        <li><strong>Da khô, da nhạy cảm:</strong> cream giàu Ceramide, Squalane, bơ hạt mỡ.</li>
      </ul>

      <h2>Các bước thoa kem dưỡng</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-16.jpg', 'Kem dưỡng ẩm men vi sinh Neuraderm Neuro Lacto Moisturizer')}
      <ol>
        <li>Thoa khi da còn hơi ẩm sau serum hoặc toner.</li>
        <li>Lấy lượng bằng hạt đậu lớn (khoảng 1 đốt ngón tay út).</li>
        <li>Làm ấm kem giữa hai đầu ngón tay.</li>
        <li>Chấm 5 điểm và dàn đều từ trong ra ngoài, từ dưới lên trên.</li>
        <li>Đừng quên cổ và vùng quai hàm.</li>
      </ol>

      <h2>Kem dưỡng ngày và đêm có khác nhau?</h2>
      <p>Ban ngày nên dùng kem mỏng để lớp kem chống nắng bám tốt. Ban đêm có thể dùng kem đặc hơn hoặc kem phục hồi vì da tái tạo mạnh nhất lúc ngủ.</p>

      <h2>Mẹo tăng hiệu quả</h2>
      <ul>
        <li>Da rất khô: thoa thêm một lớp mỏng lên vùng khô sau 5 phút.</li>
        <li>Da đang treatment: dùng kỹ thuật sandwich (kem – retinol – kem).</li>
        <li>Đậy nắp kín, dùng thìa lấy kem dạng hũ để vệ sinh.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Kem dưỡng đúng kết cấu, thoa đúng lúc là cách đơn giản nhất để da khỏe. Xem thêm <a href="#/blog/da-dau-mun-co-can-kem-duong-am-khong">da dầu mụn có cần kem dưỡng ẩm không</a>.</p>
    `,
    faq: [
      { q: 'Da dầu có cần kem dưỡng ẩm không?', a: 'Có. Thiếu ẩm khiến da tiết dầu nhiều hơn; chọn kem dạng gel hoặc lotion không gây bít tắc.' },
      { q: 'Thoa kem dưỡng xong bao lâu thì bôi kem chống nắng?', a: 'Khoảng 1 – 3 phút, khi kem dưỡng đã thấm và bề mặt da không còn trơn ướt.' }
    ]
  },

  {
    slug: 'cach-dung-dau-goi-va-kem-u-toc-dung-cach',
    keyword: 'cách dùng kem ủ tóc',
    category: 'huong-dan',
    date: '2026-10-15',
    readTime: 4,
    cover: '/assets/images/catalog/smib/smib-8.jpg',
    seoTitle: 'Cách dùng dầu gội và kem ủ tóc đúng cách',
    metaDescription: 'Hướng dẫn cách dùng dầu gội và kem ủ tóc đúng: gội da đầu, ủ ngọn tóc, thời gian ủ và tần suất giúp tóc mềm mượt, giảm gãy rụng.',
    title: 'Cách dùng dầu gội và kem ủ tóc đúng cách cho tóc mềm mượt',
    excerpt: 'Dầu gội dành cho da đầu, kem ủ dành cho thân và ngọn tóc. Đảo ngược thứ tự này là lý do tóc vừa bết vừa xơ.',
    products: ['smib-8', 'smib-3', 'smib-6'],
    content: `
      <p>Nhiều người thoa kem ủ lên cả da đầu hoặc chỉ xả qua loa vài giây. Hiểu <strong>cách dùng kem ủ tóc</strong> và dầu gội đúng giúp tóc mềm mượt mà da đầu vẫn sạch thoáng.</p>

      <h2>Bước 1: Gội đầu đúng cách</h2>
      <ol>
        <li>Làm ướt tóc hoàn toàn bằng nước ấm (không nóng) khoảng 1 phút.</li>
        <li>Tạo bọt dầu gội trên tay trước khi thoa.</li>
        <li>Tập trung massage <strong>da đầu</strong> bằng đầu ngón tay, không dùng móng.</li>
        <li>Để bọt tự chảy xuống thân tóc, không cần chà xát ngọn.</li>
        <li>Xả sạch hoàn toàn.</li>
      </ol>
      <p>Xem thêm <a href="#/blog/goi-dau-dung-cach-da-dau-dau-gau-rung-toc">gội đầu đúng cách cho da đầu dầu, gàu, rụng tóc</a>.</p>

      <h2>Bước 2: Ủ tóc</h2>
      ${fig('/assets/images/catalog/smib/smib-8.jpg', 'Kem ủ tóc SMIB LactoBio Silk Treatment giúp tóc mềm mượt')}
      <ol>
        <li>Vắt nhẹ cho tóc bớt nước.</li>
        <li>Thoa kem ủ từ <strong>giữa thân đến ngọn tóc</strong>, tránh chân tóc và da đầu.</li>
        <li>Dùng lược răng thưa chải đều.</li>
        <li>Ủ 1 – 5 phút tùy hướng dẫn sản phẩm (có thể quấn khăn ấm để thấm tốt hơn).</li>
        <li>Xả lại bằng nước mát để tóc bóng mượt.</li>
      </ol>

      <h2>Tần suất phù hợp</h2>
      <ul>
        <li>Da đầu dầu: gội 1 lần/ngày hoặc cách ngày.</li>
        <li>Da đầu khô: 2 – 3 lần/tuần.</li>
        <li>Kem ủ: mỗi lần gội với tóc hư tổn; 2 – 3 lần/tuần với tóc thường.</li>
      </ul>

      <h2>Sai lầm thường gặp</h2>
      <ul>
        <li>Thoa kem ủ lên da đầu gây bết và bít nang tóc.</li>
        <li>Sấy nhiệt cao khi tóc còn ướt sũng.</li>
        <li>Buộc tóc khi chưa khô hẳn.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Dầu gội cho da đầu, kem ủ cho ngọn tóc — nguyên tắc đơn giản giúp tóc khỏe lâu dài. Dòng <a href="#/thuong-hieu/smib">SMIB LactoBio</a> kết hợp lợi khuẩn giúp chăm sóc cả da đầu lẫn thân tóc.</p>
    `,
    faq: [
      { q: 'Kem ủ và dầu xả khác nhau thế nào?', a: 'Dầu xả làm mượt bề mặt nhanh, còn kem ủ giàu dưỡng chất hơn, cần thời gian để thấm vào thân tóc.' },
      { q: 'Có nên ủ tóc qua đêm không?', a: 'Chỉ nên làm với sản phẩm được thiết kế để ủ lâu; kem ủ thông thường nên xả sạch sau vài phút.' }
    ]
  },

  /* ---------------- Mẹo làm đẹp mỗi ngày ---------------- */
  {
    slug: 'meo-cham-soc-da-khi-ngoi-dieu-hoa-ca-ngay',
    keyword: 'chăm sóc da khi ngồi điều hòa',
    category: 'meo-lam-dep',
    date: '2026-11-12',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-13.jpg',
    seoTitle: 'Mẹo chăm sóc da khi ngồi điều hòa cả ngày',
    metaDescription: 'Ngồi điều hòa 8 tiếng khiến da khô căng, bong tróc. 6 mẹo chăm sóc da khi ngồi điều hòa giúp da văn phòng luôn ẩm mịn.',
    title: '6 mẹo chăm sóc da khi ngồi điều hòa cả ngày',
    excerpt: 'Không khí điều hòa hút ẩm khỏi da từng giờ. Vài thói quen nhỏ tại bàn làm việc giúp da văn phòng không còn khô căng.',
    products: ['neura-2', 'neura-13', 'neura-16'],
    content: `
      <p>Điều hòa làm giảm độ ẩm không khí, khiến nước trên da bốc hơi nhanh. Những <strong>mẹo chăm sóc da khi ngồi điều hòa</strong> dưới đây dễ áp dụng ngay tại văn phòng.</p>

      <h2>1. Dưỡng ẩm kỹ từ buổi sáng</h2>
      <p>Thoa serum cấp ẩm rồi khóa bằng kem dưỡng có Ceramide trước khi đến văn phòng. Lớp nền ẩm tốt giúp da chịu đựng cả ngày.</p>

      <h2>2. Mang theo xịt khoáng</h2>
      <p>Xịt 2 – 3 lần mỗi buổi và nhớ thấm nhẹ. Xem <a href="#/blog/cach-dung-xit-khoang-dung-cach">cách dùng xịt khoáng đúng cách</a>.</p>

      <h2>3. Đặt một máy tạo ẩm mini</h2>
      <p>Máy tạo ẩm để bàn giúp vùng không khí quanh bạn ẩm hơn, giảm khô da và khô mắt.</p>

      <h2>4. Uống nước đều đặn</h2>
      <p>Đặt bình nước 1 lít trên bàn và uống từng ngụm mỗi giờ thay vì đợi khát.</p>

      <h2>5. Đắp mặt nạ cấp ẩm buổi tối</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-13.jpg', 'Mặt nạ cấp ẩm và sáng da Neuraderm Hydro Brightening Mask Pack')}
      <p>2 – 3 lần/tuần, mặt nạ giấy cấp ẩm giúp bù lại lượng nước da mất trong ngày.</p>

      <h2>6. Đừng chỉnh nhiệt độ quá thấp</h2>
      <p>Nhiệt độ 25 – 27°C vừa dễ chịu vừa ít làm khô da. Hướng gió điều hòa không nên thổi thẳng vào mặt.</p>

      <h2>Kết luận</h2>
      <p>Da văn phòng cần cấp ẩm liên tục và khóa ẩm đúng cách. Kết hợp những thói quen nhỏ này với routine phù hợp, da sẽ mềm mịn suốt cả ngày dài.</p>
    `,
    faq: [
      { q: 'Có nên dặm kem dưỡng giữa ngày không?', a: 'Có thể thoa lớp kem dưỡng mỏng lên vùng khô, hoặc dùng xịt khoáng rồi vỗ nhẹ để da hấp thụ.' },
      { q: 'Da dầu ngồi điều hòa có bị khô không?', a: 'Có. Da dầu vẫn có thể thiếu nước khi ngồi điều hòa lâu, dẫn đến tiết dầu nhiều hơn.' }
    ]
  },

  {
    slug: 'meo-ngu-dung-cach-de-da-dep-hon',
    keyword: 'ngủ đủ giấc đẹp da',
    category: 'meo-lam-dep',
    date: '2026-11-04',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-12.jpg',
    seoTitle: 'Mẹo ngủ đúng cách để da đẹp hơn mỗi sáng',
    metaDescription: 'Giấc ngủ ảnh hưởng trực tiếp đến làn da. Những mẹo ngủ đủ giấc đẹp da: giờ ngủ, vỏ gối, tư thế và routine trước khi ngủ.',
    title: 'Mẹo ngủ đúng cách để da đẹp hơn mỗi sáng',
    excerpt: 'Ban đêm là lúc da tái tạo mạnh nhất. Ngủ đúng cách là "liệu trình" miễn phí mà ai cũng nên tận dụng.',
    products: ['neura-12', 'neura-10', 'drbargo-3'],
    content: `
      <p>Khi ngủ, cơ thể tăng tiết hormone tăng trưởng, tăng lưu thông máu tới da và đẩy nhanh quá trình sửa chữa tế bào. Đó là lý do <strong>ngủ đủ giấc đẹp da</strong> không chỉ là lời khuyên suông.</p>

      <h2>1. Ngủ trước 23h và đủ 7 – 8 tiếng</h2>
      <p>Thiếu ngủ làm tăng cortisol, gây viêm, nổi mụn và quầng thâm. Cố định giờ ngủ giúp da tái tạo ổn định.</p>

      <h2>2. Không bỏ skincare buổi tối</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-12.jpg', 'Mặt nạ kem nâng cơ Neuraderm Repair Lifting Cream Mask Pack dùng buổi tối')}
      <p>Làm sạch kỹ và dùng sản phẩm phục hồi, treatment buổi tối khi da hấp thụ tốt nhất. Xem <a href="#/blog/thu-tu-skincare-sang-toi">thứ tự skincare sáng tối</a>.</p>

      <h2>3. Thay vỏ gối thường xuyên</h2>
      <p>Vỏ gối tích tụ dầu, bụi và vi khuẩn. Thay 2 lần/tuần; vỏ gối lụa giúp giảm ma sát, hạn chế nếp hằn trên da và tóc.</p>

      <h2>4. Nằm ngửa nếu có thể</h2>
      <p>Nằm nghiêng hoặc úp mặt lâu ngày có thể tạo nếp nhăn do ép và làm sản phẩm dưỡng dính vào gối.</p>

      <h2>5. Hạn chế màn hình trước khi ngủ</h2>
      <p>Ánh sáng xanh làm giảm melatonin, khiến khó ngủ sâu. Tắt điện thoại 30 – 60 phút trước giờ ngủ.</p>

      <h2>6. Giữ phòng ngủ ẩm và mát</h2>
      <p>Phòng quá khô khiến da mất nước qua đêm. Dùng máy tạo ẩm hoặc đặt một chậu nước nhỏ trong phòng.</p>

      <h2>Kết luận</h2>
      <p>Giấc ngủ chất lượng kết hợp routine tối phù hợp là bí quyết cho làn da tươi tắn mỗi sáng. Hãy bắt đầu từ việc ngủ sớm hơn 30 phút mỗi ngày.</p>
    `,
    faq: [
      { q: 'Thức khuya có gây mụn không?', a: 'Có thể. Thiếu ngủ làm tăng cortisol và viêm, khiến da tiết dầu nhiều hơn và dễ nổi mụn.' },
      { q: 'Mặt nạ ngủ có cần rửa lại không?', a: 'Mặt nạ ngủ (sleeping mask) được thiết kế để để qua đêm, sáng hôm sau rửa mặt bình thường.' }
    ]
  },

  {
    slug: 'an-gi-de-da-dep-thuc-pham-tot-cho-da',
    keyword: 'thực phẩm tốt cho da',
    category: 'meo-lam-dep',
    date: '2026-10-30',
    readTime: 4,
    cover: '/assets/images/catalog/medipharm/stemc-2.jpg',
    seoTitle: 'Ăn gì để da đẹp? 8 thực phẩm tốt cho da',
    metaDescription: 'Danh sách 8 thực phẩm tốt cho da giàu vitamin C, omega-3, chất chống oxy hóa và những món nên hạn chế để da sáng mịn, ít mụn.',
    title: 'Ăn gì để da đẹp? 8 thực phẩm tốt cho da bạn nên biết',
    excerpt: 'Skincare chăm sóc từ bên ngoài, còn bữa ăn nuôi dưỡng da từ bên trong. Thêm những thực phẩm này vào thực đơn mỗi tuần.',
    products: ['stemc-2', 'stemc-6', 'neura-16'],
    content: `
      <p>Làn da phản ánh chế độ ăn uống. Bổ sung <strong>thực phẩm tốt cho da</strong> giúp cung cấp nguyên liệu để da tổng hợp collagen, chống oxy hóa và giữ ẩm.</p>

      <h2>8 thực phẩm nên ăn</h2>
      <ol>
        <li><strong>Cá hồi, cá thu:</strong> giàu omega-3 giúp giảm viêm, giữ ẩm.</li>
        <li><strong>Bơ:</strong> chất béo tốt và vitamin E bảo vệ da.</li>
        <li><strong>Cam, ổi, ớt chuông:</strong> vitamin C cần cho tổng hợp collagen.</li>
        <li><strong>Cà chua:</strong> lycopene hỗ trợ bảo vệ da trước tác hại ánh nắng.</li>
        <li><strong>Cà rốt, khoai lang:</strong> beta-carotene giúp da khỏe, đều màu.</li>
        <li><strong>Các loại hạt:</strong> hạnh nhân, óc chó giàu kẽm và vitamin E.</li>
        <li><strong>Trà xanh:</strong> polyphenol chống oxy hóa.</li>
        <li><strong>Sữa chua, kim chi:</strong> lợi khuẩn hỗ trợ cân bằng đường ruột — liên quan mật thiết đến làn da.</li>
      </ol>

      <h2>Những món nên hạn chế</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-2.jpg', 'Kem dưỡng cấp ẩm MediPharm TBG Stem C bổ trợ chế độ ăn lành mạnh')}
      <ul>
        <li>Đồ ngọt, nước có đường: gây glycation làm collagen cứng, giòn.</li>
        <li>Đồ chiên rán nhiều dầu: tăng viêm.</li>
        <li>Sữa bò với da dễ mụn: có thể khiến mụn nặng hơn ở một số người.</li>
        <li>Rượu bia: gây mất nước và giãn mao mạch.</li>
      </ul>

      <h2>Uống đủ nước</h2>
      <p>Khoảng 1,5 – 2 lít mỗi ngày tùy thể trạng và mức vận động. Nước giúp quá trình trao đổi chất diễn ra tốt hơn.</p>

      <h2>Kết luận</h2>
      <p>Không có thực phẩm "thần kỳ", nhưng chế độ ăn đa dạng, nhiều rau quả và chất béo tốt sẽ giúp skincare phát huy hiệu quả cao hơn.</p>
    `,
    faq: [
      { q: 'Ăn nhiều đồ ngọt có gây lão hóa da không?', a: 'Có. Đường dư thừa gây glycation, làm sợi collagen kém đàn hồi và đẩy nhanh nếp nhăn.' },
      { q: 'Bao lâu thì thấy da thay đổi khi ăn uống lành mạnh?', a: 'Thường sau 4 – 6 tuần, tương đương một chu kỳ thay mới của da.' }
    ]
  },

  {
    slug: 'meo-trang-diem-nhe-ma-khong-bi-bit-tac',
    keyword: 'trang điểm không bít tắc lỗ chân lông',
    category: 'meo-lam-dep',
    date: '2026-10-21',
    readTime: 4,
    cover: '/assets/images/catalog/medipharm/stemc-1.jpg',
    seoTitle: 'Mẹo trang điểm nhẹ mà không bị bít tắc lỗ chân lông',
    metaDescription: 'Mẹo trang điểm không bít tắc lỗ chân lông: chọn BB cream nhẹ, dưỡng ẩm đúng, vệ sinh cọ và tẩy trang kỹ giúp da đẹp tự nhiên, ít nổi mụn.',
    title: 'Mẹo trang điểm nhẹ mà không bị bít tắc lỗ chân lông',
    excerpt: 'Lớp nền mỏng, da vẫn thở và không nổi mụn sau một ngày dài — hoàn toàn làm được với vài thay đổi nhỏ.',
    products: ['stemc-1', 'stemc-3', 'stemc-5'],
    content: `
      <p>Trang điểm hằng ngày không đồng nghĩa với việc da phải chịu bít tắc. Những mẹo <strong>trang điểm không bít tắc lỗ chân lông</strong> sau giúp bạn giữ lớp nền tự nhiên mà da vẫn khỏe.</p>

      <h2>1. Dưỡng ẩm trước khi trang điểm</h2>
      <p>Da đủ ẩm giúp lớp nền bám mịn, cần ít sản phẩm hơn và không bị mốc. Chờ kem dưỡng thấm 3 – 5 phút.</p>

      <h2>2. Chọn kem nền mỏng nhẹ</h2>
      ${fig('/assets/images/catalog/medipharm/stemc-1.jpg', 'Kem nền dưỡng Stem C BB Cream cho lớp trang điểm nhẹ')}
      <p>BB cream hoặc cushion mỏng thay cho foundation dày. Ưu tiên sản phẩm có ghi "non-comedogenic" (không gây mụn).</p>

      <h2>3. Kem chống nắng là lớp lót</h2>
      <p>Chọn kem chống nắng kết cấu nhẹ làm lớp lót thay vì thêm primer silicon dày. Xem <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</p>

      <h2>4. Vệ sinh cọ và bông mút</h2>
      <p>Rửa bông mút 2 – 3 lần/tuần, cọ 1 lần/tuần. Dụng cụ bẩn là nơi vi khuẩn sinh sôi.</p>

      <h2>5. Chỉ che khuyết điểm tại chỗ</h2>
      <p>Dùng concealer cho vùng thâm, mụn thay vì phủ dày toàn mặt.</p>

      <h2>6. Tẩy trang kỹ mỗi tối</h2>
      <p>Đây là bước quan trọng nhất. Xem <a href="#/blog/cach-tay-trang-dung-cach">cách tẩy trang đúng cách</a>.</p>

      <h2>Kết luận</h2>
      <p>Lớp nền nhẹ, dụng cụ sạch và tẩy trang kỹ là bộ ba giúp bạn trang điểm mỗi ngày mà không lo mụn ẩn. Hãy cho da "nghỉ" trang điểm 1 – 2 ngày mỗi tuần nếu có thể.</p>
    `,
    faq: [
      { q: 'Da mụn có nên trang điểm không?', a: 'Có thể trang điểm nhẹ với sản phẩm không gây bít tắc, nhưng cần tẩy trang thật kỹ và tránh lớp nền dày.' },
      { q: 'BB cream có thay được kem chống nắng không?', a: 'Không nên. Lượng BB cream thường dùng không đủ để đạt chỉ số SPF ghi trên bao bì; hãy thoa kem chống nắng riêng.' }
    ]
  },

  {
    slug: 'cham-soc-vung-mat-moi-ngay',
    keyword: 'chăm sóc vùng mắt',
    category: 'meo-lam-dep',
    date: '2026-10-14',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-17.jpg',
    seoTitle: 'Chăm sóc vùng mắt mỗi ngày: giảm thâm, bọng và nếp nhăn',
    metaDescription: 'Mẹo chăm sóc vùng mắt mỗi ngày giúp giảm quầng thâm, bọng mắt và nếp nhăn: thoa kem mắt đúng cách, chống nắng, ngủ đủ và massage nhẹ.',
    title: 'Chăm sóc vùng mắt mỗi ngày: giảm thâm, bọng và nếp nhăn',
    excerpt: 'Da vùng mắt mỏng hơn các vùng khác tới 4 lần, nên cũng là nơi lộ dấu hiệu mệt mỏi và lão hóa sớm nhất.',
    products: ['neura-17', 'neura-3', 'neura-5'],
    content: `
      <p>Vùng da quanh mắt mỏng, ít tuyến dầu và chuyển động liên tục khi chớp mắt, cười. <strong>Chăm sóc vùng mắt</strong> đều đặn giúp hạn chế quầng thâm, bọng mắt và nếp nhăn vết chân chim.</p>

      <h2>1. Thoa kem mắt bằng ngón áp út</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-17.jpg', 'Sáp dưỡng bảo vệ Neuraderm Protective Facial Balm cho vùng da khô mỏng')}
      <p>Lấy lượng bằng hạt gạo cho mỗi mắt, chấm quanh xương hốc mắt và vỗ nhẹ từ trong ra ngoài. Ngón áp út có lực nhẹ nhất, tránh kéo giãn da.</p>

      <h2>2. Chống nắng cả vùng mắt</h2>
      <p>Thoa kem chống nắng nhẹ nhàng tới sát vùng mắt và đeo kính râm khi ra ngoài để giảm nheo mắt.</p>

      <h2>3. Giảm bọng mắt buổi sáng</h2>
      <ul>
        <li>Chườm thìa lạnh hoặc túi trà xanh đã làm lạnh 5 phút.</li>
        <li>Kê gối cao hơn một chút khi ngủ.</li>
        <li>Hạn chế ăn mặn vào buổi tối.</li>
      </ul>

      <h2>4. Massage nhẹ thúc đẩy lưu thông</h2>
      <p>Dùng đầu ngón tay ấn nhẹ theo đường từ góc trong mắt ra thái dương, 5 – 10 lần mỗi tối.</p>

      <h2>5. Tẩy trang mắt nhẹ nhàng</h2>
      <p>Áp bông tẩy trang 10 giây cho mascara tan, rồi lau nhẹ một chiều. Không chà xát mạnh.</p>

      <h2>6. Ngủ đủ và giảm thời gian nhìn màn hình</h2>
      <p>Áp dụng quy tắc 20-20-20: cứ 20 phút nhìn màn hình, nhìn xa 20 feet (khoảng 6m) trong 20 giây. Xem thêm <a href="#/blog/meo-ngu-dung-cach-de-da-dep-hon">mẹo ngủ đúng cách để da đẹp hơn</a>.</p>

      <h2>Kết luận</h2>
      <p>Chăm sóc vùng mắt không cần quá cầu kỳ — nhẹ tay, đều đặn và chống nắng là đủ để đôi mắt trông tươi tắn, trẻ trung hơn.</p>
    `,
    faq: [
      { q: 'Có thể dùng kem dưỡng mặt cho vùng mắt không?', a: 'Có thể nếu kem không chứa hương liệu và hoạt chất mạnh. Kem mắt chuyên dụng thường dịu nhẹ và có kết cấu phù hợp hơn.' },
      { q: 'Quầng thâm do di truyền có cải thiện được không?', a: 'Có thể giảm nhẹ bằng chăm sóc và che khuyết điểm, nhưng khó xóa hoàn toàn; nên tham khảo bác sĩ da liễu nếu muốn điều trị.' }
    ]
  },

  /* ---------------- Xu hướng làm đẹp ---------------- */
  {
    slug: 'xu-huong-skin-cycling-luan-phien-skincare',
    keyword: 'skin cycling',
    category: 'xu-huong',
    date: '2026-11-08',
    readTime: 5,
    cover: '/assets/images/catalog/neuraderm/neura-9.jpg',
    seoTitle: 'Skin cycling là gì? Xu hướng luân phiên skincare 4 đêm',
    metaDescription: 'Skin cycling là xu hướng luân phiên skincare theo chu kỳ 4 đêm: tẩy tế bào chết, retinoid và 2 đêm phục hồi. Cách áp dụng cho người mới.',
    title: 'Skin cycling: xu hướng luân phiên skincare 4 đêm cho da khỏe',
    excerpt: 'Thay vì dồn mọi hoạt chất vào một tối, skin cycling chia routine thành chu kỳ 4 đêm để da vừa được treatment vừa có thời gian nghỉ.',
    products: ['neura-9', 'drbargo-3', 'neura-16'],
    content: `
      <p><strong>Skin cycling</strong> là phương pháp luân phiên sản phẩm theo chu kỳ, phổ biến nhất là 4 đêm. Mục tiêu là tận dụng hoạt chất mạnh nhưng vẫn cho hàng rào da thời gian phục hồi, giảm kích ứng.</p>

      <h2>Chu kỳ 4 đêm cơ bản</h2>
      <ol>
        <li><strong>Đêm 1 – Tẩy tế bào chết:</strong> AHA/BHA giúp làm sạch lỗ chân lông, da sáng mịn.</li>
        <li><strong>Đêm 2 – Retinoid:</strong> retinol hoặc retinal kích thích tái tạo, chống lão hóa.</li>
        <li><strong>Đêm 3 – Phục hồi:</strong> chỉ dùng sản phẩm cấp ẩm, Ceramide, Panthenol.</li>
        <li><strong>Đêm 4 – Phục hồi:</strong> tiếp tục nuôi dưỡng, làm dịu.</li>
      </ol>
      <p>Sau đó lặp lại từ đêm 1.</p>

      <h2>Vì sao skin cycling được yêu thích?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-9.jpg', 'Tinh chất Neuraderm Coretime Synergy Essence dùng trong đêm phục hồi')}
      <ul>
        <li>Đơn giản, dễ nhớ, không cần nhiều sản phẩm.</li>
        <li>Giảm nguy cơ dùng chồng hoạt chất gây kích ứng.</li>
        <li>Phù hợp người mới bắt đầu treatment.</li>
      </ul>

      <h2>Cách điều chỉnh theo loại da</h2>
      <ul>
        <li><strong>Da nhạy cảm:</strong> kéo dài thành chu kỳ 5 – 6 đêm với 3 – 4 đêm phục hồi.</li>
        <li><strong>Da dầu mụn:</strong> có thể dùng BHA thay AHA ở đêm 1.</li>
        <li><strong>Da đã quen retinol:</strong> có thể rút ngắn số đêm phục hồi.</li>
      </ul>

      <h2>Ban ngày thì sao?</h2>
      <p>Buổi sáng giữ routine đơn giản: làm sạch, dưỡng ẩm và <a href="#/blog/cach-dung-kem-chong-nang-dung">kem chống nắng</a> — bắt buộc khi dùng AHA và retinoid.</p>

      <h2>Kết luận</h2>
      <p>Skin cycling là cách thông minh để cân bằng giữa treatment và phục hồi. Các sản phẩm chứa Ceramide, lợi khuẩn như <a href="#/thuong-hieu/dr-bargo">Dr.BARGO 31°C</a> rất hợp cho các đêm phục hồi. Xem thêm <a href="#/blog/ceramide-ket-hop-panthenol-b5-phuc-hoi-da-treatment">Ceramide kết hợp Panthenol B5</a>.</p>
    `,
    faq: [
      { q: 'Người mới có nên skin cycling không?', a: 'Có. Đây là cách an toàn để làm quen với AHA/BHA và retinol vì da có nhiều đêm nghỉ phục hồi.' },
      { q: 'Bao lâu thấy hiệu quả skin cycling?', a: 'Thường sau 4 – 8 tuần da sẽ sáng mịn và đều màu hơn, ít kích ứng hơn so với dùng hoạt chất mỗi tối.' }
    ]
  },

  {
    slug: 'xu-huong-skincare-cho-da-dau-scalp-care',
    keyword: 'chăm sóc da đầu scalp care',
    category: 'xu-huong',
    date: '2026-11-03',
    readTime: 4,
    cover: '/assets/images/catalog/smib/smib-7.jpg',
    seoTitle: 'Scalp care: xu hướng "skincare cho da đầu" lên ngôi',
    metaDescription: 'Scalp care – chăm sóc da đầu như chăm sóc da mặt – đang là xu hướng. Lợi ích, các bước scalp care cơ bản và cách chọn sản phẩm phù hợp.',
    title: 'Scalp care: khi da đầu cũng cần một routine skincare',
    excerpt: 'Tóc khỏe bắt đầu từ da đầu khỏe. Đó là lý do "skincare cho da đầu" trở thành một trong những xu hướng làm đẹp nổi bật nhất.',
    products: ['smib-7', 'smib-5', 'smib-3'],
    content: `
      <p>Da đầu cũng là da — thậm chí có nhiều tuyến bã nhờn và nang lông hơn da mặt. Xu hướng <strong>chăm sóc da đầu scalp care</strong> áp dụng tư duy skincare: làm sạch, tẩy tế bào chết, cân bằng và dưỡng.</p>

      <h2>Vì sao scalp care thành xu hướng?</h2>
      <ul>
        <li>Rụng tóc, gàu, ngứa da đầu ngày càng phổ biến do căng thẳng, ô nhiễm.</li>
        <li>Người dùng hiểu rằng tóc mọc từ nang tóc dưới da đầu.</li>
        <li>Nhiều thành phần skincare (lợi khuẩn, peptide, niacinamide) được ứng dụng cho da đầu.</li>
      </ul>

      <h2>Routine scalp care cơ bản</h2>
      ${fig('/assets/images/catalog/smib/smib-7.jpg', 'Tinh chất da đầu SMIB innaBi Scalp Essence mang lại cảm giác sảng khoái')}
      <ol>
        <li><strong>Làm sạch:</strong> dầu gội phù hợp tình trạng da đầu, massage bằng đầu ngón tay.</li>
        <li><strong>Tẩy tế bào chết da đầu:</strong> 1 lần/tuần để loại bỏ bã nhờn, gàu tích tụ.</li>
        <li><strong>Serum / tinh chất da đầu:</strong> thoa trực tiếp lên chân tóc khi tóc khô hoặc hơi ẩm.</li>
        <li><strong>Massage:</strong> 3 – 5 phút giúp tăng tuần hoàn máu nuôi nang tóc.</li>
        <li><strong>Bảo vệ:</strong> đội mũ khi ra nắng, hạn chế sấy nhiệt cao sát da đầu.</li>
      </ol>

      <h2>Thành phần nổi bật trong xu hướng scalp care</h2>
      <ul>
        <li>Lợi khuẩn (probiotics, postbiotics) cân bằng hệ vi sinh da đầu.</li>
        <li>Biotin, Caffeine hỗ trợ giảm rụng.</li>
        <li>Menthol, tràm trà làm sạch, sảng khoái.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Đầu tư cho da đầu là đầu tư cho mái tóc lâu dài. Bắt đầu với dầu gội phù hợp và một tinh chất da đầu như dòng <a href="#/thuong-hieu/smib">SMIB innaBi</a>. Xem thêm <a href="#/blog/goi-dau-dung-cach-da-dau-dau-gau-rung-toc">gội đầu đúng cách</a>.</p>
    `,
    faq: [
      { q: 'Tẩy tế bào chết da đầu bao lâu một lần?', a: 'Khoảng 1 lần/tuần với da đầu dầu, 2 tuần/lần với da đầu khô hoặc nhạy cảm.' },
      { q: 'Serum da đầu có làm tóc bết không?', a: 'Đa số serum da đầu có kết cấu lỏng nhẹ, thấm nhanh; chỉ thoa lên chân tóc, tránh thân tóc để không bết.' }
    ]
  },

  {
    slug: 'xu-huong-mat-na-sinh-hoc-bio-cellulose',
    keyword: 'mặt nạ sinh học bio cellulose',
    category: 'xu-huong',
    date: '2026-10-27',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-11.jpg',
    seoTitle: 'Mặt nạ sinh học Bio Cellulose: xu hướng spa tại nhà',
    metaDescription: 'Mặt nạ sinh học Bio Cellulose ôm sát da, giữ dưỡng chất tốt hơn mặt nạ giấy. Tìm hiểu ưu điểm, cách dùng và ai nên dùng mặt nạ sinh học.',
    title: 'Mặt nạ sinh học Bio Cellulose: xu hướng "spa tại nhà"',
    excerpt: 'Mỏng như lớp da thứ hai, ôm khít từng đường nét — mặt nạ sinh học đang thay thế dần mặt nạ giấy trong routine chăm sóc chuyên sâu.',
    products: ['neura-11', 'neura-4', 'neura-15'],
    content: `
      <p><strong>Mặt nạ sinh học Bio Cellulose</strong> được tạo từ sợi cellulose do vi khuẩn lên men (thường từ nước dừa), có cấu trúc siêu mịn giống "lớp da thứ hai". Đây là xu hướng mang trải nghiệm spa về nhà với chi phí hợp lý.</p>

      <h2>Bio Cellulose khác mặt nạ giấy thế nào?</h2>
      <ul>
        <li><strong>Ôm sát hơn:</strong> sợi siêu nhỏ bám khít từng đường nét khuôn mặt.</li>
        <li><strong>Giữ dưỡng chất tốt hơn:</strong> khả năng giữ nước gấp nhiều lần trọng lượng, hạn chế bay hơi.</li>
        <li><strong>Dịu nhẹ:</strong> phù hợp da nhạy cảm, da sau treatment.</li>
        <li><strong>Mát lạnh:</strong> giảm cảm giác nóng rát tức thì.</li>
      </ul>

      <h2>Ai nên dùng mặt nạ sinh học?</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-11.jpg', 'Mặt nạ chống lão hóa Neuraderm Age Defence Bio Mask Pack')}
      <ul>
        <li>Da khô, thiếu nước cần cấp ẩm sâu.</li>
        <li>Da vừa laser, peel cần làm dịu. Xem <a href="#/blog/cham-soc-da-sau-laser-peel">chăm sóc da sau laser, peel</a>.</li>
        <li>Người cần da căng bóng nhanh trước sự kiện.</li>
      </ul>

      <h2>Cách dùng hiệu quả</h2>
      <ol>
        <li>Làm sạch và thoa toner.</li>
        <li>Tách lớp lót cẩn thận, đắp mặt nạ và vuốt nhẹ cho bám sát.</li>
        <li>Giữ 20 – 30 phút, không để mặt nạ khô.</li>
        <li>Gỡ ra, vỗ nhẹ phần tinh chất còn lại và khóa bằng kem dưỡng.</li>
      </ol>

      <h2>Kết luận</h2>
      <p>Mặt nạ sinh học là bước chăm sóc chuyên sâu 1 – 2 lần/tuần đáng đầu tư. Kết hợp với routine hằng ngày, da sẽ ẩm mượt và khỏe hơn. Xem thêm <a href="#/blog/dap-mat-na-giay-bao-nhieu-lan-mot-tuan">đắp mặt nạ bao nhiêu lần một tuần</a>.</p>
    `,
    faq: [
      { q: 'Mặt nạ sinh học có dùng lại được không?', a: 'Không. Mặt nạ sinh học là loại dùng một lần để đảm bảo vệ sinh và hiệu quả.' },
      { q: 'Có nên để mặt nạ trong tủ lạnh?', a: 'Có thể làm mát 15 – 30 phút trước khi đắp để tăng cảm giác dịu, nhưng không để ngăn đá.' }
    ]
  },

  {
    slug: 'xu-huong-chong-nang-the-he-moi',
    keyword: 'kem chống nắng thế hệ mới',
    category: 'xu-huong',
    date: '2026-10-19',
    readTime: 4,
    cover: '/assets/images/catalog/neuraderm/neura-5.jpg',
    seoTitle: 'Kem chống nắng thế hệ mới: mỏng nhẹ, dưỡng da',
    metaDescription: 'Xu hướng kem chống nắng thế hệ mới: màng lọc phổ rộng, kết cấu mỏng nhẹ, kết hợp dưỡng da và chống ánh sáng xanh. Cách chọn phù hợp loại da.',
    title: 'Kem chống nắng thế hệ mới: không chỉ chống nắng mà còn dưỡng da',
    excerpt: 'Không còn bết dính hay vệt trắng, kem chống nắng thế hệ mới mỏng như serum và bổ sung thêm cả thành phần dưỡng da.',
    products: ['neura-5', 'stemc-3', 'stemc-1'],
    content: `
      <p>Kem chống nắng là bước chống lão hóa quan trọng nhất. Xu hướng <strong>kem chống nắng thế hệ mới</strong> giải quyết những điểm trừ cũ: nặng mặt, vệt trắng, cay mắt — đồng thời bổ sung dưỡng chất.</p>

      <h2>Đặc điểm của kem chống nắng thế hệ mới</h2>
      <ul>
        <li><strong>Phổ rộng:</strong> bảo vệ cả UVA (lão hóa) và UVB (cháy nắng), nhiều sản phẩm có thêm bảo vệ ánh sáng xanh.</li>
        <li><strong>Kết cấu mỏng nhẹ:</strong> dạng essence, gel, fluid thấm nhanh.</li>
        <li><strong>"Skincare hóa":</strong> thêm Niacinamide, Ceramide, Panthenol, chiết xuất làm dịu.</li>
        <li><strong>Không vệt trắng:</strong> màng lọc vật lý dạng hạt siêu mịn hoặc màng lọc hóa học thế hệ mới.</li>
      </ul>

      <h2>Chọn kem chống nắng theo loại da</h2>
      ${fig('/assets/images/catalog/neuraderm/neura-5.jpg', 'Kem chống nắng phổ rộng Neuraderm Intensive Suncream')}
      <ul>
        <li><strong>Da dầu:</strong> gel hoặc fluid kiềm dầu.</li>
        <li><strong>Da khô:</strong> dạng cream có thành phần dưỡng ẩm.</li>
        <li><strong>Da nhạy cảm:</strong> ưu tiên màng lọc vật lý, không hương liệu.</li>
        <li><strong>Da cần che phủ nhẹ:</strong> kem chống nắng có màu (tinted).</li>
      </ul>

      <h2>Dùng đúng mới hiệu quả</h2>
      <p>Thoa đủ lượng (khoảng 2 ngón tay cho mặt và cổ), trước khi ra ngoài 15 phút và thoa lại sau mỗi 2 – 3 giờ khi ở ngoài trời. Xem chi tiết <a href="#/blog/cach-dung-kem-chong-nang-dung">cách dùng kem chống nắng đúng</a>.</p>

      <h2>Kết luận</h2>
      <p>Kem chống nắng thế hệ mới giúp việc chống nắng mỗi ngày dễ dàng và dễ chịu hơn. Một sản phẩm phù hợp là sản phẩm bạn muốn thoa mỗi sáng — đó mới là chìa khóa.</p>
    `,
    faq: [
      { q: 'Ở trong nhà có cần kem chống nắng không?', a: 'Nên dùng, vì tia UVA có thể xuyên qua cửa kính và gây lão hóa da theo thời gian.' },
      { q: 'SPF bao nhiêu là đủ dùng hằng ngày?', a: 'SPF 30 – 50 kèm PA+++ trở lên là phù hợp cho hầu hết hoạt động hằng ngày tại Việt Nam.' }
    ]
  },

  {
    slug: 'xu-huong-glass-skin-da-cang-bong',
    keyword: 'glass skin',
    category: 'xu-huong',
    date: '2026-10-12',
    readTime: 4,
    cover: '/assets/images/catalog/dr-bargo/drbargo-1-g1.jpg',
    seoTitle: 'Glass skin là gì? Cách có làn da căng bóng như kính',
    metaDescription: 'Glass skin – làn da căng bóng, trong suốt như kính – là xu hướng làm đẹp Hàn Quốc. Bí quyết cấp ẩm nhiều lớp, phục hồi và chống nắng để đạt glass skin.',
    title: 'Glass skin: bí quyết làn da căng bóng như kính kiểu Hàn',
    excerpt: 'Glass skin không phải lớp highlight bóng loáng, mà là làn da đủ ẩm, khỏe từ bên trong và phản chiếu ánh sáng tự nhiên.',
    products: ['drbargo-1', 'drbargo-4', 'neura-8'],
    content: `
      <p><strong>Glass skin</strong> là khái niệm làm đẹp xuất phát từ Hàn Quốc, chỉ làn da mịn màng, đều màu, căng mọng và trong như kính. Đây là kết quả của việc cấp ẩm đủ và hàng rào da khỏe, không phải lớp trang điểm.</p>

      <h2>Các bước tiến tới glass skin</h2>
      <h3>1. Làm sạch dịu nhẹ</h3>
      <p>Làm sạch kép buổi tối với sữa rửa mặt pH thấp để không làm mất độ ẩm tự nhiên.</p>
      <h3>2. Tẩy tế bào chết đều đặn</h3>
      <p>AHA/PHA nhẹ 1 – 2 lần/tuần giúp bề mặt da mịn, phản chiếu ánh sáng tốt hơn.</p>
      <h3>3. Cấp ẩm nhiều lớp</h3>
      ${fig('/assets/images/catalog/dr-bargo/drbargo-1-g1.jpg', 'Sữa dưỡng Dr.BARGO Emulsion cân bằng màng ẩm cho làn da căng bóng')}
      <p>Kỹ thuật "7 skin method" — thoa toner nhiều lớp mỏng — là bí quyết nổi tiếng. Sau đó dùng essence, serum cấp ẩm và emulsion để khóa lại.</p>
      <h3>4. Phục hồi hàng rào da</h3>
      <p>Da khỏe mới giữ được nước. Ceramide, Panthenol, lợi khuẩn giúp da ổn định. Xem <a href="#/blog/xu-huong-phuc-hoi-da-da-tang-cong-nghe-liposome">xu hướng phục hồi da đa tầng</a>.</p>
      <h3>5. Chống nắng mỗi ngày</h3>
      <p>Đốm nâu và sạm màu là "kẻ thù" của glass skin.</p>

      <h2>Hiểu đúng về glass skin</h2>
      <ul>
        <li>Không có nghĩa là da không có lỗ chân lông — đó là điều không thể.</li>
        <li>Không cần dùng 10 bước nếu da bạn không cần; tối giản vẫn đạt được.</li>
        <li>Lối sống (ngủ, ăn, nước) đóng vai trò quan trọng ngang skincare.</li>
      </ul>

      <h2>Kết luận</h2>
      <p>Glass skin là đích đến của làn da đủ ẩm và khỏe mạnh. Kiên trì cấp ẩm, phục hồi và chống nắng, bạn sẽ thấy da căng bóng tự nhiên sau vài tuần. Dòng <a href="#/thuong-hieu/dr-bargo">Dr.BARGO 31°C</a> với toner và emulsion cân bằng là lựa chọn phù hợp cho kỹ thuật cấp ẩm nhiều lớp.</p>
    `,
    faq: [
      { q: 'Da dầu có đạt được glass skin không?', a: 'Có. Da dầu cần tập trung cấp nước nhẹ và kiểm soát dầu, tránh kem quá đặc; độ căng bóng sẽ đến từ độ ẩm chứ không phải dầu.' },
      { q: '7 skin method có làm bí da không?', a: 'Nếu dùng toner không cồn, kết cấu lỏng nhẹ và mỗi lớp thấm trước khi thoa lớp tiếp theo thì hiếm khi gây bí da.' }
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
