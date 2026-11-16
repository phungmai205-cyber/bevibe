# Phân hệ Admin beVIBE — cài đặt và sử dụng

Trang quản trị: **`https://bevibe.vn/admin.html`** (khi chạy thử trên máy: `http://localhost:3000/admin.html`).

Admin giúp theo dõi mọi đơn đặt trên website và quản lý khách hàng, chi phí, báo cáo doanh thu cùng phễu khách hàng.

- **Nguồn đơn:** khách lẻ, khách sỉ (Spa, Clinic, Đại lý) và tư vấn viên.
- **Hình thức thanh toán:** *Thanh toán ngay (chuyển khoản)* hoặc *Thanh toán khi nhận hàng (COD)*.
- **Nơi lưu dữ liệu:** chính Google Sheet nhận đơn hàng (xem `HUONG-DAN-NHAN-DON.md`). Không cần máy chủ, không tốn phí.

> Muốn xem giao diện trước khi cài: mở `admin.html` → bấm **Xem thử với dữ liệu mẫu**. Dữ liệu mẫu không ghi gì vào Sheet.

---

## Cài đặt (làm một lần, khoảng 5 phút)

### Bước 1 — Cập nhật mã Apps Script

1. Mở Google Sheet **beVIBE – Đơn hàng website** → **Tiện ích mở rộng → Apps Script**.
   Đây phải là dự án Apps Script có URL đang nằm trong `assets/js/order-config.js` (`ORDER_ENDPOINT`).
2. Xóa toàn bộ nội dung `Code.gs`, dán **toàn bộ** file `google-apps-script/Code.gs` mới của dự án → **Lưu**.
3. Chọn hàm **`setup`** → **Chạy**.

`setup` thêm cột mới vào sheet **Đơn hàng** và tạo các sheet **Khách tiềm năng**, **Chi phí**, **Giá vốn**. Dữ liệu cũ được giữ nguyên.

Các cột mới trong sheet Đơn hàng:
- Loại khách
- Cơ sở / Mã TVV
- Trạng thái thanh toán
- Phí vận chuyển
- Giảm giá
- Ghi chú nội bộ
- Mã yêu cầu
- Cập nhật lúc

### Bước 2 — Đặt mật khẩu admin

1. Tải lại (F5) Google Sheet nhận đơn. Trên thanh menu xuất hiện mục **beVIBE Admin**.
2. **beVIBE Admin → Đặt / đổi mật khẩu admin**. Lần đầu Google sẽ hỏi quyền, bấm **Cho phép**.
3. Nhập mật khẩu (ít nhất 8 ký tự, ví dụ mật khẩu bạn đã chọn), nhập lại lần nữa → **OK**.

**Đổi mật khẩu về sau:**
- **Trong trang admin:** nút **Đổi mật khẩu** ở thanh bên, cần nhập mật khẩu hiện tại.
- **Quên mật khẩu:** dùng lại menu ở bước 2. Ai có quyền sửa Sheet đều đặt lại được.

**Cách lưu:** mật khẩu chỉ được lưu dạng mã hóa trong Apps Script, không nằm trong code website hay GitHub. Mỗi lần đổi mật khẩu, mọi máy đang đăng nhập sẽ bị đăng xuất.

### Bước 3 — Triển khai phiên bản mới

1. **Triển khai → Quản lý các bản triển khai** → biểu tượng ✏️ → **Phiên bản: Phiên bản mới** → **Triển khai**.
2. Giữ nguyên **Thực thi với tư cách: Tôi** và **Người có quyền truy cập: Bất kỳ ai**.
3. URL không đổi nên không cần sửa website.
4. Kiểm tra: mở URL `/exec` trên trình duyệt. Thấy `"version":2` là đúng.

### Bước 4 — Đăng website

Chạy `npm run build`, rồi đưa thư mục `dist/` lên hosting như thường lệ. `dist/` giờ có thêm file `admin.html`.

---

## Sử dụng hằng ngày

Mỗi đơn chỉ nằm ở **một** mục, tùy trạng thái:

| Trạng thái | Nghĩa là | Đơn nằm ở mục |
|---|---|---|
| Mới | Khách vừa đặt trên web, chưa ai liên hệ | **Đơn hàng** |
| Đã xác nhận | Đã gọi / nhắn Zalo chốt với khách, chuẩn bị đóng gói | **Đơn hàng** |
| Đang giao | Đã gửi cho đơn vị vận chuyển | **Đơn hàng** |
| Hoàn tất | Khách đã nhận hàng | **Khách hàng** |
| Đã hủy | Dừng trước khi giao (khách đổi ý, không liên lạc được, đặt trùng, hết hàng…) | **Hủy & hoàn hàng** |
| Hoàn hàng | Đã giao đến nơi nhưng khách không nhận | **Hủy & hoàn hàng** |

Chuyển đơn sang *Đã hủy* hoặc *Hoàn hàng* bắt buộc chọn **lý do**.

