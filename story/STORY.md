# Cốt truyện: 7 Cấp Bậc Kỹ Sư AI

Nguồn: video 7 Cấp Bậc Thăng Tiến Kỹ Sư AI (kênh có watermark Cỏ Không Ngu). Game viết lại bằng lời mới, KHÔNG dùng hình/transcript của video. Cần ghi nguồn trong màn Giới thiệu trước khi công khai.

## Xương sống (video gốc)
Cấp 1 sinh viên (điểm chuẩn, học phí 170-270tr) > 2 thực tập (gán nhãn, phụ cấp 0-12tr, dòng chữ hồ sơ) > 3 fresher (15-20tr, chatbot bịa, AI vs ML) > 4 kỹ sư (45-50tr, 3 điều kiện, luật AI) > 5 senior (55-80tr, đồ cũ, miễn thuế) > 6 trưởng nhóm/chuyên gia (phép tính nhà 15 năm) > 7 giám đốc AI (390-650tr, mức trần).
Thông điệp xuyên suốt: sản phẩm thật trong hồ sơ mở cửa, hỏi sẽ được làm gì, không chỉ hỏi phụ cấp bao nhiêu.

## Kết
| Kết | Loại | Nguồn | Điều kiện chính |
|---|---|---|---|
| ket-caio Giám đốc AI | tốt | video | cấp 7, quan hệ >= 10, sản phẩm >= 10 |
| ket-khong-moc Giỏi và bình yên | trung lập | video | dừng ở cấp 6 (video: ghế cuối không có mốc năm) |
| ket-san-pham | tốt | mở rộng | cấp 7, từ chối mức trần |
| ket-founder | tốt | mở rộng | cấp 5, sản phẩm >= 8, quan hệ >= 5 |
| ket-ra-ngoai | tốt | mở rộng | cấp 6, kỹ năng >= 17 (liên hệ vụ Meta 200 lần) |
| ket-chuyen-huong | trung lập | mở rộng | cấp 3, tự chọn |
| ket-burnout | xấu | mở rộng | căng thẳng cao |
| ket-do-cu | xấu | mở rộng | cấp 5, ngừng học |
| ket-quang-no | xấu | mở rộng | cấp 4 hoặc 7, che giấu rủi ro luật AI |
| ket-bay-luong | xấu | mở rộng | cấp 4, nhận lương 70tr mà không hỏi dự án (bẫy) |
| ket-ganh-no | xấu | mở rộng | cấp 6, vay lớn mua nhà sớm (bẫy, liên hệ phép tính 15 năm) |

## Kiểm tra
Duyệt toàn bộ không gian (node x chỉ số): cả 11 kết đạt được, không softlock (explore + game/tests/playthrough.mjs của Antigravity cho cùng số liệu).

## Cơ chế độ khó
- meta.overload: căng thẳng >= 10 thì ép sang ket-burnout (trừ khi đã tới kết). Từ 8 trở lên hiện cảnh báo trên HUD.
- Lựa chọn nghỉ ngơi (giảm căng thẳng 3) ở l3-chatbot, l5-thiet-ke, l6-truong-nhom, đánh đổi bằng tiến độ.
- Thứ tự lựa chọn đã xoay vòng, lựa chọn tốt không cố định ở vị trí 1.
- 3 bẫy hấp dẫn: lương 70tr (l4-bien), vay mua nhà (l6-nha), cắt đội thay bằng AI (l7-ghe, hậu quả mềm: mất quan hệ).
