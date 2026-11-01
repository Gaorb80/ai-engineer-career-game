// Kiểm tra game/public/story.json trước khi build. Không cần dependency.
import { readFileSync } from "node:fs";

const STAT_KEYS = ["skill", "money", "stress", "network"];
const ENDING_TYPES = ["good", "bad", "neutral"];
const SOURCES = ["video", "extended"];

const file = new URL("../public/story.json", import.meta.url);
const errors = [];

let story;
try {
  story = JSON.parse(readFileSync(file, "utf8"));
} catch (error) {
  console.error(`✗ Không đọc/parse được story.json: ${error.message}`);
  process.exit(1);
}

const nodes = story.nodes && typeof story.nodes === "object" ? story.nodes : {};
const ids = Object.keys(nodes);

if (!story.meta || typeof story.meta.title !== "string" || !story.meta.title.trim()) {
  errors.push("meta.title phải là chuỗi khác rỗng");
}
if (!story.meta?.start) {
  errors.push("meta.start bị thiếu");
} else if (!nodes[story.meta.start]) {
  errors.push(`meta.start trỏ tới node không tồn tại: ${story.meta.start}`);
}
for (const key of STAT_KEYS) {
  if (typeof story.stats?.[key] !== "number") errors.push(`stats.${key} phải là số`);
}
if (!ids.length) errors.push("nodes đang rỗng");

// BFS từ start để tìm node không tới được.
const visited = new Set();
const queue = story.meta?.start && nodes[story.meta.start] ? [story.meta.start] : [];
while (queue.length) {
  const id = queue.shift();
  if (visited.has(id)) continue;
  visited.add(id);
  for (const choice of nodes[id].choices || []) {
    if (choice.next && nodes[choice.next] && !visited.has(choice.next)) queue.push(choice.next);
  }
}

const endings = [];

for (const [id, node] of Object.entries(nodes)) {
  const where = `nodes.${id}`;

  if (!Number.isInteger(node.level) || node.level < 1 || node.level > 7) {
    errors.push(`${where}.level phải là số nguyên 1..7`);
  }
  if (typeof node.title !== "string" || !node.title.trim()) errors.push(`${where}.title phải là chuỗi`);
  if (typeof node.text !== "string" || !node.text.trim()) errors.push(`${where}.text phải là chuỗi`);
  if (node.image != null && typeof node.image !== "string") errors.push(`${where}.image phải là chuỗi`);

  const choices = node.choices ?? [];
  if (!Array.isArray(choices)) errors.push(`${where}.choices phải là mảng`);

  if (node.ending) {
    const ending = node.ending;
    if (choices.length) errors.push(`${where}: node kết thúc không được có choices`);
    if (!ENDING_TYPES.includes(ending.type)) {
      errors.push(`${where}.ending.type phải là good|bad|neutral`);
    }
    if (!SOURCES.includes(ending.source)) {
      errors.push(`${where}.ending.source phải là video|extended`);
    }
    if (typeof ending.title !== "string" || !ending.title.trim()) {
      errors.push(`${where}.ending.title phải là chuỗi`);
    }
    if (typeof ending.summary !== "string" || !ending.summary.trim()) {
      errors.push(`${where}.ending.summary phải là chuỗi`);
    }
    endings.push({ id, level: node.level, ...ending });
  } else if (!choices.length) {
    errors.push(`${where}: node không phải ending nhưng không có lựa chọn nào`);
  }

  choices.forEach((choice, index) => {
    const at = `${where}.choices[${index}]`;
    if (typeof choice.label !== "string" || !choice.label.trim()) errors.push(`${at}.label phải là chuỗi`);
    if (!choice.next) {
      errors.push(`${at}.next bị thiếu`);
    } else if (!nodes[choice.next]) {
      errors.push(`${at}.next trỏ tới node không tồn tại: ${choice.next}`);
    }
    for (const [key, delta] of Object.entries(choice.effects || {})) {
      if (!STAT_KEYS.includes(key)) errors.push(`${at}.effects.${key} không phải chỉ số hợp lệ`);
      else if (typeof delta !== "number") errors.push(`${at}.effects.${key} phải là số`);
    }
    for (const [key, need] of Object.entries(choice.requires || {})) {
      if (!STAT_KEYS.includes(key)) errors.push(`${at}.requires.${key} không phải chỉ số hợp lệ`);
      else if (typeof need !== "number" || need < 0) errors.push(`${at}.requires.${key} phải là số >= 0`);
    }
  });

  if (!visited.has(id)) errors.push(`${where}: không tới được từ node start`);
}

if (!endings.length) errors.push("truyện phải có ít nhất một ending");

console.log(`\nKết (${endings.length}):`);
for (const ending of endings.sort((a, b) => a.level - b.level)) {
  console.log(`  - ${ending.id} [${ending.type}/${ending.source}] cấp ${ending.level} · ${ending.title}`);
}

if (errors.length) {
  console.error(`\n✗ story.json có ${errors.length} lỗi:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`\n✓ Hợp lệ: ${ids.length} node, ${endings.length} kết, mọi next đều tồn tại và tới được từ start.`);
