# Story data contract (game đọc file này, không hardcode nội dung)

File: `game/public/story.json` (Claude sẽ ghi bản thật; OpenCode dùng bản mẫu cùng schema).

```json
{
  "meta": { "title": "string", "start": "nodeId" },
  "stats": { "skill": 0, "money": 0, "stress": 0, "network": 0 },
  "nodes": {
    "<nodeId>": {
      "level": 1,                      // cấp bậc 1..7 (hiển thị tiến trình)
      "title": "string",
      "text": "string (đoạn truyện, có thể nhiều dòng)",
      "image": "optional path",
      "choices": [
        { "label": "string", "next": "nodeId",
          "effects": { "skill": 2, "money": -1 },     // optional, cộng dồn vào stats
          "requires": { "skill": 5 } }                  // optional, ẩn/khóa nếu chưa đủ
      ],
      "ending": null                   // hoặc { "type": "good|bad|neutral", "title": "string", "summary": "string", "source": "video|extended" }
    }
  }
}
```
Quy tắc: node có `ending` thì `choices` rỗng. Mọi `next` phải tồn tại. Cần validator `npm run validate`.

## Schema v2 (Claude yêu cầu, OpenCode triển khai)
- `stats` là nguồn duy nhất của danh sách chỉ số: engine/validator lấy `Object.keys(story.stats)`, không hardcode.
- `meta.statLabels`: nhãn hiển thị từng chỉ số (thiếu thì dùng tên key).
- `meta.statMax`: trần thanh hiển thị, mặc định 10. `meta.showEffects`: mặc định false.
- Chỉ số được phép âm. `requires` là ngưỡng tối thiểu của MỌI chỉ số liệt kê.
- Node có thể có `fact` (chuỗi): hiển thị trong ô ghi chú riêng, tách khỏi lời truyện, dùng cho số liệu thật theo video.
- Quy tắc validator: mỗi node không phải ending phải có ít nhất 1 lựa chọn không có `requires`; mọi node phải đi tới được một ending.
