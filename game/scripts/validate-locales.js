// Bảo đảm mọi bản ngôn ngữ story.<lang>.json cùng cấu trúc với bản story.vi.json.
// Đổi ngôn ngữ giữa lúc chơi chỉ an toàn khi id node, lựa chọn, hiệu ứng và điều kiện giống hệt nhau.
// Dùng: node scripts/validate-locales.js [thư mục chứa story.*.json]
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";

const dir = process.argv[2] ? resolve(process.argv[2]) : new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const files = readdirSync(dir).filter((f) => /^story\.[a-z]{2}\.json$/.test(f)).sort();
const base = "story.vi.json";
const errors = [];

if (!files.includes(base)) {
  console.error(`✗ Thiếu ${base} trong ${dir}`);
  process.exit(1);
}

const load = (f) => JSON.parse(readFileSync(join(dir, f), "utf8"));
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const holders = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(",");
const ref = load(base);

for (const file of files.filter((f) => f !== base)) {
  const other = load(file);
  const at = (where, msg) => errors.push(`${file}: ${where} ${msg}`);

  for (const key of ["start", "showEffects", "statMax"]) {
    if (!same(ref.meta[key], other.meta[key])) at(`meta.${key}`, "khác bản vi");
  }
  if (!same(ref.stats, other.stats)) at("stats", "khác bản vi");
  const o = ref.meta.overload ?? {};
  const p = other.meta.overload ?? {};
  for (const key of ["stat", "at", "next"]) if (o[key] !== p[key]) at(`meta.overload.${key}`, "khác bản vi");
  if (ref.meta.levelNames?.length !== other.meta.levelNames?.length) at("meta.levelNames", "khác số lượng");
  if (!same(Object.keys(ref.meta.statLabels), Object.keys(other.meta.statLabels))) at("meta.statLabels", "khác danh sách chỉ số");

  const keys = (x) => JSON.stringify(Object.keys(x).sort());
  const walk = (a, b, path) => {
    if (typeof a === "string") {
      if (typeof b !== "string" || !b.trim()) at(path, "thiếu bản dịch");
      else if (holders(a) !== holders(b)) at(path, `placeholder lệch: ${holders(a)} và ${holders(b)}`);
    } else if (a && typeof a === "object") {
      if (!b || typeof b !== "object" || keys(a) !== keys(b)) return at(path, "khác danh sách khóa");
      for (const k of Object.keys(a)) walk(a[k], b[k], `${path}.${k}`);
    }
  };
  walk(ref.meta.ui, other.meta.ui, "meta.ui");

  if (!same(Object.keys(ref.nodes), Object.keys(other.nodes))) at("nodes", "khác danh sách id node");
  for (const [id, a] of Object.entries(ref.nodes)) {
    const b = other.nodes[id];
    if (!b) continue;
    const w = `nodes.${id}`;
    if (a.level !== b.level) at(w, "khác level");
    if (Boolean(a.fact) !== Boolean(b.fact)) at(w, "fact có ở bản này mà thiếu ở bản kia");
    for (const k of ["title", "text"]) if (!b[k]?.trim()) at(`${w}.${k}`, "thiếu bản dịch");
    if (Boolean(a.ending) !== Boolean(b.ending)) at(w, "khác trạng thái ending");
    if (a.ending && b.ending && (a.ending.type !== b.ending.type || a.ending.source !== b.ending.source)) at(`${w}.ending`, "khác type/source");
    if ((a.choices?.length ?? 0) !== (b.choices?.length ?? 0)) at(w, "khác số lượng lựa chọn");
    (a.choices ?? []).forEach((c, i) => {
      const d = b.choices?.[i];
      if (!d) return;
      const cw = `${w}.choices[${i}]`;
      if (c.next !== d.next) at(cw, "khác next");
      if (!same(c.effects, d.effects)) at(cw, "khác effects");
      if (!same(c.requires, d.requires)) at(cw, "khác requires");
      if (!d.label?.trim()) at(`${cw}.label`, "thiếu bản dịch");
    });
  }
  console.log(`  ${file}: so với ${base}`);
}

if (errors.length) {
  console.error(`\n✗ Các bản ngôn ngữ lệch nhau (${errors.length} lỗi):`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\n✓ ${files.length} bản ngôn ngữ cùng cấu trúc.`);
