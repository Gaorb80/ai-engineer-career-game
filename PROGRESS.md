# PROGRESS
- [ ] P1 Antigravity: transcript + frames -> story/
- [ ] P2 Claude: cốt truyện gốc + nhánh/kết -> story/STORY.md
- [ ] P3 OpenCode: engine + UI dựng trước -> game/
- [ ] P4 Claude: review cốt truyện vs code, duyệt OpenCode

## Điều phối (Orca run_778f7050b22f)
- P1 worktree agy-extract (Antigravity) và P3 worktree opencode-game (OpenCode) đã giao, chạy song song.
- Nhận thông báo: `orca orchestration check --wait --types worker_done,escalation,question` chạy nền (xem my-dotfiles/agent/knowledge/orca-agent-notify.md).
- Quyết định: engine đọc story.json theo docs/STORY_SCHEMA.md; Claude ghi story.json thật.
