# Game: engine và giao diện

Visual novel dạng text, Vite + vanilla JS, không backend. Toàn bộ chữ (truyện và giao diện) đọc từ `public/story.<ngôn ngữ>.json`; code không chứa chữ nào của truyện. Giới thiệu sản phẩm ở `../README.md`.

## Lệnh

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # xuất dist/
npm run validate   # kiểm tra từng bản truyện + hai bản ngôn ngữ khớp nhau
npm test           # test engine, validator, độ khớp ngôn ngữ (node:test)
node tests/playthrough.mjs   # duyệt không gian trạng thái, mô phỏng 20.000 lượt
```

## Cấu trúc

| File | Việc |
|---|---|
| `src/engine.js` | Luật chơi thuần logic: chỉ số theo `story.stats`, điều kiện, kiệt sức, lưu tiến trình |
| `src/main.js` | Vẽ giao diện, bàn phím, đổi ngôn ngữ giữa chừng |
| `src/style.css` | Giao diện tối, màu đất nung, serif cho truyện, monospace cho HUD |
| `scripts/validate.js` | Kiểm tra một file truyện: `next` tồn tại, không kẹt, mọi node tới được kết |
| `scripts/validate-locales.js` | Hai bản ngôn ngữ phải cùng id node, lựa chọn, hiệu ứng, điều kiện, placeholder |
| `public/story.vi.json`, `story.en.json` | Nội dung (bản biên tập ở `../story/`) |

## Dữ liệu truyện

Schema ở `../docs/STORY_SCHEMA.md`. Điểm cần nhớ:

- `requires` là ngưỡng tối thiểu của mọi chỉ số liệt kê. Lựa chọn chưa đủ bị khóa kèm lý do, không bị ẩn.
- Chỉ số được phép âm. Thanh hiển thị chỉ kẹp trong khoảng 0 tới `meta.statMax`.
- `meta.showEffects: false` ẩn hiệu ứng từng lựa chọn. `meta.overload` ép sang kết kiệt sức khi một chỉ số chạm ngưỡng.
- `fact` là ô số liệu theo video, tách khỏi lời truyện.
- `meta.ui` chứa chữ giao diện, có `{placeholder}`; bản dịch phải giữ nguyên placeholder.

## Đổi ngôn ngữ

Chọn ở `LANGS` trong `src/main.js`. State (node, chỉ số) dùng chung giữa các ngôn ngữ nên đổi giữa chừng không mất tiến trình. Thêm ngôn ngữ: thêm `story.<mã>.json` cùng cấu trúc rồi thêm mã vào `LANGS`; `npm run validate` sẽ báo chỗ nào lệch.

## Lưu tiến trình

`localStorage`: `ai-career-game:v2:run` (lượt đang chơi, xóa khi tới kết), `ai-career-game:v2:endings` (kết đã mở), `ai-career-game:lang` (ngôn ngữ). Mọi thao tác bọc `try/catch`; bị chặn thì vẫn chơi được.