| Mục | Dùng để |
|---|---|
| **Đơn hàng** | Đơn đang xử lý, chia tab Khách lẻ / Khách sỉ / Tư vấn viên. Bấm một đơn để xác nhận → đang giao → hoàn tất, hoặc **Hủy đơn** / **Khách không nhận (hoàn hàng)**. Trong đơn còn đánh dấu được đã thanh toán, nhập phí vận chuyển, giảm giá, ghi chú nội bộ. |
| **Khách hàng** | **Danh sách khách hàng:** mỗi lần mua thành công một dòng (khách nào, mua sản phẩm gì, ngày nào, bao nhiêu tiền, đã thu chưa). **Khách hàng trung thành:** khách mua thành công từ 2 lần trở lên, gộp mỗi người một dòng: số lần mua, tổng chi tiêu, sản phẩm hay mua, lần đầu / gần nhất. |
| **Hủy & hoàn hàng** | Đơn hủy và đơn hoàn, kèm lý do, giá trị đơn mất, tỷ lệ hủy / hoàn. Thống kê lý do. Danh sách **khách cần lưu ý** (từng hoàn hàng và đã hủy / hoàn từ 2 đơn) để gọi xác nhận kỹ trước khi giao đơn sau. |
| **Khách tiềm năng** | Người chỉ để lại thông tin, từ hai nguồn. **Tự động từ website:** form hợp tác / báo giá sỉ, nút Zalo/Email, đăng ký tài khoản. **Nhập tay:** nút **+ Thêm khách tiềm năng** cho khách gọi điện, nhắn Zalo / Facebook / TikTok, được giới thiệu, gặp ở sự kiện… Nếu số điện thoại hoặc email đã có trong hệ thống, admin cảnh báo trước khi lưu. Lọc theo nguồn (website / nhập tay). Đổi trạng thái ngay trên bảng: *Mới → Đã liên hệ → Tiềm năng → Đã mua / Không phù hợp*. **Luồng tư vấn qua Zalo:**
1. Khách nhắn Zalo: tư vấn viên bấm **+ Thêm khách tiềm năng** (nguồn Zalo) và ghi **Người tư vấn**.
2. Chốt được trên Zalo: tích ô **Chuyển đổi**. Khách chuyển sang trạng thái *Chờ đặt đơn* (ghi ngày chốt). Tư vấn viên hướng dẫn khách đặt trên website và nhắc khách dùng đúng số điện thoại đã cho.
3. Khách đặt đơn trên web: hệ thống tự nhận ra. Đơn vào mục Đơn hàng, ghi rõ khách đến từ Zalo và ai tư vấn; khách rời khỏi Khách tiềm năng.

Mục này chỉ gồm người **chưa mua**. Khi khách tiềm năng đặt đơn trên website với cùng số điện thoại hoặc email, hệ thống tự đổi trạng thái sang *Đã mua* và ghi mã đơn vào ghi chú nội bộ. Khách rời khỏi mục này, đơn của họ được xử lý ở mục **Đơn hàng**. Khách đã mua mà gửi form trên web lần nữa sẽ hiện ở khung **"Yêu cầu mới từ khách đã mua"** đầu mục Đơn hàng. |
| **Chi phí & giá vốn** | Quản lý **thương hiệu, sản phẩm và giá** trên một màn hình. Thương hiệu hiện thành các tab (Tất cả · Dr. Bargo · NEURADERM · … kèm số sản phẩm). Nút **+ Thêm thương hiệu** tạo thương hiệu mới (hiện trong menu Thương hiệu của web). Nút **+ Thêm sản phẩm** tạo sản phẩm mới (tên, thương hiệu, dòng, danh mục, ảnh tải lên hoặc dán link, mô tả, công dụng, thành phần, cách dùng, giá). Sản phẩm thêm từ admin có nút **Sửa** và **Ẩn / Hiện**. **Bảng giá** cho mọi sản phẩm trên web. Sửa trực tiếp: quy cách, **giá bán**, **giá vốn**, **giá khuyến mãi** (kèm từ ngày – đến ngày), **trạng thái** *Đang bán / Hết hàng / Ngừng bán*. Bấm **Lưu bảng giá** để lưu. Cột "Website đang hiện" cho xem trước giá khách sẽ thấy. Bên dưới là danh sách chi phí vận hành trong kỳ (nhập ở sheet "Chi phí"). |

**Bảng giá áp dụng thế nào:**
- **Trên website:** khi khách tải trang, giá mới được cập nhật.
  - Sản phẩm khuyến mãi hiện giá gạch ngang và % giảm.
  - Sản phẩm *Hết hàng / Ngừng bán* hiện nhãn và không thêm vào giỏ được.
  - Để trống giá bán thì sản phẩm hiện "Liên hệ".
