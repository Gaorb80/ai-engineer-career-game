# PROGRESS
Dự án: game chọn lựa từ video 7 cấp bậc kỹ sư AI. Repo local, chưa tạo remote GitHub.

## Đã làm
- Antigravity: transcript + 108 khung + 12 sheet (local, gitignore, vì là tài sản video gốc).
- Claude: story/story.json 33 node, 9 kết (2 video, 7 mở rộng), story/STORY.md; đã duyệt toàn bộ không gian trạng thái, không softlock.
- OpenCode (chạy model free Big Pickle, không phải DeepSeek): engine+UI vòng 1, vòng 2 sửa theo review (validator softlock, test, save).
- Claude: viết lại engine (chỉ số động theo story.stats), UI phong cách tech/clay, fact box, phím số. 11 test pass, validate pass, build pass.

## Chạy
cd game; npm install; npm run dev (cổng 5173); npm test; npm run validate

## Việc tồn đọng
- Chưa tạo remote GitHub, chưa PR.
- Xác minh số liệu level 5-7 với nguồn gốc (ASR có thể nghe sai).
- Thêm màn Giới thiệu/ghi nguồn, xin phép kênh gốc nếu công khai.
- Muốn OpenCode dùng DeepSeek: chọn model khi worker-start (--model) hoặc cấu hình opencode.
