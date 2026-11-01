# PROGRESS
- [ ] P1 Antigravity: transcript + frames -> story/
- [ ] P2 Claude: cốt truyện gốc + nhánh/kết -> story/STORY.md
- [ ] P3 OpenCode: engine + UI dựng trước -> game/
- [ ] P4 Claude: review cốt truyện vs code, duyệt OpenCode

## Điều phối (Orca run_778f7050b22f)
- P1 worktree agy-extract (Antigravity) và P3 worktree opencode-game (OpenCode) đã giao, chạy song song.
- Nhận thông báo: `orca orchestration check --wait --types worker_done,escalation,question` chạy nền (xem my-dotfiles/agent/knowledge/orca-agent-notify.md).
- Quyết định: engine đọc story.json theo docs/STORY_SCHEMA.md; Claude ghi story.json thật.

## Cập nhật
- P1 xong (agy): transcript + 108 khung + 12 sheet, giữ local, gitignore.
- P2 xong: story/story.json 34 node, 9 kết (2 từ video, 7 mở rộng), đã kiểm tra reachability.
- P3 vòng 2 đang chạy (OpenCode, sửa theo review). Sau đó: schema v2 (stats động, fact), merge, thay story mẫu.
