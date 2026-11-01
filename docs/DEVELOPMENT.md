# Phát triển

## Chạy trên máy

Chơi online thì mở https://gaorb80.github.io/ai-engineer-career-game/ là đủ. Chạy trên máy chỉ cần khi muốn chơi offline hoặc sửa game.

1. **Cài Node.js** bản LTS từ https://nodejs.org (một lần duy nhất). Kiểm tra bằng `node -v`, cần 20.19 trở lên.
2. **Lấy mã nguồn.** Repo công khai, cứ clone:
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

## Chạy chế độ dev

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

Game tự đưa lên GitHub Pages mỗi lần push vào `main` (`.github/workflows/pages.yml`: validate, test, build, deploy).
