# Về dự án

## Bảy cấp bậc

| Cấp | Bạn là | Chuyện chính |
|---|---|---|
| 1 | Sinh viên | Điểm chuẩn 30/30, học phí bốn năm 170 đến 270 triệu |
| 2 | Thực tập | Gán nhãn dữ liệu, phụ cấp từ 0 đến 12 triệu, dòng chữ trong hồ sơ |
| 3 | Fresher | Lương đầu 15 đến 20 triệu, kỹ sư AI hay kỹ sư học máy |
| 4 | Kỹ sư AI | Ba điều kiện của ghế 45 đến 50 triệu, luật AI có hiệu lực |
| 5 | Senior | 55 đến 80 triệu, công cụ cũ nhanh, lời đồn miễn thuế năm năm |
| 6 | Lead hoặc chuyên gia | Ngã rẽ sau tám năm, phép tính mua nhà mất mười lăm năm |
| 7 | Giám đốc AI | Mức trần 390 đến 650 triệu một tháng, và người giải trình khi có sự cố là bạn |

<details>
<summary>Danh sách mười một kết (có tiết lộ)</summary>

| Kết | Loại | Nguồn |
|---|---|---|
| Giám đốc AI | tốt | video |
| Giỏi và bình yên ở cấp 6 | trung lập | video |
| Sản phẩm của riêng bạn | tốt | mở rộng |
| Người lập nghiệp | tốt | mở rộng |
| Ra biển lớn | tốt | mở rộng |
| Con đường mới | trung lập | mở rộng |
| Kiệt sức | xấu | mở rộng |
| Bị bỏ lại | xấu | mở rộng |
| Người chịu trách nhiệm | xấu | mở rộng |
| Chiếc bẫy mức lương | xấu | mở rộng |
| Gánh nặng mái nhà | xấu | mở rộng |

</details>

## Làm ra thế nào

Dự án do ba agent AI làm việc cùng nhau trong Orca, mỗi bên một việc:

- **Antigravity (Gemini):** chép lời video, cắt khung hình, dịch sang tiếng Anh, kiểm thử độc lập đường đi tới các kết.
- **OpenCode:** dựng engine và giao diện đầu tiên, sửa theo review, viết test.
- **Claude:** điều phối, đối chiếu cốt truyện với video, viết cốt truyện rẽ nhánh và các kết mở rộng, viết lại engine và giao diện, cân độ khó.

## Nguồn và lưu ý

Game lấy cảm hứng từ video [7 Cấp Bậc Thăng Tiến Kỹ Sư AI](https://www.youtube.com/watch?v=9mbIKLKq9UM) (kênh Cỏ Không Ngu). Cấu trúc bảy cấp và các số liệu về lương, học phí, điểm chuẩn, luật AI đều từ video đó, có thể đã thay đổi theo thời gian. Nhân vật, tình huống, các lựa chọn rẽ nhánh và chín trong mười một kết là phần viết thêm. Repo này không chứa hình hay lời của video gốc, lời truyện được viết lại.