- **Khi tính tiền đơn:** máy chủ tính theo bảng giá (gồm giá khuyến mãi còn hạn) và từ chối đơn có sản phẩm hết hàng / ngừng bán.
- **Bảo mật:** giá vốn **không** được gửi ra website.
| **Báo cáo** | Doanh thu, lợi nhuận, chi phí, số đơn, khách mua, khách tiềm năng; phễu khách hàng; biểu đồ doanh thu theo ngày/tháng; doanh thu theo loại khách và theo hình thức thanh toán; sản phẩm bán chạy; tỉnh/thành; bảng kết quả kinh doanh. |

Mọi mục đều có ô chọn khoảng thời gian (Từ ngày – Đến ngày) ở góc phải và nút **Xuất CSV**.

Mọi thay đổi trong admin được ghi thẳng vào Google Sheet. Ngược lại, sửa trực tiếp trên Sheet thì bấm **Tải lại** trong admin để thấy dữ liệu mới.

### Cách tính trong báo cáo

- **Doanh thu** = tổng (tạm tính − giảm giá) của các đơn **Hoàn tất** trong kỳ. Đơn đang xử lý hiện riêng ở dòng "+ … đang xử lý". Phí vận chuyển không tính vào doanh thu.
- **Giá vốn hàng bán** = số lượng × giá vốn của từng sản phẩm trong các đơn hoàn tất. Sản phẩm chưa nhập giá vốn được tính bằng 0, báo cáo sẽ cảnh báo.
- **Lợi nhuận** = Doanh thu − Giá vốn − Chi phí vận hành (các khoản nhập ở mục Chi phí).
- **Đã thu tiền** = tổng tiền khách cần trả của các đơn có trạng thái thanh toán *Đã thanh toán*. Khi chuyển một đơn COD sang *Hoàn tất*, admin tự đánh dấu *Đã thanh toán*.
- **Phễu khách hàng.** Mỗi khách là một số điện thoại, hoặc email nếu không có số. Mỗi bậc đếm số khách **đã từng đạt** bậc đó:
  - **B1 Lead / liên hệ:** để lại thông tin hoặc đặt đơn.
  - **B2 Đặt đơn:** có ít nhất 1 đơn.
  - **B3 Đã xác nhận:** có đơn đã xác nhận hoặc đang giao.
  - **B4 Hoàn tất:** có đơn hoàn tất.
  - **B5 Mua lại:** từ 2 đơn hoàn tất.

  Bấm một bậc để xem bao nhiêu khách đang dừng ở đó và danh sách khách. **Rời phễu** = khách mà mọi đơn đều bị hủy, hoặc lead bị đánh dấu *Không phù hợp*.

---

## Lưu ý

- **Đơn cũ:** đơn đặt trước khi cập nhật không có loại khách, nên được tính là *Khách lẻ*. Đơn cũ đã *Hoàn tất* được coi là *Đã thanh toán*.
- **Đơn trùng:** mỗi lần đặt hàng có một *Mã yêu cầu*. Nếu trình duyệt gửi lại cùng một đơn (mạng chậm, bấm gửi Zalo/Email sau đó…), hệ thống chỉ ghi **một** đơn.
- **Bảo mật:**
  - Không chia sẻ mật khẩu admin qua kênh công khai.
  - Sai mật khẩu 10 lần liên tiếp sẽ khóa đăng nhập 15 phút.
  - Trang `admin.html` có thẻ `noindex` nên Google không đưa lên kết quả tìm kiếm.
- **Sản phẩm và thương hiệu thêm từ admin:**
  - **Nơi lưu:** sheet **Sản phẩm** và **Thương hiệu** (tự tạo khi chạy `setup`).
  - **Ảnh tải lên:** lưu trong thư mục Google Drive **"beVIBE – Ảnh sản phẩm"** của tài khoản chạy Apps Script, đặt quyền "ai có link đều xem được" để hiện trên web. Không xóa thư mục này. Lần chạy `setup` đầu tiên sau khi cập nhật, Google hỏi thêm quyền Google Drive, bấm **Cho phép**.
  - **Khi nào hiện trên web:** khách thấy sản phẩm hoặc thương hiệu mới khi tải lại trang. Sản phẩm đang ẩn không hiện và không đặt mua được.
  - **Xóa:** không xóa được thương hiệu còn sản phẩm. Đơn hàng cũ của sản phẩm đã xóa vẫn giữ nguyên.
- **Đổi giá sản phẩm:** sửa trong admin → **Chi phí & giá vốn** → **Lưu bảng giá**. Không cần sửa code hay triển khai lại. Giá được lưu ở sheet **Bảng giá** (khi chạy `setup` lần đầu, sheet tự tạo từ `prices.js` và lấy giá vốn từ sheet "Giá vốn" cũ nếu có). Khi sheet Bảng giá đã có dữ liệu, giá trong `prices.js` chỉ còn dùng làm giá hiển thị tạm lúc trang vừa mở.
