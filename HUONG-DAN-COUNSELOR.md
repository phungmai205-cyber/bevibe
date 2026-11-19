# Phân hệ Counselor beVIBE

Trang dành cho Counselor (tư vấn viên / đại lý sỉ): **`#/counselor`** trên website.
Đăng nhập bằng **mã Counselor + số điện thoại đã đăng ký** (nút tài khoản trên header → tab Counselor).

## Counselor làm được gì

| Mục | Nội dung |
|---|---|
| **Báo cáo** (đầu trang) | Doanh số niêm yết, chiết khấu, tiền nhập, lợi nhuận gộp, quỹ thưởng, ROI. Lọc theo tháng / quý / năm / toàn bộ. |
| **Quỹ thưởng & hạng** | Quỹ thưởng năm, hạng hiện tại, số tiền cần nhập thêm để lên hạng. |
| **Đặt hàng sỉ** | Chọn nhiều sản phẩm (lọc Mỹ phẩm / TPCN, tìm kiếm), sửa số lượng. Chiết khấu tự nhảy bậc theo số lượng và gợi ý "thêm N sp để được X%". Nhập địa chỉ rồi gửi đơn. |
| **Báo cáo chi tiết** | Bảng theo tháng trong năm, top sản phẩm nhập nhiều. |
| **Lịch sử đơn** | Mọi đơn sỉ đã gửi, kèm trạng thái. |
| **Chính sách & công thức** | Bảng chiết khấu, công thức, hạng thưởng (Counselor xem được minh bạch). |

## Chính sách (sửa trong `assets/js/counselor-policy.js`)

**Chiết khấu** theo nhóm sản phẩm và **tổng số lượng của nhóm đó trong cùng một đơn**:

| Nhóm | 1–9 sp | 10–49 sp | 50+ sp |
|---|---|---|---|
| Mỹ phẩm | 50% (CSL-MP50) | **55% (CSL-MP55)** | 60% (CSL-MP60) |
| Thực phẩm chức năng | 35% (CSL-TP35) | 40% (CSL-TP40) | 45% (CSL-TP45) |

**Quỹ thưởng cuối năm:** 5% trên tiền nhập (thực trả) của các đơn **Hoàn tất**. beVIBE trích từ phần thu, Counselor không trả thêm. Cuối năm trao bằng tiền mặt hoặc hiện vật cùng giá trị.

**Hạng** theo tổng tiền nhập trong năm:

| Hạng | Tiền nhập từ | Quà tặng |
|---|---|---|
| Đồng | 0đ | 100% quỹ thưởng |
| Bạc | 50.000.000đ | quỹ thưởng + bộ quà tặng |
| Vàng | 150.000.000đ | quỹ thưởng + 01 chỉ vàng |
| Kim cương | 300.000.000đ | quỹ thưởng + du lịch Hàn Quốc |

> ⚠ Các con số trên là **mẫu**. beVIBE xác nhận lại rồi sửa trong `counselor-policy.js`. Sửa xong chạy `npm run build` và đăng lại website.

## Công thức

| Chỉ số | Công thức |
|---|---|
| Doanh số niêm yết (GMV) | Σ giá niêm yết × số lượng |
| Chiết khấu | Σ giá niêm yết × số lượng × % chiết khấu của nhóm |
| Tiền nhập (thực trả) | GMV − Chiết khấu |
| Quỹ thưởng | Tiền nhập × 5% |
| Doanh thu bán ra | Số tiền Counselor bán lại cho khách. Báo cáo giả định bán đúng giá niêm yết (= GMV) |
| Lợi nhuận gộp | Doanh thu bán ra − Tiền nhập |
| Tổng lợi ích | Lợi nhuận gộp + Quỹ thưởng |
| Biên lợi nhuận | Lợi nhuận gộp ÷ Doanh thu bán ra |
| ROI | Tổng lợi ích ÷ Tiền nhập |

**Ví dụ:** 10 lọ Dr.BARGO Serum 660.000đ, nhóm Mỹ phẩm, bậc 55%:
- GMV = 6.600.000đ
- Chiết khấu = 3.630.000đ
- Tiền nhập = 2.970.000đ
- Quỹ thưởng = 148.500đ
- Lợi nhuận gộp = 3.630.000đ
- ROI = (3.630.000 + 148.500) ÷ 2.970.000 ≈ **127,2%**

Báo cáo **không trừ** phí vận chuyển và chi phí bán hàng riêng của Counselor. Đơn **Đã hủy / Hoàn hàng** không được tính.

## beVIBE xử lý đơn sỉ thế nào

1. Đơn sỉ vào **admin → Đơn hàng → tab Tư vấn viên**. Cột "Cơ sở / Mã TVV" là mã Counselor. Giá trong đơn là **giá niêm yết**, do máy chủ tính lại.
2. Ghi chú đơn có dòng `[ĐƠN SỈ COUNSELOR BV…] CK tạm tính … · Thực trả dự kiến …`.
3. Gọi Counselor xác nhận, **đối chiếu mã Counselor**. Sau đó nhập chiết khấu vào ô **Giảm giá** của đơn, để doanh thu trong báo cáo admin đúng bằng tiền thực thu.

## Giới hạn hiện tại

- Tài khoản và lịch sử đơn của Counselor lưu trên **trình duyệt của Counselor**. Đổi máy thì không thấy lịch sử cũ.
- Trạng thái đơn (Hoàn tất, Đã hủy…) admin cập nhật **chưa tự đồng bộ** về trang Counselor. Vì vậy quỹ thưởng và hạng trên trang Counselor đang là "tạm tính".
- Muốn đồng bộ thật (Counselor xem trạng thái và quỹ thưởng chính thức trên mọi máy), cần lưu Counselor và đơn sỉ trên máy chủ (Google Sheet hoặc Supabase), kèm một API cho Counselor đọc đơn của mình.
