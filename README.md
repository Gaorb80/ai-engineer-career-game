![7 Cấp Bậc Kỹ Sư AI](docs/hero.svg)

# 7 Cấp Bậc Kỹ Sư AI

Một tờ giấy báo điểm, bảy cấp bậc, và một chiếc ghế giám đốc AI ở cuối đường. Bạn đi từ sinh viên tới đỉnh nghề bằng những lựa chọn nhỏ, và mỗi lựa chọn đều có giá của nó.

Đây là game chọn lựa rẽ nhánh chạy ngay trên trình duyệt, đọc được trên điện thoại, có hai ngôn ngữ Việt và Anh. Các mốc lương, học phí, điểm chuẩn, luật AI trong truyện là số liệu thật lấy từ một video phân tích nghề kỹ sư AI ở Việt Nam, rồi dựng thành một hành trình bạn tự đi.

[English summary below](#english)

## Bạn sẽ chơi gì

- **Đi hết bảy cấp:** sinh viên, thực tập, fresher, kỹ sư AI, senior, trưởng nhóm hoặc chuyên gia, giám đốc AI. Mỗi cấp có tình huống riêng: gán nhãn một nghìn tấm ảnh, chatbot bịa ra khuyến mãi, tấm biển tuyển dụng 45 đến 50 triệu, luật AI vừa có hiệu lực.
- **Năm chỉ số kéo nhau:** Kỹ năng, Tài chính, Căng thẳng, Quan hệ, và Sản phẩm thật. Chỉ số quyết định lựa chọn nào mở khóa. Lựa chọn nào cũng đổi gì đó, nhưng game không nói trước đổi bao nhiêu.
- **Mười một cái kết:** bốn kết tốt, hai trung lập, năm kết xấu. Chỉ hai kết lấy thẳng từ video, chín kết còn lại là phần mở rộng gắn với đời thật: kiệt sức, bị bỏ lại vì ngừng học, lập công ty, ra nước ngoài.
- **Có bẫy:** một mức lương 70 triệu không nói rõ dự án, một khoản vay mua nhà quá sớm. Chúng nghe hợp lý, và đó là chỗ hiểm.
- **Căng thẳng chạm 10 là hết:** bạn sẽ bị đẩy thẳng vào kết Kiệt sức. Muốn đi xa phải biết lúc nào nên nghỉ.

<p align="center">
  <img src="docs/img/title.png" width="31%" alt="Màn hình chính" />
  <img src="docs/img/scene.png" width="31%" alt="Một cảnh có ô số liệu và các lựa chọn" />
  <img src="docs/img/ending-en.png" width="31%" alt="Màn kết bản tiếng Anh" />
</p>

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

## Đổi ngôn ngữ giữa chừng

Nút **VI / EN** có ở mọi màn hình, phím tắt là `L`. Đổi bất cứ lúc nào, kể cả đang giữa một cảnh hay đang ở màn kết: tiến trình, chỉ số, vị trí cuộn trang đều giữ nguyên, chỉ chữ đổi. Ngôn ngữ được nhớ cho lần sau, lần đầu mở sẽ theo ngôn ngữ trình duyệt.

Cách này an toàn nhờ một quy tắc: hai bản dịch phải có cùng id node, cùng lựa chọn, cùng hiệu ứng và điều kiện. Lệch một chỗ là `npm run validate` báo lỗi và chỉ rõ chỗ lệch.

## Chạy thử

Cần Node 20.19 trở lên.

```bash
cd game
npm install
npm run dev        # mở http://localhost:5173
```

| Lệnh | Việc |
|---|---|
| `npm run build` | Dựng bản tĩnh vào `game/dist`, đưa lên hosting tĩnh nào cũng chạy |
| `npm run validate` | Kiểm tra từng bản truyện và kiểm tra hai bản ngôn ngữ khớp nhau |
| `npm test` | Test engine, validator và độ khớp ngôn ngữ |
| `node tests/playthrough.mjs` | Duyệt mọi tổ hợp chỉ số, chơi ngẫu nhiên 20.000 lượt, báo kết nào quá hiếm |

Không có backend, không cần tài khoản. Tiến trình nằm trong `localStorage` của trình duyệt.

## Độ tin cậy của cốt truyện

Cốt truyện rẽ nhánh dễ hỏng ở những chỗ người viết không nhìn ra: một lựa chọn bị khóa vĩnh viễn, một kết không ai tới được. Vì vậy:

- Validator chặn node mà mọi lựa chọn đều bị khóa, và node không dẫn tới kết nào.
- Một script độc lập duyệt toàn bộ không gian (node, chỉ số) hơn một triệu trạng thái và xác nhận cả mười một kết đều đạt được, mười lăm lựa chọn có điều kiện đều khả thi.
- Hai kết đỉnh từng gần như không ai chạm tới. Sau lần kiểm thử, ngưỡng điều kiện đã được hạ và đo lại.

## Thêm hoặc sửa nội dung

Toàn bộ chữ nằm trong `game/public/story.vi.json` và `story.en.json` (bản gốc để biên tập nằm ở `story/`). Code không chứa chữ nào của truyện. Muốn thêm ngôn ngữ, thêm `story.<mã>.json` cùng cấu trúc và thêm mã đó vào `LANGS` trong `game/src/main.js`. Schema ở `docs/STORY_SCHEMA.md`, thiết kế cốt truyện ở `story/STORY.md`.

## Làm ra thế nào

Dự án do ba agent AI làm việc cùng nhau trong Orca, mỗi bên một việc:

- **Antigravity (Gemini):** chép lời video, cắt khung hình, dịch sang tiếng Anh, kiểm thử độc lập đường đi tới các kết.
- **OpenCode:** dựng engine và giao diện đầu tiên, sửa theo review, viết test.
- **Claude:** điều phối, đối chiếu cốt truyện với video, viết cốt truyện rẽ nhánh và các kết mở rộng, viết lại engine và giao diện, cân độ khó.

## Nguồn và lưu ý

Số liệu trong game tổng hợp theo một video giải thích nghề kỹ sư AI (kênh Cỏ Không Ngu) và có thể đã thay đổi theo thời gian. Nhân vật và tình huống là hư cấu. Repo này không chứa hình hay lời của video gốc, lời truyện được viết lại. Nếu định công khai, nên hỏi ý kênh gốc trước.

---

## English

**7 Levels of an AI Engineer** is a branching choose-your-path game that runs in the browser and works on phones. You start with an exam score report and climb seven levels, from student to AI director, through choices that each cost something.

- Five stats pull against each other: Skill, Finances, Stress, Network and Real Projects.
- Eleven endings: four good, two neutral, five bad. Two come straight from the video, nine are extensions grounded in real careers.
- Tempting traps, and a hard burnout limit: reach 10 Stress and the run ends.
- Switch between English and Vietnamese at any time with the **VI / EN** button or the `L` key, even mid-scene. Your progress and stats stay put.
- Salary, tuition and law figures come from a video analysing the AI engineering career path in Vietnam. They are shown with approximate USD conversions in the English version.

Run it: `cd game && npm install && npm run dev`, then open http://localhost:5173. Needs Node 20.19 or newer.
