# Hướng dẫn bật tài khoản khách hàng (Firebase)

Sau khi bật, mỗi khách hàng có tài khoản riêng: đăng nhập bằng **Google** hoặc **email + mật khẩu**, giỏ hàng
được lưu theo tài khoản (đăng nhập máy khác vẫn thấy giỏ của mình), thông tin giao hàng được điền sẵn khi đặt.
Miễn phí với gói Spark của Firebase (đủ cho hàng chục nghìn khách mỗi tháng). Chỉ cần làm **một lần** (~15 phút).

> Khi chưa làm các bước dưới, nút tài khoản (biểu tượng người cạnh giỏ hàng) vẫn hiện nhưng báo
> "Tính năng đăng nhập đang được thiết lập". Khách vẫn thêm giỏ và đặt hàng bình thường.

---

## Bước 1 — Tạo dự án Firebase

1. Đăng nhập Google bằng tài khoản công ty (ví dụ `bevibevn@gmail.com`), vào <https://console.firebase.google.com>.
2. Bấm **Tạo dự án** (Create a project) → đặt tên `bevibe-website` → **Tiếp tục**.
3. Màn hình Google Analytics: **tắt** (không cần) → **Tạo dự án** → đợi khoảng 30 giây → **Tiếp tục**.

## Bước 2 — Lấy mã cấu hình cho website

1. Ở trang tổng quan dự án, bấm biểu tượng **`</>`** (Web).
2. Tên ứng dụng: `beVIBE Web` → **không** tích Firebase Hosting → **Đăng ký ứng dụng**.
3. Màn hình hiện một đoạn mã có `const firebaseConfig = { apiKey: "...", authDomain: "...", ... };`
   → **sao chép phần trong dấu `{ ... }`** → bấm **Tiếp tục tới bảng điều khiển**.
4. Gửi đoạn này cho tôi (hoặc tự dán theo Bước 6). Các giá trị này **không phải mật khẩu**, được phép công khai.

## Bước 3 — Bật đăng nhập Google và Email

1. Menu trái: **Xây dựng (Build) → Authentication** → **Bắt đầu**.
2. Thẻ **Phương thức đăng nhập (Sign-in method)**:
   - Chọn **Email/Mật khẩu** → bật dòng đầu **Email/Mật khẩu** (KHÔNG cần bật "Đường liên kết email") → **Lưu**.
   - **Thêm nhà cung cấp mới** → **Google** → bật → chọn **Email hỗ trợ dự án** là email công ty → **Lưu**.
3. Thẻ **Cài đặt (Settings) → Miền được ủy quyền (Authorized domains)** → **Thêm miền** →
   nhập tên miền website, ví dụ `bevibe.vn` và `www.bevibe.vn` (mỗi miền một lần).
   (`localhost` đã có sẵn để thử trên máy.)
4. (Nên làm) Thẻ **Mẫu (Templates)** → chọn ngôn ngữ **Tiếng Việt** cho email đặt lại mật khẩu / xác minh.

## Bước 4 — Tạo nơi lưu giỏ hàng (Firestore)

1. Menu trái: **Xây dựng → Firestore Database** → **Tạo cơ sở dữ liệu**.
2. Vị trí: chọn **asia-southeast1 (Singapore)** → **Tiếp theo**.
3. Chọn **Bắt đầu ở chế độ sản xuất (production mode)** → **Tạo**.

## Bước 5 — Dán quy tắc bảo mật

1. Trong Firestore Database → thẻ **Quy tắc (Rules)**.
2. Xóa hết nội dung cũ, dán **toàn bộ** file `firestore.rules` của dự án → **Xuất bản (Publish)**.
   (Quy tắc này đảm bảo mỗi khách chỉ đọc/sửa được giỏ hàng của chính mình.)

## Bước 6 — Gắn vào website

1. Mở `assets/js/auth-config.js`, thay `export const FIREBASE_CONFIG = null;` bằng:
   ```js
   export const FIREBASE_CONFIG = {
     apiKey: 'AIza...',
     authDomain: 'bevibe-website.firebaseapp.com',
     projectId: 'bevibe-website',
     storageBucket: 'bevibe-website.appspot.com',
     messagingSenderId: '...',
     appId: '...'
   };
   ```
2. (Nếu dùng hệ thống nhận đơn Google Sheets) mở `google-apps-script/Code.gs`, dán giá trị `apiKey` vào
   `FIREBASE_API_KEY: ''` → dán lại toàn bộ Code.gs vào Apps Script → chạy `setup` một lần (thêm cột
   **Tài khoản**) → **Triển khai → Quản lý các bản triển khai → ✏️ → Phiên bản mới → Triển khai**.
   Google sẽ hỏi thêm quyền "Kết nối với dịch vụ bên ngoài" (dùng để xác minh tài khoản khách) → **Cho phép**.
3. Chạy `npm run build` và đưa thư mục `dist/` lên hosting.

## Bước 7 — Kiểm tra

1. Mở website → bấm biểu tượng người cạnh giỏ hàng → **Tiếp tục với Google** → chọn tài khoản → nút đổi thành chữ cái đầu tên.
2. Thêm 1 sản phẩm vào giỏ → mở website trên điện thoại, đăng nhập cùng tài khoản → giỏ có sản phẩm đó.
3. Firebase console → **Authentication → Users**: thấy danh sách khách đã đăng ký.

---

## Hoạt động thế nào

| Tình huống | Kết quả |
|---|---|
| Khách chưa đăng nhập thêm sản phẩm | Giỏ lưu trên trình duyệt như trước |
| Khách đăng nhập | Giỏ đang có được **gộp** vào giỏ của tài khoản |
| Đăng nhập trên máy khác | Thấy đúng giỏ hàng của mình |
| Đăng xuất | Giỏ trên máy được xóa, người sau dùng chung máy không thấy |
| Đặt hàng khi đã đăng nhập | Họ tên, email điền sẵn; cột **Tài khoản** trong Sheet ghi email tài khoản (đã xác minh) |
| Quên mật khẩu | Bấm "Quên mật khẩu?" → Firebase gửi email đặt lại |

## Quản lý

- Danh sách khách: Firebase console → **Authentication → Users** (có thể vô hiệu hóa / xóa tài khoản).
- Giỏ hàng từng khách: **Firestore Database → carts** (mỗi tài khoản 1 tài liệu).
- Không cần mua gói trả phí. Nếu sau này muốn thêm đăng nhập Apple: cần tài khoản Apple Developer (99 USD/năm).
