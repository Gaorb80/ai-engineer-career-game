# Game engine — 7 Cấp Bậc Kỹ Sư AI

Visual novel dạng text, Vite + vanilla JS. Toàn bộ nội dung đọc từ `public/story.json`; code không chứa nội dung truyện.

## Lệnh

```sh
npm install
npm run validate   # kiểm tra story.json
npm run dev        # http://localhost:5173
npm run build      # xuất dist/
npm run preview    # xem bản build
```

## Dữ liệu truyện

Schema: `../docs/STORY_SCHEMA.md`. Bản trong `public/story.json` là **nội dung mẫu** (placeholder) để Claude thay bằng bản thật.

- `requires` = ngưỡng tối thiểu, ví dụ `{ "skill": 6 }` nghĩa là cần Kỹ năng ≥ 6. Lựa chọn chưa đủ bị khóa kèm lý do, không bị ẩn.
- `effects` cộng dồn vào stats, mỗi chỉ số không xuống dưới 0.
- Hiệu ứng từng lựa chọn chỉ hiện khi `meta.showEffects: true`; bản mẫu để `false`. Lựa chọn bị khóa vẫn ghi "Cần X ≥ N".
- Node có `ending` không được có `choices`; `ending.source` là `video` (có trong video gốc) hoặc `extended` (mở rộng).
- `image` là đường dẫn tương đối trong `public/` (ví dụ `"images/level-3.jpg"`), bỏ trống nếu không có ảnh.

## Lưu tiến trình

`localStorage` key `ai-career-game:v1` giữ tiến trình lượt đang chơi (node hiện tại, stats); key `ai-career-game:endings` giữ danh sách kết đã mở, nên tới màn kết thì tiến trình bị xóa nhưng thư viện kết vẫn còn. Mọi thao tác lưu đều bọc `try/catch`; nếu trình duyệt chặn, game vẫn chơi được và hiện cảnh báo.

## Kiểm tra trước khi merge

`npm run validate` báo lỗi khi: `next` không tồn tại, node ending có `choices`, node không tới được từ `start`, node không có lối thoát không `requires`, node không đi tới được kết nào (kẹt hoặc lặp vô tận), thiếu trường bắt buộc, chỉ số lạ. In danh sách kết ở cuối.
