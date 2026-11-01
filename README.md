![7 Cấp Bậc Kỹ Sư AI](docs/hero.svg)

# 7 Cấp Bậc Kỹ Sư AI

Một tờ giấy báo điểm, bảy cấp bậc, và một chiếc ghế giám đốc AI ở cuối đường. Bạn đi từ sinh viên tới đỉnh nghề bằng những lựa chọn nhỏ, và mỗi lựa chọn đều có giá của nó.

Đây là game chọn lựa rẽ nhánh chạy ngay trên trình duyệt, đọc được trên điện thoại, có hai ngôn ngữ Việt và Anh. Game lấy cảm hứng từ video [7 Cấp Bậc Thăng Tiến Kỹ Sư AI](https://www.youtube.com/watch?v=9mbIKLKq9UM). Các mốc lương, học phí, điểm chuẩn, luật AI trong truyện là số liệu từ video đó, được dựng lại thành một hành trình bạn tự đi.

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

## Cài đặt và chơi trong ba bước

1. **Cài Node.js** bản LTS từ https://nodejs.org (một lần duy nhất). Kiểm tra bằng `node -v`, cần 20.19 trở lên.
2. **Lấy mã nguồn.** Repo đang riêng tư nên bạn cần được cấp quyền xem. Có quyền rồi thì:
   ```bash
   git clone https://github.com/Gaorb80/ai-engineer-career-game.git
   ```
   Hoặc vào trang repo, bấm **Code**, chọn **Download ZIP**, rồi giải nén.
3. **Chạy game.**
   - Windows: bấm đúp file **`play.bat`**.
   - macOS, Linux: chạy `./play.sh`.
   - Cách nào cũng được: mở terminal trong thư mục dự án và gõ `npm start`.

Lần đầu game tự cài thư viện (cần mạng, mất khoảng một phút), rồi tự mở trình duyệt tại http://localhost:4173. Những lần sau mở gần như ngay. Muốn dừng, đóng cửa sổ hoặc nhấn `Ctrl+C`.

**Chơi trên điện thoại:** chạy `npm start -- --lan` (hoặc `./play.sh --lan`), rồi mở địa chỉ dòng `Network` hiện ra trên điện thoại cùng Wi-Fi. Windows có thể hỏi về tường lửa, chọn cho phép mạng riêng.

| Gặp vấn đề | Cách xử lý |
|---|---|
| "Chưa có Node.js" | Làm bước 1, rồi chạy lại |
| Báo Node quá cũ | Cài lại bản LTS mới từ nodejs.org |
| Lỗi khi cài thư viện | Thường do mất mạng. Kiểm tra mạng rồi chạy lại |
| Cổng 4173 đang bận | Đóng cửa sổ game đang mở trước đó |

## Dành cho người làm code

```bash
cd game
npm install
npm run dev        # http://localhost:5173, tự tải lại khi sửa
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

Game lấy cảm hứng từ video [7 Cấp Bậc Thăng Tiến Kỹ Sư AI](https://www.youtube.com/watch?v=9mbIKLKq9UM) (kênh Cỏ Không Ngu). Cấu trúc bảy cấp và các số liệu về lương, học phí, điểm chuẩn, luật AI đều từ video đó, có thể đã thay đổi theo thời gian. Nhân vật, tình huống, các lựa chọn rẽ nhánh và chín trong mười một kết là phần viết thêm. Repo này không chứa hình hay lời của video gốc, lời truyện được viết lại. Nếu định công khai, nên hỏi ý kênh gốc trước.

---

## English

**7 Levels of an AI Engineer** is a branching choose-your-path game that runs in the browser and works on phones. You start with an exam score report and climb seven levels, from student to AI director, through choices that each cost something.

- Five stats pull against each other: Skill, Finances, Stress, Network and Real Projects.
- Eleven endings: four good, two neutral, five bad. Two come straight from the video, nine are extensions grounded in real careers.
- Tempting traps, and a hard burnout limit: reach 10 Stress and the run ends.
- Switch between English and Vietnamese at any time with the **VI / EN** button or the `L` key, even mid-scene. Your progress and stats stay put.
- Inspired by the video the Vietnamese video [7 Cấp Bậc Thăng Tiến Kỹ Sư AI](https://www.youtube.com/watch?v=9mbIKLKq9UM) ("The 7 Levels of AI Engineer Career Progression", channel Cỏ Không Ngu). The seven-level structure and the salary, tuition and law figures come from it, shown with approximate USD conversions in the English version. The branching choices and nine of the eleven endings are original.

Run it: install Node.js (LTS, 20.19 or newer) from https://nodejs.org, then double-click `play.bat` on Windows, run `./play.sh` on macOS/Linux, or type `npm start` in the project folder. The first run installs dependencies and opens the game at http://localhost:4173. Add `--lan` to play on a phone on the same Wi-Fi.
