# Hướng dẫn kích hoạt hệ thống nhận đơn hàng (Google Sheets)

Khách đặt hàng trên website → đơn được ghi vào Google Sheet của beVIBE và gửi email báo đơn mới.
Không cần máy chủ, không tốn phí. Chỉ cần làm **một lần** (~5 phút).

---

## Bước 1 — Tạo Google Sheet

1. Đăng nhập Google bằng tài khoản của công ty (ví dụ `bevibevn@gmail.com`).
2. Vào <https://sheets.new> để tạo bảng tính mới, đặt tên: **beVIBE – Đơn hàng website**.

## Bước 2 — Dán mã nhận đơn

1. Trong Sheet: **Tiện ích mở rộng → Apps Script**.
2. Xóa hết mã mẫu trong file `Code.gs`, dán **toàn bộ** nội dung file `google-apps-script/Code.gs` của dự án.
3. (Tùy chọn) Sửa email nhận thông báo ở dòng `NOTIFY_EMAILS: ['bevibevn@gmail.com']` — thêm nhiều email bằng dấu phẩy.
4. Bấm biểu tượng **Lưu** (💾).

## Bước 3 — Tạo bảng và cấp quyền

1. Ở thanh trên cùng, chọn hàm **`setup`** → bấm **Chạy**.
2. Google hỏi quyền → **Xem xét quyền** → chọn tài khoản → **Nâng cao** → **Đi tới … (không an toàn)** → **Cho phép**.
   (Cảnh báo này là bình thường với mã do chính bạn tạo; mã chỉ ghi vào Sheet này và gửi email.)
3. Quay lại Sheet: đã có 2 trang **Đơn hàng** và **Chi tiết đơn**.
4. (Nên làm) Chọn hàm **`testOrder`** → **Chạy** → kiểm tra có 1 dòng đơn thử trong Sheet và 1 email báo đơn. Sau đó xóa dòng thử.

## Bước 4 — Triển khai thành ứng dụng web

1. Bấm **Triển khai → Tùy chọn triển khai mới**.
2. Bấm biểu tượng ⚙ → chọn **Ứng dụng web**.
3. Thiết lập:
   - **Thực thi với tư cách:** Tôi (tài khoản của bạn)
   - **Người có quyền truy cập:** Bất kỳ ai
4. Bấm **Triển khai** → sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).
5. Kiểm tra: dán URL vào trình duyệt → thấy `{"ok":true,"service":"beVIBE orders",...}` là đúng.

## Bước 5 — Gắn vào website

1. Mở file `assets/js/order-config.js`, dán URL vào:
   ```js
   export const ORDER_ENDPOINT = 'https://script.google.com/macros/s/XXXX/exec';
   ```
2. Chạy `npm run build` và đưa thư mục `dist/` lên hosting như thường lệ.
3. Đặt thử 1 đơn trên website → kiểm tra Sheet và email.

> Khi `ORDER_ENDPOINT` còn trống, website vẫn hoạt động như cũ: khách gửi đơn qua Zalo/Email.

---

## Quản lý đơn hàng hằng ngày

- Trang **Đơn hàng**: mỗi đơn 1 dòng (mã đơn, khách, SĐT, địa chỉ, sản phẩm, tạm tính, thanh toán, ghi chú).
- Cột **Trạng thái** có danh sách chọn: *Mới → Đã xác nhận → Đang giao → Hoàn tất / Đã hủy* (tự tô màu).
- Dùng **Dữ liệu → Tạo bộ lọc** để lọc đơn theo trạng thái, ngày, tỉnh…
- Trang **Chi tiết đơn**: mỗi sản phẩm 1 dòng — dùng để thống kê sản phẩm bán chạy, doanh thu.
- Cột **Kiểm tra giá** báo "OK" khi giá trên web khớp bảng giá; nếu khác, đơn vẫn được tính theo **bảng giá** và cột này ghi rõ chênh lệch.
- Có thể cài app **Google Sheets** trên điện thoại và bật thông báo Gmail để nhận đơn ngay.

## Khi thay đổi giá sản phẩm

1. Sửa giá trong `assets/js/prices.js`.
2. Chạy `npm run sync-prices` (cập nhật bảng giá vào `google-apps-script/Code.gs`).
3. Dán lại toàn bộ `Code.gs` vào Apps Script → **Lưu**.
4. **Triển khai → Quản lý các bản triển khai** → biểu tượng ✏️ → **Phiên bản: Phiên bản mới** → **Triển khai**.
   (URL giữ nguyên, không cần sửa website.)
5. Chạy `npm run build` và đăng lại website.

## An toàn & giới hạn

- URL ứng dụng web **chỉ nhận đơn**, không ai đọc được dữ liệu trong Sheet qua URL này.
- Tiền luôn được **tính lại theo bảng giá trên máy chủ**, không phụ thuộc số liệu trình duyệt gửi lên.
- Chống spam: ô ẩn bẫy bot + tối đa 3 đơn / 10 phút cho cùng một số điện thoại.
- Chỉ sản phẩm **có giá** trong `prices.js` mới đặt được; sản phẩm "Liên hệ" vẫn dùng nút báo giá sỉ.
- Gmail cá nhân gửi được khoảng **100 email/ngày** qua Apps Script (Google Workspace: 1.500). Nếu vượt, đơn **vẫn được ghi vào Sheet**, chỉ thiếu email thông báo.
- Không chia sẻ quyền **chỉnh sửa** Sheet đơn hàng cho "Bất kỳ ai có đường liên kết".
